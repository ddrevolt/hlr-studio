---
name: customer-evidence
description: "Turn raw customer material about any registered brand, reviews, forum posts, support tickets, ad comments, interview transcripts, into findings that survive scrutiny. Use when the user wants voice-of-customer analysis, customer research, review mining, social listening, VOC synthesis, insight development, theme analysis of customer feedback, or asks what customers actually say, think, or struggle with. Also use to audit or re-check existing customer insights. Declares a named method, separates distinct speakers from venue concentration, verifies every quote programmatically, and puts every claim through adversarial refutation before reporting it, recording whether that pass was procedurally independent or an in-run review. Runs full by default; a quick pass is cheaper and its output is labelled candidate, stamped that way in its provenance. Not for quantitative survey analysis, marketing copy, or deciding what to build."
license: MIT
metadata:
  version: 1.0.0
---

# Customer Evidence

You turn raw customer material into findings someone could defend. Most customer-research output fails not because the analysis is careless but because nothing in the process is built to catch its own errors: quotes get counted instead of sources, a single reviewer becomes a pattern, the venue's shape gets mistaken for the customer's mind, and confidently-worded themes get built on material that contradicts them. This skill is the checks, in order.

**The commitment that defines it:** you would rather report three findings that hold than nine that read well.


## Start here

**Inputs.** A corpus file — items with a verbatim, a venue identifier and a date. Optionally a
brand pack; without one the skill still runs and says so.

**The run, in order.**

```
python3 scripts/corpus_lint.py CORPUS --pack <pack> --mode full --json > lint.json
   (or --brand-domains <domains|none> when no pack resolves)
   ...code and write the analysis...
python3 scripts/verify_quotes.py CORPUS ANALYSIS --exclusions lint.json     # after
```

**Three verdicts, and the middle one is the point.** `PASS` means the checks ran and cleared.
`FAIL` means something is disqualifying. **`INSUFFICIENT-INPUT` means a check could not run** — no
speaker tags, no declared first-party domains, no cited quotes — and it exits non-zero. It is not a
pass. Most first runs land here, and the fix is named in the output.

**Before any collection**, read `references/ethics.md`. A verbatim is an identifier; the rules that
follow from that are not optional.

**The one number people get wrong.** Items are not speakers and speakers are not venues. Promotion
from lead to finding gates on *speakers*, which requires a `speaker:` tag at ingest. Without tags
the lint says so rather than counting items and calling them sources.

## Before anything — decide the mode, and say so

**FULL** (default) — two independent analyses, three-lens independent refutation, variance reported. Use for anything that will shape a decision, a campaign, a roadmap, or a claim about customers.

**QUICK** — one analysis, one refutation lens, no variance. Materially cheaper, because it runs a third of the passes; do not quote a cost ratio you have not measured. Use for orientation, scoping, or a first look at a new corpus.

**Full is the default, so take it.** Say which mode you are in and keep going. Offer the choice only when the user has signalled speed or cost pressure, or when the corpus is new and nobody knows yet whether it is worth a full pass. Opening every engagement by asking for a mode turns a default into a negotiation.

Quick mode never skips the cheap checks (§2, §4, §5, §8) — those cost nothing and catch the most. What it drops is redundancy and breadth of attack.

Quick is a mode you are *asked* for in conversation — "quick pass", "just a first look", "cheap version" — not a switch on a command line. But it is recorded mechanically, because a label that depends on remembering to write it is not a label. **Run the lint with `--mode quick`.** The mode lands in the provenance block beside the corpus hash and the run time, so the line the analyst quotes in the output carries it, and a quick pass read three months later still says it was one.

**Every artifact records its mode in the header, and quick-mode output is labelled "candidate" throughout — candidate themes, not themes.** A quick pass must never be mistakable for a full one three months later. Promoting a candidate to a finding means running the full pass, not relabelling it.

## Resolve the brand, then read the context

