/* Detailed landmarks, batch 16: Sydney Harbour Bridge, Hagia Sophia, Arc de Triomphe, Louvre,
   Moscow Kremlin, Empire State Building, Temple of Heaven, Marina Bay Sands. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 16, 9, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function water(g, w, d, x, z, col) { var p = new T.Mesh(new T.PlaneGeometry(w, d), solid(col || '#3f8fc0')); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.008, z); g.add(p); return p; }

  /* ---------- Sydney Harbour Bridge ---------- */
  M.custom.harbourbridge = function () {
    var g = new T.Group(), steel = solid('#7a8590'), stone = mat(stoneTex('shbst', '#d8ccb0', '#b8ac90', 6, 10), 1, 2);
    water(g, 1.5, 0.5, 0, 0, '#2f7fb8');
    [-0.62, 0.62].forEach(function (x) { blob(g, '#7aa858', 0.2, 0.42, x, 0, 0.02, x > 0 ? 2 : 6); });
    // the great arch (two curved chords with lattice between)
    function chord(y0, h) { var pts = []; for (var i = 0; i <= 24; i++) { var t = i / 24, x = -0.4 + t * 0.8; pts.push(new T.Vector3(x, y0 + h * (1 - Math.pow((x / 0.4), 2)), 0)); } return new T.CatmullRomCurve3(pts); }
    var top = chord(0.08, 0.3), bot = chord(0.04, 0.24);
    [-0.04, 0.04].forEach(function (z) { [top, bot].forEach(function (c) { var m = new T.Mesh(new T.TubeGeometry(c, 24, 0.008, 4), steel); m.position.z = z; g.add(m); }); for (var i = 0; i <= 16; i++) { var t = i / 16, a = top.getPoint(t), b = bot.getPoint(t), L = a.distanceTo(b), v = box(g, steel, 0.004, L, 0.004, b.x, b.y, z); v.rotation.z = 0; } });
    for (var k = 1; k < 16; k++) { var p = bot.getPoint(k / 16); box(g, steel, 0.004, 0.004, 0.08, p.x, p.y, 0); }
    // the deck hanging from the arch
    box(g, solid('#5a6068'), 1.3, 0.012, 0.1, 0, 0.13, 0);
    for (var h = 1; h < 12; h++) { var x = -0.36 + h * 0.06, y = 0.04 + 0.24 * (1 - Math.pow(x / 0.4, 2)); if (y > 0.14) [-0.04, 0.04].forEach(function (z) { box(g, steel, 0.003, y - 0.14, 0.003, x, 0.14, z); }); }
    // the four granite pylons
    [-0.44, 0.44].forEach(function (x) { [-0.05, 0.05].forEach(function (z) { box(g, stone, 0.06, 0.24, 0.05, x, 0, z * 1.3); }); });
    // a peek of the Opera House sails
    for (var s = 0; s < 3; s++) { var sh = new T.Mesh(new T.SphereGeometry(0.06 - s * 0.012, 8, 6, 0, Math.PI, 0, Math.PI / 2), solid('#f6f4ee')); sh.rotation.set(0, Math.PI / 2, -0.4); sh.position.set(0.55 + s * 0.04, 0.03, 0.32); g.add(sh); }
    return g;
  };

  /* ---------- Hagia Sophia ---------- */
  M.custom.hagiasophia = function () {
    var g = new T.Group(), wall = mat(stoneTex('hsw', '#e0a882', '#c98e6a', 10, 5), 3, 1), wallP = solid('#e6b08a'), lead = solid('#7a8a94'), min = solid('#f2ece2');
    blob(g, '#9ab070', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, wall, 0.42, 0.16, 0.42, 0, 0.006, 0);
    [[0, 0.24], [0, -0.24]].forEach(function (q) { box(g, wall, 0.22, 0.13, 0.08, q[0], 0.006, q[1]); dome(g, lead, 0.1, q[0], 0.17, q[1] * 0.85, 0.6); });
    [[0.24, 0], [-0.24, 0]].forEach(function (q) { box(g, wall, 0.08, 0.2, 0.3, q[0], 0.006, q[1]); });
    cyl(g, wallP, 0.15, 0.16, 0.05, 0, 0.166, 0, 20);
    for (var i = 0; i < 20; i++) { var a = i / 20 * D2; box(g, solid('#f6e8d0'), 0.014, 0.02, 0.004, Math.cos(a) * 0.158, 0.18, Math.sin(a) * 0.158).rotation.y = -a + Math.PI / 2; }
    dome(g, lead, 0.15, 0, 0.216, 0, 0.55); cyl(g, solid('#d8ad4c'), 0.002, 0.004, 0.04, 0, 0.3, 0, 4);
    // four slender minarets
    [[0.3, 0.3], [-0.3, 0.3], [0.3, -0.3], [-0.3, -0.3]].forEach(function (q) { cyl(g, min, 0.016, 0.02, 0.4, q[0], 0.006, q[1], 10); cyl(g, min, 0.024, 0.024, 0.008, q[0], 0.32, q[1], 10); cyl(g, lead, 0, 0.018, 0.08, q[0], 0.406, q[1], 10); });
    [[-0.55, 0.35], [0.55, 0.35], [0.55, -0.4], [-0.55, -0.4]].forEach(function (q) { tree(g, q[0], q[1], 1.2, '#3f8f45'); });
    return g;
  };

  /* ---------- Arc de Triomphe ---------- */
  M.custom.arc = function () {
    var g = new T.Group(), st = mat(tex('arcst', 64, 64, function (c, W, H) { c.fillStyle = '#e8dfcc'; c.fillRect(0, 0, W, H); c.fillStyle = '#d4c9b2'; for (var y = 0; y < H; y += 6) c.fillRect(0, y, W, 1); c.fillStyle = '#c9bca2'; c.fillRect(8, 16, 16, 20); c.fillRect(40, 16, 16, 20); }), 2, 2);
    blob(g, '#c9c2b0', 0.74, 0.62, 0, 0, 0.006, 2);
    var plaza = new T.Mesh(new T.CircleGeometry(0.42, 32), solid('#d8d2c2')); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.008; g.add(plaza);
    // twelve avenues radiating like a star
    for (var i = 0; i < 12; i++) { var a = i / 12 * D2, av = box(g, solid('#bfb8a6'), 0.06, 0.004, 0.36, Math.cos(a) * 0.55, 0.006, Math.sin(a) * 0.55); av.rotation.y = -a + Math.PI / 2; for (var t = 0; t < 3; t++) [-1, 1].forEach(function (s) { var r = 0.46 + t * 0.09, px = Math.cos(a) * r - Math.sin(a) * s * 0.05, pz = Math.sin(a) * r + Math.cos(a) * s * 0.05; var c = new T.Mesh(new T.SphereGeometry(0.018, 6, 5), solid('#4f8a3a', { flatShading: true })); c.position.set(px, 0.03, pz); g.add(c); }); }
    // the arch: two massive piers, a vault, and a cornice
    var A = new T.Group();
    [-0.1, 0.1].forEach(function (x) { box(A, st, 0.1, 0.26, 0.14, x, 0, 0); });
    box(A, st, 0.3, 0.1, 0.14, 0, 0.26, 0); box(A, solid('#d8ccb0'), 0.32, 0.02, 0.16, 0, 0.36, 0);
    var v = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.14, 12, 1, false, -Math.PI / 2, Math.PI), st); v.rotation.x = Math.PI / 2; v.position.set(0, 0.26, 0); A.add(v);
    var side = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.3, 10, 1, false, -Math.PI / 2, Math.PI), st); side.rotation.z = Math.PI / 2; side.position.set(0, 0.17, 0); A.add(side);
    [-0.1, 0.1].forEach(function (x) { [-0.071, 0.071].forEach(function (z) { box(A, solid('#d4c8ae'), 0.06, 0.08, 0.004, x, 0.06, z); }); });
    A.position.y = 0.008; g.add(A);
    var fl = new T.Mesh(new T.BoxGeometry(0.04, 0.026, 0.002), mat(tex('frflag', 24, 16, function (c) { c.fillStyle = '#0055a4'; c.fillRect(0, 0, 8, 16); c.fillStyle = '#fff'; c.fillRect(8, 0, 8, 16); c.fillStyle = '#ef4135'; c.fillRect(16, 0, 8, 16); }), 1, 1)); fl.position.set(0, 0.2, 0); g.add(fl);
    return g;
  };

  /* ---------- Louvre (glass pyramid) ---------- */
  M.custom.louvre = function () {
    var g = new T.Group(), pal = mat(winTex('lvw', '#e8dfcc', '#4a5060', 10, 2, { tall: 0.55 }), 6, 1), slate = solid('#4f5866');
    var glass = mat(tex('lvglass', 64, 64, function (c, W, H) { c.fillStyle = '#9fd0e8'; c.fillRect(0, 0, W, H); c.strokeStyle = '#5a6a7a'; c.lineWidth = 1.5; for (var i = -64; i < 128; i += 8) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 64, H); c.moveTo(i + 64, 0); c.lineTo(i, H); c.stroke(); } }), 2, 2, { transparent: true, opacity: 0.85 });
    blob(g, '#c9c2b0', 0.74, 0.62, 0, 0, 0.006, 2);
    box(g, solid('#d8d2c2'), 0.8, 0.006, 0.6, 0, 0.006, 0.05);
    // the palace wings in a U shape
    [[0, -0.32, 0.9, 0.12], [-0.4, 0.04, 0.12, 0.6], [0.4, 0.04, 0.12, 0.6]].forEach(function (q) { box(g, pal, q[2], 0.12, q[3], q[0], 0.006, q[1]); var r = new T.Group(); prism(r, slate, Math.min(q[2], q[3]) + 0.01, 0.06, Math.max(q[2], q[3]), 0, 0, 0); r.position.set(q[0], 0.126, q[1]); r.rotation.y = q[2] > q[3] ? Math.PI / 2 : 0; g.add(r); });
    [[-0.4, -0.32], [0.4, -0.32]].forEach(function (q) { box(g, pal, 0.14, 0.16, 0.14, q[0], 0.006, q[1]); var rf = new T.Mesh(new T.CylinderGeometry(0.03, 0.1, 0.08, 4), slate); rf.rotation.y = Math.PI / 4; rf.position.set(q[0], 0.206, q[1]); g.add(rf); });
    // the glass pyramid and its pools
    var py = new T.Mesh(new T.ConeGeometry(0.15, 0.17, 4, 1), glass); py.rotation.y = Math.PI / 4; py.position.set(0, 0.091, 0.08); g.add(py);
    [[-0.17, 0.08], [0.17, 0.08], [0, 0.26]].forEach(function (q) { var tri = new T.Mesh(new T.CircleGeometry(0.07, 3), solid('#5fb0d8')); tri.rotation.x = -Math.PI / 2; tri.position.set(q[0], 0.01, q[1]); g.add(tri); var sm = new T.Mesh(new T.ConeGeometry(0.03, 0.04, 4), glass); sm.rotation.y = Math.PI / 4; sm.position.set(q[0] * 1.5, 0.026, q[1] + (q[0] ? 0.1 : 0.0)); if (!q[0]) g.add(sm); });
    return g;
  };

  /* ---------- Moscow Kremlin ---------- */
  M.custom.kremlin = function () {
    var g = new T.Group(), brick = mat(stoneTex('krb', '#b8402e', '#9a3424', 12, 6), 8, 1), red = solid('#b8402e'), green = solid('#3f7a5a'), gold = solid('#e8b52a', { emissive: '#4a3200' }), white = solid('#f4efe4');
    blob(g, '#8ab070', 0.74, 0.62, 0, 0, 0.006, 3);
    water(g, 1.5, 0.16, 0, 0.5, '#5a8aa8');
    // triangular red wall with swallow-tail battlements
    var pts = [[-0.5, 0.36], [0.5, 0.36], [0.1, -0.45]];
    for (var i = 0; i < 3; i++) { var a = pts[i], b = pts[(i + 1) % 3], L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = box(g, brick, L, 0.06, 0.03, (a[0] + b[0]) / 2, 0.006, (a[1] + b[1]) / 2); w.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]); for (var k = 0; k < 12; k++) { var t = (k + 0.5) / 12, c = box(g, red, 0.012, 0.02, 0.032, a[0] + (b[0] - a[0]) * t, 0.066, a[1] + (b[1] - a[1]) * t); c.rotation.y = w.rotation.y; } }
    // towers with green tent roofs and red stars
    function tower(x, z, h, s) { box(g, brick, 0.06 * s, h, 0.06 * s, x, 0.006, z); box(g, red, 0.045 * s, 0.05, 0.045 * s, x, 0.006 + h, z); var r = new T.Mesh(new T.ConeGeometry(0.04 * s, 0.1 * s, 8), green); r.position.set(x, 0.056 + h + 0.05 * s, z); g.add(r); var st = new T.Mesh(new T.OctahedronGeometry(0.012 * s, 0), solid('#e8302a', { emissive: '#6a0a00' })); st.position.set(x, 0.07 + h + 0.1 * s, z); g.add(st); }
    tower(0.12, 0.36, 0.2, 1.4); tower(-0.5, 0.36, 0.1, 1); tower(0.5, 0.36, 0.12, 1); tower(0.1, -0.45, 0.1, 1); tower(-0.2, -0.04, 0.12, 1);
    // the Grand Kremlin Palace and cathedrals with golden domes
    box(g, mat(winTex('krp', '#efe2c8', '#4a5060', 8, 2, { tall: 0.5 }), 4, 1), 0.36, 0.1, 0.1, 0.05, 0.006, 0.22); box(g, green, 0.37, 0.02, 0.11, 0.05, 0.106, 0.22);
    [[-0.05, 0.02], [0.15, 0.02], [0.05, -0.12]].forEach(function (q, k) { box(g, white, 0.08, 0.08, 0.08, q[0], 0.006, q[1]); [[0, 0, 0.03], [0.025, 0.025, 0.018], [-0.025, 0.025, 0.018], [0.025, -0.025, 0.018], [-0.025, -0.025, 0.018]].forEach(function (d) { cyl(g, white, d[2] * 0.7, d[2] * 0.7, 0.03, q[0] + d[0], 0.086, q[1] + d[1], 8); var o = new T.Mesh(new T.SphereGeometry(d[2], 10, 8), gold); o.scale.y = 1.3; o.position.set(q[0] + d[0], 0.12 + d[2] * 0.6, q[1] + d[1]); g.add(o); }); });
    cyl(g, white, 0.03, 0.035, 0.3, 0.2, 0.006, -0.18, 8); var bd = new T.Mesh(new T.SphereGeometry(0.028, 10, 8), gold); bd.scale.y = 1.3; bd.position.set(0.2, 0.33, -0.18); g.add(bd); // Ivan the Great bell tower
    return g;
  };

  /* ---------- Empire State Building ---------- */
  M.custom.empirestate = function () {
    var g = new T.Group(), facade = mat(tex('esb', 32, 64, function (c, W, H) { c.fillStyle = '#c9c2b4'; c.fillRect(0, 0, W, H); c.fillStyle = '#5a6a7a'; for (var y = 2; y < H; y += 4) for (var x = 2; x < W; x += 4) c.fillRect(x, y, 2, 2.5); c.fillStyle = '#b0a898'; for (var x2 = 0; x2 < W; x2 += 8) c.fillRect(x2, 0, 1.5, H); }), 2, 6);
    blob(g, '#bdb8ac', 0.7, 0.6, 0, 0, 0.006, 2);
    // a few neighbouring Manhattan blocks
    for (var i = 0; i < 12; i++) { var a = i / 12 * D2, r = 0.42 + hash(i, 1) * 0.12, h = 0.08 + hash(i, 2) * 0.12; box(g, mat(winTex('nyb' + (i % 3), ['#b8a890', '#9aa3ad', '#c9b8a0'][i % 3], '#3a4450', 4, 4, { tall: 0.5 }), 1, 1), 0.1, h, 0.1, Math.cos(a) * r, 0.006, Math.sin(a) * r); }
    // the stepped tower
    [[0.26, 0.05], [0.2, 0.06], [0.16, 0.36], [0.12, 0.06], [0.09, 0.05], [0.06, 0.03]].reduce(function (y, s) { box(g, facade, s[0], s[1], s[0] * 0.8, 0, y, 0); return y + s[1]; }, 0.006);
    cyl(g, solid('#d8d2c4'), 0.02, 0.03, 0.06, 0, 0.616, 0, 8); cyl(g, solid('#c9c2b4'), 0.006, 0.02, 0.08, 0, 0.676, 0, 8); cyl(g, solid('#8a8f96'), 0.002, 0.004, 0.12, 0, 0.756, 0, 4);
    return g;
  };

  /* ---------- Temple of Heaven ---------- */
  M.custom.templeofheaven = function () {
    var g = new T.Group(), blue = solid('#2a4fa8', { flatShading: true }), red = solid('#b8322a'), marble = mat(stoneTex('tohm', '#f2efe8', '#d8d4ca', 16, 4), 4, 1), gold = solid('#e8b52a', { emissive: '#4a3200' });
    var band = mat(tex('tohb', 64, 16, function (c, W, H) { c.fillStyle = '#2f7a6a'; c.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 12) { c.fillStyle = '#3f6fb0'; c.fillRect(x + 1, 3, 6, 10); c.fillStyle = '#e8c04a'; c.fillRect(x + 8, 5, 3, 6); } }), 6, 1);
    blob(g, '#7aa858', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#d8d2c2'), 0.12, 0.006, 1.1, 0, 0.006, 0);
    // three round white marble terraces
    [[0.36, 0], [0.3, 0.04], [0.24, 0.08]].forEach(function (q) { cyl(g, marble, q[0], q[0], 0.04, 0, q[1] + 0.006, 0, 32); for (var i = 0; i < 28; i++) { var a = i / 28 * D2; cyl(g, solid('#f6f4ee'), 0.004, 0.004, 0.02, Math.cos(a) * q[0], q[1] + 0.046, Math.sin(a) * q[0], 4); } });
    // the Hall of Prayer for Good Harvests: three blue roofs
    var Y = 0.126; cyl(g, red, 0.15, 0.15, 0.07, 0, Y, 0, 20);
    [[0.22, 0.05, 0.07], [0.17, 0.045, 0.05], [0.12, 0.05, 0.03]].reduce(function (y, r, k) { cyl(g, band, r[0] * 0.75, r[0] * 0.75, 0.02, 0, y, 0, 20); var rf = new T.Mesh(new T.ConeGeometry(r[0], r[1], 20, 1, true), blue); rf.material.side = T.DoubleSide; rf.position.set(0, y + 0.02 + r[1] / 2, 0); g.add(rf); if (k < 2) cyl(g, red, r[0] * 0.6, r[0] * 0.6, r[2], 0, y + 0.02 + r[1] * 0.5, 0, 16); return y + 0.02 + r[1] * 0.5 + r[2]; }, Y + 0.07);
    var top = new T.Mesh(new T.SphereGeometry(0.022, 10, 8), gold); top.position.y = 0.48; g.add(top);
    for (var t = 0; t < 14; t++) { var a2 = t / 14 * D2; tree(g, Math.cos(a2) * 0.58, Math.sin(a2) * 0.5, 1.2, '#2f6b3a'); }
    return g;
  };

  /* ---------- Marina Bay Sands ---------- */
  M.custom.marinabay = function () {
    var g = new T.Group(), glass = mat(winTex('mbs', '#bfd8e8', '#5a7a9a', 4, 10, { tall: 0.5 }), 1, 2);
    water(g, 1.5, 0.5, 0, 0.3, '#3f8fb8');
    blob(g, '#9ab070', 0.72, 0.3, 0, -0.3, 0.012, 3);
    // three towers that lean in like cards, with the SkyPark on top
    [-0.2, 0, 0.2].forEach(function (x) { [-1, 1].forEach(function (s) { var leg = box(g, glass, 0.08, 0.46, 0.05, x, 0.012, -0.12 + s * 0.035); leg.rotation.x = s * -0.06; }); });
    var sp = new T.Mesh(new T.BoxGeometry(0.66, 0.025, 0.08), solid('#e8ecf0')); sp.position.set(0.04, 0.48, -0.12); g.add(sp);
    box(g, solid('#3fb8d8'), 0.24, 0.006, 0.05, -0.12, 0.492, -0.12); // the rooftop pool
    for (var t = 0; t < 6; t++) { var c = new T.Mesh(new T.SphereGeometry(0.012, 6, 5), solid('#3f8f45')); c.position.set(0.05 + t * 0.04, 0.5, -0.12); g.add(c); }
    // the lotus ArtScience Museum and Supertrees
    for (var p = 0; p < 7; p++) { var pet = new T.Mesh(new T.SphereGeometry(0.05, 8, 6, 0, Math.PI), solid('#f2f0ea')); pet.scale.set(0.5, 1, 0.3); pet.rotation.y = p / 7 * Math.PI; pet.position.set(0.4, 0.05, 0.1); g.add(pet); }
    [[-0.45, -0.38], [-0.35, -0.42], [-0.4, -0.28]].forEach(function (q) { var st = lathe([[0.006, 0], [0.008, 0.08], [0.02, 0.14], [0.05, 0.17], [0, 0.17]], 10, solid('#7a3a8a')); st.position.set(q[0], 0.012, q[1]); g.add(st); });
    return g;
  };
})();
