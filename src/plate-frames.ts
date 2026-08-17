// The two in-tile frame sequences: which plates have one, and which frame is
// showing at a given scroll position.
//
// Pure, like src/pacing.ts and src/plate-image.ts, so the mapping from scroll
// to frame is testable without a DOM or a scrollbar. The DOM side of this owns
// no arithmetic at all — it reads a rect, calls sequenceProgress, calls
// frameIndexAt, and sets a src.
//
// Two rules here are contract rather than preference:
//
// 1. **No easing.** The frame index is a linear function of scroll position.
//    An eased swap would make the animal appear to accelerate on its own,
//    which reads as playback — and the whole point is that the reader is
//    driving, not watching. CLAUDE.md rules out <video> for exactly this.
// 2. **The sequence never replaces the described image.** It is decorative and
//    aria-hidden; the plate's real <img> keeps the alt and the evidence tag it
//    already had from src/plate-image.ts. 52 frames must not become 52 alt
//    texts.

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

// How far the row has travelled through the viewport: 0 as its top edge enters
// from below, 1 as its bottom edge leaves past the top. Using the whole
// traverse rather than only the time the row is centred means the sequence has
// a full screen-height of scroll to play out in, which at 52 frames is roughly
// one frame every 20 pixels — fine enough that it reads as motion.
export function sequenceProgress(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
): number {
  const span = rectHeight + viewportHeight;
  if (span <= 0) return 0;
  const travelled = (viewportHeight - rectTop) / span;
  return Math.min(1, Math.max(0, travelled));
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
