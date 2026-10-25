import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Cpu, Loader2, Lock, Sparkles } from "lucide-react";
import BrandIcon from "../../components/BrandIcon.jsx";
import LogoMark from "../../components/LogoMark.jsx";
import { CLASSES, CODE_URL, EXAMPLES, MODEL_URL } from "./config.js";
import "../../index.css";

const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;

function useClassifier() {
  const workerRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const pending = useRef(new Map());

  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    worker.onmessage = ({ data }) => {
      if (data.type === "progress") setProgress({ loaded: data.loaded, total: data.total });
      else if (data.type === "ready") setStatus("ready");
      else if (data.type === "result") {
        pending.current.get(data.id)?.(data);
        pending.current.delete(data.id);
      } else if (data.type === "error") {
        setStatus("error");
        setError(data.message);
      }
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const load = () => {
    if (status === "idle" || status === "error") {
      setStatus("loading");
      setError("");
      workerRef.current.postMessage({ type: "load" });
    }
  };

  const classify = (text) =>
    new Promise((resolve) => {
      const id = crypto.randomUUID();
      pending.current.set(id, resolve);
      workerRef.current.postMessage({ type: "classify", id, text });
    });

  return { status, progress, error, load, classify };
}

function ScoreBars({ scores }) {
  const reduce = useReducedMotion();
  const byLabel = Object.fromEntries(scores.map((s) => [s.label, s.score]));
  const top = scores.reduce((a, b) => (b.score > a.score ? b : a));
  return (
    <ul className="flex flex-col gap-3" aria-label="Scores per class">
      {CLASSES.map((c, i) => {
        const value = byLabel[c.label] ?? 0;
        const isTop = c.label === top.label;
        return (
          <li key={c.label} className={`rounded-xl border p-3 ${isTop ? "border-accent/60 bg-accent/5" : "border-line"}`}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className={`font-bold ${isTop ? "text-white" : "text-muted"}`}>
                <span aria-hidden="true">{c.emoji}</span> {c.name}
              </span>
              <span className="font-mono text-white">{(value * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: c.color }}
                initial={{ width: reduce ? `${value * 100}%` : 0 }}
                animate={{ width: `${value * 100}%` }}
                transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Demo() {
  const { status, progress, error, load, classify } = useClassifier();
  const [text, setText] = useState(EXAMPLES[0]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const queued = useRef(null);

  const run = async (value) => {
    const input = value.trim();
    if (!input) return;
    if (status !== "ready") {
      queued.current = input; // analyze as soon as the model finishes loading
      load();
      return;
    }
    setBusy(true);
    const data = await classify(input);
    setResult({ ...data, text: input });
    setBusy(false);
  };

  useEffect(() => {
    if (status === "ready" && queued.current) {
      const input = queued.current;
      queued.current = null;
      run(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const percent = progress?.total ? Math.min(100, (progress.loaded / progress.total) * 100) : 0;
  const top = result?.scores.reduce((a, b) => (b.score > a.score ? b : a));
  const topClass = top && CLASSES.find((c) => c.label === top.label);

  return (
    <div className="bg-grid min-h-screen">
      <header className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <a href="/" className="group flex items-center gap-2.5 font-extrabold text-white">
          <LogoMark size={36} />
          <span className="hidden sm:inline">Abd-Elrahman Wael.</span>
        </a>
        <a href="/#projects" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-muted transition-colors hover:border-accent/60 hover:text-white">
          <ArrowLeft size={16} aria-hidden="true" /> All projects
        </a>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pt-6 pb-20 sm:px-6">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-accent">
            <Sparkles size={16} aria-hidden="true" /> Live demo
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Egyptian Arabic Sentiment</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-text/85">
            Type a sentence in Egyptian Arabic and the model tells you if it's positive, negative, mixed or objective. It's a
            CAMeLBERT model I fine-tuned on Egyptian tweets, and it runs entirely in your browser.
          </p>
        </div>

        <section className="flex flex-col gap-5 rounded-3xl border border-line bg-surface/80 p-4 sm:p-7" aria-label="Try the model">
          <label htmlFor="input" className="font-semibold text-white">
            Your text
          </label>
          <textarea
            id="input"
            dir="auto"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) run(text);
            }}
            placeholder="اكتب جملة بالمصري..."
            className="w-full resize-y rounded-2xl border border-line bg-ink/60 p-4 text-lg leading-relaxed text-white outline-none focus:border-accent"
          />

          <div className="flex flex-wrap gap-2" aria-label="Example sentences">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                dir="rtl"
                onClick={() => {
                  setText(example);
                  run(example);
                }}
                className="min-h-11 rounded-full border border-line bg-surface-2/60 px-4 text-sm text-muted transition-colors hover:border-accent/60 hover:text-white"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => run(text)}
              disabled={busy || status === "loading" || !text.trim()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-bold text-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(busy || status === "loading") && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              {status === "ready" ? "Analyze" : status === "loading" ? "Loading the model..." : "Load the model and analyze"}
            </button>
            {status !== "ready" && (
              <p className="text-sm text-muted">The model downloads once (about 110 MB), then stays cached in your browser.</p>
            )}
          </div>

          {status === "loading" && (
            <div className="flex flex-col gap-2" role="status" aria-live="polite">
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${percent}%` }} />
              </div>
              <p className="font-mono text-xs text-muted">
                {/* Small files (tokenizer, config) arrive first, so totals grow during the download. */}
                {progress?.total > 1e6
                  ? `Downloading the model: ${mb(progress.loaded)} of ${mb(progress.total)} (${percent.toFixed(0)}%)`
                  : "Starting the download..."}
              </p>
            </div>
          )}

          {status === "error" && (
            <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">
              The model couldn't load: {error}. Check your connection and try again.
            </p>
          )}

          {result && (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 border-t border-line pt-5"
              aria-live="polite"
            >
              <div className="flex flex-col gap-2">
                <p className="text-lg text-white">
                  <span aria-hidden="true">{topClass.emoji}</span> <strong>{topClass.name}</strong>
                </p>
                {/* Its own block with dir="auto", so Arabic reads right-to-left without stray quote marks. */}
                <p dir="auto" className="rounded-xl border border-line bg-ink/40 px-4 py-2 text-white">
                  {result.text}
                </p>
              </div>
              <ScoreBars scores={result.scores} />
              <p className="font-mono text-xs text-muted">Predicted in {result.ms.toFixed(0)} ms on your device</p>
            </motion.div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="How it works">
          <div className="rounded-2xl border border-line bg-surface/70 p-5">
            <Cpu size={20} className="text-accent" aria-hidden="true" />
            <h2 className="mt-3 font-bold text-white">Runs in your browser</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">An int8 ONNX copy of the model runs with Transformers.js. No server is involved.</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface/70 p-5">
            <Lock size={20} className="text-accent" aria-hidden="true" />
            <h2 className="mt-3 font-bold text-white">Private</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">What you type never leaves your device. Only the model files are downloaded.</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface/70 p-5">
            <Sparkles size={20} className="text-accent" aria-hidden="true" />
            <h2 className="mt-3 font-bold text-white">Measured</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Test macro-F1 0.54 vs 0.45 for a TF-IDF baseline. Mixed opinions and sarcasm are its weakest cases.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <a href={CODE_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-white transition-colors hover:border-accent/60">
            <BrandIcon id="github" size={16} /> Code and evaluation
          </a>
          <a href={MODEL_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-white transition-colors hover:border-accent/60">
            <span aria-hidden="true">🤗</span> Model on Hugging Face
          </a>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
