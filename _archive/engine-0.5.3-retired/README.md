# Retired from the HLR engine at 0.6.0

Taken out of `studio-engine 0.5.3` (`outputs/step-3-bundle/studio-engine-0.5.3.plugin`, the engine the HLR bundle is built from) when engine 0.6.0 was built on 2026-10-31. Every file here is the 0.5.3 version, byte for byte; nothing was deleted and nothing here is read by 0.6.0.

Why: DECISIONS 2026-10-31 (Eddie's Phase 2 rulings on `claude/phase-2-rescope.md`). The legal regime is deleted from the engine (the claims ledger role, the counsel sign-off, the `needs_legal` and blocked statuses, the disclaimer row and every lint branch that reads them), and the Phase 1 route, slate and judge machinery is retired: web and organic social copy, customer evidence, the verifier, the options board and the squad run are out of the Phase 2 scope (brief in, Klaviyo emails and Meta paid ads out, Donnie picks, a crew on the existing pack, lints and slot maps).

What is here:

- `skills/web-copy`, `skills/social-copy`, `skills/customer-evidence`, `skills/options-board`, `skills/verify` (the pairwise judge, `judge_brief.js`, `verify_packets.js`, the judge calibration), `skills/squad-run`: whole skills, with their scripts, references, tests and evals.
- `workflows/squad-run.js`: the squad workflow the squad-run skill drove.
- `skills/email-copy/scripts/route_findings.js` and `skills/email-copy/tests/test_route_findings.js`: the findings router (the `legal` owner lived here).
- `skills/brief-intake-route-plan.md`: brief-intake's `references/route-plan.md`, the route plan method.
- `lib/claims.js`: the claims ledger compiler and its statuses.
- `tests/test_pack_and_claims.js`: the 0.5.3 engine-level test; 0.6.0 carries `tests/test_pack.js` without the claims section.

The brand pack's ledger file is archived beside this folder, at `_archive/brand-pack/legal-ledger.json`; its product facts moved to `brand-pack/products.json` `_meta.brand_facts` with their sources.

To bring any of this back: a new engine version through REVIEW.md section 3, on a DECISIONS line.
