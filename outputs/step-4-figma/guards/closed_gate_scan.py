#!/usr/bin/env python3
"""Closed-gate scan (Chat 6, 2026-10-23; REVIEW.md section 6 rows R19 and R20). Text kept promising work from a gate
that had closed: on the boards (Foundations review F1-05), in pack lines the board fix missed (F2-01), and in a
register row whose step was a closed gate, phrased past the rule's reach (F3-01). Two checks; either fails the scan.

1. Registers (Eddie, 2026-10-23, F3-01 option 1). Every markdown table in the scanned files whose header has a Status
   or State column and a Step or Closes at column is read row by row. A row still open fails when its step has closed.
   Open: anywhere in the state, to confirm or to be confirmed, ratified, ruled, decided or settled, for someone to
   confirm, awaiting, unconfirmed, unratified, unruled, unresolved, not yet, pending, later, TBD or subject to; a part
   that starts open, conflict, conditional, flagged, measured or not set, received or named, or ends open; or no
   ruled, ratified, adopted, closed, moot, built or resolved in its first part (after the batch 2 review round 1,
   BR1-07). Closed: the step names a closed gate (Gate 4, Gate four, G4, the fourth gate), a Review whose PROGRESSION
   line is held or missing, a Step whose boxes are all ticked, or a date that has passed; it quotes a plan line that
   PROGRESSION does not have, or only closed ones (a quote matches its line as written, else with every parenthetical
   dropped from both, else a quote opening on Review N takes Review N's line, so a line marked held still matches,
   BR1-06); or it is empty. Parentheticals in a step are notes, not the step. A row owned by none is skipped. A free
   label (later, Phase 2, before production) names no step that can close, so it passes.
2. Prose. A mention of a closed gate fails when its clause promises the gate's work: "until Gate 4", "Gate 4 rules",
   "Gate 4 to decide", "Gate 4 is where", "Gate 4's call", "a Gate 4 item", "is the Gate 4 call", "are set at Gate 4",
   "breakpoints at Gate 4", "At Gate 4, Eddie sets", "to Gate 4", "pending Gate 4", "for Gate 4", "once Gate 4
   closes", "waits on Gate 4", "a proposal comes at Gate 4", "Draft for Gate 4", "not yet binding" with an undated
   mention; and a table row with an open cell and a cell that is only step names, one a closed gate (rule 1 for text
   with no header: Figma text, these CASES). Records pass: a past-tense record verb straight before "at Gate N" (or
   "ratified by Eddie at Gate N"), unless an is, are, be, get, to or will word goes just before it; a date straight
   after the mention or its noun ("the Gate 4 decision (2026-10-23)", "at Gate 2 on 2026-10-21"); "until Gate 4 named
   the modes on 2026-10-23"; "for Gate 4, which adopted it"; "Gate 4 left", "since Gate 4", "Gate 2 package call 1",
   "Gate 1 C6", a definite "The Gate 4 call on X is ..."; and dated log rows and comments. Free prose stays a
   heuristic: the fresh-context review at each close still reads it.

Both languages read text the same way, so the twin agrees by construction: every space, the no-break ones included,
is one plain space before any match, and word, boundary and case tests are ASCII (re.ASCII here, no u flag in JS).
board_drift.js and entity_scan.js carry rule 2 for Figma text (closed_gate_rule.js's block, verbatim); the CASES below
are the shared test (tests/closed_gate_parity.js) and REGISTER_CASES test rule 1.
Usage: python3 closed_gate_scan.py <brand home> [--test | --cases-json | --verdicts-json | --fuzz-json]. Scans brand-pack/ (md, json,
yaml) and the Review 2 package. Exit 0 when no clause promises a closed gate's work and no open register row names a
step that has closed."""
import datetime, json, os, re, sys
A = re.A | re.I
WS = '[\t\x0b\x0c\r \x1c-\x1f\x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]'
def norm(t):
    """Every space but the line break, in either language's sense, becomes one plain space."""
    return re.sub(WS, ' ', t)
