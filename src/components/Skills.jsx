import { useState } from "react";
import { skillGroups } from "../data.js";
import { Icon, Section } from "./ui.jsx";

export default function Skills() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === activeId);

  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      <div className="reveal flex flex-col gap-6">
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
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-colors ${
                  selected
                    ? "border-accent bg-accent text-ink"
                    : "border-line bg-surface/60 text-muted hover:border-accent/50 hover:text-white"
                }`}
              >
                <Icon name={g.icon} size={16} />
                {g.label}
              </button>
            );
          })}
        </div>

        <ul
          id="skills-panel"
          role="tabpanel"
          aria-labelledby={`tab-${group.id}`}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {group.skills.map((skill) => (
            <li
              key={skill}
              className="flex min-h-20 items-center gap-3 rounded-2xl border border-line bg-surface/70 p-4 font-semibold text-white transition-colors hover:border-accent/50"
            >
              <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent/10 text-accent">
                <Icon name={group.icon} size={18} />
              </span>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
