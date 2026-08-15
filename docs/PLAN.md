# Build plan — Assignment 1

Working plan for "one unbroken line". Read `CONTEXT.md` first for the brief,
the spec and the idea. This file is the *route*; it is expected to change, and
changing it deliberately is part of the record.

**Clock:** ingested Sat 2026-08-15 ~17:00 · due **Mon 2026-08-17 12:00** —
about 43 hours.
**Token budget:** **~$100 of course credits**, hard ceiling $120 (cap $200/wk,
$0 spent at start, resets *after* this deadline so the whole $200 is
available). Rough split: Phase 1 ~$10 · Phase 2 ~$20 · Phase 3 ~$15 ·
Phase 4 ~$40 · Phase 5 ~$15. **Check `/comp4020:balance` at the end of every
phase** — if a phase runs 50%+ over its share, say so and re-plan rather than
silently eating the next phase's budget.

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

## Phase 1 — Design (target ~2h, Sat evening)

Back-and-forth, ending in decisions committed to the repo.

**To settle:**

1. **The node list** — lock ~35–40 nodes (draft below). Cutting is the work.
2. **The core interaction, stated testably.** Draft:
   > *As the visitor scrolls, exactly one node is "current". The current node's
   > age, the branch leaving it, and the trait gained are displayed; scrolling
   > forward advances to the next node and no other node is current.*
   This sentence becomes `spec/lineage.test.ts`. Write the test **before** the
   feature.
3. **Keyboard model** — arrow/PageDown/Home/End must move between nodes, and a
   visible focus ring must track the current node. Decide now; retrofitting
   keyboard support onto a scroll-jacked page is painful.
4. **Motion policy** — `prefers-reduced-motion` must produce a static,
   readable page, not a broken one.
5. **Where the 2–3 hero sequences go** (see Phase 3).
6. **Chapter list for `<nav>`** — required by the invariants anyway; make it a
   real jump-list, which doubles as the skip-link for keyboard users.

**Deliverables:** `docs/DESIGN.md` (decisions + rejected alternatives),
`spec/lineage.test.ts` **failing** against an empty page. A red test you wrote
on purpose is a strong commit.

---

## Phase 2 — Data (target ~3h, Sat night; overlaps Phase 3 generation)

The dataset is the backbone; everything else renders it.

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

**Deliverables:** `src/data/lineage.ts`, `docs/SOURCES.md`, a test asserting
the data is well-formed (monotonically decreasing ages, no missing fields, every
node has a source). That test catches transcription errors for free.

---

## Phase 3 — Media (start generation EARLY — Sat night, in parallel)

Generation has latency and needs retries, so **kick this off before the build
and let it run while Phase 4 proceeds.** Nothing here blocks the build: the
site must work with placeholders and get better as assets land.

### The 2–3 hero sequences (Veo → frames)

Shipped as **WebP frame sequences**, not `<video>`. Rationale in `CONTEXT.md`
§5; short version: measured Deep Sea uses ~128 static images and zero video,
and frames scrub reversibly, survive iOS Safari, and stay keyboard-drivable.

Pipeline: Veo render → `ffmpeg -vf fps=N` → resize → `cwebp -q 75` → a
`frames/<name>/0001.webp…` folder + a manifest. Two width variants (desktop /
phone). Target **≤ 60–120 frames**, **≤ 1.5 MB total per sequence**.

Proposed three, placed where they carry the most argument:

1. **LUCA → first cell** (opening). Establishes the register and the depth of
   time. Prompt direction: primordial ocean, chemical gradients resolving into
   a single lipid-bound cell; scientific, not mystical; no eyes, no faces.
2. **Fin → limb** (the Tiktaalik moment, ~375 Ma). **This is the money shot** —
   it's the exact leap people refuse to believe. Prompt direction: a lobe-finned
   fish's pectoral fin, held in one continuous camera position, with the
   internal bone structure visible, transitioning to a weight-bearing limb.
   *The bones must not appear or disappear — they must change proportion.* That
   constraint is the whole point and must be stated in the prompt.
3. **Jaw → ear** (~225 Ma) *or* **ape → upright**. Pick one; three sequences is
   the ceiling. Jaw→ear is more surprising and better serves the point of view.

### Stills (Nano Banana)

One per major node that needs a face (~12–18). Consistent treatment so they
read as one system: same lighting, same neutral background, same
side-on presentation, museum-reconstruction register.

**Every prompt must state the fossil constraint** where one exists, and outputs
get checked against a reference before acceptance — a plausible-looking wrong
animal is worse than no animal.

**Deliverables:** `docs/PROMPTS.md` (every prompt, verbatim, with what was
accepted/rejected and why — this is *excellent* process evidence, and rejected
generations are exactly the "what you threw away" the HD band asks for),
`public/media/**`, a script that does the ffmpeg→webp conversion so the
pipeline is reproducible rather than manual.

