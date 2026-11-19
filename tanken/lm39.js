/* Detailed landmarks, batch 39: Schönbrunn Palace, Prague Astronomical Clock, Bayon, Gate of the Sun (Tiwanaku),
   Las Lajas Sanctuary, Ishtar Gate, Temple of the Tooth, Larabanga Mosque. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl, lathe = K.lathe, tree = K.tree, blob = K.blob, noise = K.noise, hash = K.hash, stoneTex = K.stoneTex, winTex = K.winTex, mountain = K.mountain, prism = K.prism, hip = K.hip, ridge = K.ridge, arch = K.arch;
  var D2 = Math.PI * 2;
  function cone(g, m, r, h, x, y, z, seg, ry) { var c = new T.Mesh(new T.ConeGeometry(r, h, seg || 8), m); c.position.set(x, y + h / 2, z); if (ry) c.rotation.y = ry; g.add(c); return c; }
  function ball(g, m, r, x, y, z, sx, sy, sz) { var b = new T.Mesh(new T.SphereGeometry(r, 10, 7), m); b.position.set(x, y, z); b.scale.set(sx || 1, sy || 1, sz || 1); g.add(b); return b; }
  // a proper hipped roof over a w × d rectangle (ridge along the longer side), with eaves sticking out by o
  function hipRoof(g, m, w, d, h, x, y, z, o, flare) {
    o = o || 0; var W = w / 2 + o, D = d / 2 + o, r = Math.max(0, W - D) * (flare ? 1 : 1), rx = Math.max(0, W - D), rz = Math.max(0, D - W);
    var P = [[-W, 0, -D], [W, 0, -D], [W, 0, D], [-W, 0, D], [-rx, h, -rz], [rx, h, -rz], [rx, h, rz], [-rx, h, rz]];
    if (flare) P.forEach(function (q, i) { if (i < 4) q[1] = -h * 0.12; });
    var F = [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]], pos = [];
    F.forEach(function (f) { [[0, 1, 2], [0, 2, 3]].forEach(function (t) { t.forEach(function (k) { pos.push(P[f[k]][0], P[f[k]][1], P[f[k]][2]); }); }); });
    pos.push(-W, P[0][1], -D, W, P[0][1], D, W, P[0][1], -D, -W, P[0][1], -D, -W, P[0][1], D, W, P[0][1], D);
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
    var mm = new T.Mesh(geo, m); mm.material.side = T.DoubleSide; mm.position.set(x, y, z); g.add(mm); return mm;
  }
  function person(g, x, z, s, col) { cyl(g, solid(col), 0.007 * s, 0.01 * s, 0.035 * s, x, 0.006, z, 6); ball(g, solid('#5a3a28'), 0.0065 * s, x, 0.048 * s, z); }

  /* ---------- Schönbrunn Palace (Vienna) ---------- */
  M.custom.schonbrunn = function () {
    var g = new T.Group(), yel = mat(tex('schb', 64, 64, function (x, w, h) {
      x.fillStyle = '#f2c94c'; x.fillRect(0, 0, w, h);
      for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) { var px = c * 16 + 4, py = r * 21 + 5; x.fillStyle = '#f8f2e2'; x.fillRect(px - 1, py - 2, 10, 16); x.fillStyle = '#5a6e78'; x.fillRect(px, py, 8, 12); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(px + 3.5, py, 1, 12); }
      x.fillStyle = '#e0b33c'; x.fillRect(0, 20, w, 1.5); x.fillRect(0, 41, w, 1.5);
    }), 6, 1), yel2 = mat(tex('schb', 64, 64, function () {}), 2, 1), roof = solid('#7f8a80'), wht = solid('#f8f2e2'), grass = solid('#5f9a45'), flower = solid('#d8574a');
    blob(g, '#c9bfa8', 0.76, 0.64, 0, 0, 0.006, 5);
    // the long yellow palace ("Schönbrunn yellow") with a grey roof and a raised middle block
    box(g, yel, 0.62, 0.11, 0.12, 0, 0.006, -0.18); hipRoof(g, roof, 0.62, 0.12, 0.04, 0, 0.116, -0.18, 0.006);
    box(g, yel2, 0.2, 0.14, 0.14, 0, 0.006, -0.17); hipRoof(g, roof, 0.2, 0.14, 0.045, 0, 0.146, -0.17, 0.006);
    [-0.31, 0.31].forEach(function (x) { box(g, yel2, 0.08, 0.12, 0.2, x, 0.006, -0.14); hipRoof(g, roof, 0.08, 0.2, 0.035, x, 0.126, -0.14, 0.006); });
    // white columns, a balcony and the curved double staircase in front of the middle
    for (var c = 0; c < 6; c++) cyl(g, wht, 0.005, 0.005, 0.09, -0.06 + c * 0.024, 0.05, -0.098, 8);
    box(g, wht, 0.17, 0.008, 0.02, 0, 0.05, -0.095);
    [-1, 1].forEach(function (s) { var st = new T.Mesh(new T.TorusGeometry(0.05, 0.012, 4, 10, Math.PI / 2), wht); st.rotation.x = Math.PI / 2; st.rotation.z = s > 0 ? 0 : Math.PI / 2; st.position.set(s * 0.04, 0.03, -0.09); st.scale.z = 1.6; g.add(st); });
    // the formal garden: lawns in neat beds with red flowers, gravel paths
    for (var i = 0; i < 4; i++) { var bx = -0.22 + i * 0.147, bed = new T.Mesh(new T.BoxGeometry(0.11, 0.008, 0.2), grass); bed.position.set(bx, 0.01, 0.06); g.add(bed);
      var fl = new T.Mesh(new T.BoxGeometry(0.09, 0.01, 0.015), flower); fl.position.set(bx, 0.012, 0.06); g.add(fl);
      for (var t = 0; t < 3; t++) { var cn = new T.Mesh(new T.ConeGeometry(0.009, 0.03, 6), solid('#2f6f3a')); cn.position.set(bx + (t - 1) * 0.04, 0.03, -0.045); g.add(cn); } }
    // the Neptune fountain at the far end and the Gloriette (a long arched colonnade) on the hill
    var pool = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.008, 18), solid('#5aa8d8')); pool.position.set(0, 0.012, 0.24); g.add(pool);
    box(g, wht, 0.07, 0.04, 0.02, 0, 0.012, 0.27); ball(g, solid('#e8e4dc'), 0.012, 0, 0.065, 0.27);
    var hill = new T.Mesh(new T.SphereGeometry(0.22, 14, 8, 0, D2, 0, Math.PI / 2), solid('#4f8f3f', { flatShading: true })); hill.scale.set(1.6, 0.35, 0.6); hill.position.set(0, 0.006, 0.42); g.add(hill);
    var glo = new T.Group(); glo.position.set(0, 0.07, 0.42); g.add(glo);
    box(glo, wht, 0.3, 0.008, 0.03, 0, 0, 0); box(glo, wht, 0.3, 0.012, 0.03, 0, 0.055, 0);
    for (var a = 0; a < 11; a++) { var ax = -0.14 + a * 0.028; cyl(glo, wht, 0.003, 0.003, 0.047, ax, 0.008, 0.012, 5); }
    box(glo, wht, 0.07, 0.03, 0.03, 0, 0.067, 0); box(glo, solid('#d8b04a'), 0.02, 0.02, 0.006, 0, 0.097, 0.0);
    [-0.33, 0.33].forEach(function (x) { for (var k = 0; k < 4; k++) tree(g, x, -0.05 + k * 0.1, 1.1, '#3f8a3f'); });
    return g;
  };

  /* ---------- Prague Astronomical Clock (Old Town Hall) ---------- */
  M.custom.pragueclock = function () {
    var g = new T.Group(), st = mat(stoneTex('prg', '#c9b89a', '#a89878', 16, 8), 1, 3), dark = solid('#3a3a40', { flatShading: true }), gold = solid('#d8ad4c');
    blob(g, '#b8aa96', 0.76, 0.62, 0, 0, 0.006, 2);
    // the gothic tower of the Old Town Hall with its steep dark roof and four corner turrets
    box(g, st, 0.12, 0.42, 0.12, 0, 0.006, -0.12);
    box(g, solid('#b8a888'), 0.14, 0.02, 0.14, 0, 0.42, -0.12);
    var rf = new T.Mesh(new T.ConeGeometry(0.1, 0.14, 4), dark); rf.rotation.y = Math.PI / 4; rf.position.set(0, 0.51, -0.12); g.add(rf);
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (q) { cyl(g, dark, 0.012, 0.012, 0.03, q[0] * 0.065, 0.44, -0.12 + q[1] * 0.065, 8); cone(g, dark, 0.016, 0.06, q[0] * 0.065, 0.47, -0.12 + q[1] * 0.065, 8); });
    cyl(g, gold, 0.003, 0.003, 0.04, 0, 0.58, -0.12, 5);
    // the clock: a blue sky dial with a gold ring and zodiac circle, the calendar dial below, apostle windows on top
    var dial = tex('prgdial', 128, 128, function (x) {
      x.fillStyle = '#1f2f6a'; x.fillRect(0, 0, 128, 128);
      x.fillStyle = '#d8ad4c'; x.beginPath(); x.arc(64, 64, 60, 0, D2); x.fill();
      x.fillStyle = '#2a5ab0'; x.beginPath(); x.arc(64, 64, 52, 0, D2); x.fill();
      x.fillStyle = '#c8783a'; x.beginPath(); x.arc(64, 64, 52, 0.15, Math.PI - 0.15); x.fill(); x.fillStyle = '#1a1a2a'; x.beginPath(); x.arc(64, 74, 30, Math.PI * 0.05, Math.PI * 0.95); x.fill();
      x.strokeStyle = '#d8ad4c'; x.lineWidth = 3; x.beginPath(); x.arc(64, 54, 26, 0, D2); x.stroke();
      x.fillStyle = '#f2d27a'; for (var k = 0; k < 24; k++) { var a = k / 24 * D2; x.fillRect(64 + Math.cos(a) * 56 - 1.5, 64 + Math.sin(a) * 56 - 1.5, 3, 3); }
      x.strokeStyle = '#f2d27a'; x.lineWidth = 2; x.beginPath(); x.moveTo(64, 64); x.lineTo(96, 40); x.stroke(); x.fillStyle = '#f2d27a'; x.beginPath(); x.arc(96, 40, 5, 0, D2); x.fill(); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(40, 52, 4, 0, D2); x.fill();
    });
    var cal = tex('prgcal', 128, 128, function (x) {
      x.fillStyle = '#e8dcc0'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#d8ad4c'; x.beginPath(); x.arc(64, 64, 60, 0, D2); x.fill();
      for (var k = 0; k < 12; k++) { x.fillStyle = k % 2 ? '#5a8ac0' : '#c8a060'; x.beginPath(); x.moveTo(64, 64); x.arc(64, 64, 54, k / 12 * D2, (k + 1) / 12 * D2); x.fill(); }
      x.fillStyle = '#c0392b'; x.beginPath(); x.arc(64, 64, 18, 0, D2); x.fill(); x.fillStyle = '#f2d27a'; x.beginPath(); x.arc(64, 64, 8, 0, D2); x.fill();
    });
    box(g, solid('#8a7a5a'), 0.11, 0.25, 0.02, 0, 0.03, -0.055);
    var d1 = new T.Mesh(new T.CircleGeometry(0.05, 24), new T.MeshLambertMaterial({ map: dial })); d1.position.set(0, 0.2, -0.043); g.add(d1);
    var d2 = new T.Mesh(new T.CircleGeometry(0.038, 24), new T.MeshLambertMaterial({ map: cal })); d2.position.set(0, 0.09, -0.043); g.add(d2);
    [-1, 1].forEach(function (s) { box(g, solid('#2a2a3a'), 0.018, 0.022, 0.004, s * 0.018, 0.26, -0.043); });
    var gab = new T.Mesh(new T.ConeGeometry(0.06, 0.05, 3), solid('#8a7a5a')); gab.rotation.y = Math.PI / 6; gab.scale.z = 0.25; gab.position.set(0, 0.305, -0.05); g.add(gab);
    // little figures beside the clock (the skeleton that rings the bell is one of them)
    [[-0.042, '#f2ece0'], [0.042, '#7a4a8a']].forEach(function (q) { person(g, q[0], -0.04, 1.0, q[1]); g.children[g.children.length - 2].position.y += 0.18; g.children[g.children.length - 1].position.y += 0.18; });
    // the Old Town Square: pastel houses with steep gables, and the dark twin spires of the Týn Church behind
    var cols = ['#f2d0a8', '#e8a8a0', '#a8c8e0', '#f2e2a0', '#c8e0b0', '#f0c0c8'];
    for (var h = 0; h < 6; h++) { var hx = -0.34 + h * 0.136, hz = h < 3 ? 0.14 : 0.16, hcol = cols[h], hm = mat(winTex('prgh' + h, hcol, '#4a5868', 3, 3, { band: 'rgba(255,255,255,.4)' }), 1, 1);
      if (Math.abs(hx) < 0.1) continue;
      box(g, hm, 0.11, 0.12, 0.08, hx, 0.006, hz + 0.1); ridge(g, solid('#b8483a'), 0.11, 0.05, 0.08, hx, 0.126, hz + 0.1, 0); }
    [-0.26, 0.26].forEach(function (x) { box(g, mat(stoneTex('prg2', '#8a8278', '#6a6258', 16, 8), 1, 2), 0.13, 0.16, 0.1, x, 0.006, -0.28); ridge(g, dark, 0.13, 0.08, 0.1, x, 0.166, -0.28, 0); });
    [-0.06, 0.06].forEach(function (dx) { box(g, mat(stoneTex('prg2', '#8a8278', '#6a6258', 16, 8), 1, 3), 0.05, 0.3, 0.05, -0.26 + dx * 0.0 + (dx > 0 ? 0.05 : -0.05), 0.006, -0.36);
      cone(g, dark, 0.04, 0.16, -0.26 + (dx > 0 ? 0.05 : -0.05), 0.306, -0.36, 8); for (var k = 0; k < 4; k++) { var a = k / 4 * D2 + 0.4; cone(g, dark, 0.008, 0.05, -0.26 + (dx > 0 ? 0.05 : -0.05) + Math.cos(a) * 0.03, 0.306, -0.36 + Math.sin(a) * 0.03, 5); } });
    for (var p = 0; p < 6; p++) person(g, -0.15 + p * 0.06, 0.04 + (p % 2) * 0.05, 1.3, ['#c0392b', '#2b6fd6', '#f2c14e', '#33a06a'][p % 4]);
    return g;
  };

  /* ---------- Bayon (Angkor Thom) ---------- */
  M.custom.bayon = function () {
    var g = new T.Group(), st = mat(stoneTex('bay', '#8f8f78', '#6f705c', 10, 6), 2, 1), st2 = solid('#7f806a', { flatShading: true }), moss = solid('#6f8a4a', { flatShading: true });
    var faceT = tex('bayface', 64, 64, function (x, w, h) {
      x.fillStyle = '#9a9a82'; x.fillRect(0, 0, w, h); for (var i = 0; i < 6; i++) { x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(0, i * 11, w, 1); }
      x.fillStyle = '#4a4a3c'; x.fillRect(16, 22, 12, 3); x.fillRect(36, 22, 12, 3);            // closed, smiling eyes
      x.fillRect(30, 26, 4, 12); x.fillRect(26, 36, 12, 3);                                         // nose
      x.beginPath(); x.moveTo(22, 46); x.quadraticCurveTo(32, 54, 42, 46); x.lineWidth = 3; x.strokeStyle = '#4a4a3c'; x.stroke(); // the famous calm smile
      x.fillStyle = 'rgba(70,90,40,.35)'; for (var k = 0; k < 14; k++) x.fillRect(Math.random() * w, Math.random() * h, 3, 3);
    }), faceM = new T.MeshLambertMaterial({ map: faceT });
    blob(g, '#5f8f3f', 0.78, 0.66, 0, 0, 0.006, 4);
    // terraces of grey stone, each a little smaller
    box(g, st, 0.58, 0.05, 0.5, 0, 0.006, 0); box(g, st, 0.46, 0.05, 0.4, 0, 0.056, 0); box(g, st, 0.34, 0.05, 0.3, 0, 0.106, 0);
    // stone towers, each carved with a big calm face on all four sides
    function tower(x, z, s) {
      var y0 = 0.156, h = 0.09 * s;
      box(g, st2, 0.055 * s, 0.02 * s, 0.055 * s, x, y0, z);
      var f = new T.Mesh(new T.BoxGeometry(0.048 * s, h, 0.048 * s), [faceM, faceM, st2, st2, faceM, faceM]); f.position.set(x, y0 + 0.02 * s + h / 2, z); g.add(f);
      for (var k = 0; k < 4; k++) { var r = (0.026 - k * 0.005) * s; cyl(g, k % 2 ? st2 : moss, r, r * 1.05, 0.02 * s, x, y0 + 0.02 * s + h + k * 0.02 * s, z, 8); }
      cone(g, st2, 0.006 * s, 0.03 * s, x, y0 + 0.02 * s + h + 0.08 * s, z, 6);
    }
    tower(0, 0, 1.5);
    [[-0.11, -0.09], [0.11, -0.09], [-0.11, 0.09], [0.11, 0.09], [0, -0.12], [0, 0.12], [-0.14, 0], [0.14, 0]].forEach(function (q) { tower(q[0], q[1], 0.85); });
    [[-0.24, -0.2], [0.24, -0.2], [-0.24, 0.2], [0.24, 0.2]].forEach(function (q) { var y0 = 0.056; box(g, st2, 0.04, 0.02, 0.04, q[0], y0, q[1]); var f = new T.Mesh(new T.BoxGeometry(0.035, 0.06, 0.035), [faceM, faceM, st2, st2, faceM, faceM]); f.position.set(q[0], y0 + 0.05, q[1]); g.add(f); cone(g, moss, 0.02, 0.05, q[0], y0 + 0.08, q[1], 8); });
    // the gallery of carvings round the base, steps on each side, and the jungle around
    for (var s2 = 0; s2 < 4; s2++) { var a = s2 * Math.PI / 2, sp = new T.Mesh(new T.BoxGeometry(0.06, 0.012, 0.12), st2); sp.rotation.y = a; sp.rotation.x = 0; sp.position.set(Math.sin(a) * 0.3, 0.03, Math.cos(a) * 0.27); sp.rotateX(0.5); g.add(sp); }
    for (var t = 0; t < 16; t++) { var ta = t / 16 * D2, rr = 0.34 + 0.04 * hash(t, 3); var tr = new T.Mesh(new T.SphereGeometry(0.045, 8, 6), solid(t % 3 ? '#3f7a35' : '#4f8a3f', { flatShading: true })); tr.position.set(Math.cos(ta) * rr * 1.1, 0.1, Math.sin(ta) * rr * 0.95); tr.scale.y = 1.2; g.add(tr); cyl(g, solid('#7a6a52'), 0.006, 0.008, 0.06, Math.cos(ta) * rr * 1.1, 0.006, Math.sin(ta) * rr * 0.95, 5); }
    return g;
  };

  /* ---------- Gate of the Sun (Tiwanaku) ---------- */
  M.custom.tiwanaku = function () {
    var g = new T.Group(), and = mat(tex('tiw', 64, 64, function (x, w, h) { x.fillStyle = '#8a8070'; x.fillRect(0, 0, w, h); for (var i = 0; i < 200; i++) { x.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '255,255,255' : '0,0,0') + ',.07)'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }), 1, 1);
    var frieze = tex('tiwfr', 128, 32, function (x, w, h) {
      x.fillStyle = '#8a8070'; x.fillRect(0, 0, w, h); x.strokeStyle = '#5a5246'; x.lineWidth = 1.5;
      x.strokeRect(54, 2, 20, 26); x.beginPath(); x.arc(64, 12, 6, 0, D2); x.stroke(); for (var k = 0; k < 8; k++) { var a = k / 8 * D2; x.beginPath(); x.moveTo(64 + Math.cos(a) * 7, 12 + Math.sin(a) * 7); x.lineTo(64 + Math.cos(a) * 10, 12 + Math.sin(a) * 10); x.stroke(); } // the "staff god" in the middle
      for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) { [6 + c * 12, 82 + c * 12].forEach(function (px) { x.strokeRect(px, 2 + r * 9, 9, 7); x.beginPath(); x.arc(px + 4.5, 5.5 + r * 9, 2, 0, D2); x.stroke(); }); } // rows of winged figures
    }), frM = new T.MeshLambertMaterial({ map: frieze });
    blob(g, '#a89870', 0.78, 0.64, 0, 0, 0.006, 6);
    // the gate: one huge block of andesite stone with a doorway cut through it and a carved band on top
    var gate = new T.Group(); gate.position.set(0, 0.006, 0.04); gate.scale.setScalar(1.5); g.add(gate);
    box(gate, and, 0.07, 0.16, 0.05, -0.08, 0, 0); box(gate, and, 0.07, 0.16, 0.05, 0.08, 0, 0); box(gate, and, 0.23, 0.07, 0.05, 0, 0.16, 0);
    var fp = new T.Mesh(new T.PlaneGeometry(0.23, 0.055), frM); fp.position.set(0, 0.195, 0.0255); gate.add(fp);
    [-1, 1].forEach(function (s) { box(gate, solid('#7a7064'), 0.02, 0.03, 0.006, s * 0.08, 0.1, 0.026); });
    // the Kalasasaya platform walls of tall standing stones, and the big Ponce statue
    for (var i = 0; i < 12; i++) { var x = -0.32 + i * 0.058; box(g, and, 0.026, 0.11 + (i % 3) * 0.015, 0.03, x, 0.006, -0.2); if (i < 11) box(g, solid('#9a8a70'), 0.034, 0.07, 0.024, x + 0.029, 0.006, -0.2); }
    [-0.32, 0.32].forEach(function (x) { for (var k = 0; k < 4; k++) box(g, and, 0.03, 0.1, 0.026, x, 0.006, -0.14 + k * 0.08); });
    var stat = new T.Group(); stat.position.set(-0.18, 0.006, -0.06); g.add(stat);
    box(stat, and, 0.04, 0.14, 0.03, 0, 0, 0); box(stat, and, 0.05, 0.04, 0.035, 0, 0.14, 0); [-1, 1].forEach(function (s) { box(stat, solid('#4a4238'), 0.008, 0.005, 0.002, s * 0.01, 0.16, 0.018); });
    // the sunken courtyard with carved stone heads in its walls
    var pit = new T.Mesh(new T.BoxGeometry(0.16, 0.01, 0.14), solid('#7a6a50')); pit.position.set(0.2, 0.006, 0.18); g.add(pit);
    for (var hd = 0; hd < 5; hd++) ball(g, solid('#c8bca8'), 0.008, 0.13 + hd * 0.035, 0.022, 0.25);
    // the high, dry Altiplano with the snowy peak of Illimani far away
    mountain(g, { r: function (t) { return 0.2 * (1 - t); }, h: 0.22, pos: [0.25, -0.42], colour: function (x, y) { return y > 0.13 ? '#f4f6f8' : y > 0.08 ? '#8a8a9a' : '#7a7a6a'; }, seed: 3 });
    for (var tq = 0; tq < 8; tq++) ball(g, solid('#b8a860', { flatShading: true }), 0.014, -0.35 + tq * 0.09, 0.012, 0.3 + (tq % 2) * 0.04, 1, 0.6, 1); // ichu grass tufts
    return g;
  };

  /* ---------- Las Lajas Sanctuary ---------- */
  M.custom.laslajas = function () {
    var g = new T.Group(), st = mat(stoneTex('llj', '#c8c0b0', '#8a8278', 8, 6), 1, 2), grey = solid('#8a8278'), wht = solid('#ece6da'), rock = solid('#6a7a50', { flatShading: true });
    // a deep green gorge with a river at the bottom
    var water = new T.Mesh(new T.PlaneGeometry(0.16, 0.9), solid('#4f9ac0')); water.rotation.x = -Math.PI / 2; water.position.set(0, 0.006, 0); g.add(water);
    [-1, 1].forEach(function (s) { var cl = new T.Mesh(new T.BoxGeometry(0.24, 0.26, 0.8, 3, 4, 6), rock); var p = cl.geometry.attributes.position; for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setX(i, x + (noise(z * 9 + s, y * 7) - 0.5) * 0.06 - (y > 0 ? 0 : s * 0.02)); } cl.geometry.computeVertexNormals(); cl.position.set(s * 0.2, 0.13, 0); g.add(cl);
      for (var t = 0; t < 5; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.03, 7, 5), solid('#3f7a35', { flatShading: true })); tr.position.set(s * (0.16 + hash(t, s + 2) * 0.12), 0.27, -0.35 + t * 0.17); g.add(tr); } });
    // a stone bridge with arches leaps across the gorge…
    var br = new T.Group(); br.position.set(0, 0, 0.05); g.add(br);
    box(br, st, 0.2, 0.06, 0.12, 0, 0.18, 0);
    [-0.05, 0.05].forEach(function (x) { box(br, st, 0.04, 0.18, 0.1, x, 0.006, 0); });
    arch(br, grey, 0.06, 0.17, 0, 0.006, 0.05, 0.004);
    // …and the church stands right on top of it, built in grey and white stone like a castle of spires (neo-gothic)
    var ch = new T.Group(); ch.position.set(0, 0.24, 0.0); br.add(ch);
    box(ch, st, 0.1, 0.12, 0.16, 0, 0, -0.02);
    ridge(ch, grey, 0.1, 0.05, 0.16, 0, 0.12, -0.02, 0);
    [-0.04, 0.04].forEach(function (x) { box(ch, st, 0.04, 0.17, 0.04, x, 0, 0.07); cone(ch, grey, 0.026, 0.1, x, 0.17, 0.07, 8); for (var k = 0; k < 4; k++) { var a = k / 4 * D2 + Math.PI / 4; cone(ch, wht, 0.005, 0.03, x + Math.cos(a) * 0.022, 0.17, 0.07 + Math.sin(a) * 0.022, 5); } });
    box(ch, st, 0.04, 0.2, 0.04, 0, 0, 0.07); cone(ch, grey, 0.03, 0.12, 0, 0.2, 0.07, 8); cyl(ch, solid('#d8ad4c'), 0.002, 0.002, 0.03, 0, 0.32, 0.07, 4);
    var rose = new T.Mesh(new T.CircleGeometry(0.012, 12), solid('#5a7ab0')); rose.position.set(0, 0.12, 0.091); ch.add(rose);
    for (var w = 0; w < 4; w++) { var ws = new T.Mesh(new T.PlaneGeometry(0.012, 0.04), solid('#4a5a8a')); ws.position.set(0.051, 0.05, -0.08 + w * 0.04); ws.rotation.y = Math.PI / 2; ch.add(ws); }
    // pilgrims crossing, and the walkway down from the town
    for (var p = 0; p < 5; p++) person(br, -0.08 + p * 0.04, 0.05, 1.0, ['#c0392b', '#2b6fd6', '#f2c14e', '#ffffff', '#33a06a'][p]);
    box(g, solid('#a89a88'), 0.05, 0.012, 0.35, 0.16, 0.26, -0.25);
    return g;
  };

  /* ---------- Ishtar Gate (Babylon) ---------- */
  M.custom.ishtar = function () {
    var g = new T.Group();
    var bt = tex('ishb', 64, 64, function (x, w, h) { x.fillStyle = '#1f4fa8'; x.fillRect(0, 0, w, h); for (var y = 0; y < h; y += 6) { x.fillStyle = 'rgba(0,0,40,.35)'; x.fillRect(0, y, w, 1); for (var k = (y / 6) % 2 ? 0 : 8; k < w; k += 16) x.fillRect(k, y, 1, 6); } for (var i = 0; i < 120; i++) { x.fillStyle = 'rgba(120,180,255,.12)'; x.fillRect(Math.random() * w, Math.random() * h, 3, 2); } });
    var blue = mat(bt, 2, 2), blue2 = mat(bt, 1, 2);
    function beasts(key, kind) { return tex(key, 128, 64, function (x, w, h) { // rows of golden dragons (mušḫuššu) and bulls in raised glazed brick
      x.drawImage(bt.image, 0, 0, 64, 64); x.drawImage(bt.image, 64, 0, 64, 64);
      x.fillStyle = '#e8b84a'; x.strokeStyle = '#7a5a1e'; x.lineWidth = 1;
      [16, 44].forEach(function (yy, r) { for (var c = 0; c < 2; c++) { var bx = 14 + c * 64 + (r ? 26 : 0);
        x.beginPath(); x.ellipse(bx + 14, yy, 13, 5, 0, 0, D2); x.fill(); x.fillRect(bx + 2, yy, 3, 9); x.fillRect(bx + 22, yy, 3, 9); x.fillRect(bx + 26, yy - 9, 3, 7);
        if ((kind + r) % 2) { x.beginPath(); x.moveTo(bx + 28, yy - 9); x.lineTo(bx + 34, yy - 14); x.lineTo(bx + 30, yy - 6); x.fill(); x.fillRect(bx - 6, yy - 6, 8, 2); } // dragon: horn and curled tail
        else { x.fillRect(bx + 27, yy - 12, 6, 3); } } });
      x.fillStyle = '#f2ece0'; for (var k = 0; k < w; k += 8) { x.beginPath(); x.arc(k + 4, 3, 2, 0, D2); x.fill(); x.beginPath(); x.arc(k + 4, 61, 2, 0, D2); x.fill(); } // white rosette bands
    }); }
    var bm = new T.MeshLambertMaterial({ map: beasts('ishbe', 0) }), bm2 = new T.MeshLambertMaterial({ map: beasts('ishbe2', 1) });
    blob(g, '#d8c08a', 0.78, 0.64, 0, 0, 0.006, 7);
    // the gate: a big blue arch between two tall towers with stepped tops (crenellations)
    box(g, blue, 0.3, 0.26, 0.12, 0, 0.006, -0.06);
    var door = new T.Shape(); door.moveTo(-0.045, 0); door.lineTo(-0.045, 0.12); door.absarc(0, 0.12, 0.045, Math.PI, 0, true); door.lineTo(0.045, 0); door.lineTo(-0.045, 0);
    var dm = new T.Mesh(new T.ShapeGeometry(door), solid('#1a1a28')); dm.position.set(0, 0.006, 0.0005); g.add(dm);
    var trim = new T.Mesh(new T.TorusGeometry(0.05, 0.006, 4, 16, Math.PI), solid('#e8b84a')); trim.position.set(0, 0.126, 0.002); g.add(trim);
    [-0.12, 0.12].forEach(function (x) { box(g, blue2, 0.09, 0.34, 0.15, x, 0.006, -0.05); });
    function crenel(cx, cz, w, y) { for (var k = 0; k < Math.round(w / 0.03); k++) { var px = cx - w / 2 + 0.015 + k * 0.03; box(g, blue2, 0.018, 0.022, 0.018, px, y, cz); box(g, blue2, 0.008, 0.012, 0.008, px, y + 0.022, cz); } }
    crenel(-0.12, 0.022, 0.09, 0.346); crenel(0.12, 0.022, 0.09, 0.346); crenel(0, 0.0, 0.12, 0.266);
    // the golden animals on the front of the towers
    [-0.12, 0.12].forEach(function (x, i) { var p = new T.Mesh(new T.PlaneGeometry(0.088, 0.2), i ? bm2 : bm); p.position.set(x, 0.15, 0.0255); g.add(p); });
    [-0.1, 0.1].forEach(function (x, i) { var p = new T.Mesh(new T.PlaneGeometry(0.06, 0.1), i ? bm : bm2); p.position.set(x, 0.2, 0.0005); g.add(p); });
    // the Processional Way: a paved road between tall blue walls with lions
    var road = new T.Mesh(new T.PlaneGeometry(0.1, 0.38), solid('#c9b88a')); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.008, 0.19); g.add(road);
    [-1, 1].forEach(function (s) { box(g, blue2, 0.03, 0.12, 0.34, s * 0.09, 0.006, 0.2); var lp = new T.Mesh(new T.PlaneGeometry(0.32, 0.06), bm); lp.rotation.y = -s * Math.PI / 2; lp.position.set(s * 0.0745, 0.08, 0.2); g.add(lp); });
    for (var p = 0; p < 3; p++) person(g, -0.02 + p * 0.02, 0.12 + p * 0.08, 1.2, ['#e8e2d0', '#c0392b', '#d8ad4c'][p]);
    for (var t = 0; t < 6; t++) { var tx = (t % 2 ? 1 : -1) * (0.26 + (t % 3) * 0.04), tz = -0.2 + t * 0.09; cyl(g, solid('#7a5a3a'), 0.005, 0.007, 0.1, tx, 0.006, tz, 5); for (var f = 0; f < 6; f++) { var fa = f / 6 * D2, fr = new T.Mesh(new T.BoxGeometry(0.05, 0.004, 0.012), solid('#4f8a3f')); fr.position.set(tx + Math.cos(fa) * 0.022, 0.1, tz + Math.sin(fa) * 0.022); fr.rotation.y = -fa; fr.rotation.z = -0.4 * Math.cos(fa); g.add(fr); } } // date palms
    return g;
  };

  /* ---------- Temple of the Tooth (Kandy) ---------- */
  M.custom.toothtemple = function () {
    var g = new T.Group(), wht = mat(winTex('ttw', '#f6f2ea', '#8a5a3a', 4, 2, { tall: 0.55 }), 2, 1), w2 = solid('#f6f2ea'), tile = solid('#b8502e', { flatShading: true }), gold = solid('#d8ad4c');
    // Kandy Lake in front and the moat round the temple
    var lake = new T.Mesh(new T.CircleGeometry(0.3, 24), solid('#4f9ac0')); lake.rotation.x = -Math.PI / 2; lake.scale.set(1.3, 0.55, 1); lake.position.set(0, 0.007, 0.32); g.add(lake);
    blob(g, '#6aa04f', 0.78, 0.5, 0, -0.08, 0.006, 3);
    var moat = new T.Mesh(new T.PlaneGeometry(0.62, 0.05), solid('#4f9ac0')); moat.rotation.x = -Math.PI / 2; moat.position.set(0, 0.009, 0.1); g.add(moat);
    // the white "cloud wall" with its wavy top along the moat
    for (var i = 0; i < 26; i++) { var x = -0.3 + i * 0.024; box(g, w2, 0.024, 0.025, 0.012, x, 0.008, 0.075); var c = new T.Mesh(new T.SphereGeometry(0.012, 6, 4, 0, D2, 0, Math.PI / 2), w2); c.scale.z = 0.5; c.position.set(x, 0.033, 0.075); g.add(c); }
    // the long white temple with red tiled roofs that sweep up at the corners
    box(g, wht, 0.42, 0.07, 0.16, 0, 0.006, -0.06); hipRoof(g, tile, 0.42, 0.16, 0.05, 0, 0.076, -0.06, 0.02, true);
    box(g, wht, 0.16, 0.08, 0.1, 0.0, 0.11, -0.08); hipRoof(g, tile, 0.16, 0.1, 0.045, 0, 0.19, -0.08, 0.018, true);
    var gt = new T.Mesh(new T.CylinderGeometry(0.02, 0.022, 0.03, 8), gold); gt.position.set(0, 0.245, -0.08); g.add(gt); // the golden roof over the shrine of the tooth
    // the octagonal pavilion (Pattirippuwa) at the front corner
    var oct = new T.Group(); oct.position.set(-0.17, 0.006, 0.0); g.add(oct);
    cyl(oct, w2, 0.055, 0.06, 0.06, 0, 0, 0, 8); cyl(oct, wht, 0.06, 0.06, 0.05, 0, 0.06, 0, 8);
    var ocr = new T.Mesh(new T.ConeGeometry(0.075, 0.05, 8), tile); ocr.position.y = 0.135; oct.add(ocr); cyl(oct, gold, 0.003, 0.004, 0.02, 0, 0.16, 0, 5);
    for (var k = 0; k < 8; k++) { var a = k / 8 * D2, wd = new T.Mesh(new T.PlaneGeometry(0.02, 0.025), solid('#8a5a3a')); wd.position.set(Math.cos(a) * 0.061, 0.085, Math.sin(a) * 0.061); wd.rotation.y = -a + Math.PI / 2; oct.add(wd); }
    // a bridge over the moat to the gate, and people in white carrying flowers
    box(g, w2, 0.06, 0.012, 0.06, 0.06, 0.006, 0.1); box(g, wht, 0.07, 0.07, 0.03, 0.06, 0.006, 0.02); hipRoof(g, tile, 0.07, 0.03, 0.03, 0.06, 0.076, 0.02, 0.012, true);
    for (var p = 0; p < 5; p++) person(g, 0.0 + p * 0.03, 0.15 + (p % 2) * 0.02, 1.1, '#f8f6f0');
    // hills of Kandy and palms
    for (var t = 0; t < 9; t++) { var tx = -0.34 + t * 0.085, tz = -0.26 - (t % 2) * 0.04; cyl(g, solid('#8a6a4a'), 0.004, 0.006, 0.12, tx, 0.006, tz, 5); for (var f = 0; f < 6; f++) { var fa = f / 6 * D2, fr = new T.Mesh(new T.BoxGeometry(0.05, 0.004, 0.012), solid('#3f8a3f')); fr.position.set(tx + Math.cos(fa) * 0.022, 0.12, tz + Math.sin(fa) * 0.022); fr.rotation.y = -fa; fr.rotation.z = -0.4 * Math.cos(fa); g.add(fr); } }
    return g;
  };

  /* ---------- Larabanga Mosque (Ghana) ---------- */
  M.custom.larabanga = function () {
    var g = new T.Group();
    var wallT = tex('lrb', 64, 64, function (x, w, h) { x.fillStyle = '#f2ede2'; x.fillRect(0, 0, w, h); for (var i = 0; i < 60; i++) { x.fillStyle = 'rgba(160,130,90,.12)'; x.fillRect(Math.random() * w, Math.random() * h, 4, 2); } x.fillStyle = '#2a2420'; x.fillRect(0, h - 10, w, 10); }); // whitewashed mud, black-painted plinth
    var wm = mat(wallT, 1, 1), stick = solid('#6a4a2a'), dk = solid('#2a2420');
    blob(g, '#c88a4a', 0.76, 0.62, 0, 0, 0.006, 8); // red-orange earth of northern Ghana
    // a small, very old mosque built of mud: soft, sloping walls, with wooden sticks poking out (they hold scaffolding for re-plastering)
    function mud(w, h, d, x, y, z, taper) { var geo = new T.BoxGeometry(w, h, d, 2, 2, 2), p = geo.attributes.position; for (var i = 0; i < p.count; i++) { var yy = p.getY(i), f = 1 - (yy / h + 0.5) * (taper || 0.12); p.setX(i, p.getX(i) * f); p.setZ(i, p.getZ(i) * f); } geo.computeVertexNormals(); var m = new T.Mesh(geo, wm); m.position.set(x, y + h / 2, z); g.add(m); return m; }
    mud(0.26, 0.1, 0.22, 0, 0.006, 0);
    // two pointed towers: the mihrab tower facing Mecca and the minaret
    [[0.1, -0.09, 0.2], [-0.11, 0.08, 0.17]].forEach(function (q) {
      var tw = new T.Mesh(new T.CylinderGeometry(0.012, 0.045, q[2], 4), wm); tw.rotation.y = Math.PI / 4; tw.position.set(q[0], 0.006 + q[2] / 2, q[1]); g.add(tw);
      for (var k = 0; k < 4; k++) { var y = 0.04 + k * q[2] * 0.2; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var r = 0.042 * (1 - y / q[2]) + 0.012; box(g, stick, d[0] ? 0.04 : 0.006, 0.006, d[1] ? 0.04 : 0.006, q[0] + d[0] * r, y, q[1] + d[1] * r); }); }
      cone(g, dk, 0.006, 0.02, q[0], 0.006 + q[2], q[1], 5);
    });
    // more wooden sticks along the walls, small buttresses, and the black bands
    for (var s = 0; s < 6; s++) { var x = -0.1 + s * 0.04; [-1, 1].forEach(function (k) { box(g, stick, 0.006, 0.006, 0.04, x, 0.07, k * 0.11); }); mud(0.03, 0.12, 0.03, x, 0.006, 0.115, 0.4); }
    var door = new T.Mesh(new T.PlaneGeometry(0.03, 0.05), dk); door.position.set(0.03, 0.031, 0.1155); g.add(door);
    // the "Mystic Stone" nearby, baobab trees and shea trees on the savanna
    ball(g, solid('#8a7a6a', { flatShading: true }), 0.03, 0.26, 0.03, 0.12, 1.2, 0.8, 1);
    [[-0.3, -0.2], [0.3, -0.18]].forEach(function (q) { cyl(g, solid('#9a8a7a'), 0.03, 0.04, 0.12, q[0], 0.006, q[1], 8); for (var b = 0; b < 6; b++) { var a = b / 6 * D2; var br = new T.Mesh(new T.CylinderGeometry(0.004, 0.008, 0.06, 4), solid('#9a8a7a')); br.position.set(q[0] + Math.cos(a) * 0.02, 0.15, q[1] + Math.sin(a) * 0.02); br.rotation.z = Math.cos(a) * 0.7; br.rotation.x = -Math.sin(a) * 0.7; g.add(br); ball(g, solid('#6f9a3a', { flatShading: true }), 0.02, q[0] + Math.cos(a) * 0.045, 0.18, q[1] + Math.sin(a) * 0.045, 1, 0.6, 1); } }); // baobabs
    for (var t = 0; t < 5; t++) { var tr = new T.Mesh(new T.SphereGeometry(0.035, 7, 5), solid('#5f8a35', { flatShading: true })); tr.scale.y = 0.7; tr.position.set(-0.3 + t * 0.15, 0.06, 0.28); g.add(tr); cyl(g, solid('#6a4a2a'), 0.004, 0.006, 0.04, -0.3 + t * 0.15, 0.006, 0.28, 5); }
    for (var p = 0; p < 4; p++) person(g, 0.05 + p * 0.03, 0.17 + (p % 2) * 0.02, 1.1, ['#ffffff', '#2b6fd6', '#f2c14e', '#c0392b'][p]);
    return g;
  };
})();
