// The page background as a continuous deep-time readout: the ground colour
// is a function of the interpolated age under the reader, not of which node
// is current. Pure arithmetic, no DOM — same separation as src/pacing.ts.
//
// Keyed to age rather than node index on purpose. Node index would step at
// each plate and hold flat across the spacers, which is exactly where the
// readout is needed most: an eleven-screen empty stretch should be visibly
// moving through time, and it can only do that if the colour tracks the same
// continuously-interpolated age the depth gauge already shows.
//
// CONTRAST IS A HARD CONSTRAINT, NOT A PREFERENCE. Every stop below is
// chosen so text stays at or above WCAG AA against it. Luminance is
// dominated by the green channel (coefficient 0.7152) and barely touched by
// blue (0.0722), so "cold" and "pale" are bought with blue, which is nearly
// free, while green is held down across every stop. That is why these read
// as distinctly different grounds while staying within a few percent of each
// other in luminance. spec/era-palette.test.ts asserts the AA floor against
// the real token values parsed out of styles.css, so a stop that breaks it
// fails the build rather than shipping.

export interface EraColorStop {
  // Age in Ma at which this colour is exact. Stops run oldest → youngest.
  ageMa: number;
  rgb: readonly [number, number, number];
  era: string;
  why: string;
}

export const ERA_COLOR_STOPS: readonly EraColorStop[] = [
  { ageMa: 4200, rgb: [28, 20, 16], era: "Hadean", why: "near-black with an iron cast — molten crust, no oxygen" },
  { ageMa: 2500, rgb: [26, 21, 17], era: "late Archean", why: "still warm and airless, a touch less iron" },
  // The Great Oxygenation Event. Deliberately only 200 Ma after the stop
  // above so the hue flips from warm to cold over a short scroll and reads
  // as an event rather than a drift — the single sharpest change on the page.
  { ageMa: 2300, rgb: [15, 26, 30], era: "post-GOE", why: "free oxygen: the ground turns cold and mineral" },
  { ageMa: 1600, rgb: [16, 26, 32], era: "Proterozoic", why: "deep ocean, long and quiet" },
  { ageMa: 541, rgb: [17, 26, 34], era: "Cambrian", why: "shallow, colder water" },
  { ageMa: 359, rgb: [24, 26, 16], era: "Carboniferous", why: "warming — swamp forest, high oxygen, green light" },
  { ageMa: 252, rgb: [30, 25, 17], era: "Permian", why: "the warmest ground on the page: arid supercontinent" },
  { ageMa: 66, rgb: [20, 26, 30], era: "Paleogene", why: "cooling again after the impact" },
  { ageMa: 0, rgb: [19, 26, 38], era: "Quaternary", why: "cold and pale-ish — ice-age blue, where you are" },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// The ground colour at an age. Clamps outside the table rather than
// extrapolating: ages beyond the ends are the first and last stop exactly.
export function backgroundRgbAt(ageMa: number): [number, number, number] {
  const stops = ERA_COLOR_STOPS;
  if (!Number.isFinite(ageMa)) return [...stops[stops.length - 1].rgb] as [number, number, number];
  if (ageMa >= stops[0].ageMa) return [...stops[0].rgb] as [number, number, number];
  const last = stops[stops.length - 1];
  if (ageMa <= last.ageMa) return [...last.rgb] as [number, number, number];

  let i = 0;
  while (i < stops.length - 2 && ageMa < stops[i + 1].ageMa) i++;
  const older = stops[i];
  const younger = stops[i + 1];
  const span = older.ageMa - younger.ageMa;
  const t = span > 0 ? (older.ageMa - ageMa) / span : 0;
  return [
    Math.round(lerp(older.rgb[0], younger.rgb[0], t)),
    Math.round(lerp(older.rgb[1], younger.rgb[1], t)),
    Math.round(lerp(older.rgb[2], younger.rgb[2], t)),
  ];
}

export function backgroundCssAt(ageMa: number): string {
  const [r, g, b] = backgroundRgbAt(ageMa);
  return `rgb(${r} ${g} ${b})`;
}

// ---- WCAG 2.1 contrast, so the constraint above is checkable ------------

export function relativeLuminance(rgb: readonly [number, number, number]): number {
  const [r, g, b] = rgb.map((channel) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Flattens a colour drawn at `alpha` over `backdrop`, so a rule using
// opacity can be checked at the colour a reader actually sees.
export function over(
  rgb: readonly [number, number, number],
  backdrop: readonly [number, number, number],
  alpha: number,
): [number, number, number] {
  return [
    Math.round(rgb[0] * alpha + backdrop[0] * (1 - alpha)),
    Math.round(rgb[1] * alpha + backdrop[1] * (1 - alpha)),
    Math.round(rgb[2] * alpha + backdrop[2] * (1 - alpha)),
  ];
}
