// Where the two chart plates sit on the line, and what they are for.
//
// These are NOT lineage nodes. The spine is the human lineage only (CLAUDE.md
// scope rule), the dataset stays 28 nodes, the plate numbers still run I to
// XXVIII, and the depth gauge still counts only ancestors. A chart plate is an
// annotation placed on the line at the date it is about — the same status as an
// interlude, just with a figure in it.
//
// Each one has to earn its place against the brief's "one strong idea and
// nothing else". Both do, in the same way: the page's claim is that this line
// never broke, and each chart is a thing that could have broken it. The oxygen
// chart is the reason the line spent two billion years as single cells. The
// extinction chart is five occasions on which most of everything died and this
// line did not.

export interface FigurePlate {
  id: string;
  // Rendered after the spacer that follows this lineage node index.
  after: number;
  title: string;
  standfirst: string;
  // The reading of the chart — what a viewer should take from it, including
  // what it does not show.
  body: readonly string[];
  // Shown with the chart, outside the collapse. Anything a reader needs in
  // order to decode the marks has to live here: the detail below is closed by
  // default, so a key hidden inside it is a key nobody reads.
  legend?: readonly { mark: "solid" | "dashed" | "open"; text: string }[];
  sourceKey: "oxygen" | "extinctions";
}

export const FIGURE_PLATES: readonly FigurePlate[] = [
  {
    id: "figure-oxygen",
    after: 0,
    title: "Why the first half takes so long",
    standfirst: "Atmospheric oxygen, as an upper bound, against time",
    body: [
      "For roughly the first two billion years of this page there is no free oxygen worth speaking of. Without it there is no energy budget for a large, active, many-celled body, so there are no large, active, many-celled bodies — and the line above you spends that entire stretch as single cells.",
      "The chart is drawn as a ceiling rather than a measurement, and it is solid only where a proxy actually pins that ceiling: sulfur isotopes before the Great Oxidation Event, chromium isotopes through the middle Proterozoic. Where the published estimates disagree it is dashed, because a confident line through a contested billion years would be the most dishonest thing on this page.",
    ],
    legend: [
      { mark: "solid", text: "a proxy constrains the ceiling" },
      { mark: "dashed", text: "published estimates disagree" },
    ],
    sourceKey: "oxygen",
  },
  {
    id: "figure-extinctions",
    after: 14,
    title: "Five times most things died",
    standfirst: "Marine species lost in the Big Five mass extinctions",
    body: [
      "Every ancestor on this page came through all five of these. That is not luck exactly, but it is not merit either: survival at these boundaries correlates with being small, widespread and undemanding far more than with being well adapted to anything.",
      "Two of the five are drawn as open slots. The analysis used here declines to estimate the Late Devonian and the end-Triassic — the first because the data behind the rates is too poor, the second because the timing and the list of victims are still argued over. They are left empty rather than filled from a different study, because five numbers from four sources would look comparable and would not be.",
      "The grouping itself is softer than it sounds. On a per-capita reading the Big Five are not the five biggest events in the fossil record, and extinction intensity is a continuum rather than a set.",
    ],
    legend: [
      { mark: "solid", text: "marine species lost" },
      { mark: "open", text: "this analysis declines to estimate" },
    ],
    sourceKey: "extinctions",
  },
];
