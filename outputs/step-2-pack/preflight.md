# HLR Pack v0: preflight

Lane E, 2026-10-20. Pack: `brand-pack/` with `brand-context.md` (written by lane E today). Engine: `hlr-studio-engine` 0.5.1, the installed release (`outputs/step-3-bundle/hlr-studio-engine-0.5.1.plugin`, sha256 0715777439f72175918dea7f86e1b64d29b72cf29fd0546e1f7f17bd83e6c8a5), unzipped to `~/rc/engine`. Every command ran in the Mac's Cowork shell; section 5 holds them, ready to rerun. The Gate 2 calls these results feed: `gate-2-package.md` (cited here as "package call N"). Results as of review round 3 (2026-10-21), after lane C's calls were ruled in lane C's chat and lane E moved the exemplars and set the role. Rerun on 2026-10-23 after Gate 2 and Gate 4, on the installed engine 0.5.3, with round 3's guard fixes: section 7.

## 1. Results

| Check | Result |
|---|---|
| `preflight.py --pack` | exit 0: resolved 6, blocking 0, degraded 9. "RUNS, with reduced quality where noted" |
| `preflight.py --brand hlr` | the same, through the registry: its pack path is read through `claude-cowork/` in the Cowork shell |
| `tokens_build.js check --pack` | exit 0: 32 graded pair-roles, all pass |
| `tokens_build.js export --pack` (to a scratch folder) | exit 0: the identity resolves from the File map (`--hlr-`, 102 custom properties); provenance 28 documented, 23 observed, 51 derived; web scale only, as 0.5.1 does |
| `sku_lookup.js --pack` | a handle resolves to its display name; `allowed_figures` is empty, since every `description` is empty |
| `exemplar_pick.js --pack` | runs on every channel: email 72 lines in 5 roles, social 49 in 5, paid 30 in 1, web 8 in 3 (exemplars approved by Eddie 2026-10-21, lane C call 2 a) |
| Provenance scan (REVIEW.md rule 4) | 102 tokens: 28 documented, 23 observed, 51 derived by first tag; 0 untagged; 3 with two tags; 52 with a derived part, none ruled |
| R7 guard (section 3) | holds: 15 pass, 1 note (`page_lint.js` refuses every page while `section_library` is null); each end-to-end pass quotes the em dash as the hit and its comma control draws nothing |
| R14 guard (section 4) | 2 failures (the strictness map's owner, in two places), 7 warnings; they go to Eddie as package calls 7 and 16 |
| Tag scan (section 5) | holds: 71 rule lines in `brand-context.md`'s narrative, each with a provenance tag |
| Census (REVIEW.md rule 9), `brand-pack/` | 0 hits on any other brand's term (327 terms rebuilt 2026-10-21: no new term against 0.5.2's list); 14 figma-key-shaped hits, all HLR's own files: the reference copy 7, the library 5, HLR-EMAIL 1, HLR-Social 1. The brand home's tracked and untracked files (rule 9's copy): 58 hits, all HLR's four keys; the ignored list holds `_setup/` and the client originals only |
| Em dash bytes in lane E's three files | 0 |

Nothing blocks. `preflight.py` grades three required roles (voice contract, product database, type registry; the claims ledger role was removed in engine 0.6.0, DECISIONS 2026-10-31) and they resolve, with the concrete lexicon and the exemplars; the rest of the pack degrades or stops by design, as section 2 lists.

## 2. What degrades, and who closes it

From `preflight.py` (its nine degraded roles) and from the pack contract's cost column for the roles `preflight.py` does not grade. Owners and steps are the gap rows in `brand-context.md`.

| Role or state | What it costs today | Owner | Closes at |
|---|---|---|---|
| `favorites`, `voice_calibration` null | the owner's keeps steer nothing; no pack voice model can be fitted | Eddie (HLR's reviewers later) | Step 5, the blind keep or cut sheet |
| `voice_model` null | the advisory voice judge runs the engine's default weights and says so | Chat 7 | Step 5 |
| `judge_rubric`, `judge_calibration` null | every verifier rank says no measured preference is on file and it was never checked against the owner | Chat 7 | Step 5 |
| `slotmap`, `seam_map`, `module_library` null | `copy_lint.js` runs with slot checking off; module copy goes to slot ids alone; the one-pager labels modules UNKNOWN | Chat 6 | Step 4 |
| `strictness_map` null | the design pass has no posture per component | Eddie assigns (package call 7) | Gate 4, under call 7's default |
| `options_register` null | `register_append.js` has nowhere to write: why a line was kept is lost | Chat 7 | Step 5 |
| `type_registry_overlay` null | nothing: the core registry governs | Eddie | none |
| `slotmap_social` wired, every budget null | `social_lint.js` asks for a sign-off on each unmeasured slot | Chat 6 | Step 4 |
| `slotmap_paid` null | `paid_lint.js` in-frame checks off; paid runs on the engine's bundled ad types | Eddie | Review 2 |
| `section_library` null | `web-copy` stops and `page_lint.js` refuses every page (blocking by design, lane D's Gate 2 call 1 b) | Eddie | Review 2, unless package call 13 b |
| `grounding_inputs` null | paid concepts are labelled hypotheses | Eddie, then HLR | Review 1, if package call 17 puts the question there |
| `insight_register` null | customer-evidence cannot tell what is already believed beyond `brand-context.md`'s section | Eddie, then HLR | Review 1, if package call 17 puts the question there |
| the claims ledger role | removed in engine 0.6.0 (DECISIONS 2026-10-31): no legal status, no counsel sign-off; its product facts are in `products.json` `_meta.brand_facts` with their sources, the file archived under `_archive/brand-pack/`; every lint carries a `sourcing` line in place of `claims_checking` | none | none |
| `faces_policy`, `image_look`, `pack_shot_index`, `video_rules` null | image and video layers report the gap; every image well is a labelled grey placeholder | HLR, Eddie | Review 1; scope |
| `fonts.licensed: false` | every deliverable that renders text carries the license flag | HLR | before production |
| Canvas modes in `tokens.json` | 0.5.1 exports the web scale only; 0.5.2's `check`, `export` and `figma-plan` stop | lane H | 0.5.3 |

## 3. Guard R7: the em dash in `prohibited_patterns`

REVIEW.md section 6, R7: the copy lints did not block an em dash (`copy_lint.js` warned only on an unspaced one; the others never checked). The guard is the escape for U+2014, written as text (a backslash, then u2014), as the first entry of `prohibited_patterns` in the File map, from lane C's notes, section 2. The pack contract makes the list blocking for every lint, and the check below proves it end to end:

- the fragment is in the list as text, and `brand-context.md` carries no em dash character;
- compiled the way the lints compile it, the list's match on a line with U+2014 is the em dash itself, and the list matches neither the footer disclaimer (HLR-REQ-01) nor the same line with a comma;
- each of the five lints (`copy_lint.js`, `social_lint.js`, `paid_lint.js`, `page_lint.js`, `brief_lint.js`) reads the File map's list, compiles the same expression and tests copy with it;
- each lint, run on a probe slate with one em dash line and `--pack brand-pack`, fails with a prohibited-territory error whose quoted hit is the em dash, and the same slate with a comma in its place draws no prohibited-territory error (the control: three lints write an em dash into their own error text, so a hit is read from the quote, never from the output at large). `page_lint.js` refuses every page while `section_library` is null, so nothing passes it at all (a note, not a failure); run against the planned `section-library.json` with `--sections`, which wires nothing, it fails the em dash line too.

Tested by mutation: with the probe line changed to one without an em dash ("A quiet line that cures"), the block prints six failures and exits 1.

What R7 does not cover. It proves the list blocks an em dash in the copy fields each lint grades: email gate options, social covers and frames, paid primary text, headline, description and on-image lines, page slots and brief strings. Round 1's reviewer found fields the lints do not grade (a paid concept's `why`, `cuts[].cut` in copy, paid and social slates), and `fit_check.js` and the asset-production scripts never read the list, while asset-production can write short copy of its own. There the guard is REVIEW.md rule 7 (a slot fills only from linted copy) and the em dash grep over Figma output (REVIEW.md, house rules). Engine gap, owner lane H: a release that lints rationale fields and asset-production's own copy against `prohibited_patterns`.

