#!/usr/bin/env python3
"""
refute_packet.py — make refutation independence a procedure with a file boundary, not an adjective.

The skill has always said: the party that built a claim must not be the party that tries to break
it, because the builder knows what to protect. Until now that was an instruction in markdown and an
assertion in the artifact — an audit trail the process could not actually support. Nothing wrote
anything down, so "independent refutation" and "I reread my own work" produced identical prose.

This gives the claim a boundary you can point at:

  build   Write each claim BARE — label, organising concept, its cited items verbatim — to a
          timestamped packet file, and refuse to write one that carries build rationale. A refuter
          who can see the source counts, the confidence call, or which items were already argued
          over knows exactly what to protect, which is the failure this stage exists to prevent.

  check   Read the finished analysis. If it claims independent refutation, require the manifest id
          to appear in it and require every packet to still hash-match. A document asserting
          independence with no packet behind it is the thing that has to stop being possible.

Usage:
    python3 refute_packet.py build --corpus CORPUS --claims claims.json -o packets/ [--json]
    python3 refute_packet.py check ANALYSIS --manifest packets/manifest.json [--json]

claims.json — a list, each entry stated bare:
    [{"id": "C1",
      "label": "Noise is the dominant post-purchase complaint",
      "concept": "acoustic intrusion into shared living space",
      "items": [4, 15, 22]}]

Anything beyond id / label / concept / items is refused by name. That is the point of the file.

Exit 1 on a refusal, a leak, a missing item, or a failed check.
"""
import argparse, hashlib, json, os, re, sys, unicodedata
from datetime import datetime as _dt

PACKET_VERSION = "2026-07-27"


SCRIPT = "refute_packet"


def die(msg, code=2):
    """One failure shape across the suite: what went wrong, what it costs, what to do.
    Exit 2 = could not start, exit 1 = ran and found a problem.
    See email-copy/references/script-conventions.md."""
    print(f"{SCRIPT}: {msg}", file=sys.stderr)
    sys.exit(code)


ALLOWED_KEYS = {"id", "label", "concept", "items"}

# Structured keys that carry how the claim was built. Named individually so the refusal can say
# which one leaked rather than "invalid input".
BUILD_KEYS = {
    "why": "the rationale for the claim",
    "rationale": "the rationale for the claim",
    "notes": "working notes from the build",
    "analysis": "the analysis that produced it",
    "decisions": "the decisions log",
    "built_from": "how it was assembled",
    "sources": "the claimed source count",
    "source_count": "the claimed source count",
    "speakers": "the claimed speaker count",
    "confidence": "the confidence call",
    "disconfirming": "the disconfirming work already done",
    "variance": "twin-run variance",
    "method": "the method name",
    "mode": "the pass mode",
    "prevalence": "the prevalence figure",
    "quotes": "pre-selected quotes (the refuter reads the items, not your pick of them)",
    "contested": "which membership was already argued over",
}

# Free text says the same things in sentences. These are the phrasings that actually show up.
LEAK_RE = re.compile(
    r'\b(?:'
    r'high|medium|low)\s+confidence\b'
    r'|\bn\s*=\s*\d+'
    r'|\b\d+\s+(?:independent\s+)?(?:sources?|speakers?)\b'
    r'|\bboth\s+(?:analyses|passes|runs)\b'
    r'|\bfirst\s+pass\b|\bsecond\s+pass\b'
    r'|\bvariance\b|\bkappa\b'
    r'|\bdisconfirming\b'
    r'|\bwe\s+(?:chose|decided|concluded|found|kept|dropped)\b'
    r'|\bthe\s+analysis\s+(?:found|showed|concluded)\b'
    r'|\bsurvived\s+refutation\b'
    r'|\balready\s+(?:checked|refuted|tested)\b',
    re.I)

ITEM_RE = re.compile(r'\*\*(\d+)\.\*\*\s*["“](.+?)["”]\s*\n\*—\s*(.+?)\*', re.S)


