"""Tests for the intake and strategist checks (backlog crew-intake and crew-strategist).
Both real briefs have a canned intake and strategist output under crew/fixtures/; the dry-run fixture
brief has its own under crew/fixtures/dry-run/. A mutated brief or a mutated output must fail.
Run: python3 -m unittest discover -s crew/tests"""
import copy
import json
import os
import re
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
CREW = os.path.dirname(HERE)
ROOT = os.path.dirname(CREW)
sys.path.insert(0, CREW)
import run  # noqa: E402

PY = sys.executable
EM = chr(0x2014)
FX = os.path.join(CREW, "fixtures")
CASES = {
    "fixture": {
        "dir": os.path.join(FX, "dry-run"),
        "brief": os.path.join(FX, "brief.md"),
    },
    "protection-of-energy": {
        "dir": os.path.join(FX, "protection-of-energy"),
        "brief": os.path.join(ROOT, "outputs", "step-5-forge", "protection-of-energy", "brief-protection-of-energy.md"),
    },
}


def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def check(script, output, *extra):
    cmd = [PY, os.path.join(CREW, "checks", script), "--output", output] + list(extra)
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


class Tmp(unittest.TestCase):
    def setUp(self):
        self._t = tempfile.TemporaryDirectory()
        self.tmp = self._t.name

    def tearDown(self):
        self._t.cleanup()

    def write(self, name, doc):
        p = os.path.join(self.tmp, name)
        with open(p, "w", encoding="utf-8") as fh:
            if isinstance(doc, str):
                fh.write(doc)
            else:
                json.dump(doc, fh, indent=1, ensure_ascii=False)
        return p


class IntakeTests(Tmp):
    def test_both_briefs_give_a_valid_structured_brief(self):
        schema = load(os.path.join(CREW, "intake", "schema.json"))
        for name, c in CASES.items():
            doc = load(os.path.join(c["dir"], "intake.json"))
            self.assertEqual(run.validate(doc, schema), [], name)
            r = check("intake_check.py", os.path.join(c["dir"], "intake.json"), "--brief", c["brief"])
            self.assertEqual(r.returncode, 0, name + r.stdout)
            self.assertIn("intake_check: PASS", r.stdout)

    def test_default_brief_is_the_source_path(self):
        r = check("intake_check.py", os.path.join(CASES["protection-of-energy"]["dir"], "intake.json"))
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_unknown_price_and_date_stay_tokens_or_gaps(self):
        fx = load(os.path.join(CASES["fixture"]["dir"], "intake.json"))
        blob = json.dumps(fx)
        for tok in ("{{discount_value}}", "{{discount_code}}", "{{offer_window}}", "{{send_date}}", "{{hero_photo}}"):
            self.assertIn(tok, blob)
        poe = load(os.path.join(CASES["protection-of-energy"]["dir"], "intake.json"))
        self.assertIsNone(poe["offer"])
        send = [g for g in poe["gaps"] if "send_date" in g["field"]]
        self.assertEqual(len(send), 1)
        self.assertTrue(send[0]["owner"])
        self.assertNotRegex(json.dumps({k: v for k, v in poe.items() if k not in ("source", "gaps")}), r"\d{4}-\d{2}-\d{2}")

    def mutate(self, case, fn, brief=None):
        c = CASES[case]
        doc = load(os.path.join(c["dir"], "intake.json"))
        fn(doc)
        return check("intake_check.py", self.write("intake.json", doc), "--brief", brief or c["brief"])

    def assertFails(self, r, needle):
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn(needle, r.stdout)

    def test_mutated_output_fails(self):
        def price(d):
            d["message"] += " From $48."
        self.assertFails(self.mutate("fixture", price), "a price or offer figure is typed")

        def date(d):
            d["message"] += " Sending 2026-10-27."
        self.assertFails(self.mutate("protection-of-energy", date), "a date is typed")

        def emdash(d):
            d["objective"] += " " + EM
        self.assertFails(self.mutate("fixture", emdash), "em dash")

        def drop_pat(d):
            d["never_say"] = d["never_say"][:-1]
        self.assertFails(self.mutate("fixture", drop_pat), "pack pattern missing")

        def noowner(d):
            d["gaps"][0]["owner"] = " "
        self.assertFails(self.mutate("fixture", noowner), "no owner")

        def drop_product(d):
            d["products"].pop()
        self.assertFails(self.mutate("protection-of-energy", drop_product), "not in products[]")

        def unknown_id(d):
            d["products"][0]["id"] = "the-invented-bracelet"
        self.assertFails(self.mutate("fixture", unknown_id), "not in products.json")

        def typed_offer(d):
            d["offer"] = {"text": "20% off this week", "code_token": None, "figures_as_tokens": []}
        self.assertFails(self.mutate("protection-of-energy", typed_offer), "brief Offer is None")

        def lose_token(d):
            d["offer"]["text"] = "an offer"
            d["offer"]["figures_as_tokens"] = []
            d["offer"]["code_token"] = None
        self.assertFails(self.mutate("fixture", lose_token), "the offer object does not")

        def drop_channel(d):
            d["channels"] = ["email"]
        self.assertFails(self.mutate("fixture", drop_channel), "paid")

        def drop_send_gap(d):
            d["gaps"] = [g for g in d["gaps"] if "send_date" not in g["field"]]
            d["gaps"].append({"field": "x", "note": "{{send_date}}", "owner": "Donnie"})
        self.assertFails(self.mutate("fixture", drop_send_gap), "no send_date gap")

    def test_ordinary_words_are_not_dates_and_none_may_carry_a_tail(self):
        def words(d):
            d["message"] += " Marketing 3 pieces, a decorated 2 up."
        r = self.mutate("fixture", words)
        self.assertEqual(r.returncode, 0, r.stdout)
        text = read(CASES["protection-of-energy"]["brief"]).replace("## Offer\n\nNone.", "## Offer\n\nNone, for now.")
        r = self.mutate("protection-of-energy", lambda d: None, brief=self.write("brief.md", text))
        self.assertEqual(r.returncode, 0, r.stdout)
        text = read(CASES["fixture"]["brief"]).replace("## Offer", "## Deal")
        r = self.mutate("fixture", lambda d: None, brief=self.write("brief.md", text))
        self.assertFails(r, "no '## Offer' section")

    def test_mutated_brief_fails(self):
        for case, extra_line, needle in (
            ("fixture", "- The Seeds of Protection Bracelet in Black Tourmaline (new line)", "not in products[]"),
            ("protection-of-energy", "- The Master Protection Spell Bracelet (added)", "not in products[]"),
        ):
            text = read(CASES[case]["brief"])
            mutated = re.sub(r"(## Products\n\n(?:- .*\n)+)", lambda m: m.group(1) + extra_line + "\n", text, count=1)
            self.assertNotEqual(text, mutated)
            r = self.mutate(case, lambda d: None, brief=self.write("brief.md", mutated))
            self.assertFails(r, needle)
        text = read(CASES["protection-of-energy"]["brief"])
        mutated = text.replace("## Offer\n\nNone.", "## Offer\n\n{{discount_value}} off with code {{discount_code}}.")
        self.assertNotEqual(text, mutated)
        r = self.mutate("protection-of-energy", lambda d: None, brief=self.write("brief.md", mutated))
        self.assertFails(r, "brief carries an offer")
        text = read(CASES["fixture"]["brief"])
        mutated = text.replace("{{hero_photo}}", "{{lifestyle_photo}}")
        r = self.mutate("fixture", lambda d: None, brief=self.write("brief.md", mutated))
        self.assertFails(r, "{{lifestyle_photo}}")


