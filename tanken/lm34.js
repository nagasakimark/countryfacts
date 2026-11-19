/* Detailed landmarks, batch 34: Gateway of India, Charminar, Prambanan, Kelimutu, Naqsh-e Jahan Square,
   Temple of Hatshepsut, Pompeii, Tulum. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 1.04, h * 0.25], [r * 0.95, h * 0.55], [r * 0.55, h * 0.85], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }
  function pointedArch(g, m, w, h, x, y, z, ry) { var s = new T.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h * 0.6); s.quadraticCurveTo(-w / 2, h * 0.9, 0, h); s.quadraticCurveTo(w / 2, h * 0.9, w / 2, h * 0.6); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0); var a = new T.Mesh(new T.ShapeGeometry(s), m); a.position.set(x, y, z); a.rotation.y = ry || 0; g.add(a); return a; }

  /* ---------- Gateway of India ---------- */
  M.custom.gatewayindia = function () {
    var g = new T.Group(), basalt = mat(stoneTex('goi', '#d8b888', '#c0a070', 8, 8), 1, 1), dark = solid('#3a2a1a');
    blob(g, '#2f7fa0', 0.74, 0.62, 0, 0, 0.006, 5);
    blob(g, '#c9c4b8', 0.6, 0.3, 0, -0.22, 0.012, 3);
    // a big triumphal arch in Indo-Saracenic style: a central arch with four corner turrets
    var Y = 0.012, Z = -0.05;
    box(g, basalt, 0.32, 0.26, 0.12, 0, Y, Z);
    pointedArch(g, dark, 0.12, 0.2, 0, Y, Z + 0.0605);
    for (var i = 0; i < 2; i++) [-1, 1].forEach(function (sd) { pointedArch(g, dark, 0.035, 0.06, sd * 0.11, Y + 0.04 + i * 0.1, Z + 0.0605); });
    box(g, basalt, 0.34, 0.03, 0.13, 0, Y + 0.26, Z);
    [[-0.15, -0.05], [0.15, -0.05], [-0.15, 0.05], [0.15, 0.05]].forEach(function (q) { cyl(g, basalt, 0.025, 0.025, 0.08, q[0], Y + 0.29, Z + q[1], 8); domeOn(g, basalt, 0.026, 0.035, q[0], Y + 0.37, Z + q[1], 8); });
    for (var j = 0; j < 7; j++) box(g, basalt, 0.02, 0.025, 0.02, -0.09 + j * 0.03, Y + 0.29, Z + 0.055);
    // the waterfront promenade and harbour boats
    for (var b = 0; b < 4; b++) { var bt = new T.Group(); box(bt, solid(['#f6f6f6', '#e8c34a', '#3f6ab0', '#d04a2a'][b]), 0.04, 0.016, 0.1, 0, 0, 0); box(bt, solid('#f6f6f6'), 0.03, 0.02, 0.04, 0, 0.016, -0.01); bt.position.set(-0.3 + b * 0.2, 0.008, 0.28 + (b % 2) * 0.08); bt.rotation.y = 0.3; g.add(bt); }
    // the Taj hotel behind, with its red domes
    box(g, mat(winTex('tjh', '#f2e8d4', '#5a4a3a', 8, 5), 2, 1), 0.36, 0.18, 0.08, 0.1, 0.012, -0.32);
    var rd = new T.Mesh(new T.SphereGeometry(0.05, 12, 8, 0, D2, 0, Math.PI / 2), solid('#c9402a')); rd.position.set(0.1, 0.192, -0.32); g.add(rd);
    return g;
  };

  /* ---------- Charminar ---------- */
  M.custom.charminar = function () {
    var g = new T.Group(), lime = mat(stoneTex('chm', '#e8dcc0', '#d0c4a6', 6, 8), 1, 1), dark = solid('#4a3a2a');
    blob(g, '#d8d0c0', 0.74, 0.62, 0, 0, 0.006, 3);
    // a square monument with four grand arches and four tall minarets on its corners
    var Y = 0.006;
    box(g, lime, 0.26, 0.2, 0.26, 0, Y, 0);
    [0, 1, 2, 3].forEach(function (s) { var a = s * Math.PI / 2; pointedArch(g, dark, 0.12, 0.17, Math.sin(a) * 0.1305, Y, Math.cos(a) * 0.1305, a); });
    box(g, lime, 0.27, 0.025, 0.27, 0, Y + 0.2, 0);
    for (var c = 0; c < 4; c++) for (var k = 0; k < 6; k++) { var a2 = c * Math.PI / 2, ox = Math.sin(a2) * 0.135, oz = Math.cos(a2) * 0.135, tx = Math.cos(a2), tz = -Math.sin(a2); box(g, solid('#d0c4a6'), 0.018, 0.014, 0.018, ox + tx * (-0.1 + k * 0.04), Y + 0.225, oz + tz * (-0.1 + k * 0.04)); }
    box(g, lime, 0.15, 0.06, 0.15, 0, Y + 0.225, 0); var md = new T.Mesh(new T.SphereGeometry(0.035, 10, 6, 0, D2, 0, Math.PI / 2), lime); md.position.y = Y + 0.285; g.add(md);
    [[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(function (q) { cyl(g, lime, 0.024, 0.028, 0.44, q[0], Y, q[1], 10); for (var b = 0; b < 3; b++) cyl(g, solid('#f2e8d4'), 0.034, 0.034, 0.012, q[0], Y + 0.22 + b * 0.08, q[1], 10); domeOn(g, lime, 0.026, 0.04, q[0], Y + 0.44, q[1], 10); var fn = new T.Mesh(new T.ConeGeometry(0.005, 0.03, 5), solid('#e8c34a')); fn.position.set(q[0], Y + 0.495, q[1]); g.add(fn); });
    // the bustling bazaar around it: bangle stalls and rickshaws
    for (var s2 = 0; s2 < 10; s2++) { var a3 = s2 / 10 * D2, x = Math.cos(a3) * 0.45, z = Math.sin(a3) * 0.38; box(g, solid(['#e84a8a', '#e8c34a', '#4ab0e8', '#4ae88a'][s2 % 4]), 0.06, 0.006, 0.05, x, 0.05, z); box(g, solid('#c9b890'), 0.05, 0.045, 0.04, x, 0.006, z); }
    for (var r = 0; r < 3; r++) { var rk = new T.Group(); box(rk, solid('#e8c34a'), 0.02, 0.025, 0.035, 0, 0.008, 0); box(rk, solid('#1a1a1a'), 0.022, 0.006, 0.037, 0, 0.033, 0); rk.position.set(-0.25 + r * 0.25, 0.006, 0.25); rk.rotation.y = r; g.add(rk); }
    return g;
  };

  /* ---------- Prambanan ---------- */
  M.custom.prambanan = function () {
    var g = new T.Group(), st = mat(stoneTex('prb', '#8a8478', '#6a6458', 6, 10), 1, 2);
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // tall, pointed Hindu temples of grey stone, many tiers each topped with little bells
    function candi(x, z, h, s) { var w = 0.12 * s; box(g, st, w * 1.4, 0.03 * s, w * 1.4, x, 0.006, z); box(g, st, w, h * 0.35, w, x, 0.006 + 0.03 * s, z); var y = 0.006 + 0.03 * s + h * 0.35;
      for (var t = 0; t < 5; t++) { var tw = w * (1 - t * 0.17); box(g, st, tw, h * 0.1, tw, x, y, z); for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2 + Math.PI / 4, bl = new T.Mesh(new T.ConeGeometry(0.008 * s, 0.025 * s, 6), st); bl.position.set(x + Math.cos(a) * tw * 0.6, y + h * 0.1 + 0.012 * s, z + Math.sin(a) * tw * 0.6); g.add(bl); } y += h * 0.1; }
      var top = new T.Mesh(new T.ConeGeometry(w * 0.2, h * 0.15, 8), st); top.position.set(x, y + h * 0.075, z); g.add(top); }
    candi(0, -0.05, 0.5, 1.3);
    candi(-0.22, -0.12, 0.32, 0.85); candi(0.22, -0.12, 0.32, 0.85);
    candi(-0.22, 0.17, 0.26, 0.75); candi(0, 0.2, 0.28, 0.8); candi(0.22, 0.17, 0.26, 0.75);
    // fallen stones and small shrines around the edge
    for (var r = 0; r < 12; r++) { var a2 = r / 12 * D2; box(g, st, 0.04, 0.03 + hash(r, 1) * 0.03, 0.04, Math.cos(a2) * 0.44, 0.006, Math.sin(a2) * 0.38); }
    for (var t2 = 0; t2 < 5; t2++) palm(g, -0.5 + t2 * 0.25, 0.48, 1.1);
    return g;
  };

  /* ---------- Kelimutu ---------- */
  M.custom.kelimutu = function () {
    var g = new T.Group();
    blob(g, '#5f8a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // a volcanic summit with three crater lakes of different colours that change over time
    mountain(g, { h: 0.24, rings: 14, r: function (t) { return t > 0.8 ? 0.36 : 0.5 * (1 - t) + 0.2; }, bump: 0.12, f: 7, colour: function (x, y) { return y > 0.2 ? '#9a8a78' : '#5f8a45'; } });
    [[-0.16, -0.08, 0.11, '#2fb8a8'], [0.08, -0.15, 0.1, '#1f6a5a'], [0.14, 0.1, 0.09, '#3a2a28']].forEach(function (l) {
      var rim = new T.Mesh(new T.CylinderGeometry(l[2] + 0.02, l[2] + 0.04, 0.04, 20, 1, true), solid('#b8a890', { side: T.DoubleSide, flatShading: true })); rim.position.set(l[0], 0.255, l[1]); g.add(rim);
      var lk = new T.Mesh(new T.CircleGeometry(l[2], 20), solid(l[3])); lk.rotation.x = -Math.PI / 2; lk.position.set(l[0], 0.247, l[1]); g.add(lk); });
    // a viewing platform with steps and visitors at sunrise
    box(g, solid('#c9c4b8'), 0.08, 0.04, 0.06, -0.05, 0.24, 0.2);
    for (var p = 0; p < 3; p++) cyl(g, solid(['#d04a2a', '#3f6ab0', '#e8c34a'][p]), 0.006, 0.006, 0.02, -0.07 + p * 0.02, 0.28, 0.2, 5);
    for (var t = 0; t < 12; t++) { var a = t / 12 * D2; tree(g, Math.cos(a) * 0.62, Math.sin(a) * 0.52, 1.0, '#2f6a35'); }
    return g;
  };

  /* ---------- Naqsh-e Jahan Square, Isfahan ---------- */
  M.custom.naqshejahan = function () {
    var g = new T.Group(), tile = mat(tex('nqj', 64, 64, function (c, W, H) { c.fillStyle = '#2a7ab0'; c.fillRect(0, 0, W, H); for (var y = 0; y < H; y += 8) for (var x = 0; x < W; x += 8) { c.fillStyle = (x + y) % 16 ? '#e8c34a' : '#f2e8c8'; c.beginPath(); c.arc(x + 4, y + 4, 2, 0, D2); c.fill(); c.fillStyle = '#3fa0c8'; c.fillRect(x, y + 3.5, 8, 1); } }), 2, 1), brick = mat(stoneTex('nqb', '#d8b888', '#c0a070', 10, 3), 4, 1), cream = solid('#e8d8b8');
    blob(g, '#c9c0b0', 0.74, 0.62, 0, 0, 0.006, 3);
    // a vast rectangular square with a long pool, ringed by two-storey arcades
    var sq = new T.Mesh(new T.PlaneGeometry(0.4, 0.8), solid('#7aa860')); sq.rotation.x = -Math.PI / 2; sq.position.set(0, 0.008, 0); sq.scale.y = 0.78; g.add(sq);
    var pool = new T.Mesh(new T.PlaneGeometry(0.08, 0.36), solid('#4a9ac8')); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.009, 0.02); g.add(pool);
    [[-0.22, 0, 0.03, 0.66], [0.22, 0, 0.03, 0.66]].forEach(function (q) { box(g, brick, q[2], 0.06, q[3], q[0], 0.006, q[1]); for (var a = 0; a < 10; a++) pointedArch(g, solid('#5a4a3a'), 0.03, 0.04, q[0] + (q[0] > 0 ? -0.0155 : 0.0155), 0.01, -0.28 + a * 0.062, q[0] > 0 ? -Math.PI / 2 : Math.PI / 2); });
    // the Shah Mosque at the south end: a tall tiled portal, a big blue dome and two minarets
    var Y = 0.006, Z = -0.36;
    box(g, tile, 0.16, 0.2, 0.04, 0, Y, Z + 0.06); pointedArch(g, solid('#1a3a6a'), 0.08, 0.15, 0, Y, Z + 0.081);
    [-0.06, 0.06].forEach(function (x) { cyl(g, tile, 0.012, 0.014, 0.3, x, Y, Z + 0.06, 8); domeOn(g, tile, 0.016, 0.025, x, Y + 0.3, Z + 0.06, 8); });
    cyl(g, tile, 0.08, 0.08, 0.06, 0, Y + 0.12, Z - 0.04, 20);
    var dm = lathe([[0.085, 0], [0.09, 0.03], [0.085, 0.08], [0.06, 0.13], [0.025, 0.16], [0, 0.18]], 20, solid('#3fa0c8')); dm.position.set(0, Y + 0.18, Z - 0.04); g.add(dm);
    // the Sheikh Lotfollah Mosque on the east side with its cream dome, and Ali Qapu palace on the west
    cyl(g, cream, 0.05, 0.05, 0.04, 0.3, Y, 0.0, 16); var cd = lathe([[0.055, 0], [0.058, 0.02], [0.05, 0.05], [0.03, 0.08], [0, 0.09]], 16, solid('#e8d0a0')); cd.position.set(0.3, Y + 0.04, 0.0); g.add(cd);
    box(g, brick, 0.08, 0.14, 0.1, -0.3, Y, 0.02); box(g, solid('#8a6a4a'), 0.085, 0.006, 0.105, -0.3, Y + 0.12, 0.02); for (var c = 0; c < 4; c++) cyl(g, solid('#8a6a4a'), 0.004, 0.004, 0.04, -0.27, Y + 0.08, -0.01 + c * 0.02, 4);
    // horse carriages in the square
    for (var h = 0; h < 2; h++) { var cr = new T.Group(); box(cr, solid('#5a3a28'), 0.01, 0.015, 0.03, 0, 0.008, 0.025); box(cr, solid('#e8e2d4'), 0.025, 0.02, 0.03, 0, 0.008, -0.01); cr.position.set(-0.08 + h * 0.16, 0.008, 0.2 - h * 0.25); g.add(cr); }
    return g;
  };

  /* ---------- Mortuary Temple of Hatshepsut ---------- */
  M.custom.hatshepsut = function () {
    var g = new T.Group(), lime = solid('#e8d4b0'), cliff = solid('#c9985a', { flatShading: true });
    blob(g, '#e0c090', 0.74, 0.62, 0, 0, 0.006, 3);
    // the towering cliffs of Deir el-Bahari behind
    var sh = new T.Shape(); sh.moveTo(-0.62, 0.5); for (var i = 0; i <= 12; i++) { var x = -0.62 + i * 0.103; sh.lineTo(x, 0.02 + Math.abs(i - 6) * 0.03 + hash(i, 1) * 0.04); } sh.lineTo(0.62, 0.5); sh.lineTo(-0.62, 0.5);
    var cl = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.28, bevelEnabled: false }), cliff); cl.rotation.x = -Math.PI / 2; cl.position.set(0, 0.006, -0.08); cl.scale.set(0.85, 0.85, 1); g.add(cl);
    for (var gr = 0; gr < 14; gr++) { var gx = -0.5 + gr * 0.077, gz = -0.08 - (0.02 + Math.abs(Math.round(gx / 0.0876)) * 0.03) * 0.85 - 0.004, rib = new T.Mesh(new T.BoxGeometry(0.03, 0.26, 0.01), solid(gr % 2 ? '#b8884a' : '#d8a86a', { flatShading: true })); rib.position.set(gx, 0.136, gz); g.add(rib); }
    // three wide terraces, each fronted by a long colonnade, with a central ramp
    for (var t = 0; t < 3; t++) { var z = 0.22 - t * 0.12, y = 0.006 + t * 0.06, w = 0.62 - t * 0.12; box(g, lime, w, 0.06, 0.12, 0, y, z); for (var c = 0; c < 14 - t * 3; c++) { var cx = -w / 2 + 0.02 + c * (w - 0.04) / (13 - t * 3); if (Math.abs(cx) < 0.04) continue; box(g, solid('#f2e2c4'), 0.014, 0.05, 0.014, cx, y + 0.002, z + 0.062); } box(g, solid('#d8c49e'), w, 0.008, 0.02, 0, y + 0.06, z + 0.06); }
    for (var r = 0; r < 2; r++) { var rp = new T.Mesh(new T.BoxGeometry(0.06, 0.012, 0.15), solid('#d8c49e')); rp.rotation.x = 0.38; rp.position.set(0, 0.04 + r * 0.06, 0.24 - r * 0.12 + 0.06); g.add(rp); }
    // statues of the queen as Osiris along the top colonnade
    for (var s = 0; s < 6; s++) { var st = new T.Mesh(new T.CapsuleGeometry(0.008, 0.04, 3, 6), solid('#f2e8d4')); st.position.set(-0.15 + s * 0.06, 0.166 + 0.03, -0.02 + 0.064); g.add(st); }
    return g;
  };

  /* ---------- Pompeii ---------- */
  M.custom.pompeii = function () {
    var g = new T.Group(), st = mat(stoneTex('pmp', '#c9b490', '#a8946e', 8, 6), 1, 1), brick = solid('#b8784a', { flatShading: true }), mar = solid('#e8e0d0');
    blob(g, '#a8a870', 0.74, 0.62, 0, 0, 0.006, 3);
    // Mount Vesuvius looming behind
    mountain(g, { h: 0.4, pos: [0.15, -0.45], rings: 12, r: function (t) { return t > 0.85 ? 0.08 : 0.32 * (1 - t) + 0.06; }, sx: 1.3, sz: 0.5, bump: 0.12, colour: function (x, y) { return y > 0.28 ? '#6a6058' : '#6a8a4a'; } });
    var sm = new T.Mesh(new T.SphereGeometry(0.04, 8, 6), solid('#d8d4d0', { transparent: true, opacity: 0.6 })); sm.position.set(0.15, 0.44, -0.45); g.add(sm);
    // the ruined Forum: a paved rectangle with broken columns and the Temple of Jupiter
    var fm = new T.Mesh(new T.PlaneGeometry(0.22, 0.4), solid('#d8ccb4')); fm.rotation.x = -Math.PI / 2; fm.position.set(-0.05, 0.008, 0.08); g.add(fm);
    for (var c = 0; c < 10; c++) [-1, 1].forEach(function (sd) { var h = 0.04 + hash(c, sd + 3) * 0.08; cyl(g, mar, 0.009, 0.01, h, -0.05 + sd * 0.12, 0.008, -0.08 + c * 0.035, 8); });
    box(g, brick, 0.12, 0.06, 0.08, -0.05, 0.008, -0.16); for (var k = 0; k < 4; k++) cyl(g, mar, 0.008, 0.008, 0.06, -0.09 + k * 0.026, 0.068, -0.13, 6);
    // roofless houses in a grid with straight stone streets, and a fresco wall
    for (var h2 = 0; h2 < 10; h2++) { var x = 0.15 + (h2 % 3) * 0.12, z = -0.15 + Math.floor(h2 / 3) * 0.13; if (z > 0.3) continue; [[0, -0.04, 0.09, 0.012], [0, 0.04, 0.09, 0.012], [-0.045, 0, 0.012, 0.09], [0.045, 0, 0.012, 0.09]].forEach(function (w) { box(g, h2 % 2 ? brick : st, w[2], 0.03 + hash(h2, w[0] * 10 + 3) * 0.03, w[3], x + w[0], 0.008, z + w[1]); }); }
    var fresco = new T.Mesh(new T.PlaneGeometry(0.07, 0.04), solid('#b83a2a')); fresco.position.set(0.27, 0.03, 0.026); g.add(fresco);
    for (var t = 0; t < 6; t++) { var cp = new T.Mesh(new T.ConeGeometry(0.02, 0.12, 6), solid('#2f5a2f')); cp.position.set(-0.45 + t * 0.06, 0.066, 0.4); g.add(cp); }
    return g;
  };

  /* ---------- Tulum ---------- */
  M.custom.tulum = function () {
    var g = new T.Group(), lime = mat(stoneTex('tlm', '#e0d4b8', '#c8bc9e', 6, 4), 1, 1);
    blob(g, '#3ac0d0', 0.74, 0.62, 0, 0.1, 0.006, 5);
    blob(g, '#f6f0e0', 0.6, 0.1, 0, 0.2, 0.01, 2);
    // a cliff by the Caribbean Sea, with El Castillo, a Maya temple, on top
    var sh = new T.Shape(); sh.moveTo(-0.62, -0.5); for (var i = 0; i <= 12; i++) { var x = -0.62 + i * 0.103; sh.lineTo(x, -0.12 - hash(i, 2) * 0.05); } sh.lineTo(0.62, -0.5); sh.lineTo(-0.62, -0.5);
    var cl = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.14, bevelEnabled: false }), solid('#c9b48a', { flatShading: true })); cl.rotation.x = Math.PI / 2; cl.scale.set(0.82, 0.82, 1); cl.position.y = 0.146; g.add(cl);
    var top = new T.Mesh(new T.ShapeGeometry(sh), solid('#6aa04a')); top.rotation.x = Math.PI / 2; top.scale.set(0.82, 0.82, 1); top.position.y = 0.147; top.rotation.x = -Math.PI / 2; top.scale.y = -0.82; g.add(top);
    var Y = 0.147, Z = -0.22;
    box(g, lime, 0.22, 0.04, 0.12, 0, Y, Z); box(g, lime, 0.12, 0.08, 0.08, 0, Y + 0.04, Z);
    for (var c = 0; c < 2; c++) box(g, solid('#3a3020'), 0.02, 0.04, 0.002, -0.025 + c * 0.05, Y + 0.044, Z + 0.041);
    box(g, lime, 0.14, 0.015, 0.09, 0, Y + 0.12, Z);
    for (var s = 0; s < 5; s++) box(g, solid('#d8ccb0'), 0.06, 0.01, 0.015, 0, Y + 0.04 - s * 0.008, Z + 0.07 + s * 0.015);
    [[-0.3, -0.25], [0.3, -0.28], [-0.22, -0.4], [0.28, -0.42]].forEach(function (q) { box(g, lime, 0.08, 0.05, 0.06, q[0], Y, q[1]); });
    for (var p = 0; p < 6; p++) palm(g, -0.45 + p * 0.18, -0.12 + (p % 2) * 0.03, 1.1);
    // iguanas sunbathing
    for (var ig = 0; ig < 2; ig++) { var iq = new T.Mesh(new T.CapsuleGeometry(0.005, 0.03, 3, 5), solid('#6a7a4a')); iq.rotation.z = Math.PI / 2; iq.position.set(-0.1 + ig * 0.25, Y + 0.006, -0.32); g.add(iq); }
    return g;
  };
})();
