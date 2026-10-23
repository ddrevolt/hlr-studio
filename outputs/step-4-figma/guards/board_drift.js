// Board drift guard, part 2 of 2 (Chat 6, 2026-10-23; REVIEW.md section 6 row R19; tightened after the Foundations
// review round 2, F2-02 and F2-05). Read-only; run with use_figma on HLR Library after pasting the output of
// `python3 board_expect.py <brand home>` as EXPECT below. Checks the six boards on 00 Foundations against the pack:
// each Color swatch cell (its chip binds its own variable; its hex, alias and whole tag line equal tokens.json; every
// colour variable has a cell); each Certified pairs cell (its four lines, ratio, source, roles or restriction and the
// pair, equal a contrast-pairs entry; every entry has exactly one cell; its specimens bind the pair's ink and its
// swatch the ground); every Type specimen (each "Specimen:" label is an exemplar id or one of the board's two named
// lines, its line equals that text in full, and the board holds one specimen per text style on each canvas); the
// Strictness map (rows, header and closing equal strictness-map.md; the status flag says adopted); the stand-in license
// flag on every board; no text promising work from a gate that has closed (the closed-gate rule, shared with
// closed_gate_scan.py; tests/closed_gate_parity.js keeps them in step); and no text cut by a frame that clips it.
// Returns the failures; [] passes.
const EXPECT = PASTE_BOARD_EXPECT_OUTPUT_HERE;
// BEGIN closed-gate rule
const closedGatePromises = (() => {
  const PART = '(?:named|ruled|adopted|ratified|decided|chosen|confirmed|closed|routed|set|recorded|approved|built|taken|kept|moved|made|picked|left open)';
  const fut = n => ['\\buntil Gate ' + n + '\\b',
    '\\bGate ' + n + '\\s+(?:will|would|shall|rules|sets|names|decides|chooses|settles|takes|owns|brings|confirms|ratifies|routes)\\b',
    '\\b(?:is|are|be|being)\\s+(?:\\w+\\s+)?' + PART + '\\s+(?:at|in|by|with)\\s+Gate ' + n + '\\b',
    '\\b(?:an?|the)\\s+Gate ' + n + '\\s+(?:item|decision|call|question|proposal|ruling|matter|task)\\b(?!\\s+\\d)',
    '\\b(?:proposal|draft)\\b[^.;]{0,40}\\bGate ' + n + '\\b', '\\b(?:waits?|waiting)\\s+(?:on|for)\\s+Gate ' + n + '\\b',
    '\\b(?:comes?|arrives?|lands?)\\b[^.;()]{0,60}\\bGate ' + n + '\\b', '\\bfor Gate ' + n + '\\b', '\\bnot yet binding\\b'].map(s => new RegExp(s, 'i'));
  const RECORD = new RegExp('\\b' + PART + '\\b', 'i');
  const PASSIVE = new RegExp('\\b(?:is|are|be|being)\\s+(?:\\w+\\s+)?\\b' + PART + '\\b[^.;]*$', 'i');
  const bareAt = (c, n) => {
    const re = new RegExp('\\bat Gate ' + n + '\\b', 'g'); let m;
    while ((m = re.exec(c))) {
      const before = c.slice(Math.max(0, m.index - 48), m.index), after = c.slice(m.index + m[0].length, m.index + m[0].length + 16);
      if (/^\s*(?:,\s*|\(|on\s+)?20\d\d-\d\d/.test(after)) continue;
      if (RECORD.test(before) && !PASSIVE.test(before)) continue;
      return true;
    }
    return false;
  };
  const HISTORY = [/^\|\s*20\d\d-\d\d-\d\d\s*\|/, /^\s*#\s*20\d\d-\d\d-\d\d/];
  return (text, closed) => {
    if (HISTORY.some(h => h.test(text))) return [];
    const out = [];
    for (const c of text.replace(/([.;!?])\s+/g, '$1\n').split(/\n+/).filter(x => x.trim())) {
      const gs = [...new Set([...c.matchAll(/\bGate (\d)\b/g)].map(x => +x[1]))].filter(g => closed.includes(g)).sort();
      for (const n of gs) if (fut(n).some(r => r.test(c)) || bareAt(c, n)) { out.push(c.trim()); break; }
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
  const hex = (t[2] || '').split(',')[0].trim().toUpperCase(); const alias = ((t[2] || '').match(/alias of (\S+)/) || [])[1] || '';
  if (!(cell.name in EXPECT.colors)) fails.push('Color ' + cell.name + ': not a colour variable in tokens.json');
  else if (fnv(hex + '|' + alias + '|' + (t[3] || '')) !== EXPECT.colors[cell.name]) fails.push('Color ' + cell.name + ': "' + t[2] + '" "' + t[3] + '" differs from tokens.json');
}
for (const k of Object.keys(EXPECT.colors)) if (!seen.has(k)) fails.push('Color: no cell for ' + k);
const pairs = await figma.getNodeByIdAsync(B.pairs); const got = new Map();
for (const cell of pairs.findAll(n => n.type === 'FRAME' && n.children && n.children.some(c => c.name === 'swatch'))) {
  pairCells++;
  const sw = cell.children.find(c => c.name === 'swatch'); const t = cell.children.filter(c => c.type === 'TEXT').map(x => x.characters);
  const h = fnv(t.join(String.fromCharCode(1)));
  if (!EXPECT.pairs.includes(h)) fails.push('Certified pairs ' + cell.id + ': "' + t.join(' | ').slice(0, 160) + '" is not a contrast-pairs entry as tokens.json and the check give it');
  got.set(h, (got.get(h) || 0) + 1);
  const m = (t[3] || '').match(/^(\S+) \(#[0-9A-Fa-f]+\) on (\S+) \(#/);
  if (!m) { fails.push('Certified pairs ' + cell.id + ': no pair line'); continue; }
  if (await fill0(sw) !== m[2]) fails.push('Certified pairs ' + cell.id + ': swatch binds ' + (await fill0(sw)) + ', the pair names ' + m[2]);
  for (const s of sw.findAll(n => n.type === 'TEXT')) if (await fill0(s) !== m[1]) fails.push('Certified pairs ' + cell.id + ': specimen ' + s.id + ' binds ' + (await fill0(s)) + ', the pair names ' + m[1]);
}
EXPECT.pairs.forEach((h, i) => { const n = got.get(h) || 0; if (n !== 1) fails.push('Certified pairs: contrast-pairs entry ' + (i + 1) + ' has ' + n + ' cells (one expected)'); });
const type = await figma.getNodeByIdAsync(B.type);
for (const lab of type.findAll(n => n.type === 'TEXT' && /^Specimen: /.test(n.characters))) {
  specimens++; const id = lab.characters.replace('Specimen: ', '').trim();
  const row = lab.parent.parent; const line = row.findAll(n => n.type === 'TEXT' && n.parent !== lab.parent)[0];
  const want = id in EXPECT.lines ? EXPECT.lines[id] : EXPECT.other[id];
  if (!want) fails.push('Type ' + lab.id + ': "' + id + '" is neither an exemplar id nor a named board line');
  else if (!line || fnv(line.characters.toLowerCase()) !== want) fails.push('Type ' + lab.id + ': the line is not ' + id + (line ? ' ("' + line.characters.slice(0, 60) + '")' : ''));
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
if (!sm.findAll(n => n.type === 'TEXT' && /^\[derived\] Adopted/.test(n.characters)).length) fails.push('Strictness map: the status flag does not say adopted');
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
return { cells, pairCells, specimens, rows: rows.length, texts, fails };
