import AIWall from "../components/AIWall";
import Features from "../components/Features";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import { usePageMeta } from "../lib/seo";

export default function Home() {
  usePageMeta({
    title: "skillport — the MCP endpoint for agent skills",
    description:
      "One MCP endpoint for a registry of API-backed skills. Search, install and run skills from Claude, Cursor, VS Code, Zed or any Model Context Protocol client.",
    path: "/",
  });

  return (
    <>
      <Hero />
      <AIWall />
      <Skills />
      <Features />
    </>
  );
}
