import { Page, PageHeader, Section } from "../components/Page";
import { MailIcon } from "../components/Icons";
import { CONTACT_EMAIL, REPO_URL } from "../lib/site";
import { usePageMeta } from "../lib/seo";

export default function Contact() {
  usePageMeta({
    title: "Contact — skillport",
    description:
      "Reach the skillport team about the registry, publishing a skill or the MCP endpoint.",
    path: "/contact",
  });

  return (
    <Page>
      <PageHeader
        title="Contact"
        lede="Questions about publishing, the endpoint or something on this site. One person reads this inbox, so expect a reply within a couple of days."
      />

      <div className="contact-grid">
        <a className="panel contact-card" href={`mailto:${CONTACT_EMAIL}`}>
          <MailIcon size={18} />
          <h2>Email</h2>
          <p>{CONTACT_EMAIL}</p>
          <span className="muted">Best for registry and access questions.</span>
        </a>
        <a className="panel contact-card" href={REPO_URL} target="_blank" rel="noreferrer">
          <span className="contact-mark" aria-hidden="true">
            #
          </span>
          <h2>Issues</h2>
          <p>github.com/NOTAM-bobk/skillport</p>
          <span className="muted">Best for bugs and documentation fixes.</span>
        </a>
      </div>

      <Section title="Publishing a skill">
        <p className="prose">
          Skip the email: the submission steps, manifest format and review checklist are on the
          publish page.
        </p>
      </Section>
    </Page>
  );
}
