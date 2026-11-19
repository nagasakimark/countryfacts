/* More animals (batch 3): red panda, ring-tailed lemur, kiwi, okapi. Same tools and rules as tanken/animals.js:
   face +x, stand on y = 0, about 0.6-0.9 long, colours painted per face. */
(function () {
  var T = window.THREE, M = window.MODELS, A = M.animal, K = M.kit;
  var quad = A.quad, tube = A.tube, ball = A.ball, cone = A.cone, part = A.part, wrap = A.wrap, vary = A.vary, shade = A.shade, bird = A.bird, noise = K.noise, hash = K.hash, solid = K.solid;
  var D2 = Math.PI * 2;
  function eye(g, x, y, z, r) { ball(g, x, y, z, r || 0.008, '#1d1a1a'); }
  function branch(g, a, b, r, col) { tube(g, [[a[0], a[1], a[2], r, r], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.01, (a[2] + b[2]) / 2, r * 0.9, r * 0.9], [b[0], b[1], b[2], r * 0.75, r * 0.75]], function (x, y, z) { return vary(col || '#7a5a3a', x, y, z, 0.06); }, 'branch', 6, 0.2); }
  function leaves(g, x, y, z, n, r, col) { for (var i = 0; i < n; i++) ball(g, x + (hash(i, 1) - 0.5) * r * 2.2, y + (hash(i, 2) - 0.5) * r, z + (hash(i, 3) - 0.5) * r * 2, r * (0.6 + 0.4 * hash(i, 4)), shade(col || '#4f8a3f', (hash(i, 5) - 0.5) * 0.1), 1, 0.8, 1, 0); }

  /* ---------- red panda (Nepal, Himalayan forests) ---------- */
  M.custom.a_redpanda = function () {
    var g = new T.Group();
    // a mossy branch to sit on
    branch(g, [-0.32, 0.14, 0.02], [0.3, 0.17, -0.02], 0.03, '#6a4a32');
    tube(g, [[-0.05, 0.0, -0.04, 0.035, 0.035], [-0.04, 0.15, -0.02, 0.03, 0.03]], function (x, y, z) { return vary('#6a4a32', x, y, z, 0.06); }, 'trunk', 6, 0.2);
    leaves(g, 0.22, 0.24, -0.08, 6, 0.045, '#5f9a45');
    var red = '#c8502a', c = function (x, y, z, p) {
      if (p === 'leg' || (p === 'body' && y < 0.19)) return vary('#2a1a14', x, y, z, 0.05);           // dark legs and tummy
      if (p === 'head') { if (x > 0.135) return vary('#f6efe4', x, y, z, 0.03); if (y > 0.29 && Math.abs(z) > 0.02 && Math.abs(z) < 0.035) return '#f6efe4'; return vary('#d8642e', x, y, z, 0.04); } // white muzzle and eyebrow marks
      return vary(red, x, y, z, 0.05);
    };
    var b = new T.Group(); g.add(b); b.position.set(0, 0.17, 0);
    tube(b, [[-0.12, 0.05, 0, 0.055, 0.05], [-0.04, 0.06, 0, 0.065, 0.058], [0.05, 0.065, 0, 0.06, 0.055], [0.1, 0.075, 0, 0.045, 0.045]], function (x, y, z) { return c(x, y + 0.17, z, 'body'); }, 'body', 10, 0.12, 4);
    // a round face, white muzzle, big pointed white-edged ears and tear marks under the eyes
    ball(b, 0.14, 0.11, 0, 0.05, c(0.13, 0.28, 0.0, 'head'), 1.05, 0.95, 1.05, 1);
    ball(b, 0.185, 0.095, 0, 0.022, '#f6efe4', 1.1, 0.8, 1.2); ball(b, 0.205, 0.1, 0, 0.008, '#1d1a1a');
    [-1, 1].forEach(function (s) {
      ball(b, 0.165, 0.135, s * 0.028, 0.012, '#f6efe4', 1, 0.6, 1); eye(b, 0.178, 0.12, s * 0.025, 0.007);
      ball(b, 0.175, 0.098, s * 0.03, 0.012, '#8a3018', 0.6, 1.2, 0.8); // the reddish "tear" stripes
      cone(b, [0.12, 0.15, s * 0.035], [0.11, 0.19, s * 0.05], 0.018, '#f6efe4', 4); cone(b, [0.121, 0.152, s * 0.034], [0.113, 0.18, s * 0.046], 0.011, '#c8502a', 4);
      tube(b, [[0.06, 0.04, s * 0.04, 0.016, 0.016], [0.08, -0.0, s * 0.05, 0.013, 0.013]], '#2a1a14', 'leg', 5, 0.1); // paws gripping the branch
      tube(b, [[-0.1, 0.03, s * 0.04, 0.02, 0.02], [-0.09, -0.01, s * 0.06, 0.015, 0.015]], '#2a1a14', 'leg', 5, 0.1);
    });
    // the big bushy tail hanging down, with pale rings
    tube(b, [[-0.14, 0.04, 0, 0.032, 0.032], [-0.2, -0.0, 0, 0.04, 0.04], [-0.23, -0.08, 0, 0.038, 0.038], [-0.22, -0.16, 0, 0.03, 0.03], [-0.2, -0.21, 0, 0.018, 0.018]], function (x, y) { return Math.sin(y * 70) > 0.3 ? '#e8b080' : '#b8441e'; }, 'tail', 9, 0.15, 6);
    return wrap(g, 0.5);
  };

  /* ---------- ring-tailed lemur (Madagascar) ---------- */
  M.custom.a_lemur = function () {
    var g = new T.Group(), grey = '#9a9590';
    // on all fours on a rock, tail held up in a question mark
    var rk = new T.Mesh(new T.IcosahedronGeometry(0.16, 0), solid('#a8988a', { flatShading: true })); rk.scale.set(1.6, 0.45, 1.1); rk.position.y = 0.04; g.add(rk);
    var l = quad({ sides: 9, L: 0.26, legH: 0.11, bR: 0.05, bW: 0.045, legR: 0.014, lift: 0.0, kneeR: -0.02, neck: { len: 0.03, ang: 0.4, r: 0.03 }, head: { len: 0.1, r: 0.036, snout: 0.016, ang: -0.35, eye: 0.0001 }, earL: 0.02, earR: 0.009, tail: false,
      col: function (x, y, z, p) { if (p === 'head') return x > 0.2 ? '#2a2826' : vary('#f2efe8', x, y, z, 0.03); if (p === 'body' && y < 0.14) return vary('#f2efe8', x, y, z, 0.03); if (p === 'leg' && y < 0.03) return '#2a2826'; return vary(grey, x, y, z, 0.05); } });
    l.position.y = 0.09; g.add(l);
    var u = l.userData, ep = u.hp(0.4);
    // big orange eyes in black masks
    [-1, 1].forEach(function (s) { ball(l, ep[0] + 0.006, ep[1] + 0.012, s * 0.026, 0.012, '#1d1a1a', 1, 1, 0.6); ball(l, ep[0] + 0.012, ep[1] + 0.013, s * 0.031, 0.007, '#f2a020', 1, 1, 0.5); ball(l, ep[0] + 0.015, ep[1] + 0.013, s * 0.034, 0.003, '#111', 1, 1, 0.5); });
    // the long tail with black and white rings, curling up
    var tp = [[-0.13, u.by + 0.01, 0], [-0.2, u.by + 0.08, 0], [-0.23, u.by + 0.2, 0], [-0.2, u.by + 0.32, 0], [-0.13, u.by + 0.37, 0], [-0.09, u.by + 0.34, 0]];
    tube(l, tp.map(function (p, i) { return [p[0], p[1], p[2], 0.017 - i * 0.001, 0.017 - i * 0.001]; }), function (x, y) { var t = Math.hypot(x + 0.17, y - u.by - 0.18); return Math.sin((y + x * 0.6) * 90) > 0 ? '#1d1c1c' : '#f6f4ee'; }, 'tail', 8, 0.05, 3);
    // a friend sun-bathing (sitting up with arms out, as lemurs do in the morning)
    var f = new T.Group(); f.position.set(0.14, 0.1, -0.12); g.add(f);
    tube(f, [[0, 0.0, 0, 0.035, 0.035], [0, 0.07, 0, 0.04, 0.035], [0, 0.12, 0, 0.03, 0.03]], function (x, y) { return y < 0.08 ? '#f2efe8' : grey; }, 'body', 8, 0.1);
    ball(f, 0, 0.16, 0, 0.03, '#f2efe8'); ball(f, 0.028, 0.155, 0, 0.012, '#2a2826'); [-1, 1].forEach(function (s) { ball(f, 0.02, 0.165, s * 0.014, 0.008, '#1d1a1a'); ball(f, 0.023, 0.166, s * 0.016, 0.004, '#f2a020'); cone(f, [0, 0.18, s * 0.015], [-0.005, 0.2, s * 0.024], 0.008, grey, 4);
      tube(f, [[0, 0.11, s * 0.03, 0.01, 0.01], [0.01, 0.12, s * 0.08, 0.008, 0.008]], grey, 'arm', 4, 0.05); });
    tube(f, [[-0.02, 0.0, 0, 0.012, 0.012], [-0.08, -0.03, 0.02, 0.012, 0.012], [-0.14, -0.04, 0.05, 0.01, 0.01]], function (x) { return Math.sin(x * 120) > 0 ? '#1d1c1c' : '#f6f4ee'; }, 'tail', 6, 0.05);
    // spiny forest plants of southern Madagascar
    for (var k = 0; k < 3; k++) { var px = -0.3 + k * 0.28; tube(g, [[px, 0, -0.25, 0.012, 0.012], [px + 0.01, 0.22, -0.25, 0.008, 0.008]], '#7a8a5a', 'stem', 5, 0.1); for (var t = 0; t < 8; t++) cone(g, [px, 0.04 + t * 0.022, -0.25], [px + Math.cos(t * 2.3) * 0.03, 0.05 + t * 0.022, -0.25 + Math.sin(t * 2.3) * 0.03], 0.003, '#5f7a3a', 3); }
    return wrap(g, 0.45);
  };

  /* ---------- kiwi (New Zealand) ---------- */
  M.custom.a_kiwi = function () {
    var g = new T.Group(), br = '#7a5a3c';
    // ferns of the night-time forest floor
    for (var f = 0; f < 5; f++) { var a = f / 5 * D2 + 0.3, fx = -0.18 + Math.cos(a) * 0.08, fz = -0.12 + Math.sin(a) * 0.06; var fr = new T.Mesh(new T.BoxGeometry(0.2, 0.004, 0.04), solid('#3f8a3f')); fr.position.set(fx + Math.cos(a) * 0.08, 0.05, fz + Math.sin(a) * 0.08); fr.rotation.y = -a; fr.rotation.z = 0.45; g.add(fr); }
    // a round, fluffy brown body with no tail and tiny hidden wings
    tube(g, [[-0.14, 0.12, 0, 0.06, 0.06], [-0.08, 0.13, 0, 0.11, 0.1], [0.02, 0.13, 0, 0.115, 0.105], [0.09, 0.14, 0, 0.08, 0.08], [0.12, 0.16, 0, 0.045, 0.045]], function (x, y, z) { return vary(hash(Math.round(x * 90), Math.round(y * 90 + z * 50)) > 0.5 ? '#6a4a30' : br, x, y, z, 0.06); }, 'body', 12, 0.25, 9);
    ball(g, 0.145, 0.175, 0, 0.042, '#6a4a30', 1, 0.95, 0.95, 1); [-1, 1].forEach(function (s) { eye(g, 0.165, 0.19, s * 0.03, 0.006); });
    // the long, thin beak with nostrils at the very tip (it finds worms by smell)
    tube(g, [[0.17, 0.17, 0, 0.012, 0.01], [0.26, 0.11, 0, 0.007, 0.006], [0.33, 0.05, 0, 0.004, 0.004]], '#e8d8b0', 'beak', 5, 0);
    // strong legs and big feet
    [-1, 1].forEach(function (s) { tube(g, [[0.0, 0.07, s * 0.05, 0.016, 0.016], [0.02, 0.03, s * 0.055, 0.011, 0.011], [0.02, 0.004, s * 0.055, 0.01, 0.008]], '#c8b8a0', 'leg', 5, 0.05); [-0.4, 0, 0.4].forEach(function (a) { cone(g, [0.02, 0.004, s * 0.055], [0.02 + Math.cos(a) * 0.04, 0.003, s * 0.055 + Math.sin(a) * 0.04], 0.005, '#c8b8a0', 3); }); });
    // its egg is huge for its size — about a fifth of the mum's weight
    ball(g, -0.2, 0.04, 0.12, 0.045, '#f4f1ea', 0.8, 1.15, 0.8, 1);
    return wrap(g, 0.4);
  };

  /* ---------- okapi (DR Congo rainforest) ---------- */
  M.custom.a_okapi = function () {
    var choc = '#4a2a20', c = function (x, y, z, p) {
      if (y < 0.012) return '#2a1a14';
      if (p === 'leg') { if (y < 0.05) return '#f2ece0'; if (x < 0 && y > 0.12) return Math.sin(y * 110) > 0 ? '#f6f0e4' : choc; if (y < 0.12) return vary('#f2ece0', x, y, z, 0.03); return choc; } // white socks and zebra-striped back legs
      if (p === 'body' && x < -0.13) return Math.sin(y * 120 + x * 10) > 0.1 ? '#f6f0e4' : choc;                         // stripes on the rump
      if (p === 'head' && x > 0.33) return vary('#e8dcc8', x, y, z, 0.03);                                              // pale face like a giraffe's cousin
      return vary(choc, x, y, z, 0.05);
    };
    var g = quad({ sides: 10, neckSides: 9, L: 0.42, legH: 0.27, bR: 0.085, bW: 0.07, legR: 0.018, slope: 0.12, kneeR: -0.025, neck: { len: 0.14, ang: 0.85, r: 0.042 }, head: { len: 0.16, r: 0.042, snout: 0.028, ang: -0.95, eye: 0.007 }, earL: 0.05, earR: 0.02, tail: 0.15, col: c });
    var u = g.userData, ea = u.hp(0.1);
    [-1, 1].forEach(function (s) { cone(g, [ea[0] + 0.02, ea[1] + 0.035, s * 0.012], [ea[0] + 0.02, ea[1] + 0.06, s * 0.012], 0.005, '#3a2018', 4); }); // little furry horns (males)
    var tip = u.hp(1.0); tube(g, [[tip[0] - 0.005, tip[1] - 0.005, 0.0, 0.004, 0.002], [tip[0] + 0.01, tip[1] + 0.025, 0.012, 0.004, 0.002], [tip[0] - 0.005, tip[1] + 0.045, 0.02, 0.003, 0.002]], '#4a5a8a', 'tongue', 3, 0); // the long blue-black tongue curls up to the leaves
    // rainforest around it
    var tr = new T.Group(); g.add(tr);
    tube(tr, [[-0.32, 0, -0.18, 0.04, 0.04], [-0.3, 0.6, -0.18, 0.03, 0.03]], function (x, y, z) { return vary('#6a5a44', x, y, z, 0.06); }, 'trunk', 7, 0.2);
    leaves(tr, -0.28, 0.6, -0.16, 9, 0.08, '#3f7a35'); leaves(tr, 0.42, 0.62, -0.05, 7, 0.07, '#4f8a3f');
    for (var k = 0; k < 6; k++) { var lx = -0.3 + k * 0.12; var lf = new T.Mesh(new T.BoxGeometry(0.1, 0.003, 0.04), solid('#4f9a3f')); lf.position.set(lx, 0.03, 0.18 + (k % 2) * 0.05); lf.rotation.y = k; lf.rotation.z = 0.3; g.add(lf); }
    return wrap(g);
  };
})();
