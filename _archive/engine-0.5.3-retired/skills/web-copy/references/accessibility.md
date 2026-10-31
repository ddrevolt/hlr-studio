# Accessibility — the floor a public page owes its readers

**Read this before writing link text and alt text, not after a report flags them.** By the time a finding exists the copy is already written, and most of these are free at the moment of writing and expensive afterwards.

This is the one gate email and paid do not have. The reason is not that email readers matter less — it is that a page is a persistent, public, indexed surface that a stranger arrives at with whatever they are using, and in most markets this brand sells in, that surface is a legal object.

The suite had **zero** accessibility checking of any kind before this — no contrast, no heading structure, no target size — while describing its components as template-grade. That was a real gap, and it is worth naming because "template-grade" reads like it covers this and does not.

---

## What is checked, and at what level

`scripts/a11y_check.js` names the success criterion and conformance level on every finding. That precision is not pedantry: overclaiming a WCAG level is how an accessibility report gets dismissed whole, including the parts that were right.

| Criterion | Level | What it catches |
|---|---|---|
| **1.1.1** Non-text Content | A | Missing alt, filename alt, "Image of…", decorative images given descriptions |
| **1.3.1** Info and Relationships | A | No h1, several h1s, skipped levels, empty headings |
| **1.4.3** Contrast (Minimum) | AA | Text below 4.5:1, or 3:1 for large text |
| **2.4.4** Link Purpose (In Context) | A | The same vague label pointing at different destinations |
| **2.4.9** Link Purpose (Link Only) | AAA | A single vague label — real usability, and only AAA by the letter |
| **2.5.8** Target Size (Minimum) | AA (2.2) | Interactive targets under 24×24 |

**Large text** is 24px, or 18.66px when bold. Below that the floor is 4.5:1, and a near miss is a miss: 4.4:1 fails, even when a brand's own strictness map proposes the pair as a remedy.

---

## The three that are copy decisions, not code

### Link text has to work in a list

A screen-reader user can pull up every link on the page as a list. A footer whose link slots read "Learn more" again and again produces a run of identical entries going to different places.

Write the destination into the label. **"Shop the collection," not "Order now." "How it is made," not "Read more."** This costs nothing at the moment of writing and it is a real edit afterwards, because the short label was usually chosen to fit a slot budget and the honest one is longer.

Where a budget genuinely will not take the honest label, that is a finding about the component, not a licence to ship "Learn more" again and again.

### Alt text describes what the image conveys, not what it depicts

The test is not "what is in this picture." It is **"what would this reader lose if the image did not load."** A hero shot of a jacket on a model conveys *this is how it fits and how it moves*, and "jacket on a person" carries none of that.

Three specific things:

**Never start with "Image of."** It is already announced as an image; the words are repeated to the reader.

**Decorative means empty, and empty means deliberate.** An image that adds nothing gets `alt=""` — announced as nothing. That is different from *no alt attribute*, which many readers answer by reading out the filename. The distinction is the whole point, and a check cannot infer which you meant, so mark decoration explicitly.

**Do not restate a caption.** If the copy beside the image already says it, the alt should say what the copy does not.

### Headings are a structure, not a size

One h1: the page's subject. On a collection page that is the collection header's title; on a product page it is the product title. Nothing skips a level. A styled-large paragraph is not a heading and a small heading is still a heading.

This is the one people get wrong by writing rather than by coding: a section headed with a line that is really a sentence, or a card title promoted to h2 because it looked important.

---

## What a clean report does not mean

**Automated checking finds roughly a third of real accessibility problems.** The share is well established and worth carrying around, because a green result is otherwise read as a finished job.

Not checked here, and not implied by anything this script says:

**Keyboard order and focus visibility** — whether you can reach every control without a mouse and see where you are. These are the most common real-world blockers and neither is inferable from a node list.

**Motion and autoplay**: a carousel that advances on its own is a genuine barrier, and sections often become carousels on mobile.

**Whether the page makes sense read aloud** — the order the DOM presents things in versus the order the design implies. A three-column benefit row reads as three columns; a carousel reads as a list of slides.

**Forms**, which this library barely has today and will.

Report the clean run *and* the list above. A CLEAR verdict that is presented as an accessible page is the same category of error as a lint verdict written into free text: something that reads like a guarantee and is a measurement of a subset.
