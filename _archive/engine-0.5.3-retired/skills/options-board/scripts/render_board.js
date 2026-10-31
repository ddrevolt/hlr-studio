#!/usr/bin/env node
/* render_board.js: the options board. Finished routes, side by side, for a human to pick from.

   Usage:
     node render_board.js --manifest board.json --out board.html [--out-md board.md]
                          [--pack <folder> | --brand-context <file> | --brand <name>]

   board.json:
     { "title": "...", "brief_ref": "<slug>.brief.json", "routes_ref": "<slug>.routes.json",
       "packets": ["r1.packet.json", "r2.packet.json"] }
   Paths resolve against the manifest's folder; a packet's own paths resolve against the packet's.

   WHAT THE BOARD DOES AND DOES NOT DO
   - It refuses to render when any packet fails references/packet-schema.json, naming the packet.
     A board built from a malformed packet would look finished and be wrong.
   - It recomputes completion from the render files on disk and the completion contract. A packet
     that claims `complete: true` while a render is missing or a placeholder is shown as
     INSUFFICIENT-INPUT with the claim noted. A blank never looks intentional: a missing render is
     a labelled "NOT RENDERED" block.
   - It never ranks. Routes appear in verifier rank order only when every packet carries one;
     otherwise in manifest order, labelled unranked. Scores come from the verifier or stay absent.
   - It is self-contained: images are embedded as data URIs, no external assets, and the palette is
     the pack's onepager_palette under the same contrast refusal the one-pager applies.

   Exit 0 every route PASS · 1 rendered but at least one route is FAIL or INSUFFICIENT-INPUT
   · 2 could not start (manifest unreadable, a packet invalid, output unwritable). */
'use strict';
const fs = require('fs'), path = require('path');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }
const die = (m, code = 2) => { console.error('render_board: ' + m); process.exit(code); };
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  die('the shared module lib/' + name + ' is not beside this plugin (looked in ' + cands.join(', ') + ').');
}
const pack = sharedLib('pack.js');
const provenance = sharedLib('provenance.js');
const schemaLib = sharedLib('schema.js');
const R = sharedLib('render.js');
const esc = R.esc;

// ---------------------------------------------------------------- inputs
if (!has('--manifest')) die('need --manifest <board.json>.\n  usage: render_board.js --manifest board.json --out board.html [--out-md board.md] [--pack <folder>]');
if (!has('--out')) die('need --out <board.html>. The board is the deliverable; without a destination there is nothing to hand over.');
const manifestPath = path.resolve(arg('--manifest'));
const manifestDir = path.dirname(manifestPath);
let manifest;
try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
catch (e) { die('cannot read the manifest at ' + manifestPath + ' (' + e.message + ')'); }
if (!Array.isArray(manifest.packets) || !manifest.packets.length) die('the manifest lists no packets. A board with no routes is not a board; run the routes first.');

const REF = p => path.join(__dirname, '..', 'references', p);
let SCHEMA, CONTRACT;
try { SCHEMA = JSON.parse(fs.readFileSync(REF('packet-schema.json'), 'utf8')); } catch (e) { die('cannot read references/packet-schema.json (' + e.message + ')'); }
try { CONTRACT = JSON.parse(fs.readFileSync(REF('completion-contract.json'), 'utf8')); } catch (e) { die('cannot read references/completion-contract.json (' + e.message + ')'); }

let CTX = null;
try { CTX = pack.resolveContext(process.argv); } catch (e) { die(e.message); }
const PALETTE = R.resolvePalette(CTX ? CTX.fileMap.onepager_palette : null, m => console.error(m), 'render_board');

const resolveFrom = (base, p) => (p == null ? null : (path.isAbsolute(p) ? p : path.join(base, p)));
const readJson = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } };

/* The brief: header material and the required geometry per surface. Unreadable is reported, not fatal. */
const briefPath = resolveFrom(manifestDir, manifest.brief_ref);
const brief = briefPath ? readJson(briefPath) : null;
const routesPlan = manifest.routes_ref ? readJson(resolveFrom(manifestDir, manifest.routes_ref)) : null;

