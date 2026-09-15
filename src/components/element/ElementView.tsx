import { motion } from "framer-motion";
import { ELEMENT_BY_NUMBER, TOTAL_ELEMENTS } from "../../game/elements";
import type { PerfProfile } from "../../game/perf";
import { useGameStore } from "../../game/store";
import { AtomScene } from "./AtomScene";
import { DiscoveredReveal } from "./DiscoveredReveal";
import { FactCard } from "./FactCard";
import { QuestPanel } from "./QuestPanel";

const SETTLE = [0.16, 1, 0.3, 1] as const;

interface ElementViewProps {
  elementNumber: number;
  reducedMotion: boolean;
  perf: PerfProfile;
}

export function ElementView({ elementNumber, reducedMotion, perf }: ElementViewProps) {
  const element = ELEMENT_BY_NUMBER.get(elementNumber);
  const collected = useGameStore((s) => s.collected.has(elementNumber));
  const backToTable = useGameStore((s) => s.backToTable);
  const selectElement = useGameStore((s) => s.selectElement);

  if (!element) return null;

  function goNext() {
    const next = (elementNumber % TOTAL_ELEMENTS) + 1;
    selectElement(next);
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center gap-6 px-4 pb-28 pt-24 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: SETTLE }}
        className="relative h-[280px] w-full max-w-[440px] shrink-0 sm:h-[440px] sm:max-w-none sm:flex-1"
      >
        <AtomScene element={element} reducedMotion={reducedMotion} perf={perf} />
        <DiscoveredReveal elementNumber={element.number} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: SETTLE, delay: 0.25 }}
        className="flex w-full max-w-[380px] flex-col items-center sm:items-start"
      >
        <FactCard element={element} />
        {!collected && <QuestPanel element={element} />}
        {collected && (
          <div className="mt-5 flex w-full max-w-[380px] flex-wrap gap-3">
            <button
              type="button"
              onClick={backToTable}
              className="min-h-[44px] flex-1 rounded-full border border-gold/30 bg-white/[0.03] px-5 py-2.5 font-ui text-[13px] text-ink transition-colors hover:border-gold/55"
            >
              Back to table
            </button>
            <button
              type="button"
              onClick={goNext}
              className="min-h-[44px] flex-1 rounded-full border border-gold/30 bg-white/[0.03] px-5 py-2.5 font-ui text-[13px] text-ink transition-colors hover:border-gold/55"
            >
              Next element
            </button>
          </div>
        )}
      </motion.div>

      {!collected && (
        <button
          type="button"
          onClick={backToTable}
          className="fixed left-4 top-[78px] z-20 flex h-10 items-center gap-1.5 rounded-full border border-gold/20 bg-white/[0.04] px-3.5 font-ui text-[12px] text-muted backdrop-blur-md transition-colors hover:border-gold/45 hover:text-ink sm:left-8"
        >
          <BackGlyph /> Table
        </button>
      )}
    </div>
  );
}

function BackGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
