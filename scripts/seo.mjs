#!/usr/bin/env node
/**
 * Writes the machine-readable surface of the site from the registry:
 *
 *   public/sitemap.xml    every page, plus every skill in skills/index.json
 *   public/llms.txt       short reference for AI assistants
 *   public/llms-full.txt  full reference: tools, every skill and its metadata
 *
 * scripts/sync-skills.mjs calls this right after it writes skills/index.json,
 * so URLs, counts and versions here cannot drift from the registry the site
 * renders. The files stay committed, so a deploy that skips the sync still
 * serves the last synced copy.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY = path.join(ROOT, "skills", "index.json");
const PUBLIC_DIR = path.join(ROOT, "public");

// Keep in step with src/lib/site.ts.
const SITE = "https://skillport.mathclass.uk";
const MCP_ENDPOINT = "https://skillport.mcp.mathclass.uk/mcp";
const MCP_SSE_ENDPOINT = "https://skillport.mcp.mathclass.uk/sse";
const REPO_URL = "https://github.com/NOTAM-bobk/skillport";

const MCP_REVISION = "2025-06-18";

/** Pages that exist as routes. Blog posts are listed with the page itself. */
const STATIC_ROUTES = [
  ["/", "1.0", "weekly"],
  ["/registry", "0.9", "daily"],
  ["/docs", "0.9", "weekly"],
  ["/docs/mcp", "0.7", "monthly"],
  ["/cli", "0.6", "monthly"],
  ["/publish", "0.7", "monthly"],
  ["/changelog", "0.5", "weekly"],
  ["/status", "0.4", "daily"],
  ["/about", "0.6", "monthly"],
  ["/blog", "0.6", "weekly"],
  ["/contact", "0.5", "yearly"],
  ["/privacy", "0.3", "yearly"],
  ["/blog/one-endpoint", "0.5", "monthly"],
  ["/blog/pinned-versions", "0.5", "monthly"],
  ["/blog/tool-schemas", "0.5", "monthly"],
];

const xmlEscape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slugOf = (skill) => skill.slug ?? skill.name;

function sitemapXml(skills, lastmod) {
  const url = (loc, priority, changefreq) =>
    `  <url><loc>${xmlEscape(SITE + loc)}</loc><lastmod>${lastmod}</lastmod>` +
    `<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(([loc, priority, freq]) => url(loc, priority, freq)).join("\n")}
${skills.map((skill) => url(`/skills/${slugOf(skill)}`, "0.7", "weekly")).join("\n")}
</urlset>
`;
}

function llmsTxt(skills, { files, repos, generated }) {
  return `# skillport

> skillport is a skill that finds skills: a remote Model Context Protocol (MCP) endpoint that lets an AI assistant search a registry of open-source agent skills, read each manifest and install the real files at a pinned commit. ${skills.length} skills, ${files} files, ${repos} source repositories. No API key, no OAuth, no account.

skillport is a public read service for agents. It does not generate skills; every entry is mirrored verbatim from an upstream GitHub repository, with a licence, a pinned commit, a sha256 per file and a package hash. An agent should call skills.search with a description of the task, skills.get to read the manifest, then skills.install with the returned version and verify the files it writes.

## Endpoint

- MCP (Streamable HTTP): ${MCP_ENDPOINT}
- MCP (legacy SSE): ${MCP_SSE_ENDPOINT}
- Auth: none. Public read, no key, no OAuth, no sign-in.
- MCP revision: ${MCP_REVISION}
- Transport: JSON-RPC 2.0 over HTTP POST

## Tools

- skills.search — find skills by capability, category, repository or free text. Arguments: query (string), category (Design | Security | Data | Software | Documentation), limit (1-25, default 8).
- skills.get — read one skill's manifest, licence, pinned commit and file hashes. Arguments: name, includeInstructions (boolean, default true).
- skills.install — return the real files for one skill at a pinned version. Arguments: name, version (commit prefix, optional), files (optional subset of paths).

## Docs

- [Documentation](${SITE}/docs): connecting a client, tool reference and troubleshooting.
- [MCP spec](${SITE}/docs/mcp): the JSON-RPC surface skillport exposes.
- [Registry](${SITE}/registry): every skill, filterable by category.
- [CLI](${SITE}/cli): the @skillport/cli helper.
- [Publish a skill](${SITE}/publish): how an upstream repository gets mirrored.
- [About](${SITE}/about): what skillport is and is not.
- [Full reference](${SITE}/llms-full.txt): this file plus every skill and its metadata.

## Skills

${skills
  .map(
    (skill) =>
      `- [${skill.owner}/${skill.name}](${SITE}/skills/${slugOf(skill)}): ${skill.long || skill.description}`,
  )
  .join("\n")}

## Optional

- [Changelog](${SITE}/changelog): registry and endpoint changes.
- [Status](${SITE}/status): endpoint availability.
- [GitHub](${REPO_URL}): source of the site and the MCP Worker.

Registry synced ${generated}.
`;
}

