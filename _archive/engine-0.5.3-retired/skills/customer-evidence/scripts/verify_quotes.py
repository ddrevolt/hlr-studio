#!/usr/bin/env python3
"""
verify_quotes.py — run AFTER analysis. Checks every quoted string against the corpus.

Attribution error (right quote, wrong source) is a larger practical risk than fabrication,
especially where reviewer, moderator, brand reply and quoted third party interleave. This
checks both, so "zero fabrications, zero attribution errors" becomes a claim you can make.

FAILS CLOSED. The previous version paired quote marks even/odd, so a single stray mark — an
inch measurement, an unbalanced apostrophe — shifted every pair by one, re-read the prose
BETWEEN quotations as the quotations, silently skipped the fabrication it was pointed at, and
printed PASS. This version refuses to guess: ambiguous quoting is reported and exits non-zero.

Recognised citation forms:
    "words" (item 12) | "words" (12) | "words" [12] | "words" — item 12
    "words" (items 4, 15) | "words" (item 10, Mar 2026)

Usage:
    python3 verify_quotes.py CORPUS ANALYSIS [--exclusions lint.json] [--min-len N] [--json]
Exit 1 if any quote is unverifiable, quoting is ambiguous, or an excluded item is quoted.
"""
import re, sys, json, os, argparse, unicodedata


SCRIPT = "verify_quotes"


def die(msg, code=2):
    """One failure shape across the suite: what went wrong, what it costs, what to do.
    Exit 2 = could not start, exit 1 = ran and found a problem.
    See email-copy/references/script-conventions.md."""
    print(f"{SCRIPT}: {msg}", file=sys.stderr)
    sys.exit(code)


SMART_OPEN, SMART_CLOSE = "“", "”"


def load_corpus(path):
    raw = open(path, encoding="utf-8").read()
    if raw.lstrip().startswith("["):
        return {int(d["id"]): d["quote"] for d in json.loads(raw)}
    return {int(m.group(1)): m.group(2).strip()
            for m in re.finditer(r'\*\*(\d+)\.\*\*\s*"(.+?)"\s*\n\*—', raw, re.S)}


def norm(s):
    s = unicodedata.normalize("NFKC", s)
    for a, b in [("’", "'"), ("‘", "'"), (SMART_OPEN, '"'), (SMART_CLOSE, '"'), ("—", "--")]:
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", s).strip()


def extract_quotes(text):
    """Return (spans, problems).

    spans: [(quote_text, end_index)] — end_index is where the closing mark sat, for citation lookup.
    problems: human-readable strings describing anything that could not be parsed unambiguously.

    Typographic pairs are unambiguous and are taken first. Straight marks are then scanned with
    inch-marks (a mark immediately preceded by a digit) excluded; if what remains is odd, the
    document is reported as ambiguous rather than mispaired.
    """
    spans, problems = [], []
    consumed = [False] * (len(text) + 1)

    for m in re.finditer(SMART_OPEN + r'(.*?)' + SMART_CLOSE, text, re.S):
        spans.append((m.group(1), m.end()))
        for i in range(m.start(), m.end()):
            consumed[i] = True

    n_open = text.count(SMART_OPEN)
    n_close = text.count(SMART_CLOSE)
    if n_open != n_close:
        problems.append(f"unbalanced typographic quotes: {n_open} opening, {n_close} closing")

    raw_marks = [m.start() for m in re.finditer(r'"', text)]
    marks, inch = [], []
    for i in raw_marks:
        if consumed[i]:
            continue
        if i > 0 and text[i - 1].isdigit():
            inch.append(i)          # 0.4" nozzle, 6" pan — a measurement, not a quotation
            continue
        marks.append(i)

    if len(marks) % 2:
        problems.append(
            f"odd number of straight quote marks ({len(marks)}) after excluding "
            f"{len(inch)} measurement mark(s). Quoting is ambiguous and cannot be verified — "
            "balance the marks or use typographic quotes.")
    else:
        for o, c in zip(marks[0::2], marks[1::2]):
            spans.append((text[o + 1:c], c))

    spans.sort(key=lambda s: s[1])
    return spans, problems


CITE = re.compile(
    r'\s*(?:[\(\[]\s*(?:items?\s*)?(\d+)(?:\s*,\s*\d+)*[^)\]]*[\)\]]'   # (item 12) (12) [18] (items 4, 15) (item 10, Mar 2026)
    r'|[—–-]\s*items?\s*(\d+)\b)', re.I)                       # — item 13


