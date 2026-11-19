/* Detailed landmarks, batch 30: Tjibaou Cultural Centre, Joya de Cerén, Fortaleza Ozama, Clock Tower of Tirana,
   Newborn monument, Reunification Monument (Yaoundé), St Peter's Cathedral (Likoma), Parliament Buildings (Bridgetown). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }

  /* ---------- Tjibaou Cultural Centre ---------- */
  M.custom.tjibaou = function () {
    var g = new T.Group(), wood = solid('#a8885a', { flatShading: true });
    blob(g, '#4ab0b8', 0.74, 0.62, 0, 0.1, 0.006, 5);
    blob(g, '#5f9a45', 0.62, 0.36, 0, -0.1, 0.012, 3);
    // a row of tall curved wooden "huts" made of slats, inspired by Kanak houses; open at the top
    [[-0.32, 0.16], [-0.16, 0.24], [0.0, 0.3], [0.16, 0.22], [0.3, 0.15]].forEach(function (h, k) {
      var hg = new T.Group(), H = h[1];
      for (var r = 0; r < 14; r++) { var a = -Math.PI * 0.85 + r / 13 * Math.PI * 0.85 * 1.0, pts = []; for (var s = 0; s <= 6; s++) { var t = s / 6; pts.push(new T.Vector3(Math.cos(a) * 0.06 * (1 - t * 0.35), t * H, Math.sin(a) * 0.06 * (1 - t * 0.35) - (t * t) * 0.03)); }
        hg.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 6, 0.0035, 3), wood)); }
      for (var b = 0; b < 4; b++) { var ring = new T.Mesh(new T.TorusGeometry(0.06 * (1 - b * 0.08), 0.002, 3, 12, Math.PI * 0.85), wood); ring.rotation.x = Math.PI / 2; ring.rotation.z = Math.PI * 0.15; ring.position.y = 0.03 + b * H * 0.22; hg.add(ring); }
      hg.position.set(h[0] * 1.15, 0.012, -0.08); hg.scale.setScalar(1.5); g.add(hg); });
    // low glass-roofed walkway behind
    box(g, solid('#c9c4b8'), 0.7, 0.03, 0.06, 0, 0.012, -0.24);
    for (var t = 0; t < 10; t++) { var cp = new T.Mesh(new T.ConeGeometry(0.018, 0.14, 6), solid('#2f6a3a')); cp.position.set(-0.45 + t * 0.1, 0.082, -0.36 + hash(t, 1) * 0.04); g.add(cp); }
    return g;
  };

  /* ---------- Joya de Cerén ---------- */
  M.custom.joyaceren = function () {
    var g = new T.Group(), adobe = solid('#b8956a', { flatShading: true }), thatch = solid('#c9a050', { flatShading: true });
    blob(g, '#7aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // a dug-out pit showing a Maya farming village buried by volcanic ash, under protective roofs
    var pit = new T.Mesh(new T.BoxGeometry(0.6, 0.004, 0.36), solid('#8a7058')); pit.position.set(0, 0.008, 0.02); g.add(pit);
    [[-0.18, -0.04], [0.02, 0.06], [0.2, -0.05]].forEach(function (q, k) {
      box(g, adobe, 0.1, 0.035, 0.08, q[0], 0.008, q[1]); box(g, adobe, 0.12, 0.012, 0.1, q[0], 0.008, q[1]);
      var pot = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), solid('#a85a3a')); pot.position.set(q[0] + 0.03, 0.05, q[1]); g.add(pot);
      // the modern metal roofs that protect the ruins
      for (var p = 0; p < 4; p++) cyl(g, solid('#8a8a88'), 0.003, 0.003, 0.12, q[0] + (p % 2 ? 0.07 : -0.07), 0.008, q[1] + (p < 2 ? 0.06 : -0.06), 4);
      var rf = new T.Mesh(new T.BoxGeometry(0.17, 0.006, 0.14), solid('#a8b0b0')); rf.position.set(q[0], 0.13, q[1]); rf.rotation.z = 0.08; g.add(rf); });
    // a rebuilt thatched hut, corn field and the volcano in the distance
    var hut = new T.Mesh(new T.ConeGeometry(0.06, 0.07, 4), thatch); hut.rotation.y = Math.PI / 4; hut.position.set(0.38, 0.1, 0.32); g.add(hut); box(g, adobe, 0.07, 0.06, 0.07, 0.38, 0.006, 0.32);
    for (var c = 0; c < 14; c++) { cyl(g, solid('#6aa04a'), 0.003, 0.003, 0.07, -0.45 + (c % 7) * 0.04, 0.006, 0.3 + Math.floor(c / 7) * 0.05, 3); }
    mountain(g, { h: 0.32, pos: [0.15, -0.38], r: function (t) { return 0.2 * (1 - t) + 0.03; }, sx: 1.3, sz: 0.5, bump: 0.15, colour: function (x, y) { return y > 0.22 ? '#6a6058' : '#4f7a3f'; } });
    return g;
  };

  /* ---------- Fortaleza Ozama ---------- */
  M.custom.ozama = function () {
    var g = new T.Group(), st = mat(stoneTex('ozm', '#c9b48a', '#a8946a', 6, 8), 1, 2);
    blob(g, '#9aa868', 0.74, 0.62, 0, 0, 0.006, 3);
    var rv = new T.Mesh(new T.PlaneGeometry(0.2, 1.0), solid('#4f7a8a')); rv.rotation.x = -Math.PI / 2; rv.position.set(0.46, 0.009, 0); rv.scale.y = 0.6; g.add(rv);
    // the Tower of Homage, the oldest European fort in the Americas, behind crenellated walls
    box(g, st, 0.14, 0.32, 0.14, 0.1, 0.006, -0.08);
    for (var i = 0; i < 4; i++) { [[0.04 + i * 0.04, -0.01], [0.04 + i * 0.04, -0.15], [0.03, -0.13 + i * 0.04], [0.17, -0.13 + i * 0.04]].forEach(function (q) { box(g, st, 0.02, 0.024, 0.02, q[0], 0.326, q[1]); }); }
    for (var w = 0; w < 3; w++) box(g, solid('#3a3020'), 0.014, 0.025, 0.002, 0.1, 0.1 + w * 0.07, -0.009);
    cyl(g, solid('#dddddd'), 0.003, 0.003, 0.08, 0.1, 0.35, -0.08, 4);
    box(g, solid('#002d62'), 0.024, 0.016, 0.003, 0.114, 0.41, -0.08); box(g, solid('#ce1126'), 0.024, 0.016, 0.003, 0.142, 0.41, -0.08); box(g, solid('#ffffff'), 0.006, 0.032, 0.0032, 0.128, 0.402, -0.08);
    // walls and gate, cannons, the statue of Oviedo in the courtyard
    [[0, 0.22, 0.7, 0.03], [-0.34, -0.05, 0.03, 0.5], [0.3, -0.05, 0.03, 0.5]].forEach(function (q) { box(g, st, q[2], 0.08, q[3], q[0], 0.006, q[1]); });
    for (var c = 0; c < 10; c++) box(g, st, 0.025, 0.02, 0.03, -0.32 + c * 0.07, 0.086, 0.22);
    var gate = new T.Mesh(new T.BoxGeometry(0.1, 0.12, 0.05), st); gate.position.set(-0.15, 0.066, 0.22); g.add(gate);
    for (var k = 0; k < 3; k++) { var cn = new T.Mesh(new T.CylinderGeometry(0.006, 0.009, 0.06, 6), solid('#2a2a2a')); cn.rotation.z = Math.PI / 2; cn.position.set(0.33, 0.06, -0.2 + k * 0.08); g.add(cn); }
    var stt = new T.Mesh(new T.CapsuleGeometry(0.008, 0.03, 3, 6), solid('#5a5040')); stt.position.set(-0.15, 0.04, 0.0); g.add(stt); box(g, solid('#d8d0c0'), 0.03, 0.02, 0.03, -0.15, 0.006, 0.0);
    for (var t = 0; t < 4; t++) palm(g, -0.28 + t * 0.08, -0.28, 1.0);
    return g;
  };

  /* ---------- Clock Tower of Tirana ---------- */
  M.custom.clocktirana = function () {
    var g = new T.Group(), st = mat(stoneTex('ctt', '#d8c8a8', '#bca888', 4, 10), 1, 3), face = mat(tex('cttf', 32, 32, function (c) { c.fillStyle = '#f6f2ea'; c.beginPath(); c.arc(16, 16, 15, 0, D2); c.fill(); c.strokeStyle = '#2a2a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(16, 16); c.lineTo(16, 5); c.moveTo(16, 16); c.lineTo(24, 18); c.stroke(); for (var h = 0; h < 12; h++) { var a = h / 12 * D2; c.fillStyle = '#2a2a2a'; c.fillRect(16 + Math.cos(a) * 12 - 1, 16 + Math.sin(a) * 12 - 1, 2, 2); } }), 1, 1);
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a slim stone tower with a clock and a little wooden belfry on top
    box(g, st, 0.08, 0.36, 0.08, -0.1, 0.006, -0.05);
    [0, 1, 2, 3].forEach(function (s) { var f = new T.Mesh(new T.CircleGeometry(0.028, 16), face); var a = s * Math.PI / 2; f.position.set(-0.1 + Math.sin(a) * 0.041, 0.31, -0.05 + Math.cos(a) * 0.041); f.rotation.y = a; g.add(f); });
    box(g, solid('#8a5a32'), 0.09, 0.05, 0.09, -0.1, 0.366, -0.05);
    hip(g, solid('#c9603a'), 0.1, 0.1, 0.06, -0.1, 0.416, -0.05, 0.05);
    // the Et'hem Bey Mosque beside it and Skanderbeg's statue on horseback on the square
    box(g, mat(winTex('ebm', '#f2e8d4', '#8a6a4a', 4, 1, { tall: 0.5 }), 1, 1), 0.16, 0.08, 0.12, 0.12, 0.006, -0.1);
    var dm = new T.Mesh(new T.SphereGeometry(0.05, 14, 8, 0, D2, 0, Math.PI / 2), solid('#7a8a8a')); dm.position.set(0.12, 0.086, -0.1); g.add(dm);
    cyl(g, solid('#f2e8d4'), 0.012, 0.014, 0.22, 0.22, 0.006, -0.16, 8); var mt = new T.Mesh(new T.ConeGeometry(0.016, 0.05, 8), solid('#7a8a8a')); mt.position.set(0.22, 0.25, -0.16); g.add(mt);
    box(g, solid('#d8d0c0'), 0.06, 0.05, 0.03, 0.05, 0.006, 0.25);
    var hr = new T.Group(), bz = solid('#3a4a3a'); box(hr, bz, 0.016, 0.02, 0.05, 0, 0.03, 0); [[0.005, 0.018], [-0.005, 0.018], [0.005, -0.018], [-0.005, -0.018]].forEach(function (q) { box(hr, bz, 0.004, 0.03, 0.004, q[0], 0, q[1]); }); box(hr, bz, 0.008, 0.025, 0.01, 0, 0.04, 0.025); cyl(hr, bz, 0.007, 0.009, 0.03, 0, 0.05, -0.004, 6); hr.position.set(0.05, 0.056, 0.25); hr.scale.setScalar(1.4); g.add(hr);
    for (var t = 0; t < 6; t++) tree(g, -0.45 + t * 0.18, 0.45, 0.9, '#4f8a3f');
    return g;
  };

  /* ---------- Newborn monument ---------- */
  M.custom.newborn = function () {
    var g = new T.Group(), cols = ['#e8c34a', '#e84a4a', '#3f6ab0', '#4ab07a', '#e88ac8', '#f6f2ea', '#3a3a3a'];
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // giant letters N E W B O R N, repainted in a new design every year
    var L = { N: [[0, 0, 0.022, 0.12], [0.06, 0, 0.022, 0.12], [0.03, -0.004, 0.022, 0.128, 0.42]], E: [[0, 0, 0.022, 0.12], [0.03, 0.098, 0.04, 0.022], [0.03, 0.05, 0.035, 0.022], [0.03, 0, 0.04, 0.022]], W: [[0, 0, 0.02, 0.12], [0.03, 0, 0.02, 0.08], [0.06, 0, 0.02, 0.12], [0.03, 0, 0.05, 0.02]], B: [[0, 0, 0.022, 0.12], [0.03, 0.098, 0.035, 0.022], [0.03, 0.05, 0.035, 0.022], [0.03, 0, 0.035, 0.022], [0.055, 0, 0.018, 0.12]], O: [[0, 0, 0.022, 0.12], [0.048, 0, 0.022, 0.12], [0.022, 0, 0.026, 0.022], [0.022, 0.098, 0.026, 0.022]], R: [[0, 0, 0.022, 0.12], [0.02, 0.098, 0.035, 0.022], [0.047, 0.06, 0.018, 0.05], [0.02, 0.055, 0.035, 0.02], [0.03, -0.002, 0.02, 0.06, 0.45]] };
    var word = 'NEWBORN', x0 = -0.39;
    for (var i = 0; i < word.length; i++) { var lg = new T.Group(), parts = L[word[i]], c = solid(cols[i % cols.length]); parts.forEach(function (p) { var m = box(lg, c, p[2], p[3], 0.04, p[0] + p[2] / 2, p[1], 0); if (p[4]) m.rotation.z = p[4]; }); lg.position.set(x0 + i * 0.112, 0.006, 0); lg.scale.setScalar(1.15); g.add(lg); }
    // people taking photos and writing messages
    for (var p = 0; p < 5; p++) cyl(g, solid(cols[(p + 3) % 6]), 0.008, 0.008, 0.035, -0.3 + p * 0.15, 0.006, 0.15 + hash(p, 2) * 0.08, 6);
    for (var t = 0; t < 6; t++) tree(g, -0.45 + t * 0.18, -0.35, 1.0, '#4f8a3f');
    return g;
  };

  /* ---------- Reunification Monument (Yaoundé) ---------- */
  M.custom.reunification = function () {
    var g = new T.Group(), conc = solid('#c9c4b8', { flatShading: true }), bronze = solid('#6a5a4a', { flatShading: true });
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    var pz = new T.Mesh(new T.CircleGeometry(0.34, 24), solid('#d8d2c4')); pz.rotation.x = -Math.PI / 2; pz.position.y = 0.008; g.add(pz);
    // two curving concrete ramps that spiral up and meet, symbolising the two parts of the country joining
    [-1, 1].forEach(function (sd) { var pts = []; for (var i = 0; i <= 20; i++) { var t = i / 20, a = sd * (Math.PI * 0.9 * (1 - t)) + Math.PI / 2; pts.push(new T.Vector3(Math.cos(a) * 0.3 * (1 - t * 0.7), 0.01 + t * 0.42, Math.sin(a) * 0.24 * (1 - t * 0.7))); }
      var ramp = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, 0.03, 5), conc); ramp.scale.y = 1.0; g.add(ramp); });
    // a bronze family group at the base, and the pointed spire where the ramps meet
    var sp = new T.Mesh(new T.ConeGeometry(0.02, 0.12, 6), conc); sp.position.set(0, 0.48, 0.072); g.add(sp);
    for (var f = 0; f < 3; f++) { var b = new T.Mesh(new T.CapsuleGeometry(0.012, 0.04, 3, 6), bronze); b.position.set(-0.03 + f * 0.03, 0.04, 0.12); g.add(b); }
    for (var t = 0; t < 10; t++) { var a2 = t / 10 * D2; var c = new T.Mesh(new T.IcosahedronGeometry(0.045, 0), solid('#3f8a3f', { flatShading: true })); c.position.set(Math.cos(a2) * 0.55, 0.05, Math.sin(a2) * 0.46); g.add(c); }
    return g;
  };

  /* ---------- St Peter's Cathedral, Likoma ---------- */
  M.custom.likoma = function () {
    var g = new T.Group(), st = mat(stoneTex('lkm', '#c9b8a0', '#a8987e', 8, 6), 2, 1), roof = solid('#8a3a2a', { flatShading: true });
    blob(g, '#3f8ab8', 0.74, 0.62, 0, 0, 0.006, 5); // Lake Malawi
    blob(g, '#c9b890', 0.55, 0.4, -0.05, -0.08, 0.012, 3);
    // a long stone cathedral with a red roof and square west tower, on an island in Lake Malawi
    box(g, st, 0.46, 0.1, 0.14, 0, 0.012, -0.1);
    ridge(g, roof, 0.47, 0.06, 0.15, 0, 0.112, -0.1, 0);
    box(g, st, 0.08, 0.2, 0.08, -0.26, 0.012, -0.1);
    for (var i = 0; i < 4; i++) box(g, st, 0.02, 0.02, 0.02, -0.29 + (i % 2) * 0.06, 0.212, -0.13 + Math.floor(i / 2) * 0.06);
    for (var w = 0; w < 6; w++) { var win = new T.Mesh(new T.CircleGeometry(0.012, 8, 0, Math.PI), solid('#4a6a9a')); win.position.set(-0.18 + w * 0.07, 0.07, -0.029); g.add(win); box(g, solid('#4a6a9a'), 0.024, 0.03, 0.002, -0.18 + w * 0.07, 0.04, -0.029); }
    var ap = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.1, 12, 1, false, 0, Math.PI), st); ap.rotation.y = Math.PI / 2; ap.position.set(0.23, 0.062, -0.1); g.add(ap);
    // mango trees and baobabs, dugout canoes on the shore
    for (var t = 0; t < 5; t++) { var c = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), solid('#2f7a35', { flatShading: true })); c.scale.y = 0.7; c.position.set(-0.4 + t * 0.2, 0.12, 0.18); g.add(c); cyl(g, solid('#6a4a2a'), 0.008, 0.012, 0.08, -0.4 + t * 0.2, 0.012, 0.18, 5); }
    for (var k = 0; k < 3; k++) { var cn = new T.Mesh(new T.CapsuleGeometry(0.01, 0.07, 3, 6), solid('#6a4a2a')); cn.rotation.z = Math.PI / 2; cn.scale.y = 1; cn.position.set(-0.2 + k * 0.18, 0.012, 0.4); g.add(cn); }
    return g;
  };

  /* ---------- Parliament Buildings, Bridgetown ---------- */
  M.custom.bridgetown = function () {
    var g = new T.Group(), coral = mat(winTex('bpb', '#e8dcc0', '#3a5a7a', 8, 2, { tall: 0.6 }), 2, 1), roof = solid('#3a6a5a', { flatShading: true });
    blob(g, '#2f9fc8', 0.74, 0.62, 0, 0.1, 0.006, 5);
    blob(g, '#c9c4b8', 0.6, 0.36, 0, -0.12, 0.012, 3);
    // neo-Gothic coral-stone wings with green roofs, and the clock tower
    box(g, coral, 0.42, 0.1, 0.1, -0.05, 0.012, -0.18); ridge(g, roof, 0.43, 0.05, 0.11, -0.05, 0.112, -0.18, 0);
    box(g, coral, 0.1, 0.1, 0.24, 0.2, 0.012, -0.07); ridge(g, roof, 0.11, 0.05, 0.25, 0.2, 0.112, -0.07, Math.PI / 2);
    box(g, coral, 0.08, 0.28, 0.08, -0.05, 0.012, -0.1);
    var cf = new T.Mesh(new T.CircleGeometry(0.022, 14), solid('#f6f2ea')); cf.position.set(-0.05, 0.25, -0.059); g.add(cf);
    var sp = new T.Mesh(new T.ConeGeometry(0.06, 0.1, 4), roof); sp.rotation.y = Math.PI / 4; sp.position.set(-0.05, 0.342, -0.1); g.add(sp);
    for (var p = 0; p < 4; p++) { var pin = new T.Mesh(new T.ConeGeometry(0.008, 0.03, 4), roof); pin.position.set(-0.08 + (p % 2) * 0.06, 0.307, -0.13 + Math.floor(p / 2) * 0.06); g.add(pin); }
    // the careenage harbour with colourful fishing boats, and a Barbados flag
    var hb = new T.Mesh(new T.PlaneGeometry(0.5, 0.08), solid('#2f8fb8')); hb.rotation.x = -Math.PI / 2; hb.position.set(0, 0.014, 0.12); g.add(hb);
    for (var b = 0; b < 5; b++) { var bt = new T.Group(); box(bt, solid(['#e84a4a', '#e8c34a', '#3f6ab0', '#4ab07a', '#f6f2ea'][b]), 0.05, 0.012, 0.016, 0, 0, 0); bt.position.set(-0.2 + b * 0.1, 0.014, 0.12); g.add(bt); }
    cyl(g, solid('#dddddd'), 0.003, 0.003, 0.12, 0.35, 0.012, -0.25, 4);
    box(g, solid('#00267f'), 0.016, 0.03, 0.003, 0.358, 0.1, -0.25); box(g, solid('#ffc726'), 0.016, 0.03, 0.003, 0.374, 0.1, -0.25); box(g, solid('#00267f'), 0.016, 0.03, 0.003, 0.39, 0.1, -0.25);
    for (var t = 0; t < 4; t++) palm(g, -0.45 + t * 0.1, 0.0, 1.1);
    return g;
  };
})();
