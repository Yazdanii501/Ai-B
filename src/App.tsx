import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { AudioController } from "./components/AudioController";
import { BadgeCelebration } from "./components/BadgeCelebration";
import { CollectionDrawer } from "./components/CollectionDrawer";
import { ElementView } from "./components/element/ElementView";
import { MuteToggle } from "./components/MuteToggle";
import { BackgroundGlow } from "./components/table/BackgroundGlow";
import { DustCanvas } from "./components/table/DustCanvas";
import { FirstLoadHint } from "./components/table/FirstLoadHint";
import { PeriodicTable } from "./components/table/PeriodicTable";
import { TopBar } from "./components/table/TopBar";
import { detectPerfProfile } from "./game/perf";
import { useGameStore } from "./game/store";
import { usePrefersReducedMotion } from "./game/usePrefersReducedMotion";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function App() {
  const reducedMotion = usePrefersReducedMotion();
  const perf = useMemo(detectPerfProfile, []);
  const screen = useGameStore((s) => s.screen);
  const selectedNumber = useGameStore((s) => s.selectedNumber);

  useEffect(() => {
    if (import.meta.env.DEV) {
      // @ts-expect-error debug hook, dev only
      window.__gameStore = useGameStore;
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-void">
      <BackgroundGlow reducedMotion={reducedMotion} />
      <DustCanvas count={perf.dustCount} reducedMotion={reducedMotion} />
      <TopBar />

      <AnimatePresence mode="wait">
        {screen === "table" && (
          <motion.main
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: SETTLE }}
            className="flex min-h-full items-center justify-center pb-24 pt-24"
          >
            <PeriodicTable reducedMotion={reducedMotion} />
          </motion.main>
        )}
        {screen === "element" && selectedNumber !== null && (
          <motion.main
            key={`element-${selectedNumber}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: SETTLE }}
            className="min-h-full"
          >
            <ElementView elementNumber={selectedNumber} reducedMotion={reducedMotion} perf={perf} />
          </motion.main>
        )}
      </AnimatePresence>

      <FirstLoadHint reducedMotion={reducedMotion} />
      <MuteToggle />
      <CollectionDrawer />
      <BadgeCelebration />
      <AudioController />
    </div>
  );
}
