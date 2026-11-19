/* Detailed landmarks, batch 18: Baalbek, El Jem, Murchison Falls, Khor Virap & Ararat, Flame Towers,
   Omar Ali Saifuddien Mosque, PNG Parliament House, South Pole station. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 14, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function jungle(g, n, r0, r1, seed, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }

  /* ---------- Baalbek ---------- */
  M.custom.baalbek = function () {
    var g = new T.Group(), st = mat(stoneTex('bbst', '#d8c4a0', '#b8a480', 8, 4), 4, 1), col = solid('#e2cfa8'), colD = solid('#c9b48e');
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, st, 0.9, 0.08, 0.5, 0, 0.006, -0.05);
    // six great columns of the Temple of Jupiter with their entablature
    for (var i = 0; i < 6; i++) { var x = -0.25 + i * 0.1; cyl(g, colD, 0.026, 0.026, 0.02, x, 0.086, -0.2, 10); cyl(g, col, 0.02, 0.022, 0.42, x, 0.106, -0.2, 12); box(g, colD, 0.05, 0.03, 0.05, x, 0.526, -0.2); }
    box(g, col, 0.58, 0.06, 0.06, 0, 0.556, -0.2); box(g, colD, 0.6, 0.015, 0.07, 0, 0.616, -0.2);
    // the well-preserved Temple of Bacchus
    var B = new T.Group(); box(B, st, 0.3, 0.2, 0.18, 0, 0, 0); for (var k = 0; k < 7; k++) { cyl(B, col, 0.01, 0.011, 0.2, -0.14 + k * 0.0467, 0, 0.1, 8); cyl(B, col, 0.01, 0.011, 0.2, -0.14 + k * 0.0467, 0, -0.1, 8); } box(B, colD, 0.32, 0.03, 0.22, 0, 0.2, 0); prism(B, col, 0.32, 0.05, 0.22, 0, 0.23, 0);
    B.rotation.y = Math.PI / 2; B.position.set(0.25, 0.086, 0.1); g.add(B);
    // fallen column drums
    [[-0.3, 0.15], [-0.2, 0.2], [-0.35, 0.05]].forEach(function (q, j) { var d = new T.Mesh(new T.CylinderGeometry(0.022, 0.022, 0.05, 10), colD); d.rotation.z = Math.PI / 2; d.rotation.y = j; d.position.set(q[0], 0.108, q[1]); g.add(d); });
    return g;
  };

  /* ---------- Amphitheatre of El Jem ---------- */
  M.custom.eljem = function () {
    var g = new T.Group(), st = mat(tex('ejst', 64, 32, function (c, W, H) { c.fillStyle = '#d8b888'; c.fillRect(0, 0, W, H); c.fillStyle = '#5a4030'; for (var r = 0; r < 3; r++) for (var x = 2; x < W; x += 8) { c.fillRect(x, 3 + r * 10, 4, 6); c.beginPath(); c.arc(x + 2, 3 + r * 10, 2, Math.PI, 0); c.fill(); } }), 12, 1);
    blob(g, '#d8c39a', 0.74, 0.62, 0, 0, 0.006, 4);
    var outer = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.22, 36, 1, true, 0.6, D2 - 1.0), st); outer.material.side = T.DoubleSide; outer.scale.z = 0.8; outer.position.y = 0.116; g.add(outer);
    // the broken side, lower
    var low = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.1, 10, 1, true, 0.6 - 1.0 + D2, 1.0), st); low.material.side = T.DoubleSide; low.scale.z = 0.8; low.position.y = 0.056; g.add(low);
    // seating tiers inside and the arena floor
    var seats = lathe([[0.18, 0], [0.36, 0.17], [0.38, 0.17], [0.38, 0], [0.18, 0]], 36, solid('#c9a878', { side: T.DoubleSide })); seats.scale.z = 0.8; seats.position.y = 0.006; g.add(seats);
    var floor = new T.Mesh(new T.CircleGeometry(0.18, 24), solid('#e8d4a8')); floor.rotation.x = -Math.PI / 2; floor.scale.y = 0.8; floor.position.y = 0.012; g.add(floor);
    for (var h = 0; h < 6; h++) { var a = h / 6 * D2 + 0.3; box(g, solid('#efe6d4'), 0.06, 0.05, 0.05, Math.cos(a) * 0.62, 0.006, Math.sin(a) * 0.5); }
    [[-0.6, 0.4], [0.6, 0.4], [0.62, -0.35]].forEach(function (q) { palm(g, q[0], q[1], 1.2); });
    return g;
  };

  /* ---------- Murchison Falls ---------- */
  M.custom.murchison = function () {
    var g = new T.Group(), rock = solid('#6a5a4a', { flatShading: true });
    blob(g, '#4f8a3a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a high rocky gorge with the Nile squeezed through a slot
    [-1, 1].forEach(function (s) { mountain(g, { h: 0.3, pos: [s * 0.24, -0.15], rings: 8, r: function (t) { return 0.2 * (1 - t * 0.4); }, bump: 0.3, sz: 1.5, seed: s + 3, colour: function (x, y) { return y > 0.26 ? '#4f8a3a' : noise(x * 14, y * 14) > 0.5 ? '#5a4a3a' : '#6f5f4e'; } }); });
    var up = new T.Mesh(new T.PlaneGeometry(0.06, 0.4), solid('#8aa8b8')); up.rotation.x = -Math.PI / 2; up.position.set(0, 0.28, -0.3); g.add(up);
    var fall = new T.Mesh(new T.PlaneGeometry(0.05, 0.3), solid('#f2faff', { side: T.DoubleSide })); fall.position.set(0, 0.15, -0.1); fall.rotation.x = -0.15; g.add(fall);
    for (var k = 0; k < 6; k++) { var sp = new T.Mesh(new T.SphereGeometry(0.04 + k * 0.008, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.6 })); sp.position.set((hash(k, 1) - 0.5) * 0.1, 0.03 + k * 0.03, -0.05 + hash(k, 2) * 0.08); g.add(sp); }
    var river = new T.Mesh(new T.PlaneGeometry(0.24, 0.6), solid('#7a8a7a')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.01, 0.3); g.add(river);
    // crocodiles and a hippo
    [[0.08, 0.35, 0.3], [-0.07, 0.45, -0.4]].forEach(function (q) { var c = new T.Mesh(new T.BoxGeometry(0.014, 0.008, 0.07), solid('#4a5a3a')); c.position.set(q[0], 0.014, q[1]); c.rotation.y = q[2]; g.add(c); });
    var hp = new T.Mesh(new T.SphereGeometry(0.02, 7, 5), solid('#7a6a6a')); hp.scale.set(1, 0.5, 1.4); hp.position.set(-0.04, 0.014, 0.25); g.add(hp);
    jungle(g, 20, 0.45, 0.72, 7);
    return g;
  };

  /* ---------- Khor Virap & Mount Ararat ---------- */
  M.custom.khorvirap = function () {
    var g = new T.Group(), st = mat(stoneTex('kvst', '#c9b8a0', '#a8977e', 10, 5), 2, 1), roof = solid('#8a7a68');
    blob(g, '#9aa860', 0.74, 0.62, 0, 0.05, 0.006, 3);
    // Ararat (big and little) behind
    mountain(g, { h: 0.85, pos: [-0.15, -0.45], r: function (t) { return 0.42 * (1 - t) + 0.03; }, bump: 0.15, sx: 1.4, sz: 0.5, colour: function (x, y) { return y > 0.42 ? '#f6f8fa' : '#8a8a90'; } });
    mountain(g, { h: 0.45, pos: [0.35, -0.42], r: function (t) { return 0.24 * (1 - t) + 0.02; }, bump: 0.12, sz: 0.6, seed: 5, colour: function (x, y) { return y > 0.33 ? '#f6f8fa' : '#8a8a90'; } });
    // the hill with the walled monastery
    mountain(g, { h: 0.12, pos: [0.05, 0.12], rings: 6, r: function (t) { return 0.28 * (1 - t * 0.5); }, bump: 0.2, colour: function () { return '#a89a78'; } });
    var Y = 0.12, X = 0.05, Z = 0.12;
    [[0, -0.12, 0.3, 0.02], [0, 0.12, 0.3, 0.02], [-0.15, 0, 0.02, 0.24], [0.15, 0, 0.02, 0.24]].forEach(function (q) { box(g, st, q[2], 0.06, q[3], X + q[0], Y, Z + q[1]); });
    box(g, st, 0.08, 0.08, 0.12, X, Y, Z); ridge(g, roof, 0.09, 0.03, 0.13, X, Y + 0.08, Z, 0); box(g, st, 0.13, 0.08, 0.06, X, Y, Z); ridge(g, roof, 0.14, 0.03, 0.07, X, Y + 0.08, Z, Math.PI / 2);
    cyl(g, st, 0.026, 0.028, 0.06, X, Y + 0.08, Z, 8); cyl(g, roof, 0, 0.032, 0.05, X, Y + 0.14, Z, 8);
    for (var i = 0; i < 8; i++) { var c = box(g, solid('#5f8a3a'), 0.06, 0.004, 0.04, -0.5 + (i % 4) * 0.1, 0.008, 0.35 + Math.floor(i / 4) * 0.08); }
    return g;
  };

  /* ---------- Flame Towers, Baku ---------- */
  M.custom.flametowers = function () {
    var g = new T.Group();
    var glass = mat(tex('ftg', 32, 64, function (c, W, H) { var gr = c.createLinearGradient(0, H, 0, 0); gr.addColorStop(0, '#2a5a8a'); gr.addColorStop(0.5, '#5aa0d0'); gr.addColorStop(1, '#ffb04a'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(255,255,255,.25)'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1); }), 1, 1, { emissive: '#3a1a00' });
    blob(g, '#9ab070', 0.74, 0.62, 0, 0, 0.006, 3);
    var sea = new T.Mesh(new T.PlaneGeometry(1.5, 0.3), solid('#3f8fb8')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, 0.5); g.add(sea);
    function flame(x, z, h, ry) { var pts = [[0.07, 0], [0.085, h * 0.3], [0.08, h * 0.6], [0.05, h * 0.85], [0.015, h], [0, h]], f = lathe(pts, 16, glass); f.scale.z = 0.6; f.position.set(x, 0.006, z); f.rotation.y = ry; var p = f.geometry.attributes.position; for (var i = 0; i < p.count; i++) { var y = p.getY(i); p.setX(i, p.getX(i) + Math.pow(y / h, 2) * 0.03); } f.geometry.computeVertexNormals(); g.add(f); }
    flame(0, -0.15, 0.6, 0); flame(-0.17, -0.02, 0.5, 0.9); flame(0.17, -0.02, 0.48, -0.9);
    box(g, solid('#e8dcc4'), 0.5, 0.04, 0.08, 0, 0.006, 0.22);
    for (var t = 0; t < 8; t++) tree(g, -0.55 + t * 0.16, 0.32, 1.0, '#4f8a3a');
    return g;
  };

  /* ---------- Omar Ali Saifuddien Mosque ---------- */
  M.custom.omarali = function () {
    var g = new T.Group(), white = mat(winTex('oasw', '#f8f6f0', '#5a7a8a', 6, 2, { tall: 0.6 }), 2, 1), plain = solid('#f6f4ee'), gold = solid('#e8b52a', { emissive: '#4a3200' });
    blob(g, '#6aa850', 0.74, 0.62, 0, 0, 0.006, 3);
    var lag = new T.Mesh(new T.CircleGeometry(0.62, 30), solid('#3f9fc8')); lag.rotation.x = -Math.PI / 2; lag.scale.y = 0.8; lag.position.y = 0.008; g.add(lag);
    box(g, solid('#e8e2d4'), 0.36, 0.03, 0.3, 0, 0.006, -0.08);
    box(g, white, 0.26, 0.12, 0.2, 0, 0.036, -0.08);
    for (var i = 0; i < 6; i++) arch(g, solid('#7a9aa8'), 0.025, 0.06, -0.1 + i * 0.04, 0.04, 0.021, 0.003);
    cyl(g, plain, 0.09, 0.09, 0.04, 0, 0.156, -0.08, 16); dome(g, gold, 0.1, 0, 0.196, -0.08, 1.25); cyl(g, gold, 0.003, 0.008, 0.06, 0, 0.32, -0.08, 6);
    [[-0.13, 0.02], [0.13, 0.02], [-0.13, -0.18], [0.13, -0.18]].forEach(function (q) { cyl(g, plain, 0.012, 0.012, 0.03, q[0], 0.156, q[1], 8); dome(g, gold, 0.016, q[0], 0.186, q[1], 1.4); });
    // the tall minaret
    box(g, plain, 0.05, 0.38, 0.05, 0.2, 0.036, -0.2); dome(g, gold, 0.03, 0.2, 0.416, -0.2, 1.4);
    // the ceremonial stone boat in the lagoon
    var boat = new T.Group(); box(boat, solid('#e8dcc4'), 0.06, 0.03, 0.26, 0, 0, 0); var bow = new T.Mesh(new T.ConeGeometry(0.03, 0.06, 4), solid('#e8dcc4')); bow.rotation.x = Math.PI / 2; bow.position.set(0, 0.015, 0.16); boat.add(bow); box(boat, solid('#c0392b'), 0.05, 0.04, 0.08, 0, 0.03, -0.04); hip(boat, gold, 0.07, 0.1, 0.03, 0, 0.07, -0.04, 0.3);
    boat.position.set(-0.32, 0.008, 0.25); boat.rotation.y = 0.9; g.add(boat);
    box(g, solid('#e8e2d4'), 0.03, 0.01, 0.3, 0.05, 0.02, 0.25);
    for (var p = 0; p < 5; p++) { var a = Math.PI * (1.1 + p * 0.18); palm(g, Math.cos(a) * 0.66, Math.sin(a) * 0.52, 1.1); }
    return g;
  };

  /* ---------- National Parliament House, Port Moresby ---------- */
  M.custom.pngparl = function () {
    var g = new T.Group();
    var front = mat(tex('pngf', 64, 64, function (c, W, H) { c.fillStyle = '#c9a46a'; c.fillRect(0, 0, W, H); var cols = ['#c0392b', '#1a1a1a', '#f2c14e', '#f6f2ea']; for (var r = 0; r < 8; r++) for (var x = 0; x < W; x += 8) { c.fillStyle = cols[(r + x / 8) % 4]; c.beginPath(); c.moveTo(x, r * 8 + 8); c.lineTo(x + 4, r * 8); c.lineTo(x + 8, r * 8 + 8); c.fill(); } }), 1, 1);
    blob(g, '#6aa850', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#d8d2c2'), 0.6, 0.02, 0.5, 0, 0.006, -0.05);
    // the steep haus tambaran front: a tall triangle leaning forward
    var sh = new T.Shape(); sh.moveTo(-0.16, 0); sh.lineTo(0.16, 0); sh.lineTo(0.0, 0.5); sh.lineTo(-0.16, 0);
    var tri = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.02, bevelEnabled: false }), front); tri.position.set(0, 0.026, 0.12); tri.rotation.x = -0.15; g.add(tri);
    var roof = new T.Group(); prism(roof, solid('#4a4a50'), 0.3, 0.45, 0.32, 0, 0, 0); roof.position.set(0, 0.026, -0.06); g.add(roof);
    [[-0.22, -0.05], [0.22, -0.05]].forEach(function (q) { box(g, mat(winTex('pngw', '#e8e2d4', '#5a6a7a', 4, 2, { tall: 0.5 }), 1, 1), 0.14, 0.1, 0.34, q[0], 0.026, q[1]); });
    cyl(g, solid('#8a8f96'), 0.003, 0.003, 0.2, 0.3, 0.026, 0.25, 4);
    var fl = new T.Mesh(new T.BoxGeometry(0.06, 0.04, 0.002), mat(tex('pngflag', 24, 16, function (c) { c.fillStyle = '#000'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 16); c.lineTo(24, 16); c.fill(); c.fillStyle = '#ce1126'; c.beginPath(); c.moveTo(0, 0); c.lineTo(24, 0); c.lineTo(24, 16); c.fill(); c.fillStyle = '#fcd116'; c.fillRect(15, 3, 5, 3); c.fillStyle = '#fff'; c.fillRect(4, 9, 2, 2); c.fillRect(7, 12, 2, 2); }), 1, 1)); fl.position.set(0.33, 0.2, 0.25); g.add(fl);
    for (var p = 0; p < 7; p++) palm(g, -0.5 + p * 0.17, 0.42, 1.1);
    return g;
  };

  /* ---------- Amundsen–Scott South Pole Station ---------- */
  M.custom.southpole = function () {
    var g = new T.Group(), snow = solid('#f4f8fb');
    blob(g, '#eef4f8', 0.74, 0.62, 0, 0, 0.006, 4);
    // the elevated station on stilts
    var st = mat(winTex('spst', '#c9ccd0', '#3a4a5a', 10, 2, { tall: 0.4 }), 4, 1);
    for (var i = 0; i < 6; i++) [-0.05, 0.05].forEach(function (z) { cyl(g, solid('#5a6068'), 0.006, 0.006, 0.08, -0.25 + i * 0.1, 0.006, -0.18 + z, 6); });
    box(g, st, 0.6, 0.1, 0.14, 0, 0.086, -0.18); box(g, st, 0.14, 0.1, 0.3, 0.3, 0.086, -0.1);
    // the ceremonial pole with its mirror ball, ringed by flags
    var stripes = mat(tex('sppole', 8, 32, function (c, W, H) { for (var y = 0; y < H; y += 8) { c.fillStyle = '#e8302a'; c.fillRect(0, y, W, 4); c.fillStyle = '#ffffff'; c.fillRect(0, y + 4, W, 4); } }), 1, 2);
    cyl(g, stripes, 0.008, 0.008, 0.08, 0, 0.006, 0.18, 8); var ball = new T.Mesh(new T.SphereGeometry(0.022, 14, 10), solid('#d8e2ea', { emissive: '#3a4450' })); ball.position.set(0, 0.106, 0.18); g.add(ball);
    var fc = ['#e8302a', '#2b6fd0', '#ffffff', '#f2c14e', '#4fb35a', '#c0392b', '#1a3a8a', '#ff8a3a', '#2a2a2a', '#7fb8e0', '#e8473a', '#ffffff'];
    fc.forEach(function (c, k) { var a = k / 12 * D2, x = Math.cos(a) * 0.12, z = 0.18 + Math.sin(a) * 0.1; cyl(g, solid('#8a8f96'), 0.002, 0.002, 0.08, x, 0.006, z, 4); var f = new T.Mesh(new T.BoxGeometry(0.03, 0.02, 0.002), solid(c)); f.position.set(x + 0.015, 0.075, z); g.add(f); });
    // a ski plane on the snow runway
    box(g, solid('#e2e8ee'), 1.2, 0.002, 0.08, 0, 0.008, 0.42);
    var pl = new T.Group(); box(pl, solid('#e8302a'), 0.04, 0.03, 0.16, 0, 0.02, 0); box(pl, solid('#e8302a'), 0.28, 0.008, 0.04, 0, 0.045, 0.01); box(pl, solid('#e8302a'), 0.08, 0.006, 0.025, 0, 0.04, -0.07); box(pl, solid('#e8302a'), 0.006, 0.04, 0.03, 0, 0.05, -0.07); [-0.1, -0.05, 0.05, 0.1].forEach(function (x) { cyl(pl, solid('#4a4a50'), 0.01, 0.01, 0.025, x, 0.035, 0.03, 6).rotation.x = Math.PI / 2; }); [-0.03, 0.03].forEach(function (x) { box(pl, solid('#8a8f96'), 0.01, 0.006, 0.08, x, 0.0, 0.0); });
    pl.position.set(0.3, 0.008, 0.42); pl.rotation.y = Math.PI / 2; g.add(pl);
    for (var d = 0; d < 5; d++) { var dr = new T.Mesh(new T.SphereGeometry(0.06, 7, 5), snow); dr.scale.y = 0.2; dr.position.set(-0.5 + d * 0.25, 0.006, -0.42); g.add(dr); }
    return g;
  };
})();
