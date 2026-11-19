/* Detailed landmarks, batch 44: Kronborg Castle, Newgrange, Mount Roraima, Strokkur geyser, Lake Retba (Pink Lake),
   Alexander Nevsky Cathedral, Wat Xieng Thong, Punakha Dzong. */
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
  // a low swooping roof (Lao / Bhutanese style): a ridge roof whose eaves come down low and curl up at the ends
  function sweepRoof(g, m, w, d, h, x, y, z, ry) {
    var o = new T.Group(); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o);
    var sh = new T.Shape(); sh.moveTo(-d / 2 - 0.02, -h * 0.25); sh.quadraticCurveTo(-d / 4, h * 0.1, 0, h); sh.quadraticCurveTo(d / 4, h * 0.1, d / 2 + 0.02, -h * 0.25); sh.lineTo(-d / 2 - 0.02, -h * 0.25);
    var geo = new T.ExtrudeGeometry(sh, { depth: w, bevelEnabled: false }), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) { var zz = p.getZ(i) / w * 2 - 1; p.setY(i, p.getY(i) + zz * zz * h * 0.25); } geo.computeVertexNormals();
    var r = new T.Mesh(geo, m); r.rotation.y = Math.PI / 2; r.position.x = -w / 2; o.add(r); return o;
  }

  /* ---------- Kronborg Castle (Helsingør) ---------- */
  M.custom.kronborg = function () {
    var g = new T.Group(), st = mat(winTex('krb', '#d8c8a0', '#4a5868', 6, 3, { tall: 0.55 }), 2, 1), cop = solid('#4f9a7a', { flatShading: true }), gold = solid('#d8ad4c');
    var sea = new T.Mesh(new T.CircleGeometry(0.48, 28), solid('#3a7ab0')); sea.rotation.x = -Math.PI / 2; sea.scale.y = 0.8; sea.position.y = 0.005; g.add(sea);
    // star-shaped grass ramparts with a moat, out on a point where the sea is narrowest (ships once paid a toll here)
    var sh = new T.Shape(); for (var i = 0; i < 10; i++) { var a = i / 10 * D2, r = i % 2 ? 0.2 : 0.3; if (i) sh.lineTo(Math.cos(a) * r, Math.sin(a) * r); else sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    var rp = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.01, bevelSegments: 1 }), solid('#5f9a45', { flatShading: true })); rp.rotation.x = -Math.PI / 2; rp.position.y = 0.006; g.add(rp);
    // the Renaissance castle round a square courtyard, with green copper roofs and spires of different shapes
    var c = new T.Group(); c.position.y = 0.056; g.add(c);
    [[0, -0.08, 0.2, 0.04], [0, 0.08, 0.2, 0.04], [-0.08, 0, 0.04, 0.2], [0.08, 0, 0.04, 0.2]].forEach(function (q) { box(c, st, q[2], 0.08, q[3], q[0], 0, q[1]); hipRoof(c, cop, q[2], q[3], 0.03, q[0], 0.08, q[1], 0.004); });
    box(c, st, 0.05, 0.18, 0.05, -0.1, 0, -0.1); var sp1 = lathe([[0.03, 0], [0.032, 0.02], [0.02, 0.04], [0.024, 0.06], [0.01, 0.09], [0, 0.12]], 8, cop); sp1.position.set(-0.1, 0.18, -0.1); c.add(sp1);
    box(c, st, 0.04, 0.14, 0.04, 0.1, 0, -0.1); cone(c, cop, 0.025, 0.1, 0.1, 0.14, -0.1, 8);
    box(c, st, 0.04, 0.12, 0.04, 0.1, 0, 0.1); var sp3 = lathe([[0.024, 0], [0.026, 0.015], [0.014, 0.035], [0.018, 0.05], [0, 0.08]], 8, cop); sp3.position.set(0.1, 0.12, 0.1); c.add(sp3);
    cyl(c, gold, 0.0015, 0.0015, 0.03, -0.1, 0.3, -0.1, 4);
    // cannons on the ramparts pointing at the sea, a sailing ship passing
    for (var k = 0; k < 6; k++) { var a2 = k / 6 * D2 + 0.3, cn = new T.Mesh(new T.CylinderGeometry(0.003, 0.004, 0.025, 6), solid('#2a2a2a')); cn.rotation.z = Math.PI / 2; cn.rotation.y = -a2; cn.position.set(Math.cos(a2) * 0.24, 0.06, Math.sin(a2) * 0.24); g.add(cn); }
    var sh2 = new T.Group(); sh2.position.set(0.32, 0.006, 0.24); g.add(sh2); box(sh2, solid('#6a4a2a'), 0.08, 0.02, 0.025, 0, 0, 0); cyl(sh2, solid('#6a4a2a'), 0.002, 0.002, 0.08, 0, 0.02, 0, 4); var sl = new T.Mesh(new T.PlaneGeometry(0.04, 0.05), new T.MeshLambertMaterial({ color: '#f6f2e8', side: T.DoubleSide })); sl.position.set(0, 0.06, 0); sl.rotation.y = Math.PI / 2; sh2.add(sl);
    return g;
  };

  /* ---------- Newgrange (Ireland) ---------- */
  M.custom.newgrange = function () {
    var g = new T.Group(), quartz = mat(tex('ngq', 64, 64, function (x, w, h) { x.fillStyle = '#eceae4'; x.fillRect(0, 0, w, h); for (var i = 0; i < 90; i++) { x.fillStyle = Math.random() < 0.2 ? '#6a6a70' : 'rgba(180,180,175,.6)'; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 1.5 + Math.random() * 2, 0, D2); x.fill(); } }), 6, 1);
    blob(g, '#5f9a45', 0.8, 0.66, 0, 0, 0.006, 3);
    // a huge round grassy mound, older than the pyramids (about 5,200 years), with a white quartz wall around the front
    var mound = new T.Mesh(new T.SphereGeometry(0.28, 24, 10, 0, D2, 0, Math.PI / 2), solid('#6aa04f', { flatShading: true })); mound.scale.y = 0.32; mound.position.y = 0.006; g.add(mound);
    var wall = new T.Mesh(new T.CylinderGeometry(0.285, 0.29, 0.05, 30, 1, true, -Math.PI * 0.45, Math.PI * 0.9), quartz); wall.position.y = 0.031; g.add(wall);
    // kerbstones round the bottom, and the big entrance stone carved with spirals
    for (var k = 0; k < 30; k++) { var a = k / 30 * D2, kb = new T.Mesh(new T.BoxGeometry(0.035, 0.02, 0.02), solid('#8a8a80', { flatShading: true })); kb.position.set(Math.sin(a) * 0.3, 0.016, Math.cos(a) * 0.3); kb.rotation.y = a; g.add(kb); }
    var spT = tex('ngsp', 64, 32, function (x, w, h) { x.fillStyle = '#8a8a80'; x.fillRect(0, 0, w, h); x.strokeStyle = '#4a4a44'; x.lineWidth = 2; [[16, 16], [36, 14], [50, 18]].forEach(function (c) { x.beginPath(); for (var t = 0; t < 14; t += 0.2) { var r = t * 0.8; x.lineTo(c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r); } x.stroke(); }); });
    var es = new T.Mesh(new T.BoxGeometry(0.1, 0.04, 0.025), [solid('#8a8a80'), solid('#8a8a80'), solid('#8a8a80'), solid('#8a8a80'), new T.MeshLambertMaterial({ map: spT }), solid('#8a8a80')]); es.position.set(0, 0.026, 0.33); g.add(es);
    // the doorway with the "roof box" above it: on the shortest day of the year, sunrise shines right down the passage
    box(g, solid('#3a3530'), 0.035, 0.05, 0.01, 0, 0.006, 0.287); box(g, solid('#8a8a80'), 0.07, 0.015, 0.02, 0, 0.056, 0.285); box(g, solid('#3a3530'), 0.02, 0.01, 0.005, 0, 0.06, 0.296);
    var beam = new T.Mesh(new T.CylinderGeometry(0.004, 0.012, 0.3, 6, 1, true), new T.MeshBasicMaterial({ color: '#ffe08a', transparent: true, opacity: 0.35 })); beam.rotation.x = Math.PI / 2 - 0.15; beam.position.set(0, 0.07, 0.42); g.add(beam);
    // standing stones in a ring around it, and the River Boyne's green fields
    for (var s = 0; s < 8; s++) { var a3 = s / 8 * Math.PI + Math.PI * 0.55; box(g, solid('#7a7a72', { flatShading: true }), 0.02, 0.05 + hash(s, 2) * 0.03, 0.015, Math.cos(a3) * 0.37, 0.006, Math.sin(a3) * 0.33); }
    for (var t = 0; t < 4; t++) tree(g, 0.3 - t * 0.04, -0.34 + t * 0.03, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- Mount Roraima (Venezuela) ---------- */
  M.custom.roraima = function () {
    var g = new T.Group();
    blob(g, '#4f8a3f', 0.8, 0.66, 0, 0, 0.006, 6);
    // a "tepui": a huge table mountain with sheer cliffs all round and a flat top — like an island in the sky
    var sh = new T.Shape(), n = 26; for (var i = 0; i <= n; i++) { var a = i / n * D2, r = 0.26 * (0.85 + 0.25 * noise(Math.cos(a) * 2, Math.sin(a) * 2)); if (i) sh.lineTo(Math.cos(a) * r * 1.2, Math.sin(a) * r * 0.8); else sh.moveTo(Math.cos(a) * r * 1.2, Math.sin(a) * r * 0.8); }
    var geo = new T.ExtrudeGeometry(sh, { depth: 0.24, bevelEnabled: false, steps: 3 }), p = geo.attributes.position;
    for (var k = 0; k < p.count; k++) { var x = p.getX(k), y = p.getY(k), z = p.getZ(k); p.setX(k, x * (1 + (noise(y * 20, z * 15) - 0.5) * 0.06)); } geo.computeVertexNormals();
    var cliffT = tex('ror', 64, 64, function (x, w, h) { x.fillStyle = '#7a6a5a'; x.fillRect(0, 0, w, h); for (var i = 0; i < 16; i++) { x.fillStyle = i % 2 ? 'rgba(40,30,20,.3)' : 'rgba(255,240,220,.12)'; x.fillRect(i * 4, 0, 2, h); } for (var j = 0; j < 30; j++) { x.fillStyle = 'rgba(30,60,30,.35)'; x.fillRect(Math.random() * w, Math.random() * h, 3, 6); } });
    var tep = new T.Mesh(geo, [solid('#5a5a4a', { flatShading: true }), new T.MeshLambertMaterial({ map: cliffT })]); tep.rotation.x = -Math.PI / 2; tep.position.set(0, 0.006, -0.06); g.add(tep);
    // on top: black rocks, pools and odd plants; waterfalls pour off the edge; clouds wrap round it
    for (var r2 = 0; r2 < 10; r2++) { var rk = new T.Mesh(new T.IcosahedronGeometry(0.02 + hash(r2, 1) * 0.02, 0), solid('#2a2a2e', { flatShading: true })); rk.position.set((hash(r2, 2) - 0.5) * 0.4, 0.25, -0.06 + (hash(r2, 3) - 0.5) * 0.25); rk.scale.y = 1.4; g.add(rk); }
    [[-0.08, 0.0], [0.1, -0.1]].forEach(function (q) { var pl = new T.Mesh(new T.CircleGeometry(0.025, 10), solid('#5a8ac0')); pl.rotation.x = -Math.PI / 2; pl.position.set(q[0], 0.248, q[1]); g.add(pl); });
    [[-0.1, 0.13], [0.15, 0.1]].forEach(function (q) { var wf = new T.Mesh(new T.PlaneGeometry(0.012, 0.23), new T.MeshLambertMaterial({ color: '#eaf6ff', transparent: true, opacity: 0.85 })); wf.position.set(q[0], 0.125, q[1]); g.add(wf); });
    for (var c = 0; c < 7; c++) { var a2 = c / 7 * D2, cl = new T.Mesh(new T.IcosahedronGeometry(0.05, 1), new T.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, flatShading: true })); cl.scale.set(1.5, 0.5, 1); cl.position.set(Math.cos(a2) * 0.32, 0.13 + (c % 3) * 0.03, -0.06 + Math.sin(a2) * 0.22); g.add(cl); }
    for (var t = 0; t < 10; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#3f7a35', { flatShading: true })); var a3 = t / 10 * D2; tr.position.set(Math.cos(a3) * 0.38, 0.04, Math.sin(a3) * 0.3); g.add(tr); }
    return g;
  };

  /* ---------- Strokkur geyser (Iceland) ---------- */
  M.custom.strokkur = function () {
    var g = new T.Group();
    blob(g, '#a89870', 0.8, 0.66, 0, 0, 0.006, 4);
    // steaming, bare, orange-brown ground of a hot-spring valley
    for (var k = 0; k < 6; k++) { var pl = new T.Mesh(new T.CircleGeometry(0.025 + hash(k, 1) * 0.02, 10), solid(k % 2 ? '#3ab8d8' : '#5acfd8')); pl.rotation.x = -Math.PI / 2; var a = k / 6 * D2 + 0.3; pl.position.set(Math.cos(a) * 0.26, 0.009, Math.sin(a) * 0.2); g.add(pl); var rim = new T.Mesh(new T.TorusGeometry(0.03 + hash(k, 1) * 0.02, 0.005, 4, 12), solid('#d8c8a0')); rim.rotation.x = Math.PI / 2; rim.position.copy(pl.position); g.add(rim); }
    // the geyser: a blue pool that shoots a fountain of boiling water up to 20 m high every few minutes
    var pool = new T.Mesh(new T.CircleGeometry(0.07, 18), solid('#2ab0d8')); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.01; g.add(pool);
    var rim2 = new T.Mesh(new T.TorusGeometry(0.075, 0.012, 5, 18), solid('#c8b890', { flatShading: true })); rim2.rotation.x = Math.PI / 2; rim2.position.y = 0.012; g.add(rim2);
    var jet = lathe([[0.035, 0], [0.03, 0.08], [0.026, 0.2], [0.03, 0.3], [0.045, 0.36], [0.03, 0.4], [0, 0.42]], 12, new T.MeshLambertMaterial({ color: '#f4fbff', transparent: true, opacity: 0.9, flatShading: true })); jet.position.y = 0.01; g.add(jet);
    for (var s = 0; s < 9; s++) { var pf = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(s, 2) * 0.04, 1), new T.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.75, flatShading: true })); pf.position.set((hash(s, 3) - 0.3) * 0.18, 0.36 + s * 0.02, (hash(s, 4) - 0.5) * 0.1); g.add(pf); }
    // a ring of rope and watching visitors, Icelandic horses, and snowy hills behind
    for (var p = 0; p < 6; p++) { var a2 = Math.PI * 0.25 + p * 0.18; person(g, Math.cos(a2) * 0.17, Math.sin(a2) * 0.17, 1.0, ['#c0392b', '#2b6fd6', '#f2c14e', '#33a06a', '#ffffff', '#e8a83a'][p]); }
    for (var r = 0; r < 14; r++) { var a3 = r / 14 * D2; cyl(g, solid('#6a5a48'), 0.002, 0.002, 0.02, Math.cos(a3) * 0.13, 0.006, Math.sin(a3) * 0.13, 4); }
    mountain(g, { r: function (t) { return 0.24 * (1 - t) + 0.02; }, h: 0.16, pos: [-0.12, -0.42], sx: 1.8, bump: 0.25, seed: 4, colour: function (x, y) { return y > 0.08 ? '#f4f7fa' : '#6a7a5a'; } });
    var hr = new T.Group(); hr.position.set(0.28, 0.006, 0.2); g.add(hr); box(hr, solid('#c8a070'), 0.04, 0.02, 0.014, 0, 0.022, 0); [-0.014, 0.014].forEach(function (x) { [-0.005, 0.005].forEach(function (z) { box(hr, solid('#8a6a4a'), 0.004, 0.022, 0.004, x, 0, z); }); }); box(hr, solid('#c8a070'), 0.01, 0.025, 0.01, 0.022, 0.03, 0); box(hr, solid('#f2ece0'), 0.004, 0.02, 0.012, 0.016, 0.035, 0); // a little Icelandic horse with its blond mane
    return g;
  };

  /* ---------- Lake Retba, the Pink Lake (Senegal) ---------- */
  M.custom.pinklake = function () {
    var g = new T.Group();
    blob(g, '#e2c890', 0.8, 0.66, 0, 0, 0.006, 5);
    // a very salty lake that turns pink because of tiny algae
    var lk = new T.Mesh(new T.CircleGeometry(0.28, 28), solid('#f08aa8')); lk.rotation.x = -Math.PI / 2; lk.scale.y = 0.7; lk.position.y = 0.009; g.add(lk);
    var lk2 = new T.Mesh(new T.CircleGeometry(0.18, 20), solid('#e8709a')); lk2.rotation.x = -Math.PI / 2; lk2.scale.y = 0.7; lk2.position.set(0.03, 0.0095, -0.02); g.add(lk2);
    // salt collectors in colourful boats, piles of white salt along the shore
    for (var b = 0; b < 3; b++) { var bt = new T.Group(); bt.position.set(-0.12 + b * 0.12, 0.01, -0.04 + (b % 2) * 0.08); bt.rotation.y = b; g.add(bt);
      var hull = new T.Mesh(new T.CylinderGeometry(0.012, 0.008, 0.08, 6, 1, false, 0, Math.PI), solid(['#2a8ac8', '#e8a83a', '#33a06a'][b])); hull.rotation.z = Math.PI / 2; hull.rotation.y = Math.PI / 2; bt.add(hull);
      person(bt, 0.01, 0, 0.9, ['#c0392b', '#f2c14e', '#7a4ab0'][b]); }
    for (var s = 0; s < 12; s++) { var a = s / 12 * D2, pile = new T.Mesh(new T.ConeGeometry(0.025, 0.035, 7), solid('#f8f8f4', { flatShading: true })); pile.position.set(Math.cos(a) * 0.31, 0.024, Math.sin(a) * 0.22); g.add(pile); }
    // sand dunes and palms between the lake and the Atlantic
    for (var d = 0; d < 3; d++) { var du = new T.Mesh(new T.SphereGeometry(0.1, 10, 6, 0, D2, 0, Math.PI / 2), solid('#e8cc90', { flatShading: true })); du.scale.set(1.6, 0.35, 0.7); du.position.set(-0.25 + d * 0.25, 0.006, -0.32); g.add(du); }
    for (var t = 0; t < 5; t++) { var tx = -0.3 + t * 0.15, tz = 0.3; cyl(g, solid('#8a6a4a'), 0.004, 0.006, 0.1, tx, 0.006, tz, 5); for (var f = 0; f < 6; f++) { var fa = f / 6 * D2, fr = new T.Mesh(new T.BoxGeometry(0.05, 0.004, 0.012), solid('#3f8a3f')); fr.position.set(tx + Math.cos(fa) * 0.022, 0.1, tz + Math.sin(fa) * 0.022); fr.rotation.y = -fa; fr.rotation.z = -0.4 * Math.cos(fa); g.add(fr); } }
    return g;
  };

  /* ---------- Alexander Nevsky Cathedral (Sofia) ---------- */
  M.custom.nevsky = function () {
    var g = new T.Group(), st = mat(stoneTex('anc', '#e8e2d4', '#c8c0b0', 10, 6), 1, 1), w2 = solid('#ece6da'), gold = solid('#e8b84a', { flatShading: true }), green = solid('#5f9a7a', { flatShading: true });
    blob(g, '#b8b4ac', 0.8, 0.66, 0, 0, 0.006, 3);
    // a big white stone church with golden and green copper domes, built to thank Russian soldiers (1912)
    box(g, st, 0.24, 0.1, 0.3, 0, 0.006, -0.04); box(g, st, 0.34, 0.08, 0.14, 0, 0.006, -0.04);
    [-1, 1].forEach(function (s) { var hd = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.14, 14, 1, false, 0, Math.PI), st); hd.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2; hd.rotation.x = 0; hd.position.set(s * 0.17, 0.076, -0.04); hd.scale.y = 0.5; g.add(hd); });
    cyl(g, st, 0.07, 0.07, 0.07, 0, 0.106, -0.04, 16);
    var bd = lathe([[0.07, 0], [0.072, 0.02], [0.06, 0.06], [0.035, 0.09], [0.015, 0.1], [0, 0.105]], 18, gold); bd.position.set(0, 0.176, -0.04); g.add(bd);
    cyl(g, gold, 0.006, 0.008, 0.03, 0, 0.28, -0.04, 8); box(g, gold, 0.02, 0.003, 0.003, 0, 0.3, -0.04); box(g, gold, 0.003, 0.03, 0.003, 0, 0.29, -0.04);
    [[-0.09, -0.12], [0.09, -0.12], [-0.09, 0.04], [0.09, 0.04]].forEach(function (q) { cyl(g, st, 0.028, 0.028, 0.04, q[0], 0.106, q[1], 12); var d = lathe([[0.03, 0], [0.03, 0.01], [0.022, 0.03], [0.008, 0.045], [0, 0.05]], 12, green); d.position.set(q[0], 0.146, q[1]); g.add(d); });
    // the bell tower at the front with a gold dome, and arched doors
    box(g, st, 0.07, 0.2, 0.06, 0, 0.006, 0.13); cyl(g, w2, 0.03, 0.03, 0.03, 0, 0.206, 0.13, 10);
    var td = lathe([[0.034, 0], [0.034, 0.012], [0.024, 0.03], [0.008, 0.045], [0, 0.05]], 12, gold); td.position.set(0, 0.236, 0.13); g.add(td);
    for (var a = 0; a < 3; a++) arch(g, solid('#5a4a3a'), 0.02, 0.05, -0.03 + a * 0.03, 0.006, 0.161, 0.002);
    for (var t = 0; t < 8; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#3f8a3f', { flatShading: true })); tr.position.set((t % 2 ? 1 : -1) * 0.3, 0.05, -0.28 + Math.floor(t / 2) * 0.17); g.add(tr); }
    for (var p = 0; p < 4; p++) person(g, -0.06 + p * 0.04, 0.27, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#33a06a'][p]);
    return g;
  };

  /* ---------- Wat Xieng Thong (Luang Prabang) ---------- */
  M.custom.xiengthong = function () {
    var g = new T.Group(), red = solid('#a8302a'), gold = solid('#d8ad4c'), roof = solid('#b84a2a', { flatShading: true }), wht = solid('#f2ece0');
    blob(g, '#7aa04f', 0.8, 0.66, 0, 0, 0.006, 4);
    // the temple hall with layered roofs that sweep down almost to the ground (1560)
    var hall = new T.Group(); hall.position.set(0, 0.006, -0.04); g.add(hall);
    box(hall, wht, 0.32, 0.02, 0.18, 0, 0, 0);
    var mosT = tex('wxtm', 64, 64, function (x, w, h) { x.fillStyle = '#7a1a1a'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8ad4c'; for (var i = 0; i < 6; i++) { x.beginPath(); x.arc(10 + (i % 3) * 22, 18 + Math.floor(i / 3) * 28, 6, 0, D2); x.fill(); x.fillRect(8 + (i % 3) * 22, 26 + Math.floor(i / 3) * 28, 4, 8); } }); // gold stencils on deep red: the "tree of life" mosaic
    box(hall, new T.MeshLambertMaterial({ map: mosT }), 0.26, 0.07, 0.12, 0, 0.02, 0);
    sweepRoof(hall, roof, 0.3, 0.16, 0.06, 0, 0.09, 0); sweepRoof(hall, roof, 0.24, 0.12, 0.06, 0, 0.13, 0); sweepRoof(hall, roof, 0.16, 0.08, 0.05, 0, 0.17, 0);
    for (var k = 0; k < 7; k++) cone(hall, gold, 0.004, 0.025, -0.06 + k * 0.02, 0.22, 0, 5);
    // a small red chapel with gold walls, white stupas, monks in orange robes, and frangipani trees
    var ch = new T.Group(); ch.position.set(0.24, 0.006, 0.12); g.add(ch); box(ch, red, 0.08, 0.06, 0.06, 0, 0, 0); sweepRoof(ch, roof, 0.08, 0.06, 0.035, 0, 0.06, 0);
    [-0.25, -0.18].forEach(function (x) { var stp = lathe([[0.025, 0], [0.025, 0.02], [0.018, 0.03], [0.012, 0.06], [0.004, 0.1], [0, 0.11]], 10, wht); stp.position.set(x, 0.006, 0.14); g.add(stp); cone(g, gold, 0.004, 0.02, x, 0.116, 0.14, 5); });
    for (var m = 0; m < 4; m++) person(g, -0.08 + m * 0.04, 0.16 + (m % 2) * 0.02, 1.0, '#e8862a');
    for (var t = 0; t < 6; t++) { var tx = (t % 2 ? 1 : -1) * (0.3 + (t % 3) * 0.02), tz = -0.25 + Math.floor(t / 2) * 0.2; cyl(g, solid('#8a7a6a'), 0.004, 0.006, 0.05, tx, 0.006, tz, 5); var cr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#4f8a3f', { flatShading: true })); cr.scale.y = 0.7; cr.position.set(tx, 0.065, tz); g.add(cr); for (var f = 0; f < 4; f++) ball(g, wht, 0.006, tx + (hash(t, f) - 0.5) * 0.04, 0.08, tz + (hash(f, t) - 0.5) * 0.04); }
    return g;
  };

  /* ---------- Punakha Dzong (Bhutan) ---------- */
  M.custom.punakha = function () {
    var g = new T.Group(), wht = mat(tex('pkd', 64, 64, function (x, w, h) { x.fillStyle = '#f4f0e6'; x.fillRect(0, 0, w, h); x.fillStyle = '#8a2a1a'; x.fillRect(0, 0, w, 10); for (var c = 0; c < 4; c++) { x.fillStyle = '#5a3a28'; x.fillRect(6 + c * 16, 24, 8, 12); x.fillStyle = '#d8ad4c'; x.fillRect(6 + c * 16, 22, 8, 2); } }), 4, 1), roof = solid('#c8a040', { flatShading: true }), red = solid('#8a2a1a');
    // two rivers meeting — the "father" and "mother" rivers — with the fortress-monastery on the point between them
    var r1 = new T.Mesh(new T.PlaneGeometry(1.0, 0.1), solid('#5aa0c8')); r1.rotation.x = -Math.PI / 2; r1.rotation.z = 0.35; r1.position.set(0, 0.008, 0.25); g.add(r1);
    var r2 = new T.Mesh(new T.PlaneGeometry(1.0, 0.08), solid('#4f98c0')); r2.rotation.x = -Math.PI / 2; r2.rotation.z = -0.6; r2.position.set(0.1, 0.0082, 0.12); g.add(r2);
    blob(g, '#6aa04f', 0.78, 0.5, 0, -0.12, 0.006, 5);
    // long white walls that slope inward, a red band under golden roofs, and a tall central tower (utse)
    var dz = new T.Group(); dz.position.set(-0.04, 0.006, -0.06); g.add(dz);
    var wg = new T.BoxGeometry(0.44, 0.09, 0.2), wp = wg.attributes.position; for (var i = 0; i < wp.count; i++) if (wp.getY(i) > 0) { wp.setX(i, wp.getX(i) * 0.97); wp.setZ(i, wp.getZ(i) * 0.93); } wg.computeVertexNormals();
    var wm = new T.Mesh(wg, wht); wm.position.y = 0.045; dz.add(wm);
    var rf = new T.Mesh(new T.BoxGeometry(0.46, 0.008, 0.22), roof); rf.position.y = 0.094; dz.add(rf); sweepRoof(dz, roof, 0.4, 0.18, 0.03, 0, 0.098, 0);
    box(dz, wht, 0.09, 0.12, 0.09, 0, 0.09, 0); box(dz, red, 0.092, 0.015, 0.092, 0, 0.19, 0);
    sweepRoof(dz, roof, 0.1, 0.1, 0.03, 0, 0.21, 0); sweepRoof(dz, roof, 0.07, 0.07, 0.025, 0, 0.24, 0); cyl(dz, solid('#e8c060'), 0.006, 0.008, 0.03, 0, 0.26, 0, 6);
    // the wooden cantilever bridge with its covered towers at each end, and purple jacaranda trees (spring)
    var br = new T.Group(); br.position.set(-0.26, 0.006, 0.26); br.rotation.y = 0.35 + Math.PI / 2; g.add(br);
    box(br, solid('#7a4a2a'), 0.22, 0.012, 0.03, 0, 0.04, 0); ridge(br, solid('#c8a040'), 0.035, 0.02, 0.22, 0, 0.065, 0, Math.PI / 2);
    [-0.12, 0.12].forEach(function (x) { box(br, wht, 0.05, 0.07, 0.05, x, 0, 0); sweepRoof(br, roof, 0.06, 0.06, 0.03, x, 0.07, 0); });
    for (var t = 0; t < 6; t++) { var tx = 0.2 + (t % 3) * 0.06, tz = -0.28 + Math.floor(t / 3) * 0.12; cyl(g, solid('#6a5a48'), 0.004, 0.006, 0.05, tx, 0.006, tz, 5); var cr = new T.Mesh(new T.SphereGeometry(0.032, 7, 5), solid('#9a6ad0', { flatShading: true })); cr.position.set(tx, 0.07, tz); g.add(cr); }
    for (var p = 0; p < 3; p++) person(g, 0.0 + p * 0.03, 0.1, 1.0, '#a8302a');
    return g;
  };
})();
