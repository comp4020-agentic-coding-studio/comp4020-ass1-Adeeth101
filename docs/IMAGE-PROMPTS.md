# Image Prompts — all 28 nodes
### "One Unbroken Line" · rebuilt to `docs/IMAGE-STYLE-V2.md` v2.0

One ready-to-paste prompt per node in `src/data/lineage.ts`, each in the five-block
v2 architecture: **subject → anatomy → pose → style → negatives**. The style block
(v2 §02) and the negative list (v2 §03) are verbatim in every prompt; only the first
three blocks vary by node.

**Do not edit the style block or the negative list here.** If either needs to change,
change it once in `docs/IMAGE-STYLE-V2.md` and regenerate every prompt, per v2 §07.

> **Rewritten 2026-08-16.** v1.0's four-block architecture was tested live on three
> nodes and failed four ways, all structural — see `docs/IMAGE-STYLE-V2.md` §00. The
> largest change is order: the subject and the load-bearing anatomy now come *first*,
> because image models weight early tokens most and v1 buried the eight digits and the
> aquatic posture behind sixty words of palette and lighting. The second largest is
> that **load-bearing negatives are now positive assertions** — "no claws" became
> "soft-tipped and blunt, ending in rounded webbing" — because naming a thing inside a
> prohibition raises its probability rather than lowering it.
>
> Every bucket assignment, fossil anchor, gap and watch-note below is unchanged, as is
> §05. Only the prompt blocks were rewritten.

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

Per `docs/IMAGE-STYLE-V2.md` §02, subjects composite with `mix-blend-mode: screen`,
under which pure black vanishes. Screen is not keying: it lifts dark tones toward
transparency **inside the subject too**. Reject any generation that sits low in value,
however good it looks alone. v2's style block now carries **"mid-to-light in overall
value"** for exactly this reason, so the protection is in every prompt rather than only
in a reviewer's memory.

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

Every prompt in §03 and §04 is the same five blocks in the same order, separated by
blank lines (the blank lines are part of the prompt — they stop the model reading one
block as a continuation of the last):

1. **Subject** — what it is, in one sentence, leading with the single most important
   anatomical fact. **The order is the point**: this is what the model weights most.
2. **Anatomy** — the fossil constraint, phrased entirely as positive assertions.
   - **A / A‡** → filled from real reference, and for A‡ scoped in the text itself to
     *what is actually preserved*.
   - **B** → the aliveness clause from v2 §04, verbatim, in place of a constraint.
3. **Pose** — stated as what the body *is* doing, never what it isn't. For bucket B
   this block carries the node's "instead draw" detail rather than a posture.
4. **The style block**, `docs/IMAGE-STYLE-V2.md` §02, verbatim, identical in all 27.
5. **The negative list**, v2 §03, verbatim — four lines, only for things with no
   positive equivalent.

Blocks 1–3 vary per node; 4 and 5 never vary. If a node seems to need a different
style block, that is a signal to change it once in `docs/IMAGE-STYLE-V2.md` and
regenerate every prompt — not to freelance one.

**Three rules that only show up once you are generating:**

- **Say what to draw, not what to avoid.** Negation is weakly obeyed: "no frame"
  produced a decorative rim and "not a walking one" produced a walking animal. Every
  load-bearing constraint below is therefore an assertion. If you find yourself adding
  a "do not", find the positive form instead.
- **Do not ask for a count.** Image models do not count — *Acanthostega*'s eight
  digits came back as five, then six. Ask for the impression: "many closely-set
  slender digits, clearly more than five." Honest, achievable, and it carries the same
  meaning to a reader who is not counting.

- **The watch-note beats the reference image.** Several nodes here have a
  well-known illustration that current work has overturned (Chordata's orientation,
  Deuterostomia's *Saccorhytus*, Tetrapoda's *Tiktaalik*). A reverse-image search
  will confidently hand you the superseded picture. Read the watch-note first.
- **Generate in the order v2 §06 sets out**, not node order: Tetrapoda, Chordata and
  LUCA first, at ×2 — the same three nodes that broke v1 — judged side by side against
  the *live* background gradient. Same medium? All mid-to-light in value? LUCA alive?
  Only then the remaining 24. v2 is a hypothesis until it survives those three.

---

## 03 · BUCKET A / A‡ PROMPTS — fossil-constrained

### 10 · Chordata — ~570 Ma · **A**

