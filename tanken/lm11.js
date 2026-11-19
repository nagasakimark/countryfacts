/* Detailed landmarks, batch 11: Hội An Japanese Bridge, Grand Palace (Bangkok), Tanah Lot, Boudhanath,
   Monument Valley, Château Frontenac, Torres del Paine, Cologne Cathedral. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function dome(g, m, r, x, y, z, sy) { var d = new T.Mesh(new T.SphereGeometry(r, 14, 8, 0, D2, 0, Math.PI / 2), m); d.scale.y = sy || 1; d.position.set(x, y, z); g.add(d); return d; }
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function flags(g, a, b, n, y0, sag) { var cols = ['#2b6fd0', '#ffffff', '#e8473a', '#4fb35a', '#f2c14e']; for (var i = 0; i <= n; i++) { var t = i / n, f = new T.Mesh(new T.PlaneGeometry(0.016, 0.012), solid(cols[i % 5], { side: T.DoubleSide })); f.position.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * sag, a[2] + (b[2] - a[2]) * t); f.lookAt(0, f.position.y, 0); g.add(f); } }

  /* ---------- Hội An Japanese Covered Bridge ---------- */
  M.custom.hoian = function () {
    var g = new T.Group(), wood = solid('#8a4a2a'), woodL = solid('#b0683a'), tile = mat(tex('hoit', 64, 32, function (c, W, H) { c.fillStyle = '#c9a070'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(90,50,20,.35)'; for (var x = 0; x < W; x += 4) c.fillRect(x, 0, 1.5, H); }), 4, 1);
    blob(g, '#c9b896', 0.74, 0.62, 0, 0, 0.006, 3);
    var river = new T.Mesh(new T.PlaneGeometry(0.4, 1.4), solid('#4a8f8a')); river.rotation.x = -Math.PI / 2; river.position.y = 0.01; g.add(river);
    // the gently arched covered bridge across the stream
    var b = new T.Group();
    var deck = new T.Mesh(new T.TorusGeometry(0.6, 0.012, 4, 20, 0.7), solid('#9a8a7a')); deck.rotation.z = Math.PI / 2 - 0.35; deck.position.set(0, -0.52, 0); deck.scale.z = 6; b.add(deck);
    box(b, solid('#e8d8a8'), 0.08, 0.06, 0.4, 0, 0.07, 0);
    for (var i = 0; i < 6; i++) [-0.04, 0.04].forEach(function (x) { cyl(b, wood, 0.005, 0.005, 0.07, x, 0.07, -0.18 + i * 0.072, 6); });
    ridge(b, tile, 0.13, 0.06, 0.44, 0, 0.14, 0, 0); box(b, solid('#6a3a1a'), 0.012, 0.012, 0.46, 0, 0.198, 0);
    [-0.06, 0.06].forEach(function (x) { for (var l = 0; l < 4; l++) { var ln = new T.Mesh(new T.SphereGeometry(0.01, 6, 5), solid(['#e8473a', '#f2c14e', '#ff8a3a', '#e84a8a'][l])); ln.scale.y = 1.3; ln.position.set(x, 0.12, -0.15 + l * 0.1); b.add(ln); } });
    b.rotation.y = Math.PI / 2; g.add(b);
    // the little temple on one side and yellow merchant houses
    box(g, solid('#e8c860'), 0.1, 0.07, 0.1, 0.05, 0.0, -0.18); hip(g, tile, 0.14, 0.14, 0.05, 0.05, 0.07, -0.18, 0.3);
    [[-0.45, -0.2], [-0.45, 0.05], [0.45, -0.15], [0.45, 0.15], [-0.42, 0.3]].forEach(function (q, k) { box(g, solid(k % 2 ? '#f2d06a' : '#e8b84a'), 0.14, 0.08, 0.12, q[0], 0, q[1]); ridge(g, tile, 0.15, 0.04, 0.13, q[0], 0.08, q[1], Math.PI / 2); });
    var boat = new T.Group(); box(boat, solid('#6a3a1a'), 0.03, 0.012, 0.08, 0, 0, 0); var hat = new T.Mesh(new T.ConeGeometry(0.012, 0.01, 8), solid('#e8d8a8')); hat.position.y = 0.03; boat.add(hat); boat.position.set(0.05, 0.012, 0.4); g.add(boat);
    return g;
  };

  /* ---------- Grand Palace & Wat Phra Kaew ---------- */
  M.custom.grandpalace = function () {
    var g = new T.Group(), gold = solid('#e8b52a', { emissive: '#4a3200' }), white = solid('#f6f3ec'), roofO = solid('#d8602e'), roofG = solid('#3f9a5a');
    blob(g, '#d8d2c2', 0.74, 0.62, 0, 0, 0.006, 2);
    [[0, -0.5, 1.1, 0.03], [0, 0.5, 1.1, 0.03], [-0.55, 0, 0.03, 1.0], [0.55, 0, 0.03, 1.0]].forEach(function (q) { box(g, white, q[2], 0.06, q[3], q[0], 0, q[1]); });
    // Thai temple hall: layered steep roofs with golden finials
    function hall(x, z, w, d) { box(g, white, w, 0.1, d, x, 0, z); box(g, gold, w + 0.01, 0.015, d + 0.01, x, 0.1, z); [0, 1, 2].forEach(function (k) { var o = new T.Group(); prism(o, k % 2 ? roofG : roofO, w * (0.9 - k * 0.15), 0.1 - k * 0.015, d * (1.05 - k * 0.12), 0, 0, 0); o.position.set(x, 0.11 + k * 0.035, z); g.add(o); }); [-1, 1].forEach(function (s) { var f = new T.Mesh(new T.ConeGeometry(0.006, 0.05, 4), gold); f.position.set(x, 0.24, z + s * d * 0.45); f.rotation.x = s * 0.4; g.add(f); }); }
    hall(-0.2, 0.1, 0.18, 0.36); hall(0.25, 0.25, 0.14, 0.26);
    // the golden bell-shaped chedi
    var ch = lathe([[0.1, 0], [0.1, 0.03], [0.085, 0.04], [0.09, 0.08], [0.085, 0.13], [0.07, 0.17], [0.04, 0.2], [0.03, 0.24], [0.02, 0.3], [0.008, 0.36], [0, 0.4]], 18, gold); ch.position.set(0.2, 0.0, -0.25); g.add(ch);
    // the prang spire
    var pr = lathe([[0.06, 0], [0.06, 0.06], [0.05, 0.08], [0.05, 0.14], [0.04, 0.16], [0.035, 0.24], [0.02, 0.3], [0.006, 0.36], [0, 0.4]], 8, solid('#f2b84a')); pr.position.set(-0.25, 0.0, -0.25); g.add(pr);
    // guardian giants at the gate
    [-0.08, 0.08].forEach(function (x) { cyl(g, solid('#4aa86a'), 0.012, 0.016, 0.08, x, 0, 0.45, 6); var hd = new T.Mesh(new T.ConeGeometry(0.012, 0.04, 6), gold); hd.position.set(x, 0.1, 0.45); g.add(hd); });
    return g;
  };

  /* ---------- Tanah Lot ---------- */
  M.custom.tanahlot = function () {
    var g = new T.Group(), thatch = solid('#2a2420', { flatShading: true });
    blob(g, '#2f86b8', 0.74, 0.62, 0, 0, 0.006, 6);
    blob(g, '#d8c9a0', 0.6, 0.15, 0, 0.45, 0.01, 2);
    mountain(g, { h: 0.2, pos: [0, -0.08], rings: 8, r: function (t) { return 0.22 * (1 - t * 0.4); }, bump: 0.3, sx: 1.2, colour: function (x, y) { return y > 0.18 ? '#5f8a4a' : noise(x * 14, y * 14) > 0.5 ? '#5a4e44' : '#6f625a'; } });
    // meru towers: stacked black thatch roofs
    function meru(x, z, tiers, s) { box(g, solid('#8a6a52'), 0.05 * s, 0.03, 0.05 * s, x, 0.2, z); for (var i = 0; i < tiers; i++) { var w = (0.08 - i * 0.012) * s, r = new T.Mesh(new T.CylinderGeometry(w * 0.4, w, 0.02, 4), thatch); r.rotation.y = Math.PI / 4; r.position.set(x, 0.24 + i * 0.026, z); g.add(r); } }
    meru(0.0, -0.08, 5, 1.2); meru(-0.1, -0.02, 3, 1.0); meru(0.1, -0.12, 3, 0.9);
    for (var j = 0; j < 4; j++) palm(g, -0.12 + j * 0.08, -0.22, 0.9);
    for (var w = 0; w < 6; w++) { var f = new T.Mesh(new T.SphereGeometry(0.04, 7, 4), solid('#ffffff')); f.scale.y = 0.2; f.position.set(Math.cos(w) * 0.27, 0.008, -0.08 + Math.sin(w) * 0.24); g.add(f); }
    [[-0.45, 0.42], [0.45, 0.42]].forEach(function (q) { palm(g, q[0], q[1], 1.3); });
    return g;
  };

  /* ---------- Boudhanath Stupa ---------- */
  M.custom.boudha = function () {
    var g = new T.Group(), white = solid('#f6f4ee'), gold = solid('#e8b52a', { emissive: '#4a3200' });
    blob(g, '#d8d2c2', 0.74, 0.62, 0, 0, 0.006, 3);
    [[0.84, 0], [0.7, 0.04], [0.56, 0.08]].forEach(function (q) { box(g, mat(stoneTex('bdst', '#f0ece4', '#d8d2c6', 16, 8), 5, 1), q[0], 0.04, q[0], 0, q[1], 0); });
    dome(g, white, 0.24, 0, 0.12, 0, 0.75);
    var eyes = mat(tex('beyes', 64, 64, function (c, W, H) { c.fillStyle = '#e8b52a'; c.fillRect(0, 0, W, H); c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(18, 30, 10, 6, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(46, 30, 10, 6, 0, 0, 7); c.fill(); c.fillStyle = '#2a4a8a'; c.beginPath(); c.arc(18, 30, 4, 0, 7); c.fill(); c.beginPath(); c.arc(46, 30, 4, 0, 7); c.fill(); c.strokeStyle = '#2a2020'; c.lineWidth = 3; c.beginPath(); c.arc(18, 24, 10, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.beginPath(); c.arc(46, 24, 10, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.fillStyle = '#c0392b'; c.font = 'bold 18px sans-serif'; c.fillText('?', 27, 52); }), 1, 1);
    box(g, eyes, 0.12, 0.08, 0.12, 0, 0.3, 0);
    var sp = lathe([[0.05, 0], [0.04, 0.03], [0.045, 0.04], [0.035, 0.07], [0.04, 0.08], [0.03, 0.11], [0.035, 0.12], [0.025, 0.15], [0.028, 0.16], [0.015, 0.2], [0.03, 0.21], [0.02, 0.23], [0, 0.26]], 12, gold); sp.position.y = 0.38; g.add(sp);
    // prayer flags from the spire to the ground
    for (var k = 0; k < 8; k++) { var a = k / 8 * D2; flags(g, [0, 0.6, 0], [Math.cos(a) * 0.45, 0.04, Math.sin(a) * 0.45], 9, 0, 0.03); }
    return g;
  };

  /* ---------- Monument Valley ---------- */
  M.custom.monumentvalley = function () {
    var g = new T.Group();
    blob(g, '#d0744a', 0.74, 0.62, 0, 0, 0.006, 4);
    function butte(x, z, h, r, sx, sz, seed) { mountain(g, { h: h, pos: [x, z], rings: 12, r: function (t) { return t < 0.2 ? r * (1.8 - t * 4) : (t > 0.95 ? r * (1 - (t - 0.95) * 18) : r); }, bump: 0.2, sx: sx, sz: sz, jag: 0.006, seed: seed, colour: function (px, py) { return py < h * 0.2 ? '#c96a40' : noise(px * 10, py * 16) > 0.55 ? '#a8502e' : '#b85a34'; } }); }
    butte(-0.3, -0.15, 0.36, 0.12, 1.5, 0.7, 1); butte(0.3, -0.2, 0.32, 0.11, 1.3, 0.7, 4);
    // the "Mitten" thumbs
    butte(-0.18, -0.15, 0.3, 0.025, 1, 1, 7); butte(0.42, -0.2, 0.27, 0.022, 1, 1, 9);
    butte(0.05, 0.25, 0.2, 0.08, 1.8, 0.6, 11);
    box(g, solid('#b8603a'), 0.06, 0.004, 1.2, -0.05, 0.008, 0.0).rotation.y = 0.4;
    for (var k = 0; k < 8; k++) { var bush = new T.Mesh(new T.SphereGeometry(0.015, 5, 4), solid('#7a8a4a', { flatShading: true })); bush.position.set(-0.6 + hash(k, 1) * 1.2, 0.012, 0.15 + hash(k, 2) * 0.35); g.add(bush); }
    return g;
  };

  /* ---------- Château Frontenac ---------- */
  M.custom.frontenac = function () {
    var g = new T.Group(), brick = mat(winTex('frb', '#a85a3a', '#3a3a44', 4, 4, { tall: 0.4 }), 3, 2), copper = solid('#4fa88a', { flatShading: true });
    var river = new T.Mesh(new T.PlaneGeometry(1.5, 0.3), solid('#4a7fa8')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.008, 0.45); g.add(river);
    mountain(g, { h: 0.14, pos: [0, -0.12], rings: 6, r: function (t) { return 0.62 * (1 - t * 0.3); }, bump: 0.15, sx: 1.2, sz: 0.6, colour: function (x, y) { return y > 0.12 ? '#6f9a4a' : '#7a7468'; } });
    var Y = 0.14;
    function wing(x, z, w, d, h, ry) { var o = new T.Group(); box(o, brick, w, h, d, 0, 0, 0); var rf = new T.Mesh(new T.CylinderGeometry(Math.SQRT1_2 * w * 0.4, Math.SQRT1_2 * w * 0.95, 0.08, 4), copper); rf.rotation.y = Math.PI / 4; rf.scale.z = d / w; rf.position.y = h + 0.04; o.add(rf); o.position.set(x, Y, z); o.rotation.y = ry || 0; g.add(o); }
    wing(-0.2, -0.05, 0.28, 0.1, 0.16, 0.3); wing(0.2, -0.05, 0.28, 0.1, 0.16, -0.3);
    box(g, brick, 0.12, 0.34, 0.12, 0, Y, -0.1); var tr = new T.Mesh(new T.CylinderGeometry(0.03, 0.095, 0.14, 4), copper); tr.rotation.y = Math.PI / 4; tr.position.set(0, Y + 0.41, -0.1); g.add(tr); cyl(g, copper, 0, 0.012, 0.06, 0, Y + 0.48, -0.1, 4);
    [[-0.34, 0.03], [0.34, 0.03], [-0.1, 0.05], [0.1, 0.05]].forEach(function (q) { cyl(g, brick, 0.028, 0.028, 0.2, q[0], Y, q[1], 10); cyl(g, copper, 0, 0.034, 0.08, q[0], Y + 0.2, q[1], 10); });
    box(g, solid('#c9c2b0'), 0.6, 0.012, 0.05, 0.05, Y, 0.18); // Dufferin Terrace
    for (var i = 0; i < 5; i++) { var k = new T.Mesh(new T.SphereGeometry(0.012, 6, 4), solid('#e8e2d4')); k.scale.y = 1.3; k.position.set(-0.15 + i * 0.1, Y + 0.025, 0.18); g.add(k); }
    return g;
  };

  /* ---------- Torres del Paine ---------- */
  M.custom.torres = function () {
    var g = new T.Group();
    blob(g, '#7a9a5a', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#4ac0c8', 0.32, 0.14, 0.12, 0.35, 0.012, 3); // the turquoise lake
    mountain(g, { h: 0.32, pos: [0, -0.2], r: function (t) { return 0.6 * (1 - t) + 0.05; }, bump: 0.25, sx: 1.2, sz: 0.6, colour: function (x, y) { return y > 0.22 ? '#9a9890' : y < 0.06 ? '#6a8a4a' : '#7a7468'; } });
    [[-0.12, 0.62, 1], [0.0, 0.7, 5], [0.12, 0.6, 9]].forEach(function (q) { mountain(g, { h: q[1], pos: [q[0], -0.25], seg: 7, rings: 14, r: function (t) { return 0.06 * Math.pow(1 - t, 0.6) + 0.005; }, bump: 0.25, seed: q[2], colour: function (x, y) { return y > q[1] - 0.06 ? '#f6f8fa' : y > 0.45 ? '#a8a49c' : '#8f8a82'; } }); });
    // a guanaco
    var gu = new T.Group(), f = solid('#c98a52'); box(gu, f, 0.016, 0.018, 0.04, 0, 0.03, 0); [[0.005, 0.014], [-0.005, 0.014], [0.005, -0.014], [-0.005, -0.014]].forEach(function (q) { box(gu, f, 0.004, 0.03, 0.004, q[0], 0, q[1]); }); box(gu, f, 0.008, 0.03, 0.008, 0, 0.044, 0.018); box(gu, f, 0.009, 0.009, 0.016, 0, 0.072, 0.022); gu.position.set(-0.3, 0.006, 0.3); gu.scale.setScalar(1.6); g.add(gu);
    for (var k = 0; k < 6; k++) tree(g, -0.6 + k * 0.08, 0.15 + hash(k, 1) * 0.15, 0.9, '#4f7a3a');
    return g;
  };

  /* ---------- Cologne Cathedral ---------- */
  M.custom.cologne = function () {
    var g = new T.Group(), st = mat(tex('kolst', 32, 64, function (c, W, H) { c.fillStyle = '#6f6a62'; c.fillRect(0, 0, W, H); c.fillStyle = '#4a4640'; for (var x = 2; x < W; x += 8) { c.fillRect(x, 6, 4, 22); c.beginPath(); c.moveTo(x, 6); c.lineTo(x + 2, 0); c.lineTo(x + 4, 6); c.fill(); c.fillRect(x, 36, 4, 22); } c.fillStyle = 'rgba(0,0,0,.2)'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1); }), 2, 1), dark = solid('#55504a'), roof = solid('#3f4a50');
    blob(g, '#bdb8ac', 0.74, 0.62, 0, 0, 0.006, 2);
    var river = new T.Mesh(new T.PlaneGeometry(1.5, 0.2), solid('#5a8aa0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.008, 0.5); g.add(river);
    // the nave and choir with flying buttresses
    box(g, st, 0.16, 0.22, 0.6, 0, 0, -0.12); ridge(g, roof, 0.17, 0.1, 0.6, 0, 0.22, -0.12, 0);
    box(g, st, 0.32, 0.14, 0.12, 0, 0, -0.05); ridge(g, roof, 0.33, 0.08, 0.12, 0, 0.14, -0.05, Math.PI / 2);
    for (var i = 0; i < 6; i++) [-1, 1].forEach(function (s) { box(g, dark, 0.03, 0.18, 0.02, s * 0.12, 0, -0.38 + i * 0.07); var fb = box(g, dark, 0.06, 0.008, 0.012, s * 0.1, 0.16, -0.38 + i * 0.07); fb.rotation.z = s * 0.5; cyl(g, dark, 0, 0.01, 0.05, s * 0.12, 0.18, -0.38 + i * 0.07, 4); });
    // the twin west spires
    [-0.07, 0.07].forEach(function (x) { box(g, st, 0.11, 0.42, 0.11, x, 0, 0.22); box(g, st, 0.08, 0.12, 0.08, x, 0.42, 0.22); var sp = new T.Mesh(new T.CylinderGeometry(0.002, 0.05, 0.26, 8), mat(tex('kolsp', 16, 32, function (c, W, H) { c.fillStyle = '#5f5a54'; c.fillRect(0, 0, W, H); c.fillStyle = '#2a2826'; for (var y = 2; y < H; y += 6) for (var x2 = 1; x2 < W; x2 += 5) c.fillRect(x2, y, 2, 3); }), 4, 3)); sp.position.set(x, 0.67, 0.22); g.add(sp); var fin = new T.Mesh(new T.SphereGeometry(0.008, 6, 5), dark); fin.position.set(x, 0.8, 0.22); g.add(fin); });
    box(g, solid('#2a2622'), 0.06, 0.12, 0.004, 0, 0, 0.278); arch(g, solid('#2a2622'), 0.05, 0.13, 0, 0.0, 0.279, 0.002);
    // the Hohenzollern Bridge
    box(g, solid('#7a8a6a'), 1.4, 0.012, 0.06, 0, 0.04, 0.5); for (var a = 0; a < 3; a++) { var ar = new T.Mesh(new T.TorusGeometry(0.15, 0.008, 4, 14, Math.PI), solid('#6a7a5a')); ar.position.set(-0.4 + a * 0.4, 0.05, 0.5); g.add(ar); }
    return g;
  };
})();
