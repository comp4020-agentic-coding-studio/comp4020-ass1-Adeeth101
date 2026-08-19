// Renders the 28-node lineage from src/data/lineage.ts and wires it to the
// state machine in src/lineage-state.ts. Two drivers update that state —
// a scroll driver (IntersectionObserver) and a keyboard driver — per
// docs/DESIGN.md §1–3. Neither driver contains a rule about what a valid
// move is; that logic lives entirely in createLineage.
//
// Visual layer follows MUSEUM-EDITORIAL-SPEC.md: each node renders as a
// "plate" (§05) beside a branch-line diagram (§07), tracked by a depth
// gauge (§06). Formatting-only pure helpers live in src/plate-format.ts.

import { LINEAGE, type LineageNode } from "./src/data/lineage";
import { createLineage } from "./src/lineage-state";
import { backgroundCssAt } from "./src/era-palette";
import { markersFor, spacerHeightsVh } from "./src/pacing";
import { eraFor, formatAge, plateFacts, romanNumeral } from "./src/plate-format";
import { DISPLAY_SIZES, plateImage, type PlateImageSource } from "./src/plate-image";
import { plateExpanded } from "./src/plate-detail";
import {
  FRAME_SEQUENCES,
  frameFileStem,
  frameIndexAt,
  runwayProgress,
  RUNWAY_STICKY_VH,
  RUNWAY_VH,
} from "./src/plate-frames";

