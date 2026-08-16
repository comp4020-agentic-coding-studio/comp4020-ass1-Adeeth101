# Museum Editorial — Design Specification v1.0
### For: "One Unbroken Line" — a scroll-driven interactive explainer of human ancestry (LUCA → you)

A printed exhibition catalogue that happens to scroll. Sophisticated matte dark slate,
warm off-white editorial typography, elegant framing, understated branching diagrams.
**Nothing glows, nothing pulses.** Emphasis is carried by contrast and framing.

---

## 01 · PRINCIPLES

Four rules. If a decision isn't covered elsewhere in this document, resolve it against these.

**Restraint is the identity.** No glow, no bloom, no drop shadow, no scale transforms.
Emphasis comes from contrast and framing only. If an effect would be at home in a SaaS
dashboard, it does not belong here.

**It is a publication, not a UI.** Plate alignment *never* alternates. Consistency is what
makes a page read as authored. Resist the urge to zig-zag layout for visual interest.

**Brass is expensive.** The accent appears on frames, placards, rules and the gauge — nowhere
else. Never as a background fill, never on body text, never on more than one element per
screen at full strength.

**Structure must be true.** Roman plate numbers are used because the timeline genuinely *is*
an ordered sequence. Never add numbering, eyebrows or dividers that don't encode something
real about the content.

---

## 02 · COLOUR

Eleven values, no more. The palette is deliberately narrow — the discipline is what makes it
read as considered rather than assembled.

### Ground
| Token | Hex | Used for |
|---|---|---|
| `--bg` | `#14171B` | Page background. The gallery wall. |
| `--bg-alt` | `#1A1E23` | Alternating band for full-width interludes. Optional. |
| `--surface` | `#1F242A` | Mount board. Only ever appears behind an **active** plate. |

### Ink
| Token | Hex | Used for |
|---|---|---|
| `--text` | `#ECE7DD` | Headings, emphasis. Warm off-white — never pure `#FFF`. |
| `--text-2` | `#9A968C` | Body prose, secondary readouts. |
| `--text-3` | `#6B6862` | Captions, dormant placards, metadata. |

### Accent
| Token | Hex | Used for |
|---|---|---|
| `--brass` | `#C6A15B` | Frames, plate numbers, rules, gauge fill. The only warm accent. |
| `--cool` | `#7E9BA6` | Italic subtitles, and lineages that survived but aren't yours. |
| `--rust` | `#A0664F` | **Optional.** Extinction markers only — struck-through terminal dots and `†` labels. |

### Structure
| Token | Value | Used for |
|---|---|---|
| `--rule` | `rgba(236,231,221,.14)` | Hairline dividers. |
| `--rule-soft` | `rgba(236,231,221,.07)` | Secondary dividers, inner cell borders. |
| `--frame-off` | `rgba(198,161,91,.08)` | Dormant plate frame — brass at 8%. |
| `--frame-on` | `rgba(198,161,91,.55)` | Active plate frame — brass at 55%. |

---

## 03 · TYPOGRAPHY

Two families. **Newsreader** carries everything that speaks; **Barlow Condensed** carries
everything that labels.

Load Newsreader as a variable font and drive the `opsz` axis — that axis is why a 28px clade
name and a 15px paragraph can share a family without the heading looking like inflated body
copy. **Self-host both as woff2**; do not rely on a CDN.

```css
@font-face{ font-family:"Newsreader";
            src:url(/fonts/newsreader-var.woff2) format("woff2-variations");
            font-weight:200 800; font-style:normal; font-display:swap; }
@font-face{ font-family:"Barlow Condensed";
            src:url(/fonts/barlow-condensed-500.woff2) format("woff2");
            font-weight:500; font-display:swap; }
```

### Type scale

