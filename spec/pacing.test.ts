import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import {
  MARKER_INTERVAL_VH,
  MARKER_MIN_SPACER_VH,
  MIN_SPACER_VH,
  TARGET_TOTAL_VH,
  markersFor,
  rawWeight,
  spacerHeightsVh,
} from "../src/pacing";

// The pacing model is pure arithmetic (docs/DESIGN.md §4), so it is tested
// the same way as src/plate-format.ts — directly, with no DOM and no
// scrolling. Three properties matter and are asserted separately, because
// they are the three things that can independently break: the disparity is
// dramatic, nothing collapses below the floor, and the total lands on the
// target however the first two turn out.

const AGES = LINEAGE.map((node) => node.age);

describe("rawWeight", () => {
  it("grows with the gap", () => {
    expect(rawWeight(2300)).toBeGreaterThan(rawWeight(300));
    expect(rawWeight(300)).toBeGreaterThan(rawWeight(0.3));
  });

  it("returns 0 rather than NaN for a zero, negative, or non-finite gap", () => {
    for (const gap of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      const weight = rawWeight(gap);
      expect(Number.isFinite(weight), `gap ${gap} produced ${weight}`).toBe(true);
      expect(weight).toBe(0);
    }
  });
});

describe("spacerHeightsVh", () => {
  const heights = spacerHeightsVh(AGES);

  it("emits one spacer per gap, not one per node", () => {
    expect(heights.length).toBe(LINEAGE.length - 1);
  });

  it("normalizes the total to the target", () => {
    const total = heights.reduce((sum, h) => sum + h, 0);
    expect(total).toBeCloseTo(TARGET_TOTAL_VH, 6);
  });

  it("never falls below the minimum, and stays finite throughout", () => {
    for (const [i, height] of heights.entries()) {
      expect(Number.isFinite(height), `gap ${i} produced ${height}`).toBe(true);
      expect(height, `gap ${i} (${LINEAGE[i].id}) fell below the floor`).toBeGreaterThanOrEqual(
        MIN_SPACER_VH,
      );
    }
  });

  it("makes the biggest gap dramatically larger than the smallest", () => {
    const biggest = Math.max(...heights);
    const smallest = Math.min(...heights);
    // A log scale would land this ratio around 5; the power law is chosen
    // precisely so deep time dwarfs the modern end rather than merely
    // exceeding it.
    expect(biggest / smallest).toBeGreaterThan(20);
  });

  it("puts the longest stretch after LUCA and the shortest at the modern end", () => {
    const longest = heights.indexOf(Math.max(...heights));
    const shortest = heights.indexOf(Math.min(...heights));
    expect(LINEAGE[longest].id).toBe("luca");
    expect(LINEAGE[shortest].id).toBe("homo-sapiens");
  });

  it("orders spacers by their gap, never inverting two", () => {
    for (const [i, height] of heights.entries()) {
      for (const [j, other] of heights.entries()) {
        const gapI = AGES[i] - AGES[i + 1];
        const gapJ = AGES[j] - AGES[j + 1];
        // Pinned-to-floor spacers are exempt: the floor is allowed to lift a
        // short gap up to meet a slightly longer one.
        if (gapI > gapJ && height !== MIN_SPACER_VH && other !== MIN_SPACER_VH) {
          expect(height, `${LINEAGE[i].id} vs ${LINEAGE[j].id}`).toBeGreaterThan(other);
        }
      }
    }
  });

  it("still hits the target when the floor has to lift several spacers", () => {
    // Ages contrived so most gaps are far below the floor's fair share and
    // one dwarfs everything, forcing several waterfall passes.
    const contrived = [10_000, 20, 19, 18, 17, 16, 15, 0];
    const result = spacerHeightsVh(contrived);
    expect(result.reduce((sum, h) => sum + h, 0)).toBeCloseTo(TARGET_TOTAL_VH, 6);
    for (const height of result) expect(height).toBeGreaterThanOrEqual(MIN_SPACER_VH);
  });

  it("splits evenly when no gap carries any weight", () => {
    const flat = spacerHeightsVh([5, 5, 5, 5]);
    expect(flat.reduce((sum, h) => sum + h, 0)).toBeCloseTo(TARGET_TOTAL_VH, 6);
    for (const height of flat) expect(height).toBeCloseTo(TARGET_TOTAL_VH / 3, 6);
  });

  it("returns nothing for zero or one node", () => {
    expect(spacerHeightsVh([])).toEqual([]);
    expect(spacerHeightsVh([100])).toEqual([]);
  });
});

describe("markersFor", () => {
  it("marks a long spacer at regular intervals", () => {
    const markers = markersFor(1000, 4200, 1900);
    expect(markers.length).toBe(Math.ceil(1000 / MARKER_INTERVAL_VH) - 1);
    expect(markers[0].offsetVh).toBe(MARKER_INTERVAL_VH);
    for (const marker of markers) expect(marker.offsetVh).toBeLessThan(1000);
  });

  it("interpolates the age between the two nodes", () => {
    const markers = markersFor(1000, 4200, 1900);
    const halfway = markers.find((m) => m.offsetVh === 500);
    expect(halfway?.ageMa).toBeCloseTo(3050);
    for (const marker of markers) {
      expect(marker.ageMa).toBeLessThan(4200);
      expect(marker.ageMa).toBeGreaterThan(1900);
    }
  });

  it("leaves short spacers unmarked, so the dense modern end stays clean", () => {
    expect(markersFor(MARKER_MIN_SPACER_VH, 7.5, 2.8)).toEqual([]);
    expect(markersFor(MIN_SPACER_VH, 0.3, 0)).toEqual([]);
    expect(markersFor(Number.NaN, 100, 50)).toEqual([]);
  });

  it("marks only the deep-time spacers of the real lineage", () => {
    const heights = spacerHeightsVh(AGES);
    const marked = heights
      .map((height, i) => ({ id: LINEAGE[i].id, count: markersFor(height, AGES[i], AGES[i + 1]).length }))
      .filter(({ count }) => count > 0)
      .map(({ id }) => id);
    expect(marked).toContain("luca");
    expect(marked).not.toContain("homo");
    expect(marked).not.toContain("homo-sapiens");
    expect(marked.length).toBeLessThan(heights.length);
  });
});
