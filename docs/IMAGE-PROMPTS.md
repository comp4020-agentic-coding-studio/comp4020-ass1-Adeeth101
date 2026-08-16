# Image Prompts — all 28 nodes
### "One Unbroken Line" · generated from `docs/IMAGE-STYLE.md` v1.0

One ready-to-paste prompt per node in `src/data/lineage.ts`. Each is the locked
preamble (§01) verbatim, plus the subject, plus — for fossil-constrained nodes —
the constraint clause (§03) filled in from real reference, plus the negative list
(§02) verbatim.

**Do not edit the preamble or negative list here.** If either needs to change, change
it in `docs/IMAGE-STYLE.md` and regenerate this file, per §08.

---

## 00 · READ THIS BEFORE GENERATING ANYTHING

### The A/B split in §04 was not sufficient. There are three buckets, not two.

§04 assumes a clean division: a fossil exists and constrains the look (A), or nothing
does (B). Bucketing all 28 against actual reference broke that assumption. A large
group of nodes has a real, named specimen — and that specimen is **a jaw, or a
handful of teeth, or a partial skull with no body at all**. Calling those "fossil-
constrained" and drawing a confident whole animal is exactly the invented precision
§08 forbids; calling them "inferred" throws away the constraint that does exist.

So this file uses:

| Bucket | Meaning | Prompt carries |
|---|---|---|
| **A** | Specimen(s) constrain the body plan | §03 constraint clause, filled |
| **A‡** | Specimen exists but constrains **only part** (jaw, teeth, ankle); body plan extrapolated from a relative some distance away in time | §03 clause, filled **and** scoped to what is actually preserved |
| **B** | No fossil constrains appearance | §04 bucket-B schematic clause |

**A‡ is the bucket that will get this page in trouble if it is ignored**, because it
is the one where a beautiful, confident, entirely invented animal is easiest to
produce and hardest to notice.

### Every node is separated from its fossil by a gap. Most gaps are large.

The dataset's ages are molecular-clock estimates. Fossils are almost always younger —
sometimes by 10 Myr, sometimes by 90. The gap is recorded per node below and is not
a detail: at Primates (~80 Ma) the nearest contested candidate is ~14 Myr younger and
the nearest undisputed primate ~24 Myr younger. An illustration at that node is a
depiction of a relative, not of the ancestor.

### Colour is unconstrained at all 28 nodes.

No node in this dataset has preserved colour evidence. Where an image shows pigment,
patterning or markings, that is illustrator invention and must be labelled as such.
The one partial exception found — melanosome evidence for uniform dark brown in
*Megaconus* — is ~165 Ma, some 60 Myr after the Mammaliaformes node it would be used
for, so it does not license colour there either.

### The black-background caveat applies to every prompt here

Per `docs/IMAGE-STYLE.md` §01, subjects composite with `mix-blend-mode: screen`, under
which pure black vanishes. Screen is not keying: it lifts dark tones toward
transparency **inside the subject too**. Reject any generation that sits low in value,
however good it looks alone.

**The page now consumes these** (built 2026-08-16, `MUSEUM-EDITORIAL-SPEC.md` §05
amendment). Drop a file at `images/plates/<node id>.webp` and that node's plate grows
an image slot with no code change; a node with no file renders no slot at all. The tag
under each image is generated from the bucket in the table below, via
`src/data/image-buckets.ts` — so **the bucket assignments above are now code**, and
getting one wrong is a failing test rather than a mislabelled picture.

---

## 01 · BUCKET ASSIGNMENTS

| # | Node | Age (Ma) | Bucket | Anchor specimen | Fossil gap |
|---|---|---|---|---|---|
| 1 | LUCA | 4200 | **B** | — | — |
| 2 | First eukaryote | 1900 | **B** | — | — |
| 3 | Amorphea | 1600 | **B** | — | — |
| 4 | Opisthokonta | 1100 | **B** | — | — |
| 5 | Holozoa | 1050 | **B** | — | — |
| 6 | First animal | 800 | **B** | — | — |
| 7 | Eumetazoa | 750 | **B** | — | — |
| 8 | Bilateria | 650 | **B** | *Ikaria wariootia* rejected as anchor | ~90–95 Myr |
| 9 | Deuterostomia | 580 | **B** | none; *Saccorhytus* reclassified 2022 | ~60 Myr |
| 10 | Chordata | 570 | **A** | *Pikaia gracilens* (USNM PAL 57628) | ~50–65 Myr |
| 11 | Vertebrata | 550 | **A** | *Haikouichthys*, *Metaspriggina* | ~30 Myr |
| 12 | Gnathostomata | 460 | **A** | *Xiushanosteus mirabilis* | ~24 Myr |
| 13 | Osteichthyes | 430 | **A** | *Eosteus*, *Guiyu oneiros* | none — bracketed |
| 14 | Sarcopterygii | 420 | **A‡** | *Psarolepis romeri* (disarticulated) | at/after node |
| 15 | Tetrapoda | 365 | **A** | *Acanthostega gunnari* | none |
| 16 | Amniota | 330 | **A‡** | *Hylonomus lyelli* | ~12 Myr |
| 17 | Synapsida | 318 | **A‡** | *Archaeothyris florensis* | ~12 Myr |
| 18 | Mammaliaformes | 225 | **A‡** | *Morganucodon* | ~20 Myr |
| 19 | Eutheria † | 160 | **A** | *Juramaia sinensis* (BMNH PM1343) | none |
| 20 | Boreoeutheria | 93 | **B** | none — zero-fossil node | ≥27 Myr |
| 21 | Primate branch † | 80 | **A‡** | *Purgatorius*, *Carpolestes simpsoni* | ~14 / ~24 Myr |
| 22 | Haplorhini | 70 | **A** | *Archicebus achilles* (IVPP V18618) | ~14–15 Myr |
| 23 | Simiiformes | 55 † | **A‡** | *Eosimias* — dentition only | ~10 Myr |
| 24 | Hominoidea | 27 | **A‡** | *Rukwapithecus* (jaw); *Ekembo* for body | ~2 / ~7–10 Myr |
| 25 | Hominini | 7.5 | **A‡** | *Sahelanthropus* (TM 266-01-060-1) | ~0.3–0.8 Myr |
| 26 | Homo | 2.8 | **A‡** | LD 350-1 — **mandible only** | none, but jaw only |
| 27 | *Homo sapiens* | 0.3 | **A** | Jebel Irhoud 1, 2, 10, 11 | none |
| 28 | You | 0 | **special** | — | see §04 |

Counts: **B — 10**, **A — 8**, **A‡ — 9**, special — 1.

Corrected 2026-08-16: this line read "B — 11, A — 7" and neither figure matched
the table above it. Caught by `spec/plate-image.test.ts`, which asserts these
counts against `src/data/image-buckets.ts` — the bucket assignments are now
code, so a miscount is a failing test rather than a number nobody re-adds.

**†** — name or date corrected in `src/data/lineage.ts` as a result of this
research pass. The reasoning is in §05; the commits are separate from this file's.

---

## 02 · HOW EACH PROMPT BELOW IS ASSEMBLED

