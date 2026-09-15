import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CATEGORY_LABELS } from "../game/elements";
import { useGameStore } from "../game/store";
import { RuneGlyph } from "./RuneGlyph";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function BadgeCelebration() {
  const celebrateBadge = useGameStore((s) => s.celebrateBadge);
  const clearCelebrateBadge = useGameStore((s) => s.clearCelebrateBadge);

  useEffect(() => {
    if (!celebrateBadge) return;
    const timeout = setTimeout(clearCelebrateBadge, 3400);
    return () => clearTimeout(timeout);
  }, [celebrateBadge, clearCelebrateBadge]);

  return (
    <AnimatePresence>
      {celebrateBadge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: SETTLE }}
          className="pointer-events-none fixed inset-x-0 top-24 z-40 flex justify-center px-4"
        >
          <div className="flex items-center gap-3 rounded-full border border-gold/40 bg-warm-black/85 px-5 py-2.5 text-gold backdrop-blur-md">
            <RuneGlyph size={16} />
            <div className="text-left">
              <p className="font-display text-base italic leading-none">Category complete</p>
              <p className="mt-0.5 font-ui text-[11px] text-gold/80">
                {CATEGORY_LABELS[celebrateBadge]} — every one discovered.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
