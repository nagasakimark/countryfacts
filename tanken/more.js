/* せかいたんけん: everything moved over from the first app (せかい くらべっこ), so /tanken works on its own:
   - 📏 true-size compare on the globe (drag country shapes; they keep their real size)
   - 5 more games: 日本 何こ分？ / どっちが 大きい？ / あいさつ クイズ / シルエット クイズ / 時差 クイズ
   - badges (from the passport) in the sticker book
   - a country list by continent (the old map picker)
   - help + about/credits page (no links out of the app)
   - landmark deep dives: history timeline, secrets and a quiz (content in data/deep.js)
   Uses window.TK from tanken/ui.js. */
(function () {
  var $ = function (s) { return document.querySelector(s); }, esc = App.esc, byId = App.byId;
  var R = TK.R, B = TK.B, S = TK.S, L = TK.L, rb = TK.rb;
  var plain = Globe.plain, DEEP = window.DEEP || {};
  ['lq'].forEach(function (k) { S[k] = S[k] || {}; });
  function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }
  function today() { var d = new Date(); return (d.getMonth() + 1) + '/' + d.getDate(); }
  function flag(c, st) { return c && c.a2 ? '<img src="flags/' + c.a2.toLowerCase() + '.svg" alt="" style="' + (st || '') + '">' : ''; }
  function cn(c) { return TK.lang() === 'en' ? c.en : c.ja; }
  var CONT_EN = { 'アジア': 'Asia', 'ヨーロッパ': 'Europe', 'アフリカ': 'Africa', '北アメリカ': 'North America', '南アメリカ': 'South America', 'オセアニア': 'Oceania' };
  function contName(k) { return TK.lang() === 'en' ? CONT_EN[k] || k : k; }

  /* ---------- small true-size picture (country + Japan on top), used on country pages and in the size panel ---------- */
  function tsBox(c, size) {
    if (!App.mainShape(c.id)) return '';
    var r = c.area / App.JP.area, jp = c.id !== 'JPN';
    var line = !jp ? '' : r >= 1 ? L('日本が 約 <b>' + (r < 10 ? App.round1(r) : Math.round(r)) + 'こ</b> 入る 広さ', 'About <b>' + (r < 10 ? App.round1(r) : Math.round(r)) + '</b> Japans fit inside') : L('日本の 中に 約 <b>' + Math.round(1 / r).toLocaleString() + 'こ</b> 入る 広さ', 'About <b>' + Math.round(1 / r).toLocaleString() + '</b> of them fit inside Japan');
    var icons = '';
    if (jp && r >= 1.5) { var n = Math.min(Math.round(r), 40); for (var i = 0; i < n; i++) icons += App.japanIcon(); if (Math.round(r) > 40) icons += '<span class="more">…</span>'; }
    return '<div class="tsbox">' + App.trueSizeSVG(c.id, { japan: jp, size: size || 220 }) + '<div class="tsk"><span><i style="background:#4A90C8"></i>' + esc(cn(c)) + '</span>' + (jp ? '<span><i style="background:#E2434B"></i>' + L('日本', 'Japan') + '</span>' : '') + '</div>' +
      (line ? '<div class="ctr" style="font-size:16px">' + line + '</div>' : '') + (icons ? '<div class="jp-icons">' + icons + '</div>' : '') + '</div>';
  }
  TK.tsBox = tsBox;

  /* ======================================================================
     📏 true size on the globe
     ====================================================================== */
  var SZ = { on: false, pending: false, cmp: null, tok: 0 };
  var DEMOS = [
    { id: 'GRL', to: [20, 5], ja: '🧊 グリーンランドを アフリカへ', en: '🧊 Greenland to Africa', mja: '平らな ちずでは アフリカと おなじくらいに 見える グリーンランド。 でも 本当は アフリカの 約14分の1！', men: 'On flat maps Greenland looks as big as Africa. Really, Africa is about 14 times bigger!' },
    { id: 'RUS', to: [20, 0], ja: '🐻 ロシアを {赤道|せきどう}へ', en: '🐻 Russia to the equator', mja: '北に ある ロシアは、 平らな ちずでは とても 大きく 見える。 {赤道|せきどう}に もってくると… それでも 世界一 大きい 国！', men: 'Flat maps make Russia look huge. On the equator it is smaller, but still the biggest country in the world!' },
    { id: null, jp: [12, 50], ja: '🗾 日本を ヨーロッパへ', en: '🗾 Japan to Europe', mja: '日本を ヨーロッパに おくと… 日本は 意外と 大きい 国なんだ！', men: 'Put Japan on Europe... Japan is bigger than you might think!' },
    { id: 'AUS', to: [138, 37], ja: '🦘 オーストラリアを 日本へ', en: '🦘 Australia to Japan', mja: 'オーストラリアを 日本に もってくると… 日本が すっぽり 入って しまうね。', men: 'Bring Australia to Japan... Japan disappears inside it!' },
    { id: 'USA', to: [138, 37], ja: '🇺🇸 アメリカを 日本へ', en: '🇺🇸 USA to Japan', mja: 'アメリカを 日本に かさねると… 日本が いくつ 入るかな？', men: 'Put the USA on Japan. How many Japans fit inside?' },
    { id: 'BRA', to: [138, 37], ja: '🇧🇷 ブラジルを 日本へ', en: '🇧🇷 Brazil to Japan', mja: 'ブラジルを 日本に かさねると… どれくらい 大きいかな？', men: 'Put Brazil on Japan. How big is it?' },
    { id: 'IND', to: [138, 37], ja: '🐘 インドを 日本へ', en: '🐘 India to Japan', mja: 'インドの 広さは 日本の 約9倍。 人口は 日本の 10倍 以上！', men: 'India is about 9 times bigger than Japan, with more than 10 times as many people!' },
    { id: 'GBR', to: [138, 37], ja: '💂 イギリスを 日本へ', en: '💂 UK to Japan', mja: 'イギリスは 日本より 小さい。 ちずで 見ると 大きく 見えるけど、 日本の 約3分の2！', men: 'The UK is smaller than Japan: about two thirds of its size.' },
  ];
  function shapeOf(id) {
    var f = App.mainShape(id); if (!f) return null; var c = byId[id];
    return { id: id, f: f, from: f.center, to: f.center.slice(), col: id === 'JPN' ? '#ff4d5a' : '#2b7de0', label: plain(cn(c)) };
  }
  function shapeRadius(s) { var g = s.f.geometry, r = 0, cc = s.f.center; (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).forEach(function (p) { p[0].forEach(function (q, i) { if (i % 3 === 0) r = Math.max(r, d3.geoDistance(cc, q)); }); }); return r; }
  function slide(s, to, ms, done) {
    var tk = ++SZ.tok, from = s.to.slice(), ip = d3.geoInterpolate(from, to), t0 = performance.now();
    (function step(now) {
      if (tk !== SZ.tok || !SZ.on) return; var t = Math.min(1, (now - t0) / ms), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      s.to = ip(e); if (t < 1) requestAnimationFrame(step); else { s.to = to.slice(); whereNow(s); if (done) done(); }
    })(t0);
  }
  function jpShape() { return Globe.shapes.filter(function (s) { return s.id === 'JPN'; })[0]; }
  function cmpShape() { return Globe.shapes.filter(function (s) { return s.id !== 'JPN'; })[0]; }
  function sizeStart(id) {
    SZ.on = true; SZ.cmp = null; SZ.msg = null; Globe.shapes = [shapeOf('JPN')]; Globe.select(null);
    Globe.onTap = function (ll) { var cid = Globe.countryAt(ll); if (cid && cid !== 'JPN' && byId[cid] && App.mainShape(cid)) { TK.boing(); pickCmp(cid); } };
    Globe.onShapeMove = function (s) { var n = performance.now(); if (n - (SZ.mt || 0) > 150) { SZ.mt = n; whereNow(s); } };
    Globe.onShapeDrop = function (s) { TK.tone(520, 0.08); whereNow(s); };
    if (id && byId[id]) pickCmp(id); else Globe.flyTo(App.JP.cen[0] + 4, App.JP.cen[1] - 4, 1.5, 900);
  }
  function sizeEnd() { SZ.on = false; SZ.tok++; Globe.shapes = []; Globe.onTap = null; Globe.onShapeMove = Globe.onShapeDrop = null; }
  function pickCmp(id, keepView) {
    var old = cmpShape(); if (old) Globe.shapes.splice(Globe.shapes.indexOf(old), 1);
    var j = jpShape(); if (j) j.to = j.from.slice();
    var s = shapeOf(id); if (!s) return; Globe.shapes.unshift(s); SZ.cmp = id; SZ.msg = null; TK.setArg(id);
    var target = [App.JP.cen[0] + 6, App.JP.cen[1] - 4], rad = Math.max(shapeRadius(s), 0.12);
    if (!keepView) Globe.flyTo(target[0], target[1], Math.max(0.9, Math.min(2.6, rad * 2.6 + 0.5)), 900);
    setTimeout(function () { slide(s, target, 1400); }, keepView ? 0 : 450);
    TK.render();
  }
  function latText(lat) {
    lat = Math.round(lat);
    if (TK.lang() === 'en') return lat === 0 ? 'on the equator' : Math.abs(lat) + '°' + (lat > 0 ? 'N' : 'S');
    return lat === 0 ? '{赤道|せきどう}の 上' : (lat > 0 ? '{北緯|ほくい} ' : '{南緯|なんい} ') + Math.abs(lat) + '°';
  }
  function whereNow(s) {
    var e = $('#szw'); if (!e || !s) return; var c = byId[s.id], u = Globe.countryAt(s.to), uc = u && u !== s.id && byId[u];
    var lat = s.to[1];
    e.innerHTML = '📍 <b>' + esc(cn(c)) + '</b>' + rb(L('は いま ' + (uc ? uc.ja + 'の 上' : '海の 上') + '（' + latText(lat) + '）', ' is now ' + (uc ? 'on ' + uc.en : 'in the sea') + ' (' + latText(lat) + ')')) +
      (Math.abs(lat) > 55 ? '<br>' + rb(L('💡 平らな ちずでは、 北や 南の はしに 行くほど 国が 大きく 見えるよ。 地球ぎでは 本当の 大きさ！', '💡 Flat maps make places near the poles look bigger. On a globe, everything is its real size!')) : '');
  }
  R.size = function () {
    var c = SZ.cmp && byId[SZ.cmp], out = '<div class="cname"><h1>📏 ' + L('ほんとうの 大きさ', 'True size') + '</h1><small>' + rb(L('色の ついた 国を ドラッグして うごかそう。 地球の 上では 大きさが かわらないよ。', 'Drag the coloured countries around. On a globe they keep their real size.')) + '</small></div>';
    if (SZ.msg) out += '<div class="note" style="margin:8px 0">' + rb(SZ.msg) + '</div>';
    if (c) {
      out += '<div class="box" style="margin-top:8px"><div class="head" style="margin:0">' + flag(c, 'width:56px;height:42px;border:3px solid #3b2a5c;object-fit:cover') + '<div><h2 style="margin:0;font-size:24px">' + esc(cn(c)) + '</h2><small>' + esc(TK.lang() === 'en' ? c.ja : c.en) + '</small></div></div>' +
        '<div class="big" style="margin-top:6px">' + L('ほんとうの 広さは 日本の <b>' + App.ratioText(c.area, App.JP.area) + '</b>', 'Its real area is <b>' + enRatio(c.area / App.JP.area) + '</b> Japan') + '</div>' +
        '<div id="szw" class="mut" style="font-size:14px;opacity:.9"></div>' +
        '<div class="btns"><button class="btn bl" id="szback">↩ ' + L('もとの 場所に もどす', 'Put them back') + '</button><button class="btn pk" data-c="' + c.id + '">' + L('この 国の ページ ▶', 'Country page ▶') + '</button></div></div>' + tsBox(c, 200);
    } else out += '<div class="box" style="margin-top:8px">' + rb(L('👆 地球の 国を タッチするか、 下から えらんでね。 赤い 日本も ドラッグできるよ！', '👆 Tap a country on the globe or pick one below. You can drag red Japan too!')) + '<div id="szw" class="mut"></div></div>';
    out += '<span class="lab">✨ ' + L('ためして みよう', 'Try these') + '</span><div class="demos">' + DEMOS.map(function (d, i) { return '<button class="btn or" data-demo="' + i + '">' + rb(L(d.ja, d.en)) + '</button>'; }).join('') + '</div>';
    out += '<span class="lab">📏 ' + L('くらべる 国を えらぶ', 'Pick a country') + '</span>' + contPicker('sz');
    return out + '<div style="height:8px"></div>';
  };
  function enRatio(r) { return r > 0.9 && r < 1.1 ? 'about the same as' : r >= 1 ? 'about ' + (r < 10 ? App.round1(r) : Math.round(r)) + ' times the size of' : 'about 1/' + Math.round(1 / r) + ' the size of'; }
  B.size = function (pg) {
    if (SZ.pending) { SZ.pending = false; sizeStart(TK.arg()); }
    var bk = $('#szback'); if (bk) bk.onclick = function () { TK.beep(); Globe.shapes.forEach(function (s) { slide(s, s.from, 1000); }); };
    each(pg, '[data-demo]', function (b) {
      b.onclick = function () {
        TK.boing(); var d = DEMOS[+b.dataset.demo];
        if (d.id) { pickCmp(d.id, true); var s = cmpShape(); SZ.tok++; s.to = s.from.slice(); Globe.flyTo(d.to[0] + 8, d.to[1] + 6, Math.max(1.2, Math.min(2.6, shapeRadius(s) * 3 + 0.6)), 900); setTimeout(function () { slide(s, d.to, 1800); }, 600); }
        else { var j = jpShape(), o = cmpShape(); if (o) o.to = o.from.slice(); Globe.flyTo(d.jp[0], d.jp[1], 1.3, 900); setTimeout(function () { slide(j, d.jp, 1800); }, 500); }
        SZ.msg = L(d.mja, d.men); TK.render();
      };
    });
    bindPicker(pg, 'sz', function (id) { if (id !== 'JPN') pickCmp(id); });
    var s = cmpShape(); if (s) whereNow(s);
  };

  /* ======================================================================
     country list by continent (from the old map screen)
     ====================================================================== */
  var lastCont = 'アジア';
  function contPicker(kind) {
    var out = '<div class="tabs2 ctabs">' + App.CONTINENTS.map(function (ct, i) { return '<button data-ct="' + ct.key + '" class="' + (ct.key === lastCont ? 'on' : '') + '" style="background:' + ['#e0483a', '#2b7de0', '#ff7a2f', '#16a085', '#7a4bd8', '#0aa1b8'][i] + '">' + ct.icon + ' ' + esc(contName(ct.key)) + '</button>'; }).join('') + '</div>';
    var cs = App.listed.filter(function (c) { return c.region === lastCont && (kind !== 'sz' || c.id !== 'JPN') && App.mainShape(c.id); })
      .sort(function (a, b) { return (b.fun ? 1 : 0) - (a.fun ? 1 : 0) || b.pop - a.pop; });
    return out + '<div class="cgrid">' + cs.map(function (c) {
      return '<div class="ct" data-' + kind + '="' + c.id + '">' + flag(c) + '<span>' + esc(cn(c)) + '</span>' + (c.fun ? '<i class="st">★</i>' : '') + (App.save.stamps[c.id] ? '<i class="ok">✔</i>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function bindPicker(pg, kind, fn) {
    each(pg, '[data-ct]', function (b) { b.onclick = function () { TK.beep(); lastCont = b.dataset.ct; var y = $('#page').scrollTop; TK.render(); $('#page').scrollTop = y; }; });
    each(pg, '[data-' + kind + ']', function (b) { b.onclick = function () { fn(b.getAttribute('data-' + kind)); }; });
  }
  R.countries = function () {
    var t = App.todaysCountry();
    return '<div class="cname"><h1>🌏 ' + L('国を さがす', 'Find a country') + '</h1><small>' + rb(L('★は くわしい ページが ある 国。 上の 🔍に 名前を 入れても さがせるよ。', '★ = countries with extra pages. You can also type a name in the 🔍 box.')) + '</small></div>' +
      '<div class="btns"><button class="btn pk" data-c="' + t.id + '">⭐ ' + L('きょうの 国：', 'Country of the day: ') + esc(cn(t)) + '</button><button class="btn pu" data-c="JPN">🇯🇵 ' + L('日本', 'Japan') + '</button></div>' +
      contPicker('cl') + '<div style="height:8px"></div>';
  };
  B.countries = function (pg) { bindPicker(pg, 'cl', function (id) { TK.choose(id); }); };

  /* ======================================================================
     🎮 the five games from the first app (5 questions each)
     ====================================================================== */
  var MG = { howmany: ['🗾', '日本 何こ分？', 'How many Japans?', '国の 形を 見て、 日本が 何こ 入るか あてよう', 'How many Japans fit in this country?', '#ffc531'],
    bigger: ['⚖️', 'どっちが 大きい？', 'Which is bigger?', '広さや 人口を くらべよう', 'Compare area and population', '#4fb3ff'],
    hello: ['👋', 'あいさつ クイズ', 'Hello quiz', '「こんにちは」を 聞いて、 どこの 国か あてよう', 'Hear "hello" and guess the country', '#ff6f91'],
    shape: ['🧩', 'シルエット クイズ', 'Shape quiz', '国の 形だけで わかるかな？', 'Can you tell a country by its shape?', '#7a4bd8'],
    time: ['🕐', '{時差|じさ} クイズ', 'Time quiz', '日本が 夜の とき、 あの 国は 何時？', 'When it is night in Japan, what time is it there?', '#33c9a0'] };
  TK.isMore = function (k) { return !!MG[k]; };
  TK.moreGames = function () {
    return '<h3 style="margin:14px 4px 0;font-size:16px">🧩 ' + L('くらべっこ ゲーム（5もん）', 'Compare games (5 questions)') + '</h3>' + Object.keys(MG).map(function (k) {
      var g = MG[k], b = App.save.games[k];
      return '<button class="gbtn" data-g="' + k + '"><span class="gi" style="background:' + g[5] + '">' + g[0] + '</span><span><b>' + rb(L(g[1], g[2])) + '</b><small>' + rb(L(g[3], g[4])) + '<br>⭐ ' + (b != null ? L('さいこう ', 'Best ') + b + ' / 5' : L('まだ あそんでいない', 'Not played yet')) + '</small></span></button>';
    }).join('');
  };
  var game = null;
  TK.startMore = function (k) { game = { k: k, round: 0, score: 0, used: {}, q: null, done: false }; nextQ(); TK.open('mg', k); };
  function nextQ() { game.round++; game.done = false; game.q = MAKE[game.k](game.used); }
  function choosePool(pool, used) { var free = pool.filter(function (c) { return !used[c.id]; }); var c = App.pick(free.length ? free : pool); used[c.id] = 1; return c; }
  function fmtTimes(r) { var n = r >= 1 ? (r < 10 ? App.round1(r) : Math.round(r)) : Math.max(2, Math.round(1 / r)); return r >= 1 ? L('日本 ' + n + 'こ分', n + ' × Japan') : L('日本の ' + n + '分の1', '1/' + n + ' of Japan'); }
  function nmF(c) { return flag(c, 'width:30px;height:22px;border:2px solid #3b2a5c;object-fit:cover;vertical-align:middle;margin-right:6px') + esc(cn(c)); }
  var MAKE = {
    howmany: function (used) {
      var pool = App.listed.filter(function (c) { var r = c.area / App.JP.area; return c.id !== 'JPN' && App.mainShape(c.id) && ((r >= 1.4 && r <= 50) || (r >= 0.25 && r <= 0.7)); });
      var c = choosePool(pool, used), r = c.area / App.JP.area, opts = [r, r * 3, r / 3], lab = opts.map(fmtTimes);
      if (lab[1] === lab[0] || lab[2] === lab[0]) { opts = [r, r * 5, r / 5]; lab = opts.map(fmtTimes); }
      var order = App.shuffle([0, 1, 2]);
      return { vis: App.trueSizeSVG(c.id, { size: 220 }) + '<div class="gname">' + nmF(c) + '</div>', rev: App.trueSizeSVG(c.id, { size: 220, japan: true }) + '<div class="gname">' + nmF(c) + ' ＋ <span style="color:#E2434B">' + L('日本', 'Japan') + '</span></div>',
        q: L(esc(c.ja) + 'の 広さは 日本 何こ分？', 'How many Japans is ' + esc(c.en) + '?'), o: order.map(function (i) { return lab[i]; }), a: order.indexOf(0), id: c.id,
        why: L(esc(c.ja) + 'は 日本の ' + App.ratioText(c.area, App.JP.area) + '。', esc(c.en) + ' is ' + enRatio(r) + ' Japan.') };
    },
    bigger: function () {
      var byPop = Math.random() < 0.5, f = byPop ? 'pop' : 'area', pool = App.listed.filter(function (c) { return c[f] && c[f] > (byPop ? 3e6 : 5e4) && c.a2; }), a, b, n = 0;
      do { a = App.pick(pool); b = App.pick(pool); n++; } while ((a === b || Math.max(a[f], b[f]) / Math.min(a[f], b[f]) < 1.3) && n < 50);
      var fmt = function (v) { return TK.lang() === 'en' ? (byPop ? (v >= 1e6 ? Math.round(v / 1e5) / 10 + ' million people' : Math.round(v / 1e3) + ',000 people') : Math.round(v).toLocaleString() + ' km²') : (byPop ? App.fmtPeople(v) : App.fmtArea(v)); };
      return { vis: '<div class="vsf">' + flag(a) + '<b>VS</b>' + flag(b) + '</div>', q: byPop ? L('人口（すんでいる 人）が 多いのは どっち？', 'Which has more people?') : L('広い のは どっち？', 'Which is bigger?'),
        o: [nmF(a), nmF(b)], raw: true, a: a[f] > b[f] ? 0 : 1, why: esc(cn(a)) + ' ' + fmt(a[f]) + L('、', ', ') + esc(cn(b)) + ' ' + fmt(b[f]) + L('。', '.') };
    },
    hello: function (used) {
      var pool = App.featured.filter(function (c) { return c.id !== 'JPN' && c.fun && c.fun.hello; }), c = choosePool(pool, used);
      var wrong = App.shuffle(pool.filter(function (x) { return x.fun.hello.text !== c.fun.hello.text; })).slice(0, 2), o = App.shuffle([c].concat(wrong));
      return { vis: '<div class="hbig" lang="' + esc(c.fun.voice || '') + '">' + esc(c.fun.hello.text) + '</div><div class="ctr mut">' + esc(c.fun.hello.kana) + '</div><div class="ctr"><button class="btn pk" id="play">🔊 ' + L('きく', 'Listen') + '</button></div>',
        play: c, q: L('この「こんにちは」は どこの 国の ことば？', 'Which country says "hello" like this?'), o: o.map(nmF), raw: true, a: o.indexOf(c), id: c.id,
        why: L(esc(c.ja) + 'の ' + esc(c.fun.lang) + 'だよ。', 'It is from ' + esc(c.en) + '.') };
    },
    shape: function (used) {
      var pool = App.listed.filter(function (c) { return c.id !== 'JPN' && App.mainShape(c.id) && (c.fun || c.area > 4e5); }), c = choosePool(pool, used);
      var wrong = App.shuffle(pool.filter(function (x) { return x !== c && x.region === c.region; })).slice(0, 2);
      if (wrong.length < 2) wrong = wrong.concat(App.shuffle(pool.filter(function (x) { return x !== c && wrong.indexOf(x) < 0; })).slice(0, 2 - wrong.length));
      var o = App.shuffle([c].concat(wrong));
      return { vis: App.trueSizeSVG(c.id, { size: 220, color: '#5B6770' }), rev: App.trueSizeSVG(c.id, { size: 220 }) + '<div class="gname">' + nmF(c) + '</div>',
        q: L('この 形は どこの 国？（ヒント：' + esc(c.region) + '）', 'Which country has this shape? (Hint: ' + esc(CONT_EN[c.region] || c.region) + ')'), o: o.map(nmF), raw: true, a: o.indexOf(c), id: c.id,
        why: L(esc(c.ja) + 'の 形だよ。', 'It is ' + esc(c.en) + '.') };
    },
    time: function (used) {
      var pool = App.featured.filter(function (c) { if (c.id === 'JPN' || !c.tz) return false; var off = App.offsetFromJapan(c.tz); return off != null && off !== 0 && off === Math.round(off); });
      var c = choosePool(pool, used), off = App.offsetFromJapan(c.tz), jpH = App.pick([8, 12, 18, 21]), t = ((jpH + off) % 24 + 24) % 24, cands = [t];
      [3, -3, 6, -6, 12].forEach(function (d) { var v = ((t + d) % 24 + 24) % 24; if (cands.length < 3 && cands.indexOf(v) < 0) cands.push(v); });
      var o = App.shuffle(cands), ck = function (h) { return TK.lang() === 'en' ? ((h % 12) || 12) + (h < 12 ? ' a.m.' : ' p.m.') : App.clockText(h, 0); };
      return { vis: '<div class="vsf"><img src="flags/jp.svg" alt=""><b>' + ck(jpH) + '</b></div>', q: L('日本が <b>' + ck(jpH) + '</b>の とき、 ' + esc(c.ja) + '（' + esc(App.capitalName(c)) + '）は 何時？', 'When it is <b>' + ck(jpH) + '</b> in Japan, what time is it in ' + esc(c.en) + ' (' + esc(c.capEn || '') + ')?'),
        o: o.map(ck), a: o.indexOf(t), id: c.id, why: L(esc(c.ja) + 'は 日本より ' + Math.abs(off) + '時間 ' + (off < 0 ? 'おくれている' : 'すすんでいる') + 'よ。', esc(c.en) + ' is ' + Math.abs(off) + ' hours ' + (off < 0 ? 'behind' : 'ahead of') + ' Japan.') };
    },
  };
  R.mg = function () {
    var g = game; if (!g) return ''; var m = MG[g.k];
    if (g.round > 5) {
      var best = App.save.games[g.k], nb = best == null || g.score > best; if (nb) { App.save.games[g.k] = g.score; App.persist(); }
      setTimeout(function () { TK.fanfare(); TK.confetti(); checkBadges(); }, 200);
      return '<div class="cname" style="margin-top:30px"><h1>' + m[0] + ' ' + rb(L(m[1], m[2])) + '</h1><div style="font-size:60px">' + (g.score >= 5 ? '⭐⭐⭐' : g.score >= 3 ? '⭐⭐' : g.score >= 1 ? '⭐' : '🌱') + '</div><div class="big" style="font-size:30px">' + g.score + ' / 5</div>' +
        (nb ? '<div class="stk new">' + L('さいこう きろく！', 'New best!') + '</div>' : '<div class="mut">' + L('さいこう ', 'Best ') + best + '</div>') + '<div class="big">' + (g.score === 5 ? L('パーフェクト！ すごい！ 🎉', 'Perfect! 🎉') : g.score >= 3 ? L('よく できました！ 👏', 'Well done! 👏') : L('つぎは もっと いけるよ！ 💪', 'You can do better next time! 💪')) + '</div></div>' +
        '<div class="btns" style="margin-top:16px"><button class="btn" id="again">' + L('もう一回', 'Play again') + '</button><button class="btn pu" data-go="games">' + L('ゲーム えらび', 'All games') + '</button></div>';
    }
    var q = g.q;
    return '<div class="qhead"><b>' + m[0] + ' ' + rb(L(m[1], m[2])) + '　' + g.round + ' / 5</b><span>⭐ ' + g.score + '</span></div><div class="gvis" id="gv">' + q.vis + '</div><div class="big ctr" style="margin:4px 0">' + q.q + '</div>' +
      q.o.map(function (o, i) { return '<button class="opt" data-o="' + i + '">' + (q.raw ? o : esc(o)) + '</button>'; }).join('') + '<div id="gr"></div>';
  };
  B.mg = function (pg) {
    var ag = $('#again'); if (ag) ag.onclick = function () { TK.boing(); TK.startMore(game.k); };
    var g = game; if (!g || g.round > 5) return; var q = g.q;
    var pl = $('#play'); if (pl) pl.onclick = function () { TK.boing(); App.playHello(q.play.fun); };
    each(pg, '[data-o]', function (b) {
      b.onclick = function () {
        if (g.done) return; g.done = true; var ok = +b.dataset.o === q.a;
        pg.querySelectorAll('[data-o]')[q.a].classList.add('right'); if (!ok) b.classList.add('wrong');
        if (ok) { g.score++; App.save.correct++; App.persist(); App.sfx.good(); } else App.sfx.bad();
        if (q.rev) $('#gv').innerHTML = q.rev;
        if (q.id && Globe.CEN[q.id]) { Globe.select(q.id); Globe.flyToCountry(q.id); }
        $('#gr').innerHTML = '<div class="box" style="background:' + (ok ? '#d6f5dd' : '#ffe0e0') + '"><b>' + (ok ? L('せいかい！ ', 'Correct! ') : L('ざんねん！ ', 'Not quite! ')) + '</b>' + q.why + '</div><div class="ctr"><button class="btn" id="nx">' + (g.round >= 5 ? L('けっかを 見る 🏁', 'See results 🏁') : L('つぎ ▶', 'Next ▶')) + '</button></div>';
        $('#nx').onclick = function () { TK.beep(); Globe.select(null); nextQ(); TK.render(); };
        var pgEl = $('#page'); pgEl.scrollTop = pgEl.scrollHeight;
      };
    });
  };
  // keep the round going when the language changes (render() re-draws the same question)

  /* ======================================================================
     🏅 badges (from the passport) + new ones for the globe
     ====================================================================== */
  function stats() {
    var ids = Object.keys(App.save.stamps), conts = {};
    ids.forEach(function (id) { var c = byId[id]; if (c) conts[c.region] = 1; });
    return { all: ids.length, conts: App.CONTINENTS.filter(function (ct) { return conts[ct.key]; }).length, feat: App.featured.filter(function (c) { return App.save.stamps[c.id]; }).length, correct: App.save.correct || 0,
      lm: Object.keys(S.lm).length, an: Object.keys(S.an).length, ve: Object.keys(S.ve).length, lq: Object.keys(S.lq).length };
  }
  var BADGES = [
    ['first', '🎫', 'はじめての スタンプ', 'First stamp', 'スタンプ 1こ', '1 stamp', function (n) { return n.all >= 1; }],
    ['s5', '🧭', 'たんけんか', 'Explorer', 'スタンプ 5こ', '5 stamps', function (n) { return n.all >= 5; }],
    ['s15', '✈️', 'せかい旅行者', 'World traveller', 'スタンプ 15こ', '15 stamps', function (n) { return n.all >= 15; }],
    ['conts', '🌍', '6大陸 せいは', 'Six continents', '6つの 大陸 ぜんぶで スタンプ', 'A stamp on every continent', function (n) { return n.conts >= 6; }],
    ['feat', '👑', '★の 国 コンプリート', 'All ★ countries', '★の 国 ぜんぶ', 'Every ★ country', function (n) { return n.feat >= App.featured.length; }],
    ['quiz20', '🧠', 'クイズ名人', 'Quiz star', 'ゲームで 20もん せいかい', '20 right answers in games', function (n) { return n.correct >= 20; }],
    ['quiz50', '🏆', 'クイズ はかせ', 'Quiz master', 'ゲームで 50もん せいかい', '50 right answers in games', function (n) { return n.correct >= 50; }],
    ['lm10', '🏛️', 'たてもの ハンター', 'Landmark hunter', 'たてものの シール 10まい', '10 landmark stickers', function (n) { return n.lm >= 10; }],
    ['lm50', '🗺️', 'たてもの マスター', 'Landmark master', 'たてものの シール 50まい', '50 landmark stickers', function (n) { return n.lm >= 50; }],
    ['an20', '🐾', 'どうぶつ はかせ', 'Animal expert', 'どうぶつの シール 20まい', '20 animal stickers', function (n) { return n.an >= 20; }],
    ['ve5', '🚂', 'のりもの 名人', 'Super rider', 'のりもので 5回 とうちゃく', 'Finish 5 rides', function (n) { return n.ve >= 5; }],
    ['lq5', '📜', 'れきし たんてい', 'History detective', 'たてものの クイズに 5回 せいかい', '5 landmark quizzes', function (n) { return n.lq >= 5; }],
  ];
  function checkBadges() {
    var n = stats(); App.save.badges = App.save.badges || {};
    BADGES.forEach(function (b, i) { if (b[6](n) && !App.save.badges[b[0]]) { App.save.badges[b[0]] = today(); App.persist(); setTimeout(function () { TK.fanfare(); TK.say('🏅 ' + L('バッジ ゲット！「' + b[2] + '」', 'New badge: ' + b[3])); }, 1600 + i * 300); } });
  }
  TK.checkBadges = checkBadges;
  TK.badges = function () {
    var n = stats();
    return '<span class="lab">🏅 ' + L('バッジ', 'Badges') + '</span><div class="bdg">' + BADGES.map(function (b) { var ok = b[6](n); return '<div class="bd' + (ok ? ' ok' : '') + '"><span>' + (ok ? b[1] : '🔒') + '</span><b>' + esc(L(b[2], b[3])) + '</b><small>' + esc(L(b[4], b[5])) + '</small></div>'; }).join('') + '</div>' +
      '<div class="mut ctr" style="margin-top:6px">' + L('ゲームの せいかい ', 'Right answers in games: ') + n.correct + '</div>';
  };
  // the sticker book: show which landmarks have a deep dive (📖) and which quizzes are done (⭐)
  var oBook = B.book;
  B.book = function (pg, a) {
    oBook(pg, a); checkBadges();
    each(pg, '[data-k^="lm:"]', function (e) { var id = e.dataset.k.slice(3); if (S.lq[id]) e.insertAdjacentHTML('beforeend', '<i class="gold">⭐</i>'); else if (DEEP[id] && S.lm[id]) e.insertAdjacentHTML('beforeend', '<i class="gold">📖</i>'); });
  };

  /* ======================================================================
     📖 landmark deep dives (data/deep.js): overview / history / secrets / quiz
     ====================================================================== */
  function T2(x) { return TK.lang() === 'en' ? x[1] : x[0]; }
  var oLm = R.landmark;
  var DT = function () { return [['d1', L('もよう', 'Overview'), '#ff6f91'], ['d2', L('れきし', 'History'), '#e08a1e'], ['d3', L('ひみつ', 'Secrets'), '#16a085'], ['d4', L('クイズ', 'Quiz'), '#e0483a']]; };
  R.landmark = function (a) {
    var d = DEEP[a.id], tab = a.tab || 'd1';
    if (!d) return oLm(a);
    var l = Globe.landmark(a.id), mini = '<div class="ph"><img src="' + Globe.thumb(l.m) + '" style="width:54px;height:54px" alt=""><div><h2>' + rb(TK.nm(l)) + '</h2><small>' + rb(T2(d.y)) + '</small></div></div>';
    if (tab === 'd1') {
      var html = oLm(a); a.fresh = false;
      var extra = (d.n ? '<div class="box" style="background:#e4f4ff">📐 ' + rb(T2(d.n)) + '</div>' : '') + '<div class="box">🕰️ ' + rb(L('いつ：', 'When: ') + T2(d.y)) + '</div>' +
        '<div class="ctr"><button class="btn pu" data-dt="d2">📜 ' + L('もっと 知る：れきしへ ▶', 'Dig deeper: history ▶') + '</button></div>';
      return html.replace('<div class="btns">', extra + '<div class="btns">');
    }
    if (tab === 'd2') return mini + '<span class="lab">' + L('れきし', 'History') + '</span><div class="tl">' + d.h.map(function (e) { return '<div class="ev"><span class="yr">' + rb(TK.lang() === 'en' ? e[1] : e[0]) + '</span><p>' + rb(TK.lang() === 'en' ? e[3] : e[2]) + '</p></div>'; }).join('') + '</div>' +
      '<div class="ctr"><button class="btn" data-dt="d3">' + L('ひみつを 見る ▶', 'Secrets ▶') + '</button></div><div style="height:8px"></div>';
    if (tab === 'd3') return mini + '<span class="lab">' + L('ひみつ・びっくり', 'Secrets & surprises') + '</span><div class="notes" style="margin-top:4px">' + d.s.map(function (x) { return '<div class="note">' + rb(T2(x)) + '</div>'; }).join('') + '</div>' +
      '<div class="ctr" style="margin-top:10px"><button class="btn or" data-dt="d4">' + L('クイズに ちょうせん ▶', 'Try the quiz ▶') + '</button></div><div style="height:8px"></div>';
    var q = d.q, got = S.lq[a.id];
    return mini + (got ? '<div class="box" style="background:#d6f5dd">⭐ ' + L('この クイズは もう せいかい したよ（' + got + '）。', 'You already got this one (' + got + ').') + '</div>' : '<div class="box" style="background:#fff6c4">' + L('せいかいすると シールに ⭐が つくよ！', 'Get it right to add a ⭐ to the sticker!') + '</div>') +
      '<div class="big" style="margin:8px 0">❓ ' + rb(T2(q[0])) + '</div>' + (a.qo || (a.qo = App.shuffle([0, 1, 2]))).map(function (i) { return '<button class="opt" data-lq="' + i + '">' + rb(T2(q[1][i])) + '</button>'; }).join('') + '<div id="lqr"></div>';
  };
  var oLmB = B.landmark;
  B.landmark = function (pg, a) {
    if (oLmB) oLmB(pg, a);
    if (!DEEP[a.id]) return;
    TK.tabs(DT(), a.tab || 'd1', function (p) { a.tab = p; a.fresh = false; TK.render(); });
    each(pg, '[data-dt]', function (b) { b.onclick = function () { TK.beep(); a.tab = b.dataset.dt; a.fresh = false; TK.render(); }; });
    var d = DEEP[a.id], done = false;
    each(pg, '[data-lq]', function (b) {
      b.onclick = function () {
        if (done) return; done = true; var ok = +b.dataset.lq === d.q[2];
        pg.querySelector('[data-lq="' + d.q[2] + '"]').classList.add('right'); if (!ok) b.classList.add('wrong');
        var r = $('#lqr');
        if (ok) {
          App.sfx.good(); var fresh = !S.lq[a.id]; if (fresh) { S.lq[a.id] = today(); TK.persist(); setTimeout(function () { TK.fanfare(); TK.confetti(); TK.say('⭐ ' + L('はかせ シール ゲット！', 'Gold star!')); checkBadges(); }, 300); }
          r.innerHTML = '<div class="box" style="background:#d6f5dd"><b>' + L('せいかい！ ', 'Correct! ') + '</b>' + rb(T2(d.q[3])) + '</div>';
        } else { App.sfx.bad(); r.innerHTML = '<div class="box" style="background:#ffe0e0"><b>' + L('ざんねん！ ', 'Not quite! ') + '</b>' + rb(T2(d.q[3])) + '</div><div class="ctr"><button class="btn" id="lqa">' + L('もう一回', 'Try again') + '</button></div>'; var x = $('#lqa'); x.onclick = function () { a.qo = null; TK.render(); }; }
        r.insertAdjacentHTML('beforeend', '<div class="btns"><button class="btn bl" id="lqn">' + L('つぎの れきし たんけん ▶', 'Next deep dive ▶') + '</button></div>');
        $('#lqn').onclick = function () { var ids = Object.keys(DEEP).filter(function (k) { return k !== a.id && Globe.landmark(k); }), fresh2 = ids.filter(function (k) { return !S.lq[k]; }); TK.showLandmark(App.pick(fresh2.length ? fresh2 : ids)); };
        $('#page').scrollTop = $('#page').scrollHeight;
      };
    });
  };

  /* ======================================================================
     🐾 endangered status (IUCN Red List) on animal cards: r field in data/toy.js
     ====================================================================== */
  var RL = { CR: ['#d7263d', 'ぜつめつ すんぜん', 'Critically Endangered', '野生では もう すぐ いなくなって しまうかも しれない。', 'It could soon disappear from the wild.'],
    EN: ['#f46036', 'とても あぶない', 'Endangered', '数が とても へっていて、 いなくなる きけんが 高い。', 'Its numbers have fallen a lot. It is at high risk of disappearing.'],
    VU: ['#f2b705', 'あぶない', 'Vulnerable', '数が へっていて、 このままだと あぶない。', 'Its numbers are falling. It could be in danger.'],
    NT: ['#8bc34a', 'もうすぐ あぶないかも', 'Near Threatened', 'いまは だいじょうぶだが、 気を つけて 見守る 必要が ある。', 'It is okay for now, but needs watching.'],
    LC: ['#2b9de0', 'いまは だいじょうぶ', 'Least Concern', '野生に たくさん いて、 いまは 心配が 少ない。', 'There are plenty in the wild for now.'],
    DD: ['#9a8bb8', 'よく わかっていない', 'Data Deficient', 'しらべる ための 数の データが まだ 足りない。', 'Scientists do not have enough data yet.'],
    DOM: ['#a0785a', '人が かっている どうぶつ', 'Farm animal', '人が 牧場などで かっている どうぶつ。 野生の しらべ方とは ちがう。', 'It is kept by people on farms, so it is not on the wild list.'] };
  var SCALE = ['LC', 'NT', 'VU', 'EN', 'CR'];
  function rlBox(a) {
    var r = RL[a.r]; if (!r) return '';
    var bar = a.r === 'DOM' || a.r === 'DD' ? '' : '<div class="rlbar">' + SCALE.map(function (k) { return '<span style="background:' + RL[k][0] + (k === a.r ? '' : ';opacity:.25') + '">' + (k === a.r ? '▼' : '') + '</span>'; }).join('') + '</div><div class="rlends"><span>' + L('あんしん', 'Safe') + '</span><span>' + L('あぶない', 'In danger') + '</span></div>';
    return '<div class="box rlbox"><div class="rlhead"><span class="rltag" style="background:' + r[0] + '">' + (a.r === 'DOM' ? '🏠' : a.r) + '</span><b>' + rb(L(r[1], r[2])) + '</b></div>' + bar +
      '<div style="font-size:14px">' + rb(L(r[3], r[4])) + '</div><div class="mut" style="font-size:11px;margin-top:2px">' + rb(L('IUCN（{国際|こくさい}自然{保護|ほご}連合）レッドリスト', 'IUCN Red List')) + '</div></div>';
  }
  TK.rl = function (id) { return RL[id]; };
  var oAn = R.animal;
  R.animal = function (o) { var a = Globe.animal(o.id), html = oAn(o); return html.replace('<div class="btns">', rlBox(a) + '<div class="btns">'); };
  var oBook2 = B.book;
  B.book = function (pg, a) {
    oBook2(pg, a);
    each(pg, '[data-k^="an:"]', function (e) { var an = Globe.animal(e.dataset.k.slice(3)), r = an && RL[an.r]; if (r && TK.S.an[an.id] && an.r !== 'LC' && an.r !== 'DOM') e.insertAdjacentHTML('beforeend', '<i class="rldot" style="background:' + r[0] + '">' + an.r + '</i>'); });
  };

  /* ======================================================================
     ❓ help + about (data sources and credits; no links that leave the app)
     ====================================================================== */
  R.help = function () {
    var C = window.CREDITS, cr = function (x) { return '<li>' + esc(x.use) + ' — ' + esc(x.file) + (x.author ? ' / ' + esc(x.author.split('\n')[0]) : '') + (x.license ? '（' + esc(x.license) + '）' : '') + '</li>'; };
    var rows = [['🌏', 'ドラッグで 地球を まわす。 ＋－や ホイールで 大きく・小さく。', 'Drag to spin the Earth. Use ＋ − or the mouse wheel to zoom.'],
      ['👆', '国・たてもの・どうぶつ・のりものを タッチすると くわしく 見られるよ。', 'Tap a country, landmark, animal or vehicle to learn about it.'],
      ['📖', 'たてものの カードの「れきし」「ひみつ」「クイズ」で もっと 深く 知ろう。', 'On landmark cards, open History, Secrets and Quiz to dig deeper.'],
      ['📏', '「さいず」で 国の ほんとうの 大きさを くらべよう。', 'Use "Size" to compare the true size of countries.'],
      ['🎮', '「ゲーム」で クイズ。 ★の 国の クイズで スタンプ、 ゲームで バッジ！', 'Play quizzes in "Games". Earn stamps and badges.'],
      ['📒', '見つけた ものは「ずかん」に シールに なるよ。', 'Everything you find becomes a sticker in the sticker book.']];
    return '<div class="cname"><h1>❓ ' + L('つかいかた', 'How to play') + '</h1></div>' + rows.map(function (r) { return '<div class="box" style="display:flex;gap:10px;align-items:center"><span style="font-size:30px">' + r[0] + '</span><span>' + rb(L(r[1], r[2])) + '</span></div>'; }).join('') +
      '<div class="btns"><button class="btn" id="hgo">🚀 ' + L('はじめる', "Let's go") + '</button></div>' +
      '<span class="lab">ℹ️ ' + L('データの もと', 'Where the data comes from') + '</span><div class="box" style="font-size:13px">' +
      rb(L('国の 形・広さ・人口：Natural Earth ／ 平均じゅみょう・学校で 学ぶ 年数：国連（Our World in Data）／ しあわせ度：World Happiness Report ／ マクドナルドの ねだん：Numbeo（2026年9月）／ 日本に 来た 人・行った 人：JNTO（2024年）／ 町の 名前と 人口：GeoNames ／ 地球の 色と 高さ：NASA Earth Observatory（Blue Marble, GEBCO）／ 写真と 声：Wikimedia Commons ／ 3Dの たてもの・どうぶつ・文：この アプリの オリジナル。 アイデアは My Earth Toy から。 数字は「めやす」です。',
        'Shapes, area, population: Natural Earth / life expectancy, schooling: UN via Our World in Data / happiness: World Happiness Report / McDonald\'s prices: Numbeo (Sept 2026) / travel: JNTO 2024 / cities: GeoNames / Earth colours and height: NASA Earth Observatory (Blue Marble, GEBCO) / photos and voices: Wikimedia Commons / 3D models and texts: original to this app; the idea comes from My Earth Toy. Numbers are approximate.')) + '</div>' +
      (C ? '<details class="box" style="font-size:12px"><summary style="font-size:14px;cursor:pointer">📷 ' + L('写真と 声の クレジット', 'Photo and audio credits') + '</summary><ul style="padding-left:18px;margin:6px 0">' + C.images.concat(C.audio).map(cr).join('') + '</ul></details>' : '') +
      '<span class="lab">⚙️ ' + L('記録', 'Saved progress') + '</span><div class="box" style="font-size:14px">' + L('記録は この パソコンの ブラウザに だけ のこります。', 'Progress is saved only in this browser on this computer.') + '<div class="btns"><button class="btn pk" id="hreset">' + L('シール・スタンプ・記録を ぜんぶ けす', 'Erase all progress') + '</button></div></div><div style="height:8px"></div>';
  };
  B.help = function () {
    $('#hgo').onclick = function () { TK.boing(); TK.close(); };
    $('#hreset').onclick = function () {
      var b = $('#hreset'); if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = L('ほんとうに けす？ もう一度 おしてね', 'Really? Tap again to erase'); return; }
      ['lm', 'an', 've', 'best', 'lq'].forEach(function (k) { S[k] = {}; }); TK.persist();
      App.save.stamps = {}; App.save.visited = {}; App.save.correct = 0; App.save.games = {}; App.save.badges = {}; App.persist(); TK.upd(); TK.say(L('けしました', 'Erased')); TK.render();
    };
  };

  /* ---------- hooks from ui.js ---------- */
  TK.onOpen = function (m) { if (m !== 'size' && SZ.on) sizeEnd(); if (m === 'size') SZ.pending = true; if (m !== 'mg' && TK.mode() === 'mg') Globe.select(null); };
  TK.onEnd = function () { if (SZ.on) sizeEnd(); };

  /* ---------- start: help pill + first visit ---------- */
  var hp = document.createElement('div'); hp.className = 'pill btnp'; hp.id = 'helpp'; hp.textContent = '❓'; $('#hud').appendChild(hp);
  hp.onclick = function () { TK.beep(); TK.open('help'); };
  if (!S.helpSeen) { S.helpSeen = 1; TK.persist(); setTimeout(function () { TK.open('help'); }, 900); }
})();