/* Packets: read and validate every one before rendering anything. */
const packets = manifest.packets.map(p => {
  const abs = resolveFrom(manifestDir, p);
  const doc = readJson(abs);
  if (!doc) die('packet ' + p + ' cannot be read at ' + abs + '. Nothing was rendered.');
  const v = schemaLib.validate(SCHEMA, doc);
  if (!v.ok) die('packet ' + p + ' fails the packet schema (references/packet-schema.json):\n    ' + v.errors.slice(0, 6).join('\n    ')
    + (v.errors.length > 6 ? '\n    ... ' + (v.errors.length - 6) + ' more' : '') + '\n  Nothing was rendered: a board built from a malformed packet would look finished and be wrong.');
  return { ref: p, abs, dir: path.dirname(abs), doc };
});

// ---------------------------------------------------------------- completion
const SURFACE_TYPE = { email: 'email', paid: 'paid_static', web: 'web', social: 'social', video: 'video' };
const IMG_MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };

/* Required renders for a deliverable: the brief's geometry for that surface when the brief is
   readable, else the completion contract's defaults. A social carousel or story set renders one
   file per panel or frame at each ratio, keyed "<ratio> #<item>"; the count comes from the brief
   (panels, frames), else from the copy file's sequence. */
const SOCIAL_SETS = ['carousel', 'story_set'];
function requiredRenders(surface, deliverableName, copy, del) {
  const contract = CONTRACT.types[SURFACE_TYPE[surface]] || null;
  if (surface === 'social') return requiredSocial(contract, deliverableName, copy, del);
  if (brief && Array.isArray(brief.channels)) {
    const chs = brief.channels.filter(c => c && c.surface === surface);
    const geo = new Set();
    for (const ch of chs) for (const d of (ch.deliverables || [])) {
      if (deliverableName && d.name && d.name !== deliverableName) continue;
      (d.ratios || []).forEach(x => geo.add(String(x)));
      (d.breakpoints || []).forEach(x => geo.add(String(x)));
    }
    if (geo.size) return { list: [...geo], source: 'brief' };
  }
  return { list: (contract ? contract.required_renders : []).map(String), source: 'completion contract' };
}
function requiredSocial(contract, deliverableName, copy, del) {
  let bd = null;
  if (brief && Array.isArray(brief.channels)) {
    const ds = brief.channels.filter(c => c && c.surface === 'social').flatMap(c => c.deliverables || []);
    bd = ds.find(d => deliverableName && d.name === deliverableName) || (ds.length === 1 ? ds[0] : null);
  }
  const formats = Object.keys((contract && contract.required_renders_by_format) || {});
  const fmt = (bd && bd.format) || (copy && copy.post_format) || (del && formats.includes(del.type) ? del.type : null);
  let ratios = bd && (bd.ratios || []).length ? bd.ratios.map(String) : null, source = ratios ? 'brief' : 'completion contract';
  if (!ratios) ratios = ((contract && contract.required_renders_by_format && contract.required_renders_by_format[fmt]) || (contract ? contract.required_renders : [])).map(String);
  if (!SOCIAL_SETS.includes(fmt)) return { list: ratios, source, items: false };
  const fromBrief = bd ? (fmt === 'carousel' ? bd.panels : bd.frames) : null;
  const seq = copy && copy.gates && Array.isArray(copy.gates.sequence) ? copy.gates.sequence.length : null;
  const count = Number.isInteger(fromBrief) ? fromBrief : (seq || null);
  if (!count) return { list: ratios.map(r => r + ' #1'), source: source + '; panel or frame count unknown, so only the first is required', items: true };
  const list = [];
  for (const r of ratios) for (let i = 1; i <= count; i++) list.push(r + ' #' + i);
  return { list, source: source + (Number.isInteger(fromBrief) ? '' : '; count from the copy file\'s sequence'), items: true };
}
const renderKey = (r, items) => String(r.ratio_or_breakpoint) + (items ? ' #' + (Number.isInteger(r.item) ? r.item : '?') : '');
const renderLabel = r => r.ratio_or_breakpoint + (Number.isInteger(r.item) ? ' #' + r.item : '');

function renderState(pk, r) {
  const p = resolveFrom(pk.dir, r.path);
  if (!r.path) return { ok: false, why: 'no path: not rendered', path: null };
  if (r.placeholder === true || r.rendered_by === 'placeholder') return { ok: false, why: 'placeholder, not a render', path: p };
  if (!fs.existsSync(p)) return { ok: false, why: 'file missing at ' + p, path: p };
  return { ok: true, why: null, path: p };
}

