// Structure lint guard (Chat 6, 2026-10-23, after the batch 2 review round 2, BR2-01: the star masters failed rule 1,
// and the close had linted only the two modules it changed). Read-only; run with use_figma on 01 Elements (7:2) or
// 02 Modules (7:3): set PAGE, and SETS to the number of element or module entries slotmap.yaml holds. Lints every
// master on the page, found anywhere on it (the elements sit inside a board), each variant of a set on its own,
// against five of the structure contract's rules (asset-production/references/structure-contract.md): 1 (a frame
// holding content is auto-layout), 3 (a text container hugs, never a fixed height), 4 (a stamped slot text never sits
// in a fixed box, so it cannot clip), 8 (no absolute child outside Decor) and 13 (no grow or fill inside a hug on the
// same axis). Rules 2 and 7 stay with the engine's own structureLint (figma-recipes.md), run at each fresh-context
// review. A placed mark is an asset, not a container: an instance of any Marks/* component is exempt, found by its
// main component (engine gap G5), as are the legacy layer names Wordmark and Monogram. Fails when it finds fewer sets
// than SETS, so a page reorganised into sections cannot pass it empty. Returns the failures.
const PAGE = '7:3';
const SETS = 27;
const ROOT = PAGE === '7:2' ? /^Elements\/E\d\d / : /^Email\/M\d\d /;
const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);
const NS = 'hlr', KEY = 'slot'; const markIds = new Set();
const setName = m => m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name) : '';
const collectMarks = async root => { for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) { const m = await n.getMainComponentAsync(); if (/^Marks\//.test(setName(m))) markIds.add(n.id); } };
const structureLint = root => {
  const V = []; const nm = n => n.name || '(unnamed)';
  const isD = n => { let a = n; while (a) { if ((a.name || '').startsWith('Decor')) return true; if (a.id === root.id) break; a = a.parent; } return false; };
  const isImg = n => /^(IMAGE|ILLUSTRATION)$/.test(n.name || '') || /image|photo|thumb/i.test(n.name || '');
  const isMark = n => n.type === 'INSTANCE' && (/^(Wordmark|Monogram)$/.test(n.name || '') || markIds.has(n.id));
  const hasText = n => n.type === 'TEXT' ? !isD(n) : (n.children || []).some(hasText);
  const walk = n => {
    const kids = (n.children || []).filter(c => c.visible !== false); const auto = n.layoutMode && n.layoutMode !== 'NONE';
    if (kids.length && /^(FRAME|COMPONENT|COMPONENT_SET|INSTANCE)$/.test(n.type) && !auto && !isD(n) && !isMark(n)) V.push('rule 1: ' + nm(n) + ' ' + n.id);
    for (const c of kids) {
      if (c.layoutPositioning === 'ABSOLUTE' && !isD(c)) V.push('rule 8: ' + nm(c) + ' ' + c.id);
      if (!auto) continue;
      if (c.layoutGrow === 1 && n.primaryAxisSizingMode === 'AUTO') V.push('rule 13: ' + nm(c) + ' in ' + nm(n));
      const fa = n.layoutMode === 'HORIZONTAL' ? 'layoutSizingVertical' : 'layoutSizingHorizontal';
      if (c[fa] === 'FILL' && n.counterAxisSizingMode === 'AUTO' && !kids.some(k => k !== c && k[fa] !== 'FILL')) V.push('rule 13: ' + nm(c) + ' in ' + nm(n));
    }
    if (auto && !isD(n) && !isImg(n) && hasText(n)) {
      const hm = n.layoutMode === 'VERTICAL' ? n.primaryAxisSizingMode : n.counterAxisSizingMode;
      const stretch = n.layoutSizingVertical === 'FILL' && n.parent && n.parent.layoutMode === 'HORIZONTAL' && n.parent.counterAxisSizingMode === 'AUTO';
      if (hm === 'FIXED' && !stretch) V.push('rule 3: ' + nm(n) + ' ' + n.id);
    }
    if (n.type === 'TEXT' && !isD(n) && n.getSharedPluginData(NS, KEY) && n.textAutoResize === 'NONE') V.push('rule 4: ' + nm(n) + ' ' + n.id);
    if (!isMark(n)) for (const c of kids) walk(c);
  };
  walk(root); return V;
};
const fails = []; let sets = 0, roots = 0;
for (const s of page.findAll(n => (n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET')) && ROOT.test(n.name))) {
  sets++;
  const vs = s.type === 'COMPONENT_SET' ? s.children.filter(v => v.type === 'COMPONENT') : [s];
  for (const v of vs) { roots++; await collectMarks(v); for (const x of structureLint(v)) fails.push(s.name + (vs.length > 1 ? ' / ' + v.name : '') + ': ' + x); }
}
if (sets < SETS) fails.push(page.name + ': ' + sets + ' master sets found, slotmap.yaml holds ' + SETS);
return { page: page.name, sets, roots, marks: markIds.size, fails };
