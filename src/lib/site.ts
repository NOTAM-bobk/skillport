export const MCP_ENDPOINT = "https://skillport.mcp.mathclass.uk/mcp";
export const MCP_SSE_ENDPOINT = "https://skillport.mcp.mathclass.uk/sse";
export const SITE_URL = "https://skillport.dev";
export const REPO_URL = "https://github.com/NOTAM-bobk/skillport";
export const CONTACT_EMAIL = "hello@skillport.dev";

export const CLIENT_CONFIG = `{
  "mcpServers": {
    "skillport": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`;

export const INSTALL_PROMPT = `You have access to a remote MCP server called skillport.

Endpoint:  ${MCP_ENDPOINT}
Legacy SSE: ${MCP_SSE_ENDPOINT}
Auth:      none - connect directly, no key, no sign-in.

Before you start my task:
1. Add skillport as an MCP server with the endpoint above,
   then list its tools.
2. Call skills.search with a one-line description of the
   task below.
3. For each skill that fits, call skills.get to read its
   manifest, then skills.install with the pinned version
   to download it into this workspace.
4. Use installed skills instead of writing your own version
   of the same capability. If two skills overlap, keep the
   better-rated one and say why.
5. If nothing in the registry fits, say so in one line and
   carry on without inventing a skill.

Then do the task, and finish with: the skills you installed,
the version you pinned, and anything you had to do without
a skill.

Task: <describe what you want to do here>`;

/** Copies text, falling back to a hidden textarea on insecure origins. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export const ISSUES_URL = `${REPO_URL}/issues/new?title=%5BBug%5D+&labels=bug`;
