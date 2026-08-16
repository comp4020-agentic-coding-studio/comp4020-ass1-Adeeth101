# Image Style Template v2.0 — revised after live testing
### Supersedes v1.0 §01–§02. Same buckets, same workflow, rebuilt prompt architecture.

**Why there is a v2.** v1.0 was written before any image existed. Three nodes were
generated against it — Tetrapoda (A), Chordata (A), LUCA (B) — and four distinct
failures appeared, none of them random. Each traces to a structural property of the
template rather than to a bad individual prompt, which is why the fix is here and not
in 27 separate edits.

---

## 00 · WHAT FAILED, AND WHY

### Failure 1 — medium drift
The same prompt, in the same session, produced both a soft-shaded painted render and a
line-and-wash watercolour with visible pen hatching. **"Museum specimen illustration"
does not name a medium.** It names a genre that spans two centuries of wildly different
rendering conventions, and the model samples across all of them.

*Fix: name the rendering technique explicitly and positively.*

### Failure 2 — the constraint was buried
v1.0's order was: 60 words of style preamble → the fossil constraint → negatives. Image
models weight early tokens far more heavily than late ones. The eight digits, the aquatic
posture, the absence of claws — every load-bearing fact sat past word 70, behind palette
and lighting instructions that don't matter nearly as much.

*Fix: subject and critical anatomy first. Style last. This is the single biggest change.*

### Failure 3 — negatives are weakly obeyed
"No frame, no border, no matting" produced a decorative engraved rim. "A fully aquatic
animal, not a walking one" produced a walking animal. Negation is unreliable in image
generation — naming a thing raises its probability even inside a prohibition.

*Fix: every load-bearing negative gets restated as a positive assertion. Keep a short
negative list only for things with no positive equivalent.*

### Failure 4 — bucket B renders objects, not organisms
LUCA came back twice as an inanimate artefact: a stone bowl, then a decorated ceramic
plate with a hard rim. The words doing that damage are ours — **"specimen," "museum,"
"isolated," "matte finish"** all pull toward *preserved object* and away from *living
thing*. For an animal that's harmless. For a single cell with no body plan, it is fatal.

*Fix: bucket B drops "specimen" entirely and asserts aliveness and softness explicitly.*

### A fifth thing, learned not failed — counting doesn't work
*Acanthostega*'s eight digits came back as five, then six. Image models do not count
reliably, and no amount of prompt pressure fixes that. Burning generations on it is waste.

*Fix: where a count matters, ask for the visual impression instead — "a broad fan of many
closely-set slender digits, clearly more than five." That is achievable, honest, and
carries the same meaning to a reader who is not counting.*

---

## 01 · THE v2 PROMPT ARCHITECTURE

Five blocks, in this order, separated by blank lines. **The order is the point.**

```
1. SUBJECT      — what it is, in one sentence, leading with the single most
                  important anatomical fact
2. ANATOMY      — the fossil constraint, phrased entirely as positive assertions
3. POSE         — stated as what the body IS doing, never what it isn't
4. STYLE        — the locked block (§02), verbatim, unchanged across all 28
5. NEGATIVES    — the short list (§03), verbatim
```

Blocks 1–3 vary per node. Blocks 4–5 never vary. If a node seems to need a different
style block, change §02 once and regenerate every image — do not freelance.

---

## 02 · THE LOCKED STYLE BLOCK

Verbatim, every prompt, always fourth.

```
Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.
```

Two clauses are new and both are load-bearing:

- **"soft-shaded naturalistic painting … smooth continuous tonal modelling"** kills the
  watercolour/hatching variant that Failure 1 produced.
- **"mid-to-light in overall value"** protects the `mix-blend-mode: screen` composite.
  Screen lifts dark tones toward transparency *inside the subject*, so a moody, low-value
  render goes semi-transparent on the page however good it looks in isolation.

---

## 03 · THE SHORT NEGATIVE LIST

Verbatim, every prompt, always last. Cut from v1.0's seven lines to four — the dropped
ones were either redundant with the positive assertions above or actively counterproductive.

