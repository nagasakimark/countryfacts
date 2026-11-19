/* Detailed landmarks, batch 28: Maqam Echahid, Grand Mosque of Bobo-Dioulasso, Fiat Tagliero, La Mano (Punta del Este),
   Airai Bai, León Cathedral, Kolossi Castle, Cristo Rei of Dili. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }

  /* ---------- Maqam Echahid (Martyrs' Memorial, Algiers) ---------- */
  M.custom.maqam = function () {
    var g = new T.Group(), conc = solid('#e8e2d8', { flatShading: true });
    blob(g, '#8aa860', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.08, r: function (t) { return 0.2 * (1 - t) + 0.22; }, bump: 0.1, colour: function () { return '#8aa860'; } });
    box(g, solid('#d8d2c4'), 0.34, 0.03, 0.34, 0, 0.08, 0);
    // three giant concrete palm leaves leaning together, held by a ring near the top
    var Y = 0.11;
    for (var i = 0; i < 3; i++) { var a = i / 3 * D2, sh = new T.Shape(); sh.moveTo(0.004, 0); sh.lineTo(0.12, 0); sh.quadraticCurveTo(0.1, 0.3, 0.012, 0.5); sh.lineTo(0.004, 0.5); sh.lineTo(0.004, 0);
      var lf = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false }), conc); var w = new T.Group(); lf.position.z = -0.007; w.add(lf); w.rotation.y = a; w.position.y = Y; g.add(w); }
    var ring = new T.Mesh(new T.TorusGeometry(0.035, 0.008, 6, 18), conc); ring.rotation.x = Math.PI / 2; ring.position.y = Y + 0.38; g.add(ring);
    var fl = new T.Mesh(new T.OctahedronGeometry(0.012, 0), solid('#f2c94a', { emissive: '#ff8a00' })); fl.position.y = Y + 0.03; g.add(fl);
    // soldier statues at the foot of each leaf
    for (var s = 0; s < 3; s++) { var b = s / 3 * D2 + Math.PI / 3; var st = new T.Mesh(new T.CapsuleGeometry(0.012, 0.04, 3, 6), solid('#6a5a4a')); st.position.set(Math.cos(b) * 0.1, Y + 0.035, Math.sin(b) * 0.1); g.add(st); }
    // the bay of Algiers and white city
    var sea = new T.Mesh(new T.PlaneGeometry(0.7, 0.14), solid('#2f8fc0')); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.008, 0.46); g.add(sea);
    for (var h = 0; h < 8; h++) { var x = -0.5 + h * 0.14, z = 0.3 + hash(h, 2) * 0.05; box(g, solid('#f6f2ea'), 0.06, 0.03 + hash(h, 3) * 0.04, 0.05, x, 0.006, z); }
    return g;
  };

  /* ---------- Grand Mosque of Bobo-Dioulasso ---------- */
  M.custom.bobo = function () {
    var g = new T.Group(), mud = mat(tex('bobo', 32, 32, function (c, W, H) { c.fillStyle = '#e8dcc4'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(120,90,60,.25)'; for (var i = 0; i < 40; i++) c.fillRect((i * 11) % W, (i * 23) % H, 3, 2); }), 2, 1), wood = solid('#6a4a2a'), w = solid('#e8dcc4');
    blob(g, '#c99a6a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a long white-washed mud hall with buttresses and two cone towers bristling with sticks
    box(g, mud, 0.5, 0.08, 0.26, 0, 0.006, -0.05);
    for (var b = 0; b < 9; b++) { var x = -0.24 + b * 0.06, cn = new T.Mesh(new T.ConeGeometry(0.014, 0.12, 6), w); cn.position.set(x, 0.07, 0.085); g.add(cn); for (var k = 0; k < 2; k++) { var st = new T.Mesh(new T.CylinderGeometry(0.002, 0.002, 0.03, 3), wood); st.rotation.x = Math.PI / 2; st.position.set(x, 0.05 + k * 0.03, 0.095); g.add(st); } }
    [[-0.15, -0.05, 0.3], [0.15, -0.12, 0.22]].forEach(function (q) { var tw = new T.Mesh(new T.CylinderGeometry(0.02, 0.07, q[2], 8), mud); tw.position.set(q[0], 0.006 + q[2] / 2, q[1]); g.add(tw);
      for (var l = 0; l < 7; l++) for (var s = 0; s < 6; s++) { var a = s / 6 * D2 + l * 0.5, y = 0.03 + l * q[2] / 8, r = 0.07 - (0.05 * l / 8), p = new T.Mesh(new T.CylinderGeometry(0.002, 0.002, 0.04, 3), wood); p.rotation.z = Math.PI / 2; p.rotation.y = -a; p.position.set(q[0] + Math.cos(a) * r, y, q[1] + Math.sin(a) * r); g.add(p); }
      var tip = new T.Mesh(new T.SphereGeometry(0.012, 6, 4), w); tip.position.set(q[0], q[2] + 0.012, q[1]); g.add(tip); });
    for (var t = 0; t < 4; t++) { var c = new T.Mesh(new T.SphereGeometry(0.08, 8, 6), solid('#4f8a3f', { flatShading: true })); c.scale.y = 0.5; c.position.set(-0.45 + t * 0.3, 0.13, 0.4); g.add(c); cyl(g, solid('#6a4a2a'), 0.01, 0.014, 0.1, -0.45 + t * 0.3, 0.006, 0.4, 5); }
    return g;
  };

  /* ---------- Fiat Tagliero (Asmara) ---------- */
  M.custom.fiattagliero = function () {
    var g = new T.Group(), wht = solid('#f2ece0'), glass = solid('#5a7a8a');
    blob(g, '#d8c8a8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a 1930s service station shaped like an aeroplane: central tower and two long cantilevered wings
    var body = lathe([[0.07, 0], [0.07, 0.09], [0.055, 0.12], [0.03, 0.14], [0, 0.14]], 16, wht); body.position.y = 0.006; g.add(body);
    cyl(g, glass, 0.072, 0.072, 0.04, 0, 0.03, 0, 16);
    box(g, wht, 0.04, 0.18, 0.04, 0, 0.006, -0.05);
    [-1, 1].forEach(function (sd) { var wing = new T.Mesh(new T.BoxGeometry(0.3, 0.012, 0.12), wht); wing.position.set(sd * 0.2, 0.1, 0); var p = wing.geometry.attributes.position; for (var i = 0; i < p.count; i++) { if (p.getX(i) * sd > 0) p.setZ(i, p.getZ(i) * 0.5); } wing.geometry.computeVertexNormals(); g.add(wing); var st = new T.Mesh(new T.CylinderGeometry(0.005, 0.005, 0.09, 4), wht); st.position.set(sd * 0.09, 0.05, 0); g.add(st); });
    box(g, solid('#c9402a'), 0.012, 0.012, 0.004, 0, 0.17, -0.03);
    // petrol pumps, an old car, palm trees and jacarandas along the street
    [-0.06, 0.06].forEach(function (x) { box(g, solid('#c9402a'), 0.016, 0.04, 0.012, x, 0.006, 0.1); });
    var car = new T.Group(); box(car, solid('#3f6ab0'), 0.07, 0.02, 0.035, 0, 0.008, 0); box(car, solid('#3f6ab0'), 0.04, 0.016, 0.03, -0.005, 0.028, 0); car.position.set(0.15, 0.006, 0.2); g.add(car);
    var rd = new T.Mesh(new T.PlaneGeometry(1.1, 0.12), solid('#8a8a88')); rd.rotation.x = -Math.PI / 2; rd.position.set(0, 0.008, 0.3); rd.scale.x = 0.85; g.add(rd);
    for (var t = 0; t < 6; t++) palm(g, -0.4 + t * 0.16, 0.42, 1.0);
    for (var j = 0; j < 4; j++) { var c = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), solid('#9a7ac8', { flatShading: true })); c.scale.y = 0.6; c.position.set(-0.45 + j * 0.3, 0.1, -0.35); g.add(c); cyl(g, solid('#6a4a2a'), 0.006, 0.008, 0.08, -0.45 + j * 0.3, 0.006, -0.35, 5); }
    return g;
  };

  /* ---------- La Mano (Punta del Este) ---------- */
  M.custom.lamano = function () {
    var g = new T.Group(), conc = solid('#e8e4dc', { flatShading: true });
    blob(g, '#3a9fc8', 0.74, 0.62, 0, 0.1, 0.006, 5);
    blob(g, '#f2e6c8', 0.6, 0.3, 0, -0.18, 0.012, 3);
    // five giant fingers rising out of the sand, as if a hand is coming up from below
    [[-0.17, 0.05, 0.16, -0.3], [-0.07, -0.05, 0.24, -0.08], [0.03, -0.08, 0.26, 0.02], [0.13, -0.04, 0.22, 0.12], [0.22, 0.03, 0.17, 0.3]].forEach(function (f, k) {
      var fg = new T.Group(), seg = 3, h = f[2] / seg;
      for (var s = 0; s < seg; s++) { var c = new T.Mesh(new T.CylinderGeometry(0.03 - s * 0.003, 0.034 - s * 0.003, h, 8), conc); c.position.y = h * s + h / 2; fg.add(c); var j = new T.Mesh(new T.SphereGeometry(0.031 - s * 0.003, 8, 6), conc); j.position.y = h * (s + 1); fg.add(j); }
      fg.position.set(f[0], 0.012, f[1] - 0.12); fg.rotation.z = -f[3] * 0.6; fg.rotation.x = 0.1; g.add(fg); });
    // beach umbrellas and people
    [['#d04a2a', -0.35, 0.05], ['#e8c34a', 0.38, 0.0], ['#3f6ab0', 0.25, 0.12]].forEach(function (u) { cyl(g, solid('#eeeeee'), 0.003, 0.003, 0.06, u[1], 0.012, u[2], 4); var um = new T.Mesh(new T.ConeGeometry(0.04, 0.02, 10), solid(u[0])); um.position.set(u[1], 0.08, u[2]); g.add(um); });
    for (var w = 0; w < 3; w++) { var wv = new T.Mesh(new T.PlaneGeometry(0.9 - w * 0.12, 0.008), solid('#ffffff')); wv.rotation.x = -Math.PI / 2; wv.position.set(0, 0.009, 0.18 + w * 0.06); g.add(wv); }
    return g;
  };

  /* ---------- Airai Bai (Palau) ---------- */
  M.custom.palaubai = function () {
    var g = new T.Group(), wood = solid('#8a5a32'), thatch = mat(tex('bai', 32, 32, function (c, W, H) { c.fillStyle = '#8a7a4a'; c.fillRect(0, 0, W, H); c.strokeStyle = 'rgba(40,30,10,.4)'; for (var y = 0; y < H; y += 3) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + 1); c.stroke(); } }), 2, 2);
    var gable = mat(tex('baig', 64, 64, function (c, W, H) { c.fillStyle = '#c9402a'; c.fillRect(0, 0, W, H); var cols = ['#f2e8c8', '#1a1a1a', '#e8c34a']; for (var r = 0; r < 5; r++) for (var k = 0; k < 6; k++) { c.fillStyle = cols[(r + k) % 3]; c.beginPath(); c.moveTo(k * 11 + 3, H - r * 12 - 2); c.lineTo(k * 11 + 8, H - r * 12 - 10); c.lineTo(k * 11 + 13, H - r * 12 - 2); c.fill(); } }), 1, 1);
    blob(g, '#4f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // a raised meeting house on stone footings with a tall steep thatched roof and painted gables
    box(g, solid('#7a7468'), 0.36, 0.03, 0.16, 0, 0.006, 0);
    for (var p = 0; p < 6; p++) [-1, 1].forEach(function (sd) { cyl(g, wood, 0.008, 0.008, 0.06, -0.15 + p * 0.06, 0.036, sd * 0.065, 5); });
    box(g, wood, 0.34, 0.012, 0.14, 0, 0.09, 0);
    var sh = new T.Shape(); sh.moveTo(-0.11, 0); sh.lineTo(0.11, 0); sh.quadraticCurveTo(0.02, 0.1, 0, 0.26); sh.quadraticCurveTo(-0.02, 0.1, -0.11, 0);
    var rf = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.34, bevelEnabled: false }), thatch); rf.rotation.y = Math.PI / 2; rf.position.set(-0.17, 0.1, 0); g.add(rf);
    [-0.172, 0.172].forEach(function (x) { var gb = new T.Mesh(new T.ShapeGeometry(sh), gable); gb.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2; gb.position.set(x, 0.1, 0); gb.scale.set(0.92, 0.92, 1); g.add(gb); });
    // stone path and the Rock Islands in the lagoon beyond
    for (var s = 0; s < 6; s++) box(g, solid('#9a9488'), 0.04, 0.006, 0.03, 0.25 + s * 0.04, 0.006, 0.12 + s * 0.04);
    var lag = new T.Mesh(new T.CircleGeometry(0.25, 16), solid('#4ac0c8')); lag.rotation.x = -Math.PI / 2; lag.scale.y = 0.5; lag.position.set(-0.25, 0.009, -0.42); g.add(lag);
    for (var r = 0; r < 4; r++) { var rk = new T.Mesh(new T.SphereGeometry(0.04, 8, 6), solid('#3f8a3f', { flatShading: true })); rk.scale.y = 1.1; rk.position.set(-0.4 + r * 0.1, 0.03, -0.42 + hash(r, 1) * 0.05); g.add(rk); }
    for (var t = 0; t < 5; t++) palm(g, 0.3 + (t % 2) * 0.12, -0.3 + t * 0.08, 1.2);
    return g;
  };

  /* ---------- León Cathedral (Nicaragua) ---------- */
  M.custom.leoncath = function () {
    var g = new T.Group(), wm = mat(winTex('lnc', '#f6f2ea', '#c9c0b0', 6, 2, { tall: 0.6 }), 1, 1), w = solid('#f6f2ea');
    blob(g, '#d8d0c0', 0.74, 0.62, 0, 0, 0.006, 3);
    // a broad, low whitewashed cathedral built strong against earthquakes, with two squat towers
    box(g, wm, 0.36, 0.12, 0.36, 0, 0.006, -0.1);
    box(g, w, 0.38, 0.006, 0.38, 0, 0.126, -0.1);
    // its famous white roof of little domes you can walk on
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) domeOn(g, w, 0.03, 0.035, -0.12 + c * 0.08, 0.132, -0.22 + r * 0.08, 10);
    domeOn(g, w, 0.06, 0.08, 0, 0.132, -0.18, 16);
    var lan = cyl(g, w, 0.012, 0.016, 0.03, 0, 0.21, -0.18, 8);
    [-0.13, 0.13].forEach(function (x) { box(g, w, 0.09, 0.2, 0.08, x, 0.006, 0.1); box(g, w, 0.07, 0.06, 0.06, x, 0.206, 0.1); arch(g, solid('#a8a090'), 0.03, 0.03, x, 0.22, 0.131, 0.002); domeOn(g, w, 0.035, 0.04, x, 0.266, 0.1, 10); });
    box(g, w, 0.18, 0.16, 0.04, 0, 0.006, 0.12);
    var ped = new T.Mesh(new T.ConeGeometry(0.07, 0.04, 3), w); ped.rotation.set(Math.PI / 2, 0, 0); ped.scale.set(1.3, 0.25, 1); ped.position.set(0, 0.18, 0.12); g.add(ped);
    // lions on the steps and palms on the plaza
    [-0.06, 0.06].forEach(function (x) { var l = new T.Mesh(new T.BoxGeometry(0.02, 0.02, 0.035), solid('#d8d0c0')); l.position.set(x, 0.016, 0.18); g.add(l); });
    for (var p = 0; p < 6; p++) palm(g, -0.45 + p * 0.18, 0.38, 1.1);
    return g;
  };

  /* ---------- Kolossi Castle ---------- */
  M.custom.kolossi = function () {
    var g = new T.Group(), st = mat(stoneTex('kol', '#d8c49a', '#bca478', 6, 8), 1, 2);
    blob(g, '#a8a868', 0.74, 0.62, 0, 0, 0.006, 3);
    // a square three-storey keep with battlements and a machicolation over the door
    box(g, st, 0.24, 0.32, 0.24, 0, 0.006, -0.05);
    for (var i = 0; i < 6; i++) { [[-0.11 + i * 0.044, 0.07], [-0.11 + i * 0.044, -0.17], [0.11, -0.16 + i * 0.044], [-0.11, -0.16 + i * 0.044]].forEach(function (q) { box(g, st, 0.022, 0.025, 0.022, q[0], 0.326, q[1]); }); }
    box(g, st, 0.06, 0.04, 0.03, 0, 0.27, 0.085);
    for (var w = 0; w < 3; w++) box(g, solid('#3a3020'), 0.018, 0.03, 0.002, -0.06 + w * 0.06, 0.15 + (w % 2) * 0.08, 0.071);
    box(g, solid('#3a3020'), 0.03, 0.05, 0.002, 0, 0.006, 0.071);
    // the old sugar factory ruin and its aqueduct next door
    box(g, st, 0.2, 0.08, 0.1, 0.3, 0.006, 0.0); for (var a = 0; a < 3; a++) arch(g, solid('#bca478'), 0.04, 0.05, 0.24 + a * 0.06, 0.006, 0.051, 0.002);
    for (var aq = 0; aq < 5; aq++) { box(g, st, 0.025, 0.08, 0.025, -0.4 + aq * 0.06, 0.006, 0.25); } box(g, st, 0.28, 0.02, 0.03, -0.28, 0.086, 0.25);
    // vineyards and citrus orchards
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) { var o = new T.Mesh(new T.SphereGeometry(0.018, 6, 4), solid(r % 2 ? '#4f8a3f' : '#6a9a3f', { flatShading: true })); o.position.set(-0.45 + c * 0.07, 0.024, -0.3 - r * 0.06); g.add(o); if (c % 2 === 0 && r % 2) { var or = new T.Mesh(new T.SphereGeometry(0.005, 4, 3), solid('#ff9a1a')); or.position.set(-0.45 + c * 0.07 + 0.012, 0.03, -0.3 - r * 0.06 + 0.012); g.add(or); } }
    return g;
  };

  /* ---------- Cristo Rei of Dili ---------- */
  M.custom.cristorei = function () {
    var g = new T.Group(), copper = solid('#c9ccd0', { metalness: 0.4, roughness: 0.4 });
    blob(g, '#3a9fc8', 0.74, 0.62, 0, 0.1, 0.006, 5);
    // a headland at the tip of the cape, a long stairway up it
    mountain(g, { h: 0.26, pos: [0, -0.15], rings: 12, r: function (t) { return 0.36 * (1 - t) + 0.07; }, sx: 1.4, bump: 0.2, colour: function (x, y) { return y > 0.15 ? '#5f9a45' : '#8aa860'; } });
    var pts = []; for (var p = 0; p <= 30; p++) { var t = p / 30; pts.push(new T.Vector3(Math.sin(t * 9) * 0.08 + 0.1, 0.012 + t * 0.25, 0.25 - t * 0.38)); }
    g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, 0.006, 3), solid('#e8e2d4')));
    // a globe-shaped plinth and the statue with open arms
    var Y = 0.26, Z = -0.13;
    var gl = new T.Mesh(new T.SphereGeometry(0.04, 12, 8), solid('#8a9aa8')); gl.position.set(0, Y + 0.035, Z); g.add(gl);
    var robe = lathe([[0.022, 0], [0.025, 0.06], [0.018, 0.12], [0.012, 0.14], [0, 0.14]], 10, copper); robe.position.set(0, Y + 0.07, Z); g.add(robe);
    var hd = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), copper); hd.position.set(0, Y + 0.225, Z); g.add(hd);
    var arms = new T.Mesh(new T.BoxGeometry(0.14, 0.012, 0.012), copper); arms.position.set(0, Y + 0.195, Z); g.add(arms);
    // beach and fishing boats
    blob(g, '#f2e6c8', 0.5, 0.08, 0, 0.32, 0.012, 2);
    for (var b = 0; b < 3; b++) { var bt = new T.Group(); box(bt, solid(['#d04a2a', '#3f6ab0', '#e8c34a'][b]), 0.06, 0.012, 0.016, 0, 0, 0); box(bt, solid('#6a4a2a'), 0.004, 0.004, 0.05, 0, 0.004, 0); bt.position.set(-0.3 + b * 0.25, 0.008, 0.45); bt.rotation.y = 0.3 * b; g.add(bt); }
    return g;
  };
})();
