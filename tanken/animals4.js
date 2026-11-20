/* More animals (batch 4): Asian elephant, chimpanzee, blue whale, dugong. Same tools and rules as tanken/animals.js:
   face +x, stand on y = 0, about 0.6-0.9 long, colours painted per face. */
(function () {
  var T = window.THREE, M = window.MODELS, A = M.animal, K = M.kit;
  var quad = A.quad, tube = A.tube, ball = A.ball, cone = A.cone, part = A.part, loft = A.loft, wrap = A.wrap, vary = A.vary, shade = A.shade, worley = A.worley, hash = K.hash, solid = K.solid;
  var D2 = Math.PI * 2;
  function eye(g, x, y, z, r) { ball(g, x, y, z, r || 0.008, '#1d1a1a'); }
  function water(g, r, col, y) { var m = new T.Mesh(new T.CylinderGeometry(r, r * 1.02, 0.01, 18), solid(col || '#4aa8e0', { flatShading: true })); m.position.y = y == null ? 0.004 : y; g.add(m); return m; }
  function flat(g, pts, depth, col, x, y, z, rotY) {
    var sh = new T.Shape(); pts.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); });
    var geo = new T.ExtrudeGeometry(sh, { depth: depth, bevelEnabled: false }); geo.translate(0, 0, -depth / 2); if (rotY) geo.rotateY(rotY); geo.translate(x || 0, y || 0, z || 0);
    return part(g, geo, col);
  }

  /* ---------- Asian elephant (Thailand) ---------- */
  M.custom.a_aelephant = function () {
    var gray = '#7d7a78', cg = function (x, y, z) { return (worley(x, y, z, 50).f1 < 0.08 && y > 0.3) ? '#c9a4a0' : vary(gray, x, y, z, 0.05); }; // pinkish freckles on the face and ears
    var g = quad({ sides: 10, L: 0.48, legH: 0.22, bR: 0.17, bW: 0.14, legR: 0.048, kneeF: 0, kneeR: 0, slope: -0.05, prof: [0.6, 0.92, 1, 1, 0.98, 0.9],
      neck: { len: 0.0, ang: 0, r: 0.1 }, head: { len: 0.1, r: 0.1, snout: 0.07, ang: -1.0, eye: 0.008 }, ears: false, tail: 0.15, foot: 0,
      col: function (x, y, z, p) { if (y < 0.012) return '#c9c3b6'; return vary(p === 'leg' ? shade(gray, -0.02) : gray, x, y, z, 0.05); } });
    var u = g.userData, by = u.by, hx = u.L / 2 + 0.05, hy = by + 0.1;
    // the highest point is the back (African elephants dip in the middle), and the head has two round bumps on top
    tube(g, [[hx - 0.08, hy, 0, 0.09, 0.1], [hx - 0.02, hy + 0.03, 0, 0.11, 0.12], [hx + 0.04, hy - 0.01, 0, 0.09, 0.1], [hx + 0.07, hy - 0.07, 0, 0.06, 0.06]], cg, 'head', 10, 0.1, 8);
    [-1, 1].forEach(function (s) { ball(g, hx - 0.03, hy + 0.1, s * 0.04, 0.045, cg, 1, 0.8, 1); eye(g, hx + 0.035, hy + 0.03, s * 0.08, 0.007); });
    tube(g, [[hx + 0.07, hy - 0.06, 0, 0.045, 0.045], [hx + 0.1, hy - 0.14, 0, 0.034, 0.034], [hx + 0.1, hy - 0.23, 0, 0.026, 0.026], [hx + 0.08, hy - 0.3, 0.0, 0.02, 0.02], [hx + 0.1, hy - 0.33, 0, 0.017, 0.017]], cg, 'trunk', 8, 0.08, 4);
    // much smaller ears than the African elephant
    [-1, 1].forEach(function (s) { part(g, loft([[hx - 0.04, hy + 0.06, s * 0.095, 0.008, 0.01], [hx - 0.06, hy + 0.02, s * 0.11, 0.01, 0.06], [hx - 0.055, hy - 0.06, s * 0.105, 0.008, 0.03]], 6, 0.12, 9), cg); });
    // short tusks (only some males have them)
    [-1, 1].forEach(function (s) { tube(g, [[hx + 0.065, hy - 0.09, s * 0.04, 0.009, 0.009], [hx + 0.1, hy - 0.11, s * 0.045, 0.006, 0.006]], '#f4f0e4', 'tusk', 6, 0.02); });
    return wrap(g);
  };

  /* ---------- chimpanzee (Taï forest, Côte d'Ivoire) ---------- */
  M.custom.a_chimp = function () {
    var g = new T.Group(), fur = '#2a2522', skin = '#c9a688', cf = function (x, y, z) { return vary(fur, x, y, z, 0.06); };
    // a mossy rock it uses as an anvil, with a nut and a stone hammer: chimps here crack nuts with tools
    var rk = new T.Mesh(new T.DodecahedronGeometry(0.07, 0), solid('#7a7a6a', { flatShading: true })); rk.scale.set(1.3, 0.5, 1); rk.position.set(0.22, 0.03, 0.05); g.add(rk);
    ball(g, 0.22, 0.07, 0.05, 0.014, '#7a4a22'); ball(g, 0.15, 0.025, 0.12, 0.025, '#8a8a80', 1.2, 0.8, 1);
    // sitting up: body leaning back, long arms
    tube(g, [[-0.02, 0.06, 0, 0.09, 0.08], [0.0, 0.16, 0, 0.1, 0.09], [0.03, 0.26, 0, 0.085, 0.08], [0.05, 0.31, 0, 0.06, 0.06]], cf, 'body', 10, 0.12, 3);
    ball(g, 0.03, 0.12, 0, 0.06, '#5a4a40', 1, 1.2, 1.1); // paler chest skin
    var hx = 0.08, hy = 0.38;
    ball(g, hx, hy, 0, 0.065, cf, 1, 0.95, 0.95, 1);
    ball(g, hx + 0.045, hy - 0.015, 0, 0.042, skin, 1, 0.85, 1.05, 1); // bare face and muzzle
    ball(g, hx + 0.03, hy + 0.025, 0, 0.04, '#8a6a52', 1.1, 0.35, 1.25); // brow ridge
    [-1, 1].forEach(function (s) { eye(g, hx + 0.058, hy + 0.012, s * 0.02, 0.007); ball(g, hx - 0.005, hy + 0.0, s * 0.066, 0.022, skin, 0.5, 1, 1); }); // big ears
    ball(g, hx + 0.085, hy - 0.03, 0, 0.012, '#4a3426', 1, 0.5, 2); // mouth
    // arms: one holding the hammer stone, one resting on the ground
    tube(g, [[0.04, 0.29, 0.07, 0.03, 0.03], [0.1, 0.2, 0.1, 0.026, 0.026], [0.16, 0.12, 0.12, 0.022, 0.022], [0.17, 0.06, 0.12, 0.02, 0.02]], cf, 'arm', 7, 0.08, 5);
    tube(g, [[0.04, 0.29, -0.07, 0.03, 0.03], [0.08, 0.17, -0.1, 0.026, 0.026], [0.1, 0.06, -0.1, 0.022, 0.022], [0.12, 0.012, -0.1, 0.02, 0.016]], cf, 'arm', 7, 0.08, 6);
    // legs folded in front
    [-1, 1].forEach(function (s) { tube(g, [[-0.02, 0.06, s * 0.06, 0.04, 0.04], [0.07, 0.07, s * 0.08, 0.03, 0.03], [0.1, 0.02, s * 0.07, 0.024, 0.02]], cf, 'leg', 7, 0.08, 7); ball(g, 0.12, 0.012, s * 0.07, 0.022, '#3a3028', 1.4, 0.4, 1); });
    var leaves = solid('#3f7a3a', { flatShading: true }); for (var i = 0; i < 6; i++) { var l = new T.Mesh(new T.IcosahedronGeometry(0.03, 0), leaves); l.scale.y = 0.4; l.position.set(-0.2 + hash(i, 1) * 0.15, 0.01, -0.15 + hash(i, 2) * 0.3); g.add(l); }
    return wrap(g, 0.9);
  };

  /* ---------- blue whale (off southern Sri Lanka) ---------- */
  M.custom.a_bluewhale = function () {
    var g = new T.Group(); water(g, 0.55, '#2f7ec0');
    // the biggest animal that has ever lived: only its long back and tiny fin show at the surface, then the huge tail before a dive
    var c = function (x, y, z) { return worley(x, y, z, 40).f1 < 0.1 ? '#8aa4bc' : vary('#5a7896', x, y, z, 0.04); }; // mottled blue-grey
    tube(g, [[-0.5, 0.0, 0, 0.02, 0.02], [-0.38, 0.03, 0, 0.05, 0.04], [-0.15, 0.05, 0, 0.09, 0.06], [0.1, 0.055, 0, 0.1, 0.065], [0.3, 0.045, 0, 0.085, 0.055], [0.42, 0.03, 0, 0.05, 0.04]], c, 'body', 12, 0.05, 4);
    flat(g, [[0, 0], [-0.04, 0.03], [-0.05, 0]], 0.01, '#4a6a88', -0.32, 0.06, 0); // tiny dorsal fin far back
    // two blowholes and the tall, straight spout (up to 9 m high)
    [-1, 1].forEach(function (s) { ball(g, 0.3, 0.1, s * 0.012, 0.007, '#2a3a4a'); });
    for (var i = 0; i < 9; i++) ball(g, 0.3 + (hash(i, 1) - 0.5) * 0.03, 0.14 + i * 0.03, (hash(i, 2) - 0.5) * 0.03, 0.02 + i * 0.004, '#eaf4fb', 1, 1, 1);
    // tail flukes lifted at the end
    flat(g, [[0, 0], [-0.04, 0.05], [-0.1, 0.12], [-0.05, 0.06], [-0.02, 0.0]], 0.01, '#4a6a88', -0.48, 0.0, 0.0, Math.PI / 2);
    var fl = flat(g, [[0, 0], [-0.04, 0.02], [-0.06, 0.14], [0, 0.08], [0.06, 0.14], [0.04, 0.02]], 0.012, '#4a6a88', 0, 0, 0); fl.position.set(-0.55, 0.0, 0); fl.rotation.z = 0.2;
    for (var w = 0; w < 10; w++) { var a = w / 10 * D2; ball(g, Math.cos(a) * 0.45 * 0.9, 0.012, Math.sin(a) * 0.12, 0.02, '#ffffff', 1.4, 0.4, 1); }
    eye(g, 0.36, 0.035, 0.05, 0.006); eye(g, 0.36, 0.035, -0.05, 0.006);
    return wrap(g, 0.35);
  };

  /* ---------- dugong (Shark Bay, Australia) ---------- */
  M.custom.a_dugong = function () {
    var g = new T.Group(); water(g, 0.45, '#5ac0d8', 0.004);
    // a meadow of seagrass on the sandy bottom: the only thing dugongs eat
    var sand = new T.Mesh(new T.CylinderGeometry(0.44, 0.45, 0.006, 16), solid('#e8d8a8')); sand.position.y = 0.0; g.add(sand);
    var grass = solid('#4a9a4a', { flatShading: true }); for (var i = 0; i < 40; i++) { var a = hash(i, 1) * D2, r = hash(i, 2) * 0.4, bl = new T.Mesh(new T.BoxGeometry(0.004, 0.04 + hash(i, 3) * 0.03, 0.012), grass); bl.position.set(Math.cos(a) * r, 0.025, Math.sin(a) * r); bl.rotation.set(hash(i, 4) * 0.4, a, 0); g.add(bl); }
    // a fat grey body like a small manatee, but with a whale-like tail
    var c = function (x, y, z) { return vary(y < 0.07 ? '#b4aca4' : '#8a8580', x, y, z, 0.04); };
    tube(g, [[-0.28, 0.08, 0, 0.02, 0.015], [-0.2, 0.09, 0, 0.06, 0.05], [-0.05, 0.1, 0, 0.09, 0.08], [0.1, 0.1, 0, 0.085, 0.075], [0.2, 0.09, 0, 0.06, 0.055], [0.26, 0.07, 0, 0.045, 0.045]], c, 'body', 10, 0.06, 4);
    // the big droopy snout points down so it can graze on the bottom
    tube(g, [[0.25, 0.075, 0, 0.045, 0.045], [0.3, 0.05, 0, 0.04, 0.042], [0.32, 0.03, 0, 0.032, 0.03]], '#9a948e', 'snout', 8, 0.05, 5);
    [-1, 1].forEach(function (s) { eye(g, 0.27, 0.095, s * 0.035, 0.006); ball(g, 0.3, 0.09, s * 0.012, 0.004, '#3a3632'); });
    [-1, 1].forEach(function (s) { flat(g, [[0, 0], [-0.03, -0.01], [-0.07, -0.06], [-0.02, -0.05]], 0.01, '#7a7570', 0.14, 0.07, s * 0.07, s * 0.6); });
    var fl = flat(g, [[0, 0], [-0.03, 0.03], [-0.08, 0.11], [-0.02, 0.06], [0.0, 0.0], [-0.02, -0.06], [-0.08, -0.11], [-0.03, -0.03]], 0.008, '#7a7570', 0, 0, 0); fl.rotation.x = Math.PI / 2; fl.position.set(-0.28, 0.08, 0);
    ball(g, 0.38, 0.03, 0.1, 0.03, '#ffffff', 1, 0.3, 1); // ripples
    return wrap(g, 0.5);
  };
})();
