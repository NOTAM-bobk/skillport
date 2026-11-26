import { useEffect, useState } from "react";
import { CLIENT_CONFIG, MCP_ENDPOINT, MCP_SSE_ENDPOINT, copyText } from "../lib/site";
import { SKILLS, SOURCE_REPOS } from "../data/skills";
import { Link } from "../lib/router";
import CodeBlock from "./CodeBlock";
import { ArrowIcon, CheckIcon, CopyIcon } from "./Icons";

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

  async function handleCopy() {
    if (await copyText(MCP_ENDPOINT)) setCopied(true);
  }

  return (
    <section className="hero">
      <div className="hero-main">
        <p className="hero-meta">Model Context Protocol, revision 2025-06-18</p>
        <h1>Skills your agent can find, install and run.</h1>
        <p className="hero-lede">
          skillport is one MCP endpoint in front of a registry of open-source agent skills. Search it
          from any client, pin a commit, and download the real files — no key, no glue code, no
          copying SKILL.md by hand.
        </p>

        <div className="endpoint" role="group" aria-label="MCP endpoint">
          <span className="endpoint-proto">mcp</span>
          <code>{MCP_ENDPOINT}</code>
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
            <div key={fact.label}>
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
