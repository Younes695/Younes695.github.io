import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { profile } from "../data.js";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "journey", label: "Experience" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      // In the hero no section link is active.
      if (window.scrollY < window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Highlight the link of the section that crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && window.scrollY >= window.innerHeight * 0.5) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <motion.nav
        aria-label="Main"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-3 py-2 transition-colors duration-300 sm:px-4 ${
          scrolled || open ? "border-line bg-ink/75 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md" : "border-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5 font-extrabold text-white" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-lg text-ink transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            {profile.logoLetter}
          </span>
          <span className="text-[15px] sm:text-base">{profile.brandName}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                active === id ? "text-white" : "text-muted hover:text-white"
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-accent/15"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden min-h-11 items-center rounded-xl bg-accent px-4 text-sm font-bold text-ink transition-colors hover:bg-accent-strong sm:inline-flex"
          >
            Contact me
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-2 flex max-w-6xl flex-col rounded-2xl border border-line bg-ink/95 p-2 backdrop-blur-md md:hidden"
          >
            {[...LINKS, { id: "contact", label: "Contact" }].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm font-semibold ${active === id ? "text-accent" : "text-muted hover:text-white"}`}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
