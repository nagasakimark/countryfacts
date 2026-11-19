/* Detailed landmarks, batch 33: Brimstone Hill Fortress, Dushanbe Flagpole, National Parliament (Honiara), John Garang Mausoleum,
   Nabemba Tower, Pidjiguiti Memorial, Ducor Hill (Monrovia), Pig Beach (Exuma). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function jungle(g, n, r0, r1, seed) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#2f7a35', { flatShading: true })); c.position.set(Math.cos(a) * r, 0.04, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- Brimstone Hill Fortress ---------- */
  M.custom.brimstone = function () {
    var g = new T.Group(), st = mat(stoneTex('bhf', '#5a5a58', '#7a7a72', 8, 4), 2, 1), lime = solid('#c9c0a8');
    blob(g, '#3f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.24, rings: 12, r: function (t) { return t > 0.85 ? 0.2 : 0.36 * (1 - t) + 0.16; }, bump: 0.18, colour: function (x, y) { return y > 0.25 ? '#4f7a3a' : '#3f8a3f'; } });
    // dark volcanic-stone bastions stepping down the hill, the citadel on top
    var Y = 0.0, n0 = g.children.length;
    box(g, st, 0.2, 0.08, 0.16, 0, Y, 0); for (var i = 0; i < 6; i++) box(g, st, 0.02, 0.02, 0.02, -0.08 + i * 0.032, Y + 0.08, 0.07);
    [[0.15, 0.08, 0.1], [-0.14, 0.1, 0.12], [0.05, 0.18, 0.08]].forEach(function (b) { var bs = new T.Mesh(new T.CylinderGeometry(0.06, 0.07, b[2], 5), st); bs.position.set(b[0], Y - 0.06 + b[2] / 2 - 0.02, b[1]); g.add(bs); });
    for (var c = 0; c < 4; c++) { var cn = new T.Mesh(new T.CylinderGeometry(0.005, 0.007, 0.04, 6), solid('#1a1a1a')); cn.rotation.x = Math.PI / 2; cn.position.set(-0.06 + c * 0.04, Y + 0.05, 0.1); g.add(cn); }
    box(g, lime, 0.04, 0.03, 0.04, 0.0, Y + 0.08, -0.04);
    cyl(g, solid('#dddddd'), 0.003, 0.003, 0.08, 0.06, Y + 0.08, -0.05, 4);
    box(g, solid('#009e49'), 0.04, 0.012, 0.003, 0.08, Y + 0.148, -0.05); box(g, solid('#1a1a1a'), 0.04, 0.008, 0.0032, 0.08, Y + 0.138, -0.05); box(g, solid('#ce1126'), 0.04, 0.012, 0.003, 0.08, Y + 0.126, -0.05);
    var C = new T.Group(); g.children.slice(n0).forEach(function (o) { g.remove(o); C.add(o); }); C.scale.setScalar(1.6); C.position.y = 0.23; g.add(C);
    // sea and sugarcane fields below
    var sea = new T.Mesh(new T.PlaneGeometry(0.6, 0.12), solid('#2f8fc0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, 0.47); g.add(sea);
    for (var r = 0; r < 12; r++) cyl(g, solid('#8ab04a'), 0.004, 0.004, 0.06, -0.45 + r * 0.03, 0.006, -0.38 + (r % 2) * 0.03, 3);
    return g;
  };

  /* ---------- Dushanbe Flagpole & Palace of Nations ---------- */
  M.custom.tajikflag = function () {
    var g = new T.Group(), w = mat(winTex('dpn', '#f2ece0', '#5a6a7a', 10, 2, { tall: 0.6 }), 2, 1), gold = solid('#d8b04a', { metalness: 0.4 });
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // the very tall flagpole with a huge Tajik flag
    cyl(g, solid('#c9ccd0'), 0.004, 0.008, 0.62, 0.3, 0.006, 0.0, 6);
    var fl = new T.Group(); box(fl, solid('#cc0000'), 0.2, 0.04, 0.004, 0, 0.08, 0); box(fl, solid('#ffffff'), 0.2, 0.05, 0.004, 0, 0.03, 0); box(fl, solid('#006600'), 0.2, 0.03, 0.004, 0, 0, 0); var cr = new T.Mesh(new T.CircleGeometry(0.012, 10), gold); cr.position.set(0, 0.055, 0.003); fl.add(cr);
    fl.position.set(0.4, 0.5, 0); g.add(fl);
    // the Palace of Nations with a golden crown dome
    box(g, w, 0.4, 0.1, 0.16, -0.1, 0.006, -0.1);
    box(g, w, 0.12, 0.14, 0.16, -0.1, 0.006, -0.1);
    for (var c = 0; c < 8; c++) cyl(g, solid('#f2ece0'), 0.008, 0.008, 0.12, -0.16 + c * 0.017, 0.006, -0.015, 6);
    var dm = new T.Mesh(new T.SphereGeometry(0.05, 14, 8, 0, D2, 0, Math.PI / 2), gold); dm.position.set(-0.1, 0.146, -0.1); g.add(dm);
    var crn = new T.Mesh(new T.CylinderGeometry(0.025, 0.035, 0.03, 8), gold); crn.position.set(-0.1, 0.205, -0.1); g.add(crn);
    // fountains and lawns
    for (var f = 0; f < 3; f++) { var ft = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.008, 14), solid('#6ab0d8')); ft.position.set(-0.3 + f * 0.2, 0.01, 0.25); g.add(ft); var jet = new T.Mesh(new T.ConeGeometry(0.01, 0.05, 6), solid('#e8f4f8', { transparent: true, opacity: 0.8 })); jet.position.set(-0.3 + f * 0.2, 0.04, 0.25); g.add(jet); }
    for (var t = 0; t < 8; t++) tree(g, -0.5 + t * 0.14, 0.45, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- National Parliament, Honiara ---------- */
  M.custom.solomonparl = function () {
    var g = new T.Group(), w = mat(winTex('hnp', '#f2ece0', '#3a5a7a', 12, 1, { tall: 0.6 }), 3, 1), roof = solid('#8a5a3a', { flatShading: true });
    blob(g, '#4f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // a round building with a tall cone roof like a traditional leaf house, on a hill
    mountain(g, { h: 0.08, r: function (t) { return 0.3 * (1 - t) + 0.22; }, bump: 0.1, colour: function () { return '#4f9a45'; } });
    cyl(g, w, 0.18, 0.18, 0.08, 0, 0.08, 0, 24);
    var cn = new T.Mesh(new T.ConeGeometry(0.22, 0.24, 24), roof); cn.position.y = 0.16 + 0.12; g.add(cn);
    // painted shell-and-fish pattern band around the roof base
    var band = new T.Mesh(new T.CylinderGeometry(0.205, 0.215, 0.02, 24, 1, true), mat(tex('hnb', 64, 8, function (c, W, H) { c.fillStyle = '#1a1a1a'; c.fillRect(0, 0, W, H); c.fillStyle = '#f6f2ea'; for (var x = 0; x < W; x += 8) { c.beginPath(); c.moveTo(x, 6); c.lineTo(x + 4, 2); c.lineTo(x + 8, 6); c.fill(); } }), 4, 1)); band.position.y = 0.17; g.add(band);
    var fin = new T.Mesh(new T.CylinderGeometry(0.004, 0.006, 0.06, 5), solid('#3a2a1a')); fin.position.y = 0.43; g.add(fin);
    for (var p = 0; p < 10; p++) { var a = p / 10 * D2; palm(g, Math.cos(a) * 0.55, Math.sin(a) * 0.45, 1.2); }
    return g;
  };

  /* ---------- John Garang Mausoleum ---------- */
  M.custom.garang = function () {
    var g = new T.Group(), conc = solid('#e8e2d4');
    blob(g, '#a8a068', 0.74, 0.62, 0, 0, 0.006, 3);
    var pz = new T.Mesh(new T.CircleGeometry(0.34, 24), solid('#d8d0c0')); pz.rotation.x = -Math.PI / 2; pz.position.y = 0.008; g.add(pz);
    // a round open pavilion with a white conical roof over the tomb, and the statue in front
    for (var i = 0; i < 12; i++) { var a = i / 12 * D2; cyl(g, conc, 0.008, 0.008, 0.1, Math.cos(a) * 0.12, 0.008, -0.05 + Math.sin(a) * 0.12, 6); }
    var rf = new T.Mesh(new T.ConeGeometry(0.16, 0.12, 24), solid('#f6f2ea')); rf.position.set(0, 0.168, -0.05); g.add(rf);
    box(g, solid('#3a3a3a'), 0.06, 0.03, 0.1, 0, 0.008, -0.05);
    box(g, solid('#d8d0c0'), 0.05, 0.05, 0.05, 0, 0.008, 0.2);
    var st = new T.Mesh(new T.CapsuleGeometry(0.012, 0.05, 3, 6), solid('#3a3a38')); st.position.set(0, 0.098, 0.2); g.add(st); var hd = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), solid('#3a3a38')); hd.position.set(0, 0.138, 0.2); g.add(hd);
    // South Sudan flags
    [-0.25, 0.25].forEach(function (x) { cyl(g, solid('#dddddd'), 0.003, 0.003, 0.18, x, 0.008, 0.15, 4); [['#000000', 0.02], ['#ffffff', 0.004], ['#da121a', 0.016], ['#ffffff', 0.004], ['#078930', 0.02]].reduce(function (y, b) { box(g, solid(b[0]), 0.07, b[1], 0.003, x + 0.035, y - b[1], 0.15); return y - b[1]; }, 0.19); var tr = new T.Mesh(new T.CircleGeometry(0.03, 3), solid('#0f47af')); tr.position.set(x + 0.008, 0.158, 0.152); g.add(tr); });
    if (K.acacia) for (var t = 0; t < 6; t++) K.acacia(g, -0.5 + t * 0.2, t % 2 ? 0.42 : -0.42, 1.0);
    return g;
  };

  /* ---------- Nabemba Tower ---------- */
  M.custom.nabemba = function () {
    var g = new T.Group(), glass = mat(winTex('nbt', '#c9a868', '#3a4a5a', 8, 18), 2, 3);
    blob(g, '#4f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // the tallest building in central Africa, by the Congo River in Brazzaville
    var rv = new T.Mesh(new T.PlaneGeometry(1.0, 0.24), solid('#6a7a6a')); rv.rotation.x = -Math.PI / 2; rv.position.set(0, 0.009, 0.4); rv.scale.x = 0.72; g.add(rv);
    var tw = new T.Mesh(new T.CylinderGeometry(0.07, 0.08, 0.5, 8), glass); tw.rotation.y = Math.PI / 8; tw.scale.z = 0.7; tw.position.set(0, 0.256, -0.08); g.add(tw);
    box(g, solid('#a8885a'), 0.2, 0.04, 0.14, 0, 0.006, -0.08);
    cyl(g, solid('#d8d4cc'), 0.05, 0.06, 0.02, 0, 0.506, -0.08, 8, Math.PI / 8);
    cyl(g, solid('#c9ccd0'), 0.003, 0.003, 0.08, 0, 0.526, -0.08, 4);
    // lower city blocks and trees, a riverboat
    for (var b = 0; b < 8; b++) { var x = -0.45 + b * 0.13, h = 0.04 + hash(b, 2) * 0.06; if (Math.abs(x) < 0.12) continue; box(g, solid(['#f2ece0', '#e8d8b0', '#d8c8a8'][b % 3]), 0.08, h, 0.07, x, 0.006, -0.2 + hash(b, 3) * 0.12); }
    for (var t = 0; t < 6; t++) { var c = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), solid('#3f8a3f', { flatShading: true })); c.scale.y = 0.7; c.position.set(-0.4 + t * 0.16, 0.08, 0.15); g.add(c); }
    var bt = new T.Group(); box(bt, solid('#f6f2ea'), 0.12, 0.02, 0.03, 0, 0, 0); box(bt, solid('#3f6ab0'), 0.08, 0.02, 0.025, 0, 0.02, 0); bt.position.set(0.1, 0.01, 0.4); g.add(bt);
    return g;
  };

  /* ---------- Pidjiguiti Memorial (Bissau) ---------- */
  M.custom.pidjiguiti = function () {
    var g = new T.Group(), bronze = solid('#4a4038', { flatShading: true });
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    var sea = new T.Mesh(new T.PlaneGeometry(0.54, 0.12), solid('#4a7a8a')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, -0.44); g.add(sea);
    // a giant black clenched fist on a pedestal by the port, remembering dock workers who stood up for fair pay
    box(g, solid('#d8d0c0'), 0.14, 0.12, 0.14, 0, 0.008, 0);
    var F = new T.Group(); var wr = new T.Mesh(new T.CylinderGeometry(0.04, 0.045, 0.12, 8), bronze); wr.position.y = 0.06; F.add(wr);
    var palmM = new T.Mesh(new T.BoxGeometry(0.1, 0.09, 0.07), bronze); palmM.position.y = 0.16; F.add(palmM);
    for (var f = 0; f < 4; f++) { var fg = new T.Mesh(new T.CapsuleGeometry(0.012, 0.02, 3, 6), bronze); fg.rotation.x = Math.PI / 2; fg.position.set(-0.036 + f * 0.024, 0.19, 0.04); F.add(fg); }
    var th = new T.Mesh(new T.CapsuleGeometry(0.011, 0.03, 3, 6), bronze); th.rotation.z = Math.PI / 2; th.position.set(-0.01, 0.15, 0.04); F.add(th);
    F.position.y = 0.128; g.add(F);
    // the dock, cranes and fishing pirogues
    box(g, solid('#8a8a88'), 0.5, 0.02, 0.06, 0, 0.006, -0.32);
    var cr = new T.Group(); box(cr, solid('#e8a83a'), 0.015, 0.2, 0.015, 0, 0, 0); box(cr, solid('#e8a83a'), 0.15, 0.012, 0.012, 0.05, 0.19, 0); cr.position.set(0.25, 0.026, -0.32); g.add(cr);
    for (var p = 0; p < 3; p++) { var pg = new T.Mesh(new T.CapsuleGeometry(0.012, 0.08, 3, 6), solid(['#d04a2a', '#3f6ab0', '#e8c34a'][p])); pg.rotation.z = Math.PI / 2; pg.scale.y = 1; pg.position.set(-0.2 + p * 0.12, 0.012, -0.45); g.add(pg); }
    for (var t = 0; t < 5; t++) palm(g, -0.45 + t * 0.22, 0.35, 1.1);
    return g;
  };

  /* ---------- Ducor Hill, Monrovia ---------- */
  M.custom.ducor = function () {
    var g = new T.Group(), conc = mat(winTex('dch', '#d8d4cc', '#3a3a3a', 10, 6), 2, 1);
    blob(g, '#2f8fb0', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#4f9a45', 0.56, 0.42, -0.05, -0.05, 0.012, 3);
    mountain(g, { h: 0.18, pos: [-0.05, -0.05], r: function (t) { return 0.36 * (1 - t) + 0.12; }, bump: 0.15, colour: function (x, y) { return y > 0.12 ? '#5f9a45' : '#4f8a3f'; } });
    // the old hotel on the top of the hill, with views over the city and ocean
    var Y = 0.15;
    box(g, conc, 0.3, 0.14, 0.08, -0.05, Y, -0.1); box(g, solid('#c9c4b8'), 0.32, 0.012, 0.09, -0.05, Y + 0.14, -0.1);
    // the statue of President Tubman pointing, and the Liberian flag
    var st = new T.Mesh(new T.CapsuleGeometry(0.01, 0.04, 3, 6), solid('#3a3a38')); st.position.set(0.12, Y + 0.035, 0.05); g.add(st);
    cyl(g, solid('#dddddd'), 0.003, 0.003, 0.14, -0.18, Y, 0.06, 4);
    for (var s = 0; s < 6; s++) box(g, solid(s % 2 ? '#ffffff' : '#bf0a30'), 0.07, 0.008, 0.003, -0.145, Y + 0.13 - s * 0.008, 0.06);
    box(g, solid('#002868'), 0.028, 0.024, 0.0032, -0.166, Y + 0.118, 0.06); var star = new T.Mesh(new T.CircleGeometry(0.006, 5), solid('#ffffff')); star.position.set(-0.166, Y + 0.13, 0.062); g.add(star);
    // city roofs below by the shore
    for (var h = 0; h < 8; h++) { var a = Math.PI * 0.2 + h * 0.28, x = Math.cos(a) * 0.42, z = Math.sin(a) * 0.32; box(g, solid(['#c9603a', '#8a9aa8', '#d8c09a'][h % 3]), 0.06, 0.04, 0.05, x, 0.012, z); }
    return g;
  };

  /* ---------- Pig Beach, Exuma ---------- */
  M.custom.pigbeach = function () {
    var g = new T.Group(), pink = solid('#f0b8a8');
    blob(g, '#4ad0d8', 0.74, 0.62, 0, 0.05, 0.006, 5);
    blob(g, '#f6f0e0', 0.5, 0.3, 0, -0.2, 0.012, 3);
    blob(g, '#4f9a45', 0.36, 0.16, 0, -0.32, 0.014, 2);
    // pigs paddling in the clear turquoise water and lying on the sand
    function pig(x, z, y, ry, s) { var p = new T.Group(); var b = new T.Mesh(new T.SphereGeometry(0.03, 10, 8), pink); b.scale.set(1, 0.8, 1.4); p.add(b); var h = new T.Mesh(new T.SphereGeometry(0.02, 8, 6), pink); h.position.set(0, 0.008, 0.042); p.add(h); var sn = new T.Mesh(new T.CylinderGeometry(0.009, 0.009, 0.008, 8), solid('#e89a8a')); sn.rotation.x = Math.PI / 2; sn.position.set(0, 0.006, 0.062); p.add(sn); [-1, 1].forEach(function (sd) { var e = new T.Mesh(new T.ConeGeometry(0.007, 0.014, 4), pink); e.position.set(sd * 0.012, 0.028, 0.04); p.add(e); }); p.position.set(x, y, z); p.rotation.y = ry; p.scale.setScalar(s * 1.5); g.add(p); }
    pig(-0.1, 0.12, 0.01, 0.4, 1.3); pig(0.08, 0.2, 0.01, -0.5, 1.2); pig(0.25, 0.08, 0.01, 2.6, 1.0); pig(-0.28, -0.12, 0.035, 1.2, 1.1); pig(0.15, -0.15, 0.035, -1.0, 0.9);
    // a little boat with tourists and palms on the island
    var bt = new T.Group(); box(bt, solid('#f6f6f6'), 0.05, 0.02, 0.14, 0, 0, 0); box(bt, solid('#3f6ab0'), 0.04, 0.03, 0.04, 0, 0.02, -0.03); bt.position.set(0.38, 0.008, 0.32); bt.rotation.y = 0.4; g.add(bt);
    for (var t = 0; t < 6; t++) palm(g, -0.3 + t * 0.12, -0.34 + (t % 2) * 0.04, 1.2);
    return g;
  };
})();
