# Decisions: dice and mapping

Entries in date order. Status flags: active / superseded / partly superseded.

## 2026-10-17 — Ordered triples, 512 outcomes
- Status: active
- Roll 3d8; (2,5,1) ≠ (1,2,5). 8×8×8 = 512 phrases, one per ordered triple.
- Why: unordered gives only 120; developer wants 512. Confirmed by developer.

## 2026-10-17 — Roll assignment: seeded, region-spread
- Status: active
- `tools/assign_rolls.py` merges `data/batch-*.json` (must total exactly 512), spreads regions evenly across first-die blocks of 64, and writes `data/phrases.json`.
- roll = [d1,d2,d3]; index i (0-511) → d1 = i//64+1, d2 = (i//8)%8+1, d3 = i%8+1. Seed 20261017; same inputs → same file.
- Why: a developer-approved decision to assign rolls only after all 512 are collected; the spread prevents one tradition clustering under one first die.
- Any change to a batch file requires re-running the script; that reshuffles rolls, so lock the corpus before launch.
