/* Detailed landmarks, batch 40: Pena Palace, Wawel Castle, Gur-e-Amir, Morro Castle (Havana), Jerash,
   Great Mosque of Kairouan, Santa Catalina Arch (Antigua Guatemala), Svetitskhoveli Cathedral. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function cone(g, m, r, h, x, y, z, seg, ry) { var c = new T.Mesh(new T.ConeGeometry(r, h, seg || 8), m); c.position.set(x, y + h / 2, z); if (ry) c.rotation.y = ry; g.add(c); return c; }
  function ball(g, m, r, x, y, z, sx, sy, sz) { var b = new T.Mesh(new T.SphereGeometry(r, 12, 8), m); b.position.set(x, y, z); b.scale.set(sx || 1, sy || 1, sz || 1); g.add(b); return b; }
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.007 * s, 0.01 * s, 0.035 * s, x, 0.006, z, 6); ball(g, solid('#5a3a28'), 0.0065 * s, x, 0.048 * s, z); }
  function crenels(g, m, w, d, y, x, z, s) { s = s || 0.016; var n = Math.max(2, Math.round(w / (s * 2))); for (var i = 0; i < n; i++) { var px = x - w / 2 + (i + 0.5) * w / n; box(g, m, s, s, s, px, y, z - d / 2); box(g, m, s, s, s, px, y, z + d / 2); } var m2 = Math.max(2, Math.round(d / (s * 2))); for (var j = 0; j < m2; j++) { var pz = z - d / 2 + (j + 0.5) * d / m2; box(g, m, s, s, s, x - w / 2, y, pz); box(g, m, s, s, s, x + w / 2, y, pz); } }
  function hipRoof(g, m, w, d, h, x, y, z, o) { // hipped roof over w × d with eaves o
    o = o || 0; var W = w / 2 + o, D = d / 2 + o, rx = Math.max(0, W - D), rz = Math.max(0, D - W);
    var P = [[-W, 0, -D], [W, 0, -D], [W, 0, D], [-W, 0, D], [-rx, h, -rz], [rx, h, -rz], [rx, h, rz], [-rx, h, rz]], pos = [];
    [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]].forEach(function (f) { [[0, 1, 2], [0, 2, 3]].forEach(function (t) { t.forEach(function (k) { pos.push(P[f[k]][0], P[f[k]][1], P[f[k]][2]); }); }); });
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals(); var mm = new T.Mesh(geo, m); mm.material.side = T.DoubleSide; mm.position.set(x, y, z); g.add(mm); return mm;
  }

  /* ---------- Pena Palace (Sintra) ---------- */
  M.custom.pena = function () {
    var g = new T.Group(), yel = mat(winTex('pny', '#f2c23a', '#6a4a3a', 3, 2, { tall: 0.55 }), 1, 1), red = mat(winTex('pnr', '#c8453a', '#4a2a2a', 3, 3, { tall: 0.5 }), 1, 1), grey = mat(stoneTex('png', '#b8b0a4', '#948c80', 10, 6), 2, 1), wht = solid('#f2ece0');
    // a forested hill-top crag
    var hill = new T.Mesh(new T.SphereGeometry(0.4, 16, 8, 0, D2, 0, Math.PI / 2), solid('#3f7a35', { flatShading: true })); hill.scale.set(1, 0.35, 0.85); g.add(hill);
    var crag = new T.Mesh(new T.IcosahedronGeometry(0.16, 1), solid('#8a8a80', { flatShading: true })); crag.scale.set(1.3, 0.6, 1); crag.position.set(0, 0.12, -0.02); g.add(crag);
    var top = new T.Group(); top.position.set(0, 0.17, 0); g.add(top);
    // a fairy-tale palace in bright yellow, red and grey: a red clock tower, a yellow wing with a Moorish dome, grey crenellated walls
    box(top, grey, 0.32, 0.05, 0.2, 0, 0, 0); crenels(top, grey, 0.32, 0.2, 0.05, 0, 0, 0.014);
    box(top, red, 0.1, 0.12, 0.1, -0.08, 0.05, -0.03); crenels(top, solid('#c8453a'), 0.1, 0.1, 0.17, -0.08, -0.03, 0.012);
    box(top, red, 0.045, 0.2, 0.045, -0.12, 0.05, 0.04); cyl(top, red, 0.026, 0.026, 0.03, -0.12, 0.25, 0.04, 10);
    var cl = new T.Mesh(new T.CircleGeometry(0.012, 14), wht); cl.position.set(-0.12, 0.2, 0.063); top.add(cl);
    var dmT = new T.Mesh(new T.SphereGeometry(0.026, 12, 8, 0, D2, 0, Math.PI / 2), solid('#e8a83a')); dmT.position.set(-0.12, 0.28, 0.04); dmT.scale.y = 1.4; top.add(dmT);
    box(top, yel, 0.14, 0.09, 0.1, 0.08, 0.05, 0.0);
    cyl(top, yel, 0.04, 0.04, 0.12, 0.13, 0.05, -0.05, 12);
    var dome = lathe([[0.045, 0], [0.047, 0.02], [0.04, 0.04], [0.02, 0.06], [0, 0.07]], 14, solid('#d84a3a')); dome.position.set(0.13, 0.17, -0.05); top.add(dome);
    // blue-and-white tiles band, arched windows and the Triton gateway
    var tl = tex('pnt', 64, 16, function (x, w, h) { x.fillStyle = '#f4f2ee'; x.fillRect(0, 0, w, h); x.fillStyle = '#2a5ab0'; for (var i = 0; i < w; i += 8) { x.fillRect(i + 1, 1, 6, 6); x.fillRect(i + 3, 9, 2, 6); } });
    var tb = new T.Mesh(new T.PlaneGeometry(0.14, 0.02), new T.MeshLambertMaterial({ map: tl })); tb.position.set(0.08, 0.12, 0.051); top.add(tb);
    for (var a = 0; a < 3; a++) arch(top, solid('#3a2a2a'), 0.018, 0.04, 0.04 + a * 0.04, 0.06, 0.0505, 0.002);
    arch(top, solid('#8a8a80'), 0.05, 0.07, 0.02, 0.0, 0.1, 0.012);
    // the forest of the Sintra hills
    for (var t = 0; t < 18; t++) { var ta = t / 18 * D2, rr = 0.3 + 0.05 * hash(t, 7); var tr = new T.Mesh(new T.SphereGeometry(0.04, 7, 5), solid(t % 2 ? '#2f6f3a' : '#4f8a3f', { flatShading: true })); tr.position.set(Math.cos(ta) * rr, 0.05 + 0.06 * (1 - rr / 0.4), Math.sin(ta) * rr * 0.85); g.add(tr); }
    return g;
  };

  /* ---------- Wawel Castle (Kraków) ---------- */
  M.custom.wawel = function () {
    var g = new T.Group(), wall = mat(winTex('wwl', '#e8dcc0', '#5a6068', 4, 3, { tall: 0.5 }), 2, 1), brick = mat(stoneTex('wwb', '#b8603a', '#8a4428', 8, 4), 2, 2), roof = solid('#a8452e', { flatShading: true }), cop = solid('#5f9a7a', { flatShading: true }), gold = solid('#d8ad4c');
    // the Wawel hill above the Vistula river
    var river = new T.Mesh(new T.PlaneGeometry(1.0, 0.16), solid('#4f8ac0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.006, 0.36); g.add(river);
    blob(g, '#5f9a45', 0.76, 0.5, 0, -0.06, 0.006, 4);
    var hill = new T.Mesh(new T.CylinderGeometry(0.34, 0.4, 0.07, 14), solid('#6aa04f', { flatShading: true })); hill.scale.z = 0.7; hill.position.set(0, 0.04, -0.04); g.add(hill);
    var top = new T.Group(); top.position.y = 0.075; g.add(top);
    // red brick walls with towers all round
    [[-0.26, 0], [0.26, 0], [0, -0.22], [0, 0.17]].forEach(function (q, i) { box(top, brick, i < 2 ? 0.02 : 0.5, 0.06, i < 2 ? 0.4 : 0.02, q[0], 0, q[1] - 0.025); });
    [[-0.26, -0.22], [0.26, -0.22], [-0.26, 0.17], [0.26, 0.17]].forEach(function (q) { cyl(top, brick, 0.03, 0.032, 0.09, q[0], 0, q[1], 10); cone(top, roof, 0.04, 0.06, q[0], 0.09, q[1], 10); });
    // the Renaissance royal castle round its arcaded courtyard
    box(top, wall, 0.26, 0.09, 0.05, 0.06, 0, -0.14); box(top, wall, 0.05, 0.09, 0.18, 0.17, 0, -0.06); box(top, wall, 0.05, 0.09, 0.18, -0.05, 0, -0.06);
    hipRoof(top, roof, 0.26, 0.05, 0.04, 0.06, 0.09, -0.14, 0.006); hipRoof(top, roof, 0.05, 0.18, 0.035, 0.17, 0.09, -0.06, 0.006); hipRoof(top, roof, 0.05, 0.18, 0.035, -0.05, 0.09, -0.06, 0.006);
    for (var c = 0; c < 6; c++) cyl(top, solid('#f2ece0'), 0.003, 0.003, 0.04, 0.0 + c * 0.024, 0.0, -0.11, 5);
    // the cathedral with its golden Sigismund Chapel dome and green copper spires
    var cat = new T.Group(); cat.position.set(-0.15, 0, 0.06); top.add(cat);
    box(cat, mat(stoneTex('wwc', '#d8ccb0', '#b0a488', 10, 6), 1, 1), 0.14, 0.09, 0.07, 0, 0, 0); ridge(cat, roof, 0.07, 0.04, 0.14, 0, 0.09, 0, Math.PI / 2);
    box(cat, brick, 0.035, 0.15, 0.035, -0.06, 0, 0.0); cone(cat, cop, 0.03, 0.08, -0.06, 0.15, 0.0, 8);
    box(cat, brick, 0.03, 0.13, 0.03, 0.065, 0, -0.01); var cp = lathe([[0.022, 0], [0.024, 0.02], [0.015, 0.04], [0.01, 0.05], [0.008, 0.06], [0, 0.07]], 10, cop); cp.position.set(0.065, 0.13, -0.01); cat.add(cp);
    cyl(cat, solid('#e8dcc0'), 0.025, 0.025, 0.03, 0.02, 0.09, 0.04, 10); var gd = new T.Mesh(new T.SphereGeometry(0.026, 12, 8, 0, D2, 0, Math.PI / 2), gold); gd.position.set(0.02, 0.12, 0.04); cat.add(gd);
    // the Wawel dragon statue by the river (it breathes fire!)
    var dr = new T.Group(); dr.position.set(0.3, 0.006, 0.27); g.add(dr);
    box(dr, solid('#5a5a50'), 0.04, 0.02, 0.04, 0, 0, 0);
    var body = new T.Mesh(new T.CylinderGeometry(0.012, 0.016, 0.07, 6), solid('#4a6a4a', { flatShading: true })); body.position.set(0, 0.05, 0); body.rotation.z = 0.3; dr.add(body); ball(dr, solid('#4a6a4a'), 0.014, -0.012, 0.09, 0);
    var fire = new T.Mesh(new T.ConeGeometry(0.01, 0.04, 6), solid('#ff8a2a', { emissive: 0xff5a00, emissiveIntensity: 0.6 })); fire.rotation.z = Math.PI / 2 + 0.3; fire.position.set(-0.04, 0.095, 0); dr.add(fire);
    return g;
  };

  /* ---------- Gur-e-Amir (Samarkand) ---------- */
  M.custom.gureamir = function () {
    var g = new T.Group();
    var tileT = tex('gur', 64, 64, function (x, w, h) { x.fillStyle = '#d8b88a'; x.fillRect(0, 0, w, h); for (var y = 0; y < h; y += 8) for (var k = 0; k < w; k += 8) { x.fillStyle = (y + k) % 16 ? '#2a6ab8' : '#38a8c8'; x.fillRect(k + 2, y + 2, 4, 4); } });
    var brick = mat(tileT, 2, 2), turq = solid('#2fa8c8', { flatShading: true }), blue = solid('#1f4a9a'), sand = solid('#d8c49a');
    blob(g, '#d8c8a0', 0.76, 0.62, 0, 0, 0.006, 5);
    // an eight-sided tomb under a ribbed turquoise dome (a melon-shaped dome with 64 ribs)
    cyl(g, brick, 0.12, 0.12, 0.13, 0, 0.006, -0.06, 8, Math.PI / 8);
    cyl(g, brick, 0.085, 0.09, 0.09, 0, 0.136, -0.06, 16);
    var tx = tex('gurdr', 128, 32, function (x, w, h) { x.fillStyle = '#1f4a9a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2ece0'; x.font = 'bold 18px serif'; for (var i = 0; i < 8; i++) { x.fillRect(i * 16 + 3, 8, 2, 16); x.fillRect(i * 16 + 3, 22, 10, 2); x.fillRect(i * 16 + 9, 12, 2, 10); } });
    var band = new T.Mesh(new T.CylinderGeometry(0.0905, 0.0905, 0.04, 24, 1, true), new T.MeshLambertMaterial({ map: tx })); band.position.set(0, 0.2, -0.06); g.add(band);
    var dg = new T.LatheGeometry([[0.088, 0], [0.11, 0.04], [0.115, 0.08], [0.1, 0.13], [0.06, 0.17], [0.02, 0.19], [0, 0.195]].map(function (p) { return new T.Vector2(p[0], p[1]); }), 64), dp = dg.attributes.position;
    for (var i = 0; i < dp.count; i++) { var x = dp.getX(i), z = dp.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z), k = 1 + 0.06 * Math.abs(Math.sin(a * 16)); dp.setX(i, Math.cos(a) * r * k); dp.setZ(i, Math.sin(a) * r * k); } dg.computeVertexNormals();
    var dome = new T.Mesh(dg, turq); dome.position.set(0, 0.226, -0.06); g.add(dome);
    cyl(g, solid('#d8ad4c'), 0.003, 0.003, 0.04, 0, 0.42, -0.06, 5); ball(g, solid('#d8ad4c'), 0.007, 0, 0.43, -0.06);
    // the tall front gate (iwan) with its blue tiled frame, and two minarets
    box(g, brick, 0.2, 0.22, 0.05, 0, 0.006, 0.12);
    var iw = new T.Shape(); iw.moveTo(-0.055, 0); iw.lineTo(-0.055, 0.12); iw.quadraticCurveTo(-0.055, 0.17, 0, 0.19); iw.quadraticCurveTo(0.055, 0.17, 0.055, 0.12); iw.lineTo(0.055, 0); iw.lineTo(-0.055, 0);
    var ism = new T.Mesh(new T.ShapeGeometry(iw), blue); ism.position.set(0, 0.006, 0.1455); g.add(ism);
    var in2 = new T.Mesh(new T.ShapeGeometry(iw), solid('#3a2a2a')); in2.scale.set(0.6, 0.6, 1); in2.position.set(0, 0.006, 0.146); g.add(in2);
    [-0.13, 0.13].forEach(function (x) { cyl(g, brick, 0.02, 0.024, 0.28, x, 0.006, 0.12, 10); cyl(g, solid('#e8dcc0'), 0.026, 0.024, 0.02, x, 0.286, 0.12, 10); cone(g, turq, 0.016, 0.03, x, 0.306, 0.12, 10); });
    // courtyard paving, rose bushes and a few visitors
    var pv = new T.Mesh(new T.PlaneGeometry(0.3, 0.2), sand); pv.rotation.x = -Math.PI / 2; pv.position.set(0, 0.008, 0.26); g.add(pv);
    for (var t = 0; t < 8; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#3f8a3f', { flatShading: true })); tr.position.set((t % 2 ? 1 : -1) * (0.24 + (t % 3) * 0.04), 0.06, -0.24 + t * 0.07); g.add(tr); cyl(g, solid('#7a5a3a'), 0.004, 0.006, 0.04, tr.position.x, 0.006, tr.position.z, 5); }
    for (var p = 0; p < 4; p++) person(g, -0.06 + p * 0.04, 0.27 + (p % 2) * 0.04, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#ffffff'][p]);
    return g;
  };

  /* ---------- Morro Castle (Havana) ---------- */
  M.custom.morrohavana = function () {
    var g = new T.Group(), st = mat(stoneTex('mhv', '#d8c49a', '#b0a078', 12, 6), 2, 1), st2 = solid('#c8b488', { flatShading: true }), rock = solid('#a89878', { flatShading: true });
    // the sea at the mouth of Havana harbour
    var sea = new T.Mesh(new T.CircleGeometry(0.46, 28), solid('#3a8ac8')); sea.rotation.x = -Math.PI / 2; sea.scale.y = 0.8; sea.position.y = 0.005; g.add(sea);
    var cliff = new T.Mesh(new T.CylinderGeometry(0.26, 0.3, 0.08, 9), rock); cliff.position.set(0.04, 0.04, -0.02); g.add(cliff);
    // the stone fortress on its rocky point: sloping walls in a star shape
    var fort = new T.Group(); fort.position.set(0.04, 0.08, -0.02); g.add(fort);
    var sh = new T.Shape(); [[-0.2, -0.12], [-0.06, -0.18], [0.12, -0.14], [0.2, 0.0], [0.1, 0.13], [-0.08, 0.15], [-0.22, 0.06]].forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); });
    var wl = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.004, bevelSegments: 1 }), st); wl.rotation.x = -Math.PI / 2; fort.add(wl);
    box(fort, st2, 0.12, 0.04, 0.1, -0.02, 0.06, 0.0);
    // the white lighthouse
    var lh = new T.Group(); lh.position.set(-0.17, 0.06, 0.02); fort.add(lh);
    cyl(lh, solid('#f2ece0'), 0.018, 0.024, 0.2, 0, 0, 0, 12); cyl(lh, solid('#3a3a3a'), 0.026, 0.026, 0.008, 0, 0.2, 0, 12);
    cyl(lh, solid('#fff6c8', { emissive: 0xffe08a, emissiveIntensity: 0.6 }), 0.014, 0.014, 0.022, 0, 0.208, 0, 10); cone(lh, solid('#3a3a3a'), 0.018, 0.02, 0, 0.23, 0, 10);
    // little guard towers on the corners and cannons along the wall
    [[0.2, 0.0], [-0.06, -0.18], [0.1, 0.13]].forEach(function (q) { cyl(fort, st2, 0.014, 0.016, 0.04, q[0], 0.06, -q[1], 8); var dm = new T.Mesh(new T.SphereGeometry(0.016, 8, 5, 0, D2, 0, Math.PI / 2), st2); dm.position.set(q[0], 0.1, -q[1]); fort.add(dm); });
    for (var c = 0; c < 5; c++) { var cn = new T.Mesh(new T.CylinderGeometry(0.004, 0.005, 0.04, 6), solid('#2a2a2a')); cn.rotation.x = Math.PI / 2; cn.position.set(-0.05 + c * 0.04, 0.07, 0.17); fort.add(cn); }
    // a classic old American car on the Malecón road across the water
    var mal = new T.Mesh(new T.BoxGeometry(0.4, 0.02, 0.06), solid('#d8d0c0')); mal.position.set(-0.1, 0.012, 0.4); mal.rotation.y = 0.2; g.add(mal);
    [['#e84a6a', -0.18], ['#3ac8d8', 0.02]].forEach(function (q) { var car = new T.Group(); car.position.set(q[1], 0.022, 0.4 - q[1] * 0.2); car.rotation.y = 0.2; g.add(car); box(car, solid(q[0]), 0.05, 0.012, 0.022, 0, 0, 0); box(car, solid(q[0]), 0.025, 0.01, 0.02, -0.003, 0.012, 0); });
    return g;
  };

  /* ---------- Jerash ---------- */
  M.custom.jerash = function () {
    var g = new T.Group(), lime = solid('#e2cfa8', { flatShading: true }), lime2 = mat(stoneTex('jrs', '#e2cfa8', '#c0ac84', 10, 5), 1, 1);
    blob(g, '#c9b48a', 0.78, 0.64, 0, 0, 0.006, 3);
    // the Oval Plaza: a big oval of paving ringed by tall Roman columns
    var pz = new T.Mesh(new T.CircleGeometry(0.2, 32), solid('#d8c8a4')); pz.rotation.x = -Math.PI / 2; pz.scale.set(1.25, 1, 1); pz.position.set(-0.05, 0.008, 0.06); g.add(pz);
    for (var i = 0; i < 26; i++) { var a = i / 26 * D2; if (a > 1.2 && a < 1.9) continue; var x = -0.05 + Math.cos(a) * 0.24, z = 0.06 + Math.sin(a) * 0.19;
      cyl(g, lime, 0.008, 0.009, 0.1, x, 0.008, z, 8); box(g, lime, 0.02, 0.008, 0.02, x, 0.108, z); }
    // the Cardo: a long street lined with columns running away from the plaza
    var cd = new T.Mesh(new T.PlaneGeometry(0.05, 0.3), solid('#c8b48e')); cd.rotation.x = -Math.PI / 2; cd.position.set(-0.05, 0.008, -0.27); g.add(cd);
    for (var k = 0; k < 7; k++) [-1, 1].forEach(function (s) { cyl(g, lime, 0.006, 0.007, 0.08, -0.05 + s * 0.035, 0.008, -0.14 - k * 0.04, 7); });
    // Hadrian's Arch, the Temple of Artemis columns, and the south theatre (a half-bowl of seats)
    var ha = new T.Group(); ha.position.set(-0.05, 0.006, 0.34); g.add(ha);
    box(ha, lime2, 0.2, 0.09, 0.03, 0, 0, 0); box(ha, lime2, 0.2, 0.012, 0.034, 0, 0.09, 0);
    [[-0.065, 0.025, 0.045], [0, 0.04, 0.07], [0.065, 0.025, 0.045]].forEach(function (q) { arch(ha, solid('#5a4a3a'), q[1], q[2], q[0], 0, 0.0155, 0.002); });
    var tmp = new T.Group(); tmp.position.set(0.24, 0.006, -0.12); g.add(tmp);
    box(tmp, lime2, 0.14, 0.03, 0.1, 0, 0, 0); for (var c = 0; c < 6; c++) cyl(tmp, lime, 0.008, 0.009, 0.15, -0.05 + c * 0.02, 0.03, 0.04, 8);
    var th = new T.Group(); th.position.set(0.25, 0.006, 0.18); g.add(th);
    for (var r = 0; r < 6; r++) { var ring = new T.Mesh(new T.CylinderGeometry(0.06 + r * 0.016, 0.06 + r * 0.016, 0.012, 20, 1, false, Math.PI * 0.5, Math.PI), lime); ring.position.y = 0.006 + r * 0.012; th.add(ring); }
    box(th, lime2, 0.2, 0.06, 0.02, 0, 0, 0.0);
    // olive trees and the modern town's hills behind
    for (var t = 0; t < 7; t++) { var tx = -0.34 + t * 0.11, tz = -0.4 + (t % 2) * 0.05; cyl(g, solid('#7a6a52'), 0.004, 0.006, 0.03, tx, 0.006, tz, 5); var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#7a9a5a', { flatShading: true })); tr.scale.y = 0.75; tr.position.set(tx, 0.05, tz); g.add(tr); }
    return g;
  };

  /* ---------- Great Mosque of Kairouan ---------- */
  M.custom.kairouan = function () {
    var g = new T.Group(), wall = mat(stoneTex('krw', '#e2cca0', '#c4ac80', 12, 6), 3, 1), w2 = solid('#e8d4a8', { flatShading: true }), wht = solid('#f2ece0');
    blob(g, '#d8c8a0', 0.78, 0.66, 0, 0, 0.006, 6);
    // thick fort-like walls with buttresses round a huge courtyard
    [[0, -0.2, 0.56, 0.02], [0, 0.2, 0.56, 0.02], [-0.28, 0, 0.02, 0.42], [0.28, 0, 0.02, 0.42]].forEach(function (q) { box(g, wall, q[2], 0.07, q[3], q[0], 0.006, q[1]); });
    for (var b = 0; b < 8; b++) [-1, 1].forEach(function (s) { box(g, w2, 0.025, 0.06, 0.02, -0.25 + b * 0.07, 0.006, s * 0.213); });
    var cy = new T.Mesh(new T.PlaneGeometry(0.34, 0.36), solid('#f2e8d0')); cy.rotation.x = -Math.PI / 2; cy.position.set(0.06, 0.008, 0); g.add(cy);
    // arcades round the courtyard
    for (var a = 0; a < 9; a++) [-1, 1].forEach(function (s) { arch(g, solid('#c8b080'), 0.025, 0.04, -0.1 + a * 0.035, 0.006, s * 0.17, 0.004); });
    // the prayer hall with its ribbed domes at the far end
    box(g, wall, 0.14, 0.08, 0.38, -0.19, 0.006, 0);
    [-0.12, 0.12].forEach(function (z) { cyl(g, w2, 0.03, 0.03, 0.02, -0.19, 0.086, z, 12); var dm = new T.Mesh(new T.SphereGeometry(0.03, 12, 6, 0, D2, 0, Math.PI / 2), w2); dm.scale.y = 1.2; dm.position.set(-0.19, 0.106, z); g.add(dm); });
    // the great square minaret: three stacked blocks, each smaller, with a little dome — one of the oldest in the world
    var mn = new T.Group(); mn.position.set(0.26, 0.006, 0); g.add(mn);
    box(mn, wall, 0.1, 0.2, 0.1, 0, 0, 0); box(mn, wall, 0.075, 0.07, 0.075, 0, 0.2, 0); box(mn, wall, 0.05, 0.04, 0.05, 0, 0.27, 0);
    var md = new T.Mesh(new T.SphereGeometry(0.025, 10, 6, 0, D2, 0, Math.PI / 2), w2); md.position.y = 0.31; mn.add(md);
    for (var w = 0; w < 3; w++) { var wd = new T.Mesh(new T.PlaneGeometry(0.014, 0.025), solid('#5a4a3a')); wd.position.set(0, 0.05 + w * 0.06, 0.0505); mn.add(wd); }
    crenels(mn, w2, 0.1, 0.1, 0.2, 0, 0, 0.012);
    // the sundial and water cistern in the courtyard, white houses of the old town
    cyl(g, wht, 0.015, 0.015, 0.02, 0.06, 0.008, 0, 10);
    for (var h = 0; h < 6; h++) { var hx = -0.32 + h * 0.13; box(g, wht, 0.08, 0.06, 0.07, hx, 0.006, 0.32); var dr = new T.Mesh(new T.PlaneGeometry(0.02, 0.035), solid('#2a6ab0')); dr.position.set(hx, 0.024, 0.356); g.add(dr); }
    return g;
  };

  /* ---------- Santa Catalina Arch (Antigua Guatemala) ---------- */
  M.custom.antigua = function () {
    var g = new T.Group(), yel = mat(tex('ant', 64, 64, function (x, w, h) { x.fillStyle = '#f2c84a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f8f2e2'; x.fillRect(0, 0, w, 4); x.fillRect(0, h - 4, w, 4); for (var i = 0; i < 4; i++) { x.fillStyle = 'rgba(160,110,30,.15)'; x.fillRect(Math.random() * w, Math.random() * h, 10, 6); } }), 1, 1), wht = solid('#f8f2e2'), cobble = solid('#8a8278');
    // a cobbled street…
    blob(g, '#9a9288', 0.76, 0.6, 0, 0, 0.006, 4);
    var st = new T.Mesh(new T.PlaneGeometry(0.12, 0.7), cobble); st.rotation.x = -Math.PI / 2; st.position.set(0, 0.008, 0.05); g.add(st);
    // …running under a bright yellow arch with a little clock tower on top (built so nuns could cross the street unseen)
    var ar = new T.Group(); ar.position.set(0, 0.006, 0.0); g.add(ar);
    box(ar, yel, 0.06, 0.09, 0.08, -0.09, 0, 0); box(ar, yel, 0.06, 0.09, 0.08, 0.09, 0, 0); box(ar, yel, 0.24, 0.05, 0.08, 0, 0.09, 0);
    var hole = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.0805, 16, 1, false, -Math.PI / 2, Math.PI), solid('#3a2a20')); hole.rotation.x = Math.PI / 2; hole.position.set(0, 0.09, 0); ar.add(hole);
    box(ar, yel, 0.07, 0.07, 0.06, 0, 0.14, 0); var ck = new T.Mesh(new T.CircleGeometry(0.018, 14), wht); ck.position.set(0, 0.175, 0.0305); ar.add(ck);
    var cr = new T.Mesh(new T.CylinderGeometry(0.012, 0.03, 0.04, 4), solid('#e0a838')); cr.rotation.y = Math.PI / 4; cr.position.y = 0.23; ar.add(cr); cyl(ar, wht, 0.003, 0.003, 0.02, 0, 0.25, 0, 4);
    for (var w = 0; w < 4; w++) { var wd = new T.Mesh(new T.PlaneGeometry(0.014, 0.022), solid('#5a4a3a')); wd.position.set(-0.075 + w * 0.05, 0.115, 0.0405); ar.add(wd); }
    // colourful one-storey colonial houses along the street
    var cols = ['#e86a5a', '#5ab0d8', '#f2a03a', '#8ac06a', '#c88ad0', '#f2d84a'];
    for (var h = 0; h < 6; h++) { var s = h % 2 ? 1 : -1, hz = 0.12 + Math.floor(h / 2) * 0.1 - 0.05; var hb = box(g, solid(cols[h]), 0.1, 0.05, 0.09, s * 0.12, 0.006, hz); hipRoof(g, solid('#b8603a', { flatShading: true }), 0.1, 0.09, 0.02, s * 0.12, 0.056, hz, 0.006);
      var dr = new T.Mesh(new T.PlaneGeometry(0.018, 0.03), solid('#5a3a28')); dr.position.set(s * 0.069, 0.022, hz); dr.rotation.y = -s * Math.PI / 2; g.add(dr); }
    // the Agua volcano rising behind the town
    mountain(g, { r: function (t) { return 0.3 * Math.pow(1 - t, 1.1) + 0.02; }, h: 0.5, pos: [0.05, -0.42], colour: function (x, y) { return y > 0.4 ? '#7a8a6a' : y > 0.25 ? '#4f8a3f' : '#3f7a35'; }, seed: 5, bump: 0.12 });
    for (var p = 0; p < 4; p++) person(g, -0.03 + p * 0.02, 0.15 + p * 0.05, 1.1, ['#c0392b', '#2b6fd6', '#f2c14e', '#7a4ab0'][p]);
    return g;
  };

  /* ---------- Svetitskhoveli Cathedral (Mtskheta) ---------- */
  M.custom.svetitskhoveli = function () {
    var g = new T.Group(), st = mat(stoneTex('svt', '#d8c8a0', '#b8a880', 10, 6), 1, 1), st2 = solid('#cdbd94', { flatShading: true }), roof = solid('#7a8a6a', { flatShading: true }), wall = mat(stoneTex('svw', '#c8b890', '#a89870', 12, 6), 4, 1);
    blob(g, '#6aa04f', 0.78, 0.64, 0, 0, 0.006, 5);
    // a fortress wall with towers all round the church
    var sq = [[-0.3, -0.26], [0.3, -0.26], [0.3, 0.26], [-0.3, 0.26]];
    for (var i = 0; i < 4; i++) { var a = sq[i], b = sq[(i + 1) % 4], cx = (a[0] + b[0]) / 2, cz = (a[1] + b[1]) / 2, w = Math.abs(b[0] - a[0]) || 0.02, d = Math.abs(b[1] - a[1]) || 0.02; box(g, wall, w, 0.06, d, cx, 0.006, cz); cyl(g, st2, 0.028, 0.03, 0.09, a[0], 0.006, a[1], 8); cone(g, roof, 0.034, 0.04, a[0], 0.096, a[1], 8); }
    var gate = new T.Mesh(new T.PlaneGeometry(0.04, 0.045), solid('#3a2a20')); gate.position.set(0, 0.03, 0.271); g.add(gate);
    // the cathedral: a cross-shaped stone church with a tall drum and a pointed cone roof in the middle (Georgian style)
    box(g, st, 0.3, 0.12, 0.12, 0, 0.006, -0.02); box(g, st, 0.12, 0.12, 0.26, 0, 0.006, -0.02);
    ridge(g, roof, 0.12, 0.04, 0.3, 0, 0.126, -0.02, Math.PI / 2); ridge(g, roof, 0.12, 0.04, 0.26, 0, 0.126, -0.02, 0);
    cyl(g, st, 0.045, 0.045, 0.1, 0, 0.13, -0.02, 12);
    for (var k = 0; k < 12; k++) { var ka = k / 12 * D2, wn = new T.Mesh(new T.PlaneGeometry(0.008, 0.03), solid('#3a3a3a')); wn.position.set(Math.cos(ka) * 0.0455, 0.19, -0.02 + Math.sin(ka) * 0.0455); wn.rotation.y = -ka + Math.PI / 2; g.add(wn); }
    cone(g, roof, 0.055, 0.08, 0, 0.23, -0.02, 12); cyl(g, solid('#d8ad4c'), 0.002, 0.002, 0.03, 0, 0.31, -0.02, 4); box(g, solid('#d8ad4c'), 0.016, 0.003, 0.003, 0, 0.33, -0.02);
    // carved arches on the walls and the little bell tower by the gate
    for (var a2 = 0; a2 < 4; a2++) arch(g, solid('#b8a478'), 0.018, 0.06, -0.12 + a2 * 0.08 + (a2 > 1 ? 0.0 : 0), 0.02, 0.041, 0.002);
    box(g, st, 0.04, 0.08, 0.04, 0.1, 0.006, 0.2); cone(g, roof, 0.035, 0.035, 0.1, 0.086, 0.2, 4, Math.PI / 4);
    // cypress trees and the river valley hills
    for (var t = 0; t < 8; t++) { var tx = (t % 2 ? 1 : -1) * (0.15 + (t % 3) * 0.04), tz = -0.2 + Math.floor(t / 2) * 0.12; if (Math.abs(tz) > 0.24) continue; var cp = new T.Mesh(new T.ConeGeometry(0.014, 0.1, 6), solid('#2f6f3a')); cp.position.set(tx, 0.056, tz); g.add(cp); }
    return g;
  };
})();
