/* Detailed landmarks, batch 13: Great Blue Hole, Panama Canal, Richat Structure, Ngorongoro Crater,
   Bran Castle, Ilulissat Icefjord, Darvaza crater, Bayterek Tower. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch, acacia = K.acacia;
  var D2 = Math.PI * 2;
  function disc(g, col, r, x, y, z, sx, op) { var d = new T.Mesh(new T.CircleGeometry(r, 28), solid(col, op ? { transparent: true, opacity: op } : null)); d.rotation.x = -Math.PI / 2; d.scale.x = sx || 1; d.position.set(x, y, z); g.add(d); return d; }
  function jungle(g, n, r0, r1, seed, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- Great Blue Hole ---------- */
  M.custom.bluehole = function () {
    var g = new T.Group();
    disc(g, '#2f86c0', 0.74, 0, 0.006, 0, 1.15);
    var reef = new T.Mesh(new T.RingGeometry(0.2, 0.36, 32), solid('#6fd8d8')); reef.rotation.x = -Math.PI / 2; reef.position.y = 0.009; g.add(reef);
    var rim = new T.Mesh(new T.RingGeometry(0.2, 0.24, 32), solid('#bfeee8')); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.01; g.add(rim);
    disc(g, '#0f2f6a', 0.2, 0, 0.01, 0); disc(g, '#163f86', 0.16, 0, 0.011, 0);
    var cols = ['#ff8a7a', '#f2c14e', '#c87af0', '#ff6f91'];
    for (var i = 0; i < 16; i++) { var a = i / 16 * D2, r = 0.29 + hash(i, 1) * 0.05, c = new T.Mesh(new T.IcosahedronGeometry(0.014, 0), solid(cols[i % 4], { flatShading: true })); c.scale.y = 0.5; c.position.set(Math.cos(a) * r, 0.012, Math.sin(a) * r); g.add(c); }
    var boat = new T.Group(); box(boat, solid('#ffffff'), 0.035, 0.018, 0.1, 0, 0, 0); box(boat, solid('#2b6fd0'), 0.03, 0.02, 0.035, 0, 0.018, -0.01); boat.position.set(0.3, 0.008, 0.25); boat.rotation.y = 0.8; g.add(boat);
    [[-0.3, 0.32], [-0.35, 0.36]].forEach(function (q) { var p = new T.Mesh(new T.SphereGeometry(0.008, 6, 5), solid('#2a2a30')); p.position.set(q[0], 0.012, q[1]); g.add(p); });
    return g;
  };

  /* ---------- Panama Canal (locks) ---------- */
  M.custom.panama = function () {
    var g = new T.Group(), con = mat(stoneTex('pnc', '#c9c4b8', '#aaa598', 16, 8), 6, 1), water = solid('#3f8fa8');
    blob(g, '#4f9a4a', 0.74, 0.62, 0, 0, 0.006, 4);
    // three lock chambers stepping up, each with its own water level
    [0, 1, 2].forEach(function (k) {
      var z = 0.36 - k * 0.3, y = k * 0.05;
      box(g, con, 0.08, 0.1 + y, 0.3, -0.12, 0, z); box(g, con, 0.08, 0.1 + y, 0.3, 0.12, 0, z);
      box(g, water, 0.16, 0.07 + y, 0.3, 0, 0, z);
      box(g, solid('#5a5f66'), 0.16, 0.1 + y, 0.012, 0, 0, z - 0.15); // gates
    });
    // a container ship in the middle lock
    var s = new T.Group(); box(s, solid('#2b4a7a'), 0.11, 0.035, 0.25, 0, 0, 0); box(s, solid('#c0392b'), 0.11, 0.008, 0.25, 0, 0, 0); box(s, solid('#ffffff'), 0.09, 0.06, 0.04, 0, 0.035, -0.1);
    var cc = ['#e8473a', '#f2c14e', '#2b6fd0', '#4fb35a', '#ff8a3a'];
    for (var i = 0; i < 5; i++) for (var j = 0; j < 2; j++) box(s, solid(cc[(i + j) % 5]), 0.045, 0.025, 0.035, j ? 0.026 : -0.026, 0.035, -0.04 + i * 0.04);
    s.position.set(0, 0.12, 0.06); g.add(s);
    // the electric "mules" that guide ships, and the lake above
    [[-0.12, 0.2], [0.12, 0.2], [-0.12, -0.05]].forEach(function (q) { box(g, solid('#9aa3b0'), 0.03, 0.025, 0.05, q[0], 0.1 + (q[1] < 0 ? 0.05 : 0), q[1]); });
    blob(g, '#3f8fa8', 0.4, 0.18, 0, -0.48, 0.17, 2);
    jungle(g, 22, 0.32, 0.7, 6);
    return g;
  };

  /* ---------- Richat Structure (Eye of the Sahara) ---------- */
  M.custom.richat = function () {
    var g = new T.Group(), cols = ['#c98a5a', '#9a6a4a', '#d8a06a', '#7a5a44', '#e0b07a', '#8a6248'];
    disc(g, '#e8c08a', 0.74, 0, 0.006, 0, 1.15);
    for (var i = 0; i < 6; i++) { var r = 0.6 - i * 0.09, ring = new T.Mesh(new T.TorusGeometry(r, 0.03 + (i % 2) * 0.012, 4, 40), solid(cols[i], { flatShading: true })); ring.rotation.x = Math.PI / 2; ring.scale.set(1, 0.92 + hash(i, 2) * 0.08, 0.6); var p = ring.geometry.attributes.position; for (var k = 0; k < p.count; k++) { var x = p.getX(k), y = p.getY(k), a = Math.atan2(y, x), d = 1 + (noise(a * 3 + i, 2) - 0.5) * 0.1; p.setX(k, x * d); p.setY(k, y * d); } ring.geometry.computeVertexNormals(); ring.position.y = 0.01; g.add(ring); }
    disc(g, '#b07a52', 0.08, 0, 0.012, 0);
    // a camel caravan crossing
    for (var c = 0; c < 4; c++) { var cm = new T.Group(), b = solid('#c99a5a'); box(cm, b, 0.016, 0.014, 0.04, 0, 0.026, 0); [[0.005, 0.014], [-0.005, 0.014], [0.005, -0.014], [-0.005, -0.014]].forEach(function (q) { box(cm, b, 0.004, 0.028, 0.004, q[0], 0, q[1]); }); var h = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), b); h.position.y = 0.042; cm.add(h); box(cm, b, 0.006, 0.02, 0.006, 0, 0.034, 0.024).rotation.x = 0.5; cm.position.set(0.3 + c * 0.05, 0.006, 0.45 - c * 0.02); cm.rotation.y = 1.4; cm.scale.setScalar(1.4); g.add(cm); }
    return g;
  };

  /* ---------- Ngorongoro Crater ---------- */
  M.custom.ngorongoro = function () {
    var g = new T.Group();
    disc(g, '#a8b060', 0.74, 0, 0.006, 0, 1.15);
    var rim = lathe([[0.62, 0], [0.56, 0.08], [0.48, 0.16], [0.43, 0.18], [0.4, 0.14], [0.38, 0.06], [0.36, 0.02], [0.0, 0.02]], 32, solid('#5f8a3a', { flatShading: true, side: T.DoubleSide })); var p = rim.geometry.attributes.position; for (var k = 0; k < p.count; k++) { var x = p.getX(k), z = p.getZ(k), a = Math.atan2(z, x), d = 1 + (noise(a * 2, 1) - 0.5) * 0.12; p.setX(k, x * d); p.setZ(k, z * d); p.setY(k, p.getY(k) * (0.8 + noise(a * 3, 4) * 0.5)); } rim.geometry.computeVertexNormals(); g.add(rim);
    disc(g, '#b8c070', 0.36, 0, 0.022, 0); disc(g, '#8ac0d0', 0.1, 0.08, 0.024, 0.05, 1.4);
    // flamingos on the lake
    for (var f = 0; f < 8; f++) { var fl = new T.Mesh(new T.SphereGeometry(0.006, 5, 4), solid('#ff8aa8')); fl.position.set(0.04 + hash(f, 1) * 0.1, 0.03, 0.02 + hash(f, 2) * 0.06); g.add(fl); }
    // elephants and zebras on the crater floor
    function animal(x, z, ry, col, s, trunk) { var a = new T.Group(), m = solid(col); box(a, m, 0.02, 0.018, 0.034, 0, 0.018, 0); [[0.006, 0.012], [-0.006, 0.012], [0.006, -0.012], [-0.006, -0.012]].forEach(function (q) { box(a, m, 0.005, 0.018, 0.005, q[0], 0, q[1]); }); box(a, m, 0.014, 0.014, 0.012, 0, 0.026, 0.022); if (trunk) box(a, m, 0.004, 0.018, 0.004, 0, 0.012, 0.03); a.position.set(x, 0.022, z); a.rotation.y = ry; a.scale.setScalar(s); g.add(a); }
    animal(-0.15, 0.1, 0.5, '#8a8a8f', 2.0, true); animal(-0.08, 0.16, 1.2, '#8a8a8f', 1.6, true);
    animal(0.12, -0.15, 2.2, '#f2f2f2', 1.2); animal(0.16, -0.12, 2.0, '#2a2a2a', 1.2); animal(0.08, -0.2, 2.5, '#f2f2f2', 1.2);
    animal(-0.1, -0.12, 3.8, '#c9a46a', 1.3);
    for (var t = 0; t < 10; t++) { var a2 = t / 10 * D2, tr = new T.Group(); acacia(tr, 0, 0, 1.2); tr.position.set(Math.cos(a2) * 0.5, 0.12, Math.sin(a2) * 0.5); g.add(tr); }
    return g;
  };

  /* ---------- Bran Castle ---------- */
  M.custom.bran = function () {
    var g = new T.Group(), white = mat(winTex('brw', '#f2ece0', '#3a3a40', 3, 2, { tall: 0.4 }), 2, 1), roof = solid('#b84a32');
    blob(g, '#5f8a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.2, pos: [0, -0.05], r: function (t) { return 0.32 * (1 - t) + 0.12; }, bump: 0.3, sx: 1.1, colour: function (x, y) { return y > 0.12 ? '#8a8478' : noise(x * 12, y * 12) > 0.5 ? '#4f7a3f' : '#7a7468'; } });
    var Y = 0.19;
    box(g, white, 0.26, 0.14, 0.18, 0, Y, -0.06); hip(g, roof, 0.32, 0.24, 0.08, 0, Y + 0.14, -0.06, 0.3);
    box(g, white, 0.1, 0.22, 0.1, 0.13, Y, 0.02); cyl(g, roof, 0, 0.075, 0.12, 0.13, Y + 0.22, 0.02, 4, Math.PI / 4);
    cyl(g, white, 0.05, 0.05, 0.2, -0.13, Y, 0.0, 12); cyl(g, roof, 0, 0.065, 0.12, -0.13, Y + 0.2, 0.0, 12);
    cyl(g, white, 0.035, 0.035, 0.16, -0.05, Y, 0.08, 10); cyl(g, roof, 0, 0.045, 0.09, -0.05, Y + 0.16, 0.08, 10);
    box(g, solid('#a89a80'), 0.04, 0.02, 0.3, 0.02, 0.0, 0.32).rotation.x = -0.5;
    for (var i = 0; i < 18; i++) { var a = i / 18 * D2, r = 0.55 + hash(i, 1) * 0.1; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.4, i % 3 ? '#2f6b3a' : '#4f8a3a'); }
    return g;
  };

  /* ---------- Ilulissat Icefjord ---------- */
  M.custom.ilulissat = function () {
    var g = new T.Group(), ice = solid('#f4fbff', { flatShading: true }), iceB = solid('#bfe6f6', { flatShading: true });
    disc(g, '#1f4f7a', 0.74, 0, 0.006, 0, 1.15);
    for (var i = 0; i < 14; i++) { var a = hash(i, 1) * D2, r = 0.1 + Math.sqrt(hash(i, 2)) * 0.5, s = 0.04 + hash(i, 3) * 0.08, b = new T.Mesh(new T.IcosahedronGeometry(s, 0), i % 3 ? ice : iceB); var p = b.geometry.attributes.position; for (var k = 0; k < p.count; k++) p.setY(k, Math.max(-s * 0.2, p.getY(k)) * (1 + hash(i, 4))); b.geometry.computeVertexNormals(); b.position.set(Math.cos(a) * r, 0.006, Math.sin(a) * r * 0.85 - 0.05); b.rotation.y = hash(i, 5) * 3; g.add(b); }
    // the rocky shore with colourful houses
    blob(g, '#6a6660', 0.4, 0.14, -0.3, 0.48, 0.02, 3);
    var hc = ['#e8473a', '#2b6fd0', '#f2c14e', '#4fb35a', '#e86a3a'];
    for (var h = 0; h < 6; h++) { var x = -0.55 + h * 0.09, z = 0.45 + hash(h, 6) * 0.08; box(g, solid(hc[h % 5]), 0.06, 0.045, 0.05, x, 0.02, z); ridge(g, solid('#2a2a30'), 0.065, 0.03, 0.055, x, 0.065, z); }
    var kayak = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.07, 6), solid('#f2c14e')); kayak.rotation.set(Math.PI / 2, 0, 0.6); kayak.scale.x = 1.6; kayak.position.set(0.15, 0.012, 0.35); g.add(kayak);
    return g;
  };

  /* ---------- Darvaza gas crater ---------- */
  M.custom.darvaza = function () {
    var g = new T.Group();
    disc(g, '#d8b88a', 0.74, 0, 0.006, 0, 1.15);
    var rim = lathe([[0.38, 0], [0.31, 0.08], [0.25, 0.09], [0.24, 0.06]], 28, solid('#a8885a', { flatShading: true })); g.add(rim);
    var wall = new T.Mesh(new T.CylinderGeometry(0.24, 0.2, 0.06, 28, 1, true), solid('#6a4a2a', { side: T.DoubleSide, emissive: '#5a1a00' })); wall.position.y = 0.03; g.add(wall);
    disc(g, '#ff7a1a', 0.21, 0, 0.008, 0).material.emissive = new T.Color('#ff5a00');
    // flames
    for (var i = 0; i < 18; i++) { var a = i / 18 * D2, r = 0.05 + hash(i, 1) * 0.13, f = new T.Mesh(new T.ConeGeometry(0.014, 0.05 + hash(i, 2) * 0.05, 5), solid(i % 3 ? '#ffb02a' : '#ff5a1a', { emissive: i % 3 ? '#ff8a00' : '#ff3a00' })); f.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r); g.add(f); }
    // visitors watching, and a jeep
    [[0.32, 0.25, '#2b6fd0'], [0.36, 0.22, '#e8473a']].forEach(function (q) { cyl(g, solid(q[2]), 0.01, 0.014, 0.05, q[0], 0, q[1], 6); var h = new T.Mesh(new T.SphereGeometry(0.009, 6, 5), solid('#5a3a28')); h.position.set(q[0], 0.06, q[1]); g.add(h); });
    box(g, solid('#e8e2d4'), 0.04, 0.03, 0.07, -0.4, 0.006, 0.3);
    for (var s = 0; s < 6; s++) { var sh = new T.Mesh(new T.SphereGeometry(0.012, 5, 4), solid('#8a9a5a')); sh.position.set(-0.6 + hash(s, 7) * 1.2, 0.01, -0.45 + hash(s, 8) * 0.2); g.add(sh); }
    return g;
  };

  /* ---------- Bayterek Tower ---------- */
  M.custom.bayterek = function () {
    var g = new T.Group(), white = solid('#f6f6f2'), gold = solid('#f2c14e', { emissive: '#5a3a00', transparent: true, opacity: 0.95 });
    blob(g, '#c9c2b0', 0.74, 0.62, 0, 0, 0.006, 2);
    box(g, solid('#d8d2c2'), 0.12, 0.006, 1.1, 0, 0.006, 0);
    disc(g, '#7fc0e0', 0.12, 0, 0.012, 0.32, 2.2);
    disc(g, '#e8e2d4', 0.16, 0, 0.012, 0);
    // the white trunk: a bundle of slim columns that open out like branches
    for (var i = 0; i < 12; i++) { var a = i / 12 * D2, c = new T.CatmullRomCurve3([new T.Vector3(Math.cos(a) * 0.04, 0, Math.sin(a) * 0.04), new T.Vector3(Math.cos(a) * 0.025, 0.3, Math.sin(a) * 0.025), new T.Vector3(Math.cos(a) * 0.05, 0.48, Math.sin(a) * 0.05), new T.Vector3(Math.cos(a) * 0.09, 0.56, Math.sin(a) * 0.09)]); g.add(new T.Mesh(new T.TubeGeometry(c, 12, 0.007, 4), white)); }
    cyl(g, white, 0.035, 0.05, 0.03, 0, 0, 0, 12);
    var egg = new T.Mesh(new T.SphereGeometry(0.075, 18, 14), gold); egg.scale.y = 1.05; egg.position.y = 0.6; g.add(egg);
    for (var t = 0; t < 8; t++) { tree(g, -0.12, -0.45 + t * 0.12, 1.0, '#4f8a3a'); tree(g, 0.12, -0.45 + t * 0.12, 1.0, '#4f8a3a'); }
    return g;
  };
})();
