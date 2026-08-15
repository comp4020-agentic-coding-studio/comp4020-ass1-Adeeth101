// Renders the 28-node lineage from src/data/lineage.ts and wires it to the
// state machine in src/lineage-state.ts. Two drivers update that state —
// a scroll driver (IntersectionObserver) and a keyboard driver — per
// docs/DESIGN.md §1–3. Neither driver contains a rule about what a valid
// move is; that logic lives entirely in createLineage.

import { LINEAGE, type LineageNode } from "./src/data/lineage";
import { createLineage } from "./src/lineage-state";

function required<T>(value: T | null, selector: string): T {
  if (value === null) {
    throw new Error(`Expected ${selector} to exist in index.html`);
  }
  return value;
}

const lineageEl = required(document.querySelector<HTMLElement>("#lineage"), "#lineage");
const gaugeEl = required(document.querySelector<HTMLElement>("#depth-gauge"), "#depth-gauge");
const chapterLinksEl = required(
  document.querySelector<HTMLOListElement>("#chapter-links"),
  "#chapter-links",
);

const state = createLineage(LINEAGE.map((node) => ({ id: node.id })));

// Adaptive learning-mode pacing (docs/DESIGN.md §4): a node's section height
// is a hand-set weight, not real elapsed time — nodes with more to say (a
// branch, a "still with you" receipt) get more scroll distance, which reads
// as "slower" purely through layout. This is why adaptive pacing needs no
// custom scroll physics (docs/DESIGN.md §2).
function weightFor(node: LineageNode): number {
  let weight = 1;
  if (node.branch.trim() !== "") weight += 0.4;
  if (node.stillWithYou) weight += 0.9;
  return weight;
}

function formatAge(ageMa: number): string {
  if (ageMa >= 1000) {
    const ga = ageMa / 1000;
    return `${ga >= 10 ? Math.round(ga) : ga.toFixed(1)} billion years`;
  }
  if (ageMa >= 1) {
    return `${ageMa >= 10 ? Math.round(ageMa) : ageMa.toFixed(1)} million years`;
  }
  return `${Math.round(ageMa * 1000)} thousand years`;
}

const sections: HTMLElement[] = [];

for (const [index, node] of LINEAGE.entries()) {
  const section = document.createElement("section");
  section.id = `node-${node.id}`;
  section.className = "node";
  section.tabIndex = index === 0 ? 0 : -1;
  section.dataset.index = String(index);
  section.style.setProperty("--weight", String(weightFor(node)));

  const heading = document.createElement("h2");
  heading.textContent = node.name;
  section.append(heading);

  const age = document.createElement("p");
  age.className = "node-age";
  age.textContent = node.age > 0 ? `~${formatAge(node.age)} ago` : "now";
  section.append(age);

  if (node.branch.trim() !== "") {
    const branch = document.createElement("p");
    branch.className = "node-branch";
    branch.innerHTML = `<strong>Leaving here, your cousins:</strong> ${node.branch}`;
    section.append(branch);
  }

  if (node.gained.trim() !== "") {
    const gained = document.createElement("p");
    gained.className = "node-gained";
    gained.innerHTML = `<strong>What changed in you:</strong> ${node.gained}`;
    section.append(gained);
  }

  if (node.stillWithYou) {
    const still = document.createElement("p");
    still.className = "node-still";
    still.innerHTML = `<strong>Still with you:</strong> ${node.stillWithYou}`;
    section.append(still);
  }

  if (node.source) {
    const source = document.createElement("p");
    source.className = "node-source";
    source.textContent = `Source: ${node.source}`;
    section.append(source);
  }

  lineageEl.append(section);
  sections.push(section);

  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#${section.id}`;
  link.textContent = node.name;
  li.append(link);
  chapterLinksEl.append(li);
}

function renderCurrent(shouldFocus: boolean): void {
  const index = state.getCurrentIndex();
  for (const [i, section] of sections.entries()) {
    const isCurrent = i === index;
    section.tabIndex = isCurrent ? 0 : -1;
    if (isCurrent) {
      section.setAttribute("data-current", "true");
      section.setAttribute("aria-current", "true");
    } else {
      section.removeAttribute("data-current");
      section.removeAttribute("aria-current");
    }
  }
  const node = LINEAGE[index];
  const ageText = node.age > 0 ? `~${formatAge(node.age)} ago` : "now";
  gaugeEl.textContent = `Node ${index + 1} of ${LINEAGE.length}. ${node.name}, ${ageText}.`;
  if (shouldFocus) {
    sections[index].focus({ preventScroll: true });
  }
}

renderCurrent(false);

// Scroll driver: the most-visible section becomes current. Never focuses —
// per docs/DESIGN.md §3, focus follows current only on keyboard-initiated
// moves, so a mouse/trackpad scroller never gets a surprise focus jump.
const visibility = new Map<number, number>();
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const index = Number((entry.target as HTMLElement).dataset.index);
      visibility.set(index, entry.intersectionRatio);
    }
    let bestIndex = state.getCurrentIndex();
    let bestRatio = 0;
    for (const [index, ratio] of visibility) {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = index;
      }
    }
    if (bestRatio > 0.4 && bestIndex !== state.getCurrentIndex()) {
      state.goTo(bestIndex);
      renderCurrent(false);
    }
  },
  { threshold: [0, 0.25, 0.4, 0.5, 0.75, 1] },
);
for (const section of sections) observer.observe(section);

// Keyboard driver: never intercepts a typing target or the chapter-jump
// disclosure, so Tab and the nav's own links behave normally. Does call
// preventDefault on the handled keys — this replaces the browser's small
// native arrow-key scroll increment with a deliberate jump to the next/
// previous section, rather than letting both fire and fight each other.
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
  sections[state.getCurrentIndex()].scrollIntoView({
    behavior: reducedMotion() ? "auto" : "smooth",
    block: "start",
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
      moveTo(() => state.goTo(sections.length - 1));
      break;
    default:
      break;
  }
});
