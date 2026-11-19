/* Detailed landmarks, batch 45: Valletta, Tree of Life (Bahrain), To Sua Ocean Trench, Cedars of God,
   Maletsunyane Falls, Xunantunich, Chinguetti, Predjama Castle. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function cone(g, m, r, h, x, y, z, seg, ry) { var c = new T.Mesh(new T.ConeGeometry(r, h, seg || 8), m); c.position.set(x, y + h / 2, z); if (ry) c.rotation.y = ry; g.add(c); return c; }
  function ball(g, m, r, x, y, z, sx, sy, sz) { var b = new T.Mesh(new T.SphereGeometry(r, 12, 8), m); b.position.set(x, y, z); b.scale.set(sx || 1, sy || 1, sz || 1); g.add(b); return b; }
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.007 * s, 0.01 * s, 0.035 * s, x, 0.006, z, 6); ball(g, solid('#5a3a28'), 0.0065 * s, x, 0.048 * s, z); }
  function rocky(geo, amt, seed) { var p = geo.attributes.position; for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = 1 + (noise(x * 9 + seed, z * 9 + y * 5) - 0.5) * amt; p.setXYZ(i, x * n, y, z * n); } geo.computeVertexNormals(); return geo; }

  /* ---------- Valletta (Malta) ---------- */
  M.custom.valletta = function () {
    var g = new T.Group(), lime = mat(stoneTex('vlt', '#e2cc9a', '#c4ac78', 10, 6), 3, 1), l2 = solid('#dcc490', { flatShading: true });
    var sea = new T.Mesh(new T.CircleGeometry(0.48, 28), solid('#2f8ac8')); sea.rotation.x = -Math.PI / 2; sea.scale.y = 0.8; sea.position.y = 0.005; g.add(sea);
    // a whole city of honey-coloured stone on a narrow peninsula, wrapped in huge fortress walls (built by the Knights of Malta, 1566)
    var sh = new T.Shape(); sh.moveTo(-0.34, -0.12); sh.lineTo(0.2, -0.16); sh.lineTo(0.32, -0.04); sh.lineTo(0.3, 0.06); sh.lineTo(0.18, 0.14); sh.lineTo(-0.34, 0.12); sh.lineTo(-0.34, -0.12);
    var wall = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.07, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.005, bevelSegments: 1 }), lime); wall.rotation.x = -Math.PI / 2; wall.position.y = 0.0; g.add(wall);
    // tightly packed houses with colourful wooden balconies
    var cols = ['#2a7a4a', '#c0392b', '#2a5ab0', '#e8a83a'];
    for (var i = 0; i < 6; i++) for (var j = 0; j < 3; j++) { var x = -0.26 + i * 0.075, z = -0.07 + j * 0.07; if (x > 0.15 && Math.abs(z) > 0.05) continue; if (Math.abs(x + 0.04) < 0.05 && Math.abs(z) < 0.05) continue;
      var h = 0.03 + hash(i, j) * 0.025; box(g, lime, 0.06, h, 0.055, x, 0.075, z); box(g, solid(cols[(i + j) % 4]), 0.015, 0.012, 0.006, x, 0.075 + h * 0.5, z + 0.03); }
    // the big dome of the Carmelite church and the tall spire of St Paul's, the city's skyline
    cyl(g, l2, 0.04, 0.04, 0.05, -0.04, 0.075, 0.0, 14); var dm = lathe([[0.042, 0], [0.042, 0.02], [0.034, 0.05], [0.015, 0.07], [0, 0.075]], 14, solid('#8a8a8e', { flatShading: true })); dm.position.set(-0.04, 0.125, 0); g.add(dm); cyl(g, l2, 0.008, 0.008, 0.025, -0.04, 0.2, 0, 8);
    box(g, lime, 0.025, 0.1, 0.025, 0.06, 0.075, 0.03); cone(g, solid('#c8b080'), 0.018, 0.06, 0.06, 0.175, 0.03, 8);
    // Fort St Elmo at the tip (a star fort) and boats (luzzu) painted with eyes in the Grand Harbour
    var fe = new T.Shape(); for (var k = 0; k < 8; k++) { var a = k / 8 * D2, r = k % 2 ? 0.04 : 0.065; if (k) fe.lineTo(Math.cos(a) * r, Math.sin(a) * r); else fe.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    var fm = new T.Mesh(new T.ExtrudeGeometry(fe, { depth: 0.03, bevelEnabled: false }), lime); fm.rotation.x = -Math.PI / 2; fm.position.set(0.27, 0.075, 0.0); g.add(fm);
    [[-0.1, 0.3, '#e8a83a'], [0.05, 0.32, '#2a8ac8'], [0.18, 0.28, '#c0392b']].forEach(function (q) { var bt = new T.Group(); bt.position.set(q[0], 0.008, q[1]); g.add(bt); var hl = new T.Mesh(new T.CylinderGeometry(0.012, 0.008, 0.07, 6, 1, false, 0, Math.PI), solid(q[2])); hl.rotation.set(0, 0, Math.PI / 2); hl.rotation.order = 'ZYX'; bt.add(hl); hl.rotation.x = Math.PI; ball(bt, solid('#ffffff'), 0.004, 0.03, 0.006, 0.008); ball(bt, solid('#ffffff'), 0.004, 0.03, 0.006, -0.008); });
    return g;
  };

  /* ---------- Tree of Life (Bahrain) ---------- */
  M.custom.treeoflife = function () {
    var g = new T.Group();
    blob(g, '#e2c890', 0.8, 0.66, 0, 0, 0.006, 4);
    // a single 400-year-old mesquite tree, green and alive in the middle of the desert where nothing else grows — nobody is sure where it gets its water
    var hill = new T.Mesh(new T.SphereGeometry(0.16, 14, 6, 0, D2, 0, Math.PI / 2), solid('#d8b878', { flatShading: true })); hill.scale.y = 0.25; g.add(hill);
    var bark = solid('#6a4a32', { flatShading: true });
    var tr = new T.Mesh(new T.CylinderGeometry(0.025, 0.04, 0.12, 7), bark); tr.position.set(0, 0.09, 0); tr.rotation.z = 0.15; g.add(tr);
    for (var b = 0; b < 7; b++) { var a = b / 7 * D2, br = new T.Mesh(new T.CylinderGeometry(0.006, 0.014, 0.16, 5), bark); br.position.set(Math.cos(a) * 0.06, 0.18, Math.sin(a) * 0.06); br.rotation.z = -Math.cos(a) * 0.9; br.rotation.x = Math.sin(a) * 0.9; g.add(br); }
    for (var c = 0; c < 14; c++) { var a2 = c / 14 * D2 + hash(c, 1), r = 0.08 + hash(c, 2) * 0.1; var cl = new T.Mesh(new T.IcosahedronGeometry(0.05 + hash(c, 3) * 0.03, 0), solid(c % 3 ? '#5f8a3f' : '#7aa04a', { flatShading: true })); cl.scale.y = 0.6; cl.position.set(Math.cos(a2) * r, 0.22 + hash(c, 4) * 0.06, Math.sin(a2) * r); g.add(cl); }
    // a low wall around it, visitors, and oil-field pumps far off on the flat desert
    for (var w = 0; w < 24; w++) { var a3 = w / 24 * D2; box(g, solid('#c8b080'), 0.03, 0.012, 0.008, Math.cos(a3) * 0.22, 0.006, Math.sin(a3) * 0.22).rotation.y = -a3 + Math.PI / 2; }
    for (var p = 0; p < 4; p++) person(g, 0.1 + p * 0.03, 0.26, 1.1, ['#ffffff', '#2b6fd6', '#e8a83a', '#c0392b'][p]);
    [[-0.32, -0.26], [0.3, -0.3]].forEach(function (q) { var pj = new T.Group(); pj.position.set(q[0], 0.006, q[1]); g.add(pj); box(pj, solid('#4a4a50'), 0.04, 0.01, 0.02, 0, 0, 0); var arm = new T.Mesh(new T.BoxGeometry(0.06, 0.008, 0.008), solid('#e8a83a')); arm.position.set(0, 0.05, 0); arm.rotation.z = 0.2; pj.add(arm); cyl(pj, solid('#4a4a50'), 0.003, 0.003, 0.05, 0, 0, 0, 4); });
    return g;
  };

  /* ---------- To Sua Ocean Trench (Samoa) ---------- */
  M.custom.tosua = function () {
    var g = new T.Group();
    var sea = new T.Mesh(new T.PlaneGeometry(1.0, 0.24), solid('#2a9ac8')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.006, 0.35); g.add(sea);
    // lush green lava ground with a giant round hole in it…
    var ring = new T.Shape(); ring.absarc(0, 0, 0.32, 0, D2, false); var hl = new T.Path(); hl.absarc(0, 0, 0.13, 0, D2, true); ring.holes.push(hl);
    var gr = new T.Mesh(new T.ExtrudeGeometry(ring, { depth: 0.07, bevelEnabled: false, curveSegments: 24 }), [solid('#4f9a45', { flatShading: true }), solid('#5a4a3a', { flatShading: true })]); gr.rotation.x = -Math.PI / 2; gr.scale.y = 0.8; gr.position.set(0, 0.0, -0.05); g.add(gr);
    // …30 m deep, with clear turquoise seawater at the bottom (it flows in through a tunnel from the ocean) — you climb down a long wooden ladder to swim
    var pool = new T.Mesh(new T.CircleGeometry(0.13, 24), solid('#3ad0d8')); pool.rotation.x = -Math.PI / 2; pool.scale.y = 0.8; pool.position.set(0, 0.02, -0.05); g.add(pool);
    var lad = new T.Group(); lad.position.set(0.11, 0.0, -0.05); g.add(lad);
    [-0.008, 0.008].forEach(function (z) { var rl = new T.Mesh(new T.BoxGeometry(0.004, 0.12, 0.004), solid('#8a6a42')); rl.position.set(0, 0.06, z); lad.add(rl); }); for (var r = 0; r < 8; r++) box(lad, solid('#8a6a42'), 0.004, 0.003, 0.02, 0, 0.01 + r * 0.014, 0);
    box(g, solid('#8a6a42'), 0.06, 0.004, 0.03, 0.14, 0.07, -0.05); // the platform at the top
    person(g, 0.0, -0.05, 0.8, '#e8473a'); g.children[g.children.length - 1].position.y += 0.025; g.children[g.children.length - 2].position.y += 0.025;
    // palm trees, a fale (open Samoan hut), and the black lava rocks of the coast
    for (var t = 0; t < 7; t++) { var a = t / 7 * D2 + 0.3, tx = Math.cos(a) * 0.26, tz = -0.05 + Math.sin(a) * 0.2; cyl(g, solid('#8a6a4a'), 0.004, 0.006, 0.12, tx, 0.07, tz, 5); for (var f = 0; f < 6; f++) { var fa = f / 6 * D2, fr = new T.Mesh(new T.BoxGeometry(0.05, 0.004, 0.012), solid('#3f8a3f')); fr.position.set(tx + Math.cos(fa) * 0.022, 0.19, tz + Math.sin(fa) * 0.022); fr.rotation.y = -fa; fr.rotation.z = -0.4 * Math.cos(fa); g.add(fr); } }
    var fale = new T.Group(); fale.position.set(-0.2, 0.07, 0.12); g.add(fale); for (var c = 0; c < 6; c++) { var ca = c / 6 * D2; cyl(fale, solid('#8a6a42'), 0.003, 0.003, 0.04, Math.cos(ca) * 0.03, 0, Math.sin(ca) * 0.03, 4); } var fr2 = new T.Mesh(new T.SphereGeometry(0.045, 10, 5, 0, D2, 0, Math.PI / 2), solid('#c8a860', { flatShading: true })); fr2.scale.y = 0.6; fr2.position.y = 0.04; fale.add(fr2);
    for (var k = 0; k < 8; k++) ball(g, solid('#2a2a2e', { flatShading: true }), 0.03, -0.35 + k * 0.1, 0.012, 0.26, 1.2, 0.5, 1);
    return g;
  };

  /* ---------- Cedars of God (Lebanon) ---------- */
  M.custom.cedars = function () {
    var g = new T.Group();
    blob(g, '#8a9a6a', 0.8, 0.66, 0, 0, 0.006, 3);
    // a grove of ancient cedar trees high in the mountains — some are over 1,000 years old; a cedar is on Lebanon's flag
    function cedar(x, z, s) {
      var t = new T.Group(); t.position.set(x, 0.006, z); t.scale.setScalar(s); g.add(t);
      cyl(t, solid('#6a4a32', { flatShading: true }), 0.012, 0.02, 0.16, 0, 0, 0, 6);
      for (var l = 0; l < 4; l++) { var w = 0.11 - l * 0.022, y = 0.06 + l * 0.045; var pad = new T.Mesh(new T.CylinderGeometry(w * 0.85, w, 0.022, 9), solid(l % 2 ? '#2f6a3a' : '#3f7a45', { flatShading: true })); pad.position.y = y; pad.rotation.y = l; pad.scale.z = 0.8; t.add(pad); } // flat layered branches
      cone(t, solid('#2f6a3a', { flatShading: true }), 0.025, 0.04, 0, 0.23, 0, 7);
    }
    cedar(0, -0.02, 1.3); cedar(-0.17, 0.06, 1.0); cedar(0.17, 0.08, 1.05); cedar(-0.1, -0.2, 0.9); cedar(0.12, -0.18, 0.95); cedar(-0.28, -0.08, 0.75); cedar(0.28, -0.06, 0.8);
    // the snowy Mount Lebanon range behind and a little stone chapel in the grove
    mountain(g, { r: function (t) { return 0.3 * (1 - t) + 0.03; }, h: 0.24, pos: [0, -0.42], sx: 2.2, sz: 0.5, bump: 0.2, seed: 8, colour: function (x, y) { return y > 0.12 ? '#f4f7fa' : '#9a8a78'; } });
    var ch = new T.Group(); ch.position.set(0.05, 0.006, 0.24); g.add(ch); box(ch, mat(stoneTex('cdc', '#d8c8a8', '#b0a080', 8, 5), 1, 1), 0.06, 0.04, 0.05, 0, 0, 0); ridge(ch, solid('#a8452e'), 0.06, 0.025, 0.05, 0, 0.04, 0, 0); box(ch, solid('#d8c8a8'), 0.012, 0.03, 0.012, 0, 0.065, 0.02);
    for (var p = 0; p < 3; p++) person(g, -0.08 + p * 0.03, 0.28, 1.0, ['#c0392b', '#2b6fd6', '#f2c14e'][p]);
    return g;
  };

  /* ---------- Maletsunyane Falls (Lesotho) ---------- */
  M.custom.maletsunyane = function () {
    var g = new T.Group(), rock = solid('#6a6a5a', { flatShading: true }), grass = solid('#8aa05a', { flatShading: true });
    // a 192 m waterfall dropping in one leap into a deep gorge in the mountain kingdom
    [-1, 1].forEach(function (s) { var cl = new T.Mesh(rocky(new T.BoxGeometry(0.28, 0.34, 0.3, 4, 4, 4), 0.15, s * 3), rock); cl.position.set(s * 0.22, 0.17, -0.1); g.add(cl); var top = new T.Mesh(new T.BoxGeometry(0.28, 0.012, 0.3), grass); top.position.set(s * 0.22, 0.346, -0.1); g.add(top); });
    var back = new T.Mesh(rocky(new T.BoxGeometry(0.12, 0.34, 0.12, 2, 4, 2), 0.1, 7), rock); back.position.set(0, 0.17, -0.22); g.add(back); var bt = new T.Mesh(new T.BoxGeometry(0.12, 0.012, 0.12), grass); bt.position.set(0, 0.346, -0.22); g.add(bt);
    var river = new T.Mesh(new T.PlaneGeometry(0.06, 0.12), solid('#6aa0c8')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.354, -0.22); g.add(river);
    var fall = new T.Mesh(new T.PlaneGeometry(0.05, 0.34), new T.MeshLambertMaterial({ color: '#eef8ff', transparent: true, opacity: 0.9 })); fall.position.set(0, 0.18, -0.155); g.add(fall);
    var pool = new T.Mesh(new T.CircleGeometry(0.07, 14), solid('#4a8ab0')); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.008, -0.08); g.add(pool);
    for (var m = 0; m < 6; m++) { var mi = new T.Mesh(new T.IcosahedronGeometry(0.02 + hash(m, 1) * 0.02, 0), new T.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.6, flatShading: true })); mi.position.set((hash(m, 2) - 0.5) * 0.1, 0.02 + hash(m, 3) * 0.06, -0.08); g.add(mi); }
    var riv2 = new T.Mesh(new T.PlaneGeometry(0.05, 0.3), solid('#4a8ab0')); riv2.rotation.x = -Math.PI / 2; riv2.position.set(0, 0.007, 0.12); g.add(riv2);
    // a Basotho horseman in his blanket and cone-shaped mokorotlo hat on the cliff top
    var hm = new T.Group(); hm.position.set(0.2, 0.352, -0.02); g.add(hm); box(hm, solid('#6a4a32'), 0.04, 0.02, 0.014, 0, 0.022, 0); [-0.014, 0.014].forEach(function (x) { [-0.005, 0.005].forEach(function (z) { box(hm, solid('#5a3a28'), 0.004, 0.022, 0.004, x, 0, z); }); }); box(hm, solid('#6a4a32'), 0.01, 0.025, 0.01, 0.022, 0.03, 0);
    cyl(hm, solid('#c0392b'), 0.008, 0.012, 0.025, 0, 0.04, 0, 6); cone(hm, solid('#d8b060'), 0.012, 0.016, 0, 0.07, 0, 8);
    return g;
  };

  /* ---------- Xunantunich (Belize) ---------- */
  M.custom.xunantunich = function () {
    var g = new T.Group(), st = mat(stoneTex('xun', '#c8bca0', '#9a8e78', 8, 4), 2, 1), st2 = solid('#b8ac90', { flatShading: true });
    blob(g, '#4f8a3f', 0.8, 0.66, 0, 0, 0.006, 5);
    // a Maya city in the jungle: "El Castillo", a 40 m pyramid with a carved frieze near the top
    var py = new T.Group(); py.position.set(0, 0.006, -0.06); g.add(py);
    for (var l = 0; l < 5; l++) box(py, st, 0.34 - l * 0.05, 0.045, 0.28 - l * 0.04, 0, l * 0.045, 0);
    box(py, st, 0.12, 0.07, 0.09, 0, 0.225, 0);
    var fr = tex('xunf', 64, 16, function (x, w, h) { x.fillStyle = '#c8bca0'; x.fillRect(0, 0, w, h); x.strokeStyle = '#6a5e48'; x.lineWidth = 1.5; for (var i = 0; i < 4; i++) { x.strokeRect(2 + i * 16, 2, 12, 12); x.beginPath(); x.arc(8 + i * 16, 8, 3, 0, D2); x.stroke(); } });
    var fp = new T.Mesh(new T.PlaneGeometry(0.12, 0.03), new T.MeshLambertMaterial({ map: fr })); fp.position.set(0, 0.27, 0.0455); py.add(fp);
    var sp = new T.Mesh(new T.BoxGeometry(0.06, 0.012, 0.25), st2); sp.position.set(0, 0.11, 0.13); sp.rotation.x = 0.78; py.add(sp);
    // smaller temple mounds round the plaza, a ball court, and the rainforest
    [[-0.28, 0.12, 0.12], [0.28, 0.1, 0.1], [-0.24, -0.25, 0.09]].forEach(function (q) { for (var l2 = 0; l2 < 3; l2++) box(g, st, q[2] * (1 - l2 * 0.25) * 1.2, 0.03, q[2] * (1 - l2 * 0.25), q[0], 0.006 + l2 * 0.03, q[1]); });
    [-1, 1].forEach(function (s) { box(g, st2, 0.12, 0.03, 0.03, 0.12, 0.006, 0.26 + s * 0.04); });
    for (var t = 0; t < 14; t++) { var a = t / 14 * D2, r = 0.38; var tr = new T.Mesh(new T.SphereGeometry(0.045, 8, 6), solid(t % 2 ? '#2f6f3a' : '#3f8a3f', { flatShading: true })); tr.position.set(Math.cos(a) * r, 0.1, Math.sin(a) * r * 0.85); g.add(tr); cyl(g, solid('#6a5a48'), 0.006, 0.008, 0.06, Math.cos(a) * r, 0.006, Math.sin(a) * r * 0.85, 5); }
    for (var p = 0; p < 3; p++) person(g, -0.05 + p * 0.04, 0.2, 1.0, ['#c0392b', '#2b6fd6', '#f2c14e'][p]);
    return g;
  };

  /* ---------- Chinguetti (Mauritania) ---------- */
  M.custom.chinguetti = function () {
    var g = new T.Group(), stone = mat(stoneTex('chg', '#b88a5a', '#8a6440', 6, 4), 1, 2), s2 = solid('#a87a4a', { flatShading: true });
    blob(g, '#e8c080', 0.8, 0.66, 0, 0, 0.006, 6);
    // an old Saharan trading town of dry-stone houses, famous for libraries of handwritten books hundreds of years old
    // the mosque's square stone minaret topped with five ostrich eggs
    var mq = new T.Group(); mq.position.set(0.02, 0.006, -0.06); g.add(mq);
    box(mq, stone, 0.2, 0.06, 0.16, 0, 0, 0);
    box(mq, stone, 0.06, 0.2, 0.06, 0.06, 0, -0.04); for (var c = 0; c < 4; c++) box(mq, s2, 0.012, 0.016, 0.012, 0.06 + (c % 2 ? 0.024 : -0.024), 0.2, -0.04 + (c < 2 ? 0.024 : -0.024));
    for (var e = 0; e < 5; e++) ball(mq, solid('#f4efe4'), 0.006, 0.06 + [0, 0.024, -0.024, 0.024, -0.024][e], 0.222 + (e ? 0 : 0.012), -0.04 + [0, 0.024, 0.024, -0.024, -0.024][e], 1, 1.3, 1);
    // houses with wooden doors, a library with old books, and big sand dunes swallowing the edge of town
    for (var h = 0; h < 7; h++) { var hx = -0.3 + (h % 4) * 0.13, hz = 0.1 + Math.floor(h / 4) * 0.12; box(g, stone, 0.09, 0.05, 0.08, hx, 0.006, hz); var dr = new T.Mesh(new T.PlaneGeometry(0.02, 0.03), solid('#6a3a1a')); dr.position.set(hx, 0.022, hz + 0.0405); g.add(dr); }
    var lib = new T.Group(); lib.position.set(-0.24, 0.006, -0.12); g.add(lib); box(lib, stone, 0.1, 0.05, 0.08, 0, 0, 0); for (var b = 0; b < 4; b++) box(lib, solid(['#8a3a2a', '#3a5a8a', '#6a8a3a', '#c8a040'][b]), 0.02, 0.014, 0.012, -0.03 + b * 0.02, 0.05, 0.03);
    for (var d = 0; d < 3; d++) { var du = new T.Mesh(new T.SphereGeometry(0.12, 12, 6, 0, D2, 0, Math.PI / 2), solid('#f0c888', { flatShading: true })); du.scale.set(1.5, 0.45, 0.8); du.position.set(0.2 + d * 0.06, 0.006, -0.3 + d * 0.15); g.add(du); }
    var cm = new T.Group(); cm.position.set(-0.3, 0.006, 0.3); g.add(cm); var bd = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), solid('#c8a070', { flatShading: true })); bd.scale.set(1.4, 0.8, 0.8); bd.position.y = 0.07; cm.add(bd); ball(cm, solid('#c8a070'), 0.016, 0, 0.1, 0); [-0.025, 0.025].forEach(function (x) { [-0.012, 0.012].forEach(function (z) { box(cm, solid('#b89060'), 0.006, 0.055, 0.006, x, 0, z); }); }); box(cm, solid('#c8a070'), 0.01, 0.05, 0.01, 0.045, 0.06, 0); ball(cm, solid('#c8a070'), 0.012, 0.055, 0.11, 0, 1.4, 0.8, 0.8);
    for (var p = 0; p < 2; p++) person(g, -0.22 + p * 0.03, 0.3, 1.0, '#2a4aa8');
    return g;
  };

  /* ---------- Predjama Castle (Slovenia) ---------- */
  M.custom.predjama = function () {
    var g = new T.Group(), wall = mat(winTex('pdj', '#ece6da', '#4a4a4a', 3, 4, { tall: 0.5 }), 1, 1), roof = solid('#8a3a2a', { flatShading: true }), cliff = solid('#a8a090', { flatShading: true });
    blob(g, '#5f9a45', 0.8, 0.66, 0, 0, 0.006, 4);
    // a castle built right into the mouth of a cave halfway up a 123 m cliff — a robber knight hid here for a year in a siege
    var cl = new T.Mesh(rocky(new T.BoxGeometry(0.7, 0.5, 0.2, 7, 6, 2), 0.12, 2), cliff); cl.position.set(0, 0.25, -0.22); g.add(cl);
    var cave = new T.Mesh(new T.CircleGeometry(0.14, 16, 0, Math.PI), solid('#2a2622')); cave.position.set(0, 0.16, -0.115); g.add(cave);
    var cs = new T.Group(); cs.position.set(0, 0.006, -0.08); g.add(cs);
    box(cs, wall, 0.18, 0.24, 0.07, 0, 0.05, 0); box(cs, solid('#d8d0c0'), 0.2, 0.05, 0.08, 0, 0.0, 0.0);
    var r1 = new T.Group(); r1.position.y = 0.29; cs.add(r1); ridge(r1, roof, 0.07, 0.04, 0.18, 0, 0, 0, Math.PI / 2);
    box(cs, wall, 0.05, 0.08, 0.05, -0.1, 0.18, 0.02); cone(cs, roof, 0.04, 0.05, -0.1, 0.26, 0.02, 4, Math.PI / 4);
    // the steep road and a little wooden bridge to the gate, and the forest below
    box(g, solid('#a89a80'), 0.04, 0.008, 0.2, 0.14, 0.03, 0.06).rotation.x = -0.25;
    for (var t = 0; t < 10; t++) { var tx = -0.34 + t * 0.075; if (Math.abs(tx - 0.14) < 0.05) continue; var tr = new T.Mesh(new T.ConeGeometry(0.03, 0.09, 6), solid(t % 2 ? '#2f6f3a' : '#3f7a45')); tr.position.set(tx, 0.05, 0.12 + (t % 3) * 0.06); g.add(tr); }
    return g;
  };
})();