Every prompt in §03 and §04 is the same four blocks in the same order, separated by
blank lines (the blank lines are part of the prompt — they stop the model reading
the constraint clause as a continuation of the palette instruction):

1. **The locked preamble**, `docs/IMAGE-STYLE.md` §01, verbatim. The *only* thing
   that varies is the `[SUBJECT]` slot.
2. **The middle block**, which is the one thing that differs by bucket:
   - **A / A‡** → the fossil-constraint clause (§03), filled from real reference,
     and for A‡ explicitly scoped to *what is actually preserved*.
   - **B** → the bucket-B schematic clause (§04), verbatim.
3. **The negative list**, §02, verbatim.

Nothing else may vary. If a node seems to need a different preamble, that is a
signal to change the preamble once in `docs/IMAGE-STYLE.md` and regenerate this
whole file (§08) — not to freelance one prompt.

**Two rules that only show up once you are generating:**

- **The watch-note beats the reference image.** Several nodes here have a
  well-known illustration that current work has overturned (Chordata's orientation,
  Deuterostomia's *Saccorhytus*, Tetrapoda's *Tiktaalik*). A reverse-image search
  will confidently hand you the superseded picture. Read the watch-note first.
- **Generate in the order §06 sets out**, not node order: three test subjects
  first — one A, one B, and one awkward body plan — judged side by side against
  the *live* background gradient. Only then the remaining 25.

---

## 03 · BUCKET A / A‡ PROMPTS — fossil-constrained

### 10 · Chordata — ~570 Ma · **A**

**Anchor:** *Pikaia gracilens*, Burgess Shale, ~505 Ma (syntype USNM PAL 57628).
**Gap:** ~50–65 Myr — the node predates any defensible chordate body fossil.
**Watch:** Mussini et al. 2024 (*Current Biology* 34:2980–2989) **flipped this animal's orientation — every pre-2024 illustration is upside down**, so reference images found by search are unreliable. Position contested (stem-chordate / cephalochordate / craniate / annelid). No eyes are preserved in any specimen, despite Walcott reporting them.

```
Museum specimen illustration of an early chordate, a small soft-bodied
marine swimming animal about 4 cm long. Scientific reconstruction,
anatomically plausible, not fantasy. Single soft key light from upper left,
low warm fill, no rim lighting. Muted warm-neutral palette: bone, ochre,
umber, slate grey, desaturated. Three-quarter view, subject centred, full
body within frame with generous margin. Isolated on a pure black
background. Matte finish, fine detail, restrained. No dramatic lighting,
no glow.

Reconstruction constrained by known fossil material: Pikaia gracilens,
Burgess Shale, approximately 505 million years old. Body 1.5 to 6 cm,
fusiform and laterally compressed to roughly twice as tall as wide, tapering
at both ends, with an expanded tail fin and delicate dorsal and ventral fin
folds. About 100 V-shaped chevron muscle blocks along the body. A small
bilobed head bearing one pair of short tentacles about 1 mm long. A small
circular mouth on the underside, no jaws and no teeth. Six pairs of
pharyngeal slits bearing filaments. A narrow gut ending in a terminal anus.
Soft cuticle, no exoskeleton, and no eyes. Orient the animal per the 2024
reinterpretation, with the fin folds dorsal.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 11 · Vertebrata — ~550 Ma · **A**

**Anchor:** *Haikouichthys ercaicunensis*, *Myllokunmingia fengjiaoa*, Chengjiang, ~518 Ma.
**Gap:** ~30 Myr.
**Watch:** Lei et al. 2026 (*Nature* 650:150–155) reinterpret the "nasal sacs" as a second pair of eyes — **a live 2026 dispute over whether this animal had two eyes or four.** This prompt follows the two-eye reconstruction; that is a choice and belongs in the caption. Some workers treat all three genera as decay-stage variants of a single animal.

```
Museum specimen illustration of the first vertebrate, a small jawless
fish-like marine animal about 3 cm long. Scientific reconstruction,
anatomically plausible, not fantasy. Single soft key light from upper left,
low warm fill, no rim lighting. Muted warm-neutral palette: bone, ochre,
umber, slate grey, desaturated. Three-quarter view, subject centred, full
body within frame with generous margin. Isolated on a pure black
background. Matte finish, fine detail, restrained. No dramatic lighting,
no glow.

Reconstruction constrained by known fossil material: Haikouichthys
ercaicunensis and Myllokunmingia fengjiaoa, Chengjiang, approximately 518
million years old. 2.5 to 3 cm long, slender and elongate. A sail-like
dorsal fin continuous with the tail fin, and a narrow ventral fin. Zigzag
double-V muscle blocks. A notochord with vertebral elements, and a defined
skull with cranial cartilages and ear capsules. At least six gill pouches
with fine filaments. Two large upward-facing eyes. No jaws, no scales, no
bone and no mineralised tissue anywhere on the body.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 12 · Gnathostomata — ~460 Ma · **A**

**Anchor:** *Xiushanosteus mirabilis*, Chongqing, ~436 Ma — the oldest *complete* jawed fish.
**Gap:** ~24 Myr. The 439 Ma *Qianodus* material is **tooth whorls only** and preserves no body.
**Watch:** all relevant taxa were described in 2022 and are still being revised; *Xiushanosteus* is Placodermi *incertae sedis*, mixing characters from several placoderm clades.

```
Museum specimen illustration of an early jawed fish about 3 cm long.
Scientific reconstruction, anatomically plausible, not fantasy. Single soft
key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Xiushanosteus
mirabilis, Chongqing, approximately 436 million years old. About 3 cm long,
a flattened placoderm, wider than tall. A bony head shield with paired
plates behind the eye and at the rear, gently curving lateral line grooves,
and long head spines projecting backward and outward. A fissure separating
the rear skull plates, forming a mobile joint. Two median dorsal plates and
a row of trunk scutes. Small diamond-shaped scales over the body. Two dorsal
fins of similar size, each with a spine. A tail fin with the upper lobe
longer and a rounded lower lobe.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 13 · Osteichthyes — ~430 Ma · **A**

**Anchor:** *Guiyu oneiros*, Qujing, 425.6 Ma (holotype IVPP V15541); *Eosteus chongqingensis*, ~436 Ma.
**Gap:** **none — this node is fossil-bracketed**, the only one in the set whose anchor is *older* than the node.
**Watch:** *Eosteus* was described in March 2026 and the "oldest bony fish" title moved off *Guiyu* very recently. *Guiyu*'s tail fin is unpreserved, so its shape is inferred.

```
Museum specimen illustration of an early bony fish about 30 cm long.
Scientific reconstruction, anatomically plausible, not fantasy. Single soft
key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Guiyu oneiros, Qujing,
approximately 425 million years old. Complete animal about 30 cm long, the
trunk about 26 cm long and 11 cm deep, head about 23 percent of body length,
streamlined. Pectoral, pelvic and dorsal fins all bearing large spines.
Three median plates behind the skull roof. A pelvic girdle of paired lateral
plates plus an unpaired median plate. Skull bones and scales coated in a
glossy enamel-like layer. Strongly regionalised scale cover: rhomboid flank
scales bearing 5 to 35 fine ridges, distinctly taller than long toward the
front and back, nearly square toward the belly, with large oval scutes near
the midline of the underside. The tail fin is not preserved in the specimen;
keep it plain and unelaborated.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 14 · Sarcopterygii — ~420 Ma · **A‡**

