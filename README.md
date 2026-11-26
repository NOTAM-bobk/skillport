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

The public MCP endpoint is:

```text
https://skillport.mcp.mathclass.uk/mcp
```

It is a public, anonymous, read-only registry. No API key or account is required.
The Worker returns CORS headers so browser-based MCP clients can call it, but clients
should still validate the upstream licence and the returned SHA-256 hashes before
writing skill files into a project.

### Tools

| Tool | Arguments | Returns |
| --- | --- | --- |
| `skills.search` | `query`, `category`, `limit` | Ranked manifests with an install call for each |
| `skills.get` | `name`, `includeInstructions` | Commit, licence, package hash, file hashes, and optionally `SKILL.md` |
| `skills.install` | `name`, `version`, `files` | Every file's contents, per-file sha256, and suggested `writeTo` paths |

All tools are read-only. `skills.install` does not write to a local filesystem; it
returns a deterministic file manifest for the calling client to review and save.
Skill names are the registry names returned by `skills.search`. Use the exact name
rather than guessing a GitHub path.

### Minimal JSON-RPC walkthrough

Send JSON-RPC 2.0 requests as `POST` requests with `Content-Type: application/json`.
The `id` can be any JSON value; the examples use integers.

Initialize the MCP session:

```bash
curl -sS https://skillport.mcp.mathclass.uk/mcp \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
```

List the available tools:

```bash
curl -sS https://skillport.mcp.mathclass.uk/mcp \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

Search, inspect, and install a skill. The `arguments` object is nested inside the
MCP `tools/call` request:

```bash
# Search (limit is capped by the Worker)
curl -sS https://skillport.mcp.mathclass.uk/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"skills.search","arguments":{"query":"pdf","limit":5}}}'

# Get metadata and instructions for one exact name
curl -sS https://skillport.mcp.mathclass.uk/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"skills.get","arguments":{"name":"pdf","includeInstructions":true}}}'

# Return all installable files and their hashes
curl -sS https://skillport.mcp.mathclass.uk/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"skills.install","arguments":{"name":"pdf"}}}'
```

### Connecting an MCP client

For clients that accept a generic MCP server URL, add the URL above as a **Streamable
HTTP** server and leave authentication unset. For clients with JSON configuration,
the equivalent shape is typically:

```json
{
  "mcpServers": {
    "skillport": {
      "url": "https://skillport.mcp.mathclass.uk/mcp"
    }
  }
}
```

Some clients call this transport `http`, `streamable-http`, or `HTTP/SSE`. Prefer
Streamable HTTP at `/mcp`; do not append `/sse` unless the client only supports the
legacy transport. Client configuration formats vary, so keep the endpoint as a URL
rather than copying a local `command` or `args` example.

### Transports and HTTP behavior

- `POST /mcp` is the primary Streamable HTTP transport. It accepts JSON-RPC 2.0 and
  returns JSON, or a single-event SSE response when the client requests
  `text/event-stream`.
- `GET /sse` is the legacy HTTP+SSE transport. It announces a
  `/messages?sessionId=...` URL; post JSON-RPC messages to that URL and read replies
  from the open SSE stream. Legacy sessions live in Worker isolate memory, so use
  `/mcp` for normal clients and anything that needs a more robust connection.
- `GET /`, `GET /health`, `GET /skills`, and `GET /skills/:name` are lightweight
  debugging/read-only endpoints. `/health` reports the deployed registry count.
- `OPTIONS` is supported for CORS preflight. Only `GET`, `POST`, and `OPTIONS` are
  supported; other methods return HTTP 405 with an `Allow` header.
- CORS is open for the public read-only service. This does not make the endpoint a
  general proxy: it only exposes the documented registry and MCP operations.
- Anonymous requests are rate limited per IP in Worker memory. Limits can reset when
  an isolate is replaced, so clients should cache results, avoid tight retry loops,
  and respect `429` responses rather than treating them as permanent failures.

### Troubleshooting

- **404:** confirm the URL ends in `/mcp` (or use `/sse` only for a legacy SSE
  client). The Vercel site URL is not the MCP endpoint.
- **405:** use `POST` for JSON-RPC, `GET` for health/debug endpoints, and `OPTIONS`
  for browser preflight. The service intentionally rejects other methods.
- **415 or an empty response:** send `Content-Type: application/json` and a valid
  JSON-RPC body. Include `Accept: application/json, text/event-stream` when using a
  client that can consume either response format.
- **JSON-RPC `-32600`:** check that the body has `jsonrpc: "2.0"`, an `id`, a
  method, and an object-valued `params` field where required.
- **Unknown tool or skill:** call `tools/list` or `skills.search` first and use the
  exact returned name. Do not use a display title or source directory as a guess.
- **429:** slow down and retry with backoff. The limiter is intentionally anonymous
  and per-IP; repeated parallel installs are likely to hit it.
- **CORS errors in a browser:** ensure the browser sent its `OPTIONS` preflight and
  that the request targets `/mcp`, not a cached or redirected URL.

### Local development and deployment

```bash
npm run mcp:dev        # wrangler dev on http://127.0.0.1:8787
npm run mcp:typecheck
npm run mcp:deploy     # skills:sync, then wrangler deploy
```

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
