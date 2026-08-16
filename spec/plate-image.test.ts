import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";
import { IMAGE_BUCKETS, type ImageBucket } from "../src/data/image-buckets";
import { plateImage } from "../src/plate-image";

// Written before src/plate-image.ts existed, and observed failing first.
//
// The contracts here are the ones that are expensive to discover late: an AI
// reconstruction that ships without saying it is one, an image that appears
// before its asset exists, or 28 images all fetched at once on a phone.
// docs/IMAGE-STYLE.md §07 makes the labelling a hard rule rather than a
// stylistic choice, so it belongs in a test.

const TETRAPODA = { id: "tetrapoda", name: "The first tetrapod" };

// One generated still, both width variants, as main.ts assembles them.
const STILL = [
  { url: "/x-512.webp", width: 512, format: "webp" },
  { url: "/x-1024.webp", width: 1024, format: "webp" },
];
const ONE = [STILL[0]];

describe("plateImage", () => {
  it("renders nothing at all when the asset does not exist yet", () => {
    expect(plateImage(TETRAPODA, 3, [])).toBeNull();
  });

  it("renders nothing rather than an unlabelled AI image when the bucket is unknown", () => {
    expect(plateImage({ id: "not-a-node", name: "Nothing" }, 3, STILL)).toBeNull();
  });

  it("names the node and declares the image AI-generated in the alt text", () => {
    const image = plateImage(TETRAPODA, 3, STILL);
    expect(image?.alt).toContain("The first tetrapod");
    expect(image?.alt).toMatch(/AI-generated/i);
  });

  it("carries the evidence bucket in the visible tag, three ways", () => {
    const a = plateImage({ id: "tetrapoda", name: "n" }, 1, STILL);
    const partial = plateImage({ id: "mammaliaformes", name: "n" }, 1, STILL);
    const b = plateImage({ id: "luca", name: "n" }, 1, STILL);

    expect(new Set([a?.tag, partial?.tag, b?.tag]).size).toBe(3);
    expect(a?.tag).toMatch(/from fossil material/i);
    expect(partial?.tag).toMatch(/partly/i);
    expect(b?.tag).toMatch(/inferred/i);
  });

  it("says in the alt text, not only the visible tag, how much fossil evidence there is", () => {
    expect(plateImage({ id: "luca", name: "LUCA" }, 1, STILL)?.alt).toMatch(/no fossil/i);
  });

  it("loads the first plate eagerly and every other plate lazily", () => {
    expect(plateImage(TETRAPODA, 0, STILL)?.loading).toBe("eager");
    for (const index of [1, 2, 14, 27]) {
      expect(plateImage(TETRAPODA, index, STILL)?.loading).toBe("lazy");
    }
  });
});

// A 1:1 still is displayed at 200–240 CSS px and nowhere near its full size, so
// serving one width would mean shipping roughly four times the bytes a phone
// needs. These are the contracts that make the second variant actually work:
// without `sizes` the browser assumes the image is the full viewport width and
// picks the largest file every time, which is worse than not offering a choice.
describe("plateImage width variants", () => {
  it("offers every variant to the browser with its real pixel width", () => {
    const image = plateImage(TETRAPODA, 1, STILL);
    expect(image?.srcset).toBe("/x-512.webp 512w, /x-1024.webp 1024w");
  });

  it("falls back to the smallest variant in src, not the largest", () => {
    // src is what a browser ignoring srcset fetches. Defaulting to the 1024
    // would punish exactly the weak client the fallback exists for.
    expect(plateImage(TETRAPODA, 1, STILL)?.src).toBe("/x-512.webp");
  });

  it("sorts variants by width regardless of the order the assets were found in", () => {
    const image = plateImage(TETRAPODA, 1, [STILL[1], STILL[0]]);
    expect(image?.srcset).toBe("/x-512.webp 512w, /x-1024.webp 1024w");
    expect(image?.src).toBe("/x-512.webp");
  });

  it("offers no srcset at all when there is only one variant", () => {
    const image = plateImage(TETRAPODA, 1, ONE);
    expect(image?.srcset).toBeNull();
    expect(image?.sizes).toBeNull();
    expect(image?.src).toBe("/x-512.webp");
  });

  it("declares a display width that matches what the stylesheet actually does", () => {
    // Pinned against the real stylesheet: a `sizes` that drifts from the CSS is
    // silent — the page looks right and every phone downloads the wrong file.
    const css = readFileSync(resolve(import.meta.dirname, "../styles.css"), "utf8");
    const column = css.match(/grid-template-columns:\s*minmax\(0, 1fr\) (\d+px)/)?.[1];
    const cap = css.match(/\.plate-figure-img\s*\{[^}]*max-width:\s*(\d+px)/)?.[1];

    expect(column, "the desktop image column width moved").toBeDefined();
    expect(cap, "the narrow-viewport width cap moved").toBeDefined();
    expect(plateImage(TETRAPODA, 1, STILL)?.sizes).toBe(
      `(width >= 720px) ${column}, ${cap}`,
    );
  });
});

