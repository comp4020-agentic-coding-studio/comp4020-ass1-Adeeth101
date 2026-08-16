# Image Generation Style Template v1.0
### For: "One Unbroken Line" — 28 lineage node stills

**Rule: the preamble and the negative list below are used verbatim, every time.**
Only the `[SUBJECT]` slot and the optional fossil-constraint clause change per node.
Freelancing individual prompts produces 28 images from 28 visual universes, which
reads worse than no images at all.

---

## 01 · THE LOCKED PREAMBLE

Paste this exactly. Do not paraphrase, reorder, or "improve" it between runs.

```
Museum specimen illustration of [SUBJECT]. Scientific reconstruction,
anatomically plausible, not fantasy. Single soft key light from upper left,
low warm fill, no rim lighting. Muted warm-neutral palette: bone, ochre,
umber, slate grey, desaturated. Three-quarter view, subject centred, full
body within frame with generous margin. Isolated on a pure black
background. Matte finish, fine detail, restrained. No dramatic lighting,
no glow.
```

### Amended 2026-08-16 — black background, not transparent

Was "Isolated on a plain transparent background." Image models do not produce
real alpha; asking for transparency yields either a baked-in checkerboard, a
flat grey, or an arbitrary backdrop the model invented. Since the requirement
(§01) is that no rectangle shows against the shifting era ground, the reliable
route is a **pure black** backdrop composited with `mix-blend-mode: screen`,
under which black is the identity and vanishes against any ground colour.

Two consequences to design around, not discover later:

- **Screen blending lifts dark tones toward transparency.** It is not a
  keying operation — deep shadows inside the subject go partly transparent
  too. The palette clause above (bone, ochre, umber, slate grey) already
  keeps subjects in the mid-to-light range, which is what makes this
  workable; a subject rendered dark against black will partly disappear.
  Reject any generation whose subject sits low in value, however good it
  looks on its own.
- **The era ground shows through the subject's darker passages.** A specimen
  will pick up a faint iron cast in the Archean and a cool one in the
  Quaternary. This is arguably correct — the specimen sits *in* its era
  rather than on top of it — but it does mean the stills are not colour-
  neutral, and they must be judged against the live gradient (§06 step 5),
  never against a flat swatch.

### Why each clause is load-bearing

| Clause | Doing what |
|---|---|
| "Museum specimen illustration" | Sets medium once. The single strongest consistency lever. |
| "Single soft key from upper left" | Lighting direction is the fastest tell of a mismatched set. |
| "Muted warm-neutral palette, desaturated" | Keeps 28 images from fighting each other or the wall behind them. |
| "Three-quarter view, centred, generous margin" | Consistent framing across wildly different body plans. |
| **"Isolated on a pure black background"** | **Critical.** The page background interpolates across geological eras — a baked-in backdrop shows as a visible rectangle against a shifting wall. Pure black is the one colour that can be cancelled in CSS without real alpha. |
| "Matte, no glow, no dramatic lighting" | Stops the generator reaching for the default sci-fi treatment. |

---

## 02 · THE NEGATIVE LIST

Append to every prompt, unchanged:

```
No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

## 03 · THE FOSSIL-CONSTRAINT CLAUSE

**Required by `CLAUDE.md`:** where a real fossil constrains the appearance, the
prompt must say so explicitly. Insert this between the preamble and the negative
list for bucket-A nodes only:

```
Reconstruction constrained by known fossil material: [SPECIFIC FEATURES].
Do not invent anatomy beyond what the specimen supports.
```

Fill `[SPECIFIC FEATURES]` from real reference — body proportions, limb structure,
skull shape, known integument. This is research to do *before* generating, not a
placeholder to wave at.

---

## 04 · NODE BUCKETS

Sort all 28 before generating. The two buckets take different prompts and carry
different honesty obligations.

### Bucket A — fossil-constrained
A real specimen exists and constrains the look. **Must** carry the constraint clause.
Getting these visibly wrong undermines the whole factual premise of the piece.

Typical members: Tiktaalik, early tetrapods, synapsids/Dimetrodon, early mammaliaforms,
early primates, hominins, *Homo sapiens*.

### Bucket B — inferred
No fossil, or nothing that constrains appearance. Nobody knows what LUCA looked like.
These are **honest visual hypotheses**, and the page should not imply otherwise.

Typical members: LUCA, early prokaryote, first eukaryote, Amorphea, Opisthokonta,
early metazoan-grade forms.

For bucket B, add to the prompt:

```
Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
```

> **Consider labelling bucket B differently on the page** — "inferred, no fossil
> record" versus "reconstruction from fossil material" is a real distinction, and
> surfacing it is a point in your favour on the science-accuracy discipline you
> wrote into your own harness. It costs one line of caption text.

---

## 05 · FIXED OUTPUT PARAMETERS

Lock these across the whole set. Varying any of them breaks the set.

| Parameter | Value | Note |
|---|---|---|
| Aspect ratio | **1:1** | Same slot in every plate; the layout is a fixed frame. |
| Background | **Pure black `#000000`** | Non-negotiable — see §01. Composited with `mix-blend-mode: screen`, under which pure black is the identity and disappears against any era ground. Do **not** substitute `#14171B` or any near-black: screen only cancels *exact* black, and a near-black backdrop leaves a visible lifted rectangle. |
| Resolution | Generate large, downscale for ship | Two width variants, per the media budget. |
| Ship format | **WebP** | Consistent with the frame-sequence decision. |
| Per-image budget | Keep the 28-image set well under the page-weight ceiling | Lazy-load everything below the fold. |

---

## 06 · WORKFLOW

1. **Bucket all 28** into A and B. Write the list down before generating anything.
2. **Gather fossil reference** for every bucket-A node. Actual features, not vibes.
3. **Generate three test subjects first** — one bucket-A, one bucket-B, and one
   awkward body plan (something without an obvious three-quarter view). Put them
   side by side. If they don't look like the same project, fix the template, not
   the individual prompts.
4. **Only then batch the remaining 25.**
5. **Check against the live background gradient**, not against a flat swatch —
   an image graded for slate can look wrong against an iron-red Archean wall.
6. **Check spend** before and after the batch.

---

## 07 · LABELLING (required, decide before layout lands)

Every generated asset is labelled as AI-generated on the page — this is a hard
rule in your own `CLAUDE.md`, and passing off a generated still as a fossil
photograph is a straightforward integrity problem, not a stylistic choice.

Decide now, because it affects the plate layout:

- **Per-image caption** — most honest, most visible, costs vertical space in every plate
- **Single footer disclosure** — cleanest layout, weakest signal
- **Both** — per-image short tag plus a fuller footer note explaining method and sources

Recommended: **both**, with the per-image tag doing double duty as the
bucket-A/bucket-B distinction from §04.

---

## 08 · GUARDRAILS

- ✗ **Do not** edit the preamble between nodes. If it needs changing, change it
  once and regenerate everything from that point.
- ✗ **Do not** let one node get "special" treatment because it looked boring.
  That one image will be the one that reads as pasted in from elsewhere.
- ✗ **Do not** generate a bucket-B organism with fossil-grade specific detail.
  Invented precision is the visual equivalent of a fake-exact date.
- ✗ **Do not** bake a background into any image.
- ✗ **Do not** batch-generate before the background gradient is landed and seen.

---

*Image Style Template v1.0 · One Unbroken Line*
