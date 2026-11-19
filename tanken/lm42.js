/* Detailed landmarks, batch 42: Sans-Souci Palace (Haiti), Cathedral of Santa María la Menor, National Theatre of Costa Rica,
   Panamá Viejo, Palace of the Parliament (Bucharest), Motherland Monument (Kyiv), Nuuk, Royal Palace of Tonga. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function cone(g, m, r, h, x, y, z, seg, ry) { var c = new T.Mesh(new T.ConeGeometry(r, h, seg || 8), m); c.position.set(x, y + h / 2, z); if (ry) c.rotation.y = ry; g.add(c); return c; }
  function ball(g, m, r, x, y, z, sx, sy, sz) { var b = new T.Mesh(new T.SphereGeometry(r, 12, 8), m); b.position.set(x, y, z); b.scale.set(sx || 1, sy || 1, sz || 1); g.add(b); return b; }
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.007 * s, 0.01 * s, 0.035 * s, x, 0.006, z, 6); ball(g, solid('#5a3a28'), 0.0065 * s, x, 0.048 * s, z); }
  function hipRoof(g, m, w, d, h, x, y, z, o) {
    o = o || 0; var W = w / 2 + o, D = d / 2 + o, rx = Math.max(0, W - D), rz = Math.max(0, D - W);
    var P = [[-W, 0, -D], [W, 0, -D], [W, 0, D], [-W, 0, D], [-rx, h, -rz], [rx, h, -rz], [rx, h, rz], [-rx, h, rz]], pos = [];
    [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]].forEach(function (f) { [[0, 1, 2], [0, 2, 3]].forEach(function (t) { t.forEach(function (k) { pos.push(P[f[k]][0], P[f[k]][1], P[f[k]][2]); }); }); });
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals(); var mm = new T.Mesh(geo, m); mm.material.side = T.DoubleSide; mm.position.set(x, y, z); g.add(mm); return mm;
  }
  function palm(g, x, z, h) { cyl(g, solid('#8a6a4a'), 0.004, 0.006, h, x, 0.006, z, 5); for (var f = 0; f < 6; f++) { var fa = f / 6 * D2, fr = new T.Mesh(new T.BoxGeometry(0.05, 0.004, 0.012), solid('#3f8a3f')); fr.position.set(x + Math.cos(fa) * 0.022, h, z + Math.sin(fa) * 0.022); fr.rotation.y = -fa; fr.rotation.z = -0.4 * Math.cos(fa); g.add(fr); } }

  /* ---------- Sans-Souci Palace (Haiti) ---------- */
  M.custom.sanssouci = function () {
    var g = new T.Group(), ruin = mat(stoneTex('ssc', '#e8d8b8', '#b8a080', 10, 6), 2, 1), r2 = solid('#d8c4a0', { flatShading: true }), hole = solid('#4a3a2a');
    blob(g, '#5f9a45', 0.78, 0.64, 0, 0, 0.006, 3);
    // the roofless ruins of King Henri Christophe's palace (1813), wrecked by an earthquake — just walls, windows and grand stairs
    box(g, ruin, 0.44, 0.13, 0.03, 0, 0.006, -0.1); box(g, ruin, 0.03, 0.13, 0.16, -0.205, 0.006, -0.03); box(g, ruin, 0.03, 0.1, 0.16, 0.205, 0.006, -0.03);
    for (var r = 0; r < 2; r++) for (var c = 0; c < 7; c++) { var w = new T.Mesh(new T.PlaneGeometry(0.026, 0.035), hole); w.position.set(-0.18 + c * 0.06, 0.04 + r * 0.055, -0.0845); g.add(w); }
    box(g, ruin, 0.14, 0.06, 0.03, 0, 0.136, -0.1); var pd = new T.Mesh(new T.ConeGeometry(0.08, 0.03, 3), r2); pd.scale.z = 0.2; pd.rotation.y = Math.PI / 6; pd.position.set(0, 0.211, -0.1); g.add(pd); // the broken pediment
    for (var b = 0; b < 4; b++) box(g, r2, 0.03, 0.03 + hash(b, 2) * 0.03, 0.03, -0.2 + b * 0.13, 0.136, -0.1); // jagged broken wall tops
    // the double staircase sweeping up to the terrace
    for (var s = 0; s < 6; s++) box(g, solid('#d8c8a8'), 0.24 - s * 0.02, 0.008, 0.02, 0, 0.006 + s * 0.008, 0.03 + (5 - s) * 0.02);
    box(g, solid('#d8c8a8'), 0.36, 0.05, 0.08, 0, 0.006, -0.045);
    // the green hills of northern Haiti, with the great Citadelle fortress on the peak above
    mountain(g, { r: function (t) { return 0.24 * (1 - t) + 0.02; }, h: 0.3, pos: [0.15, -0.4], colour: function (x, y) { return y > 0.22 ? '#4f8a3f' : '#3f7a35'; }, seed: 7, bump: 0.2 });
    var ct = new T.Mesh(new T.BoxGeometry(0.07, 0.04, 0.04), solid('#9a8a78')); ct.position.set(0.15, 0.31, -0.4); ct.rotation.y = 0.5; g.add(ct);
    for (var t = 0; t < 6; t++) palm(g, -0.32 + t * 0.13, 0.28 - (t % 2) * 0.05, 0.1 + 0.02 * (t % 3));
    return g;
  };

  /* ---------- Cathedral of Santa María la Menor (Santo Domingo) ---------- */
  M.custom.santamaria = function () {
    var g = new T.Group(), coral = mat(stoneTex('smm', '#d8b88a', '#b89868', 8, 5), 1, 1), c2 = solid('#c8a878', { flatShading: true }), dark = solid('#4a3a2a');
    blob(g, '#c8bca8', 0.78, 0.62, 0, 0, 0.006, 4);
    // the first cathedral in the Americas (finished 1540), built of golden coral limestone, with a flat roof and a wide Plateresque front
    box(g, coral, 0.24, 0.13, 0.36, 0, 0.006, -0.08);
    box(g, coral, 0.3, 0.17, 0.04, 0, 0.006, 0.1);
    var fr = tex('smmf', 64, 64, function (x, w, h) { x.fillStyle = '#d8b88a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#8a6a48'; x.lineWidth = 1.5; for (var i = 0; i < 2; i++) { x.beginPath(); x.moveTo(12 + i * 26, 64); x.lineTo(12 + i * 26, 30); x.arc(25 + i * 26, 30, 13, Math.PI, 0); x.lineTo(38 + i * 26, 64); x.stroke(); x.fillStyle = '#5a3a28'; x.fillRect(15 + i * 26, 36, 20, 28); } for (var k = 0; k < 8; k++) { x.fillStyle = '#b89868'; x.fillRect(4 + k * 8, 8, 4, 10); } });
    var fp = new T.Mesh(new T.PlaneGeometry(0.2, 0.15), new T.MeshLambertMaterial({ map: fr })); fp.position.set(0, 0.08, 0.1205); g.add(fp);
    box(g, c2, 0.06, 0.2, 0.06, -0.12, 0.006, 0.06); // the bell tower stump
    for (var b = 0; b < 4; b++) box(g, c2, 0.03, 0.08, 0.03, (b % 2 ? 1 : -1) * 0.135, 0.006, -0.18 + Math.floor(b / 2) * 0.16); // buttresses
    // Columbus Park in front with his statue, palms and the old colonial street
    var pk = new T.Mesh(new T.PlaneGeometry(0.4, 0.2), solid('#d8d0c0')); pk.rotation.x = -Math.PI / 2; pk.position.set(0, 0.008, 0.25); g.add(pk);
    box(g, solid('#8a8278'), 0.04, 0.05, 0.04, 0.06, 0.008, 0.25); var stt = new T.Group(); stt.position.set(0.06, 0.058, 0.25); g.add(stt); cyl(stt, solid('#4a5a4a'), 0.008, 0.011, 0.04, 0, 0, 0, 6); ball(stt, solid('#4a5a4a'), 0.008, 0, 0.048, 0); box(stt, solid('#4a5a4a'), 0.02, 0.003, 0.003, 0.012, 0.035, 0);
    for (var t = 0; t < 4; t++) palm(g, -0.3 + t * 0.2, 0.33, 0.12);
    for (var p = 0; p < 4; p++) person(g, -0.08 + p * 0.03, 0.2 + (p % 2) * 0.04, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#ffffff'][p]);
    [-0.3, 0.3].forEach(function (x) { box(g, solid(x < 0 ? '#e8a8a0' : '#a8d0e8'), 0.08, 0.06, 0.2, x, 0.006, -0.1); });
    return g;
  };

  /* ---------- National Theatre of Costa Rica (San José) ---------- */
  M.custom.teatrocr = function () {
    var g = new T.Group(), wall = mat(winTex('tcr', '#e8dcc0', '#5a6068', 5, 2, { tall: 0.55 }), 2, 1), w2 = solid('#ece2c8'), roof = solid('#6a7a7a', { flatShading: true }), gold = solid('#d8ad4c');
    blob(g, '#c8c0b0', 0.78, 0.62, 0, 0, 0.006, 5);
    // a grand theatre built with money from coffee (1897): a classical stone front with columns, statues on the roof, and a domed corner
    box(g, wall, 0.4, 0.13, 0.26, 0, 0.006, -0.08); hipRoof(g, roof, 0.4, 0.26, 0.05, 0, 0.136, -0.08, 0.008);
    box(g, w2, 0.2, 0.15, 0.03, 0, 0.006, 0.06);
    for (var c = 0; c < 6; c++) cyl(g, w2, 0.006, 0.007, 0.1, -0.075 + c * 0.03, 0.03, 0.08, 8);
    box(g, w2, 0.2, 0.02, 0.03, 0, 0.136, 0.075);
    [-0.06, 0, 0.06].forEach(function (x, i) { var st = new T.Group(); st.position.set(x, 0.156, 0.075); g.add(st); cyl(st, w2, 0.006, 0.008, 0.03, 0, 0, 0, 6); ball(st, w2, 0.006, 0, 0.036, 0); if (i === 1) box(st, w2, 0.03, 0.004, 0.004, 0, 0.02, 0); }); // three statues: Dance, Music and Fame
    var dm = lathe([[0.04, 0], [0.04, 0.02], [0.03, 0.05], [0.012, 0.065], [0, 0.07]], 14, roof); dm.position.set(0.16, 0.18, -0.15); g.add(dm); cyl(g, w2, 0.042, 0.042, 0.04, 0.16, 0.14, -0.15, 14);
    // the Plaza de la Cultura with pigeons and a coffee cart
    var pz = new T.Mesh(new T.PlaneGeometry(0.6, 0.2), solid('#d8cfc0')); pz.rotation.x = -Math.PI / 2; pz.position.set(0, 0.008, 0.24); g.add(pz);
    for (var k = 0; k < 10; k++) ball(g, solid('#9a9aa8'), 0.005, -0.2 + hash(k, 1) * 0.4, 0.012, 0.18 + hash(k, 2) * 0.12, 1.4, 0.8, 0.8);
    var cart = new T.Group(); cart.position.set(-0.22, 0.006, 0.25); g.add(cart); box(cart, solid('#c0392b'), 0.05, 0.03, 0.03, 0, 0.012, 0); [-0.018, 0.018].forEach(function (x) { var wh = new T.Mesh(new T.CylinderGeometry(0.01, 0.01, 0.004, 10), solid('#3a3a3a')); wh.rotation.x = Math.PI / 2; wh.position.set(x, 0.01, 0.017); cart.add(wh); }); cyl(cart, solid('#f2ece0'), 0.001, 0.001, 0.04, 0, 0.042, 0, 4); cone(cart, solid('#f2c14e'), 0.03, 0.015, 0, 0.08, 0, 8);
    for (var p = 0; p < 4; p++) person(g, 0.0 + p * 0.04, 0.26 + (p % 2) * 0.04, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#33a06a'][p]);
    for (var t = 0; t < 4; t++) tree(g, 0.28, -0.3 + t * 0.1, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- Panamá Viejo ---------- */
  M.custom.panamaviejo = function () {
    var g = new T.Group(), st = mat(stoneTex('pvj', '#a89a88', '#7a6e60', 8, 5), 1, 3), s2 = solid('#9a8c7a', { flatShading: true }), hole = solid('#3a3028');
    var sea = new T.Mesh(new T.PlaneGeometry(1.0, 0.3), solid('#4a8ab8')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.007, 0.32); g.add(sea);
    blob(g, '#6aa04f', 0.76, 0.36, 0, -0.14, 0.006, 6);
    // the ruined stone tower of the old cathedral, all that stands of the first Spanish city on the Pacific (founded 1519, burned by pirates in 1671)
    box(g, st, 0.08, 0.3, 0.08, -0.05, 0.006, -0.05);
    for (var y = 0; y < 3; y++) [[0, 0.0405, 0], [0.0405, 0, Math.PI / 2], [0, -0.0405, Math.PI], [-0.0405, 0, -Math.PI / 2]].forEach(function (q) { var w = new T.Mesh(new T.PlaneGeometry(0.02, 0.04), hole); w.position.set(-0.05 + q[1], 0.08 + y * 0.08, -0.05 + q[0]); w.rotation.y = q[2]; g.add(w); });
    for (var b = 0; b < 3; b++) box(g, s2, 0.02, 0.02 + b * 0.01, 0.02, -0.08 + b * 0.03, 0.306, -0.02);
    // broken walls of the nave and old houses, grass growing inside
    box(g, st, 0.03, 0.1, 0.24, 0.06, 0.006, 0.02); box(g, st, 0.03, 0.06, 0.2, 0.16, 0.006, 0.0); box(g, st, 0.12, 0.08, 0.03, 0.11, 0.006, -0.1);
    for (var a = 0; a < 3; a++) arch(g, hole, 0.024, 0.05, 0.075, 0.006, -0.06 + a * 0.06, 0.002).rotation.y = Math.PI / 2;
    [[-0.22, 0.05], [-0.28, -0.12], [0.26, -0.18]].forEach(function (q) { box(g, st, 0.06, 0.04 + hash(q[0], 1) * 0.04, 0.05, q[0], 0.006, q[1]); });
    // the skyscrapers of modern Panama City across the bay
    for (var k = 0; k < 7; k++) box(g, mat(winTex('pvc' + (k % 3), ['#cfe0ea', '#8aa8c0', '#e8ecef'][k % 3], '#5a7890', 4, 8), 1, 3), 0.04, 0.16 + hash(k, 3) * 0.14, 0.04, -0.15 + k * 0.05, 0.006, -0.38);
    for (var t = 0; t < 5; t++) palm(g, -0.3 + t * 0.15, 0.14 + (t % 2) * 0.04, 0.1);
    return g;
  };

  /* ---------- Palace of the Parliament (Bucharest) ---------- */
  M.custom.parliamentro = function () {
    var g = new T.Group(), wall = mat(winTex('ppr', '#efe8da', '#6a7078', 8, 3, { tall: 0.55 }), 4, 1), w2 = mat(winTex('ppr', '#efe8da', '#6a7078', 8, 3, { tall: 0.55 }), 2, 1), w3 = solid('#efe8da');
    blob(g, '#6aa04f', 0.8, 0.66, 0, 0, 0.006, 3);
    // one of the heaviest buildings in the world: a huge white wedding cake of terraces, colonnades and a central tower
    box(g, wall, 0.56, 0.06, 0.4, 0, 0.006, -0.04);
    box(g, wall, 0.46, 0.06, 0.32, 0, 0.066, -0.04);
    box(g, w2, 0.3, 0.06, 0.22, 0, 0.126, -0.04);
    box(g, w2, 0.14, 0.06, 0.12, 0, 0.186, -0.04);
    box(g, w3, 0.08, 0.05, 0.08, 0, 0.246, -0.04); box(g, w3, 0.1, 0.008, 0.1, 0, 0.296, -0.04);
    for (var c = 0; c < 10; c++) cyl(g, w3, 0.005, 0.005, 0.05, -0.12 + c * 0.027, 0.07, 0.125, 6);
    for (var c2 = 0; c2 < 6; c2++) cyl(g, w3, 0.005, 0.005, 0.05, -0.075 + c2 * 0.03, 0.13, 0.075, 6);
    box(g, w3, 0.28, 0.008, 0.03, 0, 0.12, 0.125);
    // the very wide boulevard leading up to it with fountains
    var bv = new T.Mesh(new T.PlaneGeometry(0.16, 0.24), solid('#b8b4ac')); bv.rotation.x = -Math.PI / 2; bv.position.set(0, 0.008, 0.3); g.add(bv);
    for (var f = 0; f < 3; f++) { var fn = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.006, 12), solid('#6ab0e0')); fn.position.set(0, 0.011, 0.22 + f * 0.07); g.add(fn); }
    for (var t = 0; t < 8; t++) [-1, 1].forEach(function (s) { if (t % 2) return; var tr = new T.Mesh(new T.SphereGeometry(0.022, 7, 5), solid('#3f8a3f', { flatShading: true })); tr.position.set(s * 0.1, 0.035, 0.2 + t * 0.025); g.add(tr); });
    return g;
  };

  /* ---------- Motherland Monument (Kyiv) ---------- */
  M.custom.motherland = function () {
    var g = new T.Group(), steel = solid('#b8bcc2', { flatShading: true }), s2 = solid('#9aa0a8', { flatShading: true }), stone = solid('#d8d4cc');
    blob(g, '#6aa04f', 0.78, 0.64, 0, 0, 0.006, 4);
    // the museum building as a plinth on the hill above the Dnipro river
    var river = new T.Mesh(new T.PlaneGeometry(1.0, 0.16), solid('#4f8ac0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.009, 0.36); g.add(river);
    var hill = new T.Mesh(new T.CylinderGeometry(0.2, 0.3, 0.06, 12), solid('#5f9a45', { flatShading: true })); hill.position.set(0, 0.036, -0.05); g.add(hill);
    cyl(g, stone, 0.08, 0.1, 0.1, 0, 0.066, -0.05, 12);
    // a 62 m stainless-steel woman holding up a sword and a shield (made of steel, she shines silver in the sun)
    var w = new T.Group(); w.position.set(0, 0.166, -0.05); g.add(w);
    var dress = lathe([[0.04, 0], [0.034, 0.08], [0.026, 0.16], [0.022, 0.2], [0, 0.2]], 10, steel); w.add(dress);
    cyl(w, steel, 0.018, 0.022, 0.05, 0, 0.2, 0, 8); ball(w, steel, 0.016, 0, 0.27, 0);
    var arm1 = new T.Mesh(new T.CylinderGeometry(0.007, 0.009, 0.1, 6), steel); arm1.position.set(0.035, 0.29, 0); arm1.rotation.z = -0.5; w.add(arm1);
    var sword = new T.Mesh(new T.BoxGeometry(0.008, 0.16, 0.003), s2); sword.position.set(0.065, 0.42, 0); sword.rotation.z = -0.12; w.add(sword); box(w, s2, 0.03, 0.005, 0.006, 0.061, 0.335, 0);
    var arm2 = new T.Mesh(new T.CylinderGeometry(0.007, 0.009, 0.08, 6), steel); arm2.position.set(-0.035, 0.27, 0.01); arm2.rotation.z = 0.7; w.add(arm2);
    var sh = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.006, 16), s2); sh.rotation.z = Math.PI / 2; sh.rotation.y = 0.3; sh.position.set(-0.07, 0.31, 0.01); w.add(sh);
    // golden-domed monastery churches (Kyiv Pechersk Lavra) nearby, and trees
    var gold = solid('#e8b84a');
    [[0.24, -0.2], [0.3, -0.08]].forEach(function (q) { box(g, solid('#f2ece0'), 0.06, 0.07, 0.06, q[0], 0.006, q[1]); var d = lathe([[0.022, 0], [0.024, 0.01], [0.02, 0.025], [0.008, 0.04], [0, 0.05]], 10, gold); d.position.set(q[0], 0.076, q[1]); g.add(d); });
    box(g, solid('#f2ece0'), 0.03, 0.15, 0.03, 0.2, 0.006, -0.3); var bd = lathe([[0.016, 0], [0.018, 0.008], [0.012, 0.02], [0, 0.035]], 10, gold); bd.position.set(0.2, 0.156, -0.3); g.add(bd);
    for (var t = 0; t < 8; t++) tree(g, -0.32 + (t % 4) * 0.06, -0.2 + Math.floor(t / 4) * 0.25, 1.1, '#3f8a3f');
    return g;
  };

  /* ---------- Nuuk (Greenland) ---------- */
  M.custom.nuuk = function () {
    var g = new T.Group(), cols = ['#c8302a', '#2a6ab0', '#f2c14e', '#3a8a5a', '#e8e4dc', '#2a3a5a'];
    var sea = new T.Mesh(new T.CircleGeometry(0.48, 24), solid('#2f6a9a')); sea.rotation.x = -Math.PI / 2; sea.scale.y = 0.8; sea.position.y = 0.005; g.add(sea);
    var land = new T.Mesh(new T.CylinderGeometry(0.3, 0.34, 0.03, 10), solid('#8a8a7a', { flatShading: true })); land.position.set(0, 0.015, -0.06); g.add(land);
    // bright wooden houses in red, blue, yellow and green on bare rocks — colours that are easy to see in the snow
    for (var h = 0; h < 14; h++) { var a = h / 14 * D2 + 0.2, r = 0.12 + 0.12 * hash(h, 2), x = Math.cos(a) * r, z = -0.06 + Math.sin(a) * r * 0.8, c = cols[h % cols.length];
      var hs = new T.Group(); hs.position.set(x, 0.03, z); hs.rotation.y = hash(h, 3) * 3; g.add(hs);
      box(hs, solid(c), 0.05, 0.05, 0.04, 0, 0, 0); var rf = new T.Mesh(new T.ConeGeometry(0.036, 0.018, 4), solid('#3a3a40', { flatShading: true })); rf.rotation.y = Math.PI / 4; rf.scale.set(1.2, 1, 0.9); rf.position.y = 0.059; hs.add(rf);
      var wn = new T.Mesh(new T.PlaneGeometry(0.01, 0.01), solid('#f2ece0')); wn.position.set(0.012, 0.03, 0.0205); hs.add(wn); }
    // the Hans Egede church (red with a white steeple), the snowy Sermitsiaq mountain, and icebergs drifting by
    var ch = new T.Group(); ch.position.set(0.0, 0.03, 0.12); g.add(ch); box(ch, solid('#b8302a'), 0.06, 0.04, 0.04, 0, 0, 0); ridge(ch, solid('#2a2a2e'), 0.04, 0.02, 0.06, 0, 0.04, 0, Math.PI / 2); box(ch, solid('#f2ece0'), 0.014, 0.03, 0.014, -0.03, 0.04, 0); cone(ch, solid('#2a2a2e'), 0.01, 0.025, -0.03, 0.07, 0, 4, Math.PI / 4);
    mountain(g, { r: function (t) { return 0.2 * Math.pow(1 - t, 0.8) + 0.01; }, h: 0.34, pos: [-0.2, -0.36], colour: function (x, y) { return y > 0.12 ? '#f4f7fa' : '#6a6a6e'; }, seed: 9, bump: 0.3, jag: 0.03 });
    [[0.32, 0.2, 0.05], [0.22, 0.32, 0.035], [-0.32, 0.22, 0.04]].forEach(function (q) { var ib = new T.Mesh(new T.IcosahedronGeometry(q[2], 0), solid('#e8f4fa', { flatShading: true })); ib.scale.set(1.2, 0.8, 1); ib.position.set(q[0], 0.012, q[1]); g.add(ib); });
    return g;
  };

  /* ---------- Royal Palace of Tonga (Nukuʻalofa) ---------- */
  M.custom.tongapalace = function () {
    var g = new T.Group(), wht = mat(winTex('tgp', '#f6f4ee', '#6a7a8a', 6, 2, { tall: 0.6 }), 2, 1), w2 = solid('#f6f4ee'), roof = solid('#c8302a', { flatShading: true });
    var sea = new T.Mesh(new T.PlaneGeometry(1.0, 0.24), solid('#3aa8c8')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.007, 0.36); g.add(sea);
    blob(g, '#6aa04f', 0.76, 0.36, 0, -0.12, 0.006, 5);
    // a white wooden palace with red roofs and wide verandas, built from New Zealand timber in 1867, by the sea
    box(g, wht, 0.28, 0.07, 0.14, 0, 0.006, -0.08); box(g, wht, 0.28, 0.06, 0.12, 0, 0.076, -0.08);
    hipRoof(g, roof, 0.28, 0.12, 0.05, 0, 0.136, -0.08, 0.012);
    for (var c = 0; c < 10; c++) cyl(g, w2, 0.003, 0.003, 0.068, -0.135 + c * 0.03, 0.006, -0.002, 5);
    box(g, w2, 0.3, 0.006, 0.02, 0, 0.074, -0.002);
    box(g, wht, 0.04, 0.1, 0.04, 0.08, 0.136, -0.08); cone(g, roof, 0.035, 0.05, 0.08, 0.236, -0.08, 4, Math.PI / 4); cyl(g, w2, 0.001, 0.001, 0.04, 0.08, 0.286, -0.08, 4); box(g, solid('#c8302a'), 0.02, 0.012, 0.001, 0.09, 0.318, -0.08);
    // a lawn with Norfolk pines along the waterfront, and a little fence
    var lw = new T.Mesh(new T.PlaneGeometry(0.5, 0.16), solid('#7ab85a')); lw.rotation.x = -Math.PI / 2; lw.position.set(0, 0.009, 0.12); g.add(lw);
    for (var t = 0; t < 6; t++) { var tx = -0.3 + t * 0.12; cyl(g, solid('#7a5a3a'), 0.003, 0.004, 0.14, tx, 0.006, 0.22, 5); for (var l = 0; l < 4; l++) cone(g, solid('#2f6f3a'), 0.02 - l * 0.004, 0.025, tx, 0.04 + l * 0.03, 0.22, 6); }
    for (var f = 0; f < 20; f++) box(g, w2, 0.002, 0.015, 0.002, -0.25 + f * 0.026, 0.006, 0.2);
    return g;
  };
})();
