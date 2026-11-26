import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Extra hostnames allowed to reach the dev server, comma separated.
const allowedHosts = (process.env.VITE_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

type Registry = {
  skills: Array<{ fileCount: number }>;
};

const REGISTRY = fileURLToPath(new URL("./skills/index.json", import.meta.url));

/**
 * Fills the registry counts in index.html at dev and build time, so the copy in
 * the document head can never disagree with the skills the page renders. Read on
 * every transform, so a registry sync is picked up without a restart.
 */
function registryStats(): Plugin {
  return {
    name: "skillport:registry-stats",
    transformIndexHtml(html) {
      const registry = JSON.parse(readFileSync(REGISTRY, "utf8")) as Registry;
      const skills = registry.skills.length;
      const files = registry.skills.reduce((sum, skill) => sum + skill.fileCount, 0);

      return html
        .replaceAll("%SKILL_COUNT%", String(skills))
        .replaceAll("%FILE_COUNT%", String(files));
    },
  };
}

export default defineConfig({
  plugins: [react(), registryStats()],
  server: allowedHosts.length > 0 ? { allowedHosts } : {},
  preview: allowedHosts.length > 0 ? { allowedHosts } : {},
  build: {
    outDir: "dist",
  },
});
