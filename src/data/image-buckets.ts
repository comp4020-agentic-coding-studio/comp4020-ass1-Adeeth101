// How much fossil evidence constrains each node's generated still.
//
// Transcribed from the bucket table in docs/IMAGE-PROMPTS.md §01, which is the
// authority: that table was built by checking every node against real
// reference, and the three-way split exists because the two-way one in
// docs/IMAGE-STYLE.md §04 was not honest enough. A large group of nodes has a
// real named specimen that is *a jaw, or a handful of teeth, or a partial skull
// with no body* — calling those "fossil-constrained" and drawing a confident
// whole animal is invented precision, and calling them "inferred" throws away
// the constraint that does exist.
//
// This is not decoration. docs/IMAGE-STYLE.md §07 and this repo's CLAUDE.md
// both make labelling a hard rule: every generated image says on the page that
// it is generated, and says how much of it is evidence. The bucket is what the
// visible tag and the alt text are built from, which is why src/plate-image.ts
// refuses to render an image at all for a node that has no bucket here — an
// unlabelled AI reconstruction is worse than no image.
//
// `you` is deliberately absent: that node gets no image by design
// (docs/IMAGE-PROMPTS.md §04). Any drawn human is a specific human, and it is
// the one plate that cannot afford to depict a stranger.

export type ImageBucket =
  // A specimen constrains the body plan.
  | "A"
  // A specimen exists but constrains only part of the animal — a jaw, teeth,
  // an ankle — and the body plan is extrapolated from a relative some distance
  // away in time. Written A‡ in the docs.
  | "A-partial"
  // No fossil constrains the appearance. An honest visual hypothesis.
  | "B";

export const IMAGE_BUCKETS: Readonly<Record<string, ImageBucket>> = {
  luca: "B",
  eukaryote: "B",
  amorphea: "B",
  opisthokonta: "B",
  holozoa: "B",
  metazoa: "B",
  eumetazoa: "B",
  bilateria: "B",
  deuterostomia: "B",
  chordata: "A",
  vertebrata: "A",
  gnathostomata: "A",
  osteichthyes: "A",
  sarcopterygii: "A-partial",
  tetrapoda: "A",
  amniota: "A-partial",
  synapsida: "A-partial",
  mammaliaformes: "A-partial",
  eutheria: "A",
  boreoeutheria: "B",
  primates: "A-partial",
  haplorhini: "A",
  simiiformes: "A-partial",
  hominoidea: "A-partial",
  hominini: "A-partial",
  homo: "A-partial",
  "homo-sapiens": "A",
};
