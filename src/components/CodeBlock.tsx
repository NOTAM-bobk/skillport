import { useEffect, useState } from "react";
import { copyText } from "../lib/site";
import { CheckIcon, CopyIcon } from "./Icons";

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

  async function handleCopy() {
    if (await copyText(code)) setCopied(true);
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
