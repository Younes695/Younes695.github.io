import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { skillGroups } from "../data.js";
import { Icon, Reveal, Section } from "./ui.jsx";

export default function Skills() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === activeId);
  const reduce = useReducedMotion();

  return (
    <Section id="skills" label="Skills" title="What I work with">
      <Reveal className="flex flex-col gap-6">
        <div role="tablist" aria-label="Skill groups" className="flex flex-wrap gap-2">
          {skillGroups.map((g) => {
            const selected = g.id === activeId;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={selected}
                aria-controls="skills-panel"
                onClick={() => setActiveId(g.id)}
                className={`relative inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-colors ${
                  selected ? "border-accent text-ink" : "border-line bg-surface/60 text-muted hover:border-accent/50 hover:text-white"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="skill-tab"
                    className="absolute inset-0 -z-10 rounded-[11px] bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon name={g.icon} size={16} />
                {g.label}
              </button>
            );
          })}
        </div>

        <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`} className="isolate">
          <AnimatePresence mode="wait">
            <motion.ul
              key={group.id}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
                exit: { opacity: 0, transition: { duration: 0.12 } },
              }}
            >
              {group.skills.map((skill) => (
                <motion.li
                  key={skill}
                  variants={{
                    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.96 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
                  }}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="flex min-h-20 items-center gap-3 rounded-2xl border border-line bg-surface/70 p-4 font-semibold text-white transition-colors hover:border-accent/50"
                >
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={group.icon} size={18} />
                  </span>
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
