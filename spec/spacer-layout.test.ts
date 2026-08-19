import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { clashesWithNote, MARK_CLEARANCE_VH, reservedBand } from "../src/spacer-layout";

// Written before the reflow existed, and observed failing first.

describe("reservedBand", () => {
  it("reserves the note's own height plus clearance on both sides", () => {
    const band = reservedBand(40, 20, 5);
    expect(band.startVh).toBe(35);
    expect(band.endVh).toBe(65);
  });

  it("defaults to a clearance big enough that a marker does not read as part of the note", () => {
    expect(MARK_CLEARANCE_VH).toBeGreaterThanOrEqual(2);
    const band = reservedBand(40, 20);
    expect(band.startVh).toBeLessThan(40);
    expect(band.endVh).toBeGreaterThan(60);
  });
});

describe("clashesWithNote", () => {
  const bands = [reservedBand(40, 20, 5), reservedBand(120, 15, 5)];

  it("keeps markers that are clear of every note", () => {
    expect(clashesWithNote(10, bands)).toBe(false);
    expect(clashesWithNote(90, bands)).toBe(false);
    expect(clashesWithNote(200, bands)).toBe(false);
  });

  it("rejects a marker anywhere inside a note's band, including the clearance", () => {
    expect(clashesWithNote(50, bands)).toBe(true);
    expect(clashesWithNote(36, bands), "inside the top clearance").toBe(true);
    expect(clashesWithNote(64, bands), "inside the bottom clearance").toBe(true);
    expect(clashesWithNote(125, bands)).toBe(true);
  });

  it("rejects a marker exactly on a band edge, rather than letting it touch", () => {
    expect(clashesWithNote(35, bands)).toBe(true);
    expect(clashesWithNote(65, bands)).toBe(true);
  });

  it("keeps every marker when a spacer has no notes at all", () => {
    for (const at of [0, 25, 60, 200]) expect(clashesWithNote(at, [])).toBe(false);
  });

  it("holds when a note is tall enough to swallow several markers", () => {
    // The phone case: the same prose wraps to far more lines in a narrow
    // column, so the band grows and takes more markers with it. Nothing here
    // is tuned to a particular width — the height is measured at runtime.
    const tall = [reservedBand(40, 60)];
    expect([50, 70, 90].every((at) => clashesWithNote(at, tall))).toBe(true);
  });
});

describe("the reflow's wiring contract", () => {
  const main = readFileSync(resolve(import.meta.dirname, "../main.ts"), "utf8");

  it("measures the note rather than assuming a height", () => {
    // A hard-coded band would be tuned to one viewport and one string length,
    // and both change.
    expect(main).toMatch(/offsetHeight[\s\S]{0,120}reservedBand|reservedBand[\s\S]{0,160}offsetHeight/);
  });

  it("re-runs when the width changes, since the prose rewraps", () => {
    expect(main).toMatch(/resize[\s\S]{0,400}reflowSpacerMarks|reflowSpacerMarks[\s\S]{0,80}\)\s*;?\s*\n?\s*window\.addEventListener\(\s*"resize"/);
  });

  it("re-runs once webfonts land, because that changes how the prose wraps", () => {
    expect(main).toMatch(/fonts[\s\S]{0,200}reflowSpacerMarks/);
  });
});