Resolve the brand in order: (a) a name or alias in the request; (b) otherwise the folder path `claude-cowork/<brand>/...`; (c) otherwise ask once. `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/resolve_brand.py --text "<request>"` (or `--path <folder>`) does (a) and (b) from `brands/registry.yaml`; exit 2 is unresolved. **If** it resolves, read `<pack>/brand-context.md` before touching the corpus: the narrative sections are shared with every skill and the **File map** is a union of roles, from which this skill takes the corpus, the first-party domains (`brand_domains`), the insight register and the recency window; pass `--pack <pack>` to the scripts. **If no brand resolves, say so once and carry on** with `--brand-domains` stated explicitly. A brand context sharpens the work; it is not a precondition for it. What you must not do is invent the parts it would have supplied: with no declared venue roster, say the sampling frame was not chosen in advance. Roles: `${CLAUDE_PLUGIN_ROOT}/references/pack-contract.md`.

**Nothing in this skill is specific to any industry or brand.** Everything category-specific lives in the pack.

## Before the corpus arrives

Often the first message asks for analysis without attaching anything. That turn has its own failure mode, and it is a bad one: **performing rigour instead of doing it.**

- **Never state a number about material you have not seen.** No item counts, no source counts, no "forty reviews off one product page." A fabricated illustrative figure is indistinguishable, on the page, from having run the check. Describe checks in terms of what they *are*, not what they *found*.
- **Do not recite the whole method.** Say what you need, name the method, name the mode, and stop. The checks are worth explaining at the moment they bite, on their data, not as a prospectus.
- **Ask for provenance, because it is the one thing that cannot be recovered later.** Each item needs its source identifier and date. Text pasted without them can still be read, but it can never be source-counted, and that limit should be stated once, plainly, not argued.
- **Answer the question that was asked first.** Methodological correction is not a substitute for engaging with what the person wanted to know. If a user's framing is wrong, say so in a clause and then be useful; opening with the correction every time is a tic, not rigour.

The test for this turn: would someone with no special instructions have left the user better off? If so, the extra apparatus is costing more than it earns.

---

## 1. Establish what the corpus is — and what it is not

Before any coding, write three things. They take ten minutes and they prevent most of the failures this skill exists to catch.

**Two counts, never one.** Run `scripts/corpus_lint.py CORPUS --pack <pack>` (or `--brand-domains <domains|none>`). It reports **speakers** and **venues** separately, and the distinction is load-bearing: four different people reviewing one product page are four speakers in one venue, and one prolific poster across three threads is one speaker in three venues. Collapsing on venue alone — which this skill did until 2026-07-26 — is wrong in both directions. **Promotion from lead to finding gates on SPEAKERS.** Venue count is a concentration diagnostic: report it alongside, because a finding drawn from four voices on one page is still a finding about one page. Items without a `speaker:` tag are counted singly and flagged, so the speaker number is an upper bound until ingest supplies them. `--brand-domains` is required; pass `none` only as a written declaration that the brand publishes nothing that could reach this corpus.

**The integrity pass.** The same script flags: brand-published copy sitting in a customer corpus, quotes containing bracketed repairs or ellipsis-only fragments, items missing a date, and items outside the recency window. Fix or exclude before proceeding — never code around them.

**Report every flag it returns, including the ones you judged harmless.** Dropping the undated item because the date did not end up mattering is a silent edit to the record: the reader believes the corpus was clean on a dimension nobody checked in front of them. Say what was flagged, say what you did about each, and let the reader disagree.

- **Brand copy is not customer evidence**, whatever it says. A testimonial curated onto a company's own page is evidence about that company's positioning.
- **Never repair a quote.** Transcribe errors and all. A bracketed correction is no longer a verbatim and cannot anchor anything.

**The negative scope statement.** One paragraph: *what can this corpus not speak to?* A corpus scraped from threads about one topic supports claims about how people talk about that topic — not about the population, and not about anything they never had reason to mention there. Write this before you start, because afterwards you will believe the corpus is richer than it is.

---

## 2. Declare the method

State the method by name in every output **and in your first substantive reply** — before any corpus arrives, at the point you describe what you are going to do. A pipeline described without a method name ("two analyses, then three refutation lenses") is machinery with no tradition behind it, and it is the version a reader cannot check.

Use **Framework Method** (Ritchie & Spencer, 1994; operationalised for applied research by Gale et al., 2013) as the default for heterogeneous material. Gale sets out seven stages — transcription, familiarisation, coding, developing a working analytical framework, applying that framework, charting into the framework matrix, and interpretation. **Run the charting stage or do not claim the method.** Framework's defining apparatus is the matrix, and in Gale a row is most often an individual: chart themes against SPEAKERS, using the `speaker:` field the corpus carries. A named method whose central step is skipped is the failure §2 says naming exists to prevent.