def load_corpus(path):
    raw = open(path, encoding="utf-8").read()
    if raw.lstrip().startswith("["):
        return {int(d["id"]): (d["quote"], d.get("source", "")) for d in json.loads(raw)}
    return {int(m.group(1)): (m.group(2).strip(), m.group(3).strip().split("|")[0].strip())
            for m in ITEM_RE.finditer(raw)}


def sha(b):
    return hashlib.sha256(b if isinstance(b, bytes) else b.encode("utf-8")).hexdigest()


def norm(s):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", str(s))).strip()


# ---------------------------------------------------------------------------- build
def cmd_build(a):
    if not os.path.exists(a.corpus):
        die(f"no corpus at {a.corpus}\n"
            "  The packet quotes the cited items verbatim, so the corpus has to be readable —\n"
            "  a refuter given claim labels and no evidence cannot audit anything.")
    try:
        corpus = load_corpus(a.corpus)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError, KeyError, ValueError) as e:
        die(f"cannot read the corpus at {a.corpus} ({e}).")
    if not corpus:
        die(f"no items parsed out of {a.corpus}.\n"
            "  Expected a JSON array or markdown items shaped **1.** \"quote\" / *— source*.")
    if not os.path.exists(a.claims):
        die(f"no claims file at {a.claims}\n"
            '  Expected a JSON list: [{"id":"C1","label":"…","concept":"…","items":[4,15]}]\n'
            "  Bare on purpose — anything beyond those four fields is refused, because a refuter\n"
            "  who can see how the claim was built knows what to protect.")
    try:
        claims = json.load(open(a.claims, encoding="utf-8"))
    except json.JSONDecodeError as e:
        die(f"the claims file at {a.claims} is not valid JSON: {e.msg} (line {e.lineno}).")
    except (OSError, UnicodeDecodeError) as e:
        die(f"cannot read the claims file at {a.claims} ({e}).")
    if isinstance(claims, dict):
        claims = claims.get("claims", [])
    if not claims:
        die("no claims to package. A refutation pass over zero claims is not a pass — there is\n"
            "  nothing for a lens to attack, and an empty run would report as a clean one.", code=1)

    refusals = []
    for n, c in enumerate(claims):
        if not isinstance(c, dict):
            refusals.append(f"claim {n}: not an object"); continue
        cid = c.get("id") or f"claim-{n}"
        for k in c:
            if k in ALLOWED_KEYS:
                continue
            why = BUILD_KEYS.get(k.lower())
            refusals.append(
                f'{cid}: field "{k}" carries {why} — strip it'
                if why else
                f'{cid}: field "{k}" is not one of {sorted(ALLOWED_KEYS)}. A packet says what the '
                f'claim IS, never how it came to be')
        for field in ("label", "concept"):
            v = c.get(field)
            if v and LEAK_RE.search(str(v)):
                hit = LEAK_RE.search(str(v)).group(0)
                refusals.append(f'{cid}: {field} contains "{hit}" — that tells the refuter what was '
                                f'already settled, which is exactly what they must not know')
        if not c.get("label"):
            refusals.append(f"{cid}: no label — a refuter cannot attack a claim that was not stated")
        ids = c.get("items") or []
        if not ids:
            refusals.append(f"{cid}: no items — a claim with no cited evidence has nothing to audit")
        missing = [i for i in ids if int(i) not in corpus]
        if missing:
            refusals.append(f"{cid}: item(s) {missing} are not in the corpus")

    if refusals:
        print("REFUSED — a packet that leaks the build is worse than no packet, because it reads "
              "like independence.\n", file=sys.stderr)
        for r in refusals:
            print("  · " + r, file=sys.stderr)
        sys.exit(1)

    os.makedirs(a.out, exist_ok=True)
    stamp = _dt.now().isoformat(timespec="seconds")
    corpus_sha = sha(open(a.corpus, "rb").read())[:16]
    written = []

    for c in claims:
        cid = c["id"]
        lines = [
            f"# Refutation packet — {cid}",
            "",
            f"packet {PACKET_VERSION} · corpus {os.path.basename(a.corpus)} sha256:{corpus_sha} · written {stamp}",
            "",
            "You are trying to break this claim. Assume it is wrong and look for the reading of the",
            "evidence that makes it wrong. You have the claim and the items it cites and nothing",
            "else — no source counts, no confidence call, no record of what was already argued over.",
            "That is deliberate: the party that built a claim knows what to protect.",
            "",
            "---",
            "",
            "## The claim",
            "",
            f"**{norm(c['label'])}**",
        ]
        if c.get("concept"):
            lines += ["", f"Organising concept: {norm(c['concept'])}"]
        lines += ["", "## The cited items, verbatim", ""]
        for i in c["items"]:
            q, src = corpus[int(i)]
            lines += [f"**{i}.** “{norm(q)}”", f"*— {norm(src)}*", ""]
        lines += [
            "## What to return",
            "",
            "For this claim: supported / not supported / better explained otherwise. If a narrower",
            "wording is what the evidence actually carries, write that wording — it is what survives.",
            "Name the items that carry your verdict. One well-evidenced refutation beats two passes",
            "that found nothing.",
            "",
        ]
        body = "\n".join(lines)
        path = os.path.join(a.out, f"{cid}.packet.md")
        open(path, "w", encoding="utf-8").write(body)
        written.append({"claim": cid, "path": path, "sha256": sha(body)[:16],
                        "items": [int(i) for i in c["items"]]})

    manifest_id = sha(stamp + corpus_sha + "".join(w["sha256"] for w in written))[:12]
    manifest = {
        "manifest_id": manifest_id,
        "packet_version": PACKET_VERSION,
        "written_at": stamp,
        "corpus_file": os.path.basename(a.corpus),
        "corpus_sha256": corpus_sha,
        "packets": written,
        "how_to_cite": (f"Refutation packets written before the pass: manifest {manifest_id} "
                        f"({len(written)} claims, {stamp}). Quote this line in the artifact — "
                        "`refute_packet.py check` looks for it."),
        "if_you_cannot_run_the_pass_against_these":
            ("Then the pass was not independent. Label it *in-run review* in those words and say "
             "why the file boundary could not be held. A reader can discount an in-run review "
             "correctly; they cannot discount a relabelled one."),
    }
    mpath = os.path.join(a.out, "manifest.json")
    json.dump(manifest, open(mpath, "w", encoding="utf-8"), indent=1, ensure_ascii=False)

    if a.json:
        print(json.dumps({**manifest, "manifest_path": mpath}, indent=1, ensure_ascii=False))
    else:
        print("=" * 62); print("REFUTATION PACKETS"); print("=" * 62)
        print(f"manifest {manifest_id}   {len(written)} packet(s)   {stamp}")
        print(f"corpus {os.path.basename(a.corpus)} sha256:{corpus_sha}")
        print("-" * 62)
        for wr in written:
            print(f"  {wr['claim']:<10} {len(wr['items'])} item(s)  {wr['path']}")
        print("-" * 62)
        print("Run each lens against these files ALONE. Then quote this line in the artifact:")
        print(f"  {manifest['how_to_cite']}")
        print("=" * 62)
    return 0


