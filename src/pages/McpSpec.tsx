import CodeBlock from "../components/CodeBlock";
import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { MCP_ENDPOINT } from "../lib/site";
import { usePageMeta } from "../lib/seo";

const HANDSHAKE = `POST /messages
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "clientInfo": { "name": "cursor", "version": "0.48.0" }
  }
}`;

const SCHEMA = `{
  "name": "skills.search",
  "description": "Search the skill registry by capability or provider.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "category": { "enum": ["search", "data", "web", "media", "dev", "docs"] },
      "limit": { "type": "integer", "minimum": 1, "maximum": 20 }
    },
    "required": ["query"]
  }
}`;

export default function McpSpec() {
  usePageMeta({
    title: "MCP protocol details — skillport",
    description:
      "Transport, authentication, tool schemas, versioning and rate limits for the skillport Model Context Protocol endpoint.",
    path: "/docs/mcp",
  });

  return (
    <Page>
      <PageHeader
        title="MCP protocol details"
        lede="How the endpoint behaves on the wire: transport, auth, tool schemas and limits."
        meta={MCP_ENDPOINT}
      />

      <div className="doc-layout">
        <div className="doc-main">
          <Section title="Transport" id="transport">
            <p>
              The endpoint keeps a server-sent event stream open for responses and accepts client
              messages as JSON-RPC 2.0 POSTs. Streamable HTTP is available at <code>/mcp</code> for
              clients that prefer it.
            </p>
            <CodeBlock code={HANDSHAKE} title="initialize" />
          </Section>

          <Section title="Authentication" id="auth">
            <p>
              Workspaces authenticate with OAuth 2.1. Clients discover the authorization server from
              the protected resource metadata document, then present a bearer token on every request.
              Tokens are scoped to one workspace; skills never see provider credentials directly.
            </p>
          </Section>

          <Section title="Tool schemas" id="schemas">
            <p>
              Every tool publishes a JSON Schema, so clients can validate arguments before a call
              leaves the machine. Skill inputs are folded into <code>skills.run</code> at call time.
            </p>
            <CodeBlock code={SCHEMA} title="tools/list" />
          </Section>

          <Section title="Versioning" id="versioning">
            <p>
              Skills are immutable once published. A version resolves to a manifest hash, so a
              pinned install keeps the same inputs and outputs until the caller opts into a new
              version. The registry revision (<code>2025-06-18</code>) tracks the MCP spec, not
              individual skills.
            </p>
          </Section>

          <Section title="Limits" id="limits">
            <ul className="bullets">
              <li>120 requests per minute per workspace, burst of 30.</li>
              <li>1 MB maximum request body; large payloads belong in a provider upload.</li>
              <li>Default run timeout of 30 seconds, 120 seconds for media skills.</li>
              <li>Search returns at most 20 results per call.</li>
            </ul>
            <p>
              Those limits apply to the preview build and will be re-tuned before general
              availability. See <Link to="/contact">contact</Link> for anything that needs a higher
              ceiling.
            </p>
          </Section>
        </div>

        <aside className="doc-aside">
          <div className="panel">
            <h2>On this page</h2>
            <ul className="aside-list">
              <li>
                <a href="#transport">Transport</a>
              </li>
              <li>
                <a href="#auth">Authentication</a>
              </li>
              <li>
                <a href="#schemas">Tool schemas</a>
              </li>
              <li>
                <a href="#versioning">Versioning</a>
              </li>
              <li>
                <a href="#limits">Limits</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
