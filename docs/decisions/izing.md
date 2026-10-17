# Decisions: I Zing (third oracle)

Entries in date order. Status flags: active / superseded / partly superseded.

## 2026-10-17 — Concept
- Status: active
- Developer: an oracle for yarrow stalks and the I Ching, named "I Zing". The seeker draws the lots with clicks; the resulting hexagram points to a verse, "a guide to action". The seeker poses a question, but the computer never sees it. Verses also given in modern hip parlance, for fun; the original stays. Chinese flavour.
- 64 hexagrams, one verse each.

## 2026-10-17 — Source text: Legge 1882, the Judgments
- Status: active
- Source: James Legge, *The Yi King*, Sacred Books of the East vol. 16 (1882), public domain. Internet Archive item `wg916` (djvu OCR text; ~970 KB). Not in the repo (kept in a session scratchpad).
- One verse per hexagram = king Wan's judgment (the "Thwan"), the paragraph before the line texts. The line texts, images and appendices are not used.
- Extraction was semi-manual: judgments often run across page breaks with footnotes between, so for the 25-odd split ones the continuation was located by hand. Legge's bracketed interpolations are kept, since they are his rendering.
- Cleaning, and only this: hyphenation marks (¬) removed and words rejoined; space before ; : , removed; "hundred 11" -> "hundred li"; OCR-garbled hexagram names normalised to Legge's romanisation (Khi&n -> Khien, etc.; diacritics dropped); Hexagram 3's "(Indicates" -> "(indicates". Result: `izing/data/judgments-legge.json`.
- Line patterns: derived from King Wen trigram pairs and checked against Legge's own line texts ("The first line, undivided ...") for all 64 (Hexagram 4's apparent mismatch was a footnote about Hexagram 3). Table in `tools/build_izing.py`.
- Rejected: Wilhelm/Baynes (copyrighted).

## 2026-10-17 — The Zing versions
- Status: active (drafts by Claude; developer has not reviewed them)
- `izing/data/hip.json`: 64 short paraphrases in light modern slang. Meaning kept close to Legge; gendered lines (Hexagrams 37, 44) rendered neutrally. Fun, not scholarship; the footer says so. Developer may want a stronger slang register.

## 2026-10-17 — How the casting works
- Status: active
- Real yarrow-stalk procedure, simulated: 50 stalks, one set aside, 49 divided three times per line, six lines, 18 changes. Each change: divide the bundle in two; hold one stalk from the right heap; count each heap by fours (remainder is 4 if it divides evenly); set those aside. Stalks left after three changes / 4 = 6, 7, 8 or 9. 6 and 9 are moving ("old") lines.
- Click position on the bundle decides the division (keyboard: arrows + Enter). "Divide at random" picks the left heap's remainder mod 4 uniformly, then a size with it (crypto.getRandomValues, rejection sampling); simulation reproduces the traditional odds (6: 1/16, 7: 5/16, 8: 7/16, 9: 3/16). Plain uniform random sizes do not (6: 4.7%, 9: 22%), hence the remainder-first method. Clicks are the seeker's own; their odds depend on where people click.
- Right heap is never left with fewer than 2 stalks before the held one is taken (clicks and random).
- Moving lines: show the primary hexagram's verse, then "the moving lines turn this into" the second hexagram and its verse. Line texts are not shown (scope choice; developer may want them).

## 2026-10-17 — Look and page
- Status: active
- Own palette over the shared base: vermilion, gold, ink on rice-paper cream, dark red ground; double red frame; red seal with 易; vertical 易經; CJK serif font stack (system fonts, no web fonts). Hexagram shown as Unicode glyph (U+4DC0..), Chinese name, pinyin, English label and Legge's name.
- English hexagram labels are conventional short names, chosen by me; not taken from a translation's text.
- Saves in localStorage `izing.saved.v1`: six digits (6-9) per reading. Copy includes both verses.
- Page `izing/` (index.html, app.js, izing.css, data/); hub card added.