**Do not claim *reflexive* thematic analysis.** Jowsey, Braun, Clarke, Lupton and Fine published "We Reject the Use of Generative Artificial Intelligence for Reflexive Qualitative Research" (*Qualitative Inquiry*, 2025), covering all phases including initial coding. Cite it that way if you raise it — five authors, not two, and an uncited "the originators rejected it" is the authority-without-a-source move this skill exists to catch.

**Their position is contested in the same literature** — De Paoli (2026) and Greenhalgh (2026) both published replies in *Qualitative Inquiry* arguing against a blanket rejection. Do not present the question as settled. The practical rule survives the disagreement anyway, because it is about attribution rather than capability: claiming *their* named method while using this tool is indefensible whoever turns out to be right about the underlying question.

**"Thematic analysis" is a family, and the objection is scoped to one member of it.** Codebook TA, template analysis, Framework Method and qualitative content analysis carry no such objection. If someone asks for thematic analysis without saying *reflexive*, they have not asked for the thing you must decline: say which variant you are running and why, and move on. Do not stage a refusal of a request nobody made.

**Never assert saturation.** In published practice it is overwhelmingly an unsubstantiated stopping claim. If asked whether the corpus is sufficient, show the code-accumulation curve — how many new codes each additional tranche produced — and let the reader judge.

---

## 3. Analyse

Full mode runs this **twice, independently**, with identical instructions and no sight of each other, so run-to-run variance can be measured. **Report that variance as variance, never as inter-rater reliability.** Two samples from one model are correlated draws, not independent raters: a kappa computed across them would be a number with no meaning. Genuine inter-rater agreement needs a second human or a second model family, and this skill does not provide either — say so rather than letting the twin run imply a reliability it cannot support. Quick mode runs it once.

Hard rules for every pass:

1. **Anchor every code to verbatim items by number.** Never paraphrase an item and treat the paraphrase as evidence.
2. **Every theme names its central organising concept in one sentence** — the single idea holding those items together. If you cannot state it in one sentence, it is a topic summary. Cut it.
3. **Never write "themes emerged."** You are making analytic decisions. Name them, in an analytic-decisions log: what you split, what you merged, what you nearly coded and rejected.
4. **Declare uncoded items.** Forcing every item into a theme is a known failure mode; leaving items out is expected and correct.
5. **Count sources, not items,** per §1.
6. **Keep a valence slot.** Confirm the framework has somewhere to put material reporting that something *worked*. A theme set where every theme is a deficit cannot distinguish "nothing works" from "the analyst had no category for things that work." This is the most common silent bias in commercial VOC work.
7. **Do not propose actions, products, campaigns or copy.** Interpretation stops at what these people appear to experience. Anything past that belongs to a different skill and a different conversation.
8. **Code at symmetric granularity.** Splitting one side of the corpus into nine fine codes while the other gets one coarse code decides the result before any counting starts: the coarse code looks prevalent and the split one disappears. This is invisible in the output — the arithmetic downstream is correct, the codebook underneath it is not — so check it deliberately by asking whether the same event, described on the other side of the ledger, would have produced this many codes. Any claim about which pattern is *most* common is a claim about your codebook until you have.

The number of themes is whatever the corpus supports. Never work to a target.

---

## 3a. Ethics — decide before collecting, not before publishing

Read `references/ethics.md` before the first collection run. The short form:

**Public is not consented.** Lawful and appropriate are different tests and the second is the one that damages a brand. **A verbatim is an identifier** — anyone can paste it into a search box and find the account, so removing the username achieves nothing. Quote at the shortest length that carries the meaning, and never pair a verbatim with a handle or permalink in anything that leaves the team.

**Special-category content — health, medication, mental state, finances, sexuality, anything about a named child — is read, counted, and never quoted.** Same rule already applied to prohibited territories: it may inform the analysis and may not reach the output. Tag it `never_quotable:yes` at ingest.

This one is enforced, not advised. `corpus_lint.py` reads the tag, **infers it from the content where nobody applied it** (see `--sensitive` for the marker list, which is configurable because every category has its own), reports the count, and writes the item ids into its JSON. `verify_quotes.py --exclusions <that JSON>` then errors if one is quoted. So: always run the lint with `--json` and always pass that file to the verifier. Without it the verifier checks wording and attribution only, says `exclusion_checking: OFF`, and the barrier between special-category material and a slide is prose again.

