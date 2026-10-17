# Oracular Spectacular

## Concept
App that rolls three eight-sided dice (3d8) and returns one of 512 combinations (8×8×8, ordered). Each combination is keyed to a gnomic phrase or saying. Phrases are drawn mostly from antiquity up to the Romans, with some later-recorded oral traditions; deliberately not all Western. Every phrase shows its source, tradition, era and translator.

## Core features
- Roll 3d8 → one phrase. Three dice visible on screen; roll animation stops one die at a time.
- Reroll for another.
- Copy a phrase.
- Save phrases (browser localStorage).

## UI direction
Antiquated look: vellum (parchment, ink, serif). Details in `decisions/ui-and-interaction.md`.

## State of the project (2026-10-17)
- Corpus: COMPLETE, 512/512, signed off by developer. `data/phrases.json`.
- App code: front-end BUILT (2026-10-17): `index.html`, `style.css`, `app.js` at repo root. No build tooling (plain static files); hosting: GitHub Pages from main, root.
- Git: nothing committed or pushed. Git toplevel is this folder.

## Reading order
1. This file
2. `STATUS.md`
3. `NEXT-SESSION.txt`
4. `standing-rules.md`
5. `decisions/phrase-corpus.md` only if touching the corpus

## Routing table
| Need | File |
|---|---|
| What's built/tested | `STATUS.md` |
| Where we left off | `NEXT-SESSION.txt` |
| Live checks owed | `TESTING-OWED.md` |
| Why a choice was made | `DECISIONS.md` → `decisions/<theme>.md` |
| When something happened | `BUILD-LOG.md` → `build-log/<era>.md` |
| Recurring lessons | `standing-rules.md` |

## Repo layout
- `data/batch-01..20.json` — verified source batches (rolls null). `data/phrases.json` — merged, rolls assigned; the file the app reads.
- `tools/` — `make_batch.py` (verify quotes), `tally.py` (counts), `assign_rolls.py` (merge + rolls), plus the one-off builders `build_batch*.py` and `html2txt.py`.
- `index.html`, `style.css`, `app.js` — the app. Run: `python3 -m http.server` in repo root (fetch needs HTTP, not file://).
- `docs/` — this documentation.

## Architecture notes
- Platform: web, static site, no backend; saves in localStorage. Hosting and tooling TBD (on hold).
- 512 outcomes = ordered triples of d8 (see `decisions/dice-and-mapping.md`); lookup key is "d1-d2-d3" in `data/phrases.json`.
- Dice via `crypto.getRandomValues` with rejection sampling (no modulo bias).
