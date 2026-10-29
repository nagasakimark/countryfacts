/* Country page: Japan vs one country, in tabs kids step through. */
(function () {
  var esc = App.esc, h = App.h;

  function cmpBar(label, icon, a, b, unit, c, explain, lowerIsNice) {
    if (a == null || b == null) return '';
    var max = Math.max(a, b) || 1;
    function row(flag, nm, v, cls) {
      return '<div class="cb-row ' + cls + '"><span class="cb-who">' + flag + ' ' + esc(nm) + '</span>' +
        '<span class="cb-bar"><i style="width:' + Math.max(4, 100 * v / max) + '%"></i></span><b class="cb-val">' + v.toLocaleString() + unit + '</b></div>';
    }
    return '<div class="cmp card">' +
      '<div class="label">' + icon + ' ' + label + '</div>' +
      row(c.flag, c.ja, a, 'them') + row('🇯🇵', '日本', b, 'jp') +
      (explain ? '<p class="explain">💡 ' + explain + '</p>' : '') + '</div>';
  }

  function clockSVG(hh, mm) {
    var day = hh >= 6 && hh < 18;
    var ha = ((hh % 12) + mm / 60) * 30, ma = mm * 6;
    function hand(angle, len, w, cls) {
      var r = angle * Math.PI / 180;
      return '<line class="' + cls + '" x1="50" y1="50" x2="' + (50 + len * Math.sin(r)) + '" y2="' + (50 - len * Math.cos(r)) + '" stroke-width="' + w + '"/>';
    }
    var ticks = '';
    for (var i = 0; i < 12; i++) { var r = i * 30 * Math.PI / 180; ticks += '<circle cx="' + (50 + 38 * Math.sin(r)) + '" cy="' + (50 - 38 * Math.cos(r)) + '" r="' + (i % 3 ? 1.6 : 3) + '"/>'; }
    return '<svg class="clock ' + (day ? 'day' : 'night') + '" viewBox="0 0 100 100"><circle class="face" cx="50" cy="50" r="46"/>' + ticks +
      hand(ha, 22, 5, 'hh') + hand(ma, 33, 3, 'mh') + '<circle cx="50" cy="50" r="4"/><text x="50" y="76" text-anchor="middle">' + (day ? '☀️' : '🌙') + '</text></svg>';
  }

  function tabsFor(c) {
    var f = c.fun, t = [{ k: 'size', icon: '📏', name: '大きさ' }];
    if (f) t.push({ k: 'words', icon: '👋', name: 'ことば' }, { k: 'food', icon: '🍽️', name: '食べ物・動物' }, { k: 'wow', icon: '⭐', name: 'びっくり' });
    if (f && f.school) t.push({ k: 'school', icon: '🏫', name: '学校' });
    if (c.tz) t.push({ k: 'time', icon: '🕐', name: '時間・きょり' });
    if (c.life || c.happy || c.mac) t.push({ k: 'life', icon: '🏠', name: 'くらし' });
    if (c.links) t.push({ k: 'links', icon: '🤝', name: '日本との つながり' });
    t.push({ k: 'challenge', icon: '🎯', name: 'チャレンジ' });
    return t;
  }

  function headline(c) {
    var r = c.area / App.JP.area, off = c.tz ? App.offsetFromJapan(c.tz) : null;
    var ja = esc(c.ja) + 'は 日本の <b>' + App.ratioText(c.area, App.JP.area) + '</b>の 広さ';
    if (off != null) ja += off === 0 ? '。時間は 日本と おなじ！' : '。時差は <b>' + Math.abs(off) + '時間</b>。';
    else ja += '。';
    var n = r >= 1 ? (r < 10 ? App.round1(r) : Math.round(r)) : (1 / r < 10 ? App.round1(1 / r) : Math.round(1 / r));
    var en = r > 0.9 && r < 1.1 ? c.en + ' is about the same size as Japan.' :
      r >= 1 ? c.en + ' is about ' + n + ' times bigger than Japan.' : 'Japan is about ' + n + ' times bigger than ' + c.en + '.';
    return { ja: ja, en: en };
  }

  // ---------- tab renderers ----------
  var T = {};
  T.size = function (c) {
    var r = c.area / App.JP.area;
    var icons = '';
    if (r >= 1) {
      var n = Math.min(Math.round(r), 60);
      for (var i = 0; i < n; i++) icons += App.japanIcon();
      if (Math.round(r) > 60) icons += '<span class="more">… まだまだ</span>';
    }
    var big = r >= 1 ? '日本が <b>' + (r < 10 ? App.round1(r) : Math.round(r)) + 'こ</b> 入る 広さ！' :
      '日本の 中に <b>' + esc(c.ja) + '</b>が 約' + Math.round(1 / r).toLocaleString() + 'こ 入るよ！';
    var dens = c.pop ? Math.round(c.pop / c.area) : null, jd = Math.round(App.JP.pop / App.JP.area);
    return '<div class="grid2">' +
      '<div class="card ts-card"><div class="label">🗺️ ほんとうの 大きさで かさねると</div>' +
      App.trueSizeSVG(c.id, { japan: true, size: 340 }) +
      '<div class="legend"><span><i class="lg-c"></i>' + esc(c.ja) + '</span><span><i class="lg-j"></i>日本</span></div>' +
      '<a class="btn small" href="#/size/' + c.id + '">📏 世界地図で うごかしてみる</a></div>' +
      '<div class="stack">' +
      '<div class="card"><div class="label">📏 広さ</div><p class="bigline">' + big + '</p>' +
      (icons ? '<div class="jp-icons">' + icons + '</div>' : '') +
      '<div class="pair"><span>' + c.flag + ' ' + App.fmtArea(c.area) + '</span><span>🇯🇵 ' + App.fmtArea(App.JP.area) + '</span></div>' +
      (App.rankArea.r[c.id] ? '<p class="muted">世界で ' + App.rankArea.r[c.id] + '番目に 広い 国（日本は ' + App.rankArea.r.JPN + '番目）</p>' : '') + '</div>' +
      (c.pop ? '<div class="card"><div class="label">👥 人口（すんでいる 人の 数）</div>' +
        '<p class="bigline">日本の <b>' + App.ratioText(c.pop, App.JP.pop) + '</b></p>' +
        '<div class="pair"><span>' + c.flag + ' ' + App.fmtPeople(c.pop) + '</span><span>🇯🇵 ' + App.fmtPeople(App.JP.pop) + '</span></div>' +
        '<p class="muted">1 km² に すむ 人：' + esc(c.ja) + ' ' + dens.toLocaleString() + '人 ／ 日本 ' + jd.toLocaleString() + '人' +
        (dens < jd / 3 ? '（日本より ずっと ゆったり！）' : dens > jd * 1.5 ? '（日本より ぎゅうぎゅう！）' : '') + '</p></div>' : '') +
      '</div></div>';
  };

  T.words = function (c) {
    var f = c.fun, j = App.JP.fun;
    function say(kind, label, item) {
      return '<div class="card say"><div class="label">' + label + '</div>' +
        '<div class="say-text" lang="' + f.voice + '">' + esc(item.text) + '</div><div class="say-kana">' + esc(item.kana) + '</div>' +
        '<button class="btn primary" data-say="' + kind + '">🔊 きいてみる</button>' +
        '<div class="voice-src">' + (item.audio ? '🎙️ ほんものの 人の 声' : '💻 パソコンの 読み上げの 声') + '</div>' +
        (kind === 'hello' && f.helloNote ? '<p class="muted">🚀 ' + esc(f.helloNote) + '</p>' : '') + '</div>';
    }
    return '<p class="lead">' + esc(c.ja) + 'で 話されている ことば：<b>' + esc(f.lang) + '</b></p>' +
      '<div class="grid2">' + say('hello', '👋 こんにちは', f.hello) + say('thanks', '🙏 ありがとう', f.thanks) + '</div>' +
      '<p class="muted center">日本語では「こんにちは」「ありがとう」。声に 出して まねしてみよう！ 🗣️</p>' +
      '<div class="card"><div class="label">💴 お金</div><div class="pair"><span>' + c.flag + ' ' + esc(f.money) + '</span><span>🇯🇵 円</span></div></div>';
  };
  T.food = function (c) {
    var f = c.fun, j = App.JP.fun;
    function jp(jitem, text) {
      return '<div class="jp-mini">' + (jitem && jitem.img ? '<img src="' + jitem.img + '" alt="" loading="lazy">' : '') + '<span>🇯🇵 日本では：' + text + '</span></div>';
    }
    function card(label, item, jitem) {
      return '<div class="card food">' + '<div class="label">' + label + '</div>' + App.imgOrEmoji(item) +
        '<b class="food-name">' + item.emoji + ' ' + esc(item.name) + '</b>' +
        (jitem ? jp(jitem, jitem.emoji + ' ' + esc(jitem.name)) : '') + '</div>';
    }
    var spEmoji = (f.sport.match(/\p{Extended_Pictographic}/u) || ['🏅'])[0];
    return '<div class="grid3">' + card('🍽️ ゆうめいな 食べ物', f.dish, j.dish) + card('🐾 ゆうめいな 動物', f.animal, j.animal) +
      '<div class="card food"><div class="label">🏅 人気の スポーツ</div>' + App.imgOrEmoji({ img: f.sportImg, emoji: spEmoji }) +
      '<b class="food-name">' + esc(f.sport) + '</b>' + jp({ img: j.sportImg }, esc(j.sport)) + '</div>' +
      '</div>';
  };
  T.wow = function (c) {
    var f = c.fun;
    return '<div class="facts">' + f.facts.map(function (x, i) {
      return '<div class="card fact"><span class="fact-n">' + (i + 1) + '</span><p>' + esc(x) + '</p></div>';
    }).join('') + '</div>' +
      (f.flag ? '<div class="card flagcard"><div class="label">🏳️ 国旗の ひみつ</div><div class="flag-row"><span class="flag huge">' + c.flag + '</span><p>' + esc(f.flag) + '</p></div>' +
        '<div class="flag-row small"><span class="flag">🇯🇵</span><p>日本：' + esc(App.JP.fun.flag) + '</p></div></div>' : '');
  };
  T.school = function (c) {
    var s = c.fun.school, j = App.JP.fun.school;
    var months = '';
    for (var m = 1; m <= 12; m++) months += '<span class="mo' + (m === s.start ? ' them' : '') + (m === j.start ? ' jp' : '') + '">' + m + '月</span>';
    var diff = (s.start - j.start + 12) % 12;
    var cmp = diff === 0 ? '日本と おなじ 4月！' : (diff <= 6 ? '日本より ' + diff + 'か月 おそい' : '日本より ' + (12 - diff) + 'か月 早い');
    return '<div class="card"><div class="label">📅 学校の 1年が はじまる 月</div>' +
      '<div class="months">' + months + '</div>' +
      '<div class="legend"><span><i class="lg-c"></i>' + esc(c.ja) + '：' + s.start + '月</span><span><i class="lg-j"></i>日本：4月</span></div>' +
      '<p class="bigline">' + cmp + '</p></div>' +
      '<div class="grid2"><div class="card"><div class="label">' + c.flag + ' ' + esc(c.ja) + 'の 学校</div><p>' + esc(s.note) + '</p></div>' +
      '<div class="card"><div class="label">🇯🇵 日本の 学校</div><p>' + esc(j.note) + '</p></div></div>' +
      (c.school ? '<p class="muted">学校で 学ぶ 年数の めやす：' + esc(c.ja) + ' 約' + App.round1(c.school) + '年 ／ 日本 約' + App.round1(App.JP.school) + '年</p>' : '');
  };
  T.time = function (c) {
    var off = App.offsetFromJapan(c.tz);
    var offTxt = off === 0 ? '日本と おなじ 時間！' : '日本より <b>' + Math.abs(off) + '時間 ' + (off < 0 ? 'おくれている' : 'すすんでいる') + '</b>';
    var se = App.seasonText(c);
    var km = App.distanceKm(c), fly = Math.max(1, Math.round((km / 850 + 0.5) * 2) / 2);
    return '<div class="card clocks">' +
      '<div class="clockbox" data-tz="' + c.tz + '"></div><div class="vs">VS</div><div class="clockbox" data-tz="Asia/Tokyo"></div>' +
      '</div>' +
      '<p class="lead center">' + offTxt + '</p>' +
      '<p class="center activity"></p>' +
      '<div class="grid2">' +
      '<div class="card"><div class="label">' + se.icon + ' きせつ</div><p>' + se.text + '</p></div>' +
      '<div class="card"><div class="label">✈️ 東京からの きょり</div>' +
      '<p class="bigline">約 <b>' + km.toLocaleString() + ' km</b></p>' +
      '<p>首都 ' + esc(App.capitalName(c)) + 'まで。ひこうきで まっすぐ 行くと 約' + fly + '時間（めやす）。</p>' +
      '<p class="muted">東京〜長崎（約960km）の ' + (km < 1440 ? '約' + App.round1(km / 960) + '倍' : '約' + Math.round(km / 960) + '倍') + 'の きょり。</p></div>' +
      '</div>';
  };
  function tickClocks(root, c) {
    root.querySelectorAll('.clockbox').forEach(function (b) {
      var tz = b.dataset.tz, p = App.localParts(tz);
      if (!p) return;
      var who = tz === 'Asia/Tokyo' ? '🇯🇵 日本（東京）' : c.flag + ' ' + esc(c.ja) + '（' + esc(App.capitalName(c)) + '）';
      b.innerHTML = clockSVG(p.h, p.m) + '<div class="clock-who">' + who + '</div><div class="clock-time">' + App.clockText(p.h, p.m) + '</div>';
    });
    var act = root.querySelector('.activity');
    if (act) act.innerHTML = 'いま ' + esc(c.ja) + 'は… ' + App.kidActivity(App.localParts(c.tz), c.id);
  }
  T.life = function (c) {
    var J = App.JP;
    return '<p class="muted">数字は 国全体の へいきん（めやす）だよ。</p><div class="grid2">' +
      cmpBar('平均じゅみょう', '🎂', c.life && App.round1(c.life), App.round1(J.life), '歳', c, '生まれた 赤ちゃんが へいきんで 何さいまで 生きるかの めやす。') +
      cmpBar('学校で 学ぶ 年数', '🎒', c.school && App.round1(c.school), App.round1(J.school), '年', c, '小学校から 大学まで、ぜんぶで 何年 勉強しそうかの めやす。') +
      cmpBar('しあわせ度（10点まんてん）', '😊', c.happy && App.round1(c.happy), App.round1(J.happy), '点', c, '「いまの くらしは 0〜10の どこ？」と 聞いた アンケートの へいきん。') +
      cmpBar('マクドナルドの セットの ねだん', '🍔', c.mac, J.mac, '円', c, '同じ ものの ねだんを くらべると、物の ねだん（物価）の ちがいが わかるよ。') +
      '</div>';
  };
  T.links = function (c) {
    var L = c.links;
    function tile(icon, label, v, note) {
      if (v == null) return '';
      return '<div class="card stat"><span class="stat-ico">' + icon + '</span><div class="stat-label">' + label + '</div><b class="stat-num">' + App.fmtMan(v) + '</b>' + (note ? '<small class="muted">' + note + '</small>' : '') + '</div>';
    }
    return '<p class="lead">日本と ' + esc(c.ja) + 'の あいだを 行き来する 人の 数</p><div class="grid2">' +
      tile('🛬', esc(c.ja) + 'から 日本へ 来た 人（2024年）', L.in) +
      tile('🛫', '日本から ' + esc(c.ja) + 'へ 行った 人（2024年）', L.out, L.outApprox ? 'めやすの 数' : '') +
      tile('🏠', '日本に すんでいる ' + esc(c.ja) + 'の 人', L.res, '2024年末') +
      tile('🌏', esc(c.ja) + 'に すんでいる 日本人', L.abroad, '2023年') +
      '</div><p class="muted center">きみの クラスや 町にも、' + esc(c.ja) + 'から 来た 人が いるかな？</p>';
  };

  // ---------- challenge (earns the stamp) ----------
  function makeQuestion(c) {
    var qs = [];
    var others = App.listed.filter(function (x) { return x.id !== c.id && x.id !== 'JPN'; });
    qs.push(function () {
      var bigger = c.area > App.JP.area;
      return { q: esc(c.ja) + 'は 日本より 大きい？ 小さい？', opts: ['日本より 大きい 📈', '日本より 小さい 📉'], a: bigger ? 0 : 1,
        why: esc(c.ja) + 'の 広さは 日本の ' + App.ratioText(c.area, App.JP.area) + '。' };
    });
    if (c.capJa) qs.push(function () {
      var wrong = App.shuffle(others.filter(function (x) { return x.capJa && x.fun; })).slice(0, 2).map(function (x) { return x.capJa; });
      var o = App.shuffle([c.capJa].concat(wrong));
      return { q: esc(c.ja) + 'の 首都は どこ？', opts: o, a: o.indexOf(c.capJa), why: '首都は ' + esc(c.capJa) + '。' };
    });
    if (c.fun) {
      qs.push(function () {
        var pool = App.shuffle(App.featured.filter(function (x) { return x.fun.hello.text !== c.fun.hello.text && x.id !== 'JPN'; })).slice(0, 2);
        var o = App.shuffle([c].concat(pool));
        return { q: esc(c.ja) + 'の「こんにちは」は どれ？', opts: o.map(function (x) { return x.fun.hello.text + '（' + x.fun.hello.kana + '）'; }), a: o.indexOf(c),
          why: esc(c.ja) + 'では「' + esc(c.fun.hello.text) + '」と 言うよ。' };
      });
      qs.push(function () {
        var pool = App.shuffle(App.featured.filter(function (x) { return x.id !== c.id && x.fun.dish.name !== c.fun.dish.name; })).slice(0, 2);
        var o = App.shuffle([c].concat(pool));
        return { q: esc(c.ja) + 'の ゆうめいな 食べ物は どれ？', opts: o.map(function (x) { return x.fun.dish.emoji + ' ' + x.fun.dish.name; }), a: o.indexOf(c),
          why: esc(c.fun.dish.name) + 'だよ。' };
      });
    }
    if (c.tz) {
      var off = App.offsetFromJapan(c.tz);
      if (off != null && off === Math.round(off) && off !== 0) qs.push(function () {
        var t = ((12 + off) % 24 + 24) % 24;
        var cands = App.shuffle([t, (t + 3) % 24, (t + 21) % 24, (24 - t) % 24].filter(function (v, i, a) { return a.indexOf(v) === i; })).slice(0, 3);
        if (cands.indexOf(t) < 0) cands[0] = t;
        cands = App.shuffle(cands);
        return { q: '日本が おひるの 12時の とき、' + esc(c.ja) + 'は 何時？', opts: cands.map(function (v) { return App.clockText(v, 0); }), a: cands.indexOf(t),
          why: '時差は ' + Math.abs(off) + '時間。' + esc(c.ja) + 'は ' + App.clockText(t, 0) + '。' };
      });
    }
    return App.pick(qs)();
  }
  T.challenge = function (c) {
    var got = App.save.stamps[c.id];
    return '<div class="card challenge">' +
      (got ? '<p class="got-msg">✅ この 国の スタンプは もう もらったよ（' + got + '）。もう一度 ちょうせんしても いいよ！</p>' : '<p class="lead">こたえて スタンプを もらおう！ 🛂</p>') +
      '<div class="qbox"></div></div>';
  };
  function runChallenge(root, c) {
    var box = root.querySelector('.qbox'); if (!box) return;
    var q = makeQuestion(c);
    box.innerHTML = '<p class="q">' + q.q + '</p><div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="qres"></div>';
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        if (box.dataset.done) return; box.dataset.done = 1;
        var ok = +b.dataset.i === q.a;
        box.querySelectorAll('.opt')[q.a].classList.add('right');
        if (!ok) b.classList.add('wrong');
        var res = box.querySelector('.qres');
        if (ok) {
          App.sfx.good();
          var fresh = App.addStamp(c.id);
          res.innerHTML = '<p class="ok">⭕ せいかい！ ' + q.why + '</p>';
          if (fresh) setTimeout(function () { stampModal(c); }, 500);
          else res.innerHTML += '<button class="btn" id="again">べつの もんだい</button>';
        } else {
          App.sfx.bad();
          res.innerHTML = '<p class="ng">❌ ざんねん！ ' + q.why + '</p><button class="btn primary" id="again">もう一回 ちょうせん</button>';
        }
        var again = res.querySelector('#again');
        if (again) again.addEventListener('click', function () { delete box.dataset.done; runChallenge(root, c); });
      });
    });
  }
  function stampModal(c) {
    App.sfx.stamp();
    var m = App.modal('<div class="stamp-anim"><div class="stamp got big-stamp"><span class="flag">' + c.flag + '</span><b>' + esc(c.ja) + '</b><small>' + App.save.stamps[c.id] + '</small></div></div>' +
      '<h2>スタンプ ゲット！ 🎉</h2><p>パスポートに ' + esc(c.ja) + 'の スタンプが おされたよ。</p>' +
      '<div class="row"><a class="btn" href="#/passport" data-close>パスポートを 見る</a><a class="btn primary" href="#/map" data-close>つぎの 国を さがす 🗺️</a></div>', { cls: 'center' });
    App.checkNewBadges();
  }

  // ---------- page ----------
  App.screens.country = function (main, args) {
    var c = App.byId[args[0]];
    if (!c) { location.hash = '#/map'; return; }
    App.markVisited(c.id);
    if (c.id === 'JPN') return japanPage(main);
    var tabs = tabsFor(c);
    var cur = tabs.filter(function (t) { return t.k === args[1]; })[0] || tabs[0];
    var hl = headline(c);
    main.innerHTML =
      '<div class="country">' +
      '<div class="c-head" data-region="' + esc(c.region) + '">' +
      '<button class="btn back" id="back">← もどる</button>' +
      '<span class="flag huge">' + c.flag + '</span>' +
      '<div class="c-names"><h1>' + esc(c.ja) + '</h1><div class="en">' + esc(c.en) + '</div><span class="chip static">' + esc(c.region) + '</span>' +
      (App.save.stamps[c.id] ? ' <span class="chip static ok">🛂 スタンプ ずみ</span>' : '') + '</div>' +
      '<div class="c-hl"><p>' + hl.ja + '</p><p class="en">' + esc(hl.en) + '</p></div>' +
      '</div>' +
      '<nav class="tabs">' + tabs.map(function (t) { return '<button class="tab' + (t === cur ? ' on' : '') + (t.k === 'challenge' ? ' ch' : '') + '" data-k="' + t.k + '"><span>' + t.icon + '</span>' + t.name + '</button>'; }).join('') + '</nav>' +
      '<section class="tabpanel"></section>' +
      '<div class="stepper"></div>' +
      '</div>';
    main.querySelector('#back').addEventListener('click', function () {
      if (App.prevRoute && App.prevRoute.indexOf('#/c/') !== 0) history.back(); else location.hash = '#/map';
    });
    var panel = main.querySelector('.tabpanel'), stepper = main.querySelector('.stepper');
    var timer = null;
    function show(t) {
      cur = t;
      panel.dataset.k = t.k; stepper.dataset.k = t.k;
      main.querySelectorAll('.tab').forEach(function (b) { b.classList.toggle('on', b.dataset.k === t.k); });
      history.replaceState(null, '', '#/c/' + c.id + '/' + t.k);
      panel.innerHTML = T[t.k](c);
      panel.classList.remove('fade'); void panel.offsetWidth; panel.classList.add('fade');
      clearInterval(timer);
      if (t.k === 'time') { tickClocks(panel, c); timer = setInterval(function () { tickClocks(panel, c); }, 20000); }
      if (t.k === 'challenge') runChallenge(panel, c);
      panel.querySelectorAll('[data-say]').forEach(function (b) {
        b.addEventListener('click', function () {
          App.playPhrase(c.fun[b.dataset.say], c.fun.voice);
        });
      });
      var i = tabs.indexOf(t), prev = tabs[i - 1], next = tabs[i + 1];
      stepper.innerHTML = (prev ? '<button class="btn ghost" data-go="' + prev.k + '">◀ ' + prev.name + '</button>' : '<span></span>') +
        '<span class="dots">' + tabs.map(function (x) { return '<i class="' + (x === t ? 'on' : '') + '"></i>'; }).join('') + '</span>' +
        (next ? '<button class="btn primary" data-k="' + next.k + '" data-go="' + next.k + '">つぎ：' + next.icon + ' ' + next.name + ' ▶</button>' :
          '<a class="btn primary" data-acc="green" href="#/map">ほかの 国を さがす 🗺️</a>');
      stepper.querySelectorAll('[data-go]').forEach(function (b) {
        b.addEventListener('click', function () { App.sfx.tap(); show(tabs.filter(function (x) { return x.k === b.dataset.go; })[0]); window.scrollTo({ top: 0, behavior: 'smooth' }); main.scrollTop = 0; });
      });
    }
    main.querySelector('.tabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      App.sfx.tap(); show(tabs.filter(function (x) { return x.k === b.dataset.k; })[0]);
    });
    App.cleanups.push(function () { clearInterval(timer); });
    show(cur);
  };

  function japanPage(main) {
    var J = App.JP;
    main.innerHTML = '<div class="country">' +
      '<div class="c-head" data-region="アジア"><button class="btn back" onclick="history.back()">← もどる</button><span class="flag huge">🇯🇵</span>' +
      '<div class="c-names"><h1>日本</h1><div class="en">Japan</div></div>' +
      '<div class="c-hl"><p>ここが 日本！ ほかの 国と くらべて みよう。</p><p class="en">This is Japan. Let\'s compare it with other countries!</p></div></div>' +
      '<div class="grid2">' +
      '<div class="card ts-card"><div class="label">🗾 日本の 形</div>' + App.trueSizeSVG('JPN', { size: 300, color: '#E2434B' }) + '</div>' +
      '<div class="stack">' +
      '<div class="card"><div class="label">📏 広さ</div><p class="bigline">' + App.fmtArea(J.area) + '</p><p class="muted">世界で ' + App.rankArea.r.JPN + '番目に 広い（' + App.rankArea.n + 'の 国・地いきの 中で）。意外と 大きい！</p></div>' +
      '<div class="card"><div class="label">👥 人口</div><p class="bigline">' + App.fmtPeople(J.pop) + '</p><p class="muted">世界で ' + App.rankPop.r.JPN + '番目に 多い</p></div>' +
      '<div class="card"><div class="label">🎂 平均じゅみょう</div><p class="bigline">約' + App.round1(J.life) + '歳</p><p class="muted">世界で トップクラスの 長生きの 国！</p></div>' +
      '</div></div>' +
      '<div class="stepper"><span></span><a class="btn primary" href="#/map">くらべる 国を えらぶ 🗺️</a></div></div>';
  }
})();