**Anchor:** *Pikaia gracilens*, Burgess Shale, ~505 Ma (syntype USNM PAL 57628).
**Gap:** ~50–65 Myr — the node predates any defensible chordate body fossil.
**Watch:** Mussini et al. 2024 (*Current Biology* 34:2980–2989) **flipped this animal's orientation — every pre-2024 illustration is upside down**, so reference images found by search are unreliable. Position contested (stem-chordate / cephalochordate / craniate / annelid). No eyes are preserved in any specimen, despite Walcott reporting them.

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

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 11 · Vertebrata — ~550 Ma · **A**

**Anchor:** *Haikouichthys ercaicunensis*, *Myllokunmingia fengjiaoa*, Chengjiang, ~518 Ma.
**Gap:** ~30 Myr.
**Watch:** Lei et al. 2026 (*Nature* 650:150–155) reinterpret the "nasal sacs" as a second pair of eyes — **a live 2026 dispute over whether this animal had two eyes or four.** This prompt follows the two-eye reconstruction; that is a choice and belongs in the caption. Some workers treat all three genera as decay-stage variants of a single animal.

```
A small jawless fish-like sea animal about 3 cm long, its flanks marked by a
repeating zigzag of double-V muscle blocks, with a sail-like fin running
along its back and continuing into the tail.

Constrained by Haikouichthys ercaicunensis and Myllokunmingia fengjiaoa,
Chengjiang, approximately 518 million years old. The body is slender and
elongate, 2.5 to 3 cm long. A stiffening rod runs the full length of the
body with small paired elements set along it, and the head carries a defined
skull of cartilage with rounded ear capsules. At least six gill pouches sit
behind the head, each holding fine filaments. Two large eyes face upward.
The mouth is a simple round opening at the front of the head. A narrow fin
runs along the underside. Every tissue in the animal is soft cartilage, and
the skin is smooth and bare over its whole length.

The animal is swimming, its body held in a shallow S-curve, seen from the
side and slightly above, the dorsal fin uppermost and the head leading.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 12 · Gnathostomata — ~460 Ma · **A**

**Anchor:** *Xiushanosteus mirabilis*, Chongqing, ~436 Ma — the oldest *complete* jawed fish.
**Gap:** ~24 Myr. The 439 Ma *Qianodus* material is **tooth whorls only** and preserves no body.
**Watch:** all relevant taxa were described in 2022 and are still being revised; *Xiushanosteus* is Placodermi *incertae sedis*, mixing characters from several placoderm clades.

```
A small armoured jawed fish about 3 cm long, flattened from top to bottom
and wider than it is tall, with a hinged jaw closing beneath a bony head
shield.

Constrained by Xiushanosteus mirabilis, Chongqing, approximately 436 million
years old. A bony head shield covers the front of the animal, built from
paired plates with one pair behind each eye and one pair at the rear, and
gently curving lateral-line grooves crossing them. Long spines project
backward and outward from the sides of the shield. A fissure separates the
rear skull plates into a mobile joint. Two median plates sit on the back
behind the head, followed by a row of trunk scutes, with small
diamond-shaped scales covering the rest of the body. Two dorsal fins of
similar size each carry a spine at the leading edge. The tail fin has a
longer upper lobe and a rounded lower lobe.

The animal is swimming close to level, seen in three-quarter view from the
front and slightly above so the width of the head shield reads clearly.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 13 · Osteichthyes — ~430 Ma · **A**

**Anchor:** *Guiyu oneiros*, Qujing, 425.6 Ma (holotype IVPP V15541); *Eosteus chongqingensis*, ~436 Ma.
**Gap:** **none — this node is fossil-bracketed**, the only one in the set whose anchor is *older* than the node.
**Watch:** *Eosteus* was described in March 2026 and the "oldest bony fish" title moved off *Guiyu* very recently. *Guiyu*'s tail fin is unpreserved, so its shape is inferred.

