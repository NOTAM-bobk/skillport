export type Skill = {
  owner: string;
  name: string;
  description: string;
  category: Category;
  language: string;
  color: string;
  stars: string;
  runs: string;
  version: string;
};

export type Category = "Search" | "Data" | "Web" | "Media" | "Dev" | "Docs";

export const CATEGORIES = ["All", "Search", "Data", "Web", "Media", "Dev", "Docs"] as const;

export const SKILLS: Skill[] = [
  {
    owner: "skillport",
    name: "web-search",
    description: "Query the live web and get ranked results with titles, URLs and snippets.",
    category: "Search",
    language: "TypeScript",
    color: "#3178c6",
    stars: "4.8k",
    runs: "92k",
    version: "v2.4.0",
  },
  {
    owner: "skillport",
    name: "pdf-extract",
    description: "Parse PDFs into clean markdown, tables and page-level citations.",
    category: "Docs",
    language: "Python",
    color: "#3572a5",
    stars: "3.1k",
    runs: "68k",
    version: "v1.9.2",
  },
  {
    owner: "skillport",
    name: "stripe-ops",
    description: "Look up customers, invoices and subscription state without leaving the chat.",
    category: "Data",
    language: "TypeScript",
    color: "#3178c6",
    stars: "2.7k",
    runs: "41k",
    version: "v1.6.1",
  },
  {
    owner: "skillport",
    name: "postgres-query",
    description: "Run read-only SQL against a Postgres connection and return typed rows.",
    category: "Data",
    language: "Go",
    color: "#00add8",
    stars: "2.2k",
    runs: "37k",
    version: "v1.2.0",
  },
  {
    owner: "skillport",
    name: "browser-scrape",
    description: "Render a page in a headless browser and extract structured content.",
    category: "Web",
    language: "TypeScript",
    color: "#3178c6",
    stars: "2.0k",
    runs: "54k",
    version: "v3.0.1",
  },
  {
    owner: "skillport",
    name: "image-gen",
    description: "Generate or edit images from a prompt and return hosted asset URLs.",
    category: "Media",
    language: "Rust",
    color: "#dea584",
    stars: "1.8k",
    runs: "29k",
    version: "v0.9.4",
  },
  {
    owner: "skillport",
    name: "github-issues",
    description: "Search repositories, triage issues and open pull requests as an agent.",
    category: "Dev",
    language: "TypeScript",
    color: "#3178c6",
    stars: "1.7k",
    runs: "33k",
    version: "v1.4.5",
  },
  {
    owner: "skillport",
    name: "semantic-memory",
    description: "Store and retrieve long-term facts with hybrid vector and keyword search.",
    category: "Data",
    language: "Python",
    color: "#3572a5",
    stars: "1.5k",
    runs: "26k",
    version: "v2.1.0",
  },
  {
    owner: "skillport",
    name: "audio-transcribe",
    description: "Transcribe audio and video into speaker-labelled timestamped text.",
    category: "Media",
    language: "Python",
    color: "#3572a5",
    stars: "1.3k",
    runs: "19k",
    version: "v1.0.7",
  },
  {
    owner: "skillport",
    name: "docs-crawler",
    description: "Crawl a docs site into a searchable index the agent can cite.",
    category: "Docs",
    language: "JavaScript",
    color: "#f1e05a",
    stars: "1.1k",
    runs: "15k",
    version: "v0.7.3",
  },
  {
    owner: "skillport",
    name: "code-runner",
    description: "Execute snippets in a sandboxed container with filesystem and network limits.",
    category: "Dev",
    language: "Go",
    color: "#00add8",
    stars: "986",
    runs: "12k",
    version: "v1.1.2",
  },
  {
    owner: "skillport",
    name: "maps-places",
    description: "Geocode addresses and find nearby places with opening hours and ratings.",
    category: "Search",
    language: "TypeScript",
    color: "#3178c6",
    stars: "742",
    runs: "9.8k",
    version: "v0.5.0",
  },
];
