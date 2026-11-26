#!/usr/bin/env node
/**
 * Mirrors the skills listed in skills/sources.json from their public GitHub
 * repositories into skills/files/, then writes two build artifacts:
 *
 *   skills/index.json          metadata + file hashes, imported by the site
 *   mcp/src/skills.bundle.json metadata + file contents, bundled into the Worker
 *
 * The registry has no other source of truth: the site and the MCP server both
 * read what this script writes.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const FILES_DIR = path.join(SKILLS_DIR, "files");

const SKIP_EXT = new Set([
  ".ttf", ".otf", ".woff", ".woff2", ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".zip", ".gz", ".pdf", ".mp4", ".mov", ".mp3", ".ico", ".so", ".dylib", ".exe",
]);
const MAX_FILE_BYTES = 200_000;

const LANG = {
  ".md": { label: "Markdown", color: "#8a8479" },
  ".py": { label: "Python", color: "#3572a5" },
  ".ts": { label: "TypeScript", color: "#3b82f6" },
  ".tsx": { label: "TypeScript", color: "#3b82f6" },
  ".js": { label: "JavaScript", color: "#f1e05a" },
  ".mjs": { label: "JavaScript", color: "#f1e05a" },
  ".sh": { label: "Shell", color: "#89e051" },
  ".html": { label: "HTML", color: "#e34c26" },
  ".json": { label: "JSON", color: "#8a8479" },
  ".css": { label: "CSS", color: "#563d7c" },
  ".go": { label: "Go", color: "#00add8" },
  ".rs": { label: "Rust", color: "#dea584" },
};

const GH = "https://api.github.com";
const headers = { "User-Agent": "skillport-registry", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function gh(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}: ${await res.text()}`);
  return res.json();
}

async function raw(repo, sha, filePath) {
  const url = `https://raw.githubusercontent.com/${repo}/${sha}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`raw ${res.status} for ${url}`);
  return res.text();
}

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

/** Minimal YAML front matter reader for SKILL.md (scalars, folded and literal blocks). */
function frontMatter(markdown) {
  if (!markdown.startsWith("---\n")) return { data: {}, body: markdown };
  const end = markdown.indexOf("\n---", 4);
  if (end === -1) return { data: {}, body: markdown };
  const block = markdown.slice(4, end).split("\n");
  const body = markdown.slice(end + 4).replace(/^\s*\n/, "");
  const data = {};
  for (let i = 0; i < block.length; i++) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(block[i]);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (rawValue === ">" || rawValue === "|" || rawValue === ">-" || rawValue === "|-") {
      const lines = [];
      while (i + 1 < block.length && (/^\s{2,}/.test(block[i + 1]) || block[i + 1].trim() === "")) {
        lines.push(block[++i].trim());
      }
      data[key] = (rawValue.startsWith(">") ? lines.join(" ") : lines.join("\n")).trim();
    } else {
      data[key] = rawValue.replace(/^["'](.*)["']$/, "$1").trim();
    }
  }
  return { data, body };
}

function firstParagraph(body) {
  const lines = body.split("\n");
  const buffer = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (buffer.length) break;
      continue;
    }
    if (trimmed.startsWith("#") || trimmed.startsWith("|") || trimmed.startsWith("```")) {
      if (buffer.length) break;
      continue;
    }
    buffer.push(trimmed.replace(/^[-*]\s+/, ""));
  }
  const text = buffer.join(" ").replace(/\s+/g, " ").trim();
  return text.length > 320 ? `${text.slice(0, 317)}…` : text;
}

/** Falls back to the skill's own LICENSE file when GitHub reports no repo licence. */
function detectLicense(repoLicense, files) {
  if (repoLicense && repoLicense !== "NOASSERTION") return repoLicense;
  const licenseFile = files.find((file) => /^LICENSE(\.txt|\.md)?$/i.test(file.path));
  if (!licenseFile) return "NOASSERTION";
  const text = licenseFile.text;
  if (/Apache License/i.test(text)) return "Apache-2.0";
  if (/MIT License|Permission is hereby granted, free of charge/i.test(text)) return "MIT";
  if (/BSD 3-Clause|Redistribution and use in source and binary forms/i.test(text)) return "BSD-3-Clause";
  return "See upstream";
}

function primaryLanguage(files) {
  const counts = new Map();
  for (const file of files) {
    const ext = path.extname(file.path).toLowerCase();
    const lang = LANG[ext];
    if (!lang || ext === ".md") continue;
    counts.set(lang.label, (counts.get(lang.label) ?? 0) + 1);
  }
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return best ? LANG[Object.keys(LANG).find((k) => LANG[k].label === best[0])] : LANG[".md"];
}

