import { describe, expect, it } from "vitest";
import { createLineage, type LineageNode } from "../src/lineage-state";

// The core interaction, stated testably (docs/DESIGN.md §1):
//
//   As the visitor moves through the lineage, exactly one node is current.
//   Movement never skips a node, never wraps, and every node is reachable.
//
// This is pure state — no DOM, no scrolling — so vitest can assert it
// directly, without a browser. Written before src/lineage-state.ts has a
// real implementation: every test below fails against the stub, which is
// the intended red baseline for Phase 2.

const nodes: LineageNode[] = Array.from({ length: 6 }, (_, i) => ({
  id: `n${i}`,
}));

describe("lineage state machine", () => {
  it("starts at the first node", () => {
    const state = createLineage(nodes);
    expect(state.getCurrentIndex()).toBe(0);
  });

  it("always has exactly one valid current index", () => {
    const state = createLineage(nodes);
    const ops = [
      () => state.advance(),
      () => state.retreat(),
      () => state.goTo(3),
      () => state.setFromProgress(0.5),
      () => state.advance(),
    ];
    for (const op of ops) {
      op();
      const i = state.getCurrentIndex();
      expect(Number.isInteger(i)).toBe(true);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(nodes.length);
    }
  });

  it("advance() steps forward by exactly one node", () => {
    const state = createLineage(nodes);
    state.goTo(2);
    state.advance();
    expect(state.getCurrentIndex()).toBe(3);
  });

  it("advance() at the last node is a no-op, never wraps", () => {
    const state = createLineage(nodes);
    state.goTo(nodes.length - 1);
    state.advance();
    expect(state.getCurrentIndex()).toBe(nodes.length - 1);
  });

  it("retreat() steps backward by exactly one node", () => {
    const state = createLineage(nodes);
    state.goTo(2);
    state.retreat();
    expect(state.getCurrentIndex()).toBe(1);
  });

  it("retreat() at the first node is a no-op, never goes negative", () => {
    const state = createLineage(nodes);
    state.goTo(0);
    state.retreat();
    expect(state.getCurrentIndex()).toBe(0);
  });

  it("setFromProgress() is monotonic: non-decreasing progress never decreases the index", () => {
    const state = createLineage(nodes);
    let lastIndex = -1;
    for (const p of [0, 0.2, 0.2, 0.4, 0.6, 0.6, 0.8, 1]) {
      state.setFromProgress(p);
      const i = state.getCurrentIndex();
      expect(i).toBeGreaterThanOrEqual(lastIndex);
      lastIndex = i;
    }
  });

  it("setFromProgress(0) and setFromProgress(1) reach the first and last node", () => {
    const state = createLineage(nodes);
    state.setFromProgress(0);
    expect(state.getCurrentIndex()).toBe(0);
    state.setFromProgress(1);
    expect(state.getCurrentIndex()).toBe(nodes.length - 1);
  });

  it("every node is reachable by repeated advance() from the start", () => {
    const state = createLineage(nodes);
    const visited = new Set([state.getCurrentIndex()]);
    for (let step = 0; step < nodes.length - 1; step++) {
      state.advance();
      visited.add(state.getCurrentIndex());
    }
    expect(visited.size).toBe(nodes.length);
    expect(state.getCurrentIndex()).toBe(nodes.length - 1);
  });
});
