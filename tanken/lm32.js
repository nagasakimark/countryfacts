/* Detailed landmarks, batch 32: Edge of the World, Mt. Paektu & Heaven Lake, Star Ferry, Macau Tower,
   Umayyad Mosque, Erbil Citadel, Independence Monument (Lomé), Grand Mosque of Conakry. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }

  /* ---------- Edge of the World (Jebel Fihrayn) ---------- */
  M.custom.edgeworld = function () {
    var g = new T.Group(), rock = solid('#c99a6a', { flatShading: true });
    blob(g, '#d8b080', 0.74, 0.62, 0, 0, 0.006, 3);
    // a high plateau that ends in a sheer escarpment dropping to the endless plain
    var sh = new T.Shape(); sh.moveTo(-0.6, 0.5); sh.lineTo(0.6, 0.5); for (var i = 0; i <= 12; i++) { var x = 0.6 - i * 0.1; sh.lineTo(x, -0.02 - Math.sin(i * 1.3) * 0.06 - (i === 6 ? 0.14 : 0)); } sh.lineTo(-0.6, 0.5);
    var pl = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.24, bevelEnabled: false }), rock); pl.rotation.x = -Math.PI / 2; pl.position.y = 0.006; pl.scale.set(0.82, 0.82, 1); g.add(pl);
    // layered bands on the cliff face
    for (var b = 0; b < 4; b++) { var bd = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.01, bevelEnabled: false }), solid(b % 2 ? '#a87a52' : '#d8aa7a', { flatShading: true })); bd.rotation.x = -Math.PI / 2; bd.position.y = 0.04 + b * 0.05; bd.scale.set(0.825, 0.825, 1); g.add(bd); }
    // a lone pillar standing off the cliff, and tiny people at the edge
    var pil = new T.Mesh(new T.CylinderGeometry(0.03, 0.05, 0.2, 6), rock); pil.position.set(0.25, 0.106, 0.2); g.add(pil);
    for (var p = 0; p < 3; p++) cyl(g, solid(['#d04a2a', '#3f6ab0', '#f6f2ea'][p]), 0.006, 0.006, 0.02, -0.05 + p * 0.03, 0.246, -0.1, 5);
    for (var a = 0; a < 3; a++) if (K.acacia) K.acacia(g, -0.4 + a * 0.3, 0.42, 0.8);
    return g;
  };

  /* ---------- Mt. Paektu & Heaven Lake ---------- */
  M.custom.paektu = function () {
    var g = new T.Group();
    blob(g, '#4f7a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // a volcano whose crater holds a deep blue lake, ringed by jagged peaks
    mountain(g, { h: 0.34, rings: 16, r: function (t) { return t > 0.82 ? 0.28 : 0.55 * (1 - t) + 0.13; }, bump: 0.12, f: 9, jag: 0.3, colour: function (x, y) { return y > 0.27 ? '#e8e8ec' : y > 0.16 ? '#8a8078' : '#4f7a3f'; } });
    var lk = new T.Mesh(new T.CircleGeometry(0.25, 24), solid('#2a5fa8')); lk.rotation.x = -Math.PI / 2; lk.position.y = 0.3; g.add(lk);
    for (var i = 0; i < 14; i++) { var a = i / 14 * D2, pk = new T.Mesh(new T.ConeGeometry(0.04 + hash(i, 2) * 0.02, 0.07 + hash(i, 3) * 0.05, 5), solid(hash(i, 4) > 0.4 ? '#f2f2f6' : '#7a7068', { flatShading: true })); pk.position.set(Math.cos(a) * 0.29, 0.33, Math.sin(a) * 0.29); g.add(pk); }
    // forest of larch on the lower slopes
    for (var t = 0; t < 14; t++) { var a2 = t / 14 * D2; tree(g, Math.cos(a2) * 0.62, Math.sin(a2) * 0.52, 1.0, '#2f6a35'); }
    return g;
  };

  /* ---------- Star Ferry (Hong Kong) ---------- */
  M.custom.starferry = function () {
    var g = new T.Group(), glass = ['#5a7a9a', '#7a9aba', '#4a6a8a', '#8aa8c8'];
    blob(g, '#2f7fa8', 0.74, 0.62, 0, 0, 0.006, 6);
    // Victoria Harbour with the skyline of Hong Kong Island behind and the green hills above
    mountain(g, { h: 0.3, pos: [0, -0.5], rings: 10, r: function (t) { return 0.36 * (1 - t) + 0.03; }, sx: 1.7, sz: 0.3, bump: 0.25, colour: function () { return '#3f7a3f'; } });
    for (var b = 0; b < 14; b++) { var x = -0.5 + b * 0.075, h = 0.1 + hash(b, 2) * 0.22 + (b === 6 ? 0.12 : 0); var bl = box(g, mat(winTex('hk' + (b % 4), glass[b % 4], '#c9e0f0', 3, 10), 1, 1), 0.06, h, 0.06, x, 0.006, -0.32 + hash(b, 3) * 0.04);
      if (b === 6) { var sp = new T.Mesh(new T.ConeGeometry(0.03, 0.08, 4), solid('#8aa8c8')); sp.position.set(x, 0.006 + h + 0.04, -0.3); g.add(sp); } }
    box(g, solid('#8a8a88'), 1.0, 0.012, 0.04, 0, 0.006, -0.24).scale.x = 0.9;
    // the green-and-white double-deck ferry with its star
    var F = new T.Group();
    box(F, solid('#2a6a3a'), 0.24, 0.03, 0.07, 0, 0, 0); box(F, solid('#f6f2ea'), 0.2, 0.025, 0.06, 0, 0.03, 0); box(F, solid('#2a6a3a'), 0.21, 0.006, 0.065, 0, 0.055, 0);
    for (var w = 0; w < 8; w++) box(F, solid('#4a5a6a'), 0.014, 0.012, 0.062, -0.08 + w * 0.023, 0.036, 0);
    var star = new T.Mesh(new T.OctahedronGeometry(0.012, 0), solid('#f6f2ea')); star.position.set(0, 0.07, 0.033); star.scale.z = 0.2; F.add(star);
    F.position.set(0.05, 0.006, 0.18); F.rotation.y = -0.2; g.add(F);
    // a sampan and wakes
    var wk = new T.Mesh(new T.PlaneGeometry(0.24, 0.02), solid('#e8f4f8')); wk.rotation.x = -Math.PI / 2; wk.rotation.z = -0.2; wk.position.set(0.3, 0.008, 0.24); g.add(wk);
    return g;
  };

  /* ---------- Macau Tower ---------- */
  M.custom.macautower = function () {
    var g = new T.Group(), conc = solid('#e8e6e0'), glass = solid('#6a8aa8');
    blob(g, '#4a8ab0', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#c9c4b8', 0.42, 0.34, -0.1, -0.05, 0.012, 3);
    // a slim concrete shaft with three legs at the base, a pod near the top and a tall mast
    box(g, mat(winTex('mtb', '#e8e6e0', '#5a7a9a', 6, 2), 2, 1), 0.3, 0.06, 0.2, -0.1, 0.012, 0.0);
    for (var l = 0; l < 3; l++) { var a = l / 3 * D2, lg = new T.Mesh(new T.BoxGeometry(0.02, 0.1, 0.03), conc); lg.position.set(-0.1 + Math.cos(a) * 0.035, 0.12, Math.sin(a) * 0.035); lg.rotation.y = -a; g.add(lg); }
    cyl(g, conc, 0.022, 0.03, 0.46, -0.1, 0.07, 0, 12);
    var pod = lathe([[0.03, 0], [0.07, 0.02], [0.08, 0.04], [0.075, 0.07], [0.05, 0.09], [0.025, 0.1]], 20, glass); pod.position.set(-0.1, 0.48, 0); g.add(pod);
    cyl(g, conc, 0.085, 0.085, 0.006, -0.1, 0.52, 0, 20);
    cyl(g, solid('#c9c4b8'), 0.004, 0.008, 0.12, -0.1, 0.58, 0, 6);
    // a bungee jumper on a cord!
    var cord = new T.Mesh(new T.CylinderGeometry(0.0015, 0.0015, 0.2, 3), solid('#e84a4a')); cord.position.set(-0.02, 0.4, 0.0); g.add(cord);
    var j = new T.Mesh(new T.CapsuleGeometry(0.005, 0.014, 3, 5), solid('#e8c34a')); j.position.set(-0.02, 0.29, 0.0); g.add(j);
    // a bridge across the water to the islands
    var br = new T.Mesh(new T.BoxGeometry(0.6, 0.012, 0.03), solid('#d8d4cc')); br.position.set(0.25, 0.04, 0.3); br.rotation.y = 0.5; g.add(br);
    for (var p = 0; p < 4; p++) cyl(g, solid('#d8d4cc'), 0.006, 0.006, 0.035, 0.05 + p * 0.13, 0.006, 0.4 - p * 0.07, 5);
    return g;
  };

  /* ---------- Umayyad Mosque ---------- */
  M.custom.umayyad = function () {
    var g = new T.Group(), st = mat(stoneTex('umy', '#d8c8a8', '#bca888', 8, 4), 2, 1), w = solid('#e8dcc4'), lead = solid('#7a8a8a');
    blob(g, '#c9c0b0', 0.74, 0.62, 0, 0, 0.006, 3);
    // the big courtyard with arcades on three sides and the prayer hall with a dome on the fourth
    box(g, solid('#e0d8c8'), 0.62, 0.008, 0.42, 0, 0.006, 0.02);
    [[0, 0.22, 0.62, 0.03], [-0.3, 0.06, 0.03, 0.34], [0.3, 0.06, 0.03, 0.34]].forEach(function (q) { box(g, st, q[2], 0.06, q[3], q[0], 0.014, q[1]); });
    for (var a = 0; a < 10; a++) arch(g, solid('#8a7a5a'), 0.04, 0.04, -0.27 + a * 0.06, 0.014, 0.205, 0.002);
    box(g, st, 0.62, 0.1, 0.14, 0, 0.014, -0.18); ridge(g, lead, 0.63, 0.05, 0.15, 0, 0.114, -0.18, 0);
    box(g, st, 0.1, 0.13, 0.15, 0, 0.014, -0.18); cyl(g, st, 0.05, 0.05, 0.03, 0, 0.144, -0.18, 8, Math.PI / 8); domeOn(g, lead, 0.055, 0.08, 0, 0.174, -0.18, 16);
    // golden mosaic on the front of the prayer hall
    var mo = new T.Mesh(new T.PlaneGeometry(0.2, 0.06), mat(tex('umm', 64, 16, function (c, W, H) { c.fillStyle = '#c9a040'; c.fillRect(0, 0, W, H); c.fillStyle = '#3f7a4a'; for (var x = 2; x < W; x += 8) { c.beginPath(); c.arc(x + 2, 10, 3, 0, D2); c.fill(); c.fillRect(x + 1.5, 10, 1, 6); } }), 1, 1)); mo.position.set(0, 0.075, -0.109); g.add(mo);
    // three minarets of different styles
    [[-0.3, -0.24, 0.3, 4], [0.3, -0.24, 0.26, 8], [0.0, 0.24, 0.24, 4]].forEach(function (m) { cyl(g, w, 0.022, 0.026, m[2], m[0], 0.014, m[1], m[3], Math.PI / 4); cyl(g, w, 0.032, 0.032, 0.012, m[0], 0.014 + m[2] * 0.8, m[1], m[3], Math.PI / 4); var tp = new T.Mesh(new T.ConeGeometry(0.02, 0.05, m[3]), lead); tp.position.set(m[0], 0.014 + m[2] + 0.025, m[1]); g.add(tp); });
    // the little Dome of the Treasury on columns in the courtyard
    for (var c = 0; c < 8; c++) { var an = c / 8 * D2; cyl(g, w, 0.004, 0.004, 0.05, -0.15 + Math.cos(an) * 0.02, 0.014, 0.05 + Math.sin(an) * 0.02, 4); }
    box(g, solid('#3f7a4a'), 0.05, 0.03, 0.05, -0.15, 0.064, 0.05); domeOn(g, lead, 0.022, 0.03, -0.15, 0.094, 0.05, 8);
    return g;
  };

  /* ---------- Erbil Citadel ---------- */
  M.custom.erbil = function () {
    var g = new T.Group(), mud = solid('#c9a878', { flatShading: true }), wall = mat(stoneTex('erb', '#c9a878', '#a8885a', 12, 4), 4, 1);
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    // a tall oval mound ringed by house-fronts forming a continuous wall, lived in for 6,000 years
    var mound = lathe([[0.42, 0], [0.4, 0.06], [0.34, 0.14], [0.32, 0.16], [0, 0.16]], 32, mud); mound.scale.z = 0.8; mound.position.y = 0.006; g.add(mound);
    var ring = new T.Mesh(new T.CylinderGeometry(0.33, 0.335, 0.08, 32, 1, true), wall); ring.scale.z = 0.8; ring.position.y = 0.2; g.add(ring);
    for (var i = 0; i < 24; i++) { var a = i / 24 * D2; box(g, solid('#3a3020'), 0.012, 0.016, 0.004, Math.cos(a) * 0.336, 0.185, Math.sin(a) * 0.336 * 0.8).rotation.y = -a + Math.PI / 2; }
    // the great gate with a stair, and old houses packed on top
    box(g, wall, 0.08, 0.12, 0.05, 0, 0.15, 0.28);
    for (var s = 0; s < 8; s++) box(g, solid('#d8c8a8'), 0.07, 0.012, 0.02, 0, 0.006 + s * 0.018, 0.34 + (7 - s) * 0.018);
    for (var h = 0; h < 18; h++) { var x = -0.24 + (h % 6) * 0.1 + hash(h, 1) * 0.02, z = -0.18 + Math.floor(h / 6) * 0.12; if (Math.hypot(x / 0.3, z / 0.24) > 1) continue; box(g, solid(h % 3 ? '#d8c09a' : '#c9b088'), 0.07, 0.03 + hash(h, 2) * 0.03, 0.06, x, 0.166, z); }
    // the statue of a scholar and a fountain in the square below
    var stt = new T.Mesh(new T.CapsuleGeometry(0.01, 0.03, 3, 6), solid('#5a5040')); stt.position.set(0.15, 0.04, 0.45); g.add(stt);
    var ft = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.01, 12), solid('#6aa8c8')); ft.position.set(-0.15, 0.012, 0.45); g.add(ft);
    return g;
  };

  /* ---------- Independence Monument, Lomé ---------- */
  M.custom.togoind = function () {
    var g = new T.Group(), conc = solid('#e8e2d4', { flatShading: true }), bronze = solid('#6a5a4a');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    var pz = new T.Mesh(new T.CircleGeometry(0.34, 24), solid('#d8d2c4')); pz.rotation.x = -Math.PI / 2; pz.position.y = 0.008; g.add(pz);
    // a tall white slab with a carved figure breaking free, its arms raised
    box(g, solid('#c9c4b8'), 0.2, 0.03, 0.12, 0, 0.008, 0);
    box(g, conc, 0.12, 0.42, 0.04, 0, 0.038, -0.02);
    var fg = new T.Group(); var body = new T.Mesh(new T.CapsuleGeometry(0.018, 0.12, 3, 8), conc); body.position.y = 0.11; fg.add(body);
    var hd = new T.Mesh(new T.SphereGeometry(0.016, 8, 6), conc); hd.position.y = 0.2; fg.add(hd);
    [-1, 1].forEach(function (sd) { var arm = new T.Mesh(new T.CylinderGeometry(0.006, 0.007, 0.08, 5), conc); arm.position.set(sd * 0.025, 0.24, 0); arm.rotation.z = -sd * 0.35; fg.add(arm); });
    fg.position.set(0, 0.06, 0.012); g.add(fg);
    // flags of Togo
    [-0.25, 0.25].forEach(function (x) { cyl(g, solid('#dddddd'), 0.003, 0.003, 0.18, x, 0.008, 0.1, 4); for (var k = 0; k < 5; k++) box(g, solid(k % 2 ? '#ffce00' : '#006a4e'), 0.06, 0.008, 0.003, x + 0.03, 0.15 + k * 0.008, 0.1); box(g, solid('#d21034'), 0.024, 0.024, 0.0032, x + 0.012, 0.174, 0.1); });
    for (var p = 0; p < 10; p++) { var a = p / 10 * D2; palm(g, Math.cos(a) * 0.52, Math.sin(a) * 0.44, 1.1); }
    return g;
  };

  /* ---------- Grand Mosque of Conakry ---------- */
  M.custom.conakry = function () {
    var g = new T.Group(), w = mat(winTex('cnk', '#f2ece0', '#3a7a5a', 8, 2, { tall: 0.6 }), 2, 1), green = solid('#3f8a5a'), wh = solid('#f2ece0');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // a wide hall with one big green dome and a tall minaret
    box(g, w, 0.44, 0.1, 0.3, 0, 0.006, -0.04);
    box(g, wh, 0.46, 0.012, 0.32, 0, 0.106, -0.04);
    cyl(g, wh, 0.12, 0.12, 0.04, 0, 0.118, -0.04, 24);
    domeOn(g, green, 0.125, 0.12, 0, 0.158, -0.04, 24);
    var fin = new T.Mesh(new T.ConeGeometry(0.008, 0.04, 6), solid('#e8c34a')); fin.position.set(0, 0.3, -0.04); g.add(fin);
    cyl(g, wh, 0.022, 0.026, 0.4, 0.28, 0.006, -0.2, 8); cyl(g, green, 0.034, 0.034, 0.012, 0.28, 0.34, -0.2, 8); var mt = new T.Mesh(new T.ConeGeometry(0.024, 0.06, 8), green); mt.position.set(0.28, 0.436, -0.2); g.add(mt);
    for (var a = 0; a < 7; a++) arch(g, solid('#3a7a5a'), 0.04, 0.05, -0.18 + a * 0.06, 0.006, 0.111, 0.002);
    for (var t = 0; t < 10; t++) { var an = t / 10 * D2; if (Math.sin(an) < -0.6) continue; palm(g, Math.cos(an) * 0.55, Math.sin(an) * 0.46, 1.2); }
    return g;
  };
})();