| Role | Family / weight | Size / leading | Tracking | Colour |
|---|---|---|---|---|
| **Display XL** (hero only) | Newsreader 500, `opsz` 40 | `clamp(36px, 6vw, 60px)` / 1.02 | −0.030em | `--text` |
| **Display L** (clade name) | Newsreader 500, `opsz` 36 | 28px / 1.10 | −0.012em | `--text` |
| **Subtitle** (one per plate) | Newsreader 400 *italic* | 14.5px / 1.5 | — | `--cool` |
| **Body** | Newsreader 400, `opsz` 14 | 15px / 1.68 | — | `--text-2` |
| **Placard** (numbers, eras) | Barlow Condensed 500 CAPS | 11.5px | 0.20em | `--brass` |
| **Caption** (below the rule) | Barlow Condensed 500 CAPS | 11.5px | 0.15em | `--text-2` |
| **Gauge readout** | Barlow Condensed 500 CAPS | 12px | 0.16em | `--text-2` |

**Body measure: 52ch.** Hard limit.

### Numerals
- **Oldstyle figures in prose.** A date inside a sentence takes `font-variant-numeric: oldstyle-nums`
  so it sits on the baseline rhythm instead of standing up like a UI element.
- **Lining tabular figures in any column.** Anything that updates in place — the gauge, a counter —
  takes `tabular-nums`, or it will jitter as digits change width.

### Non-negotiables
- Barlow Condensed is **never used for a sentence.** It labels; it does not speak.
  Uppercase only, 11–12px only.
- Body measure stays at **52ch**. Wider and it stops reading as a publication.
- Headings get `text-wrap: balance`. Body does not.

---

## 04 · SPACE & LAYOUT

4px base unit. Use the scale; do not invent intermediate values.

| Token | Value | Used for |
|---|---|---|
| `--s1` | 4px | Icon gaps, hairline offsets |
| `--s2` | 8px | Plate padding (the mat gap), tight stacks |
| `--s3` | 12px | Placard → title, caption rule offset |
| `--s4` | 16px | Title → body, caption top margin |
| `--s5` | 24px | Plate inner padding (vertical) |
| `--s6` | 28px | Plate inner padding (horizontal) |
| `--s7` | 48px | Gap between plates |
| `--s8` | 96px | Section padding, gutter width |
| `--s9` | 128px | Interlude breathing room |

### Page grid — desktop
```
Content column    max-width 940px, centred
Diagram gutter    96px, left of the plate column
Plate column      remaining width, body measure capped at 52ch
Page padding      32px either side
```

Plates are stacked in a single column with a 48px gap. **Alignment never alternates.**

---

## 05 · THE PLATE (node card)

The node card is a **mounted plate** — a print behind a window mat. A mount-board surface
with a 1px brass frame inset 8px from the card edge. This double-edge is the single most
identity-carrying detail in the system; do not replace it with a border-radius card.

### Anatomy
```
.plate                padding 8px             ← the mat gap
  .plate__frame       inset 8px, 1px border   ← the window mat
  .plate__in          padding 24px 28px 26px
    __num             Placard, brass, margin-bottom 12px
    __title           Display L, margin-bottom 3px
    __sub             Subtitle italic, cool, margin-bottom 14px
    __body            Body, 52ch max
    __cap             margin-top 16px, padding-top 12px, border-top --rule
```

### State table

| Property | Dormant | Active | Transition |
|---|---|---|---|
| Card background | `transparent` | `--surface` | 500ms |
| Frame border | `--frame-off` (8%) | `--frame-on` (55%) | 500ms |
| Content opacity | `0.55` | `1` | 500ms |
| Caption | `inset(0 100% 0 0)` | `inset(0 0 0 0)` | 500ms wipe, L→R |
| Transform | none | **none** | — |
| Box-shadow | none | **none** | — |

### Activation trigger
Scroll-driven. Use an `IntersectionObserver` with `rootMargin: "-42% 0px -42% 0px"` so a plate
activates as it crosses the middle band of the viewport. **Exactly one plate is active at a
time** — if the band can span two plates, resolve to the one nearest the centre line rather
than letting both light.

