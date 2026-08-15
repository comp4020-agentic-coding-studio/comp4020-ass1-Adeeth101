import { describe, expect, it } from "vitest";
import { eraFor, formatAge, romanNumeral } from "../src/plate-format";

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
