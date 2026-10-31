#!/usr/bin/env node
/* exemplar_pick.js — hand each gate the real brand lines that match it.

   Why this is a script and not a paragraph in SKILL.md.

   The exemplars are the single biggest lever on how the copy reads, and on
   27 July they stopped reaching the generator without anyone noticing. 369 tests
   and 25 graded eval cases stayed green while the writing got materially worse,
   because every one of those checks grades whether a rule fired, and none grades
   whether a line is worth sending. A prose instruction to "show the matching
   exemplars" has exactly the failure mode that produced that: it is invisible
   when it stops happening.

   The second job is the one prose cannot do at all. In a typical exemplar file most
   role-by-type cells are empty, and many of the rest hold a single line. A gate steered by a
   single example is not being shown a voice, it is being shown a line to copy —
   which is the parroting the July blind tests caught. The caller has to be told
   when that is the situation, and told at the moment it happens rather than in a
   coverage report nobody reads.

   Exit codes follow the suite convention:
     0  ran clean — matches found, coverage adequate
     1  ran and found a problem — no exemplar for this role at all
     2  could not start — missing or unreadable exemplar file

   Usage:
     node exemplar_pick.js --pack <brand pack folder> --channel email --role headline --type product_launch
     node exemplar_pick.js --file <exemplars.json> [--favorites <favorites.json>] --role headline --type product_launch
     node exemplar_pick.js --file <exemplars.json> --coverage
   --pack (or --brand-context / --brand) resolves the file from the pack's `exemplars` role and the
   favorites from its `favorites` role; explicit --file and --favorites win.

   FAVORITES OUTRANK THE HISTORICAL FILE (0.3.0). When the first calibrated brand owner marked lines
   keep or cut, blind, he cut every line drawn from his historical exemplar corpus: an owner's keeps are
   the target, a corpus is not. So when the pack carries a `favorites` role, favorites matching the role (and
   channel) are handed to the gate first, and historical exemplars only fill the slots that remain.
   Every pick records which ids it returned (favorites and exemplars apart) so a slate can say what
   steered each gate. Cuts live in voice_calibration and are never read here: a favorites file that
   carries a line marked cut has that line dropped, and the drop is reported.
*/
'use strict';
const fs = require('fs');
const path = require('path');

function die(msg, code) {
  process.stderr.write('exemplar_pick: ' + msg + '\n');
  process.exit(code);
}
const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  die('the shared module lib/' + name + ' is not beside this plugin (looked in ' + cands.join(', ') + ').', 2);
}
const pack = sharedLib('pack.js');

let FILE = arg('--file');
let FAV_FILE = arg('--favorites');
let favoritesRoleNull = false;
{
  let CTX = null;
  try { CTX = pack.resolveContext(process.argv); } catch (e) { die(e.message, 2); }
  if (CTX && !FAV_FILE) {
    const f = pack.resolveRole(CTX, 'favorites');
    if (f === false) die('the brand context names favorites "' + CTX.fileMap.favorites + '" and it is not '
      + 'beside it. Fix the map rather than dropping the favorites: they outrank the historical exemplars.', 2);
    if (f) FAV_FILE = f; else favoritesRoleNull = true;
  }
  if (CTX && !FILE) {
    const p = pack.resolveRole(CTX, 'exemplars');
    if (p === null && !FAV_FILE) die('the pack\'s `exemplars` role is null and it has no favorites: this brand has no voice model on file. '
      + 'Draft from the voice contract alone and say so in notes. Do NOT substitute another brand\'s '
      + 'or another channel\'s exemplars.', 2);
    if (p === false) die('the brand context names exemplars "' + CTX.fileMap.exemplars + '" and it is not '
      + 'beside it. Fix the map rather than dropping the exemplars.', 2);
    if (p) FILE = p;
  }
}
const CHANNEL = arg('--channel');
const ROLE = arg('--role');
const TYPE = arg('--type');
const VOICE = arg('--voice');
const WANT = parseInt(arg('--want') || '6', 10);
const COVERAGE = process.argv.includes('--coverage');
const JSON_OUT = process.argv.includes('--json');

/* THIN is the count at or below which a match set is reported as too small to be
   a voice model. Three is the floor because two lines share every incidental
   property they happen to have — a shared opener, a shared length — and a
   generator cannot tell an incidental from a pattern at n=2. It is a warning and
   never a block: thin steering still beats none, and refusing to draft because a
   role is under-curated would make the tool useless exactly where the brand is
   least developed. */
const THIN = 3;

if (!FILE && !FAV_FILE) die('no --file given. Pass the exemplars file from the brand context file map '
  + '(the `exemplars` role). Without it the generator writes from the contract alone, '
  + 'which reads correct and generic.', 2);

