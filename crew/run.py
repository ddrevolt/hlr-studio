#!/usr/bin/env python3
"""HLR crew runner: one brief in, validated stage outputs out, on any OpenAI-compatible chat endpoint.

Usage:
  python3 crew/run.py --brief <file> [--dry-run] [--until <stage>] [--pick <n>] [--accept-edits]
                      [--run-dir <dir>] [--pack <dir>] [--runs <dir>]

Stages, in order: intake, strategist, (human pick), email, paid, editor, producer.
Each co-worker is crew/<stage>/prompt.md (front matter: stage, check) plus crew/<stage>/schema.json.
The runner renders the prompt with the inputs it names, calls the model, validates the reply against the
schema, runs the stage's check command, and writes crew/runs/<brief-slug>/<timestamp>/<stage>.json.
After the strategist it stops (exit 2) until crew/runs/.../pick.json exists or --pick is given.

Environment (live runs): CREW_BASE_URL, CREW_MODEL, CREW_API_KEY. XAI_BASE_URL, XAI_MODEL and
XAI_API_KEY are read as fallbacks. --dry-run reads crew/fixtures/dry-run/<stage>.json instead of the
model and needs no key and no network.

Exit codes: 0 done, 2 stopped for the human pick, 1 any failure (one-line reason on stderr).
Python 3.9+, standard library only.
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STAGES = ["intake", "strategist", "email", "paid", "editor", "producer"]
MODEL_STAGES = ["intake", "strategist", "email", "paid", "editor"]
PACK_FILES = {
    "brand_context": "brand-context.md",
    "products": "products.json",
    "voice_contract": "voice-contract.md",
    "route_axes": "route-axes.json",
    "slotmap": "slotmap.yaml",
    "module_library": "module-library.json",
}


class CrewError(Exception):
    pass


# ---------------------------------------------------------------- schema validation (built in)

def validate(doc, schema, path="$"):
    """A small JSON Schema subset: type, required, enum, const, minItems, maxItems, pattern,
    minLength, maxLength, minimum, maximum, properties, items, additionalProperties false.
    Returns a list of error strings; empty means valid."""
    errs = []
    t = schema.get("type")
    if t is not None:
        types = t if isinstance(t, list) else [t]
        if not any(_is_type(doc, x) for x in types):
            errs.append("%s: expected type %s, got %s" % (path, "|".join(types), _type_name(doc)))
            return errs
    if "const" in schema and doc != schema["const"]:
        errs.append("%s: expected const %r" % (path, schema["const"]))
    if "enum" in schema and doc not in schema["enum"]:
        errs.append("%s: %r not in enum %s" % (path, doc, schema["enum"]))
    if isinstance(doc, str):
        if "pattern" in schema and not re.search(schema["pattern"], doc):
            errs.append("%s: %r does not match pattern %s" % (path, doc[:60], schema["pattern"]))
        if "minLength" in schema and len(doc) < schema["minLength"]:
            errs.append("%s: shorter than minLength %d" % (path, schema["minLength"]))
        if "maxLength" in schema and len(doc) > schema["maxLength"]:
            errs.append("%s: longer than maxLength %d" % (path, schema["maxLength"]))
    if isinstance(doc, (int, float)) and not isinstance(doc, bool):
        if "minimum" in schema and doc < schema["minimum"]:
            errs.append("%s: %r below minimum %r" % (path, doc, schema["minimum"]))
        if "maximum" in schema and doc > schema["maximum"]:
            errs.append("%s: %r above maximum %r" % (path, doc, schema["maximum"]))
    if isinstance(doc, list):
        if "minItems" in schema and len(doc) < schema["minItems"]:
            errs.append("%s: %d items, minItems %d" % (path, len(doc), schema["minItems"]))
        if "maxItems" in schema and len(doc) > schema["maxItems"]:
            errs.append("%s: %d items, maxItems %d" % (path, len(doc), schema["maxItems"]))
        if "items" in schema:
            for i, item in enumerate(doc):
                errs.extend(validate(item, schema["items"], "%s[%d]" % (path, i)))
    if isinstance(doc, dict):
        props = schema.get("properties", {})
        for key in schema.get("required", []):
            if key not in doc:
                errs.append("%s: missing required %r" % (path, key))
        for key, sub in props.items():
            if key in doc:
                errs.extend(validate(doc[key], sub, "%s.%s" % (path, key)))
        extra = schema.get("additionalProperties", True)
        if extra is False:
            for key in doc:
                if key not in props:
                    errs.append("%s: additional property %r not allowed" % (path, key))
        elif isinstance(extra, dict):
            for key in doc:
                if key not in props:
                    errs.extend(validate(doc[key], extra, "%s.%s" % (path, key)))
    return errs


def _is_type(v, t):
    if t == "null":
        return v is None
    if t == "boolean":
        return isinstance(v, bool)
    if t == "integer":
        return isinstance(v, int) and not isinstance(v, bool)
    if t == "number":
        return isinstance(v, (int, float)) and not isinstance(v, bool)
    if t == "string":
        return isinstance(v, str)
    if t == "array":
        return isinstance(v, list)
    if t == "object":
        return isinstance(v, dict)
    return False


def _type_name(v):
    for t in ("null", "boolean", "integer", "number", "string", "array", "object"):
        if _is_type(v, t):
            return t
    return type(v).__name__


# ---------------------------------------------------------------- pack and brief

def read_text(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def read_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def load_pack(pack_dir):
    pack = {"dir": pack_dir}
    for key, name in PACK_FILES.items():
        path = os.path.join(pack_dir, name)
        if not os.path.exists(path):
            raise CrewError("pack file missing: %s" % path)
        pack[key] = read_json(path) if name.endswith(".json") else read_text(path)
    return pack


def products_index(products):
    """A compact table of the catalog for prompts: id, display name, category, family, ingredients."""
    rows = []
    for pid, p in products.items():
        if pid.startswith("_") or not isinstance(p, dict):
            continue
        rows.append("%s | %s | %s | %s | %s" % (
            pid, p.get("name", ""), p.get("category", ""), p.get("family", ""),
            ", ".join(p.get("ingredients") or [])))
    return "id | name | category | family | ingredients\n" + "\n".join(rows)


def build_context(pack, brief, brief_path, slug):
    """The inputs a prompt may name as {{placeholders}}; stage outputs and the pick are added as they land."""
    return {
        "brief": brief,
        "brief_path": brief_path,
        "brief_slug": slug,
        "brand_context": pack["brand_context"],
        "products_index": products_index(pack["products"]),
        "voice_contract": pack["voice_contract"],
        "route_axes": pack["route_axes"],
        "slotmap": pack["slotmap"],
        "module_library": pack["module_library"],
    }


def brief_slug(brief_path):
    """brief-protection-of-energy.md gives protection-of-energy; a bare brief.md takes its folder's name."""
    base = os.path.splitext(os.path.basename(brief_path))[0]
    base = re.sub(r"^brief[-_]?", "", base) or os.path.basename(os.path.dirname(os.path.abspath(brief_path)))
    slug = re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")
    return slug or "brief"


