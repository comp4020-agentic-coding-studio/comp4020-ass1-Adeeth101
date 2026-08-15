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
  throw new Error(`not implemented — ${nodes.length} nodes given`);
}
