/* Detailed landmarks, batch 29: National Library of Belarus, Monaco harbour & circuit, Arch 22, Maputo Railway Station,
   Sibebe Rock, Boali Falls, Paramaribo wooden cathedral, Sri Siva Subramaniya Temple (Fiji). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }
  function jungle(g, n, r0, r1, seed) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#2f7a35', { flatShading: true })); c.position.set(Math.cos(a) * r, 0.04, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- National Library of Belarus ---------- */
  M.custom.belaruslib = function () {
    var g = new T.Group(), glass = mat(tex('nlb', 32, 32, function (c, W, H) { c.fillStyle = '#3a6a8a'; c.fillRect(0, 0, W, H); c.fillStyle = '#8ac0e0'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1); c.fillStyle = '#d8e8f0'; for (var x = 0; x < W; x += 8) c.fillRect(x, 0, 1, H); }), 1, 1);
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // a wide podium, then the glass "diamond" (a rhombicuboctahedron)
    box(g, solid('#d8d4cc'), 0.42, 0.08, 0.42, 0, 0.006, 0);
    box(g, mat(winTex('nlbp', '#e8e4dc', '#4a6a8a', 10, 2), 3, 1), 0.36, 0.06, 0.36, 0, 0.086, 0);
    var gem = new T.Mesh(new T.IcosahedronGeometry(0.16, 1), glass); gem.geometry = new T.OctahedronGeometry(0.17, 1); gem.material = glass; gem.scale.y = 1.15; gem.position.y = 0.33; g.add(gem);
    // the cube-octahedron look: square facets via a flat-shaded box edges
    var frame = new T.Mesh(new T.BoxGeometry(0.21, 0.24, 0.21), solid('#5a8ab0', { transparent: true, opacity: 0.55 })); frame.position.y = 0.33; g.add(frame);
    cyl(g, solid('#dddddd'), 0.008, 0.008, 0.03, 0, 0.51, 0, 6);
    // light-show stripes at night (a few coloured bands)
    ['#e84a8a', '#4ae8a8', '#e8c34a'].forEach(function (c, k) { var b = new T.Mesh(new T.TorusGeometry(0.14 - k * 0.025, 0.004, 4, 24), solid(c, { emissive: c })); b.rotation.x = Math.PI / 2; b.position.y = 0.28 + k * 0.06; g.add(b); });
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; tree(g, Math.cos(a) * 0.55, Math.sin(a) * 0.45, 1.0, '#3f8a3f'); }
    return g;
  };

  /* ---------- Monaco ---------- */
  M.custom.monaco = function () {
    var g = new T.Group(), roofs = ['#d8806a', '#c9603a', '#e0a070'], walls = ['#f6e8c8', '#f2d8b0', '#f6f2ea', '#f0c8a8'];
    blob(g, '#2f8fc0', 0.74, 0.62, 0, 0, 0.006, 6);
    // the harbour full of yachts, the rock with the palace, apartment towers climbing the hillside
    mountain(g, { h: 0.22, pos: [0, -0.4], rings: 8, r: function (t) { return 0.36 * (1 - t) + 0.03; }, sx: 1.6, sz: 0.35, bump: 0.25, colour: function (x, y) { return y > 0.16 ? '#7a8a6a' : '#a8a08a'; } });
    for (var b = 0; b < 16; b++) { var x = -0.5 + (b % 8) * 0.14, z = -0.28 + Math.floor(b / 8) * 0.13, h = 0.06 + hash(b, 2) * 0.12; box(g, mat(winTex('mco' + (b % 3), walls[b % 4], '#5a7a9a', 3, 5), 1, 1), 0.08, h, 0.07, x, 0.006 + (z < -0.2 ? 0.06 : 0), z); box(g, solid(roofs[b % 3]), 0.082, 0.008, 0.072, x, 0.006 + h + (z < -0.2 ? 0.06 : 0), z); }
    // harbour quay with the race track ribbon and a red-white kerb
    var q = new T.Mesh(new T.RingGeometry(0.22, 0.27, 24, 1, Math.PI, Math.PI), solid('#5a5a5a')); q.rotation.x = -Math.PI / 2; q.position.set(0, 0.01, 0.0); q.scale.y = 0.8; g.add(q);
    var kerb = new T.Mesh(new T.RingGeometry(0.27, 0.28, 24, 1, Math.PI, Math.PI), solid('#e02a2a')); kerb.rotation.x = -Math.PI / 2; kerb.position.set(0, 0.011, 0.0); kerb.scale.y = 0.8; g.add(kerb);
    for (var y = 0; y < 10; y++) { var yt = new T.Group(); box(yt, solid('#f6f6f6'), 0.024, 0.012, 0.06, 0, 0, 0); box(yt, solid('#3a4a5a'), 0.016, 0.01, 0.03, 0, 0.012, -0.005); yt.position.set(-0.18 + (y % 5) * 0.09, 0.008, 0.08 + Math.floor(y / 5) * 0.09); g.add(yt); }
    // the palace on the rock
    blob(g, '#a8a08a', 0.18, 0.1, 0.45, 0.15, 0.03, 2); box(g, solid('#f2e2c4'), 0.12, 0.05, 0.07, 0.45, 0.04, 0.15); for (var c = 0; c < 4; c++) box(g, solid('#f2e2c4'), 0.012, 0.012, 0.012, 0.4 + c * 0.033, 0.09, 0.15);
    // a race car on the track
    var car = new T.Group(); box(car, solid('#e02a2a'), 0.012, 0.006, 0.03, 0, 0, 0); car.position.set(-0.24, 0.012, 0.05); g.add(car);
    return g;
  };

  /* ---------- Arch 22 (Banjul) ---------- */
  M.custom.arch22 = function () {
    var g = new T.Group(), w = solid('#f6f2ea'), gold = solid('#d8a84a');
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    // eight tall columns in two groups carrying a wide top block with a frieze
    [-1, 1].forEach(function (sd) { for (var r = 0; r < 2; r++) for (var c = 0; c < 2; c++) cyl(g, w, 0.016, 0.016, 0.3, sd * (0.1 + c * 0.05), 0.006, -0.03 + r * 0.06, 10); });
    box(g, mat(winTex('a22', '#f6f2ea', '#3a5a7a', 8, 1, { tall: 0.5 }), 1, 1), 0.42, 0.08, 0.12, 0, 0.306, 0);
    box(g, gold, 0.43, 0.012, 0.125, 0, 0.386, 0);
    var ped = new T.Mesh(new T.ConeGeometry(0.12, 0.05, 4), w); ped.rotation.y = Math.PI / 4; ped.scale.set(1.6, 1, 0.5); ped.position.y = 0.42; g.add(ped);
    // the busy road going under, with taxis
    var rd = new T.Mesh(new T.PlaneGeometry(0.14, 1.0), solid('#6a6a6a')); rd.rotation.x = -Math.PI / 2; rd.position.y = 0.008; rd.scale.y = 0.95; g.add(rd);
    for (var t = 0; t < 4; t++) { var car = new T.Group(); box(car, solid(t % 2 ? '#e8c34a' : '#2a8a3a'), 0.025, 0.014, 0.045, 0, 0, 0); car.position.set((t % 2 ? 0.03 : -0.03), 0.008, -0.3 + t * 0.18); g.add(car); }
    for (var p = 0; p < 8; p++) palm(g, (p % 2 ? 0.3 : -0.3) + hash(p, 1) * 0.1, -0.4 + Math.floor(p / 2) * 0.24, 1.1);
    return g;
  };

  /* ---------- Maputo Central Railway Station ---------- */
  M.custom.maputo = function () {
    var g = new T.Group(), mint = mat(winTex('mps', '#d8e8c8', '#f6f2ea', 6, 2, { tall: 0.7 }), 1, 1), cream = solid('#f6f2ea'), bronze = solid('#5a7a6a', { metalness: 0.4 });
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a pale mint-green Beaux-Arts front with a big copper dome, iron train sheds behind
    box(g, mint, 0.44, 0.12, 0.1, 0, 0.006, 0.05);
    box(g, cream, 0.46, 0.012, 0.11, 0, 0.126, 0.05);
    box(g, mint, 0.14, 0.16, 0.1, 0, 0.006, 0.055);
    for (var c = 0; c < 4; c++) cyl(g, cream, 0.008, 0.008, 0.12, -0.045 + c * 0.03, 0.006, 0.108, 6);
    cyl(g, mint, 0.06, 0.06, 0.04, 0, 0.166, 0.05, 16);
    domeOn(g, bronze, 0.065, 0.1, 0, 0.206, 0.05, 16);
    cyl(g, bronze, 0.01, 0.014, 0.03, 0, 0.3, 0.05, 8);
    [-0.2, 0.2].forEach(function (x) { domeOn(g, bronze, 0.03, 0.04, x, 0.126, 0.05, 10); });
    var shed = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.4, 16, 1, true, -Math.PI / 2, Math.PI), solid('#7a8a8a', { side: T.DoubleSide })); shed.rotation.z = Math.PI / 2; shed.rotation.y = Math.PI / 2; shed.scale.x = 0.6; shed.position.set(0, 0.006, -0.25); g.add(shed);
    // tracks and a steam locomotive on display
    for (var r = 0; r < 3; r++) { var tr = new T.Mesh(new T.PlaneGeometry(0.03, 0.5), solid('#5a5048')); tr.rotation.x = -Math.PI / 2; tr.position.set(-0.08 + r * 0.08, 0.009, -0.25); g.add(tr); }
    var loco = new T.Group(); var bl = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.1, 10), solid('#1a1a1a')); bl.rotation.x = Math.PI / 2; bl.position.y = 0.03; loco.add(bl); box(loco, solid('#1a1a1a'), 0.04, 0.05, 0.04, 0, 0.01, -0.06); box(loco, solid('#c9402a'), 0.042, 0.01, 0.15, 0, 0.004, -0.02); cyl(loco, solid('#1a1a1a'), 0.008, 0.008, 0.03, 0, 0.05, 0.03, 6); loco.position.set(0.3, 0.006, 0.3); g.add(loco);
    for (var t = 0; t < 6; t++) { var c2 = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), solid(t % 2 ? '#c94a6a' : '#3f8a3f', { flatShading: true })); c2.scale.y = 0.6; c2.position.set(-0.5 + t * 0.2, 0.1, 0.42); g.add(c2); cyl(g, solid('#6a4a2a'), 0.006, 0.008, 0.08, -0.5 + t * 0.2, 0.006, 0.42, 5); }
    return g;
  };

  /* ---------- Sibebe Rock ---------- */
  M.custom.sibebe = function () {
    var g = new T.Group();
    blob(g, '#6a9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a huge bare granite dome rising out of green hills
    var dome = lathe([[0.42, 0], [0.4, 0.06], [0.34, 0.16], [0.24, 0.24], [0.12, 0.28], [0, 0.29]], 24, solid('#8a8a80', { flatShading: true }));
    var p = dome.geometry.attributes.position; for (var i = 0; i < p.count; i++) { var y = p.getY(i); p.setX(i, p.getX(i) * (1 + noise(i * 0.3, 1) * 0.08)); } dome.geometry.computeVertexNormals(); dome.scale.set(1.2, 1, 0.8); dome.position.set(0, 0.006, -0.08); g.add(dome);
    // dark streaks on its face and bushes on the lower slopes
    for (var b = 0; b < 16; b++) { var a = b / 16 * D2, bs = new T.Mesh(new T.IcosahedronGeometry(0.035, 0), solid('#3f7a35', { flatShading: true })); bs.position.set(Math.cos(a) * 0.55, 0.035, Math.sin(a) * 0.45 - 0.05); g.add(bs); }
    // a hiker on the top
    cyl(g, solid('#d04a2a'), 0.006, 0.006, 0.02, 0, 0.29, -0.08, 5);
    // round huts (beehive style) at the foot
    for (var h = 0; h < 3; h++) { var hut = new T.Mesh(new T.SphereGeometry(0.035, 10, 6, 0, D2, 0, Math.PI / 2), solid('#c9a050')); hut.scale.y = 1.3; hut.position.set(0.3 + h * 0.08, 0.006, 0.35); g.add(hut); }
    return g;
  };

  /* ---------- Boali Falls ---------- */
  M.custom.boali = function () {
    var g = new T.Group(), rock = solid('#6a5a4a', { flatShading: true }), water = solid('#e8f4f8', { transparent: true, opacity: 0.9 });
    blob(g, '#3f7a3a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a wide curving cliff with the river spilling over in many white curtains
    var cl = new T.Mesh(new T.CylinderGeometry(0.3, 0.32, 0.18, 18, 3, true, Math.PI / 2, Math.PI), solid('#6a5a4a', { flatShading: true, side: T.DoubleSide })); var cp = cl.geometry.attributes.position; for (var i = 0; i < cp.count; i++) { var k = 1 + noise(i * 0.7, 2) * 0.12; cp.setX(i, cp.getX(i) * k); cp.setZ(i, cp.getZ(i) * k); } cl.geometry.computeVertexNormals(); cl.position.set(0, 0.096, 0.05); g.add(cl);
    var top = new T.Mesh(new T.RingGeometry(0.3, 0.54, 18, 1, 0, Math.PI), solid('#4f7a45')); top.rotation.x = -Math.PI / 2; top.position.set(0, 0.186, 0.05); g.add(top);
    var riv = new T.Mesh(new T.PlaneGeometry(0.3, 0.3), solid('#6a8a90')); riv.rotation.x = -Math.PI / 2; riv.position.set(0, 0.19, -0.36); g.add(riv);
    for (var f = 0; f < 8; f++) { var a2 = Math.PI * (0.15 + f * 0.1), fl = new T.Mesh(new T.PlaneGeometry(0.05 + hash(f, 1) * 0.03, 0.18), water); fl.position.set(Math.cos(a2) * 0.29, 0.097, 0.05 - Math.sin(a2) * 0.29); fl.rotation.y = Math.PI / 2 - a2; g.add(fl); }
    var pool = new T.Mesh(new T.CircleGeometry(0.3, 20), solid('#6a9aa0')); pool.rotation.x = -Math.PI / 2; pool.scale.y = 0.5; pool.position.set(0, 0.009, 0.05); g.add(pool);
    for (var m = 0; m < 6; m++) { var mi = new T.Mesh(new T.SphereGeometry(0.04, 6, 4), solid('#ffffff', { transparent: true, opacity: 0.5 })); mi.position.set(-0.25 + m * 0.1, 0.03, -0.06); mi.scale.y = 0.5; g.add(mi); }
    jungle(g, 22, 0.42, 0.7, 5);
    return g;
  };

  /* ---------- Cathedral Basilica of St. Peter and Paul, Paramaribo ---------- */
  M.custom.paramaribo = function () {
    var g = new T.Group(), wood = mat(tex('pmb', 32, 32, function (c, W, H) { c.fillStyle = '#f2ece0'; c.fillRect(0, 0, W, H); c.fillStyle = '#d8cfbe'; for (var y = 0; y < H; y += 3) c.fillRect(0, y, W, 1); c.fillStyle = '#5a6a7a'; for (var x = 4; x < W; x += 10) c.fillRect(x, 8, 4, 12); }), 2, 1), grey = solid('#6a7078', { flatShading: true });
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // one of the largest wooden buildings in South America: a long white-painted nave and two spires
    box(g, wood, 0.18, 0.13, 0.42, 0, 0.006, -0.05);
    ridge(g, grey, 0.19, 0.08, 0.43, 0, 0.136, -0.05, Math.PI / 2);
    [-0.06, 0.06].forEach(function (x) { box(g, wood, 0.06, 0.24, 0.06, x, 0.006, 0.17); var sp = new T.Mesh(new T.ConeGeometry(0.04, 0.14, 8), grey); sp.position.set(x, 0.316, 0.17); g.add(sp); var cr = new T.Group(); box(cr, solid('#e8c34a'), 0.004, 0.024, 0.004, 0, 0, 0); box(cr, solid('#e8c34a'), 0.014, 0.004, 0.004, 0, 0.016, 0); cr.position.set(x, 0.386, 0.17); g.add(cr); });
    var rose = new T.Mesh(new T.CircleGeometry(0.03, 16), solid('#5a7aa0', { emissive: '#0a1a2a' })); rose.position.set(0, 0.2, 0.172); g.add(rose);
    // other white wooden houses and big trees of the old town
    for (var h = 0; h < 4; h++) { var x2 = h < 2 ? -0.35 : 0.35, z2 = -0.2 + (h % 2) * 0.3; box(g, solid('#f6f2ea'), 0.14, 0.08, 0.1, x2, 0.006, z2); ridge(g, solid('#a83a2a'), 0.15, 0.05, 0.11, x2, 0.086, z2, 0); }
    for (var t = 0; t < 4; t++) { var c = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), solid('#3f8a3f', { flatShading: true })); c.scale.y = 0.7; c.position.set(-0.45 + t * 0.3, 0.13, 0.42); g.add(c); cyl(g, solid('#6a4a2a'), 0.01, 0.012, 0.1, -0.45 + t * 0.3, 0.006, 0.42, 5); }
    return g;
  };

  /* ---------- Sri Siva Subramaniya Temple (Nadi, Fiji) ---------- */
  M.custom.fijitemple = function () {
    var g = new T.Group(), cols = ['#e84a4a', '#4ab0e8', '#e8c34a', '#4ae88a', '#e88ac8'];
    blob(g, '#5fa04a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a brightly painted South Indian temple: a stepped gopuram tower with painted tiers
    box(g, solid('#f6f2ea'), 0.4, 0.06, 0.3, 0, 0.006, -0.05);
    for (var l = 0; l < 7; l++) { var w = 0.24 - l * 0.027, d = 0.15 - l * 0.015; box(g, solid(cols[l % 5]), w, 0.05, d, 0, 0.066 + l * 0.05, 0.05); for (var k = 0; k < 3; k++) { var f = new T.Mesh(new T.SphereGeometry(0.008, 5, 4), solid(cols[(l + k + 2) % 5])); f.position.set(-w / 3 + k * w / 3, 0.09 + l * 0.05, 0.05 + d / 2); g.add(f); } }
    var crown = new T.Mesh(new T.CylinderGeometry(0.02, 0.03, 0.03, 8), solid('#e8a83a')); crown.position.set(0, 0.43, 0.05); g.add(crown);
    for (var p = 0; p < 3; p++) { var kl = new T.Mesh(new T.ConeGeometry(0.006, 0.025, 6), solid('#e8c34a', { emissive: '#3a2a00' })); kl.position.set(-0.025 + p * 0.025, 0.455, 0.05); g.add(kl); }
    // two smaller domed shrines either side
    [-0.15, 0.15].forEach(function (x) { box(g, solid('#f6e8c8'), 0.07, 0.06, 0.07, x * 1.2, 0.066, -0.12); domeOn(g, solid(x < 0 ? '#e84a4a' : '#4ab0e8'), 0.036, 0.05, x * 1.2, 0.126, -0.12, 10); });
    for (var t = 0; t < 8; t++) palm(g, -0.5 + (t % 4) * 0.33, t < 4 ? 0.38 : -0.42, 1.2);
    return g;
  };
})();