## 2026-10-17 — Viewing a saved reading is separate from casting
- Status: active
- `values` is only ever the cast in progress. Viewing a saved reading shows it below without changing cast state; starting a cast clears any shown reading.

## 2026-10-17 — Zing versions: new direction (weird, deadpan, queered)
- Status: active (supersedes the slang register in "The Zing versions"; drafts awaiting developer review)
- Developer: not hip slang. Queered, a novel interpretation of the verse; playful, weird, deadpan; meant to jar the reader out of the usual reading; 1-3 sentences; a balance of lines that give an action and lines that only give an image. Two earlier rounds of examples (earnest, then camp) led here; "Pack a bag..." style and image-only style both liked.
- Drafts for all 64: `izing/data/drafts/zing-weird-draft.json`. NOT yet in `izing/data/hip.json`; the live site still shows the old slang versions until approved. On approval, replace hip.json (or rename it) and re-run `python3 -I tools/build_izing.py`.

## 2026-10-17 — Three-coin mode added; it is the default
- Status: active (adds to "How the casting works"; stalks mode unchanged)
- Why: the yarrow-stalk cast took about 100 s (18 divisions at ~4.5 s plus line pauses). Developer asked for a faster way that keeps some interactivity and chose three coins from a list of options.
- Method: one click per line throws three coins (crypto random, 1 = heads = 3, tails = 2); the sum is the line (6-9). About 1.5 s per throw, plus "Throw the rest" for the remaining lines (~7 s whole cast).
- Odds differ from the stalks: 6 and 9 are each 1/8, 7 and 8 each 3/8, so moving lines are twice as likely (stalks: 6 = 1/16, 9 = 3/16). The footer says so. Moving lines then show the second hexagram as before.
- Switch "Three coins quick / Yarrow stalks slow" above the altar; changing it restarts the cast; choice remembered in localStorage `izing.mode`. Default is coins; a first-time visitor sees the quick mode.
- Open: developer may prefer stalks as the default, or the earlier-considered speed-ups for stalks (fast replay of changes 2 and 3).

## 2026-10-17 — Coin throws made legible and interactive
- Status: active (revises "Three-coin mode added")
- Developer: the coin animation seemed to do nothing, less interactive than choosing where to divide the stalks. Asked either to bring back the lots or give the flips real significance tied to the line.
- Chosen: keep coins, make them matter. Each coin is a button; click one to toss it (a rising, spinning toss that lands on the face that came up), or "Throw all three"; "Throw the rest" is the quick finish. Heads is a large gold 三 (陽 yang, 3), tails a bronze 二 (陰 yin, 2), so the result reads at a glance. A running sum under the coins ("3 + 2 + ? ...  = 7, young yang") links the faces to the line, and the finished line flashes into the figure.
- Yarrow stalks remain one click away in the method switch.

## 2026-10-17 — Zing drafts revised (v2)
- Status: active (supersedes the first 64 weird drafts; v1 kept as `izing/data/drafts/zing-weird-draft-v1.json`)
- Developer: the 64 didn't have the vibe of the earlier examples. Audit of v1: many had drifted into tidy whimsical advice built on stock similes ("like a ..." 9x, "don't / do not" 16x) and repeated props (umbrella 4x, hat 3x, goat, soup, elder). The ones the developer liked kept a specific odd image, a deadpan reversal and a queer-camp edge (wardrobe sequins, changing your name in the mirror, a creature that has never been furniture).
- v2: kept the 9 that worked (1, 2, 20, 23, 29, 36, 44, 49, 64); rewrote the other 55 around one concrete, odd, specific scene each, with drag/glamour/names/wardrobe/chosen-family flavour used sparingly, and cut the tics. Current file: `izing/data/drafts/zing-weird-draft.json`.
- Still NOT applied to `izing/data/hip.json`: the live site shows the old slang versions until the developer approves.