function assess(pk) {
  const d = pk.doc;
  const findings = [];          // strings that make the route not-PASS
  const deliverables = d.channel_deliverables.map(del => {
    const copy = del.copy && del.copy.path ? readJson(resolveFrom(pk.dir, del.copy.path)) : null;
    const req = requiredRenders(del.surface, del.name, copy, del);
    const have = new Map();
    const renders = (del.renders || []).map(r => { const st = renderState(pk, r); if (st.ok) have.set(renderKey(r, req.items), st.path); return { ...r, key: renderKey(r, req.items), state: st }; });
    const missing = req.list.filter(x => !have.has(x));
    missing.forEach(x => findings.push(del.surface + ': ' + x + ' not rendered (' + req.source + ' requires it)'));
    renders.filter(r => !r.state.ok).forEach(r => findings.push(del.surface + ' ' + renderLabel(r) + ': ' + r.state.why));
    let lintReport = null, lintVerdict = del.lint ? del.lint.verdict : null, lintNote = null;
    if (del.lint && del.lint.path) {
      lintReport = readJson(resolveFrom(pk.dir, del.lint.path));
      if (!lintReport) { lintNote = 'lint report missing at ' + del.lint.path; findings.push(del.surface + ': ' + lintNote); }
      else if (lintReport.verdict && lintReport.verdict !== lintVerdict) { lintNote = 'packet declared ' + lintVerdict + ', the report says ' + lintReport.verdict; lintVerdict = lintReport.verdict; }
    } else { lintNote = 'no lint report'; findings.push(del.surface + ': no lint report'); }
    if (lintVerdict === 'FAIL') findings.push(del.surface + ': lint FAIL');
    if (lintVerdict === 'INSUFFICIENT-INPUT') findings.push(del.surface + ': lint INSUFFICIENT-INPUT');
    if (del.copy && del.copy.path && !copy) findings.push(del.surface + ': copy file unreadable at ' + del.copy.path);
    return { del, req, renders, missing, lintVerdict, lintNote, lintReport, copy };
  });
  const items = d.completion.items || [];
  items.filter(i => !i.done).forEach(i => findings.push('completion: "' + i.item + '" not done'));
  const contract = CONTRACT.types[d.completion.brief_type];
  const missingItems = contract ? contract.items.filter(ci => !items.some(i => i.item === ci)) : [];
  missingItems.forEach(ci => findings.push('completion: contract item "' + ci + '" absent from the checklist'));
  const anyFail = deliverables.some(x => x.lintVerdict === 'FAIL');
  const computedComplete = findings.length === 0;
  const verdict = anyFail ? 'FAIL' : (computedComplete ? 'PASS' : 'INSUFFICIENT-INPUT');
  const claimMismatch = d.completion.complete === true && !computedComplete;
  if (claimMismatch) findings.unshift('the packet claims complete: true; the board found the items above missing and does not take the claim');
  return { deliverables, findings, verdict, claimMismatch, items, missingItems };
}

const assessed = packets.map(pk => ({ pk, a: assess(pk) }));

/* Ordering: verifier rank only when every packet carries one. */
const allRanked = assessed.every(x => x.pk.doc.verifier && Number.isInteger(x.pk.doc.verifier.rank));
const ordering = allRanked ? 'ordered by verifier rank' : 'unranked: ' + (assessed.some(x => x.pk.doc.verifier) ? 'not every packet carries a verifier rank' : 'no verifier scores') + '; the board never ranks on its own';
if (allRanked) assessed.sort((a, b) => a.pk.doc.verifier.rank - b.pk.doc.verifier.rank);

/* Cost: per route from provenance.cost; a board total only over measured routes, and said so. */
const measured = provenance.measured;
const costs = assessed.map(x => provenance.normalizeCost(x.pk.doc.provenance));
const measuredCosts = costs.filter(measured);
const sum = k => measuredCosts.reduce((n, c) => n + (typeof c[k] === 'number' ? c[k] : 0), 0);
const totalLine = measuredCosts.length
  ? 'board total: in ' + sum('input_tokens') + ' · out ' + sum('output_tokens') + ' · media ' + sum('media_calls')
    + (measuredCosts.length < costs.length ? ' (' + measuredCosts.length + ' of ' + costs.length + ' routes measured; the rest not measured)' : ' (' + costs.length + ' routes measured)')
  : 'board total: not measured (no route carries measured cost)';

