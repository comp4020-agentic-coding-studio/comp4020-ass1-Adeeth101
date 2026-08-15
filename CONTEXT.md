# CONTEXT — Assignment 1

> **What this file is.** The repo already ships a starter `CLAUDE.md`, which is
> the *harness* (rules the agent must obey, and itself marked as process
> evidence). This file is the *briefing*: the ingested deliverable spec, the
> idea, the sources, and the decisions already made and why. Read both before
> planning or building. `CLAUDE.md` says what you must do; this says what we're
> doing and why.
>
> Ingested 2026-08-15. Deliverable facts fetched live from the course API, not
> remembered.

---

## 1. The deliverable (fetched live 2026-08-15)

From `/api/assessments/assignment-1.json`:

- **Due:** `2026-08-17T12:00:00+10:00` — noon Monday 17 August 2026, Canberra
- **Weight:** 20% of the course
- **Week:** 4 · **Repo prefix:** `comp4020-ass1`
- **No late submissions.** Extensions are easy but must be arranged *before*
  the deadline.

### The brief

> Build an interactive explainer of something you think more people should know
> or understand.

The genre supplies the discipline: **one strong idea, one dataset or mechanic,
and nothing else.** *Interactive* is doing real work — the visitor has to *do*
something, not only read. The point of view lives in deciding why your
something is worth more people's understanding.

### The spec (the fixed contract — all six lines)

1. deployed and live at its public GitHub Pages URL by the deadline
2. static and client-side throughout, and the starter's invariant checks pass
3. it works at both marking viewports (desktop and phone)
4. the visitor does something that changes what they see — **state the core
   interaction plainly enough to write a test for it**
5. one strong idea with a point of view, and nothing else
6. evidence of process is in the repo: `PROCESS.md`, your `CLAUDE.md`,
   `reflections/assignment-1.md`, and a commit history that grew with the work

### How it's marked

| Criterion | Weight | HD band |
| --- | --- | --- |
| **Legibility of process** | **45%** | corroborated *and skilled*: failures fixed at the **harness** level rather than retried, output verified before accepted, judgement visible in what was **thrown away** |
| Working deployed artefact | 20% | holds up under use it wasn't designed for: **the keyboard, a resize mid-interaction, a slow connection** |
| Response to the brief | 35% | pointed, surprising, **scoped with judgement: one idea, carried all the way** |

The marker opens the live URL at both viewports, **uses the core interaction
for about a minute**, resizes mid-use, and tabs through it. That is the entire
artefact assessment — so the first minute has to land, and keyboard access is
not optional polish.

### Process artefacts — exact requirements

