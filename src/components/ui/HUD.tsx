import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DISCOVERY_TOTAL, useGameStore } from "../../game/store";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function HUD() {
  const phase = useGameStore((s) => s.phase);
  const discovered = useGameStore((s) => s.discovered);
  const vessel = useGameStore((s) => s.vessel);
  const transmutationCount = useGameStore((s) => s.transmutationCount);
  const failsThisTier = useGameStore((s) => s.failsThisTier);
  const grimoireOpen = useGameStore((s) => s.grimoireOpen);
  const toggleGrimoire = useGameStore((s) => s.toggleGrimoire);

  if (phase === "intro") return null;

  const progress = phase === "sandbox" ? 1 : discovered.size / DISCOVERY_TOTAL;
  const showInstruction = vessel.length === 0 && transmutationCount === 0 && failsThisTier === 0;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-4 pt-5 sm:gap-4 sm:px-8">
        <span className="whitespace-nowrap font-display text-base tracking-wide text-ink/90 sm:text-xl">
          The Alchemist
        </span>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 px-2">
          {phase !== "sandbox" && (
            <>
              <div className="h-px w-full max-w-[220px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div
                  className="h-full bg-gold/70"
                  animate={{ width: `${Math.min(progress, 1) * 100}%` }}
                  transition={{ duration: 0.6, ease: SETTLE }}
                />
              </div>
              <span className="whitespace-nowrap font-ui text-[10px] tabular-nums text-muted sm:text-[11px]">
                {discovered.size} of {DISCOVERY_TOTAL} discovered
              </span>
            </>
          )}
          {phase === "sandbox" && (
            <span className="truncate font-ui text-[10px] tracking-wide text-muted sm:text-[11px]">
              Sandbox — every reagent unlocked
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleGrimoire}
          aria-pressed={grimoireOpen}
          aria-label={grimoireOpen ? "Close the grimoire" : "Open the grimoire"}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-white/[0.045] text-ink backdrop-blur-md transition-colors hover:border-gold/50"
        >
          <GrimoireGlyph />
        </button>
      </div>

      <AnimatePresence>
        {showInstruction && phase !== "sandbox" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.7, ease: SETTLE }}
            className="pointer-events-none fixed inset-x-0 bottom-9 z-20 text-center font-ui text-[12.5px] text-muted"
          >
            Drag two reagents into the vessel.
          </motion.p>
        )}
      </AnimatePresence>

      <FailTick />
    </>
  );
}

function FailTick() {
  const reaction = useGameStore((s) => s.reaction);
  const [visibleKey, setVisibleKey] = useState<number | null>(null);

  useEffect(() => {
    if (reaction?.type !== "fail") return;
    setVisibleKey(reaction.key);
    const timeout = setTimeout(() => setVisibleKey(null), 1800);
    return () => clearTimeout(timeout);
  }, [reaction]);

  return (
    <AnimatePresence>
      {visibleKey !== null && (
        <motion.p
          key={visibleKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: SETTLE }}
          className="pointer-events-none fixed inset-x-0 bottom-9 z-20 text-center font-ui text-[12.5px] text-muted"
        >
          The reagents refuse each other.
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function GrimoireGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.3}>
      <path d="M5 4.5 C8 3.5 10.5 3.5 12 5 C13.5 3.5 16 3.5 19 4.5 V18.5 C16 17.5 13.5 17.5 12 19 C10.5 17.5 8 17.5 5 18.5 Z" />
      <path d="M12 5 V19" />
    </svg>
  );
}