// ---------------------------------------------------------------- copy excerpts
function copyExcerpt(surface, copy) {
  if (!copy) return [];
  const rows = [];
  const first = a => (Array.isArray(a) && a.length ? a[0] : null);
  const txt = o => (o == null ? '' : (typeof o === 'string' ? o : (o.copy || o.text || '')));
  if (surface === 'email') {
    const route = (Array.isArray(copy.routes) && copy.routes.find(r => r && r.developed !== false)) || null;
    const g = (route && route.gates) || copy.gates || {};
    (g.subject || []).slice(0, 3).forEach((o, i) => rows.push(['Subject ' + (i + 1), txt(o)]));
    const ph = (route && route.preheader) || (copy.envelope && copy.envelope.preheader) || copy.preheader || [];
    if (first(ph)) rows.push(['Preheader', txt(first(ph))]);
    const hero = first(g.hero); if (hero) rows.push(['Hero', txt(hero) + (hero.copy2 ? ' / ' + hero.copy2 : '')]);
    const cta = first(g.cta); if (cta) rows.push(['CTA', txt(cta)]);
  } else if (surface === 'paid') {
    const g = copy.gates || {};
    (g.copy || []).forEach((o, i) => {
      rows.push(['Hook ' + String.fromCharCode(65 + i) + (o.axis ? ' (' + o.axis + ')' : ''), [o.headline ? 'Headline: ' + o.headline : '', o.primary_text ? 'Primary: ' + o.primary_text : '', o.on_image ? 'On image: ' + o.on_image : ''].filter(Boolean).join('  ·  ')]);
    });
    const concept = first(g.concept); if (concept) rows.push(['Concept', txt(concept)]);
  } else if (surface === 'web') {
    (copy.sections || []).slice(0, 8).forEach(sec => {
      const slots = sec.slots || {};
      const lead = slots.heading || slots.title || slots.eyebrow || '';
      const rest = Object.entries(slots).filter(([k]) => !['heading', 'title', 'eyebrow'].includes(k)).map(([k, v]) => k + ': ' + (Array.isArray(v) ? v.join(' | ') : v)).join('  ·  ');
      rows.push([sec.id || 'section', [lead, rest].filter(Boolean).join('  ·  ')]);
    });
  } else if (surface === 'social') {
    const g = copy.gates || {};
    const ag = copy.angle_gate || {};
    const picked = Array.isArray(g.angle) && Number.isInteger(ag.picked) ? g.angle[ag.picked] : null;
    const angle = picked || first(g.angle);
    if (angle) rows.push([picked ? 'Angle, picked' + (ag.picked_by === 'human' ? ' by a human' : (ag.provisional ? ' (recommended, provisional)' : '')) : 'Angle (first option; no pick recorded)', txt(angle)]);
    (g.cover || []).slice(0, 3).forEach((o, i) => rows.push(['Cover ' + String.fromCharCode(65 + i) + (o && o.axis ? ' (' + o.axis + ')' : ''), txt(o)]));
    (g.caption || []).slice(0, 3).forEach((o, i) => rows.push(['Caption ' + (i + 1) + ', first line', String(txt(o)).split(/\r?\n/)[0]]));
    (g.sequence || []).slice(0, 10).forEach((e, i) => {
      const slots = (e && e.slots) || {};
      const label = ((e && e.role) || 'panel') + (e && e.structure ? ' (' + e.structure + ')' : '') + ' ' + (i + 1);
      rows.push([label, Object.entries(slots).map(([k, v]) => k + ': ' + (Array.isArray(v) ? v.join(' | ') : v)).join('  ·  ')]);
    });
    if ((g.sequence || []).length > 10) rows.push(['Not shown', (g.sequence.length - 10) + ' more ' + (copy.post_format === 'story_set' ? 'frames' : 'panels') + '; the copy file has every one']);
  } else if (surface === 'video') {
    if (copy.script) rows.push(['Script', String(copy.script).slice(0, 400)]);
  }
  return rows;
}

// ---------------------------------------------------------------- images
function imageTag(p, label) {
  const ext = path.extname(p).toLowerCase();
  const mime = IMG_MIME[ext];
  if (!mime) return '<div class="nr present"><div class="nrt">' + esc(label) + '</div><div class="nrw">file present, not an image the board embeds (' + esc(ext || 'no extension') + '): ' + esc(p) + '</div></div>';
  let data;
  try { data = fs.readFileSync(p); } catch (e) { return '<div class="nr"><div class="nrt">NOT RENDERED</div><div class="nrw">' + esc(label) + ': unreadable (' + esc(e.message) + ')</div></div>'; }
  return '<figure class="render"><img alt="' + esc(label) + '" src="data:' + mime + ';base64,' + data.toString('base64') + '"><figcaption>' + esc(label) + '</figcaption></figure>';
}

