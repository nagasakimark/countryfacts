/* Detailed landmarks, batch 38: Palacio de Bellas Artes, Templo Mayor, Minar-e-Pakistan, Valley of the Kings,
   Ajanta Caves, Beijing National Stadium, Changdeokgung Palace, Dol Hareubang (Jeju). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function domeOn(g, m, r, h, x, y, z, seg) { var d = lathe([[r, 0], [r * 0.98, h * 0.3], [r * 0.85, h * 0.6], [r * 0.55, h * 0.88], [0, h]], seg || 16, m); d.position.set(x, y, z); g.add(d); return d; }
  function curvedRoof(g, m, w, d, h, x, y, z, ry) { var s = new T.Shape(); s.moveTo(-d / 2 - 0.012, -0.004); s.quadraticCurveTo(-d / 4, h * 0.25, 0, h); s.quadraticCurveTo(d / 4, h * 0.25, d / 2 + 0.012, -0.004); s.lineTo(-d / 2 - 0.012, -0.004);
    var r = new T.Mesh(new T.ExtrudeGeometry(s, { depth: w, bevelEnabled: false }), m); r.rotation.y = Math.PI / 2; var o = new T.Group(); r.position.set(-w / 2, 0, 0); o.add(r); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o); return o; }

  /* ---------- Palacio de Bellas Artes ---------- */
  M.custom.bellasartes = function () {
    var g = new T.Group(), mar = mat(winTex('pba', '#f2ece0', '#8a9aa8', 8, 3, { tall: 0.6 }), 2, 1), w = solid('#f2ece0'), gold = solid('#e8a83a', { flatShading: true }), blue = solid('#3a6ab0');
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // a white marble palace with a big orange-and-gold tiled central dome and smaller domes
    box(g, mar, 0.42, 0.14, 0.26, 0, 0.006, -0.04);
    box(g, mar, 0.16, 0.18, 0.04, 0, 0.006, 0.1);
    for (var c = 0; c < 6; c++) cyl(g, w, 0.008, 0.008, 0.14, -0.06 + c * 0.024, 0.006, 0.125, 8);
    cyl(g, w, 0.08, 0.08, 0.04, 0, 0.146, -0.04, 16);
    var dm = lathe([[0.085, 0], [0.085, 0.02], [0.075, 0.06], [0.055, 0.1], [0.025, 0.13], [0, 0.14]], 16, gold); dm.position.set(0, 0.186, -0.04); g.add(dm);
    for (var r = 0; r < 4; r++) { var band = new T.Mesh(new T.TorusGeometry(0.083 - r * 0.012, 0.003, 3, 20), blue); band.rotation.x = Math.PI / 2; band.position.set(0, 0.2 + r * 0.03, -0.04); g.add(band); }
    var eag = new T.Mesh(new T.OctahedronGeometry(0.012, 0), solid('#2a5a3a')); eag.position.set(0, 0.34, -0.04); g.add(eag);
    [[-0.17, 0.0], [0.17, 0.0]].forEach(function (q) { domeOn(g, gold, 0.03, 0.04, q[0], 0.146, q[1], 10); });
    // the Alameda park with fountains in front
    var pk = new T.Mesh(new T.PlaneGeometry(0.8, 0.22), solid('#5f9a45')); pk.rotation.x = -Math.PI / 2; pk.position.set(0, 0.008, 0.35); pk.scale.x = 0.85; g.add(pk);
    for (var t = 0; t < 8; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), solid('#3f8a3f', { flatShading: true })); tr.position.set(-0.32 + t * 0.09, 0.05, 0.38 + (t % 2) * 0.04); g.add(tr); }
    return g;
  };

  /* ---------- Templo Mayor ---------- */
  M.custom.templomayor = function () {
    var g = new T.Group(), st = mat(stoneTex('tmy', '#a89a80', '#8a7e66', 8, 6), 1, 1), red = solid('#b8402a'), blue = solid('#3a7ab0');
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // the twin-temple pyramid of the Aztec city Tenochtitlan (shown rebuilt), with two staircases and two shrines
    for (var l = 0; l < 4; l++) box(g, st, 0.44 - l * 0.07, 0.05, 0.36 - l * 0.06, 0, 0.006 + l * 0.05, -0.05);
    [-0.06, 0.06].forEach(function (x, k) { var sp = new T.Mesh(new T.BoxGeometry(0.06, 0.012, 0.3), solid('#c9bca0')); sp.rotation.x = 0.68; sp.position.set(x, 0.1, 0.06); g.add(sp);
      box(g, k ? blue : red, 0.08, 0.06, 0.08, x * 1.6, 0.206, -0.06); var rf = new T.Mesh(new T.ConeGeometry(0.05, 0.05, 4), k ? blue : red); rf.rotation.y = Math.PI / 4; rf.position.set(x * 1.6, 0.291, -0.06); g.add(rf); });
    // serpent heads at the foot of the stairs
    [-0.1, 0.1].forEach(function (x) { var sn = new T.Mesh(new T.BoxGeometry(0.03, 0.025, 0.04), solid('#7a8a5a')); sn.position.set(x, 0.018, 0.22); g.add(sn); });
    // the cathedral of Mexico City nearby, and an eagle on a cactus (the symbol of the city)
    box(g, mat(winTex('mcc', '#c9b8a0', '#5a4a3a', 4, 2), 1, 1), 0.16, 0.12, 0.1, -0.38, 0.006, -0.3); [-0.43, -0.33].forEach(function (x) { box(g, solid('#c9b8a0'), 0.03, 0.18, 0.03, x, 0.006, -0.25); });
    cyl(g, solid('#4f8a3f'), 0.012, 0.014, 0.06, 0.35, 0.006, 0.3, 6); [-1, 1].forEach(function (sd) { var pd = new T.Mesh(new T.SphereGeometry(0.018, 6, 4), solid('#4f8a3f')); pd.scale.set(0.4, 1, 0.9); pd.position.set(0.35 + sd * 0.02, 0.06, 0.3); g.add(pd); }); var eg = new T.Mesh(new T.ConeGeometry(0.012, 0.03, 5), solid('#6a4a2a')); eg.position.set(0.35, 0.085, 0.3); g.add(eg);
    return g;
  };

  /* ---------- Minar-e-Pakistan ---------- */
  M.custom.minarpak = function () {
    var g = new T.Group(), w = solid('#f2ece0', { flatShading: true }), st = solid('#c9b090');
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // a tall tower that rises from a base shaped like a flower, with balconies and a small dome
    var base = new T.Group(); for (var p = 0; p < 4; p++) { var a = p * Math.PI / 2, pt = new T.Mesh(new T.CylinderGeometry(0.05, 0.08, 0.06, 6, 1, false, 0, Math.PI), st); pt.position.set(Math.cos(a) * 0.08, 0.036, Math.sin(a) * 0.08); pt.rotation.y = -a + Math.PI / 2; base.add(pt); } g.add(base);
    box(g, solid('#d8c8a8'), 0.18, 0.06, 0.18, 0, 0.006, 0);
    var tw = lathe([[0.05, 0], [0.045, 0.1], [0.035, 0.3], [0.03, 0.4], [0, 0.4]], 16, w); tw.position.y = 0.066; g.add(tw);
    [0.18, 0.3, 0.42].forEach(function (y) { cyl(g, w, 0.05, 0.05, 0.008, 0, y, 0, 16); });
    domeOn(g, w, 0.025, 0.035, 0, 0.466, 0, 12); var fn = new T.Mesh(new T.ConeGeometry(0.004, 0.025, 5), solid('#d8b04a')); fn.position.y = 0.512; g.add(fn);
    // the Iqbal Park lawns and paths, fountains
    for (var r = 0; r < 4; r++) { var a2 = r * Math.PI / 2 + Math.PI / 4, pa = new T.Mesh(new T.PlaneGeometry(0.04, 0.35), solid('#d8d0c0')); pa.rotation.x = -Math.PI / 2; pa.rotation.z = a2; pa.position.set(Math.cos(a2) * 0.28, 0.008, -Math.sin(a2) * 0.28); g.add(pa); }
    for (var t = 0; t < 10; t++) { var a3 = t / 10 * D2; tree(g, Math.cos(a3) * 0.52, Math.sin(a3) * 0.44, 1.0, '#3f8a3f'); }
    return g;
  };

  /* ---------- Valley of the Kings ---------- */
  M.custom.valleykings = function () {
    var g = new T.Group(), rock = solid('#d8a870', { flatShading: true }), dark = solid('#3a2a1a');
    blob(g, '#e0c090', 0.74, 0.62, 0, 0, 0.006, 3);
    // a dry valley among bare hills, with tomb doorways cut into the slopes, and the pyramid-shaped peak above
    mountain(g, { h: 0.34, pos: [0, -0.35], rings: 12, r: function (t) { return t > 0.8 ? 0.05 * (1 - (t - 0.8) * 5) : 0.36 * (1 - t) + 0.02; }, sx: 1.4, sz: 0.6, bump: 0.15, colour: function (x, y) { return noise(x * 10, y * 20) > 0.5 ? '#d8a870' : '#c9985a'; } });
    [[-0.38, 0.0], [0.4, -0.05]].forEach(function (q) { var m = new T.Group(); mountain(m, { h: 0.16, r: function (t) { return 0.18 * (1 - t) + 0.02; }, bump: 0.2, colour: function () { return '#c9985a'; } }); m.position.set(q[0], 0, q[1]); g.add(m); });
    [[-0.15, -0.08], [0.0, -0.1], [0.15, -0.06], [-0.28, 0.1], [0.28, 0.08]].forEach(function (q, k) { box(g, solid('#e8c890'), 0.05, 0.05, 0.02, q[0], 0.006 + (k < 3 ? 0.05 : 0.02), q[1] + 0.03); box(g, dark, 0.026, 0.035, 0.004, q[0], 0.006 + (k < 3 ? 0.05 : 0.02), q[1] + 0.042); });
    // a path and visitors, and a golden mask on a stand (Tutankhamun was found here)
    var pth = new T.Mesh(new T.PlaneGeometry(0.06, 0.5), solid('#e8d0a0')); pth.rotation.x = -Math.PI / 2; pth.position.set(0, 0.008, 0.2); g.add(pth);
    for (var p = 0; p < 4; p++) cyl(g, solid(['#d04a2a', '#3f6ab0', '#f6f2ea', '#e8c34a'][p]), 0.006, 0.006, 0.02, -0.01 + (p % 2) * 0.02, 0.008, 0.1 + p * 0.07, 5);
    var mask = new T.Mesh(new T.ConeGeometry(0.03, 0.05, 4), solid('#e8b030', { emissive: '#4a3000' })); mask.position.set(0.15, 0.04, 0.32); g.add(mask); box(g, solid('#2a5aa8'), 0.04, 0.012, 0.012, 0.15, 0.03, 0.335);
    return g;
  };

  /* ---------- Ajanta Caves ---------- */
  M.custom.ajanta = function () {
    var g = new T.Group(), rock = solid('#8a7a62', { flatShading: true }), dark = solid('#2a2018');
    blob(g, '#5f9a45', 0.74, 0.62, 0, 0, 0.006, 3);
    // a horseshoe-shaped cliff above a river, with caves carved into it, pillared fronts and a horseshoe window
    var cl = new T.Mesh(new T.CylinderGeometry(0.42, 0.46, 0.24, 24, 2, true, Math.PI * 0.6, Math.PI * 0.8), solid('#8a7a62', { side: T.DoubleSide, flatShading: true })); cl.position.set(0, 0.126, 0.05); g.add(cl);
    var top = new T.Mesh(new T.RingGeometry(0.42, 0.58, 24, 1, Math.PI * 0.1 - Math.PI / 2 + Math.PI * 0.5, Math.PI * 0.8), solid('#4f8a3f')); top.rotation.x = -Math.PI / 2; top.position.set(0, 0.246, 0.05); g.add(top);
    for (var c = 0; c < 9; c++) { var a = Math.PI * 0.65 + c * Math.PI * 0.085, x = Math.sin(a) * 0.415, z = 0.05 + Math.cos(a) * 0.415; var fr = new T.Group(); box(fr, dark, 0.06, 0.06, 0.004, 0, 0, 0); for (var p = 0; p < 4; p++) box(fr, solid('#a89a80'), 0.008, 0.06, 0.008, -0.022 + p * 0.015, 0, 0.004); if (c === 4) { var hs = new T.Mesh(new T.CircleGeometry(0.03, 12, 0, Math.PI), dark); hs.position.set(0, 0.08, 0); fr.add(hs); box(fr, dark, 0.06, 0.04, 0.004, 0, 0.06, 0); } fr.position.set(x, 0.06, z); fr.rotation.y = a + Math.PI; g.add(fr); }
    // the river in the valley and stairs up
    var rv = new T.Mesh(new T.PlaneGeometry(0.12, 0.6), solid('#5a8aa0')); rv.rotation.x = -Math.PI / 2; rv.rotation.z = 0.3; rv.position.set(0.0, 0.009, 0.28); g.add(rv);
    for (var t = 0; t < 8; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), solid('#3f8a3f', { flatShading: true })); tr.position.set(-0.45 + t * 0.13, 0.04, 0.44 - (t % 2) * 0.04); g.add(tr); }
    return g;
  };

  /* ---------- Beijing National Stadium (Bird's Nest) ---------- */
  M.custom.birdsnest = function () {
    var g = new T.Group(), steel = solid('#9aa0a8', { metalness: 0.4, roughness: 0.5 }), red = solid('#c9302a');
    blob(g, '#c9c4b8', 0.74, 0.62, 0, 0, 0.006, 3);
    // an oval stadium wrapped in a criss-cross web of steel beams, red seats inside
    var shell = new T.Mesh(new T.CylinderGeometry(0.27, 0.3, 0.14, 32, 1, true), solid('#a8282a')); shell.scale.z = 0.8; shell.position.y = 0.076; g.add(shell);
    var bowl = new T.Mesh(new T.CircleGeometry(0.26, 24), solid('#5f9a45')); bowl.rotation.x = -Math.PI / 2; bowl.scale.y = 0.8; bowl.position.y = 0.01; g.add(bowl);
    for (var i = 0; i < 56; i++) { var a = i / 56 * D2, b = a + (i % 2 ? 0.6 : -0.6) + hash(i, 1) * 0.3, y0 = 0.006, y1 = 0.15; var p0 = new T.Vector3(Math.cos(a) * 0.35, y0, Math.sin(a) * 0.35 * 0.8), p1 = new T.Vector3(Math.cos(b) * 0.3, y1, Math.sin(b) * 0.3 * 0.8);
      var d = p1.clone().sub(p0), len = d.length(), bm = new T.Mesh(new T.BoxGeometry(0.014, len, 0.014), steel); bm.position.copy(p0).addScaledVector(d, 0.5); bm.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); g.add(bm); }
    var rim = new T.Mesh(new T.TorusGeometry(0.29, 0.01, 4, 32), steel); rim.rotation.x = Math.PI / 2; rim.scale.y = 0.8; rim.position.y = 0.15; g.add(rim);
    // the Water Cube next door
    box(g, solid('#6ab0e0', { transparent: true, opacity: 0.85 }), 0.16, 0.08, 0.16, 0.45, 0.006, -0.25);
    for (var t = 0; t < 6; t++) tree(g, -0.5 + t * 0.2, 0.46, 1.0, '#3f8a3f');
    return g;
  };

  /* ---------- Changdeokgung Palace ---------- */
  M.custom.changdeok = function () {
    var g = new T.Group(), tile = solid('#4a4a4a', { flatShading: true }), wood = solid('#a83a2a'), green = solid('#3f8a5a'), st = solid('#c9c0b0');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // the throne hall on a two-tier stone platform, painted wooden pillars and a double roof
    box(g, st, 0.4, 0.03, 0.26, 0, 0.006, -0.08); box(g, st, 0.34, 0.03, 0.2, 0, 0.036, -0.08);
    box(g, green, 0.26, 0.08, 0.14, 0, 0.066, -0.08); for (var c = 0; c < 8; c++) cyl(g, wood, 0.006, 0.006, 0.08, -0.12 + c * 0.034, 0.066, -0.005, 6);
    curvedRoof(g, tile, 0.32, 0.2, 0.05, 0, 0.146, -0.08); box(g, green, 0.18, 0.03, 0.1, 0, 0.18, -0.08); curvedRoof(g, tile, 0.24, 0.15, 0.05, 0, 0.21, -0.08);
    // the courtyard with rank stones and the Buyongji lotus pond with a small pavilion
    for (var r = 0; r < 6; r++) [-1, 1].forEach(function (sd) { box(g, st, 0.012, 0.02, 0.008, sd * 0.05, 0.006, 0.1 + r * 0.04); });
    var pond = new T.Mesh(new T.PlaneGeometry(0.16, 0.12), solid('#4a8aa8')); pond.rotation.x = -Math.PI / 2; pond.position.set(0.35, 0.009, 0.25); g.add(pond);
    box(g, wood, 0.05, 0.04, 0.05, 0.35, 0.009, 0.2); curvedRoof(g, tile, 0.08, 0.08, 0.03, 0.35, 0.049, 0.2);
    // the secret garden's autumn trees
    for (var t = 0; t < 8; t++) { var a = Math.PI * 0.9 + t * 0.18, tr = new T.Mesh(new T.SphereGeometry(0.045, 8, 6), solid(['#e8a83a', '#d0402a', '#3f8a3f', '#e8c34a'][t % 4], { flatShading: true })); tr.position.set(Math.cos(a) * 0.52, 0.07, Math.sin(a) * 0.42 - 0.05); g.add(tr); cyl(g, solid('#6a4a2a'), 0.006, 0.008, 0.05, Math.cos(a) * 0.52, 0.006, Math.sin(a) * 0.42 - 0.05, 5); }
    return g;
  };

  /* ---------- Dol Hareubang (Jeju) ---------- */
  M.custom.dolhareubang = function () {
    var g = new T.Group(), basalt = mat(tex('dhr', 32, 32, function (c, W, H) { c.fillStyle = '#5a5654'; c.fillRect(0, 0, W, H); c.fillStyle = '#3a3634'; for (var i = 0; i < 70; i++) { c.beginPath(); c.arc((i * 13) % W, (i * 29) % H, 1 + (i % 3) * 0.5, 0, D2); c.fill(); } }), 1, 1);
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // the "stone grandfather" statues of Jeju Island: big round eyes, hat, hands on the belly
    function stat(x, z, s, ry) { var st = new T.Group();
      var bd = lathe([[0.05, 0], [0.055, 0.06], [0.05, 0.12], [0.04, 0.15], [0, 0.15]], 12, basalt); st.add(bd);
      var hd = new T.Mesh(new T.SphereGeometry(0.045, 12, 10), basalt); hd.scale.set(1, 1.15, 0.95); hd.position.y = 0.19; st.add(hd);
      var hat = new T.Mesh(new T.CylinderGeometry(0.03, 0.045, 0.04, 12), basalt); hat.position.y = 0.25; st.add(hat); var hb = new T.Mesh(new T.CylinderGeometry(0.047, 0.047, 0.008, 12), basalt); hb.position.y = 0.232; st.add(hb);
      [-1, 1].forEach(function (sd) { var ey = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), basalt); ey.position.set(sd * 0.018, 0.205, 0.04); st.add(ey); var hn = new T.Mesh(new T.BoxGeometry(0.035, 0.012, 0.012), basalt); hn.position.set(sd * 0.015, 0.08 + (sd > 0 ? 0.03 : 0), 0.052); st.add(hn); });
      var ns = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), basalt); ns.scale.set(1.3, 1, 1); ns.position.set(0, 0.18, 0.045); st.add(ns);
      st.position.set(x, 0.006, z); st.scale.setScalar(s); st.rotation.y = ry; g.add(st); }
    stat(-0.1, 0.0, 1.4, 0.2); stat(0.15, -0.06, 1.2, -0.3);
    // black volcanic stone walls around tangerine orchards, and Hallasan in the distance
    var pts = [[-0.5, 0.2], [-0.2, 0.3], [0.2, 0.28], [0.5, 0.15]]; for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), w = new T.Mesh(new T.BoxGeometry(len, 0.04, 0.025), basalt); w.position.set((a[0] + b[0]) / 2, 0.026, (a[1] + b[1]) / 2); w.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]); g.add(w); }
    for (var o = 0; o < 8; o++) { var x = -0.4 + o * 0.11, z = 0.4 + (o % 2) * 0.03, tr = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), solid('#3f7a35', { flatShading: true })); tr.position.set(x, 0.045, z); g.add(tr); var or = new T.Mesh(new T.SphereGeometry(0.007, 5, 4), solid('#ff8a1a')); or.position.set(x + 0.02, 0.05, z + 0.015); g.add(or); }
    mountain(g, { h: 0.2, pos: [0, -0.42], r: function (t) { return 0.26 * (1 - t) + 0.04; }, sx: 1.5, sz: 0.4, bump: 0.12, colour: function (x, y) { return y > 0.16 ? '#e8e8ec' : '#4f8a3f'; } });
    return g;
  };
})();
