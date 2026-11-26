import { REPO_URL } from "../lib/site";
import { Link } from "../lib/router";
import { GitHubIcon, SkillMark } from "./Icons";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Skills", to: "/#skills" },
      { label: "Registry", to: "/registry" },
      { label: "Changelog", to: "/changelog" },
      { label: "Status", to: "/status" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "MCP spec", to: "/docs/mcp" },
      { label: "CLI", to: "/cli" },
      { label: "Publish a skill", to: "/publish" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <span className="brand-mark">
              <SkillMark size={16} />
            </span>
            <span className="brand-name">skillport</span>
          </Link>
          <p>The MCP endpoint for agent skills.</p>
          <a
            className="icon-button"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="skillport repository on GitHub"
          >
            <GitHubIcon size={15} />
          </a>
        </div>

        <div className="footer-cols">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} skillport</span>
        <span className="footer-note">Preview build: registry data and endpoint are mocked.</span>
      </div>
    </footer>
  );
}