**Anchor:** *Psarolepis romeri*, Qujing, ~419–411 Ma — **disarticulated material only.**
**Gap:** at or after the node.
**Watch — the most dangerous node in the set.** The one trait a reader expects here, the **fleshy lobed paired fin, is not documented at this node**; it is known from much younger Devonian taxa (*Osteolepis*, *Eusthenopteron*, ~370 Ma). *Psarolepis* and *Guiyu* have also been recovered *outside* crown Sarcopterygii (Lu et al. 2017), in which case this node has no good body fossil at all.

```
Museum specimen illustration of an early lobe-finned fish. Scientific
reconstruction, anatomically plausible, not fantasy. Single soft key light
from upper left, low warm fill, no rim lighting. Muted warm-neutral palette:
bone, ochre, umber, slate grey, desaturated. Three-quarter view, subject
centred, full body within frame with generous margin. Isolated on a pure
black background. Matte finish, fine detail, restrained. No dramatic
lighting, no glow.

Reconstruction constrained by known fossil material: Psarolepis romeri,
Qujing, approximately 419 to 411 million years old, known only from
disarticulated material. A humped snout with the nostrils positioned above
the eyes. Head plates covered by a smooth porcelain-like layer that obscures
the sutures. Large fangs on the snout tooth plate and tooth whorls at the
midline of the lower jaw. A large spine immediately in front of the pectoral
fin and another in front of a median dorsal fin. Thick rhombic scales with a
distinct neck between crown and base. No articulated specimen exists: the
overall body outline is extrapolated from the related Guiyu oneiros. Do not
depict a fleshy lobed paired fin — that morphology is documented only in
much younger Devonian animals, not at this node.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 15 · Tetrapoda — ~365 Ma · **A**

**Anchor:** *Acanthostega gunnari*, East Greenland, ~365 Ma (MGUH-VP-8158 "Rosie", MGUH-VP-8160 "Grace").
**Gap:** none.
**Watch — do not anchor on *Tiktaalik*.** *Tiktaalik roseae* (~375 Ma) is an elpistostegalian sarcopterygian **fish**, not a tetrapod: its pectoral appendage retains fin rays. It is the famous image for this transition and it is the wrong animal for this node. Both *Acanthostega* and *Ichthyostega* are stem tetrapods and their relative order is unstable; Long et al. (2025) place crown Tetrapoda ~379.7 Ma, older than this node.

```
Museum specimen illustration of an early four-limbed tetrapod about 60 cm
long. Scientific reconstruction, anatomically plausible, not fantasy. Single
soft key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Acanthostega gunnari,
East Greenland, approximately 365 million years old. About 60 cm long. Eight
webbed digits on each hand. No wrist joint, and an elbow that cannot flex
forward, so the forelimb is a paddle and cannot bear the animal's weight.
Internal gills still covered by fish-like bones. Ribs too short to support
the chest out of water. Skull about 111 mm long, V-shaped seen from above
and widening toward the back, with a squared rear margin, an upturned snout
with a distinct break in slope, a hooked front lower jaw, and eye sockets
about 15 percent of skull length. Roughly 10 upper front teeth, 44 upper
cheek teeth and more than 60 lower jaw teeth, plus fangs on the palate.
Depict a fully aquatic animal, not a walking one.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 16 · Amniota — ~330 Ma · **A‡**

**Anchor:** *Hylonomus lyelli*, Joggins, Nova Scotia, ~318 Ma. Integument from *Captorhinus aguti*, ~289 Ma (ROMVP 88287).
**Gap:** ~12 Myr for the body; ~41 Myr for the skin.
**Watch:** Jenkins, Meyer & Bhullar (2025) recover *Hylonomus* **outside crown Amniota**, removing the classical anchor. The skin fragment is smaller than a fingernail and is not associated with a skeleton, so its attribution and body region are undetermined — treat it as grade-level evidence only.

```
Museum specimen illustration of an early amniote, a small lizard-like land
vertebrate about 20 cm long. Scientific reconstruction, anatomically
plausible, not fantasy. Single soft key light from upper left, low warm
fill, no rim lighting. Muted warm-neutral palette: bone, ochre, umber, slate
grey, desaturated. Three-quarter view, subject centred, full body within
frame with generous margin. Isolated on a pure black background. Matte
finish, fine detail, restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Hylonomus lyelli,
Joggins, Nova Scotia, approximately 318 million years old. About 20 cm long
including the tail, broadly lizard-like in proportion, with small sharp
teeth suited to invertebrate prey. Trackway evidence gives a five-fingered
hand and foot with the first and fifth digits shortest and the third and
fourth longest, sharp inward-curving claws on the first four digits and a
short claw on the fifth, and a posture leaving no belly or tail drag mark.
Skin at this grade is known only from a much younger relative: closely
spaced, non-overlapping tubercular scales with a pebbled crocodile-like
texture and flexible hinged regions between them. Do not draw overlapping
reptilian scales and do not draw bony armour.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 17 · Synapsida — ~318 Ma · **A‡**

**Anchor:** *Archaeothyris florensis*, Joggins, ~306 Ma.
**Gap:** ~12 Myr.
**Watch:** *Echinerpeton*'s synapsid membership is doubted and Benson (2012) treats it as a wildcard taxon. **No synapsid skin is known at this date** — integument is inference by bracketing, not evidence. The sail-backed silhouette everyone pictures is *Dimetrodon*, tens of millions of years later.

```
Museum specimen illustration of an early synapsid, a carnivorous land
vertebrate with monitor-lizard proportions. Scientific reconstruction,
anatomically plausible, not fantasy. Single soft key light from upper left,
low warm fill, no rim lighting. Muted warm-neutral palette: bone, ochre,
umber, slate grey, desaturated. Three-quarter view, subject centred, full
body within frame with generous margin. Isolated on a pure black
background. Matte finish, fine detail, restrained. No dramatic lighting,
no glow.

Reconstruction constrained by known fossil material: Archaeothyris
florensis, Joggins, Nova Scotia, approximately 306 million years old. A
single opening in the skull behind each eye socket. Largely uniform sharp
teeth but with one pair of enlarged canines. Jaws that gape wider than those
of contemporary reptiles. Monitor-lizard-like body proportions. A sprawling
limb posture, the limbs articulating out to the side at shoulder and hip.
First toe smaller than the second. A land animal, not a semi-aquatic one. Do
not draw a sail or elongated spines along the back: that belongs to a later
and separate lineage. No skin is known for any synapsid at this date, so
keep the body covering plain and unspecific.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 18 · Mammaliaformes — ~225 Ma · **A‡**

**Anchor:** *Morganucodon*, ~205 Ma. *Adelobasileus cromptoni* (225–220 Ma), the only candidate at the node date, is **a partial skull with no postcrania** and sits *outside* Mammaliaformes.
**Gap:** ~20 Myr.
**Watch — the fur claim.** Fur is **not** directly evidenced at 225 Ma. Earliest confirmed mammalian fur is *Castorocauda* (~164 Ma) and *Megaconus* (~165 Ma), roughly **60 Myr after this node**. A 2020 study also infers a metabolism well below modern mammals at this grade, weakening the insulation argument. `src/data/lineage.ts` used to list "fur" among this node's gains; **corrected** — see §05 items 1–3.

