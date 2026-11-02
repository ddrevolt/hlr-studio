// HLR recreate tooling. Paste this whole file at the top of a use_figma call (plugin context), then:
//   const o = measure(originalFrame), r = measure(rebuildFrame);
//   const vars = await colorVars('light');           // pick the Semantic mode the rebuild uses
//   return { A: compare(o, r, 'A'), B: compare(o, r, 'B'), ledger: await offSystem(rebuildFrame, vars) };
// Read only. Never writes to the file.
//
// measure(): reads text, marks and their positions as fractions of the frame, so an original (client
//   frame) and a rebuild (frame or instance) are scored the same way. Skips hidden nodes and
//   Placeholder subtrees. Handle text (starts with "@") counts as a mark.
// compare(o, r, mode):
//   'A' system-faithful: every size on the Social scale and the nearest step to the original, placement
//        within a third of the frame and 0.06, colour within 0.2. Quantising by more than x1.25 or
//        x0.8 is reported in gaps (a scale gap to propose), not failed.
//   'B' work-faithful: size within 3 percent, position within 0.01, colour within 0.03, same face,
//        same displayed case, same alignment, same line count.
// offSystem(root, vars): the Mode B ledger. Every size off the scale, fill not bound to a variable
//   (with the nearest system colour variable and its distance), hand line height, unbound spacing.
// Thresholds and the SCALE list are [derived]; Donnie ratifies them.
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const MARK = /Decor|Star|Mark|Wordmark|Handle/i;
const SCALE = [32, 40, 54, 72, 96, 127, 170, 226]; // Social: label, body, title, headline, display s, m, l, xl
const shapeOf = (chars, cs) => {
  let s = chars;
  if (cs === 'LOWER') s = s.toLowerCase(); else if (cs === 'UPPER' || cs === 'SMALL_CAPS') s = s.toUpperCase();
  return s === s.toLowerCase() ? 'lower' : s === s.toUpperCase() ? 'upper' : 'mixed';
};
function measure(root) {
  const rb = root.absoluteBoundingBox, W = rb.width, H = rb.height;
  const rel = n => { const b = n.absoluteBoundingBox; return { x: +((b.x - rb.x) / W).toFixed(3), y: +((b.y - rb.y) / H).toFixed(3), w: +(b.width / W).toFixed(3), h: +(b.height / H).toFixed(3), cx: +((b.x - rb.x + b.width / 2) / W).toFixed(3), cy: +((b.y - rb.y + b.height / 2) / H).toFixed(3) }; };
  const f0 = root.fills && root.fills[0];
  const out = { w: Math.round(W), h: Math.round(H), bg: f0 && f0.type === 'SOLID' && f0.visible !== false ? hex(f0.color) : null, texts: [], marks: [] };
  const walk = (n, inPh) => {
    if (n.visible === false) return;
    const ph = inPh || /Placeholder/i.test(n.name);
    if (n.type === 'TEXT') {
      if (ph || !n.characters.trim()) return;
      if (/^@/.test(n.characters.trim())) { out.marks.push({ n: 'Handle', ...rel(n) }); return; }
      const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'textCase', 'fills']);
      const big = segs.reduce((a, s) => s.fontSize > a.fontSize ? s : a, segs[0]);
      const col = big.fills && big.fills[0] && big.fills[0].type === 'SOLID' ? hex(big.fills[0].color) : null;
      const sizes = [...new Set(segs.map(s => +s.fontSize.toFixed(1)))];
      const lh = n.lineHeight;
      const lhPx = !lh || lh.unit === 'AUTO' ? big.fontSize * 1.2 : lh.unit === 'PIXELS' ? lh.value : big.fontSize * lh.value / 100;
      out.texts.push({ t: n.characters.replace(/\s+/g, ' ').slice(0, 40), face: big.fontName.family + ' ' + big.fontName.style.replace(/ Italic$/, ''), sizes, size: +big.fontSize.toFixed(1), case: shapeOf(n.characters, big.textCase), align: n.textAlignHorizontal, color: col, lines: sizes.length === 1 ? Math.max(1, Math.round(n.absoluteBoundingBox.height / lhPx)) : null, ...rel(n) });
      return;
    }
    const b = n.absoluteBoundingBox;
    if (b && !ph) {
      const area = (b.width * b.height) / (W * H);
      if (['VECTOR', 'STAR', 'ELLIPSE', 'BOOLEAN_OPERATION', 'POLYGON'].includes(n.type) && area < 0.05 && area > 0.0002) out.marks.push({ n: n.name.slice(0, 24), ...rel(n) });
      else if (n.type === 'INSTANCE' && MARK.test(n.name) && area < 0.1) { out.marks.push({ n: n.name.slice(0, 24), ...rel(n) }); return; }
    }
    if (n.children) for (const c of n.children) walk(c, ph);
  };
  for (const c of root.children) walk(c, false);
  out.texts.sort((a, b) => a.cy - b.cy);
  return out;
}
const nearest = s => SCALE.reduce((a, b) => Math.abs(Math.log(b / s)) < Math.abs(Math.log(a / s)) ? b : a);
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const cdist = (a, b) => { if (!a || !b) return null; const A = rgb(a), B = rgb(b); return +(Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]) / 441).toFixed(3); };
const third = cy => cy < 0.33 ? 'top' : cy < 0.67 ? 'middle' : 'low';
function compare(o, r, mode) {
  const rows = [], gaps = [], used = new Set();
  for (const t of o.texts) {
    const words = new Set(t.t.toLowerCase().split(/\W+/).filter(Boolean));
    let best = -1, bs = 0;
    r.texts.forEach((u, i) => { if (used.has(i)) return; const w = u.t.toLowerCase().split(/\W+/).filter(Boolean); const sc = w.filter(x => words.has(x)).length / Math.max(1, Math.max(words.size, w.length)); if (sc > bs) { bs = sc; best = i; } });
    if (best < 0 || bs < 0.3) { rows.push({ t: t.t, verdict: 'MISSING in rebuild' }); continue; }
    used.add(best); const u = r.texts[best];
    const uz = i => u.sizes[i] || u.sizes[0];
    const sizeOk = mode === 'A' ? (u.sizes.every(s => SCALE.includes(s)) && t.sizes.every((s, i) => nearest(s) === uz(i))) : t.sizes.every((s, i) => Math.abs(uz(i) / s - 1) <= 0.03);
    if (mode === 'A') t.sizes.forEach(s => { const q = nearest(s) / s; if (q > 1.25 || q < 0.8) gaps.push(`${t.t.slice(0, 24)}: size ${s} has no near step (nearest ${nearest(s)}, x${q.toFixed(2)})`); });
    const dx = +(u.cx - t.cx).toFixed(3), dy = +(u.cy - t.cy).toFixed(3), tol = mode === 'A' ? 0.06 : 0.01;
    const posOk = Math.abs(dx) <= tol && Math.abs(dy) <= tol && (mode === 'B' || third(t.cy) === third(u.cy));
    const cd = cdist(t.color, u.color), colorOk = cd == null || cd <= (mode === 'A' ? 0.2 : 0.03);
    const linesOk = mode === 'A' || t.lines == null || u.lines == null || t.lines === u.lines;
    const fails = [!sizeOk && `size ${t.sizes}->${u.sizes}`, !posOk && `pos dx ${dx} dy ${dy}`, t.align !== u.align && 'align', t.case !== u.case && `case ${t.case}->${u.case}`, !colorOk && `color ${t.color}->${u.color}`, mode === 'B' && t.face !== u.face && `face ${t.face}->${u.face}`, !linesOk && `lines ${t.lines}->${u.lines}`].filter(Boolean);
    rows.push({ t: t.t, verdict: fails.length ? 'FAIL' : 'PASS', fails });
  }
  // marks match by kind (handle with handle, any other mark with any other mark), nearest first, each used once
  const kind = m => m.n === 'Handle' ? 'h' : 'm', usedM = new Set();
  const markRows = o.marks.map(m => {
    let bi = -1, bd = 9;
    r.marks.forEach((u, i) => { if (usedM.has(i) || kind(u) !== kind(m)) return; const d = Math.hypot(u.cx - m.cx, u.cy - m.cy); if (d < bd) { bd = d; bi = i; } });
    if (bi >= 0) usedM.add(bi);
    return { n: m.n, at: [m.cx, m.cy], d: bi < 0 ? null : +bd.toFixed(3), verdict: bi >= 0 && bd <= (mode === 'A' ? 0.06 : 0.01) ? 'PASS' : 'FAIL' };
  });
  const extra = [...r.texts.filter((_, i) => !used.has(i)).map(u => 'EXTRA text: ' + u.t), ...r.marks.filter((_, i) => !usedM.has(i)).map(u => `EXTRA mark: ${u.n} at ${u.cx},${u.cy}`)];
  const bgd = cdist(o.bg, r.bg), bgRow = { o: o.bg, r: r.bg, d: bgd, verdict: bgd == null ? 'n/a' : bgd <= (mode === 'A' ? 0.2 : 0.03) ? 'PASS' : 'FAIL' };
  return { mode, bgRow, rows, markRows, extra, gaps: [...new Set(gaps)], pass: bgRow.verdict !== 'FAIL' && rows.every(x => x.verdict === 'PASS') && markRows.every(x => x.verdict === 'PASS') && !extra.length };
}
// Colour variables resolved in one Semantic mode (light, warm, deep, night); other collections use their first mode.
async function colorVars(semanticMode) {
  const out = [];
  for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
    const m = c.modes.find(x => x.name === semanticMode) || c.modes[0];
    for (const id of c.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(id);
      if (v.resolvedType !== 'COLOR') continue;
      let val = v.valuesByMode[m.modeId] ?? Object.values(v.valuesByMode)[0], g = 0;
      while (val && val.type === 'VARIABLE_ALIAS' && g++ < 6) { const t = await figma.variables.getVariableByIdAsync(val.id); val = t.valuesByMode[m.modeId] ?? Object.values(t.valuesByMode)[0]; }
      if (val && val.r !== undefined) out.push({ id: v.id, name: v.name, sem: /Semantic/.test(c.name), hex: hex(val) });
    }
  }
  return out;
}
const nearVar = (h, vars) => vars.map(v => ({ id: v.id, name: v.name, d: cdist(h, v.hex), sem: v.sem })).sort((a, b) => a.d - b.d || (b.sem - a.sem))[0];
async function offSystem(root, vars) {
  const items = [], binds = [];
  const walk = n => {
    if (n.visible === false) return;
    if (n.type === 'TEXT' && n.characters.trim()) {
      for (const s of n.getStyledTextSegments(['fontSize', 'fills'])) {
        if (!SCALE.includes(+s.fontSize.toFixed(1))) items.push(`${n.name}: size ${s.fontSize} off the scale (nearest ${nearest(s.fontSize)})`);
        const f = s.fills && s.fills[0];
        if (f && f.type === 'SOLID' && !(f.boundVariables && f.boundVariables.color)) {
          const h = hex(f.color), nv = nearVar(h, vars);
          items.push(`${n.name}: fill ${h} unbound, nearest ${nv.name} d ${nv.d}${nv.d <= 0.005 ? ' EXACT, bind it' : ''}`);
          if (nv.d <= 0.005) binds.push({ node: n.id, hex: h, varId: nv.id, name: nv.name });
        }
      }
      if (n.lineHeight && n.lineHeight.unit === 'PIXELS' && !n.textStyleId) items.push(`${n.name}: line height ${n.lineHeight.value}px set by hand`);
    }
    if (n.layoutMode && n.layoutMode !== 'NONE') for (const p of ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'itemSpacing']) if (n[p] > 0 && !(n.boundVariables && n.boundVariables[p])) items.push(`${n.name}: ${p} ${n[p]} unbound`);
    if (n.children) for (const c of n.children) walk(c);
  };
  walk(root);
  return { items: [...new Set(items)], binds };
}
