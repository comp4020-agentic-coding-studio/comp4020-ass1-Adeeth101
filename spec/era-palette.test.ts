import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import {
  ERA_COLOR_STOPS,
  backgroundCssAt,
  backgroundRgbAt,
  contrastRatio,
  over,
  relativeLuminance,
} from "../src/era-palette";

// The background is a hazard as well as a feature: it moves under every
// piece of text on the page, so any stop that is too light silently breaks
// readability somewhere in the middle of a scroll where nobody is looking.
// These tests are the sensor for that. They sweep the whole age range rather
// than checking the stops, because the failure would land *between* stops.

const AA_NORMAL = 4.5;
const AA_LARGE = 3;

// Parsed out of styles.css rather than duplicated here: a copy of the token
// values in TypeScript would drift the first time the palette is retuned,
// and then this test would be certifying the wrong colours.
const CSS = readFileSync(resolve("styles.css"), "utf8");

function token(name: string): [number, number, number] {
  const match = CSS.match(new RegExp(`--${name}:\\s*#([0-9a-f]{6})`, "i"));
  if (match === null) throw new Error(`token --${name} not found in styles.css`);
  const hex = match[1];
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

const TEXT = token("text");
const TEXT_2 = token("text-2");
// --text-3 is in the sweep as of 2026-08-16. It used to be excluded because it
// failed AA at every ground (3.14–3.27:1) and had failed against the original
// flat --bg too, so the palette had not caused it. Excluding a known-failing
// pair from the sensor is how it stays failing, so the token was raised
// instead — and this is now the thing that stops it drifting back.
const TEXT_3 = token("text-3");

// Every age a reader can actually land on, sampled finely enough to catch a
// bad interpolation between two individually-fine stops.
const SWEEP = Array.from({ length: 421 }, (_, i) => (i * 4200) / 420);

describe("backgroundRgbAt", () => {
  it("returns whole channel values in range across the sweep", () => {
    for (const age of SWEEP) {
      const rgb = backgroundRgbAt(age);
      for (const channel of rgb) {
        expect(Number.isInteger(channel), `age ${age} gave ${rgb}`).toBe(true);
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      }
    }
  });

  it("clamps past both ends of the table instead of extrapolating", () => {
    const oldest = ERA_COLOR_STOPS[0];
    const youngest = ERA_COLOR_STOPS[ERA_COLOR_STOPS.length - 1];
    expect(backgroundRgbAt(99_999)).toEqual([...oldest.rgb]);
    expect(backgroundRgbAt(oldest.ageMa)).toEqual([...oldest.rgb]);
    expect(backgroundRgbAt(-10)).toEqual([...youngest.rgb]);
    expect(backgroundRgbAt(0)).toEqual([...youngest.rgb]);
    expect(backgroundRgbAt(Number.NaN)).toEqual([...youngest.rgb]);
  });

  it("hits every stop exactly at its own age", () => {
    for (const stop of ERA_COLOR_STOPS) {
      expect(backgroundRgbAt(stop.ageMa), `stop ${stop.era}`).toEqual([...stop.rgb]);
    }
  });

  it("emits CSS rgb() syntax", () => {
    expect(backgroundCssAt(4200)).toMatch(/^rgb\(\d+ \d+ \d+\)$/);
  });

  it("has stops ordered oldest to youngest, which the lookup relies on", () => {
    for (let i = 1; i < ERA_COLOR_STOPS.length; i++) {
      expect(ERA_COLOR_STOPS[i].ageMa).toBeLessThan(ERA_COLOR_STOPS[i - 1].ageMa);
    }
  });
});

describe("contrast is never allowed to drop below WCAG AA", () => {
  it("holds AA for every ink token at every age in the sweep", () => {
    for (const age of SWEEP) {
      const bg = backgroundRgbAt(age);
      for (const [name, ink] of [
        ["--text", TEXT],
        ["--text-2", TEXT_2],
        ["--text-3", TEXT_3],
      ] as const) {
        expect(
          contrastRatio(ink, bg),
          `${name} at ${Math.round(age)} Ma on rgb(${bg.join(" ")})`,
        ).toBeGreaterThanOrEqual(AA_NORMAL);
      }
    }
  });

  it("holds AA for --text-3 on the raised plate surface too", () => {
    // .plate-cap-text is --text-3 and sits on --surface when its plate is
    // active, so the ground sweep alone doesn't cover where it actually reads.
    expect(contrastRatio(TEXT_3, token("surface"))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("holds AA for the spacer marks, which are drawn at 90% opacity", () => {
    for (const age of SWEEP) {
      const bg = backgroundRgbAt(age);
      const mark = over(TEXT_2, bg, 0.9);
      expect(contrastRatio(mark, bg), `spacer mark at ${Math.round(age)} Ma`).toBeGreaterThanOrEqual(
        AA_NORMAL,
      );
    }
  });

  it("holds AA-large for text over the active plate's raised surface", () => {
    // .plate-on paints --surface over the ground, so active plates need
    // checking against that, not against the background.
    const surface = token("surface");
    expect(contrastRatio(TEXT, surface)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(TEXT_2, surface)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it("keeps every stop within a narrow luminance band, so no stop is a bright flash", () => {
    const luminances = ERA_COLOR_STOPS.map((stop) => relativeLuminance(stop.rgb));
    const brightest = Math.max(...luminances);
    const darkest = Math.min(...luminances);
    expect(brightest).toBeLessThan(0.012);
    expect(brightest / darkest).toBeLessThan(1.6);
  });
});

describe("the progression the brief asked for", () => {
  const rgbAt = (age: number) => backgroundRgbAt(age);
  const isWarm = (rgb: [number, number, number]) => rgb[0] > rgb[2];
  const isCold = (rgb: [number, number, number]) => rgb[2] > rgb[0];

  it("starts warm in the Hadean and ends cold in the Quaternary", () => {
    expect(isWarm(rgbAt(4200)), "Hadean should read warm (iron)").toBe(true);
    expect(isCold(rgbAt(0)), "Quaternary should read cold").toBe(true);
  });

  it("flips from warm to cold across the Great Oxygenation Event", () => {
    expect(isWarm(rgbAt(2500)), "pre-GOE should still be warm").toBe(true);
    expect(isCold(rgbAt(2300)), "post-GOE should have turned cold").toBe(true);
  });

  it("warms again through the Carboniferous and Permian", () => {
    expect(isWarm(rgbAt(359))).toBe(true);
    expect(isWarm(rgbAt(252))).toBe(true);
    // and is colder either side of that warm band
    expect(isCold(rgbAt(541))).toBe(true);
    expect(isCold(rgbAt(66))).toBe(true);
  });

  it("gives every node in the lineage a defined ground colour", () => {
    for (const node of LINEAGE) {
      const rgb = backgroundRgbAt(node.age);
      expect(rgb.every(Number.isFinite), `${node.id}`).toBe(true);
    }
  });
});
