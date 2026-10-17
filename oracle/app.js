(function () {
  "use strict";

  var STORE_KEY = "oracular-spectacular.saved.v1";
  var STOP_AT = [900, 1700, 2500]; // ms after the cast at which each die settles
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (id) { return document.getElementById(id); };
  var dice = Array.prototype.slice.call(document.querySelectorAll(".die"));
  var byKey = {};
  var current = null; // phrase currently shown
  var rolling = false;

  // Uniform d8 via rejection sampling: 256 is a multiple of 8, so no bias on a byte,
  // but the loop keeps the method correct if the sides ever change.
  function rollDie(sides) {
    var limit = 256 - (256 % sides);
    var b = new Uint8Array(1);
    do { crypto.getRandomValues(b); } while (b[0] >= limit);
    return (b[0] % sides) + 1;
  }

  function loadSaved() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(v) ? v.filter(function (k) { return byKey[k]; }) : [];
    } catch (e) { return []; }
  }
  function storeSaved(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  function citation(p) {
    return "“" + p.text + "”\n— " + p.source + " (" + p.tradition + ", " + p.era + "; " + p.translator + ")";
  }

  function copyText(s) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(s);
    }
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
    var n = $("note");
    n.textContent = msg;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { n.textContent = ""; }, 2200);
  }

  function show(p) {
    current = p;
    // Initial cap is its own column so no line of the quote runs beneath it.
    var t = $("text");
    t.textContent = "";
    var cap = document.createElement("span"); cap.className = "cap"; cap.textContent = p.text.charAt(0);
    var rest = document.createElement("span"); rest.className = "rest"; rest.textContent = p.text.slice(1);
    t.setAttribute("aria-label", p.text);
    t.appendChild(cap); t.appendChild(rest);
    $("source").textContent = p.source;
    $("tradition").textContent = p.tradition;
    $("era").textContent = p.era;
    $("translator").textContent = "Translated by " + p.translator;
    var o = $("oracle");
    o.hidden = false;
    // restart the unfurl animation on each new phrase
    o.style.animation = "none"; void o.offsetWidth; o.style.animation = "";
    refreshSaveButton();
  }

  function refreshSaveButton() {
    var saved = current && loadSaved().indexOf(current.key) !== -1;
    $("save").textContent = saved ? "Saved ✓" : "Save";
    $("save").disabled = !!saved;
  }

  function renderSaved() {
    var list = loadSaved(), ul = $("list");
    ul.textContent = "";
    $("empty").hidden = list.length > 0;
    list.forEach(function (k) {
      var p = byKey[k];
      var li = document.createElement("li");
      var q = document.createElement("span"); q.className = "q"; q.textContent = p.text;
      var f = document.createElement("span"); f.className = "from";
      f.textContent = p.source + " · " + p.tradition + " · " + p.era;
      var row = document.createElement("div"); row.className = "row";
      var c = document.createElement("button"); c.type = "button"; c.textContent = "Copy";
      c.onclick = function () { copyText(citation(p)).then(function () { c.textContent = "Copied"; setTimeout(function () { c.textContent = "Copy"; }, 1500); }, function () {}); };
      var r = document.createElement("button"); r.type = "button"; r.textContent = "Remove";
      r.onclick = function () {
        storeSaved(loadSaved().filter(function (x) { return x !== k; }));
        renderSaved(); refreshSaveButton();
      };
      row.appendChild(c); row.appendChild(r);
      li.appendChild(q); li.appendChild(f); li.appendChild(row);
      ul.appendChild(li);
    });
  }

  function setBusy(b) {
    $("roll").disabled = b;
    ["m1", "m2", "m3", "read"].forEach(function (id) { $(id).disabled = b; });
    if (!b) syncRead();
  }
  function manualValues() {
    return ["m1", "m2", "m3"].map(function (id) { return parseInt($(id).value, 10); });
  }
  function syncRead() {
    $("read").disabled = manualValues().some(function (v) { return !(v >= 1 && v <= 8); });
  }

  // Physical dice: skip the animation and show the entered faces.
  function readManual(e) {
    e.preventDefault();
    if (rolling) return;
    var v = manualValues();
    if (v.some(function (x) { return !(x >= 1 && x <= 8); })) return;
    dice.forEach(function (d, i) {
      d.classList.remove("rolling", "landed");
      d.querySelector(".pip").textContent = v[i];
    });
    show(byKey[v.join("-")]);
  }

  function cast() {
    if (rolling) return;
    rolling = true;
    var btn = $("roll");
    setBusy(true);
    $("oracle").hidden = true;
    current = null;
    var result = [rollDie(8), rollDie(8), rollDie(8)];

    var finish = function () {
      show(byKey[result.join("-")]);
      rolling = false;
      setBusy(false);
      btn.textContent = "Cast again";
    };

    if (reduceMotion) {
      dice.forEach(function (d, i) { d.querySelector(".pip").textContent = result[i]; });
      finish();
      return;
    }

    dice.forEach(function (d) { d.classList.remove("landed"); d.classList.add("rolling"); });
    var flicker = setInterval(function () {
      dice.forEach(function (d) {
        if (d.classList.contains("rolling")) d.querySelector(".pip").textContent = rollDie(8);
      });
    }, 80);

    dice.forEach(function (d, i) {
      setTimeout(function () {
        d.classList.remove("rolling");
        d.querySelector(".pip").textContent = result[i];
        void d.offsetWidth;
        d.classList.add("landed");
        if (i === dice.length - 1) {
          clearInterval(flicker);
          setTimeout(finish, 450);
        }
      }, STOP_AT[i]);
    });
  }

  $("roll").addEventListener("click", cast);
  $("manual").addEventListener("submit", readManual);
  $("manual").addEventListener("change", syncRead);
  $("copy").addEventListener("click", function () {
    if (!current) return;
    copyText(citation(current)).then(function () { note("Copied."); }, function () { note("Copy failed."); });
  });
  $("save").addEventListener("click", function () {
    if (!current) return;
    var list = loadSaved();
    if (list.indexOf(current.key) === -1) list.push(current.key);
    if (storeSaved(list)) { renderSaved(); refreshSaveButton(); note("Saved."); }
    else note("Could not save (browser storage unavailable).");
  });

  setBusy(true);
  fetch("../data/phrases.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (arr) {
      arr.forEach(function (p) { byKey[p.key] = p; });
      if (Object.keys(byKey).length !== 512) throw new Error("corpus size");
      setBusy(false);
      renderSaved();
    })
    .catch(function () {
      var e = $("error");
      e.hidden = false;
      e.textContent = "The oracle's scrolls could not be loaded. Serve this folder over HTTP (for example: python3 -m http.server, then open /oracle/) rather than opening the file directly.";
    });
})();
