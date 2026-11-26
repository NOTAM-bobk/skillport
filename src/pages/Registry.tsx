import Skills from "../components/Skills";
import { Page, PageHeader } from "../components/Page";
import { SKILLS } from "../data/skills";
import { usePageMeta } from "../lib/seo";

export default function Registry() {
  usePageMeta({
    title: "Skill registry — skillport",
    description: `Browse ${SKILLS.length} installable MCP skills for search, data, web, media, dev and docs. Each entry lists its version, language and run count.`,
    path: "/registry",
  });

  return (
    <Page>
      <PageHeader
        title="Registry"
        lede="Every skill published to skillport, with the version and manifest slot the endpoint resolves. Filter by category or search by API name."
        meta={`${SKILLS.length} skills · 42 connected APIs · revision 2025-06-18`}
      />
      <div className="page-body">
        <Skills showHeader={false} />
      </div>
    </Page>
  );
}
