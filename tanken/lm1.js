/* Detailed landmarks, batch 1: Mount Fuji, Megane Bridge, Itsukushima torii, Himeji Castle,
   Tokyo Skytree, Eiffel Tower, Statue of Liberty, Pyramids of Giza.
   Same rules as tanken/detailed.js: stands on y=0, about 1 unit across, +z faces the viewer. */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var tex = K.tex, mat = K.mat, solid = K.solid, box = K.box, cyl = K.cyl;
  var D2 = Math.PI * 2;

  /* ---------- shared helpers ---------- */
  function hash(x, y) { var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); }
  function noise(x, y) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return (hash(xi, yi) * (1 - u) + hash(xi + 1, yi) * u) * (1 - v) + (hash(xi, yi + 1) * (1 - u) + hash(xi + 1, yi + 1) * u) * v; }
  var vcMat = new T.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  var vcSmooth = new T.MeshLambertMaterial({ vertexColors: true });
  function lathe(pts, seg, m, phase) { var g = new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), seg, phase || 0); return new T.Mesh(g, m); }
  // colour every vertex of a geometry with fn(x, y, z) -> '#hex'
  function paintVerts(g, fn) { g = g.toNonIndexed(); var p = g.attributes.position, c = new T.Color(), col = []; for (var i = 0; i < p.count; i += 3) { var x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3, z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3; c.set(fn(x, y, z)); for (var k = 0; k < 3; k++) col.push(c.r, c.g, c.b); } g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g; }
  function tree(g, x, z, s, col) { var t = new T.Mesh(new T.ConeGeometry(0.045 * s, 0.13 * s, 6), solid(col || '#3f8f4f', { flatShading: true })); t.position.set(x, 0.075 * s, z); g.add(t); var tr = new T.Mesh(new T.CylinderGeometry(0.008 * s, 0.01 * s, 0.03 * s, 5), solid('#7a5a3a')); tr.position.set(x, 0.012 * s, z); g.add(tr); }
  function blob(g, col, rx, rz, x, z, h, seed) { // flat irregular ground patch (lawn, sand, water) that hugs the land
    var sh = new T.Shape(), n = 28; for (var i = 0; i <= n; i++) { var a = i / n * D2, r = 0.8 + 0.35 * noise(Math.cos(a) * 2 + (seed || 0), Math.sin(a) * 2); var px = Math.cos(a) * rx * r, pz = Math.sin(a) * rz * r; if (i) sh.lineTo(px, pz); else sh.moveTo(px, pz); }
    var m = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: h || 0.01, bevelEnabled: false }), solid(col)); m.rotation.x = Math.PI / 2; m.position.set(x, h || 0.01, z); g.add(m); return m;
  }
  function stoneTex(key, base, line, bw, bh) {
    return tex(key, 64, 64, function (x, w, h) {
      x.fillStyle = base; x.fillRect(0, 0, w, h);
      for (var y = 0, r = 0; y < h; y += bh, r++) { x.fillStyle = line; x.fillRect(0, y, w, 1); for (var k = (r % 2 ? bw / 2 : 0); k < w; k += bw) x.fillRect(k, y, 1, bh); }
      for (var i = 0; i < 160; i++) { x.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '255,255,255' : '0,0,0') + ',.05)'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    });
  }
  function winTex(key, wall, win, cols, rows, opt) {
    opt = opt || {};
    return tex(key, 64, 64, function (x, w, h) {
      x.fillStyle = wall; x.fillRect(0, 0, w, h);
      var cw = w / cols, rh = h / rows;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        x.fillStyle = win; x.fillRect(c * cw + cw * 0.22, r * rh + rh * 0.25, cw * 0.56, rh * (opt.tall || 0.5));
        if (opt.lit && Math.random() < opt.lit) { x.fillStyle = 'rgba(255,220,140,.8)'; x.fillRect(c * cw + cw * 0.22, r * rh + rh * 0.25, cw * 0.56, rh * (opt.tall || 0.5)); }
      }
      if (opt.band) { x.fillStyle = opt.band; for (var b = 0; b < rows; b++) x.fillRect(0, b * rh, w, 1.5); }
    });
  }

  K.hash = hash; K.noise = noise; K.vcMat = vcMat; K.lathe = lathe; K.paintVerts = paintVerts; K.tree = tree; K.blob = blob; K.stoneTex = stoneTex; K.winTex = winTex;

  /* ---------- Mount Fuji ---------- */
  M.custom.fuji = function () {
    var g = new T.Group(), H = 0.72, pts = [];
    for (var i = 0; i <= 26; i++) { var t = i / 26, y = t * H, r = 0.07 + 0.58 * Math.pow(1 - t, 1.75); pts.push([r, y]); }
    pts.push([0.05, H - 0.012], [0.0, H - 0.02]); // crater dip
    var geo = new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), 44);
    var pos = geo.attributes.position;
    for (var k = 0; k < pos.count; k++) { var x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k), a = Math.atan2(z, x), r = Math.hypot(x, z); if (r < 0.001) continue; var d = 1 + (noise(a * 3, y * 9) - 0.5) * 0.12 * (1 - y / H); pos.setXYZ(k, x * d, y + (noise(a * 5, r * 7) - 0.5) * 0.015, z * d); }
    geo = paintVerts(geo, function (x, y, z) {
      var a = Math.atan2(z, x), snow = H * 0.6 + (noise(a * 6, 1) - 0.5) * 0.16 + Math.abs(Math.sin(a * 7)) * 0.05;
      if (y > snow) return y > snow + 0.03 ? '#ffffff' : '#e3ecf7';
      if (y < 0.06) return noise(x * 20, z * 20) > 0.5 ? '#4e9a52' : '#3f8a48';
      if (y < 0.13) return '#5a8c6a';
      return y > H * 0.45 ? '#6a80bf' : '#5b72b3';
    });
    g.add(new T.Mesh(geo, vcMat));
    // forests and a lake (Lake Kawaguchi) at the foot
    blob(g, '#58b5e8', 0.16, 0.07, -0.2, 0.62, 0.006, 3);
    for (var j = 0; j < 22; j++) { var aa = j / 22 * D2 + hash(j, 1), rr = 0.6 + hash(j, 2) * 0.15; if (Math.sin(aa) > 0.75 && Math.cos(aa) < 0) continue; tree(g, Math.cos(aa) * rr, Math.sin(aa) * rr, 0.8 + hash(j, 3) * 0.5); }
    return g;
  };

  /* ---------- Megane Bridge (Nagasaki) ---------- */
  M.custom.megane = function () {
    var g = new T.Group(), L = 0.95, Hb = 0.24, R = 0.15, Dp = 0.26;
    var shape = new T.Shape(); shape.moveTo(-L / 2, -0.02); shape.lineTo(-L / 2, Hb); shape.lineTo(L / 2, Hb); shape.lineTo(L / 2, -0.02);
    [0.22, -0.22].forEach(function (cx) { shape.lineTo(cx + R, -0.02); shape.lineTo(cx + R, 0.02); shape.absarc(cx, 0.02, R, 0, Math.PI, false); shape.lineTo(cx - R, -0.02); });
    shape.lineTo(-L / 2, -0.02);
    var st = stoneTex('mstone', '#a39886', '#837966', 16, 8);
    var body = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: Dp, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1, curveSegments: 18 }), mat(st, 6, 6));
    body.position.set(0, 0.03, -Dp / 2); g.add(body);
    // arch rings (voussoirs) in lighter stone, parapets, steps
    [0.22, -0.22].forEach(function (cx) { [Dp / 2 + 0.009, -Dp / 2 - 0.009].forEach(function (z) { var ring = new T.Mesh(new T.TorusGeometry(R + 0.012, 0.016, 4, 16, Math.PI), solid('#b9ae99', { flatShading: true })); ring.position.set(cx, 0.05, z); g.add(ring); }); });
    [Dp / 2 - 0.015, -Dp / 2 + 0.015].forEach(function (z) { box(g, solid('#8e846f'), L + 0.02, 0.05, 0.03, 0, Hb + 0.03, z); });
    box(g, solid('#9a907c'), L - 0.04, 0.012, Dp - 0.04, 0, Hb + 0.03, 0);
    // the river running under it, with stone banks and willow-ish trees
    box(g, solid('#3d9bd6', { emissive: 0x0a2a40 }), 0.62, 0.02, 1.15, 0, 0, 0).position.y = 0.012;
    [-0.5, 0.5].forEach(function (x) { box(g, mat(stoneTex('bank', '#9b927f', '#7d7462', 12, 6), 2, 8), 0.18, 0.06, 1.15, x * 1.0 + (x > 0 ? 0.03 : -0.03), 0, 0); tree(g, x * 1.05, 0.38, 1.1, '#5aa35a'); tree(g, x * 1.05, -0.35, 1.0, '#4f9a50'); });
    // its reflection: a faint darker copy under the water surface reads as the "glasses"
    var refl = body.clone(); refl.material = solid('#5c86a8', { transparent: true, opacity: 0.55 }); refl.scale.y = -0.35; refl.position.y = 0.024; g.add(refl);
    return g;
  };

  /* ---------- Itsukushima torii ---------- */
  M.custom.torii = function () {
    var g = new T.Group(), red = solid('#e2492f'), black = solid('#26262c'), gold = solid('#d8ad4c');
    blob(g, '#3f9edb', 0.62, 0.5, 0, 0, 0.012, 7);           // sea around it
    blob(g, '#6cc0ef', 0.4, 0.3, 0, 0.05, 0.016, 2);          // lighter shallows
    var px = 0.3;
    [-px, px].forEach(function (x) {
      cyl(g, red, 0.045, 0.055, 0.82, x, 0.0, 0, 12);
      cyl(g, black, 0.06, 0.062, 0.05, x, 0.0, 0, 12);
      [-0.13, 0.13].forEach(function (z) { cyl(g, red, 0.026, 0.03, 0.5, x, 0, z, 10); cyl(g, black, 0.034, 0.034, 0.035, x, 0, z, 10); box(g, red, 0.03, 0.03, 0.27, x, 0.42, 0); });
    });
    box(g, red, 0.82, 0.055, 0.07, 0, 0.6, 0);                 // nuki
    box(g, gold, 0.12, 0.13, 0.02, 0, 0.66, 0.035);             // name plaque
    box(g, black, 0.1, 0.11, 0.022, 0, 0.67, 0.036);
    // kasagi + shimaki: a beam whose ends sweep upwards
    var sh = new T.Shape(); sh.moveTo(-0.56, 0.08); sh.quadraticCurveTo(-0.3, -0.005, 0, -0.005); sh.quadraticCurveTo(0.3, -0.005, 0.56, 0.08); sh.lineTo(0.55, 0.12); sh.quadraticCurveTo(0.3, 0.05, 0, 0.05); sh.quadraticCurveTo(-0.3, 0.05, -0.55, 0.12); sh.lineTo(-0.56, 0.08);
    var kas = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false, curveSegments: 12 }), red); kas.position.set(0, 0.79, -0.06); g.add(kas);
    var top = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.13, bevelEnabled: false, curveSegments: 12 }), black); top.scale.set(1.04, 0.5, 1); top.position.set(0, 0.835, -0.065); g.add(top);
    return g;
  };

  /* ---------- Himeji Castle ---------- */
  M.custom.castle = function () {
    var g = new T.Group(), white = mat(winTex('himewin', '#f7f5ef', '#3c3f46', 4, 2, { tall: 0.28 }), 3, 1), roofT = mat(tex('kawara', 64, 64, function (x, w, h) { x.fillStyle = '#6b7684'; x.fillRect(0, 0, w, h); for (var i = 0; i < w; i += 4) { x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(i, 0, 1, h); } }), 4, 2);
    var stone = mat(stoneTex('hstone', '#a9a59a', '#86827a', 14, 7), 4, 2);
    function base(w, d, h, x, z) { var m = new T.Mesh(new T.CylinderGeometry(Math.SQRT1_2 * w * 0.92, Math.SQRT1_2 * w * 1.06, h, 4), stone); m.rotation.y = Math.PI / 4; m.scale.z = d / w; m.position.set(x, h / 2, z); g.add(m); }
    function roof(w, d, h, y, x, z) { var m = new T.Mesh(new T.CylinderGeometry(Math.SQRT1_2 * w * 0.45, Math.SQRT1_2 * w * 1.22, h, 4, 1), roofT); m.rotation.y = Math.PI / 4; m.scale.z = d / w; m.position.set(x, y + h / 2, z); g.add(m); }
    function gable(w, y, x, z) { var m = new T.Mesh(new T.CylinderGeometry(w / 2, w / 2, 0.06, 3), solid('#f7f5ef')); m.rotation.set(Math.PI / 2, 0, Math.PI / 2); m.position.set(x, y + w * 0.18, z); g.add(m); var r = new T.Mesh(new T.CylinderGeometry(w / 2 + 0.012, w / 2 + 0.012, 0.066, 3), roofT); r.rotation.copy(m.rotation); r.position.set(x, y + w * 0.18 - 0.012, z - 0.004); g.add(r); }
    function keep(x, z, s, floors) {
      base(0.55 * s, 0.42 * s, 0.17 * s, x, z);
      var y = 0.17 * s, w = 0.48 * s, d = 0.36 * s;
      for (var f = 0; f < floors; f++) {
        var fh = 0.1 * s; box(g, white, w, fh, d, x, y, z); y += fh;
        roof(w, d, 0.045 * s, y, x, z); if (f % 2 === 0 && f < floors - 1) gable(w * 0.45, y + 0.01 * s, x, z + d / 2 + 0.01 * s);
        y += 0.035 * s; w *= 0.8; d *= 0.8;
      }
      roof(w * 1.05, d * 1.05, 0.09 * s, y, x, z);
      [-1, 1].forEach(function (k) { var sh = new T.Mesh(new T.ConeGeometry(0.012 * s, 0.03 * s, 5), solid('#d8ad4c')); sh.position.set(x + k * w * 0.35, y + 0.06 * s, z); g.add(sh); });
    }
    keep(0.05, -0.02, 1.15, 5);
    keep(-0.36, -0.16, 0.6, 3);
    keep(0.36, -0.22, 0.55, 3);
    keep(-0.2, 0.26, 0.45, 2);
    // connecting white walls
    box(g, solid('#f2efe6'), 0.62, 0.08, 0.04, -0.05, 0.1, -0.33); box(g, roofT, 0.64, 0.02, 0.06, -0.05, 0.18, -0.33);
    blob(g, '#6fbf5a', 0.62, 0.5, 0, 0, 0.008, 5);
    [[-0.5, 0.35], [0.5, 0.3], [0.55, -0.1], [-0.55, -0.05]].forEach(function (q, i) { tree(g, q[0], q[1], 0.9, i % 2 ? '#f2a7c3' : '#e88db0'); });
    return g;
  };

  /* ---------- Tokyo Skytree ---------- */
  M.custom.skytree = function () {
    var g = new T.Group();
    var lattice = tex('skylat', 64, 128, function (x, w, h) { x.fillStyle = '#e9eff7'; x.fillRect(0, 0, w, h); x.strokeStyle = '#a9bad1'; x.lineWidth = 2; for (var y = -64; y < h + 64; y += 16) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y + 32); x.stroke(); x.beginPath(); x.moveTo(0, y + 32); x.lineTo(w, y); x.stroke(); } x.fillStyle = '#c5d2e3'; for (var y2 = 0; y2 < h; y2 += 32) x.fillRect(0, y2, w, 2); });
    var lat = mat(lattice, 6, 10);
    // tripod base turning round as it rises
    var tri = new T.Mesh(new T.CylinderGeometry(0.06, 0.16, 0.36, 3, 4), lat); tri.position.y = 0.18; g.add(tri);
    var shaft = new T.Mesh(new T.CylinderGeometry(0.042, 0.062, 0.7, 14, 6), lat); shaft.position.y = 0.36 + 0.35; g.add(shaft);
    var glass = mat(winTex('skydeck', '#4e5f78', '#bfe6ff', 8, 2, { tall: 0.55 }), 6, 1);
    function deck(y, r, h) { cyl(g, solid('#d9e2ee'), r + 0.008, r - 0.01, 0.012, 0, y - 0.012, 0, 18); cyl(g, glass, r, r, h, 0, y, 0, 18); cyl(g, solid('#d9e2ee'), r - 0.012, r + 0.006, 0.014, 0, y + h, 0, 18); }
    deck(0.64, 0.085, 0.06); deck(0.9, 0.064, 0.045);
    cyl(g, solid('#e9eff7'), 0.022, 0.04, 0.16, 0, 0.96, 0, 10);
    cyl(g, solid('#d9e2ee'), 0.008, 0.02, 0.24, 0, 1.12, 0, 8);
    cyl(g, solid('#ff5a4d'), 0.003, 0.006, 0.06, 0, 1.36, 0, 6);
    // the neighbourhood around it so it sits in the city
    var city = [mat(winTex('cityA', '#c9ced8', '#5a6a82', 3, 4), 1, 2), mat(winTex('cityB', '#e6d9c6', '#5f6b7a', 3, 5), 1, 2), mat(winTex('cityC', '#9fb3c8', '#e8f2ff', 2, 6), 1, 2)];
    for (var i = 0; i < 16; i++) { var a = i / 16 * D2 + 0.2, r = 0.25 + hash(i, 5) * 0.28, hh = 0.05 + hash(i, 6) * 0.12, w = 0.06 + hash(i, 7) * 0.05; box(g, city[i % 3], w, hh, w * (0.8 + hash(i, 8) * 0.5), Math.cos(a) * r, 0, Math.sin(a) * r); }
    blob(g, '#9aa3ad', 0.6, 0.55, 0, 0, 0.006, 9);
    return g;
  };

  /* ---------- Eiffel Tower (see-through iron lattice) ---------- */
  M.custom.eiffel = function () {
    var g = new T.Group(), brown = '#8a6a4e';
    function latticeTex(key, arch) {
      return tex(key, 64, 128, function (x, w, h) {
        x.clearRect(0, 0, w, h); x.strokeStyle = brown; x.fillStyle = brown;
        x.lineWidth = 7; x.strokeRect(0, 0, w, h);
        x.lineWidth = 2.5; for (var y = 0; y < h; y += 21) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y + 21); x.moveTo(w, y); x.lineTo(0, y + 21); x.stroke(); x.fillRect(0, y, w, 3); }
        if (arch) { x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(8, h); x.lineTo(8, h * 0.55); x.quadraticCurveTo(w / 2, h * 0.05, w - 8, h * 0.55); x.lineTo(w - 8, h); x.fill(); x.globalCompositeOperation = 'source-over'; x.lineWidth = 4; x.beginPath(); x.moveTo(8, h); x.lineTo(8, h * 0.55); x.quadraticCurveTo(w / 2, h * 0.05, w - 8, h * 0.55); x.lineTo(w - 8, h); x.stroke(); }
      });
    }
    function rr(y) { return 0.025 + 0.42 * Math.exp(-y * 2.7); }
    function section(y0, y1, key, arch, rep) {
      var pts = []; for (var i = 0; i <= 10; i++) { var y = y0 + (y1 - y0) * i / 10; pts.push(new T.Vector2(rr(y), y)); }
      var m = new T.Mesh(new T.LatheGeometry(pts, 4, Math.PI / 4), mat(latticeTex(key, arch), 4, rep || 1, { alphaTest: 0.4, side: T.DoubleSide }));
      g.add(m);
    }
    section(0, 0.27, 'eifA', true); section(0.27, 0.6, 'eifB', false, 2); section(0.6, 1.28, 'eifC', false, 5);
    // inner core so it doesn't look hollow from far away
    var core = new T.Mesh(new T.CylinderGeometry(0.02, 0.09, 0.6, 4), solid('#6e5440')); core.rotation.y = Math.PI / 4; core.position.y = 0.6; g.add(core);
    function plat(y, r, h) { var p = new T.Mesh(new T.CylinderGeometry(r, r, h, 4), solid('#7a5c43')); p.rotation.y = Math.PI / 4; p.position.y = y; g.add(p); }
    plat(0.27, rr(0.27) * 1.25, 0.03); plat(0.6, rr(0.6) * 1.35, 0.025);
    cyl(g, solid('#7a5c43'), 0.03, 0.04, 0.05, 0, 1.25, 0, 4, Math.PI / 4);
    cyl(g, solid('#d8ad4c'), 0.004, 0.008, 0.1, 0, 1.3, 0, 6);
    // Champ de Mars lawn and trees in front
    var lawn = new T.Mesh(new T.BoxGeometry(0.36, 0.008, 0.62), solid('#68b85a')); lawn.position.set(0, 0.004, 0.62); g.add(lawn);
    box(g, solid('#e5d6b0'), 0.06, 0.009, 0.62, 0, 0, 0.62);
    for (var i = 0; i < 6; i++) { tree(g, 0.22, 0.38 + i * 0.09, 0.8); tree(g, -0.22, 0.38 + i * 0.09, 0.8); }
    blob(g, '#d9c9a3', 0.5, 0.45, 0, 0, 0.006, 4);
    return g;
  };

  /* ---------- Statue of Liberty ---------- */
  M.custom.liberty = function () {
    var g = new T.Group(), cu = solid('#6fb39b'), cuD = solid('#5a9b84'), granite = mat(stoneTex('libst', '#c9c1ae', '#a8a08c', 16, 8), 3, 2);
    blob(g, '#3f9edb', 0.62, 0.55, 0, 0, 0.006, 11);
    blob(g, '#72c25f', 0.42, 0.36, 0, 0, 0.014, 1);
    // star-shaped Fort Wood
    var star = new T.Shape(); for (var i = 0; i < 22; i++) { var a = i / 22 * D2, r = i % 2 ? 0.2 : 0.3; if (i) star.lineTo(Math.cos(a) * r, Math.sin(a) * r); else star.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    var fort = new T.Mesh(new T.ExtrudeGeometry(star, { depth: 0.06, bevelEnabled: false }), solid('#b8b09c')); fort.rotation.x = -Math.PI / 2; g.add(fort);
    box(g, granite, 0.2, 0.06, 0.2, 0, 0.06, 0);
    box(g, granite, 0.16, 0.2, 0.16, 0, 0.12, 0);
    box(g, solid('#b9b19d'), 0.18, 0.02, 0.18, 0, 0.32, 0);
    box(g, granite, 0.13, 0.05, 0.13, 0, 0.34, 0);
    // robe and body
    var robe = lathe([[0.0, 0], [0.075, 0], [0.072, 0.06], [0.062, 0.2], [0.058, 0.3], [0.064, 0.34], [0.05, 0.38], [0.028, 0.4], [0.0, 0.41]], 14, cu); robe.position.y = 0.39; g.add(robe);
    var fold = lathe([[0.0, 0], [0.078, 0], [0.07, 0.12], [0.0, 0.13]], 7, cuD); fold.position.set(0.006, 0.39, 0.004); fold.rotation.y = 0.3; g.add(fold);
    var head = new T.Mesh(new T.SphereGeometry(0.03, 12, 10), cu); head.position.set(0, 0.825, 0.004); g.add(head);
    for (var k = 0; k < 7; k++) { var a2 = (k - 3) * 0.38, dir = new T.Vector3(Math.sin(a2), 0.35, Math.cos(a2) * 0.9 - 0.2).normalize(), sp = new T.Mesh(new T.ConeGeometry(0.006, 0.045, 4), cu); sp.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir); sp.position.set(dir.x * 0.045, 0.835 + dir.y * 0.045, 0.004 + dir.z * 0.045); g.add(sp); }
    // raised right arm and torch
    var arm = new T.Mesh(new T.CylinderGeometry(0.014, 0.018, 0.24, 8), cu); arm.position.set(0.05, 0.86, 0); arm.rotation.z = -0.2; g.add(arm);
    cyl(g, solid('#c49a3e'), 0.026, 0.014, 0.04, 0.074, 0.97, 0, 10);
    var flame = new T.Mesh(new T.ConeGeometry(0.018, 0.05, 8), solid('#ffcc4d', { emissive: 0xff9a2a })); flame.position.set(0.074, 1.035, 0); g.add(flame);
    // left arm holding the tablet
    box(g, cuD, 0.05, 0.075, 0.016, -0.055, 0.62, 0.035).rotation.z = 0.25;
    var la = new T.Mesh(new T.CylinderGeometry(0.013, 0.015, 0.12, 8), cu); la.position.set(-0.05, 0.69, 0.02); la.rotation.z = 0.5; g.add(la);
    for (var t = 0; t < 4; t++) tree(g, Math.cos(t * 1.6 + 0.4) * 0.36, Math.sin(t * 1.6 + 0.4) * 0.3, 0.8);
    return g;
  };

  /* ---------- Pyramids of Giza + Sphinx ---------- */
  M.custom.pyramid = function () {
    var g = new T.Group(), courses = tex('pyr', 64, 64, function (x, w, h) { x.fillStyle = '#dcbf7a'; x.fillRect(0, 0, w, h); for (var y = 0; y < h; y += 4) { x.fillStyle = 'rgba(120,85,30,.35)'; x.fillRect(0, y, w, 1); for (var k = (y / 4 % 2) * 5; k < w; k += 10) x.fillRect(k, y, 1, 4); } for (var i = 0; i < 120; i++) { x.fillStyle = 'rgba(255,240,200,.12)'; x.fillRect(Math.random() * w, Math.random() * h, 3, 1); } });
    function pyr(r, h, x, z, cap) { var m = new T.Mesh(new T.ConeGeometry(r, h, 4, 1), mat(courses, 6, 6, { flatShading: true })); m.rotation.y = Math.PI / 4; m.position.set(x, h / 2, z); g.add(m); if (cap) { var c = new T.Mesh(new T.ConeGeometry(r * 0.18, h * 0.18, 4), solid('#efe1bd', { flatShading: true })); c.rotation.y = Math.PI / 4; c.position.set(x, h * 0.91, z); g.add(c); } }
    blob(g, '#ecd497', 0.7, 0.6, 0, 0, 0.008, 6);
    pyr(0.36, 0.5, -0.12, -0.12); pyr(0.33, 0.47, 0.26, 0.1, true); pyr(0.16, 0.22, 0.48, 0.4);
    [0.62, 0.68, 0.74].forEach(function (x, i) { pyr(0.05, 0.07, x - 0.1, 0.55 + i * 0.02); });
    // the Sphinx
    var sp = solid('#cfae6c', { flatShading: true });
    box(g, sp, 0.07, 0.05, 0.2, -0.32, 0, 0.42); box(g, sp, 0.06, 0.08, 0.06, -0.32, 0.03, 0.52);
    box(g, solid('#b8944f'), 0.07, 0.045, 0.035, -0.32, 0.07, 0.51); box(g, sp, 0.03, 0.02, 0.07, -0.34, 0, 0.56); box(g, sp, 0.03, 0.02, 0.07, -0.3, 0, 0.56);
    // dunes and a few palms
    [[-0.55, -0.4], [0.6, -0.35]].forEach(function (q) { var d = new T.Mesh(new T.SphereGeometry(0.15, 10, 6), solid('#e6c983', { flatShading: true })); d.scale.set(1.4, 0.25, 1); d.position.set(q[0], 0, q[1]); g.add(d); });
    [[-0.6, 0.3], [-0.52, 0.42]].forEach(function (q) { cyl(g, solid('#8a6a3a'), 0.006, 0.01, 0.14, q[0], 0, q[1], 5); var l = new T.Mesh(new T.ConeGeometry(0.06, 0.03, 6), solid('#4f9a50', { flatShading: true })); l.position.set(q[0], 0.15, q[1]); g.add(l); });
    return g;
  };
})();
