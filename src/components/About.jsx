import { about, profile } from "../data.js";
import { CountUp, TiltCard } from "./effects.jsx";
import { Reveal, Section, Stagger, StaggerItem } from "./ui.jsx";

export default function About() {
  return (
    <Section id="about" label="About" title="AI engineering, from notebook to working app">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <Reveal className="flex flex-col gap-4 text-lg leading-relaxed text-text/85">
          {about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>
        <Stagger as="dl" className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
          {profile.facts.map((f) => (
            <StaggerItem key={f.label}>
              <TiltCard className="rounded-2xl border border-line bg-surface/70 p-5">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="mt-1 text-4xl font-extrabold text-white">
                  <CountUp value={f.value} />
                </dd>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