# ---------------------------------------------------------------- prompts

def parse_prompt(path):
    """Front matter (key: value lines between --- fences) plus the body."""
    text = read_text(path)
    meta = {}
    body = text
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = text[m.end():]
    return meta, body


def render(body, ctx):
    """{{name}} from ctx (JSON for non-strings); {{include:relative/path}} inlines a file under the repo.
    A placeholder that names no input stays as written: merge tokens such as {{price}} travel through."""
    def include(m):
        rel = m.group(1).strip()
        path = os.path.join(ROOT, rel)
        if not os.path.exists(path):
            raise CrewError("prompt include not found: %s" % rel)
        return read_text(path)
    body = re.sub(r"\{\{include:([^}]+)\}\}", include, body)

    def sub(m):
        key = m.group(1).strip()
        if key not in ctx:
            return m.group(0)
        v = ctx[key]
        return v if isinstance(v, str) else json.dumps(v, indent=1, ensure_ascii=False)
    return re.sub(r"\{\{([a-zA-Z0-9_.]+)\}\}", sub, body)


# ---------------------------------------------------------------- the model call

def extract_json(text):
    try:
        return json.loads(text)
    except ValueError:
        pass
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.S)
    if m:
        try:
            return json.loads(m.group(1))
        except ValueError:
            pass
    start, end = text.find("{"), text.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except ValueError:
            pass
    raise CrewError("model reply is not JSON")


