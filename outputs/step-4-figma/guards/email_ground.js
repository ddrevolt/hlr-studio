// Email ground guard (Chat 6, 2026-10-23; round 1 finding R1-01, tightened after R2-09 and R3-05/R3-06).
// R1-01: every module root bound `color/semantic/background/default` (Alabaster), so every email rendered cream
// against Gate 1 C4, which keeps white as the email page ground. Run with use_figma (read-only) once per page: set PAGE
// to 02 Modules 7:3, 03 Templates 7:4 or 04 Staging 7:5. It asserts, positively:
//   1. every visible fill on every email module root (each variant of a set on 02 Modules; each module instance placed
//      on 03 and 04) binds `background/email-page` (VariableID:19:20); M02 Hero's root is the photo well, whose fills
//      may be `component/placeholder/fill` (19:43), the scrim `background/scrim` (19:23) or a cleared photo (IMAGE);
//   2. no paint on the page binds `background/default` (VariableID:19:19);
//   3. once a cleared photo fills a well (an IMAGE fill), no placeholder label inside it is still visible
//      (a "Decor / Placeholder label" frame or an IMAGE text on that node or its descendants).
// A ground other than white comes from the instance's ground mode, never from another variable. Returns the
// failures; [] passes.
const PAGE = '7:3';
const EMAIL_PAGE = 'VariableID:19:20', DEFAULT_GROUND = 'VariableID:19:19', WELL = 'VariableID:19:43', SCRIM = 'VariableID:19:23';
const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);
const fails = [];
const vis = f => f.visible !== false && (f.opacity === undefined || f.opacity > 0);
const checkRoot = (n, moduleName) => {
  const fills = (Array.isArray(n.fills) ? n.fills : []).filter(vis);
  const isHero = /^Email\/M02 /.test(moduleName);
  if (!fills.length) { fails.push(n.id + ' ' + moduleName + ': no visible fill'); return; }
  for (const f of fills) {
    const id = f.boundVariables && f.boundVariables.color ? f.boundVariables.color.id : null;
    const ok = isHero ? (f.type === 'IMAGE' || id === WELL || id === SCRIM) : id === EMAIL_PAGE;
    if (!ok) fails.push(n.id + ' ' + moduleName + ': fill ' + (id || 'raw ' + f.type));
  }
};
let roots = 0;
if (PAGE === '7:3') {
  for (const n of page.children) {
    if (!/^Email\/M\d\d /.test(n.name)) continue;
    const vs = n.type === 'COMPONENT_SET' ? n.children.filter(c => c.type === 'COMPONENT') : [n];
    for (const v of vs) { roots++; checkRoot(v, n.name); }
  }
} else {
  for (const inst of page.findAllWithCriteria({ types: ['INSTANCE'] })) {
    const m = await inst.getMainComponentAsync(); if (!m) continue;
    const name = m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name;
    if (!/^Email\/M\d\d /.test(name)) continue;
    roots++; checkRoot(inst, name);
  }
}
let paints = 0, photos = 0;
for (const n of [page, ...page.findAll(() => true)]) {
  for (const key of ['fills', 'strokes']) {
    if (!(key in n) || !Array.isArray(n[key])) continue;
    n[key].forEach((p, i) => { paints++; const b = p.boundVariables && p.boundVariables.color; if (b && b.id === DEFAULT_GROUND) fails.push(n.id + ' ' + n.name + ' ' + key + '[' + i + '] binds background/default'); });
  }
  if (Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE' && vis(f)) && 'findAll' in n) {
    photos++;
    const labels = n.findAll(c => c.visible !== false && ((c.name || '').startsWith('Decor / Placeholder label') || (c.type === 'TEXT' && c.characters === 'IMAGE')));
    for (const l of labels) { let shown = true; for (let a = l; a && a.id !== n.id; a = a.parent) if (a.visible === false) { shown = false; break; } if (shown) fails.push(n.id + ' ' + n.name + ': placeholder label ' + l.id + ' still visible over a cleared photo'); }
  }
}
return { page: page.name, roots, paints, photos, fails };
