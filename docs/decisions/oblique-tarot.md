# Decisions: Oblique Tarot (second oracle)

Entries in date order. Status flags: active / superseded / partly superseded.

## 2026-10-17 — Concept
- Status: active
- Developer: second oracle on the hub, "Oblique Tarot": a mashup of Tarot and Brian Eno's Oblique Strategies.
- Deck: 78 cards, three-card spread.
- Imagery: Tarot de Marseille (public-domain historical decks). Specific scan source/edition not yet chosen or downloaded.

## 2026-10-17 — Prompt text is original, written with the developer
- Status: active
- Oblique Strategies card text (Eno and Schmidt) is under copyright: never copy or closely paraphrase it.
- Prompts are crafted together, developer approves each batch before it enters the data. Tarot card names/numbers and traditional meanings are free to use.
- Why: legal safety; the developer wants authorship over the voice.

## 2026-10-17 — Proposed, awaiting approval
- Status: proposed
- One prompt per card per orientation (upright, reversed) = 156 prompts; the three spread positions are fixed labels, not separate prompts.
- Positions (draft): "The situation", "The obstacle", "The oblique move".
- Data lives in `oblique-tarot/data/` (own folder; not the 512-phrase corpus). Page at `oblique/` (name TBD).

## 2026-10-17 — Approvals and audience
- Status: active
- Developer approved: one prompt per card per orientation (156); positions as fixed labels; random upright/reversed with rotated image. Preferred deck: Nicolas Conver (1760).
- Prompts are for visual artists, not tarot-themed or gnomic; may overlap other fields (e.g. "underline", "go bold").

## 2026-10-17 — Image source check (nothing downloaded)
- Status: active
- Commons "Tarot de Marseille - Nicolas Conver 1760": only 26 files (22 trumps, 2 minors, a sheet); they are scans of a 2020 Reality Publishing reprint, credited to "Tarot World Project", licensed CC BY-SA 4.0 (one sheet CC0). Incomplete (no 56 minors) and the licence claim over a reprint is doubtful. Not used.
- Commons "Jean Dodal": 29 files, "Public domain", but low resolution (~200-300 px wide) and incomplete.
- Commons "Deck of cards, BM 1904,0511.47.1-78" (British Museum, after Conver): 6 files, public domain.
- Open: choose a complete public-domain source (candidates to check: BnF Gallica scans of Conver/Dodal/Noblet; Musée français de la Carte à jouer), or draw our own Marseille-style typographic cards.