```
Museum specimen illustration of an early mammaliaform, a small shrew-like
animal about 10 cm long. Scientific reconstruction, anatomically plausible,
not fantasy. Single soft key light from upper left, low warm fill, no rim
lighting. Muted warm-neutral palette: bone, ochre, umber, slate grey,
desaturated. Three-quarter view, subject centred, full body within frame
with generous margin. Isolated on a pure black background. Matte finish,
fine detail, restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Morganucodon,
approximately 205 million years old. Skull 2 to 3 cm long, body about 10 cm
before the tail, shrew- or mouse-like, walking flat-footed on the whole
sole, with a moderately long tail. The jaw joint is in transition: the
modern mammalian contact is present but the ancestral reptilian jaw joint is
still present alongside it, with reduced bones retained behind the main jaw
bone, so this is not a fully modern mammalian jaw. Two tooth generations
only. Molars with interlocking cusps for piercing and shear-cutting. An
insect eater taking hard-shelled prey. Somewhat sprawling limbs. Fur is not
evidenced at this date: the earliest confirmed mammalian fur is roughly 60
million years younger. Do not render dense modern pelage; keep the body
covering ambiguous and unemphasised.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 19 · Placentalia — ~160 Ma · **A**

**Anchor:** *Juramaia sinensis*, holotype BMNH PM1343, Liaoning, ~160 Ma. Proxy: *Eomaia scansoria*, ~125 Ma.
**Gap:** none.
**Watch — the node label was wrong at this date, and is now fixed.** 160 Ma is the **Eutheria/Metatheria split**, the placental *stem*; crown Placentalia's fossil range is 67.3–0 Ma. `lineage.ts`'s own note already conceded the crown radiation is ~90–100 Ma while the rendered name went on saying Placentalia; the node is now named Eutheria — see §05 items 4–6. King & Beck (2020) also suggest *Juramaia* may be Early Cretaceous rather than Jurassic, and Sweetman et al. (2017) recover it outside Eutheria entirely.

```
Museum specimen illustration of an early eutherian mammal weighing about 15
grams. Scientific reconstruction, anatomically plausible, not fantasy.
Single soft key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Juramaia sinensis,
Liaoning, approximately 160 million years old. 15 to 17 grams, shrew-like,
with forelimb bones showing climbing adaptations, so a tree-dwelling animal.
The better-preserved close relative Eomaia scansoria adds: about 10 cm long,
20 to 25 grams, with preserved hair traces, and epipubic bones projecting
forward from the pelvis — bones absent in all true placental mammals —
implying a narrow birth canal and tiny, poorly developed newborns. Do not
draw a modern placental-grade body.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 21 · Primates — ~80 Ma · **A‡**

**Anchor:** *Purgatorius* — teeth, jaw fragments and isolated ankle bones (astragali, calcanei), earliest Paleocene, ~65 Ma. Body plan from *Carpolestes simpsoni*, ~56 Ma, the oldest reasonably complete stem-primate skeleton.
**Gap:** ~14 Myr to *Purgatorius*, ~24 Myr to *Carpolestes*.
**Watch — this node's date is not a primate date.** The 80.7 Ma figure in `src/data/lineage.ts` is the origin of **Euarchontoglires** (Foley et al. 2023), the split where rodents and rabbits leave; crown Primates is ~64–62 Ma on comparable evidence. Everything a reader pictures at "the first primate" — forward-facing eyes, a nail on every finger — is 20–25 Myr younger than this plate. *Purgatorius* has no known skull and no known body: the ankle is the only postcranial evidence there is. The node has been renamed from "The first primate" and its trait claim rewritten as a result — see §05 items 7–8.

```
Museum specimen illustration of an early euarchontan mammal, a small
tree-dwelling animal about the size of a tree shrew. Scientific
reconstruction, anatomically plausible, not fantasy. Single soft key light
from upper left, low warm fill, no rim lighting. Muted warm-neutral palette:
bone, ochre, umber, slate grey, desaturated. Three-quarter view, subject
centred, full body within frame with generous margin. Isolated on a pure
black background. Matte finish, fine detail, restrained. No dramatic
lighting, no glow.

Reconstruction constrained by known fossil material: Purgatorius,
approximately 65 million years old, known only from teeth, jaw fragments and
isolated ankle bones. Those ankle bones show a mobile joint of the kind
found in tree-dwelling relatives, so depict an animal at home in branches;
no skull and no body are preserved for it. The body plan therefore follows
the younger relative Carpolestes simpsoni, approximately 56 million years
old and about 100 grams, roughly tree-shrew sized: long fingers and toes,
relatively short claws on the digits, and one opposable big toe bearing a
flat nail instead of a claw. Eyes set on the sides of the head, and hind
limbs not specialised for leaping. Do not give every digit a nail and do not
draw converged, forward-facing eyes — both belong to later primates, not to
this grade.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 22 · Haplorhini — ~70 Ma · **A**

**Anchor:** *Archicebus achilles*, holotype IVPP V18618, Hubei Province, China, ~55 Ma — a nearly complete, partly articulated skeleton.
**Gap:** ~14–15 Myr.
**Watch:** *Archicebus* sits on the **tarsier** side of the split, not yours — it is a depiction of a cousin, and the caption has to say so. Its eye sockets are **small**, so do not reach for the enormous nocturnal eyes of a living tarsier; that animal is 55 Myr of its own evolution away. Springer et al. 2012 put crown Primates at 71–63 Ma, so this node sits at the old edge of the published range rather than the middle of it.

```
Museum specimen illustration of an early haplorhine primate weighing about
20 to 30 grams. Scientific reconstruction, anatomically plausible, not
fantasy. Single soft key light from upper left, low warm fill, no rim
lighting. Muted warm-neutral palette: bone, ochre, umber, slate grey,
desaturated. Three-quarter view, subject centred, full body within frame
with generous margin. Isolated on a pure black background. Matte finish,
fine detail, restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Archicebus achilles,
Hubei Province, China, approximately 55 million years old, a nearly complete
and partly articulated skeleton. An adult of about 20 to 30 grams, slender
and very small. Small eye sockets, not the enlarged eyes of a nocturnal
animal. A markedly elongated heel bone. Narrow feet with grasping toes,
closer in build to a monkey's foot than to a living tarsier's. Do not draw
the very large eyes of a modern tarsier: this animal's orbits are small, and
that is the single most-copied error at this node.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 23 · Simiiformes — ~55 Ma · **A‡**

**Anchor:** *Eosimias sinensis*, holotype IVPP V10591 — the right half of a lower jaw preserving P4–M2, Shanghuang fissure fills, Jiangsu, China, ~45 Ma. Eosimiid foot bones were later described from the same fills.
**Gap:** ~10 Myr, once the node's date is corrected.
**Watch — the node's stored date was impossible, and is now fixed.** `src/data/lineage.ts` had this node at **40 Ma**, which put the tarsier/anthropoid split *younger than its own fossils*: *Archicebus* (tarsier side) is 55 Ma and *Eosimias* (anthropoid side) is 45 Ma. Now 55 Ma, per Springer et al. 2012's 58–50 Ma — see §05 item 9. Beyond the date, this is a dentition-only anchor: everything but the teeth and a few foot bones is extrapolation.

