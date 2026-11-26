# Skillport

![Skillport banner](https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:2563eb,100:38bdf8&height=190&section=header&text=Skillport&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Your%20skills.%20Your%20agents.%20One%20port.&descAlignY=62&descSize=18)

**Bring reusable Agent Skills to your AI coding workflow — through a CLI or an MCP server.**

[![GitHub stars](https://img.shields.io/github/stars/NOTAM-bobk/skillport?style=for-the-badge&logo=github&color=yellow)](https://github.com/NOTAM-bobk/skillport/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/NOTAM-bobk/skillport?style=for-the-badge&logo=github)](https://github.com/NOTAM-bobk/skillport/issues)
[![Last commit](https://img.shields.io/github/last-commit/NOTAM-bobk/skillport?style=for-the-badge&logo=git)](https://github.com/NOTAM-bobk/skillport/commits)

[Features](#-features) · [Quick start](#-quick-start) · [MCP setup](#-connect-with-mcp) · [Manage skills](#-manage-skills) · [Redeploy](#-run-or-redeploy) · [Credits](#-credits)

---

## ✨ What is Skillport?

Skillport helps you discover, install, and use **Agent Skills** in your AI-assisted development workflow. Add skills from GitHub, local folders, or ZIP files, then use them through the CLI or an MCP-compatible client.

| Need | Skillport helps with |
|---|---|
| Add a skill to a project | Install from a GitHub repository, local path, or ZIP archive |
| Work across AI clients | Use the CLI or connect an MCP-compatible client |
| Keep skills organized | List, update, and remove installed skills |
| Find the right instruction quickly | Make skills available to your coding agent |

## 🚀 Features

- **CLI workflow** — add, list, update, and remove skills from your terminal.
- **MCP support** — make your skills available to MCP-compatible clients.
- **Flexible sources** — install skills from GitHub, local directories, and ZIP files.
- **Update-aware management** — update skills from their original sources.
- **Agent-friendly discovery** — keep skills where your coding assistant can use them.

## 📦 Quick start

Install [uv](https://docs.astral.sh/uv/) if it isn't already available, then run Skillport with `uvx`:

```bash
# Initialize Skillport in your project
uvx skillport init

# Add a skill from a GitHub repository
uvx skillport add anthropics/skills skills

# Or add from a local directory or ZIP archive
uvx skillport add ./my-skills
uvx skillport add ./skills.zip

# See installed skills
uvx skillport list
```

Replace `anthropics/skills skills` with the repository and skill path you want. Run `uvx skillport --help` for command options.

## 🧠 Manage skills

```bash
# Add a skill
uvx skillport add <source>

# List installed skills
uvx skillport list

# Update all tracked skills, or one skill
uvx skillport update --all
uvx skillport update <skill-id>

# Remove a skill
uvx skillport remove <skill-id>
```

Supported source examples:

```bash
uvx skillport add <github-repo-or-url>
uvx skillport add ./path/to/skills
uvx skillport add ./skills.zip
```

Use `uvx skillport add --help` to see supported source formats and options.

## 🔌 Connect with MCP

Add a server entry to your MCP client's configuration:

```json
{
  "mcpServers": {
    "skillport": {
      "command": "uvx",
      "args": ["skillport-mcp"],
      "env": {
        "SKILLPORT_SKILLS_DIR": "~/.skillport/skills"
      }
    }
  }
}
```

Set `SKILLPORT_SKILLS_DIR` to the directory containing your skills. Restart or reload the MCP client after changing its configuration.

### MCP connection details

This configuration starts Skillport locally over **stdio**. It is not a hosted HTTP service, so there is **no public MCP URL** to paste into a remote client.

- **Repository/source URL:** <https://github.com/NOTAM-bobk/skillport>
- **Local MCP launch command:** `uvx skillport-mcp`
- **Transport:** stdio
- **Skills directory:** set with `SKILLPORT_SKILLS_DIR`

For remote access, deploy the MCP server using a transport and environment supported by your MCP client, then configure the endpoint provided by that deployment. The GitHub repository URL is not an MCP endpoint.

## ♻️ Run or redeploy

### Run locally

Start the MCP server with your preferred skills directory:

```bash
SKILLPORT_SKILLS_DIR="$HOME/.skillport/skills" uvx skillport-mcp
```

Or point it at a project-local directory:

```bash
SKILLPORT_SKILLS_DIR=".skills" uvx skillport-mcp
```

### Redeploy or refresh

The local stdio server is started by the MCP client, not deployed as a hosted service. To pick up changed skills or configuration, restart or reload the client so it starts a fresh Skillport process.

If you host Skillport yourself, redeploy it using your hosting platform's normal workflow, then update the MCP client configuration with the endpoint and transport details provided by that deployment. No hosted endpoint is included here.

## 🛠️ Configuration

| Setting | Purpose | Example |
|---|---|---|
| `SKILLPORT_SKILLS_DIR` | Directory containing installed skills | `~/.skillport/skills` |

Run `uvx skillport --help` and `uvx skillport-mcp --help` for options available in your installed version.

## 🖼️ Project links

[![Open the Skillport repository](https://img.shields.io/badge/GitHub-NOTAM--bobk%2Fskillport-181717?style=for-the-badge&logo=github)](https://github.com/NOTAM-bobk/skillport)

Issues and pull requests are welcome. When reporting a bug, include steps to reproduce it and the behavior you expected.

## 🙌 Credits

- **[gotalab/skillport](https://github.com/gotalab/skillport)** — upstream Skillport project and inspiration for the CLI/MCP workflow.
- **[Agent Skills](https://agentskills.io/)** — the open format and ecosystem for reusable agent instructions.
- **[Anthropic Skills](https://github.com/anthropics/skills)** — example skills and a source for getting started.
- **[Shields.io](https://shields.io/)** and **[Capsule Render](https://github.com/kyechan99/capsule-render)** — README badges and banner artwork.

## 📄 License

See the [`LICENSE`](LICENSE) file for the license that applies to this repository.

---

**Build once. Reuse everywhere.**

⭐ If Skillport is useful to you, consider starring the repository.
