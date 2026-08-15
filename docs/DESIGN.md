# DESIGN — Phase 1 decisions

Read `CONTEXT.md` first for the brief and spec, `docs/PLAN.md` for the route.
This file is the record of Phase 1: the decisions, why, and what lost.
Nothing here is exploratory — it's the settled contract Phase 2 builds
against.

---

## 1. The core interaction, stated testably

Visitor-facing (goes on the page):

> Scrolling moves you down one unbroken ancestral line. At any moment exactly
> one ancestor is current: its age, the cousins branching away, and the trait
> you inherited. Reaching the bottom arrives at you.

Testable contract (goes in `spec/lineage.test.ts`):

1. Exactly one node is current at all times.
2. `advance()` moves forward by exactly one node; at the last node it's a
   no-op. `retreat()` mirrors this at the first node. Neither ever wraps or
   goes out of range.
3. `setFromProgress()` is monotonic: non-decreasing progress never yields a
   decreasing index.
4. Every node is reachable by repeated `advance()` from the start.

**Why this split exists, not the obvious single sentence:** `vitest` runs in
Node, with no real layout or scroll — `jsdom` cannot answer "the page is
scrolled to 50%, is node 12 current?" That test needs a real browser
(Playwright), which is a dependency and a slower test type this weekend
doesn't have room for.

The fix: the rule (which node is current, and how it can change) lives in a
pure module, `src/lineage-state.ts` — `createLineage(nodes)` returning
`getCurrentIndex/advance/retreat/goTo/setFromProgress`. It knows nothing about
scrolling or the DOM, so `vitest` calls its methods directly and asserts on
return values in milliseconds. Two thin drivers sit on top and translate real
input into calls on it: an `IntersectionObserver`-based scroll driver
(`setFromProgress`), and a keyboard driver (`advance`/`retreat`). Neither
driver contains a rule — they only relay — so the interesting logic is fully
unit-tested and the drivers are thin enough to verify once, in a browser.

**Rejected:** a single test asserting the visitor-facing sentence directly
against a scrolled `jsdom` page. Not possible without Playwright.

---

## 2. Scroll model: native scroll + IntersectionObserver, not scroll-jacking

Two different things get called "scroll-jacking" and only one is being
avoided:

- **Intercepting scroll** (`preventDefault` on wheel/touch, manually animating
  `scrollTop`, reimplementing momentum) — rejected. It means rebuilding, from
  scratch, in the time available: mouse wheel, trackpad momentum, touch
  swipe, every keyboard key, screen-reader virtual-cursor navigation, and
  browser zoom. Getting even one wrong is exactly how a page traps a keyboard
  user — which the accessibility rules below forbid outright.
- **Reading scroll position** (no `preventDefault`, just observing and
  reacting) — required, and is how the money-shot frame sequence scrubs and
  the depth gauge updates.

**Adaptive pacing doesn't need custom scroll physics.** A node with more to
say gets a taller `<section>` in normal document flow; scrolling through it
takes more physical distance, which reads as "slower," entirely through
CSS/layout. True-scale mode (§4) is the same mechanism fed a different
number — elapsed real time instead of a hand-tuned weight — not a new
interaction system. Neither mode touches `src/lineage-state.ts`.

**Rejected:** full scroll-jacking (rebuilds every input modality; highest
risk of trapping the keyboard, a named HD-band failure). CSS scroll-snap
alone (fights with continuous within-section frame-scrubbing on the
money-shot node).

---

## 3. Keyboard model

- **No scroll-jacking** (§2) — arrows/Space/PageDown/PageUp/Home/End work
  because they're native scroll, for free.
- **Roving tabindex, not one tab stop per node.** Every node section is
  `tabindex="-1"` except the current one (`tabindex="0"`); arrow keys move
  within it. One tab stop for the whole lineage — 28 tab stops would make a
  keyboard user press Tab 28 times to reach the footer.
- **The `<nav>` chapter jump-list — required by the invariants regardless —
  doubles as the skip link.**
