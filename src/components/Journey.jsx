import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Award, GraduationCap } from "lucide-react";
import { certifications, education, experience } from "../data.js";
import { Reveal, Section, Stagger, StaggerItem } from "./ui.jsx";

export default function Journey() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  // The timeline line fills in as the list scrolls past the middle of the screen.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 50%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <Section id="journey" label="Experience" title="My path so far">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div ref={listRef} className="relative pl-7">
          <span className="absolute top-1 bottom-1 left-[5px] w-px bg-line" aria-hidden="true" />
          <motion.span
            className="absolute top-1 bottom-1 left-[5px] w-px origin-top bg-accent"
            style={{ scaleY: reduce ? 1 : fill }}
            aria-hidden="true"
          />
          <Stagger as="ol" className="flex flex-col gap-9">
            {experience.map((e) => (
              <StaggerItem as="li" key={`${e.title}-${e.when}`} className="relative">
                <span className="absolute top-1.5 -left-[29px] h-3.5 w-3.5 rounded-full border-2 border-accent bg-ink shadow-[0_0_0_4px_rgba(45,212,191,0.12)]" aria-hidden="true" />
                <p className="text-sm font-semibold text-accent">{e.when}</p>
                <h3 className="mt-1 text-lg font-bold text-white">{e.title}</h3>
                <p className="text-sm font-semibold text-muted">{e.org}</p>
                <p className="mt-2 leading-relaxed text-text/80">{e.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="flex flex-col gap-6">
          <Reveal className="rounded-2xl border border-line bg-surface/70 p-6">
            <div className="flex items-center gap-3 text-accent">
              <GraduationCap size={22} aria-hidden="true" />
              <h3 className="font-bold text-white">Education</h3>
            </div>
            <p className="mt-4 font-semibold text-white">{education.degree}</p>
            <p className="mt-1 text-sm text-muted">{education.school}</p>
            <p className="mt-2 text-sm text-text/80">
              {education.when}, {education.note}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-2xl border border-line bg-surface/70 p-6">
            <div className="flex items-center gap-3 text-accent">
              <Award size={22} aria-hidden="true" />
              <h3 className="font-bold text-white">Certifications</h3>
            </div>
            <ul className="mt-4 flex flex-col divide-y divide-line">
              {certifications.map((c) => (
                <li key={c.name} className="py-3 transition-transform duration-300 hover:translate-x-1">
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-sm text-muted">
                    {c.issuer}
                    {c.when && `, ${c.when}`}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
