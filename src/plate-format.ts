// Pure formatting helpers for the depth gauge and plate numbering (Museum
// Editorial spec §06). No DOM — unit-tested directly, same separation as
// src/lineage-state.ts.

const ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function romanNumeral(value: number): string {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`romanNumeral expects a positive integer, got ${value}`);
  }
  let remaining = value;
  let result = "";
  for (const [amount, numeral] of ROMAN) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }
  return result;
}

// Standard ICS geologic time scale boundaries (International
// Chronostratigraphic Chart) — a general reference table, independent of any
// single node's own sourced age in src/data/lineage.ts. Ages in Ma, ascending
// by each era's upper (older) boundary.
const ERA_BOUNDARIES: [number, string][] = [
  [2.58, "Quaternary"],
  [23.03, "Neogene"],
  [66, "Paleogene"],
  [145, "Cretaceous"],
  [201.3, "Jurassic"],
  [251.9, "Triassic"],
  [298.9, "Permian"],
  [358.9, "Carboniferous"],
  [419.2, "Devonian"],
  [443.8, "Silurian"],
  [485.4, "Ordovician"],
  [541, "Cambrian"],
  [2500, "Proterozoic"],
  [4000, "Archean"],
];

export function eraFor(ageMa: number): string {
  for (const [max, name] of ERA_BOUNDARIES) {
    if (ageMa <= max) return name;
  }
  return "Hadean";
}

// The body rows of a plate (spec §05), decided here rather than in the render
// loop so the rule is testable without a DOM.
//
// The rule: a plate never shows a label it cannot fill. Three nodes in this
// dataset — Amorphea, Holozoa, Boreoeutheria — have no trait that survives the
// science-accuracy rule in CLAUDE.md, and each says so in its own `note`. Their
// emptiness is a finding, not a gap waiting to be filled, so the page has to
// handle it as a real case: the heading is omitted entirely, not printed above
// nothing.
export interface PlateFact {
  label: string;
  text: string;
}

export function plateFacts(node: { gained: string; stillWithYou?: string }): PlateFact[] {
  const rows: [string, string | undefined][] = [
    ["What changed in you", node.gained],
    ["Still with you", node.stillWithYou],
  ];
  return rows
    .filter(([, text]) => text !== undefined && text.trim() !== "")
    .map(([label, text]) => ({ label, text: text as string }));
}

export function formatAge(ageMa: number): string {
  if (ageMa >= 1000) {
    const ga = ageMa / 1000;
    return `${ga >= 10 ? Math.round(ga) : ga.toFixed(1)} billion years`;
  }
  if (ageMa >= 1) {
    return `${ageMa >= 10 ? Math.round(ageMa) : ageMa.toFixed(1)} million years`;
  }
  return `${Math.round(ageMa * 1000)} thousand years`;
}
