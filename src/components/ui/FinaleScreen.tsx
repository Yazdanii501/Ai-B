import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DISCOVERY_TOTAL, useGameStore } from "../../game/store";
import { renderShareCard } from "../../game/shareCard";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function FinaleScreen() {
  const phase = useGameStore((s) => s.phase);
  const discovered = useGameStore((s) => s.discovered);
  const transmutationCount = useGameStore((s) => s.transmutationCount);
  const startedAt = useGameStore((s) => s.startedAt);
  const finishedAt = useGameStore((s) => s.finishedAt);
  const enterSandbox = useGameStore((s) => s.enterSandbox);

  const [revealed, setRevealed] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (phase !== "finale") {
      setRevealed(false);
      return;
    }
    const timeout = setTimeout(() => setRevealed(true), 1600);
    return () => clearTimeout(timeout);
  }, [phase]);

  if (phase !== "finale") return null;

  const elapsedSeconds = startedAt && finishedAt ? (finishedAt - startedAt) / 1000 : 0;

  async function handleDownload() {
    const blob = await renderShareCard({
      discoveries: discovered.size,
      discoveryTotal: DISCOVERY_TOTAL,
      transmutations: transmutationCount,
      elapsedSeconds,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-alchemist.png";
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
      {revealed && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-void/55 px-6 py-12 text-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: SETTLE }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: SETTLE, delay: 0.2 }}
            className="font-display text-[clamp(2rem,6vw,3.75rem)] font-medium italic text-ink"
          >
            You turned lead into gold.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SETTLE, delay: 0.55 }}
            className="mt-9 w-full max-w-md rounded-2xl border border-gold/[0.18] bg-white/[0.045] px-6 py-6 backdrop-blur-glass"
          >
            <p className="mb-5 font-ui text-[11px] tracking-wide text-muted">
              THE ALCHEMIST — a summary of the work
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Stat value={`${discovered.size}/${DISCOVERY_TOTAL}`} label="discovered" />
              <Stat value={`${transmutationCount}`} label="transmutations" />
              <Stat value={formatElapsed(elapsedSeconds)} label="in the lab" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-full border border-gold/35 bg-white/[0.03] px-5 py-2.5 font-ui text-[13px] text-ink transition-colors hover:border-gold/60"
              >
                Download image
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-full border border-gold/35 bg-white/[0.03] px-5 py-2.5 font-ui text-[13px] text-ink transition-colors hover:border-gold/60"
              >
                {copyState === "copied" ? "Link copied" : "Copy link"}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={enterSandbox}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SETTLE, delay: 0.85 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 font-ui text-[13px] text-muted underline decoration-gold/30 decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            Enter the sandbox — every reagent, no rules
          </motion.button>

          {/* AD_BANNER_SLOT: a leaderboard or responsive ad unit can mount here */}
          <div data-ad-slot="finale-summary" className="mt-10 min-h-0 w-full max-w-md" />

          <a
            href="#support"
            onClick={(e) => e.preventDefault()}
            title="Add your support link here"
            className="fixed bottom-6 left-5 z-40 font-ui text-[12px] text-muted/70 transition-colors hover:text-ink sm:left-8"
          >
            ☕ Support
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-amber">{value}</div>
      <div className="mt-1 font-ui text-[10.5px] text-muted">{label}</div>
    </div>
  );
}

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