PAST = r'(?:named|ruled|adopted|ratified|decided|chosen|chose|confirmed|closed|routed|set|recorded|approved|built|taken|took|kept|moved|made|picked|added|settled)'
AUX = {'is', 'are', 'be', 'being', 'get', 'gets', 'getting', 'to', 'will', 'would', 'shall', 'can', 'could', 'must', 'should', 'may', 'might'}
DATED = r' ?(?:, ?|\(|on |\(on )?20\d\d-\d\d'
UNDATED = '(?!' + DATED + ')'
NOUN = r'(?:item|decision|call|question|proposal|ruling|matter|task)'
VERB = r'(?:will|would|shall|rules|sets|names|decides|chooses|settles|takes|owns|brings|confirms|ratifies|routes)'
def future(n):
    g0 = 'gate %d' % n; g = g0 + r'\b'
    return [r'\buntil ' + g + '(?! ' + PAST + r'\b[^.;]*\b20\d\d-\d\d)',
            r'\b' + g + ' (?:' + VERB + r'\b|to (?!(?:gate|review|step|chat|lane)\b)[a-z])',
            r'\b' + g + r' (?:is|are)\b(?! (?:closed|done|over|past)\b)',
            r'\b(?:is|are|be|being|get|gets|getting) (?:\S+ )?' + PAST + ' (?:at|in|by|with) ' + g + UNDATED,
            r'\ban? ' + g + ' ' + NOUN + r'\b(?! \d)' + UNDATED,
            r'(?:\b(?:is|are|be|being|remains?|stays?)|:) the ' + g + ' ' + NOUN + r'\b(?! \d)' + UNDATED,
            r'\b(?:proposal|draft)\b[^.;]{0,40}\b' + g, r'\b(?:waits?|waiting) (?:on|for) ' + g,
            r'\bpending\b[^.;()]{0,24}\b' + g, r'\b(?:comes?|arrives?|lands?)\b[^.;()]{0,60}\b' + g,
            r'\bfor ' + g + '(?!,? which ' + PAST + r'\b)' + UNDATED, r'\bto ' + g + UNDATED,
            r'\b(?:once|when|as soon as|by the time) ' + g + '(?! (?:' + PAST + r'|had|was|were)\b)',
            r'\b' + g0 + "['\u2019]s" + r'\b(?![^.;]{0,30}\b20\d\d-\d\d)']
def bare_at(c, n):
    """A bare "at Gate N" names the gate as the time of the work, unless a date follows it, or a past-tense record
    verb goes straight before it ("named at", "ratified by Eddie at", "ratified 2026-10-22 by Eddie at") with no is,
    are, be, get, to or will word in the two words before that verb."""
    for m in re.finditer(r'\bat gate %d\b' % n, c, A):
        if re.match(DATED, c[m.end():], A): continue
        toks = [w for w in c[:m.start()].split(' ') if w]; j = len(toks) - 1
        if j >= 2 and toks[j - 1].lower() == 'by': j -= 2
        if j >= 0 and re.fullmatch(r'\(?20\d\d-\d\d-\d\d[),]?', toks[j], A): j -= 1
        if j >= 0 and toks[j].lower() == 'on': j -= 1
        w = toks[j].lower().strip('(),:') if j >= 0 else ''
        past = re.fullmatch(PAST, w, A) or (w == 'open' and j >= 1 and toks[j - 1].lower() == 'left')
        if past and not any(x.lower().strip('(),:') in AUX for x in toks[max(0, j - 2):j]): continue
        return True
    return False
def unbound(c, n):
    """"not yet binding" beside a mention of the gate with no date after it."""
    return bool(re.search(r'\bnot yet binding\b', c, A)) and any(not re.match(DATED, c[m.end():], A) for m in re.finditer(r'\bgate %d\b' % n, c, A))
