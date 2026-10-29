/* Home, map, size-compare, passport and about screens. */
(function () {
  var h = App.h, esc = App.esc;

  function flagName(c) { return '<span class="flag">' + c.flag + '</span><span class="nm">' + esc(c.ja) + '</span>'; }

  // ---------- country picker: search + continent tabs + flag tiles ----------
  App.Picker = function (el, onPick, opts) {
    opts = opts || {};
    el.innerHTML =
      '<div class="picker">' +
      '<label class="searchbox"><span>🔍</span><input type="search" placeholder="国の 名前（ひらがな・カタカナ・English）" autocomplete="off"></label>' +
      '<div class="results" hidden></div>' +
      '<div class="cont-tabs">' + App.CONTINENTS.map(function (ct, i) {
        return '<button class="chip' + (i === 0 ? ' on' : '') + '" data-cont="' + ct.key + '">' + ct.icon + ' ' + ct.key + '</button>';
      }).join('') + '</div>' +
      '<div class="tiles"></div>' +
      '</div>';
    var input = el.querySelector('input'), results = el.querySelector('.results'), tiles = el.querySelector('.tiles');
    function tile(c) {
      return '<button class="tile' + (c.fun ? ' feat' : '') + (App.save.stamps[c.id] ? ' got' : '') + '" data-id="' + c.id + '">' +
        '<span class="flag">' + c.flag + '</span><span class="nm">' + esc(c.ja) + '</span>' +
        (c.fun ? '<span class="badge">★</span>' : '') + (App.save.stamps[c.id] ? '<span class="badge ok">✔</span>' : '') + '</button>';
    }
    function showCont(key) {
      var cs = App.listed.filter(function (c) { return c.region === key && (c.id !== 'JPN' || opts.allowJapan); })
        .sort(function (a, b) { return (b.fun ? 1 : 0) - (a.fun ? 1 : 0) || b.pop - a.pop; });
      tiles.innerHTML = cs.map(tile).join('');
    }
    el.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        el.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); showCont(b.dataset.cont); App.sfx.tap();
      });
    });
    input.addEventListener('input', function () {
      var r = App.search(input.value).filter(function (c) { return c.id !== 'JPN' || opts.allowJapan; });
      if (!input.value.trim()) { results.hidden = true; return; }
      results.hidden = false;
      results.innerHTML = r.length ? r.map(tile).join('') : '<p class="muted">みつからないよ。べつの 書き方で ためしてね（例：ぶらじる / Brazil）</p>';
    });
    el.addEventListener('click', function (e) {
      var t = e.target.closest('.tile'); if (!t) return;
      App.sfx.tap(); onPick(t.dataset.id);
    });
    showCont(opts.startCont || 'アジア');
    return { focus: function () { input.focus(); } };
  };

  // ---------- HOME ----------
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  App.screens.home = function (main) {
    var today = App.todaysCountry();
    var nStamps = Object.keys(App.save.stamps).length;
    var featDone = App.featured.filter(function (c) { return App.save.stamps[c.id]; }).length;
    var tf = today.fun;
    main.innerHTML =
      '<div class="home">' +
      '<section class="hero">' +
      '<div class="hero-scene" aria-hidden="true"><i class="cloud c1"></i><i class="cloud c2"></i>' +
      '<svg viewBox="0 0 600 220" preserveAspectRatio="xMaxYMid meet">' +
      '<path id="flight" class="trail" d="M70 185 C 180 170, 250 60, 380 70 S 540 40, 585 18"/>' +
      '<circle class="pin" cx="70" cy="185" r="9"/><text class="pin-label" x="86" y="205">ながさき</text>' +
      '<g class="plane-g"><text class="plane" text-anchor="middle" dominant-baseline="central" transform="rotate(45)">✈️</text>' +
      (reduceMotion ? '' : '<animateMotion dur="2.4s" fill="freeze" rotate="auto" calcMode="spline" keyTimes="0;1" keySplines="0.3 0 0.3 1" path="M70 185 C 180 170, 250 60, 380 70 S 540 40, 585 18"/>') +
      '</g></svg></div>' +
      '<h1>日本と 世界の 国を くらべて みよう！</h1>' +
      '<p class="en">Let\'s compare Japan with countries around the world!</p>' +
      '<p>大きさ・時間・あいさつ・食べ物・学校… 日本と どこが ちがうかな？</p>' +
      '</section>' +
      '<section class="bigtiles">' +
      '<a class="bigtile t-map" href="#/map"><span class="ico">🗺️</span><b>ちずで さがす</b><small>国を えらんで 日本と くらべる</small></a>' +
      '<a class="bigtile t-size" href="#/size"><span class="ico">📏</span><b>大きさ くらべ</b><small>国を うごかして ほんとうの 大きさを 見る</small></a>' +
      '<a class="bigtile t-game" href="#/games"><span class="ico">🎮</span><b>ゲーム</b><small>クイズで あそぼう</small></a>' +
      '<a class="bigtile t-pass" href="#/passport"><span class="ico">🛂</span><b>パスポート</b><small>スタンプ ' + nStamps + 'こ</small></a>' +
      '</section>' +
      '<section class="home-row">' +
      '<div class="card today">' +
      '<div class="label">⭐ きょうの 国</div>' +
      '<div class="today-body"><span class="flag big">' + today.flag + '</span><div><b class="today-name">' + esc(today.ja) + '</b><div class="en">' + esc(today.en) + '</div>' +
      '<p>' + esc(tf.facts[0]) + '</p></div></div>' +
      '<a class="btn primary" href="#/c/' + today.id + '">見に行く ▶</a>' +
      '</div>' +
      '<div class="card warp">' +
      '<div class="label">🎲 どこかへ ワープ！</div>' +
      '<p>どの 国に 行くかは おたのしみ。</p>' +
      '<button class="btn" id="warp">ワープする 🚀</button>' +
      '</div>' +
      '<div class="card progress">' +
      '<div class="label">🛂 スタンプ あつめ</div>' +
      '<p>★の 国 ' + featDone + ' / ' + App.featured.length + '</p>' +
      '<div class="bar"><i style="width:' + Math.round(100 * featDone / App.featured.length) + '%"></i></div>' +
      '<small>国の ページの さいごの「チャレンジ」に せいかいすると スタンプが もらえるよ。</small>' +
      '</div>' +
      '</section>' +
      '<p class="footer-links"><a href="#/about">この アプリについて・データの もと</a></p>' +
      '</div>';
    if (reduceMotion) main.querySelector('.plane-g').setAttribute('transform', 'translate(585 18)');
    main.querySelector('#warp').addEventListener('click', function () {
      var pool = App.featured.filter(function (c) { return c.id !== 'JPN'; });
      location.hash = '#/c/' + App.pick(pool).id;
    });
  };

  // ---------- MAP ----------
  App.screens.map = function (main, args) {
    main.innerHTML =
      '<div class="split">' +
      '<div class="mapbox"><div class="maphint">国を タッチしてね！ <b class="starhint">★</b> は くわしく 見られる 国</div>' +
      '<div class="mapctl"><button data-z="in" title="大きく">＋</button><button data-z="out" title="小さく">－</button><button data-z="reset" title="もとに もどす">⟲</button></div></div>' +
      '<aside class="side"><div class="picked"></div><div class="pick"></div></aside>' +
      '</div>';
    var mapEl = main.querySelector('.mapbox'), picked = main.querySelector('.picked');
    var map = App.WorldMap(mapEl, { onPick: show });
    mapEl.querySelector('.mapctl').addEventListener('click', function (e) {
      var z = e.target.dataset.z; if (!z) return;
      if (z === 'in') map.zoomBy(1.6); else if (z === 'out') map.zoomBy(1 / 1.6); else map.reset();
    });
    App.Picker(main.querySelector('.pick'), function (id) { show(id); map.flyTo(id); }, { allowJapan: true });

    function show(id) {
      var c = App.byId[id]; if (!c) return;
      map.select(id);
      if (id === 'JPN') {
        picked.innerHTML = '<div class="card pickcard"><div class="pc-head"><span class="flag big">🇯🇵</span><div><b>日本</b><div class="en">Japan</div></div></div>' +
          '<p>ここが 日本！ ほかの 国を タッチして くらべて みよう。</p><a class="btn" href="#/c/JPN">日本の データを 見る ▶</a></div>';
        return;
      }
      var ar = App.ratioText(c.area, App.JP.area);
      picked.innerHTML =
        '<div class="card pickcard">' +
        '<div class="pc-head"><span class="flag big">' + c.flag + '</span><div><b>' + esc(c.ja) + '</b><div class="en">' + esc(c.en) + '</div></div>' +
        (c.fun ? '<span class="feat-tag">★ くわしい 国</span>' : '') + '</div>' +
        '<p class="quick">広さは 日本の <b>' + ar + '</b></p>' +
        (c.list ? '<a class="btn primary" href="#/c/' + c.id + '">この 国を くわしく 見る ▶</a>' : '<p class="muted">この 地いきは くわしい データが ないよ。</p>') +
        '<a class="btn ghost" href="#/size/' + c.id + '">📏 大きさを くらべる</a>' +
        '</div>';
      if (App.save) App.markVisited(id);
    }
    if (args[0] && App.byId[args[0]]) { show(args[0]); map.flyTo(args[0]); }
    else picked.innerHTML = '<div class="card pickcard empty"><p>👆 ちずの 国を タッチするか、下から えらんでね。</p></div>';
  };

  // ---------- SIZE COMPARE ----------
  var DEMOS = [
    { label: '🧊 グリーンランドを アフリカへ', id: 'GRL', to: [20, 5], msg: 'ちずでは アフリカと おなじくらいに 見える グリーンランド。でも 本当は アフリカの 約14分の1！' },
    { label: '🐻 ロシアを 赤道へ', id: 'RUS', to: [20, 0], msg: '北に ある ロシアは、赤道に もってくると ずいぶん 小さく なるよ。それでも 世界一 大きい 国！' },
    { label: '🗾 日本を ヨーロッパへ', id: null, jp: [12, 50], msg: '日本を ヨーロッパに おくと… 日本は 意外と 大きい 国なんだ！' },
    { label: '🦘 オーストラリアを 日本へ', id: 'AUS', to: [138, 37], msg: 'オーストラリアを 日本に もってくると… 日本が すっぽり 入って しまうね。' },
    { label: '🇺🇸 アメリカを 日本へ', id: 'USA', to: [138, 37], msg: 'アメリカを 日本に かさねると… 日本が いくつ 入るかな？' },
    { label: '🇧🇷 ブラジルと くらべる', id: 'BRA', to: [138, 37], msg: 'ブラジルを 日本に かさねると… どれくらい 大きいかな？' },
  ];
  App.screens.size = function (main, args) {
    main.innerHTML =
      '<div class="split">' +
      '<div class="mapbox"><div class="maphint size-msg">🖐️ 色の ついた 国を つかんで、ドラッグして うごかしてみよう！</div>' +
      '<div class="mapctl"><button data-z="in">＋</button><button data-z="out">－</button><button data-z="reset">⟲</button></div>' +
      '<div class="where"></div></div>' +
      '<aside class="side">' +
      '<div class="card size-now"></div>' +
      '<div class="card"><div class="label">✨ ためして みよう</div><div class="demos">' +
      DEMOS.map(function (d, i) { return '<button class="btn small" data-demo="' + i + '">' + d.label + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="card"><div class="label">📏 くらべる 国を えらぶ</div><div class="pick"></div></div>' +
      '</aside></div>';
    var mapEl = main.querySelector('.mapbox'), msg = main.querySelector('.size-msg'), where = main.querySelector('.where'), now = main.querySelector('.size-now');
    var current = null;
    var map = App.WorldMap(mapEl, {
      stars: false,
      onPick: function (id) { if (id !== 'JPN' && App.byId[id] && App.byId[id].list) choose(id); },
      onDrop: function (o) { tellWhere(o); },
    });
    mapEl.querySelector('.mapctl').addEventListener('click', function (e) {
      var z = e.target.dataset.z; if (!z) return;
      if (z === 'in') map.zoomBy(1.6); else if (z === 'out') map.zoomBy(1 / 1.6); else map.reset();
    });
    var jp = map.addOverlay('JPN', '#E2434B', '日本');

    function tellWhere(o) {
      var under = App.features.filter(function (f) { return f.properties.id !== o.id && d3.geoContains(f, o.center); })[0];
      var lat = Math.round(o.center[1]);
      var latTxt = lat === 0 ? '赤道の 上' : (lat > 0 ? '北緯 ' + lat + '°' : '南緯 ' + (-lat) + '°');
      var c = App.byId[o.id];
      var u = under && App.byId[under.properties.id];
      where.innerHTML = '<b>' + esc(c.ja) + '</b> は いま ' + (u ? u.flag + ' ' + esc(u.ja) + ' の 上' : '海の 上') + '（' + latTxt + '）' +
        (Math.abs(lat) > 50 ? '<br>北や 南の はしに 行くほど、ちずでは 大きく 見えるよ！' : '');
    }
    function choose(id, to) {
      if (current) current.remove();
      var c = App.byId[id];
      current = map.addOverlay(id, '#3D7FC1', c.ja);
      if (to) current.moveTo(to, 1400); else {
        var t = [App.JP.cen[0] + 8, App.JP.cen[1] - 6];
        current.moveTo(t, 1400);
      }
      setTimeout(function () { tellWhere(current); }, 1450);
      now.innerHTML = '<div class="label">いま くらべている 国</div>' +
        '<div class="pc-head"><span class="flag big">' + c.flag + '</span><div><b>' + esc(c.ja) + '</b><div class="en">' + esc(c.en) + '</div></div></div>' +
        '<p class="quick">本当の 広さは 日本の <b>' + App.ratioText(c.area, App.JP.area) + '</b></p>' +
        '<div class="row"><button class="btn small" id="back-home">元の 場所に もどす</button><a class="btn small primary" href="#/c/' + id + '">この 国の ページへ ▶</a></div>';
      now.querySelector('#back-home').addEventListener('click', function () { current.moveTo(App.mainShape(id).center, 1200); jp.moveTo(App.mainShape('JPN').center, 1200); setTimeout(function () { tellWhere(current); }, 1250); });
    }
    main.querySelectorAll('[data-demo]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = DEMOS[+b.dataset.demo];
        App.sfx.tap(); map.reset();
        if (d.id) {
          choose(d.id);
          current.moveTo(App.mainShape(d.id).center);
          setTimeout(function () { current.moveTo(d.to, 1800); setTimeout(function () { tellWhere(current); }, 1850); }, 500);
          jp.moveTo(App.mainShape('JPN').center, 600);
        } else { jp.moveTo(d.jp, 1800); setTimeout(function () { tellWhere(jp); }, 1850); }
        msg.innerHTML = '💡 ' + d.msg;
      });
    });
    App.Picker(main.querySelector('.pick'), function (id) { choose(id); });
    now.innerHTML = '<div class="label">いま くらべている 国</div><p>まだ ないよ。下から 国を えらぶか、ちずの 国を タッチしてね。<br>赤い 日本も ドラッグできるよ！</p>';
    if (args[0] && App.byId[args[0]] && args[0] !== 'JPN') choose(args[0]);
  };

  // ---------- PASSPORT ----------
  App.BADGES = [
    { id: 'first', icon: '🎫', name: 'はじめての スタンプ', test: function (n) { return n.all >= 1; }, need: '1つ スタンプを もらう' },
    { id: 's5', icon: '🧭', name: 'たんけんか', test: function (n) { return n.all >= 5; }, need: 'スタンプ 5こ' },
    { id: 's15', icon: '✈️', name: 'せかい旅行者', test: function (n) { return n.all >= 15; }, need: 'スタンプ 15こ' },
    { id: 'conts', icon: '🌍', name: '6大陸 せいは', test: function (n) { return n.conts >= 6; }, need: '6つの 大陸 すべてで スタンプ' },
    { id: 'feat', icon: '👑', name: '★の 国 コンプリート', test: function (n) { return n.feat >= App.featured.length; }, need: '★の 国 ぜんぶ' },
    { id: 'quiz20', icon: '🧠', name: 'クイズ名人', test: function (n) { return n.correct >= 20; }, need: 'ゲームで 20もん せいかい' },
    { id: 'quiz50', icon: '🏆', name: 'クイズ はかせ', test: function (n) { return n.correct >= 50; }, need: 'ゲームで 50もん せいかい' },
  ];
  App.stampStats = function () {
    var ids = Object.keys(App.save.stamps);
    var conts = {};
    ids.forEach(function (id) { var c = App.byId[id]; if (c) conts[c.region] = 1; });
    return {
      all: ids.length, conts: App.CONTINENTS.filter(function (ct) { return conts[ct.key]; }).length,
      feat: App.featured.filter(function (c) { return App.save.stamps[c.id]; }).length, correct: App.save.correct,
    };
  };
  App.screens.passport = function (main) {
    var st = App.stampStats();
    var html = '<div class="passport">' +
      '<section class="pp-cover card">' +
      '<div class="pp-title">🛂 PASSPORT <small>パスポート</small></div>' +
      '<div class="pp-stats"><span>スタンプ <b>' + st.all + '</b>こ</span><span>大陸 <b>' + st.conts + '</b>/6</span><span>ゲーム せいかい <b>' + st.correct + '</b></span></div>' +
      '</section>' +
      '<h2>🏅 バッジ</h2><div class="badges">' +
      App.BADGES.map(function (b) {
        var ok = b.test(st);
        return '<div class="badge-card' + (ok ? ' ok' : '') + '"><span class="bi">' + (ok ? b.icon : '🔒') + '</span><b>' + b.name + '</b><small>' + b.need + '</small></div>';
      }).join('') + '</div>' +
      '<h2>📮 スタンプ</h2>' +
      '<p class="muted">国の ページの「🎯 チャレンジ」に せいかいすると スタンプが おされるよ。グレーの 国を タッチして 行ってみよう！</p>';
    App.CONTINENTS.forEach(function (ct) {
      var cs = App.listed.filter(function (c) { return c.region === ct.key && c.id !== 'JPN' && (c.fun || App.save.stamps[c.id]); })
        .sort(function (a, b) { return (b.fun ? 1 : 0) - (a.fun ? 1 : 0) || b.pop - a.pop; });
      if (!cs.length) return;
      html += '<h3>' + ct.icon + ' ' + ct.key + '</h3><div class="stamps">' + cs.map(function (c) {
        var got = App.save.stamps[c.id];
        return '<a class="stamp' + (got ? ' got' : '') + '" href="#/c/' + c.id + '" style="--r:' + ((c.id.charCodeAt(0) * 7 + c.id.charCodeAt(1) * 3) % 21 - 10) + 'deg">' +
          '<span class="flag">' + c.flag + '</span><b>' + esc(c.ja) + '</b><small>' + (got ? got : 'まだ') + '</small></a>';
      }).join('') + '</div>';
    });
    main.innerHTML = html + '</div>';
  };

  function creditsHTML() {
    var C = window.CREDITS; if (!C) return '';
    function li(x) {
      return '<li><b>' + esc(x.use) + '</b> — <a href="' + esc(x.page) + '" target="_blank" rel="noopener">' + esc(x.file) + '</a>' +
        (x.author ? ' / ' + esc(x.author) : '') + (x.license ? '（' + esc(x.license) + '）' : '') + '</li>';
    }
    return '<details><summary><h2 style="display:inline">📷 写真と 声の クレジット（Credits）</h2></summary>' +
      '<p class="muted">All photos and recordings are from Wikimedia Commons under the licenses shown. Photos were resized; recordings were trimmed and volume-adjusted.</p>' +
      '<h3>Photos</h3><ul class="credits">' + C.images.map(li).join('') + '</ul>' +
      '<h3>Audio (file name → audio/aNN.mp3)</h3><ul class="credits">' + C.audio.map(li).join('') + '</ul></details>';
  }

  // ---------- ABOUT ----------
  App.screens.about = function (main) {
    main.innerHTML = '<div class="about card">' +
      '<h1>この アプリについて</h1>' +
      '<p>日本と 世界の 国を くらべる アプリです。数字は「めやす」です。国の 中でも 地いきに よって ちがうことが あります。</p>' +
      '<h2>📚 データの もと</h2><ul>' +
      '<li>国の 形・広さ・人口：Natural Earth（だいたい 2019年ごろの 数）</li>' +
      '<li>平均じゅみょう・学校で 学ぶ 年数：国連（UN DESA・UNDP、2023年）— Our World in Data より</li>' +
      '<li>しあわせ度：World Happiness Report / Gallup（2021〜2023年の 平均）</li>' +
      '<li>マクドナルドの セットの ねだん：Numbeo（2026年9月、1ドル＝155円で 計算した めやす）</li>' +
      '<li>日本に 来た 人・行った 人：日本政府観光局 JNTO（2024年）</li>' +
      '<li>日本に すむ 外国の 人：出入国在留管理庁（2024年末）／外国に すむ 日本人：外務省（2023年10月）</li>' +
      '<li>あいさつの 声：Wikimedia Commons（Lingua Libre・Wiktionary の 録音）。録音が ない ことばは、パソコンの 読み上げ機能を 使います。</li>' +
      '<li>食べ物・動物・スポーツの 写真：Wikimedia Commons。くわしくは 下の「写真と 声の クレジット」を 見てね。</li>' +
      '</ul>' +
      '<h2>⚙️ せってい</h2>' +
      '<p><button class="btn" id="tut">つかいかたを もう一度 見る</button> <button class="btn ghost" id="reset">スタンプと 記録を ぜんぶ けす</button></p>' +
      '<p class="muted">記録は この パソコンの ブラウザに だけ 保存されます。</p>' +
      creditsHTML() +
      '</div>';
    main.querySelector('#tut').addEventListener('click', function () { App.showTutorial(); });
    main.querySelector('#reset').addEventListener('click', function () {
      var m = App.modal('<h2>ほんとうに けす？</h2><p>スタンプ・バッジ・ゲームの 記録が ぜんぶ なくなるよ。</p><div class="row"><button class="btn" data-close>やめる</button><button class="btn danger" id="yes">けす</button></div>');
      m.el.querySelector('#yes').addEventListener('click', function () {
        App.save.stamps = {}; App.save.visited = {}; App.save.correct = 0; App.save.games = {}; App.persist(); m.close(); App.toast('けしました');
      });
    });
  };
})();
