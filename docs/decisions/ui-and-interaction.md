# Decisions: UI and interaction

Entries in date order. Status flags: active / superseded / partly superseded.

## 2026-10-17 — Antiquated look
- Status: active
- Visual direction: vellum (chosen over Roma wagon and hybrid).
- Parchment ground, ink-black serif type, manuscript details (e.g. drop cap, ruled margins).
- Why: fits sayings from many cultures; avoids leaning on one culture's imagery.
- Open: fonts, palette specifics.

## 2026-10-17 — Visible dice, staggered roll animation
- Status: active
- All three dice visible on screen.
- Roll animation stops one die at a time (sequential settle), then the phrase appears.
- Developer note for later; implementation not started.

## 2026-10-17 — Core interactions
- Status: active
- Copy a phrase; save phrases; reroll for another.
- Saved phrases persist in browser `localStorage` only; no accounts. No cross-device sync.

## 2026-10-17 — Front-end implementation choices
- Status: active
- Plain HTML/CSS/JS, no build step; chosen while hosting was on hold (hold since lifted; GitHub Pages). Needs HTTP (fetch of data/phrases.json).
- Dice drawn as flat SVG diamonds with the number (not 3D), system serif stack (Palatino/Georgia), palette: vellum #efe3c2, ink #2a1d12, rubric #8c2a1c.
- Saved list stores keys only (corpus is static); copy includes full attribution.
- Resolves "Open: fonts, palette specifics" above.

## 2026-10-17 — Manual dice entry
- Status: active
- Developer request: let people enter numbers from their own physical dice; section must read "Three eight-sided dice."
- Implemented as the section heading above three 1-8 selects (selects prevent invalid input). Wording placement (heading, not subtitle) was my reading; confirm.

## 2026-10-17 — Quote text never under the initial cap
- Status: active
- Developer request. Cap is a separate column; all lines indent to its right.
