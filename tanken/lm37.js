/* Detailed landmarks, batch 37: Tongkonan of Tana Toraja, Pura Ulun Danu Beratan, Florence Cathedral, Manarola (Cinque Terre),
   Aqueduct of Segovia, Amber Fort, Delphi, Fort Jesus. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }

  /* ---------- Tongkonan houses, Tana Toraja ---------- */
  M.custom.toraja = function () {
    var g = new T.Group(), carved = mat(tex('tgk', 64, 32, function (c, W, H) { c.fillStyle = '#7a2a1a'; c.fillRect(0, 0, W, H); var cl = ['#1a1a1a', '#e8c34a', '#f2ece0']; for (var y = 0; y < H; y += 8) for (var x = 0; x < W; x += 8) { c.fillStyle = cl[(x / 8 + y / 8) % 3]; c.beginPath(); c.moveTo(x + 4, y); c.lineTo(x + 8, y + 4); c.lineTo(x + 4, y + 8); c.lineTo(x, y + 4); c.fill(); } }), 2, 1), thatch = solid('#3a3a30', { flatShading: true }), wood = solid('#5a3a20');
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // houses on stilts with huge saddle-shaped roofs that sweep up at both ends like boat prows
    function house(x, z, s) { var h = new T.Group();
      for (var p = 0; p < 6; p++) cyl(h, wood, 0.006, 0.006, 0.07, -0.06 + (p % 3) * 0.06, 0, (p < 3 ? -0.025 : 0.025), 5);
      box(h, carved, 0.16, 0.05, 0.07, 0, 0.07, 0);
      var pts = []; for (var i = 0; i <= 12; i++) { var t = i / 12 - 0.5; pts.push(new T.Vector2(t * 0.32, 0.12 + t * t * 0.45)); }
      var sh = new T.Shape(); sh.moveTo(pts[0].x, pts[0].y); pts.forEach(function (v) { sh.lineTo(v.x, v.y); }); for (var j = 12; j >= 0; j--) sh.lineTo(pts[j].x * 0.92, pts[j].y + 0.045 + Math.abs(pts[j].x) * 0.05);
      var rf = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false }), thatch); rf.position.z = -0.06; h.add(rf);
      var tip = new T.Mesh(new T.ShapeGeometry(sh), thatch);
      var hb = new T.Mesh(new T.ConeGeometry(0.012, 0.03, 4), solid('#f2ece0')); hb.position.set(0, 0.06, 0.04); h.add(hb);
      // a column of buffalo horns on the front post — a sign of status
      cyl(h, wood, 0.006, 0.006, 0.18, 0.18 * 0.9, 0, 0, 5); for (var k = 0; k < 4; k++) { var hn = new T.Mesh(new T.TorusGeometry(0.014, 0.003, 3, 8, Math.PI), solid('#e8dcc4')); hn.position.set(0.16, 0.05 + k * 0.025, 0); hn.rotation.y = Math.PI / 2; h.add(hn); }
      h.position.set(x, 0.006, z); h.scale.setScalar(s); g.add(h); }
    house(-0.22, -0.2, 1.1); house(0.15, -0.22, 1.1); house(-0.22, 0.16, 0.9); house(0.15, 0.16, 0.9);
    // rice terraces beyond
    for (var r = 0; r < 4; r++) { var tf = new T.Mesh(new T.RingGeometry(0.5 + r * 0.04, 0.535 + r * 0.04, 24, 1, Math.PI * 1.1, Math.PI * 0.8), solid(r % 2 ? '#7ab050' : '#9ac860')); tf.rotation.x = -Math.PI / 2; tf.position.y = 0.01 + r * 0.004; tf.scale.y = 0.8; g.add(tf); }
    return g;
  };

  /* ---------- Pura Ulun Danu Beratan ---------- */
  M.custom.ulundanu = function () {
    var g = new T.Group(), thatch = solid('#2a2a24', { flatShading: true }), st = solid('#8a8478', { flatShading: true });
    blob(g, '#4a8aa8', 0.74, 0.62, 0, 0, 0.006, 5); // Lake Beratan
    mountain(g, { h: 0.3, pos: [0, -0.48], rings: 10, r: function (t) { return 0.32 * (1 - t) + 0.02; }, sx: 1.3, sz: 0.4, bump: 0.25, colour: function (x, y) { return y > 0.2 ? '#4f7a4a' : '#3f7a3f'; } });
    // a temple seemingly floating on the lake: towers (meru) with stacked black thatched roofs
    function meru(x, z, tiers, s) { blob(g, '#8a9a7a', 0.07 * s, 0.07 * s, x, z, 0.012, 2); box(g, st, 0.07 * s, 0.03, 0.07 * s, x, 0.012, z); cyl(g, solid('#c9a070'), 0.012 * s, 0.012 * s, 0.03, x, 0.042, z, 6);
      for (var t = 0; t < tiers; t++) { var w = (0.11 - t * (0.08 / tiers)) * s, rf = new T.Mesh(new T.ConeGeometry(w * 0.72, 0.022 * s, 4), thatch); rf.rotation.y = Math.PI / 4; rf.position.set(x, 0.072 + t * 0.026 * s, z); g.add(rf); }
      var tp = new T.Mesh(new T.ConeGeometry(0.008 * s, 0.03 * s, 6), solid('#e8c34a')); tp.position.set(x, 0.072 + tiers * 0.026 * s + 0.01, z); g.add(tp); }
    meru(-0.02, 0.05, 11, 1.4); meru(0.22, 0.1, 3, 1.0);
    // the shore with a split gate (candi bentar), frangipani trees and boats
    blob(g, '#5f9a45', 0.5, 0.12, -0.15, 0.42, 0.012, 2);
    [-0.05, 0.05].forEach(function (x) { var hlf = new T.Mesh(new T.BoxGeometry(0.04, 0.12, 0.03), st); hlf.position.set(-0.15 + x, 0.072, 0.38); g.add(hlf); var tp = new T.Mesh(new T.ConeGeometry(0.025, 0.04, 4), st); tp.rotation.y = Math.PI / 4; tp.position.set(-0.15 + x, 0.152, 0.38); g.add(tp); });
    for (var f = 0; f < 4; f++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), solid('#3f8a3f', { flatShading: true })); tr.position.set(-0.45 + f * 0.1, 0.06, 0.42); g.add(tr); var fl = new T.Mesh(new T.SphereGeometry(0.006, 4, 3), solid('#f6f2ea')); fl.position.set(-0.44 + f * 0.1, 0.085, 0.43); g.add(fl); }
    var bt = new T.Group(); box(bt, solid('#e84a4a'), 0.02, 0.01, 0.06, 0, 0, 0); bt.position.set(0.35, 0.008, 0.35); g.add(bt);
    return g;
  };

  /* ---------- Florence Cathedral ---------- */
  M.custom.florence = function () {
    var g = new T.Group(), marble = mat(tex('flc', 32, 32, function (c, W, H) { c.fillStyle = '#f2ece0'; c.fillRect(0, 0, W, H); c.fillStyle = '#3f7a5a'; for (var x = 0; x < W; x += 8) c.fillRect(x, 0, 1.5, H); c.fillRect(0, 10, W, 1.5); c.fillRect(0, 22, W, 1.5); c.fillStyle = '#c9707a'; for (var x2 = 4; x2 < W; x2 += 8) c.fillRect(x2 - 1, 14, 2, 5); }), 2, 1), tile = solid('#c9603a', { flatShading: true });
    blob(g, '#d8d0c0', 0.74, 0.62, 0, 0, 0.006, 3);
    // the long striped marble nave
    box(g, marble, 0.14, 0.12, 0.42, 0, 0.006, 0.08); ridge(g, tile, 0.15, 0.04, 0.43, 0, 0.126, 0.08, Math.PI / 2);
    box(g, marble, 0.18, 0.18, 0.02, 0, 0.006, 0.29);
    // Brunelleschi's great red-brick dome with white ribs and the lantern
    var Z = -0.2;
    box(g, marble, 0.28, 0.12, 0.14, 0, 0.006, Z); cyl(g, marble, 0.11, 0.11, 0.06, 0, 0.126, Z, 8, Math.PI / 8);
    var dm = lathe([[0.1, 0], [0.098, 0.04], [0.088, 0.09], [0.068, 0.14], [0.04, 0.175], [0.015, 0.19]], 8, tile); dm.position.set(0, 0.186, Z); dm.rotation.y = Math.PI / 8; g.add(dm);
    for (var r = 0; r < 8; r++) { var a = r / 8 * D2 + Math.PI / 8, pts = []; for (var k = 0; k <= 6; k++) { var t = k / 6, rr = [0.1, 0.098, 0.088, 0.068, 0.04, 0.015][Math.min(5, Math.floor(t * 5))] * (1 - (t * 5 % 1) * 0) ; pts.push(new T.Vector3(Math.cos(a) * (0.1 - t * 0.085) * (t < 0.4 ? 1 : 1 - (t - 0.4) * 0.2), 0.186 + t * 0.19, Z + Math.sin(a) * (0.1 - t * 0.085))); } g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 6, 0.004, 3), solid('#f6f2ea'))); }
    cyl(g, solid('#f6f2ea'), 0.016, 0.018, 0.04, 0, 0.376, Z, 8); var bl = new T.Mesh(new T.SphereGeometry(0.008, 6, 4), solid('#d8b04a')); bl.position.set(0, 0.424, Z); g.add(bl);
    // Giotto's bell tower
    box(g, marble, 0.06, 0.34, 0.06, 0.15, 0.006, 0.24); box(g, solid('#f6f2ea'), 0.068, 0.01, 0.068, 0.15, 0.346, 0.24);
    // red rooftops of the city around
    for (var h = 0; h < 10; h++) { var a2 = h / 10 * D2, x = Math.cos(a2) * 0.5, z = Math.sin(a2) * 0.42; box(g, solid('#e8d8b8'), 0.08, 0.05, 0.07, x, 0.006, z); hip(g, tile, 0.085, 0.075, 0.03, x, 0.056, z); }
    return g;
  };

  /* ---------- Manarola, Cinque Terre ---------- */
  M.custom.cinqueterre = function () {
    var g = new T.Group(), cols = ['#f2c94a', '#e86a4a', '#f2a0a0', '#e8a04a', '#f6e8c8', '#c94a3a', '#a8c8e8'];
    blob(g, '#2f7fb0', 0.74, 0.62, 0, 0, 0.006, 6);
    // a steep rocky headland covered with tall, brightly painted houses, terraced vineyards above
    for (var L = 0; L < 5; L++) { var rw = 0.78 - L * 0.1; box(g, solid(L < 4 ? '#8a7a62' : '#6a9a45', { flatShading: true }), rw, 0.02 + L * 0.06, 0.12, 0, 0.006, 0.14 - L * 0.09); }
    box(g, solid('#6a9a45'), 0.38, 0.29, 0.2, 0, 0.006, -0.36);
    for (var h = 0; h < 22; h++) { var layer = Math.floor(h / 6), a = -0.3 + layer * 0.05 + (h % 6) * (0.11 - layer * 0.016), x = a + hash(h, 1) * 0.02, z = 0.13 - layer * 0.09, y = 0.026 + layer * 0.06, ht = 0.07 + hash(h, 2) * 0.04;
      box(g, mat(winTex('ct' + (h % 7), cols[h % 7], '#3f6a3a', 2, 3, { tall: 0.6 }), 1, 1), 0.08, ht, 0.06, x, y, z); hip(g, solid('#8a7a72'), 0.085, 0.065, 0.02, x, y + ht, z); }
    for (var v = 0; v < 12; v++) { var vn = new T.Mesh(new T.BoxGeometry(0.06, 0.012, 0.012), solid('#4f8a3a')); vn.position.set(-0.15 + (v % 6) * 0.06, 0.3, -0.3 - Math.floor(v / 6) * 0.06); g.add(vn); }
    // the tiny harbour with boats pulled up
    for (var b = 0; b < 4; b++) { var bt = new T.Group(); box(bt, solid(['#3f6ab0', '#e84a4a', '#4ab07a', '#f6f2ea'][b]), 0.02, 0.01, 0.05, 0, 0, 0); bt.position.set(0.25 + b * 0.04, 0.008, 0.3 + (b % 2) * 0.05); bt.rotation.y = 0.3; g.add(bt); }
    return g;
  };

  /* ---------- Aqueduct of Segovia ---------- */
  M.custom.segovia = function () {
    var g = new T.Group(), gran = mat(stoneTex('sgv', '#b8a888', '#9a8a6a', 4, 6), 1, 2);
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // two tiers of slender granite arches, built by the Romans without any mortar, striding across the square
    var N = 9, span = 0.1, x0 = -span * (N - 1) / 2;
    for (var i = 0; i < N; i++) { var x = x0 + i * span; box(g, gran, 0.03, 0.22, 0.04, x, 0.006, 0); if (i < N - 1) { var a = new T.Mesh(new T.TorusGeometry(0.035, 0.012, 4, 10, Math.PI), gran); a.position.set(x + span / 2, 0.19, 0); g.add(a); } }
    box(g, gran, span * (N - 1) + 0.04, 0.02, 0.045, 0, 0.226, 0);
    for (var j = 0; j < N * 2 - 1; j++) { var x2 = x0 + j * span / 2; box(g, gran, 0.018, 0.08, 0.03, x2, 0.246, 0); if (j < N * 2 - 2) { var a2 = new T.Mesh(new T.TorusGeometry(0.016, 0.008, 4, 8, Math.PI), gran); a2.position.set(x2 + span / 4, 0.312, 0); g.add(a2); } }
    box(g, gran, span * (N - 1) + 0.03, 0.03, 0.035, 0, 0.326, 0);
    // houses of the old town and the Alcázar in the distance
    for (var h = 0; h < 8; h++) { var x3 = -0.42 + h * 0.12, z = h % 2 ? 0.25 : -0.25; box(g, solid(['#e8d8b8', '#f2e8d4', '#d8c09a'][h % 3]), 0.09, 0.06, 0.07, x3, 0.006, z); hip(g, solid('#b8603a', { flatShading: true }), 0.095, 0.075, 0.03, x3, 0.066, z); }
    return g;
  };

  /* ---------- Amber Fort ---------- */
  M.custom.amberfort = function () {
    var g = new T.Group(), sand = mat(winTex('amb', '#e8c08a', '#8a5a3a', 8, 3, { tall: 0.5 }), 2, 1), st = solid('#d8a870'), w = solid('#f2e8d4');
    blob(g, '#a8a068', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.2, pos: [0, -0.2], rings: 10, r: function (t) { return 0.26 * (1 - t) + 0.18; }, sx: 1.25, bump: 0.2, colour: function () { return '#8a8a58'; } });
    // a honey-coloured palace fort on the hill, layered walls, pavilions with small domes (chhatris)
    var Y = 0.0, n0 = g.children.length;
    box(g, sand, 0.4, 0.1, 0.18, 0, Y, -0.22); box(g, sand, 0.26, 0.06, 0.12, 0, Y + 0.1, -0.22);
    [[-0.17, -0.15], [0.17, -0.15], [-0.1, -0.28], [0.1, -0.28]].forEach(function (q) { for (var c = 0; c < 4; c++) cyl(g, w, 0.003, 0.003, 0.03, q[0] + (c % 2 ? 0.012 : -0.012), Y + 0.1 + (q[1] < -0.2 ? 0.06 : 0), q[1] + (c < 2 ? 0.012 : -0.012), 4); domeOn(g, w, 0.018, 0.022, q[0], Y + 0.13 + (q[1] < -0.2 ? 0.06 : 0), q[1], 8); });
    var C = new T.Group(); g.children.slice(n0).forEach(function (o) { g.remove(o); o.position.z += 0.22; C.add(o); }); C.scale.setScalar(1.45); C.position.set(0, 0.19, -0.2); g.add(C);
    // the zig-zag ramp, the lake below and a decorated elephant carrying visitors
    var pts = []; for (var i = 0; i <= 20; i++) { var t = i / 20; pts.push(new T.Vector3(Math.sin(t * 9) * 0.2, 0.012 + t * 0.19, 0.3 - t * 0.38)); }
    g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, 0.01, 3), st));
    var lk = new T.Mesh(new T.CircleGeometry(0.16, 16), solid('#5a8a9a')); lk.rotation.x = -Math.PI / 2; lk.scale.y = 0.5; lk.position.set(0.25, 0.01, 0.4); g.add(lk);
    var el = new T.Group(), grey = solid('#8a8480'); var bd = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), grey); bd.scale.set(1, 0.9, 1.4); bd.position.y = 0.06; el.add(bd); [[0.02, 0.03], [-0.02, 0.03], [0.02, -0.03], [-0.02, -0.03]].forEach(function (q) { cyl(el, grey, 0.009, 0.009, 0.04, q[0], 0, q[1], 6); }); var hd = new T.Mesh(new T.SphereGeometry(0.022, 8, 6), grey); hd.position.set(0, 0.07, 0.05); el.add(hd); var tr = new T.Mesh(new T.CylinderGeometry(0.004, 0.007, 0.05, 5), grey); tr.position.set(0, 0.04, 0.07); el.add(tr); box(el, solid('#d03a6a'), 0.05, 0.02, 0.05, 0, 0.088, 0); box(el, solid('#e8c34a'), 0.04, 0.008, 0.04, 0, 0.108, 0);
    el.position.set(-0.25, 0.006, 0.3); el.rotation.y = 0.5; el.scale.setScalar(1.3); g.add(el);
    return g;
  };

  /* ---------- Delphi ---------- */
  M.custom.delphi = function () {
    var g = new T.Group(), mar = solid('#e8e0d0'), st = mat(stoneTex('dlp', '#d8ccb0', '#bcb090', 6, 4), 1, 1);
    blob(g, '#8a9a5a', 0.74, 0.62, 0, 0, 0.006, 3);
    // the slopes of Mount Parnassus behind
    mountain(g, { h: 0.36, pos: [0, -0.5], rings: 10, r: function (t) { return 0.34 * (1 - t) + 0.02; }, sx: 1.6, sz: 0.4, bump: 0.3, jag: 0.25, colour: function (x, y) { return y > 0.22 ? '#a8a090' : '#7a8a52'; } });
    // the round Tholos with three standing Doric columns, the Temple of Apollo's platform, and the theatre above
    cyl(g, st, 0.13, 0.14, 0.03, -0.2, 0.006, 0.2, 20);
    for (var c = 0; c < 3; c++) { var a = Math.PI * 0.6 + c * 0.35; cyl(g, mar, 0.012, 0.013, 0.16, -0.2 + Math.cos(a) * 0.1, 0.036, 0.2 + Math.sin(a) * 0.1, 10); }
    var ent = new T.Mesh(new T.TorusGeometry(0.1, 0.012, 4, 10, 1.0), mar); ent.rotation.x = Math.PI / 2; ent.rotation.z = Math.PI * 0.55; ent.position.set(-0.2, 0.2, 0.2); g.add(ent);
    box(g, st, 0.26, 0.04, 0.12, 0.15, 0.006, -0.08);
    for (var k = 0; k < 6; k++) cyl(g, mar, 0.01, 0.011, 0.04 + hash(k, 2) * 0.1, 0.04 + k * 0.045, 0.046, -0.03, 8);
    for (var r = 0; r < 5; r++) { var ring = new T.Mesh(new T.CylinderGeometry(0.06 + r * 0.02, 0.06 + r * 0.02, 0.012, 16, 1, false, 0, Math.PI), st); ring.position.set(0.15, 0.06 + r * 0.012, -0.28); ring.rotation.y = Math.PI / 2 + Math.PI / 2; g.add(ring); }
    for (var t = 0; t < 6; t++) { var o = new T.Mesh(new T.SphereGeometry(0.025, 6, 4), solid('#6a8a4a', { flatShading: true })); o.position.set(-0.45 + t * 0.18, 0.03, 0.4); g.add(o); }
    return g;
  };

  /* ---------- Fort Jesus, Mombasa ---------- */
  M.custom.fortjesus = function () {
    var g = new T.Group(), coral = mat(stoneTex('fjs', '#d8c49a', '#c0a87a', 8, 4), 2, 1);
    blob(g, '#2f9fc8', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#c9b890', 0.5, 0.4, -0.05, -0.08, 0.012, 3);
    // a Portuguese fort shaped like a man lying down, with arrow-shaped bastions on the corners
    var sh = new T.Shape(); var P = [[-0.22, -0.14], [-0.08, -0.14], [-0.05, -0.22], [0.05, -0.22], [0.08, -0.14], [0.2, -0.14], [0.28, -0.04], [0.2, 0.06], [0.2, 0.14], [0.08, 0.14], [0.04, 0.22], [-0.04, 0.22], [-0.08, 0.14], [-0.22, 0.14], [-0.3, 0.04], [-0.22, -0.04]];
    sh.moveTo(P[0][0], P[0][1]); P.forEach(function (p) { sh.lineTo(p[0], p[1]); }); sh.lineTo(P[0][0], P[0][1]);
    var hole = new T.Path(); hole.moveTo(-0.16, -0.08); hole.lineTo(0.14, -0.08); hole.lineTo(0.14, 0.08); hole.lineTo(-0.16, 0.08); hole.lineTo(-0.16, -0.08); sh.holes.push(hole);
    var walls = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.1, bevelEnabled: false }), coral); walls.rotation.x = -Math.PI / 2; walls.position.set(-0.05, 0.012, -0.08); g.add(walls);
    var yard = new T.Mesh(new T.PlaneGeometry(0.3, 0.16), solid('#c9b890')); yard.rotation.x = -Math.PI / 2; yard.position.set(-0.06, 0.014, -0.08); g.add(yard);
    for (var c = 0; c < 4; c++) { var cn = new T.Mesh(new T.CylinderGeometry(0.005, 0.007, 0.04, 6), solid('#2a2a2a')); cn.rotation.z = Math.PI / 2; cn.position.set(0.25, 0.1, -0.12 + c * 0.03); g.add(cn); }
    box(g, solid('#f2e8d4'), 0.06, 0.04, 0.05, -0.1, 0.014, -0.1);
    // a dhow, baobab and palms
    var b = new T.Group(); box(b, solid('#8a5a32'), 0.025, 0.014, 0.09, 0, 0, 0); var ss = new T.Shape(); ss.moveTo(0, 0); ss.lineTo(0, 0.09); ss.lineTo(0.07, 0); var s = new T.Mesh(new T.ShapeGeometry(ss), solid('#f6f2ea', { side: T.DoubleSide })); s.rotation.y = Math.PI / 2; s.position.set(0, 0.014, 0.035); b.add(s); b.position.set(0.4, 0.008, 0.35); g.add(b);
    var bb = new T.Group(); cyl(bb, solid('#8a7a6a'), 0.03, 0.04, 0.12, 0, 0, 0, 8); for (var br = 0; br < 5; br++) { var bx = new T.Mesh(new T.CylinderGeometry(0.004, 0.006, 0.05, 4), solid('#8a7a6a')); bx.position.set(Math.cos(br * 1.26) * 0.02, 0.14, Math.sin(br * 1.26) * 0.02); bx.rotation.set(Math.sin(br * 1.26) * 0.5, 0, -Math.cos(br * 1.26) * 0.5); bb.add(bx); } bb.position.set(-0.4, 0.012, 0.2); g.add(bb);
    for (var p = 0; p < 4; p++) palm(g, 0.25 + p * 0.06, -0.38 + (p % 2) * 0.04, 1.0);
    return g;
  };
})();