// Assets are discovered by filename, not listed in code: images/plates/<node
// id>-<width>.<ext>, or <node id>.<ext> for a single-variant file. Dropping
// tetrapoda-512.webp and tetrapoda-1024.webp into that folder wires up the
// Tetrapoda plate with no edit here, and a node with no file renders no image
// slot at all. That is the point — media is landing after the page was built,
// and CLAUDE.md is explicit that late media must never block the build.
//
// Bundled through Vite rather than referenced as a bare path, so every URL is
// hashed and rewritten relative to the deploy base. A root-absolute path would
// look fine locally and 404 under /comp4020-ass1-Adeeth101/ — and because the
// bundler resolves these at build time, a missing file is a build-time absence
// rather than a runtime 404 with a broken-image icon in the plate.
const PLATE_ASSET_MODULES = import.meta.glob<string>("./images/plates/*.{webp,png,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

// Frame sequences live under images/frames/<node id>/f###-<width>.webp and are
// globbed separately from the stills, so a sequence can never be mistaken for a
// plate's still by the <node id>-<width> parser above.
const FRAME_ASSET_MODULES = import.meta.glob<string>("./images/frames/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const FRAME_ASSETS = new Map<string, string>(
  Object.entries(FRAME_ASSET_MODULES).map(([path, url]) => {
    const parts = path.split("/");
    return [`${parts[parts.length - 2]}/${parts[parts.length - 1].replace(".webp", "")}`, url];
  }),
);

const PLATE_ASSETS = new Map<string, PlateImageSource[]>();
for (const [path, url] of Object.entries(PLATE_ASSET_MODULES)) {
  const dot = path.lastIndexOf(".");
  const stem = path.slice(path.lastIndexOf("/") + 1, dot);

  // Matched off the end so node ids containing a hyphen survive: "homo-sapiens-1024"
  // is homo-sapiens at 1024, and a bare "homo-sapiens" is one variant of unknown
  // width. Only a trailing "-<digits>" is ever read as a width.
  const suffix = /-(\d+)$/.exec(stem);
  const id = suffix === null ? stem : stem.slice(0, -suffix[0].length);

  const sources = PLATE_ASSETS.get(id) ?? [];
  sources.push({ url, width: suffix === null ? 0 : Number(suffix[1]), format: path.slice(dot + 1) });
  PLATE_ASSETS.set(id, sources);
}

function required<T>(value: T | null, selector: string): T {
  if (value === null) {
    throw new Error(`Expected ${selector} to exist in index.html`);
  }
  return value;
}

const lineageEl = required(document.querySelector<HTMLElement>("#lineage"), "#lineage");
const chapterLinksEl = required(
  document.querySelector<HTMLOListElement>("#chapter-links"),
  "#chapter-links",
);
const announcerEl = required(document.querySelector<HTMLElement>("#plate-announcer"), "#plate-announcer");
const gaugeFillEl = required(document.querySelector<HTMLElement>("#gauge-fill"), "#gauge-fill");
const gaugeTickEl = required(document.querySelector<HTMLElement>("#gauge-tick"), "#gauge-tick");
const gaugePlateNumEl = required(document.querySelector<HTMLElement>("#gauge-plate-num"), "#gauge-plate-num");
const gaugeTotalEl = required(document.querySelector<HTMLElement>("#gauge-total"), "#gauge-total");
const gaugeEraEl = required(document.querySelector<HTMLElement>("#gauge-era"), "#gauge-era");
const gaugeDateEl = required(document.querySelector<HTMLElement>("#gauge-date"), "#gauge-date");

const state = createLineage(LINEAGE.map((node) => ({ id: node.id })));

// Time-scaled pacing (docs/DESIGN.md §4): plates render at their natural
// height and the elapsed time to the next node becomes a separate spacer
// element after each one, sized by the pure module in src/pacing.ts. Keeping
// the gap out of the plate is what makes plate size and gap size
// independently tunable — no pacing change can resize a plate.
//
// Layout is the only thing this affects: which node is current still comes
// entirely from src/lineage-state.ts, so this needs no custom scroll physics
// (docs/DESIGN.md §2).
const AGES = LINEAGE.map((node) => node.age);
const SPACER_HEIGHTS_VH = spacerHeightsVh(AGES);

// Only one cousin branch in this dataset is genuinely extinct — every other
// non-empty `branch` field (see src/data/lineage.ts) describes a lineage
// that is alive today, just not yours. Checked against the data directly
// rather than guessed, per this repo's science-accuracy rule.
const TERMINATED_BRANCHES = new Set<string>(["homo-sapiens"]);

// The trunk (spec §07) is ONE element for the whole page, not one per node.
// Per-row trunks stopped at every plate and restarted at the next, which
// left the line absent across each spacer — eleven screens of nothing in
// LUCA's case, on a page called "One Unbroken Line". Drawing it once behind
// everything also lets the spec's 3px → 1.5px taper run the full lineage
// instead of resetting 28 times.
//
// Still a filled path rather than a stroke, per §07. viewBox units are 1:1
// with px horizontally (4 units across a 4px-wide box) so the taper lands on
// the spec's exact widths; preserveAspectRatio="none" stretches only y.
function trunkElement(): HTMLElement {
  const trunk = document.createElement("div");
  trunk.className = "trunk";
  trunk.setAttribute("aria-hidden", "true");
  trunk.innerHTML =
    '<svg viewBox="0 0 4 100" preserveAspectRatio="none">' +
    '<path d="M0.6 0 L3.4 0 L2.75 100 L1.25 100 Z" fill="var(--brass)" fill-opacity="0.62" />' +
    "</svg>";
  return trunk;
}

// Per-node branch marks (spec §07): the junction dot and, where a cousin
// lineage leaves, the drooping curve and its termination / survivor dot. The
// trunk itself is no longer drawn here — these sit ON the page-level trunk,
// which is why the junction stays at x=24 of a 96-unit viewBox: that is 25%
// of the gutter, and .trunk is positioned at the same 25%.
//
// Kept deliberately text-free — the gutter is too narrow for legible labels
// at the type scale in §03, so the meaning is carried by the aria-label.
function branchSvgMarkup(node: LineageNode): string {
  const junction = '<circle cx="24" cy="120" r="4" fill="var(--brass)" />';
  if (node.branch.trim() === "") {
    return junction;
  }
  // Non-scaling strokes: the viewBox is stretched hard on the vertical axis
  // (and harder still on a narrow gutter), which would otherwise smear a
  // 1px stroke into an ellipse-weighted line.
  const curve =
    '<path d="M24 90 Q58 96 78 60" fill="none" stroke="var(--brass)" stroke-opacity="0.4" stroke-width="1" vector-effect="non-scaling-stroke" />';
  const dot = TERMINATED_BRANCHES.has(node.id)
    ? '<circle cx="78" cy="60" r="2.8" fill="none" stroke="var(--rust)" stroke-width="1" vector-effect="non-scaling-stroke" />' +
      '<line x1="76.1" y1="58.1" x2="79.9" y2="61.9" stroke="var(--rust)" stroke-width="1" vector-effect="non-scaling-stroke" />'
    : '<circle cx="78" cy="60" r="2.8" fill="var(--cool)" fill-opacity="0.7" />';
  return `${curve}${dot}${junction}`;
}

function branchSvgLabel(node: LineageNode): string {
  if (node.branch.trim() === "") {
    return "Branch diagram: your lineage continues here, unbranched.";
  }
  const fate = TERMINATED_BRANCHES.has(node.id)
    ? "did not survive to today"
    : "continues today as a separate lineage, not yours";
  return `Branch diagram: your lineage continues; a cousin branch splits off here and ${fate}.`;
}

// The elapsed time between one plate and the next, as empty scroll distance.
// Returns null after the last node, which has nothing to be distant from.
//
// Marked aria-hidden: a spacer carries no information a screen reader
// doesn't already get from the depth gauge, and LUCA's alone would otherwise
// interrupt the reading order with ten redundant date announcements.
function spacerAfter(index: number): HTMLElement | null {
  const heightVh = SPACER_HEIGHTS_VH[index];
  if (heightVh === undefined) return null;

  const spacer = document.createElement("div");
  spacer.className = "node-spacer";
  spacer.setAttribute("aria-hidden", "true");
  spacer.style.setProperty("--gap", `${heightVh.toFixed(2)}vh`);

  // Only the long deep-time spacers get these; the modern gaps are too short
  // to clear the threshold, so they come back empty on their own.
  for (const { offsetVh, ageMa } of markersFor(heightVh, AGES[index], AGES[index + 1])) {
    const mark = document.createElement("p");
    mark.className = "spacer-mark";
    mark.style.setProperty("--at", `${offsetVh.toFixed(2)}vh`);
    mark.textContent = `${eraFor(ageMa)} · ${formatAge(ageMa)} ago`;
    spacer.append(mark);
  }
  return spacer;
}

// First child, so it paints behind every row that follows it in DOM order.
lineageEl.append(trunkElement());

const plates: HTMLElement[] = [];
const rows: HTMLElement[] = [];
const diagrams: HTMLElement[] = [];
const applyDetails: Array<() => void> = [];

interface MountedSequence {
  // The runway is what stays put while the row pins to it, so it is the
  // element whose rect gives scroll progress. The row is only needed for its
  // height, which sets where the pin ends.
  runway: HTMLElement | null;
  row: HTMLElement | null;
  frames: HTMLElement;
  img: HTMLImageElement;
  id: string;
  count: number;
  shown?: number;
}
const sequences: MountedSequence[] = [];

for (const [index, node] of LINEAGE.entries()) {
  const num = document.createElement("p");
  num.className = "plate-num";
  num.textContent = `Plate ${romanNumeral(index + 1)} · ${node.age > 0 ? `~${formatAge(node.age)} ago` : "Now"}`;

  const title = document.createElement("h2");
  title.className = "plate-title";
  title.textContent = node.name;

  const body = document.createElement("div");
  body.className = "plate-body";
  // Which rows exist is decided by plateFacts, not here — see its comment in
  // src/plate-format.ts and the contract in spec/plate-format.test.ts. A node
  // with no defensible trait renders no heading at all, rather than a bold
  // label standing above nothing.
  for (const fact of plateFacts(node)) {
    const row = document.createElement("p");
    const label = document.createElement("strong");
    label.textContent = `${fact.label}:`;
    row.append(label, ` ${fact.text}`);
    body.append(row);
  }

  const cap = document.createElement("div");
  cap.className = "plate-cap";
  const capLabel = document.createElement("p");
  capLabel.className = "plate-cap-label";
  capLabel.textContent = "Source";
  const capText = document.createElement("p");
  capText.className = "plate-cap-text";
  capText.textContent = node.source;
  cap.append(capLabel, capText);

  // Everything that is an argument rather than an identity goes inside the
  // collapsible wrapper: the cousins, the traits, the source. The number, the
  // name and the age stay out of it, because those are what a collapsed plate
  // still has to be able to say. See src/plate-detail.ts.
  const detailIn = document.createElement("div");
  detailIn.className = "plate-detail-in";
  if (node.branch.trim() !== "") {
    const sub = document.createElement("p");
    sub.className = "plate-sub";
    sub.textContent = `Leaving here, your cousins: ${node.branch}`;
    detailIn.append(sub);
  }
  detailIn.append(body, cap);

  const detail = document.createElement("div");
  detail.className = "plate-detail";
  detail.dataset.expanded = "false";
  detail.append(detailIn);

  const text = document.createElement("div");
  text.className = "plate-text";
  text.append(num, title, detail);

  const plateIn = document.createElement("div");
  plateIn.className = "plate-in";
  plateIn.append(text);

  // The figure is appended after the text, so DOM order and reading order agree
  // at both viewports: the placard is read first, and the image column is
  // placed to its right by grid on desktop rather than by reordering. When
  // there is no asset, nothing is appended and .plate-in never gets the
  // two-column template — the plate closes up instead of leaving a hole.
  // A plate with a frame sequence takes its still from the sequence's first
  // frame rather than from images/plates. Two reasons, both correctness rather
  // than tidiness: that frame is what the reader actually sees before scrolling
  // and under prefers-reduced-motion, so it is the honest thing to describe;
  // and it is a real generated image, so plateImage gives it the node's
  // evidence tag. Left as-is, Homo would have shown an AI-generated morph under
  // a caption reading "Illustration · not a reconstruction", inherited from the
  // schematic stand-in it used to have.
  // The LAST frame, not the first. This plate is about what the animal became:
  // frame one of the tetrapod sequence is a lobe-finned fish, and shipping it
  // put that fish on the plate titled "The first tetrapod". It is also the only
  // thing a reader with prefers-reduced-motion ever sees, because CSS removes
  // the sequence for them — so the still has to be the outcome, not the start.
  const sequenceForStill = FRAME_SEQUENCES[node.id];
  const stillFrame =
    sequenceForStill === undefined ? null : frameFileStem(sequenceForStill.frames - 1);
  const stillSources: PlateImageSource[] =
    stillFrame === null
      ? (PLATE_ASSETS.get(node.id) ?? [])
      : [256, 512].flatMap((width) => {
          const url = FRAME_ASSETS.get(`${node.id}/${stillFrame}-${width}`);
          return url === undefined ? [] : [{ url, width, format: "webp" }];
        });

  const image = plateImage(node, index, stillSources);
  if (image !== null) {
    const img = document.createElement("img");
    img.className = "plate-figure-img";
    img.src = image.src;
    if (image.srcset !== null) img.srcset = image.srcset;
    if (image.sizes !== null) img.sizes = image.sizes;
    img.alt = image.alt;
    img.loading = image.loading;
    img.decoding = "async";
    img.width = 512;
    img.height = 512;

    // Per docs/IMAGE-STYLE.md §07: the per-image tag does double duty as the
    // bucket distinction, and the footer carries the fuller disclosure.
    const tag = document.createElement("figcaption");
    tag.className = "plate-figure-tag";
    tag.textContent = image.tag;

    const figure = document.createElement("figure");
    figure.className = "plate-figure";
    figure.append(img, tag);

    // The frame sequence sits in this same slot, stacked over the still —
    // not full-bleed, not a background layer. It is decorative: aria-hidden,
    // so the plate keeps exactly one described image, the <img> above, with
    // the alt and evidence tag src/plate-image.ts already gave it. Under
    // prefers-reduced-motion CSS hides this container and the still shows
    // through, which is the required static fallback with no JS branch.
    const sequence = FRAME_SEQUENCES[node.id];
    if (sequence !== undefined) {
      const frameImg = document.createElement("img");
      frameImg.className = "plate-frames-img";
      frameImg.decoding = "async";
      frameImg.alt = "";
      frameImg.width = 512;
      frameImg.height = 512;

      const frames = document.createElement("div");
      frames.className = "plate-frames";
      frames.setAttribute("aria-hidden", "true");
      frames.append(frameImg);
      figure.insertBefore(frames, tag);

      sequences.push({
        runway: null,
        row: null,
        frames,
        img: frameImg,
        id: node.id,
        count: sequence.frames,
      });
    }

    plateIn.append(figure);
  }

  const frame = document.createElement("div");
  frame.className = "plate-frame";

  const plate = document.createElement("section");
  plate.className = "plate";
  plate.id = `node-${node.id}`;
  plate.tabIndex = index === 0 ? 0 : -1;
  plate.dataset.index = String(index);
  plate.append(frame, plateIn);

  const diagram = document.createElement("div");
  diagram.className = "node-diagram";
  diagram.innerHTML = `<svg viewBox="0 0 96 240" preserveAspectRatio="none" role="img" aria-label="${branchSvgLabel(node)}">${branchSvgMarkup(node)}</svg>`;

  const row = document.createElement("div");
  row.className = "node-row";
  row.append(plate, diagram);

  // Hover and focus are tracked as state rather than left to CSS, so that
  // plateExpanded stays the single rule and the transition has one attribute
  // to fire on. focusin/focusout rather than focus/blur: they bubble, so a
  // focus landing anywhere inside the plate counts.
  const hoverFocus = { isHovered: false, isFocused: false };
  const applyDetail = (): void => {
    detail.dataset.expanded = String(
      plateExpanded({ isCurrent: plate.classList.contains("plate-on"), ...hoverFocus }),
    );
  };
  plate.addEventListener("pointerenter", () => {
    hoverFocus.isHovered = true;
    applyDetail();
  });
  plate.addEventListener("pointerleave", () => {
    hoverFocus.isHovered = false;
    applyDetail();
  });
  plate.addEventListener("focusin", () => {
    hoverFocus.isFocused = true;
    applyDetail();
  });
  plate.addEventListener("focusout", () => {
    hoverFocus.isFocused = false;
    applyDetail();
  });
  applyDetails.push(applyDetail);

  // A plate carrying a frame sequence gets a scroll runway: the row pins while
  // the reader scrolls through it, which is what gives the morph room to read
  // as motion. Without it the sequence was driven by the row's own traverse of
  // the viewport — 1,016px on a 73,000px page, one frame every 20px, over
  // before it registered. The runway wraps the row rather than restyling it, so
  // the plate's own layout and the branch diagram beside it are untouched.
  let outer: HTMLElement = row;
  if (FRAME_SEQUENCES[node.id] !== undefined) {
    const runway = document.createElement("div");
    runway.className = "node-runway";
    runway.append(row);
    outer = runway;
    for (const seq of sequences) {
      if (seq.runway === null && seq.id === node.id) {
        seq.runway = runway;
        seq.row = row;
      }
    }
  }

  lineageEl.append(outer);
  const spacer = spacerAfter(index);
  if (spacer !== null) lineageEl.append(spacer);
  plates.push(plate);
  rows.push(outer);
  diagrams.push(diagram);

  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#${plate.id}`;
  link.textContent = node.name;
  li.append(link);
  chapterLinksEl.append(li);
}

gaugeTotalEl.textContent = romanNumeral(LINEAGE.length);

function renderCurrent(shouldFocus: boolean): void {
  const index = state.getCurrentIndex();
  for (const [i, plate] of plates.entries()) {
    const isCurrent = i === index;
    plate.tabIndex = isCurrent ? 0 : -1;
    plate.classList.toggle("plate-on", isCurrent);
    if (isCurrent) {
      plate.setAttribute("aria-current", "true");
    } else {
      plate.removeAttribute("aria-current");
    }
  }
  for (const applyDetail of applyDetails) applyDetail();
  const node = LINEAGE[index];
  const ageText = node.age > 0 ? `~${formatAge(node.age)} ago` : "now";
  gaugePlateNumEl.textContent = romanNumeral(index + 1);
  announcerEl.textContent = `Plate ${index + 1} of ${LINEAGE.length}. ${node.name}, ${ageText}.`;
  if (shouldFocus) {
    plates[index].focus({ preventScroll: true });
  }
}

renderCurrent(false);

// Scroll driver: the plate nearest the viewport's centre line becomes
// current (spec §05's activation trigger — a narrow central band via
// rootMargin, resolved to nearest-centre so exactly one plate is ever
// active). Never focuses — per docs/DESIGN.md §3, focus follows current
// only on keyboard-initiated moves, so a mouse/trackpad scroller never
// gets a surprise focus jump.
const intersecting = new Set<number>();
const activationObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const index = Number((entry.target as HTMLElement).dataset.index);
      if (entry.isIntersecting) {
        intersecting.add(index);
      } else {
        intersecting.delete(index);
      }
    }
    if (intersecting.size === 0) return;
    const viewportCenter = window.innerHeight / 2;
    let bestIndex = state.getCurrentIndex();
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const index of intersecting) {
      const rect = plates[index].getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    if (bestIndex !== state.getCurrentIndex()) {
      state.goTo(bestIndex);
      renderCurrent(false);
    }
  },
  { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
);
for (const plate of plates) activationObserver.observe(plate);

