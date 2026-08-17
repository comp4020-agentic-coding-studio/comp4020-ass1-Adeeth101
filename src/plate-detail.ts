// When a plate shows its detail, and what "detail" means.
//
// Collapsed, a plate is a label: its number, its name, its age, and its
// picture. Expanded, it adds everything that is an argument rather than an
// identity — which cousins leave here, what changed in you, what is still with
// you, and the source the claim rests on.
//
// The rule is here rather than in CSS because three separate inputs decide it
// and they arrive from three different places: `current` from the scroll and
// keyboard drivers, `hovered` from pointer events, `focused` from focus
// events. A `:hover, :focus-within, .plate-on` selector would express the same
// thing, but nothing could then test it, and the DOM would have no single
// attribute for the transition listener to watch — which matters because the
// depth gauge's anchors have to be recomputed when a plate finishes resizing.

export interface PlateDetailInput {
  isCurrent: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

// Any one of the three is enough. Reading a plate is not the same as being at
// it: a reader can hover a plate above the fold, or tab to one, and in both
// cases they have asked for it and should get all of it.
export function plateExpanded(input: PlateDetailInput): boolean {
  return input.isCurrent || input.isHovered || input.isFocused;
}