// ---------------------------------------------------------------- html
const chip = (v, text) => '<span class="chip ' + R.verdictClass(v) + '">' + esc(text || v) + '</span>';
const tone = i => PALETTE.route_tones[i % PALETTE.route_tones.length];
const briefDeliverables = brief && Array.isArray(brief.channels)
  ? brief.channels.flatMap(ch => (ch.deliverables || []).map(d => ch.surface + ': ' + d.name + ((d.ratios || []).length ? ' (' + d.ratios.join('/') + ')' : '') + ((d.breakpoints || []).length ? ' (' + d.breakpoints.join('/') + ')' : '')))
  : [];
const overall = assessed.every(x => x.a.verdict === 'PASS') ? 'PASS' : (assessed.some(x => x.a.verdict === 'FAIL') ? 'FAIL' : 'INSUFFICIENT-INPUT');

let html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(manifest.title || (brief && brief.slug) || 'Options board') + '</title><style>'
  + ':root{--ink:#1c1a17;--muted:#6e675b;--line:#e6dfd1;--bg:#faf8f4;--card:#fff}'
  + 'body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
  + '.wrap{max-width:1100px;margin:0 auto;padding:30px 22px 70px}'
  + '.hdr{border-bottom:3px solid var(--ink);padding-bottom:12px;margin-bottom:16px}'
  + '.kicker{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:' + PALETTE.accent + '}'
  + 'h1{font-size:24px;margin:2px 0 4px}.hmeta{font-size:12.5px;color:var(--muted)}'
  + '.chips{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap}'
  + '.chip{font-size:11px;border-radius:999px;padding:2px 10px;background:#eef0f3;color:' + PALETTE.accent + ';font-weight:600}.chip.sc{background:#eaf0ea;color:#2f5e2b}.chip.warn{background:#fff3e0;color:#8a5a00}.chip.bad{background:#b0432e;color:#fff;font-weight:700}.chip.inv{background:rgba(255,255,255,.18);color:#fff;font-weight:500}'
  + '.stopband{background:#b0432e;color:#fff;padding:14px 22px;border-radius:12px;margin:0 0 18px}.stoptitle{font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.stopwhy{font-size:13.5px;margin-top:6px}'
  + 'h2.sec{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:24px 0 10px;border-bottom:1px solid var(--line);padding-bottom:5px}'
  + '.ctx{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:6px 16px}.crow{display:flex;gap:14px;padding:8px 0;border-bottom:1px dashed var(--line);font-size:13px}.crow:last-child{border-bottom:0}.cl{flex:0 0 128px;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding-top:2px}.cv{flex:1}'
  + '.route{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--tone);border-radius:14px;margin:16px 0;overflow:hidden;page-break-inside:avoid}'
  + '.rband{background:var(--tone);color:#fff;padding:13px 18px}.rlabel{font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.85}.rangle{font-size:19px;font-weight:750;margin-top:1px}.rmeta{margin-top:7px;display:flex;gap:6px;flex-wrap:wrap}'
  + '.slot{padding:12px 18px;border-bottom:1px dashed var(--line)}.slot:last-child{border-bottom:0}.sh{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:7px}'
  + '.mrow{font-size:13px;margin:3px 0}.flab{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-right:5px}'
  + '.renders{display:flex;gap:10px;flex-wrap:wrap}.render{margin:0;max-width:260px}.render img{max-width:260px;max-height:320px;border:1px solid var(--line);border-radius:8px;display:block}.render figcaption{font-size:11px;color:var(--muted);margin-top:3px}'
  + '.nr{min-width:200px;max-width:260px;border:2px dashed #b0432e;border-radius:8px;padding:12px;background:#fdf0ec}.nr.present{border-color:#8a5a00;background:#fff3e0}.nrt{font-size:11px;font-weight:800;letter-spacing:.1em;color:#b0432e}.nr.present .nrt{color:#8a5a00}.nrw{font-size:12px;margin-top:4px;color:#3c3831}'
  + 'table{border-collapse:collapse;font-size:12.5px}td,th{border-bottom:1px dashed var(--line);padding:4px 10px 4px 0;text-align:left;vertical-align:top}th{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}'
  + '.ok{color:#2f5e2b;font-weight:700}.no{color:#b0432e;font-weight:700}'
  + '.foot{background:#f1f3f5;border:1px solid #d5dbe0;border-radius:12px;padding:12px 18px;margin-top:20px;font-size:12.5px}.foot .stamp{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;margin:4px 0}'
  + '@media print{body{background:#fff}.wrap{padding:0}.route{page-break-inside:avoid}}'
  + '</style></head><body><div class="wrap">';

