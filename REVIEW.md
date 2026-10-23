# HLR review rules

2026-10-18, lane F. Every review of HLR work reads this file, and every open prompt in `_setup/next-chat-prompts.md` (lanes C, D, E and H, Chats 5 to 7) runs a fresh-context review against it. It turns the project instructions, DECISIONS.md and LEARNINGS.md into checks. Where it disagrees with them, they win and this file is wrong, which is itself a finding. Eddie set what this file covers, the finding fields, the flow's limits, the seen-twice rule and the rule below (lane F prompt), and ratified lane F's severity names, HLR tier, tier contents, finding line, never-ships list and the re-read narrowing for record lines and read-only evidence (DECISIONS 2026-10-18). Read the section the review needs: 2 for any work, 3 for an engine release, 4 for who says go, 5 for the flow, 6 before filing a finding.

**A reviewer's PASS is evidence, never a gate.** A PASS reports what one reader found in what it read, so it names what it read. It never stands in for a check, a gate or Eddie's go, and it never closes a finding: a finding closes when the check that caught it is rerun and passes. A check proves only what it measures: 0.5.0 passed the name census with zero hits and still carried another brand's taste (LEARNINGS, engines 0.5.0 and 0.5.1).

## 1. The project

HLR is High Light Rituals, a client. This project builds HLR's design system and its brand forge, which HLR's own team will run (Gate 1 (a)). Phase 1 runs four weeks from Fri 2026-10-16, with three live reviews.

For:
- The design system: `brand-pack/tokens.json` (DTCG, a provenance tag on every token), the Figma library `HLR Library` (`Gq3yUbLs6MCRM0nOhjvnIW`), and `tokens.css` and Tailwind tokens exported from the same file.
- The brand pack, `brand-pack/`: the only source of HLR facts.
- The single-brand bundle `hlr-studio-engine`: the engine, carrying no other brand, with a registry that lists only `hlr` and reads the pack live. Eddie is building the tool and all of this specifically for HLR and its use (DECISIONS 2026-10-18), so an HLR need can change a skill, in a new engine version through section 3 (lane F's reading of that ruling).
- Phase 1's four channels: email, organic social, paid and web.
- The forge proof: one real brief through the engine, graded by Eddie's blind keep or cut sheet.

Not for:
- Other brands. Their names, facts, file keys and taste reach no HLR file, deliverable or bundle (rule 9).
- Deciding HLR's facts. An unknown is null with a named gap and an owner (rule 3); HLR answers its own questions at a live review.
- Writing to the client's work. The client originals (brand book, fonts, marks, imagery, inventory sheet) and the reference copy `LYyYXPDUHVoAABh865EvMI` are read-only. The live files HLR-EMAIL and HLR-Social were read-only until Gate 3 and no write to them has been ruled since, so any write needs Eddie's go.
- Publishing. The forge makes copy and Figma assets; a person sends, posts and publishes, and publishing the library is Eddie's manual step.
- Ratifying. Only Eddie ratifies a derived value (rule 4).

## 2. Standing rules as checks

Rule numbers follow the project instructions, which have no rule 6: Eddie retired the brand-free engine rule because the tool is built for HLR and its use (DECISIONS 2026-10-18; the copy in `_setup/` still carries it).

The author runs these commands in the Mac's Cowork shell and hands the output to the reviewer (section 5, step 1). The brand home is under `~/mnt/claude-cowork` there, and `/Users/eddie` does not exist. Each call is a fresh shell, so set these at the top of every call, and finish inside the call:

```
HB=~/mnt/claude-cowork/highlight-brandbook
RC=~/mnt/claude-cowork/_tools/release-checks
ENG=~/rc/engine   # for each new bundle: rm -rf ~/rc/engine && mkdir -p ~/rc && unzip -q <bundle.plugin> -d ~/rc/engine
```

**1. Opening reads.** Check: the work builds on the record as it stood when its chat opened: its prompt's "Runs only when" line held, it cites the rulings it used, and nothing in it contradicts a DECISIONS line dated before it. Verify: the precondition against PROGRESSION's boxes and their dates; the work against every DECISIONS line dated before it. The author's opening scan, for another live chat on the same step (R1): `cd $HB && git status --short && stat -c '%y %n' *.md && find outputs -type f -mmin -120 | head`.

**2. Sources, never memory.** Check: every HLR fact names its source: a pack file and key, the brand book by PDF page, a site pull by file and date, a Figma file key and node id. Verify: trace every figure, price, claim, quote and product name, and a stated sample of the rest, to a source that says it. No source, or a source that does not say it, is a blocker. Sources are dated, and the 2022 book is evidence, not law (R10).

**3. Loud absence.** Check: an unknown is `null` with a gap line naming what is missing and its owner; unconfirmed prices, dates and addresses are merge tokens (`{{ ... }}`); nothing is invented. Verify: `python3 $ENG/skills/email-copy/scripts/preflight.py --pack $HB/brand-pack`. Until lane E writes `brand-context.md`, exit 2 with the missing-pack message is the expected state (lane E owns it); from lane E's close it exits 0 (1 means something required is unresolved). Every `null` has its gap and owner; quotes pass `python3 $ENG/skills/customer-evidence/scripts/verify_quotes.py CORPUS ANALYSIS --exclusions lint.json`; figures and claims trace to the product database and the claims ledger.

**4. Provenance.** Check: every token and brand rule carries `[documented]`, `[observed]` or `[derived]`; a derived value is never presented as law; a ratified one has Eddie's dated DECISIONS line. Verify: the scan below prints 0 without a tag; its first-tag counts match the counts DECISIONS recorded for the file; its list of derived values not yet ruled matches the Gate 2 package or the token proposal, and a ratified one flips its leading tag to `[documented]` and carries "(ratified <date> by Eddie, <call>)" (Gate 2 package call 4, DECISIONS 2026-10-22), backed by a dated DECISIONS line that the pointer check in `outputs/step-2-pack/preflight.md` reads; each token with two tags is read. A tag may carry a note after a comma (`[observed, the live site's button outline]`); the scan reads the first word. Every Figma variable description carries its tag (read-only); the rules in `brand-context.md`, the voice contract, `art-direction.md` and the contrast law carry theirs. `node $ENG/skills/design-system/scripts/tokens_build.js check --pack $HB/brand-pack` exits 0 (before lane E's close, `--tokens $HB/brand-pack/tokens.json`); a file with no contrast pairs is not a pass.

```
python3 - $HB/brand-pack/tokens.json <<'EOF'
import json, re, sys, collections
d = json.load(open(sys.argv[1])); first = collections.Counter(); bad = []; der = []; ruled = []; mixed = []
def walk(o, p):
    if isinstance(o, dict):
        if "$value" in o:
            s = json.dumps({k: v for k, v in o.items() if k != "$value"})
            t = re.findall(r"\[(documented|observed|derived)(,[^\]]*)?\]", s) + [(x, "") for x in re.findall(r'"provenance": "(documented|observed|derived)"', s)]
            if not t: bad.append(p)
            else:
                first[t[0][0]] += 1
                kinds = {k for k, _ in t}
                if "derived" in kinds:
                    if any(k == "derived" and "ruled" in r for k, r in t): ruled.append(p)
                    else: der.append(p)
                if len(kinds) > 1: mixed.append((p, sorted(kinds)))
        for k, v in o.items():
            if not k.startswith("$"): walk(v, p + "." + k if p else k)
