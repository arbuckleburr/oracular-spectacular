# Decisions: phrase corpus

Entries in date order. Status flags: active / superseded / partly superseded.

## 2026-10-17 — Scope of sayings
- Status: active
- 512 gnomic phrases/sayings, one per combination.
- Era: ancient history up to the Romans.
- Geography: not all Western; must span multiple traditions.

## 2026-10-17 — Translations: 19th-century, public domain
- Status: active
- Use 19th-century published translations (public domain). Record translator + edition per phrase.
- Why: avoids copyright on modern translations.
- Risk: archaic diction; light spelling modernization allowed only if logged per phrase.

## 2026-10-17 — Attribution on every phrase
- Status: active
- Each phrase carries a source (author + work + locator) or, for anonymous proverbs, tradition + place.

## 2026-10-17 — Balance across eras and places
- Status: active
- Balance eras and regions as evenly as possible; no fixed quota. Report distribution after each batch.
- Note: pre-Roman sources are thin for the Americas and sub-Saharan Africa; may need to relax "ancient" for oral traditions, ask developer first.

## 2026-10-17 — Process: batches of 64
- Status: active
- Draft 64 at a time, one batch per first-die value (d1 = 1..8). Each batch includes sources and a misquotation check; developer reviews before the next.
- Every quote must be verified against the cited translation text, not recalled from memory.

## 2026-10-17 — Entry schema and verification
- Status: active
- Fields: id, roll (null until assigned), text, source, tradition, era, translator.
- `tools/verify.py` checks quotes are verbatim substrings of the source text (whitespace/quote/dash-normalized, case-insensitive).
- Allowed normalizations (not logged per phrase): first letter capitalized; trailing `;` dropped; verse line-breaks joined.
- Aesop morals are Townsend's (1867) wording, not Greek-original text.
- Tradition label is per source text, not the translator's culture.

## 2026-10-17 — Batch 1 reached 64 from reachable sources only
- Status: active
- Batch 1 (`data/batch-01.json`): Greek/Roman 24, Chinese 23, Indian 17. Nothing yet from Egypt, Mesopotamia, Persia, Hebrew/Levant, Africa, Americas, Japan/Korea/SE Asia.
- Why: only Gutenberg texts fetched so far; batch is skewed on purpose to what was verifiable.
- Consequence: later batches must fill the missing regions; per-tradition caps needed before batch 2 (proposal pending developer).
- Roll assignment deferred: assign `roll` after all 512 collected, by seeded shuffle, so traditions don't cluster by first die. Supersedes "one batch per d1 value" for assignment only; batches stay 64 for drafting.

## 2026-10-17 — Per-tradition caps for the 512 (approved)
- Status: active
- Max of 512: Greek/Roman ~18% (92), Chinese ~15% (77), Indian ~15% (77). Remaining ~50% (≥256) from other regions.
- Batch 1 counts toward caps (24 / 23 / 17).
- Developer approved the proposal as a starting point; revisit if other regions can't fill ≥256 verifiably.

## 2026-10-17 — Edition rule relaxed to 1928 where needed
- Status: active
- Default stays 19th-century. Where no verifiable 19th-c. translation exists for a region/text, public-domain editions through 1928 are allowed.
- Why: Ptahhotep (Gunn 1906), Mesopotamian and some Hebrew wisdom texts lack 19th-c. translations; strict rule would leave regions empty.
- Applies to: Egypt, Mesopotamia, Levant/Hebrew, Persia, others as needed. Translator + year logged per phrase (already in schema).
- Supersedes the 19th-c.-only entry above for those regions only.

## 2026-10-17 — Oral traditions allowed where no ancient written source survives
- Status: active
- Regions with no pre-Roman written wisdom texts (sub-Saharan Africa, the Americas, Oceania, etc.) may use proverbs/sayings from oral traditions recorded later (≤1928 editions).
- Era field must say "oral tradition, recorded <year>" instead of an ancient date. Do not fake antiquity.
- Why: otherwise those regions are empty and the "not all Western" goal fails.
- Cap: oral-tradition entries ≤ ~15% of 512 (≈77), so ancient written sources stay the core.