if (overall !== 'PASS') {
  html += '<div class="stopband"><div class="stoptitle">NOT EVERY ROUTE IS COMPLETE: ' + esc(overall) + '</div><div class="stopwhy">'
    + assessed.filter(x => x.a.verdict !== 'PASS').map(x => esc(x.pk.doc.route_id) + ' is ' + esc(x.a.verdict) + ' (' + esc(x.a.findings[0] || '') + ')').join(' · ')
    + '. A route that is not complete is on the board so you can see the work; it is not an option to pick until it is.</div></div>';
}
html += '<div class="hdr"><div class="kicker">options board · made by options-board · ' + esc(ordering) + '</div>'
  + '<h1>' + esc(manifest.title || (brief && (brief.slug || brief.objective)) || 'Options board') + '</h1>'
  + '<div class="hmeta">' + (brief ? 'Brand ' + esc(brief.brand || '?') + ' · brief ' + esc(manifest.brief_ref) : 'brief not readable at ' + esc(String(manifest.brief_ref)) + ': required renders taken from the completion contract') + ' · ' + assessed.length + ' route(s)</div>'
  + '<div class="chips">' + chip(overall, 'board: ' + overall) + assessed.map(x => chip(x.a.verdict, x.pk.doc.route_id + ' ' + x.a.verdict)).join('') + '</div></div>';

html += '<h2 class="sec">The brief</h2><div class="ctx">'
  + '<div class="crow"><div class="cl">Objective</div><div class="cv">' + esc(brief ? brief.objective : 'not readable') + '</div></div>'
  + (brief && brief.audience ? '<div class="crow"><div class="cl">Audience</div><div class="cv">' + esc(brief.audience) + '</div></div>' : '')
  + (brief && brief.message ? '<div class="crow"><div class="cl">Message</div><div class="cv">' + esc(brief.message) + '</div></div>' : '')
  + '<div class="crow"><div class="cl">Deliverables</div><div class="cv">' + (briefDeliverables.length ? briefDeliverables.map(esc).join('<br>') : 'none readable from the brief; the completion contract\'s defaults apply') + '</div></div>'
  + (routesPlan && routesPlan.mode ? '<div class="crow"><div class="cl">Route plan</div><div class="cv">' + esc(routesPlan.mode) + (routesPlan.provisional ? ', provisional (no human pick)' : '') + '</div></div>' : '')
  + '</div>';