def env(name, fallback=None, default=None):
    return os.environ.get(name) or (os.environ.get(fallback) if fallback else None) or default


def chat_json(system, user):
    base = env("CREW_BASE_URL", "XAI_BASE_URL")
    model = env("CREW_MODEL", "XAI_MODEL")
    key = env("CREW_API_KEY", "XAI_API_KEY")
    if not (base and model and key):
        raise CrewError("set CREW_BASE_URL, CREW_MODEL and CREW_API_KEY (or run with --dry-run)")
    url = base.rstrip("/") + "/chat/completions"
    messages = [{"role": "system", "content": system}, {"role": "user", "content": user}]
    payload = {"model": model, "messages": messages, "temperature": 0.7,
               "response_format": {"type": "json_object"}}
    text = None
    for attempt in (1, 2):
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST", headers={
            "Content-Type": "application/json", "Authorization": "Bearer " + key})
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                reply = json.loads(resp.read().decode("utf-8"))
            text = reply["choices"][0]["message"]["content"]
            break
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:300]
            if attempt == 1 and e.code == 400 and "response_format" in payload:
                payload.pop("response_format")  # the model does not accept it; fall back to text
                continue
            raise CrewError("HTTP %d from %s: %s" % (e.code, url, detail))
        except (urllib.error.URLError, KeyError, ValueError) as e:
            raise CrewError("model call failed: %s" % e)
    return extract_json(text)


# ---------------------------------------------------------------- stages

def stage_dir(name):
    return os.path.join(HERE, name)


def run_check(cmd, out_path, pack_dir, run_dir):
    cmd = cmd.replace("{output}", out_path).replace("{pack}", pack_dir).replace("{run}", run_dir)
    proc = subprocess.run(cmd, shell=True, cwd=ROOT, capture_output=True, text=True)
    tail = (proc.stdout + proc.stderr).strip().splitlines()
    for line in tail[-12:]:
        print("    " + line)
    if proc.returncode != 0:
        raise CrewError("check failed for %s (exit %d): %s" % (os.path.basename(out_path), proc.returncode, cmd))


def run_stage(name, ctx, run_dir, args, pack):
    meta, body = parse_prompt(os.path.join(stage_dir(name), "prompt.md"))
    schema = read_json(os.path.join(stage_dir(name), "schema.json"))
    out_path = os.path.join(run_dir, name + ".json")
    if args.dry_run:
        fixture = os.path.join(HERE, "fixtures", "dry-run", name + ".json")
        if not os.path.exists(fixture):
            raise CrewError("dry-run fixture missing: %s" % fixture)
        doc = read_json(fixture)
        print("  %s: dry run, canned output %s" % (name, os.path.relpath(fixture, ROOT)))
    else:
        prompt = render(body, ctx)
        system = ("You are the %s co-worker of the High Light Rituals crew. Reply with one JSON object only, "
                  "matching the Outputs schema exactly. No prose around it." % name)
        doc = chat_json(system, prompt)
        print("  %s: model reply received" % name)
    errs = validate(doc, schema)
    if errs:
        with open(out_path + ".invalid", "w", encoding="utf-8") as fh:
            json.dump(doc, fh, indent=1, ensure_ascii=False)
        raise CrewError("%s output failed its schema: %s" % (name, "; ".join(errs[:5])))
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write("\n")
    print("  %s: valid, written %s" % (name, os.path.relpath(out_path, ROOT)))
    if meta.get("check"):
        run_check(meta["check"], out_path, pack["dir"], run_dir)
    return doc


