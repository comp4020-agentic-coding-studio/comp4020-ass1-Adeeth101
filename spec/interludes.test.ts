import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import { INTERLUDES } from "../src/data/interludes";
import { FIGURE_PLATES } from "../src/data/figure-plates";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spacerHeightsVh } from "../src/pacing";

// Written before the interludes rendered, and observed failing first.
//
// The interesting failure here is not a crash. It is a note about an event
// placed at a scroll position where the reader is passing a completely
// different date — the same class of error as CLAUDE.md's "a date is not a
// node", which has already been caught three times in the dataset.

const AGES = LINEAGE.map((n) => n.age);
const HEIGHTS = spacerHeightsVh(AGES);

describe("INTERLUDES", () => {
  it("only sits in gaps that actually exist and are long enough to hold a note", () => {
    for (const note of INTERLUDES) {
      expect(HEIGHTS[note.after], `after ${note.after}: no spacer there`).toBeDefined();
      // A note in a gap shorter than a screen would collide with the plates at
      // either end of it.
      expect(HEIGHTS[note.after], `after ${note.after}: gap too short`).toBeGreaterThan(100);
    }
  });

  it("places every note inside its spacer, never on top of a plate", () => {
    for (const note of INTERLUDES) {
      expect(note.at).toBeGreaterThan(0.05);
      expect(note.at).toBeLessThan(0.95);
    }
  });

  it("cites a source for every claim, like every node does", () => {
    for (const note of INTERLUDES) {
      expect(note.source.trim().length, `after ${note.after}: no source`).toBeGreaterThan(10);
      expect(note.text.trim().length).toBeGreaterThan(40);
    }
  });

  it("lands each dated note at the scroll position where that date is passed", () => {
    // The pacing model interpolates age linearly across a spacer, so the age
    // under a note at fraction `at` is knowable. A note naming a number has to
    // appear where the page is actually at that number.
    const ageAt = (note: (typeof INTERLUDES)[number]) => {
      const older = AGES[note.after];
      const younger = AGES[note.after + 1];
      return older - note.at * (older - younger);
    };
    const dated = INTERLUDES.filter((n) => /\b(\d{1,3},\d{3}) million\b/.test(n.text));
    expect(dated.length, "no dated notes to check").toBeGreaterThan(0);
    for (const note of dated) {
      const claimed = Number(/\b(\d{1,3},\d{3}) million\b/.exec(note.text)![1].replace(",", ""));
      // Within 8% of the scroll position for that date. Tighter than that would
      // be false precision: the note is a paragraph, not a tick mark.
      expect(Math.abs(ageAt(note) - claimed) / claimed, `"${note.text.slice(0, 40)}…"`).toBeLessThan(
        0.08,
      );
    }
  });

  it("does not stack two notes so close they overlap", () => {
    const byGap = new Map<number, number[]>();
    for (const note of INTERLUDES) {
      byGap.set(note.after, [...(byGap.get(note.after) ?? []), note.at]);
    }
    for (const [gap, positions] of byGap) {
      const sorted = [...positions].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        const apartVh = (sorted[i] - sorted[i - 1]) * HEIGHTS[gap];
        expect(apartVh, `gap ${gap}: notes ${apartVh.toFixed(0)}vh apart`).toBeGreaterThan(60);
      }
    }
  });
});

// Chart plates live in the empty stretches too, on the same terms.
describe("FIGURE_PLATES placement", () => {
  const ageAt = (after: number, at: number) => {
    const older = AGES[after];
    return older - at * (older - AGES[after + 1]);
  };

  it("sits in a gap long enough to open into", () => {
    // A chart is ~1000px expanded. Absolutely positioned, it overlays whatever
    // is below it, so a gap too short would put an opened chart on top of the
    // next plate rather than into empty page.
    for (const fig of FIGURE_PLATES) {
      const gap = HEIGHTS[fig.after];
      expect(gap, `${fig.id}: no spacer at ${fig.after}`).toBeDefined();
      const roomBelowVh = gap * (1 - fig.at);
      expect(roomBelowVh, `${fig.id}: only ${roomBelowVh.toFixed(0)}vh below it`).toBeGreaterThan(150);
    }
  });

  it("lands at a scroll position inside the span of time it depicts", () => {
    // The chart equivalent of "a date is not a node": a figure about the Great
    // Oxidation Event parked where the page is passing 3.5 Ga would be a true
    // chart in a false place.
    for (const fig of FIGURE_PLATES) {
      const age = ageAt(fig.after, fig.at);
      const [oldest, youngest] = fig.spansMa;
      expect(age, `${fig.id} at ${age.toFixed(0)} Ma, span ${oldest}-${youngest}`).toBeLessThanOrEqual(oldest);
      expect(age, `${fig.id} at ${age.toFixed(0)} Ma, span ${oldest}-${youngest}`).toBeGreaterThanOrEqual(youngest);
    }
  });

  it("never lands on top of an interlude in the same gap", () => {
    for (const fig of FIGURE_PLATES) {
      for (const note of INTERLUDES.filter((n) => n.after === fig.after)) {
        const apartVh = Math.abs(note.at - fig.at) * HEIGHTS[fig.after];
        expect(apartVh, `${fig.id} is ${apartVh.toFixed(0)}vh from an interlude`).toBeGreaterThan(60);
      }
    }
  });

  it("is placed in a spacer rather than between two plates", () => {
    // The jolt this replaces: as a row, opening a chart pushed the next node
    // down by 823px.
    const main = readFileSync(resolve(import.meta.dirname, "../main.ts"), "utf8");
    expect(main).toMatch(/spacer\.append\(holder\)/);
    expect(main).not.toMatch(/node-row-figure/);
    // and the reserved-band logic has to see charts, not only notes
    expect(main).toMatch(/\.spacer-note, \.spacer-figure/);
  });
});