OPEN_CELL = r'^(?:open|pending|conflict|conditional|unresolved)\b|^\[derived\](?!.*\b(?:ratified|ruled|adopted)\b)|\bto confirm\b| open$'
STEP_CELL = r'^(?:gate|review|step) \d+[a-z]?(?: ?(?:,|;|and) ?(?:gate|review|step) \d+[a-z]?)*$'
def row_promise(t, closed):
    """A table row with an open cell (open, pending, conflict, conditional, to confirm, or a [derived] value no one has
    ratified) and a cell that is only step names, one of them a closed gate."""
    if not t.strip().startswith('|'): return False
    cells = [x.strip() for x in re.sub(r'^\|+|\|+$', '', t.strip()).split('|')]
    if not any(re.search(OPEN_CELL, x, A) for x in cells): return False
    for x in cells:
        s = re.sub(r' ?\([^)]*\)', '', x).strip()
        if re.match(STEP_CELL, s, A) and any(int(g) in closed for g in re.findall(r'\bgate (\d)\b', s, A)): return True
    return False
HISTORY = [r'^\| *20\d\d-\d\d-\d\d *\|', r'^ *# *20\d\d-\d\d-\d\d']  # dated log rows and comments are records
def clauses(t):
    return [c for c in re.split(r'(?<=[.;!?])[ \n]+|\n+', t) if c.strip()]
def promises(text, closed):
    """The clauses of text that promise a closed gate's work."""
    t = norm(text)
    if any(re.search(h, t, A) for h in HISTORY): return []
    if row_promise(t, closed): return [t.strip()]
    out = []
    for c in clauses(t):
        for n in sorted({int(g) for g in re.findall(r'\bgate (\d)\b', c, A)} & set(closed)):
            if any(re.search(p, c, A) for p in future(n)) or bare_at(c, n) or unbound(c, n):
                out.append(c.strip()); break
    return out
