// REVIEW.md guard R8 at node level (Chat 6, 2026-10-23, after the round 1 review, finding 3: four
// M21 labels bound only their font style, so the switch to the real faces would have missed them while
// r8_text_style_family.js passed). Run with use_figma (read-only) once per library page: set PAGE to
// the page id (01 Elements 7:2, 02 Modules 7:3, 03 Templates 7:4, 04 Staging 7:5).
// Every text segment must bind fontFamily, fontSize and fontStyle, through its text style or on the
// node, so the stand-in switch in the desktop app reaches it. Returns the segments that fail; [] passes.
const PAGE = '7:3';
const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);
const styleVars = new Map();
const fails = [];
let texts = 0;
for (const t of page.findAllWithCriteria({ types: ['TEXT'] })) {
  texts++;
  for (const s of t.getStyledTextSegments(['boundVariables', 'textStyleId'])) {
    const bound = Object.assign({}, s.boundVariables || {});
    if (s.textStyleId && typeof s.textStyleId === 'string') {
      if (!styleVars.has(s.textStyleId)) {
        const st = await figma.getStyleByIdAsync(s.textStyleId);
        styleVars.set(s.textStyleId, (st && st.boundVariables) || {});
      }
      for (const k of Object.keys(styleVars.get(s.textStyleId))) if (!bound[k]) bound[k] = true;
    }
    for (const f of ['fontFamily', 'fontSize', 'fontStyle']) {
      if (!bound[f]) fails.push(t.id + ' ' + t.name + ' [' + s.start + ',' + s.end + ') ' + f + ' unbound');
    }
  }
}
return { page: page.name, texts, fails };
