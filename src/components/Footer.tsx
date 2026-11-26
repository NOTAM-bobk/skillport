import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { MCP_ENDPOINT, REPO_URL, copyText } from "../lib/site";
import { Link } from "../lib/router";
import { BugIcon, GitHubIcon, SkillMark, StarIcon } from "./Icons";
import BugReportModal from "./BugReportModal";
import { triggerConfetti } from "../lib/confetti";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Skills", to: "/#skills" },
      { label: "Registry", to: "/registry" },
      { label: "Changelog", to: "/changelog" },
      { label: "Status", to: "/status" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "MCP spec", to: "/docs/mcp" },
      { label: "CLI", to: "/cli" },
      { label: "Publish a skill", to: "/publish" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "About", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

const REPO_API = REPO_URL.replace("https://github.com/", "https://api.github.com/repos/");
const STARS_KEY = "skillport:stars";
const COMPACT = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default function Footer() {
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const field = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  // The star count is the only number here, and it is read from GitHub rather
  // than typed into the footer. Without it the link still works, so a failed
  // request leaves the label as plain "Star".
  useEffect(() => {
    let cancelled = false;
    try {
      const cached = window.sessionStorage.getItem(STARS_KEY);
      if (cached) {
        setStars(Number(cached));
        return;
      }
    } catch {
      /* storage can be blocked; fall through to the request */
    }

    fetch(REPO_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((repo: { stargazers_count?: number } | null) => {
        if (cancelled || typeof repo?.stargazers_count !== "number") return;
        setStars(repo.stargazers_count);
        try {
          window.sessionStorage.setItem(STARS_KEY, String(repo.stargazers_count));
        } catch {
          /* ignore a full or blocked store */
        }
      })
      .catch(() => {
        /* the link works without a count */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await copyText(MCP_ENDPOINT);
    setCopied(ok);
    setCopyFailed(!ok);
    if (ok) triggerConfetti();
  }

  // Spotlight: the dots under a mouse pointer stay at full strength, everything
  // else dims. Touch and pen get the plain field, there is no hover to follow.
  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !field.current) return;
    const element = field.current;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--df-x", `${x}px`);
      element.style.setProperty("--df-y", `${y}px`);
      element.classList.add("df-lit");
    });
  }

  function onLeave() {
    cancelAnimationFrame(frame.current);
    field.current?.classList.remove("df-lit");
  }

  function toTop() {
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <>
      <footer className="df">
        <div className="df-inner">
          <div className="df-brand">
            <Link className="brand" to="/" aria-label="skillport home">
              <span className="brand-mark">
                <SkillMark size={16} />
              </span>
              <span className="brand-name">skillport</span>
            </Link>
            <p className="df-tagline">
              A skill that finds skills. One MCP endpoint in front of hundreds of tools your agent
              can search, read and install.
            </p>

            <form className="df-form" onSubmit={handleCopy}>
              {/* A visible label, not a placeholder: placeholders vanish while you read. */}
              <label className="df-label" htmlFor="df-endpoint">
                MCP endpoint
              </label>
              <div className="df-row">
                <input
                  id="df-endpoint"
                  className="df-input"
                  type="text"
                  name="mcp-endpoint"
                  autoComplete="off"
                  readOnly
                  value={MCP_ENDPOINT}
                  spellCheck={false}
                  onFocus={(event) => event.currentTarget.select()}
                />
                <button className="df-submit" type="submit">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="df-status" role="status">
                {copied && "Copied to clipboard."}
                {copyFailed && "Copy failed. Select the field and copy it by hand."}
              </p>
            </form>
          </div>

          {COLUMNS.map((column) => (
            <nav className="df-col" key={column.title} aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* The name is not drawn: it is the gap in the dots. It is solid where the
            field is dense and dissolves as the dots thin out towards the top. */}
        <div
          aria-hidden="true"
          className="df-band"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <div ref={field} className="df-field">
            {/* One tile wider than the band, slid left by exactly one tile, so the loop is seamless. */}
            <div className="df-dots" />
          </div>
          <p className="df-mark">skillport</p>
        </div>

        <div className="df-base">
          <div className="df-base-inner">
            <div className="df-base-left">
              <p>© {new Date().getFullYear()} skillport · Built for the Model Context Protocol</p>
              <Link to="/privacy">Privacy</Link>
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                GitHub Issues
              </a>
              <Link className="df-status-link" to="/status">
                <span className="df-dot-ok" aria-hidden="true" />
                Status
              </Link>
            </div>

            <div className="df-base-right">
              <a
                className="df-icon-btn"
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="skillport repository on GitHub"
              >
                <GitHubIcon size={16} />
              </a>
              <a
                className="df-star"
                href={`${REPO_URL}/stargazers`}
                target="_blank"
                rel="noreferrer"
                aria-label={
                  stars === null
                    ? "Star skillport on GitHub"
                    : `Star skillport on GitHub, ${stars} ${stars === 1 ? "star" : "stars"}`
                }
              >
                <StarIcon size={13} />
                {stars === null ? "Star" : COMPACT.format(stars)}
              </a>
              <button
                type="button"
                className="df-icon-btn df-bug"
                onClick={() => setBugModalOpen(true)}
                aria-label="Report a bug"
                title="Report a bug"
              >
                <BugIcon size={15} />
              </button>
              <span className="df-divider" aria-hidden="true" />
              <button type="button" className="df-top" onClick={toTop}>
                Back to top
                <svg
                  viewBox="0 0 24 24"
                  className="df-top-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 19V5m-6 6 6-6 6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <BugReportModal isOpen={bugModalOpen} onClose={() => setBugModalOpen(false)} />
    </>
  );
}
