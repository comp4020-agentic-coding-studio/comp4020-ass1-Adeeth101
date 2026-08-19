// The two chart plates, and the data behind them.
//
// Same science rule as src/data/lineage.ts: every number here was read off a
// named paper, and where the published estimates disagree the chart says so
// instead of drawing a confident line through the middle. That is not caution
// for its own sake — a chart is the most confident-looking thing on a page, and
// this one is about a period where the honest answer is often "bounded, not
// measured".

export interface OxygenSegment {
  fromMa: number;
  toMa: number;
  // Upper bound on atmospheric O2 as a fraction of the present level (PAL).
  fromPal: number;
  toPal: number;
  // Solid where a proxy actually constrains the ceiling; dashed where the
  // published range is wide enough that a line would be an invention.
  constrained: boolean;
}

// Upper bound, not a best estimate. Three points on this curve are pinned by
// independent proxies; the stretches between them are drawn dashed because the
// published estimates genuinely disagree, and the mid-Proterozoic ceiling in
// particular is still argued over.
export const OXYGEN_CURVE: readonly OxygenSegment[] = [
  // Sulfur mass-independent fractionation persists, so free O2 is negligible.
  { fromMa: 4200, toMa: 2426, fromPal: 1e-5, toPal: 1e-5, constrained: true },
  // The Great Oxidation Event. How high it went, and whether it overshot
  // modern levels before crashing back, is exactly what is contested.
  { fromMa: 2426, toMa: 1600, fromPal: 1e-5, toPal: 1e-3, constrained: false },
  // Chromium isotopes cap the mid-Proterozoic at 0.1% of present.
  { fromMa: 1600, toMa: 900, fromPal: 1e-3, toPal: 1e-3, constrained: true },
  // Neoproterozoic oxygenation, then the Phanerozoic.
  { fromMa: 900, toMa: 400, fromPal: 1e-3, toPal: 1, constrained: false },
  { fromMa: 400, toMa: 0, fromPal: 1, toPal: 1, constrained: true },
];

export const OXYGEN_MARKERS: readonly { ma: number; label: string }[] = [
  { ma: 2426, label: "Great Oxidation Event begins" },
  { ma: 1250, label: "still under a thousandth of today's" },
];

export interface ExtinctionEvent {
  name: string;
  ma: number;
  // Percentage of marine species lost. null where the cited source explicitly
  // declines to estimate it — which is data, not a gap to be filled in.
  speciesLostPct: number | null;
  declinedWhy?: string;
}

// Stanley 2016 is used alone rather than stitched together with other studies.
// Mixing datasets is how you end up with five numbers that look comparable and
// are not; two of the Big Five simply have no figure in this analysis, and the
// chart shows that rather than borrowing one from somewhere else.
export const BIG_FIVE: readonly ExtinctionEvent[] = [
  { name: "End-Ordovician", ma: 445, speciesLostPct: 42 },
  {
    name: "Late Devonian",
    ma: 372,
    speciesLostPct: null,
    declinedWhy: "origination-rate data too poor to support an estimate",
  },
  { name: "End-Permian", ma: 252, speciesLostPct: 81 },
  {
    name: "End-Triassic",
    ma: 201,
    speciesLostPct: null,
    declinedWhy: "timing and list of marine victims still disputed",
  },
  { name: "End-Cretaceous", ma: 66, speciesLostPct: 40 },
];

export const FIGURE_SOURCES = {
  oxygen:
    "Bounds from Lyons, Reinhard & Planavsky 2014, Nature 506:307–315; onset date from Gumsley et al. 2017, PNAS 114:1811–1816; mid-Proterozoic ceiling from Planavsky et al. 2014, Science 346:635–638.",
  extinctions:
    "Stanley 2016, PNAS 113:E6325–E6334 (marine species, one analysis throughout). That the Big Five is a continuum rather than a set of five comparable events: Marshall 2023, Cambridge Prisms: Extinction 1:e5.",
} as const;
