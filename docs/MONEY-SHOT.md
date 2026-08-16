# Money-Shot Sequence — Stage List & Production Spec v1.0
### "One Unbroken Line" · cell → you, scroll-scrubbed WebP frame sequence

One sequence. Scroll drives the playhead; keyboard can step it. No `<video>` element —
WebP frames, per the standing media rule (reversible scrubbing, survives iOS Safari,
keyboard-drivable, lazy-loads).

---

## 01 · THE LADDER PROBLEM, AND HOW THIS SHOT AVOIDS IT

A cell-to-human morph is the single most ladder-shaped image in existence. The whole
project exists to argue against that picture. Four design rules keep this shot on the
right side of that line — none are cosmetic, and dropping any one of them turns the
money shot into an own goal.

**1. Time-honest frame pacing.** Frames are allocated by elapsed time on the same
power law the page scroll already uses (exponent ~0.45), not evenly per stage. Result:
roughly a fifth of the sequence is a single cell barely changing, and the microbial run
is the longest continuous stretch in the shot. Every ladder illustration ever made
sprints through this part. Not sprinting through it *is* the argument.

**2. Cousins leave, and they stay.** At major divergences, a ghosted cousin form drifts
out of frame — and does **not** fade to nothing. It parks at the frame edge, dimmed but
present, and stays there for the rest of the sequence. By the final frame the edges are
crowded with everything that branched away and is still out there evolving. That single
choice is the difference between "march of progress" and "one line among many."

**3. No procession composition.** The subject stays dead-centre, same scale in frame,
same eye-line, throughout. No left-to-right march, no diagonal, no rising silhouettes.
It is a morph in place, not a parade.

**4. No triumphant final frame.** The last frame is a human standing exactly where the
cell was, at the same scale, lit the same way. No hero pose, no upward gaze, no
backlight. Arriving is not winning.

---

## 02 · STAGE ANCHORS & FRAME ALLOCATION

19 morph segments between 20 anchor forms. Frame counts weighted by elapsed time
(power law, exponent 0.45), with a **floor of 4 frames** per segment so no transition
is too short to read — the same floor logic the scroll pacing already uses.

| # | Segment | Gap (Ma) | Frames | Note |
|---|---|---|---|---|
| 1 | LUCA → Eukaryote | 2300 | **22** | The long quiet. Barely changes. This is the point. |
| 2 | Eukaryote → Opisthokonta | 600 | 11 | Mitochondrion becomes visible internally |
| 3 | Opisthokonta → Metazoa | 500 | 10 | Colonial → true multicellular |
| 4 | Metazoa → Bilateria | 200 | 7 | Symmetry, a front end |
| 5 | Bilateria → Chordata | 50 | 4 | Notochord appears |
| 6 | Chordata → Vertebrata | 25 | 4 | Spine, skull |
| 7 | Vertebrata → Gnathostomata | 75 | 5 | Jaws |
| 8 | Gnathostomata → Sarcopterygii | 30 | 4 | Lobed fins — set up the payoff |
| 9 | **Sarcopterygii → Tetrapoda** | 30 | **8** | ← **THE BEAT.** Floor deliberately raised. |
| 10 | Tetrapoda → Amniota | 70 | 5 | Egg, dry skin |
| 11 | Amniota → Mammaliaformes | 100 | 6 | Jaw bones migrate to the ear |
| 12 | Mammaliaformes → Placentalia | 120 | 6 | Fur, live birth |
| 13 | Placentalia → Primates | 35 | 4 | Grasping hands, forward eyes |
| 14 | Primates → Haplorhini | 5 | 4 | (vitamin C gene breaks — invisible, carried in caption) |
| 15 | Haplorhini → Simiiformes | 20 | 4 | |
| 16 | Simiiformes → Hominoidea | 15 | 4 | Tail disappears |
| 17 | Hominoidea → Hominini | 18 | 4 | Bipedal stance |
| 18 | Hominini → Homo | 4.5 | 4 | |
| 19 | Homo → *H. sapiens* → you | 2.5 | 4 | |

