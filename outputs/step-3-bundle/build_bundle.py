#!/usr/bin/env python3
"""
build_bundle.py: package a studio-engine release as a .plugin, either as the brand-free engine
(no --brand-id) or as a single-brand bundle (one registry entry, its own plugin name).

The pack is never copied into the bundle: the registry points at the pack's working copy, which
holds the mutable state the engine writes (registers, Figma ids, calibration files). A pack that
changes needs no new bundle; a new engine release or a new pack path does.

Usage:
  build_bundle.py --engine <engine folder> --out <file.plugin>
  build_bundle.py --engine <engine folder> --out <file.plugin> \
      --brand-id hlr --brand-name "High Light Rituals" --aliases "HLR,High Light Rituals,HighLight,highlight-brandbook" \
      --pack /abs/path/to/brand-pack --plugin-name hlr-studio-engine --plugin-description "..."

Exit 0 on a written bundle; 2 on bad input. Deterministic: entries sorted, fixed timestamps.
"""
import argparse, json, os, shutil, sys, tempfile, zipfile

SKIP_DIRS = {"__pycache__", ".in_use", ".git"}
SKIP_FILES = {".DS_Store"}
STAMP = (2026, 10, 17, 0, 0, 0)


def die(msg):
    print("build_bundle: " + msg, file=sys.stderr)
    sys.exit(2)


def registry_text(bid, name, aliases, pack):
    head = open(os.path.join(ENGINE, "brands", "registry.yaml"), encoding="utf-8").read()
    head = head.split("\n# The engine release ships with no brands.")[0].rstrip().rstrip("#").rstrip()
    alias_list = ", ".join(aliases)
    return (head + "\n#\n# Single-brand bundle: this registry lists one brand and nothing else.\n"
            "version: 1\nbrands:\n"
            f"  {bid}:\n    name: {name}\n    aliases: [{alias_list}]\n    pack: {pack}\n")


ap = argparse.ArgumentParser()
ap.add_argument("--engine", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--brand-id"); ap.add_argument("--brand-name"); ap.add_argument("--aliases", default="")
ap.add_argument("--pack"); ap.add_argument("--plugin-name"); ap.add_argument("--plugin-description")
ap.add_argument("--bundle-note", help="markdown file written into the bundle root as BUNDLE.md")
a = ap.parse_args()
ENGINE = os.path.abspath(a.engine)
if not os.path.exists(os.path.join(ENGINE, ".claude-plugin", "plugin.json")):
    die("no .claude-plugin/plugin.json under " + ENGINE)

stage = tempfile.mkdtemp()
root = os.path.join(stage, "plugin")
shutil.copytree(ENGINE, root, ignore=shutil.ignore_patterns(*SKIP_DIRS, *SKIP_FILES))
manifest = json.load(open(os.path.join(root, ".claude-plugin", "plugin.json"), encoding="utf-8"))

if a.brand_id:
    for k in ("brand_name", "pack", "plugin_name", "plugin_description"):
        if not getattr(a, k):
            die("a single-brand bundle needs --" + k.replace("_", "-"))
    if not os.path.isabs(a.pack):
        die("--pack must be an absolute path (the registry refuses relative ones)")
    aliases = [x.strip() for x in a.aliases.split(",") if x.strip()]
    open(os.path.join(root, "brands", "registry.yaml"), "w", encoding="utf-8").write(
        registry_text(a.brand_id, a.brand_name, aliases, a.pack))
    manifest["name"] = a.plugin_name
    manifest["description"] = a.plugin_description
    manifest["keywords"] = sorted(set(manifest.get("keywords", []) + ["single-brand-bundle"]))
    if a.bundle_note:
        shutil.copyfile(a.bundle_note, os.path.join(root, "BUNDLE.md"))
json.dump(manifest, open(os.path.join(root, ".claude-plugin", "plugin.json"), "w", encoding="utf-8"), indent=2)
open(os.path.join(root, ".claude-plugin", "plugin.json"), "a").write("\n")

files = []
for d, dirs, fs in os.walk(root):
    dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
    for f in sorted(fs):
        if f not in SKIP_FILES:
            files.append(os.path.join(d, f))
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
with zipfile.ZipFile(a.out, "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(files, key=lambda x: os.path.relpath(x, root)):
        rel = os.path.relpath(p, root)
        info = zipfile.ZipInfo(rel, date_time=STAMP)
        info.external_attr = (os.stat(p).st_mode & 0o777 | 0o100000) << 16
        info.compress_type = zipfile.ZIP_DEFLATED
        z.writestr(info, open(p, "rb").read())
shutil.rmtree(stage)
print(json.dumps({"out": a.out, "files": len(files), "name": manifest["name"], "version": manifest["version"],
                  "brand": a.brand_id or None}))
