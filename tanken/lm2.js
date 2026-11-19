/* Detailed landmarks, batch 2: Taj Mahal, Colosseum, St Basil's Cathedral, Great Wall,
   Sydney Opera House, Leaning Tower of Pisa, Christ the Redeemer, Golden Gate Bridge. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex;
  var D2 = Math.PI * 2, UP = new T.Vector3(0, 1, 0);
  function cypress(g, x, z, s) { var c = new T.Mesh(new T.ConeGeometry(0.02 * s, 0.14 * s, 6), solid('#2f6b3a', { flatShading: true })); c.position.set(x, 0.07 * s, z); g.add(c); }
  function between(g, m, a, b, r) { // thin rod from point a to b
    var d = new T.Vector3().subVectors(b, a), c = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), 5), m); c.quaternion.setFromUnitVectors(UP, d.clone().normalize()); c.position.copy(a).addScaledVector(d, 0.5); g.add(c); return c;
  }

  /* ---------- Taj Mahal ---------- */
  M.custom.taj = function () {
    var g = new T.Group(), w = '#f6f1e8', white = solid(w), shade = solid('#e7ded0');
    var iwan = tex('iwan', 64, 64, function (x, W, H) { x.fillStyle = w; x.fillRect(0, 0, W, H); x.strokeStyle = '#d8ccb4'; x.lineWidth = 3; x.strokeRect(6, 4, W - 12, H - 6); x.fillStyle = '#c9bca2'; x.beginPath(); x.moveTo(16, H); x.lineTo(16, 30); x.quadraticCurveTo(32, 6, 48, 30); x.lineTo(48, H); x.fill(); x.fillStyle = '#8d8270'; x.beginPath(); x.moveTo(21, H); x.lineTo(21, 34); x.quadraticCurveTo(32, 16, 43, 34); x.lineTo(43, H); x.fill(); x.fillStyle = '#4a4438'; x.fillRect(27, 44, 10, 20); });
    // red sandstone ground, garden, long pool and cypress rows
    blob(g, '#b9583f', 0.66, 0.62, 0, 0, 0.006, 2);
    box(g, solid('#6cb85a'), 0.5, 0.01, 0.62, 0, 0, 0.62);
    box(g, solid('#4fa6e0', { emissive: 0x0a2a40 }), 0.06, 0.016, 0.6, 0, 0, 0.62);
    for (var i = 0; i < 7; i++) { cypress(g, 0.07, 0.36 + i * 0.075, 0.9); cypress(g, -0.07, 0.36 + i * 0.075, 0.9); }
    box(g, mat(stoneTex('tajplat', '#efe8db', '#d9cfbe', 16, 16), 4, 4), 0.86, 0.07, 0.86, 0, 0, 0);
    // main building with chamfered corners and arched niches
    var body = new T.Mesh(new T.CylinderGeometry(0.29, 0.29, 0.3, 8), mat(iwan, 8, 2)); body.rotation.y = Math.PI / 8; body.position.y = 0.07 + 0.15; g.add(body);
    box(g, mat(iwan, 1, 1), 0.2, 0.32, 0.03, 0, 0.07, 0.27);
    box(g, white, 0.42, 0.015, 0.42, 0, 0.37, 0).rotation.y = Math.PI / 4;
    // drum + onion dome + finial
    cyl(g, white, 0.12, 0.125, 0.07, 0, 0.385, 0, 20);
    var dome = lathe([[0, 0], [0.125, 0], [0.155, 0.05], [0.162, 0.1], [0.145, 0.16], [0.1, 0.22], [0.05, 0.26], [0.015, 0.285], [0, 0.29]], 24, white); dome.position.y = 0.455; g.add(dome);
    cyl(g, solid('#d8ad4c'), 0.003, 0.012, 0.09, 0, 0.74, 0, 8);
    // four chattris around the dome
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) {
      var x = q[0] * 0.17, z = q[1] * 0.17; for (var k = 0; k < 4; k++) cyl(g, white, 0.006, 0.006, 0.06, x + (k % 2 ? 0.025 : -0.025), 0.37, z + (k < 2 ? 0.025 : -0.025), 5);
      var cd = lathe([[0, 0], [0.04, 0], [0.042, 0.02], [0.025, 0.045], [0, 0.055]], 12, white); cd.position.set(x, 0.43, z); g.add(cd);
    });
    // four minarets
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) {
      var x = q[0] * 0.39, z = q[1] * 0.39; cyl(g, white, 0.022, 0.032, 0.5, x, 0.07, z, 10);
      [0.22, 0.4, 0.57].forEach(function (y) { cyl(g, shade, 0.04, 0.036, 0.016, x, y, z, 10); });
      for (var k = 0; k < 6; k++) { var a = k / 6 * D2; cyl(g, white, 0.004, 0.004, 0.04, x + Math.cos(a) * 0.026, 0.586, z + Math.sin(a) * 0.026, 4); }
      var cd = lathe([[0, 0], [0.036, 0], [0.034, 0.02], [0.018, 0.04], [0, 0.05]], 12, white); cd.position.set(x, 0.625, z); g.add(cd);
    });
    // red sandstone mosque and guest house either side
    [-0.56, 0.56].forEach(function (x) { box(g, solid('#b5523b'), 0.12, 0.12, 0.34, x, 0, -0.05); [-0.1, 0, 0.1].forEach(function (z) { var d = lathe([[0, 0], [0.035, 0], [0.033, 0.025], [0, 0.045]], 10, white); d.position.set(x, 0.12, -0.05 + z); g.add(d); }); });
    return g;
  };

  /* ---------- Colosseum ---------- */
  M.custom.colosseum = function () {
    var g = new T.Group();
    var arches = tex('colarch', 64, 64, function (x, W, H) {
      x.fillStyle = '#dcc79c'; x.fillRect(0, 0, W, H);
      for (var r = 0; r < 3; r++) { var y = 4 + r * 16; x.fillStyle = '#b9a276'; x.fillRect(0, y - 2, W, 2); for (var c = 0; c < 4; c++) { var cx = 8 + c * 16; x.fillStyle = '#5a4a36'; x.fillRect(cx - 5, y + 4, 10, 10); x.beginPath(); x.arc(cx, y + 4, 5, Math.PI, 0); x.fill(); x.fillStyle = '#c9b182'; x.fillRect(cx + 6, y, 3, 14); } }
      x.fillStyle = '#d2bc8f'; x.fillRect(0, 50, W, 14); for (var k = 0; k < 4; k++) { x.fillStyle = '#7a6448'; x.fillRect(6 + k * 16, 54, 4, 5); }
      for (var i = 0; i < 90; i++) { x.fillStyle = 'rgba(80,60,30,.12)'; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    });
    var tiers = tex('colseat', 64, 64, function (x, W, H) { for (var y = 0; y < H; y += 4) { x.fillStyle = y % 8 ? '#bfa77b' : '#a68e63'; x.fillRect(0, y, W, 4); } for (var k = 0; k < W; k += 8) { x.fillStyle = 'rgba(70,50,30,.25)'; x.fillRect(k, 0, 1, H); } });
    var sq = 0.78, root = new T.Group(); root.scale.z = sq; g.add(root);
    var full = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.36, 48, 1, true, -1.2, 3.8), mat(arches, 13, 1, { side: T.DoubleSide })); full.position.y = 0.18; root.add(full);
    var broken = new T.Mesh(new T.CylinderGeometry(0.47, 0.47, 0.26, 24, 1, true, 2.6, D2 - 3.8), mat(arches, 8, 0.75, { side: T.DoubleSide })); broken.position.y = 0.13; root.add(broken);
    var inner = new T.Mesh(new T.CylinderGeometry(0.47, 0.27, 0.27, 48, 1, true), mat(tiers, 24, 6, { side: T.DoubleSide })); inner.position.y = 0.14; root.add(inner);
    var floor = new T.Mesh(new T.CylinderGeometry(0.27, 0.27, 0.02, 32), solid('#d9c08a')); floor.position.y = 0.01; root.add(floor);
    // hypogeum: the maze of walls under the arena floor
    for (var i = -3; i <= 3; i++) { var b = new T.Mesh(new T.BoxGeometry(0.4, 0.03, 0.012), solid('#a6875a')); b.position.set(0, 0.03, i * 0.05); root.add(b); }
    blob(g, '#c9c3b5', 0.66, 0.56, 0, 0, 0.006, 8);
    [[0.6, 0.35], [-0.62, 0.3], [0.58, -0.4]].forEach(function (q) { var p = new T.Mesh(new T.SphereGeometry(0.05, 7, 5), solid('#4f8f45', { flatShading: true })); p.scale.y = 0.6; p.position.set(q[0], 0.11, q[1]); g.add(p); cyl(g, solid('#7a5a3a'), 0.007, 0.01, 0.1, q[0], 0, q[1], 5); });
    return g;
  };

  /* ---------- St Basil's Cathedral ---------- */
  M.custom.onion = function () {
    var g = new T.Group();
    function stripes(key, a, b, kind) {
      return tex(key, 64, 64, function (x, W, H) {
        x.fillStyle = a; x.fillRect(0, 0, W, H); x.fillStyle = b;
        if (kind === 'spiral') for (var i = -64; i < 128; i += 16) { x.beginPath(); x.moveTo(i, H); x.lineTo(i + 8, H); x.lineTo(i + 40, 0); x.lineTo(i + 32, 0); x.fill(); }
        else if (kind === 'zig') for (var y = 0; y < H; y += 12) { x.beginPath(); for (var k = 0; k <= W; k += 8) x.lineTo(k, y + (k / 8 % 2 ? 6 : 0)); x.lineTo(W, y + 4); for (var k2 = W; k2 >= 0; k2 -= 8) x.lineTo(k2, y + 4 + (k2 / 8 % 2 ? 6 : 0)); x.fill(); }
        else if (kind === 'diamond') for (var yy = 0; yy < H; yy += 16) for (var xx = 0; xx < W; xx += 16) { x.beginPath(); x.moveTo(xx + 8, yy); x.lineTo(xx + 16, yy + 8); x.lineTo(xx + 8, yy + 16); x.lineTo(xx, yy + 8); x.fill(); }
        else for (var j = 0; j < W; j += 16) x.fillRect(j, 0, 8, H);
      });
    }
    var brick = mat(tex('sbbrick', 64, 64, function (x, W, H) { x.fillStyle = '#b5432d'; x.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 16) { x.fillStyle = '#f2e6d0'; x.fillRect(0, y, W, 3); } for (var k = 4; k < W; k += 16) { x.fillStyle = '#8a2f20'; x.fillRect(k, 6, 7, 8); x.beginPath(); x.arc(k + 3.5, 6, 3.5, Math.PI, 0); x.fill(); } }), 4, 2);
    box(g, brick, 0.64, 0.12, 0.64, 0, 0, 0).rotation.y = Math.PI / 4;
    box(g, solid('#f2e6d0'), 0.66, 0.015, 0.66, 0, 0.12, 0).rotation.y = Math.PI / 4;
    // central tent tower
    var tower = new T.Mesh(new T.CylinderGeometry(0.075, 0.09, 0.42, 8), brick); tower.position.y = 0.12 + 0.21; g.add(tower);
    cyl(g, mat(tex('sbarch', 32, 32, function (x) { x.fillStyle = '#f2e6d0'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#b5432d'; x.beginPath(); x.arc(16, 32, 12, Math.PI, 0); x.fill(); }), 8, 1), 0.095, 0.09, 0.05, 0, 0.54, 0, 8);
    var tent = new T.Mesh(new T.CylinderGeometry(0.0, 0.1, 0.32, 8), mat(stripes('sbtent', '#f2e6d0', '#c9442f', 'diamond'), 3, 4)); tent.position.y = 0.59 + 0.16; g.add(tent);
    var dc = lathe([[0, 0], [0.03, 0], [0.04, 0.025], [0.025, 0.055], [0, 0.07]], 12, solid('#d8ad4c')); dc.position.y = 0.9; g.add(dc);
    cyl(g, solid('#d8ad4c'), 0.003, 0.003, 0.06, 0, 0.96, 0, 5);
    // eight towers with patterned onion domes
    var looks = [['#2f9e5a', '#f2d24a', 'spiral'], ['#e8473a', '#ffffff', 'spiral'], ['#2b7de0', '#ffffff', 'spiral'], ['#2f9e5a', '#e8473a', 'zig'], ['#f2d24a', '#2f9e5a', 'diamond'], ['#e8473a', '#f2d24a', 'zig'], ['#7cc1e8', '#ffffff', 'stripe'], ['#2f9e5a', '#ffffff', 'diamond']];
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * D2, big = i % 2 === 0, r = big ? 0.25 : 0.19, x = Math.cos(a) * r, z = Math.sin(a) * r, h = big ? 0.3 : 0.2, rad = big ? 0.06 : 0.045;
      var tw = new T.Mesh(new T.CylinderGeometry(rad, rad * 1.05, h, 8), brick); tw.position.set(x, 0.12 + h / 2, z); g.add(tw);
      cyl(g, solid('#f2e6d0'), rad * 1.15, rad * 1.1, 0.015, x, 0.12 + h, z, 10);
      var L = looks[i], s = rad / 0.06;
      var on = lathe([[0, 0], [0.04 * s, 0], [0.07 * s, 0.035 * s], [0.075 * s, 0.06 * s], [0.055 * s, 0.1 * s], [0.02 * s, 0.135 * s], [0.004 * s, 0.16 * s], [0, 0.165 * s]], 16, mat(stripes('sbd' + i, L[0], L[1], L[2]), 2, 1));
      on.position.set(x, 0.135 + h, z); g.add(on);
      cyl(g, solid('#d8ad4c'), 0.002, 0.003, 0.05, x, 0.135 + h + 0.16 * s, z, 4);
      box(g, solid('#d8ad4c'), 0.02, 0.003, 0.003, x, 0.135 + h + 0.18 * s, z);
    }
    // Red Square paving
    blob(g, '#a7a39c', 0.66, 0.6, 0, 0, 0.006, 3);
    return g;
  };

  /* ---------- Great Wall of China ---------- */
  M.custom.wall = function () {
    var g = new T.Group();
    function path(t) { return [-0.6 + t * 1.2, 0.25 * Math.sin(t * 5.5 + 0.6) - 0.05]; }
    function ridge(x, z) { var best = 9; for (var i = 0; i <= 40; i++) { var p = path(i / 40), d = Math.hypot(x - p[0], z - p[1]); if (d < best) best = d; } return best; }
    function height(x, z) { return 0.2 * Math.exp(-Math.pow(ridge(x, z), 2) / 0.02) * (0.7 + 0.5 * noise(x * 4, z * 4)) + 0.03 * noise(x * 9 + 3, z * 9); }
    var pg = new T.PlaneGeometry(1.3, 1.1, 30, 26); pg.rotateX(-Math.PI / 2); var pp = pg.attributes.position;
    for (var i = 0; i < pp.count; i++) { var x = pp.getX(i), z = pp.getZ(i), edge = Math.max(0, Math.min(1, (0.62 - Math.max(Math.abs(x) / 1.3 * 1.1, Math.abs(z) / 1.1 * 1.1)) * 6)); pp.setY(i, height(x, z) * edge); }
    var hills = paintVerts(pg, function (x, y, z) { return y > 0.14 ? '#7a9a5a' : (noise(x * 12, z * 12) > 0.55 ? '#5fa04e' : '#6db25a'); });
    g.add(new T.Mesh(hills, vcMat));
    var wallM = mat(stoneTex('gwall', '#c9b48a', '#a8946c', 12, 6), 4, 1), top = solid('#b8a37a'), towerM = mat(stoneTex('gtower', '#bfa983', '#9c8862', 10, 6), 2, 2);
    var N = 36, prev = null;
    for (var k = 0; k <= N; k++) {
      var t = k / N, p = path(t), y = height(p[0], p[1]) + 0.04, cur = new T.Vector3(p[0], y, p[1]);
      if (prev) {
        var d = new T.Vector3().subVectors(cur, prev), len = d.length(), seg = new T.Mesh(new T.BoxGeometry(len + 0.01, 0.06, 0.06), wallM);
        seg.position.copy(prev).addScaledVector(d, 0.5); seg.position.y -= 0.02; seg.rotation.order = 'YZX'; seg.rotation.y = -Math.atan2(d.z, d.x); seg.rotation.z = Math.atan2(d.y, Math.hypot(d.x, d.z)); g.add(seg);
        var walk = new T.Mesh(new T.BoxGeometry(len + 0.01, 0.006, 0.048), top); walk.position.copy(seg.position); walk.position.y += 0.031; walk.rotation.copy(seg.rotation); g.add(walk);
        [0.027, -0.027].forEach(function (o) { var m = new T.Mesh(new T.BoxGeometry(len * 0.5, 0.016, 0.008), wallM); m.position.copy(seg.position); m.rotation.copy(seg.rotation); m.position.y += 0.04; m.translateZ(o); g.add(m); });
      }
      if (k % 6 === 0) { box(g, towerM, 0.09, 0.12, 0.09, p[0], y - 0.06, p[1]); for (var c = 0; c < 4; c++) box(g, towerM, 0.022, 0.02, 0.022, p[0] + (c % 2 ? 0.034 : -0.034), y + 0.06, p[1] + (c < 2 ? 0.034 : -0.034)); box(g, solid('#3b3226'), 0.02, 0.03, 0.002, p[0], y - 0.01, p[1] + 0.046); }
      prev = cur;
    }
    for (var j = 0; j < 14; j++) { var tx = (hash(j, 9) - 0.5) * 1.1, tz = (hash(j, 4) - 0.5) * 0.9; if (ridge(tx, tz) < 0.12) continue; var p2 = new T.Vector3(tx, height(tx, tz), tz); var tr = new T.Mesh(new T.ConeGeometry(0.035, 0.1, 6), solid('#3f7f45', { flatShading: true })); tr.position.set(tx, p2.y + 0.05, tz); g.add(tr); }
    return g;
  };

  /* ---------- Sydney Opera House ---------- */
  M.custom.opera = function () {
    var g = new T.Group();
    var tiles = tex('optile', 64, 64, function (x, W, H) { x.fillStyle = '#f7f5ef'; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(180,170,150,.55)'; x.lineWidth = 1; for (var i = -64; i < 128; i += 8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 32, H); x.stroke(); x.beginPath(); x.moveTo(i + 32, 0); x.lineTo(i, H); x.stroke(); } });
    var shellM = mat(tiles, 3, 3, { side: T.DoubleSide }), podium = solid('#d6b49a');
    blob(g, '#3f9edb', 0.7, 0.62, 0, 0, 0.006, 4);
    box(g, podium, 0.8, 0.07, 0.42, 0, 0, -0.02);
    for (var s = 0; s < 6; s++) box(g, solid(s % 2 ? '#e0c2aa' : '#cfac90'), 0.3, 0.012, 0.02, 0.1, 0.07 - s * 0.012, 0.19 + s * 0.02);
    box(g, solid('#c9a78c'), 0.74, 0.03, 0.34, 0, 0.07, -0.02);
    function shell(S, x, z, back) { // curved triangular sail: apex leans back, belly bulges forward
      var n = 12, pos = [], idx = [], w = 0.32 * S / 0.3, h = 0.34 * S / 0.3, d = 0.2 * S / 0.3, b = 0.08 * S / 0.3;
      for (var j = 0; j <= n; j++) for (var i = 0; i <= n; i++) { var u = i / n, v = j / n; pos.push((u - 0.5) * w * (1 - v), h * Math.sin(v * Math.PI / 2), -d * v * v + b * Math.sin(Math.PI * u) * (1 - v) * 0.7 + b * 0.4 * Math.sin(Math.PI * v)); }
      for (var j2 = 0; j2 < n; j2++) for (var i2 = 0; i2 < n; i2++) { var a = j2 * (n + 1) + i2; idx.push(a, a + 1, a + n + 1, a + 1, a + n + 2, a + n + 1); }
      var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setIndex(idx);
      var uv = []; for (var k = 0; k < pos.length / 3; k++) uv.push(pos[k * 3] * 3, pos[k * 3 + 1] * 3); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geo.computeVertexNormals();
      var m = new T.Mesh(geo, shellM); m.position.set(x, 0.1, z); m.rotation.y = back ? -Math.PI / 2 : Math.PI / 2; g.add(m);
    }
    // two halls of interlocking sails plus the small restaurant
    [[0.3, 0.34, false], [0.25, 0.2, false], [0.19, 0.08, false], [0.14, -0.13, true]].forEach(function (q) { shell(q[0], q[1], -0.09, q[2]); });
    [[0.26, 0.3, false], [0.21, 0.17, false], [0.16, 0.06, false], [0.12, -0.11, true]].forEach(function (q) { shell(q[0], q[1], 0.1, q[2]); });
    [[0.11, -0.27, false], [0.08, -0.37, true]].forEach(function (q) { shell(q[0], q[1], 0.0, q[2]); });
    g.rotation.y = 0;
    return g;
  };

  /* ---------- Leaning Tower of Pisa (+ cathedral) ---------- */
  M.custom.pisa = function () {
    var g = new T.Group();
    var arcade = tex('pisarc', 64, 64, function (x, W, H) { x.fillStyle = '#f4efe2'; x.fillRect(0, 0, W, H); x.fillStyle = '#cfc5ad'; x.fillRect(0, 0, W, 4); x.fillRect(0, H - 4, W, 4); for (var c = 0; c < 4; c++) { var cx = 8 + c * 16; x.fillStyle = '#6f675a'; x.fillRect(cx - 5, 18, 10, 42); x.beginPath(); x.arc(cx, 18, 5, Math.PI, 0); x.fill(); x.fillStyle = '#ffffff'; x.fillRect(cx + 6, 8, 3, 52); } });
    var lawn = blob(g, '#6cbf5c', 0.7, 0.62, 0, 0, 0.008, 2);
    var tower = new T.Group(); g.add(tower); tower.position.set(0.22, 0, 0.05);
    var lvls = 7, h = 0.11;
    cyl(tower, mat(tex('pisbase', 64, 64, function (x, W, H) { x.fillStyle = '#efe9da'; x.fillRect(0, 0, W, H); for (var c = 0; c < 4; c++) { x.fillStyle = '#d8ceb6'; x.beginPath(); x.arc(8 + c * 16, 26, 6, Math.PI, 0); x.fill(); x.fillRect(2 + c * 16, 26, 12, 34); } }), 8, 1), 0.12, 0.125, h, 0, 0, 0, 24);
    for (var i = 1; i < lvls; i++) { cyl(tower, mat(arcade, 10, 1), 0.122, 0.122, h, 0, i * h, 0, 24); cyl(tower, solid('#e2d9c2'), 0.132, 0.132, 0.012, 0, i * h - 0.006, 0, 24); cyl(tower, solid('#7a7060'), 0.112, 0.112, h, 0, i * h, 0, 16); }
    cyl(tower, solid('#e2d9c2'), 0.132, 0.132, 0.012, 0, lvls * h - 0.006, 0, 24);
    cyl(tower, mat(arcade, 6, 1), 0.08, 0.08, 0.08, 0, lvls * h, 0, 16);
    cyl(tower, solid('#d8cbb0'), 0.088, 0.085, 0.012, 0, lvls * h + 0.08, 0, 16);
    tower.rotation.z = -0.09; tower.rotation.x = 0.03;
    // the cathedral (Duomo) beside it
    var marble = mat(tex('duomo', 64, 64, function (x, W, H) { for (var y = 0; y < H; y += 6) { x.fillStyle = y % 12 ? '#f4efe2' : '#9c9a94'; x.fillRect(0, y, W, 6); } for (var c = 0; c < 4; c++) { x.fillStyle = '#6f675a'; x.fillRect(5 + c * 16, 20, 6, 22); x.beginPath(); x.arc(8 + c * 16, 20, 3, Math.PI, 0); x.fill(); } }), 6, 1);
    box(g, marble, 0.56, 0.14, 0.16, -0.2, 0, -0.18); box(g, marble, 0.14, 0.13, 0.36, -0.16, 0, -0.18);
    var rf = new T.Mesh(new T.CylinderGeometry(0.0, 0.11, 0.06, 4), solid('#b9a690')); rf.rotation.y = Math.PI / 4; rf.scale.set(2.6, 1, 0.75); rf.position.set(-0.2, 0.17, -0.18); g.add(rf);
    var dm = lathe([[0, 0], [0.06, 0], [0.06, 0.03], [0.04, 0.07], [0, 0.085]], 14, solid('#d4c6aa')); dm.position.set(-0.16, 0.14, -0.18); g.add(dm);
    var bapt = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.12, 20), marble); bapt.position.set(-0.5, 0.06, -0.18); g.add(bapt);
    var bd = lathe([[0, 0], [0.09, 0], [0.07, 0.05], [0.03, 0.09], [0, 0.1]], 16, solid('#c7b99e')); bd.position.set(-0.5, 0.12, -0.18); g.add(bd);
    return g;
  };

  /* ---------- Christ the Redeemer on Corcovado ---------- */
  M.custom.christ = function () {
    var g = new T.Group(), pts = [];
    for (var i = 0; i <= 18; i++) { var t = i / 18; pts.push(new T.Vector2(0.06 + 0.55 * Math.pow(1 - t, 1.4), t * 0.58)); }
    pts.push(new T.Vector2(0, 0.58));
    var geo = new T.LatheGeometry(pts, 26), pp = geo.attributes.position;
    for (var k = 0; k < pp.count; k++) { var x = pp.getX(k), y = pp.getY(k), z = pp.getZ(k), a = Math.atan2(z, x), d = 1 + (noise(a * 3, y * 6) - 0.5) * 0.35 + (a > 0.5 && a < 2 ? 0.15 : 0); if (Math.hypot(x, z) > 0.001) pp.setXYZ(k, x * d, y, z * d); }
    g.add(new T.Mesh(paintVerts(geo, function (x, y, z) { var steep = noise(Math.atan2(z, x) * 4, y * 8); return y > 0.45 && steep > 0.45 ? '#8c8a84' : (steep > 0.7 ? '#9a978e' : (y < 0.1 ? '#4e9a52' : '#3f8a48')); }), vcMat));
    var w = solid('#ecebe6');
    box(g, solid('#c9c6bc'), 0.12, 0.03, 0.12, 0, 0.565, 0);
    box(g, w, 0.07, 0.08, 0.07, 0, 0.595, 0);
    var robe = lathe([[0, 0], [0.042, 0], [0.036, 0.12], [0.03, 0.2], [0.034, 0.24], [0.02, 0.26], [0, 0.265]], 12, w); robe.position.y = 0.675; g.add(robe);
    box(g, w, 0.34, 0.035, 0.035, 0, 0.885, 0);
    [-1, 1].forEach(function (s) { box(g, w, 0.018, 0.04, 0.018, s * 0.17, 0.865, 0.002); });
    var head = new T.Mesh(new T.SphereGeometry(0.024, 10, 8), w); head.position.set(0, 0.96, 0.004); g.add(head);
    blob(g, '#3f9edb', 0.66, 0.4, 0.05, 0.42, 0.006, 6);
    var sugar = new T.Mesh(new T.SphereGeometry(0.1, 10, 8), solid('#8f8b80', { flatShading: true })); sugar.scale.set(0.8, 1.5, 0.8); sugar.position.set(0.5, 0.05, 0.42); g.add(sugar);
    return g;
  };

  /* ---------- Golden Gate Bridge ---------- */
  M.custom.goldengate = function () {
    var g = new T.Group(), red = solid('#c0392b'), redD = solid('#9e2e22'), L = 1.25, TX = 0.33, TH = 0.62, DY = 0.2;
    blob(g, '#3f9edb', 0.72, 0.5, 0, 0, 0.006, 5);
    [-1, 1].forEach(function (s) { var h = new T.Mesh(new T.SphereGeometry(0.2, 10, 7), solid(s < 0 ? '#5fa04e' : '#7aa85a', { flatShading: true })); h.scale.set(1.3, 0.55, 1.5); h.position.set(s * 0.68, 0.0, 0.05); g.add(h); });
    // deck with truss sides
    var truss = tex('ggtruss', 64, 16, function (x, W, H) { x.fillStyle = '#c0392b'; x.fillRect(0, 0, W, H); x.strokeStyle = '#8a281e'; x.lineWidth = 1.5; for (var i = 0; i < W; i += 8) { x.beginPath(); x.moveTo(i, 2); x.lineTo(i + 4, H - 2); x.lineTo(i + 8, 2); x.stroke(); } });
    box(g, mat(truss, 20, 1), L, 0.035, 0.1, 0, DY, 0);
    box(g, solid('#4a4a4a'), L, 0.006, 0.09, 0, DY + 0.035, 0);
    // towers: two legs with stepped portal struts
    [-TX, TX].forEach(function (x) {
      [-0.04, 0.04].forEach(function (z) { box(g, red, 0.035, TH, 0.03, x, 0, z); box(g, redD, 0.042, 0.02, 0.036, x, TH * 0.5, z); });
      [0.26, 0.38, 0.48, 0.57].forEach(function (y, i) { box(g, red, 0.03, 0.03 - i * 0.003, 0.11, x, y, 0); });
      box(g, red, 0.05, 0.03, 0.12, x, TH - 0.01, 0);
      box(g, solid('#d6d0c4'), 0.08, 0.05, 0.14, x, 0, 0);
    });
    // main cables (sagging curve) and hangers
    [-0.042, 0.042].forEach(function (z) {
      var pts = [], seg = function (x0, y0, x1, y1, sag, n) { for (var i = 0; i <= n; i++) { var t = i / n; pts.push(new T.Vector3(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - sag * 4 * t * (1 - t), z)); } };
      seg(-L / 2, DY + 0.04, -TX, TH - 0.01, 0.03, 6); pts.pop(); seg(-TX, TH - 0.01, TX, TH - 0.01, 0.37, 18); pts.pop(); seg(TX, TH - 0.01, L / 2, DY + 0.04, 0.03, 6);
      var tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, 0.005, 5, false), red); g.add(tube);
      pts.forEach(function (p, i) { if (i % 2 === 0 && p.y > DY + 0.05) between(g, redD, new T.Vector3(p.x, DY + 0.035, z), p, 0.0015); });
    });
    return g;
  };
})();
