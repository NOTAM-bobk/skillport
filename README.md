# Skillport

![Skillport banner](https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:2563eb,100:38bdf8&height=190&section=header&text=Skillport&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Your%20skills.%20Your%20agents.%20One%20port.&descAlignY=62&descSize=18)

**Bring reusable Agent Skills to your AI coding workflow — through a CLI or an MCP server.**

[![GitHub stars](https://img.shields.io/github/stars/NOTAM-bobk/skillport?style=for-the-badge&logo=github&color=yellow)](https://github.com/NOTAM-bobk/skillport/stargazers)

[Quick start](#-quick-start) · [MCP](#-connect-with-mcp) · [Deploy](#-deploy) · [Licence](#-licence)

## ✨ What is Skillport?

Discover, install and use **Agent Skills**: add them from GitHub, a local folder or a ZIP archive, then use them through the CLI or an MCP-compatible client.

## 📦 Quick start

Install [uv](https://docs.astral.sh/uv/) if needed, then:

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

**Not on mathclass.uk any more.** `mcp/wrangler.jsonc` still routes the Worker there, but that zone answers non-browser requests with Cloudflare's "Just a moment…" challenge (403, `cf-mitigated: challenge`), which MCP clients cannot solve; free-plan Bot Fight Mode cannot be skipped with a WAF or Page rule, so turn it off under **Security → Bots**. Until then it runs on the Freebuff Sites deployment above — point `MCP_ENDPOINT` / `MCP_SSE_ENDPOINT` back at the domain once that is fixed.

The separate [`skillport-mcp`](https://pypi.org/project/skillport-mcp/) package serves skills from your disk over stdio.

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
