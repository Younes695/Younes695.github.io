import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "motion/react";
import { Check, Download, FileSpreadsheet, KeyRound, Loader2, Upload, X } from "lucide-react";
import BrandIcon from "../../components/BrandIcon.jsx";
import DemoHeader from "../DemoHeader.jsx";
import { MONEY_FIELDS, downloadExcel } from "./excel.js";
import { MODEL, extractReceipt, prepareImage } from "./gemini.js";
import "../../index.css";

const CODE_URL = "https://github.com/Younes695/receipt-extractor";
const fmt = (v) => (v === null || v === undefined || v === "" ? "–" : Number(v).toLocaleString("en-US"));
const pct = (v) => (v === null || v === undefined ? "–" : `${Math.round(v * 100)}%`);

function Mark({ ok }) {
  return ok ? (
    <Check size={16} className="flex-none text-accent" aria-label="matches the annotation" />
  ) : (
    <X size={16} className="flex-none text-red-400" aria-label="differs from the annotation" />
  );
}

/** Read-only view of an example: extracted values with a check against the annotation. */
function ExampleResult({ example }) {
  const { pred, check } = example;
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-surface-2/70 text-left text-muted">
            <tr>
              <th className="p-3 font-semibold">Item</th>
              <th className="p-3 text-right font-semibold">Qty</th>
              <th className="p-3 text-right font-semibold">Price</th>
              <th className="w-10 p-3" aria-label="Check" />
            </tr>
          </thead>
          <tbody>
            {pred.items.map((item, i) => (
              <tr key={`${item.name}-${i}`} className="border-t border-line">
                <td className="p-3 text-white">{item.name}</td>
                <td className="p-3 text-right font-mono text-text/85">{fmt(item.quantity)}</td>
                <td className="p-3 text-right font-mono text-text/85">{fmt(item.price)}</td>
                <td className="p-3">
                  <Mark ok={check.items[i]?.ok} />
                </td>
              </tr>
            ))}
            {check.missed.map((item, i) => (
              <tr key={`missed-${i}`} className="border-t border-line bg-red-400/5">
                <td className="p-3 text-red-200" colSpan={2}>
                  Missed: {item.name}
                </td>
                <td className="p-3 text-right font-mono text-red-200">{fmt(item.price)}</td>
                <td className="p-3">
                  <X size={16} className="text-red-400" aria-hidden="true" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {MONEY_FIELDS.filter(([key]) => key in check.fields).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-ink/40 px-3 py-2">
            <div className="min-w-0">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="font-mono font-semibold text-white">{fmt(pred[key])}</dd>
              {!check.fields[key] && <dd className="font-mono text-xs text-red-300">correct: {fmt(example.truth[key])}</dd>}
            </div>
            <Mark ok={check.fields[key]} />
          </div>
        ))}
      </dl>
    </div>
  );
}