```
An early bony fish about 30 cm long, streamlined, its skull bones and scales
sheathed in a glossy enamel-like layer, with a large spine standing at the
leading edge of each paired fin.

Constrained by Guiyu oneiros, Qujing, approximately 425 million years old.
The trunk is about 26 cm long and 11 cm deep, and the head is about a
quarter of the body length. Pectoral, pelvic and dorsal fins each carry a
large spine in front. Three median plates sit behind the skull roof. The
pelvic girdle is built from paired lateral plates with a single median plate
between them. Scale cover is strongly regionalised: rhomboid flank scales
bear 5 to 35 fine ridges and stand distinctly taller than long toward the
front and back, becoming nearly square toward the belly, with large oval
scutes along the midline of the underside. The tail fin is plain and simple
in outline.

The animal is swimming level in open water, shown in left profile turned
slightly toward the viewer.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 14 · Sarcopterygii — ~420 Ma · **A‡**

**Anchor:** *Psarolepis romeri*, Qujing, ~419–411 Ma — **disarticulated material only.**
**Gap:** at or after the node.
**Watch — the most dangerous node in the set.** The one trait a reader expects here, the **fleshy lobed paired fin, is not documented at this node**; it is known from much younger Devonian taxa (*Osteolepis*, *Eusthenopteron*, ~370 Ma). *Psarolepis* and *Guiyu* have also been recovered *outside* crown Sarcopterygii (Lu et al. 2017), in which case this node has no good body fossil at all.

```
An early bony fish with a distinctly humped snout and its nostrils set high
above the eyes, with narrow ray-supported paired fins lying flat against the
flanks.

Constrained by Psarolepis romeri, Qujing, approximately 419 to 411 million
years old, with the overall body outline following the related Guiyu
oneiros. The head plates are sheathed in a smooth porcelain-like layer that
hides the sutures between them. Large fangs sit on the tooth plate of the
snout, and tooth whorls sit at the midline of the lower jaw. A large spine
stands immediately in front of the pectoral fin and another in front of a
median dorsal fin. The scales are thick and rhombic, each with a distinct
neck between crown and base. The paired fins are small, narrow and supported
by fin rays, set flat against the flank, with the body wall meeting each fin
in one smooth continuous line.

The animal is swimming level, seen in left profile so the humped snout and
the pectoral spine both read clearly.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 15 · Tetrapoda — ~365 Ma · **A**

**Anchor:** *Acanthostega gunnari*, East Greenland, ~365 Ma (MGUH-VP-8158 "Rosie", MGUH-VP-8160 "Grace").
**Gap:** none.
**Watch — do not anchor on *Tiktaalik*.** *Tiktaalik roseae* (~375 Ma) is an elpistostegalian sarcopterygian **fish**, not a tetrapod: its pectoral appendage retains fin rays. It is the famous image for this transition and it is the wrong animal for this node. Both *Acanthostega* and *Ichthyostega* are stem tetrapods and their relative order is unstable; Long et al. (2025) place crown Tetrapoda ~379.7 Ma, older than this node.

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

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 16 · Amniota — ~330 Ma · **A‡**

**Anchor:** *Hylonomus lyelli*, Joggins, Nova Scotia, ~318 Ma. Integument from *Captorhinus aguti*, ~289 Ma (ROMVP 88287).
**Gap:** ~12 Myr for the body; ~41 Myr for the skin.
**Watch:** Jenkins, Meyer & Bhullar (2025) recover *Hylonomus* **outside crown Amniota**, removing the classical anchor. The skin fragment is smaller than a fingernail and is not associated with a skeleton, so its attribution and body region are undetermined — treat it as grade-level evidence only.

```
A small lizard-shaped land vertebrate about 20 cm long including the tail,
its skin covered in small tubercles that sit side by side like pebbled
crocodile hide.

Constrained by Hylonomus lyelli, Joggins, Nova Scotia, approximately 318
million years old. The proportions are broadly lizard-like, with small sharp
teeth suited to insect prey. Trackway evidence gives five digits on each
hand and foot, the first and fifth shortest and the third and fourth
longest, with sharp inward-curving claws on the first four digits and a
short claw on the fifth. The skin, known only from a much younger relative,
is built from small tubercular scales that meet edge to edge without
overlapping, separated by flexible hinged bands, the whole surface finely
pebbled and even.

The animal walks on all fours on level ground, its body carried clear of the
surface and its tail held straight out behind and clear of it too, seen in
three-quarter view from the front and slightly above.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 17 · Synapsida — ~318 Ma · **A‡**

**Anchor:** *Archaeothyris florensis*, Joggins, ~306 Ma.
**Gap:** ~12 Myr.
**Watch:** *Echinerpeton*'s synapsid membership is doubted and Benson (2012) treats it as a wildcard taxon. **No synapsid skin is known at this date** — integument is inference by bracketing, not evidence. The sail-backed silhouette everyone pictures is *Dimetrodon*, tens of millions of years later.

```
A carnivorous land vertebrate with monitor-lizard proportions and a single
opening in the skull behind each eye socket, its back running smooth and
level from neck to tail.

