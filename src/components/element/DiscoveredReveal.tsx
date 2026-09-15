import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "../../game/store";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function DiscoveredReveal({ elementNumber }: { elementNumber: number }) {
  const reaction = useGameStore((s) => s.reaction);
  const justCollectedNumber = useGameStore((s) => s.justCollectedNumber);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reaction?.type !== "correct" || justCollectedNumber !== elementNumber) return;
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reaction, justCollectedNumber, elementNumber]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: SETTLE }}
          className="pointer-events-none fixed inset-x-0 top-[18%] z-30 flex justify-center"
        >
          <span className="rounded-full border border-gold/40 bg-warm-black/70 px-5 py-2 font-display text-lg italic text-gold backdrop-blur-md">
            Discovered!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
