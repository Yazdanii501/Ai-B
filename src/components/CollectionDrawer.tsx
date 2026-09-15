import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_TINTS,
  ELEMENTS,
  TOTAL_ELEMENTS,
} from "./../game/elements";
import { renderShareCard } from "../game/shareCard";
import { useGameStore } from "../game/store";
import { RuneGlyph } from "./RuneGlyph";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function CollectionDrawer() {
  const grimoireOpen = useGameStore((s) => s.grimoireOpen);
  const toggleGrimoire = useGameStore((s) => s.toggleGrimoire);
  const collected = useGameStore((s) => s.collected);
  const badges = useGameStore((s) => s.badges);
  const selectElement = useGameStore((s) => s.selectElement);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  async function handleDownload() {
    const blob = await renderShareCard({
      discovered: collected.size,
      total: TOTAL_ELEMENTS,
      badgeCount: badges.size,
      badgeTotal: CATEGORIES.length,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elementa.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      // clipboard permission denied — nothing to fall back to silently
    }
  }

  return (
    <AnimatePresence>
      {grimoireOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close the collection"
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
            className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[420px] flex-col border-l border-gold/[0.18] bg-warm-black/90 px-6 py-7 backdrop-blur-glass"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">Collection</h2>
              <button
                type="button"
                onClick={toggleGrimoire}
                aria-label="Close the collection"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
              >
                <CloseGlyph />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {CATEGORIES.map((category) => {
                const els = ELEMENTS.filter((e) => e.category === category);
                const count = els.filter((e) => collected.has(e.number)).length;
                const complete = badges.has(category);
                const tint = CATEGORY_TINTS[category];
                return (
                  <div key={category} className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-ui text-[12.5px] text-ink/90">
                        {CATEGORY_LABELS[category]}
                      </span>
                      <span
                        className="flex items-center gap-1 font-ui text-[11px] tabular-nums"
                        style={{ color: complete ? "#E6C888" : "#8A8A94" }}
                      >
                        {complete && <BadgeGlyph />}
                        {count}/{els.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {els.map((el) => {
                        const known = collected.has(el.number);
                        return (
                          <button
                            key={el.number}
                            type="button"
                            disabled={!known}
                            onClick={() => {
                              selectElement(el.number);
                              toggleGrimoire();
                            }}
                            aria-label={known ? el.name : "Undiscovered element"}
                            className="flex h-8 w-8 items-center justify-center rounded-md border font-ui text-[10.5px] transition-colors enabled:hover:bg-white/[0.05]"
                            style={{
                              borderColor: known ? `${tint}55` : "rgba(138,138,148,0.2)",
                              color: known ? "#F3F0E7" : "#4a4a52",
                            }}
                          >
                            {known ? el.symbol : "?"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <p className="mb-3 font-ui text-[11px] text-muted">
                {collected.size}/{TOTAL_ELEMENTS} discovered · {badges.size} badge
                {badges.size === 1 ? "" : "s"}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-full border border-gold/30 bg-white/[0.03] px-4 py-2 font-ui text-[12px] text-ink transition-colors hover:border-gold/55"
                >
                  Download image
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-full border border-gold/30 bg-white/[0.03] px-4 py-2 font-ui text-[12px] text-ink transition-colors hover:border-gold/55"
                >
                  {copyState === "copied" ? "Link copied" : "Copy link"}
                </button>
              </div>

              {/* AD_BANNER_SLOT: a leaderboard or responsive ad unit can mount here */}
              <div data-ad-slot="collection-drawer" className="mt-4 min-h-0 w-full" />

              <a
                href="#support"
                onClick={(e) => e.preventDefault()}
                title="Add your support link here"
                className="mt-4 inline-block font-ui text-[11.5px] text-muted/70 transition-colors hover:text-ink"
              >
                ☕ Support
              </a>
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

function BadgeGlyph() {
  return <RuneGlyph size={11} />;
}
