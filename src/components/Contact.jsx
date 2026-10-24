import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { profile } from "../data.js";
import { GitHubIcon, LinkedInIcon, Section } from "./ui.jsx";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the mailto link still works.
    }
  };

  return (
    <Section id="contact" eyebrow="Contact" title="Have a project in mind?">
      <div className="reveal flex flex-col gap-8 rounded-3xl border border-line bg-surface/80 p-6 sm:p-10">
        <p className="max-w-2xl text-lg leading-relaxed text-text/85">
          Tell me what you want to build, a chatbot over your documents, a prediction model or an AI feature in your app,
          and I'll reply with how I'd approach it.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-bold text-ink transition-colors hover:bg-accent-strong"
          >
            <Mail size={18} aria-hidden="true" /> {profile.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-5 font-bold text-white transition-colors hover:border-accent/60"
          >
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-muted transition-colors hover:border-accent/60 hover:text-white">
            <GitHubIcon width={18} height={18} /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-muted transition-colors hover:border-accent/60 hover:text-white">
            <LinkedInIcon width={18} height={18} /> LinkedIn
          </a>
        </div>
      </div>
    </Section>
  );
}
