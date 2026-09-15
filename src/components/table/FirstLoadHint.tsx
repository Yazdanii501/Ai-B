import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../../game/store";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function FirstLoadHint({ reducedMotion }: { reducedMotion: boolean }) {
  const hasSelectedOnce = useGameStore((s) => s.hasSelectedOnce);
  const screen = useGameStore((s) => s.screen);

  return (
    <AnimatePresence>
      {!hasSelectedOnce && screen === "table" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: SETTLE }}
          className="pointer-events-none fixed inset-x-0 bottom-9 z-20 flex flex-col items-center gap-2"
        >
          {!reducedMotion && (
            <motion.div
              aria-hidden="true"
              className="h-3 w-3 rounded-full border border-gold/70 bg-gold/20"
              animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <p className="font-ui text-[12.5px] text-muted">Tap an element to begin.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
