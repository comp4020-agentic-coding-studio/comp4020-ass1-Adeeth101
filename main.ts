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
import { INTERLUDES } from "./src/data/interludes";
import { clashesWithNote, reservedBand } from "./src/spacer-layout";
import { FIGURE_PLATES } from "./src/data/figure-plates";
import { FIGURE_SOURCES } from "./src/data/figures";
import {
  extinctionChartSvg,
  extinctionGlyphSvg,
  oxygenChartSvg,
  oxygenGlyphSvg,
} from "./src/figure-svg";
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
  spacer.style.setProperty("--gap", `${heightVh.toFixed(2)}vh`);

  // Only the long deep-time spacers get these; the modern gaps are too short
  // to clear the threshold, so they come back empty on their own.
  //
  // aria-hidden moved from the spacer onto the marks themselves. It used to sit
  // on the whole spacer, to keep ten redundant date announcements out of the
  // reading order — but aria-hidden hides everything beneath it, and the
  // interludes below are real prose that a screen-reader user needs. The marks
  // stay hidden; the notes are now read.
  for (const { offsetVh, ageMa } of markersFor(heightVh, AGES[index], AGES[index + 1])) {
    const mark = document.createElement("p");
    mark.className = "spacer-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.style.setProperty("--at", `${offsetVh.toFixed(2)}vh`);
    mark.textContent = `${eraFor(ageMa)} · ${formatAge(ageMa)} ago`;
    spacer.append(mark);
  }

  // What was happening across the emptiness, and why it left no trace. The
  // spacer's own length is the argument — this is here so that length does not
  // read as "nothing happened", which is both false and the opposite of the
  // point. See src/data/interludes.ts.
  for (const note of INTERLUDES.filter((n) => n.after === index)) {
    const aside = document.createElement("aside");
    aside.className = "spacer-note";
    aside.style.setProperty("--at", `${(note.at * heightVh).toFixed(2)}vh`);

    const body = document.createElement("p");
    body.className = "spacer-note-text";
    body.textContent = note.text;

    const cite = document.createElement("p");
    cite.className = "spacer-note-source";
    cite.textContent = note.source;

    aside.append(body, cite);
    spacer.append(aside);
  }

  // Chart plates sit in the empty stretches too, at the fraction that puts them
  // at the date they depict. Absolutely positioned like the interludes, so an
  // 823px expansion opens into page that is already blank instead of shoving
  // the next node down the screen.
  for (const figure of FIGURE_PLATES.filter((f) => f.after === index)) {
    const holder = document.createElement("div");
    holder.className = "spacer-figure";
    holder.style.setProperty("--at", `${(figure.at * heightVh).toFixed(2)}vh`);
    holder.append(figurePlateElement(figure));
    spacer.append(holder);
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

// Declared up here with the other module state, not next to the function that
// uses it. `let` bindings are not hoisted the way function declarations are, so
// with this sitting beside scheduleAnchorRecompute further down the file, the
// first renderCurrent(false) -- which runs well before that point and calls
// into every plate's applyDetail -- hit it in the temporal dead zone and threw.
// That ReferenceError killed the rest of module evaluation silently: the plates
// were already rendered, so the page looked fine while the scroll listener, the
// anchor setup and the spacer reflow had all simply never been attached.
let anchorFrame: number | undefined;

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

    // The frame sequence and the still are ALTERNATIVES, not layers. CSS
    // renders exactly one of them: the sequence when motion is allowed, the
    // still under prefers-reduced-motion. They were stacked once, and both
    // drew at the same time and screen-blended into each other.
    //
    // Because only one is in the document at a time, whichever one that is has
    // to be the described image — hiding the still with display:none takes it
    // out of the accessibility tree along with its alt text. So the sequence's
    // img carries the same alt and the container is not aria-hidden. That is
    // still one described image per plate, which is what CLAUDE.md's media rule
    // is protecting: 52 frames must not become 52 alt texts, and here they are
    // one <img> whose src changes.
    const sequence = FRAME_SEQUENCES[node.id];
    if (sequence !== undefined) {
      const frameImg = document.createElement("img");
      frameImg.className = "plate-frames-img";
      frameImg.decoding = "async";
      frameImg.alt = image.alt;
      frameImg.width = 512;
      frameImg.height = 512;

      const frames = document.createElement("div");
      frames.className = "plate-frames";
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
    const next = String(
      plateExpanded({ isCurrent: plate.classList.contains("plate-on"), ...hoverFocus }),
    );
    if (detail.dataset.expanded === next) return;
    detail.dataset.expanded = next;
    scheduleAnchorRecompute();
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

// A chart plate. Deliberately built from the same parts as a lineage plate —
// same frame, same collapse, same source line — because it is making the same
// kind of claim and should be read with the same scepticism. It is NOT a
// lineage node: it carries no plate number, does not enter `plates` or `rows`,
// and the depth gauge still counts only ancestors. See src/data/figure-plates.ts.
function figurePlateElement(figure: (typeof FIGURE_PLATES)[number]): HTMLElement {
  const standfirst = document.createElement("p");
  standfirst.className = "plate-num";
  standfirst.textContent = figure.standfirst;

  const title = document.createElement("h2");
  title.className = "plate-title";
  title.textContent = figure.title;

  const chart = document.createElement("div");
  chart.className = "plate-chart";
  chart.innerHTML = figure.sourceKey === "oxygen" ? oxygenChartSvg() : extinctionChartSvg();

  // Outside the collapse deliberately: this is the key to the marks, and the
  // detail below it is closed until the reader asks for it.
  const legend = document.createElement("ul");
  legend.className = "chart-legend";
  for (const entry of figure.legend ?? []) {
    const item = document.createElement("li");
    const swatch = document.createElement("span");
    swatch.className = `chart-legend-mark is-${entry.mark}`;
    swatch.setAttribute("aria-hidden", "true");
    item.append(swatch, entry.text);
    legend.append(item);
  }

  const body = document.createElement("div");
  body.className = "plate-body";
  for (const paragraph of figure.body) {
    const p = document.createElement("p");
    p.textContent = paragraph;
    body.append(p);
  }

  const cap = document.createElement("div");
  cap.className = "plate-cap";
  const capLabel = document.createElement("p");
  capLabel.className = "plate-cap-label";
  capLabel.textContent = "Source";
  const capText = document.createElement("p");
  capText.className = "plate-cap-text";
  capText.textContent = FIGURE_SOURCES[figure.sourceKey];
  cap.append(capLabel, capText);

  const detailIn = document.createElement("div");
  detailIn.className = "plate-detail-in";
  detailIn.append(chart);
  if (legend.childElementCount > 0) detailIn.append(legend);
  detailIn.append(body, cap);

  const detail = document.createElement("div");
  detail.className = "plate-detail";
  detail.dataset.expanded = "false";
  detail.append(detailIn);

  // Shut, a chart plate is its title and a miniature of its own data. The
  // glyph collapses on exactly the same mechanism as the detail, just
  // inverted, so the two cross-fade instead of one snapping out while the
  // other eases in.
  const glyphIn = document.createElement("div");
  glyphIn.className = "plate-detail-in";
  glyphIn.innerHTML = figure.sourceKey === "oxygen" ? oxygenGlyphSvg() : extinctionGlyphSvg();

  const glyph = document.createElement("div");
  glyph.className = "chart-glyph";
  glyph.append(glyphIn);

  const text = document.createElement("div");
  text.className = "plate-text";
  text.append(standfirst, title, glyph, detail);

  const plateIn = document.createElement("div");
  plateIn.className = "plate-in";
  plateIn.append(text);

  const frame = document.createElement("div");
  frame.className = "plate-frame";

  const plate = document.createElement("section");
  plate.className = "plate plate-figure-card";
  plate.id = figure.id;
  plate.dataset.expanded = "false";
  plate.tabIndex = -1;
  plate.append(frame, plateIn);

  // Same rule as a lineage plate, minus `current`: a chart plate is never the
  // current node, because it is not a node. Hover or focus opens it.
  const hoverFocus = { isCurrent: false, isHovered: false, isFocused: false };
  const apply = (): void => {
    const next = String(plateExpanded(hoverFocus));
    if (detail.dataset.expanded === next) return;
    detail.dataset.expanded = next;
    plate.dataset.expanded = next;
    scheduleAnchorRecompute();
  };
  plate.addEventListener("pointerenter", () => {
    hoverFocus.isHovered = true;
    apply();
  });
  plate.addEventListener("pointerleave", () => {
    hoverFocus.isHovered = false;
    apply();
  });
  plate.addEventListener("focusin", () => {
    hoverFocus.isFocused = true;
    apply();
  });
  plate.addEventListener("focusout", () => {
    hoverFocus.isFocused = false;
    apply();
  });

  return plate;
}

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

// The same recompute, but not waiting for a transition to end — because under
// prefers-reduced-motion there is no transition, so no transitionend, and the
// listener above never runs. Coalesced through one animation frame so a burst
// of state changes (28 plates re-evaluated on every current-node change) costs
// one layout read rather than 28.
function scheduleAnchorRecompute(): void {
  if (anchorFrame !== undefined) return;
  anchorFrame = requestAnimationFrame(() => {
    anchorFrame = undefined;
    reflowSpacerMarks();
    recomputeAnchors();
    updateGauge();
  });
}

// Date markers and interludes are both absolutely positioned into the same
// spacer, at offsets from two unrelated sources, and nothing stopped one
// landing on top of the other -- which is what happened at 701 Ma in the
// Proterozoic gap.
//
// Each note reserves a band the height of its own rendered box plus clearance,
// and any marker inside that band is not placed. The height is measured rather
// than assumed, because the same paragraph wraps to far more lines in a 390px
// column than in a 940px one, and because a fixed guess would be tuned to one
// spacer's marker cadence when there are eleven different ones.
function reflowSpacerMarks(): void {
  const vh = window.innerHeight;
  if (vh <= 0) return;
  for (const spacer of lineageEl.querySelectorAll<HTMLElement>(".node-spacer")) {
    // Charts reserve space on exactly the same terms as interludes — they are
    // blocks of content dropped into an empty stretch, and a date marker
    // printed across one is as wrong in either case. A chart's band is measured
    // from its current height, so it grows when the chart is expanded and the
    // markers under it drop out; scheduleAnchorRecompute re-runs this whenever
    // any collapse changes.
    const blocks = spacer.querySelectorAll<HTMLElement>(".spacer-note, .spacer-figure");
    if (blocks.length === 0) continue;
    const bands = [...blocks].map((block) =>
      reservedBand(
        Number.parseFloat(block.style.getPropertyValue("--at")),
        (block.offsetHeight / vh) * 100,
      ),
    );
    for (const mark of spacer.querySelectorAll<HTMLElement>(".spacer-mark")) {
      const at = Number.parseFloat(mark.style.getPropertyValue("--at"));
      mark.classList.toggle("is-crowded", clashesWithNote(at, bands));
    }
  }
}

recomputeAnchors();
reflowSpacerMarks();
window.addEventListener("resize", () => {
  reflowSpacerMarks();
  recomputeAnchors();
});

// Blocks settle later than the first reflow can see. A chart plate's height is
// not final until its SVG has laid out, which is after the initial pass and
// after document.fonts.ready — so the first run measured a chart shorter than
// it ended up and left a date marker printed across it. Rather than guessing at
// a timing, watch the blocks: any height change at all re-runs the reflow, which
// covers webfonts, SVG layout, expansion and resize with one mechanism.
//
// This cannot feed back on itself: the reflow only toggles markers, and markers
// are absolutely positioned, so nothing it does can change a block's height.
if ("ResizeObserver" in window) {
  // The reflow runs synchronously here rather than being deferred to the next
  // animation frame. ResizeObserver already fires after layout, so the
  // measurements are good immediately — and requestAnimationFrame does not run
  // at all while a tab is hidden, which would leave a marker printed across an
  // expanded chart until the tab came back. Anchors still coalesce through a
  // frame, since those are read-only and cost more.
  const blockObserver = new ResizeObserver(() => {
    reflowSpacerMarks();
    scheduleAnchorRecompute();
  });
  for (const block of lineageEl.querySelectorAll(".spacer-note, .spacer-figure")) {
    blockObserver.observe(block);
  }
}

// Webfonts change how the prose wraps, which changes every note's height, which
// moves every reserved band. Without this the bands are measured against the
// fallback font and are wrong by a line or two once Newsreader lands.
if ("fonts" in document) {
  void document.fonts.ready.then(() => {
    reflowSpacerMarks();
    recomputeAnchors();
  });
}

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
