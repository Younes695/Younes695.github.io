#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch, which GitHub Pages serves.
set -euo pipefail

cd "$(dirname "$0")/.."
REMOTE="$(git remote get-url origin)"

npm run build
touch dist/.nojekyll  # serve files as-is (no Jekyll processing)

cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(git -C .. rev-parse --short HEAD)"
git push -q --force "$REMOTE" gh-pages
rm -rf .git
echo "Deployed. GitHub Pages updates in about a minute."