```
Museum specimen illustration of an early simian primate weighing about 100
grams. Scientific reconstruction, anatomically plausible, not fantasy.
Single soft key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Eosimias sinensis,
Jiangsu Province, China, approximately 45 million years old, known
essentially from jaws and teeth. The holotype is the right half of a lower
jaw carrying the last premolar and the first two molars, with a lower dental
formula of two incisors, one canine, three premolars and three molars.
Estimated body mass 100 to 200 grams. No skull and almost no skeleton are
preserved, so keep the body a small, generalised, four-footed tree-dweller
and keep the face plain and unspecific: do not draw the flat forward-facing
face of a later monkey, and do not elaborate the hands, feet or tail beyond
a generic small arboreal primate.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 24 · Hominoidea — ~27 Ma · **A‡**

**Anchor:** *Rukwapithecus fleaglei*, Nsungwe Formation, south-western Tanzania, ~25.2 Ma — **a single partial right mandible carrying four teeth** (P4, M1, M2 and a partly erupted M3). Body plan from *Ekembo* (*E. heseloni*, *E. nyanzae*), Rusinga and Mfangano Islands, Kenya, ~20–17 Ma.
**Gap:** ~2 Myr to the jaw; ~7–10 Myr to any body at all.
**Watch:** the anchor is a jaw, so everything below the chin comes from a genus 7–10 Myr younger. *Ekembo*'s body is **monkey-like** — an above-branch quadruped — and tailless (its sacrum could not have carried one). The modern ape silhouette (long suspensory arms, knuckle-walking) is tens of millions of years later and belongs to other lineages; it is the easiest wrong image in this half of the set.

```
Museum specimen illustration of an early ape. Scientific reconstruction,
anatomically plausible, not fantasy. Single soft key light from upper left,
low warm fill, no rim lighting. Muted warm-neutral palette: bone, ochre,
umber, slate grey, desaturated. Three-quarter view, subject centred, full
body within frame with generous margin. Isolated on a pure black
background. Matte finish, fine detail, restrained. No dramatic lighting,
no glow.

Reconstruction constrained by known fossil material: Rukwapithecus fleaglei,
Tanzania, approximately 25 million years old, known from a single partial
lower jaw carrying four teeth and nothing else. The body therefore follows
Ekembo, Kenya, approximately 20 to 17 million years old: monkey-like body
proportions, an arboreal quadruped that walks along the tops of branches
rather than hanging beneath them, powerful grasping hands and feet, a
flexible back, and no tail — the sacrum shows the tail was already gone. Do
not draw long suspensory arms, do not draw knuckle-walking, and do not draw
anything resembling a chimpanzee.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 25 · Hominini — ~7.5 Ma · **A‡**

**Anchor:** *Sahelanthropus tchadensis*, holotype cranium TM 266-01-060-1 ("Toumaï"), Djurab Desert, Chad, ~7–6 Ma.
**Gap:** ~0.3–0.8 Myr.
**Watch:** the cranium is **crushed and distorted**, and there is essentially no body. Whether the animal walked upright is unresolved — the forward-set foramen magnum is read as evidence for it, an associated femur has been read against it — and whether it is a hominin at all is disputed. Endocranial volume is ~360–380 cc, chimpanzee-sized. **Do not let the picture settle the argument**: a confidently striding upright figure here is an assertion the fossil does not make.

```
Museum specimen illustration of an early hominin, a chimpanzee-sized ape.
Scientific reconstruction, anatomically plausible, not fantasy. Single soft
key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: Sahelanthropus
tchadensis, Chad, approximately 7 to 6 million years old, known from a
crushed and distorted cranium and a few jaw fragments. Braincase volume
about 360 to 380 cubic centimetres, comparable to a chimpanzee. A heavy
continuous brow ridge above a relatively flat face. Small canines and a
U-shaped tooth row. A long, narrow skull base, with the opening for the
spinal cord set well forward. No body is preserved: keep the limbs and
posture generic and ape-like, and do not depict a striding upright walker or
a human stance — whether this animal walked on two legs is unresolved and
the image must not settle it. No skin or hair is known at this date.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 26 · Homo — ~2.8 Ma · **A‡**

**Anchor:** LD 350-1, Ledi-Geraru, Afar, Ethiopia, dated 2.80–2.75 Ma — **the left half of a lower jaw with five teeth.** That is the entire genus at this date.
**Gap:** none in time. Total in anatomy: no skull, no braincase, no body.
**Watch:** LD 350-1 mixes derived *Homo* features with primitive *Australopithecus* ones, which is exactly why it is interesting and exactly why nothing can be drawn confidently around it. Everything above and below that jaw is borrowed from australopith material. This is also the node where the *March of Progress* silhouette tries to insert itself: it is a 1965 illustration, not evidence, and reproducing it would hand the page the ladder picture it exists to refute.

```
Museum specimen illustration of an early member of the genus Homo.
Scientific reconstruction, anatomically plausible, not fantasy. Single soft
key light from upper left, low warm fill, no rim lighting. Muted
warm-neutral palette: bone, ochre, umber, slate grey, desaturated.
Three-quarter view, subject centred, full body within frame with generous
margin. Isolated on a pure black background. Matte finish, fine detail,
restrained. No dramatic lighting, no glow.

Reconstruction constrained by known fossil material: LD 350-1, Ledi-Geraru,
Ethiopia, dated between 2.80 and 2.75 million years old, which is the left
half of a lower jaw carrying five teeth and is the only material of this
genus at this date. It combines features found in later Homo with primitive
features found in early Australopithecus. Nothing else is preserved, so
head, braincase and body must stay at the australopith grade they are
extrapolated from: a small braincase, a projecting face, and body
proportions closer to an australopith than to a modern human. Do not draw a
large modern braincase, do not draw an upright striding modern silhouette,
and do not add fire, clothing, or tools held in the hand.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 27 · *Homo sapiens* — ~0.3 Ma · **A**

**Anchor:** Jebel Irhoud 1, 2, 10 and 11, Morocco, ~300 ka.
**Gap:** none — the only node in the set anchored on the animal itself.
**Watch:** the finding that makes this plate worth drawing is a **mismatch**. The face already falls within the range of people alive today; the braincase is still long, low and archaic, because brain *shape* modernised later. Draw a present-day head and the one fact the specimen carries is gone. Skin, hair and eye colour are unconstrained here as everywhere else in this set.