def load_pick(run_dir, args):
    pick_path = os.path.join(run_dir, "pick.json")
    if args.pick is not None:
        pick = {"angle": args.pick, "by": "cli --pick"}
        with open(pick_path, "w", encoding="utf-8") as fh:
            json.dump(pick, fh, indent=1)
            fh.write("\n")
    if not os.path.exists(pick_path):
        return None
    pick = read_json(pick_path)
    errs = validate(pick, {"type": "object", "required": ["angle", "by"], "additionalProperties": False,
                           "properties": {"angle": {"type": "integer", "minimum": 1},
                                          "by": {"type": "string", "minLength": 1}}})
    if errs:
        raise CrewError("pick.json invalid: %s" % "; ".join(errs))
    return pick


def pointer_get(doc, pointer):
    node = doc
    for part in pointer.lstrip("/").split("/"):
        part = part.replace("~1", "/").replace("~0", "~")
        if isinstance(node, list):
            node = node[int(part)]
        else:
            node = node[part]
    return node


def pointer_set(doc, pointer, value):
    parts = [p.replace("~1", "/").replace("~0", "~") for p in pointer.lstrip("/").split("/")]
    node = doc
    for part in parts[:-1]:
        node = node[int(part)] if isinstance(node, list) else node[part]
    last = parts[-1]
    if isinstance(node, list):
        node[int(last)] = value
    else:
        node[last] = value


def apply_edits(editor_doc, outputs, run_dir, pack):
    """Apply every proposed edit (--accept-edits), re-validate and re-check the edited stage files."""
    touched = {}
    for i, edit in enumerate(editor_doc.get("edits", [])):
        stage = edit["stage"]
        doc = touched.setdefault(stage, json.loads(json.dumps(outputs[stage])))
        try:
            current = pointer_get(doc, edit["path"])
        except (KeyError, IndexError, ValueError):
            raise CrewError("edit %d: path %s not found in %s.json" % (i, edit["path"], stage))
        if current != edit["before"]:
            raise CrewError("edit %d: %s no longer reads %r" % (i, edit["path"], edit["before"]))
        pointer_set(doc, edit["path"], edit["after"])
    for stage, doc in touched.items():
        schema = read_json(os.path.join(stage_dir(stage), "schema.json"))
        errs = validate(doc, schema)
        if errs:
            raise CrewError("%s after edits fails its schema: %s" % (stage, "; ".join(errs[:5])))
        out_path = os.path.join(run_dir, stage + ".edited.json")
        with open(out_path, "w", encoding="utf-8") as fh:
            json.dump(doc, fh, indent=1, ensure_ascii=False)
            fh.write("\n")
        meta, _ = parse_prompt(os.path.join(stage_dir(stage), "prompt.md"))
        if meta.get("check"):
            run_check(meta["check"], out_path, pack["dir"], run_dir)
        print("  editor: %d edit(s) applied, written %s" % (
            sum(1 for e in editor_doc["edits"] if e["stage"] == stage), os.path.relpath(out_path, ROOT)))


