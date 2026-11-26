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

**Vercel** — import the repo. `vercel.json` sets the framework, build command, output directory and SPA rewrites, so no dashboard configuration is needed.

```bash
npx vercel deploy --prod
```

**Cloudflare Workers (static assets)** — `wrangler.jsonc` serves `dist/` directly with SPA fallback.

```bash
npm run deploy:cf
```

Both targets need the SPA rewrite because pages are client-routed.

## Pages

| Path | Page |
| --- | --- |
| `/` | Hero, client wall, skill list, how it works |
| `/registry` | Full searchable skill registry |
| `/skills/:name` | Skill detail: install request, parameters, call |
| `/docs`, `/docs/mcp` | Setup guide and protocol details |
| `/cli`, `/publish` | CLI reference and publishing guide |
| `/about`, `/blog`, `/blog/:slug` | Company pages and posts |
| `/changelog`, `/status`, `/contact`, `/privacy` | Product and policy pages |

`src/lib/router.tsx` is a ~70-line history router: real `<a href>` links, in-place navigation, scroll handling. `src/lib/seo.ts` sets the title, description, canonical and Open Graph tags per route.

## SEO files

- `public/robots.txt` — allows crawling, points at the sitemap.
- `public/sitemap.xml` — every static route plus the twelve skill pages.
- `index.html` — site-level title, description, canonical, Open Graph, Twitter tags and JSON-LD.

## Structure

```
src/
  components/     Navbar, Hero, AIWall, Skills, Features, Footer, CodeBlock, Page, Icons
  data/skills.ts  mock skill catalog (descriptions, params, port slots)
  lib/            endpoint constants, router, per-route SEO
  pages/          one component per route
  styles.css      design tokens and layout
```

The endpoint lives in `src/lib/site.ts` (`MCP_ENDPOINT`) — update it once the real MCP server is available. `REPO_URL` points at this repository.