CASES = [  # (text, must fail), with Gates 1 to 4 closed. The first 14 are the Foundations review round 2 test set.
    ('Alternate grounds (Forest, Onyx, Fawn) arrive with their mode names at Gate 4', True),
    ('Clear space and minimum sizes: none documented; a proposal comes at Gate 4', True),
    ('Breakpoints are not set (figma.yaml breakpoints: null); a proposal comes with Gate 4', True),
    ('Clear space and minimum size: gap, proposal at Gate 4', True),
    ('[derived] Draft for Gate 4, not yet binding', True),
    ('[observed] breakpoints at Gate 4', True),
    ("Per-breakpoint budgets live in lane D's section_library; breakpoints at Gate 4.", True),
    ("The engine's reference phone is 390: Gate 4 rules the breakpoints (figma.yaml breakpoints null)", True),
    ('No recipe yet: canvas and structure are a Gate 4 item (owner Eddie).', True),
    ('The margins stay two tokens until Gate 4 sets the web margins, then fold into one canvas-moded space.margin', True),
    ('then the C4 candidate grounds as primitives until Gate 4 names the modes', True),
    ('Web breakpoints are set at Gate 4.', True), ('Gate 4 will name the breakpoints.', True),
    ('The focus ring is a Gate 4 decision.', True),
    ('Breakpoints are not set (figma.yaml breakpoints: null): Gate 4 left web breakpoints, margins and grid to Eddie at Review 2, with the web masters.', False),
    ('Gap, owner HLR: Gate 4 left it open for HLR\u2019s vectors (Review 1).', False),
    ('[derived] Adopted at Gate 4, for Eddie to confirm', False),
    ('Forest, Onyx and Fawn are the alternate grounds, named at Gate 4.', False),
    ('(ratified 2026-10-22 by Eddie, Gate 2 package call 5) Its alias was set at Gate 4 (2026-10-23) [derived, for Eddie to confirm].', False),
    ('social 2 px [derived, ruled 2026-10-22 by Eddie, Gate 2 package call 1], unused while social art draws no CTA (Gate 1 C6)', False),
    ('Gate 4, decided by Claude under Eddie\u2019s delegation (2026-10-23), for Eddie to confirm.', False),
    ('Aliases text.on-placeholder since Gate 4 (2026-10-23), so the label stays Onyx on every ground.', False),
    ('Review 2, with the web masters (Gate 4 closed without it)', False),
    ('Gate 3 call 7, path 1', False), ('The next batch waits on Gate 4.', True), ('Gate 4 sets it.', True),
    ('binding only once Eddie ratifies it at Gate 2.', True), ('the mode is named at Gate 4.', True),
    ('Eddie at Gate 2, then HLR', True), ('Gate 1 picks C3, C4, C5, C6 and C8 go to HLR at Review 1.', False),
    ('(Eddie, Gate 2, 2026-10-21)', False), ('Gate 4 added on-placeholder (31:40), 89 in all', False), ('(Gate 1, Brand Review Q11)', False),
    ('| 2026-10-22 | Strictness map | Eddie rules it at Gate 4, before any module |', False),
    ('keyed by Shopify handle until HLR\'s export lands, then by SKU (DECISIONS 2026-10-18, Gate 2 call 7 a)', False),
    ('Status: ratified by Eddie at Gate 2 on 2026-10-21 (lane C calls 1 a, 7 a and 8 a)', False),
    ('adopted as drafted at Gate 4 on 2026-10-23 by Claude under Eddie\'s delegation', False), ('Eddie rules on it at Gate 4, as planned.', True),
    ('the warm, deep and night grounds (named at Gate 4, 2026-10-23)', False), ('Eddie rules on it at Gate 4.', True),
    # Foundations review round 3 (fnd/r3/gate_variants.json): 15 promises, 5 records, 2 parity lines.
    ('| L3 | Web margins, grid and breakpoints | open | `figma.yaml` breakpoints null | Eddie | Gate 4 |', True),
    ('| K2 | Web focus ring | open | not tokenized | Eddie | Gate 4 |', True),
    ('Eddie will set the web margins at Gate 4.', True), ('The web margins get set at Gate 4.', True),
    ('The margins are left to set at Gate 4.', True), ('Breakpoints: deferred to Gate 4.', True),
    ('The breakpoints go to Gate 4.', True), ('Breakpoints: pending Gate 4.', True),
    ('The breakpoints are Gate 4\u2019s call.', True), ('Breakpoints: Gate 4 to decide.', True),
    ('Gate 4 is where the breakpoints get set.', True), ('Once Gate 4 closes, the margins fold into one token.', True),
    ('At Gate 4, Eddie sets the breakpoints.', True), ('The breakpoints stay open until gate 4.', True),
    ('The breakpoints stay open until Gate\xa04.', True),
    ('The alternates were primitives until Gate 4 named the modes on 2026-10-23.', False),
    ('on-placeholder is derived and not yet binding: set at Gate 4 (2026-10-23), for Eddie to confirm.', False),
    ('The Gate 4 decision (2026-10-23) named the ground modes.', False),
    ('The Gate 4 call on the ground names is on Eddie\u2019s morning sheet.', False),
    ('Chat 5 drafted the strictness map for Gate 4, which adopted it on 2026-10-23.', False),
    ('Breakpoints are \xe9tablis at Gate 4.', True), ('The modes are \xe9 named at Gate 4.', True),
    # Chat 6's own, at the fix: the rows round 3 named (K3 live, C2 before F1-05), a ruled row, and the edges.
    ('| K3 | Strictness map | ruled at Gate 4 (2026-10-23, Claude under Eddie\'s delegation, for Eddie to confirm) | board `Strictness map` (7:15) | Eddie (confirms) | Gate 4 |', True),
    ('| C2 | Alternate ground modes | [derived] candidates | section 2 table | Eddie | Gate 4 (names), Gate 2 (values) |', True),
    ('| C4 | Neutral ramp | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 6) | 10 OKLCH steps | Eddie | Gate 2 |', False),
    ('| K2 | Web focus ring | open | not tokenized | Eddie | Review 2, with the web masters (Gate 4 closed without it) |', False),
    ('Gate 4 is closed; the names stand.', False), ('When Gate 4 closes, the grid lands.', True),
    ('The names were ratified by Eddie at Gate 4.', False), ('The names are to be ratified by Eddie at Gate 4.', True),
    ('The modes are named at Gate 4 (2026-10-23).', False), ('Gate 4\u2019s call (2026-10-23) named the modes.', False),
    ('Status: ratified 2026-10-22 by Eddie at Gate 2 (the Gate 2 package at its defaults)', False),
    ('ratified on 2026-10-22 by Eddie at Gate 2', False), ('to be ratified on 2026-10-30 by Eddie at Gate 2', True),
    ('| T7 | Type ramp | [derived] | section 3 | Eddie | Gate 2 |', True),
    ('| T7 | Type ramp | [derived] (ratified 2026-10-22 by Eddie, Gate 2 package call 3) | section 3 | Eddie | Gate 2 |', False),
]
# Rule 1's own cases: a PROGRESSION and register rows, each (row, must fail), read under the header below.
REGISTER_PLAN = '\n'.join(['## Step 3. Register HLR', '- [x] Lane H ships 0.5.3', '## Step 4. Figma', '- [ ] The next module batches',
                           '- [x] Foundations built and reviewed on the library', '## Step 5. Forge proof', '- [x] One real HLR brief run',
                           '- [x] **Gate 4**: Eddie rules on the ground roster', '## Reviews (default plan)',
                           '- Review 1 ({{review-1-date}}): the Brand Review and the token proposal',
                           '- Review 2 (Fri 2026-10-30, held): Figma foundations and the first modules',
                           '- Review 3 ({{review-3-date}}): templates and the forge proof'])
