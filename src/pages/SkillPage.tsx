import CodeBlock from "../components/CodeBlock";
import { Page, Section } from "../components/Page";
import { ArrowIcon } from "../components/Icons";
import { SKILLS, findSkill, formatBytes, formatStars, portCode } from "../data/skills";
import { Link } from "../lib/router";
import { MCP_ENDPOINT } from "../lib/site";
import { usePageMeta } from "../lib/seo";
import NotFound from "./NotFound";

const INSTALL = (name: string, version: string) =>
  `{
  "method": "tools/call",
  "params": {
    "name": "skills.install",
    "arguments": { "name": "${name}", "version": "${version}" }
  }
}`;

const SEARCH = (name: string) =>
  `{
  "method": "tools/call",
  "params": {
    "name": "skills.search",
    "arguments": { "query": "${name}", "limit": 5 }
  }
}`;

export default function SkillPage({ slug }: { slug: string }) {
  const found = findSkill(slug);

  usePageMeta({
    title: found ? `${found.skill.owner}/${found.skill.name} — skillport` : "Skill not found — skillport",
    description: found ? found.skill.description : "This skill is not in the registry.",
    path: `/skills/${slug}`,
    type: "article",
    noindex: !found,
  });

  if (!found) return <NotFound />;

  const { skill, index } = found;
  const related = SKILLS.filter(
    (entry) => entry.category === skill.category && entry.name !== skill.name,
  ).slice(0, 3);
  const sourceUrl = `${skill.repoUrl}/tree/${skill.commit}/${skill.sourcePath}`;

  return (
    <Page>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/registry">Registry</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{skill.name}</span>
      </nav>

      <header className="skill-head">
        <h1>
          <span className="skill-head-owner">{skill.owner}/</span>
          {skill.name}
        </h1>
        <p className="page-lede">{skill.long}</p>
        <div className="skill-tags">
          <span className="tag mono">{skill.version}</span>
          <span className="tag">{skill.category}</span>
          <span className="tag">{skill.language}</span>
          <span className="tag">{formatStars(skill.stars)} stars</span>
          <span className="tag">{skill.fileCount} files</span>
          <span className="tag mono">{portCode(index)}</span>
        </div>
      </header>

      <div className="doc-layout">
        <div className="doc-main">
          <Section title="Install" id="install">
            <p>
              Mirrored verbatim from <a href={sourceUrl} target="_blank" rel="noreferrer">{skill.repo}</a>{" "}
              at commit <code>{skill.version}</code>. The MCP server returns every file with its
              sha256, so an install can be verified rather than trusted.
            </p>
            <CodeBlock code={INSTALL(skill.name, skill.version)} title="tools/call" />
            <p>
              Write the returned files to <code>skills/{skill.name}/</code>, then follow the
              instructions in <code>SKILL.md</code>.
            </p>
          </Section>

          <Section title="Find it" id="find">
            <p>Search by capability instead of by name, which is what an assistant does:</p>
            <CodeBlock code={SEARCH(skill.name)} title="tools/call" />
          </Section>

          <Section title="Files" id="files">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Path</th>
                    <th scope="col">Size</th>
                    <th scope="col">sha256</th>
                  </tr>
                </thead>
                <tbody>
                  {skill.files.map((file) => (
                    <tr key={file.path}>
                      <td>
                        <code>{file.path}</code>
                      </td>
                      <td className="mono">{formatBytes(file.bytes)}</td>
                      <td className="mono">{file.sha256.slice(0, 12)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mono muted">
              package {skill.packageSha256.slice(0, 24)} · {formatBytes(skill.bytes)}
            </p>
          </Section>
        </div>

        <aside className="doc-aside">
          <div className="panel">
            <h2>Manifest</h2>
            <dl className="kv">
              <div>
                <dt>Slot</dt>
                <dd className="mono">{portCode(index)}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd className="mono">{skill.version}</dd>
              </div>
              <div>
                <dt>Commit</dt>
                <dd className="mono">{skill.commit.slice(0, 10)}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{skill.category}</dd>
              </div>
              <div>
                <dt>Licence</dt>
                <dd>{skill.license}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    {skill.repo}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Endpoint</dt>
                <dd className="mono">{MCP_ENDPOINT.replace("https://", "")}</dd>
              </div>
            </dl>
          </div>

          <div className="panel">
            <h2>Same category</h2>
            <ul className="aside-list">
              {related.map((entry) => (
                <li key={entry.name}>
                  <Link to={`/skills/${entry.name}`}>
                    {entry.name}
                    <ArrowIcon size={12} />
                  </Link>
                </li>
              ))}
              {related.length === 0 ? <li className="muted">No other skills yet.</li> : null}
            </ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