# ---------------------------------------------------------------------------- check
INDEPENDENCE_CLAIM = re.compile(
    r'\bindependent(?:ly)?\s+refut\w+|\brefut\w+\s+independently|\bindependent\s+refutation\b'
    r'|\bthree[- ]lens\s+independent\b', re.I)
IN_RUN_LABEL = re.compile(r'\bin-run\s+review\b', re.I)


def cmd_check(a):
    if not os.path.exists(a.analysis):
        die(f"no analysis at {a.analysis}\n"
            "  This reads the finished document to see whether its independence claim has packets\n"
            "  behind it. usage: refute_packet.py check ANALYSIS --manifest packets/manifest.json")
    try:
        text = open(a.analysis, encoding="utf-8").read()
    except (OSError, UnicodeDecodeError) as e:
        die(f"cannot read the analysis at {a.analysis} ({e}).")
    claims_independence = bool(INDEPENDENCE_CLAIM.search(text))
    labels_in_run = bool(IN_RUN_LABEL.search(text))

    problems, notes = [], []
    manifest = None
    if a.manifest:
        try:
            manifest = json.load(open(a.manifest, encoding="utf-8"))
        except Exception as e:
            problems.append(f"--manifest unreadable ({e}) — refusing to certify independence "
                            f"against a manifest that will not load")

    if manifest:
        mid = manifest.get("manifest_id", "")
        if mid and mid not in text:
            problems.append(
                f"the analysis does not cite manifest {mid}. The packets exist; this document does "
                "not say it was refuted against them, so a reader cannot connect the two.")
        for p in manifest.get("packets", []):
            try:
                body = open(p["path"], encoding="utf-8").read()
            except Exception:
                problems.append(f"packet for {p['claim']} is missing from disk ({p['path']}) — "
                                "an audit trail that no longer exists is not one")
                continue
            if sha(body)[:16] != p["sha256"]:
                problems.append(f"packet for {p['claim']} has changed since it was written. A "
                                "packet edited after the pass proves nothing about what the "
                                "refuter saw.")

    if claims_independence and not manifest:
        problems.append(
            "this document claims independent refutation and no packet manifest was supplied. "
            "That claim is exactly the one the process could not support: write the packets with "
            "`refute_packet.py build` before the pass, or label the pass *in-run review* and say "
            "why the file boundary could not be held.")
    if not claims_independence and not labels_in_run:
        notes.append(
            "this document neither claims independent refutation nor labels the pass *in-run "
            "review*. A reader has no way to tell which they are reading. Say one or the other.")

    verdict = "FAIL" if problems else ("INSUFFICIENT-INPUT" if notes else "PASS")
    if a.json:
        print(json.dumps({"verdict": verdict, "claims_independence": claims_independence,
                          "labels_in_run_review": labels_in_run,
                          "manifest_id": (manifest or {}).get("manifest_id"),
                          "problems": problems, "notes": notes}, indent=1))
    else:
        print("=" * 62); print("REFUTATION INDEPENDENCE CHECK"); print("=" * 62)
        print(f"document claims independence : {claims_independence}")
        print(f"document labels in-run review: {labels_in_run}")
        print(f"manifest                     : {(manifest or {}).get('manifest_id') or 'none supplied'}")
        if problems:
            print("-" * 62)
            for p in problems:
                print("  · " + p)
        if notes:
            print("-" * 62); print("COULD NOT CHECK — this is not a pass\n")
            for n in notes:
                print("  · " + n)
        print("=" * 62)
        if verdict == "PASS" and claims_independence:
            print("RESULT: PASS — the independence claim has packets behind it")
        elif verdict == "PASS":
            print("RESULT: PASS — the pass is labelled *in-run review*, which is the honest label "
                  "when\n        there was no file boundary. Nothing here overclaims.")
        elif verdict == "FAIL":
            print("RESULT: FAIL — the independence claim is not supported by the audit trail")
        else:
            print("RESULT: INSUFFICIENT-INPUT — the document says nothing either way, so nothing "
                  "was checked")
    sys.exit(1 if (problems or notes) else 0)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("build", help="write bare refutation packets before the pass")
    b.add_argument("--corpus", required=True)
    b.add_argument("--claims", required=True)
    b.add_argument("-o", "--out", default="refutation-packets")
    b.add_argument("--json", action="store_true")
    b.set_defaults(fn=cmd_build)

    c = sub.add_parser("check", help="verify a finished analysis' independence claim")
    c.add_argument("analysis")
    c.add_argument("--manifest")
    c.add_argument("--json", action="store_true")
    c.set_defaults(fn=cmd_check)

    a = ap.parse_args()
    sys.exit(a.fn(a) or 0)


if __name__ == "__main__":
    main()
