import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";

const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Types each phrase, holds it, deletes it, then moves to the next one. */
export function useTypewriter(phrases, { typeMs = 55, deleteMs = 30, holdMs = 1600 } = {}) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(reduce ? phrases[0] : "");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    const phrase = phrases[index % phrases.length];
    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && text === phrase) delay = holdMs;
    const id = setTimeout(() => {
      if (!deleting && text === phrase) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setText(phrase.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(id);
  }, [text, index, deleting, phrases, reduce, typeMs, deleteMs, holdMs]);

  return reduce ? phrases[0] : text;
}

/**
 * Card that tilts toward the cursor and shows a soft light where the cursor is.
 * Touch screens and reduced-motion users get a plain card.
 */
export function TiltCard({ children, className = "", max = 6, as: Tag = "div" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const MotionTag = motion[Tag] ?? motion.div;

  const onMove = (e) => {
    if (reduce || !canHover()) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set(-(py - 0.5) * 2 * max);
    ref.current.style.setProperty("--spot-x", `${px * 100}%`);
    ref.current.style.setProperty("--spot-y", `${py * 100}%`);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <MotionTag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`spotlight ${className}`}
    >
      {children}
    </MotionTag>
  );
}

/** Counts up to the number inside `value` ("123 hrs", "3.61", "8/13") once it is on screen. */
export function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const suffix = match ? match[2] : "";
  const isNumber = Boolean(match);
  const [shown, setShown] = useState(reduce || !isNumber ? target : 0);

  useEffect(() => {
    if (!inView || reduce || !isNumber) return undefined;
    const controls = animate(0, target, { duration: 1.4, ease: "easeOut", onUpdate: setShown });
    return () => controls.stop();
  }, [inView, reduce, target, isNumber]);

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">
        {shown.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}

/** Wraps a button or link so it drifts slightly toward the cursor. */
export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });

  const onMove = (e) => {
    if (reduce || !canHover()) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} className="inline-flex">
      {children}
    </motion.span>
  );
}

/** Thin bar at the very top that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-accent to-sky-400"
    />
  );
}

/** Soft light that follows the cursor across the whole page (desktop only). */
export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !canHover()) return undefined;
    const onMove = (e) => {
      x.set(e.clientX - 250);
      y.set(e.clientY - 250);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-0 hidden h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.08),transparent_65%)] md:block"
    />
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.a
      href="#top"
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.25 }}
      className="fixed right-5 bottom-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-line bg-surface/90 text-accent shadow-lg backdrop-blur transition-colors hover:border-accent"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </motion.a>
  );
}