```
Museum specimen illustration of an early Homo sapiens. Scientific
reconstruction, anatomically plausible, not fantasy. Single soft key light
from upper left, low warm fill, no rim lighting. Muted warm-neutral palette:
bone, ochre, umber, slate grey, desaturated. Three-quarter view, subject
centred, full body within frame with generous margin. Isolated on a pure
black background. Matte finish, fine detail, restrained. No dramatic
lighting, no glow.

Reconstruction constrained by known fossil material: the Jebel Irhoud
crania, Morocco, approximately 300 thousand years old. A facial skeleton
that falls within the range of people living today — short, and tucked under
the braincase rather than projecting — combined with relatively large teeth
and a braincase that is still long, low and elongated front to back rather
than the rounded, globular shape of a living human head. Depict that
mismatch plainly: a modern face on an archaic braincase. Do not draw a
present-day human head, and do not commit to a skin, hair or eye colour,
none of which is evidenced.
Do not invent anatomy beyond what the specimen supports.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

## 04 · BUCKET B PROMPTS — inferred, no fossil constrains the appearance

Ten nodes, plus the one node that gets no image at all.

These are **honest visual hypotheses**, and the page must not imply otherwise
(`docs/IMAGE-STYLE.md` §04, and the per-image tag recommended in §07 is what
carries the distinction to the reader). Each prompt is the locked preamble, then
the bucket-B schematic clause **verbatim**, then any node-specific "do not draw"
line, then the negative list.

**The recurring failure mode across this whole bucket is drawing a living
cousin.** A choanoflagellate, a sponge, a jellyfish, a shrew — every one of them
is a modern organism at the end of a line exactly as long as yours, and putting
one in an ancestor's frame is precisely the ladder picture this page exists to
refute. Where that trap exists it is called out per node below.

---

### 1 · LUCA — ~4200 Ma · **B**

**Anchor:** none. LUCA is reconstructed from the genes its descendants still share, not from anything preserved in rock.
**Gap:** not applicable — there is nothing to be distant from.
**Watch:** LUCA is **not the first life** and not an individual: it is the last population everything alive descends from, and it already had a substantial genome and a working translation system. Do not draw a primordial blob, and do not draw a nucleus — that arrives at node 2, 2.3 billion years later.

```
Museum specimen illustration of a single generalised cell without a nucleus,
the last universal common ancestor. Scientific reconstruction, anatomically
plausible, not fantasy. Single soft key light from upper left, low warm
fill, no rim lighting. Muted warm-neutral palette: bone, ochre, umber, slate
grey, desaturated. Three-quarter view, subject centred, full body within
frame with generous margin. Isolated on a pure black background. Matte
finish, fine detail, restrained. No dramatic lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a nucleus or any internal compartment.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 2 · The first eukaryote — ~1900 Ma · **B**

**Anchor:** none.
**Gap:** not applicable.
**Watch:** current phylogeny has eukaryotes arising from *within* Asgard archaea, so the subject is an archaeal cell **that has taken a bacterium inside it** — not an archaeon standing next to one. The timing is disputed across roughly 1.1–2.3 Ga, and which archaeal lineage is the sister group is still argued; none of that constrains the picture, which is the point.

```
Museum specimen illustration of a single generalised cell with a nucleus and
one smaller captured bacterial cell inside it. Scientific reconstruction,
anatomically plausible, not fantasy. Single soft key light from upper left,
low warm fill, no rim lighting. Muted warm-neutral palette: bone, ochre,
umber, slate grey, desaturated. Three-quarter view, subject centred, full
body within frame with generous margin. Isolated on a pure black
background. Matte finish, fine detail, restrained. No dramatic lighting,
no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a textbook cell diagram with every organelle rendered; two
structures only.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 3 · Amorphea — ~1600 Ma · **B**

**Anchor:** none — the node is defined by molecular phylogeny and no fossil is attributable to it.
**Gap:** not applicable.
**Watch:** do not draw a recognisable modern amoeba. A living amoeba has had 1.6 billion years of its own since this point, and drawing one implies the ancestor looked like its descendant.

```
Museum specimen illustration of a single generalised cell with a soft,
irregular, lobed outline. Scientific reconstruction, anatomically plausible,
not fantasy. Single soft key light from upper left, low warm fill, no rim
lighting. Muted warm-neutral palette: bone, ochre, umber, slate grey,
desaturated. Three-quarter view, subject centred, full body within frame
with generous margin. Isolated on a pure black background. Matte finish,
fine detail, restrained. No dramatic lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a recognisable modern amoeba.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 4 · Opisthokonta — ~1100 Ma · **B**

**Anchor:** none.
**Gap:** not applicable.
**Watch:** the one trait worth showing — the single flagellum trailing at the **rear**, the same layout your sperm still uses — is inferred from living descendants, not observed in any fossil. Show one flagellum, at the back, and nothing else specific.

```
Museum specimen illustration of a single generalised cell with one long
flagellum trailing from the rear. Scientific reconstruction, anatomically
plausible, not fantasy. Single soft key light from upper left, low warm
fill, no rim lighting. Muted warm-neutral palette: bone, ochre, umber, slate
grey, desaturated. Three-quarter view, subject centred, full body within
frame with generous margin. Isolated on a pure black background. Matte
finish, fine detail, restrained. No dramatic lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Exactly one flagellum, and it trails behind the cell rather than pulling
from the front.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 5 · Holozoa — ~1050 Ma · **B**

**Anchor:** none.
**Gap:** not applicable.
**Watch — two traps at this node.** The obvious picture is a choanoflagellate, and a living choanoflagellate is a cousin at the end of its own billion-year line, not a portrait of the ancestor. Worse, the **collar** everyone would draw is not safely attributable here: it is shared by choanoflagellates and sponge cells, but filastereans, which are also holozoans, have nothing like it. Leave the collar out. The node's date also carries a genuine method-dependent spread of ~1.0 versus ~1.77 Ga.

```
Museum specimen illustration of a single generalised cell with one flagellum
and no other specialised structures. Scientific reconstruction, anatomically
plausible, not fantasy. Single soft key light from upper left, low warm
fill, no rim lighting. Muted warm-neutral palette: bone, ochre, umber, slate
grey, desaturated. Three-quarter view, subject centred, full body within
frame with generous margin. Isolated on a pure black background. Matte
finish, fine detail, restrained. No dramatic lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a collar of projections around the flagellum, and do not draw a
choanoflagellate.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 6 · The first animal — ~800 Ma · **B**

**Anchor:** none. The oldest animal-grade body fossils are hundreds of millions of years younger than this node.
**Gap:** ~200 Myr to anything defensible.
**Watch:** do not draw a sponge. Sponges are the cousins who leave at the *next* node, and a living sponge is a modern animal, not a fossil of your ancestor.

```
Museum specimen illustration of a simple generalised multicellular animal, a
small rounded cluster of similar cells with no organs. Scientific
reconstruction, anatomically plausible, not fantasy. Single soft key light
from upper left, low warm fill, no rim lighting. Muted warm-neutral palette:
bone, ochre, umber, slate grey, desaturated. Three-quarter view, subject
centred, full body within frame with generous margin. Isolated on a pure
black background. Matte finish, fine detail, restrained. No dramatic
lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a sponge, and do not draw any opening, pore or symmetry that
implies a body plan.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 7 · Eumetazoa — ~750 Ma · **B**

**Anchor:** none. A ~600 Ma poriferan fossil sets a hard minimum for the sponge split; it is not a portrait of this node.
**Gap:** ~150 Myr.
**Watch:** the trait here is tissues and nerves, which are internal and cannot be drawn honestly from outside. Do not draw a jellyfish — cnidarians leave at the *next* node down, and drawing one here hands away two nodes at once.

```
Museum specimen illustration of a simple generalised animal with a soft
two-layered body wall. Scientific reconstruction, anatomically plausible,
not fantasy. Single soft key light from upper left, low warm fill, no rim
lighting. Muted warm-neutral palette: bone, ochre, umber, slate grey,
desaturated. Three-quarter view, subject centred, full body within frame
with generous margin. Isolated on a pure black background. Matte finish,
fine detail, restrained. No dramatic lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a jellyfish, tentacles, or radial symmetry.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 8 · Bilateria — ~650 Ma · **B**

