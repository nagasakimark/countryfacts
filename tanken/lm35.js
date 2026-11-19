/* Detailed landmarks, batch 35: Library of Celsus, Obelisk of Aksum, Faisal Mosque, Imperial City of Huế,
   Chan Chan, Hwaseong Fortress, Mosque–Cathedral of Córdoba, Fasil Ghebbi. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }
  function curvedRoof(g, m, w, d, h, x, y, z, ry) { // East Asian roof with upturned eaves
    var s = new T.Shape(); s.moveTo(-d / 2 - 0.012, -0.004); s.quadraticCurveTo(-d / 4, h * 0.25, 0, h); s.quadraticCurveTo(d / 4, h * 0.25, d / 2 + 0.012, -0.004); s.lineTo(-d / 2 - 0.012, -0.004);
    var r = new T.Mesh(new T.ExtrudeGeometry(s, { depth: w, bevelEnabled: false }), m); r.rotation.y = Math.PI / 2; var o = new T.Group(); r.position.set(-w / 2, 0, 0); o.add(r); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o); return o; }

  /* ---------- Library of Celsus, Ephesus ---------- */
  M.custom.celsus = function () {
    var g = new T.Group(), mar = mat(stoneTex('cls', '#e8e0d0', '#d0c8b8', 6, 6), 1, 1), w = solid('#f2ece0');
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    // a two-storey marble facade, all that stands of a great Roman library
    var Y = 0.006, Z = -0.08;
    box(g, solid('#d8d0c0'), 0.4, 0.03, 0.12, 0, Y, Z + 0.04);
    for (var s = 0; s < 4; s++) box(g, solid('#e0d8c8'), 0.2, 0.008 * (s + 1), 0.02, 0, Y, Z + 0.12 + (3 - s) * 0.02);
    box(g, mar, 0.38, 0.32, 0.03, 0, Y + 0.03, Z - 0.02);
    // lower storey: four pairs of columns with pediments between them, three doors
    for (var p = 0; p < 4; p++) { var x = -0.15 + p * 0.1; [-0.012, 0.012].forEach(function (o) { cyl(g, w, 0.008, 0.008, 0.13, x + o, Y + 0.03, Z + 0.04, 8); }); box(g, w, 0.05, 0.015, 0.04, x, Y + 0.16, Z + 0.04); }
    [-0.1, 0, 0.1].forEach(function (x) { box(g, solid('#3a3020'), 0.04, 0.08, 0.002, x, Y + 0.03, Z - 0.004); });
    // upper storey columns shifted to sit between the lower pairs, with pediments
    for (var u = 0; u < 3; u++) { var ux = -0.1 + u * 0.1; [-0.012, 0.012].forEach(function (o) { cyl(g, w, 0.007, 0.007, 0.11, ux + o, Y + 0.175, Z + 0.035, 8); }); var ped = new T.Mesh(new T.ConeGeometry(0.03, 0.025, 3), w); ped.rotation.set(Math.PI / 2, 0, 0); ped.scale.set(1.3, 0.3, 1); ped.position.set(ux, Y + 0.3, Z + 0.035); g.add(ped); }
    // statues of Wisdom, Knowledge, Intelligence and Virtue in niches
    for (var n = 0; n < 4; n++) { var st = new T.Mesh(new T.CapsuleGeometry(0.008, 0.03, 3, 6), w); st.position.set(-0.15 + n * 0.1, Y + 0.075, Z + 0.01); g.add(st); }
    // the marble street with column stumps, and a cat
    for (var c = 0; c < 8; c++) cyl(g, w, 0.01, 0.01, 0.02 + hash(c, 1) * 0.06, -0.4 + (c % 2) * 0.8, 0.006, -0.2 + Math.floor(c / 2) * 0.13, 8);
    var cat = new T.Mesh(new T.CapsuleGeometry(0.006, 0.014, 3, 5), solid('#e8a050')); cat.rotation.z = Math.PI / 2; cat.position.set(0.12, 0.012, 0.15); g.add(cat);
    return g;
  };

  /* ---------- Obelisk of Aksum ---------- */
  M.custom.aksum = function () {
    var g = new T.Group(), gran = mat(tex('aks', 16, 128, function (c, W, H) { c.fillStyle = '#9a9488'; c.fillRect(0, 0, W, H); c.fillStyle = '#6a6458'; for (var y = 10; y < H - 6; y += 12) { c.fillRect(2, y, W - 4, 2); for (var x = 3; x < W - 3; x += 4) c.fillRect(x, y + 4, 2, 4); } c.fillRect(5, H - 8, 6, 8); }), 1, 1);
    blob(g, '#a8a068', 0.74, 0.62, 0, 0, 0.006, 3);
    // carved granite stelae like many-storey towers, with false doors and windows
    function stela(x, z, h, w, lean) { var s = new T.Mesh(new T.BoxGeometry(w, h, w * 0.5), gran); s.position.set(x, 0.006 + h / 2, z); s.rotation.z = lean || 0; g.add(s); var tp = new T.Mesh(new T.CylinderGeometry(w / 2, w / 2, w * 0.5, 12, 1, false, -Math.PI / 2, Math.PI), gran); tp.rotation.x = Math.PI / 2; tp.position.set(x - (lean || 0) * h / 2, 0.006 + h, z); g.add(tp); }
    stela(0, -0.05, 0.42, 0.06); stela(-0.18, 0.0, 0.32, 0.05); stela(0.17, -0.1, 0.28, 0.045, -0.08);
    for (var i = 0; i < 6; i++) { var sm = new T.Mesh(new T.BoxGeometry(0.02, 0.05 + hash(i, 1) * 0.05, 0.012), solid('#8a8478')); sm.position.set(-0.4 + i * 0.16, 0.04, 0.22 + hash(i, 2) * 0.08); g.add(sm); }
    var fallen = new T.Mesh(new T.BoxGeometry(0.5, 0.06, 0.03), gran); fallen.position.set(0.05, 0.03, 0.12); fallen.rotation.y = 0.2; g.add(fallen);
    // St Mary of Zion church in the background
    box(g, solid('#e8dcc4'), 0.12, 0.08, 0.1, -0.35, 0.006, -0.35); var dm = new T.Mesh(new T.SphereGeometry(0.04, 10, 6, 0, D2, 0, Math.PI / 2), solid('#5a8a7a')); dm.position.set(-0.35, 0.086, -0.35); g.add(dm);
    for (var t = 0; t < 5; t++) if (K.acacia) K.acacia(g, 0.25 + (t % 2) * 0.15, -0.3 + t * 0.12, 0.9);
    return g;
  };

  /* ---------- Faisal Mosque ---------- */
  M.custom.faisal = function () {
    var g = new T.Group(), w = solid('#f2f0ea', { flatShading: true }), gold = solid('#d8b04a');
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // the green Margalla Hills behind
    mountain(g, { h: 0.26, pos: [0, -0.4], rings: 10, r: function (t) { return 0.3 * (1 - t) + 0.02; }, sx: 1.4, sz: 0.45, bump: 0.3, colour: function () { return '#3f7a3a'; } });
    // a tent-shaped prayer hall like a Bedouin tent, with four pencil-thin minarets
    box(g, solid('#d8d4cc'), 0.5, 0.012, 0.5, 0, 0.006, 0.0);
    var tent = new T.Mesh(new T.ConeGeometry(0.17, 0.24, 8), w); tent.rotation.y = Math.PI / 8; tent.position.set(0, 0.018 + 0.12, -0.02); g.add(tent);
    var p = tent.geometry.attributes.position; for (var i = 0; i < p.count; i++) { var y = p.getY(i); if (y < 0.1 && y > -0.1) { p.setX(i, p.getX(i) * 0.82); p.setZ(i, p.getZ(i) * 0.82); } } tent.geometry.computeVertexNormals();
    var fin = new T.Mesh(new T.ConeGeometry(0.006, 0.04, 6), gold); fin.position.set(0, 0.278, -0.02); g.add(fin);
    [[-0.2, -0.22], [0.2, -0.22], [-0.2, 0.18], [0.2, 0.18]].forEach(function (q) { cyl(g, w, 0.012, 0.016, 0.42, q[0], 0.018, q[1], 8); cyl(g, w, 0.02, 0.02, 0.008, q[0], 0.3, q[1], 8); var tp = new T.Mesh(new T.ConeGeometry(0.012, 0.06, 8), w); tp.position.set(q[0], 0.468, q[1]); g.add(tp); });
    // a courtyard pool in front
    var pl = new T.Mesh(new T.PlaneGeometry(0.16, 0.08), solid('#5aa8c8')); pl.rotation.x = -Math.PI / 2; pl.position.set(0, 0.02, 0.18); g.add(pl);
    return g;
  };

  /* ---------- Imperial City of Huế ---------- */
  M.custom.hue = function () {
    var g = new T.Group(), wall = mat(stoneTex('hue', '#a89a80', '#8a7e66', 10, 3), 3, 1), red = solid('#b8302a'), yellow = solid('#e8b030', { flatShading: true }), wood = solid('#8a2a20');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    var moat = new T.Mesh(new T.PlaneGeometry(0.9, 0.08), solid('#5a8a8a')); moat.rotation.x = -Math.PI / 2; moat.position.set(0, 0.009, 0.3); moat.scale.x = 0.8; g.add(moat);
    var lotus = solid('#e88aa8'); for (var l = 0; l < 10; l++) { var lt = new T.Mesh(new T.SphereGeometry(0.006, 5, 4), lotus); lt.position.set(-0.3 + l * 0.065, 0.012, 0.3 + hash(l, 1) * 0.02); g.add(lt); }
    // the Meridian Gate: a wide stone base with three passages and a two-tier wooden pavilion with yellow-tile roofs
    var Y = 0.006, Z = 0.08;
    box(g, wall, 0.6, 0.1, 0.16, 0, Y, Z);
    [-0.14, 0, 0.14].forEach(function (x) { arch(g, solid('#2a2420'), x === 0 ? 0.06 : 0.045, 0.07, x, Y, Z + 0.081, 0.002); });
    box(g, wood, 0.36, 0.05, 0.1, 0, Y + 0.1, Z); for (var c = 0; c < 9; c++) cyl(g, red, 0.005, 0.005, 0.05, -0.16 + c * 0.04, Y + 0.1, Z + 0.05, 6);
    curvedRoof(g, yellow, 0.42, 0.14, 0.05, 0, Y + 0.15, Z);
    box(g, wood, 0.14, 0.03, 0.08, 0, Y + 0.19, Z); curvedRoof(g, yellow, 0.2, 0.11, 0.045, 0, Y + 0.22, Z);
    [-0.25, 0.25].forEach(function (x) { box(g, wood, 0.06, 0.04, 0.08, x, Y + 0.1, Z); curvedRoof(g, yellow, 0.09, 0.11, 0.04, x, Y + 0.14, Z); });
    // the Thai Hoa Palace beyond
    box(g, wood, 0.3, 0.06, 0.12, 0, Y, -0.25); curvedRoof(g, yellow, 0.34, 0.16, 0.06, 0, Y + 0.06, -0.25);
    for (var t = 0; t < 6; t++) tree(g, -0.48 + t * 0.19, -0.42, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- Chan Chan ---------- */
  M.custom.chanchan = function () {
    var g = new T.Group(), adobe = mat(tex('chc', 64, 32, function (c, W, H) { c.fillStyle = '#c9a878'; c.fillRect(0, 0, W, H); c.fillStyle = '#a8885a'; for (var y = 4; y < H; y += 8) for (var x = (y % 16 ? 0 : 4); x < W; x += 8) { c.fillRect(x, y, 6, 1); c.fillRect(x + 3, y - 3, 1, 3); } c.fillStyle = '#b89868'; for (var x2 = 0; x2 < W; x2 += 6) { c.beginPath(); c.arc(x2 + 3, 16, 2, 0, D2); c.fill(); } }), 3, 1);
    blob(g, '#d8c09a', 0.74, 0.62, 0, 0, 0.006, 3);
    // the largest adobe city in the Americas: high mud walls with fishnet and fish friezes, forming courtyards and mazes
    var walls = [[0, -0.3, 0.8, 0.025], [0, 0.32, 0.8, 0.025], [-0.4, 0.01, 0.025, 0.62], [0.4, 0.01, 0.025, 0.62], [-0.1, -0.08, 0.025, 0.42], [0.15, 0.08, 0.5, 0.025], [0.15, -0.12, 0.025, 0.38], [-0.25, 0.15, 0.3, 0.025], [0.28, -0.2, 0.22, 0.02]];
    walls.forEach(function (w, k) { box(g, adobe, w[2], k < 4 ? 0.1 : 0.07, w[3], w[0], 0.006, w[1]); });
    // a sunken reservoir (huachaque) with reeds, and a ceremonial ramp
    var wq = new T.Mesh(new T.PlaneGeometry(0.16, 0.12), solid('#5a8a7a')); wq.rotation.x = -Math.PI / 2; wq.position.set(-0.25, 0.008, -0.15); g.add(wq);
    for (var r = 0; r < 8; r++) cyl(g, solid('#7a9a4a'), 0.002, 0.002, 0.04, -0.32 + r * 0.02, 0.008, -0.2 + (r % 2) * 0.1, 3);
    var rp = new T.Mesh(new T.BoxGeometry(0.06, 0.008, 0.12), solid('#c9a878')); rp.rotation.x = 0.4; rp.position.set(0.28, 0.03, 0.2); g.add(rp);
    // a wooden walkway for visitors
    box(g, solid('#8a6a4a'), 0.3, 0.006, 0.03, 0.15, 0.008, -0.02);
    return g;
  };

  /* ---------- Hwaseong Fortress ---------- */
  M.custom.hwaseong = function () {
    var g = new T.Group(), st = mat(stoneTex('hws', '#c9c0b0', '#a8a090', 10, 3), 3, 1), tile = solid('#4a4a4a', { flatShading: true }), wood = solid('#a83a2a'), green = solid('#3f8a5a');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // a long stone wall running over a hill, with a grand gate and a pavilion
    mountain(g, { h: 0.12, pos: [0.25, -0.2], r: function (t) { return 0.3 * (1 - t) + 0.05; }, bump: 0.15, colour: function () { return '#5f9a45'; } });
    var pts = [[-0.55, 0.15], [-0.3, 0.1], [-0.05, 0.05], [0.15, -0.05], [0.28, -0.18], [0.35, -0.38]];
    for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), w = new T.Mesh(new T.BoxGeometry(len, 0.06, 0.03), st); var hy = (i > 2 ? (i - 2) * 0.05 : 0); w.position.set((a[0] + b[0]) / 2, 0.036 + hy, (a[1] + b[1]) / 2); w.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]); g.add(w);
      for (var k = 0; k < 4; k++) { var t = (k + 0.5) / 4, m = new T.Mesh(new T.BoxGeometry(0.03, 0.02, 0.032), st); m.position.set(a[0] + (b[0] - a[0]) * t, 0.076 + hy, a[1] + (b[1] - a[1]) * t); m.rotation.y = w.rotation.y; g.add(m); } }
    // Paldalmun-style gate: stone base with arch, two-tier wooden gatehouse with curved roofs
    var gx = -0.15, gz = 0.08, Y = 0.006;
    box(g, st, 0.18, 0.1, 0.1, gx, Y, gz); arch(g, solid('#2a2420'), 0.05, 0.07, gx, Y, gz + 0.051, 0.002);
    box(g, wood, 0.15, 0.04, 0.08, gx, Y + 0.1, gz); for (var c = 0; c < 6; c++) cyl(g, wood, 0.004, 0.004, 0.04, gx - 0.065 + c * 0.026, Y + 0.1, gz + 0.042, 5);
    curvedRoof(g, tile, 0.2, 0.12, 0.04, gx, Y + 0.14, gz); box(g, wood, 0.1, 0.03, 0.06, gx, Y + 0.17, gz); curvedRoof(g, tile, 0.14, 0.09, 0.035, gx, Y + 0.2, gz);
    var ring = new T.Mesh(new T.TorusGeometry(0.12, 0.012, 4, 20, Math.PI), st); ring.rotation.x = -Math.PI / 2; ring.position.set(gx, 0.03, gz + 0.04); g.add(ring);
    // a hilltop pavilion
    box(g, green, 0.06, 0.04, 0.06, 0.28, 0.17, -0.2); curvedRoof(g, tile, 0.08, 0.08, 0.03, 0.28, 0.21, -0.2);
    // colourful flags along the wall
    for (var f = 0; f < 5; f++) { cyl(g, solid('#8a6a4a'), 0.002, 0.002, 0.06, -0.5 + f * 0.12, 0.066, 0.13 - f * 0.02, 3); box(g, solid(['#e84a4a', '#e8c34a', '#3f6ab0', '#f6f2ea', '#3f8a3f'][f]), 0.02, 0.016, 0.002, -0.49 + f * 0.12, 0.11, 0.13 - f * 0.02); }
    return g;
  };

  /* ---------- Mosque–Cathedral of Córdoba ---------- */
  M.custom.cordoba = function () {
    var g = new T.Group(), st = mat(stoneTex('crd', '#d8c49a', '#c0ac80', 10, 4), 3, 1), tile = solid('#b8603a', { flatShading: true });
    blob(g, '#c9c0a8', 0.74, 0.62, 0, 0, 0.006, 3);
    // the great hall: a sea of red-and-white striped double arches (shown through an open side)
    var arc = mat(tex('crda', 32, 32, function (c, W, H) { c.fillStyle = '#2a2420'; c.fillRect(0, 0, W, H); for (var k = 0; k < 8; k++) { c.fillStyle = k % 2 ? '#b8402a' : '#f2e8d4'; c.beginPath(); c.moveTo(16, 30); c.arc(16, 30, 14, Math.PI + k * Math.PI / 8, Math.PI + (k + 1) * Math.PI / 8); c.fill(); } c.fillStyle = '#2a2420'; c.beginPath(); c.arc(16, 30, 9, Math.PI, 0); c.fill(); }), 1, 1);
    box(g, st, 0.6, 0.1, 0.4, -0.02, 0.006, -0.06);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 9; c++) { var a = new T.Mesh(new T.PlaneGeometry(0.06, 0.06), arc); a.position.set(-0.26 + c * 0.06, 0.06, 0.141 - r * 0.0005); if (r === 0) g.add(a); }
    box(g, solid('#8a8478'), 0.62, 0.012, 0.42, -0.02, 0.106, -0.06);
    for (var rf = 0; rf < 10; rf++) ridge(g, tile, 0.05, 0.03, 0.4, -0.29 + rf * 0.06, 0.118, -0.06, 0);
    // the cathedral nave rising out of the middle, and the bell tower (once a minaret)
    box(g, st, 0.12, 0.1, 0.24, 0.0, 0.106, -0.08); ridge(g, tile, 0.13, 0.05, 0.25, 0.0, 0.206, -0.08, 0);
    box(g, st, 0.07, 0.36, 0.07, 0.36, 0.006, 0.18); box(g, st, 0.05, 0.06, 0.05, 0.36, 0.366, 0.18); arch(g, solid('#2a2420'), 0.025, 0.03, 0.36, 0.38, 0.206, 0.002);
    var sp = new T.Mesh(new T.SphereGeometry(0.025, 10, 6, 0, D2, 0, Math.PI / 2), st); sp.position.set(0.36, 0.426, 0.18); g.add(sp); var an = new T.Mesh(new T.CapsuleGeometry(0.005, 0.015, 3, 5), solid('#d8b04a')); an.position.set(0.36, 0.465, 0.18); g.add(an);
    // the Courtyard of the Oranges
    for (var o = 0; o < 9; o++) { var x = 0.08 + (o % 3) * 0.08, z = 0.2 + Math.floor(o / 3) * 0.07; var tr = new T.Mesh(new T.SphereGeometry(0.025, 8, 6), solid('#3f7a35', { flatShading: true })); tr.position.set(x - 0.2, 0.04, z); g.add(tr); cyl(g, solid('#6a4a2a'), 0.003, 0.004, 0.02, x - 0.2, 0.006, z, 4); var fr = new T.Mesh(new T.SphereGeometry(0.005, 4, 3), solid('#ff8a1a')); fr.position.set(x - 0.19, 0.05, z + 0.015); g.add(fr); }
    return g;
  };

  /* ---------- Fasil Ghebbi, Gondar ---------- */
  M.custom.fasil = function () {
    var g = new T.Group(), st = mat(stoneTex('fsg', '#8a7a62', '#6a5c48', 8, 6), 1, 1), dome = solid('#7a6a52', { flatShading: true });
    blob(g, '#6a9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    // Fasilides' Castle: a stone castle with round domed corner towers and a tall square tower
    var Y = 0.006;
    box(g, st, 0.26, 0.16, 0.18, 0, Y, -0.05);
    for (var i = 0; i < 8; i++) box(g, st, 0.025, 0.02, 0.02, -0.11 + i * 0.032, Y + 0.16, 0.04);
    [[-0.13, -0.14], [0.13, -0.14], [-0.13, 0.04], [0.13, 0.04]].forEach(function (q, k) { var h = k === 3 ? 0.2 : 0.18; cyl(g, st, 0.04, 0.042, h, q[0], Y, q[1], 12); domeOn(g, dome, 0.042, 0.05, q[0], Y + h, q[1], 12); });
    box(g, st, 0.08, 0.28, 0.08, -0.04, Y, -0.1); for (var j = 0; j < 4; j++) box(g, st, 0.02, 0.02, 0.02, -0.07 + (j % 2) * 0.06, Y + 0.28, -0.13 + Math.floor(j / 2) * 0.06);
    for (var w = 0; w < 4; w++) arch(g, solid('#2a2420'), 0.025, 0.04, -0.09 + w * 0.06, Y + 0.06, 0.041, 0.002);
    // the enclosure wall and big sycamore and juniper trees
    var ring = new T.Mesh(new T.TorusGeometry(0.45, 0.012, 4, 30), st); ring.rotation.x = -Math.PI / 2; ring.scale.y = 0.82; ring.position.y = 0.025; g.add(ring);
    for (var t = 0; t < 8; t++) { var a = t / 8 * D2 + 0.3, c = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), solid('#3f7a35', { flatShading: true })); c.scale.y = 0.7; c.position.set(Math.cos(a) * 0.36, 0.11, Math.sin(a) * 0.3); g.add(c); cyl(g, solid('#6a4a2a'), 0.008, 0.012, 0.09, Math.cos(a) * 0.36, 0.006, Math.sin(a) * 0.3, 5); }
    return g;
  };
})();
