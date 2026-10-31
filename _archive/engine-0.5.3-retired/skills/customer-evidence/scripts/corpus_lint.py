#!/usr/bin/env python3
"""
corpus_lint.py — run BEFORE coding. Builds the source-collapse map and flags integrity problems.

The single most common failure in customer research is counting quotes instead of sources.
This prints the numbers that prevent it, plus the integrity issues that invalidate a corpus quietly.

TWO NUMBERS, NOT ONE. A venue is not a voice. Four different people reviewing one product page
are four speakers in one venue: reporting that as "1 source" suppresses a real pattern, and
reporting it as "4 sources" invents independence. Earlier versions collapsed on venue alone and
called the result independent sources, which was wrong in both directions — one prolific poster
across three threads counted as three. Promotion from lead to finding gates on SPEAKERS.

Corpus format (markdown):
    **1.** "the customer's exact words"
    *— source identifier, date | speaker:u/alice | class:forum | register:neutral | audience:declared*

Everything after the first `|` is optional metadata. `speaker:` is what makes the speaker count
real; without it an item is treated as its own unidentified speaker and reported as unattributed.

or JSON: [{"id":1,"quote":"…","source":"…","speaker":"…","venue_class":"…",
           "register":"…","audience":"declared|inferred"}, …]

Usage:
    python3 corpus_lint.py CORPUS --brand-domains a.com,b.com \
        [--months N] [--frame] [--mode full|quick] [--sensitive a,b,c] [--json]
    python3 corpus_lint.py CORPUS --pack <brand pack folder> [...]

--brand-domains is REQUIRED unless --pack (or --brand-context / --brand) supplies it: the pack's
File map `brand_domains` is the written declaration, and `recency_months` sets the window when
--months is not given. Passing it empty is an explicit choice you have to make in writing: the
check that catches your own marketing sitting in your customer evidence cannot default to off.

Exit code 1 if any ERROR-level problem is found.
"""
import re, sys, json, argparse, unicodedata, hashlib, os
from datetime import datetime as _dt

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "lib"))
if os.environ.get("CLAUDE_PLUGIN_ROOT"):
    sys.path.insert(0, os.path.join(os.environ["CLAUDE_PLUGIN_ROOT"], "lib"))
from collections import defaultdict, Counter
from datetime import datetime


SCRIPT = "corpus_lint"


def die(msg, code=2):
    """One failure shape across the suite: what went wrong, what it costs, what to do.
    Exit 2 = could not start, exit 1 = ran and found a problem.
    See email-copy/references/script-conventions.md."""
    print(f"{SCRIPT}: {msg}", file=sys.stderr)
    sys.exit(code)


LINT_VERSION = "2026-07-27"
MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split()
MONTH_RE = "|".join(MONTHS)

# Accepts straight or typographic quotes: ordinary scraped text carries curly quotes, and a
# parser that only knows " silently drops those items and lets the survivor swallow the next
# item's citation.
ITEM_RE = re.compile(r'\*\*(\d+)\.\*\*\s*["\u201c](.+?)["\u201d]\s*\n\*—\s*(.+?)\*', re.S)
CANDIDATE_RE = re.compile(r'^\s*\*\*(\d+)\.\*\*', re.M)


def parse_meta(src):
    """Split 'venue, date | speaker:x | class:y' into (citation, {meta})."""
    parts = [p.strip() for p in src.split("|")]
    meta = {}
    for p in parts[1:]:
        if ":" in p:
            k, v = p.split(":", 1)
            meta[k.strip().lower()] = v.strip()
    return parts[0], meta


def load(path):
    """Return (items, problems). Never silently drops an item."""
    raw = open(path, encoding="utf-8").read()
    problems = []
    if raw.lstrip().startswith("["):
        data = json.loads(raw)
        items = []
        for d in data:
            items.append((int(d["id"]), d["quote"], d.get("source", ""), {
                "speaker": d.get("speaker"), "class": d.get("venue_class"),
                "register": d.get("register"), "audience": d.get("audience")}))
        return items, problems

    items = []
    for m in ITEM_RE.finditer(raw):
        cit, meta = parse_meta(m.group(3).strip())
        items.append((int(m.group(1)), m.group(2).strip(), cit, meta))

    # Reconciliation: anything that looks like an item must have parsed as one.
    declared = [int(x) for x in CANDIDATE_RE.findall(raw)]
    parsed = [i for i, *_ in items]
    if len(declared) != len(parsed):
        lost = sorted(set(declared) - set(parsed))
        problems.append(
            f"{len(declared)} items declared in the file, {len(parsed)} parsed"
            + (f" — item(s) {lost} did not parse" if lost else "")
            + ". Most often an unbalanced quote mark or a curly-quoted item. A dropped item is a "
              "silently smaller corpus and the survivor may absorb the next item's citation.")
    dupes = [i for i, c in Counter(parsed).items() if c > 1]
    if dupes:
        problems.append(f"duplicate item numbers: {sorted(dupes)} — counts and citations will be wrong")
    if parsed:
        gaps = sorted(set(range(min(parsed), max(parsed) + 1)) - set(parsed))
        if gaps:
            problems.append(f"gaps in item numbering: {gaps} — items may have been removed after ingest")
    return items, problems


