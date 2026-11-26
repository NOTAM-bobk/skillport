import { useEffect, useState } from "react";
import { MCP_ENDPOINT, copyText } from "../lib/site";
import { CheckIcon, CopyIcon, GitHubIcon, SkillMark } from "./Icons";

const LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "How it works", href: "#how" },
  { label: "Docs", href: "#docs" },
];

export default function Navbar() {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const ok = await copyText(MCP_ENDPOINT);
    if (ok) setCopied(true);
  }

  return (
    <header className={scrolled ? "nav scrolled" : "nav"}>
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label="skillport home">
          <span className="brand-mark">
            <SkillMark size={18} />
          </span>
          <span className="brand-name">skillport</span>
          <span className="brand-tag">beta</span>
        </a>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="icon-button" href="#docs" aria-label="GitHub">
            <GitHubIcon size={16} />
          </a>
          <button className="button small" type="button" onClick={handleCopy}>
            {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            {copied ? "Copied" : "Copy endpoint"}
          </button>
        </div>
      </div>
    </header>
  );
}
