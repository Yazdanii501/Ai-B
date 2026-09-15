import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ALL_DISCOVERIES, ELEMENTS } from "../../game/recipes";
import { useGameStore } from "../../game/store";
import { RuneIcon } from "./RuneIcon";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function GrimoirePanel() {
  const phase = useGameStore((s) => s.phase);
  const grimoireOpen = useGameStore((s) => s.grimoireOpen);
  const toggleGrimoire = useGameStore((s) => s.toggleGrimoire);
  const discovered = useGameStore((s) => s.discovered);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const open = grimoireOpen && phase !== "intro";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close the grimoire"
            onClick={toggleGrimoire}
            className="fixed inset-0 z-30 bg-void/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: SETTLE }}
            className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[380px] flex-col border-l border-gold/[0.18] bg-warm-black/90 px-6 py-7 backdrop-blur-glass"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">Grimoire</h2>
              <button
                type="button"
                onClick={toggleGrimoire}
                aria-label="Close the grimoire"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
              >
                <CloseGlyph />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <ul className="flex flex-col gap-1">
                {ALL_DISCOVERIES.map((id) => {
                  const known = discovered.has(id) || phase === "sandbox";
                  const el = ELEMENTS[id];
                  const isExpanded = expandedId === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        disabled={!known}
                        onClick={() => setExpandedId(isExpanded ? null : id)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors disabled:cursor-default enabled:hover:bg-white/[0.04]"
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                          style={{
                            borderColor: known ? `${el.color}55` : "rgba(138,138,148,0.25)",
                            color: known ? el.color : "#4a4a52",
                          }}
                        >
                          {known ? (
                            <RuneIcon glyph={el.glyph} seed={el.glyphSeed} className="h-4 w-4" />
                          ) : (
                            <span className="font-ui text-xs">?</span>
                          )}
                        </span>
                        <span
                          className={`font-ui text-[13.5px] ${known ? "text-ink" : "text-muted/50"}`}
                        >
                          {known ? el.name : "Undiscovered"}
                        </span>
                      </button>
                      <AnimatePresence>
                        {isExpanded && known && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: SETTLE }}
                            className="overflow-hidden pb-2 pl-14 pr-2 font-ui text-[12.5px] leading-relaxed text-muted"
                          >
                            {el.lore}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}
