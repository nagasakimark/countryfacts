/* Detailed landmarks, batch 15 (Japan): Tokyo Tower, Osaka Castle, Fushimi Inari, Kiyomizu-dera,
   Shuri Castle, Great Buddha of Kamakura, Shirakawa-go, Ōura Church (Nagasaki). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function pine(g, x, z, s) { cyl(g, solid('#6b4a32'), 0.006 * s, 0.01 * s, 0.07 * s, x, 0, z, 5); for (var i = 0; i < 3; i++) { var c = new T.Mesh(new T.SphereGeometry(0.035 * s, 7, 4), solid(i % 2 ? '#2f6b3a' : '#3a7a44', { flatShading: true })); c.scale.y = 0.45; c.position.set(x + (i - 1) * 0.025 * s, 0.07 * s + i * 0.018 * s, z); g.add(c); } }
  function maple(g, x, z, s, col) { cyl(g, solid('#6b4a32'), 0.005 * s, 0.008 * s, 0.05 * s, x, 0, z, 5); var c = new T.Mesh(new T.IcosahedronGeometry(0.04 * s, 0), solid(col || '#d9532c', { flatShading: true })); c.position.set(x, 0.075 * s, z); g.add(c); }
  function torii(g, x, y, z, s, ry, col) { var o = new T.Group(), r = solid(col || '#e0402a'), b = solid('#2a2a2e'); [-1, 1].forEach(function (k) { cyl(o, r, 0.006, 0.007, 0.09, k * 0.035, 0, 0, 8); cyl(o, b, 0.008, 0.008, 0.008, k * 0.035, 0, 0, 8); }); box(o, r, 0.09, 0.008, 0.01, 0, 0.068, 0); box(o, b, 0.105, 0.01, 0.014, 0, 0.088, 0); o.position.set(x, y, z); o.rotation.y = ry || 0; o.scale.setScalar(s); g.add(o); return o; }

  /* ---------- Tokyo Tower ---------- */
  M.custom.tokyotower = function () {
    var g = new T.Group();
    var lat = mat(tex('ttlat', 64, 128, function (c, W, H) { c.clearRect(0, 0, W, H); for (var b = 0; b < 8; b++) { c.strokeStyle = b % 2 ? '#f4f4f2' : '#e8502a'; c.lineWidth = 3; var y0 = b * 16; c.beginPath(); c.moveTo(0, y0); c.lineTo(W, y0 + 16); c.moveTo(W, y0); c.lineTo(0, y0 + 16); c.stroke(); c.fillStyle = c.strokeStyle; c.fillRect(0, y0, W, 2.5); c.fillRect(0, y0, 4, 16); c.fillRect(W - 4, y0, 4, 16); } }), 1, 3, { transparent: true, alphaTest: 0.4, side: T.DoubleSide });
    blob(g, '#7aa858', 0.6, 0.5, 0, 0, 0.006, 3);
    var leg = new T.Mesh(new T.CylinderGeometry(0.05, 0.3, 0.42, 4, 1, true), lat); leg.rotation.y = Math.PI / 4; leg.position.y = 0.21; g.add(leg);
    for (var k = 0; k < 4; k++) { var a = k / 4 * D2 + Math.PI / 4, ar = new T.Mesh(new T.TorusGeometry(0.09, 0.008, 4, 10, Math.PI), solid('#e8502a')); ar.position.set(Math.cos(a) * 0.15, 0.0, Math.sin(a) * 0.15); ar.rotation.y = -a + Math.PI / 2; g.add(ar); }
    box(g, mat(winTex('ttdeck', '#e8e8ec', '#4a6a8a', 6, 1, { tall: 0.6 }), 3, 1), 0.13, 0.05, 0.13, 0, 0.42, 0);
    var up = new T.Mesh(new T.CylinderGeometry(0.012, 0.05, 0.3, 4, 1, true), lat); up.rotation.y = Math.PI / 4; up.position.y = 0.62; g.add(up);
    box(g, solid('#e8e8ec'), 0.05, 0.03, 0.05, 0, 0.7, 0);
    cyl(g, solid('#e8502a'), 0.003, 0.008, 0.18, 0, 0.73, 0, 6);
    box(g, mat(winTex('ttfoot', '#d8d4cc', '#4a5a6a', 6, 3, { tall: 0.5 }), 2, 1), 0.3, 0.06, 0.18, 0, 0, 0.28);
    [[-0.45, 0.3], [0.45, 0.3], [-0.45, -0.3], [0.45, -0.3]].forEach(function (q) { tree(g, q[0], q[1], 1.2, '#4f8a3a'); });
    return g;
  };

  /* ---------- Osaka Castle ---------- */
  M.custom.osakajo = function () {
    var g = new T.Group(), white = mat(winTex('oswin', '#f6f4ee', '#3a3f46', 4, 2, { tall: 0.3 }), 3, 1), green = mat(tex('osroof', 64, 32, function (c, W, H) { c.fillStyle = '#5fa890'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(0,0,0,.15)'; for (var x = 0; x < W; x += 4) c.fillRect(x, 0, 1, H); }), 4, 2), gold = solid('#e8b52a', { emissive: '#3a2a00' });
    var stone = mat(stoneTex('osst', '#a9a59a', '#86827a', 14, 7), 4, 2);
    blob(g, '#4a8fb8', 0.74, 0.62, 0, 0, 0.006, 4);
    blob(g, '#6fa850', 0.6, 0.5, 0, -0.02, 0.01, 2);
    var base = new T.Mesh(new T.CylinderGeometry(0.22, 0.27, 0.16, 4), stone); base.rotation.y = Math.PI / 4; base.position.y = 0.08; g.add(base);
    var y = 0.16, w = 0.3, d = 0.26;
    for (var f = 0; f < 5; f++) {
      box(g, f % 2 ? white : mat(winTex('oswin2', '#f6f4ee', '#3a3f46', 5, 1, { tall: 0.4 }), 3, 1), w, 0.07, d, 0, y, 0); y += 0.07;
      hip(g, green, w * 1.25, d * 1.25, 0.035, 0, y, 0, 0.72); box(g, gold, w * 0.95, 0.006, d * 0.95, 0, y - 0.01, 0);
      if (f % 2 === 0) { var gb = new T.Mesh(new T.CylinderGeometry(w * 0.2, w * 0.2, 0.04, 3), white); gb.rotation.set(Math.PI / 2, 0, Math.PI / 2); gb.position.set(0, y + 0.03, d / 2 + 0.01); g.add(gb); }
      y += 0.025; w *= 0.84; d *= 0.84;
    }
    hip(g, green, w * 1.4, d * 1.4, 0.07, 0, y, 0, 0.1);
    [-1, 1].forEach(function (k) { var sh = new T.Mesh(new T.ConeGeometry(0.012, 0.035, 5), gold); sh.position.set(k * w * 0.4, y + 0.06, 0); g.add(sh); });
    for (var j = 0; j < 10; j++) { var a = j / 10 * D2; tree(g, Math.cos(a) * 0.5, Math.sin(a) * 0.42, 1.0, j % 3 ? '#4f8a3a' : '#f2a7c3'); }
    return g;
  };

  /* ---------- Fushimi Inari Taisha ---------- */
  M.custom.fushimi = function () {
    var g = new T.Group(), red = solid('#e0402a');
    blob(g, '#4f8a3a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.4, pos: [0.0, -0.3], r: function (t) { return 0.62 * (1 - t) + 0.04; }, bump: 0.25, sx: 1.2, sz: 0.65, colour: function (x, y, z) { return noise(x * 12, z * 12) > 0.5 ? '#2f6b3a' : '#3f7a44'; } });
    // the main hall at the foot
    box(g, red, 0.2, 0.07, 0.1, 0, 0, 0.32); box(g, solid('#f6f2ea'), 0.18, 0.04, 0.08, 0, 0.0, 0.32); hip(g, solid('#3a3a40'), 0.28, 0.16, 0.05, 0, 0.07, 0.32, 0.4);
    [-0.12, 0.12].forEach(function (x) { box(g, solid('#efe8d8'), 0.02, 0.03, 0.02, x, 0, 0.42); var f = new T.Mesh(new T.ConeGeometry(0.008, 0.03, 4), solid('#f6f2ea')); f.position.set(x, 0.045, 0.42); g.add(f); }); // fox guardians
    // the tunnel of thousands of torii winding up the hill
    var pts = []; for (var i = 0; i <= 30; i++) { var t = i / 30; pts.push(new T.Vector3(Math.sin(t * 5) * 0.2 + t * 0.05, 0, 0.24 - t * 0.55)); }
    var c = new T.CatmullRomCurve3(pts);
    for (var k = 0; k < 44; k++) { var t2 = k / 43, p = c.getPoint(t2), tg = c.getTangent(t2), hy = 0.4 * Math.max(0, 1 - Math.pow(Math.hypot(p.x / 1.2, (p.z + 0.3) / 0.65) / 0.62, 1)) ; torii(g, p.x, Math.max(0, Math.min(0.4, hy)) * 0.95, p.z, 1.0, Math.atan2(tg.x, tg.z) + Math.PI / 2); }
    torii(g, 0, 0, 0.47, 1.8);
    return g;
  };

  /* ---------- Kiyomizu-dera ---------- */
  M.custom.kiyomizu = function () {
    var g = new T.Group(), wood = solid('#8a6a4a'), red = solid('#d8452e'), roof = mat(tex('kiyor', 64, 32, function (c, W, H) { c.fillStyle = '#5a4a3a'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(255,255,255,.1)'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1); }), 4, 2);
    blob(g, '#5f9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.3, pos: [0, -0.4], r: function (t) { return 0.6 * (1 - t) + 0.05; }, bump: 0.2, sx: 1.2, sz: 0.5, colour: function (x, y, z) { return noise(x * 12, z * 12) > 0.5 ? '#3f7a44' : '#4f8a4a'; } });
    var Y = 0.2;
    // the famous stage on a grid of tall wooden pillars
    for (var i = 0; i < 5; i++) for (var j = 0; j < 3; j++) cyl(g, wood, 0.006, 0.006, Y, -0.16 + i * 0.08, 0, 0.02 + j * 0.06, 6);
    for (var b = 0; b < 3; b++) box(g, wood, 0.34, 0.008, 0.008, 0, 0.05 + b * 0.05, 0.14);
    box(g, solid('#b89a6a'), 0.36, 0.012, 0.16, 0, Y, 0.08);
    // the main hall with its huge cypress-bark roof
    box(g, mat(winTex('kiyw', '#f2ece0', '#8a4a2a', 6, 1, { tall: 0.8 }), 3, 1), 0.34, 0.08, 0.16, 0, Y, -0.08);
    hip(g, roof, 0.46, 0.3, 0.1, 0, Y + 0.08, -0.06, 0.3);
    // the red three-storey pagoda
    var px = 0.36, pz = -0.15, py = 0.12; for (var f = 0; f < 3; f++) { box(g, red, 0.06 - f * 0.006, 0.04, 0.06 - f * 0.006, px, py, pz); hip(g, roof, 0.11 - f * 0.01, 0.11 - f * 0.01, 0.02, px, py + 0.04, pz, 0.5); py += 0.06; } cyl(g, solid('#d8ad4c'), 0.002, 0.004, 0.06, px, py, pz, 4);
    box(g, red, 0.12, 0.07, 0.06, -0.38, 0.06, 0.12); hip(g, roof, 0.17, 0.1, 0.04, -0.38, 0.13, 0.12, 0.4); // the gate
    for (var k = 0; k < 14; k++) { var a = Math.PI * (0.05 + k * 0.065), r = 0.58; maple(g, Math.cos(a) * r, 0.05 + Math.sin(a) * 0.45 * (k % 2 ? 1 : 0.85), 1.2, k % 3 ? '#d9532c' : '#f2a03a'); }
    return g;
  };

  /* ---------- Shuri Castle ---------- */
  M.custom.shuri = function () {
    var g = new T.Group(), red = solid('#c83a2a'), tile = mat(tex('shurir', 64, 32, function (c, W, H) { c.fillStyle = '#b84a32'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(255,255,255,.18)'; for (var x = 0; x < W; x += 4) c.fillRect(x, 0, 1.5, H); }), 4, 2), gold = solid('#e8b52a', { emissive: '#3a2a00' });
    var stone = mat(stoneTex('shst', '#d8ccb0', '#bcae90', 10, 5), 8, 1);
    blob(g, '#6aa850', 0.74, 0.62, 0, 0, 0.006, 3);
    // curved limestone walls
    var w = new T.Mesh(new T.CylinderGeometry(0.5, 0.52, 0.08, 28, 1, true, Math.PI * 0.3, Math.PI * 1.4), stone); w.material.side = T.DoubleSide; w.scale.z = 0.8; w.position.y = 0.04; g.add(w);
    // the striped courtyard
    for (var s = 0; s < 7; s++) box(g, solid(s % 2 ? '#c9a07a' : '#f2ece0'), 0.06, 0.004, 0.32, -0.18 + s * 0.06, 0.006, 0.1);
    // the main hall (Seiden)
    box(g, red, 0.42, 0.14, 0.2, 0, 0.006, -0.17);
    for (var c = 0; c < 6; c++) cyl(g, solid('#a82a1e'), 0.008, 0.008, 0.12, -0.17 + c * 0.068, 0.006, -0.065, 6);
    hip(g, tile, 0.52, 0.28, 0.05, 0, 0.146, -0.17, 0.75);
    box(g, red, 0.34, 0.06, 0.16, 0, 0.196, -0.17); hip(g, tile, 0.44, 0.24, 0.09, 0, 0.256, -0.17, 0.3);
    [-0.12, 0.12].forEach(function (x) { var dr = new T.Mesh(new T.ConeGeometry(0.01, 0.04, 5), gold); dr.position.set(x, 0.36, -0.17); g.add(dr); });
    var sh = new T.Shape(); sh.moveTo(-0.1, 0); sh.quadraticCurveTo(-0.05, 0.01, -0.03, 0.05); sh.quadraticCurveTo(0, 0.09, 0.03, 0.05); sh.quadraticCurveTo(0.05, 0.01, 0.1, 0); sh.lineTo(-0.1, 0);
    var kh = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: false }), tile); kh.position.set(0, 0.14, -0.07); g.add(kh);
    box(g, gold, 0.06, 0.03, 0.004, 0, 0.17, -0.028);
    // the Shureimon gate
    box(g, red, 0.12, 0.06, 0.04, 0, 0.0, 0.42); hip(g, tile, 0.16, 0.07, 0.03, 0, 0.06, 0.42, 0.5); hip(g, tile, 0.12, 0.05, 0.03, 0, 0.09, 0.42, 0.4);
    [[-0.5, 0.35], [0.5, 0.35], [0.55, -0.3], [-0.55, -0.3]].forEach(function (q) { tree(g, q[0], q[1], 1.2, '#3f8f45'); });
    return g;
  };

  /* ---------- Great Buddha of Kamakura ---------- */
  M.custom.kamakura = function () {
    var g = new T.Group(), bronze = solid('#5f8a7a', { flatShading: true }), bronzeD = solid('#4a7064');
    blob(g, '#d8d2c2', 0.62, 0.52, 0, 0.05, 0.006, 2);
    box(g, mat(stoneTex('kmst', '#a9a59a', '#86827a', 12, 6), 3, 1), 0.44, 0.06, 0.36, 0, 0.006, 0);
    var lotus = lathe([[0.18, 0], [0.2, 0.02], [0.17, 0.04], [0, 0.04]], 16, bronzeD); lotus.position.y = 0.066; g.add(lotus);
    // crossed legs, body, hands in the lap
    var legs = new T.Mesh(new T.SphereGeometry(0.15, 14, 8), bronze); legs.scale.set(1.1, 0.35, 0.75); legs.position.set(0, 0.13, 0.02); g.add(legs);
    var body = lathe([[0.12, 0], [0.13, 0.06], [0.12, 0.14], [0.1, 0.2], [0.06, 0.24], [0.0, 0.25]], 14, bronze); body.position.set(0, 0.12, -0.02); body.scale.z = 0.8; g.add(body);
    var hands = new T.Mesh(new T.SphereGeometry(0.04, 8, 6), bronzeD); hands.scale.set(1.3, 0.5, 0.8); hands.position.set(0, 0.17, 0.06); g.add(hands);
    var head = new T.Mesh(new T.SphereGeometry(0.07, 14, 10), bronze); head.scale.set(0.9, 1.05, 0.9); head.position.set(0, 0.42, 0.0); g.add(head);
    var ush = new T.Mesh(new T.SphereGeometry(0.035, 10, 7), bronzeD); ush.position.set(0, 0.48, -0.005); g.add(ush);
    for (var i = 0; i < 30; i++) { var a = hash(i, 1) * D2, b = hash(i, 2) * 1.2, cu = new T.Mesh(new T.SphereGeometry(0.008, 5, 4), bronzeD); cu.position.set(Math.cos(a) * Math.sin(b) * 0.064, 0.42 + Math.cos(b) * 0.07, Math.sin(a) * Math.sin(b) * 0.064 - 0.004); g.add(cu); }
    [-1, 1].forEach(function (s) { box(g, bronzeD, 0.015, 0.06, 0.02, s * 0.065, 0.36, 0); });
    for (var t = 0; t < 10; t++) { var a2 = Math.PI * (1.05 + t * 0.1); pine(g, Math.cos(a2) * 0.52, Math.sin(a2) * 0.42, 1.2); }
    return g;
  };

  /* ---------- Shirakawa-go ---------- */
  M.custom.shirakawa = function () {
    var g = new T.Group(), thatch = mat(tex('kaya', 32, 32, function (c, W, H) { c.fillStyle = '#9a7a4a'; c.fillRect(0, 0, W, H); for (var i = 0; i < 120; i++) { c.fillStyle = i % 2 ? 'rgba(60,40,20,.3)' : 'rgba(255,230,180,.25)'; c.fillRect(Math.random() * W, Math.random() * H, 1, 4); } }), 2, 2), wall = mat(winTex('shw', '#6a4a32', '#f2ece0', 3, 2, { tall: 0.5 }), 1, 1);
    blob(g, '#6aa850', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.4, pos: [0, -0.5], r: function (t) { return 0.6 * (1 - t) + 0.04; }, bump: 0.3, sx: 1.3, sz: 0.45, colour: function (x, y, z) { return noise(x * 10, z * 10) > 0.5 ? '#2f6b3a' : '#3f7a44'; } });
    // flooded rice paddies
    for (var p = 0; p < 6; p++) box(g, solid(p % 2 ? '#8ac860' : '#a8d870'), 0.18, 0.004, 0.12, -0.4 + (p % 3) * 0.2, 0.008, 0.25 + Math.floor(p / 3) * 0.14);
    // gasshō-zukuri houses: steep thatched A-frames
    [[-0.25, -0.05, 0.3], [0.05, -0.12, 0], [0.32, 0.0, -0.3], [-0.05, 0.1, 0.1], [0.3, -0.25, 0.2]].forEach(function (q, i) {
      var s = i === 1 ? 1.2 : 1, o = new T.Group(); box(o, wall, 0.14 * s, 0.05 * s, 0.1 * s, 0, 0, 0); var r = new T.Group(); prism(r, thatch, 0.18 * s, 0.2 * s, 0.12 * s, 0, 0, 0); r.rotation.y = Math.PI / 2; r.position.y = 0.05 * s; o.add(r); box(o, solid('#5a4a3a'), 0.012, 0.012, 0.19 * s, 0, 0.25 * s, 0).rotation.x = 0; o.position.set(q[0], 0.006, q[1]); o.rotation.y = q[2]; g.add(o);
    });
    for (var t = 0; t < 8; t++) tree(g, -0.6 + t * 0.17, -0.3 + hash(t, 1) * 0.08, 1.2, '#2f6b3a');
    return g;
  };

  /* ---------- Ōura Church (Nagasaki) ---------- */
  M.custom.oura = function () {
    var g = new T.Group(), white = mat(winTex('ouw', '#f8f6f0', '#5a7090', 3, 2, { tall: 0.6 }), 2, 1), plain = solid('#f6f4ee'), roof = solid('#4a5058');
    blob(g, '#6aa850', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.12, pos: [0, -0.15], r: function (t) { return 0.55 * (1 - t * 0.5); }, bump: 0.15, sx: 1.2, sz: 0.7, rings: 6, colour: function () { return '#5f9a4a'; } });
    var Y = 0.12;
    // stone steps up to the church
    for (var s = 0; s < 6; s++) box(g, solid('#c9c2b0'), 0.14, 0.02 * (s + 1), 0.03, 0, 0, 0.32 - s * 0.03);
    box(g, white, 0.2, 0.12, 0.34, 0, Y, -0.12); ridge(g, roof, 0.21, 0.08, 0.35, 0, Y + 0.12, -0.12, 0);
    [-1, 1].forEach(function (k) { box(g, white, 0.08, 0.08, 0.3, k * 0.13, Y, -0.13); });
    // the front tower with its octagonal spire and cross
    box(g, white, 0.12, 0.2, 0.08, 0, Y, 0.07); prism(g, plain, 0.12, 0.05, 0.02, 0, Y + 0.2, 0.1);
    cyl(g, plain, 0.04, 0.045, 0.06, 0, Y + 0.2, 0.07, 8); cyl(g, roof, 0, 0.045, 0.14, 0, Y + 0.26, 0.07, 8);
    box(g, solid('#d8ad4c'), 0.004, 0.04, 0.004, 0, Y + 0.4, 0.07); box(g, solid('#d8ad4c'), 0.024, 0.004, 0.004, 0, Y + 0.425, 0.07);
    arch(g, solid('#5a7090'), 0.04, 0.08, 0, Y, 0.112, 0.002);
    [[-0.4, 0.2], [0.4, 0.2], [-0.45, -0.25], [0.45, -0.3]].forEach(function (q, i) { tree(g, q[0], q[1], 1.2, i % 2 ? '#3f8f45' : '#f2a7c3'); });
    return g;
  };
})();
