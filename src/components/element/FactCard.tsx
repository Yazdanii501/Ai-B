import { motion } from "framer-motion";
import { CATEGORY_LABELS, CATEGORY_TINTS } from "../../game/elements";
import { useGameStore } from "../../game/store";
import type { ElementDef } from "../../game/types";

const SETTLE = [0.16, 1, 0.3, 1] as const;

function stagger(i: number, base = 0.15) {
  return { duration: 0.7, ease: SETTLE, delay: base + i * 0.07 };
}

export function FactCard({ element }: { element: ElementDef }) {
  const collected = useGameStore((s) => s.collected.has(element.number));
  const tint = CATEGORY_TINTS[element.category];
  const { facts } = element;

  const discoveredLine = facts.discoveredYear
    ? `Discovered ${facts.discoveredYear} by ${facts.discoveredBy}.`
    : `${facts.discoveredBy ?? "Known since antiquity"}.`;

  return (
    <div className="w-full max-w-[380px] rounded-2xl border border-gold/[0.18] bg-white/[0.045] px-6 py-6 backdrop-blur-glass sm:px-7 sm:py-7">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(0)}
        className="flex items-center justify-between"
      >
        <span
          className="rounded-full border px-2.5 py-1 font-ui text-[10px] tracking-wide"
          style={{ borderColor: `${tint}55`, color: tint }}
        >
          {CATEGORY_LABELS[element.category]}
        </span>
        {collected && (
          <span className="flex items-center gap-1.5 font-ui text-[10px] text-gold">
            <CheckGlyph /> Discovered
          </span>
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(1)}
        className="mt-3 font-display text-[2.4rem] font-medium leading-none text-ink sm:text-[2.75rem]"
      >
        {element.name}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(2)}
        className="mt-1.5 font-ui text-[13px] text-muted"
      >
        {element.symbol} · atomic number {element.number}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(3)}
        className="mt-4 font-ui text-[13px] leading-relaxed text-muted"
      >
        {discoveredLine}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(4)}
        className="mt-2 font-ui text-[13.5px] leading-relaxed text-ink/85"
      >
        <span className="text-muted">Used in </span>
        {facts.usedIn}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(5)}
        className="mt-4 border-t border-white/[0.06] pt-4"
      >
        <p className="font-ui text-[10.5px] text-muted">Did you know?</p>
        <p className="mt-1 font-ui text-[13px] leading-relaxed text-ink/80">{facts.funFact}</p>
      </motion.div>
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
