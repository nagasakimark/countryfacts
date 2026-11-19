/* Detailed landmarks, batch 7: Persepolis, Registan, Shwedagon Pagoda, Sigiriya, Tiger's Nest,
   Salar de Uyuni, Hallgrímskirkja, Preikestolen. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge;
  var D2 = Math.PI * 2;
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.01 * s, 0.014 * s, 0.05 * s, x, 0, z, 6); var h = new T.Mesh(new T.SphereGeometry(0.009 * s, 6, 5), solid('#5a3a28')); h.position.set(x, 0.06 * s, z); g.add(h); }
  function arch(g, m, w, h, x, y, z, d) { var sh = new T.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(-w / 2, h - w / 2); sh.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0); var a = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: d || 0.01, bevelEnabled: false, curveSegments: 10 }), m); a.position.set(x, y, z); g.add(a); return a; }
  K.arch = arch;

  /* ---------- Persepolis ---------- */
  M.custom.persepolis = function () {
    var g = new T.Group(), st = mat(stoneTex('pers', '#c9b79a', '#a8967a', 14, 7), 4, 1), col = solid('#d6c4a4'), colD = solid('#b8a688');
    blob(g, '#d8c39a', 0.74, 0.62, 0, 0, 0.006, 4);
    box(g, st, 0.96, 0.08, 0.7, 0, 0, -0.04);
    // the double staircase
    for (var i = 0; i < 5; i++) [-1, 1].forEach(function (s) { box(g, st, 0.12, 0.016 * (i + 1), 0.03, s * 0.2, 0, 0.36 - i * 0.03); });
    // the Gate of All Nations: two huge pillars with winged bulls
    [-0.1, 0.1].forEach(function (x) { box(g, colD, 0.07, 0.3, 0.16, x, 0.08, 0.15); box(g, col, 0.075, 0.08, 0.04, x, 0.15, 0.24); var hd = new T.Mesh(new T.CylinderGeometry(0.02, 0.026, 0.05, 8), col); hd.position.set(x, 0.27, 0.235); g.add(hd); [-1, 1].forEach(function (s) { var wg = box(g, col, 0.008, 0.1, 0.06, x + s * 0.036, 0.16, 0.2); wg.rotation.x = 0.3; }); });
    box(g, colD, 0.28, 0.04, 0.16, 0, 0.38, 0.15);
    // the Apadana hall: a forest of tall columns, some still standing
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
      if (hash(r, c) < 0.45) { if (hash(c, r + 3) < 0.5) cyl(g, colD, 0.02, 0.022, 0.04, -0.4 + c * 0.1, 0.08, -0.32 + r * 0.1, 10); continue; }
      var x = -0.4 + c * 0.1, z = -0.32 + r * 0.1, h = 0.32 + hash(c, r) * 0.08;
      cyl(g, col, 0.022, 0.026, 0.02, x, 0.08, z, 10); var sh = new T.Mesh(new T.CylinderGeometry(0.016, 0.018, h, 10), col); sh.position.set(x, 0.1 + h / 2, z); g.add(sh);
      box(g, colD, 0.07, 0.03, 0.025, x, 0.1 + h, z);
    }
    box(g, st, 0.16, 0.1, 0.12, 0.35, 0.08, 0.1); box(g, solid('#3a2f26'), 0.04, 0.07, 0.005, 0.35, 0.08, 0.162);
    return g;
  };

  /* ---------- Registan, Samarkand ---------- */
  M.custom.registan = function () {
    var g = new T.Group();
    var tile = mat(tex('regt', 64, 64, function (c, W, H) { c.fillStyle = '#2f7fb8'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 16) for (var x = 0; x < W; x += 16) { c.fillStyle = '#f2c14e'; c.beginPath(); c.moveTo(x + 8, y + 2); c.lineTo(x + 14, y + 8); c.lineTo(x + 8, y + 14); c.lineTo(x + 2, y + 8); c.fill(); c.fillStyle = '#7fd0e8'; c.fillRect(x + 6, y + 6, 4, 4); } }), 3, 2);
    var brick = mat(stoneTex('regb', '#d9b98a', '#b8966a', 10, 5), 4, 2), turq = solid('#2fb0b8', { flatShading: true }), dark = solid('#1f3f6a');
    box(g, solid('#d8c7a6'), 1.1, 0.01, 1.0, 0, 0, 0);
    function madrasa(x, z, ry, w, domes) {
      var m = new T.Group();
      box(m, brick, w, 0.18, 0.18, 0, 0, -0.09);
      box(m, tile, w * 0.42, 0.32, 0.06, 0, 0, 0.0);
      arch(m, dark, w * 0.24, 0.22, 0, 0.0, 0.031, 0.002);
      [-1, 1].forEach(function (s) { var mn = new T.Mesh(new T.CylinderGeometry(0.022, 0.03, 0.42, 10), tile); mn.position.set(s * w * 0.5, 0.21, 0.0); m.add(mn); cyl(m, solid('#d9b98a'), 0.03, 0.03, 0.02, s * w * 0.5, 0.42, 0.0, 10); });
      (domes || []).forEach(function (dx) { cyl(m, tile, 0.045, 0.045, 0.06, dx, 0.18, -0.1, 14); var dm = new T.Mesh(new T.SphereGeometry(0.055, 14, 8, 0, D2, 0, Math.PI / 2), turq); dm.scale.y = 1.35; dm.position.set(dx, 0.24, -0.1); m.add(dm); for (var k = 0; k < 10; k++) { var rib = new T.Mesh(new T.TorusGeometry(0.056, 0.003, 3, 10, Math.PI / 2), solid('#1f8f98')); rib.scale.y = 1.35; rib.rotation.y = k / 10 * D2; rib.position.set(dx, 0.24, -0.1); m.add(rib); } });
      m.position.set(x, 0, z); m.rotation.y = ry; g.add(m);
    }
    madrasa(0, -0.3, 0, 0.5, [-0.18, 0.18]);
    madrasa(-0.36, 0.06, Math.PI / 2, 0.42, [0.12]);
    madrasa(0.36, 0.06, -Math.PI / 2, 0.42, [-0.12]);
    for (var i = 0; i < 4; i++) tree(g, -0.15 + i * 0.1, 0.42, 0.9, '#3f8f45');
    return g;
  };

  /* ---------- Shwedagon Pagoda ---------- */
  M.custom.shwedagon = function () {
    var g = new T.Group(), gold = solid('#e8b52a', { emissive: '#4a3200' }), goldD = solid('#d49a1a', { emissive: '#3a2600' }), white = solid('#f2eee6');
    blob(g, '#6fb05a', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, mat(stoneTex('shwst', '#e8e2d6', '#cfc8b8', 16, 8), 5, 1), 0.86, 0.06, 0.86, 0, 0, 0);
    box(g, solid('#e2dccf'), 0.6, 0.04, 0.6, 0, 0.06, 0);
    var pts = [[0.24, 0], [0.24, 0.04], [0.21, 0.05], [0.21, 0.09], [0.18, 0.1], [0.19, 0.16], [0.17, 0.24], [0.13, 0.32], [0.09, 0.36], [0.08, 0.4], [0.065, 0.42], [0.06, 0.48], [0.045, 0.52], [0.04, 0.6], [0.025, 0.68], [0.012, 0.76], [0.004, 0.82], [0, 0.84]];
    var st = lathe(pts, 24, gold); st.position.y = 0.1; g.add(st);
    for (var b = 0; b < 4; b++) { var ring = new T.Mesh(new T.TorusGeometry(0.063 - b * 0.008, 0.006, 4, 18), goldD); ring.rotation.x = Math.PI / 2; ring.position.y = 0.52 + b * 0.04; g.add(ring); }
    var hti = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), solid('#ffffff', { emissive: '#666666' })); hti.position.y = 0.95; g.add(hti);
    // small stupas and shrines round the terrace
    for (var i = 0; i < 16; i++) { var a = i / 16 * D2, r = 0.36, x = Math.cos(a) * r, z = Math.sin(a) * r, s = 0.35 + (i % 2) * 0.12, sp = lathe(pts.map(function (p) { return [p[0] * s, p[1] * s]; }), 10, i % 4 ? gold : white); sp.position.set(x, 0.06, z); g.add(sp); }
    [[0.38, 0.38], [-0.38, 0.38], [0.38, -0.38], [-0.38, -0.38]].forEach(function (q) { box(g, solid('#c0392b'), 0.08, 0.06, 0.08, q[0], 0.06, q[1]); hip(g, gold, 0.11, 0.11, 0.06, q[0], 0.12, q[1], 0.2); });
    return g;
  };

  /* ---------- Sigiriya (Lion Rock) ---------- */
  M.custom.sigiriya = function () {
    var g = new T.Group();
    blob(g, '#5f9f4a', 0.74, 0.62, 0, 0, 0.006, 6);
    mountain(g, { h: 0.5, pos: [0, -0.1], rings: 16, r: function (t) { return t > 0.93 ? 0.24 * (1 - (t - 0.93) * 10) : 0.27 - t * 0.04; }, bump: 0.12, sz: 0.8, jag: 0.01, colour: function (x, y, z) { if (y > 0.47) return noise(x * 20, z * 20) > 0.5 ? '#5f9a4a' : '#7aa858'; return noise(x * 10, y * 16) > 0.55 ? '#8a6a52' : (y < 0.08 ? '#6f5a48' : '#a07a5e'); } });
    // ruined palace walls on top
    [[0.0, -0.1], [0.08, -0.04], [-0.08, -0.16]].forEach(function (q) { box(g, solid('#b5a089'), 0.1, 0.03, 0.02, q[0], 0.5, q[1]); });
    // the lion's paws at the stairs
    [-1, 1].forEach(function (s) { box(g, solid('#c9b8a0'), 0.06, 0.07, 0.1, s * 0.07, 0.0, 0.18); for (var k = 0; k < 3; k++) { var cl = new T.Mesh(new T.SphereGeometry(0.014, 6, 5), solid('#d8c8ae')); cl.position.set(s * 0.07 + (k - 1) * 0.018, 0.012, 0.235); g.add(cl); } });
    box(g, solid('#d8c8ae'), 0.05, 0.2, 0.02, 0, 0.0, 0.14).rotation.x = -0.4;
    // water gardens
    [[-0.1, 0.38], [0.1, 0.38], [-0.1, 0.5], [0.1, 0.5]].forEach(function (q) { box(g, solid('#d8cfbf'), 0.14, 0.012, 0.09, q[0], 0.004, q[1]); box(g, solid('#4aa8d8'), 0.12, 0.014, 0.07, q[0], 0.004, q[1]); });
    for (var j = 0; j < 14; j++) { var a = j / 14 * D2, r = 0.55 + hash(j, 2) * 0.1; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.85, 1.3, j % 2 ? '#3f8f45' : '#2f7a3f'); }
    return g;
  };

  /* ---------- Paro Taktsang (Tiger's Nest) ---------- */
  M.custom.tigersnest = function () {
    var g = new T.Group(), white = mat(winTex('tkw', '#f6f2ea', '#3a2a22', 3, 2, { tall: 0.4 }), 1, 1), roofM = solid('#c9a03a', { emissive: '#2a1e00' }), red = solid('#8e2a24');
    blob(g, '#4f8a4a', 0.74, 0.62, 0, 0, 0.006, 2);
    mountain(g, { h: 0.95, pos: [0, -0.28], seg: 10, r: function (t) { return 0.36 * (1 - t * 0.55); }, bump: 0.3, sx: 1.5, sz: 0.6, colour: function (x, y, z) { return y < 0.12 ? '#3f7a44' : noise(x * 14, y * 14) > 0.6 ? '#6f6a62' : '#878078'; } });
    var BL = [[-0.12, 0.42, -0.07, 0.12, 0.1], [0.04, 0.46, -0.09, 0.1, 0.12], [0.16, 0.4, -0.08, 0.09, 0.09], [-0.02, 0.36, -0.05, 0.14, 0.08]];
    BL.forEach(function (b) { box(g, white, b[3], b[4], 0.08, b[0], b[1], b[2]); box(g, red, b[3] + 0.004, 0.02, 0.082, b[0], b[1] + b[4] - 0.02, b[2]); hip(g, roofM, b[3] * 1.25, 0.11, 0.04, b[0], b[1] + b[4], b[2], 0.35); });
    // prayer flags strung across
    var cols = ['#2b6fd0', '#ffffff', '#e8473a', '#4fb35a', '#f2c14e'];
    for (var i = 0; i < 15; i++) { var f = new T.Mesh(new T.PlaneGeometry(0.02, 0.015), solid(cols[i % 5], { side: T.DoubleSide })); f.position.set(-0.45 + i * 0.035, 0.32 - Math.sin(i / 14 * Math.PI) * 0.06, 0.2); g.add(f); }
    for (var j = 0; j < 16; j++) { var a = j / 16 * D2, r = 0.55 + hash(j, 4) * 0.12; if (Math.sin(a) < -0.5) continue; tree(g, Math.cos(a) * r, Math.sin(a) * r * 0.8, 1.4, '#2f6b3a'); }
    return g;
  };

  /* ---------- Salar de Uyuni ---------- */
  M.custom.uyuni = function () {
    var g = new T.Group();
    var salt = mat(tex('salt', 64, 64, function (c, W, H) { c.fillStyle = '#f7f7f2'; c.fillRect(0, 0, W, H); c.strokeStyle = '#d9dcdf'; c.lineWidth = 2; for (var y = 0; y < H; y += 16) for (var x = 0; x < W; x += 18) { c.beginPath(); for (var k = 0; k < 7; k++) { var a = k / 6 * D2; c.lineTo(x + 9 + Math.cos(a) * 9, y + 8 + Math.sin(a) * 8); } c.stroke(); } }), 6, 6);
    var flat = new T.Mesh(new T.CircleGeometry(0.72, 28), salt); flat.rotation.x = -Math.PI / 2; flat.scale.y = 0.85; flat.position.y = 0.006; g.add(flat);
    var water = new T.Mesh(new T.CircleGeometry(0.34, 24), solid('#a9d6f2', { transparent: true, opacity: 0.85 })); water.rotation.x = -Math.PI / 2; water.position.set(0.18, 0.009, 0.1); g.add(water);
    // reflected clouds in the mirror
    for (var i = 0; i < 6; i++) { var cl = new T.Mesh(new T.SphereGeometry(0.04 + hash(i, 1) * 0.03, 7, 5), solid('#ffffff')); cl.scale.y = 0.15; cl.position.set(0.05 + hash(i, 2) * 0.3, 0.012, -0.05 + hash(i, 3) * 0.3); g.add(cl); }
    // Incahuasi island with giant cacti
    mountain(g, { h: 0.12, pos: [-0.35, -0.25], r: function (t) { return 0.16 * (1 - t) + 0.02; }, bump: 0.35, colour: function () { return '#9a8a72'; } });
    for (var k = 0; k < 7; k++) { var x = -0.35 + (hash(k, 4) - 0.5) * 0.2, z = -0.25 + (hash(k, 5) - 0.5) * 0.15, h = 0.08 + hash(k, 6) * 0.05; cyl(g, solid('#5f8a4a'), 0.008, 0.01, h, x, 0.06, z, 6); cyl(g, solid('#5f8a4a'), 0.006, 0.006, h * 0.4, x + 0.012, 0.06 + h * 0.4, z, 6); }
    // a 4x4 car and visitors jumping
    var car = new T.Group(); box(car, solid('#ffffff'), 0.04, 0.02, 0.07, 0, 0.008, 0); box(car, solid('#2b6fd0'), 0.036, 0.018, 0.04, 0, 0.028, -0.005); [[0.02, 0.022], [-0.02, 0.022], [0.02, -0.022], [-0.02, -0.022]].forEach(function (q) { var w = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.006, 8), solid('#2f2f3a')); w.rotation.z = Math.PI / 2; w.position.set(q[0], 0.008, q[1]); car.add(w); }); car.position.set(-0.1, 0.006, 0.3); car.rotation.y = 0.5; g.add(car);
    [[0.0, 0.25, '#e8473a'], [0.05, 0.27, '#f2c14e'], [0.1, 0.24, '#2b6fd0']].forEach(function (q, i) { var p = new T.Group(); person(p, 0, 0, 1.4, q[2]); p.position.set(q[0], 0.006 + (i === 1 ? 0.03 : 0), q[1]); g.add(p); });
    // a llama
    var ll = new T.Group(), wool = solid('#efe6d8'); box(ll, wool, 0.02, 0.02, 0.045, 0, 0.03, 0); [[0.006, 0.015], [-0.006, 0.015], [0.006, -0.015], [-0.006, -0.015]].forEach(function (q) { box(ll, wool, 0.005, 0.03, 0.005, q[0], 0, q[1]); }); box(ll, wool, 0.01, 0.035, 0.01, 0, 0.045, 0.02); box(ll, wool, 0.01, 0.01, 0.016, 0, 0.078, 0.025); ll.position.set(-0.2, 0.006, 0.12); ll.scale.setScalar(1.4); g.add(ll);
    return g;
  };

  /* ---------- Hallgrímskirkja ---------- */
  M.custom.hallgrim = function () {
    var g = new T.Group(), con = mat(tex('hallc', 32, 64, function (c, W, H) { c.fillStyle = '#e4e2dc'; c.fillRect(0, 0, W, H); c.fillStyle = '#c9c6be'; for (var x = 0; x < W; x += 8) c.fillRect(x, 0, 1.5, H); c.fillStyle = '#4a5560'; c.fillRect(13, 10, 6, 14); }), 2, 1), plain = solid('#e8e6e0'), slate = solid('#5a6470');
    blob(g, '#9ab890', 0.74, 0.62, 0, 0, 0.006, 5);
    box(g, solid('#d0d4d8'), 0.5, 0.006, 0.4, 0, 0.006, 0.12);
    // the stepped "basalt column" wings and the tower
    for (var i = 0; i < 6; i++) { [-1, 1].forEach(function (s) { box(g, con, 0.04, 0.12 + i * 0.07, 0.16, s * (0.07 + (5 - i) * 0.04), 0, -0.02); }); }
    box(g, con, 0.14, 0.62, 0.16, 0, 0, -0.02);
    box(g, plain, 0.11, 0.08, 0.13, 0, 0.62, -0.02); [0, 1, 2].forEach(function (k) { box(g, solid('#3f4a55'), 0.016, 0.03, 0.004, -0.03 + k * 0.03, 0.65, 0.047); });
    cyl(g, slate, 0, 0.08, 0.16, 0, 0.7, -0.02, 4, Math.PI / 4); box(g, solid('#e8e6e0'), 0.006, 0.05, 0.006, 0, 0.86, -0.02);
    // the nave behind and Leif Erikson statue in front
    box(g, plain, 0.16, 0.14, 0.32, 0, 0, -0.26); ridge(g, slate, 0.18, 0.1, 0.32, 0, 0.14, -0.26);
    box(g, solid('#8a8f96'), 0.05, 0.08, 0.05, 0, 0.006, 0.3); var stt = new T.Mesh(new T.CylinderGeometry(0.01, 0.014, 0.06, 6), solid('#4f7a6a')); stt.position.set(0, 0.116, 0.3); g.add(stt);
    // colourful houses of Reykjavík
    var hc = ['#e8473a', '#2b6fd0', '#f2c14e', '#4fb35a', '#ffffff', '#ff8a5a'];
    for (var h = 0; h < 10; h++) { var a = Math.PI * (0.15 + h * 0.08), r = 0.52, x = Math.cos(a) * r * (h % 2 ? 1 : -1), z = Math.sin(a) * r * 0.7 - 0.05; box(g, solid(hc[h % 6]), 0.08, 0.06, 0.06, x, 0, z); ridge(g, slate, 0.09, 0.04, 0.07, x, 0.06, z); }
    return g;
  };

  /* ---------- Preikestolen (Pulpit Rock) ---------- */
  M.custom.preikestolen = function () {
    var g = new T.Group(), rock = solid('#8a8680', { flatShading: true }), rockL = solid('#9f9b94');
    blob(g, '#2f6f8f', 0.74, 0.62, 0, 0, 0.006, 7);
    mountain(g, { h: 0.55, pos: [-0.35, 0.0], r: function (t) { return 0.3 * (1 - t * 0.5); }, bump: 0.3, sz: 1.8, colour: function (x, y) { return y > 0.48 ? '#5f8a4a' : noise(x * 12, y * 12) > 0.55 ? '#7a766f' : '#8f8a83'; } });
    mountain(g, { h: 0.5, pos: [0.42, -0.1], r: function (t) { return 0.26 * (1 - t * 0.5); }, bump: 0.3, sz: 1.8, seed: 5, colour: function (x, y) { return y > 0.43 ? '#5f8a4a' : '#8a857d'; } });
    // the pulpit: a square flat block sticking out over the fjord
    box(g, rock, 0.22, 0.56, 0.2, -0.1, 0, 0.02);
    box(g, rockL, 0.22, 0.03, 0.22, -0.1, 0.56, 0.03);
    box(g, solid('#6f6b65'), 0.005, 0.1, 0.2, 0.012, 0.48, 0.02);
    [[-0.12, 0.05, '#e8473a'], [-0.06, 0.08, '#2b6fd0'], [-0.15, -0.02, '#f2c14e']].forEach(function (q) { person(g, q[0], q[1], 1.2, q[2]); g.children[g.children.length - 1].position.y += 0.59; g.children[g.children.length - 2].position.y += 0.59; });
    var boat = new T.Group(); box(boat, solid('#ffffff'), 0.03, 0.02, 0.09, 0, 0, 0); box(boat, solid('#e8473a'), 0.026, 0.02, 0.03, 0, 0.02, -0.01); boat.position.set(0.15, 0.006, 0.35); boat.rotation.y = 0.4; g.add(boat);
    for (var j = 0; j < 8; j++) tree(g, -0.5 + hash(j, 1) * 0.25, -0.25 + hash(j, 2) * 0.4, 1.0, '#2f6b3a');
    return g;
  };
})();
