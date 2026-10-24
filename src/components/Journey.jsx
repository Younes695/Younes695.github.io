import { Award, GraduationCap } from "lucide-react";
import { certifications, education, experience } from "../data.js";
import { Section } from "./ui.jsx";

export default function Journey() {
  return (
    <Section id="journey" eyebrow="Experience" title="My path so far">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <ol className="reveal relative flex flex-col gap-8 border-l border-line pl-6">
          {experience.map((e) => (
            <li key={`${e.title}-${e.when}`} className="relative">
              <span className="absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 border-accent bg-ink" aria-hidden="true" />
              <p className="font-mono text-xs tracking-wider text-accent uppercase">{e.when}</p>
              <h3 className="mt-1 text-lg font-bold text-white">{e.title}</h3>
              <p className="text-sm font-semibold text-muted">{e.org}</p>
              <p className="mt-2 leading-relaxed text-text/80">{e.text}</p>
            </li>
          ))}
        </ol>

        <div className="reveal flex flex-col gap-6">
          <div className="rounded-2xl border border-line bg-surface/70 p-6">
            <div className="flex items-center gap-3 text-accent">
              <GraduationCap size={22} aria-hidden="true" />
              <h3 className="font-bold text-white">Education</h3>
            </div>
            <p className="mt-4 font-semibold text-white">{education.degree}</p>
            <p className="mt-1 text-sm text-muted">{education.school}</p>
            <p className="mt-2 text-sm text-text/80">
              {education.when} · {education.note}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface/70 p-6">
            <div className="flex items-center gap-3 text-accent">
              <Award size={22} aria-hidden="true" />
              <h3 className="font-bold text-white">Certifications</h3>
            </div>
            <ul className="mt-4 flex flex-col divide-y divide-line">
              {certifications.map((c) => (
                <li key={c.name} className="py-3">
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-sm text-muted">
                    {c.issuer}
                    {c.when && ` · ${c.when}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
