import { useEffect, useState } from "react";
import { copyText } from "../lib/site";
import { CheckIcon, CopyIcon } from "./Icons";
import { triggerConfetti } from "../lib/confetti";

type CodeBlockProps = {
  code: string;
  title?: string;
  label?: string;
  className?: string;
};

export default function CodeBlock({ code, title, label = "Copy", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (await copyText(code)) {
      setCopied(true);
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }

  return (
    <div className={className ? `code-block ${className}` : "code-block"}>
      <div className="code-block-head">
        {title ? <span className="code-block-title">{title}</span> : <span />}
        <button
          type="button"
          className="copy-button ghost"
          onClick={handleCopy}
          aria-label={title ? `Copy ${title}` : "Copy code"}
        >
          {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          {copied ? "Copied" : label}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