**Anchor:** *Ikaria wariootia* considered and **rejected** — ~555 Ma, some 90–95 Myr younger than the node, known from impressions and associated trace fossils rather than preserved anatomy, and its bilaterian status is argued.
**Gap:** ~90–95 Myr.
**Watch:** the temptation is to draw *Ikaria*'s tapered grain-of-rice outline as though it were the ancestor. It is a much younger animal known from a dent in sandstone. Keep the subject generic: small, soft, front and back, no hard parts.

```
Museum specimen illustration of a small soft-bodied animal with bilateral
symmetry, a distinct front end and a distinct back end. Scientific
reconstruction, anatomically plausible, not fantasy. Single soft key light
from upper left, low warm fill, no rim lighting. Muted warm-neutral palette:
bone, ochre, umber, slate grey, desaturated. Three-quarter view, subject
centred, full body within frame with generous margin. Isolated on a pure
black background. Matte finish, fine detail, restrained. No dramatic
lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
No eyes, no appendages, no segmentation, and no hard parts of any kind.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 9 · Deuterostomia — ~580 Ma · **B**

**Anchor:** none. *Saccorhytus coronarius*, for years the poster image for this node, was **reinterpreted in 2022 as an ecdysozoan** — the wrong side of the tree entirely.
**Gap:** ~60 Myr to anything defensible.
**Watch:** a search for "earliest deuterostome" will still return *Saccorhytus*, spiky mouth and all. It is not one. This node's trait — which end of the embryo becomes the mouth — is a developmental fact and cannot be shown in a portrait at all, so do not try to imply it.

```
Museum specimen illustration of a small soft-bodied marine animal with a
simple gut running from one end of the body to the other. Scientific
reconstruction, anatomically plausible, not fantasy. Single soft key light
from upper left, low warm fill, no rim lighting. Muted warm-neutral palette:
bone, ochre, umber, slate grey, desaturated. Three-quarter view, subject
centred, full body within frame with generous margin. Isolated on a pure
black background. Matte finish, fine detail, restrained. No dramatic
lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a spiny or wrinkled sack with a large mouth; that reconstruction
belongs to a different branch of the tree.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 20 · Boreoeutheria — ~93 Ma · **B**

**Anchor:** none — a **zero-fossil node**. No specimen is attributable to it.
**Gap:** ≥27 Myr to anything usable.
**Watch:** this is a molecular node in the middle of the Cretaceous with nothing preserved at it. Whatever gets drawn will inevitably look like some small modern mammal, which is exactly why the bucket-B tag matters here more than anywhere else in the second half of the set. Do not draw a recognisable shrew, rat, hedgehog or carnivoran: every one of those is a living cousin, and most of them leave at this very node.

```
Museum specimen illustration of a small generalised placental-grade mammal
about the size of a mouse. Scientific reconstruction, anatomically
plausible, not fantasy. Single soft key light from upper left, low warm
fill, no rim lighting. Muted warm-neutral palette: bone, ochre, umber, slate
grey, desaturated. Three-quarter view, subject centred, full body within
frame with generous margin. Isolated on a pure black background. Matte
finish, fine detail, restrained. No dramatic lighting, no glow.

Schematic reconstruction of an inferred organism — no fossil constrains this
form. Simple, generalised morphology. Avoid specific-looking detail that would
imply evidence that does not exist.
Do not draw a recognisable living animal: no shrew, no rat, no hedgehog, no
squirrel. Keep the muzzle, ears, tail and feet unspecific.

No text, no labels, no captions, no watermarks, no signature.
No scale bars, no rulers, no measurement annotations.
No human hands, no human figures for scale.
No cartoon styling, no anime, no cel shading.
No neon, no bioluminescent glow, no lens flare, no bokeh.
No busy background, no environment, no scenery, no vignette.
No frame, no border, no matting.
```

---

### 28 · You — 0 Ma · **special: no image is generated**

**Anchor:** the reader.
**Gap:** none.

**There is no prompt for this node, and that is the decision, not an omission.**

Three reasons, in order of weight:

1. **Any drawn human is a specific human** — an age, a build, a skin, a sex —
   and every one of those choices excludes somebody the plate is pointing at.
   This is the one node in the set that cannot afford to depict a stranger.
2. **The argument of the page ends in the second person.** Twenty-seven plates
   establish that each node is an ancestor rather than a portrait; putting a
   portrait in the last frame quietly swaps the reader out for a model at the
   exact moment the line is supposed to arrive at them.
3. **Every other plate is labelled AI-generated** (§07). A generated human in
   the final frame is the one image in the set where that label reads as a
   statement about the reader.

If the last plate looks empty, the fix is **layout** — negative space, the era
ground showing through an empty frame, the plate furniture with nothing mounted
in it — not a generated person. Flagged here as a design decision so that nobody
later mistakes the blank for an unfinished prompt.

---

## 05 · CORRECTIONS OWED TO `src/data/lineage.ts`

Bucketing all 28 nodes against real reference was supposed to produce prompt
notes. It produced content errors as well. **This section is the list, written
before any of it was changed**, so the diff that follows can be read against a
statement of what was believed wrong and why.

Severity is about the *page*, not the file: `main.ts` renders `name`, `age`,
`branch`, `gained`, `stillWithYou` and `source`. It does **not** render `note`.
An error corrected only in a `note` is not corrected — it is annotated.

### A. Confirmed errors, rendered on the page

**1 · Mammaliaformes (node 18) claims fur at ~225 Ma.**
`gained` reads "jaw bones become ear bones; milk; fur". The earliest preserved
mammaliaform fur is *Castorocauda* (~164 Ma, Ji et al. 2006) and *Megaconus*
(~165 Ma, Zhou et al. 2013) — roughly **60 Myr later**. Fur at this node is an
inference from much younger relatives, not a fact about this animal.

**2 · The same node claims the jaw-to-ear transfer as complete.**
At the *Morganucodon* grade the postdentary bones still sit in a trough on the
dentary and the ancestral articular–quadrate joint is still present alongside
the new dentary–squamosal one. The definitive mammalian middle ear — the
postdentary bones fully detached — is later. "Become" should be "beginning to
become".

**3 · The same node's source does not support it.**
It cites Wikipedia's *Adelobasileus* page. *Adelobasileus* is a partial skull
with no postcrania that sits **outside** Mammaliaformes; it cannot anchor this
node's traits.