REGISTER_HEAD = '| # | Gap | Status | Filled by | Owner | Closes at |'
REGISTER_CASES = [
    ('| K3 | Strictness map | ruled at Gate 4 (2026-10-23, for Eddie to confirm) | board | Eddie (confirms) | Gate 4 |', True),
    ('| L3 | Web margins | open | breakpoints null | Eddie | Gate 4 |', True),
    ('| C2 | Alternate ground modes | [derived] candidates | section 2 table | Eddie | Gate 4 (names), Gate 2 (values) |', True),
    ('| K2 | Web focus ring | open | not tokenized | Eddie | Review 2, with the web masters |', True),
    ('| X1 | A gap | open | none yet | Eddie | Review 9 |', True),
    ('| X2 | A gap | open | none yet | Chat 6 | Step 5 |', True),
    ('| X3 | A gap | open | none yet | Eddie | 2026-10-01 |', True),
    ('| X4 | A gap | measured at build | none yet | Chat 6 | |', True),
    ('| X5 | A gap | open | none yet | Eddie | `Foundations built and reviewed on the library` |', True),
    ('| C4 | Neutral ramp | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 6) | 10 steps | Eddie | Gate 2 |', False),
    ('| T4 | Pull quote face | ruled (Gate 2 call 9); the book\'s conflict: p16 says one face | p18 | Eddie | Gate 2 |', False),
    ('| C1 | Ink | ruled by Eddie (C4), for HLR to confirm | Onyx | HLR | Review 1 |', False),
    ('| L4 | Module geometry | [observed], measured at build | asset-types.md | Chat 6 | Step 4 |', False),
    ('| L6 | Motion | open: annotations fade in | | Eddie | later |', False),
    ('| C11 | Pantone | open: the book prints PMS --- | | HLR | Phase 2 |', False),
    ('| T5 | Body specimen | conflict: p16 against p17 | moot | none | |', False),
    ('| X6 | A gap | open | none yet | Eddie | Review 3 (Gate 4 closed without it) |', False),
    ('| X7 | A gap | open | none yet | Chat 6 | `The next module batches` |', False),
    # the batch 2 review round 1: BR1-06 (a quote of a held Review in another form; a quote of no line) and BR1-07
    ('| X8 | A gap | open | none yet | Eddie | `Review 2 (Fri 2026-10-30): Figma foundations and the first modules` |', True),
    ('| X9 | A gap | open | none yet | Eddie | `A plan line nobody wrote` |', True),
    ('| X10 | A gap | open | none yet | Eddie | `Review 3 (2026-11-06): templates and the forge proof` |', False),
    ('| K3 | Strictness map | adopted at Gate 4 (2026-10-23), to be confirmed by Eddie | board | Eddie | Gate 4 |', True),
    ('| K3 | Strictness map | adopted at Gate 4 (2026-10-23); awaiting Eddie | board | Eddie | Gate 4 |', True),
    ('| K3 | Strictness map | built, unconfirmed | board | Eddie | Gate 4 |', True),
    ('| K3 | Strictness map | adopted, Eddie ratifies it later | board | Eddie | Gate 4 |', True),
    ('| L3 | Web margins | open | breakpoints null | Eddie | Gate four |', True),
    ('| L3 | Web margins | open | breakpoints null | Eddie | G4 |', True),
    ('| L3 | Web margins | open | breakpoints null | Eddie | the fourth gate |', True),
    ('| L3 | Web margins | open | breakpoints null | Eddie | Review two |', True),
    ('| K3 | Strictness map | adopted at Gate 4 (2026-10-23); ratified 2026-10-23 by Eddie | board | Eddie | Gate 4 |', False),
    ('| L3 | Web margins | open | breakpoints null | Eddie | Gate five |', False),
]
def plan_state(prog):
    """Closed gates, Reviews (open or held), Steps (open unless every box is ticked) and the plan's lines."""
    lines = norm(prog).split('\n')
    closed = sorted({int(n) for n in re.findall(r'- \[x\] \*\*Gate (\d)\*\*', prog)} | {int(n) for n in re.findall(r'\*\*Gate (\d)\*\* closed', prog)})
    reviews, steps, cur = {}, {}, None
    for l in lines:
        m = re.match(r'- (\[[ x]\] )?Review (\d+)\b', l)
        if m: reviews[int(m.group(2))] = not (m.group(1) == '[x] ' or re.search(r'\bheld\b', l.split(':')[0], A))
        h = re.match(r'## Step (\d+[a-z]?)\.', l)
        if h: cur = h.group(1).lower(); steps[cur] = []; continue
        if l.startswith('## '): cur = None; continue
        if cur and re.match(r'- \[[ x]\]', l): steps[cur].append(l.startswith('- [x]'))
    return {'closed': closed, 'reviews': reviews, 'steps': {k: (not v or not all(v)) for k, v in steps.items()}, 'lines': lines}
