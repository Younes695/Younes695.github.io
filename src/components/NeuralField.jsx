import { useEffect, useRef } from "react";

// A drifting network of nodes behind the hero. Nodes near each other are linked,
// and the cursor acts like an input neuron: nearby nodes light up and lean toward it.
const LINK_DISTANCE = 150;
const CURSOR_RADIUS = 200;
const ACCENT = [45, 212, 191];

export default function NeuralField({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999, active: false };
    let nodes = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // About one node per 9,000 px², capped so phones and big screens both stay smooth.
      const count = Math.max(28, Math.min(110, Math.round((width * height) / 9000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
        n.glow = 0;
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_RADIUS) {
            n.glow = 1 - d / CURSOR_RADIUS;
            if (!reduceMotion) {
              n.x += dx * 0.006 * n.glow;
              n.y += dy * 0.006 * n.glow;
            }
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DISTANCE) continue;
          const strength = 1 - d / LINK_DISTANCE;
          const lit = Math.max(a.glow, b.glow);
          ctx.strokeStyle = `rgba(${ACCENT.join(",")},${0.18 * strength + 0.55 * lit * strength})`;
          ctx.lineWidth = 0.6 + lit;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (pointer.active) {
        for (const n of nodes) {
          if (n.glow < 0.35) continue;
          ctx.strokeStyle = `rgba(${ACCENT.join(",")},${0.35 * n.glow})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.glow
          ? `rgba(${ACCENT.join(",")},${0.5 + 0.5 * n.glow})`
          : "rgba(148,163,184,0.7)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + n.glow * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      if (visible && !reduceMotion) frame = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
      if (reduceMotion) draw();
    };
    const onLeave = () => {
      pointer.active = false;
      if (reduceMotion) draw();
    };

    // Stop drawing while the hero is off screen or the tab is hidden.
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !wasVisible && !reduceMotion) frame = requestAnimationFrame(loop);
    });
    const onVisibility = () => {
      const wasVisible = visible;
      visible = !document.hidden;
      if (visible && !wasVisible && !reduceMotion) frame = requestAnimationFrame(loop);
    };

    resize();
    loop();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
