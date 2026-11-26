import { Page, PageHeader } from "../components/Page";
import { ArrowIcon } from "../components/Icons";
import { Link } from "../lib/router";
import { usePageMeta } from "../lib/seo";
import NotFound from "./NotFound";

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
};

const POSTS: Post[] = [
  {
    slug: "one-endpoint",
    title: "One endpoint instead of five client configs",
    date: "2026-11-18",
    excerpt:
      "Every MCP client stores servers differently. Putting the registry behind a single URL removes that whole category of maintenance.",
    body: [
      "The first thing most teams notice about MCP is that each client keeps its own idea of a server list. Claude Desktop reads a JSON file, a code editor keeps workspace settings, and a CLI holds its own config. Add a tool and you edit all of them, in three formats.",
      "skillport's answer is boring on purpose: one endpoint per workspace. Whatever the client, the configuration is the same URL and the same OAuth flow. The registry decides which skills exist, and the client does not need to know.",
      "That also means access control has a single place to live. Removing a skill from a workspace removes it from every client that uses the endpoint, without a migration.",
    ],
  },
  {
    slug: "pinned-versions",
    title: "Why a skill install is a pinned version",
    date: "2026-11-06",
    excerpt:
      "Floating versions are convenient until a provider changes a response shape and an agent quietly starts failing.",
    body: [
      "Agents are harder to debug than programs because the failure usually looks like bad reasoning. In practice it is often a tool that changed underneath the model: a field renamed, a limit lowered, a summary rewritten.",
      "Installing a skill resolves to an immutable manifest with a hash. The version you installed keeps returning the same shape until you ask for a new one, and the registry keeps old versions addressable.",
      "The tradeoff is deliberate. You miss automatic improvements, so the CLI prints the available versions and the site shows what changed. Upgrading is one command and a diff, not a surprise.",
    ],
  },
  {
    slug: "tool-schemas",
    title: "What an MCP tool schema is actually for",
    date: "2026-10-24",
    excerpt:
      "A schema is not documentation. It is the contract the client validates against before a call leaves the machine.",
    body: [
      "Tool descriptions get most of the attention, but the schema does the quieter work. It tells the client which arguments exist, which are required and what shape they take, so a malformed call can be caught locally instead of after a round trip.",
      "For skills, the schema is generated from the manifest rather than written by hand. That keeps types, defaults and required fields in one place, and it means a published version cannot drift from what the agent sees.",
      "It also makes the registry searchable in a useful way. A client can look at input types to decide whether a skill fits the task, without asking a model to read prose and guess.",
    ],
  },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function BlogIndex() {
  usePageMeta({
    title: "Blog — skillport",
    description:
      "Notes on MCP clients, skill versioning and tool schemas from the team building skillport.",
    path: "/blog",
  });

  return (
    <Page>
      <PageHeader
        title="Blog"
        lede="Notes on the protocol, the registry and the parts that turned out to be harder than expected."
      />

      <ul className="post-list">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="post-row">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <ArrowIcon size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const post = POSTS.find((entry) => entry.slug === slug);

  usePageMeta({
    title: post ? `${post.title} — skillport` : "Post not found — skillport",
    description: post ? post.excerpt : "This post does not exist.",
    path: `/blog/${slug}`,
    type: "article",
    noindex: !post,
  });

  if (!post) return <NotFound />;

  return (
    <Page>
      <article className="post">
        <Link className="text-link" to="/blog">
          All posts
        </Link>
        <header>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <h1>{post.title}</h1>
          <p className="page-lede">{post.excerpt}</p>
        </header>
        <div className="prose">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Page>
  );
}