## 2026-10-17 — Gallica and Internet Archive check (nothing downloaded)
- Status: active
- Gallica (gallica.bnf.fr): SRU search returns a Cloudflare "Just a moment" challenge; not bypassed (bot-detection rule). Would need the developer to fetch files by hand in a browser.
- Internet Archive: no scan of an original Conver deck found. Items checked: `the-tarot-of-marseilles-full-deck` (Dr. Yoav Ben-Dov's CBD Tarot, 2013: a modern restoration, rights not stated, presumed copyrighted); `ancient-tarot-de-marseille` (anonymous 2024 PDF scan "by Rumanito", provenance and rights unknown); `399557212-el-tarot-de-marsella-de-jean-noblet` (Noblet, Spanish-language PDF, provenance unknown).
- Result: no complete, clearly public-domain Conver set located. Options pending developer choice: (a) own Marseille-style typographic cards; (b) developer fetches a BnF/museum scan by hand; (c) ask Ben-Dov for permission to use CBD.

## 2026-10-17 — Imagery: CBD Tarot de Marseille (Ben-Dov), CC BY-NC-SA 2.5
- Status: active (supersedes the open image-source question above)
- Developer chose the Internet Archive copy (`the-tarot-of-marseilles-full-deck`) after their own check; use is non-commercial.
- Licence per the deck's own credit card (z01): CC BY-NC-SA 2.5, (c) 2010-2011 Dr. Yoav Ben-Dov; restored and adapted from Nicolas Conver, 1760. Obligations: credit, non-commercial only, share-alike for adaptations of the images.
- Downloaded the 81 deck JPEGs (about 5 MB) into the scratchpad; 78 card faces + back copied to `oblique/cards/` (renamed only, pixels unmodified), with `oblique/cards/LICENSE.txt`. Images are 293x567 px.
- Source file mapping: a01-a21 = trumps I-XXI, a22 = Le Mat; b/c/d/e = Bâtons/Coupes/Deniers/Épées, 01 = As ... 10, 11 Valet, 12 Cavalier, 13 Reyne, 14 Roy; a0 = card back; z00 blank, z01 credit card (not copied).
- Card data: `oblique/data/cards.json` (78 entries: id, French name as printed, English name, arcana, suit, number, image). Ids: major-00..21, wands/cups/coins/swords-01..14.
- To do when building the page: show the credit line near the cards and keep the images' licence separate from the code's. The page must credit Ben-Dov visibly.
- Page location chosen: `oblique/` at repo root (hub card to be added once the page exists).

## 2026-10-17 — Prompt form and suit-to-field mapping
- Status: active (form approved by developer; mapping proposed, not yet confirmed)
- Form: 1-5 word terse phrases or verbs, Oblique Strategies style, drawn from writing, painting, sculpture and musical composition (replaces the earlier longer sentence drafts for the majors, which are void).
- The four suits are the four fields. Proposed: Wands = painting, Cups = music, Coins = sculpture, Swords = writing.
- Major Arcana: also from those fields, mixed as equally as possible (22 cards: 6/6/5/5), as fits each card. Still to do.
- Minors: 56 cards x upright/reversed = 112 prompts. Draft in `oblique/data/drafts/minors-draft.json` (status "draft", awaiting developer approval). Avoid Eno's wording (e.g. no "honor error", "use an old idea", "emphasize the flaws", "tidy up", "take a break", "be dirty", "ghost echoes", "repetition is a form of change").
- Numbers 1-10 loosely run from beginning to completion; court cards act as roles (apprentice, mover, maker, decider).

## 2026-10-17 — Minor prompts approved; majors drafted
- Status: active
- Developer approved the 112 minor prompts ("These are good") and the suit-to-field mapping implied by them (Wands painting, Cups music, Coins sculpture, Swords writing). Marked `approved` in `oblique/data/drafts/minors-draft.json`.
- Majors drafted in `oblique/data/drafts/majors-draft.json` (status draft). Field split 6/6/5/5: painting (III, VI, VIIII, XII, XVIII, XVIIII), music (0, II, V, X, XIIII, XVII), sculpture (I, VIII, XIII, XVI, XXI), writing (IIII, VII, XI, XV, XX). One field per card, same for both orientations.

## 2026-10-17 — Majors approved; page built
- Status: active
- Developer approved the 22 major prompts. All 156 merged (status approved) into `oblique/data/prompts.json` {card, orientation, field, text}.
- Page `oblique/`: 3 distinct cards drawn without replacement, orientation 50/50 each (crypto.getRandomValues, rejection sampling); cards turn over one at a time (0.7/1.5/2.3 s); reversed cards drawn rotated 180 degrees; field shown under each prompt; copy/save spread (localStorage `oblique-tarot.saved.v1`, stores card id + orientation); credit footer for Ben-Dov/Conver CC BY-NC-SA 2.5.
- Styling shared via root `style.css` (tarot image class is `.face`, since `.card` is the hub card).

## 2026-10-17 — Card flip is two-phase
- Status: active
- Image swap happens only while the card is edge-on (see build log "flip fix"); reversed rotation lives on the img, the Y-rotation on its wrapper.

## 2026-10-17 — Flip uses scaleX, not 3D rotation
- Status: active (partly supersedes "Card flip is two-phase": same two phases, but scaleX instead of rotateY with perspective)
- Why: perspective made cards swell and move beyond their row mid-flip.
