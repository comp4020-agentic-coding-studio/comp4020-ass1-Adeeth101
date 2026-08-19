// Keeping the deep-time date markers out of the interludes.
//
// Both are absolutely positioned into the same spacer, in the same column, at
// offsets that come from two unrelated sources: markers from the pacing model
// at a regular cadence, interludes from src/data/interludes.ts at whatever
// fraction the date they describe falls on. Nothing stopped them landing on
// top of each other, and in the Proterozoic spacer one did.
//
// The fix is a reserved band rather than a nudged offset. A nudge is tuned
// against one viewport and one spacer, and there are eleven spacers whose
// marker cadence differs and two viewports that wrap the prose to different
// heights — so it would come apart the moment any of those changed. A band is
// computed from the note's *measured* height at the current width, and any
// marker falling inside it is not placed at all.
//
// Pure, so the rule is testable without a DOM; main.ts does the measuring.

export interface Band {
  startVh: number;
  endVh: number;
}

// Clearance above and below a note, in viewport heights. Markers are a single
// line of small caps, so this only has to be big enough that one does not read
// as part of the note's own block.
export const MARK_CLEARANCE_VH = 3.5;

export function reservedBand(topVh: number, heightVh: number, padVh = MARK_CLEARANCE_VH): Band {
  return { startVh: topVh - padVh, endVh: topVh + heightVh + padVh };
}

export function clashesWithNote(markVh: number, bands: readonly Band[]): boolean {
  return bands.some((band) => markVh >= band.startVh && markVh <= band.endVh);
}
