/* Shared data, helpers, saving, sounds and voices. */
var App = window.App = { screens: {}, cleanups: [] };

(function () {
  var R = 6371.0088;

  // ---------- data ----------
  var list = window.COUNTRIES;
  var byId = {};
  var MEDIA = window.MEDIA || { img: {}, audio: {} };
  list.forEach(function (c) { byId[c.id] = c; c.fun = window.FUN[c.id] || null; });
  // attach local photos and voice clips
  Object.keys(window.FUN).concat(['JPN']).forEach(function (id) {
    var f = id === 'JPN' ? window.JAPAN_FUN : window.FUN[id];
    if (!f) return;
    if (f.dish) f.dish.img = MEDIA.img[id + '_dish'] || null;
    if (f.animal) f.animal.img = MEDIA.img[id + '_animal'] || null;
    f.sportImg = MEDIA.img[id + '_sport'] || null;
    var sp = id === 'MEX' || id === 'PER' || id === 'ARG' ? 'ES' : id;
    if (f.hello) f.hello.audio = MEDIA.audio[id + '_hello'] || MEDIA.audio[sp + '_hello'] || null;
    if (f.thanks) f.thanks.audio = MEDIA.audio[id + '_thanks'] || MEDIA.audio[sp + '_thanks'] || null;
  });
  App.byId = byId;
  App.all = list;
  App.listed = list.filter(function (c) { return c.list; });
  App.featured = Object.keys(window.FUN).map(function (id) { return byId[id]; }).filter(Boolean);
  App.JP = byId.JPN;
  App.JP.fun = window.JAPAN_FUN;

  var topo = window.WORLD_TOPO;
  var fc = topojson.feature(topo, topo.objects.countries);
  App.features = fc.features;
  App.featureById = {};
  fc.features.forEach(function (f) { App.featureById[f.properties.id] = f; });

  App.CONTINENTS = [
    { key: 'アジア', icon: '🏯' }, { key: 'ヨーロッパ', icon: '🏰' }, { key: 'アフリカ', icon: '🦒' },
    { key: '北アメリカ', icon: '🗽' }, { key: '南アメリカ', icon: '🦙' }, { key: 'オセアニア', icon: '🐨' },
  ];
  App.CONT_COLOR = {
    'アジア': '#FFE29A', 'ヨーロッパ': '#B5D3F7', 'アフリカ': '#FFCDB0', '北アメリカ': '#B9E6C9',
    '南アメリカ': '#DCCFF7', 'オセアニア': '#A8E6DE', '南極': '#F4F8FB', 'その他': '#E6E9F2',
  };

  // Polygons near the biggest piece only (drops far-away islands like French Guiana).
  var mainCache = {};
  App.mainShape = function (id) {
    if (mainCache[id]) return mainCache[id];
    var f = App.featureById[id];
    if (!f) return null;
    var g = f.geometry, out = g;
    if (g.type === 'MultiPolygon' && id !== 'USA') {
      var polys = g.coordinates.map(function (c) { return { type: 'Polygon', coordinates: c }; });
      var big = polys[0], bigA = 0;
      polys.forEach(function (p) { var a = d3.geoArea(p); if (a > bigA) { bigA = a; big = p; } });
      var c0 = d3.geoCentroid(big);
      var keep = polys.filter(function (p) { return d3.geoDistance(d3.geoCentroid(p), c0) * R < 3500; });
      out = { type: 'MultiPolygon', coordinates: keep.map(function (p) { return p.coordinates; }) };
    }
    var res = { type: 'Feature', properties: { id: id }, geometry: out };
    res.center = d3.geoCentroid(res);
    mainCache[id] = res;
    return res;
  };

  // Move a shape on the globe so its centre lands on `to` (keeps its true size).
  App.moveShape = function (feature, from, to) {
    var r1 = d3.geoRotation([-from[0], -from[1]]);
    var r2 = d3.geoRotation([-to[0], -to[1]]);
    function pt(p) { return r2.invert(r1(p)); }
    function walk(c, depth) { return depth === 0 ? pt(c) : c.map(function (x) { return walk(x, depth - 1); }); }
    var g = feature.geometry;
    var depth = g.type === 'Polygon' ? 2 : 3;
    return { type: 'Feature', properties: feature.properties, geometry: { type: g.type, coordinates: walk(g.coordinates, depth) } };
  };

  // ---------- numbers ----------
  function sig2(n) { var p = Math.pow(10, Math.floor(Math.log10(n)) - 1); return Math.round(n / p) * p; }
  App.fmtPeople = function (n) {
    if (!n) return 'データなし';
    if (n >= 1e8) return '約' + (Math.round(n / 1e7) / 10) + '億人';
    if (n >= 1e4) return '約' + sig2(n / 1e4).toLocaleString() + '万人';
    return '約' + sig2(n).toLocaleString() + '人';
  };
  App.fmtArea = function (a) {
    if (!a) return 'データなし';
    if (a >= 1e4) return '約' + sig2(a / 1e4).toLocaleString() + '万 km²';
    return '約' + sig2(a).toLocaleString() + ' km²';
  };
  App.fmtMan = function (n) {
    if (n == null) return null;
    if (n >= 1e4) return '約' + (n >= 1e5 ? Math.round(n / 1e4) : Math.round(n / 1e3) / 10).toLocaleString() + '万人';
    return '約' + sig2(n).toLocaleString() + '人';
  };
  // "約23倍" / "約1/5" / "ほぼ おなじ"
  App.ratioText = function (a, b) {
    var r = a / b;
    if (r > 0.9 && r < 1.1) return 'ほぼ おなじ';
    if (r >= 1) return '約' + (r < 10 ? Math.round(r * 10) / 10 : Math.round(r)).toLocaleString() + '倍';
    var inv = 1 / r;
    if (inv < 2) return '約' + Math.round(r * 10) + 'わり';
    return '約' + (inv < 10 ? Math.round(inv * 10) / 10 : Math.round(inv)).toLocaleString() + '分の1';
  };
  App.round1 = function (x) { return Math.round(x * 10) / 10; };

  App.capitalName = function (c) { return c.capJa || c.capEn || '—'; };
  App.capitalPoint = function (c) { return c.capLL || c.cen; };
  App.distanceKm = function (c) {
    if (c.id === 'JPN') return 0;
    return Math.round(d3.geoDistance([139.69, 35.69], App.capitalPoint(c)) * R);
  };

  // ---------- time ----------
  App.localParts = function (tz, date) {
    try {
      var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', weekday: 'short', month: 'numeric', day: 'numeric', hour12: false });
      var o = {};
      f.formatToParts(date || new Date()).forEach(function (p) { o[p.type] = p.value; });
      return { h: (+o.hour) % 24, m: +o.minute, wd: o.weekday, month: +o.month, day: +o.day };
    } catch (e) { return null; }
  };
  // hours ahead (+) / behind (-) of Japan
  App.offsetFromJapan = function (tz) {
    var now = new Date();
    var a = App.localParts(tz, now), j = App.localParts('Asia/Tokyo', now);
    if (!a || !j) return null;
    var mins = (a.h * 60 + a.m) - (j.h * 60 + j.m);
    var dd = 0;
    if (a.day !== j.day) {
      if (a.day === 1 && j.day > 27) dd = 1;
      else if (j.day === 1 && a.day > 27) dd = -1;
      else dd = a.day > j.day ? 1 : -1;
    }
    mins += dd * 1440;
    return mins / 60;
  };
  App.clockText = function (h, m) {
    var mm = m ? (m < 10 ? '0' + m : m) + '分' : '';
    if (h === 0) return 'よる 12時' + mm;
    if (h < 12) return 'ごぜん ' + h + '時' + mm;
    if (h === 12) return 'おひる 12時' + mm;
    return 'ごご ' + (h - 12) + '時' + mm;
  };
  App.kidActivity = function (p, id) {
    if (!p) return '';
    var weekend = (id === 'SAU') ? (p.wd === 'Fri' || p.wd === 'Sat') : (p.wd === 'Sat' || p.wd === 'Sun');
    var h = p.h;
    if (h < 6) return '😴 子どもたちは ぐっすり ねているよ';
    if (h < 8) return '🍞 あさごはんの 時間かな';
    if (h < 15) return weekend ? '⚽ お休みの日。あそんでいるかな？' : '🏫 学校で 勉強している 時間かな';
    if (h < 18) return '🛝 学校から 帰って あそんでいるかな';
    if (h < 21) return '🍽️ 夕ごはんの 時間かな';
    return '🛏️ もう すぐ ねる 時間';
  };
  App.seasonText = function (c) {
    var lat = App.capitalPoint(c)[1];
    var m = new Date().getMonth() + 1;
    var north = ['冬', '冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬'];
    var jp = north[m - 1];
    var cap = '首都 ' + App.capitalName(c) + 'は ';
    if (Math.abs(lat) < 23.5) return { icon: '🌴', text: cap + '赤道に 近いので、日本のような 春夏秋冬の ちがいが 小さいよ。（国の 中でも 場所に よって ちがうよ）', jp: jp };
    if (lat < 0) { var s = north[(m + 5) % 12]; return { icon: '🔄', text: cap + '南半球に あるから、きせつが 日本と 反対！ いま 日本は ' + jp + '、あっちは ' + s + '。', jp: jp, there: s }; }
    return { icon: '🍂', text: cap + '北半球に あるから、きせつは 日本と おなじ。いまは どちらも ' + jp + '。', jp: jp, there: jp };
  };

  // ---------- saving ----------
  var KEY = 'sekai-kurabekko-v1';
  var save;
  try { save = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { save = {}; }
  save.stamps = save.stamps || {};
  save.visited = save.visited || {};
  save.correct = save.correct || 0;
  save.games = save.games || {};
  App.save = save;
  App.persist = function () { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { } };
  App.addStamp = function (id) {
    if (save.stamps[id]) return false;
    var d = new Date();
    save.stamps[id] = (d.getMonth() + 1) + '/' + d.getDate();
    App.persist();
    return true;
  };
  App.markVisited = function (id) { if (!save.visited[id]) { save.visited[id] = 1; App.persist(); } };

  // ---------- sounds ----------
  var actx = null;
  App.soundOn = save.sound !== false;
  function tone(freq, start, dur, type, vol) {
    if (!App.soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, actx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(vol || 0.18, actx.currentTime + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + start + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(actx.currentTime + start); o.stop(actx.currentTime + start + dur + 0.05);
    } catch (e) { }
  }
  App.sfx = {
    good: function () { tone(660, 0, 0.15); tone(880, 0.12, 0.25); },
    bad: function () { tone(220, 0, 0.25, 'triangle'); },
    tap: function () { tone(520, 0, 0.06, 'sine', 0.08); },
    stamp: function () { tone(180, 0, 0.12, 'square', 0.12); tone(523, 0.15, 0.15); tone(659, 0.28, 0.15); tone(784, 0.41, 0.3); },
  };

  // ---------- voices ----------
  App.speak = function (text, lang) {
    if (!('speechSynthesis' in window)) { App.toast('この パソコンでは 声が 出せないみたい'); return; }
    var voices = speechSynthesis.getVoices();
    var exact = voices.filter(function (v) { return v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase(); });
    var near = voices.filter(function (v) { return v.lang.toLowerCase().slice(0, 2) === lang.slice(0, 2).toLowerCase(); });
    var v = exact[0] || near[0];
    if (!v && voices.length) { App.toast('この ことばの 声は この パソコンに ないみたい。文字を 読んでみよう！'); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang; if (v) u.voice = v; u.rate = 0.85;
    speechSynthesis.speak(u);
  };
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  // play recorded clips one after another; fall back to the computer's voice
  var current = null;
  App.playPhrase = function (item, voice) {
    if (current) { current.pause(); current = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    var list = (item.audio || []).slice();
    if (!list.length) { App.speak(item.text, voice); return; }
    (function next() {
      var src = list.shift(); if (!src) return;
      var a = new Audio(src); current = a;
      a.onended = function () { setTimeout(next, 250); };
      a.play().catch(function () { App.speak(item.text, voice); });
    })();
  };
  App.playHello = function (fun) { App.playPhrase(fun.hello, fun.voice); };

  // ---------- UI helpers ----------
  App.h = function (html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  App.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var toastTimer;
  App.toast = function (msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  };
  App.modal = function (html, opts) {
    opts = opts || {};
    var root = document.getElementById('modal-root');
    root.innerHTML = '';
    var wrap = App.h('<div class="modal-back"><div class="modal ' + (opts.cls || '') + '" role="dialog">' + html + '</div></div>');
    root.appendChild(wrap);
    function close() { root.innerHTML = ''; if (opts.onClose) opts.onClose(); }
    wrap.addEventListener('click', function (e) { if (e.target === wrap && !opts.locked) close(); });
    wrap.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
    return { el: wrap, close: close };
  };
  App.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  App.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  App.imgOrEmoji = function (item, cls) {
    if (!item) return '';
    if (item.img) return '<div class="pic ' + (cls || '') + '"><img src="' + item.img + '" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\');this.remove()"><span class="pic-emoji">' + item.emoji + '</span></div>';
    return '<div class="pic noimg ' + (cls || '') + '"><span class="pic-emoji">' + item.emoji + '</span></div>';
  };

  // search: katakana, hiragana, kanji readings, English
  function toKata(s) { return s.replace(/[ぁ-ゖ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) + 0x60); }); }
  App.search = function (q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var k = toKata(q);
    return App.listed.filter(function (c) {
      var y = window.YOMI[c.id] || '';
      return c.ja.indexOf(q) >= 0 || c.ja.indexOf(k) >= 0 || toKata(y).indexOf(k) >= 0 || c.en.toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return (b.fun ? 1 : 0) - (a.fun ? 1 : 0) || b.pop - a.pop; }).slice(0, 12);
  };

  App.todaysCountry = function () {
    var d = new Date(); var n = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate();
    var pool = App.featured.filter(function (c) { return c.id !== 'JPN'; });
    return pool[(n * 7) % pool.length];
  };

  // ranks among listed countries
  function rank(field) {
    var arr = App.listed.filter(function (c) { return c[field]; }).sort(function (a, b) { return b[field] - a[field]; });
    var r = {}; arr.forEach(function (c, i) { r[c.id] = i + 1; }); return { r: r, n: arr.length };
  }
  App.rankArea = rank('area');
  App.rankPop = rank('pop');
})();
