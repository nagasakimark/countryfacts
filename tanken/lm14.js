/* Detailed landmarks, batch 14: Okavango Delta, Caño Cristales, Kuwait Towers, Gergeti Trinity Church,
   St Sophia's Cathedral (Kyiv), Maldives water villas, Arenal Volcano, Zuma Rock. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch, acacia = K.acacia;
  var D2 = Math.PI * 2;
  function disc(g, col, r, x, y, z, sx) { var d = new T.Mesh(new T.CircleGeometry(r, 28), solid(col)); d.rotation.x = -Math.PI / 2; d.scale.x = sx || 1; d.position.set(x, y, z); g.add(d); return d; }
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 14, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function jungle(g, n, r0, r1, seed, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- Okavango Delta ---------- */
  M.custom.okavango = function () {
    var g = new T.Group();
    blob(g, '#c9b470', 0.74, 0.62, 0, 0, 0.006, 3);
    // channels spreading out like fingers, with green islands between
    for (var i = 0; i < 6; i++) { var a = -0.9 + i * 0.36, ch = new T.Mesh(new T.PlaneGeometry(0.05, 0.7), solid('#4a9fc8')); ch.rotation.set(-Math.PI / 2, 0, a); ch.position.set(Math.sin(a) * 0.25, 0.01, 0.1 - Math.cos(a) * 0.25 + 0.2); g.add(ch); }
    blob(g, '#4a9fc8', 0.12, 0.08, 0, -0.38, 0.011, 2);
    for (var k = 0; k < 9; k++) blob(g, '#6aa850', 0.06 + hash(k, 1) * 0.04, 0.04, -0.45 + k * 0.11, 0.05 + hash(k, 2) * 0.2, 0.013, k);
    // elephants and hippos
    function ele(x, z, ry, s) { var a = new T.Group(), m = solid('#8a8a8f'); box(a, m, 0.03, 0.026, 0.05, 0, 0.026, 0); [[0.009, 0.018], [-0.009, 0.018], [0.009, -0.018], [-0.009, -0.018]].forEach(function (q) { box(a, m, 0.008, 0.026, 0.008, q[0], 0, q[1]); }); box(a, m, 0.022, 0.022, 0.016, 0, 0.034, 0.03); box(a, m, 0.006, 0.03, 0.006, 0, 0.01, 0.04); [0.014, -0.014].forEach(function (x2) { box(a, m, 0.004, 0.02, 0.016, x2, 0.03, 0.028); }); a.position.set(x, 0.01, z); a.rotation.y = ry; a.scale.setScalar(s); g.add(a); }
    ele(-0.2, 0.15, 0.6, 1.6); ele(-0.1, 0.22, 0.4, 1.3); ele(0.25, -0.05, -1.2, 1.5);
    [[0.05, 0.3], [0.1, 0.33]].forEach(function (q) { var h = new T.Mesh(new T.SphereGeometry(0.018, 7, 5), solid('#7a6a6a')); h.scale.set(1, 0.5, 1.4); h.position.set(q[0], 0.014, q[1]); g.add(h); });
    for (var t = 0; t < 8; t++) { var a2 = t / 8 * D2; if (Math.sin(a2) > 0.7) continue; acacia(g, Math.cos(a2) * 0.58, Math.sin(a2) * 0.48, 1.3); }
    for (var p = 0; p < 4; p++) palm(g, -0.4 + p * 0.25, -0.2, 1.0);
    return g;
  };

  /* ---------- Caño Cristales (River of Five Colours) ---------- */
  M.custom.canocristales = function () {
    var g = new T.Group();
    blob(g, '#6a9a4a', 0.74, 0.62, 0, 0, 0.006, 4);
    // a winding rocky river bed
    var pts = []; for (var i = 0; i <= 20; i++) { var t = i / 20; pts.push(new T.Vector3((t - 0.5) * 1.3, 0.008, Math.sin(t * 7) * 0.15)); }
    var curve = new T.CatmullRomCurve3(pts), cols = ['#e8304a', '#f2c14e', '#4fb35a', '#2b8fd0', '#1a1a1a'];
    for (var s = 0; s < 60; s++) { var p = curve.getPoint(s / 60), tg = curve.getTangent(s / 60), nx = -tg.z, nz = tg.x; for (var w = -2; w <= 2; w++) { var c = new T.Mesh(new T.IcosahedronGeometry(0.02, 0), solid(w === 0 && s % 3 === 0 ? '#9fd8f0' : cols[(s + w * 3 + 10) % 5 === 4 ? 0 : (s + w * 3 + 10) % 5], { flatShading: true })); c.scale.y = 0.35; c.position.set(p.x + nx * w * 0.025, 0.012, p.z + nz * w * 0.025); g.add(c); } }
    for (var r = 0; r < 14; r++) { var rk = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(r, 1) * 0.03, 0), solid('#c9b48a', { flatShading: true })); rk.scale.y = 0.5; var pt = curve.getPoint(hash(r, 2)); rk.position.set(pt.x + (hash(r, 3) - 0.5) * 0.3, 0.01, pt.z + (hash(r, 3) > 0.5 ? 0.12 : -0.12)); g.add(rk); }
    jungle(g, 22, 0.42, 0.72, 5);
    return g;
  };

  /* ---------- Kuwait Towers ---------- */
  M.custom.kuwaittowers = function () {
    var g = new T.Group(), white = solid('#f2f4f6');
    var dots = mat(tex('kwd', 64, 32, function (c, W, H) { c.fillStyle = '#d8e8f0'; c.fillRect(0, 0, W, H); var cs = ['#2a6fb8', '#4fa8d8', '#1a4f8a', '#8ad0f0']; for (var y = 2; y < H; y += 5) for (var x = (y % 2) * 2; x < W; x += 5) { c.fillStyle = cs[(x + y) % 4]; c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); } }), 4, 2);
    blob(g, '#2f8fc0', 0.74, 0.62, 0, 0.25, 0.006, 5);
    blob(g, '#d8d2c2', 0.6, 0.3, 0, -0.25, 0.01, 2);
    // the main tower with two spheres
    cyl(g, white, 0.006, 0.02, 0.72, 0, 0, -0.1, 10);
    var s1 = new T.Mesh(new T.SphereGeometry(0.095, 20, 14), dots); s1.position.set(0, 0.3, -0.1); g.add(s1);
    var s2 = new T.Mesh(new T.SphereGeometry(0.055, 16, 12), dots); s2.position.set(0, 0.5, -0.1); g.add(s2);
    cyl(g, white, 0.002, 0.004, 0.12, 0, 0.72, -0.1, 6);
    // the second tower with one sphere, and the slim light tower
    cyl(g, white, 0.006, 0.016, 0.5, 0.18, 0, -0.05, 10); var s3 = new T.Mesh(new T.SphereGeometry(0.075, 18, 12), dots); s3.position.set(0.18, 0.22, -0.05); g.add(s3);
    cyl(g, white, 0.004, 0.012, 0.36, -0.16, 0, -0.04, 8);
    for (var p = 0; p < 4; p++) palm(g, -0.4 + p * 0.25, -0.35, 1.1);
    return g;
  };

  /* ---------- Gergeti Trinity Church (Georgia) ---------- */
  M.custom.gergeti = function () {
    var g = new T.Group(), st = mat(stoneTex('ggst', '#a8957a', '#8a7a62', 10, 5), 2, 1), roof = solid('#6a5a48');
    blob(g, '#6a9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.85, pos: [0.05, -0.42], r: function (t) { return 0.42 * (1 - t) + 0.02; }, bump: 0.3, sx: 1.3, sz: 0.5, colour: function (x, y) { return y > 0.45 ? '#f6f8fa' : y > 0.25 ? '#8a8a84' : '#5f8a4a'; } });
    mountain(g, { h: 0.22, pos: [0, 0.05], r: function (t) { return 0.4 * (1 - t) + 0.06; }, bump: 0.25, sx: 1.2, colour: function (x, y, z) { return noise(x * 12, z * 12) > 0.5 ? '#6f9a4a' : '#5f8a44'; } });
    var Y = 0.21;
    box(g, st, 0.14, 0.09, 0.08, 0, Y, 0.05); ridge(g, roof, 0.15, 0.04, 0.09, 0, Y + 0.09, 0.05, 0);
    box(g, st, 0.07, 0.09, 0.16, 0, Y, 0.05); ridge(g, roof, 0.08, 0.04, 0.17, 0, Y + 0.09, 0.05, Math.PI / 2);
    cyl(g, st, 0.028, 0.03, 0.07, 0, Y + 0.09, 0.05, 8); cyl(g, roof, 0, 0.035, 0.05, 0, Y + 0.16, 0.05, 8);
    box(g, st, 0.04, 0.12, 0.04, 0.12, Y - 0.01, 0.1); ridge(g, roof, 0.05, 0.03, 0.05, 0.12, Y + 0.11, 0.1);
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; if (Math.sin(a) < -0.3) continue; tree(g, Math.cos(a) * 0.55, 0.05 + Math.sin(a) * 0.45, 1.2, '#2f6b3a'); }
    return g;
  };

  /* ---------- St Sophia's Cathedral, Kyiv ---------- */
  M.custom.stsophia = function () {
    var g = new T.Group(), white = mat(winTex('ssw', '#f6f3ea', '#4a5a6a', 6, 2, { tall: 0.5 }), 3, 1), green = solid('#3f9a6a'), gold = solid('#e8b52a', { emissive: '#4a3200' });
    blob(g, '#8ab070', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#d8d2c2'), 0.8, 0.006, 0.7, 0, 0.006, 0);
    box(g, white, 0.5, 0.16, 0.34, 0, 0.006, -0.08);
    var domes = [[0, -0.08, 0.06, 0.24, gold], [-0.13, -0.16, 0.035, 0.2, green], [0.13, -0.16, 0.035, 0.2, green], [-0.13, 0.0, 0.035, 0.2, green], [0.13, 0.0, 0.035, 0.2, green], [-0.22, -0.08, 0.028, 0.18, green], [0.22, -0.08, 0.028, 0.18, green], [-0.06, -0.2, 0.025, 0.18, green], [0.06, -0.2, 0.025, 0.18, green], [-0.06, 0.04, 0.025, 0.18, green], [0.06, 0.04, 0.025, 0.18, green], [-0.2, 0.06, 0.022, 0.17, green], [0.2, 0.06, 0.022, 0.17, green]];
    domes.forEach(function (d) { cyl(g, solid('#f6f3ea'), d[2] * 0.85, d[2] * 0.85, d[3] - 0.16, d[0], 0.166, d[1], 10); var o = new T.Mesh(new T.SphereGeometry(d[2], 12, 9), d[4]); o.scale.y = 1.3; o.position.set(d[0], d[3] + d[2] * 0.6, d[1]); g.add(o); var c = new T.Mesh(new T.ConeGeometry(d[2] * 0.4, d[2] * 1.2, 8), d[4]); c.position.set(d[0], d[3] + d[2] * 1.8, d[1]); g.add(c); box(g, gold, 0.003, 0.03, 0.003, d[0], d[3] + d[2] * 2.3, d[1]); });
    // the blue-and-white bell tower
    box(g, solid('#7fb8e0'), 0.1, 0.36, 0.1, 0, 0.006, 0.28); box(g, solid('#f6f3ea'), 0.105, 0.02, 0.105, 0, 0.12, 0.28); box(g, solid('#f6f3ea'), 0.105, 0.02, 0.105, 0, 0.24, 0.28);
    var bd = new T.Mesh(new T.SphereGeometry(0.04, 12, 9), gold); bd.scale.y = 1.3; bd.position.set(0, 0.4, 0.28); g.add(bd); var bc = new T.Mesh(new T.ConeGeometry(0.014, 0.06, 8), gold); bc.position.set(0, 0.47, 0.28); g.add(bc);
    [[-0.5, 0.3], [0.5, 0.3], [-0.55, -0.3], [0.55, -0.3]].forEach(function (q) { tree(g, q[0], q[1], 1.3, '#4f8a3a'); });
    return g;
  };

  /* ---------- Maldives water villas ---------- */
  M.custom.maldives = function () {
    var g = new T.Group(), thatch = solid('#c9a46a', { flatShading: true }), wood = solid('#8a6a4a');
    disc(g, '#3fb8d0', 0.74, 0, 0.006, 0, 1.15);
    var lag = new T.Mesh(new T.RingGeometry(0.0, 0.5, 30), solid('#7fe0e0')); lag.rotation.x = -Math.PI / 2; lag.scale.x = 1.2; lag.position.y = 0.008; g.add(lag);
    blob(g, '#f6eed8', 0.26, 0.16, -0.25, -0.2, 0.014, 3); blob(g, '#5fa84a', 0.16, 0.09, -0.27, -0.22, 0.02, 5);
    for (var p = 0; p < 6; p++) { var t = new T.Group(); palm(t, 0, 0, 1.2); t.position.set(-0.4 + p * 0.06, 0.02, -0.25 + hash(p, 1) * 0.08); g.add(t); }
    // a curved jetty with villas on stilts
    var pts = []; for (var i = 0; i < 9; i++) { var a = -0.3 + i * 0.25; pts.push([-0.05 + Math.cos(a) * 0.35, Math.sin(a) * 0.3 + 0.05]); }
    for (var k = 0; k < pts.length - 1; k++) { var a0 = pts[k], a1 = pts[k + 1], L = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), b = box(g, wood, 0.02, 0.005, L, (a0[0] + a1[0]) / 2, 0.03, (a0[1] + a1[1]) / 2); b.rotation.y = Math.atan2(a1[0] - a0[0], a1[1] - a0[1]); }
    pts.forEach(function (q, i) { if (i % 2) return; for (var l = 0; l < 4; l++) cyl(g, wood, 0.003, 0.003, 0.035, q[0] + (l % 2 ? 0.025 : -0.025), 0.0, q[1] + (l < 2 ? 0.02 : -0.02), 4); box(g, solid('#f4ecdc'), 0.06, 0.03, 0.05, q[0], 0.035, q[1]); var r = new T.Mesh(new T.ConeGeometry(0.05, 0.035, 4), thatch); r.rotation.y = Math.PI / 4; r.scale.z = 0.85; r.position.set(q[0], 0.083, q[1]); g.add(r); });
    var bt = new T.Group(); box(bt, solid('#ffffff'), 0.025, 0.012, 0.07, 0, 0, 0); bt.position.set(0.45, 0.01, 0.4); bt.rotation.y = 0.6; g.add(bt);
    return g;
  };

  /* ---------- Arenal Volcano ---------- */
  M.custom.arenal = function () {
    var g = new T.Group();
    blob(g, '#4f9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.7, pos: [0, -0.1], rings: 20, r: function (t) { return 0.52 * Math.pow(1 - t, 1.3) + 0.03; }, bump: 0.12, f: 4, colour: function (x, y, z) { return y > 0.56 ? '#5a5048' : y > 0.4 ? (noise(x * 20, y * 20) > 0.5 ? '#6a6a5a' : '#5f7a4a') : noise(x * 14, z * 14) > 0.5 ? '#3f8a3f' : '#2f7a3a'; } });
    for (var s = 0; s < 4; s++) { var sm = new T.Mesh(new T.SphereGeometry(0.04 + s * 0.012, 8, 6), solid('#e8e8ec', { transparent: true, opacity: 0.8 })); sm.position.set(0.02 + s * 0.03, 0.75 + s * 0.05, -0.1 - s * 0.02); g.add(sm); }
    blob(g, '#4ab8c8', 0.28, 0.12, 0.3, 0.4, 0.01, 4); // Lake Arenal
    blob(g, '#9fe0e8', 0.06, 0.04, -0.4, 0.38, 0.012, 2); // a hot spring pool
    jungle(g, 30, 0.48, 0.72, 3);
    return g;
  };

  /* ---------- Zuma Rock ---------- */
  M.custom.zuma = function () {
    var g = new T.Group();
    blob(g, '#9aa85a', 0.74, 0.62, 0, 0, 0.006, 4);
    mountain(g, { h: 0.6, pos: [0, -0.12], rings: 16, r: function (t) { return t < 0.75 ? 0.4 * (1 - t * 0.3) : 0.4 * 0.775 * Math.sqrt(Math.max(0, 1 - (t - 0.75) * 4)) + 0.01; }, bump: 0.12, sx: 1.25, sz: 0.85, jag: 0.006, colour: function (x, y, z) { return noise(x * 6, y * 16) > 0.62 ? '#4a4038' : (z > 0.1 && Math.abs(x) < 0.15 && y > 0.25 && y < 0.5 ? '#5a4e44' : '#8a7a6a'); } });
    // dark streaks that look like a face
    [[-0.07, 0.42], [0.07, 0.42]].forEach(function (q) { var e = new T.Mesh(new T.SphereGeometry(0.025, 8, 6), solid('#3a322c')); e.scale.set(1, 0.6, 0.3); e.position.set(q[0], q[1], 0.2); g.add(e); });
    var mo = new T.Mesh(new T.BoxGeometry(0.1, 0.012, 0.01), solid('#3a322c')); mo.position.set(0, 0.3, 0.24); g.add(mo);
    box(g, solid('#5a5a5f'), 1.4, 0.004, 0.06, 0, 0.008, 0.42);
    for (var t = 0; t < 8; t++) acacia(g, -0.55 + t * 0.15, 0.3 + hash(t, 1) * 0.06, 1.2);
    return g;
  };
})();
