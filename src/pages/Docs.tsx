import CodeBlock from "../components/CodeBlock";
import { Page, PageHeader, Section } from "../components/Page";
import { CLIENT_CONFIG, MCP_ENDPOINT } from "../lib/site";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";

const TOOLS = [
  { name: "skills.search", purpose: "Find skills by capability, category or provider.", returns: "Ranked list of manifests" },
  { name: "skills.get", purpose: "Resolve one skill to a pinned manifest.", returns: "Manifest with versions" },
  { name: "skills.run", purpose: "Execute a skill against the provider API.", returns: "Structured output" },
  { name: "skills.publish", purpose: "Push a new skill version to the registry.", returns: "Review status" },
];

const RESPONSE = `{
  "skill": {
    "name": "skillport/web-search",
    "version": "v2.4.0",
    "slot": "SP-001",
    "inputs": { "query": "string", "limit": "number" }
  },
  "result": {
    "items": [
      { "title": "Model Context Protocol", "url": "https://modelcontextprotocol.io" }
    ],
    "took_ms": 412
  }
}`;

const ERRORS = [
  { code: "-32602", meaning: "Invalid params", fix: "Check the parameter table on the skill page." },
  { code: "-32601", meaning: "Unknown skill", fix: "Confirm the name with skills.search." },
  { code: "401", meaning: "Missing or expired token", fix: "Re-run the OAuth flow for the workspace." },
  { code: "429", meaning: "Rate limited", fix: "Back off, then retry. Limits are per workspace." },
];

export default function Docs() {
  usePageMeta({
    title: "Documentation — skillport",
    description:
      "Connect an MCP client to skillport, search the registry, install a pinned skill and run it. Includes tool reference, response shape and error codes.",
    path: "/docs",
  });

  return (
    <Page>
      <PageHeader
        title="Documentation"
        lede="Everything needed to put skillport behind an agent: connect the endpoint, find a skill, pin a version, run it."
        meta="Applies to registry revision 2025-06-18"
      />

      <div className="doc-layout">
        <div className="doc-main">
          <Section title="Get started" id="start">
            <p>
              skillport exposes the Model Context Protocol over SSE. Add the endpoint to your client
              once; every skill in the registry is then reachable through the same connection.
            </p>
            <CodeBlock code={CLIENT_CONFIG} title="client config" />
            <p>
              Restart the client and ask it to search the registry. The endpoint is{" "}
              <code>{MCP_ENDPOINT}</code>. If you would rather work from a terminal, the{" "}
              <Link to="/cli">CLI</Link> wraps the same tools.
            </p>
          </Section>

          <Section title="Tools" id="tools">
            <p>Four tools cover the whole lifecycle. Nothing else is exposed.</p>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Tool</th>
                    <th scope="col">What it does</th>
                    <th scope="col">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOLS.map((tool) => (
                    <tr key={tool.name}>
                      <td>
                        <code>{tool.name}</code>
                      </td>
                      <td>{tool.purpose}</td>
                      <td>{tool.returns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Response shape" id="response">
            <p>
              A run returns the resolved manifest plus the provider result. Token counts and timing
              come back alongside the payload so clients can budget context.
            </p>
            <CodeBlock code={RESPONSE} title="skills.run response" />
          </Section>

          <Section title="Errors" id="errors">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Meaning</th>
                    <th scope="col">What to do</th>
                  </tr>
                </thead>
                <tbody>
                  {ERRORS.map((error) => (
                    <tr key={error.code}>
                      <td className="mono">{error.code}</td>
                      <td>{error.meaning}</td>
                      <td>{error.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Clients" id="clients">
            <p>
              Tested against Claude Desktop, Claude Code, Cursor, VS Code, Zed, Windsurf, Copilot
              and the OpenAI Agents SDK. Any client that speaks MCP over SSE or streamable HTTP
              connects the same way.
            </p>
            <p>
              Next: read the <Link to="/docs/mcp">protocol details</Link> or publish your own skill.
            </p>
          </Section>
        </div>

        <aside className="doc-aside">
          <div className="panel">
            <h2>On this page</h2>
            <ul className="aside-list">
              <li>
                <a href="#start">Get started</a>
              </li>
              <li>
                <a href="#tools">Tools</a>
              </li>
              <li>
                <a href="#response">Response shape</a>
              </li>
              <li>
                <a href="#errors">Errors</a>
              </li>
              <li>
                <a href="#clients">Clients</a>
              </li>
            </ul>
          </div>
          <div className="panel">
            <h2>Reference</h2>
            <ul className="aside-list">
              <li>
                <Link to="/docs/mcp">Protocol details</Link>
              </li>
              <li>
                <Link to="/cli">CLI</Link>
              </li>
              <li>
                <Link to="/registry">Registry</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
