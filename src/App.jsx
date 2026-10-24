import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Services from "./components/Services.jsx";
import Journey from "./components/Journey.jsx";
import Contact from "./components/Contact.jsx";
import { profile } from "./data.js";

export default function App() {
  return (
    <div className="bg-grid min-h-screen">
      {/* Soft accent glow at the top of the page. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(45,212,191,0.12),transparent)]"
        aria-hidden="true"
      />
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Journey />
        <Contact />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Built with React and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
