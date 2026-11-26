import index from "../../skills/index.json";

export type Category = "Docs" | "Dev" | "Web" | "Media" | "Data";

export type SkillFile = {
  path: string;
  bytes: number;
  sha256: string;
};

/**
 * One mirrored skill. The data comes from skills/index.json, which
 * `npm run skills:sync` generates from the real files in skills/files/ — the
 * same files the MCP Worker serves from its bundle.
 */
export type Skill = {
  owner: string;
  name: string;
  repo: string;
  repoUrl: string;
  license: string;
  sourcePath: string;
  commit: string;
  version: string;
  category: Category;
  language: string;
  color: string;
  stars: number;
  description: string;
  long: string;
  fileCount: number;
  bytes: number;
  packageSha256: string;
  files: SkillFile[];
};

const INDEX = index as unknown as { generated: string; count: number; skills: Skill[] };

export const SKILLS: Skill[] = INDEX.skills;
export const SKILLS_GENERATED = INDEX.generated;
export const SOURCE_REPOS = [...new Set(SKILLS.map((skill) => skill.repo))];

export const CATEGORIES = ["All", "Docs", "Dev", "Web", "Media", "Data"] as const;

/** Stable manifest slot shown throughout the interface, e.g. SP-003. */
export function portCode(position: number): string {
  return `SP-${String(position + 1).padStart(3, "0")}`;
}

export function findSkill(slug: string): { skill: Skill; index: number } | null {
  const wanted = slug.toLowerCase();
  const index = SKILLS.findIndex(
    (skill) => skill.name === wanted || `${skill.owner}/${skill.name}` === wanted,
  );
  if (index === -1) return null;
  return { skill: SKILLS[index], index };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatStars(stars: number): string {
  if (stars < 1000) return String(stars);
  return `${(stars / 1000).toFixed(stars < 10_000 ? 1 : 0)}k`;
}