---

## Phase 4 — First draft (target ~6h, Sunday)

Build order — **each step ends green and committed**:

1. Static page, all ~40 nodes stacked, no motion. Invariants green: one `<h1>`,
   real `<nav>`, `lang`, viewport, alt text.
2. Scroll → current-node state. `spec/lineage.test.ts` goes **red → green**.
   *Cite this transition in `PROCESS.md`.*
3. Keyboard parity — arrows/PageDown/Home/End, visible focus, skip link.
4. The branch-leaving animation (code-drawn SVG — the repeating visual motif).
5. Frame sequences wired in behind lazy loading, with the static poster as
   fallback.
6. Stills, honest source citations, the credit to UsefulCharts as inspiration.
7. `prefers-reduced-motion` path.

**Ship it deployed as soon as step 2 is green.** A live URL early de-risks the
20% artefact criterion; base-path bugs look fine locally and 404 in production,
and you do not want to meet that at 11am Monday.

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

## Draft node list (~40 — to be cut and verified in Phase 1/2)

Ages are indicative and **must be checked against TimeTree** before shipping.

| # | Node | ~Age | Branch leaving (your cousins) | What changed in you |
|---|---|---|---|---|
| 1 | LUCA | ~4.0 Ga | — | the code itself |
| 2 | Archaea side | ~3.5 Ga | bacteria | — |
| 3 | Eukaryote | ~1.9 Ga | — | mitochondria (a swallowed bacterium) |
| 4 | Amorphea | ~1.6 Ga | plants, algae | — |
| 5 | Opisthokonta | ~1.3 Ga | amoebae | the rear flagellum → your sperm |
| 6 | Holozoa | ~1.1 Ga | **fungi** | — |
| 7 | Filozoa | ~950 Ma | choanoflagellates | collar cells |
| 8 | Metazoa | ~800 Ma | — | multicellularity |
| 9 | Eumetazoa | ~750 Ma | sponges | tissues, nerves |
| 10 | Bilateria | ~650 Ma | jellyfish, corals | a front and a back |
| 11 | Deuterostomia | ~590 Ma | insects, molluscs, worms | the gut built back-to-front |
| 12 | Chordata | ~550 Ma | starfish, urchins | notochord, dorsal nerve cord |
| 13 | Vertebrata | ~530 Ma | lancelets | a skull and a spine |
| 14 | Gnathostomata | ~450 Ma | lampreys, hagfish | **jaws** |
| 15 | Osteichthyes | ~430 Ma | sharks, rays | bone instead of cartilage |
| 16 | **Sarcopterygii** | ~420 Ma | **ray-finned fish (99% of fish)** | **bones in the fin: 1, then 2, then many** |
| 17 | Tetrapodomorpha | ~385 Ma | — | a neck; a flat skull |
| 18 | **Tetrapoda** | ~365 Ma | lungfish, coelacanth | **digits** |
| 19 | Amniota | ~320 Ma | amphibians | the egg that leaves water |
| 20 | Synapsida | ~318 Ma | **all reptiles and birds** | one hole behind the eye |
| 21 | Therapsida | ~275 Ma | — | legs under the body |
| 22 | Cynodontia | ~260 Ma | — | differentiated teeth |
| 23 | **Mammaliaformes** | ~225 Ma | — | **jaw bones → ear bones**; milk; fur |
| 24 | Theria | ~180 Ma | platypus, echidna | live birth |
| 25 | Placentalia | ~160 Ma | marsupials | the placenta |
| 26 | Euarchontoglires | ~90 Ma | dogs, whales, bats, horses | — |
| 27 | Primates | ~75 Ma | rodents, rabbits | grasping hands; nails, not claws |
| 28 | **Haplorhini** | ~63 Ma | lemurs, lorises | **the broken vitamin-C gene you still carry** |
| 29 | Simiiformes | ~40 Ma | tarsiers | three-colour vision |
| 30 | Catarrhini | ~30 Ma | New World monkeys | — |
| 31 | Hominoidea | ~25 Ma | Old World monkeys | **no tail** |
| 32 | Hominidae | ~18 Ma | gibbons | — |
| 33 | Homininae | ~14 Ma | orangutans | — |
| 34 | Hominini | ~7 Ma | **chimpanzees, bonobos** | — |
| 35 | Australopithecus | ~4 Ma | — | upright, full-time |
| 36 | Homo | ~2.8 Ma | — | tools |
| 37 | H. erectus | ~1.9 Ma | — | fire; long-distance walking |
| 38 | H. sapiens | ~300 ka | Neanderthals, Denisovans | — |
| 39 | **You** | now | — | reading this |

**Cut toward ~35.** Nodes 21, 22, 26, 30, 32, 33 carry the least argument and
should go first if the list is too long. Every node kept must earn its place
with either a surprising cousin or a trait you still carry.
