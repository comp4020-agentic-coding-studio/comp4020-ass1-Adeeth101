import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import { IMAGE_BUCKETS } from "../src/data/image-buckets";
import {
  FRAME_SEQUENCES,
  frameFileStem,
  frameIndexAt,
  runwayProgress,
  RUNWAY_STICKY_VH,
  RUNWAY_VH,
} from "../src/plate-frames";

// Written before the sequences existed, and observed failing first.

// The runway replaces the first version's sequenceProgress, which drove the
// morph from the row's own traverse of the viewport. That measured 1,016px on a
// 73,000px page — one frame every 20px — so the sequence was over before it read
// as motion, and on a page this long a reader could pass it without noticing it
// moved. Recorded here rather than dropped silently.
describe("runwayProgress", () => {
  // 320vh runway, 10vh sticky offset, a ~300px plate, at a 800px viewport.
  const RUNWAY = 2560;
  const ROW = 300;
  const STICKY = 80;
  const at = (top: number) => runwayProgress(top, RUNWAY, ROW, STICKY);

  it("is 0 until the plate has actually pinned", () => {
    expect(at(800)).toBe(0);
    expect(at(STICKY)).toBe(0);
  });

  it("is 1 once the plate is about to unpin, not once the runway has fully left", () => {
    // The pin ends when the runway's bottom reaches the plate's bottom. Driving
    // progress off the runway's full height instead would run the last frames
    // after the plate had unpinned and started scrolling away — the end of the
    // morph would happen off-screen.
    expect(at(STICKY - (RUNWAY - ROW))).toBe(1);
  });

  it("clamps at both ends rather than running past them", () => {
    expect(at(99999)).toBe(0);
    expect(at(-99999)).toBe(1);
  });

  it("rises monotonically through the pinned stretch", () => {
    const seen = [80, 0, -400, -900, -1400, -1900, -2260].map(at);
    for (let i = 1; i < seen.length; i++) expect(seen[i]).toBeGreaterThan(seen[i - 1]);
  });

  it("reaches the halfway frame halfway through the pin", () => {
    expect(at(STICKY - (RUNWAY - ROW) / 2)).toBeCloseTo(0.5, 5);
  });

  it("does not divide by zero when the runway is shorter than the plate", () => {
    expect(runwayProgress(0, 100, 300, 0)).toBe(0);
  });

  it("gives the morph enough scroll to read as motion", () => {
    // The failure this exists to prevent: 52 frames over 1,016px, which is what
    // shipped first. At a 800px viewport the runway must leave well over 20px
    // of scroll per frame.
    const travel = RUNWAY - ROW;
    expect(travel / 52).toBeGreaterThan(30);
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

  it("keeps the stylesheet's runway geometry in step with the frame arithmetic", () => {
    // These numbers live in two files: src/plate-frames.ts does the frame
    // arithmetic, styles.css does the pinning. If they drift, the morph
    // desynchronises from the pin and nothing looks obviously broken.
    const runway = css.match(/\.node-runway\s*\{[^}]*\}/)?.[0] ?? "";
    const pin = css.match(/\.node-runway > \.node-row\s*\{[^}]*\}/)?.[0] ?? "";
    expect(runway).toContain(`min-height: ${RUNWAY_VH}vh`);
    expect(pin).toContain(`top: ${RUNWAY_STICKY_VH}vh`);
  });

  it("pins the plate rather than restyling it, so the row's own layout is untouched", () => {
    expect(css).toMatch(/\.node-runway > \.node-row\s*\{[^}]*position:\s*sticky/);
  });

  it("shows the sequence's LAST frame as the still, not its first", () => {
    // Frame one of the tetrapod sequence is a lobe-finned fish, and the plate is
    // titled "The first tetrapod". It is also the only frame a reader with
    // prefers-reduced-motion ever sees.
    expect(main).toMatch(/frameFileStem\(\s*sequenceForStill\.frames - 1\s*\)/);
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
