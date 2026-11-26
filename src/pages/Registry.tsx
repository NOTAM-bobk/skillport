import Skills from "../components/Skills";
import { Page, PageHeader } from "../components/Page";
import { SKILLS, SKILLS_GENERATED, SOURCE_REPOS } from "../data/skills";
import { usePageMeta } from "../lib/seo";

export default function Registry() {
  usePageMeta({
    title: "Skill registry — skillport",
    description: `Browse ${SKILLS.length} installable agent skills mirrored from open-source repos, with pinned commits, licences and file-level hashes.`,
    path: "/registry",
  });

  return (
    <Page>
      <PageHeader
        title="Registry"
        lede="Every skill in the registry, with the upstream commit and manifest slot the endpoint resolves. Filter by category or search by name, capability or repository."
        meta={`${SKILLS.length} skills · ${SOURCE_REPOS.length} source repos · synced ${SKILLS_GENERATED.slice(0, 10)}`}
      />
      <div className="page-body">
        <Skills showHeader={false} />
      </div>
    </Page>
  );
}
