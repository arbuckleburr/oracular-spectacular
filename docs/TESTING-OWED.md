# Testing owed

Live checks owed on the developer's machine. Each: how to test, what should happen.

- Mobile width (~375px): dice, phrase and saved list lay out without horizontal scroll. Expect: readable, buttons tappable.
- Copy button: click Copy, paste elsewhere. Expect: quote plus "— source (tradition, era; translator)".
- Reload after saving: saved list persists; Remove deletes it; Save button re-enables for that phrase.
- OS "reduce motion" on: cast skips animation and shows result at once.
- Open index.html via file://: expect the on-page "serve over HTTP" message, not a blank page.
- Tirukkural phrase (contains newline): couplet shows on two lines.
- Live site after push: hub at root loads, card opens /oracle/, "All the oracles" link returns, app fetches ../data/phrases.json. Old root URL now shows the hub.
- Manual entry at ~375px width: three selects and button wrap cleanly. Keyboard-only: tab through selects, Enter submits.
- Oblique Tarot: ~375px width: spread stacks to one column, no horizontal scroll. Copy spread: paste elsewhere, expect three "Position: prompt [card, orientation]" lines. Reload after Save spread: saved list persists; Remove works. Reduced motion: cards appear at once. Credit footer links open.
- Oblique Tarot card images are 293x567 px: check they look acceptable on a high-DPI screen.
- I Zing: (1) ~375px width: stalk field, buttons, lines figure, reading all fit with no horizontal scroll; stalks (2-3px wide) still legible. (2) Keyboard only: Tab to the field, arrows move the dashed guide, Enter divides. (3) Copy: paste, expect hexagram header, Legge and Zing lines (plus moving-line section if any). (4) Reload: saved readings persist; View re-shows the reading and its figure; Remove works. (5) Reduced motion: casting runs without waiting. (6) CJK font: Chinese names and hexagram glyphs (U+4DC0..) render, not boxes, on the developer's devices. (7) Full 18-click cast by hand for feel/length.
- I Zing coins: throw feel and look (coin faces: 三 heads / 二 tails, square hole); tails really shows the tails face after landing; mobile width; method switch mid-cast restarts cleanly; "Throw the rest" at 375px; reduced motion.
