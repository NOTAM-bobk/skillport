# skillport

An MCP server and registry for Agent Skills. The skills are real: they are mirrored
verbatim from public GitHub repositories, pinned to the commit they were copied from,
and served as files by a Cloudflare Worker. The site reads the same index.

The site is deployed on Vercel. Only the MCP endpoint runs on Cloudflare, at
`https://skillport.mcp.mathclass.uk/mcp` (legacy SSE at `/sse`).

## Layout

```
skills/
  sources.json          hand-picked repos and skill paths to mirror
  files/<owner>__<name> verbatim copies of every skill file (generated)
  index.json            generated: metadata + file hashes (imported by the site)
mcp/
  src/index.ts          MCP Worker (streamable HTTP + legacy SSE), no auth
  src/skills.bundle.json generated: metadata + file contents (bundled into the Worker)
  wrangler.jsonc        worker name, compatibility date, custom domain route
scripts/sync-skills.mjs mirrors skills/ and writes both generated files
src/                    Vite + React site
```

The generated paths are gitignored: `npm run skills:sync` rebuilds them from
`skills/sources.json`, so nothing unverified is committed and the site and the MCP
server can never disagree.

## Registry data

```bash
npm run skills:sync   # re-mirror skills/ from GitHub and regenerate both indexes
```

The script copies each skill's text files, records the upstream commit, licence and a
sha256 per file plus a package hash, then writes `skills/index.json` and
`mcp/src/skills.bundle.json`. Editing `skills/sources.json` is the only way to change
what is in the registry. `npm run build` and `npm run dev` call it with `--ensure`, so
they only hit the network when the artifacts are missing.

Sources: `anthropics/skills` (Apache-2.0), `roerohan/skills` (MIT) and
`gohypergiant/agent-skills`. Every skill keeps its upstream licence, shown on its page
and returned by `skills.get`.

## MCP server

```bash
npm run mcp:dev        # wrangler dev on http://127.0.0.1:8787
npm run mcp:typecheck
npm run mcp:deploy     # skills:sync, then wrangler deploy
```

Tools — all read-only, all anonymous:

| Tool | Arguments | Returns |
| --- | --- | --- |
| `skills.search` | `query`, `category`, `limit` | Ranked manifests with the install call for each |
| `skills.get` | `name`, `includeInstructions` | Commit, licence, package hash, file hashes, SKILL.md |
| `skills.install` | `name`, `version`, `files` | Every file's contents, per-file sha256, `writeTo` path |

### Transports

- `POST /mcp` — streamable HTTP. JSON-RPC 2.0 in, JSON out, or a single-event SSE
  stream when the client only accepts `text/event-stream`.
- `GET /sse` — legacy HTTP+SSE. Announces `/messages?sessionId=…`, which accepts
  JSON-RPC posts and pushes the reply down the open stream.
- `GET /` and `GET /health` — plain JSON summary; `GET /skills` and `/skills/:name`
  return the same data over HTTP for debugging.

Sessions for the legacy transport live in Worker isolate memory; anything long-lived
should use `/mcp`.

Tested with `npx @modelcontextprotocol/inspector --cli http://127.0.0.1:8787/mcp
--transport http --method tools/list` and with `curl` against `initialize`,
`tools/list` and `tools/call`.

### Deploying

`mcp/wrangler.jsonc` attaches the custom domain route
`skillport.mcp.mathclass.uk`. Wrangler needs a Cloudflare API token with **Workers
Scripts: Edit** and **Zone: DNS: Edit** for `mathclass.uk`, and the zone has to be
active on Cloudflare (nameservers pointed at Cloudflare) before a custom domain can
attach.

## Site

```bash
npm install
npm run dev
npm run build      # typecheck + static build into dist/
npm run preview
```

**Vercel** — import the repo. `vercel.json` sets the framework, build command, output
directory and SPA rewrites, so no dashboard configuration is needed.

The static build into `dist/` also runs on Cloudflare Workers assets (`npm run
deploy:cf`), but production hosting for the site is Vercel.

Pages are client-routed, so both targets need the SPA rewrite.

| Path | Page |
| --- | --- |
| `/` | Hero, install prompt, client wall, skill list, how it works |
| `/registry` | Full searchable registry |
| `/skills/:name` | Skill detail: pinned commit, files with hashes, install call |
| `/docs`, `/docs/mcp` | Setup guide and protocol details |
| `/cli`, `/publish` | CLI reference and publishing guide |
| `/about`, `/blog`, `/blog/:slug` | Company pages and posts |
| `/changelog`, `/status`, `/contact`, `/privacy` | Product and policy pages |

`src/lib/router.tsx` is a ~70-line history router: real `<a href>` links, in-place
navigation, scroll handling. `src/lib/seo.ts` sets the title, description, canonical
and Open Graph tags per route.

## SEO files

- `public/robots.txt` — allows crawling, points at the sitemap.
- `public/sitemap.xml` — every static route plus the skill pages.
- `index.html` — site-level title, description, canonical, Open Graph, Twitter tags
  and JSON-LD.
