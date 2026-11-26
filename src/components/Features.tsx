import { Link } from "../lib/router";
import { ArrowIcon } from "./Icons";

const STEPS = [
  {
    title: "Connect once",
    body: "Point your client at the endpoint. skillport handles transport, auth and tool schemas.",
    code: "POST /sse",
  },
  {
    title: "Search the registry",
    body: "Ask for what you need. The agent queries by capability, category or API provider.",
    code: "skills.search",
  },
  {
    title: "Download a skill",
    body: "Skills resolve to a pinned manifest, so the same version runs across clients.",
    code: "skills.get",
  },
  {
    title: "Run it",
    body: "Calls execute against the provider API and come back as structured, typed output.",
    code: "skills.run",
  },
];

export default function Features() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="section-head">
        <div>
          <h2 id="how-title">How it works</h2>
          <p>Four tool calls between your agent and any connected API.</p>
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
            The endpoint speaks JSON-RPC over SSE, so any MCP-compatible client works: Claude
            Desktop, Cursor, VS Code, Zed or your own runtime.
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
