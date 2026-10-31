# Producers

`email_html/` is built (backlog `email-html`): the HTML twins of M01 to M27 at 1200 and 600, the assembler and the screenshots. The rest are stubs.

```
python3 crew/producers/email_html/assemble.py --run <run folder> --width 1200 [--subject 1] [--out file.html]
python3 crew/producers/email_html/build_twins.py        # rewrite twins/ and screenshots/ (needs Playwright for the shots)
```

The assembler reads `email.edited.json` (else `email.json`) from the run folder, fills the twins, keeps every merge token for Klaviyo, drops options left unfilled, and exits 1 on any unfilled slot or unknown module. Images are grey labelled placeholders (no photo is cleared for a run). The footer nav labels are `{{nav1_label}}` to `{{nav3_label}}` and product links `{{url_<product id>}}` until a person supplies them. Examples: `email_html/examples/`. The Figma master is not read; the proportions come from the email canvas sizes in `tokens.flat.json`.

(Stub notes below.)

Not built here: `run.py` ends a run by writing `producer.json`, the manifest a producer reads: the intake, the pick, the email and paid outputs (edited versions when edits were applied) and the editor's list. Producers read those files and the pack; they never read the runner's memory, and they reach Figma and Klaviyo by REST only.

Next items, in backlog order:

- `klaviyo.py` (backlog `klaviyo-push`): take `email_html/assemble.py`'s output, then create the template through Klaviyo's Templates API and assign it to a campaign message. Sends stay manual. Waits on a key with Templates write (`klaviyo-access`).
- `figma_package.py` (backlog `paid-package`, built: `python3 crew/producers/figma_package.py` writes `outputs/step-9-paid/agent-package.md`, `--lint FILE` checks it; the text below is the original plan): compile the paid writer's ad sets into the agent package for the Meta masters at 1:1, 4:5 and 9:16, reading `slotmap-paid.yaml` when it exists and `placement-specs.json` once `paid-specs` closes. The masters are built in Eddie's chat; this script never writes to Figma on its own (project rule 5).

Environment the producers will need, when built: `KLAVIYO_API_KEY` (private key with Templates write), `FIGMA_TOKEN` (read, for slot readback). Neither is read by `run.py` today.
