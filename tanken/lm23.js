/* Detailed landmarks, batch 23: Genghis Khan Equestrian Statue, Sultan Qaboos Grand Mosque, Burana Tower,
   Seongsan Ilchulbong, Citadelle Laferrière, Dunn's River Falls, Twelve Apostles, Temple in the Sea. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function bush(g, n, r0, r1, seed, cols) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.035 + hash(i, seed + 2) * 0.03, 0), solid(cols[i % cols.length], { flatShading: true })); c.position.set(Math.cos(a) * r, 0.035, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- Genghis Khan Equestrian Statue ---------- */
  M.custom.genghis = function () {
    var g = new T.Group(), steel = solid('#c8ccd2', { metalness: 0.6, roughness: 0.3, flatShading: true });
    blob(g, '#a8b860', 0.74, 0.62, 0, 0, 0.006, 3);
    // round museum building with ten columns
    cyl(g, mat(winTex('ghb', '#e8e4dc', '#5a6a7a', 16, 2), 4, 1), 0.2, 0.2, 0.12, 0, 0.006, 0, 24);
    for (var i = 0; i < 10; i++) { var a = i / 10 * D2; cyl(g, solid('#f2f0ea'), 0.012, 0.012, 0.13, Math.cos(a) * 0.21, 0.006, Math.sin(a) * 0.21, 8); }
    cyl(g, solid('#d8d4cc'), 0.22, 0.22, 0.012, 0, 0.13, 0, 24);
    // the silver horse and rider
    var H = new T.Group();
    var body = new T.Mesh(new T.CapsuleGeometry(0.035, 0.1, 4, 8), steel); body.rotation.x = Math.PI / 2; body.position.y = 0.1; H.add(body);
    [[0.022, 0.045], [-0.022, 0.045], [0.022, -0.045], [-0.022, -0.045]].forEach(function (q) { var l = new T.Mesh(new T.CylinderGeometry(0.009, 0.007, 0.09, 6), steel); l.position.set(q[0], 0.045, q[1]); H.add(l); });
    var neck = new T.Mesh(new T.CylinderGeometry(0.018, 0.025, 0.08, 6), steel); neck.position.set(0, 0.15, 0.07); neck.rotation.x = 0.6; H.add(neck);
    var head = new T.Mesh(new T.BoxGeometry(0.025, 0.025, 0.06), steel); head.position.set(0, 0.18, 0.1); head.rotation.x = 0.5; H.add(head);
    var rider = lathe([[0.03, 0], [0.032, 0.04], [0.026, 0.09], [0.016, 0.1], [0, 0.1]], 8, steel); rider.position.set(0, 0.13, -0.01); H.add(rider);
    var rh = new T.Mesh(new T.SphereGeometry(0.016, 8, 6), steel); rh.position.set(0, 0.25, -0.01); H.add(rh);
    var hat = new T.Mesh(new T.ConeGeometry(0.018, 0.02, 8), steel); hat.position.set(0, 0.27, -0.01); H.add(hat);
    var whip = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.08, 4), solid('#e8c34a', { emissive: '#4a3a00' })); whip.position.set(0.03, 0.2, 0.03); whip.rotation.x = 0.8; H.add(whip);
    H.scale.setScalar(1.7); H.position.y = 0.142; H.rotation.y = 1.2; g.add(H);
    // a ger tent and grassland hills
    var ger = new T.Group(); cyl(ger, solid('#f6f2ea'), 0.05, 0.05, 0.04, 0, 0, 0, 14); var rf = new T.Mesh(new T.ConeGeometry(0.055, 0.03, 14), solid('#f6f2ea')); rf.position.y = 0.055; ger.add(rf); box(ger, solid('#d04a2a'), 0.02, 0.03, 0.004, 0, 0, 0.05); ger.position.set(-0.42, 0.006, 0.25); g.add(ger);
    mountain(g, { h: 0.1, pos: [0.3, -0.32], r: function (t) { return 0.22 * (1 - t) + 0.03; }, sx: 1.1, sz: 0.5, bump: 0.2, colour: function () { return '#8aa050'; } });
    return g;
  };

  /* ---------- Sultan Qaboos Grand Mosque ---------- */
  M.custom.qaboos = function () {
    var g = new T.Group(), cream = mat(stoneTex('sqm', '#ece2d0', '#d8ccb4', 10, 6), 2, 1), white = solid('#f2ece0'), gold = solid('#d8b04a', { metalness: 0.5, roughness: 0.3, emissive: '#3a2a00' });
    blob(g, '#4f9a4a', 0.74, 0.62, 0, 0, 0.006, 3);
    box(g, solid('#e0d6c2'), 1.0, 0.012, 0.86, 0, 0.006, 0);
    // arcaded courtyard walls
    [[0, 0.38, 0.9, 0.06], [0, -0.38, 0.9, 0.06], [-0.44, 0, 0.06, 0.76], [0.44, 0, 0.06, 0.76]].forEach(function (w) { box(g, cream, w[2], 0.06, w[3], w[0], 0.018, w[1]); });
    for (var i = 0; i < 9; i++) arch(g, solid('#a8946a'), 0.06, 0.045, -0.4 + i * 0.1, 0.018, 0.411, 0.004);
    // the prayer hall and the big dome
    box(g, cream, 0.36, 0.12, 0.3, 0, 0.018, -0.12);
    var dome = lathe([[0.13, 0], [0.13, 0.03], [0.125, 0.08], [0.1, 0.13], [0.06, 0.16], [0.02, 0.175], [0, 0.18]], 24, gold); dome.position.set(0, 0.17, -0.12); g.add(dome);
    cyl(g, cream, 0.13, 0.14, 0.035, 0, 0.138, -0.12, 24);
    var fin = new T.Mesh(new T.ConeGeometry(0.008, 0.06, 6), gold); fin.position.set(0, 0.38, -0.12); g.add(fin);
    // minarets: one tall, four corner ones
    function minaret(x, z, h) { cyl(g, white, 0.022, 0.028, h, x, 0.018, z, 8); cyl(g, solid('#c9b890'), 0.034, 0.034, 0.012, x, 0.018 + h * 0.75, z, 8); cyl(g, white, 0.016, 0.02, 0.05, x, 0.018 + h, z, 8); var t = new T.Mesh(new T.ConeGeometry(0.02, 0.05, 8), gold); t.position.set(x, 0.018 + h + 0.075, z); g.add(t); }
    minaret(0, 0.3, 0.42); [[-0.4, -0.34], [0.4, -0.34], [-0.4, 0.34], [0.4, 0.34]].forEach(function (q) { minaret(q[0], q[1], 0.2); });
    for (var t = 0; t < 6; t++) { var tr = new T.Mesh(new T.ConeGeometry(0.025, 0.06, 6), solid('#3f8a3f')); tr.position.set(-0.3 + t * 0.12, 0.05, 0.2); g.add(tr); }
    return g;
  };

  /* ---------- Burana Tower ---------- */
  M.custom.burana = function () {
    var g = new T.Group(), brick = mat(tex('bur', 32, 64, function (c, W, H) { c.fillStyle = '#b8835a'; c.fillRect(0, 0, W, H); c.fillStyle = '#9a6a48'; for (var y = 0; y < H; y += 6) for (var x = (y / 6 % 2) * 3; x < W; x += 6) c.fillRect(x, y, 5, 1); c.fillStyle = '#7a5038'; for (var b = 8; b < H; b += 16) { for (var x2 = 0; x2 < W; x2 += 4) c.fillRect(x2, b, 2, 3); } }), 3, 2);
    blob(g, '#a8b070', 0.74, 0.62, 0, 0, 0.006, 3);
    // snowy Tian Shan mountains behind
    mountain(g, { h: 0.5, pos: [0, -0.48], rings: 12, r: function (t) { return 0.55 * (1 - t) + 0.02; }, sx: 1.25, sz: 0.3, bump: 0.35, jag: 0.3, colour: function (x, y) { return y > 0.32 ? '#f2f4f8' : y > 0.18 ? '#8a8a82' : '#7a9a5a'; } });
    // a hill with the stumpy minaret tower (its top fell in an earthquake)
    mountain(g, { h: 0.05, r: function (t) { return 0.25 * (1 - t) + 0.12; }, bump: 0.1, colour: function () { return '#9aa868'; } });
    var tw = lathe([[0.1, 0], [0.1, 0.06], [0.075, 0.06], [0.072, 0.1], [0.065, 0.3], [0.06, 0.34], [0, 0.34]], 16, brick); tw.position.y = 0.05; g.add(tw);
    box(g, solid('#3a2a20'), 0.02, 0.03, 0.004, 0, 0.11, 0.073);
    // stone balbal figures standing in the field
    for (var i = 0; i < 8; i++) { var b = new T.Mesh(new T.BoxGeometry(0.02, 0.05 + hash(i, 1) * 0.02, 0.012), solid('#8a8478', { flatShading: true })); b.position.set(0.2 + (i % 4) * 0.06, 0.03, 0.25 + Math.floor(i / 4) * 0.08); b.rotation.y = hash(i, 2) * 0.4; g.add(b); var hh = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), solid('#8a8478')); hh.position.set(b.position.x, b.position.y + 0.035, b.position.z); g.add(hh); }
    return g;
  };

  /* ---------- Seongsan Ilchulbong ---------- */
  M.custom.seongsan = function () {
    var g = new T.Group();
    blob(g, '#2f7fb0', 0.74, 0.62, 0, 0, 0.006, 6);
    // a tuff cone with a grassy crater bowl, ringed by jagged cliffs
    var N = 36, outer = [], inner = [];
    var crater = new T.Group();
    mountain(crater, { h: 0.3, rings: 14, r: function (t) { return 0.42 * (1 - t * 0.7); }, bump: 0.18, f: 9, jag: 0.25, colour: function (x, y) { return y > 0.26 ? '#5a8a3a' : noise(x * 20, y * 20) > 0.5 ? '#6a5a48' : '#8a7a62'; } });
    crater.position.set(0, 0, -0.1); g.add(crater);
    var bowl = new T.Mesh(new T.CircleGeometry(0.24, 24), solid('#7aa850')); bowl.rotation.x = -Math.PI / 2; bowl.position.set(0, 0.28, -0.1); g.add(bowl);
    for (var i = 0; i < 18; i++) { var a = i / 18 * D2, sp = new T.Mesh(new T.ConeGeometry(0.03, 0.06 + hash(i, 3) * 0.04, 4), solid('#7a6a52', { flatShading: true })); sp.position.set(Math.cos(a) * 0.27, 0.3, -0.1 + Math.sin(a) * 0.27); g.add(sp); }
    // the low neck of land with a village and a path
    blob(g, '#6a9a4a', 0.4, 0.18, 0.1, 0.4, 0.01, 2);
    for (var h = 0; h < 6; h++) { var x = -0.1 + h * 0.07, z = 0.42 + hash(h, 4) * 0.08; box(g, solid('#e8e4dc'), 0.04, 0.025, 0.03, x, 0.01, z); box(g, solid(h % 2 ? '#3f6ab0' : '#d06a3a'), 0.044, 0.008, 0.034, x, 0.035, z); }
    // haenyeo divers' buoys in the water
    for (var b = 0; b < 4; b++) { var bu = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), solid('#ff7a1a')); bu.position.set(0.4 + b * 0.04, 0.008, 0.2 + hash(b, 5) * 0.1); g.add(bu); }
    return g;
  };

  /* ---------- Citadelle Laferrière ---------- */
  M.custom.citadelle = function () {
    var g = new T.Group(), st = mat(stoneTex('clf', '#a89a88', '#8a7e6e', 8, 6), 3, 1), stD = solid('#7a6e60');
    blob(g, '#3f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.28, rings: 12, r: function (t) { return t > 0.9 ? 0.2 : 0.5 * (1 - t) + 0.2; }, bump: 0.2, colour: function (x, y) { return y > 0.26 ? '#4a7a3a' : '#3f8a3f'; } });
    // the fortress: a ship-like prow, thick walls in steps
    var sh = new T.Shape(); sh.moveTo(-0.16, -0.12); sh.lineTo(0.12, -0.12); sh.lineTo(0.2, 0.02); sh.lineTo(0.08, 0.16); sh.lineTo(-0.16, 0.12); sh.lineTo(-0.16, -0.12);
    var walls = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: false }), st); walls.rotation.x = -Math.PI / 2; walls.position.y = 0.27; g.add(walls);
    var sh2 = new T.Shape(); sh2.moveTo(-0.14, -0.08); sh2.lineTo(0.06, -0.08); sh2.lineTo(0.1, 0.02); sh2.lineTo(0.04, 0.1); sh2.lineTo(-0.14, 0.08); sh2.lineTo(-0.14, -0.08);
    var top = new T.Mesh(new T.ExtrudeGeometry(sh2, { depth: 0.06, bevelEnabled: false }), stD); top.rotation.x = -Math.PI / 2; top.position.y = 0.43; g.add(top);
    // rows of cannon ports along the walls
    for (var i = 0; i < 6; i++) box(g, solid('#2a2420'), 0.02, 0.012, 0.004, -0.13 + i * 0.045, 0.37, 0.121 + i * 0.006);
    for (var k = 0; k < 4; k++) { var cn = new T.Mesh(new T.CylinderGeometry(0.006, 0.008, 0.05, 6), solid('#2a2a2a')); cn.rotation.z = Math.PI / 2; cn.position.set(-0.24, 0.29, -0.1 + k * 0.05); g.add(cn); }
    // a flag of Haiti
    cyl(g, solid('#eeeeee'), 0.003, 0.003, 0.1, -0.08, 0.49, 0, 4);
    box(g, solid('#00209f'), 0.06, 0.02, 0.003, -0.05, 0.57, 0); box(g, solid('#d21034'), 0.06, 0.02, 0.003, -0.05, 0.55, 0);
    for (var t = 0; t < 14; t++) { var a = t / 14 * D2; tree(g, Math.cos(a) * 0.55, Math.sin(a) * 0.45, 0.9, '#2f7a35'); }
    return g;
  };

  /* ---------- Dunn's River Falls ---------- */
  M.custom.dunnsriver = function () {
    var g = new T.Group(), water = solid('#bfe8f4', { transparent: true, opacity: 0.85 }), rock = solid('#a8987a', { flatShading: true });
    blob(g, '#3a9fc8', 0.74, 0.62, 0, 0.1, 0.006, 5);
    blob(g, '#f2e8d0', 0.6, 0.12, 0, 0.36, 0.01, 2);
    // a staircase of travertine terraces with water spilling down each step, right into the sea
    for (var s = 0; s < 7; s++) { var z = 0.26 - s * 0.09, y = s * 0.05, w = 0.24 - s * 0.01;
      box(g, rock, w + 0.04, y + 0.03, 0.09, hash(s, 1) * 0.04 - 0.02, 0.01, z);
      var pool = new T.Mesh(new T.CircleGeometry(w * 0.45, 12), solid('#6fd0e0')); pool.rotation.x = -Math.PI / 2; pool.scale.y = 0.35; pool.position.set(hash(s, 1) * 0.04 - 0.02, y + 0.041, z); g.add(pool);
      var fall = new T.Mesh(new T.PlaneGeometry(w * 0.8, 0.05), water); fall.position.set(hash(s, 1) * 0.04 - 0.02, y + 0.02, z + 0.046); g.add(fall); }
    // tropical forest on both banks
    for (var t = 0; t < 22; t++) { var side = t % 2 ? 1 : -1, z2 = 0.3 - (t >> 1) * 0.06, c = new T.Mesh(new T.IcosahedronGeometry(0.05 + hash(t, 2) * 0.03, 0), solid(t % 3 ? '#3f8f45' : '#2f7a35', { flatShading: true })); c.position.set(side * (0.22 + hash(t, 3) * 0.12), 0.05 + (0.3 - z2) * 0.4, z2); g.add(c); }
    palm(g, -0.4, 0.38, 1.2); palm(g, 0.38, 0.36, 1.1);
    // a chain of climbers holding hands
    for (var p = 0; p < 5; p++) { var pz = 0.2 - p * 0.06; cyl(g, solid(['#d04a2a', '#2b6fd0', '#e8c34a', '#3f9a4a', '#a050c0'][p]), 0.008, 0.008, 0.025, 0.04, p * 0.035 + 0.04, pz, 6); }
    return g;
  };

  /* ---------- The Twelve Apostles ---------- */
  M.custom.apostles = function () {
    var g = new T.Group(), lime = solid('#d8a86a', { flatShading: true }), limeD = solid('#b8885a', { flatShading: true });
    blob(g, '#2f7fb0', 0.74, 0.62, 0, 0, 0.006, 6);
    // the cliff coast along the back
    var sh = new T.Shape(); sh.moveTo(-0.5, 0.45); for (var i = 0; i <= 10; i++) sh.lineTo(-0.5 + i * 0.1, 0.04 + hash(i, 2) * 0.08); sh.lineTo(0.5, 0.45); sh.lineTo(-0.5, 0.45);
    var cliff = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false }), lime); cliff.rotation.x = -Math.PI / 2; cliff.position.y = 0.006; g.add(cliff);
    var top = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false }), solid('#7a9a4a')); top.rotation.x = -Math.PI / 2; top.position.y = 0.206; g.add(top);
    // limestone stacks standing in the surf, banded in layers
    [[-0.45, 0.08, 0.16], [-0.28, 0.2, 0.2], [-0.1, 0.12, 0.17], [0.08, 0.26, 0.15], [0.25, 0.15, 0.19], [0.42, 0.24, 0.13], [0.5, 0.06, 0.12]].forEach(function (q, k) {
      var s = new T.Mesh(new T.CylinderGeometry(0.03 + hash(k, 1) * 0.01, 0.05, q[2], 6, 4), k % 2 ? lime : limeD);
      var p = s.geometry.attributes.position; for (var v = 0; v < p.count; v++) { p.setX(v, p.getX(v) * (1 + Math.sin(p.getY(v) * 60 + k) * 0.1)); }
      s.geometry.computeVertexNormals(); s.position.set(q[0], q[2] / 2 + 0.006, q[1]); s.rotation.y = k; g.add(s);
      var foam = new T.Mesh(new T.RingGeometry(0.05, 0.065, 12), solid('#ffffff')); foam.rotation.x = -Math.PI / 2; foam.position.set(q[0], 0.009, q[1]); g.add(foam);
    });
    for (var w = 0; w < 5; w++) { var wv = new T.Mesh(new T.PlaneGeometry(0.75 - w * 0.08, 0.01), solid('#ffffff')); wv.rotation.x = -Math.PI / 2; wv.position.set(0, 0.008, 0.3 + w * 0.06); g.add(wv); }
    return g;
  };

  /* ---------- Temple in the Sea ---------- */
  M.custom.templesea = function () {
    var g = new T.Group(), white = mat(winTex('tits', '#f6f2ea', '#c9a050', 4, 1, { tall: 0.4 }), 1, 1), gold = solid('#d8a84a', { emissive: '#3a2600' });
    blob(g, '#4aa0b0', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#c9b890', 0.5, 0.18, 0, -0.38, 0.01, 2);
    for (var t = 0; t < 7; t++) palm(g, -0.4 + t * 0.13, -0.42, 1.1);
    // a causeway out to the little white temple on the water
    box(g, solid('#c9c0b0'), 0.06, 0.018, 0.34, 0, 0.006, -0.12);
    blob(g, '#d8d2c0', 0.2, 0.18, 0, 0.12, 0.016, 2);
    box(g, white, 0.18, 0.08, 0.14, 0, 0.02, 0.12);
    box(g, solid('#e8e2d4'), 0.2, 0.012, 0.16, 0, 0.1, 0.12);
    // small domes and a central spire in the Hindu style
    var spire = lathe([[0.04, 0], [0.04, 0.03], [0.03, 0.06], [0.018, 0.1], [0.008, 0.13], [0, 0.14]], 8, solid('#f6f2ea')); spire.position.set(0, 0.112, 0.12); g.add(spire);
    var top = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), gold); top.position.set(0, 0.258, 0.12); g.add(top);
    [[-0.07, 0.07], [0.07, 0.07], [-0.07, 0.17], [0.07, 0.17]].forEach(function (q) { var d = new T.Mesh(new T.SphereGeometry(0.022, 10, 6, 0, D2, 0, Math.PI / 2), solid('#f6f2ea')); d.position.set(q[0], 0.112, q[1]); g.add(d); var f = new T.Mesh(new T.ConeGeometry(0.005, 0.02, 5), gold); f.position.set(q[0], 0.142, q[1]); g.add(f); });
    // prayer flags (jhandi) on bamboo poles
    for (var j = 0; j < 5; j++) { var x = -0.25 + j * 0.12; cyl(g, solid('#c9b890'), 0.003, 0.003, 0.14, x, 0.01, -0.28, 4); box(g, solid(['#d03a2a', '#e8c34a', '#ffffff', '#3f9a4a', '#2b6fd0'][j]), 0.025, 0.03, 0.002, x + 0.014, 0.12, -0.28); }
    return g;
  };
})();