---

## 06 · DEPTH GAUGE

Not a rail — a **catalogue ruler** pinned to the top edge. 2px track, brass fill, with a small
tick riding the current position. Two condensed-caps readouts beneath: plate number and era on
the left, absolute date on the right.

```
Plate VII of XVI · Carboniferous          320 million years before present
```

- **Roman plate numbering is retained.** It tells the reader how far through the exhibition
  they are, which a raw percentage does not. Legible up to about XX; past that, let the era
  placard carry position instead.
- The date readout **interpolates continuously** between plate anchors rather than snapping.
  But the fill and tick move with scroll, **not on a transition** — never animate the gauge,
  it would lag the scroll and read as broken.
- Both readouts use `tabular-nums`.
- Position: `sticky` at the top of the scroll container, **not** `fixed`.

---

## 07 · BRANCH LINES

**Drawn, not stroked.** The trunk is a *filled path* that tapers from roughly 3px at the top to
1.5px at the bottom, so it reads as a nib line on plate paper rather than a CSS border.
Branches leave as slack quadratic curves with a slight droop, as though under their own weight.

### The trunk is one element for the whole page — amended 2026-08-16

The reference SVG below draws trunk and branches together, and the first implementation followed
it literally: one SVG per node, each containing its own slice of trunk. That was wrong once
time-scaled pacing (`docs/DESIGN.md` §4) put real distance between plates. A per-node trunk stops
at the bottom of each plate and restarts at the top of the next, so across LUCA's spacer — eleven
screens at the current tuning — there was no line on the page at all. On a piece called *One
Unbroken Line*, that is a correctness bug, not a cosmetic one.

**Current model:**

- **The trunk** is a single element, `.trunk`, absolutely positioned behind the whole lineage and
  spanning its full height, spacers included. Still a filled, tapering path — the taper now runs
  once across the entire lineage instead of resetting at every node, which is closer to what the
  taper was always trying to say.
- **Per-node SVGs** draw only what belongs to that node: the junction dot, and where a cousin
  lineage leaves, the curve and its termination or survivor dot. No trunk.
- **Alignment** is held by a shared `--gutter` custom property. The trunk sits at 25% of the
  gutter; each node's junction is at `cx="24"` in a 96-unit viewBox, the same 25%. Both read the
  same variable, so the two cannot drift apart at either breakpoint. Verified rendered, not
  assumed: trunk centre and junction centres all land on the same x.
- **Narrow screens** use the same layout as desktop with a smaller gutter (40px vs 96px). The
  previous narrow-screen variant put the diagram *below* the plate as a horizontal connector,
  which a continuous vertical trunk cannot use. Branch curves carry
  `vector-effect="non-scaling-stroke"` so the hard vertical stretch of the viewBox doesn't smear
  a 1px stroke.

The reference SVG below is kept as the **visual** reference for weights, colours and the dot
vocabulary — all of which still hold exactly. It is no longer the structural reference.

| Element | Spec |
|---|---|
| Trunk | Filled `<path>`, not a stroke. Tapers 3px → 1.5px **across the whole page**, drawn once. `--brass` at 62%. |
| Branch | Quadratic curve with a slight droop. 1px stroke, `--brass` at 40%. |
| Terminated lineage | Hollow 2.8r dot, `--rust` 1px stroke, with a 45° tick struck through it. |
| Surviving, not yours | Solid 2.8r dot in `--cool` at 70%. |
| Your junction | Solid 4r dot in `--brass` at full strength. |
| Label leader | 0.75px hairline, `--brass` at 20%, running to the label. |
| Label | Clade name in *italic serif* 12px. Status line beneath in Barlow Condensed 10px caps, `--text-3`. |

### Reference SVG (trunk + one termination + one divergence + your junction)

