/* Detailed landmarks, batch 21: Bagan, Mount Bromo, Mayon Volcano, Golden Bridge (Ba Na Hills), Lotus Temple,
   Qutub Minar, Goryōkaku, Nikkō Tōshō-gū. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function jungle(g, n, r0, r1, seed, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }
  function pine(g, x, z, s) { cyl(g, solid('#6b4a32'), 0.006 * s, 0.01 * s, 0.07 * s, x, 0, z, 5); for (var i = 0; i < 3; i++) { var c = new T.Mesh(new T.SphereGeometry(0.035 * s, 7, 4), solid(i % 2 ? '#2f6b3a' : '#3a7a44', { flatShading: true })); c.scale.y = 0.45; c.position.set(x + (i - 1) * 0.025 * s, 0.07 * s + i * 0.018 * s, z); g.add(c); } }
  function sakura(g, x, z, s) { cyl(g, solid('#5a3a28'), 0.005 * s, 0.008 * s, 0.05 * s, x, 0, z, 5); var c = new T.Mesh(new T.IcosahedronGeometry(0.04 * s, 0), solid('#f7b6cf', { flatShading: true })); c.position.set(x, 0.075 * s, z); g.add(c); }

  /* ---------- Bagan ---------- */
  M.custom.bagan = function () {
    var g = new T.Group(), brick = solid('#b8603a', { flatShading: true }), brickD = solid('#9a4a2e'), gold = solid('#e8b52a', { emissive: '#4a3200' });
    blob(g, '#a8a060', 0.74, 0.62, 0, 0, 0.006, 4);
    function temple(x, z, s, golden) { box(g, brick, 0.1 * s, 0.05 * s, 0.1 * s, x, 0.006, z); box(g, brickD, 0.08 * s, 0.03 * s, 0.08 * s, x, 0.006 + 0.05 * s, z); var sp = lathe([[0.035, 0], [0.03, 0.03], [0.02, 0.05], [0.012, 0.09], [0.004, 0.12], [0, 0.13]].map(function (p) { return [p[0] * s, p[1] * s]; }), 10, golden ? gold : brick); sp.position.set(x, 0.006 + 0.08 * s, z); g.add(sp); }
    for (var i = 0; i < 18; i++) { var a = hash(i, 1) * D2, r = Math.sqrt(hash(i, 2)) * 0.55; temple(Math.cos(a) * r, Math.sin(a) * r * 0.8, 0.6 + hash(i, 3) * 0.9, i === 4); }
    temple(0, -0.05, 2.0, false);
    for (var t = 0; t < 14; t++) { var c = new T.Mesh(new T.IcosahedronGeometry(0.025, 0), solid('#5f8a3a', { flatShading: true })); c.position.set(-0.6 + hash(t, 7) * 1.2, 0.03, -0.45 + hash(t, 8) * 0.9); g.add(c); }
    [['#e8473a', -0.3, 0.45, -0.2], ['#f2c14e', 0.2, 0.55, 0.1], ['#2b6fd0', 0.45, 0.4, -0.15]].forEach(function (b) { var o = new T.Group(), env = new T.Mesh(new T.SphereGeometry(0.045, 10, 8), solid(b[0])); env.scale.y = 1.2; o.add(env); box(o, solid('#8a5a32'), 0.014, 0.012, 0.014, 0, -0.07, 0); o.position.set(b[1], b[2], b[3]); g.add(o); });
    return g;
  };

  /* ---------- Mount Bromo ---------- */
  M.custom.mtbromo = function () {
    var g = new T.Group();
    blob(g, '#9a948a', 0.74, 0.62, 0, 0, 0.006, 4); // the Sea of Sand
    mountain(g, { h: 0.2, pos: [-0.05, -0.05], rings: 12, r: function (t) { return t < 0.8 ? 0.26 * (1 - t * 0.6) : 0.26 * 0.52 * (1 - (t - 0.8) * 0.3); }, bump: 0.1, f: 6, colour: function (x, y) { return y > 0.15 ? '#5a5048' : '#7a7068'; } });
    var crater = new T.Mesh(new T.CircleGeometry(0.1, 16), solid('#3a302a')); crater.rotation.x = -Math.PI / 2; crater.position.set(-0.05, 0.19, -0.05); g.add(crater);
    for (var s = 0; s < 5; s++) { var sm = new T.Mesh(new T.SphereGeometry(0.05 + s * 0.015, 8, 6), solid('#f2f2f2', { transparent: true, opacity: 0.75 })); sm.position.set(-0.05 + s * 0.04, 0.24 + s * 0.06, -0.08 - s * 0.02); g.add(sm); }
    // Batok, the green ribbed cone next door
    mountain(g, { h: 0.24, pos: [0.3, 0.05], rings: 12, r: function (t) { return 0.15 * (1 - t) + 0.01; }, bump: 0.25, f: 12, seed: 4, colour: function (x, y, z) { return Math.sin(Math.atan2(z - 0.05, x - 0.3) * 14) > 0 ? '#5f8a3a' : '#4a6a2e'; } });
    // Semeru smoking in the distance
    mountain(g, { h: 0.55, pos: [0.1, -0.5], r: function (t) { return 0.3 * (1 - t) + 0.02; }, bump: 0.15, sz: 0.5, seed: 8, colour: function (x, y) { return y > 0.4 ? '#5a5048' : '#4f7a3a'; } });
    // steps up to the crater and a temple
    box(g, solid('#d8d2c2'), 0.02, 0.004, 0.2, -0.05, 0.1, 0.18).rotation.x = -0.6;
    box(g, solid('#8a6a52'), 0.06, 0.04, 0.05, -0.3, 0.006, 0.3); hip(g, solid('#2a2420'), 0.08, 0.07, 0.04, -0.3, 0.046, 0.3, 0.3);
    [[0.0, 0.42], [0.06, 0.45]].forEach(function (q) { var h = new T.Group(), b = solid('#6a4a32'); box(h, b, 0.012, 0.016, 0.035, 0, 0.022, 0); [[0.004, 0.012], [-0.004, 0.012], [0.004, -0.012], [-0.004, -0.012]].forEach(function (l) { box(h, b, 0.003, 0.022, 0.003, l[0], 0, l[1]); }); box(h, b, 0.008, 0.02, 0.008, 0, 0.032, 0.016); h.position.set(q[0], 0.006, q[1]); h.scale.setScalar(1.6); g.add(h); });
    return g;
  };

  /* ---------- Mayon Volcano ---------- */
  M.custom.mayon = function () {
    var g = new T.Group();
    blob(g, '#5f9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.75, pos: [0, -0.1], rings: 22, r: function (t) { return 0.5 * Math.pow(1 - t, 1.6) + 0.015; }, bump: 0.05, f: 8, colour: function (x, y, z) { return y > 0.5 ? (noise(x * 20, y * 20) > 0.5 ? '#6a6058' : '#7a7068') : y > 0.3 ? (noise(x * 14, z * 14) > 0.5 ? '#6f8a4a' : '#7a7468') : noise(x * 12, z * 12) > 0.5 ? '#3f8a3f' : '#4f9a4a'; } });
    for (var s = 0; s < 4; s++) { var sm = new T.Mesh(new T.SphereGeometry(0.035 + s * 0.012, 8, 6), solid('#f6f6f6', { transparent: true, opacity: 0.8 })); sm.position.set(s * 0.035, 0.8 + s * 0.04, -0.1); g.add(sm); }
    // rice paddies and the Cagsawa bell tower ruin
    for (var p = 0; p < 6; p++) box(g, solid(p % 2 ? '#8ac860' : '#a8d870'), 0.14, 0.004, 0.1, -0.4 + (p % 3) * 0.16, 0.008, 0.36 + Math.floor(p / 3) * 0.12);
    box(g, mat(stoneTex('cags', '#8a7e6e', '#6f6558', 4, 6), 1, 2), 0.05, 0.14, 0.05, 0.38, 0.006, 0.35);
    for (var q = 0; q < 6; q++) { var pl = new T.Group(); cyl(pl, solid('#8a6a3a'), 0.005, 0.008, 0.12, 0, 0, 0, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.06, 0.004, 0.018), solid('#3f9a4a')); l.position.set(Math.cos(i * 1.26) * 0.025, 0.12, Math.sin(i * 1.26) * 0.025); l.rotation.set(0, -i * 1.26, -0.4); pl.add(l); } pl.position.set(0.5 - q * 0.08, 0.006, 0.5 - (q % 2) * 0.05); g.add(pl); }
    return g;
  };

  /* ---------- Golden Bridge, Ba Na Hills ---------- */
  M.custom.goldenbridge = function () {
    var g = new T.Group(), gold = solid('#e8b52a', { emissive: '#4a3200' }), hand = solid('#8a8478', { flatShading: true });
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.3, pos: [0, -0.3], r: function (t) { return 0.6 * (1 - t) + 0.04; }, bump: 0.3, sx: 1.2, sz: 0.6, colour: function (x, y, z) { return noise(x * 12, z * 12) > 0.5 ? '#2f6b3a' : '#3f7a44'; } });
    // the curving golden walkway
    var pts = []; for (var i = 0; i <= 24; i++) { var a = Math.PI * (0.15 + i / 24 * 0.7); pts.push(new T.Vector3(Math.cos(a) * 0.4, 0.3, -0.05 + Math.sin(a) * 0.28)); }
    var c = new T.CatmullRomCurve3(pts);
    for (var k = 0; k < 24; k++) { var p0 = c.getPoint(k / 24), p1 = c.getPoint((k + 1) / 24), L = p0.distanceTo(p1), s = box(g, gold, 0.06, 0.012, L + 0.002, (p0.x + p1.x) / 2, 0.3, (p0.z + p1.z) / 2); s.rotation.y = Math.atan2(p1.x - p0.x, p1.z - p0.z); [-1, 1].forEach(function (sd) { var r = box(g, gold, 0.004, 0.02, L, (p0.x + p1.x) / 2 + Math.cos(s.rotation.y) * sd * 0.03, 0.312, (p0.z + p1.z) / 2 - Math.sin(s.rotation.y) * sd * 0.03); r.rotation.y = s.rotation.y; }); }
    // two giant mossy stone hands holding it up
    [0.33, 0.67].forEach(function (t) { var p = c.getPoint(t), H = new T.Group(); box(H, hand, 0.06, 0.26, 0.05, 0, 0, 0); box(H, hand, 0.09, 0.04, 0.06, 0, 0.24, 0); for (var f = 0; f < 4; f++) { var fi = box(H, hand, 0.016, 0.06, 0.016, -0.03 + f * 0.02, 0.27, 0.0); fi.rotation.x = -0.6; } var th = box(H, hand, 0.016, 0.05, 0.016, 0.05, 0.24, 0.0); th.rotation.z = -0.5; H.position.set(p.x, 0.0, p.z + 0.04); H.lookAt(0, 0, -0.05); g.add(H); });
    jungle(g, 20, 0.35, 0.72, 3);
    for (var m = 0; m < 3; m++) { var cl = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.6 })); cl.scale.y = 0.35; cl.position.set(-0.3 + m * 0.3, 0.22, 0.25); g.add(cl); }
    return g;
  };

  /* ---------- Lotus Temple ---------- */
  M.custom.lotustemple = function () {
    var g = new T.Group(), white = solid('#f8f8f4', { flatShading: true }), pool = solid('#4fa8d8');
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    for (var w = 0; w < 9; w++) { var a = w / 9 * D2, pl = new T.Mesh(new T.CircleGeometry(0.1, 3), pool); pl.rotation.x = -Math.PI / 2; pl.rotation.z = a; pl.position.set(Math.cos(a) * 0.3, 0.012, Math.sin(a) * 0.3); g.add(pl); }
    cyl(g, solid('#e8e2d4'), 0.26, 0.28, 0.04, 0, 0.006, 0, 18);
    // three rings of nine petals
    function petal(len, wid, tilt) { var geo = new T.SphereGeometry(1, 10, 8, 0, Math.PI, 0, Math.PI), m = new T.Mesh(geo, white); m.scale.set(wid, len, wid * 0.6); return m; }
    [[0.14, 0.05, 0.6, 0.19, 0.0], [0.17, 0.05, 0.35, 0.12, Math.PI / 9], [0.2, 0.045, 0.08, 0.04, 0.0]].forEach(function (r) { for (var i = 0; i < 9; i++) { var a = i / 9 * D2 + r[4], p = petal(r[0], r[1]); var o = new T.Group(); p.position.y = r[0]; o.add(p); o.position.set(Math.cos(a) * r[3], 0.046, Math.sin(a) * r[3]); o.rotation.set(0, -a + Math.PI / 2, 0); o.rotateX(-r[2]); g.add(o); } });
    for (var t = 0; t < 10; t++) { var b = t / 10 * D2; tree(g, Math.cos(b) * 0.58, Math.sin(b) * 0.5, 1.1, '#4f8a3a'); }
    return g;
  };

  /* ---------- Qutub Minar ---------- */
  M.custom.qutub = function () {
    var g = new T.Group(), red = solid('#b8603a', { flatShading: true }), cream = solid('#e8d4b0');
    blob(g, '#9ab070', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#c9b48e'), 0.5, 0.01, 0.5, 0, 0.006, 0);
    // five fluted storeys separated by balconies
    var y = 0.016, r = 0.065; [[0.18, 1], [0.13, 1], [0.1, 1], [0.07, 0], [0.06, 0]].forEach(function (s, k) {
      var geo = new T.CylinderGeometry(r * 0.82, r, s[0], 24, 1), p = geo.attributes.position; for (var i = 0; i < p.count; i++) { var x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), f = 1 + Math.abs(Math.sin(a * 12)) * 0.08; p.setX(i, x * f); p.setZ(i, z * f); } geo.computeVertexNormals();
      var m = new T.Mesh(geo, s[1] ? red : cream); m.position.y = y + s[0] / 2; g.add(m); y += s[0]; r *= 0.82;
      var bal = new T.Mesh(new T.CylinderGeometry(r * 1.35, r * 1.2, 0.012, 20), solid('#d8c4a0')); bal.position.y = y; g.add(bal); y += 0.012;
    });
    cyl(g, cream, 0.01, 0.014, 0.03, 0, y, 0, 8);
    // the ruined mosque arches and the Iron Pillar
    for (var a = 0; a < 4; a++) { box(g, red, 0.03, 0.12, 0.03, -0.3 + a * 0.08, 0.016, -0.25); } box(g, red, 0.28, 0.03, 0.03, -0.18, 0.136, -0.25);
    cyl(g, solid('#3a3a3e'), 0.008, 0.008, 0.1, 0.22, 0.016, 0.15, 8);
    for (var t = 0; t < 8; t++) { var b = t / 8 * D2; tree(g, Math.cos(b) * 0.6, Math.sin(b) * 0.5, 1.1, '#4f8a3a'); }
    return g;
  };

  /* ---------- Goryōkaku ---------- */
  M.custom.goryokaku = function () {
    var g = new T.Group();
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    // a five-pointed star fort: moat, then raised grassy ramparts
    function star(R, r) { var s = new T.Shape(); for (var i = 0; i < 10; i++) { var a = i / 10 * D2 - Math.PI / 2, rr = i % 2 ? r : R; if (i) s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } return s; }
    var moat = new T.Mesh(new T.ShapeGeometry(star(0.5, 0.36)), solid('#3f8fb8')); moat.rotation.x = -Math.PI / 2; moat.position.y = 0.01; g.add(moat);
    var fort = new T.Mesh(new T.ExtrudeGeometry(star(0.42, 0.3), { depth: 0.04, bevelEnabled: false }), mat(stoneTex('gorst', '#a8a090', '#8a8478', 12, 2), 6, 1)); fort.rotation.x = -Math.PI / 2; fort.position.y = 0.01; g.add(fort);
    var top = new T.Mesh(new T.ShapeGeometry(star(0.41, 0.29)), solid('#6aa850')); top.rotation.x = -Math.PI / 2; top.position.y = 0.052; g.add(top);
    // cherry trees all round the star and the rebuilt magistrate's office in the middle
    for (var i = 0; i < 20; i++) { var a = i / 20 * D2 - Math.PI / 2, rr = i % 2 ? 0.3 : 0.38; sakura(g, Math.cos(a) * rr * 0.92, Math.sin(a) * rr * 0.92, 1.0); }
    var o = new T.Group(); box(o, solid('#f2ece0'), 0.14, 0.04, 0.08, 0, 0, 0); hip(o, solid('#4a4a50'), 0.18, 0.11, 0.04, 0, 0.04, 0, 0.4); box(o, solid('#f2ece0'), 0.04, 0.03, 0.04, 0, 0.08, 0); hip(o, solid('#4a4a50'), 0.06, 0.06, 0.03, 0, 0.11, 0, 0.2); o.position.y = 0.052; g.add(o);
    // Goryōkaku Tower beside it
    cyl(g, solid('#d8dce0'), 0.015, 0.02, 0.45, 0.55, 0.006, -0.3, 8); var tp = new T.Mesh(new T.CylinderGeometry(0.05, 0.03, 0.06, 5), mat(winTex('gtw', '#e8ecf0', '#4a6a8a', 6, 1, { tall: 0.6 }), 1, 1)); tp.position.set(0.55, 0.47, -0.3); g.add(tp);
    return g;
  };

  /* ---------- Nikkō Tōshō-gū ---------- */
  M.custom.nikko = function () {
    var g = new T.Group(), gold = solid('#e8b52a', { emissive: '#4a3200' }), white = solid('#f8f6f0'), black = solid('#2a2626'), red = solid('#c83a2a');
    var carv = mat(tex('nikc', 64, 32, function (c, W, H) { c.fillStyle = '#f2ece0'; c.fillRect(0, 0, W, H); var cs = ['#2f8a7a', '#c83a2a', '#2b6fd0', '#e8b52a', '#4fb35a']; for (var i = 0; i < 40; i++) { c.fillStyle = cs[i % 5]; c.beginPath(); c.arc((i * 13) % W, (i * 7) % H, 2 + (i % 3), 0, 7); c.fill(); } c.strokeStyle = '#e8b52a'; c.lineWidth = 2; c.strokeRect(1, 1, W - 2, H - 2); }), 2, 1);
    blob(g, '#4f8a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#c9c2b0'), 0.2, 0.006, 0.8, 0, 0.006, 0.05);
    // the Yōmeimon gate: white and gold with layered black roofs
    var Y = 0.006;
    box(g, mat(stoneTex('nkst', '#a8a090', '#8a8478', 8, 2), 2, 1), 0.34, 0.03, 0.2, 0, Y, -0.08);
    for (var i = 0; i < 4; i++) [-0.06, 0.06].forEach(function (z) { cyl(g, white, 0.009, 0.009, 0.1, -0.12 + i * 0.08, Y + 0.03, -0.08 + z, 8); });
    box(g, carv, 0.3, 0.05, 0.16, 0, Y + 0.13, -0.08);
    hip(g, black, 0.38, 0.22, 0.03, 0, Y + 0.18, -0.08, 0.75); box(g, carv, 0.24, 0.04, 0.12, 0, Y + 0.21, -0.08); hip(g, black, 0.34, 0.2, 0.08, 0, Y + 0.25, -0.08, 0.35);
    [-1, 1].forEach(function (s) { var f = new T.Mesh(new T.ConeGeometry(0.01, 0.03, 4), gold); f.position.set(s * 0.1, Y + 0.35, -0.08); g.add(f); });
    box(g, gold, 0.31, 0.006, 0.17, 0, Y + 0.18, -0.08);
    // the five-storey red pagoda
    var py = 0.006; for (var f2 = 0; f2 < 5; f2++) { box(g, red, 0.06 - f2 * 0.004, 0.035, 0.06 - f2 * 0.004, 0.3, py, 0.2); hip(g, black, 0.1 - f2 * 0.006, 0.1 - f2 * 0.006, 0.018, 0.3, py + 0.035, 0.2, 0.5); py += 0.053; } cyl(g, gold, 0.002, 0.004, 0.08, 0.3, py, 0.2, 4);
    // the stable with the three wise monkeys
    box(g, solid('#8a5a3a'), 0.12, 0.05, 0.06, -0.28, 0.006, 0.25); hip(g, black, 0.15, 0.09, 0.03, -0.28, 0.056, 0.25, 0.4);
    [-0.03, 0, 0.03].forEach(function (x) { var mk = new T.Mesh(new T.SphereGeometry(0.009, 6, 5), solid('#c9a46a')); mk.position.set(-0.28 + x, 0.04, 0.282); g.add(mk); });
    for (var t = 0; t < 16; t++) { var a = t / 16 * D2, r = 0.58 + hash(t, 1) * 0.08; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.6, '#2f5a34'); }
    return g;
  };
})();
