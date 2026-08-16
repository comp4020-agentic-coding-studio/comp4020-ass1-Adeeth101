import { describe, expect, it } from "vitest";
import { eraFor, formatAge, plateFacts, romanNumeral } from "../src/plate-format";
import { LINEAGE } from "../src/data/lineage";

describe("romanNumeral", () => {
  it("renders known values", () => {
    expect(romanNumeral(1)).toBe("I");
    expect(romanNumeral(4)).toBe("IV");
    expect(romanNumeral(9)).toBe("IX");
    expect(romanNumeral(14)).toBe("XIV");
    expect(romanNumeral(28)).toBe("XXVIII");
    expect(romanNumeral(40)).toBe("XL");
    expect(romanNumeral(2026)).toBe("MMXXVI");
  });

  it("rejects non-positive or non-integer input", () => {
    expect(() => romanNumeral(0)).toThrow();
    expect(() => romanNumeral(-3)).toThrow();
    expect(() => romanNumeral(1.5)).toThrow();
  });
});

describe("eraFor", () => {
  it("matches the standard ICS boundaries against known dataset ages", () => {
    expect(eraFor(4200)).toBe("Hadean");
    expect(eraFor(1900)).toBe("Proterozoic");
    expect(eraFor(550)).toBe("Proterozoic");
    expect(eraFor(460)).toBe("Ordovician");
    expect(eraFor(365)).toBe("Devonian");
    expect(eraFor(318)).toBe("Carboniferous");
    expect(eraFor(225)).toBe("Triassic");
    expect(eraFor(160)).toBe("Jurassic");
    expect(eraFor(80)).toBe("Cretaceous");
    expect(eraFor(40)).toBe("Paleogene");
    expect(eraFor(7.5)).toBe("Neogene");
    expect(eraFor(0.3)).toBe("Quaternary");
    expect(eraFor(0)).toBe("Quaternary");
  });

  it("is inclusive at exact boundary values", () => {
    expect(eraFor(541)).toBe("Cambrian");
    expect(eraFor(541.01)).toBe("Proterozoic");
  });
});

describe("formatAge", () => {
  it("formats billions, millions, and thousands of years", () => {
    expect(formatAge(4200)).toBe("4.2 billion years");
    expect(formatAge(318)).toBe("318 million years");
    expect(formatAge(7.5)).toBe("7.5 million years");
    expect(formatAge(0.3)).toBe("300 thousand years");
    expect(formatAge(0)).toBe("0 thousand years");
  });
});

// Written before plateFacts existed, and observed failing first. main.ts used
// to emit `<strong>What changed in you:</strong> ${node.gained}`
// unconditionally, so a node with no defensible trait rendered a bold heading
// followed by nothing — a label promising a fact the page then didn't deliver.
//
// The contract this fixes is not "hide the empty string". It is: a plate never
// shows a label it cannot fill. That is a claim about the page, so it belongs
// in a test rather than in a conditional someone can quietly delete.
describe("plateFacts", () => {
  it("omits the heading entirely when there is no trait, rather than blanking it", () => {
    const facts = plateFacts({ gained: "", stillWithYou: undefined });
    expect(facts).toEqual([]);
  });

  it("still suppresses the heading when the field is whitespace, not just empty", () => {
    expect(plateFacts({ gained: "   ", stillWithYou: undefined })).toEqual([]);
  });

  it("keeps a trait when there is one", () => {
    const facts = plateFacts({ gained: "jaws", stillWithYou: undefined });
    expect(facts).toEqual([{ label: "What changed in you", text: "jaws" }]);
  });

  it("carries a still-with-you line on its own when the trait is empty", () => {
    const facts = plateFacts({ gained: "", stillWithYou: "your recurrent laryngeal nerve" });
    expect(facts).toEqual([{ label: "Still with you", text: "your recurrent laryngeal nerve" }]);
  });

  it("orders the trait before the still-with-you line", () => {
    const facts = plateFacts({ gained: "digits", stillWithYou: "count your fingers" });
    expect(facts.map((f) => f.label)).toEqual(["What changed in you", "Still with you"]);
  });

  it("never emits a labelled row with nothing in it, for any node in the real lineage", () => {
    for (const node of LINEAGE) {
      for (const fact of plateFacts(node)) {
        expect(fact.text.trim(), `${node.id}: "${fact.label}" rendered with no content`).not.toBe(
          "",
        );
      }
    }
  });
});
