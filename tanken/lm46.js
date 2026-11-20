/* Detailed landmarks, batch 46: Temppeliaukio Church, Khami Ruins, Baikonur Cosmodrome, CERN Globe,
   Teatro Colón, St. Stephen's Cathedral, Cristo de la Concordia, Halley VI Research Station. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, prism = K.prism, hip = K.hip, arch = K.arch, acacia = K.acacia;
  var D2 = Math.PI * 2;
  function cone(g, m, r, h, x, y, z, seg, ry) { var c = new T.Mesh(new T.ConeGeometry(r, h, seg || 8), m); c.position.set(x, y + h / 2, z); if (ry) c.rotation.y = ry; g.add(c); return c; }
  function ball(g, m, r, x, y, z, sx, sy, sz) { var b = new T.Mesh(new T.SphereGeometry(r, 12, 8), m); b.position.set(x, y, z); b.scale.set(sx || 1, sy || 1, sz || 1); g.add(b); return b; }
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.007 * s, 0.01 * s, 0.035 * s, x, 0.006, z, 6); ball(g, solid('#5a3a28'), 0.0065 * s, x, 0.048 * s, z); }
  function rocky(geo, amt, seed) { var p = geo.attributes.position; for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = 1 + (noise(x * 9 + seed, z * 9 + y * 5) - 0.5) * amt; p.setXYZ(i, x * n, y, z * n); } geo.computeVertexNormals(); return geo; }

  /* ---------- Temppeliaukio Church, the Rock Church (Helsinki, Finland) ---------- */
  M.custom.temppeliaukio = function () {
    var g = new T.Group();
    blob(g, '#6f9a52', 0.86, 0.7, 0, 0, 0.004, 46);
    // a church dug down into a hill of bare granite (1969): only a low ring of rough rock shows above ground…
    var granite = solid('#8f8a86', { flatShading: true });
    var hill = new T.Mesh(rocky(new T.CylinderGeometry(0.36, 0.42, 0.1, 18, 2), 0.28, 3), granite); hill.position.y = 0.05; g.add(hill);
    for (var i = 0; i < 14; i++) { var a = i / 14 * D2, r = 0.26 + hash(i, 1) * 0.08, rk = new T.Mesh(new T.DodecahedronGeometry(0.035 + hash(i, 2) * 0.03, 0), solid(i % 2 ? '#9a948e' : '#7e7874', { flatShading: true })); rk.position.set(Math.cos(a) * r, 0.1 + hash(i, 3) * 0.02, Math.sin(a) * r); rk.scale.y = 0.7; g.add(rk); }
    // …a ring of glass windows lets daylight in between the rock and the roof…
    cyl(g, solid('#bfe4f2', { transparent: true, opacity: 0.85 }), 0.215, 0.215, 0.03, 0, 0.1, 0, 28);
    for (var b = 0; b < 28; b++) { var a2 = b / 28 * D2; box(g, solid('#d8dde0'), 0.006, 0.03, 0.006, Math.cos(a2) * 0.215, 0.1, Math.sin(a2) * 0.215); }
    // …and the flat dome on top is a huge coil of copper strip (about 22 km of it!)
    var cu = solid('#b8743c', { flatShading: true }), dome = lathe([[0.225, 0], [0.22, 0.012], [0.17, 0.03], [0.09, 0.042], [0, 0.046]], 28, cu); dome.position.y = 0.13; g.add(dome);
    for (var k = 1; k <= 6; k++) { var rr = k * 0.032, ring = new T.Mesh(new T.TorusGeometry(rr, 0.0025, 4, 36), solid(k % 2 ? '#d08a4a' : '#8a5428')); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.13 + 0.046 * (1 - Math.pow(rr / 0.225, 2)) + 0.002; g.add(ring); }
    // the entrance: a low concrete doorway cut into the rock, with a cross on top
    box(g, solid('#c9c6bd'), 0.1, 0.06, 0.07, 0, 0.0, 0.36); box(g, solid('#3a3a40'), 0.06, 0.045, 0.01, 0, 0.0, 0.396);
    box(g, solid('#c9c6bd'), 0.006, 0.05, 0.006, 0.0, 0.06, 0.36); box(g, solid('#c9c6bd'), 0.03, 0.006, 0.006, 0.0, 0.095, 0.36);
    // birch trees and the apartment blocks of the Töölö district around it
    [[-0.4, 0.28], [0.42, 0.25], [-0.42, -0.2], [0.4, -0.3], [0.2, 0.4]].forEach(function (q, j) { cyl(g, solid('#eeeae2'), 0.005, 0.007, 0.07, q[0], 0, q[1], 5); var c = new T.Mesh(new T.IcosahedronGeometry(0.035, 0), solid(j % 2 ? '#7aa84a' : '#5f8f3f', { flatShading: true })); c.position.set(q[0], 0.09, q[1]); c.scale.y = 1.3; g.add(c); });
    var flats = mat(winTex('tmpw', '#d8c7a4', '#4a5a66', 4, 5), 1, 1);
    [[-0.3, -0.42, 0], [0.12, -0.44, 0], [0.45, 0.0, Math.PI / 2]].forEach(function (q) { var f = box(g, flats, 0.2, 0.14, 0.08, q[0], 0, q[1]); f.rotation.y = q[2]; });
    for (var p = 0; p < 4; p++) person(g, -0.05 + p * 0.03, 0.44, 1.1, ['#2b6fd6', '#e8a83a', '#ffffff', '#c0392b'][p]);
    return g;
  };

  /* ---------- Khami Ruins (Zimbabwe) ---------- */
  M.custom.khami = function () {
    var g = new T.Group();
    blob(g, '#b9a865', 0.86, 0.72, 0, 0, 0.004, 47);
    // the stone capital of a kingdom about 500 years ago, built on a hill as a stack of terraces…
    var st = mat(stoneTex('khm', '#b49a72', '#8a7454', 12, 7), 3, 1), top = solid('#a89070', { flatShading: true });
    function terrace(w, d, h, x, y, z) { box(g, st, w, h, d, x, y, z); box(g, top, w * 0.98, 0.006, d * 0.98, x, y + h, z); }
    terrace(0.62, 0.5, 0.07, 0, 0, -0.05); terrace(0.44, 0.34, 0.06, -0.03, 0.07, -0.08); terrace(0.26, 0.2, 0.05, -0.05, 0.13, -0.1);
    // …with no mortar at all: thin granite blocks fitted together, decorated with chequer and herringbone patterns
    var chq = tex('khmchk', 64, 16, function (x, w, h) { x.fillStyle = '#b49a72'; x.fillRect(0, 0, w, h); x.fillStyle = '#4a3a2a'; for (var i = 0; i < 8; i++) for (var j = 0; j < 2; j++) if ((i + j) % 2) x.fillRect(i * 8, j * 8, 8, 8); });
    var band = mat(chq, 8, 1);
    [[0, 0.03, 0.2, 0.62], [-0.03, 0.1, 0.09, 0.44], [-0.05, 0.155, -0.0, 0.26]].forEach(function (q) { var b = new T.Mesh(new T.PlaneGeometry(q[3] * 0.9, 0.02), band); b.position.set(q[0], q[1], q[2] + 0.001); g.add(b); });
    var hb = tex('khmhb', 64, 16, function (x, w, h) { x.fillStyle = '#b49a72'; x.fillRect(0, 0, w, h); x.strokeStyle = '#5a4630'; x.lineWidth = 2; for (var i = -2; i < 10; i++) { x.beginPath(); x.moveTo(i * 8, 16); x.lineTo(i * 8 + 4, 0); x.lineTo(i * 8 + 8, 16); x.stroke(); } });
    var hbm = new T.Mesh(new T.PlaneGeometry(0.4, 0.018), mat(hb, 6, 1)); hbm.position.set(-0.03, 0.035, 0.172); g.add(hbm);
    // round thatched huts stood on the platforms
    [[-0.1, -0.12], [0.06, -0.15], [-0.05, -0.04]].forEach(function (q, j) { var y = j === 2 ? 0.186 : 0.13; cyl(g, solid('#b07a4a'), 0.03, 0.03, 0.03, q[0], y, q[1], 10); cone(g, solid('#c8a860', { flatShading: true }), 0.042, 0.04, q[0], y + 0.03, q[1], 10); });
    // fallen stones, a stone stairway, acacia trees and the river below
    for (var s = 0; s < 6; s++) box(g, st, 0.08, 0.008, 0.04, 0.22, s * 0.012, 0.25 - s * 0.03);
    for (var f = 0; f < 10; f++) box(g, top, 0.02, 0.01, 0.012, -0.35 + hash(f, 1) * 0.7, 0.004, 0.25 + hash(f, 2) * 0.15).rotation.y = hash(f, 3) * 3;
    [[-0.38, 0.3], [0.38, -0.3], [-0.4, -0.3], [0.36, 0.32]].forEach(function (q) { acacia(g, q[0], q[1], 1.3); });
    var riv = new T.Mesh(new T.PlaneGeometry(0.9, 0.06), solid('#4a8ab0')); riv.rotation.x = -Math.PI / 2; riv.rotation.z = 0.1; riv.position.set(0, 0.006, 0.42); g.add(riv);
    for (var p = 0; p < 3; p++) person(g, 0.1 + p * 0.03, 0.3, 1.1, ['#e8a83a', '#2b6fd6', '#ffffff'][p]);
    return g;
  };

  /* ---------- Baikonur Cosmodrome (Kazakhstan) ---------- */
  M.custom.baikonur = function () {
    var g = new T.Group();
    blob(g, '#c9b98a', 0.88, 0.72, 0, 0, 0.004, 48);
    // the world's first spaceport, out on the flat steppe: Sputnik (1957) and Yuri Gagarin (1961) both launched from here
    var conc = solid('#b8b6b0', { flatShading: true });
    box(g, conc, 0.5, 0.04, 0.4, 0, 0, 0);
    var trench = new T.Mesh(new T.BoxGeometry(0.14, 0.041, 0.42), solid('#3a3632')); trench.position.set(0, 0.02, 0.01); g.add(trench);
    // a Soyuz rocket: a central core and four boosters with pointed tops
    var white = solid('#eef0f2', { flatShading: true }), grey = solid('#9aa0a6', { flatShading: true }), orange = solid('#d8792e', { flatShading: true });
    var R = new T.Group(); R.position.set(0, 0.04, 0); g.add(R);
    cyl(R, white, 0.032, 0.026, 0.34, 0, 0.03, 0, 12); cyl(R, grey, 0.026, 0.032, 0.03, 0, 0.0, 0, 12);
    cyl(R, white, 0.03, 0.03, 0.09, 0, 0.37, 0, 12); cone(R, white, 0.03, 0.08, 0, 0.46, 0, 12); cyl(R, solid('#c0392b'), 0.004, 0.004, 0.05, 0, 0.53, 0, 5);
    box(R, orange, 0.064, 0.012, 0.064, 0, 0.36, 0);
    for (var i = 0; i < 4; i++) { var a = i / 4 * D2 + Math.PI / 4, x = Math.cos(a) * 0.045, z = Math.sin(a) * 0.045, bo = new T.Group(); bo.position.set(x, 0, z); R.add(bo); cyl(bo, white, 0.02, 0.026, 0.16, 0, 0.0, 0, 10); cone(bo, white, 0.02, 0.07, 0, 0.16, 0, 10); box(bo, grey, 0.002, 0.03, 0.03, Math.cos(a) * 0.024, 0.0, Math.sin(a) * 0.024).rotation.y = -a; cyl(bo, solid('#4a4a50'), 0.012, 0.018, 0.02, 0, -0.02, 0, 8); }
    // the service tower (gantry) and the swing-back support arms
    var red = solid('#c0392b', { flatShading: true }), steel = solid('#6a6e74', { flatShading: true });
    for (var s = 0; s < 2; s++) { var sx = s ? -0.13 : 0.13, tw = new T.Group(); tw.position.set(sx, 0.04, -0.03); g.add(tw);
      [[-0.025, -0.025], [0.025, -0.025], [-0.025, 0.025], [0.025, 0.025]].forEach(function (q) { box(tw, steel, 0.006, 0.42, 0.006, q[0], 0, q[1]); });
      for (var k = 0; k < 7; k++) box(tw, k % 2 ? red : steel, 0.056, 0.006, 0.056, 0, 0.03 + k * 0.06, 0);
      box(tw, red, 0.08, 0.008, 0.02, -Math.sign(sx) * 0.05, 0.3, 0); }
    // a little Sputnik on display, buses for the crowd, and the town far off
    ball(g, solid('#d8dce0'), 0.022, -0.3, 0.05, 0.28); for (var an = 0; an < 4; an++) { var ar = new T.Mesh(new T.CylinderGeometry(0.0015, 0.0015, 0.09, 4), solid('#d8dce0')); ar.position.set(-0.3 - 0.04, 0.04, 0.28 + (an - 1.5) * 0.008); ar.rotation.z = 1.2; g.add(ar); }
    cyl(g, conc, 0.008, 0.008, 0.03, -0.3, 0.0, 0.28, 6);
    [[0.3, 0.3], [0.36, 0.25]].forEach(function (q) { box(g, solid('#f2c230'), 0.07, 0.03, 0.03, q[0], 0.004, q[1]); });
    for (var p = 0; p < 4; p++) person(g, -0.2 + p * 0.03, 0.34, 1.1, ['#2b6fd6', '#e8a83a', '#ffffff', '#c0392b'][p]);
    return g;
  };

  /* ---------- The Globe of Science and Innovation, CERN (Switzerland) ---------- */
  M.custom.cernglobe = function () {
    var g = new T.Group();
    blob(g, '#6f9a52', 0.86, 0.72, 0, 0, 0.004, 49);
    // the ring of the Large Hadron Collider is 27 km round, 100 m under the fields of Switzerland and France: here a glowing line on the grass
    var lhc = new T.Mesh(new T.TorusGeometry(0.36, 0.006, 4, 60), solid('#3ad0ff', { emissive: '#1a90c0' })); lhc.rotation.x = -Math.PI / 2; lhc.position.set(0.0, 0.008, 0); g.add(lhc);
    // the Globe: a ball of wood 27 m high and 40 m wide, built for a Swiss expo in 2002
    var wood = solid('#8a5a32', { flatShading: true }), wood2 = solid('#6a4224', { flatShading: true });
    var shell = new T.Mesh(new T.SphereGeometry(0.2, 24, 12, 0, D2, 0, Math.PI * 0.62), wood); shell.position.y = 0.13; shell.scale.y = 0.9; g.add(shell);
    for (var i = 0; i < 18; i++) { var rib = new T.Mesh(new T.TorusGeometry(0.205, 0.006, 4, 24, Math.PI * 0.62), wood2); rib.position.y = 0.13; rib.scale.y = 0.9; rib.rotation.set(0, i / 18 * Math.PI, Math.PI / 2 - Math.PI * 0.62 / 2 + Math.PI * 0.19); g.add(rib); }
    for (var h = 1; h < 4; h++) { var y = h * 0.055, rr = Math.sqrt(Math.max(0, 0.2 * 0.2 - Math.pow((0.13 - y) / 0.9, 2))), hr = new T.Mesh(new T.TorusGeometry(rr + 0.004, 0.004, 4, 32), wood2); hr.rotation.x = -Math.PI / 2; hr.position.y = y; g.add(hr); }
    // glass entrance and the CERN office buildings
    box(g, solid('#9ad0e8', { transparent: true, opacity: 0.8 }), 0.09, 0.05, 0.03, 0, 0, 0.19);
    var off = mat(winTex('cernw', '#e6e6e2', '#5a7a9a', 6, 3), 1, 1);
    box(g, off, 0.3, 0.08, 0.1, -0.2, 0, -0.4); box(g, off, 0.2, 0.06, 0.1, 0.25, 0, -0.38);
    // the Jura mountains behind and a road with a tram
    [[-0.3, -0.62, 0.2], [0.1, -0.64, 0.24], [0.42, -0.6, 0.16]].forEach(function (q) { var m = new T.Mesh(new T.ConeGeometry(0.2, q[2], 6), solid('#5f8a4a', { flatShading: true })); m.position.set(q[0], q[2] / 2, q[1]); m.scale.z = 0.4; g.add(m); });
    var rd = new T.Mesh(new T.PlaneGeometry(0.9, 0.05), solid('#6a6a6e')); rd.rotation.x = -Math.PI / 2; rd.position.set(0, 0.007, 0.36); g.add(rd);
    box(g, solid('#2a8ac8'), 0.12, 0.03, 0.025, 0.2, 0.008, 0.36);
    for (var p = 0; p < 4; p++) person(g, -0.08 + p * 0.03, 0.26, 1.1, ['#ffffff', '#2b6fd6', '#e8a83a', '#c0392b'][p]);
    return g;
  };

  /* ---------- Teatro Colón (Buenos Aires, Argentina) ---------- */
  M.custom.teatrocolon = function () {
    var g = new T.Group();
    blob(g, '#9a9a96', 0.86, 0.72, 0, 0, 0.004, 50);
    // one of the world's great opera houses (1908), famous for how good the music sounds inside
    var wall = mat(winTex('colw', '#e8dcc0', '#5a4a3a', 7, 3, { arch: true }), 1, 1), cream = solid('#efe4c8', { flatShading: true }), slate = solid('#4a5a66', { flatShading: true });
    box(g, wall, 0.62, 0.16, 0.34, 0, 0, -0.04);
    // mansard roof with round corner domes
    hip(g, slate, 0.62, 0.34, 0.06, 0, 0.16, -0.04, 0.8);
    [[-0.27, 0.11], [0.27, 0.11]].forEach(function (q) { cyl(g, cream, 0.04, 0.04, 0.04, q[0], 0.16, q[1], 12); var d = lathe([[0.044, 0], [0.04, 0.02], [0.025, 0.045], [0, 0.055]], 12, slate); d.position.set(q[0], 0.2, q[1]); g.add(d); });
    // the front porch with columns and a balcony
    box(g, cream, 0.3, 0.02, 0.07, 0, 0.0, 0.16); box(g, cream, 0.3, 0.02, 0.07, 0, 0.11, 0.16);
    for (var i = 0; i < 6; i++) cyl(g, cream, 0.008, 0.009, 0.09, -0.125 + i * 0.05, 0.02, 0.185, 8);
    box(g, cream, 0.32, 0.03, 0.06, 0, 0.13, 0.15); prism(g, cream, 0.22, 0.05, 0.02, 0, 0.16, 0.17);
    // inside: red velvet seats and the great painted dome (seen through the roof as a small lantern)
    cyl(g, solid('#c9a24a'), 0.03, 0.035, 0.03, 0, 0.21, -0.06, 10);
    // the wide avenue in front (9 de Julio) with jacaranda trees in purple bloom
    var rd = new T.Mesh(new T.PlaneGeometry(0.9, 0.12), solid('#5a5a5e')); rd.rotation.x = -Math.PI / 2; rd.position.set(0, 0.007, 0.34); g.add(rd);
    [[-0.38, 0.22], [-0.24, 0.24], [0.26, 0.24], [0.4, 0.22], [-0.42, -0.3], [0.42, -0.3]].forEach(function (q, j) { cyl(g, solid('#6a4a32'), 0.005, 0.007, 0.06, q[0], 0, q[1], 5); var c = new T.Mesh(new T.IcosahedronGeometry(0.04, 0), solid(j % 2 ? '#9a6ad0' : '#b07ae0', { flatShading: true })); c.position.set(q[0], 0.08, q[1]); c.scale.y = 0.7; g.add(c); });
    [[0.1, 0.32, '#f2c230'], [-0.2, 0.36, '#2a2a2e']].forEach(function (q) { box(g, solid(q[2]), 0.06, 0.02, 0.025, q[0], 0.008, q[1]); }); // taxis (black and yellow)
    for (var p = 0; p < 4; p++) person(g, -0.06 + p * 0.03, 0.23, 1.1, ['#2a2a2e', '#c0392b', '#ffffff', '#2b6fd6'][p]);
    return g;
  };

  /* ---------- St. Stephen's Cathedral (Vienna, Austria) ---------- */
  M.custom.ststephen = function () {
    var g = new T.Group();
    blob(g, '#a8a49c', 0.86, 0.72, 0, 0, 0.004, 51);
    var stone = mat(stoneTex('stst', '#c9bfa8', '#a89c84', 8, 10), 2, 2), st2 = solid('#bfb59e', { flatShading: true });
    // the long Gothic nave…
    box(g, stone, 0.5, 0.15, 0.18, 0, 0, 0);
    // …under a steep roof of about 230,000 glazed tiles that make zig-zags and a double-headed eagle
    var tiles = tex('ststt', 128, 64, function (x, w, h) { var cs = ['#2f6f4a', '#e8c040', '#1d1d22', '#f2f2ea']; for (var r = 0; r < 8; r++) for (var c = 0; c < 16; c++) { x.fillStyle = cs[(Math.abs(((c + r) % 8) - 4) + r) % 4]; x.fillRect(c * 8, r * 8, 8, 8); } x.fillStyle = '#1d1d22'; x.beginPath(); x.ellipse(64, 34, 12, 16, 0, 0, 7); x.fill(); });
    K.ridge(g, mat(tiles, 2, 1), 0.19, 0.17, 0.5, 0, 0.15, 0, Math.PI / 2);
    // the tall south tower (136 m), the "Steffl", narrowing to a needle point
    var tw = new T.Group(); tw.position.set(0.06, 0, 0.13); g.add(tw);
    [[0.09, 0.14], [0.075, 0.1], [0.06, 0.08], [0.045, 0.06]].reduce(function (y, q) { box(tw, stone, q[0], q[1], q[0], 0, y, 0); return y + q[1]; }, 0);
    cone(tw, st2, 0.032, 0.2, 0, 0.38, 0, 8); ball(tw, solid('#d8ad4c'), 0.008, 0, 0.585, 0);
    for (var i = 0; i < 4; i++) { var a = i / 4 * D2 + Math.PI / 4; cone(tw, st2, 0.008, 0.06, Math.cos(a) * 0.036, 0.32, Math.sin(a) * 0.036, 5); }
    // the unfinished north tower (it got a small Renaissance cap instead of a spire) and the west front with two little towers
    box(g, stone, 0.08, 0.2, 0.08, 0.06, 0, -0.13); var cap = lathe([[0.045, 0], [0.04, 0.02], [0.02, 0.04], [0.008, 0.06], [0, 0.07]], 8, solid('#3a7a5a', { flatShading: true })); cap.position.set(0.06, 0.2, -0.13); g.add(cap);
    [-0.04, 0.04].forEach(function (z) { box(g, stone, 0.05, 0.2, 0.05, -0.27, 0, z); cone(g, st2, 0.03, 0.06, -0.27, 0.2, z, 8); });
    arch(g, solid('#5a4a3a'), 0.05, 0.08, -0.296, 0, 0, 0.02); g.children[g.children.length - 1].rotation.y = -Math.PI / 2;
    // Stephansplatz: the busy square, a horse carriage (Fiaker) and café umbrellas
    for (var p = 0; p < 6; p++) person(g, -0.38 + hash(p, 1) * 0.15, 0.2 + hash(p, 2) * 0.2, 1.1, ['#2b6fd6', '#e8a83a', '#ffffff', '#c0392b'][p % 4]);
    box(g, solid('#2a2a2e'), 0.05, 0.03, 0.025, 0.3, 0.008, 0.3); box(g, solid('#e8e0d0'), 0.035, 0.035, 0.012, 0.36, 0.006, 0.3);
    [[-0.38, -0.3], [0.38, -0.3]].forEach(function (q) { cyl(g, solid('#c0392b'), 0.04, 0.0, 0.02, q[0], 0.05, q[1], 8); cyl(g, solid('#eee'), 0.003, 0.003, 0.05, q[0], 0, q[1], 4); });
    return g;
  };

  /* ---------- Cristo de la Concordia (Cochabamba, Bolivia) ---------- */
  M.custom.concordia = function () {
    var g = new T.Group();
    blob(g, '#a89a6a', 0.86, 0.72, 0, 0, 0.004, 52);
    // a hill above the city of Cochabamba, with a winding stairway of about 1,400 steps
    var hill = new T.Mesh(rocky(new T.ConeGeometry(0.4, 0.2, 14, 3), 0.18, 5), solid('#8a9a5a', { flatShading: true })); hill.position.y = 0.1; hill.scale.z = 0.85; g.add(hill);
    for (var s = 0; s < 18; s++) { var a = s * 0.55, r = 0.36 - s * 0.018; box(g, solid('#d8ccb0'), 0.025, 0.005, 0.012, Math.cos(a) * r, 0.2 - r * 0.5, Math.sin(a) * r * 0.85).rotation.y = -a; }
    // the statue (1994): about 34 m tall, a little taller than the one in Rio, arms open wide
    var w = solid('#f2f0ea', { flatShading: true }), S = new T.Group(); S.position.set(0, 0.2, 0); g.add(S);
    box(S, solid('#d8d4cc'), 0.06, 0.04, 0.06, 0, 0, 0);
    var robe = lathe([[0.03, 0], [0.028, 0.05], [0.022, 0.12], [0.02, 0.17], [0.016, 0.19], [0, 0.2]], 10, w); robe.position.y = 0.04; S.add(robe);
    box(S, w, 0.2, 0.018, 0.02, 0, 0.215, 0); [-1, 1].forEach(function (k) { box(S, w, 0.03, 0.012, 0.028, k * 0.11, 0.22, 0); }); // arms and hanging sleeves
    ball(S, w, 0.014, 0, 0.255, 0); ball(S, solid('#e8e4dc'), 0.01, 0, 0.27, -0.003, 1, 0.8, 1);
    // the city spreading out below: red roofs, and the green Andes mountains around
    for (var i = 0; i < 26; i++) { var a2 = hash(i, 1) * D2, r2 = 0.42 + hash(i, 2) * 0.06; if (Math.sin(a2) < -0.4) continue; box(g, solid(i % 3 ? '#c8643a' : '#e8dcc0'), 0.03, 0.02 + hash(i, 3) * 0.02, 0.03, Math.cos(a2) * r2, 0.004, Math.sin(a2) * r2 * 0.85); }
    [[-0.35, -0.6, 0.22], [0.1, -0.64, 0.26], [0.44, -0.58, 0.2]].forEach(function (q) { var m = new T.Mesh(new T.ConeGeometry(0.22, q[2], 6), solid('#6f8a4a', { flatShading: true })); m.position.set(q[0], q[2] / 2, q[1]); m.scale.z = 0.4; g.add(m); });
    // the cable car up the hill
    var cab = new T.Mesh(new T.CylinderGeometry(0.0015, 0.0015, 0.6, 4), solid('#333')); cab.rotation.z = Math.PI / 2 - 0.35; cab.position.set(0.25, 0.14, 0.15); g.add(cab);
    box(g, solid('#c0392b'), 0.025, 0.02, 0.02, 0.32, 0.1, 0.15);
    for (var p = 0; p < 3; p++) person(g, 0.06 + p * 0.025, 0.06, 0.9, ['#2b6fd6', '#e8a83a', '#c0392b'][p]);
    return g;
  };

  /* ---------- Halley VI Research Station (Antarctica, UK) ---------- */
  M.custom.halley = function () {
    var g = new T.Group();
    blob(g, '#f4f8fb', 0.88, 0.72, 0, 0, 0.004, 53);
    for (var d = 0; d < 8; d++) { var dr = new T.Mesh(new T.SphereGeometry(0.06 + hash(d, 1) * 0.05, 8, 4, 0, D2, 0, Math.PI / 2), solid('#e8f0f6', { flatShading: true })); dr.scale.set(1.6, 0.25, 1); dr.position.set(-0.4 + hash(d, 2) * 0.8, 0.004, -0.4 + hash(d, 3) * 0.8); g.add(dr); }
    // a science base on the floating ice shelf: blue modules and a big red one in the middle, each on long legs…
    var blue = solid('#2b6fd6', { flatShading: true }), redm = solid('#d23a2e', { flatShading: true }), leg = solid('#3a3a40'), ski = solid('#e8a83a');
    function module(x, z, big) {
      var m = new T.Group(); m.position.set(x, 0, z); g.add(m);
      var w = big ? 0.13 : 0.1, h = big ? 0.075 : 0.06;
      box(m, big ? redm : blue, w, h, 0.07, 0, 0.08, 0); box(m, solid('#e8eef2'), w * 0.98, 0.006, 0.072, 0, 0.08 + h * 0.7, 0);
      if (big) box(m, redm, 0.06, 0.03, 0.06, 0, 0.08 + h, 0);
      // …with skis on their feet: the legs can be jacked up above the snow, and the whole station can be towed to a new place
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { var lx = q[0] * (w / 2 - 0.01), lz = q[1] * 0.025; box(m, leg, 0.008, 0.08, 0.008, lx, 0, lz); box(m, ski, 0.012, 0.005, 0.05, lx, 0.0, lz); });
      for (var k = 0; k < 3; k++) box(m, solid('#bfe4f2'), 0.014, 0.012, 0.002, -w / 3 + k * w / 3, 0.1, 0.036);
    }
    [-0.33, -0.22, -0.11, 0.0, 0.11, 0.22, 0.33].forEach(function (x, i) { module(x, 0, i === 3); });
    // weather balloons, an aerial mast and a snow tractor
    ball(g, solid('#ffffff'), 0.025, 0.25, 0.35, -0.2); var str = new T.Mesh(new T.CylinderGeometry(0.001, 0.001, 0.2, 3), solid('#888')); str.position.set(0.25, 0.24, -0.2); g.add(str);
    cyl(g, solid('#c0392b'), 0.004, 0.004, 0.3, -0.38, 0, -0.25, 5);
    box(g, solid('#e8a83a'), 0.07, 0.03, 0.04, 0.3, 0.008, 0.25); box(g, solid('#2a2a2e'), 0.075, 0.012, 0.045, 0.3, 0.0, 0.25);
    for (var p = 0; p < 3; p++) person(g, -0.1 + p * 0.03, 0.22, 1.1, ['#d23a2e', '#e8a83a', '#d23a2e'][p]);
    return g;
  };
})();
