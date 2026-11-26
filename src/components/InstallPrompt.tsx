import { INSTALL_PROMPT } from "../lib/site";
import CodeBlock from "./CodeBlock";

const STEPS = [
  { n: "01", text: "Connects to the endpoint. No key, no sign-in." },
  { n: "02", text: "Searches the registry by capability." },
  { n: "03", text: "Downloads and pins the skills it needs." },
];

export default function InstallPrompt() {
  return (
    <section className="section prompt" id="prompt" aria-labelledby="prompt-title">
      <div className="prompt-grid">
        <div className="prompt-copy">
          <p className="prompt-eyebrow">Install with a prompt</p>
          <h2 id="prompt-title">Let the assistant wire itself up.</h2>
          <p>
            Paste this into Claude, ChatGPT, Cursor, Copilot or any assistant that can add a remote
            MCP server. It connects to skillport, searches the registry for what your task needs,
            and installs the matching skills before it starts.
          </p>
          <ol className="prompt-steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span aria-hidden="true">{step.n}</span>
                {step.text}
              </li>
            ))}
          </ol>
        </div>

        <CodeBlock
          code={INSTALL_PROMPT}
          title="install prompt"
          label="Copy prompt"
          className="prompt-code"
        />
      </div>
    </section>
  );
}
