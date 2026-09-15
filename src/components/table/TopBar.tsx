import { motion } from "framer-motion";
import { TOTAL_ELEMENTS, useGameStore } from "../../game/store";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function TopBar() {
  const collectedCount = useGameStore((s) => s.collected.size);
  const grimoireOpen = useGameStore((s) => s.grimoireOpen);
  const toggleGrimoire = useGameStore((s) => s.toggleGrimoire);

  const progress = collectedCount / TOTAL_ELEMENTS;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 pt-5 sm:px-8">
      <span className="whitespace-nowrap font-display text-lg tracking-wide text-ink/90 sm:text-xl">
        Elementa
      </span>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-3 px-2">
        <div className="h-px w-full max-w-[240px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full bg-gold/70"
            animate={{ width: `${Math.min(progress, 1) * 100}%` }}
            transition={{ duration: 0.6, ease: SETTLE }}
          />
        </div>
        <span className="whitespace-nowrap font-ui text-[10px] tabular-nums text-muted sm:text-[11px]">
          {collectedCount} / {TOTAL_ELEMENTS} discovered
        </span>
      </div>

      <button
        type="button"
        onClick={toggleGrimoire}
        aria-pressed={grimoireOpen}
        aria-label={grimoireOpen ? "Close the collection" : "Open the collection"}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-white/[0.045] text-ink backdrop-blur-md transition-colors hover:border-gold/50"
      >
        <CollectionGlyph />
      </button>
    </div>
  );
}

function CollectionGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.3}>
      <path d="M5 4.5 C8 3.5 10.5 3.5 12 5 C13.5 3.5 16 3.5 19 4.5 V18.5 C16 17.5 13.5 17.5 12 19 C10.5 17.5 8 17.5 5 18.5 Z" />
      <path d="M12 5 V19" />
    </svg>
  );
}