- **`PROCESS.md`** — 400–600 words, **three or four moments, not more**. Each
  moment does four jobs: what happened · **what you did instead of the obvious
  thing** · **how you knew it was right** · the citation (commit hash/range as
  link text, targeting this repo's commit/compare URL). Jobs 2 and 3 are where
  the marks are, because the repo can't show them on its own.
- **The strongest moments are harness corrections, not retries** — a rule added
  to `CLAUDE.md`, a check wired up, an attempt thrown away. *"Retrying until it
  passes is the routine case, and changing what the work runs against is the
  skilled one."* This should actively shape how we work, not just how we write
  it up: **when something goes wrong twice, fix the harness, and keep that
  commit separate so it can be cited.**
- **`reflections/assignment-1.md`** — exact filename, checked by
  `pnpm check:evidence` against the course API. 150–300 words, answering: the
  breakthrough that moved the work forward, and what this changed about who
  you want to be as a developer. This is what you present at the **week 4
  retro** — there is nothing to write twice.

---

## 2. The enforced contract (read before designing)

`spec/invariants.test.ts` runs against the **built** site in `dist/`, not the
source. Every page must:

- declare `lang` on `<html>`
- have a non-empty `<title>`
- have `<meta name="viewport">`
- **have a `<nav>` landmark** — a single-page scroller still needs one
- **have exactly one `<h1>`** — exactly one, not "at least"
- give **every** `<img>` an `alt` attribute

Two of these shape the design directly: a one-page scroller must still carry a
real `<nav>` (which we get for free by making it a chapter jump-list — also a
genuine accessibility win), and every generated frame image needs `alt`, so
frame sequences should be `aria-hidden` decorative containers with one real
described image, or use CSS backgrounds, rather than 120 `<img>` tags each
needing alt text.

Other sensors: `typecheck` → `build` → `oxlint` → `stylelint` → `vitest`,
chained with `&&` in `pnpm check`, so an early failure hides later ones.
`pnpm check:evidence` gates the deploy. Secrets are blocked by a pre-commit
hook. **Never commit a red state.**

`spec/starter.test.ts` is a worked example tied to the starter page — delete it
when the starter page goes.

---

## 3. The idea

### The provocation

People cannot believe humans evolved from fish. The usual failure is that the
tree of life gets drawn as a *ladder* — a march of progress from amoeba to man
— which is both wrong and the reason the real thing feels unbelievable.

### The response

**One unbroken scroll down your own direct ancestral line, from LUCA to you.**

Scroll is descent through deep time. At every node you keep falling, and
something *else* peels away sideways — the branch that became sponges, or
insects, or oaks, or chimps. Two facts per node, and only two:

1. **what split off here** (your cousins — not your ancestors)
2. **what changed in you** (the trait you still carry)

### The point of view

> Evolution is not a ladder — but there *is* one unbroken line that ends in
> you, and every organism you think of as "primitive" is a cousin standing at
> the end of a line exactly as long as yours. A mushroom has been evolving for
> precisely as long as you have.

That reframe is the whole argument, and it's what makes "you are a fish" land
as arithmetic rather than provocation. It is also the honest correction to the
ladder picture the video's format tends to imply.

### Why this scopes correctly

One dataset (~35–40 nodes on the human lineage), one mechanic (scroll =
descent), one idea. Everything not on the direct line is deliberately excluded
— the branches are *shown leaving* but never followed. **That exclusion is the
scoping judgement the 35% criterion is looking for**, and it is the single
thing most likely to be sacrificed under time pressure. Don't sacrifice it.

---

## 4. Source material and attribution

### The inspiration (credit, don't copy)

- **UsefulCharts, "Evolutionary Tree of Life (Full Series)"** — Matt Baker.
  <https://www.youtube.com/watch?v=ii4510LeRXo>

This is the **inspiration and the foil**, not a source to reproduce. It is
copyrighted work sold as a chart. Concretely:

- **Do not** copy its chart layout, its groupings, its script, or its visual
  design
- **Do not** use its footage or stills
- **Do** credit it on the page as the thing that prompted this, and be explicit
  that the response is an *interactive* answer to a *linear* format

### Where the actual phylogeny data must come from

Facts get sourced independently, and are cited on the page:

- **TimeTree** (<http://timetree.org>) — divergence dates, the primary source
  for node ages
- **OneZoom** (<https://www.onezoom.org>) — topology sanity-check
- **UCMP Berkeley**, **Wikipedia** with its cited primary refs — trait/clade
  descriptions

Divergence dates are genuinely contested and often given as wide ranges.
**Round honestly and show uncertainty rather than inventing precision** — a
fake-precise "1,437 Ma" is worse than "~1.4 billion years ago". This is a
factual explainer; getting the science wrong undermines the whole point of
view.

### Generated media

- **Veo / Google** — video for the hero sequences
- **Nano Banana (Gemini Flash Image)** — stills for individual organisms

AI-generated organisms must be **plausible reconstructions**, not fantasy.
Where a real fossil constrains the look (Tiktaalik, Dimetrodon), the prompt
must say so. Generated media is labelled as such on the page — passing off an
AI still as a photograph of a fossil would be a straightforward integrity
problem.

---

## 5. Decisions already made, and why

| Decision | Why | Alternative rejected |
| --- | --- | --- |
| **Human lineage only**, not the full tree | "one idea and nothing else"; over-scoping is an explicit **P** band | Full 5-chapter port of the video — 5× content, 2 days, marker uses it for 1 minute |
| **Scroll = descent through time** | matches the strongest exemplar (Deep Sea) and the subject: descent *is* a vertical, one-way process | click-through tree navigation — loses the felt continuity of the line |
| **Video shipped as frame sequences, not `<video>`** | measured Deep Sea: ~128 PNG sprites, **zero video files**. All 7 exemplars are code-drawn or static-image; none use video | `<video>` + `currentTime` scrubbing — breaks on iOS Safari, can't scrub reversibly, fails the keyboard and slow-connection HD band |
| **2–3 generated hero sequences, rest code-drawn/stills** | keeps the visual ambition where it pays, keeps the page light | all-generated (page weight, generation loop eats the 2 days) or all-code (loses the visual richness that motivated this) |
| Branches shown leaving but **never followed** | it's the scoping discipline the brief rewards | letting the visitor explore sideways — that's a different, larger project |

---

## 6. Constraints

- **~43 hours** from ingestion to deadline (Sat 2026-08-15 17:00 → Mon 12:00)
- **Static, client-side only.** No server, no API calls at runtime. All data
  ships in the bundle.
- **Account routing:** sessions in *this repo* run on **course credits** via
  `.claude/settings.local.json` (requires **ANU VPN / GlobalProtect**).
  Sessions at the `COMP 4020` folder root run on the **personal** plan. See
  the root `CLAUDE.md`.
- **Course budget:** $200/week cap, ~$1.19 spent as of Phase 1's close
  (2026-08-15, mostly one Opus session's cold start), resets Thu 2026-08-20
  09:00 — i.e. **after** this deadline, so the full $200 is effectively
  available for this assignment. **Target spend: ~$100**, hard ceiling $120,
  leaving headroom for the week-4 retro and Crit 3. Check with
  `/comp4020:balance`; the `comp4020-statusline` plugin shows it live.
  Re-check at the end of each phase — don't discover the spend at the end.
- **Deployed URL** will be
  `https://comp4020-agentic-coding-studio.github.io/comp4020-ass1-Adeeth101/`
  — the repo is currently **private** and must be flipped public via
  `/comp4020:ship`. Note the **base path**: assets must not assume root.

---

## 7. Standing rule on authorship

`PROCESS.md` and `reflections/assignment-1.md` are **written by the student, in
the student's own voice.** The agent may remind, gather citations, count words,
check filenames, and verify that cited commits resolve — but must not draft the
prose. Both documents are assessed as the student's own account of their own
work.
