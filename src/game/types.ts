export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  hint: string;
}

export interface ElementFacts {
  discoveredYear?: number;
  /** "Ancient" for elements known since antiquity (no single discoverer). */
  discoveredBy?: string;
  usedIn: string;
  funFact: string;
}

export interface ElementDef {
  number: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  /** Display position on the table grid: period 1-7, plus 8 (lanthanide row) and 9 (actinide row). */
  row: number;
  /** Display column 1-18. */
  col: number;
  /** Electron count per shell, e.g. Na = [2, 8, 1]. */
  shells: number[];
  facts: ElementFacts;
  /** Present only for the ~20 hand-authored "featured" elements. */
  quiz?: QuizQuestion;
}