def write_producer_manifest(run_dir, outputs, edited):
    """The producer stage is a stub (crew/producers/README.md): write the manifest the producers will read."""
    manifest = {
        "status": "stub",
        "note": "Producers (klaviyo.py, figma_package.py) are not built yet. They read the files below by REST, "
                "never from this runner's memory.",
        "inputs": {k: os.path.basename(v) for k, v in {
            "intake": "intake.json", "strategist": "strategist.json", "pick": "pick.json",
            "email": "email.edited.json" if "email" in edited else "email.json",
            "paid": "paid.edited.json" if "paid" in edited else "paid.json",
            "editor": "editor.json"}.items()},
    }
    path = os.path.join(run_dir, "producer.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=1)
        fh.write("\n")
    print("  producer: stub manifest written %s" % os.path.relpath(path, ROOT))


# ---------------------------------------------------------------- main

def main(argv=None):
    ap = argparse.ArgumentParser(description="HLR crew runner")
    ap.add_argument("--brief", required=True, help="the brief, Markdown")
    ap.add_argument("--dry-run", action="store_true", help="canned outputs from crew/fixtures/dry-run; no key, no network")
    ap.add_argument("--until", choices=STAGES, help="stop after this stage")
    ap.add_argument("--pick", type=int, help="the angle a person picked (1-based); writes pick.json")
    ap.add_argument("--accept-edits", action="store_true", help="apply every edit the editor proposes")
    ap.add_argument("--run-dir", help="resume an existing run folder instead of starting a new one")
    ap.add_argument("--pack", default=os.path.join(ROOT, "brand-pack"), help="the brand pack folder")
    ap.add_argument("--runs", default=os.path.join(HERE, "runs"), help="where runs land")
    args = ap.parse_args(argv)

    try:
        return _main(args)
    except CrewError as e:
        print("crew: FAIL: %s" % e, file=sys.stderr)
        return 1


def _main(args):
    if not os.path.exists(args.brief):
        raise CrewError("brief not found: %s" % args.brief)
    pack = load_pack(args.pack)
    brief = read_text(args.brief)
    slug = brief_slug(args.brief)
    if args.run_dir:
        run_dir = os.path.abspath(args.run_dir)
        if not os.path.isdir(run_dir):
            raise CrewError("run dir not found: %s" % run_dir)
    else:
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        run_dir = os.path.join(args.runs, slug, stamp)
        n = 0
        while os.path.exists(run_dir):
            n += 1
            run_dir = os.path.join(args.runs, slug, "%s-%d" % (stamp, n))
        os.makedirs(run_dir)
    print("crew: brief %s, run %s%s" % (slug, os.path.relpath(run_dir, ROOT), " (dry run)" if args.dry_run else ""))

    ctx = build_context(pack, brief, os.path.relpath(args.brief, ROOT), slug)
    outputs = {}

    def have(stage):
        path = os.path.join(run_dir, stage + ".json")
        if os.path.exists(path):
            outputs[stage] = read_json(path)
            ctx[stage] = outputs[stage]
            return True
        return False

    def do(stage):
        if not have(stage):
            outputs[stage] = run_stage(stage, ctx, run_dir, args, pack)
            ctx[stage] = outputs[stage]
        else:
            print("  %s: reused %s.json from the run folder" % (stage, stage))
        if args.until == stage:
            print("crew: stopped after %s (--until)" % stage)
            return True
        return False

    if do("intake") or do("strategist"):
        return 0

    pick = load_pick(run_dir, args)
    if pick is None:
        print("crew: STOPPED for the human pick. Write %s as {\"angle\": n, \"by\": \"name\"} and rerun with "
              "--run-dir %s, or rerun with --pick n." % (
                  os.path.relpath(os.path.join(run_dir, "pick.json"), ROOT), os.path.relpath(run_dir, ROOT)))
        return 2
    angles = outputs["strategist"]["angles"]
    if pick["angle"] > len(angles):
        raise CrewError("pick %d but the strategist proposed %d angles" % (pick["angle"], len(angles)))
    ctx["pick"] = pick
    ctx["picked_angle"] = angles[pick["angle"] - 1]
    print("  pick: angle %d (%s) by %s" % (pick["angle"], ctx["picked_angle"].get("axis"), pick["by"]))

    if do("email") or do("paid") or do("editor"):
        return 0

    edited = {}
    n_edits = len(outputs["editor"].get("edits", []))
    if n_edits and args.accept_edits:
        apply_edits(outputs["editor"], outputs, run_dir, pack)
        edited = {e["stage"] for e in outputs["editor"]["edits"]}
    elif n_edits:
        print("  editor: %d edit(s) proposed, none applied (a person accepts them, or rerun with --accept-edits)" % n_edits)
    else:
        print("  editor: no edits proposed")

    write_producer_manifest(run_dir, outputs, edited)
    print("crew: done, %s" % os.path.relpath(run_dir, ROOT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