def closed_line(l, P):
    if l.startswith('- [x]'): return True
    m = re.match(r'- (?:\[[ x]\] )?Review (\d+)\b', l)
    return bool(m) and not P['reviews'].get(int(m.group(1)), True)
OPEN_ANY = (r'\b(?:to (?:be )?(?:confirm|confirmed|ratify|ratified|rule|ruled|decide|decided|settle|settled)|await(?:s|ing|ed)?|'
            r'un(?:confirmed|ratified|ruled|resolved|decided|settled)|not yet|pending|later|tbd|tbc|subject to)\b')
NUMW = {w: i + 1 for i, w in enumerate('one two three four five six seven eight nine'.split())}
ORDW = {w: i + 1 for i, w in enumerate('first second third fourth fifth sixth seventh eighth ninth'.split())}
def named(kind, bare):
    """The numbers a step cell gives a gate, review or step: in digits or words, before or after the kind (G4 too)."""
    word = '|'.join(NUMW)
    out = [m.group(1) if m.group(1)[0].isdigit() else str(NUMW[m.group(1).lower()])
           for m in re.finditer(r'\b%s (\d+[a-z]?|%s)\b' % (kind, word), bare, A)]
    out += [str(ORDW[m.group(1).lower()]) for m in re.finditer(r'\b(%s) %s\b' % ('|'.join(ORDW), kind), bare, A)]
    if kind == 'gate': out += re.findall(r'\bG(\d)\b', bare, A)
    return out
