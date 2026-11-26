import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { REPO_URL } from "../lib/site";
import { usePageMeta } from "../lib/seo";

const PRINCIPLES = [
  {
    title: "One endpoint",
    body: "A workspace connects once. Adding a skill should never mean editing five client configs.",
  },
  {
    title: "Pinned, not floating",
    body: "Installs resolve to an immutable manifest, so an agent that worked yesterday still works today.",
  },
  {
    title: "Credentials stay put",
    body: "Provider keys belong to the workspace. Skills receive calls, not secrets.",
  },
];

export default function About() {
  usePageMeta({
    title: "About — skillport",
    description:
      "Why skillport exists: one MCP endpoint for API-backed agent skills, with pinned versions and workspace-scoped credentials.",
    path: "/about",
  });

  return (
    <Page>
      <PageHeader
        title="About skillport"
        lede="Agents are only as useful as the tools they can reach. Most teams wire those tools by hand, once per client, and rewrite the glue every time a model changes."
        meta="Preview build"
      />

      <div className="prose">
        <p>
          skillport puts a registry in front of those APIs. A skill is a packaged call: a manifest,
          typed inputs and a provider binding. The endpoint exposes four tools, and any MCP client
          can search, install and run what it finds.
        </p>
        <p>
          The frontend you are reading is live; the registry and the endpoint are mocked while the
          server is built. Skill names, counts and versions on this site are placeholders, not
          vendor claims.
        </p>
      </div>

      <Section title="What we hold to">
        <div className="principles">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Built in the open">
        <p className="prose">
          The site is a Vite and React frontend with hand-written CSS, deployable to Vercel or
          Cloudflare Workers. The source is on{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          , and questions go to <Link to="/contact">contact</Link>.
        </p>
      </Section>
    </Page>
  );
}
