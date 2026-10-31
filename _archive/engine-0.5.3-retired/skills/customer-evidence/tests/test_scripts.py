#!/usr/bin/env python3
"""
test_scripts.py — every finding from the qualitative-research review, encoded as a test.
Each case fails against the pre-fix scripts and passes against the current ones.

Run: python3 tests/test_scripts.py
"""
import json, os, subprocess, sys, tempfile, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
LINT = os.environ.get("LINT", os.path.join(HERE, "..", "scripts", "corpus_lint.py"))
VERIFY = os.environ.get("VERIFY", os.path.join(HERE, "..", "scripts", "verify_quotes.py"))
TMP = tempfile.mkdtemp(prefix="ce-")

npass = nfail = 0


def w(name, text):
    p = os.path.join(TMP, name)
    open(p, "w", encoding="utf-8").write(textwrap.dedent(text).lstrip())
    return p


def run(script, *args):
    r = subprocess.run([sys.executable, script, *args], capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr


def t(name, fn):
    global npass, nfail
    try:
        fn(); print(f"  \033[32mPASS\033[0m  {name}"); npass += 1
    except AssertionError as e:
        print(f"  \033[31mFAIL\033[0m  {name}\n        {e}"); nfail += 1
    except Exception as e:
        print(f"  \033[31mERR \033[0m  {name}\n        {type(e).__name__}: {e}"); nfail += 1


# ---------------------------------------------------------------- fixtures
CORPUS = w("corpus.md", '''
    # corpus

    **1.** "Third one I've owned and the first that didn't need modding out of the box."
    *— amazon.com/dp/B0C7MAKERM2, Mar 2026 | speaker:amz-rev-1 | class:retailer | register:neutral | audience:declared*

    **4.** "Runs loud. Like, can't-be-in-the-same-room loud."
    *— amazon.com/dp/B0C7MAKERM2, Feb 2026 | speaker:amz-rev-2 | class:retailer | register:problem | audience:declared*

    **9.** "Arrived with a bent gantry and support took two weeks to answer."
    *— amazon.com/dp/B0C7MAKERM2, Jan 2026 | speaker:amz-rev-3 | class:retailer | register:problem | audience:declared*

    **15.** "Mine lives in the garage now, they are all loud, that is the category."
    *— amazon.com/dp/B0C7MAKERM2, Apr 2026 | speaker:amz-rev-4 | class:retailer | register:neutral | audience:inferred*

    **21.** "What settings is everyone using for PETG on the M2?"
    *— reddit.com/r/3Dprinting/comments/1m2b7h, Apr 2026 | speaker:u/alice | class:forum | register:neutral | audience:declared*

    **22.** "Second thoughts on the M2 after six months, still going strong."
    *— reddit.com/r/3Dprinting/comments/1kx9f2, May 2026 | speaker:u/alice | class:forum | register:positive | audience:declared*

    **7.** "I switched from a machine that cost three times as much and I haven't looked back."
    *— makerprint.com/testimonials, Apr 2026 | speaker:brand | class:firstparty | register:positive | audience:inferred*
    ''')

print("\ncorpus_lint.py / verify_quotes.py — regression tests for the research review\n")

# ---- F1: speakers vs venues ----
def f1_two_numbers():
    code, out, _ = run(LINT, CORPUS, "--brand-domains", "makerprint.com", "--json")
    d = json.loads(out)
    assert d["venues"] == 4, f"expected 4 venues, got {d['venues']}"
    assert d["speakers"] == 6, f"expected 6 distinct speakers, got {d['speakers']}"
t("F1 four reviewers on one page count as four speakers, one venue", f1_two_numbers)

def f1_same_speaker_across_venues():
    code, out, _ = run(LINT, CORPUS, "--brand-domains", "makerprint.com", "--json")
    d = json.loads(out)
    assert "u/alice" in d["speaker_collapses"], "one poster across two threads not collapsed to one voice"
    assert sorted(d["speaker_collapses"]["u/alice"]) == [21, 22]
t("F1 one poster across two threads collapses to one speaker", f1_same_speaker_across_venues)

# ---- F5: brand-domains required ----
def f5_required():
    code, out, err = run(LINT, CORPUS, "--json")
    assert code != 0, "ran without --brand-domains"
    assert "brand-domains" in (err + out), f"wrong failure: {err[:200]}"
t("F5 --brand-domains is required, not defaulted off", f5_required)

def f5_none_is_explicit():
    code, out, _ = run(LINT, CORPUS, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert d["brand_domains_checked"] == [], "explicit 'none' not recorded"
    assert not any(e["kind"] == "BRAND COPY" for e in d["errors"])
t("F5 'none' is accepted but recorded as a declared choice", f5_none_is_explicit)

def f5_catches_brand():
    code, out, _ = run(LINT, CORPUS, "--brand-domains", "makerprint.com", "--json")
    d = json.loads(out)
    assert any(e["kind"] == "BRAND COPY" and e["item"] == 7 for e in d["errors"]), "brand testimonial not caught"
t("F5 first-party testimonial is an error", f5_catches_brand)

# ---- F6: parser must not drop items silently ----
def f6_drop_detected():
    bad = w("dropped.md", '''
        **1.** "a perfectly ordinary first item that is long enough"
        *— forum.example/thread/11, Mar 2026*

        **2.** an item whose quote marks went missing entirely at ingest
        *— forum.example/thread/12, Mar 2026*

        **3.** "a third item that parses fine on its own"
        *— forum.example/thread/13, Mar 2026*
        ''')
    code, out, _ = run(LINT, bad, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert any(e["kind"] == "CORPUS PARSE" for e in d["errors"]), \
        f"silently dropped an item; reported {d['items']} items, verdict {d['verdict']}"
    assert code != 0
t("F6 an unparseable item is a loud error, not a smaller corpus", f6_drop_detected)

def f6_curly_quotes_parse():
    c = w("curly.md", """
        **1.** “a curly-quoted item exactly as a scraper would emit it”
        *— forum.example/thread/11, Mar 2026*

        **2.** "a straight-quoted item alongside it for contrast"
        *— forum.example/thread/12, Mar 2026*
        """)
    code, out, _ = run(LINT, c, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert d["items"] == 2, f"curly-quoted item dropped; parsed {d['items']} of 2"
    assert not any(e["kind"] == "CORPUS PARSE" for e in d["errors"])
t("F6 typographic-quoted items parse instead of vanishing", f6_curly_quotes_parse)

def f6_duplicate_ids():
    bad = w("dupes.md", '''
        **1.** "the first item here is long enough to count"
        *— forum.example/thread/11, Mar 2026*

        **1.** "a second item reusing the same number entirely"
        *— forum.example/thread/12, Mar 2026*
        ''')
    code, out, _ = run(LINT, bad, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert any("duplicate" in e["detail"] for e in d["errors"]), "duplicate item numbers not caught"
t("F6 duplicate item numbers are caught", f6_duplicate_ids)

# ---- F7: source_key must not merge distinct thread ids ----
def f7_thread_ids():
    c = w("threads.md", '''
        **1.** "first thread post with enough words to count properly"
        *— printforum.net/thread/2019, Mar 2026*

        **2.** "second thread post with enough words to count properly"
        *— printforum.net/thread/2020, Mar 2026*

        **3.** "third thread post with enough words to count properly"
        *— printforum.net/thread/1998, Mar 2026*
        ''')
    code, out, _ = run(LINT, c, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert d["venues"] == 3, f"distinct thread ids merged into {d['venues']} venue(s) — they are different threads"
t("F7 thread/2019 and thread/2020 are different venues, not a date", f7_thread_ids)

def f7_real_dates_still_collapse():
    c = w("dates.md', ''", '''
        **1.** "first review on the product page with enough words"
        *— walmart.com/ip/12345, Nov 2025*

        **2.** "second review on the same product page, different month"
        *— walmart.com/ip/12345, May 2026*
        ''')
    code, out, _ = run(LINT, c, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert d["venues"] == 1, f"same page cited with two dates did not collapse ({d['venues']} venues)"
t("F7 the same page cited with different dates still collapses", f7_real_dates_still_collapse)

# ---- frame enforcement ----
def frame_fields():
    c = w("noframe.md", '''
        **1.** "an item with no venue class or register at all here"
        *— forum.example/thread/11, Mar 2026*
        ''')
    code, out, _ = run(LINT, c, "--brand-domains", "none", "--frame", "--json")
    d = json.loads(out)
    kinds = [e["kind"] for e in d["errors"]]
    assert kinds.count("FRAME FIELD") == 3, f"expected venue class, register and audience required; got {kinds}"
t("frame mode requires venue class, register and audience tag", frame_fields)

# ---- F3: the quote verifier must not fail open ----
ANALYSIS_OK = w("analysis_ok.md", '''
    Owners report the noise directly: "Runs loud. Like, can't-be-in-the-same-room loud." (item 4)
    ''')
ANALYSIS_FAB = w("analysis_fab.md", '''
    Owners report the noise directly: "Runs loud. Like, can't-be-in-the-same-room loud." (item 4)
    One owner said "the M2 is the quietest printer I have ever owned" (item 21).
    ''')
ANALYSIS_FAB_INCH = w("analysis_fab_inch.md", '''
    The stock 0.4" nozzle is the usual starting point.
    Owners report the noise directly: "Runs loud. Like, can't-be-in-the-same-room loud." (item 4)
    One owner said "the M2 is the quietest printer I have ever owned" (item 21).
    ''')

def f3_control():
    code, out, _ = run(VERIFY, CORPUS, ANALYSIS_FAB, "--json")
    d = json.loads(out)
    assert d["verdict"] == "FAIL", "planted fabrication not caught even without a stray mark"
t("F3 control: a planted fabrication is caught", f3_control)

def f3_inch_mark():
    code, out, _ = run(VERIFY, CORPUS, ANALYSIS_FAB_INCH, "--json")
    d = json.loads(out)
    assert d["verdict"] == "FAIL", \
        'a 0.4" measurement made the verifier pass a fabricated quote — it failed open'
    assert code != 0
t("F3 a stray inch mark does not turn the verifier into a rubber stamp", f3_inch_mark)

def f3_ambiguous_reported():
    amb = w("ambiguous.md", '''
        He said "this is a quotation that is long enough" and then a lone " mark appears.
        ''')
    code, out, _ = run(VERIFY, CORPUS, amb, "--json")
    d = json.loads(out)
    assert d["parse_problems"], "unbalanced quoting not reported"
    assert code != 0, "ambiguous quoting exited 0"
t("F3 unbalanced quote marks are reported, not guessed at", f3_ambiguous_reported)

def f3_short_quotes_reported():
    short = w("short.md", '''
        The word "loud" recurs, and so does "the garage" in these reviews.
        ''')
    code, out, _ = run(VERIFY, CORPUS, short, "--json")
    d = json.loads(out)
    assert d["below_min_length"], "short quoted strings vanished from the report entirely"
t("F3 quotes below min length are reported, never silently dropped", f3_short_quotes_reported)

def f3_citation_forms():
    forms = w("forms.md", '''
        A: "Runs loud. Like, can't-be-in-the-same-room loud." [4]
        B: "What settings is everyone using for PETG on the M2?" — item 21
        ''')
    code, out, _ = run(VERIFY, CORPUS, forms, "--json")
    d = json.loads(out)
    assert d["cited_checked"] == 2, f"bracket and dash citation forms not recognised ({d['cited_checked']} of 2)"
    assert d["verified"] == 2
t("F3 [18] and '— item 13' citation forms are recognised", f3_citation_forms)

# ---- F4: exclusions must reach the verifier ----
def f4_exclusion_handoff():
    code, lint_out, _ = run(LINT, CORPUS, "--brand-domains", "makerprint.com", "--json")
    lint_path = w("lint.json", lint_out)
    quoting_excluded = w("quotes_excluded.md", '''
        The switch story is compelling: "I switched from a machine that cost three times as much and I haven't looked back." (item 7)
        ''')
    code, out, _ = run(VERIFY, CORPUS, quoting_excluded, "--exclusions", lint_path, "--json")
    d = json.loads(out)
    assert d["quoted_from_excluded_items"], \
        "an item the lint disqualified was quoted and the verifier passed it"
    assert code != 0
t("F4 quoting an item the lint excluded is an error", f4_exclusion_handoff)

def f4_bad_exclusions_fail_closed():
    code, out, err = run(VERIFY, CORPUS, ANALYSIS_OK, "--exclusions", "/nope/missing.json", "--json")
    assert code != 0, "unreadable exclusions file was ignored"
t("F4 an unreadable exclusions file refuses to verify", f4_bad_exclusions_fail_closed)

def clean_passes():
    code, out, _ = run(VERIFY, CORPUS, ANALYSIS_OK, "--json")
    d = json.loads(out)
    assert d["verdict"] == "PASS", f"clean analysis failed: {out[:300]}"
t("a clean analysis still passes", clean_passes)


# ---- Cold structural review: a check that did not run must not report PASS ----
def ins_no_speakers():
    c = w("nospeak.md", '''
        **1.** "a review line from a product page with enough words"
        *— shop.example/p/123, Mar 2026*

        **2.** "a second review line from the same page, also long"
        *— shop.example/p/123, Apr 2026*
        ''')
    code, out, _ = run(LINT, c, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert d["verdict"] == "INSUFFICIENT-INPUT", f"no speaker tags reported as {d['verdict']}"
    assert any("speaker" in s for s in d["insufficient_input"])
    assert code != 0, "insufficient input exited 0 — it reads as a pass"
t("COLD1 a corpus with no speaker tags is INSUFFICIENT-INPUT, not PASS", ins_no_speakers)

def ins_no_brand_domains():
    c = w("nb.md", '''
        **1.** "a line long enough to count properly here"
        *— forum.example/thread/9, Mar 2026 | speaker:u-9*
        ''')
    code, out, _ = run(LINT, c, "--brand-domains", "none", "--json")
    d = json.loads(out)
    assert any("first-party" in s for s in d["insufficient_input"]), \
        "declaring no domains silently skipped the brand-copy check"
    assert code != 0
t("COLD1b --brand-domains none is recorded as unchecked, not clean", ins_no_brand_domains)

def ins_speakers_present_passes():
    c = w("sp.md", '''
        **1.** "a line long enough to count properly here"
        *— forum.example/thread/9, Mar 2026 | speaker:u-9*
        ''')
    code, out, _ = run(LINT, c, "--brand-domains", "shop.example", "--json")
    d = json.loads(out)
    assert d["verdict"] == "PASS", f"a properly tagged corpus should pass, got {d['verdict']}: {d['insufficient_input']}"
    assert code == 0
t("COLD1c a tagged corpus with declared domains still PASSes", ins_speakers_present_passes)

def ins_no_quotes():
    doc = w("paraphrase.md", "Customers report frustration with noise. Roughly 40% mention it.\n")
    code, out, _ = run(VERIFY, CORPUS, doc, "--json")
    d = json.loads(out)
    assert d["verdict"] == "INSUFFICIENT-INPUT", \
        f"a document with zero cited quotes reported {d['verdict']} — the emptiest input got the cleanest verdict"
    assert code != 0
t("COLD2 a document with no cited quotes is INSUFFICIENT-INPUT, not PASS", ins_no_quotes)

def ins_quotes_present_passes():
    doc = w("ok.md", 'Owners say: "Runs loud. Like, can\'t-be-in-the-same-room loud." (item 4)\n')
    code, out, _ = run(VERIFY, CORPUS, doc, "--json")
    d = json.loads(out)
    assert d["verdict"] == "PASS", f"a real cited quote should pass, got {d['verdict']}"
t("COLD2b a document with a real cited quote still PASSes", ins_quotes_present_passes)

def provenance_present():
    code, out, _ = run(LINT, CORPUS, "--brand-domains", "makerprint.com", "--json")
    d = json.loads(out)
    p = d.get("provenance") or {}
    for k in ("corpus_sha256", "lint_version", "run_at", "corpus_file"):
        assert p.get(k), f"provenance missing {k} — a finding cannot be traced to its corpus"
t("COLD3 every run emits corpus hash, lint version and timestamp", provenance_present)

# ================================================================================
# S1.4 — `never_quotable` existed in two documents and in zero scripts. The ethics
# rules say tag special-category material at ingest and never let it reach output;
# nothing read the tag, so health data about identifiable people had no mechanical
# barrier between the corpus and a slide. Read it, count it, refuse to quote it.
# ================================================================================

SENSITIVE_CORPUS = w("sensitive.md", '''
    # corpus

    **1.** "Runs loud, but I have got used to it over the months."
    *— forum.example/thread/1, Mar 2026 | speaker:u-1 | class:forum | register:neutral | audience:declared*

    **2.** "Started this after my doctor put me on medication for blood pressure."
    *— forum.example/thread/2, Mar 2026 | speaker:u-2 | class:forum | register:problem | audience:declared*

    **3.** "I order these because my daughter will not eat anything else at breakfast."
    *— forum.example/thread/3, Apr 2026 | speaker:u-3 | class:forum | register:neutral | audience:declared*

    **4.** "Cancelled because the delivery window never once matched what I chose."
    *— forum.example/thread/4, Apr 2026 | speaker:u-4 | class:forum | register:problem | audience:declared | never_quotable:yes*
    ''')


def lint_json(corpus, *extra):
    code, out, err = run(LINT, corpus, "--brand-domains", "none", "--json", *extra)
    assert out.strip(), f"lint produced no JSON (exit {code}): {err}"
    return code, json.loads(out)


def nq_explicit_tag_is_read():
    _, d = lint_json(SENSITIVE_CORPUS)
    assert 4 in d["never_quotable"], \
        f"an item tagged never_quotable:yes was not carried into the output: {d['never_quotable']}"
t("S1.4 an explicit never_quotable tag is read, not ignored", nq_explicit_tag_is_read)


def nq_inferred_from_content():
    _, d = lint_json(SENSITIVE_CORPUS)
    for i in (2, 3):
        assert i in d["never_quotable"], f"item {i} is special-category and was not caught: {d['never_quotable']}"
    inferred = {x["item"] for x in d["never_quotable_inferred"]}
    assert {2, 3} <= inferred, f"untagged special-category material was not flagged as untagged: {inferred}"
t("S1.4 untagged health and named-child material is inferred, and the gap is reported", nq_inferred_from_content)


def nq_marker_list_is_configurable():
    _, d = lint_json(SENSITIVE_CORPUS, "--sensitive", "gantry")
    assert 4 in d["never_quotable"], "the explicit tag stopped being honoured under a custom list"
    assert 2 not in d["never_quotable"], \
        "a hardcoded marker list survived --sensitive — this is one brand's list baked into an engine"
t("S1.4 the sensitive-marker list is configurable, not baked in", nq_marker_list_is_configurable)


def nq_quoting_one_is_an_error():
    _, d = lint_json(SENSITIVE_CORPUS)
    lintf = os.path.join(TMP, "sensitive-lint.json")
    open(lintf, "w", encoding="utf-8").write(json.dumps(d))
    doc = w("leaks.md", '''
        Some customers arrive already managing a condition:
        "Started this after my doctor put me on medication for blood pressure." (item 2)
        ''')
    code, out, _ = run(VERIFY, SENSITIVE_CORPUS, doc, "--exclusions", lintf, "--json")
    r = json.loads(out)
    assert r["verdict"] == "FAIL", f"special-category material reached a deliverable with verdict {r['verdict']}"
    assert code != 0, "quoting special-category material exited 0"
    hit = r["quoted_from_excluded_items"]
    assert hit and hit[0]["item"] == 2, f"the offending item was not named: {hit}"
    assert any("NEVER QUOTABLE" in x for x in hit[0]["why"]), f"reason not stated: {hit[0]['why']}"
t("S1.4 quoting a never_quotable item FAILS and names the item", nq_quoting_one_is_an_error)


def nq_analysis_may_still_rest_on_it():
    _, d = lint_json(SENSITIVE_CORPUS)
    lintf = os.path.join(TMP, "sensitive-lint2.json")
    open(lintf, "w", encoding="utf-8").write(json.dumps(d))
    doc = w("careful.md", '''
        Two of the four accounts describe circumstances outside the product entirely
        (items 2, 3), summarised rather than quoted. On the product itself:
        "Runs loud, but I have got used to it over the months." (item 1)
        ''')
    code, out, _ = run(VERIFY, SENSITIVE_CORPUS, doc, "--exclusions", lintf, "--json")
    r = json.loads(out)
    assert r["verdict"] == "PASS", \
        f"a finding resting on special-category material without quoting it was blocked: {out}"
    assert code == 0
t("S1.4 a finding may rest on it — the bar is on quoting, not on reading", nq_analysis_may_still_rest_on_it)


def nq_check_reports_when_off():
    doc = w("nolint.md", '"Runs loud, but I have got used to it over the months." (item 1)\n')
    _, out, _ = run(VERIFY, SENSITIVE_CORPUS, doc, "--json")
    r = json.loads(out)
    assert r["exclusion_checking"].startswith("OFF"), \
        f"with no --exclusions the never_quotable barrier is off and the report did not say so: {r.get('exclusion_checking')}"
    _, d = lint_json(SENSITIVE_CORPUS)
    lintf = os.path.join(TMP, "sensitive-lint3.json")
    open(lintf, "w", encoding="utf-8").write(json.dumps(d))
    _, out2, _ = run(VERIFY, SENSITIVE_CORPUS, doc, "--exclusions", lintf, "--json")
    assert json.loads(out2)["exclusion_checking"].startswith("on"), "enforcement state not reported when on"
t("S1.4 the report says whether the never_quotable barrier ran at all", nq_check_reports_when_off)


OVERRIDE_CORPUS = w("override.md", '''
    # corpus

    **1.** "Bought it for my kid's school project and we have both used it since."
    *— forum.example/thread/1, Mar 2026 | speaker:u-1 | never_quotable:no*

    **2.** "My kid was in and out of appointments all spring and this was one less thing."
    *— forum.example/thread/2, Mar 2026 | speaker:u-2*

    **3.** "Delivery windows never once matched what I chose, so I cancelled."
    *— forum.example/thread/3, Apr 2026 | speaker:u-3 | never_quotable:no*
    ''')


def nq_override_is_available_and_visible():
    _, d = lint_json(OVERRIDE_CORPUS)
    assert 1 not in d["never_quotable"], \
        "an item a person read and cleared is still blocked — a check that over-blocks gets switched off"
    assert 2 in d["never_quotable"], "the override leaked to an item that never carried it"
    over = {x["item"] for x in d["never_quotable_overridden"]}
    assert over == {1}, f"the override is invisible to an auditor: {d['never_quotable_overridden']}"
    kinds = {x["kind"] for x in d["warnings"]}
    assert "SENSITIVE OVERRIDE" in kinds, f"a human override was applied silently: {kinds}"
t("S1.4 an inferred flag can be cleared by hand, and the clearance is recorded", nq_override_is_available_and_visible)


def nq_override_needs_no_ceremony_when_nothing_matched():
    _, d = lint_json(OVERRIDE_CORPUS)
    assert 3 not in d["never_quotable"]
    assert 3 not in {x["item"] for x in d["never_quotable_overridden"]}, \
        "an item that matched no marker was recorded as an override, inflating the audit trail"
t("S1.4 clearing an item that matched nothing is not recorded as an override", nq_override_needs_no_ceremony_when_nothing_matched)


def nq_cleared_item_is_quotable():
    _, d = lint_json(OVERRIDE_CORPUS)
    lintf = os.path.join(TMP, "override-lint.json")
    open(lintf, "w", encoding="utf-8").write(json.dumps(d))
    doc = w("quotes-cleared.md",
            '"Bought it for my kid\'s school project and we have both used it since." (item 1)\n')
    code, out, _ = run(VERIFY, OVERRIDE_CORPUS, doc, "--exclusions", lintf, "--json")
    r = json.loads(out)
    assert r["verdict"] == "PASS", f"a hand-cleared item was still refused downstream: {out}"
    assert code == 0
t("S1.4 a hand-cleared item quotes cleanly downstream", nq_cleared_item_is_quotable)


def mode_is_recorded_in_provenance():
    _, d = lint_json(SENSITIVE_CORPUS, "--mode", "quick")
    p = d["provenance"]
    assert p.get("mode") == "quick", f"the pass mode is not in the audit trail: {p}"
    assert p.get("output_label") == "candidate", \
        "a quick pass did not declare that its output is candidate, not validated"
    _, full = lint_json(SENSITIVE_CORPUS)
    assert full["provenance"]["mode"] == "full", "full is not the default"
    assert full["provenance"]["output_label"] == "validated"
t("S2.2 the pass mode is stamped into provenance, not just asserted in prose", mode_is_recorded_in_provenance)


def quick_mode_is_loud_in_human_output():
    _, out, _ = run(LINT, SENSITIVE_CORPUS, "--brand-domains", "none", "--mode", "quick")
    assert "mode:quick" in out, "the quoted provenance line does not carry the mode"
    assert "CANDIDATE" in out, "a quick run does not tell the analyst to label the output candidate"
    _, full_out, _ = run(LINT, SENSITIVE_CORPUS, "--brand-domains", "none")
    assert "CANDIDATE" not in full_out, "a full run tells the analyst to hedge findings it validated"
t("S2.2 a quick run says so where the analyst will read it", quick_mode_is_loud_in_human_output)


def bad_mode_is_refused():
    code, _, err = run(LINT, SENSITIVE_CORPUS, "--brand-domains", "none", "--mode", "fastish")
    assert code != 0, "an unrecognised mode was accepted and silently treated as something"
t("S2.2 an unrecognised mode is refused, not silently defaulted", bad_mode_is_refused)


# ================================================================================
# S2.1 — refutation independence had no mechanism. No script contained the word
# "packet": the skill asked the model to state an independence rationale the
# process could not support, so "independent refutation" and "I reread my own
# work" produced identical prose.
# ================================================================================

PACKET = os.path.join(HERE, "..", "scripts", "refute_packet.py")
PKT_CORPUS = w("pkt-corpus.md", '''
    # corpus

    **1.** "Runs loud enough that I moved it into the garage after a week."
    *— forum.example/thread/1, Mar 2026 | speaker:u-1*

    **2.** "Loud, yes, but everything at this price is loud. Not a defect."
    *— forum.example/thread/2, Mar 2026 | speaker:u-2*
    ''')


def wjson(name, obj):
    p = os.path.join(TMP, name)
    open(p, "w", encoding="utf-8").write(json.dumps(obj))
    return p


def build_packets(claims, out="packets"):
    cp = wjson("claims-" + out + ".json", claims)
    d = os.path.join(TMP, out)
    code, so, se = run(PACKET, "build", "--corpus", PKT_CORPUS, "--claims", cp, "-o", d, "--json")
    return code, (json.loads(so) if code == 0 and so.strip() else None), se, d


BARE = [{"id": "C1", "label": "Noise drives relocation of the unit",
         "concept": "acoustic intrusion", "items": [1, 2]}]


def packet_is_written_and_bare():
    code, m, err, d = build_packets(BARE)
    assert code == 0, f"a well-formed claim was refused: {err}"
    assert m["manifest_id"], "no manifest id — nothing for the artifact to cite"
    body = open(m["packets"][0]["path"], encoding="utf-8").read()
    assert "Runs loud enough" in body, "the packet does not carry the cited item verbatim"
    assert "Noise drives relocation" in body, "the packet does not state the claim"
t("S2.1 a packet is written, and carries the claim and its items", packet_is_written_and_bare)


def packet_refuses_structured_leakage():
    leaky = [{**BARE[0], "confidence": "high", "why": "two speakers", "sources": 2}]
    code, _, err, _ = build_packets(leaky, out="p-leak")
    assert code != 0, "build rationale was packaged and handed to the refuter"
    for field in ("confidence", "why", "sources"):
        assert f'"{field}"' in err, f"{field} leaked without being named: {err}"
t("S2.1 build rationale in a field is refused by name", packet_refuses_structured_leakage)


def packet_refuses_freetext_leakage():
    leaky = [{**BARE[0], "label": "Noise drives relocation (high confidence, 2 independent sources)"}]
    code, _, err, _ = build_packets(leaky, out="p-leak2")
    assert code != 0, "a label telling the refuter what was already settled was packaged"
    assert "high confidence" in err
t("S2.1 build rationale smuggled into free text is refused too", packet_refuses_freetext_leakage)


def packet_refuses_uncitable_claim():
    code, _, err, _ = build_packets([{"id": "C1", "label": "A claim", "items": []}], out="p-noitem")
    assert code != 0, "a claim with no cited evidence was packaged as refutable"
    code2, _, err2, _ = build_packets(
        [{"id": "C1", "label": "A claim", "items": [99]}], out="p-badit")
    assert code2 != 0, "a claim citing an item outside the corpus was packaged"
    assert "99" in err2
t("S2.1 a claim with no items, or items not in the corpus, is refused", packet_refuses_uncitable_claim)


def check_fails_bare_independence_claim():
    doc = w("indep.md", "Each claim went through independent refutation across three lenses.\n")
    code, out, _ = run(PACKET, "check", doc, "--json")
    r = json.loads(out)
    assert r["verdict"] == "FAIL", "an independence claim with no packets behind it passed"
    assert code != 0
t("S2.1 claiming independent refutation with no packets FAILS", check_fails_bare_independence_claim)


def check_requires_the_manifest_be_cited():
    _, m, _, d = build_packets(BARE, out="p-cite")
    doc = w("indep2.md", "Each claim went through independent refutation across three lenses.\n")
    code, out, _ = run(PACKET, "check", doc, "--manifest", os.path.join(d, "manifest.json"), "--json")
    r = json.loads(out)
    assert r["verdict"] == "FAIL", "packets existed but the document never connected itself to them"
    doc2 = w("indep3.md", "Independent refutation across three lenses. "
                          f"Refutation packets written before the pass: manifest {m['manifest_id']}.\n")
    code2, out2, _ = run(PACKET, "check", doc2, "--manifest", os.path.join(d, "manifest.json"), "--json")
    assert json.loads(out2)["verdict"] == "PASS", f"a properly cited run was refused: {out2}"
    assert code2 == 0
t("S2.1 the analysis must cite the manifest, and then it passes", check_requires_the_manifest_be_cited)


def check_detects_packet_edited_after_the_fact():
    _, m, _, d = build_packets(BARE, out="p-edit")
    doc = w("indep4.md", "Independent refutation across three lenses. "
                         f"manifest {m['manifest_id']}\n")
    p = m["packets"][0]["path"]
    open(p, "a", encoding="utf-8").write("\nPS the claim is definitely right\n")
    code, out, _ = run(PACKET, "check", doc, "--manifest", os.path.join(d, "manifest.json"), "--json")
    r = json.loads(out)
    assert r["verdict"] == "FAIL", "a packet edited after the pass still certified the pass"
    assert any("changed since it was written" in p for p in r["problems"])
t("S2.1 a packet edited after the pass no longer certifies it", check_detects_packet_edited_after_the_fact)


def check_accepts_honest_in_run_review():
    doc = w("inrun.md", "The refutation pass was an in-run review, not independent: a single "
                        "context with no file boundary.\n")
    code, out, _ = run(PACKET, "check", doc, "--json")
    r = json.loads(out)
    assert r["verdict"] == "PASS", f"the honest label was penalised: {out}"
    assert code == 0, "labelling a pass in-run review must not be harder than overclaiming"
t("S2.1 an honest in-run review label passes — the honest path is the cheap one", check_accepts_honest_in_run_review)


def check_flags_a_document_that_says_neither():
    doc = w("silent.md", "Customers mention noise a lot, across two threads.\n")
    code, out, _ = run(PACKET, "check", doc, "--json")
    r = json.loads(out)
    assert r["verdict"] == "INSUFFICIENT-INPUT", \
        "a document that never says which kind of pass it ran was treated as fine"
    assert code != 0
t("S2.1 a document claiming neither is INSUFFICIENT-INPUT, not PASS", check_flags_a_document_that_says_neither)


def nq_surfaced_in_human_output():
    code, out, _ = run(LINT, SENSITIVE_CORPUS, "--brand-domains", "none")
    assert "NEVER QUOTABLE" in out, "the human-readable lint never mentions special-category items"
    assert "SENSITIVE" in out, "the untagged-at-ingest gap is invisible to anyone not reading JSON"
t("S1.4 special-category counts are visible without reading JSON", nq_surfaced_in_human_output)


print(f"\n{npass} passed, {nfail} failed\n")
sys.exit(1 if nfail else 0)
