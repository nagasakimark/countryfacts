/* Detailed vehicles. +z = forward, y = up, about 1 unit long. Parts with userData.spin keep spinning
   (propellers, wheels): MODELS.bake leaves them as separate meshes. */
(function () {
  var T = THREE, M = MODELS, A = M.animal, K = M.kit;
  var tube = A.tube, ball = A.ball, cone = A.cone, part = A.part, loft = A.loft;
  function along(sp) { return sp.map(function (q) { return [q[2] || 0, q[1], q[0], q[3], q[4]]; }); } // write spines as [z, y, x, r, r] → loft takes [x,y,z]
  function Z(sp) { return sp.map(function (q) { return [q[1] || 0, q[2], q[0], q[3], q[4]]; }); } // [z, x, y, rSide, rUp]
  function box(g, col, w, h, d, x, y, z) { var geo = new T.BoxGeometry(w, h, d); geo.translate(x, y, z); return part(g, geo, col); }
  function cyl(g, col, rt, rb, h, x, y, z, seg, rx, rz) { var geo = new T.CylinderGeometry(rt, rb, h, seg || 10); if (rx) geo.rotateX(rx); if (rz) geo.rotateZ(rz); geo.translate(x, y, z); return part(g, geo, col); }
  function wing(g, col, span, root, tip, sweep, x, y, z, dihedral, thick) { // flat tapered wing, both sides
    [-1, 1].forEach(function (s) {
      var sh = new T.Shape(); sh.moveTo(0, root / 2); sh.lineTo(span, root / 2 - sweep); sh.lineTo(span, root / 2 - sweep - tip); sh.lineTo(0, -root / 2); sh.lineTo(0, root / 2);
      var geo = new T.ExtrudeGeometry(sh, { depth: thick || 0.012, bevelEnabled: false }); geo.rotateX(Math.PI / 2); geo.translate(0, (thick || 0.012) / 2, 0);
      if (s < 0) geo.scale(-1, 1, 1); geo.rotateZ(s * (dihedral || 0)); geo.translate(x, y, z); part(g, geo, col);
    });
  }
  function prop(g, x, y, z, r, col) { // spinning propeller disc with blades
    var p = new T.Group(); p.position.set(x, y, z); p.userData.spin = 'z';
    for (var i = 0; i < 6; i++) { var geo = new T.BoxGeometry(0.018, r, 0.006); geo.translate(0, r / 2, 0); geo.rotateZ(i / 6 * Math.PI * 2); part(p, geo, col || '#2a2a30'); }
    ball(p, 0, 0, 0.01, 0.025, '#d9dde3', 1, 1, 1.6); g.add(p); return p;
  }
  function windows(g, n, z0, z1, y, x, col) { for (var i = 0; i < n; i++) { var z = z0 + (z1 - z0) * i / (n - 1); [-1, 1].forEach(function (s) { box(g, col || '#22324a', 0.004, 0.022, 0.018, s * x, y, z); }); } }

  /* ---------- Dash 8-style turboprop (short flights) ---------- */
  M.custom.v_prop = function (livery) {
    var g = new T.Group(), w = '#f4f6f8', c = livery || '#1f4fa8';
    tube(g, Z([[-0.5, 0, 0.06, 0.02, 0.03], [-0.38, 0, 0.055, 0.045, 0.05], [-0.2, 0, 0.05, 0.06, 0.065], [0.25, 0, 0.05, 0.06, 0.065], [0.4, 0, 0.045, 0.05, 0.055], [0.48, 0, 0.035, 0.025, 0.03]]), function (x, y, z) { return y < 0.035 && z > -0.42 && z < 0.44 ? '#c9ced6' : (Math.abs(y - 0.05) < 0.006 ? c : w); }, 'body', 12, 0.02);
    box(g, '#1a2433', 0.07, 0.025, 0.03, 0, 0.085, 0.42); // cockpit glass
    windows(g, 12, -0.25, 0.32, 0.07, 0.061);
    wing(g, w, 0.55, 0.13, 0.07, 0.03, 0, 0.11, 0.08, 0, 0.014);
    [-1, 1].forEach(function (s) {
      tube(g, Z([[0.0, s * 0.16, 0.1, 0.03, 0.035], [0.12, s * 0.16, 0.1, 0.035, 0.04], [0.2, s * 0.16, 0.1, 0.025, 0.03]]), w, 'nac', 8, 0.02);
      prop(g, s * 0.16, 0.1, 0.215, 0.11);
      cyl(g, '#33363c', 0.012, 0.012, 0.06, s * 0.16, 0.04, 0.1);
    });
    box(g, c, 0.012, 0.18, 0.12, 0, 0.15, -0.42); // tail fin
    wing(g, w, 0.17, 0.08, 0.05, 0.03, 0, 0.24, -0.45, 0, 0.01); // T-tail
    box(g, c, 0.014, 0.03, 0.08, 0, 0.24, -0.45);
    return g;
  };
  /* ---------- long-haul twin jet ---------- */
  M.custom.v_jet = function (livery) {
    var g = new T.Group(), w = '#f4f6f8', c = livery || '#c0392b';
    tube(g, Z([[-0.52, 0.0, 0.07, 0.015, 0.04], [-0.4, 0, 0.055, 0.05, 0.055], [-0.2, 0, 0.05, 0.065, 0.07], [0.3, 0, 0.05, 0.065, 0.07], [0.44, 0, 0.045, 0.05, 0.055], [0.52, 0, 0.035, 0.02, 0.025]]), function (x, y, z) { return y < 0.03 ? '#d6dae0' : (y > 0.075 && z < 0.2 && z > -0.3 ? c : w); }, 'body', 12, 0.02);
    box(g, '#1a2433', 0.075, 0.025, 0.03, 0, 0.08, 0.46); windows(g, 16, -0.3, 0.38, 0.065, 0.066);
    wing(g, w, 0.48, 0.2, 0.06, 0.2, 0, 0.03, 0.05, 0.08, 0.014);
    [-1, 1].forEach(function (s) { tube(g, Z([[0.02, s * 0.18, 0.0, 0.035, 0.035], [0.14, s * 0.18, 0.0, 0.04, 0.04], [0.18, s * 0.18, 0.0, 0.037, 0.037]]), '#e0e3e8', 'eng', 10, 0.01); prop(g, s * 0.18, 0.0, 0.185, 0.034, '#5a5f68'); });
    box(g, c, 0.012, 0.2, 0.13, 0, 0.16, -0.44); wing(g, w, 0.17, 0.09, 0.04, 0.06, 0, 0.07, -0.44, 0.1, 0.01);
    return g;
  };
  /* ---------- container ship ---------- */
  // Ship wakes: a foam trail painted once into a texture — churned white water straight behind the stern that spreads and fades,
  // and the two thin V arms of the bow waves running out to the sides. Shared by every ship.
  var WAKE = null;
  function wakeTex() {
    if (WAKE) return WAKE;
    var W2 = 128, H2 = 256, c = document.createElement('canvas'); c.width = W2; c.height = H2; var x = c.getContext('2d'), im = x.createImageData(W2, H2), d = im.data;
    function nz(a, b) { var v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v); }
    for (var j = 0; j < H2; j++) for (var i = 0; i < W2; i++) {
      var u = (i + 0.5) / W2 * 2 - 1, v = (j + 0.5) / H2, fade = Math.pow(1 - v, 1.4);
      var cw = 0.1 + 0.32 * v, core = Math.exp(-(u * u) / (cw * cw)) * fade * (0.55 + 0.45 * nz(Math.floor(i / 3), Math.floor(j / 3))) * Math.min(1, v * 14);
      var arm = 0.13 + 0.78 * v, aw = 0.025 + 0.05 * v, da = Math.abs(u) - arm, arms = Math.exp(-(da * da) / (aw * aw)) * Math.pow(1 - v, 1.1) * (0.65 + 0.35 * Math.sin(v * 46 + Math.abs(u) * 9));
      var a = Math.min(1, core * 1.15 + arms * 0.85), k = (j * W2 + i) * 4;
      d[k] = 245; d[k + 1] = 251; d[k + 2] = 255; d[k + 3] = Math.round(a * 235);
    }
    x.putImageData(im, 0, 0); WAKE = new T.CanvasTexture(c); WAKE.colorSpace = T.SRGBColorSpace; return WAKE;
  }
  function wake(g, z, w, len) { // the trail starts at the stern (z) and runs back len
    var geo = new T.PlaneGeometry(w, len); geo.rotateX(-Math.PI / 2); geo.translate(0, 0.006, z - len / 2);
    var uv = geo.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i)); // (v = 0 at the stern)
    var m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: wakeTex(), transparent: true, depthWrite: false, fog: true })); m.renderOrder = 2; g.add(m);
    return m;
  }
  M.custom.v_ship = function () {
    var g = new T.Group();
    var hull = new T.Shape(); hull.moveTo(-0.07, -0.5); hull.lineTo(0.07, -0.5); hull.lineTo(0.08, 0.3); hull.quadraticCurveTo(0.07, 0.48, 0, 0.55); hull.quadraticCurveTo(-0.07, 0.48, -0.08, 0.3); hull.lineTo(-0.07, -0.5);
    var hg = new T.ExtrudeGeometry(hull, { depth: 0.09, bevelEnabled: false }); hg.rotateX(Math.PI / 2); hg.translate(0, 0.09, 0); part(g, hg, function (x, y) { return y < 0.035 ? '#b0352a' : '#24324a'; });
    var deck = new T.ShapeGeometry(hull); deck.rotateX(-Math.PI / 2); deck.translate(0, 0.0905, 0); part(g, deck, '#7a5a48');
    var cs = ['#e8473a', '#2b7de0', '#f2c14e', '#33c9a0', '#ff7a2f', '#7a4bd8', '#e8e8e8', '#3a8a5a'];
    for (var r = 0; r < 9; r++) for (var cI = 0; cI < 3; cI++) for (var hI = 0; hI < 2 + ((r * 3 + cI) % 3 === 0 ? 1 : 0); hI++) box(g, cs[(r * 5 + cI * 3 + hI * 7) % 8], 0.045, 0.03, 0.07, -0.05 + cI * 0.05, 0.106 + hI * 0.031, 0.32 - r * 0.075);
    box(g, '#f4f4f4', 0.15, 0.1, 0.07, 0, 0.14, -0.4); box(g, '#22324a', 0.152, 0.015, 0.072, 0, 0.17, -0.4); box(g, '#f4f4f4', 0.18, 0.012, 0.04, 0, 0.192, -0.39);
    cyl(g, '#e8473a', 0.02, 0.022, 0.08, 0, 0.21, -0.46);
    wake(g, -0.5, 0.9, 1.5);
    return g;
  };
  M.custom.v_ferry = function () {
    var g = new T.Group();
    var hull = new T.Shape(); hull.moveTo(-0.08, -0.4); hull.lineTo(0.08, -0.4); hull.lineTo(0.09, 0.2); hull.quadraticCurveTo(0.08, 0.38, 0, 0.42); hull.quadraticCurveTo(-0.08, 0.38, -0.09, 0.2); hull.lineTo(-0.08, -0.4);
    var hg = new T.ExtrudeGeometry(hull, { depth: 0.1, bevelEnabled: false }); hg.rotateX(Math.PI / 2); hg.translate(0, 0.1, 0); part(g, hg, function (x, y) { return y < 0.04 ? '#1f5fbf' : '#f6f6f6'; });
    box(g, '#f6f6f6', 0.15, 0.06, 0.5, 0, 0.13, -0.05); box(g, '#2a3a52', 0.152, 0.02, 0.46, 0, 0.14, -0.05);
    box(g, '#f6f6f6', 0.12, 0.05, 0.3, 0, 0.19, -0.08); box(g, '#2a3a52', 0.122, 0.016, 0.26, 0, 0.2, -0.08);
    box(g, '#f6f6f6', 0.09, 0.04, 0.08, 0, 0.24, 0.02); box(g, '#2a3a52', 0.092, 0.014, 0.082, 0, 0.255, 0.02);
    cyl(g, '#1f5fbf', 0.025, 0.03, 0.07, 0, 0.27, -0.15); cyl(g, '#ff5a4d', 0.026, 0.026, 0.012, 0, 0.32, -0.15);
    wake(g, -0.4, 0.8, 1.3);
    return g;
  };
  /* ---------- shinkansen (three cars) ---------- */
  M.custom.v_bullet = function (stripe) {
    var g = new T.Group(), c = stripe || '#1f5fbf';
    function car(z0, len, nose) {
      var sp = nose ? [[z0, 0, 0.058, 0.066, 0.058], [z0 + len * 0.5, 0, 0.058, 0.066, 0.058], [z0 + len * 0.78, 0, 0.05, 0.06, 0.048], [z0 + len * 0.93, 0, 0.034, 0.036, 0.026], [z0 + len, 0, 0.025, 0.01, 0.007]] : [[z0, 0, 0.058, 0.066, 0.058], [z0 + len, 0, 0.058, 0.066, 0.058]];
      tube(g, Z(sp), function (x, y) { return Math.abs(y - 0.04) < 0.011 ? c : (y < 0.012 ? '#8a8f98' : '#f7f8fa'); }, 'car', 10, 0.01);
      windows(g, Math.round(len * 40), z0 + 0.03, z0 + len * (nose ? 0.6 : 0.97), 0.075, 0.065, '#2a3346');
      [z0 + 0.05, z0 + len - 0.05].forEach(function (z) { box(g, '#33363c', 0.1, 0.022, 0.07, 0, 0.0, z); });
    }
    car(0.08, 0.42, true); car(-0.3, 0.37, false); g.add(new T.Group());
    var back = new T.Group(); g.add(back); back.rotation.y = Math.PI; back.position.z = -0.33;
    var tmp = g; g = back; car(-0.05, 0.42, true); g = tmp;
    box(g, '#55595f', 0.02, 0.05, 0.004, 0, 0.11, 0.1);
    return g;
  };
  /* ---------- diesel/electric train ---------- */
  M.custom.v_train = function (col) {
    var g = new T.Group(), c = col || '#c0392b';
    box(g, c, 0.11, 0.11, 0.3, 0, 0.06, 0.32); box(g, '#22324a', 0.112, 0.035, 0.02, 0, 0.1, 0.47); box(g, '#f2c14e', 0.112, 0.012, 0.3, 0, 0.045, 0.32);
    box(g, '#55595f', 0.08, 0.02, 0.1, 0, 0.125, 0.3);
    [0.05, -0.27].forEach(function (z) { box(g, '#2d6fb5', 0.105, 0.1, 0.3, 0, 0.055, z); box(g, '#f4f4f4', 0.107, 0.012, 0.3, 0, 0.08, z); windows(g, 7, z - 0.12, z + 0.12, 0.08, 0.054, '#22324a'); box(g, '#9aa0a8', 0.09, 0.01, 0.3, 0, 0.11, z); });
    [0.42, 0.22, 0.14, -0.04, -0.18, -0.36].forEach(function (z) { [-1, 1].forEach(function (s) { var wh = cyl(g, '#2a2a30', 0.022, 0.022, 0.012, s * 0.05, 0.022, z, 10, 0, Math.PI / 2); }); });
    return g;
  };
  /* ---------- sports car ---------- */
  M.custom.v_car = function (col) { // a low sports car: wedge body, glass cabin, louvred engine cover, wide tail lights, wheels at the corners
    var g = new T.Group(), c = col || '#ff5a4d';
    var side = new T.Shape(); side.moveTo(-0.3, 0.03); side.lineTo(0.32, 0.03); side.lineTo(0.33, 0.065); side.quadraticCurveTo(0.2, 0.09, 0.09, 0.1); side.lineTo(-0.29, 0.11); side.lineTo(-0.3, 0.03);
    var bg = new T.ExtrudeGeometry(side, { depth: 0.19, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }); bg.translate(0, 0, -0.095); bg.rotateY(-Math.PI / 2); part(g, bg, c);
    var cab = new T.Shape(); cab.moveTo(0.1, 0.1); cab.quadraticCurveTo(0.02, 0.165, -0.06, 0.165); cab.lineTo(-0.16, 0.112); cab.lineTo(0.1, 0.1);
    var cg = new T.ExtrudeGeometry(cab, { depth: 0.15, bevelEnabled: false }); cg.translate(0, 0, -0.075); cg.rotateY(-Math.PI / 2); part(g, cg, '#1c2a3e');
    box(g, c, 0.152, 0.008, 0.08, 0, 0.163, -0.03); // (roof)
    for (var k = 0; k < 6; k++) box(g, '#14161a', 0.15, 0.006, 0.012, 0, 0.112 + k * 0.0005, -0.18 - k * 0.018); // (engine cover louvres)
    box(g, '#14161a', 0.2, 0.035, 0.012, 0, 0.055, -0.305); // (dark rear panel)
    [-1, 1].forEach(function (s) { box(g, '#ff2a2a', 0.07, 0.012, 0.008, s * 0.06, 0.088, -0.307); box(g, '#ffe9a8', 0.045, 0.014, 0.006, s * 0.075, 0.068, 0.335); cyl(g, '#9aa0a8', 0.009, 0.009, 0.02, s * 0.025, 0.04, -0.31, 8, Math.PI / 2); });
    box(g, '#14161a', 0.21, 0.008, 0.05, 0, 0.125, -0.28); [-1, 1].forEach(function (s) { box(g, '#14161a', 0.008, 0.02, 0.008, s * 0.07, 0.115, -0.27); }); // (rear wing)
    [[0.2], [-0.19]].forEach(function (q) { [-1, 1].forEach(function (s) { var wh = new T.Group(); wh.position.set(s * 0.108, 0.045, q[0]); wh.userData.spin = 'x'; cyl(wh, '#1d1d22', 0.047, 0.047, 0.042, 0, 0, 0, 14, 0, Math.PI / 2); cyl(wh, '#c9ced6', 0.026, 0.026, 0.045, 0, 0, 0, 8, 0, Math.PI / 2); g.add(wh); }); });
    return g;
  };

  /* ---------- more road vehicles (picked per route with r.car) ---------- */
  function wheels(g, xs, zs, r, w) { zs.forEach(function (z) { xs.forEach(function (x) { var wh = new T.Group(); wh.position.set(x, r, z); wh.userData.spin = 'x'; cyl(wh, '#1d1d22', r, r, w, 0, 0, 0, 12, 0, Math.PI / 2); cyl(wh, '#c9ced6', r * 0.55, r * 0.55, w + 0.004, 0, 0, 0, 8, 0, Math.PI / 2); g.add(wh); }); }); }
  function lights(g, x, yF, zF, yB, zB) { [-1, 1].forEach(function (s) { box(g, '#fff3c4', 0.035, 0.022, 0.006, s * x, yF, zF); box(g, '#e8302a', 0.04, 0.016, 0.006, s * x, yB, zB); }); }
  function person(g, x, y, z, shirt) { box(g, shirt || '#3a6ab0', 0.05, 0.05, 0.04, x, y, z); ball(g, x, y + 0.05, z, 0.024, '#e8b48a', 1, 1, 1); box(g, '#3a2a1a', 0.05, 0.012, 0.05, x, y + 0.072, z); }
  M.custom.v_convertible = function (col) { // 1950s American convertible: long fins, chrome, open top, a driver
    var g = new T.Group(), c = col || '#3fc0b8', chrome = '#e6e9ee';
    box(g, c, 0.24, 0.07, 0.7, 0, 0.065, 0); box(g, c, 0.22, 0.03, 0.2, 0, 0.115, 0.22); box(g, c, 0.22, 0.03, 0.22, 0, 0.115, -0.22);
    [-1, 1].forEach(function (s) { box(g, c, 0.02, 0.05, 0.12, s * 0.11, 0.13, -0.3); }); // (tail fins)
    box(g, '#f2ece0', 0.2, 0.02, 0.24, 0, 0.1, -0.02); box(g, '#f2ece0', 0.2, 0.06, 0.03, 0, 0.13, -0.11); box(g, '#f2ece0', 0.2, 0.06, 0.03, 0, 0.13, 0.04);
    box(g, '#9ad0e8', 0.2, 0.05, 0.008, 0, 0.15, 0.12); box(g, chrome, 0.25, 0.025, 0.02, 0, 0.045, 0.355); box(g, chrome, 0.25, 0.025, 0.02, 0, 0.045, -0.355); box(g, chrome, 0.004, 0.012, 0.6, 0.121, 0.085, 0); box(g, chrome, 0.004, 0.012, 0.6, -0.121, 0.085, 0);
    person(g, 0.05, 0.11, 0.07, '#f2f2f2'); lights(g, 0.08, 0.075, 0.352, 0.09, -0.352);
    wheels(g, [-0.11, 0.11], [0.22, -0.22], 0.045, 0.035); return g; };
  M.custom.v_pickup = function (col) { // pickup truck: cab and open bed
    var g = new T.Group(), c = col || '#c0392b';
    box(g, c, 0.24, 0.08, 0.68, 0, 0.07, 0); box(g, c, 0.23, 0.09, 0.22, 0, 0.15, 0.06); box(g, '#22324a', 0.232, 0.05, 0.18, 0, 0.16, 0.06); box(g, '#22324a', 0.2, 0.05, 0.006, 0, 0.165, 0.172);
    box(g, '#3a3a3e', 0.2, 0.012, 0.28, 0, 0.115, -0.19); [-1, 1].forEach(function (s) { box(g, c, 0.02, 0.05, 0.3, s * 0.11, 0.135, -0.19); }); box(g, c, 0.24, 0.05, 0.02, 0, 0.135, -0.33);
    box(g, '#9aa0a8', 0.25, 0.03, 0.03, 0, 0.05, 0.345); box(g, '#2a2a2e', 0.18, 0.04, 0.006, 0, 0.09, 0.342); lights(g, 0.09, 0.09, 0.342, 0.12, -0.342);
    wheels(g, [-0.115, 0.115], [0.22, -0.2], 0.055, 0.045); return g; };
  M.custom.v_camper = function (col) { // camper van: two-tone, rounded front, boxy
    var g = new T.Group(), c = col || '#e8a83a';
    box(g, c, 0.24, 0.1, 0.62, 0, 0.065, 0); box(g, '#f6f2ea', 0.24, 0.13, 0.6, 0, 0.165, -0.01); box(g, '#f6f2ea', 0.22, 0.02, 0.5, 0, 0.235, -0.03);
    box(g, '#22324a', 0.2, 0.07, 0.006, 0, 0.18, 0.302); [-1, 1].forEach(function (s) { for (var i = 0; i < 3; i++) box(g, '#22324a', 0.004, 0.06, 0.11, s * 0.121, 0.18, 0.15 - i * 0.15); });
    var logo = ball(g, 0, 0.12, 0.31, 0.025, '#f6f2ea', 1, 1, 0.3); box(g, '#cfd3d8', 0.25, 0.025, 0.02, 0, 0.04, 0.31); lights(g, 0.085, 0.1, 0.31, 0.1, -0.31);
    box(g, '#5a5a5e', 0.18, 0.02, 0.3, 0, 0.25, -0.05); // (roof rack)
    wheels(g, [-0.11, 0.11], [0.2, -0.2], 0.05, 0.04); return g; };
  M.custom.v_jeep = function (col) { // 4x4 safari wagon: tall, roof rack with luggage, spare wheel on the back
    var g = new T.Group(), c = col || '#e8e2d4';
    box(g, c, 0.25, 0.11, 0.62, 0, 0.09, 0); box(g, c, 0.24, 0.1, 0.42, 0, 0.19, -0.06); box(g, '#22324a', 0.242, 0.06, 0.38, 0, 0.2, -0.06); box(g, '#22324a', 0.21, 0.06, 0.006, 0, 0.2, 0.152);
    box(g, '#3a3a3e', 0.22, 0.012, 0.4, 0, 0.245, -0.06); box(g, '#8a5a32', 0.12, 0.04, 0.12, 0.02, 0.26, -0.1); box(g, '#3a6ab0', 0.08, 0.03, 0.08, -0.06, 0.255, 0.02);
    var sp = cyl(g, '#1d1d22', 0.055, 0.055, 0.03, 0, 0.14, -0.325, 12, Math.PI / 2); box(g, '#3a3a3e', 0.26, 0.04, 0.03, 0, 0.06, 0.32); box(g, '#3a3a3e', 0.26, 0.04, 0.03, 0, 0.06, -0.32); lights(g, 0.09, 0.11, 0.312, 0.11, -0.312);
    wheels(g, [-0.12, 0.12], [0.2, -0.2], 0.06, 0.05); return g; };
  M.custom.v_tuktuk = function (col) { // auto-rickshaw: one front wheel, canvas roof
    var g = new T.Group(), c = col || '#f2c230';
    box(g, c, 0.2, 0.1, 0.34, 0, 0.09, -0.03); box(g, '#2a6a3a', 0.22, 0.02, 0.4, 0, 0.27, -0.02); [[-0.1, 0.16], [0.1, 0.16], [-0.1, -0.2], [0.1, -0.2]].forEach(function (q) { box(g, '#2a2a2e', 0.012, 0.13, 0.012, q[0], 0.14, q[1]); });
    box(g, c, 0.12, 0.08, 0.1, 0, 0.1, 0.2); box(g, '#9ad0e8', 0.14, 0.07, 0.006, 0, 0.2, 0.17); box(g, '#5a3a28', 0.18, 0.05, 0.12, 0, 0.14, -0.1);
    person(g, 0, 0.16, 0.1, '#f2f2f2'); box(g, '#fff3c4', 0.03, 0.02, 0.006, 0, 0.13, 0.252);
    wheels(g, [0], [0.2], 0.04, 0.03); wheels(g, [-0.1, 0.1], [-0.15], 0.04, 0.03); return g; };
})();
