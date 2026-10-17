# Build log: 01 setup

Bullets only. Append only; never edit past entries.

## 2026-10-17
- repo cloned from github.com/arbuckleburr/oracular-spectacular (was empty)
- docs/ skeleton created; skeleton approved by developer
- decided: web platform; ordered 3d8 = 512 outcomes; 4 decision themes
- no code written; live-tested: n/a
- decided: static site + localStorage, no backend/accounts; hosting and vanilla-vs-Vite still open
- decided: vellum look (not Roma wagon)
- decided: corpus = 19th-c. PD translations, source on every phrase, balanced eras/regions, batches of 64
- developer note: 3 visible dice, roll animation stops one die at a time (logged in ui decisions)
- source access: gutenberg.org plain text via curl works; sacred-texts.com blocked (Cloudflare 403); gutendex.com flaky
- gutenberg ids confirmed: 2680 Meditations (Long), 2017 + 35185 Dhammapada, 21 Aesop (Townsend)
- batch 1 DONE: data/batch-01.json, 64 phrases, all verified verbatim vs Gutenberg text (tools/verify.py); live-tested: n/a
- sources used (Gutenberg id, translator): 15877 Aurelius (Long 1862); 10661 Epictetus (Long 1877); 1656 Plato Apology (Jowett); 21 Aesop (Townsend 1867); 4094 Analects (Legge 1861); 216 Tao Teh King (Legge 1891); 59709 Zhuangzi (Giles 1889); 2017 Dhammapada (Muller 1881); 2388 Gita (Arnold 1885)
- pitfall: Gutenberg 2680 Meditations = Casaubon 1634, NOT 19th c.; dropped, use 15877
- pitfall: quotes recalled from memory missed ~40% on first verify; always run verify.py
- distribution b1: Greek/Roman 24, Chinese 23, Indian 17; no other regions yet
- locators: Aurelius book.section, Analects Legge numbering, Aesop fable title, Dhammapada verse; Epictetus/Zhuangzi/Laozi 44 set by hand
- developer approved: tradition caps (18/15/15%), seeded-shuffle roll assignment after all 512, browser pane for blocked sources
- developer approved: edition rule relaxed to <=1928 where no 19th-c. translation exists
- source access: archive.org (advancedsearch json + full text) and en.wikisource.org API respond to curl w/ UA; gutenberg search page scrapable
- gutenberg ids scouted: 30508 Ptahhotep/Kagemna (Gunn 1906); 124 Deuterocanon (Sirach/Wisdom, translator unchecked); 7145 Book of Dead (Budge); 56550 Popol Vuh (Spence 1908, post-Roman, likely out of scope)
- batch 2 (partial) DONE: data/batch-02.json, 38 phrases, all located verbatim via tools/build_batch2.py; live-tested: n/a
- b2 sources: gutenberg 30508 Ptahhotep+Kagemni (Gunn 1906) 14; gutenberg 124 Sirach (KJV Apocrypha 1611) 10; gutenberg 10 KJV Proverbs 8 + Ecclesiastes 6
- b2 distribution: Egyptian 14, Hebrew 24. Running total 102/512
- pitfall: Gutenberg archive.org OCR of Budge (Amenemope) is column/footnote-interleaved; unusable for verbatim checks, dropped
- pitfall: KJV verse markers can start mid-line; locator regex must not assume line start
- b2 normalizations: fragments given closing period (e.g. Eccl 9:11, Prov 29:18); Sirach 6:14 keeps source spelling "faithfull"
- b2 attribution fix: "A cup of water" belongs to Kagemni, not Ptahhotep
- developer: add Gnostic scripture (logged in phrase-corpus.md); oral traditions allowed
- batch 3 (Gnostic, partial) DONE: data/batch-03.json, 5 phrases, verified via tools/verify.py (quotes in tools/batch3_quotes.txt). Running total 107/512
- sources: gutenberg 76266 Pistis Sophia (Horner 1924); archive.org hymnsofzoroaster... no; odesandpsalmsso00unkngoog Odes of Solomon (Harris 1911, OCR, verse nos. unreliable so no locator)
- pitfall: Pistis Sophia is liturgical/narrative, few gnomic lines; Odes/Hermes/Logia/Gathas archive.org OCR is commentary-heavy and noisy; Mead's Hermetic translations are in Thrice-Greatest Hermes vol. 3 (not fetched)
- candidates not yet mined: archive.org thricegreatesth0* (Hermes), hymnsofzoroaster00guth (Gathas, Guthrie 1914), sayingsofourlord00gren (Logia, OCR empty), gutenberg 30799 Gnosis of the Light
- b3 extended: +17 (Corpus Hermeticum, Mead 1906: 11; Hymn of Jesus, Mead 1907: 6) via gnosis.org; batch 3 = 22 phrases (Gnostic/Hermetic). Running total 124/512
- gnosis.org access: https cert is self-signed (not bypassed); plain http://www.gnosis.org works with browser-like UA + Accept headers (bare curl gets 406). Plain HTTP = unauthenticated; texts are public, quotes also match Mead print editions only by trust. tools/html2txt.py converts pages.
- gnosis.org paths: /library/grs-mead/TGH-v2/th202..237.html (CH I-XIV, Asclepius), /library/grs-mead/grsm_hymnofjesus.htm, grsm_robeofglory.htm, grsm_chaldean.htm, TGH-v3/index.html (fragments). Nag Hammadi pages there are copyrighted translations: not used.
- developer approved "Both": core caps raised to GR 20% / CN 17% / IN 17%; <=25 flagged fresh renderings for thin regions (see phrase-corpus.md)
- sourcing dead ends: Mills Gathas (archive.org dli.csl.6172, SBE 31) = interlinear + paraphrase, no clean aphorisms; Darmesteter SBE 23 (zendavesta0000unse_r2k7) = Yasts, not gnomic; Rogers 1912 = epics only; Ellis 1894 Yoruba proverbs sit inside prose (few self-contained)
- no new phrases this step beyond b3 extension; running total 124/512
- batch 4 DONE: data/batch-04.json, 33 phrases, all verbatim-located (tools/build_batch4.py). Running total 157/512
- b4 sources: gutenberg 57342 Diogenes Laertius (Yonge 1853): Seven Sages + Socrates (21 phrases); gutenberg 78134 Plutarch Morals vol.1 (Goodwin 1878): Apophthegms of Kings and Great Commanders, Laconic Apophthegms
- b4 distribution: Greek 22 (Diogenes 21 + Dionysius 1), Spartan 3, Persian 5, Assyrian 1, Egyptian 1, Scythian 1 (non-Greek speakers reported by Plutarch; labelled "reported by Plutarch")
- b4 dropped as context-dependent: Scilurus bundle line, Artaxerxes "For when I have given you this...", Agasicles "If he rules his subjects..."
- Plutarch vol.1 also holds Roman Apophthegms (line ~7986, not mined) ; Cicero Friendship/Old Age = gutenberg 2808 (Shuckburgh 1900, not mined)
- tools/make_batch.py added: verifies TSV spec lines against downloaded texts and writes batch JSON; tools/tally.py counts by region
- batch 5 (8): Plutarch Macedonian/Sicilian kings (Alexander, Philip, Antigonus, Dion, Agathocles); batch 6 (23): Tirukkural couplets, Pope 1886 (archive.org tiruvalluvanayan00tiruuoft; couplets extracted by verse number from OCR, English lines verified); batch 7 (16): Cicero De Amicitia 8 / De Senectute 3 (Shuckburgh 1900, gutenberg 2808) + Mencius 2 (Legge, gutenberg 10056). Running total 204/512
- tally at 204: Greek/Roman 71, Indian 40, Chinese 25, Hebrew 24, Gnostic/Hermetic 22, Egyptian 15, Persia/Mesopotamia/Steppe 7
- Kural text note: spaces before punctuation removed in display (" ;" -> ";"); couplets stored with a newline between lines
- Hitopadesa (Arnold 1861, gutenberg 13268) skipped: compiled c. 8th-12th c. CE, outside "up to the Romans"
- batch 8 (44): Analects +28 (Legge 1861; Book.chapter in Legge numbering computed from text) and Tao Te Ching +16 (Legge 1891; chapter numbers hand-assigned, ch.44 verse lines joined). Running total 248/512
- tally at 248: Greek/Roman 71, Chinese 69 (cap 87), Indian 40, Hebrew 24, Gnostic/Hermetic 22, Egyptian 15, Persia/Mesopotamia/Steppe 7
- batch 9 (50): Ashanti Proverbs, Rattray 1916 (archive.org ashantiproverbst00rattuoft; 830 numbered Twi proverbs, English paragraph after each (NNNN) code, extracted by regex, quotes verified; OCR-damaged ones excluded; slave/women-demeaning ones left out on purpose)
- batch 10 (26): Hausa Proverbs, Capt. G. Merrick 1905 (archive.org hausaproverbs00merrrich; picked the literal English line of each proverb; numbers = OCR paragraph numbers)
- archive.org checks: india.history.resource.77399 (Arabic Proverbs 1875) 404 on _djvu.txt; turkishproverbs00provgoog is a 11KB stub. Not used.
- running total 324/512. tally: Africa (oral) 76, Greek/Roman 71, Chinese 69, Indian 40, Hebrew 24, Gnostic/Hermetic 22, Egyptian 15, Persia/Mesopotamia/Steppe 7
- developer: trim Ashanti set. Done: batch 9 cut 50 -> 30 (dropped animal-specific and obscure ones: nos. 101,116,129,149,167,210,269,283,299,351,402,481,549,558,613,633,665,694,725,776). Africa oral now 56 (Ashanti 30, Hausa 26). Running total 304/512
- developer ALLOWED the Hitopadesa (era exception). batch 11 (7): Arnold 1861, gutenberg 13268
- batch 12 (35): Ahikar sayings 25 (archive.org storyofahikar0000cony, Conybeare/Harris/Lewis 1913; composite of Syriac/Armenian/Arabic etc. versions; "My son," prefix dropped; items with OCR spacing before ; or : skipped) + Prince Shotoku's Seventeen-Article Constitution 10 (archive.org nihongi2asto, Aston 1896; era 604 CE, outside "up to the Romans", flagged in era field)
- batch 13 (29): Burckhardt, Arabic Proverbs collected at Cairo (archive.org arabicproverbsor00burc_0, 1875 ed.); proverb numbers unreliable in OCR so source has no number. Cap note: oral-tradition total now Africa 56 + Arabic 29 = 85; oral cap (77) exceeded by 8; to raise to ~100 unless developer objects
- running total 375/512
- batch 14 (27): Scottish Gaelic proverbs, Nicolson 1882 (archive.org collectionofgael00nicouoft; English translation substring picked from mixed Gaelic+English paragraphs); batch 15 (24): Malay proverbs, W. E. Maxwell 1878-83 (archive.org biostor-176149/176436/176258, Straits Branch RAS journal; English quoted translations). Running total 426/512
- skipped: Armenian Proverbs (archive.org armenianproverbs0000rope, OCR is Cyrillic-garbage), Burmese Niti (Gray 1886; Sanskrit-derived maxims, mostly Indian cap material, poor OCR)
- oral-tradition total now 136 (Africa 56, Arabic 29, Gaelic 27, Malay 24): oral cap (77) is superseded in practice; developer should confirm a new cap (propose ~35% of 512) or I cut back
- batches 16-20: Inca Pachacutec sayings 8 (Garcilaso/Markham 1869, archive.org firstpartroyalc01markgoog + firstpartofroyal02vega, scans joined as a_garcilaso); Nahuatl songs 3 (Brinton 1887); batch 18 (42): Aurelius +10 (Long), Laconic Apophthegms +11 (Goodwin 1878), Zhuangzi +9 (Giles 1889), Dhammapada +12 (Muller); batch 19 (18): more Hebrew (KJV Proverbs 12, Ecclesiastes 4 incl. "A good name is better than precious ointment", Sirach 2); batch 20 (15): Hermetic +6, Ptahhotep +3, Epictetus +6. Total 512/512
- QA at 512: 0 exact duplicates, 0 substring overlaps, all fields present (python check)
- data/phrases.json written by tools/assign_rolls.py (seed 20261017). Each d1 block of 64 has a similar regional mix.
- pitfall: hyphenated line breaks in OCR ("him- self") defeat verbatim checks; shorten the quote to a clean span
- developer signed off: oral share accepted (cap void), gaps not to be filled, fresh renderings unused; hosting/tooling HOLD. Docs updated and handoff prompt given; CLAUDE.md rewritten with repo layout and state
- (earlier) developer asked what the Hitopadesa is (explained in chat: Sanskrit fable-and-maxim collection, c. 8th-12th c. CE, derived from the Panchatantra; skipped for era)
- open: Gita locator for "Better thine own work" = ch.18 per text position; Epictetus Discourses quote has no book/chapter

