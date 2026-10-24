import { useEffect, useState } from "react";
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
      if (window.scrollY < window.innerHeight * 0.4) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Highlight the link of the section that crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && window.scrollY >= window.innerHeight * 0.4) setActive(entry.target.id);
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

  const linkClass = (id) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      active === id ? "text-accent" : "text-muted hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-colors ${
          scrolled || open ? "border-line bg-ink/80 backdrop-blur-md" : "border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 font-extrabold text-white" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm text-ink">AY</span>
          <span className="hidden sm:inline">{profile.name.split(" ")[0]}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={linkClass(id)}>
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
      </nav>

      {open && (
        <div className="mx-auto mt-2 flex max-w-6xl flex-col rounded-2xl border border-line bg-ink/95 p-2 backdrop-blur-md md:hidden">
          {[...LINKS, { id: "contact", label: "Contact" }].map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={`${linkClass(id)} py-3`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
