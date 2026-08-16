// Scroll pacing: how much vertical distance a node's section occupies.
// Pure arithmetic, no DOM — unit-tested directly, same separation as
// src/lineage-state.ts and src/plate-format.ts. Deliberately knows nothing
// about which node is "current": that is the state machine's job, and this
// change does not touch it.
//
// The model (docs/DESIGN.md §4): a section's height is the elapsed time
// between its node and the next one, on a log10 scale. Linear time is
// unusable — LUCA→eukaryote alone is 2300 Ma, over half the whole span, and
// the last nine nodes together would round to nothing. Log10 keeps the
// ordering honest (a longer gap is always a taller section) while pulling
// the 2300 Ma and 2.5 Ma gaps into the same order of magnitude on screen.

// The output range, in vh. Both ends are tunable: raising MIN_SECTION_VH
// lifts the floor for the crowded modern nodes, raising MAX_SECTION_VH
// stretches the quiet deep-time stretches.
export const MIN_SECTION_VH = 40;
export const MAX_SECTION_VH = 220;

// The input domain, in Ma. Gaps are clamped into this window before the log
// is taken, which is also what keeps log10(0) from producing -Infinity for
// the last node (no next node, so no gap) and for the 0.3 Ma
// H. sapiens→you step. The ceiling sits just above the largest real gap in
// src/data/lineage.ts (2300 Ma, LUCA→eukaryote) so that gap lands near the
// top of the range rather than defining it exactly.
export const GAP_FLOOR_MA = 1;
export const GAP_CEILING_MA = 2500;

const LOG_FLOOR = Math.log10(GAP_FLOOR_MA);
const LOG_CEILING = Math.log10(GAP_CEILING_MA);

// Maps an elapsed-time gap in Ma to a section height in vh. Always returns a
// finite number inside [MIN_SECTION_VH, MAX_SECTION_VH], for any input —
// including 0, negative, and non-finite — so a bad gap can never produce a
// NaN inline style that silently collapses a section.
export function sectionHeightVh(gapMa: number): number {
  if (!Number.isFinite(gapMa)) return MIN_SECTION_VH;
  const clampedGap = Math.min(Math.max(gapMa, GAP_FLOOR_MA), GAP_CEILING_MA);
  const t = (Math.log10(clampedGap) - LOG_FLOOR) / (LOG_CEILING - LOG_FLOOR);
  return MIN_SECTION_VH + t * (MAX_SECTION_VH - MIN_SECTION_VH);
}

// The gap from the node at `index` to the next one. The last node has no
// next node and so no elapsed time to represent; it gets 0, which
// sectionHeightVh floors to MIN_SECTION_VH.
export function gapToNextMa(ages: number[], index: number): number {
  const next = ages[index + 1];
  return next === undefined ? 0 : ages[index] - next;
}
