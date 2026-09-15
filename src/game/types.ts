export type ElementId =
  | "fire"
  | "water"
  | "earth"
  | "air"
  | "vapour"
  | "moltenMetal"
  | "clay"
  | "spark"
  | "mist"
  | "dust"
  | "salt"
  | "mercury"
  | "sulphur"
  | "livingMetal"
  | "aether"
  | "brine"
  | "purifiedSalt"
  | "essence"
  | "lead"
  | "philosophersStone"
  | "gold";

export type Tier = 0 | 1 | 2 | 3;

/** Which family of hand-drawn glyph a rune icon renders. */
export type Glyph =
  | "fire"
  | "water"
  | "earth"
  | "air"
  | "salt"
  | "mercury"
  | "sulphur"
  | "lead"
  | "stone"
  | "gold"
  | "ring";

export interface ElementDef {
  id: ElementId;
  name: string;
  /** Tier at which this element becomes available on the shelf. */
  tier: Tier;
  /** Raw materials appear on the shelf directly; others must be discovered by combination. */
  isRaw: boolean;
  color: string;
  glyph: Glyph;
  /** Deterministic seed for auto-generated ring glyphs (unused by hand-authored glyphs). */
  glyphSeed?: number;
  lore: string;
}

export interface PairRecipe {
  kind: "pair";
  inputs: readonly [ElementId, ElementId];
  result: ElementId;
}

export interface TripleRecipe {
  kind: "triple";
  inputs: readonly [ElementId, ElementId, ElementId];
  result: ElementId;
}

export type Recipe = PairRecipe | TripleRecipe;

export interface VesselSlot {
  elementId: ElementId;
  /** Unique key so the same element dropped twice still animates distinctly. */
  key: string;
}
