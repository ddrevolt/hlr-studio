#!/usr/bin/env python3
"""klaviyo: the assembled email HTML into one Klaviyo template request. It never sends and never creates a campaign.
Usage:
  python3 crew/producers/klaviyo.py --run <run folder> [--width 600|1200] [--subject 1|2|3] [--name NAME] [--out request.json]
      dry run (the default): assembles the HTML, writes the request body and headers to --out (else <run>/klaviyo.request.json).
      The key is never read, and the header shows the placeholder <KLAVIYO_API_KEY>. No network.
  python3 crew/producers/klaviyo.py --run <run folder> --live
      POST /api/templates with KLAVIYO_API_KEY (private key, Templates write). Refuses without the key, and refuses when the
      assembler reports an unfilled slot. Prints the new template id; record it in LEARNINGS. Waits on backlog klaviyo-access.
Standard library only. Request shape and revision: [unverified], written from the public API as the author knows it; the
runner may not read developers.klaviyo.com, so a person confirms both against Klaviyo's documentation before the first live call
(set KLAVIYO_REVISION to override). Merge tokens stay as tokens: Klaviyo reads {{ name }} as a variable, so each token in the
report's merge_tokens needs a person to map it (a Klaviyo tag or a value) before a send. Not mapped here."""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "email_html"))
import assemble as asm  # noqa: E402

URL = "https://a.klaviyo.com/api/templates"
REVISION = "2024-10-15"  # [unverified] API revision header; override with KLAVIYO_REVISION
PLACEHOLDER = "<KLAVIYO_API_KEY>"


def build_request(run_dir, width=600, subject=1, name=None, revision=None):
    """Return (request dict, assembler report). The request holds url, headers (key as a placeholder) and body."""
    doc, report = asm.assemble(run_dir, width, subject)
    with open(os.path.join(run_dir, "email.edited.json" if os.path.exists(os.path.join(run_dir, "email.edited.json")) else "email.json"), encoding="utf-8") as fh:
        email = json.load(fh)
    name = name or "HLR, %s, angle %s, %s wide" % (email.get("brief_slug", "email"), email.get("angle", "?"), width)
    req = {
        "method": "POST", "url": URL,
        "headers": {
            "Authorization": "Klaviyo-API-Key " + PLACEHOLDER,
            "revision": revision or os.environ.get("KLAVIYO_REVISION") or REVISION,
            "accept": "application/vnd.api+json",
            "content-type": "application/vnd.api+json",
        },
        "body": {"data": {"type": "template", "attributes": {"name": name, "editor_type": "CODE", "html": doc}}},
    }
    return req, report


def post(req, key, opener=urllib.request.urlopen):
    headers = dict(req["headers"])
    headers["Authorization"] = "Klaviyo-API-Key " + key
    r = urllib.request.Request(req["url"], data=json.dumps(req["body"]).encode("utf-8"), headers=headers, method="POST")
    with opener(r, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--run", required=True)
    ap.add_argument("--width", type=int, default=600, choices=(600, 1200))
    ap.add_argument("--subject", type=int, default=1, choices=(1, 2, 3))
    ap.add_argument("--name")
    ap.add_argument("--out")
    ap.add_argument("--live", action="store_true")
    a = ap.parse_args(argv)
    req, report = build_request(a.run, a.width, a.subject, a.name)
    if report["problems"]:
        print(json.dumps({"problems": report["problems"]}, indent=1))
        return 1
    if not a.live:
        out = a.out or os.path.join(a.run, "klaviyo.request.json")
        with open(out, "w", encoding="utf-8") as fh:
            json.dump(req, fh, indent=1)
            fh.write("\n")
        print(json.dumps({"mode": "dry-run", "wrote": out, "template_name": req["body"]["data"]["attributes"]["name"],
                          "merge_tokens_to_map": report["merge_tokens"], "sends": False, "campaign": False}, indent=1))
        return 0
    key = os.environ.get("KLAVIYO_API_KEY")
    if not key:
        print("KLAVIYO_API_KEY is not set: a private key with Templates write is needed (backlog klaviyo-access). Nothing was sent.")
        return 3
    try:
        res = post(req, key)
    except urllib.error.HTTPError as e:
        print("Klaviyo refused the request: HTTP %s" % e.code)
        return 4
    except (OSError, ValueError):
        print("The request to Klaviyo failed before an answer came back. Nothing was confirmed sent.")
        return 4
    print(json.dumps({"mode": "live", "template_id": res.get("data", {}).get("id")}, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
