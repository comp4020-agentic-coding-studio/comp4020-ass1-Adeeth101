// Geometry for the two chart plates. Pure: takes numbers, returns numbers and
// path strings, touches no DOM. Same separation as src/pacing.ts, and for the
// same reason — a chart that plots the wrong thing still renders, so the only
// way to know the mapping is right is to test it directly.
//
// Hand-built rather than pulled from a charting library: two charts do not
// justify a dependency, and every default would need overriding to sit in this
// page's visual language anyway.

export interface Box {
  width: number;
  height: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
}

export const CHART_BOX: Box = {
  width: 720,
  height: 260,
  // Wide enough for the oxygen chart's longest tick, "0.0001%", which was
  // being clipped at the left edge of the viewBox at 46.
  padLeft: 64,
  padRight: 14,
  padTop: 16,
  padBottom: 34,
};

// Time runs oldest-on-the-left, matching the direction the reader is already
// travelling down the page.
export function timeX(ma: number, oldestMa: number, youngestMa: number, box: Box): number {
  const span = oldestMa - youngestMa;
  if (span <= 0) return box.padLeft;
  const t = (oldestMa - ma) / span;
  const inner = box.width - box.padLeft - box.padRight;
  return box.padLeft + Math.min(1, Math.max(0, t)) * inner;
}

// Oxygen spans five orders of magnitude, so a linear axis would flatten
// everything before the Phanerozoic onto the baseline and hide the entire
// point of the chart.
export function logY(pal: number, minPal: number, maxPal: number, box: Box): number {
  if (pal <= 0 || minPal <= 0 || maxPal <= minPal) return box.height - box.padBottom;
  const lo = Math.log10(minPal);
  const hi = Math.log10(maxPal);
  const t = (Math.log10(pal) - lo) / (hi - lo);
  const inner = box.height - box.padTop - box.padBottom;
  return box.height - box.padBottom - Math.min(1, Math.max(0, t)) * inner;
}

// Linear axis, used for percentages.
export function linearY(value: number, min: number, max: number, box: Box): number {
  if (max <= min) return box.height - box.padBottom;
  const t = (value - min) / (max - min);
  const inner = box.height - box.padTop - box.padBottom;
  return box.height - box.padBottom - Math.min(1, Math.max(0, t)) * inner;
}

// Evenly spaced slots across the plot area, one per event, each returning its
// centre and the width available to it.
export function slots(count: number, box: Box): { centre: number; width: number }[] {
  if (count <= 0) return [];
  const inner = box.width - box.padLeft - box.padRight;
  const each = inner / count;
  return Array.from({ length: count }, (_, i) => ({
    centre: box.padLeft + each * (i + 0.5),
    width: each * 0.52,
  }));
}

export function polyline(points: readonly { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}
