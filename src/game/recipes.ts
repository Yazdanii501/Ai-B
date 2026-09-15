import type { ElementDef, ElementId, Recipe } from "./types";

export const ELEMENTS: Record<ElementId, ElementDef> = {
  fire: {
    id: "fire",
    name: "Fire",
    tier: 0,
    isRaw: true,
    color: "#E8703A",
    glyph: "fire",
    lore: "The first tool. It does not create — it only changes what touches it.",
  },
  water: {
    id: "water",
    name: "Water",
    tier: 0,
    isRaw: true,
    color: "#6FB3C9",
    glyph: "water",
    lore: "Takes the shape of whatever holds it. Alchemists trust it for that.",
  },
  earth: {
    id: "earth",
    name: "Earth",
    tier: 0,
    isRaw: true,
    color: "#8B6B4A",
    glyph: "earth",
    lore: "Slow, heavy, patient. Everything solid remembers being earth.",
  },
  air: {
    id: "air",
    name: "Air",
    tier: 0,
    isRaw: true,
    color: "#C9D6E3",
    glyph: "air",
    lore: "Unseen until it moves something. The lab breathes because of it.",
  },

  vapour: {
    id: "vapour",
    name: "Vapour",
    tier: 1,
    isRaw: false,
    color: "#BFE3E0",
    glyph: "ring",
    glyphSeed: 1,
    lore: "Water that forgot its shape. It rises because fire told it to.",
  },
  moltenMetal: {
    id: "moltenMetal",
    name: "Molten Metal",
    tier: 1,
    isRaw: false,
    color: "#E85D2B",
    glyph: "ring",
    glyphSeed: 2,
    lore: "Earth pushed past its patience. It will hold any shape you give it, briefly.",
  },
  clay: {
    id: "clay",
    name: "Clay",
    tier: 1,
    isRaw: false,
    color: "#B5714A",
    glyph: "ring",
    glyphSeed: 3,
    lore: "Earth and water agree to disagree. The oldest compromise there is.",
  },
  spark: {
    id: "spark",
    name: "Spark",
    tier: 1,
    isRaw: false,
    color: "#F4E7A1",
    glyph: "ring",
    glyphSeed: 4,
    lore: "A small, sudden fire with nothing left to burn. Gone before it's understood.",
  },
  mist: {
    id: "mist",
    name: "Mist",
    tier: 1,
    isRaw: false,
    color: "#A9C2C9",
    glyph: "ring",
    glyphSeed: 5,
    lore: "Water carried by air, going nowhere in particular. Cold on the glass.",
  },
  dust: {
    id: "dust",
    name: "Dust",
    tier: 1,
    isRaw: false,
    color: "#C4A876",
    glyph: "ring",
    glyphSeed: 6,
    lore: "Earth worn thin enough to fly. What's left when nothing holds together.",
  },

  salt: {
    id: "salt",
    name: "Salt",
    tier: 2,
    isRaw: true,
    color: "#EDEAE0",
    glyph: "salt",
    lore: "The body. It preserves what would otherwise rot or drift apart.",
  },
  mercury: {
    id: "mercury",
    name: "Mercury",
    tier: 2,
    isRaw: true,
    color: "#C7CDD1",
    glyph: "mercury",
    lore: "The spirit. Liquid metal that answers to no fixed shape.",
  },
  sulphur: {
    id: "sulphur",
    name: "Sulphur",
    tier: 2,
    isRaw: true,
    color: "#C9B23A",
    glyph: "sulphur",
    lore: "The soul. What gives a substance its will to burn or change.",
  },

  livingMetal: {
    id: "livingMetal",
    name: "Living Metal",
    tier: 2,
    isRaw: false,
    color: "#D9C27A",
    glyph: "ring",
    glyphSeed: 7,
    lore: "Molten metal that never fully cooled. It still remembers moving.",
  },
  aether: {
    id: "aether",
    name: "Aether",
    tier: 2,
    isRaw: false,
    color: "#9C8FD9",
    glyph: "ring",
    glyphSeed: 8,
    lore: "The fifth element, the one nobody can point to but everyone needs.",
  },
  brine: {
    id: "brine",
    name: "Brine",
    tier: 2,
    isRaw: false,
    color: "#6FA88A",
    glyph: "ring",
    glyphSeed: 9,
    lore: "Salt that gave up its shape to water. Sharper for the trade.",
  },
  purifiedSalt: {
    id: "purifiedSalt",
    name: "Purified Salt",
    tier: 2,
    isRaw: false,
    color: "#F0E6C8",
    glyph: "ring",
    glyphSeed: 10,
    lore: "Brine burned clean of everything but the truth of it.",
  },
  essence: {
    id: "essence",
    name: "Essence",
    tier: 2,
    isRaw: false,
    color: "#C9A6E0",
    glyph: "ring",
    glyphSeed: 11,
    lore: "Aether given a body of salt. Almost nothing. Almost everything.",
  },

  lead: {
    id: "lead",
    name: "Lead",
    tier: 3,
    isRaw: true,
    color: "#5A5A5E",
    glyph: "lead",
    lore: "The base metal. Dull, heavy, patient — and the entire point of the work.",
  },
  philosophersStone: {
    id: "philosophersStone",
    name: "Philosopher's Stone",
    tier: 3,
    isRaw: false,
    color: "#E0475A",
    glyph: "stone",
    lore: "Body, spirit, and soul, made to agree with one another. The Great Work, finished.",
  },
  gold: {
    id: "gold",
    name: "Gold",
    tier: 3,
    isRaw: false,
    color: "#E6C888",
    glyph: "gold",
    lore: "Lead that has nothing left to become. The work ends here.",
  },
};

