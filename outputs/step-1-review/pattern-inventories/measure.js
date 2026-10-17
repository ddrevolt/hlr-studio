const PID = '__PID__';
const START = __START__;
const TIME_LIMIT = 30000;
const WITH_F = __WITHF__;
const t0 = Date.now();
const r05 = x => Math.round(x * 2) / 2;
const r2 = x => Math.round(x * 100) / 100;
const CASE = { ORIGINAL: 'O', UPPER: 'U', LOWER: 'L', TITLE: 'T', SMALL_CAPS: 'SC', SMALL_CAPS_FORCED: 'SCF' };
function lhKey(l) { if (!l || l.unit === 'AUTO') return 'auto'; return r2(l.value) + (l.unit === 'PIXELS' ? 'px' : '%'); }
function lsKey(l) { if (!l) return 'none'; return r2(l.value) + (l.unit === 'PIXELS' ? 'px' : '%'); }
function inc(o, k, n = 1) { o[k] = (o[k] || 0) + n; }
function hex(c) { const h = v => Math.round(v * 255).toString(16).padStart(2, '0'); return ('#' + h(c.r) + h(c.g) + h(c.b)).toUpperCase(); }
function paintKey(p) { if (p.type === 'SOLID') { const op = p.opacity === undefined ? 1 : p.opacity; return hex(p.color) + (op < 0.995 ? '@' + Math.round(op * 100) : ''); } return p.type; }
const visPaint = p => p.visible !== false && (p.opacity === undefined || p.opacity > 0);
const SEGF = ['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase'];

let F = null;
if (WITH_F) {
  const cp = await figma.getNodeByIdAsync('2:31579');
  await cp.loadAsync();
  F = [];
  for (const k of cp.children) {
    if (k.type !== 'TEXT' || !k.visible) continue;
    const segs = k.getStyledTextSegments(SEGF).filter(s => s.characters.trim());
    F.push({ id: k.id, name: k.name.slice(0, 40), x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width), h: Math.round(k.height), al: k.textAlignHorizontal, n: k.characters.length, chars: k.characters.slice(0, 70), segs: segs.slice(0, 6).map(s => [s.fontName.family, s.fontName.style, r05(s.fontSize), lhKey(s.lineHeight), lsKey(s.letterSpacing), s.textCase, s.characters.length, s.characters.slice(0, 24)]) });
  }
}

const page = await figma.getNodeByIdAsync(PID);
await page.loadAsync();
const tLoad = Date.now() - t0;