Output, 2026-10-21 (round 2):

```
PASS the fragment (backslash, u2014) is in prohibited_patterns, as text
PASS brand-context.md carries no em dash character
PASS compiled as the lints compile it, its match on a line with U+2014 is the em dash itself
PASS it does not match the footer disclaimer (HLR-REQ-01)
PASS it does not match the same line with a comma
PASS copy: reads the File map, compiles the same expression and tests copy with it
PASS social: reads the File map, compiles the same expression and tests copy with it
PASS paid: reads the File map, compiles the same expression and tests copy with it
PASS page: reads the File map, compiles the same expression and tests copy with it
PASS brief: reads the File map, compiles the same expression and tests copy with it
PASS copy end to end: exit 1, prohibited territory quoting the em dash; the comma control draws none
PASS social end to end: exit 1, prohibited territory quoting the em dash; the comma control draws none
PASS paid end to end: exit 1, prohibited territory quoting the em dash; the comma control draws none
NOTE page end to end: exit 2, refused before grading (nothing passes): page_lint: the section library at .../skills/web-copy/references/section-data.
PASS page_held end to end: exit 1, prohibited territory quoting the em dash; the comma control draws none
PASS brief end to end: exit 1, prohibited territory quoting the em dash; the comma control draws none
R7: guard holds
```

## 4. Guard R14: every required role and artifact has an owner or a plan step

REVIEW.md section 6, R14: a required file or board with no owning step (`slotmap.yaml` before Chat 6 owned it; the strictness map). The check reads the pack contract's role tables from the engine, `brand-context.md` (its File map and its "Gaps and owners" table), `PROGRESSION.md`, `figma.yaml`'s boards, the question lists that put gaps to HLR (Brand Review v2 section 6 and the token proposal's HLR list) and the pack's own gap registers. `_setup/next-chat-prompts.md` is read when present: it is git-ignored, so the check runs without it in a clone. It fails on:

- a contract role the File map does not name, and a role wired to a path that does not exist;
- a null role with no gap row, a malformed gap row and a repeated one;
- a gap row whose owner is not on the allowed-owner list: exactly Eddie, Donnie (since 2026-10-23, Chat 6b), HLR, lane A to lane H, Chat 5, Chat 6 or Chat 7 (round 3; "Eddie or HLR", "Eddie (later)" and "to be assigned" all fail);
- a quoted step under four words, or one not in an open line of `PROGRESSION.md`: an unticked box for a lane or chat (which may quote its own section of the chat prompts instead, with a warning), an unticked box or a Reviews line for Eddie, Donnie or HLR; and a lane or chat owner with no step;
- an HLR-owned row that cites no Brand Review v2 or token proposal question, or one the list does not hold;
- a board in `figma.yaml`, inline or block layout, that is neither recorded as built ("built <date>" in its note) nor named by a gap row (round 3);
- an open row of `token-model.md`'s gap register, a gap in `products.json` `_meta`, (the claims ledger's topics went with it in engine 0.6.0) whose owner does not start with an owner from the list (a qualifier after a comma, a bracket or "'s" is allowed: "HLR (export)", "HLR's claims signer").

