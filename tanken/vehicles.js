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
  M.custom.v_ship = function () {
    var g = new T.Group();
    var hull = new T.Shape(); hull.moveTo(-0.07, -0.5); hull.lineTo(0.07, -0.5); hull.lineTo(0.08, 0.3); hull.quadraticCurveTo(0.07, 0.48, 0, 0.55); hull.quadraticCurveTo(-0.07, 0.48, -0.08, 0.3); hull.lineTo(-0.07, -0.5);
    var hg = new T.ExtrudeGeometry(hull, { depth: 0.09, bevelEnabled: false }); hg.rotateX(Math.PI / 2); hg.translate(0, 0.09, 0); part(g, hg, function (x, y) { return y < 0.035 ? '#b0352a' : '#24324a'; });
    var deck = new T.ShapeGeometry(hull); deck.rotateX(-Math.PI / 2); deck.translate(0, 0.0905, 0); part(g, deck, '#7a5a48');
    var cs = ['#e8473a', '#2b7de0', '#f2c14e', '#33c9a0', '#ff7a2f', '#7a4bd8', '#e8e8e8', '#3a8a5a'];
    for (var r = 0; r < 9; r++) for (var cI = 0; cI < 3; cI++) for (var hI = 0; hI < 2 + ((r * 3 + cI) % 3 === 0 ? 1 : 0); hI++) box(g, cs[(r * 5 + cI * 3 + hI * 7) % 8], 0.045, 0.03, 0.07, -0.05 + cI * 0.05, 0.106 + hI * 0.031, 0.32 - r * 0.075);
    box(g, '#f4f4f4', 0.15, 0.1, 0.07, 0, 0.14, -0.4); box(g, '#22324a', 0.152, 0.015, 0.072, 0, 0.17, -0.4); box(g, '#f4f4f4', 0.18, 0.012, 0.04, 0, 0.192, -0.39);
    cyl(g, '#e8473a', 0.02, 0.022, 0.08, 0, 0.21, -0.46);
    // wake: two white fans behind and a bow wave
    var wk = new T.Shape(); wk.moveTo(-0.07, 0); wk.lineTo(0.07, 0); wk.lineTo(0.22, -0.7); wk.lineTo(-0.22, -0.7); wk.lineTo(-0.07, 0);
    var wg = new T.ShapeGeometry(wk); wg.rotateX(-Math.PI / 2); wg.translate(0, 0.004, -0.48);
    var wm = new T.Mesh(wg, new T.MeshBasicMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.55, depthWrite: false })); wm.renderOrder = 2; g.add(wm);
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
    var wk = new T.Shape(); wk.moveTo(-0.08, 0); wk.lineTo(0.08, 0); wk.lineTo(0.2, -0.55); wk.lineTo(-0.2, -0.55); wk.lineTo(-0.08, 0);
    var wg = new T.ShapeGeometry(wk); wg.rotateX(-Math.PI / 2); wg.translate(0, 0.004, -0.4); var wm = new T.Mesh(wg, new T.MeshBasicMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.55, depthWrite: false })); wm.renderOrder = 2; g.add(wm);
    return g;
  };
  /* ---------- shinkansen (three cars) ---------- */
  M.custom.v_bullet = function (stripe) {
    var g = new T.Group(), c = stripe || '#1f5fbf';
    function car(z0, len, nose) {
      var sp = nose ? [[z0, 0, 0.05, 0.055, 0.05], [z0 + len * 0.5, 0, 0.05, 0.055, 0.05], [z0 + len * 0.78, 0, 0.044, 0.05, 0.042], [z0 + len * 0.93, 0, 0.03, 0.03, 0.022], [z0 + len, 0, 0.022, 0.008, 0.006]] : [[z0, 0, 0.05, 0.055, 0.05], [z0 + len, 0, 0.05, 0.055, 0.05]];
      tube(g, Z(sp), function (x, y) { return Math.abs(y - 0.035) < 0.008 ? c : (y < 0.012 ? '#8a8f98' : '#f7f8fa'); }, 'car', 10, 0.01);
      windows(g, Math.round(len * 40), z0 + 0.03, z0 + len * (nose ? 0.6 : 0.97), 0.065, 0.054, '#2a3346');
      [z0 + 0.05, z0 + len - 0.05].forEach(function (z) { box(g, '#33363c', 0.08, 0.02, 0.06, 0, 0.0, z); });
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
  M.custom.v_car = function (col) {
    var g = new T.Group(), c = col || '#ff5a4d';
    var side = new T.Shape(); side.moveTo(-0.3, 0.03); side.lineTo(0.32, 0.03); side.lineTo(0.33, 0.07); side.quadraticCurveTo(0.2, 0.1, 0.08, 0.11); side.quadraticCurveTo(0.0, 0.17, -0.1, 0.16); side.lineTo(-0.28, 0.12); side.lineTo(-0.3, 0.03);
    var bg = new T.ExtrudeGeometry(side, { depth: 0.2, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 1 }); bg.translate(0, 0, -0.1); bg.rotateY(-Math.PI / 2); part(g, bg, c);
    box(g, '#1d2533', 0.17, 0.045, 0.1, 0, 0.13, -0.02); box(g, '#1d2533', 0.18, 0.03, 0.06, 0, 0.12, 0.06);
    box(g, '#1d1d22', 0.2, 0.012, 0.05, 0, 0.16, -0.27); box(g, '#1d1d22', 0.012, 0.035, 0.02, 0.08, 0.14, -0.26); box(g, '#1d1d22', 0.012, 0.035, 0.02, -0.08, 0.14, -0.26);
    [-1, 1].forEach(function (s) { box(g, '#ffe9a8', 0.04, 0.015, 0.006, s * 0.07, 0.07, 0.335); box(g, '#ff2a2a', 0.05, 0.012, 0.006, s * 0.07, 0.09, -0.312); });
    [[0.2], [-0.19]].forEach(function (q) { [-1, 1].forEach(function (s) { var wh = new T.Group(); wh.position.set(s * 0.105, 0.045, q[0]); wh.userData.spin = 'x'; cyl(wh, '#1d1d22', 0.045, 0.045, 0.035, 0, 0, 0, 12, 0, Math.PI / 2); cyl(wh, '#c9ced6', 0.025, 0.025, 0.037, 0, 0, 0, 8, 0, Math.PI / 2); g.add(wh); }); });
    return g;
  };
})();
