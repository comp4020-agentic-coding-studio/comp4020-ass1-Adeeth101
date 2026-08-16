// Scroll pacing: how much empty vertical distance sits between one node and
// the next, as a function of the elapsed time between them. Pure arithmetic,
// no DOM — unit-tested directly, same separation as src/lineage-state.ts and
// src/plate-format.ts. Deliberately knows nothing about which node is
// "current": that is the state machine's job, and pacing never touches it.
//
// Plate size and gap size are independently controllable by construction:
// plates render at their natural height and the gap is a separate spacer
// element after each one, so changing the pacing can never resize a plate.

// ---- Tunables -----------------------------------------------------------
// Three constants, each controlling one thing and nothing else, so either
// can be tuned by feel without disturbing the other.

// How dramatic the disparity between a long gap and a short one is. The raw
// weight of a gap is `gap ** PACING_EXPONENT`. At 1.0 this is literal linear
// time — LUCA's 2300 Ma gap alone would be over a third of the page and the
// last five nodes would round to nothing. Lower values flatten the disparity
// (a log scale flattens it much further still). Raise it for more drama,
// lower it to even the page out.
export const PACING_EXPONENT = 0.45;

// Total scroll distance, in vh, of every spacer added together — the length
// of the page minus the plates themselves. Raw weights are normalized so
// their sum lands exactly here. This is what keeps the two knobs
// independent: changing the exponent redistributes the page without
// lengthening it, changing the target lengthens the page without changing
// the shape.
export const TARGET_TOTAL_VH = 9000;

// Floor for any single spacer, in vh, so no gap fully collapses. Without it
// the 0.3 Ma H. sapiens → you step shrinks to nothing and the last two
// plates read as one. Applied after normalization, with the leftover budget
// redistributed across the unpinned spacers so the total still lands exactly
// on TARGET_TOTAL_VH.
export const MIN_SPACER_VH = 25;

// ---- Motion markers -----------------------------------------------------
// A spacer past MARKER_MIN_SPACER_VH is longer than a reader can cross
// without wondering whether the page has stopped responding, so it gets
// faint era/elapsed-time marks every MARKER_INTERVAL_VH. These thin out to
// nothing on their own in the dense modern gaps: those spacers never clear
// the threshold. The emptiness is the point — the marks only prove motion.
export const MARKER_MIN_SPACER_VH = 200;

// Below one viewport height on purpose: at 100 a marker was only ever
// exactly one screen from the next, so whether one was visible depended on
// where the reader happened to stop. At 65 there is always at least one in
// view inside a marked spacer, which is the whole job.
export const MARKER_INTERVAL_VH = 65;

// Raw, un-normalized weight of a single gap. Zero, negative and non-finite
// gaps weigh nothing rather than producing NaN — `(-1) ** 0.45` is NaN, and
// a NaN would propagate through the normalization and take every other
// spacer's height with it.
export function rawWeight(gapMa: number): number {
  if (!Number.isFinite(gapMa) || gapMa <= 0) return 0;
  return gapMa ** PACING_EXPONENT;
}

// One spacer height per gap, so `ages.length - 1` of them: the last node has
// no next node and therefore no trailing spacer.
export function spacerHeightsVh(ages: number[]): number[] {
  const count = Math.max(ages.length - 1, 0);
  if (count === 0) return [];

  const weights = Array.from({ length: count }, (_, i) => rawWeight(ages[i] - ages[i + 1]));

  // Not enough budget to give every spacer its floor. An even split is the
  // only honest answer, and it keeps the total on target.
  if (MIN_SPACER_VH * count >= TARGET_TOTAL_VH) {
    return Array.from({ length: count }, () => TARGET_TOTAL_VH / count);
  }

  const pinned = Array.from({ length: count }, () => false);
  const heights = Array.from({ length: count }, () => MIN_SPACER_VH);

  // Waterfall: share the budget out by weight, pin anything that lands under
  // the floor, then re-share what's left among the rest. Every pass either
  // pins at least one more spacer or exits, so this terminates within
  // `count` passes. At least one spacer always survives unpinned — if they
  // all fell under the floor their total would be below MIN * count, which
  // the guard above has already ruled out.
  for (let pass = 0; pass < count; pass++) {
    const pinnedCount = pinned.reduce((n, isPinned) => n + (isPinned ? 1 : 0), 0);
    const budget = TARGET_TOTAL_VH - MIN_SPACER_VH * pinnedCount;
    const freeCount = count - pinnedCount;
    let freeWeight = 0;
    for (let i = 0; i < count; i++) if (!pinned[i]) freeWeight += weights[i];

    // No unpinned gap carries any weight (every remaining age is identical).
    // Split the remaining budget evenly rather than dividing by zero.
    if (freeWeight <= 0) {
      for (let i = 0; i < count; i++) if (!pinned[i]) heights[i] = budget / freeCount;
      break;
    }

    let underflowed = false;
    for (let i = 0; i < count; i++) {
      if (pinned[i]) {
        heights[i] = MIN_SPACER_VH;
        continue;
      }
      const height = (weights[i] / freeWeight) * budget;
      if (height < MIN_SPACER_VH) {
        pinned[i] = true;
        heights[i] = MIN_SPACER_VH;
        underflowed = true;
      } else {
        heights[i] = height;
      }
    }
    if (!underflowed) break;
  }

  return heights;
}

export interface SpacerMarker {
  // Distance down the spacer, in vh, where this mark sits.
  offsetVh: number;
  // Interpolated age at that point, in Ma.
  ageMa: number;
}

// Marks for one spacer, evenly spaced down it, each carrying the age
// linearly interpolated between the node above and the node below. Returns
// nothing for any spacer at or under the threshold, which is what makes the
// dense modern end clean without a special case for it.
export function markersFor(heightVh: number, fromAgeMa: number, toAgeMa: number): SpacerMarker[] {
  if (!Number.isFinite(heightVh) || heightVh <= MARKER_MIN_SPACER_VH) return [];
  const markers: SpacerMarker[] = [];
  for (let offsetVh = MARKER_INTERVAL_VH; offsetVh < heightVh; offsetVh += MARKER_INTERVAL_VH) {
    const t = offsetVh / heightVh;
    markers.push({ offsetVh, ageMa: fromAgeMa + (toAgeMa - fromAgeMa) * t });
  }
  return markers;
}
