/* Detailed landmarks, batch 22: Aït Benhaddou, Karnak Temple, Mount Nyiragongo, Stone Town (Zanzibar),
   African Renaissance Monument, Anse Source d'Argent, Basotho Hat building, Le Morne Brabant. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, paintVerts = K.paintVerts, vcMat = K.vcMat, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function jungle(g, n, r0, r1, seed, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(i % 3 ? '#3f8f45' : '#4fa24f', { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.035, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- Aït Benhaddou ---------- */
  M.custom.aitbenhaddou = function () {
    var g = new T.Group(), mud = solid('#c98a5a', { flatShading: true }), mudL = solid('#d8a06a'), mudD = solid('#a86a42');
    blob(g, '#d8b080', 0.74, 0.62, 0, 0, 0.006, 4);
    var river = new T.Mesh(new T.PlaneGeometry(1.05, 0.08), solid('#7a9aa8')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.008, 0.42); g.add(river);
    mountain(g, { h: 0.18, pos: [0, -0.15], rings: 8, r: function (t) { return 0.42 * (1 - t) + 0.05; }, bump: 0.25, sx: 1.2, sz: 0.7, colour: function () { return '#c09060'; } });
    // a crowd of mud houses and kasbah towers climbing the hill, a granary on top
    for (var i = 0; i < 22; i++) {
      var t = i / 22, a = t * D2 * 1.2, r = 0.35 - t * 0.25, x = Math.cos(a) * r, z = -0.15 + Math.sin(a) * r * 0.7, y = t * 0.15, h = 0.05 + hash(i, 2) * 0.04, w = 0.06 + hash(i, 3) * 0.03;
      box(g, i % 3 ? mud : mudL, w, h + y, w * 0.9, x, 0.006, z);
      if (i % 4 === 0) { box(g, mudD, 0.04, h + y + 0.06, 0.04, x + w * 0.4, 0.006, z); for (var c = 0; c < 2; c++) box(g, mudL, 0.012, 0.012, 0.042, x + w * 0.4 - 0.012 + c * 0.024, h + y + 0.066, z); }
      box(g, solid('#5a3a28'), 0.008, 0.012, 0.002, x, 0.006 + (h + y) * 0.6, z + w * 0.45);
    }
    box(g, mudL, 0.12, 0.05, 0.08, 0, 0.18, -0.2);
    for (var p = 0; p < 4; p++) palm(g, -0.4 + p * 0.25, 0.32, 1.1);
    return g;
  };

  /* ---------- Karnak Temple ---------- */
  M.custom.karnak = function () {
    var g = new T.Group(), sand = solid('#d8b88a'), col = mat(tex('karc', 32, 64, function (c, W, H) { c.fillStyle = '#d8c094'; c.fillRect(0, 0, W, H); c.fillStyle = '#a8885a'; for (var y = 6; y < H; y += 10) for (var x = 4; x < W; x += 8) c.fillRect(x, y, 3, 5); c.fillStyle = '#3f7ab0'; c.fillRect(0, 0, W, 4); }), 1, 1);
    blob(g, '#e0c496', 0.74, 0.62, 0, 0, 0.006, 3);
    // the great pylon gate
    [-0.16, 0.16].forEach(function (x) { var p = new T.Mesh(new T.CylinderGeometry(0.09, 0.12, 0.3, 4), mat(stoneTex('karp', '#d8c094', '#bca478', 8, 6), 1, 1)); p.rotation.y = Math.PI / 4; p.scale.z = 0.4; p.position.set(x, 0.156, 0.32); g.add(p); });
    box(g, sand, 0.08, 0.18, 0.06, 0, 0.006, 0.32);
    // the hypostyle hall: a forest of thick columns with papyrus capitals
    for (var r = 0; r < 5; r++) for (var c = 0; c < 7; c++) { var x = -0.27 + c * 0.09, z = 0.15 - r * 0.09, big = c === 3 || c === 2 || c === 4; cyl(g, col, 0.026, 0.028, big ? 0.3 : 0.22, x, 0.006, z, 10); var cap = new T.Mesh(new T.CylinderGeometry(0.038, 0.026, 0.03, 10), solid('#c9ac7a')); cap.position.set(x, 0.006 + (big ? 0.3 : 0.22) + 0.015, z); g.add(cap); }
    box(g, sand, 0.2, 0.02, 0.46, 0, 0.336, -0.03);
    // obelisks and the avenue of ram-headed sphinxes
    [[-0.3, -0.35], [0.25, -0.38]].forEach(function (q) { var ob = new T.Mesh(new T.CylinderGeometry(0.008, 0.016, 0.34, 4), solid('#c99a6a')); ob.rotation.y = Math.PI / 4; ob.position.set(q[0], 0.176, q[1]); g.add(ob); var tip = new T.Mesh(new T.ConeGeometry(0.012, 0.03, 4), solid('#e8b52a', { emissive: '#4a3200' })); tip.rotation.y = Math.PI / 4; tip.position.set(q[0], 0.36, q[1]); g.add(tip); });
    for (var s = 0; s < 5; s++) [-1, 1].forEach(function (sd) { var sp = new T.Group(); box(sp, sand, 0.025, 0.02, 0.05, 0, 0, 0); var h = new T.Mesh(new T.SphereGeometry(0.012, 6, 5), sand); h.position.set(0, 0.03, 0.02); sp.add(h); sp.position.set(sd * 0.08, 0.006, 0.42 + s * 0.04); g.add(sp); });
    return g;
  };

  /* ---------- Mount Nyiragongo ---------- */
  M.custom.nyiragongo = function () {
    var g = new T.Group();
    blob(g, '#3f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.45, pos: [0, -0.05], rings: 16, r: function (t) { return t > 0.85 ? 0.12 + (t - 0.85) * 0.2 : 0.5 * (1 - t) + 0.07; }, bump: 0.12, f: 6, colour: function (x, y) { return y > 0.3 ? '#3a3230' : y > 0.15 ? '#5a5048' : '#3f7a3f'; } });
    // the lava lake glowing inside the crater
    var lake = new T.Mesh(new T.CircleGeometry(0.1, 20), solid('#ff6a1a', { emissive: '#ff3a00' })); lake.rotation.x = -Math.PI / 2; lake.position.set(0, 0.41, -0.05); g.add(lake);
    for (var i = 0; i < 10; i++) { var c = new T.Mesh(new T.SphereGeometry(0.01 + hash(i, 1) * 0.01, 5, 4), solid('#ffd02a', { emissive: '#ff8a00' })); c.scale.y = 0.3; c.position.set(Math.cos(i) * 0.06, 0.414, -0.05 + Math.sin(i) * 0.06); g.add(c); }
    for (var s = 0; s < 4; s++) { var sm = new T.Mesh(new T.SphereGeometry(0.05 + s * 0.015, 8, 6), solid('#b8b0a8', { transparent: true, opacity: 0.7 })); sm.position.set(s * 0.03, 0.5 + s * 0.05, -0.08); g.add(sm); }
    jungle(g, 18, 0.5, 0.72, 4);
    blob(g, '#3f7fa8', 0.3, 0.1, 0.1, 0.5, 0.01, 2); // Lake Kivu
    return g;
  };

  /* ---------- Stone Town, Zanzibar ---------- */
  M.custom.stonetown = function () {
    var g = new T.Group(), walls = ['#f2ece0', '#e8dcc4', '#d8cbb0', '#f6f2ea', '#c9d8e0'], door = mat(tex('zdoor', 16, 32, function (c, W, H) { c.fillStyle = '#5a3a20'; c.fillRect(0, 0, W, H); c.fillStyle = '#c9a050'; for (var y = 4; y < H; y += 6) for (var x = 2; x < W; x += 5) c.fillRect(x, y, 2, 2); c.fillStyle = '#3a2410'; c.fillRect(W / 2 - 0.5, 0, 1, H); c.beginPath(); c.arc(W / 2, 3, 6, Math.PI, 0); c.fill(); }), 1, 1);
    blob(g, '#2f9fc8', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#e8dcb0', 0.62, 0.4, -0.05, -0.1, 0.01, 2);
    for (var i = 0; i < 16; i++) { var x = -0.4 + (i % 4) * 0.2 + hash(i, 1) * 0.03, z = -0.36 + Math.floor(i / 4) * 0.13, h = 0.08 + hash(i, 2) * 0.05; box(g, solid(walls[i % 5]), 0.16, h, 0.1, x, 0.01, z); box(g, solid('#6a5a4a'), 0.165, 0.008, 0.105, x, 0.01 + h, z); box(g, door, 0.03, 0.05, 0.004, x, 0.01, z + 0.052); box(g, solid('#6a4a2a'), 0.12, 0.006, 0.02, x, 0.01 + h * 0.7, z + 0.06); }
    // the House of Wonders with its clock tower
    box(g, mat(winTex('how', '#f6f2ea', '#4a5a6a', 6, 3, { tall: 0.5 }), 2, 1), 0.24, 0.14, 0.12, 0.05, 0.01, 0.18); box(g, solid('#f6f2ea'), 0.05, 0.08, 0.05, 0.05, 0.15, 0.18); cyl(g, solid('#3f8a5a'), 0, 0.03, 0.03, 0.05, 0.23, 0.18, 4, Math.PI / 4);
    // dhows with triangular sails
    [[0.4, 0.3, 0.5], [0.25, 0.45, -0.3]].forEach(function (q) { var b = new T.Group(); box(b, solid('#8a5a32'), 0.03, 0.015, 0.1, 0, 0, 0); var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(0.0, 0.1); sh.lineTo(0.08, 0.0); sh.lineTo(0, 0); var s = new T.Mesh(new T.ShapeGeometry(sh), solid('#f6f2ea', { side: T.DoubleSide })); s.rotation.y = Math.PI / 2; s.position.set(0, 0.015, 0.04); b.add(s); b.position.set(q[0], 0.008, q[1]); b.rotation.y = q[2]; g.add(b); });
    for (var p = 0; p < 3; p++) palm(g, -0.5 + p * 0.07, 0.15, 1.0);
    return g;
  };

  /* ---------- African Renaissance Monument ---------- */
  M.custom.renaissance = function () {
    var g = new T.Group(), bronze = solid('#6a5a4a', { flatShading: true });
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.12, r: function (t) { return 0.45 * (1 - t) + 0.12; }, bump: 0.2, colour: function () { return '#a89a78'; } });
    // a wide stair up to the plinth
    for (var s = 0; s < 8; s++) box(g, solid('#e8e2d4'), 0.14, 0.015 * (s + 1), 0.03, 0, 0.0, 0.42 - s * 0.03);
    box(g, solid('#d8d2c2'), 0.16, 0.06, 0.16, 0, 0.12, 0);
    // a family: the man holding a child up high, the woman behind
    var Y = 0.18, F = new T.Group();
    var man = lathe([[0.04, 0], [0.045, 0.1], [0.05, 0.2], [0.035, 0.26], [0, 0.27]], 8, bronze); F.add(man);
    var mh = new T.Mesh(new T.SphereGeometry(0.025, 8, 6), bronze); mh.position.y = 0.3; F.add(mh);
    var arm = new T.Mesh(new T.CylinderGeometry(0.01, 0.012, 0.16, 6), bronze); arm.position.set(0.02, 0.34, 0.01); arm.rotation.z = -0.15; F.add(arm);
    var kid = new T.Mesh(new T.CylinderGeometry(0.014, 0.018, 0.07, 6), bronze); kid.position.set(0.035, 0.45, 0.01); F.add(kid); var kh = new T.Mesh(new T.SphereGeometry(0.015, 8, 6), bronze); kh.position.set(0.04, 0.5, 0.01); F.add(kh); var ka = new T.Mesh(new T.CylinderGeometry(0.005, 0.005, 0.05, 5), bronze); ka.position.set(0.05, 0.53, 0.02); ka.rotation.z = -0.3; F.add(ka);
    var wom = lathe([[0.035, 0], [0.04, 0.1], [0.04, 0.18], [0.03, 0.22], [0, 0.23]], 8, bronze); wom.position.set(-0.04, 0, -0.04); wom.rotation.z = 0.12; F.add(wom); var wh = new T.Mesh(new T.SphereGeometry(0.022, 8, 6), bronze); wh.position.set(-0.07, 0.25, -0.04); F.add(wh);
    F.position.y = Y; F.scale.setScalar(1.6); g.add(F);
    var sea = new T.Mesh(new T.PlaneGeometry(0.9, 0.14), solid('#2f8fc0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, -0.48); g.add(sea);
    return g;
  };

  /* ---------- Anse Source d'Argent ---------- */
  M.custom.ansesource = function () {
    var g = new T.Group(), granite = solid('#c99a8a', { flatShading: true }), graniteD = solid('#a87a6a', { flatShading: true });
    blob(g, '#4ac0d0', 0.74, 0.62, 0, 0.1, 0.006, 5);
    blob(g, '#f6f0e0', 0.6, 0.22, 0, -0.18, 0.012, 2);
    // big smooth pink boulders, worn into rounded shapes
    for (var i = 0; i < 9; i++) { var b = new T.Mesh(new T.SphereGeometry(0.06 + hash(i, 1) * 0.08, 10, 8), i % 2 ? granite : graniteD); b.scale.set(1.2, 0.8 + hash(i, 2) * 0.6, 1); var p = b.geometry.attributes.position; for (var k = 0; k < p.count; k++) { var y = p.getY(k); if (y > 0) p.setX(k, p.getX(k) + Math.sin(y * 40 + i) * 0.004); } b.position.set(-0.5 + i * 0.12 + hash(i, 3) * 0.04, 0.03, -0.2 + hash(i, 4) * 0.2); g.add(b); }
    for (var p2 = 0; p2 < 6; p2++) { var t = new T.Group(); palm(t, 0, 0, 1.3); t.position.set(-0.45 + p2 * 0.17, 0.012, -0.36); t.rotation.z = (p2 % 2 ? 0.15 : -0.15); g.add(t); }
    // a giant tortoise from nearby Aldabra on the sand
    var tt = new T.Mesh(new T.SphereGeometry(0.03, 8, 6, 0, D2, 0, Math.PI / 2), solid('#5a5040')); tt.scale.set(1, 0.8, 1.2); tt.position.set(0.1, 0.012, -0.05); g.add(tt);
    return g;
  };

  /* ---------- Basotho Hat building ---------- */
  M.custom.basotho = function () {
    var g = new T.Group(), thatch = mat(tex('bsth', 32, 32, function (c, W, H) { c.fillStyle = '#c9a050'; c.fillRect(0, 0, W, H); c.strokeStyle = 'rgba(90,60,20,.45)'; c.lineWidth = 1; for (var y = 0; y < H; y += 4) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + 2); c.stroke(); } }), 4, 2);
    blob(g, '#8aa860', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.4, pos: [0, -0.32], r: function (t) { return 0.4 * (1 - t) + 0.03; }, bump: 0.3, sx: 1.0, sz: 0.35, colour: function (x, y) { return y > 0.3 ? '#a8a08a' : '#6a8a4a'; } });
    // the mokorotlo hat: a cone with a knob and woven rings on top
    var hat = lathe([[0.26, 0], [0.24, 0.03], [0.17, 0.12], [0.1, 0.22], [0.05, 0.3], [0.03, 0.34], [0, 0.34]], 24, thatch); hat.position.y = 0.006; g.add(hat);
    [[0.04, 0.33], [0.032, 0.36], [0.022, 0.39]].forEach(function (r) { var ring = new T.Mesh(new T.TorusGeometry(r[0], 0.008, 5, 14), solid('#a87a3a')); ring.rotation.x = Math.PI / 2; ring.position.y = r[1]; g.add(ring); });
    var knob = new T.Mesh(new T.SphereGeometry(0.018, 8, 6), solid('#a87a3a')); knob.position.y = 0.41; g.add(knob);
    box(g, solid('#3a2a20'), 0.06, 0.06, 0.004, 0, 0.006, 0.255);
    // a horseman in a blanket, as often seen in Lesotho
    var h = new T.Group(), hb = solid('#5a3a28'); box(h, hb, 0.014, 0.018, 0.045, 0, 0.026, 0); [[0.005, 0.016], [-0.005, 0.016], [0.005, -0.016], [-0.005, -0.016]].forEach(function (q) { box(h, hb, 0.004, 0.026, 0.004, q[0], 0, q[1]); }); box(h, hb, 0.008, 0.022, 0.01, 0, 0.038, 0.02); cyl(h, solid('#2b6fd0'), 0.008, 0.012, 0.03, 0, 0.044, 0, 6); var rh = new T.Mesh(new T.ConeGeometry(0.012, 0.016, 8), solid('#c9a050')); rh.position.y = 0.084; h.add(rh);
    h.position.set(0.35, 0.006, 0.3); h.scale.setScalar(1.8); h.rotation.y = -0.6; g.add(h);
    return g;
  };

  /* ---------- Le Morne Brabant ---------- */
  M.custom.lemorne = function () {
    var g = new T.Group();
    blob(g, '#1f5f9a', 0.74, 0.62, 0, 0, 0.006, 6);
    // shallow turquoise lagoon with sand streaks that look like an underwater waterfall
    var lag = new T.Mesh(new T.CircleGeometry(0.45, 24), solid('#5fd0d8')); lag.rotation.x = -Math.PI / 2; lag.scale.y = 0.7; lag.position.set(0.05, 0.009, 0.0); g.add(lag);
    for (var i = 0; i < 9; i++) { var st = new T.Mesh(new T.PlaneGeometry(0.03, 0.35), solid(i % 2 ? '#f2f0e4' : '#cfeaf0')); st.rotation.x = -Math.PI / 2; st.rotation.z = (i - 4) * 0.06; st.position.set(0.15 + (i - 4) * 0.025, 0.011, 0.25); g.add(st); }
    var drop = new T.Mesh(new T.CircleGeometry(0.2, 16), solid('#0f3f7a')); drop.rotation.x = -Math.PI / 2; drop.scale.y = 0.5; drop.position.set(0.15, 0.0105, 0.48); g.add(drop);
    // the basalt mountain on its peninsula
    blob(g, '#4f8a3a', 0.32, 0.22, -0.2, -0.2, 0.014, 3);
    mountain(g, { h: 0.42, pos: [-0.22, -0.22], rings: 12, r: function (t) { return t > 0.85 ? 0.16 * (1 - (t - 0.85) * 4) : 0.22 - t * 0.07; }, bump: 0.2, sx: 1.3, colour: function (x, y) { return y > 0.38 ? '#4f8a3a' : noise(x * 14, y * 14) > 0.5 ? '#4a4540' : '#5f5a52'; } });
    blob(g, '#f6f0e0', 0.2, 0.05, 0.05, -0.04, 0.012, 2);
    for (var p = 0; p < 4; p++) { var pl = new T.Group(); cyl(pl, solid('#8a6a3a'), 0.005, 0.008, 0.12, 0, 0, 0, 5); for (var k = 0; k < 5; k++) { var l = new T.Mesh(new T.BoxGeometry(0.06, 0.004, 0.018), solid('#3f9a4a')); l.position.set(Math.cos(k * 1.26) * 0.025, 0.12, Math.sin(k * 1.26) * 0.025); l.rotation.set(0, -k * 1.26, -0.4); pl.add(l); } pl.position.set(-0.05 + p * 0.06, 0.012, -0.08); g.add(pl); }
    return g;
  };
})();
