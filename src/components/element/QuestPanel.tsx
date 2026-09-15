import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getQuiz } from "../../game/quiz";
import { useGameStore } from "../../game/store";
import type { ElementDef } from "../../game/types";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function QuestPanel({ element }: { element: ElementDef }) {
  const answerQuiz = useGameStore((s) => s.answerQuiz);
  const wrongCount = useGameStore((s) => s.wrongCount);
  const hintVisible = useGameStore((s) => s.hintVisible);
  const [lastWrong, setLastWrong] = useState<number | null>(null);

  const quiz = getQuiz(element);

  function handleAnswer(index: number) {
    if (index === quiz.correctIndex) {
      setLastWrong(null);
      answerQuiz(index);
    } else {
      setLastWrong(index);
      answerQuiz(index);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: SETTLE, delay: 0.45 }}
      className="mt-5 w-full max-w-[380px] rounded-2xl border border-gold/[0.18] bg-white/[0.045] px-6 py-5 backdrop-blur-glass sm:px-7"
    >
      <p className="font-ui text-[10.5px] tracking-wide text-muted">Test your knowledge</p>
      <p className="mt-1.5 font-ui text-[14px] leading-relaxed text-ink">{quiz.question}</p>

      <div className="mt-4 flex flex-col gap-2.5">
        {quiz.options.map((option, i) => (
          <motion.button
            key={option}
            type="button"
            onClick={() => handleAnswer(i)}
            animate={lastWrong === i ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ borderColor: "rgba(230,200,136,0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="min-h-[46px] rounded-xl border border-gold/20 bg-white/[0.03] px-4 py-3 text-left font-ui text-[13.5px] text-ink/90 transition-colors"
            style={{ opacity: lastWrong === i ? 0.55 : 1 }}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lastWrong !== null && wrongCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 font-ui text-[12px] text-muted"
          >
            Not quite — try again.
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hintVisible && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: SETTLE }}
            className="mt-3 overflow-hidden rounded-lg border border-gold/15 bg-gold/[0.06] px-3 py-2.5 font-ui text-[12px] leading-relaxed text-gold/90"
          >
            Hint: {quiz.hint}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