export const TIER1_DISCOVERIES: ElementId[] = [
  "vapour",
  "moltenMetal",
  "clay",
  "spark",
  "mist",
  "dust",
];

export const TIER2_DISCOVERIES: ElementId[] = [
  "livingMetal",
  "aether",
  "brine",
  "purifiedSalt",
  "essence",
];

export const TIER3_DISCOVERIES: ElementId[] = ["philosophersStone", "gold"];

/** Every element obtainable by combination — this is the Grimoire / progress denominator. */
export const ALL_DISCOVERIES: ElementId[] = [
  ...TIER1_DISCOVERIES,
  ...TIER2_DISCOVERIES,
  ...TIER3_DISCOVERIES,
];

export const RECIPES: Recipe[] = [
  { kind: "pair", inputs: ["fire", "water"], result: "vapour" },
  { kind: "pair", inputs: ["fire", "earth"], result: "moltenMetal" },
  { kind: "pair", inputs: ["water", "earth"], result: "clay" },
  { kind: "pair", inputs: ["air", "fire"], result: "spark" },
  { kind: "pair", inputs: ["water", "air"], result: "mist" },
  { kind: "pair", inputs: ["earth", "air"], result: "dust" },

  { kind: "pair", inputs: ["moltenMetal", "mercury"], result: "livingMetal" },
  { kind: "pair", inputs: ["vapour", "sulphur"], result: "aether" },
  { kind: "pair", inputs: ["salt", "water"], result: "brine" },
  { kind: "pair", inputs: ["brine", "fire"], result: "purifiedSalt" },
  { kind: "pair", inputs: ["aether", "salt"], result: "essence" },

  {
    kind: "triple",
    inputs: ["essence", "purifiedSalt", "livingMetal"],
    result: "philosophersStone",
  },
  { kind: "pair", inputs: ["philosophersStone", "lead"], result: "gold" },
];

/** How many distinct Tier-1 discoveries are needed to open Tier 2. */
export const TIER1_UNLOCK_THRESHOLD = 4;

/** Reagents newly placed on the shelf when each tier opens. */
export const TIER_RAW_UNLOCKS: Record<Tier2Or3, ElementId[]> = {
  2: ["salt", "mercury", "sulphur"],
  3: ["lead"],
};

type Tier2Or3 = 2 | 3;

export function findPairRecipe(a: ElementId, b: ElementId): PairRecipeMatch | undefined {
  for (const recipe of RECIPES) {
    if (recipe.kind !== "pair") continue;
    const [x, y] = recipe.inputs;
    if ((x === a && y === b) || (x === b && y === a)) {
      return recipe;
    }
  }
  return undefined;
}

export function findTripleRecipe(
  a: ElementId,
  b: ElementId,
  c: ElementId
): TripleRecipeMatch | undefined {
  const sorted = [a, b, c].slice().sort();
  for (const recipe of RECIPES) {
    if (recipe.kind !== "triple") continue;
    const recipeSorted = recipe.inputs.slice().sort();
    if (
      recipeSorted[0] === sorted[0] &&
      recipeSorted[1] === sorted[1] &&
      recipeSorted[2] === sorted[2]
    ) {
      return recipe;
    }
  }
  return undefined;
}

type PairRecipeMatch = Extract<Recipe, { kind: "pair" }>;
type TripleRecipeMatch = Extract<Recipe, { kind: "triple" }>;
