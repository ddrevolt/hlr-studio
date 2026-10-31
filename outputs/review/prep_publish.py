#!/usr/bin/env python3
"""Turn the Parcel build (dist/) into one artifact page: no doctype, html, head or body of its
own (the Artifact host wraps the page), the title first, the Google Fonts link, the CSS and the
JS inline. Usage: python3 prep_publish.py <dist folder> <out.html>"""
import os, re, sys

dist, out = sys.argv[1], sys.argv[2]
html = open(os.path.join(dist, "index.html"), encoding="utf-8").read()
title = re.search(r"<title>(.*?)</title>", html, re.S).group(1).strip()
links = re.findall(r'<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>', html)
css_files = re.findall(r'<link[^>]+rel="?stylesheet"?[^>]+href="?/?([^">\s]+\.css)"?[^>]*>', html)
js_files = re.findall(r'<script[^>]+src="?/?([^">\s]+\.js)"?[^>]*>', html)
module = any('type="module"' in s or "type=module" in s for s in re.findall(r"<script[^>]*>", html))
css = "\n".join(open(os.path.join(dist, f), encoding="utf-8").read() for f in css_files)
js = "\n".join(open(os.path.join(dist, f), encoding="utf-8").read() for f in js_files)
js = js.replace("</script", "<\\/script")
parts = [
    f"<title>{title}</title>",
    '<meta name="claude:viewport-fit-sides" content="cover">',
    *links,
    f"<style>\n{css}\n</style>",
    '<div id="root"></div>',
    f'<script{" type=\"module\"" if module else ""}>\n{js}\n</script>',
]
open(out, "w", encoding="utf-8").write("\n".join(parts) + "\n")
print(f"wrote {out}: {os.path.getsize(out)} bytes; title {title!r}; css {css_files}; js {js_files}; module {module}")
