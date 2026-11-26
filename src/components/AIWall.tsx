import { AI_CLIENTS } from "./AILogos";

function ClientRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="marquee-track" aria-hidden={duplicate || undefined}>
      {AI_CLIENTS.map(({ name, Mark }) => (
        <div className="client" key={`${duplicate ? "b" : "a"}-${name}`}>
          <Mark className="client-mark" />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}

export default function AIWall() {
  return (
    <section className="ai-wall" aria-labelledby="ai-wall-title">
      <div className="ai-wall-head">
        <h2 id="ai-wall-title">Works with the assistants you already run</h2>
        <p>
          skillport speaks the Model Context Protocol, so the same endpoint drops into every client
          that supports it.
        </p>
      </div>

      <div className="marquee">
        <ClientRow />
        <ClientRow duplicate />
      </div>

      <p className="ai-wall-note">
        Any other MCP client works too. The endpoint is the whole integration.
      </p>
    </section>
  );
}
