/* Detailed landmarks, batch 8: Lalibela, Chefchaouen, Charles Bridge & Prague Castle, Belém Tower,
   Cliffs of Moher, Hallstatt, Alhambra, Cappadocia. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function cypress(g, x, z, s) { var c = new T.Mesh(new T.CylinderGeometry(0.004 * s, 0.022 * s, 0.16 * s, 6), solid('#2f5a34', { flatShading: true })); c.position.set(x, 0.08 * s, z); g.add(c); }
  function extrude(pts, depth, m) { var sh = new T.Shape(); pts.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); }); var e = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: depth, bevelEnabled: false }), m); e.rotation.x = -Math.PI / 2; return e; }

  /* ---------- Church of St George, Lalibela ---------- */
  M.custom.lalibela = function () {
    var g = new T.Group(), rock = solid('#b5775a'), rockD = solid('#8f5a44'), rockL = solid('#c98a6a');
    // ground with the pit cut into it
    var gr = new T.Shape(); gr.absellipse(0, 0, 0.72, 0.6, 0, D2, false, 0); var hole = new T.Path(); hole.moveTo(-0.34, -0.34); hole.lineTo(-0.34, 0.34); hole.lineTo(0.34, 0.34); hole.lineTo(0.34, -0.34); hole.lineTo(-0.34, -0.34); gr.holes.push(hole);
    var ground = new T.Mesh(new T.ExtrudeGeometry(gr, { depth: 0.12, bevelEnabled: false, curveSegments: 24 }), solid('#8f9a4a')); ground.rotation.x = -Math.PI / 2; ground.position.y = 0.0; g.add(ground);
    box(g, rockD, 0.68, 0.002, 0.68, 0, 0.0, 0);
    [[0, -0.34, 0.68, 0.004], [0, 0.34, 0.68, 0.004], [-0.34, 0, 0.004, 0.68], [0.34, 0, 0.004, 0.68]].forEach(function (q) { box(g, rockD, q[2], 0.12, q[3], q[0], 0, q[1]); });
    // the cross-shaped church, its roof level with the ground
    var a = 0.1, b = 0.26, cross = [[-a, -b], [a, -b], [a, -a], [b, -a], [b, a], [a, a], [a, b], [-a, b], [-a, a], [-b, a], [-b, -a], [-a, -a]];
    var body = extrude(cross, 0.1, rock); body.position.y = 0.0; g.add(body);
    var top = extrude(cross.map(function (p) { return [p[0] * 1.03, p[1] * 1.03]; }), 0.022, rockL); top.position.y = 0.1; g.add(top);
    var inner = extrude([[-0.03, -0.18], [0.03, -0.18], [0.03, -0.03], [0.18, -0.03], [0.18, 0.03], [0.03, 0.03], [0.03, 0.18], [-0.03, 0.18], [-0.03, 0.03], [-0.18, 0.03], [-0.18, -0.03], [-0.03, -0.03]], 0.008, rockD); inner.position.y = 0.122; g.add(inner);
    for (var i = 0; i < 3; i++) [-1, 1].forEach(function (s) { box(g, solid('#3a2a22'), 0.03, 0.04, 0.004, s * 0.0, 0.02 + i * 0.028, s * 0.262); box(g, solid('#3a2a22'), 0.004, 0.02, 0.03, s * 0.262, 0.02 + i * 0.028, 0); });
    // pilgrims in white
    [[0.25, 0.25], [0.2, 0.28], [-0.26, 0.2]].forEach(function (q) { cyl(g, solid('#f4f2ec'), 0.01, 0.016, 0.05, q[0], 0, q[1], 6); var h = new T.Mesh(new T.SphereGeometry(0.009, 6, 5), solid('#4a3020')); h.position.set(q[0], 0.06, q[1]); g.add(h); });
    for (var j = 0; j < 10; j++) { var an = j / 10 * D2, r = 0.55; var t = new T.Group(); tree(t, 0, 0, 1.2, '#4f8a3a'); t.position.set(Math.cos(an) * r * 0.95, 0.12, Math.sin(an) * r * 0.8); g.add(t); }
    return g;
  };

  /* ---------- Chefchaouen (the blue town) ---------- */
  M.custom.chefchaouen = function () {
    var g = new T.Group(), blues = ['#5a9be0', '#7ab8f0', '#4a86d0', '#9fd0f5', '#3f78c8'];
    mountain(g, { h: 0.5, pos: [0, -0.4], r: function (t) { return 0.55 * (1 - t) + 0.03; }, bump: 0.3, sx: 1.3, sz: 0.6, colour: function (x, y) { return y > 0.35 ? '#a8a08f' : noise(x * 10, y * 10) > 0.5 ? '#6f8a4a' : '#8a9a5a'; } });
    blob(g, '#c9b48a', 0.72, 0.55, 0, 0.05, 0.006, 3);
    for (var r = 0; r < 6; r++) for (var c = 0; c < 9; c++) {
      if (hash(r, c) < 0.15) continue;
      var x = -0.48 + c * 0.12 + (r % 2) * 0.05, z = 0.36 - r * 0.1, y = r * 0.035, w = 0.08 + hash(c, r) * 0.03, h = 0.05 + hash(r + 5, c) * 0.04;
      box(g, solid(blues[(r * 3 + c) % 5]), w, h + y, 0.07, x, 0, z);
      box(g, solid('#f6f4ee'), w + 0.004, 0.008, 0.074, x, h + y, z);
      box(g, solid('#2a4a7a'), 0.016, 0.026, 0.002, x - w * 0.2, y + 0.005, z + 0.036);
    }
    // the mosque's square minaret
    box(g, solid('#e8dcc4'), 0.06, 0.28, 0.06, 0.12, 0.1, 0.0); box(g, solid('#5aa86a'), 0.065, 0.02, 0.065, 0.12, 0.38, 0.0); cyl(g, solid('#e8dcc4'), 0.012, 0.012, 0.04, 0.12, 0.4, 0.0, 6);
    for (var k = 0; k < 5; k++) { var pot = new T.Mesh(new T.CylinderGeometry(0.01, 0.007, 0.014, 6), solid('#e8743a')); pot.position.set(-0.3 + k * 0.15, 0.007, 0.43); g.add(pot); }
    return g;
  };

  /* ---------- Charles Bridge and Prague Castle ---------- */
  M.custom.prague = function () {
    var g = new T.Group(), st = mat(stoneTex('prst', '#a49a88', '#857c6c', 12, 6), 6, 1), dark = solid('#4a4440'), roofR = solid('#b8503a'), copper = solid('#5aa88a');
    var river = new T.Mesh(new T.PlaneGeometry(1.5, 0.34), solid('#4a8fb8')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.006, 0.2); g.add(river);
    blob(g, '#7ab05a', 0.72, 0.25, 0, -0.32, 0.01, 4);
    // the bridge: a row of stone arches with statues
    box(g, st, 1.3, 0.03, 0.06, 0, 0.09, 0.22);
    for (var i = 0; i < 8; i++) { var x = -0.56 + i * 0.16; box(g, st, 0.04, 0.09, 0.07, x, 0, 0.22); var ar = new T.Mesh(new T.TorusGeometry(0.06, 0.012, 4, 10, Math.PI), st); ar.position.set(x + 0.08, 0.04, 0.22); ar.scale.z = 4; g.add(ar); }
    for (var s = 0; s < 12; s++) { var sx = -0.55 + s * 0.1; [0.19, 0.25].forEach(function (z) { cyl(g, dark, 0.006, 0.008, 0.035, sx, 0.12, z, 5); }); }
    [-0.66, 0.66].forEach(function (x) { box(g, dark, 0.08, 0.2, 0.08, x, 0.0, 0.22); cyl(g, solid('#3a3430'), 0, 0.065, 0.1, x, 0.2, 0.22, 4, Math.PI / 4); });
    // the castle on the hill with St Vitus Cathedral
    mountain(g, { h: 0.14, pos: [0, -0.3], r: function (t) { return 0.5 * (1 - t) + 0.1; }, bump: 0.2, sx: 1.3, sz: 0.45, colour: function () { return '#6f9a4a'; } });
    var castle = mat(winTex('prc', '#efe6d0', '#4a4a50', 8, 3, { tall: 0.5 }), 5, 1);
    box(g, castle, 0.8, 0.1, 0.1, 0, 0.13, -0.28); ridge(g, roofR, 0.82, 0.05, 0.12, 0, 0.23, -0.28, 0);
    box(g, st, 0.26, 0.16, 0.1, 0.05, 0.13, -0.36); ridge(g, solid('#3a4a44'), 0.28, 0.07, 0.12, 0.05, 0.29, -0.36);
    [[-0.05, 0.36], [0.03, 0.36], [0.17, 0.42]].forEach(function (q) { box(g, st, 0.04, q[1] - 0.13, 0.04, q[0], 0.13, -0.33); cyl(g, dark, 0, 0.03, 0.14, q[0], q[1], -0.33, 6); });
    cyl(g, copper, 0.02, 0.03, 0.1, 0.17, 0.42, -0.33, 8);
    return g;
  };

  /* ---------- Belém Tower ---------- */
  M.custom.belem = function () {
    var g = new T.Group(), st = mat(stoneTex('belst', '#ece3cf', '#d0c6b0', 14, 7), 2, 2), stL = solid('#f2ebdb'), sea = solid('#4a8fc0');
    blob(g, '#4a8fc0', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#c9b896', 0.3, 0.12, -0.4, -0.45, 0.01, 2);
    // the bastion (a six-sided platform in the water)
    var bast = extrude([[-0.2, 0.05], [-0.26, -0.12], [-0.12, -0.26], [0.12, -0.26], [0.26, -0.12], [0.2, 0.05]], 0.1, st); g.add(bast);
    for (var i = 0; i < 12; i++) { var a = i / 12 * D2; var sh = new T.Mesh(new T.SphereGeometry(0.014, 6, 4, 0, D2, 0, Math.PI / 2), stL); sh.position.set(Math.cos(a) * 0.2, 0.1, 0.1 + Math.sin(a) * 0.14); if (Math.sin(a) > -0.6) g.add(sh); }
    [[0.24, 0.12], [-0.24, 0.12], [0.11, 0.25], [-0.11, 0.25]].forEach(function (q) { cyl(g, stL, 0.022, 0.022, 0.05, q[0], 0.1, q[1], 8); var dm = new T.Mesh(new T.SphereGeometry(0.024, 8, 6, 0, D2, 0, Math.PI / 2), solid('#e8dcc4')); dm.scale.y = 1.4; dm.position.set(q[0], 0.15, q[1]); g.add(dm); });
    // the tower
    var tw = mat(winTex('belw', '#efe7d6', '#3a3a3a', 3, 5, { tall: 0.3 }), 1, 1);
    box(g, tw, 0.2, 0.4, 0.18, 0, 0.1, -0.08);
    box(g, stL, 0.24, 0.02, 0.06, 0, 0.32, 0.03); // loggia balcony
    for (var k = 0; k < 4; k++) cyl(g, stL, 0.005, 0.005, 0.05, -0.09 + k * 0.06, 0.34, 0.05, 5);
    for (var m = 0; m < 7; m++) [[-0.1, 0], [0.1, 0]].forEach(function (q) { var sp = new T.Mesh(new T.SphereGeometry(0.011, 6, 4, 0, D2, 0, Math.PI / 2), stL); sp.position.set(-0.09 + m * 0.03, 0.5, q[1] - 0.08 + (m % 2 ? 0.09 : -0.09)); g.add(sp); });
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { cyl(g, stL, 0.016, 0.016, 0.06, q[0] * 0.1, 0.42, -0.08 + q[1] * 0.09, 8); var d = new T.Mesh(new T.SphereGeometry(0.018, 8, 6, 0, D2, 0, Math.PI / 2), solid('#e8dcc4')); d.scale.y = 1.4; d.position.set(q[0] * 0.1, 0.48, -0.08 + q[1] * 0.09); g.add(d); });
    var boat = new T.Group(); box(boat, solid('#ffffff'), 0.03, 0.02, 0.09, 0, 0, 0); cyl(boat, solid('#8a6a4a'), 0.002, 0.002, 0.1, 0, 0.02, 0, 4); var sail = new T.Mesh(new T.PlaneGeometry(0.05, 0.07), solid('#ffffff', { side: T.DoubleSide })); sail.rotation.y = Math.PI / 2; sail.position.set(0, 0.07, 0.0); boat.add(sail); boat.position.set(0.45, 0.006, 0.3); g.add(boat);
    return g;
  };

  /* ---------- Cliffs of Moher ---------- */
  M.custom.moher = function () {
    var g = new T.Group();
    blob(g, '#3f86b8', 0.74, 0.62, 0, 0, 0.006, 8);
    // a wavy coastline of tall cliffs
    var pts = [[0.75, 0.6]], n = 14; for (var i = n; i >= 0; i--) { var x = -0.7 + i / n * 1.4; pts.push([x, 0.0 + Math.sin(i * 1.3) * 0.08 + (hash(i, 3) - 0.5) * 0.05]); } pts.push([-0.75, 0.6]);
    var cl = extrude(pts, 0.34, solid('#5f574e', { flatShading: true })); cl.scale.z = 1; g.add(cl);
    var topG = extrude(pts.map(function (p) { return [p[0], p[1] + 0.004]; }), 0.02, solid('#6fbf4a')); topG.position.y = 0.34; g.add(topG);
    for (var b = 0; b < 6; b++) { var y = 0.04 + b * 0.05; var band = extrude(pts.map(function (p) { return [p[0] * 1.002, p[1] + 0.006]; }), 0.012, solid(b % 2 ? '#4a4540' : '#6a625a')); band.position.y = y; g.add(band); }
    // a sea stack and O'Brien's Tower
    mountain(g, { h: 0.26, pos: [0.25, 0.28], seg: 7, r: function (t) { return 0.05 * (1 - t * 0.3); }, bump: 0.2, colour: function (x, y) { return y > 0.24 ? '#6fbf4a' : '#5f574e'; } });
    cyl(g, solid('#8a857a'), 0.03, 0.032, 0.09, -0.2, 0.36, -0.1, 10); for (var k = 0; k < 8; k++) { var a = k / 8 * D2; box(g, solid('#8a857a'), 0.012, 0.014, 0.012, -0.2 + Math.cos(a) * 0.028, 0.45, -0.1 + Math.sin(a) * 0.028); }
    for (var w = 0; w < 6; w++) { var f = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), solid('#ffffff')); f.scale.y = 0.2; f.position.set(-0.6 + w * 0.24, 0.008, 0.05 + Math.sin(w) * 0.06); g.add(f); }
    return g;
  };

  /* ---------- Hallstatt ---------- */
  M.custom.hallstatt = function () {
    var g = new T.Group(), roofs = ['#6a4a3a', '#5a5a62', '#8a4a3a'], walls = ['#f2ece0', '#efe0c4', '#e8d0b0', '#f4f0e8', '#d8e4ea'];
    blob(g, '#3f8fa8', 0.74, 0.62, 0, 0.12, 0.006, 5);
    mountain(g, { h: 0.75, pos: [0, -0.4], r: function (t) { return 0.6 * (1 - t) + 0.03; }, bump: 0.3, sx: 1.25, sz: 0.55, colour: function (x, y) { return y > 0.6 ? '#f2f4f6' : y > 0.4 ? '#8a8a82' : noise(x * 12, y * 12) > 0.5 ? '#2f6b3a' : '#3f7a44'; } });
    for (var i = 0; i < 14; i++) {
      var x = -0.5 + i * 0.075 + hash(i, 1) * 0.02, z = -0.1 + Math.abs(x) * 0.15 + hash(i, 2) * 0.04, y = 0.006 + (hash(i, 3) * 0.04), w = 0.05 + hash(i, 4) * 0.02, h = 0.06 + hash(i, 5) * 0.04;
      box(g, solid(walls[i % 5]), w, h + y, 0.05, x, 0, z); ridge(g, solid(roofs[i % 3]), w + 0.01, 0.04, 0.058, x, h + y, z);
      for (var k = 0; k < 2; k++) box(g, solid('#5a6a7a'), 0.01, 0.014, 0.002, x - w * 0.2 + k * w * 0.4, y + h * 0.5, z + 0.026);
    }
    // the church with its pointed white steeple
    box(g, solid('#f6f2ea'), 0.07, 0.24, 0.07, 0.08, 0.0, -0.18); cyl(g, solid('#4a4440'), 0, 0.05, 0.16, 0.08, 0.24, -0.18, 4, Math.PI / 4); box(g, solid('#f6f2ea'), 0.12, 0.1, 0.08, 0.16, 0.0, -0.2); ridge(g, solid('#4a4440'), 0.13, 0.05, 0.09, 0.16, 0.1, -0.2);
    // a little boat and swans on the lake
    var bt = new T.Group(); box(bt, solid('#8a5a3a'), 0.03, 0.012, 0.08, 0, 0, 0); bt.position.set(-0.1, 0.006, 0.35); bt.rotation.y = 0.5; g.add(bt);
    [[0.2, 0.3], [0.25, 0.35]].forEach(function (q) { var sw = new T.Mesh(new T.SphereGeometry(0.012, 6, 5), solid('#ffffff')); sw.scale.set(1, 0.6, 1.5); sw.position.set(q[0], 0.012, q[1]); g.add(sw); cyl(g, solid('#ffffff'), 0.003, 0.003, 0.02, q[0], 0.014, q[1] + 0.012, 4); });
    return g;
  };

  /* ---------- Alhambra ---------- */
  M.custom.alhambra = function () {
    var g = new T.Group(), wall = mat(stoneTex('alh', '#c98a5a', '#ab7048', 12, 6), 6, 1), wallL = solid('#d9a070'), tile = solid('#3f8f6a');
    mountain(g, { h: 0.35, pos: [0.1, -0.55], r: function (t) { return 0.4 * (1 - t) + 0.02; }, bump: 0.3, sx: 1.6, sz: 0.4, colour: function (x, y) { return y > 0.22 ? '#f4f6f8' : '#8a9aa8'; } });
    blob(g, '#6f9a4a', 0.74, 0.6, 0, 0.05, 0.006, 3);
    mountain(g, { h: 0.1, pos: [0, 0], r: function (t) { return 0.55 * (1 - t * 0.3); }, bump: 0.15, sx: 1.2, sz: 0.65, rings: 6, colour: function () { return '#7a8a4a'; } });
    var Y = 0.1;
    // outer walls and towers along the ridge
    box(g, wall, 1.0, 0.1, 0.04, 0, Y, 0.2); box(g, wall, 1.0, 0.1, 0.04, 0, Y, -0.22); box(g, wall, 0.04, 0.1, 0.42, -0.5, Y, -0.01); box(g, wall, 0.04, 0.1, 0.42, 0.5, Y, -0.01);
    [[-0.5, 0.2], [-0.25, 0.2], [0.05, 0.2], [0.3, 0.2], [0.5, 0.2], [0.5, -0.22], [-0.5, -0.22]].forEach(function (q) { box(g, wall, 0.07, 0.15, 0.07, q[0], Y, q[1]); for (var k = 0; k < 3; k++) box(g, wallL, 0.016, 0.02, 0.074, q[0] - 0.025 + k * 0.025, Y + 0.15, q[1]); });
    // Comares Tower and the Alcazaba
    box(g, wall, 0.16, 0.26, 0.14, -0.05, Y, -0.12); box(g, solid('#3a2a20'), 0.03, 0.05, 0.002, -0.05, Y + 0.17, -0.049);
    box(g, wall, 0.12, 0.22, 0.12, -0.38, Y, 0.0); for (var c = 0; c < 4; c++) box(g, wallL, 0.02, 0.025, 0.124, -0.42 + c * 0.03, Y + 0.22, 0.0);
    // the Court of the Lions: arcade around a fountain
    box(g, solid('#efe6d4'), 0.26, 0.006, 0.2, 0.22, Y, -0.02);
    for (var i = 0; i < 6; i++) [-0.09, 0.07].forEach(function (z) { cyl(g, solid('#f4ecdc'), 0.005, 0.005, 0.06, 0.12 + i * 0.04, Y, z, 6); });
    box(g, solid('#efe2c8'), 0.26, 0.02, 0.04, 0.22, Y + 0.06, -0.09); box(g, solid('#efe2c8'), 0.26, 0.02, 0.04, 0.22, Y + 0.06, 0.07); hip(g, tile, 0.3, 0.06, 0.03, 0.22, Y + 0.08, -0.09, 0.4); hip(g, tile, 0.3, 0.06, 0.03, 0.22, Y + 0.08, 0.07, 0.4);
    cyl(g, solid('#f4ecdc'), 0.03, 0.03, 0.02, 0.22, Y, -0.01, 12); cyl(g, solid('#8ad0f0'), 0.024, 0.024, 0.022, 0.22, Y, -0.01, 12);
    for (var j = 0; j < 9; j++) cypress(g, -0.6 + j * 0.15, 0.36 + hash(j, 1) * 0.08, 1.2);
    return g;
  };

  /* ---------- Cappadocia ---------- */
  M.custom.cappadocia = function () {
    var g = new T.Group();
    blob(g, '#d8bf98', 0.74, 0.62, 0, 0, 0.006, 6);
    for (var i = 0; i < 13; i++) {
      var a = hash(i, 1) * D2, r = 0.1 + Math.sqrt(hash(i, 2)) * 0.48, x = Math.cos(a) * r, z = Math.sin(a) * r * 0.85, h = 0.14 + hash(i, 3) * 0.16, w = 0.04 + hash(i, 4) * 0.03;
      var ch = lathe([[w * 1.6, 0], [w * 1.3, h * 0.3], [w, h * 0.7], [w * 0.8, h], [0, h]], 9, solid(hash(i, 5) > 0.5 ? '#e8d4b0' : '#dcc29a', { flatShading: true })); ch.position.set(x, 0, z); g.add(ch);
      var cap = new T.Mesh(new T.ConeGeometry(w * 1.25, w * 1.1, 8), solid('#8a6a52', { flatShading: true })); cap.position.set(x, h + w * 0.4, z); g.add(cap);
      if (i % 3 === 0) box(g, solid('#3a2a22'), 0.012, 0.018, 0.004, x, h * 0.3, z + w * 1.15);
    }
    // hot-air balloons
    var cols = [['#e8473a', '#f2c14e'], ['#2b6fd0', '#ffffff'], ['#4fb35a', '#f2c14e'], ['#ff8a5a', '#7a4bd8'], ['#ff6f91', '#ffffff']];
    cols.forEach(function (c, k) {
      var b = new T.Group(), env = new T.Mesh(new T.SphereGeometry(0.06, 12, 10), solid(c[0])); env.scale.y = 1.2; env.position.y = 0.09; b.add(env);
      var stripe = new T.Mesh(new T.CylinderGeometry(0.061, 0.055, 0.03, 12, 1, true), solid(c[1])); stripe.position.y = 0.08; b.add(stripe);
      var cone = new T.Mesh(new T.CylinderGeometry(0.03, 0.012, 0.04, 10), solid(c[0])); cone.position.y = 0.02; b.add(cone);
      box(b, solid('#8a5a32'), 0.02, 0.016, 0.02, 0, -0.03, 0);
      b.position.set(-0.4 + k * 0.2, 0.35 + hash(k, 7) * 0.25, -0.1 + hash(k, 8) * 0.3); g.add(b);
    });
    return g;
  };
})();
