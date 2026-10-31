# Ethics — what you may collect, hold and quote

**Read before the first collection run, not before publication. By publication the decisions are already made.**

This skill points at other people's speech. Most of it is public, none of it was given to you, and a meaningful share of it is about their bodies, their money, or their children. That combination is the whole of the problem.

---

## Public is not consented

A forum post is public speech. It is not permission to appear in a commercial deck, a pitch, or a positioning document. The person wrote it for the people in that thread.

This is not a legal claim — in many places quoting public text is lawful — it is a scope claim. **Lawful and appropriate are different tests, and the second one is the one that damages a brand when it is failed.** Ask what the writer would say if they saw their sentence on a slide.

## Verbatims are re-identifiable, and that is the mechanism that matters

Anyone holding a report can paste a quote into a search box and find the account that wrote it. Removing the username does nothing. A verbatim IS an identifier.

So the working rules:

**Quote at the shortest length that carries the meaning.** Every additional clause narrows the search space toward one person.

**Never pair a verbatim with a handle, username, profile link, or venue permalink in anything that leaves the team.** The corpus needs the venue identifier to check source collapse; the *deliverable* does not. Cite the item number, keep the venue in the corpus.

**Prefer paraphrase for anything sensitive** — and label it as paraphrase, which `verify_quotes.py` will otherwise flag as an uncited quoted string, correctly.

## Special-category content: read it, count it, do not quote it

Health, medication, mental state, sexuality, finances, immigration status, religion, anything about a named child. Under GDPR this is special-category personal data and the bar for processing it is materially higher than for ordinary text. Other regimes differ in wording and agree in direction.

**The rule that follows is the same as the one already applied to prohibited territories: it may inform the analysis and it may not reach the output.** Tag it `never_quotable:yes` at ingest, count it toward the evidence, keep it out of every deliverable. A finding can rest on it; a slide cannot repeat it.

This one is machine-enforced, which changes what you have to do about it. `corpus_lint.py` reads the tag and also infers it from content, using a marker list you can set with `--sensitive` — health, medication, diagnosis, finances, immigration, `my son`, `my daughter`, `my kid` and so on. Anything it catches goes into the lint's JSON, and `verify_quotes.py --exclusions <that JSON>` errors if one of those items is quoted. Run the pair. A verifier run without `--exclusions` reports `exclusion_checking: OFF`, and OFF means this rule is prose again.

**A keyword cannot tell "my kid's school project" from "my kid's diagnosis", so the inference is overridable — in writing, in the corpus.** Put `never_quotable:no` on an item and it becomes quotable, and the lint reports how many items were cleared that way. Use it: a check that over-blocks gets turned off wholesale, which is worse than one that never ran. But use it item by item, after reading the item, rather than by emptying `--sensitive`. The difference between those two is the difference between a judgement someone made and a judgement nobody made.

This is not hypothetical. A corpus about people using a particular medication is health data about identifiable individuals, and it will sit in whatever folder the analyst put it in — usually a shared one, usually without anyone having decided that. Decide it rather than defaulting into it.

## The corpus is a personal-data holding

Not a working file. Which means it has questions attached that working files do not:

**Where does it live, and who can reach it?** A shared drive is a disclosure surface.

**How long is it kept?** Indefinite retention of scraped personal speech is the hardest position to defend and the easiest to fall into. Set a date at collection.

**What happens when someone asks for removal?** Rare, and the answer cannot be "we have no way to find it." Item numbers keyed to venue identifiers make it findable, which is one more reason the citation discipline earns its keep.

## Platform terms

Most large platforms restrict automated collection in their terms, independently of copyright and independently of whether the content is public. Reddit, review platforms and social networks all differ, and they change.

**Check the terms for each venue class before it enters the frame, and record the check.** A sampling frame that names its venues is the natural place for it — one line per venue class saying what was checked and when. This is also the honest answer when someone asks whether the research was collected properly.

## Where this skill will not help you

It cannot tell whether a quote is sensitive, whether a platform's terms changed last month, or whether the person would object. Those are judgements. What it can do is make the material auditable: every quote traceable to an item, every item traceable to a venue and a date, nothing repaired, nothing silently dropped.

**State the ethics position in the output.** A findings document that does not say what was collected, from where, under what constraint, and what was deliberately not quoted, is asking its reader to assume the answer.
