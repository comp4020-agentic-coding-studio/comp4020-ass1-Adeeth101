// The plate's image slot: what to render, whether to render it at all, and
// what it has to say about itself. Pure — no DOM, same separation as
// src/plate-format.ts, so the labelling rule is unit-testable.
//
// Three things here are contract rather than preference:
//
// 1. **No asset, no element.** Media is landing after the page is built
//    (CLAUDE.md: "the site must build and pass its checks with placeholders;
//    media landing late must never block the build"). A node with no asset
//    renders no <img> at all rather than an empty box or a broken-image icon,
//    and the slot collapses so there is no hole in the layout either.
// 2. **No bucket, no image.** If a node has no entry in IMAGE_BUCKETS we
//    cannot say how much of the picture is evidence, so we do not show the
//    picture. An unlabelled AI reconstruction on a page arguing that the
//    science is checkable is worse than a plate with no illustration.
// 3. **The alt text carries the caveat too.** The visible tag is not enough:
//    someone using a screen reader has to hear that this is generated and how
//    much of it is inferred, not just that there is a picture of an animal.

import { IMAGE_BUCKETS, type ImageBucket } from "./data/image-buckets";

export interface PlateImage {
  src: string;
  alt: string;
  // The per-image tag from docs/IMAGE-STYLE.md §07, doing double duty as the
  // bucket distinction — "reconstruction from fossil material" versus
  // "inferred, no fossil record" is a real difference and surfacing it is the
  // whole point of the labelling.
  tag: string;
  loading: "eager" | "lazy";
}

const EVIDENCE: Record<ImageBucket, { alt: string; tag: string }> = {
  A: {
    alt: "reconstructed from fossil material",
    tag: "AI reconstruction · from fossil material",
  },
  "A-partial": {
    alt: "reconstructed only partly from fossil material — the rest extrapolated from a relative",
    tag: "AI reconstruction · partly from fossil material",
  },
  B: {
    alt: "inferred: no fossil constrains its appearance",
    tag: "AI reconstruction · inferred, no fossil record",
  },
};

export function plateImage(
  node: { id: string; name: string },
  index: number,
  src: string | undefined,
): PlateImage | null {
  if (src === undefined) return null;

  const bucket = IMAGE_BUCKETS[node.id] as ImageBucket | undefined;
  if (bucket === undefined) return null;

  const evidence = EVIDENCE[bucket];
  return {
    src,
    alt: `${node.name} — AI-generated reconstruction, ${evidence.alt}.`,
    tag: evidence.tag,
    // Only the first plate is in the viewport at load. Nothing is preloaded:
    // 27 more squares fetched up front would be the slow-connection failure
    // the marking rubric explicitly tests for.
    loading: index === 0 ? "eager" : "lazy",
  };
}
