import { describe, expect, it } from "vitest";
import { LINEAGE } from "../src/data/lineage";

// Catches transcription errors for free: a wrong age, a missing source, or
// a duplicated id fails here before it ever reaches the page. Per this
// repo's CLAUDE.md, no node's age or "stillWithYou" claim is taken from
// memory — every one has a source, checked in docs/DESIGN.md's Phase 2
// research pass — so this test is really checking that the sourcing
// discipline held, not just that the array shape is right.

describe("lineage data", () => {
  it("has all 28 nodes", () => {
    expect(LINEAGE.length).toBe(28);
  });

  it("has a unique id for every node", () => {
    const ids = LINEAGE.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty id, name, and source for every node except the last", () => {
    for (const node of LINEAGE.slice(0, -1)) {
      expect(node.id.trim(), `${node.id}: empty id`).not.toBe("");
      expect(node.name.trim(), `${node.id}: empty name`).not.toBe("");
      expect(node.source.trim(), `${node.id}: missing source`).not.toBe("");
    }
  });

  it("has ages that strictly decrease from LUCA to You", () => {
    for (let i = 1; i < LINEAGE.length; i++) {
      const prev = LINEAGE[i - 1];
      const curr = LINEAGE[i];
      expect(
        curr.age,
        `${curr.id} (${curr.age} Ma) is not younger than ${prev.id} (${prev.age} Ma)`,
      ).toBeLessThan(prev.age);
    }
  });

  it("has every node's age within its own range", () => {
    for (const node of LINEAGE) {
      const [min, max] = node.ageRange;
      expect(min, `${node.id}: range min exceeds max`).toBeLessThanOrEqual(max);
      expect(node.age, `${node.id}: age below its own range`).toBeGreaterThanOrEqual(min);
      expect(node.age, `${node.id}: age above its own range`).toBeLessThanOrEqual(max);
    }
  });

  it("gives every branch a matching list of examples", () => {
    for (const node of LINEAGE) {
      const hasBranch = node.branch.trim() !== "";
      const hasExamples = node.branchExamples.length > 0;
      expect(
        hasBranch,
        `${node.id}: branch text and branchExamples disagree on whether a branch leaves here`,
      ).toBe(hasExamples);
    }
  });

  it("starts at LUCA and ends at You", () => {
    expect(LINEAGE[0].id).toBe("luca");
    expect(LINEAGE[LINEAGE.length - 1].id).toBe("you");
    expect(LINEAGE[LINEAGE.length - 1].age).toBe(0);
  });
});
