// The two in-tile frame sequences: which plates have one, which frame is
// showing, and how much scroll the morph is given to play out in.
//
// Pure, like src/pacing.ts and src/plate-image.ts, so the mapping from scroll
// to frame is testable without a DOM or a scrollbar. The DOM side owns no
// arithmetic at all — it reads a rect, calls runwayProgress, calls
// frameIndexAt, and sets a src.
//
// Three rules here are contract rather than preference:
//
// 1. **No easing.** The frame index is a linear function of scroll position.
//    An eased swap would make the animal appear to accelerate on its own,
//    which reads as playback — and the whole point is that the reader is
//    driving, not watching. CLAUDE.md rules out <video> for exactly this.
// 2. **The sequence never replaces the described image.** It is decorative and
//    aria-hidden; the plate's real <img> keeps the alt and the evidence tag it
//    already had from src/plate-image.ts. 52 frames must not become 52 alt
//    texts.
// 3. **The still is the LAST frame, not the first.** The plate is about what
//    the animal became, not what it started as. Shipping frame one put a
//    lobe-finned fish on the plate titled "The first tetrapod" — and because
//    prefers-reduced-motion hides the sequence, that fish was the whole plate
//    for any reader who has reduced motion switched on.

export interface FrameSequence {
  // How many frames were extracted. Asserted against what is on disk in
  // spec/plate-frames.test.ts, so a half-copied folder fails the build rather
  // than silently freezing part-way through the morph.
  frames: number;
  // What the motion actually shows, for the commit record and for anyone
  // deciding later whether the sequence earns its bytes.
  shows: string;
}

export const FRAME_SEQUENCES: Readonly<Record<string, FrameSequence>> = {
  tetrapoda: {
    frames: 52,
    shows: "a lobe-finned fish body becoming a four-limbed one",
  },
  homo: {
    frames: 52,
    shows: "a hominin skeleton moving from a stooped posture to an upright one",
  },
};

// How tall a sequence plate's scroll runway is, and how far down the viewport
// the plate pins while the reader scrolls through it. Both in viewport heights.
//
// The first version had no runway at all: the sequence was driven by the row's
// own traverse of the viewport, which on a 73,000px page came to 1,016px —
// 1.4% of the scroll, one frame every 20px. The morph was over before it read
// as motion. With a runway the plate pins and the reader scrubs it deliberately.
export const RUNWAY_VH = 320;
export const RUNWAY_STICKY_VH = 10;

// Progress through a pinned runway, 0 to 1.
//
// Measured over the interval the plate is actually pinned — from the runway's
// top reaching the sticky offset, to its bottom reaching the offset plus the
// plate's own height. Using the runway's full height instead would run the last
// frames after the plate had already unpinned and started scrolling away, so
// the end of the morph would happen off-screen.
export function runwayProgress(
  rectTop: number,
  runwayHeight: number,
  rowHeight: number,
  stickyOffset: number,
): number {
  const travel = runwayHeight - rowHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, (stickyOffset - rectTop) / travel));
}

// Linear, clamped, and never out of range: progress of exactly 1 must land on
// the last frame rather than one past it.
export function frameIndexAt(progress: number, frames: number): number {
  if (frames <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(frames - 1, Math.floor(clamped * frames));
}

// Frame files are named f001-<width>.webp, one-based, matching ffmpeg's
// output numbering so the folder can be regenerated without renaming.
export function frameFileStem(index: number): string {
  return `f${String(index + 1).padStart(3, "0")}`;
}
