import { useState } from "react";
import { Check, Copy, FileDown, Mail, Phone } from "lucide-react";
import { profile, socials } from "../data.js";
import BrandIcon, { BRAND_COLORS } from "./BrandIcon.jsx";
import { Magnetic } from "./effects.jsx";
import { Reveal, Section, Stagger, StaggerItem } from "./ui.jsx";

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the link next to it still works.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-line text-muted transition-colors hover:border-accent/60 hover:text-white"
    >
      {copied ? <Check size={18} aria-hidden="true" className="text-accent" /> : <Copy size={18} aria-hidden="true" />}
    </button>
  );
}

function ContactRow({ icon, title, value, href, copyLabel }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink/40 p-3 pr-3 transition-colors hover:border-accent/40">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-accent/10 text-accent">{icon}</span>
      <a href={href} className="min-w-0 flex-1">
        <span className="block text-xs text-muted">{title}</span>
        <span className="block truncate font-bold text-white">{value}</span>
      </a>
      <CopyButton value={value} label={copyLabel} />
    </div>
  );
}

export default function Contact() {
  const whatsapp = socials.find((s) => s.id === "whatsapp");

  return (
    <Section id="contact" label="Contact" title="Have a project in mind?">
      <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-6 sm:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="max-w-xl text-lg leading-relaxed text-text/85">
              Tell me what you want to build, a chatbot over your documents, a prediction model or an AI feature in your
              app, and I'll reply with how I'd approach it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-5 font-bold text-ink transition-colors hover:bg-accent-strong"
                >
                  <Mail size={18} aria-hidden="true" /> Send an email
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ "--brand": BRAND_COLORS.whatsapp }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[var(--brand)]/60 px-5 font-bold text-white transition-colors hover:bg-[var(--brand)] hover:text-ink"
                >
                  <BrandIcon id="whatsapp" size={18} /> Chat on WhatsApp
                </a>
              </Magnetic>
            </div>
            <div className="flex flex-col gap-3">
              <ContactRow icon={<Mail size={20} aria-hidden="true" />} title="Email" value={profile.email} href={`mailto:${profile.email}`} copyLabel="email" />
              <ContactRow icon={<Phone size={20} aria-hidden="true" />} title="Phone" value={profile.phone} href={profile.phoneLink} copyLabel="phone number" />
              <a
                href={profile.cv}
                download
                className="flex items-center gap-3 rounded-2xl border border-line bg-ink/40 p-3 transition-colors hover:border-accent/40"
              >
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-accent/10 text-accent">
                  <FileDown size={20} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-xs text-muted">CV</span>
                  <span className="block font-bold text-white">Download my CV (PDF)</span>
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-semibold text-white">Find me on</p>
            <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {socials.map((s) => (
                <StaggerItem as="li" key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ "--brand": BRAND_COLORS[s.id] }}
                    className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-ink/40 p-3 text-sm font-bold text-muted transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:text-white hover:shadow-[0_12px_30px_-14px_var(--brand)]"
                  >
                    <span className="transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--brand)]">
                      <BrandIcon id={s.id} size={26} />
                    </span>
                    {s.label}
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
