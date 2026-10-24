import { services } from "../data.js";
import { TiltCard } from "./effects.jsx";
import { Icon, Section, Stagger, StaggerItem } from "./ui.jsx";

export default function Services() {
  return (
    <Section id="services" label="Services" title="What I can build for you">
      <Stagger className="grid gap-5 sm:grid-cols-2">
        {services.map((s) => (
          <StaggerItem key={s.title}>
            <TiltCard className="group flex h-full gap-4 rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-accent/50">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-ink">
                <Icon name={s.icon} size={22} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="leading-relaxed text-muted">{s.text}</p>
              </div>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