## 2026-10-17 — Include Gnostic scripture
- Status: active
- Developer request. Tradition label "Gnostic" (era ~1st-4th c. CE); Hermetic texts may be labelled "Hermetic (Greco-Egyptian)".
- Constraint: Nag Hammadi translations (post-1945) are copyrighted; use only <=1928 editions (e.g. Mead's Pistis Sophia and Thrice-Greatest Hermes, Grenfell & Hunt's Oxyrhynchus Logia, Harris's Odes of Solomon). Gospel of Thomas full text likely unavailable in a PD translation.
- Cap: Gnostic/Hermetic ≤ ~6% of 512 (≈30).

## 2026-10-17 — Caps revised + flagged fresh renderings (approved: "Both")
- Status: active (supersedes the 18/15/15% caps entry)
- Core caps (of 512): Greek/Roman ~20% (102), Chinese ~17% (87), Indian ~17% (87).
- Fresh renderings: up to ~25 phrases may be Claude's own English from original-language texts, only for regions with no usable PD translation (Mesopotamia, Persia, Africa, Americas). Schema: add `"rendering": "fresh"`, translator = "Claude, from <language>, <source edition>", plus `"review": "pending"` until the developer signs off. Never presented as a historical translation.
- Non-fresh phrases keep the verbatim-verification rule.

## 2026-10-17 — Cap feasibility check (resolved above)
- Status: resolved by the entry above; kept for the numbers
- Counts after 3 batches (124): Greek/Roman 24, Chinese 23, Indian 17, Hebrew 24, Egyptian 14, Gnostic/Hermetic 22.
- Caps imply ≥266 phrases from regions other than Greek/Roman/Chinese/Indian. Realistic ceilings found so far: Hebrew ~40, Egyptian ~25, Gnostic ~30, oral-tradition ~77, Persia/Mesopotamia/Arabia/Japan/SE Asia/Celtic unknown (≤~60 total if sources found). Sum ≈ 232 < 266.
- Mesopotamia: 1900-1928 PD translations are epics/myths (Rogers 1912), not wisdom; clean gnomic Sumerian/Akkadian texts are post-1928 (copyrighted) or only in scholarly journals.
- Proposal: raise core caps to Greek/Roman ~22% (113), Chinese ~18% (92), Indian ~18% (92). Those regions have abundant, clean, verifiable 19th-c. sources (e.g. Tirukkural/Pope 1886, Hitopadesa/Arnold 1861, Mencius/Legge, Diogenes Laertius Seven Sages/Yonge 1853, Hesiod, Seneca/Gummere 1917).
- Alternative: allow a limited share (≤~25 phrases) of fresh English renderings by Claude from original-language texts for regions with no usable PD translation (flagged in schema, developer reviews).

## 2026-10-17 — Final composition of the 512 (all verbatim; no fresh renderings used)
- Status: active
- Greek/Roman 98, Chinese 78, Indian 59, West Africa 56 (Ashanti 30, Hausa 26), Hebrew 42, Persia/Assyria/Steppe 32 (Ahikar 25, Plutarch-reported speakers 7), Arabic/Egypt 29, Gnostic/Hermetic 28, Gaelic 27, Malay 24, Egyptian 18, Americas 11 (Inca 8, Aztec 3), Japan 10.
- Caps check: GR 98<=102, CN 78<=87, IN 59<=87 ok. Hebrew 42 slightly over ~40. Oral-tradition phrases total ~147 (about 29%), well over the 77 cap set earlier; flagged to developer, not yet approved.
- Gaps: Oceania, Korea, Native North America, Mesopotamia proper (Ahikar is an Assyrian court sage in Aramaic versions) and Persian written wisdom are absent or thin. The fresh-rendering allowance (<=25) is unused.
- Tradition labels are per source; speakers "reported by Plutarch" are Greek-recorded.
- Items beyond "up to the Romans" are labelled in the era field: Shotoku 604 CE, Hitopadesa c. 8th-12th c., Inca 15th c., Aztec 15th c., all oral-tradition entries.

## 2026-10-17 — Developer sign-off on the finished corpus
- Status: active
- Oral-tradition share (~29%, above the earlier 77-phrase cap): ACCEPTED by developer. The 77 cap is void.
- Gaps (Oceania, Korea, Native North America, Mesopotamia proper, Persian written wisdom): NOT to be filled. Fresh-rendering allowance (<=25) stays unused and is closed unless the developer reopens it.
- Corpus is final at 512 unless the developer asks for changes. Any edit to a batch file requires re-running tools/assign_rolls.py (rolls reshuffle).

## 2026-10-17 — Source access: Gutenberg first, browser pane second
- Status: active
- Verify quotes by grepping Project Gutenberg plain text. Blocked sites (sacred-texts.com 403s scripts) are read via the built-in browser pane.
- Anything unverifiable is flagged, not quoted from memory.
