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
  /* ---------- snow leopard (Kyrgyzstan, Tian Shan) ---------- */
  M.custom.a_snowleopard = function () {
    var g = new T.Group();
    var rk = new T.Mesh(new T.IcosahedronGeometry(0.2, 0), solid('#9a9aa2', { flatShading: true })); rk.scale.set(1.7, 0.5, 1.1); rk.position.set(-0.02, 0.05, 0); g.add(rk);
    var snow = new T.Mesh(new T.IcosahedronGeometry(0.2, 0), solid('#f4f7fa', { flatShading: true })); snow.scale.set(1.5, 0.12, 1.0); snow.position.set(-0.04, 0.13, 0); g.add(snow);
    var spot = function (x, y, z, p) {
      if (y < 0.012) return '#5a5a5a';
      if ((p === 'body' && y < 0.205) || (p === 'head' && x > 0.36 && y < 0.31)) return vary('#f4f2ec', x, y, z, 0.03);
      var w = A.worley(x, y, z, p === 'leg' ? 60 : 32); if (w.e < 0.07 && w.f1 > 0.22) return '#55555c';     // grey rosettes (rings round lighter middles)
      return vary('#d8d4c8', x, y, z, 0.04);
    };
    var l = quad({ sides: 11, L: 0.46, legH: 0.15, bR: 0.075, bW: 0.072, legR: 0.026, kneeR: -0.025, neck: { len: 0.04, ang: 0.3, r: 0.045 }, head: { len: 0.1, r: 0.05, snout: 0.032, ang: -0.1, eye: 0.008 }, earL: 0.016, earR: 0.014, tail: false, col: spot });
    l.position.y = 0.13; g.add(l);
    // the very long, thick tail — it wraps it round its face like a scarf when it sleeps
    var u = l.userData; tube(l, [[-0.22, u.by + 0.02, 0, 0.032, 0.032], [-0.32, u.by - 0.04, 0.03, 0.034, 0.034], [-0.4, u.by - 0.1, 0.1, 0.034, 0.034], [-0.38, u.by - 0.12, 0.2, 0.032, 0.032], [-0.3, u.by - 0.12, 0.24, 0.028, 0.028]], function (x, y, z) { return A.worley(x, y, z, 30).e < 0.08 ? '#55555c' : '#e2ded2'; }, 'tail', 9, 0.1, 4);
    var ep = u.hp(0.38); [-1, 1].forEach(function (s) { ball(l, ep[0] + 0.003, ep[1] + 0.018, s * 0.042, 0.009, '#a8c8a8'); ball(l, ep[0] + 0.006, ep[1] + 0.018, s * 0.046, 0.004, '#1d1a1a'); }); // pale green-grey eyes
    return wrap(g, 0.55);
  };

  /* ---------- resplendent quetzal (Guatemala) ---------- */
  M.custom.a_quetzal = function () {
    var g = new T.Group();
    branch(g, [-0.3, 0.3, 0], [0.3, 0.32, 0], 0.016, '#6a4a32');
    tube(g, [[0.1, 0.0, -0.05, 0.03, 0.03], [0.09, 0.31, -0.01, 0.022, 0.022]], function (x, y, z) { return vary('#6a4a32', x, y, z, 0.06); }, 'trunk', 6, 0.2);
    leaves(g, -0.25, 0.38, -0.05, 6, 0.04, '#4f9a3f');
    var b = bird({ len: 0.16, r: 0.05, tilt: 0.15, hr: 0.035, beak: 0.012, beakR: 0.008, beakCol: '#f2c14e', eye: 0.006, legH: 0.0, col: function (x, y, z, p) { if (p === 'body' && x > 0.0 && y < 0.11) return vary('#d8283a', x, y, z, 0.04); return vary('#1f9a5a', x, y, z, 0.06); } });
    b.position.set(0, 0.315, 0); g.add(b);
    var hc = b.userData.hc; ball(b, hc[0] - 0.005, hc[1] + 0.02, 0, 0.03, '#2aa860', 1.1, 0.6, 0.5); // a fluffy green crest
    // the famous tail: two shining green streamers almost a metre long, waving below the branch
    [-1, 1].forEach(function (s) { tube(g, [[-0.03, 0.31, s * 0.01, 0.012, 0.004], [-0.07, 0.2, s * 0.02, 0.014, 0.004], [-0.05, 0.08, s * 0.04, 0.014, 0.004], [-0.1, -0.0, s * 0.05, 0.01, 0.003]], function (x, y, z) { return vary('#2ab86a', x, y, z, 0.08); }, 'tail', 4, 0.05, 2); });
    return wrap(g, 0.6);
  };

  /* ---------- capybara (Venezuela, Los Llanos) ---------- */
  M.custom.a_capybara = function () {
    var g = new T.Group(), br = '#a8724a';
    var pond = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.01, 18), solid('#5aa0c8', { flatShading: true })); pond.position.set(-0.18, 0.004, -0.15); g.add(pond);
    var c = function (x, y, z, p) { if (y < 0.012) return '#3a2a20'; return vary(br, x, y, z, 0.07); };
    var l = quad({ sides: 10, L: 0.4, legH: 0.07, bR: 0.1, bW: 0.09, legR: 0.024, prof: [0.75, 0.98, 1, 1, 0.95, 0.8], neck: { len: 0.03, ang: 0.2, r: 0.07 }, head: { len: 0.16, r: 0.062, snout: 0.055, ang: -0.15, eye: 0.008 }, earL: 0.014, earR: 0.013, tail: false, col: c });
    g.add(l);
    var tip = l.userData.hp(1.0); ball(l, tip[0] - 0.005, tip[1] - 0.005, 0, 0.022, '#5a3a28', 0.6, 0.8, 1.2);
    // the calmest animal around: a little bird rides on its back
    var bb = bird({ len: 0.06, r: 0.02, hr: 0.014, beak: 0.01, beakR: 0.004, beakCol: '#2a2a2a', eye: 0.003, legH: 0.01, legCol: '#2a2a2a', col: function (x, y, z, p) { return p === 'head' ? '#1d1d22' : p === 'wing' ? '#3a3a40' : '#f2c14e'; } });
    bb.position.set(-0.02, l.userData.by + 0.075, 0); g.add(bb);
    // a baby next to mum, and tall grass of the wetlands
    var baby = quad({ sides: 9, L: 0.18, legH: 0.035, bR: 0.045, bW: 0.04, legR: 0.012, neck: { len: 0.015, ang: 0.2, r: 0.03 }, head: { len: 0.075, r: 0.03, snout: 0.026, ang: -0.15, eye: 0.005 }, earL: 0.008, earR: 0.007, tail: false, col: c });
    baby.position.set(0.05, 0, 0.17); baby.rotation.y = -0.3; g.add(baby);
    for (var k = 0; k < 14; k++) { var gx = 0.25 + (hash(k, 1) - 0.5) * 0.12, gz = -0.2 + k * 0.03; cone(g, [gx, 0, gz], [gx + 0.01, 0.1 + 0.05 * hash(k, 2), gz], 0.006, '#7aa04a', 3); }
    return wrap(g, 0.5);
  };

  /* ---------- meerkat (Botswana, Kalahari) ---------- */
  M.custom.a_meerkat = function () {
    var g = new T.Group();
    var mound = new T.Mesh(new T.SphereGeometry(0.2, 12, 6, 0, D2, 0, Math.PI / 2), solid('#d8a868', { flatShading: true })); mound.scale.y = 0.3; g.add(mound);
    var hole = new T.Mesh(new T.CircleGeometry(0.035, 10), solid('#3a2a1a')); hole.rotation.x = -Math.PI / 2 + 0.5; hole.position.set(0.12, 0.035, 0.08); g.add(hole);
    var tan = function (x, y, z) { return vary(y > 0.15 && Math.abs(z) < 0.02 && x > 0.0 ? '#e8d4b0' : '#c8a678', x, y, z, 0.05); };
    // standing up straight on guard, as one of the family always does
    function kat(x, z, s, turn, up) {
      var m = new T.Group(); m.position.set(x, 0.055, z); m.rotation.y = turn || 0; m.scale.setScalar(s); g.add(m);
      if (up !== false) {
        tube(m, [[0, 0.0, 0, 0.03, 0.03], [0.0, 0.06, 0, 0.035, 0.032], [0.005, 0.12, 0, 0.025, 0.024], [0.008, 0.15, 0, 0.02, 0.02]], tan, 'body', 8, 0.1);
        ball(m, 0.012, 0.18, 0, 0.022, '#c8a678', 1.1, 1, 0.9); cone(m, [0.03, 0.178, 0], [0.055, 0.172, 0], 0.01, '#c8a678', 5); ball(m, 0.056, 0.172, 0, 0.004, '#1d1a1a');
        [-1, 1].forEach(function (k) { ball(m, 0.025, 0.188, k * 0.013, 0.008, '#2a2420', 1, 0.8, 0.6); eye(m, 0.03, 0.188, k * 0.014, 0.004); ball(m, 0.0, 0.198, k * 0.018, 0.006, '#3a2a20', 0.5, 1, 1);
          tube(m, [[0.02, 0.12, k * 0.02, 0.008, 0.008], [0.03, 0.09, k * 0.018, 0.006, 0.006]], '#c8a678', 'arm', 4, 0.05); });
        tube(m, [[-0.02, 0.01, 0, 0.012, 0.012], [-0.07, 0.0, 0, 0.008, 0.008], [-0.1, 0.0, 0.01, 0.004, 0.004]], function (x) { return x < -0.08 ? '#2a2420' : '#c8a678'; }, 'tail', 4, 0.05);
      } else {
        tube(m, [[-0.06, 0.03, 0, 0.025, 0.022], [0.0, 0.04, 0, 0.03, 0.026], [0.05, 0.04, 0, 0.02, 0.02], [0.08, 0.035, 0, 0.012, 0.012]], tan, 'body', 8, 0.1); [-1, 1].forEach(function (k) { eye(m, 0.07, 0.045, k * 0.012, 0.004); });
      }
    }
    kat(0.0, 0.0, 1.0, 0); kat(-0.08, -0.06, 0.85, 0.5); kat(0.06, -0.09, 0.7, -0.4); kat(-0.06, 0.1, 0.9, 0.2, false);
    // dry Kalahari grass and a little thorn bush
    for (var k2 = 0; k2 < 10; k2++) { var a = k2 / 10 * D2; cone(g, [Math.cos(a) * 0.24, 0, Math.sin(a) * 0.2], [Math.cos(a) * 0.25, 0.06, Math.sin(a) * 0.21], 0.008, '#d8c070', 3); }
    return wrap(g, 0.6);
  };
  /* ---------- platypus (Australia, Tasmania) ---------- */
  M.custom.a_platypus = function () {
    var g = new T.Group();
    var cr = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.01, 20), solid('#4a8ab0', { flatShading: true })); cr.position.y = 0.004; cr.scale.z = 0.7; g.add(cr);
    var bank = new T.Mesh(new T.SphereGeometry(0.18, 10, 5, 0, D2, 0, Math.PI / 2), solid('#7a6a4a', { flatShading: true })); bank.scale.set(1.2, 0.25, 0.8); bank.position.set(-0.2, 0, -0.18); g.add(bank);
    var fur = function (x, y, z) { return vary(y < 0.03 ? '#a88a68' : '#6a4a30', x, y, z, 0.05); };
    // a flat furry body, swimming at the surface
    tube(g, [[-0.14, 0.03, 0, 0.04, 0.025], [-0.06, 0.04, 0, 0.07, 0.042], [0.04, 0.045, 0, 0.068, 0.042], [0.1, 0.045, 0, 0.045, 0.034]], fur, 'body', 10, 0.1, 3);
    ball(g, 0.13, 0.05, 0, 0.034, '#6a4a30', 1.1, 0.85, 1, 1); [-1, 1].forEach(function (s) { eye(g, 0.15, 0.06, s * 0.024, 0.005); });
    // the duck-like bill (soft and rubbery; it feels for food in the mud with its eyes shut)
    var bill = new T.Mesh(new T.SphereGeometry(0.04, 10, 6), new T.MeshLambertMaterial({ color: '#4a4a52', flatShading: true })); bill.scale.set(1.4, 0.3, 0.85); bill.position.set(0.2, 0.045, 0); g.add(bill);
    // the flat beaver-like tail and webbed feet
    var tl = new T.Mesh(new T.SphereGeometry(0.05, 8, 5), solid('#5a3c26', { flatShading: true })); tl.scale.set(1.4, 0.25, 0.9); tl.position.set(-0.2, 0.025, 0); g.add(tl);
    [[0.06, 1], [0.06, -1], [-0.1, 1], [-0.1, -1]].forEach(function (q) { var ft = new T.Mesh(new T.CircleGeometry(0.022, 6), new T.MeshLambertMaterial({ color: '#4a4a52', side: T.DoubleSide })); ft.rotation.x = -Math.PI / 2 + 0.3 * q[1]; ft.position.set(q[0], 0.02, q[1] * 0.07); g.add(ft); });
    // ripples, reeds
    for (var r = 1; r <= 2; r++) { var rg = new T.Mesh(new T.TorusGeometry(0.08 * r + 0.1, 0.003, 3, 24), new T.MeshLambertMaterial({ color: '#cfe8f4' })); rg.rotation.x = Math.PI / 2; rg.position.set(0, 0.011, 0); g.add(rg); }
    for (var k = 0; k < 10; k++) cone(g, [-0.3 + hash(k, 1) * 0.12, 0, -0.24 + k * 0.02], [-0.3 + hash(k, 1) * 0.12, 0.12 + 0.04 * hash(k, 2), -0.24 + k * 0.02], 0.004, '#6a9a4a', 3);
    return wrap(g, 0.6);
  };

  /* ---------- cheetah (Namibia) ---------- */
  M.custom.a_cheetah = function () {
    var g = new T.Group();
    var spot = function (x, y, z, p) {
      if (y < 0.012) return '#3a2a20';
      if ((p === 'body' && y < 0.235) || (p === 'head' && x > 0.4 && y < 0.37)) return vary('#f4ead2', x, y, z, 0.03);
      if (A.worley(x, y, z, p === 'leg' ? 80 : 60).f1 < 0.3) return '#2a2420';      // round black spots (not rosettes like a leopard)
      return vary('#e2b45a', x, y, z, 0.04);
    };
    // long thin legs and a deep chest: built to be the fastest runner on land (up to about 100 km/h)
    var l = quad({ sides: 10, L: 0.46, legH: 0.25, bR: 0.075, bW: 0.06, legR: 0.016, prof: [0.6, 0.85, 1, 0.95, 0.9, 0.75], slope: -0.05, kneeR: -0.03, neck: { len: 0.06, ang: 0.45, r: 0.035 }, head: { len: 0.09, r: 0.04, snout: 0.026, ang: -0.2, eye: 0.007 }, earL: 0.014, earR: 0.011, tail: false, col: spot });
    g.add(l);
    var u = l.userData, ep = u.hp(0.45);
    [-1, 1].forEach(function (s) { tube(l, [[ep[0] + 0.006, ep[1] + 0.008, s * 0.03, 0.003, 0.003], [ep[0] + 0.03, ep[1] - 0.025, s * 0.022, 0.003, 0.003], [ep[0] + 0.04, ep[1] - 0.045, s * 0.016, 0.003, 0.003]], '#2a2420', 'tear', 3, 0); }); // black "tear lines" from the eyes
    tube(l, [[-0.23, u.by + 0.02, 0, 0.014, 0.014], [-0.33, u.by - 0.08, 0, 0.012, 0.012], [-0.37, u.by - 0.17, 0.02, 0.011, 0.011], [-0.34, u.by - 0.22, 0.04, 0.01, 0.01]], function (x, y) { return y < u.by - 0.17 ? (Math.sin(y * 160) > 0 ? '#2a2420' : '#f4ead2') : '#e2b45a'; }, 'tail', 6, 0.05, 2);
    // a termite mound to look out from, and dry grass
    var tm = new T.Mesh(new T.ConeGeometry(0.06, 0.2, 7), solid('#c8804a', { flatShading: true })); tm.position.set(-0.28, 0.1, -0.15); g.add(tm);
    for (var k = 0; k < 14; k++) { var a = k / 14 * D2; cone(g, [Math.cos(a) * 0.3, 0, Math.sin(a) * 0.22], [Math.cos(a) * 0.31, 0.08, Math.sin(a) * 0.23], 0.008, '#d8c070', 3); }
    return wrap(g, 0.5);
  };

  /* ---------- reindeer (Finland, Lapland) ---------- */
  M.custom.a_reindeer = function () {
    var g = new T.Group();
    var snow = new T.Mesh(new T.CylinderGeometry(0.34, 0.36, 0.02, 12), solid('#f4f7fa', { flatShading: true })); snow.position.y = 0.01; g.add(snow);
    var c = function (x, y, z, p) { if (y < 0.012) return '#3a3028'; if (p === 'neck' && y < 0.42) return vary('#f2ece2', x, y, z, 0.03); if (p === 'body' && y < 0.26) return vary('#d8d0c4', x, y, z, 0.04); return vary('#7a6a58', x, y, z, 0.05); };
    var l = quad({ sides: 10, neckSides: 9, L: 0.42, legH: 0.22, bR: 0.085, bW: 0.075, legR: 0.019, kneeR: -0.025, neck: { len: 0.1, ang: 0.6, r: 0.045 }, head: { len: 0.13, r: 0.04, snout: 0.03, ang: -0.7, eye: 0.007 }, earL: 0.025, earR: 0.01, tail: 0.04, col: c });
    l.position.y = 0.02; g.add(l);
    var u = l.userData, hb = u.hp(0.12);
    // big branching antlers — both males and females grow them
    [-1, 1].forEach(function (s) {
      var b0 = [hb[0] - 0.01, hb[1] + 0.03, s * 0.02], b1 = [hb[0] - 0.06, hb[1] + 0.12, s * 0.07], b2 = [hb[0] - 0.04, hb[1] + 0.22, s * 0.1], b3 = [hb[0] + 0.02, hb[1] + 0.26, s * 0.08];
      tube(l, [b0.concat([0.006, 0.006]), b1.concat([0.006, 0.006]), b2.concat([0.005, 0.005]), b3.concat([0.004, 0.004])], '#d8c8a8', 'antler', 5, 0.05);
      [[b1, [0.04, 0.05, 0.0]], [b2, [0.05, 0.03, 0.01]], [b1, [-0.03, 0.06, 0.02]]].forEach(function (q) { var a = q[0], t = [a[0] + q[1][0], a[1] + q[1][1], a[2] + s * q[1][2]]; tube(l, [a.concat([0.004, 0.004]), t.concat([0.003, 0.003])], '#d8c8a8', 'antler', 4, 0); });
    });
    var tip = u.hp(1.0); ball(l, tip[0], tip[1], 0, 0.014, '#3a3028');
    // a little sled hitched behind, and snowy fir trees
    var sl = new T.Group(); sl.position.set(-0.36, 0.02, 0.1); g.add(sl); box3(sl, 0.12, 0.02, 0.06, 0, 0.03, 0, '#a8402a'); [-0.025, 0.025].forEach(function (z) { box3(sl, 0.14, 0.006, 0.006, 0.0, 0.006, z, '#3a2a20'); });
    for (var t = 0; t < 4; t++) { var tx = -0.25 + t * 0.15, tz = -0.25; cone(g, [tx, 0.02, tz], [tx, 0.25, tz], 0.05, '#2f5f3a', 6); cone(g, [tx, 0.15, tz], [tx, 0.27, tz], 0.03, '#f4f7fa', 6); }
    return wrap(g, 0.5);
  };
  function box3(g, w, h, d, x, y, z, col) { var geo = new T.BoxGeometry(w, h, d); geo.translate(x, y + h / 2, z); return part(g, geo, col); }

  /* ---------- toco toucan (Paraguay) ---------- */
  M.custom.a_toucan = function () {
    var g = new T.Group();
    branch(g, [-0.25, 0.26, 0], [0.25, 0.28, 0], 0.016, '#6a4a32');
    tube(g, [[-0.15, 0.0, -0.04, 0.03, 0.03], [-0.14, 0.27, -0.01, 0.022, 0.022]], function (x, y, z) { return vary('#6a4a32', x, y, z, 0.06); }, 'trunk', 6, 0.2);
    leaves(g, 0.2, 0.34, -0.05, 6, 0.04, '#4f9a3f');
    var b = bird({ len: 0.17, r: 0.05, tilt: 0.25, hr: 0.035, beak: 0.001, beakR: 0.001, eye: 0.007, legH: 0.0, col: function (x, y, z, p) { if (p === 'head' && x > 0.05) return '#f6f4ee'; if (p === 'body' && x > 0.02 && y > 0.12) return '#f6f4ee'; return vary('#1d1c20', x, y, z, 0.04); } });
    b.position.set(0, 0.275, 0); g.add(b);
    var hc = b.userData.hc;
    [-1, 1].forEach(function (s) { ball(b, hc[0] + 0.012, hc[1] + 0.008, s * 0.024, 0.011, '#3aa8e0', 1, 1, 0.5); });
    // the giant orange bill — huge but light, a bit like a honeycomb inside — with a black tip
    tube(b, [[hc[0] + 0.02, hc[1] + 0.0, 0, 0.022, 0.03], [hc[0] + 0.08, hc[1] - 0.02, 0, 0.016, 0.022], [hc[0] + 0.14, hc[1] - 0.045, 0, 0.007, 0.01]], function (x) { return x > hc[0] + 0.12 ? '#1d1c20' : '#f28a1e'; }, 'bill', 8, 0.05);
    tube(b, [[-0.02, 0.06, 0, 0.022, 0.015], [-0.06, -0.02, 0, 0.02, 0.012], [-0.07, -0.08, 0, 0.012, 0.008]], '#1d1c20', 'tail', 5, 0.05);
    ball(b, -0.01, 0.045, 0, 0.018, '#e8352b', 1.2, 0.6, 1);
    return wrap(g, 0.6);
  };
  /* ---------- narwhal (Greenland) ---------- */
  M.custom.a_narwhal = function () {
    var g = new T.Group();
    var sea = new T.Mesh(new T.CylinderGeometry(0.38, 0.38, 0.01, 20), solid('#2f6a9a', { flatShading: true })); sea.position.y = 0.004; sea.scale.z = 0.7; g.add(sea);
    var floe = new T.Mesh(new T.CylinderGeometry(0.12, 0.13, 0.03, 7), solid('#eef6fb', { flatShading: true })); floe.position.set(-0.22, 0.015, -0.16); g.add(floe);
    var mot = function (x, y, z) { if (y < 0.03) return vary('#e8e4dc', x, y, z, 0.03); return hash(Math.round(x * 60), Math.round(z * 60 + y * 40)) > 0.6 ? '#3a3a42' : vary('#7a7a80', x, y, z, 0.05); }; // mottled grey back, pale belly
    // a whale coming up for air, half out of the water
    tube(g, [[-0.26, 0.02, 0, 0.02, 0.012], [-0.16, 0.035, 0, 0.055, 0.045], [-0.02, 0.045, 0, 0.075, 0.06], [0.1, 0.05, 0, 0.065, 0.055], [0.17, 0.05, 0, 0.04, 0.04]], mot, 'body', 10, 0.08, 4);
    [-1, 1].forEach(function (s) { var fl = new T.Mesh(new T.SphereGeometry(0.025, 6, 4), solid('#5a5a62', { flatShading: true })); fl.scale.set(1.6, 0.2, 0.8); fl.position.set(-0.29, 0.02, s * 0.03); fl.rotation.y = s * 0.5; g.add(fl); eye(g, 0.14, 0.06, s * 0.04, 0.005); });
    // the long spiral tusk (really a tooth!) that grows straight out through its lip — up to about 3 m
    var tk = new T.Mesh(new T.ConeGeometry(0.008, 0.3, 6, 12), solid('#f0e8d0', { flatShading: true })), tp = tk.geometry.attributes.position;
    for (var i = 0; i < tp.count; i++) { var y = tp.getY(i), a = y * 60, x = tp.getX(i), z = tp.getZ(i), c = Math.cos(a) * 0.15 + 1; tp.setX(i, x * c); tp.setZ(i, z * c); } tk.geometry.computeVertexNormals();
    tk.rotation.z = -Math.PI / 2 + 0.15; tk.position.set(0.33, 0.07, 0); g.add(tk);
    // a second narwhal, and splashes
    var b2 = new T.Group(); b2.position.set(0.05, 0, 0.18); b2.rotation.y = 0.4; g.add(b2); tube(b2, [[-0.12, 0.01, 0, 0.03, 0.02], [0.0, 0.025, 0, 0.05, 0.035], [0.08, 0.025, 0, 0.035, 0.03]], mot, 'body', 8, 0.08, 7);
    for (var k = 0; k < 5; k++) ball(g, 0.18 + hash(k, 2) * 0.05, 0.02, (hash(k, 3) - 0.5) * 0.1, 0.01 + hash(k, 1) * 0.008, '#e8f4fa');
    return wrap(g, 0.5);
  };

  /* ---------- giant anteater (Bolivia) ---------- */
  M.custom.a_anteater = function () {
    var g = new T.Group();
    var c = function (x, y, z, p) {
      if (y < 0.012) return '#2a2420';
      if (p === 'body' && x > 0.0 && x < 0.2 && y > 0.12 && y < 0.26 && Math.abs(z) > 0.035) return y > 0.2 || Math.abs(z) > 0.055 ? '#f2ece0' : '#1d1c1c'; // the black stripe edged in white across the shoulder
      if (p === 'leg' && x > 0.1) return y < 0.06 ? '#2a2420' : '#f2ece0';
      return vary('#8a7a66', x, y, z, 0.06);
    };
    var l = quad({ sides: 10, L: 0.42, legH: 0.12, bR: 0.075, bW: 0.06, legR: 0.02, neck: { len: 0.05, ang: 0.1, r: 0.045 }, head: { len: 0.24, r: 0.03, snout: 0.012, ang: -0.35, eye: 0.004 }, earL: 0.01, earR: 0.01, tail: false, col: c });
    g.add(l);
    var u = l.userData;
    // the huge bushy tail like a broom (it covers itself with it to sleep)
    tube(l, [[-0.2, u.by + 0.02, 0, 0.02, 0.04], [-0.3, u.by + 0.04, 0, 0.022, 0.07], [-0.4, u.by + 0.02, 0, 0.018, 0.06], [-0.46, u.by - 0.04, 0, 0.012, 0.03]], function (x, y, z) { return vary('#5a4a3a', x, y, z, 0.08); }, 'tail', 8, 0.35, 5);
    // a long sticky tongue flicking into a termite mound
    var tip = u.hp(1.0); tube(l, [[tip[0], tip[1], 0, 0.003, 0.003], [tip[0] + 0.05, tip[1] - 0.03, 0, 0.0025, 0.0025], [tip[0] + 0.08, tip[1] - 0.05, 0, 0.002, 0.002]], '#d86a7a', 'tongue', 3, 0);
    var tm = new T.Mesh(new T.ConeGeometry(0.06, 0.16, 7), solid('#c8804a', { flatShading: true })); tm.position.set(tip[0] + 0.12, 0.08, 0); g.add(tm);
    for (var k = 0; k < 8; k++) ball(g, tip[0] + 0.1 + hash(k, 1) * 0.04, 0.01 + hash(k, 2) * 0.05, (hash(k, 3) - 0.5) * 0.06, 0.003, '#2a2420');
    for (var k2 = 0; k2 < 12; k2++) { var a = k2 / 12 * D2; cone(g, [Math.cos(a) * 0.32, 0, Math.sin(a) * 0.22], [Math.cos(a) * 0.33, 0.07, Math.sin(a) * 0.23], 0.008, '#a8b860', 3); }
    return wrap(g, 0.5);
  };

  /* ---------- shoebill (Uganda) ---------- */
  M.custom.a_shoebill = function () {
    var g = new T.Group();
    var sw = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.01, 18), solid('#5a8a7a', { flatShading: true })); sw.position.y = 0.004; g.add(sw);
    for (var k = 0; k < 12; k++) { var a = k / 12 * D2; cone(g, [Math.cos(a) * 0.26, 0, Math.sin(a) * 0.22], [Math.cos(a) * 0.27, 0.22, Math.sin(a) * 0.23], 0.006, '#7aa04a', 3); var hd = new T.Mesh(new T.SphereGeometry(0.02, 6, 4), solid('#8ab05a', { flatShading: true })); hd.position.set(Math.cos(a) * 0.27, 0.23, Math.sin(a) * 0.23); g.add(hd); } // papyrus
    // a tall grey bird that stands very still for hours, waiting for fish
    var b = bird({ len: 0.2, r: 0.065, tilt: 0.35, hr: 0.05, beak: 0.001, beakR: 0.001, eye: 0.007, legH: 0.18, legCol: '#3a3a3e', col: function (x, y, z, p) { return vary(p === 'wing' ? '#7a8a96' : '#98a4ae', x, y, z, 0.05); } });
    b.position.y = 0.01; g.add(b);
    var hc = b.userData.hc;
    // the giant bill shaped like a wooden shoe, with a hook at the tip
    var bl = new T.Mesh(new T.SphereGeometry(0.045, 10, 7), solid('#c8b88a', { flatShading: true })); bl.scale.set(1.6, 0.75, 0.75); bl.position.set(hc[0] + 0.07, hc[1] - 0.02, 0); g.add(bl);
    cone(g, [hc[0] + 0.14, hc[1] - 0.01, 0], [hc[0] + 0.15, hc[1] - 0.04, 0], 0.008, '#8a7a5a', 4);
    ball(g, hc[0] - 0.035, hc[1] + 0.035, 0, 0.015, '#98a4ae', 1, 0.6, 0.6); // a little tuft at the back of the head
    [-1, 1].forEach(function (s) { ball(g, hc[0] + 0.02, hc[1] + 0.015, s * 0.035, 0.008, '#e8e8c8', 1, 1, 0.5); });
    var fish = new T.Mesh(new T.SphereGeometry(0.02, 6, 4), solid('#a8b0b8')); fish.scale.set(2, 0.6, 0.6); fish.position.set(0.24, 0.012, 0.1); g.add(fish);
    return wrap(g, 0.6);
  };

  /* ---------- arctic fox (Iceland) ---------- */
  M.custom.a_arcticfox = function () {
    var g = new T.Group();
    var snow = new T.Mesh(new T.CylinderGeometry(0.3, 0.32, 0.02, 12), solid('#f4f7fa', { flatShading: true })); snow.position.y = 0.01; g.add(snow);
    for (var r = 0; r < 4; r++) { var rk = new T.Mesh(new T.IcosahedronGeometry(0.05, 0), solid('#5a5a62', { flatShading: true })); rk.scale.y = 0.5; rk.position.set(-0.25 + r * 0.06, 0.02, -0.18); g.add(rk); var cap = new T.Mesh(new T.IcosahedronGeometry(0.045, 0), solid('#f4f7fa', { flatShading: true })); cap.scale.y = 0.25; cap.position.set(-0.25 + r * 0.06, 0.04, -0.18); g.add(cap); }
    // thick white winter fur (in summer it turns brown-grey), small round ears to keep warm
    var wh = function (x, y, z, p) { if (y < 0.012) return '#c8c8cc'; return vary('#f6f6f4', x, y, z, 0.03); };
    var l = quad({ sides: 10, L: 0.3, legH: 0.08, bR: 0.07, bW: 0.065, legR: 0.018, neck: { len: 0.03, ang: 0.4, r: 0.045 }, head: { len: 0.1, r: 0.045, snout: 0.018, ang: -0.25, eye: 0.007 }, earL: 0.018, earR: 0.014, tail: false, col: wh });
    l.position.y = 0.02; g.add(l);
    var u = l.userData, tip = u.hp(1.0); ball(l, tip[0], tip[1], 0, 0.009, '#2a2a2e');
    // the fluffy tail wrapped round its feet
    tube(l, [[-0.15, u.by - 0.01, 0, 0.035, 0.035], [-0.2, u.by - 0.06, 0.04, 0.04, 0.04], [-0.15, u.by - 0.1, 0.1, 0.035, 0.035], [-0.05, u.by - 0.11, 0.11, 0.025, 0.025]], wh, 'tail', 9, 0.15, 3);
    return wrap(g, 0.6);
  };
  /* ---------- walrus (Svalbard, Norway) ---------- */
  M.custom.a_walrus = function () {
    var g = new T.Group();
    var ice = new T.Mesh(new T.CylinderGeometry(0.3, 0.33, 0.04, 8), solid('#eef6fb', { flatShading: true })); ice.position.y = 0.02; g.add(ice);
    var sea = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 0.01, 20), solid('#2f6a9a', { flatShading: true })); sea.position.y = 0.004; g.add(sea);
    var skin = function (x, y, z) { return vary('#b8826a', x, y, z, 0.07); };
    // a huge, wrinkly pink-brown body lying on the ice
    tube(g, [[-0.26, 0.06, 0, 0.04, 0.03], [-0.16, 0.08, 0, 0.1, 0.07], [-0.02, 0.1, 0, 0.12, 0.09], [0.1, 0.11, 0, 0.1, 0.085], [0.17, 0.13, 0, 0.065, 0.065]], skin, 'body', 11, 0.15, 6);
    ball(g, 0.21, 0.15, 0, 0.055, '#b8826a', 1, 0.95, 1.05, 1);
    ball(g, 0.25, 0.135, 0, 0.04, '#c89478', 0.8, 0.8, 1.3); // the bristly moustache pad
    for (var w = 0; w < 10; w++) cone(g, [0.27, 0.135 + (w % 3 - 1) * 0.01, -0.035 + w * 0.008], [0.29, 0.13 + (w % 3 - 1) * 0.01, -0.04 + w * 0.009], 0.0015, '#f2ece0', 3);
    [-1, 1].forEach(function (s) { eye(g, 0.235, 0.18, s * 0.035, 0.005); cone(g, [0.26, 0.12, s * 0.018], [0.27, 0.02, s * 0.022], 0.008, '#f6f0dc', 5); // long ivory tusks, used to pull itself out onto the ice
      var fl = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), solid('#a8725a', { flatShading: true })); fl.scale.set(1.2, 0.2, 0.8); fl.position.set(0.08, 0.045, s * 0.1); fl.rotation.y = s * 0.4; g.add(fl);
      var tf = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), solid('#a8725a', { flatShading: true })); tf.scale.set(1.4, 0.2, 0.8); tf.position.set(-0.28, 0.045, s * 0.03); tf.rotation.y = s * 0.5; g.add(tf); });
    return wrap(g, 0.6);
  };

  /* ---------- orca (British Columbia, Canada) ---------- */
  M.custom.a_orca = function () {
    var g = new T.Group();
    var sea = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.01, 20), solid('#2f6a9a', { flatShading: true })); sea.position.y = 0.004; sea.scale.z = 0.7; g.add(sea);
    var c = function (x, y, z) { if (y < 0.05 + x * 0.1) return '#f6f6f4'; if (x > 0.14 && x < 0.2 && y > 0.1 && Math.abs(z) > 0.03) return '#f6f6f4'; return '#1a1c22'; }; // black and white, with the white eye patch
    // leaping out of the water in an arc
    var b = new T.Group(); b.rotation.z = 0.5; b.position.set(0, 0.05, 0); g.add(b);
    tube(b, [[-0.26, 0.05, 0, 0.02, 0.015], [-0.16, 0.07, 0, 0.06, 0.055], [0.0, 0.09, 0, 0.09, 0.085], [0.13, 0.09, 0, 0.075, 0.07], [0.22, 0.08, 0, 0.035, 0.035]], c, 'body', 11, 0.06, 4);
    var fin = new T.Shape(); fin.moveTo(0, 0); fin.quadraticCurveTo(0.01, 0.1, -0.02, 0.15); fin.quadraticCurveTo(0.02, 0.07, 0.06, 0); fin.lineTo(0, 0);
    var fm = new T.Mesh(new T.ExtrudeGeometry(fin, { depth: 0.01, bevelEnabled: false }), solid('#1a1c22')); fm.position.set(-0.02, 0.165, -0.005); b.add(fm); // the tall back fin
    [-1, 1].forEach(function (s) { var pf = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), solid('#1a1c22', { flatShading: true })); pf.scale.set(1.3, 0.2, 0.8); pf.position.set(0.1, 0.04, s * 0.08); pf.rotation.x = s * 0.5; b.add(pf); var fl = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), solid('#1a1c22', { flatShading: true })); fl.scale.set(1.3, 0.2, 1); fl.position.set(-0.28, 0.05, s * 0.035); b.add(fl); eye(b, 0.17, 0.11, s * 0.045, 0.004); });
    for (var k = 0; k < 10; k++) { var sp = new T.Mesh(new T.IcosahedronGeometry(0.01 + hash(k, 1) * 0.012, 0), solid('#e8f4fa', { flatShading: true })); sp.position.set(-0.15 + hash(k, 2) * 0.1, 0.02 + hash(k, 3) * 0.06, (hash(k, 4) - 0.5) * 0.12); g.add(sp); }
    // a second orca's fin in the distance
    var f2 = fm.clone(); f2.position.set(0.25, 0.006, -0.18); f2.scale.setScalar(0.7); g.add(f2);
    return wrap(g, 0.4);
  };

  /* ---------- emu (Australia) ---------- */
  M.custom.a_emu = function () {
    var g = new T.Group();
    blobGround(g, '#c8a060');
    var fe = function (x, y, z, p) { return vary(hash(Math.round(x * 80), Math.round(y * 80)) > 0.5 ? '#6a5a48' : '#4a3e32', x, y, z, 0.06); };
    // a big shaggy body on long legs (it can't fly but runs at 50 km/h)
    tube(g, [[-0.14, 0.34, 0, 0.06, 0.05], [-0.06, 0.4, 0, 0.11, 0.1], [0.05, 0.42, 0, 0.1, 0.095], [0.11, 0.42, 0, 0.06, 0.06]], fe, 'body', 11, 0.3, 4);
    tube(g, [[0.1, 0.44, 0, 0.03, 0.03], [0.14, 0.55, 0, 0.022, 0.022], [0.15, 0.66, 0, 0.02, 0.02]], function (x, y) { return y > 0.5 ? '#5a7a9a' : '#4a3e32'; }, 'neck', 7, 0.1); // the bare blue neck
    ball(g, 0.16, 0.68, 0, 0.03, '#3a3632', 1.1, 0.9, 0.9, 1); cone(g, [0.18, 0.675, 0], [0.22, 0.67, 0], 0.01, '#3a3632', 5); [-1, 1].forEach(function (s) { ball(g, 0.175, 0.69, s * 0.022, 0.006, '#c8783a'); ball(g, 0.18, 0.69, s * 0.025, 0.003, '#111'); });
    [-1, 1].forEach(function (s) { tube(g, [[0.0, 0.34, s * 0.04, 0.025, 0.025], [0.02, 0.2, s * 0.045, 0.014, 0.014], [0.0, 0.1, s * 0.045, 0.011, 0.011], [0.01, 0.005, s * 0.045, 0.01, 0.008]], '#6a6258', 'leg', 6, 0.05); [-0.4, 0, 0.4].forEach(function (a) { cone(g, [0.01, 0.004, s * 0.045], [0.01 + Math.cos(a) * 0.05, 0.003, s * 0.045 + Math.sin(a) * 0.05], 0.006, '#6a6258', 3); }); });
    // dry spinifex grass and a big green egg — the dad sits on the eggs!
    for (var k = 0; k < 6; k++) { var a = k / 6 * D2; ball(g, Math.cos(a) * 0.28, 0.03, Math.sin(a) * 0.22, 0.04, '#a8a860', 1, 0.6, 1); }
    ball(g, -0.18, 0.04, 0.1, 0.035, '#2f5f4a', 0.85, 1.2, 0.85, 1);
    return wrap(g, 0.5);
  };
  function blobGround(g, col) { var m = new T.Mesh(new T.CylinderGeometry(0.34, 0.36, 0.01, 12), solid(col, { flatShading: true })); m.position.y = 0.004; g.add(m); }

  /* ---------- Atlantic puffin (Faroe Islands) ---------- */
  M.custom.a_puffin = function () {
    var g = new T.Group();
    var cl = new T.Mesh(new T.IcosahedronGeometry(0.2, 1), solid('#6a6a62', { flatShading: true })); cl.scale.set(1.5, 0.5, 1.1); cl.position.y = 0.05; g.add(cl);
    var grass = new T.Mesh(new T.IcosahedronGeometry(0.19, 1), solid('#5f9a45', { flatShading: true })); grass.scale.set(1.45, 0.2, 1.05); grass.position.y = 0.12; g.add(grass);
    function puf(x, z, s, turn, fish) {
      var b = bird({ len: 0.12 * s, r: 0.045 * s, tilt: 0.25, hr: 0.035 * s, beak: 0.001, beakR: 0.001, eye: 0.005 * s, legH: 0.03 * s, legCol: '#f28a2a', col: function (x, y, z, p) { if (p === 'head') return '#1d1c20'; if (p === 'body' && x > 0.0) return '#f6f6f4'; return '#1d1c20'; } });
      var hc = b.userData.hc; [-1, 1].forEach(function (k) { ball(b, hc[0] + 0.005 * s, hc[1], k * 0.024 * s, 0.02 * s, '#e8e4dc', 1, 1, 0.5); eye(b, hc[0] + 0.012 * s, hc[1] + 0.008 * s, k * 0.034 * s, 0.004 * s); });
      // the colourful triangle beak — orange, yellow and blue-grey stripes (only in the breeding season)
      tube(b, [[hc[0] + 0.02 * s, hc[1] - 0.005 * s, 0, 0.012 * s, 0.022 * s], [hc[0] + 0.045 * s, hc[1] - 0.012 * s, 0, 0.007 * s, 0.014 * s], [hc[0] + 0.06 * s, hc[1] - 0.02 * s, 0, 0.003 * s, 0.004 * s]], function (x) { return x < hc[0] + 0.03 * s ? '#4a5a6a' : x < hc[0] + 0.04 * s ? '#f2c14e' : '#f2602a'; }, 'beak', 6, 0);
      if (fish) for (var f = 0; f < 3; f++) { var fs = new T.Mesh(new T.SphereGeometry(0.008 * s, 5, 3), solid('#c8d0d8')); fs.scale.set(0.4, 0.4, 3); fs.position.set(hc[0] + 0.045 * s, hc[1] - 0.02 * s, (f - 1) * 0.008 * s); b.add(fs); } // a beak full of little fish
      b.position.set(x, 0.14, z); b.rotation.y = turn; g.add(b);
    }
    puf(0, 0, 1.2, 0, true); puf(-0.12, -0.08, 0.9, 0.6); puf(0.12, -0.1, 0.85, -0.5);
    return wrap(g, 0.6);
  };
})();