Constrained by Archaeothyris florensis, Joggins, Nova Scotia, approximately
306 million years old. One opening sits in the skull behind each eye socket.
The teeth are largely uniform and sharp, with one pair of enlarged canines,
and the jaws gape wider than those of contemporary reptiles. The body has
monitor-lizard proportions with a long tail. The limbs articulate out to the
side at shoulder and hip in a sprawling posture, and the first toe is
smaller than the second. The vertebral spines along the back are short and
even in height, giving one smooth level profile from the neck to the base of
the tail. The body covering is plain and unmarked.

The animal walks on all fours on dry land, seen in three-quarter view from
the front and slightly above.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 18 · Mammaliaformes — ~225 Ma · **A‡**

**Anchor:** *Morganucodon*, ~205 Ma. *Adelobasileus cromptoni* (225–220 Ma), the only candidate at the node date, is **a partial skull with no postcrania** and sits *outside* Mammaliaformes.
**Gap:** ~20 Myr.
**Watch — the fur claim.** Fur is **not** directly evidenced at 225 Ma. Earliest confirmed mammalian fur is *Castorocauda* (~164 Ma) and *Megaconus* (~165 Ma), roughly **60 Myr after this node**. A 2020 study also infers a metabolism well below modern mammals at this grade, weakening the insulation argument. `src/data/lineage.ts` used to list "fur" among this node's gains; **corrected** — see §05 items 1–3.

```
A small shrew-shaped animal about 10 cm long before the tail, walking flat
on the whole sole of each foot, its jaw carrying two joints at once.

Constrained by Morganucodon, approximately 205 million years old. The skull
is 2 to 3 cm long and the body about 10 cm before a moderately long tail.
The jaw carries both joints side by side: the mammalian dentary-squamosal
contact, and alongside it the ancestral reptilian joint, with reduced bones
retained in a trough behind the main jaw bone. There are two tooth
generations only. The molars carry interlocking cusps for piercing and
shearing, suited to hard-shelled insects. The limbs are somewhat sprawling.
The body covering is plain and smooth, rendered as one even surface without
individual hairs.

The animal stands on all fours, flat-footed on the whole sole, head lowered
slightly as if foraging, seen in three-quarter view from the front.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 19 · Placentalia — ~160 Ma · **A**

**Anchor:** *Juramaia sinensis*, holotype BMNH PM1343, Liaoning, ~160 Ma. Proxy: *Eomaia scansoria*, ~125 Ma.
**Gap:** none.
**Watch — the node label was wrong at this date, and is now fixed.** 160 Ma is the **Eutheria/Metatheria split**, the placental *stem*; crown Placentalia's fossil range is 67.3–0 Ma. `lineage.ts`'s own note already conceded the crown radiation is ~90–100 Ma while the rendered name went on saying Placentalia; the node is now named Eutheria — see §05 items 4–6. King & Beck (2020) also suggest *Juramaia* may be Early Cretaceous rather than Jurassic, and Sweetman et al. (2017) recover it outside Eutheria entirely.

```
A shrew-sized tree-dwelling mammal weighing about 15 grams, with a pair of
slender bones projecting forward from the front of the pelvis.

Constrained by Juramaia sinensis, Liaoning, approximately 160 million years
old, with detail from the better-preserved close relative Eomaia scansoria.
The animal weighs 15 to 17 grams and is shrew-shaped, with forelimb bones
built for climbing. Eomaia adds: about 10 cm long, 20 to 25 grams, with
preserved hair traces, and a pair of epipubic bones projecting forward from
the front of the pelvis. The hips are narrow and the belly is slender to
match, the pelvic opening small.

The animal is climbing, gripping a narrow branch with all four feet, its
body held along the branch, seen from the side and slightly above.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 21 · Primates — ~80 Ma · **A‡**

**Anchor:** *Purgatorius* — teeth, jaw fragments and isolated ankle bones (astragali, calcanei), earliest Paleocene, ~65 Ma. Body plan from *Carpolestes simpsoni*, ~56 Ma, the oldest reasonably complete stem-primate skeleton.
**Gap:** ~14 Myr to *Purgatorius*, ~24 Myr to *Carpolestes*.
**Watch — this node's date is not a primate date.** The 80.7 Ma figure in `src/data/lineage.ts` is the origin of **Euarchontoglires** (Foley et al. 2023), the split where rodents and rabbits leave; crown Primates is ~64–62 Ma on comparable evidence. Everything a reader pictures at "the first primate" — forward-facing eyes, a nail on every finger — is 20–25 Myr younger than this plate. *Purgatorius* has no known skull and no known body: the ankle is the only postcranial evidence there is. The node has been renamed from "The first primate" and its trait claim rewritten as a result — see §05 items 7–8.

