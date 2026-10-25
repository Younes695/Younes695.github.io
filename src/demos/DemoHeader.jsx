import { ArrowLeft } from "lucide-react";
import LogoMark from "../components/LogoMark.jsx";

export default function DemoHeader() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <a href="/" className="group flex items-center gap-2.5 font-extrabold text-white">
        <LogoMark size={36} />
        <span className="hidden sm:inline">Abd-Elrahman Wael.</span>
      </a>
      <a
        href="/#projects"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-muted transition-colors hover:border-accent/60 hover:text-white"
      >
        <ArrowLeft size={16} aria-hidden="true" /> All projects
      </a>
    </header>
  );
}
