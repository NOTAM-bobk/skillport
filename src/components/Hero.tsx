import { useEffect, useState } from "react";
import { CLIENT_CONFIG, MCP_ENDPOINT, copyText } from "../lib/site";
import { Link } from "../lib/router";
import CodeBlock from "./CodeBlock";
import { ArrowIcon, CheckIcon, CopyIcon } from "./Icons";

const SPEC = [
  { term: "Transport", value: "HTTP + SSE" },
  { term: "Auth", value: "OAuth 2.1 or bearer" },
  { term: "Revision", value: "2025-06-18" },
  { term: "Registry", value: "128 skills, 42 APIs" },
];

const FACTS = [
  { value: "128", label: "skills published" },
  { value: "42", label: "APIs connected" },
  { value: "9.4k", label: "installs this week" },
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
          skillport is one MCP endpoint in front of a registry of API-backed skills. Search it from
          any client, pin a version, and call it without writing glue code or handling tokens
          yourself.
        </p>

        <div className="endpoint" role="group" aria-label="MCP endpoint">
          <span className="endpoint-proto">sse</span>
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
          <p className="spec-note">One endpoint per workspace. No per-client setup.</p>
        </div>

        <CodeBlock code={CLIENT_CONFIG} title="claude_desktop_config.json" label="Copy config" />
      </div>
    </section>
  );
}
