import { useEffect, useState } from "react";
import { MCP_ENDPOINT, REPO_URL, copyText } from "../lib/site";
import { Link, useRoute } from "../lib/router";
import { BugIcon, CheckIcon, CopyIcon, GitHubIcon, SkillMark } from "./Icons";
import { triggerConfetti } from "../lib/confetti";
import BugReportModal from "./BugReportModal";

const LINKS = [
  { label: "Skills", to: "/#skills" },
  { label: "Registry", to: "/registry" },
  { label: "Docs", to: "/docs" },
  { label: "Changelog", to: "/changelog" },
];

export default function Navbar() {
  const { path } = useRoute();
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (await copyText(MCP_ENDPOINT)) {
      setCopied(true);
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }

  return (
    <>
      <header className={scrolled ? "nav scrolled" : "nav"}>
        <div className="nav-inner">
          <Link className="brand" to="/" aria-label="skillport home">
            <span className="brand-mark">
              <SkillMark size={17} />
            </span>
            <span className="brand-name">skillport</span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                aria-current={path === link.to.split("#")[0] ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="bug-report-btn"
              onClick={() => setBugModalOpen(true)}
              title="Report a bug"
              aria-label="Report a bug"
            >
              <BugIcon size={14} />
              <span className="bug-report-label">Bug report</span>
            </button>

            <a
              className="icon-button"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="skillport on GitHub"
            >
              <GitHubIcon size={16} />
            </a>

            <button
              className="button small ghost copy-nav-btn"
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Endpoint copied" : "Copy MCP endpoint"}
            >
              {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              <span className="nav-copy-label">{copied ? "Copied" : "Copy endpoint"}</span>
            </button>

            <button
              className="nav-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav className="nav-menu" id="nav-menu" aria-label="Main">
            {LINKS.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="nav-menu-bug-btn"
              onClick={() => {
                setMenuOpen(false);
                setBugModalOpen(true);
              }}
            >
              <BugIcon size={14} />
              <span>Report a bug</span>
            </button>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="nav-menu-gh-link">
              <GitHubIcon size={15} />
              GitHub
            </a>
          </nav>
        ) : null}
      </header>

      <BugReportModal isOpen={bugModalOpen} onClose={() => setBugModalOpen(false)} />
    </>
  );
}
