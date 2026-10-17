# Testing owed

Live checks owed on the developer's machine. Each: how to test, what should happen.

- Mobile width (~375px): dice, phrase and saved list lay out without horizontal scroll. Expect: readable, buttons tappable.
- Copy button: click Copy, paste elsewhere. Expect: quote plus "— source (tradition, era; translator)".
- Reload after saving: saved list persists; Remove deletes it; Save button re-enables for that phrase.
- OS "reduce motion" on: cast skips animation and shows result at once.
- Open index.html via file://: expect the on-page "serve over HTTP" message, not a blank page.
- Tirukkural phrase (contains newline): couplet shows on two lines.
- Manual entry at ~375px width: three selects and button wrap cleanly. Keyboard-only: tab through selects, Enter submits.
