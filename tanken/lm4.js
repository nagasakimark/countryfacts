/* Detailed landmarks, batch 4: Wat Arun, Angkor Wat, Gyeongbokgung, Merlion, Petronas Towers, Borobudur,
   Taipei 101, Grand Canyon, CN Tower, Niagara Falls, Chichén Itzá, Machu Picchu, Moai, Obelisco. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function jungle(g, n, r0, r1, seed) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.SphereGeometry(0.04 + hash(i, seed + 2) * 0.03, 7, 5), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, 0.04, Math.sin(a) * r); g.add(c); } }

  /* ---------- Wat Arun ---------- */
  M.custom.pagoda = function () {
    var g = new T.Group();
    var china = tex('porcel', 64, 64, function (c, W, H) { c.fillStyle = '#efe6d2'; c.fillRect(0, 0, W, H); var cols = ['#e8473a', '#2b7de0', '#f2c14e', '#33c9a0', '#ff6f91']; for (var i = 0; i < 70; i++) { c.fillStyle = cols[i % 5]; c.beginPath(); c.arc(Math.random() * W, Math.random() * H, 2 + Math.random() * 2, 0, 7); c.fill(); } for (var y = 0; y < H; y += 16) { c.fillStyle = '#c9b78f'; c.fillRect(0, y, W, 2); } });
    var cm = mat(china, 4, 2);
    function prang(x, z, s) {
      var pts = [[0.3, 0], [0.3, 0.08], [0.25, 0.09], [0.25, 0.17], [0.2, 0.18], [0.2, 0.27], [0.15, 0.28], [0.15, 0.4], [0.12, 0.44], [0.11, 0.55], [0.09, 0.62], [0.075, 0.72], [0.05, 0.8], [0.03, 0.88], [0.012, 0.95], [0, 1.0]];
      var p = lathe(pts.map(function (q) { return [q[0] * s, q[1] * s * 1.1]; }), 12, cm); p.position.set(x, 0, z); g.add(p);
      [0, 1, 2, 3].forEach(function (k) { var a = k * Math.PI / 2; box(g, solid('#e8dfca'), 0.05 * s, 0.25 * s, 0.1 * s, x + Math.sin(a) * 0.26 * s, 0.03 * s, z + Math.cos(a) * 0.26 * s).rotation.set(-0.7 * Math.cos(a), a, 0.7 * Math.sin(a) * 0); });
      cyl(g, solid('#d8ad4c'), 0.002, 0.006 * s, 0.1 * s, x, 1.1 * s, z, 5);
    }
    blob(g, '#3f9edb', 0.75, 0.3, 0, 0.5, 0.006, 4);
    box(g, mat(stoneTex('watb', '#e2d9c6', '#c8bea8', 16, 8), 4, 1), 0.86, 0.05, 0.7, 0, 0, -0.08);
    prang(0, -0.08, 0.72);
    [[0.32, 0.18], [-0.32, 0.18], [0.32, -0.34], [-0.32, -0.34]].forEach(function (q) { prang(q[0], q[1], 0.32); });
    return g;
  };

  /* ---------- Angkor Wat ---------- */
  M.custom.angkor = function () {
    var g = new T.Group(), st = mat(stoneTex('angst', '#9c8b6c', '#7d6e53', 12, 6), 3, 1), stD = solid('#8a7a5c');
    blob(g, '#4f9a50', 0.72, 0.66, 0, 0, 0.006, 8);
    var moat = new T.Mesh(new T.RingGeometry(0.5, 0.62, 4, 1), solid('#4a9fd6', { side: T.DoubleSide })); moat.rotation.set(-Math.PI / 2, 0, Math.PI / 4); moat.position.y = 0.012; g.add(moat);
    box(g, solid('#a89878'), 0.06, 0.016, 0.3, 0, 0, 0.5);
    function gallery(w, h, y) { [[0, w / 2], [0, -w / 2]].forEach(function (q) { box(g, st, w, h, 0.04, 0, y, q[1]); }); [w / 2, -w / 2].forEach(function (x) { box(g, st, 0.04, h, w, x, y, 0); }); var rf = solid('#7a6a50'); [[0, w / 2], [0, -w / 2]].forEach(function (q) { box(g, rf, w + 0.02, 0.012, 0.05, 0, y + h, q[1]); }); [w / 2, -w / 2].forEach(function (x) { box(g, rf, 0.05, 0.012, w + 0.02, x, y + h, 0); }); }
    gallery(0.8, 0.06, 0); box(g, stD, 0.56, 0.08, 0.56, 0, 0, 0); gallery(0.56, 0.06, 0.08); box(g, stD, 0.36, 0.1, 0.36, 0, 0.08, 0); gallery(0.36, 0.05, 0.18);
    var bud = tex('lotus', 32, 64, function (c, W, H) { c.fillStyle = '#9c8b6c'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 5) { c.fillStyle = 'rgba(60,45,25,.5)'; c.fillRect(0, y, W, 1.5); } });
    function tower(x, z, s) { var t = lathe([[0.075, 0], [0.075, 0.06], [0.07, 0.1], [0.065, 0.16], [0.055, 0.22], [0.045, 0.28], [0.03, 0.33], [0.012, 0.37], [0, 0.39]].map(function (q) { return [q[0] * s, q[1] * s]; }), 10, mat(bud, 2, 3)); t.position.set(x, 0.23, z); g.add(t); }
    tower(0, 0, 1.25); [[0.16, 0.16], [-0.16, 0.16], [0.16, -0.16], [-0.16, -0.16]].forEach(function (q) { tower(q[0], q[1], 0.85); });
    for (var i = 0; i < 16; i++) { var a = i / 16 * D2, r = 0.68; tree(g, Math.cos(a) * r, Math.sin(a) * r, 1.1, '#3f8f45'); }
    return g;
  };

  /* ---------- Gyeongbokgung (Geunjeongjeon throne hall) ---------- */
  M.custom.palace = function () {
    var g = new T.Group(), red = solid('#b9372b'), roofM = mat(tex('giwa', 64, 32, function (c, W, H) { c.fillStyle = '#4b5258'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 4) { c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x, 0, 1.5, H); } }), 4, 2);
    var dancheong = mat(tex('danch', 64, 16, function (c, W, H) { c.fillStyle = '#2f8f6a'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 16) { c.fillStyle = '#e8473a'; c.fillRect(x + 2, 4, 5, 8); c.fillStyle = '#f2c14e'; c.fillRect(x + 9, 5, 4, 6); c.fillStyle = '#7cc1e8'; c.fillRect(x, 0, 16, 2); } }), 6, 1);
    mountain(g, { h: 0.35, pos: [0, -0.5], r: function (t) { return 0.5 * (1 - t) + 0.02; }, bump: 0.3, colour: function (x, y, z) { return y > 0.28 ? '#8a8a7a' : (noise(x * 10, z * 10) > 0.5 ? '#3f8a48' : '#4f9a50'); } });
    blob(g, '#d8d2c2', 0.66, 0.5, 0, 0.08, 0.008, 2);
    [[0.66, 0.5, 0], [0.56, 0.42, 0.04]].forEach(function (q) { box(g, mat(stoneTex('gyst', '#cfcabd', '#b3ad9f', 16, 8), 4, 1), q[0], 0.04, q[1], 0, q[2], -0.02); for (var i = 0; i < 14; i++) cyl(g, solid('#e6e1d4'), 0.005, 0.005, 0.03, -q[0] / 2 + i * q[0] / 13, q[2] + 0.04, q[1] / 2 - 0.02, 5); });
    var Y = 0.08;
    for (var i = 0; i < 6; i++) for (var k = 0; k < 2; k++) cyl(g, red, 0.012, 0.013, 0.14, -0.2 + i * 0.08, Y, k ? 0.1 : -0.12, 8);
    box(g, mat(winTex('gylat', '#c9a46a', '#7a3a2a', 6, 2, { tall: 0.7 }), 3, 1), 0.38, 0.12, 0.18, 0, Y, -0.01);
    box(g, dancheong, 0.48, 0.03, 0.27, 0, Y + 0.14, -0.01);
    function roof(w, d, h, y, sc) { var r = new T.Mesh(new T.CylinderGeometry(w * 0.3, w * 0.78, h, 4), roofM); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, d / w); r.position.set(0, y + h / 2, -0.01); g.add(r); var ridge = new T.Mesh(new T.BoxGeometry(w * 0.4, 0.012, 0.016), solid('#3a3f44')); ridge.position.set(0, y + h + 0.012, -0.01); g.add(ridge); }
    roof(0.62, 0.38, 0.07, Y + 0.17); box(g, dancheong, 0.36, 0.05, 0.2, 0, Y + 0.24, -0.01); box(g, red, 0.34, 0.04, 0.18, 0, Y + 0.24, -0.01); roof(0.52, 0.3, 0.1, Y + 0.29);
    // corridor walls around the courtyard
    [[0, 0.46, 0.9, 0.04], [-0.45, 0.1, 0.04, 0.72], [0.45, 0.1, 0.04, 0.72]].forEach(function (q) { box(g, red, q[2], 0.06, q[3], q[0], 0, q[1]); box(g, roofM, q[2] + 0.03, 0.02, q[3] + 0.03, q[0], 0.06, q[1]); });
    return g;
  };

  /* ---------- Merlion (+ Marina Bay Sands behind) ---------- */
  M.custom.merlion = function () {
    var g = new T.Group(), w = solid('#f0eee8'), wD = solid('#d9d6cc');
    blob(g, '#3f9edb', 0.74, 0.6, 0, 0.1, 0.006, 6);
    box(g, mat(stoneTex('mlst', '#c9c3b5', '#aaa496', 14, 7), 3, 1), 0.36, 0.06, 0.24, -0.15, 0, -0.05);
    // fish body curling up from the waves
    var scales = mat(tex('scales', 32, 32, function (c, W, H) { c.fillStyle = '#f0eee8'; c.fillRect(0, 0, W, H); c.strokeStyle = '#c9c4b8'; c.lineWidth = 1.2; for (var y = 0; y < H + 8; y += 6) for (var x = (y / 6 % 2) * 4; x < W + 8; x += 8) { c.beginPath(); c.arc(x, y, 4, 0, Math.PI); c.stroke(); } }), 3, 3);
    var body = lathe([[0, 0], [0.09, 0], [0.1, 0.08], [0.085, 0.18], [0.07, 0.26], [0, 0.3]], 14, scales); body.position.set(-0.15, 0.06, -0.06); g.add(body);
    var tail = new T.Mesh(new T.ConeGeometry(0.05, 0.12, 6), wD); tail.position.set(-0.24, 0.12, -0.12); tail.rotation.z = 1.0; g.add(tail);
    // lion head with mane
    var head = new T.Mesh(new T.SphereGeometry(0.09, 14, 10), w); head.position.set(-0.15, 0.4, -0.04); g.add(head);
    for (var i = 0; i < 12; i++) { var a = i / 12 * D2, m = new T.Mesh(new T.SphereGeometry(0.035, 7, 5), wD); m.position.set(-0.15 + Math.cos(a) * 0.085, 0.4 + Math.sin(a) * 0.085, -0.07); g.add(m); }
    var snout = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), w); snout.scale.set(1, 0.8, 1); snout.position.set(-0.15, 0.37, 0.04); g.add(snout);
    [-1, 1].forEach(function (s) { var e = new T.Mesh(new T.SphereGeometry(0.012, 6, 5), solid('#3a3a3a')); e.position.set(-0.15 + s * 0.035, 0.43, 0.04); g.add(e); });
    // water jet arcing into the bay
    var pts = []; for (var j = 0; j <= 14; j++) { var t = j / 14; pts.push(new T.Vector3(-0.15, 0.36 + 0.05 * Math.sin(t * Math.PI) - t * t * 0.34, 0.08 + t * 0.4)); }
    g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 30, 0.012, 6, false), solid('#bfe6ff', { transparent: true, opacity: 0.85, emissive: 0x204060 })));
    var splash = new T.Mesh(new T.SphereGeometry(0.04, 8, 5), solid('#ffffff', { transparent: true, opacity: 0.8 })); splash.scale.y = 0.4; splash.position.set(-0.15, 0.015, 0.48); g.add(splash);
    // Marina Bay Sands: three towers with the ship-like SkyPark on top
    var glass = mat(winTex('mbs', '#d9dfe6', '#6a7f96', 3, 8), 1, 3);
    [0.18, 0.3, 0.42].forEach(function (x) { var t = new T.Mesh(new T.BoxGeometry(0.07, 0.5, 0.05), glass); t.position.set(x, 0.25, -0.35); t.rotation.z = 0.04; g.add(t); var t2 = t.clone(); t2.position.z = -0.29; t2.rotation.z = -0.04; g.add(t2); });
    box(g, solid('#e8ecf0'), 0.42, 0.02, 0.07, 0.31, 0.5, -0.32);
    return g;
  };

  /* ---------- Petronas Twin Towers ---------- */
  M.custom.twin = function () {
    var g = new T.Group(), steel = mat(tex('petro', 32, 64, function (c, W, H) { c.fillStyle = '#c7cfd9'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 4) { c.fillStyle = '#7f8b9a'; c.fillRect(0, y, W, 1.5); } for (var x = 0; x < W; x += 4) { c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x, 0, 1, H); } }), 4, 12);
    function starGeo(r1, r2, h) { var sh = new T.Shape(); for (var i = 0; i < 16; i++) { var a = i / 16 * D2, r = i % 2 ? r2 : r1; if (i) sh.lineTo(Math.cos(a) * r, Math.sin(a) * r); else sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); } var e = new T.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false }); e.rotateX(-Math.PI / 2); return e; }
    function tower(x) {
      var y = 0, sections = [[0.1, 0.08, 0.55], [0.088, 0.07, 0.15], [0.076, 0.06, 0.12], [0.062, 0.05, 0.1], [0.05, 0.04, 0.07], [0.038, 0.03, 0.06]];
      sections.forEach(function (s) { var m = new T.Mesh(starGeo(s[0], s[1], s[2]), steel); m.position.set(x, y, 0); g.add(m); y += s[2]; });
      cyl(g, solid('#dfe5ec'), 0.004, 0.02, 0.22, x, y, 0, 8); y += 0.22; cyl(g, solid('#c7cfd9'), 0.002, 0.004, 0.06, x, y, 0, 5);
    }
    tower(-0.17); tower(0.17);
    box(g, solid('#9aa6b4'), 0.2, 0.03, 0.05, 0, 0.5, 0);
    [-1, 1].forEach(function (s) { var leg = new T.Mesh(new T.BoxGeometry(0.008, 0.18, 0.008), solid('#9aa6b4')); leg.position.set(s * 0.04, 0.42, 0); leg.rotation.z = s * 0.5; g.add(leg); });
    box(g, mat(winTex('klcc', '#d6dbe2', '#6a7a8c', 6, 2), 3, 1), 0.7, 0.07, 0.3, 0, 0, -0.06);
    blob(g, '#6cbf5c', 0.66, 0.4, 0, 0.32, 0.01, 3); blob(g, '#4fa6e0', 0.22, 0.08, 0, 0.36, 0.014, 1);
    for (var i = 0; i < 8; i++) palm(g, -0.5 + i * 0.14, 0.52, 0.9);
    return g;
  };

  /* ---------- Borobudur ---------- */
  M.custom.borobudur = function () {
    var g = new T.Group(), relief = mat(tex('bororel', 64, 32, function (c, W, H) { c.fillStyle = '#7f7a70'; c.fillRect(0, 0, W, H); c.fillStyle = '#6a655c'; c.fillRect(0, 0, W, 4); for (var x = 2; x < W; x += 10) { c.fillStyle = '#948e82'; c.fillRect(x, 8, 7, 18); c.fillStyle = '#5f5a52'; c.fillRect(x + 2, 12, 3, 10); } }), 6, 1);
    mountain(g, { h: 0.08, r: function (t) { return 0.66 - 0.06 * t; }, bump: 0.1, colour: function (x, y, z) { return noise(x * 10, z * 10) > 0.5 ? '#3f8f45' : '#4fa24f'; } });
    var y = 0.07;
    [0.78, 0.68, 0.58, 0.49, 0.41, 0.34].forEach(function (w) { var b = box(g, relief, w, 0.045, w, 0, y, 0); y += 0.045; for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2; cyl(g, solid('#8a857a'), 0, 0.012, 0.025, Math.sin(a) * w / 2, y, Math.cos(a) * w / 2, 6); } });
    var bell = function (x, yy, z, s) { var b = lathe([[0, 0], [0.03 * s, 0], [0.032 * s, 0.02 * s], [0.025 * s, 0.04 * s], [0.012 * s, 0.05 * s], [0.006 * s, 0.07 * s], [0, 0.08 * s]], 10, solid('#8f8a7e')); b.position.set(x, yy, z); g.add(b); };
    [[0.15, 16], [0.11, 12], [0.07, 8]].forEach(function (q, i) { cyl(g, solid('#8a857a'), q[0] + 0.025, q[0] + 0.03, 0.025, 0, y, 0, 24); for (var j = 0; j < q[1]; j++) { var a = j / q[1] * D2; bell(Math.cos(a) * q[0], y + 0.025, Math.sin(a) * q[0], 0.9); } y += 0.025; });
    bell(0, y, 0, 2.2);
    jungle(g, 20, 0.6, 0.7, 4);
    return g;
  };

  /* ---------- Taipei 101 ---------- */
  M.custom.tiers = function () {
    var g = new T.Group(), glass = mat(tex('t101', 32, 32, function (c, W, H) { c.fillStyle = '#5f9c86'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 4) { c.fillStyle = 'rgba(220,255,240,.35)'; c.fillRect(0, y, W, 1); } for (var x = 0; x < W; x += 8) { c.fillStyle = '#4a7f6c'; c.fillRect(x, 0, 1.5, H); } }), 3, 3);
    blob(g, '#a7aeb5', 0.6, 0.5, 0, 0, 0.006, 4);
    box(g, mat(winTex('t101b', '#c7ced3', '#4f6a7a', 6, 3), 3, 1), 0.36, 0.1, 0.36, 0, 0, 0);
    var b = new T.Mesh(new T.CylinderGeometry(0.11, 0.13, 0.22, 4), glass); b.rotation.y = Math.PI / 4; b.position.y = 0.21; g.add(b);
    for (var i = 0; i < 8; i++) { var s = new T.Mesh(new T.CylinderGeometry(0.115, 0.085, 0.085, 4), glass); s.rotation.y = Math.PI / 4; s.position.y = 0.32 + i * 0.085 + 0.0425; g.add(s); box(g, solid('#d8ad4c'), 0.03, 0.03, 0.005, 0, 0.33 + i * 0.085, 0.084).rotation.z = Math.PI / 4; }
    var y = 0.32 + 8 * 0.085;
    cyl(g, glass, 0.04, 0.06, 0.06, 0, y, 0, 4, Math.PI / 4); cyl(g, glass, 0.025, 0.035, 0.05, 0, y + 0.06, 0, 4, Math.PI / 4);
    cyl(g, solid('#dfe5ec'), 0.004, 0.012, 0.22, 0, y + 0.11, 0, 6);
    var city = [mat(winTex('tpa', '#d3d8de', '#5a6a7c', 3, 5), 1, 2), mat(winTex('tpb', '#e8dfcf', '#6a7a8a', 3, 4), 1, 2)];
    for (var j = 0; j < 12; j++) { var a = j / 12 * D2 + 0.3, r = 0.33 + hash(j, 1) * 0.18; box(g, city[j % 2], 0.06, 0.06 + hash(j, 2) * 0.16, 0.06, Math.cos(a) * r, 0, Math.sin(a) * r); }
    return g;
  };

  /* ---------- Grand Canyon ---------- */
  M.custom.canyon = function () {
    var g = new T.Group(), pg = new T.PlaneGeometry(1.3, 1.1, 48, 40); pg.rotateX(-Math.PI / 2);
    var pp = pg.attributes.position;
    function riverX(z) { return 0.12 * Math.sin(z * 5) + 0.05 * Math.sin(z * 13); }
    for (var i = 0; i < pp.count; i++) {
      var x = pp.getX(i), z = pp.getZ(i), d = Math.abs(x - riverX(z)), top = 0.3 + (noise(x * 3, z * 3) - 0.5) * 0.04;
      var h = d < 0.05 ? 0.02 : Math.min(top, 0.02 + Math.floor(Math.max(0, d - 0.05) / 0.06) * 0.06 + Math.max(0, d - 0.05) % 0.06 * 0.3 + (noise(x * 8, z * 8) - 0.5) * 0.02);
      var edge = Math.max(0, Math.min(1, (0.62 - Math.max(Math.abs(x) / 1.3 * 1.1, Math.abs(z) / 1.1 * 1.1)) * 6)); pp.setY(i, h * edge);
    }
    var bands = ['#b5532f', '#d9844f', '#c4683c', '#e8b07a', '#c96a3a', '#f0d0a0'];
    g.add(new T.Mesh(paintVerts(pg, function (x, y, z) { if (y < 0.03 && Math.abs(x - riverX(z)) < 0.05) return '#3f8fd0'; if (y > 0.29) return noise(x * 20, z * 20) > 0.6 ? '#6f8a4a' : '#a8a060'; return bands[Math.floor(y / 0.045) % bands.length]; }), vcMat));
    for (var j = 0; j < 10; j++) { var tx = (hash(j, 3) - 0.5) * 1.1, tz = (hash(j, 4) - 0.5) * 0.9; if (Math.abs(tx - riverX(tz)) < 0.3) continue; tree(g, tx, tz, 0.7, '#4f7a3a'); g.children[g.children.length - 1].position.y += 0.3; g.children[g.children.length - 2].position.y += 0.3; }
    return g;
  };

  /* ---------- CN Tower ---------- */
  M.custom.needle = function () {
    var g = new T.Group(), conc = mat(tex('cnc', 32, 64, function (c, W, H) { c.fillStyle = '#d4d6d8'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 8) { c.fillStyle = '#b7babe'; c.fillRect(x, 0, 2, H); } }), 3, 6);
    blob(g, '#3f9edb', 0.74, 0.4, 0, 0.42, 0.006, 3); blob(g, '#a9aeb3', 0.6, 0.35, 0, -0.18, 0.008, 6);
    var base = new T.Mesh(new T.CylinderGeometry(0.035, 0.12, 0.72, 3), conc); base.position.y = 0.36; g.add(base);
    var podRing = mat(winTex('cnpod', '#e2e4e6', '#2f3a48', 8, 2, { tall: 0.6 }), 8, 1);
    cyl(g, solid('#c9ccd0'), 0.13, 0.07, 0.04, 0, 0.68, 0, 20); cyl(g, podRing, 0.13, 0.13, 0.05, 0, 0.72, 0, 20); cyl(g, solid('#c9ccd0'), 0.08, 0.13, 0.04, 0, 0.77, 0, 20);
    cyl(g, conc, 0.03, 0.035, 0.2, 0, 0.81, 0, 10); cyl(g, podRing, 0.05, 0.05, 0.025, 0, 0.98, 0, 14);
    cyl(g, solid('#e7e8ea'), 0.006, 0.025, 0.4, 0, 1.0, 0, 8); cyl(g, solid('#ff5a4d'), 0.002, 0.004, 0.03, 0, 1.4, 0, 5);
    // Rogers Centre dome and a few city blocks
    var dome = new T.Mesh(new T.SphereGeometry(0.15, 18, 8, 0, D2, 0, Math.PI / 2), solid('#f0f1f2')); dome.scale.y = 0.55; dome.position.set(-0.32, 0.04, 0.05); g.add(dome); cyl(g, solid('#d8dade'), 0.15, 0.15, 0.04, -0.32, 0, 0.05, 18);
    var city = [mat(winTex('tora', '#c9d0d8', '#3f5068', 3, 6), 1, 2), mat(winTex('torb', '#2f4258', '#9fc3e6', 3, 7), 1, 2)];
    for (var i = 0; i < 9; i++) box(g, city[i % 2], 0.06, 0.12 + hash(i, 2) * 0.3, 0.06, 0.15 + (i % 3) * 0.1, 0, -0.18 - Math.floor(i / 3) * 0.1);
    return g;
  };

  /* ---------- Niagara Falls ---------- */
  M.custom.falls = function () {
    var g = new T.Group();
    var fallTex = tex('falls', 32, 64, function (c, W, H) { c.fillStyle = '#d9f1ff'; c.fillRect(0, 0, W, H); for (var i = 0; i < 40; i++) { c.fillStyle = 'rgba(120,180,220,.4)'; c.fillRect(Math.random() * W, 0, 1.5, H); } c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(0, 0, W, 4); });
    blob(g, '#6cbf5c', 0.74, 0.64, 0, 0, 0.008, 5);
    // upper plateau with the Horseshoe notch cut into its edge, river on top
    var sh = new T.Shape(); sh.moveTo(-0.62, 0.16); sh.lineTo(-0.15, 0.16); sh.absarc(0.05, 0.16, 0.2, Math.PI, 0, true); sh.lineTo(0.62, 0.16); sh.lineTo(0.62, 0.58); sh.lineTo(-0.62, 0.58); sh.lineTo(-0.62, 0.16);
    var plateau = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false, curveSegments: 18 }), [solid('#5aa34e'), solid('#7a6a55')]); plateau.rotation.x = -Math.PI / 2; g.add(plateau);
    box(g, solid('#3f9edb', { emissive: 0x0a2a40 }), 0.46, 0.006, 0.36, 0.05, 0.2, -0.4);
    box(g, solid('#3f8fd0', { emissive: 0x0a2a40 }), 0.5, 0.016, 0.7, 0.02, 0, 0.2);
    var water = new T.Mesh(new T.CylinderGeometry(0.19, 0.17, 0.2, 18, 1, true, Math.PI / 2, Math.PI), mat(fallTex, 6, 1, { side: T.DoubleSide, emissive: 0x203040 })); water.position.set(0.05, 0.1, -0.16); g.add(water);
    box(g, mat(fallTex, 3, 1, { emissive: 0x203040 }), 0.2, 0.2, 0.012, -0.4, 0, -0.155);
    for (var m = 0; m < 6; m++) { var mist = new T.Mesh(new T.SphereGeometry(0.05 + hash(m, 1) * 0.04, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.5 })); mist.position.set(-0.05 + hash(m, 2) * 0.22, 0.03 + hash(m, 3) * 0.05, -0.14 + hash(m, 4) * 0.08); g.add(mist); }
    // the tour boat
    box(g, solid('#2b7de0'), 0.06, 0.02, 0.025, 0.08, 0.016, 0.12); box(g, solid('#ffffff'), 0.04, 0.02, 0.02, 0.08, 0.036, 0.12);
    for (var t = 0; t < 8; t++) tree(g, -0.6 + t * 0.17, 0.5, 0.9);
    for (var t2 = 0; t2 < 6; t2++) { tree(g, -0.55 + t2 * 0.2, -0.5, 0.9); g.children[g.children.length - 1].position.y += 0.2; g.children[g.children.length - 2].position.y += 0.2; }
    return g;
  };

  /* ---------- Chichén Itzá (El Castillo) ---------- */
  M.custom.steps = function () {
    var g = new T.Group(), st = mat(stoneTex('mayast', '#cfc3a6', '#a99d80', 10, 5), 3, 1), stD = solid('#b8ab8c');
    blob(g, '#7fbf5c', 0.72, 0.64, 0, 0, 0.008, 3);
    var y = 0;
    for (var i = 0; i < 9; i++) { var w = 0.7 - i * 0.058; box(g, st, w, 0.045, w, 0, y, 0); y += 0.045; }
    for (var k = 0; k < 4; k++) {
      var a = k * Math.PI / 2, holder = new T.Group(); holder.rotation.y = a; g.add(holder);
      var stair = new T.Mesh(new T.BoxGeometry(0.11, 0.48, 0.02), mat(tex('mayastair', 16, 64, function (c, W, H) { for (var s = 0; s < H; s += 3) { c.fillStyle = s % 6 ? '#d8cdb2' : '#a99d80'; c.fillRect(0, s, W, 3); } }), 1, 1));
      stair.rotation.x = -0.72; stair.position.set(0, 0.2, 0.265); holder.add(stair);
      [-0.065, 0.065].forEach(function (x) { var rail = new T.Mesh(new T.BoxGeometry(0.02, 0.5, 0.025), stD); rail.rotation.x = -0.72; rail.position.set(x, 0.2, 0.27); holder.add(rail); });
      if (k === 0) [-0.065, 0.065].forEach(function (x) { var hd = new T.Mesh(new T.BoxGeometry(0.03, 0.03, 0.04), solid('#9c8f72')); hd.position.set(x, 0.015, 0.38); holder.add(hd); });
    }
    box(g, mat(winTex('mayatemple', '#c9bc9e', '#3a3226', 3, 1, { tall: 0.6 }), 2, 1), 0.17, 0.09, 0.17, 0, y, 0);
    box(g, stD, 0.19, 0.02, 0.19, 0, y + 0.09, 0);
    for (var t = 0; t < 10; t++) { var aa = t / 10 * D2 + 0.4; tree(g, Math.cos(aa) * 0.62, Math.sin(aa) * 0.55, 0.9, '#3f8f45'); }
    return g;
  };

  /* ---------- Machu Picchu ---------- */
  M.custom.machu = function () {
    var g = new T.Group();
    mountain(g, { h: 0.7, seg: 9, rings: 12, pos: [0.08, -0.38], r: function (t) { return 0.24 * Math.pow(1 - t, 0.9) + 0.01; }, bump: 0.35, f: 2, colour: function (x, y, z) { return noise(x * 12, y * 12) > 0.6 ? '#7a7a6a' : (y > 0.5 ? '#3f7f45' : '#3f8f4a'); } });
    mountain(g, { h: 0.1, r: function (t) { return 0.64 - 0.2 * t * t; }, bump: 0.12, colour: function (x, y, z) { return y > 0.16 ? '#9dbb6a' : (noise(x * 9, z * 9) > 0.5 ? '#3f8f45' : '#4f9a4a'); } });
    var B = 0.1, wall = mat(stoneTex('incast', '#a9a497', '#8a8576', 8, 4), 2, 1);
    for (var i = 0; i < 5; i++) { box(g, solid(i % 2 ? '#8fb05a' : '#9dbb6a'), 0.62 - i * 0.04, 0.025, 0.08, 0, B + i * 0.025 - 0.12, 0.42 - i * 0.07); box(g, wall, 0.62 - i * 0.04, 0.025, 0.006, 0, B + i * 0.025 - 0.125, 0.46 - i * 0.07); }
    // stone houses without roofs, plus a couple with thatch
    for (var h = 0; h < 14; h++) { var x = -0.28 + (h % 7) * 0.09, z = -0.02 + Math.floor(h / 7) * 0.13 + (hash(h, 1) - 0.5) * 0.03; box(g, wall, 0.06, 0.04, 0.05, x, B, z); if (h % 5 === 0) { var r = new T.Mesh(new T.ConeGeometry(0.05, 0.04, 4), solid('#b89a5a', { flatShading: true })); r.rotation.y = Math.PI / 4; r.scale.z = 0.8; r.position.set(x, B + 0.06, z); g.add(r); } }
    box(g, solid('#a7c46e'), 0.25, 0.006, 0.08, 0.02, B, 0.07);
    // a llama and some clouds
    var l = solid('#f2ead8'); box(g, l, 0.04, 0.025, 0.02, 0.32, B + 0.025, 0.15); box(g, l, 0.01, 0.04, 0.01, 0.34, B + 0.04, 0.15);
    [[-0.4, 0.45, -0.3], [0.45, 0.6, -0.2]].forEach(function (q) { var c = new T.Mesh(new T.SphereGeometry(0.08, 8, 6), solid('#ffffff', { transparent: true, opacity: 0.85 })); c.scale.set(1.8, 0.5, 1); c.position.set(q[0], q[1], q[2]); g.add(c); });
    return g;
  };

  /* ---------- Moai (Ahu Akivi) ---------- */
  M.custom.moai = function () {
    var g = new T.Group(), rock = mat(tex('moairock', 32, 32, function (c, W, H) { c.fillStyle = '#6e6862'; c.fillRect(0, 0, W, H); for (var i = 0; i < 100; i++) { c.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '200,190,170' : '30,30,30') + ',.15)'; c.fillRect(Math.random() * W, Math.random() * H, 2, 2); } }), 1, 1, { flatShading: true });
    blob(g, '#3f9edb', 0.74, 0.62, 0, 0, 0.006, 9);
    blob(g, '#7fbf5c', 0.6, 0.48, 0, -0.04, 0.014, 2);
    box(g, mat(stoneTex('ahu', '#8a857a', '#6e695f', 10, 5), 4, 1), 0.86, 0.05, 0.16, 0, 0.014, 0);
    for (var i = 0; i < 7; i++) {
      var x = -0.36 + i * 0.12, s = 0.9 + hash(i, 1) * 0.2, m = new T.Group(); m.position.set(x, 0.064, 0); m.scale.setScalar(s); g.add(m);
      box(m, rock, 0.07, 0.17, 0.05, 0, 0, 0);
      box(m, rock, 0.075, 0.13, 0.07, 0, 0.17, 0.004);
      box(m, rock, 0.077, 0.02, 0.02, 0, 0.255, 0.035);
      box(m, rock, 0.02, 0.06, 0.03, 0, 0.185, 0.045);
      [-1, 1].forEach(function (k) { box(m, rock, 0.012, 0.08, 0.03, k * 0.043, 0.17, 0); box(m, solid('#4a4642'), 0.018, 0.012, 0.004, k * 0.017, 0.235, 0.039); });
      box(m, solid('#5d5853'), 0.04, 0.008, 0.004, 0, 0.19, 0.039);
      if (i % 3 === 1) cyl(m, solid('#a8452e'), 0.034, 0.036, 0.035, 0, 0.3, 0.004, 10);
    }
    return g;
  };

  /* ---------- Obelisco (Buenos Aires) ---------- */
  M.custom.obelisk = function () {
    var g = new T.Group();
    var road = tex('avenida', 64, 64, function (c, W, H) { c.fillStyle = '#5a5e66'; c.fillRect(0, 0, W, H); c.fillStyle = '#f2f2f2'; for (var x = 8; x < W; x += 12) for (var y = 0; y < H; y += 10) c.fillRect(x, y, 1.5, 5); });
    blob(g, '#c9c9c9', 0.7, 0.62, 0, 0, 0.006, 4);
    box(g, mat(road, 1, 6), 0.42, 0.01, 1.2, 0, 0, 0);
    box(g, mat(road, 4, 1), 1.2, 0.01, 0.16, 0, 0, 0);
    var plaza = new T.Mesh(new T.CylinderGeometry(0.13, 0.13, 0.014, 24), solid('#6cbf5c')); plaza.position.y = 0.007; g.add(plaza);
    var ob = new T.Mesh(new T.CylinderGeometry(0.035, 0.06, 0.9, 4), solid('#f4f2ec')); ob.rotation.y = Math.PI / 4; ob.position.y = 0.46; g.add(ob);
    var tip = new T.Mesh(new T.ConeGeometry(0.035 * Math.SQRT2 / Math.SQRT2, 0.06, 4), solid('#e6e3db')); tip.rotation.y = Math.PI / 4; tip.position.y = 0.94; g.add(tip);
    box(g, solid('#2f3640'), 0.012, 0.03, 0.002, 0, 0.05, 0.05);
    var city = [mat(winTex('baa', '#e8dfcf', '#5a6a7c', 3, 5), 1, 2), mat(winTex('bab', '#d6dbe2', '#3f5068', 3, 6), 1, 2), mat(winTex('bac', '#f0e2c8', '#6a5a4a', 3, 4), 1, 2)];
    [[-0.36, -0.36], [0.36, -0.36], [-0.36, 0.36], [0.36, 0.36]].forEach(function (q, b) { for (var i = 0; i < 3; i++) box(g, city[(b + i) % 3], 0.1, 0.1 + hash(b, i) * 0.15, 0.1, q[0] + (i - 1) * 0.11, 0, q[1] + (b < 2 ? -0.05 : 0.05)); });
    for (var t = 0; t < 8; t++) { tree(g, -0.24, -0.5 + t * 0.14, 0.7, '#5aa35a'); tree(g, 0.24, -0.5 + t * 0.14, 0.7, '#5aa35a'); }
    return g;
  };
})();