## 2026-10-17 front-end
- built index.html, style.css, app.js (plain static; no Vite/hosting chosen, hold respected)
- dice: 3 SVG diamonds; tumble CSS anim; settle at 0.9/1.7/2.5s; phrase after last (+0.45s)
- rolls: crypto.getRandomValues + rejection sampling; lookup by key "d1-d2-d3"
- saves: localStorage key `oracular-spectacular.saved.v1`, stores phrase keys only
- copy: quote + source/tradition/era/translator; clipboard API with execCommand fallback
- prefers-reduced-motion: no animation
- tested in browser pane: cast, display, save: ok; mobile/copy/reload: not tested (see TESTING-OWED)

## 2026-10-17 manual entry
- added "Three eight-sided dice." section: 3 selects (1-8) + "Read my cast"; skips animation, sets die faces, same lookup/copy/save path
- setBusy() disables cast + manual controls during animation
- tested in browser pane: enter 3/4/5 -> correct phrase, dice show 3 4 5; button disabled until all three chosen
- not tested: mobile layout, keyboard-only use

## 2026-10-17 initial cap layout
- drop cap now its own flex column (span.cap + span.rest) instead of ::first-letter float; no quote line runs under the cap
- tested: longest phrase (163 chars), 4 lines, all right of cap; mobile not tested

