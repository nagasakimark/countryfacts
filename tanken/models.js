/* Low-poly toy models built from simple shapes. One merged mesh per model (fast on Chromebooks).
   Units: model stands on y=0, about 1 unit tall, footprint within about ±0.5. +z = front.
   Part list: [shape, colour, ...numbers, {options}]
     b  box       w,h,d, x,y,z           (y = bottom)
     c  cylinder  rTop,rBottom,h, x,y,z, segments   (y = bottom)
     s  sphere    r, x,y,z               (y = centre)  options sx,sy,sz to squash
     h  half-sphere (dome) r, x,y,z
     a  arch (half ring) R,tube, x,y,z
   options: rx,ry,rz (radians, about the part's own base), sx,sy,sz, open:true, arc:radians */
(function () {
  var T = window.THREE, M = window.MODELS = {};
  var BASE = { g: '#8ed46d', s: '#f0d48a', w: '#5ec2f0', r: '#c9c9c9', n: '#e9f4ff' };

  function geom(p) {
    var t = p[0], o = (typeof p[p.length - 1] === 'object') ? p[p.length - 1] : {}, g, y0 = 0, x, y, z;
    if (t === 'b') { g = new T.BoxGeometry(p[2], p[3], p[4]); x = p[5]; y = p[6]; z = p[7]; y0 = p[3] / 2; }
    else if (t === 'c') { g = new T.CylinderGeometry(p[2], p[3], p[4], p[8] || 10, 1, !!o.open, 0, o.arc || Math.PI * 2); x = p[5]; y = p[6]; z = p[7]; y0 = p[4] / 2; }
    else if (t === 's') { g = new T.SphereGeometry(p[2], 10, 7); x = p[3]; y = p[4]; z = p[5]; }
    else if (t === 'h') { g = new T.SphereGeometry(p[2], 12, 5, 0, Math.PI * 2, 0, Math.PI / 2); x = p[3]; y = p[4]; z = p[5]; }
    else if (t === 'a') { g = new T.TorusGeometry(p[2], p[3], 5, 12, Math.PI); x = p[4]; y = p[5]; z = p[6]; }
    var m = new T.Matrix4(), q = new T.Quaternion().setFromEuler(new T.Euler(o.rx || 0, o.ry || 0, o.rz || 0));
    g.translate(0, y0, 0);
    g.applyMatrix4(m.compose(new T.Vector3(x, y, z), q, new T.Vector3(o.sx || 1, o.sy || 1, o.sz || 1)));
    return g;
  }
  // Merge all parts into one geometry with vertex colours.
  function build(parts, opt) {
    opt = opt || {};
    if (opt.base) parts = [['c', BASE[opt.base] || opt.base, 0.6, 0.64, 0.08, 0, -0.04, 0, 14]].concat(parts.map(function (p) { return lift(p); }));
    var pos = [], col = [], c = new T.Color();
    parts.forEach(function (p) {
      var g = geom(p).toNonIndexed(), a = g.attributes.position.array;
      c.set(p[1]);
      for (var i = 0; i < a.length; i += 3) { pos.push(a[i], a[i + 1], a[i + 2]); col.push(c.r, c.g, c.b); }
      g.dispose();
    });
    var out = new T.BufferGeometry();
    out.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    out.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    if (opt.rz || opt.rx) out.applyMatrix4(new T.Matrix4().makeRotationFromEuler(new T.Euler(opt.rx || 0, 0, opt.rz || 0)));
    out.computeVertexNormals();
    out.computeBoundingBox();
    out.computeBoundingSphere();
    return out;
  }
  function lift(p) { // shift parts up by the base thickness
    p = p.slice(); var yi = { b: 6, c: 6, s: 4, h: 4, a: 5 }[p[0]]; p[yi] += 0.04; return p;
  }
  function ring(n, r, f) { var out = []; for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2; out = out.concat(f(Math.cos(a) * r, Math.sin(a) * r, a, i)); } return out; }

  var D = {}; // model definitions: function returning [parts, options]
  D.fuji = function () { return [[['c', '#5b7fd6', 0.07, 0.6, 0.68, 0, 0, 0, 10], ['c', '#ffffff', 0.075, 0.255, 0.23, 0, 0.455, 0, 10]], { base: 'g' }]; };
  D.everest = function () { return [[['c', '#8a96b5', 0, 0.5, 0.95, 0, 0, 0, 5], ['c', '#7d88a8', 0, 0.34, 0.6, 0.3, 0, 0.1, 5], ['c', '#7d88a8', 0, 0.3, 0.5, -0.28, 0, 0.05, 5], ['c', '#ffffff', 0, 0.19, 0.36, 0, 0.6, 0, 5]], { base: 'n' }]; };
  D.kilimanjaro = function () { return [[['c', '#9a835c', 0.17, 0.6, 0.5, 0, 0, 0, 9], ['c', '#ffffff', 0.17, 0.3, 0.15, 0, 0.36, 0, 9]], { base: 's' }]; };
  D.skytree = function () { return [[['c', '#dfe8f5', 0.07, 0.2, 0.4, 0, 0, 0, 3], ['c', '#e8eef8', 0.05, 0.07, 1.0, 0, 0.4, 0, 8], ['c', '#8fa6cc', 0.13, 0.13, 0.08, 0, 0.78, 0, 10], ['c', '#8fa6cc', 0.09, 0.09, 0.06, 0, 1.05, 0, 10], ['c', '#cfd8e6', 0.012, 0.03, 0.3, 0, 1.4, 0, 6]], { base: 'r' }]; };
  D.castle = function () { var r = '#5d6b8a', w = '#ffffff'; return [[['b', '#c9c2b0', 0.8, 0.22, 0.6, 0, 0, 0], ['b', w, 0.6, 0.2, 0.45, 0, 0.22, 0], ['c', r, 0, 0.5, 0.15, 0, 0.42, 0, 4, { ry: Math.PI / 4, sz: 0.75 }], ['b', w, 0.42, 0.16, 0.32, 0, 0.52, 0], ['c', r, 0, 0.37, 0.13, 0, 0.68, 0, 4, { ry: Math.PI / 4, sz: 0.75 }], ['b', w, 0.28, 0.14, 0.22, 0, 0.76, 0], ['c', r, 0, 0.27, 0.16, 0, 0.9, 0, 4, { ry: Math.PI / 4, sz: 0.75 }], ['b', w, 0.2, 0.18, 0.18, 0.34, 0.22, 0.12], ['c', r, 0, 0.17, 0.1, 0.34, 0.4, 0.12, 4, { ry: Math.PI / 4 }]], { base: 'g' }]; };
  D.megane = function () { var s = '#b7a58a'; return [[['b', '#59b6ea', 1.15, 0.03, 0.42, 0, 0, 0], ['a', s, 0.21, 0.07, -0.23, 0.04, 0], ['a', s, 0.21, 0.07, 0.23, 0.04, 0], ['b', s, 1.1, 0.07, 0.22, 0, 0.27, 0], ['b', s, 0.12, 0.25, 0.22, 0, 0.03, 0], ['b', '#8a7a62', 1.1, 0.04, 0.03, 0, 0.34, 0.1], ['b', '#8a7a62', 1.1, 0.04, 0.03, 0, 0.34, -0.1]], { base: 'g' }]; };
  D.torii = function () { var r = '#e8383d'; return [[['c', r, 0.05, 0.06, 0.82, -0.3, 0, 0, 8], ['c', r, 0.05, 0.06, 0.82, 0.3, 0, 0, 8], ['b', r, 0.95, 0.08, 0.12, 0, 0.78, 0], ['b', '#2f2f3a', 1.08, 0.06, 0.15, 0, 0.86, 0], ['b', r, 0.78, 0.06, 0.08, 0, 0.62, 0], ['b', r, 0.07, 0.14, 0.07, 0, 0.66, 0]], { base: 'w' }]; };
  D.eiffel = function () { var c = '#9a7b5f'; return [[['c', c, 0.17, 0.42, 0.34, 0, 0, 0, 4, { ry: Math.PI / 4 }], ['b', '#7d6047', 0.42, 0.04, 0.42, 0, 0.34, 0], ['c', c, 0.08, 0.17, 0.4, 0, 0.38, 0, 4, { ry: Math.PI / 4 }], ['b', '#7d6047', 0.2, 0.04, 0.2, 0, 0.78, 0], ['c', c, 0.015, 0.08, 0.55, 0, 0.82, 0, 4, { ry: Math.PI / 4 }], ['c', '#ffc531', 0.01, 0.01, 0.14, 0, 1.37, 0, 4]], { base: 'g' }]; };
  D.bigben = function () { var g = '#d4ae55'; return [[['b', g, 0.26, 0.62, 0.26, 0, 0, 0], ['b', '#ffffff', 0.3, 0.16, 0.3, 0, 0.62, 0], ['b', g, 0.24, 0.14, 0.24, 0, 0.78, 0], ['c', '#4a5a7a', 0, 0.2, 0.34, 0, 0.92, 0, 4, { ry: Math.PI / 4 }], ['b', g, 0.55, 0.25, 0.3, -0.42, 0, 0], ['b', '#c19a45', 0.55, 0.05, 0.32, -0.42, 0.25, 0]], { base: 'g' }]; };
  D.stonehenge = function () { var g = '#9a9a9a'; return [ring(10, 0.4, function (x, z, a, i) { var p = [['b', g, 0.11, 0.34, 0.15, x, 0, z, { ry: -a }]]; if (i % 2 === 0) { var b = a + Math.PI / 10, xx = Math.cos(b) * 0.4, zz = Math.sin(b) * 0.4; p.push(['b', '#888888', 0.08, 0.07, 0.3, xx, 0.34, zz, { ry: -b }]); } return p; }).concat([['b', g, 0.12, 0.42, 0.2, 0, 0, 0]]), { base: 'g' }]; };
  D.colosseum = function () { return [[['c', '#e0c294', 0.5, 0.52, 0.42, 0, 0, 0, 16, { sz: 0.75 }], ['c', '#c9a874', 0.4, 0.4, 0.425, 0, 0, 0, 16, { sz: 0.75 }], ['c', '#a48a5c', 0.3, 0.3, 0.43, 0, 0, 0, 14, { sz: 0.72 }]], { base: 'r' }]; };
  D.pisa = function () { var p = [['c', '#f7f4ec', 0.15, 0.16, 0.9, 0, 0, 0, 12]]; for (var i = 1; i < 7; i++) p.push(['c', '#dcd6c6', 0.18, 0.18, 0.03, 0, i * 0.13, 0, 12]); p.push(['c', '#f7f4ec', 0.11, 0.11, 0.12, 0, 0.9, 0, 10]); return [p, { base: 'g', rz: 0.1 }]; };
  D.sagrada = function () { var b = '#d8c49a', p = [['b', b, 0.72, 0.35, 0.42, 0, 0, 0]]; [-0.27, -0.09, 0.09, 0.27].forEach(function (x) { p.push(['c', b, 0.06, 0.07, 0.62, x, 0.2, 0.12, 8], ['c', '#cdb582', 0, 0.075, 0.4, x, 0.82, 0.12, 8], ['s', '#e8a24a', 0.035, x, 1.22, 0.12]); }); p.push(['c', b, 0.09, 0.1, 0.8, 0, 0.3, -0.08, 8], ['c', '#cdb582', 0, 0.1, 0.5, 0, 1.1, -0.08, 8], ['s', '#ffffff', 0.04, 0, 1.6, -0.08]); return [p, { base: 'r' }]; };
  D.gate = function () { var b = '#e6d3a3', p = [['b', '#d6c391', 1.0, 0.04, 0.32, 0, 0, 0]]; for (var i = 0; i < 6; i++) p.push(['c', b, 0.04, 0.045, 0.42, -0.4 + i * 0.16, 0.04, 0, 8]); p.push(['b', b, 0.98, 0.14, 0.32, 0, 0.46, 0], ['b', b, 0.42, 0.1, 0.22, 0, 0.6, 0], ['b', '#4fa37a', 0.2, 0.13, 0.1, 0, 0.7, 0]); return [p, { base: 'r' }]; };
  D.palace = function () { var r = '#c0392b', g = '#4d6b5a'; return [[['b', '#d0d0d0', 0.86, 0.1, 0.56, 0, 0, 0], ['b', r, 0.7, 0.24, 0.42, 0, 0.1, 0], ['c', g, 0, 0.62, 0.24, 0, 0.34, 0, 4, { ry: Math.PI / 4, sz: 0.7 }], ['b', r, 0.42, 0.13, 0.24, 0, 0.5, 0], ['c', g, 0, 0.42, 0.2, 0, 0.62, 0, 4, { ry: Math.PI / 4, sz: 0.65 }]], { base: 'g' }]; };
  D.neusch = function () { var w = '#f3f0e8', bl = '#4a6fa5'; return [[['c', '#8aa07a', 0.3, 0.6, 0.18, 0, 0, 0, 7], ['b', w, 0.5, 0.42, 0.3, 0, 0.18, 0], ['c', bl, 0, 0.36, 0.18, 0, 0.6, 0, 4, { ry: Math.PI / 4, sz: 0.6 }], ['c', w, 0.08, 0.08, 0.72, 0.3, 0.18, 0.05, 10], ['c', bl, 0, 0.1, 0.26, 0.3, 0.9, 0.05, 10], ['c', w, 0.07, 0.07, 0.55, -0.27, 0.18, 0.08, 10], ['c', bl, 0, 0.09, 0.22, -0.27, 0.73, 0.08, 10], ['c', w, 0.1, 0.1, 0.92, 0.05, 0.18, -0.12, 10], ['c', bl, 0, 0.12, 0.32, 0.05, 1.1, -0.12, 10]], { base: 'g' }]; };
  D.windmill = function () { var p = [['c', '#c8503a', 0.12, 0.2, 0.6, 0, 0, 0, 8], ['c', '#6b4a3a', 0, 0.15, 0.16, 0, 0.6, 0, 8], ['s', '#6b4a3a', 0.04, 0, 0.62, 0.17]]; [0.785, 2.356, 3.927, 5.498].forEach(function (a) { p.push(['b', '#f4ecd8', 0.07, 0.46, 0.02, 0, 0.62, 0.19, { rz: a }]); }); return [p, { base: 'g' }]; };
  D.onion = function () { var p = [['b', '#c0392b', 0.56, 0.3, 0.46, 0, 0, 0], ['c', '#e9d9b8', 0.08, 0.09, 0.62, 0, 0.3, 0, 8], ['c', '#2ecc71', 0, 0.11, 0.36, 0, 0.92, 0, 8]]; var cs = ['#2b7de0', '#ffc531', '#2ecc71', '#ff6f91']; [[-0.2, -0.16], [0.2, -0.16], [-0.2, 0.16], [0.2, 0.16]].forEach(function (q, i) { p.push(['c', '#e9d9b8', 0.06, 0.07, 0.3, q[0], 0.3, q[1], 8], ['s', cs[i], 0.1, q[0], 0.68, q[1], { sy: 1.15 }], ['c', '#ffc531', 0, 0.035, 0.12, q[0], 0.76, q[1], 6]); }); return [p, { base: 'r' }]; };
  D.parthenon = function () { var w = '#efe4c8', p = [['b', '#e0d3b2', 0.98, 0.08, 0.58, 0, 0, 0]]; for (var i = 0; i < 8; i++) { var x = -0.42 + i * 0.12; p.push(['c', w, 0.032, 0.036, 0.34, x, 0.08, 0.22, 8], ['c', w, 0.032, 0.036, 0.34, x, 0.08, -0.22, 8]); } p.push(['b', w, 0.98, 0.08, 0.56, 0, 0.42, 0], ['c', '#e8dcbc', 0, 0.56, 0.12, 0, 0.5, 0, 4, { ry: Math.PI / 4, sz: 0.55 }]); return [p, { base: 's' }]; };
  D.mosque = function () { var w = '#e3ecf2', b = '#6ea7c9', p = [['b', w, 0.62, 0.24, 0.62, 0, 0, 0], ['h', b, 0.29, 0, 0.24, 0], ['c', '#ffc531', 0.005, 0.02, 0.12, 0, 0.52, 0, 6], ['h', b, 0.12, 0.25, 0.24, 0.25], ['h', b, 0.12, -0.25, 0.24, 0.25], ['h', b, 0.12, 0.25, 0.24, -0.25], ['h', b, 0.12, -0.25, 0.24, -0.25]]; [[0.4, 0.4], [-0.4, 0.4], [0.4, -0.4], [-0.4, -0.4], [0.48, 0], [-0.48, 0]].forEach(function (q) { p.push(['c', w, 0.03, 0.035, 0.8, q[0], 0, q[1], 8], ['c', b, 0, 0.045, 0.16, q[0], 0.8, q[1], 8]); }); return [p, { base: 'r' }]; };
  D.pyramid = function () { var c = '#e6c06a'; return [[['c', c, 0, 0.5, 0.56, -0.08, 0, -0.08, 4, { ry: Math.PI / 4 }], ['c', '#d9b35c', 0, 0.33, 0.38, 0.34, 0, 0.26, 4, { ry: Math.PI / 4 }], ['c', '#cfa850', 0, 0.2, 0.24, -0.38, 0, 0.36, 4, { ry: Math.PI / 4 }]], { base: 's' }]; };
  D.table = function () { return [[['c', '#8fa06c', 0.48, 0.62, 0.32, 0, 0, 0, 7], ['c', '#a7b880', 0.46, 0.48, 0.03, 0, 0.32, 0, 7], ['s', '#ffffff', 0.15, -0.15, 0.36, 0.05, { sy: 0.35 }], ['s', '#ffffff', 0.18, 0.12, 0.36, -0.05, { sy: 0.35 }]], { base: 'g' }]; };
  D.taj = function () { var w = '#f6f1ea', p = [['b', '#e8e0d2', 0.95, 0.06, 0.95, 0, 0, 0], ['b', w, 0.5, 0.36, 0.5, 0, 0.06, 0], ['s', w, 0.2, 0, 0.52, 0, { sy: 1.15 }], ['c', '#d4b24a', 0, 0.03, 0.16, 0, 0.72, 0, 6]]; [[0.4, 0.4], [-0.4, 0.4], [0.4, -0.4], [-0.4, -0.4]].forEach(function (q) { p.push(['c', w, 0.03, 0.035, 0.58, q[0], 0.06, q[1], 8], ['s', w, 0.045, q[0], 0.66, q[1]]); }); [[0.18, 0.18], [-0.18, 0.18], [0.18, -0.18], [-0.18, -0.18]].forEach(function (q) { p.push(['s', w, 0.07, q[0], 0.44, q[1]]); }); return [p, { base: 'g' }]; };
  D.wall = function () { var pts = [[-0.55, 0.25], [-0.22, -0.05], [0.08, 0.2], [0.45, -0.22]], p = []; for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); p.push(['b', '#c2ab82', L, 0.12, 0.09, (a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2, { ry: -Math.atan2(dz, dx) }]); } pts.forEach(function (q) { p.push(['b', '#b39a6e', 0.15, 0.22, 0.15, q[0], 0, q[1]]); }); p.push(['c', '#5fb06a', 0, 0.28, 0.25, 0.3, 0, 0.3, 6], ['c', '#5fb06a', 0, 0.22, 0.2, -0.35, 0, -0.3, 6]); return [p, { base: 'g' }]; };
  D.pagoda = function () { function prang(x, z, s) { return [['c', '#f1e6d0', 0.22 * s, 0.3 * s, 0.22 * s, x, 0, z, 8], ['c', '#e8a24a', 0.14 * s, 0.22 * s, 0.26 * s, x, 0.22 * s, z, 8], ['c', '#f1e6d0', 0.08 * s, 0.14 * s, 0.3 * s, x, 0.48 * s, z, 8], ['c', '#ff6f91', 0, 0.08 * s, 0.36 * s, x, 0.78 * s, z, 8]]; } return [prang(0, 0, 1.1).concat(prang(0.38, 0.38, 0.45), prang(-0.38, 0.38, 0.45), prang(0.38, -0.38, 0.45), prang(-0.38, -0.38, 0.45)), { base: 'r' }]; };
  D.angkor = function () { var s = '#8f7a5a', p = [['b', '#a8946e', 0.9, 0.08, 0.9, 0, 0, 0], ['b', '#9c8864', 0.7, 0.1, 0.7, 0, 0.08, 0], ['b', '#a8946e', 0.5, 0.1, 0.5, 0, 0.18, 0], ['c', s, 0.02, 0.11, 0.5, 0, 0.28, 0, 8]]; [[0.2, 0.2], [-0.2, 0.2], [0.2, -0.2], [-0.2, -0.2]].forEach(function (q) { p.push(['c', s, 0.02, 0.08, 0.34, q[0], 0.28, q[1], 8]); }); return [p, { base: 'w' }]; };
  D.merlion = function () { var w = '#f2f2f2'; return [[['b', '#d8d0c0', 0.32, 0.12, 0.3, 0, 0, 0], ['c', w, 0.12, 0.2, 0.36, 0, 0.12, 0, 10], ['s', w, 0.17, 0, 0.6, 0.02], ['s', '#e6e0d0', 0.1, 0, 0.56, 0.14], ['c', '#6ec6ff', 0.025, 0.04, 0.42, 0, 0.55, 0.2, 6, { rx: 1.25 }]], { base: 'w' }]; };
  D.twin = function () { var s = '#b8c2cf'; return [[['c', s, 0.085, 0.1, 1.15, -0.16, 0, 0, 8], ['c', s, 0.085, 0.1, 1.15, 0.16, 0, 0, 8], ['c', '#9aa6b6', 0, 0.085, 0.2, -0.16, 1.15, 0, 8], ['c', '#9aa6b6', 0, 0.085, 0.2, 0.16, 1.15, 0, 8], ['c', '#cfd6e0', 0.008, 0.012, 0.2, -0.16, 1.33, 0, 4], ['c', '#cfd6e0', 0.008, 0.012, 0.2, 0.16, 1.33, 0, 4], ['b', '#7e8a9a', 0.24, 0.04, 0.07, 0, 0.55, 0]], { base: 'r' }]; };
  D.borobudur = function () { var s = '#8f8a7e', p = []; [0.9, 0.76, 0.62, 0.48].forEach(function (w, i) { p.push(['b', i % 2 ? '#9d988b' : s, w, 0.08, w, 0, i * 0.08, 0]); }); p.push(['c', s, 0.2, 0.21, 0.06, 0, 0.32, 0, 12], ['c', '#9d988b', 0.14, 0.15, 0.06, 0, 0.38, 0, 12], ['s', s, 0.1, 0, 0.47, 0], ['c', s, 0, 0.03, 0.14, 0, 0.53, 0, 6]); ring(8, 0.2, function (x, z) { p.push(['s', '#9d988b', 0.04, x, 0.4, z]); return []; }); return [p, { base: 'g' }]; };
  D.tiers = function () { var g = '#6fa58f', p = [['b', '#5f8f7c', 0.3, 0.22, 0.3, 0, 0, 0]]; for (var i = 0; i < 8; i++) p.push(['c', i % 2 ? g : '#7fb9a2', 0.17, 0.13, 0.1, 0, 0.22 + i * 0.1, 0, 4, { ry: Math.PI / 4 }]); p.push(['c', g, 0.06, 0.08, 0.16, 0, 1.02, 0, 4, { ry: Math.PI / 4 }], ['c', '#cfd6e0', 0.01, 0.015, 0.3, 0, 1.18, 0, 4]); return [p, { base: 'r' }]; };
  D.ger = function () { var w = '#f4f1e8'; return [[['c', w, 0.35, 0.36, 0.22, 0, 0, 0, 14], ['c', '#e8e2d2', 0.06, 0.39, 0.18, 0, 0.22, 0, 14], ['c', '#e67e22', 0.06, 0.06, 0.03, 0, 0.4, 0, 10], ['b', '#e67e22', 0.13, 0.17, 0.03, 0, 0, 0.35], ['b', '#c0392b', 0.72, 0.03, 0.02, 0, 0.12, 0.36, { sx: 0.95 }]], { base: 'g' }]; };
  D.burj = function () { var s = '#a9bfd6'; return [[['c', s, 0.14, 0.18, 0.4, 0, 0, 0, 6], ['c', '#b9cde2', 0.1, 0.14, 0.35, 0, 0.4, 0, 6], ['c', s, 0.07, 0.1, 0.35, 0, 0.75, 0, 6], ['c', '#b9cde2', 0.045, 0.07, 0.3, 0, 1.1, 0, 6], ['c', '#dce6f0', 0.005, 0.045, 0.42, 0, 1.4, 0, 6]], { base: 's' }]; };
  D.opera = function () { var w = '#ffffff'; return [[['b', '#e0c9a6', 0.9, 0.08, 0.44, 0, 0, 0], ['c', w, 0, 0.16, 0.36, -0.28, 0.06, 0.02, 3, { rx: -0.45, sz: 0.6 }], ['c', '#f3f0ea', 0, 0.2, 0.46, 0, 0.06, -0.02, 3, { rx: -0.45, sz: 0.6 }], ['c', w, 0, 0.17, 0.4, 0.26, 0.06, 0.02, 3, { rx: -0.45, sz: 0.6 }]], { base: 'w' }]; };
  D.uluru = function () { return [[['s', '#c8582b', 0.5, 0, 0.0, 0, { sx: 1.05, sy: 0.42, sz: 0.48 }], ['s', '#b84c22', 0.2, 0.3, 0.06, 0.08, { sy: 0.5 }]], { base: 's' }]; };
  D.liberty = function () { var g = '#5fb89a'; return [[['b', '#b5a48a', 0.34, 0.14, 0.34, 0, 0, 0], ['b', '#c4b598', 0.24, 0.2, 0.24, 0, 0.14, 0], ['c', g, 0.06, 0.12, 0.42, 0, 0.34, 0, 8], ['s', g, 0.065, 0, 0.82, 0], ['c', g, 0, 0.04, 0.08, 0, 0.87, 0, 5, { rz: 0 }], ['c', g, 0.02, 0.025, 0.3, 0.07, 0.62, 0, 6, { rz: -0.3 }], ['c', '#ffc531', 0.05, 0.02, 0.08, 0.16, 0.9, 0, 6], ['s', '#ff9f43', 0.035, 0.165, 1.0, 0]], { base: 'g' }]; };
  D.goldengate = function () { var r = '#d0482c', p = [['b', r, 1.15, 0.04, 0.2, 0, 0.22, 0]]; [-0.32, 0.32].forEach(function (x) { p.push(['b', r, 0.05, 0.72, 0.05, x, 0, 0.08], ['b', r, 0.05, 0.72, 0.05, x, 0, -0.08], ['b', r, 0.05, 0.04, 0.2, x, 0.68, 0], ['b', r, 0.05, 0.04, 0.2, x, 0.45, 0]); }); [0.08, -0.08].forEach(function (z) { [[-0.57, -0.51, 0.5], [0.57, 0.51, 0.5], [0, 0.629, 0.54], [0, -0.629, 0.54]].forEach(function (k) { p.push(['b', '#b83c22', 0.015, k[2], 0.015, k[0], 0.26, z, { rz: k[1] }]); }); }); return [p, { base: 'w' }]; };
  D.canyon = function () { return [[['b', '#c0623a', 0.4, 0.2, 0.95, -0.3, 0, 0], ['b', '#d98b5a', 0.34, 0.12, 0.85, -0.33, 0.2, 0], ['b', '#c0623a', 0.4, 0.24, 0.95, 0.3, 0, 0], ['b', '#e3a06c', 0.3, 0.1, 0.7, 0.33, 0.24, 0.05], ['b', '#3fa9e8', 0.16, 0.02, 1.0, 0, 0, 0]], { base: '#d47b4a' }]; };
  D.needle = function () { var c = '#c9ccd2'; return [[['c', c, 0.035, 0.11, 0.78, 0, 0, 0, 3], ['c', '#9aa3b0', 0.14, 0.11, 0.09, 0, 0.7, 0, 12], ['c', '#b9c1cc', 0.08, 0.14, 0.05, 0, 0.79, 0, 12], ['c', c, 0.01, 0.03, 0.55, 0, 0.84, 0, 6]], { base: 'r' }]; };
  D.falls = function () { return [[['c', '#7a6a55', 0.46, 0.46, 0.3, 0, 0, -0.05, 14, { arc: Math.PI, ry: Math.PI / 2 }], ['c', '#6ab04c', 0.47, 0.47, 0.03, 0, 0.3, -0.05, 14, { arc: Math.PI, ry: Math.PI / 2 }], ['c', '#d6f1ff', 0.4, 0.38, 0.3, 0, 0, -0.02, 14, { arc: Math.PI, ry: Math.PI / 2, open: true }], ['s', '#ffffff', 0.12, -0.1, 0.06, 0.2, { sy: 0.6 }], ['s', '#ffffff', 0.1, 0.15, 0.06, 0.18, { sy: 0.6 }]], { base: 'w' }]; };
  D.steps = function () { var p = []; [0.82, 0.68, 0.54, 0.4, 0.28].forEach(function (w, i) { p.push(['b', i % 2 ? '#e3c26c' : '#d9b45a', w, 0.1, w, 0, i * 0.1, 0]); }); p.push(['b', '#c49a3e', 0.16, 0.57, 0.05, 0, 0, 0.42, { rx: -0.51 }], ['b', '#b48a36', 0.18, 0.13, 0.18, 0, 0.5, 0]); return [p, { base: 'g' }]; };
  D.machu = function () { return [[['c', '#3f8f4f', 0, 0.32, 0.95, 0.05, 0, -0.3, 6], ['b', '#9dbb6a', 0.7, 0.08, 0.5, 0, 0, 0.15], ['b', '#8db05c', 0.56, 0.08, 0.4, 0, 0.08, 0.12], ['b', '#a9a39a', 0.12, 0.1, 0.1, -0.15, 0.16, 0.1], ['b', '#a9a39a', 0.14, 0.1, 0.1, 0.1, 0.16, 0.18], ['b', '#a9a39a', 0.1, 0.1, 0.1, 0.05, 0.16, 0.0], ['c', '#5aa35f', 0, 0.2, 0.5, -0.4, 0, -0.1, 6]], { base: 'g' }]; };
  D.christ = function () { var w = '#f0f0f0'; return [[['c', '#4f9a5a', 0.04, 0.56, 0.52, 0, 0, 0, 7], ['b', '#ccc', 0.08, 0.08, 0.08, 0, 0.52, 0], ['b', w, 0.08, 0.3, 0.06, 0, 0.6, 0], ['b', w, 0.36, 0.05, 0.05, 0, 0.82, 0], ['s', w, 0.045, 0, 0.94, 0]], { base: 'g' }]; };
  D.moai = function () { var g = '#6f6a63', p = [['b', '#8a8278', 0.92, 0.06, 0.26, 0, 0, 0]]; [-0.3, 0, 0.3].forEach(function (x, i) { p.push(['b', g, 0.16, 0.3, 0.12, x, 0.06, 0], ['b', '#7a746b', 0.15, 0.22, 0.15, x, 0.36, 0], ['b', '#5f5a53', 0.04, 0.1, 0.04, x, 0.4, 0.08], ['b', '#5f5a53', 0.15, 0.03, 0.04, x, 0.5, 0.07]); if (i === 1) p.push(['c', '#a8452e', 0.07, 0.075, 0.07, x, 0.58, 0, 10]); }); return [p, { base: 'g' }]; };
  D.obelisk = function () { return [[['b', '#d8d8d8', 0.3, 0.04, 0.3, 0, 0, 0], ['c', '#f4f4f4', 0.045, 0.085, 0.92, 0, 0.04, 0, 4, { ry: Math.PI / 4 }], ['c', '#e0e0e0', 0, 0.064, 0.09, 0, 0.96, 0, 4, { ry: Math.PI / 4 }]], { base: 'r' }]; };

  // ---------- vehicles (+z = forward) ----------
  D.plane = function (c) { c = c || '#e8383d'; return [[['c', '#ffffff', 0.075, 0.075, 0.82, 0, 0, -0.41, 10, { rx: Math.PI / 2 }], ['s', '#ffffff', 0.075, 0, 0, 0.41, { sz: 1.6 }], ['s', '#3b4a6b', 0.045, 0, 0.04, 0.47, { sz: 1.2 }], ['b', c, 0.95, 0.025, 0.2, 0, -0.01, 0.02], ['b', c, 0.32, 0.02, 0.09, 0, 0.0, -0.38], ['b', c, 0.025, 0.2, 0.12, 0, 0.03, -0.38], ['c', '#c9d2e0', 0.035, 0.035, 0.14, 0.24, -0.06, -0.05, 8, { rx: Math.PI / 2 }], ['c', '#c9d2e0', 0.035, 0.035, 0.14, -0.24, -0.06, -0.05, 8, { rx: Math.PI / 2 }]]]; };
  D.ship = function () { var p = [['b', '#c0392b', 0.3, 0.06, 1.0, 0, 0, 0], ['b', '#2c3e50', 0.32, 0.08, 1.02, 0, 0.06, 0], ['b', '#ffffff', 0.26, 0.2, 0.1, 0, 0.14, -0.4], ['b', '#ff5a4d', 0.06, 0.1, 0.06, 0, 0.34, -0.44]], cs = ['#e8383d', '#2b7de0', '#ffc531', '#33c9a0', '#ff7a2f', '#7a4bd8']; for (var i = 0; i < 6; i++) for (var j = 0; j < 2; j++) p.push(['b', cs[(i + j * 3) % 6], 0.13, 0.09, 0.11, j ? 0.07 : -0.07, 0.14, 0.38 - i * 0.12]); return [p]; };
  D.ferry = function () { return [[['b', '#2b7de0', 0.3, 0.07, 0.8, 0, 0, 0], ['b', '#ffffff', 0.32, 0.12, 0.82, 0, 0.07, 0], ['b', '#ffffff', 0.26, 0.1, 0.5, 0, 0.19, -0.05], ['b', '#bfe3ff', 0.27, 0.04, 0.4, 0, 0.23, -0.05], ['b', '#ffffff', 0.18, 0.08, 0.2, 0, 0.29, -0.1], ['c', '#ff5a4d', 0.04, 0.05, 0.1, 0, 0.37, -0.2, 8]]]; };
  D.bullet = function (c) { c = c || '#1f5fbf'; return [[['b', '#ffffff', 0.16, 0.14, 0.8, 0, 0, -0.15], ['c', '#ffffff', 0.0, 0.085, 0.36, 0, 0.07, 0.25, 8, { rx: Math.PI / 2, sx: 0.95, sz: 0.85 }], ['b', c, 0.165, 0.025, 0.8, 0, 0.035, -0.15], ['b', '#3b4a6b', 0.165, 0.035, 0.7, 0, 0.09, -0.15], ['b', '#9aa3b0', 0.12, 0.02, 0.8, 0, 0.14, -0.15]]]; };
  D.train = function (c) { c = c || '#c0392b'; return [[['b', c, 0.17, 0.17, 0.34, 0, 0, 0.3], ['b', '#3b4a6b', 0.175, 0.05, 0.08, 0, 0.1, 0.44], ['b', '#2d6fb5', 0.16, 0.15, 0.3, 0, 0, -0.04], ['b', '#2d6fb5', 0.16, 0.15, 0.3, 0, 0, -0.38], ['b', '#ffffff', 0.165, 0.03, 0.66, 0, 0.09, -0.21], ['b', '#555', 0.12, 0.02, 1.0, 0, 0.17, -0.05]]]; };
  D.car = function (c) { c = c || '#ff5a4d'; var p = [['b', c, 0.3, 0.12, 0.62, 0, 0.05, 0], ['b', '#ffffff', 0.25, 0.1, 0.3, 0, 0.17, -0.04], ['b', '#bfe3ff', 0.255, 0.06, 0.26, 0, 0.19, -0.04]]; [[0.15, 0.2], [-0.15, 0.2], [0.15, -0.2], [-0.15, -0.2]].forEach(function (q) { p.push(['c', '#2f2f3a', 0.07, 0.07, 0.05, q[0], 0.07, q[1], 10, { rz: Math.PI / 2 }]); }); return [p]; };

  var cache = {};
  M.geometry = function (key, colour) {
    var k = key + (colour || '');
    if (cache[k]) return cache[k];
    var d = (D[key] || D.obelisk)(colour);
    return (cache[k] = build(d[0], d[1]));
  };
  M.keys = Object.keys(D);
  M.material = new T.MeshLambertMaterial({ vertexColors: true, flatShading: true });
})();
