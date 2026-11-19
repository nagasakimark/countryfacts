/* Detailed landmarks, batch 5 (places from New Horizon and around Japan): Kinkaku-ji, Atomic Bomb Dome,
   Tōdai-ji, Gunkanjima, Tower Bridge, White House, Abu Simbel, Mont-Saint-Michel, Ha Long Bay,
   Chocolate Hills, Maasai Mara, Santa Claus Village, Milford Sound. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, acacia = K.acacia;
  var D2 = Math.PI * 2;
  // a hipped Japanese-style roof (four sloping sides)
  function hip(g, m, w, d, h, x, y, z, top) { var r = new T.Mesh(new T.CylinderGeometry(Math.SQRT1_2 * w * (top || 0.45), Math.SQRT1_2 * w * 1.15, h, 4, 1), m); r.rotation.y = Math.PI / 4; r.scale.z = d / w; r.position.set(x, y + h / 2, z); g.add(r); return r; }
  function ridge(g, m, w, h, d, x, y, z, ry) { var o = new T.Group(); prism(o, m, w, h, d, 0, 0, 0); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o); return o; }
  function pine(g, x, z, s) { cyl(g, solid('#6b4a32'), 0.006 * s, 0.01 * s, 0.07 * s, x, 0, z, 5); for (var i = 0; i < 3; i++) { var c = new T.Mesh(new T.SphereGeometry(0.035 * s, 7, 4), solid(i % 2 ? '#2f6b3a' : '#3a7a44', { flatShading: true })); c.scale.y = 0.45; c.position.set(x + (i - 1) * 0.025 * s, 0.07 * s + i * 0.018 * s, z + (i % 2 ? 0.01 : -0.01) * s); g.add(c); } }
  function maple(g, x, z, s, col) { cyl(g, solid('#6b4a32'), 0.005 * s, 0.008 * s, 0.05 * s, x, 0, z, 5); var c = new T.Mesh(new T.IcosahedronGeometry(0.04 * s, 0), solid(col || '#d9532c', { flatShading: true })); c.position.set(x, 0.075 * s, z); g.add(c); }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function snowTree(g, x, z, s) { var c = new T.Mesh(new T.ConeGeometry(0.045 * s, 0.14 * s, 6), solid('#2f5f3a', { flatShading: true })); c.position.set(x, 0.08 * s, z); g.add(c); var w = new T.Mesh(new T.ConeGeometry(0.026 * s, 0.06 * s, 6), solid('#f4f8fb', { flatShading: true })); w.position.set(x, 0.135 * s, z); g.add(w); cyl(g, solid('#6b4a32'), 0.006 * s, 0.008 * s, 0.02 * s, x, 0, z, 5); }
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.012 * s, 0.018 * s, 0.06 * s, x, 0, z, 6); var h = new T.Mesh(new T.SphereGeometry(0.011 * s, 6, 5), solid('#5a3a28')); h.position.set(x, 0.072 * s, z); g.add(h); }
  function deer(g, x, z, ry, s) {
    var d = new T.Group(), b = solid('#a8743f'), w = solid('#f1e3c8');
    box(d, b, 0.02, 0.016, 0.045, 0, 0.026, 0); box(d, w, 0.016, 0.004, 0.01, 0, 0.032, -0.024);
    [[0.007, 0.016], [-0.007, 0.016], [0.007, -0.016], [-0.007, -0.016]].forEach(function (q) { box(d, b, 0.004, 0.026, 0.004, q[0], 0, q[1]); });
    box(d, b, 0.008, 0.02, 0.008, 0, 0.038, 0.02); box(d, b, 0.01, 0.01, 0.016, 0, 0.056, 0.026);
    d.position.set(x, 0, z); d.rotation.y = ry; d.scale.setScalar(s || 1); g.add(d);
  }

  /* ---------- Kinkaku-ji (Golden Pavilion) ---------- */
  M.custom.kinkaku = function () {
    var g = new T.Group();
    var goldT = mat(tex('kinwall', 64, 64, function (c, W, H) { var gr = c.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#e9be3a'); gr.addColorStop(0.5, '#ffe27a'); gr.addColorStop(1, '#d9a72a'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.fillStyle = '#b7861c'; for (var x = 0; x < W; x += 16) c.fillRect(x, 0, 2, H); c.fillRect(0, 0, W, 3); c.fillRect(0, H - 3, W, 3); c.fillStyle = 'rgba(120,80,10,.45)'; for (var x2 = 4; x2 < W; x2 += 16) c.fillRect(x2, 14, 8, 30); }), 4, 1, { emissive: '#3a2a00' });
    var shinden = mat(tex('shinden', 64, 64, function (c, W, H) { c.fillStyle = '#efe8d6'; c.fillRect(0, 0, W, H); c.fillStyle = '#5a3f2c'; for (var x = 0; x < W; x += 16) c.fillRect(x, 0, 3, H); c.fillRect(0, 0, W, 4); c.fillRect(0, 30, W, 2); c.fillStyle = '#c9bea4'; for (var x2 = 5; x2 < W; x2 += 16) for (var y = 34; y < H - 4; y += 6) c.fillRect(x2, y, 9, 1); }), 4, 1);
    var roofM = mat(tex('kokera', 64, 32, function (c, W, H) { c.fillStyle = '#4a3a2e'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(255,255,255,.1)'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1); }), 4, 2);
    blob(g, '#3c8fc4', 0.66, 0.5, 0, 0.08, 0.006, 7);
    blob(g, '#5c9a4a', 0.7, 0.2, 0, -0.5, 0.01, 3);
    [[0.32, 0.3, 0.07], [-0.36, 0.22, 0.06], [0.1, 0.42, 0.045]].forEach(function (q, i) { blob(g, '#6aa850', q[2], q[2] * 0.8, q[0], q[1], 0.012, i + 4); pine(g, q[0], q[1], 0.9); });
    var X = 0.04, Z = -0.18;
    box(g, mat(stoneTex('kinst', '#a7a197', '#8a847a', 12, 6), 3, 1), 0.38, 0.03, 0.3, X, 0, Z);
    box(g, shinden, 0.32, 0.1, 0.25, X, 0.03, Z);
    hip(g, roofM, 0.42, 0.34, 0.035, X, 0.13, Z, 0.7);
    box(g, goldT, 0.28, 0.085, 0.22, X, 0.165, Z);
    box(g, solid('#c79a24', { emissive: '#3a2a00' }), 0.31, 0.012, 0.25, X, 0.2, Z); // balcony rail
    hip(g, roofM, 0.38, 0.31, 0.035, X, 0.25, Z, 0.68);
    box(g, goldT, 0.17, 0.075, 0.17, X, 0.285, Z);
    hip(g, roofM, 0.28, 0.28, 0.085, X, 0.36, Z, 0.08);
    var ph = new T.Mesh(new T.ConeGeometry(0.012, 0.04, 5), solid('#ffd54a', { emissive: '#4a3500' })); ph.position.set(X, 0.465, Z); g.add(ph);
    // fishing pavilion (Sōsei) over the water
    box(g, shinden, 0.08, 0.05, 0.07, X + 0.2, 0.03, Z + 0.08); hip(g, roofM, 0.12, 0.1, 0.03, X + 0.2, 0.08, Z + 0.08, 0.5);
    for (var i = 0; i < 4; i++) cyl(g, solid('#5a3f2c'), 0.004, 0.004, 0.035, X + 0.17 + (i % 2) * 0.06, 0, Z + 0.06 + Math.floor(i / 2) * 0.05, 4);
    for (var j = 0; j < 12; j++) { var a = Math.PI * 1.05 + j / 11 * Math.PI * 0.9, r = 0.6 + hash(j, 3) * 0.08; if (j % 3 === 2) maple(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.1, j % 2 ? '#e0703a' : '#d9532c'); else pine(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.1); }
    return g;
  };

  /* ---------- Atomic Bomb Dome (Hiroshima) ---------- */
  M.custom.genbaku = function () {
    var g = new T.Group();
    var wall = mat(winTex('genwall', '#c9b99a', '#3a3430', 4, 3, { tall: 0.55, band: '#a89878' }), 4, 1), wallS = mat(winTex('genwall2', '#bfae8e', '#3a3430', 3, 3, { tall: 0.55, band: '#a08e70' }), 2, 1);
    var steel = solid('#5a5f66');
    blob(g, '#7cbf5f', 0.7, 0.55, 0, 0, 0.006, 3);
    var river = new T.Mesh(new T.PlaneGeometry(1.5, 0.3), solid('#4a9fd6')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.008, 0.52); g.add(river);
    box(g, solid('#b8b2a6'), 1.5, 0.02, 0.05, 0, 0, 0.36);
    // ruined walls: broken heights along each side
    function ruin(x0, z0, x1, z1, hs, m) { var n = hs.length, dx = (x1 - x0) / n, dz = (z1 - z0) / n, L = Math.hypot(dx, dz), a = Math.atan2(dz, dx); for (var i = 0; i < n; i++) { var b = box(g, m, L + 0.002, hs[i], 0.03, x0 + dx * (i + 0.5), 0, z0 + dz * (i + 0.5)); b.rotation.y = -a; } }
    ruin(-0.4, 0.1, 0.4, 0.1, [0.12, 0.2, 0.26, 0.24, 0.2, 0.14, 0.1, 0.16], wall);
    ruin(-0.4, -0.22, 0.4, -0.22, [0.08, 0.14, 0.22, 0.26, 0.26, 0.18, 0.06, 0.1], wallS);
    ruin(-0.4, -0.22, -0.4, 0.1, [0.06, 0.1, 0.12, 0.14], wallS);
    ruin(0.4, -0.22, 0.4, 0.1, [0.16, 0.12, 0.08, 0.05], wallS);
    // stair tower under the dome
    var tw = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.32, 14, 1, true), mat(winTex('gentow', '#cdbf9f', '#3a3430', 3, 3, { tall: 0.6 }), 4, 1)); tw.material.side = T.DoubleSide; tw.position.set(0, 0.16, -0.02); g.add(tw);
    box(g, solid('#a89878'), 0.24, 0.02, 0.24, 0, 0.32, -0.02);
    for (var i = 0; i < 12; i++) { var rib = new T.Mesh(new T.TorusGeometry(0.1, 0.005, 4, 12, Math.PI), steel); rib.rotation.y = i / 12 * Math.PI; rib.position.set(0, 0.34, -0.02); g.add(rib); }
    [0.03, 0.065].forEach(function (y) { var rr = Math.sqrt(0.01 - y * y), ring = new T.Mesh(new T.TorusGeometry(rr, 0.005, 4, 16), steel); ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.34 + y, -0.02); g.add(ring); });
    for (var k = 0; k < 14; k++) { var r = box(g, solid(k % 2 ? '#a89878' : '#8f8170'), 0.03 + hash(k, 1) * 0.03, 0.015, 0.03, -0.3 + hash(k, 2) * 0.6, 0, -0.18 + hash(k, 3) * 0.24); r.rotation.y = hash(k, 4) * 3; }
    [[-0.55, -0.3], [0.55, -0.3], [-0.6, 0.15], [0.6, 0.12], [-0.2, -0.45], [0.25, -0.45]].forEach(function (q) { maple(g, q[0], q[1], 1.2, '#4f9a4a'); });
    return g;
  };

  /* ---------- Tōdai-ji Great Buddha Hall (Nara) ---------- */
  M.custom.todaiji = function () {
    var g = new T.Group();
    var hall = mat(tex('daibutsu', 64, 64, function (c, W, H) { c.fillStyle = '#f1ead8'; c.fillRect(0, 0, W, H); c.fillStyle = '#6b3f26'; for (var x = 0; x < W; x += 16) c.fillRect(x, 0, 4, H); c.fillRect(0, 0, W, 6); c.fillRect(0, H - 8, W, 8); c.fillStyle = '#4a3020'; for (var x2 = 6; x2 < W; x2 += 16) c.fillRect(x2, 14, 8, 34); }), 7, 1);
    var tile = mat(tex('nkawara', 64, 32, function (c, W, H) { c.fillStyle = '#5a6068'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(0,0,0,.22)'; for (var x = 0; x < W; x += 4) c.fillRect(x, 0, 1.5, H); }), 6, 2);
    var gold = solid('#e2b13a', { emissive: '#3a2a00' });
    blob(g, '#d9d4c6', 0.72, 0.6, 0, 0.05, 0.006, 2);
    box(g, mat(stoneTex('tdst', '#b3ada2', '#958f84', 12, 6), 5, 1), 0.74, 0.03, 0.52, 0, 0, -0.1);
    box(g, hall, 0.66, 0.2, 0.44, 0, 0.03, -0.1);
    hip(g, tile, 0.8, 0.58, 0.05, 0, 0.17, -0.1, 0.82); // skirt roof
    box(g, hall, 0.56, 0.12, 0.36, 0, 0.2, -0.1);
    hip(g, tile, 0.82, 0.6, 0.2, 0, 0.32, -0.1, 0.38);
    box(g, solid('#4a5058'), 0.4, 0.03, 0.04, 0, 0.52, -0.1);
    [-0.2, 0.2].forEach(function (x) { var s = new T.Mesh(new T.ConeGeometry(0.02, 0.07, 5), gold); s.position.set(x, 0.575, -0.1); s.rotation.z = x > 0 ? -0.35 : 0.35; g.add(s); });
    // curved front gable (karahafu) with the window that shows the Buddha's face
    var sh = new T.Shape(); sh.moveTo(-0.13, 0); sh.quadraticCurveTo(-0.07, 0.01, -0.05, 0.05); sh.quadraticCurveTo(0, 0.1, 0.05, 0.05); sh.quadraticCurveTo(0.07, 0.01, 0.13, 0); sh.lineTo(-0.13, 0);
    var kh = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false, curveSegments: 8 }), solid('#f6f0e0')); kh.position.set(0, 0.215, 0.11); g.add(kh);
    var kr = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.056, bevelEnabled: false, curveSegments: 8 }), tile); kr.scale.set(1.08, 1.12, 1); kr.position.set(0, 0.22, 0.108); g.add(kr);
    box(g, solid('#3a2a20'), 0.06, 0.035, 0.005, 0, 0.225, 0.162);
    // bronze lantern and the deer of Nara
    cyl(g, solid('#3f4a42'), 0.03, 0.035, 0.03, 0, 0, 0.3, 8); cyl(g, solid('#55635a'), 0.02, 0.02, 0.06, 0, 0.03, 0.3, 8); cyl(g, solid('#3f4a42'), 0.005, 0.045, 0.03, 0, 0.09, 0.3, 8);
    [[-0.3, 0.32, 0.4], [0.28, 0.36, 2.2], [0.4, 0.2, 3.5], [-0.15, 0.45, 1.2], [0.12, 0.5, 5]].forEach(function (q) { deer(g, q[0], q[1], q[2], 1.2); });
    [[-0.6, -0.3], [0.6, -0.3], [-0.62, 0.2], [0.62, 0.22], [-0.3, -0.5], [0.3, -0.5]].forEach(function (q) { pine(g, q[0], q[1], 1.3); });
    return g;
  };

  /* ---------- Gunkanjima / Hashima (Nagasaki) ---------- */
  M.custom.gunkan = function () {
    var g = new T.Group();
    blob(g, '#3b8fc9', 0.72, 0.4, 0, 0, 0.005, 9);
    var sh = new T.Shape(), pts = [[-0.62, 0], [-0.5, 0.1], [-0.2, 0.15], [0.25, 0.15], [0.52, 0.1], [0.62, 0.0], [0.52, -0.1], [0.25, -0.14], [-0.2, -0.15], [-0.5, -0.1]];
    pts.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); }); sh.lineTo(pts[0][0], pts[0][1]);
    var wall = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: false }), mat(stoneTex('hashw', '#8d8a84', '#6f6c66', 10, 5), 8, 1)); wall.rotation.x = Math.PI / 2; wall.position.y = 0.06; g.add(wall);
    var flats = mat(winTex('hashf', '#a29d93', '#3d3a36', 4, 6, { tall: 0.45, band: '#8a857b' }), 2, 2), flats2 = mat(winTex('hashf2', '#b4ae9f', '#3d3a36', 5, 5, { tall: 0.4 }), 2, 2);
    // the hill in the middle with a lighthouse
    mountain(g, { h: 0.13, pos: [-0.02, 0.0], r: function (t) { return 0.13 * (1 - t) + 0.01; }, bump: 0.25, sx: 1.4, colour: function () { return '#5f8f4a'; } }).position.y = 0.06;
    cyl(g, solid('#ffffff'), 0.012, 0.016, 0.07, -0.02, 0.18, 0, 8); cyl(g, solid('#e8473a'), 0.004, 0.016, 0.02, -0.02, 0.25, 0, 8);
    var B = [[-0.48, 0, 0.12, 0.12, 0.13], [-0.32, 0.07, 0.12, 0.09, 0.2], [-0.32, -0.07, 0.1, 0.09, 0.17], [-0.17, 0.09, 0.08, 0.07, 0.15], [-0.18, -0.09, 0.09, 0.07, 0.12],
      [0.14, 0.09, 0.1, 0.07, 0.16], [0.13, -0.09, 0.1, 0.07, 0.19], [0.28, 0.07, 0.1, 0.1, 0.22], [0.29, -0.07, 0.1, 0.09, 0.14], [0.44, 0.03, 0.1, 0.1, 0.17], [0.44, -0.06, 0.07, 0.06, 0.1], [0.55, 0, 0.05, 0.08, 0.08]];
    B.forEach(function (b, i) { box(g, i % 3 ? flats : flats2, b[2], b[4], b[3], b[0], 0.06, b[1]); box(g, solid('#77736c'), b[2] + 0.004, 0.006, b[3] + 0.004, b[0], 0.06 + b[4], b[1]); });
    cyl(g, solid('#6d6963'), 0.012, 0.014, 0.12, 0.05, 0.06, 0.1, 8); // chimney of the old mine
    box(g, solid('#5a5a5a'), 0.03, 0.06, 0.03, 0.06, 0.06, -0.1);
    return g;
  };

  /* ---------- Tower Bridge (London) ---------- */
  M.custom.towerbridge = function () {
    var g = new T.Group();
    var stone = mat(tex('tbst', 64, 128, function (c, W, H) { c.fillStyle = '#d9cdb4'; c.fillRect(0, 0, W, H); c.fillStyle = '#bfb197'; for (var y = 0; y < H; y += 8) c.fillRect(0, y, W, 1); c.fillStyle = '#3b4252'; [[10, 20], [38, 20], [10, 60], [38, 60], [10, 98], [38, 98]].forEach(function (q) { c.fillRect(q[0], q[1], 16, 24); c.beginPath(); c.arc(q[0] + 8, q[1], 8, Math.PI, 0); c.fill(); }); }), 2, 1);
    var blue = solid('#6fb6d9'), white = solid('#f0f3f6'), slate = solid('#5d6670');
    var river = new T.Mesh(new T.PlaneGeometry(1.6, 0.6), solid('#4a8fc0')); river.rotation.x = -Math.PI / 2; river.position.y = 0.006; g.add(river);
    [-0.66, 0.66].forEach(function (x) { blob(g, '#9aa08e', 0.16, 0.3, x, 0, 0.03, x > 0 ? 3 : 7); });
    [-0.22, 0.22].forEach(function (x) {
      box(g, solid('#9b9282'), 0.18, 0.06, 0.2, x, 0, 0);
      box(g, stone, 0.13, 0.46, 0.15, x, 0.06, 0);
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { cyl(g, stone, 0.022, 0.024, 0.5, x + q[0] * 0.065, 0.06, q[1] * 0.075, 8); cyl(g, slate, 0, 0.026, 0.08, x + q[0] * 0.065, 0.56, q[1] * 0.075, 8); });
      var rf = new T.Mesh(new T.ConeGeometry(0.1, 0.12, 4), slate); rf.rotation.y = Math.PI / 4; rf.scale.z = 1.15; rf.position.set(x, 0.58, 0); g.add(rf);
      cyl(g, solid('#d8ad4c'), 0.002, 0.004, 0.05, x, 0.64, 0, 4);
    });
    // high walkways and the road deck
    [0.045, -0.045].forEach(function (z) { box(g, blue, 0.32, 0.05, 0.03, 0, 0.44, z); box(g, white, 0.32, 0.006, 0.032, 0, 0.465, z); });
    box(g, solid('#3f4a5a'), 1.3, 0.025, 0.11, 0, 0.12, 0); box(g, blue, 0.32, 0.02, 0.112, 0, 0.1, 0);
    // side spans hang from curved chains
    [-1, 1].forEach(function (s) { [0.05, -0.05].forEach(function (z) {
      var c = new T.QuadraticBezierCurve3(new T.Vector3(s * 0.28, 0.42, z), new T.Vector3(s * 0.45, 0.14, z), new T.Vector3(s * 0.62, 0.2, z));
      g.add(new T.Mesh(new T.TubeGeometry(c, 12, 0.008, 4), blue));
      for (var i = 1; i < 6; i++) { var p = c.getPoint(i / 6); box(g, blue, 0.004, Math.max(0.005, p.y - 0.14), 0.004, p.x, 0.14, z); }
    }); });
    return g;
  };

  /* ---------- The White House ---------- */
  M.custom.whitehouse = function () {
    var g = new T.Group(), white = mat(winTex('whw', '#f7f6f1', '#5b6670', 6, 2, { tall: 0.5 }), 5, 1), plain = solid('#f4f3ee');
    blob(g, '#6cbf55', 0.74, 0.6, 0, 0.05, 0.006, 4);
    var drive = new T.Mesh(new T.RingGeometry(0.2, 0.24, 24, 1, Math.PI, Math.PI), solid('#e2dccf', { side: T.DoubleSide })); drive.rotation.x = -Math.PI / 2; drive.position.set(0, 0.008, -0.2); g.add(drive);
    box(g, white, 0.62, 0.17, 0.24, 0, 0, -0.08);
    box(g, plain, 0.64, 0.02, 0.26, 0, 0.17, -0.08);
    for (var i = 0; i < 20; i++) cyl(g, plain, 0.004, 0.004, 0.02, -0.31 + i * 0.0326, 0.19, 0.05, 4);
    var rf = new T.Mesh(new T.CylinderGeometry(0.15, 0.27, 0.05, 4), solid('#d9dde0')); rf.rotation.y = Math.PI / 4; rf.scale.z = 0.4; rf.position.set(0, 0.215, -0.08); g.add(rf);
    // south portico: a half circle of columns
    for (var k = 0; k < 7; k++) { var a = k / 6 * Math.PI; cyl(g, plain, 0.011, 0.012, 0.16, Math.cos(a) * 0.09, 0.0, 0.04 + Math.sin(a) * 0.08, 8); }
    var top = new T.Mesh(new T.CylinderGeometry(0.11, 0.11, 0.03, 16, 1, false, -Math.PI / 2, Math.PI), plain); top.position.set(0, 0.175, 0.04); g.add(top);
    box(g, plain, 0.08, 0.012, 0.01, 0, 0.0, 0.18);
    [-0.42, 0.42].forEach(function (x) { box(g, white, 0.2, 0.09, 0.14, x, 0, -0.1); });
    cyl(g, solid('#bfc5c9'), 0.003, 0.003, 0.14, 0, 0.23, -0.08, 4);
    var fl = new T.Mesh(new T.BoxGeometry(0.06, 0.035, 0.002), mat(tex('usflag', 32, 16, function (c, W, H) { for (var i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#fff' : '#c8313a'; c.fillRect(0, i * H / 7, W, H / 7 + 1); } c.fillStyle = '#2b3a7a'; c.fillRect(0, 0, 13, 9); }), 1, 1)); fl.position.set(0.03, 0.35, -0.08); g.add(fl);
    cyl(g, solid('#c9d6de'), 0.05, 0.055, 0.02, 0, 0, 0.36, 16); cyl(g, solid('#bfe6ff'), 0.008, 0.012, 0.05, 0, 0.02, 0.36, 6);
    [[-0.6, 0.3], [0.6, 0.3], [-0.62, -0.3], [0.62, -0.3], [-0.35, 0.45], [0.35, 0.45]].forEach(function (q) { maple(g, q[0], q[1], 1.3, '#3f8f45'); });
    return g;
  };

  /* ---------- Abu Simbel ---------- */
  M.custom.abusimbel = function () {
    var g = new T.Group(), sand = '#d8b77c', rock = solid('#c99f62'), rockD = solid('#b48a50');
    blob(g, '#e3c68e', 0.72, 0.58, 0, -0.05, 0.006, 2);
    blob(g, '#3f9fd0', 0.6, 0.2, 0.1, 0.5, 0.008, 5);
    mountain(g, { h: 0.5, pos: [0, -0.32], r: function (t) { return 0.62 * (1 - t) + 0.05; }, bump: 0.3, sx: 1.2, sz: 0.55, colour: function (x, y) { return y > 0.3 ? '#c29a5c' : (noise(x * 12, y * 12) > 0.5 ? '#cfa66a' : '#be955a'); } });
    var face = new T.Mesh(new T.CylinderGeometry(0.33, 0.44, 0.4, 4), mat(stoneTex('absf', '#d3ad70', '#b8935a', 16, 8), 4, 2)); face.rotation.y = Math.PI / 4; face.scale.z = 0.5; face.position.set(0, 0.2, -0.16); g.add(face);
    box(g, solid('#2a201a'), 0.06, 0.12, 0.02, 0, 0, 0.07); // door
    for (var b = 0; b < 12; b++) { var bb = new T.Mesh(new T.SphereGeometry(0.012, 6, 4), rockD); bb.position.set(-0.24 + b * 0.044, 0.41, -0.02); bb.scale.y = 1.3; g.add(bb); } // row of baboons
    [-0.28, -0.12, 0.12, 0.28].forEach(function (x, i) {
      box(g, rockD, 0.11, 0.04, 0.1, x, 0, 0.06);                     // throne front
      box(g, rock, 0.03, 0.09, 0.03, x - 0.025, 0.04, 0.09); box(g, rock, 0.03, 0.09, 0.03, x + 0.025, 0.04, 0.09); // legs
      box(g, rock, 0.09, 0.06, 0.06, x, 0.12, 0.05);                  // lap
      box(g, rock, 0.08, 0.11, 0.05, x, 0.17, 0.02);                  // body
      if (i === 1) { box(g, rockD, 0.05, 0.06, 0.05, x, 0.0, 0.16); return; } // the broken one
      box(g, rock, 0.05, 0.05, 0.045, x, 0.28, 0.03);                 // head
      var nem = new T.Mesh(new T.ConeGeometry(0.045, 0.07, 4), solid('#d8b77c')); nem.position.set(x, 0.3, 0.02); nem.rotation.y = Math.PI / 4; nem.scale.z = 0.7; g.add(nem);
      cyl(g, solid('#e3c68e'), 0.012, 0.02, 0.05, x, 0.33, 0.025, 6);   // crown
      box(g, solid('#2a201a'), 0.03, 0.004, 0.002, x, 0.3, 0.054);      // eyes
    });
    [[-0.6, 0.3], [0.62, 0.25]].forEach(function (q) { palm(g, q[0], q[1], 1.3); });
    return g;
  };

  /* ---------- Mont-Saint-Michel ---------- */
  M.custom.stmichel = function () {
    var g = new T.Group(), stone = mat(stoneTex('msmst', '#b9b0a0', '#9a9182', 12, 6), 3, 2), slate = solid('#4f5866'), cream = solid('#e6dccb');
    blob(g, '#d9c9a2', 0.74, 0.62, 0, 0, 0.005, 6);
    blob(g, '#5fa3cf', 0.62, 0.32, -0.2, 0.25, 0.008, 2);
    box(g, solid('#b0a68e'), 0.04, 0.012, 0.5, 0.05, 0, 0.52); // causeway
    mountain(g, { h: 0.34, r: function (t) { return 0.36 * Math.pow(1 - t, 0.8) + 0.03; }, bump: 0.25, colour: function (x, y, z) { return y < 0.06 ? '#8f8778' : (noise(x * 15, z * 15) > 0.62 ? '#5f8f4a' : '#9a917f'); } });
    var rampart = new T.Mesh(new T.CylinderGeometry(0.38, 0.4, 0.07, 18, 1, true, -0.4, Math.PI * 1.6), stone); rampart.material.side = T.DoubleSide; rampart.position.y = 0.035; g.add(rampart);
    for (var k = 0; k < 6; k++) { var a = -0.4 + k / 5 * Math.PI * 1.6 + Math.PI / 2; cyl(g, stone, 0.03, 0.032, 0.1, Math.sin(a) * 0.39, 0, Math.cos(a) * 0.39, 8); cyl(g, slate, 0, 0.034, 0.04, Math.sin(a) * 0.39, 0.1, Math.cos(a) * 0.39, 8); }
    // village houses climbing the rock
    for (var i = 0; i < 22; i++) {
      var t = i / 22, a2 = t * Math.PI * 1.3 + 0.6, y = 0.03 + t * 0.2, r = 0.36 * Math.pow(1 - (y + 0.03) / 0.34, 0.8) + 0.03, x = Math.sin(a2) * r, z = Math.cos(a2) * r, w = 0.05 + hash(i, 1) * 0.03;
      var hgt = 0.05 + hash(i, 2) * 0.03, b = box(g, i % 3 ? cream : solid('#d8cbb3'), w, hgt, 0.045, x, y, z); b.rotation.y = a2;
      ridge(g, slate, w + 0.01, 0.04, 0.05, x, y + hgt, z, a2);
    }
    // the abbey on top
    box(g, stone, 0.26, 0.12, 0.1, 0, 0.3, -0.02); ridge(g, slate, 0.12, 0.06, 0.28, 0, 0.42, -0.02, Math.PI / 2);
    box(g, stone, 0.18, 0.08, 0.16, -0.06, 0.26, 0.06);
    box(g, stone, 0.07, 0.14, 0.07, 0.02, 0.42, -0.02);
    cyl(g, slate, 0, 0.045, 0.2, 0.02, 0.56, -0.02, 8);
    var st = new T.Mesh(new T.SphereGeometry(0.01, 6, 5), solid('#ffd54a', { emissive: '#4a3500' })); st.position.set(0.02, 0.77, -0.02); g.add(st);
    return g;
  };

  /* ---------- Ha Long Bay ---------- */
  M.custom.halong = function () {
    var g = new T.Group();
    blob(g, '#3fa79a', 0.74, 0.62, 0, 0, 0.006, 8);
    var K2 = [[-0.35, -0.2, 0.42, 0.13], [-0.1, -0.35, 0.3, 0.1], [0.2, -0.25, 0.46, 0.14], [0.42, 0.05, 0.28, 0.1], [-0.45, 0.2, 0.25, 0.09], [0.05, 0.05, 0.2, 0.08], [0.3, 0.35, 0.18, 0.07], [-0.2, 0.42, 0.14, 0.06], [-0.55, -0.4, 0.2, 0.08]];
    K2.forEach(function (k, i) { mountain(g, { h: k[2], pos: [k[0], k[1]], r: function (t) { return k[3] * (t < 0.85 ? 1 - t * 0.35 : (1 - t) * 4.3 * 0.65) + 0.004; }, bump: 0.35, seed: i * 3, colour: function (x, y) { return y > k[2] * 0.55 || noise(x * 20, y * 20) > 0.6 ? '#3f8a48' : (y < 0.02 ? '#6f6a60' : '#9a9a8c'); } }); });
    // a junk boat with red sails
    var b = new T.Group(); box(b, solid('#7a4a2a'), 0.05, 0.03, 0.16, 0, 0, 0); box(b, solid('#5a3420'), 0.04, 0.03, 0.06, 0, 0.03, -0.04);
    [[0.03, 0.12], [-0.03, 0.09]].forEach(function (q) { cyl(b, solid('#4a3020'), 0.002, 0.002, q[1] + 0.03, 0, 0.03, q[0], 4); var s = new T.Mesh(new T.PlaneGeometry(0.07, q[1]), solid('#c0442e', { side: T.DoubleSide })); s.position.set(0, 0.045 + q[1] / 2, q[0]); s.rotation.y = Math.PI / 2; b.add(s); for (var j = 1; j < 4; j++) box(b, solid('#7a2a1a'), 0.002, 0.002, 0.07, 0, 0.045 + j * q[1] / 4, q[0]).rotation.x = 0; });
    b.position.set(0.15, 0.006, 0.3); b.rotation.y = 0.6; g.add(b);
    return g;
  };

  /* ---------- Chocolate Hills (Bohol) ---------- */
  M.custom.chocolate = function () {
    var g = new T.Group();
    blob(g, '#7fb84f', 0.74, 0.62, 0, 0, 0.006, 5);
    for (var i = 0; i < 19; i++) {
      var a = hash(i, 1) * D2, r = Math.sqrt(hash(i, 2)) * 0.56, x = Math.cos(a) * r, z = Math.sin(a) * r * 0.9, s = 0.07 + hash(i, 3) * 0.05;
      var geo = new T.SphereGeometry(s, 12, 7, 0, D2, 0, Math.PI / 2); geo.scale(1, 0.95 + hash(i, 4) * 0.3, 1);
      var hm = new T.Mesh(paintVerts(geo, function (px, py) { return py < s * 0.15 ? '#6f9a3f' : (py < s * 0.35 ? '#8a7a3a' : (noise(px * 40, py * 40) > 0.5 ? '#8b5a2b' : '#7a4f26')); }), vcMat); hm.position.set(x, 0.004, z); g.add(hm);
    }
    for (var j = 0; j < 9; j++) { var a2 = j / 9 * D2 + 0.3, r2 = 0.6 + hash(j, 7) * 0.08; palm(g, Math.cos(a2) * r2, Math.sin(a2) * r2 * 0.85, 1.2); }
    return g;
  };

  /* ---------- Maasai Mara (savanna and a Maasai village) ---------- */
  M.custom.maasai = function () {
    var g = new T.Group();
    blob(g, '#c9b866', 0.74, 0.62, 0, 0, 0.006, 4);
    blob(g, '#a9a858', 0.3, 0.2, 0.35, -0.3, 0.008, 9);
    var fence = new T.Mesh(new T.TorusGeometry(0.27, 0.018, 4, 28), solid('#6b5a3a', { flatShading: true })); fence.rotation.x = Math.PI / 2; fence.position.set(-0.12, 0.018, 0.05); fence.scale.z = 1.5; g.add(fence);
    for (var i = 0; i < 9; i++) { var a = i / 9 * D2, x = -0.12 + Math.cos(a) * 0.18, z = 0.05 + Math.sin(a) * 0.18, h = new T.Mesh(new T.SphereGeometry(0.06, 9, 6, 0, D2, 0, Math.PI / 2), solid(i % 2 ? '#c09a6a' : '#b08a5e', { flatShading: true })); h.scale.set(1, 0.8, 1.35); h.position.set(x, 0, z); h.rotation.y = -a; g.add(h); box(g, solid('#3a2a1e'), 0.02, 0.025, 0.004, x - Math.cos(a) * 0.045, 0, z - Math.sin(a) * 0.045).rotation.y = -a + Math.PI / 2; }
    [[-0.12, 0.05, '#c8312e'], [-0.06, 0.0, '#2b6fd0'], [-0.18, 0.1, '#c8312e'], [0.12, 0.2, '#d94a3a']].forEach(function (q) { person(g, q[0], q[1], 1.3, q[2]); });
    [[0.4, 0.15], [0.3, 0.42], [-0.5, -0.35], [0.55, -0.1], [-0.55, 0.35], [0.05, -0.45]].forEach(function (q, i) { acacia(g, q[0], q[1], 1.6 + (i % 2) * 0.4); });
    return g;
  };

  /* ---------- Santa Claus Village (Rovaniemi) ---------- */
  M.custom.santa = function () {
    var g = new T.Group(), logs = mat(tex('logs', 64, 64, function (c, W, H) { for (var y = 0; y < H; y += 8) { var gr = c.createLinearGradient(0, y, 0, y + 8); gr.addColorStop(0, '#9a6a3e'); gr.addColorStop(0.5, '#b9824c'); gr.addColorStop(1, '#6f4a2a'); c.fillStyle = gr; c.fillRect(0, y, W, 8); } c.fillStyle = '#ffe9a8'; c.fillRect(20, 22, 14, 14); c.fillStyle = '#6f4a2a'; c.fillRect(26, 22, 2, 14); }), 3, 1);
    var roofR = solid('#a8322e'), snow = solid('#f6f9fc');
    blob(g, '#eef4f8', 0.74, 0.62, 0, 0, 0.008, 3);
    function cabin(x, z, w, d, h, ry) {
      var c = new T.Group(); box(c, logs, w, h, d, 0, 0, 0);
      var p = prism(c, roofR, w + 0.03, h * 0.9, d + 0.03, 0, h, 0); var ps = prism(c, snow, w + 0.035, h * 0.35, d + 0.035, 0, h + h * 0.56, 0);
      box(c, solid('#6a4a3a'), 0.025, 0.08, 0.025, w * 0.25, h, -d * 0.2); c.position.set(x, 0, z); c.rotation.y = ry || 0; g.add(c);
    }
    cabin(-0.05, -0.12, 0.38, 0.22, 0.13, 0); cabin(0.33, 0.12, 0.16, 0.14, 0.08, -0.4); cabin(-0.38, 0.18, 0.14, 0.12, 0.08, 0.4);
    // the Arctic Circle line on the ground
    box(g, solid('#2b6fd0'), 1.2, 0.006, 0.02, 0, 0.008, 0.3); box(g, solid('#ffffff'), 1.2, 0.007, 0.006, 0, 0.008, 0.3);
    [-0.5, 0.5].forEach(function (x) { cyl(g, solid('#e8e8ee'), 0.008, 0.008, 0.1, x, 0, 0.3, 6); });
    // Santa and a reindeer
    cyl(g, solid('#d22f2a'), 0.018, 0.03, 0.07, 0.1, 0, 0.18, 8); var bd = new T.Mesh(new T.SphereGeometry(0.018, 8, 6), snow); bd.position.set(0.1, 0.075, 0.19); g.add(bd); var ht = new T.Mesh(new T.ConeGeometry(0.016, 0.035, 8), solid('#d22f2a')); ht.position.set(0.1, 0.1, 0.18); g.add(ht);
    var rd = new T.Group(), brn = solid('#7a5a3e'); box(rd, brn, 0.03, 0.025, 0.07, 0, 0.04, 0); [[0.01, 0.025], [-0.01, 0.025], [0.01, -0.025], [-0.01, -0.025]].forEach(function (q) { box(rd, brn, 0.007, 0.04, 0.007, q[0], 0, q[1]); }); box(rd, brn, 0.014, 0.035, 0.014, 0, 0.06, 0.03); box(rd, brn, 0.016, 0.016, 0.026, 0, 0.09, 0.04); [0.01, -0.01].forEach(function (x) { box(rd, solid('#d8c8a8'), 0.003, 0.03, 0.003, x, 0.105, 0.035).rotation.z = x * 30; });
    rd.position.set(0.22, 0, 0.2); rd.rotation.y = -0.8; g.add(rd);
    for (var i = 0; i < 16; i++) { var a = i / 16 * D2, r = 0.58 + hash(i, 2) * 0.1; snowTree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.3 + hash(i, 4) * 0.5); }
    return g;
  };

  /* ---------- Milford Sound (Mitre Peak) ---------- */
  M.custom.milford = function () {
    var g = new T.Group();
    blob(g, '#2f6f8f', 0.32, 0.72, 0.05, 0, 0.006, 4);
    function col(x, y) { return y > 0.5 ? '#f4f6f8' : y > 0.3 ? '#7f8a86' : (noise(x * 14, y * 14) > 0.45 ? '#3f7a44' : '#4f8a4a'); }
    mountain(g, { h: 0.82, pos: [-0.3, -0.05], r: function (t) { return 0.26 * Math.pow(1 - t, 1.2) + 0.008; }, bump: 0.35, sz: 1.3, colour: col });
    mountain(g, { h: 0.5, pos: [0.38, -0.25], r: function (t) { return 0.28 * (1 - t) + 0.02; }, bump: 0.3, sz: 1.2, colour: col, seed: 4 });
    mountain(g, { h: 0.35, pos: [0.4, 0.35], r: function (t) { return 0.24 * (1 - t) + 0.02; }, bump: 0.3, colour: col, seed: 9 });
    var fall = new T.Mesh(new T.PlaneGeometry(0.03, 0.3), solid('#eaf6ff', { side: T.DoubleSide })); fall.position.set(0.21, 0.15, -0.05); fall.rotation.y = -1.2; g.add(fall);
    var sp = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#ffffff')); sp.scale.y = 0.4; sp.position.set(0.18, 0.006, -0.03); g.add(sp);
    var boat = new T.Group(); box(boat, solid('#ffffff'), 0.04, 0.025, 0.12, 0, 0, 0); box(boat, solid('#2b6fd0'), 0.035, 0.025, 0.05, 0, 0.025, -0.01); boat.position.set(0.04, 0.006, 0.3); boat.rotation.y = 0.3; g.add(boat);
    return g;
  };
})();