def cited_ids(text, at):
    m = CITE.match(text, at)
    if not m:
        return None, None
    body = m.group(0)
    return [int(x) for x in re.findall(r'\d{1,4}', body)][:8] or None, m.end()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("corpus"); ap.add_argument("analysis")
    ap.add_argument("--exclusions", help="corpus_lint.py --json output; quoting an excluded item is an error")
    ap.add_argument("--min-len", type=int, default=12,
                    help="quotes shorter than this are reported separately, never silently dropped")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    for label, pth, why in (
            ("corpus", a.corpus, "the customer items every quote is checked against"),
            ("analysis", a.analysis, "the finished document whose quotes are being checked")):
        if not os.path.exists(pth):
            die(f"no {label} at {pth}\n"
                f"  That is {why}. Both are required — this script exists to compare them.\n"
                "  usage: verify_quotes.py CORPUS ANALYSIS --exclusions lint.json")
    try:
        corpus = load_corpus(a.corpus)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError, KeyError, ValueError) as e:
        die(f"cannot read the corpus at {a.corpus} ({e}).\n"
            "  Run corpus_lint.py on it first — it reports parse problems item by item.")
    if not corpus:
        die(f"no items parsed out of {a.corpus}.\n"
            "  Expected either a JSON array or markdown items shaped **1.** \"quote\" / *— source*.\n"
            "  Verifying against an empty corpus would pass everything, so this stops instead.")
    try:
        text = open(a.analysis, encoding="utf-8").read()
    except (OSError, UnicodeDecodeError) as e:
        die(f"cannot read the analysis at {a.analysis} ({e}).")

    excluded = {}
    n_never = 0
    if a.exclusions:
        try:
            lint = json.load(open(a.exclusions, encoding="utf-8"))
            for e in lint.get("errors", []):
                excluded.setdefault(int(e["item"]), []).append(e.get("kind", "excluded"))
            # S1.4 — special-category items are not "excluded from the corpus"; they are counted
            # and never quoted. Quoting one is the failure the ethics rules exist to prevent, and
            # until now nothing checked it.
            for i in lint.get("never_quotable", []):
                excluded.setdefault(int(i), []).append("NEVER QUOTABLE — special-category")
                n_never += 1
        except Exception as e:
            print(f"ERROR: --exclusions given but unreadable ({e}). Refusing to verify against "
                  "an unknown exclusion set.", file=sys.stderr)
            sys.exit(1)

    spans, problems = extract_quotes(text)

    found, uncited, tooshort, spanning = [], [], [], []
    for q, end in spans:
        if "\n\n" in q:
            spanning.append(q.strip()[:70]); continue
        if len(q.strip()) < a.min_len:
            tooshort.append(q.strip()); continue
        ids, _ = cited_ids(text, end + 1)
        if ids:
            found.append((q, ids))
        else:
            uncited.append((q, [k for k, v in corpus.items() if norm(q) in norm(v)]))

    ok, attrib, missing, from_excluded = [], [], [], []
    for q, ids in found:
        nq = norm(q)
        hit = next((n for n in ids if n in corpus and nq in norm(corpus[n])), None)
        if hit is not None:
            ok.append((hit, q))
            if hit in excluded:
                from_excluded.append((hit, q, excluded[hit]))
            continue
        elsewhere = [k for k, v in corpus.items() if nq in norm(v)]
        (attrib if elsewhere else missing).append((ids[0], q, elsewhere))

    insufficient = []
    if not found:
        insufficient.append(
            "no quoted string in this document carries an item citation, so nothing was verified. "
            "A findings document written entirely in paraphrase is legitimate — but it cannot be "
            "described as quote-verified, and this script has checked nothing.")

    unc_matched = [(q, w) for q, w in uncited if w]
    unc_unmatched = [(q, w) for q, w in uncited if not w]
    bad = len(attrib) + len(missing) + len(problems) + len(from_excluded)
    verdict = "FAIL" if bad else ("INSUFFICIENT-INPUT" if insufficient else "PASS")

    # A check that could not run must not read as one that passed. Without --exclusions this
    # script verifies wording and attribution and nothing else — in particular it does NOT
    # enforce never_quotable, which is the rule that keeps special-category material off a slide.
    exclusion_checking = (
        f"on — {len(excluded)} excluded item(s), {n_never} of them special-category"
        if a.exclusions else
        "OFF — no --exclusions given, so lint-disqualified and never_quotable items are NOT "
        "enforced here. Pass corpus_lint.py --json output to turn this on.")

    if a.json:
        print(json.dumps({
            "cited_checked": len(found), "verified": len(ok),
            "exclusion_checking": exclusion_checking,
            "parse_problems": problems,
            "attribution_errors": [{"cited": n, "actually": e, "quote": q} for n, q, e in attrib],
            "not_in_corpus": [{"cited": n, "quote": q} for n, q, _ in missing],
            "quoted_from_excluded_items": [{"item": n, "why": w, "quote": q} for n, q, w in from_excluded],
            "uncited_matching_corpus": [{"quote": q, "items": w} for q, w in unc_matched],
            "uncited_not_in_corpus": [q for q, _ in unc_unmatched],
            "below_min_length": tooshort, "spanning_paragraph_break": spanning,
            "insufficient_input": insufficient,
            "verdict": verdict}, indent=1))
    else:
        print("=" * 62); print("QUOTE VERIFICATION"); print("=" * 62)
        if problems:
            print("PARSE PROBLEMS — the document cannot be verified as written")
            for p in problems:
                print(f"    {p}")
            print("-" * 62)
        print(f"corpus items          : {len(corpus)}")
        print(f"exclusion checking    : {exclusion_checking}")
        print(f"quoted strings found  : {len(found) + len(uncited)}   "
              f"({len(found)} carry an item citation, {len(uncited)} do not)")
        print(f"  verified verbatim + correctly attributed : {len(ok)}")
        print(f"  ATTRIBUTION ERRORS (right quote, wrong item): {len(attrib)}")
        print(f"  NOT IN CORPUS (fabricated or altered)      : {len(missing)}")
        for n, q, e in attrib:
            print(f"    cited item {n}, text is actually item {e}  <<{q[:64]}>>")
        for n, q, _ in missing:
            print(f"    cited item {n}, not found anywhere       <<{q[:64]}>>")
        if from_excluded:
            print("-" * 62)
            print(f"QUOTED FROM EXCLUDED ITEMS ({len(from_excluded)}) — the lint disqualified these")
            for n, q, w in from_excluded:
                print(f"    item {n} ({', '.join(w)})  <<{q[:56]}>>")
        if uncited:
            print("-" * 62)
            print(f"UNCITED QUOTED STRINGS ({len(uncited)}) — outside the verified count above")
            for q, w in unc_matched:
                print(f"    corpus text, no item number (item {w[0] if len(w)==1 else w})  <<{q[:56]}>>")
            for q, _ in unc_unmatched:
                print(f"    NOT corpus text  <<{q[:56]}>>")
            if unc_unmatched:
                print("    ^ quotation marks around words that are not in the corpus. Analyst's own")
                print("      phrasing is fine; a paraphrase of an item presented as a quote is not.")
        if tooshort or spanning:
            print("-" * 62)
            if tooshort:
                print(f"BELOW MIN LENGTH ({len(tooshort)}) — not verified, and not counted as verified:")
                for q in tooshort[:8]:
                    print(f"    <<{q}>>")
            if spanning:
                print(f"SPANS A PARAGRAPH BREAK ({len(spanning)}) — not verified:")
                for q in spanning[:5]:
                    print(f"    <<{q}…>>")
        print("=" * 62)
        if insufficient:
            print("-" * 62)
            print("COULD NOT CHECK — this is not a pass\n")
            for s in insufficient:
                print(f"  · {s}")
        print("=" * 62)
        print(f"RESULT: FAIL — {bad} unverifiable" if bad else
              ("RESULT: INSUFFICIENT-INPUT — nothing was verified. Do not write "
               "\"every quote checked\"." if insufficient
               else "RESULT: PASS — every quote verbatim and correctly attributed"))
        if uncited or tooshort or spanning:
            n = len(uncited) + len(tooshort) + len(spanning)
            print(f"NOTE: {n} quoted strings are NOT in that verdict.")
            print('      Do not write "every quote was checked" while this number is above zero.')
    sys.exit(1 if (bad or insufficient) else 0)


if __name__ == "__main__":
    main()