**4 · Placentalia (node 19) is not Placentalia.**
160 Ma anchored on *Juramaia sinensis* is the **Eutheria/Metatheria** split —
the paper's own title is "A Jurassic eutherian mammal and divergence of
marsupials and placentals". Crown Placentalia is far younger: ~83–78 Ma
(Álvarez-Carretero et al. 2022), ~102 Ma on the Zoonomia timescale (Foley et
al. 2023), and 67.3 Ma in the fossil record. The node's own `note` already
half-conceded this ("crown Placentalia's own radiation is younger, ~90–100 Ma")
while the rendered name went on saying Placentalia.

**5 · The same node's branch list merges two splits ~20–40 Myr apart.**
`branch` is "platypus, echidna, marsupials". Monotremes leave at the
monotreme/therian split, commonly placed ~166–200 Ma — not here, with the
marsupials.

**6 · The same node's `gained` is wrong twice.**
"the placenta; live birth": marsupials have both, so neither distinguishes this
branch from the cousins leaving at it — and *Eomaia*, the better-preserved close
relative used for the reconstruction, still has **epipubic bones**, which imply a
narrow birth canal and tiny, barely-developed newborns. Placental-grade
reproduction is not what this node gained.

**7 · Primates (node 21) cites the wrong paper, wrong journal, and wrong node.**
The source reads "Alvarez-Carretero et al. 2022, Science … (80.7 Ma, 95% CI
75.0–88.3 Ma)" against a science.org URL. That URL is **Foley et al. 2023,
*Science*** (Zoonomia), and 80.7 Ma (75.0–88.3) is that paper's estimate for the
origin of **Euarchontoglires** — not crown Primates. Álvarez-Carretero et al.
2022 is in *Nature*, and puts crown Primates at 64.3–61.8 Ma.
*The date and the branch are right for each other* — 80.7 Ma **is** the split
where rodents and rabbits leave. It is the node's **name** and its traits that
are wrong.

**8 · The same node claims grasping hands and nails ~25 Myr early.**
`gained` is "grasping hands; nails, not claws". The earliest evidence of
arboreality in the group is *Purgatorius*' ankle bones at ~65 Ma; the earliest
nail is on the opposable big toe of *Carpolestes simpsoni* at ~56 Ma, and on
that digit only. Neither is available at 80.7 Ma.

**9 · Simiiformes (node 23) is dated at 40 Ma, which is impossible.**
Tarsiers leave at this node, so the split must predate the fossils on both
sides of it: *Archicebus achilles* (tarsier side) is 55 Ma and *Eosimias*
(anthropoid side) is 45 Ma. Springer et al. 2012 date Tarsiiformes/Anthropoidea
at 58–50 Ma. 40 Ma is the age of crown Simiiformes — a *different*, younger
split — so this is the same category of mistake the Boreoeutheria rename fixed
in Phase 2: a correct number attached to the wrong node.

**10 · Hominoidea (node 24) names the wrong cousins.**
`branch` is "gibbons, orangutans" at 27 Ma. The group that leaves at the
hominoid/cercopithecoid split — bracketed 29–24 Ma by *Saadanius* — is the
**Old World monkeys**. Gibbons diverge ~19–15 Ma and orangutans later still, so
the page has them leaving 8–12 Myr too early, and silently drops every monkey
from the one node where monkeys actually leave. It also costs the node its best
beat: the cousins who keep their tails leave exactly where your line loses its
own.

**11 · Homo (node 26) has no source in its `source` field.**
It reads "standard paleoanthropological consensus" — which renders on the page
under the heading **Source**. Every other node cites something checkable. This
one asks the reader to take it on trust, in a piece whose entire argument is
that the arithmetic is real.

**12 · The same node credits *Homo* with tools it did not make and fire it did
not control.** The Lomekwi 3 industry is 3.3 Ma — half a million years before
this node — and is not attributed to *Homo*. Controlled fire's earliest secure
evidence is ~1 Ma at Wonderwerk, with habitual use only from ~400 ka; attaching
it here compresses nearly 2 Myr into one plate.

### B. Confirmed, but the honest fix is wording, not data

**13 · Tetrapoda (node 15): lungfish and coelacanths do not leave at 365 Ma.**
The node's *own* cited source (PMC3338709) puts the lungfish–tetrapod split at
~392 Ma, and the coelacanth line parts earlier still. But 365 Ma is the
*Acanthostega* date, and that is the date the digits claim needs. The node is
doing two jobs. The dataset already has an idiom for exactly this — the *Homo
sapiens* node's "Neanderthals, Denisovans — already long separate by this point"
— so this gets the same treatment rather than a redesign of the spine.

### C. Audited and found sound — recorded so the next pass doesn't re-open them

- **Amniota (16) / Synapsida (17).** Loose in clade terms: the split where
  amphibians leave is crown Tetrapoda, and crown Amniota *is* the
  synapsid/sauropsid split at 318 Ma. But each node's age matches the split it
  names as leaving, so nothing rendered is false. Left alone deliberately.
- **Haplorhini (22) at 70 Ma.** Sits at the old edge of Springer et al.'s 71–63
  Ma for crown Primates, and well older than Álvarez-Carretero et al.'s
  64.3–61.8 Ma. Defensible with its own citation; the disagreement is now on
  record here.
- **Vertebrata (11).** Its `note` already flags its own date as the
  weakest-sourced figure in the set. Still true, still worth a better source,
  not an error.
- **Boreoeutheria (20), LUCA (1), first eukaryote (2), Holozoa (5).** Wide
  ranges, honestly recorded as wide. Working as intended.
- **Simiiformes' trichromacy removal and *Homo sapiens*' branch timing.** Both
  Phase 2 corrections re-checked and still stand.

### D. Not a science error, flagged and deliberately not fixed here

`main.ts` renders `<strong>What changed in you:</strong> ${node.gained}`
unconditionally, so the seven nodes with `gained: ""` render an empty claim.
That is a rendering decision, not a data one, and fixing it belongs with the
plate markup rather than in a science pass.

### E. What was actually done

All thirteen items in A and B are fixed in `src/data/lineage.ts`, in four
commits kept separate so each can be cited on its own:

| Items | Commit subject |
|---|---|
| 1–6 | *Fix the two worst science errors: fur at 225 Ma, and Placentalia at 160 Ma* |
| 7–10 | *Fix the primate half: a misattributed citation, an impossible date, wrong cousins* |
| 11–13 | *Fix the two nodes whose cousins and credits arrive at the wrong time* |
| — | *Harness rule: a date is not a node* |

The fourth is the one that matters most. Items 7 and 9 are the **third and
fourth** instances of a single failure mode — a correct number attached to the
wrong node — after the Boreoeutheria rename in Phase 2. Per this repo's own
"twice-wrong ⇒ fix the harness" rule, the response is not a third correction but
a rule in `CLAUDE.md`, committed separately: check what the paper dates, what the
node is, and which cousins the branch says leave there, **as three separate
questions**, because in every one of these cases each looked fine on its own and
only the disagreement between them carried the signal.

The arithmetic half of that rule needs no expertise at all and would have caught
item 9 on its own: **a divergence cannot be younger than the fossils on both
sides of it.**

Section C items are deliberately unchanged. Section D is a rendering issue and
belongs with the plate markup, not here.
