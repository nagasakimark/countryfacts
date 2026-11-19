/* せかいたんけん world: raised 3D land, natural colours up close, ocean, borders, roads and rails,
   plus scenery scattered around wherever you are looking (trees, towns, desert rocks, clouds).
   Everything is built once or rebuilt rarely; scenery uses instancing (one draw call per kind). */
window.makeWorld = function (env) {
  var T = THREE, K = MODELS.kit, noise = K.noise, hash = K.hash, D2R = Math.PI / 180, scene = env.scene, ll2v = env.ll2v, feat = env.feat;
  var W = {};

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
  W.groundH = function (lon, lat) { return isLand(lon, lat) ? hFast(lon, lat) : 0; };

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
  var U = W.uniforms = { uNear: { value: 0 }, uSel: { value: -9 }, uRelief: { value: null }, uSat: { value: null }, uShade: { value: 0 } };
  var tl = new T.TextureLoader();
  tl.load('data/relief.png', function (t) { t.wrapS = T.RepeatWrapping; t.minFilter = T.LinearFilter; t.generateMipmaps = false; U.uRelief.value = t; U.uShade.value = 1; if (W.onReady) W.onReady(); });
  tl.load('data/earth.jpg', function (t) { t.colorSpace = T.SRGBColorSpace; t.wrapS = T.RepeatWrapping; U.uSat.value = t; if (W.onReady) W.onReady(); });
  var landMat = new T.MeshLambertMaterial({ vertexColors: true });
  landMat.userData.preKey = 'land'; landMat.userData.pre = function (sh) {
    for (var k in U) sh.uniforms[k] = U[k];
    sh.vertexShader = 'attribute vec3 bcol; attribute float cid; uniform float uNear; uniform float uSel; varying vec3 vLN; varying float vTop;\n' + sh.vertexShader.replace('#include <color_vertex>',
      '#include <color_vertex>\n  vLN = normalize(position); vTop = cid < -0.5 ? 0.0 : 1.0;\n  vColor.rgb = mix(vColor.rgb, bcol, uNear);\n  if (abs(cid - uSel) < 0.5) vColor.rgb = mix(vColor.rgb, vec3(1.0, 0.93, 0.78), 0.55);');
    sh.fragmentShader = 'uniform sampler2D uRelief; uniform sampler2D uSat; uniform float uNear; uniform float uShade; varying vec3 vLN; varying float vTop;\n' +
      'vec2 llUV(vec3 n){ return vec2(atan(-n.z, n.x) * 0.15915494 + 0.5, asin(clamp(n.y, -1.0, 1.0)) * 0.31830989 + 0.5); }\n' +
      sh.fragmentShader.replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' +
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
      var c = document.createElement('canvas'); c.width = 16; c.height = 64; var x = c.getContext('2d');
      if (kind === 'road') { x.fillStyle = '#4c4f58'; x.fillRect(0, 0, 16, 64); x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, 1.5, 64); x.fillRect(14.5, 0, 1.5, 64); x.fillStyle = '#ffd54a'; x.fillRect(7, 0, 2, 32); }
      else { x.fillStyle = '#6b5a48'; x.fillRect(0, 0, 16, 64); for (var y = 0; y < 64; y += 8) { x.fillStyle = '#4a3b2e'; x.fillRect(1, y, 14, 3); } x.fillStyle = '#c9ccd2'; x.fillRect(4, 0, 1.5, 64); x.fillRect(10.5, 0, 1.5, 64); }
      var t = new T.CanvasTexture(c); t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
    }
    var roadM = new T.MeshLambertMaterial({ map: stripTex('road') }), railM = new T.MeshLambertMaterial({ map: stripTex('rail') }), lanes = [];
    env.nightify(roadM, true); env.nightify(railM, true);
    env.routes.forEach(function (r) {
      if (r.type === 'plane') return;
      if (r.type === 'ship') { r.pts.forEach(function (p, i) { if (i) { var a = r.pts[i - 1]; ll2v(a[0], a[1], 1.0006, v); lanes.push(v.x, v.y, v.z); ll2v(p[0], p[1], 1.0006, v); lanes.push(v.x, v.y, v.z); } }); return; }
      var pts = [], P = [], Uv = [], ix = [], dist = 0, wd = r.type === 'car' ? 0.0011 : 0.0009;
      for (var i = 0; i < r.pts.length - 1; i++) { var a = r.pts[i], b = r.pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.12)); for (var k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); }
      pts.push(r.pts[r.pts.length - 1]);
      var prev = null;
      pts.forEach(function (p, i) {
        var q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)], n = ll2v(p[0], p[1], 1), t = ll2v(q[0], q[1], 1).sub(ll2v(o[0], o[1], 1)).normalize(), s = new T.Vector3().crossVectors(n, t).normalize();
        var c = n.clone().multiplyScalar(1 + W.groundH(p[0], p[1]) + 0.00035);
        if (prev) dist += c.distanceTo(prev); prev = c;
        P.push(c.x + s.x * wd, c.y + s.y * wd, c.z + s.z * wd, c.x - s.x * wd, c.y - s.y * wd, c.z - s.z * wd); Uv.push(0, dist / 0.006, 1, dist / 0.006);
        if (i) { var b0 = (i - 1) * 2; ix.push(b0, b0 + 1, b0 + 2, b0 + 1, b0 + 3, b0 + 2); }
      });
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(Uv, 2)); g.setIndex(ix); g.computeVertexNormals();
      var m = new T.Mesh(g, r.type === 'car' ? roadM : railM); m.material.side = T.DoubleSide; scene.add(m);
    });
    var lg2 = new T.BufferGeometry(); lg2.setAttribute('position', new T.Float32BufferAttribute(lanes, 3));
    var lm = new T.LineDashedMaterial({ color: 0xcfefff, dashSize: 0.006, gapSize: 0.006, transparent: true, opacity: 0.6 }), ls = new T.LineSegments(lg2, lm); ls.computeLineDistances(); scene.add(ls);
  })();

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
  var house = merged([[new T.BoxGeometry(0.7, 0.5, 0.55).translate(0, 0.25, 0), '#ffffff'], [new T.ConeGeometry(0.55, 0.32, 4, 1, true).rotateY(Math.PI / 4).scale(1, 1, 0.8).translate(0, 0.66, 0), '#c0533a'], [new T.PlaneGeometry(0.14, 0.2).translate(0, 0.1, 0.2755), '#5a4636']]);
  var tower = merged([[new T.BoxGeometry(0.5, 1, 0.5).translate(0, 0.5, 0), '#ffffff'], [new T.BoxGeometry(0.52, 0.04, 0.52).translate(0, 1.0, 0), '#d9dde3']]);
  var rock = new T.IcosahedronGeometry(0.4, 0).scale(1, 0.55, 0.8).translate(0, 0.12, 0); rock = merged([[rock, '#ffffff']]);
  var puff = new T.IcosahedronGeometry(1, 1);
  var cloudMat = new T.MeshLambertMaterial({ color: 0xf6f1f8, flatShading: true, emissive: 0x3a3450 }); env.nightify(cloudMat, false);
  var S = { con: kind(conifer, 5000), br: kind(broad, 5000), ac: kind(acacia, 1200), ca: kind(cactus, 1500), rk: kind(rock, 2000), ho: kind(house, 3500), tw: kind(tower, 300), cl: kind(puff, 1400, cloudMat) };
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
    var kc = Math.cos(lat * D2R) || 0.1, clear = (opt.size || 0.002) * 1.8 / D2R, avoid = opt.avoid ? opt.avoid.filter(function (q0) { return Math.abs(q0[1] - lat) < R + 1 && Math.abs(((q0[0] - lon + 540) % 360) - 180) * kc < R + 1; }) : null;
    function blocked(x, y) { if (!avoid) return false; for (var a = 0; a < avoid.length; a++) { var q0 = avoid[a]; if (Math.abs(q0[0] - x) * kc < clear && Math.abs(q0[1] - y) < clear) return true; } return false; }
    var size = opt.size || Math.max(0.0011, Math.min(0.0075, alt * 0.0105)), cell = R / 40;
    var i0 = Math.floor((lon - R / kc) / cell), i1 = Math.ceil((lon + R / kc) / cell), j0 = Math.floor((lat - R) / cell), j1 = Math.ceil((lat + R) / cell);
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
      var tn = TOWNS[t], ddx = (((tn[0] - lon + 540) % 360) - 180) * kc, ddy = tn[1] - lat; if (ddx * ddx + ddy * ddy > R2) continue;
      var nh = Math.min(30, 3 + tn[2] * 3), rad = size * (0.5 + tn[2] * 0.22) / 0.0175;
      for (var hI = 0; hI < nh; hI++) { var a = hash(t, hI) * 6.28, rr = Math.sqrt(hash(hI, t + 3)) * rad, hx = tn[0] + Math.cos(a) * rr / Math.max(0.2, Math.cos(tn[1] * D2R)), hy = tn[1] + Math.sin(a) * rr; if (!isLand(hx, hy) || blocked(hx, hy)) continue; put(S.ho, hx, hy, size * 0.5, a, HC[hI % 4]); }
      if (tn[2] >= 9) for (var k3 = 0; k3 < 7; k3++) { var a2 = hash(k3, t + 7) * 6.28, r2 = hash(t + 1, k3) * rad * 0.35, tx = tn[0] + Math.cos(a2) * r2 / Math.max(0.2, Math.cos(tn[1] * D2R)), ty = tn[1] + Math.sin(a2) * r2; put(S.tw, tx, ty, size * 0.45, a2, k3 % 3 ? '#a9c3db' : '#d9dfe6', 0, 1); S.tw.count && S.tw.setMatrixAt(S.tw.count - 1, mtx.compose(pv, q, sc.set(size * 0.75, size * (1.0 + hash(k3, t) * 1.4), size * 0.75))); }
    }
    // clouds: puffy groups, mostly away from the middle of the view so they sit at the horizon
    var cR = opt.cloud ? R * 5 : R * 2.6, cIn = opt.cloud ? R * 1.6 : R * 0.8, ccell = Math.max(0.5, R / 6);
    for (var ci = Math.floor((lon - cR / kc) / ccell); ci <= Math.ceil((lon + cR / kc) / ccell); ci++) for (var cj = Math.floor((lat - cR) / ccell); cj <= Math.ceil((lat + cR) / ccell); cj++) {
      if (hash(ci * 1.7, cj * 2.3) > (opt.cloud ? 0.24 : 0.42)) continue;
      var cx = (ci + hash(ci, cj + 5)) * ccell, cy = (cj + hash(cj, ci + 9)) * ccell, cdx = (((cx - lon + 540) % 360) - 180) * kc, cdy = cy - lat, cd = Math.hypot(cdx, cdy);
      if (cd > cR || cd < cIn || cy > 80 || cy < -80) continue;
      var cl = ((cx + 540) % 360) - 180, cs = opt.cloud ? opt.cloud * (0.9 + hash(ci, cj) * 0.9) : size * (1.4 + hash(ci, cj) * 1.4), np = 3 + Math.floor(hash(cj, ci) * 4);
      for (var pI = 0; pI < np; pI++) {
        var px = cl + (pI - np / 2) * cs * 50 * (0.7 + hash(pI, ci) * 0.5) / Math.max(0.3, Math.cos(cy * D2R)), py = cy + (hash(pI, cj) - 0.5) * cs * 30, pr = cs * (0.7 + hash(pI + 3, ci) * 0.8) * (opt.cloud ? 0.6 : 1);
        if (S.cl.count >= 1400) break;
        var n2 = ll2v(px, py, 1); pv.copy(n2).multiplyScalar(1 + (opt.cloud ? 0.012 + cs * 0.8 : 0.006 + cs * 1.5) + hash(pI, cj + 1) * cs * 0.5); q.setFromUnitVectors(up, n2); sc.set(pr * 1.4, pr * (0.8 + hash(pI, 2) * 0.5), pr);
        mtx.compose(pv, q, sc); S.cl.setMatrixAt(S.cl.count, mtx); S.cl.setColorAt(S.cl.count, col2.set('#ffffff')); S.cl.count++;
      }
    }
    for (var k4 in S) { S[k4].instanceMatrix.needsUpdate = true; if (S[k4].instanceColor) S[k4].instanceColor.needsUpdate = true; }
    return true;
  };
  W.counts = function () { var o = {}; for (var k in S) o[k] = S[k].count; return o; };
  W.setScenery = function (on) { for (var k in S) S[k].visible = on; };
  return W;
};
