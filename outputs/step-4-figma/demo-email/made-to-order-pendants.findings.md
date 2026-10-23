# Findings — The made-to-order pendants

Automated checks: **PASS**

9 findings, routed by who can act on them. 6 of them are not the drafter's.

## YOU — decisions only the drafter can make

- Angle not ratified: R1 and its first scene were developed as the recommendation under Eddie’s overnight delegation (2026-10-23). R2 (benefit) and R3 (occasion) stay live; pick again and only the copy below the angle changes.
- Revised after the fresh-context review (round 1): “choose” appeared six times, so the body, the grid heading, the preheader and the closing CTA now vary the verb; the hero line and its CTA keep it.
- Each headline names its accent word (field accent); the build sets that word in font/style/headline-accent.

## DATA / OPS — product records, SKUs, missing fields

- Products resolved from products.json: element-pendant, sacred-pendant, genesis-pendant, seeker-pendant. Descriptions are empty until HLR’s Shopify export lands, so the copy states no metal, karat, stone, meaning, size or price; the one fact used is made to order (observed.made_to_order on all four).

## LEGAL — claims, ledger topics, clearance

- The ledger is a test seed (hlr-ledger-0.2.0): its rows are enforced provisionally and no line here is cleared for production until HLR names its claims signer (C2).

## SYSTEM — taxonomy, contracts, scripts

- The subject and preheader were drafted from the voice contract alone: the exemplar file has no subject or preheader lines.
- The pack has no favorites yet, so every gate saw historical exemplars only; no measured preference is on file, so the checklist carries the voice contract’s five checks and the brief items, and a human picks.
- Type product_listing read live from type-registry-core.json (ratified). The grid’s card names are data-fed from products.json (E06.name), so they are not drafted as options; the footer carries HLR-REQ-01 verbatim in M09 and is not redrafted here.
- Every composed string fit its slot budget, so the cut pass changed nothing: cuts lists each mapped string unchanged so fit_check can confirm the budgets.
