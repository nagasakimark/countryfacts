/* Detailed landmarks, batch 27: Blue Mosque (Mazar-i-Sharif), National Parliament House (Dhaka), Museum of Islamic Art (Doha),
   Dar al-Hajar, Door of No Return (Ouidah), Aloba Arch, Lake Abbe, Volcanoes National Park. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 1.04, h * 0.25], [r * 0.95, h * 0.55], [r * 0.55, h * 0.85], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }

  /* ---------- Blue Mosque, Mazar-i-Sharif ---------- */
  M.custom.bluemosque = function () {
    var g = new T.Group(), tile = mat(tex('bmz', 64, 64, function (c, W, H) { c.fillStyle = '#2a7ac0'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 8) for (var x = 0; x < W; x += 8) { c.fillStyle = (x + y) % 16 ? '#3fa0d8' : '#f2e8c8'; c.beginPath(); c.arc(x + 4, y + 4, 2.4, 0, D2); c.fill(); c.fillStyle = '#e8c34a'; c.fillRect(x + 3.5, y, 1, 1); } }), 2, 1);
    var tileD = solid('#3fa0d8', { flatShading: false }), white = solid('#f6f2ea');
    blob(g, '#d8d0c0', 0.74, 0.62, 0, 0, 0.006, 3);
    // white doves on the white courtyard
    for (var d = 0; d < 14; d++) { var dv = new T.Mesh(new T.SphereGeometry(0.008, 5, 4), white); dv.scale.set(1, 0.6, 1.4); dv.position.set(-0.3 + hash(d, 1) * 0.6, 0.012, 0.25 + hash(d, 2) * 0.2); g.add(dv); }
    // the shrine: a tiled block with a big pointed iwan gate, two ribbed domes, minarets
    box(g, tile, 0.4, 0.13, 0.24, 0, 0.006, -0.1);
    box(g, tile, 0.16, 0.2, 0.04, 0, 0.006, 0.04);
    var iw = new T.Shape(); iw.moveTo(-0.045, 0); iw.lineTo(-0.045, 0.1); iw.quadraticCurveTo(-0.045, 0.15, 0, 0.17); iw.quadraticCurveTo(0.045, 0.15, 0.045, 0.1); iw.lineTo(0.045, 0); iw.lineTo(-0.045, 0);
    var iwm = new T.Mesh(new T.ShapeGeometry(iw), solid('#1a3a6a')); iwm.position.set(0, 0.006, 0.061); g.add(iwm);
    [[-0.09, -0.1, 0.075], [0.09, -0.1, 0.075]].forEach(function (q) { cyl(g, tile, q[2] * 0.85, q[2] * 0.85, 0.05, q[0], 0.136, q[1], 20); var dm = domeOn(g, tileD, q[2], 0.13, q[0], 0.186, q[1], 20); var tp = new T.Mesh(new T.ConeGeometry(0.006, 0.04, 6), solid('#e8c34a')); tp.position.set(q[0], 0.33, q[1]); g.add(tp); });
    [[-0.22, 0.02], [0.22, 0.02], [-0.22, -0.22], [0.22, -0.22]].forEach(function (q) { cyl(g, tile, 0.018, 0.022, 0.26, q[0], 0.006, q[1], 10); cyl(g, white, 0.026, 0.026, 0.01, q[0], 0.23, q[1], 10); domeOn(g, tileD, 0.02, 0.03, q[0], 0.266, q[1], 10); });
    for (var t = 0; t < 6; t++) tree(g, -0.5 + t * 0.2, 0.48, 0.9, '#4f8a3f');
    return g;
  };

  /* ---------- National Parliament House, Dhaka ---------- */
  M.custom.jatiya = function () {
    var g = new T.Group(), conc = mat(tex('jsb', 32, 32, function (c, W, H) { c.fillStyle = '#b8b0a4'; c.fillRect(0, 0, W, H); c.fillStyle = '#e8e2d8'; for (var y = 0; y < H; y += 8) c.fillRect(0, y, W, 1); }), 2, 2), dark = solid('#2a2622');
    blob(g, '#5fa04a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a lake wrapping around the building
    var lk = new T.Mesh(new T.RingGeometry(0.28, 0.42, 32, 1, Math.PI * 0.15, Math.PI * 1.7), solid('#4f8ab0')); lk.rotation.x = -Math.PI / 2; lk.rotation.z = -Math.PI * 0.35; lk.position.y = 0.009; g.add(lk);
    // a cluster of massive concrete blocks around an octagon, cut with giant circles, triangles and slots
    cyl(g, conc, 0.14, 0.14, 0.26, 0, 0.006, 0, 8, Math.PI / 8);
    for (var i = 0; i < 8; i++) { var a = i / 8 * D2, x = Math.cos(a) * 0.18, z = Math.sin(a) * 0.18, b = new T.Group();
      box(b, conc, 0.1, i % 2 ? 0.2 : 0.23, 0.08, 0, 0, 0);
      if (i % 2) { var c = new T.Mesh(new T.CircleGeometry(0.03, 20), dark); c.position.set(0, 0.11, 0.041); b.add(c); }
      else { var tr = new T.Mesh(new T.CircleGeometry(0.035, 3), dark); tr.rotation.z = Math.PI / 2; tr.position.set(0, 0.12, 0.041); b.add(tr); }
      b.position.set(x, 0.006, z); b.rotation.y = -a + Math.PI / 2; g.add(b); }
    box(g, solid('#c9c0b2'), 0.3, 0.004, 0.3, 0, 0.264, 0);
    // flat lawns and a few trees
    for (var t = 0; t < 8; t++) { var a2 = t / 8 * D2 + 0.2; tree(g, Math.cos(a2) * 0.58, Math.sin(a2) * 0.48, 1.0, '#3f8a3f'); }
    return g;
  };

  /* ---------- Museum of Islamic Art, Doha ---------- */
  M.custom.mia = function () {
    var g = new T.Group(), lime = solid('#efe6d4', { flatShading: true }), limeS = solid('#ddd2bc', { flatShading: true });
    blob(g, '#4aa8c8', 0.74, 0.62, 0, 0, 0.006, 5);
    // a little island of its own, joined by a palm-lined path
    blob(g, '#e8dcc0', 0.36, 0.3, 0, -0.08, 0.012, 2);
    box(g, solid('#d8ccb0'), 0.06, 0.008, 0.3, 0, 0.006, 0.36);
    for (var p = 0; p < 4; p++) { palm(g, -0.06, 0.25 + p * 0.07, 0.9); palm(g, 0.06, 0.25 + p * 0.07, 0.9); }
    // stacked, stepped cubes that turn and shrink toward a tall block with a small window "face"
    var Y = 0.012, Z = -0.1;
    box(g, lime, 0.4, 0.06, 0.32, 0, Y, Z);
    var s1 = box(g, limeS, 0.26, 0.06, 0.26, 0, Y + 0.06, Z); s1.rotation.y = Math.PI / 4;
    box(g, lime, 0.2, 0.05, 0.2, 0, Y + 0.12, Z);
    var s2 = box(g, limeS, 0.14, 0.05, 0.14, 0, Y + 0.17, Z); s2.rotation.y = Math.PI / 4;
    box(g, lime, 0.1, 0.1, 0.1, 0, Y + 0.22, Z);
    box(g, solid('#2a2a2a'), 0.06, 0.012, 0.002, 0, Y + 0.28, Z + 0.051);
    box(g, solid('#3a5a7a'), 0.12, 0.12, 0.002, 0, Y, Z + 0.161);
    // a dhow in the bay
    var b = new T.Group(); box(b, solid('#8a5a32'), 0.025, 0.014, 0.09, 0, 0, 0); var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(0, 0.09); sh.lineTo(0.07, 0); var s = new T.Mesh(new T.ShapeGeometry(sh), solid('#f6f2ea', { side: T.DoubleSide })); s.rotation.y = Math.PI / 2; s.position.set(0, 0.014, 0.035); b.add(s); b.position.set(0.45, 0.008, 0.2); g.add(b);
    return g;
  };

  /* ---------- Dar al-Hajar ---------- */
  M.custom.daralhajar = function () {
    var g = new T.Group(), mud = mat(winTex('dah', '#c9a07a', '#f6f2ea', 4, 6, { tall: 0.5 }), 1, 1), white = solid('#f6f2ea');
    blob(g, '#9aa868', 0.74, 0.62, 0, 0, 0.006, 3);
    // a tall rock pillar in the valley with a palace built right on top
    var rk = new T.Mesh(new T.CylinderGeometry(0.12, 0.17, 0.2, 8, 3), solid('#b89a7a', { flatShading: true })); var p = rk.geometry.attributes.position; for (var i = 0; i < p.count; i++) { p.setX(i, p.getX(i) * (1 + noise(i, 3) * 0.2)); p.setZ(i, p.getZ(i) * (1 + noise(i, 7) * 0.2)); } rk.geometry.computeVertexNormals(); rk.position.y = 0.106; g.add(rk);
    var Y = 0.2;
    box(g, mud, 0.16, 0.12, 0.13, -0.01, Y, 0.0); box(g, mud, 0.1, 0.17, 0.08, 0.04, Y, -0.02); box(g, mud, 0.08, 0.08, 0.08, -0.06, Y + 0.12, 0.01);
    box(g, white, 0.165, 0.006, 0.135, -0.01, Y + 0.12, 0.0); box(g, white, 0.105, 0.006, 0.085, 0.04, Y + 0.17, -0.02); box(g, white, 0.085, 0.006, 0.085, -0.06, Y + 0.2, 0.01);
    // white parapets and round stained-glass windows (qamariya)
    for (var q = 0; q < 3; q++) { var w = new T.Mesh(new T.CircleGeometry(0.01, 10, 0, Math.PI), solid('#e8c34a', { emissive: '#3a2a00' })); w.position.set(-0.04 + q * 0.04, Y + 0.105, 0.066); g.add(w); }
    // terraced fields and qat trees in the valley
    for (var f = 0; f < 4; f++) { var tf = new T.Mesh(new T.RingGeometry(0.3 + f * 0.08, 0.36 + f * 0.08, 24, 1, Math.PI * 1.1, Math.PI * 0.8), solid(f % 2 ? '#7a9a4a' : '#8aaa5a')); tf.rotation.x = -Math.PI / 2; tf.position.y = 0.01 + f * 0.003; g.add(tf); }
    for (var t = 0; t < 8; t++) { var c = new T.Mesh(new T.IcosahedronGeometry(0.03, 0), solid('#4f8a3f', { flatShading: true })); c.position.set(-0.4 + t * 0.1, 0.03, 0.3 + hash(t, 4) * 0.1); g.add(c); }
    mountain(g, { h: 0.2, pos: [0.0, -0.42], r: function (t) { return 0.26 * (1 - t) + 0.02; }, sx: 1.3, sz: 0.4, bump: 0.3, colour: function () { return '#a8906a'; } });
    return g;
  };

  /* ---------- Door of No Return, Ouidah ---------- */
  M.custom.doornoreturn = function () {
    var g = new T.Group(), conc = solid('#c9b8a0'), bronze = solid('#5a4a3a', { flatShading: true });
    blob(g, '#e8dcb8', 0.74, 0.62, 0, 0, 0.006, 3);
    var sea = new T.Mesh(new T.PlaneGeometry(0.66, 0.16), solid('#3f9ac0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, -0.46); g.add(sea);
    for (var w = 0; w < 3; w++) { var wv = new T.Mesh(new T.PlaneGeometry(0.6 - w * 0.08, 0.008), solid('#ffffff')); wv.rotation.x = -Math.PI / 2; wv.position.set(0, 0.009, -0.38 - w * 0.04); g.add(wv); }
    // the memorial arch facing the ocean, with lines of bronze figures in relief
    var Y = 0.006;
    box(g, conc, 0.08, 0.22, 0.06, -0.12, Y, -0.1); box(g, conc, 0.08, 0.22, 0.06, 0.12, Y, -0.1); box(g, conc, 0.34, 0.06, 0.06, 0, Y + 0.22, -0.1);
    for (var i = 0; i < 8; i++) { var f = new T.Mesh(new T.CapsuleGeometry(0.006, 0.02, 3, 5), bronze); f.position.set(-0.15 + (i % 2) * 0.06, Y + 0.05 + Math.floor(i / 2) * 0.04, -0.068); g.add(f); var f2 = f.clone(); f2.position.x = 0.09 + (i % 2) * 0.06; g.add(f2); }
    for (var k = 0; k < 7; k++) { var f3 = new T.Mesh(new T.CapsuleGeometry(0.006, 0.018, 3, 5), bronze); f3.position.set(-0.13 + k * 0.045, Y + 0.25, -0.068); g.add(f3); }
    // the long sandy road leading to it, with statues along the way
    var road = new T.Mesh(new T.PlaneGeometry(0.08, 0.5), solid('#c9a878')); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.009, 0.18); g.add(road);
    for (var s = 0; s < 4; s++) [-1, 1].forEach(function (sd) { cyl(g, solid('#d8c8a8'), 0.012, 0.014, 0.012, sd * 0.08, 0.006, 0.05 + s * 0.1, 6); var st = new T.Mesh(new T.CapsuleGeometry(0.008, 0.03, 3, 6), solid(['#b8603a', '#3f6a8a', '#d8b04a', '#6a8a3a'][s])); st.position.set(sd * 0.08, 0.04, 0.05 + s * 0.1); g.add(st); });
    for (var p = 0; p < 6; p++) palm(g, -0.5 + p * 0.2, 0.42 - (p % 2) * 0.1, 1.2);
    return g;
  };

  /* ---------- Aloba Arch ---------- */
  M.custom.aloba = function () {
    var g = new T.Group(), sand = solid('#a8604a', { flatShading: true }), sandL = solid('#c97a5a', { flatShading: true });
    blob(g, '#e0a878', 0.74, 0.62, 0, 0, 0.006, 3);
    // the Ennedi cliffs, with a giant natural arch towering over the desert
    mountain(g, { h: 0.18, pos: [-0.25, -0.15], r: function (t) { return t > 0.85 ? 0.2 : 0.3 - t * 0.12; }, sx: 1.2, bump: 0.2, jag: 0.25, colour: function (x, y) { return noise(x * 10, y * 25) > 0.5 ? '#a8604a' : '#b8704f'; } });
    var path = new T.CurvePath(); var pts = []; for (var i = 0; i <= 24; i++) { var t = i / 24, a = Math.PI * t; pts.push(new T.Vector3(Math.cos(a) * 0.2 + 0.18, Math.sin(a) * 0.36, 0)); }
    var ar = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, 0.035, 6), sandL); ar.position.set(0, 0.006, 0.05); g.add(ar);
    var base = new T.Mesh(new T.CylinderGeometry(0.06, 0.09, 0.08, 7), sand); base.position.set(0.38, 0.04, 0.05); g.add(base);
    var base2 = new T.Mesh(new T.CylinderGeometry(0.06, 0.09, 0.08, 7), sand); base2.position.set(-0.02, 0.04, 0.05); g.add(base2);
    // camels and a few dunes
    for (var c = 0; c < 2; c++) { var cm = new T.Group(), cb = solid('#c9a070'); box(cm, cb, 0.02, 0.02, 0.06, 0, 0.04, 0); var hump = new T.Mesh(new T.SphereGeometry(0.016, 6, 4), cb); hump.position.y = 0.062; cm.add(hump); [[0.007, 0.022], [-0.007, 0.022], [0.007, -0.022], [-0.007, -0.022]].forEach(function (q) { box(cm, cb, 0.005, 0.04, 0.005, q[0], 0, q[1]); }); box(cm, cb, 0.01, 0.035, 0.01, 0, 0.05, 0.035); cm.position.set(0.1 + c * 0.1, 0.006, 0.35); cm.rotation.y = 1.2; g.add(cm); }
    for (var d = 0; d < 3; d++) { var dn = new T.Mesh(new T.SphereGeometry(0.12, 10, 6, 0, D2, 0, Math.PI / 2), solid('#e8b888')); dn.scale.set(1.4, 0.3, 0.7); dn.position.set(-0.4 + d * 0.35, 0.006, 0.42 - d * 0.03); g.add(dn); }
    return g;
  };

  /* ---------- Lake Abbe ---------- */
  M.custom.lakeabbe = function () {
    var g = new T.Group(), lime = solid('#d8ccb0', { flatShading: true });
    blob(g, '#c9b890', 0.74, 0.62, 0, 0, 0.006, 3);
    var lk = new T.Mesh(new T.CircleGeometry(0.3, 20), solid('#8ab8b0')); lk.rotation.x = -Math.PI / 2; lk.scale.y = 0.55; lk.position.set(0.1, 0.009, -0.35); g.add(lk);
    // a forest of limestone chimneys, some puffing steam
    for (var i = 0; i < 14; i++) { var x = -0.45 + hash(i, 1) * 0.8, z = -0.15 + hash(i, 2) * 0.55, h = 0.1 + hash(i, 3) * 0.18, ch = new T.Mesh(new T.CylinderGeometry(0.015, 0.05 + hash(i, 4) * 0.02, h, 7, 4), lime); var p = ch.geometry.attributes.position; for (var k = 0; k < p.count; k++) p.setX(k, p.getX(k) * (1 + Math.sin(p.getY(k) * 50 + i) * 0.15)); ch.geometry.computeVertexNormals(); ch.position.set(x, h / 2 + 0.006, z); g.add(ch);
      if (i % 4 === 0) for (var s = 0; s < 4; s++) { var st = new T.Mesh(new T.IcosahedronGeometry(0.018 + s * 0.012, 1), solid('#f6f6f6', { transparent: true, opacity: 0.5 - s * 0.08 })); st.position.set(x + s * 0.015, h + 0.01 + s * 0.035, z); g.add(st); } }
    // flamingos on the lake
    for (var f = 0; f < 6; f++) { var b = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), solid('#f0a0a8')); b.scale.set(1, 0.8, 1.4); b.position.set(-0.05 + f * 0.05, 0.035, -0.4 + hash(f, 7) * 0.06); g.add(b); var lg = new T.Mesh(new T.CylinderGeometry(0.0015, 0.0015, 0.025, 3), solid('#e88890')); lg.position.set(b.position.x, 0.02, b.position.z); g.add(lg); }
    return g;
  };

  /* ---------- Volcanoes National Park (Rwanda) ---------- */
  M.custom.rwandavolc = function () {
    var g = new T.Group();
    blob(g, '#4f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // a row of misty volcano cones
    [[-0.32, -0.25, 0.32, 0.26], [0.05, -0.32, 0.42, 0.3], [0.38, -0.2, 0.28, 0.22]].forEach(function (v, k) { var vg = new T.Group(); mountain(vg, { h: v[2], rings: 12, r: function (t) { return v[3] * (1 - t * 0.85) + 0.02; }, bump: 0.12, seed: k + 3, colour: function (x, y) { return y > v[2] * 0.75 ? '#5a6a50' : '#3f7a3a'; } }); vg.position.set(v[0], 0, v[1]); g.add(vg);
      var mist = new T.Mesh(new T.SphereGeometry(0.1, 8, 5), solid('#f2f4f6', { transparent: true, opacity: 0.6 })); mist.scale.set(1.6, 0.3, 1); mist.position.set(v[0], v[2] * 0.8, v[1]); g.add(mist); });
    // bamboo forest and a mountain gorilla family
    for (var b = 0; b < 16; b++) { var x = -0.5 + (b % 8) * 0.13, z = 0.15 + Math.floor(b / 8) * 0.25 + hash(b, 2) * 0.05; cyl(g, solid('#7aa84a'), 0.004, 0.004, 0.14, x, 0.006, z, 4); var lf = new T.Mesh(new T.IcosahedronGeometry(0.025, 0), solid('#6a9a3f', { flatShading: true })); lf.position.set(x, 0.15, z); g.add(lf); }
    function gorilla(x, z, s) { var gg = new T.Group(), fur = solid('#2a2624'); var bd = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), fur); bd.scale.set(1, 1.1, 0.9); bd.position.y = 0.035; gg.add(bd); var hd = new T.Mesh(new T.SphereGeometry(0.016, 8, 6), fur); hd.position.set(0, 0.07, 0.02); gg.add(hd); [-1, 1].forEach(function (sd) { var a = new T.Mesh(new T.CylinderGeometry(0.008, 0.01, 0.05, 5), fur); a.position.set(sd * 0.028, 0.025, 0.012); gg.add(a); }); if (s > 1.1) { var bk = new T.Mesh(new T.SphereGeometry(0.02, 6, 4), solid('#8a8a88')); bk.scale.set(1.1, 0.5, 1); bk.position.set(0, 0.06, -0.015); gg.add(bk); } gg.scale.setScalar(s); gg.position.set(x, 0.006, z); gg.rotation.y = hash(x * 10, 1) * 2; g.add(gg); }
    gorilla(0.02, 0.28, 1.5); gorilla(0.12, 0.3, 1.0); gorilla(-0.06, 0.34, 0.7);
    return g;
  };
})();
