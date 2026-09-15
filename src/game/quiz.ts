import { CATEGORY_LABELS, ELEMENTS } from "./elements";
import type { ElementDef, QuizQuestion } from "./types";

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Deterministic generic quiz for elements without a hand-authored one. */
function genericQuiz(el: ElementDef): QuizQuestion {
  const others = ELEMENTS.filter((e) => e.number !== el.number);
  const distractors = seededShuffle(others, el.number)
    .slice(0, 3)
    .map((e) => String(e.number));

  const options = seededShuffle([String(el.number), ...distractors], el.number * 7);
  const correctIndex = options.indexOf(String(el.number)) as 0 | 1 | 2 | 3;

  return {
    question: `What is the atomic number of ${el.name}?`,
    options: options as [string, string, string, string],
    correctIndex,
    hint: `Its symbol is ${el.symbol}, and it's classed as a ${CATEGORY_LABELS[el.category].toLowerCase()}.`,
  };
}

export function getQuiz(el: ElementDef): QuizQuestion {
  return el.quiz ?? genericQuiz(el);
}
