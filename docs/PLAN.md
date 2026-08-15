# Build plan — Assignment 1

Working plan for "one unbroken line". Read `CONTEXT.md` first for the brief,
the spec and the idea. This file is the *route*; it is expected to change, and
changing it deliberately is part of the record.

**Clock:** ingested Sat 2026-08-15 ~17:00 · due **Mon 2026-08-17 12:00** —
about 43 hours.
**Token budget:** **~$100 of course credits**, hard ceiling $120 (cap $200/wk,
~$1.19 spent as of Phase 1's close, resets *after* this deadline so the whole
$200 is effectively available). Rough split: Phase 1 ~$10 · Phase 2 ~$20 ·
Phase 3 ~$15 · Phase 4 ~$40 · Phase 5 ~$15. **Check `/comp4020:balance` at
the end of every phase** — if a phase runs 50%+ over its share, say so and
re-plan rather than silently eating the next phase's budget.

---

## Working rules for every phase

- **Commit at every green check**, small and often. The history is 45% of the
  mark and it must *grow with the work* — a single dump reads as the weakest
  possible evidence.
- **Twice-wrong ⇒ fix the harness.** If the agent gets the same class of thing
  wrong twice, do not re-prompt a third time. Add a rule to `CLAUDE.md` or wire
  a check, **commit that separately**, and note the hash. These are the commits
  `PROCESS.md` will cite, and they are worth more than the feature commits.
- **Verify before accepting.** Look at the rendered page at both viewports, not
  at the diff. "The check went green" is evidence; "it looks right" is not.
- **Keep what you throw away.** Abandoned attempts are explicitly HD evidence.
  Commit the attempt, then commit the revert with the reason — don't quietly
  delete.

---

## Phase 0 — Ingestion ✅ done (2026-08-15, personal plan)

- Repo cloned; course credits scoped via `.claude/settings.local.json`
  (gitignored, verified with `git check-ignore`)
- Live spec pulled from the course API — not remembered
- Starter contract read (`spec/invariants.test.ts`) and its design
  consequences recorded
- Exemplars examined; Deep Sea's asset strategy measured directly from its
  network traffic
- `CONTEXT.md` + this plan written
- `comp4020-statusline` plugin installed; root `CLAUDE.md` given an explicit
  account-routing rule

**Deliverable:** `CONTEXT.md`, `docs/PLAN.md`, updated root `CLAUDE.md`.
**First commit of the repo's real work.**

---

## Phase 1 — Design ✅ done (2026-08-15, Opus)

Back-and-forth, ending in decisions committed to the repo. Full rationale and
rejected alternatives are in `docs/DESIGN.md`; this is the short version.

**Settled:**

1. **The node list** — cut from the drafted 39 to **28** (table below).
   Cutting was the work; see `docs/DESIGN.md` §7 for what was cut, rewritten,
   and kept against the plan's own suggestion.
2. **The core interaction, stated testably** — split into a visitor-facing
   sentence and a separate testable contract (`docs/DESIGN.md` §1), because
   `vitest`/`jsdom` cannot scroll a page. The rule (which node is current)
   lives in a pure module, `src/lineage-state.ts`; scroll and keyboard are
   thin drivers on top of it. `spec/lineage.test.ts` is written and
   **failing on purpose** against a stub — see the commit that added both.
3. **Keyboard model** — no scroll-jacking; native scroll gives most keys for
   free. Roving tabindex, not one tab stop per node. Focus follows current
   only on keyboard-initiated moves. `aria-live` announcer. Full detail in
   `docs/DESIGN.md` §3.
4. **Time axis** — two modes: adaptive **learning mode** (required, section
   height = "how much there is to say") and **true-scale mode** (Phase 4
   stretch, section height = real elapsed time). `docs/DESIGN.md` §4.
5. **Media** — one money-shot frame sequence (fin → limb), everything else
   code-drawn SVG. Down from the drafted 2–3 sequences + 12–18 stills.
   `docs/DESIGN.md` §5.
6. **Chapter list for `<nav>`** — required by the invariants anyway; a real
   jump-list, doubling as the skip-link for keyboard users.
7. **Deploy sequencing** — moved earlier, into Phase 2 (see below), to catch
   subpath/case-sensitivity bugs while they're cheap. `docs/DESIGN.md` §6.

**Deliverables:** `docs/DESIGN.md`, `src/lineage-state.ts` (stub),
`spec/lineage.test.ts` (9 failing tests, deliberate), this update.

---

## Phase 2 — Data (target ~3h, Sat night; overlaps Phase 3 generation)

The dataset is the backbone; everything else renders it.