function llmsFullTxt(skills, { files, generated }) {
  return `# skillport — full reference for AI assistants

> skillport is a skill that finds skills: ${skills.length} open-source agent skills and ${files} files behind one MCP endpoint, installable in seconds without a key.

Site: ${SITE}
MCP endpoint: ${MCP_ENDPOINT}
Legacy SSE: ${MCP_SSE_ENDPOINT}
Auth: none (public read)
MCP revision: ${MCP_REVISION}
Registry synced: ${generated}
Source: ${REPO_URL}

## What an agent should do

1. Add ${MCP_ENDPOINT} as a remote MCP server.
2. Call skills.search with a one-line description of the task.
3. Call skills.get on the results that fit, to read SKILL.md and the metadata.
4. Call skills.install with the pinned version; write the returned files to disk.
5. Verify each file against the sha256 in the response. If nothing fits, say so instead of inventing a skill.

## Tools

### skills.search
Find skills by capability, category, repository or free text.
- query (string, required): what you want to do, e.g. "review a pull request".
- category (string, optional): Design | Security | Data | Software | Documentation.
- limit (integer, 1-25, default 8): results to return.

### skills.get
Read one skill's manifest.
- name (string, required): skill name, e.g. "pdf" or "anthropics/pdf".
- includeInstructions (boolean, default true): include the SKILL.md body.

### skills.install
Return the real files for one skill.
- name (string, required): skill name.
- version (string, optional): commit prefix from skills.get. Omit for the current registry copy.
- files (string[], optional): subset of file paths to return.

## Skills

${skills
  .map((skill) => {
    const slug = slugOf(skill);
    return `### ${skill.owner}/${skill.name}
- Page: ${SITE}/skills/${slug}
- Category: ${skill.category}
- Language: ${skill.language}
- Licence: ${skill.license}
- Version: ${skill.version} (commit ${skill.commit})
- Source: ${skill.repo}
- Files: ${skill.fileCount} (${skill.bytes} bytes), package sha256 ${skill.packageSha256}
- Summary: ${skill.long || skill.description}
- Use when: ${skill.description}`;
  })
  .join("\n\n")}

## Pages

- ${SITE}/ — overview
- ${SITE}/registry — all skills
- ${SITE}/docs — setup and tool reference
- ${SITE}/docs/mcp — JSON-RPC surface
- ${SITE}/cli — command line helper
- ${SITE}/publish — publishing a skill
- ${SITE}/about — background
- ${SITE}/changelog — changes
- ${SITE}/status — availability
- ${SITE}/llms.txt — short version of this file
`;
}

/** Reads the registry and rewrites the three files. Returns the totals it used. */
export async function writeSeoFiles() {
  const registry = JSON.parse(await readFile(REGISTRY, "utf8"));
  const skills = registry.skills ?? [];
  const totals = {
    skills: skills.length,
    files: skills.reduce((sum, skill) => sum + skill.fileCount, 0),
    repos: new Set(skills.map((skill) => skill.repo)).size,
    generated: registry.generated,
    lastmod: String(registry.generated).slice(0, 10),
  };

  await writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemapXml(skills, totals.lastmod));
  await writeFile(path.join(PUBLIC_DIR, "llms.txt"), llmsTxt(skills, totals));
  await writeFile(path.join(PUBLIC_DIR, "llms-full.txt"), llmsFullTxt(skills, totals));

  return { ...totals, urls: STATIC_ROUTES.length + skills.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const seo = await writeSeoFiles();
  console.log(
    `seo → public/sitemap.xml (${seo.urls} urls) + llms.txt + llms-full.txt (${seo.files} files, ${seo.repos} repos)`,
  );
}
