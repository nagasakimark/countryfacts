/* Detailed landmarks, batch 36: Lençóis Maranhenses, Pelourinho, Cathedral of Brasília, Koutoubia Mosque,
   Palace of Knossos, Nasir al-Mulk Mosque, Fujian Tulou, Fort Santiago (Intramuros). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }

  /* ---------- Lençóis Maranhenses ---------- */
  M.custom.lencois = function () {
    var g = new T.Group(), sand = solid('#f6f2e8', { flatShading: true });
    blob(g, '#f2ece0', 0.74, 0.62, 0, 0, 0.006, 3);
    // rolling white dunes like bedsheets, with blue and green rain-water lagoons between them
    for (var i = 0; i < 9; i++) { var x = -0.45 + (i % 3) * 0.42 + hash(i, 1) * 0.08, z = -0.35 + Math.floor(i / 3) * 0.33 + hash(i, 2) * 0.06; var d = new T.Mesh(new T.SphereGeometry(0.16, 14, 8, 0, D2, 0, Math.PI / 2), sand); d.scale.set(1.2, 0.35 + hash(i, 3) * 0.15, 0.7); d.rotation.y = hash(i, 4) * 0.8; d.position.set(x, 0.006, z); g.add(d); }
    [[-0.22, -0.18, '#2fa8d0'], [0.2, -0.16, '#3fc0b0'], [0.0, 0.14, '#2f90c8'], [-0.36, 0.18, '#4ac8b8'], [0.36, 0.2, '#2fa8d0']].forEach(function (l, k) { var lk = new T.Mesh(new T.CircleGeometry(0.08 + hash(k, 5) * 0.03, 16), solid(l[2])); lk.rotation.x = -Math.PI / 2; lk.scale.y = 0.6; lk.position.set(l[0], 0.009, l[1]); g.add(lk); });
    // a few swimmers
    for (var p = 0; p < 3; p++) { var h = new T.Mesh(new T.SphereGeometry(0.006, 5, 4), solid('#a86a4a')); h.position.set(-0.02 + p * 0.025, 0.012, 0.14); g.add(h); }
    return g;
  };

  /* ---------- Pelourinho, Salvador ---------- */
  M.custom.pelourinho = function () {
    var g = new T.Group(), cols = ['#f2c94a', '#4ab0e8', '#e86a8a', '#6ac87a', '#f2a04a', '#a87ae8', '#f6f2ea'];
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a sloping cobbled square lined with pastel-painted colonial houses
    mountain(g, { h: 0.08, pos: [0, -0.26], r: function (t) { return 0.3 * (1 - t) + 0.2; }, sx: 1.2, sz: 0.6, bump: 0.05, colour: function () { return '#a89a88'; } });
    for (var r = 0; r < 2; r++) for (var h = 0; h < 7; h++) { var x = -0.36 + h * 0.12, z = r ? 0.22 : -0.22, y = r ? 0.006 : 0.05; box(g, mat(winTex('pel' + ((h + r) % 7), cols[(h + r * 3) % 7], '#f6f2ea', 2, 2, { tall: 0.7 }), 1, 1), 0.11, 0.1 + hash(h, r) * 0.03, 0.08, x, y, z); ridge(g, solid('#b8603a', { flatShading: true }), 0.115, 0.03, 0.085, x, y + 0.1 + hash(h, r) * 0.03, z, 0); }
    // the blue church at the top of the square
    box(g, mat(winTex('pelc', '#4a8ac8', '#f6f2ea', 3, 2, { tall: 0.7 }), 1, 1), 0.14, 0.14, 0.08, 0.0, 0.05, -0.38);
    [-0.05, 0.05].forEach(function (x) { box(g, solid('#4a8ac8'), 0.04, 0.2, 0.04, x, 0.05, -0.36); var sp = new T.Mesh(new T.ConeGeometry(0.025, 0.05, 4), solid('#f6f2ea')); sp.rotation.y = Math.PI / 4; sp.position.set(x, 0.275, -0.36); g.add(sp); });
    // capoeira players and drummers
    for (var p = 0; p < 4; p++) { var c = new T.Mesh(new T.CapsuleGeometry(0.008, 0.024, 3, 6), solid(['#f6f2ea', '#e8c34a', '#f6f2ea', '#3f8a3f'][p])); c.position.set(-0.06 + p * 0.04, 0.06, 0.0); c.rotation.z = p % 2 ? 0.6 : -0.3; g.add(c); }
    return g;
  };

  /* ---------- Cathedral of Brasília ---------- */
  M.custom.brasilia = function () {
    var g = new T.Group(), conc = solid('#f2f0ea'), glass = solid('#5a9ac8', { transparent: true, opacity: 0.7 });
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    var pool = new T.Mesh(new T.RingGeometry(0.2, 0.3, 32), solid('#4a9ac8')); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.009; g.add(pool);
    // sixteen curved concrete columns rising like hands joined in prayer, glass between
    var N = 16;
    for (var i = 0; i < N; i++) { var a = i / N * D2, pts = []; for (var k = 0; k <= 10; k++) { var t = k / 10, r = 0.17 * (1 - t) + 0.035 + Math.sin(t * Math.PI) * 0.04 * (t < 0.7 ? 1 : 0) + (t > 0.85 ? (t - 0.85) * 0.5 : 0); pts.push(new T.Vector3(Math.cos(a) * r, 0.006 + t * 0.32, Math.sin(a) * r)); }
      g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 10, 0.01, 4), conc)); }
    var gl = lathe([[0.17, 0], [0.16, 0.06], [0.12, 0.14], [0.08, 0.22], [0.05, 0.27], [0.035, 0.29]], 16, glass); gl.position.y = 0.006; g.add(gl);
    var cr = new T.Group(); box(cr, conc, 0.004, 0.05, 0.004, 0, 0, 0); box(cr, conc, 0.02, 0.004, 0.004, 0, 0.034, 0); cr.position.y = 0.34; g.add(cr);
    // the separate bell tower and four bronze apostles at the entrance
    cyl(g, conc, 0.004, 0.004, 0.18, 0.3, 0.006, -0.1, 4); box(g, conc, 0.05, 0.008, 0.02, 0.3, 0.18, -0.1);
    for (var s = 0; s < 4; s++) { var st = new T.Mesh(new T.CapsuleGeometry(0.008, 0.035, 3, 6), solid('#6a5a4a')); st.position.set(-0.06 + s * 0.04, 0.03, 0.34); g.add(st); }
    return g;
  };

  /* ---------- Koutoubia Mosque ---------- */
  M.custom.koutoubia = function () {
    var g = new T.Group(), st = mat(stoneTex('ktb', '#c9885a', '#b8784a', 6, 12), 1, 3), tile = solid('#3f8a6a'), gold = solid('#e8c34a', { emissive: '#3a2a00' });
    blob(g, '#c9a878', 0.74, 0.62, 0, 0, 0.006, 3);
    // the great square minaret of Marrakesh, with carved arch panels and a band of green tiles
    var Y = 0.006, X = 0.12, Z = -0.08;
    box(g, st, 0.12, 0.44, 0.12, X, Y, Z);
    for (var s = 0; s < 4; s++) { var a = s * Math.PI / 2; for (var r = 0; r < 3; r++) { var p = new T.Mesh(new T.PlaneGeometry(0.06, 0.06), solid('#8a5a3a')); p.position.set(X + Math.sin(a) * 0.0605, Y + 0.12 + r * 0.1, Z + Math.cos(a) * 0.0605); p.rotation.y = a; g.add(p); } }
    var band = new T.Mesh(new T.BoxGeometry(0.122, 0.02, 0.122), tile); band.position.set(X, Y + 0.42, Z); g.add(band);
    for (var c = 0; c < 4; c++) for (var k = 0; k < 4; k++) box(g, st, 0.018, 0.02, 0.018, X - 0.045 + k * 0.03, Y + 0.44, Z + (c < 2 ? -0.05 : 0.05) * (c % 2 ? 1 : 1));
    box(g, st, 0.05, 0.08, 0.05, X, Y + 0.44, Z); var dm = new T.Mesh(new T.SphereGeometry(0.02, 8, 6, 0, D2, 0, Math.PI / 2), tile); dm.position.set(X, Y + 0.52, Z); g.add(dm);
    for (var b = 0; b < 3; b++) { var ball = new T.Mesh(new T.SphereGeometry(0.01 - b * 0.002, 8, 6), gold); ball.position.set(X, Y + 0.55 + b * 0.02, Z); g.add(ball); }
    // the low prayer hall and rose gardens with palms
    box(g, st, 0.3, 0.06, 0.2, -0.12, Y, -0.05); for (var rf = 0; rf < 5; rf++) ridge(g, tile, 0.05, 0.025, 0.2, -0.24 + rf * 0.06, Y + 0.06, -0.05, 0);
    for (var t = 0; t < 8; t++) palm(g, -0.45 + t * 0.13, 0.3 + (t % 2) * 0.08, 1.2);
    for (var ro = 0; ro < 10; ro++) { var rs = new T.Mesh(new T.SphereGeometry(0.012, 6, 4), solid(ro % 2 ? '#e84a6a' : '#3f8a3f')); rs.position.set(-0.4 + ro * 0.09, 0.016, 0.18); g.add(rs); }
    return g;
  };

  /* ---------- Palace of Knossos ---------- */
  M.custom.knossos = function () {
    var g = new T.Group(), st = mat(stoneTex('kns', '#e0d0b0', '#c8b890', 8, 4), 2, 1), red = solid('#b8302a'), black = solid('#2a2420');
    blob(g, '#a8a868', 0.74, 0.62, 0, 0, 0.006, 3);
    // Minoan ruins: low stone walls of many rooms, and a rebuilt portico with red columns that get thinner toward the bottom
    var rooms = [[-0.3, -0.2, 0.16, 0.12], [-0.12, -0.24, 0.14, 0.1], [0.08, -0.22, 0.16, 0.12], [0.28, -0.18, 0.12, 0.14], [-0.3, 0.12, 0.14, 0.14], [0.3, 0.14, 0.14, 0.12]];
    rooms.forEach(function (r, k) { [[0, -r[3] / 2, r[2], 0.012], [0, r[3] / 2, r[2], 0.012], [-r[2] / 2, 0, 0.012, r[3]], [r[2] / 2, 0, 0.012, r[3]]].forEach(function (w) { box(g, st, w[2], 0.03 + hash(k, w[0] * 10) * 0.03, w[3], r[0] + w[0], 0.006, r[1] + w[1]); }); });
    var court = new T.Mesh(new T.PlaneGeometry(0.36, 0.2), solid('#e0d4b8')); court.rotation.x = -Math.PI / 2; court.position.set(0, 0.008, 0.0); g.add(court);
    // the North Entrance portico with the charging-bull fresco
    var Y = 0.006, X = 0.0, Z = 0.2;
    box(g, st, 0.24, 0.06, 0.1, X, Y, Z);
    for (var c = 0; c < 4; c++) { var col = new T.Mesh(new T.CylinderGeometry(0.012, 0.008, 0.1, 10), red); col.position.set(X - 0.08 + c * 0.053, Y + 0.11, Z + 0.03); g.add(col); var cap = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, 0.012, 10), black); cap.position.set(X - 0.08 + c * 0.053, Y + 0.166, Z + 0.03); g.add(cap); }
    box(g, st, 0.26, 0.03, 0.1, X, Y + 0.172, Z); box(g, red, 0.262, 0.01, 0.102, X, Y + 0.195, Z);
    var fr = new T.Mesh(new T.PlaneGeometry(0.1, 0.05), mat(tex('bull', 64, 32, function (c, W, H) { c.fillStyle = '#7ab0c8'; c.fillRect(0, 0, W, H); c.fillStyle = '#e8d8b8'; c.beginPath(); c.ellipse(32, 18, 18, 8, 0, 0, D2); c.fill(); c.fillRect(16, 22, 3, 8); c.fillRect(44, 22, 3, 8); c.beginPath(); c.arc(50, 12, 5, 0, D2); c.fill(); c.strokeStyle = '#e8d8b8'; c.lineWidth = 2; c.beginPath(); c.moveTo(52, 8); c.lineTo(58, 2); c.stroke(); }), 1, 1)); fr.position.set(X, Y + 0.13, Z - 0.051); fr.rotation.y = Math.PI; g.add(fr);
    // horns of consecration and cypress trees
    var horns = new T.Mesh(new T.TorusGeometry(0.025, 0.007, 4, 10, Math.PI), st); horns.position.set(-0.3, 0.06, 0.25); g.add(horns);
    for (var t = 0; t < 6; t++) { var cp = new T.Mesh(new T.ConeGeometry(0.018, 0.12, 6), solid('#2f5a2f')); cp.position.set(-0.45 + t * 0.18, 0.066, -0.42); g.add(cp); }
    return g;
  };

  /* ---------- Nasir al-Mulk Mosque (the Pink Mosque) ---------- */
  M.custom.nasirmulk = function () {
    var g = new T.Group(), pink = mat(tex('nam', 64, 64, function (c, W, H) { c.fillStyle = '#e8a0a8'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 16) for (var x = 0; x < W; x += 16) { c.fillStyle = '#f6e8c8'; c.beginPath(); c.arc(x + 8, y + 8, 5, 0, D2); c.fill(); c.fillStyle = '#3a6ab0'; c.beginPath(); c.arc(x + 8, y + 8, 2.5, 0, D2); c.fill(); c.fillStyle = '#4ab07a'; c.fillRect(x, y + 7, 3, 2); c.fillRect(x + 13, y + 7, 3, 2); } }), 2, 1), st = solid('#d8c8a8');
    blob(g, '#c9c0b0', 0.74, 0.62, 0, 0, 0.006, 3);
    // a courtyard with a pool, rose-tiled walls and an iwan
    var pool = new T.Mesh(new T.PlaneGeometry(0.12, 0.3), solid('#5aa8c8')); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.009, 0.05); g.add(pool);
    box(g, pink, 0.5, 0.14, 0.04, 0, 0.006, -0.2);
    var iw = new T.Shape(); iw.moveTo(-0.05, 0); iw.lineTo(-0.05, 0.08); iw.quadraticCurveTo(-0.05, 0.12, 0, 0.14); iw.quadraticCurveTo(0.05, 0.12, 0.05, 0.08); iw.lineTo(0.05, 0); iw.lineTo(-0.05, 0); var iwm = new T.Mesh(new T.ShapeGeometry(iw), solid('#3a2a40')); iwm.position.set(0, 0.006, -0.179); g.add(iwm);
    [-0.25, 0.25].forEach(function (x) { box(g, st, 0.04, 0.12, 0.4, x, 0.006, 0.0); for (var a = 0; a < 5; a++) arch(g, solid('#8a6a5a'), 0.04, 0.05, x + (x > 0 ? -0.021 : 0.021), 0.006, -0.15 + a * 0.075, 0.002); });
    // the famous rainbow of light through coloured windows, shown as coloured patches on the floor
    var wcols = ['#e84a4a', '#e8c34a', '#4ae88a', '#4ab0e8', '#a84ae8'];
    for (var w = 0; w < 5; w++) { var win = new T.Mesh(new T.PlaneGeometry(0.035, 0.08), solid(wcols[w], { emissive: wcols[w], transparent: true, opacity: 0.8 })); win.position.set(-0.17 + w * 0.085, 0.07, -0.178); g.add(win); var pt = new T.Mesh(new T.PlaneGeometry(0.05, 0.12), solid(wcols[w], { transparent: true, opacity: 0.45 })); pt.rotation.x = -Math.PI / 2; pt.position.set(-0.17 + w * 0.085, 0.0095, -0.08); g.add(pt); }
    for (var o = 0; o < 4; o++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), solid('#3f7a35', { flatShading: true })); tr.position.set(o < 2 ? -0.14 : 0.14, 0.05, 0.12 + (o % 2) * 0.12); g.add(tr); cyl(g, solid('#6a4a2a'), 0.004, 0.005, 0.03, o < 2 ? -0.14 : 0.14, 0.006, 0.12 + (o % 2) * 0.12, 4); }
    return g;
  };

  /* ---------- Fujian Tulou ---------- */
  M.custom.tulou = function () {
    var g = new T.Group(), earth = mat(tex('tlo', 64, 32, function (c, W, H) { c.fillStyle = '#d8b888'; c.fillRect(0, 0, W, H); c.fillStyle = '#3a2a1a'; for (var x = 4; x < W; x += 10) { c.fillRect(x, 18, 3, 4); c.fillRect(x + 5, 10, 2, 3); } }), 6, 1), tile = solid('#5a5450', { flatShading: true }), wood = solid('#8a5a32');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // giant round earthen houses where a whole clan lives together; tiled roofs and an open courtyard
    function tulou(x, z, r, h) { var wall = new T.Mesh(new T.CylinderGeometry(r, r, h, 28, 1, true), earth); wall.position.set(x, 0.006 + h / 2, z); g.add(wall);
      var inner = new T.Mesh(new T.CylinderGeometry(r * 0.62, r * 0.62, h, 24, 1, true), solid('#8a5a32', { side: T.DoubleSide })); inner.position.set(x, 0.006 + h / 2, z); g.add(inner);
      var roof = new T.Mesh(new T.RingGeometry(r * 0.58, r + 0.02, 28), tile); roof.rotation.x = -Math.PI / 2; roof.position.set(x, 0.006 + h + 0.004, z); g.add(roof);
      var rf2 = new T.Mesh(new T.CylinderGeometry(r * 0.6, r + 0.02, 0.025, 28, 1, true), tile); rf2.position.set(x, 0.006 + h + 0.012, z); g.add(rf2);
      var yard = new T.Mesh(new T.CircleGeometry(r * 0.6, 20), solid('#c9b890')); yard.rotation.x = -Math.PI / 2; yard.position.set(x, 0.008, z); g.add(yard);
      box(g, wood, r * 0.3, r * 0.25, r * 0.25, x, 0.006, z); }
    tulou(-0.15, -0.08, 0.2, 0.12); tulou(0.25, 0.12, 0.13, 0.09);
    var sq = new T.Mesh(new T.BoxGeometry(0.18, 0.08, 0.18), earth); sq.position.set(0.28, 0.046, -0.25); g.add(sq); hip(g, tile, 0.2, 0.2, 0.04, 0.28, 0.086, -0.25, 0.6);
    // terraced tea fields and bamboo
    for (var r2 = 0; r2 < 3; r2++) { var tf = new T.Mesh(new T.RingGeometry(0.5 + r2 * 0.05, 0.54 + r2 * 0.05, 24, 1, Math.PI * 0.55, Math.PI * 0.9), solid(r2 % 2 ? '#5f9a45' : '#7ab050')); tf.rotation.x = -Math.PI / 2; tf.position.y = 0.01; tf.scale.y = 0.8; g.add(tf); }
    for (var b = 0; b < 8; b++) cyl(g, solid('#7aa84a'), 0.004, 0.004, 0.12, -0.45 + b * 0.04, 0.006, 0.35 + (b % 2) * 0.03, 4);
    return g;
  };

  /* ---------- Fort Santiago, Intramuros ---------- */
  M.custom.intramuros = function () {
    var g = new T.Group(), st = mat(stoneTex('fsi', '#a89a80', '#8a7e66', 10, 3), 3, 1), w = solid('#e8dcc4');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    var rv = new T.Mesh(new T.PlaneGeometry(1.0, 0.14), solid('#5a7a7a')); rv.rotation.x = -Math.PI / 2; rv.position.set(0, 0.009, -0.42); rv.scale.x = 0.66; g.add(rv);
    // thick old Spanish walls with the ornate gate and its carving of St. James on horseback
    box(g, st, 0.6, 0.1, 0.06, 0, 0.006, -0.25); box(g, st, 0.06, 0.1, 0.4, -0.3, 0.006, -0.05); box(g, st, 0.06, 0.1, 0.4, 0.3, 0.006, -0.05);
    for (var i = 0; i < 10; i++) box(g, st, 0.03, 0.025, 0.065, -0.27 + i * 0.06, 0.106, -0.25);
    box(g, w, 0.16, 0.18, 0.05, 0, 0.006, 0.14); arch(g, solid('#2a2420'), 0.05, 0.08, 0, 0.006, 0.166, 0.002);
    var ped = new T.Mesh(new T.CircleGeometry(0.06, 14, 0, Math.PI), w); ped.position.set(0, 0.186, 0.14); g.add(ped);
    var relief = new T.Mesh(new T.CircleGeometry(0.025, 10), solid('#8a7a5a')); relief.position.set(0, 0.14, 0.166); g.add(relief);
    // a horse-drawn calesa and acacia shade trees
    var cl = new T.Group(); box(cl, solid('#3a2a1a'), 0.012, 0.016, 0.03, 0, 0.008, 0.03); box(cl, solid('#c9a050'), 0.03, 0.025, 0.04, 0, 0.012, -0.01); cl.position.set(0.15, 0.006, 0.3); g.add(cl);
    for (var t = 0; t < 6; t++) { var c = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), solid('#3f8a3f', { flatShading: true })); c.scale.y = 0.6; c.position.set(-0.42 + t * 0.17, 0.1, 0.4); g.add(c); cyl(g, solid('#6a4a2a'), 0.008, 0.01, 0.08, -0.42 + t * 0.17, 0.006, 0.4, 5); }
    return g;
  };
})();