**Total: 120 frames** — exactly at the ceiling. Recommend trimming segments 2–4 by a
frame or two each to land around **105**, leaving headroom under the 1.5 MB budget.

### Segment 9 is the anatomical payoff
Eight frames on fin → limb because it's the one transition where the viewer can
*see the argument*: one bone, then two, then many — the same bones in the same order
as their own arm. Hold the limb in frame long enough to read. This is the moment the
whole shot exists to deliver.

---

## 03 · PRODUCTION PIPELINE

Generating 120 coherent frames directly from a still-image model will not hold
consistency. Use the video path:

1. **Veo** generates the morph as video, in segments (not one 120-frame run — segment
   boundaries at the anchor forms give you control and let you regenerate one bad
   transition without redoing everything).
2. **Extract frames** at the allocation in §02 — uneven extraction, weighted by the
   table, not uniform sampling.
3. **Convert to WebP**, two width variants.
4. **Verify total sequence weight ≤ 1.5 MB** per variant. If over, drop frames from
   segments 1–4 first (slow, low-change stretches tolerate it), never from segment 9.

### Prompt consistency
Reuse the locked preamble from `IMAGE-STYLE.md` — same lighting, same palette, same
matte treatment, transparent or neutral background. The morph must look like it belongs
to the same project as the 28 node stills, or it reads as a video someone dropped in.

### Fossil constraints
Anchors 8–13 and 16–19 are fossil-constrained. Their generation prompts **must** say so
explicitly, per the standing science-accuracy rule. Anchors 1–4 are inferred — keep them
schematic and avoid detail implying evidence that doesn't exist.

---

## 04 · INTERACTION SPEC

### Scroll scrubbing
Playhead maps to scroll position across the sequence's pinned range. Frame index updates
directly from scroll — **no transition, no easing on the frame swap**, same reasoning as
the depth gauge: a transition here lags the scroll and reads as broken.

### ⚠️ Keyboard conflict — resolve before building
The lineage already binds **Arrow / PageUp / PageDown / Home / End** to node-to-node
movement, and that behaviour is covered by the tested state-machine contract. Binding
arrows to frame-stepping globally will break it.

**Required resolution:** frame-stepping is active **only while the sequence container
itself holds focus**. The container is a single tab stop; when focused, Left/Right step
frames; when not focused, all existing key bindings behave exactly as they do now. The
state machine is not touched under any circumstance.

### Accessibility
- Frames are a decorative `aria-hidden` container with **one** real described image —
  not 120 `<img>` tags each demanding alt text (invariant requirement).
- The sequence carries a text description of what the morph shows, present in the DOM
  at load, reachable without scrolling or scrubbing.
- **`prefers-reduced-motion`:** no scrubbing. Show a single representative static frame
  (suggest the segment-9 limb) plus the text description. Must be readable, not broken.
- Visible focus indicator on the container when it's the active tab stop.

### Loading
- Lazy-load the sequence; the page must build and pass all checks **with placeholders**.
  Media landing late must never block the build.
- Preload the first frame only; stream the rest.
- Slow-connection behaviour is explicitly marked — degrade to the static frame rather
  than showing a broken or empty container.

---

## 05 · LABELLING

The sequence is AI-generated and is labelled as such on the page — hard rule. Suggested
treatment: a caption naming the generation tool, stating which anchor forms are
fossil-constrained versus inferred, and crediting the phylogeny sources.

---

## 06 · GUARDRAILS

- ✗ **No `<video>` element.** Frames only.
- ✗ **No even frame distribution.** Even pacing is the ladder.
- ✗ **No cousin form fading to nothing.** They branch away and persist at frame edge.
- ✗ **No procession, no rising diagonal, no scale increase toward the end.**
- ✗ **No triumphant final frame.**
- ✗ **Do not touch `src/lineage-state.ts`** to make the keyboard stepping work.
- ✗ **Do not let the sequence block the build.** Placeholders must always pass.

---

*Money-Shot Spec v1.0 · One Unbroken Line*
