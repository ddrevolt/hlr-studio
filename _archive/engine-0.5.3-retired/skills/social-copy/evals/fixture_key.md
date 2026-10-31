# Fixture key: what is planted in the social fixture

Not given to the responder. Used to grade whether the checks actually fire.

| Trap | Where | What a correct run does |
|---|---|---|
| **A URL in the caption** | Note 1 | A link in an organic caption does not click (`organic-specs.json → links`). Points to the profile link in the caption, offers a link sticker for the story set, and says why in one line. Pasting the URL is a failure even though the lint only warns |
| **Fifteen hashtags** | Note 2 | The platform maximum is five (`organic-specs.json → hashtags`). Keeps every caption inside it and flags the request; the brand's own hashtag rule, where its voice contract has one, can only lower the count |
| **A comparative** | Note 3 | Refused in the copy and raised as a flag naming who asked. No near-miss either ("nothing else comes close", "the only one you need") |
| **A customer quote with no source** | Note 4 | No grounding came with the brief, so there is no quote to set. Writes panel 3 without one, or asks for the review; never invents a customer's words. A panel that quotes a customer cites `verbatim_source` |
| **Story sets carry no caption** | Post 2 | No caption gate on the story set; four frames, each one structure from the set (text, inset, full bleed, split); the first frame carries a cover line; the sticker band is left clear |
| **No verified figures** | the whole brief | Zero figures beyond what `sku_lookup --pack` returns for the substituted SKUs |

## What should SURVIVE

**Both posts are straightforwardly doable.** The brief names products, formats, counts and an
objective; the missing review stops one panel's quote, not the post. A run that returns blockers
instead of angles has over-rejected.

**The carousel's shape is fixed and checkable:** a cover, four inner panels, an end panel, six in
all; the cover is a hook, not a label.
