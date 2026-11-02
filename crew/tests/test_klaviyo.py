"""Tests for the Klaviyo template producer (backlog klaviyo-push). Run: python3 -m unittest discover -s crew/tests"""
import json
import os
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
CREW = os.path.dirname(HERE)
ROOT = os.path.dirname(CREW)
sys.path.insert(0, os.path.join(CREW, "producers"))
import klaviyo as kv  # noqa: E402

RUN = os.path.join(CREW, "fixtures", "protection-of-energy")
COMMITTED = os.path.join(ROOT, "outputs", "step-8-email", "klaviyo-dry-run", "protection-of-energy-600.request.json")


class KlaviyoTests(unittest.TestCase):
    def test_request_shape(self):
        """Shape [unverified] against Klaviyo's documentation."""
        req, report = kv.build_request(RUN, 600)
        self.assertEqual(report["problems"], [])
        d = req["body"]["data"]
        self.assertEqual(d["type"], "template")
        self.assertEqual(d["attributes"]["editor_type"], "CODE")
        self.assertTrue(d["attributes"]["html"].startswith("<!doctype html>"))
        self.assertEqual(req["method"], "POST")
        self.assertTrue(req["url"].endswith("/api/templates"))

    def test_dry_run_never_holds_a_key(self):
        with mock.patch.dict(os.environ, {"KLAVIYO_API_KEY": "pk_secret_value"}):
            req, _ = kv.build_request(RUN, 600)
        self.assertNotIn("pk_secret_value", json.dumps(req))
        self.assertIn(kv.PLACEHOLDER, req["headers"]["Authorization"])

    def test_dry_run_writes_file_and_exits_0_without_network(self):
        with tempfile.TemporaryDirectory() as t, mock.patch("urllib.request.urlopen", side_effect=AssertionError("network")):
            out = os.path.join(t, "r.json")
            self.assertEqual(kv.main(["--run", RUN, "--out", out]), 0)
            with open(out, encoding="utf-8") as fh:
                self.assertIn("html", json.load(fh)["body"]["data"]["attributes"])

    def test_live_without_key_sends_nothing(self):
        env = {k: v for k, v in os.environ.items() if k != "KLAVIYO_API_KEY"}
        with mock.patch.dict(os.environ, env, clear=True), mock.patch("urllib.request.urlopen", side_effect=AssertionError("network")):
            self.assertEqual(kv.main(["--run", RUN, "--live"]), 3)

    def test_live_posts_once_with_the_key_in_the_header(self):
        seen = []

        class R:
            def read(self):
                return b'{"data": {"id": "TPL123"}}'
            def __enter__(self):
                return self
            def __exit__(self, *x):
                return False

        def opener(r, timeout=0):
            seen.append(r)
            return R()
        req, _ = kv.build_request(RUN, 600)
        res = kv.post(req, "pk_test", opener)
        self.assertEqual(res["data"]["id"], "TPL123")
        self.assertEqual(len(seen), 1)
        self.assertEqual(seen[0].get_header("Authorization"), "Klaviyo-API-Key pk_test")

    def test_unfilled_slot_blocks_the_request(self):
        with tempfile.TemporaryDirectory() as t:
            for f in ("email.json", "intake.json"):
                src = os.path.join(RUN, f)
                if os.path.exists(src):
                    with open(src, encoding="utf-8") as fh:
                        data = json.load(fh)
                    if f == "email.json":
                        data["hero"]["slots"].pop(next(iter(data["hero"]["slots"])))
                    with open(os.path.join(t, f), "w", encoding="utf-8") as fh:
                        json.dump(data, fh)
            self.assertEqual(kv.main(["--run", t, "--out", os.path.join(t, "o.json")]), 1)
            self.assertFalse(os.path.exists(os.path.join(t, "o.json")))

    def _broken_run(self, t):
        for f in ("email.json", "intake.json"):
            with open(os.path.join(RUN, f), encoding="utf-8") as fh:
                data = json.load(fh)
            if f == "email.json":
                data["hero"]["slots"].pop("M02.eyebrow")
            with open(os.path.join(t, f), "w", encoding="utf-8") as fh:
                json.dump(data, fh)

    def test_live_with_a_key_still_refuses_an_unfilled_slot(self):
        with tempfile.TemporaryDirectory() as t, mock.patch.dict(os.environ, {"KLAVIYO_API_KEY": "pk_x"}), \
                mock.patch("urllib.request.urlopen", side_effect=AssertionError("network")):
            self._broken_run(t)
            self.assertEqual(kv.main(["--run", t, "--live"]), 1)

    def test_cli_dry_run_file_and_stdout_hold_no_key(self):
        import io
        import contextlib
        buf = io.StringIO()
        with tempfile.TemporaryDirectory() as t, mock.patch.dict(os.environ, {"KLAVIYO_API_KEY": "pk_secret_value"}):
            out = os.path.join(t, "r.json")
            with contextlib.redirect_stdout(buf):
                self.assertEqual(kv.main(["--run", RUN, "--out", out]), 0)
            with open(out, encoding="utf-8") as fh:
                self.assertNotIn("pk_secret_value", fh.read())
        self.assertNotIn("pk_secret_value", buf.getvalue())

    def test_network_failure_exits_4(self):
        with mock.patch.dict(os.environ, {"KLAVIYO_API_KEY": "pk_x"}), mock.patch("urllib.request.urlopen", side_effect=OSError("down")):
            self.assertEqual(kv.main(["--run", RUN, "--live"]), 4)

    def test_committed_example_matches_the_generator(self):
        req, _ = kv.build_request(RUN, 600)
        with open(COMMITTED, encoding="utf-8") as fh:
            self.assertEqual(json.load(fh), req, "rerun crew/producers/klaviyo.py for the fixture")


if __name__ == "__main__":
    unittest.main()
