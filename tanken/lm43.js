/* Detailed landmarks, batch 43: Mount Kenya, Citadel of Aleppo, Sky Tower (Auckland), Sultan Abdul Samad Building,
   Rijksmuseum, Three Rondavels (Blyde River Canyon), Chapel Bridge (Lucerne), Grand-Place (Brussels). */
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
  function gable(g, m, w, h, d, x, y, z) { // a stepped Flemish gable front (flat, facing +z)
    var sh = new T.Shape(), st = 4, sw = w / 2 / st; sh.moveTo(-w / 2, 0); for (var i = 0; i < st; i++) { sh.lineTo(-w / 2 + i * sw, i * h / st + h / st); sh.lineTo(-w / 2 + (i + 1) * sw, i * h / st + h / st); } for (var j = st - 1; j >= 0; j--) { sh.lineTo(w / 2 - j * sw, j * h / st + h / st); sh.lineTo(w / 2 - j * sw, j * h / st); } sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0);
    var gm = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }), m); gm.position.set(x, y, z - d / 2); g.add(gm); return gm;
  }

  /* ---------- Mount Kenya ---------- */
  M.custom.mountkenya = function () {
    var g = new T.Group();
    blob(g, '#6a9a4a', 0.8, 0.66, 0, 0, 0.006, 3);
    // a wide old volcano: forest below, moorland, then sharp rocky peaks (Batian and Nelion) with small glaciers, right on the equator
    mountain(g, { r: function (t) { return 0.38 * Math.pow(1 - t, 1.4) + 0.02; }, h: 0.28, seg: 36, bump: 0.2, seed: 4, colour: function (x, y) { return y > 0.2 ? '#7a7270' : y > 0.12 ? '#a8a070' : y > 0.05 ? '#3f7a35' : '#4f8a3f'; } });
    [[0, 0, 0.42, 0.075], [0.05, 0.03, 0.36, 0.055], [-0.06, 0.03, 0.33, 0.05]].forEach(function (q, i) { mountain(g, { r: function (t) { return q[3] * (1 - t) + 0.004; }, h: q[2] - 0.2, pos: [q[0], q[1]], seg: 7, rings: 6, bump: 0.5, jag: 0.02, seed: 9 + i, colour: function (x, y) { return y > (q[2] - 0.2) * 0.7 ? '#f4f7fa' : '#5a524e'; } }).position.y = 0.2; });
    // giant groundsels and lobelias: strange tall plants that only grow high on African mountains
    for (var k = 0; k < 9; k++) { var a = k / 9 * D2 + 0.4, r = 0.3 + 0.03 * hash(k, 2), x = Math.cos(a) * r, z = Math.sin(a) * r * 0.85;
      if (k % 2) { cyl(g, solid('#6a5a48'), 0.006, 0.008, 0.07, x, 0.006, z, 6); ball(g, solid('#4f8a3f', { flatShading: true }), 0.022, x, 0.085, z, 1, 0.6, 1); }
      else { cyl(g, solid('#5f8a4f'), 0.01, 0.012, 0.08, x, 0.006, z, 6); cone(g, solid('#7aa060', { flatShading: true }), 0.012, 0.03, x, 0.086, z, 6); } }
    // a hikers' hut and the Equator sign
    box(g, solid('#a8402a'), 0.04, 0.025, 0.03, 0.2, 0.06, 0.22); var sg = new T.Group(); sg.position.set(-0.3, 0.006, 0.3); g.add(sg); cyl(sg, solid('#6a4a2a'), 0.002, 0.002, 0.05, -0.012, 0, 0, 4); cyl(sg, solid('#6a4a2a'), 0.002, 0.002, 0.05, 0.012, 0, 0, 4); box(sg, solid('#f2c14e'), 0.04, 0.016, 0.004, 0, 0.04, 0);
    return g;
  };

  /* ---------- Citadel of Aleppo ---------- */
  M.custom.aleppo = function () {
    var g = new T.Group(), st = mat(stoneTex('alp', '#d8c49a', '#b0a078', 10, 5), 3, 1), s2 = solid('#c8b488', { flatShading: true });
    blob(g, '#d8c8a0', 0.8, 0.66, 0, 0, 0.006, 6);
    // a huge oval hill with a stone-paved glacis slope, a deep moat, and the walled castle on top — one of the oldest and biggest in the world
    var moat = new T.Mesh(new T.CylinderGeometry(0.34, 0.34, 0.004, 28), solid('#8a7a5a')); moat.scale.z = 0.8; moat.position.y = 0.008; g.add(moat);
    var hill = new T.Mesh(new T.CylinderGeometry(0.22, 0.3, 0.12, 24, 3), st); hill.scale.z = 0.8; hill.position.y = 0.066; g.add(hill);
    var wl = new T.Mesh(new T.CylinderGeometry(0.215, 0.215, 0.05, 24, 1, true), st); wl.scale.z = 0.8; wl.position.y = 0.151; g.add(wl);
    for (var t = 0; t < 12; t++) { var a = t / 12 * D2, x = Math.cos(a) * 0.215, z = Math.sin(a) * 0.172; box(g, s2, 0.04, 0.07, 0.04, x, 0.126, z); for (var c = 0; c < 2; c++) box(g, s2, 0.012, 0.012, 0.012, x + (c - 0.5) * 0.02, 0.196, z); }
    // the great gate tower reached by a long stone bridge on arches
    var gt = new T.Group(); gt.position.set(0, 0.006, 0.12); g.add(gt);
    box(gt, st, 0.1, 0.22, 0.06, 0, 0, 0.02); for (var k = 0; k < 5; k++) box(gt, s2, 0.014, 0.014, 0.014, -0.04 + k * 0.02, 0.22, 0.05);
    var dr = new T.Mesh(new T.PlaneGeometry(0.03, 0.05), solid('#3a2a20')); dr.position.set(0, 0.15, 0.0505); gt.add(dr);
    var br = new T.Group(); br.position.set(0, 0, 0.27); g.add(br); box(br, st, 0.04, 0.012, 0.22, 0, 0.13, 0.0); box(br, s2, 0.05, 0.13, 0.04, 0, 0.006, 0.08); box(br, s2, 0.06, 0.17, 0.05, 0, 0.006, -0.04);
    // the mosque minaret and the dome inside the walls, and the old city's houses round about
    cyl(g, s2, 0.012, 0.014, 0.12, -0.08, 0.176, -0.04, 8); var md = new T.Mesh(new T.SphereGeometry(0.035, 12, 6, 0, D2, 0, Math.PI / 2), s2); md.position.set(0.06, 0.176, -0.04); g.add(md);
    for (var h = 0; h < 10; h++) { var a2 = h / 10 * D2, r2 = 0.37; box(g, solid('#e2d4b4'), 0.05, 0.03 + hash(h, 2) * 0.02, 0.05, Math.cos(a2) * r2, 0.006, Math.sin(a2) * r2 * 0.85); }
    return g;
  };

  /* ---------- Sky Tower (Auckland) ---------- */
  M.custom.skytower = function () {
    var g = new T.Group(), conc = solid('#e2e2de'), glass = mat(winTex('skt', '#8ab0c8', '#4a6a80', 6, 3, { tall: 0.8 }), 4, 1);
    var sea = new T.Mesh(new T.PlaneGeometry(1.0, 0.26), solid('#3a8ac0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.007, 0.34); g.add(sea);
    blob(g, '#8a9a8a', 0.76, 0.34, 0, -0.14, 0.006, 4);
    // a 328 m tower — the tallest in the southern hemisphere — with a pod near the top (people jump off it on a wire!)
    var sh = lathe([[0.03, 0], [0.026, 0.1], [0.02, 0.3], [0.018, 0.42], [0, 0.42]], 10, conc); sh.position.y = 0.006; g.add(sh);
    for (var l = 0; l < 3; l++) { var leg = new T.Mesh(new T.CylinderGeometry(0.006, 0.01, 0.12, 6), conc); var a = l / 3 * D2; leg.position.set(Math.cos(a) * 0.035, 0.06, Math.sin(a) * 0.035); leg.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25); g.add(leg); }
    var pod = lathe([[0.018, 0], [0.05, 0.01], [0.058, 0.03], [0.055, 0.05], [0.04, 0.065], [0.02, 0.075], [0.018, 0.08]], 16, conc); pod.position.y = 0.4; g.add(pod);
    var gl = new T.Mesh(new T.CylinderGeometry(0.058, 0.055, 0.02, 16, 1, true), glass); gl.position.y = 0.44; g.add(gl);
    cyl(g, conc, 0.008, 0.012, 0.08, 0, 0.48, 0, 8); cyl(g, solid('#c0392b'), 0.002, 0.003, 0.08, 0, 0.56, 0, 5);
    // the SkyJump: a tiny person on a wire, and the city and harbour round it
    var ln = new T.Mesh(new T.CylinderGeometry(0.0007, 0.0007, 0.3, 3), solid('#3a3a3a')); ln.position.set(0.07, 0.29, 0.02); g.add(ln); person(g, 0.07, 0.02, 0.6, '#e8473a'); g.children[g.children.length - 1].position.y += 0.22; g.children[g.children.length - 2].position.y += 0.22;
    for (var b = 0; b < 12; b++) { var bx = -0.32 + (b % 6) * 0.13, bz = -0.3 + Math.floor(b / 6) * 0.14; if (Math.abs(bx) < 0.08 && Math.abs(bz) < 0.1) continue; box(g, mat(winTex('akl' + (b % 3), ['#d8dce0', '#8aa0b0', '#e8e0d0'][b % 3], '#5a6878', 3, 5), 1, 2), 0.05, 0.08 + hash(b, 2) * 0.12, 0.05, bx, 0.006, bz); }
    for (var y = 0; y < 4; y++) { var bt = new T.Mesh(new T.ConeGeometry(0.008, 0.04, 3), solid('#f2ece0')); bt.position.set(-0.3 + y * 0.18, 0.03, 0.34 + (y % 2) * 0.05); g.add(bt); var hl = new T.Mesh(new T.BoxGeometry(0.03, 0.008, 0.01), solid('#f2ece0')); hl.position.set(-0.3 + y * 0.18, 0.01, 0.34 + (y % 2) * 0.05); g.add(hl); } // sailing boats: Auckland is the "City of Sails"
    return g;
  };

  /* ---------- Sultan Abdul Samad Building (Kuala Lumpur) ---------- */
  M.custom.abdulsamad = function () {
    var g = new T.Group(), brick = mat(tex('asb', 64, 64, function (x, w, h) { x.fillStyle = '#c86a3a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2ece0'; for (var y = 6; y < h; y += 14) x.fillRect(0, y, w, 3); for (var c = 0; c < 4; c++) { x.fillStyle = '#f2ece0'; x.beginPath(); x.arc(8 + c * 16, 30, 6, Math.PI, 0); x.fill(); x.fillStyle = '#3a2a20'; x.fillRect(4 + c * 16, 30, 8, 14); x.beginPath(); x.arc(8 + c * 16, 30, 4, Math.PI, 0); x.fill(); } }), 4, 1);
    var copper = solid('#3f8a6a', { flatShading: true }), wht = solid('#f2ece0');
    blob(g, '#c8c0b0', 0.8, 0.64, 0, 0, 0.006, 4);
    // red-brick arches with white stripes, copper onion domes, and a 41 m clock tower in the middle (1897)
    box(g, brick, 0.5, 0.1, 0.1, 0, 0.006, -0.1); box(g, brick, 0.5, 0.008, 0.1, 0, 0.106, -0.1);
    for (var c = 0; c < 10; c++) cyl(g, wht, 0.004, 0.004, 0.09, -0.225 + c * 0.05, 0.006, -0.048, 6);
    var tw = new T.Group(); tw.position.set(0, 0.006, -0.08); g.add(tw);
    box(tw, brick, 0.07, 0.24, 0.07, 0, 0, 0); cyl(tw, wht, 0.04, 0.04, 0.03, 0, 0.24, 0, 8, Math.PI / 8);
    [[0, 0.036], [0.036, 0], [0, -0.036], [-0.036, 0]].forEach(function (q, i) { var ck = new T.Mesh(new T.CircleGeometry(0.018, 14), wht); ck.position.set(q[0] * 1.02, 0.2, q[1] * 1.02); ck.rotation.y = [0, Math.PI / 2, Math.PI, -Math.PI / 2][i]; tw.add(ck); });
    var dm = lathe([[0.04, 0], [0.048, 0.02], [0.04, 0.045], [0.02, 0.065], [0.006, 0.08], [0, 0.09]], 16, copper); dm.position.y = 0.27; tw.add(dm);
    [-0.2, -0.1, 0.1, 0.2].forEach(function (x) { cyl(g, wht, 0.016, 0.016, 0.03, x, 0.114, -0.1, 8); var d = lathe([[0.018, 0], [0.022, 0.012], [0.016, 0.028], [0, 0.045]], 10, copper); d.position.set(x, 0.144, -0.1); g.add(d); });
    // Merdeka Square's big lawn and the tall flagpole in front
    var lw = new T.Mesh(new T.PlaneGeometry(0.6, 0.24), solid('#6ab04f')); lw.rotation.x = -Math.PI / 2; lw.position.set(0, 0.009, 0.18); g.add(lw);
    cyl(g, solid('#d8d8d8'), 0.002, 0.003, 0.3, 0.2, 0.009, 0.24, 5);
    var fl = tex('mysflag', 32, 16, function (x, w, h) { for (var i = 0; i < 14; i++) { x.fillStyle = i % 2 ? '#ffffff' : '#cc0000'; x.fillRect(0, i * h / 14, w, h / 14 + 1); } x.fillStyle = '#010066'; x.fillRect(0, 0, 16, 9); x.fillStyle = '#ffcc00'; x.beginPath(); x.arc(7, 4.5, 3, 0, D2); x.fill(); x.fillStyle = '#010066'; x.beginPath(); x.arc(8, 4.5, 2.5, 0, D2); x.fill(); });
    var fm = new T.Mesh(new T.PlaneGeometry(0.06, 0.03), new T.MeshLambertMaterial({ map: fl, side: T.DoubleSide })); fm.position.set(0.23, 0.29, 0.24); g.add(fm);
    for (var t = 0; t < 5; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#3f8a3f', { flatShading: true })); tr.position.set(-0.3 + t * 0.15, 0.05, 0.32); g.add(tr); }
    return g;
  };

  /* ---------- Rijksmuseum (Amsterdam) ---------- */
  M.custom.rijksmuseum = function () {
    var g = new T.Group(), brick = mat(winTex('rjk', '#a8503a', '#4a5a68', 6, 3, { tall: 0.6, band: '#e8dcc0' }), 3, 1), roof = solid('#4a5058', { flatShading: true }), gold = solid('#d8ad4c'), stone = solid('#e8dcc0');
    blob(g, '#9a9a90', 0.8, 0.64, 0, 0, 0.006, 3);
    var canal = new T.Mesh(new T.PlaneGeometry(1.0, 0.1), solid('#4a7aa0')); canal.rotation.x = -Math.PI / 2; canal.position.set(0, 0.009, -0.33); g.add(canal);
    // a big red-brick palace of art (1885), with two pointed towers and steep slate roofs — the passage under it is a cycle path!
    box(g, brick, 0.54, 0.13, 0.18, 0, 0.006, -0.12); hipRoof(g, roof, 0.54, 0.18, 0.06, 0, 0.136, -0.12, 0.006);
    [-0.06, 0.06].forEach(function (x) { box(g, brick, 0.06, 0.2, 0.06, x, 0.006, -0.03); var sp = new T.Mesh(new T.ConeGeometry(0.045, 0.1, 4), roof); sp.rotation.y = Math.PI / 4; sp.position.set(x, 0.256, -0.03); g.add(sp); cyl(g, gold, 0.002, 0.002, 0.02, x, 0.306, -0.03, 4); });
    box(g, brick, 0.06, 0.15, 0.06, 0, 0.006, -0.03);
    var tn = new T.Mesh(new T.PlaneGeometry(0.05, 0.07), solid('#2a2a30')); tn.position.set(0, 0.04, 0.0005); g.add(tn);
    // bikes riding through the passage, the I amsterdam letters and the pool in front
    for (var b = 0; b < 3; b++) { var bk = new T.Group(); bk.position.set(-0.01 + b * 0.012, 0.006, 0.04 + b * 0.05); g.add(bk); [-0.008, 0.008].forEach(function (z) { var wh = new T.Mesh(new T.TorusGeometry(0.006, 0.0012, 4, 10), solid('#2a2a2a')); wh.rotation.y = Math.PI / 2; wh.position.set(0, 0.006, z); bk.add(wh); }); person(bk, 0, 0, 0.6, ['#e8473a', '#2b6fd6', '#f2c14e'][b]); }
    var pool = new T.Mesh(new T.PlaneGeometry(0.4, 0.1), solid('#6ab0d8')); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.01, 0.24); g.add(pool);
    var lt = tex('iams', 128, 32, function (x, w, h) { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.font = 'bold 24px sans-serif'; x.textBaseline = 'middle'; x.fillStyle = '#e8262a'; x.fillText('I', 4, 17); x.fillText('am', 18, 17); x.fillStyle = '#ffffff'; x.fillStyle = '#e8262a'; x.fillText('sterdam', 52, 17); });
    var lm = new T.Mesh(new T.BoxGeometry(0.3, 0.035, 0.02), [stone, stone, stone, stone, new T.MeshLambertMaterial({ map: lt }), stone]); lm.position.set(0, 0.026, 0.16); g.add(lm);
    for (var t = 0; t < 6; t++) tree(g, -0.32 + t * 0.13, 0.33, 1.0, '#4f8a3f');
    return g;
  };

  /* ---------- Three Rondavels (Blyde River Canyon) ---------- */
  M.custom.rondavels = function () {
    var g = new T.Group();
    blob(g, '#6a9a4a', 0.8, 0.66, 0, 0, 0.006, 5);
    // a deep green canyon with a river and dam lake at the bottom…
    var lk = new T.Mesh(new T.CircleGeometry(0.2, 20), solid('#3a7ab0')); lk.rotation.x = -Math.PI / 2; lk.scale.y = 0.5; lk.position.set(0, 0.009, 0.18); g.add(lk);
    // …and three round rock peaks with green tops, shaped like the round huts (rondavels) of southern Africa
    [[-0.17, -0.05, 0.07], [0, -0.08, 0.075], [0.17, -0.05, 0.07]].forEach(function (q, i) {
      var hut = new T.Group(); hut.position.set(q[0], 0.006, q[1]); g.add(hut);
      var bs = new T.Mesh(new T.CylinderGeometry(q[2] * 1.1, q[2] * 1.6, 0.12, 12, 3), solid('#c8804a', { flatShading: true })); bs.position.y = 0.06; hut.add(bs);
      var p = bs.geometry.attributes.position; for (var k = 0; k < p.count; k++) { var y = p.getY(k); p.setX(k, p.getX(k) * (1 + (hash(k, i) - 0.5) * 0.1)); } bs.geometry.computeVertexNormals();
      for (var s = 0; s < 3; s++) { var band = new T.Mesh(new T.CylinderGeometry(q[2] * (1.12 + s * 0.15), q[2] * (1.12 + s * 0.15), 0.006, 12), solid(s % 2 ? '#a85a3a' : '#e8b080')); band.position.y = 0.03 + s * 0.03; hut.add(band); }
      var tw = new T.Mesh(new T.CylinderGeometry(q[2] * 0.7, q[2], 0.06, 12), solid('#b87050', { flatShading: true })); tw.position.y = 0.15; hut.add(tw);
      var tp = new T.Mesh(new T.ConeGeometry(q[2] * 0.85, 0.06, 12), solid('#4f8a3f', { flatShading: true })); tp.position.y = 0.21; hut.add(tp);
    });
    // canyon walls behind, a viewpoint railing in front, and aloe plants
    [-0.3, -0.12, 0.06, 0.24].forEach(function (x, i) { mountain(g, { r: function (t) { return 0.12 * (1 - t) + 0.03; }, h: 0.16 + 0.04 * (i % 2), pos: [x, -0.36], seg: 10, rings: 8, bump: 0.25, seed: 2 + i, colour: function (x, y) { return y > 0.13 ? '#5f8a3f' : Math.sin(y * 90) > 0.3 ? '#a85a3a' : '#c8804a'; } }); });
    for (var f = 0; f < 10; f++) box(g, solid('#6a4a2a'), 0.003, 0.025, 0.003, -0.2 + f * 0.045, 0.006, 0.32); box(g, solid('#6a4a2a'), 0.42, 0.003, 0.003, 0, 0.03, 0.32);
    for (var a = 0; a < 4; a++) { var ax = -0.33 + a * 0.22; for (var l = 0; l < 6; l++) { var lf = new T.Mesh(new T.ConeGeometry(0.004, 0.04, 3), solid('#5f8a5a')); lf.position.set(ax, 0.026, 0.27); lf.rotation.z = Math.cos(l) * 0.6; lf.rotation.x = Math.sin(l) * 0.6; g.add(lf); } cone(g, solid('#e8582a'), 0.005, 0.03, ax, 0.04, 0.27, 5); }
    return g;
  };

  /* ---------- Chapel Bridge (Lucerne) ---------- */
  M.custom.chapelbridge = function () {
    var g = new T.Group(), wood = solid('#8a5a32', { flatShading: true }), roof = solid('#a8452e', { flatShading: true }), st = mat(stoneTex('kpb', '#b8a888', '#8a7a60', 10, 6), 1, 2), flower = solid('#e8303a');
    var lake = new T.Mesh(new T.CircleGeometry(0.48, 28), solid('#4a9ac0')); lake.rotation.x = -Math.PI / 2; lake.scale.y = 0.8; lake.position.y = 0.006; g.add(lake);
    // a long covered wooden footbridge (1365) crossing the river at an angle, with red geraniums along its sides…
    var br = new T.Group(); br.rotation.y = 0.5; g.add(br);
    box(br, wood, 0.72, 0.008, 0.04, 0, 0.03, 0);
    for (var p = 0; p < 12; p++) { var x = -0.34 + p * 0.062; cyl(br, wood, 0.003, 0.003, 0.03, x, 0.006, 0.0, 5); [-0.019, 0.019].forEach(function (z) { cyl(br, wood, 0.0018, 0.0018, 0.03, x, 0.038, z, 4); }); }
    var rf = new T.Group(); rf.position.y = 0.068; br.add(rf); ridge(rf, roof, 0.05, 0.022, 0.72, 0, 0, 0, Math.PI / 2);
    [-0.02, 0.02].forEach(function (z) { box(br, flower, 0.72, 0.006, 0.006, 0, 0.04, z * 1.15); });
    // …and the stone octagonal Water Tower standing in the water beside it
    var wt = new T.Group(); wt.position.set(0.05, 0.006, 0.05); g.add(wt);
    cyl(wt, st, 0.045, 0.05, 0.16, 0, 0, 0, 8); var tr2 = new T.Mesh(new T.ConeGeometry(0.06, 0.06, 8), roof); tr2.position.y = 0.19; wt.add(tr2); var tr3 = new T.Mesh(new T.ConeGeometry(0.02, 0.05, 8), roof); tr3.position.y = 0.245; wt.add(tr3);
    // the old town on the bank with painted houses and church towers, and the mountains (Pilatus) behind
    var cols = ['#f2e2c0', '#e8b8a0', '#c8d8e8', '#f2d8a0', '#d0e0c0'];
    for (var h = 0; h < 7; h++) { var hx = -0.36 + h * 0.11, hz = -0.32; box(g, mat(winTex('lch' + (h % 5), cols[h % 5], '#4a5868', 3, 3), 1, 1), 0.09, 0.09 + (h % 2) * 0.03, 0.08, hx, 0.006, hz); hipRoof(g, roof, 0.09, 0.08, 0.04, hx, 0.096 + (h % 2) * 0.03, hz, 0.005); }
    [-0.1, -0.04].forEach(function (x) { box(g, st, 0.03, 0.2, 0.03, x, 0.006, -0.4); cone(g, solid('#3a5a4a'), 0.025, 0.08, x, 0.206, -0.4, 8); });
    mountain(g, { r: function (t) { return 0.26 * (1 - t) + 0.01; }, h: 0.3, pos: [0.28, -0.42], bump: 0.3, jag: 0.03, seed: 6, colour: function (x, y) { return y > 0.24 ? '#f4f7fa' : y > 0.1 ? '#6a7a6a' : '#3f7a35'; } });
    for (var s = 0; s < 4; s++) { var sw = new T.Group(); sw.position.set(-0.2 + s * 0.08, 0.008, 0.28); g.add(sw); ball(sw, solid('#ffffff'), 0.008, 0, 0.004, 0, 1.4, 0.7, 0.9); cyl(sw, solid('#ffffff'), 0.002, 0.002, 0.014, 0.008, 0.004, 0, 4); } // swans
    return g;
  };

  /* ---------- Grand-Place (Brussels) ---------- */
  M.custom.grandplace = function () {
    var g = new T.Group(), st = mat(stoneTex('gpl', '#c8b890', '#a89870', 12, 8), 1, 2), gold = solid('#d8ad4c'), dark = solid('#3a3a3a', { flatShading: true });
    blob(g, '#a8a090', 0.8, 0.66, 0, 0, 0.006, 4);
    // the square: grey cobbles and a big carpet of flowers (every two years)
    var sq = new T.Mesh(new T.PlaneGeometry(0.46, 0.4), solid('#9a948a')); sq.rotation.x = -Math.PI / 2; sq.position.set(0, 0.008, 0.02); g.add(sq);
    var ft = tex('gpfl', 64, 64, function (x, w, h) { var c = ['#e8303a', '#f2c14e', '#ffffff', '#c03a8a', '#3a8a4a']; for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++) { x.fillStyle = c[(i * 3 + j * 2 + ((i - 4) * (i - 4) + (j - 4) * (j - 4) < 6 ? 2 : 0)) % 5]; x.fillRect(i * 8, j * 8, 8, 8); } });
    var fc = new T.Mesh(new T.PlaneGeometry(0.24, 0.2), new T.MeshLambertMaterial({ map: ft })); fc.rotation.x = -Math.PI / 2; fc.position.set(0, 0.01, 0.04); g.add(fc);
    // the gothic Town Hall with its 96 m lace-like spire topped by a golden Saint Michael
    var th = new T.Group(); th.position.set(0, 0.006, -0.22); g.add(th);
    box(th, mat(winTex('gpth', '#c8b890', '#4a4a4a', 8, 3, { tall: 0.6 }), 3, 1), 0.36, 0.11, 0.06, 0, 0, 0); var r = new T.Group(); r.position.y = 0.11; th.add(r); ridge(r, dark, 0.06, 0.05, 0.36, 0, 0, 0, Math.PI / 2);
    for (var k = 0; k < 9; k++) cone(th, dark, 0.004, 0.02, -0.16 + k * 0.04, 0.11, 0.03, 4);
    box(th, st, 0.05, 0.22, 0.05, 0, 0, 0.0); for (var l = 0; l < 3; l++) cyl(th, st, 0.022 - l * 0.005, 0.025 - l * 0.005, 0.05, 0, 0.22 + l * 0.05, 0, 8);
    cone(th, st, 0.012, 0.05, 0, 0.37, 0, 8); ball(th, gold, 0.006, 0, 0.43, 0);
    // the guild houses: tall gabled fronts covered in gold
    [[-0.22, -0.02, Math.PI / 2], [-0.22, 0.12, Math.PI / 2], [0.22, -0.02, -Math.PI / 2], [0.22, 0.12, -Math.PI / 2], [-0.1, 0.24, Math.PI], [0.1, 0.24, Math.PI]].forEach(function (q, i) {
      var hs = new T.Group(); hs.position.set(q[0], 0.006, q[1]); hs.rotation.y = q[2]; g.add(hs);
      box(hs, mat(winTex('gpg' + (i % 3), ['#d8c8a0', '#b8a888', '#c8b08a'][i % 3], '#4a4a4a', 3, 4), 1, 1), 0.1, 0.12, 0.05, 0, 0, 0);
      gable(hs, mat(winTex('gpg' + (i % 3), ['#d8c8a0', '#b8a888', '#c8b08a'][i % 3], '#4a4a4a', 3, 4), 1, 1), 0.1, 0.06, 0.05, 0, 0.12, 0);
      box(hs, gold, 0.1, 0.004, 0.002, 0, 0.12, 0.026); ball(hs, gold, 0.006, 0, 0.19, 0.0);
    });
    for (var p = 0; p < 5; p++) person(g, -0.12 + p * 0.06, 0.18 + (p % 2) * 0.03, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#33a06a', '#ffffff'][p]);
    return g;
  };
})();
