import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import { IMAGE_BUCKETS } from "../src/data/image-buckets";
import {
  FRAME_SEQUENCES,
  frameFileStem,
  frameIndexAt,
  sequenceProgress,
} from "../src/plate-frames";

// Written before the sequences existed, and observed failing first.

describe("sequenceProgress", () => {
  it("is 0 before the row has entered and 1 once it has fully left", () => {
    expect(sequenceProgress(800, 400, 800)).toBe(0);
    expect(sequenceProgress(-400, 400, 800)).toBe(1);
  });

  it("clamps rather than running past either end", () => {
    expect(sequenceProgress(5000, 400, 800)).toBe(0);
    expect(sequenceProgress(-5000, 400, 800)).toBe(1);
  });

  it("rises monotonically as the row travels up the viewport", () => {
    const seen = [800, 600, 400, 200, 0, -200, -400].map((top) =>
      sequenceProgress(top, 400, 800),
    );
    for (let i = 1; i < seen.length; i++) expect(seen[i]).toBeGreaterThan(seen[i - 1]);
  });

  it("survives a zero-height viewport without dividing by zero", () => {
    expect(Number.isFinite(sequenceProgress(0, 0, 0))).toBe(true);
  });
});

describe("frameIndexAt", () => {
  it("maps the ends onto the first and last frame, never past them", () => {
    expect(frameIndexAt(0, 52)).toBe(0);
    expect(frameIndexAt(1, 52)).toBe(51);
    expect(frameIndexAt(1.5, 52)).toBe(51);
    expect(frameIndexAt(-1, 52)).toBe(0);
  });

  it("advances linearly, with no easing anywhere in the range", () => {
    // Equal steps of scroll must give equal steps of frame. An eased curve
    // would make the animal appear to accelerate on its own, which reads as
    // playback rather than as the reader driving it.
    const at = (p: number) => frameIndexAt(p, 100);
    expect(at(0.25)).toBe(25);
    expect(at(0.5)).toBe(50);
    expect(at(0.75)).toBe(75);
  });

  it("never returns a negative index for an empty sequence", () => {
    expect(frameIndexAt(0.5, 0)).toBe(0);
  });
});

describe("frameFileStem", () => {
  it("is one-based and zero-padded, matching ffmpeg's own numbering", () => {
    expect(frameFileStem(0)).toBe("f001");
    expect(frameFileStem(51)).toBe("f052");
  });
});

describe("the frame sequences on disk", () => {
  const root = resolve(import.meta.dirname, "../images/frames");

  it("only names nodes that exist and already carry an evidence bucket", () => {
    const ids = new Set(LINEAGE.map((n) => n.id));
    for (const id of Object.keys(FRAME_SEQUENCES)) {
      expect(ids.has(id), `${id}: not a node`).toBe(true);
      // The sequence is decorative; the plate's real image still has to be
      // labelled, and that labelling comes from the bucket.
      expect(IMAGE_BUCKETS[id], `${id}: no evidence bucket`).toBeDefined();
    }
  });

  it("ships every declared frame at both widths", () => {
    for (const [id, seq] of Object.entries(FRAME_SEQUENCES)) {
      const files = new Set(readdirSync(resolve(root, id)));
      for (let i = 0; i < seq.frames; i++) {
        for (const w of [256, 512]) {
          expect(files.has(`${frameFileStem(i)}-${w}.webp`), `${id}: missing frame ${i} @${w}`).toBe(
            true,
          );
        }
      }
    }
  });

  it("stays inside the per-sequence budget in CLAUDE.md", () => {
    for (const [id, seq] of Object.entries(FRAME_SEQUENCES)) {
      expect(seq.frames, `${id}: over the 120-frame cap`).toBeLessThanOrEqual(120);
      const bytes = readdirSync(resolve(root, id)).reduce(
        (sum, f) => sum + statSync(resolve(root, id, f)).size,
        0,
      );
      expect(bytes, `${id}: ${Math.round(bytes / 1024)}kB over budget`).toBeLessThanOrEqual(
        1.5 * 1024 * 1024,
      );
    }
  });
});

// The rules that fail silently: the page still renders, the sequence just
// stops being driven by the reader or stops being decorative.
describe("the frame sequence's wiring contract", () => {
  const main = readFileSync(resolve(import.meta.dirname, "../main.ts"), "utf8");
  const css = readFileSync(resolve(import.meta.dirname, "../styles.css"), "utf8");

  it("adds no scroll listener of its own — the sequence rides the existing ones", () => {
    // Two existed before the sequences: updateGauge's, and the settle timer
    // that catches a jump landing mid-spacer. The number to hold is "no more
    // than were already here", so this is 2 rather than 1 — the first draft of
    // this test asserted 1 and was simply wrong about the file.
    const scrollListeners = main.match(/addEventListener\(\s*["']scroll["']/g) ?? [];
    expect(scrollListeners.length).toBe(2);
    // ...and the frame swap is called from inside the gauge's handler.
    expect(main).toMatch(/function updateGauge[\s\S]{0,1600}updateSequences\(\)/);
  });

  it("hides the sequence from assistive tech, leaving one described image", () => {
    expect(main).toMatch(/plate-frames[\s\S]{0,300}aria-hidden/);
  });

  it("falls back to a single static frame under prefers-reduced-motion", () => {
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/\.plate-frames\s*\{[^}]*display:\s*none/);
  });

  it("never puts a transition on the frame swap", () => {
    // Comments stripped first: this rule's own comment explains why there is no
    // transition, and the first draft of this test matched that word and failed
    // against correct code.
    const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const rule = bare.match(/\.plate-frames-img\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("mix-blend-mode");
    expect(rule).not.toMatch(/transition/);
  });
});