// Branch-line diagrams fade in by opacity only (spec §07/§08 — no draw-on,
// no dash animation) the first time each one is scrolled into view.
const diagramObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("node-diagram-visible");
        diagramObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.1 },
);
for (const diagram of diagrams) diagramObserver.observe(diagram);

// Depth gauge (spec §06): the track/tick/fill track scroll position
// directly via inline styles, with no CSS transition on those properties —
// a transition here would lag and read as broken. The date readout
// interpolates continuously between each row's centre anchor; the plate
// ordinal and era are the nearest discrete values, matching how the spec's
// own worked example ("Plate VII of XVI · Carboniferous") pairs a discrete
// ordinal with a continuously-updating absolute date.
let anchors: number[] = [];

// Document coordinates, via getBoundingClientRect rather than offsetTop.
// offsetTop is relative to the nearest positioned ancestor, so it silently
// changed meaning the moment #lineage gained `position: relative` to carry
// the trunk — every anchor shifted by the header's height while still being
// compared against window.scrollY, which is absolute. getBoundingClientRect
// + scrollY cannot drift that way whatever any ancestor's position is.
function recomputeAnchors(): void {
  anchors = rows.map((row) => {
    const rect = row.getBoundingClientRect();
    // Half the row's height, or half a viewport if the row is taller than one.
    // Identical to rect.height / 2 for every ordinary row, which are all far
    // shorter than the viewport — but a sequence plate's scroll runway is over
    // three viewports tall, and anchoring at ITS midpoint would put the node's
    // marker a viewport and a half below the plate the reader is looking at,
    // so the depth gauge would name the wrong era while the plate is pinned.
    const readable = Math.min(rect.height, window.innerHeight);
    return rect.top + window.scrollY + readable / 2;
  });
}
recomputeAnchors();
window.addEventListener("resize", recomputeAnchors);

