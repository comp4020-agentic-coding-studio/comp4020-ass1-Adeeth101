import { describe, expect, it } from "vitest";
import { BIG_FIVE, FIGURE_SOURCES, OXYGEN_CURVE } from "../src/data/figures";
import { CHART_BOX, linearY, logY, polyline, slots, timeX } from "../src/charts";

// Written before the charts rendered, and observed failing first.

const B = CHART_BOX;

describe("timeX", () => {
  it("puts the oldest date at the left edge of the plot and the youngest at the right", () => {
    expect(timeX(4200, 4200, 0, B)).toBeCloseTo(B.padLeft, 5);
    expect(timeX(0, 4200, 0, B)).toBeCloseTo(B.width - B.padRight, 5);
  });

  it("runs oldest-to-youngest left-to-right, the way the reader is travelling", () => {
    expect(timeX(3000, 4200, 0, B)).toBeLessThan(timeX(1000, 4200, 0, B));
  });

  it("clamps rather than drawing outside the plot area", () => {
    expect(timeX(9000, 4200, 0, B)).toBeCloseTo(B.padLeft, 5);
    expect(timeX(-500, 4200, 0, B)).toBeCloseTo(B.width - B.padRight, 5);
  });
});

describe("logY", () => {
  it("places each order of magnitude an equal distance apart", () => {
    const a = logY(1e-5, 1e-6, 1, B);
    const b = logY(1e-4, 1e-6, 1, B);
    const c = logY(1e-3, 1e-6, 1, B);
    expect(b - a).toBeCloseTo(c - b, 4);
  });

  it("puts bigger values higher up the chart", () => {
    expect(logY(1, 1e-6, 1, B)).toBeLessThan(logY(1e-5, 1e-6, 1, B));
  });

  it("survives zero and negative input instead of returning NaN", () => {
    expect(Number.isFinite(logY(0, 1e-6, 1, B))).toBe(true);
    expect(Number.isFinite(logY(-1, 1e-6, 1, B))).toBe(true);
  });

  it("would flatten the whole Precambrian if the axis were linear", () => {
    // The argument for a log axis, written as a test: on a linear axis every
    // value before the Phanerozoic lands within a pixel of the baseline and the
    // chart's entire subject disappears.
    const base = linearY(0, 0, 1, B);
    expect(Math.abs(linearY(1e-3, 0, 1, B) - base)).toBeLessThan(1);
    expect(Math.abs(logY(1e-3, 1e-6, 1, B) - logY(1e-6, 1e-6, 1, B))).toBeGreaterThan(50);
  });
});

describe("slots", () => {
  it("gives every event a slot inside the plot area", () => {
    for (const s of slots(BIG_FIVE.length, B)) {
      expect(s.centre - s.width / 2).toBeGreaterThanOrEqual(B.padLeft - 0.001);
      expect(s.centre + s.width / 2).toBeLessThanOrEqual(B.width - B.padRight + 0.001);
    }
  });

  it("spaces them evenly and leaves a gap between bars", () => {
    const s = slots(5, B);
    const gaps = s.slice(1).map((v, i) => v.centre - s[i].centre);
    for (const g of gaps) expect(g).toBeCloseTo(gaps[0], 4);
    expect(s[0].width).toBeLessThan(gaps[0]);
  });

  it("returns nothing rather than dividing by zero for an empty set", () => {
    expect(slots(0, B)).toEqual([]);
  });
});

describe("polyline", () => {
  it("starts with a move and continues with lines", () => {
    const path = polyline([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
    expect(path).toBe("M1.0 2.0 L3.0 4.0");
  });
});

// The data itself. These are the failures that would let a good-looking chart
// say something false.
describe("the figure data", () => {
  it("keeps the oxygen curve continuous — no invented jumps between segments", () => {
    for (let i = 1; i < OXYGEN_CURVE.length; i++) {
      expect(OXYGEN_CURVE[i].fromMa, `segment ${i} does not start where ${i - 1} ended`).toBe(
        OXYGEN_CURVE[i - 1].toMa,
      );
      expect(OXYGEN_CURVE[i].fromPal).toBeCloseTo(OXYGEN_CURVE[i - 1].toPal, 12);
    }
  });

  it("runs the oxygen curve forwards in time and never off the bottom of the axis", () => {
    for (const seg of OXYGEN_CURVE) {
      expect(seg.fromMa).toBeGreaterThan(seg.toMa);
      expect(seg.fromPal).toBeGreaterThan(0);
      expect(seg.toPal).toBeGreaterThan(0);
    }
  });

  it("marks the stretches where published estimates disagree as unconstrained", () => {
    // The chart's honesty rests on this: solid means a proxy pins the ceiling,
    // dashed means it does not. If every segment were solid the chart would be
    // asserting a precision nobody has.
    expect(OXYGEN_CURVE.some((s) => s.constrained)).toBe(true);
    expect(OXYGEN_CURVE.some((s) => !s.constrained)).toBe(true);
  });

  it("keeps the two extinctions Stanley declined to estimate as gaps, not zeroes", () => {
    // Drawing a missing estimate as 0% would be the worst available lie: it
    // would show two of the Big Five as having killed nothing at all.
    const declined = BIG_FIVE.filter((e) => e.speciesLostPct === null);
    expect(declined.length).toBe(2);
    for (const e of declined) expect(e.declinedWhy?.length ?? 0).toBeGreaterThan(10);
  });

  it("orders the extinctions oldest first and keeps every percentage plausible", () => {
    for (let i = 1; i < BIG_FIVE.length; i++) {
      expect(BIG_FIVE[i].ma).toBeLessThan(BIG_FIVE[i - 1].ma);
    }
    for (const e of BIG_FIVE) {
      if (e.speciesLostPct !== null) {
        expect(e.speciesLostPct).toBeGreaterThan(0);
        expect(e.speciesLostPct).toBeLessThanOrEqual(100);
      }
    }
  });

  it("cites a named paper for both charts", () => {
    for (const s of Object.values(FIGURE_SOURCES)) {
      expect(s).toMatch(/\b(19|20)\d{2}\b/);
      expect(s.length).toBeGreaterThan(60);
    }
  });
});
