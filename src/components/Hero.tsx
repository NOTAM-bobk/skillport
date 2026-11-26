import { useEffect, useState } from "react";
import { CLIENT_CONFIG, MCP_ENDPOINT, MCP_SSE_ENDPOINT, copyText } from "../lib/site";
import { SKILLS, SOURCE_REPOS } from "../data/skills";
import { Link } from "../lib/router";
import CodeBlock from "./CodeBlock";
import { ArrowIcon, CheckIcon, CopyIcon } from "./Icons";
import { triggerConfetti } from "../lib/confetti";

const TOTAL_FILES = SKILLS.reduce((sum, skill) => sum + skill.fileCount, 0);

const SPEC = [
  { term: "Transport", value: "Streamable HTTP + SSE" },
  { term: "Auth", value: "None, public read" },
  { term: "Revision", value: "2025-06-18" },
  { term: "Registry", value: `${SKILLS.length} skills, ${SOURCE_REPOS.length} repos` },
];

const FACTS = [
  { value: String(SKILLS.length), label: "skills mirrored" },
  { value: String(TOTAL_FILES), label: "files served" },
  { value: String(SOURCE_REPOS.length), label: "source repos" },
];

export default function Hero() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (await copyText(MCP_ENDPOINT)) {
      setCopied(true);
      triggerConfetti(x, y);
    }
  }

  return (
    <section className="hero">
      <div className="hero-main">
        <p className="hero-protocol">MCP 2025-06-18 · streamable HTTP + SSE</p>

        <h1>A skill that finds skills.</h1>
        <p className="hero-lede">
          skillport is one MCP endpoint your agent calls to search {SKILLS.length} open-source skills
          and install their files in seconds. Hundreds of tools, pinned commits — no key, no glue
          code, no copying SKILL.md by hand.
        </p>

        <div className="endpoint" role="group" aria-label="MCP endpoint">
          <span className="endpoint-proto">mcp</span>
          <code className="endpoint-code">{MCP_ENDPOINT}</code>
          <button
            type="button"
            className={copied ? "copy-button copied" : "copy-button"}
            onClick={handleCopy}
            aria-label="Copy MCP endpoint"
          >
            {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="hero-actions">
          <Link className="button primary" to="/#skills">
            Browse skills
            <ArrowIcon size={14} />
          </Link>
          <Link className="button" to="/docs">
            Read the docs
          </Link>
        </div>

        <dl className="hero-facts">
          {FACTS.map((fact) => (
            <div key={fact.label} className="fact-item">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-panel">
        <div className="spec">
          <div className="spec-head">
            <h2>Connection</h2>
            <span className="spec-port">SP-000</span>
          </div>
          <dl className="spec-list">
            {SPEC.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="spec-note">SSE fallback at {MCP_SSE_ENDPOINT.replace("https://", "")}</p>
        </div>

        <CodeBlock code={CLIENT_CONFIG} title="claude_desktop_config.json" label="Copy config" />
      </div>
    </section>
  );
}