walk(d, "")
print(sum(first.values()) + len(bad), "tokens, by first tag", dict(first), "|", len(bad), "without a tag:", *bad)
print(len(mixed), "with two tags, read each:", *mixed)
print(len(ruled), "derived and ruled:", *ruled)
print(len(der), "with a derived part not yet ruled, for Gate 2, one per line:"); print(*der, sep="\n")
EOF
```

**5. Figma writes and gates.** Check: no Figma write without the ruled conventions (Gate 3, `outputs/step-4-figma/gate-3-conventions.md`) and its step's gate checked in PROGRESSION; one chat writes Figma at a time; lanes read only. A gate opens only on Eddie's explicit go, recorded in DECISIONS. Verify, read-only: a `use_figma` script that only reads (`figma.root.children`, `figma.variables.getLocalVariableCollectionsAsync()`, `figma.variables.getLocalVariablesAsync()`, `figma.getLocalTextStylesAsync()`, `getLocalPaintStylesAsync()`, `getLocalEffectStylesAsync()`, `getLocalGridStylesAsync()`, and components after `figma.loadAllPagesAsync()`) and returns names and ids under the 20 KB result cap (R9); compare them with `brand-pack/figma.yaml` both ways. Anything in the file and not in `figma.yaml` is an unrecorded write; anything in `figma.yaml` and not in the file is an unrecorded delete. The author's close status lists its write calls and their dates; when a write's date matters and the record cannot settle it, Eddie reads the file's version history in the app (no connector reads it).

**7. Copy before design.** Check: a slot fills only from copy that passed its lint; masters carry labelled placeholders, never invented copy. Verify: each built asset names its copy file, whose lint verdict (`copy_lint.js`, `social_lint.js`, `paid_lint.js` or `page_lint.js`) predates the build.

**8. Licenses and usage rights.** Check: each face carries the state Brand Review v2 section 3 gives it (unconfirmed, web only, confirm per face if kept, cleared), and a face not cleared for the use in hand carries the license flag on every deliverable; an image without a confirmed usage right is a labelled grey placeholder listed as a gap; nothing is generated in place of a real shot (no ruling for HLR yet, so tier 2). Verify: list every family in the work (Figma text styles and variables, the build stand-ins, CSS `font-family`) and check each against its own state in section 3, then the pack; trace every image fill to its rights record or its placeholder label.

**9. HLR stays in, other brands stay out.** Check: HLR files and outputs stay under `highlight-brandbook/`; no other brand's name, fact, file key or taste in an HLR file, deliverable or bundle; the release-check tools and their output stay in `_tools/`; `_setup/` stays git-ignored. Verify: census the brand home's tracked and untracked, not ignored, files with a term list rebuilt in the same call, since brand folders change. The `comm` line prints the terms that are new against the last release's saved list (`LAST`: `$RC/terms.txt` for 0.5.1, `$RC/<version>/terms.txt` after); read each. A new term that is not a brand's is a `build_terms.py` finding: on 2026-10-18 four junk terms (`com` from `extensions_namespace:` lines, three `{font.family.*}` alias values) hit HLR's files 269 times, and the tool was fixed the same day with `test_build_terms.py`; the rebuilt list matches 0.5.1's 327 terms again (DECISIONS 2026-10-18). Pass: every hit is `figma-key-shaped` and one of HLR's four files (the library, the reference copy, HLR-EMAIL `CTaCEg0sZt40DIq1zH6cqi`, HLR-Social `qpUX1PrWbYUgUMbyHIRmNY`), and the ignored list holds `_setup/` and nothing beyond the client originals (the brand book PDF, `HLR Content/`, `HLR Logo & Marks/`, `High Light Rituals Fonts/`, and the inventory sheet `HLR Creative AI System.xlsx`) and `.DS_Store` files. For one deliverable, census its folder; for taste in copy, zip the folder and run both overlap scans on the zip (section 3, checks 3 and 4).

```
mkdir -p ~/rc && cd ~/rc && rm -rf home && mkdir home
LAST=$RC/terms.txt
python3 $RC/build_terms.py ~/rc/terms.txt && comm -13 <(sort $LAST) <(sort ~/rc/terms.txt)
(cd $HB && git ls-files -co --exclude-standard -z | grep -zv '\.plugin$' | xargs -0 cp --parents -t ~/rc/home)
python3 $RC/census.py ~/rc/terms.txt ~/rc/home
(cd $HB && git ls-files -oi --exclude-standard --directory)
```

**10. The record.** Check: every decision is a dated DECISIONS.md line with its reason and what it replaced; the chat ends with one dated LEARNINGS.md entry (a lane's headed "<date>: lane <X>, <title>"), `figma.yaml` current, `slotmap.yaml` current (Chat 6 creates it), and the five-line status (done, waiting on Eddie, next); the records were re-read and patched once with an mtime check, ticking only the chat's own lines. Verify: `git diff DECISIONS.md LEARNINGS.md PROGRESSION.md` against the decisions the work states; `figma.yaml` against the library (rule 5); the five-line status, which the author hands over with the brief.

House rules (project instructions and DECISIONS):
- No em dashes in marketing copy or in anything we write for Eddie and HLR: our prose, the pack, records, deliverables, Figma names and text. Engine text is exempt: Eddie's ruling (DECISIONS 2026-10-18) narrows the project instructions' "anywhere". Verify: `grep -rIl $'\xe2\x80\x94' <path>` (the character's UTF-8 bytes, so the locale does not matter); for Figma, the same pattern over `get_metadata` output. Verbatim client text keeps its punctuation: the evidence files (corpora, the catalog, the claims scan) and the product database's verbatim Shopify title. In copy, the lints become the guard once HLR's `prohibited_patterns` carries the character (R7).
- Product display names use "in", not dashes; the product database keeps the Shopify title verbatim beside its display name (Q10).
- The brand book is cited by PDF page number.
- A lane writes only its Write scope, reads Figma only, and patches the records once at close.
- Estimate before spend; the LEARNINGS entry records measured cost, or "not measured". A fan-out (subagents, a squad run) states its estimate and needs Eddie's go unless its prompt already authorizes it (tier 2). A Figma fan-out's first brief carries the call budget (R9).

## 3. Release checks

An engine release is a new version: `studio-engine` and the `hlr-studio-engine` bundle built from it. Every check runs on the built `.plugin` (unzipped fresh to `$ENG` where a folder is needed), in the Mac's Cowork shell from `~/rc`. The tools and their README are in `claude-cowork/_tools/release-checks/`. They name other brands, so neither they nor their output enter a brand folder: a finding that quotes another brand stays under `$RC/<version>/`, and the HLR-side report (`outputs/step-3-bundle/bundle-report.md` for 0.5.1) gives counts and classes only.

| # | Check | Run | Pass | Does not prove |
|---|---|---|---|---|
| 1 | Tests | `bash $RC/run_tests.sh $ENG` (an absolute path), on the Mac and in the cloud | `FAILED 0  NONZERO_EXIT 0`; files and checks not below the last release (0.5.1: 26 and 662) unless the report names what was retired and why | the seams between skills (watched); evals graded against an old fixture (R5) |
| 2 | Census | `cd ~/rc && python3 $RC/build_terms.py ~/rc/terms.txt`, then read its new terms (rule 9's `comm` line; the list leaves out HLR's names and faces); `python3 $RC/census.py ~/rc/terms.txt <bundle.plugin>`, and the same on `$ENG` | a last line of `TOTAL` and 0 (tab-separated), exit 0; the raw list saved as `$RC/<version>/terms.txt` | taste, defaults, slot values, budgets, barred territories, reworded quotes (R4) |
| 3 | 8-word runs | `cd ~/rc && python3 $RC/overlap_runs.py <bundle.plugin> ~/mnt/claude-cowork 8 > runs.txt` (it writes `ngram-all.jsonl` beside `runs.txt`) | every hit missing from the last release's `runs.txt` is read and classed: engine-origin, coincidental or brand content; no brand content; the report gives the new count and each class | paraphrase (R4) |
| 4 | Quoted strings | `cd ~/rc && python3 $RC/overlap_quotes.py <bundle.plugin> ~/mnt/claude-cowork > quotes.txt` | as check 3, against the last `quotes.txt`; this release's `runs.txt`, `ngram-all.jsonl` and `quotes.txt` saved under `$RC/<version>/` | paraphrase (R4) |
| 5 | Descriptions | `python3 $RC/desc_check.py $ENG` | `ALL UNDER 1024`, exit 0 (0.5.1: 11 skills, longest 981) | brand names (check 2); how well a skill triggers |
| 6 | Platform numbers | the spec scan below, on `$ENG`; `test_paid_lint.js` and `test_social_lint.js` are the tests that agreed numbers error and contested or approximate ones warn | each spec file has `_verified` and `_sources`; every number sits in an entry with a confidence, and each `far` number is read; the report gives each file's verified date and whether its sources are primary | that a number is current, or that a secondary summary matches the platform (for paid, a person confirms the 9:16 keep-clear bands and copy limits in Meta's guide before the first paid build, and `_verified` moves: DECISIONS 2026-10-18); that a confidence one object up is the entry's own and not a group's |
| 7 | Build | the rebuild below | both rebuilt plugins match the shipped sha256; 0 runtime files in the bundle | anything about content |
| 8 | Resolution | the loop below | name, alias and folder: `rc` 1 until Pack v0 and 0 after, `pack` 1 or more, `traceback` 0; `nonesuch`: `rc` 2, `pack` 0 (an uncaught exception also exits 1, hence the traceback count) | that the pack is complete (rule 3) |
| 9 | Review | one fresh-context review (lane H's prompt) that reads the diff, the judge's brief and the generation contracts against this file; 0.5.1 also ran two audits | the review names what it read and ran, and every blocker and should-fix is closed by its rerun or ruled | anything it did not read |

Spec scan (check 6). A confidence covers the numbers inside its entry, and one at the file root covers nothing. A number whose nearest confidence sits two or more objects up prints as `far`: read each (0.5.1: none in the paid specs, six grid crop values in the organic specs).

```
python3 - $ENG <<'EOF'
import json, sys, glob
for f in sorted(glob.glob(sys.argv[1] + "/skills/*/references/*specs*.json")):
    d = json.load(open(f)); bad = []; far = []
    def walk(o, p, up):
        if isinstance(o, dict):
            up = 0 if (p != "" and "confidence" in o) else (None if up is None else up + 1)
            for k, v in o.items():
                if not k.startswith("_"): walk(v, p + "/" + k, up)
        elif isinstance(o, list):
            for i, v in enumerate(o): walk(v, p + f"[{i}]", up)
        elif type(o) in (int, float):
            if up is None: bad.append(p)
            elif up >= 2: far.append(p)
    walk(d, "", None)
    print(f.split("/skills/")[1], "| verified", d.get("_verified"), "|", len(d.get("_sources", [])), "sources |", len(bad), "without a confidence:", *bad, "|", len(far), "far:", *far)
