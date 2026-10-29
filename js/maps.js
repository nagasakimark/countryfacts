/* World map (tap to pick, zoom, draggable true-size shapes) and small true-size pictures. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  // ---------- big world map ----------
  App.WorldMap = function (container, opts) {
    opts = opts || {};
    var W = Math.max(320, container.clientWidth), H = Math.max(260, container.clientHeight);
    // Mercator showing latitudes 80°N to 56°S, the whole world across
    function Y(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)); }
    var band = Y(80) - Y(-56), mid = (Y(80) + Y(-56)) / 2;
    var s = Math.min(W / (2 * Math.PI), H / band);
    var projection = d3.geoMercator().scale(s).translate([W / 2, H / 2 + s * mid]);
    var path = d3.geoPath(projection);

    var svg = d3.select(container).append('svg')
      .attr('class', 'worldmap').attr('viewBox', '0 0 ' + W + ' ' + H).attr('width', '100%').attr('height', '100%');
    svg.append('rect').attr('class', 'sea').attr('width', W).attr('height', H);
    var g = svg.append('g');
    var gLand = g.append('g').attr('class', 'land');
    var gMarks = g.append('g').attr('class', 'marks');
    var gOver = g.append('g').attr('class', 'overlays');

    var selected = null;
    var lands = gLand.selectAll('path').data(App.features).join('path')
      .attr('d', path)
      .attr('class', function (f) {
        var c = App.byId[f.properties.id];
        var cls = 'country';
        if (f.properties.id === 'JPN') cls += ' japan';
        if (c && App.save.stamps[c.id]) cls += ' stamped';
        return cls;
      })
      .attr('fill', function (f) {
        var c = App.byId[f.properties.id];
        return f.properties.id === 'JPN' ? '#E2434B' : App.CONT_COLOR[(c && c.region) || 'その他'];
      })
      .on('click', function (ev, f) {
        if (opts.onPick) { App.sfx.tap(); opts.onPick(f.properties.id); }
      });

    // star markers for featured countries
    var k = 1;
    var marks = gMarks.selectAll('g').data(opts.stars === false ? [] : App.featured).join('g')
      .attr('class', function (c) { return 'star' + (App.save.stamps[c.id] ? ' got' : ''); })
      .attr('data-x', function (c) { return projection(App.mainShape(c.id).center)[0]; })
      .attr('data-y', function (c) { return projection(App.mainShape(c.id).center)[1]; })
      .on('click', function (ev, c) { if (opts.onPick) { App.sfx.tap(); opts.onPick(c.id); } });
    marks.append('circle').attr('r', 9);
    marks.append('text').attr('dy', 4).text(function (c) { return App.save.stamps[c.id] ? '✔' : '★'; });

    function placeMarks() {
      marks.attr('transform', function () {
        return 'translate(' + this.getAttribute('data-x') + ',' + this.getAttribute('data-y') + ') scale(' + (1 / Math.sqrt(k)) + ')';
      });
      gOver.selectAll('.olabel').attr('transform', function () {
        return 'translate(' + this.getAttribute('data-x') + ',' + this.getAttribute('data-y') + ') scale(' + (1 / k) + ')';
      });
    }

    var zoom = d3.zoom().scaleExtent([1, 14]).translateExtent([[0, 0], [W, H]])
      .on('zoom', function (ev) { k = ev.transform.k; g.attr('transform', ev.transform); placeMarks(); });
    svg.call(zoom).on('dblclick.zoom', null);
    placeMarks();

    var api = { svg: svg, projection: projection, W: W, H: H };
    api.zoomBy = function (f) { svg.transition().duration(300).call(zoom.scaleBy, f); };
    api.reset = function () { svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity); };
    api.flyTo = function (id) {
      var f = App.mainShape(id); if (!f) return;
      var b = path.bounds(f), dx = b[1][0] - b[0][0], dy = b[1][1] - b[0][1];
      var s = Math.max(1, Math.min(8, 0.55 / Math.max(dx / W, dy / H)));
      var x = (b[0][0] + b[1][0]) / 2, y = (b[0][1] + b[1][1]) / 2;
      svg.transition().duration(700).call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(s).translate(-x, -y));
    };
    api.select = function (id) {
      selected = id;
      lands.classed('selected', function (f) { return f.properties.id === id; });
      lands.filter(function (f) { return f.properties.id === id; }).raise();
    };

    // ---------- draggable true-size overlays ----------
    var overlays = [];
    api.addOverlay = function (id, color, label) {
      var base = App.mainShape(id);
      var o = { id: id, center: base.center.slice() };
      o.path = gOver.append('path').attr('class', 'overlay').attr('fill', color).attr('stroke', d3.color(color).darker(1));
      o.label = gOver.append('g').attr('class', 'olabel');
      o.label.append('rect').attr('rx', 10).attr('fill', color);
      o.text = o.label.append('text').attr('dy', 5).text(label);
      o.draw = function () {
        o.path.attr('d', path(App.moveShape(base, base.center, o.center)));
        var p = projection(o.center);
        o.label.attr('data-x', p[0]).attr('data-y', p[1]);
        var tw = o.text.node().getComputedTextLength() + 20;
        o.label.select('rect').attr('x', -tw / 2).attr('y', -13).attr('width', tw).attr('height', 26);
        placeMarks();
        if (opts.onMove) opts.onMove(o);
      };
      o.moveTo = function (to, ms) {
        if (!ms) { o.center = to; o.draw(); return; }
        var interp = d3.geoInterpolate(o.center, to), t0 = performance.now();
        (function step(now) {
          var t = Math.min(1, (now - t0) / ms);
          o.center = interp(d3.easeCubicInOut(t)); o.draw();
          if (t < 1) requestAnimationFrame(step);
        })(t0);
      };
      var off;
      var drag = d3.drag().container(svg.node())
        .on('start', function (ev) {
          var tr = d3.zoomTransform(svg.node());
          var cs = tr.apply(projection(o.center));
          off = [ev.x - cs[0], ev.y - cs[1]];
          o.path.classed('dragging', true).raise(); o.label.raise();
        })
        .on('drag', function (ev) {
          var tr = d3.zoomTransform(svg.node());
          var ll = projection.invert(tr.invert([ev.x - off[0], ev.y - off[1]]));
          if (!ll || isNaN(ll[1])) return;
          ll[1] = Math.max(-75, Math.min(78, ll[1]));
          o.center = ll; o.draw();
        })
        .on('end', function () { o.path.classed('dragging', false); if (opts.onDrop) opts.onDrop(o); });
      o.path.call(drag); o.label.call(drag);
      o.remove = function () { o.path.remove(); o.label.remove(); overlays = overlays.filter(function (x) { return x !== o; }); };
      o.draw();
      overlays.push(o);
      return o;
    };
    api.overlays = function () { return overlays; };
    return api;
  };

  // ---------- small "true size" picture: country with Japan on top ----------
  // opts: { japan: true/false, size: px, japanLabel, color }
  App.trueSizeSVG = function (id, opts) {
    opts = opts || {};
    var S = opts.size || 300;
    var shape = App.mainShape(id);
    var items = [{ f: shape, cls: 'ts-country', fill: opts.color || '#4A90C8' }];
    if (opts.japan && id !== 'JPN') {
      var jp = App.mainShape('JPN');
      items.push({ f: App.moveShape(jp, jp.center, shape.center), cls: 'ts-japan', fill: '#E2434B' });
    }
    var proj = d3.geoAzimuthalEqualArea().rotate([-shape.center[0], -shape.center[1]]);
    proj.fitExtent([[14, 14], [S - 14, S - 14]], { type: 'FeatureCollection', features: items.map(function (i) { return i.f; }) });
    var p = d3.geoPath(proj);
    var svg = '<svg class="truesize" viewBox="0 0 ' + S + ' ' + S + '" role="img">';
    items.forEach(function (i) {
      var b = p.bounds(i.f), tiny = (b[1][0] - b[0][0]) < 8 && (b[1][1] - b[0][1]) < 8;
      svg += '<path class="' + i.cls + '" d="' + p(i.f) + '" fill="' + i.fill + '"/>';
      if (tiny) { var c = p.centroid(i.f); svg += '<circle class="tiny-ring" cx="' + c[0] + '" cy="' + c[1] + '" r="12"/>'; }
    });
    return svg + '</svg>';
  };

  // A small Japan icon (for "日本 何こ分" rows)
  var jpIcon = null;
  App.japanIcon = function () {
    if (jpIcon) return jpIcon;
    var jp = App.mainShape('JPN');
    var proj = d3.geoAzimuthalEqualArea().rotate([-jp.center[0], -jp.center[1]]).fitExtent([[1, 1], [23, 23]], jp);
    jpIcon = '<svg class="jp-icon" viewBox="0 0 24 24"><path d="' + d3.geoPath(proj)(jp) + '"/></svg>';
    return jpIcon;
  };
})();
