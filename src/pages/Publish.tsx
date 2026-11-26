import CodeBlock from "../components/CodeBlock";
import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { REPO_URL } from "../lib/site";
import { usePageMeta } from "../lib/seo";

const MANIFEST = `name: skillport/web-search
version: 2.4.0
summary: Query the live web and get ranked results.
category: search
runtime: typescript
entry: ./src/index.ts
inputs:
  query:
    type: string
    required: true
  limit:
    type: number
    default: 8
provider:
  api: search.example.com
  auth: workspace`;

const CHECKLIST = [
  "A manifest with a semver version and one sentence summary.",
  "Inputs typed in the schema, with defaults for optional fields.",
  "A 20-line example call in the README.",
  "No secrets in the repository. Provider keys live in workspace settings.",
  "A timeout under 30 seconds, or a documented reason for more.",
];

export default function Publish() {
  usePageMeta({
    title: "Publish a skill — skillport",
    description:
      "How to package an API as a skillport MCP skill: manifest format, review checklist and release steps.",
    path: "/publish",
  });

  return (
    <Page>
      <PageHeader
        title="Publish a skill"
        lede="A skill is a small manifest, one entry point and a provider API. Reviews check that the contract is stable before it reaches the registry."
        meta="Preview: submissions are handled by hand for now"
      />

      <div className="doc-layout">
        <div className="doc-main">
          <Section title="Write the manifest" id="manifest">
            <p>
              The manifest describes what the skill does and what it accepts. The endpoint generates
              the tool schema from it, so agents see typed inputs instead of prose.
            </p>
            <CodeBlock code={MANIFEST} title="skill.yaml" />
          </Section>

          <Section title="Before you submit" id="checklist">
            <ul className="bullets">
              {CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Review and release" id="release">
            <p>
              Open a pull request against the registry repository. A reviewer runs the example call,
              checks the error paths and confirms that no credentials are baked into the package.
              Accepted skills get a port slot and are listed on the <Link to="/registry">registry</Link>{" "}
              page.
            </p>
            <p>
              <a className="button" href={REPO_URL} target="_blank" rel="noreferrer">
                Open the registry repository
              </a>
            </p>
          </Section>
        </div>

        <aside className="doc-aside">
          <div className="panel">
            <h2>On this page</h2>
            <ul className="aside-list">
              <li>
                <a href="#manifest">Manifest</a>
              </li>
              <li>
                <a href="#checklist">Checklist</a>
              </li>
              <li>
                <a href="#release">Review and release</a>
              </li>
            </ul>
          </div>
          <div className="panel">
            <h2>Related</h2>
            <ul className="aside-list">
              <li>
                <Link to="/docs">Documentation</Link>
              </li>
              <li>
                <Link to="/docs/mcp">Tool schemas</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
