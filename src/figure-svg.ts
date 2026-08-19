// The two charts, as SVG markup strings. Pure — returns text, touches no DOM —
// so what gets drawn is testable without a browser, the same way
// src/charts.ts makes the geometry testable.
//
// Inline SVG rather than a charting library, and inline in the document rather
// than an <img>, so the marks inherit the page's own custom properties and
// change colour with the era ground like everything else does.
//
// Both charts carry role="img" and an aria-label that states the finding rather
// than describing the picture: a screen-reader user needs "oxygen stayed below
// a thousandth of today's level for a billion years", not "line chart".

import { BIG_FIVE, OXYGEN_CURVE, OXYGEN_MARKERS } from "./data/figures";
import { CHART_BOX, linearY, logY, slots, timeX } from "./charts";

const B = CHART_BOX;
const MIN_PAL = 1e-6;
const MAX_PAL = 1;
const OLDEST = 4200;

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function axisLabel(x: number, y: number, text: string, anchor = "middle"): string {
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="chart-tick">${esc(text)}</text>`;
}

export function oxygenChartSvg(): string {
  const parts: string[] = [];

  // Horizontal gridlines, one per two orders of magnitude. Labels are written
  // out rather than computed: toExponential turned 1% into "1e+0%", which is
  // both wrong-looking and unreadable on a chart whose whole job is to make
  // five orders of magnitude legible.
  const PAL_LABELS: [number, string][] = [
    [1e-6, "0.0001%"],
    [1e-4, "0.01%"],
    [1e-2, "1%"],
    [1, "today"],
  ];
  for (const [pal, label] of PAL_LABELS) {
    const y = logY(pal, MIN_PAL, MAX_PAL, B);
    parts.push(
      `<line x1="${B.padLeft}" y1="${y.toFixed(1)}" x2="${B.width - B.padRight}" y2="${y.toFixed(1)}" class="chart-grid" />`,
    );
    parts.push(axisLabel(B.padLeft - 6, y + 3.5, label, "end"));
  }

  // Time ticks.
  for (const ma of [4000, 3000, 2000, 1000, 0]) {
    const x = timeX(ma, OLDEST, 0, B);
    parts.push(axisLabel(x, B.height - B.padBottom + 16, ma === 0 ? "now" : `${ma / 1000} Ga`));
  }

  // The curve. Solid where a proxy actually constrains the ceiling, dashed
  // where the published estimates are too far apart to draw a line honestly.
  for (const seg of OXYGEN_CURVE) {
    const x1 = timeX(seg.fromMa, OLDEST, 0, B);
    const x2 = timeX(seg.toMa, OLDEST, 0, B);
    const y1 = logY(seg.fromPal, MIN_PAL, MAX_PAL, B);
    const y2 = logY(seg.toPal, MIN_PAL, MAX_PAL, B);
    const floor = B.height - B.padBottom;
    parts.push(
      `<path d="M${x1.toFixed(1)} ${floor} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x2.toFixed(1)} ${floor} Z" class="chart-area${seg.constrained ? "" : " is-open"}" />`,
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="chart-line${seg.constrained ? "" : " is-open"}" />`,
    );
  }

  // Event markers, drawn as a rule down to the curve so they read as "at this
  // date" rather than floating.
  OXYGEN_MARKERS.forEach((mark, i) => {
    const x = timeX(mark.ma, OLDEST, 0, B);
    // Labels on the right half read leftwards, or they run off the plot; and
    // each one sits a line lower than the last, because two anchored at the
    // same height overlapped into an unreadable overprint.
    const past = x > B.width / 2;
    parts.push(
      `<line x1="${x.toFixed(1)}" y1="${B.padTop}" x2="${x.toFixed(1)}" y2="${B.height - B.padBottom}" class="chart-mark" />`,
      `<text x="${(past ? x - 5 : x + 5).toFixed(1)}" y="${B.padTop + 11 + i * 17}" text-anchor="${past ? "end" : "start"}" class="chart-note">${esc(mark.label)}</text>`,
    );
  });

  const label =
    "Upper bound on atmospheric oxygen against time. Essentially none before 2,426 million years ago, " +
    "then still below a thousandth of the present level through the middle of the Proterozoic, " +
    "reaching today's level only in the last few hundred million years. Solid where a proxy constrains " +
    "the ceiling, dashed where published estimates disagree.";

  return (
    `<svg viewBox="0 0 ${B.width} ${B.height}" class="chart-svg" role="img" aria-label="${esc(label)}">` +
    parts.join("") +
    "</svg>"
  );
}

export function extinctionChartSvg(): string {
  const parts: string[] = [];
  const floor = B.height - B.padBottom;

  for (const pct of [0, 25, 50, 75, 100]) {
    const y = linearY(pct, 0, 100, B);
    parts.push(
      `<line x1="${B.padLeft}" y1="${y.toFixed(1)}" x2="${B.width - B.padRight}" y2="${y.toFixed(1)}" class="chart-grid" />`,
      axisLabel(B.padLeft - 6, y + 3.5, `${pct}%`, "end"),
    );
  }

  const lanes = slots(BIG_FIVE.length, B);
  BIG_FIVE.forEach((event, i) => {
    const lane = lanes[i];
    const x = lane.centre - lane.width / 2;

    if (event.speciesLostPct === null) {
      // An open, hatched slot running the full height. Deliberately NOT a bar
      // of zero: this source declines to estimate these two, and a zero-height
      // bar would show them as having killed nothing.
      parts.push(
        `<rect x="${x.toFixed(1)}" y="${B.padTop}" width="${lane.width.toFixed(1)}" height="${(floor - B.padTop).toFixed(1)}" class="chart-bar is-unknown" />`,
        `<text x="${lane.centre.toFixed(1)}" y="${(B.padTop + (floor - B.padTop) / 2).toFixed(1)}" text-anchor="middle" class="chart-note">no estimate</text>`,
      );
    } else {
      const y = linearY(event.speciesLostPct, 0, 100, B);
      parts.push(
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${lane.width.toFixed(1)}" height="${(floor - y).toFixed(1)}" class="chart-bar" />`,
        `<text x="${lane.centre.toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" class="chart-value">${event.speciesLostPct}%</text>`,
      );
    }

    parts.push(
      axisLabel(lane.centre, floor + 15, event.name),
      axisLabel(lane.centre, floor + 27, `${event.ma} Ma`),
    );
  });

  const label =
    "Marine species lost in the Big Five mass extinctions, as estimated by one analysis throughout. " +
    "End-Ordovician 42 percent, end-Permian 81 percent, end-Cretaceous 40 percent. The Late Devonian " +
    "and end-Triassic are shown as open slots because that analysis declines to estimate them. " +
    "Your line survived all five.";

  return (
    `<svg viewBox="0 0 ${B.width} ${B.height}" class="chart-svg" role="img" aria-label="${esc(label)}">` +
    parts.join("") +
    "</svg>"
  );
}
