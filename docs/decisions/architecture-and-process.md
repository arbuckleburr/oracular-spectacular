# Decisions: architecture and process

Entries in date order. Status flags: active / superseded / partly superseded.

## 2026-10-17 — Platform: web
- Status: active
- Chosen by developer.

## 2026-10-17 — Static site, no backend
- Status: active
- Vanilla JS or Vite (no framework); phrases in one `phrases.json`; no accounts.
- Dice via `crypto.getRandomValues` with rejection sampling (no modulo bias).
- Why: one-screen app; framework and backend add cost without benefit.
- Trade-off: saves don't sync across devices.
- Open: GitHub Pages vs Netlify; vanilla vs Vite. Developer said HOLD OFF (2026-10-17): do not decide or scaffold until asked.

## 2026-10-17 — Corpus data format for the app
- Status: active
- The app reads `data/phrases.json`: an array of 512 objects {id, roll:[d1,d2,d3], key:"d1-d2-d3", text, source, tradition, era, translator}. Some Tirukkural texts contain a newline between the two lines of a couplet.
- Do not hand-edit it; regenerate with `python3 -I tools/assign_rolls.py` from the `data/batch-*.json` files.

## 2026-10-17 — Git state
- Status: active
- Repo cloned from github.com/arbuckleburr/oracular-spectacular (it was empty). Nothing committed or pushed. The working folder sits inside a larger git repo in the home directory (origin phdynamic/twitterarchive); check `git rev-parse --show-toplevel` before committing so work lands in the right repo.

## 2026-10-17 — Docs structure: 4 decision themes
- Status: active
- Themes: architecture-and-process, dice-and-mapping, phrase-corpus, ui-and-interaction. Approved by developer.

## 2026-10-17 — Hosting: GitHub Pages
- Status: active (lifts the earlier hold-off on hosting)
- Developer asked to commit, push and set up GitHub Pages. Served from `main`, repo root. No build step, so no Vite.
- Site URL: https://arbuckleburr.github.io/oracular-spectacular/
