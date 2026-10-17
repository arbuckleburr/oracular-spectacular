(function () {
  "use strict";

  var STORE_KEY = "oblique-tarot.saved.v1";
  var REVEAL_AT = [700, 1500, 2300]; // ms after the draw at which each card turns over
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (id) { return document.getElementById(id); };
  var slots = Array.prototype.slice.call(document.querySelectorAll(".slot"));
  var POSITIONS = slots.map(function (s) { return s.querySelector("h2").textContent; });
  var cardsById = {}, promptOf = {};
  var current = null; // [{id, orientation}, x3]
  var busy = false;

  // Uniform integer in [0, n) by rejection sampling over random bytes.
  function randInt(n) {
    var limit = 256 - (256 % n), b = new Uint8Array(1);
    do { crypto.getRandomValues(b); } while (b[0] >= limit);
    return b[0] % n;
  }

  function drawSpread() {
    var ids = Object.keys(cardsById), pick = [];
    while (pick.length < 3) {
      var id = ids.splice(randInt(ids.length), 1)[0];
      pick.push({ id: id, orientation: randInt(2) ? "reversed" : "upright" });
    }
    return pick;
  }

  function prompt(c) { return promptOf[c.id + "|" + c.orientation]; }

  function loadSaved() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(v) ? v.filter(function (s) {
        return Array.isArray(s) && s.length === 3 && s.every(function (c) { return cardsById[c.id] && prompt(c); });
      }) : [];
    } catch (e) { return []; }
  }
  function storeSaved(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
  }
  function sig(spread) { return spread.map(function (c) { return c.id + ":" + c.orientation; }).join("|"); }

  function spreadText(spread) {
    return spread.map(function (c, i) {
      var k = cardsById[c.id];
      return POSITIONS[i] + ": " + prompt(c).text + "  [" + k.name + " (" + k.english + "), " + c.orientation + "]";
    }).join("\n");
  }

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
  function note(msg) {
    $("note").textContent = msg;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { $("note").textContent = ""; }, 2200);
  }

  // Turn a card over (scaleX, not a 3D rotation: perspective made the card swell past its neighbours): edge-on, swap the image once it has loaded, then open out again.
  // Swapping the image only while the card is edge-on is what makes it read as a flip.
  function flipTo(slot, src, alt, rev, then) {
    var w = slot.querySelector(".cardwrap"), img = slot.querySelector(".face");
    var apply = function () { img.src = src; img.alt = alt; img.classList.toggle("rev", rev); };
    if (reduceMotion || !w.animate) { apply(); if (then) then(); return; }
    var close = w.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: 220, easing: "ease-in", fill: "forwards" });
    close.onfinish = function () {
      apply();
      var open = function () {
        var a = w.animate(
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          { duration: 300, easing: "ease-out" });
        close.cancel(); // drop the held edge-on pose now that the open animation is running
        if (then) a.onfinish = then;
      };
      (img.decode ? img.decode().catch(function () {}) : Promise.resolve()).then(open);
    };
  }

  function reveal(i, c) {
    var slot = slots[i], k = cardsById[c.id], p = prompt(c), rev = c.orientation === "reversed";
    slot.querySelector(".cname").textContent = k.name + " \u00B7 " + k.english + (rev ? " \u00B7 reversed" : "");
    slot.querySelector(".cprompt").textContent = p.text;
    slot.querySelector(".cfield").textContent = p.field;
    flipTo(slot, k.image, k.english + (rev ? " (reversed)" : ""), rev, function () { slot.classList.add("shown"); });
  }

  function hideAll() {
    slots.forEach(function (s) {
      var wasShown = s.classList.contains("shown");
      s.classList.remove("shown");
      s.querySelector(".cname").textContent = "";
      s.querySelector(".cprompt").textContent = "";
      s.querySelector(".cfield").textContent = "";
      if (wasShown) flipTo(s, "cards/back.jpg", "Card back", false);
    });
  }

  function refreshSave() {
    var saved = current && loadSaved().some(function (s) { return sig(s) === sig(current); });
    $("save").textContent = saved ? "Saved ✓" : "Save spread";
    $("save").disabled = !!saved;
  }

  function renderSaved() {
    var list = loadSaved(), ul = $("list");
    ul.textContent = "";
    $("empty").hidden = list.length > 0;
    list.forEach(function (s) {
      var li = document.createElement("li");
      var q = document.createElement("span"); q.className = "q"; q.textContent = s.map(function (c) { return prompt(c).text; }).join("  ·  ");
      var f = document.createElement("span"); f.className = "from";
      f.textContent = s.map(function (c) { var k = cardsById[c.id]; return k.english + (c.orientation === "reversed" ? " (rev.)" : ""); }).join(" · ");
      var row = document.createElement("div"); row.className = "row";
      var c = document.createElement("button"); c.type = "button"; c.textContent = "Copy";
      c.onclick = function () { copyText(spreadText(s)).then(function () { c.textContent = "Copied"; setTimeout(function () { c.textContent = "Copy"; }, 1500); }, function () {}); };
      var r = document.createElement("button"); r.type = "button"; r.textContent = "Remove";
      r.onclick = function () {
        storeSaved(loadSaved().filter(function (x) { return sig(x) !== sig(s); }));
        renderSaved(); refreshSave();
      };
      row.appendChild(c); row.appendChild(r);
      li.appendChild(q); li.appendChild(f); li.appendChild(row);
      ul.appendChild(li);
    });
  }

  function draw() {
    if (busy) return;
    busy = true;
    $("draw").disabled = true;
    $("tools").hidden = true;
    hideAll();
    current = drawSpread();
    var finish = function () {
      busy = false;
      $("draw").disabled = false;
      $("draw").textContent = "Draw again";
      $("tools").hidden = false;
      refreshSave();
    };
    if (reduceMotion) { current.forEach(function (c, i) { reveal(i, c); }); finish(); return; }
    current.forEach(function (c, i) {
      setTimeout(function () {
        reveal(i, c);
        if (i === 2) setTimeout(finish, 500);
      }, REVEAL_AT[i]);
    });
  }

  $("draw").addEventListener("click", draw);
  $("copy").addEventListener("click", function () {
    if (!current) return;
    copyText(spreadText(current)).then(function () { note("Copied."); }, function () { note("Copy failed."); });
  });
  $("save").addEventListener("click", function () {
    if (!current) return;
    var list = loadSaved();
    if (!list.some(function (s) { return sig(s) === sig(current); })) list.push(current);
    if (storeSaved(list)) { renderSaved(); refreshSave(); note("Saved."); }
    else note("Could not save (browser storage unavailable).");
  });

  $("draw").disabled = true;
  Promise.all([
    fetch("data/cards.json").then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }),
    fetch("data/prompts.json").then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  ]).then(function (res) {
    res[0].forEach(function (c) { cardsById[c.id] = c; });
    res[1].forEach(function (p) { promptOf[p.card + "|" + p.orientation] = p; });
    Object.keys(cardsById).forEach(function (id) { new Image().src = cardsById[id].image; }); // warm the cache
    if (Object.keys(cardsById).length !== 78 || Object.keys(promptOf).length !== 156) throw new Error("data size");
    $("draw").disabled = false;
    renderSaved();
  }).catch(function () {
    $("error").hidden = false;
    $("error").textContent = "The cards could not be loaded. Serve this folder over HTTP (for example: python3 -m http.server, then open /oblique/) rather than opening the file directly.";
  });
})();
