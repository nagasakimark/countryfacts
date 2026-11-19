/* Detailed landmarks, batch 12: Great Zimbabwe, Cape Coast Castle, Pyramids of Meroë, Ziggurat of Ur,
   Malbork Castle, Stockholm City Hall, Badshahi Mosque, Pha That Luang. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch, acacia = K.acacia;
  var D2 = Math.PI * 2;
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 14, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }

  /* ---------- Great Zimbabwe ---------- */
  M.custom.greatzim = function () {
    var g = new T.Group(), st = mat(stoneTex('gzst', '#a49a88', '#7f766a', 6, 3), 10, 1);
    blob(g, '#9aa05a', 0.74, 0.62, 0, 0, 0.006, 4);
    // the Great Enclosure: a curving dry-stone wall
    var wall = new T.Mesh(new T.CylinderGeometry(0.4, 0.42, 0.13, 32, 1, true), st); wall.material.side = T.DoubleSide; wall.scale.z = 0.75; wall.position.set(0, 0.065, 0.02); g.add(wall);
    var cap = new T.Mesh(new T.TorusGeometry(0.41, 0.012, 4, 32), solid('#8f8676')); cap.rotation.x = Math.PI / 2; cap.scale.y = 0.75; cap.position.set(0, 0.13, 0.02); g.add(cap);
    // a chevron pattern band on top of the wall
    for (var i = 0; i < 14; i++) { var a = -0.6 + i * 0.09, ch = box(g, solid('#c9bfa8'), 0.02, 0.012, 0.01, Math.sin(a) * 0.41, 0.11, 0.02 + Math.cos(a) * 0.41 * 0.75); ch.rotation.set(0, a, i % 2 ? 0.6 : -0.6); }
    // the conical tower inside
    var tw = lathe([[0.07, 0], [0.068, 0.08], [0.06, 0.16], [0.05, 0.22], [0.0, 0.22]], 18, st); tw.position.set(0.12, 0, -0.12); g.add(tw);
    cyl(g, st, 0.03, 0.04, 0.08, 0.02, 0, -0.18, 12);
    box(g, st, 0.4, 0.07, 0.025, -0.05, 0, 0.06).rotation.y = 0.3; // inner wall
    // the hill complex behind
    mountain(g, { h: 0.18, pos: [-0.35, -0.42], r: function (t) { return 0.2 * (1 - t) + 0.02; }, bump: 0.35, colour: function (x, y) { return y > 0.1 ? '#8a8272' : '#9aa05a'; } });
    [[0.5, 0.35], [-0.55, 0.3], [0.55, -0.3]].forEach(function (q) { acacia(g, q[0], q[1], 1.4); });
    return g;
  };

  /* ---------- Cape Coast Castle ---------- */
  M.custom.capecoast = function () {
    var g = new T.Group(), white = mat(winTex('ccw', '#f6f3ec', '#4a4a50', 6, 2, { tall: 0.45 }), 4, 1), plain = solid('#f2eee6'), rock = solid('#6a5a4a', { flatShading: true });
    blob(g, '#2f86b8', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#d8c9a0', 0.7, 0.32, 0, -0.25, 0.01, 3);
    for (var r = 0; r < 8; r++) { var rk = new T.Mesh(new T.IcosahedronGeometry(0.05 + hash(r, 1) * 0.04, 0), rock); rk.position.set(-0.4 + r * 0.11, 0.01, 0.12 + hash(r, 2) * 0.06); rk.scale.y = 0.5; g.add(rk); }
    box(g, plain, 0.7, 0.08, 0.36, 0, 0.01, -0.2);
    box(g, white, 0.6, 0.12, 0.1, 0, 0.09, -0.32); box(g, white, 0.1, 0.12, 0.26, -0.25, 0.09, -0.2); box(g, white, 0.1, 0.1, 0.22, 0.25, 0.09, -0.18);
    for (var c = 0; c < 18; c++) box(g, plain, 0.018, 0.02, 0.018, -0.34 + c * 0.04, 0.09, -0.02);
    // the bastion with cannons pointing out to sea
    box(g, plain, 0.2, 0.1, 0.14, 0.2, 0.01, 0.0);
    [0.13, 0.2, 0.27].forEach(function (x) { var cn = new T.Mesh(new T.CylinderGeometry(0.008, 0.011, 0.07, 8), solid('#2a2a2e')); cn.rotation.x = Math.PI / 2; cn.position.set(x, 0.12, 0.08); g.add(cn); });
    cyl(g, plain, 0.03, 0.03, 0.2, -0.25, 0.09, -0.32, 10); cyl(g, solid('#8a4a3a'), 0, 0.035, 0.05, -0.25, 0.29, -0.32, 10);
    var boat = new T.Group(); box(boat, solid('#e8473a'), 0.03, 0.015, 0.1, 0, 0, 0); box(boat, solid('#f2c14e'), 0.031, 0.006, 0.1, 0, 0.012, 0); boat.position.set(-0.25, 0.008, 0.35); boat.rotation.y = 0.4; g.add(boat);
    [[-0.55, -0.3], [0.55, -0.32], [0.45, -0.45]].forEach(function (q) { palm(g, q[0], q[1], 1.3); });
    return g;
  };

  /* ---------- Pyramids of Meroë ---------- */
  M.custom.meroe = function () {
    var g = new T.Group(), sand = solid('#a86a42', { flatShading: true }), sandL = solid('#c98a5a', { flatShading: true });
    blob(g, '#e0b07a', 0.74, 0.62, 0, 0, 0.006, 4);
    for (var i = 0; i < 14; i++) {
      var x = -0.5 + (i % 7) * 0.16 + (i > 6 ? 0.08 : 0), z = i > 6 ? 0.12 : -0.15, w = 0.06 + hash(i, 1) * 0.03, h = w * (2.2 + hash(i, 2) * 0.6), broken = hash(i, 3) > 0.7;
      var p = new T.Mesh(new T.CylinderGeometry(broken ? w * 0.3 : 0, w, broken ? h * 0.7 : h, 4), i % 2 ? sand : sandL); p.rotation.y = Math.PI / 4; p.position.set(x, (broken ? h * 0.7 : h) / 2, z); g.add(p);
      box(g, i % 2 ? sandL : sand, w * 0.8, h * 0.25, 0.04, x, 0, z + w * 0.7); // little chapel at the front
    }
    for (var d = 0; d < 4; d++) { var du = new T.Mesh(new T.SphereGeometry(0.15, 10, 6, 0, D2, 0, Math.PI / 2), solid('#e8bc84')); du.scale.set(1.6, 0.25, 1); du.position.set(-0.4 + d * 0.28, 0, 0.42); g.add(du); }
    return g;
  };

  /* ---------- Ziggurat of Ur ---------- */
  M.custom.ur = function () {
    var g = new T.Group(), brick = mat(stoneTex('urb', '#b89a6a', '#957a50', 8, 4), 5, 1), brickD = solid('#9a7f56');
    blob(g, '#d8c39a', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, brick, 0.62, 0.12, 0.44, 0, 0, -0.05);
    for (var i = 0; i < 9; i++) box(g, brickD, 0.02, 0.12, 0.012, -0.28 + i * 0.07, 0, 0.17);
    box(g, brick, 0.42, 0.08, 0.3, 0, 0.12, -0.08);
    box(g, brick, 0.22, 0.06, 0.16, 0, 0.2, -0.1);
    box(g, solid('#c9a878'), 0.1, 0.05, 0.08, 0, 0.26, -0.1);
    // the three great staircases meeting at the front gate
    box(g, brickD, 0.06, 0.004, 0.36, 0, 0.0, 0.25).rotation.x = -0.6;
    [-1, 1].forEach(function (s) { var st = box(g, brickD, 0.05, 0.004, 0.3, s * 0.13, 0.0, 0.2); st.rotation.set(-0.42, s * 0.5, 0); });
    box(g, solid('#c9a878'), 0.08, 0.05, 0.06, 0, 0.12, 0.12);
    [[-0.5, 0.35], [0.5, 0.38], [0.55, -0.35]].forEach(function (q) { palm(g, q[0], q[1], 1.2); });
    return g;
  };

  /* ---------- Malbork Castle ---------- */
  M.custom.malbork = function () {
    var g = new T.Group(), brick = mat(winTex('mlb', '#a8452e', '#3a2a28', 5, 3, { tall: 0.45, band: '#8a3622' }), 4, 1), roof = solid('#7a3a2a'), roofD = solid('#4a3a38');
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    var river = new T.Mesh(new T.PlaneGeometry(1.5, 0.22), solid('#4a7fa0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.008, 0.48); g.add(river);
    // the high castle: four wings round a courtyard
    [[0, -0.32, 0.4, 0.08], [0, -0.04, 0.4, 0.08], [-0.2, -0.18, 0.08, 0.36], [0.2, -0.18, 0.08, 0.36]].forEach(function (q) { box(g, brick, q[2], 0.2, q[3], q[0], 0, q[1]); ridge(g, roof, q[2] + 0.01, 0.07, q[3] + 0.01, q[0], 0.2, q[1], q[2] > q[3] ? 0 : Math.PI / 2); });
    box(g, brick, 0.09, 0.4, 0.09, 0.2, 0, -0.32); cyl(g, roofD, 0.03, 0.06, 0.06, 0.2, 0.4, -0.32, 8); cyl(g, roofD, 0, 0.03, 0.06, 0.2, 0.46, -0.32, 8);
    // the middle castle and outer walls
    box(g, brick, 0.5, 0.15, 0.08, -0.05, 0, 0.18); ridge(g, roof, 0.51, 0.06, 0.09, -0.05, 0.15, 0.18, 0);
    box(g, brick, 0.08, 0.15, 0.2, -0.28, 0, 0.1); ridge(g, roof, 0.09, 0.06, 0.21, -0.28, 0.15, 0.1, Math.PI / 2);
    [[-0.45, 0.3], [0.35, 0.3], [-0.45, -0.38], [0.42, -0.1]].forEach(function (q) { cyl(g, brick, 0.035, 0.035, 0.16, q[0], 0, q[1], 10); cyl(g, roofD, 0, 0.04, 0.08, q[0], 0.16, q[1], 10); });
    box(g, brick, 0.9, 0.06, 0.02, -0.05, 0, 0.33);
    return g;
  };

  /* ---------- Stockholm City Hall ---------- */
  M.custom.stockholm = function () {
    var g = new T.Group(), brick = mat(winTex('sth', '#a8503a', '#2a2a30', 6, 3, { tall: 0.55 }), 4, 1), copper = solid('#4fa88a'), gold = solid('#e8b52a', { emissive: '#4a3200' });
    blob(g, '#4a86b0', 0.74, 0.62, 0, 0.2, 0.006, 5);
    blob(g, '#8ab070', 0.65, 0.3, 0, -0.25, 0.01, 2);
    box(g, brick, 0.6, 0.16, 0.36, -0.05, 0, -0.2); box(g, solid('#8a3a2a'), 0.62, 0.02, 0.38, -0.05, 0.16, -0.2);
    box(g, solid('#c9c2b0'), 0.4, 0.01, 0.12, 0, 0.0, 0.05); // the garden terrace by the water
    for (var i = 0; i < 8; i++) cyl(g, solid('#e8dcc4'), 0.006, 0.006, 0.06, -0.2 + i * 0.057, 0.01, 0.0, 6);
    // the tall tower with the Three Crowns
    box(g, brick, 0.1, 0.5, 0.1, 0.22, 0, -0.08);
    box(g, solid('#9a4a34'), 0.12, 0.02, 0.12, 0.22, 0.5, -0.08);
    box(g, copper, 0.08, 0.06, 0.08, 0.22, 0.52, -0.08); cyl(g, copper, 0.015, 0.035, 0.07, 0.22, 0.58, -0.08, 8);
    [-0.012, 0, 0.012].forEach(function (dx, k) { var c = new T.Mesh(new T.CylinderGeometry(0.01, 0.006, 0.01, 6), gold); c.position.set(0.22 + dx * 1.5, 0.67 + k * 0.012, -0.08); g.add(c); });
    cyl(g, gold, 0.002, 0.002, 0.05, 0.22, 0.65, -0.08, 4);
    [[-0.3, -0.08], [-0.25, -0.38]].forEach(function (q) { cyl(g, copper, 0, 0.04, 0.08, q[0], 0.16, q[1], 8); });
    var bt = new T.Group(); box(bt, solid('#ffffff'), 0.03, 0.02, 0.1, 0, 0, 0); box(bt, solid('#2b6fd0'), 0.028, 0.02, 0.04, 0, 0.02, 0); bt.position.set(-0.3, 0.008, 0.4); g.add(bt);
    return g;
  };

  /* ---------- Badshahi Mosque ---------- */
  M.custom.badshahi = function () {
    var g = new T.Group(), red = mat(stoneTex('bdr', '#b8503a', '#9a3f2c', 12, 6), 5, 1), white = solid('#f6f3ee'), redP = solid('#b8503a');
    blob(g, '#c9b8a0', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#c9a088'), 1.0, 0.03, 0.8, 0, 0, 0); // the vast courtyard
    [[0, -0.4, 1.0, 0.04], [-0.5, 0, 0.04, 0.8], [0.5, 0, 0.04, 0.8], [0, 0.4, 1.0, 0.04]].forEach(function (q) { box(g, red, q[2], 0.07, q[3], q[0], 0.03, q[1]); });
    // the prayer hall with three white domes
    box(g, red, 0.56, 0.16, 0.16, 0, 0.03, -0.3);
    box(g, red, 0.16, 0.22, 0.04, 0, 0.03, -0.215); arch(g, solid('#f2e6da'), 0.08, 0.16, 0, 0.04, -0.196, 0.004);
    [[-0.18, 0.06], [0, 0.085], [0.18, 0.06]].forEach(function (q) { cyl(g, white, q[1], q[1], 0.03, q[0], 0.19, -0.3, 14); var d = new T.Mesh(new T.SphereGeometry(q[1], 14, 9, 0, D2, 0, Math.PI * 0.6), white); d.scale.y = 1.15; d.position.set(q[0], 0.22, -0.3); g.add(d); var f = new T.Mesh(new T.ConeGeometry(0.008, 0.04, 6), solid('#d8ad4c')); f.position.set(q[0], 0.22 + q[1] * 1.2 + 0.02, -0.3); g.add(f); });
    // four tall minarets at the corners
    [[0.48, 0.38], [-0.48, 0.38], [0.48, -0.38], [-0.48, -0.38]].forEach(function (q) { var m = new T.Mesh(new T.CylinderGeometry(0.022, 0.03, 0.42, 8), redP); m.position.set(q[0], 0.24, q[1]); g.add(m); [0.18, 0.32].forEach(function (y) { cyl(g, white, 0.034, 0.034, 0.01, q[0], 0.03 + y, q[1], 8); }); cyl(g, white, 0.03, 0.03, 0.03, q[0], 0.45, q[1], 8); dome(g, white, 0.03, q[0], 0.48, q[1], 1.2); });
    cyl(g, solid('#8ad0f0'), 0.06, 0.06, 0.035, 0, 0.0, 0.1, 4, Math.PI / 4);
    return g;
  };

  /* ---------- Pha That Luang ---------- */
  M.custom.thatluang = function () {
    var g = new T.Group(), gold = solid('#e8b52a', { emissive: '#4a3200' }), goldD = solid('#c99a1e', { emissive: '#3a2600' });
    blob(g, '#d8d2c2', 0.74, 0.62, 0, 0, 0.006, 2);
    box(g, solid('#f2ead8'), 0.9, 0.04, 0.9, 0, 0, 0); [[0, -0.45, 0.9, 0.03], [0, 0.45, 0.9, 0.03], [-0.45, 0, 0.03, 0.9], [0.45, 0, 0.03, 0.9]].forEach(function (q) { box(g, solid('#f2ead8'), q[2], 0.08, q[3], q[0], 0, q[1]); });
    box(g, gold, 0.62, 0.08, 0.62, 0, 0.04, 0);
    // a ring of small spires round the first terrace
    for (var i = 0; i < 24; i++) { var a = i / 24 * D2, x = Math.cos(a) * 0.29, z = Math.sin(a) * 0.29; if (Math.abs(x) > 0.26 || Math.abs(z) > 0.26) { var sp = new T.Mesh(new T.ConeGeometry(0.014, 0.07, 6), goldD); sp.position.set(Math.max(-0.29, Math.min(0.29, x)), 0.155, Math.max(-0.29, Math.min(0.29, z))); g.add(sp); } }
    box(g, gold, 0.42, 0.06, 0.42, 0, 0.12, 0);
    // the lotus-bud main stupa
    var st = lathe([[0.16, 0], [0.17, 0.04], [0.15, 0.06], [0.13, 0.1], [0.1, 0.14], [0.07, 0.2], [0.05, 0.28], [0.035, 0.36], [0.02, 0.42], [0.008, 0.47], [0, 0.5]], 4, gold); st.rotation.y = Math.PI / 4; st.position.y = 0.18; g.add(st);
    var st2 = lathe([[0.12, 0], [0.11, 0.05], [0.09, 0.08], [0.0, 0.1]], 16, solid('#f2c94e', { emissive: '#4a3200' })); st2.position.y = 0.2; g.add(st2);
    [[-0.55, 0.5], [0.55, 0.5], [-0.55, -0.5], [0.55, -0.5]].forEach(function (q) { palm(g, q[0], q[1], 1.2); });
    return g;
  };
})();
