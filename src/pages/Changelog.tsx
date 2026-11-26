import { Page, PageHeader } from "../components/Page";
import { usePageMeta } from "../lib/seo";

const RELEASES = [
  {
    version: "0.4.0",
    date: "2026-11-20",
    items: [
      "Added per-skill pages with parameters and a pinned install request.",
      "Added the client wall so the supported assistants are visible at a glance.",
      "Docs, protocol details and CLI reference are now separate pages.",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-11-04",
    items: [
      "Registry search matches descriptions and categories, not just names.",
      "Category filters and an empty state that resets cleanly.",
      "Port slots are shown on every row so a skill is easy to reference.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-10-18",
    items: [
      "Skill manifests list inputs, runtimes and run counts.",
      "Copyable endpoint and client configuration in the hero.",
      "First pass at the Vercel and Cloudflare deployment targets.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-10-02",
    items: ["First public preview of the skillport frontend."],
  },
];

export default function Changelog() {
  usePageMeta({
    title: "Changelog — skillport",
    description: "What changed in skillport, release by release.",
    path: "/changelog",
  });

  return (
    <Page>
      <PageHeader
        title="Changelog"
        lede="Changes to the site and the registry. The endpoint itself has not shipped yet; entries below describe the frontend."
        meta="Current version 0.4.0"
      />

      <ol className="releases">
        {RELEASES.map((release) => (
          <li className="release" key={release.version}>
            <div className="release-meta">
              <span className="release-version">{release.version}</span>
              <time dateTime={release.date}>{release.date}</time>
            </div>
            <ul className="bullets">
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Page>
  );
}
