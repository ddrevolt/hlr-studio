# Producers (stub)

Not built. `run.py` ends a run by writing `producer.json`, the manifest a producer reads: the intake, the pick, the email and paid outputs (edited versions when edits were applied) and the editor's list. Producers read those files and the pack; they never read the runner's memory, and they reach Figma and Klaviyo by REST only.

Next items, in backlog order:

- `klaviyo.py` (backlog `email-html`, `klaviyo-push`): assemble the email writer's block list into HTML from the module library's HTML twins (built from `tokens.css`), then create the template through Klaviyo's Templates API and assign it to a campaign message. Sends stay manual. Waits on a key with Templates write (`klaviyo-access`).
- `figma_package.py` (backlog `paid-package`): compile the paid writer's ad sets into the agent package for the Meta masters at 1:1, 4:5 and 9:16, reading `slotmap-paid.yaml` when it exists and `placement-specs.json` once `paid-specs` closes. The masters are built in Eddie's chat; this script never writes to Figma on its own (project rule 5).

Environment the producers will need, when built: `KLAVIYO_API_KEY` (private key with Templates write), `FIGMA_TOKEN` (read, for slot readback). Neither is read by `run.py` today.
