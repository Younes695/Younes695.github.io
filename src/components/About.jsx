import { about } from "../data.js";
import { Reveal, Section } from "./ui.jsx";

export default function About() {
  return (
    <Section id="about" label="About" title="AI engineering, from notebook to working app">
      <Reveal className="flex max-w-3xl flex-col gap-4 text-lg leading-relaxed text-text/85">
        {about.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </Reveal>
    </Section>
  );
}
