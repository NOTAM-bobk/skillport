import { GitHubIcon, SkillMark } from "./Icons";

const COLUMNS = [
  {
    title: "Product",
    links: ["Skills", "Registry", "Changelog", "Status"],
  },
  {
    title: "Developers",
    links: ["Documentation", "MCP spec", "CLI", "Publish a skill"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Contact", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand">
            <span className="brand-mark">
              <SkillMark size={16} />
            </span>
            <span className="brand-name">skillport</span>
          </span>
          <p>The MCP endpoint for agent skills.</p>
          <a className="icon-button" href="#docs" aria-label="GitHub repository">
            <GitHubIcon size={15} />
          </a>
        </div>

        <div className="footer-cols">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#docs">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} skillport. All rights reserved.</span>
        <span className="footer-note">Mock registry · APIs and skills land soon.</span>
      </div>
    </footer>
  );
}
