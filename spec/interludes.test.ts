import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import { INTERLUDES } from "../src/data/interludes";
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
