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
import { markersFor, spacerHeightsVh } from "./src/pacing";
import { eraFor, formatAge, romanNumeral } from "./src/plate-format";

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

// Branch-line diagram (spec §07): a filled tapered trunk plus the
// termination / survivor / your-junction dot vocabulary. Kept deliberately
// text-free — the 96px gutter is too narrow for legible labels at the
// type scale in §03, so the meaning is carried by the aria-label instead.
function branchSvgMarkup(node: LineageNode): string {
  const trunk =
    '<path d="M22.5 0 L25.5 0 L24.75 240 L23.25 240 Z" fill="var(--brass)" fill-opacity="0.62" />';
  const junction = '<circle cx="24" cy="120" r="4" fill="var(--brass)" />';
  if (node.branch.trim() === "") {
    return `${trunk}${junction}`;
  }
  const curve =
    '<path d="M24 90 Q58 96 78 60" fill="none" stroke="var(--brass)" stroke-opacity="0.4" stroke-width="1" />';
  const dot = TERMINATED_BRANCHES.has(node.id)
    ? '<circle cx="78" cy="60" r="2.8" fill="none" stroke="var(--rust)" stroke-width="1" />' +
      '<line x1="76.1" y1="58.1" x2="79.9" y2="61.9" stroke="var(--rust)" stroke-width="1" />'
    : '<circle cx="78" cy="60" r="2.8" fill="var(--cool)" fill-opacity="0.7" />';
  return `${trunk}${curve}${dot}${junction}`;
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

const plates: HTMLElement[] = [];
const rows: HTMLElement[] = [];
const diagrams: HTMLElement[] = [];

for (const [index, node] of LINEAGE.entries()) {
  const num = document.createElement("p");
  num.className = "plate-num";
  num.textContent = `Plate ${romanNumeral(index + 1)} · ${node.age > 0 ? `~${formatAge(node.age)} ago` : "Now"}`;

  const title = document.createElement("h2");
  title.className = "plate-title";
  title.textContent = node.name;

  const body = document.createElement("div");
  body.className = "plate-body";
  const gained = document.createElement("p");
  gained.innerHTML = `<strong>What changed in you:</strong> ${node.gained}`;
  body.append(gained);
  if (node.stillWithYou) {
    const still = document.createElement("p");
    still.innerHTML = `<strong>Still with you:</strong> ${node.stillWithYou}`;
    body.append(still);
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

  const plateIn = document.createElement("div");
  plateIn.className = "plate-in";
  plateIn.append(num, title);
  if (node.branch.trim() !== "") {
    const sub = document.createElement("p");
    sub.className = "plate-sub";
    sub.textContent = `Leaving here, your cousins: ${node.branch}`;
    plateIn.append(sub);
  }
  plateIn.append(body, cap);

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

  lineageEl.append(row);
  const spacer = spacerAfter(index);
  if (spacer !== null) lineageEl.append(spacer);
  plates.push(plate);
  rows.push(row);
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
function recomputeAnchors(): void {
  anchors = rows.map((row) => row.offsetTop + row.offsetHeight / 2);
}
recomputeAnchors();
window.addEventListener("resize", recomputeAnchors);

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

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
}
window.addEventListener("scroll", updateGauge, { passive: true });
updateGauge();

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