function Examples({ data }) {
  const [active, setActive] = useState(0);
  const example = data.examples[active];
  return (
    <section className="flex flex-col gap-5" aria-labelledby="examples-title">
      <div className="flex flex-col gap-1">
        <h2 id="examples-title" className="text-2xl font-extrabold text-white">
          Examples from the test set
        </h2>
        <p className="text-muted">
          Real receipts the model never saw, with its output checked against the human annotation. Picked to show both
          successes and mistakes.
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Example receipts">
        {data.examples.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
              i === active ? "border-accent bg-accent text-ink" : "border-line bg-surface/60 text-muted hover:border-accent/50 hover:text-white"
            }`}
          >
            Receipt {i + 1}
            <span className={`h-2 w-2 rounded-full ${ex.check.fully_correct ? "bg-emerald-400" : "bg-amber-400"}`} aria-hidden="true" />
            <span className="sr-only">{ex.check.fully_correct ? "(all correct)" : "(has mistakes)"}</span>
          </button>
        ))}
      </div>
      <motion.div
        key={example.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 rounded-3xl border border-line bg-surface/80 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
      >
        <img
          src={example.image}
          alt={`Receipt ${active + 1} from the CORD test set`}
          className="max-h-[560px] w-full rounded-2xl border border-line bg-white object-contain"
        />
        <div className="flex min-w-0 flex-col gap-4">
          <p className={`text-sm font-bold ${example.check.fully_correct ? "text-emerald-300" : "text-amber-300"}`}>
            {example.check.fully_correct ? "Every item and the total match the annotation." : example.note}
          </p>
          <ExampleResult example={example} />
          <button
            type="button"
            onClick={() => downloadExcel(example.pred, `receipt-${active + 1}.xlsx`)}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-white transition-colors hover:border-accent/60"
          >
            <FileSpreadsheet size={16} aria-hidden="true" /> Download as Excel
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/** Editable table for a live extraction, so mistakes can be fixed before exporting. */
function EditableReceipt({ receipt, onChange }) {
  const setItem = (i, key, value) =>
    onChange({ ...receipt, items: receipt.items.map((it, j) => (j === i ? { ...it, [key]: value } : it)) });
  const num = (v) => (v === "" ? null : Number(v));
  const input = "w-full rounded-lg border border-line bg-ink/60 px-2 py-1.5 text-white outline-none focus:border-accent";
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[460px] text-sm">
          <thead className="bg-surface-2/70 text-left text-muted">
            <tr>
              <th className="p-2 font-semibold">Item</th>
              <th className="w-24 p-2 font-semibold">Qty</th>
              <th className="w-32 p-2 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, i) => (
              <tr key={i} className="border-t border-line">
                <td className="p-2">
                  <input aria-label={`Item ${i + 1} name`} className={input} value={item.name ?? ""} onChange={(e) => setItem(i, "name", e.target.value)} />
                </td>
                <td className="p-2">
                  <input aria-label={`Item ${i + 1} quantity`} type="number" className={`${input} font-mono`} value={item.quantity ?? ""} onChange={(e) => setItem(i, "quantity", num(e.target.value))} />
                </td>
                <td className="p-2">
                  <input aria-label={`Item ${i + 1} price`} type="number" className={`${input} font-mono`} value={item.price ?? ""} onChange={(e) => setItem(i, "price", num(e.target.value))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {MONEY_FIELDS.map(([key, label]) => (
          <label key={key} className="flex flex-col gap-1 text-xs text-muted">
            {label}
            <input type="number" className={`${input} font-mono text-sm`} value={receipt[key] ?? ""} onChange={(e) => onChange({ ...receipt, [key]: num(e.target.value) })} />
          </label>
        ))}
      </div>
    </div>
  );
}

function TryYourOwn() {
  const [apiKey, setApiKey] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [seconds, setSeconds] = useState(null);

  const onFile = async (file) => {
    if (!file) return;
    setReceipt(null);
    setError("");
    setImage(await prepareImage(file));
  };

  const run = async () => {
    setStatus("loading");
    setError("");
    const started = performance.now();
    try {
      setReceipt(await extractReceipt(apiKey.trim(), image.base64, "image/jpeg"));
      setSeconds((performance.now() - started) / 1000);
      setStatus("done");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  };

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-line bg-surface/80 p-4 sm:p-7" aria-labelledby="try-title">
      <div className="flex flex-col gap-1">
        <h2 id="try-title" className="text-2xl font-extrabold text-white">
          Try your own receipt
        </h2>
        <p className="text-muted">
          Uses your own free Gemini API key (
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline">
            get one here
          </a>
          ). The photo and key go straight from your browser to Google; nothing is stored.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-white">
          <span className="flex items-center gap-2">
            <KeyRound size={16} aria-hidden="true" /> Gemini API key
          </span>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your key"
            className="min-h-11 rounded-xl border border-line bg-ink/60 px-3 font-mono text-white outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-white">
          <span className="flex items-center gap-2">
            <Upload size={16} aria-hidden="true" /> Receipt photo
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="min-h-11 rounded-xl border border-line bg-ink/60 px-3 py-2 text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-white"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={run}
        disabled={!apiKey.trim() || !image || status === "loading"}
        className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-accent px-6 font-bold text-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {status === "loading" ? "Reading the receipt..." : "Extract"}
      </button>
      {error && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}
      {image && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <img src={image.previewUrl} alt="Your receipt" className="max-h-[520px] w-full rounded-2xl border border-line bg-white object-contain" />
          {receipt ? (
            <div className="flex min-w-0 flex-col gap-4" aria-live="polite">
              <p className="text-sm text-muted">Read in {seconds.toFixed(1)} s with {MODEL}. Fix anything that's wrong, then export.</p>
              <EditableReceipt receipt={receipt} onChange={setReceipt} />
              <button
                type="button"
                onClick={() => downloadExcel(receipt, "my-receipt.xlsx")}
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-ink transition-colors hover:bg-accent-strong"
              >
                <Download size={16} aria-hidden="true" /> Download as Excel
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">Press Extract to read this receipt.</p>
          )}
        </div>
      )}
    </section>
  );
}

function Results({ metrics }) {
  const s = metrics.settings;
  const rows = [
    ["lite-schema", "Flash-Lite, schema enforced"],
    ["lite-prompt", "Flash-Lite, schema only in prompt"],
    ["flash-schema", "Flash, schema enforced"],
    ["flash-prompt", "Flash, schema only in prompt"],
  ].filter(([key]) => s[key]);
  return (
    <section className="flex flex-col gap-4" aria-labelledby="results-title">
      <h2 id="results-title" className="text-2xl font-extrabold text-white">
        Measured on 100 test receipts
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-surface-2/70 text-left text-muted">
            <tr>
              <th className="p-3 font-semibold">Setting</th>
              <th className="p-3 text-right font-semibold">Total correct</th>
              <th className="p-3 text-right font-semibold">Item F1</th>
              <th className="p-3 text-right font-semibold">Whole receipt correct</th>
              <th className="p-3 text-right font-semibold">Seconds</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([key, label]) => (
              <tr key={key} className={`border-t border-line ${key === metrics.demo_setting ? "bg-accent/5" : ""}`}>
                <td className="p-3 text-white">
                  {label}
                  {key === metrics.demo_setting && <span className="ml-2 text-xs text-accent">used here</span>}
                </td>
                <td className="p-3 text-right font-mono">{pct(s[key].fields.total.accuracy)}</td>
                <td className="p-3 text-right font-mono">{pct(s[key].items.f1)}</td>
                <td className="p-3 text-right font-mono">{pct(s[key].fully_correct)}</td>
                <td className="p-3 text-right font-mono">{s[key].median_seconds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted">{metrics.takeaway}</p>
    </section>
  );
}

function Page() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    fetch("/demos/receipts/examples.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e) => setLoadError(e.message));
  }, []);

  return (
    <div className="bg-grid min-h-screen">
      <DemoHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 pt-6 pb-20 sm:px-6">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-accent">
            <FileSpreadsheet size={16} aria-hidden="true" /> Live demo
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Receipt to Excel</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-text/85">
            A photo of a receipt goes in; items, quantities, prices and totals come out as structured data and an Excel file.
            Gemini reads the image and returns JSON that has to match a fixed schema.
          </p>
        </div>
        {loadError && <p role="alert" className="text-red-300">Couldn't load the examples ({loadError}).</p>}
        {data && <Examples data={data} />}
        <TryYourOwn />
        {data && <Results metrics={data.metrics} />}
        <div className="flex flex-wrap items-center gap-3">
          <a href={CODE_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold text-white transition-colors hover:border-accent/60">
            <BrandIcon id="github" size={16} /> Code and evaluation
          </a>
          <span className="text-xs text-muted">Receipts from the CORD dataset (Clova AI, CC BY 4.0)</span>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
