import { about, profile } from "../data.js";
import { Section } from "./ui.jsx";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="AI engineering, from notebook to working app">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="reveal flex flex-col gap-4 text-lg leading-relaxed text-text/85">
          {about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <dl className="reveal grid gap-4 sm:grid-cols-3 md:grid-cols-1">
          {profile.facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-line bg-surface/70 p-5">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="mt-1 text-3xl font-extrabold text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
