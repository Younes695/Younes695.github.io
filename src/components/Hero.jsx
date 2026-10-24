import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { profile, socials } from "../data.js";
import BrandIcon, { BRAND_COLORS } from "./BrandIcon.jsx";
import NeuralField from "./NeuralField.jsx";
import { Magnetic, useTypewriter } from "./effects.jsx";

const EASE = [0.22, 1, 0.36, 1];

// The page-load sequence: each hero line arrives in turn.
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const line = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

// 7 icons at 42px with 8px gaps fit one row on a 390px phone.
export function SocialLinks({ size = 42, iconSize = 19 }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            title={s.label}
            style={{ "--brand": BRAND_COLORS[s.id], width: size, height: size }}
            className="group grid place-items-center rounded-xl border border-line bg-surface/60 text-muted transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:text-[var(--brand)] hover:shadow-[0_8px_24px_-8px_var(--brand)]"
          >
            <BrandIcon id={s.id} size={iconSize} />
          </a>
        </li>
      ))}
      <li>
        <a
          href={`mailto:${profile.email}`}
          aria-label="Email"
          title="Email"
          style={{ width: size, height: size }}
          className="grid place-items-center rounded-xl border border-line bg-surface/60 text-muted transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
        >
          <Mail size={iconSize} aria-hidden="true" />
        </a>
      </li>
    </ul>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypewriter(profile.focus);

  return (
    <section id="top" className="relative overflow-hidden">
      <NeuralField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 pt-28 pb-20 sm:px-6 md:flex-row md:gap-16">
        <motion.div
          className="flex flex-1 flex-col gap-6"
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.span
            variants={line}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open to freelance work and internships
          </motion.span>

          <motion.div variants={line} className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-muted">Hi, I'm</p>
            <h1 className="text-[2.6rem] leading-[1.02] font-extrabold tracking-tight text-white sm:text-7xl">
              {profile.name}
            </h1>
          </motion.div>

          <motion.p variants={line} className="text-xl font-bold text-white sm:text-2xl">
            {profile.role}
          </motion.p>

          <motion.p variants={line} className="min-h-[3.5rem] max-w-xl text-lg leading-relaxed text-text/85 sm:min-h-0">
            I build <span className="font-semibold text-accent">{typed}</span>
            <span className="caret" aria-hidden="true" />
            <span className="sr-only">{profile.focus.join(", ")}</span>
          </motion.p>

          <motion.p variants={line} className="flex items-center gap-2 text-sm text-muted">
            <MapPin size={16} aria-hidden="true" /> {profile.location}
          </motion.p>

          <motion.div variants={line} className="flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-6 font-bold text-ink shadow-[0_10px_30px_-10px_rgba(45,212,191,0.7)] transition-colors hover:bg-accent-strong"
              >
                View projects
                <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-line bg-surface/70 px-6 font-bold text-white backdrop-blur transition-colors hover:border-accent/60"
              >
                Contact me
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={line}>
            <SocialLinks />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-full max-w-[300px] flex-none sm:max-w-sm md:w-[390px]"
          initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        >
          {/* Slowly turning ring of light behind the photo. */}
          <div className="absolute -inset-[3px] overflow-hidden rounded-[2rem]" aria-hidden="true">
            <div className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(45,212,191,0.95)_70deg,transparent_160deg,rgba(56,189,248,0.75)_250deg,transparent_340deg)] motion-safe:animate-[spin_7s_linear_infinite]" />
          </div>
          <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/15 blur-3xl" aria-hidden="true" />
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            width="720"
            height="785"
            className="relative aspect-[720/785] w-full rounded-[1.85rem] border-4 border-ink object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
