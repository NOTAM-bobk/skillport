import { DownloadIcon, PlugIcon, SearchIcon, TerminalIcon } from "./Icons";

const STEPS = [
  {
    icon: <PlugIcon size={18} />,
    title: "Connect once",
    body: "Point your client at the endpoint. skillport handles auth, transport and tool schemas.",
    code: "POST /sse",
  },
  {
    icon: <SearchIcon size={18} />,
    title: "Search the registry",
    body: "Ask for what you need. The agent queries by capability, category or API provider.",
    code: "skills.search",
  },
  {
    icon: <DownloadIcon size={18} />,
    title: "Download a skill",
    body: "Skills resolve to a pinned manifest, so runs stay reproducible across clients.",
    code: "skills.get",
  },
  {
    icon: <TerminalIcon size={18} />,
    title: "Run it",
    body: "Calls execute through the provider API and return structured, typed output.",
    code: "skills.run",
  },
];

export default function Features() {
  return (
    <section className="section" id="how">
      <div className="section-head">
        <div>
          <h2>How it works</h2>
          <p>Four tool calls between your agent and any connected API.</p>
        </div>
      </div>

      <div className="grid">
        {STEPS.map((step) => (
          <article className="card" key={step.title}>
            <span className="card-icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <code className="card-code">{step.code}</code>
          </article>
        ))}
      </div>

      <div className="docs-panel" id="docs">
        <div>
          <h3>Wire it up in a minute</h3>
          <p>
            The endpoint speaks JSON-RPC over SSE. Any MCP-compatible client works — Claude Desktop,
            Cursor, VS Code, or your own runtime.
          </p>
        </div>
        <div className="docs-actions">
          <code className="inline-code">npx @skillport/cli connect</code>
          <a className="button small" href="#top">
            Back to endpoint
          </a>
        </div>
      </div>
    </section>
  );
}
