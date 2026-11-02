#!/usr/bin/env python3
"""Tests for catalog_lint.py. Run: python3 -I build/design-loop/test_catalog_lint.py (from the repo root).
Each case mutates a copy of the real catalog in memory and asserts the lint names the break."""
import copy, json, os, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
import catalog_lint  # noqa: E402

with open(os.path.join(ROOT, "brand-pack", "design-catalog.json"), encoding="utf-8") as _f:
    REAL = json.load(_f)


def run(cat):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "c.json")
        with open(p, "w", encoding="utf-8") as f:
            f.write(json.dumps(cat, ensure_ascii=False))
        return catalog_lint.lint(p)[1]


def new_design(**kw):
    d = {"id": "HLR-IG-100", "kind": "design", "title": "t", "channel": "organic_instagram", "ratios": ["4x5"],
         "master": {"name": "S01", "node": "334:502"}, "variant": "v", "mode": "A", "source": "new",
         "status": "proposed", "approved_by": None, "approval_ref": None, "content_job": "job", "provenance": "derived",
         "nodes": {"set": "334:502"}, "evidence": [{"tag": "derived", "ref": "x"}],
         "beats": {"id": "HLR-IG-001", "job": "annotated story"}}
    d.update(kw)
    return d


class T(unittest.TestCase):
    def test_real_catalog_passes(self):
        self.assertEqual(run(REAL), [])

    def with_(self, *designs):
        c = copy.deepcopy(REAL)
        c["designs"] += list(designs)
        return run(c)

    def test_good_new_design_passes(self):
        self.assertEqual(self.with_(new_design()), [])

    def test_duplicate_id(self):
        self.assertTrue(any("duplicate id" in e for e in self.with_(new_design(id="HLR-IG-001"))))

    def test_prefix_must_match_channel(self):
        self.assertTrue(any("prefix" in e for e in self.with_(new_design(channel="email"))))

    def test_new_needs_beats(self):
        d = new_design(); del d["beats"]
        self.assertTrue(any("beats" in e for e in self.with_(d)))

    def test_beats_must_name_existing_entry(self):
        self.assertTrue(any("beats" in e for e in self.with_(new_design(beats={"id": "HLR-IG-999", "job": "x"}))))

    def test_approved_needs_approval(self):
        self.assertTrue(any("approved needs" in e for e in self.with_(new_design(status="approved"))))

    def test_approved_non_seed_needs_gates(self):
        errs = self.with_(new_design(status="approved", approved_by="Eddie", approval_ref="r"))
        self.assertTrue(any("needs gates" in e for e in errs))

    def test_gates_pass_when_complete(self):
        g = {k: "pass" for k in catalog_lint.GATE_KEYS}
        errs = self.with_(new_design(status="approved", approved_by="Eddie", approval_ref="r", gates=g))
        self.assertEqual(errs, [])

    def test_null_gate_needs_named_gap(self):
        g = {k: "pass" for k in catalog_lint.GATE_KEYS}; g["contrast"] = None
        errs = self.with_(new_design(status="approved", approved_by="Eddie", approval_ref="r", gates=g))
        self.assertTrue(any("gate_gap" in e for e in errs))

    def test_proposed_cannot_carry_approval(self):
        self.assertTrue(any("proposed must not" in e for e in self.with_(new_design(approved_by="Eddie"))))

    def test_retired_needs_reason_and_replacement(self):
        self.assertTrue(any("retired needs" in e for e in self.with_(new_design(status="retired"))))

    def test_researched_is_reference_only_and_withholds_names(self):
        errs = self.with_(new_design(source="researched"))
        self.assertTrue(any("reference_only" in e for e in errs))
        self.assertTrue(any("outside_names_withheld" in e for e in errs))

    def test_mode_b_on_researched_needs_clearance(self):
        d = new_design(source="researched", mode="B", reference_only=True, outside_names_withheld=True)
        self.assertTrue(any("cleared_by" in e for e in self.with_(d)))
        d["cleared_by"] = "Eddie 2026-11-02"
        self.assertEqual(self.with_(d), [])

    def test_bad_node_id(self):
        self.assertTrue(any("node id" in e for e in self.with_(new_design(nodes={"set": "abc"}))))

    def test_em_dash_fails(self):
        c = copy.deepcopy(REAL); c["_note"] += " a " + chr(0x2014) + " b"
        self.assertTrue(any("em dash" in e for e in run(c)))

    def test_enum_drift_fails(self):
        c = copy.deepcopy(REAL); c["enums"]["status"].append("maybe")
        self.assertTrue(any("enums differ" in e for e in run(c)))

    def test_evidence_needs_tag(self):
        self.assertTrue(any("evidence item" in e for e in self.with_(new_design(evidence=[{"tag": "guess", "ref": "x"}]))))


if __name__ == "__main__":
    unittest.main(verbosity=1)
