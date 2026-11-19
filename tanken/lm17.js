/* Detailed landmarks, batch 17: N Seoul Tower, Space Needle, Leshan Giant Buddha, Zhangjiajie, Meteora,
   Pamukkale, Sheikh Zayed Grand Mosque, Hassan II Mosque. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 14, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function water(g, w, d, x, z, col) { var p = new T.Mesh(new T.PlaneGeometry(w, d), solid(col || '#3f8fc0')); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.008, z); g.add(p); return p; }
  function jungle(g, n, r0, r1, seed, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }

  /* ---------- N Seoul Tower ---------- */
  M.custom.nseoultower = function () {
    var g = new T.Group(), white = solid('#f2f4f6');
    blob(g, '#5f9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.22, r: function (t) { return 0.55 * (1 - t) + 0.1; }, bump: 0.25, colour: function (x, y, z) { return noise(x * 12, z * 12) > 0.5 ? '#3f7a44' : '#4f8a4a'; } });
    var Y = 0.21;
    box(g, mat(winTex('nst', '#e8e8ec', '#5a6a7a', 6, 2, { tall: 0.5 }), 2, 1), 0.18, 0.05, 0.12, 0, Y, 0);
    cyl(g, white, 0.022, 0.03, 0.3, 0, Y + 0.05, 0, 12);
    var deck = lathe([[0.03, 0], [0.07, 0.02], [0.075, 0.05], [0.06, 0.07], [0.03, 0.08], [0, 0.08]], 16, mat(winTex('nsd', '#dfe6ee', '#3f5a7a', 12, 2, { tall: 0.5 }), 2, 1)); deck.position.y = Y + 0.33; g.add(deck);
    cyl(g, solid('#d8dde2'), 0.006, 0.012, 0.18, 0, Y + 0.41, 0, 8); cyl(g, solid('#e8473a'), 0.002, 0.006, 0.06, 0, Y + 0.59, 0, 6);
    // the love-lock fences
    var cols = ['#e8473a', '#f2c14e', '#2b6fd0', '#ff7ab0', '#4fb35a'];
    for (var i = 0; i < 30; i++) { var a = i / 30 * Math.PI * 1.2 + 0.2, l = new T.Mesh(new T.BoxGeometry(0.008, 0.008, 0.004), solid(cols[i % 5])); l.position.set(Math.cos(a) * 0.13, Y + 0.02 + (i % 3) * 0.008, Math.sin(a) * 0.13); g.add(l); }
    for (var t = 0; t < 12; t++) { var a2 = t / 12 * D2; tree(g, Math.cos(a2) * 0.55, Math.sin(a2) * 0.48, 1.2, t % 4 ? '#3f8f45' : '#d9532c'); }
    return g;
  };

  /* ---------- Space Needle ---------- */
  M.custom.spaceneedle = function () {
    var g = new T.Group(), white = solid('#f2f2ee'), orange = solid('#f2a03a');
    blob(g, '#7aa858', 0.7, 0.6, 0, 0, 0.006, 3);
    // three pairs of slender legs pinched at the waist
    for (var i = 0; i < 3; i++) { var a = i / 3 * D2; [-1, 1].forEach(function (s) { var c = new T.CatmullRomCurve3([new T.Vector3(Math.cos(a + s * 0.25) * 0.12, 0, Math.sin(a + s * 0.25) * 0.12), new T.Vector3(Math.cos(a) * 0.03, 0.22, Math.sin(a) * 0.03), new T.Vector3(Math.cos(a) * 0.04, 0.44, Math.sin(a) * 0.04), new T.Vector3(Math.cos(a) * 0.07, 0.56, Math.sin(a) * 0.07)]); g.add(new T.Mesh(new T.TubeGeometry(c, 16, 0.008, 5), white)); }); }
    cyl(g, white, 0.012, 0.012, 0.56, 0, 0, 0, 8); // the lift core
    // the saucer top
    var sau = lathe([[0.02, 0], [0.13, 0.03], [0.14, 0.04], [0.11, 0.06], [0.05, 0.08], [0, 0.08]], 24, mat(winTex('sn', '#e8eef2', '#4a6a8a', 16, 1, { tall: 0.6 }), 2, 1)); sau.position.y = 0.55; g.add(sau);
    var hal = new T.Mesh(new T.TorusGeometry(0.135, 0.008, 4, 24), orange); hal.rotation.x = Math.PI / 2; hal.position.y = 0.585; g.add(hal);
    cyl(g, white, 0.004, 0.008, 0.08, 0, 0.63, 0, 6);
    [[-0.45, 0.3], [0.45, 0.3], [-0.45, -0.3], [0.45, -0.3], [0, 0.45]].forEach(function (q) { tree(g, q[0], q[1], 1.2, '#2f6b3a'); });
    return g;
  };

  /* ---------- Leshan Giant Buddha ---------- */
  M.custom.leshan = function () {
    var g = new T.Group(), rock = solid('#a88a6a', { flatShading: true }), rockD = solid('#8a6e52');
    water(g, 1.5, 0.4, 0, 0.42, '#7a8a6a');
    blob(g, '#5f8a4a', 0.74, 0.4, 0, -0.25, 0.006, 3);
    // the cliff with a niche carved into it
    box(g, rock, 1.0, 0.62, 0.3, 0, 0.006, -0.25);
    box(g, solid('#5f8a4a'), 1.0, 0.02, 0.3, 0, 0.626, -0.25);
    box(g, rockD, 0.36, 0.6, 0.06, 0, 0.006, -0.1);
    // the seated Buddha
    var B = new T.Group();
    box(B, rock, 0.24, 0.1, 0.12, 0, 0, 0.05); // knees and feet
    [-0.06, 0.06].forEach(function (x) { box(B, solid('#9a7a5a'), 0.05, 0.03, 0.06, x, 0, 0.13); });
    var body = lathe([[0.13, 0], [0.13, 0.12], [0.11, 0.22], [0.08, 0.28], [0, 0.29]], 12, rock); body.scale.z = 0.5; body.position.set(0, 0.1, 0); B.add(body);
    [-1, 1].forEach(function (s) { box(B, rock, 0.03, 0.18, 0.04, s * 0.12, 0.12, 0.04); });
    var head = new T.Mesh(new T.SphereGeometry(0.07, 12, 10), rock); head.scale.set(0.9, 1.1, 0.8); head.position.set(0, 0.47, 0.0); B.add(head);
    for (var i = 0; i < 24; i++) { var a = hash(i, 1) * Math.PI, b = hash(i, 2) * 1.1, cu = new T.Mesh(new T.SphereGeometry(0.009, 5, 4), solid('#5a5048')); cu.position.set(Math.cos(a) * Math.sin(b) * 0.064, 0.47 + Math.cos(b) * 0.076, Math.sin(a) * Math.sin(b) * 0.04 + 0.01); B.add(cu); }
    [-1, 1].forEach(function (s) { box(B, rock, 0.014, 0.08, 0.02, s * 0.065, 0.42, 0); });
    B.position.set(0, 0.006, -0.08); g.add(B);
    jungle(g, 16, 0.3, 0.5, 4, 0.62);
    // a tour boat on the river
    var bt = new T.Group(); box(bt, solid('#e8e2d4'), 0.05, 0.02, 0.12, 0, 0, 0); box(bt, solid('#c0392b'), 0.045, 0.02, 0.06, 0, 0.02, 0); bt.position.set(0.2, 0.01, 0.38); bt.rotation.y = Math.PI / 2; g.add(bt);
    return g;
  };

  /* ---------- Zhangjiajie ---------- */
  M.custom.zhangjiajie = function () {
    var g = new T.Group();
    blob(g, '#4f8a4a', 0.74, 0.62, 0, 0, 0.006, 5);
    for (var i = 0; i < 16; i++) {
      var a = hash(i, 1) * D2, r = Math.sqrt(hash(i, 2)) * 0.5, h = 0.3 + hash(i, 3) * 0.4, w = 0.035 + hash(i, 4) * 0.03;
      mountain(g, { h: h, pos: [Math.cos(a) * r, Math.sin(a) * r * 0.8], seg: 7, rings: 10, r: function (t) { return w * (1.2 - t * 0.35) * (t > 0.92 ? Math.max(0.3, 1 - (t - 0.92) * 8) : 1); }, bump: 0.25, seed: i, colour: function (x, y) { return y > h - 0.04 ? '#3f8a3f' : noise(x * 20, y * 20) > 0.6 ? '#5f8a4a' : (noise(x * 10, y * 30) > 0.5 ? '#a8a090' : '#8f877a'); } });
      for (var k = 0; k < 2; k++) { var c = new T.Mesh(new T.IcosahedronGeometry(w * 0.6, 0), solid('#2f7a3a', { flatShading: true })); c.position.set(Math.cos(a) * r + (k - 0.5) * w * 0.8, h + 0.005, Math.sin(a) * r * 0.8); g.add(c); }
    }
    for (var m = 0; m < 4; m++) { var cl = new T.Mesh(new T.SphereGeometry(0.08, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.6 })); cl.scale.y = 0.3; cl.position.set(-0.3 + m * 0.2, 0.2 + hash(m, 9) * 0.1, -0.05 + hash(m, 8) * 0.2); g.add(cl); }
    return g;
  };

  /* ---------- Meteora ---------- */
  M.custom.meteora = function () {
    var g = new T.Group(), wall = solid('#e8dcc4'), roof = solid('#b85a3a');
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    var P = [[-0.22, -0.1, 0.5, 0.14], [0.18, -0.15, 0.6, 0.15], [0.42, 0.15, 0.4, 0.1], [-0.45, 0.2, 0.35, 0.1]];
    P.forEach(function (p, i) {
      mountain(g, { h: p[2], pos: [p[0], p[1]], rings: 12, r: function (t) { return t > 0.9 ? p[3] * (1 - (t - 0.9) * 6) : p[3] * (1 + Math.sin(t * 9) * 0.05); }, bump: 0.18, seed: i * 3, colour: function (x, y) { return noise(x * 10, y * 22) > 0.55 ? '#7a6a5a' : '#9a8a78'; } });
      if (i > 1) return;
      var o = new T.Group(); box(o, wall, 0.12, 0.05, 0.08, 0, 0, 0); hip(o, roof, 0.15, 0.1, 0.03, 0, 0.05, 0, 0.4); box(o, wall, 0.04, 0.08, 0.04, 0.05, 0, 0.02); cyl(o, roof, 0, 0.03, 0.03, 0.05, 0.08, 0.02, 4, Math.PI / 4); var dm = new T.Mesh(new T.SphereGeometry(0.02, 8, 6, 0, D2, 0, Math.PI / 2), solid('#8a3a2a')); dm.position.set(-0.03, 0.08, 0); o.add(dm);
      o.position.set(p[0], p[2] - 0.02, p[1]); g.add(o);
    });
    for (var t = 0; t < 14; t++) { var a = t / 14 * D2, r = 0.58 + hash(t, 1) * 0.1; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.2, '#3f7a44'); }
    var ry = new T.Mesh(new T.CylinderGeometry(0.002, 0.002, 0.42), solid('#3a3a3a')); ry.rotation.z = 1.4; ry.position.set(-0.02, 0.5, -0.12); g.add(ry);
    return g;
  };

  /* ---------- Pamukkale ---------- */
  M.custom.pamukkale = function () {
    var g = new T.Group(), white = solid('#f6f8fa', { flatShading: true }), pool = solid('#7fd8e8');
    blob(g, '#9ab070', 0.74, 0.62, 0, 0, 0.006, 3);
    // white travertine terraces stepping down a hillside, each with a turquoise pool
    for (var r = 0; r < 6; r++) for (var c = 0; c < 5 - (r % 2); c++) {
      var x = -0.36 + c * 0.18 + (r % 2) * 0.09, z = 0.3 - r * 0.11, y = r * 0.05, w = 0.16 + hash(r, c) * 0.03;
      var t = new T.Mesh(new T.CylinderGeometry(w * 0.55, w * 0.6, 0.05 + y, 10), white); t.scale.z = 0.6; t.position.set(x, (0.05 + y) / 2, z); g.add(t);
      var p = new T.Mesh(new T.CircleGeometry(w * 0.48, 10), pool); p.rotation.x = -Math.PI / 2; p.scale.y = 0.55; p.position.set(x, 0.052 + y, z); g.add(p);
      // little drips of white down the front
      for (var d = 0; d < 3; d++) { var dr = new T.Mesh(new T.ConeGeometry(0.008, 0.03, 4), white); dr.rotation.x = Math.PI; dr.position.set(x + (d - 1) * 0.03, 0.035 + y, z + w * 0.33); g.add(dr); }
    }
    // the ancient city of Hierapolis on top
    [[-0.2, -0.42], [0.1, -0.45], [0.3, -0.4]].forEach(function (q) { for (var k = 0; k < 4; k++) cyl(g, solid('#d8c9a8'), 0.006, 0.006, 0.06, q[0] + k * 0.025, 0.3, q[1], 6); });
    for (var t2 = 0; t2 < 6; t2++) tree(g, -0.55 + t2 * 0.22, -0.52, 1.0, '#4f8a3a');
    return g;
  };

  /* ---------- Sheikh Zayed Grand Mosque ---------- */
  M.custom.sheikhzayed = function () {
    var g = new T.Group(), white = solid('#f8f8f4'), marble = mat(stoneTex('szm', '#f6f6f2', '#e2e2dc', 16, 16), 4, 4), gold = solid('#e8b52a', { emissive: '#4a3200' });
    blob(g, '#d8d2c2', 0.74, 0.62, 0, 0, 0.006, 2);
    water(g, 0.9, 0.08, 0, 0.36, '#4fa8d8');
    box(g, marble, 0.9, 0.03, 0.62, 0, 0.006, -0.04);
    box(g, solid('#e2ecd8'), 0.5, 0.004, 0.3, 0, 0.036, 0.02); // the courtyard with its flower mosaic
    // arcades round the courtyard topped by small domes
    [[0, -0.3, 0.8, 0.08], [-0.4, 0, 0.08, 0.6], [0.4, 0, 0.08, 0.6], [0, 0.26, 0.8, 0.06]].forEach(function (q) { box(g, white, q[2], 0.06, q[3], q[0], 0.036, q[1]); var n = Math.round(Math.max(q[2], q[3]) / 0.08); for (var i = 0; i < n; i++) { var t = (i + 0.5) / n, x = q[2] > q[3] ? q[0] - q[2] / 2 + t * q[2] : q[0], z = q[2] > q[3] ? q[1] : q[1] - q[3] / 2 + t * q[3]; dome(g, white, 0.022, x, 0.096, z, 1.3); } });
    // the main prayer hall with big domes
    box(g, white, 0.4, 0.1, 0.12, 0, 0.036, -0.26);
    [[0, 0.09], [-0.13, 0.06], [0.13, 0.06]].forEach(function (q) { cyl(g, white, q[1], q[1], 0.03, q[0], 0.136, -0.26, 16); dome(g, white, q[1], q[0], 0.166, -0.26, 1.35); var f = new T.Mesh(new T.ConeGeometry(0.008, 0.04, 6), gold); f.position.set(q[0], 0.166 + q[1] * 1.35 + 0.02, -0.26); g.add(f); });
    // four minarets
    [[0.42, 0.28], [-0.42, 0.28], [0.42, -0.34], [-0.42, -0.34]].forEach(function (q) { cyl(g, white, 0.018, 0.024, 0.36, q[0], 0.036, q[1], 8); [0.16, 0.28].forEach(function (y) { cyl(g, white, 0.03, 0.03, 0.01, q[0], 0.036 + y, q[1], 8); }); dome(g, gold, 0.02, q[0], 0.396, q[1], 1.6); });
    for (var p = 0; p < 6; p++) palm(g, -0.5 + p * 0.2, 0.48, 1.1);
    return g;
  };

  /* ---------- Hassan II Mosque ---------- */
  M.custom.hassan2 = function () {
    var g = new T.Group(), wall = mat(winTex('h2w', '#f2ece0', '#2f8a7a', 8, 2, { tall: 0.6 }), 4, 1), green = solid('#3f9a7a', { flatShading: true }), tile = mat(tex('h2t', 32, 64, function (c, W, H) { c.fillStyle = '#e8dcc4'; c.fillRect(0, 0, W, H); for (var y = 4; y < H; y += 12) for (var x = 2; x < W; x += 8) { c.fillStyle = '#2f8a7a'; c.beginPath(); c.moveTo(x + 3, y); c.lineTo(x + 6, y + 4); c.lineTo(x + 3, y + 8); c.lineTo(x, y + 4); c.fill(); } }), 1, 4);
    blob(g, '#2f7fb8', 0.74, 0.62, 0, 0.1, 0.006, 6);
    blob(g, '#d8d2c2', 0.62, 0.3, -0.05, -0.28, 0.01, 2);
    box(g, solid('#e8e2d4'), 0.5, 0.03, 0.3, 0.1, 0.0, 0.08); // the platform over the sea
    box(g, wall, 0.44, 0.1, 0.24, 0.1, 0.03, 0.08);
    hip(g, green, 0.48, 0.28, 0.05, 0.1, 0.13, 0.08, 0.5);
    for (var i = 0; i < 7; i++) arch(g, solid('#2f6a5a'), 0.03, 0.06, 0.1 - 0.18 + i * 0.06, 0.03, 0.201, 0.003);
    // the 210 m minaret
    box(g, tile, 0.08, 0.6, 0.08, -0.22, 0.01, -0.12);
    box(g, solid('#e8dcc4'), 0.09, 0.02, 0.09, -0.22, 0.61, -0.12);
    box(g, tile, 0.05, 0.08, 0.05, -0.22, 0.63, -0.12);
    dome(g, solid('#2f8a7a'), 0.026, -0.22, 0.71, -0.12, 1.2);
    for (var k = 0; k < 3; k++) { var b = new T.Mesh(new T.SphereGeometry(0.008, 6, 5), solid('#e8b52a', { emissive: '#4a3200' })); b.position.set(-0.22, 0.75 + k * 0.016, -0.12); g.add(b); }
    for (var w = 0; w < 5; w++) { var f = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), solid('#ffffff')); f.scale.y = 0.2; f.position.set(0.4, 0.008, -0.1 + w * 0.1); g.add(f); }
    for (var p = 0; p < 4; p++) palm(g, -0.45 + p * 0.1, -0.4, 1.0);
    return g;
  };
})();
