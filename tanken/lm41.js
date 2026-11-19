/* Detailed landmarks, batch 41: Buda Castle, Geghard Monastery, Lalbagh Fort, Cotopaxi, Sankore Mosque,
   Oslo Opera House, Vasa Museum, Chiang Kai-shek Memorial Hall. */
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
  function crenels(g, m, w, y, x, z, s, ry) { var o = new T.Group(); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o); s = s || 0.014; var n = Math.max(2, Math.round(w / (s * 2))); for (var i = 0; i < n; i++) box(o, m, s, s, s, -w / 2 + (i + 0.5) * w / n, 0, 0); }

  /* ---------- Buda Castle (Budapest) ---------- */
  M.custom.budacastle = function () {
    var g = new T.Group(), wall = mat(winTex('bdc', '#e8dcc0', '#5a6068', 6, 3, { tall: 0.55 }), 3, 1), roof = solid('#5f8a7a', { flatShading: true }), st = mat(stoneTex('bds', '#c8b890', '#a89870', 12, 6), 3, 1), chain = solid('#7a7468');
    // the wide Danube along the front
    var river = new T.Mesh(new T.PlaneGeometry(1.0, 0.22), solid('#4f8ac0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.006, 0.32); g.add(river);
    blob(g, '#5f9a45', 0.76, 0.42, 0, -0.1, 0.006, 3);
    // Castle Hill with its long stone retaining walls
    var hill = new T.Mesh(new T.CylinderGeometry(0.34, 0.38, 0.1, 12), solid('#6aa04f', { flatShading: true })); hill.scale.z = 0.55; hill.position.set(0, 0.056, -0.1); g.add(hill);
    box(g, st, 0.6, 0.08, 0.02, 0, 0.006, 0.08);
    // the long palace with a green copper dome in the middle
    var top = new T.Group(); top.position.y = 0.106; g.add(top);
    box(top, wall, 0.5, 0.08, 0.1, 0, 0, -0.1); hipRoof(top, roof, 0.5, 0.1, 0.03, 0, 0.08, -0.1, 0.006);
    box(top, wall, 0.1, 0.1, 0.12, 0, 0, -0.08); for (var c = 0; c < 6; c++) cyl(top, solid('#f2ece0'), 0.004, 0.004, 0.08, -0.04 + c * 0.016, 0.0, -0.018, 6);
    cyl(top, wall, 0.04, 0.04, 0.05, 0, 0.1, -0.08, 14);
    var dome = lathe([[0.045, 0], [0.046, 0.02], [0.04, 0.045], [0.025, 0.065], [0.008, 0.075], [0, 0.08]], 16, roof); dome.position.set(0, 0.15, -0.08); top.add(dome);
    cyl(top, roof, 0.006, 0.008, 0.03, 0, 0.23, -0.08, 8); cyl(top, solid('#d8ad4c'), 0.002, 0.002, 0.02, 0, 0.26, -0.08, 4);
    // the Chain Bridge across the river with its two stone arch towers
    var br = new T.Group(); br.position.set(0.18, 0, 0.32); br.rotation.y = Math.PI / 2; g.add(br);
    box(br, solid('#9a9288'), 0.3, 0.008, 0.04, 0, 0.04, 0);
    [-0.08, 0.08].forEach(function (x) { box(br, st, 0.03, 0.09, 0.05, x, 0.006, 0); var hole = new T.Mesh(new T.PlaneGeometry(0.014, 0.035), solid('#3a3a3a')); hole.position.set(x + 0.0155, 0.06, 0); hole.rotation.y = Math.PI / 2; br.add(hole); });
    [-1, 1].forEach(function (s) { [[-0.15, -0.08], [-0.08, 0.08], [0.08, 0.15]].forEach(function (q) { var a = new T.Vector3(q[0], q[0] === -0.15 ? 0.045 : 0.095, s * 0.022), b = new T.Vector3(q[1], q[1] === 0.15 ? 0.045 : 0.095, s * 0.022), mid = a.clone().add(b).multiplyScalar(0.5); mid.y = Math.min(a.y, b.y) - 0.01; var cv = new T.QuadraticBezierCurve3(a, mid, b); var tb = new T.Mesh(new T.TubeGeometry(cv, 10, 0.0025, 4), chain); br.add(tb); }); });
    // the Fisherman's Bastion: white fairy-tale turrets at one end of the hill, and the trees
    for (var t = 0; t < 5; t++) { var x = -0.32 + t * 0.03; cyl(g, solid('#f2ece0'), 0.01, 0.01, 0.04, x, 0.106, 0.0, 8); cone(g, solid('#f2ece0'), 0.013, 0.03, x, 0.146, 0.0, 8); }
    for (var k = 0; k < 6; k++) tree(g, -0.3 + k * 0.12, -0.3, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- Geghard Monastery (Armenia) ---------- */
  M.custom.geghard = function () {
    var g = new T.Group(), tuf = mat(stoneTex('ggh', '#b8a088', '#987e66', 10, 6), 1, 1), t2 = solid('#a8907a', { flatShading: true }), cliffM = solid('#8a7a6a', { flatShading: true });
    blob(g, '#6a9a4a', 0.76, 0.62, 0, 0, 0.006, 4);
    // a wall of cliffs in a gorge — part of the monastery is carved right into the rock
    var cl = new T.Mesh(new T.BoxGeometry(0.8, 0.32, 0.18, 8, 4, 2), cliffM), p = cl.geometry.attributes.position;
    for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setZ(i, z + (noise(x * 8, y * 6) - 0.5) * 0.08); p.setY(i, y + (y > 0 ? (noise(x * 5, 3) - 0.5) * 0.1 : 0)); } cl.geometry.computeVertexNormals(); cl.position.set(0, 0.16, -0.28); g.add(cl);
    [[-0.12, 0.12], [0.1, 0.1]].forEach(function (q) { var cv = new T.Mesh(new T.PlaneGeometry(0.05, 0.07), solid('#3a2a20')); cv.position.set(q[0], q[1], -0.185); g.add(cv); }); // rock-cut chapels
    // the main church: a cross plan with a round drum and pointed cone roof (Armenian style), and the hall in front
    var ch = new T.Group(); ch.position.set(0.05, 0.006, -0.08); g.add(ch);
    box(ch, tuf, 0.16, 0.12, 0.1, 0, 0, 0); box(ch, tuf, 0.08, 0.12, 0.16, 0, 0, 0);
    ridge(ch, t2, 0.1, 0.04, 0.16, 0, 0.12, 0, Math.PI / 2); ridge(ch, t2, 0.08, 0.035, 0.16, 0, 0.12, 0, 0);
    cyl(ch, tuf, 0.035, 0.035, 0.07, 0, 0.14, 0, 12); cone(ch, t2, 0.042, 0.06, 0, 0.21, 0, 12); cyl(ch, solid('#3a3a3a'), 0.0015, 0.0015, 0.02, 0, 0.27, 0, 4);
    for (var w = 0; w < 6; w++) { var a = w / 6 * D2, wn = new T.Mesh(new T.PlaneGeometry(0.006, 0.025), solid('#3a3a3a')); wn.position.set(Math.cos(a) * 0.0355, 0.18, Math.sin(a) * 0.0355); wn.rotation.y = -a + Math.PI / 2; ch.add(wn); }
    box(ch, tuf, 0.14, 0.08, 0.08, 0, 0, 0.11); var dr = new T.Mesh(new T.PlaneGeometry(0.025, 0.045), solid('#3a2a20')); dr.position.set(0, 0.022, 0.151); ch.add(dr);
    // carved cross-stones (khachkars) along the path
    var kt = tex('khach', 32, 48, function (x, w, h) { x.fillStyle = '#b8a088'; x.fillRect(0, 0, w, h); x.strokeStyle = '#6a5440'; x.lineWidth = 2; x.strokeRect(3, 3, w - 6, h - 6); x.fillStyle = '#6a5440'; x.fillRect(14, 8, 4, 30); x.fillRect(7, 15, 18, 4); for (var k = 0; k < 6; k++) { x.beginPath(); x.arc(8 + (k % 3) * 8, 40 + Math.floor(k / 3) * 3, 1.5, 0, D2); x.fill(); } });
    for (var k = 0; k < 4; k++) { var ks = new T.Mesh(new T.BoxGeometry(0.03, 0.05, 0.008), [t2, t2, t2, t2, new T.MeshLambertMaterial({ map: kt }), t2]); ks.position.set(-0.22 + k * 0.05, 0.031, 0.18); g.add(ks); }
    box(g, mat(stoneTex('ggw', '#a89078', '#887060', 12, 6), 4, 1), 0.6, 0.04, 0.015, 0, 0.006, 0.26);
    for (var t = 0; t < 6; t++) tree(g, -0.32 + t * 0.12, 0.33, 0.9, '#4f8a3f');
    return g;
  };

  /* ---------- Lalbagh Fort (Dhaka) ---------- */
  M.custom.lalbagh = function () {
    var g = new T.Group(), red = mat(stoneTex('lbr', '#b8583a', '#8a3a28', 8, 4), 2, 1), wht = solid('#f2ece0'), marble = mat(tex('lbm', 64, 64, function (x, w, h) { x.fillStyle = '#ece6da'; x.fillRect(0, 0, w, h); x.fillStyle = '#c8a878'; x.fillRect(0, h - 10, w, 2); for (var i = 0; i < 3; i++) { x.fillStyle = '#7a5a4a'; x.fillRect(8 + i * 20, 20, 8, 26); } }), 1, 1);
    blob(g, '#6aa04f', 0.78, 0.64, 0, 0, 0.006, 6);
    // a Mughal fort that was never finished: red walls, and in the middle the white tomb of Pari Bibi
    var wl = [[0, -0.28, 0.66, 0.02], [-0.33, 0, 0.02, 0.56], [0.33, 0, 0.02, 0.56]]; wl.forEach(function (q) { box(g, red, q[2], 0.05, q[3], q[0], 0.006, q[1]); });
    // the tomb: square, white marble, with a copper-gilt dome and four corner towers
    var tb = new T.Group(); tb.position.set(0, 0.006, -0.02); g.add(tb);
    box(tb, solid('#d8c8a8'), 0.18, 0.02, 0.18, 0, 0, 0); box(tb, marble, 0.14, 0.09, 0.14, 0, 0.02, 0);
    cyl(tb, wht, 0.04, 0.04, 0.02, 0, 0.11, 0, 8, Math.PI / 8); var dm = lathe([[0.04, 0], [0.043, 0.02], [0.035, 0.045], [0.015, 0.06], [0, 0.065]], 8, solid('#b8803a', { flatShading: true })); dm.rotation.y = Math.PI / 8; dm.position.y = 0.13; tb.add(dm);
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (q) { cyl(tb, wht, 0.01, 0.01, 0.1, q[0] * 0.07, 0.02, q[1] * 0.07, 8); var cp = new T.Mesh(new T.SphereGeometry(0.012, 8, 5, 0, D2, 0, Math.PI / 2), wht); cp.position.set(q[0] * 0.07, 0.12, q[1] * 0.07); tb.add(cp); });
    // the Diwan (audience hall) and the three-domed mosque, fountains and long water channels
    box(g, red, 0.16, 0.07, 0.07, 0.19, 0.006, -0.2); for (var a = 0; a < 5; a++) arch(g, solid('#5a2a20'), 0.018, 0.04, 0.13 + a * 0.03, 0.006, -0.1645, 0.002);
    var mq = new T.Group(); mq.position.set(-0.2, 0.006, -0.2); g.add(mq);
    box(mq, red, 0.16, 0.07, 0.07, 0, 0, 0); [-0.05, 0, 0.05].forEach(function (x, i) { var d = new T.Mesh(new T.SphereGeometry(i === 1 ? 0.028 : 0.02, 10, 6, 0, D2, 0, Math.PI / 2), wht); d.position.set(x, 0.07, 0); mq.add(d); });
    [[0, 0.17, 0.04, 0.24], [0.17, -0.02, 0.2, 0.03], [-0.17, -0.02, 0.2, 0.03]].forEach(function (q) { var ch = new T.Mesh(new T.PlaneGeometry(q[2], q[3]), solid('#5aa8d8')); ch.rotation.x = -Math.PI / 2; ch.position.set(q[0], 0.009, q[1]); g.add(ch); });
    // the south gate
    box(g, red, 0.12, 0.12, 0.05, 0, 0.006, 0.3); arch(g, solid('#3a1a14'), 0.04, 0.08, 0, 0.006, 0.326, 0.002); [-0.06, 0.06].forEach(function (x) { cyl(g, red, 0.014, 0.014, 0.15, x, 0.006, 0.3, 8); var cp = new T.Mesh(new T.SphereGeometry(0.016, 8, 5, 0, D2, 0, Math.PI / 2), wht); cp.position.set(x, 0.156, 0.3); g.add(cp); });
    for (var t = 0; t < 8; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#3f8a3f', { flatShading: true })); tr.position.set((t % 2 ? 1 : -1) * (0.25 + (t % 3) * 0.02), 0.05, -0.05 + Math.floor(t / 2) * 0.08); g.add(tr); }
    return g;
  };

  /* ---------- Cotopaxi ---------- */
  M.custom.cotopaxi = function () {
    var g = new T.Group();
    blob(g, '#9a9a68', 0.8, 0.66, 0, 0, 0.006, 2);
    // an almost perfect cone of a volcano, with a glacier cap and a dark band of ash and rock below it
    mountain(g, { r: function (t) { return 0.36 * Math.pow(1 - t, 0.95) + 0.03; }, h: 0.52, seg: 40, rings: 22, bump: 0.08, jag: 0.012, seed: 2,
      colour: function (x, y, z) { var a = Math.atan2(z, x), sn = 0.33 + 0.04 * Math.sin(a * 7) + 0.02 * noise(a * 4, 2); if (y > sn) return y > 0.5 ? '#c8ccd2' : '#f6f8fa'; if (y > sn - 0.06 && Math.sin(a * 13) > 0.2) return '#e8ecf0'; return y > 0.18 ? '#5a504a' : y > 0.08 ? '#7a6a58' : '#8a8a5a'; } });
    // the crater at the top, steaming
    var cr = new T.Mesh(new T.CylinderGeometry(0.025, 0.03, 0.01, 12), solid('#4a4040')); cr.position.y = 0.515; g.add(cr);
    for (var s = 0; s < 4; s++) { var pf = new T.Mesh(new T.IcosahedronGeometry(0.02 + s * 0.008, 0), new T.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 - s * 0.12 })); pf.position.set(0.01 + s * 0.02, 0.55 + s * 0.035, 0); g.add(pf); }
    // the páramo grassland with a small lake, wild horses and a llama
    var lk = new T.Mesh(new T.CircleGeometry(0.07, 16), solid('#5a9ac8')); lk.rotation.x = -Math.PI / 2; lk.scale.y = 0.6; lk.position.set(-0.24, 0.009, 0.28); g.add(lk);
    for (var k = 0; k < 14; k++) { var a = k / 14 * D2, r = 0.36 + 0.03 * hash(k, 2); ball(g, solid('#b8a860', { flatShading: true }), 0.016, Math.cos(a) * r, 0.014, Math.sin(a) * r * 0.85, 1, 0.6, 1); }
    [[0.22, 0.26, '#6a4a32'], [0.27, 0.22, '#f2ece0']].forEach(function (q) { var h = new T.Group(); h.position.set(q[0], 0.006, q[1]); g.add(h); box(h, solid(q[2]), 0.035, 0.016, 0.012, 0, 0.022, 0); [-0.012, 0.012].forEach(function (x) { [-0.004, 0.004].forEach(function (z) { box(h, solid(q[2]), 0.004, 0.022, 0.004, x, 0, z); }); }); box(h, solid(q[2]), 0.008, 0.02, 0.008, 0.018, 0.032, 0); });
    return g;
  };

  /* ---------- Sankore Mosque (Timbuktu) ---------- */
  M.custom.sankore = function () {
    var g = new T.Group(), mud = mat(tex('snk', 64, 64, function (x, w, h) { x.fillStyle = '#c8955a'; x.fillRect(0, 0, w, h); for (var i = 0; i < 120; i++) { x.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '255,230,190' : '90,50,20') + ',.12)'; x.fillRect(Math.random() * w, Math.random() * h, 5, 2); } }), 1, 1), stick = solid('#6a4a2a');
    blob(g, '#e2c08a', 0.8, 0.66, 0, 0, 0.006, 3); // Sahara sand
    function mudBox(w, h, d, x, y, z, t) { var geo = new T.BoxGeometry(w, h, d, 3, 2, 3), p = geo.attributes.position; for (var i = 0; i < p.count; i++) { var yy = p.getY(i), f = 1 - (yy / h + 0.5) * (t || 0.1); p.setX(i, p.getX(i) * f + (noise(p.getZ(i) * 30, yy * 20) - 0.5) * 0.004); p.setZ(i, p.getZ(i) * f); } geo.computeVertexNormals(); var m = new T.Mesh(geo, mud); m.position.set(x, y + h / 2, z); g.add(m); return m; }
    // a mud-brick mosque of the old university city: low walls round a courtyard…
    mudBox(0.4, 0.06, 0.04, 0, 0.006, -0.18, 0.15); mudBox(0.4, 0.06, 0.04, 0, 0.006, 0.18, 0.15); mudBox(0.04, 0.06, 0.4, -0.2, 0.006, 0, 0.15); mudBox(0.04, 0.06, 0.4, 0.2, 0.006, 0, 0.15);
    mudBox(0.18, 0.07, 0.36, -0.1, 0.006, 0, 0.1);
    // …and the stepped pyramid-shaped tower, bristling with wooden beams (toron) used to climb up and re-plaster it
    var tw = mudBox(0.11, 0.24, 0.11, 0.08, 0.006, -0.06, 0.55);
    for (var l = 0; l < 5; l++) { var y = 0.04 + l * 0.045, r = 0.055 * (1 - (y / 0.24) * 0.55) + 0.006; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { for (var k = -1; k <= 1; k++) box(g, stick, d[0] ? 0.035 : 0.005, 0.005, d[1] ? 0.035 : 0.005, 0.08 + d[0] * r + (d[1] ? k * 0.025 * (1 - l * 0.15) : 0), y, -0.06 + d[1] * r + (d[0] ? k * 0.025 * (1 - l * 0.15) : 0)); }); }
    cone(g, mud, 0.012, 0.03, 0.08, 0.246, -0.06, 4, Math.PI / 4);
    for (var s = 0; s < 8; s++) box(g, stick, 0.005, 0.005, 0.03, -0.18 + s * 0.05, 0.05, 0.2);
    // pointed pinnacles on the wall tops, people in blue robes, and a camel
    for (var p2 = 0; p2 < 9; p2++) cone(g, mud, 0.008, 0.02, -0.19 + p2 * 0.0475, 0.066, -0.18, 4);
    for (var pp = 0; pp < 4; pp++) person(g, 0.05 + pp * 0.03, 0.27 + (pp % 2) * 0.03, 1.1, ['#2a4aa8', '#f2ece0', '#2a6ab0', '#e8a83a'][pp]);
    var cm = new T.Group(); cm.position.set(-0.28, 0.006, 0.28); g.add(cm); var bd = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), solid('#c8a070', { flatShading: true })); bd.scale.set(1.4, 0.8, 0.8); bd.position.y = 0.07; cm.add(bd); ball(cm, solid('#c8a070'), 0.016, 0.0, 0.1, 0); [-0.025, 0.025].forEach(function (x) { [-0.012, 0.012].forEach(function (z) { box(cm, solid('#b89060'), 0.006, 0.055, 0.006, x, 0, z); }); }); box(cm, solid('#c8a070'), 0.01, 0.05, 0.01, 0.045, 0.06, 0); ball(cm, solid('#c8a070'), 0.012, 0.055, 0.11, 0, 1.4, 0.8, 0.8);
    return g;
  };

  /* ---------- Oslo Opera House ---------- */
  M.custom.osloopera = function () {
    var g = new T.Group(), marble = solid('#f4f4f2', { flatShading: true }), glass = mat(winTex('oop', '#9ab8c8', '#5a7a90', 6, 3, { tall: 0.8 }), 2, 1), alu = solid('#c8ccd0');
    // the fjord — the building seems to rise out of the water like a glacier
    var sea = new T.Mesh(new T.PlaneGeometry(1.0, 0.5), solid('#3f7ab0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.005, 0.24); g.add(sea);
    blob(g, '#9a9a90', 0.76, 0.34, 0, -0.18, 0.006, 4);
    // the sloping white marble roof you can walk up onto, from the water to the top
    var sh = new T.Shape(); sh.moveTo(-0.3, 0); sh.lineTo(0.3, 0); sh.lineTo(0.3, 0.09); sh.lineTo(-0.06, 0.09); sh.lineTo(-0.3, 0.0);
    var ws = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.36, bevelEnabled: false }), marble); ws.position.set(0, 0.0, -0.2); g.add(ws);
    var ramp = new T.Shape(); ramp.moveTo(-0.15, 0); ramp.lineTo(0.15, 0); ramp.lineTo(0.0, 0.09); ramp.lineTo(-0.15, 0);
    var rp = new T.Mesh(new T.ExtrudeGeometry(ramp, { depth: 0.12, bevelEnabled: false }), marble); rp.rotation.y = -Math.PI / 2; rp.position.set(0.12, 0, 0.16); g.add(rp);
    // the glass front of the foyer and the tall stage tower clad in aluminium
    var gf = new T.Mesh(new T.PlaneGeometry(0.2, 0.08), glass); gf.position.set(0.12, 0.05, 0.161); g.add(gf);
    box(g, alu, 0.14, 0.09, 0.12, 0.12, 0.09, -0.08);
    for (var r = 0; r < 8; r++) box(g, solid('#b8bcc0'), 0.142, 0.002, 0.122, 0.12, 0.1 + r * 0.01, -0.08);
    // people walking on the roof, and the "She Lies" glass-and-steel sculpture floating in the water
    for (var p = 0; p < 6; p++) { var px = -0.2 + p * 0.06, py = Math.max(0, 0.09 * (px + 0.3) / 0.24); if (px > -0.06) py = 0.09; var pr = new T.Group(); pr.position.y = Math.min(0.09, py); g.add(pr); person(pr, px, 0.0 + (p % 2) * 0.06, 1.0, ['#c0392b', '#2b6fd6', '#f2c14e', '#33a06a'][p % 4]); }
    var sc = new T.Group(); sc.position.set(-0.3, 0.005, 0.32); g.add(sc);
    for (var k = 0; k < 6; k++) { var tri = new T.Mesh(new T.ConeGeometry(0.03, 0.08, 3), new T.MeshLambertMaterial({ color: '#cfe4ee', transparent: true, opacity: 0.8 })); tri.position.set((hash(k, 1) - 0.5) * 0.08, 0.03, (hash(k, 2) - 0.5) * 0.06); tri.rotation.set(hash(k, 3), hash(k, 4) * 3, hash(k, 5) - 0.5); sc.add(tri); }
    // the new waterfront towers of the Barcode district behind
    for (var b = 0; b < 6; b++) box(g, mat(winTex('obc' + (b % 3), ['#f2ece0', '#3a3a40', '#b8c8d0'][b % 3], '#5a6878', 4, 6), 1, 2), 0.05, 0.12 + (b % 3) * 0.04, 0.06, -0.3 + b * 0.065, 0.006, -0.32);
    return g;
  };

  /* ---------- Vasa Museum (Stockholm) ---------- */
  M.custom.vasa = function () {
    var g = new T.Group(), wood = solid('#5a3a22', { flatShading: true }), wood2 = solid('#7a5232'), cop = solid('#4a7a6a', { flatShading: true }), gold = solid('#d8ad4c');
    var sea = new T.Mesh(new T.PlaneGeometry(1.0, 0.3), solid('#3f7ab0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.007, 0.32); g.add(sea);
    blob(g, '#6aa04f', 0.76, 0.34, 0, -0.16, 0.006, 5);
    // the museum: a dark copper-clad hall with ship-mast poles sticking out of the roof (they show how tall the masts were)
    box(g, cop, 0.44, 0.1, 0.18, 0, 0.006, -0.12);
    var rf = new T.Shape(); rf.moveTo(-0.22, 0); rf.lineTo(0.22, 0); rf.lineTo(0.12, 0.08); rf.lineTo(-0.1, 0.06); rf.lineTo(-0.22, 0);
    var rm = new T.Mesh(new T.ExtrudeGeometry(rf, { depth: 0.18, bevelEnabled: false }), cop); rm.position.set(0, 0.106, -0.21); g.add(rm);
    [[-0.04, 0.24], [0.04, 0.28], [0.11, 0.2]].forEach(function (q) { cyl(g, solid('#3a2a20'), 0.004, 0.005, q[1], q[0], 0.14, -0.12, 6); for (var y = 0.2; y < 0.12 + q[1]; y += 0.06) box(g, solid('#3a2a20'), 0.002, 0.002, 0.07, q[0], y, -0.12); });
    // the Vasa warship herself (shown outside the hall so you can see her): sank on her first voyage in 1628, raised 333 years later
    var sp = new T.Group(); sp.position.set(0.0, 0.0, 0.32); g.add(sp);
    var hull = new T.Shape(); hull.moveTo(-0.17, 0.0); hull.lineTo(0.13, 0.0); hull.quadraticCurveTo(0.2, 0.02, 0.22, 0.06); hull.lineTo(0.16, 0.08); hull.lineTo(-0.14, 0.08); hull.lineTo(-0.18, 0.13); hull.lineTo(-0.2, 0.13); hull.lineTo(-0.2, 0.06); hull.lineTo(-0.17, 0.0);
    var hm = new T.Mesh(new T.ExtrudeGeometry(hull, { depth: 0.07, bevelEnabled: false }), wood); hm.position.set(0, 0.0, -0.035); sp.add(hm);
    for (var gp = 0; gp < 8; gp++) [-1, 1].forEach(function (s) { box(sp, solid('#c8402a'), 0.012, 0.01, 0.002, -0.12 + gp * 0.035, 0.045, s * 0.0355); }); // red gun ports
    box(sp, gold, 0.003, 0.05, 0.072, -0.199, 0.075, 0); box(sp, wood2, 0.3, 0.004, 0.06, 0.0, 0.08, 0);
    [[-0.08, 0.2], [0.02, 0.24], [0.11, 0.18]].forEach(function (q) { cyl(sp, wood2, 0.003, 0.004, q[1], q[0], 0.08, 0, 6); [0.6, 0.85].forEach(function (f) { box(sp, wood2, 0.003, 0.003, 0.08 * (1.2 - f), q[0], 0.08 + q[1] * f, 0); }); });
    cyl(sp, wood2, 0.002, 0.003, 0.12, 0.22, 0.06, 0, 5).rotation.z = -1.0;
    var lion = new T.Mesh(new T.SphereGeometry(0.01, 6, 4), gold); lion.position.set(0.215, 0.055, 0); sp.add(lion);
    for (var t = 0; t < 6; t++) tree(g, -0.32 + t * 0.12, -0.32, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- Chiang Kai-shek Memorial Hall (Taipei) ---------- */
  M.custom.ckshall = function () {
    var g = new T.Group(), wht = mat(stoneTex('cks', '#f6f4ee', '#dedad0', 16, 8), 1, 1), w2 = solid('#f6f4ee'), blue = solid('#2a4ab8', { flatShading: true }), red = solid('#c0302a'), stone = solid('#d8d4cc');
    blob(g, '#b8b4ac', 0.8, 0.66, 0, 0, 0.006, 3);
    // the white hall: a wide stepped base, and on top a building with a blue-tiled octagonal roof (blue and white are the colours of the sky)
    box(g, w2, 0.3, 0.03, 0.3, 0, 0.006, -0.08); box(g, w2, 0.26, 0.03, 0.26, 0, 0.036, -0.08);
    var st = new T.Mesh(new T.BoxGeometry(0.1, 0.06, 0.12), stone); st.position.set(0, 0.035, 0.1); st.rotation.x = 0.45; g.add(st);
    box(g, wht, 0.18, 0.13, 0.18, 0, 0.066, -0.08);
    var dr = new T.Mesh(new T.PlaneGeometry(0.05, 0.08), solid('#d8ad4c')); dr.position.set(0, 0.106, 0.011); g.add(dr);
    var r1 = new T.Mesh(new T.CylinderGeometry(0.06, 0.15, 0.05, 8), blue); r1.position.set(0, 0.221, -0.08); r1.rotation.y = Math.PI / 8; g.add(r1);
    cyl(g, w2, 0.055, 0.055, 0.03, 0, 0.246, -0.08, 8, Math.PI / 8);
    var r2 = new T.Mesh(new T.CylinderGeometry(0.01, 0.1, 0.07, 8), blue); r2.position.set(0, 0.311, -0.08); r2.rotation.y = Math.PI / 8; g.add(r2);
    ball(g, solid('#d8ad4c'), 0.012, 0, 0.352, -0.08);
    // Liberty Square: the big white gate with five blue roofs, and the concert hall and theatre (red pillars, orange roofs) on either side
    var gt = new T.Group(); gt.position.set(0, 0.006, 0.33); g.add(gt);
    [-0.12, -0.04, 0.04, 0.12].forEach(function (x) { box(gt, w2, 0.025, 0.1, 0.03, x, 0, 0); });
    box(gt, w2, 0.3, 0.02, 0.035, 0, 0.1, 0);
    [[-0.08, 0.06, 0.04], [0, 0.08, 0.05], [0.08, 0.06, 0.04]].forEach(function (q) { var rr = new T.Mesh(new T.CylinderGeometry(q[1] * 0.25, q[1] * 0.75, q[2] * 0.6, 4), blue); rr.rotation.y = Math.PI / 4; rr.scale.z = 0.4; rr.position.set(q[0], 0.12 + q[2] * 0.3, 0); gt.add(rr); });
    [-1, 1].forEach(function (s) { var hb = new T.Group(); hb.position.set(s * 0.28, 0.006, 0.08); g.add(hb); box(hb, solid('#f2ece0'), 0.1, 0.02, 0.16, 0, 0, 0);
      for (var c = 0; c < 4; c++) cyl(hb, red, 0.005, 0.005, 0.06, -0.035 + c * 0.023, 0.02, 0.07, 6); box(hb, solid('#e8d8b8'), 0.08, 0.06, 0.12, 0, 0.02, -0.01);
      var rf = new T.Mesh(new T.CylinderGeometry(0.03, 0.09, 0.05, 4), solid('#e8902a', { flatShading: true })); rf.rotation.y = Math.PI / 4; rf.scale.z = 1.4; rf.position.set(0, 0.105, 0.0); hb.add(rf); });
    // gardens and the long walk lined with trees
    for (var t = 0; t < 8; t++) [-1, 1].forEach(function (s) { var tr = new T.Mesh(new T.SphereGeometry(0.022, 7, 5), solid('#3f8a3f', { flatShading: true })); tr.position.set(s * 0.1, 0.04, 0.1 + t * 0.025); if (t % 2) g.add(tr); });
    for (var p = 0; p < 4; p++) person(g, -0.04 + p * 0.025, 0.22 + (p % 2) * 0.03, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#ffffff'][p]);
    return g;
  };
})();
