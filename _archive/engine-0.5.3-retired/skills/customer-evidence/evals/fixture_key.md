# Fixture key — what is deliberately planted in `fixture_corpus.md`

Not given to the responder. Used to grade whether the skill's checks actually fire.

**Corrected twice, 2026-07-26.** The second correction: this key graded the venue count as "independent sources", so an analyst who counted speakers correctly would have failed. Both numbers are now stated separately.

**First correction, same day.** The first version of this key mis-stated two counts — documentation as 4 sources, the valence set as 5 items. An adversarial pass caught both. Recorded here rather than silently amended, because a wrong answer key marks correct work as failure, which is the most expensive error an eval can contain.

| Trap | Items | What a correct run does |
|---|---|---|
| **Venue concentration** | 1, 4, 9, 15 share `amazon.com/dp/B0C7MAKERM2` | Reports **24 items, 24 speakers, 21 venues**. The four dates differ, so a lint keying on the whole citation string misses the venue overlap; it must normalise first. These are four *different reviewers* on one page — four speakers, one venue. Reporting them as one source suppresses a real pattern; reporting them as four independent sources invents independence. Report both numbers |
| **Brand-published copy** | 7 (`makerprint.com/testimonials`) | Excludes it from the corpus *and* from the quote bank. Says why: seller-curated |
| **Repaired quote** | 12 (contains `[bed]`) | Flags the bracketed repair. Cannot anchor anything |
| **Missing date** | 19 | Flagged **and reported**, not silently dropped from the summary |
| **Outside recency window** | 22 (2021, and about *older boards*) | Flagged as out of window and off-product. Carries no durability data — it is a prospective buyer repeating a rumour |
| **Press-mediated** | 5 (`Tech Monthly`) | Not a customer speaking; journalist-selected for vividness |
| **Venue artifact — asking** | 3, 8, 14, 20 (all `r/3Dprinting` questions) | A "users depend on community knowledge" theme built on these is the venue, not the people |
| **Self-limiting item** | 24 ("printing PLA only… would not take my word") | A respondent bounding their own claim. Not unqualified support |

## Counts, computed

| Cluster | Items | Independent sources | Note |
|---|---|---|---|
| **Noise** | 4, 15, 21 | **3 speakers, 2 venues** | The most tempting overclaim in the set — and the reason is methodological, not arithmetic. At 3 speakers it clears the two-is-a-lead floor, so a correct answer cannot dismiss it on counting. It still does not survive: 15 is internally complicating, calling the noise category-normal and siting-solvable, so two of three voices do not straightforwardly support the claim, and two of the three sit on one page |
| **Documentation / onboarding** | 10, 18, 19, 20, 23 | **5** — printforum/91044, reddit/1r6t2k, printforum/87556, reddit/1s0m9x, trustpilot/9612 | Best-supported pattern here, and the quietest. But 19 is the undated item and 20 is one of the four questions, so a careful run reports it narrower |
| **Product working (valence slot)** | 1, 2, 11, 15, 17, 19, 24 | **7 speakers, 6 venues** — 1 and 15 share a page | A theme set with no positive category has ignored a quarter of the corpus. 17 is the strongest single source; 24 bounds itself; 15 is positive *and* the noise theme's complication |

**Correct headline shape:** 24 items, 24 speakers, 21 venues, four integrity flags (7 brand, 12 repaired, 19 undated, 22 out of window) all reported, item 5 additionally excluded as press-mediated, a valence category with somewhere to put seven items, and the noise complaint smaller than it looks.

**Ownership horizon:** the longest tenure any item reports is item 17 — "since December" in a May 2026 post, about five months. Anything stated as two months or seven months is wrong.

## What should SURVIVE — graded by case 14

The traps above are what a correct run rejects. These are what it must not:

**Documentation / onboarding** is the best-supported pattern in the corpus and the quietest. Five speakers across five venues. A correct run reports it; setting aside item 19 (undated) and item 20 (a question) narrows it to three speakers and is right. Dropping it because two of its five items carry flags is the over-rejection failure.

**A positive category** has somewhere to put seven speakers (1, 2, 11, 15, 17, 19, 24). A theme set without one has discarded a quarter of the corpus.

**Item 17** — three units, eight hours a day since December — is the strongest single source in the set. One speaker, so it is a lead and not a finding; reported as a bounded lead is correct, discarded for being one voice is not.

**The noise cluster** may legitimately be set aside, but only for the stated reason: item 15 internally complicates it and two of its three speakers sit on one page. Three speakers clears the two-is-a-lead floor, so dismissing it on the count is wrong.

**Zero findings is a failing answer for this corpus.** It supports a five-speaker pattern. A run that reports none of it has substituted caution for analysis.
