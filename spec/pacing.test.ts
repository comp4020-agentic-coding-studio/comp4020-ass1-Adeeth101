import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import {
  GAP_CEILING_MA,
  GAP_FLOOR_MA,
  MAX_SECTION_VH,
  MIN_SECTION_VH,
  gapToNextMa,
  sectionHeightVh,
} from "../src/pacing";

// The pacing model is pure arithmetic (docs/DESIGN.md §4), so it is tested
// the same way as src/plate-format.ts — directly, with no DOM and no
// scrolling. What matters is that the output is always a usable number: an
// -Infinity or NaN here would reach the page as a broken inline style and
// collapse a section, which is exactly the failure the clamp exists to
// prevent.

describe("sectionHeightVh", () => {
  it("stays inside the clamped range for a tiny gap and a huge gap", () => {
    const tiny = sectionHeightVh(0.001);
    const huge = sectionHeightVh(1_000_000);
    for (const height of [tiny, huge]) {
      expect(Number.isFinite(height)).toBe(true);
      expect(height).toBeGreaterThanOrEqual(MIN_SECTION_VH);
      expect(height).toBeLessThanOrEqual(MAX_SECTION_VH);
    }
  });

  it("hits the range endpoints at and beyond the domain bounds", () => {
    expect(sectionHeightVh(GAP_FLOOR_MA)).toBeCloseTo(MIN_SECTION_VH);
    expect(sectionHeightVh(GAP_CEILING_MA)).toBeCloseTo(MAX_SECTION_VH);
    expect(sectionHeightVh(GAP_FLOOR_MA / 100)).toBeCloseTo(MIN_SECTION_VH);
    expect(sectionHeightVh(GAP_CEILING_MA * 100)).toBeCloseTo(MAX_SECTION_VH);
  });

  it("never returns -Infinity or NaN for a zero, negative, or non-finite gap", () => {
    for (const gap of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      const height = sectionHeightVh(gap);
      expect(Number.isFinite(height), `gap ${gap} produced ${height}`).toBe(true);
      expect(height).toBeGreaterThanOrEqual(MIN_SECTION_VH);
      expect(height).toBeLessThanOrEqual(MAX_SECTION_VH);
    }
  });

  it("is monotonic: a longer gap is never a shorter section", () => {
    const gaps = [0.3, 1, 2.5, 10, 50, 100, 500, 2300];
    for (let i = 1; i < gaps.length; i++) {
      expect(sectionHeightVh(gaps[i])).toBeGreaterThanOrEqual(sectionHeightVh(gaps[i - 1]));
    }
  });

  it("compresses logarithmically, not linearly", () => {
    // A 100× longer gap must not produce anything close to a 100× taller
    // section — that compression is the whole point of the log scale.
    const ratio = sectionHeightVh(1000) / sectionHeightVh(10);
    expect(ratio).toBeLessThan(3);
    expect(ratio).toBeGreaterThan(1);
  });
});

describe("gapToNextMa", () => {
  it("returns the elapsed time to the next node", () => {
    expect(gapToNextMa([4200, 1900, 1600], 0)).toBe(2300);
    expect(gapToNextMa([4200, 1900, 1600], 1)).toBe(300);
  });

  it("returns 0 for the last node, which has no next node", () => {
    expect(gapToNextMa([4200, 1900, 1600], 2)).toBe(0);
  });
});

describe("pacing against the real lineage", () => {
  const ages = LINEAGE.map((node) => node.age);

  it("gives every node a finite height inside the clamped range", () => {
    for (const [index, node] of LINEAGE.entries()) {
      const height = sectionHeightVh(gapToNextMa(ages, index));
      expect(Number.isFinite(height), `${node.id} produced ${height}`).toBe(true);
      expect(height).toBeGreaterThanOrEqual(MIN_SECTION_VH);
      expect(height).toBeLessThanOrEqual(MAX_SECTION_VH);
    }
  });

  it("makes the longest deep-time gap the tallest section", () => {
    const heights = LINEAGE.map((_, index) => sectionHeightVh(gapToNextMa(ages, index)));
    const tallest = heights.indexOf(Math.max(...heights));
    expect(LINEAGE[tallest].id).toBe("luca");
  });

  it("makes a dense modern node shorter than a quiet deep-time one", () => {
    const heightOf = (id: string): number => {
      const index = LINEAGE.findIndex((node) => node.id === id);
      return sectionHeightVh(gapToNextMa(ages, index));
    };
    expect(heightOf("homo")).toBeLessThan(heightOf("luca"));
    expect(heightOf("hominini")).toBeLessThan(heightOf("eukaryote"));
  });
});