It warns when a lane's or chat's step and prompt do not name the role it owns, and when a cited question shares no word with its row. Tested by mutation on a copy of the pack, each caught with its own line: a ticked line as a step; a one-word step; an HLR row no list asks; an HLR row citing a question that is not there; a dropped role; a null role with no row; a role wired to a missing file; a chat owner with no step; round 2's owner "Eddie, to be assigned"; a repeated row; a row with a cell missing; a chat anchored to a Reviews line; a board renamed out of its row; and, as a warning, an HLR row citing an unrelated question. Without the chat prompts file it prints the same two failures and one more warning.

Output, 2026-10-21 (round 3):

```
R14: 44 contract roles, 44 File map keys, 41 gap rows
FAIL `strictness_map`: no owner (Eddie to assign; default Chat 5 (Gate 2 package call 7))
FAIL token-model.md gap K3 (Strictness map): no owner (Eddie to assign)
WARN `voice_model`: Chat 7's step and prompt do not name it
WARN `judge_rubric`: Chat 7's step and prompt do not name it
WARN `judge_calibration`: Chat 7's step and prompt do not name it
WARN `module_library`: Chat 6's step and prompt do not name it
WARN `seam_map`: Chat 6's step and prompt do not name it
WARN `options_register`: Chat 7's step and prompt do not name it
WARN `slotmap_web`: Chat 6's step and prompt do not name it
R14: 2 failure(s), 7 warning(s)
```

The two failures are one gap, the strictness map's owner, which DECISIONS 2026-10-18 leaves to Eddie: package call 7. The warnings are package call 16.

## 5. Tag scan: provenance on every rule in `brand-context.md`