```
A small tree-dwelling mammal about the size of a tree shrew, with long
slender fingers and toes and its eyes set on the sides of the head, looking
outward to either side.

Constrained by Purgatorius, approximately 65 million years old, and by the
younger relative Carpolestes simpsoni, approximately 56 million years old
and about 100 grams. The ankle joint is mobile, of the kind found in
tree-dwelling relatives. The fingers and toes are long, with relatively
short claws. One opposable big toe on each foot carries a flat nail; every
other digit ends in a short curved claw. The eyes sit on the sides of the
head with a wide view to each side. The hind limbs are built for climbing
and gripping.

The animal grips a slender branch with hands and feet, its body held along
the branch, head turned toward the viewer in three-quarter view.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 22 · Haplorhini — ~70 Ma · **A**

**Anchor:** *Archicebus achilles*, holotype IVPP V18618, Hubei Province, China, ~55 Ma — a nearly complete, partly articulated skeleton.
**Gap:** ~14–15 Myr.
**Watch:** *Archicebus* sits on the **tarsier** side of the split, not yours — it is a depiction of a cousin, and the caption has to say so. Its eye sockets are **small**, so do not reach for the enormous nocturnal eyes of a living tarsier; that animal is 55 Myr of its own evolution away. Springer et al. 2012 put crown Primates at 71–63 Ma, so this node sits at the old edge of the published range rather than the middle of it.

```
A very small slender primate weighing about 20 to 30 grams, with small eye
sockets in proportion to a daytime animal and a markedly elongated heel
bone.

Constrained by Archicebus achilles, Hubei Province, China, approximately 55
million years old, known from a nearly complete and partly articulated
skeleton. The adult weighs 20 to 30 grams and is slender throughout. The eye
sockets are small relative to the skull. The heel bone is long. The feet are
narrow with grasping toes, closer in build to a monkey's foot than to a
living tarsier's.

The animal clings upright to a slender vertical stem, gripping with both
hands and both feet, head turned toward the viewer in three-quarter view.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 23 · Simiiformes — ~55 Ma · **A‡**

**Anchor:** *Eosimias sinensis*, holotype IVPP V10591 — the right half of a lower jaw preserving P4–M2, Shanghuang fissure fills, Jiangsu, China, ~45 Ma. Eosimiid foot bones were later described from the same fills.
**Gap:** ~10 Myr, once the node's date is corrected.
**Watch — the node's stored date was impossible, and is now fixed.** `src/data/lineage.ts` had this node at **40 Ma**, which put the tarsier/anthropoid split *younger than its own fossils*: *Archicebus* (tarsier side) is 55 Ma and *Eosimias* (anthropoid side) is 45 Ma. Now 55 Ma, per Springer et al. 2012's 58–50 Ma — see §05 item 9. Beyond the date, this is a dentition-only anchor: everything but the teeth and a few foot bones is extrapolation.

```
A small tree-dwelling primate weighing about 100 grams, with a
forward-projecting muzzle and a plain simple face.

Constrained by Eosimias sinensis, Jiangsu Province, China, approximately 45
million years old, known essentially from jaws and teeth. The holotype is
the right half of a lower jaw carrying the last premolar and the first two
molars, with a lower dental formula of two incisors, one canine, three
premolars and three molars on each side. Body mass is 100 to 200 grams. The
muzzle projects forward and the face is plain and simple. The hands, feet
and tail are those of a generic small four-footed tree-dweller, average in
every proportion.

The animal moves on all fours along the top of a slender branch, tail
trailing behind it, seen from the side and slightly above.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 24 · Hominoidea — ~27 Ma · **A‡**

**Anchor:** *Rukwapithecus fleaglei*, Nsungwe Formation, south-western Tanzania, ~25.2 Ma — **a single partial right mandible carrying four teeth** (P4, M1, M2 and a partly erupted M3). Body plan from *Ekembo* (*E. heseloni*, *E. nyanzae*), Rusinga and Mfangano Islands, Kenya, ~20–17 Ma.
**Gap:** ~2 Myr to the jaw; ~7–10 Myr to any body at all.
**Watch:** the anchor is a jaw, so everything below the chin comes from a genus 7–10 Myr younger. *Ekembo*'s body is **monkey-like** — an above-branch quadruped — and tailless (its sacrum could not have carried one). The modern ape silhouette (long suspensory arms, knuckle-walking) is tens of millions of years later and belongs to other lineages; it is the easiest wrong image in this half of the set.

```
An early ape with monkey-like body proportions, its arms and legs of similar
length, and a smooth rounded rump where the body ends.

