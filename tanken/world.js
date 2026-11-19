/* せかいたんけん world: raised 3D land, natural colours up close, ocean, borders, roads and rails,
   plus scenery scattered around wherever you are looking (trees, towns, desert rocks, clouds).
   Everything is built once or rebuilt rarely; scenery uses instancing (one draw call per kind). */
window.makeWorld = function (env) {
  var T = THREE, K = MODELS.kit, noise = K.noise, hash = K.hash, D2R = Math.PI / 180, scene = env.scene, ll2v = env.ll2v, feat = env.feat;
  var W = {}, RIDE = W.rideState = { on: false, ver: 0 };

  /* ---------- height of the land ---------- */
  var RANGES = [ // [polyline lon/lat, height, width in degrees]
    [[[70, 36], [75, 34.5], [80, 31], [86, 28], [92, 28], [97, 28.5]], 0.016, 3], [[[78, 34], [88, 33], [97, 33]], 0.008, 6],
    [[[-78, 8], [-77, 0], [-76, -10], [-70, -17], [-69, -25], [-70, -33], [-71, -42], [-73, -50]], 0.012, 2],
    [[[-152, 62], [-135, 58], [-124, 50], [-115, 45], [-109, 40], [-106, 35]], 0.008, 4],
    [[[6, 44.5], [8, 46], [11, 47], [14, 47]], 0.008, 1.2], [[[-9, 30.5], [-5, 32], [0, 33.5], [6, 35.5]], 0.006, 1.5],
    [[[39, 43.5], [45, 42.5], [49, 41]], 0.006, 1.2], [[[45, 36], [50, 31], [56, 28]], 0.005, 2], [[[59, 47], [60, 55], [61, 62], [64, 67]], 0.003, 1.5],
    [[[37, 6], [39, 9], [39, 13]], 0.006, 3], [[[136, 35], [138, 36.5], [139.5, 37.5], [140.5, 40], [142, 43.5]], 0.004, 1],
    [[[6, 59], [9, 62], [14, 66], [18, 69]], 0.004, 2], [[[-85, 34], [-80, 37], [-77, 40], [-73, 43]], 0.003, 2],
    [[[146, -38], [150, -33], [152, -28], [146, -18]], 0.003, 2], [[[100, 27], [103, 30], [104, 33]], 0.007, 2.5], [[[44, 40], [43, 38]], 0.004, 2],
    [[[-4, 37], [-3, 40], [0, 42.6]], 0.003, 1.5], [[[29, -29], [30, -25]], 0.004, 1.5], [[[-74, -42], [-72, -48]], 0.006, 1.5]
  ];
  function segD(lon, lat, a, b) {
    var k = Math.cos(lat * D2R), ax = a[0] * k, ay = a[1], bx = b[0] * k, by = b[1], px = lon * k, py = lat, dx = bx - ax, dy = by - ay, t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t)); return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  }
  function fbm(x, y) { return noise(x, y) * 0.5 + noise(x * 2.1 + 5, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3 + 7) * 0.2; }
  var H0 = 0.0016, ELEV = (function () { try { var b = atob(window.ELEV05 || ''), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a.length === 720 * 361 ? a : null; } catch (e) { return null; } })();
  var EXAG = 0.005 / 6400; // world units per metre: Everest stands about 0.005 above the sea (≈ 6.5 × true height)
  function elevM(lon, lat) { // metres, bilinear on the 0.5° NASA/GEBCO grid
    var x = (lon + 180) * 2, y = (90 - lat) * 2, i = Math.floor(x), j = Math.max(0, Math.min(359, Math.floor(y))), fx = x - i, fy = Math.min(1, y - j), i0 = ((i % 720) + 720) % 720, i1 = (i0 + 1) % 720;
    var v = (ELEV[j * 720 + i0] * (1 - fx) + ELEV[j * 720 + i1] * fx) * (1 - fy) + (ELEV[(j + 1) * 720 + i0] * (1 - fx) + ELEV[(j + 1) * 720 + i1] * fx) * fy;
    return v / 255 * 6400;
  }
  W.elevM = function (lon, lat) { return ELEV ? elevM(lon, lat) : 0; };
  function height(lon, lat) {
    if (ELEV) return H0 + elevM(lon, lat) * EXAG + 0.0003 * noise(lon * 0.9, lat * 0.9);
    return heightFake(lon, lat);
  }
  function heightFake(lon, lat) {
    var h = H0 + 0.0022 * fbm(lon / 5, lat / 5) + 0.0008 * noise(lon * 1.1, lat * 1.1);
    for (var i = 0; i < RANGES.length; i++) {
      var R = RANGES[i], p = R[0], d = 99; if (Math.abs(lat - p[0][1]) > 40) continue;
      for (var j = 0; j < p.length - 1; j++) { var dd = segD(lon, lat, p[j], p[j + 1]); if (dd < d) d = dd; }
      if (d < R[2] * 3) h += R[1] * Math.exp(-(d / R[2]) * (d / R[2])) * (0.55 + 0.9 * noise(lon * 0.8, lat * 0.8));
    }
    return Math.min(0.022, h);
  }
  W.height = height;

  /* ---------- land mask (for placing scenery) ---------- */
  var MW = 1440, MH = 720, mask = new Uint8Array(MW * MH);
  (function () {
    var c = document.createElement('canvas'); c.width = MW; c.height = MH; var x = c.getContext('2d');
    var gp = d3.geoPath(d3.geoEquirectangular().scale(MW / (2 * Math.PI)).translate([MW / 2, MH / 2]).precision(0.3), x);
    x.fillStyle = '#000'; x.fillRect(0, 0, MW, MH); x.fillStyle = '#fff'; x.beginPath(); feat.forEach(function (f) { gp(f); }); x.fill();
    var d = x.getImageData(0, 0, MW, MH).data; for (var i = 0; i < MW * MH; i++) mask[i] = d[i * 4] > 128 ? 1 : 0;
  })();
  function isLand(lon, lat) { var i = Math.floor((lon + 180) / 360 * MW), j = Math.floor((90 - lat) / 180 * MH); if (j < 0 || j >= MH) return false; i = (i % MW + MW) % MW; return mask[j * MW + i] === 1; }
  W.isLand = isLand;
  // height and biome on a 0.5° grid, so placing scenery is cheap
  var GW = 720, GH = 361, HG = new Float32Array(GW * GH), BG = new Uint8Array(GW * GH);
  W.prepGrids = function () {
    for (var j = 0; j < GH; j++) for (var i = 0; i < GW; i++) { var lon = -180 + i * 0.5, lat = 90 - j * 0.5, h = height(lon, lat); HG[j * GW + i] = h; BG[j * GW + i] = biome(lon, lat, h); }
  };
  function hFast(lon, lat) {
    var x = (lon + 180) * 2, y = (90 - lat) * 2, i = Math.floor(x), j = Math.max(0, Math.min(GH - 2, Math.floor(y))), fx = x - i, fy = y - j, i0 = (i % GW + GW) % GW, i1 = (i0 + 1) % GW;
    return (HG[j * GW + i0] * (1 - fx) + HG[j * GW + i1] * fx) * (1 - fy) + (HG[(j + 1) * GW + i0] * (1 - fx) + HG[(j + 1) * GW + i1] * fx) * fy;
  }
  function bFast(lon, lat) { var i = ((Math.round((lon + 180) * 2) % GW) + GW) % GW, j = Math.max(0, Math.min(GH - 1, Math.round((90 - lat) * 2))); return BG[j * GW + i]; }
  function baseG(lon, lat) { return isLand(lon, lat) ? hFast(lon, lat) : 0; }
  W.roadH = function (lon, lat) { // riding: the asphalt's height (the highest ground across the road's width, as the ribbon is drawn)
    if (!RIDE.on) return baseG(lon, lat); var ex = 0.0014 / D2R, kx = Math.max(0.2, Math.cos(lat * D2R));
    return rideH(lon, lat) + 0 * ex * kx; }; // (the bed is level across its width and smooth along it, so the middle is enough — sampling the sides picked up the next bend and made steps)
  W.groundH = function (lon, lat) { return RIDE.on ? rideH(lon, lat) : baseG(lon, lat); };

  /* ---------- biomes ---------- */
  var B = { snow: 0, tundra: 1, desert: 2, savanna: 3, rain: 4, forest: 5, taiga: 6, grass: 7 };
  var BCOL = ['#eef3f6', '#a9b88f', '#e8c47c', '#c9bf66', '#3f8f45', '#5f9f4b', '#4a7f4a', '#8fc45c'];
  var DESERT = [[-17, 15, 33, 31], [35, 15, 58, 31], [52, 25, 70, 35], [69, 24, 76, 29], [75, 37, 112, 46], [117, -31, 143, -20], [12, -28, 24, -18], [-72, -28, -68, -18], [-117, 29, -105, 37], [-71, -50, -66, -40], [41, 2, 50, 11]];
  var SAVANNA = [[-17, 8, 42, 15], [24, -11, 41, 8], [14, -26, 33, -11], [-60, -22, -40, -5], [125, -19, 145, -11], [74, 15, 84, 23], [-100, 30, -95, 45], [-104, 37, -97, 48], [112, -35, 120, -28]];
  var RAIN = [[-76, -13, -48, 5], [9, -6, 30, 5], [95, -10, 150, 20], [-90, 8, -76, 18], [-10, 4, 8, 9], [72, 8, 77, 15], [-58, -28, -45, -20]];
  function inB(lon, lat, b, m) { return lon > b[0] - m && lon < b[2] + m && lat > b[1] - m && lat < b[3] + m; }
  var LT = (function () { try { var b = atob(window.LANDTYPE_RLE || ''), out = new Uint8Array(1440 * 720), k = 0; for (var i = 0; i < b.length; i += 2) { var v = b.charCodeAt(i), n = b.charCodeAt(i + 1); out.fill(v, k, k + n); k += n; } return k === out.length ? out : null; } catch (e) { return null; } })();
  var LTMAP = [B.grass, B.snow, B.desert, B.savanna, B.grass, B.forest, B.taiga, B.tundra];
  function biome(lon, lat, h) {
    if (LT) {
      var i = ((Math.floor((lon + 180) * 4) % 1440) + 1440) % 1440, j = Math.max(0, Math.min(719, Math.floor((90 - lat) * 4))), c = LT[j * 1440 + i];
      if (c === 0) { // coast pixel: borrow a neighbour
        for (var d = 1; d <= 2 && c === 0; d++) { var a = [LT[j * 1440 + (i + d) % 1440], LT[j * 1440 + (i - d + 1440) % 1440], LT[Math.min(719, j + d) * 1440 + i], LT[Math.max(0, j - d) * 1440 + i]]; for (var q = 0; q < 4; q++) if (a[q]) { c = a[q]; break; } }
      }
      if (c === 6) return Math.abs(lat) < 28 ? B.rain : B.taiga;
      return LTMAP[c];
    }
    return biomeFake(lon, lat, h);
  }
  function biomeFake(lon, lat, h) {
    if (lat < -60 || (lon > -73 && lon < -12 && lat > 61 && lat < 84 && !(lon > -55 && lat < 64))) return B.snow;
    if (h > 0.0095) return B.snow;
    var m = (noise(lon * 0.35, lat * 0.35) - 0.5) * 5;
    if (lat > 67) return B.tundra;
    for (var i = 0; i < DESERT.length; i++) if (inB(lon, lat, DESERT[i], m)) return B.desert;
    for (var j = 0; j < RAIN.length; j++) if (inB(lon, lat, RAIN[j], m * 0.6)) return B.rain;
    for (var k = 0; k < SAVANNA.length; k++) if (inB(lon, lat, SAVANNA[k], m)) return B.savanna;
    if (lat > 52 || lat < -46) return B.taiga;
    var f = noise(lon * 0.5 + 9, lat * 0.5);
    if (lat > 35 && f > 0.6) return B.forest;
    if (lat < -35 && f > 0.62) return B.forest;
    return f > 0.68 ? B.forest : B.grass;
  }
  W.biome = function (lon, lat) { return isLand(lon, lat) ? biome(lon, lat, height(lon, lat)) : -1; };

  /* ---------- the land mesh ---------- */
  function clip(ring, x0, y0, x1, y1) {
    function cut(pts, inside, inter) { var out = []; for (var i = 0; i < pts.length; i++) { var a = pts[i], b = pts[(i + 1) % pts.length], ia = inside(a), ib = inside(b); if (ia) out.push(a); if (ia !== ib) out.push(inter(a, b)); } return out; }
    var p = ring;
    p = cut(p, function (q) { return q[0] >= x0; }, function (a, b) { var t = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + t * (b[1] - a[1])]; }); if (p.length < 3) return [];
    p = cut(p, function (q) { return q[0] <= x1; }, function (a, b) { var t = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + t * (b[1] - a[1])]; }); if (p.length < 3) return [];
    p = cut(p, function (q) { return q[1] >= y0; }, function (a, b) { var t = (y0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y0]; }); if (p.length < 3) return [];
    p = cut(p, function (q) { return q[1] <= y1; }, function (a, b) { var t = (y1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y1]; });
    return p.length < 3 ? [] : p;
  }
  var pos = [], col = [], bcol = [], cid = [], idx = [], c1 = new T.Color(), c2 = new T.Color(), v = new T.Vector3();
  function addVert(lon, lat, r, ca, cb, ci) { ll2v(lon, lat, r, v); pos.push(v.x, v.y, v.z); col.push(ca.r, ca.g, ca.b); bcol.push(cb.r, cb.g, cb.b); cid.push(ci); return pos.length / 3 - 1; }
  function landCols(lon, lat, h, base) {
    c1.set(base).offsetHSL(0, 0, (fbm(lon / 3, lat / 3) - 0.5) * 0.08);
    c2.set(BCOL[bFast(lon, lat)]).offsetHSL(0, 0, (fbm(lon * 1.3, lat * 1.3) - 0.5) * 0.12);
    if (h > 0.0045) c2.lerp(new T.Color('#8f8a80'), 0.5);
  }
  var t0 = performance.now(); W.prepGrids(); W.gridMs = Math.round(performance.now() - t0);
  feat.forEach(function (f, fi) {
    var id = f.properties.id, base = env.FILL[id] || '#ccc', g = f.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    polys.forEach(function (rings) {
      if (!rings[0] || rings[0].length < 4) return;
      // cut the country into grid cells so big countries follow the curve of the Earth, then triangulate each piece
      var map = {};
      function vid(lon, lat) { var k = lon.toFixed(4) + ',' + lat.toFixed(4); if (map[k] != null) return map[k]; var h = hFast(lon, lat); landCols(lon, lat, h, base); return (map[k] = addVert(lon, lat, 1 + h, c1, c2, fi)); }
      var rs = rings.map(function (ring) { var r = ring.slice(); if (r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]) r.pop(); return r; });
      var bx0 = 999, bx1 = -999, by0 = 999, by1 = -999; rs[0].forEach(function (p) { bx0 = Math.min(bx0, p[0]); bx1 = Math.max(bx1, p[0]); by0 = Math.min(by0, p[1]); by1 = Math.max(by1, p[1]); });
      var CS = 1.5;
      for (var cy0 = Math.floor(by0 / CS) * CS; cy0 < by1; cy0 += CS) for (var cx0 = Math.floor(bx0 / CS) * CS; cx0 < bx1; cx0 += CS) {
        var cx1 = cx0 + CS, cy1 = cy0 + CS, pieces = rs.map(function (r) { return clip(r, cx0, cy0, cx1, cy1); });
        if (pieces[0].length < 3) continue;
        var outerV = pieces[0].map(function (p) { return new T.Vector2(p[0], p[1]); }), holeV = [], all = pieces[0].slice();
        for (var hI = 1; hI < pieces.length; hI++) if (pieces[hI].length >= 3) { holeV.push(pieces[hI].map(function (p) { return new T.Vector2(p[0], p[1]); })); all = all.concat(pieces[hI]); }
        var faces; try { faces = T.ShapeUtils.triangulateShape(outerV, holeV); } catch (e) { continue; }
        faces.forEach(function (fc) { var a = all[fc[0]], b = all[fc[1]], c = all[fc[2]]; if (a && b && c) idx.push(vid(a[0], a[1]), vid(b[0], b[1]), vid(c[0], c[1])); });
      }
      // coast walls: a sandy cliff from the land down under the sea
      var sand = new T.Color('#ecd9a0'), dark = new T.Color('#a08560');
      rings.forEach(function (ring) {
        for (var i = 0; i < ring.length - 1; i++) {
          var a = ring[i], b = ring[i + 1], ha = hFast(a[0], a[1]), hb = hFast(b[0], b[1]);
          var i0 = addVert(a[0], a[1], 1 + ha, sand, sand, -1), i1 = addVert(b[0], b[1], 1 + hb, sand, sand, -1), i2 = addVert(a[0], a[1], 0.9985, dark, dark, -1), i3 = addVert(b[0], b[1], 0.9985, dark, dark, -1);
          idx.push(i0, i2, i1, i1, i2, i3);
        }
      });
    });
  });
  var lg = new T.BufferGeometry();
  lg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); lg.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  lg.setAttribute('bcol', new T.Float32BufferAttribute(bcol, 3)); lg.setAttribute('cid', new T.Float32BufferAttribute(cid, 1));
  lg.setIndex(idx); lg.computeVertexNormals(); lg.computeBoundingSphere();
  var U = W.uniforms = { uRideC: { value: new T.Vector3(1, 0, 0) }, uRideA: { value: 0 }, uNear: { value: 0 }, uSel: { value: -9 }, uRelief: { value: null }, uSat: { value: null }, uShade: { value: 0 } };
  var tl = new T.TextureLoader();
  tl.load('data/relief.png', function (t) { t.wrapS = T.RepeatWrapping; t.minFilter = T.LinearFilter; t.generateMipmaps = false; U.uRelief.value = t; W._relImg = t.image; U.uShade.value = 1; if (W.onReady) W.onReady(); });
  tl.load('data/earth.jpg', function (t) { t.colorSpace = T.SRGBColorSpace; t.wrapS = T.RepeatWrapping; U.uSat.value = t; tileMat.map = t; tileMat.needsUpdate = true; if (W.onReady) W.onReady(); });
  var landMat = new T.MeshLambertMaterial({ vertexColors: true });
  landMat.userData.preKey = 'land'; landMat.userData.pre = function (sh) {
    for (var k in U) sh.uniforms[k] = U[k];
    sh.vertexShader = 'attribute vec3 bcol; attribute float cid; uniform float uNear; uniform float uSel; varying vec3 vLN; varying float vTop;\n' + sh.vertexShader.replace('#include <color_vertex>',
      '#include <color_vertex>\n  vLN = normalize(position); vTop = cid < -0.5 ? 0.0 : 1.0;\n  vColor.rgb = mix(vColor.rgb, bcol, uNear);\n  if (abs(cid - uSel) < 0.5) vColor.rgb = mix(vColor.rgb, vec3(1.0, 0.93, 0.78), 0.55);');
    sh.fragmentShader = 'uniform sampler2D uRelief; uniform sampler2D uSat; uniform float uNear; uniform float uShade; uniform vec3 uRideC; uniform float uRideA; varying vec3 vLN; varying float vTop;\n' +
      'vec2 llUV(vec3 n){ return vec2(atan(-n.z, n.x) * 0.15915494 + 0.5, asin(clamp(n.y, -1.0, 1.0)) * 0.31830989 + 0.5); }\n' +
      sh.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n  if (uRideA > 0.0 && acos(clamp(dot(normalize(vLN), uRideC), -1.0, 1.0)) < uRideA) discard;').replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' +
      '  if (vTop > 0.5 && uShade > 0.5) {\n' +
      '    vec3 n = normalize(vLN); vec2 uv = llUV(n); float cl = max(0.2, sqrt(1.0 - n.y * n.y));\n' +
      '    float h0 = texture2D(uRelief, uv).r, hE = texture2D(uRelief, uv + vec2(1.0 / 2048.0, 0.0)).r, hN = texture2D(uRelief, uv + vec2(0.0, 1.0 / 1024.0)).r;\n' +
      '    vec3 e = normalize(cross(vec3(0.0, 1.0, 0.0), n)); vec3 t = cross(n, e);\n' +
      '    float k = 6400.0 / 6371000.0 * 55.0; float sx = (hE - h0) * k / (6.2831853 / 2048.0 * cl), sy = (hN - h0) * k / (3.1415927 / 1024.0);\n' +
      '    vec3 wn = normalize(n - e * sx - t * sy); normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);\n' +
      '  }').replace('#include <color_fragment>', '#include <color_fragment>\n  if (uNear > 0.01 && vTop > 0.5) { vec3 sc = texture2D(uSat, llUV(normalize(vLN))).rgb; diffuseColor.rgb = mix(diffuseColor.rgb, sc * 1.25, uNear * 0.85); }');
  };
  env.nightify(landMat, true);
  var land = new T.Mesh(lg, landMat); scene.add(land); W.land = land;
  W.buildMs = Math.round(performance.now() - t0); W.tris = idx.length / 3;

  /* ---------- borders and coastlines ---------- */
  (function () {
    var segs = [];
    function addLines(mls, r0) {
      mls.coordinates.forEach(function (line) {
        for (var i = 0; i < line.length - 1; i++) {
          var a = line[i], b = line[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.8));
          for (var k = 0; k < n; k++) {
            var p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], q = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n];
            ll2v(p[0], p[1], 1 + hFast(p[0], p[1]) + r0, v); segs.push(v.x, v.y, v.z); ll2v(q[0], q[1], 1 + hFast(q[0], q[1]) + r0, v); segs.push(v.x, v.y, v.z);
          }
        }
      });
    }
    addLines(topojson.mesh(WORLD_TOPO, WORLD_TOPO.objects.countries, function (a, b) { return a !== b; }), 0.0004);
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(segs, 3));
    var m = new T.LineBasicMaterial({ color: 0x2a1f4a, transparent: true, opacity: 0.45 });
    W.borders = new T.LineSegments(g, m); scene.add(W.borders);
  })();

  /* ---------- ocean ---------- */
  W.oceanTexture = function (cb) { new T.TextureLoader().load('data/ocean.jpg', function (t) { t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; cb(t); }); };


  /* ---------- roads, rails, sea lanes ---------- */
  (function () {
    function stripTex(kind) {
      var c = document.createElement('canvas'); c.width = 64; c.height = 64; var x = c.getContext('2d');
      if (kind === 'road' || kind === 'roadW') { x.fillStyle = '#45484f'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#eceae2'; x.fillRect(4, 0, 2.5, 64); x.fillRect(57.5, 0, 2.5, 64); x.fillStyle = kind === 'roadW' ? '#eceae2' : '#f2c230'; x.fillRect(30.5, 0, 3, 34); }
      else { x.fillStyle = '#8a7e6e'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#6e6152'; x.fillRect(8, 0, 48, 64); for (var y = 0; y < 64; y += 10) { x.fillStyle = '#5a4434'; x.fillRect(12, y, 40, 4); } x.fillStyle = '#d6d9de'; x.fillRect(20, 0, 3, 64); x.fillRect(41, 0, 3, 64); }
      var t = new T.CanvasTexture(c); t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
    }
    var roadM = new T.MeshLambertMaterial({ map: stripTex('road') }), roadMW = new T.MeshLambertMaterial({ map: stripTex('roadW') }), railM = new T.MeshLambertMaterial({ map: stripTex('rail') }), lanes = [];
    env.nightify(roadM, true); env.nightify(roadMW, true); env.nightify(railM, true);
    env.routes.forEach(function (r) {
      if (r.type === 'plane') return;
      if (r.type === 'ship') { r.pts.forEach(function (p, i) { if (i) { var a = r.pts[i - 1]; ll2v(a[0], a[1], 1.0006, v); lanes.push(v.x, v.y, v.z); ll2v(p[0], p[1], 1.0006, v); lanes.push(v.x, v.y, v.z); } }); return; }
      ribbon(r);
    });
    W.rebuildRibbons = function () { env.routes.forEach(function (r) { if (r._rib) { scene.remove(r._rib); r._rib.geometry.dispose(); r._rib = null; ribbon(r); } }); };
    function ribbon(r) {
      var pts = [], P = [], Uv = [], ix = [], dist = 0, wd = r.type === 'car' ? 0.00085 : 0.00042;
      for (var i = 0; i < r.pts.length - 1; i++) { var a = r.pts[i], b = r.pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.12)); for (var k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); }
      pts.push(r.pts[r.pts.length - 1]);
      var prev = null;
      pts.forEach(function (p, i) {
        var q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)], n = ll2v(p[0], p[1], 1), t = ll2v(q[0], q[1], 1).sub(ll2v(o[0], o[1], 1)).normalize(), s = new T.Vector3().crossVectors(n, t).normalize();
        var gh = W.roadH(p[0], p[1]); // (the highest ground across the road's width: no hump of relief pokes through the asphalt)
        var c = n.clone().multiplyScalar(1 + gh + 0.00012);
        if (prev) dist += c.distanceTo(prev); prev = c;
        P.push(c.x + s.x * wd, c.y + s.y * wd, c.z + s.z * wd, c.x - s.x * wd, c.y - s.y * wd, c.z - s.z * wd); Uv.push(0, dist / 0.0032, 1, dist / 0.0032);
        if (i) { var b0 = (i - 1) * 2; ix.push(b0, b0 + 1, b0 + 2, b0 + 1, b0 + 3, b0 + 2); }
      });
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(Uv, 2)); g.setIndex(ix); g.computeVertexNormals();
      var m = new T.Mesh(g, r.type === 'car' ? (r.p[0][0] < -30 ? roadM : roadMW) : railM); m.material.side = T.DoubleSide; scene.add(m); r._rib = m; // (yellow centre lines in the Americas, white elsewhere)
    }
    var lg2 = new T.BufferGeometry(); lg2.setAttribute('position', new T.Float32BufferAttribute(lanes, 3));
    var lm = new T.LineDashedMaterial({ color: 0xcfefff, dashSize: 0.006, gapSize: 0.006, transparent: true, opacity: 0.6 }), ls = new T.LineSegments(lg2, lm); ls.computeLineDistances(); scene.add(ls); W.lanes = ls;
  })();

  /* ---------- ride-along terrain: real relief in 4° tiles round the vehicle, built nearest first ----------
     Heights come from NASA/GEBCO elevation and sea depth (relief exaggerated more than on the globe),
     flattened into level beds under railways and roads and flat pads under landmarks. The globe's own land
     is cut away inside the covered circle and the sea there turns see-through so the sea floor shows. */
  var REL = null, DEP = null, ANCH = null, EXR = EXAG * 5.5; // (riding: mountains well exaggerated, as a toy world)
  W.pads = [];
  function grab(img, w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h); var d = x.getImageData(0, 0, w, h).data, a = new Uint8Array(w * h); for (var i = 0; i < a.length; i++) a[i] = d[i * 4]; return a; }
  var depImg = new Image(); depImg.onload = function () { DEP = grab(depImg, 1024, 512); ANCH = null; RIDE.ver++; }; depImg.src = 'data/depth.jpg';
  function samp(a, w, h, lon, lat) {
    var x = (lon + 180) / 360 * w - 0.5, y = Math.max(0, Math.min(h - 1.001, (90 - lat) / 180 * h - 0.5)), i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, i0 = ((i % w) + w) % w, i1 = (i0 + 1) % w;
    return (a[j * w + i0] * (1 - fx) + a[j * w + i1] * fx) * (1 - fy) + (a[(j + 1) * w + i0] * (1 - fx) + a[(j + 1) * w + i1] * fx) * fy;
  }
  function landF(lon, lat) { // 0 sea … 1 land, smooth across the 0.25° mask
    var x = (lon + 180) * 4 - 0.5, y = Math.max(0, Math.min(MH - 1.001, (90 - lat) * 4 - 0.5)), i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, i0 = ((i % MW) + MW) % MW, i1 = (i0 + 1) % MW;
    var f = (mask[j * MW + i0] * (1 - fx) + mask[j * MW + i1] * fx) * (1 - fy) + (mask[(j + 1) * MW + i0] * (1 - fx) + mask[(j + 1) * MW + i1] * fx) * fy;
    return f * f * (3 - 2 * f);
  }
  function rawH(lon, lat) {
    var e = REL ? samp(REL, 2048, 1024, lon, lat) / 255 * 6400 : (ELEV ? elevM(lon, lat) : 0);
    var land = 0.0005 + e * EXR + 0.00015 * noise(lon * 4, lat * 4);
    var d = DEP ? (255 - samp(DEP, 1024, 512, lon, lat)) / 255 * 8000 : 300;
    var sea = -0.0007 - d * EXAG * 0.45, f = landF(lon, lat);
    return sea + (land - sea) * f;
  }
  function ensure() {
    if (!REL && W._relImg) { REL = grab(W._relImg, 2048, 1024); ANCH = null; RIDE.ver++; }
    if (ANCH) return; ANCH = {};
    function segAdd(p, q, h0, h1, r0, r1) { var x0 = Math.floor(Math.min(p[0], q[0]) - r1 - 0.01), x1 = Math.floor(Math.max(p[0], q[0]) + r1 / Math.max(0.2, Math.cos(p[1] * D2R)) + 0.01), y0 = Math.floor(Math.min(p[1], q[1]) - r1), y1 = Math.floor(Math.max(p[1], q[1]) + r1), e = [p[0], p[1], h0, r0, r1, 0, q[0], q[1], h1];
      for (var cx = x0; cx <= x1; cx++) for (var cy = y0; cy <= y1; cy++) (ANCH[cx + ',' + cy] || (ANCH[cx + ',' + cy] = [])).push(e); } // (a bed segment: height runs smoothly from one end to the other)
    function add(lon, lat, h, r0, r1, pad) { var k = Math.floor(lon) + ',' + Math.floor(lat); (ANCH[k] || (ANCH[k] = [])).push([lon, lat, h, r0, r1, pad || 0]); }
    env.routes.forEach(function (r) { // keep sea lanes in water all the way into port (only at the shore: a lane drawn straight across a headland cut a dotted trench over the hills)
      if (r.type !== 'ship') return;
      var inl = 0; r.pts.forEach(function (p) { if (landF(p[0], p[1]) > 0.55) inl++; }); var river = inl > r.pts.length * 0.4; // (a river cruise: the channel is cut all the way)
      for (var i = 0; i < r.pts.length - 1; i++) { var a = r.pts[i], b = r.pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.05)); for (var k = 0; k <= n; k++) { var x = a[0] + (b[0] - a[0]) * k / n, y = a[1] + (b[1] - a[1]) * k / n; var lf = landF(x, y); if (lf > 0.05 && (lf < 0.55 || river)) add(x, y, -0.0012, 0.05, 0.16, 2); } }
    });
    env.routes.forEach(function (r) { // railways and roads: one smooth height profile along the whole line — embankments and cuttings, never steps
      if (r.type === 'plane' || r.type === 'ship') return;
      var pts = [];
      for (var i = 0; i < r.pts.length - 1; i++) { var a = r.pts[i], b = r.pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.04)); for (var k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); }
      pts.push(r.pts[r.pts.length - 1]); var N = pts.length;
      var hs = pts.map(function (p) { return Math.max(0.0006, rawH(p[0], p[1])); }), med = hs.map(function (h, i) { var w = []; for (var k = Math.max(0, i - 6); k <= Math.min(N - 1, i + 6); k++) w.push(hs[k]); w.sort(function (x, y) { return x - y; }); return w[Math.floor(w.length * 0.45)]; });
      for (var pass = 0; pass < 4; pass++) { var sm = med.slice(); for (var i2 = 0; i2 < N; i2++) { var t = 0, c = 0; for (var k2 = Math.max(0, i2 - 8); k2 <= Math.min(N - 1, i2 + 8); k2++) { t += med[k2]; c++; } sm[i2] = t / c; } med = sm; }
      var G2 = 0.00055; for (var i3 = 1; i3 < N; i3++) med[i3] = Math.min(med[i3], med[i3 - 1] + G2); for (var i4 = N - 2; i4 >= 0; i4--) med[i4] = Math.min(med[i4], med[i4 + 1] + G2); // (no steep pitches between neighbouring points)
      r.hprof = med; r.hpts = pts;
      for (var s2 = 0; s2 < N - 1; s2++) segAdd(pts[s2], pts[s2 + 1], Math.max(0.0006, med[s2]), Math.max(0.0006, med[s2 + 1]), 0.13, 0.4);
    });
    W.pads.forEach(function (p) { // flat ground under landmarks
      var s = 0, c = 0; for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { var x = p[0] + a * 0.25 / Math.max(0.2, Math.cos(p[1] * D2R)), y = p[1] + b * 0.25; if (landF(x, y) > 0.5) { s += rawH(x, y); c++; } }
      add(p[0], p[1], Math.max(0.0008, c ? s / c : H0), 0.42, 0.95, 1);
    });
  }
  function rideH(lon, lat) {
    ensure();
    var h = rawH(lon, lat), best = 0, bh = 0, sb = 0, sbs = -1, sh = 0, cw = 0, kc = Math.cos(lat * D2R), fl = Math.floor(lon), ft = Math.floor(lat);
    for (var di = -1; di <= 1; di++) for (var dj = -1; dj <= 1; dj++) {
      var L = ANCH[(fl + di) + ',' + (ft + dj)]; if (!L) continue;
      for (var q = 0; q < L.length; q++) {
        var a = L[q], ah = a[2], dx, dy;
        if (a.length > 6) { var sx = (a[6] - a[0]) * kc, sy = a[7] - a[1], px = (lon - a[0]) * kc, py = lat - a[1], ss = sx * sx + sy * sy, t = ss > 0 ? Math.max(0, Math.min(1, (px * sx + py * sy) / ss)) : 0; dx = px - sx * t; dy = py - sy * t; ah = a[2] + (a[8] - a[2]) * t; }
        else { dx = (a[0] - lon) * kc; dy = a[1] - lat; }
        if (Math.abs(dx) > a[4] || Math.abs(dy) > a[4]) continue;
        var d = Math.sqrt(dx * dx + dy * dy); if (d >= a[4]) continue;
        var w = d <= a[3] ? 1 : 1 - (d - a[3]) / (a[4] - a[3]); w = w * w * (3 - 2 * w); if (a[5] === 2) { if (w > cw) cw = w; continue; } if (a[5]) w *= landF(lon, lat); if (a.length > 6) { var sc = w - d * 0.01; if (sc > sbs) { sbs = sc; sb = w; sh = ah; } } // (the nearest line wins where two run side by side) else if (w > best) { best = w; bh = ah; }
      }
    }
    if (best) h += (bh - h) * best; // (pads and harbour channels first, then the road or rail bed on top: the line itself is never broken by a pad)
    if (sb) h += (sh - h) * sb;
    return cw ? h + (-0.0012 - h) * cw : h; // (shipping channels last: a road or a landmark beside a river never fills it in)
  }
  W.rideH = rideH;
  var TS = 4, TN = 32, RW = 7.5, tiles = {}, tileMat = new T.MeshLambertMaterial({ color: 0xffffff });
  tileMat.vertexColors = true; env.nightify(tileMat, true);
  tileMat.userData.preKey = 'tile'; tileMat.userData.pre = function (sh) { // sea floor: sandy in the shallows, blue-green in the deep
    sh.vertexShader = 'attribute vec2 aSea; varying vec2 vSea;\n' + sh.vertexShader.replace('#include <color_vertex>', '#include <color_vertex>\n  vSea = aSea;');
    sh.fragmentShader = 'varying vec2 vSea;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#ifdef USE_MAP\n  { vec4 sat = texture2D(map, vMapUv); diffuseColor.rgb *= mix(1.0, 0.75 + 0.5 * dot(sat.rgb, vec3(0.333)) / 0.35, 0.35); }\n#endif').replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.42, 0.86, 0.84), vec3(0.04, 0.2, 0.45), sqrt(clamp(vSea.y, 0.0, 1.0))), clamp(vSea.x, 0.0, 1.0));');
  };
  // the ground's own colours while riding: a bright toy palette per biome (blended across biome edges), bare rock and snow up high, a little
  // mottling so big plains are not one flat colour; the satellite picture only shades it slightly
  var RCOL = [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return new T.Color(['#eef3f6', '#b4c08e', '#ecc985', '#d8c66a', '#5aab48', '#78bb52', '#6aa457', '#94d05a'][k]); }), gcol = new T.Color(), gtmp = new T.Color(), ROCKC = new T.Color('#a39a8c'), SNOWC = new T.Color('#f2f6f8'), SANDC = new T.Color('#eadcb0');
  function snowAt(lat) { var al = Math.abs(lat); return al > 66 ? 800 : al > 58 ? 1400 : al > 50 ? 2300 : al > 42 ? 3100 : al > 35 ? 4800 : 5400; } // (rough snow lines: low near the poles, highest in the tropics and on the Tibetan plateau)
  W.snowAt = snowAt;
  function groundCol(lon, lat, hh, out) {
    out.setRGB(0, 0, 0); var o = 0.22;
    var nb = 0; [[0, 0], [o, 0], [-o, 0], [0, o], [0, -o]].forEach(function (d) { var x = lon + d[0] / Math.max(0.2, Math.cos(lat * D2R)), y = lat + d[1]; if (landF(x, y) < 0.4) return; out.add(RCOL[Math.max(0, bFast(x, y))]); nb++; }); // (sea cells don't count: they read as ice and paled every coast)
    if (nb) out.multiplyScalar(1 / nb); else out.copy(RCOL[5]);
    var m = ELEV ? elevM(lon, lat) : 0, snowLine = snowAt(lat);
    if (m > snowLine - 800) out.lerp(ROCKC, Math.min(1, (m - snowLine + 800) / 700) * 0.75);
    if (m > snowLine) out.lerp(SNOWC, Math.min(1, (m - snowLine) / 500));
    var f = landF(lon, lat); if (f < 0.42 && hh < 0.0006) out.lerp(SANDC, Math.min(1, (0.42 - f) / 0.15) * (hh > 0 ? 0.8 : 0.4)); // (a narrow pale beach right at the water's edge)
    var nz = 0.92 + 0.16 * noise(lon * 9.1, lat * 9.1); out.multiplyScalar(nz); return out;
  }
  function buildTile(i, j) {
    var lon0 = i * TS, lat0 = j * TS, n = TN + 1, CO = new Float32Array(n * n * 3), P = new Float32Array(n * n * 3), UV = new Float32Array(n * n * 2), SE = new Float32Array(n * n * 2), ix = [];
    for (var b = 0; b < n; b++) for (var a = 0; a < n; a++) {
      var lon = lon0 + a * TS / TN, lat = Math.max(-89.9, Math.min(89.9, lat0 + b * TS / TN)), k = b * n + a;
      var hh = rideH(lon, lat); groundCol(lon, lat, hh, gcol); CO[k * 3] = gcol.r; CO[k * 3 + 1] = gcol.g; CO[k * 3 + 2] = gcol.b; SE[k * 2] = Math.max(0, Math.min(1, (0.0002 - hh) / 0.0006)); SE[k * 2 + 1] = Math.max(0, Math.min(1, -hh / 0.004)); ll2v(lon, lat, 1 + hh, v); P[k * 3] = v.x; P[k * 3 + 1] = v.y; P[k * 3 + 2] = v.z; UV[k * 2] = (lon + 180) / 360; UV[k * 2 + 1] = (lat + 90) / 180;
    }
    for (var bb = 0; bb < TN; bb++) for (var aa = 0; aa < TN; aa++) { var k0 = bb * n + aa; ix.push(k0, k0 + 1, k0 + n, k0 + 1, k0 + n + 1, k0 + n); }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(P, 3)); g.setAttribute('uv', new T.BufferAttribute(UV, 2)); g.setAttribute('aSea', new T.BufferAttribute(SE, 2)); g.setAttribute('color', new T.BufferAttribute(CO, 3)); g.setIndex(ix); g.computeVertexNormals(); g.computeBoundingSphere();
    var m = new T.Mesh(g, tileMat); scene.add(m); return m;
  }
  function tileDist(i, j, lon, lat) { // degrees from the point to the nearest edge of the tile
    var x0 = i * TS, y0 = j * TS, dl = ((lon - x0 + 540) % 360) - 180, dx = dl < 0 ? -dl : (dl > TS ? dl - TS : 0), dy = lat < y0 ? y0 - lat : (lat > y0 + TS ? lat - y0 - TS : 0);
    var cl = Math.cos(Math.min(89, Math.min(Math.abs(lat), Math.abs(lat) + dy)) * D2R); return Math.hypot(dx * Math.max(0.05, cl), dy);
  }
  W.setPads = function (list) { W.pads = list; ANCH = null; RIDE.ver++; if (RIDE.on) { for (var k in tiles) { scene.remove(tiles[k]); tiles[k].geometry.dispose(); } tiles = {}; } };
  W.setRide = function (on, rr) {
    RIDE.on = on; RIDE.ver++;
    if (!on) { for (var k in tiles) { scene.remove(tiles[k]); tiles[k].geometry.dispose(); } tiles = {}; U.uRideA.value = 0; if (SEAC) SEAC.visible = false; }
    else ensure();
    if (W.borders) W.borders.visible = !on; if (W.lanes) W.lanes.visible = !on; W.land.visible = !on || (rr && rr.type === 'plane'); // (on the ground the ride tiles reach past the horizon; the globe's land mesh leaked through them as dotted lines) // (globe-view dashed routes would lie across the ground)
    W.rebuildRibbons();
    env.routes.forEach(function (r) { if (r._rib) r._rib.visible = !on || !rr || r.id === rr.id; }); // (riding: only your own road or line — the others are drawn straight between towns and showed up as dotted lines across the hills)
  };
  // Build the tiles nearest the vehicle first, spending at most `budget` ms; returns true if anything changed.
  W.rideUpdate = function (lon, lat, budget) {
    if (!RIDE.on) return false;
    var t0 = performance.now(), kc = Math.max(0.12, Math.cos(lat * D2R)), want = [], changed = false;
    for (var j = Math.floor((lat - RW) / TS); j <= Math.floor((lat + RW) / TS); j++) {
      if (j * TS >= 90 || (j + 1) * TS <= -90) continue;
      for (var i = Math.floor((lon - RW / kc) / TS); i <= Math.floor((lon + RW / kc) / TS); i++) {
        var ii = (((i + 45) % 90) + 90) % 90 - 45, d = tileDist(ii, j, lon, lat); if (d <= RW) want.push([d, ii, j]);
      }
    }
    want.sort(function (a, b) { return a[0] - b[0]; });
    var cover = RW, keep = {};
    for (var w = 0; w < want.length; w++) {
      var key = want[w][1] + ',' + want[w][2]; keep[key] = 1;
      if (!tiles[key]) {
        if (performance.now() - t0 < budget) { tiles[key] = buildTile(want[w][1], want[w][2]); changed = true; }
        else cover = Math.min(cover, want[w][0]);
      }
    }
    for (var k in tiles) if (!keep[k] && tileDist(+k.split(',')[0], +k.split(',')[1], lon, lat) > RW + 3) { scene.remove(tiles[k]); tiles[k].geometry.dispose(); delete tiles[k]; changed = true; }
    ll2v(lon, lat, 1, U.uRideC.value); var A = Math.max(0, cover - 0.15) * D2R;
    if (Math.abs(A - U.uRideA.value) > 1e-4) { U.uRideA.value = A; changed = true; }
    seaUpdate(); return changed;
  };
  // The globe's sea is a 96×64 sphere: its flat faces dip up to 0.0005 below sea level, which let shallow sea floor poke out as "sand"
  // right where you ride. While riding, a finely curved cap of water (dense near the middle) replaces it over the built tiles.
  var SEAC = null, seaA = -1, seaMat = new T.MeshPhongMaterial({ color: 0x2b8fe6, specular: 0x9fc8ff, shininess: 60, transparent: true, opacity: 0.8, depthWrite: false, vertexColors: true });
  seaMat.userData.preKey = 'seacap'; seaMat.userData.pre = function (sh) { sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.a = min(1.0, diffuseColor.a * vColor.r); diffuseColor.rgb /= max(vColor.r, 0.001);'); };
  function seaCap(A) {
    var NR = 44, NS = 160, P = [], C = [], ix = [], q = new T.Vector3();
  // (the cap is fully opaque at its rim, so no dark sea floor shows through where it meets the globe sea; riding, the far globe sea takes the same blue)
    P.push(0, 0, 1); C.push(1, 1, 1);
    for (var r = 1; r <= NR; r++) { var t = r / NR, an = A * (0.04 * t + 0.96 * t * t), fade = 1 + 0.25 * Math.max(0, (t - 0.9) / 0.1); for (var k = 0; k < NS; k++) { var ph = k / NS * Math.PI * 2; P.push(Math.sin(an) * Math.cos(ph), Math.sin(an) * Math.sin(ph), Math.cos(an)); C.push(fade, fade, fade); } }
    for (var k2 = 0; k2 < NS; k2++) ix.push(0, 1 + k2, 1 + (k2 + 1) % NS);
    for (var r2 = 1; r2 < NR; r2++) for (var k3 = 0; k3 < NS; k3++) { var a0 = 1 + (r2 - 1) * NS + k3, a1 = 1 + (r2 - 1) * NS + (k3 + 1) % NS, b0 = a0 + NS, b1 = a1 + NS; ix.push(a0, b0, a1, a1, b0, b1); }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(P, 3)); g.setAttribute('color', new T.Float32BufferAttribute(C, 3)); g.setIndex(ix); return g;
  }
  var ZUP = new T.Vector3(0, 0, 1);
  function seaUpdate() {
    var A = U.uRideA.value;
    if (!RIDE.on || A <= 0) { if (SEAC) SEAC.visible = false; return; }
    if (!SEAC) { SEAC = new T.Mesh(seaCap(A), seaMat); SEAC.renderOrder = 2; SEAC.frustumCulled = false; scene.add(SEAC); seaA = A; }
    else if (Math.abs(A - seaA) > 0.002) { SEAC.geometry.dispose(); SEAC.geometry = seaCap(A); seaA = A; }
    SEAC.visible = true; SEAC.quaternion.setFromUnitVectors(ZUP, U.uRideC.value);
  }
  W.rideTiles = function () { return Object.keys(tiles).length; };

  /* ---------- scenery around the view (instanced) ---------- */
  function lam(c, flat) { var m = new T.MeshLambertMaterial({ color: c, flatShading: !!flat }); env.nightify(m, false); return m; }
  function merged(parts) { // [[geometry, colour]] -> one geometry with vertex colours
    var P = [], C = [], cc = new T.Color();
    parts.forEach(function (pp) { var g = pp[0].toNonIndexed(), a = g.attributes.position.array; cc.set(pp[1]); for (var i = 0; i < a.length; i += 3) { P.push(a[i], a[i + 1], a[i + 2]); C.push(cc.r, cc.g, cc.b); } });
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('color', new T.Float32BufferAttribute(C, 3)); g.computeVertexNormals(); return g;
  }
  var vcm = new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }); env.nightify(vcm, false);
  function kind(geo, max, mat) { var m = new T.InstancedMesh(geo, mat || vcm, max); m.count = 0; m.frustumCulled = false; m.instanceMatrix.setUsage(T.DynamicDrawUsage); scene.add(m); return m; }
  var conifer = merged([[new T.ConeGeometry(0.36, 0.75, 5, 1, true).translate(0, 0.62, 0), '#ffffff'], [new T.ConeGeometry(0.27, 0.55, 5, 1, true).translate(0, 0.95, 0), '#ffffff'], [new T.CylinderGeometry(0.06, 0.08, 0.3, 4, 1, true).translate(0, 0.15, 0), '#7a5a3a']]);
  var broad = merged([[new T.IcosahedronGeometry(0.42, 0).scale(1, 0.95, 1).translate(0, 0.72, 0), '#ffffff'], [new T.CylinderGeometry(0.06, 0.09, 0.4, 4, 1, true).translate(0, 0.2, 0), '#7a5a3a']]);
  var acacia = merged([[new T.CylinderGeometry(0.5, 0.42, 0.18, 7).translate(0, 0.72, 0), '#ffffff'], [new T.CylinderGeometry(0.05, 0.07, 0.65, 5).translate(0, 0.32, 0), '#7a5a3a']]);
  var cactus = merged([[new T.CylinderGeometry(0.1, 0.11, 0.8, 6).translate(0, 0.4, 0), '#ffffff'], [new T.CylinderGeometry(0.07, 0.07, 0.3, 6).translate(0.18, 0.5, 0), '#ffffff'], [new T.CylinderGeometry(0.07, 0.07, 0.18, 6).rotateZ(Math.PI / 2).translate(0.1, 0.35, 0), '#ffffff']]);
  function win(parts, w, h, x, y, z, ry) { var g = new T.PlaneGeometry(w, h); if (ry) g.rotateY(ry); g.translate(x, y, z); parts.push([g, '#3c4a63']); }
  var house = (function () { // cottage: walls, a hipped roof with eaves, door, windows, chimney
    var P = [[new T.BoxGeometry(0.7, 0.5, 0.55).translate(0, 0.25, 0), '#ffffff'], [new T.ConeGeometry(0.6, 0.34, 4, 1).rotateY(Math.PI / 4).scale(1, 1, 0.82).translate(0, 0.67, 0), '#c0533a'], [new T.PlaneGeometry(0.14, 0.22).translate(0.12, 0.11, 0.2755), '#6a4a34'], [new T.BoxGeometry(0.09, 0.22, 0.09).translate(-0.2, 0.78, -0.08), '#a8573f']];
    win(P, 0.13, 0.12, -0.17, 0.3, 0.2755); win(P, 0.12, 0.12, 0, 0.3, -0.2755, Math.PI); win(P, 0.12, 0.12, 0.351, 0.3, 0, Math.PI / 2); win(P, 0.12, 0.12, -0.351, 0.3, 0, -Math.PI / 2);
    return merged(P); })();
  var house2 = (function () { // two storeys, a pitched slate roof along its length
    var P = [[new T.BoxGeometry(0.62, 0.78, 0.48).translate(0, 0.39, 0), '#ffffff'], [new T.CylinderGeometry(0.39, 0.39, 0.7, 3, 1).rotateZ(Math.PI / 2).rotateX(Math.PI / 2).scale(1, 0.55, 0.85).rotateY(Math.PI / 2).translate(0, 0.86, 0), '#54647c'], [new T.PlaneGeometry(0.13, 0.22).translate(0, 0.11, 0.2405), '#4a3a2c']];
    [-0.18, 0.18].forEach(function (x) { win(P, 0.12, 0.13, x, 0.56, 0.2405); win(P, 0.12, 0.13, x, 0.56, -0.2405, Math.PI); win(P, 0.12, 0.13, x, 0.22, -0.2405, Math.PI); }); win(P, 0.12, 0.13, -0.18, 0.22, 0.2405);
    return merged(P); })();
  var houseF = (function () { // flat roof with a low wall round it and a little room on top (hot, dry places)
    var P = [[new T.BoxGeometry(0.8, 0.46, 0.68).translate(0, 0.23, 0), '#ffffff'], [new T.BoxGeometry(0.84, 0.06, 0.72).translate(0, 0.49, 0), '#ffffff'], [new T.BoxGeometry(0.32, 0.24, 0.3).translate(0.18, 0.6, -0.12), '#ffffff'], [new T.PlaneGeometry(0.14, 0.24).translate(-0.15, 0.12, 0.3405), '#2f6f8a']];
    win(P, 0.11, 0.11, 0.17, 0.3, 0.3405); win(P, 0.11, 0.11, -0.2, 0.3, -0.3405, Math.PI); win(P, 0.11, 0.11, 0.2, 0.3, -0.3405, Math.PI); win(P, 0.11, 0.11, 0.401, 0.28, 0, Math.PI / 2);
    return merged(P); })();
  var tower = merged([[new T.BoxGeometry(0.5, 1, 0.5).translate(0, 0.5, 0), '#ffffff'], [new T.BoxGeometry(0.52, 0.04, 0.52).translate(0, 1.0, 0), '#d9dde3']]);
  var rock = new T.IcosahedronGeometry(0.4, 0).scale(1, 0.55, 0.8).translate(0, 0.12, 0); rock = merged([[rock, '#ffffff']]);
  var puff = new T.IcosahedronGeometry(1, 1);
  var cloudMat = new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true, emissive: 0x8a93a8 }); env.nightify(cloudMat, false);
  // Ride-along vegetation: many shapes of each kind (tier counts, crown sizes, lean and lumpiness vary), so a forest never looks stamped out
  function jit(g, amt, seed) { var p = g.attributes.position; for (var i = 0; i < p.count; i++) { var k = 1 + amt * (hash(seed + Math.round((p.getX(i) * 7 + p.getY(i) * 13 + p.getZ(i) * 17) * 10), seed * 0.37) - 0.5); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); } return g; }
  function rr(k, seed) { return hash(seed * 13.1 + k * 7.7, k * 3.3 + seed); }
  var TRUNK = '#6b4a32';
  function trunk(h, r) { return new T.CylinderGeometry((r || 0.06) * 0.75, r || 0.06, h, 5).translate(0, h / 2, 0); }
  function conV(v, snow) { var n = 2 + Math.floor(rr(1, v) * 3), th = 0.18 + 0.12 * rr(2, v), w0 = 0.32 + 0.14 * rr(3, v), lean = (rr(4, v) - 0.5) * 0.08, parts = [[trunk(th + 0.1), TRUNK]];
    for (var t = 0; t < n; t++) { var f = t / n, w = w0 * (1 - f * 0.62), h = (0.95 - th) / n * 1.45; parts.push([jit(new T.ConeGeometry(w, h, 6 + (v % 2)), 0.14, v * 7 + t).translate(lean * t, th + f * (0.92 - th) + h * 0.35, 0), snow ? (t % 2 ? '#e9eef2' : '#cfdcd8') : '#ffffff']); }
    return merged(parts); }
  function broadV(v) { var th = 0.36 + 0.18 * rr(1, v), n = 2 + Math.floor(rr(2, v) * 3), parts = [[trunk(th + 0.08, 0.055), TRUNK], [jit(new T.IcosahedronGeometry(0.34 + 0.12 * rr(3, v), 0), 0.18, v * 11).scale(1, 0.62 + 0.25 * rr(4, v), 1).translate(0, th + 0.12, 0), '#ffffff']];
    for (var t = 1; t < n; t++) parts.push([jit(new T.IcosahedronGeometry(0.17 + 0.11 * rr(6 + t, v), 0), 0.2, v * 13 + t).translate((rr(9 + t, v) - 0.5) * 0.5, th + 0.12 + 0.2 * rr(12 + t, v), (rr(15 + t, v) - 0.5) * 0.4), '#e6ecdc']);
    return merged(parts); }
  function roundV(v) { var th = 0.3 + 0.2 * rr(1, v), r0 = 0.3 + 0.12 * rr(3, v), parts = [[trunk(th + 0.1), TRUNK], [jit(new T.IcosahedronGeometry(r0, v % 2), 0.22, v * 17).scale(0.95 + 0.25 * rr(5, v), 0.85 + 0.3 * rr(6, v), 0.95).translate(0, th + r0 * 0.6, 0), '#ffffff']];
    if (rr(7, v) > 0.4) parts.push([jit(new T.IcosahedronGeometry(r0 * 0.55, 0), 0.2, v * 19).translate(r0 * 0.6, th + r0 * 0.4, 0.1), '#dfe8d0']);
    return merged(parts); }
  function palmV(v) { var h = 0.85 + 0.25 * rr(1, v), bend = 0.12 + 0.1 * rr(2, v), parts = [], seg = 5;
    for (var i = 0; i < seg; i++) { var y0 = h * i / seg, x0 = bend * Math.pow(i / seg, 2), x1 = bend * Math.pow((i + 1) / seg, 2); parts.push([new T.CylinderGeometry(0.035, 0.045, h / seg + 0.01, 5).translate(0, h / seg / 2, 0).rotateZ(-Math.atan2(x1 - x0, h / seg)).translate(x0, y0, 0), '#8a6a44']); }
    for (var k = 0; k < 7; k++) { var a = k / 7 * 6.28 + rr(3, v), lf = new T.BoxGeometry(0.42, 0.012, 0.11).translate(0.21, 0, 0).rotateZ(-0.45 - 0.2 * rr(4 + k, v)).rotateY(a); parts.push([lf.translate(bend, h, 0), '#ffffff']); }
    return merged(parts); }
  function acaciaV(v) { var th = 0.5 + 0.15 * rr(1, v); return merged([[trunk(th, 0.045).rotateZ((rr(2, v) - 0.5) * 0.3), TRUNK], [jit(new T.CylinderGeometry(0.55 + 0.1 * rr(3, v), 0.4, 0.14, 8), 0.25, v * 23).translate(0, th + 0.05, 0), '#ffffff'], [jit(new T.CylinderGeometry(0.3, 0.22, 0.1, 7), 0.25, v * 29).translate(0.25, th - 0.05, 0.1), '#e2e8c8']]); }
  function cactusV(v) { var G = '#ffffff', parts = [[new T.CylinderGeometry(0.09, 0.1, 0.85, 7).translate(0, 0.425, 0), G], [new T.SphereGeometry(0.09, 7, 3, 0, 6.3, 0, 1.6).translate(0, 0.85, 0), G]];
    var arms = v % 4; for (var a = 0; a < arms; a++) { var sd = a % 2 ? -1 : 1, y = 0.35 + 0.12 * a, hh = 0.2 + 0.1 * rr(a, v); parts.push([new T.CylinderGeometry(0.06, 0.06, 0.18, 6).rotateZ(Math.PI / 2).translate(sd * 0.12, y, 0), G], [new T.CylinderGeometry(0.06, 0.06, hh, 6).translate(sd * 0.21, y + hh / 2, 0), G], [new T.SphereGeometry(0.06, 6, 3, 0, 6.3, 0, 1.6).translate(sd * 0.21, y + hh, 0), G]); }
    if (v === 3) parts = [[new T.SphereGeometry(0.28, 8, 5).scale(1, 1.15, 1).translate(0, 0.28, 0), G], [new T.SphereGeometry(0.06, 5, 3).translate(0, 0.62, 0), '#ffd24a']];
    return merged(parts); }
  function rockV(v) { var shape = v % 4, g = shape === 1 ? new T.DodecahedronGeometry(1, 0) : new T.IcosahedronGeometry(1, shape === 2 ? 1 : 0); jit(g, 0.45, v * 31);
    var sx = [1, 1.4, 0.9, 0.6][shape], sy = [0.6, 0.35, 0.7, 1.3][shape], p = g.attributes.position; for (var i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * sx, Math.max(-0.1, p.getY(i)) * sy + 0.08, p.getZ(i) * (0.8 + 0.3 * rr(1, v)));
    return merged([[g, '#ffffff']]); }
  function shrubV(v) { var parts = []; for (var i = 0; i < 3; i++) parts.push([jit(new T.IcosahedronGeometry(0.18 + 0.08 * rr(i, v), 0), 0.3, v * 5 + i).scale(1, 0.7, 1).translate((rr(i + 3, v) - 0.5) * 0.35, 0.12, (rr(i + 6, v) - 0.5) * 0.35), '#ffffff']); return merged(parts); }
  function karstV(v) { // a limestone tower: steep jagged sides, jungle on top and clinging in patches
    var h = 1, g = jit(new T.CylinderGeometry(0.22 + 0.08 * rr(1, v), 0.36 + 0.06 * rr(2, v), h, 7, 4), 0.32, v * 41).translate(0, h / 2, 0), p = g.attributes.position;
    for (var i = 0; i < p.count; i++) { var y = p.getY(i); p.setX(i, p.getX(i) + (y * y) * 0.12 * (rr(3, v) - 0.5)); }
    var parts = [[g, '#a8a296'], [jit(new T.IcosahedronGeometry(0.3 + 0.06 * rr(4, v), 0), 0.3, v * 43).scale(1, 0.55, 1).translate(0.02, h + 0.02, 0), '#3d9447']];
    for (var k = 0; k < 3; k++) { var an = rr(5 + k, v) * 6.28, yy = 0.3 + 0.5 * rr(8 + k, v); parts.push([jit(new T.IcosahedronGeometry(0.12, 0), 0.4, v * 7 + k).scale(1, 0.8, 0.6).translate(Math.cos(an) * 0.3, yy, Math.sin(an) * 0.3), k ? '#4fa64e' : '#2f7d3c']); }
    return merged(parts); }
  var KARST = [[106.85, 20.55, 107.85, 21.2], [98.3, 7.85, 98.75, 8.45], [119.15, 10.85, 119.65, 11.45], [110.05, 24.55, 110.65, 25.45], [105.85, 20.15, 106.05, 20.35]]; // (Ha Long Bay, Phang Nga Bay, El Nido, Guilin, Tràng An)
  function inKarst(x, y) { for (var i = 0; i < KARST.length; i++) { var k = KARST[i]; if (x > k[0] && x < k[2] && y > k[1] && y < k[3]) return true; } return false; }
  function farCon() { return merged([[trunk(0.25), TRUNK], [new T.ConeGeometry(0.34, 0.8, 5).translate(0, 0.62, 0), '#ffffff']]); }
  function farBall() { return merged([[trunk(0.35), TRUNK], [new T.IcosahedronGeometry(0.36, 0).scale(1, 0.85, 1).translate(0, 0.62, 0), '#ffffff']]); }
  var VEG = { fc: [farCon()], fb: [farBall()], con: [0, 1, 2, 3].map(function (v) { return conV(v); }), snow: [4, 5].map(function (v) { return conV(v, true); }), br: [0, 1, 2].map(broadV), rd: [0, 1].map(roundV), palm: [0, 1].map(palmV), ac: [0, 1].map(acaciaV), ca: [0, 1, 2, 3].map(cactusV), rk: [0, 1, 2, 3].map(rockV), sh: [0, 1].map(shrubV), ka: [0, 1, 2].map(karstV) };
  var V2 = {}; Object.keys(VEG).forEach(function (k) { VEG[k].forEach(function (g, i) { V2[k + i] = { geo: g, max: k === 'fc' || k === 'fb' ? 9000 : k === 'con' || k === 'br' || k === 'rd' ? 3200 : k === 'rk' ? 1400 : k === 'ka' ? 500 : 900 }; }); });
  var S = { con: kind(conifer, 5000), br: kind(broad, 5000), ac: kind(acacia, 1200), ca: kind(cactus, 1500), rk: kind(rock, 2000), ho: kind(house, 3500), ho2: kind(house2, 1500), hoF: kind(houseF, 1500), tw: kind(tower, 300), cl: kind(puff, 1400, cloudMat) };
  Object.keys(V2).forEach(function (k) { S['v_' + k] = kind(V2[k].geo, V2[k].max); }); Object.keys(S).forEach(function (k) { S[k].name = k; });
  var mtx = new T.Matrix4(), q = new T.Quaternion(), q2 = new T.Quaternion(), sc = new T.Vector3(), up = new T.Vector3(0, 1, 0), pv = new T.Vector3(), col2 = new T.Color();
  function put(m, lon, lat, size, yaw, colHex, lift, sx) {
    if (m.count >= m.instanceMatrix.count) return;
    var n = ll2v(lon, lat, 1); q.setFromUnitVectors(up, n); q2.setFromAxisAngle(up, yaw); q.multiply(q2);
    pv.copy(n).multiplyScalar(1 + W.groundH(lon, lat) + (lift || 0)); sc.set(size * (sx || 1), size, size * (sx || 1));
    mtx.compose(pv, q, sc); m.setMatrixAt(m.count, mtx); m.setColorAt(m.count, col2.set(colHex)); m.count++;
  }
  var last = null, TREECOL = { 4: ['#3f8f45', '#4f9a50', '#2f7a3f', '#5aa65a'], 5: ['#4f9a4a', '#6aa84f', '#3f8a48', '#7fb35a'], 6: ['#2f6b3a', '#3a7a44', '#4a8a50'], 7: ['#6aa84f', '#7fb35a', '#5f9f4b'] };
  var TOWNS = []; (function () { var L = window.LIGHTS || []; for (var i = 0; i < L.length; i += 3) TOWNS.push([L[i] / 10, L[i + 1] / 10, L[i + 2]]); })();
  W.scatter = function (lon, lat, alt, opt) { opt = opt || {};
    var on = alt < 0.95;
    if (!on) { if (last) { for (var k in S) S[k].count = 0; last = null; } return false; }
    var R = opt.R || Math.max(2.5, Math.min(26, alt * 48));
    if (last && last.R === R && Math.abs(((lon - last.lon + 540) % 360) - 180) * Math.cos(lat * D2R) < last.R * 0.25 && Math.abs(lat - last.lat) < last.R * 0.25 && alt / last.alt < 1.35 && alt / last.alt > 0.74) return false;
    last = { lon: lon, lat: lat, alt: alt, R: R };
    for (var k2 in S) S[k2].count = 0;
    var kc = Math.cos(lat * D2R) || 0.1, clear = opt.clear || (opt.size || 0.002) * 1.8 / D2R, avoid = opt.avoid ? opt.avoid.filter(function (q0) { return Math.abs(q0[1] - lat) < R + 1 && Math.abs(((q0[0] - lon + 540) % 360) - 180) * kc < R + 1; }) : null;
    function blocked(x, y, sc) { if (!avoid) return false; var cl = clear * (sc || 1); for (var a = 0; a < avoid.length; a++) { var q0 = avoid[a]; if (Math.abs(q0[0] - x) * kc < cl && Math.abs(q0[1] - y) < cl) return true; } return false; }
    var size = opt.size || Math.max(0.0011, Math.min(0.0075, alt * 0.0105)), cell = R / 40;
    var i0 = Math.floor((lon - R / kc) / cell), i1 = Math.ceil((lon + R / kc) / cell), j0 = Math.floor((lat - R) / cell), j1 = Math.ceil((lat + R) / cell);
    if (opt.ride) { rideVeg(lon, lat, R, opt, blocked); i1 = i0 - 1; } // (riding: the dense forests below instead of the light globe scatter)
    for (var i = i0; i <= i1; i++) for (var j = j0; j <= j1; j++) {
      for (var s = 0; s < 2; s++) {
        var h1 = hash(i * 3 + s, j), h2 = hash(j * 7 + s, i + 13), x = (i + h1) * cell, y = (j + h2) * cell;
        if (y > 84 || y < -84) continue;
        var dx = (((x - lon + 540) % 360) - 180) * kc, dy = y - lat; if (dx * dx + dy * dy > R * R) continue;
        var lx = ((x + 540) % 360) - 180; if (!isLand(lx, y)) continue;
        if (blocked(lx, y)) continue;
        var b = bFast(lx, y), p = hash(i + s * 31, j * 5 + 1), yaw = h1 * 6.28, sz = size * (0.75 + h2 * 0.6);
        if (b === B.rain && p < 0.95) put(S.br, lx, y, sz * 1.1, yaw, TREECOL[4][(s + i) % 4]);
        else if (b === B.taiga && p < 0.85) put(S.con, lx, y, sz, yaw, TREECOL[6][(s + j) % 3]);
        else if (b === B.forest && p < 0.75) put(p < 0.4 ? S.con : S.br, lx, y, sz, yaw, TREECOL[5][(s + i + j) % 4]);
        else if (b === B.grass && p < 0.06) put(S.br, lx, y, sz * 0.9, yaw, TREECOL[7][(i + j) % 3]);
        else if (b === B.savanna && p < 0.1) put(S.ac, lx, y, sz, yaw, '#7f9a3a');
        else if (b === B.desert && p < 0.07) { if (lx < -30 || (lx > -10 && lx < 0 && y > 27)) put(S.ca, lx, y, sz * 0.8, yaw, '#4f8a45'); else put(S.rk, lx, y, sz * 1.2, yaw, '#c9a46a'); }
        else if (b === B.tundra && p < 0.05) put(S.rk, lx, y, sz, yaw, '#9a9a8e');
      }
    }
    // towns: little houses around every town over 25,000 people, towers in big cities
    var HC = ['#f4efe4', '#efe2c8', '#e8e8ec', '#f2d9b8'], R2 = R * R;
    for (var t = 0; t < TOWNS.length; t++) {
      var tn = TOWNS[t], ddx = (((tn[0] - lon + 540) % 360) - 180) * kc, ddy = tn[1] - lat; if (ddx * ddx + ddy * ddy > R2 * (opt.ride ? 0.3 : 1)) continue; if (opt.ride && tn[2] < 3) continue; // (riding: villages near the line only — far ones are hidden by the trees and haze anyway) // (riding: only real towns, not a house in every field)
      var nh = Math.min(opt.ride ? 12 : 30, 3 + tn[2] * 3), rad = size * (0.5 + tn[2] * 0.22) / 0.0175;
      if (opt.ride && S.ho.count + S.ho2.count + S.hoF.count > 1100) break; var tb = bFast(tn[0], tn[1]), dry = tb === B.desert || tb === B.savanna, DC = ['#f6f1e6', '#efe0c2', '#f3e9d8', '#e6d3b0'];
      for (var hI = 0; hI < nh; hI++) { var a = hash(t, hI) * 6.28, rr = Math.sqrt(hash(hI, t + 3)) * rad, hx = tn[0] + Math.cos(a) * rr / Math.max(0.2, Math.cos(tn[1] * D2R)), hy = tn[1] + Math.sin(a) * rr; if (!isLand(hx, hy) || blocked(hx, hy)) continue;
        var hv = hash(hI * 1.3, t * 0.7), hm = !opt.ride ? S.ho : dry ? (hv < 0.8 ? S.hoF : S.ho) : (hv < 0.62 ? S.ho : S.ho2); // (riding: cottages and two-storey houses; flat roofs where it is hot and dry)
        put(hm, hx, hy, size * (opt.ride ? 0.2 : 0.5) * (0.85 + 0.3 * hash(hI, t * 1.9)), a, dry ? DC[hI % 4] : HC[hI % 4]); }
      if (tn[2] >= 9 && !opt.ride) for (var k3 = 0; k3 < 7; k3++) { var a2 = hash(k3, t + 7) * 6.28, r2 = hash(t + 1, k3) * rad * 0.35, tx = tn[0] + Math.cos(a2) * r2 / Math.max(0.2, Math.cos(tn[1] * D2R)), ty = tn[1] + Math.sin(a2) * r2; if (blocked(tx, ty)) continue; put(S.tw, tx, ty, size * 0.45, a2, k3 % 3 ? '#a9c3db' : '#d9dfe6', 0, 1); S.tw.count && S.tw.setMatrixAt(S.tw.count - 1, mtx.compose(pv, q, sc.set(size * 0.75, size * (1.0 + hash(k3, t) * 1.4), size * 0.75))); }
    }
    // clouds: puffy groups, mostly away from the middle of the view so they sit at the horizon
    var cR = opt.cloud ? R * 5 : R * 2.6, cIn = opt.cloud ? R * 1.6 : R * 0.8, ccell = Math.max(0.5, R / 6);
    for (var ci = Math.floor((lon - cR / kc) / ccell); ci <= Math.ceil((lon + cR / kc) / ccell); ci++) for (var cj = Math.floor((lat - cR) / ccell); cj <= Math.ceil((lat + cR) / ccell); cj++) {
      if (hash(ci * 1.7, cj * 2.3) > (opt.cloud ? 0.09 : 0.42)) continue;
      var cx = (ci + hash(ci, cj + 5)) * ccell, cy = (cj + hash(cj, ci + 9)) * ccell, cdx = (((cx - lon + 540) % 360) - 180) * kc, cdy = cy - lat, cd = Math.hypot(cdx, cdy);
      if (cd > cR || cd < cIn || cy > 80 || cy < -80) continue;
      var cl = ((cx + 540) % 360) - 180, cs = opt.cloud ? opt.cloud * (0.9 + hash(ci, cj) * 0.9) : size * (1.4 + hash(ci, cj) * 1.4), np = 3 + Math.floor(hash(cj, ci) * 4);
      for (var pI = 0; pI < np; pI++) {
        var px = cl + (pI - np / 2) * cs * 50 * (0.7 + hash(pI, ci) * 0.5) / Math.max(0.3, Math.cos(cy * D2R)), py = cy + (hash(pI, cj) - 0.5) * cs * 30, pr = cs * (0.7 + hash(pI + 3, ci) * 0.8) * (opt.cloud ? 0.6 : 1);
        if (S.cl.count >= (opt.ride ? 650 : 1400)) break;
        var n2 = ll2v(px, py, 1); pv.copy(n2).multiplyScalar(1 + (opt.cloud ? 0.026 + cs * 1.2 : 0.006 + cs * 1.5) + hash(pI, cj + 1) * cs * 0.5); q.setFromUnitVectors(up, n2); sc.set(pr * 1.4, pr * (0.8 + hash(pI, 2) * 0.5), pr);
        mtx.compose(pv, q, sc); S.cl.setMatrixAt(S.cl.count, mtx); S.cl.setColorAt(S.cl.count, col2.set('#ffffff')); S.cl.count++;
      }
    }
    for (var k4 in S) { S[k4].instanceMatrix.needsUpdate = true; if (S[k4].instanceColor) S[k4].instanceColor.needsUpdate = true; }
    return true;
  };
  // Riding: one tree (or rock, or cactus) per 0.1° cell where the land allows, fixed per cell (moving on never reshuffles them), thinned by a
  // patchy noise so forests come in clumps and clearings; nothing on the roads or on a landmark's flat ground; shrinking away at the edge.
  var GC = new T.Color(), GREENS = { con: ['#2f7a45', '#2a6e40', '#3a8a50', '#286a3c'], br: ['#43a03a', '#3a9032', '#52ad3a', '#3f9440'], rd: ['#6aaa48', '#5ea040', '#7cb84a', '#70ad50'], palm: ['#3f9a4a', '#4aa84f'], ac: ['#7f9a3a', '#8aa548'], sh: ['#7a8a48', '#8a9a52', '#6f7f44'] };
  function clump(lon, lat, salt) { var a = noise(lon * 1.3 + salt, lat * 1.3 - salt), b = noise(lon * 4.1 - salt, lat * 4.1 + salt); var t = Math.max(0, Math.min(1, (a - 0.35) / 0.45)); return t * t * (3 - 2 * t) * (0.4 + 0.6 * b); }
  function rideVeg(lon, lat, R, opt, blocked) {
    var cell = opt.cell || 0.1, kc = Math.max(0.05, Math.cos(lat * D2R)), size = opt.size || 0.0022, pads = (W.pads || []).filter(function (p) { return Math.abs(p[1] - lat) < R + 1 && Math.abs(((p[0] - lon + 540) % 360) - 180) * kc < R + 1; });
    var i0 = Math.floor((lon - R / kc) / cell), i1 = Math.ceil((lon + R / kc) / cell), j0 = Math.floor((lat - R) / cell), j1 = Math.ceil((lat + R) / cell);
    function vput(key, x, y, sz, yaw, hex, sxz, tilt) { var m = S['v_' + key]; if (!m) return; put(m, x, y, sz, yaw, hex, -sz * 0.04, sxz); if (tilt) { /* (a slight lean) */ } }
    for (var i = i0; i <= i1; i++) for (var j = j0; j <= j1; j++) {
      var h1 = hash(i * 1.37, j * 0.91), h2 = hash(j * 2.11 + 3, i * 0.53), x = (i + 0.15 + 0.7 * h1) * cell, y = (j + 0.15 + 0.7 * h2) * cell;
      if (y > 84 || y < -84) continue;
      var dx = (((x - lon + 540) % 360) - 180) * kc, dy = y - lat, d = Math.sqrt(dx * dx + dy * dy); if (d > R) continue;
      var lx = ((x + 540) % 360) - 180;
      if (inKarst(lx, y)) { // limestone towers standing out of the sea (or the rice fields round Guilin)
        if (!blocked(lx, y, 2) && hash(i * 0.37, j * 0.59) < 0.6) { var kz = size * (1.1 + 1.3 * hash(i * 1.9, j * 2.3)); vput('ka' + (i % 3 + 3) % 3, lx, y, kz, h1 * 6.28, '#ffffff', 0.55 + 0.35 * h2); if (hash(i, j * 1.3) < 0.5) vput('ka' + ((i + 1) % 3 + 3) % 3, lx + (h2 - 0.5) * cell * 0.7 / kc, y + (h1 - 0.5) * cell * 0.7, kz * 0.65, h2 * 6.28, '#ffffff', 0.6); }
        if (!isLand(lx, y) || landF(lx, y) < 0.7) continue;
      }
      if (!isLand(lx, y) || landF(lx, y) < 0.7) continue;
      if (blocked(lx, y)) continue;
      var onPad = false; for (var pI = 0; pI < pads.length; pI++) { var pp = pads[pI], pdx = (((pp[0] - lx + 540) % 360) - 180) * Math.cos(y * D2R), pdy = pp[1] - y, pr = 0.5 * (1 + 0.25 * Math.sin(Math.atan2(pdy, pdx) * 3 + pI)); if (pdx * pdx + pdy * pdy < pr * pr) { onPad = true; break; } }
      if (onPad) continue;
      if (ELEV && elevM(lx, y) > snowAt(y) - 900) { if (hash(i * 0.3, j * 0.7) < 0.05) vput('rk' + (i & 3), lx, y, (opt.size || 0.0022) * 0.5, h1 * 6.28, '#9a948a'); continue; } // (above the tree line: bare, a boulder here and there)
      var b = bFast(lx, y), p = hash(i * 0.71 + 11, j * 1.29 + 5), c = clump(lx, y, 3.1), r3 = hash(i + 0.5, j * 3.1 + 7), yaw = h1 * 6.28, edge = Math.min(1, (R - d) / (R * 0.18)), sz = size * (0.75 + 0.55 * h2) * edge * edge * (3 - 2 * edge), al = Math.abs(y);
      var gi = Math.floor(r3 * 4);
      var two = c > 0.45 && hash(i * 2.3, j * 1.7) < 0.7, sx2 = (hash(i + 9, j) - 0.5) * cell * 0.8 / kc, sy2 = (hash(j + 9, i) - 0.5) * cell * 0.8;
      if (b === B.rain) { if (p > 0.78 + 0.22 * c) continue; if (two) vput('br' + ((gi + 1) % 3), lx + sx2, y + sy2, sz * 1.05, yaw + 1, GREENS.br[(gi + 1) % 4]); if (r3 < 0.14) vput('palm' + (gi % 2), lx, y, sz * 1.15, yaw, GREENS.palm[gi % 2]); else vput(r3 < 0.6 ? 'br' + (gi % 3) : 'rd' + (gi % 2), lx, y, sz * 1.15, yaw, GREENS.br[gi]); }
      else if (b === B.forest) { if (p > 0.5 + 0.48 * c) continue; var s3 = hash(i * 0.13, j * 0.07); if (two) vput(s3 < 0.5 ? 'con' + ((gi + 1) % 4) : 'rd' + ((gi + 1) % 2), lx + sx2, y + sy2, sz * 0.9, yaw + 1, s3 < 0.5 ? GREENS.con[(gi + 1) % 4] : GREENS.rd[(gi + 1) % 4]); if (s3 < 0.4) vput('con' + gi, lx, y, sz, yaw, GREENS.con[gi], 0.85 + 0.3 * h1); else if (s3 < 0.7) vput('br' + (gi % 3), lx, y, sz, yaw, GREENS.br[gi]); else vput('rd' + (gi % 2), lx, y, sz, yaw, GREENS.rd[gi]); }
      else if (b === B.taiga) { if (p > 0.55 + 0.43 * c) continue; if (two) vput('con' + ((gi + 2) % 4), lx + sx2, y + sy2, sz * 0.85, yaw + 2, GREENS.con[(gi + 2) % 4], 0.9); if (al > 56 && r3 < 0.5) vput('snow' + (gi % 2), lx, y, sz, yaw, '#ffffff', 0.85 + 0.3 * h1); else vput('con' + gi, lx, y, sz, yaw, GREENS.con[gi], 0.85 + 0.3 * h1); }
      else if (b === B.grass) { if (p > 0.06 + 0.45 * c * c) continue; if (r3 < 0.25 && al > 35) vput('con' + gi, lx, y, sz, yaw, GREENS.con[gi]); else vput('rd' + (gi % 2), lx, y, sz * 0.95, yaw, GREENS.rd[gi]); }
      else if (b === B.savanna) { if (p > 0.07 + 0.16 * c) continue; if (r3 < 0.55) vput('ac' + (gi % 2), lx, y, sz * 1.1, yaw, GREENS.ac[gi % 2], 1.15); else vput('sh' + (gi % 2), lx, y, sz * 0.6, yaw, GREENS.sh[gi % 3]); }
      else if (b === B.desert) { if (p > 0.05 + 0.2 * c) continue; var amer = lx < -30, sand = '#c9a46a'; GC.set(BCOL[B.desert]).multiplyScalar(0.78 + 0.2 * h1);
        if (amer && r3 < 0.35) vput('ca' + gi, lx, y, sz * 0.75, yaw, '#5a8a46');
        else if (r3 < 0.2) vput('sh' + (gi % 2), lx, y, sz * 0.45, yaw, '#8a8a52');
        else for (var k = 0, nk = 1 + Math.floor(hash(i, j + 0.3) * 3); k < nk; k++) vput('rk' + ((gi + k) % 4), lx + (k ? (hash(i + k, j) - 0.5) * cell * 0.6 / kc : 0), y + (k ? (hash(j + k, i) - 0.5) * cell * 0.6 : 0), sz * (0.35 + 0.4 * hash(k, i + j)) * (k ? 0.6 : 1), yaw + k, '#' + GC.getHexString()); }
      else if (b === B.tundra) { if (p > 0.04 + 0.12 * c) continue; if (r3 < 0.4) vput('snow' + (gi % 2), lx, y, sz * 0.8, yaw, '#ffffff'); else vput('rk' + gi, lx, y, sz * 0.4, yaw, '#9a9a8e'); }
    }
    // the far ring, out to the horizon: simpler trees on a coarser grid, so forests carry on into the distance instead of stopping
    var R2 = R * 2.3, fcell = cell * 2, fi0 = Math.floor((lon - R2 / kc) / fcell), fi1 = Math.ceil((lon + R2 / kc) / fcell), fj0 = Math.floor((lat - R2) / fcell), fj1 = Math.ceil((lat + R2) / fcell);
    for (var fi = fi0; fi <= fi1; fi++) for (var fj = fj0; fj <= fj1; fj++) {
      var fx = (fi + 0.5 + 0.6 * (hash(fi * 3.1, fj) - 0.5)) * fcell, fy = (fj + 0.5 + 0.6 * (hash(fj * 2.7, fi) - 0.5)) * fcell; if (fy > 84 || fy < -84) continue;
      var fdx = (((fx - lon + 540) % 360) - 180) * kc, fdy = fy - lat, fd = Math.sqrt(fdx * fdx + fdy * fdy); if (fd > R2 || fd < R * 0.92) continue;
      var flx = ((fx + 540) % 360) - 180; if (!isLand(flx, fy) || landF(flx, fy) < 0.7 || blocked(flx, fy)) continue;
      var fb2 = bFast(flx, fy), fc = clump(flx, fy, 3.1), fp = hash(fi * 0.71 + 11, fj * 1.29 + 5), fe = Math.min(1, (R2 - fd) / (R2 * 0.12)), fs = (opt.size || 0.0022) * 1.45 * fe;
      if (ELEV && elevM(flx, fy) > snowAt(fy) - 900) continue;
      if (fb2 === B.rain && fp < 0.85) vput('fb0', flx, fy, fs * 1.1, fp * 9, GREENS.br[fi & 3]);
      else if (fb2 === B.forest && fp < 0.55 + 0.4 * fc) vput(fp < 0.45 ? 'fc0' : 'fb0', flx, fy, fs, fp * 9, fp < 0.45 ? GREENS.con[fi & 3] : GREENS.rd[fj & 3]);
      else if (fb2 === B.taiga && fp < 0.6 + 0.35 * fc) vput('fc0', flx, fy, fs, fp * 9, GREENS.con[fj & 3]);
      else if (fb2 === B.grass && fp < 0.05 + 0.35 * fc * fc) vput('fb0', flx, fy, fs * 0.9, fp * 9, GREENS.rd[fi & 3]);
    }
  }
  W.counts = function () { var o = {}; for (var k in S) o[k] = S[k].count; return o; };
  W.setScenery = function (on) { for (var k in S) S[k].visible = on; };
  return W;
};