def quote_lines(q, P):
    """The PROGRESSION lines a quoted step names: as written, else without parentheticals, else by its Review number."""
    hits = [l for l in P['lines'] if q in l]
    if hits: return hits
    drop = lambda x: re.sub(r' *\([^)]*\)', '', x)
    hits = [l for l in P['lines'] if drop(q).strip() and drop(q).strip() in drop(l)]
    if hits: return hits
    m = re.match(r'review (\d+)\b', q.strip(), A)
    return [l for l in P['lines'] if m and re.match(r'- (?:\[[ x]\] )?Review %s\b' % m.group(1), l)]
def row_open(state):
    s = norm(state).strip(); parts = [p.strip() for p in s.split(';')]
    if re.search(OPEN_ANY, s, A): return True
    if any(re.match(r'(?:open|pending|conflict|conditional|flagged|unresolved|measured|not (?:set|received|named))\b', p, A) or re.search(r'\bopen$', p, A) for p in parts): return True
    return not re.search(r'\b(?:ruled|ratified|adopted|closed|moot|built|resolved)\b', parts[0], A)
def step_closed(cell, P, today):
    """Why an open row's step has closed, or None."""
    s = norm(cell).strip()
    if s.lower() == 'none': return None
    quotes = re.findall(r'`([^`]+)`', s)
    for q in quotes:
        hits = quote_lines(q, P)
        if not hits: return 'quotes a plan line PROGRESSION.md does not have (`%s`)' % q[:60]
        if all(closed_line(l, P) for l in hits): return 'quotes a closed plan line (`%s`)' % q[:60]
    bare = re.sub(r'\([^)]*\)', ' ', re.sub(r'`[^`]*`', ' ', s)).strip(' ,;:')
    if not bare and not quotes: return 'is empty'
    for g in named('gate', bare):
        if g.isdigit() and int(g) in P['closed']: return 'names Gate %s, which has closed' % g
    for r in named('review', bare):
        if not r.isdigit(): continue
        if int(r) not in P['reviews']: return 'names Review %s, which has no line in PROGRESSION.md' % r
        if not P['reviews'][int(r)]: return 'names Review %s, which has been held' % r
    for k in named('step', bare):
        if P['steps'].get(k.lower()) is False: return 'names Step %s, whose boxes are all ticked' % k
    for d in re.findall(r'\b(20\d\d-\d\d-\d\d)\b', bare, A):
        if datetime.date.fromisoformat(d) < today: return 'names %s, which has passed' % d
    return None
def registers(text, P, today, head=None):
    """Rule 1 over one file's text: (line, message) for every open register row whose step has closed."""
    lines, out, i = norm(text).split('\n'), [], 0
    while i < len(lines):
        if head is None and not (lines[i].startswith('|') and i + 1 < len(lines) and re.match(r'^\|[-:| ]+\|$', lines[i + 1].strip())):
            i += 1; continue
        cols = [c.strip().lower() for c in re.sub(r'^\|+|\|+$', '', (head or lines[i]).strip()).split('|')]
        st = next((k for k, h in enumerate(cols) if h in ('status', 'state')), None)
        sp = next((k for k, h in enumerate(cols) if h in ('step', 'closes at')), None)
        ow = next((k for k, h in enumerate(cols) if h == 'owner'), None)
        j = i if head else i + 2
        while j < len(lines) and lines[j].startswith('|'):
            if st is not None and sp is not None:
                row = [c.strip() for c in re.sub(r'^\|+|\|+$', '', lines[j].strip()).split('|')]
                if len(row) != len(cols): out.append((j + 1, 'a row of %d cells under a %d-column register header' % (len(row), len(cols))))
                elif not (ow is not None and row[ow].lower() == 'none') and row_open(row[st]):
                    why = step_closed(row[sp], P, today)
                    if why: out.append((j + 1, '%s is open (%s), but its step %s' % (row[0], row[st][:70], why)))
            j += 1
        i = j if head is None else len(lines)
    return out