Constrained by Rukwapithecus fleaglei, Tanzania, approximately 25 million
years old, known from a single partial lower jaw carrying four teeth, with
the body following Ekembo, Kenya, approximately 20 to 17 million years old.
The body proportions are monkey-like, the arms and legs of similar length.
The hands and feet are powerful and grasping. The back is flexible and
carried level. The sacrum ends bluntly and the rump is smooth and rounded,
the body finishing there.

The animal walks on all fours along the top of a stout branch, palms and
soles flat on the bark, back held level and hips carried beneath the body,
seen from the side and slightly above.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 25 · Hominini — ~7.5 Ma · **A‡**

**Anchor:** *Sahelanthropus tchadensis*, holotype cranium TM 266-01-060-1 ("Toumaï"), Djurab Desert, Chad, ~7–6 Ma.
**Gap:** ~0.3–0.8 Myr.
**Watch:** the cranium is **crushed and distorted**, and there is essentially no body. Whether the animal walked upright is unresolved — the forward-set foramen magnum is read as evidence for it, an associated femur has been read against it — and whether it is a hominin at all is disputed. Endocranial volume is ~360–380 cc, chimpanzee-sized. **Do not let the picture settle the argument**: a confidently striding upright figure here is an assertion the fossil does not make.

```
A chimpanzee-sized ape with a heavy continuous brow ridge above a relatively
flat face, its braincase about the size of a chimpanzee's.

Constrained by Sahelanthropus tchadensis, Chad, approximately 7 to 6 million
years old, known from a cranium and a few jaw fragments. The braincase holds
about 360 to 380 cubic centimetres. A heavy continuous brow ridge runs above
the eyes. The canines are small and the tooth row is U-shaped. The skull
base is long and narrow, with the opening for the spinal cord set well
forward. No body is preserved, so the trunk and limbs are those of a
generalised ape of that size, and the body covering is plain and unmarked.

The animal is seated on the ground with its legs folded and its trunk
upright, hands resting on its knees, seen in three-quarter view. This
resting pose is deliberate: how this animal moved is unresolved, and a
seated figure makes no claim either way.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 26 · Homo — ~2.8 Ma · **A‡**

**Anchor:** LD 350-1, Ledi-Geraru, Afar, Ethiopia, dated 2.80–2.75 Ma — **the left half of a lower jaw with five teeth.** That is the entire genus at this date.
**Gap:** none in time. Total in anatomy: no skull, no braincase, no body.
**Watch:** LD 350-1 mixes derived *Homo* features with primitive *Australopithecus* ones, which is exactly why it is interesting and exactly why nothing can be drawn confidently around it. Everything above and below that jaw is borrowed from australopith material. This is also the node where the *March of Progress* silhouette tries to insert itself: it is a 1965 illustration, not evidence, and reproducing it would hand the page the ladder picture it exists to refute.

```
An early member of the genus Homo at australopith grade: a small low
braincase, a forward-projecting face, and empty hands.

Constrained by LD 350-1, Ledi-Geraru, Ethiopia, dated between 2.80 and 2.75
million years old, which is the left half of a lower jaw carrying five teeth
and is the only material of this genus at this date. It combines features
found in later Homo with primitive features found in early Australopithecus.
Everything else follows australopith material: the braincase is small and
low, the face projects forward, the shoulders are narrow, and the limb
proportions are those of an australopith. The hands are empty and the body
is bare.

The figure stands still and upright on level ground, arms hanging relaxed at
its sides, seen in three-quarter view.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 27 · *Homo sapiens* — ~0.3 Ma · **A**

**Anchor:** Jebel Irhoud 1, 2, 10 and 11, Morocco, ~300 ka.
**Gap:** none — the only node in the set anchored on the animal itself.
**Watch:** the finding that makes this plate worth drawing is a **mismatch**. The face already falls within the range of people alive today; the braincase is still long, low and archaic, because brain *shape* modernised later. Draw a present-day head and the one fact the specimen carries is gone. Skin, hair and eye colour are unconstrained here as everywhere else in this set.