let all = [], doc = null;
if (FILE) {
  let raw;
  try { raw = fs.readFileSync(FILE, 'utf8'); }
  catch (e) { die('cannot read "' + FILE + '" (' + e.code + '). If the file map points at a file '
    + 'that is not there, fix the map rather than dropping the exemplars — a silent drop is how '
    + 'the voice model was lost on 27 July.', 2); }
  try { doc = JSON.parse(raw); }
  catch (e) { die('"' + FILE + '" is not valid JSON: ' + e.message, 2); }
  all = Array.isArray(doc) ? doc : doc.exemplars;
  if (!Array.isArray(all)) die('"' + FILE + '" has no `exemplars` array. Expected either a bare array '
    + 'or an object with an `exemplars` key.', 2);
  /* An empty file is exit 2, not exit 0 with an empty pick. A scaffold that has not
     been filled yet is a channel with NO voice model, and the caller has to know
     that before it drafts — silently returning nothing is how the model was lost on
     27 July. If the file explains itself, pass that explanation through rather than
     making someone open it. */
  if (!all.length && !FAV_FILE) {
    const why = (!Array.isArray(doc) && (doc.why_empty || doc.status)) ? ' ' + (doc.status ? doc.status + ' ' : '') + (doc.why_empty || '') : '';
    die('"' + FILE + '" contains zero exemplars — this channel has no voice model.' + why
      + ' Draft from the voice contract alone and say so in notes. Do NOT substitute another '
      + "channel's exemplars.", 2);
  }
}

/* The favorites file: {favorites: [{id, text, role, channel?, type?, verdict?}]} or a bare array.
   File-level `channel` and `brief_type` are defaults for lines that carry none. Lines marked cut
   are dropped and counted: cuts are anti-exemplars for the judge, never examples for the writer. */
let favorites = [], favNotes = [], favDroppedCuts = 0;
if (FAV_FILE) {
  let fdoc;
  try { fdoc = JSON.parse(fs.readFileSync(FAV_FILE, 'utf8')); }
  catch (e) { die('the favorites file "' + FAV_FILE + '" will not load (' + e.message + '). Fix it rather than dropping it: favorites outrank the historical exemplars.', 2); }
  const list = Array.isArray(fdoc) ? fdoc : fdoc.favorites;
  if (!Array.isArray(list)) die('"' + FAV_FILE + '" has no `favorites` array.', 2);
  const dflChannel = (!Array.isArray(fdoc) && fdoc.channel) || null;
  const dflType = (!Array.isArray(fdoc) && (fdoc.brief_type || fdoc.type)) || null;
  list.forEach((f, i) => {
    if (!f || typeof f.text !== 'string' || !f.text.trim()) return;
    if (/^cut$/i.test(String(f.verdict || ''))) { favDroppedCuts++; return; }
    favorites.push({ ...f, id: f.id || ('fav' + i), role: f.role, channel: f.channel || dflChannel || null,
                     type: f.type || dflType || null, voice: f.voice || null, source: 'favorites' });
  });
  if (favDroppedCuts) favNotes.push(favDroppedCuts + ' line(s) marked cut were dropped from the favorites file: cuts are never shown to the writer as examples');
  if (!favorites.length) favNotes.push('the favorites file holds no usable line');
}

