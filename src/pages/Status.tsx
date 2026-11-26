import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";
import { SKILLS, SKILLS_GENERATED, SOURCE_REPOS } from "../data/skills";

const COMPONENTS = [
  { name: "MCP endpoint", detail: "skillport.mcp.base31.org/mcp", state: "Not deployed" },
  { name: "Registry API", detail: "skills.search, skills.get, skills.install", state: "Not deployed" },
  { name: "Skill mirror", detail: `${SKILLS.length} skills · ${SOURCE_REPOS.length} repos · synced ${SKILLS_GENERATED.slice(0, 10)}`, state: "Built" },
  { name: "Website", detail: "Vercel", state: "Operational" },
];

export default function Status() {
  usePageMeta({
    title: "Status — skillport",
    description: "Component status for the skillport endpoint, registry and website.",
    path: "/status",
  });

  return (
    <Page>
      <PageHeader
        title="Status"
        lede="Current state of each component. The preview build reports honest states rather than a green dashboard."
        meta="Last checked 26 November 2026"
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Scope</th>
              <th scope="col">State</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENTS.map((component) => (
              <tr key={component.name}>
                <td>{component.name}</td>
                <td className="mono">{component.detail}</td>
                <td>
                  <span className={component.state === "Operational" ? "state ok" : "state"}>{component.state}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Section title="Incidents">
        <p className="prose">
          No incidents recorded. The MCP server is built and tested locally; it starts serving when
          the Worker is deployed and this page will say so.
        </p>
        <p className="prose">
          Something looks wrong on the site? Report it through{" "}
          <Link to="/contact">contact</Link>.
        </p>
      </Section>
    </Page>
  );
}
