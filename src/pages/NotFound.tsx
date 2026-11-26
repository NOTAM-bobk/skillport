import { Page, PageHeader } from "../components/Page";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";

export default function NotFound() {
  usePageMeta({
    title: "Page not found — skillport",
    description: "That page does not exist. Browse the registry or read the documentation instead.",
    path: "/404",
    noindex: true,
  });

  return (
    <Page>
      <PageHeader
        title="Page not found"
        lede="That address does not match anything on skillport. It may have moved, or the skill may never have been published."
        meta="404"
      />
      <div className="not-found-links">
        <Link className="button primary" to="/">
          Back to the start
        </Link>
        <Link className="button" to="/registry">
          Browse the registry
        </Link>
        <Link className="button" to="/docs">
          Read the docs
        </Link>
      </div>
    </Page>
  );
}