class StrategistTests(Tmp):
    def go(self, case, fn, intake_fn=None):
        c = CASES[case]
        doc = load(os.path.join(c["dir"], "strategist.json"))
        fn(doc)
        intake = load(os.path.join(c["dir"], "intake.json"))
        if intake_fn:
            intake_fn(intake)
        self.write("intake.json", intake)
        return check("strategist_check.py", self.write("strategist.json", doc))

    def assertFails(self, r, needle):
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn(needle, r.stdout)

    def test_both_briefs_give_three_distinct_axes(self):
        schema = load(os.path.join(CREW, "strategist", "schema.json"))
        for name, c in CASES.items():
            doc = load(os.path.join(c["dir"], "strategist.json"))
            self.assertEqual(run.validate(doc, schema), [], name)
            self.assertEqual(len({a["axis"] for a in doc["angles"]}), 3, name)
            r = check("strategist_check.py", os.path.join(c["dir"], "strategist.json"))
            self.assertEqual(r.returncode, 0, name + r.stdout)

    def test_two_angles_sharing_an_axis_fail(self):
        for case in CASES:
            def same(d):
                d["angles"][1]["axis"] = d["angles"][0]["axis"]
            self.assertFails(self.go(case, same), "repeats")

    def test_unsupported_axes_fail(self):
        def urgency(d):
            d["angles"][2]["axis"] = "urgency"
        self.assertFails(self.go("protection-of-energy", urgency), "urgency needs an offer")

        def proof(d):
            d["angles"][2]["axis"] = "proof"
        self.assertFails(self.go("protection-of-energy", proof), "proof needs a sourced quote")
        # urgency passes when the intake carries an offer as tokens
        r = self.go("fixture", lambda d: None)
        self.assertEqual(r.returncode, 0, r.stdout)

        def no_offer(i):
            i["offer"] = None
        self.assertFails(self.go("fixture", lambda d: None, no_offer), "urgency needs an offer")

    def test_missing_intake_fails(self):
        c = CASES["protection-of-energy"]
        r = check("strategist_check.py", self.write("strategist.json", load(os.path.join(c["dir"], "strategist.json"))))
        self.assertFails(r, "no intake.json")

    def test_other_mutations_fail(self):
        def count(d):
            d["angles"].pop()
        self.assertFails(self.go("protection-of-energy", count), "default_route_count")

        def module(d):
            d["angles"][0]["opening_module"] = "M05"
        self.assertFails(self.go("protection-of-energy", module), "carries no copy")

        def long(d):
            d["angles"][0]["lead_line"] = "A " * 80
        self.assertFails(self.go("protection-of-energy", long), "limit is 140")

        def lower(d):
            d["angles"][0]["lead_line"] = "scorpio season is here"
        self.assertFails(self.go("protection-of-energy", lower), "sentence case")

        def figure(d):
            d["angles"][0]["lead_line"] = "Save 20% on _protection_"
        self.assertFails(self.go("protection-of-energy", figure), "figure")

        def registers(d):
            for a in d["angles"]:
                a["register"] = "real"
        self.assertFails(self.go("protection-of-energy", registers), "one register")

        def exemplar(d):
            d["angles"][0]["exemplar_ref"] = "hlr-email-headline-999"
        self.assertFails(self.go("protection-of-energy", exemplar), "exemplar_ref")

        def brief_never(d):
            d["angles"][0]["lead_line"] = "Our best seller in _protection_"
        self.assertFails(self.go("protection-of-energy", brief_never), "prohibited pattern")

        def slug(d):
            d["brief_slug"] = "another-brief"
        self.assertFails(self.go("protection-of-energy", slug), "slug")

        def emdash(d):
            d["angles"][1]["rationale"] += " " + EM
        self.assertFails(self.go("protection-of-energy", emdash), "em dash")


