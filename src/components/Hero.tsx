import { useEffect, useState } from "react";
import { CLIENT_CONFIG, MCP_ENDPOINT, copyText } from "../lib/site";
import { ArrowIcon, CheckIcon, CopyIcon } from "./Icons";

const STATS = [
  { value: "128", label: "published skills" },
  { value: "42", label: "connected APIs" },
  { value: "9.4k", label: "weekly installs" },
  { value: "99.98%", label: "endpoint uptime" },
];

export default function Hero() {
  const [copied, setCopied] = useState<"endpoint" | "config" | null>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy(kind: "endpoint" | "config", value: string) {
    const ok = await copyText(value);
    if (ok) setCopied(kind);
  }

  return (
    <section className="hero" id="top">
      <div className="hero-badge">
        <span className="dot" />
        Model Context Protocol
        <span className="badge-sep" />
        <span className="muted">v2025-06-18</span>
      </div>

      <h1>
        Every API your agent needs,
        <br />
        <span className="gradient-text">one MCP endpoint.</span>
      </h1>

      <p className="hero-copy">
        skillport turns scattered APIs into installable skills. Search the registry, pull a skill
        into your client, and let your agent call it — no glue code, no credential juggling.
      </p>

      <div className="endpoint" role="group" aria-label="MCP endpoint">
        <span className="endpoint-proto">sse</span>
        <code>{MCP_ENDPOINT}</code>
        <button
          type="button"
          className={copied === "endpoint" ? "copy-button copied" : "copy-button"}
          onClick={() => handleCopy("endpoint", MCP_ENDPOINT)}
          aria-label="Copy MCP endpoint"
        >
          {copied === "endpoint" ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          {copied === "endpoint" ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="hero-actions">
        <a className="button primary" href="#skills">
          Browse skills
          <ArrowIcon size={14} />
        </a>
        <a className="button" href="#how">
          Read the docs
        </a>
      </div>

      <div className="code-card">
        <div className="code-head">
          <span className="code-title">claude_desktop_config.json</span>
          <button
            type="button"
            className="copy-button ghost"
            onClick={() => handleCopy("config", CLIENT_CONFIG)}
          >
            {copied === "config" ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            {copied === "config" ? "Copied" : "Copy config"}
          </button>
        </div>
        <pre>
          <code>{CLIENT_CONFIG}</code>
        </pre>
      </div>

      <dl className="stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat">
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
