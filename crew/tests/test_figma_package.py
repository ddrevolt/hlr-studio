"""Tests for the paid masters agent package (backlog paid-package). Run: python3 -m unittest discover -s crew/tests"""
import os
import re
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
CREW = os.path.dirname(HERE)
ROOT = os.path.dirname(CREW)
sys.path.insert(0, os.path.join(CREW, "producers"))
import figma_package as fp  # noqa: E402

COMMITTED = os.path.join(ROOT, "outputs", "step-9-paid", "agent-package.md")


class PackageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.text, cls.ctx = fp.compile_all("2026-10-31")

    def test_generated_text_lints_clean(self):
        self.assertEqual(fp.lint(self.text, self.ctx), [])

    def test_committed_file_matches_the_generator(self):
        with open(COMMITTED, encoding="utf-8") as fh:
            self.assertEqual(fh.read(), self.text, "rerun crew/producers/figma_package.py")

    def test_one_lint_case_per_format(self):
        parts = re.split(r"(?m)^## Package ", self.text)[1:]
        self.assertEqual(len(parts), 3)
        for fmt, part in zip(fp.FORMATS, parts):
            w, h = fmt["size"]
            self.assertIn("%dx%d px" % (w, h), part)
            self.assertIn("LICENSE FLAG (raised)", part)
            self.assertIn("KEEP-CLEAR (UNVERIFIED)", part)

    def test_every_slot_of_every_meta_module_appears_once_per_format(self):
        for fmt in fp.FORMATS:
            part = re.split(r"(?m)^## Package ", self.text)[1:][fp.FORMATS.index(fmt)]
            for mid in fp.META_MODULES:
                mod = self.ctx["mods"][mid]
                if fmt["key"] in mod["sizes"]:
                    for s in mod["slots"]:
                        self.assertEqual(part.count('layer name "%s"' % s["id"]), 1, s["id"])

    def test_end_frame_only_on_story(self):
        a, b, c = re.split(r"(?m)^## Package ", self.text)[1:]
        self.assertNotIn("P09", a)
        self.assertNotIn("P09", b)
        self.assertIn("P09", c)

    def test_every_budget_is_null_and_says_so(self):
        for line in self.text.splitlines():
            if 'layer name "P' in line:
                self.assertIn("budget: none (null in slotmap-paid.yaml", line)

    def test_story_keep_clear_gives_no_number(self):
        story = re.split(r"(?m)^## Package ", self.text)[3]
        seg = story.split("KEEP-CLEAR (UNVERIFIED)")[1].split("ELEMENTS")[0]
        self.assertIn("null", seg)
        self.assertNotRegex(seg.replace("120 px from the foot in 27 board frames", ""), r"\b\d{2,4}\s*px\b")

    def test_only_token_colors_appear(self):
        allowed = {v.lower() for v in self.ctx["colors"].values()}
        for h in set(re.findall(r"#[0-9a-fA-F]{6}\b", self.text)):
            self.assertIn(h.lower(), allowed)

    def test_no_em_dash(self):
        self.assertNotIn(fp.EM, self.text)

    def test_slot_counts_by_hand(self):
        parts = re.split(r"(?m)^## Package ", self.text)[1:]
        self.assertEqual([len(re.findall(r'layer name "P\d+\.', p)) for p in parts], [50, 50, 51])

    def test_story_asks_for_no_write_outside_frames(self):
        story = re.split(r"(?m)^## Package ", self.text)[3]
        self.assertNotIn("new local variables", story)

    def test_source_status_stated(self):
        self.assertIn("proposed, unbuilt", self.text.split("## Package ")[0])

    def test_merge_values_not_invented_copy(self):
        for m in re.findall(r'Text "([^"]*)", layer name "([^"]*)"', self.text):
            self.assertEqual(m[0], "{{%s}}" % m[1])


class MutationTests(unittest.TestCase):
    """The lint must catch each fault it claims to catch."""

    @classmethod
    def setUpClass(cls):
        cls.text, cls.ctx = fp.compile_all("2026-10-31")

    def lint_after(self, old, new, count=1):
        self.assertIn(old, self.text)
        return fp.lint(self.text.replace(old, new, count), self.ctx)

    def test_dropped_license_flag_in_each_format(self):
        self.assertEqual(self.text.count("LICENSE FLAG (raised)"), 3)
        for i in range(3):
            probs = fp.lint(self._swap_nth(i), self.ctx)
            self.assertTrue(any("license flag missing" in p for p in probs), probs)

    def _swap_nth(self, i):
        idx = -1
        t = self.text
        for _ in range(i + 1):
            idx = t.index("LICENSE FLAG (raised)", idx + 1)
        return t[:idx] + "LICENSE FLAG (removed)" + t[idx + len("LICENSE FLAG (raised)"):]

    def test_dropped_slot_is_caught(self):
        probs = self.lint_after('layer name "P01.headline"', 'layer name "P01.headlin"')
        self.assertTrue(any("P01.headline" in p for p in probs), probs)

    def test_dropped_budget_statement_is_caught(self):
        probs = self.lint_after("budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm)", "ok")
        self.assertTrue(any("without a budget" in p for p in probs), probs)

    def test_wrong_canvas_is_caught(self):
        probs = self.lint_after("1080x1920 px", "1080x1919 px")
        self.assertTrue(any("canvas size" in p for p in probs), probs)

    def test_keep_clear_unflag_is_caught(self):
        probs = self.lint_after("KEEP-CLEAR (UNVERIFIED)", "KEEP-CLEAR", count=3)
        self.assertTrue(any("keep-clear" in p for p in probs), probs)

    def test_invented_color_is_caught(self):
        probs = self.lint_after("#fbf7ef", "#ff0000")
        self.assertTrue(any("not from tokens" in p for p in probs), probs)

    def test_write_outside_frames_is_caught(self):
        probs = self.lint_after("add no guide layer and no variable", "add two new local variables")
        self.assertTrue(any("write outside" in p for p in probs), probs)

    def test_em_dash_is_caught(self):
        probs = fp.lint(self.text + "x" + fp.EM + "y", self.ctx)
        self.assertIn("em dash present", probs)


if __name__ == "__main__":
    unittest.main()
