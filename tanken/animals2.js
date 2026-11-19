/* The other 37 animals, built with the tools in tanken/animals.js. Face +x, stand on y = 0. */
(function () {
  var T = window.THREE, M = window.MODELS, A = M.animal, K = M.kit;
  var quad = A.quad, tube = A.tube, ball = A.ball, cone = A.cone, part = A.part, loft = A.loft, wrap = A.wrap, worley = A.worley, shade = A.shade, vary = A.vary, noise = K.noise, hash = K.hash, solid = K.solid;
  var D2 = Math.PI * 2;
  function eye(g, x, y, z, r) { ball(g, x, y, z, r || 0.008, '#1d1a1a'); }
  function water(g, r, col, y) { var m = new T.Mesh(new T.CylinderGeometry(r, r * 1.02, 0.01, 18), solid(col || '#4aa8e0', { flatShading: true })); m.position.y = y == null ? 0.004 : y; g.add(m); return m; }
  function flat(g, pts, depth, col, x, y, z, rotY) { // flat polygon (fins, wings, ears) as a thin slab
    var sh = new T.Shape(); pts.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); });
    var geo = new T.ExtrudeGeometry(sh, { depth: depth, bevelEnabled: false }); geo.translate(0, 0, -depth / 2); if (rotY) geo.rotateY(rotY); geo.translate(x || 0, y || 0, z || 0);
    return part(g, geo, col);
  }
  function roundEars(g, u, col, r, inner) { var p = u.hp(0.15); [-1, 1].forEach(function (s) { ball(g, p[0] - 0.01, p[1] + u.hd.r * 0.85, s * u.hd.r * 0.7, r, col, 1, 1, 0.5); if (inner) ball(g, p[0] - 0.006, p[1] + u.hd.r * 0.85, s * u.hd.r * 0.72, r * 0.6, inner, 1, 1, 0.45); }); }
  function belly(base, light, by, bR) { return function (x, y, z, p) { if (y < 0.012) return '#3a2c22'; return vary(y < by - bR * 0.45 && p === 'body' ? light : base, x, y, z, 0.05); }; }

  /* ---------------- big cats, horses, cattle ---------------- */
  M.custom.a_lion = function () {
    var tan = '#d9a45a', g = quad({ sides: 10, L: 0.46, legH: 0.2, bR: 0.1, bW: 0.085, legR: 0.026, neck: { len: 0.07, ang: 0.5, r: 0.05 }, head: { len: 0.13, r: 0.056, snout: 0.04, ang: -0.25, eye: 0.008 }, earL: 0.025, earR: 0.014, tail: 0.24, kneeR: -0.025,
      col: function (x, y, z, p) { if (y < 0.012) return '#5a4030'; if (p === 'head' && x > 0.33 && y < 0.38) return vary('#ecc98e', x, y, z); return vary(y < 0.27 && p === 'body' ? '#e9c07c' : tan, x, y, z, 0.05); } });
    var u = g.userData, h = u.hp(0.15), S = u.S;
    // mane: a shaggy collar around the head and neck
    tube(g, [[S[0] - 0.03, S[1] - 0.02, 0, 0.075, 0.09], [h[0] - 0.01, h[1] - 0.005, 0, 0.09, 0.1], [h[0] + 0.03, h[1] + 0.01, 0, 0.072, 0.08]], function (x, y, z) { return vary('#8a4a1f', x, y, z, 0.08); }, 'mane', 11, 0.6, 21);
    var hp = u.hp, tip = hp(1); ball(g, tip[0] - 0.005, tip[1] + 0.005, 0, 0.014, '#2b1d18');
    ball(g, -u.L / 2 - 0.07, u.by + 0.035 - 0.24, 0, 0.02, '#5a2f16', 1, 1.3, 1);
    return wrap(g);
  };
  function horse(main, mane, opt) {
    opt = opt || {};
    var g = quad({ sides: 10, neckSides: 9, L: 0.44, legH: 0.27, bR: 0.09, bW: 0.075, legR: 0.019, kneeR: -0.025, neck: { len: 0.15, ang: 0.95, r: 0.042 }, head: { len: 0.17, r: 0.042, snout: 0.03, ang: -1.0, eye: 0.007 }, earL: 0.03, earR: 0.01, tail: 0.2, col: main });
    var u = g.userData, S = u.S, E = u.E;
    tube(g, [[S[0] - 0.03, S[1] + 0.04, 0, 0.008, 0.022], [(S[0] + E[0]) / 2 - 0.035, (S[1] + E[1]) / 2 + 0.03, 0, 0.009, 0.025], [E[0] - 0.04, E[1] + 0.035, 0, 0.008, 0.02]], mane, 'mane', 5, 0.25, 4);
    tube(g, [[-u.L / 2 + 0.01, u.by + 0.03, 0, 0.022, 0.022], [-u.L / 2 - 0.05, u.by - 0.06, 0, 0.026, 0.026], [-u.L / 2 - 0.07, u.by - 0.2, 0, 0.018, 0.018]], mane, 'tail2', 6, 0.3, 5);
    return g;
  }
  M.custom.a_zebra = function () {
    var stripe = function (x, y, z, p) {
      if (y < 0.012) return '#222';
      var v = p === 'leg' ? Math.sin(y * 95) : p === 'neck' || p === 'head' ? Math.sin(y * 70 + x * 25) : Math.sin(x * 62 + Math.sin(y * 18) * 1.6 + noise(y * 9, z * 9) * 1.5);
      return v > 0.2 ? '#1f1d1f' : vary('#f6f3ec', x, y, z, 0.03);
    };
    var g = horse(stripe, function (x, y) { return Math.sin(y * 120) > 0 ? '#1f1d1f' : '#f6f3ec'; });
    return wrap(g);
  };
  M.custom.a_horse = function () {
    var g = horse(function (x, y, z, p) { if (y < 0.012) return '#2a2420'; if (p === 'leg' && y < 0.07) return '#f2ece0'; if (p === 'head' && x > 0.38 && Math.abs(z) < 0.012) return '#f2ece0'; return vary('#8a5a35', x, y, z, 0.05); }, '#2e2018');
    // a little saddle blanket (Mongolian style)
    ball(g, 0.0, 0.42, 0, 0.07, '#c0392b', 1, 0.3, 1.25);
    return wrap(g);
  };
  M.custom.a_tiger = function () {
    var org = '#e8892e';
    var g = quad({ sides: 11, L: 0.52, legH: 0.17, bR: 0.085, bW: 0.08, legR: 0.024, kneeR: -0.025, neck: { len: 0.05, ang: 0.3, r: 0.05 }, head: { len: 0.12, r: 0.054, snout: 0.038, ang: -0.1, eye: 0.008 }, earL: 0.022, earR: 0.014, tail: 0.28,
      col: function (x, y, z, p) {
        if (y < 0.012) return '#3a2a20';
        if ((p === 'body' && y < 0.205) || (p === 'head' && x > 0.36 && y < 0.31)) return vary('#f7efe0', x, y, z, 0.03);
        var v = p === 'leg' ? Math.sin(y * 80 + x * 10) : p === 'tail' ? Math.sin(Math.hypot(x, y) * 120) : Math.sin(x * 58 + Math.sin(y * 25) * 1.6 + noise(y * 10, z * 6) * 1.6);
        return v > 0.55 ? '#1f1814' : vary(org, x, y, z, 0.04);
      } });
    return wrap(g);
  };
  M.custom.a_deer = function () {
    var g = quad({ sides: 10, L: 0.34, legH: 0.3, bR: 0.07, bW: 0.06, legR: 0.013, kneeR: -0.03, neck: { len: 0.13, ang: 1.05, r: 0.03 }, head: { len: 0.11, r: 0.032, snout: 0.02, ang: -0.75, eye: 0.007 }, earL: 0.04, earR: 0.013, tail: 0.04,
      col: function (x, y, z, p) { if (y < 0.012) return '#2a2420'; if (p === 'body' && y < 0.33) return '#f1e6d2'; if (p === 'tail') return '#f6f1e6'; if (p === 'body' && worley(x, y, z, 30).f1 < 0.16) return '#f6efe2'; return vary('#b0773f', x, y, z, 0.05); } });
    var u = g.userData, top = u.hp(0.15), ant = '#d8c6a0';
    [-1, 1].forEach(function (s) {
      var b0 = [top[0] - 0.01, top[1] + 0.03, s * 0.02], b1 = [top[0] - 0.02, top[1] + 0.12, s * 0.06], b2 = [top[0] + 0.0, top[1] + 0.2, s * 0.07];
      tube(g, [[b0[0], b0[1], b0[2], 0.006, 0.006], [b1[0], b1[1], b1[2], 0.005, 0.005], [b2[0], b2[1], b2[2], 0.003, 0.003]], ant, 'ant', 5, 0);
      cone(g, [b1[0] - 0.005, b1[1] - 0.04, b1[2]], [b1[0] + 0.04, b1[1] - 0.01, b1[2]], 0.004, ant, 4);
      cone(g, [b1[0], b1[1], b1[2]], [b1[0] - 0.04, b1[1] + 0.05, b1[2] + s * 0.01], 0.004, ant, 4);
    });
    return wrap(g);
  };
  M.custom.a_bison = function () {
    var g = quad({ sides: 11, L: 0.5, legH: 0.17, bR: 0.13, bW: 0.11, legR: 0.03, slope: -0.18, kneeR: -0.02, neck: { len: 0.02, ang: 0, r: 0.08 }, head: { len: 0.14, r: 0.07, snout: 0.05, ang: -1.1, eye: 0.008 }, earL: 0.02, tail: 0.12,
      col: function (x, y, z, p) { if (y < 0.012) return '#1e1814'; return vary(x > 0.02 || p === 'head' || p === 'neck' ? '#4a2f1d' : '#7a5232', x, y, z, 0.07); } });
    var u = g.userData;
    tube(g, [[0.02, u.by + 0.08, 0, 0.1, 0.1], [0.12, u.by + 0.14, 0, 0.12, 0.13], [0.24, u.by + 0.05, 0, 0.1, 0.12]], function (x, y, z) { return vary('#4a2f1d', x, y, z, 0.08); }, 'hump', 10, 0.35, 6);
    var h = u.hp(0.2); [-1, 1].forEach(function (s) { tube(g, [[h[0], h[1] + 0.04, s * 0.05, 0.008, 0.008], [h[0] + 0.005, h[1] + 0.06, s * 0.085, 0.006, 0.006], [h[0] + 0.02, h[1] + 0.09, s * 0.085, 0.003, 0.003]], '#d8d0c0', 'horn', 5, 0); });
    return wrap(g);
  };
  M.custom.a_hippo = function () {
    var g = new T.Group(); water(g, 0.36, '#4f9fd0');
    var hip = quad({ sides: 11, L: 0.5, legH: 0.08, bR: 0.15, bW: 0.15, legR: 0.045, kneeR: 0, neck: { len: 0.02, ang: 0, r: 0.1 }, head: { len: 0.22, r: 0.1, snout: 0.095, ang: -0.15, eye: 0.01 }, earL: 0.02, earR: 0.012, tail: 0.06,
      col: function (x, y, z, p) { if (y < 0.012) return '#5a4a55'; return vary(y < 0.12 && p === 'body' ? '#c9a2a2' : '#8f7a8f', x, y, z, 0.05); } });
    var u = hip.userData, tip = u.hp(0.95); [-1, 1].forEach(function (s) { ball(hip, tip[0], tip[1] + 0.06, s * 0.05, 0.02, '#7a6676'); });
    g.add(hip); return wrap(g);
  };
  M.custom.a_rhino = function () {
    var g = quad({ sides: 11, L: 0.52, legH: 0.15, bR: 0.14, bW: 0.12, legR: 0.038, kneeR: 0, neck: { len: 0.03, ang: 0.1, r: 0.08 }, head: { len: 0.21, r: 0.07, snout: 0.05, ang: -0.55, eye: 0.007 }, earL: 0.035, earR: 0.014, tail: 0.08,
      col: function (x, y, z) { if (y < 0.012) return '#5a5a55'; return vary('#a5a39c', x, y, z, 0.06); } });
    var u = g.userData, a = u.hp(0.88), b = u.hp(0.6);
    cone(g, [a[0], a[1] + 0.03, 0], [a[0] + 0.03, a[1] + 0.13, 0], 0.022, '#cfc8b6', 6);
    cone(g, [b[0], b[1] + 0.05, 0], [b[0] + 0.01, b[1] + 0.1, 0], 0.016, '#cfc8b6', 6);
    return wrap(g);
  };
  function camel(humps, col) {
    var g = quad({ sides: 10, L: 0.42, legH: 0.36, bR: 0.09, bW: 0.075, legR: 0.019, kneeR: -0.02, kneeF: 0.01, neck: { len: 0.2, ang: 0.35, r: 0.036 }, head: { len: 0.12, r: 0.034, snout: 0.026, ang: 0.15, eye: 0.007 }, earL: 0.02, earR: 0.01, tail: 0.14,
      col: function (x, y, z) { if (y < 0.012) return '#5a4535'; return vary(col, x, y, z, 0.06); } });
    var u = g.userData; humps.forEach(function (hx) { tube(g, [[hx - 0.07, u.by + 0.05, 0, 0.05, 0.03], [hx, u.by + 0.13, 0, 0.055, 0.07], [hx + 0.07, u.by + 0.05, 0, 0.045, 0.03]], function (x, y, z) { return vary(shade(col, -0.03), x, y, z, 0.06); }, 'hump', 9, 0.2, 3); });
    return g;
  }
  M.custom.a_camel = function () { return wrap(camel([0.0], '#d6a96a')); };
  M.custom.a_bactrian = function () { var g = camel([-0.09, 0.08], '#9b6d40'); ball(g, 0.23, 0.48, 0, 0.05, '#7a5432', 1, 1.2, 0.8, 1); return wrap(g); };
  M.custom.a_llama = function () {
    var g = quad({ sides: 10, L: 0.34, legH: 0.28, bR: 0.08, bW: 0.07, legR: 0.018, neck: { len: 0.24, ang: 1.35, r: 0.034 }, head: { len: 0.1, r: 0.034, snout: 0.024, ang: -0.3, eye: 0.007 }, earL: 0.055, earR: 0.011, tail: 0.06,
      col: function (x, y, z, p) { if (y < 0.012) return '#3a2c22'; var w = worley(x, y, z, 9); return vary(w.id > 0.62 && p !== 'head' ? '#9a6a42' : '#f2ebde', x, y, z, 0.05); } });
    ball(g, 0.0, 0.42, 0, 0.06, '#e8473a', 1.1, 0.25, 1.3);
    return wrap(g);
  };
  M.custom.a_sheep = function () {
    var wool = '#f3eee2', g = quad({ sides: 10, L: 0.36, legH: 0.14, bR: 0.11, bW: 0.1, legR: 0.014, neck: { len: 0.04, ang: 0.4, r: 0.05 }, head: { len: 0.09, r: 0.035, snout: 0.025, ang: -0.7, eye: 0.007 }, earL: 0.03, earR: 0.012, tail: 0.04,
      col: function (x, y, z, p) { return p === 'head' || p === 'leg' || p === 'ear' ? '#2a2522' : vary(wool, x, y, z, 0.04); } });
    for (var i = 0; i < 14; i++) { var a = hash(i, 4) * D2, x = (hash(i, 2) - 0.5) * 0.3; ball(g, x, 0.27 + Math.sin(a) * 0.08, Math.cos(a) * 0.08, 0.045, vary(wool, x, a, i, 0.05), 1, 1, 1, 0); }
    return wrap(g);
  };

  /* ---------------- bears ---------------- */
  function bear(colFn, opt) {
    opt = opt || {};
    var g = quad({ sides: 11, L: opt.L || 0.46, legH: 0.14, bR: 0.12, bW: 0.11, legR: 0.037, kneeR: 0, foot: 0.015, slope: opt.slope || 0, neck: { len: opt.neck || 0.06, ang: 0.15, r: 0.075 }, head: { len: opt.hl || 0.13, r: 0.068, snout: opt.snout || 0.036, ang: -0.3, eye: 0.008 }, ears: false, tail: 0.03, col: colFn });
    return g;
  }
  M.custom.a_grizzly = function () {
    var c = function (x, y, z, p) { if (y < 0.012) return '#2a1d14'; if (p === 'head' && x > 0.36) return vary('#a37a52', x, y, z); return vary('#7a4f2a', x, y, z, 0.07); };
    var g = bear(c, { slope: -0.08 }), u = g.userData; roundEars(g, u, '#6a4322', 0.022);
    tube(g, [[0.04, u.by + 0.06, 0, 0.07, 0.06], [0.11, u.by + 0.1, 0, 0.08, 0.07], [0.18, u.by + 0.05, 0, 0.06, 0.05]], function (x, y, z) { return vary('#6a4322', x, y, z, 0.06); }, 'hump', 9, 0.2);
    var t = u.hp(1); ball(g, t[0], t[1], 0, 0.014, '#1e1612');
    // a salmon in its mouth
    tube(g, [[t[0] - 0.02, t[1] - 0.02, -0.07, 0.012, 0.018], [t[0] - 0.015, t[1] - 0.025, 0, 0.018, 0.026], [t[0] - 0.01, t[1] - 0.02, 0.07, 0.01, 0.014]], '#e88a7a', 'fish', 6, 0.1);
    return wrap(g);
  };
  M.custom.a_polarbear = function () {
    var g = new T.Group(); var ice = new T.Mesh(new T.CylinderGeometry(0.42, 0.45, 0.04, 9), solid('#eef6fb', { flatShading: true })); ice.position.y = 0.02; g.add(ice);
    var b = bear(function (x, y, z, p) { if (y < 0.012) return '#3a3a3a'; return vary('#f4f0e4', x, y, z, 0.04); }, { L: 0.5, neck: 0.11, hl: 0.12, snout: 0.03 });
    var u = b.userData; roundEars(b, u, '#ece6d6', 0.018); var t = u.hp(1); ball(b, t[0], t[1], 0, 0.012, '#1e1612');
    b.position.y = 0.04; g.add(b); return wrap(g);
  };
  M.custom.a_panda = function () {
    var L = 0.42, c = function (x, y, z, p) {
      if (p === 'leg' || p === 'tail') return '#1e1c1e';
      if (p === 'body' && x > 0.03 && x < 0.13) return '#1e1c1e';
      return vary('#f4f1ea', x, y, z, 0.03);
    };
    var g = bear(c, { L: L, neck: 0.04, hl: 0.12, snout: 0.03 }), u = g.userData;
    roundEars(g, u, '#1e1c1e', 0.024);
    var e = u.hp(0.42); [-1, 1].forEach(function (s) { ball(g, e[0] + 0.005, e[1] + 0.02, s * 0.048, 0.022, '#1e1c1e', 1, 1.25, 0.6); ball(g, e[0] + 0.012, e[1] + 0.025, s * 0.058, 0.007, '#ffffff'); });
    var t = u.hp(1); ball(g, t[0], t[1] + 0.005, 0, 0.012, '#1e1c1e');
    // bamboo
    for (var i = 0; i < 3; i++) { var bx = -0.2 + i * 0.06; tube(g, [[bx, 0, -0.18, 0.01, 0.01], [bx + 0.01, 0.25, -0.18, 0.009, 0.009], [bx + 0.02, 0.5, -0.18, 0.008, 0.008]], function (x, y) { return Math.sin(y * 60) > 0.9 ? '#5a8a3a' : '#7cb54e'; }, 'bamboo', 6, 0); }
    return wrap(g);
  };

  /* ---------------- birds ---------------- */
  // tilt: 0 = standing up, 1.2 = leaning forward. o.col(x,y,z,part)
  function bird(o) {
    var g = new T.Group(), t = o.tilt || 0, d = [Math.sin(t), Math.cos(t)], L = o.len, r = o.r, y0 = o.legH || 0.02, c = o.col;
    var P = function (f, up) { return [d[0] * L * f, y0 + r * 0.6 + d[1] * L * f + (up || 0), 0]; };
    var sp = [[0, 0.45], [0.18, 0.92], [0.5, 1], [0.8, 0.85], [1, 0.55]].map(function (q) { var p = P(q[0]); return [p[0], p[1], 0, r * q[1] * (o.wide || 1), r * q[1]]; });
    tube(g, sp, c, 'body', 10, 0.1, 5);
    var top = P(1.0), hr = o.hr || r * 0.6, hc = [top[0] + (o.hx || 0.01), top[1] + hr * 0.8, 0];
    ball(g, hc[0], hc[1], 0, hr, c(hc[0], hc[1], 0, 'head'), 1, 1, 1, 1);
    cone(g, [hc[0] + hr * 0.7, hc[1] - hr * 0.1, 0], [hc[0] + hr * 0.7 + (o.beak || 0.03), hc[1] - hr * 0.1 - (o.beakDown || 0.01), 0], o.beakR || hr * 0.3, o.beakCol || '#f2b33d', 5);
    [-1, 1].forEach(function (s) { eye(g, hc[0] + hr * 0.45, hc[1] + hr * 0.25, s * hr * 0.75, o.eye || hr * 0.18); });
    // wings folded along the sides
    [-1, 1].forEach(function (s) {
      var a = P(0.85), b = P(0.2), e = P(-0.1);
      tube(g, [[a[0], a[1], s * r * 0.85, r * 0.15, r * 0.35], [b[0] - 0.01, b[1], s * r * 0.95, r * 0.18, r * 0.5], [e[0] - 0.04, e[1] - 0.01, s * r * 0.6, r * 0.1, r * 0.2]], function (x, y, z) { return c(x, y, z, 'wing'); }, 'wing', 6, 0.1);
    });
    if (o.legH) [-1, 1].forEach(function (s) { tube(g, [[0.0, y0 + r * 0.3, s * r * 0.35, 0.007, 0.007], [0.0, 0.01, s * r * 0.35, 0.006, 0.006]], o.legCol || '#e0a030', 'leg', 4, 0); cone(g, [0, 0.003, s * r * 0.35], [0.035, 0.003, s * r * 0.35], 0.012, o.legCol || '#e0a030', 3); });
    g.userData = { P: P, hc: hc, hr: hr, r: r };
    return g;
  }
  M.custom.a_penguin = function () {
    var g = new T.Group(); var ice = new T.Mesh(new T.CylinderGeometry(0.34, 0.36, 0.03, 8), solid('#eef6fb', { flatShading: true })); ice.position.y = 0.015; g.add(ice);
    function pen(x, z, s, turn) {
      var b = bird({ len: 0.34 * s, r: 0.1 * s, legH: 0.005, hr: 0.055 * s, beak: 0.05 * s, beakR: 0.012 * s, beakCol: '#2a2a2a', hx: 0.0, eye: 0.007 * s, col: function (x, y, z, p) {
        if (p === 'head') return '#1c1d22'; if (p === 'wing') return '#22242b';
        if (x > 0.02 * s) return y > 0.3 * s ? (y > 0.36 * s ? '#1c1d22' : '#f7c948') : vary('#f8f6f0', x, y, z, 0.02);
        return vary('#22242b', x, y, z, 0.04);
      }, legH: 0.005, legCol: '#2a2a2a' });
      [-1, 1].forEach(function (k) { ball(b, b.userData.hc[0] - 0.005, b.userData.hc[1] - 0.02 * s, k * 0.04 * s, 0.018 * s, '#f7a93c', 1, 1, 0.5); });
      b.position.set(x, 0.03, z); b.rotation.y = turn || 0; g.add(b);
    }
    pen(0, 0, 1, 0); pen(-0.12, -0.12, 0.45, 0.4); pen(0.16, -0.14, 0.8, -0.3);
    return wrap(g, 0.2);
  };
  M.custom.a_owl = function () {
    var g = new T.Group();
    tube(g, [[0, 0, 0, 0.06, 0.06], [0, 0.12, 0, 0.055, 0.055]], '#7a5a3a', 'stump', 7, 0.2);
    var b = bird({ len: 0.2, r: 0.085, hr: 0.07, beak: 0.02, beakR: 0.01, beakCol: '#3a3a3a', hx: -0.01, eye: 0.001, col: function (x, y, z, p) { return vary(worley(x, y, z, 40).e < 0.15 ? '#5a4030' : '#9a7a52', x, y, z, 0.05); } });
    var u = b.userData, hc = u.hc;
    [-1, 1].forEach(function (s) { ball(b, hc[0] + 0.045, hc[1] + 0.01, s * 0.032, 0.03, '#d9c7a4', 0.5, 1, 1); ball(b, hc[0] + 0.06, hc[1] + 0.015, s * 0.03, 0.017, '#f2b33d', 0.5, 1, 1); ball(b, hc[0] + 0.07, hc[1] + 0.015, s * 0.03, 0.009, '#151515'); cone(b, [hc[0] - 0.01, hc[1] + 0.05, s * 0.035], [hc[0] - 0.02, hc[1] + 0.1, s * 0.05], 0.012, '#7a5a3a', 4); });
    b.position.y = 0.12; g.add(b); return wrap(g, 1.2);
  };
  M.custom.a_eagle = function () {
    var g = new T.Group(); ball(g, 0, 0.04, 0, 0.12, '#8d8a80', 1.2, 0.5, 1, 0);
    var b = bird({ len: 0.26, r: 0.07, tilt: 0.45, hr: 0.045, beak: 0.04, beakR: 0.014, beakDown: 0.025, beakCol: '#f2b33d', eye: 0.007, legH: 0.03, legCol: '#f2b33d', col: function (x, y, z, p) { return p === 'head' ? '#f8f6f0' : vary('#5a3a24', x, y, z, 0.05); } });
    var u = b.userData, e = u.P(-0.25); flat(b, [[0, 0], [-0.1, -0.02], [-0.09, 0.03]], 0.04, '#f8f6f0', e[0] + 0.03, e[1] + 0.02, 0);
    b.position.y = 0.08; g.add(b); return wrap(g);
  };
  M.custom.a_macaw = function () {
    var g = new T.Group();
    tube(g, [[-0.25, 0.2, 0, 0.015, 0.015], [0.25, 0.22, 0, 0.013, 0.013]], '#7a5a3a', 'branch', 6, 0.2); tube(g, [[-0.2, 0, -0.04, 0.03, 0.03], [-0.22, 0.2, 0, 0.02, 0.02]], '#7a5a3a', 'trunk', 6, 0.2);
    var b = bird({ len: 0.2, r: 0.05, tilt: 0.25, hr: 0.038, beak: 0.03, beakR: 0.015, beakDown: 0.02, beakCol: '#e8e4dc', eye: 0.007, col: function (x, y, z, p) { if (p === 'wing') return y > 0.12 ? '#f2c14e' : '#2b6fd6'; return '#e8352b'; } });
    var u = b.userData, e = u.P(-0.1); tube(b, [[e[0], e[1], 0, 0.015, 0.01], [e[0] - 0.05, e[1] - 0.15, 0, 0.012, 0.006], [e[0] - 0.07, e[1] - 0.25, 0, 0.004, 0.003]], function (x, y) { return y > -0.05 ? '#e8352b' : '#2b6fd6'; }, 'tail', 4, 0);
    b.position.set(0, 0.22, 0); g.add(b); return wrap(g, 0.3);
  };
  M.custom.a_peacock = function () {
    var g = new T.Group();
    // the fan: rings of feathers with eye spots
    var fan = new T.CircleGeometry(0.34, 22, Math.PI * 0.08, Math.PI * 0.84); fan.rotateY(-Math.PI / 2); fan.translate(-0.08, 0.06, 0);
    part(g, fan, function (x, y, z) { var r = Math.hypot(z, y - 0.06), a = Math.atan2(y - 0.06, z), sp = Math.abs(Math.sin(a * 11)); if (r > 0.18 && sp > 0.8) { var rr = (r * 10) % 1; return rr < 0.3 ? '#1c2f8a' : rr < 0.55 ? '#2bb3a0' : '#c9a24a'; } return r > 0.06 ? '#2f8f4a' : '#1f6b3a'; });
    var back = fan.clone(); back.rotateY(Math.PI); back.translate(-0.165, 0, 0); part(g, back, '#5a6a3a');
    var b = bird({ len: 0.2, r: 0.05, tilt: 0.3, hr: 0.03, beak: 0.02, beakR: 0.007, beakCol: '#c9b28a', legH: 0.09, legCol: '#8a8a7a', eye: 0.006, col: function (x, y, z, p) { return p === 'wing' ? '#7a6a4a' : vary('#1f4fc9', x, y, z, 0.05); } });
    var hc = b.userData.hc; for (var i = 0; i < 5; i++) { var a = -0.5 + i * 0.25; cone(b, [hc[0] - 0.005, hc[1] + 0.02, a * 0.04], [hc[0] - 0.01 + Math.sin(a) * 0.005, hc[1] + 0.07, a * 0.06], 0.003, '#1f4fc9', 3); ball(b, hc[0] - 0.01, hc[1] + 0.072, a * 0.06, 0.006, '#1f4fc9'); }
    b.position.x = 0.05; g.add(b); return wrap(g, 1.0);
  };
  M.custom.a_flamingo = function () {
    var g = new T.Group(); water(g, 0.3, '#5fb3e3');
    var pink = '#f48aa8', b = bird({ len: 0.17, r: 0.06, tilt: 1.25, legH: 0.0, hr: 0.025, beak: 0.04, beakR: 0.01, beakDown: 0.03, beakCol: '#2a2a2a', hx: 0.0, eye: 0.004, col: function (x, y, z, p) { return vary(p === 'wing' ? '#e9718f' : pink, x, y, z, 0.04); } });
    b.position.y = 0.32; g.add(b);
    var u = b.userData, s = u.P(1.0); // S-shaped neck up to a head
    tube(g, [[s[0] - 0.04, s[1] + 0.32, 0, 0.016, 0.016], [s[0] + 0.0, s[1] + 0.42, 0, 0.012, 0.012], [s[0] - 0.05, s[1] + 0.52, 0, 0.011, 0.011], [s[0] - 0.01, s[1] + 0.62, 0, 0.012, 0.012]], pink, 'neck', 6, 0.05);
    ball(g, s[0] + 0.005, s[1] + 0.64, 0, 0.022, pink); cone(g, [s[0] + 0.02, s[1] + 0.64, 0], [s[0] + 0.06, s[1] + 0.6, 0], 0.009, '#2a2a2a', 4); eye(g, s[0] + 0.01, s[1] + 0.65, 0.018, 0.004); eye(g, s[0] + 0.01, s[1] + 0.65, -0.018, 0.004);
    // one leg down, one tucked up
    tube(g, [[0.0, 0.33, 0.02, 0.006, 0.006], [0.01, 0.17, 0.02, 0.005, 0.005], [0.0, 0.0, 0.02, 0.005, 0.005]], '#e9718f', 'leg', 4, 0);
    tube(g, [[0.0, 0.33, -0.02, 0.006, 0.006], [-0.01, 0.22, -0.02, 0.005, 0.005], [0.06, 0.26, -0.02, 0.005, 0.005]], '#e9718f', 'leg', 4, 0);
    // a friend in the back
    var f = b.clone(); f.position.set(-0.18, 0.28, -0.15); f.scale.setScalar(0.8); g.add(f);
    return wrap(g);
  };

  /* ---------------- fish & sea ---------------- */
  function fish(o) {
    var g = new T.Group(), L = o.L, c = o.col, sp = (o.prof || [0.3, 0.85, 1, 0.9, 0.6, 0.25]).map(function (f, i, arr) { var t = i / (arr.length - 1); return [L / 2 - t * L, 0, 0, o.w * f, o.h * f]; });
    tube(g, sp, c, 'body', 10, 0.08, 6);
    var tx = -L / 2; flat(g, [[0, 0], [-o.tail, o.tail * 0.9], [-o.tail * 0.7, 0], [-o.tail, -o.tail * 0.8]], 0.008, typeof c === 'function' ? c(tx, 0, 0, 'fin') : c, tx + 0.01, 0, 0);
    if (o.dorsal) flat(g, [[0.05, 0], [-0.02, o.dorsal], [-0.07, 0]], 0.008, typeof c === 'function' ? c(0, o.h, 0, 'fin') : c, 0, o.h * 0.85, 0);
    [-1, 1].forEach(function (s) { var fin = flat(g, [[0, 0], [-o.fin * 0.5, -o.fin], [-o.fin * 0.8, -o.fin * 0.3]], 0.006, typeof c === 'function' ? c(0, 0, 0, 'fin') : c, L * 0.18, -o.h * 0.35, s * o.w * 0.8, s * 0.6); });
    eye(g, L / 2 - L * 0.12, o.h * 0.25, o.w * 0.75, o.eye || 0.008); eye(g, L / 2 - L * 0.12, o.h * 0.25, -o.w * 0.75, o.eye || 0.008);
    return g;
  }
  M.custom.a_whaleshark = function () {
    var g = new T.Group(); water(g, 0.45, '#3f8fd0');
    var f = fish({ L: 0.7, w: 0.09, h: 0.075, tail: 0.14, dorsal: 0.08, fin: 0.1, eye: 0.007, prof: [0.75, 1, 1, 0.85, 0.55, 0.22], col: function (x, y, z, p) { if (y < -0.02 && p === 'body') return '#d8dde2'; return worley(x, y, z, 30).f1 < 0.13 ? '#e8eef2' : vary('#3d556e', x, y, z, 0.04); } });
    f.position.y = 0.035; g.add(f); var ring = new T.Mesh(new T.RingGeometry(0.36, 0.4, 20), solid('#cfefff', { side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.011; g.add(ring);
    return wrap(g);
  };
  M.custom.a_clownfish = function () {
    var g = new T.Group(); water(g, 0.36, '#57c1ec');
    ball(g, 0, 0.05, 0, 0.14, '#c9b28a', 1.3, 0.45, 1, 1);
    for (var i = 0; i < 40; i++) { var a = hash(i, 1) * D2, r = hash(i, 2) * 0.12; cone(g, [Math.cos(a) * r, 0.1, Math.sin(a) * r], [Math.cos(a) * r * 1.3, 0.2 + hash(i, 3) * 0.06, Math.sin(a) * r * 1.3], 0.01, i % 2 ? '#c46ad6' : '#e08ae6', 4); }
    [[0.06, 0.3, 0.02, 1], [-0.12, 0.26, -0.06, 0.7]].forEach(function (q) {
      var f = fish({ L: 0.2, w: 0.035, h: 0.055, tail: 0.05, dorsal: 0.03, fin: 0.03, eye: 0.006, col: function (x, y, z, p) { if (p === 'fin') return '#f27a1a'; var b = Math.abs(x) < 0.012 || Math.abs(x - 0.06) < 0.01 || Math.abs(x + 0.065) < 0.009; return b ? '#ffffff' : (Math.abs(x) < 0.018 || Math.abs(x - 0.06) < 0.016 || Math.abs(x + 0.065) < 0.015 ? '#1d1a1a' : '#f27a1a'); } });
      f.position.set(q[0], q[1], q[2]); f.scale.setScalar(q[3]); g.add(f);
    });
    return wrap(g, 0.2);
  };
  M.custom.a_whale = function () {
    var g = new T.Group(); water(g, 0.5, '#3f8fd0');
    var top = '#3b4a5e', c = function (x, y, z, p) { return p === 'fin' ? '#e8ecef' : (y < 0.12 + x * 0.6 ? vary('#d9dde2', x, y, z, 0.03) : vary(top, x, y, z, 0.04)); };
    // breaching: body arcs up out of the water
    tube(g, [[-0.45, -0.05, 0, 0.03, 0.025], [-0.3, 0.02, 0, 0.07, 0.07], [-0.1, 0.13, 0, 0.1, 0.1], [0.08, 0.25, 0, 0.1, 0.1], [0.22, 0.36, 0, 0.075, 0.07], [0.3, 0.41, 0, 0.03, 0.03]], c, 'body', 10, 0.08, 4);
    [-1, 1].forEach(function (s) { flat(g, [[0, 0], [-0.04, -0.02], [-0.06, -0.3], [-0.01, -0.28]], 0.012, '#e8ecef', 0.1, 0.24, s * 0.1, s * 0.5); });
    flat(g, [[0, 0], [-0.08, 0.09], [-0.05, 0], [-0.08, -0.09]], 0.012, top, -0.45, -0.03, 0).rotation;
    eye(g, 0.2, 0.33, 0.07, 0.008); eye(g, 0.2, 0.33, -0.07, 0.008);
    for (var i = 0; i < 9; i++) { var a = i / 9 * D2; ball(g, 0.05 + Math.cos(a) * 0.18, 0.02, Math.sin(a) * 0.18, 0.035, '#ffffff', 1, 0.8, 1); }
    return wrap(g);
  };
  M.custom.a_seal = function () {
    var g = new T.Group(); var ice = new T.Mesh(new T.CylinderGeometry(0.36, 0.4, 0.04, 8), solid('#eef6fb', { flatShading: true })); ice.position.y = 0.02; g.add(ice); water(g, 0.5, '#3f8fd0', 0.002);
    var c = function (x, y, z, p) { return worley(x, y, z, 35).f1 < 0.12 ? '#4a4f58' : vary(y < 0.08 ? '#c9c6bc' : '#9a9a96', x, y, z, 0.04); };
    tube(g, [[-0.25, 0.06, 0, 0.02, 0.015], [-0.15, 0.08, 0, 0.07, 0.06], [0.02, 0.1, 0, 0.09, 0.08], [0.15, 0.12, 0, 0.06, 0.06], [0.22, 0.16, 0, 0.045, 0.045], [0.27, 0.16, 0, 0.03, 0.028]], c, 'body', 10, 0.08);
    flat(g, [[0, 0], [-0.06, 0.04], [-0.06, -0.04]], 0.008, '#6a6d72', -0.25, 0.06, 0);
    [-1, 1].forEach(function (s) { flat(g, [[0, 0], [-0.05, -0.03], [-0.02, -0.04]], 0.008, '#6a6d72', 0.1, 0.07, s * 0.07, s * 0.6); eye(g, 0.24, 0.18, s * 0.03, 0.009); });
    ball(g, 0.29, 0.155, 0, 0.008, '#222');
    g.position.y = 0.02; return wrap(g);
  };
  M.custom.a_otter = function () {
    var g = new T.Group(); water(g, 0.36, '#3f8fd0');
    var br = '#6a4a30', c = function (x, y, z) { return vary(y > 0.05 ? '#8a6a48' : br, x, y, z, 0.05); };
    // floating on its back
    tube(g, [[-0.22, 0.02, 0, 0.03, 0.02], [-0.12, 0.035, 0, 0.06, 0.045], [0.02, 0.04, 0, 0.07, 0.05], [0.12, 0.05, 0, 0.055, 0.045], [0.17, 0.08, 0, 0.04, 0.04]], c, 'body', 10, 0.08);
    ball(g, 0.2, 0.1, 0, 0.05, '#c9b49a', 1, 0.9, 1, 1); ball(g, 0.24, 0.1, 0, 0.022, '#e0d2bc'); ball(g, 0.262, 0.11, 0, 0.008, '#1d1a1a');
    [-1, 1].forEach(function (s) { eye(g, 0.235, 0.13, s * 0.025, 0.007); ball(g, 0.18, 0.13, s * 0.04, 0.012, '#6a4a30'); });
    ball(g, 0.07, 0.09, 0, 0.025, '#f2a7c3', 1, 0.5, 1); // shell on its tummy
    [-1, 1].forEach(function (s) { ball(g, 0.08, 0.09, s * 0.035, 0.014, br); ball(g, -0.18, 0.05, s * 0.04, 0.02, br, 1.4, 0.5, 1); });
    return wrap(g, 0.2);
  };

  /* ---------------- reptiles ---------------- */
  function reptile(o) {
    var g = new T.Group(), y = o.y || 0.05, c = o.col;
    tube(g, [[-o.L * 0.95, 0.008, 0, 0.008, 0.006], [-o.L * 0.55, y * 0.6, 0, o.w * 0.4, o.h * 0.4], [-o.L * 0.2, y, 0, o.w * 0.85, o.h * 0.85], [0, y, 0, o.w, o.h], [o.L * 0.2, y, 0, o.w * 0.9, o.h * 0.85], [o.L * 0.32, y + 0.005, 0, o.w * 0.55, o.h * 0.5]], c, 'body', 9, 0.1, 5);
    tube(g, [[o.L * 0.3, y + 0.005, 0, o.hw, o.hh], [o.L * 0.3 + o.snout * 0.5, y, 0, o.hw * 0.75, o.hh * 0.7], [o.L * 0.3 + o.snout, y - 0.005, 0, o.hw * 0.45, o.hh * 0.45]], c, 'head', 8, 0.08, 7);
    [-1, 1].forEach(function (s) { eye(g, o.L * 0.32, y + o.hh * 0.8, s * o.hw * 0.55, 0.008); });
    [[o.L * 0.12, 1], [-o.L * 0.25, 1]].forEach(function (q) { [-1, 1].forEach(function (s) { tube(g, [[q[0], y, s * o.w * 0.6, 0.015, 0.015], [q[0] + 0.01, y * 0.7, s * (o.w + 0.05), 0.012, 0.012], [q[0] + 0.03, 0.006, s * (o.w + 0.06), 0.012, 0.006]], c, 'leg', 5, 0.1); }); });
    return g;
  }
  M.custom.a_crocodile = function () {
    var green = '#5f7a3a', g = reptile({ L: 0.42, w: 0.06, h: 0.035, y: 0.045, hw: 0.04, hh: 0.025, snout: 0.2, col: function (x, y, z, p) { return vary(y < 0.03 && p !== 'leg' ? '#c9c08a' : green, x, y, z, 0.06); } });
    for (var i = 0; i < 12; i++) { var x = -0.32 + i * 0.045; [-1, 1].forEach(function (s) { cone(g, [x, 0.065 - Math.max(0, -x - 0.2) * 0.15, s * 0.02], [x, 0.085 - Math.max(0, -x - 0.2) * 0.15, s * 0.02], 0.008, '#4a6030', 4); }); }
    for (var t = 0; t < 6; t++) cone(g, [0.18 + t * 0.03, 0.04, 0.03], [0.18 + t * 0.03, 0.03, 0.035], 0.003, '#ffffff', 3);
    water(g, 0.18, '#5aa0c8').position.set(-0.25, 0.004, 0.2);
    return wrap(g, 0.5);
  };
  M.custom.a_komodo = function () {
    var g = reptile({ L: 0.36, w: 0.065, h: 0.04, y: 0.06, hw: 0.04, hh: 0.032, snout: 0.11, col: function (x, y, z) { return vary(worley(x, y, z, 50).e < 0.1 ? '#5f574a' : '#857a64', x, y, z, 0.05); } });
    tube(g, [[0.21, 0.054, 0, 0.004, 0.002], [0.27, 0.05, 0, 0.004, 0.002], [0.29, 0.05, 0.01, 0.002, 0.001]], '#e0566a', 'tongue', 3, 0);
    return wrap(g, 0.5);
  };
  M.custom.a_tortoise = function () {
    var g = new T.Group(), sh = new T.SphereGeometry(0.2, 12, 7, 0, D2, 0, Math.PI / 2); sh.scale(1.2, 0.95, 1); sh.translate(0, 0.05, 0);
    part(g, sh, function (x, y, z) { var w = worley(x, y, z, 12); return w.e < 0.08 ? '#4a3a24' : vary(shade('#8a6a3a', (w.id - 0.5) * 0.1), x, y, z, 0.04); });
    var rim = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 0.035, 12), K.vcMat); g.add(part(g, new T.CylinderGeometry(0.245, 0.24, 0.035, 12).translate(0, 0.05, 0).scale(1.0, 1, 0.84), '#5a4628'));
    var skin = function (x, y, z) { return vary('#8f8a74', x, y, z, 0.05); };
    tube(g, [[0.18, 0.08, 0, 0.04, 0.04], [0.27, 0.12, 0, 0.035, 0.032], [0.33, 0.14, 0, 0.033, 0.03], [0.37, 0.135, 0, 0.022, 0.02]], skin, 'head', 8, 0.08);
    eye(g, 0.34, 0.155, 0.025, 0.007); eye(g, 0.34, 0.155, -0.025, 0.007);
    [[0.13, 0.15], [0.13, -0.15], [-0.13, 0.15], [-0.13, -0.15]].forEach(function (q) { tube(g, [[q[0], 0.06, q[1] * 0.9, 0.04, 0.04], [q[0], 0.0, q[1], 0.042, 0.035]], skin, 'leg', 7, 0.1); });
    return wrap(g);
  };

  /* ---------------- primates & others ---------------- */
  M.custom.a_gorilla = function () {
    var g = new T.Group(), blk = function (x, y, z) { return vary(x < -0.02 && y > 0.18 ? '#7d7f84' : '#2a2a2e', x, y, z, 0.05); };
    tube(g, [[-0.16, 0.2, 0, 0.09, 0.09], [-0.04, 0.26, 0, 0.12, 0.12], [0.08, 0.3, 0, 0.13, 0.12], [0.14, 0.32, 0, 0.09, 0.09]], blk, 'body', 10, 0.15, 4);
    ball(g, 0.19, 0.37, 0, 0.065, '#2a2a2e', 1, 1.05, 0.95, 1); ball(g, 0.235, 0.35, 0, 0.04, '#4a4448', 0.9, 0.8, 1.1, 1); ball(g, 0.2, 0.41, 0, 0.05, '#2a2a2e', 1, 0.5, 1.1);
    [-1, 1].forEach(function (s) { eye(g, 0.235, 0.385, s * 0.025, 0.007);
      tube(g, [[0.1, 0.31, s * 0.11, 0.05, 0.05], [0.16, 0.17, s * 0.13, 0.04, 0.04], [0.19, 0.03, s * 0.12, 0.035, 0.035], [0.2, 0.005, s * 0.12, 0.035, 0.02]], '#2a2a2e', 'arm', 7, 0.15);
      tube(g, [[-0.15, 0.18, s * 0.08, 0.05, 0.05], [-0.13, 0.09, s * 0.1, 0.04, 0.04], [-0.12, 0.005, s * 0.1, 0.035, 0.02]], '#2a2a2e', 'leg', 7, 0.15); });
    return wrap(g);
  };
  M.custom.a_orangutan = function () {
    var g = new T.Group(), o = function (x, y, z) { return vary('#b8541e', x, y, z, 0.08); };
    tube(g, [[0, 0.03, 0, 0.09, 0.09], [0.01, 0.13, 0, 0.11, 0.1], [0.02, 0.23, 0, 0.09, 0.08]], o, 'body', 10, 0.35, 8);
    ball(g, 0.04, 0.31, 0, 0.055, '#b8541e', 1, 1, 1, 1); ball(g, 0.08, 0.3, 0, 0.045, '#8a6a52', 0.6, 1, 1.4, 1);
    [-1, 1].forEach(function (s) { eye(g, 0.11, 0.315, s * 0.018, 0.006);
      tube(g, [[0.02, 0.24, s * 0.09, 0.03, 0.03], [0.08, 0.1, s * 0.17, 0.025, 0.025], [0.12, 0.005, s * 0.15, 0.022, 0.018]], o, 'arm', 6, 0.3);
      tube(g, [[0.0, 0.05, s * 0.07, 0.035, 0.035], [0.1, 0.03, s * 0.1, 0.03, 0.03], [0.13, 0.005, s * 0.06, 0.025, 0.018]], o, 'leg', 6, 0.3); });
    return wrap(g, 1.2);
  };
  M.custom.a_monkey = function () {
    var g = new T.Group(); water(g, 0.28, '#7fd0f0', 0.012);
    for (var i = 0; i < 14; i++) { var a = i / 14 * D2; ball(g, Math.cos(a) * 0.3, 0.03, Math.sin(a) * 0.3, 0.045, vary('#8f8b80', a, i, 0, 0.08), 1, 0.8, 1, 0); }
    var fur = function (x, y, z) { return vary('#9a8a78', x, y, z, 0.06); };
    tube(g, [[0, 0.0, 0, 0.07, 0.07], [0.005, 0.08, 0, 0.075, 0.065], [0.01, 0.14, 0, 0.055, 0.05]], fur, 'body', 9, 0.3);
    ball(g, 0.02, 0.2, 0, 0.05, '#9a8a78', 1, 1, 1, 1); ball(g, 0.055, 0.195, 0, 0.034, '#e98a8a', 0.6, 0.95, 1.1, 1);
    [-1, 1].forEach(function (s) { eye(g, 0.07, 0.205, s * 0.013, 0.005); });
    ball(g, 0.0, 0.25, 0, 0.03, '#ffffff', 1.4, 0.5, 1.4); // a snow cap on its head
    return wrap(g, 1.1);
  };
  M.custom.a_koala = function () {
    var g = new T.Group(), bark = function (x, y, z) { return vary('#a39a8a', x, y, z, 0.05); };
    tube(g, [[-0.05, 0, 0, 0.05, 0.05], [-0.04, 0.3, 0, 0.042, 0.042], [-0.03, 0.55, 0, 0.035, 0.035]], bark, 'trunk', 8, 0.2);
    tube(g, [[-0.04, 0.42, 0, 0.015, 0.015], [0.12, 0.5, -0.05, 0.01, 0.01]], bark, 'branch', 5, 0.2);
    for (var i = 0; i < 8; i++) ball(g, 0.02 + i * 0.018, 0.5 + hash(i, 2) * 0.06, -0.05 + (hash(i, 1) - 0.5) * 0.08, 0.025, '#6a9a5a', 1.6, 0.4, 0.8);
    var fur = function (x, y, z) { return vary(y < 0.27 && x > 0.02 ? '#e8e2d8' : '#9b9ba0', x, y, z, 0.05); };
    tube(g, [[0.03, 0.2, 0, 0.065, 0.06], [0.04, 0.27, 0, 0.07, 0.065], [0.04, 0.34, 0, 0.055, 0.05]], fur, 'body', 9, 0.15);
    ball(g, 0.06, 0.4, 0, 0.055, '#9b9ba0', 1, 0.95, 1.05, 1);
    [-1, 1].forEach(function (s) { ball(g, 0.04, 0.44, s * 0.06, 0.033, '#9b9ba0', 0.6, 1, 1); ball(g, 0.05, 0.44, s * 0.062, 0.02, '#f4f1ea', 0.5, 1, 1); eye(g, 0.105, 0.415, s * 0.022, 0.006);
      tube(g, [[0.05, 0.33, s * 0.05, 0.02, 0.02], [0.0, 0.33, s * 0.06, 0.016, 0.016], [-0.02, 0.33, s * 0.045, 0.014, 0.014]], '#9b9ba0', 'arm', 5, 0.1); });
    ball(g, 0.115, 0.395, 0, 0.018, '#2a2a2e', 0.8, 1.2, 1);
    return wrap(g, 0.7);
  };
  M.custom.a_sloth = function () {
    var g = new T.Group(), bark = '#7a5a3a';
    tube(g, [[-0.3, 0, 0, 0.04, 0.04], [-0.3, 0.5, 0, 0.035, 0.035]], bark, 'trunk', 7, 0.2); tube(g, [[-0.3, 0.45, 0, 0.02, 0.02], [0.28, 0.48, 0, 0.016, 0.016]], bark, 'branch', 6, 0.2);
    for (var i = 0; i < 9; i++) ball(g, -0.32 + i * 0.07, 0.5 + hash(i, 3) * 0.04, (hash(i, 1) - 0.5) * 0.06, 0.04, '#4f9a50', 1.2, 0.6, 1);
    var fur = function (x, y, z) { return vary(noise(x * 40, y * 40) > 0.65 ? '#7a8a5a' : '#9a8062', x, y, z, 0.06); };
    tube(g, [[-0.04, 0.32, 0, 0.055, 0.05], [0.05, 0.3, 0, 0.065, 0.06], [0.12, 0.32, 0, 0.05, 0.045]], fur, 'body', 9, 0.25);
    ball(g, 0.16, 0.3, 0, 0.042, '#9a8062', 1, 1, 1, 1); ball(g, 0.185, 0.29, 0, 0.03, '#e2d4b8', 0.6, 0.9, 1.1);
    [-1, 1].forEach(function (s) { ball(g, 0.2, 0.3, s * 0.016, 0.01, '#3a2a20', 0.6, 0.7, 1.4); eye(g, 0.207, 0.3, s * 0.016, 0.005);
      [[0.1, 0.18], [-0.02, -0.06]].forEach(function (q) { tube(g, [[q[0], 0.32, s * 0.04, 0.018, 0.018], [q[0] + 0.02, 0.4, s * 0.03, 0.015, 0.015], [q[1], 0.47, s * 0.02, 0.013, 0.013]], fur, 'limb', 5, 0.15); }); });
    return wrap(g, 0.3);
  };
  M.custom.a_kangaroo = function () {
    var g = new T.Group(), tan = function (x, y, z, p) { return vary(p === 'body' && x > 0.03 ? '#e2b98a' : '#c38a55', x, y, z, 0.05); };
    tube(g, [[-0.08, 0.1, 0, 0.07, 0.07], [-0.03, 0.2, 0, 0.075, 0.07], [0.02, 0.3, 0, 0.06, 0.055], [0.05, 0.37, 0, 0.04, 0.04]], tan, 'body', 10, 0.1);
    tube(g, [[0.04, 0.38, 0, 0.032, 0.035], [0.08, 0.41, 0, 0.032, 0.03], [0.13, 0.4, 0, 0.018, 0.016]], tan, 'head', 8, 0.1);
    [-1, 1].forEach(function (s) { eye(g, 0.095, 0.42, s * 0.022, 0.006); cone(g, [0.06, 0.42, s * 0.018], [0.045, 0.49, s * 0.03], 0.012, '#b07a48', 4);
      tube(g, [[-0.06, 0.13, s * 0.06, 0.04, 0.05], [-0.01, 0.06, s * 0.07, 0.025, 0.025], [-0.06, 0.012, s * 0.07, 0.016, 0.012], [0.07, 0.006, s * 0.07, 0.016, 0.008]], tan, 'leg', 6, 0.1);
      tube(g, [[0.04, 0.3, s * 0.04, 0.012, 0.012], [0.08, 0.26, s * 0.045, 0.01, 0.01], [0.09, 0.22, s * 0.04, 0.008, 0.008]], tan, 'arm', 5, 0.05); });
    tube(g, [[-0.1, 0.1, 0, 0.035, 0.035], [-0.22, 0.04, 0, 0.025, 0.025], [-0.34, 0.008, 0, 0.012, 0.01]], tan, 'tail', 6, 0.05);
    return wrap(g);
  };
  M.custom.a_beaver = function () {
    var g = new T.Group(); water(g, 0.22, '#4f9fd0').position.set(-0.15, 0.004, -0.15);
    for (var i = 0; i < 7; i++) tube(g, [[-0.32 + i * 0.03, 0.01, -0.3, 0.01, 0.01], [-0.12 + i * 0.02, 0.08 - i * 0.008, -0.12, 0.008, 0.008]], '#8a6a42', 'stick', 4, 0);
    var br = function (x, y, z) { return vary('#7a5232', x, y, z, 0.05); };
    tube(g, [[-0.12, 0.07, 0, 0.06, 0.06], [-0.02, 0.09, 0, 0.085, 0.08], [0.08, 0.08, 0, 0.065, 0.06], [0.13, 0.08, 0, 0.04, 0.04]], br, 'body', 10, 0.15);
    ball(g, 0.15, 0.09, 0, 0.045, '#7a5232', 1.2, 0.9, 0.9, 1); ball(g, 0.195, 0.08, 0, 0.02, '#4a3020');
    [-1, 1].forEach(function (s) { eye(g, 0.18, 0.11, s * 0.028, 0.006); ball(g, 0.135, 0.13, s * 0.03, 0.012, '#5a3a22');
      [[0.07, 0.04], [-0.08, 0.05]].forEach(function (q) { tube(g, [[q[0], q[1], s * 0.05, 0.018, 0.018], [q[0] + 0.01, 0.004, s * 0.055, 0.016, 0.01]], '#4a3020', 'leg', 5, 0.1); }); });
    box2(g, 0.21, 0.065, 0.012, 0.006, 0.02, 0.006, '#f2a24a');
    var tail = new T.CylinderGeometry(0.055, 0.055, 0.015, 8); tail.scale(1.6, 1, 1); tail.translate(-0.25, 0.03, 0); part(g, tail, function (x, z) { return Math.sin(x * 200) > 0.7 ? '#2a201a' : '#3a2e28'; });
    return wrap(g);
  };
  function box2(g, x, y, z, w, h, d, col) { var geo = new T.BoxGeometry(w, h, d); geo.translate(x, y, z); part(g, geo, col); }
  M.custom.a_butterfly = function () {
    var g = new T.Group();
    var tr = new T.ConeGeometry(0.16, 0.5, 7); tr.translate(0, 0.33, 0); part(g, tr, function (x, y, z) { return vary('#3f7f45', x, y, z, 0.06); });
    tube(g, [[0, 0, 0, 0.03, 0.03], [0, 0.1, 0, 0.025, 0.025]], '#6a4a30', 'trunk', 6, 0.1);
    var wingCol = function (x, y, z) { var r = Math.hypot(x, y); return r > 0.05 ? (hash(Math.round(x * 400), Math.round(y * 400)) > 0.7 ? '#ffffff' : '#1d1a1a') : (Math.abs(Math.sin(Math.atan2(y, x) * 5)) > 0.85 ? '#1d1a1a' : '#f28a1a'); };
    function fly(x, y, z, s, rot) {
      var b = new T.Group(); b.position.set(x, y, z); b.rotation.set(0.4, rot, 0); b.scale.setScalar(s); g.add(b);
      tube(b, [[-0.03, 0, 0, 0.006, 0.006], [0.03, 0, 0, 0.005, 0.005]], '#1d1a1a', 'body', 5, 0);
      [-1, 1].forEach(function (k) {
        var up = new T.Shape(); up.moveTo(0, 0); up.quadraticCurveTo(0.03, 0.06, 0.075, 0.055); up.quadraticCurveTo(0.06, 0.01, 0, 0); var gu = new T.ShapeGeometry(up); gu.rotateX(-Math.PI / 2 + k * 0.5); if (k < 0) gu.scale(1, 1, -1);
        var lo = new T.Shape(); lo.moveTo(0, 0); lo.quadraticCurveTo(-0.04, 0.05, -0.02, 0.06); lo.quadraticCurveTo(0.01, 0.03, 0, 0); var gl = new T.ShapeGeometry(lo); gl.rotateX(-Math.PI / 2 + k * 0.5); if (k < 0) gl.scale(1, 1, -1);
        [gu, gl].forEach(function (geo) { geo.rotateY(Math.PI / 2); var m = part(b, geo, wingCol); m.material = K.vcMat.clone(); m.material.side = T.DoubleSide; m.material.vertexColors = true; });
      });
    }
    fly(0.12, 0.42, 0.08, 1.4, 0.3); fly(-0.1, 0.3, 0.14, 1.2, -0.5); fly(0.05, 0.6, -0.04, 1.1, 1.2); fly(0.2, 0.22, -0.06, 1.0, 2.0);
    return wrap(g, 0);
  };
})();
