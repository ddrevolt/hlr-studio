// Board drift guard, part 1 of 2 (Chat 6, 2026-10-23; REVIEW.md section 6 row R19, after the Foundations review
// F1-01 to F1-05 and the email review R2-05: boards on 00 Foundations kept text the pack had since changed).
// Read-only. Run with use_figma on HLR Library, once with PART = 'A' and once with PART = 'B' (the 20 KB result cap),
// save the two results as board-dump-A.json and board-dump-B.json, then run board_drift.py on them.
//   A: every Color swatch cell (7:10: its name, the variable its chip binds, its texts) and every Certified pairs cell
//      (7:14: its texts, the variable its swatch binds, the variables its specimen texts bind).
//   B: the Type board's specimen rows (7:11), the Strictness map board (7:15), the stand-in flag on each board, and
//      every board text that names a gate.
const PART = 'A';
const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
const names = new Map();
const vn = async p => { const b = p && p.boundVariables && p.boundVariables.color; if (!b) return null; if (!names.has(b.id)) { const v = await figma.variables.getVariableByIdAsync(b.id); names.set(b.id, v ? v.name : b.id); } return names.get(b.id); };
const fill0 = async n => (Array.isArray(n.fills) && n.fills[0]) ? await vn(n.fills[0]) : null;
const BOARDS = { color: '7:10', type: '7:11', layout: '7:12', marks: '7:13', pairs: '7:14', strictness: '7:15' };
const out = { part: PART, at: new Date().toISOString() };
if (PART === 'A') {
  const color = await figma.getNodeByIdAsync(BOARDS.color);
  out.colorCells = [];
  for (const cell of color.findAll(n => n.type === 'FRAME' && /\//.test(n.name) && n.children && n.children.some(c => c.name === 'chip'))) {
    const chip = cell.children.find(c => c.name === 'chip');
    out.colorCells.push({ id: cell.id, name: cell.name, chip: await fill0(chip), texts: cell.children.filter(c => c.type === 'TEXT').map(t => t.characters) });
  }
  const pairs = await figma.getNodeByIdAsync(BOARDS.pairs);
  out.pairCells = [];
  for (const cell of pairs.findAll(n => n.type === 'FRAME' && n.children && n.children.some(c => c.name === 'swatch'))) {
    const sw = cell.children.find(c => c.name === 'swatch');
    const spec = []; for (const t of sw.findAll(n => n.type === 'TEXT')) spec.push(await fill0(t));
    out.pairCells.push({ id: cell.id, section: cell.parent && cell.parent.parent ? cell.parent.parent.name : '', swatch: await fill0(sw), swatchModes: sw.explicitVariableModes || {}, cellModes: cell.explicitVariableModes || {}, specimen: spec, texts: cell.children.filter(c => c.type === 'TEXT').map(t => t.characters) });
  }
} else {
  const type = await figma.getNodeByIdAsync(BOARDS.type);
  out.specimens = type.findAll(n => n.type === 'TEXT' && n.characters.startsWith('Specimen: ')).map(t => ({ id: t.id, label: t.characters, row: t.parent.findAll(n => n.type === 'TEXT').map(x => x.characters).filter(c => c !== t.characters) }));
  const sm = await figma.getNodeByIdAsync(BOARDS.strictness);
  const table = sm.findOne(n => n.name === 'Table');
  out.strictness = { rows: table.children.filter(r => r.type === 'FRAME' && r.name !== 'Header row').map(r => r.findAll(n => n.type === 'TEXT').map(t => t.characters)),
    header: sm.findAll(n => n.type === 'TEXT' && n.parent && n.parent.name === 'Header').map(t => t.characters),
    status: sm.findAll(n => n.type === 'TEXT' && n.parent && n.parent.name === 'Status flag').map(t => t.characters),
    closing: sm.children.filter(c => c.type === 'TEXT').map(t => t.characters) };
  out.flags = {}; out.gateTexts = [];
  for (const [k, id] of Object.entries(BOARDS)) {
    const b = await figma.getNodeByIdAsync(id);
    out.flags[k] = b.findAll(n => n.type === 'TEXT' && /not licensed/i.test(n.characters)).length;
    for (const t of b.findAll(n => n.type === 'TEXT' && /Gate [1-9]\b/.test(n.characters))) out.gateTexts.push({ board: k, id: t.id, text: t.characters.slice(0, 400) });
  }
}
return out;
