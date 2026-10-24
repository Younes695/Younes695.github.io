/**
 * The "A" mark: a tilted gradient tile with a glossy edge and a soft glow.
 * The letter is two bold strokes and a crossbar. The tile straightens and lifts on hover.
 */
export default function LogoMark({ size = 40 }) {
  return (
    <span
      className="relative grid flex-none -rotate-6 place-items-center rounded-xl bg-[linear-gradient(135deg,#2dd4bf_0%,#0ea5e9_100%)] shadow-[0_0_24px_rgba(45,212,191,0.35)] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:shadow-[0_0_32px_rgba(45,212,191,0.55)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Glossy highlight along the top-left edge. */}
      <span className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.45),transparent_55%)] p-px [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]" />
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none" className="relative">
        <path d="M5.5 19.5 12 4.5l6.5 15" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.4 14h7.2" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
