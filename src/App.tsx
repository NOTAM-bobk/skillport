import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <div className="glow" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Features />
      </main>
      <Footer />
    </>
  );
}
