"""Tests for crew/run.py: the built-in validator, the dry run end to end, the stop at the human pick,
the resume on a pick file, and every prompt rendering with the inputs it names.
Run: python3 -m unittest discover -s crew/tests"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
CREW = os.path.dirname(HERE)
ROOT = os.path.dirname(CREW)
sys.path.insert(0, CREW)
import run  # noqa: E402

BRIEF = os.path.join(CREW, "fixtures", "brief.md")
PY = sys.executable


def crew_run(runs_dir, *extra):
    cmd = [PY, os.path.join(CREW, "run.py"), "--brief", BRIEF, "--dry-run", "--runs", runs_dir] + list(extra)
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


class ValidatorTests(unittest.TestCase):
    schema = {
        "type": "object", "additionalProperties": False, "required": ["name", "tags", "kind"],
        "properties": {
            "name": {"type": "string", "pattern": "^[a-z]+$", "minLength": 2},
            "tags": {"type": "array", "minItems": 1, "maxItems": 2, "items": {"type": "string"}},
            "kind": {"type": "string", "enum": ["a", "b"]},
            "note": {"type": ["string", "null"]},
            "n": {"type": "integer", "minimum": 1},
        },
    }

    def test_good_document(self):
        self.assertEqual(run.validate({"name": "ab", "tags": ["x"], "kind": "a", "note": None, "n": 2}, self.schema), [])

    def test_bad_documents(self):
        bad = [
            ({"tags": ["x"], "kind": "a"}, "missing required"),
            ({"name": "AB", "tags": ["x"], "kind": "a"}, "pattern"),
            ({"name": "ab", "tags": [], "kind": "a"}, "minItems"),
            ({"name": "ab", "tags": ["x", "y", "z"], "kind": "a"}, "maxItems"),
            ({"name": "ab", "tags": ["x"], "kind": "c"}, "enum"),
            ({"name": "ab", "tags": ["x"], "kind": "a", "extra": 1}, "additional property"),
            ({"name": "ab", "tags": [1], "kind": "a"}, "expected type string"),
            ({"name": "ab", "tags": ["x"], "kind": "a", "n": True}, "expected type integer"),
            ({"name": "ab", "tags": ["x"], "kind": "a", "n": 0}, "minimum"),
        ]
        for doc, needle in bad:
            errs = run.validate(doc, self.schema)
            self.assertTrue(errs, doc)
            self.assertTrue(any(needle in e for e in errs), (needle, errs))

    def test_fixtures_match_their_schemas(self):
        for stage in run.MODEL_STAGES:
            schema = run.read_json(os.path.join(CREW, stage, "schema.json"))
            doc = run.read_json(os.path.join(CREW, "fixtures", "dry-run", stage + ".json"))
            self.assertEqual(run.validate(doc, schema), [], stage)

    def test_schema_refuses_em_dash_in_copy(self):
        schema = run.read_json(os.path.join(CREW, "strategist", "schema.json"))
        doc = run.read_json(os.path.join(CREW, "fixtures", "dry-run", "strategist.json"))
        doc["angles"][0]["lead_line"] = "A quiet week " + chr(0x2014) + " kept"
        self.assertTrue(any("pattern" in e for e in run.validate(doc, schema)))


class PromptTests(unittest.TestCase):
    def test_every_prompt_renders_with_its_inputs(self):
        pack = run.load_pack(os.path.join(ROOT, "brand-pack"))
        ctx = run.build_context(pack, run.read_text(BRIEF), "crew/fixtures/brief.md", "fixtures")
        for stage in run.MODEL_STAGES:
            ctx[stage] = run.read_json(os.path.join(CREW, "fixtures", "dry-run", stage + ".json"))
        ctx["pick"] = {"angle": 1, "by": "test"}
        ctx["picked_angle"] = ctx["strategist"]["angles"][0]
        for stage in run.MODEL_STAGES:
            meta, body = run.parse_prompt(os.path.join(CREW, stage, "prompt.md"))
            self.assertEqual(meta.get("stage"), stage)
            self.assertIn("check", meta, stage)
            text = run.render(body, ctx)
            self.assertNotIn("{{brief_slug}}", text)
            self.assertIn("## Inputs", body)
            self.assertIn("## Outputs", body)
            self.assertNotIn(chr(0x2014), body, stage)

    def test_merge_tokens_survive_and_inputs_render(self):
        self.assertEqual(run.render("{{price}} {{brief_slug}}", {"brief_slug": "x"}), "{{price}} x")
        with self.assertRaises(run.CrewError):
            run.render("{{include:crew/does-not-exist.md}}", {})


class DryRunTests(unittest.TestCase):
    def setUp(self):
        self.runs = tempfile.mkdtemp(prefix="crew-test-")

    def tearDown(self):
        shutil.rmtree(self.runs, ignore_errors=True)

    def run_dirs(self):
        base = os.path.join(self.runs, "fixtures")
        return [os.path.join(base, d) for d in sorted(os.listdir(base))] if os.path.isdir(base) else []

    def test_stops_at_the_pick_with_exit_2(self):
        p = crew_run(self.runs)
        self.assertEqual(p.returncode, 2, p.stdout + p.stderr)
        self.assertIn("STOPPED for the human pick", p.stdout)
        d = self.run_dirs()[0]
        self.assertTrue(os.path.exists(os.path.join(d, "strategist.json")))
        self.assertFalse(os.path.exists(os.path.join(d, "email.json")))

    def test_completes_with_pick_1_and_exit_0(self):
        p = crew_run(self.runs, "--pick", "1")
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        d = self.run_dirs()[0]
        for name in ("intake", "strategist", "pick", "email", "paid", "editor", "producer"):
            self.assertTrue(os.path.exists(os.path.join(d, name + ".json")), name)
        self.assertFalse(os.path.exists(os.path.join(d, "email.edited.json")))
        self.assertIn("none applied", p.stdout)

    def test_accept_edits_writes_edited_files(self):
        p = crew_run(self.runs, "--pick", "1", "--accept-edits")
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        d = self.run_dirs()[0]
        edited = run.read_json(os.path.join(d, "email.edited.json"))
        editor = run.read_json(os.path.join(d, "editor.json"))
        self.assertEqual(run.pointer_get(edited, editor["edits"][0]["path"]), editor["edits"][0]["after"])

    def test_resumes_on_a_pick_file(self):
        self.assertEqual(crew_run(self.runs).returncode, 2)
        d = self.run_dirs()[0]
        with open(os.path.join(d, "pick.json"), "w") as fh:
            json.dump({"angle": 2, "by": "test"}, fh)
        p = crew_run(self.runs, "--run-dir", d)
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        self.assertIn("reused intake.json", p.stdout)
        self.assertIn("angle 2 (product)", p.stdout)

    def test_until_stops_early(self):
        p = crew_run(self.runs, "--until", "intake")
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        self.assertFalse(os.path.exists(os.path.join(self.run_dirs()[0], "strategist.json")))

    def test_bad_pick_is_a_failure(self):
        p = crew_run(self.runs, "--pick", "9")
        self.assertEqual(p.returncode, 1)
        self.assertIn("FAIL", p.stderr)


if __name__ == "__main__":
    unittest.main()