- **Focus follows current only when the change was keyboard-initiated.** If
  scrolling changed `current` and `current` always stole focus, a mouse user
  would get surprise focus jumps and a keyboard user who tabbed away would
  get yanked back. Rule: `goTo(i, {focus: true})` from a keypress;
  `setFromProgress()` never focuses. This is the one rule most likely to get
  retrofitted badly, so it's decided now, before any code exists.
- **`aria-live="polite"` announcer**: "Node 14 of 28. Lobe-finned fish, ~420
  million years ago." Cheap, and it's the difference between "tab works" and
  the page being usable non-visually.

---

## 4. Time axis: two modes, not one gauge

**The problem:** nodes 1–11 (LUCA to Vertebrata) span ~3.5 billion years;
the last nine span ~25 million. Uniform scroll-per-node implies every node
took equally long — false. Scroll proportional to real time compresses the
best material (fins, ears, the vitamin-C gene) into under 1% of the page,
and the marker's first ~55 seconds would be undifferentiated microbes.

**Decision: two modes on the same data and the same state machine.**

- **Learning mode (default, required).** Section height is a hand-set
  weight — "how much there is to say" — not real time. This is what ships
  and is tested.
- **True-scale mode (Phase 4 stretch, toggle).** Section height is
  proportional to real elapsed time. Same nodes, same `createLineage`, same
  keyboard/scroll drivers — only the height-mapping function changes. This
  turns the distortion into content: the toggle itself proves "the animal
  part is a rounding error," which is close to the point of view already
  written into `CONTEXT.md` §3.

**Sequencing:** learning mode is core and gates shipping. True-scale mode is
built only if Phase 4 finishes early, and is explicitly allowed to be cut —
if it's cut, that cut gets committed and noted, not silently dropped.

**Rejected:** a single persistent depth gauge (`node 14 of 28 · 420 Ma`) as
the only mitigation. Still true and still shipped as the announcer/gauge
content, but superseded as the *primary* answer to the distortion by the
two-mode toggle, which is more honest and more argumentatively useful.

---

## 5. Media scope

**One money-shot frame sequence** (fin → limb, the Sarcopterygii →
Tetrapoda transition) shipped as a WebP frame sequence per the root
`CLAUDE.md` media rule. Everything else in the branch-leaving motif is
**code-drawn SVG** — sharper at both viewports, free of generation cost,
trivial to make static under `prefers-reduced-motion`, and it *is* the
repeating visual language rather than a separate asset per node.

**Rejected:** the original plan's 2–3 Veo sequences + 12–18 Nano Banana
stills. A scrubbed frame sequence is the least *interactive* thing on the
page — the brief's own word — and three of them plus 18 stills is close to
the top of what fails the slow-connection HD band. One sequence keeps the
visual ambition where the argument needs it most (the exact leap people
refuse to believe) without spending the media budget three times over.

---

## 6. Deploy sequencing

**Decision: stand up the GitHub Pages workflow early in Phase 2**, once
`pnpm build` produces a real `dist/` — it doesn't need the lineage feature
finished; `vite.config.ts` already builds relative-URL assets regardless of
content. This catches two failure classes that are invisible locally:

- **Subpath 404s** — the deployed URL lives under
  `/comp4020-ass1-Adeeth101/`; a hand-written absolute path (`/media/...`,
  `fetch("/data/...")`) works on `localhost` and 404s in production.
- **Case-sensitivity** — GitHub Pages serves from Linux; this machine is
  Windows, which won't complain if a reference's case doesn't match the file
  on disk. That mismatch is invisible until the live site is checked.

A local subpath-simulation script (build `dist/`, serve it from a folder
literally named `comp4020-ass1-Adeeth101`) catches the first class without
deploying at all, but not the second — case-sensitivity needs the real
Linux host. Discipline in the meantime: **lowercase every asset filename and
every reference to it, no exceptions.**

