/* Detailed landmarks, batch 3: Sagrada Família, Brandenburg Gate, Neuschwanstein, Kinderdijk windmills,
   Parthenon, Blue Mosque, Kilimanjaro, Table Mountain, Everest, Stonehenge, Burj Khalifa, Ger, Uluru. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex;
  var D2 = Math.PI * 2;

  // A natural mountain: lathe profile r(t) (t = 0 base .. 1 top), bumpy, coloured by colour(x, y, z, a)
  function mountain(g, opt) {
    var pts = [], n = opt.rings || 20;
    for (var i = 0; i <= n; i++) { var t = i / n; pts.push(new T.Vector2(opt.r(t), t * opt.h)); }
    pts.push(new T.Vector2(0, opt.h));
    var geo = new T.LatheGeometry(pts, opt.seg || 36), p = geo.attributes.position;
    for (var k = 0; k < p.count; k++) { var x = p.getX(k), y = p.getY(k), z = p.getZ(k), rr = Math.hypot(x, z); if (rr < 0.0005) continue; var a = Math.atan2(z, x), d = 1 + (noise(a * (opt.f || 3) + (opt.seed || 0), y * 8) - 0.5) * (opt.bump || 0.25); p.setXYZ(k, x * d * (opt.sx || 1), y + (noise(a * 6, rr * 9) - 0.5) * (opt.jag || 0.02), z * d * (opt.sz || 1)); }
    var m = new T.Mesh(paintVerts(geo, opt.colour), vcMat); if (opt.pos) m.position.set(opt.pos[0], 0, opt.pos[1]); g.add(m); return m;
  }
  K.mountain = mountain;
  function acacia(g, x, z, s) { cyl(g, solid('#7a5a3a'), 0.006 * s, 0.009 * s, 0.09 * s, x, 0, z, 5); var c = new T.Mesh(new T.SphereGeometry(0.06 * s, 8, 5), solid('#6f9a3a', { flatShading: true })); c.scale.y = 0.3; c.position.set(x, 0.095 * s, z); g.add(c); }
  K.acacia = acacia;
  function prism(g, m, w, h, d, x, y, z) { var sh = new T.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(0, h); sh.lineTo(-w / 2, 0); var e = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }), m); e.position.set(x, y, z - d / 2); g.add(e); return e; }
  K.prism = prism;

  /* ---------- Sagrada Família ---------- */
  M.custom.sagrada = function () {
    var g = new T.Group(), stone = '#d9c39a';
    var gothic = tex('sfwin', 64, 64, function (x, W, H) { x.fillStyle = stone; x.fillRect(0, 0, W, H); for (var c = 0; c < 4; c++) { var cx = 8 + c * 16; x.fillStyle = '#7a6a52'; x.beginPath(); x.moveTo(cx - 5, 56); x.lineTo(cx - 5, 22); x.quadraticCurveTo(cx, 8, cx + 5, 22); x.lineTo(cx + 5, 56); x.fill(); x.fillStyle = '#c9b183'; x.fillRect(cx - 0.5, 18, 1, 38); } for (var i = 0; i < 80; i++) { x.fillStyle = 'rgba(90,70,40,.15)'; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); } });
    var holes = tex('sfspire', 32, 64, function (x, W, H) { x.fillStyle = '#d4bd92'; x.fillRect(0, 0, W, H); for (var y = 2; y < H; y += 7) for (var k = (y % 2) * 4; k < W; k += 8) { x.fillStyle = '#6e5d45'; x.fillRect(k, y, 3, 4); } });
    blob(g, '#c9c3b5', 0.66, 0.56, 0, 0, 0.006, 3);
    box(g, mat(gothic, 6, 2), 0.62, 0.28, 0.24, 0, 0, -0.02);
    box(g, mat(gothic, 3, 2), 0.2, 0.3, 0.5, 0, 0, -0.02);
    var rf = new T.Mesh(new T.CylinderGeometry(0, 0.2, 0.12, 4), solid('#c2ab80')); rf.rotation.y = Math.PI / 4; rf.scale.set(2.2, 1, 0.85); rf.position.set(0, 0.34, -0.02); g.add(rf);
    function spire(x, z, r, h, top) {
      var s = lathe([[r, 0], [r * 0.97, h * 0.45], [r * 0.85, h * 0.7], [r * 0.55, h * 0.88], [r * 0.2, h * 0.97], [0, h]], 12, mat(holes, 3, 6)); s.position.set(x, 0, z); g.add(s);
      var f = new T.Mesh(new T.SphereGeometry(r * 0.45, 8, 6), solid(top || '#e8473a', { flatShading: true })); f.position.set(x, h + r * 0.3, z); g.add(f);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (q) { var b = new T.Mesh(new T.SphereGeometry(r * 0.18, 6, 4), solid('#ffffff')); b.position.set(x + q[0] * r * 0.4, h + r * 0.3 + q[1] * 0, z + q[1] * r * 0.4); g.add(b); });
    }
    [-0.22, -0.08, 0.08, 0.22].forEach(function (x, i) { spire(x, 0.13, 0.045, i === 1 || i === 2 ? 0.78 : 0.68, '#f2c14e'); });
    [-0.22, -0.08, 0.08, 0.22].forEach(function (x, i) { spire(x, -0.2, 0.04, i === 1 || i === 2 ? 0.72 : 0.62, '#e8473a'); });
    spire(0, -0.04, 0.075, 1.05, '#ffffff'); spire(-0.13, -0.08, 0.05, 0.86, '#2b7de0'); spire(0.13, -0.08, 0.05, 0.86, '#2f9e5a');
    box(g, solid('#e8e2d2'), 0.07, 0.008, 0.008, 0, 1.1, -0.04); box(g, solid('#e8e2d2'), 0.008, 0.07, 0.008, 0, 1.07, -0.04);
    // a yellow construction crane
    var y = solid('#f2c14e'); box(g, y, 0.025, 0.95, 0.025, 0.42, 0, -0.32); box(g, y, 0.45, 0.02, 0.02, 0.3, 0.95, -0.32); box(g, solid('#555'), 0.06, 0.05, 0.05, 0.53, 0.9, -0.32);
    return g;
  };

  /* ---------- Brandenburg Gate ---------- */
  M.custom.gate = function () {
    var g = new T.Group(), s = solid('#e8dcbc'), sD = solid('#d6c7a2'), cu = solid('#5fa88a');
    blob(g, '#b7b3ab', 0.66, 0.56, 0, 0, 0.006, 2);
    box(g, mat(stoneTex('bgst', '#ddd0ae', '#c4b690', 16, 8), 4, 1), 0.92, 0.035, 0.3, 0, 0, 0);
    for (var i = 0; i < 6; i++) for (var k = 0; k < 2; k++) { var x = -0.375 + i * 0.15; cyl(g, mat(tex('flute', 32, 32, function (c, W, H) { c.fillStyle = '#ece1c4'; c.fillRect(0, 0, W, H); for (var f = 0; f < W; f += 4) { c.fillStyle = '#d2c39f'; c.fillRect(f, 0, 1.5, H); } }), 3, 1), 0.026, 0.03, 0.36, x, 0.035, k ? 0.1 : -0.1, 12); box(g, sD, 0.075, 0.015, 0.075, x, 0.395, k ? 0.1 : -0.1); }
    for (var j = 0; j < 5; j++) box(g, solid('#c9b98f'), 0.1, 0.36, 0.2, -0.3 + j * 0.15, 0.035, 0);
    var frieze = tex('bgfr', 64, 16, function (c, W, H) { c.fillStyle = '#e8dcbc'; c.fillRect(0, 0, W, H); for (var t = 0; t < W; t += 8) { c.fillStyle = '#c4b38c'; c.fillRect(t + 1, 3, 2, 10); c.fillRect(t + 4, 3, 2, 10); } });
    box(g, mat(frieze, 8, 1), 0.96, 0.08, 0.3, 0, 0.41, 0);
    box(g, sD, 0.98, 0.02, 0.32, 0, 0.49, 0);
    box(g, s, 0.5, 0.06, 0.22, 0, 0.51, 0); box(g, s, 0.3, 0.04, 0.16, 0, 0.57, 0);
    // quadriga: four horses and the goddess in her chariot
    box(g, cu, 0.08, 0.04, 0.05, 0, 0.61, -0.02);
    for (var h = 0; h < 4; h++) { var hx = -0.045 + h * 0.03; box(g, cu, 0.016, 0.03, 0.07, hx, 0.62, 0.05); box(g, cu, 0.012, 0.03, 0.02, hx, 0.645, 0.085); box(g, cu, 0.004, 0.025, 0.004, hx - 0.005, 0.61, 0.025); box(g, cu, 0.004, 0.025, 0.004, hx + 0.005, 0.61, 0.075); }
    cyl(g, cu, 0.01, 0.014, 0.07, 0, 0.65, -0.02, 6); var wr = new T.Mesh(new T.TorusGeometry(0.018, 0.004, 4, 10), cu); wr.position.set(0, 0.75, -0.02); g.add(wr);
    // side guard houses
    [-0.56, 0.56].forEach(function (x) { box(g, s, 0.14, 0.2, 0.18, x, 0, 0); [-0.04, 0.04].forEach(function (dx) { cyl(g, s, 0.012, 0.014, 0.18, x + dx, 0, 0.1, 8); }); box(g, sD, 0.16, 0.025, 0.2, x, 0.2, 0); });
    return g;
  };

  /* ---------- Neuschwanstein ---------- */
  M.custom.neusch = function () {
    var g = new T.Group(), white = mat(winTex('nsw', '#f2eee4', '#4a5260', 3, 3, { tall: 0.4 }), 2, 2), roof = solid('#4c6f9a'), brick = mat(winTex('nsb', '#b3654a', '#3f2f28', 2, 2), 2, 1);
    mountain(g, { h: 0.22, r: function (t) { return 0.6 - 0.25 * t; }, colour: function (x, y, z) { return y > 0.15 ? '#8d8a80' : (noise(x * 10, z * 10) > 0.5 ? '#4e8c4a' : '#5a9a50'); }, bump: 0.3 });
    var B = 0.22;
    box(g, white, 0.42, 0.34, 0.15, 0.02, B, -0.04);
    var r1 = new T.Mesh(new T.CylinderGeometry(0, 0.16, 0.14, 4), roof); r1.rotation.y = Math.PI / 4; r1.scale.set(1.5, 1, 0.55); r1.position.set(0.02, B + 0.41, -0.04); g.add(r1);
    box(g, white, 0.18, 0.26, 0.16, -0.2, B, 0.08); var r2 = new T.Mesh(new T.CylinderGeometry(0, 0.13, 0.12, 4), roof); r2.rotation.y = Math.PI / 4; r2.scale.set(0.8, 1, 0.75); r2.position.set(-0.2, B + 0.32, 0.08); g.add(r2);
    box(g, brick, 0.2, 0.14, 0.12, 0.1, B, 0.2);
    function turret(x, z, r, h, rh) { var t = new T.Mesh(new T.CylinderGeometry(r, r, h, 12), white); t.position.set(x, B + h / 2, z); g.add(t); cyl(g, roof, 0, r * 1.25, rh, x, B + h, z, 12); cyl(g, solid('#d8ad4c'), 0.002, 0.003, 0.04, x, B + h + rh, z, 4); }
    turret(0.24, -0.08, 0.045, 0.52, 0.16); turret(-0.13, -0.12, 0.035, 0.58, 0.14); turret(0.1, 0.06, 0.03, 0.42, 0.12); turret(-0.28, 0.14, 0.03, 0.32, 0.1); turret(0.2, 0.22, 0.025, 0.24, 0.08); turret(-0.02, 0.1, 0.022, 0.48, 0.09);
    for (var i = 0; i < 24; i++) { var a = i / 24 * D2, r = 0.52 + hash(i, 2) * 0.12; tree(g, Math.cos(a) * r, Math.sin(a) * r, 1 + hash(i, 3) * 0.4, i % 3 ? '#3f7f45' : '#4f9a50'); }
    return g;
  };

  /* ---------- Kinderdijk windmills ---------- */
  M.custom.windmill = function () {
    var g = new T.Group();
    var sail = tex('wsail', 32, 128, function (x, W, H) { x.clearRect(0, 0, W, H); x.strokeStyle = '#6b4a35'; x.lineWidth = 3; x.strokeRect(2, 2, W - 4, H - 4); x.lineWidth = 1.5; for (var y = 0; y < H; y += 8) { x.beginPath(); x.moveTo(2, y); x.lineTo(W - 2, y); x.stroke(); } x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.stroke(); x.fillStyle = 'rgba(240,235,220,.85)'; x.fillRect(4, 6, W / 2 - 5, H - 12); });
    var sailM = mat(sail, 1, 1, { alphaTest: 0.3, side: T.DoubleSide });
    blob(g, '#6cbf5c', 0.7, 0.6, 0, 0, 0.008, 4);
    box(g, solid('#3f9edb', { emissive: 0x0a2a40 }), 0.16, 0.012, 1.2, 0.16, 0, 0);
    function mill(x, z, s, rot) {
      var body = new T.Mesh(new T.CylinderGeometry(0.07 * s, 0.13 * s, 0.4 * s, 8), mat(tex('thatch', 32, 32, function (c, W, H) { c.fillStyle = '#5d5248'; c.fillRect(0, 0, W, H); for (var i = 0; i < 60; i++) { c.fillStyle = 'rgba(160,140,110,.35)'; c.fillRect(Math.random() * W, Math.random() * H, 1, 6); } }), 3, 2));
      body.position.set(x, 0.2 * s + 0.04 * s, z); g.add(body);
      box(g, solid('#e8e0d0'), 0.27 * s, 0.04 * s, 0.27 * s, x, 0, z).rotation.y = Math.PI / 8;
      box(g, solid('#e8e0d0'), 0.035 * s, 0.07 * s, 0.01, x, 0.04 * s, z + 0.12 * s);
      var cap = new T.Mesh(new T.SphereGeometry(0.085 * s, 10, 6, 0, D2, 0, Math.PI / 2), solid('#4a3f36')); cap.scale.set(1, 0.8, 1.3); cap.position.set(x, 0.44 * s, z); g.add(cap);
      var hub = new T.Group(); hub.position.set(x, 0.47 * s, z + 0.11 * s); hub.rotation.z = rot; g.add(hub);
      for (var b = 0; b < 4; b++) { var arm = new T.Group(); arm.rotation.z = b * Math.PI / 2; hub.add(arm); var p = new T.Mesh(new T.PlaneGeometry(0.07 * s, 0.34 * s), sailM); p.position.y = 0.19 * s; arm.add(p); var sp = new T.Mesh(new T.BoxGeometry(0.008 * s, 0.38 * s, 0.008 * s), solid('#6b4a35')); sp.position.y = 0.19 * s; arm.add(sp); }
      cyl(g, solid('#3a3028'), 0.012 * s, 0.012 * s, 0.03 * s, x, 0.47 * s, z + 0.1 * s, 8).rotation.x = Math.PI / 2;
    }
    mill(-0.14, 0.28, 1.0, 0.3); mill(-0.14, -0.06, 0.95, 0.9); mill(-0.14, -0.38, 0.9, 0.1); mill(0.44, 0.1, 0.85, 0.6);
    return g;
  };

  /* ---------- Parthenon on the Acropolis ---------- */
  M.custom.parthenon = function () {
    var g = new T.Group(), marble = '#ece2c9';
    mountain(g, { h: 0.12, r: function (t) { return 0.62 - 0.1 * t * t; }, colour: function (x, y, z) { return y > 0.1 ? '#d6c9a8' : (noise(x * 9, z * 9) > 0.55 ? '#a39a86' : '#b9ad92'); }, bump: 0.15, jag: 0.01 });
    var B = 0.12, st = mat(stoneTex('parst', '#e3d7bb', '#cbbd9c', 16, 8), 4, 1);
    for (var s = 0; s < 3; s++) box(g, st, 0.86 - s * 0.03, 0.02, 0.44 - s * 0.03, 0, B + s * 0.02, 0);
    var flute = mat(tex('pflute', 32, 32, function (c, W, H) { c.fillStyle = marble; c.fillRect(0, 0, W, H); for (var f = 0; f < W; f += 4) { c.fillStyle = '#d0c3a3'; c.fillRect(f, 0, 1.5, H); } }), 3, 1);
    var top = B + 0.06, CH = 0.26;
    for (var i = 0; i < 8; i++) { var x = -0.36 + i * 0.103; [0.18, -0.18].forEach(function (z) { cyl(g, flute, 0.019, 0.023, CH, x, top, z, 10); }); }
    for (var j = 1; j < 16; j++) { var z2 = -0.18 + j * 0.0225; [-0.36, 0.36].forEach(function (x2) { if (j % 2) cyl(g, flute, 0.019, 0.023, CH, x2, top, z2 * 1, 10); }); }
    var tri = tex('triglyph', 64, 16, function (c, W, H) { c.fillStyle = '#e6dbbf'; c.fillRect(0, 0, W, H); for (var t = 0; t < W; t += 16) { c.fillStyle = '#b9ab8a'; c.fillRect(t + 2, 2, 2, 12); c.fillRect(t + 5, 2, 2, 12); c.fillRect(t + 8, 2, 2, 12); } });
    box(g, mat(tri, 10, 1), 0.8, 0.06, 0.4, 0, top + CH, 0);
    prism(g, solid('#e6dbbf'), 0.8, 0.07, 0.4, 0, top + CH + 0.06, 0);
    // (the roof is missing, as in real life: you can see between the columns)
    box(g, solid('#d8cbab'), 0.6, 0.18, 0.22, 0.02, top, 0);
    [[-0.45, 0.4], [0.5, 0.42], [0.52, -0.35]].forEach(function (q) { cyl(g, solid('#7a6a4a'), 0.006, 0.01, 0.06, q[0], 0.1, q[1], 5); var o = new T.Mesh(new T.SphereGeometry(0.045, 7, 5), solid('#8aa36a', { flatShading: true })); o.scale.y = 0.65; o.position.set(q[0], 0.18, q[1]); g.add(o); });
    return g;
  };

  /* ---------- Blue Mosque ---------- */
  M.custom.mosque = function () {
    var g = new T.Group(), stone = mat(winTex('bmw', '#d9d4c8', '#55606a', 4, 3, { tall: 0.4 }), 3, 1), lead = solid('#8fa0b5'), leadD = solid('#7d8ea4');
    blob(g, '#bdb6a6', 0.66, 0.62, 0, 0, 0.006, 6);
    box(g, stone, 0.5, 0.2, 0.5, 0, 0, -0.04);
    function dome(r, x, y, z, m, tall) { cyl(g, stone, r * 0.95, r, r * 0.35, x, y, z, 16); var d = lathe([[0, 0], [r, 0], [r * 0.96, r * 0.35], [r * 0.75, r * 0.7], [r * 0.4, r * 0.93], [0, r * (tall || 1)]], 18, m || lead); d.position.set(x, y + r * 0.35, z); g.add(d); cyl(g, solid('#d8ad4c'), 0.002, 0.004, r * 0.35, x, y + r * 0.35 + r * (tall || 1), z, 4); }
    dome(0.15, 0, 0.26, -0.04);
    [[0.17, 0], [-0.17, 0], [0, 0.17], [0, -0.17]].forEach(function (q) { dome(0.085, q[0], 0.22, -0.04 + q[1], leadD); });
    [[0.2, 0.2], [-0.2, 0.2], [0.2, -0.24], [-0.2, -0.24]].forEach(function (q) { dome(0.05, q[0], 0.2, q[1]); });
    // courtyard with small domes in front
    box(g, solid('#cfc9bb'), 0.46, 0.08, 0.34, 0, 0, 0.36);
    for (var i = 0; i < 5; i++) { var d = lathe([[0, 0], [0.03, 0], [0.025, 0.02], [0, 0.03]], 10, lead); d.position.set(-0.18 + i * 0.09, 0.08, 0.52); g.add(d); var d2 = d.clone(); d2.position.z = 0.2; g.add(d2); }
    // six pencil minarets
    [[0.29, 0.21], [-0.29, 0.21], [0.29, -0.3], [-0.29, -0.3], [0.27, 0.54], [-0.27, 0.54]].forEach(function (q, k) {
      var h = k > 3 ? 0.55 : 0.68; cyl(g, solid('#e2ded4'), 0.016, 0.022, h, q[0], 0, q[1], 10);
      [0.4, 0.52].forEach(function (y) { if (y < h - 0.05) cyl(g, solid('#d0cbbf'), 0.03, 0.026, 0.012, q[0], y, q[1], 10); });
      cyl(g, lead, 0, 0.02, 0.12, q[0], h, q[1], 10); cyl(g, solid('#d8ad4c'), 0.002, 0.002, 0.03, q[0], h + 0.12, q[1], 4);
    });
    return g;
  };

  /* ---------- Kilimanjaro ---------- */
  M.custom.kilimanjaro = function () {
    var g = new T.Group();
    blob(g, '#c9c46a', 0.72, 0.62, 0, 0, 0.006, 5);
    mountain(g, { h: 0.42, seg: 44, r: function (t) { return t > 0.92 ? 0.17 - (t - 0.92) * 1.6 : 0.62 - 0.45 * Math.pow(t, 0.8); }, bump: 0.18, colour: function (x, y, z) { var a = Math.atan2(z, x); if (y > 0.34 + (noise(a * 5, 2) - 0.5) * 0.06) return '#ffffff'; if (y > 0.27) return '#8a7f72'; if (y > 0.12) return noise(x * 14, z * 14) > 0.5 ? '#3f7f45' : '#4a8a4a'; return '#8aa34e'; } });
    mountain(g, { h: 0.2, pos: [0.38, -0.18], r: function (t) { return 0.2 * (1 - t) + 0.01; }, bump: 0.35, f: 5, seed: 3, colour: function (x, y) { return y > 0.15 ? '#7d746a' : '#5a8a4a'; } });
    for (var i = 0; i < 9; i++) { var a = i / 9 * D2 + 0.3, r = 0.6 + hash(i, 1) * 0.08; acacia(g, Math.cos(a) * r, Math.sin(a) * r, 0.9 + hash(i, 2) * 0.4); }
    return g;
  };

  /* ---------- Table Mountain ---------- */
  M.custom.table = function () {
    var g = new T.Group();
    blob(g, '#3f9edb', 0.72, 0.5, 0, 0.35, 0.006, 3);
    mountain(g, { h: 0.3, seg: 40, sx: 1.3, sz: 0.6, r: function (t) { return t < 0.75 ? 0.42 - 0.1 * t : (t < 0.97 ? 0.345 - (t - 0.75) * 0.2 : 0.3 - (t - 0.97) * 10); }, bump: 0.1, jag: 0.005, colour: function (x, y, z) { if (y > 0.29) return '#8a9a6a'; if (y > 0.2) return noise(x * 20, y * 30) > 0.5 ? '#9a9488' : '#8a8478'; return '#5f9a52'; } });
    [[-0.2, 0], [0, -0.02], [0.2, 0.01], [0.38, 0]].forEach(function (q) { var c = new T.Mesh(new T.SphereGeometry(0.1, 9, 6), solid('#ffffff')); c.scale.set(1.3, 0.28, 0.7); c.position.set(q[0], 0.31, q[1]); g.add(c); });
    var town = [solid('#ffffff'), solid('#f2e6d0'), solid('#e8d9c6')];
    for (var i = 0; i < 18; i++) box(g, town[i % 3], 0.04 + hash(i, 1) * 0.03, 0.02 + hash(i, 2) * 0.05, 0.04, -0.5 + i * 0.06, 0, 0.3 + hash(i, 3) * 0.08);
    return g;
  };

  /* ---------- Mount Everest ---------- */
  M.custom.everest = function () {
    var g = new T.Group();
    function snowy(top) { return function (x, y, z) { var a = Math.atan2(z, x); if (y > top * 0.55 + (noise(a * 7, y * 4) - 0.5) * top * 0.25) return noise(x * 30, y * 30) > 0.8 ? '#dfe6f0' : '#ffffff'; return noise(a * 9, y * 12) > 0.5 ? '#7a7d88' : '#6a6d78'; }; }
    mountain(g, { h: 0.85, seg: 7, rings: 10, r: function (t) { return 0.36 * (1 - t) + 0.005; }, bump: 0.4, jag: 0.03, f: 2, colour: snowy(0.85) });
    mountain(g, { h: 0.6, seg: 6, rings: 8, pos: [0.34, -0.12], r: function (t) { return 0.27 * (1 - t) + 0.005; }, bump: 0.45, f: 2, seed: 4, colour: snowy(0.6) });
    mountain(g, { h: 0.5, seg: 6, rings: 8, pos: [-0.36, -0.08], r: function (t) { return 0.25 * (1 - t) + 0.005; }, bump: 0.45, f: 2, seed: 9, colour: snowy(0.5) });
    blob(g, '#c9cfd8', 0.7, 0.55, 0, 0, 0.006, 2);
    // base camp tents and prayer flags
    ['#e8473a', '#f2c14e', '#2b7de0', '#33c9a0'].forEach(function (c, i) { var t = new T.Mesh(new T.ConeGeometry(0.03, 0.035, 4), solid(c, { flatShading: true })); t.position.set(-0.15 + i * 0.06, 0.018, 0.45); t.rotation.y = Math.PI / 4; g.add(t); });
    var flags = ['#2b7de0', '#ffffff', '#e8473a', '#33c9a0', '#f2c14e'];
    for (var f = 0; f < 10; f++) box(g, solid(flags[f % 5]), 0.02, 0.022, 0.002, -0.2 + f * 0.035, 0.07 - Math.sin(f / 9 * Math.PI) * 0.02, 0.5);
    return g;
  };

  /* ---------- Stonehenge ---------- */
  M.custom.stonehenge = function () {
    var g = new T.Group(), rock = mat(tex('sarsen', 32, 32, function (c, W, H) { c.fillStyle = '#9b988f'; c.fillRect(0, 0, W, H); for (var i = 0; i < 120; i++) { c.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '255,255,255' : '40,40,40') + ',.12)'; c.fillRect(Math.random() * W, Math.random() * H, 2, 2); } c.fillStyle = 'rgba(120,150,90,.25)'; c.fillRect(0, H - 6, W, 6); }), 1, 1, { flatShading: true });
    blob(g, '#6cbf5c', 0.7, 0.62, 0, 0, 0.008, 1);
    var ring = new T.Mesh(new T.RingGeometry(0.5, 0.56, 40), solid('#c9c08a', { side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; g.add(ring);
    var R = 0.36, N = 26;
    for (var i = 0; i < N; i++) {
      if (i === 7 || i === 8 || i === 16 || i === 19) continue;
      var a = i / N * D2, x = Math.cos(a) * R, z = Math.sin(a) * R;
      box(g, rock, 0.035, 0.2, 0.052, x, 0, z).rotation.y = -a;
      if (i !== 6 && i !== 9 && i !== 15 && i !== 18 && i !== 20) { var b = a + Math.PI / N, l = box(g, rock, 0.035, 0.03, 0.1, Math.cos(b) * R, 0.2, Math.sin(b) * R); l.rotation.y = -b; }
    }
    [[-0.16, 0.08, 0.3], [-0.1, -0.12, 0.33], [0.08, -0.17, 0.36], [0.17, 0.0, 0.33], [0.12, 0.13, 0.3]].forEach(function (q) {
      var a = Math.atan2(q[1], q[0]) + Math.PI / 2;
      [-0.035, 0.035].forEach(function (d) { box(g, rock, 0.06, q[2], 0.05, q[0] + Math.cos(a) * d, 0, q[1] + Math.sin(a) * d).rotation.y = -a; });
      box(g, rock, 0.14, 0.035, 0.05, q[0], q[2], q[1]).rotation.y = -a;
    });
    box(g, rock, 0.18, 0.04, 0.06, -0.05, 0, 0.02).rotation.y = 0.6;
    box(g, rock, 0.07, 0.035, 0.12, 0.43, 0, 0.2).rotation.y = 0.3;
    return g;
  };

  /* ---------- Burj Khalifa ---------- */
  M.custom.burj = function () {
    var g = new T.Group(), glass = mat(tex('burjg', 32, 64, function (c, W, H) { c.fillStyle = '#9fb6cc'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 4) { c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(0, y, W, 1); } for (var x = 0; x < W; x += 8) { c.fillStyle = '#d7e2ec'; c.fillRect(x, 0, 2, H); } }), 2, 8);
    blob(g, '#e3d3a6', 0.66, 0.6, 0, 0, 0.006, 2);
    blob(g, '#3f9edb', 0.3, 0.16, 0.12, 0.38, 0.012, 7);
    cyl(g, glass, 0.06, 0.075, 1.0, 0, 0, 0, 6);
    for (var w = 0; w < 3; w++) {
      var a = w / 3 * D2 + Math.PI / 2;
      for (var s = 0; s < 7; s++) { var h = 0.15 + s * 0.135, r = 0.15 - s * 0.018; if (r < 0.02) break; var dx = Math.cos(a + s * 0.9 * (s % 2 ? 1 : 0)) * r * 0.6, dz = Math.sin(a) * r * 0.6; box(g, glass, 0.07, h, 0.07, Math.cos(a) * r * 0.55, 0, Math.sin(a) * r * 0.55).rotation.y = -a; }
    }
    cyl(g, solid('#d7e2ec'), 0.004, 0.03, 0.35, 0, 1.0, 0, 6);
    var city = [mat(winTex('dxa', '#c9d3dd', '#5a6e85', 3, 6), 1, 2), mat(winTex('dxb', '#e8dfcf', '#6a7a8a', 3, 5), 1, 2)];
    for (var i = 0; i < 12; i++) { var aa = i / 12 * D2, rr = 0.42 + hash(i, 1) * 0.15; if (Math.sin(aa) > 0.5) continue; box(g, city[i % 2], 0.06, 0.1 + hash(i, 2) * 0.25, 0.06, Math.cos(aa) * rr, 0, Math.sin(aa) * rr); }
    for (var p = 0; p < 6; p++) { cyl(g, solid('#8a6a3a'), 0.005, 0.008, 0.1, -0.1 + p * 0.07, 0, 0.55, 5); var l = new T.Mesh(new T.ConeGeometry(0.04, 0.025, 6), solid('#4f9a50', { flatShading: true })); l.position.set(-0.1 + p * 0.07, 0.11, 0.55); g.add(l); }
    return g;
  };

  /* ---------- Ger (Mongolian yurt) ---------- */
  M.custom.ger = function () {
    var g = new T.Group();
    var band = tex('gerband', 64, 32, function (c, W, H) { c.fillStyle = '#f4f1e8'; c.fillRect(0, 0, W, H); c.fillStyle = '#c0392b'; c.fillRect(0, 10, W, 4); c.fillRect(0, 22, W, 2); c.fillStyle = '#2b7de0'; for (var x = 0; x < W; x += 8) { c.beginPath(); c.moveTo(x, 18); c.lineTo(x + 4, 14); c.lineTo(x + 8, 18); c.fill(); } });
    blob(g, '#7fc25f', 0.72, 0.62, 0, 0, 0.008, 2);
    function ger(x, z, s, rot) {
      cyl(g, mat(band, 6, 1), 0.2 * s, 0.205 * s, 0.14 * s, x, 0, z, 24);
      var roof = new T.Mesh(new T.CylinderGeometry(0.05 * s, 0.23 * s, 0.1 * s, 24), solid('#f4f1e8')); roof.position.set(x, 0.14 * s + 0.05 * s, z); g.add(roof);
      for (var i = 0; i < 8; i++) { var a = i / 8 * D2; box(g, solid('#b5432d'), 0.004, 0.004, 0.18 * s, x + Math.cos(a) * 0.14 * s, 0.17 * s, z + Math.sin(a) * 0.14 * s).rotation.y = -a + Math.PI / 2; }
      cyl(g, solid('#e67e22'), 0.05 * s, 0.05 * s, 0.02 * s, x, 0.24 * s, z, 16);
      var door = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.11 * s, 0.01), mat(tex('gerdoor', 16, 32, function (c, W, H) { c.fillStyle = '#e67e22'; c.fillRect(0, 0, W, H); c.strokeStyle = '#2b7de0'; c.lineWidth = 2; c.strokeRect(2, 2, W - 4, H - 4); c.fillStyle = '#c0392b'; c.fillRect(6, 10, 4, 12); }), 1, 1));
      var a2 = rot || 0; door.position.set(x + Math.sin(a2) * 0.205 * s, 0.055 * s, z + Math.cos(a2) * 0.205 * s); door.rotation.y = a2; g.add(door);
    }
    ger(-0.12, 0.02, 1.25, 0.3); ger(0.32, -0.22, 0.9, -0.2);
    // horses and a hitching post
    [[0.35, 0.3, 0.4], [0.47, 0.2, -0.6]].forEach(function (q) { var hg = new T.Group(); hg.position.set(q[0], 0, q[1]); hg.rotation.y = q[2]; g.add(hg); var c = solid(q[0] > 0.4 ? '#8a5a3a' : '#5a3f2a'); box(hg, c, 0.03, 0.03, 0.08, 0, 0.04, 0); box(hg, c, 0.02, 0.04, 0.025, 0, 0.06, 0.05); [[-0.01, -0.03], [0.01, -0.03], [-0.01, 0.03], [0.01, 0.03]].forEach(function (l) { box(hg, c, 0.007, 0.04, 0.007, l[0], 0, l[1]); }); });
    box(g, solid('#7a5a3a'), 0.2, 0.01, 0.01, 0.4, 0.06, 0.4); cyl(g, solid('#7a5a3a'), 0.005, 0.005, 0.07, 0.3, 0, 0.4, 5); cyl(g, solid('#7a5a3a'), 0.005, 0.005, 0.07, 0.5, 0, 0.4, 5);
    return g;
  };

  /* ---------- Uluru ---------- */
  M.custom.uluru = function () {
    var g = new T.Group();
    blob(g, '#d0703c', 0.72, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.26, seg: 64, rings: 14, sx: 1.15, sz: 0.5, f: 22, bump: 0.07, jag: 0.006, r: function (t) { return 0.5 * Math.pow(1 - Math.pow(t, 3), 0.35) + 0.01; },
      colour: function (x, y, z) { var a = Math.atan2(z, x); if (y > 0.2) return noise(x * 6, z * 6) > 0.6 ? '#c95e30' : '#cf6434'; return noise(a * 22, 1) > 0.62 ? '#933d1d' : (noise(a * 9, y * 9) > 0.5 ? '#b84c22' : '#c45a2e'); } });
    for (var j = 0; j < 30; j++) { var a2 = hash(j, 1) * D2, r = 0.62 + hash(j, 2) * 0.12; var s = new T.Mesh(new T.SphereGeometry(0.025, 6, 4), solid(j % 3 ? '#b8b25a' : '#8a9a4a', { flatShading: true })); s.scale.y = 0.6; s.position.set(Math.cos(a2) * r, 0.012, Math.sin(a2) * r * 0.8); g.add(s); }
    return g;
  };
})();
