/* Pterion Prep — shunt valve converter UI (requires shunt-engine.js and #shunt-data). */
(function () {
  'use strict';
  var E = window.ShuntEngine;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function opt(value, label, selected) { return '<option value="' + esc(value) + '"' + (selected ? ' selected' : '') + '>' + esc(label) + '</option>'; }

  var DATA = JSON.parse($('shunt-data').textContent);
  var BY = {}; DATA.forEach(function (v) { BY[v.id] = v; });
  var BASES = DATA.filter(function (v) { return v.convertible && !v.addon; });
  var EXCLUDED = DATA.filter(function (v) { return !v.convertible; });

  // Add-on gravitational units: [{key, label, group, mm}]
  var ADDONS = [];
  DATA.filter(function (v) { return v.addon && v.convertible; }).forEach(function (v) {
    E.enumerate(v).forEach(function (c) {
      var cm = E.round(c.upright / 10, 1), label;
      if (v.id === 'siphonx') label = 'SiphonX — +200 mmH₂O upright';
      else if (/^paedi/.test(c.label)) label = 'paediSHUNTASSISTANT — 10 cmH₂O';
      else label = v.name.replace(/ \(.*\)$/, '') + ' — ' + cm + ' cmH₂O';
      ADDONS.push({ key: v.id + ':' + c.label, label: label, group: v.name, mm: c.upright });
    });
  });
  var ADDON_BY = {}; ADDONS.forEach(function (a) { ADDON_BY[a.key] = a; });

  function valveOptions(selected, withAll) {
    var html = withAll ? opt('all', 'All valves (closest setting on each)', selected === 'all') : '';
    var groups = {};
    BASES.forEach(function (v) { (groups[v.maker] = groups[v.maker] || []).push(v); });
    Object.keys(groups).forEach(function (g) {
      html += '<optgroup label="' + esc(g) + '">' + groups[g].map(function (v) { return opt(v.id, v.name, v.id === selected); }).join('') + '</optgroup>';
    });
    return html;
  }
  function addonOptions(selected) {
    var html = opt('', 'None', !selected), last = null;
    ADDONS.forEach(function (a) {
      if (a.group !== last) { if (last !== null) html += '</optgroup>'; html += '<optgroup label="' + esc(a.group) + '">'; last = a.group; }
      html += opt(a.key, a.label, a.key === selected);
    });
    return html + (last ? '</optgroup>' : '');
  }
  function postureOf(v, variantId) {
    if (v.variants && variantId) { var va = v.variants.filter(function (x) { return x.id === variantId; })[0]; if (va && va.posture) return va.posture; }
    return v.posture;
  }

  // ---------- state ----------
  var S = { mode: 'valve', src: 'hakim-programmable', srcVariant: '', srcSetting: 9, srcDims: {}, srcAddon: '',
            pVal: 100, pUnit: 'mmH2O', posture: 'lying', tgt: 'all', tgtVariant: '', tgtDims: {}, tgtAddon: '' };

  function readHash() {
    if (!location.hash || location.hash.length < 2) return;
    var q = new URLSearchParams(location.hash.slice(1));
    function g(k) { return q.has(k) ? q.get(k) : null; }
    if (g('m')) S.mode = g('m') === 'pressure' ? 'pressure' : 'valve';
    if (g('s') && BY[g('s')] && BY[g('s')].convertible && !BY[g('s')].addon) S.src = g('s');
    if (g('sv') !== null) S.srcVariant = g('sv');
    if (g('si') !== null) S.srcSetting = parseInt(g('si'), 10) || 0;
    if (g('sd')) { try { S.srcDims = JSON.parse(g('sd')); } catch (e) {} }
    if (g('sa') !== null && (g('sa') === '' || ADDON_BY[g('sa')])) S.srcAddon = g('sa');
    if (g('pv') !== null) S.pVal = parseFloat(g('pv'));
    if (g('pu') && E.UNITS[g('pu')]) S.pUnit = g('pu');
    if (g('po')) S.posture = g('po') === 'upright' ? 'upright' : 'lying';
    if (g('t') && (g('t') === 'all' || (BY[g('t')] && BY[g('t')].convertible && !BY[g('t')].addon))) S.tgt = g('t');
    if (g('tv') !== null) S.tgtVariant = g('tv');
    if (g('td')) { try { S.tgtDims = JSON.parse(g('td')); } catch (e) {} }
    if (g('ta') !== null && (g('ta') === '' || ADDON_BY[g('ta')])) S.tgtAddon = g('ta');
  }
  function writeHash() {
    var q = new URLSearchParams();
    q.set('m', S.mode); q.set('po', S.posture);
    if (S.mode === 'valve') {
      q.set('s', S.src); if (S.srcVariant) q.set('sv', S.srcVariant);
      if (BY[S.src].gen) q.set('sd', JSON.stringify(S.srcDims)); else q.set('si', S.srcSetting);
      if (S.srcAddon) q.set('sa', S.srcAddon);
    } else { q.set('pv', S.pVal); q.set('pu', S.pUnit); }
    q.set('t', S.tgt);
    if (S.tgt !== 'all') { if (S.tgtVariant) q.set('tv', S.tgtVariant); if (Object.keys(S.tgtDims).length) q.set('td', JSON.stringify(S.tgtDims)); if (S.tgtAddon) q.set('ta', S.tgtAddon); }
    history.replaceState(null, '', '#' + q.toString());
  }

  // ---------- source controls ----------
  function renderSourceControls() {
    var v = BY[S.src];
    $('sv-src').innerHTML = valveOptions(S.src, false);
    // variant
    var vw = $('sv-src-variant-wrap');
    if (v.variants) {
      if (!v.variants.some(function (x) { return x.id === S.srcVariant; })) S.srcVariant = v.variants.length > 1 ? v.variants[1].id : v.variants[0].id;
      $('sv-src-variant').innerHTML = v.variants.map(function (x) { return opt(x.id, x.label, x.id === S.srcVariant); }).join('');
      vw.hidden = false;
    } else { vw.hidden = true; S.srcVariant = ''; }
    // setting / dims
    var dims = $('sv-src-dims'), html = '';
    if (v.gen) {
      Object.keys(v.gen).forEach(function (k) {
        var spec = v.gen[k], vals = E.rangeValues(spec);
        var cur = (S.srcDims[k] !== undefined && vals.indexOf(Number(S.srcDims[k])) >= 0) ? Number(S.srcDims[k])
                  : (vals.indexOf(k === 'dp' ? 5 : 20) >= 0 ? (k === 'dp' ? 5 : 20) : vals[0]);
        S.srcDims[k] = cur;
        html += '<label class="sv-field"><span>' + esc(spec.label) + '</span><select data-dim="' + k + '">' +
          vals.map(function (x) { return opt(x, (k === 'grav' && x === 0 && spec.options) ? '0 (none)' : x + ' cmH₂O', x === cur); }).join('') + '</select></label>';
      });
      Object.keys(S.srcDims).forEach(function (k) { if (!v.gen[k]) delete S.srcDims[k]; });
    } else {
      var cands = E.enumerate(v, { variant: S.srcVariant || null });
      if (S.srcSetting >= cands.length || S.srcSetting < 0) S.srcSetting = Math.min(Math.floor(cands.length / 2), cands.length - 1);
      html = '<label class="sv-field"><span>Setting</span><select data-setting="1">' + cands.map(function (c, i) {
        return opt(i, c.label + ' — ' + E.fmt(c.lying, 'mmH2O') + ' mmH₂O' + (c.posture !== 'none' && c.upright !== null && c.upright !== c.lying ? ' lying / ' + E.fmt(c.upright, 'mmH2O') + ' upright' : ''), i === S.srcSetting);
      }).join('') + '</select></label>';
      S.srcDims = {};
    }
    dims.innerHTML = html;
    // add-on: only meaningful when the valve has no posture device of its own
    var aw = $('sv-src-addon-wrap');
    if (postureOf(v, S.srcVariant) === 'none') { $('sv-src-addon').innerHTML = addonOptions(S.srcAddon); aw.hidden = false; }
    else { aw.hidden = true; S.srcAddon = ''; }
  }

  function sourceCandidate() {
    if (S.mode === 'pressure') {
      var mm = E.toMm(S.pVal, S.pUnit);
      return isNaN(mm) ? null : { label: 'Entered pressure', full: E.fmt(S.pVal, 'mmH2O') === '—' ? '' : S.pVal + ' ' + E.UNITS[S.pUnit].label, lying: mm, upright: mm, posture: 'none' };
    }
    var v = BY[S.src], c;
    if (v.gen) c = E.enumerate(v, { fixed: S.srcDims })[0];
    else c = E.enumerate(v, { variant: S.srcVariant || null })[S.srcSetting];
    if (c && S.srcAddon && ADDON_BY[S.srcAddon]) c = E.withAddon(c, ADDON_BY[S.srcAddon].mm, ADDON_BY[S.srcAddon].label);
    return c;
  }

  function unitsRow(mm) {
    return ['mmH2O', 'cmH2O', 'mmHg', 'kPa'].map(function (u) {
      return '<span class="sv-u"><b>' + E.fmt(mm, u) + '</b> ' + E.UNITS[u].label + '</span>';
    }).join('');
  }
  var MRI_TXT = { ok: 'MRI: no setting change', check: 'MRI: resistant — still confirm', high: 'MRI: may change — always check', none: 'MRI: no setting to change' };
  function mriPill(v) { var l = (v.mri && v.mri.level) || 'none'; return '<span class="sv-pill sv-mri-' + l + '" title="' + esc((v.mri && v.mri.label) || '') + '">' + MRI_TXT[l] + '</span>'; }

  function renderSourceOut(c) {
    var out = $('sv-src-out');
    if (!c) { out.innerHTML = '<p class="sv-small">Enter a valid pressure.</p>'; return null; }
    var mm = E.valueAt(c, S.posture), v = S.mode === 'valve' ? BY[S.src] : null;
    var range = S.posture === 'upright' ? (c.upLo !== undefined ? [c.upLo, c.upHi] : null) : (c.lo !== undefined ? [c.lo, c.hi] : null);
    var html = '<div class="sv-big"><span class="sv-big-v">' + E.fmt(mm, 'mmH2O') + '</span> mmH₂O <span class="sv-big-p">' + (S.posture === 'upright' ? 'upright' : 'lying') + '</span></div>';
    html += '<div class="sv-units-row">' + unitsRow(mm) + '</div>';
    var lines = [];
    if (v) {
      lines.push('<b>' + esc(v.full_name) + '</b> · ' + esc(c.full || c.label) + (c.addon ? '' : '') + ' ' + mriPill(v));
      lines.push('Lying <b>' + E.fmt(c.lying, 'mmH2O') + '</b> · upright <b>' + E.fmt(c.upright, 'mmH2O') + '</b> mmH₂O' +
        (postureOf(v, S.srcVariant) === 'none' && !c.addon ? ' <span class="sv-muted">(no posture device — upright opening pressure unchanged, so siphoning is not countered)</span>' : ''));
      if (range) lines.push('Manufacturer range: ' + range[0] + '–' + range[1] + ' mmH₂O (nominal = midpoint)');
      if (c.tol) lines.push('Tolerance ±' + c.tol + ' mmH₂O');
      if (c.sys) lines.push('Measured with a 120 cm peritoneal catheter at 20 mL/h: ' + c.sys + ' mmH₂O (Integra IFU)');
      if (c.note) lines.push(esc(c.note));
      if (v.measured) lines.push('<span class="sv-muted">' + esc(v.measured) + '</span>');
    } else {
      lines.push('Entered value treated as the opening pressure in the selected posture.');
    }
    out.innerHTML = html + '<ul class="sv-lines">' + lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>';
    return mm;
  }

  // ---------- target ----------
  function renderTargetControls() {
    $('sv-tgt').innerHTML = valveOptions(S.tgt, true);
    var vw = $('sv-tgt-variant-wrap'), dims = $('sv-tgt-dims'), aw = $('sv-tgt-addon-wrap');
    if (S.tgt === 'all') { vw.hidden = true; aw.hidden = true; dims.innerHTML = ''; S.tgtVariant = ''; S.tgtDims = {}; S.tgtAddon = ''; return; }
    var v = BY[S.tgt];
    if (v.variants) {
      if (S.tgtVariant && !v.variants.some(function (x) { return x.id === S.tgtVariant; })) S.tgtVariant = '';
      $('sv-tgt-variant').innerHTML = opt('', 'All models / ranges', !S.tgtVariant) + v.variants.map(function (x) { return opt(x.id, x.label, x.id === S.tgtVariant); }).join('');
      vw.hidden = false;
    } else { vw.hidden = true; S.tgtVariant = ''; }
    var html = '';
    if (v.gen) {
      Object.keys(v.gen).forEach(function (k) {
        var spec = v.gen[k];
        if (spec.adjustable) return;                       // adjustable dims are searched automatically
        var vals = E.rangeValues(spec), cur = S.tgtDims[k];
        html += '<label class="sv-field"><span>' + esc(spec.label) + '</span><select data-dim="' + k + '">' + opt('', 'Any (search all)', cur === undefined || cur === '') +
          vals.map(function (x) { return opt(x, (k === 'grav' && x === 0) ? '0 (none)' : x + ' cmH₂O', String(x) === String(cur)); }).join('') + '</select></label>';
      });
    } else S.tgtDims = {};
    dims.innerHTML = html;
    if (postureOf(v, S.tgtVariant) === 'none') { $('sv-tgt-addon').innerHTML = addonOptions(S.tgtAddon); aw.hidden = false; }
    else { aw.hidden = true; S.tgtAddon = ''; }
  }

  function rowsFor(v, variantId, fixed, addonKey) {
    var cands = E.enumerate(v, { variant: variantId || null, fixed: fixed || null });
    if (addonKey && ADDON_BY[addonKey]) cands = cands.map(function (c) { return E.withAddon(c, ADDON_BY[addonKey].mm, ADDON_BY[addonKey].label); });
    return cands;
  }
  function displayLabel(v, c) {
    // Lying comparisons on gravitational Miethke valves: the gravitational unit is irrelevant, so say so.
    if (S.posture === 'lying' && v.gen && v.gen.dp && v.gen.grav) {
      return 'DP ' + c.dims.dp + ' cmH₂O <span class="sv-muted">· gravitational ' + (c.dims.grav ? c.dims.grav + ' cmH₂O' : 'none') + ' (adds only upright)</span>';
    }
    if (c.variant) return 'Position ' + esc(c.label) + (c.addon ? ' <span class="sv-muted">+ ' + esc(c.addon) + '</span>' : '');
    return esc(c.full || c.label);
  }
  function cell(mm, c) {
    var range = S.posture === 'upright' ? (c.upLo !== undefined ? ' <span class="sv-muted">(' + c.upLo + '–' + c.upHi + ')</span>' : '') : (c.lo !== undefined ? ' <span class="sv-muted">(' + c.lo + '–' + c.hi + ')</span>' : '');
    return '<b>' + E.fmt(mm, 'mmH2O') + '</b> mmH₂O' + range + '<br><span class="sv-muted">' + E.fmt(mm, 'cmH2O') + ' cmH₂O · ' + E.fmt(mm, 'mmHg') + ' mmHg</span>';
  }
  var SRC_OTHER = null;
  function renderTable(srcMm) {
    var body = $('sv-out').querySelector('tbody');
    if (srcMm === null || srcMm === undefined || isNaN(srcMm)) { body.innerHTML = ''; return; }
    var jobs = [];
    if (S.tgt === 'all') BASES.forEach(function (v) { if (v.variants) v.variants.forEach(function (va) { jobs.push([v, va.id, null, '']); }); else jobs.push([v, '', null, '']); });
    else { var v = BY[S.tgt]; if (v.variants && !S.tgtVariant) v.variants.forEach(function (va) { jobs.push([v, va.id, null, S.tgtAddon]); }); else jobs.push([v, S.tgtVariant, S.tgtDims, S.tgtAddon]); }
    body.innerHTML = jobs.map(function (j) {
      var v = j[0], res = E.nearest(rowsFor(v, j[1], j[2], j[3]), srcMm, S.posture, SRC_OTHER);
      if (!res) return '';
      var va = j[1] ? v.variants.filter(function (x) { return x.id === j[1]; })[0] : null;
      var name = '<a href="' + esc('/shunts/valves/#' + v.id) + '">' + esc(v.name) + '</a>' + (va ? '<br><span class="sv-muted">' + esc(va.label) + '</span>' : '') + (j[3] ? '<br><span class="sv-muted">+ ' + esc(ADDON_BY[j[3]].label) + '</span>' : '');
      var d = res.exact ? '<span class="sv-exact">match</span>' : ((res.delta > 0 ? '+' : '') + E.fmt(res.delta, 'mmH2O') + ' mmH₂O' + (res.pct !== null ? '<br><span class="sv-muted">' + (res.pct > 0 ? '+' : '') + E.round(res.pct, 0) + '%</span>' : ''));
      var nb = function (c) { return c ? esc(c.label) + ' <span class="sv-muted">(' + E.fmt(E.valueAt(c, S.posture), 'mmH2O') + ')</span>' : '—'; };
      return '<tr class="' + (res.exact ? 'sv-row-exact' : '') + '"><td>' + name + '</td><td>' + displayLabel(v, res.best) + (res.best.min ? ' <span class="sv-pill sv-mri-high">min ≥400</span>' : '') + '</td><td>' + cell(res.value, res.best) +
        '</td><td>' + d + '</td><td>' + E.fmt(res.best.lying, 'mmH2O') + ' / ' + E.fmt(res.best.upright, 'mmH2O') + '</td><td>' + nb(res.lower) + '<br>' + nb(res.higher) + '</td></tr>';
    }).join('');
    $('sv-excluded').innerHTML = 'Not convertible (no single opening pressure per setting): ' + EXCLUDED.map(function (v) {
      return '<a href="' + esc('/shunts/valves/#' + v.id) + '">' + esc(v.name) + '</a>'; }).join(' · ') + '.';
  }

  // ---------- unit converter ----------
  function renderUnits() {
    var mm = E.toMm($('sv-u-val').value, $('sv-u-unit').value);
    $('sv-u-out').innerHTML = isNaN(mm) ? '' : unitsRow(mm);
  }

  // ---------- wiring ----------
  function update(rebuild) {
    $('sv-src-valve').hidden = S.mode !== 'valve';
    $('sv-src-pressure').hidden = S.mode !== 'pressure';
    if (rebuild) { renderSourceControls(); renderTargetControls(); }
    var sc = sourceCandidate(); SRC_OTHER = sc ? E.valueAt(sc, S.posture === 'upright' ? 'lying' : 'upright') : null;
    var mm = renderSourceOut(sc);
    renderTable(mm);
    writeHash();
  }

  readHash();
  document.querySelectorAll('input[name="sv-mode"]').forEach(function (r) { r.checked = r.value === S.mode; r.addEventListener('change', function () { S.mode = r.value; update(false); }); });
  document.querySelectorAll('input[name="sv-posture"]').forEach(function (r) { r.checked = r.value === S.posture; r.addEventListener('change', function () { S.posture = r.value; update(false); }); });
  $('sv-p-val').value = S.pVal; $('sv-p-unit').value = S.pUnit;
  $('sv-p-val').addEventListener('input', function () { S.pVal = parseFloat(this.value); update(false); });
  $('sv-p-unit').addEventListener('change', function () { S.pUnit = this.value; update(false); });
  $('sv-src').addEventListener('change', function () { S.src = this.value; S.srcVariant = ''; S.srcDims = {}; S.srcSetting = -1; S.srcAddon = ''; update(true); });
  $('sv-src-variant').addEventListener('change', function () { S.srcVariant = this.value; S.srcSetting = -1; S.srcAddon = ''; update(true); });
  $('sv-src-dims').addEventListener('change', function (e) {
    if (e.target.dataset.dim) S.srcDims[e.target.dataset.dim] = Number(e.target.value);
    if (e.target.dataset.setting) S.srcSetting = parseInt(e.target.value, 10);
    update(false);
  });
  $('sv-src-addon').addEventListener('change', function () { S.srcAddon = this.value; update(false); });
  $('sv-tgt').addEventListener('change', function () { S.tgt = this.value; S.tgtVariant = ''; S.tgtDims = {}; S.tgtAddon = ''; update(true); });
  $('sv-tgt-variant').addEventListener('change', function () { S.tgtVariant = this.value; S.tgtAddon = ''; update(true); });
  $('sv-tgt-dims').addEventListener('change', function (e) {
    if (e.target.dataset.dim) { if (e.target.value === '') delete S.tgtDims[e.target.dataset.dim]; else S.tgtDims[e.target.dataset.dim] = Number(e.target.value); }
    update(false);
  });
  $('sv-tgt-addon').addEventListener('change', function () { S.tgtAddon = this.value; update(false); });
  $('sv-u-val').addEventListener('input', renderUnits); $('sv-u-unit').addEventListener('change', renderUnits);
  $('sv-copy-link').addEventListener('click', function () {
    var msg = $('sv-copy-msg');
    (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(
      function () { msg.textContent = 'Link copied.'; }, function () { msg.textContent = location.href; });
  });
  update(true); renderUnits();
})();
