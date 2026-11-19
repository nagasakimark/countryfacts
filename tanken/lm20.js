/* Detailed landmarks, batch 20: Gateway Arch, Stanley Park totem poles, Sugarloaf Mountain, Perito Moreno Glacier,
   Nazca Lines, Rainbow Mountain, Cartagena, Kaieteur Falls. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function water(g, w, d, x, z, col) { var p = new T.Mesh(new T.PlaneGeometry(w, d), solid(col || '#3f8fc0')); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.008, z); g.add(p); return p; }
  function jungle(g, n, r0, r1, seed, y, back) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0); if (back && Math.sin(a) > -0.15) continue; var c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }

  /* ---------- Gateway Arch ---------- */
  M.custom.gatewayarch = function () {
    var g = new T.Group(), steel = solid('#d8dee6', { emissive: '#22262c' });
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    water(g, 1.5, 0.22, 0, 0.45, '#6a8a8a');
    // a catenary arch, triangular in section and thinner at the top
    var pts = []; for (var i = 0; i <= 30; i++) { var t = i / 30 * 2 - 1, x = t * 0.3, y = 0.62 - 0.62 * (Math.cosh(t * 1.6) - 1) / (Math.cosh(1.6) - 1); pts.push(new T.Vector3(x, y, 0)); }
    var c = new T.CatmullRomCurve3(pts), geo = new T.TubeGeometry(c, 40, 0.02, 3), p = geo.attributes.position;
    for (var k = 0; k < p.count; k++) { var yy = p.getY(k), s = 1.3 - yy * 0.9, cp = c.getPoint(Math.max(0, Math.min(1, (p.getX(k) / 0.3 + 1) / 2))); p.setZ(k, p.getZ(k) * s); }
    geo.computeVertexNormals(); var a = new T.Mesh(geo, steel); a.position.y = 0.006; g.add(a);
    box(g, solid('#d8d2c2'), 0.8, 0.004, 0.12, 0, 0.006, 0.0);
    for (var t2 = 0; t2 < 10; t2++) tree(g, -0.5 + t2 * 0.11, -0.28 + (t2 % 2) * 0.05, 1.0, '#4f8a3a');
    box(g, mat(winTex('stl', '#c9b8a0', '#3a4450', 5, 4, { tall: 0.5 }), 1, 1), 0.14, 0.18, 0.1, 0.45, 0.006, -0.42);
    box(g, mat(winTex('stl2', '#9aa3ad', '#3a4450', 4, 6, { tall: 0.5 }), 1, 1), 0.1, 0.26, 0.1, 0.3, 0.006, -0.45);
    return g;
  };

  /* ---------- Totem poles, Stanley Park ---------- */
  M.custom.totems = function () {
    var g = new T.Group();
    blob(g, '#5f8a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    var cols = [['#c0392b', '#1a1a1a', '#2f8a7a', '#f2c14e'], ['#1a1a1a', '#c0392b', '#e8dcc4', '#2b6fd0'], ['#2f8a7a', '#c0392b', '#1a1a1a', '#f2c14e']];
    function totem(x, z, h, k, ry) {
      var o = new T.Group(), wood = solid('#a8784a'), n = 4, seg = h / n;
      for (var i = 0; i < n; i++) {
        cyl(o, wood, 0.032, 0.035, seg, 0, i * seg, 0, 10);
        // a carved face: eyes, beak/mouth in bold colours
        [-1, 1].forEach(function (s) { var e = new T.Mesh(new T.SphereGeometry(0.01, 6, 5), solid(cols[k][(i + 1) % 4])); e.scale.z = 0.4; e.position.set(s * 0.013, i * seg + seg * 0.65, 0.032); o.add(e); });
        box(o, solid(cols[k][i % 4]), 0.04, 0.012, 0.012, 0, i * seg + seg * 0.25, 0.03);
        if (i % 2) { var beak = new T.Mesh(new T.ConeGeometry(0.01, 0.04, 4), solid(cols[k][(i + 2) % 4])); beak.rotation.x = Math.PI / 2; beak.position.set(0, i * seg + seg * 0.45, 0.05); o.add(beak); }
      }
      // spread wings at the top
      [-1, 1].forEach(function (s) { var w = box(o, solid(cols[k][0]), 0.08, 0.02, 0.012, s * 0.06, h - 0.02, 0); w.rotation.z = s * 0.3; });
      var hd = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), wood); hd.position.set(0, h + 0.02, 0); o.add(hd);
      o.position.set(x, 0.006, z); o.rotation.y = ry; g.add(o);
    }
    [[-0.24, 0.05, 0.42, 0], [-0.12, 0.08, 0.5, 1], [0.0, 0.1, 0.38, 2], [0.12, 0.08, 0.46, 0], [0.24, 0.05, 0.4, 1]].forEach(function (q, i) { totem(q[0], q[1], q[2], q[3], (i - 2) * 0.12); });
    box(g, solid('#c9b890'), 0.7, 0.004, 0.16, 0, 0.006, 0.2);
    for (var t = 0; t < 14; t++) { var a = Math.PI * (1.0 + t * 0.075), r = 0.56; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.4, '#2f5a34'); }
    return g;
  };

  /* ---------- Sugarloaf Mountain ---------- */
  M.custom.sugarloaf = function () {
    var g = new T.Group();
    blob(g, '#2f8fb8', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#e8dcb0', 0.3, 0.12, -0.35, 0.4, 0.012, 2);
    function peak(x, z, h, r, seed) { mountain(g, { h: h, pos: [x, z], rings: 14, r: function (t) { return r * Math.sqrt(Math.max(0, 1 - t * t)) * (1 - t * 0.2) + 0.01; }, bump: 0.08, sz: 0.8, seed: seed, colour: function (px, py) { return py < h * 0.35 ? (noise(px * 20, py * 20) > 0.4 ? '#3f8a3f' : '#4f9a4a') : (noise(px * 10, py * 18) > 0.6 ? '#6a6460' : '#8a847c'); } }); }
    peak(0.15, -0.1, 0.5, 0.2, 1); peak(-0.25, 0.05, 0.25, 0.16, 5);
    // the cable car line between the peaks
    var c = new T.LineCurve3(new T.Vector3(-0.25, 0.26, 0.05), new T.Vector3(0.15, 0.5, -0.1)); g.add(new T.Mesh(new T.TubeGeometry(c, 2, 0.002, 3), solid('#3a3a3a')));
    var cab = new T.Mesh(new T.BoxGeometry(0.03, 0.025, 0.03), solid('#e8302a')); cab.position.copy(c.getPoint(0.55)); cab.position.y -= 0.02; g.add(cab);
    box(g, solid('#f2ece0'), 0.06, 0.03, 0.04, 0.15, 0.49, -0.1);
    var bt = new T.Group(); box(bt, solid('#ffffff'), 0.03, 0.02, 0.08, 0, 0, 0); var sl = new T.Mesh(new T.PlaneGeometry(0.04, 0.06), solid('#ffffff', { side: T.DoubleSide })); sl.rotation.y = Math.PI / 2; sl.position.y = 0.05; bt.add(sl); bt.position.set(0.35, 0.008, 0.3); g.add(bt);
    for (var p = 0; p < 4; p++) palm(g, -0.5 + p * 0.06, 0.42, 1.0);
    return g;
  };

  /* ---------- Perito Moreno Glacier ---------- */
  M.custom.peritomoreno = function () {
    var g = new T.Group(), ice = solid('#e8f6ff', { flatShading: true }), iceB = solid('#9fd8f0', { flatShading: true });
    water(g, 1.5, 0.5, 0, 0.35, '#7aa8c0');
    blob(g, '#6a7a5a', 0.74, 0.4, 0, -0.3, 0.006, 3);
    mountain(g, { h: 0.45, pos: [-0.35, -0.45], r: function (t) { return 0.3 * (1 - t) + 0.02; }, bump: 0.3, colour: function (x, y) { return y > 0.3 ? '#f6f8fa' : '#6a6a6a'; } });
    mountain(g, { h: 0.4, pos: [0.4, -0.45], r: function (t) { return 0.28 * (1 - t) + 0.02; }, bump: 0.3, seed: 4, colour: function (x, y) { return y > 0.27 ? '#f6f8fa' : '#6a6a6a'; } });
    // the glacier: a rough tongue of ice ending in a jagged wall
    var geo = new T.BoxGeometry(0.5, 0.14, 0.7, 14, 3, 14), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setY(i, y + (y > 0 ? (noise(x * 30, z * 30) - 0.5) * 0.05 + (-z) * 0.12 : 0)); p.setX(i, x * (1 + (z + 0.35) * 0.3)); }
    geo.computeVertexNormals();
    var gl = new T.Mesh(paintVerts(geo, function (x, y, z) { return z > 0.33 && y < 0.05 ? '#7fcfec' : (noise(x * 40, z * 40) > 0.6 ? '#bfe6f6' : '#f2faff'); }), vcMat); gl.position.set(0, 0.07, -0.05); g.add(gl);
    for (var k = 0; k < 6; k++) { var b = new T.Mesh(new T.IcosahedronGeometry(0.02 + hash(k, 1) * 0.02, 0), k % 2 ? ice : iceB); b.position.set(-0.2 + k * 0.08, 0.012, 0.36 + hash(k, 2) * 0.1); g.add(b); }
    box(g, solid('#8a6a4a'), 0.02, 0.01, 0.3, 0.42, 0.04, 0.2); // the viewing walkway
    return g;
  };

  /* ---------- Nazca Lines ---------- */
  M.custom.nazca = function () {
    var g = new T.Group(), line = solid('#f0d8b0');
    blob(g, '#b07a52', 0.74, 0.62, 0, 0, 0.006, 4);
    function draw(pts, sc, ox, oz) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], x1 = ox + a[0] * sc, z1 = oz + a[1] * sc, x2 = ox + b[0] * sc, z2 = oz + b[1] * sc, L = Math.hypot(x2 - x1, z2 - z1), s = box(g, line, 0.008, 0.003, L, (x1 + x2) / 2, 0.008, (z1 + z2) / 2); s.rotation.y = Math.atan2(x2 - x1, z2 - z1); } }
    // the hummingbird
    var hb = [[0, -1], [0, -0.3], [-0.5, -0.1], [-1, 0.3], [-0.6, 0.2], [-0.2, 0.15], [-0.1, 0.5], [0, 0.9], [0.1, 0.5], [0.2, 0.15], [0.6, 0.2], [1, 0.3], [0.5, -0.1], [0, -0.3]];
    draw(hb, 0.2, -0.22, -0.05); draw([[0, -1], [0, -1.6]], 0.2, -0.22, -0.05);
    // the monkey with its spiral tail
    var sp = []; for (var i = 0; i < 26; i++) { var a = i * 0.5, r = 0.02 + i * 0.006; sp.push([Math.cos(a) * r * 5, Math.sin(a) * r * 5]); } draw(sp, 0.18, 0.25, 0.15);
    draw([[0, 0], [-0.4, 0.5], [-0.2, 0.9], [0.3, 0.8], [0.6, 0.4], [0.2, 0]], 0.25, 0.22, -0.3);
    // long straight lines across the desert
    draw([[-2.6, 2.2], [2.6, -1.4]], 0.12, 0, 0); draw([[-2.4, -2.0], [2.2, 2.4]], 0.12, 0, 0);
    // a small sightseeing plane
    var pl = new T.Group(); box(pl, solid('#ffffff'), 0.02, 0.02, 0.08, 0, 0, 0); box(pl, solid('#2b6fd0'), 0.14, 0.004, 0.025, 0, 0.01, 0.0); box(pl, solid('#2b6fd0'), 0.05, 0.004, 0.015, 0, 0.005, -0.035); pl.position.set(0.1, 0.3, 0.1); pl.rotation.set(0.1, 0.6, 0.2); g.add(pl);
    return g;
  };

  /* ---------- Vinicunca (Rainbow Mountain) ---------- */
  M.custom.rainbowmtn = function () {
    var g = new T.Group(), bands = ['#c9503a', '#e8a04a', '#f2d08a', '#8ab06a', '#a85a6a', '#e87a5a', '#d8c09a'];
    blob(g, '#8a7a5a', 0.74, 0.62, 0, 0, 0.006, 4);
    mountain(g, { h: 0.42, pos: [0, -0.1], rings: 18, r: function (t) { return 0.5 * (1 - t) + 0.03; }, bump: 0.15, sx: 1.3, sz: 0.7, colour: function (x, y, z) { var b = Math.floor((y * 18 + (x + z) * 3 + noise(x * 6, z * 6) * 2)) % bands.length; return y > 0.39 ? '#d8c09a' : bands[(b + bands.length) % bands.length]; } });
    mountain(g, { h: 0.55, pos: [-0.45, -0.45], r: function (t) { return 0.25 * (1 - t) + 0.02; }, bump: 0.3, seed: 6, colour: function (x, y) { return y > 0.38 ? '#f6f8fa' : '#7a7470'; } });
    // a llama and hikers on the path
    box(g, solid('#c9b890'), 0.03, 0.004, 0.5, 0.25, 0.04, 0.2).rotation.y = 0.5;
    var ll = new T.Group(), wool = solid('#f2ece0'); box(ll, wool, 0.02, 0.02, 0.045, 0, 0.03, 0); [[0.006, 0.015], [-0.006, 0.015], [0.006, -0.015], [-0.006, -0.015]].forEach(function (q) { box(ll, wool, 0.005, 0.03, 0.005, q[0], 0, q[1]); }); box(ll, wool, 0.01, 0.035, 0.01, 0, 0.045, 0.02); box(ll, wool, 0.01, 0.01, 0.016, 0, 0.078, 0.025); box(ll, solid('#e8302a'), 0.022, 0.008, 0.02, 0, 0.05, 0); ll.position.set(0.35, 0.006, 0.38); ll.scale.setScalar(1.5); g.add(ll);
    [[0.3, 0.3, '#2b6fd0'], [0.27, 0.25, '#f2c14e']].forEach(function (q) { cyl(g, solid(q[2]), 0.008, 0.012, 0.04, q[0], 0.01, q[1], 6); });
    return g;
  };

  /* ---------- Cartagena ---------- */
  M.custom.cartagena = function () {
    var g = new T.Group(), wall = mat(stoneTex('ctw', '#c9b490', '#a8946e', 8, 4), 8, 1), cols = ['#f2c14e', '#e8473a', '#4fb3d8', '#f2a07a', '#7ad08a', '#e86ab0', '#ffffff'];
    blob(g, '#2f9fc8', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#d8c9a0', 0.62, 0.42, -0.05, -0.08, 0.01, 2);
    // the thick sea walls with bastions
    var pts = [[-0.5, 0.25], [-0.2, 0.32], [0.15, 0.3], [0.45, 0.15], [0.48, -0.2]];
    for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = box(g, wall, L, 0.06, 0.05, (a[0] + b[0]) / 2, 0.01, (a[1] + b[1]) / 2); w.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]); var bs = new T.Mesh(new T.CylinderGeometry(0.05, 0.06, 0.07, 5), wall); bs.position.set(a[0], 0.045, a[1]); g.add(bs); cyl(g, solid('#e8dcc4'), 0.012, 0.012, 0.04, a[0], 0.08, a[1], 8); }
    // colourful colonial houses with balconies
    for (var h = 0; h < 15; h++) { var x = -0.4 + (h % 5) * 0.17, z = -0.3 + Math.floor(h / 5) * 0.16, ht = 0.06 + hash(h, 1) * 0.04; box(g, solid(cols[h % 7]), 0.13, ht, 0.1, x, 0.01, z); ridge(g, solid('#c0583a'), 0.135, 0.03, 0.105, x, 0.01 + ht, z, 0); box(g, solid('#6a4a2a'), 0.1, 0.006, 0.02, x, 0.01 + ht * 0.6, z + 0.06); if (h % 3 === 0) { var fl = new T.Mesh(new T.SphereGeometry(0.01, 5, 4), solid('#e84a8a')); fl.position.set(x - 0.03, 0.02 + ht * 0.6, z + 0.07); g.add(fl); } }
    // the clock tower gate
    box(g, solid('#f2ece0'), 0.06, 0.18, 0.06, 0.2, 0.01, 0.2); cyl(g, solid('#c0583a'), 0, 0.04, 0.05, 0.2, 0.19, 0.2, 4, Math.PI / 4);
    for (var p = 0; p < 3; p++) palm(g, 0.35 + p * 0.06, -0.1, 1.0);
    return g;
  };

  /* ---------- Kaieteur Falls ---------- */
  M.custom.kaieteur = function () {
    var g = new T.Group();
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // a sandstone plateau with the river pouring off its edge into a deep gorge
    box(g, solid('#7a5a44', { flatShading: true }), 1.2, 0.36, 0.5, 0, 0.006, -0.3);
    box(g, solid('#3f7a3f'), 1.2, 0.01, 0.5, 0, 0.366, -0.3);
    var river = new T.Mesh(new T.PlaneGeometry(0.12, 0.5), solid('#8a6a3a')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.372, -0.3); g.add(river);
    var fall = new T.Mesh(new T.PlaneGeometry(0.12, 0.36, 1, 6), solid('#f2ead8', { side: T.DoubleSide })); var fp = fall.geometry.attributes.position; for (var i = 0; i < fp.count; i++) fp.setX(i, fp.getX(i) * (1 + (0.18 - fp.getY(i)) * 0.8)); fall.position.set(0, 0.186, -0.045); g.add(fall);
    for (var k = 0; k < 5; k++) { var sp = new T.Mesh(new T.SphereGeometry(0.05 + k * 0.01, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.55 })); sp.position.set((hash(k, 1) - 0.5) * 0.12, 0.03 + k * 0.025, 0.0); g.add(sp); }
    var pool = new T.Mesh(new T.PlaneGeometry(0.16, 0.5), solid('#6a5a3a')); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.01, 0.25); g.add(pool);
    jungle(g, 30, 0.2, 0.6, 5, 0.36, true); jungle(g, 10, 0.4, 0.7, 9);
    return g;
  };
})();