html += '<h2 class="sec">The routes</h2>';
assessed.forEach((x, idx) => {
  const d = x.pk.doc, a = x.a;
  html += '<section class="route" style="--tone:' + tone(idx) + '"><div class="rband"><div class="rlabel">' + esc(d.route_id) + ' · ' + esc(d.frame) + (allRanked ? ' · verifier rank ' + esc(d.verifier.rank) : '') + '</div><div class="rangle">' + esc(d.angle) + '</div>'
    + '<div class="rmeta">' + chip(a.verdict, a.verdict) + a.deliverables.map(dl => '<span class="chip inv">' + esc(dl.del.surface) + ': lint ' + esc(dl.lintVerdict || 'none') + '</span>').join('') + '</div></div>';
  if (a.findings.length) html += '<div class="slot"><div class="sh">Why this route is ' + esc(a.verdict) + '</div>' + a.findings.map(f => '<div class="mrow no">' + esc(f) + '</div>').join('') + '</div>';
  a.deliverables.forEach(dl => {
    html += '<div class="slot"><div class="sh">' + esc(dl.del.surface) + (dl.del.name ? ' · ' + esc(dl.del.name) : '') + (dl.del.type ? ' · ' + esc(dl.del.type) : '') + ' ' + chip(dl.lintVerdict || 'MISSING', 'lint ' + (dl.lintVerdict || 'report missing')) + (dl.lintNote ? ' <span class="mrow" style="color:#8a5a00">' + esc(dl.lintNote) + '</span>' : '') + '</div>';
    const rows = copyExcerpt(dl.del.surface, dl.copy);
    if (rows.length) html += rows.map(([k, v]) => '<div class="mrow"><span class="flab">' + esc(k) + '</span>' + esc(v) + '</div>').join('');
    else html += '<div class="mrow no">copy not readable' + (dl.del.copy && dl.del.copy.path ? ' at ' + esc(dl.del.copy.path) : ': no copy path') + '</div>';
    html += '<div class="renders" style="margin-top:8px">';
    dl.renders.forEach(r => {
      const label = dl.del.surface + ' ' + renderLabel(r) + (r.rendered_by ? ' · ' + r.rendered_by : '');
      html += r.state.ok ? imageTag(r.state.path, label) : '<div class="nr"><div class="nrt">NOT RENDERED</div><div class="nrw">' + esc(label) + ': ' + esc(r.state.why) + '</div></div>';
    });
    dl.missing.filter(m => !dl.renders.some(r => r.key === m)).forEach(m => {
      html += '<div class="nr"><div class="nrt">NOT RENDERED</div><div class="nrw">' + esc(dl.del.surface + ' ' + m) + ': expected by the ' + esc(dl.req.source) + ', no render declared</div></div>';
    });
    html += '</div>';
    if (dl.del.image_plan) {
      const ip = dl.del.image_plan;
      html += '<div class="mrow" style="margin-top:6px"><span class="flab">Image plan</span>' + esc([ip.scene, ip.pack_composite && ip.pack_composite.sku ? 'pack ' + ip.pack_composite.sku + (ip.pack_composite.file ? ' (' + ip.pack_composite.file + ')' : ', NO PACK FILE') : 'no pack composite', ip.focal_point ? 'focal point ' + ip.focal_point : '', ip.source ? 'source ' + ip.source : ''].filter(Boolean).join(' · ')) + '</div>';
    }
    html += '</div>';
  });
  if (d.verifier) {
    html += '<div class="slot"><div class="sh">Verifier' + (d.verifier.verified_by ? ' · ' + esc(d.verifier.verified_by) : '') + (d.verifier.independent === true ? ' · independent' : d.verifier.independent === false ? ' · in-run review, not independent' : '') + '</div><table><tr><th>dimension</th><th>score</th><th>pass</th><th>note</th></tr>'
      + Object.entries(d.verifier.scores || {}).map(([k, s]) => '<tr><td>' + esc(k) + '</td><td>' + esc(s && typeof s.score === 'number' ? s.score.toFixed(2) : '?') + '</td><td class="' + (s && s.pass ? 'ok' : 'no') + '">' + (s && s.pass ? 'yes' : 'no') + '</td><td>' + esc(s && s.note) + '</td></tr>').join('')
      + '</table>' + ((d.verifier.unknown || []).length ? '<div class="mrow">could not judge: ' + esc(d.verifier.unknown.join(', ')) + '</div>' : '') + '</div>';
  } else html += '<div class="slot"><div class="sh">Verifier</div><div class="mrow">not verified: no scores, no rank. The board does not score.</div></div>';
  html += '<div class="slot"><div class="sh">Completion · ' + esc(CONTRACT.types[d.completion.brief_type] ? CONTRACT.types[d.completion.brief_type].label : d.completion.brief_type) + ' · board says ' + esc(a.verdict === 'FAIL' ? 'INSUFFICIENT-INPUT (lint FAIL)' : a.verdict) + (a.claimMismatch ? ' · packet claimed complete' : '') + '</div>'
    + a.items.map(i => '<div class="mrow"><span class="' + (i.done ? 'ok' : 'no') + '">' + (i.done ? '&#10003;' : '&#10007;') + '</span> ' + esc(i.item) + (i.evidence ? ' <span class="flab">' + esc(i.evidence) + '</span>' : '') + '</div>').join('')
    + a.missingItems.map(i => '<div class="mrow"><span class="no">&#10007;</span> ' + esc(i) + ' <span class="flab">absent from the checklist</span></div>').join('') + '</div>';
  html += '<div class="slot"><div class="sh">Passed over</div>' + ((d.passed_over || []).length ? d.passed_over.map(p => '<div class="mrow"><span class="flab">' + esc(p.reason) + '</span>' + esc(p.option) + (p.gate ? ' <span class="flab">' + esc(p.gate) + '</span>' : '') + (p.note ? ' · ' + esc(p.note) : '') + '</div>').join('') : '<div class="mrow">nothing recorded as passed over</div>') + '</div>';
  html += '</section>';
});