// A collapsing plate changes its own height, which moves every anchor below it
// and would leave the depth gauge reporting an era the reader is no longer in.
// The listener is on #lineage rather than on each plate so it costs one
// registration, and it filters on the property because .plate-detail is not
// the only thing on the page that transitions.
lineageEl.addEventListener("transitionend", (event) => {
  if ((event as TransitionEvent).propertyName !== "grid-template-rows") return;
  recomputeAnchors();
  updateGauge();
});

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

let lastBackground = "";

function updateGauge(): void {
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  gaugeFillEl.style.width = `${(progress * 100).toFixed(2)}%`;
  gaugeTickEl.style.left = `${(progress * 100).toFixed(2)}%`;

  const y = window.scrollY + window.innerHeight / 2;
  let i = 0;
  while (i < anchors.length - 1 && y > anchors[i + 1]) i++;
  const j = Math.min(i + 1, LINEAGE.length - 1);
  const span = anchors[j] - anchors[i];
  const t = span > 0 ? Math.min(1, Math.max(0, (y - anchors[i]) / span)) : 0;
  const age = lerp(LINEAGE[i].age, LINEAGE[j].age, t);

  gaugeEraEl.textContent = eraFor(age);
  gaugeDateEl.textContent = age > 0 ? `${formatAge(age)} before present` : "Now";

  // The ground colour rides the same interpolated age as the date readout,
  // which is what makes it continuous across a spacer rather than stepping
  // at each plate. Written only when it actually changes — this runs on
  // every scroll event, and setting an identical custom property still costs
  // a style recalculation.
  const background = backgroundCssAt(age);
  if (background !== lastBackground) {
    lastBackground = background;
    document.documentElement.style.setProperty("--bg-now", background);
  }

  updateSequences();
}

