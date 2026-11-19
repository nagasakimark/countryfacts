/* せかいたんけん 3D globe: Three.js sphere with a painted map texture (borders never disappear),
   a sharper "detail" patch when zoomed in, low-poly landmarks, moving vehicles and a 2D label layer.
   UI code talks to it through window.Globe (see the API at the bottom). */
(function () {
  var T = window.THREE, G = window.Globe = {};
  var W = 1366, H = 598, D2R = Math.PI / 180, FOV = 40, PPR = (H / 2) / Math.tan(FOV / 2 * D2R);
  var $ = function (s) { return document.querySelector(s); };
  var byId = App.byId;
  G.lang = 'ja'; G.speed = 1; G.quiz = false; G.stampsOf = function () { return {}; }; G.stampN = function () { return 0; }; G.collected = function () { return false; };
  G.onPick = function () { }; G.onHover = function () { }; G.onRide = function () { }; G.onArrive = function () { }; G.onTap = null;

  function ll2v(lon, lat, r, out) { var la = lat * D2R, lo = lon * D2R, c = Math.cos(la); r = r || 1; return (out || new T.Vector3()).set(c * Math.cos(lo) * r, Math.sin(la) * r, -c * Math.sin(lo) * r); }
  function v2ll(v) { var n = v.clone().normalize(); return [Math.atan2(-n.z, n.x) / D2R, Math.asin(Math.max(-1, Math.min(1, n.y))) / D2R]; }
  G.ll2v = ll2v;
  function plain(s) { return (s || '').replace(/\{([^{}|]+)\|[^{}]+\}/g, '$1').replace(/\(せつ\)/g, ''); }
  G.plain = plain;

  /* ---------- countries ---------- */
  var COL = { 'アジア': '#ffd54a', 'ヨーロッパ': '#7db7ff', 'アフリカ': '#ff9a62', '北アメリカ': '#5fd08f', '南アメリカ': '#c39bff', 'オセアニア': '#4fd9cc' };
  function mix(a, b, t) { var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), r = function (s) { return Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t); }; return 'rgb(' + r(16) + ',' + r(8) + ',' + r(0) + ')'; }
  var INFO = function (id) { return id === 'JPN' ? window.JAPAN_FUN : window.FUN[id]; };
  var feat = App.features.filter(function (f) { return byId[f.properties.id]; });
  var CEN = {}, RAD = {}, AW = {}, FILL = {}, PRI = [], FEAT = {};
  feat.forEach(function (f) {
    var id = f.properties.id, c = byId[id], g = f.geometry, big = f; FEAT[id] = f;
    if (g.type === 'MultiPolygon') { var ba = 0; g.coordinates.forEach(function (co) { var pf = { type: 'Feature', geometry: { type: 'Polygon', coordinates: co } }, a = d3.geoArea(pf); if (a > ba) { ba = a; big = pf; } }); }
    var ctr = d3.geoCentroid(big); CEN[id] = ctr; var b = d3.geoBounds(f), r = 0;
    [[b[0][0], b[0][1]], [b[1][0], b[1][1]], [b[0][0], b[1][1]], [b[1][0], b[0][1]]].forEach(function (p) { r = Math.max(r, d3.geoDistance(ctr, p)); });
    if (b[0][0] > b[1][0]) r = Math.max(r, Math.PI / 2);
    RAD[id] = Math.min(Math.PI, r); AW[id] = Math.sqrt(d3.geoArea(big));
    var base = COL[c.region] || '#d9d2ef'; FILL[id] = id === 'ATA' ? '#f4f8fb' : (INFO(id) ? base : mix(base, '#ece8f6', 0.45));
    if (id !== 'ATA') PRI.push({ id: id, a: AW[id] });
  });
  PRI.sort(function (a, b) { return b.a - a.a; });
  (function colour() {
    var PAL = ['#f6dc45', '#bfe34f', '#f57ed8', '#ff6b5f', '#ffa04a', '#b58cf5', '#3fcca6', '#f2a0ff'];
    var geoms = WORLD_TOPO.objects.countries.geometries, nb = topojson.neighbors(geoms), idx = {};
    geoms.forEach(function (g, i) { idx[g.properties.id] = i; });
    var order = PRI.map(function (p) { return p.id; }), got = {};
    order.forEach(function (id) {
      var i = idx[id], used = {}; if (i == null) return;
      nb[i].forEach(function (j) { var o = geoms[j].properties.id; if (got[o]) used[got[o]] = 1; });
      var h = 0; for (var k = 0; k < id.length; k++) h = (h * 31 + id.charCodeAt(k)) % 997;
      for (var t = 0; t < PAL.length; t++) { var c = PAL[(h + t) % PAL.length]; if (!used[c]) { got[id] = c; break; } }
      FILL[id] = got[id] || PAL[h % PAL.length];
    });
    FILL.JPN = '#ff6b5f';
  })();
  G.CEN = CEN; G.FEAT = FEAT;
  CEN.USA = [-98.5, 39.5]; CEN.CAN = [-100, 57]; CEN.RUS = [95, 61]; CEN.FRA = [2.4, 46.6]; CEN.NOR = [9, 61.5]; CEN.CHL = [-71, -33];
  function countryAt(ll) { for (var j = 0; j < feat.length; j++) { var id = feat[j].properties.id; if (d3.geoDistance(CEN[id], ll) > RAD[id] + 0.6) continue; if (d3.geoContains(feat[j], ll)) return id; } return null; }
  G.countryAt = countryAt;

  /* ---------- routes ---------- */
  var ROUTES = (window.TOY && TOY.routes) || [];
  ROUTES.forEach(function (r) {
    var pts = [], cum = [0];
    for (var i = 0; i < r.p.length - 1; i++) {
      var a = r.p[i], b = r.p[i + 1], d = d3.geoDistance(a, b), n = Math.max(2, Math.ceil(d / D2R / 0.6)), ip = d3.geoInterpolate(a, b);
      for (var k = (i ? 1 : 0); k <= n; k++) pts.push(ip(k / n));
    }
    for (var j = 1; j < pts.length; j++) cum.push(cum[j - 1] + d3.geoDistance(pts[j - 1], pts[j]));
    r.pts = pts; r.cum = cum; r.len = cum[cum.length - 1]; r.km = Math.round(r.len * 6371);
    var km = r.km, dur = r.type === 'plane' ? 20 + km / 200 : r.type === 'ship' ? 35 + km / 250 : r.type === 'car' ? 30 + km / 100 : 22 + km / 150;
    r.dur = dur; r.d = Math.random() * r.len * 0.8; r.dir = 1; r.wait = 0;
  });
  function along(r, d) {
    var c = r.cum, lo = 0, hi = c.length - 1; d = Math.max(0, Math.min(r.len, d));
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (c[m] <= d) lo = m; else hi = m; }
    var seg = c[hi] - c[lo] || 1e-9, t = (d - c[lo]) / seg;
    var ips = r.ips || (r.ips = []), f = ips[lo] || (ips[lo] = d3.geoInterpolate(r.pts[lo], r.pts[hi]));
    return f(t);
  }
  G.routes = ROUTES;
  function densify(pts) { var out = []; for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.02)); for (var k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } out.push(pts[pts.length - 1]); return out; }

  /* ---------- three.js scene ---------- */
  var cv = $('#cv'), renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene(), camera = new T.PerspectiveCamera(FOV, W / H, 0.001, 20);
  var globe = new T.Mesh(new T.SphereGeometry(1, 96, 64), new T.MeshPhongMaterial({ color: 0xffffff, specular: 0x2a3a50, shininess: 28 }));
  scene.add(globe);
  var hemi = new T.HemisphereLight(0xfff8f0, 0x7a70b0, 1.35); scene.add(hemi);
  var sun = new T.DirectionalLight(0xfff4e0, 2.3); scene.add(sun); scene.add(sun.target);
  // atmosphere glow
  (function () {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 90, 128, 128, 128);
    g.addColorStop(0, 'rgba(140,210,255,.9)'); g.addColorStop(0.25, 'rgba(120,200,255,.35)'); g.addColorStop(1, 'rgba(120,200,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    var t = new T.CanvasTexture(c); var sp = new T.Sprite(new T.SpriteMaterial({ map: t, depthWrite: false, transparent: true }));
    sp.scale.set(2.95, 2.95, 1); sp.renderOrder = -1; scene.add(sp); G._glow = sp;
  })();

  /* ---------- day and night (real time) ---------- */
  var NIGHT = { uSun: { value: new T.Vector3(1, 0, 0) } };
  // Darken the side of the Earth where it is night now (ground = map, otherwise a model).
  function nightify(m, ground) {
    if (m.userData.night) return; m.userData.night = 1;
    m.onBeforeCompile = function (sh) {
      if (m.userData.pre) m.userData.pre(sh);
      sh.uniforms.uSun = NIGHT.uSun;
      sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n#ifdef USE_INSTANCING\n  vWP = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#else\n  vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#endif');
      sh.fragmentShader = 'varying vec3 vWP;\nuniform vec3 uSun;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n' +
        '  { float dd = dot(normalize(vWP), uSun); float day = smoothstep(-0.08, 0.12, dd);\n' +
        '    vec3 nc = gl_FragColor.rgb * ' + (ground ? 'vec3(0.15, 0.18, 0.4)' : 'vec3(0.3, 0.33, 0.58)') + ';\n' +
        '    gl_FragColor.rgb = mix(nc, gl_FragColor.rgb, day);\n    gl_FragColor.rgb += vec3(0.2, 0.08, 0.0) * (1.0 - smoothstep(0.0, 0.12, abs(dd))) * 0.45; }');
    };
    m.customProgramCacheKey = function () { return (ground ? 'nightG' : 'nightM') + (m.userData.preKey || ''); };
    m.needsUpdate = true;
  }
  G.nightify = nightify;
  nightify(globe.material, true);
  // Where the sun is overhead right now (good to a fraction of a degree)
  function sunLL(date) {
    var n = date / 86400000 - 10957.5, D = Math.PI / 180, L = (280.46 + 0.9856474 * n) % 360, g = (357.528 + 0.9856003 * n) % 360;
    var lam = (L + 1.915 * Math.sin(g * D) + 0.02 * Math.sin(2 * g * D)) * D, eps = (23.439 - 4e-7 * n) * D;
    var dec = Math.asin(Math.sin(eps) * Math.sin(lam)), ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam)) / D;
    var gmst = (280.46061837 + 360.98564736629 * n) % 360, lon = ((ra - gmst) % 360 + 540) % 360 - 180;
    return [lon, dec / D];
  }
  function updSun() { var s = sunLL(Date.now()); G.sun = s; ll2v(s[0], s[1], 1, NIGHT.uSun.value); }
  updSun(); setInterval(function () { if (!G.fixedSun) updSun(); }, 30000); G._night = NIGHT;
  /* ---------- the world: raised land, ocean, borders, roads, scenery ---------- */
  var WORLD = G.world = makeWorld({ scene: scene, ll2v: ll2v, feat: feat, FILL: FILL, nightify: nightify, routes: ROUTES });
  globe.material.color.set(0x1a5aa6); WORLD.oceanTexture(function (t) { globe.material.map = t; globe.material.color.set(0xffffff); globe.material.needsUpdate = true; lastSig = ''; });
  WORLD.onReady = function () { lastSig = ''; };
  WORLD.pads = ((window.TOY && TOY.landmarks) || []).map(function (l) { return l.ll; });
  // while riding, the sea round the vehicle turns see-through so the sea floor shows
  globe.material.userData.preKey = 'sea'; globe.material.userData.pre = function (sh) {
    sh.uniforms.uRideC = WORLD.uniforms.uRideC; sh.uniforms.uRideA = WORLD.uniforms.uRideA;
    sh.fragmentShader = 'uniform vec3 uRideC; uniform float uRideA;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n  if (uRideA > 0.0) { float an = acos(clamp(dot(normalize(vWP), uRideC), -1.0, 1.0)); float dy = smoothstep(-0.08, 0.12, dot(normalize(vWP), uSun)); gl_FragColor.a = mix(mix(0.93, 0.62, dy), 1.0, smoothstep(uRideA * 0.55, uRideA, an)); }');
  };
  function seeThrough(on) { if (globe.material.transparent !== on) { globe.material.transparent = on; globe.material.needsUpdate = true; } }
  var FIDX = {}; feat.forEach(function (f, i) { FIDX[f.properties.id] = i; });

  (function lights() {
    var L = window.LIGHTS || [], n = L.length / 3, pos = new Float32Array(n * 3), size = new Float32Array(n), v = new T.Vector3();
    for (var i = 0; i < n; i++) { ll2v(L[i * 3] / 10, L[i * 3 + 1] / 10, 1.0012 + WORLD.groundH(L[i * 3] / 10, L[i * 3 + 1] / 10), v); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; size[i] = L[i * 3 + 2]; }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aSize', new T.BufferAttribute(size, 1));
    G.lightU = { uSun: NIGHT.uSun, uK: { value: 1.0 } };
    var m = new T.ShaderMaterial({ uniforms: G.lightU, transparent: true, depthWrite: false,
      vertexShader: 'uniform vec3 uSun; uniform float uK; attribute float aSize; varying float vA; varying float vS;\n' +
        'void main(){ float d = dot(normalize(position), uSun); vA = 1.0 - smoothstep(-0.1, 0.04, d); vec4 mv = modelViewMatrix * vec4(position, 1.0);\n' +
        '  gl_Position = vA < 0.01 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * mv; float px = (0.8 + aSize * 0.45) * uK / -mv.z; vS = clamp(px, 2.4, 8.0); gl_PointSize = vS; }',
      fragmentShader: 'varying float vA; varying float vS;\nvoid main(){ vec2 c = gl_PointCoord - 0.5; float r = length(c) * 2.0; float core = smoothstep(1.0, 0.25, r);\n' +
        '  gl_FragColor = vec4(vec3(1.0, 0.8, 0.38) * (0.8 + 0.35 * (1.0 - r)), core * core * vA * (0.6 + 0.4 * min(1.0, vS / 4.0))); }' });
    var pts = new T.Points(g, m); pts.frustumCulled = false; pts.renderOrder = 3; scene.add(pts); G._lights = pts;
  })();
  G.isNight = function (ll) { return ll2v(ll[0], ll[1], 1).dot(NIGHT.uSun.value) < 0; };


  /* ---------- landmarks ---------- */
  var shadowTex = (function () { var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 64); g.addColorStop(0, 'rgba(20,10,50,.55)'); g.addColorStop(0.55, 'rgba(20,10,50,.28)'); g.addColorStop(1, 'rgba(20,10,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
  var shadowMat = new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }); shadowMat.userData.night = 1;
  // Wrap a model: the root gets the globe placement; a soft shadow sits under the model on the ground.
  function grounded(obj, kind, id, shadow) {
    var root = new T.Group(); root.add(obj); root.userData = { kind: kind, id: id }; root.matrixAutoUpdate = false;
    obj.traverse(function (o) { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { nightify(m, false); }); });
    if (shadow) {
      var bb = new T.Box3().setFromObject(obj), sx = (bb.max.x - bb.min.x) * 1.35 + 0.15, sz = (bb.max.z - bb.min.z) * 1.35 + 0.15;
      var sh = new T.Mesh(new T.PlaneGeometry(1, 1), shadowMat); sh.rotation.x = -Math.PI / 2; sh.scale.set(sx, sz, 1); sh.position.set((bb.min.x + bb.max.x) / 2 + 0.04, 0.003, (bb.min.z + bb.max.z) / 2 - 0.03); sh.renderOrder = 1; root.add(sh);
    }
    scene.add(root); return root;
  }
  var LMS = ((window.TOY && TOY.landmarks) || []).map(function (l, i) {
    var m = grounded(MODELS.object(l.m), 'landmark', l.id, true);
    var n = ll2v(l.ll[0], l.ll[1], 1), e = new T.Vector3(0, 1, 0).cross(n).normalize(), t = n.clone().cross(e);
    return { d: l, mesh: m, n: n, e: e, t: t, pri: i, r: 1 + WORLD.groundH(l.ll[0], l.ll[1]) };
  });
  ((window.TOY && TOY.animals) || []).forEach(function (a, i) {
    if (!MODELS.custom['a_' + a.id]) return;
    var m = grounded(MODELS.object('a_' + a.id), 'animal', a.id, true);
    var n = ll2v(a.ll[0], a.ll[1], 1), e = new T.Vector3(0, 1, 0).cross(n).normalize(), t = n.clone().cross(e);
    LMS.push({ d: a, mesh: m, n: n, e: e, t: t, pri: 100 + i, an: true, sz: a.sz || 0.62, r: 1 + WORLD.groundH(a.ll[0], a.ll[1]) });
  });
  var LMB = {}; LMS.forEach(function (o) { LMB[(o.an ? 'a:' : '') + o.d.id] = o; });
  var VEH = ROUTES.map(function (r) {
    var key = r.type === 'plane' ? (r.km < 2500 ? 'v_prop' : 'v_jet') : r.type === 'ship' ? (r.ship === 'ferry' ? 'v_ferry' : 'v_ship') : r.type === 'bullet' ? 'v_bullet' : r.type === 'train' ? 'v_train' : 'v_car';
    var colr = r.type === 'plane' ? r.col : r.type === 'bullet' ? (r.id === 'eurostar' ? '#f2c14e' : r.id === 'kamome' ? '#c0392b' : '#1f5fbf') : r.type === 'train' || r.type === 'car' ? r.col : null;
    var obj = MODELS.object(MODELS.custom[key] ? key : (r.type === 'ship' ? (r.ship || 'ship') : r.type), colr), m = grounded(obj, 'vehicle', r.id, r.type !== 'plane'), spin = [];
    obj.traverse(function (o) { if (o.userData.spin) spin.push(o); });
    return { r: r, mesh: m, spin: spin };
  });
  var VB = {}; VEH.forEach(function (o) { VB[o.r.id] = o; });
  var rideLine = null;

  /* ---------- camera ---------- */
  var V = G.view = { lon: 135, lat: 30, alt: 2.35 }, AMIN = 0.12, AMAX = 3.2, off = 0, offTo = 0;
  var camPos = new T.Vector3(), tmp = new T.Vector3(), tmp2 = new T.Vector3(), mat = new T.Matrix4();
  function clampV() { V.alt = Math.max(AMIN, Math.min(AMAX, V.alt)); V.lat = Math.max(-80, Math.min(80, V.lat)); V.lon = ((V.lon + 540) % 360) - 180; }
  var TMAX = 52 * D2R; function tilt() { var t = (2.3 - V.alt) / (2.3 - 0.2); t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t) * TMAX; }
  // ride-along camera: behind the vehicle (drag to look around, wheel for distance) or first person
  var RC = G.rideView = { yaw: 0, pitch: 0.3, dist: 4.5, fp: false, fwd: new T.Vector3(), size: 0.004 };
  function rideCamera() {
    var o = riding, n = o.n, f = RC.fwd, rs = RC.size, q = new T.Quaternion().setFromAxisAngle(n, RC.yaw), tgt = new T.Vector3();
    var look = f.clone().applyQuaternion(q);
    if (RC.fp) { camPos.copy(o.pos).addScaledVector(n, rs * 0.32).addScaledVector(f, rs * 0.5); tgt.copy(camPos).addScaledVector(look, 1).addScaledVector(n, -Math.sin(RC.pitch - 0.3) * 0.6); }
    else { var back = look.clone().negate(); camPos.copy(o.pos).addScaledVector(back, Math.cos(RC.pitch) * RC.dist * rs).addScaledVector(n, Math.sin(RC.pitch) * RC.dist * rs + rs * 0.3); tgt.copy(o.pos).addScaledVector(n, rs * 0.35); }
    var gl = v2ll(camPos), gh = 1 + Math.max(0, WORLD.groundH(gl[0], gl[1])) + rs * 0.15; if (camPos.length() < gh) camPos.setLength(gh);
    camera.position.copy(camPos); camera.up.copy(n); camera.lookAt(tgt);
    camera.near = rs * 0.05; camera.far = 3; camera.clearViewOffset(); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    V.lon = gl[0]; V.lat = gl[1]; V.alt = Math.max(0.004, camPos.length() - 1);
    var e = new T.Vector3(0, 1, 0).cross(n).normalize(); sun.position.copy(camPos).addScaledVector(n, 0.8).addScaledVector(e, -0.6); sun.target.position.set(0, 0, 0);
    G._glow.visible = false;
  }
  function setCam() {
    if (rideCam && riding && riding.pos) return rideCamera();
    var n = ll2v(V.lon, V.lat, 1), e = new T.Vector3(0, 1, 0).cross(n).normalize(), t = n.clone().cross(e), a = tilt();
    var dir = n.clone().multiplyScalar(Math.cos(a)).addScaledVector(t, -Math.sin(a));
    camPos.copy(n).addScaledVector(dir, V.alt);
    camera.position.copy(camPos); camera.up.copy(t).multiplyScalar(Math.cos(a)).addScaledVector(n, Math.sin(a)); camera.lookAt(n);
    camera.near = Math.max(0.0008, V.alt * 0.05); camera.far = V.alt + 3;
    if (Math.abs(off) > 0.5) camera.setViewOffset(W, H, off, 0, W, H); else camera.clearViewOffset();
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    sun.position.copy(camPos).addScaledVector(t, 0.8).addScaledVector(e, -0.6); sun.target.position.set(0, 0, 0);
    G._glow.visible = V.alt > 0.35 && !riding;
  }
  var anim = null, moving = false, mvT, vel = null;
  function bump() { moving = true; clearTimeout(mvT); mvT = setTimeout(function () { moving = false; }, 160); }
  G.flyTo = function (lon, lat, alt, ms) {
    var f = { lon: V.lon, lat: V.lat, alt: V.alt }, dl = ((lon - f.lon + 540) % 360) - 180, s0 = performance.now(); ms = ms || 1100;
    var dist = d3.geoDistance([f.lon, f.lat], [lon, lat]), hop = Math.max(f.alt, alt, Math.min(2.2, dist * 1.1));
    alt = alt == null ? V.alt : alt; vel = null;
    anim = function (now) {
      var e = Math.min(1, (now - s0) / ms), k = e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
      V.lon = f.lon + dl * k; V.lat = f.lat + (lat - f.lat) * k;
      var base = f.alt * Math.pow(alt / f.alt, k), bumpH = Math.sin(Math.PI * k) * Math.max(0, hop - Math.max(f.alt, alt)) * 0.8;
      V.alt = base + bumpH; clampV(); bump(); return e >= 1;
    };
  };
  G.flyToCountry = function (id) { var c = CEN[id], r = Math.max(0.03, Math.min(1.2, RAD[id] || 0.3)); G.flyTo(c[0], Math.max(-70, Math.min(70, c[1])), Math.max(0.3, Math.min(2.6, r * 2.3))); };
  G.home = function () { G.flyTo(135, 30, 2.35, 900); };
  G.setOffset = function (px) { offTo = px; };
  G.zoom = function (f) { anim = null; if (rideCam && riding) { RC.dist = Math.max(1.6, Math.min(14, RC.dist * f)); return; } V.alt *= f; clampV(); bump(); };

  /* ---------- riding ---------- */
  var riding = null;
  G.ride = function (id) {
    var o = VB[id]; if (!o) return; riding = o; var r = o.r; if (r.wait > 0) { r.dir *= -1; r.wait = 0; } r.d = r.dir > 0 ? 0 : r.len;
    rideCam = true; anim = null; vel = null; RC.yaw = 0; RC.pitch = r.type === 'plane' ? 0.22 : 0.3; RC.dist = r.type === 'plane' ? 4.2 : r.type === 'ship' ? 4 : 4.6; RC.fp = false; RC.fwd.set(0, 0, 0);
    RC.size = r.type === 'plane' ? 0.0055 : r.type === 'ship' ? (r.ship === 'ferry' ? 0.004 : 0.006) : r.type === 'car' ? 0.003 : 0.0045;
    if (rideLine) { scene.remove(rideLine); rideLine.geometry.dispose(); rideLine = null; }
    if (r.type === 'plane') {
      var pts = []; for (var i = 0; i <= 160; i++) { var d = r.len * i / 160, q = along(r, d); pts.push(ll2v(q[0], q[1], 1 + planeH(r, d))); }
      rideLine = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineDashedMaterial({ color: 0xffffff, dashSize: 0.002, gapSize: 0.002, transparent: true, opacity: 0.7 }));
      rideLine.computeLineDistances(); scene.add(rideLine);
    }
    WORLD.setRide(true); seeThrough(true); rideFirst = true; r.prof = null;
    if (r.type === 'plane') { // keep planes well above the (taller) ride-along mountains
      var g0 = []; for (var pi = 0; pi <= 200; pi++) { var qq = along(r, r.len * pi / 200); g0.push(Math.max(0, WORLD.groundH(qq[0], qq[1]))); }
      r.prof = g0.map(function (x, i) { var m = 0; for (var k = Math.max(0, i - 5); k <= Math.min(200, i + 5); k++) m = Math.max(m, g0[k]); return m; });
      if (rideLine) { var lp = rideLine.geometry.attributes.position; for (var li = 0; li <= 160; li++) { var dd = r.len * li / 160, q2 = along(r, dd), pv = ll2v(q2[0], q2[1], 1 + planeH(r, dd)); lp.setXYZ(li, pv.x, pv.y, pv.z); } lp.needsUpdate = true; rideLine.computeLineDistances(); }
    }
    WORLD.scatter(0, 0, 9); lastSig = '';
  };
  var rideFirst = false;
  G.unride = function () {
    if (riding && riding.ll) { V.lon = riding.ll[0]; V.lat = riding.ll[1]; V.alt = 0.35; clampV(); }
    if (riding) riding.r.prof = null; riding = null; rideCam = false; WORLD.setRide(false); seeThrough(false); if (rideLine) { scene.remove(rideLine); rideLine = null; } WORLD.scatter(0, 0, 9); lastSig = '';
  };
  G.firstPerson = function (on) { RC.fp = on == null ? !RC.fp : on; RC.yaw = 0; RC.pitch = RC.fp ? 0.3 : 0.3; return RC.fp; };
  G.riding = function () { return riding && riding.r; };
  function planeH(r, d) {
    var f = d / r.len, e = Math.min(1, Math.min(f, 1 - f) * r.len / 0.03); e = e * e * (3 - 2 * e); var h = 0.0025 + e * (0.004 + Math.min(0.004, r.len * 0.002));
    if (r.prof) { var x = Math.max(0, Math.min(200, f * 200)), i = Math.min(199, Math.floor(x)), g = r.prof[i] + (r.prof[i + 1] - r.prof[i]) * (x - i); h += g - 0.0019 + e * 0.0012; }
    return h;
  }

  /* ---------- per-frame object placement ---------- */
  function scaleNow() { return Math.max(0.0115, Math.min(0.11, 0.008 + 0.031 * V.alt)); }
  function project(v, out) { tmp2.copy(v).project(camera); out[0] = (tmp2.x + 1) / 2 * W; out[1] = (1 - tmp2.y) / 2 * H; out[2] = tmp2.z; return out; }
  function facing(n, p) { return n.dot(tmp.copy(camPos).sub(p)) > 0; }
  var lmRects = [], q0 = [0, 0, 0], q1 = [0, 0, 0];
  var camUp = new T.Vector3(), camBack = new T.Vector3(), up2 = new T.Vector3(), fw2 = new T.Vector3(), x2 = new T.Vector3();
  function placeLandmarks() {
    shadowMat.visible = V.alt < 1.3 && qLow === 0;
    var far = rideCam ? 0 : Math.max(0, Math.min(1, (V.alt - 0.25) / 1.3)), s = rideCam ? RC.size * 2.6 : scaleNow() * (1.35 - 0.6 * far), placed = [], lean = far * 0.8, gp = new T.Vector3();
    camUp.setFromMatrixColumn(camera.matrixWorld, 1); camBack.setFromMatrixColumn(camera.matrixWorld, 2);
    lmRects = [];
    LMS.forEach(function (o) {
      var m = o.mesh;
      if (G.quiz) { m.visible = false; return; }
      if (o.n.dot(tmp.copy(camPos).sub(o.n).normalize()) < 0.12) { m.visible = false; return; } // right at the horizon
      var ss = o.an ? s * o.sz : s; if (o.an && V.alt > 2.0) { m.visible = false; return; }
      up2.copy(o.n).multiplyScalar(1 - lean).addScaledVector(camUp, lean).normalize(); project(o.n, q0); tmp.copy(o.n).addScaledVector(up2, ss * 1.1); project(tmp, q1);
      var h = Math.max(8, Math.abs(q0[1] - q1[1]) + Math.abs(q0[0] - q1[0])), w = h * 0.9, r = { x: q0[0] - w / 2, y: q0[1] - h, w: w, h: h };
      if (r.x > W + 60 || r.x + r.w < -60 || r.y > H + 60 || r.y + r.h < -80) { m.visible = false; return; }
      var hit = false; for (var i = 0; i < placed.length; i++) { var p = placed[i]; if (r.x < p.x + p.w * 0.8 && r.x + r.w * 0.8 > p.x && r.y < p.y + p.h * 0.8 && r.y + r.h * 0.8 > p.y) { hit = true; break; } }
      if (hit) { m.visible = false; return; }
      var rad = o.r;
      if (rideCam) {
        if (o.rv !== WORLD.rideState.ver) { o.rv = WORLD.rideState.ver; o.rr = 1 + WORLD.groundH(o.d.ll[0], o.d.ll[1]); } rad = o.rr;
        // hide a landmark the camera is inside, or one standing between the camera and the vehicle
        gp.copy(o.n).multiplyScalar(rad).addScaledVector(o.n, ss * 0.5);
        if (gp.distanceTo(camPos) < ss * 0.9) { m.visible = false; return; }
        if (riding && riding.pos && gp.distanceTo(riding.pos) < ss * 0.75) { m.visible = false; return; }
        if (riding && riding.pos) { var seg = tmp.copy(riding.pos).sub(camPos), tt = Math.max(0, Math.min(1, tmp2.copy(gp).sub(camPos).dot(seg) / seg.lengthSq())); if (tmp2.copy(camPos).addScaledVector(seg, tt).distanceTo(gp) < ss * 0.45 && tt < 0.97) { m.visible = false; return; } }
      }
      placed.push(r); lmRects.push({ r: r, id: (o.an ? 'a:' : '') + o.d.id });
      m.visible = true;
      fw2.copy(camUp).negate().addScaledVector(up2, camUp.dot(up2)); if (fw2.lengthSq() < 1e-6) fw2.copy(o.t).negate(); fw2.normalize(); x2.copy(up2).cross(fw2); mat.makeBasis(x2, up2, fw2); m.matrix.copy(mat).scale(tmp2.set(ss, ss, ss)).setPosition(gp.copy(o.n).multiplyScalar(rad));
      m.matrixWorldNeedsUpdate = true;
    });
  }
  function moveVehicles(dt) {
    var s = rideCam ? RC.size : scaleNow() * 0.95, anyVis = false;
    VEH.forEach(function (o) {
      var r = o.r, m = o.mesh;
      if (r.wait > 0) { r.wait -= dt * G.speed; if (r.wait <= 0) { r.dir *= -1; } }
      else {
        r.d += r.dir * r.len / r.dur * dt * G.speed;
        if (r.d >= r.len || r.d <= 0) { r.d = Math.max(0, Math.min(r.len, r.d)); r.wait = 2.5; if (riding === o) G.onArrive(r, r.dir > 0 ? r.b : r.a); }
      }
      var st = Math.max(0.002, r.len * 0.004), p = along(r, r.d), p1 = along(r, r.d - r.dir * st), p2 = along(r, r.d + r.dir * st);
      var alt = r.type === 'plane' ? planeH(r, r.d) : (r.type === 'ship' ? 0.0003 : WORLD.groundH(p[0], p[1]) + 0.0004), n = ll2v(p[0], p[1], 1), pos = n.clone().multiplyScalar(1 + alt);
      var fwd = ll2v(p2[0], p2[1], 1).sub(ll2v(p1[0], p1[1], 1)); fwd.addScaledVector(n, -fwd.dot(n)).normalize();
      if (!isFinite(fwd.x) || fwd.lengthSq() < 0.5) fwd.set(0, 1, 0).cross(n).normalize();
      o.pos = pos; o.n = n; o.ll = p;
      var vis = !G.quiz && facing(n, pos); m.visible = vis;
      if (!vis) return; anyVis = true;
      for (var si = 0; si < o.spin.length; si++) o.spin[si].rotation[o.spin[si].userData.spin] += dt * G.speed * (o.spin[si].userData.spin === 'z' ? 40 : 25) * (r.wait > 0 ? 0 : 1);
      if (riding === o) { if (RC.fwd.lengthSq() < 0.5) RC.fwd.copy(fwd); else RC.fwd.lerp(fwd, Math.min(1, dt * 2.5)); RC.fwd.addScaledVector(n, -RC.fwd.dot(n)).normalize(); if (rideCam) fwd = RC.fwd.clone(); }
      var x = n.clone().cross(fwd);
      mat.makeBasis(x, n, fwd); var ss = riding === o ? (rideCam ? RC.size : s * 1.25) : s; m.matrix.copy(mat).scale(tmp2.set(ss, ss, ss)).setPosition(pos); m.matrixWorldNeedsUpdate = true;
    });
    if (riding) {
      anyVis = true; var rr = riding.r; G.onRide(rr, rr.dir > 0 ? rr.d / rr.len : 1 - rr.d / rr.len);
      if (!rideCam && !anim && riding.ll) { var dl = ((riding.ll[0] - V.lon + 540) % 360) - 180; V.lon += dl * Math.min(1, dt * 4); V.lat += (riding.ll[1] - V.lat) * Math.min(1, dt * 4); clampV(); }
    }
    return anyVis;
  }

  /* ---------- 2D label layer ---------- */
  var ov = $('#ov'), octx = ov.getContext('2d'), Q = 1, hits = [];
  var FONT = '"RocknRoll One","Hiragino Maru Gothic ProN","M PLUS Rounded 1c","Yu Gothic UI","Meiryo",sans-serif';
  var FL = {}; function flag(c) { if (!c.a2) return null; var f = FL[c.a2]; if (!f) { f = FL[c.a2] = { img: new Image() }; f.img.onload = function () { var cv2 = document.createElement('canvas'); cv2.width = 68; cv2.height = 51; cv2.getContext('2d').drawImage(f.img, 0, 0, 68, 51); f.bmp = cv2; f.img = null; G.ver++; }; f.img.src = 'flags/' + c.a2.toLowerCase() + '.svg'; } return f.bmp || null; } // SVGs are drawn once into small bitmaps
  var ANI = ((window.TOY && TOY.animals) || []).map(function (a) { return { d: a, n: ll2v(a.ll[0], a.ll[1], 1) }; });
  var ANB = {}; ANI.forEach(function (o) { ANB[o.d.id] = o; });
  G.pins = []; // quiz markers: {ll, col, label}
  var OCEANS = [[-160, 15, 'PACIFIC OCEAN', 'たいへいよう'], [-130, -25, 'PACIFIC OCEAN', 'たいへいよう'], [165, 25, 'PACIFIC OCEAN', 'たいへいよう'], [-40, 28, 'ATLANTIC OCEAN', 'たいせいよう'], [-18, -22, 'ATLANTIC OCEAN', 'たいせいよう'], [78, -18, 'INDIAN OCEAN', 'インドよう'], [0, 80, 'ARCTIC OCEAN', 'ほっきょくかい'], [60, -62, 'SOUTHERN OCEAN', 'なんきょくかい']];
  var A2 = {}; App.all.forEach(function (c) { if (c.a2) A2[c.a2] = c.id; });
  var CITY = (window.CITIES || []).map(function (c) { return { name: c[0], ja: c[6] || '', pop: c[3], cap: c[5], cc: c[4], n: ll2v(c[1], c[2], 1) }; });
  function popText(k) {
    if (G.lang === 'en') return 'pop. ' + (k >= 1000 ? (k >= 10000 ? Math.round(k / 1000) : Math.round(k / 100) / 10) + 'm' : k + 'k');
    return '人口 ' + App.fmtPeople(k * 1000).replace('約', '');
  }
  var widthCache = {}, PINS = {}; G.ver = 0;
  function tw(ctx, key, text) { var w = widthCache[key]; if (w == null) { w = widthCache[key] = ctx.measureText(text).width; } return w; }
  function drawStar(ctx, x, y, r) { ctx.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fillStyle = '#ffc531'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = '#3b2a5c'; ctx.stroke(); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function drawLabels() {
    var ctx = octx; ctx.setTransform(Q, 0, 0, Q, 0, 0); ctx.clearRect(0, 0, W, H); hits = [];
    var placed = lmRects.map(function (l) { return l.r; }), vpos = new T.Vector3(), p = [0, 0, 0];
    function free(r) { for (var i = 0; i < placed.length; i++) { var q = placed[i]; if (r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y) return false; } return true; }
    function scr(n, out) { if (!facing(n, n)) return null; project(n, out); if (out[0] < -40 || out[0] > W + 40 || out[1] < -40 || out[1] > H + 40) return null; return out; }
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.lineJoin = 'round';
    // quiz pins
    G.pins.forEach(function (pn) {
      ll2v(pn.ll[0], pn.ll[1], 1, vpos); if (!scr(vpos, p)) return;
      ctx.fillStyle = pn.col; ctx.strokeStyle = '#3b2a5c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - 11, p[1] - 22); ctx.arc(p[0], p[1] - 26, 12, Math.PI * 0.8, Math.PI * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1] - 26, 5, 0, 7); ctx.fill();
      if (pn.label) { ctx.font = 'bold 15px ' + FONT; ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText(pn.label, p[0], p[1] + 3); ctx.fillStyle = '#3b2a5c'; ctx.fillText(pn.label, p[0], p[1] + 3); }
    });
    if (G.quiz) return;
    function animals() {
    if (V.alt < 2.7) {
      var az = V.alt < 0.7 ? 34 : V.alt < 1.5 ? 28 : 24;
      ctx.font = Math.round(az * 0.62) + 'px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif'; ctx.textBaseline = 'middle';
      ANI.forEach(function (o) {
        if (!scr(o.n, p)) return; var x = p[0], y = p[1] - az * 0.75, r = { x: x - az / 2, y: y - az / 2, w: az, h: az + 6 };
        if (!free(r)) return; placed.push(r);
        var got = G.collected('an', o.d.id), key = o.d.id + az + (got ? 1 : 0), bm = PINS[key];
        if (!bm) { bm = PINS[key] = document.createElement('canvas'); bm.width = az + 8; bm.height = az + 16; var b = bm.getContext('2d'), cx = bm.width / 2, cy = az / 2 + 3;
          b.fillStyle = got ? '#fff3b0' : '#fff'; b.strokeStyle = got ? '#e0a400' : '#3b2a5c'; b.lineWidth = 2.5;
          b.beginPath(); b.moveTo(cx - 6, cy + az / 2 - 3); b.lineTo(cx, cy + az / 2 + 7); b.lineTo(cx + 6, cy + az / 2 - 3); b.closePath(); b.fill(); b.stroke();
          b.beginPath(); b.arc(cx, cy, az / 2, 0, 7); b.fill(); b.stroke();
          b.font = Math.round(az * 0.62) + 'px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif'; b.textAlign = 'center'; b.textBaseline = 'middle'; b.fillStyle = '#000'; b.fillText(o.d.e, cx, cy + 1); }
        ctx.drawImage(bm, x - bm.width / 2, y - az / 2 - 3);
        hits.push({ r: r, kind: 'animal', id: o.d.id });
      });
      ctx.textBaseline = 'top';
    }
    }
    // country flags + names
    ctx.font = 'bold 13px ' + FONT;
    var order = [], rest = []; PRI.forEach(function (q) { (INFO(q.id) ? order : rest).push(q.id); });
    var stamps = G.stampsOf();
    // country names like a printed atlas: spaced capitals with a dark outline, population underneath;
    // the flag is a small badge for the ★ countries that have their own pages
    function place(id) {
      var c = byId[id], ll = CEN[id]; ll2v(ll[0], ll[1], 1, vpos); if (!scr(vpos, p)) return;
      var dist = tmp.copy(camPos).sub(vpos).length(), cosv = vpos.dot(tmp.normalize()), bw = AW[id] * PPR / dist * Math.max(0.3, cosv);
      if (!(bw >= 16 || (V.alt < 0.5 && bw >= 5))) return;
      var en = G.lang === 'en', nm = en ? c.en.toUpperCase() : c.ja, fs = Math.round(Math.max(12, Math.min(24, 10 + bw / 22))), showPop = V.alt < 1.25 && c.pop;
      ctx.font = '900 ' + fs + 'px ' + FONT; ctx.letterSpacing = (en ? Math.round(fs * 0.22) : Math.round(fs * 0.12)) + 'px';
      var tw0 = tw(ctx, 'c' + fs + G.lang + id, nm), star = !!INFO(id), fb = star ? Math.round(fs * 1.1) : 0, w = tw0 + (star ? fb + 6 : 0), h = fs + (showPop ? 13 : 2), r = { x: p[0] - w / 2, y: p[1] - fs / 2 - 2, w: w, h: h };
      if (!free(r) && id !== G.sel) { ctx.letterSpacing = '0px'; return; } placed.push(r);
      var tx = r.x + (star ? fb + 6 : 0), ty = p[1];
      if (star) { var fi = flag(c), fh = Math.round(fb * 0.72), fy = ty - fh / 2; if (fi) ctx.drawImage(fi, r.x, fy, fb, fh); ctx.lineWidth = 1.5; ctx.strokeStyle = '#1a1f45'; ctx.strokeRect(r.x, fy, fb, fh); if (stamps[id]) { ctx.fillStyle = '#ff5a4d'; ctx.beginPath(); ctx.arc(r.x + fb, fy, 5, 0, 7); ctx.fill(); } else drawStar(ctx, r.x + fb, fy, 6); }
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.lineWidth = Math.max(3.5, fs * 0.28); ctx.strokeStyle = 'rgba(16,24,64,.92)'; ctx.strokeText(nm, tx, ty); ctx.fillStyle = id === G.sel ? '#ffe28a' : '#ffffff'; ctx.fillText(nm, tx, ty);
      ctx.letterSpacing = '0px';
      if (showPop) { var pt = c['pt' + G.lang] || (c['pt' + G.lang] = en ? 'pop. ' + popM(c.pop) : '人口 ' + App.fmtPeople(c.pop).replace('約', '')); ctx.font = 'bold 10px ' + FONT; ctx.textAlign = 'center'; var cxm = tx + tw0 / 2; ctx.lineWidth = 3; ctx.strokeText(pt, cxm, ty + fs * 0.5 + 6); ctx.fillStyle = '#bcd3ff'; ctx.fillText(pt, cxm, ty + fs * 0.5 + 6); }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      hits.push({ r: r, kind: 'country', id: id });
    }
    function popM(n) { return n >= 1e6 ? (Math.round(n / 1e5) / 10) + 'm' : Math.round(n / 1e3) + 'k'; }
    order.forEach(place); ctx.font = 'bold 13px ' + FONT; ctx.textBaseline = 'top'; rest.forEach(place);
    if (V.alt > 0.55) OCEANS.forEach(function (o) {
      ll2v(o[0], o[1], 1, vpos); if (!scr(vpos, p)) return; var t = G.lang === 'en' ? o[2] : o[3];
      ctx.font = 'italic 900 17px ' + FONT; ctx.letterSpacing = (G.lang === 'en' ? 6 : 4) + 'px'; var w0 = tw(ctx, 'o' + G.lang + o[2], t), r = { x: p[0] - w0 / 2, y: p[1] - 10, w: w0, h: 20 };
      if (free(r)) { placed.push(r); ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(10,30,80,.8)'; ctx.strokeText(t, p[0], p[1]); ctx.fillStyle = '#8fd0ff'; ctx.fillText(t, p[0], p[1]); ctx.textBaseline = 'top'; }
      ctx.letterSpacing = '0px';
    });
    // cities: more appear as you zoom in; capitals get a red star
    var minPop = V.alt > 1.7 ? 1e9 : V.alt > 1.15 ? 6000 : V.alt > 0.75 ? 2500 : V.alt > 0.45 ? 1000 : 0, capOK = V.alt < 1.15;
    if (minPop < 1e9 || capOK) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      for (var ci = 0; ci < CITY.length; ci++) {
        var cy = CITY[ci]; if (cy.pop < minPop && !(capOK && cy.cap)) continue;
        if (!scr(cy.n, p)) continue;
        var nm2 = G.lang === 'ja' && cy.ja ? cy.ja : cy.name, pt = cy['pt' + G.lang] || (cy['pt' + G.lang] = popText(cy.pop));
        ctx.font = 'bold 13px ' + FONT; var w1 = tw(ctx, 'n' + G.lang + ci, nm2); ctx.font = 'bold 10px ' + FONT; var w2 = tw(ctx, 'p' + G.lang + ci, pt);
        var r = { x: p[0] - 6, y: p[1] - 14, w: Math.max(w1, w2) + 16, h: 28 };
        if (!free(r)) continue; placed.push(r);
        if (cy.cap) { ctx.fillStyle = '#ff5a4d'; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#fff'; ctx.stroke(); drawStar(ctx, p[0], p[1], 3.6); }
        else { ctx.fillStyle = '#ffd54a'; ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, 7); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#2a1f4a'; ctx.stroke(); }
        ctx.font = 'bold 13px ' + FONT; ctx.lineWidth = 3.5; ctx.strokeStyle = '#2a1f4a'; ctx.strokeText(nm2, p[0] + 9, p[1] + 1); ctx.fillStyle = '#fff8e6'; ctx.fillText(nm2, p[0] + 9, p[1] + 1);
        ctx.font = 'bold 10px ' + FONT; ctx.lineWidth = 3; ctx.strokeText(pt, p[0] + 9, p[1] + 12); ctx.fillStyle = '#c9d8ff'; ctx.fillText(pt, p[0] + 9, p[1] + 12);
        if (A2[cy.cc]) hits.push({ r: r, kind: 'country', id: A2[cy.cc] });
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    }
    // ride marker
    if (riding && !rideCam && riding.pos && facing(riding.n, riding.pos)) {
      project(riding.pos, p); ctx.font = 'bold 14px ' + FONT; var t = G.lang === 'en' ? '▼ YOU' : '▼ のってるよ';
      ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText(t, p[0], p[1] - 52); ctx.fillStyle = '#ff5a4d'; ctx.fillText(t, p[0], p[1] - 52);
    }
  }

  /* ---------- picking ---------- */
  var ray = new T.Raycaster(), ndc = new T.Vector2();
  function rayAt(px, py) { ndc.set(px / W * 2 - 1, -(py / H) * 2 + 1); ray.setFromCamera(ndc, camera); return ray; }
  G.llAt = function (px, py) {
    var r = rayAt(px, py).ray, o = r.origin, d = r.direction, b = o.dot(d), c = o.dot(o) - 1, disc = b * b - c;
    if (disc < 0) return null; var t = -b - Math.sqrt(disc); if (t < 0) return null;
    return v2ll(o.clone().addScaledVector(d, t));
  };
  G.pick = function (px, py, hover) {
    for (var i = hits.length - 1; i >= 0; i--) { var h = hits[i], r = h.r; if (h.kind === 'animal' && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return h; }
    var objs = [], q = [0, 0, 0];
    lmRects.forEach(function (l) { var r = l.r; if (px >= r.x - 10 && px <= r.x + r.w + 10 && py >= r.y - 10 && py <= r.y + r.h + 10) objs.push(LMB[l.id].mesh); });
    VEH.forEach(function (o) { if (o.mesh.visible && o.pos) { project(o.pos, q); if (Math.abs(q[0] - px) < 60 && Math.abs(q[1] - py) < 60) objs.push(o.mesh); } });
    var is = rayAt(px, py).intersectObjects(objs, true).filter(function (h) { return h.object.material !== shadowMat; });
    if (is.length) { var gl = G.llAt(px, py), gd = gl ? tmp.copy(ll2v(gl[0], gl[1], 1)).distanceTo(camPos) : 99; if (is[0].distance < gd + 0.001) { var ob = is[0].object; while (ob && !ob.userData.kind) ob = ob.parent; if (ob) return { kind: ob.userData.kind, id: ob.userData.id }; } }
    for (var j = hits.length - 1; j >= 0; j--) { var k = hits[j], q = k.r; if (k.kind !== 'animal' && px >= q.x && px <= q.x + q.w && py >= q.y && py <= q.y + q.h) return k; }
    if (hover) return null;
    var ll = G.llAt(px, py); if (!ll) return null; var id = countryAt(ll);
    return id ? { kind: 'country', id: id, ll: ll } : null;
  };

  G.select = function (id) { G.sel = id; WORLD.uniforms.uSel.value = id && FIDX[id] != null ? FIDX[id] : -9; };


  /* ---------- input ---------- */
  function pos(e) { var r = $('#stage').getBoundingClientRect(), s = r.width / W; return [(e.clientX - r.left) / s, (e.clientY - r.top) / s]; }
  var ptrs = {}, drag = null, moved = 0, pinch = null, last = null;
  cv.addEventListener('pointerdown', function (e) {
    anim = null; vel = null; ptrs[e.pointerId] = pos(e); cv.setPointerCapture(e.pointerId); var n = Object.keys(ptrs).length;
    if (n === 1) { drag = { p: pos(e), v: { lon: V.lon, lat: V.lat }, t: performance.now(), yaw: RC.yaw, pitch: RC.pitch }; moved = 0; last = { p: pos(e), t: performance.now() }; }
    else if (n === 2) { var a = Object.keys(ptrs).map(function (k) { return ptrs[k]; }); pinch = { d: Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]), alt: V.alt, rd: RC.dist }; drag = null; }
  });
  cv.addEventListener('pointermove', function (e) {
    var p = pos(e); if (ptrs[e.pointerId]) ptrs[e.pointerId] = p; var ks = Object.keys(ptrs);
    if (rideCam && riding) {
      if (pinch && ks.length >= 2) { var a2 = ptrs[ks[0]], b2 = ptrs[ks[1]]; RC.dist = Math.max(1.6, Math.min(14, pinch.rd * pinch.d / Math.max(10, Math.hypot(a2[0] - b2[0], a2[1] - b2[1])))); moved = 99; return; }
      if (drag && ks.length === 1) { var ddx = p[0] - drag.p[0], ddy = p[1] - drag.p[1]; moved = Math.max(moved, Math.hypot(ddx, ddy)); if (moved > 5) { RC.yaw = drag.yaw - ddx * 0.008; RC.pitch = Math.max(RC.fp ? -0.6 : -0.05, Math.min(1.35, drag.pitch + ddy * 0.006)); } return; }
    }
    if (pinch && ks.length >= 2) { var a = ptrs[ks[0]], b = ptrs[ks[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]); V.alt = pinch.alt * pinch.d / Math.max(10, d); clampV(); moved = 99; bump(); return; }
    if (drag && ks.length === 1) {
      var dx = p[0] - drag.p[0], dy = p[1] - drag.p[1]; moved = Math.max(moved, Math.hypot(dx, dy));
      if (moved > 5 && !riding) {
        var k = V.alt / PPR / D2R; V.lon = drag.v.lon - dx * k / Math.max(0.25, Math.cos(V.lat * D2R)); V.lat = drag.v.lat + dy * k; clampV(); bump();
        var now = performance.now(), dtt = Math.max(1, now - last.t); vel = { x: (p[0] - last.p[0]) / dtt, y: (p[1] - last.p[1]) / dtt }; last = { p: p, t: now };
        G.onHover(null);
      }
      return;
    }
    if (!e.buttons && e.pointerType !== 'touch') { hoverAt = p; }
  });
  var hoverAt = null;
  function endp(e) {
    var p = pos(e), was = Object.keys(ptrs).length; delete ptrs[e.pointerId]; if (was < 2) pinch = null;
    if (drag && moved < 6 && was === 1) { if (G.onTap) { var ll = G.llAt(p[0], p[1]); if (ll) G.onTap(ll, p); } else { var h = G.pick(p[0], p[1]); if (h) G.onPick(h, p); } vel = null; }
    else if (drag && vel && performance.now() - last.t > 60) vel = null;
    if (Object.keys(ptrs).length === 0) drag = null;
  }
  cv.addEventListener('pointerup', endp); cv.addEventListener('pointercancel', endp);
  cv.addEventListener('pointerleave', function () { hoverAt = null; G.onHover(null); });
  cv.addEventListener('wheel', function (e) { e.preventDefault(); anim = null; var dy = e.deltaMode ? e.deltaY * 30 : e.deltaY; if (rideCam && riding) { RC.dist = Math.max(1.6, Math.min(14, RC.dist * Math.exp(dy * 0.0016))); return; } V.alt *= Math.exp(dy * 0.0016); clampV(); bump(); }, { passive: false });
  cv.addEventListener('dblclick', function () { G.zoom(0.55); });

  /* ---------- size / loop ---------- */
  var bg = $('#bg'), stage = $('#stage');
  var STARS = document.createElement('canvas'); STARS.width = W; STARS.height = H;
  (function stars() { var c = STARS.getContext('2d'); var g = c.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 820); g.addColorStop(0, '#17337d'); g.addColorStop(1, '#050b25'); c.fillStyle = g; c.fillRect(0, 0, W, H); c.fillStyle = '#fff'; for (var i = 0; i < 140; i++) { c.globalAlpha = 0.3 + Math.random() * 0.6; var s = Math.random() * 1.7 + 0.4; c.fillRect(Math.random() * W, Math.random() * H, s, s); } c.globalAlpha = 1; })();
  bg.width = W; bg.height = H; bg.getContext('2d').drawImage(STARS, 0, 0);
  // Sky: when the camera is low, space turns into a sky coloured by the real time of day where you are looking.
  scene.fog = new T.Fog(0x9fd0f0, 1e8, 2e8);
  var skyKey = '', skyA = new T.Color(), skyB = new T.Color(), skyTmp = new T.Color();
  var SKY = { day: ['#4f9fe0', '#cfe9f7'], dusk: ['#6a5a9a', '#f3a56c'], night: ['#0a1230', '#28305e'] };
  function sky() {
    var m = riding && rideCam ? 1 : 0;
    var dd = ll2v(V.lon, V.lat, 1).dot(NIGHT.uSun.value), key = Math.round(m * 40) + ':' + Math.round(dd * 20);
    if (key === skyKey) return; skyKey = key;
    var day = Math.max(0, Math.min(1, (dd + 0.05) / 0.25)), dusk = 1 - Math.min(1, Math.abs(dd) / 0.18), night = Math.max(0, Math.min(1, (-dd - 0.02) / 0.15));
    function blend(k) { skyTmp.set(SKY.day[k]).multiplyScalar(day * (1 - dusk * 0.6)); skyTmp.add(new T.Color(SKY.dusk[k]).multiplyScalar(dusk)); skyTmp.add(new T.Color(SKY.night[k]).multiplyScalar(night * (1 - dusk))); return '#' + skyTmp.getHexString(); }
    var top = blend(0), bot = blend(1), c = bg.getContext('2d');
    c.globalAlpha = 1; c.drawImage(STARS, 0, 0);
    if (m > 0) { var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(0.75, bot); c.globalAlpha = m * (0.55 + 0.45 * (1 - night)); c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
    scene.fog.color.set(bot); if (night > 0.5) scene.fog.color.multiplyScalar(0.6);
    var hd = Math.sqrt(2 * Math.max(0.01, V.alt)) + V.alt; scene.fog.near = m > 0.05 ? hd * 0.45 : 1e8; scene.fog.far = m > 0.05 ? hd * (1.6 - 0.6 * m) + 0.02 : 2e8;
  }
  var QSCALE = 1, qT = 0, qN = 0, qLow = 0, HQ = location.search.indexOf("hq") > -1;
  // If this computer can't keep up (under ~24 fps while drawing), lower the resolution and drop extras.
  function quality(now, drew) {
    if (!drew || HQ) return; qN++; if (!qT) qT = now; if (now - qT < 2500) return;
    var fps = qN / ((now - qT) / 1000); qT = now; qN = 0;
    if (fps < 24 && qLow < 2) { qLow++; QSCALE = qLow === 1 ? 0.8 : 0.65; G._glow.material.opacity = 0.6; shadowMat.visible = false; fit(); }
  }
  G.info = function () { return { frames: renderer.info.render.frame, calls: renderer.info.render.calls, tris: renderer.info.render.triangles, tex: renderer.info.memory.textures, geo: renderer.info.memory.geometries }; };
  G.quality = function () { return { low: qLow, scale: QSCALE }; };
  function fit() {
    var s = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = 'scale(' + s + ')';
    var q = Math.min(1, s * (window.devicePixelRatio || 1)) * QSCALE;
    renderer.setPixelRatio(q); renderer.setSize(W, H, false); if (G.lightU) G.lightU.uK.value = q;
    var oq = Math.min(1, s * (window.devicePixelRatio || 1)); // labels stay sharp even in low quality
    if (Math.round(W * oq) !== ov.width) { Q = oq; ov.width = Math.round(W * Q); ov.height = Math.round(H * Q); lastSig = ''; }
  }
  addEventListener('resize', fit); fit();
  var rideCam = false, t0 = performance.now(), restT = 0, lastHover = 0, lastSig = '', frameN = 0, sceneryDirty = false, PERF = location.search.indexOf('perf') > -1; G.__ms = [];
  function loop(now) {
    var dt = Math.min(0.1, (now - t0) / 1000); t0 = now;
    if (anim && anim(now)) anim = null;
    if (vel && !drag && !anim) { var k = V.alt / PPR / D2R * 16; V.lon -= vel.x * k / Math.max(0.25, Math.cos(V.lat * D2R)); V.lat += vel.y * k; vel.x *= 0.92; vel.y *= 0.92; clampV(); bump(); if (Math.abs(vel.x) + Math.abs(vel.y) < 0.01) vel = null; }
    off += (offTo - off) * Math.min(1, dt * 7);
    setCam();
    // natural ground, trees, towns and clouds only while riding along; the normal globe keeps country colours
    WORLD.uniforms.uNear.value = riding && rideCam ? 1 : 0;
    sceneryDirty = (riding && rideCam ? WORLD.scatter(riding.ll ? riding.ll[0] : V.lon, riding.ll ? riding.ll[1] : V.lat, 0.3, { R: riding.r.type === 'plane' ? 2.6 : 1.5, size: RC.size * (riding.r.type === 'plane' ? 0.2 : 0.3), cloud: RC.size, avoid: riding.r.type === 'plane' ? null : riding.r.dense || (riding.r.dense = densify(riding.r.pts)) }) : WORLD.scatter(0, 0, 9)) || sceneryDirty;
    if (riding && rideCam && riding.ll) { if (WORLD.rideUpdate(riding.ll[0], riding.ll[1], rideFirst ? 120 : 5)) sceneryDirty = true; rideFirst = false; }
    sky(); if (G._lights) G._lights.visible = !(riding && rideCam);
    var a = performance.now();
    var sig = V.lon.toFixed(4) + V.lat.toFixed(4) + V.alt.toFixed(5) + Math.round(off) + G.lang + G.quiz + G.ver + (G.sel || '') + G.pins.map(function (q) { return q.ll[0].toFixed(2) + q.col; }).join() + (riding ? 1 : 0) + G.stampN();
    var changed = sig !== lastSig; lastSig = sig;
    var vis = moveVehicles(dt); if (rideCam && riding) setCam();
    if (changed) placeLandmarks();
    // when the view is still, draw at most 30 times a second, and not at all if nothing on screen moves
    frameN++;
    var draw = changed || sceneryDirty || (vis && (frameN % 2 === 0)) || frameN % 30 === 0;
    if (draw) { renderer.render(scene, camera); sceneryDirty = false; }
    if (changed || riding) drawLabels();
    quality(now, draw);
    if (hoverAt && now - lastHover > 90) { lastHover = now; var h = G.pick(hoverAt[0], hoverAt[1], true); G.onHover(h, hoverAt); cv.style.cursor = h ? 'pointer' : 'grab'; hoverAt = null; }
    if (PERF) G.__ms.push(+(performance.now() - a).toFixed(1));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- thumbnails of models (for cards and the sticker book) ---------- */
  var thumbR = null, thumbS, thumbC, thumbCache = {};
  G.thumb = function (key, colour) {
    var k = key + (colour || ''); if (thumbCache[k]) return thumbCache[k];
    try {
      if (!thumbR) {
        var c = document.createElement('canvas'); c.width = c.height = 200;
        thumbR = new T.WebGLRenderer({ canvas: c, antialias: true, alpha: true, preserveDrawingBuffer: true }); thumbR.setClearColor(0x000000, 0);
        thumbS = new T.Scene(); thumbS.add(new T.HemisphereLight(0xffffff, 0x9a90c8, 2.2)); var d = new T.DirectionalLight(0xffffff, 1.6); d.position.set(-1, 2, 2.5); thumbS.add(d);
        thumbC = new T.PerspectiveCamera(30, 1, 0.1, 20);
      }
      var m = MODELS.object(key, colour), bs = new T.Box3().setFromObject(m).getBoundingSphere(new T.Sphere());
      thumbS.add(m); var dist = bs.radius / Math.sin(15 * D2R) * 1.02;
      thumbC.position.set(bs.center.x + dist * 0.55, bs.center.y + dist * 0.42, bs.center.z + dist * 0.72); thumbC.lookAt(bs.center);
      thumbR.render(thumbS, thumbC); thumbS.remove(m);
      return (thumbCache[k] = thumbR.domElement.toDataURL('image/png'));
    } catch (e) { return ''; }
  };
  G.landmark = function (id) { return LMB[id] && LMB[id].d; };
  G.animal = function (id) { return ANB[id] && ANB[id].d; };
  G.route = function (id) { return VB[id] && VB[id].r; };
  G.vehicleLL = function (id) { return VB[id] && VB[id].ll; };
})();
