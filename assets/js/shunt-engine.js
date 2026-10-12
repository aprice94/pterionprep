/* Pterion Prep — shunt valve pressure engine (pure functions; used by /shunts/converter/ and unit tests).
   All internal pressures are mmH2O. Data shape: _data/shunt_valves.yml (see header comment there). */
(function (root) {
  'use strict';

  // 1 mmH2O = 9.80665 Pa ; 1 mmHg = 133.322387 Pa  →  1 mmHg = 13.5951 mmH2O
  var PA_PER_MMH2O = 9.80665, PA_PER_MMHG = 133.322387;
  var UNITS = {
    mmH2O: { label: 'mmH₂O', toMm: function (v) { return v; } },
    cmH2O: { label: 'cmH₂O', toMm: function (v) { return v * 10; } },
    mmHg:  { label: 'mmHg',  toMm: function (v) { return v * PA_PER_MMHG / PA_PER_MMH2O; } },
    kPa:   { label: 'kPa',   toMm: function (v) { return v * 1000 / PA_PER_MMH2O; } }
  };
  function toMm(value, unit) { return UNITS[unit].toMm(Number(value)); }
  function convert(mm) {
    return { mmH2O: mm, cmH2O: mm / 10, mmHg: mm * PA_PER_MMH2O / PA_PER_MMHG, kPa: mm * PA_PER_MMH2O / 1000 };
  }
  function round(x, d) { var f = Math.pow(10, d); return Math.round(x * f) / f; }
  function fmt(mm, unit) {
    if (mm === null || mm === undefined || isNaN(mm)) return '—';
    var c = convert(mm);
    if (unit === 'mmH2O') return String(round(c.mmH2O, Number.isInteger(c.mmH2O) ? 0 : 1));
    if (unit === 'cmH2O') return String(round(c.cmH2O, 1));
    if (unit === 'mmHg') return String(round(c.mmHg, 1));
    if (unit === 'kPa') return String(round(c.kPa, 2));
    return String(mm);
  }

  function rangeValues(spec) {
    if (spec.options) return spec.options.slice();
    var out = [];
    for (var v = spec.min; v <= spec.max + 1e-9; v += spec.step) out.push(round(v, 4));
    return out;
  }

  // Human label for a generated (Miethke-style) configuration. dims values are cmH2O.
  function genLabel(valve, vals) {
    var g = valve.gen;
    if (g.high) return vals.dp + ' / ' + vals.high + ' cmH₂O (lying / upright)';
    if (!g.dp) return vals.grav + ' cmH₂O';                                  // add-on gravitational unit (proSA)
    var dp = 'DP ' + vals.dp;
    if (!g.grav) return dp + ' cmH₂O';
    if (vals.grav === 0) return dp + ' cmH₂O · no gravitational unit';
    return dp + ' + gravitational ' + vals.grav + ' cmH₂O';
  }

  // A candidate = one concrete setting of one valve: {label, lying, upright, lo, hi, upLo, upHi, ...}
  function fromTableSetting(s, valvePosture) {
    var up = (s.up !== undefined && s.up !== null) ? s.up : (valvePosture === 'none' ? s.p : null);
    return {
      label: s.s, lying: s.p, upright: up,
      lo: s.lo, hi: s.hi, upLo: s.up_lo, upHi: s.up_hi,
      tol: s.tol, sys: s.sys, note: s.note || '', min: !!s.min
    };
  }

  // Enumerate every concrete setting. opts.variant restricts to one variant id; opts.fixed pins non-adjustable dims.
  function enumerate(valve, opts) {
    opts = opts || {};
    var out = [];
    if (valve.variants) {
      valve.variants.forEach(function (va) {
        if (opts.variant && opts.variant !== va.id) return;
        var posture = va.posture || valve.posture;
        va.settings.forEach(function (s) {
          var c = fromTableSetting(s, posture);
          c.variant = va.id; c.variantLabel = va.label; c.posture = posture;
          c.full = va.label.split(' — ')[0] + ' · position ' + s.s;
          out.push(c);
        });
      });
    } else if (valve.settings) {
      valve.settings.forEach(function (s) {
        var c = fromTableSetting(s, valve.posture); c.posture = valve.posture; c.full = s.s; out.push(c);
      });
    } else if (valve.gen) {
      var g = valve.gen, keys = Object.keys(g);
      var lists = keys.map(function (k) {
        if (opts.fixed && opts.fixed[k] !== undefined && opts.fixed[k] !== null && opts.fixed[k] !== '') return [Number(opts.fixed[k])];
        return rangeValues(g[k]);
      });
      (function walk(i, vals) {
        if (i === keys.length) {
          var lying, upright;
          if (g.high) { lying = vals.dp * 10; upright = vals.high * 10; }
          else if (!g.dp) { lying = 0; upright = vals.grav * 10; }                // add-on unit alone
          else { lying = vals.dp * 10; upright = (vals.dp + (vals.grav || 0)) * 10; }
          var lbl = genLabel(valve, vals);
          out.push({ label: lbl, full: lbl, lying: lying, upright: upright, dims: Object.assign({}, vals), posture: valve.posture });
          return;
        }
        lists[i].forEach(function (v) { var n = Object.assign({}, vals); n[keys[i]] = v; walk(i + 1, n); });
      })(0, {});
    }
    return out;
  }

  // Add an in-series add-on gravitational unit (value in mmH2O added upright) to a candidate whose valve has no posture device.
  function withAddon(c, addonMm, addonLabel) {
    if (!addonMm) return c;
    var n = Object.assign({}, c);
    n.upright = c.lying + addonMm;
    n.upLo = n.upHi = undefined;
    n.full = c.full + ' + ' + addonLabel;
    n.addon = addonLabel;
    return n;
  }

  function valueAt(c, posture) { return posture === 'upright' ? c.upright : c.lying; }

  // Closest candidate to targetMm in a posture, plus nearest strictly-lower / strictly-higher neighbours.
  // Ties on the primary posture are broken by closeness in the other posture (otherMm), then by lower pressure.
  function nearest(cands, targetMm, posture, otherMm) {
    var other = posture === 'upright' ? 'lying' : 'upright';
    function od(c) { var v = valueAt(c, other); return (otherMm === undefined || otherMm === null || v === null || v === undefined) ? 0 : Math.abs(v - otherMm); }
    var usable = cands.filter(function (c) { var v = valueAt(c, posture); return v !== null && v !== undefined && !isNaN(v); });
    if (!usable.length) return null;
    var best = null, lower = null, higher = null;
    usable.forEach(function (c) {
      var v = valueAt(c, posture), d = Math.abs(v - targetMm);
      if (!best || d < best.d - 1e-9) best = { c: c, d: d, o: od(c) };
      else if (Math.abs(d - best.d) < 1e-9) {
        var o = od(c);
        if (o < best.o - 1e-9 || (Math.abs(o - best.o) < 1e-9 && v < valueAt(best.c, posture))) best = { c: c, d: d, o: o };
      }
      if (v < targetMm - 1e-9 && (!lower || v > valueAt(lower, posture))) lower = c;
      if (v > targetMm + 1e-9 && (!higher || v < valueAt(higher, posture))) higher = c;
    });
    var bv = valueAt(best.c, posture);
    return {
      best: best.c, value: bv, delta: bv - targetMm,
      pct: targetMm > 0 ? (bv - targetMm) / targetMm * 100 : null,
      lower: lower, higher: higher,
      exact: Math.abs(bv - targetMm) < 0.5
    };
  }

  var api = { UNITS: UNITS, toMm: toMm, convert: convert, fmt: fmt, round: round, rangeValues: rangeValues,
              enumerate: enumerate, withAddon: withAddon, nearest: nearest, valueAt: valueAt, genLabel: genLabel };
  root.ShuntEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