// Rides updateGauge's scroll listener rather than registering its own: the
// page already has exactly one, and a second doing the same rect reads on the
// same events would be pure cost. spec/plate-frames.test.ts asserts the count
// stays at one.
function updateSequences(): void {
  const viewportHeight = window.innerHeight;
  const stickyOffset = (viewportHeight * RUNWAY_STICKY_VH) / 100;
  for (const seq of sequences) {
    if (seq.runway === null || seq.row === null) continue;
    const rect = seq.runway.getBoundingClientRect();
    // Off-screen by more than a viewport: nothing to show, and no reason to
    // fetch frames for a plate the reader may never reach.
    if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2) continue;

    const index = frameIndexAt(
      runwayProgress(rect.top, rect.height, seq.row.offsetHeight, stickyOffset),
      seq.count,
    );
    if (index === seq.shown) continue;
    seq.shown = index;

    const stem = frameFileStem(index);
    const small = FRAME_ASSETS.get(`${seq.id}/${stem}-256`);
    const large = FRAME_ASSETS.get(`${seq.id}/${stem}-512`);
    if (small === undefined || large === undefined) continue;
    seq.img.src = small;
    seq.img.srcset = `${small} 256w, ${large} 512w`;
    seq.img.sizes = DISPLAY_SIZES;
  }
}
window.addEventListener("scroll", updateGauge, { passive: true });
updateGauge();

