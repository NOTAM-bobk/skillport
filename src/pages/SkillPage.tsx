import CodeBlock from "../components/CodeBlock";
import { Page, Section } from "../components/Page";
import { ArrowIcon } from "../components/Icons";
import { SKILLS, findSkill, portCode } from "../data/skills";
import { Link } from "../lib/router";
import { MCP_ENDPOINT, REPO_URL } from "../lib/site";
import { usePageMeta } from "../lib/seo";
import NotFound from "./NotFound";

const INSTALL = (owner: string, name: string, version: string) =>
  `{
  "skill": "${owner}/${name}",
  "version": "${version}",
  "registry": "${MCP_ENDPOINT}"
}`;

const CALL = (owner: string, name: string) =>
  `{
  "method": "tools/call",
  "params": {
    "name": "skills.run",
    "arguments": {
      "skill": "${owner}/${name}",
      "input": {}
    }
  }
}`;

export default function SkillPage({ slug }: { slug: string }) {
  const found = findSkill(slug);

  usePageMeta({
    title: found ? `${found.skill.owner}/${found.skill.name} — skillport` : "Skill not found — skillport",
    description: found
      ? found.skill.long
      : "This skill is not in the registry.",
    path: `/skills/${slug}`,
    type: "article",
    noindex: !found,
  });

  if (!found) return <NotFound />;

  const { skill, index } = found;
  const related = SKILLS.filter(
    (entry) => entry.category === skill.category && entry.name !== skill.name,
  ).slice(0, 3);

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
          <span className="tag">{skill.version}</span>
          <span className="tag">{skill.category}</span>
          <span className="tag">{skill.language}</span>
          <span className="tag">{skill.stars} stars</span>
          <span className="tag">{skill.runs} runs</span>
          <span className="tag mono">{portCode(index)}</span>
        </div>
      </header>

      <div className="doc-layout">
        <div className="doc-main">
          <Section title="Install" id="install">
            <p>
              Add the endpoint to your client, then ask for the skill by name. Versions are pinned
              on install, so later releases do not change a running agent.
            </p>
            <CodeBlock code={INSTALL(skill.owner, skill.name, skill.version)} title="install request" />
          </Section>

          <Section title="Parameters" id="parameters">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {skill.params.map((param) => (
                    <tr key={param.name}>
                      <td>
                        <code>{param.name}</code>
                      </td>
                      <td className="mono">{param.type}</td>
                      <td>{param.required ? "Yes" : "No"}</td>
                      <td>{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Call it" id="call">
            <p>
              The agent calls <code>skills.run</code> with the pinned skill name. Structured output
              comes back in the same response.
            </p>
            <CodeBlock code={CALL(skill.owner, skill.name)} title="tools/call" />
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
                <dt>Category</dt>
                <dd>{skill.category}</dd>
              </div>
              <div>
                <dt>Runtime</dt>
                <dd>{skill.language}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </dd>
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
