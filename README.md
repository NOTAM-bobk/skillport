# skillport

Frontend for an MCP server registry where agents search, download and run skills built on top of third-party APIs. The registry data and the live MCP endpoint are mocked for now.

Built with Vite, React and TypeScript. No UI framework — hand-written CSS.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # typecheck + static build into dist/
npm run preview   # serve the build locally
```

## Deploy

**Vercel** — import the repo. `vercel.json` sets the framework, build command and output directory, so no dashboard configuration is needed.

```bash
npx vercel deploy --prod
```

**Cloudflare Workers (static assets)** — `wrangler.jsonc` serves `dist/` directly with SPA fallback.

```bash
npm run deploy:cf
```

## Structure

```
src/
  components/   Navbar, Hero, Skills, Features, Footer, Icons
  data/skills.ts  mock skill catalog
  lib/site.ts     endpoint constant + clipboard helper
  styles.css      design tokens and layout
```

The endpoint lives in `src/lib/site.ts` (`MCP_ENDPOINT`) — update it once the real MCP server is available.