html += '<div class="foot"><b>Provenance</b>' + assessed.map((x, i) => {
  const p = x.pk.doc.provenance || {};
  return '<div class="stamp">' + esc(x.pk.doc.route_id) + ' · Brand: ' + esc(p.brand) + ' · context: ' + esc(p.brand_context) + (p.voice ? ' · voice: ' + esc(p.voice) : '') + ' · ' + esc(provenance.costLine(p)) + '</div>';
}).join('') + '<div class="stamp"><b>' + esc(totalLine) + '</b></div>'
  + '<div class="mrow" style="margin-top:6px">' + esc(ordering) + '. To pick: reply with the route id. Anything you want redrafted, say the surface and the direction.</div></div>';
html += '</div></body></html>';

try { fs.writeFileSync(arg('--out'), html); }
catch (e) { die('the board rendered but could not be written to ' + arg('--out') + ' (' + e.message + ')'); }

// ---------------------------------------------------------------- markdown
if (has('--out-md')) {
  const md = [];
  md.push('# ' + (manifest.title || (brief && brief.slug) || 'Options board') + (overall !== 'PASS' ? '  (NOT EVERY ROUTE IS COMPLETE: ' + overall + ')' : ''));
  md.push('');
  md.push(ordering + '. ' + assessed.length + ' route(s).');
  md.push('');
  md.push('**Objective.** ' + (brief ? brief.objective : 'brief not readable'));
  md.push('**Deliverables.** ' + (briefDeliverables.join('; ') || 'none readable from the brief'));
  md.push('');
  assessed.forEach(x => {
    const d = x.pk.doc, a = x.a;
    md.push('## ' + d.route_id + ' · ' + d.frame + ' · ' + a.verdict + (allRanked ? ' · rank ' + d.verifier.rank : ''));
    md.push('');
    md.push('*' + d.angle + '*');
    md.push('');
    a.findings.forEach(f => md.push('- NOT COMPLETE: ' + f));
    a.deliverables.forEach(dl => {
      md.push('');
      md.push('**' + dl.del.surface + (dl.del.name ? ' · ' + dl.del.name : '') + '** · lint ' + (dl.lintVerdict || 'report missing') + (dl.lintNote ? ' (' + dl.lintNote + ')' : ''));
      copyExcerpt(dl.del.surface, dl.copy).forEach(([k, v]) => md.push('- ' + k + ': ' + v));
      dl.renders.forEach(r => md.push('- render ' + renderLabel(r) + ': ' + (r.state.ok ? r.state.path : 'NOT RENDERED (' + r.state.why + ')')));
      dl.missing.filter(m => !dl.renders.some(r => r.key === m)).forEach(m => md.push('- render ' + m + ': NOT RENDERED (expected by the ' + dl.req.source + ', none declared)'));
    });
    md.push('');
    md.push('Verifier: ' + (d.verifier ? Object.entries(d.verifier.scores || {}).map(([k, s]) => k + ' ' + (s && typeof s.score === 'number' ? s.score.toFixed(2) : '?') + (s && s.pass ? ' pass' : ' fail')).join('; ') || 'no dimensions' : 'not verified; the board does not score'));
    md.push('Completion: ' + a.items.map(i => (i.done ? '[x] ' : '[ ] ') + i.item).join('; ') + (a.missingItems.length ? '; absent: ' + a.missingItems.join('; ') : ''));
    md.push('Passed over: ' + ((d.passed_over || []).map(p => p.reason + ': ' + p.option).join('; ') || 'nothing recorded'));
    md.push('');
  });
  md.push('## Provenance');
  md.push('');
  assessed.forEach(x => { const p = x.pk.doc.provenance || {}; md.push('- ' + x.pk.doc.route_id + ' · Brand: ' + p.brand + ' · context: ' + p.brand_context + ' · ' + provenance.costLine(p)); });
  md.push('- ' + totalLine);
  md.push('');
  try { fs.writeFileSync(arg('--out-md'), md.join('\n') + '\n'); }
  catch (e) { die('the markdown board could not be written to ' + arg('--out-md') + ' (' + e.message + ')'); }
}

console.log('board written: ' + arg('--out') + ' (' + assessed.length + ' route(s), ' + overall + ', ' + ordering + ')');
assessed.forEach(x => console.log('  ' + x.pk.doc.route_id + ' ' + x.a.verdict + (x.a.findings.length ? ': ' + x.a.findings[0] : '')));
console.log('  ' + totalLine);
process.exit(overall === 'PASS' ? 0 : 1);
