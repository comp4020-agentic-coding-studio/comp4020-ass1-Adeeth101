// Notes placed inside the long empty stretches between plates.
//
// The pacing model (src/pacing.ts) turns elapsed time into scroll distance, so
// the gap between LUCA and the first eukaryote is eleven screens of nothing.
// That emptiness is the argument — it is what two and a third billion years
// actually feels like — but read cold it says "nothing happened here", which is
// false and is the opposite of the point.
//
// So these say what was happening, and why it leaves no trace. Every claim
// carries a source, same rule as src/data/lineage.ts: nothing here is written
// from memory, and where the science is contested the note says so rather than
// picking a number and sounding confident.
//
// `after` is the index of the node the spacer follows. `at` is the fraction of
// the way down that spacer, which the pacing model maps linearly onto elapsed
// time — so a note about an event at a known date is placed at the scroll
// position where the reader is actually passing that date.

export interface Interlude {
  after: number;
  at: number;
  text: string;
  source: string;
}

export const INTERLUDES: readonly Interlude[] = [
  {
    // ~3,970 Ma
    after: 0,
    at: 0.1,
    text: "Almost nothing along this stretch is dated by fossils. A single cell with no hard parts leaves nothing to find, so these ages are read from the genomes of the descendants instead — the differences between living species, run backwards.",
    source: "Kumar et al. 2022, Molecular Biology and Evolution 39:msac174 (TimeTree 5)",
  },
  {
    // ~3,235 Ma
    after: 0,
    at: 0.42,
    text: "Slow is the wrong word for it. Somewhere through here one lineage of bacteria learns to split water with sunlight. It changes no body plan and leaves no skeleton, and it is the single most consequential thing that happens on this page.",
    source: "Lyons, Reinhard & Planavsky 2014, Nature 506:307–315",
  },
  {
    // ~2,430 Ma
    after: 0,
    at: 0.77,
    text: "The Great Oxidation Event. Free oxygen starts accumulating in the air from about 2,426 million years ago: the largest change ever made to the composition of the atmosphere, and life is what made it.",
    source: "Gumsley et al. 2017, PNAS 114:1811–1816",
  },
  {
    // ~1,800 Ma
    after: 1,
    at: 0.33,
    text: "Then oxygen stalls. Through the middle of the Proterozoic it sits below a thousandth of today's level — low enough that nothing large or active is possible — and stays there for roughly a billion years while your ancestors remain single cells.",
    source: "Planavsky et al. 2014, Science 346:635–638",
  },
  {
    // ~640 Ma, in the run-up to animals
    after: 6,
    at: 0.45,
    text: "Bodies are new here, and soft. The reason the next few plates are inferred rather than reconstructed is that an animal without a shell or a skeleton has to be buried in exactly the wrong conditions to leave any trace at all.",
    source: "Discussed at each node in docs/IMAGE-PROMPTS.md §01",
  },
];
