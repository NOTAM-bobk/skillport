export type SkillParam = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type Skill = {
  owner: string;
  name: string;
  description: string;
  long: string;
  category: Category;
  language: string;
  color: string;
  stars: string;
  runs: string;
  version: string;
  params: SkillParam[];
};

export type Category = "Search" | "Data" | "Web" | "Media" | "Dev" | "Docs";

export const CATEGORIES = ["All", "Search", "Data", "Web", "Media", "Dev", "Docs"] as const;

/** Stable manifest slot shown throughout the interface, e.g. SP-003. */
export function portCode(index: number): string {
  return `SP-${String(index + 1).padStart(3, "0")}`;
}

export const SKILLS: Skill[] = [
  {
    owner: "skillport",
    name: "web-search",
    description: "Query the live web and get ranked results with titles, URLs and snippets.",
    long: "Runs a provider-backed search and returns a ranked result list the agent can cite. Snippets are trimmed to keep responses inside a modest token budget.",
    category: "Search",
    language: "TypeScript",
    color: "#3b82f6",
    stars: "4.8k",
    runs: "92k",
    version: "v2.4.0",
    params: [
      { name: "query", type: "string", required: true, description: "Search terms." },
      { name: "limit", type: "number", required: false, description: "Results to return. Defaults to 8, max 20." },
      { name: "freshness", type: "enum", required: false, description: "day, week, month or year." },
    ],
  },
  {
    owner: "skillport",
    name: "pdf-extract",
    description: "Parse PDFs into clean markdown, tables and page-level citations.",
    long: "Hands back markdown plus a page map so the agent can cite where a sentence came from. Works on scanned documents when OCR is enabled.",
    category: "Docs",
    language: "Python",
    color: "#3572a5",
    stars: "3.1k",
    runs: "68k",
    version: "v1.9.2",
    params: [
      { name: "url", type: "string", required: true, description: "Public PDF URL or signed asset id." },
      { name: "pages", type: "string", required: false, description: "Page range such as 1-12. Defaults to all." },
      { name: "ocr", type: "boolean", required: false, description: "Run OCR on pages without a text layer." },
    ],
  },
  {
    owner: "skillport",
    name: "stripe-ops",
    description: "Look up customers, invoices and subscription state without leaving the chat.",
    long: "Wraps the Stripe API with a small, safe set of read operations. Destructive calls are not exposed; refunds stay manual.",
    category: "Data",
    language: "TypeScript",
    color: "#3b82f6",
    stars: "2.7k",
    runs: "41k",
    version: "v1.6.1",
    params: [
      { name: "operation", type: "enum", required: true, description: "list_customers, get_invoice, get_subscription." },
      { name: "customer_id", type: "string", required: false, description: "Stripe customer id, when the operation needs one." },
      { name: "limit", type: "number", required: false, description: "Rows to return. Defaults to 10." },
    ],
  },
  {
    owner: "skillport",
    name: "postgres-query",
    description: "Run read-only SQL against a Postgres connection and return typed rows.",
    long: "Executes a single read-only statement against a connection you register once. Results come back as typed rows with a column summary.",
    category: "Data",
    language: "Go",
    color: "#00add8",
    stars: "2.2k",
    runs: "37k",
    version: "v1.2.0",
    params: [
      { name: "connection", type: "string", required: true, description: "Name of a registered connection." },
      { name: "sql", type: "string", required: true, description: "A single SELECT statement." },
      { name: "params", type: "object", required: false, description: "Positional values, always bound server side." },
    ],
  },
  {
    owner: "skillport",
    name: "browser-scrape",
    description: "Render a page in a headless browser and extract structured content.",
    long: "Loads the page in a real browser, waits for the selector you name, then returns readable text or the matched nodes.",
    category: "Web",
    language: "TypeScript",
    color: "#3b82f6",
    stars: "2.0k",
    runs: "54k",
    version: "v3.0.1",
    params: [
      { name: "url", type: "string", required: true, description: "Page to load." },
      { name: "selector", type: "string", required: false, description: "CSS selector to extract. Defaults to body text." },
      { name: "wait_for", type: "string", required: false, description: "Selector that signals the page is ready." },
    ],
  },
  {
    owner: "skillport",
    name: "image-gen",
    description: "Generate or edit images from a prompt and return hosted asset URLs.",
    long: "Produces an image from a prompt or edits one you pass in, then stores the result and returns a URL that stays valid for 30 days.",
    category: "Media",
    language: "Rust",
    color: "#dea584",
    stars: "1.8k",
    runs: "29k",
    version: "v0.9.4",
    params: [
      { name: "prompt", type: "string", required: true, description: "What the image should contain." },
      { name: "size", type: "enum", required: false, description: "square, landscape or portrait." },
      { name: "count", type: "number", required: false, description: "Images to generate, 1 to 4." },
    ],
  },
  {
    owner: "skillport",
    name: "github-issues",
    description: "Search repositories, triage issues and open pull requests as an agent.",
    long: "Reads issues and pull requests across repositories the installation can see, with comment threads kept in order.",
    category: "Dev",
    language: "TypeScript",
    color: "#3b82f6",
    stars: "1.7k",
    runs: "33k",
    version: "v1.4.5",
    params: [
      { name: "repo", type: "string", required: true, description: "owner/name of the repository." },
      { name: "state", type: "enum", required: false, description: "open, closed or all." },
      { name: "query", type: "string", required: false, description: "Free text matched against title and body." },
    ],
  },
  {
    owner: "skillport",
    name: "semantic-memory",
    description: "Store and retrieve long-term facts with hybrid vector and keyword search.",
    long: "Keeps a namespace of facts the agent can write to and recall later. Retrieval blends embedding similarity with exact keyword matches.",
    category: "Data",
    language: "Python",
    color: "#3572a5",
    stars: "1.5k",
    runs: "26k",
    version: "v2.1.0",
    params: [
      { name: "operation", type: "enum", required: true, description: "remember, recall or forget." },
      { name: "namespace", type: "string", required: true, description: "Collection to read or write." },
      { name: "text", type: "string", required: false, description: "Fact to store, or the query to recall against." },
    ],
  },
  {
    owner: "skillport",
    name: "audio-transcribe",
    description: "Transcribe audio and video into speaker-labelled timestamped text.",
    long: "Returns segments with start and end times. Speaker labels are estimated, so the output flags low-confidence turns.",
    category: "Media",
    language: "Python",
    color: "#3572a5",
    stars: "1.3k",
    runs: "19k",
    version: "v1.0.7",
    params: [
      { name: "url", type: "string", required: true, description: "Audio or video URL." },
      { name: "language", type: "string", required: false, description: "ISO code. Detected when omitted." },
      { name: "diarize", type: "boolean", required: false, description: "Label speakers in the transcript." },
    ],
  },
  {
    owner: "skillport",
    name: "docs-crawler",
    description: "Crawl a docs site into a searchable index the agent can cite.",
    long: "Follows same-origin links up to a depth you set, strips navigation chrome, and chunks the result with source URLs attached.",
    category: "Docs",
    language: "JavaScript",
    color: "#f1e05a",
    stars: "1.1k",
    runs: "15k",
    version: "v0.7.3",
    params: [
      { name: "url", type: "string", required: true, description: "Starting page for the crawl." },
      { name: "depth", type: "number", required: false, description: "Link hops to follow. Defaults to 2, max 5." },
      { name: "selector", type: "string", required: false, description: "Content container to keep." },
    ],
  },
  {
    owner: "skillport",
    name: "code-runner",
    description: "Execute snippets in a sandboxed container with filesystem and network limits.",
    long: "Runs a short program in a throwaway container with no network by default, then returns stdout, stderr and the files it wrote.",
    category: "Dev",
    language: "Go",
    color: "#00add8",
    stars: "986",
    runs: "12k",
    version: "v1.1.2",
    params: [
      { name: "code", type: "string", required: true, description: "Program source." },
      { name: "language", type: "enum", required: true, description: "python, node or bash." },
      { name: "timeout_ms", type: "number", required: false, description: "Wall clock limit. Max 30000." },
    ],
  },
  {
    owner: "skillport",
    name: "maps-places",
    description: "Geocode addresses and find nearby places with opening hours and ratings.",
    long: "Converts addresses to coordinates and returns nearby places with hours, ratings and a formatted address for display.",
    category: "Search",
    language: "TypeScript",
    color: "#3b82f6",
    stars: "742",
    runs: "9.8k",
    version: "v0.5.0",
    params: [
      { name: "operation", type: "enum", required: true, description: "geocode, nearby or details." },
      { name: "query", type: "string", required: true, description: "Address or place name." },
      { name: "near", type: "string", required: false, description: "lat,lng to search around." },
    ],
  },
];

export function findSkill(slug: string): { skill: Skill; index: number } | null {
  const index = SKILLS.findIndex((skill) => skill.name === slug);
  if (index === -1) return null;
  return { skill: SKILLS[index], index };
}
