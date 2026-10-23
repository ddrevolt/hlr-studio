// REVIEW.md guard R8 (faces the Figma build path cannot load), Chat 5, 2026-10-23.
// Run with use_figma (read-only) on the HLR Library file. Every text style must bind its
// fontFamily (and fontStyle, fontSize) to an HLR / Layout variable, so the switch from the
// stand-ins to the real faces is a variable edit. Returns the styles that fail; [] passes.
const vars = await figma.variables.getLocalVariablesAsync();
const name = {}; for (const v of vars) name[v.id] = v.name;
const fails = [];
for (const s of await figma.getLocalTextStylesAsync()) {
  const b = s.boundVariables || {};
  for (const f of ['fontFamily', 'fontStyle', 'fontSize']) {
    if (!b[f] || !name[b[f].id]) fails.push(s.name + ': ' + f + ' unbound');
  }
}
return { styles: (await figma.getLocalTextStylesAsync()).length, fails };