// Fallback for the case time-scaled pacing created: a spacer can now be
// sixteen viewports tall, so across most of the page NO plate intersects the
// activation band and the IntersectionObserver has nothing to report. While
// you scroll continuously that is correct — the last plate you passed is
// still the one you're travelling from. But a jump that lands mid-spacer (a
// scrollbar drag, an in-page link, a restored scroll position on reload)
// leaves whatever was current before, and the gauge then contradicts itself:
// "Plate I · Ordovician · 448 million years", with the announcer telling a
// screen-reader user they are at LUCA while they are at jawed fish.
//
// Resolving to the nearest plate whenever nothing intersects keeps the
// ordinal, the announcer and the date telling one story. This is a driver
// fix: it goes through the state machine's existing goTo, so the "exactly
// one current, no skipping, all reachable" contract in src/lineage-state.ts
// is untouched and its tests still pass unmodified.
function resolveCurrentWhenNoPlateIntersects(): void {
  if (intersecting.size > 0) return;
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  let bestIndex = state.getCurrentIndex();
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const [index, anchor] of anchors.entries()) {
    const distance = Math.abs(anchor - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  if (bestIndex !== state.getCurrentIndex()) {
    state.goTo(bestIndex);
    renderCurrent(false);
  }
}
// Debounced to when scrolling settles, not fired on every scroll event.
// Running it live fought the keyboard driver: moveTo() sets the current node
// and then smooth-scrolls to it, and the fallback re-resolved on every frame
// of that animation, dragging `current` back to whatever the animation was
// passing over. Pressing Home from the bottom of the page left you on plate
// 28. Waiting for the scroll to settle removes the conflict entirely — by
// then the keyboard's target plate is centred, so the fallback agrees with
// it instead of overriding it.
//
// It also happens to be the more correct behaviour for reading: mid-spacer
// you are *between* plates, so the ordinal should stay on the one you last
// passed rather than flickering. The era and date readouts are what move
// continuously through a gap; the ordinal is a discrete position.
let settleTimer: number | undefined;
window.addEventListener(
  "scroll",
  () => {
    if (settleTimer !== undefined) clearTimeout(settleTimer);
    settleTimer = window.setTimeout(resolveCurrentWhenNoPlateIntersects, 150);
  },
  { passive: true },
);
resolveCurrentWhenNoPlateIntersects();

// Keyboard driver: never intercepts a typing target or the chapter-jump
// disclosure, so Tab and the nav's own links behave normally. Does call
// preventDefault on the handled keys — this replaces the browser's small
// native arrow-key scroll increment with a deliberate jump to the next/
// previous plate, rather than letting both fire and fight each other.
// This is a narrow, targeted override of six keys' default scroll amount,
// not scroll-jacking in the docs/DESIGN.md §2 sense (no wheel/touch
// interception, no reimplemented momentum) — Tab/Shift+Tab are untouched,
// so a keyboard user is never trapped.
function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.closest("#chapter-list") !== null;
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function moveTo(action: () => void): void {
  action();
  renderCurrent(true);
  plates[state.getCurrentIndex()].scrollIntoView({
    behavior: reducedMotion() ? "auto" : "smooth",
    block: "center",
  });
}

window.addEventListener("keydown", (event) => {
  if (isTypingTarget(document.activeElement)) return;

  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
    case "PageDown":
      event.preventDefault();
      moveTo(() => state.advance());
      break;
    case "ArrowUp":
    case "ArrowLeft":
    case "PageUp":
      event.preventDefault();
      moveTo(() => state.retreat());
      break;
    case "Home":
      event.preventDefault();
      moveTo(() => state.goTo(0));
      break;
    case "End":
      event.preventDefault();
      moveTo(() => state.goTo(plates.length - 1));
      break;
    default:
      break;
  }
});