```
An early Homo sapiens with a face that would pass unremarked today, set
beneath a braincase that is still long and low from front to back.

Constrained by the Jebel Irhoud crania, Morocco, approximately 300 thousand
years old. The facial skeleton falls within the range of people living
today: short, and tucked beneath the braincase rather than projecting. The
teeth are relatively large. The braincase runs long and low, extending well
back behind the face, its greatest width low down and toward the rear, with
the forehead only gently raised. Skin and hair are carried in the same muted
neutral tones as the rest of the palette.

The head and shoulders are shown in three-quarter view, turned so that the
modern face and the long low braincase both read at once, the expression
neutral.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
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

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 2 · The first eukaryote — ~1900 Ma · **B**

**Anchor:** none.
**Gap:** not applicable.
**Watch:** current phylogeny has eukaryotes arising from *within* Asgard archaea, so the subject is an archaeal cell **that has taken a bacterium inside it** — not an archaeon standing next to one. The timing is disputed across roughly 1.1–2.3 Ga, and which archaeal lineage is the sister group is still argued; none of that constrains the picture, which is the point.

```
A single living microorganism, greatly magnified — one soft rounded cell
holding a smaller oval body inside it.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

Inside the cell sit exactly two things: one rounded nucleus, and one smaller
oval body with its own smooth outer edge, clearly separate and held within
the surrounding fluid. The rest of the interior is faintly and evenly
granular. The outline bends gently in and out along its length, thicker in
some places than others, and the whole form is slightly irregular.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 3 · Amorphea — ~1600 Ma · **B**

**Anchor:** none — the node is defined by molecular phylogeny and no fossil is attributable to it.
**Gap:** not applicable.
**Watch:** do not draw a recognisable modern amoeba. A living amoeba has had 1.6 billion years of its own since this point, and drawing one implies the ancestor looked like its descendant.

```
A single living microorganism, greatly magnified — one soft cell whose
outline bulges into a few broad rounded lobes of unequal size.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The outline carries two or three broad soft lobes, each a different size
from the others, changing gradually along its length so that no part of the
edge repeats another. The interior is faintly and evenly granular
throughout, with no separate compartment and nothing at the centre. The
whole form is generalised and slightly lopsided, matching no living
microorganism in particular.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 4 · Opisthokonta — ~1100 Ma · **B**

**Anchor:** none.
**Gap:** not applicable.
**Watch:** the one trait worth showing — the single flagellum trailing at the **rear**, the same layout your sperm still uses — is inferred from living descendants, not observed in any fossil. Show one flagellum, at the back, and nothing else specific.

```
A single living microorganism, greatly magnified — one soft rounded cell
with a single long flagellum trailing from its rear.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

Exactly one flagellum leaves the cell, and it leaves from the rear,
streaming out behind the body in a long smooth curve as though the cell were
being pushed from behind. The front of the cell is smooth and bare. The
interior is faintly and evenly granular throughout, and the outline bends
gently in and out along its length.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 5 · Holozoa — ~1050 Ma · **B**

**Anchor:** none.
**Gap:** not applicable.
**Watch — two traps at this node.** The obvious picture is a choanoflagellate, and a living choanoflagellate is a cousin at the end of its own billion-year line, not a portrait of the ancestor. Worse, the **collar** everyone would draw is not safely attributable here: it is shared by choanoflagellates and sponge cells, but filastereans, which are also holozoans, have nothing like it. Leave the collar out. The node's date also carries a genuine method-dependent spread of ~1.0 versus ~1.77 Ga.

```
A single living microorganism, greatly magnified — one soft rounded cell
with a single flagellum and a smooth unbroken membrane.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The membrane runs smooth and continuous the whole way around the cell,
including where the flagellum leaves it, meeting the flagellum in one plain
unbroken join. The surface is bare over its entire length. The interior is
faintly and evenly granular throughout, and the outline is slightly
irregular, the whole form simple and without projections of any kind.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 6 · The first animal — ~800 Ma · **B**

**Anchor:** none. The oldest animal-grade body fossils are hundreds of millions of years younger than this node.
**Gap:** ~200 Myr to anything defensible.
**Watch:** do not draw a sponge. Sponges are the cousins who leave at the *next* node, and a living sponge is a modern animal, not a fossil of your ancestor.

```
A simple living multicellular organism, greatly magnified — a small rounded
cluster of similar soft cells held together as one mass.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The cells are of similar size and loosely packed, their individual outlines
showing faintly through the translucent surface. The surface of the cluster
is continuous and unbroken all over. The whole mass is slightly lopsided,
its arrangement irregular and repeating nowhere, so that no end reads as a
front or a back.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 7 · Eumetazoa — ~750 Ma · **B**