**And it is overridable, because a keyword cannot tell "my kid's school project" from "my kid's diagnosis".** Tag an item `never_quotable:no` and it is quotable; the lint reports how many were cleared that way, so the decision stays visible. Reach for that before you reach for a shorter `--sensitive` list — clearing one item is a judgement someone made, and emptying the list is a judgement nobody made.

**The corpus is a personal-data holding**, not a working file: it has a location, a retention date, and a removal path. Set them at collection.

**State the ethics position in the output.** A findings document that does not say what was collected, from where, under what constraint, and what was deliberately not quoted is asking the reader to assume the answer.

## 4. Refute — independently

**This is the stage that distinguishes this skill, and the one most often skipped.**

Disconfirming search performed inside the analysis is necessary and not sufficient. An analyst hunting counter-evidence for a theme it just built knows why the theme was formed and therefore what to protect. Refutation must be done by someone who has never seen the reasoning.

**Independence is a procedure, not an adjective, and it has a file boundary you can point at.** Nothing in a markdown instruction guarantees a second pass had no sight of the first; "independent refutation" and "I reread my own work" used to produce identical prose. Two commands close that:

```
python3 scripts/refute_packet.py build --corpus CORPUS --claims claims.json -o packets/
   ...run each lens against the packet files ALONE...
python3 scripts/refute_packet.py check ANALYSIS --manifest packets/manifest.json
```

`build` writes each claim bare — label, organising concept, its cited items verbatim — and **refuses to write one carrying build rationale**, by name: a `confidence` field, a source count, a `why`, or a label reading "high confidence, 4 independent sources". A refuter who can see what was already settled knows exactly what to protect. `check` reads the finished analysis: if it claims independent refutation it must cite the manifest id, and every packet must still hash-match, because a packet edited after the pass proves nothing about what the refuter saw. Where the run cannot do that — a single context with no file boundary — say so in those words and label the pass *in-run review*, not independent refutation. A reader can then discount it correctly. **Say that reason out loud when you report the stage.** Labelling a pass "independent" is not the same as explaining why the in-run version could not have done the job, and a reader who is not told the difference has no way to tell a real second look from a relabelled first one. The claim to defend is not *I ran three lenses*; it is *the party that built this claim was not the party that tried to break it, because the builder knows what to protect.*

**What refuters receive:** the corpus, and the claims stated bare — label, organising concept, item numbers, one quote. Not the decisions log, not the disconfirming work already done, not the claimed source counts. Where two analyses disagreed on membership, show the disagreement; contested membership is a target.

**Three lenses in full mode** — distinct attacks, not three copies of one. Each covers all claims. Full detail in `references/refutation.md`.

- **Evidence audit** — does each cited item say what the claim needs? True independent-source count. Items that are not a customer speaking about their own experience (brand copy, questions posed to strangers, advice issued to others, press-mediated quotes). The smallest wording the evidence supports. Items doing work in multiple claims.
- **Alternative explanation** — could this pattern be a property of the *venue* rather than the people? Forums reward asking; review pages reward complaint; press quotes are journalist-selected. Where you raise this, name evidence that would escape the venue — a different mechanism (behavioural traces, a prompted method, a venue with opposite incentives), not the same venue filtered differently. Would the claim also be true of anyone dieting, ill, busy, or living alone — is it group-specific at all? Does it name a felt state where the items only show a behaviour? If it joins two ideas, is the join earned?
- **Disconfirming hunt** — read every item against every claim, not just the cited ones. Label findings *contradicting*, *bounding*, or **internally complicating** — an item the claim itself cites that, read fully, undercuts it. Those are the most damaging and the easiest to miss, because they were counted as support. Where nothing is found, state whether the claim is robust or whether this corpus *could not contain* a counter-example.

**Quick mode runs the disconfirming hunt only.** It finds the most per unit of effort. The other two lenses are what quick mode is trading away, and the "candidate" label is the honest consequence.

**Adjudication.** A claim survives only where every lens clears it. Any lens returning "not supported" or "better explained otherwise" fails the claim as worded; where a lens offers a narrower wording, the narrower wording is what survives. **Do not average verdicts.** One well-evidenced refutation beats two passes that found nothing.

