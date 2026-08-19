import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { plateExpanded } from "../src/plate-detail";

// Written before the collapse existed, and observed failing first.

const NONE = { isCurrent: false, isHovered: false, isFocused: false };

describe("plateExpanded", () => {
  it("collapses a plate that is neither current, hovered nor focused", () => {
    expect(plateExpanded(NONE)).toBe(false);
  });

  it("expands on any one of the three, on its own", () => {
    expect(plateExpanded({ ...NONE, isCurrent: true })).toBe(true);
    expect(plateExpanded({ ...NONE, isHovered: true })).toBe(true);
    expect(plateExpanded({ ...NONE, isFocused: true })).toBe(true);
  });

  it("stays expanded while any input is still true", () => {
    // The case that breaks a naive implementation: the pointer leaves a plate
    // that is also the current one, and the detail collapses under the reader.
    expect(plateExpanded({ isCurrent: true, isHovered: false, isFocused: true })).toBe(true);
    expect(plateExpanded({ isCurrent: true, isHovered: true, isFocused: false })).toBe(true);
    expect(plateExpanded({ isCurrent: false, isHovered: true, isFocused: true })).toBe(true);
  });
});

// The collapse changes every plate's height, which moves every anchor the depth
// gauge reads. These are the two rules that keep that from drifting, asserted
// against the real files because both fail silently: the page still renders,
// the gauge just reports the wrong era.
describe("the collapse's stylesheet and wiring contract", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../styles.css"), "utf8");
  const main = readFileSync(resolve(import.meta.dirname, "../main.ts"), "utf8");

  it("animates the detail with grid-template-rows, which is what fires transitionend", () => {
    // max-height would animate too, but to a guessed ceiling; 0fr/1fr resolves
    // to the content's real height, so no plate can be clipped by a wrong guess.
    expect(css).toMatch(/\.plate-detail\s*\{[^}]*grid-template-rows:\s*0fr/);
    expect(css).toMatch(/\.plate-detail\[data-expanded="true"\]\s*\{[^}]*grid-template-rows:\s*1fr/);
    expect(css).toMatch(/\.plate-detail\s*\{[^}]*transition:[^;]*grid-template-rows/);
  });

  it("recomputes the gauge anchors when a plate finishes resizing", () => {
    expect(main).toMatch(/transitionend[\s\S]{0,400}recomputeAnchors/);
  });

  it("keeps a static, readable page under prefers-reduced-motion", () => {
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/\.plate-detail/);
  });

  it("kills the transition outright under reduced motion rather than shortening it", () => {
    // Measured, not assumed: at the blanket 1ms this file used to inherit,
    // Chrome fired no transitionend at all AND the grid-template-rows
    // transition never settled — a plate opened and then stayed open at its
    // full height forever, with the gauge anchors never recomputed. 0s applies
    // the property instantly with no transition to get stuck in.
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    const rule = reduced.match(/\.plate-detail\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toMatch(/transition-duration:\s*0s\s*!important/);
    expect(rule).not.toMatch(/1ms/);
  });

  it("recomputes anchors on a state change too, not only on transitionend", () => {
    // Under reduced motion there is no transition, so no transitionend, so the
    // listener that keeps the depth gauge honest never runs. This is the
    // fallback that covers it.
    expect(main).toMatch(/scheduleAnchorRecompute/);
    expect(main).toMatch(/requestAnimationFrame[\s\S]{0,200}recomputeAnchors/);
    // and it must be called wherever the state is actually written: once for
    // lineage plates, once for chart plates.
    const writes = main.split("dataset.expanded = next;").length - 1;
    const schedules = main.split("scheduleAnchorRecompute();").length - 1;
    expect(writes, "a state write with no anchor recompute beside it").toBeGreaterThanOrEqual(2);
    expect(schedules).toBeGreaterThanOrEqual(writes);
  });
});
