import CodeBlock from "../components/CodeBlock";
import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";

const COMMANDS = [
  { command: "connect", detail: "Write the endpoint into a supported client config." },
  { command: "search <query>", detail: "Query the registry and print matching skills." },
  { command: "install <name>", detail: "Download a pinned skill into the current project." },
];

const OUTPUT = `$ npx @skillport/cli search pdf

anthropics/pdf   e4bb5d9   12 files
  Create, edit, fill and extract PDFs.
  SP-002 · 78k stars · Apache-2.0

1 skill found. Install with:
  npx @skillport/cli install pdf`;

export default function Cli() {
  usePageMeta({
    title: "CLI — skillport",
    description:
      "Install the skillport CLI to search the registry, pin a skill version and run it from a terminal.",
    path: "/cli",
  });

  return (
    <Page>
      <PageHeader
        title="CLI"
        lede="The same registry tools, without a client. Useful for CI and for pulling a pinned skill into a repo."
        meta="Preview: the package is not published to npm yet"
      />

      <div className="doc-layout">
        <div className="doc-main">
          <Section title="Install" id="install">
            <p>Run it through npx, or install it globally if you use it often.</p>
            <CodeBlock
              code={`npx @skillport/cli connect\nnpm install -g @skillport/cli`}
              title="shell"
            />
          </Section>

          <Section title="Commands" id="commands">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Command</th>
                    <th scope="col">What it does</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMANDS.map((row) => (
                    <tr key={row.command}>
                      <td>
                        <code>{row.command}</code>
                      </td>
                      <td>{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Example" id="example">
            <CodeBlock code={OUTPUT} title="terminal" />
            <p>
              Output names the port slot so you can find the same skill in the{" "}
              <Link to="/registry">registry</Link>.
            </p>
          </Section>
        </div>

        <aside className="doc-aside">
          <div className="panel">
            <h2>On this page</h2>
            <ul className="aside-list">
              <li>
                <a href="#install">Install</a>
              </li>
              <li>
                <a href="#commands">Commands</a>
              </li>
              <li>
                <a href="#example">Example</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