const sources = JSON.parse(await readFile(path.join(SKILLS_DIR, "sources.json"), "utf8"));

// --ensure: no-op when the generated index already exists, so `npm run build`
// can call this unconditionally without hitting the network on every build.
if (process.argv.includes("--ensure")) {
  const { access, constants } = await import("node:fs/promises");
  const ready = await access(path.join(SKILLS_DIR, "index.json"), constants.R_OK).then(
    () => true,
    () => false,
  );
  if (ready) {
    console.log("skills: index already present, skipping sync");
    process.exit(0);
  }
}

await rm(FILES_DIR, { recursive: true, force: true });

const index = [];
const bundle = [];

for (const source of sources.repos) {
  const repo = await gh(`${GH}/repos/${source.repo}`);
  const stars = repo.stargazers_count;
  const repoLicense = repo.license?.spdx_id ?? "NOASSERTION";
  const branch = repo.default_branch;
  const commit = source.commit ?? (await gh(`${GH}/repos/${source.repo}/commits/${branch}`)).sha;
  const tree = await gh(`${GH}/repos/${source.repo}/git/trees/${commit}?recursive=1`);
  const version = commit.slice(0, 7);

  for (const entry of source.skills) {
    const prefix = `${entry.path.replace(/\/$/, "")}/`;
    const blobs = tree.tree
      .filter((node) => node.type === "blob" && node.path.startsWith(prefix))
      .filter((node) => !SKIP_EXT.has(path.extname(node.path).toLowerCase()))
      .filter((node) => node.size <= MAX_FILE_BYTES)
      .sort((a, b) => a.path.localeCompare(b.path));

    const skillMdPath = blobs.find((node) => node.path === `${prefix}SKILL.md`)?.path;
    if (!skillMdPath) throw new Error(`no SKILL.md under ${source.repo}/${entry.path}`);

    const slug = entry.path.split("/").filter(Boolean).pop();
    const target = path.join(FILES_DIR, `${repo.owner.login}__${slug}`);
    const files = [];
    let skillMd = "";
    let meta = {};

    for (const blob of blobs) {
      const text = await raw(source.repo, commit, blob.path);
      const relative = blob.path.slice(prefix.length);
      const dest = path.join(target, relative);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, text);
      files.push({ path: relative, bytes: Buffer.byteLength(text), sha256: sha256(text), text });
      if (blob.path === skillMdPath) {
        skillMd = text;
        meta = frontMatter(text).data;
      }
    }

    const packageSha256 = sha256(files.map((f) => `${f.path}\0${f.sha256}`).join("\n"));
    const license = source.license ?? detectLicense(repoLicense, files);
    const lang = primaryLanguage(files);
    const body = frontMatter(skillMd).body;
    const description = (meta.description ?? firstParagraph(body)).replace(/\s+/g, " ").trim();
    const name = (meta.name ?? slug).toLowerCase();

    const metaOnly = {
      name,
      slug,
      owner: repo.owner.login,
      repo: source.repo,
      repoUrl: repo.html_url,
      license,
      licenseUrl: `${repo.html_url}/blob/${version}/${entry.path}/SKILL.md`,
      sourcePath: entry.path,
      commit,
      version,
      category: entry.category,
      language: lang.label,
      color: lang.color,
      stars,
      description,
      long: firstParagraph(body) || description,
      fileCount: files.length,
      bytes: files.reduce((sum, f) => sum + f.bytes, 0),
      packageSha256,
      files: files.map(({ path: filePath, bytes, sha256: hash }) => ({ path: filePath, bytes, sha256: hash })),
    };

    index.push(metaOnly);
    bundle.push({ ...metaOnly, skillMd, files });
    console.log(`  ${name.padEnd(32)} ${String(files.length).padStart(2)} files  ${String(Math.round(metaOnly.bytes / 1024)).padStart(4)} KB  ${source.repo}@${version}`);
  }
}

index.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const generated = new Date().toISOString();
await writeFile(
  path.join(SKILLS_DIR, "index.json"),
  `${JSON.stringify({ generated, count: index.length, skills: index }, null, 2)}\n`,
);
await mkdir(path.join(ROOT, "mcp", "src"), { recursive: true });
await writeFile(
  path.join(ROOT, "mcp", "src", "skills.bundle.json"),
  `${JSON.stringify({ generated, count: bundle.length, skills: bundle })}\n`,
);

const bytes = bundle.reduce((sum, s) => sum + s.files.reduce((n, f) => n + f.bytes, 0), 0);
console.log(`\n${index.length} skills → skills/index.json + mcp/src/skills.bundle.json (${Math.round(bytes / 1024)} KB of files)`);
