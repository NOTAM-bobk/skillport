import { useMemo, useState } from "react";
import { CATEGORIES, SKILLS, type Category } from "../data/skills";
import { ArrowIcon, SearchIcon, StarIcon } from "./Icons";

type Filter = (typeof CATEGORIES)[number];

function monogram(skill: { name: string }) {
  return skill.name.slice(0, 2).toUpperCase();
}

export default function Skills() {
  const [active, setActive] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return SKILLS.filter((skill) => {
      const matchesCategory = active === "All" || skill.category === (active as Category);
      const matchesQuery =
        !term ||
        skill.name.includes(term) ||
        skill.description.toLowerCase().includes(term) ||
        skill.category.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [active, query]);

  return (
    <section className="section" id="skills">
      <div className="section-head">
        <div>
          <h2>Skills</h2>
          <p>Installable capabilities, versioned and reviewed. Drop one into any MCP client.</p>
        </div>
        <a className="text-link" href="#docs">
          Publish a skill
          <ArrowIcon size={13} />
        </a>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon size={14} />
          <input
            type="search"
            placeholder="Search skills, APIs, categories…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search skills"
          />
          <kbd>/</kbd>
        </div>
        <div className="chips" role="tablist" aria-label="Categories">
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
        {visible.map((skill) => (
          <a className="skill-row" key={skill.name} href="#docs">
            <span className="skill-avatar" aria-hidden="true">
              {monogram(skill)}
            </span>
            <span className="skill-body">
              <span className="skill-title">
                <span className="skill-owner">{skill.owner}/</span>
                <span className="skill-name">{skill.name}</span>
                <span className="pill">{skill.version}</span>
              </span>
              <span className="skill-desc">{skill.description}</span>
              <span className="skill-meta">
                <span className="lang">
                  <i style={{ background: skill.color }} />
                  {skill.language}
                </span>
                <span className="meta-item">{skill.category}</span>
                <span className="meta-item">
                  <StarIcon size={11} />
                  {skill.stars}
                </span>
                <span className="meta-item">{skill.runs} runs</span>
              </span>
            </span>
            <span className="skill-action">
              Install
              <ArrowIcon size={12} />
            </span>
          </a>
        ))}

        {visible.length === 0 && (
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
        )}
      </div>

      <div className="list-foot">
        <span>
          Showing {visible.length} of {SKILLS.length} skills
        </span>
        <a className="text-link" href="#docs">
          View all in the registry
          <ArrowIcon size={12} />
        </a>
      </div>
    </section>
  );
}
