// Board drift guard, part 2 of 2 (Chat 6, 2026-10-23; REVIEW.md section 6 row R19; tightened after the Foundations
// review round 2, F2-02 and F2-05, and round 3, F3-05). Read-only; run with use_figma on HLR Library after pasting the
// output of `python3 board_expect.py <brand home>` as EXPECT below. Checks the six boards on 00 Foundations against the
// pack: each Color swatch cell (its chip binds its own variable; its four lines, label, path, "HEX" or "HEX, alias of
// PATH" and the whole tag line, equal tokens.json; every colour variable has a cell); each Certified pairs cell (its four
// lines, ratio, source, roles or restriction and the pair, equal a contrast-pairs entry; its layer name is that entry's
// source; every entry has exactly one cell; its specimens bind the pair's ink and its swatch the ground); every Type
// specimen (each "Specimen:" label is an exemplar id or one of the board's two named lines, its line equals that text
// in full and in the case the board renders, and the board holds one specimen per text style on each canvas); the
// Strictness map (rows, header and closing equal strictness-map.md; the flag says adopted and ratified on the file's
// date; the status note says what the file says); the Layout board's token lines (each space row, the two margins with
// their alias, tag and ratification, the radius and its tag, the CTA and rule strokes on each canvas with their tags,
// and the breakpoints, against tokens.json and figma.yaml); the stand-in license flag on every board; no text promising
// work from a gate that has closed (the closed-gate rule, shared with closed_gate_scan.py; tests/closed_gate_parity.js
// keeps them in step); and no text cut by a frame that clips it. Layout prose that names no token and the Marks prose
// are read by each close's fresh-context review, not by this guard (REVIEW.md R19).
// Returns the failures; [] passes.
const EXPECT = PASTE_BOARD_EXPECT_OUTPUT_HERE;
// BEGIN closed-gate rule
const closedGatePromises = (() => {
  // Built from char codes, not \u escapes, so the block survives being pasted through a tool that decodes them
  // (a decoded U+2028 inside a regex literal is a syntax error).
  const WS = new RegExp('[\\t\\x0b\\x0c\\r \\x1c-\\x1f\\x85\\xa0' + String.fromCharCode(0x1680, 0x2000) + '-' + String.fromCharCode(0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff) + ']', 'g');
  const norm = t => t.replace(WS, ' ');
  const PAST = '(?:named|ruled|adopted|ratified|decided|chosen|chose|confirmed|closed|routed|set|recorded|approved|built|taken|took|kept|moved|made|picked|added|settled)';
  const AUX = new Set(['is', 'are', 'be', 'being', 'get', 'gets', 'getting', 'to', 'will', 'would', 'shall', 'can', 'could', 'must', 'should', 'may', 'might']);
  const DATED = ' ?(?:, ?|\\(|on |\\(on )?20\\d\\d-\\d\\d', UNDATED = '(?!' + DATED + ')';
  const NOUN = '(?:item|decision|call|question|proposal|ruling|matter|task)';
  const VERB = '(?:will|would|shall|rules|sets|names|decides|chooses|settles|takes|owns|brings|confirms|ratifies|routes)';
  const future = n => { const g0 = 'gate ' + n, g = g0 + '\\b'; return [
    '\\buntil ' + g + '(?! ' + PAST + '\\b[^.;]*\\b20\\d\\d-\\d\\d)',
    '\\b' + g + ' (?:' + VERB + '\\b|to (?!(?:gate|review|step|chat|lane)\\b)[a-z])',
    '\\b' + g + ' (?:is|are)\\b(?! (?:closed|done|over|past)\\b)',
    '\\b(?:is|are|be|being|get|gets|getting) (?:\\S+ )?' + PAST + ' (?:at|in|by|with) ' + g + UNDATED,
    '\\ban? ' + g + ' ' + NOUN + '\\b(?! \\d)' + UNDATED,
    '(?:\\b(?:is|are|be|being|remains?|stays?)|:) the ' + g + ' ' + NOUN + '\\b(?! \\d)' + UNDATED,
    '\\b(?:proposal|draft)\\b[^.;]{0,40}\\b' + g, '\\b(?:waits?|waiting) (?:on|for) ' + g,
    '\\bpending\\b[^.;()]{0,24}\\b' + g, '\\b(?:comes?|arrives?|lands?)\\b[^.;()]{0,60}\\b' + g,
    '\\bfor ' + g + '(?!,? which ' + PAST + '\\b)' + UNDATED, '\\bto ' + g + UNDATED,
    '\\b(?:once|when|as soon as|by the time) ' + g + '(?! (?:' + PAST + '|had|was|were)\\b)',
    '\\b' + g0 + "['" + String.fromCharCode(0x2019) + "]s" + '\\b(?![^.;]{0,30}\\b20\\d\\d-\\d\\d)'].map(s => new RegExp(s, 'i')); };
  const DATED_RE = new RegExp('^' + DATED, 'i'), PAST_RE = new RegExp('^' + PAST + '$', 'i');
  const strip = w => w.replace(/^[(),:]+|[(),:]+$/g, '');
  const bareAt = (c, n) => {
    const re = new RegExp('\\bat gate ' + n + '\\b', 'gi'); let m;
    while ((m = re.exec(c))) {
      if (DATED_RE.test(c.slice(m.index + m[0].length))) continue;
      const toks = c.slice(0, m.index).split(' ').filter(Boolean); let j = toks.length - 1;
      if (j >= 2 && toks[j - 1].toLowerCase() === 'by') j -= 2;
      if (j >= 0 && /^\(?20\d\d-\d\d-\d\d[),]?$/i.test(toks[j])) j -= 1;
      if (j >= 0 && toks[j].toLowerCase() === 'on') j -= 1;
      const w = j >= 0 ? strip(toks[j].toLowerCase()) : '';
      const past = PAST_RE.test(w) || (w === 'open' && j >= 1 && toks[j - 1].toLowerCase() === 'left');
      if (past && !toks.slice(Math.max(0, j - 2), j).some(x => AUX.has(strip(x.toLowerCase())))) continue;
      return true;
    }
    return false;
  };
  const unbound = (c, n) => /\bnot yet binding\b/i.test(c) && [...c.matchAll(new RegExp('\\bgate ' + n + '\\b', 'gi'))].some(m => !DATED_RE.test(c.slice(m.index + m[0].length)));
  const OPEN_CELL = /^(?:open|pending|conflict|conditional|unresolved)\b|^\[derived\](?!.*\b(?:ratified|ruled|adopted)\b)|\bto confirm\b| open$/i;
  const STEP_CELL = /^(?:gate|review|step) \d+[a-z]?(?: ?(?:,|;|and) ?(?:gate|review|step) \d+[a-z]?)*$/i;
  const rowPromise = (t, closed) => {
    if (!t.trim().startsWith('|')) return false;
    const cells = t.trim().replace(/^\|+|\|+$/g, '').split('|').map(x => x.trim());
    if (!cells.some(x => OPEN_CELL.test(x))) return false;
    return cells.some(x => { const s = x.replace(/ ?\([^)]*\)/g, '').trim(); return STEP_CELL.test(s) && [...s.matchAll(/\bgate (\d)\b/gi)].some(g => closed.includes(+g[1])); });
  };
  const HISTORY = [/^\| *20\d\d-\d\d-\d\d *\|/i, /^ *# *20\d\d-\d\d-\d\d/i];
  return (text, closed) => {
    const t = norm(text);
    if (HISTORY.some(h => h.test(t))) return [];
    if (rowPromise(t, closed)) return [t.trim()];
    const out = [];
    for (const c of t.replace(/([.;!?])[ \n]+/g, '$1\n').split(/\n+/).filter(x => x.trim())) {
      const gs = [...new Set([...c.matchAll(/\bgate (\d)\b/gi)].map(x => +x[1]))].filter(g => closed.includes(g)).sort();
      for (const n of gs) if (future(n).some(r => r.test(c)) || bareAt(c, n) || unbound(c, n)) { out.push(c.trim()); break; }
    }
    return out;
  };
})();
// END closed-gate rule
const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); };
const names = new Map();
const vn = async p => { const b = p && p.boundVariables && p.boundVariables.color; if (!b) return null; if (!names.has(b.id)) { const v = await figma.variables.getVariableByIdAsync(b.id); names.set(b.id, v ? v.name : b.id); } return names.get(b.id); };
const fill0 = async n => (Array.isArray(n.fills) && n.fills[0]) ? await vn(n.fills[0]) : null;
const B = { color: '7:10', type: '7:11', layout: '7:12', marks: '7:13', pairs: '7:14', strictness: '7:15' };
const fails = []; const seen = new Set(); let cells = 0, pairCells = 0, specimens = 0, texts = 0;
const color = await figma.getNodeByIdAsync(B.color);
for (const cell of color.findAll(n => n.type === 'FRAME' && /\//.test(n.name) && n.children && n.children.some(c => c.name === 'chip'))) {
  cells++; seen.add(cell.name);
  const chip = cell.children.find(c => c.name === 'chip'); const t = cell.children.filter(c => c.type === 'TEXT').map(x => x.characters);
  if (await fill0(chip) !== cell.name) fails.push('Color ' + cell.name + ': chip binds ' + (await fill0(chip)));
  if (!(cell.name in EXPECT.colors)) fails.push('Color ' + cell.name + ': not a colour variable in tokens.json');
  else if (fnv(t.join(String.fromCharCode(1))) !== EXPECT.colors[cell.name]) fails.push('Color ' + cell.name + ': "' + t.join(' | ').slice(0, 160) + '" differs from tokens.json (label, path, value or tag line)');
}
for (const k of Object.keys(EXPECT.colors)) if (!seen.has(k)) fails.push('Color: no cell for ' + k);
const pairs = await figma.getNodeByIdAsync(B.pairs); const got = new Map();
for (const cell of pairs.findAll(n => n.type === 'FRAME' && n.children && n.children.some(c => c.name === 'swatch'))) {
  pairCells++;
  const sw = cell.children.find(c => c.name === 'swatch'); const t = cell.children.filter(c => c.type === 'TEXT').map(x => x.characters);
  const h = fnv(t.join(String.fromCharCode(1)));
  if (!EXPECT.pairs.includes(h)) fails.push('Certified pairs ' + cell.id + ': "' + t.join(' | ').slice(0, 160) + '" is not a contrast-pairs entry as tokens.json and the check give it');
  else if (cell.name !== EXPECT.pairNames[EXPECT.pairs.indexOf(h)]) fails.push('Certified pairs ' + cell.id + ': layer name "' + cell.name.slice(0, 80) + '" is not its source line "' + EXPECT.pairNames[EXPECT.pairs.indexOf(h)].slice(0, 80) + '"');
  got.set(h, (got.get(h) || 0) + 1);
  const m = (t[3] || '').match(/^(\S+) \(#[0-9A-Fa-f]+\) on (\S+) \(#/);
  if (!m) { fails.push('Certified pairs ' + cell.id + ': no pair line'); continue; }
  if (await fill0(sw) !== m[2]) fails.push('Certified pairs ' + cell.id + ': swatch binds ' + (await fill0(sw)) + ', the pair names ' + m[2]);
  for (const s of sw.findAll(n => n.type === 'TEXT')) if (await fill0(s) !== m[1]) fails.push('Certified pairs ' + cell.id + ': specimen ' + s.id + ' binds ' + (await fill0(s)) + ', the pair names ' + m[1]);
}
EXPECT.pairs.forEach((h, i) => { const n = got.get(h) || 0; if (n !== 1) fails.push('Certified pairs: contrast-pairs entry ' + (i + 1) + ' has ' + n + ' cells (one expected)'); });
const shown = n => { const c = n.characters, tc = n.textCase; return tc === 'UPPER' ? c.toUpperCase() : tc === 'LOWER' ? c.toLowerCase() : c; };  // the text as the board renders it
const type = await figma.getNodeByIdAsync(B.type);
for (const lab of type.findAll(n => n.type === 'TEXT' && /^Specimen: /.test(n.characters))) {
  specimens++; const id = lab.characters.replace('Specimen: ', '').trim();
  const row = lab.parent.parent; const line = row.findAll(n => n.type === 'TEXT' && n.parent !== lab.parent)[0];
  const want = id in EXPECT.lines ? EXPECT.lines[id] : EXPECT.other[id];
  if (!want) fails.push('Type ' + lab.id + ': "' + id + '" is neither an exemplar id nor a named board line');
  else if (!line || fnv(shown(line)) !== want) fails.push('Type ' + lab.id + ': the line is not ' + id + ' as written (case included)' + (line ? ' ("' + shown(line).slice(0, 60) + '")' : ''));
}
if (specimens !== EXPECT.specimens) fails.push('Type: ' + specimens + ' specimens, the pack gives ' + EXPECT.specimens + ' (text styles x canvases)');
const sm = await figma.getNodeByIdAsync(B.strictness); const table = sm.findOne(n => n.name === 'Table');
const rows = table.children.filter(r => r.type === 'FRAME' && r.name !== 'Header row').map(r => r.findAll(n => n.type === 'TEXT').map(t => t.characters));
if (rows.length !== EXPECT.rows.length) fails.push('Strictness map: ' + rows.length + ' rows, the file has ' + EXPECT.rows.length);
rows.forEach((r, i) => { if (fnv(r.join(String.fromCharCode(1))) !== EXPECT.rows[i]) fails.push('Strictness map row ' + (i + 1) + ' (' + r[0] + ') differs from strictness-map.md'); });
const hdr = sm.findAll(n => n.type === 'TEXT' && n.characters.startsWith('Rules from the playbook'));
if (!hdr.length || fnv(hdr[0].characters) !== EXPECT.header) fails.push('Strictness map: header differs from strictness-map.md');
const clo = sm.children.filter(c => c.type === 'TEXT');
if (!clo.length || fnv(clo[clo.length - 1].characters) !== EXPECT.closing) fails.push('Strictness map: closing note differs from strictness-map.md');
if (!sm.findAll(n => n.type === 'TEXT' && n.characters === '[documented] Adopted at Gate 4; ratified ' + EXPECT.status.ratified + ' by ' + (EXPECT.status.by || 'Eddie')).length) fails.push('Strictness map: the status flag does not say adopted at Gate 4 and ratified ' + EXPECT.status.ratified + ' by ' + (EXPECT.status.by || 'Eddie'));
const sn = sm.findAll(n => n.type === 'TEXT' && n.parent && n.parent.name === 'Status flag' && !n.characters.startsWith('['));
const adopted = (EXPECT.status.drafted.match(/on (\d{4}-\d\d-\d\d)/) || [])[1], snt = sn.length === 1 ? sn[0].characters.split(String.fromCharCode(0x2019)).join("'") : '';
if (!(snt.includes(EXPECT.status.drafted) && (snt.includes('ratified ' + EXPECT.status.ratified) || snt.includes('ratified on ' + EXPECT.status.ratified) || (adopted === EXPECT.status.ratified && snt.includes('ratified the same day')))))
  fails.push('Strictness map: the status note' + (sn[0] ? ' ' + sn[0].id : '') + ' does not say what strictness-map.md says (' + EXPECT.status.drafted.slice(0, 60) + '..., ratified ' + EXPECT.status.ratified + ')');
const lay = await figma.getNodeByIdAsync(B.layout); const LT = lay.findAll(n => n.type === 'TEXT' && n.visible); const seenSpace = new Set(); let layoutLines = 0;
for (const f of lay.findAll(n => n.type === 'FRAME' && /^space\/\d+$/.test(n.name))) {
  seenSpace.add(f.name); layoutLines++; const t = f.findAll(n => n.type === 'TEXT').map(x => x.characters);
  if (t[0] !== f.name || t[1] !== EXPECT.space[f.name]) fails.push('Layout ' + f.id + ': "' + t.join(' | ') + '", tokens.json gives ' + f.name + ' ' + EXPECT.space[f.name]);
}
for (const k of Object.keys(EXPECT.space)) if (!seenSpace.has(k)) fails.push('Layout: no row for ' + k);
const TAG = /\[(documented|observed|derived)((?:,[^\]]*)?)\]/g, ruledDate = r => (r.match(/\b(?:ruled|ratified) (\d{4}-\d\d-\d\d)/) || [])[1] || null;
const modesFrom = text => { const out = {}; let last = 0;
  for (const m of text.matchAll(TAG)) { const span = text.slice(last, m.index); last = m.index + m[0].length;
    for (const x of span.matchAll(/\b(web|social|email):? (\d+) px\b/g)) out[x[1]] = [+x[2], m[1], ruledDate(m[2])];
    for (const x of span.matchAll(/\b(\d+) px on ((?:web|social|email)(?:(?:, | and )(?:web|social|email))*)/g)) for (const c of x[2].match(/web|social|email/g)) out[c] = [+x[1], m[1], ruledDate(m[2])]; }
  return out; };  // board_expect.py's modes_from, line for line
const onBoard = { 'stroke/cta': {}, 'stroke/rule': {} };
for (const t of LT) {
  if (/^canvas (web|social|email) with caption$/.test(t.parent.name)) { layoutLines++; Object.assign(onBoard['stroke/cta'], modesFrom(t.characters)); }
  else if (/^stroke\/rule\b/.test(t.characters)) { layoutLines++; Object.assign(onBoard['stroke/rule'], modesFrom(t.characters)); }
}
const say = w => w ? w[0] + ' px [' + w[1] + (w[2] ? ', ruled ' + w[2] : '') + ']' : 'nothing';
for (const [k, want] of Object.entries(EXPECT.strokes)) for (const [c, w] of Object.entries(want)) {
  const g = (onBoard[k] || {})[c];
  if (!g || g[0] !== w[0] || g[1] !== w[1] || g[2] !== w[2]) fails.push('Layout ' + k + ' on ' + c + ': the board says ' + say(g) + ', tokens.json ' + say(w));
}
for (const [k, w] of Object.entries(EXPECT.margins)) {
  const t = LT.find(x => x.characters.startsWith(k + ':')); layoutLines++;
  const m = t && t.characters.match(/^(\S+): (\d+) px, alias of (\S+)\. \[(documented|observed|derived)/);
  const r = (t && (t.characters.match(/\(ratified (\d{4}-\d\d-\d\d)/) || [])[1]) || null;
  if (!m || +m[2] !== w.px || m[3] !== w.alias || m[4] !== w.tag || r !== w.ratified) fails.push('Layout ' + k + ': ' + (t ? '"' + t.characters.slice(0, 100) + '"' : 'no line') + ' differs from tokens.json (' + w.px + ' px, alias of ' + w.alias + ', [' + w.tag + ']' + (w.ratified ? ', ratified ' + w.ratified : '') + ')');
}
const rtag = ((LT.find(x => x.parent.name === 'Radius' && /^\[/.test(x.characters)) || { characters: '' }).characters.match(/^\[(documented|observed|derived)/) || [])[1];
for (const [k, w] of Object.entries(EXPECT.radius)) {
  const t = LT.find(x => x.characters.startsWith(k + ':')); layoutLines++;
  if (!t || t.characters !== k + ': ' + w.v) fails.push('Layout ' + k + ': ' + (t ? '"' + t.characters + '"' : 'no line') + ', tokens.json gives ' + w.v);
  if (rtag !== w.tag) fails.push('Layout ' + k + ': the Radius tag line says [' + rtag + '], tokens.json [' + w.tag + ']');
}
const bpt = LT.find(x => /Breakpoints \d+ and \d+/.test(x.characters)); layoutLines++;
const bpb = bpt ? bpt.characters.match(/Breakpoints (\d+) and (\d+)/).slice(1).map(Number).sort((a, b) => a - b) : [];
if (JSON.stringify(bpb) !== JSON.stringify(EXPECT.breakpoints)) fails.push('Layout: breakpoints on the board ' + JSON.stringify(bpb) + ', figma.yaml ' + JSON.stringify(EXPECT.breakpoints));
const box = n => n.absoluteBoundingBox;
for (const [k, id] of Object.entries(B)) {
  const b = await figma.getNodeByIdAsync(id);
  if (!b.findAll(n => n.type === 'TEXT' && /not licensed/i.test(n.characters)).length) fails.push(k + ': no stand-in license flag');
  for (const t of b.findAll(n => n.type === 'TEXT' && n.visible)) {
    texts++;
    for (const c of closedGatePromises(t.characters, EXPECT.closed)) fails.push(k + ' ' + t.id + ': promises work from a closed gate: "' + c.slice(0, 120) + '"');
    const tb = box(t); if (!tb) continue;
    for (let a = t.parent; a && a.type !== 'PAGE'; a = a.parent) {
      if (!a.clipsContent) continue; const ab = box(a); if (!ab) continue;
      if (tb.x < ab.x - 0.5 || tb.y < ab.y - 0.5 || tb.x + tb.width > ab.x + ab.width + 0.5 || tb.y + tb.height > ab.y + ab.height + 0.5) {
        fails.push(k + ' ' + t.id + ': cut by ' + a.id + ' (' + a.name + '), which clips it: the text runs ' + Math.round(Math.max(ab.x - tb.x, ab.y - tb.y, tb.x + tb.width - ab.x - ab.width, tb.y + tb.height - ab.y - ab.height)) + ' px past'); break; }
    }
  }
}
return { cells, pairCells, specimens, rows: rows.length, layoutLines, texts, fails };
