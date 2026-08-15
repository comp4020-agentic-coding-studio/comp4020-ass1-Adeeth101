// The state machine behind "one unbroken line" — see docs/DESIGN.md §1.
// Deliberately knows nothing about the DOM or scrolling: it just tracks
// which node is current and enforces how that can change, so it's testable
// in milliseconds without a browser. Scroll and keyboard drivers translate
// real input into calls on this.

// Intentionally minimal — the state machine only needs to count nodes, not
// know their content. Phase 2's richer node type satisfies this structurally.
export interface LineageNode {
  id: string;
}

export interface LineageState {
  getCurrentIndex(): number;
  advance(): void;
  retreat(): void;
  goTo(index: number): void;
  setFromProgress(progress: number): void;
}

export function createLineage(nodes: LineageNode[]): LineageState {
  const lastIndex = nodes.length - 1;
  let current = 0;

  const clamp = (index: number): number => Math.min(Math.max(index, 0), lastIndex);

  return {
    getCurrentIndex: () => current,
    advance: () => {
      current = clamp(current + 1);
    },
    retreat: () => {
      current = clamp(current - 1);
    },
    goTo: (index: number) => {
      current = clamp(index);
    },
    setFromProgress: (progress: number) => {
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      current = clamp(Math.round(clampedProgress * lastIndex));
    },
  };
}
