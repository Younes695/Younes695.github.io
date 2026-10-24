import { motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  Brain,
  Circle,
  Container,
  Database,
  FileSearch,
  LineChart,
  MessagesSquare,
  Rocket,
  Server,
  Sparkles,
} from "lucide-react";

// Icons data.js refers to by name. Listed explicitly so the bundle only ships these.
const ICONS = { BookOpen, Brain, Container, Database, FileSearch, LineChart, MessagesSquare, Rocket, Server, Sparkles };

export function Icon({ name, ...props }) {
  const Component = ICONS[name] ?? Circle;
  return <Component aria-hidden="true" {...props} />;
}

const EASE = [0.22, 1, 0.36, 1];

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({ children, className = "", delay = 0, as = "div", ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      {...rest}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const staggerChild = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

/** A list whose children (StaggerItem) appear one after another. */
export function Stagger({ children, className = "", as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      variants={staggerParent}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = "", as = "div" }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag className={className} variants={staggerChild}>
      {children}
    </Tag>
  );
}

export function Section({ id, label, title, children, className = "" }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 ${className}`}>
      <Reveal className="mb-12 flex flex-col gap-3">
        <span className="flex items-center gap-3 text-sm font-semibold text-accent">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {label}
        </span>
        <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-[2.75rem] sm:leading-[1.1]">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

export function Tag({ children }) {
  return (
    <span className="rounded-full border border-line bg-surface-2/60 px-3 py-1 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
