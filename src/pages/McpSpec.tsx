import CodeBlock from "../components/CodeBlock";
import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { MCP_ENDPOINT } from "../lib/site";
import { usePageMeta } from "../lib/seo";

const HANDSHAKE = `POST /mcp
Content-Type: application/json
Accept: application/json, text/event-stream

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
  "name": "skills.install",
  "description": "Download every file of a pinned skill version.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "version": { "type": "string" },
      "files": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["name"]
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
              JSON-RPC 2.0 over streamable HTTP at <code>/mcp</code>: POST a message, get a JSON
              response (or a single-event SSE stream when the client asks for one). The legacy
              transport is still wired up at <code>/sse</code>, which announces
              <code>/messages</code> as its reply endpoint.
            </p>
            <CodeBlock code={HANDSHAKE} title="initialize" />
          </Section>

          <Section title="Authentication" id="auth">
            <p>
              None for reading. The endpoint accepts anonymous connections, so there is no key, no
              OAuth flow and no account to create before a client can search the registry or download
              a skill package. Publishing is a separate, token-protected HTTP API that the MCP server
              never exposes, which is what keeps the read surface keyless.
            </p>
          </Section>

          <Section title="Tool schemas" id="schemas">
            <p>
              Every tool publishes a JSON Schema, so clients can validate arguments before a call
              leaves the machine. Each call returns both readable text and the same payload as JSON.
            </p>
            <CodeBlock code={SCHEMA} title="tools/list" />
          </Section>

          <Section title="Versioning" id="versioning">
            <p>
              A version is the upstream git commit the files were copied from, so
              <code>skills.install</code> with a version either returns exactly those files or fails
              with <code>VERSION_NOT_FOUND</code>. Packages also carry a sha256, which makes an
              install verifiable after the fact.
            </p>
          </Section>

          <Section title="Limits" id="limits">
            <ul className="bullets">
              <li>Anonymous and unauthenticated; no account, key or token.</li>
              <li>Read-only: the three tools never mutate the registry.</li>
              <li>Search returns at most 25 results per call.</li>
              <li>Standard Cloudflare Workers limits apply to request size and CPU time.</li>
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
