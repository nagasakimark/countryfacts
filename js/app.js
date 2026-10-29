/* Router, help, first-time guide, badges. */
(function () {
  var main = document.getElementById('main');
  var esc = App.esc;

  var HELP = {
    home: ['🏠 ホーム', '下の ボタンで いつでも ほかの ページに 行けるよ。<br>「きょうの 国」や「ワープ」で 知らない 国に 行ってみよう！'],
    map: ['🗺️ ちずで さがす', '① ちずの 国を タッチ（または 右の リストから えらぶ）<br>② 「この 国を くわしく 見る」を おす<br>＋ － で ちずを 大きく・小さく。ドラッグで うごかせるよ。<br><b>★</b> の 国は 食べ物や あいさつも 見られる 国。'],
    size: ['📏 大きさ くらべ', 'ふつうの ちずは、北や 南の 国が 本当より 大きく 見えるんだ。<br>色の ついた 国を ドラッグして うごかすと、本当の 大きさの まま うごくよ。<br>赤い 日本も うごかせる！「ためして みよう」の ボタンも おしてみてね。'],
    country: ['📖 国の ページ', '上の タブで 見たい ものを えらぶか、下の「つぎ ▶」で じゅんばんに 見ていこう。<br>さいごの 🎯 チャレンジに せいかいすると スタンプが もらえるよ！<br>🔊 ボタンで あいさつが 聞けるよ。'],
    games: ['🎮 ゲーム', 'あそびたい ゲームを えらんでね。どれも 5もん。<br>さいこう 点数が のこるよ。'],
    game: ['🎮 ゲーム', 'こたえを 1つ えらんで おそう。<br>まちがえても だいじょうぶ。こたえを 見て おぼえよう！'],
    passport: ['🛂 パスポート', '国の ページの チャレンジで もらった スタンプが ここに あつまるよ。<br>グレーの 国を タッチすると その 国へ 行けるよ。'],
    about: ['ℹ️ この アプリについて', 'データの もとや、記録の けし方が 書いてあるよ。'],
  };

  var current = 'home';
  App.prevRoute = null;
  var lastHash = location.hash;

  function route() {
    App.cleanups.forEach(function (f) { try { f(); } catch (e) { } });
    App.cleanups = [];
    var parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    var name = parts[0] || 'home';
    var map = { c: 'country' };
    name = map[name] || name;
    if (!App.screens[name]) name = 'home';
    current = name;
    document.querySelectorAll('#nav a').forEach(function (a) {
      var n = a.dataset.nav;
      a.classList.toggle('on', n === name || (n === 'games' && name === 'game') || (n === 'map' && name === 'country'));
    });
    document.body.dataset.screen = name;
    main.innerHTML = '';
    main.scrollTop = 0; window.scrollTo(0, 0);
    App.screens[name](main, parts.slice(1).map(decodeURIComponent));
  }
  window.addEventListener('hashchange', function () {
    App.prevRoute = lastHash; lastHash = location.hash;
    document.getElementById('modal-root').innerHTML = '';
    route();
  });
  var rt;
  var lastW = window.innerWidth, lastH = window.innerHeight;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      // only redraw map screens when the size really changed
      if ((current === 'map' || current === 'size') && (Math.abs(window.innerWidth - lastW) > 60 || Math.abs(window.innerHeight - lastH) > 60)) route();
      lastW = window.innerWidth; lastH = window.innerHeight;
    }, 300);
  });

  document.getElementById('btn-help').addEventListener('click', function () {
    var hp = HELP[current] || HELP.home;
    App.modal('<h2>' + hp[0] + '</h2><p class="helptext">' + hp[1] + '</p>' +
      '<div class="navguide"><b>下の ボタン：</b><span>🏠 ホーム</span><span>🗺️ ちずで さがす</span><span>📏 大きさ くらべ</span><span>🎮 ゲーム</span><span>🛂 パスポート</span></div>' +
      '<div class="row"><button class="btn ghost" id="tut2">はじめの 説明を もう一度</button><button class="btn primary" data-close>わかった！</button></div>');
    document.getElementById('tut2').addEventListener('click', App.showTutorial);
  });
  var sb = document.getElementById('btn-sound');
  function soundIcon() { sb.textContent = App.soundOn ? '🔊' : '🔇'; }
  sb.addEventListener('click', function () { App.soundOn = !App.soundOn; App.save.sound = App.soundOn; App.persist(); soundIcon(); App.sfx.tap(); });
  soundIcon();

  // ---------- first-time guide ----------
  var SLIDES = [
    ['🌏', 'ようこそ！', '日本と 世界の 国を くらべる アプリだよ。<br>大きさ・時間・あいさつ・食べ物… 日本と どこが ちがうかな？'],
    ['👇', '下の ボタンで いどう', 'いつでも 画面の 下の ボタンで 行きたい ところへ 行けるよ。<br>🏠 ホーム ・ 🗺️ ちず ・ 📏 大きさ ・ 🎮 ゲーム ・ 🛂 パスポート'],
    ['🗺️', '国を えらぼう', 'ちずの 国を タッチすると、日本と くらべられるよ。<br>★ の 国は とくに くわしく 見られる 国！'],
    ['🛂', 'スタンプを あつめよう', '国の ページの さいごに ある 🎯 チャレンジに せいかいすると、パスポートに スタンプが おされるよ。<br>こまったら 右上の ❓ を おしてね。'],
  ];
  App.showTutorial = function () {
    var i = 0;
    var m = App.modal('<div class="tut"></div>', { cls: 'center tutorial', locked: true });
    function draw() {
      var s = SLIDES[i];
      m.el.querySelector('.tut').innerHTML = '<div class="tut-ico">' + s[0] + '</div><h2>' + s[1] + '</h2><p>' + s[2] + '</p>' +
        '<div class="dots">' + SLIDES.map(function (_, j) { return '<i class="' + (j === i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="row">' + (i > 0 ? '<button class="btn ghost" id="tb">◀ もどる</button>' : '<button class="btn ghost" id="skip">とばす</button>') +
        '<button class="btn primary" id="tn">' + (i < SLIDES.length - 1 ? 'つぎへ ▶' : 'はじめる 🚀') + '</button></div>';
      var tb = m.el.querySelector('#tb'), sk = m.el.querySelector('#skip');
      if (tb) tb.addEventListener('click', function () { i--; draw(); });
      if (sk) sk.addEventListener('click', done);
      m.el.querySelector('#tn').addEventListener('click', function () { if (i < SLIDES.length - 1) { i++; draw(); App.sfx.tap(); } else done(); });
    }
    function done() { App.save.tutorial = true; App.persist(); m.close(); }
    draw();
  };

  // ---------- badges ----------
  App.checkNewBadges = function () {
    var st = App.stampStats();
    App.save.badges = App.save.badges || {};
    App.BADGES.forEach(function (b) {
      if (b.test(st) && !App.save.badges[b.id]) {
        App.save.badges[b.id] = 1; App.persist();
        setTimeout(function () { App.toast('🏅 バッジ ゲット！「' + b.name + '」'); }, 1200);
      }
    });
  };

  route();
  if (!App.save.tutorial) App.showTutorial();
})();
