# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site written in
HTML/CSS/TypeScript that builds to plain HTML/CSS/JS and deploys to GitHub
Pages. The **deployed site is what gets marked** --- not this repo, and not "it
works on my machine". It's marked live in Chrome against the deployed URL at two
viewports --- 1920×1080 (desktop) and 390×844 (phone) --- and both count in
full, so make that artefact good at both and use the checks below to know
whether it is.

The course website publishes this deliverable's brief and spec. The brief poses
the problem; the spec is the fixed contract every response must satisfy. This
repo's name tells you which deliverable applies. Run the course plugin's
**start** skill at the start of each week: it pulls the right spec from the
course API, carries your harness forward from last week, and helps you turn the
spec's checkable lines into tests of your own. Read the brief and spec before
you plan or build, and see `spec/README.md` for how the checks relate to them.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, and the spec --- so you catch those in seconds instead of waiting for
  the pipeline. The links check, the evidence check, the secrets scan, and the
  deploy itself only run in CI; run `pnpm dlx linkinator ./dist --silent`
  locally against a fresh `pnpm build` for the links check without waiting for
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it in a browser (the `agent-browser` CLI, documented on
  [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth),
  works well for this). The rendered page is the truth; your mental model of it
  isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once your repo is public. GitHub's checks UI shows
two jobs, `check` and `deploy` --- not one status per sensor below --- and
within `check` the steps run in sequence (`pnpm check` chains typecheck, build,
lint, and the spec with `&&`), so an early failure like a broken build stops the
later sensors from running for that push; fix it and push again to see the rest.
While the repo is private (all week, until you ship) the CI jobs stay skipped
--- `pnpm check` is the same roster on your machine, and it's the faster loop
anyway. They aren't hoops. Each is a different way of finding out something true
about the site that you can't reliably see by looking at it.

They also carry a mark at a crit: the sweep runs fifteen minutes after your
cutoff, and green checks there are worth half that week's shipped mark. Still
running counts as not green, so ship with time for CI to finish.

- **typecheck** --- `tsc --noEmit` runs first in `pnpm check`, so a type error
  stops the roster before the build even starts. The types are extra
  backpressure: a red here is the compiler telling you a claim in the code is
  false.
- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/invariants.test.ts` asserts what's true of any good
  website, whatever the week's brief asks; the tests you write for the week's
  spec run alongside it (any `spec/*.test.ts`). A failure names the contract
  you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for TypeScript. Flags code that's
  wrong, fragile, or non-idiomatic. Read the rule it names.
- **tests** --- any other tests you write, wherever you put them (co-located
  with your source is fine, not just `spec/`), must pass. Vitest picks up both
  this and the spec suite in one `vitest run`, the last step of `pnpm check`. A
  failing test is a claim about the site that's no longer true.
- **evidence** (`pnpm check:evidence`) --- checks your process evidence:
  `PROCESS.md`'s citations resolve to real commits, the current deliverable's
  exact reflection is in `reflections/` (worked out from this repo's name
  against the public course API), and your `CLAUDE.md` is present. Evidence
  gates the deploy --- `deploy` needs `check` to pass, so failing evidence
  blocks the deploy alongside everything else. See
  [Your process is part of the mark](#your-process-is-part-of-the-mark) below,
  and the course website's
  [assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
  for what counts as evidence.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it. A local
  pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also
  blocks any commit containing something shaped like an API key --- by the time
  CI sees a key it's already pushed, so the hook is the sensor that matters.

Nothing here measures **accessibility** or **performance** --- wiring those
sensors (`axe-core`, Lighthouse, or whatever you choose) is your work, and later
in the course the spec will ask you to show how you tested both. When you do,
read a green performance result honestly: it's a lab estimate from one run on a
CI machine, not proof the site is fast for real users.

## The stack is swappable

Out of the box this is plain HTML/CSS/TypeScript on Vite, and every `.html` file
in the repo is a page: add pages, link them, and the build picks them up with no
config. That's a default, not a rule (unless the week's spec says otherwise).
You can swap in Astro or any other static generator, because nothing in CI names
a tool --- the whole contract is:

- `pnpm build` emits the complete site into `dist/`
- the `package.json` scripts (`check`, `check:evidence`, `build`) keep working
- whatever lands in `dist/` still passes the invariants in `spec/`

Two things bite in a swap. The deployed site lives under a path
(`…github.io/<repo>/`), so configure your generator's base path --- this
template's Vite config uses relative asset URLs to sidestep that, but most
generators (Astro included) need `base` set explicitly, and getting it wrong
looks fine locally while every asset 404s on the live URL. And commit the
updated `pnpm-lock.yaml`: CI installs with `--frozen-lockfile`.

For the course default (Astro) or the bare hand-written arm, don't wire the swap
by hand: the course plugin's `stack` skill runs a tested conversion script that
handles both of the traps above plus the CI link-check patch, and leaves the
whole change staged as one reviewable diff.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading-guide, not an
  essay: what you built, the moments that mattered --- each pointing at a
  commit, a `CLAUDE.md` change, or a prompt and the commit it produced --- and
  where to look in the history. It points a marker at the evidence; it doesn't
  stand in for it, and claims the history doesn't back don't count. The
  `PROCESS.md` in this repo is a template showing the shape and the citation
  format (link text the commit hash or range, target the commit or compare URL);
  `pnpm check:evidence` verifies your citations resolve to real commits before
  you ship. Markers follow those citations and don't trawl the repo for evidence
  you didn't cite.
- **Write your reflection in `reflections/`** --- a short markdown file in this
  repo, named for the deliverable it answers, so the number in the filename is
  the number in this repo's name (`crit-1.md` in `comp4020-crit1-<you>`,
  `assignment-1.md` in `comp4020-ass1-<you>`); `reflections/README.md` has the
  full rule. `pnpm check:evidence` checks the exact current name against the
  course API, not merely the presence of any well-named file. It answers the two
  standing prompts: the breakthrough that moved the work forward, and what this
  work changed about the developer you want to be. It stays out of the deployed
  site. It's due at the cutoff, and if it isn't in the repo by then the week
  doesn't count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## This file is yours

This CLAUDE.md is a starting point, not a fixed rulebook. As you learn what your
prototype needs --- a convention to hold the agent to, a sensor that keeps
catching you out, a fact about the stack the agent keeps getting wrong --- write
it down here. Growing this file is the work of harness engineering, and the gap
between this boilerplate and your own version is part of what your prototype
says about the developer you're becoming.

---

# Project rules — "one unbroken line" (Assignment 1)

Everything below this line is mine, not the template's. Added 2026-08-15.

## Read these first

- **`CONTEXT.md`** — the brief, the live spec, the idea, the sources, and the
  decisions already made with their rejected alternatives.
- **`docs/PLAN.md`** — the phased route and the draft node list.

Do not re-derive the deliverable requirements from memory. They were fetched
live from the course API on 2026-08-15 and written into `CONTEXT.md`. If a
requirement matters and might have changed, re-fetch it rather than trusting
either of us.

## Which credits this session burns

Sessions opened **in this repo** run on **course credits** via
`.claude/settings.local.json` (untracked, and `.gitignore` blocks `.claude/`).
This requires the **ANU VPN (GlobalProtect)** — `strproxy` is unreachable from
the public internet, so without the VPN the session fails outright rather than
quietly falling back to the personal plan.

Sessions opened at the `COMP 4020` folder root run on the **personal** plan.
That's deliberate: planning and admin are paid personally, building is paid by
the course. Never add proxy config outside this repo.

## Authorship — do not cross this line

**`PROCESS.md` and `reflections/assignment-1.md` are written by me, in my own
voice.** Do not draft, ghostwrite, or "improve" their prose, and do not offer a
draft for me to edit.

You *may*: remind me they're outstanding, gather candidate commit hashes and
ranges, count words against the 400–600 / 150–300 limits, check the filename is
exactly `assignment-1.md`, and verify cited commits resolve.

Both documents are assessed as my own account of my own work. A drafted one
would be worth nothing even if it were good.

## Scope discipline

The brief's constraint is **one strong idea, one dataset or mechanic, and
nothing else**, and over-scoping is an explicit fail band.

- The spine is the **human lineage only**. Branches are *shown leaving* and
  **never followed**.
- Do not propose exploring sideways, adding other kingdoms, adding a quiz, or
  adding a second mechanic. If a feature doesn't serve "one unbroken line to
  you", the answer is no.
- If you think something is out of scope, **say so instead of building it**.

## Science accuracy

This is a factual explainer; wrong science destroys the point of view.

- Divergence dates come from **TimeTree** or a cited primary reference, never
  from memory and never from the inspiration video.
- **Never invent precision.** Prefer "~420 million years ago" or an explicit
  range over a fake-exact figure. Every node carries a `source`.
- AI-generated organisms are **plausible reconstructions**, labelled as
  AI-generated on the page. Where a fossil constrains the appearance, the
  generation prompt must say so.
- The UsefulCharts video is **inspiration and foil, credited** — never a source
  to copy from. Do not reproduce its chart, groupings, script or artwork.

### A date is not a node (added 2026-08-16, after the third instance)

Three separate times the dataset has carried a **correct number attached to the
wrong node**: Euarchontoglires' age on a node that was really Boreoeutheria
(caught in Phase 2), Foley et al. 2023's Euarchontoglires origin cited as crown
Primates, and crown Simiiformes' age sitting on the tarsier split. A wrong date
is obvious. A right date on the wrong node passes every check I have.

So before accepting any node's age, verify three things **separately**, and only
then together:

1. **what the paper actually dates** — read the node name in the paper, not the
   headline figure;
2. **what this node is** — the clade whose origin the split defines;
3. **which cousins `branch` says leave here** — that names the sister group, and
   therefore names the split.

If those three don't describe the same divergence, the node is wrong even though
the number is right. This is also the cheapest place to catch it: it costs one
sentence per node and it has now caught three errors.

**Arithmetic check that needs no expertise:** a divergence cannot be younger than
the fossils on *both* sides of it. That check alone caught Simiiformes at 40 Ma,
with a 55 Ma tarsiiform and a 45 Ma anthropoid bracketing it.

**A correction that only lands in `note` is not a correction.** `main.ts` renders
`name`, `age`, `branch`, `gained`, `stillWithYou` and `source`. It does **not**
render `note`. Fix the rendered field; use `note` for the reasoning behind the
fix, and for what was thrown away.

## Media

- **No `<video>` elements for scroll-driven sequences.** Hero sequences ship as
  **WebP frame sequences** scrubbed by scroll position. Reason: all seven
  course exemplars are code-drawn or static-image and none ship video; Deep
  Sea's asset list is ~128 PNGs and zero video files. Frames scrub reversibly,
  survive iOS Safari, stay keyboard-drivable and lazy-load.
- Frame sequences are decorative containers (`aria-hidden`) with one real
  described image — not 120 `<img>` tags each demanding alt text.
- Budget: **≤120 frames and ≤1.5 MB per sequence**, two width variants.
- The site must build and pass its checks **with placeholders**. Media landing
  late must never block the build.

## Accessibility and robustness are contract, not polish

The marker tabs through the page, resizes mid-interaction, and loads it on a
slow connection. That is the HD band for the artefact criterion, so:

- Every scroll interaction has a **keyboard equivalent** (arrows, PageDown/Up,
  Home/End) with a visible focus indicator that tracks the current node.
- `prefers-reduced-motion` must yield a **static, readable** page — not a
  broken one.
- Resizing mid-interaction must not lose the current node or strand the
  visitor.
- Never scroll-jack in a way that traps the keyboard.

## Working method

- **Twice-wrong ⇒ fix the harness.** If the same class of error happens twice,
  do not re-prompt a third time. Add a rule here or wire a check, and **commit
  that on its own** so it can be cited. Re-prompting until it passes is the
  routine case; changing what the work runs against is the skilled one, and
  that distinction is explicitly where the marks are.
- **Write the test before the feature** for anything the spec states as a
  contract. A test I wrote that fails on purpose is worth committing.
- **Verify at the rendered page, not the diff.** "The check is green" is
  evidence. "It looks right" is not.
- **Never delete a failed attempt silently.** Commit it, then commit the revert
  with the reason. What got thrown away is HD evidence.
- **Commit small and often.** The history must visibly grow with the work.
  Never commit a red state.

## Stack facts that bite

- Invariants run against **`dist/`**, not source — `pnpm build` before
  believing a green result.
- **Exactly one `<h1>`** per page (not "at least one"), and a `<nav>` landmark
  is required even on a single-page scroller. The chapter jump-list satisfies
  this and earns its keep as a skip target.
- `spec/starter.test.ts` is a worked example tied to the starter page — delete
  it when the starter page goes, and don't treat it as an invariant.
- The deployed site lives under the base path
  `/comp4020-ass1-Adeeth101/`. Root-absolute asset paths look fine locally and
  **404 in production**. Deploy early and check the live URL.
- `pnpm check` chains with `&&`, so an early failure hides every later sensor.
- Run scripts as `mise exec -- pnpm …` unless the shell has mise activated.