```svg
<svg viewBox="0 0 560 330">
  <!-- tapered trunk, FILLED path not a stroke -->
  <path d="M28 6 C26.6 92 26 202 26.2 324 L23.4 324 C23.2 202 23.8 92 25.2 6 Z"
        fill="#C6A15B" opacity=".62"/>

  <!-- terminated lineage -->
  <path d="M26 62 C70 66 90 78 104 106" stroke="#C6A15B" stroke-width="1" fill="none" opacity=".4"/>
  <circle cx="104" cy="106" r="2.8" fill="none" stroke="#A0664F" stroke-width="1"/>
  <path d="M100.2 102.2 L107.8 109.8" stroke="#A0664F" stroke-width="1"/>
  <path d="M109 106 H150" stroke="#C6A15B" stroke-width=".75" opacity=".2"/>

  <!-- surviving, not your line -->
  <path d="M25 158 C62 164 78 178 88 204" stroke="#C6A15B" stroke-width="1" fill="none" opacity=".4"/>
  <circle cx="88" cy="204" r="2.8" fill="#7E9BA6" opacity=".7"/>

  <!-- your junction -->
  <circle cx="25" cy="268" r="4" fill="#C6A15B"/>
  <path d="M32 268 H150" stroke="#C6A15B" stroke-width=".75" opacity=".45"/>
</svg>
```

### Animation
**Opacity fade-in only.** No draw-on, no dash animation, no path morphing. The plate must never
look like a UI — a line that draws itself is the fastest way to lose the printed-catalogue read.

---

## 08 · MOTION

One curve, one duration, for everything. If you find yourself reaching for a second, the
interaction is probably wrong.

```css
--ease: cubic-bezier(.22, .61, .36, 1);
--dur:  500ms;
```

| What | Animates? | Notes |
|---|---|---|
| Plate background | Yes — 500ms | Fades in; never slides |
| Frame border | Yes — 500ms | Colour only |
| Content opacity | Yes — 500ms | 0.55 → 1 |
| Caption | Yes — 500ms | `clip-path` wipe, left to right |
| Branch lines | Opacity only | No draw-on |
| Depth gauge | **No** | Tracks scroll directly — a transition would lag |
| Transform / scale | **Never** | Not used anywhere in the system |
| Shadow / glow | **Never** | Not used anywhere in the system |

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ transition-duration:1ms !important; }
  html{ scroll-behavior:auto; }
}
```

---

## 09 · RESPONSIVE

One breakpoint at **720px**. Below it, the diagram gutter cannot survive at 96px — the branch
lines move inline.

| Element | ≥ 720px | < 720px |
|---|---|---|
| Page padding | 32px | 18px |
| Diagram gutter | 96px, left | Removed — diagram moves below the plate, horizontal |
| Depth gauge | Sticky ruler, full content width | Sticky bar at top edge, readouts stack to one line |
| Plate padding | 24px 28px 26px | 20px 20px 22px |
| Mat inset | 8px | 6px |
| Display L | 28px | `clamp(22px, 6.8vw, 26px)` |
| Body | 15px / 1.68 · 52ch | 15px / 1.62 · full width |
| Plate gap | 48px | 32px |

Branch diagrams on mobile become a horizontal strip under the plate: the trunk runs
left-to-right, departures drop below it, labels wrap. Keep the terminal dot treatments
identical — that vocabulary is what carries across breakpoints.

---

## 10 · ACCESSIBILITY

- **Contrast.** `--text` on `--bg` is ~13:1. `--text-2` on `--bg` is ~6.2:1 — fine for body.
  `--text-3` at ~3.4:1 is **only** for 11px+ uppercase placards, never for prose.
- **Dormant plates.** Content at `0.55` opacity fails contrast. Either keep dormant plates fully
  available to screen readers, or raise dormant opacity to `0.7`. Do not ship `0.55` as a
  permanent state for content a reader may need to reach.
- **Focus.** Every interactive plate gets a visible focus ring:
  `outline: 2px solid var(--brass); outline-offset: 3px`. Do not rely on the brass frame alone.
- **Motion.** The reduced-motion guard in §08 is required, not optional.
- **SVG.** Every branch diagram carries an `aria-label` describing what the lines mean.
  Decorative repeats take `aria-hidden="true"`.
- **Scroll-driven content.** All plate text must be present in the DOM at load, not injected on
  activation, so it is reachable without scrolling.

---

## 11 · TOKENS — copy-paste

If a value isn't here, it isn't in the design.

```css
:root{
  /* ground */
  --bg:          #14171B;
  --bg-alt:      #1A1E23;
  --surface:     #1F242A;

  /* ink */
  --text:        #ECE7DD;
  --text-2:      #9A968C;
  --text-3:      #6B6862;

  /* accent */
  --brass:       #C6A15B;
  --cool:        #7E9BA6;
  --rust:        #A0664F;   /* extinction markers only */

  /* structure */
  --rule:        rgba(236,231,221,.14);
  --rule-soft:   rgba(236,231,221,.07);
  --frame-off:   rgba(198,161,91,.08);
  --frame-on:    rgba(198,161,91,.55);

  /* type */
  --serif:       "Newsreader", Georgia, serif;
  --cond:        "Barlow Condensed", sans-serif;

  /* space — 4px base */
  --s1:4px;  --s2:8px;   --s3:12px; --s4:16px; --s5:24px;
  --s6:28px; --s7:48px;  --s8:96px; --s9:128px;

  /* motion */
  --ease:        cubic-bezier(.22,.61,.36,1);
  --dur:         500ms;
}
```

### Plate component

```css
.plate{ position:relative; padding:var(--s2); background:transparent;
        transition:background var(--dur) var(--ease); }

