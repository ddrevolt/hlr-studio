"""Tests for the email HTML twins and the assembler (backlog email-html). No Playwright needed: the
screenshots are checked by presence. Run: python3 -m unittest discover -s crew/tests"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
CREW = os.path.dirname(HERE)
ROOT = os.path.dirname(CREW)
EH = os.path.join(CREW, "producers", "email_html")
sys.path.insert(0, EH)
sys.path.insert(0, os.path.join(CREW, "checks"))
import twins  # noqa: E402
import assemble  # noqa: E402
import common  # noqa: E402

EM = chr(0x2014)
COMPOSED_OK = {"E01.label", "E02.label", "E06.name", "E07.label", "E07.name"}


class TwinTests(unittest.TestCase):
    def test_every_module_has_a_twin_whose_slots_match_the_slot_map(self):
        for width in (1200, 600):
            t, slots, by_module, composed = twins.all_twins(width)
            self.assertEqual(sorted(t), ["M%02d" % i for i in range(1, 28)])
            for m, frag in t.items():
                ph = twins.placeholders(frag)
                own = set(by_module[m])
                self.assertEqual(own - ph, set(), "%s at %d misses slots" % (m, width))
                self.assertEqual({p for p in ph if p not in own} - COMPOSED_OK, set(), m)
                self.assertNotIn(EM, frag)
                self.assertIn('data-module="%s"' % m, frag)

    def test_twins_and_screenshots_exist_for_both_widths(self):
        for w in (600, 1200):
            for i in range(1, 28):
                m = "M%02d" % i
                self.assertTrue(os.path.isfile(os.path.join(EH, "twins", str(w), m + ".html")), (w, m))
                self.assertTrue(os.path.isfile(os.path.join(EH, "screenshots", str(w), m + ".png")), (w, m))
        for w in (600, 1200):
            self.assertTrue(os.path.isfile(os.path.join(EH, "examples", "protection-of-energy-%d.png" % w)))

    def test_written_twins_are_current(self):
        t, *_ = twins.all_twins(1200)
        for m, frag in t.items():
            with open(os.path.join(EH, "twins", "1200", m + ".html"), encoding="utf-8") as fh:
                self.assertEqual(fh.read().rstrip("\n"), frag, m)

    def test_widths_scale(self):
        a = twins.all_twins(1200)[0]["M04"]
        b = twins.all_twins(600)[0]["M04"]
        self.assertIn('width="1200"', a)
        self.assertIn('width="600"', b)
        self.assertNotEqual(a, b)


class AssemblerTests(unittest.TestCase):
    def run_dir(self, case, mutate=None):
        d = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, d, True)
        src = os.path.join(CREW, "fixtures", case)
        for n in ("email.json", "intake.json"):
            shutil.copy(os.path.join(src, n), d)
        if mutate:
            p = os.path.join(d, "email.json")
            with open(p, encoding="utf-8") as fh:
                doc = json.load(fh)
            mutate(doc)
            with open(p, "w", encoding="utf-8") as fh:
                json.dump(doc, fh)
        return d

    def test_protection_of_energy_renders_with_no_unfilled_slot(self):
        for case in ("protection-of-energy", "dry-run"):
            for w in (600, 1200):
                doc, rep = assemble.assemble(self.run_dir(case), w)
                self.assertEqual(rep["problems"], [], (case, w))
                self.assertEqual(rep["unfilled_slots"], [])
                self.assertNotRegex(doc, r"\{\{[ME]\d\d")
                self.assertNotIn(EM, doc)
                self.assertIn("<em>", doc)

    def test_copy_survives_and_is_escaped(self):
        with open(os.path.join(CREW, "fixtures", "protection-of-energy", "email.json"), encoding="utf-8") as fh:
            email = json.load(fh)
        doc, _ = assemble.assemble(self.run_dir("protection-of-energy"), 1200)
        self.assertIn(email["hero"]["slots"]["M02.body"], doc)
        for card in email["blocks"][1]["cards"]:
            self.assertIn(card["slots"]["E06.name"], doc)
            self.assertIn("{{url_%s}}" % card["product_id"].replace("-", "_"), doc)

        def inject(d):
            d["blocks"][0]["slots"]["M04.body"] = "a <script>x</script> & b"
        doc, rep = assemble.assemble(self.run_dir("protection-of-energy", inject), 1200)
        self.assertNotIn("<script>", doc)
        self.assertIn("&lt;script&gt;", doc)

    def test_merge_tokens_stay_tokens(self):
        doc, rep = assemble.assemble(self.run_dir("dry-run"), 1200)
        for tok in ("discount_value", "discount_code", "offer_window", "cta_url", "footer_disclaimer"):
            self.assertIn("{{%s}}" % tok, doc)
            self.assertIn(tok, rep["merge_tokens"])

    def test_an_unknown_slot_is_a_named_problem(self):
        def bad(d):
            d["blocks"][0]["module"] = "M99"
        doc, rep = assemble.assemble(self.run_dir("protection-of-energy", bad), 1200)
        self.assertTrue(any("M99" in p for p in rep["problems"]))

        def short(d):
            d["blocks"][0]["slots"].pop("M04.headline")
        doc, rep = assemble.assemble(self.run_dir("protection-of-energy", short), 1200)
        self.assertIn("M04.headline", rep["unfilled_slots"])

    def test_cli_exit_codes(self):
        d = self.run_dir("protection-of-energy")
        r = subprocess.run([sys.executable, os.path.join(EH, "assemble.py"), "--run", d, "--width", "600"],
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue(os.path.isfile(os.path.join(d, "email.html")))


if __name__ == "__main__":
    unittest.main()
