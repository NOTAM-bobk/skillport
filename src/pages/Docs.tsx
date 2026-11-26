import CodeBlock from "../components/CodeBlock";
import { Page, PageHeader, Section } from "../components/Page";
import { CLIENT_CONFIG, INSTALL_PROMPT, MCP_ENDPOINT } from "../lib/site";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";

const TOOLS = [
  { name: "skills.search", purpose: "Find skills by capability, category or repository.", returns: "Ranked manifests and the install call for each" },
  { name: "skills.get", purpose: "Resolve one skill to its pinned manifest.", returns: "Commit, licence, file hashes and SKILL.md" },
  { name: "skills.install", purpose: "Download every file of a pinned commit.", returns: "UTF-8 file contents with sha256" },
];

const RESPONSE = `{
  "name": "pdf",
  "version": "e4bb5d9",
  "commit": "e4bb5d9…",
  "license": "Apache-2.0",
  "packageSha256": "9f2c41…",
  "writeTo": "skills/pdf/",
  "files": [
    {
      "path": "SKILL.md",
      "bytes": 4021,
      "sha256": "1a7d09…",
      "text": "---\\nname: pdf\\ndescription: ..."
    }
  ]
}`;

const ERRORS = [
  { code: "SKILL_NOT_FOUND", meaning: "No skill with that name", fix: "Confirm the name with skills.search." },
  { code: "VERSION_NOT_FOUND", meaning: "That commit is not in the registry", fix: "Omit version or use the one on the skill page." },
  { code: "FILE_NOT_FOUND", meaning: "Requested file is not part of the skill", fix: "Drop the files filter to install the whole skill." },
  { code: "-32601", meaning: "Method not found", fix: "The endpoint implements initialize, tools/list and tools/call." },
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
              skillport speaks the Model Context Protocol over streamable HTTP, with a legacy SSE
              endpoint for older clients. Add it once; every skill in the registry is then reachable
              through the same connection.
            </p>
            <CodeBlock code={CLIENT_CONFIG} title="client config" />
            <p>
              Or hand the whole setup to the assistant: paste the prompt below into a client that
              can add a remote MCP server and it will connect, search the registry and install what
              your task needs.
            </p>
            <CodeBlock code={INSTALL_PROMPT} title="install prompt" label="Copy prompt" />
            <p>
              Restart the client and ask it to search the registry. The endpoint is{" "}
              <code>{MCP_ENDPOINT}</code>. If you would rather work from a terminal, the{" "}
              <Link to="/cli">CLI</Link> wraps the same tools.
            </p>
          </Section>

          <Section title="Tools" id="tools">
            <p>Three tools cover the whole lifecycle. Nothing else is exposed.</p>
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
              An install returns the pinned manifest plus the file contents themselves. The server
              never writes to your disk, so the client does — verbatim, into the path it names.
            </p>
            <CodeBlock code={RESPONSE} title="skills.install response" />
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
              Works with any client that speaks MCP: Claude Code, Claude Desktop, Cursor, VS Code,
              Zed, Windsurf and the OpenAI Agents SDK all connect the same way, keyless.
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
