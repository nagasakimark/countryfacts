/* Detailed landmarks, batch 19: London Eye, Edinburgh Castle, Atomium, Lake Bled, Trulli of Alberobello,
   Plitvice Lakes, Rila Monastery, Tallinn Old Town. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function water(g, w, d, x, z, col) { var p = new T.Mesh(new T.PlaneGeometry(w, d), solid(col || '#3f8fc0')); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.008, z); g.add(p); return p; }

  /* ---------- London Eye ---------- */
  M.custom.londoneye = function () {
    var g = new T.Group(), white = solid('#f2f4f6'), steel = solid('#c9d0d8');
    water(g, 1.5, 0.4, 0, 0.32, '#4a7fa0');
    blob(g, '#8ab070', 0.72, 0.3, 0, -0.3, 0.012, 3);
    var W = new T.Group();
    var rim = new T.Mesh(new T.TorusGeometry(0.3, 0.008, 6, 48), white); W.add(rim);
    var rim2 = new T.Mesh(new T.TorusGeometry(0.28, 0.004, 4, 48), steel); W.add(rim2);
    for (var i = 0; i < 16; i++) { var a = i / 16 * D2, sp = new T.Mesh(new T.CylinderGeometry(0.002, 0.002, 0.3), steel); sp.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0); sp.rotation.z = a - Math.PI / 2; W.add(sp); }
    for (var c = 0; c < 32; c++) { var a2 = c / 32 * D2, cap = new T.Mesh(new T.SphereGeometry(0.014, 8, 6), solid('#bfe0f0', { transparent: true, opacity: 0.9 })); cap.scale.set(1, 0.6, 1.6); cap.position.set(Math.cos(a2) * 0.31, Math.sin(a2) * 0.31, 0); W.add(cap); }
    cyl(W, white, 0.02, 0.02, 0.06, 0, -0.03, 0, 10).rotation.x = Math.PI / 2;
    W.position.set(0, 0.33, 0.12); W.rotation.y = 0.3; g.add(W);
    // the A-frame leg on the bank holding it up
    [-0.06, 0.06].forEach(function (dx) { var c = new T.LineCurve3(new T.Vector3(-0.12 + dx, 0.01, -0.12), new T.Vector3(0, 0.33, 0.1)); g.add(new T.Mesh(new T.TubeGeometry(c, 2, 0.01, 6), white)); });
    box(g, solid('#d8d2c2'), 0.5, 0.02, 0.06, 0, 0.012, 0.16);
    box(g, mat(winTex('cty', '#e8dcc4', '#4a5060', 8, 3, { tall: 0.5 }), 3, 1), 0.3, 0.1, 0.1, 0.42, 0.012, -0.42);
    return g;
  };

  /* ---------- Edinburgh Castle ---------- */
  M.custom.edinburgh = function () {
    var g = new T.Group(), st = mat(stoneTex('edst', '#8a8478', '#6f6a60', 10, 5), 4, 1), slate = solid('#4a5058');
    blob(g, '#6a9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.3, pos: [0, -0.05], rings: 10, r: function (t) { return t > 0.85 ? 0.34 * (1 - (t - 0.85) * 3) : 0.36 - t * 0.05; }, bump: 0.25, sx: 1.3, sz: 0.85, colour: function (x, y, z) { return y > 0.27 ? '#7a9a5a' : noise(x * 14, y * 14) > 0.5 ? '#4a4540' : '#5f5a52'; } });
    var Y = 0.27;
    // curtain walls and the half-moon battery
    var bat = new T.Mesh(new T.CylinderGeometry(0.12, 0.13, 0.1, 16, 1, false, -Math.PI / 2, Math.PI), st); bat.position.set(0.2, Y + 0.02, 0.08); g.add(bat);
    box(g, st, 0.6, 0.06, 0.03, 0, Y, 0.2); box(g, st, 0.03, 0.06, 0.4, -0.3, Y, 0.0);
    // the palace, great hall and barracks
    box(g, mat(winTex('edw', '#9a9488', '#2a2a30', 6, 3, { tall: 0.5 }), 3, 1), 0.28, 0.12, 0.12, -0.05, Y, -0.12); ridge(g, slate, 0.29, 0.05, 0.13, -0.05, Y + 0.12, -0.12, 0);
    box(g, st, 0.16, 0.1, 0.1, 0.15, Y, -0.05); ridge(g, slate, 0.17, 0.04, 0.11, 0.15, Y + 0.1, -0.05, 0);
    box(g, st, 0.07, 0.17, 0.07, -0.15, Y, -0.12); for (var k = 0; k < 4; k++) [-1, 1].forEach(function (s) { box(g, st, 0.012, 0.016, 0.012, -0.15 + s * 0.03, Y + 0.17, -0.15 + k * 0.02); });
    // the gatehouse at the esplanade
    box(g, st, 0.1, 0.12, 0.06, -0.22, Y - 0.02, 0.22); arch(g, solid('#2a2622'), 0.03, 0.06, -0.22, Y - 0.02, 0.252, 0.002);
    box(g, solid('#a8a090'), 0.12, 0.004, 0.3, -0.22, 0.2, 0.42).rotation.x = -0.25;
    // a cannon
    var cn = new T.Mesh(new T.CylinderGeometry(0.006, 0.009, 0.06, 8), solid('#2a2a2e')); cn.rotation.x = Math.PI / 2; cn.position.set(0.2, Y + 0.08, 0.18); g.add(cn);
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; tree(g, Math.cos(a) * 0.6, Math.sin(a) * 0.5, 1.1, '#3f7a44'); }
    return g;
  };

  /* ---------- Atomium ---------- */
  M.custom.atomium = function () {
    var g = new T.Group(), steel = solid('#d8dee6', { emissive: '#1a1e24' }), tube = solid('#c0c8d0');
    blob(g, '#7aa858', 0.7, 0.6, 0, 0, 0.006, 3);
    box(g, solid('#d8d2c2'), 0.3, 0.006, 0.3, 0, 0.006, 0);
    // nine spheres: a cube standing on one corner, plus its centre
    var s = 0.13, pts = [], C = new T.Vector3(0, 0.36, 0);
    var q = new T.Quaternion().setFromUnitVectors(new T.Vector3(1, 1, 1).normalize(), new T.Vector3(0, 1, 0));
    for (var i = 0; i < 8; i++) { var v = new T.Vector3(i & 1 ? s : -s, i & 2 ? s : -s, i & 4 ? s : -s).applyQuaternion(q).add(C); pts.push(v); }
    pts.push(C.clone());
    pts.forEach(function (p) { var b = new T.Mesh(new T.SphereGeometry(0.045, 14, 10), steel); b.position.copy(p); g.add(b); for (var w = 0; w < 6; w++) { var dot = new T.Mesh(new T.SphereGeometry(0.006, 4, 3), solid('#4a5a6a')); dot.position.copy(p).add(new T.Vector3(Math.cos(w) * 0.045, Math.sin(w * 2) * 0.02, Math.sin(w) * 0.045)); g.add(dot); } });
    function link(a, b) { var d = b.clone().sub(a), L = d.length(), m = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, L, 8), tube); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); g.add(m); }
    for (var a = 0; a < 8; a++) for (var b = a + 1; b < 8; b++) { var x = a ^ b; if (x === 1 || x === 2 || x === 4) link(pts[a], pts[b]); }
    for (var c = 0; c < 8; c++) link(pts[c], pts[8]);
    // the bottom sphere is held up by pillars
    var low = pts.reduce(function (m, p) { return p.y < m.y ? p : m; });
    link(new T.Vector3(low.x, 0.006, low.z), low);
    [0, 2.1, 4.2].forEach(function (an) { link(new T.Vector3(Math.cos(an) * 0.14, 0.006, Math.sin(an) * 0.14), pts.filter(function (p) { return p.y < 0.36; })[0]); });
    for (var t = 0; t < 8; t++) { var a2 = t / 8 * D2; tree(g, Math.cos(a2) * 0.5, Math.sin(a2) * 0.42, 1.1, '#4f8a3a'); }
    return g;
  };

  /* ---------- Lake Bled ---------- */
  M.custom.bled = function () {
    var g = new T.Group(), white = solid('#f6f2ea'), roof = solid('#c0583a');
    blob(g, '#4f8a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    var lake = new T.Mesh(new T.CircleGeometry(0.42, 30), solid('#3fa8a0')); lake.rotation.x = -Math.PI / 2; lake.scale.y = 0.8; lake.position.set(0, 0.01, 0.05); g.add(lake);
    // the island church
    blob(g, '#5f9a4a', 0.08, 0.06, 0.02, 0.05, 0.02, 2);
    box(g, white, 0.06, 0.04, 0.04, 0.02, 0.02, 0.05); ridge(g, roof, 0.065, 0.025, 0.045, 0.02, 0.06, 0.05, 0);
    box(g, white, 0.025, 0.1, 0.025, 0.06, 0.02, 0.05); cyl(g, roof, 0, 0.02, 0.05, 0.06, 0.12, 0.05, 4, Math.PI / 4);
    for (var s = 0; s < 6; s++) box(g, white, 0.03, 0.004, 0.01, 0.02, 0.012 + s * 0.004, 0.09 + s * 0.008);
    // Bled Castle on its cliff
    mountain(g, { h: 0.32, pos: [-0.38, -0.3], rings: 8, r: function (t) { return t > 0.9 ? 0.12 * (1 - (t - 0.9) * 6) : 0.14 - t * 0.02; }, bump: 0.25, seed: 4, colour: function (x, y) { return y > 0.3 ? '#5f8a4a' : '#8a8478'; } });
    box(g, white, 0.12, 0.06, 0.08, -0.38, 0.3, -0.3); ridge(g, roof, 0.13, 0.04, 0.09, -0.38, 0.36, -0.3, 0); box(g, white, 0.03, 0.09, 0.03, -0.33, 0.3, -0.28); cyl(g, roof, 0, 0.022, 0.04, -0.33, 0.39, -0.28, 4, Math.PI / 4);
    // the Julian Alps behind and a wooden pletna boat
    mountain(g, { h: 0.5, pos: [0.25, -0.5], r: function (t) { return 0.35 * (1 - t) + 0.02; }, bump: 0.3, sx: 1.3, sz: 0.4, colour: function (x, y) { return y > 0.36 ? '#f6f8fa' : '#7a8a7a'; } });
    var bt = new T.Group(); box(bt, solid('#8a5a3a'), 0.025, 0.012, 0.07, 0, 0, 0); box(bt, solid('#e8473a'), 0.026, 0.004, 0.04, 0, 0.03, 0); [-0.012, 0.012].forEach(function (x) { cyl(bt, solid('#5a3a28'), 0.002, 0.002, 0.03, x, 0, 0, 4); }); bt.position.set(0.18, 0.012, 0.2); bt.rotation.y = 0.6; g.add(bt);
    for (var t = 0; t < 14; t++) { var a = t / 14 * D2, r = 0.58; if (Math.sin(a) < -0.6 && Math.cos(a) < 0) continue; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.82, 1.1, '#2f6b3a'); }
    return g;
  };

  /* ---------- Trulli of Alberobello ---------- */
  M.custom.alberobello = function () {
    var g = new T.Group(), white = solid('#f8f6f0'), stone = mat(tex('trul', 32, 32, function (c, W, H) { c.fillStyle = '#8a8478'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(0,0,0,.22)'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1.5); for (var i = 0; i < 40; i++) { c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect((i * 7) % W, (i * 11) % H, 4, 2); } }), 2, 2);
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    for (var i = 0; i < 16; i++) {
      var r = Math.floor(i / 4), c = i % 4, x = -0.36 + c * 0.24 + (r % 2) * 0.1, z = -0.32 + r * 0.2, s = 0.8 + hash(i, 1) * 0.4;
      cyl(g, white, 0.05 * s, 0.055 * s, 0.07 * s, x, 0.006, z, 12);
      var cone = new T.Mesh(new T.ConeGeometry(0.055 * s, 0.11 * s, 12), stone); cone.position.set(x, 0.006 + 0.07 * s + 0.055 * s, z); g.add(cone);
      var pin = new T.Mesh(new T.SphereGeometry(0.008 * s, 6, 5), white); pin.position.set(x, 0.006 + 0.07 * s + 0.115 * s, z); g.add(pin);
      if (i % 3 === 0) { var sym = new T.Mesh(new T.PlaneGeometry(0.02 * s, 0.02 * s), white); sym.position.set(x, 0.006 + 0.07 * s + 0.04 * s, z + 0.035 * s); sym.rotation.x = -0.45; g.add(sym); }
      box(g, solid('#5a4a3a'), 0.02, 0.04, 0.002, x, 0.006, z + 0.052 * s);
    }
    for (var t = 0; t < 6; t++) { var o = new T.Mesh(new T.IcosahedronGeometry(0.03, 0), solid('#7a8a4a', { flatShading: true })); o.position.set(-0.6 + t * 0.24, 0.04, 0.48); g.add(o); cyl(g, solid('#6a5a48'), 0.006, 0.008, 0.03, -0.6 + t * 0.24, 0.006, 0.48, 5); }
    return g;
  };

  /* ---------- Plitvice Lakes ---------- */
  M.custom.plitvice = function () {
    var g = new T.Group();
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // a staircase of emerald lakes linked by waterfalls
    var L = [[-0.3, -0.3, 0.22, 0.16, 0.2], [0.05, -0.18, 0.2, 0.12, 0.15], [0.3, 0.05, 0.18, 0.12, 0.1], [0.0, 0.25, 0.22, 0.12, 0.05], [-0.35, 0.3, 0.14, 0.1, 0.0]];
    L.forEach(function (l, i) {
      var bank = new T.Mesh(new T.CylinderGeometry(1, 1.1, 1, 20), solid('#5f8a4a', { flatShading: true })); bank.scale.set(l[2] + 0.04, l[4] + 0.01, l[3] + 0.04); bank.position.set(l[0], (l[4] + 0.01) / 2, l[1]); g.add(bank);
      var w = new T.Mesh(new T.CircleGeometry(1, 20), solid(i % 2 ? '#3fc0b0' : '#2fb0c0')); w.rotation.x = -Math.PI / 2; w.scale.set(l[2], l[3], 1); w.position.set(l[0], l[4] + 0.012, l[1]); g.add(w);
      if (i < L.length - 1) { var n = L[i + 1], f = new T.Mesh(new T.PlaneGeometry(0.06, l[4] - n[4] + 0.01), solid('#f2faff', { side: T.DoubleSide })); f.position.set((l[0] + n[0]) / 2, (l[4] + n[4]) / 2 + 0.01, (l[1] + n[1]) / 2); f.lookAt(n[0], f.position.y, n[1]); g.add(f); }
    });
    box(g, solid('#a88a5a'), 0.03, 0.006, 0.4, 0.15, 0.13, -0.05).rotation.y = 0.8; // wooden boardwalk
    for (var t = 0; t < 22; t++) { var a = hash(t, 1) * D2, r = 0.5 + hash(t, 2) * 0.2; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.1 + hash(t, 3) * 0.4, t % 4 ? '#2f6b3a' : '#4f8a3a'); }
    return g;
  };

  /* ---------- Rila Monastery ---------- */
  M.custom.rila = function () {
    var g = new T.Group(), white = mat(winTex('rlw', '#f6f0e2', '#5a3a28', 8, 3, { tall: 0.4 }), 3, 1), roof = solid('#6a5a4a');
    var stripes = mat(tex('rlst', 32, 16, function (c, W, H) { for (var x = 0; x < W; x += 8) { c.fillStyle = '#c0392b'; c.fillRect(x, 0, 4, H); c.fillStyle = '#f6f0e2'; c.fillRect(x + 4, 0, 4, H); } c.fillStyle = '#1a1a1a'; c.fillRect(0, H - 3, W, 3); }), 6, 1);
    blob(g, '#5f8a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.5, pos: [0, -0.5], r: function (t) { return 0.55 * (1 - t) + 0.04; }, bump: 0.3, sx: 1.3, sz: 0.45, colour: function (x, y) { return y > 0.38 ? '#e8ecef' : '#3f6a3a'; } });
    // the courtyard walls (living quarters) around the church
    [[0, -0.28, 0.6, 0.08], [-0.3, 0, 0.08, 0.56], [0.3, 0, 0.08, 0.56], [0, 0.28, 0.6, 0.08]].forEach(function (q) { box(g, white, q[2], 0.14, q[3], q[0], 0.006, q[1]); var r = new T.Group(); prism(r, roof, Math.min(q[2], q[3]) + 0.02, 0.04, Math.max(q[2], q[3]), 0, 0, 0); r.position.set(q[0], 0.146, q[1]); r.rotation.y = q[2] > q[3] ? Math.PI / 2 : 0; g.add(r); });
    // the church with striped arches and domes
    box(g, stripes, 0.22, 0.08, 0.12, 0, 0.006, 0.02); box(g, white, 0.2, 0.06, 0.1, 0, 0.086, 0.0);
    [[0, 0.03], [-0.07, 0.025], [0.07, 0.025]].forEach(function (q) { cyl(g, white, q[1], q[1], 0.04, q[0], 0.146, 0.0, 10); var d = new T.Mesh(new T.SphereGeometry(q[1] * 1.1, 10, 6, 0, D2, 0, Math.PI / 2), roof); d.position.set(q[0], 0.186, 0.0); g.add(d); });
    box(g, mat(stoneTex('rltw', '#a89a88', '#8a7e6e', 4, 6), 1, 2), 0.06, 0.22, 0.06, 0.18, 0.006, -0.16); cyl(g, roof, 0, 0.045, 0.05, 0.18, 0.226, -0.16, 4, Math.PI / 4);
    for (var t = 0; t < 12; t++) { var a = t / 12 * D2; tree(g, Math.cos(a) * 0.6, Math.sin(a) * 0.5, 1.2, '#2f6b3a'); }
    return g;
  };

  /* ---------- Tallinn Old Town ---------- */
  M.custom.tallinn = function () {
    var g = new T.Group(), wall = mat(stoneTex('tlw', '#a89a84', '#8a7e6a', 8, 4), 6, 1), red = solid('#b8442e'), walls = ['#f2e6c8', '#e8c8a0', '#f6f0e2', '#d8e0e8', '#f2d8b0'];
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    // the city wall with round towers and pointed red roofs
    for (var i = 0; i < 9; i++) { var a = Math.PI * (0.1 + i * 0.1), x = Math.cos(a) * 0.45, z = Math.sin(a) * 0.3 + 0.05; if (i < 8) { var a2 = Math.PI * (0.1 + (i + 1) * 0.1), x2 = Math.cos(a2) * 0.45, z2 = Math.sin(a2) * 0.3 + 0.05, L = Math.hypot(x2 - x, z2 - z), w = box(g, wall, L, 0.08, 0.025, (x + x2) / 2, 0.006, (z + z2) / 2); w.rotation.y = -Math.atan2(z2 - z, x2 - x); } cyl(g, wall, 0.035, 0.035, 0.14, x, 0.006, z, 10); cyl(g, red, 0, 0.042, 0.1, x, 0.146, z, 10); }
    // the town: colourful gabled houses
    for (var h = 0; h < 18; h++) { var hx = -0.32 + (h % 6) * 0.13, hz = -0.25 + Math.floor(h / 6) * 0.13, ht = 0.07 + hash(h, 1) * 0.04; box(g, solid(walls[h % 5]), 0.08, ht, 0.08, hx, 0.006, hz); ridge(g, red, 0.085, 0.05, 0.085, hx, 0.006 + ht, hz, h % 2 ? 0 : Math.PI / 2); }
    // the Town Hall tower and St Olaf's spire
    box(g, solid('#c9c2b0'), 0.05, 0.22, 0.05, -0.05, 0.006, -0.12); cyl(g, solid('#3a4a3a'), 0, 0.03, 0.12, -0.05, 0.226, -0.12, 8);
    box(g, solid('#d8d2c2'), 0.07, 0.25, 0.07, 0.25, 0.006, -0.32); cyl(g, solid('#3f7a5a'), 0, 0.045, 0.26, 0.25, 0.256, -0.32, 8);
    return g;
  };
})();
