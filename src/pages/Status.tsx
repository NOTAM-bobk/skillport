import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";

const COMPONENTS = [
  { name: "MCP endpoint", detail: "mcp.skillport.dev/sse", state: "Mocked" },
  { name: "Registry API", detail: "skills.search, skills.get", state: "Mocked" },
  { name: "Skill runs", detail: "Provider execution", state: "Not deployed" },
  { name: "Website", detail: "skillport.dev", state: "Operational" },
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
          No incidents recorded. The MCP endpoint and registry are not serving traffic yet, so there
          is nothing to page anyone about. Real monitoring will land with the server.
        </p>
        <p className="prose">
          Something looks wrong on the site? Report it through{" "}
          <Link to="/contact">contact</Link>.
        </p>
      </Section>
    </Page>
  );
}
