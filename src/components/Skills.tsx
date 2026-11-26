import { useEffect, useMemo, useRef, useState } from "react";
import { SKILLS, formatStars, portCode, type Category } from "../data/skills";
import { Link } from "../lib/router";
import {
  ArrowIcon,
  ChevronDownIcon,
  CodeIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  PaletteIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
} from "./Icons";

function monogram(name: string) {
  return name.slice(0, 2).toUpperCase();
}

type FolderMeta = {
  category: Category;
  title: string;
  description: string;
  Icon: typeof PaletteIcon;
  accent: string;
};

const FOLDERS: FolderMeta[] = [
  {
    category: "Design",
    title: "Design Skills",
    description: "UI/UX, design systems, visual art, canvas graphics, and brand styling",
    Icon: PaletteIcon,
    accent: "#e5a44b",
  },
  {
    category: "Security",
    title: "Security Skills",
    description: "Vulnerability audits, secrets scanning, dependency checks, and API hardening",
    Icon: ShieldIcon,
    accent: "#ef4444",
  },
  {
    category: "Data",
    title: "Data Skills",
    description: "Multi-repo code discovery, spreadsheets, SQL query optimization, and ETL pipelines",
    Icon: DatabaseIcon,
    accent: "#06b6d4",
  },
  {
    category: "Software",
    title: "Software Skills",
    description: "React, TypeScript, Cloudflare workers, MCP tooling, Docker, and developer workflows",
    Icon: CodeIcon,
    accent: "#3b82f6",
  },
  {
    category: "Documentation",
    title: "Documentation Skills",
    description: "Architecture specs, co-authoring workflows, PDF/Word/PPT generation, and repo tours",
    Icon: FileTextIcon,
    accent: "#10b981",
  },
];

type SkillsProps = {
  showHeader?: boolean;
};

export default function Skills({ showHeader = true }: SkillsProps) {
  const [query, setQuery] = useState("");
  // Track open state for each folder category. Default to first folder open or all open when searching.
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    Design: true,
    Security: false,
    Data: false,
    Software: false,
    Documentation: false,
  });
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

  const term = query.trim().toLowerCase();

  // Group skills by category with global index for stable port code
  const indexedSkills = useMemo(() => {
    return SKILLS.map((skill, index) => ({ skill, index }));
  }, []);

  // Filter skills by search query
  const folderData = useMemo(() => {
    return FOLDERS.map((folder) => {
      const skillsInFolder = indexedSkills.filter(({ skill }) => skill.category === folder.category);
      const matchingSkills = skillsInFolder.filter(({ skill }) => {
        if (!term) return true;
        return (
          skill.name.toLowerCase().includes(term) ||
          skill.description.toLowerCase().includes(term) ||
          skill.repo.toLowerCase().includes(term) ||
          skill.category.toLowerCase().includes(term) ||
          skill.language.toLowerCase().includes(term)
        );
      });
      return {
        ...folder,
        totalCount: skillsInFolder.length,
        matchingSkills,
        matchCount: matchingSkills.length,
      };
    });
  }, [indexedSkills, term]);

  const totalMatching = useMemo(() => {
    return folderData.reduce((acc, f) => acc + f.matchCount, 0);
  }, [folderData]);

  // When search term changes and is non-empty, auto-expand folders with matches
  useEffect(() => {
    if (term) {
      setOpenFolders((prev) => {
        const next = { ...prev };
        for (const folder of folderData) {
          if (folder.matchCount > 0) {
            next[folder.category] = true;
          }
        }
        return next;
      });
    }
  }, [term, folderData]);

  const toggleFolder = (category: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const areAllExpanded = FOLDERS.every((f) => openFolders[f.category]);

  const toggleAllFolders = () => {
    const nextState = !areAllExpanded;
    const next: Record<string, boolean> = {};
    for (const f of FOLDERS) {
      next[f.category] = nextState;
    }
    setOpenFolders(next);
  };

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      {showHeader ? (
        <div className="section-head">
          <div>
            <h2 id="skills-title">Skills</h2>
            <p>
              Curated agent skills organized by capability. Click any folder to explore skills in that area, or
              install directly via the MCP endpoint.
            </p>
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
            placeholder="Search skills, capabilities, languages, repos…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search skills"
          />
          <kbd aria-hidden="true">/</kbd>
        </div>

        <div className="toolbar-actions">
          <span className="skills-stat">
            {term ? `${totalMatching} of ${SKILLS.length} skills match` : `${SKILLS.length} skills across ${FOLDERS.length} folders`}
          </span>
          <button
            type="button"
            className="folder-toggle-btn"
            onClick={toggleAllFolders}
            aria-label={areAllExpanded ? "Collapse all folders" : "Expand all folders"}
          >
            {areAllExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>

      <div className="skills-folders" role="region" aria-label="Skill folders">
        {folderData.map((folder) => {
          const isOpen = Boolean(openFolders[folder.category]);
          const isFiltering = Boolean(term);
          const hasMatches = folder.matchCount > 0;

          // If filtering and no matches in this folder, hide or dim
          if (isFiltering && !hasMatches) {
            return null;
          }

          const { Icon } = folder;

          return (
            <div
              key={folder.category}
              className={`skill-folder ${isOpen ? "open" : "collapsed"}`}
            >
              <button
                type="button"
                className="skill-folder-head"
                onClick={() => toggleFolder(folder.category)}
                aria-expanded={isOpen}
                aria-controls={`folder-content-${folder.category}`}
              >
                <div className="skill-folder-lead">
                  <span
                    className="skill-folder-icon"
                    style={{ color: folder.accent, borderColor: `${folder.accent}33` }}
                    aria-hidden="true"
                  >
                    {isOpen ? <FolderOpenIcon size={17} /> : <FolderIcon size={17} />}
                  </span>
                  <div className="skill-folder-info">
                    <div className="skill-folder-title-row">
                      <span className="skill-folder-title">{folder.title}</span>
                      <span className="skill-folder-category-badge" style={{ borderColor: `${folder.accent}44` }}>
                        <Icon size={11} className="badge-icon" />
                        {folder.category}
                      </span>
                    </div>
                    <span className="skill-folder-desc">{folder.description}</span>
                  </div>
                </div>

                <div className="skill-folder-tail">
                  <span className="skill-folder-count">
                    {isFiltering ? `${folder.matchCount} matching` : `${folder.totalCount} skills`}
                  </span>
                  <span className={`skill-folder-chevron ${isOpen ? "rotated" : ""}`} aria-hidden="true">
                    <ChevronDownIcon size={15} />
                  </span>
                </div>
              </button>

              {isOpen && (
                <div
                  id={`folder-content-${folder.category}`}
                  className="skill-folder-body"
                >
                  <div className="skill-list inside-folder">
                    {folder.matchingSkills.map(({ skill, index }) => (
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
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {totalMatching === 0 && (
          <div className="empty">
            <p>No skills match “{query}”.</p>
            <button
              type="button"
              className="button small"
              onClick={() => {
                setQuery("");
              }}
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      <div className="list-foot">
        <span>
          Showing {totalMatching} of {SKILLS.length} skills across {FOLDERS.length} folders
        </span>
        <Link className="text-link" to="/registry">
          Open the full registry
          <ArrowIcon size={12} />
        </Link>
      </div>
    </section>
  );
}