// ------------------------------------------------------------------ coverage
if (COVERAGE) {
  const cov = CHANNEL ? all.filter(e => e.channel === CHANNEL) : all;
  if (!cov.length) die('no exemplar has channel "' + CHANNEL + '" — nothing to report coverage on. '
    + 'Channels present: ' + ([...new Set(all.map(e => e.channel).filter(Boolean))].sort().join(', ') || 'none'), 1);
  const roles = [...new Set(cov.map(e => e.role))];
  const types = [...new Set(cov.map(e => e.type))];
  const cell = (r, t) => cov.filter(e => e.role === r && e.type === t).length;
  const rows = [];
  let empty = 0, single = 0;
  for (const r of roles) for (const t of types) {
    const n = cell(r, t);
    if (!n) { empty++; rows.push({ role: r, type: t, count: 0 }); }
    else if (n <= 1) { single++; rows.push({ role: r, type: t, count: n }); }
  }
  const out = {
    total: cov.length, roles: roles.length, types: types.length,
    favorites: FAV_FILE ? { source: FAV_FILE, total: favorites.length, dropped_cuts: favDroppedCuts,
      by_role: Object.fromEntries([...new Set(favorites.map(f => f.role))].map(r => [r, favorites.filter(f => f.role === r).length])) } : null,
    cells: roles.length * types.length,
    cells_with_any: roles.length * types.length - empty,
    cells_with_one: single,
    by_role: Object.fromEntries(roles.map(r => [r, cov.filter(e => e.role === r).length])),
    by_voice: Object.fromEntries([...new Set(cov.map(e => e.voice))].filter(Boolean)
      .map(v => [v, cov.filter(e => e.voice === v).length])),
    thin_or_empty: rows,
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  process.exit(0);
}

if (!ROLE) die('no --role given. Every gate has a role (headline, body, cta, subject, '
  + 'subhead, preheader, eyebrow, descriptor, testimonial) and the pick is role-first.', 2);

/* CHANNEL IS A HARD FILTER, NOT A PREFERENCE.

   Role names repeat across channels and do not mean the same thing. An email
   `headline` is a hero line to someone who opted in and already knows the brand.
   A paid `headline` is a ~40-character field under an image, competing in a feed
   against strangers, where the first three words decide whether the rest is read.
   A web `heading` orients someone who is already on the page and has different
   work to do than either.

   Handing email exemplars to a paid gate would produce copy that is fluent, on
   voice, and wrong for the surface — which is harder to catch in review than
   copy that is obviously bad. So channel is filtered before role and is never
   relaxed to widen a thin pick. A file with no channel tags at all is treated as
   untagged rather than as matching everything, because silently matching
   everything is exactly the failure this guards. */
const untagged = all.length > 0 && !all.some(e => e.channel);
let pool = all;
if (CHANNEL) {
  if (untagged) die('--channel ' + CHANNEL + ' was requested but no exemplar in "' + FILE
    + '" carries a `channel` field. Tag them before filtering: an untagged file cannot prove '
    + 'a line belongs to the surface you are writing for, and a role name alone does not — '
    + 'an email headline and a paid headline are different jobs.', 2);
  pool = all.filter(e => e.channel === CHANNEL);
  if (!pool.length && !favorites.some(f => f.channel === CHANNEL)) {
    const have = [...new Set(all.map(e => e.channel).filter(Boolean))].sort().join(', ') || 'none';
    die('no exemplar has channel "' + CHANNEL + '". Channels present: ' + have + '. '
      + 'Draft from the contract alone for this gate and say so in notes — do NOT fall back to '
      + 'another channel\'s exemplars, which read as on-voice and are wrong for the surface.', 1);
  }
} else if (!untagged && all.length) {
  const chans = [...new Set(all.map(e => e.channel).filter(Boolean))];
  if (chans.length > 1) die('"' + FILE + '" holds exemplars for more than one channel ('
    + chans.sort().join(', ') + ') and no --channel was given. Pass one. Mixing channels is '
    + 'silent: the copy comes back fluent and on voice, and wrong for the surface.', 2);
}

/* The same channel rule for favorites: a favorite that cannot prove its surface is not handed to a
   channel-filtered gate. It is excluded with a note rather than a refusal, because favorites are a
   layer on top of the voice model and their absence degrades, it does not block. */
const normRole = r => String(r || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
let favPool = favorites;
if (CHANNEL) {
  const untaggedFav = favorites.filter(f => !f.channel).length;
  if (untaggedFav) favNotes.push(untaggedFav + ' favorite(s) carry no channel tag and were not matched against --channel ' + CHANNEL + '; tag them (or set a file-level channel) to use them');
  favPool = favorites.filter(f => f.channel === CHANNEL);
}

// ---------------------------------------------------------------------- pick
/* Widening order matters and is deliberate. Role is never relaxed — a headline
   exemplar does not teach a CTA anything, and mixing roles is how a four-word
   button ends up written like a sentence. Type is relaxed first because the brand's
   voice carries across types more than it carries across roles. Voice quality is
   a filter on top, never a widening step, because the contract's rule is lead
   with one per piece — so a caller asking for one named quality wants that quality
   or wants to know there isn't any. */
const favByRole = favPool.filter(f => normRole(f.role) === normRole(ROLE));
const byRole = pool.filter(e => e.role === ROLE);
if (!byRole.length && !favByRole.length) {
  const have = [...new Set(pool.map(e => e.role))].sort().join(', ');
  die('no exemplar has role "' + ROLE + '"' + (CHANNEL ? ' on channel "' + CHANNEL + '"' : '')
    + '. Roles present: ' + have + '. '
    + 'Draft from the contract alone for this gate and say so in notes — do not '
    + 'substitute another role\'s exemplars.', 1);
}

/* Favorites first: the ones on this type, then the rest of the role. They are the brand owner's own
   keeps and outrank the historical file. Historical exemplars fill the slots that remain, type-exact
   first and widened to the role when that is thin, exactly as before. */
const favOrdered = TYPE ? favByRole.filter(f => f.type === TYPE).concat(favByRole.filter(f => f.type !== TYPE)) : favByRole;
let picked = TYPE ? byRole.filter(e => e.type === TYPE) : byRole;
let widened = null;
const remaining = Math.max(0, WANT - Math.min(favOrdered.length, WANT));
if (TYPE && remaining > 0 && picked.length + favOrdered.length < THIN) {
  const exact = picked.length;
  picked = byRole;
  widened = 'type "' + TYPE + '" had ' + exact + ' exemplar(s) for role "' + ROLE
    + '", so the pick widened to every ' + ROLE + ' exemplar regardless of type';
}
if (VOICE) {
  const v = picked.filter(e => e.voice === VOICE);
  if (v.length) picked = v;
}

const favChosen = favOrdered.slice(0, WANT);
const exChosen = picked.filter(e => !favChosen.some(f => f.text === e.text)).slice(0, remaining);
const chosen = favChosen.map(f => ({ ...f, source: 'favorites' })).concat(exChosen.map(e => ({ ...e, source: 'exemplars' })));
const thin = chosen.length < THIN;

const notes = [];
if (widened) notes.push(widened);
notes.push(...favNotes);
if (favChosen.length) {
  notes.push(favChosen.length + ' favorite(s) shown first (the brand owner\'s own keeps outrank the historical file)'
    + (exChosen.length ? '; ' + exChosen.length + ' historical exemplar(s) fill the rest' : '; no historical exemplar was needed'));
  const offType = TYPE ? favChosen.filter(f => f.type && f.type !== TYPE) : [];
  if (offType.length) notes.push(offType.length + ' of those favorite(s) were starred on type "' + [...new Set(offType.map(f => f.type))].join('", "')
    + '", not "' + TYPE + '": they carry the brand owner\'s taste for the role, not this occasion, so read them for register and cadence');
}
else if (FAV_FILE) notes.push('no favorite matches role "' + ROLE + '"' + (CHANNEL ? ' on channel "' + CHANNEL + '"' : '') + '; historical exemplars only');
else if (favoritesRoleNull) notes.push('the pack\'s favorites role is null: historical exemplars only');
if (thin) notes.push('only ' + chosen.length + ' exemplar(s) match — too few to read as a pattern. '
  + 'The generator will tend to imitate these lines rather than the voice behind them. '
  + 'Treat the output of this gate as needing a closer read, and add exemplars for this role.');
if (VOICE && !picked.some(e => e.voice === VOICE)) {
  notes.push('no "' + VOICE + '" exemplar exists for this role; the voice filter was ignored');
}

/* What this gate saw, by id, so the slate can record it. A reviewer reconstructing what steered a
   gate needs the ids, not the count: the 2026-09-06 audit could not tell which lines any gate had seen. */
const shown = chosen.map(e => ({ id: e.id || null, source: e.source }));
const favoriteIds = favChosen.map(f => f.id), exemplarIds = exChosen.map(e => e.id || null);
if (JSON_OUT) {
  process.stdout.write(JSON.stringify({
    channel: CHANNEL || null, role: ROLE, type: TYPE || null, matched: chosen.length,
    thin, widened: !!widened, notes, exemplars: chosen,
    favorites: { source: FAV_FILE || null, matched: favChosen.length, ids: favoriteIds, dropped_cuts: favDroppedCuts },
    exemplar_ids: exemplarIds, shown,
  }, null, 2) + '\n');
} else {
  process.stdout.write('REAL BRAND LINES FOR THIS GATE — '
    + (CHANNEL ? 'channel: ' + CHANNEL + ' · ' : '') + 'role: ' + ROLE
    + (TYPE ? ' · type: ' + TYPE : '') + '\n');
  process.stdout.write('Imitate the cadence and the personality. Do not reuse the words, '
    + 'and do not carry over any figure or claim from an exemplar — the facts come from '
    + 'the facts layer only.\n\n');
  for (const e of chosen) {
    process.stdout.write('  ' + JSON.stringify(e.text)
      + '   [' + [e.source === 'favorites' ? 'favorite ' + e.id : e.id, e.type, e.frame, e.voice].filter(Boolean).join(' · ') + ']\n');
  }
  if (notes.length) {
    process.stdout.write('\nCOVERAGE\n');
    for (const n of notes) process.stdout.write('  - ' + n + '\n');
  }
  process.stdout.write('\nSHOWN (record these ids in the slate\'s provenance.exemplars_shown for this gate)\n');
  process.stdout.write('  favorites: ' + (favoriteIds.join(', ') || 'none') + '\n');
  process.stdout.write('  exemplars: ' + (exemplarIds.filter(Boolean).join(', ') || 'none') + '\n');
}

/* A thin pick is a warning, not a failure: the draft is still better with two real
   lines than with none. Exit 0 so a run does not stop, and the note carries. */
process.exit(0);
