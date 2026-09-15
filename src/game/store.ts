import { create } from "zustand";
import { CATEGORIES, ELEMENT_BY_NUMBER, ELEMENTS, TOTAL_ELEMENTS } from "./elements";
import { getQuiz } from "./quiz";
import type { ElementCategory } from "./types";

export type Screen = "table" | "element";

interface ReactionEvent {
  key: number;
  type: "correct" | "wrong" | "hover" | "open";
}

interface GameState {
  screen: Screen;
  selectedNumber: number | null;
  collected: Set<number>;
  badges: Set<ElementCategory>;
  wrongCount: number;
  hintVisible: boolean;
  justCollectedNumber: number | null;
  celebrateBadge: ElementCategory | null;
  reaction: ReactionEvent | null;
  grimoireOpen: boolean;
  muted: boolean;
  hasInteracted: boolean;
  hasSelectedOnce: boolean;

  selectElement: (number: number) => void;
  backToTable: () => void;
  answerQuiz: (optionIndex: number) => void;
  toggleGrimoire: () => void;
  toggleMute: () => void;
  markInteracted: () => void;
  clearCelebrateBadge: () => void;
  pingHover: () => void;
}

let reactionKeySeq = 0;

export const useGameStore = create<GameState>((set, get) => ({
  screen: "table",
  selectedNumber: null,
  collected: new Set(),
  badges: new Set(),
  wrongCount: 0,
  hintVisible: false,
  justCollectedNumber: null,
  celebrateBadge: null,
  reaction: null,
  grimoireOpen: false,
  muted: true,
  hasInteracted: false,
  hasSelectedOnce: false,

  selectElement: (number) => {
    set({
      screen: "element",
      selectedNumber: number,
      wrongCount: 0,
      hintVisible: false,
      hasSelectedOnce: true,
      reaction: { key: ++reactionKeySeq, type: "open" },
    });
  },

  backToTable: () => {
    set({ screen: "table", selectedNumber: null, wrongCount: 0, hintVisible: false });
  },

  answerQuiz: (optionIndex) => {
    const s = get();
    const number = s.selectedNumber;
    if (number === null) return;
    const el = ELEMENT_BY_NUMBER.get(number);
    if (!el || s.collected.has(number)) return;

    const quiz = getQuiz(el);
    const correct = optionIndex === quiz.correctIndex;

    if (correct) {
      const collected = new Set(s.collected);
      collected.add(number);

      let celebrateBadge: ElementCategory | null = null;
      const badges = new Set(s.badges);
      const categoryTotal = ELEMENTS.filter((e) => e.category === el.category).length;
      const categoryCollected = ELEMENTS.filter(
        (e) => e.category === el.category && collected.has(e.number)
      ).length;
      if (categoryCollected === categoryTotal && !badges.has(el.category)) {
        badges.add(el.category);
        celebrateBadge = el.category;
      }

      set({
        collected,
        badges,
        justCollectedNumber: number,
        celebrateBadge,
        wrongCount: 0,
        hintVisible: false,
        reaction: { key: ++reactionKeySeq, type: "correct" },
      });
    } else {
      const wrongCount = s.wrongCount + 1;
      set({
        wrongCount,
        hintVisible: wrongCount >= 2,
        reaction: { key: ++reactionKeySeq, type: "wrong" },
      });
    }
  },

  toggleGrimoire: () => set((s) => ({ grimoireOpen: !s.grimoireOpen })),
  toggleMute: () => set((s) => ({ muted: !s.muted, hasInteracted: true })),
  markInteracted: () => {
    if (get().hasInteracted) return;
    set({ hasInteracted: true, muted: false });
  },
  clearCelebrateBadge: () => set({ celebrateBadge: null }),
  pingHover: () => set({ reaction: { key: ++reactionKeySeq, type: "hover" } }),
}));

export { CATEGORIES, TOTAL_ELEMENTS };
