# Portfolio site

Personal portfolio of Abd-Elrahman Wael Younes, built with React, Vite and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

## Add a project

All content is in `src/data.js`. Add one object to `projects` (and its image to `public/projects/`). The filter chips update from the `category` field.

## Build

```bash
npm run build
```

The static site is written to `dist/`.

## Deploy

```bash
bash scripts/deploy.sh
```

Builds the site and pushes `dist/` to the `gh-pages` branch. GitHub Pages serves that branch at https://younes695.github.io.
