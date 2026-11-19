/* Detailed landmarks, batch 24: St. Peter's Basilica, Stari Most, Masada, Hegra, Tian Tan Buddha,
   Ruins of St. Paul's, Copán, Nan Madol. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function palm(g, x, z, s) { cyl(g, solid('#8a6a3a'), 0.005 * s, 0.009 * s, 0.13 * s, x, 0, z, 5); for (var i = 0; i < 5; i++) { var l = new T.Mesh(new T.BoxGeometry(0.07 * s, 0.004, 0.02 * s), solid('#3f9a4a')); l.position.set(x + Math.cos(i * 1.26) * 0.03 * s, 0.13 * s, z + Math.sin(i * 1.26) * 0.03 * s); l.rotation.set(0, -i * 1.26, -0.4); g.add(l); } }
  function canopy(g, n, r0, r1, seed, cols, y) { for (var i = 0; i < n; i++) { var a = hash(i, seed) * D2, r = r0 + hash(i, seed + 1) * (r1 - r0), c = new T.Mesh(new T.IcosahedronGeometry(0.04 + hash(i, seed + 2) * 0.03, 0), solid(cols[i % cols.length], { flatShading: true })); c.position.set(Math.cos(a) * r, (y || 0) + 0.04, Math.sin(a) * r * 0.85); g.add(c); } }

  /* ---------- St. Peter's Basilica ---------- */
  M.custom.stpeters = function () {
    var g = new T.Group(), trav = mat(stoneTex('spb', '#ece4d4', '#d8ccb6', 10, 5), 2, 1), white = solid('#f2ece0'), lead = solid('#9aaab0');
    blob(g, '#c9c0b0', 0.74, 0.62, 0, 0, 0.006, 3);
    // the oval piazza wrapped by Bernini's colonnade, with the obelisk in the middle
    var pz = new T.Mesh(new T.CircleGeometry(0.28, 32), solid('#d8d0c0')); pz.rotation.x = -Math.PI / 2; pz.scale.x = 1.3; pz.position.set(0, 0.008, 0.22); g.add(pz);
    [-1, 1].forEach(function (sd) { for (var i = 0; i < 13; i++) { var a = Math.PI / 2 + sd * (0.35 + i * 0.16), x = Math.cos(a) * 0.36 * sd * -1, z = 0.22 + Math.sin(a) * 0.28; x = sd * Math.abs(Math.cos(0.35 + i * 0.16 - Math.PI / 2)) * 0.36; cyl(g, white, 0.01, 0.01, 0.06, x, 0.008, z, 6); }
      var roofPts = []; for (var j = 0; j <= 12; j++) { var b = 0.35 + j * 0.16 - Math.PI / 2; roofPts.push([sd * Math.abs(Math.cos(b)) * 0.36, 0.22 + Math.sin(b + Math.PI / 2) * 0.28 * -1]); } });
    // colonnade roofs as curved bands
    [-1, 1].forEach(function (sd) { var r = new T.Mesh(new T.TorusGeometry(0.33, 0.018, 4, 20, Math.PI * 0.72), white); r.rotation.x = -Math.PI / 2; r.rotation.z = sd > 0 ? -Math.PI * 0.36 : Math.PI - Math.PI * 0.36; r.scale.set(1.1, 0.85, 0.6); r.position.set(0, 0.072, 0.22); g.add(r); });
    var ob = new T.Mesh(new T.CylinderGeometry(0.006, 0.012, 0.16, 4), solid('#c9b8a0')); ob.rotation.y = Math.PI / 4; ob.position.set(0, 0.088, 0.22); g.add(ob);
    // the basilica front and nave, then the great dome
    box(g, trav, 0.4, 0.14, 0.08, 0, 0.008, -0.08);
    for (var c = 0; c < 8; c++) cyl(g, white, 0.012, 0.012, 0.12, -0.17 + c * 0.0486, 0.008, -0.035, 8);
    box(g, white, 0.42, 0.02, 0.09, 0, 0.148, -0.08);
    for (var s = 0; s < 13; s++) { var st = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.025, 5), white); st.position.set(-0.18 + s * 0.03, 0.18, -0.04); g.add(st); }
    box(g, trav, 0.3, 0.14, 0.32, 0, 0.008, -0.3);
    cyl(g, trav, 0.1, 0.1, 0.08, 0, 0.148, -0.3, 24);
    for (var k = 0; k < 16; k++) { var a2 = k / 16 * D2; cyl(g, white, 0.006, 0.006, 0.08, Math.cos(a2) * 0.102, 0.148, -0.3 + Math.sin(a2) * 0.102, 5); }
    var dome = lathe([[0.1, 0], [0.098, 0.04], [0.085, 0.09], [0.06, 0.13], [0.03, 0.15], [0, 0.155]], 24, lead); dome.position.set(0, 0.228, -0.3); g.add(dome);
    cyl(g, white, 0.015, 0.02, 0.04, 0, 0.378, -0.3, 8);
    var cr = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), solid('#d8b04a', { emissive: '#3a2a00' })); cr.position.set(0, 0.43, -0.3); g.add(cr);
    return g;
  };

  /* ---------- Stari Most, Mostar ---------- */
  M.custom.starimost = function () {
    var g = new T.Group(), st = mat(stoneTex('smo', '#d8d0c0', '#bcb4a2', 8, 4), 2, 1), roof = solid('#8a8a88', { flatShading: true });
    blob(g, '#6a9a50', 0.74, 0.62, 0, 0, 0.006, 3);
    // a deep river gorge, emerald water
    var river = new T.Mesh(new T.PlaneGeometry(0.24, 0.9), solid('#2fa8a0')); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.012, 0); g.add(river);
    [-1, 1].forEach(function (sd) { box(g, solid('#bcae94', { flatShading: true }), 0.42, 0.1, 0.8, sd * 0.33, 0.006, 0); box(g, solid('#7aa050'), 0.42, 0.004, 0.8, sd * 0.33, 0.106, 0);
      // old stone houses with grey roofs on each bank
      for (var i = 0; i < 6; i++) { var x = sd * (0.22 + (i % 2) * 0.13), z = -0.32 + Math.floor(i / 2) * 0.26 + hash(i, sd + 3) * 0.08, h = 0.05 + hash(i, 4) * 0.03; box(g, solid(i % 2 ? '#e8e2d4' : '#d8ccb0'), 0.1, h, 0.08, x, 0.11, z); hip(g, roof, 0.11, 0.09, 0.04, x, 0.11 + h, z); }
      // the two towers guarding the bridge
      box(g, st, 0.07, 0.12, 0.07, sd * 0.165, 0.11, 0.025); hip(g, roof, 0.08, 0.08, 0.045, sd * 0.165, 0.23, 0.025); });
    // the single tall stone arch
    var arcShape = new T.Shape(); var R = 0.15; arcShape.moveTo(-0.13, 0); for (var a = 0; a <= 16; a++) { var t = Math.PI - a / 16 * Math.PI; arcShape.lineTo(Math.cos(t) * 0.12, Math.sin(t) * R * 0.9 + 0.0); } arcShape.lineTo(0.13, 0); arcShape.lineTo(0.13, 0.03); for (var b = 16; b >= 0; b--) { var t2 = Math.PI - b / 16 * Math.PI; arcShape.lineTo(Math.cos(t2) * 0.14, Math.sin(t2) * R * 0.9 + 0.025); } arcShape.lineTo(-0.13, 0.03);
    var br = new T.Mesh(new T.ExtrudeGeometry(arcShape, { depth: 0.05, bevelEnabled: false }), st); br.position.set(0, 0.012, 0.0); g.add(br);
    // a diver jumping off the top, as they do every summer
    var dv = new T.Mesh(new T.CapsuleGeometry(0.006, 0.02, 3, 6), solid('#e8a87a')); dv.position.set(0.03, 0.22, 0.07); dv.rotation.z = 0.3; g.add(dv);
    
    return g;
  };

  /* ---------- Masada ---------- */
  M.custom.masada = function () {
    var g = new T.Group(), rock = solid('#c9a878', { flatShading: true });
    blob(g, '#e0c89a', 0.74, 0.62, 0, 0, 0.006, 3);
    blob(g, '#5fb8c0', 0.3, 0.5, 0.55, 0.1, 0.01, 2); // the Dead Sea at the edge
    // a flat-topped mesa with sheer cliffs
    mountain(g, { h: 0.32, rings: 12, r: function (t) { return t > 0.88 ? 0.2 * (1 - (t - 0.88) * 1.2) : 0.32 - t * 0.1; }, sx: 1.4, sz: 0.7, bump: 0.15, jag: 0.2, colour: function (x, y) { return noise(x * 12, y * 30) > 0.5 ? '#c9a878' : '#b8946a'; } });
    // Herod's palace ruins on top and the snake path winding up
    for (var i = 0; i < 9; i++) { var x = -0.2 + (i % 3) * 0.12, z = -0.06 + Math.floor(i / 3) * 0.06; box(g, solid('#d8c49a'), 0.06, 0.02 + hash(i, 2) * 0.03, 0.004, x, 0.33, z); box(g, solid('#d8c49a'), 0.004, 0.02 + hash(i, 3) * 0.03, 0.05, x + 0.03, 0.33, z); }
    for (var c = 0; c < 6; c++) cyl(g, solid('#e8d8b0'), 0.006, 0.006, 0.04, -0.3 + c * 0.02, 0.32, 0.0, 6);
    var pts = []; for (var p = 0; p <= 30; p++) { var t = p / 30; pts.push(new T.Vector3(0.3 + Math.sin(t * 18) * 0.05, 0.01 + t * 0.31, 0.25 - t * 0.12)); }
    g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, 0.004, 3), solid('#f2e4c4')));
    // cable car up the cliff
    var ln = new T.Mesh(new T.CylinderGeometry(0.002, 0.002, 0.5, 3), solid('#333')); ln.position.set(0.2, 0.2, 0.25); ln.rotation.x = 0.9; g.add(ln); box(g, solid('#d04a2a'), 0.025, 0.02, 0.02, 0.2, 0.18, 0.28);
    return g;
  };

  /* ---------- Hegra (AlUla) ---------- */
  M.custom.hegra = function () {
    var g = new T.Group(), sandstone = solid('#d89a6a', { flatShading: true });
    blob(g, '#e8c48a', 0.74, 0.62, 0, 0, 0.006, 3);
    // a lone sandstone outcrop with the great tomb facade carved into it (Qasr al-Farid)
    var rock = new T.Mesh(new T.IcosahedronGeometry(0.22, 1), sandstone); var p = rock.geometry.attributes.position; for (var i = 0; i < p.count; i++) { var y = p.getY(i); p.setY(i, y < -0.1 ? -0.1 : y); p.setX(i, p.getX(i) * (1 + noise(i, 1) * 0.15)); } rock.geometry.computeVertexNormals(); rock.scale.set(0.8, 1.3, 0.8); rock.position.set(0, 0.13, -0.05); g.add(rock);
    var face = new T.Group(), fs = solid('#e8aa78'), dk = solid('#5a3020');
    box(face, fs, 0.18, 0.3, 0.02, 0, 0, 0);
    box(face, dk, 0.05, 0.08, 0.004, 0, 0.0, 0.011); box(face, fs, 0.07, 0.02, 0.006, 0, 0.09, 0.011);
    [-0.07, -0.025, 0.025, 0.07].forEach(function (x) { box(face, solid('#d8986a'), 0.012, 0.14, 0.006, x, 0.0, 0.012); });
    box(face, fs, 0.18, 0.015, 0.008, 0, 0.15, 0.012);
    for (var s = 0; s < 2; s++) for (var k = 0; k < 5; k++) box(face, fs, 0.03 - k * 0.004, 0.012, 0.008, (s ? 0.06 : -0.06), 0.25 + k * 0.012, 0.012);
    face.position.set(0, 0.006, 0.12); g.add(face);
    // smaller rocks and acacia
    for (var r = 0; r < 4; r++) { var sm = new T.Mesh(new T.IcosahedronGeometry(0.06 + hash(r, 2) * 0.05, 0), sandstone); sm.scale.y = 1.3; sm.position.set([-0.5, 0.45, -0.35, 0.4][r], 0.05, [-0.3, -0.25, 0.35, 0.3][r]); g.add(sm); }
    if (K.acacia) { K.acacia(g, 0.3, 0.1, 0.9); K.acacia(g, -0.32, 0.12, 0.8); }
    return g;
  };

  /* ---------- Tian Tan Buddha ---------- */
  M.custom.tiantan = function () {
    var g = new T.Group(), bronze = solid('#5a7a6a', { flatShading: false, metalness: 0.4, roughness: 0.5 });
    blob(g, '#4f8a3f', 0.74, 0.62, 0, 0, 0.006, 3);
    mountain(g, { h: 0.12, r: function (t) { return 0.4 * (1 - t) + 0.14; }, bump: 0.2, colour: function () { return '#4f8a3f'; } });
    // the three-level altar platform and the long stair
    cyl(g, solid('#e8e2d4'), 0.17, 0.18, 0.03, 0, 0.12, 0, 24); cyl(g, solid('#d8d2c4'), 0.14, 0.15, 0.03, 0, 0.15, 0, 24); cyl(g, solid('#e8e2d4'), 0.11, 0.12, 0.03, 0, 0.18, 0, 24);
    for (var s = 0; s < 12; s++) box(g, solid('#d8d2c4'), 0.06, 0.012, 0.02, 0, 0.006 + s * 0.01, 0.42 - s * 0.022);
    // the seated Buddha on a lotus
    var lotus = lathe([[0.09, 0], [0.1, 0.015], [0.08, 0.03], [0, 0.03]], 16, bronze); lotus.position.y = 0.21; g.add(lotus);
    var legs = new T.Mesh(new T.CapsuleGeometry(0.03, 0.1, 4, 8), bronze); legs.rotation.z = Math.PI / 2; legs.scale.set(1, 1, 1.3); legs.position.set(0, 0.26, 0.01); g.add(legs);
    var body = lathe([[0.065, 0], [0.07, 0.04], [0.06, 0.1], [0.045, 0.13], [0.02, 0.14], [0, 0.14]], 12, bronze); body.position.set(0, 0.25, -0.01); g.add(body);
    var head = new T.Mesh(new T.SphereGeometry(0.03, 12, 10), bronze); head.position.set(0, 0.415, -0.01); g.add(head);
    var bun = new T.Mesh(new T.SphereGeometry(0.014, 8, 6), bronze); bun.position.set(0, 0.45, -0.01); g.add(bun);
    var hand = new T.Mesh(new T.BoxGeometry(0.012, 0.035, 0.012), bronze); hand.position.set(0.05, 0.34, 0.03); g.add(hand);
    // monastery roofs below
    box(g, solid('#c9402a'), 0.14, 0.04, 0.08, -0.4, 0.006, 0.3); hip(g, solid('#e8b030'), 0.16, 0.1, 0.035, -0.4, 0.046, 0.3);
    canopy(g, 14, 0.52, 0.7, 7, ['#3f7a35', '#4f8a3f']);
    return g;
  };

  /* ---------- Ruins of St. Paul's, Macao ---------- */
  M.custom.stpaulmacao = function () {
    var g = new T.Group(), st = mat(tex('spm', 64, 96, function (c, W, H) { c.fillStyle = '#c9b89a'; c.fillRect(0, 0, W, H); c.fillStyle = '#5a4a38';
      for (var r = 0; r < 4; r++) for (var k = 0; k < 3; k++) { var x = 6 + k * 20, y = 80 - r * 22; c.fillRect(x + 4, y - 14, 8, 14); c.beginPath(); c.arc(x + 8, y - 14, 4, Math.PI, 0); c.fill(); }
      c.fillStyle = '#e8dcc4'; for (var y2 = 0; y2 < H; y2 += 22) c.fillRect(0, y2, W, 2); for (var x2 = 0; x2 < W; x2 += 20) c.fillRect(x2, 0, 2, H); }), 1, 1);
    blob(g, '#8aa870', 0.74, 0.62, 0, 0, 0.006, 3);
    // the grand stairway of 68 steps
    for (var s = 0; s < 10; s++) box(g, solid('#d8d0c0'), 0.4, 0.008 * (s + 1), 0.03, 0, 0.006, 0.45 - s * 0.03);
    // the lone stone facade, standing on its own
    var f = new T.Group();
    box(f, st, 0.26, 0.28, 0.025, 0, 0, 0);
    box(f, st, 0.16, 0.08, 0.025, 0, 0.28, 0);
    var tri = new T.Mesh(new T.ConeGeometry(0.06, 0.05, 3), st); tri.rotation.set(Math.PI / 2, 0, 0); tri.scale.set(1.3, 0.25, 1); tri.position.set(0, 0.38, 0); f.add(tri);
    var cross = new T.Group(); box(cross, solid('#c9b89a'), 0.006, 0.03, 0.006, 0, 0, 0); box(cross, solid('#c9b89a'), 0.018, 0.006, 0.006, 0, 0.018, 0); cross.position.y = 0.4; f.add(cross);
    [-0.12, 0.12].forEach(function (x) { box(f, st, 0.03, 0.2, 0.03, x, 0, 0.005); });
    f.position.set(0, 0.086, 0.12); g.add(f);
    // its back is open; a few stone foundations behind, and old shophouses around
    for (var i = 0; i < 4; i++) box(g, solid('#a89a80'), 0.24, 0.01, 0.01, 0, 0.086, 0.06 - i * 0.08);
    [[-0.45, -0.2], [-0.42, 0.1], [0.45, -0.2], [0.44, 0.1]].forEach(function (q, k) { box(g, solid(['#f2d8a8', '#c9e0d0', '#f0c0b0', '#e8e2d4'][k]), 0.12, 0.1, 0.12, q[0], 0.006, q[1]); box(g, solid('#8a5a3a'), 0.13, 0.01, 0.13, q[0], 0.106, q[1]); });
    canopy(g, 6, 0.3, 0.4, 3, ['#3f7a35'], 0.08);
    return g;
  };

  /* ---------- Copán ---------- */
  M.custom.copan = function () {
    var g = new T.Group(), st = mat(stoneTex('cop', '#b8b098', '#9a927c', 8, 6), 2, 2), grass = solid('#6aa050');
    blob(g, '#6aa050', 0.74, 0.62, 0, 0, 0.006, 3);
    // the Hieroglyphic Stairway temple: a stepped pyramid with a carved stair
    for (var l = 0; l < 5; l++) box(g, st, 0.4 - l * 0.06, 0.04, 0.3 - l * 0.04, 0, 0.006 + l * 0.04, -0.2);
    var stair = mat(tex('copst', 32, 64, function (c, W, H) { c.fillStyle = '#a89e86'; c.fillRect(0, 0, W, H); c.fillStyle = '#6a604c'; for (var y = 2; y < H; y += 4) for (var x = 2; x < W; x += 5) c.fillRect(x, y, 3, 2); }), 1, 1);
    var ramp = new T.Mesh(new T.BoxGeometry(0.1, 0.24, 0.02), stair); ramp.rotation.x = -0.75; ramp.position.set(0, 0.1, -0.02); g.add(ramp);
    // carved stelae standing in the great plaza
    for (var s = 0; s < 5; s++) { var x = -0.3 + s * 0.15, z = 0.25 + (s % 2) * 0.08; var stl = new T.Mesh(new T.BoxGeometry(0.035, 0.12, 0.025), mat(tex('stela', 16, 48, function (c, W, H) { c.fillStyle = '#a89e86'; c.fillRect(0, 0, W, H); c.fillStyle = '#5a5240'; c.fillRect(4, 4, 8, 8); c.fillRect(3, 16, 10, 14); c.fillRect(5, 34, 6, 10); }), 1, 1)); stl.position.set(x, 0.066, z); g.add(stl); var al = new T.Mesh(new T.CylinderGeometry(0.02, 0.022, 0.015, 8), st); al.position.set(x, 0.013, z + 0.04); g.add(al); }
    // the ball court with sloped sides
    [-0.06, 0.06].forEach(function (x) { var w = new T.Mesh(new T.BoxGeometry(0.03, 0.04, 0.16), st); w.position.set(0.38 + x, 0.026, -0.05); w.rotation.z = x > 0 ? 0.4 : -0.4; g.add(w); });
    // scarlet macaws in the trees
    for (var t = 0; t < 10; t++) { var a = t / 10 * D2; tree(g, Math.cos(a) * 0.62, Math.sin(a) * 0.5, 1.4, '#2f7a35'); }
    [[-0.55, 0.0], [0.55, 0.2]].forEach(function (q) { var m = new T.Mesh(new T.CapsuleGeometry(0.008, 0.02, 3, 6), solid('#e02a2a')); m.position.set(q[0], 0.2, q[1]); g.add(m); var tl = new T.Mesh(new T.BoxGeometry(0.004, 0.025, 0.006), solid('#2b6fd0')); tl.position.set(q[0], 0.18, q[1] - 0.01); g.add(tl); });
    return g;
  };

  /* ---------- Nan Madol ---------- */
  M.custom.nanmadol = function () {
    var g = new T.Group(), basalt = solid('#3a3632', { flatShading: true });
    blob(g, '#4ab0b8', 0.74, 0.62, 0, 0, 0.006, 5);
    // little man-made islets in a lagoon, walls of stacked basalt logs in a criss-cross pattern
    function islet(x, z, w, d, h) { blob(g, '#6a9a4a', w * 0.6, d * 0.6, x, z, 0.008, 2);
      for (var lv = 0; lv < h; lv++) { var y = 0.008 + lv * 0.014, along = lv % 2 === 0;
        [[0, -d / 2, w, 0.014, along], [0, d / 2, w, 0.014, along], [-w / 2, 0, 0.014, d, !along], [w / 2, 0, 0.014, d, !along]].forEach(function (q) {
          var n = Math.max(2, Math.round((q[2] > q[3] ? q[2] : q[3]) / 0.03));
          for (var k = 0; k < n; k++) { var log = new T.Mesh(new T.CylinderGeometry(0.007, 0.007, q[4] ? (q[2] > q[3] ? q[2] : q[3]) : 0.04, 5), basalt);
            if (q[2] > q[3]) { if (q[4]) { log.rotation.z = Math.PI / 2; log.position.set(x, y + 0.007, z + q[1]); k = n; } else { log.rotation.x = Math.PI / 2; log.position.set(x - w / 2 + (k + 0.5) * w / n, y + 0.007, z + q[1]); } }
            else { if (!q[4]) { log.rotation.x = Math.PI / 2; log.scale.y = d / 0.04; log.position.set(x + q[0], y + 0.007, z); k = n; } else { log.rotation.z = Math.PI / 2; log.position.set(x + q[0], y + 0.007, z - d / 2 + (k + 0.5) * d / n); } }
            g.add(log); } }); } }
    islet(0, -0.05, 0.3, 0.26, 6); islet(-0.38, 0.22, 0.16, 0.14, 3); islet(0.35, 0.25, 0.18, 0.14, 3); islet(0.38, -0.3, 0.14, 0.12, 2);
    // palms and jungle growing over the ruins, mangroves around
    palm(g, 0.05, -0.05, 1.0); palm(g, -0.06, 0.0, 0.8); palm(g, -0.38, 0.22, 0.8); palm(g, 0.35, 0.25, 0.9);
    canopy(g, 16, 0.55, 0.7, 9, ['#2f7a35', '#3f8f45']);
    var canoe = new T.Group(); box(canoe, solid('#7a5a3a'), 0.12, 0.01, 0.018, 0, 0, 0); box(canoe, solid('#7a5a3a'), 0.004, 0.004, 0.05, 0, 0.004, 0.03); canoe.position.set(-0.1, 0.008, 0.35); canoe.rotation.y = 0.3; g.add(canoe);
    return g;
  };
})();
