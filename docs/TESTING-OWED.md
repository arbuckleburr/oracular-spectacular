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