REVIEW.md rule 4 asks every brand rule in `brand-context.md` to carry [documented], [observed] or [derived]. Rules without a tag were found twice (lane E's review: round 1 B2, the Claims regime; round 2 B3, the Design system and the brand name line), so REVIEW.md section 5 step 5 asks for a guard in this release. The scan reads every line from the title to "Gaps and owners", the opening paragraphs and lead-in lines that end in a colon included (round 3; headings and table headers aside), and fails on a line with no tag. A line passes on one tag, so it proves no line is wholly untagged, not that every clause is; a reviewer still reads the clauses. REVIEW.md section 6, row R18 (package call 16 a).

Tested by mutation: a bullet with its tag removed, and a contradiction row without its source tag: both caught, exit 1. Round 3 adds an untagged opening paragraph and an untagged line ending in a colon (section 7).

The pointer check (round 3) reads every `[documented, DECISIONS <date> ...]` tag and every "(ratified <date> by Eddie, <call>)" or "(ratified <date> by Donnie, <call>)" note in `brand-pack/` against `DECISIONS.md` (Donnie's notes since Chat 6b, 2026-10-23, BR2-03): each cited date has a section, the section holds a ruling of the person the note names (Eddie's or Donnie's for a tag; a lane default waiting on either does not count), and a named call ("lane C call 7 a", "Gate 2 package call 13", "Q10") is named by one of his rulings that day, or by the line right after one that names its family. A tag that cites no call must quote words one of his rulings carries.

Output, 2026-10-21 (round 3):

```
tag scan: 71 rule lines in brand-context.md's narrative, 0 without a tag
```

## 6. Commands

Set these at the top of every call (REVIEW.md section 2); each call is a fresh shell:

```
HB=~/mnt/claude-cowork/highlight-brandbook
RC=~/mnt/claude-cowork/_tools/release-checks
ENG=~/rc/engine   # rm -rf ~/rc/engine && mkdir -p ~/rc && unzip -q $HB/outputs/step-3-bundle/hlr-studio-engine-0.5.3.plugin -d ~/rc/engine
```

Preflight, tokens and lookups:

```
python3 $ENG/skills/email-copy/scripts/preflight.py --pack $HB/brand-pack
python3 $ENG/skills/email-copy/scripts/preflight.py --brand hlr --json
node $ENG/skills/design-system/scripts/tokens_build.js check --pack $HB/brand-pack
mkdir -p ~/rc/scratch && node $ENG/skills/design-system/scripts/tokens_build.js export --pack $HB/brand-pack --out ~/rc/scratch/exp
node $ENG/skills/email-copy/scripts/sku_lookup.js --pack $HB/brand-pack --match "the-genesis-memorial-talisman"
node $ENG/skills/email-copy/scripts/exemplar_pick.js --pack $HB/brand-pack --channel email --coverage
```

The provenance scan is REVIEW.md rule 4's block, unchanged.

Guard R7 (exit 0 when it holds):

```
node - "$HB" "$ENG" <<'EOF'
// R7 guard: the em dash fragment in HLR's prohibited_patterns, and every lint blocks it.
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const [HB, ENG] = process.argv.slice(2), PACK = path.join(HB, 'brand-pack');
const raw = fs.readFileSync(path.join(PACK, 'brand-context.md'), 'utf8');
const fm = JSON.parse(raw.match(/```json\s*([\s\S]*?)```/)[1]);
const BS = String.fromCharCode(92), EM = String.fromCharCode(0x2014), FRAG = BS + 'u2014';
let fail = 0; const say = (ok, m) => { if (!ok) fail++; console.log((ok ? 'PASS ' : 'FAIL ') + m); };
say(fm.prohibited_patterns.includes(FRAG), 'the fragment (backslash, u2014) is in prohibited_patterns, as text');
say(!raw.includes(EM), 'brand-context.md carries no em dash character');
const RE = new RegExp('(' + fm.prohibited_patterns.join('|') + ')', 'i');
const db = JSON.parse(fs.readFileSync(path.join(PACK, fm.product_db), 'utf8'));
const disc = db._meta.brand_facts.facts.find(e => e.id === 'site_footer_text').fact;   // 0.6.0: the footer text lives in products.json, not a ledger
const LINE = 'A quiet line' + EM + 'with a dash';
say((LINE.match(RE) || [])[0] === EM, 'compiled as the lints compile it, its match on a line with U+2014 is the em dash itself');
say(!RE.test(disc), 'it does not match the footer disclaimer (products.json _meta.brand_facts site_footer_text)');
say(!RE.test('A quiet line, with a comma'), 'it does not match the same line with a comma');
// 0.6.0: the social and web copy lints left the bundle (DECISIONS 2026-10-31); the three that remain are probed.
const LINTS = { copy: 'email-copy/scripts/copy_lint.js', paid: 'paid-ad-copy/scripts/paid_lint.js', brief: 'brief-intake/scripts/brief_lint.js' };
const COMPILE = "new RegExp('(' + prohibitedPatterns.join('|') + ')', 'i')";
for (const [k, rel] of Object.entries(LINTS)) {
  const src = fs.readFileSync(path.join(ENG, 'skills', rel), 'utf8');
  say(src.includes(COMPILE) && /PROHIBITED\.test\(/.test(src) && src.includes('fileMap.prohibited_patterns'), k + ': reads the File map, compiles the same expression and tests copy with it');
}
const reg = JSON.parse(fs.readFileSync(path.join(PACK, fm.type_registry_core), 'utf8')), etype = Object.keys(reg.types)[0];
const opt = c => ({ copy: c, axis: 'Benefit', score: 15, why: 'probe' });
const slates = {
  copy: ['--slate', { skill: 'email-copy', format: 2, type: etype, brief: { name: 'R7 probe', type: etype, objective: 'probe', audience: 'probe' }, provenance: { generated_at: '2026-10-20', facts: [], guardrails: ['R7 probe'] }, gates: { hero: [opt(LINE)] }, modules: {}, routes: [] }],
  paid: ['--slate', { skill: 'paid-ad-copy', format: 1, type: 'problem_solution', brief: { name: 'R7 probe', objective: 'probe', audience: 'probe' }, provenance: { generated_at: '2026-10-20' }, ratios: ['4x5'], gates: { copy: [{ axis: 'Problem', primary_text: LINE, headline: 'Probe headline', description: 'Probe', on_image: LINE }] } }],
  brief: ['--brief', { skill: 'brief-intake', format: 1, slug: 'r7-probe', brand: 'High Light Rituals', objective: 'probe', audience: 'probe', message: LINE, products: [], channels: [], must_say: [], never_say: { brief: [], pack: fm.prohibited_patterns, union: fm.prohibited_patterns }, gaps: [], provenance: { brand: 'High Light Rituals' } }],
};
const COMMA = 'A quiet line, with a comma', hitsOf = out => [...out.split(String.fromCharCode(92) + '"').join('"').matchAll(/prohibited territory[^"\n]*"([^"\n]*)"/g)].map(x => x[1]);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-'));
for (const [k, [flag, doc0, extra]] of Object.entries(slates)) {
  const doc = doc0, lint = LINTS[k];
  const p = path.join(tmp, k + '.json'); fs.writeFileSync(p, JSON.stringify(doc));
  const r = cp.spawnSync('node', [path.join(ENG, 'skills', lint), flag, p, '--pack', PACK, ...(extra || [])], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || ''), hit = hitsOf(out).includes(EM);
  const pc = path.join(tmp, k + '.comma.json'); fs.writeFileSync(pc, JSON.stringify(doc).split(LINE).join(COMMA));
  const rc = cp.spawnSync('node', [path.join(ENG, 'skills', lint), flag, pc, '--pack', PACK, ...(extra || [])], { encoding: 'utf8' });
  const ctl = hitsOf((rc.stdout || '') + (rc.stderr || ''));
  if (ctl.length) { fail++; console.log('FAIL ' + k + ' control: the same probe with a comma still draws prohibited territory: ' + ctl.join(', ')); }
  const refused = !hit && r.status === 2 && /Nothing was checked|could not start/.test(out);
  console.log((hit ? 'PASS ' : refused ? 'NOTE ' : 'FAIL ') + k + ' end to end: exit ' + r.status + (hit ? ', prohibited territory quoting the em dash; the comma control draws none' : refused ? ', refused before grading (nothing passes): ' + (out.match(/page_lint: [^.]*\./) || out.match(/[a-z_]+: [^\n]{0,120}/) || [''])[0] : ', no prohibited finding'));
  if (!hit && !refused) fail++;
}
console.log(fail ? 'R7: ' + fail + ' failure(s)' : 'R7: guard holds'); process.exit(fail ? 1 : 0);
EOF
```

Guard R14 (exit 0 when it holds):

```
python3 - "$HB" "$ENG" <<'EOF'
# R14 guard: every required role and artifact has an owner from the allowed-owner list and, for a lane or chat, an open PROGRESSION step.
import json, os, re, sys
HB, ENG = sys.argv[1], sys.argv[2]
PACK = os.path.join(HB, "brand-pack")
rd = lambda *p: open(os.path.join(*p), encoding="utf-8").read()
bc = rd(PACK, "brand-context.md")
fm = json.loads(re.search(r"```json\s*([\s\S]*?)```", bc).group(1))
sec = rd(ENG, "references", "pack-contract.md").split("## Roles", 1)[1].split("## Provenance and cost", 1)[0]
roles = list(dict.fromkeys(re.findall(r"^\|\s*`([a-z_]+)`\s*\|", sec, re.M)))
plan = rd(HB, "PROGRESSION.md").splitlines()
boxes = [l for l in plan if l.startswith("- [ ]")]
reviews = [l for l in plan if l.startswith("- Review ")]
pp = os.path.join(HB, "_setup", "next-chat-prompts.md")
prompts = rd(pp) if os.path.exists(pp) else None
def prompt_of(owner):  # the owner's own section of the chat prompts, when the file is here
    if prompts is None: return ""
    w = owner.split()
    m = re.search(r"^#{2,3} " + re.escape(w[0].capitalize() + " " + w[1]) + r"\b.*?(?=^#{2,3} |\Z)", prompts, re.M | re.S)
    return m.group(0) if m else ""
fails, warns = [], []
ALLOWED = ["Eddie", "Donnie", "HLR", "Chat 5", "Chat 6", "Chat 7"] + ["lane " + c for c in "ABCDEFGH"]  # the allowed-owner list; Donnie since 2026-10-23 (Chat 6b)
LEAD = re.compile(r"^(" + "|".join(map(re.escape, ALLOWED)) + r")($|, |\s\(|'s )")  # an allowed owner, then nothing or a qualifier
UNOWNED = re.compile(r"\b(to (be )?assign(ed)?|unassigned|tbd|tba)\b|^none$|^$", re.I)
TEAM = re.compile(r"^(lane [A-H]|Chat [5-7])\b")
ASKED = re.compile(r"Brand Review v2 Q(\d+)|token proposal HLR (\d+)")
br6 = rd(HB, "outputs", "step-1-review", "brand-review-v2.md").split("## 6.", 1)[1].split("\n## ", 1)[0]
tph = rd(HB, "outputs", "step-2-pack", "token-proposal.md").split("HLR, at Review 1", 1)[1].split("\n## ", 1)[0]
def question(q, t):
    m = re.search(rf"^{q or t}\. .*$", br6 if q else tph, re.M)
    return m.group(0) if m else None
words = lambda x: {w for w in re.findall(r"[a-z]{4,}", x.lower())} - {"with", "that", "from", "this", "until", "null", "role", "artifact", "asked", "brand", "review", "proposal", "token"}
for r in roles:
    if r not in fm: fails.append(f"role `{r}` is not named in the File map")
for k in fm:
    if k not in roles: warns.append(f"File map key `{k}` is not a pack-contract role")
gsec = bc.split("## Gaps and owners", 1)[1].split("\n## ", 1)[0]
byitem = {}
for l in gsec.splitlines():
    if not l.startswith("|") or l.startswith("| Item") or re.match(r"^\|[-| ]+\|$", l): continue
    row = [c.strip() for c in l.strip().strip("|").split("|")]
    if len(row) != 6: fails.append(f"malformed gap row ({len(row)} cells): {l[:70]}"); continue
    if row[0] in byitem: fails.append(f"{row[0]}: two gap rows"); continue
    byitem[row[0]] = row
for k, v in fm.items():
    if isinstance(v, str) and k not in ("brand", "brand_slug", "folder") and not os.path.exists(v if os.path.isabs(v) else os.path.join(PACK, v)):
        fails.append(f"`{k}` names {v}, which does not exist (wired and broken)")
    if v is None and f"`{k}`" not in byitem:
        fails.append(f"`{k}` is null with no row in Gaps and owners")
for item, (_, kind, state, owner, step, _b) in byitem.items():
    if owner not in ALLOWED:
        fails.append(f"{item}: owner {owner or 'empty'!r} is not on the allowed-owner list"); continue
    team = bool(TEAM.match(owner)); anchors = re.findall(r"`([^`]+)`", step); good = []
    if step.lower() != "none" and not anchors:
        fails.append(f"{item}: Step is neither none nor quoted plan text ({step})")
    for a in anchors:
        if len(a.split()) < 4: fails.append(f"{item}: step `{a}` is under four words"); continue
        if any(a in l for l in boxes) or (not team and any(a in l for l in reviews)): good.append(a)
        elif team and a in prompt_of(owner):
            good.append(a); warns.append(f"{item}: step `{a}` is only in the git-ignored chat prompts")
        else: fails.append(f"{item}: step `{a}` is not in an open line of PROGRESSION.md" + (" (a lane or chat needs an unticked box)" if team else ""))
    if team:
        if not good: fails.append(f"{item}: {owner} owns it, but no open plan step carries it")
        elif kind == "role":
            name = item.strip("`"); terms = [name, name.replace("_", " "), name.replace("_", "-")]
            ctx = (" ".join(l for a in good for l in boxes if a in l) + " " + prompt_of(owner)).lower()
            if not any(t in ctx for t in terms): warns.append(f"{item}: {owner}'s step and prompt do not name it")
    if owner.startswith("HLR"):
        refs = ASKED.findall(state + " " + step)
        if not refs: fails.append(f"{item}: HLR owns it, but no Brand Review v2 or token proposal question asks HLR")
        for q, t in refs:
            text = question(q, t)
            if not text: fails.append(f"{item}: the list it cites does not hold that question ({'Q' + q if q else 'HLR ' + t})")
            elif not (words(item + " " + state) & words(text)): warns.append(f"{item}: the cited question ({'Q' + q if q else 'HLR ' + t}) shares no word with the row")
norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
fy = rd(PACK, "figma.yaml"); boards = []  # (board, the note that applies to it); inline {..} or block layout
m = re.search(r"^\s*boards:\s*\{(.*)\}(.*)$", fy, re.M)
if m:
    boards = [(b, m.group(2)) for b in re.findall(r"\"?([A-Za-z][A-Za-z -]*?)\"?\s*:\s*\"?[0-9]+:[0-9]+", m.group(1))]
elif re.search(r"^\s*boards:", fy, re.M):
    m = re.search(r"^([ \t]*)boards:[ \t]*(#.*)?$", fy, re.M)
    for l in (fy[m.end():].split("\n")[1:] if m else []):
        if not l.strip() or l.lstrip().startswith("#"): continue
        if len(l) - len(l.lstrip()) <= len(m.group(1)): break
        b = re.match(r"^\s+\"?([A-Za-z][A-Za-z -]*?)\"?\s*:\s*\"?[0-9]+:[0-9]+\"?\s*(#.*)?$", l)
        if b: boards.append((b.group(1), (b.group(2) or "") + " " + (m.group(2) or "")))
        else: fails.append(f"figma.yaml boards: a line the check cannot read: {l.strip()[:60]}")
    if not boards: fails.append("figma.yaml has a boards key the check cannot read")
BUILT = re.compile(r"\bbuilt \d{4}-\d{2}-\d{2}\b")
for b, note in boards:
    if not BUILT.search(note) and not any(norm(b) in norm(i) for i in byitem): fails.append(f"figma.yaml board {b} is not recorded as built and has no gap row")
tm = rd(PACK, "token-model.md").split("## 5. Gap register", 1)[1].split("\n## ", 1)[0]
for l in tm.splitlines():
    c = [x.strip() for x in l.strip().strip("|").split("|")]
    if l.startswith("| ") and len(c) >= 6 and c[0] != "#" and c[4].lower() != "none" and (not LEAD.match(c[4]) or UNOWNED.search(c[4])):
        fails.append(f"token-model.md gap {c[0]} ({c[1]}): owner {c[4] or 'empty'!r} is not on the allowed-owner list")
for g in json.loads(rd(PACK, fm["product_db"]))["_meta"].get("gaps", []):
    o = str(g.get("owner", "")).strip()
    if not LEAD.match(o) or UNOWNED.search(o): fails.append(f"products.json gap, owner {o or 'empty'!r} is not on the allowed-owner list: {g.get('gap', '')[:60]}")
# 0.6.0: no claims ledger role (DECISIONS 2026-10-31); its topics and owners are gone with it.
print(f"R14: {len(roles)} contract roles, {len(fm)} File map keys, {len(byitem)} gap rows" + ("" if prompts is not None else "; no chat prompts file here, so steps are read from PROGRESSION.md alone"))
for f in fails: print("FAIL", f)
for w in warns: print("WARN", w)
print("R14: " + (f"{len(fails)} failure(s), {len(warns)} warning(s)" if fails else f"holds, {len(warns)} warning(s)"))
sys.exit(1 if fails else 0)
EOF
```

Tag scan (exit 0 when it holds):

```
python3 - "$HB" <<'EOF'
# Tag scan: every line of brand-context.md above Gaps and owners carries a provenance tag (round 1 B2, round 2 B3, round 3: every line).
import os, re, sys
HB = sys.argv[1]
bc = open(os.path.join(HB, "brand-pack", "brand-context.md"), encoding="utf-8").read().split("\n")
TAG, SEP = re.compile(r"\[(documented|observed|derived)\b"), re.compile(r"^\|[-| ]+\|$")
start = 0  # every line from the title down: opening paragraphs included
stop = next(i for i, l in enumerate(bc) if l.startswith("## Gaps and owners"))
bad, n, fence = [], 0, False
for i in range(start, stop):
    l = bc[i].rstrip()
    if l.startswith("```"): fence = not fence; continue
    if fence or not l.strip() or l.startswith("#") or SEP.match(l): continue  # a line ending in a colon is a rule line too
    if l.startswith("|") and i + 1 < stop and SEP.match(bc[i + 1]): continue
    n += 1
    if not TAG.search(l): bad.append((i + 1, l[:110]))
print(f"tag scan: {n} lines in brand-context.md above Gaps and owners, {len(bad)} without a tag")
for ln, t in bad: print(f"FAIL line {ln}: {t}")
sys.exit(1 if bad else 0)
EOF
```

Pointer check (exit 0 when it holds):

```
python3 - "$HB" <<'EOF'
# Pointer check: a "[documented, DECISIONS <date> ...]" tag or a "(ratified <date> by Eddie|Donnie, <call>)" note points at a ruling in DECISIONS.md
# by the person it names, not a lane default (round 3; Donnie's notes since Chat 6b, 2026-10-23, BR2-03). A tag may point at either's ruling.
import os, re, sys
HB = sys.argv[1]
PACK = os.path.join(HB, "brand-pack")
dec = open(os.path.join(HB, "DECISIONS.md"), encoding="utf-8").read()
SECT = {}
for part in re.split(r"^## ", dec, flags=re.M)[1:]:
    head, _, body = part.partition("\n")
    d = re.match(r"\d{4}-\d{2}-\d{2}", head.strip())
    if d: SECT.setdefault(d.group(0), []).extend(l for l in body.splitlines() if l.startswith("- "))
RULING_RE = {"Eddie": re.compile(r"\(Eddie\b|, Eddie\)|\bEddie (ruled|took|approved|ratified|installed|assigns|asked|answered|supplied|picked|owns)\b|\bEddie's (pick|picks|ruling|rulings|answer|answers|go|scope|default|word)\b|\bby Eddie\b|Reason: Eddie\b"),
             "Donnie": re.compile(r"\(Donnie\b|, Donnie\)|\bDonnie (ruled|took|approved|ratified|answered|picked|chose|confirmed)\b|\bDonnie's (pick|picks|ruling|rulings|answer|answers|word)\b|\bby Donnie\b|Reason: Donnie\b")}
DEFAULT = re.compile(r"\b(until|unless|pending|before|waits? on|goes to|go to|to|for) (Eddie|Donnie)\b[^.;]*")  # a lane default waiting on either, not a ruling
class Ruling:
    def __init__(self, who): self.who = who
    def search(self, l):
        l = DEFAULT.sub("", l)
        return any(RULING_RE[w].search(l) for w in self.who)
DATE = re.compile(r"\d{4}-\d{2}-\d{2}")
CALL = re.compile(r"\b(calls?|question|questions)\s+(\d+(?:\s+[a-c]\b)?(?:(?:,\s*|\s+and\s+)\d+(?:\s+[a-c]\b)?)*)")
TAGS = [re.compile(r"\[documented, DECISIONS ([^\]]*)\]"), re.compile(r"\(ratified (\d{4}-\d{2}-\d{2}) by (Eddie|Donnie), ([^)]*)\)")]
fails, seen, n = [], set(), 0
def family(ref):  # the words naming whose call it is: "lane C", "Gate 2 package", "Gate 2", "Gate 1"
    m = re.search(r"\b(Gate \d(?: package)?|lane [A-H])", ref)
    return m.group(1) if m else None
def items(ref):
    out = []
    for m in CALL.finditer(ref):
        for it in re.findall(r"\d+(?:\s+[a-c]\b)?", m.group(2)): out.append(re.sub(r"\s+", " ", it))
    out += re.findall(r"\bQ\d+\b", ref)
    return out
def check(where, dates, ref, who=("Eddie", "Donnie")):
    global n
    n += 1
    RULING = Ruling(who); whose = " or ".join(w + "'s" for w in who)
    for d in dates:
        if d not in SECT: fails.append(f"{where}: cites DECISIONS {d}, which has no section"); return
    lines = [(d, i, l) for d in dates for i, l in enumerate(SECT[d])]
    eddie = [(d, i, l) for d, i, l in lines if RULING.search(l)]
    if not eddie: fails.append(f"{where}: DECISIONS {', '.join(dates)} holds no ruling of {whose}"); return
    ref = re.sub(r"^((Eddie|Donnie)'s (ruling|answer to)|approved by (Eddie|Donnie)|ratified by (Eddie|Donnie))[, ]*", "", ref.strip(" ,:;"))
    its, fam = items(ref), family(ref)
    if not ref: return
    if not its and not fam:
        if not any(ref.split(";")[0].strip() in l for _, _, l in eddie): fails.append(f"{where}: names no call, and no ruling of {whose} on {', '.join(dates)} carries \"{ref.split(';')[0].strip()[:60]}\"")
        return
    for it in (its or [None]):
        def has(l): return it is None or (it in l if it.startswith("Q") else re.search(r"\b" + re.escape(it) + r"\b", l))
        ok = False
        for d, i, l in eddie:
            if not has(l): continue
            prev = SECT[d][i - 1] if i > 0 else ""
            if fam is None or fam in l or (fam in prev and RULING.search(prev)): ok = True; break
        if not ok: fails.append(f"{where}: no ruling of {whose} on {', '.join(dates)} names {fam + ' ' if fam else ''}{'call ' + it if it and not it.startswith('Q') else it or ''}".rstrip())
for root, _, files in os.walk(PACK):
    for f in sorted(files):
        p = os.path.join(root, f)
        try: t = open(p, encoding="utf-8").read()
        except Exception: continue
        for ln, line in enumerate(t.splitlines(), 1):
            for m in TAGS[0].finditer(line):
                body = m.group(1)
                if "<date>" in body: continue
                dates = DATE.findall(body.split(",")[0] + " " + body.split(":")[0]) or DATE.findall(body)
                rest = body[DATE.search(body).end():] if DATE.search(body) else body
                rest = re.sub(r"^\s*and \d{4}-\d{2}-\d{2}", "", rest)
                key = (os.path.relpath(p, PACK), tuple(dates), rest)
                if key in seen: continue
                seen.add(key); check(f"{os.path.relpath(p, PACK)}:{ln}", sorted(set(dates)), rest)
            for m in TAGS[1].finditer(line):
                key = (os.path.relpath(p, PACK), m.group(1), m.group(2), m.group(3))
                if key in seen: continue
                seen.add(key); check(f"{os.path.relpath(p, PACK)}:{ln}", [m.group(1)], m.group(3), (m.group(2),))
print(f"pointer check: {n} distinct tags and ratification notes read against DECISIONS.md, {len(fails)} failure(s)")
for x in fails: print("FAIL", x)
sys.exit(1 if fails else 0)
EOF
```

Mutation tests of the R14, tag scan and pointer guards (exit 0 when every mutant fails its guard and the pack itself passes; the harness reads the three guards from this section):

```
python3 $HB/outputs/step-2-pack/guards/mutation_tests.py "$HB" "$ENG"
```

Census of the pack, then the figma-key-shaped hits read against HLR's four files (REVIEW.md rule 9 passes only when every hit is one of them):

```
mkdir -p ~/rc && cd ~/rc && LAST=$RC/0.5.2/terms.txt
python3 $RC/build_terms.py ~/rc/terms.txt && comm -13 <(sort $LAST) <(sort ~/rc/terms.txt)
python3 $RC/census.py ~/rc/terms.txt $HB/brand-pack
python3 - $HB/brand-pack <<'EOF'
import re, os, sys, collections
HLR = {"Gq3yUbLs6MCRM0nOhjvnIW": "HLR Library", "LYyYXPDUHVoAABh865EvMI": "reference copy", "CTaCEg0sZt40DIq1zH6cqi": "HLR-EMAIL", "qpUX1PrWbYUgUMbyHIRmNY": "HLR-Social"}
K = re.compile(r"(?<![A-Za-z0-9])(?=[A-Za-z0-9]*[A-Z])(?=[A-Za-z0-9]*[a-z])(?=[A-Za-z0-9]*\d)[A-Za-z0-9]{22}(?![A-Za-z0-9])")
seen = collections.Counter(); other = []
for root, _, files in os.walk(sys.argv[1]):
    for f in files:
        p = os.path.join(root, f)
        try: t = open(p, encoding="utf-8").read()
        except Exception: continue
        for k in K.findall(t):
            seen[k] += 1
            if k not in HLR: other.append((os.path.relpath(p, sys.argv[1]), k))
print({HLR.get(k, k): n for k, n in seen.items()}); print("not HLR's:", other or "none")
EOF
```

Em dash bytes in lane E's files (prints nothing when clean):

```
grep -l $'\xe2\x80\x94' $HB/brand-pack/brand-context.md $HB/outputs/step-2-pack/preflight.md $HB/outputs/step-2-pack/gate-2-package.md
```

## 7. After Gate 2 and Gate 4 (2026-10-23)

Rerun overnight by Claude (Chat 5, holding lane E's open items under Eddie's defaults, DECISIONS 2026-10-22), on the installed engine 0.5.3, against the pack after Gate 2's calls and Gate 4. The guards are the section 6 versions, with round 3's fixes.

| Check | Result |
|---|---|
| `preflight.py --pack` | exit 0: resolved 7, blocking 0, degraded 8 (`type_registry_overlay`, `seam_map`, `options_register`, `slotmap`, `module_library`, `favorites`, `voice_calibration`, `voice_model`). Chat 6's first masters close `slotmap`, `seam_map` and `module_library` |
| `tokens_build.js check --pack` | exit 0 in every ground (light, warm, deep, night): every declared pair clears its floor; 4 recorded failures keep their restriction (decorative only, or judged on the image) |
| `tokens_build.js export --pack` | exit 0: 89 custom properties under `:root` (`--hlr-`) and a `[data-ground]` block per ground (15 tokens vary by ground); the CSS and Tailwind files carry the `web` canvas, and `tokens.flat.json` keeps all three (10 tokens vary by canvas); the 14 `font.style` tokens are not exported (the web takes `font.weight`); provenance 82 documented, 20 observed, 1 derived (`color.semantic.text.on-placeholder`, Gate 4) |
| R7 guard (section 3) | holds: 15 pass, 1 note (`page_lint.js` refuses every page while web waits for Review 2) |
| R14 guard (section 4, round 3) | holds: 44 contract roles, 44 File map keys, 32 gap rows, 0 warnings. Five rows closed (the variables, the Foundations boards and the marks, built; image usage rights, cleared by Eddie; the REVIEW.md rows, patched under call 16 a) |
| Tag scan (section 5, round 3) | holds: 76 lines above Gaps and owners, each tagged, after two lines took tags (the Pack role line; the lead-in to the house conventions) |
| Pointer check (section 5, round 3) | holds: 53 tags and ratification notes, each pointing at a ruling of Eddie's. The ledger line cited lane C's seed line, not a ruling: retagged to the file itself and to Eddie's answer to lane C calls 4 and 5. The taxonomy tag now names Gate 2 call 1 b, as DECISIONS does |
| Mutation tests (`guards/mutation_tests.py`) | 14 mutants, each caught with its own line, and the pack passes all three guards. On the round 2 guards, "Eddie or HLR", "Eddie (later)" and "HLRx" passed the owner check, and both untagged-line mutants passed the tag scan |
| Census (REVIEW.md rule 9), `brand-pack/` | 0 hits on another brand's term: 327 terms rebuilt, none new against 0.5.3's list. 14 figma-key-shaped hits, all HLR's four files: the reference copy 7, the library 5, HLR-EMAIL 1, HLR-Social 1 |
| Em dash bytes | 0 in `brand-context.md`, this file, the Gate 2 package, `REVIEW.md`, the chat prompts and the records; `products.json` keeps 68 inside verbatim Shopify titles (source data; the house rule applies to what we write) |

Nothing blocks. What still degrades is listed in section 2; each item has an owner in `brand-context.md`'s Gaps and owners.