def selftest():
    bad = [(t, m) for t, m in CASES if bool(promises(t, [1, 2, 3, 4])) != m]
    for t, m in bad: print('  self-test: should %s: %s' % ('fail' if m else 'pass', t))
    P = plan_state(REGISTER_PLAN); today = datetime.date(2026, 10, 23)
    for t, m in REGISTER_CASES:
        if bool(registers(t, P, today, head=REGISTER_HEAD)) != m: bad.append(t); print('  register self-test: should %s: %s' % ('fail' if m else 'pass', t))
    return not bad
if __name__ == '__main__':
    home = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '.'
    if '--cases-json' in sys.argv: print(json.dumps(CASES, ensure_ascii=False)); sys.exit(0)
    if '--fuzz-json' in sys.argv:  # seeded lines mixing the rule's words with no-break and other spaces and non-ASCII letters
        import random; rnd = random.Random(7)
        W = ['Gate 4', 'gate 2', 'Gate\xa03', 'Gate\u20024', 'at', 'At', 'until', 'named', 'set', 'ratified', 'by', 'Eddie', 'is', 'are', 'to', 'be',
             'get', 'the', 'a', 'decision', 'call', 'item', 'for', 'which', 'adopted', 'on', '2026-10-23', '(2026-10-23)', 'pending', 'once', 'closes',
             'Gate 4\u2019s', '\xe9', '\xe9tablis', '\u0130s', '\u212a', 'not yet binding', 'draft', 'proposal', 'comes', 'waits', 'when', '|', 'open',
             'to confirm', 'Gate 4 (names)', '[derived]', 'ruled', ',', '.', ';', ':', '\u2028', '\ufeff', '\x85', 'Review 2', 'with', 'left',
             '\u0661\u0662', 'is\xa0named', '\u017fet']
        lines = []
        for _ in range(5000):
            t = ' '.join(rnd.choice(W) for _ in range(rnd.randint(2, 14)))
            if rnd.random() < 0.2: t = '| ' + t + ' | Gate 4 |'
            lines.append([t, len(promises(t, [1, 2, 3, 4]))])
        print(json.dumps(lines, ensure_ascii=False)); sys.exit(0)
    if not selftest(): print('FAIL (self-test)'); sys.exit(2)
    if '--test' in sys.argv: print('self-test: %d prose cases and %d register cases, all as expected' % (len(CASES), len(REGISTER_CASES))); sys.exit(0)
    P = plan_state(open(os.path.join(home, 'PROGRESSION.md'), encoding='utf-8').read()); closed = P['closed']
    files = []
    for root, ds, fs in os.walk(os.path.join(home, 'brand-pack')):
        files += [os.path.join(root, f) for f in fs if f.endswith(('.md', '.json', '.yaml', '.yml'))]
    files.append(os.path.join(home, 'outputs', 'step-4-figma', 'review-2-package.md'))
    hits, regs, verdicts, today = [], [], [], datetime.date.today()
    for f in sorted(files):
        if not os.path.exists(f): continue
        text, rel = open(f, encoding='utf-8').read(), os.path.relpath(f, home)
        for i, line in enumerate(text.split('\n'), 1):
            found = promises(line, closed)
            if re.search(r'\bgate \d\b', norm(line), A): verdicts.append([line, len(found)])
            for c in found: hits.append('%s:%d: %s' % (rel, i, c[:160]))
        if f.endswith('.md'): regs += ['%s:%d: %s' % (rel, n, msg) for n, msg in registers(text, P, today)]
    if '--verdicts-json' in sys.argv: print(json.dumps({'closed': closed, 'lines': verdicts}, ensure_ascii=False)); sys.exit(0)
    print('closed gates %s; %d files; %d clause(s) promise a closed gate\'s work; %d open register row(s) name a closed step' % (closed, len(files), len(hits), len(regs)))
    for h in hits + regs: print('  ' + h)
    sys.exit(1 if hits or regs else 0)
