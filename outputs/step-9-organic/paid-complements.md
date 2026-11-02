# Paid complements from the organic system (verified 2026-11-01)

Provenance: [observed] for the P master structure (read in Figma 2026-11-01, library file Gq3yUbLs6MCRM0nOhjvnIW, 02 Modules); [derived] for every pairing and proposal. Other sources: `brand-pack/slotmap-paid.yaml`, `brand-pack/placement-specs.json` (every number null), `brand-pack/figma.yaml` paid block.

## What exists [observed]
Nine paid component sets, 67 variants, every set at 1x1, 4x5 and 9x16 except P09 (9x16 only):

| Master | Variant properties | Toggles | Slots |
|---|---|---|---|
| P01 Brand Line | Ratio, Style (Line, Masthead) | Show body | image, headline, body |
| P02 Product Hero | Ratio, Style (Cut-out, Inset) | eyebrow, subline, side label, offer | eyebrow, name, image, subline, side label, offer |
| P03 Annotated | Ratio, Style (On ground, On model), Callouts (1 to 4) | Show subline | title, subline, image, name and line per callout |
| P04 Quote | Ratio, Style (Press, Review, DM) | Show attribution | quote, attribution |
| P05 Mantra | Ratio, Ground (Photo, Flat) | none | image, line |
| P06 Offer | Ratio, Style (Offer, Gift with purchase) | eyebrow, subline, terms, side 1, side 2 | image, eyebrow, offer, headline, sides, subline, terms |
| P07 Meaning | Ratio, Style (Card, List) | none | headline, image, name and line per item |
| P08 Birthstone Grid | Ratio | Show eyebrow | eyebrow, headline, image, month, stone |
| P09 End Frame | Ratio (9x16 only) | Show line | line |

The client's paid originals are not pasted into the library. Each paid comparison board (04 Staging, x 11000) names the original by node id in client file `LYyYXPDUHVoAABh865EvMI` (P01 2:50853, P03 2:42498, P08 2:57657, others on their boards) and shows only our rebuilds beside the reference note. P10 Link Image and P11 Display Banner are proposed and unbuilt.

## Pairings, checked against the structure
| Organic master | Paid master | Verdict | Notes |
|---|---|---|---|
| S01 Photo, Headline on photo | P01 Brand Line | confirmed | same image plus headline plus body; P01 has the three ratios but no Scale or Placement |
| S01 Text tile | P05 Mantra (Ground=Flat), P04 Quote | confirmed | Mantra Flat is a text-only tile; P04 adds Press, Review, DM styles organic does not have |
| S01 Headline on photo, Low or Centred | P05 Mantra (Ground=Photo) | likely | same device, line on a photo; P05 has no placement control |
| S01 Offer tile | P06 Offer | confirmed | P06 carries offer, terms and side labels; S01 Offer tile has only offer, eyebrow, headline |
| S03 Inner callouts | P03 Annotated | confirmed | P03 has a Callouts count property (1 to 4); S03 Inner callouts is fixed at four markers |
| S03 Inner (items list) | P07 Meaning (List) | likely | both are a headline plus name and line items; this reverses the earlier note that P07 had no organic sibling |
| S03 End, S04 stories | P09 End Frame, P01 at 9x16 | partial | P09 is 9x16 only; S04 runs as an ad only after re-layout |
| S05 Grid cover | P08 Birthstone Grid | partial | P08 is a labelled grid (month and stone per tile) at all three ratios; S05 is image tiles at 4x5 and 9x16 only |
| P02 Product Hero | none | no organic sibling | product-specific (cut-out, offer, side label) |

## Differences to close (proposals, none built)
1. Scale and Placement properties (from S01) are absent from P01, P05 and P06. Default: add Scale (Display, Statement, Quote) and Placement (Top, Low, Centred) to P01 and P05 only; P06 stays as is until a paid original shows a need.
2. S03 Inner callouts could adopt P03's Callouts count (1 to 4) so one pattern serves both. Default: copy the count property.
3. S05 has no 1x1; P08 does. Add 1x1 to S05 only if a 1x1 grid is wanted organically (no evidence yet).
4. P09 End Frame has no organic Placement; S03 End does. No change proposed.

## Gaps and owners
1. Paid specs: 9:16 keep-clear, primary text and headline limits are all null. Owner Eddie, item paid-specs (ask in `placement-specs.json`). Every 9x16 paid variant carries a labelled provisional guide that is the organic band, not the paid zone.
2. Paid originals are referenced by id, not pasted. Anyone comparing must open client file LYyYXPDUHVoAABh865EvMI. Owner Eddie only if he wants them pasted into the library.
3. P10 and P11 unbuilt; no organic evidence for either.

## Next
Proposal 1 built 2026-11-01 (Eddie's go): P01 and P05 carry Scale and Placement, 30 variants each, spot-checked only. Next default: proposal 2 (copy P03's Callouts count into S03 Inner callouts), behind Eddie's go.
