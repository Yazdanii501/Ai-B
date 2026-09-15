import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ELEMENTS, TIER_RAW_UNLOCKS } from "../../game/recipes";
import { useGameStore } from "../../game/store";

const SETTLE = [0.16, 1, 0.3, 1] as const;

const TIER_COPY: Record<number, { title: string; sub: string }> = {
  2: { title: "Tria Prima", sub: "New reagents revealed" },
  3: { title: "The Great Work", sub: "The vessel now takes three" },
};

export function TierUnlockReveal() {
  const event = useGameStore((s) => s.tierUnlockEvent);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(timeout);
  }, [event]);

  if (!event) return null;
  const copy = TIER_COPY[event.tier];
  if (!copy) return null;

  const reagents = (TIER_RAW_UNLOCKS as Record<number, string[]>)[event.tier] ?? [];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={event.key}
          className="pointer-events-none fixed inset-x-0 top-[38%] z-30 flex flex-col items-center px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.9, ease: SETTLE }}
            className="mb-4 h-px w-full max-w-md bg-gold/50"
          />
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: SETTLE }}
            className="font-ui text-[11px] tracking-wide text-amber"
          >
            {copy.sub}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: SETTLE }}
            className="mt-1 font-display text-4xl text-ink sm:text-5xl"
          >
            {copy.title}
          </motion.h2>
          {reagents.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-3 font-ui text-[13px] text-muted"
            >
              {reagents.map((id) => ELEMENTS[id as keyof typeof ELEMENTS].name).join(" · ")}
            </motion.p>
          )}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: SETTLE }}
            className="mt-4 h-px w-full max-w-md bg-gold/50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
