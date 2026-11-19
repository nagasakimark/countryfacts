/* Detailed landmarks, batch 10: Galápagos, Angel Falls, Havana, Dubrovnik, Hungarian Parliament,
   Nyhavn, Banaue Rice Terraces, Sossusvlei. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 12, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function jungle(g, n, r0, r1, seed, y, front) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0); if (front && Math.sin(a) > 0.55) continue; var c = new T.Mesh(new T.IcosahedronGeometry(0.045 + hash(i, seed + 2) * 0.035, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.04, Math.sin(a) * r * 0.85); g.add(c); } }
  function car(g, x, z, ry, col) { var c = new T.Group(); box(c, solid(col), 0.035, 0.016, 0.075, 0, 0.008, 0); box(c, solid(col), 0.03, 0.014, 0.034, 0, 0.024, -0.008); box(c, solid('#bfe3ff'), 0.031, 0.008, 0.03, 0, 0.026, -0.008); [[0.018, 0.024], [-0.018, 0.024], [0.018, -0.024], [-0.018, -0.024]].forEach(function (q) { var w = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.006, 8), solid('#2f2f3a')); w.rotation.z = Math.PI / 2; w.position.set(q[0], 0.008, q[1]); c.add(w); }); c.position.set(x, 0.006, z); c.rotation.y = ry; g.add(c); }

  /* ---------- Galápagos ---------- */
  M.custom.galapagos = function () {
    var g = new T.Group();
    blob(g, '#2f8fc0', 0.74, 0.62, 0, 0, 0.006, 7);
    mountain(g, { h: 0.07, pos: [-0.05, -0.08], rings: 6, r: function (t) { return 0.55 * (1 - t * 0.4); }, bump: 0.3, sx: 1.2, sz: 0.8, jag: 0.006, colour: function (x, y, z) { return y < 0.015 ? '#3a3430' : noise(x * 14, z * 14) > 0.5 ? '#8aa05a' : '#9a8a6a'; } });
    mountain(g, { h: 0.2, pos: [-0.3, -0.3], r: function (t) { return 0.18 * (1 - t) + 0.02; }, bump: 0.3, colour: function (x, y) { return y > 0.15 ? '#5a554e' : '#7a6a5a'; } });
    blob(g, '#e8dcc0', 0.2, 0.08, 0.15, 0.3, 0.012, 2); // a white beach
    // prickly-pear cacti
    for (var c = 0; c < 6; c++) { var x = -0.35 + c * 0.13, z = -0.05 + hash(c, 2) * 0.1, y = 0.06; cyl(g, solid('#7a6a4a'), 0.008, 0.01, 0.08, x, y, z, 6); for (var p = 0; p < 4; p++) { var pad = new T.Mesh(new T.SphereGeometry(0.018, 6, 5), solid('#5f8a3a', { flatShading: true })); pad.scale.set(1, 1.2, 0.35); pad.position.set(x + (p - 1.5) * 0.015, y + 0.08 + (p % 2) * 0.02, z); pad.rotation.z = (p - 1.5) * 0.4; g.add(pad); } }
    // giant tortoises
    [[0.25, 0.15, 0.4], [0.05, 0.2, -0.6], [-0.2, 0.18, 2]].forEach(function (q) { var t = new T.Group(); var sh = new T.Mesh(new T.SphereGeometry(0.035, 10, 7, 0, D2, 0, Math.PI / 2), solid('#4f4636', { flatShading: true })); sh.scale.set(1, 0.8, 1.2); sh.position.y = 0.012; t.add(sh); box(t, solid('#6f6450'), 0.014, 0.014, 0.03, 0, 0.012, 0.048); [[0.025, 0.025], [-0.025, 0.025], [0.025, -0.025], [-0.025, -0.025]].forEach(function (l) { cyl(t, solid('#6f6450'), 0.006, 0.007, 0.014, l[0], 0, l[1], 5); }); t.position.set(q[0], 0.07, q[1] - 0.05); t.rotation.y = q[2]; t.scale.setScalar(1.3); g.add(t); });
    // marine iguanas and a sea lion on the beach
    [[0.08, 0.32], [0.2, 0.34]].forEach(function (q) { var ig = new T.Mesh(new T.CylinderGeometry(0.006, 0.01, 0.06, 5), solid('#2f2f30')); ig.rotation.set(Math.PI / 2, 0, 0.5); ig.position.set(q[0], 0.018, q[1]); g.add(ig); });
    var sl = new T.Mesh(new T.SphereGeometry(0.02, 8, 6), solid('#8a6a4a')); sl.scale.set(1, 0.6, 2.2); sl.position.set(0.25, 0.02, 0.27); g.add(sl);
    var crab = new T.Mesh(new T.SphereGeometry(0.012, 6, 4), solid('#e8473a')); crab.scale.y = 0.4; crab.position.set(-0.05, 0.02, 0.32); g.add(crab);
    return g;
  };

  /* ---------- Angel Falls ---------- */
  M.custom.angelfalls = function () {
    var g = new T.Group();
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // the tepui: a table mountain with sheer walls
    mountain(g, { h: 0.85, pos: [0, -0.3], rings: 14, seg: 14, r: function (t) { return t > 0.96 ? 0.4 * (1 - (t - 0.96) * 20) : 0.42 - t * 0.04; }, bump: 0.18, sx: 1.4, sz: 0.65, jag: 0.008, colour: function (x, y, z) { if (y > 0.82) return noise(x * 20, z * 20) > 0.5 ? '#4f8a3a' : '#6a9a4a'; return y < 0.12 ? '#3f6a3a' : noise(x * 8, y * 18) > 0.55 ? '#6a4a3a' : '#8a5a44'; } });
    // the long, thin fall and its spray
    var fall = new T.Mesh(new T.PlaneGeometry(0.045, 0.78, 1, 8), solid('#f2faff', { side: T.DoubleSide, transparent: true, opacity: 0.92 })); var fp = fall.geometry.attributes.position; for (var i = 0; i < fp.count; i++) fp.setX(i, fp.getX(i) * (1 + (0.39 - fp.getY(i)) * 1.6)); fall.position.set(0.05, 0.43, -0.02); g.add(fall);
    for (var k = 0; k < 5; k++) { var sp = new T.Mesh(new T.SphereGeometry(0.05 + k * 0.01, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.5 })); sp.position.set(0.05 + (k - 2) * 0.03, 0.04 + k * 0.02, 0.02); g.add(sp); }
    var river = new T.Mesh(new T.PlaneGeometry(0.1, 0.5), solid('#7a5a3a')); river.rotation.x = -Math.PI / 2; river.position.set(0.05, 0.01, 0.3); g.add(river);
    jungle(g, 34, 0.35, 0.72, 4, 0, true);
    return g;
  };

  /* ---------- Havana ---------- */
  M.custom.havana = function () {
    var g = new T.Group(), white = mat(winTex('hvw', '#f2efe6', '#6a7a8a', 6, 2, { tall: 0.6 }), 4, 1), plain = solid('#f4f1ea');
    blob(g, '#c9c2b0', 0.74, 0.6, 0, -0.02, 0.006, 3);
    var sea = new T.Mesh(new T.PlaneGeometry(1.4, 0.25), solid('#2f8fc0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, 0.5); g.add(sea);
    box(g, solid('#d8d2c2'), 1.3, 0.03, 0.03, 0, 0.0, 0.38); // the Malecón sea wall
    // El Capitolio
    box(g, white, 0.6, 0.12, 0.18, 0, 0.006, -0.22);
    for (var i = 0; i < 8; i++) cyl(g, plain, 0.008, 0.009, 0.1, -0.1 + i * 0.0286, 0.006, -0.12, 8);
    prism(g, plain, 0.24, 0.05, 0.03, 0, 0.11, -0.115);
    cyl(g, plain, 0.07, 0.075, 0.08, 0, 0.13, -0.22, 16); cyl(g, plain, 0.06, 0.06, 0.04, 0, 0.21, -0.22, 16);
    dome(g, solid('#e8e4da'), 0.065, 0, 0.25, -0.22, 1.4); cyl(g, plain, 0.012, 0.016, 0.05, 0, 0.34, -0.22, 8); var tip = new T.Mesh(new T.SphereGeometry(0.01, 6, 5), solid('#d8ad4c')); tip.position.set(0, 0.4, -0.22); g.add(tip);
    // pastel buildings along the street
    var cols = ['#f2a7c3', '#7fd0e8', '#f2d06a', '#a8e0a0', '#f2a07a', '#c8a8f0'];
    for (var b = 0; b < 8; b++) { var x = -0.56 + b * 0.16, h = 0.08 + hash(b, 2) * 0.05; box(g, solid(cols[b % 6]), 0.14, h, 0.1, x, 0.006, 0.12); box(g, solid('#ffffff'), 0.145, 0.01, 0.105, x, 0.006 + h, 0.12); for (var w = 0; w < 3; w++) box(g, solid('#4a3a3a'), 0.018, 0.03, 0.002, x - 0.04 + w * 0.04, 0.03, 0.171); }
    // classic cars
    [['#ff5a8a', -0.3, 0.27, Math.PI / 2], ['#3fc9c0', 0.0, 0.3, -Math.PI / 2], ['#e8473a', 0.3, 0.27, Math.PI / 2], ['#f2d06a', 0.15, 0.0, 0.1]].forEach(function (c) { car(g, c[1], c[2], c[3], c[0]); });
    [[-0.5, -0.05], [0.5, -0.05], [-0.4, -0.42], [0.42, -0.42]].forEach(function (q) { palm(g, q[0], q[1], 1.3); });
    return g;
  };

  /* ---------- Dubrovnik ---------- */
  M.custom.dubrovnik = function () {
    var g = new T.Group(), wall = mat(stoneTex('dbw', '#d8ccb0', '#b8ac90', 12, 6), 8, 1), roofs = ['#e0703a', '#d8602e', '#e88a4a', '#c95a2a'], walls = ['#efe6d0', '#e8dcc0', '#f2ead8'];
    blob(g, '#2f86b8', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#7a9a5a', 0.7, 0.25, 0, -0.42, 0.012, 3);
    // the walls: a closed loop around the old town
    var loop = new T.Shape(); loop.absellipse(0, 0.05, 0.45, 0.3, 0, D2, false, 0); var hole = new T.Path(); hole.absellipse(0, 0.05, 0.42, 0.27, 0, D2, true, 0); loop.holes.push(hole);
    var w = new T.Mesh(new T.ExtrudeGeometry(loop, { depth: 0.1, bevelEnabled: false, curveSegments: 28 }), wall); w.rotation.x = -Math.PI / 2; w.position.y = 0.0; w.scale.z = 1; g.add(w);
    var floor = new T.Mesh(new T.CircleGeometry(1, 28), solid('#cfc4ac')); floor.rotation.x = -Math.PI / 2; floor.scale.set(0.43, 0.28, 1); floor.position.set(0, 0.05, -0.05); g.add(floor);
    // the old town's orange roofs
    for (var i = 0; i < 26; i++) { var a = hash(i, 1) * D2, r = Math.sqrt(hash(i, 2)) * 0.85, x = Math.cos(a) * r * 0.36, z = -0.05 - Math.sin(a) * r * 0.22, h = 0.05 + hash(i, 3) * 0.04; box(g, solid(walls[i % 3]), 0.07, h, 0.06, x, 0.05, z); ridge(g, solid(roofs[i % 4]), 0.075, 0.035, 0.065, x, 0.05 + h, z, hash(i, 4) > 0.5 ? 0 : Math.PI / 2); }
    // Minčeta tower and the harbour fort
    cyl(g, wall, 0.06, 0.07, 0.24, -0.3, 0, -0.2, 14); for (var k = 0; k < 10; k++) { var an = k / 10 * D2; box(g, wall, 0.016, 0.02, 0.016, -0.3 + Math.cos(an) * 0.055, 0.24, -0.2 + Math.sin(an) * 0.055); }
    cyl(g, wall, 0.05, 0.055, 0.14, 0.42, 0, 0.12, 12);
    box(g, solid('#efe6d0'), 0.03, 0.18, 0.03, 0.05, 0.05, -0.05); cyl(g, solid('#5aa88a'), 0, 0.025, 0.05, 0.05, 0.23, -0.05, 6);
    var bt = new T.Group(); box(bt, solid('#ffffff'), 0.025, 0.012, 0.06, 0, 0, 0); bt.position.set(0.3, 0.008, 0.38); g.add(bt);
    return g;
  };

  /* ---------- Hungarian Parliament ---------- */
  M.custom.hunparl = function () {
    var g = new T.Group(), wall = mat(winTex('hpw', '#f2ece0', '#5a6070', 10, 3, { tall: 0.55 }), 6, 1), white = solid('#f4efe4'), roof = solid('#b8503a');
    var river = new T.Mesh(new T.PlaneGeometry(1.5, 0.4), solid('#5a8fb0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.006, 0.38); g.add(river);
    blob(g, '#9ab070', 0.74, 0.4, 0, -0.25, 0.008, 2);
    box(g, solid('#c9c2b0'), 1.2, 0.02, 0.06, 0, 0, 0.17);
    box(g, wall, 1.1, 0.13, 0.22, 0, 0, -0.05); ridge(g, roof, 1.1, 0.07, 0.24, 0, 0.13, -0.05, 0);
    [-0.4, -0.25, 0.25, 0.4].forEach(function (x) { box(g, wall, 0.1, 0.17, 0.24, x, 0, -0.04); cyl(g, roof, 0, 0.06, 0.08, x, 0.17, -0.04, 4, Math.PI / 4); });
    [-0.18, 0.18].forEach(function (x) { box(g, white, 0.03, 0.3, 0.03, x, 0, 0.05); cyl(g, roof, 0, 0.02, 0.06, x, 0.3, 0.05, 6); });
    for (var i = 0; i < 18; i++) { var x = -0.53 + i * 0.0624; cyl(g, white, 0.004, 0.006, 0.05, x, 0.13, 0.065, 4); }
    // the great central dome with its spire
    cyl(g, white, 0.11, 0.12, 0.1, 0, 0.13, -0.05, 16);
    var dm = new T.Mesh(new T.SphereGeometry(0.11, 16, 10, 0, D2, 0, Math.PI / 2), roof); dm.scale.y = 1.25; dm.position.set(0, 0.23, -0.05); g.add(dm);
    for (var r = 0; r < 16; r++) { var rib = new T.Mesh(new T.TorusGeometry(0.111, 0.004, 3, 8, Math.PI / 2), white); rib.scale.y = 1.25; rib.rotation.y = r / 16 * D2; rib.position.set(0, 0.23, -0.05); g.add(rib); }
    cyl(g, white, 0.012, 0.02, 0.06, 0, 0.36, -0.05, 8); cyl(g, white, 0, 0.012, 0.12, 0, 0.42, -0.05, 8);
    return g;
  };

  /* ---------- Nyhavn, Copenhagen ---------- */
  M.custom.nyhavn = function () {
    var g = new T.Group(), cols = ['#e8473a', '#f2c14e', '#2b6fd0', '#f2a07a', '#4fb35a', '#efe2c8', '#e86a3a', '#7fb8e0'];
    blob(g, '#c9c2b0', 0.74, 0.6, 0, 0, 0.006, 2);
    var canal = new T.Mesh(new T.PlaneGeometry(0.3, 1.3), solid('#2f6f8f')); canal.rotation.x = -Math.PI / 2; canal.position.y = 0.01; g.add(canal);
    [-1, 1].forEach(function (s) { for (var i = 0; i < 8; i++) {
      var z = -0.56 + i * 0.15, h = 0.12 + hash(i, s + 4) * 0.06, x = s * 0.27, c = solid(cols[(i + (s > 0 ? 4 : 0)) % 8]);
      box(g, c, 0.1, h, 0.13, x, 0, z);
      if (i % 2) { for (var k = 0; k < 3; k++) box(g, c, 0.1, 0.02, 0.13 - k * 0.04, x, h + k * 0.02, z); } else ridge(g, solid('#8a4a3a'), 0.12, 0.05, 0.135, x, h, z, Math.PI / 2);
      for (var f = 0; f < 3; f++) for (var w = 0; w < 3; w++) box(g, solid('#f6f2ea'), 0.002, 0.018, 0.016, x - s * 0.051, 0.025 + f * 0.04, z - 0.035 + w * 0.035);
    } });
    // wooden sailing ships with tall masts
    [[-0.06, -0.3], [0.06, 0.05], [-0.06, 0.35]].forEach(function (q, i) { var b = new T.Group(); box(b, solid(i === 1 ? '#2a2a30' : '#6a4a32'), 0.05, 0.03, 0.18, 0, 0, 0); box(b, solid('#c9a46a'), 0.046, 0.004, 0.17, 0, 0.03, 0); [0.04, -0.05].forEach(function (z) { cyl(b, solid('#5a3a28'), 0.003, 0.004, 0.24, 0, 0.03, z, 5); box(b, solid('#5a3a28'), 0.06, 0.003, 0.003, 0, 0.18, z); }); b.position.set(q[0], 0.01, q[1]); g.add(b); });
    return g;
  };

  /* ---------- Banaue Rice Terraces ---------- */
  M.custom.banaue = function () {
    var g = new T.Group();
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // a hillside of stepped terraces (each a ring with a shiny wet edge)
    for (var i = 0; i < 9; i++) {
      var r = 0.62 - i * 0.06, y = i * 0.04, ter = new T.Mesh(new T.CylinderGeometry(r, r + 0.012, 0.04, 26, 1, false, Math.PI * 0.95, Math.PI * 1.1), solid(i % 2 ? '#7fbf4a' : '#9ad05a', { flatShading: true }));
      var p = ter.geometry.attributes.position; for (var k = 0; k < p.count; k++) { var x = p.getX(k), z = p.getZ(k), a = Math.atan2(z, x), d = 1 + (noise(a * 3, i) - 0.5) * 0.12; p.setX(k, x * d); p.setZ(k, z * d); } ter.geometry.computeVertexNormals();
      ter.position.set(0, y + 0.02, -0.15); g.add(ter);
      var rim = new T.Mesh(new T.TorusGeometry(r * 0.98, 0.004, 3, 26, Math.PI * 1.1), solid('#b8e0f0')); rim.rotation.set(Math.PI / 2, 0, Math.PI * 0.45 + 0.0); rim.rotation.z = -Math.PI * 0.05; rim.position.set(0, y + 0.041, -0.15); g.add(rim);
    }
    // Ifugao houses on stilts
    [[-0.3, 0.2, 0.08], [-0.15, 0.08, 0.2], [0.25, 0.16, 0.12]].forEach(function (q) { var y = q[2]; for (var l = 0; l < 4; l++) cyl(g, solid('#5a3a28'), 0.003, 0.003, 0.035, q[0] + (l % 2 ? 0.015 : -0.015), y, q[1] + (l < 2 ? 0.015 : -0.015), 4); box(g, solid('#7a5a3a'), 0.04, 0.02, 0.04, q[0], y + 0.035, q[1]); var rf = new T.Mesh(new T.ConeGeometry(0.04, 0.05, 4), solid('#a8905a', { flatShading: true })); rf.rotation.y = Math.PI / 4; rf.position.set(q[0], y + 0.08, q[1]); g.add(rf); });
    for (var t = 0; t < 10; t++) { var a2 = Math.PI * (1.05 + t * 0.09), r2 = 0.68; tree(g, Math.cos(a2) * r2 * 0.9, -0.15 + Math.sin(a2) * r2 * 0.6, 1.3, '#2f6b3a'); }
    return g;
  };

  /* ---------- Sossusvlei & Deadvlei ---------- */
  M.custom.sossusvlei = function () {
    var g = new T.Group();
    blob(g, '#e0844a', 0.74, 0.62, 0, 0, 0.006, 4);
    function dune(x, z, h, len, ry, seed) {
      var geo = new T.CylinderGeometry(0, 1, 1, 4, 6), p = geo.attributes.position;
      for (var i = 0; i < p.count; i++) { var px = p.getX(i), py = p.getY(i) + 0.5, pz = p.getZ(i); p.setXYZ(i, px * len * (1 + (noise(px * 3 + seed, py * 2) - 0.5) * 0.3), py * h, pz * 0.18); }
      geo.computeVertexNormals();
      var m = new T.Mesh(paintVerts(geo, function (vx, vy, vz) { return vz > 0 ? (vy > h * 0.6 ? '#f0a060' : '#e88a4a') : (vy > h * 0.5 ? '#c9602e' : '#b8542a'); }), vcMat); m.position.set(x, 0, z); m.rotation.y = ry; g.add(m);
    }
    dune(-0.2, -0.3, 0.42, 0.45, 0.2, 1); dune(0.35, -0.2, 0.3, 0.32, -0.4, 3); dune(-0.48, 0.2, 0.22, 0.25, 0.9, 5); dune(0.45, 0.3, 0.18, 0.22, 1.2, 7);
    // the white clay pan with dead camel-thorn trees
    blob(g, '#f2ece0', 0.2, 0.12, 0.05, 0.25, 0.01, 2);
    [[0.0, 0.22], [0.1, 0.28], [0.08, 0.18], [-0.05, 0.3]].forEach(function (q, k) { var t = new T.Group(), dk = solid('#2a1e18'); cyl(t, dk, 0.004, 0.007, 0.07, 0, 0, 0, 5); for (var b = 0; b < 4; b++) { var br = box(t, dk, 0.003, 0.04, 0.003, 0, 0.05, 0); br.rotation.set(Math.sin(b * 1.7) * 0.8, 0, Math.cos(b * 1.7) * 0.8); } t.position.set(q[0], 0.01, q[1]); t.rotation.y = k; g.add(t); });
    // an oryx
    var ox = new T.Group(), bd = solid('#c9b8a0'); box(ox, bd, 0.016, 0.018, 0.045, 0, 0.026, 0); [[0.005, 0.016], [-0.005, 0.016], [0.005, -0.016], [-0.005, -0.016]].forEach(function (q) { box(ox, solid('#3a3030'), 0.004, 0.026, 0.004, q[0], 0, q[1]); }); box(ox, bd, 0.01, 0.014, 0.014, 0, 0.044, 0.026); [0.003, -0.003].forEach(function (x) { box(ox, solid('#2a2420'), 0.002, 0.04, 0.002, x, 0.055, 0.02).rotation.x = -0.4; }); ox.position.set(-0.2, 0.006, 0.38); ox.scale.setScalar(1.6); g.add(ox);
    return g;
  };
})();
