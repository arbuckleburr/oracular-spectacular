(function () {
  "use strict";

  var STORE_KEY = "izing.saved.v1";
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STALK_H = 90, Y_HANG = 6, Y_MAIN = 100;

  var $ = function (id) { return document.getElementById(id); };
  var field = $("field");
  var byLines = {}, hexes = [];

  var all = [];        // the 49 stalks used in the casting, in order
  var aside = null;    // the one stalk set apart at the start
  var pile = [];       // stalks still in the bundle for the current change
  var discards = [];   // stalks counted off during the current line
  var values = [];     // finished line values, bottom to top: 6, 7, 8 or 9
  var changeNo = 0;    // 0..2 within the current line
  var phase = "idle";  // idle | ready (coins) | split | busy | done
  var mode = "coins";  // "coins" (quick, default) or "stalks" (traditional, slow)
  var asideTaken = false;
  var cursorK = 25;    // keyboard split position
  var current = null;  // the reading on screen: { values: [...] }

  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, reduceMotion ? 0 : ms); }); };

  // Uniform integer in [0, n) by rejection sampling over random bytes (for "Divide at random").
  function randInt(n) {
    var limit = 256 - (256 % n), b = new Uint8Array(1);
    do { crypto.getRandomValues(b); } while (b[0] >= limit);
    return b[0] % n;
  }

  // A random division. The traditional odds of the four line values (1/16, 5/16, 7/16, 3/16 for 6, 7, 8, 9) assume the
  // left heap's size is equally likely to leave 0, 1, 2 or 3 over when counted by fours, so pick that remainder first, then a
  // heap size with it (leaving at least two stalks on the right, so the right heap is never emptied by the held stalk).
  function randomSplit(n) {
    var r = randInt(4), ks = [];
    for (var k = 1; k <= n - 2; k++) if (k % 4 === r) ks.push(k);
    return ks[randInt(ks.length)];
  }

  // ---- the arithmetic of one change (the traditional yarrow-stalk method) ----
  // pile of n stalks is divided into left k and right n-k; one stalk is taken from the right heap;
  // each heap is counted off by fours and its remainder (4 if it divides evenly, 0 if empty) is kept.
  function changeOf(n, k) {
    var left = k, right = n - k - 1;
    var rl = left % 4 || 4;
    var rr = right === 0 ? 0 : (right % 4 || 4);
    return { rl: rl, rr: rr, removed: 1 + rl + rr };
  }

  // ---- geometry ----
  function W() { return field.clientWidth; }
  function spacing(n) { return Math.max(2.5, Math.min(12, (W() * 0.9) / Math.max(n, 1))); }
  function put(el, x, y) { el.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)"; }
  function spread(list, cx, y, sp) {
    list.forEach(function (el, i) { put(el, cx - ((list.length - 1) * sp) / 2 + i * sp, y); });
  }
  function layoutPile() { spread(pile, W() / 2, Y_MAIN, spacing(49)); }
  function layoutDiscards() {
    var y = field.clientHeight - STALK_H - 8;
    discards.forEach(function (el, i) { put(el, 14 + i * 6, y); });
  }
  function layoutAside() { if (aside && asideTaken) put(aside, 10, Y_HANG); }
  function layoutAll() { layoutPile(); layoutDiscards(); layoutAside(); }
  function pileLeft() { return (W() - (pile.length - 1) * spacing(49)) / 2; }
  function kFromX(x) {
    var sp = spacing(49), k = Math.round((x - pileLeft()) / sp + 0.5);
    return Math.min(pile.length - 2, Math.max(1, k));
  }

  // ---- stalks ----
  function buildStalks() {
    field.textContent = "";
    var g = document.createElement("div"); g.className = "guide"; g.id = "guide"; field.appendChild(g);
    all = []; pile = []; discards = []; aside = null; asideTaken = false;
    var els = [];
    for (var i = 0; i < 50; i++) {
      var s = document.createElement("div"); s.className = "stalk"; field.appendChild(s); els.push(s);
    }
    aside = els[0];
    all = els.slice(1); pile = all.slice();
    // initial: all 50 bunched in the middle; the aside stalk joins them until it's taken
    var sp = spacing(50);
    els.forEach(function (el, i) { el.style.transition = "none"; put(el, W() / 2 - (49 * sp) / 2 + i * sp, Y_MAIN); });
    void field.offsetWidth;   // settle the starting positions without animating from the corner
    els.forEach(function (el) { el.style.transition = ""; });
  }

  function moveGuide(k) {
    var g = $("guide"); if (!g) return;
    g.style.left = Math.round(pileLeft() + k * spacing(49) - spacing(49) / 2) + "px";
  }

  // ---- figure of lines ----
  var LABEL = { 6: "old yin", 7: "young yang", 8: "young yin", 9: "old yang" };
  function renderFigure(vs, newest) {
    vs = vs || values;
    var ol = $("figure"); ol.textContent = "";
    for (var i = 5; i >= 0; i--) {
      var li = document.createElement("li");
      var v = vs[i];
      if (v === undefined) {
        var e = document.createElement("span"); e.className = "empty"; li.appendChild(e);
      } else {
        var yang = v === 7 || v === 9;
        li.className = (yang ? "yang" : "yin") + (i === newest ? " new" : "");
        li.appendChild(Object.assign(document.createElement("span"), { className: "bar" }));
        if (!yang) li.appendChild(Object.assign(document.createElement("span"), { className: "bar" }));
        if (v === 6 || v === 9) li.appendChild(Object.assign(document.createElement("span"), { className: "mark", textContent: v === 9 ? "○" : "✕" }));
        li.appendChild(Object.assign(document.createElement("span"), { className: "lbl", textContent: "line " + (i + 1) }));
      }
      ol.appendChild(li);
    }
  }

  // ---- casting ----
  function setSay(t) { $("say").textContent = t; }
  function setProgress() {
    $("progress").textContent = values.length < 6
      ? "Line " + (values.length + 1) + " of 6 · change " + (changeNo + 1) + " of 3 · " + pile.length + " stalks in the bundle"
      : "";
  }
  function promptSplit() {
    phase = "split"; field.classList.remove("busy");
    cursorK = Math.max(1, Math.min(pile.length - 2, Math.round(pile.length / 2)));
    moveGuide(cursorK);
    setSay(changeNo === 0 && values.length === 0
      ? "Click the bundle where you wish to divide it (or use the arrow keys and Enter)."
      : "Divide the bundle again.");
    setProgress();
    $("random").hidden = false; $("random").disabled = false;
    field.focus({ preventScroll: true });
  }

  async function doChange(k) {
    if (phase !== "split") return;
    phase = "busy"; field.classList.add("busy"); $("random").disabled = true;
    var n = pile.length, ch = changeOf(n, k);
    var left = pile.slice(0, k), right = pile.slice(k);
    var sp = Math.min(spacing(49), (W() * 0.44) / Math.max(left.length, right.length, 1));
    spread(left, W() * 0.27, Y_MAIN, sp); spread(right, W() * 0.73, Y_MAIN, sp);
    setSay("The bundle is divided: " + left.length + " on the left, " + right.length + " on the right.");
    await sleep(900);

    var hung = right.shift();
    put(hung, W() * 0.73, Y_HANG);
    spread(right, W() * 0.73, Y_MAIN, sp);
    setSay("One stalk is taken from the right-hand heap and held.");
    await sleep(900);

    var pickL = left.slice(left.length - ch.rl), pickR = ch.rr ? right.slice(right.length - ch.rr) : [];
    pickL.concat(pickR).forEach(function (s) { s.classList.add("pick"); });
    setSay("Counting off by fours leaves " + ch.rl + " on the left and " + ch.rr + " on the right.");
    await sleep(1000);

    var gone = [hung].concat(pickL, pickR);
    gone.forEach(function (s) { discards.push(s); });
    layoutDiscards();
    setSay(ch.removed + " stalks are set down.");
    await sleep(800);
    gone.forEach(function (s) { s.classList.remove("pick"); s.style.opacity = ".4"; });

    pile = left.slice(0, left.length - ch.rl).concat(right.slice(0, right.length - ch.rr));
    layoutPile();
    await sleep(800);

    changeNo++;
    if (changeNo < 3) { promptSplit(); return; }

    var v = pile.length / 4;
    values.push(v);
    renderFigure();
    setSay("Line " + values.length + ": " + pile.length + " stalks remain, which is " + v + " — " + LABEL[v] + (v === 6 || v === 9 ? " (a moving line)." : "."));
    $("progress").textContent = "";
    await sleep(1600);

    // gather everything back for the next line
    all.forEach(function (s) { s.style.opacity = ""; });
    pile = all.slice(); discards = []; changeNo = 0;
    layoutPile();
    if (values.length < 6) { await sleep(700); promptSplit(); }
    else finish();
  }

  function finish() {
    phase = "done"; field.classList.remove("busy");
    $("random").hidden = true;
    setSay("The six lines are cast.");
    showReading({ values: values.slice() }, true);
  }

  // ---- reading ----
  function bitsOf(vs) { return vs.map(function (v) { return v === 7 || v === 9 ? 1 : 0; }); }
  function becomingBits(vs) { return vs.map(function (v) { return v === 9 ? 0 : v === 6 ? 1 : (v === 7 ? 1 : 0); }); }
  function lookup(bits) { return byLines[bits.join("")]; }
  function movingLines(vs) { var m = []; vs.forEach(function (v, i) { if (v === 6 || v === 9) m.push(i + 1); }); return m; }

  function fillHex(prefix, h) {
    $(prefix + "glyph").textContent = h.glyph;
    $(prefix + "num").textContent = "HEXAGRAM " + h.n;
    $(prefix + "name").textContent = h.chinese + "  " + h.pinyin;
    $(prefix + "sub").textContent = h.english + " · " + h.legge_name;
  }

  function showReading(r, scroll) {
    current = r;
    var h = lookup(bitsOf(r.values)), mv = movingLines(r.values);
    $("hglyph").textContent = h.glyph;
    $("hnum").textContent = "HEXAGRAM " + h.n;
    $("hname").textContent = h.chinese + "  " + h.pinyin;
    $("hsub").textContent = h.english + " · " + h.legge_name;
    $("legge").textContent = h.legge;
    $("zing").textContent = h.zing;
    var b = $("becoming");
    if (mv.length) {
      var h2 = lookup(becomingBits(r.values));
      $("bglyph").textContent = h2.glyph;
      $("bnum").textContent = "HEXAGRAM " + h2.n + " · moving line" + (mv.length > 1 ? "s " : " ") + mv.join(", ");
      $("bname").textContent = h2.chinese + "  " + h2.pinyin;
      $("bsub").textContent = h2.english + " · " + h2.legge_name;
      $("blegge").textContent = h2.legge;
      $("bzing").textContent = h2.zing;
      b.hidden = false;
    } else b.hidden = true;
    // Viewing a reading must not touch the cast in progress (`values` is the live cast); only redraw the figure when nothing is being cast.
    if (phase === "done" || phase === "idle" || (phase === "ready" && values.length === 0)) renderFigure(r.values);
    $("reading").hidden = false;
    var rd = $("reading"); rd.style.animation = "none"; void rd.offsetWidth; rd.style.animation = "";
    refreshSave();
    if (scroll && rd.scrollIntoView) rd.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function readingText(r) {
    var h = lookup(bitsOf(r.values)), mv = movingLines(r.values);
    var t = "I Zing — Hexagram " + h.n + ": " + h.chinese + " " + h.pinyin + " (" + h.english + ")\n" +
      "Judgment (Legge, 1882): " + h.legge + "\nThe Zing: " + h.zing;
    if (mv.length) {
      var h2 = lookup(becomingBits(r.values));
      t += "\n\nMoving line" + (mv.length > 1 ? "s " : " ") + mv.join(", ") + " — becoming Hexagram " + h2.n + ": " + h2.chinese + " " + h2.pinyin + " (" + h2.english + ")\n" +
        "Judgment (Legge, 1882): " + h2.legge + "\nThe Zing: " + h2.zing;
    }
    return t;
  }

  // ---- save / copy ----
  function loadSaved() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(v) ? v.filter(function (s) { return /^[6-9]{6}$/.test(s); }) : [];
    } catch (e) { return []; }
  }
  function storeSaved(l) { try { localStorage.setItem(STORE_KEY, JSON.stringify(l)); return true; } catch (e) { return false; } }
  function key(vs) { return vs.join(""); }
  function unkey(s) { return s.split("").map(Number); }

  function copyText(s) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(s);
    return new Promise(function (res, rej) {
      var t = document.createElement("textarea");
      t.value = s; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t);
      ok ? res() : rej();
    });
  }
  var noteTimer;
  function note(m) { $("note").textContent = m; clearTimeout(noteTimer); noteTimer = setTimeout(function () { $("note").textContent = ""; }, 2200); }

  function refreshSave() {
    var saved = current && loadSaved().indexOf(key(current.values)) !== -1;
    $("save").textContent = saved ? "Saved ✓" : "Save";
    $("save").disabled = !!saved;
  }

  function renderSaved() {
    var list = loadSaved(), ul = $("list");
    ul.textContent = "";
    $("empty").hidden = list.length > 0;
    list.forEach(function (k) {
      var vs = unkey(k), h = lookup(bitsOf(vs)), mv = movingLines(vs);
      var li = document.createElement("li");
      var q = document.createElement("span"); q.className = "q";
      q.appendChild(Object.assign(document.createElement("span"), { className: "hex", textContent: h.glyph }));
      q.appendChild(document.createTextNode(h.n + ". " + h.chinese + " " + h.pinyin + " — " + h.english));
      var f = document.createElement("span"); f.className = "from";
      f.textContent = h.zing + (mv.length ? "  (moving line" + (mv.length > 1 ? "s " : " ") + mv.join(", ") + ")" : "");
      var row = document.createElement("div"); row.className = "row";
      var c = document.createElement("button"); c.type = "button"; c.textContent = "Copy";
      c.onclick = function () { copyText(readingText({ values: vs })).then(function () { c.textContent = "Copied"; setTimeout(function () { c.textContent = "Copy"; }, 1500); }, function () {}); };
      var v = document.createElement("button"); v.type = "button"; v.textContent = "View";
      v.onclick = function () { showReading({ values: vs }, true); };
      var r = document.createElement("button"); r.type = "button"; r.textContent = "Remove";
      r.onclick = function () { storeSaved(loadSaved().filter(function (x) { return x !== k; })); renderSaved(); refreshSave(); };
      row.appendChild(c); row.appendChild(v); row.appendChild(r);
      li.appendChild(q); li.appendChild(f); li.appendChild(row);
      ul.appendChild(li);
    });
  }

  // ---- three-coin method: heads = yang = 3, tails = yin = 2; the sum of three coins is the line (6, 7, 8 or 9) ----
  var coinFace = [null, null, null];   // this line's coins: 1 = heads (3), 0 = tails (2), null = not yet thrown
  var coinBusy = [false, false, false];
  var lineLock = false;                // true while a finished line is being recorded
  function coinEls() { return Array.prototype.slice.call(document.querySelectorAll(".coin")); }
  function resetCoinsForLine() {
    coinFace = [null, null, null];
    coinEls().forEach(function (c) { c.classList.add("unthrown"); });
  }
  function settleCoins() {
    coinEls().forEach(function (c) { c._ang = 0; c.style.transform = "rotateX(0deg)"; c.classList.remove("unthrown"); });
  }
  function updateTally() {
    var t = $("tally"), parts = coinFace.map(function (f) { return f === null ? "?" : (f ? 3 : 2); });
    if (coinFace.every(function (f) { return f === null; })) { t.textContent = values.length < 6 ? "Line " + (values.length + 1) + ": throw the coins, one at a time or all three." : ""; return; }
    var sum = coinFace.every(function (f) { return f !== null; }) ? coinFace.reduce(function (a, f) { return a + (f ? 3 : 2); }, 0) : null;
    t.textContent = parts.join(" + ") + (sum !== null ? " = " + sum + " \u2014 " + LABEL[sum] + (sum === 6 || sum === 9 ? ", a moving line" : "") : "");
  }

  // Toss one coin: it rises, spins end over end and lands showing the face that came up.
  function flipCoin(c, face, ms) {
    var base = c._ang || 0, final = face ? 0 : 180, total = 720 + final;
    return new Promise(function (resolve) {
      var done = function () { c.style.transform = "rotateX(" + final + "deg)"; c._ang = final; resolve(); };
      if (reduceMotion || !c.animate) { done(); return; }
      var a = c.animate([
        { transform: "translateY(0px) rotateX(" + base + "deg)" },
        { transform: "translateY(-74px) rotateX(" + (base + (total - base) / 2) + "deg)", offset: 0.5, easing: "ease-in" },
        { transform: "translateY(0px) rotateX(" + total + "deg)" }
      ], { duration: ms, easing: "ease-out" });
      a.onfinish = done; a.oncancel = done;
    });
  }

  async function throwCoin(i, fast) {
    if (phase !== "ready" || lineLock || coinBusy[i] || coinFace[i] !== null) return;
    if (values.length === 0 && coinFace.every(function (f) { return f === null; })) { current = null; $("reading").hidden = true; renderFigure([]); }
    coinBusy[i] = true;
    var c = coinEls()[i], face = randInt(2);
    c.classList.remove("unthrown");
    await flipCoin(c, face, fast ? 420 : 900);
    coinFace[i] = face; coinBusy[i] = false;
    updateTally();
    if (coinFace.every(function (f) { return f !== null; })) await recordLine(fast);
  }

  async function recordLine(fast) {
    lineLock = true;
    var sum = coinFace.reduce(function (a, f) { return a + (f ? 3 : 2); }, 0);
    await sleep(fast ? 150 : 500);
    values.push(sum);
    renderFigure(undefined, values.length - 1);
    setSay("Line " + values.length + " of 6 is " + sum + ": " + LABEL[sum] + (sum === 6 || sum === 9 ? " (moving)." : "."));
    await sleep(fast ? 250 : 900);
    lineLock = false;
    if (values.length >= 6) { phase = "busy"; $("toss").hidden = true; $("tossrest").hidden = true; await sleep(300); finish(); return; }
    resetCoinsForLine(); updateTally();
    $("tossrest").hidden = false;
  }

  async function throwAll(fast) {
    if (phase !== "ready" || lineLock) return;
    var idx = [0, 1, 2].filter(function (i) { return coinFace[i] === null && !coinBusy[i]; });
    await Promise.all(idx.map(function (i, k) { return sleep(k * 130).then(function () { return throwCoin(i, fast); }); }));
  }
  async function throwRest() {
    var start = values.length;
    while (phase === "ready" && values.length < 6) {
      await throwAll(true);
      while (lineLock) await sleep(30);
    }
  }

  // ---- method switch ----
  function applyMode() {
    var coins = mode === "coins";
    $("mCoins").classList.toggle("on", coins); $("mCoins").setAttribute("aria-pressed", String(coins));
    $("mStalks").classList.toggle("on", !coins); $("mStalks").setAttribute("aria-pressed", String(!coins));
    $("coinbox").hidden = !coins; $("tally").hidden = !coins; $("field").hidden = coins; $("progress").hidden = coins;
    $("toss").hidden = !coins; $("tossrest").hidden = true; $("go").hidden = coins; $("random").hidden = true;
  }
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    try { localStorage.setItem("izing.mode", m); } catch (e) {}
    reset(true);
  }

  // ---- begin / reset ----
  async function begin() {
    if (phase !== "idle") return;
    phase = "busy";
    values = []; changeNo = 0; current = null;      // start from a clean cast, whatever was viewed before
    $("reading").hidden = true; renderFigure(values);
    $("go").hidden = true;
    setSay("Fifty stalks. One is set aside and not used again.");
    asideTaken = true;
    aside.classList.add("aside"); layoutAside();
    await sleep(900);
    layoutPile();
    await sleep(700);
    promptSplit();
  }

  function reset(keepScroll) {
    values = []; changeNo = 0; current = null;
    phase = mode === "coins" ? "ready" : "idle";
    $("reading").hidden = true;
    applyMode();
    $("go").disabled = false; $("go").textContent = "Take one stalk aside";
    $("toss").disabled = false; $("toss").textContent = "Throw all three";
    $("progress").textContent = "";
    lineLock = false; coinBusy = [false, false, false];
    settleCoins(); resetCoinsForLine(); updateTally();
    setSay(mode === "coins" ? "Heads (yang) counts three, tails (yin) counts two. Three coins make a line; six lines make a hexagram." : "Fifty yarrow stalks lie in the bundle.");
    buildStalks(); renderFigure();
    if (keepScroll !== true) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  // ---- events ----
  field.addEventListener("mousemove", function (e) {
    if (phase !== "split") return;
    var r = field.getBoundingClientRect();
    cursorK = kFromX(e.clientX - r.left); moveGuide(cursorK);
  });
  field.addEventListener("click", function (e) {
    if (phase !== "split") return;
    var r = field.getBoundingClientRect();
    doChange(kFromX(e.clientX - r.left));
  });
  field.addEventListener("keydown", function (e) {
    if (phase !== "split") return;
    if (e.key === "ArrowLeft") { cursorK = Math.max(1, cursorK - 1); moveGuide(cursorK); e.preventDefault(); }
    else if (e.key === "ArrowRight") { cursorK = Math.min(pile.length - 2, cursorK + 1); moveGuide(cursorK); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === " ") { doChange(cursorK); e.preventDefault(); }
  });
  $("random").addEventListener("click", function () { if (phase === "split") doChange(randomSplit(pile.length)); });
  $("go").addEventListener("click", begin);
  $("toss").addEventListener("click", function () { throwAll(false); });
  $("tossrest").addEventListener("click", function () { throwRest(); });
  coinEls().forEach(function (c, i) { c.addEventListener("click", function () { throwCoin(i, false); }); });
  $("mCoins").addEventListener("click", function () { setMode("coins"); });
  $("mStalks").addEventListener("click", function () { setMode("stalks"); });
  $("again").addEventListener("click", function () { reset(); });
  $("copy").addEventListener("click", function () {
    if (current) copyText(readingText(current)).then(function () { note("Copied."); }, function () { note("Copy failed."); });
  });
  $("save").addEventListener("click", function () {
    if (!current) return;
    var l = loadSaved(), k = key(current.values);
    if (l.indexOf(k) === -1) l.push(k);
    if (storeSaved(l)) { renderSaved(); refreshSave(); note("Saved."); } else note("Could not save (browser storage unavailable).");
  });
  window.addEventListener("resize", function () { if (phase === "idle" || phase === "split" || phase === "done") layoutAll(); });

  // ---- start up ----
  $("go").disabled = true; $("toss").disabled = true;
  fetch("data/hexagrams.json").then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (arr) {
    hexes = arr;
    arr.forEach(function (h) { byLines[h.lines.join("")] = h; });
    if (arr.length !== 64 || Object.keys(byLines).length !== 64) throw new Error("data");
    try { if (localStorage.getItem("izing.mode") === "stalks") mode = "stalks"; } catch (e) {}
    reset(true); renderSaved();
  }).catch(function () {
    $("error").hidden = false;
    $("error").textContent = "The book could not be loaded. Serve this folder over HTTP (for example: python3 -m http.server, then open /izing/) rather than opening the file directly.";
  });
})();
