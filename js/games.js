/* Games: 5 questions each. */
(function () {
  var esc = App.esc;

  var GAMES = [
    { k: 'howmany', icon: '🗾', name: '日本 何こ分？', desc: '国の 形を 見て、日本が 何こ 入るか あてよう', make: qHowMany },
    { k: 'bigger', icon: '⚖️', name: 'どっちが 大きい？', desc: '広さや 人口を くらべよう', make: qBigger },
    { k: 'hello', icon: '👋', name: 'あいさつ クイズ', desc: '「こんにちは」を 聞いて、どこの 国か あてよう', make: qHello },
    { k: 'shape', icon: '🧩', name: 'シルエット クイズ', desc: '国の 形だけで わかるかな？', make: qShape },
    { k: 'time', icon: '🕐', name: '時差 クイズ', desc: '日本が 夜の とき、あの 国は 何時？', make: qTime },
  ];

  App.screens.games = function (main) {
    var ACC = ['pink', 'blue', 'green', 'purple', 'orange'];
    main.innerHTML = '<div class="games"><h1>🎮 ゲーム</h1><p class="muted">どれも 5もん。せいかいすると パスポートの「ゲーム せいかい」が ふえるよ！</p>' +
      '<div class="gamegrid">' + GAMES.map(function (g, i) {
        var best = App.save.games[g.k];
        return '<a class="gametile" data-acc="' + ACC[i % ACC.length] + '" href="#/game/' + g.k + '"><span class="ico">' + g.icon + '</span><b>' + g.name + '</b><small>' + g.desc + '</small>' +
          (best != null ? '<span class="best">さいこう ' + best + '/5 ' + '⭐'.repeat(stars(best)) + '</span>' : '<span class="best new">NEW</span>') + '</a>';
      }).join('') + '</div></div>';
  };
  function stars(s) { return s >= 5 ? 3 : s >= 3 ? 2 : s >= 1 ? 1 : 0; }

  App.screens.game = function (main, args) {
    var g = GAMES.filter(function (x) { return x.k === args[0]; })[0];
    if (!g) { location.hash = '#/games'; return; }
    var round = 0, score = 0, used = {};
    var gi = GAMES.indexOf(g);
    main.innerHTML = '<div class="gameplay" data-acc="' + ['pink', 'blue', 'green', 'purple', 'orange'][gi % 5] + '"><div class="g-top"><a class="btn back" href="#/games">← ゲーム いちらん</a><h1>' + g.icon + ' ' + g.name + '</h1><div class="g-score"></div></div><div class="card g-card"></div></div>';
    var card = main.querySelector('.g-card'), sc = main.querySelector('.g-score');
    function next() {
      if (round >= 5) return finish();
      round++;
      sc.innerHTML = '<span>' + round + ' / 5 もん</span><span>⭕ ' + score + '</span>';
      var q = g.make(used);
      card.innerHTML = '<div class="g-visual">' + (q.visual || '') + '</div><p class="q">' + q.q + '</p>' +
        '<div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '">' + o + '</button>'; }).join('') + '</div><div class="qres"></div>';
      if (q.after) q.after(card);
      card.querySelectorAll('.opt').forEach(function (b) {
        b.addEventListener('click', function () {
          if (card.dataset.done) return; card.dataset.done = 1;
          var ok = +b.dataset.i === q.a;
          card.querySelectorAll('.opt')[q.a].classList.add('right');
          if (!ok) b.classList.add('wrong');
          if (ok) { score++; App.save.correct++; App.persist(); App.sfx.good(); } else App.sfx.bad();
          if (q.reveal) card.querySelector('.g-visual').innerHTML = q.reveal;
          card.querySelector('.qres').innerHTML = '<p class="' + (ok ? 'ok' : 'ng') + '">' + (ok ? '⭕ せいかい！ ' : '❌ ざんねん！ ') + q.why + '</p>' +
            '<button class="btn primary" id="nextq">' + (round >= 5 ? 'けっかを 見る 🏁' : 'つぎの もんだい ▶') + '</button>';
          sc.innerHTML = '<span>' + round + ' / 5 もん</span><span>⭕ ' + score + '</span>';
          card.querySelector('#nextq').addEventListener('click', function () { delete card.dataset.done; next(); });
          card.querySelector('#nextq').focus();
        });
      });
    }
    function finish() {
      var best = App.save.games[g.k];
      if (best == null || score > best) { App.save.games[g.k] = score; App.persist(); }
      var msg = score === 5 ? 'パーフェクト！ すごい！ 🎉' : score >= 3 ? 'よく できました！ 👏' : 'つぎは もっと いけるよ！ 💪';
      card.innerHTML = '<div class="finish"><div class="big-stars">' + ('⭐'.repeat(stars(score)) || '🌱') + '</div><h2>' + score + ' / 5 もん せいかい</h2><p>' + msg + '</p>' +
        '<div class="row"><a class="btn" href="#/games">ほかの ゲーム</a><button class="btn primary" id="again">もう一回 🔁</button></div></div>';
      card.querySelector('#again').addEventListener('click', function () { round = 0; score = 0; used = {}; next(); });
      if (score === 5) App.sfx.stamp();
      App.checkNewBadges();
    }
    next();
  };

  // ---------- question makers ----------
  function choose(pool, used) {
    var free = pool.filter(function (c) { return !used[c.id]; });
    var c = App.pick(free.length ? free : pool); used[c.id] = 1; return c;
  }
  function fmtTimes(r) { return r >= 1 ? '日本 ' + (r < 10 ? App.round1(r) : Math.round(r)) + 'こ分' : '日本の ' + Math.max(2, Math.round(1 / r)) + '分の1'; }

  function qHowMany(used) {
    var pool = App.listed.filter(function (c) { var r = c.area / App.JP.area; return c.id !== 'JPN' && ((r >= 1.4 && r <= 50) || (r >= 0.25 && r <= 0.7)); });
    var c = choose(pool, used), r = c.area / App.JP.area;
    var opts = [r, r * 3, r / 3];
    var labels = opts.map(fmtTimes);
    if (labels[1] === labels[0] || labels[2] === labels[0]) { opts = [r, r * 5, r / 5]; labels = opts.map(fmtTimes); }
    var order = App.shuffle([0, 1, 2]);
    return {
      visual: App.trueSizeSVG(c.id, { size: 260 }) + '<div class="g-name">' + c.flag + ' ' + esc(c.ja) + '</div>',
      reveal: App.trueSizeSVG(c.id, { size: 260, japan: true }) + '<div class="g-name">' + c.flag + ' ' + esc(c.ja) + ' ＋ <span style="color:#E2434B">日本</span></div>',
      q: esc(c.ja) + 'の 広さは 日本 何こ分？',
      opts: order.map(function (i) { return labels[i]; }), a: order.indexOf(0),
      why: esc(c.ja) + 'は 日本の ' + App.ratioText(c.area, App.JP.area) + '。',
    };
  }
  function qBigger(used) {
    var byPop = Math.random() < 0.5;
    var f = byPop ? 'pop' : 'area';
    var pool = App.listed.filter(function (c) { return c[f] && c[f] > (byPop ? 3e6 : 5e4); });
    var a, b, tries = 0;
    do { a = App.pick(pool); b = App.pick(pool); tries++; } while ((a === b || Math.max(a[f], b[f]) / Math.min(a[f], b[f]) < 1.3) && tries < 50);
    var ans = a[f] > b[f] ? 0 : 1;
    var fmt = byPop ? App.fmtPeople : App.fmtArea;
    return {
      visual: '<div class="vs-flags"><span class="flag huge">' + a.flag + '</span><b>VS</b><span class="flag huge">' + b.flag + '</span></div>',
      q: byPop ? '人口（すんでいる 人）が 多いのは どっち？' : '広い のは どっち？',
      opts: [a.flag + ' ' + esc(a.ja), b.flag + ' ' + esc(b.ja)], a: ans,
      why: esc(a.ja) + ' ' + fmt(a[f]) + '、' + esc(b.ja) + ' ' + fmt(b[f]) + '。',
    };
  }
  function qHello(used) {
    var pool = App.featured.filter(function (c) { return c.id !== 'JPN'; });
    var c = choose(pool, used);
    var wrong = App.shuffle(pool.filter(function (x) { return x.fun.hello.text !== c.fun.hello.text; })).slice(0, 2);
    var o = App.shuffle([c].concat(wrong));
    return {
      visual: '<div class="hello-big" lang="' + c.fun.voice + '">' + esc(c.fun.hello.text) + '</div><div class="say-kana">' + esc(c.fun.hello.kana) + '</div><button class="btn" id="play">🔊 きく</button>',
      after: function (card) { card.querySelector('#play').addEventListener('click', function () { App.playHello(c.fun); }); },
      q: 'この「こんにちは」は どこの 国の ことば？',
      opts: o.map(function (x) { return x.flag + ' ' + esc(x.ja); }), a: o.indexOf(c),
      why: esc(c.ja) + 'の ' + esc(c.fun.lang) + 'だよ。',
    };
  }
  function qShape(used) {
    var pool = App.listed.filter(function (c) { return c.id !== 'JPN' && (c.fun || c.area > 4e5); });
    var c = choose(pool, used);
    var wrong = App.shuffle(pool.filter(function (x) { return x !== c && x.region === c.region; })).slice(0, 2);
    if (wrong.length < 2) wrong = wrong.concat(App.shuffle(pool.filter(function (x) { return x !== c && wrong.indexOf(x) < 0; })).slice(0, 2 - wrong.length));
    var o = App.shuffle([c].concat(wrong));
    return {
      visual: App.trueSizeSVG(c.id, { size: 260, color: '#5B6770' }),
      reveal: App.trueSizeSVG(c.id, { size: 260 }) + '<div class="g-name">' + c.flag + ' ' + esc(c.ja) + '</div>',
      q: 'この 形は どこの 国？（ヒント：' + esc(c.region) + '）',
      opts: o.map(function (x) { return x.flag + ' ' + esc(x.ja); }), a: o.indexOf(c),
      why: esc(c.ja) + 'の 形だよ。',
    };
  }
  function qTime(used) {
    var pool = App.featured.filter(function (c) {
      if (c.id === 'JPN' || !c.tz) return false;
      var off = App.offsetFromJapan(c.tz); return off != null && off !== 0 && off === Math.round(off);
    });
    var c = choose(pool, used), off = App.offsetFromJapan(c.tz);
    var jpH = App.pick([8, 12, 18, 21]);
    var t = ((jpH + off) % 24 + 24) % 24;
    var cands = [t];
    [3, -3, 6, -6, 12].forEach(function (d) { var v = ((t + d) % 24 + 24) % 24; if (cands.length < 3 && cands.indexOf(v) < 0) cands.push(v); });
    var o = App.shuffle(cands);
    return {
      visual: '<div class="vs-flags"><span class="flag huge">🇯🇵</span><b>' + App.clockText(jpH, 0) + '</b></div>',
      q: '日本が <b>' + App.clockText(jpH, 0) + '</b>の とき、' + c.flag + ' ' + esc(c.ja) + '（' + esc(App.capitalName(c)) + '）は 何時？',
      opts: o.map(function (v) { return App.clockText(v, 0); }), a: o.indexOf(t),
      why: esc(c.ja) + 'は 日本より ' + Math.abs(off) + '時間 ' + (off < 0 ? 'おくれている' : 'すすんでいる') + 'よ。',
    };
  }
})();