class PaidTests(Tmp):
    def go(self, fn, specs_fn=None):
        doc = load(os.path.join(FX, "dry-run", "paid.json"))
        fn(doc)
        self.write("intake.json", load(os.path.join(FX, "dry-run", "intake.json")))
        out = self.write("paid.json", doc)
        pack = os.path.join(ROOT, "brand-pack")
        if specs_fn:
            import shutil
            pack = os.path.join(self.tmp, "pack")
            shutil.copytree(os.path.join(ROOT, "brand-pack"), pack, ignore=shutil.ignore_patterns("web"))
            sp = load(os.path.join(pack, "placement-specs.json"))
            specs_fn(sp)
            self.write("pack/placement-specs.json", sp)
        return check("paid_check.py", out, "--pack", pack)

    def test_specs_file_is_all_null_and_unverified(self):
        sp = load(os.path.join(ROOT, "brand-pack", "placement-specs.json"))
        self.assertEqual(sp["_status"], "unverified")
        self.assertEqual(sp["gap"]["owner"], "Eddie")
        def nums(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if k in ("meta",) or isinstance(v, (dict, list)):
                        nums(v)
                    elif k.endswith(("_chars", "_px")):
                        self.assertIsNone(v, k)
        nums(sp["meta"])

    def test_fixture_passes_and_mutations_fail(self):
        r = self.go(lambda d: None)
        self.assertEqual(r.returncode, 0, r.stdout)

        def conf(d):
            d["ad_sets"][0]["spec_confidence"] = "confirmed"
        r = self.go(conf)
        self.assertEqual(r.returncode, 1)
        self.assertIn("placement-specs.json's status", r.stdout)

        def num(d):
            d["ad_sets"][0]["headline"][0] = "Seven days of calm"
            d["ad_sets"][0]["primary_text"][0] += " 7 days."
        r = self.go(num)
        self.assertEqual(r.returncode, 1)
        self.assertIn("the number 7", r.stdout)

    def test_a_filled_limit_is_enforced(self):
        def fill(sp):
            sp["meta"]["single_image"]["headline_max_chars"] = 10
        r = self.go(lambda d: None, fill)
        self.assertEqual(r.returncode, 1)
        self.assertIn("limit 10", r.stdout)


class EditorTests(Tmp):
    S = os.path.join(FX, "editor-seeded")

    def test_seeded_faults_fail_before_and_the_edits_fix_exactly_those(self):
        self.assertEqual(check("email_check.py", os.path.join(self.S, "email.json")).returncode, 1)
        self.assertEqual(check("paid_check.py", os.path.join(self.S, "paid.json")).returncode, 1)
        r = check("editor_check.py", os.path.join(self.S, "editor.json"), "--run", self.S)
        self.assertEqual(r.returncode, 0, r.stdout)
        editor = load(os.path.join(self.S, "editor.json"))
        outputs = {"email": load(os.path.join(self.S, "email.json")), "paid": load(os.path.join(self.S, "paid.json"))}
        run_dir = os.path.join(self.tmp, "run")
        os.makedirs(run_dir)
        for n in ("intake.json",):
            self.write("run/" + n, load(os.path.join(self.S, n)))
        run.apply_edits(editor, outputs, run_dir, {"dir": os.path.join(ROOT, "brand-pack")})
        for stage in ("email", "paid"):
            applied = load(os.path.join(run_dir, stage + ".edited.json"))
            clean = load(os.path.join(FX, "dry-run", stage + ".json"))
            self.assertEqual(applied, clean, stage)
            script = "email_check.py" if stage == "email" else "paid_check.py"
            r = check(script, os.path.join(run_dir, stage + ".edited.json"))
            self.assertEqual(r.returncode, 0, r.stdout)
        seeded = [e["path"] for e in editor["edits"]]
        self.assertEqual(len(seeded), 4)
        self.assertEqual(len(set(seeded)), 4)

    def test_editor_mutations_fail(self):
        def mutate(fn):
            d = load(os.path.join(self.S, "editor.json"))
            fn(d)
            return check("editor_check.py", self.write("editor.json", d), "--run", self.S)
        r = mutate(lambda d: d["edits"][0].update(before="not the string"))
        self.assertEqual(r.returncode, 1)
        self.assertIn("before does not match", r.stdout)
        r = mutate(lambda d: d["edits"][1].update(after=d["edits"][1]["after"] + " " * 0 + "x" * 200))
        self.assertEqual(r.returncode, 1)
        self.assertIn("allows", r.stdout)
        r = mutate(lambda d: d["edits"][3].update(after="Only $9 today."))
        self.assertEqual(r.returncode, 1)
        r = mutate(lambda d: d["edits"].append(dict(d["edits"][0])))
        self.assertEqual(r.returncode, 1)
        self.assertIn("a second edit", r.stdout)


class EmailAndHygieneTests(Tmp):
    def go(self, case, fn, intake_fn=None):
        c = CASES[case]
        doc = load(os.path.join(c["dir"], "email.json"))
        fn(doc)
        intake = load(os.path.join(c["dir"], "intake.json"))
        if intake_fn:
            intake_fn(intake)
        self.write("intake.json", intake)
        return check("email_check.py", self.write("email.json", doc))

    def test_both_briefs_give_a_valid_block_list(self):
        schema = load(os.path.join(CREW, "email", "schema.json"))
        for name, c in CASES.items():
            p = os.path.join(c["dir"], "email.json")
            self.assertEqual(run.validate(load(p), schema), [], name)
            r = check("email_check.py", p)
            self.assertEqual(r.returncode, 0, name + r.stdout)

    def test_mutated_email_fails(self):
        cases = []

        def long(d):
            d["hero"]["slots"]["M02.headline"] = "Keep your energy _yours_ " * 8
        cases.append((long, "max_chars"))

        def foreign(d):
            d["blocks"][0]["slots"]["M04.body"] += " Pair it with The Master Protection Spell Bracelet."
        cases.append((foreign, "does not carry"))

        def price(d):
            d["blocks"][0]["slots"]["M04.body"] += " From $48."
        cases.append((price, "typed"))

        def token(d):
            d["blocks"][0]["slots"]["M04.body"] += " {{invented_token}}"
        cases.append((token, "neither in the intake"))

        def name(d):
            d["blocks"][-1]["slots"]["M03.name"] = "The Invented Set"
        cases.append((name, "not a display name"))

        def claim(d):
            d["blocks"][0]["slots"]["M04.body"] += " It can cure worry."
        cases.append((claim, "prohibited"))

        def slug(d):
            d["brief_slug"] = "other"
        cases.append((slug, "slug"))

        def amp(d):
            d["blocks"][0]["slots"]["M04.body"] += " Calm & still."
        cases.append((amp, "ampersand"))

        for fn, needle in cases:
            r = self.go("protection-of-energy", fn)
            self.assertEqual(r.returncode, 1, (needle, r.stdout))
            self.assertIn(needle, r.stdout)

    def test_em_dash_baseline_is_empty(self):
        lines = [l for l in read(os.path.join(ROOT, "build", "emdash_baseline.txt")).splitlines() if l.strip() and not l.startswith("#")]
        self.assertEqual(lines, [])


if __name__ == "__main__":
    unittest.main()