## 2026-10-17 publish
- first commit of whole project (corpus, tools, docs, front-end) pushed to origin/main
- Pages enabled: main, /

## 2026-10-17 subtitle
- header subtitle changed to "Roll the bones…" (was "Three dice. Five hundred and twelve sayings of the ancients."); not committed

## 2026-10-17 hub
- git mv index.html, app.js -> oracle/; new root index.html hub; style.css shared (+ .crumb/.cards/.card)
- oracle page: "← All the oracles" link; fetch path ../data/phrases.json
- tested locally: hub renders, card -> /oracle/, manual entry returns phrase; not committed

## 2026-10-17 oblique tarot kickoff
- decisions/oblique-tarot.md created; DECISIONS.md and NEXT-SESSION.txt updated
- no code, no downloads, no hub card yet

## 2026-10-17 image sources, round 2
- Gallica blocked (Cloudflare challenge, not bypassed); IA items checked, none clean (see decisions/oblique-tarot.md); no downloads

## 2026-10-17 oblique tarot assets
- downloaded 81 JPEGs from IA item the-tarot-of-marseilles-full-deck (user-approved); 293x567 px
- oblique/cards/ (78 faces + back.jpg + LICENSE.txt), oblique/data/cards.json (78 entries)
- licence found on credit card z01: CC BY-NC-SA 2.5 (Ben-Dov); logged in decisions/oblique-tarot.md
- fixed Épées elisions (d'Épées); no page, prompts or hub card yet; not committed

## 2026-10-17 minor prompt drafts
- oblique/data/drafts/minors-draft.json: 112 drafts (4 suits x 14 x 2), all <=5 words, all unique; unapproved

## 2026-10-17 major prompt drafts
- minors approved; majors-draft.json: 44 drafts, 6/6/5/5 by field, all <=5 words, unique across all 156; unapproved

## 2026-10-17 oblique tarot page
- prompts.json (156) merged from approved drafts; oblique/index.html + app.js; style.css additions; hub card added
- fixed class clash (.card hub vs tarot image -> .face)
- tested in browser pane: draw, reversed rotation, save, hub link: ok; mobile/copy/reload/reduced-motion not tested; not committed

## 2026-10-17 card corners
- card backs had white outside their rounded corners (square JPEG); measured arc radius ~17px on 293x567
- .face: border-radius 6% / 3.1%, dropped white bg and 1px border; applies to faces and back; image files untouched
- checked in browser pane (backs and three faces); not tested on mobile; not committed

## 2026-10-17 oblique tarot flip fix
- diagnosis (sampled wrapper transform/src every 60ms): face src was swapped in before the animation, so the back vanished at once and the face grew from edge-on; reversed cards (rotated 180deg in-plane) made the jump most obvious; on redraw old faces snapped to back; image could also show before loading
- fix: flipTo() in oblique/app.js (Web Animations): back turns edge-on (220ms), src swapped there after img.decode(), face opens (300ms); prompt text appears after the flip; on redraw shown cards flip back first; all card images preloaded
- removed CSS .cardwrap.flip / @keyframes turn
- verified by sampling two draws incl. a reversed card; visual check by developer owed

## 2026-10-17 oblique tarot flip fix 2
- symptom: cards jumped above/below the line during flip. cause: perspective(800px) rotateY made the card swell (height 368 -> 417, top 264 -> 239) mid-flip; same for all three, most noticeable beside a settled neighbour
- fix: flip uses scaleX(1<->0); removed perspective from .cardwrap
- verified: sampled top/height of all three cards every 60ms through a full redraw: constant 264/368; visual check by developer owed

## 2026-10-17 I Zing
- source: IA wg916 (Legge 1882, SBE 16) djvu text; 64 Judgments located, 25-odd split across page breaks fixed by hand; cleaned (see decisions/izing.md); izing/data/judgments-legge.json
- line patterns from trigram table, checked against Legge line texts (63 clean, #4 footnote false alarm)
- izing/data/hip.json: 64 hip versions (drafts); tools/build_izing.py -> izing/data/hexagrams.json
- izing/index.html, app.js, izing.css; hub card; click-to-divide casting, 18 changes, moving lines -> becoming hexagram
- finding: uniform random heap sizes skew line odds (6: 4.7%, 9: 22%); remainder-first random split matches 1/16,5/16,7/16,3/16 (simulated 300k casts)
- tested in browser pane: real click change (heaps, held stalk, red remainders), full auto cast to hexagram 47 -> 29 (lines verified by hand), save, cast again; not tested: mobile, keyboard, copy, reload; not committed

## 2026-10-17 I Zing bug: viewing a saved reading broke the next cast
- cause: showReading() copied the viewed reading's six values into the live `values`; begin() never reset it, so after the first new line values.length was 7, the "< 6" test failed and the cast ended after line 1 (same if View was clicked mid-cast)
- fix: viewing no longer touches `values` (figure drawn from the viewed array, and only when idle/done); begin() resets values/changeNo/current and hides the old reading
- verified in browser pane: saved reading -> View -> Begin -> line 1 done -> line 2 started; also View clicked mid-cast left the live figure alone; not committed

## 2026-10-17 zing rewrite drafts
- izing/data/drafts/zing-weird-draft.json: 64 weird/deadpan versions, <=3 sentences; hip.json unchanged; not applied, not committed

## 2026-10-17 I Zing three-coin mode
- added method switch (coins default / stalks), 3 CSS coins (rotateX spin, face-up stays after landing), toss() / "Throw the rest", figure + reading as before
- stalk code unchanged; reset() now mode-aware; viewing-a-saved-reading guard extended to phase "ready"
- footer note on odds; subtitle now "cast with coins or yarrow stalks"
- tested in browser pane: one throw (1 head 2 tails = 7 correct), throw-the-rest to a reading with a moving line in ~7 s total, switch to stalks and back; not tested: mobile, reduced motion, visual look of tails face; not committed

## 2026-10-17 I Zing coin toss rework
- coins now buttons (96px, WAAPI toss arc + spin, distinct gold 三 / bronze 二 faces), running tally, line flashes into figure, per-coin or throw-all, throw-the-rest; toss() replaced by throwCoin/throwAll/recordLine/throwRest
- tested in browser pane: single coin click (animation running, tally "2 + ? + ?"), other two coins, line recorded (7, new-line flash), throw-the-rest to a reading; not tested: mobile, keyboard, reduced motion; not committed

## 2026-10-17 zing drafts v2
- audited v1 (tic counts), saved as zing-weird-draft-v1.json; rewrote 55 of 64 in zing-weird-draft.json; hip.json still the slang set; not applied, not committed

## 2026-10-17 I Zing coins moved up
- .coinbox height 190 -> 150 px, padding-top 70 -> 54 (mobile 160/56 -> 130/50); toss arc 74 -> 50 px so the coin stays below the caption
- measured in browser pane: coin at peak 50 px below the caption, at rest 60 px higher than before; mobile not checked

## 2026-10-17 I Zing coin spacing fix
- previous change shrank the coin box but the coins still sat flush against the tally text below; added bottom padding so coins sit above it (.coinbox height 176, padding 54/0/30; mobile 150, 50/0/26)
- measured in browser pane: coin bottom to tally 32 px (was ~2), caption to coin 56 px; mobile not checked; not committed

## 2026-10-17 zing v2 applied
- hip.json <- zing-weird-draft.json (64); old slang copied to drafts/hip-slang-v1.json; build_izing.py re-run; footer reworded
- checked in browser pane: reading shows new text; not committed

## 2026-10-17 zing review progress
- batches 1-3 (hexagrams 1-24) reviewed: edits to 7, 9, 13 by developer; rest kept; review paused, resume at 25; hip.json holds reviewed 1-24 + unreviewed 25-64; not committed

## 2026-10-17 I Zing: Cast again moved under the coins
- #castagain button now sits in the altar button row (under the coins / stalk field), shown when a cast finishes; removed the old one from the reading's button row
- on finish the page scrolls so the caption/coins are at the top and the reading is just below (was: scrolled to the reading, leaving the altar off screen); saved-list "View" still scrolls to the reading
- tested in browser pane (coins mode): button under coins after a cast, resets coins/figure/reading; stalks mode and mobile not tested; not committed

## 2026-10-17 I Zing: method switch hover text unreadable
- cause: shared button:hover sets a dark red background; the unselected method button has red text, so red on red
- fix: .modes .mode:hover keeps red text on a light red tint; the selected one keeps vellum text on red
- checked by hovering both buttons in each mode in the browser pane; other buttons already had their own hover rules; not committed
