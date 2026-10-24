import { ArrowRight, Mail, MapPin } from "lucide-react";
import { profile } from "../data.js";
import { GitHubIcon, LinkedInIcon } from "./ui.jsx";

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 pt-32 pb-16 sm:px-6 md:flex-row md:pt-40 md:pb-24">
      <div className="flex flex-1 flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          Open to freelance work and internships
        </span>

        <div className="flex flex-col gap-3">
          <p className="font-mono text-sm tracking-[0.2em] text-accent uppercase">Hi, I'm</p>
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl">{profile.name}</h1>
          <p className="text-xl font-bold text-muted sm:text-2xl">{profile.role}</p>
        </div>

        <p className="max-w-xl text-lg leading-relaxed text-text/85">{profile.intro}</p>

        <p className="flex items-center gap-2 text-sm text-muted">
          <MapPin size={16} aria-hidden="true" /> {profile.location}
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-5 font-bold text-ink transition-colors hover:bg-accent-strong"
          >
            View projects <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 font-bold text-white transition-colors hover:border-accent/60"
          >
            Contact me
          </a>
        </div>

        <div className="flex gap-3">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-accent/60 hover:text-white">
            <GitHubIcon width={20} height={20} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-accent/60 hover:text-white">
            <LinkedInIcon width={20} height={20} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-accent/60 hover:text-white">
            <Mail size={20} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="relative w-full max-w-[300px] flex-none sm:max-w-sm md:w-[380px]">
        <div className="absolute -inset-3 rounded-[2rem] bg-accent/15 blur-2xl" aria-hidden="true" />
        <img
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          width="720"
          height="785"
          className="relative aspect-[720/785] w-full rounded-[1.75rem] border border-line object-cover"
        />
      </div>
    </section>
  );
}
