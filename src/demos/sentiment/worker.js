// Runs the model off the main thread so the page stays responsive while it downloads and predicts.
import { env, pipeline } from "@huggingface/transformers";
import { cleanTweet } from "./cleanTweet.js";
import { MODEL_ID } from "./config.js";
env.allowLocalModels = false;

let classifierPromise = null;

function load() {
  if (!classifierPromise) {
    const files = {};
    classifierPromise = pipeline("text-classification", MODEL_ID, {
      dtype: "q8", // int8 weights: about a quarter of the full model's download
      progress_callback: (p) => {
        if (p.status === "progress" && p.total) {
          files[p.file] = { loaded: p.loaded, total: p.total };
          const loaded = Object.values(files).reduce((s, f) => s + f.loaded, 0);
          const total = Object.values(files).reduce((s, f) => s + f.total, 0);
          self.postMessage({ type: "progress", loaded, total });
        }
      },
    });
  }
  return classifierPromise;
}

self.onmessage = async ({ data }) => {
  try {
    if (data.type === "load") {
      await load();
      self.postMessage({ type: "ready" });
    } else if (data.type === "classify") {
      const classify = await load();
      const started = performance.now();
      const scores = await classify(cleanTweet(data.text), { top_k: null });
      self.postMessage({ type: "result", id: data.id, scores, ms: performance.now() - started });
    }
  } catch (error) {
    self.postMessage({ type: "error", message: String(error?.message || error) });
  }
};
