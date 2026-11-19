/* せかいたんけん 3D globe: Three.js sphere with a painted map texture (borders never disappear),
   a sharper "detail" patch when zoomed in, low-poly landmarks, moving vehicles and a 2D label layer.
   UI code talks to it through window.Globe (see the API at the bottom). */
(function () {
  var T = window.THREE, G = window.Globe = {};
  var W = 1366, H = 598, D2R = Math.PI / 180, FOV = 40, PPR = (H / 2) / Math.tan(FOV / 2 * D2R);
  var $ = function (s) { return document.querySelector(s); };
  var byId = App.byId;
  G.lang = 'ja'; G.speed = 1; G.quiz = false; G.stampsOf = function () { return {}; }; G.collected = function () { return false; };
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

  /* ---------- map texture ---------- */
  var TW = 4096, TH = 2048, tcv = document.createElement('canvas'); tcv.width = TW; tcv.height = TH;
  var tctx = tcv.getContext('2d', { willReadFrequently: true });
  function paint(ctx, proj, scale, list, cheap) {
    var gp = d3.geoPath(proj, ctx), w = ctx.canvas.width, h = ctx.canvas.height, F = list || feat;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#2b6cb8'; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); gp(d3.geoGraticule().step([30, 30])()); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1.2 * scale; ctx.stroke();
    function allLand() { ctx.beginPath(); F.forEach(function (f) { gp(f); }); }
    if (cheap) {
      // tiles: same look without blur filters (blur is what made repaints slow)
      ctx.strokeStyle = 'rgba(110,190,240,.28)'; ctx.lineWidth = 22 * scale; allLand(); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,200,245,.4)'; ctx.lineWidth = 11 * scale; ctx.stroke();
      ctx.save(); ctx.translate(2.5 * scale, 4 * scale); ctx.fillStyle = 'rgba(14,24,70,.45)'; allLand(); ctx.fill(); ctx.restore();
      F.forEach(function (f) { ctx.beginPath(); gp(f); ctx.fillStyle = FILL[f.properties.id]; ctx.fill(); });
    } else {
      // shallow water around the coasts (one blurred stroke for the whole world)
      ctx.save(); ctx.filter = 'blur(' + Math.round(6 * scale) + 'px)'; ctx.strokeStyle = 'rgba(110,190,240,.75)'; ctx.lineWidth = 18 * scale; allLand(); ctx.stroke(); ctx.restore();
      // land lifted off the sea: one soft shadow, then the country colours on top
      ctx.save(); ctx.shadowColor = 'rgba(8,20,70,.6)'; ctx.shadowBlur = 9 * scale; ctx.shadowOffsetX = 2.5 * scale; ctx.shadowOffsetY = 4.5 * scale; ctx.fillStyle = '#2a2050'; allLand(); ctx.fill(); ctx.restore();
      F.forEach(function (f) { ctx.beginPath(); gp(f); ctx.fillStyle = FILL[f.properties.id]; ctx.fill(); });
      // soft light rim just inside the coast
      ctx.save(); allLand(); ctx.clip(); ctx.filter = 'blur(' + Math.round(3 * scale) + 'px)'; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 4 * scale; allLand(); ctx.stroke(); ctx.restore();
    }
    ctx.strokeStyle = 'rgba(55,30,90,.38)'; ctx.lineWidth = 1.1 * scale;
    F.forEach(function (f) { ctx.beginPath(); gp(f); ctx.stroke(); });
    // routes on the ground: rails, roads, sea lanes
    ROUTES.forEach(function (r) {
      if (r.type === 'plane') return;
      var line = { type: 'LineString', coordinates: r.pts };
      ctx.setLineDash([]);
      if (r.type === 'ship') { ctx.setLineDash([6 * scale, 7 * scale]); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2 * scale; ctx.beginPath(); gp(line); ctx.stroke(); }
      else if (r.type === 'car') { ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 4 * scale; ctx.beginPath(); gp(line); ctx.stroke(); ctx.setLineDash([5 * scale, 5 * scale]); ctx.strokeStyle = '#ffd54a'; ctx.lineWidth = 1.2 * scale; ctx.beginPath(); gp(line); ctx.stroke(); }
      else { ctx.strokeStyle = '#5a4632'; ctx.lineWidth = 3.6 * scale; ctx.beginPath(); gp(line); ctx.stroke(); ctx.setLineDash([4 * scale, 4 * scale]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.8 * scale; ctx.beginPath(); gp(line); ctx.stroke(); }
      ctx.setLineDash([]);
    });
  }
  function highlight(ctx, proj, scale, id) {
    if (!id || !FEAT[id]) return; var gp = d3.geoPath(proj, ctx);
    ctx.beginPath(); gp(FEAT[id]); ctx.fillStyle = '#fff3d6'; ctx.fill(); ctx.strokeStyle = '#ff5a4d'; ctx.lineWidth = 4 * scale; ctx.stroke();
  }
  var tproj = d3.geoEquirectangular().scale(TW / (2 * Math.PI)).translate([TW / 2, TH / 2]).precision(0.2);
  paint(tctx, tproj, 1);
  var saved = null;

  /* ---------- three.js scene ---------- */
  var cv = $('#cv'), renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene(), camera = new T.PerspectiveCamera(FOV, W / H, 0.001, 20);
  var tex = new T.CanvasTexture(tcv); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  var globe = new T.Mesh(new T.SphereGeometry(1, 96, 64), new T.MeshLambertMaterial({ map: tex }));
  scene.add(globe);
  var hemi = new T.HemisphereLight(0xffffff, 0x9a90c8, 1.9); scene.add(hemi);
  var sun = new T.DirectionalLight(0xffffff, 1.5); scene.add(sun); scene.add(sun.target);
  // atmosphere glow
  (function () {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 90, 128, 128, 128);
    g.addColorStop(0, 'rgba(140,210,255,.9)'); g.addColorStop(0.25, 'rgba(120,200,255,.35)'); g.addColorStop(1, 'rgba(120,200,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    var t = new T.CanvasTexture(c); var sp = new T.Sprite(new T.SpriteMaterial({ map: t, depthWrite: false, transparent: true }));
    sp.scale.set(2.95, 2.95, 1); sp.renderOrder = -1; scene.add(sp); G._glow = sp;
  })();

  /* ---------- day and night (real time) ---------- */
  var NIGHT = { uSun: { value: new T.Vector3(1, 0, 0) }, uLights: { value: null } };
  try { var lt = new T.TextureLoader().load('data/nightlights.jpg'); lt.colorSpace = T.SRGBColorSpace; NIGHT.uLights.value = lt; } catch (e) { }
  // Darken the side of the Earth where it is night now; the map adds city lights there.
  function nightify(m, lights) {
    if (m.userData.night) return; m.userData.night = 1; lights = lights && NIGHT.uLights.value;
    m.onBeforeCompile = function (sh) {
      sh.uniforms.uSun = NIGHT.uSun; if (lights) sh.uniforms.uLights = NIGHT.uLights;
      sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vWP;\nuniform vec3 uSun;\n' + (lights ? 'uniform sampler2D uLights;\n' : '') + sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n' +
        '  { vec3 nn = normalize(vWP); float dd = dot(nn, uSun); float day = smoothstep(-0.08, 0.12, dd);\n' +
        (lights ? '    vec3 nc = gl_FragColor.rgb * vec3(0.13, 0.16, 0.38);\n    vec2 luv = vec2(atan(-nn.z, nn.x) * 0.15915494 + 0.5, asin(clamp(nn.y, -1.0, 1.0)) * 0.31830989 + 0.5);\n    nc += texture2D(uLights, luv).rgb * 0.95;\n'
                : '    vec3 nc = gl_FragColor.rgb * vec3(0.3, 0.33, 0.58);\n') +
        '    gl_FragColor.rgb = mix(nc, gl_FragColor.rgb, day);\n    gl_FragColor.rgb += vec3(0.2, 0.08, 0.0) * (1.0 - smoothstep(0.0, 0.12, abs(dd))) * 0.45; }');
    };
    m.customProgramCacheKey = function () { return lights ? 'nightL' : 'night'; };
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
  updSun(); setInterval(updSun, 30000);
  G.isNight = function (ll) { return ll2v(ll[0], ll[1], 1).dot(NIGHT.uSun.value) < 0; };

  /* ---------- sharper map tiles when zoomed in ----------
     The world is cut into fixed squares (30° and 10°). Each square is painted once, only with the
     countries inside it, at most one per frame, then kept. No more big repaints while moving. */
  var FB = feat.map(function (f) { return d3.geoBounds(f); });
  var TILES = {}, tileQueue = [], tileFrame = 0, LEV = { 1: { S: 30, N: 512, R: 1.0005, max: 30, sc: 0.75 }, 2: { S: 10, N: 768, R: 1.0008, max: 18, sc: 1.1 } };
  var tcvTmp = null;
  function featuresIn(lon0, lat0, lon1, lat1) {
    var out = [];
    for (var i = 0; i < feat.length; i++) {
      var b = FB[i]; if (b[1][1] < lat0 - 1 || b[0][1] > lat1 + 1) continue;
      if (b[0][0] <= b[1][0] && (b[1][0] < lon0 - 1 || b[0][0] > lon1 + 1)) continue;
      out.push(feat[i]);
    }
    return out;
  }
  function paintTile(lev, i, j) {
    var L = LEV[lev], S = L.S, N = L.N, lon0 = -180 + i * S, lat1 = 90 - j * S, lat0 = lat1 - S, lonC = lon0 + S / 2, latC = lat0 + S / 2;
    var c = document.createElement('canvas'); c.width = c.height = N; var ctx = c.getContext('2d');
    var k = N / (S * D2R), pr = d3.geoEquirectangular().rotate([-lonC, 0]).scale(k).translate([N / 2, N / 2 + latC * D2R * k]).precision(0.15);
    var list = featuresIn(lon0, lat0, lon0 + S, lat1);
    paint(ctx, pr, L.sc, list, true);
    if (G.sel && list.indexOf(FEAT[G.sel]) > -1) highlight(ctx, pr, L.sc, G.sel);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = tex.anisotropy;
    t.onUpdate = function () { c.width = c.height = 1; t.onUpdate = null; }; // free the canvas once it is on the GPU
    var m = new T.MeshLambertMaterial({ map: t }); nightify(m, true);
    var seg = lev === 1 ? 16 : 10, mesh = new T.Mesh(new T.SphereGeometry(L.R, seg, seg, (lon0 + 180) * D2R, S * D2R, (90 - lat1) * D2R, S * D2R), m);
    mesh.renderOrder = -0.5 + lev * 0.1; scene.add(mesh); return mesh;
  }
  function dropTile(key) { var t = TILES[key]; if (!t) return; scene.remove(t.mesh); t.mesh.geometry.dispose(); t.mesh.material.map.dispose(); t.mesh.material.dispose(); delete TILES[key]; }
  function clearTiles() { Object.keys(TILES).forEach(dropTile); tileQueue = []; }
  var need = {};
  function updateTiles() {
    tileFrame++;
    if (tileFrame % 4 === 0) {
      need = {};
      var levels = V.alt < 1.0 ? (V.alt < 0.4 ? [1, 2] : [1]) : [];
      if (levels.length) for (var gx = 0; gx <= 8; gx++) for (var gy = 0; gy <= 5; gy++) {
        var ll = G.llAt(gx / 8 * W, gy / 5 * H); if (!ll) continue;
        levels.forEach(function (lev) {
          var S = LEV[lev].S, i = Math.floor((ll[0] + 180) / S), j = Math.floor((90 - ll[1]) / S); i = (i + 360 / S) % (360 / S); j = Math.max(0, Math.min(180 / S - 1, j));
          var key = lev + ':' + i + ':' + j, cx = Math.abs(gx - 4) + Math.abs(gy - 2.5);
          if (!need[key] || need[key].d > cx) need[key] = { lev: lev, i: i, j: j, d: cx };
        });
      }
      Object.keys(TILES).forEach(function (k) { TILES[k].mesh.visible = !!need[k]; if (need[k]) TILES[k].used = tileFrame; });
      tileQueue = Object.keys(need).filter(function (k) { return !TILES[k]; }).sort(function (a, b) { return need[a].lev - need[b].lev || need[a].d - need[b].d; });
      [1, 2].forEach(function (lev) { var ks = Object.keys(TILES).filter(function (k) { return TILES[k].lev === lev; }); if (ks.length > LEV[lev].max) ks.sort(function (a, b) { return TILES[a].used - TILES[b].used; }).slice(0, ks.length - LEV[lev].max).forEach(function (k) { if (!need[k]) dropTile(k); }); });
    }
    if (tileQueue.length && !(drag && moved > 5 && tileFrame % 2)) { var key = tileQueue.shift(), n = need[key]; if (n && !TILES[key]) TILES[key] = { mesh: paintTile(n.lev, n.i, n.j), lev: n.lev, used: tileFrame }; }
  }

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
    return { d: l, mesh: m, n: n, e: e, t: t, pri: i };
  });
  var LMB = {}; LMS.forEach(function (o) { LMB[o.d.id] = o; });
  var VEH = ROUTES.map(function (r) {
    var key = r.type === 'ship' ? (r.ship || 'ship') : r.type, m = grounded(MODELS.object(key, r.type === 'ship' ? null : r.col), 'vehicle', r.id, r.type !== 'plane');
    return { r: r, mesh: m };
  });
  var VB = {}; VEH.forEach(function (o) { VB[o.r.id] = o; });
  var rideLine = null;

  /* ---------- camera ---------- */
  var V = G.view = { lon: 135, lat: 30, alt: 2.35 }, AMIN = 0.12, AMAX = 3.2, off = 0, offTo = 0;
  var camPos = new T.Vector3(), tmp = new T.Vector3(), tmp2 = new T.Vector3(), mat = new T.Matrix4();
  function clampV() { V.alt = Math.max(AMIN, Math.min(AMAX, V.alt)); V.lat = Math.max(-80, Math.min(80, V.lat)); V.lon = ((V.lon + 540) % 360) - 180; }
  var TMAX = 52 * D2R; function tilt() { var t = (2.3 - V.alt) / (2.3 - 0.2); t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t) * TMAX; }
  function setCam() {
    var n = ll2v(V.lon, V.lat, 1), e = new T.Vector3(0, 1, 0).cross(n).normalize(), t = n.clone().cross(e), a = tilt();
    var dir = n.clone().multiplyScalar(Math.cos(a)).addScaledVector(t, -Math.sin(a));
    camPos.copy(n).addScaledVector(dir, V.alt);
    camera.position.copy(camPos); camera.up.copy(t).multiplyScalar(Math.cos(a)).addScaledVector(n, Math.sin(a)); camera.lookAt(n);
    camera.near = Math.max(0.0008, V.alt * 0.05); camera.far = V.alt + 3;
    if (Math.abs(off) > 0.5) camera.setViewOffset(W, H, off, 0, W, H); else camera.clearViewOffset();
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    sun.position.copy(camPos).addScaledVector(t, 0.8).addScaledVector(e, -0.6); sun.target.position.set(0, 0, 0);
    G._glow.visible = V.alt > 0.35;
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
  G.zoom = function (f) { anim = null; V.alt *= f; clampV(); bump(); };

  /* ---------- riding ---------- */
  var riding = null;
  G.ride = function (id) {
    var o = VB[id]; if (!o) return; riding = o; var r = o.r; if (r.wait > 0) { r.dir *= -1; r.wait = 0; } r.d = r.dir > 0 ? 0 : r.len; var p = along(r, r.d);
    G.flyTo(p[0], p[1], r.type === 'plane' ? 0.55 : r.km < 300 ? 0.16 : 0.3, 1000);
    if (rideLine) { scene.remove(rideLine); rideLine.geometry.dispose(); rideLine = null; }
    if (r.type === 'plane') {
      var pts = []; for (var i = 0; i <= 80; i++) { var d = r.len * i / 80, q = along(r, d); pts.push(ll2v(q[0], q[1], 1 + planeH(r, d))); }
      rideLine = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineDashedMaterial({ color: 0xffffff, dashSize: 0.01, gapSize: 0.008 }));
      rideLine.computeLineDistances(); scene.add(rideLine);
    }
  };
  G.unride = function () { riding = null; if (rideLine) { scene.remove(rideLine); rideLine = null; } };
  G.riding = function () { return riding && riding.r; };
  function planeH(r, d) { var f = d / r.len; return 0.004 + Math.sin(Math.PI * f) * Math.min(0.09, r.len * 0.035); }

  /* ---------- per-frame object placement ---------- */
  function scaleNow() { return Math.max(0.0115, Math.min(0.11, 0.008 + 0.031 * V.alt)); }
  function project(v, out) { tmp2.copy(v).project(camera); out[0] = (tmp2.x + 1) / 2 * W; out[1] = (1 - tmp2.y) / 2 * H; out[2] = tmp2.z; return out; }
  function facing(n, p) { return n.dot(tmp.copy(camPos).sub(p)) > 0; }
  var lmRects = [], q0 = [0, 0, 0], q1 = [0, 0, 0];
  var camUp = new T.Vector3(), camBack = new T.Vector3(), up2 = new T.Vector3(), fw2 = new T.Vector3(), x2 = new T.Vector3();
  function placeLandmarks() {
    var far = Math.max(0, Math.min(1, (V.alt - 0.25) / 1.3)), s = scaleNow() * (2.1 - 1.15 * far), placed = [], lean = far * 0.8, gp = new T.Vector3();
    camUp.setFromMatrixColumn(camera.matrixWorld, 1); camBack.setFromMatrixColumn(camera.matrixWorld, 2);
    lmRects = [];
    LMS.forEach(function (o) {
      var m = o.mesh;
      if (G.quiz) { m.visible = false; return; }
      if (o.n.dot(tmp.copy(camPos).sub(o.n).normalize()) < 0.12) { m.visible = false; return; } // right at the horizon
      up2.copy(o.n).multiplyScalar(1 - lean).addScaledVector(camUp, lean).normalize(); project(o.n, q0); tmp.copy(o.n).addScaledVector(up2, s * 1.1); project(tmp, q1);
      var h = Math.max(8, Math.abs(q0[1] - q1[1]) + Math.abs(q0[0] - q1[0])), w = h * 0.9, r = { x: q0[0] - w / 2, y: q0[1] - h, w: w, h: h };
      if (r.x > W + 60 || r.x + r.w < -60 || r.y > H + 60 || r.y + r.h < -80) { m.visible = false; return; }
      var hit = false; for (var i = 0; i < placed.length; i++) { var p = placed[i]; if (r.x < p.x + p.w * 0.8 && r.x + r.w * 0.8 > p.x && r.y < p.y + p.h * 0.8 && r.y + r.h * 0.8 > p.y) { hit = true; break; } }
      if (hit) { m.visible = false; return; }
      placed.push(r); lmRects.push({ r: r, id: o.d.id });
      m.visible = true;
      fw2.copy(camUp).negate().addScaledVector(up2, camUp.dot(up2)); if (fw2.lengthSq() < 1e-6) fw2.copy(o.t).negate(); fw2.normalize(); x2.copy(up2).cross(fw2); mat.makeBasis(x2, up2, fw2); m.matrix.copy(mat).scale(tmp2.set(s, s, s)).setPosition(gp.copy(o.n).multiplyScalar(1.001));
      m.matrixWorldNeedsUpdate = true;
    });
  }
  function moveVehicles(dt) {
    var s = scaleNow() * 0.95;
    VEH.forEach(function (o) {
      var r = o.r, m = o.mesh;
      if (r.wait > 0) { r.wait -= dt * G.speed; if (r.wait <= 0) { r.dir *= -1; } }
      else {
        r.d += r.dir * r.len / r.dur * dt * G.speed;
        if (r.d >= r.len || r.d <= 0) { r.d = Math.max(0, Math.min(r.len, r.d)); r.wait = 2.5; if (riding === o) G.onArrive(r, r.dir > 0 ? r.b : r.a); }
      }
      var st = Math.max(0.002, r.len * 0.004), p = along(r, r.d), p1 = along(r, r.d - r.dir * st), p2 = along(r, r.d + r.dir * st);
      var alt = r.type === 'plane' ? planeH(r, r.d) : 0.0012, n = ll2v(p[0], p[1], 1), pos = n.clone().multiplyScalar(1 + alt);
      var fwd = ll2v(p2[0], p2[1], 1).sub(ll2v(p1[0], p1[1], 1)); fwd.addScaledVector(n, -fwd.dot(n)).normalize();
      if (!isFinite(fwd.x) || fwd.lengthSq() < 0.5) fwd.set(0, 1, 0).cross(n).normalize();
      o.pos = pos; o.n = n; o.ll = p;
      var vis = !G.quiz && facing(n, pos); m.visible = vis;
      if (!vis) return;
      var x = n.clone().cross(fwd);
      mat.makeBasis(x, n, fwd); var ss = riding === o ? s * 1.25 : s; m.matrix.copy(mat).scale(tmp2.set(ss, ss, ss)).setPosition(pos); m.matrixWorldNeedsUpdate = true;
    });
    if (riding) {
      var rr = riding.r; G.onRide(rr, rr.dir > 0 ? rr.d / rr.len : 1 - rr.d / rr.len);
      if (!anim && riding.ll) { var dl = ((riding.ll[0] - V.lon + 540) % 360) - 180; V.lon += dl * Math.min(1, dt * 4); V.lat += (riding.ll[1] - V.lat) * Math.min(1, dt * 4); clampV(); }
    }
  }

  /* ---------- 2D label layer ---------- */
  var ov = $('#ov'), octx = ov.getContext('2d'), Q = 1, hits = [];
  var FONT = '"RocknRoll One","Hiragino Maru Gothic ProN","M PLUS Rounded 1c","Yu Gothic UI","Meiryo",sans-serif';
  var FL = {}; function flag(c) { if (!c.a2) return null; var f = FL[c.a2]; if (!f) { f = FL[c.a2] = new Image(); f.onload = function () { f.ok = 1; }; f.src = 'flags/' + c.a2.toLowerCase() + '.svg'; } return f.ok ? f : null; }
  var ANI = ((window.TOY && TOY.animals) || []).map(function (a) { return { d: a, n: ll2v(a.ll[0], a.ll[1], 1) }; });
  var ANB = {}; ANI.forEach(function (o) { ANB[o.d.id] = o; });
  G.pins = []; // quiz markers: {ll, col, label}
  var A2 = {}; App.all.forEach(function (c) { if (c.a2) A2[c.a2] = c.id; });
  var CITY = (window.CITIES || []).map(function (c) { return { name: c[0], ja: c[6] || '', pop: c[3], cap: c[5], cc: c[4], n: ll2v(c[1], c[2], 1) }; });
  function popText(k) {
    if (G.lang === 'en') return 'pop. ' + (k >= 1000 ? (k >= 10000 ? Math.round(k / 1000) : Math.round(k / 100) / 10) + 'm' : k + 'k');
    return '人口 ' + App.fmtPeople(k * 1000).replace('約', '');
  }
  var widthCache = {};
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
        var got = G.collected('an', o.d.id);
        ctx.fillStyle = got ? '#fff3b0' : '#fff'; ctx.strokeStyle = got ? '#e0a400' : '#3b2a5c'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x - 6, y + az / 2 - 3); ctx.lineTo(x, y + az / 2 + 7); ctx.lineTo(x + 6, y + az / 2 - 3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, az / 2, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#000'; ctx.fillText(o.d.e, x, y + 1);
        hits.push({ r: r, kind: 'animal', id: o.d.id });
      });
      ctx.textBaseline = 'top';
    }
    }
    // country flags + names
    ctx.font = 'bold 13px ' + FONT;
    var order = [], rest = []; PRI.forEach(function (q) { (INFO(q.id) ? order : rest).push(q.id); });
    var stamps = G.stampsOf();
    function place(id) {
      var c = byId[id], ll = CEN[id]; ll2v(ll[0], ll[1], 1, vpos); if (!scr(vpos, p)) return;
      var dist = tmp.copy(camPos).sub(vpos).length(), cosv = vpos.dot(tmp.normalize()), bw = AW[id] * PPR / dist * Math.max(0.3, cosv);
      if (!(bw >= 14 || (V.alt < 0.5 && bw >= 3))) return;
      var showName = bw >= 28 || V.alt < 0.4, nm = G.lang === 'en' ? c.en.toUpperCase() : c.ja, fs = Math.round(Math.max(12, Math.min(22, 11 + bw / 28)));
      ctx.font = '900 ' + fs + 'px ' + FONT; ctx.letterSpacing = (G.lang === 'en' ? 2 : 1) + 'px';
      var fw = showName ? Math.round(fs * 1.25) : (bw >= 40 ? 26 : 22), fh = Math.round(fw * 0.75), tw0 = showName ? tw(ctx, 'c' + fs + G.lang + id, nm) : 0;
      var w = fw + (showName ? tw0 + 6 : 0), h = Math.max(fh, showName ? fs + 4 : 0), r = { x: p[0] - w / 2, y: p[1] - h / 2, w: w, h: h };
      if (!free(r) && id !== G.sel) { ctx.letterSpacing = '0px'; return; } placed.push(r);
      var fi = flag(c), fx = r.x, fy = p[1] - fh / 2;
      ctx.fillStyle = 'rgba(15,25,90,.35)'; ctx.fillRect(fx + 2, fy + 2, fw, fh);
      if (fi) ctx.drawImage(fi, fx, fy, fw, fh); else { ctx.fillStyle = '#ddd'; ctx.fillRect(fx, fy, fw, fh); }
      ctx.lineWidth = 2; ctx.strokeStyle = '#3b2a5c'; ctx.strokeRect(fx, fy, fw, fh);
      if (stamps[id]) { ctx.fillStyle = '#ff5a4d'; ctx.beginPath(); ctx.arc(fx + fw, fy, 6, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); } else if (INFO(id)) drawStar(ctx, fx + fw, fy, 7);
      if (showName) { ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; var tx = fx + fw + 6, ty = p[1] + 1; ctx.lineWidth = Math.max(4, fs * 0.32); ctx.strokeStyle = '#2a1f4a'; ctx.strokeText(nm, tx, ty); ctx.fillStyle = '#fff8e6'; ctx.fillText(nm, tx, ty); ctx.textAlign = 'center'; ctx.textBaseline = 'top'; }
      ctx.letterSpacing = '0px';
      hits.push({ r: r, kind: 'country', id: id });
    }
    order.forEach(place); animals(); ctx.font = 'bold 13px ' + FONT; ctx.textBaseline = 'top'; rest.forEach(place);
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
    if (riding && riding.pos && facing(riding.n, riding.pos)) {
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

  /* ---------- selection highlight on the big texture ---------- */
  G.select = function (id) {
    if (saved) { tctx.putImageData(saved.img, saved.x, saved.y); saved = null; }
    G.sel = id;
    if (id && FEAT[id]) {
      var b = d3.geoPath(tproj).bounds(FEAT[id]), x = Math.max(0, Math.floor(b[0][0]) - 8), y = Math.max(0, Math.floor(b[0][1]) - 8), w = Math.min(TW - x, Math.ceil(b[1][0] - b[0][0]) + 16), h = Math.min(TH - y, Math.ceil(b[1][1] - b[0][1]) + 16);
      saved = { img: tctx.getImageData(x, y, w, h), x: x, y: y }; highlight(tctx, tproj, 1, id);
    }
    tex.needsUpdate = true; clearTiles();
  };

  /* ---------- input ---------- */
  function pos(e) { var r = $('#stage').getBoundingClientRect(), s = r.width / W; return [(e.clientX - r.left) / s, (e.clientY - r.top) / s]; }
  var ptrs = {}, drag = null, moved = 0, pinch = null, last = null;
  cv.addEventListener('pointerdown', function (e) {
    anim = null; vel = null; ptrs[e.pointerId] = pos(e); cv.setPointerCapture(e.pointerId); var n = Object.keys(ptrs).length;
    if (n === 1) { drag = { p: pos(e), v: { lon: V.lon, lat: V.lat }, t: performance.now() }; moved = 0; last = { p: pos(e), t: performance.now() }; }
    else if (n === 2) { var a = Object.keys(ptrs).map(function (k) { return ptrs[k]; }); pinch = { d: Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]), alt: V.alt }; drag = null; }
  });
  cv.addEventListener('pointermove', function (e) {
    var p = pos(e); if (ptrs[e.pointerId]) ptrs[e.pointerId] = p; var ks = Object.keys(ptrs);
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
  cv.addEventListener('wheel', function (e) { e.preventDefault(); anim = null; var dy = e.deltaMode ? e.deltaY * 30 : e.deltaY; V.alt *= Math.exp(dy * 0.0016); clampV(); bump(); }, { passive: false });
  cv.addEventListener('dblclick', function () { G.zoom(0.55); });

  /* ---------- size / loop ---------- */
  var bg = $('#bg'), stage = $('#stage');
  (function stars() { var c = bg.getContext('2d'); bg.width = W; bg.height = H; var g = c.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 820); g.addColorStop(0, '#17337d'); g.addColorStop(1, '#050b25'); c.fillStyle = g; c.fillRect(0, 0, W, H); c.fillStyle = '#fff'; for (var i = 0; i < 140; i++) { c.globalAlpha = 0.3 + Math.random() * 0.6; var s = Math.random() * 1.7 + 0.4; c.fillRect(Math.random() * W, Math.random() * H, s, s); } c.globalAlpha = 1; })();
  function fit() {
    var s = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = 'scale(' + s + ')';
    var q = Math.min(1.5, Math.max(1, s * (window.devicePixelRatio || 1)));
    renderer.setPixelRatio(q); renderer.setSize(W, H, false);
    if (Math.round(W * q) !== ov.width) { Q = q; ov.width = Math.round(W * Q); ov.height = Math.round(H * Q); }
  }
  addEventListener('resize', fit); fit();
  var t0 = performance.now(), restT = 0, lastHover = 0, PERF = location.search.indexOf('perf') > -1; G.__ms = [];
  function loop(now) {
    var dt = Math.min(0.1, (now - t0) / 1000); t0 = now;
    if (anim && anim(now)) anim = null;
    if (vel && !drag && !anim) { var k = V.alt / PPR / D2R * 16; V.lon -= vel.x * k / Math.max(0.25, Math.cos(V.lat * D2R)); V.lat += vel.y * k; vel.x *= 0.92; vel.y *= 0.92; clampV(); bump(); if (Math.abs(vel.x) + Math.abs(vel.y) < 0.01) vel = null; }
    off += (offTo - off) * Math.min(1, dt * 7);
    setCam();
    updateTiles();
    var a = performance.now();
    moveVehicles(dt); placeLandmarks();
    renderer.render(scene, camera);
    drawLabels();
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
