/* Detailed landmarks, batch 31: Christ Church Cathedral (Stanley), St. Michael's Church (Nkembo), Mausoleum of Agostinho Neto,
   Source of the Nile Pyramid, St. Elizabeth's Cathedral (Malabo), Chief Roi Mata's Domain, Bunce Island, Triumphal Arch (Chișinău). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function jungle(g, n, r0, r1, seed) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#2f7a35', { flatShading: true })); c.position.set(Math.cos(a) * r, 0.04, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- Christ Church Cathedral & Whalebone Arch, Stanley ---------- */
  M.custom.stanley = function () {
    var g = new T.Group(), brick = mat(stoneTex('stn', '#a86a4a', '#8a5038', 8, 6), 2, 1), roof = solid('#4a6a5a', { flatShading: true }), bone = solid('#f2ead8');
    blob(g, '#8a9a6a', 0.74, 0.62, 0, 0, 0.006, 3);
    var sea = new T.Mesh(new T.PlaneGeometry(0.56, 0.12), solid('#3f7a9a')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, 0.44); g.add(sea);
    // a brick and stone cathedral with a green roof and a square tower
    box(g, brick, 0.3, 0.1, 0.12, 0, 0.006, -0.12); ridge(g, roof, 0.31, 0.06, 0.13, 0, 0.106, -0.12, 0);
    box(g, brick, 0.08, 0.2, 0.08, -0.19, 0.006, -0.12); for (var i = 0; i < 4; i++) { var pin = new T.Mesh(new T.ConeGeometry(0.008, 0.03, 4), roof); pin.position.set(-0.22 + (i % 2) * 0.06, 0.221, -0.15 + Math.floor(i / 2) * 0.06); g.add(pin); }
    for (var w = 0; w < 4; w++) box(g, solid('#3a5a7a'), 0.02, 0.05, 0.002, -0.08 + w * 0.06, 0.03, -0.059);
    // the arch made from the jawbones of four blue whales
    [-1, 1].forEach(function (sd) { for (var j = 0; j < 2; j++) { var pts = []; for (var k = 0; k <= 10; k++) { var t = k / 10; pts.push(new T.Vector3(sd * (0.05 - t * 0.04) + (j - 0.5) * 0.012, t * 0.2, 0.12 + (j - 0.5) * 0.01)); } g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 10, 0.007, 5), bone)); } });
    // colourful tin-roofed houses
    [['#d04a2a', -0.4, 0.15], ['#3f6ab0', -0.25, 0.25], ['#e8c34a', 0.25, 0.2], ['#4ab07a', 0.4, 0.1]].forEach(function (h) { box(g, solid('#f6f2ea'), 0.08, 0.05, 0.06, h[1], 0.006, h[2]); ridge(g, solid(h[0]), 0.085, 0.03, 0.065, h[1], 0.056, h[2], 0); });
    // penguins on the shore
    for (var p = 0; p < 4; p++) { var pg = new T.Mesh(new T.CapsuleGeometry(0.006, 0.012, 3, 6), solid('#1a1a1a')); pg.position.set(-0.15 + p * 0.03, 0.02, 0.36); g.add(pg); var bl = new T.Mesh(new T.SphereGeometry(0.005, 5, 4), solid('#ffffff')); bl.position.set(-0.15 + p * 0.03, 0.018, 0.366); g.add(bl); }
    return g;
  };

  /* ---------- St. Michael's Church, Nkembo ---------- */
  M.custom.nkembo = function () {
    var g = new T.Group(), wood = solid('#8a5a32', { flatShading: true }), carved = mat(tex('nkm', 16, 64, function (c, W, H) { c.fillStyle = '#8a5a32'; c.fillRect(0, 0, W, H); c.fillStyle = '#5a3a1a'; for (var y = 2; y < H; y += 10) { c.fillRect(3, y, 10, 6); c.fillStyle = '#c9a070'; c.fillRect(6, y + 1, 4, 3); c.fillStyle = '#5a3a1a'; } }), 1, 1);
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // a wooden church famous for its 31 carved columns telling Bible stories
    box(g, solid('#e8dcc4'), 0.42, 0.012, 0.24, 0, 0.006, -0.02);
    for (var c = 0; c < 8; c++) [-1, 1].forEach(function (sd) { cyl(g, carved, 0.012, 0.012, 0.14, -0.18 + c * 0.052, 0.018, sd * 0.1 - 0.02, 8); });
    box(g, solid('#d8ccb0'), 0.36, 0.08, 0.12, 0, 0.018, -0.04);
    ridge(g, solid('#8a3a2a', { flatShading: true }), 0.44, 0.08, 0.26, 0, 0.158, -0.02, 0);
    // small bell tower
    box(g, wood, 0.05, 0.22, 0.05, 0.25, 0.006, -0.02); var bt = new T.Mesh(new T.ConeGeometry(0.04, 0.06, 4), solid('#8a3a2a')); bt.rotation.y = Math.PI / 4; bt.position.set(0.25, 0.256, -0.02); g.add(bt);
    var cr = new T.Group(); box(cr, solid('#f6f2ea'), 0.004, 0.025, 0.004, 0, 0, 0); box(cr, solid('#f6f2ea'), 0.014, 0.004, 0.004, 0, 0.016, 0); cr.position.set(0.25, 0.29, -0.02); g.add(cr);
    jungle(g, 16, 0.48, 0.7, 4);
    return g;
  };

  /* ---------- Mausoleum of Agostinho Neto ---------- */
  M.custom.netomausoleum = function () {
    var g = new T.Group(), conc = solid('#d8d4cc', { flatShading: true }), concD = solid('#b8b4ac');
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a wide circular base and a tall tapering concrete obelisk in Luanda
    cyl(g, concD, 0.3, 0.32, 0.03, 0, 0.006, 0, 32);
    cyl(g, conc, 0.18, 0.2, 0.05, 0, 0.036, 0, 24);
    var tw = lathe([[0.1, 0], [0.09, 0.08], [0.06, 0.2], [0.045, 0.32], [0.05, 0.38], [0.035, 0.44], [0.0, 0.5]], 12, conc); tw.position.y = 0.086; g.add(tw);
    // four "fins" around the base of the shaft
    for (var i = 0; i < 4; i++) { var a = i / 4 * D2, f = new T.Mesh(new T.BoxGeometry(0.02, 0.18, 0.08), concD); f.position.set(Math.cos(a) * 0.1, 0.176, Math.sin(a) * 0.1); f.rotation.y = -a; g.add(f); }
    var fl = new T.Mesh(new T.OctahedronGeometry(0.014, 0), solid('#f2c94a', { emissive: '#ff8a00' })); fl.position.y = 0.6; g.add(fl);
    for (var p = 0; p < 10; p++) { var a2 = p / 10 * D2; palm(g, Math.cos(a2) * 0.5, Math.sin(a2) * 0.42, 1.1); }
    return g;
  };

  /* ---------- Source of the Nile Pyramid (Rutovu) ---------- */
  M.custom.sourcenile = function () {
    var g = new T.Group(), st = mat(stoneTex('snp', '#a8a090', '#8a8478', 6, 6), 1, 1);
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.1, pos: [0, -0.08], r: function (t) { return 0.18 * (1 - t) + 0.16; }, bump: 0.15, colour: function () { return '#5f9a45'; } });
    // a small stone pyramid marking the southernmost source of the Nile
    var py = new T.Mesh(new T.ConeGeometry(0.17, 0.24, 4), st); py.rotation.y = Math.PI / 4; py.position.set(0, 0.1 + 0.12, -0.08); g.add(py);
    box(g, solid('#f6f2ea'), 0.05, 0.03, 0.002, 0, 0.13, 0.04);
    // a little spring that becomes a stream winding away downhill
    var pts = []; for (var i = 0; i <= 20; i++) { var t = i / 20; pts.push(new T.Vector3(0.12 + Math.sin(t * 8) * 0.05 + t * 0.15, 0.1 - t * 0.09, 0.02 + t * 0.42)); }
    g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, 0.012, 4), solid('#4f8ab0')));
    // tea and banana plants on the hills
    for (var b = 0; b < 8; b++) { var x = -0.5 + b * 0.13, z = 0.32 + hash(b, 3) * 0.1; cyl(g, solid('#6a8a3a'), 0.005, 0.006, 0.06, x, 0.006, z, 5); for (var l = 0; l < 4; l++) { var lf = new T.Mesh(new T.BoxGeometry(0.05, 0.003, 0.016), solid('#6ab04a')); lf.position.set(x + Math.cos(l * 1.57) * 0.02, 0.07, z + Math.sin(l * 1.57) * 0.02); lf.rotation.set(0, -l * 1.57, -0.5); g.add(lf); } }
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) { var tb = new T.Mesh(new T.SphereGeometry(0.016, 6, 4), solid('#3f8a3f')); tb.scale.y = 0.6; tb.position.set(-0.45 + c * 0.06, 0.018, -0.25 - r * 0.05); g.add(tb); }
    return g;
  };

  /* ---------- St. Elizabeth's Cathedral, Malabo ---------- */
  M.custom.malabo = function () {
    var g = new T.Group(), wm = mat(winTex('mlb', '#f2e8d4', '#5a6a7a', 4, 3, { tall: 0.7 }), 1, 1), red = solid('#c9603a', { flatShading: true }), cream = solid('#f2e8d4');
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a neo-Gothic cathedral with two tall towers and pointed spires, cream walls with red trim
    box(g, wm, 0.16, 0.14, 0.34, 0, 0.006, -0.08); ridge(g, red, 0.17, 0.07, 0.35, 0, 0.146, -0.08, Math.PI / 2);
    [-0.07, 0.07].forEach(function (x) { box(g, wm, 0.07, 0.28, 0.07, x, 0.006, 0.12); box(g, red, 0.074, 0.012, 0.074, x, 0.2, 0.12); box(g, red, 0.074, 0.012, 0.074, x, 0.286, 0.12); var sp = new T.Mesh(new T.ConeGeometry(0.045, 0.12, 8), red); sp.position.set(x, 0.346, 0.12); g.add(sp); });
    var rose = new T.Mesh(new T.CircleGeometry(0.025, 14), solid('#5a7aa0', { emissive: '#0a1a2a' })); rose.position.set(0, 0.11, 0.0861); g.add(rose);
    for (var p = 0; p < 8; p++) palm(g, -0.5 + (p % 4) * 0.33, p < 4 ? 0.4 : -0.42, 1.2);
    return g;
  };

  /* ---------- Chief Roi Mata's Domain ---------- */
  M.custom.roimata = function () {
    var g = new T.Group();
    blob(g, '#4ab0c0', 0.74, 0.62, 0, 0, 0.006, 5);
    // the coast of Efate with a village and the island of Artok (Hat Island) offshore
    blob(g, '#5f9a45', 0.5, 0.26, -0.1, -0.26, 0.012, 3);
    blob(g, '#f2e6c8', 0.48, 0.06, -0.08, -0.03, 0.013, 2);
    var hat = new T.Group(); mountain(hat, { h: 0.14, r: function (t) { return t > 0.6 ? 0.06 * (1 - (t - 0.6) * 2) : 0.14 - t * 0.12; }, bump: 0.1, colour: function () { return '#3f7a35'; } }); hat.position.set(0.35, 0.006, 0.22); g.add(hat);
    // thatched houses (nakamal) and a slit drum carved with a face
    for (var h = 0; h < 4; h++) { var x = -0.4 + h * 0.15, z = -0.28 + (h % 2) * 0.06; box(g, solid('#a8885a'), 0.08, 0.03, 0.05, x, 0.012, z); var rf = new T.Mesh(new T.ConeGeometry(0.06, 0.06, 4), solid('#c9a050', { flatShading: true })); rf.rotation.y = Math.PI / 4; rf.scale.z = 0.7; rf.position.set(x, 0.072, z); g.add(rf); }
    var drum = new T.Mesh(new T.CylinderGeometry(0.018, 0.022, 0.18, 8), solid('#6a4a2a')); drum.position.set(0.12, 0.1, -0.2); g.add(drum);
    var face = new T.Mesh(new T.CircleGeometry(0.014, 8), solid('#f2e8d4')); face.position.set(0.12, 0.16, -0.18); g.add(face);
    for (var t = 0; t < 8; t++) palm(g, -0.5 + t * 0.12, -0.08 - (t % 2) * 0.05, 1.1);
    // outrigger canoe
    var cn = new T.Group(); box(cn, solid('#6a4a2a'), 0.012, 0.01, 0.08, 0, 0, 0); box(cn, solid('#8a6a3a'), 0.004, 0.006, 0.06, 0.03, 0, 0); box(cn, solid('#8a6a3a'), 0.03, 0.003, 0.003, 0.015, 0.008, 0.02); box(cn, solid('#8a6a3a'), 0.03, 0.003, 0.003, 0.015, 0.008, -0.02); cn.position.set(0.05, 0.008, 0.15); cn.rotation.y = 0.6; g.add(cn);
    return g;
  };

  /* ---------- Bunce Island ---------- */
  M.custom.bunce = function () {
    var g = new T.Group(), st = solid('#8a7a62', { flatShading: true });
    blob(g, '#6a8a7a', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#6a9a4a', 0.46, 0.26, 0, 0, 0.014, 3);
    // crumbling stone ruins of the old fort, overgrown with trees
    [[-0.2, -0.02, 0.12, 0.08, 0.03], [-0.02, 0.04, 0.16, 0.05, 0.03], [0.14, -0.04, 0.03, 0.07, 0.14], [0.0, -0.1, 0.24, 0.04, 0.03]].forEach(function (w) { box(g, st, w[2], w[3], w[4], w[0], 0.014, w[1]); });
    var tw = new T.Mesh(new T.CylinderGeometry(0.035, 0.04, 0.07, 10, 1, true, 0, Math.PI * 1.4), solid('#8a7a62', { side: T.DoubleSide })); tw.position.set(0.22, 0.05, 0.06); g.add(tw);
    for (var c = 0; c < 4; c++) { var cn = new T.Mesh(new T.CylinderGeometry(0.006, 0.008, 0.05, 6), solid('#3a3a3a')); cn.rotation.z = Math.PI / 2; cn.position.set(-0.25 + c * 0.04, 0.02, 0.12); g.add(cn); }
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2, c2 = new T.Mesh(new T.IcosahedronGeometry(0.04, 0), solid('#3f7a35', { flatShading: true })); c2.position.set(Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.15); g.add(c2); }
    // a memorial stone
    box(g, solid('#d8d0c0'), 0.03, 0.04, 0.01, 0.05, 0.014, 0.14);
    var bt = new T.Group(); box(bt, solid('#d8b04a'), 0.06, 0.014, 0.02, 0, 0, 0); bt.position.set(-0.35, 0.008, 0.35); bt.rotation.y = 0.4; g.add(bt);
    return g;
  };

  /* ---------- Triumphal Arch, Chișinău ---------- */
  M.custom.chisinau = function () {
    var g = new T.Group(), st = mat(stoneTex('chs', '#e8dcc4', '#ccc0a8', 6, 6), 1, 1), w = solid('#f2ece0');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    var pz = new T.Mesh(new T.CircleGeometry(0.36, 24), solid('#d8d2c4')); pz.rotation.x = -Math.PI / 2; pz.position.y = 0.008; g.add(pz);
    // an arch with columns on all four sides and a clock on top
    [[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]].forEach(function (q) { box(g, st, 0.05, 0.2, 0.05, q[0], 0.008, q[1]); cyl(g, w, 0.008, 0.008, 0.18, q[0] + (q[0] > 0 ? 0.03 : -0.03), 0.008, q[1] + (q[1] > 0 ? 0.03 : -0.03), 8); });
    box(g, st, 0.24, 0.06, 0.24, 0, 0.208, 0);
    box(g, w, 0.26, 0.012, 0.26, 0, 0.268, 0);
    box(g, st, 0.12, 0.05, 0.12, 0, 0.28, 0);
    var clk = new T.Mesh(new T.CircleGeometry(0.02, 14), solid('#f6f2ea')); clk.position.set(0, 0.305, 0.061); g.add(clk);
    var dm = new T.Mesh(new T.SphereGeometry(0.05, 12, 6, 0, D2, 0, Math.PI / 2), solid('#7a9a8a')); dm.position.y = 0.33; g.add(dm);
    // the cathedral behind and lines of trees
    box(g, mat(winTex('chc', '#f2ece0', '#5a6a7a', 4, 2), 1, 1), 0.16, 0.12, 0.16, 0, 0.008, -0.42 + 0.02); var cd = new T.Mesh(new T.SphereGeometry(0.06, 12, 6, 0, D2, 0, Math.PI / 2), solid('#5a7a9a')); cd.position.set(0, 0.128, -0.4); g.add(cd);
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; tree(g, Math.cos(a) * 0.55, Math.sin(a) * 0.47, 1.0, '#3f8a3f'); }
    return g;
  };
})();