```
No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

## 04 · BUCKET B — THE ALIVENESS CLAUSE

Bucket B nodes replace block 2 with this, and **must not use the word "specimen"** in
block 1. Single cells and simple bodies are where the object-drift of Failure 4 happens.

```
This is a living organism, soft-bodied and flexible, with a yielding membrane
edge that bends and varies along its outline. The body is translucent, its
interior faintly visible through the surface. Every edge is soft. The form is
generalised and simple — no fossil constrains its appearance, so avoid
specific-looking detail that would imply evidence which does not exist.
```

Then the node's own "instead draw" line — again positive. Where v1.0 said *do not draw a
choanoflagellate*, v2 says what to draw in its place.

---

## 05 · THREE WORKED REWRITES

The three tested nodes, rebuilt. Use these as the pattern for the other 24.

### Tetrapoda — ~365 Ma — bucket A

```
An early four-limbed aquatic vertebrate about 60 cm long, with four limbs
that each end in a broad webbed paddle bearing many closely-set slender
digits — clearly more than five on each.

Constrained by Acanthostega gunnari, East Greenland, approximately 365
million years old. The digits are soft-tipped and blunt, ending in rounded
webbing. The forelimb is a flat paddle that stays straight, hinging only
sideways. The tail is deep and finned along its upper and lower edges like a
fish tail. Internal gills sit behind the skull under fish-like bone. The
ribs are short. The skull is flat on top and widens toward the back, with an
upturned snout and eye sockets set high.

The animal is floating in open water in a swimming posture, its body
horizontal, limbs held out sideways and relaxed, weight fully supported by
water. It is shown in left profile turned very slightly toward the viewer.

[STYLE BLOCK §02]

[NEGATIVE LIST §03]
```

What changed: digits described by impression rather than counted; "soft-tipped and blunt,
rounded webbing" replaces "no claws"; the swimming posture is asserted three ways rather
than negated once.

### Chordata — ~570 Ma — bucket A

```
A small flattened eel-like sea animal about 5 cm long, its body a series of
repeating V-shaped muscle blocks running head to tail, with a single fin
running continuously along its back.

Constrained by Pikaia gracilens, Burgess Shale. A slender stiffening rod
runs the length of the body just below the dorsal fin. The head is small,
blunt and simple, bearing a pair of short slender tentacles. A row of small
paired appendages sits just behind the head. The body is laterally
flattened, deepest at the middle, tapering to both ends.

The animal is swimming, its body held in a shallow S-curve, seen from the
side and slightly above. The dorsal fin is uppermost and the tentacled head
leads.

[STYLE BLOCK §02]

[NEGATIVE LIST §03]
```

What changed: the 2024 orientation correction is now asserted positionally ("dorsal fin
uppermost") rather than left to the model's reference bias; no paired pectoral fins are
mentioned, so none should appear.

### LUCA — ~4200 Ma — bucket B

```
A single living microorganism, greatly magnified — one soft rounded cell
with a flexible outer membrane, filling most of the frame.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The membrane curves gently in and out along its length, thicker in some
places than others, the way a soap bubble or a living cell wall does. The
interior is faintly and evenly granular throughout, with no separate
compartment, no nucleus, and no structure at the centre. The whole form is
slightly irregular — never a perfect circle or disc.

[STYLE BLOCK §02]

[NEGATIVE LIST §03]
```

What changed: "specimen" and "museum" removed entirely; the membrane's softness asserted
four separate ways; "slightly irregular, never a perfect circle" directly targets the
disc/plate failure mode.

---

## 06 · REGENERATION ORDER

Test again before batching — v2 is a hypothesis until it survives the same three nodes
that broke v1.

1. **Tetrapoda, Chordata, LUCA** at x2, using the rewrites above.
2. Judge side by side: same medium? All mid-to-light in value? LUCA alive?
3. If yes → rewrite the remaining 24 to the v2 architecture, then batch.
4. If the medium still drifts, the style block needs another pass and nothing else
   should be generated until it holds.

---

## 07 · WHAT DID NOT CHANGE

- The three buckets (A / A‡ / B) and every bucket assignment.
- Every fossil anchor, gap, and watch-note in `docs/IMAGE-PROMPTS.md` §01 and §05.
- 1:1 aspect ratio, pure black backdrop, WebP ship format, two width variants.
- The labelling requirement — every generated asset labelled on the page, with the
  A/A‡/B distinction carried to the reader.
- The rule that the template changes once and everything regenerates from it, rather
  than individual prompts being patched.

---

*Image Style Template v2.0 · One Unbroken Line · revised after live testing*
