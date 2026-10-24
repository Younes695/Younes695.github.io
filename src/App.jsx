import Navbar from "./components/Navbar.jsx";
import Hero, { SocialLinks } from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Services from "./components/Services.jsx";
import Journey from "./components/Journey.jsx";
import Contact from "./components/Contact.jsx";
import { BackToTop, CursorGlow, ScrollProgress } from "./components/effects.jsx";
import Analytics from "./components/Analytics.jsx";
import { profile } from "./data.js";

export default function App() {
  return (
    <div className="bg-grid relative min-h-screen overflow-x-clip">
      <ScrollProgress />
      <CursorGlow />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Journey />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-1 text-sm text-muted">
            <p className="font-bold text-white">{profile.brandName}</p>
            <p>
              © {new Date().getFullYear()} {profile.name}. Built with React and Tailwind CSS.
            </p>
          </div>
          <SocialLinks size={40} iconSize={17} />
        </div>
      </footer>
      <BackToTop />
      <Analytics />
    </div>
  );
}
