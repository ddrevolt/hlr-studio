// Host placeholder guard (Chat 6, 2026-10-23; REVIEW.md section 6 row R21, after R2-04: M15's six cards kept
// "Product name" after the element E07 took "Short name"). Read-only; run with use_figma on 02 Modules (7:3).
// For every element instance placed inside an email module master, every stamped text that is still the element's
// own slot (stamp E##.role) must read what the element's main component reads: a master never keeps an old
// placeholder. A host that re-stamps a slot (M11.cta, M12.cta) is outside this check. Returns the mismatches; [] passes.
const page = await figma.getNodeByIdAsync('7:3');
await figma.setCurrentPageAsync(page);
const fails = []; let checked = 0;
for (const mod of page.children.filter(n => /^Email\/M\d\d /.test(n.name))) {
  const vs = mod.type === 'COMPONENT_SET' ? mod.children.filter(c => c.type === 'COMPONENT') : [mod];
  for (const v of vs) for (const inst of v.findAllWithCriteria({ types: ['INSTANCE'] })) {
    const main = await inst.getMainComponentAsync(); if (!main) continue;
    const mname = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent.name : main.name;
    if (!/^Elements\/E\d\d /.test(mname)) continue;
    for (const t of inst.findAllWithCriteria({ types: ['TEXT'] })) {
      const stamp = t.getSharedPluginData('hlr', 'slot'); if (!/^E\d\d\./.test(stamp)) continue;
      const srcId = t.id.split(';').pop(); const src = await figma.getNodeByIdAsync(srcId);
      if (!src || src.type !== 'TEXT') continue;
      checked++;
      if (t.characters !== src.characters) fails.push(mod.name + ' ' + v.name + ': ' + stamp + ' reads "' + t.characters + '", the element reads "' + src.characters + '"');
    }
  }
}
return { checked, fails };
