import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from the root of younes695.github.io, so the base path is "/".
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    // Each demo is its own page, so the main site never downloads the ML library.
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        sentiment: resolve(import.meta.dirname, "demos/sentiment/index.html"),
      },
    },
  },
  worker: { format: "es" },
});
