import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Extra hostnames allowed to reach the dev server, comma separated.
const allowedHosts = (process.env.VITE_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: allowedHosts.length > 0 ? { allowedHosts } : {},
  preview: allowedHosts.length > 0 ? { allowedHosts } : {},
  build: {
    outDir: "dist",
  },
});
