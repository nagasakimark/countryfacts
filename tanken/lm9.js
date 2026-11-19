/* Detailed landmarks, batch 9: Golden Temple, Hawa Mahal, Bulguksa, Teotihuacan, Tikal, Iguazu Falls,
   Santorini, Venice (Rialto Bridge). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function jungle(g, n, r0, r1, seed, y, front) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0); if (front && Math.sin(a) > 0.55) continue; var c = new T.Mesh(new T.IcosahedronGeometry(0.045 + hash(i, seed + 2) * 0.035, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.04, Math.sin(a) * r * 0.85); g.add(c); } }
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 12, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function gondola(g, x, z, ry) { var b = new T.Group(); var h = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.12, 6), solid('#1a1a1e')); h.rotation.x = Math.PI / 2; h.scale.x = 1.6; b.add(h); box(b, solid('#c9302c'), 0.012, 0.008, 0.02, 0, 0.005, 0); b.position.set(x, 0.012, z); b.rotation.y = ry; g.add(b); }

  /* ---------- Golden Temple (Harmandir Sahib) ---------- */
  M.custom.goldentemple = function () {
    var g = new T.Group(), gold = solid('#e8b52a', { emissive: '#4a3200' }), marble = mat(stoneTex('gtm', '#f4f2ee', '#dcd8d0', 16, 16), 6, 6), white = solid('#f6f4ef');
    blob(g, '#e8e4dc', 0.74, 0.62, 0, 0, 0.006, 2);
    box(g, marble, 1.1, 0.02, 0.96, 0, 0, 0);
    box(g, solid('#3f8fb8'), 0.86, 0.024, 0.72, 0, 0, 0); // the pool of nectar
    box(g, white, 0.06, 0.03, 0.4, 0, 0, 0.18); // the causeway
    for (var i = 0; i < 9; i++) [-0.035, 0.035].forEach(function (x) { cyl(g, gold, 0.004, 0.004, 0.03, x, 0.03, 0.0 + i * 0.045, 6); });
    box(g, white, 0.2, 0.08, 0.2, 0, 0.02, -0.06);
    box(g, gold, 0.18, 0.1, 0.18, 0, 0.1, -0.06);
    box(g, gold, 0.2, 0.012, 0.2, 0, 0.2, -0.06);
    dome(g, gold, 0.07, 0, 0.21, -0.06, 1.1); var tip = new T.Mesh(new T.ConeGeometry(0.012, 0.06, 8), gold); tip.position.set(0, 0.32, -0.06); g.add(tip);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { cyl(g, gold, 0.012, 0.012, 0.03, q[0] * 0.085, 0.21, -0.06 + q[1] * 0.085, 8); dome(g, gold, 0.016, q[0] * 0.085, 0.24, -0.06 + q[1] * 0.085, 1.3); });
    // white buildings round the pool and the clock tower gate
    [[0, -0.45, 1.0, 0.06], [-0.5, 0, 0.06, 0.84], [0.5, 0, 0.06, 0.84]].forEach(function (q) { box(g, mat(winTex('gtw', '#f6f4ef', '#7a8a9a', 6, 2, { tall: 0.5 }), 6, 1), q[2], 0.1, q[3], q[0], 0.02, q[1]); });
    box(g, white, 0.12, 0.2, 0.06, 0, 0.02, 0.45); dome(g, gold, 0.04, 0, 0.22, 0.45, 1.2);
    return g;
  };

  /* ---------- Hawa Mahal ---------- */
  M.custom.hawamahal = function () {
    var g = new T.Group(), pink = solid('#e7907a'), pinkL = solid('#f2b29c'), white = solid('#fbeee6'), win = solid('#4a2f2a');
    blob(g, '#d8c3a8', 0.74, 0.6, 0, 0.05, 0.006, 3);
    box(g, solid('#c9b8a0'), 1.2, 0.004, 0.16, 0, 0.004, 0.3); // the street
    box(g, pink, 0.9, 0.12, 0.2, 0, 0, -0.1);
    // five storeys of little bay windows, narrowing towards the top
    var floors = [[11, 0.12], [11, 0.2], [9, 0.28], [7, 0.36], [5, 0.44]];
    floors.forEach(function (f, k) {
      var n = f[0], w = n * 0.075; box(g, pink, w, 0.08, 0.12, 0, f[1], -0.08);
      for (var i = 0; i < n; i++) {
        var x = -w / 2 + 0.0375 + i * 0.075, bay = new T.Mesh(new T.CylinderGeometry(0.028, 0.028, 0.07, 8, 1, false, 0, Math.PI), pinkL); bay.rotation.y = -Math.PI / 2; bay.position.set(x, f[1] + 0.035, -0.02); g.add(bay);
        box(g, win, 0.014, 0.03, 0.002, x, f[1] + 0.02, 0.008);
        dome(g, white, 0.022, x, f[1] + 0.07, -0.02, 1.1);
      }
    });
    [-0.3, 0, 0.3].forEach(function (x) { cyl(g, pinkL, 0.02, 0.02, 0.06, x, 0.52, -0.08, 8); dome(g, white, 0.022, x, 0.58, -0.08, 1.2); });
    [[-0.55, 0.42], [0.55, 0.4]].forEach(function (q) { tree(g, q[0], q[1], 1.2, '#4f8a3a'); });
    return g;
  };

  /* ---------- Bulguksa ---------- */
  M.custom.bulguksa = function () {
    var g = new T.Group(), st = mat(stoneTex('bgst', '#c9c4b8', '#aaa598', 10, 5), 6, 1), stone = solid('#bdb7aa'), red = solid('#a8342a');
    var roofM = mat(tex('bgroof', 64, 32, function (c, W, H) { c.fillStyle = '#4b5258'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 4) { c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x, 0, 1.5, H); } }), 4, 2);
    var dan = mat(tex('bgdan', 64, 16, function (c, W, H) { c.fillStyle = '#2f8f6a'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 16) { c.fillStyle = '#e8473a'; c.fillRect(x + 2, 4, 5, 8); c.fillStyle = '#f2c14e'; c.fillRect(x + 9, 5, 4, 6); } }), 6, 1);
    blob(g, '#6aa850', 0.74, 0.62, 0, 0.05, 0.006, 3);
    box(g, st, 0.9, 0.12, 0.06, 0, 0, 0.12); // the stone terrace wall
    box(g, solid('#d8d2c2'), 0.9, 0.004, 0.5, 0, 0.12, -0.13);
    // the twin stone stair-bridges
    [-0.18, 0.18].forEach(function (x) { for (var i = 0; i < 6; i++) box(g, stone, 0.08, 0.02 * (i + 1), 0.025, x, 0, 0.29 - i * 0.025); var ar = new T.Mesh(new T.TorusGeometry(0.025, 0.006, 4, 8, Math.PI), stone); ar.position.set(x, 0.0, 0.16); ar.rotation.y = Math.PI / 2; g.add(ar); });
    // the hall
    for (var c = 0; c < 6; c++) cyl(g, red, 0.009, 0.01, 0.09, -0.15 + c * 0.06, 0.124, -0.1, 8);
    box(g, mat(winTex('bglat', '#c9a46a', '#7a3a2a', 6, 2, { tall: 0.7 }), 3, 1), 0.3, 0.09, 0.14, 0, 0.124, -0.18);
    box(g, dan, 0.38, 0.025, 0.2, 0, 0.214, -0.16);
    hip(g, roofM, 0.5, 0.3, 0.09, 0, 0.24, -0.16, 0.3);
    box(g, solid('#3a3f44'), 0.2, 0.01, 0.014, 0, 0.33, -0.16);
    // Dabotap and Seokgatap pagodas in front
    function tap(x, ornate) { var y = 0.124; [0.07, 0.055, 0.045].forEach(function (w, i) { box(g, stone, w, 0.025, w, x, y, 0.02); y += 0.025; box(g, solid('#a9a396'), w + 0.02, 0.008, w + 0.02, x, y, 0.02); y += 0.008; if (ornate && i === 1) { cyl(g, stone, 0.016, 0.016, 0.03, x, y, 0.02, 8); y += 0.03; } }); cyl(g, stone, 0.003, 0.008, 0.05, x, y, 0.02, 6); }
    tap(-0.12, true); tap(0.12, false);
    [[-0.45, 0.25], [0.45, 0.25], [-0.55, -0.2], [0.55, -0.15]].forEach(function (q, i) { tree(g, q[0], q[1], 1.3, i % 2 ? '#d9532c' : '#3f8f45'); });
    return g;
  };

  /* ---------- Teotihuacan ---------- */
  M.custom.teotihuacan = function () {
    var g = new T.Group(), st = mat(stoneTex('teost', '#a89478', '#8a7a62', 10, 5), 4, 1), stL = solid('#b8a488');
    blob(g, '#c9b07a', 0.74, 0.62, 0, 0, 0.006, 4);
    box(g, solid('#bfa682'), 0.12, 0.006, 1.2, 0.35, 0.006, 0); // the Avenue of the Dead
    function pyramid(x, z, w, tiers, th) { var y = 0; for (var i = 0; i < tiers; i++) { var ww = w * (1 - i * 0.17); var p = new T.Mesh(new T.CylinderGeometry(Math.SQRT1_2 * ww * 0.86, Math.SQRT1_2 * ww, th, 4), st); p.rotation.y = Math.PI / 4; p.position.set(x, y + th / 2, z); g.add(p); y += th; } box(g, stL, w * 0.3, 0.03, w * 0.3, x, y, z); for (var s = 0; s < tiers; s++) box(g, solid('#9a8668'), 0.06, th, 0.04, x + w * (0.5 - s * 0.085) - 0.02, s * th, z); return y; }
    pyramid(0.0, -0.05, 0.62, 5, 0.075); // Pyramid of the Sun (stairs face +x, the avenue)
    pyramid(0.35, -0.48, 0.32, 4, 0.06); // Pyramid of the Moon
    for (var i = 0; i < 6; i++) { var p2 = new T.Mesh(new T.CylinderGeometry(0.03, 0.045, 0.05, 4), st); p2.rotation.y = Math.PI / 4; p2.position.set(i % 2 ? 0.48 : 0.22, 0.03, -0.2 + Math.floor(i / 2) * 0.22); g.add(p2); }
    [[-0.55, 0.4], [0.6, 0.45], [-0.5, -0.45]].forEach(function (q) { cyl(g, solid('#5f8a4a'), 0.012, 0.014, 0.07, q[0], 0, q[1], 6); });
    return g;
  };

  /* ---------- Tikal (Temple I) ---------- */
  M.custom.tikal = function () {
    var g = new T.Group(), st = mat(stoneTex('tikst', '#bdb3a0', '#9a907e', 10, 5), 2, 1), stD = solid('#a39886');
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 6);
    var y = 0, w = 0.36; for (var i = 0; i < 9; i++) { box(g, st, w, 0.055, w * 0.85, 0, y, -0.02); y += 0.055; w *= 0.9; }
    box(g, stD, 0.07, y, 0.04, 0, 0, 0.13 - 0.0); // the steep staircase
    box(g, st, 0.14, 0.08, 0.1, 0, y, -0.03); box(g, solid('#2a2420'), 0.03, 0.05, 0.004, 0, y, 0.022);
    box(g, stD, 0.11, 0.12, 0.04, 0, y + 0.08, -0.06); // the roof comb
    // a second temple and a jungle canopy
    var y2 = 0, w2 = 0.24; for (var j = 0; j < 6; j++) { box(g, st, w2, 0.05, w2, -0.42, y2, -0.3); y2 += 0.05; w2 *= 0.88; } box(g, stD, 0.07, 0.06, 0.04, -0.42, y2, -0.3);
    jungle(g, 50, 0.3, 0.7, 3); jungle(g, 14, 0.24, 0.32, 9);
    return g;
  };

  /* ---------- Iguazu Falls (Devil's Throat) ---------- */
  M.custom.iguazu = function () {
    var g = new T.Group(), cliff = solid('#6a5a48'), water = solid('#e9f6fb', { side: T.DoubleSide });
    blob(g, '#3f8f45', 0.74, 0.62, 0, 0, 0.006, 3);
    var river = new T.Mesh(new T.PlaneGeometry(0.3, 0.4), solid('#6a9aa0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.008, 0.45); g.add(river);
    // a horseshoe-shaped cliff with water pouring over it
    var ring = new T.Mesh(new T.CylinderGeometry(0.34, 0.34, 0.18, 24, 1, true, Math.PI * 0.25, Math.PI * 1.5), cliff); ring.material.side = T.DoubleSide; ring.position.set(0, 0.09, -0.05); g.add(ring);
    var top = new T.Mesh(new T.RingGeometry(0.34, 0.7, 24, 1, -Math.PI * 0.25, Math.PI * 1.5), solid('#4f8a4a', { side: T.DoubleSide })); top.rotation.x = -Math.PI / 2; top.position.set(0, 0.18, -0.05); g.add(top);
    var fall = new T.Mesh(new T.CylinderGeometry(0.33, 0.33, 0.17, 24, 1, true, Math.PI * 0.3, Math.PI * 1.4), water); fall.position.set(0, 0.095, -0.05); g.add(fall);
    var upper = new T.Mesh(new T.RingGeometry(0.34, 0.48, 24, 1, -Math.PI * 0.2, Math.PI * 1.4), solid('#7a6a4a', { side: T.DoubleSide })); upper.rotation.x = -Math.PI / 2; upper.position.set(0, 0.185, -0.05); g.add(upper);
    var pool = new T.Mesh(new T.CircleGeometry(0.33, 24), solid('#cfeaf2')); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.01, -0.05); g.add(pool);
    for (var k = 0; k < 7; k++) { var sp = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.5 })); sp.position.set(Math.cos(k) * 0.15, 0.06 + hash(k, 1) * 0.08, -0.05 + Math.sin(k) * 0.15); g.add(sp); }
    // the walkway and the jungle
    box(g, solid('#8a8f96'), 0.03, 0.01, 0.4, 0.3, 0.19, -0.3); jungle(g, 30, 0.5, 0.72, 5, 0.18, true);
    return g;
  };

  /* ---------- Santorini (Oia) ---------- */
  M.custom.santorini = function () {
    var g = new T.Group(), white = solid('#fbfaf6'), blue = solid('#2a5fbf');
    blob(g, '#2f7fb8', 0.74, 0.62, 0, 0, 0.006, 5);
    mountain(g, { h: 0.3, pos: [0, -0.25], rings: 10, r: function (t) { return 0.6 * (1 - t * 0.3); }, bump: 0.2, sx: 1.2, sz: 0.55, colour: function (x, y) { return y > 0.26 ? '#c9b8a0' : noise(x * 10, y * 14) > 0.5 ? '#8a5a44' : '#6a4a3a'; } });
    for (var i = 0; i < 22; i++) {
      var x = -0.5 + hash(i, 1) * 1.0, z = -0.3 + hash(i, 2) * 0.22, w = 0.05 + hash(i, 3) * 0.03, h = 0.04 + hash(i, 4) * 0.03;
      box(g, i % 7 === 3 ? solid('#f2d0a0') : white, w, h, 0.05, x, 0.3, z);
      if (i % 5 === 0) { dome(g, blue, 0.025, x, 0.3 + h, z, 1.2); cyl(g, white, 0.002, 0.002, 0.02, x, 0.33 + h, z, 4); }
    }
    // a windmill on the cliff edge and a sailing boat in the caldera
    cyl(g, white, 0.025, 0.03, 0.08, 0.45, 0.3, -0.2, 10); cyl(g, solid('#c9a46a'), 0, 0.03, 0.03, 0.45, 0.38, -0.2, 10); for (var k = 0; k < 6; k++) { var bl = box(g, solid('#f4ecd8'), 0.006, 0.06, 0.002, 0.45, 0.36, -0.17); bl.rotation.z = k / 6 * Math.PI; }
    var bt = new T.Group(); box(bt, white, 0.03, 0.015, 0.08, 0, 0, 0); var sl = new T.Mesh(new T.PlaneGeometry(0.04, 0.06), solid('#ffffff', { side: T.DoubleSide })); sl.rotation.y = Math.PI / 2; sl.position.y = 0.05; bt.add(sl); bt.position.set(-0.1, 0.008, 0.35); g.add(bt);
    return g;
  };

  /* ---------- Venice: Rialto Bridge on the Grand Canal ---------- */
  M.custom.venice = function () {
    var g = new T.Group(), st = solid('#ece4d2'), stD = solid('#d9cfb8');
    var canal = new T.Mesh(new T.PlaneGeometry(0.36, 1.4), solid('#3f9aa0')); canal.rotation.x = -Math.PI / 2; canal.position.y = 0.008; g.add(canal);
    // palazzi on both banks
    var cols = ['#e8b48a', '#d98a6a', '#f2d8b0', '#c97a5a', '#efe2c8', '#e8a07a'];
    [-1, 1].forEach(function (s) { for (var i = 0; i < 7; i++) { var z = -0.6 + i * 0.18, h = 0.12 + hash(i, s + 3) * 0.08, w = 0.16; box(g, mat(winTex('vnw' + (i % 3), cols[(i + (s > 0 ? 3 : 0)) % 6], '#3a3a44', 4, 3, { tall: 0.55 }), 1, 1), w, h, 0.16, s * (0.18 + w / 2), 0, z); box(g, solid('#b8503a'), w + 0.01, 0.012, 0.17, s * (0.18 + w / 2), h, z); } });
    // the bridge: one stone arch with a roofed arcade on top
    var arc = new T.Mesh(new T.TorusGeometry(0.2, 0.025, 6, 16, Math.PI), st); arc.scale.set(1, 0.5, 4); arc.rotation.y = Math.PI / 2; arc.position.set(0, 0.0, 0.0); g.add(arc);
    var deck = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.12, 16, 1, false, -Math.PI / 2, Math.PI), stD); deck.rotation.z = Math.PI / 2; deck.rotation.y = 0; deck.scale.set(0.45, 1, 1); deck.position.set(0, 0.0, 0.0); g.add(deck);
    box(g, st, 0.12, 0.06, 0.16, 0, 0.1, 0); prism(g, solid('#c9a46a'), 0.14, 0.04, 0.18, 0, 0.16, 0);
    for (var a = 0; a < 3; a++) [-0.07, 0.07].forEach(function (x) { arch(g, solid('#3a3a44'), 0.02, 0.035, x * 0.0 + 0.0, 0.11, 0.081 + 0 * x, 0.002).position.set(-0.04 + a * 0.04, 0.105, 0.081); });
    gondola(g, -0.06, 0.4, 0.2); gondola(g, 0.07, -0.35, -0.3); gondola(g, -0.05, -0.15, 0.1);
    return g;
  };
})();