**Also this phase, once `dist/` has real content beyond the starter page**
(doesn't need to be feature-complete — see `docs/DESIGN.md` §6): confirm the
GitHub Pages settings are correct (Actions as the deploy source) and flip the
repo public with `/comp4020:ship`, then check the live URL directly. This is
deliberately earlier than the original plan so a subpath or Linux
case-sensitivity bug is cheap to fix, not an 11am-Monday surprise. Flipping
public is a one-way-feeling, visible action — hold it until there's at least
a couple of real nodes rendering, not the bare starter page, so the check
actually exercises something.

Build `src/data/lineage.ts` — a typed array, one object per node:

```ts
type Node = {
  id: string;            // "sarcopterygii"
  name: string;          // "Lobe-finned fish"
  age: number;           // Ma, best estimate
  ageRange: [number, number];  // honest uncertainty
  branch: string;        // what split off here — your cousins
  branchExamples: string[];    // "ray-finned fish (99% of fish alive today)"
  gained: string;        // what changed in YOU
  stillWithYou?: string;       // the receipt you carry today
  source: string;        // TimeTree / primary ref
  media?: { kind: "still" | "sequence"; asset: string; alt: string };
};
```

`stillWithYou` is the field that makes the argument land. Strongest candidates
(**all require verification before shipping**):

- **Sarcopterygii** — your humerus, radius and ulna are the same bones, in the
  same order, as a lobe-finned fish's fin. One bone, two bones, many bones.
- **Mammaliaformes** — two of your middle-ear bones were your ancestor's *jaw*
  hinge. You hear with a repurposed jaw.
- **Haplorhini** — you can't synthesise vitamin C because the `GULO` gene broke
  in an ancestor ~60 Ma. **You still carry the broken copy.** This is the
  single best "receipt" on the list: it's a bug in your genome you inherited.
- **Amniota** — the amniotic egg is why you developed in a fluid sac.
- **Synapsida** — the single hole behind your eye socket; put your fingers on
  your temple.
- **Vertebrata** — recurrent laryngeal nerve: still detours down past the
  aorta and back up, because it did in a fish with no neck.

**Verify against TimeTree / primary refs, cite per node, and prefer a range
over fake precision.** Wrong science kills the point of view.

**Deliverables:** `src/data/lineage.ts` ✅ done — 28 nodes, each sourced
against TimeTree/a primary reference, verified via four parallel research
passes rather than serially against the clock. `spec/lineage-data.test.ts` ✅
green — monotonically decreasing ages, no missing fields, every node sourced.
`docs/SOURCES.md` dropped as a separate file: every node's `source` field
already carries its citation, so a standalone sources doc would just be the
same information maintained twice.

---

## Phase 3 — Media (start generation EARLY — Sat night, in parallel)

Generation has latency and needs retries, so **kick this off before the build
and let it run while Phase 4 proceeds.** Nothing here blocks the build: the
site must work with placeholders and get better as assets land.

### The one hero sequence (Veo → frames)

Revised down from three sequences plus 12–18 stills — see `docs/DESIGN.md`
§5. Shipped as a **WebP frame sequence**, not `<video>`. Rationale in
`CONTEXT.md` §5; short version: measured Deep Sea uses ~128 static images
and zero video, and frames scrub reversibly, survive iOS Safari, and stay
keyboard-drivable.

Pipeline: Veo render → `ffmpeg -vf fps=N` → resize → `cwebp -q 75` → a
`frames/<name>/0001.webp…` folder + a manifest. Two width variants (desktop /
phone). Target **≤ 60–120 frames**, **≤ 1.5 MB total**.

**Fin → limb** (the Tiktaalik moment, ~375 Ma), at the Sarcopterygii →
Tetrapoda transition. The money shot — it's the exact leap people refuse to
believe. Prompt direction: a lobe-finned fish's pectoral fin, held in one
continuous camera position, with the internal bone structure visible,
transitioning to a weight-bearing limb. *The bones must not appear or
disappear — they must change proportion.* That constraint is the whole
point and must be stated in the prompt.

Everything else in the branch-leaving motif is **code-drawn SVG** — no
generation cost, no stills pipeline needed for the shippable version. A
handful of stills (4–6, not 12–18) are a later add-on only if time allows,
and only where a face genuinely carries the argument.

**Every prompt must state the fossil constraint** where one exists, and
outputs get checked against a reference before acceptance — a
plausible-looking wrong animal is worse than no animal.

**Deliverables:** `docs/PROMPTS.md` (every prompt, verbatim, with what was
accepted/rejected and why — this is *excellent* process evidence, and
rejected generations are exactly the "what you threw away" the HD band asks
for), `public/media/**`, a script that does the ffmpeg→webp conversion so
the pipeline is reproducible rather than manual.

---

## Phase 4 — First draft (target ~6h, Sunday)

Build order — **each step ends green and committed**:

1. Static page, all 28 nodes stacked, no motion. Invariants green: one `<h1>`,
   real `<nav>`, `lang`, viewport, alt text.
2. Scroll → current-node state (learning-mode pacing). `spec/lineage.test.ts`
   goes **red → green**. *Cite this transition in `PROCESS.md`.*
3. Keyboard parity — arrows/PageDown/Home/End, visible focus, skip link,
   roving tabindex, focus-follows-current only on keyboard input.
4. The branch-leaving animation (code-drawn SVG — the repeating visual motif).
5. The one frame sequence wired in behind lazy loading, with a static poster
   as fallback.
6. Honest source citations on the page, the credit to UsefulCharts as
   inspiration.
7. `prefers-reduced-motion` path.
8. **Stretch, only if steps 1–7 finish early:** true-scale mode toggle (see
   `docs/DESIGN.md` §4). If it doesn't happen, that's a deliberate cut to
   note, not a gap to hide.

Deploy already happened earlier, in Phase 2 (see above) — this phase iterates
against both local dev and the live URL rather than deploying for the first
time at the end.

---

## Phase 5 — Iterate + submit (Sunday night → Monday morning)

- Real-device check at **1920×1080 and 390×844**; **resize mid-interaction**
- Tab all the way through
- Throttle to slow 3G and reload — this is named in the HD band
- `pnpm check` green, `pnpm check:evidence` green
- **Student writes** `PROCESS.md` (400–600 words, 3–4 moments) and
  `reflections/assignment-1.md` (150–300 words) — own voice, see `CONTEXT.md` §7
- `/comp4020:preflight`, then `/comp4020:ship` to flip public + deploy
- **Verify the live URL actually serves** and assets don't 404 under the
  `/comp4020-ass1-Adeeth101/` base path

**Hard gate: be deployed and green by Monday 09:00**, three hours early. No
late submissions.

---

## Finalized node list (28 — cut in Phase 1, verify ages in Phase 2)

Cut from the drafted 39; full rationale (what was cut, rewritten, and kept
against this plan's own suggestion) is in `docs/DESIGN.md` §7. **Ages below
are still the old draft's indicative figures and must be checked against
TimeTree/a primary reference before shipping — do not trust this table's
numbers, only its node selection.**

| # | Node | ~Age (unverified) | Branch leaving (your cousins) | What changed in you |
|---|---|---|---|---|
| 1 | LUCA | ~4.0 Ga | — | the code itself |
| 2 | Eukaryote | ~1.9 Ga | bacteria (all of them) | mitochondria — a swallowed bacterium; you're an archaeon with a passenger |
| 3 | Amorphea | ~1.6 Ga | plants, algae | — |
| 4 | Opisthokonta | ~1.3 Ga | amoebae | the rear flagellum → your sperm |
| 5 | Holozoa | ~1.1 Ga | **fungi** | — |
| 6 | Metazoa | ~800 Ma | — | multicellularity |
| 7 | Eumetazoa | ~750 Ma | sponges | tissues, nerves |
| 8 | Bilateria | ~650 Ma | jellyfish, corals | a front and a back |
| 9 | Deuterostomia | ~590 Ma | insects, molluscs, worms | the gut built back-to-front |
| 10 | Chordata | ~550 Ma | starfish, urchins | notochord, dorsal nerve cord |
| 11 | Vertebrata | ~530 Ma | lancelets | a skull and a spine |
| 12 | Gnathostomata | ~450 Ma | lampreys, hagfish | **jaws** |
| 13 | Osteichthyes | ~430 Ma | sharks, rays | bone instead of cartilage |
| 14 | **Sarcopterygii** | ~420 Ma | ray-finned fish (99% of fish alive) | **bones in the fin: one, then two, then many** — money-shot sequence starts here |
| 15 | **Tetrapoda** | ~365 Ma | lungfish, coelacanth | **digits** — money-shot sequence lands here |
| 16 | Amniota | ~320 Ma | amphibians | the egg that leaves water |
| 17 | Synapsida | ~318 Ma | **all reptiles and birds** | one hole behind your eye socket |
| 18 | **Mammaliaformes** | ~225 Ma | — | **jaw bones → ear bones**; milk; fur |
| 19 | Placentalia | ~160 Ma | platypus, echidna, marsupials | the placenta; live birth |
| 20 | Euarchontoglires | ~90 Ma | *"everything you picture when you hear 'animal'"* — dogs, horses, whales, bats [⚠ verify this branch label, see below] | — |
| 21 | Primates | ~75 Ma | rodents, rabbits | grasping hands; nails, not claws |
| 22 | **Haplorhini** | ~63 Ma | lemurs, lorises | **the broken vitamin-C gene you still carry** |
| 23 | Simiiformes | ~40 Ma | tarsiers | three-colour vision |
| 24 | Hominoidea | ~25 Ma | gibbons, orangutans | **no tail** |
| 25 | Hominini | ~7 Ma | **chimpanzees, bonobos** | — |
| 26 | Homo | ~2.8 Ma | — | upright, full-time; tools; fire; long-distance walking |
| 27 | H. sapiens | ~300 ka | Neanderthals, Denisovans | — |
| 28 | **You** | now | — | reading this |

**⚠ Flagged for Phase 2 verification, not resolved here** (`docs/DESIGN.md`
§7): node 20's branch label is likely imprecise. Dogs/whales/bats/horses are
Laurasiatheria, a sister group to Euarchontoglires, not a branch leaving from
within it. Get the correct relationship from TimeTree/a primary reference
rather than trusting either this table or the original draft.

**Optional next cuts if 28 still runs long in testing:** Eumetazoa (7),
Simiiformes (23) — not cut in Phase 1 because each carries a distinct
surprising cousin, but they're the next candidates if the marker's minute
still doesn't reach node 28 in a dry run.
