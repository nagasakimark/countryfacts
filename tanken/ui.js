/* せかいたんけん UI: search, dock, the side board (country pages, landmark / animal cards, rides,
   games, sticker book) and the English switch. The globe itself is tanken/globe.js. */
(function () {
  var W = 1366, H = 598, $ = function (s) { return document.querySelector(s); }, esc = App.esc, byId = App.byId;
  var INFO = function (id) { return id === 'JPN' ? window.JAPAN_FUN : window.FUN[id]; };
  var featured = App.featured.concat([byId.JPN]);
  var LMS = TOY.landmarks, ANS = TOY.animals, RTS = TOY.routes;

  /* ---------- saving (this Chromebook only) ---------- */
  var KEY = 'tanken-toy-v1', S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  ['lm', 'an', 've', 'best'].forEach(function (k) { S[k] = S[k] || {}; });
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function today() { var d = new Date(); return (d.getMonth() + 1) + '/' + d.getDate(); }
  function collect(kind, id) { if (S[kind][id]) return false; S[kind][id] = today(); persist(); upd(); return true; }
  Globe.collected = function (kind, id) { return !!S[kind][id]; };
  Globe.stampsOf = function () { return App.save.stamps || {}; };
  function total() { return Object.keys(S.lm).length + Object.keys(S.an).length + Object.keys(S.ve).length + Object.keys(App.save.stamps || {}).length; }
  function upd() { $('#cnt').textContent = total(); }

  /* ---------- language ---------- */
  var lang = S.lang === 'en' ? 'en' : 'ja';
  function L(ja, en) { return lang === 'en' ? en : ja; }
  function rb(s) { return esc(s).replace(/\{([^{}|]+)\|([^{}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>').replace(/\(せつ\)/g, '<i class="setsu">いわれている</i>'); }
  var plain = Globe.plain;
  function nm(o) { return lang === 'en' ? o.en : o.ja; }      // display name (may contain ruby markup)
  function cn(c) { return lang === 'en' ? c.en : c.ja; }
  function flagImg(c, cls) { return c && c.a2 ? '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="flags/' + c.a2.toLowerCase() + '.svg" alt="">' : ''; }
  function setLang(l) {
    lang = l; S.lang = l; persist(); Globe.lang = l; document.documentElement.lang = l;
    $('#langp').textContent = l === 'en' ? 'にほんご' : 'EN';
    $('#q').placeholder = L('国・たてもの・どうぶつ', 'Country, place, animal');
    dock(); if (mode) render();
  }

  /* ---------- sounds / toast / confetti ---------- */
  var ac; function tone(f, d, ty, v) { if (App.soundOn === false) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), g = ac.createGain(); o.type = ty || 'triangle'; o.frequency.value = f; g.gain.value = v || 0.1; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.stop(ac.currentTime + d); } catch (e) { } }
  function beep() { tone(440, 0.08); } function boing() { tone(330, 0.12); setTimeout(function () { tone(520, 0.14); }, 70); }
  function fanfare() { tone(110, 0.2, 'square', 0.2); setTimeout(function () { tone(660, 0.1); setTimeout(function () { tone(880, 0.2); }, 90); }, 120); }
  var tt; function say(m) { var e = $('#toast'); e.innerHTML = m; e.style.opacity = 1; clearTimeout(tt); tt = setTimeout(function () { e.style.opacity = 0; }, 3000); }
  App.toast = say;
  var cf = $('#conf'), cc = cf.getContext('2d'), ps = [];
  function confetti() { for (var i = 0; i < 60; i++) ps.push({ x: 1080, y: 140, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 10 - 2, c: ['#ffc531', '#ff6f91', '#33c9a0', '#fff', '#7a4bd8'][i % 5], r: Math.random() * 6, l: 70 }); }
  (function lp() { if (ps.length) { cc.clearRect(0, 0, W, H); } ps = ps.filter(function (p) { return p.l > 0; }); ps.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.l--; cc.save(); cc.translate(p.x, p.y); cc.rotate(p.r += 0.2); cc.fillStyle = p.c; cc.fillRect(-5, -3, 10, 6); cc.restore(); }); if (!ps.length) cc.clearRect(0, 0, W, H); requestAnimationFrame(lp); })();
  function newSticker(kind, id, label) { if (collect(kind, id)) { setTimeout(function () { fanfare(); confetti(); say('🏅 ' + L('シール ゲット！ ', 'New sticker: ') + esc(plain(label))); }, 350); return true; } return false; }

  /* ---------- board ---------- */
  var mode = null, cur = null, curPage = 'p1', arg = null;
  function open(m, a) { mode = m; arg = a; $('#board').classList.add('on'); Globe.setOffset(278); $('#tip').style.opacity = 0; render(); }
  function close() {
    endGame(); if (Globe.riding()) Globe.unride();
    mode = null; cur = null; Globe.select(null); $('#board').classList.remove('on'); Globe.setOffset(0);
  }
  $('#x').onclick = function () { beep(); close(); };
  function tabs(list, on, fn) {
    var t = $('#tabs'); t.style.display = list ? 'flex' : 'none'; $('#page').style.bottom = list ? '64px' : '0';
    if (!list) return;
    t.innerHTML = list.map(function (p) { return '<button class="tb' + (p[0] === on ? ' on' : '') + '" data-p="' + p[0] + '" style="background:' + p[2] + '">' + p[1] + '</button>'; }).join('');
    Array.prototype.forEach.call(t.children, function (b) { b.onclick = function () { beep(); fn(b.dataset.p); }; });
  }
  function render() {
    var pg = $('#page'); pg.scrollTop = 0;
    if (mode === 'country') return renderCountry();
    tabs(null);
    var html = R[mode](arg); pg.innerHTML = html; bindCommon(pg);
    if (B[mode]) B[mode](pg, arg);
  }
  function bindCommon(pg) {
    Array.prototype.forEach.call(pg.querySelectorAll('[data-c]'), function (e) { e.onclick = function () { choose(e.dataset.c); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('[data-lm]'), function (e) { e.onclick = function () { showLandmark(e.dataset.lm); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('[data-an]'), function (e) { e.onclick = function () { showAnimal(e.dataset.an); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('[data-ve]'), function (e) { e.onclick = function () { ride(e.dataset.ve); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('[data-go]'), function (e) { e.onclick = function () { boing(); var g = e.dataset.go.split(':'); open(g[0], g[1]); }; });
  }
  var R = {}, B = {};

  /* ---------- country pages (from the first せかいたんけん) ---------- */
  var HOLE = ['#7a4bd8', '#ff7a2f', '#16a085'];
  function PAGES() { return [['p1', L('もよう', 'Overview'), '#ff6f91'], ['p2', L('れきし', 'History'), '#e08a1e'], ['p3', L('ひと・ことば', 'People'), '#16a085'], ['p4', L('くらし', 'Life'), '#7a4bd8'], ['p5', L('くらべる', 'Compare'), '#2b7de0'], ['p6', L('クイズ', 'Quiz'), '#e0483a']]; }
  function choose(id) {
    var c = byId[id]; if (!c) return; if (Globe.riding()) Globe.unride(); endGame();
    cur = c; boing(); Globe.select(id); Globe.flyToCountry(id); App.markVisited(id); curPage = 'p1'; open('country');
  }
  function pagesFor(c) { var P = PAGES(); return INFO(c.id) && window.ATLAS[c.id] ? P : [P[0], P[4]]; }
  function renderCountry() {
    var c = cur; if (!c) return; var ps = pagesFor(c); if (!ps.some(function (p) { return p[0] === curPage; })) curPage = ps[0][0];
    tabs(ps, curPage, function (p) { curPage = p; renderCountry(); });
    var pg = $('#page'); pg.scrollTop = 0; pg.innerHTML = PG[curPage](c) + (lang === 'en' && curPage !== 'p1' ? '<div class="mut ctr" style="margin:6px 0 10px">(Country pages are in Japanese.)</div>' : ''); bindPage(pg, c); bindCommon(pg);
  }
  function head(c, f) { return '<div class="head">' + flagImg(c, 'fl') + '<div><h1>' + esc(cn(c)) + '</h1><small>' + esc(lang === 'en' ? c.ja : c.en) + '</small></div>' + (f && f.hello ? '<div class="say" data-say="hello">' + esc(f.hello.text) + '<small>' + L('きいてみよう ▶', 'Listen ▶') + '</small></div>' : '') + '</div>'; }
  function mini(c) { return '<div class="ph">' + flagImg(c, 'fl') + '<div><h2>' + esc(cn(c)) + '</h2><small>' + esc(lang === 'en' ? c.ja : c.en) + '</small></div></div>'; }
  function chips(c) { return '<div class="chips"><div class="chip">' + L('首都', 'Capital') + '<b>' + esc(lang === 'en' ? (c.capEn || '—') : (c.capJa || c.capEn || '—')) + '</b></div><div class="chip">' + L('人口', 'People') + '<b>' + App.fmtPeople(c.pop).replace('約', '') + '</b></div><div class="chip">' + L('面積', 'Area') + '<b>' + App.fmtArea(c.area).replace('約', '') + '</b></div></div>'; }
  function placesIn(c) {
    var lm = LMS.filter(function (l) { return l.c === c.id; }), an = ANS.filter(function (a) { return Globe.countryAt(a.ll) === c.id; });
    if (!lm.length && !an.length) return '';
    return '<span class="lab">' + L('この 国で 見つけよう', 'Find them here') + '</span><div class="btns" style="justify-content:flex-start">' +
      lm.map(function (l) { return '<span class="cchip" data-lm="' + l.id + '"><img src="' + Globe.thumb(l.m) + '" style="border:0;width:26px;height:26px">' + rb(nm(l)) + '</span>'; }).join('') +
      an.map(function (a) { return '<span class="cchip" data-an="' + a.id + '"><span style="font-family:Noto Color Emoji,sans-serif">' + a.e + '</span>' + esc(nm(a)) + '</span>'; }).join('') + '</div>';
  }
  var PG = {};
  PG.p1 = function (c) {
    var f = INFO(c.id);
    if (!f) return '<div class="tape" style="left:40px;top:-8px;transform:rotate(-6deg)"></div>' + head(c) + chips(c) + placesIn(c) + '<div class="notes" style="margin-top:20px"><div class="note">' + L('この 国の くわしい ページは これから！ 「くらべる」で 日本と くらべよう。 ★の 国を さがして みよう。', 'More pages for this country are coming! Try "Compare", or look for countries with a ★.') + '</div></div>';
    var im = function (k) { var u = MEDIA.img[c.id + '_' + k]; return u ? u : ''; };
    return '<div class="tape" style="left:40px;top:-8px;transform:rotate(-6deg)"></div><div class="tape" style="right:50px;top:-8px;transform:rotate(5deg)"></div>' + head(c, f) + chips(c) +
      '<div class="row">' + ['dish:' + L('たべもの', 'Food'), 'animal:' + L('どうぶつ', 'Animal'), 'sport:' + L('スポーツ', 'Sport')].map(function (k) { var kk = k.split(':'); var n = kk[0] === 'sport' ? f.sport.replace(/[^　-鿿゠-ヿー・ ]/g, '').trim() : (f[kk[0]] || {}).name; return '<div class="pol" data-n="' + esc(n) + '"><img src="' + im(kk[0]) + '" alt=""><div><i>' + kk[1] + '</i>' + esc(n.replace(/（.*）/, '')) + '</div></div>'; }).join('') + '</div>' +
      '<div class="notes">' + f.facts.slice(0, 2).map(function (x) { return '<div class="note">' + esc(x) + '</div>'; }).join('') + '</div>' + placesIn(c) + tunnels(c);
  };
  function tunnels(c) {
    var near = featured.filter(function (x) { return x.id !== c.id && x.region === c.region; }); if (near.length < 1) near = featured.filter(function (x) { return x.id !== c.id; });
    var l1 = App.pick(near), far = featured.filter(function (x) { return x.region !== c.region; }), l2 = App.pick(far);
    var rest = featured.filter(function (x) { return x.id !== c.id && x.id !== l1.id && x.id !== l2.id; }), l3 = App.pick(rest);
    return '<div class="holes"><h3>' + L('▼ あなに 入って 次の 国へ', '▼ Jump down a hole to another country') + '</h3><div>' + [[l1, L('ちかくの 国', 'Nearby')], [l2, L('ぐうぜん！', 'Surprise!')], [l3, L('もっと 知りたい', 'Explore more')]].map(function (a, i) { return '<div class="hole" data-id="' + a[0].id + '" style="background:' + HOLE[i] + '"><small>' + a[1] + '</small>' + esc(cn(a[0])) + '</div>'; }).join('') + '</div></div>';
  }
  PG.p2 = function (c) { var a = window.ATLAS[c.id]; return mini(c) + '<span class="lab">れきし</span><div class="tl">' + a.h.map(function (e) { return '<div class="ev"><span class="yr">' + rb(e[0]) + '</span><p>' + rb(e[1]) + '</p></div>'; }).join('') + '</div>' + (a.jp ? '<div class="jpt"><b>日本との つながり</b><br>' + rb(a.jp) + '</div>' : ''); };
  PG.p3 = function (c) {
    var f = INFO(c.id), a = window.ATLAS[c.id];
    return mini(c) + '<span class="lab">ことば</span><div class="box">' + rb(a.lng) + '<br><span class="mut">話されている 主な ことば：' + esc(f.lang) + '</span></div>' +
      '<div class="sayrow"><div class="sayb" data-say="hello" lang="' + esc(f.voice || '') + '">' + esc(f.hello.text) + '<small>' + esc(f.hello.kana) + '・こんにちは</small></div><div class="sayb" data-say="thanks" lang="' + esc(f.voice || '') + '">' + esc(f.thanks.text) + '<small>' + esc(f.thanks.kana) + '・ありがとう</small></div></div>' +
      '<div class="mut ctr" style="margin-top:4px">' + (f.hello.audio ? 'ほんものの 人の 声' : 'パソコンの 読み上げの 声') + '</div>' +
      '<span class="lab">ひとびと</span><div class="box">' + rb(a.ppl) + '</div><span class="lab">しゅうきょう</span><div class="box">' + rb(a.rel) + '</div>';
  };
  PG.p4 = function (c) {
    var f = INFO(c.id), a = window.ATLAS[c.id], j = window.JAPAN_FUN, s = f.school, js = j.school, out = mini(c);
    out += '<span class="lab">お金</span><div class="box"><b>' + rb(a.mny.n) + '</b>（日本は 円）<br>' + rb(a.mny.t) + '</div>';
    out += '<span class="lab">ぶんか</span>' + a.cul.map(function (x) { return '<div class="box">' + rb(x) + '</div>'; }).join('');
    out += '<span class="lab">お祭り・行事</span><div class="box"><b>' + rb(a.fes[0]) + '</b><br>' + rb(a.fes[1]) + '</div>';
    if (f.flag) out += '<span class="lab">国旗の ひみつ</span><div class="box">' + esc(f.flag) + '</div>';
    if (s) { var m = ''; for (var i = 1; i <= 12; i++) m += '<span style="display:inline-block;width:8.3%;text-align:center;font-size:12px;border:2px solid var(--ink);border-radius:6px;background:' + (i === s.start ? '#ffd54a' : (i === 4 ? '#ffd5dc' : '#fff')) + '">' + i + '</span>'; out += '<span class="lab">学校</span><div class="box">学校の 1年が はじまる 月（黄色：' + esc(c.ja) + '、 ピンク：日本）<div style="margin:4px 0">' + m + '</div>' + esc(s.note) + '<br><span class="mut">日本：' + esc(js.note) + '</span></div>'; }
    if (f.facts.length > 2) out += '<span class="lab">びっくり</span>' + f.facts.slice(2).map(function (x) { return '<div class="note" style="margin:6px 0">' + esc(x) + '</div>'; }).join('');
    return out;
  };
  function barRow(label, v, jv, unit, c, max) { if (v == null) return ''; var m = max || Math.max(v, jv) * 1.15; return '<div class="bar"><div class="t"><span>' + label + '</span><b>' + esc(c.ja) + ' ' + v + unit + ' ／ 日本 ' + jv + unit + '</b></div><div class="tr"><div class="f" style="width:' + (v / m * 100) + '%;background:#ffd54a"></div></div><div class="tr" style="margin-top:3px"><div class="f" style="width:' + (jv / m * 100) + '%;background:#ff6f91"></div></div></div>'; }
  PG.p5 = function (c) {
    var J = App.JP, out = mini(c), off = c.tz ? App.offsetFromJapan(c.tz) : null;
    out += '<div class="big">' + esc(c.ja) + 'は 日本の <b>' + App.ratioText(c.area, J.area) + '</b>の 広さ。' + (off == null ? '' : off === 0 ? ' 時間は 日本と おなじ！' : ' 時差は <b>' + Math.abs(off) + '時間</b>。') + '</div>';
    out += '<div class="tiles"><div class="tile">広さ<b>' + App.fmtArea(c.area) + '</b>' + (App.rankArea.r[c.id] ? '世界で ' + App.rankArea.r[c.id] + '番目' : '') + '</div><div class="tile">人口<b>' + App.fmtPeople(c.pop) + '</b>' + (App.rankPop.r[c.id] ? '世界で ' + App.rankPop.r[c.id] + '番目' : '') + '</div></div>';
    if (c.pop) { var dens = Math.round(c.pop / c.area), jd = Math.round(J.pop / J.area); out += '<div class="box" style="margin-top:8px">1 km² に すむ 人：' + esc(c.ja) + ' ' + dens.toLocaleString() + '人 ／ 日本 ' + jd.toLocaleString() + '人' + (dens < jd / 3 ? '（日本より ずっと ゆったり！）' : dens > jd * 1.5 ? '（日本より ぎゅうぎゅう！）' : '') + '</div>'; }
    out += '<span class="lab">くらべてみよう</span>' + barRow('平均じゅみょう', c.life && App.round1(c.life), App.round1(J.life), '歳', c) + barRow('学校で 学ぶ 年数', c.school && App.round1(c.school), App.round1(J.school), '年', c) + barRow('しあわせ度（10点まで）', c.happy && App.round1(c.happy), App.round1(J.happy), '点', c, 10) + barRow('マクドナルドの セットの ねだん', c.mac, J.mac, '円', c);
    if (c.tz) { var se = App.seasonText(c), km = App.distanceKm(c), p = App.localParts(c.tz); out += '<span class="lab">時間・きょり・きせつ</span><div class="box">いま ' + esc(c.ja) + 'は <b>' + App.clockText(p.h, p.m) + '</b>。<br>' + esc(App.kidActivity(p, c.id).replace(/^\S+\s/, '')) + '</div><div class="box">' + esc(se.text) + '</div><div class="box">東京から 首都 ' + esc(App.capitalName(c)) + 'まで 約 <b>' + km.toLocaleString() + ' km</b>。</div>'; }
    if (c.links) { var Lk = c.links; var tl = function (l, v, n) { return v == null ? '' : '<div class="tile">' + l + '<b>' + App.fmtMan(v) + '</b>' + (n || '') + '</div>'; }; out += '<span class="lab">日本との つながり</span><div class="tiles">' + tl(esc(c.ja) + 'から 日本へ 来た 人（2024年）', Lk.in) + tl('日本から ' + esc(c.ja) + 'へ 行った 人（2024年）', Lk.out, Lk.outApprox ? 'めやす' : '') + tl('日本に すんでいる ' + esc(c.ja) + 'の 人', Lk.res) + tl(esc(c.ja) + 'に すんでいる 日本人', Lk.abroad) + '</div>'; }
    out += '<div class="ctr"><a class="btn" href="index.html#/size/' + c.id + '">ほんとうの 大きさで かさねる</a></div><div style="height:6px"></div>'; return out;
  };
  var quiz = null;
  PG.p6 = function (c) { quiz = makeQ(c); var got = App.save.stamps[c.id]; return mini(c) + (got ? '<div class="box" style="background:#d6f5dd">この 国の スタンプは もう もらったよ（' + got + '）。 もう一度 ちょうせん してもいいよ！</div>' : '<div class="box" style="background:#fff6c4">こたえて スタンプを もらおう！</div>') + '<div class="big" id="qq">' + quiz.q + '</div><div id="qo">' + quiz.o.map(function (x, i) { return '<button class="opt" data-i="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div><div id="qr"></div>'; };
  function makeQ(c) {
    var f = INFO(c.id), a = window.ATLAS[c.id], others = featured.filter(function (x) { return x.id !== c.id; }), qs = [];
    function three(correct, get) { var w = App.shuffle(others).filter(function (x) { return get(x) && get(x) !== get(c); }).slice(0, 2); var arr = App.shuffle([c].concat(w)); return { o: arr.map(get), a: arr.indexOf(c) }; }
    if (c.capJa) qs.push(function () { var t = three(c, function (x) { return x.capJa; }); return { q: esc(c.ja) + 'の 首都は どこ？', o: t.o, a: t.a, why: '首都は ' + c.capJa + '。' }; });
    qs.push(function () { var t = three(c, function (x) { var i = INFO(x.id); return i && i.hello && i.hello.text + '（' + i.hello.kana + '）'; }); return { q: esc(c.ja) + 'の「こんにちは」は どれ？', o: t.o, a: t.a, why: esc(c.ja) + 'では「' + f.hello.text + '」と 言うよ。' }; });
    qs.push(function () { var t = three(c, function (x) { var i = INFO(x.id); return i && i.dish && i.dish.name; }); return { q: esc(c.ja) + 'の ゆうめいな 食べ物は どれ？', o: t.o, a: t.a, why: f.dish.name + 'だよ。' }; });
    if (a) qs.push(function () { var t = three(c, function (x) { var q = window.ATLAS[x.id]; return q && q.mny.n; }); return { q: esc(c.ja) + 'の お金は どれ？', o: t.o.map(function (s) { return plain(s); }), a: t.a, why: 'お金は ' + plain(a.mny.n) + '。' }; });
    qs.push(function () { var big = c.area > App.JP.area; return { q: esc(c.ja) + 'は 日本より 大きい？ 小さい？', o: ['日本より 大きい', '日本より 小さい'], a: big ? 0 : 1, why: esc(c.ja) + 'の 広さは 日本の ' + App.ratioText(c.area, App.JP.area) + '。' }; });
    return App.pick(qs)();
  }
  function bindPage(pg, c) {
    Array.prototype.forEach.call(pg.querySelectorAll('.hole'), function (h) { h.onclick = function () { choose(h.dataset.id); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('.pol'), function (p) { p.onclick = function () { tone(700, 0.1); say(esc(p.dataset.n.replace(/（.*）/, '')) + '！'); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('[data-say]'), function (b) { b.onclick = function () { boing(); var f = INFO(c.id); App.playPhrase(f[b.dataset.say], f.voice || 'en'); }; });
    if (curPage === 'p6') {
      Array.prototype.forEach.call(pg.querySelectorAll('.opt'), function (b) {
        b.onclick = function () {
          if (pg.dataset.done === c.id + quiz.q) return; pg.dataset.done = c.id + quiz.q; var ok = +b.dataset.i === quiz.a; var os = pg.querySelectorAll('.opt'); os[quiz.a].classList.add('right'); if (!ok) b.classList.add('wrong'); var r = $('#qr');
          if (ok) { App.sfx.good(); var fresh = App.addStamp(c.id); r.innerHTML = '<div class="box" style="background:#d6f5dd"><b>せいかい！</b> ' + quiz.why + '</div>'; if (fresh) { upd(); setTimeout(function () { fanfare(); confetti(); say(esc(c.ja) + 'の スタンプ ゲット！'); }, 300); } r.innerHTML += '<div class="ctr"><button class="btn" id="again">もう 1もん</button></div>'; }
          else { App.sfx.bad(); r.innerHTML = '<div class="box" style="background:#ffe0e0"><b>ざんねん！</b> ' + quiz.why + '</div><button class="btn" id="again">もう一回 ちょうせん</button>'; }
          var ag = $('#again'); if (ag) ag.onclick = function () { delete pg.dataset.done; renderCountry(); };
        };
      });
    }
  }

  /* ---------- landmark & animal cards ---------- */
  function where(ll) { var id = Globe.countryAt(ll), c = id && byId[id]; return c ? '<span class="cchip" data-c="' + c.id + '">' + flagImg(c) + esc(cn(c)) + ' ▶</span>' : '<span class="cchip">🌊 ' + L('海・こおりの 上', 'Sea or ice') + '</span>'; }
  function showLandmark(id) {
    var l = Globe.landmark(id); if (!l) return; if (Globe.riding()) Globe.unride(); endGame(); boing(); Globe.select(null);
    Globe.flyTo(l.ll[0], l.ll[1] - 0.35, 0.3, 1200); var fresh = newSticker('lm', id, nm(l)); open('landmark', { id: id, fresh: fresh });
  }
  R.landmark = function (a) {
    var l = Globe.landmark(a.id), c = byId[l.c], next = App.pick(LMS.filter(function (x) { return x.id !== l.id && !S.lm[x.id]; })) || App.pick(LMS);
    return '<img class="thumb" src="' + Globe.thumb(l.m) + '" alt=""><div class="cname"><h1>' + rb(nm(l)) + '</h1><small>' + rb(lang === 'en' ? l.ja : l.en) + '</small>' +
      '<div class="stk' + (a.fresh ? ' new' : '') + '">🏅 ' + (a.fresh ? L('シール ゲット！', 'New sticker!') : L('シール ずみ ', 'Collected ') + S.lm[l.id]) + '</div></div>' +
      '<div class="box big" style="font-size:18px;margin-top:6px">' + rb(lang === 'en' ? l.te : l.t) + '</div>' +
      '<div class="btns">' + where(l.ll) + '</div>' +
      '<div class="btns"><button class="btn bl" data-lm="' + next.id + '">' + L('つぎの たてもの へ ▶', 'Next landmark ▶') + '</button><button class="btn pu" data-go="book:lm">' + L('📒 ずかん', '📒 Sticker book') + '</button></div>';
  };
  function showAnimal(id) {
    var a = Globe.animal(id); if (!a) return; if (Globe.riding()) Globe.unride(); endGame(); boing(); Globe.select(null);
    Globe.flyTo(a.ll[0], a.ll[1] - 0.5, 0.42, 1200); var fresh = newSticker('an', id, nm(a)); open('animal', { id: id, fresh: fresh });
  }
  R.animal = function (o) {
    var a = Globe.animal(o.id), next = App.pick(ANS.filter(function (x) { return x.id !== a.id && !S.an[x.id]; })) || App.pick(ANS);
    return '<div class="emo">' + a.e + '</div><div class="cname"><h1>' + esc(nm(a)) + '</h1><small>' + esc(lang === 'en' ? a.ja : a.en) + '</small>' +
      '<div class="stk' + (o.fresh ? ' new' : '') + '">🏅 ' + (o.fresh ? L('シール ゲット！', 'New sticker!') : L('シール ずみ ', 'Collected ') + S.an[a.id]) + '</div></div>' +
      '<div class="box big" style="font-size:18px;margin-top:6px">' + rb(lang === 'en' ? a.te : a.t) + '</div>' +
      '<div class="btns"><span class="mut" style="align-self:center">' + L('すんでいる ところ：', 'Lives here: ') + '</span>' + where(a.ll) + '</div>' +
      '<div class="btns"><button class="btn bl" data-an="' + next.id + '">' + L('つぎの どうぶつ へ ▶', 'Next animal ▶') + '</button><button class="btn pu" data-go="book:an">' + L('📒 ずかん', '📒 Sticker book') + '</button></div>';
  };

  /* ---------- vehicles ---------- */
  function vkey(r) { return r.type === 'ship' ? (r.ship || 'ship') : r.type; }
  function vthumb(r) { return Globe.thumb(vkey(r), r.type === 'ship' ? null : r.col); }
  R.vehicles = function () {
    return '<div class="cname"><h1>🚀 ' + L('のりもの', 'Ride something!') + '</h1><small>' + L('のって 世界を 旅しよう。 さいごまで のると シールが もらえるよ。', 'Ride all the way to the end to get a sticker.') + '</small></div><div class="vlist" style="margin-top:8px">' +
      RTS.map(function (r) { return '<div class="vt" data-ve="' + r.id + '"><img src="' + vthumb(r) + '" alt=""><div><b>' + rb(nm(r)) + '</b><small>' + Globe.route(r.id).km.toLocaleString() + ' km ・ ' + L('ほんとうは ', 'really ') + esc(lang === 'en' ? r.tm[1] : r.tm[0]) + '</small></div><span class="ok">' + (S.ve[r.id] ? '🏅' : '') + '</span></div>'; }).join('') + '</div><div style="height:8px"></div>';
  };
  function ride(id) { var r = Globe.route(id); if (!r) return; endGame(); boing(); Globe.select(null); Globe.ride(id); open('ride', { id: id, arrived: false }); }
  R.ride = function (o) {
    var r = Globe.route(o.id), f = r.dir > 0;
    var A = f ? r.a : r.b, Bn = f ? r.b : r.a;
    return '<img class="thumb" style="width:170px;height:170px" src="' + vthumb(r) + '" alt=""><div class="cname"><h1>' + rb(nm(r)) + '</h1></div>' +
      '<div class="ends" style="margin-top:6px"><span>🚩 ' + rb(lang === 'en' ? A[1] : A[0]) + '</span><span>🏁 ' + rb(lang === 'en' ? Bn[1] : Bn[0]) + '</span></div>' +
      '<div class="prog"><i id="rp"></i></div><div class="ctr" id="rk" style="font-size:17px"></div>' +
      '<div class="spd">' + [1, 2, 4, 8].map(function (s) { return '<button data-s="' + s + '"' + (Globe.speed === s ? ' class="on"' : '') + '>×' + s + '</button>'; }).join('') + '</div>' +
      '<div class="box">⏱️ ' + L('ほんとうの 時間：', 'The real trip takes ') + '<b>' + esc(lang === 'en' ? r.tm[1] : r.tm[0]) + '</b>（' + r.km.toLocaleString() + ' km）</div>' +
      '<div class="note" style="margin-top:8px">' + rb(lang === 'en' ? r.f[1] : r.f[0]) + '</div>' +
      '<div id="arr"></div><div class="btns"><button class="btn or" data-go="vehicles">' + L('ほかの のりもの', 'Other rides') + '</button><button class="btn pk" id="off">' + L('おりる', 'Get off') + '</button></div>';
  };
  B.ride = function (pg) {
    Array.prototype.forEach.call(pg.querySelectorAll('[data-s]'), function (b) { b.onclick = function () { beep(); setSpeed(+b.dataset.s); Array.prototype.forEach.call(pg.querySelectorAll('[data-s]'), function (x) { x.classList.toggle('on', x === b); }); }; });
    $('#off').onclick = function () { beep(); close(); };
  };
  var lastRideDir = 0;
  Globe.onRide = function (r, frac) {
    if (mode !== 'ride' || !arg || arg.id !== r.id) return;
    var p = $('#rp'), k = $('#rk'); if (!p) return;
    if (r.dir !== lastRideDir && lastRideDir !== 0 && r.wait <= 0) { lastRideDir = r.dir; render(); return; }
    lastRideDir = r.dir;
    p.style.width = (frac * 100).toFixed(1) + '%'; k.textContent = Math.round(frac * r.km).toLocaleString() + ' / ' + r.km.toLocaleString() + ' km';
  };
  Globe.onArrive = function (r, to) {
    var fresh = collect('ve', r.id); fanfare(); confetti();
    say('🏁 ' + L('とうちゃく！ ', 'Arrived: ') + esc(plain(lang === 'en' ? to[1] : to[0])) + (fresh ? ' 🏅 ' + L('シール ゲット！', 'New sticker!') : ''));
    var a = $('#arr'); if (a) a.innerHTML = '<div class="box" style="background:#d6f5dd;text-align:center;margin-top:8px"><b>🏁 ' + L('とうちゃく！', 'You made it!') + '</b> ' + L('このまま のっていると 帰りの 旅が はじまるよ。', 'Stay on board to ride back.') + '</div>';
  };
  function setSpeed(s) { Globe.speed = s; $('#spd').textContent = s; }
  $('#spdp').onclick = function () { beep(); var o = [1, 2, 4, 8], i = o.indexOf(Globe.speed); setSpeed(o[(i + 1) % o.length]); if (mode === 'ride') render(); };

  /* ---------- sticker book ---------- */
  R.book = function (tab) {
    tab = tab || 'lm'; var nLm = Object.keys(S.lm).length, nAn = Object.keys(S.an).length, nVe = Object.keys(S.ve).length, nSt = Object.keys(App.save.stamps || {}).length;
    var T2 = [['lm', L('たてもの', 'Places') + ' ' + nLm + '/' + LMS.length, '#ff6f91'], ['an', L('どうぶつ', 'Animals') + ' ' + nAn + '/' + ANS.length, '#16a085'], ['ve', L('のりもの', 'Rides') + ' ' + nVe + '/' + RTS.length, '#ff7a2f'], ['st', L('スタンプ', 'Stamps') + ' ' + nSt + '/' + featured.length, '#7a4bd8']];
    var h = '<div class="cname"><h1>📒 ' + L('ずかん', 'Sticker book') + '</h1><small>' + L('見つけた ものが シールに なるよ。 ？を タッチすると ヒント！', 'Things you find become stickers. Tap a ? for a hint!') + '</small></div>' +
      '<div class="tabs2" style="margin-top:8px">' + T2.map(function (t) { return '<button data-tab="' + t[0] + '" class="' + (t[0] === tab ? 'on' : '') + '" style="background:' + t[2] + '">' + t[1] + '</button>'; }).join('') + '</div><div class="grid">';
    if (tab === 'lm') h += LMS.map(function (l) { var g = S.lm[l.id]; return '<div class="cell' + (g ? '' : ' no') + '" data-k="lm:' + l.id + '"><img src="' + Globe.thumb(l.m) + '" alt="">' + (g ? rb(nm(l)) : '？') + '</div>'; }).join('');
    if (tab === 'an') h += ANS.map(function (a) { var g = S.an[a.id]; return '<div class="cell' + (g ? '' : ' no') + '" data-k="an:' + a.id + '"><span class="e">' + a.e + '</span>' + (g ? esc(nm(a)) : '？') + '</div>'; }).join('');
    if (tab === 've') h += RTS.map(function (r) { var g = S.ve[r.id]; return '<div class="cell' + (g ? '' : ' no') + '" data-k="ve:' + r.id + '"><img src="' + vthumb(r) + '" alt="">' + (g ? rb(nm(r)).replace(/^(ひこうき|Plane:|フェリー|Ferry:|コンテナ船|Container ship:|新幹線|Shinkansen:)\s*/, '') : '？') + '</div>'; }).join('');
    if (tab === 'st') h += featured.map(function (c) { var g = App.save.stamps[c.id]; return '<div class="cell' + (g ? '' : ' no') + '" data-k="st:' + c.id + '">' + flagImg(c).replace('<img', '<img style="width:52px;height:39px;border:2px solid #3b2a5c;object-fit:cover' + (g ? '' : ';filter:grayscale(1) opacity(.35)') + '"') + esc(cn(c)) + '</div>'; }).join('');
    return h + '</div>' + (tab === 'st' ? '<div class="ctr"><a class="btn pu" href="index.html#/passport">' + L('パスポートを 見る', 'Open the passport') + '</a></div>' : '') + '<div style="height:8px"></div>';
  };
  B.book = function (pg) {
    Array.prototype.forEach.call(pg.querySelectorAll('[data-tab]'), function (b) { b.onclick = function () { beep(); arg = b.dataset.tab; render(); }; });
    Array.prototype.forEach.call(pg.querySelectorAll('[data-k]'), function (e) {
      e.onclick = function () {
        var k = e.dataset.k.split(':'), kind = k[0], id = k[1];
        if (kind === 'st') return choose(id);
        if (kind === 've') return ride(id);
        var o = kind === 'lm' ? Globe.landmark(id) : Globe.animal(id);
        if (S[kind][id]) return kind === 'lm' ? showLandmark(id) : showAnimal(id);
        var cid = kind === 'lm' ? o.c : Globe.countryAt(o.ll), c = cid && byId[cid];
        tone(300, 0.15); say('💡 ' + L('ヒント：', 'Hint: ') + (c ? L(esc(c.ja) + 'の あたりを さがしてみよう！', 'Look around ' + esc(c.en) + '!') : L('海の 上を さがしてみよう！', 'Look out at sea!')));
      };
    });
  };

  /* ---------- games ---------- */
  R.games = function () {
    function best(k) { return S.best[k] != null ? L('さいこう ', 'Best ') + S.best[k] : L('まだ あそんでいない', 'Not played yet'); }
    return '<div class="cname"><h1>🎮 ' + L('ゲーム', 'Games') + '</h1></div>' +
      '<button class="gbtn" data-g="where"><span class="gi" style="background:#ffc531">📍</span><span><b>' + L('どこかな？', 'Where in the world?') + '</b><small>' + L('地球を まわして、 国・たてもの・どうぶつの ばしょを タッチ！ 10もん', 'Spin the globe and tap where it is. 10 questions') + '<br>⭐ ' + best('where') + ' / 30</small></span></button>' +
      '<button class="gbtn" data-g="flag"><span class="gi" style="background:#ff6f91">🏳️</span><span><b>' + L('こっき クイズ', 'Flag quiz') + '</b><small>' + L('この 国旗は どこの 国？ 10もん', 'Whose flag is this? 10 questions') + '<br>⭐ ' + best('flag') + ' / 10</small></span></button>' +
      '<button class="gbtn" data-g="old"><span class="gi" style="background:#33c9a0">🧩</span><span><b>' + L('くらべっこ ゲーム', 'More games') + '</b><small>' + L('日本 何こ分？ シルエット クイズ など', 'Size, silhouettes and more (in Japanese)') + '</small></span></button>';
  };
  B.games = function (pg) {
    Array.prototype.forEach.call(pg.querySelectorAll('[data-g]'), function (b) {
      b.onclick = function () { boing(); var g = b.dataset.g; if (g === 'old') location.href = 'index.html#/games'; else startGame(g); };
    });
  };
  var game = null;
  function endGame() { if (!game) return; game = null; Globe.quiz = false; Globe.onTap = null; Globe.pins = []; }
  function startGame(kind) {
    if (Globe.riding()) Globe.unride(); Globe.select(null);
    var qs = [];
    if (kind === 'where') {
      var cs = App.shuffle(featured).slice(0, 4).map(function (c) { return { t: 'c', id: c.id, ll: Globe.CEN[c.id] }; });
      var ls = App.shuffle(LMS).slice(0, 3).map(function (l) { return { t: 'lm', id: l.id, ll: l.ll }; });
      var as = App.shuffle(ANS.filter(function (a) { return Globe.countryAt(a.ll); })).slice(0, 3).map(function (a) { return { t: 'an', id: a.id, ll: a.ll }; });
      qs = App.shuffle(cs.concat(ls, as));
      Globe.quiz = true; Globe.flyTo(135, 25, 2.5, 800);
    } else {
      var pool = App.listed.filter(function (c) { return c.a2 && c.pop > 4e6 && Globe.CEN[c.id]; });
      qs = App.shuffle(featured).slice(0, 7).concat(App.shuffle(pool).slice(0, 3)).map(function (c) { return { id: c.id }; });
      Globe.quiz = true; qs = App.shuffle(qs); qs.forEach(function (q) { var o = App.shuffle(pool.concat(featured).filter(function (c) { return c.id !== q.id; })).slice(0, 3).concat([byId[q.id]]); q.o = App.shuffle(o); });
    }
    game = { kind: kind, qs: qs, i: 0, score: 0, tries: 0, done: false };
    Globe.onTap = kind === 'where' ? whereTap : null;
    open('game');
  }
  function qName(q) { if (q.t === 'c') return cn(byId[q.id]); if (q.t === 'lm') return nm(Globe.landmark(q.id)); return nm(Globe.animal(q.id)); }
  R.game = function () {
    var g = game; if (!g) return '';
    if (g.i >= g.qs.length) {
      var max = g.kind === 'where' ? 30 : 10, k = g.kind, prev = S.best[k]; if (prev == null || g.score > prev) { S.best[k] = g.score; persist(); }
      var stars = g.score >= max * 0.8 ? '⭐⭐⭐' : g.score >= max * 0.5 ? '⭐⭐' : '⭐';
      setTimeout(function () { fanfare(); confetti(); }, 200);
      return '<div class="cname" style="margin-top:30px"><h1>' + L('おわり！', 'Finished!') + '</h1><div style="font-size:60px">' + stars + '</div><div class="big" style="font-size:30px">' + g.score + ' / ' + max + '</div>' +
        (prev == null || g.score > prev ? '<div class="stk new">' + L('さいこう きろく！', 'New best!') + '</div>' : '<div class="mut">' + L('さいこう ', 'Best ') + prev + '</div>') + '</div>' +
        '<div class="btns" style="margin-top:20px"><button class="btn" id="again">' + L('もう一回', 'Play again') + '</button><button class="btn pu" data-go="games">' + L('ゲーム えらび', 'All games') + '</button></div>';
    }
    var q = g.qs[g.i], h = '<div class="qhead"><b>' + (g.i + 1) + ' / ' + g.qs.length + '</b><span>⭐ ' + g.score + '</span></div>';
    if (g.kind === 'where') {
      var pic = q.t === 'c' ? '<img class="qflag" style="width:160px;height:110px" src="flags/' + byId[q.id].a2.toLowerCase() + '.svg" alt="">' : q.t === 'lm' ? '<img class="thumb" style="width:160px;height:160px" src="' + Globe.thumb(Globe.landmark(q.id).m) + '">' : '<div class="emo" style="font-size:90px">' + Globe.animal(q.id).e + '</div>';
      h += '<div class="qt">' + pic + '<div class="big"><b>' + rb(qName(q)) + '</b>' + L(q.t === 'an' ? ' は どこに すんでいる？' : ' は どこ？', q.t === 'an' ? ': where does it live?' : ': where is it?') + '</div></div>' +
        '<div class="hint" id="wh">' + L('👆 地球を まわして、 ばしょを タッチ！ （3回まで）', '👆 Spin the globe and tap the place! (3 tries)') + '</div><div id="wn"></div>';
    } else {
      h += '<div class="qt"><img class="qflag" src="flags/' + byId[q.id].a2.toLowerCase() + '.svg" alt=""><div class="big">' + L('この 国旗は どこの 国？', 'Which country has this flag?') + '</div></div><div id="fo">' +
        q.o.map(function (c) { return '<button class="opt" data-f="' + c.id + '">' + esc(cn(c)) + '</button>'; }).join('') + '</div><div id="wn"></div>';
    }
    return h;
  };
  B.game = function (pg) {
    var ag = $('#again'); if (ag) ag.onclick = function () { boing(); startGame(game.kind); };
    if (game && game.kind === 'flag') Array.prototype.forEach.call(pg.querySelectorAll('[data-f]'), function (b) {
      b.onclick = function () {
        var q = game.qs[game.i]; if (q.done) return; q.done = true; var ok = b.dataset.f === q.id;
        pg.querySelector('[data-f="' + q.id + '"]').classList.add('right'); if (!ok) { b.classList.add('wrong'); App.sfx.bad(); } else { App.sfx.good(); game.score++; }
        Globe.select(q.id); Globe.flyToCountry(q.id);
        $('#wn').innerHTML = '<div class="box" style="background:' + (ok ? '#d6f5dd' : '#ffe0e0') + '"><b>' + (ok ? L('せいかい！', 'Correct!') : L('ざんねん！', 'Not quite!')) + '</b> ' + L('こたえは ', 'It is ') + esc(cn(byId[q.id])) + '。</div><div class="ctr"><button class="btn" id="nx">' + L('つぎ ▶', 'Next ▶') + '</button></div>';
        $('#nx').onclick = function () { beep(); Globe.select(null); game.i++; render(); };
      };
    });
  };
  var DIRS = [['北', 'north', 0], ['北東', 'north-east', 45], ['東', 'east', 90], ['南東', 'south-east', 135], ['南', 'south', 180], ['南西', 'south-west', 225], ['西', 'west', 270], ['北西', 'north-west', 315]];
  function bearing(a, b) { var D = Math.PI / 180, f1 = a[1] * D, f2 = b[1] * D, dl = (b[0] - a[0]) * D; var y = Math.sin(dl) * Math.cos(f2), x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl); return (Math.atan2(y, x) / D + 360) % 360; }
  function whereTap(ll) {
    var g = game; if (!g || g.kind !== 'where' || g.i >= g.qs.length) return; var q = g.qs[g.i]; if (q.done) return;
    var km = Math.round(d3.geoDistance(ll, q.ll) * 6371), ok = q.t === 'c' ? (Globe.countryAt(ll) === q.id || km < 300) : km < 900;
    g.tries++; Globe.pins = [{ ll: ll, col: ok ? '#33c9a0' : '#ff5a4d' }];
    if (ok || g.tries >= 3) {
      q.done = true; var pts = ok ? 4 - g.tries : 0; g.score += pts; g.tries = 0;
      if (ok) App.sfx.good(); else App.sfx.bad();
      Globe.pins.push({ ll: q.ll, col: '#ffc531', label: plain(qName(q)) }); if (q.t === 'c') Globe.select(q.id);
      Globe.flyTo(q.ll[0], q.ll[1], 1.1, 900);
      $('#wh').style.display = 'none';
      $('#wn').innerHTML = '<div class="box" style="background:' + (ok ? '#d6f5dd' : '#ffe0e0') + ';text-align:center;font-size:18px"><b>' + (ok ? L('せいかい！ ', 'Correct! ') + '+' + pts + ' ⭐' : L('ざんねん！ ここだよ。', 'Here it is!')) + '</b></div><div class="ctr"><button class="btn" id="nx">' + L('つぎ ▶', 'Next ▶') + '</button></div>';
      $('#nx').onclick = function () { beep(); Globe.pins = []; Globe.select(null); g.i++; render(); };
    } else {
      App.sfx.bad(); var b = bearing(ll, q.ll), d = DIRS[Math.round(b / 45) % 8];
      $('#wh').innerHTML = '<svg class="arrow" width="30" height="30" viewBox="0 0 30 30" style="transform:rotate(' + Math.round(b) + 'deg)"><circle cx="15" cy="15" r="14" fill="#ffc531" stroke="#3b2a5c" stroke-width="2.5"/><path d="M15 5l7 9h-4.5v10h-5V14H8z" fill="#3b2a5c"/></svg> ' + L('もっと <b>' + d[0] + '</b>！ あと 約' + km.toLocaleString() + 'km', 'Go <b>' + d[1] + '</b>! About ' + km.toLocaleString() + ' km away') + ' <span class="mut">(' + L('のこり ', 'tries left: ') + (3 - g.tries) + ')</span>';
    }
  }

  /* ---------- picking on the globe ---------- */
  Globe.onPick = function (h) {
    if (game) return;
    if (h.kind === 'country') choose(h.id); else if (h.kind === 'landmark') showLandmark(h.id); else if (h.kind === 'animal') showAnimal(h.id); else if (h.kind === 'vehicle') ride(h.id);
  };
  Globe.onHover = function (h, p) {
    var tp = $('#tip'); if (!h || game) { tp.style.opacity = 0; return; }
    var t = h.kind === 'country' ? cn(byId[h.id]) : h.kind === 'landmark' ? plain(nm(Globe.landmark(h.id))) : h.kind === 'animal' ? nm(Globe.animal(h.id)) : plain(nm(Globe.route(h.id))) + L(' に のる', ' – ride it!');
    if (p[0] > W - 560 && mode) { tp.style.opacity = 0; return; }
    tp.textContent = t; tp.style.left = p[0] + 'px'; tp.style.top = p[1] + 'px'; tp.style.opacity = 1;
  };

  /* ---------- search ---------- */
  function norm(s) { s = plain(s || '').normalize('NFKC').toLowerCase().replace(/[\s・･'’.\-]/g, ''); return s.replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }); }
  var RD = { JPN: 'にほん にっぽん', CHN: 'ちゅうごく', KOR: 'かんこく', PRK: 'きたちょうせん', TWN: 'たいわん', HKG: 'ほんこん', ZAF: 'みなみあふりか', SSD: 'みなみすーだん', TLS: 'ひがしてぃもーる', MKD: 'きたまけどにあ', GNQ: 'せきどうぎにあ', COD: 'こんごみんしゅきょうわこく', COG: 'こんごきょうわこく', ARE: 'あらぶしゅちょうこくれんぽう', DOM: 'どみにかきょうわこく', CAF: 'ちゅうおうあふりか', FSM: 'みくろねしあれんぽう', MHL: 'まーしゃるしょとう', SLB: 'そろもんしょとう', USA: 'あめりか べいこく', GBR: 'いぎりす えいこく', DEU: 'どいつ', TUR: 'とるこ', VNM: 'べとなむ' };
  var SI = COUNTRIES.filter(function (c) { return Globe.CEN[c.id]; }).map(function (c) { var y = (window.YOMI && window.YOMI[c.id]) || ''; return { k: 'c', o: c, ks: [norm(c.ja), norm(c.en), norm(y)].concat((RD[c.id] || '').split(' ').map(norm)), k2: [norm(c.capJa), norm(c.capEn), norm(c.id)] }; });
  LMS.forEach(function (l) { SI.push({ k: 'lm', o: l, ks: [norm(l.ja), norm(l.en)].concat(l.k.split(' ').map(norm)), k2: [] }); });
  ANS.forEach(function (a) { SI.push({ k: 'an', o: a, ks: [norm(a.ja), norm(a.en)], k2: [] }); });
  RTS.forEach(function (r) { SI.push({ k: 've', o: r, ks: [norm(r.ja), norm(r.en)], k2: [] }); });
  function search(q) {
    q = norm(q); if (!q) return []; var out = [];
    SI.forEach(function (s) { var sc = 99; s.ks.forEach(function (k) { if (!k) return; if (k === q) sc = Math.min(sc, 0); else if (k.indexOf(q) === 0) sc = Math.min(sc, 1); else if (k.indexOf(q) > -1) sc = Math.min(sc, 3); }); s.k2.forEach(function (k) { if (k && k.indexOf(q) === 0) sc = Math.min(sc, 4); }); if (sc < 99) out.push({ s: s, sc: sc - (s.k === 'c' && INFO(s.o.id) ? 0.5 : 0) }); });
    out.sort(function (a, b) { return a.sc - b.sc; }); return out.slice(0, 7).map(function (o) { return o.s; });
  }
  var sq = $('#q'), sg = $('#sug'), sres = [], si = 0;
  function sgIcon(s) { if (s.k === 'c') return s.o.a2 ? '<img src="flags/' + s.o.a2.toLowerCase() + '.svg" alt="">' : '<span style="width:32px"></span>'; if (s.k === 'an') return '<span class="em">' + s.o.e + '</span>'; if (s.k === 'lm') return '<img class="th" src="' + Globe.thumb(s.o.m) + '">'; return '<img class="th" src="' + vthumb(s.o) + '">'; }
  function renderSug() {
    if (!sres.length) { sg.style.display = 'none'; return; } sg.style.display = 'block';
    sg.innerHTML = sres.map(function (s, i) { var o = s.o; return '<div class="sg' + (i === si ? ' on' : '') + '" data-i="' + i + '">' + sgIcon(s) + esc(plain(lang === 'en' ? o.en : o.ja)) + '<small>' + esc(plain(lang === 'en' ? o.ja : o.en)) + '</small></div>'; }).join('');
    Array.prototype.forEach.call(sg.children, function (e) { e.onmousedown = function (ev) { ev.preventDefault(); go(sres[e.dataset.i]); }; });
  }
  function go(s) { sq.value = ''; sres = []; renderSug(); sq.blur(); if (s.k === 'c') choose(s.o.id); else if (s.k === 'lm') showLandmark(s.o.id); else if (s.k === 'an') showAnimal(s.o.id); else ride(s.o.id); }
  sq.addEventListener('input', function () { sres = search(sq.value); si = 0; renderSug(); });
  sq.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'ArrowDown') { si = Math.min(sres.length - 1, si + 1); renderSug(); e.preventDefault(); } else if (e.key === 'ArrowUp') { si = Math.max(0, si - 1); renderSug(); e.preventDefault(); } else if (e.key === 'Enter' && sres[si]) go(sres[si]); else if (e.key === 'Escape') { sq.value = ''; sres = []; renderSug(); sq.blur(); } });
  sq.addEventListener('blur', function () { setTimeout(function () { sg.style.display = 'none'; }, 120); }); sq.addEventListener('focus', function () { if (sres.length) sg.style.display = 'block'; });

  /* ---------- dock & buttons ---------- */
  function dock() {
    var toys = [
      ['#ffc531', L('さがす', 'Search'), '<circle cx="18" cy="18" r="10" fill="#fff" stroke="#3b2a5c" stroke-width="4"/><path d="M26 26l9 9" stroke="#3b2a5c" stroke-width="6" stroke-linecap="round"/>', function () { sq.focus(); }],
      ['#ff7a2f', L('のりもの', 'Rides'), '<path d="M4 22l14-4 4-12 4 1-2 10 12-3 2 3-12 6-1 10-4 1-1-9-14 4z" fill="#fff" stroke="#3b2a5c" stroke-width="3" stroke-linejoin="round"/>', function () { open('vehicles'); }],
      ['#33c9a0', L('ゲーム', 'Games'), '<rect x="4" y="12" width="32" height="18" rx="9" fill="#fff" stroke="#3b2a5c" stroke-width="4"/><path d="M13 16v10M8 21h10" stroke="#3b2a5c" stroke-width="3"/><circle cx="26" cy="20" r="2.5" fill="#3b2a5c"/><circle cx="31" cy="24" r="2.5" fill="#3b2a5c"/>', function () { endGame(); open('games'); }],
      ['#4fb3ff', L('ずかん', 'Stickers'), '<rect x="8" y="4" width="24" height="32" rx="4" fill="#fff" stroke="#3b2a5c" stroke-width="4"/><circle cx="20" cy="18" r="6" fill="none" stroke="#ff5a4d" stroke-width="3"/>', function () { open('book', 'lm'); }],
      ['#7a4bd8', L('ランダム', 'Surprise'), '<rect x="6" y="6" width="28" height="28" rx="7" fill="#fff" stroke="#3b2a5c" stroke-width="4"/><circle cx="14" cy="14" r="3" fill="#3b2a5c"/><circle cx="20" cy="20" r="3" fill="#3b2a5c"/><circle cx="26" cy="26" r="3" fill="#3b2a5c"/>', function () { var r = Math.random(); if (r < 0.4) choose(App.pick(featured).id); else if (r < 0.7) showLandmark(App.pick(LMS).id); else showAnimal(App.pick(ANS).id); }],
      ['#ff6f91', L('さいず', 'Size'), '<path d="M6 30h12V16H6zM22 30h14V8H22z" fill="#fff" stroke="#3b2a5c" stroke-width="4" stroke-linejoin="round"/>', function () { location.href = 'index.html#/size' + (cur ? '/' + cur.id : ''); }]];
    $('#dock').innerHTML = toys.map(function (x, i) { return '<div class="toy" style="background:' + x[0] + '" data-i="' + i + '"><svg viewBox="0 0 40 40">' + x[2] + '</svg><span>' + x[1] + '</span></div>'; }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.toy'), function (e) { e.onclick = function () { boing(); toys[e.dataset.i][3](); }; });
  }
  $('#zi').onclick = function () { beep(); Globe.zoom(1 / 1.7); }; $('#zo').onclick = function () { beep(); Globe.zoom(1.7); }; $('#zh').onclick = function () { beep(); Globe.home(); };
  $('#langp').onclick = function () { beep(); setLang(lang === 'en' ? 'ja' : 'en'); };
  $('#cntp').onclick = function () { beep(); open('book', 'lm'); };

  /* ---------- start ---------- */
  setLang(lang); upd(); setSpeed(1);
  if (location.hash.indexOf('#c=') === 0) setTimeout(function () { choose(location.hash.slice(3)); }, 300);
  setTimeout(function () { say(L('地球を ドラッグして まわそう。 たてもの・どうぶつ・のりものを タッチ！', 'Drag to spin the Earth. Tap places, animals and vehicles!')); }, 400);
})();
