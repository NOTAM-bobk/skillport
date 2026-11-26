import { Link } from "../lib/router";
import { ArrowIcon } from "./Icons";

const STEPS = [
  {
    title: "Connect once",
    body: "Point your client at the endpoint. No key, no OAuth, no account.",
    code: "POST /mcp",
  },
  {
    title: "Search the registry",
    body: "Ask for what you need in plain language. The agent searches by capability, category or repo.",
    code: "skills.search",
  },
  {
    title: "Read the manifest",
    body: "Every skill resolves to an upstream commit, a licence and a sha256 per file.",
    code: "skills.get",
  },
  {
    title: "Install the files",
    body: "The server returns the real files; the assistant writes them and follows SKILL.md.",
    code: "skills.install",
  },
];

export default function Features() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="section-head">
        <div>
          <h2 id="how-title">How it works</h2>
          <p>Four steps from a prompt to real skill files on disk.</p>
        </div>
      </div>

      <ol className="steps">
        {STEPS.map((step, index) => (
          <li className="step" key={step.title}>
            <span className="step-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <code>{step.code}</code>
          </li>
        ))}
      </ol>

      <div className="docs-panel">
        <div>
          <h3>Wire it up in a minute</h3>
          <p>
            The endpoint speaks JSON-RPC over streamable HTTP, with an SSE fallback, so any
            MCP-compatible client works: Claude Code, Cursor, VS Code, Zed or your own runtime.
          </p>
        </div>
        <div className="docs-actions">
          <code className="inline-code">npx @skillport/cli connect</code>
          <Link className="button small" to="/docs">
            Read the setup guide
            <ArrowIcon size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
