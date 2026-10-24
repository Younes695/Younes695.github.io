import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projects } from "../data.js";
import BrandIcon from "./BrandIcon.jsx";
import { TiltCard } from "./effects.jsx";
import { Icon, Reveal, Section, Tag } from "./ui.jsx";

const ALL = "All";
const categories = [ALL, ...new Set(projects.map((p) => p.category))];

function Cover({ project }) {
  if (project.image) {
    // App screenshots fill the frame; charts (white background) are shown whole.
    const screenshot = project.imageType === "screenshot";
    return (
      <div className={`aspect-[16/10] overflow-hidden rounded-xl border border-line ${screenshot ? "bg-ink" : "bg-white"}`}>
        <img
          src={project.image}
          alt={`${project.title} preview`}
          loading="lazy"
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
            screenshot ? "object-cover object-top" : "object-contain"
          }`}
        />
      </div>
    );
  }
  return (
    <div className="bg-grid grid aspect-[16/10] place-items-center rounded-xl border border-line bg-surface-2">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        <Icon name={project.cover} size={30} />
      </span>
    </div>
  );
}

function Links({ project }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-2">
      <a
        href={project.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-white transition-colors hover:border-accent/60 hover:text-accent"
      >
        <BrandIcon id="github" size={16} /> Code
      </a>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-ink transition-colors hover:bg-accent-strong"
        >
          <ExternalLink size={16} aria-hidden="true" /> Live demo
        </a>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <TiltCard as="article" max={4} className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface/70 p-4 transition-colors duration-300 hover:border-accent/50">
      <Cover project={project} />
      <div className="flex flex-1 flex-col gap-3 px-1">
        <span className="text-sm font-semibold text-accent">{project.category}</span>
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="leading-relaxed text-muted">{project.summary}</p>
        <p className="text-sm font-semibold text-text/90">{project.result}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <Links project={project} />
      </div>
    </TiltCard>
  );
}

function FeaturedProject({ project }) {
  return (
    <TiltCard
      as="article"
      max={3}
      className="group grid gap-6 rounded-3xl border border-accent/30 bg-surface/80 p-4 sm:p-6 lg:grid-cols-[1.25fr_1fr] lg:items-center"
    >
      <Cover project={project} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">Featured</span>
          <span className="text-sm font-semibold text-accent">{project.category}</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl">{project.title}</h3>
        <p className="text-lg leading-relaxed text-muted">{project.summary}</p>
        <p className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm font-semibold text-accent">
          <ArrowUpRight size={18} className="flex-none" aria-hidden="true" />
          {project.result}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <Links project={project} />
      </div>
    </TiltCard>
  );
}

const cardMotion = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function Projects() {
  const [filter, setFilter] = useState(ALL);
  const reduce = useReducedMotion();
  const featured = projects.find((p) => p.featured);
  const showFeatured = featured && (filter === ALL || filter === featured.category);
  const rest = projects.filter((p) => p !== featured && (filter === ALL || p.category === filter));

  return (
    <Section id="projects" label="Projects" title="Things I've built">
      <div className="flex flex-col gap-8">
        <Reveal className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by area">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={`relative min-h-11 rounded-full border px-4 text-sm font-bold transition-colors ${
                filter === c ? "border-accent text-ink" : "border-line bg-surface/60 text-muted hover:border-accent/50 hover:text-white"
              }`}
            >
              {filter === c && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {c}
            </button>
          ))}
        </Reveal>

        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {showFeatured && (
              <motion.div key={featured.id} layout={!reduce} {...(reduce ? {} : cardMotion)} transition={{ duration: 0.45 }}>
                <FeaturedProject project={featured} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout={!reduce} className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {rest.map((p) => (
                <motion.div key={p.id} layout={!reduce} {...(reduce ? {} : cardMotion)} transition={{ duration: 0.45 }}>
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </Section>
  );
}