function bucketOf(n) {
  if (n.type === 'TEXT') return 'loose-text';
  const w = Math.round(n.width), h = Math.round(n.height);
  if (w === 1080 && h === 1350) return '1080x1350';
  if (w === 1080 && h === 1920) return '1080x1920';
  if (w === 1080 && h === 1080) return '1080x1080';
  if (w === 1080) return '1080w-other';
  if (w === 700) return 'w700';
  if (w === 1200) return 'w1200';
  if (w === 1440) return 'w1440';
  if (w === 375) return 'w375';
  return 'other';
}
const FRAMEISH = new Set(['FRAME', 'GROUP', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE']);
const EB = new Set(['1080x1350', '1080x1920', '1080x1080', 'w700', 'w1200']);
const SHAPE_TYPES = ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'RECTANGLE', 'VECTOR', 'LINE'];
const SHAPE_SET = new Set(SHAPE_TYPES);

const tops = [];
function enumTops(c, v) { for (const k of c.children) { const kv = v && k.visible; if (k.type === 'SECTION') enumTops(k, kv); else tops.push([k, kv]); } }
enumTops(page, true);

const fonts = [], fontIdx = new Map(), keyCounts = new Map();
const famSizes = {}, bk = {}, E = {};
const C = { segs: 0, caseUpper: 0, literalUpper: 0, either: 0, align: {} };
const D = { alModes: {}, itemSpacing: {}, padding: {}, sw: {}, sc: {}, swLine: {}, scLine: {}, strokeNodes: {}, rad: {}, rad0: 0, radNZ: 0 };
const cnt = { tops: tops.length, processed: 0, hiddenTops: 0, slices: 0, topTypes: {}, texts: 0, emptyTexts: 0, hiddenTexts: 0, segsWhitespace: 0, eFrames: 0, eNoRender: 0 };
const visMemo = new Map();
function isVis(node, rootId) {
  const id = node.id;
  if (id === rootId) return true;
  const m = visMemo.get(id);
  if (m !== undefined) return m;
  let r = node.visible;
  if (r) { const p = node.parent; r = p ? isVis(p, rootId) : true; }
  visMemo.set(id, r);
  return r;
}
const hits = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
let next = null;
for (let i = START; i < tops.length; i++) {
  if (Date.now() - t0 > TIME_LIMIT) { next = i; break; }
  const X = tops[i][0], xv = tops[i][1];
  cnt.processed++;
  if (!xv) { cnt.hiddenTops++; continue; }
  if (X.type === 'SLICE') { cnt.slices++; continue; }
  inc(cnt.topTypes, X.type);
  visMemo.clear();
  const b = bucketOf(X);
  const frameish = FRAMEISH.has(X.type);
  if (!bk[b]) bk[b] = { frames: 0, withText: 0, nonFrameTops: 0, sizes: {}, body: {} };
  const B = bk[b];
  if (frameish) B.frames++; else B.nonFrameTops++;
  const doE = frameish && EB.has(b);
  const tb19 = b === '1080x1920';
  let xb = null, ex = null;
  if (doE) { xb = X.absoluteBoundingBox; ex = { L: Infinity, R: Infinity, T: Infinity, Bo: Infinity, rL: Infinity, rR: Infinity, rT: Infinity, rBo: Infinity }; }
  let texts = [];
  if (X.type === 'TEXT') texts = [X]; else if ('findAllWithCriteria' in X) texts = X.findAllWithCriteria({ types: ['TEXT'] });
  let any = false;
  for (const t of texts) {
    if (!isVis(t, X.id)) { cnt.hiddenTexts++; continue; }
    const chars = t.characters;
    if (!chars.trim()) { cnt.emptyTexts++; continue; }
    cnt.texts++; any = true;
    inc(C.align, t.textAlignHorizontal);
    const body = chars.length >= 60;
    const segs = t.getStyledTextSegments(SEGF);
    for (const s of segs) {
      const sc = s.characters;
      if (!sc.trim()) { cnt.segsWhitespace++; continue; }
      const fam = s.fontName.family, fk = fam + '|' + s.fontName.style;
      let fi = fontIdx.get(fk);
      if (fi === undefined) { fi = fonts.length; fonts.push(fk); fontIdx.set(fk, fi); }
      const size = r05(s.fontSize);
      const key = fi + '|' + size + '|' + lhKey(s.lineHeight) + '|' + lsKey(s.letterSpacing) + '|' + (CASE[s.textCase] || s.textCase);
      keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
      if (!famSizes[fam]) famSizes[fam] = {};
      inc(famSizes[fam], size);
      inc(B.sizes, size);
      if (body) inc(B.body, size);
      C.segs++;
      const cu = s.textCase === 'UPPER';
      const lu = sc.toUpperCase() === sc && sc.toLowerCase() !== sc;
      if (cu) C.caseUpper++;
      if (lu) C.literalUpper++;
      if (cu || lu) C.either++;
    }
    if (doE && xb) {
      const tb = t.absoluteBoundingBox;
      if (tb && hits(tb, xb)) {
        ex.L = Math.min(ex.L, tb.x - xb.x); ex.R = Math.min(ex.R, xb.x + xb.width - tb.x - tb.width);
        ex.T = Math.min(ex.T, tb.y - xb.y); ex.Bo = Math.min(ex.Bo, xb.y + xb.height - tb.y - tb.height);
      }
      const rb = t.absoluteRenderBounds;
      if (rb && hits(rb, xb)) {
        ex.rL = Math.min(ex.rL, rb.x - xb.x); ex.rR = Math.min(ex.rR, xb.x + xb.width - rb.x - rb.width);
        ex.rT = Math.min(ex.rT, rb.y - xb.y); ex.rBo = Math.min(ex.rBo, xb.y + xb.height - rb.y - rb.height);
      }
    }
  }
  if (any) B.withText++;
  if (doE && ex.L !== Infinity) {
    cnt.eFrames++;
    if (!E[b]) E[b] = tb19 ? { n: 0, L: {}, R: {}, T: {}, Bo: {}, rL: {}, rR: {}, rT: {}, rBo: {} } : { n: 0, L: {}, R: {}, rL: {}, rR: {} };
    const eb = E[b]; eb.n++;
    const ks = tb19 ? ['L', 'R', 'T', 'Bo'] : ['L', 'R'];
    for (const k of ks) inc(eb[k], Math.round(ex[k]));
    if (ex.rL !== Infinity) { for (const k of ks) inc(eb['r' + k], Math.round(ex['r' + k])); } else cnt.eNoRender++;
  }
  let shapes = [];
  if ('findAllWithCriteria' in X) shapes = X.findAllWithCriteria({ types: SHAPE_TYPES });
  if (SHAPE_SET.has(X.type)) shapes = [...shapes, X];
  for (const n of shapes) {
    if (!isVis(n, X.id)) continue;
    const ty = n.type;
    if (ty === 'FRAME' || ty === 'COMPONENT' || ty === 'INSTANCE' || ty === 'COMPONENT_SET') {
      const lm = n.layoutMode;
      if (lm && lm !== 'NONE') {
        inc(D.alModes, lm);
        if (lm !== 'GRID') inc(D.itemSpacing, n.primaryAxisAlignItems === 'SPACE_BETWEEN' ? 'auto' : r2(n.itemSpacing));
        inc(D.padding, r2(n.paddingTop)); inc(D.padding, r2(n.paddingRight)); inc(D.padding, r2(n.paddingBottom)); inc(D.padding, r2(n.paddingLeft));
      }
      if (ty === 'COMPONENT_SET') continue;
    }
    let hasStroke = false;
    const st = n.strokes;
    if (st && st.length) {
      const vs = st.filter(visPaint);
      if (vs.length) {
        const sw = n.strokeWeight;
        let pos, swk;
        if (typeof sw === 'number') { pos = sw > 0; swk = r2(sw); }
        else { const a = [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight]; pos = a.some(x => x > 0); swk = a.map(r2).join('/'); }
        if (pos) {
          hasStroke = true;
          inc(D.strokeNodes, ty);
          if (ty === 'LINE') { inc(D.swLine, swk); for (const p of vs) inc(D.scLine, paintKey(p)); }
          else { inc(D.sw, swk); for (const p of vs) inc(D.sc, paintKey(p)); }
        }
      }
    }
    if (ty === 'FRAME' || ty === 'COMPONENT' || ty === 'INSTANCE' || ty === 'RECTANGLE') {
      const f = n.fills;
      const hasFill = Array.isArray(f) && f.some(visPaint);
      if (hasFill || hasStroke) {
        const cr = n.cornerRadius;
        if (typeof cr === 'number') { if (cr === 0) D.rad0++; else { D.radNZ++; inc(D.rad, r2(cr)); } }
        else { D.radNZ++; inc(D.rad, [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius].map(r2).join('/')); }
      }
    }
  }
}
function stats(h) {
  const arr = Object.entries(h).map(e => [Number(e[0]), e[1]]).sort((a, b) => a[0] - b[0]);
  let N = 0; for (const e of arr) N += e[1];
  if (!N) return null;
  const at = r => { let acc = 0; for (const e of arr) { acc += e[1]; if (acc >= r) return e[0]; } return arr[arr.length - 1][0]; };
  const med = N % 2 ? at((N + 1) / 2) : (at(N / 2) + at(N / 2 + 1)) / 2;
  return { n: N, min: arr[0][0], p10: at(Math.ceil(0.1 * N)), med, max: arr[arr.length - 1][0] };
}
const Estats = {};
for (const b of Object.keys(E)) { Estats[b] = {}; for (const k of Object.keys(E[b])) { if (k === 'n') continue; const s = stats(E[b][k]); if (s) Estats[b][k] = s; } }
const keysSorted = [...keyCounts.entries()].sort((a, b) => b[1] - a[1]);
let K = Math.min(400, keysSorted.length);
function omitted() { let n = 0, s = 0; for (let j = K; j < keysSorted.length; j++) { n++; s += keysSorted[j][1]; } return { n, segs: s }; }
function build(withE) { return { page: page.name, start: START, next, ms: Date.now() - t0, tLoad, cnt, fonts, keysTotal: keysSorted.length, keysOmitted: omitted(), keys: keysSorted.slice(0, K), famSizes, bk, C, D, Estats, E: withE ? E : 'omitted', F }; }
let out = build(true), s = JSON.stringify(out);
while (s.length > 17500 && K > 120) { K = Math.max(120, Math.floor(K * 0.75)); out = build(true); s = JSON.stringify(out); }
if (s.length > 17500) { out = build(false); s = JSON.stringify(out); }
if (s.length > 18500) {
  for (const k of ['itemSpacing', 'padding', 'sw', 'sc', 'rad', 'swLine', 'scLine']) D[k] = Object.fromEntries(Object.entries(D[k]).sort((a, b) => b[1] - a[1]).slice(0, 30));
  out = build(false); out.dTrimmed = true;
}
return out;