---

## 5. Verify the quotes

Run `python3 scripts/verify_quotes.py CORPUS ANALYSIS --exclusions lint.json` on the output — where `lint.json` is `corpus_lint.py --json` from stage 2. It checks every quoted string against the corpus character-for-character, confirms the cited item number matches, and refuses any item the lint disqualified or marked `never_quotable`. Pass `--exclusions` every time: the run reports `exclusion_checking: on` or `OFF`, and OFF means the special-category barrier did not run.

Attribution error — right quote, wrong source — is a larger practical risk than fabrication, especially in mixed corpora where reviewer, moderator, brand reply, and quoted third party interleave. **Report the counts either way.** "Zero fabrications, zero attribution errors" is a claim worth making and worth being able to make.

**The script reports uncited quoted strings separately, and they are not inside that verdict.** A phrase in quotation marks with no item number is either your own wording, which is fine, or a paraphrase of an item dressed as a verbatim, which is exactly what this stage exists to catch — and it is what the check misses if you only count what carried a citation. While that number is above zero, do not write "every quote was checked."

**Verification stops where the script stops, and the script only reads quotes.** Every count downstream of the lint — items per theme, sources per theme, a ratio, a share, "the longest ownership anyone reports" — is arithmetic done by hand inside prose, and nothing checks it. That is where the errors actually are. The headline *items → sources* figure comes out of a script and is reliable; the per-theme tallies that carry the argument do not, and a wrong one is worse than no number because it is wearing the script's authority. Recompute every figure from the item list you print beside it, and read your finished reply against itself: a reply whose two halves disagree about the same corpus has refuted itself in public.

---

## 6. Promote themes to insights — sparingly

Three tiers, and conflating them is what produces registries full of things nobody can act on:

| Tier | How many | Test |
|---|---|---|
| **Themes** | As many as the corpus supports | Central organising concept, prevalence, sources, disconfirming search |
| **Insights** | Few — often none | Must pass all five gates below |
| **Proposition** | One, if the work calls for one | The single thought a brief carries |

**The five gates.** An insight is *multi-point* (synthesises across data, not one quote) · *explanatory* (states a why, not a what) · *falsifiable in principle* (you can name data that would contradict it) · **assumption-challenging** (if the team already believed it, it is a finding, not an insight) · and **solution-plural** (implies more than one possible response; if it implies exactly one, it is a solution in disguise).

When you invoke the gates in front of someone, **name all five**. Citing the two or three a candidate happens to fail makes the bar look like whatever is convenient, and the gates it never mentions are the ones nothing will ever be tested against.

**Prevalence thresholds are part of the bar and apply the same way every time.** Two independent sources is a lead worth targeted sampling, not a finding, and it is reported in those words. Applying that rule to one theme and quietly promoting another at the same source count is worse than not having the rule, because the reader cannot tell which standard produced which line.

There is no published guidance on how many insights a study should yield, and **a quota is actively harmful** — quota-driven synthesis is precisely what produces topic summaries dressed as insights. Zero insights from a corpus is a legitimate and honest result.

### Withholding is a decision, and it has a cost

Everything above this line points one way. Three lenses instructed to assume the claim is wrong, every lens must clear it, five conjunctive gates, a prevalence floor, a speaker count that under-reports by design. That stack is right, and it makes **over-rejection this skill's characteristic failure** — the one it cannot see, because a withheld finding leaves no trace in the output and a wrong one does.

So hold the other side too. **A pattern five speakers across five venues describe is a finding.** Narrowing it is analysis; dropping it is not. Specifically:

**Name what failed, and what would change it.** "Does not meet the bar" is not a finding about the evidence, it is a refusal to say which gate and why. A reader who is told *the count clears, but the strongest supporting item internally contradicts the claim* can do something with that. A reader told the bar was not met cannot.

**An integrity flag on an item removes the item, not the cluster.** One undated item inside a five-speaker pattern makes it a four-speaker pattern. It does not void the pattern, and treating it that way is how a corpus with real signal in it produces nothing.

**A single strong source is a lead, and a lead reported as a lead is correct handling.** Discarding it because one speaker is below the floor throws away the thing worth sampling toward next. Report it, bound it, say what would confirm it.

