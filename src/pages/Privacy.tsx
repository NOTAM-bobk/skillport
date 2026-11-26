import { Page, PageHeader, Section } from "../components/Page";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";

export default function Privacy() {
  usePageMeta({
    title: "Privacy — skillport",
    description:
      "What this preview site stores: no accounts, no analytics and no cookies. Fonts are served by Google Fonts.",
    path: "/privacy",
  });

  return (
    <Page>
      <PageHeader
        title="Privacy"
        lede="This preview collects nothing about you. The details below describe the site as it runs today."
        meta="Last updated 26 November 2026"
      />

      <div className="prose">
        <Section title="What we store">
          <p>
            No accounts, no sign-in form and no server-side database on this site. Copying the
            endpoint or a config snippet happens in your browser; nothing is sent anywhere.
          </p>
        </Section>

        <Section title="Analytics and cookies">
          <p>
            There is no analytics script and no tracking pixel. The site sets no cookies. Your
            browser may cache static files, which is normal for any web page.
          </p>
        </Section>

        <Section title="Third parties">
          <p>
            Typefaces are loaded from Google Fonts, which receives the request for the font files
            including your IP address. The source code is hosted by the platform you load this page
            from. The registry data shown here is mocked.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email <Link to="/contact">hello@mathclass.uk</Link> and ask. If the project adds
            accounts or analytics later, this page will say so before it ships.
          </p>
        </Section>
      </div>
    </Page>
  );
}
