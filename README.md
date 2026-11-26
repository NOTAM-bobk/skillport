# Skillport

![Skillport banner](https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:2563eb,100:38bdf8&height=190&section=header&text=Skillport&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Your%20skills.%20Your%20agents.%20One%20port.&descAlignY=62&descSize=18)

**Bring reusable Agent Skills to your AI coding workflow — through a CLI or an MCP server.**

[![GitHub stars](https://img.shields.io/github/stars/NOTAM-bobk/skillport?style=for-the-badge&logo=github&color=yellow)](https://github.com/NOTAM-bobk/skillport/stargazers) [![GitHub issues](https://img.shields.io/github/issues/NOTAM-bobk/skillport?style=for-the-badge&logo=github)](https://github.com/NOTAM-bobk/skillport/issues) [![Last commit](https://img.shields.io/github/last-commit/NOTAM-bobk/skillport?style=for-the-badge&logo=git)](https://github.com/NOTAM-bobk/skillport/commits)

[Quick start](#-quick-start) · [MCP setup](#-connect-with-mcp) · [Redeploy](#-redeploy) · [Licence](#-licence)

## ✨ What is Skillport?

Skillport helps you discover, install and use **Agent Skills**: add them from GitHub, a local folder or a ZIP archive, then use them through the CLI or an MCP-compatible client.

## 🌐 Domain

This project lives on **`mathclass.uk`**. Do not introduce a `skillport.dev`
domain: it is not owned, will not be bought, and currently answers 404. It must
never appear in canonical tags, `sitemap.xml`, `robots.txt`, `llms.txt`, docs or
social metadata.

- MCP host: `https://skillport.mcp.mathclass.uk` (`POST /mcp`, `GET /sse`)
- Spelling: `mathclass` with `ss`. `mathclaes.uk` has no DNS record.

## 📦 Quick start

Install [uv](https://docs.astral.sh/uv/) if it isn't already available, then:

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

- Endpoint: `https://skillport-mcp-t5vo4e-preview.freebuff.site/mcp`
- SSE: `https://skillport-mcp-t5vo4e-preview.freebuff.site/sse`
- Tools: `skills.search`, `skills.get`, `skills.install`

Public, read-only, no key or sign-in. The old `skillport.mcp.mathclass.uk` host sits behind Cloudflare's bot challenge and is no longer used — see [docs/mcp.md](docs/mcp.md).

## ♻️ Redeploy

```bash
npm install && npm run skills:sync && npm run mcp:deploy
```

Rebuilding the single-file deploy artifact and running the worker locally: see [docs/mcp.md](docs/mcp.md).

## 📄 Licence

See the [`LICENSE`](LICENSE) file.