describe("IMAGE_BUCKETS", () => {
  it("buckets every node that can carry an image, so an asset can never land unlabelled", () => {
    for (const node of LINEAGE) {
      if (node.id === "you") continue;
      expect(IMAGE_BUCKETS[node.id], `${node.id}: no evidence bucket`).toBeDefined();
    }
  });

  it("gives the You node no bucket, because it gets no image by design", () => {
    expect(IMAGE_BUCKETS["you"]).toBeUndefined();
  });

  it("buckets nothing that is not a node in the lineage", () => {
    const ids = new Set(LINEAGE.map((node) => node.id));
    for (const id of Object.keys(IMAGE_BUCKETS)) {
      expect(ids.has(id), `${id}: bucketed but not in the lineage`).toBe(true);
    }
  });

  it("matches the counts recorded in docs/IMAGE-PROMPTS.md §01", () => {
    const counts: Record<ImageBucket, number> = { A: 0, "A-partial": 0, B: 0 };
    for (const bucket of Object.values(IMAGE_BUCKETS)) counts[bucket] += 1;
    expect(counts).toEqual({ A: 8, "A-partial": 9, B: 10 });
  });
});

// Asserted against the real stylesheet, the same way spec/era-palette.test.ts
// checks the real token values rather than a copy of them. These three rules
// are the ones that fail silently — the page still renders, it just renders
// wrong — and two of them cannot be caught by reading a diff:
//
//   - drop `isolation`/the painted backdrop and every still becomes a black
//     square, because .plate-in's dormant opacity isolates the blend group;
//   - drop the media query and a 200px column is forced onto a 390px phone;
//   - drop the max-width and a 1:1 still fills a phone screen on its own.
//
// The phone case is here rather than in the browser deliberately: this harness
// could not change the viewport, so the contract is pinned at the source
// instead of left unverified.
describe("the image slot's stylesheet contract", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../styles.css"), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );

  // Brace-matched blocks, so "inside a media query" is a structural claim and
  // not a guess from source order.
  function blockOf(openerIndex: number): string {
    const start = css.indexOf("{", openerIndex);
    let depth = 0;
    for (let i = start; i < css.length; i++) {
      if (css[i] === "{") depth += 1;
      if (css[i] === "}") {
        depth -= 1;
        if (depth === 0) return css.slice(start, i);
      }
    }
    throw new Error("unbalanced braces in styles.css");
  }

  const wideBlocks = [...css.matchAll(/@media \(width >= 720px\)/g)].map((m) =>
    blockOf(m.index),
  );

  it("composites the still with screen, which is what cancels the black backdrop", () => {
    expect(css).toMatch(/\.plate-figure-img\s*\{[^}]*mix-blend-mode:\s*screen/);
  });

  it("isolates the figure and paints its own backdrop, so the blend cannot be orphaned", () => {
    const figure = css.match(/\.plate-figure\s*\{[^}]*\}/)?.[0] ?? "";
    expect(figure).toMatch(/isolation:\s*isolate/);
    expect(figure).toMatch(/background:\s*var\(--bg-now/);
    expect(css).toMatch(/\.plate-on \.plate-figure\s*\{[^}]*background:\s*var\(--surface\)/);
  });

  it("only gives the plate a second column above the 720px breakpoint", () => {
    expect(css).toContain(".plate-in:has(.plate-figure)");
    const inWideBlock = wideBlocks.some((block) => block.includes(".plate-in:has(.plate-figure)"));
    expect(inWideBlock, "the two-column template escaped its media query").toBe(true);
  });

  it("caps the still's width below the breakpoint, so it cannot fill a phone screen", () => {
    const narrow = css.slice(0, css.indexOf("@media (width >= 720px)", css.indexOf(".plate-figure-img")));
    expect(narrow).toMatch(/\.plate-figure-img\s*\{[^}]*max-width:\s*240px/);
  });
});
