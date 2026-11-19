/* Detailed landmarks, batch 6: Petra, Forbidden City, Potala Palace, Terracotta Army, Matterhorn,
   Victoria Falls, Avenue of the Baobabs, Great Mosque of Djenné. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, acacia = K.acacia;
  var D2 = Math.PI * 2;
  function hip(g, m, w, d, h, x, y, z, top) { var r = new T.Mesh(new T.CylinderGeometry(Math.SQRT1_2 * w * (top || 0.45), Math.SQRT1_2 * w * 1.15, h, 4, 1), m); r.rotation.y = Math.PI / 4; r.scale.z = d / w; r.position.set(x, y + h / 2, z); g.add(r); return r; }
  function ridge(g, m, w, h, d, x, y, z, ry) { var o = new T.Group(); prism(o, m, w, h, d, 0, 0, 0); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o); return o; }
  K.hip = hip; K.ridge = ridge;
  function camel(g, x, z, ry, s) {
    var c = new T.Group(), b = solid('#c99a5a');
    box(c, b, 0.022, 0.02, 0.06, 0, 0.04, 0); var hump = new T.Mesh(new T.SphereGeometry(0.014, 6, 4), b); hump.position.set(0, 0.062, 0); c.add(hump);
    [[0.007, 0.022], [-0.007, 0.022], [0.007, -0.022], [-0.007, -0.022]].forEach(function (q) { box(c, b, 0.005, 0.042, 0.005, q[0], 0, q[1]); });
    box(c, b, 0.008, 0.035, 0.008, 0, 0.05, 0.034).rotation.x = 0.5; box(c, b, 0.01, 0.01, 0.022, 0, 0.08, 0.048);
    c.position.set(x, 0, z); c.rotation.y = ry; c.scale.setScalar(s || 1); g.add(c);
  }

  /* ---------- Petra: Al-Khazneh (the Treasury) ---------- */
  M.custom.petra = function () {
    var g = new T.Group(), rose = '#d98a6a', roseM = solid('#e09a78'), roseD = solid('#c97a5a'), roseL = solid('#eaa888');
    blob(g, '#e2b48a', 0.72, 0.6, 0, 0.1, 0.006, 3);
    mountain(g, { h: 0.85, pos: [0, -0.32], r: function (t) { return 0.62 * (1 - t * 0.7) + 0.02; }, bump: 0.3, sx: 1.25, sz: 0.5, colour: function (x, y, z) { var n = noise(x * 9, y * 14); return n > 0.6 ? '#c9775a' : n > 0.35 ? rose : '#e3a07c'; } });
    [-1, 1].forEach(function (s) { mountain(g, { h: 0.6, pos: [s * 0.55, 0.15], r: function (t) { return 0.2 * (1 - t * 0.5) + 0.02; }, bump: 0.35, sz: 1.6, seed: s * 5, colour: function (x, y) { return noise(x * 9, y * 14) > 0.5 ? '#c9775a' : '#d98a6a'; } }); });
    box(g, roseD, 0.5, 0.82, 0.06, 0, 0, -0.06); // the cut back wall
    var Z = 0.0;
    box(g, roseL, 0.42, 0.03, 0.1, 0, 0, Z);
    for (var i = 0; i < 6; i++) { var x = -0.175 + i * 0.07; cyl(g, roseM, 0.016, 0.017, 0.26, x, 0.03, Z + 0.02, 10); box(g, roseL, 0.04, 0.02, 0.04, x, 0.29, Z + 0.02); }
    box(g, roseM, 0.42, 0.05, 0.08, 0, 0.31, Z);
    ridge(g, roseL, 0.26, 0.08, 0.06, 0, 0.36, Z + 0.01);
    box(g, solid('#3a2420'), 0.06, 0.16, 0.01, 0, 0.03, Z - 0.02);
    // upper floor: a round kiosk (tholos) between two half pediments
    box(g, roseM, 0.42, 0.03, 0.08, 0, 0.44, Z - 0.01);
    var th = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.2, 14), roseM); th.position.set(0, 0.57, Z - 0.01); g.add(th);
    for (var k = 0; k < 6; k++) { var a = k / 6 * Math.PI; cyl(g, roseL, 0.008, 0.009, 0.2, Math.cos(a) * 0.065, 0.47, Z - 0.01 + Math.sin(a) * 0.065, 6); }
    cyl(g, roseL, 0, 0.07, 0.08, 0, 0.67, Z - 0.01, 14); var urn = new T.Mesh(new T.SphereGeometry(0.018, 8, 6), roseL); urn.position.set(0, 0.76, Z - 0.01); g.add(urn);
    [-1, 1].forEach(function (s) { box(g, roseM, 0.1, 0.18, 0.07, s * 0.16, 0.47, Z - 0.01); for (var j = 0; j < 2; j++) cyl(g, roseL, 0.01, 0.011, 0.18, s * (0.13 + j * 0.06), 0.47, Z + 0.03, 8); var hp = new T.Mesh(new T.CylinderGeometry(0.0, 0.06, 0.05, 3), roseL); hp.rotation.set(Math.PI / 2, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2); hp.position.set(s * 0.16, 0.68, Z); hp.scale.set(1, 1, 0.8); g.add(hp); });
    camel(g, 0.18, 0.35, -0.6, 1.4); camel(g, -0.2, 0.42, 0.9, 1.3);
    return g;
  };

  /* ---------- Forbidden City: Hall of Supreme Harmony ---------- */
  M.custom.forbidden = function () {
    var g = new T.Group(), red = solid('#b8322a'), gold = mat(tex('glazed', 64, 32, function (c, W, H) { c.fillStyle = '#e8b52e'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(150,90,0,.35)'; for (var x = 0; x < W; x += 4) c.fillRect(x, 0, 1.5, H); }), 5, 2);
    var marble = mat(stoneTex('fcmar', '#efece4', '#d6d1c4', 16, 8), 4, 1), wall = mat(winTex('fcwin', '#b8322a', '#7a1f1a', 8, 1, { tall: 0.7 }), 4, 1), band = mat(tex('fcband', 64, 16, function (c, W, H) { c.fillStyle = '#2f7a6a'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 16) { c.fillStyle = '#3f6fb0'; c.fillRect(x + 2, 3, 10, 10); c.fillStyle = '#e8c04a'; c.fillRect(x + 6, 6, 3, 4); } }), 6, 1);
    blob(g, '#d8d2c2', 0.74, 0.62, 0, 0, 0.006, 2);
    // outer red walls with corner towers
    [[0, -0.55, 1.2, 0.04], [0, 0.55, 1.2, 0.04], [-0.6, 0, 0.04, 1.1], [0.6, 0, 0.04, 1.1]].forEach(function (q) { box(g, red, q[2], 0.07, q[3], q[0], 0, q[1]); box(g, gold, q[2] + 0.02, 0.02, q[3] + 0.02, q[0], 0.07, q[1]); });
    box(g, red, 0.24, 0.1, 0.07, 0, 0, 0.55); hip(g, gold, 0.28, 0.1, 0.05, 0, 0.1, 0.55, 0.5);
    // three-tier marble terrace
    [[0.74, 0.5, 0], [0.64, 0.42, 0.04], [0.54, 0.34, 0.08]].forEach(function (q) { box(g, marble, q[0], 0.04, q[1], 0, q[2], -0.1); for (var i = 0; i < 18; i++) cyl(g, solid('#f4f2ec'), 0.004, 0.004, 0.02, -q[0] / 2 + i * q[0] / 17, q[2] + 0.04, -0.1 + q[1] / 2, 4); });
    box(g, marble, 0.08, 0.004, 0.2, 0, 0.0, 0.22).rotation.x = -0.4;
    var Y = 0.12;
    box(g, wall, 0.44, 0.12, 0.22, 0, Y, -0.12);
    for (var k = 0; k < 10; k++) cyl(g, red, 0.009, 0.009, 0.12, -0.2 + k * 0.0444, Y, -0.005, 8);
    box(g, band, 0.48, 0.025, 0.25, 0, Y + 0.12, -0.12);
    hip(g, gold, 0.6, 0.36, 0.05, 0, Y + 0.145, -0.12, 0.85);
    box(g, red, 0.4, 0.04, 0.2, 0, Y + 0.195, -0.12); box(g, band, 0.42, 0.015, 0.21, 0, Y + 0.235, -0.12);
    hip(g, gold, 0.56, 0.32, 0.12, 0, Y + 0.25, -0.12, 0.35);
    box(g, solid('#d9a52a'), 0.24, 0.02, 0.025, 0, Y + 0.37, -0.12);
    [-0.12, 0.12].forEach(function (x) { box(g, solid('#d9a52a'), 0.02, 0.04, 0.025, x, Y + 0.37, -0.12); });
    [[-0.4, 0.3], [0.4, 0.3]].forEach(function (q) { cyl(g, solid('#7a5a2a'), 0.02, 0.025, 0.03, q[0], 0, q[1], 8); });
    return g;
  };

  /* ---------- Potala Palace ---------- */
  M.custom.potala = function () {
    var g = new T.Group();
    var white = mat(winTex('potw', '#f4f1ea', '#3a2f2a', 6, 3, { tall: 0.5 }), 2, 1), redW = mat(winTex('potr', '#8e2a24', '#2a1a14', 6, 4, { tall: 0.5 }), 2, 2), gold = solid('#e2b23a', { emissive: '#3a2a00' });
    mountain(g, { h: 0.32, pos: [0, -0.05], r: function (t) { return 0.62 * (1 - t) + 0.06; }, bump: 0.25, sx: 1.25, sz: 0.65, colour: function (x, y, z) { return y < 0.05 ? '#8a9a5a' : noise(x * 12, z * 12) > 0.55 ? '#8f8270' : '#a39480'; } });
    function block(m, w, h, d, x, y, z) { var b = box(g, m, w, h, d, x, y, z); box(g, solid(m === redW ? '#6a1e1a' : '#7a2a24'), w * 0.92, 0.02, d * 0.92, x, y + h, z); return b; }
    block(white, 0.95, 0.2, 0.32, 0, 0.12, 0.02);
    block(white, 0.32, 0.14, 0.26, -0.36, 0.32, 0.0);
    block(white, 0.3, 0.12, 0.26, 0.37, 0.32, 0.0);
    block(redW, 0.34, 0.26, 0.28, 0.0, 0.32, -0.01);
    block(white, 0.12, 0.1, 0.26, -0.22, 0.32, 0.0); block(white, 0.12, 0.1, 0.26, 0.22, 0.32, 0.0);
    [[-0.1, 0.6], [0.06, 0.6], [0.12, 0.6]].forEach(function (q, i) { hip(g, gold, 0.08, 0.08, 0.04, q[0], q[1], -0.04 - i * 0.02, 0.2); });
    // zig-zag stairs up the hill
    for (var i = 0; i < 4; i++) box(g, solid('#efe9df'), 0.3, 0.012, 0.03, (i % 2 ? 0.1 : -0.1), 0.02 + i * 0.03, 0.26 - i * 0.03).rotation.y = i % 2 ? 0.3 : -0.3;
    return g;
  };

  /* ---------- Terracotta Army ---------- */
  M.custom.terracotta = function () {
    var g = new T.Group(), clay = solid('#a8836a'), clayD = solid('#8a6a52'), earth = solid('#9c7a5a');
    blob(g, '#c2a07c', 0.74, 0.6, 0, 0, 0.006, 4);
    box(g, solid('#7f6248'), 1.0, 0.004, 0.76, 0, 0.004, 0); // pit floor
    [[0, -0.38, 1.04, 0.05], [0, 0.38, 1.04, 0.05], [-0.52, 0, 0.05, 0.8], [0.52, 0, 0.05, 0.8]].forEach(function (q) { box(g, earth, q[2], 0.05, q[3], q[0], 0, q[1]); });
    for (var w = 0; w < 3; w++) box(g, earth, 0.9, 0.035, 0.03, 0, 0, -0.18 + w * 0.18); // earth walls between the rows
    var fig = new T.Group(); cyl(fig, clay, 0.012, 0.018, 0.05, 0, 0, 0, 7); box(fig, clayD, 0.03, 0.02, 0.016, 0, 0.025, 0); var hd = new T.Mesh(new T.SphereGeometry(0.009, 6, 5), clay); hd.position.y = 0.06; fig.add(hd); var bun = new T.Mesh(new T.SphereGeometry(0.004, 5, 4), clayD); bun.position.set(0.004, 0.069, 0); fig.add(bun);
    fig.scale.setScalar(1.7); for (var r = 0; r < 4; r++) for (var c = 0; c < 9; c++) { var f = fig.clone(); f.position.set(-0.38 + c * 0.095 + (r % 2) * 0.03, 0.004, -0.27 + r * 0.18); g.add(f); }
    // a horse chariot at the front
    [[-0.12, 0.33], [0.0, 0.33], [0.12, 0.33]].forEach(function (q) { var hz = new T.Group(); box(hz, clay, 0.024, 0.024, 0.06, 0, 0.03, 0); [[0.008, 0.02], [-0.008, 0.02], [0.008, -0.02], [-0.008, -0.02]].forEach(function (l) { box(hz, clay, 0.005, 0.03, 0.005, l[0], 0, l[1]); }); box(hz, clay, 0.012, 0.03, 0.014, 0, 0.045, 0.03).rotation.x = -0.5; hz.position.set(q[0], 0.004, q[1]); g.add(hz); });
    return g;
  };

  /* ---------- Matterhorn ---------- */
  M.custom.matterhorn = function () {
    var g = new T.Group();
    blob(g, '#6aa850', 0.74, 0.6, 0, 0.05, 0.006, 3);
    mountain(g, { h: 0.95, pos: [0.0, -0.08], seg: 5, rings: 18, r: function (t) { return 0.5 * Math.pow(1 - t, 1.25) + 0.005; }, bump: 0.18, jag: 0.03, f: 2, colour: function (x, y, z) { var sn = 0.42 + (noise(Math.atan2(z, x) * 3, 2) - 0.5) * 0.15; if (y > sn) return noise(x * 20, y * 20) > 0.7 ? '#b8bcc2' : '#f6f8fb'; if (y < 0.08) return '#5f9a4a'; return y < 0.2 ? '#7a8a6a' : (noise(x * 18, y * 18) > 0.5 ? '#7f7a74' : '#8f8a82'); } });
    mountain(g, { h: 0.35, pos: [-0.45, 0.0], r: function (t) { return 0.25 * (1 - t) + 0.02; }, bump: 0.3, seed: 3, colour: function (x, y) { return y > 0.24 ? '#f4f6f8' : y < 0.06 ? '#5f9a4a' : '#8a857d'; } });
    mountain(g, { h: 0.3, pos: [0.48, 0.05], r: function (t) { return 0.22 * (1 - t) + 0.02; }, bump: 0.3, seed: 7, colour: function (x, y) { return y > 0.2 ? '#f4f6f8' : y < 0.06 ? '#5f9a4a' : '#8a857d'; } });
    // Zermatt chalets
    [[0.1, 0.45], [0.2, 0.5], [-0.05, 0.5], [0.3, 0.4]].forEach(function (q, i) { box(g, solid('#8a5a32'), 0.05, 0.035, 0.04, q[0], 0.006, q[1]); ridge(g, solid('#5a3a28'), 0.065, 0.03, 0.05, q[0], 0.041, q[1]); box(g, solid('#f4efe4'), 0.05, 0.012, 0.041, q[0], 0.006, q[1]); });
    for (var j = 0; j < 10; j++) { var a = j / 10 * D2, r = 0.62; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.8 + 0.05, 1.1, '#2f6b3a'); }
    return g;
  };

  /* ---------- Victoria Falls ---------- */
  M.custom.victoria = function () {
    var g = new T.Group(), cliff = solid('#6f5a44'), cliffD = solid('#5a4838');
    blob(g, '#6f9a3f', 0.74, 0.6, 0, 0, 0.006, 5);
    box(g, cliff, 1.2, 0.12, 0.44, 0, 0, -0.28); box(g, solid('#3f9fd0'), 1.2, 0.01, 0.4, 0, 0.12, -0.3); [[-0.3, -0.25], [0.2, -0.32], [0.45, -0.2]].forEach(function (q, i) { blob(g, '#4f8a3a', 0.07, 0.04, q[0], q[1], 0.135, i); }); // the river above
    box(g, cliffD, 1.2, 0.12, 0.32, 0, 0, 0.32); box(g, solid('#4f8a3a'), 1.2, 0.01, 0.32, 0, 0.12, 0.32);
    box(g, solid('#2f6f8f'), 1.2, 0.03, 0.16, 0, 0, 0.0); // the gorge below
    var fall = new T.Mesh(new T.PlaneGeometry(1.1, 0.12, 22, 1), solid('#eef8ff', { side: T.DoubleSide })); var fp = fall.geometry.attributes.position; for (var i = 0; i < fp.count; i++) fp.setZ(i, (hash(Math.round(fp.getX(i) * 40), 1) - 0.5) * 0.02); fall.geometry.computeVertexNormals(); fall.position.set(0, 0.06, -0.055); g.add(fall);
    for (var k = 0; k < 9; k++) { var sp = new T.Mesh(new T.SphereGeometry(0.06 + hash(k, 2) * 0.04, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.55 })); sp.position.set(-0.5 + k * 0.125, 0.12 + hash(k, 3) * 0.12, 0.0); g.add(sp); }
    var cols = ['#ff5a4d', '#ffa53a', '#ffe14a', '#5fd36a', '#4aa8ff', '#7a5ae0'];
    cols.forEach(function (c, i) { var rb = new T.Mesh(new T.TorusGeometry(0.26 - i * 0.012, 0.006, 4, 24, Math.PI), solid(c, { transparent: true, opacity: 0.7 })); rb.position.set(0.15, 0.03, 0.04); g.add(rb); });
    for (var j = 0; j < 7; j++) { var tr = new T.Group(); acacia(tr, 0, 0, 1.3); tr.position.set(-0.5 + j * 0.17, 0.12, 0.32 + hash(j, 6) * 0.12); g.add(tr); }
    // the bridge between Zambia and Zimbabwe
    box(g, solid('#9aa3b0'), 0.04, 0.012, 0.6, 0.48, 0.12, 0.05); var arc = new T.Mesh(new T.TorusGeometry(0.08, 0.008, 4, 12, Math.PI), solid('#9aa3b0')); arc.rotation.y = Math.PI / 2; arc.position.set(0.48, 0.04, 0.0); g.add(arc);
    return g;
  };

  /* ---------- Avenue of the Baobabs ---------- */
  M.custom.baobab = function () {
    var g = new T.Group(), bark = solid('#b08a6a', { flatShading: true });
    blob(g, '#c9a46a', 0.74, 0.6, 0, 0, 0.006, 6);
    box(g, solid('#b5763e'), 0.1, 0.004, 1.2, 0, 0.006, 0);
    function baobab(x, z, s) {
      var t = lathe([[0.055, 0], [0.06, 0.05], [0.055, 0.2], [0.05, 0.36], [0.045, 0.42], [0, 0.43]].map(function (p) { return [p[0] * s, p[1] * s]; }), 9, bark); t.position.set(x, 0, z); g.add(t);
      for (var i = 0; i < 6; i++) { var a = i / 6 * D2 + hash(x * 10, z * 10), br = new T.Mesh(new T.CylinderGeometry(0.004 * s, 0.01 * s, 0.07 * s, 4), bark); br.position.set(x + Math.cos(a) * 0.025 * s, 0.44 * s, z + Math.sin(a) * 0.025 * s); br.rotation.set(Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7); g.add(br); var lf = new T.Mesh(new T.SphereGeometry(0.02 * s, 5, 4), solid('#5f8a3a', { flatShading: true })); lf.position.set(x + Math.cos(a) * 0.05 * s, 0.47 * s, z + Math.sin(a) * 0.05 * s); g.add(lf); }
    }
    for (var k = 0; k < 5; k++) { baobab(-0.15 - hash(k, 1) * 0.06, -0.46 + k * 0.23, 0.6 + hash(k, 2) * 0.2); baobab(0.15 + hash(k, 3) * 0.06, -0.36 + k * 0.21, 0.55 + hash(k, 4) * 0.2); }
    [[-0.5, 0.2], [0.5, -0.2], [0.55, 0.35]].forEach(function (q) { acacia(g, q[0], q[1], 1.2); });
    // a zebu cart
    var cart = new T.Group(); box(cart, solid('#7a5a3a'), 0.05, 0.03, 0.07, 0, 0.02, 0); [[0.03, 0], [-0.03, 0]].forEach(function (q) { var wh = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.006, 10), solid('#5a3a28')); wh.rotation.z = Math.PI / 2; wh.position.set(q[0], 0.02, 0); cart.add(wh); }); cart.position.set(0.02, 0.006, 0.3); g.add(cart);
    return g;
  };

  /* ---------- Great Mosque of Djenné ---------- */
  M.custom.djenne = function () {
    var g = new T.Group(), mud = solid('#b98a58', { flatShading: true }), mudL = solid('#c99a66'), stick = solid('#7a5a3a');
    blob(g, '#c9a46a', 0.74, 0.62, 0, 0, 0.006, 2);
    box(g, mudL, 0.92, 0.06, 0.66, 0, 0, -0.04); // the raised platform
    box(g, mud, 0.8, 0.2, 0.52, 0, 0.06, -0.06);
    for (var i = 0; i < 13; i++) { var x = -0.4 + i * 0.0667; box(g, mud, 0.03, 0.24, 0.03, x, 0.06, 0.2); var cap = new T.Mesh(new T.ConeGeometry(0.016, 0.04, 5), mudL); cap.position.set(x, 0.32, 0.2); g.add(cap); }
    // the three towers on the front wall
    [-0.22, 0, 0.22].forEach(function (x, i) {
      var h = i === 1 ? 0.38 : 0.32, t = new T.Mesh(new T.CylinderGeometry(0.035, 0.06, h, 4), mud); t.rotation.y = Math.PI / 4; t.position.set(x, 0.06 + h / 2, 0.19); g.add(t);
      var cp = new T.Mesh(new T.ConeGeometry(0.03, 0.06, 6), mudL); cp.position.set(x, 0.06 + h + 0.03, 0.19); g.add(cp); var egg = new T.Mesh(new T.SphereGeometry(0.01, 6, 5), solid('#f6f0e2')); egg.position.set(x, 0.06 + h + 0.065, 0.19); g.add(egg);
      for (var k = 0; k < 5; k++) for (var s = -1; s <= 1; s += 2) box(g, stick, 0.004, 0.004, 0.05, x + s * 0.03, 0.1 + k * 0.05, 0.22);
    });
    for (var r = 0; r < 3; r++) for (var c = 0; c < 11; c++) box(g, stick, 0.004, 0.004, 0.05, -0.36 + c * 0.072, 0.1 + r * 0.06, 0.205);
    [-0.4, 0.4].forEach(function (x) { for (var r2 = 0; r2 < 3; r2++) box(g, stick, 0.05, 0.004, 0.004, x + (x > 0 ? 0.01 : -0.01), 0.1 + r2 * 0.06, 0.0); });
    [[-0.55, 0.4], [0.55, 0.38], [0.6, -0.3]].forEach(function (q) { K.tree ? acacia(g, q[0], q[1], 1.3) : 0; });
    return g;
  };
})();