.plate__frame{ position:absolute; inset:var(--s2); border:1px solid var(--frame-off);
               pointer-events:none; transition:border-color var(--dur) var(--ease); }

.plate__in{ padding:var(--s5) var(--s6) 26px; opacity:.55;
            transition:opacity var(--dur) var(--ease); }

.plate__cap{ margin-top:var(--s4); padding-top:var(--s3); border-top:1px solid var(--rule);
             clip-path:inset(0 100% 0 0);
             transition:clip-path var(--dur) var(--ease); }

.plate--on{ background:var(--surface); }
.plate--on .plate__frame{ border-color:var(--frame-on); }
.plate--on .plate__in{ opacity:1; }
.plate--on .plate__cap{ clip-path:inset(0 0 0 0); }
```

---

## 12 · GUARDRAILS

Things that will quietly destroy this identity. Each one is a real temptation during a build.

- ✗ **Do not add a glow, bloom or drop shadow** to the active plate. The whole system's claim is
  that emphasis can come from contrast and framing. One shadow and it becomes a generic
  dark-mode card.
- ✗ **Do not alternate plate alignment** left/right down the page. It reads as a template.
  Consistency is the editorial signal.
- ✗ **Do not use brass as a background fill.** It is ink. Frames, rules, placards, gauge fill —
  nothing else.
- ✗ **Do not add border-radius** to plates. Square corners are what make it a mounted print
  rather than a card.
- ✗ **Do not animate the branch lines drawing themselves.** Opacity only.
- ✗ **Do not put Barlow Condensed in a sentence.** Labels only, uppercase only, 11–12px only.
- ✗ **Do not exceed 52ch** on body prose, even when the viewport allows it.
- ✗ **Do not introduce a second accent colour.** Cool blue-grey and rust are semantic markers for
  lineage status, not decoration — they never appear outside the branch diagrams and subtitles.
- ✗ **Do not add numbering or eyebrows** to anything that isn't genuinely a sequence. Roman plate
  numbers earn their place because the timeline is ordered; a "01 / 02 / 03" on a feature list
  would not.

---

*Museum Editorial v1.0 · One Unbroken Line · Newsreader / Barlow Condensed*
