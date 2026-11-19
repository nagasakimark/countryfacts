/* Detailed landmarks, batch 25: Helsinki Cathedral, Our Lady of the Rocks, Church of St. John at Kaneo, Vianden Castle,
   Bratislava Castle, Krak des Chevaliers, Leptis Magna, Basilica of Our Lady of Peace (Yamoussoukro). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], 16, m); d.position.set(x, y, z); g.add(d); return d; }

  /* ---------- Helsinki Cathedral ---------- */
  M.custom.helsinki = function () {
    var g = new T.Group(), white = mat(winTex('hkc', '#f6f6f2', '#9aa8b0', 3, 2, { tall: 0.6 }), 1, 1), w = solid('#f6f6f2'), green = solid('#5f9a88');
    blob(g, '#d8d4cc', 0.74, 0.62, 0, 0, 0.006, 3);
    // the Senate Square and the great staircase
    for (var s = 0; s < 10; s++) box(g, solid('#c9c4b8'), 0.4, 0.012 * (s + 1), 0.025, 0, 0.006, 0.38 - s * 0.025);
    box(g, solid('#d8d2c4'), 0.5, 0.12, 0.44, 0, 0.006, -0.12);
    // Greek-cross church: four porticos with columns, a big green dome and four small ones
    var Y = 0.126;
    box(g, white, 0.2, 0.14, 0.2, 0, Y, -0.12); box(g, white, 0.34, 0.12, 0.12, 0, Y, -0.12); box(g, white, 0.12, 0.12, 0.34, 0, Y, -0.12);
    for (var c = 0; c < 6; c++) { cyl(g, w, 0.008, 0.008, 0.1, -0.05 + c * 0.02, Y, 0.06, 8); }
    var ped = new T.Mesh(new T.ConeGeometry(0.075, 0.035, 3), w); ped.rotation.set(Math.PI / 2, 0, 0); ped.scale.set(1.0, 0.25, 1); ped.position.set(0, Y + 0.125, 0.06); g.add(ped); box(g, w, 0.14, 0.02, 0.02, 0, Y + 0.1, 0.06);
    cyl(g, w, 0.07, 0.07, 0.08, 0, Y + 0.14, -0.12, 20);
    for (var k = 0; k < 12; k++) { var a = k / 12 * D2; cyl(g, w, 0.005, 0.005, 0.08, Math.cos(a) * 0.072, Y + 0.14, -0.12 + Math.sin(a) * 0.072, 5); }
    domeOn(g, green, 0.075, 0.11, 0, Y + 0.22, -0.12);
    var lan = cyl(g, green, 0.012, 0.016, 0.03, 0, Y + 0.33, -0.12, 8); var cr = new T.Mesh(new T.SphereGeometry(0.008, 6, 4), solid('#d8b04a')); cr.position.set(0, Y + 0.37, -0.12); g.add(cr);
    [[-0.13, -0.25], [0.13, -0.25], [-0.13, 0.01], [0.13, 0.01]].forEach(function (q) { cyl(g, w, 0.03, 0.03, 0.04, q[0], Y + 0.12, q[1], 12); domeOn(g, green, 0.032, 0.05, q[0], Y + 0.16, q[1]); });
    // statues on the roof
    for (var st = 0; st < 5; st++) { var sm = new T.Mesh(new T.CapsuleGeometry(0.004, 0.012, 3, 5), solid('#3f6a5a')); sm.position.set(-0.04 + st * 0.02, Y + 0.15, 0.06); g.add(sm); }
    return g;
  };

  /* ---------- Our Lady of the Rocks ---------- */
  M.custom.ladyrocks = function () {
    var g = new T.Group(), w = solid('#f2ece0'), roof = solid('#c9603a', { flatShading: true });
    blob(g, '#2f7fa0', 0.74, 0.62, 0, 0, 0.006, 6);
    // the bay: steep green mountains all around
    mountain(g, { h: 0.36, pos: [0, -0.36], rings: 10, r: function (t) { return 0.42 * (1 - t) + 0.02; }, sx: 1.25, sz: 0.4, bump: 0.35, colour: function (x, y) { return y > 0.3 ? '#9a9890' : '#4f7a3f'; } });
    // the little man-made island with its church and blue dome
    blob(g, '#b8b0a0', 0.2, 0.15, 0, 0.08, 0.016, 2);
    box(g, mat(winTex('olr', '#f2ece0', '#5a6a7a', 3, 1, { tall: 0.5 }), 1, 1), 0.14, 0.07, 0.08, -0.02, 0.016, 0.08);
    ridge(g, roof, 0.15, 0.03, 0.09, -0.02, 0.086, 0.08, 0);
    cyl(g, w, 0.035, 0.035, 0.03, 0.06, 0.016 + 0.07, 0.08, 8, Math.PI / 8);
    domeOn(g, solid('#3f6ab0'), 0.038, 0.05, 0.06, 0.116, 0.08);
    box(g, w, 0.035, 0.12, 0.035, -0.1, 0.016, 0.06); var sp = new T.Mesh(new T.ConeGeometry(0.03, 0.04, 4), roof); sp.rotation.y = Math.PI / 4; sp.position.set(-0.1, 0.156, 0.06); g.add(sp);
    // the natural islet of St. George with cypress trees, and a boat
    blob(g, '#6a8a4a', 0.12, 0.1, 0.35, -0.08, 0.014, 3);
    for (var c = 0; c < 6; c++) { var cy = new T.Mesh(new T.ConeGeometry(0.014, 0.1, 6), solid('#2f5a2f')); cy.position.set(0.3 + (c % 3) * 0.04, 0.064, -0.11 + Math.floor(c / 3) * 0.05); g.add(cy); }
    var bt = new T.Group(); box(bt, solid('#f2ece0'), 0.08, 0.015, 0.025, 0, 0, 0); box(bt, solid('#3f6ab0'), 0.03, 0.015, 0.02, 0, 0.015, 0); bt.position.set(-0.3, 0.008, 0.35); bt.rotation.y = 0.4; g.add(bt);
    return g;
  };

  /* ---------- Church of St. John at Kaneo ---------- */
  M.custom.kaneo = function () {
    var g = new T.Group(), brick = mat(tex('kaneo', 32, 32, function (c, W, H) { c.fillStyle = '#c99a72'; c.fillRect(0, 0, W, H); c.fillStyle = '#e8dcc4'; for (var y = 0; y < H; y += 5) c.fillRect(0, y, W, 1); c.fillStyle = '#a87a5a'; for (var y2 = 2; y2 < H; y2 += 10) for (var x = (y2 % 20 ? 0 : 4); x < W; x += 8) c.fillRect(x, y2, 4, 3); }), 2, 1), roof = solid('#b8603a', { flatShading: true });
    blob(g, '#3f8ab8', 0.74, 0.62, 0, 0.1, 0.006, 5); // Lake Ohrid
    // a rocky cliff above the lake
    mountain(g, { h: 0.2, pos: [0, -0.15], rings: 10, r: function (t) { return 0.26 * (1 - t) + 0.12; }, sx: 1.3, sz: 0.8, bump: 0.25, jag: 0.25, colour: function (x, y) { return y > 0.17 ? '#7a9a4a' : '#a8a08a'; } });
    // a small Byzantine church: cross-shaped with a drum and tiled roofs
    var Y = 0.19, Z = -0.12, n0 = g.children.length;
    box(g, brick, 0.16, 0.08, 0.1, 0, Y, Z); box(g, brick, 0.08, 0.08, 0.18, 0, Y, Z);
    ridge(g, roof, 0.17, 0.03, 0.11, 0, Y + 0.08, Z, 0); ridge(g, roof, 0.19, 0.03, 0.09, 0, Y + 0.08, Z, Math.PI / 2);
    var ap = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.07, 10, 1, false, 0, Math.PI), brick); ap.position.set(0.08, Y + 0.035, Z); ap.rotation.y = Math.PI; g.add(ap);
    cyl(g, brick, 0.035, 0.035, 0.05, 0, Y + 0.1, Z, 8, Math.PI / 8);
    var dr = new T.Mesh(new T.ConeGeometry(0.045, 0.04, 8), roof); dr.rotation.y = Math.PI / 8; dr.position.set(0, Y + 0.17, Z); g.add(dr);
    var cr = new T.Group(); box(cr, solid('#e8c34a'), 0.004, 0.024, 0.004, 0, 0, 0); box(cr, solid('#e8c34a'), 0.014, 0.004, 0.004, 0, 0.015, 0); cr.position.set(0, Y + 0.19, Z); g.add(cr);
    var C = new T.Group(); g.children.slice(n0).forEach(function (o) { g.remove(o); o.position.x -= 0; o.position.y -= Y; o.position.z -= Z; C.add(o); }); C.scale.setScalar(1.7); C.position.set(0, Y, Z); g.add(C);
    for (var t = 0; t < 6; t++) { var cy = new T.Mesh(new T.ConeGeometry(0.02, 0.1, 6), solid('#3f6a3a')); cy.position.set(-0.3 + t * 0.12, 0.18 - Math.abs(t - 2.5) * 0.03, -0.32); g.add(cy); }
    var bt = new T.Group(); box(bt, solid('#5a3a28'), 0.07, 0.012, 0.022, 0, 0, 0); bt.position.set(0.25, 0.008, 0.38); g.add(bt);
    return g;
  };

  /* ---------- Vianden Castle ---------- */
  M.custom.vianden = function () {
    var g = new T.Group(), st = mat(stoneTex('vdc', '#c9b8a0', '#a8987e', 8, 6), 2, 1), slate = solid('#4a5058', { flatShading: true });
    blob(g, '#4f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.18, pos: [0, -0.04], rings: 10, r: function (t) { return 0.24 * (1 - t) + 0.2; }, bump: 0.2, colour: function () { return '#3f7a35'; } });
    var Y = 0.17;
    // long palace range with tall slate roofs, a chapel tower, round towers
    box(g, st, 0.32, 0.1, 0.1, -0.03, Y, -0.04); ridge(g, slate, 0.33, 0.07, 0.11, -0.03, Y + 0.1, -0.04, 0);
    box(g, st, 0.12, 0.13, 0.1, 0.16, Y, 0.04); hip(g, slate, 0.13, 0.11, 0.08, 0.16, Y + 0.13, 0.04);
    box(g, st, 0.1, 0.08, 0.16, -0.17, Y, 0.06); ridge(g, slate, 0.11, 0.06, 0.17, -0.17, Y + 0.08, 0.06, Math.PI / 2);
    cyl(g, st, 0.035, 0.035, 0.16, 0.05, Y, 0.06, 12); var cn = new T.Mesh(new T.ConeGeometry(0.042, 0.09, 12), slate); cn.position.set(0.05, Y + 0.205, 0.06); g.add(cn);
    cyl(g, st, 0.04, 0.045, 0.06, -0.24, Y - 0.04, -0.08, 10);
    for (var i = 0; i < 8; i++) box(g, solid('#3a3f48'), 0.012, 0.02, 0.003, -0.17 + i * 0.04, Y + 0.05, 0.012);
    // the river and village below
    var rv = new T.Mesh(new T.PlaneGeometry(1.2, 0.08), solid('#5a8aa0')); rv.rotation.x = -Math.PI / 2; rv.position.set(0, 0.009, 0.48); rv.scale.x = 0.65; g.add(rv);
    for (var h = 0; h < 7; h++) { var x = -0.4 + h * 0.13, z = 0.38 + hash(h, 1) * 0.04; box(g, solid(['#f2ece0', '#e8d8b0', '#d8c8b0'][h % 3]), 0.06, 0.04, 0.05, x, 0.006, z); ridge(g, slate, 0.065, 0.025, 0.055, x, 0.046, z, 0); }
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2 + 0.3; if (Math.sin(a) > 0.5) continue; tree(g, Math.cos(a) * 0.55, Math.sin(a) * 0.45, 1.2, '#2f6a30'); }
    return g;
  };

  /* ---------- Bratislava Castle ---------- */
  M.custom.bratislava = function () {
    var g = new T.Group(), white = mat(winTex('brc', '#f6f2ea', '#7a8a9a', 8, 3, { tall: 0.6 }), 1, 1), roof = solid('#c9603a', { flatShading: true });
    blob(g, '#6a9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.12, pos: [0, -0.04], rings: 8, r: function (t) { return 0.16 * (1 - t) + 0.24; }, bump: 0.12, colour: function () { return '#6a9a4a'; } });
    var Y = 0.115;
    // a square white box with a red roof and four corner towers: the "upside-down table"
    box(g, white, 0.3, 0.14, 0.26, 0, Y, -0.04);
    hip(g, roof, 0.31, 0.27, 0.06, 0, Y + 0.14, -0.04);
    [[-0.15, -0.17], [0.15, -0.17], [-0.15, 0.09], [0.15, 0.09]].forEach(function (q) { box(g, solid('#f6f2ea'), 0.06, 0.24, 0.06, q[0], Y, q[1]); hip(g, roof, 0.065, 0.065, 0.05, q[0], Y + 0.24, q[1]); });
    // the Danube with a modern bridge and its UFO-topped pylon
    var rv = new T.Mesh(new T.PlaneGeometry(1.2, 0.14), solid('#4a7aa0')); rv.rotation.x = -Math.PI / 2; rv.position.set(0, 0.009, 0.45); rv.scale.x = 0.75; g.add(rv);
    box(g, solid('#e8e2d4'), 0.012, 0.012, 0.3, 0.35, 0.03, 0.45);
    var py = new T.Mesh(new T.CylinderGeometry(0.008, 0.012, 0.2, 6), solid('#c9ccd0')); py.position.set(0.35, 0.13, 0.32); py.rotation.x = 0.25; g.add(py);
    var ufo = new T.Mesh(new T.CylinderGeometry(0.035, 0.02, 0.018, 16), solid('#c9ccd0')); ufo.position.set(0.35, 0.235, 0.29); g.add(ufo);
    for (var t = 0; t < 8; t++) { var a = t / 8 * D2; tree(g, Math.cos(a) * 0.48, Math.sin(a) * 0.36, 0.9, '#3f7a35'); }
    return g;
  };

  /* ---------- Krak des Chevaliers ---------- */
  M.custom.krak = function () {
    var g = new T.Group(), st = mat(stoneTex('kdc', '#c9b896', '#a8987a', 10, 6), 2, 1);
    blob(g, '#a8a070', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.16, rings: 8, r: function (t) { return 0.2 * (1 - t) + 0.36; }, bump: 0.15, colour: function () { return '#9a9868'; } });
    var Y = 0.16;
    // concentric rings: an outer wall with round towers, a moat, an inner castle with massive towers
    var N = 10;
    for (var i = 0; i < N; i++) { var a = i / N * D2, b = (i + 1) / N * D2, x1 = Math.cos(a) * 0.3, z1 = Math.sin(a) * 0.24, x2 = Math.cos(b) * 0.3, z2 = Math.sin(b) * 0.24, len = Math.hypot(x2 - x1, z2 - z1);
      var w = new T.Mesh(new T.BoxGeometry(len, 0.07, 0.025), st); w.position.set((x1 + x2) / 2, Y + 0.035, (z1 + z2) / 2); w.rotation.y = -Math.atan2(z2 - z1, x2 - x1); g.add(w);
      cyl(g, st, 0.035, 0.04, 0.09, x1, Y, z1, 10); }
    var moat = new T.Mesh(new T.RingGeometry(0.15, 0.2, 24), solid('#6a8a7a')); moat.rotation.x = -Math.PI / 2; moat.scale.y = 0.8; moat.position.y = Y + 0.003; g.add(moat);
    var inner = new T.Mesh(new T.CylinderGeometry(0.15, 0.17, 0.16, 10), st); inner.scale.z = 0.8; inner.position.y = Y + 0.08; g.add(inner);
    [[-0.12, -0.08], [0.12, -0.08], [0.0, -0.12], [-0.1, 0.07], [0.1, 0.07]].forEach(function (q) { cyl(g, st, 0.045, 0.05, 0.22, q[0], Y, q[1], 12); for (var k = 0; k < 8; k++) { var aa = k / 8 * D2; box(g, st, 0.012, 0.014, 0.012, q[0] + Math.cos(aa) * 0.04, Y + 0.22, q[1] + Math.sin(aa) * 0.04); } });
    box(g, solid('#b8a888'), 0.18, 0.004, 0.1, 0, Y + 0.16, -0.01);
    for (var t = 0; t < 8; t++) { var aa2 = t / 8 * D2; var o = new T.Mesh(new T.IcosahedronGeometry(0.035, 0), solid('#7a8a50', { flatShading: true })); o.position.set(Math.cos(aa2) * 0.6, 0.04, Math.sin(aa2) * 0.5); g.add(o); }
    return g;
  };

  /* ---------- Leptis Magna ---------- */
  M.custom.leptis = function () {
    var g = new T.Group(), lime = mat(stoneTex('lpm', '#e0c49a', '#c9aa80', 8, 5), 1, 1), mar = solid('#e8dcc8'), gr = solid('#b88a7a');
    blob(g, '#e0c898', 0.74, 0.62, 0, 0, 0.006, 3);
    var sea = new T.Mesh(new T.PlaneGeometry(0.75, 0.12), solid('#3f9ac0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.009, -0.48); g.add(sea);
    // the four-way Arch of Septimius Severus
    var A = new T.Group(); [[-0.05, -0.05], [0.05, -0.05], [-0.05, 0.05], [0.05, 0.05]].forEach(function (q) { box(A, lime, 0.04, 0.12, 0.04, q[0], 0, q[1]); }); box(A, lime, 0.14, 0.04, 0.14, 0, 0.12, 0); var dm = new T.Mesh(new T.ConeGeometry(0.06, 0.04, 8), lime); dm.position.set(0, 0.18, 0); A.add(dm); A.position.set(0.3, 0.006, 0.25); g.add(A);
    // a semicircular theatre facing the sea
    for (var r = 0; r < 6; r++) { var ring = new T.Mesh(new T.CylinderGeometry(0.12 + r * 0.025, 0.12 + r * 0.025, 0.012 * (r + 1), 18, 1, false, 0, Math.PI), lime); ring.position.set(-0.3, 0.006 + 0.006 * (r + 1), 0.15); ring.rotation.y = Math.PI / 2; g.add(ring); }
    box(g, lime, 0.04, 0.08, 0.28, -0.42 + 0.3 - 0.06 + 0.06, 0.006, 0.15);
    // rows of granite and marble columns of the basilica and forum, some broken
    for (var c = 0; c < 12; c++) { var x = -0.2 + (c % 6) * 0.07, z = -0.15 - Math.floor(c / 6) * 0.12, h = c % 4 === 3 ? 0.05 : 0.14; cyl(g, c % 2 ? gr : mar, 0.012, 0.014, h, x, 0.006, z, 8); if (h > 0.1) box(g, mar, 0.03, 0.012, 0.03, x, 0.006 + h, z); }
    box(g, mar, 0.4, 0.015, 0.03, -0.025, 0.158, -0.15);
    for (var f = 0; f < 6; f++) { var fr = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.06, 6), mar); fr.rotation.z = Math.PI / 2; fr.rotation.y = hash(f, 2) * 3; fr.position.set(-0.1 + hash(f, 3) * 0.4, 0.018, 0.0 + hash(f, 4) * 0.12); g.add(fr); }
    for (var p = 0; p < 3; p++) palm(g, 0.45 + p * 0.06, -0.1 + p * 0.08, 1.0);
    return g;
  };

  /* ---------- Basilica of Our Lady of Peace, Yamoussoukro ---------- */
  M.custom.yamoussoukro = function () {
    var g = new T.Group(), w = solid('#ece6dc'), dome = solid('#d8dce0', { metalness: 0.3, roughness: 0.4 }), glass = solid('#5a8ab0', { emissive: '#0a1a2a' });
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // a vast round plaza wrapped by curving colonnades
    var pz = new T.Mesh(new T.CircleGeometry(0.42, 32), solid('#d8d0c0')); pz.rotation.x = -Math.PI / 2; pz.position.y = 0.008; g.add(pz);
    for (var i = 0; i < 40; i++) { var a = i / 40 * D2; if (Math.sin(a) > 0.75) continue; cyl(g, w, 0.008, 0.008, 0.06, Math.cos(a) * 0.4, 0.008, Math.sin(a) * 0.36, 6); }
    var ringRoof = new T.Mesh(new T.TorusGeometry(0.385, 0.012, 4, 40), w); ringRoof.rotation.x = -Math.PI / 2; ringRoof.scale.y = 0.92; ringRoof.position.y = 0.072; g.add(ringRoof);
    // the drum with stained glass, the huge dome and lantern with a cross
    cyl(g, w, 0.17, 0.18, 0.08, 0, 0.008, -0.04, 32);
    cyl(g, glass, 0.15, 0.15, 0.08, 0, 0.088, -0.04, 32);
    for (var k = 0; k < 16; k++) { var b = k / 16 * D2; cyl(g, w, 0.008, 0.008, 0.08, Math.cos(b) * 0.152, 0.088, -0.04 + Math.sin(b) * 0.152, 5); }
    var d = lathe([[0.16, 0], [0.155, 0.05], [0.13, 0.12], [0.09, 0.18], [0.04, 0.215], [0, 0.22]], 32, dome); d.position.set(0, 0.168, -0.04); g.add(d);
    cyl(g, w, 0.02, 0.025, 0.05, 0, 0.385, -0.04, 10);
    var cr = new T.Group(); box(cr, solid('#d8b04a', { emissive: '#3a2a00' }), 0.006, 0.05, 0.006, 0, 0, 0); box(cr, solid('#d8b04a', { emissive: '#3a2a00' }), 0.03, 0.006, 0.006, 0, 0.032, 0); cr.position.set(0, 0.435, -0.04); g.add(cr);
    for (var p = 0; p < 8; p++) palm(g, -0.56 + (p % 4) * 0.37, p < 4 ? 0.42 : -0.45, 1.2);
    return g;
  };
})();
