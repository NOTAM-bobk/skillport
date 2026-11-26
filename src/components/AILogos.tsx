type MarkProps = { className?: string };

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function OpenAIMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="12" rx="7.4" ry="3.1" />
      <ellipse cx="12" cy="12" rx="7.4" ry="3.1" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="7.4" ry="3.1" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function ClaudeMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.8}>
      <path d="M12 3.5v17" />
      <path d="M4.6 7.8l14.8 8.4" />
      <path d="M19.4 7.8 4.6 16.2" />
    </svg>
  );
}

export function GeminiMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <path d="M12 2.6c0 5.2 4.2 9.4 9.4 9.4-5.2 0-9.4 4.2-9.4 9.4 0-5.2-4.2-9.4-9.4-9.4 5.2 0 9.4-4.2 9.4-9.4Z" />
    </svg>
  );
}

export function CopilotMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.5 8.5h13v5.2a6.5 6.5 0 0 1-13 0z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      <path d="M9.6 13.6h.01M14.4 13.6h.01" strokeWidth={2.2} />
    </svg>
  );
}

export function CursorMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.2 20 8v8l-8 4.8L4 16V8z" />
      <path d="M12 3.2V20M4 8l8 4.6L20 8" />
    </svg>
  );
}

export function VSCodeMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M17.5 4.2 7 12l10.5 7.8z" />
      <path d="m7 12-3.2-2.6v5.2z" />
    </svg>
  );
}

export function ZedMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3.4" />
      <path d="M9 9h6l-6 6h6" />
    </svg>
  );
}

export function WindsurfMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 10.2c2.8-3 5.7 3 8.5 0s5.7-3 8.5 0" />
      <path d="M3.5 15c2.8-3 5.7 3 8.5 0s5.7-3 8.5 0" />
    </svg>
  );
}

export function MistralMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <rect x="3.5" y="5" width="6" height="4" />
      <rect x="9.5" y="9.5" width="6" height="4" />
      <rect x="14" y="14" width="6" height="4" />
    </svg>
  );
}

export function LlamaMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 12c-2.2-4.4-8.5-4.2-8.5.2s6.3 4.6 8.5.2 8.5-4.2 8.5.2-6.3 4.6-8.5.2Z" />
    </svg>
  );
}

export function GrokMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 19.5 19.5 4.5" />
      <path d="M4.5 4.5h4.2" />
      <path d="M15.3 19.5h4.2" />
    </svg>
  );
}

export function DeepSeekMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 13.5c3.8 3.4 10.4 3.2 14-1.6.6 4.6-2.6 8.1-7 8.1-3.9 0-7-2.6-7-6.5Z" />
      <circle cx="8" cy="16.2" r="0.7" fill="currentColor" stroke="none" />
      <path d="M18 7.5c.9-1.4 2.3-2 3.5-1.8" />
    </svg>
  );
}

export function PerplexityMark({ className }: MarkProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 9.5h15v9h-15z" />
      <path d="m4.5 9.5 7.5-5 7.5 5" />
      <path d="M12 4.5v14" />
    </svg>
  );
}

export const AI_CLIENTS = [
  { name: "OpenAI", Mark: OpenAIMark },
  { name: "Claude", Mark: ClaudeMark },
  { name: "Gemini", Mark: GeminiMark },
  { name: "Copilot", Mark: CopilotMark },
  { name: "Cursor", Mark: CursorMark },
  { name: "VS Code", Mark: VSCodeMark },
  { name: "Zed", Mark: ZedMark },
  { name: "Windsurf", Mark: WindsurfMark },
  { name: "Mistral", Mark: MistralMark },
  { name: "Llama", Mark: LlamaMark },
  { name: "Grok", Mark: GrokMark },
  { name: "DeepSeek", Mark: DeepSeekMark },
  { name: "Perplexity", Mark: PerplexityMark },
];
