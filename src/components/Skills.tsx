import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, SKILLS, formatStars, portCode, type Category } from "../data/skills";
import { Link } from "../lib/router";
import { ArrowIcon, SearchIcon, StarIcon } from "./Icons";

type Filter = (typeof CATEGORIES)[number];

function monogram(name: string) {
  return name.slice(0, 2).toUpperCase();
}

type SkillsProps = {
  showHeader?: boolean;
};

export default function Skills({ showHeader = true }: SkillsProps) {
  const [active, setActive] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return SKILLS.map((skill, index) => ({ skill, index })).filter(({ skill }) => {
      const matchesCategory = active === "All" || skill.category === (active as Category);
      const matchesQuery =
        !term ||
        skill.name.includes(term) ||
        skill.description.toLowerCase().includes(term) ||
        skill.repo.toLowerCase().includes(term) ||
        skill.category.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [active, query]);

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      {showHeader ? (
        <div className="section-head">
          <div>
            <h2 id="skills-title">Skills</h2>
            <p>Real skills from open-source repos, pinned to a commit and served as files your agent can install.</p>
          </div>
          <Link className="text-link" to="/publish">
            Publish a skill
            <ArrowIcon size={13} />
          </Link>
        </div>
      ) : null}

      <div className="toolbar">
        <div className="search">
          <SearchIcon size={14} />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search skills, repos, categories…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search skills"
          />
          <kbd aria-hidden="true">/</kbd>
        </div>
        <div className="chips" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active === category}
              className={active === category ? "chip active" : "chip"}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="skill-list">
        {visible.map(({ skill, index }) => (
          <Link className="skill-row" key={skill.name} to={`/skills/${skill.name}`}>
            <span className="skill-avatar" aria-hidden="true">
              {monogram(skill.name)}
            </span>
            <span className="skill-body">
              <span className="skill-title">
                <span className="skill-owner">{skill.owner}/</span>
                <span className="skill-name">{skill.name}</span>
                <span className="mono skill-version">{skill.version}</span>
              </span>
              <span className="skill-desc">{skill.description}</span>
              <span className="skill-meta">
                <span className="lang">
                  <i style={{ background: skill.color }} />
                  {skill.language}
                </span>
                <span>{skill.category}</span>
                <span className="meta-item">
                  <StarIcon size={11} />
                  {formatStars(skill.stars)}
                </span>
                <span>{skill.fileCount} files</span>
              </span>
            </span>
            <span className="skill-tail">
              <span className="skill-action">
                Open
                <ArrowIcon size={12} />
              </span>
              <span className="skill-port">{portCode(index)}</span>
            </span>
          </Link>
        ))}

        {visible.length === 0 ? (
          <div className="empty">
            <p>No skills match “{query}”.</p>
            <button
              type="button"
              className="button small"
              onClick={() => {
                setQuery("");
                setActive("All");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : null}
      </div>

      <div className="list-foot">
        <span>
          Showing {visible.length} of {SKILLS.length} skills
        </span>
        <Link className="text-link" to="/registry">
          Open the full registry
          <ArrowIcon size={12} />
        </Link>
      </div>
    </section>
  );
}
