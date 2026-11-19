/* Low-poly faceted animals (like paper-craft models). Built by sweeping faceted cross-sections along
   a spine ("loft"), with a few slightly random wobbles so faces catch the light differently.
   Each animal: MODELS.custom['a_' + id]. Stands on y = 0, faces +x (side view), about 0.6-0.9 long.
   The wrapper turns it 3/4 toward the viewer. Colours are painted per face: c(x, y, z, part). */
(function () {
  var T = window.THREE, M = window.MODELS, K = M.kit;
  var solid = K.solid, hash = K.hash, noise = K.noise, paintVerts = K.paintVerts, vcMat = K.vcMat;
  var V3 = function (a) { return new T.Vector3(a[0], a[1], a[2]); }, D2 = Math.PI * 2, UP = new T.Vector3(0, 1, 0);
  var A = M.animal = {};

  /* ---------- the loft: faceted tube through spine points [x, y, z, radiusSide, radiusUp] ---------- */
  function resample(sp, step) { // smooth curve through the spine, rings about `step` apart
    if (sp.length < 2) return sp;
    var curve = new T.CatmullRomCurve3(sp.map(V3)), len = curve.getLength(), n = Math.max(sp.length, Math.round(len / step) + 1), out = [];
    var cum = [0]; for (var i = 1; i < sp.length; i++) cum.push(cum[i - 1] + V3(sp[i]).distanceTo(V3(sp[i - 1])));
    for (var k = 0; k < n; k++) {
      var t = k / (n - 1), p = curve.getPointAt(t), d = t * cum[cum.length - 1], j = 0; while (j < cum.length - 2 && cum[j + 1] < d) j++;
      var f = (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1), f2 = f * f * (3 - 2 * f);
      out.push([p.x, p.y, p.z, sp[j][3] + (sp[j + 1][3] - sp[j][3]) * f2, sp[j][4] + (sp[j + 1][4] - sp[j][4]) * f2]);
    }
    return out;
  }
  A.step = 0.04;
  function loft(sp, sides, jit, seed, step) {
    sides = sides || 7; jit = (jit == null ? 0.12 : jit) * 0.45; seed = seed || 1; sp = resample(sp, step || A.step);
    var n = sp.length, pos = [], idx = [], cen = [], refs = [];
    for (var i = 0; i < n; i++) {
      var P = V3(sp[i]), pr = V3(sp[Math.max(0, i - 1)]), nx = V3(sp[Math.min(n - 1, i + 1)]), t = nx.sub(pr).normalize();
      var up = Math.abs(t.y) > 0.92 ? new T.Vector3(1, 0, 0) : UP, s = new T.Vector3().crossVectors(t, up).normalize(), u = new T.Vector3().crossVectors(s, t).normalize();
      cen.push(P);
      for (var k = 0; k < sides; k++) {
        var a = k / sides * D2 + 0.3, j = 1 + (hash(i * 17 + k * 3, seed) - 0.5) * jit * (i === 0 || i === n - 1 ? 0.3 : 1);
        var v = P.clone().addScaledVector(s, Math.cos(a) * sp[i][3] * j).addScaledVector(u, Math.sin(a) * sp[i][4] * j);
        pos.push(v.x, v.y, v.z);
      }
    }
    var c0 = pos.length / 3; pos.push(cen[0].x, cen[0].y, cen[0].z); var c1 = c0 + 1; pos.push(cen[n - 1].x, cen[n - 1].y, cen[n - 1].z);
    function vert(i) { return new T.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); }
    function tri(a, b, c, ref) { var A_ = vert(a), B = vert(b), C = vert(c), nrm = new T.Vector3().crossVectors(B.clone().sub(A_), C.clone().sub(A_)); if (nrm.dot(ref) < 0) idx.push(a, c, b); else idx.push(a, b, c); }
    for (var r = 0; r < n - 1; r++) for (var q = 0; q < sides; q++) {
      var a0 = r * sides + q, b0 = r * sides + (q + 1) % sides, c0_ = (r + 1) * sides + q, d0 = (r + 1) * sides + (q + 1) % sides;
      var mid = vert(a0).add(vert(d0)).multiplyScalar(0.5), ref = mid.clone().sub(cen[r].clone().add(cen[r + 1]).multiplyScalar(0.5));
      tri(a0, c0_, b0, ref); tri(b0, c0_, d0, ref);
    }
    var t0 = cen[0].clone().sub(cen[1]), t1 = cen[n - 1].clone().sub(cen[n - 2]);
    for (var e = 0; e < sides; e++) { tri(c0, e, (e + 1) % sides, t0); tri(c1, (n - 1) * sides + e, (n - 1) * sides + (e + 1) % sides, t1); }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
  }
  // add a painted part to group g
  function part(g, geo, col, name) { var m = new T.Mesh(paintVerts(geo, function (x, y, z) { return typeof col === 'function' ? col(x, y, z, name) : col; }), vcMat); g.add(m); return m; }
  function tube(g, sp, col, name, sides, jit, seed) { return part(g, loft(sp, sides, jit, seed), col, name); }
  function ball(g, x, y, z, r, col, sx, sy, sz, det) { var geo = new T.IcosahedronGeometry(r, det || 0); geo.scale(sx || 1, sy || 1, sz || 1); geo.translate(x, y, z); return part(g, geo, col); }
  function cone(g, a, b, r, col, sides) { var d = V3(b).sub(V3(a)), geo = new T.ConeGeometry(r, d.length(), sides || 5); geo.translate(0, d.length() / 2, 0); var q = new T.Quaternion().setFromUnitVectors(UP, d.clone().normalize()); geo.applyQuaternion(q); geo.translate(a[0], a[1], a[2]); return part(g, geo, col); }
  A.loft = loft; A.tube = tube; A.ball = ball; A.cone = cone; A.part = part;

  /* ---------- patterns ---------- */
  function worley(x, y, z, sc) { // F2 - F1 cell noise: small near the borders between patches
    x *= sc; y *= sc; z *= sc; var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), f1 = 9, f2 = 9, id = 0;
    for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) for (var c = -1; c <= 1; c++) {
      var cx = xi + a, cy = yi + b, cz = zi + c, px = cx + hash(cx * 7 + cz, cy), py = cy + hash(cy * 5 + cx, cz + 3), pz = cz + hash(cz * 3 + cy, cx + 9);
      var d = Math.hypot(px - x, py - y, pz - z); if (d < f1) { f2 = f1; f1 = d; id = hash(cx * 3.1 + cy * 7.7, cz * 1.3); } else if (d < f2) f2 = d;
    }
    return { e: f2 - f1, id: id, f1: f1 };
  }
  function shade(hex, k) { var c = new T.Color(hex); c.offsetHSL(0, 0, k); return '#' + c.getHexString(); }
  function vary(hex, x, y, z, amt) { return shade(hex, (hash(Math.round(x * 300) + Math.round(z * 170), Math.round(y * 230)) - 0.5) * (amt || 0.05)); }
  A.worley = worley; A.shade = shade; A.vary = vary;
  function eye(g, x, y, z, r) { ball(g, x, y, z, r || 0.009, '#1d1a1a', 1, 1, 1, 0); }

  /* ---------- four-legged template ---------- */
  // o: L body length, legH leg length, bR/bW body radii, neck {len, ang, r}, head {len, r, snout, ang}, legR, tail, kneeF/kneeR, col(x,y,z,part)
  function quad(o) {
    var g = new T.Group(), L = o.L, bR = o.bR, bW = o.bW || bR, legH = o.legH, by = legH + bR * 0.75 + (o.lift || 0), col = o.col;
    var prof = o.prof || [0.55, 0.92, 1, 1, 0.97, 0.75], sp = [];
    for (var i = 0; i < prof.length; i++) { var t = i / (prof.length - 1), x = -L / 2 + t * L; sp.push([x, by + (o.slope || 0) * (t - 0.5) * L, 0, bW * prof[i], bR * prof[i]]); }
    tube(g, sp, col, 'body', o.sides || 9, 0.14, 3);
    var lr = o.legR || 0.03, fx = L / 2 * 0.6, rx = -L / 2 * 0.6, lz = bW * 0.55;
    [[fx, lz], [fx, -lz], [rx, lz], [rx, -lz]].forEach(function (q, k) {
      var front = k < 2, kd = front ? (o.kneeF || 0.0) : (o.kneeR == null ? -0.03 : o.kneeR), x = q[0], z = q[1], top = by + (o.slope || 0) * ((x + L / 2) / L - 0.5) * L - bR * 0.25;
      tube(g, [[x, top, z, lr * 1.7, lr * 1.9], [x + kd * 0.3, legH * 0.62, z, lr * 1.15, lr * 1.2], [x + kd, legH * 0.32, z, lr * 0.85, lr * 0.85], [x + kd * 0.3, legH * 0.08, z, lr * 0.85, lr * 0.85], [x + kd * 0.3 + (o.foot || 0), 0.004, z, lr * 0.95, lr * 0.75]], col, 'leg', 6, 0.1, 7 + k);
    });
    var nk = o.neck || { len: 0.05, ang: 0.4, r: bR * 0.6 }, hd = o.head;
    var S = [L / 2 * 0.78, by + bR * 0.3 + (o.slope || 0) * 0.3 * L, 0], ca = Math.cos(nk.ang), sa = Math.sin(nk.ang);
    var E = [S[0] + ca * nk.len, S[1] + sa * nk.len, 0];
    if (nk.len > 0.02) tube(g, [[S[0] - ca * 0.04, S[1] - sa * 0.04, 0, nk.r * 1.5, nk.r * 1.7], [S[0] + ca * nk.len * 0.4, S[1] + sa * nk.len * 0.4, 0, nk.r * 1.1, nk.r * 1.2], [E[0], E[1], 0, nk.r * 0.9, nk.r]], col, 'neck', o.neckSides || 8, 0.1, 5);
    var ha = hd.ang == null ? -0.45 : hd.ang, hc = Math.cos(ha), hs = Math.sin(ha), H0 = [E[0] - hc * hd.r * 0.6, E[1] - hs * hd.r * 0.6 + hd.r * 0.15, 0];
    var hp = function (f) { return [H0[0] + hc * hd.len * f, H0[1] + hs * hd.len * f, 0]; };
    var p1 = hp(0.0), p2 = hp(0.45), p3 = hp(0.85), p4 = hp(1.0);
    tube(g, [[p1[0], p1[1], 0, hd.r * 0.9, hd.r * 0.9], [p2[0], p2[1], 0, hd.r, hd.r * 1.0], [p3[0], p3[1], 0, hd.snout * 1.05, hd.snout], [p4[0], p4[1], 0, hd.snout * 0.75, hd.snout * 0.7]], col, 'head', 7, 0.1, 11);
    var ep = hp(0.38); [-1, 1].forEach(function (s) { eye(g, ep[0], ep[1] + hd.r * 0.35, s * hd.r * 0.82, hd.eye); });
    if (o.ears !== false) { var ea = hp(0.12); [-1, 1].forEach(function (s) { cone(g, [ea[0], ea[1] + hd.r * 0.6, s * hd.r * 0.55], [ea[0] - 0.02, ea[1] + hd.r * 0.6 + (o.earL || 0.04), s * (hd.r * 0.55 + (o.earL || 0.04) * 0.6)], o.earR || 0.016, typeof col === 'function' ? col(0, 1, 0, 'ear') : col, 4); }); }
    if (o.tail !== false) { var tl = o.tail || 0.14, ty = by + bR * 0.35; tube(g, [[-L / 2 + 0.01, ty, 0, 0.012, 0.012], [-L / 2 - tl * 0.25, ty - tl * 0.4, 0, 0.009, 0.009], [-L / 2 - tl * 0.3, ty - tl, 0, 0.006, 0.006]], col, 'tail', 4, 0.05, 2); }
    g.userData = { by: by, S: S, E: E, H0: H0, hp: hp, hd: hd, L: L, bR: bR, bW: bW };
    return g;
  }
  A.quad = quad;
  function wrap(g, turn) { var root = new T.Group(); g.rotation.y = -(turn == null ? 0.6 : turn); root.add(g); return root; } // head turned toward the viewer
  A.wrap = wrap;

  /* ---------- giraffe ---------- */
  M.custom.a_giraffe = function () {
    var base = '#f6d59a', patch = '#a3561f';
    var g = quad({ sides: 13, neckSides: 11, L: 0.42, legH: 0.42, bR: 0.11, bW: 0.085, slope: -0.18, legR: 0.022, kneeF: 0.01, kneeR: -0.02, prof: [0.6, 0.9, 1, 1.02, 1, 0.8],
      neck: { len: 0.42, ang: 1.15, r: 0.04 }, head: { len: 0.12, r: 0.036, snout: 0.024, ang: -0.35, eye: 0.007 }, earL: 0.035, earR: 0.012, tail: 0.18,
      col: function (x, y, z, p) {
        if (p === 'ear') return base; if (y < 0.015) return '#4a3524';
        if (p === 'leg' && y < 0.2) return vary(base, x, y, z);
        if (p === 'tail' && y < 0.42) return '#3d2a1c';
        var w = worley(x, y, z, p === 'head' ? 24 : 13); return w.e < 0.17 ? vary(base, x, y, z) : vary(shade(patch, (w.id - 0.5) * 0.1), x, y, z, 0.04);
      } });
    var u = g.userData, hp = u.hp, top = hp(0.1);
    [-1, 1].forEach(function (s) { cone(g, [top[0], top[1] + 0.03, s * 0.016], [top[0] - 0.012, top[1] + 0.075, s * 0.02], 0.007, '#6b4a2a', 5); ball(g, top[0] - 0.012, top[1] + 0.077, s * 0.02, 0.009, '#3d2a1c'); });
    // short dark mane down the back of the neck
    var S = u.S, E = u.E; tube(g, [[S[0] - 0.02, S[1] + 0.03, 0, 0.006, 0.012], [(S[0] + E[0]) / 2 - 0.02, (S[1] + E[1]) / 2 + 0.01, 0, 0.006, 0.013], [E[0] - 0.035, E[1] + 0.02, 0, 0.005, 0.01]], '#8a4f22', 'mane', 4, 0.05);
    return wrap(g);
  };

  /* ---------- elephant ---------- */
  M.custom.a_elephant = function () {
    var gray = '#8e939b', cg = function (x, y, z) { return vary(gray, x, y, z, 0.05); };
    var g = quad({ sides: 10, L: 0.52, legH: 0.24, bR: 0.18, bW: 0.15, legR: 0.052, kneeF: 0, kneeR: 0, slope: 0.1, prof: [0.62, 0.95, 1, 1, 0.97, 0.85],
      neck: { len: 0.0, ang: 0, r: 0.1 }, head: { len: 0.1, r: 0.11, snout: 0.075, ang: -1.0, eye: 0.009 }, ears: false, tail: 0.16, foot: 0,
      col: function (x, y, z, p) { if (y < 0.012) return '#c9c3b6'; return vary(p === 'leg' ? shade(gray, -0.02) : gray, x, y, z, 0.05); } });
    var u = g.userData, by = u.by, hx = u.L / 2 + 0.06, hy = by + 0.08;
    // big domed head
    tube(g, [[hx - 0.08, hy + 0.02, 0, 0.1, 0.11], [hx - 0.01, hy + 0.04, 0, 0.12, 0.13], [hx + 0.05, hy, 0, 0.1, 0.11], [hx + 0.08, hy - 0.06, 0, 0.065, 0.065]], cg, 'head', 10, 0.1, 8);
    [-1, 1].forEach(function (s) { eye(g, hx + 0.045, hy + 0.04, s * 0.09, 0.008); });
    // trunk hanging and curling forward at the tip
    tube(g, [[hx + 0.08, hy - 0.05, 0, 0.05, 0.05], [hx + 0.11, hy - 0.13, 0, 0.038, 0.038], [hx + 0.115, hy - 0.22, 0, 0.03, 0.03], [hx + 0.11, hy - 0.3, 0, 0.024, 0.024], [hx + 0.14, hy - 0.34, 0, 0.02, 0.02]], cg, 'trunk', 8, 0.08, 4);
    // big flat ears covering the sides of the head
    [-1, 1].forEach(function (s) {
      part(g, loft([[hx - 0.04, hy + 0.12, s * 0.105, 0.008, 0.012], [hx - 0.07, hy + 0.06, s * 0.13, 0.012, 0.1], [hx - 0.08, hy - 0.04, s * 0.135, 0.012, 0.09], [hx - 0.06, hy - 0.13, s * 0.125, 0.008, 0.02]], 6, 0.15, 9), function (x, y, z) { return vary('#9ba1aa', x, y, z, 0.04); });
    });
    // tusks curving forward and up
    [-1, 1].forEach(function (s) { tube(g, [[hx + 0.07, hy - 0.08, s * 0.05, 0.014, 0.014], [hx + 0.13, hy - 0.12, s * 0.065, 0.011, 0.011], [hx + 0.19, hy - 0.1, s * 0.07, 0.006, 0.006]], '#f4f0e4', 'tusk', 6, 0.02); });
    return wrap(g);
  };
})();