**Superseded:** the earlier plan to hold all deployment until the whole
site is ready. Reversed once the actual risk (subpath + case-sensitivity,
not general "incompleteness") was named specifically — the cost of an
early, private-repo deploy check turned out to be near zero (CI's
`check`/`deploy` jobs are gated on the repo being public, so nothing runs,
and nothing is visible, until `/comp4020:ship` flips it) — see `PLAN.md`.

**Not yet resolved:** flipping the repo public is itself the trigger for
CI/deploy to run at all, and is a visible, one-way-feeling action. The
right moment to do that is once there's real lineage content worth testing
subpath/casing against — not the starter page alone. See the note in
`PLAN.md`'s Phase 2 section.

---

## 7. Node list: the cut

Target: the marker reaches **you** inside the ~1 minute they spend on the
core interaction. At the drafted 39 nodes that's under 2 seconds each —
nobody reads two facts that fast. Cut toward the marker finishing the line,
not toward an arbitrary count.

**Cut outright** (no branch and no trait worth a screen, or too much setup
for one fact):

| Node | Why |
|---|---|
| Filozoa | choanoflagellates need a paragraph of setup to land one fact |
| Tetrapodomorpha | sits between two stronger fish-to-land nodes; three in a row is the flattest stretch on the page |
| Therapsida, Cynodontia | no branch, minor traits; folded into the Mammaliaformes node's lead-up text |
| Catarrhini | "New World monkeys leave" doesn't carry a screen on its own |
| Hominidae, Homininae | four ape nodes where two (Hominoidea, Hominini) do the same work; gibbons/orangutans mentioned in Hominoidea's text |
| Australopithecus | folded into Homo's lead-up text; also a category slip (a genus among clade names) and its direct ancestry is genuinely contested |

**Rewritten, not cut:**

- **Archaea → merged into Eukaryote.** The original two-node "Archaea splits
  from bacteria" oversimplifies current phylogeny (eukaryotes arise from
  *within* Asgard archaea, not alongside them) — exactly the kind of
  invented precision the science-accuracy rule warns against. Reframed as:
  *you are, ancestrally, an archaeon that swallowed a bacterium* — more
  accurate and a better lead-in to the mitochondria trait.

**Kept against the plan's own cut suggestion:**

- **Euarchontoglires.** Reframed by the branch, not the clade name:
  *everything you picture when you hear "animal" — dogs, horses, whales,
  bats — leaves here.* A surprising cousin is exactly the keep criterion.
- **Holozoa.** Load-bearing for the point of view itself — it's the node
  that makes "a mushroom has been evolving for exactly as long as you have"
  true, because it's the point where the fungi branch actually leaves.

**Flagged for Phase 2 verification, not resolved here:** the draft's branch
label at Euarchontoglires ("dogs, whales, bats, horses leave") is likely
imprecise — those are Laurasiatheria, phylogenetically a sister group to
Euarchontoglires, not a branch leaving from within it. Get this right
against TimeTree/a primary reference in Phase 2 rather than trusting either
the original draft or this rewrite from memory.

**Result: 28 nodes**, down from the drafted 39 — see the finalized list in
`docs/PLAN.md`. Two more (Eumetazoa, Simiiformes) are marked there as
optional next cuts if 28 still runs long in testing, but weren't cut here
because each carries a distinct, surprising cousin the keep criterion
argues for.

---

## 8. Model routing

Opus through the end of Phase 1 (this file, the failing test, `PLAN.md`'s
route update) — judgment-heavy, low token volume. Switch to Sonnet for
Phase 2 (data entry against TimeTree, mechanical) and most of Phase 4
(implementing an architecture already agreed here). Back to Opus for any
moment scope judgment resurfaces, and the Phase 5 pre-ship review.

---

## 9. A boundary that held

Asked to write `docs/PROCESS.md` logging "the evolution of our thinking."
Declined: the root `CLAUDE.md` (authorship section) and `CONTEXT.md` §7 are
explicit that `PROCESS.md` is written by the student, in the student's
voice, and the agent may gather citations and verify but not draft prose. A
file at a different path with that name risks exactly the confusion the
rule exists to prevent. This decision log went into this file instead,
which was already the sanctioned place for it.
