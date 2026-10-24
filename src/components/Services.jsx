import { services } from "../data.js";
import { Icon, Section } from "./ui.jsx";

export default function Services() {
  return (
    <Section id="services" eyebrow="Services" title="What I can build for you">
      <div className="reveal grid gap-5 sm:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.title}
            className="flex gap-4 rounded-2xl border border-line bg-surface/70 p-6 transition-colors hover:border-accent/50"
          >
            <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-accent/10 text-accent">
              <Icon name={s.icon} size={22} />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="leading-relaxed text-muted">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