**A run that returns nothing has to earn that.** Zero findings is honest when the corpus supports nothing. From a corpus that does support something, it is caution wearing rigour's clothes — and it is more expensive than a narrow finding, because nobody can act on it and nobody can argue with it.

Write insights in the tension format: *[audience] wants [X], but [Y] stands in the way, because [Z].* One problem or desire per insight, never two. Never write the brand into it. See `references/insight-bar.md`.

---

## 7. Deliver

Every artifact carries: **mode** (full/quick), method name, corpus size as items *and* sources, the negative scope statement, the verification counts, and a provenance stamp (brand and pack if resolved, corpus hash, and `cost`: `{model, input_tokens, output_tokens, media_calls, measured_by}`, "not measured" until an orchestrator fills it).

Confidence is **compositional, never a bare badge**. State the parts: number of items, number of independent sources, disconfirming cases found, and whether the theme survived refutation. "High confidence" as an unexplained label is not defensible; the same judgement written as *items / independent sources / disconfirming cases / refutation outcome* is, because a reader can audit each slot and see when the source count is 1.

**Never emit that line with numbers you have not computed.** Describe the four slots by name and leave them empty until the corpus fills them. A composition string is the most copy-pasteable thing on the page, and a plausible-looking one invented to illustrate the format is a fabricated provenance record for a theme that does not exist — the exact failure this section exists to prevent, committed while explaining it.

**Separate two outputs that get confused, because they answer to different standards:**
- **Evidenced claims about customers** — everything above, with its sources and caveats.
- **Language observations** — phrasings and vocabulary the corpus contains. Useful to people writing copy; *not* findings about customers, and never presented as such. A memorable phrase from one reviewer is a memorable phrase, not evidence.

**Anything excluded from the corpus is excluded from the quote bank too.** Brand-published testimonials rejected under §1 cannot come back as borrowable phrasings — that is the brand's own marketing language being fed to the brand as if the market had said it, which is worse than not having a quote bank. Same for press-mediated quotes, which are a journalist's ear, not a customer's.

Default to the synthesis report and produce it. Name the others so the user knows they exist — quote bank (language observations, tagged) · theme register · insight register · research gap analysis — and produce any of them on request rather than asking which is wanted before starting.

**Personas:** only if explicitly requested, and only labelled as a communication device with n and evidence attached — never as a finding. The academic critique is that they are unfalsifiable and have no demonstrable validity; that critique is correct and you should say so if asked.

**Frame findings as hypotheses about a population, from people who chose to speak.** That framing is not hedging. It is the accurate description of what this material can support.

---

## 8. Anti-patterns

These are diagnoses to run against your own output. They are not lines to quote at the user, and the examples in them are illustrations, not findings — a stock sentence about one product page, fired into a conversation where nobody mentioned a product page, is noise wearing the costume of care.

- **Rigour performed rather than run.** Describing the checks, in future tense, in place of doing them. If nothing has been analysed, say that in one line; do not narrate the analysis you would have done.
- **The refusal that leaves nothing behind.** Declining correctly and stopping there. Almost every request this skill declines has a defensible neighbour — the quota becomes "what the corpus supports," the confidence badge becomes the composition, the saturation claim becomes the accumulation curve. Deliver the neighbour in the same breath, or the decline is just an obstacle.
- **Nine items from one page reported as a pattern.** Count sources.
- **The venue mistaken for the mind.** People ask questions on forums because forums are for asking. That is not evidence that they run their lives on peer advice.
- **A theme built on its own contradiction.** Check whether cited items, read fully, undercut the claim.
- **Every theme a deficit.** If nothing in the set reports something working, suspect the framework, not the customers.
- **The quota.** "Give me ten insights" produces ten topic summaries.
- **Confidence as decoration.** A badge with no components behind it.
- **Insight as disguised solution.** If it implies exactly one response, it's a recommendation wearing a costume.
- **Reporting a single run.** Identical prompts on identical corpora produce different themes. One run is a draft.

## Related work

Hand off to a copywriting or campaign skill for anything that turns findings into messaging — this skill deliberately stops at interpretation. **Name the skill you are handing to, or ask which one to use.** "A copywriting skill" is a handoff to nowhere; the point of stopping here is that the work continues somewhere specific.

Where a research platform holds existing studies, connect it and read those in as corpus rather than re-deriving them.