**Anchor:** none. A ~600 Ma poriferan fossil sets a hard minimum for the sponge split; it is not a portrait of this node.
**Gap:** ~150 Myr.
**Watch:** the trait here is tissues and nerves, which are internal and cannot be drawn honestly from outside. Do not draw a jellyfish — cnidarians leave at the *next* node down, and drawing one here hands away two nodes at once.

```
A simple living sea animal, greatly magnified — a small soft sac with a
smooth continuous outline and a body wall two thin layers thick.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The body wall is built from two thin layers, faintly visible through the
translucent surface. The outline runs smooth and continuous the whole way
round, and the surface is bare and even from end to end. The whole form is
lopsided and irregular, longer on one side than the other, so that no part
of it answers to another across any line.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 8 · Bilateria — ~650 Ma · **B**

**Anchor:** *Ikaria wariootia* considered and **rejected** — ~555 Ma, some 90–95 Myr younger than the node, known from impressions and associated trace fossils rather than preserved anatomy, and its bilaterian status is argued.
**Gap:** ~90–95 Myr.
**Watch:** the temptation is to draw *Ikaria*'s tapered grain-of-rice outline as though it were the ancestor. It is a much younger animal known from a dent in sandstone. Keep the subject generic: small, soft, front and back, no hard parts.

```
A small living sea animal with a distinct front end and back end, its body
soft and smooth from one end to the other.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The front end is slightly broader and blunter than the back, which tapers to
a rounded tip, and the two halves of the body match each other across a
single line running head to tail. The surface is smooth and unbroken over
its whole length, bare and even throughout, and the body is uniformly soft
from end to end. The outline varies gently along its length.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 9 · Deuterostomia — ~580 Ma · **B**

**Anchor:** none. *Saccorhytus coronarius*, for years the poster image for this node, was **reinterpreted in 2022 as an ecdysozoan** — the wrong side of the tree entirely.
**Gap:** ~60 Myr to anything defensible.
**Watch:** a search for "earliest deuterostome" will still return *Saccorhytus*, spiky mouth and all. It is not one. This node's trait — which end of the embryo becomes the mouth — is a developmental fact and cannot be shown in a portrait at all, so do not try to imply it.

```
A small living sea animal, soft and smoothly rounded, with a simple gut
running the length of its body.

This is a living organism, soft-bodied and flexible, with a yielding
membrane edge that bends and varies along its outline. The body is
translucent, its interior faintly visible through the surface. Every edge is
soft. The form is generalised and simple — no fossil constrains its
appearance, so avoid specific-looking detail that would imply evidence which
does not exist.

The body is a smooth soft tube, evenly rounded along its length, with one
small plain opening at each end and the gut faintly visible between them
through the translucent body wall. The surface is even and unbroken all
over, and the outline curves gently throughout, without an angle anywhere.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
```

---

### 20 · Boreoeutheria — ~93 Ma · **B**

**Anchor:** none — a **zero-fossil node**. No specimen is attributable to it.
**Gap:** ≥27 Myr to anything usable.
**Watch:** this is a molecular node in the middle of the Cretaceous with nothing preserved at it. Whatever gets drawn will inevitably look like some small modern mammal, which is exactly why the bucket-B tag matters here more than anywhere else in the second half of the set. Do not draw a recognisable shrew, rat, hedgehog or carnivoran: every one of those is a living cousin, and most of them leave at this very node.

```
A small living four-footed mammal about the size of a mouse, plain and
generalised in every feature.

This is a living animal, warm-bodied and soft, its outline yielding and
varying along its length the way a living body does. Every edge is soft. The
form is generalised and simple — no fossil constrains its appearance, so
avoid specific-looking detail that would imply evidence which does not
exist.

The muzzle is short and plain, the ears small and simple, the tail moderate
and unremarkable, and the feet plain with short toes. Every proportion is
average for a small mammal, matching no living species in particular. The
coat is even and unmarked over the whole body, one plain tone throughout.
The animal stands on all fours, head slightly raised, seen in three-quarter
view from the front.

Rendered as a soft-shaded naturalistic painting with smooth continuous tonal
modelling, in the manner of modern palaeoart reconstruction. Muted warm-neutral
palette: bone, ochre, umber, slate grey, desaturated. Single soft key light from
upper left, low warm fill. Subject centred with generous margin on a flat pure
black background. Restrained, fine detail, evenly lit, mid-to-light in overall
value.

No pen hatching, no ink linework, no watercolour wash, no visible paper texture.
No text, labels, captions, scale bars or watermarks.
No frame, border, decorative rim or mount.
No environment, scenery, ground plane or cast shadow.
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
