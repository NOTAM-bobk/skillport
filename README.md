# Skillport

![Skillport banner](https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:2563eb,100:38bdf8&height=190&section=header&text=Skillport&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Your%20skills.%20Your%20agents.%20One%20port.&descAlignY=62&descSize=18)

**Bring reusable Agent Skills to your AI coding workflow — through a CLI or an MCP server.**

[![GitHub stars](https://img.shields.io/github/stars/NOTAM-bobk/skillport?style=for-the-badge&logo=github&color=yellow)](https://github.com/NOTAM-bobk/skillport/stargazers)

[Quick start](#-quick-start) · [MCP](#-connect-with-mcp) · [Deploy](#-deploy) · [Licence](#-licence)

## ✨ What is Skillport?

Discover, install and use **Agent Skills**: add them from GitHub, a local folder or a ZIP archive, then use them through the CLI or an MCP-compatible client.

## 🌐 Domain

This project lives on **`mathclass.uk`**. Do not introduce a `skillport.dev` domain: it is not owned, will not be bought and answers 404, so it must never appear in canonicals, `sitemap.xml`, `robots.txt`, `llms.txt` or social metadata. Spelling: `mathclass` with `ss`.

## 📦 Quick start

```bash
uvx skillport init
uvx skillport add anthropics/skills skills   # or ./my-skills, or ./skills.zip
uvx skillport list
uvx skillport update --all
uvx skillport remove <skill-id>
```

## 🔌 Connect with MCP

```json
{ "mcpServers": { "skillport": { "url": "https://skillport-mcp-t5vo4e-preview.freebuff.site/mcp" } } }
```

Endpoint `https://skillport-mcp-t5vo4e-preview.freebuff.site/mcp` · SSE `/sse` · health `/health` · tools `skills.search`, `skills.get`, `skills.install`. Public, read-only, no key.

**The MCP host is temporarily not `skillport.mcp.mathclass.uk`.** That host answers every non-browser request with Cloudflare's "Just a moment…" challenge (403, `cf-mitigated: challenge`), which MCP clients cannot solve, and free-plan Bot Fight Mode cannot be skipped with a WAF or Page rule. Turn it off under **Security → Bots**, then point `MCP_ENDPOINT` / `MCP_SSE_ENDPOINT` in `src/lib/site.ts` back at the domain.

## ♻️ Deploy

```bash
npm install
npm run skills:sync && npm run mcp:deploy   # wrangler deploy
npm run mcp:dev                             # local: :8787/health
npx esbuild mcp/src/index.ts --bundle --format=esm --platform=neutral \
  --target=es2022 --minify --keep-names --outfile=mcp/deploy-index.js
```

## 📄 Licence

See the [`LICENSE`](LICENSE) file.
