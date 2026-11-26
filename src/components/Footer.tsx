import { useState } from "react";
import { ISSUES_URL, REPO_URL } from "../lib/site";
import { Link } from "../lib/router";
import { BugIcon, GitHubIcon, SkillMark } from "./Icons";
import BugReportModal from "./BugReportModal";

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
    title: "Community",
    links: [
      { label: "GitHub Discussions", to: `${REPO_URL}/discussions`, external: true },
      { label: "About", to: "/about" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

export default function Footer() {
  const [bugModalOpen, setBugModalOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link className="brand" to="/">
              <span className="brand-mark">
                <SkillMark size={16} />
              </span>
              <span className="brand-name">skillport</span>
            </Link>
            <p>The open MCP endpoint for agent skills.</p>
            <div className="footer-socials">
              <a
                className="icon-button"
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="skillport repository on GitHub"
              >
                <GitHubIcon size={15} />
              </a>
              <button
                type="button"
                className="footer-bug-btn"
                onClick={() => setBugModalOpen(true)}
                title="Report a bug"
              >
                <BugIcon size={13} />
                <span>Report bug</span>
              </button>
            </div>
          </div>

          <div className="footer-cols">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a href={link.to} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.to}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                  {column.title === "Developers" && (
                    <li>
                      <button
                        type="button"
                        className="footer-link-btn"
                        onClick={() => setBugModalOpen(true)}
                      >
                        Report a bug
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} skillport • Built for the Model Context Protocol</span>
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="footer-issues-link"
          >
            GitHub Issues
          </a>
        </div>
      </footer>

      <BugReportModal isOpen={bugModalOpen} onClose={() => setBugModalOpen(false)} />
    </>
  );
}
