import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Registry from "./pages/Registry";
import SkillPage from "./pages/SkillPage";
import Docs from "./pages/Docs";
import McpSpec from "./pages/McpSpec";
import Cli from "./pages/Cli";
import Publish from "./pages/Publish";
import About from "./pages/About";
import Changelog from "./pages/Changelog";
import Status from "./pages/Status";
import { BlogIndex, BlogPost } from "./pages/Blog";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { useRoute } from "./lib/router";

function renderRoute(path: string) {
  if (path === "/") return <Home />;
  if (path === "/registry") return <Registry />;
  if (path.startsWith("/skills/")) return <SkillPage slug={decodeURIComponent(path.slice(8))} />;
  if (path === "/docs") return <Docs />;
  if (path === "/docs/mcp") return <McpSpec />;
  if (path === "/cli") return <Cli />;
  if (path === "/publish") return <Publish />;
  if (path === "/about") return <About />;
  if (path === "/changelog") return <Changelog />;
  if (path === "/status") return <Status />;
  if (path === "/blog") return <BlogIndex />;
  if (path.startsWith("/blog/")) return <BlogPost slug={decodeURIComponent(path.slice(6))} />;
  if (path === "/contact") return <Contact />;
  if (path === "/privacy") return <Privacy />;
  return <NotFound />;
}

export default function App() {
  const { path, hash } = useRoute();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0 });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [path, hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">{renderRoute(path)}</main>
      <Footer />
    </>
  );
}