def parse_date(src):
    m = re.search(r'\b([A-Za-z]{3})[a-z]*\.?\s+(\d{4})\b', src)
    if m and m.group(1).lower() in MONTHS:
        return MONTHS.index(m.group(1).lower()) + 1, int(m.group(2))
    m = re.search(r'\b(20\d{2})\b', src)
    return (None, int(m.group(1))) if m else (None, None)


# A date tail needs a month name, or a comma before the year. A bare number after a slash is a
# thread id, not a date: /thread/2019 and /thread/2020 are different venues and must not merge.
MONTH_TAIL = re.compile(
    r'[\s,;(\[|]+(?:[—–-]\s*)?(?:' + MONTH_RE + r')[a-z]*\.?\s*(?:\d{1,2},?\s*)?(?:19|20)\d{2}[\s,;)\].]*$', re.I)
COMMA_YEAR_TAIL = re.compile(r',\s*(?:\d{1,2}\s+)?(?:19|20)\d{2}[\s,;)\].]*$')
NOISE_TAIL = re.compile(r'/(?:ref|dp/[^/]+/ref)=[^/]*$', re.I)


def source_key(s):
    """Normalise a citation string to the thing that identifies the VENUE."""
    k = unicodedata.normalize("NFKC", s).strip().lower()
    prev = None
    while k != prev:
        prev = k
        k = MONTH_TAIL.sub("", k).strip()
        k = COMMA_YEAR_TAIL.sub("", k).strip()
    k = re.sub(r'^\s*(?:—|–|-)\s*', '', k)
    k = re.sub(r'^https?://', '', k)
    k = re.sub(r'^www\.', '', k)
    k = k.split('?')[0].split('#')[0]
    k = NOISE_TAIL.sub('', k)
    k = re.sub(r'[\s,;./|]+$', '', k)
    k = re.sub(r'\s+', ' ', k)
    return k or s.strip().lower()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("corpus")
    ap.add_argument("--brand-domains",
                    help="comma-separated first-party domains. REQUIRED unless --pack supplies them. "
                         "Pass 'none' to declare in writing that the brand publishes nothing that "
                         "could reach this corpus.")
    ap.add_argument("--pack", help="the brand pack folder; its File map's brand_domains and recency_months apply")
    ap.add_argument("--brand-context", help="path to brand-context.md (wins over --pack)")
    ap.add_argument("--brand", help="a registered brand name or alias (brands/registry.yaml)")
    ap.add_argument("--registry")
    ap.add_argument("--months", type=int, default=None)
    ap.add_argument("--frame", action="store_true",
                    help="also require venue class, query register and audience tag on every item")
    ap.add_argument("--sensitive", default="health,medication,diagnosis,prescription,therapy,"
                    "depression,anxiety,pregnan,postpartum,disorder,addiction,bankrupt,debt,"
                    "eviction,immigration,my son,my daughter,my kid,my child",
                    help="comma-separated markers that make an item special-category. An item "
                         "matching one is treated as never_quotable whether or not it was tagged, "
                         "unless the item carries an explicit `never_quotable:no`, which records "
                         "that a person read it and judged it ordinary.")
    ap.add_argument("--mode", choices=("full", "quick"), default="full",
                    help="which pass this run belongs to. Recorded in the provenance block so a "
                         "quick pass cannot be mistaken for a full one months later. Quick is one "
                         "analysis and one refutation lens; its output is labelled candidate.")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    pack_source = None
    if a.brand_context or a.pack or a.brand:
        try:
            from pack import PackError, resolve_context
            ctx = resolve_context(a)
        except ImportError as e:
            die(f"the shared module lib/pack.py is not beside this plugin ({e}).")
        except PackError as e:
            die(str(e))
        fm = ctx["file_map"]
        pack_source = ctx["brand_context"]
        if a.brand_domains is None:
            bd = fm.get("brand_domains")
            if isinstance(bd, list):
                a.brand_domains = ",".join(str(x) for x in bd) if bd else "none"
            elif isinstance(bd, str):
                a.brand_domains = bd
            else:
                die(f"the brand context at {pack_source} declares no `brand_domains`, so the first-party\n"
                    "  check has nothing to run against. Add the role (a list of domains, or [] to declare in\n"
                    "  writing that the brand publishes nothing that could reach this corpus), or pass --brand-domains.")
        if a.months is None and isinstance(fm.get("recency_months"), int):
            a.months = fm["recency_months"]
    if a.brand_domains is None:
        die("--brand-domains is required (or --pack <folder> whose File map declares brand_domains).\n"
            "  The check that catches the brand's own marketing sitting in its customer evidence cannot\n"
            "  default to off. Pass the real domains, or 'none' as a written declaration.")
    if a.months is None:
        a.months = 12

    if not os.path.exists(a.corpus):
        die(f"no corpus at {a.corpus}\n"
            "  This is the file of customer items the whole run is built from — one verbatim, one\n"
            "  venue identifier and one date per item. Nothing downstream can run without it.\n"
            "  Check the path, or see the corpus format at the top of this script.")
    try:
        items, parse_problems = load(a.corpus)
    except json.JSONDecodeError as e:
        die(f"the corpus at {a.corpus} looks like JSON and will not parse: {e.msg} (line {e.lineno}).\n"
            "  A corpus is either a markdown item list or a JSON array — not a mix.")
    except (OSError, UnicodeDecodeError) as e:
        die(f"cannot read the corpus at {a.corpus} ({e}).")
    except (KeyError, ValueError) as e:
        die(f"the corpus at {a.corpus} parsed but an item is missing a required field ({e}).\n"
            "  JSON items need at least id and quote; markdown items need the **n.** \"quote\"\n"
            "  and *— source* shape.")
    if not items:
        print("ERROR: no items parsed — check the corpus format", file=sys.stderr); sys.exit(1)
    brands = [] if a.brand_domains.strip().lower() in ("none", "") else \
        [d.strip().lower() for d in a.brand_domains.split(",") if d.strip()]

    by_venue, raw_by_key = defaultdict(list), defaultdict(set)
    by_speaker, unattributed = defaultdict(list), []
    for i, q, s, meta in items:
        k = source_key(s)
        by_venue[k].append(i); raw_by_key[k].add(s)
        sp = (meta.get("speaker") or "").strip()
        if sp:
            by_speaker[sp.lower()].append(i)
        else:
            unattributed.append(i)

    # S1.4 — `never_quotable` existed in prose and in zero scripts, so special-category material
    # had no mechanical barrier between the corpus and a slide. The tag is now read, and inferred
    # where it was not applied, and the ids are handed to verify_quotes.py.
    markers = [m.strip().lower() for m in a.sensitive.split(",") if m.strip()]
    never_quotable, inferred, cleared_by_hand = [], [], []
    for i, q, s, meta in items:
        raw = str(meta.get("never_quotable", "")).strip().lower()
        tagged = raw in ("1", "true", "yes", "y")
        released = raw in ("0", "false", "no", "n")
        hits = [m for m in markers if m in q.lower()]
        # A keyword cannot tell "my kid's school project" from "my kid's diagnosis", and a check
        # that over-blocks gets switched off — which is worse than one that never ran. So the
        # inference is overridable, but only in writing and only in the corpus: `never_quotable:no`
        # on an item records that a person read it and judged it ordinary. The count of such
        # overrides is reported, because an override nobody can see is the same as no rule.
        if released and not hits:
            continue
        if released and hits:
            cleared_by_hand.append((i, hits[0]))
            continue
        if tagged or hits:
            never_quotable.append(i)
            if not tagged and hits:
                inferred.append((i, hits[0]))

    errors, warns = [], []
    for p in parse_problems:
        errors.append((0, "CORPUS PARSE", p))

    for i, q, s, meta in items:
        low = s.lower()
        if any(b in low for b in brands):
            errors.append((i, "BRAND COPY", f"source is first-party ({s}) — not customer evidence at any strength"))
        if re.search(r'\[[^\]]+\]', q):
            errors.append((i, "REPAIRED QUOTE", "contains a bracketed insertion — no longer a verbatim, cannot anchor a theme"))
        mo, yr = parse_date(s)
        if yr is None:
            warns.append((i, "NO DATE", f"cannot age this item ({s})"))
        else:
            now = datetime.now()
            age = (now.year - yr) * 12 + (now.month - (mo or now.month))
            if age > a.months:
                warns.append((i, "OUTSIDE WINDOW", f"~{age} months old (window {a.months})"))
        if len(q.split()) < 4:
            warns.append((i, "FRAGMENT", "under four words — too thin to carry a code"))
        if a.frame:
            for field, label in (("class", "venue class"), ("register", "query register"), ("audience", "audience tag")):
                if not meta.get(field):
                    errors.append((i, "FRAME FIELD", f"no {label} — the ratified sampling frame requires it on every item"))
            if meta.get("audience") and meta["audience"].lower() not in ("declared", "inferred"):
                errors.append((i, "FRAME FIELD", f"audience must be 'declared' or 'inferred', got '{meta['audience']}'"))

    if unattributed:
        warns.append((0, "NO SPEAKER", f"{len(unattributed)} of {len(items)} items carry no speaker id; each is "
                                       "counted as its own unidentified speaker, so the speaker count is an "
                                       "upper bound. Add `| speaker:…` at ingest to make it real."))

    venue_collapses = {s: ids for s, ids in by_venue.items() if len(ids) > 1}
    speaker_collapses = {s: ids for s, ids in by_speaker.items() if len(ids) > 1}
    n_items = len(items)
    n_venues = len(by_venue)
    n_speakers = len(by_speaker) + len(unattributed)

    raw_bytes = open(a.corpus, "rb").read()
    provenance = {
        "corpus_file": os.path.basename(a.corpus),
        "corpus_sha256": hashlib.sha256(raw_bytes).hexdigest()[:16],
        "corpus_bytes": len(raw_bytes),
        "lint_version": LINT_VERSION,
        "run_at": _dt.now().isoformat(timespec="seconds"),
        "mode": a.mode,
        "output_label": "candidate" if a.mode == "quick" else "validated",
        "note": ("A finding is only as traceable as the corpus behind it. Quote this block in the "
                 "output: months later it is the only way to tell whether a claim came from this "
                 "corpus or an edited one."),
    }
    # INSUFFICIENT-INPUT: the check could not run, which is not the same as passing. This is the
    # non-expert's default state — no speaker tags, no declared first-party domains — and the old
    # binary verdict reported it as PASS.
    insufficient = []
    if not by_speaker:
        insufficient.append("no item carries a `speaker:` tag, so the speaker count is just the item "
                            "count. Promotion from lead to finding gates on speakers, so that gate is "
                            "not backed by anything. Tag speakers at ingest or state in the output that "
                            "no speaker-level claim can be made.")
    if not brands:
        insufficient.append("no first-party domains declared, so the check that catches your own "
                            "marketing sitting in your customer evidence did not run. Pass "
                            "--brand-domains with the real domains, or accept that this corpus is "
                            "unchecked for brand copy.")

    if inferred:
        warns.append((0, "SENSITIVE", f"{len(inferred)} item(s) read as special-category and were "
                     f"NOT tagged never_quotable at ingest (e.g. item {inferred[0][0]}: "
                     f"\"{inferred[0][1]}\"). They are treated as never_quotable regardless. "
                     "Tag them at ingest so the judgement is a person's, not a keyword's — or "
                     "tag `never_quotable:no` if you have read it and it is ordinary."))
    if cleared_by_hand:
        warns.append((0, "SENSITIVE OVERRIDE", f"{len(cleared_by_hand)} item(s) match a "
                     f"special-category marker but carry `never_quotable:no` "
                     f"(e.g. item {cleared_by_hand[0][0]}, on \"{cleared_by_hand[0][1]}\"). "
                     "A person cleared these; they are quotable. Listed here so the decision is "
                     "visible to anyone auditing the corpus."))

    payload = {
        "provenance": provenance,
        "insufficient_input": insufficient,
        "never_quotable": sorted(never_quotable),
        "never_quotable_inferred": [{"item": i, "marker": m} for i, m in inferred],
        "never_quotable_overridden": [{"item": i, "marker": m} for i, m in cleared_by_hand],
        "items": n_items, "venues": n_venues, "speakers": n_speakers,
        "speakers_identified": len(by_speaker), "items_without_speaker": len(unattributed),
        "venue_collapses": {s: ids for s, ids in venue_collapses.items()},
        "speaker_collapses": {s: ids for s, ids in speaker_collapses.items()},
        "brand_domains_checked": brands,
        "errors": [{"item": i, "kind": k, "detail": d} for i, k, d in errors],
        "warnings": [{"item": i, "kind": k, "detail": d} for i, k, d in warns],
        "verdict": "FAIL" if errors else ("INSUFFICIENT-INPUT" if insufficient else "PASS"),
    }

    if a.json:
        print(json.dumps(payload, indent=1))
    else:
        print("=" * 62); print("CORPUS LINT"); print("=" * 62)
        print(f"corpus: {provenance['corpus_file']}  sha256:{provenance['corpus_sha256']}  "
              f"lint {LINT_VERSION}  run {provenance['run_at']}  mode:{a.mode}")
        print("  Quote this line in the output. It is what lets a reader tell months later")
        print("  whether a finding came from this corpus or from an edited one.")
        if a.mode == "quick":
            print("  QUICK PASS — one analysis, one refutation lens, no variance. Every theme in")
            print("  the output is a CANDIDATE theme and must be written as one. Promoting a")
            print("  candidate to a finding means running the full pass, not relabelling it.")
        print("-" * 62)
        print(f"items: {n_items}    distinct speakers: {n_speakers}    venues: {n_venues}")
        print()
        print("  SPEAKERS is the number that gates a finding. VENUES is a concentration")
        print("  diagnostic — it tells you how much of this came from how few places.")
        if len(by_speaker):
            print(f"  {len(by_speaker)} identified speaker(s); {len(unattributed)} item(s) unattributed and counted singly.")
        else:
            print("  No speaker ids in this corpus: the speaker count is an upper bound only.")
        if n_items != n_venues:
            pct = 100 * (n_items - n_venues) / n_items
            print(f"  {n_items - n_venues} items share a venue with another ({pct:.0f}% concentration).")
        print("-" * 62)
        print("VENUE CONCENTRATION" if venue_collapses else "VENUE CONCENTRATION: none — every item is its own venue")
        for s, ids in sorted(venue_collapses.items(), key=lambda kv: -len(kv[1])):
            flag = "   <-- one venue; check whether these are different people" if len(ids) >= 3 else ""
            print(f"  {len(ids)} items -> 1 venue: {sorted(ids)}  [{s}]{flag}")
            if len(raw_by_key[s]) > 1:
                print(f"      (cited {len(raw_by_key[s])} different ways — matched after normalising)")
        if speaker_collapses:
            print("-" * 62)
            print("SAME SPEAKER, MULTIPLE ITEMS — these are one voice however many venues they span")
            for s, ids in sorted(speaker_collapses.items(), key=lambda kv: -len(kv[1])):
                print(f"  {len(ids)} items -> 1 speaker: {sorted(ids)}  [{s}]")
        if never_quotable:
            print("-" * 62)
            print(f"NEVER QUOTABLE ({len(never_quotable)}) — special-category; read and count, never quote")
            print(f"  items: {sorted(never_quotable)}")
            if cleared_by_hand:
                print(f"  plus {len(cleared_by_hand)} matched and cleared by hand "
                      f"(never_quotable:no): {sorted(i for i, _ in cleared_by_hand)}")
            print("  Pass this run's --json to verify_quotes.py --exclusions so quoting one is an error.")
        print("-" * 62)
        print(f"ERRORS ({len(errors)}) — fix or exclude before coding" if errors else "ERRORS (0)")
        for i, k, d in errors:
            print(f"  item {i:>3}  {k:<16} {d}" if i else f"  {'':>8}  {k:<16} {d}")
        print(f"WARNINGS ({len(warns)})")
        for i, k, d in warns:
            print(f"  item {i:>3}  {k:<16} {d}" if i else f"  {'':>8}  {k:<16} {d}")
        if insufficient:
            print("-" * 62)
            print("COULD NOT CHECK — these are not passes\n")
            for s in insufficient:
                print(f"  · {s}\n")
        print("=" * 62)
        print("RESULT: FAIL — resolve errors before analysis" if errors else
              ("RESULT: INSUFFICIENT-INPUT — the corpus is not disqualified, but the checks above "
               "did not run.\n        Do not describe this corpus as validated." if insufficient
               else "RESULT: PASS"))
        print("\nStill required, and not checkable by script:")
        print("  - the negative scope statement: what can this corpus NOT speak to?")
        print("  - a valence slot: where will material reporting that something WORKED go?")
        if not brands:
            print("  - you declared no first-party domains. If the brand publishes reviews or")
            print("    testimonials anywhere, that decision is wrong and nothing here will catch it.")
    sys.exit(1 if (errors or insufficient) else 0)


if __name__ == "__main__":
    main()
