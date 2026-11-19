/* Detailed landmarks, batch 26: Gediminas' Tower, Freedom Monument (Riga), Church of Saint Sava, Grand Mosque of Agadez,
   Ha'amonga 'a Maui, Castillo San Felipe del Morro, Laas Geel, Itaipu Dam. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }

  /* ---------- Gediminas' Tower ---------- */
  M.custom.gediminas = function () {
    var g = new T.Group(), brick = mat(stoneTex('gdm', '#b8604a', '#9a4a38', 8, 10), 1, 2);
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // the steep castle hill in the old town of Vilnius
    mountain(g, { h: 0.28, rings: 12, r: function (t) { return 0.36 * (1 - t) + 0.08; }, bump: 0.15, colour: function (x, y) { return y > 0.2 ? '#6aa04a' : '#4f8a3f'; } });
    // an octagonal red-brick tower with the flag on top
    var Y = 0.27;
    cyl(g, brick, 0.07, 0.075, 0.08, 0, Y, 0, 8, Math.PI / 8);
    cyl(g, brick, 0.062, 0.066, 0.1, 0, Y + 0.08, 0, 8, Math.PI / 8);
    for (var i = 0; i < 8; i++) { var a = i / 8 * D2 + Math.PI / 8; box(g, solid('#f2ece0'), 0.018, 0.04, 0.004, Math.cos(a) * 0.064, Y + 0.11, Math.sin(a) * 0.064).rotation.y = -a + Math.PI / 2; }
    for (var k = 0; k < 8; k++) { var b = k / 8 * D2; box(g, brick, 0.02, 0.016, 0.02, Math.cos(b) * 0.055, Y + 0.18, Math.sin(b) * 0.055); }
    cyl(g, solid('#dddddd'), 0.003, 0.003, 0.1, 0, Y + 0.18, 0, 4);
    box(g, solid('#fdb913'), 0.06, 0.012, 0.003, 0.03, Y + 0.258, 0); box(g, solid('#006a44'), 0.06, 0.012, 0.003, 0.03, Y + 0.246, 0); box(g, solid('#c1272d'), 0.06, 0.012, 0.003, 0.03, Y + 0.234, 0);
    // a funicular climbing the hill, and old-town roofs below
    var rail = new T.Mesh(new T.BoxGeometry(0.02, 0.004, 0.36), solid('#666')); rail.rotation.x = -0.65; rail.position.set(0.2, 0.13, 0.18); g.add(rail); box(g, solid('#d04a2a'), 0.03, 0.02, 0.04, 0.2, 0.15, 0.15);
    for (var h = 0; h < 8; h++) { var a2 = h / 8 * D2 + 0.4, x = Math.cos(a2) * 0.55, z = Math.sin(a2) * 0.45; box(g, solid(['#f2e2c4', '#e8d0b0', '#f6f2ea'][h % 3]), 0.08, 0.05, 0.06, x, 0.006, z); hip(g, solid('#c9603a'), 0.085, 0.065, 0.03, x, 0.056, z); }
    return g;
  };

  /* ---------- Freedom Monument, Riga ---------- */
  M.custom.freedomriga = function () {
    var g = new T.Group(), gran = mat(stoneTex('frm', '#c9bca8', '#a89a86', 6, 10), 1, 2), copper = solid('#5fa88a', { flatShading: true });
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    var pz = new T.Mesh(new T.CircleGeometry(0.3, 24), solid('#d8d2c4')); pz.rotation.x = -Math.PI / 2; pz.position.y = 0.008; g.add(pz);
    // stepped base with sculpture groups, then the tall slim column
    box(g, solid('#bfb2a0'), 0.24, 0.02, 0.24, 0, 0.008, 0); box(g, gran, 0.18, 0.08, 0.18, 0, 0.028, 0);
    [[0, 0.1], [0, -0.1], [0.1, 0], [-0.1, 0]].forEach(function (q) { var f = new T.Mesh(new T.CapsuleGeometry(0.014, 0.03, 3, 6), solid('#b8ab96')); f.position.set(q[0], 0.06, q[1]); g.add(f); });
    var col = new T.Mesh(new T.BoxGeometry(0.06, 0.38, 0.045), gran); col.position.set(0, 0.108 + 0.19, 0); g.add(col);
    // Milda holding up three golden stars
    var Y = 0.488, body = lathe([[0.018, 0], [0.02, 0.04], [0.016, 0.07], [0.008, 0.08], [0, 0.08]], 8, copper); body.position.y = Y; g.add(body);
    var hd = new T.Mesh(new T.SphereGeometry(0.01, 8, 6), copper); hd.position.y = Y + 0.09; g.add(hd);
    [-1, 1].forEach(function (sd) { var arm = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.05, 4), copper); arm.position.set(sd * 0.012, Y + 0.11, 0); arm.rotation.z = -sd * 0.25; g.add(arm); });
    var gold = solid('#f0c040', { emissive: '#6a4a00' });
    [-0.025, 0, 0.025].forEach(function (x) { var st = new T.Mesh(new T.OctahedronGeometry(0.01, 0), gold); st.scale.y = 0.5; st.rotation.x = Math.PI / 2; st.position.set(x, Y + 0.145, 0); g.add(st); });
    // two guards, the canal and flowerbeds
    [-0.08, 0.08].forEach(function (x) { cyl(g, solid('#3a4a3a'), 0.008, 0.008, 0.03, x, 0.036, 0.12, 6); });
    var cn = new T.Mesh(new T.PlaneGeometry(1.0, 0.07), solid('#4a7aa0')); cn.rotation.x = -Math.PI / 2; cn.position.set(0, 0.009, -0.4); cn.scale.x = 0.62; g.add(cn);
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; tree(g, Math.cos(a) * 0.5, Math.sin(a) * 0.38, 1.2, '#3f8a3f'); }
    return g;
  };

  /* ---------- Church of Saint Sava ---------- */
  M.custom.stsava = function () {
    var g = new T.Group(), wm = mat(winTex('ssv', '#f2ece0', '#8a9aa8', 6, 3, { tall: 0.7 }), 1, 1), w = solid('#f2ece0'), green = solid('#4f9a7a'), gold = solid('#e8c34a', { emissive: '#4a3600' });
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a huge cross-plan church with a central dome and smaller half-domes
    box(g, wm, 0.36, 0.16, 0.2, 0, 0.006, 0); box(g, wm, 0.2, 0.16, 0.36, 0, 0.006, 0);
    [[0.19, 0, Math.PI / 2], [-0.19, 0, -Math.PI / 2], [0, 0.19, 0], [0, -0.19, Math.PI]].forEach(function (q) { var hd = new T.Mesh(new T.SphereGeometry(0.08, 14, 8, 0, Math.PI, 0, Math.PI / 2), green); hd.rotation.y = q[2] - Math.PI / 2; hd.position.set(q[0] * 0.55, 0.166, q[1] * 0.55); g.add(hd); });
    cyl(g, wm, 0.11, 0.11, 0.08, 0, 0.166, 0, 24);
    domeOn(g, green, 0.12, 0.12, 0, 0.246, 0, 24);
    cyl(g, w, 0.015, 0.02, 0.03, 0, 0.366, 0, 8);
    var cr = new T.Group(); box(cr, gold, 0.006, 0.05, 0.006, 0, 0, 0); box(cr, gold, 0.03, 0.006, 0.006, 0, 0.032, 0); cr.position.set(0, 0.396, 0); g.add(cr);
    // four bell towers with small domes
    [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].forEach(function (q) { box(g, wm, 0.06, 0.22, 0.06, q[0], 0.006, q[1]); domeOn(g, green, 0.034, 0.05, q[0], 0.226, q[1], 10); var c2 = new T.Group(); box(c2, gold, 0.004, 0.025, 0.004, 0, 0, 0); box(c2, gold, 0.014, 0.004, 0.004, 0, 0.016, 0); c2.position.set(q[0], 0.276, q[1]); g.add(c2); });
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; tree(g, Math.cos(a) * 0.55, Math.sin(a) * 0.45, 1.1, '#3f8a3f'); }
    return g;
  };

  /* ---------- Grand Mosque of Agadez ---------- */
  M.custom.agadez = function () {
    var g = new T.Group(), mud = mat(tex('agz', 32, 64, function (c, W, H) { c.fillStyle = '#c9905a'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(90,50,20,.25)'; for (var i = 0; i < 60; i++) c.fillRect((i * 13) % W, (i * 29) % H, 3, 2); }), 1, 2), wood = solid('#6a4a2a');
    blob(g, '#e0b884', 0.74, 0.62, 0, 0, 0.006, 3);
    // a low mosque and the tall tapering mud minaret bristling with wooden poles
    box(g, mud, 0.36, 0.06, 0.26, -0.06, 0.006, 0.0);
    for (var c = 0; c < 6; c++) box(g, mud, 0.02, 0.02, 0.02, -0.22 + c * 0.065, 0.066, 0.12);
    var mn = new T.Mesh(new T.CylinderGeometry(0.035, 0.09, 0.5, 4), mud); mn.rotation.y = Math.PI / 4; mn.position.set(0.15, 0.256, -0.02); g.add(mn);
    for (var l = 0; l < 12; l++) { var y = 0.06 + l * 0.036, r = 0.09 - l * 0.0046; for (var s = 0; s < 4; s++) { var a = s / 4 * D2 + (l % 2) * 0.4, p = new T.Mesh(new T.CylinderGeometry(0.003, 0.003, 0.06, 4), wood); p.rotation.z = Math.PI / 2; p.rotation.y = a; p.position.set(0.15 + Math.cos(a) * r * 0.75, y, -0.02 + Math.sin(a) * r * 0.75); g.add(p); } }
    box(g, mud, 0.05, 0.03, 0.05, 0.15, 0.506, -0.02);
    // town houses, a camel, acacias
    for (var h = 0; h < 7; h++) { var x = -0.45 + (h % 4) * 0.12, z = 0.25 + Math.floor(h / 4) * 0.14 + hash(h, 3) * 0.04; box(g, solid(h % 2 ? '#c9905a' : '#b8804a'), 0.09, 0.05, 0.08, x, 0.006, z); box(g, solid('#3a2a1a'), 0.015, 0.025, 0.003, x, 0.006, z + 0.041); }
    var cm = new T.Group(), cb = solid('#c9a070'); box(cm, cb, 0.02, 0.02, 0.06, 0, 0.04, 0); var hump = new T.Mesh(new T.SphereGeometry(0.016, 6, 4), cb); hump.position.y = 0.062; cm.add(hump); [[0.007, 0.022], [-0.007, 0.022], [0.007, -0.022], [-0.007, -0.022]].forEach(function (q) { box(cm, cb, 0.005, 0.04, 0.005, q[0], 0, q[1]); }); box(cm, cb, 0.01, 0.035, 0.01, 0, 0.05, 0.035); cm.position.set(0.4, 0.006, 0.25); cm.rotation.y = 0.6; g.add(cm);
    if (K.acacia) { K.acacia(g, -0.45, -0.3, 1); K.acacia(g, 0.45, -0.28, 0.9); }
    return g;
  };

  /* ---------- Ha'amonga 'a Maui ---------- */
  M.custom.haamonga = function () {
    var g = new T.Group(), coral = mat(stoneTex('hmm', '#b8b0a0', '#988e7e', 4, 4), 1, 1);
    blob(g, '#5fa04a', 0.74, 0.62, 0, 0, 0.006, 3);
    // the trilithon: two huge upright coral stones and a lintel slotted on top
    [-0.1, 0.1].forEach(function (x) { var s = new T.Mesh(new T.BoxGeometry(0.08, 0.3, 0.07, 2, 3, 2), coral); var p = s.geometry.attributes.position; for (var i = 0; i < p.count; i++) p.setX(i, p.getX(i) * (1 + noise(i, x * 10) * 0.12)); s.geometry.computeVertexNormals(); s.position.set(x, 0.156, 0); g.add(s); });
    box(g, coral, 0.32, 0.05, 0.06, 0, 0.29, 0);
    // a path through the grass, and palms all around
    var path = new T.Mesh(new T.PlaneGeometry(0.08, 0.5), solid('#c9b890')); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.008, 0.25); g.add(path);
    for (var t = 0; t < 12; t++) { var a = t / 12 * D2; if (Math.sin(a) > 0.7) continue; palm(g, Math.cos(a) * (0.42 + hash(t, 1) * 0.15), Math.sin(a) * (0.36 + hash(t, 2) * 0.1), 1.3 + hash(t, 3) * 0.4); }
    return g;
  };

  /* ---------- Castillo San Felipe del Morro ---------- */
  M.custom.elmorro = function () {
    var g = new T.Group(), st = mat(stoneTex('emo', '#c9b89a', '#a8987a', 8, 4), 2, 1), grass = solid('#6aaa4a');
    blob(g, '#2f8fc0', 0.74, 0.62, 0, 0, 0.006, 6);
    // the big green lawn on the headland
    blob(g, '#6aaa4a', 0.5, 0.3, -0.1, -0.25, 0.012, 3);
    // stepped triangular fort pointing out to sea, layer on layer
    for (var l = 0; l < 4; l++) { var sh = new T.Shape(), s = 1 - l * 0.18; sh.moveTo(-0.28 * s, -0.12 * s); sh.lineTo(0.28 * s, -0.12 * s); sh.lineTo(0.36 * s, 0.1 * s); sh.lineTo(0.0, 0.3 * s); sh.lineTo(-0.36 * s, 0.1 * s); sh.lineTo(-0.28 * s, -0.12 * s);
      var m = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false }), st); m.rotation.x = -Math.PI / 2; m.position.set(0.05, 0.012 + l * 0.05, 0.1 - l * 0.02); g.add(m); }
    // little round sentry boxes (garitas) on the corners
    [[0.43, 0.0], [-0.33, 0.0], [0.05, -0.32]].forEach(function (q) { cyl(g, solid('#e8dcc4'), 0.02, 0.02, 0.04, q[0], 0.062, q[1], 8); domeOn(g, solid('#e8dcc4'), 0.022, 0.025, q[0], 0.102, q[1], 8); });
    // lighthouse and flag on top
    box(g, solid('#e8dcc4'), 0.04, 0.12, 0.04, 0.05, 0.212, 0.0); cyl(g, solid('#5a5a5a'), 0.02, 0.02, 0.02, 0.05, 0.332, 0.0, 8);
    cyl(g, solid('#dddddd'), 0.003, 0.003, 0.1, -0.05, 0.212, 0.02, 4); box(g, solid('#c8102e'), 0.05, 0.03, 0.003, -0.025, 0.282, 0.02);
    // kites flying over the lawn, as families do here
    [['#e8c34a', -0.3, -0.35], ['#d04a2a', 0.0, -0.4]].forEach(function (k) { var kt = new T.Mesh(new T.OctahedronGeometry(0.018, 0), solid(k[0])); kt.scale.z = 0.2; kt.position.set(k[1], 0.3, k[2]); g.add(kt); });
    return g;
  };

  /* ---------- Laas Geel ---------- */
  M.custom.laasgeel = function () {
    var g = new T.Group(), granite = solid('#c9a080', { flatShading: true });
    blob(g, '#c9a878', 0.74, 0.62, 0, 0, 0.006, 3);
    // granite outcrops with shallow rock shelters
    var shelf = new T.Group();
    var rock = new T.Mesh(new T.IcosahedronGeometry(0.25, 1), granite); var p = rock.geometry.attributes.position; for (var i = 0; i < p.count; i++) { if (p.getY(i) < -0.05) p.setY(i, -0.05); if (p.getZ(i) > 0.12) p.setZ(i, 0.12); } rock.geometry.computeVertexNormals(); rock.scale.set(1.3, 0.9, 0.9); rock.position.set(0, 0.05, -0.15); g.add(rock);
    // the cave ceiling painted with cattle in red, white and yellow
    var art = mat(tex('laas', 128, 64, function (c, W, H) { c.fillStyle = '#c9a080'; c.fillRect(0, 0, W, H);
      var cols = ['#b8402a', '#f2ece0', '#e8c34a', '#8a3a2a'];
      for (var k = 0; k < 7; k++) { var x = 8 + (k % 4) * 30, y = 10 + Math.floor(k / 4) * 30; c.fillStyle = cols[k % 4]; c.beginPath(); c.ellipse(x + 10, y + 8, 10, 6, 0, 0, D2); c.fill(); c.fillRect(x + 2, y + 12, 2, 8); c.fillRect(x + 16, y + 12, 2, 8); c.beginPath(); c.arc(x + 22, y + 4, 3, 0, D2); c.fill(); c.strokeStyle = cols[(k + 1) % 4]; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 18, y); c.quadraticCurveTo(x + 24, y - 8, x + 30, y - 2); c.stroke(); c.fillStyle = '#5a2a1a'; c.fillRect(x + 6, y + 18, 2, 6); }
      c.fillStyle = '#5a2a1a'; for (var f = 0; f < 3; f++) { c.fillRect(100 + f * 8, 44, 2, 12); c.beginPath(); c.arc(101 + f * 8, 42, 2, 0, D2); c.fill(); } }), 1, 1);
    var wall = new T.Mesh(new T.PlaneGeometry(0.38, 0.18), art); wall.position.set(0, 0.12, -0.0); g.add(wall);
    var over = new T.Mesh(new T.BoxGeometry(0.44, 0.04, 0.12), granite); over.position.set(0, 0.23, 0.02); over.rotation.x = 0.1; g.add(over);
    for (var r = 0; r < 5; r++) { var sm = new T.Mesh(new T.IcosahedronGeometry(0.05 + hash(r, 1) * 0.04, 0), granite); sm.position.set([-0.5, 0.45, -0.35, 0.4, 0.55][r], 0.03, [0.2, 0.25, 0.4, -0.35, 0.05][r]); g.add(sm); }
    if (K.acacia) { K.acacia(g, -0.3, 0.3, 1.1); K.acacia(g, 0.28, 0.4, 0.9); }
    return g;
  };

  /* ---------- Itaipu Dam ---------- */
  M.custom.itaipu = function () {
    var g = new T.Group(), conc = solid('#c9c8c2'), concD = solid('#a8a7a2');
    blob(g, '#4f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    // reservoir behind, river below
    var res = new T.Mesh(new T.PlaneGeometry(1.1, 0.42), solid('#3f7aa0')); res.rotation.x = -Math.PI / 2; res.position.set(0, 0.1, -0.3); res.scale.set(0.82, 0.85, 1); g.add(res);
    var riv = new T.Mesh(new T.PlaneGeometry(0.22, 0.4), solid('#5a8aa0')); riv.rotation.x = -Math.PI / 2; riv.position.set(0.05, 0.01, 0.35); g.add(riv);
    // the long dam wall with buttresses, the spillway stair and the power-house
    box(g, conc, 1.0, 0.14, 0.05, 0, 0.006, -0.1);
    for (var b = 0; b < 18; b++) box(g, concD, 0.025, 0.12, 0.06, -0.47 + b * 0.055, 0.006, -0.05);
    box(g, solid('#e8e6e0'), 0.24, 0.03, 0.1, 0.05, 0.006, 0.02);
    for (var p = 0; p < 6; p++) { var pipe = new T.Mesh(new T.CylinderGeometry(0.01, 0.01, 0.13, 6), solid('#7a8a9a')); pipe.rotation.x = 0.8; pipe.position.set(-0.06 + p * 0.045, 0.08, -0.04); g.add(pipe); }
    // spillway on one side with white water rushing down
    var sp = new T.Mesh(new T.PlaneGeometry(0.14, 0.3), solid('#eef6fa')); sp.rotation.x = -1.0; sp.position.set(-0.36, 0.07, 0.03); g.add(sp);
    // power lines leading off
    for (var t = 0; t < 3; t++) { var tw = new T.Mesh(new T.ConeGeometry(0.02, 0.1, 4), solid('#888')); tw.position.set(0.4, 0.056, 0.15 + t * 0.12); g.add(tw); }
    for (var r = 0; r < 10; r++) { var a = r / 10 * D2; if (Math.sin(a) < 0) continue; tree(g, Math.cos(a) * 0.55, Math.sin(a) * 0.45, 1.1, '#2f7a35'); }
    return g;
  };
})();
