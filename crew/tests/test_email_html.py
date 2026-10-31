"""Tests for crew/producers/email_html.py: every module has a twin whose slots match slotmap.yaml, the
assembler renders protection of energy with no unfilled slot, both widths render, no em dash.
Run: python3 -m unittest discover -s crew/tests"""
import copy
import json
import os
import re
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
CREW = os.path.dirname(HERE)
ROOT = os.path.dirname(CREW)
sys.path.insert(0, os.path.join(CREW, "producers"))
sys.path.insert(0, os.path.join(CREW, "checks"))
import common  # noqa: E402
import email_html as eh  # noqa: E402

EMAIL = os.path.join(CREW, "fixtures", "protection-of-energy", "email.json")
TWINS = os.path.join(ROOT, "outputs", "step-8-email", "twins")
EM = chr(0x2014)


class TwinTests(unittest.TestCase):
    def test_every_module_has_a_builder(self):
        lib = common.read_json(os.path.join(ROOT, "brand-pack", "module-library.json"))
        mods = sorted(k for k in lib["MOD_LABEL"] if k.startswith("M"))
        self.assertEqual(mods, sorted(eh.BUILDERS))

    def test_twin_slots_match_slotmap(self):
        slots, by_module, composed = common.slotmap(os.path.join(ROOT, "brand-pack"))
        for mid in sorted(eh.BUILDERS):
            used = set()
            for opts in ({}, {"@tall": True, "@show_cta": True, "@show_legal": True, "@show_press": True, "@show_closing": True,
                              "@style": "star", "@layout": "split"}):
                c = eh.fixture_ctx(mid, 600, dict(eh.TWIN_STATES.get(mid, {})))
                c.values.update(opts)
                eh.BUILDERS[mid](c)
                used |= set(c.used)
            allowed = set(by_module.get(mid, []))
            todo, seen = list(composed.get(mid, [])), set()
            while todo:  # composed elements, and what they compose in turn (M15 -> E07 -> E02)
                comp = todo.pop()
                if comp in seen:
                    continue
                seen.add(comp)
                allowed |= {s for s in slots if s == comp or s.startswith(comp.split(".")[0] + ".")}
                todo += composed.get(comp.split(".")[0], [])
            self.assertFalse(used - allowed, "%s uses slots the slot map does not give it: %s" % (mid, sorted(used - allowed)))
            for sid in by_module.get(mid, []):
                if not slots[sid].get("option"):
                    self.assertIn(sid, used, "%s never renders its slot %s" % (mid, sid))

    def test_twins_render_at_both_widths_with_no_em_dash(self):
        for mid in sorted(eh.BUILDERS):
            for w in (600, 1200):
                doc, _ = eh.build_twin(mid, w)
                self.assertNotIn(EM, doc)
                self.assertIn('width="%d"' % w, doc)
                self.assertIn("LICENSE FLAG", doc)

    def test_twins_and_screenshots_on_disk(self):
        for mid in eh.BUILDERS:
            for w in (600, 1200):
                for ext in ("html", "png"):
                    self.assertTrue(os.path.exists(os.path.join(TWINS, "%s-%d.%s" % (mid, w, ext))), "%s-%d.%s" % (mid, w, ext))

    def test_disk_twins_are_current(self):
        for mid in sorted(eh.BUILDERS):
            doc, _ = eh.build_twin(mid, 600)
            with open(os.path.join(TWINS, "%s-600.html" % mid), encoding="utf-8") as fh:
                self.assertEqual(fh.read(), doc, "%s twin on disk is stale: rerun email_html.py twins" % mid)


class AssembleTests(unittest.TestCase):
    def setUp(self):
        self.email = common.read_json(EMAIL)

    def test_protection_of_energy_has_no_unfilled_slot(self):
        for w in (600, 1200):
            doc, rep = eh.assemble(self.email, w)
            self.assertNotIn("[M0", doc)
            self.assertNotIn("[E0", doc)
            self.assertNotIn(EM, doc)
            self.assertIn("<em>yours</em>", doc)
            self.assertEqual(rep["modules"], ["M01", "M02", "M04", "M06", "M04", "M03", "M14", "M09"])

    def test_copy_comes_through_and_tokens_stay_tokens(self):
        doc, rep = eh.assemble(self.email, 600)
        self.assertIn("SCORPIO SEASON", doc)
        self.assertIn("{{footer_disclaimer}}", doc)
        self.assertNotIn("<em>nav", doc)
        self.assertIn("{{url_the_classic_bracelet_in_black_tourmaline}}", doc)
        self.assertIn('href="{{unsubscribe_url}}"', doc)
        self.assertIn("{{cta_url}}", rep["tokens"])

    def test_a_missing_required_slot_fails_loudly(self):
        bad = copy.deepcopy(self.email)
        del bad["hero"]["slots"]["M02.headline"]
        with self.assertRaises(eh.UnfilledSlot):
            eh.assemble(bad, 600)

    def test_images_replace_placeholders(self):
        doc, _ = eh.assemble(self.email, 600, images={"card0": "https://example.invalid/a.jpg"})
        self.assertIn('src="https://example.invalid/a.jpg"', doc)
        self.assertIn("image placeholder", doc)

    def test_hero_text_is_white_on_a_photo(self):
        doc, _ = eh.assemble(self.email, 600, images={"M02.image": "https://example.invalid/h.jpg"})
        hero = doc[doc.index("M02 Hero"):doc.index("M04")]
        self.assertIn("color:#ffffff", hero)
        self.assertNotIn("color:#353535", hero.split("</tr>")[2])

    def test_footer_nav_labels_link_to_tokens(self):
        doc, rep = eh.assemble(self.email, 600)
        self.assertIn('href="{{footer_nav_1_url}}"', doc)
        self.assertIn("{{footer_nav_3_url}}", rep["tokens"])

    def test_header_choice(self):
        doc, rep = eh.assemble(self.email, 600, header="M23")
        self.assertEqual(rep["modules"][0], "M23")


if __name__ == "__main__":
    unittest.main()