EOF
```

Rebuild (check 7). The bundle is the engine plugin (`studio-engine-<version>.plugin`) plus its registry, `plugin.json` and `BUNDLE.md`, so a rebuild that matches proves nothing else rode along. `--pack` is the path the registry records (the Mac's), and build_bundle.py does not read it, so leave it as written:

```
B=$HB/outputs/step-3-bundle; V=<version>
cd ~/rc && rm -rf src rebuilt && mkdir -p src rebuilt && unzip -q $B/studio-engine-$V.plugin -d src
python3 $B/build_bundle.py --engine src --out rebuilt/studio-engine-$V.plugin
D=$(python3 -c 'import json,zipfile,sys; print(json.loads(zipfile.ZipFile(sys.argv[1]).read(".claude-plugin/plugin.json"))["description"])' $B/hlr-studio-engine-$V.plugin)
unzip -p $B/hlr-studio-engine-$V.plugin BUNDLE.md > rebuilt/BUNDLE.md
python3 $B/build_bundle.py --engine src --out rebuilt/hlr-studio-engine-$V.plugin --brand-id hlr --brand-name "High Light Rituals" --aliases "HLR,High Light Rituals,HighLight,highlight-brandbook" --pack /Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack --plugin-name hlr-studio-engine --plugin-description "$D" --bundle-note rebuilt/BUNDLE.md
sha256sum $B/*-$V.plugin rebuilt/*.plugin
unzip -l $B/hlr-studio-engine-$V.plugin | grep -cE '\.in_use/|__pycache__|\.DS_Store'
```

Resolution (check 8):

```
for q in hlr HighLight ~/mnt/claude-cowork/highlight-brandbook nonesuch; do out=$(python3 $ENG/scripts/resolve_brand.py "$q" --check 2>&1); echo "$q rc=$? pack=$(echo "$out" | grep -c 'highlight-brandbook/brand-pack') traceback=$(echo "$out" | grep -c Traceback)"; done
```

Lane F ran checks 1, 2 and 5 to 8 on 0.5.1 (2026-10-18): 26 files and 662 checks passed; census 0; descriptions all under 1024; the spec scan clean (paid specs verified 2026-07-27, organic 2026-10-17); both plugins rebuilt to the shipped sha256 with 0 runtime files; resolution as stated. Checks 3, 4 and 9 were not rerun; the 0.5.1 report has them. Every command block in this file ran as written in the Mac's Cowork shell on 2026-10-18 (the rebuild with V=0.5.1).

## 4. Risk tiers

| Tier | What | Ships on | Go |
|---|---|---|---|
| 1. Checks plus a review | your own record lines; read-only evidence (inventories, censuses, measurements, screenshots); `[documented]` and `[observed]` values with their sources; null roles with gaps and owners; new tests, lints, census terms and scans; fixes inside an unreleased engine version | the checks for what changed, plus one fresh-context review with no open blocker or should-fix; record lines and read-only evidence need only the author's re-read of the diff | the evidence; no sign-off |
| 2. Eddie | the open gates (2 and 4) and the forge proof's grade; any `[derived]` value used as law (tokens, the contrast law, voice principles, the taxonomy, house style); every Figma write and every convention, and any write to the client's live files; engine design choices, which ship as marked defaults he rules on; an engine release to install; scope, channels and deliverables; a fan-out or squad run its prompt does not already authorize (estimate first); overwriting a canonical file or one outside your write scope; anything that leaves this brand home for HLR; a finding still open after three rounds | tier 1, then his explicit go as a dated DECISIONS line | Eddie, in words |
| 3. HLR, through Eddie | HLR's facts and rights: the HLR-owned questions in the DECISIONS line "Gate 1 closed" (2026-10-17), from positioning and claims and the font licenses to the origin and karat claims; HLR's confirmation of Eddie's Gate 1 picks; claims marked `needs_legal`, which a person signs | tier 2, then HLR's answer recorded with its source and date; until then the role stays null with its gap | HLR, at a live review or in writing, relayed by Eddie |

Never ships, at any tier, and no waiver covers it: an invented figure, claim, price, quote or review; another brand's name, fact, file key or taste; a write to the client originals or the reference copy; an unconfirmed face without its flag, or an image without its usage right and without its placeholder; an em dash in our own text in copy or a deliverable (verbatim client text, as section 2 lists it, keeps its punctuation).

In production, once HLR's team runs the forge, checks flag and never block shipping: a person decides (playbook section 4). In this build, an open blocker or should-fix stops its release until it is fixed or Eddie rules.

## 5. Finding flow

A release is an engine version, a lane's or chat's close, or a deliverable handed to Eddie or HLR.

Severity:
- **blocker**: a standing rule broken, or the work would ship wrong: an unsourced or invented HLR fact, another brand's content, a derived value used as law, a Figma write without a go, an unconfirmed face without its flag, an image without its usage right and without its placeholder, a failing test or check, or a required check nobody ran. Fixed before the release ships. Eddie can waive a blocker by a DECISIONS line, never one on the never-ships list.
- **should-fix**: right today, wrong at a later step or a seam (a Step 4 build, the forge proof, malformed input, another skill's machinery). Fixed and re-verified in the same release.
- **note**: no failure scenario yet (clarity, naming, a weak check). Fixed if cheap; otherwise logged with an owner.

A finding without a concrete failure scenario is a note. One line per finding, most severe first:

```
<id> <severity> | <file>:<line> | Failure: <input or state> -> <wrong result> | Owner: <lane or person> | Check: <what catches it> | Status: open
```

The file is a path from the brand home or the bundle root; a Figma finding gives the file key and node id, the brand book its PDF page. Status becomes `fixed, verified by <rerun>` or `ruled, DECISIONS <date>`.

1. **Review.** The author runs the section 2 and 3 commands its work needs and hands the reviewer the work's paths, that output and its close status. A fresh-context reviewer, one that did not write the work and never reads the author's transcript, reads those and the record against this file, reruns what it can reach, and says which checks only the author ran. A required check nobody ran is a blocker. The review's first line names what it read and ran. Its findings go to `review-<topic>-r<N>.md` beside the work when the lane's write scope allows; otherwise they stay in the session and the LEARNINGS entry gives their counts. An engine review that quotes another brand writes under `$RC/<version>/`.
2. **Fix and re-verify, in the same release.** The owner fixes every blocker and should-fix and reruns the check or probe that caught it. The rerun's output is the evidence, noted beside the finding.
3. **Re-review.** The next round reads the fixes and reruns the probes. A round is one review and its fixes.
4. **Three rounds at most.** A blocker or should-fix still open after round 3 ends the patching: the owner takes the approach question to Eddie as numbered options with tradeoffs and a stated default, ranked by production-blocking risk. His answer is a DECISIONS line.
5. **Seen twice, guarded.** A finding's second sighting, in any review, release or lane, gets its guard in the same release: a lint, a test, a census term or a scan, named in its section 6 row. When the owner cannot build it in that release, the row says so and the gap goes to Eddie, who assigns it or accepts it with a dated DECISIONS line, as he did for the seeded rows (DECISIONS 2026-10-18).
6. **Close.** The release report or the LEARNINGS entry gives findings by severity, fixed and verified, open with owners, and rounds used.

Reviewer brief, paste-ready:

```
Review <the work> for HLR against REVIEW.md at the brand home root. The author gives you the work's paths, the output of the checks it ran in the Mac's Cowork shell, and its close status. Read files only: the work, REVIEW.md, PROGRESSION.md, the latest DECISIONS.md and LEARNINGS.md entries, and what the work cites; never the author's transcript. Figma: read only. Rerun the checks you can reach and say which ones only the author ran. Report findings in REVIEW.md's format, most severe first, after a first line naming what you read and ran; write them to review-<topic>-r<N>.md beside the work if your brief allows. A PASS names what it read. Make no fixes and no decisions.
```

## 6. Recurring findings

Seeded from LEARNINGS.md and lane F's dry run. Entries are cited by a phrase from their heading: "Step 1, chat 1", "Chat 6 prompt", "Gate 3 proposed", "Step 1b pattern review", "engines 0.5.0 and 0.5.1" and "Gate 1 closed" (2026-10-17); "lane A" and "lane B" (2026-10-18). Each row names its guard. For the seeded rows Eddie ruled (DECISIONS 2026-10-18): each script's owner builds it at their next close, and the habits (R1, R2, R4's paraphrase, R9, R10 and R11) are accepted for Phase 1.

| # | Finding | Seen | Guard now | Gap, owner |
|---|---|---|---|---|
| R1 | Two chats on one step or one file, neither seeing the other | Step 1b pattern review (the later commit won); Gate 3 proposed; engines 0.5.0 and 0.5.1 (a ruling landed mid-run); Gate 1 closed (Step 1b ran twice) | the lane protocol (write scope, one patch at close with an mtime check); "Runs only when" lines; DECISIONS re-read before a release's last build | the opening scan is a habit, accepted for Phase 1 |
| R2 | A prompt pasted before its preconditions held | Chat 6 prompt; Gate 3 proposed; Gate 1 closed | a "Runs only when" line on every prompt; rule 1 | a habit, accepted for Phase 1 |
| R3 | A count that misses nested frames, counts hidden copy or goes stale | Step 1, chat 1 (email grew between reads); Step 1b pattern review (nested frames missed, hidden copy counted); lane A (the walk's counts differ from both) | lane A's hash-checked re-cut, the corpus of record (DECISIONS 2026-10-18); a count reused only with its id checksum; an independent text-node count | the web and other pages are not re-cut yet; lane A |
| R4 | Another brand's content that the name census passes: taste, defaults, slot values, budgets, barred territories, reworded quotes | engines 0.5.0 and 0.5.1 (0.4.0's judge brief and a hard-coded product family; then 0.5.0's defaults, fixtures and test copy after a clean census) | the census; both overlap scans; the review of the judge's brief and the generation contracts | paraphrase has no script, only the review; accepted for Phase 1 |
| R5 | Fixtures that carry another brand's facts or drift from their source | engines 0.5.0 and 0.5.1 (fixture slot maps, budgets, barred terms, review ids, reworded quotes; three evals graded against an earlier fixture) | fixtures rewritten with fictional brands (DECISIONS, 0.5.0 and 0.5.1); the census and scans cover tests and fixtures | no test checks a fixture's label or an eval's match to its fixture; lane H, at its next close |
| R6 | A platform number that is a brand's, or rests on a secondary source | engines 0.5.0 and 0.5.1 (paid safe bands from one brand's guide layer); Step 1b pattern review (9:16 from a secondary summary) | `_verified`, `_sources` and a confidence on every spec number; agreed numbers error, others warn (check 6) | the spec scan sits in `$RC/0.5.2/`, not yet beside the other tools, lane H at its next close; a person confirms the paid 9:16 bands and copy limits in Meta's guide before the first paid build, and `_verified` moves (DECISIONS 2026-10-18) |
| R7 | An em dash in marketing copy or HLR-bound output | Gate 3 proposed (frame names); lane F (a written escape became one in REVIEW.md's draft) | guard built: lane E, `outputs/step-2-pack/preflight.md` (R7): the character is in HLR's `prohibited_patterns` (File map) and every lint blocks it end to end, a comma control drawing nothing; the grep in section 2 | `page_lint.js` refuses every page until the web taxonomy is ratified at Review 2; Eddie |
| R8 | Faces the Figma build path cannot load | Gate 3 proposed; engines 0.5.0 and 0.5.1; lane B (a stand-in maps families, not styles); Chat 6 review round 1 (R1-03: four labels bound only their font style) | Gate 3 call 7, path 1: stand-ins in `figma.yaml`, families bound to `HLR / Layout` variables and switched in the desktop app, budgets re-measured; guard built: Chat 5, `outputs/step-4-figma/guards/r8_text_style_family.js` (every text style binds its family to a variable; 15 styles, 0 fails, 2026-10-23); guard extended: Chat 6, `outputs/step-4-figma/guards/r8_text_nodes.js` (every text segment binds family, size and style, through its style or on the node; 01 to 04, 0 fails, 2026-10-23) | the switch to the real faces ran 2026-10-23 at Eddie’s request, once the build path could load them; shipping still waits on HLR’s licenses (rule 8); HLR |
| R9 | Figma limits hit mid-run | Step 1, chat 1 (20 KB results); Step 1b pattern review (one rate limit for parallel subagents); Gate 1 closed (10 calls a minute, 200 a day) | the call budget in the first brief; aggregates by script, bulk reads by `get_metadata` | a habit, accepted for Phase 1; a brief without a call budget is a should-fix |
| R10 | Sources that disagree by date | Step 1, chat 1 (book, site and SVG fills); Step 1b pattern review (imagery families with no card); lane B (archive mark fills) | sources dated; contradictions flagged in `brand-context.md`, never silently resolved (playbook section 3) | a habit (rule 2's trace), accepted for Phase 1 |
| R11 | Cost not measured, or measured two ways that disagree | every 2026-10-17 entry and lane B (main chat not measured); lane A (its own count and the harness's disagree, both over target) | each entry's cost line | a habit, accepted for Phase 1; the forge proof still needs a measured cost (Chat 7) |
| R12 | Text copied through model or tool context changes characters | lane A (soft line breaks and no-break spaces changed, two written escapes lost); lane F (a written escape became an em dash); Chat 6 (a written escape became an em dash inside two scripts; their own asserts caught it); Chat 5 and Chat 6, Foundations review F1-04 (the description setter stored straight quotes and ampersands as HTML entities on 00 to 02) | lane A's hashes taken inside Figma; the em dash grep; non-ASCII escaped in tool output; a script that tests for the character builds it with `chr(0x2014)` or `String.fromCharCode(0x2014)`; guard built: Chat 6, `outputs/step-4-figma/guards/entity_scan.js` (descriptions, names and text on 00 to 02 hold no HTML entity and promise no closed gate’s work; 0 hits, 2026-10-23) | a scan that copied text matches its source byte for byte (lane A's hash method), kept as a command in lane C's notes; lane C at its close |
| R13 | One geometry kept as several marks | Gate 3 proposed (three wordmark SVGs, one geometry); lane B (the monogram under two names) | guard built: Chat 5, `outputs/step-4-figma/guards/r13_mark_geometry.py` (hashes the SVG path data under `HLR Logo & Marks`; three wordmark files, one geometry; 2026-10-23) | none |
| R14 | A required file or board with no owning step | Chat 6 prompt (`slotmap.yaml`, now Chat 6's); lane B (the strictness map) | guard built: lane E, `outputs/step-2-pack/preflight.md` (R14): every required role and artifact has an owner from the allowed-owner list and, for a lane or chat, an open PROGRESSION step; a board recorded as built needs no row; mutation tests in `outputs/step-2-pack/guards/` | none; the strictness map was drafted by Chat 5 (Gate 2 package call 7 a) and adopted at Gate 4 |
| R15 | An engine step that drops or overwrites tokens without a warning | Gate 3 proposed (`figma-plan` dropped tokens); lane B (the Tailwind export overwrites deeper names) | `figma-plan` lists `not_planned` since 0.5.1; lane B keeps those names flat | no test for a key collision in the export; lane H, at its next close |
| R16 | A placeholder's typed label held to the size rule outside the recipe's own placeholder frame | lane H 0.5.3, rounds 2 and 3 (R2-02; R3x-02: an E## placeholder element, the agent package's rectangle) | K19 covers the recipe's placeholder() frame only | the label marked by its own name (IMAGE, ILLUSTRATION), with K tests through the recipe on both shapes; lane H, 0.5.4 |
| R17 | A paged inventory that passes pages of two frames as one, or caps a page by characters where the limit is bytes | engine 0.5.2, round 3 (R3-04, R3-05: the face inventory); lane H 0.5.3, round 3 (the canvas inventory) | none | the frame id on every page and a byte budget in both recipes, with tests on each; lane H, 0.5.5 (moved out of 0.5.4, DECISIONS 2026-10-22) |
| R18 | A rule in the brand context with no provenance tag, or a tag that points at a lane line instead of Eddie's ruling | lane E, rounds 1 and 2 (B2, the Claims regime; B3, the Design system and the brand name line); round 3 (an opening paragraph and a lead-in line went unscanned; a tag cited the ledger seed line) | guard built: lane E, `outputs/step-2-pack/preflight.md`: the tag scan (every line above Gaps and owners) and the pointer check (every `[documented, DECISIONS <date>]` tag and ratification note against DECISIONS.md); mutation tests in `outputs/step-2-pack/guards/` | none |
| R19 | A record kept in two places drifting: a board, a description or a pack line left behind when its source or a gate moved | Chat 6 review round 2 (R2-05: the Strictness map board behind its file); Foundations review round 1 (F1-01 to F1-05: five boards written before Gate 4); round 2 (F2-01: six pack lines still promising Gate 4’s work, and five more the scan then found) | guard built: Chat 6, `outputs/step-4-figma/guards/board_expect.py` with `board_drift.js` (every Color, Certified pairs and Type cell in full, one cell per pair, the specimen count, the Strictness map, the license flag on each board, text cut by a clipping frame, and no text promising work from a closed gate; 0 fails, 2026-10-23) and `closed_gate_scan.py` (the pack and the Review 2 package; its JS twin runs in board_drift.js and entity_scan.js, kept in step by `tests/closed_gate_parity.js`) | known misses (Foundations review round 3): promises phrased outside the closed-gate rule’s patterns and register steps it does not read (F3-01, its approach with Eddie); layer names, the Strictness map flag past its first words, the case of Type lines, most Layout and Marks text (F3-05); Chat 6’s next close. Run at each close that touches tokens, exemplars, the strictness map or a gate |
| R20 | A check that passes a defect it cannot measure | Chat 6 review round 2 (R2-01, R2-02: the flex probe passed M11's body running through its CTA); round 3 (R3-02: a wrap grid read as a scroller turned the clip test off); Foundations review round 2 (F2-02, F2-07: board_drift.js and host_shape_check.py passed defects of the classes they were built for); round 3 (F3-01: the closed-gate rule passed its own class phrased another way) | `chat6/checklib.js`: collisions, fixed-box overflow, each slot alone and all together, wrap grids not scrollers; engine gap G8 for the recipe; guard built: Chat 6, `outputs/step-4-figma/guards/tests/run_all.sh` (each guard’s must-fail cases: the closed-gate cases and parity, 8 host shape mutations, 11 board expectation mutations; PASS, 2026-10-23) | fixtures that must fail (M11's first build, a wrap grid with a clipped label) as K tests in the recipe; lane H, 0.5.4. The harnesses count a guard that crashes as one that caught the defect (Foundations round 3, F3-07): Chat 6’s next close |
| R21 | A fix that reaches an element but not the modules that host it | Chat 6 review round 2 (R2-04: M15's six cards kept the old placeholder); round 3 (R3-01: M15's copy shape kept the old rule) | guard built: Chat 6, `outputs/step-4-figma/guards/host_shape_check.py` (the element’s own shape and every host that composes it carry its rule, no negated rule, every written budget equals the slot map; 8 mutations in `tests/host_shape_mutations.py`) and `host_placeholders.js` (element texts in module masters read what the element reads; 43, 0 fails, 2026-10-23) | near variants the host shape guard still passes (Foundations round 3, F3-06: a negation outside never, not and no; a budget written before its slot id or in words): Chat 6’s next close |

Seen once, watched (a second sighting makes it a row):
- A census term that missed plurals and possessives (engines 0.5.0 and 0.5.1): fixed in `census.py`.
- A fill count read as a ground (Step 1b pattern review): check coverage before naming a ground.
- A module root bound to the wrong semantic ground (Chat 6 review round 1, R1-01: `background/default` where Gate 1 C4 keeps the email page white; no lint read it): `outputs/step-4-figma/guards/email_ground.js`, which asserts the email page ground on every module root since round 2 (R2-09) (02 to 04, 0 fails, 2026-10-23).
- Paths written for the Mac failing in the Cowork shell (engines 0.5.0 and 0.5.1): the resolver reads through `claude-cowork/`.
- Runtime files inside a bundle (engines 0.5.0 and 0.5.1; the Oct 14 0.4.0 snapshot zip carried `.in_use/90`): check 7.
- A new skill breaking at its seams, not in its own tests (engines 0.5.0 and 0.5.1: seven should-fix items in one review): review the seams and keep the reviewer's probes as tests (no 0.5.1 test is named for them).
- The handle misspelled as @HIGHTLIGHTRITUALS in 48 social rows (lane A): a candidate prohibited pattern; lane C.
- A provenance scan that counted a two-tag token as derived (lane F): rule 4's scan counts by first tag and lists the derived values not yet ruled.
- Junk terms in a rebuilt census list (lane F: `com` and three token aliases): fixed in `build_terms.py`, with `test_build_terms.py`.
