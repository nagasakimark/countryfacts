/* Detailed landmark models (textured, many parts). Each builder returns a THREE.Group that stands on y=0,
   about 1 unit across, front facing +z. Textures are drawn on canvases, so no image files are needed.
   Register with MODELS.custom[key] = function () { return group; } */
(function () {
  var T = window.THREE, M = window.MODELS;
  M.custom = M.custom || {};
  var texCache = {};
  function tex(key, w, h, draw) {
    if (texCache[key]) return texCache[key];
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4;
    return (texCache[key] = t);
  }
  function mat(map, rx, ry, extra) {
    var t = map.clone(); t.needsUpdate = true; t.repeat.set(rx || 1, ry || 1);
    var o = { map: t }; if (extra) for (var k in extra) o[k] = extra[k];
    return new T.MeshLambertMaterial(o);
  }
  function solid(c, extra) { var o = { color: c }; if (extra) for (var k in extra) o[k] = extra[k]; return new T.MeshLambertMaterial(o); }
  function box(g, m, w, h, d, x, y, z) { var b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y + h / 2, z); g.add(b); return b; }
  function cyl(g, m, rt, rb, h, x, y, z, seg, rot) { var b = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg || 8), m); b.position.set(x, y + h / 2, z); if (rot) b.rotation.y = rot; g.add(b); return b; }
  function plane(g, m, w, h, x, y, z, ry) { var p = new T.Mesh(new T.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.rotation.y = ry || 0; g.add(p); return p; }

  M.kit = { tex: tex, mat: mat, solid: solid, box: box, cyl: cyl, plane: plane };

  /* ---------- textures ---------- */
  var SAND = '#d4ab68', SAND_L = '#e6c383', SAND_D = '#a8854a', WIN = '#3b4d48', GOLD = '#d8ad4c';
  function palaceBay() { // one window bay, three floors, buttress strip on the left
    return tex('pbay4', 64, 160, function (x, w, h) {
      x.fillStyle = SAND; x.fillRect(0, 0, w, h);
      for (var i = 0; i < h; i += 4) { x.fillStyle = i % 8 ? 'rgba(255,240,200,.06)' : 'rgba(80,50,10,.08)'; x.fillRect(0, i, w, 1); }
      x.fillStyle = SAND_L; x.fillRect(0, 0, 7, h); x.fillStyle = 'rgba(70,45,10,.35)'; x.fillRect(7, 0, 2, h);
      [12, 48, 84, 120].forEach(function (y, f) {
        x.fillStyle = SAND_D; x.fillRect(9, y - 5, w - 9, 3);           // string course
        x.fillStyle = 'rgba(255,235,190,.5)'; x.fillRect(9, y - 2, w - 9, 1);
        var wx = 20, ww = 30, wh = f === 3 ? 22 : 26;
        x.fillStyle = '#8a6a36'; x.fillRect(wx - 2, y, ww + 4, wh + 3);   // window reveal
        x.fillStyle = WIN; x.fillRect(wx, y + 1, ww, wh);
        var g = x.createLinearGradient(0, y, 0, y + wh); g.addColorStop(0, 'rgba(160,190,180,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(wx, y + 1, ww, wh);
        x.fillStyle = '#c9b07a'; x.fillRect(wx + ww / 2 - 1, y + 1, 2, wh); x.fillRect(wx + ww / 4 - 0.5, y + 1, 1, wh); x.fillRect(wx + ww * 3 / 4 - 0.5, y + 1, 1, wh); x.fillRect(wx, y + wh * 0.38, ww, 2);
        x.fillStyle = SAND_L; x.fillRect(wx - 2, y + wh + 1, ww + 4, 2);
      });
      x.fillStyle = SAND_D; x.fillRect(9, 150, w - 9, 2); x.fillStyle = '#6b5129'; x.fillRect(28, 152, 12, 8); // door arch at the bottom
    });
  }
  function shaftTex() { // tall gothic panels on the clock tower
    return tex('shaft', 64, 128, function (x, w, h) {
      x.fillStyle = SAND; x.fillRect(0, 0, w, h);
      for (var c = 0; c < 4; c++) {
        var px = 4 + c * 15;
        x.fillStyle = 'rgba(70,45,10,.45)'; x.fillRect(px, 0, 10, h);
        x.fillStyle = SAND_L; x.fillRect(px + 1, 0, 8, h);
        x.fillStyle = 'rgba(90,60,20,.35)'; x.fillRect(px + 4, 0, 2, h);
        for (var y = 0; y < h; y += 32) { x.fillStyle = SAND_D; x.fillRect(px, y, 10, 2); x.fillStyle = '#e8c88a'; x.fillRect(px + 3, y + 10, 4, 4); }
      }
      x.fillStyle = 'rgba(255,240,200,.18)'; x.fillRect(0, 0, 3, h);
    });
  }
  function clockTex() {
    return tex('clock', 256, 256, function (x) {
      x.fillStyle = '#b8892f'; x.fillRect(0, 0, 256, 256);
      x.strokeStyle = '#f2d27a'; x.lineWidth = 6; x.strokeRect(8, 8, 240, 240);
      x.strokeStyle = '#7a5a1e'; x.lineWidth = 3; x.strokeRect(18, 18, 220, 220);
      for (var i = 0; i < 4; i++) { var cx = i % 2 ? 228 : 28, cy = i < 2 ? 28 : 228; x.fillStyle = '#f2d27a'; x.beginPath(); x.arc(cx, cy, 10, 0, 7); x.fill(); }
      x.fillStyle = '#e6c56a'; x.beginPath(); x.arc(128, 128, 108, 0, 7); x.fill();
      var g = x.createRadialGradient(118, 112, 10, 128, 128, 100); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e9e4d6'); x.fillStyle = g; x.beginPath(); x.arc(128, 128, 98, 0, 7); x.fill();
      x.strokeStyle = '#2c2c2c'; x.lineWidth = 2; x.beginPath(); x.arc(128, 128, 98, 0, 7); x.stroke(); x.beginPath(); x.arc(128, 128, 70, 0, 7); x.stroke();
      x.fillStyle = '#222'; x.font = 'bold 17px Georgia,serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      var R = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
      for (var k = 0; k < 12; k++) { var a = k / 12 * Math.PI * 2; x.save(); x.translate(128 + Math.sin(a) * 84, 128 - Math.cos(a) * 84); x.rotate(a); x.fillText(R[k], 0, 0); x.restore(); }
      for (var m = 0; m < 60; m++) { var b = m / 60 * Math.PI * 2; x.fillRect(128 + Math.sin(b) * 70 - 1, 128 - Math.cos(b) * 70 - 1, 2, 2); }
      x.lineCap = 'round'; x.strokeStyle = '#1a1a1a';
      x.lineWidth = 6; x.beginPath(); x.moveTo(128, 128); x.lineTo(128 + 42, 128 + 22); x.stroke();
      x.lineWidth = 4; x.beginPath(); x.moveTo(128, 128); x.lineTo(128 + 20, 128 - 66); x.stroke();
      x.fillStyle = '#1a1a1a'; x.beginPath(); x.arc(128, 128, 6, 0, 7); x.fill();
    });
  }
  function belfryTex() {
    return tex('belfry', 128, 64, function (x, w, h) {
      x.fillStyle = SAND_L; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 6; i++) { var px = 6 + i * 20; x.fillStyle = '#3a3226'; x.fillRect(px, 14, 12, 40); x.beginPath(); x.arc(px + 6, 14, 6, Math.PI, 0); x.fill(); x.fillStyle = GOLD; x.fillRect(px + 5, 10, 2, 44); x.fillRect(px, 30, 12, 2); }
      x.fillStyle = GOLD; x.fillRect(0, 0, w, 4); x.fillRect(0, h - 5, w, 5);
    });
  }
  function slateTex() {
    return tex('slate', 64, 64, function (x, w, h) {
      x.fillStyle = '#56615c'; x.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 6) { x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(0, y, w, 1); for (var k = (y / 6) % 2 ? 3 : 0; k < w; k += 6) { x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(k, y, 1, 6); } }
    });
  }
  function dormerSlateTex() {
    return tex('dslate', 128, 128, function (x, w, h) {
      x.drawImage(slateTex().image, 0, 0, 64, 64, 0, 0, 128, 128);
      for (var r = 0; r < 3; r++) for (var c = 0; c < 4 - r; c++) {
        var px = 18 + c * 26 + r * 13, py = 92 - r * 30;
        x.fillStyle = GOLD; x.fillRect(px, py, 12, 14); x.beginPath(); x.moveTo(px - 1, py); x.lineTo(px + 6, py - 7); x.lineTo(px + 13, py); x.fill();
        x.fillStyle = '#2a2a22'; x.fillRect(px + 3, py + 3, 6, 9);
      }
    });
  }
  function lanternTex() {
    return tex('lantern', 64, 64, function (x, w, h) {
      x.fillStyle = '#c69a45'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 8; i++) { x.fillStyle = '#5a4520'; x.fillRect(3 + i * 8, 8, 4, 48); x.fillStyle = '#f0cf7a'; x.fillRect(2 + i * 8, 8, 1, 48); }
      x.fillStyle = '#f0cf7a'; x.fillRect(0, 0, w, 5); x.fillRect(0, h - 6, w, 6);
    });
  }

  /* ---------- Big Ben + Palace of Westminster ---------- */
  M.custom.bigben = function () {
    var g = new T.Group();
    var stone = solid(SAND), stoneL = solid(SAND_L), gold = solid(GOLD, { emissive: 0x3a2a00 }), slate = mat(slateTex(), 3, 3), dark = solid('#4d5753');
    // --- Palace: long facade with the tower at the right end
    var L = 0.86, PH = 0.27, PD = 0.17, px0 = -0.5, pcx = px0 + L / 2, pz = 0.0;
    var bays = 16, bay = palaceBay();
    var front = mat(bay, bays, 1), side = mat(bay, 3, 1);
    var body = new T.Mesh(new T.BoxGeometry(L, PH, PD), [side, side, stone, stone, front, front]); body.position.set(pcx, PH / 2, pz); g.add(body);
    // back wing (L-shape on the left)
    var wing = new T.Mesh(new T.BoxGeometry(0.17, PH * 0.95, 0.3), [mat(bay, 5, 1), mat(bay, 5, 1), stone, stone, mat(bay, 3, 1), mat(bay, 3, 1)]); wing.position.set(px0 + 0.085, PH * 0.95 / 2, -0.2); g.add(wing);
    // pitched slate roofs
    function roof(len, w, x, y, z) { var r = new T.Mesh(new T.BoxGeometry(len, w * 0.707, w * 0.707), slate); r.rotation.x = Math.PI / 4; var hold = new T.Group(); hold.add(r); hold.scale.y = 0.6; hold.position.set(x, y, z); g.add(hold); return hold; }
    roof(L - 0.01, PD, pcx, PH, pz);
    var wr = new T.Mesh(new T.BoxGeometry(0.17 * 0.707, 0.17 * 0.707, 0.3), slate); wr.rotation.z = Math.PI / 4; var wh2 = new T.Group(); wh2.add(wr); wh2.scale.y = 0.6; wh2.position.set(px0 + 0.085, PH * 0.95, -0.2); g.add(wh2);
    roof(0.2, PD * 1.05, 0.15, PH + 0.03, pz); box(g, stone, 0.2, 0.03, PD * 1.02, 0.15, PH, pz);
    // buttress strips + pinnacles along both long edges
    for (var i = 0; i <= bays; i++) {
      var x = px0 + i * (L / bays);
      [PD / 2 + 0.004, -PD / 2 - 0.004].forEach(function (z) {
        box(g, stoneL, 0.012, PH, 0.01, x, 0, z);
        cyl(g, stoneL, 0.0, 0.009, 0.075, x, PH, z, 4, Math.PI / 4);
        cyl(g, dark, 0.0, 0.004, 0.03, x, PH + 0.07, z, 4);
      });
    }
    // little corner turrets on the wing
    [[px0, 0.06], [px0, -0.35], [px0 + 0.17, -0.35]].forEach(function (q) { cyl(g, stoneL, 0.014, 0.016, PH + 0.02, q[0], 0, q[1], 8); cyl(g, stoneL, 0, 0.017, 0.07, q[0], PH + 0.02, q[1], 8); });

    // --- Elizabeth Tower
    var tx = 0.42, tz = 0.0, W = 0.125, SH = 0.66;
    box(g, stoneL, W + 0.02, 0.03, W + 0.02, tx, 0, tz);
    var shaft = mat(shaftTex(), 1, 4);
    box(g, shaft, W, SH, W, tx, 0, tz);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { box(g, stoneL, 0.022, SH + 0.03, 0.022, tx + q[0] * W / 2, 0, tz + q[1] * W / 2); });
    // clock stage
    var CW = 0.155, CY = SH, CH = 0.13;
    box(g, stone, CW, CH, CW, tx, CY, tz);
    var clock = mat(clockTex(), 1, 1, { emissive: 0x332a10 });
    for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2, p = new T.Mesh(new T.PlaneGeometry(0.125, 0.125), clock); p.position.set(tx + Math.sin(a) * (CW / 2 + 0.002), CY + CH / 2, tz + Math.cos(a) * (CW / 2 + 0.002)); p.rotation.y = a; g.add(p); }
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { box(g, gold, 0.014, CH, 0.014, tx + q[0] * CW / 2, CY, tz + q[1] * CW / 2); });
    box(g, gold, CW + 0.016, 0.01, CW + 0.016, tx, CY + CH, tz);
    // belfry
    var BY = CY + CH + 0.01, BH = 0.07, BW = 0.142;
    box(g, mat(belfryTex(), 1, 1), BW, BH, BW, tx, BY, tz);
    box(g, gold, BW + 0.02, 0.012, BW + 0.02, tx, BY + BH, tz);
    // roof with dormers, then lantern and spire
    var RY = BY + BH + 0.012, RH = 0.11;
    cyl(g, mat(dormerSlateTex(), 1, 1), 0.058, 0.112, RH, tx, RY, tz, 4, Math.PI / 4);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { cyl(g, gold, 0, 0.007, 0.09, tx + q[0] * 0.075, RY - 0.005, tz + q[1] * 0.075, 4); cyl(g, gold, 0.004, 0.004, 0.02, tx + q[0] * 0.075, RY - 0.02, tz + q[1] * 0.075, 6); });
    var LY = RY + RH;
    box(g, mat(lanternTex(), 2, 1), 0.075, 0.055, 0.075, tx, LY, tz);
    box(g, gold, 0.095, 0.01, 0.095, tx, LY + 0.055, tz);
    var SY = LY + 0.065;
    cyl(g, slate, 0.004, 0.058, 0.17, tx, SY, tz, 4, Math.PI / 4);
    cyl(g, gold, 0.003, 0.004, 0.09, tx, SY + 0.165, tz, 6);
    box(g, gold, 0.022, 0.004, 0.004, tx, SY + 0.23, tz);
    g.userData.footprint = [1.0, 0.45];
    return g;
  };
})();
