import { useEffect, useMemo } from "react";
import { AudioController } from "./components/AudioController";
import { Scene } from "./components/scene/Scene";
import { FinaleScreen } from "./components/ui/FinaleScreen";
import { GrimoirePanel } from "./components/ui/GrimoirePanel";
import { HUD } from "./components/ui/HUD";
import { IntroScreen } from "./components/ui/IntroScreen";
import { MuteToggle } from "./components/ui/MuteToggle";
import { TierUnlockReveal } from "./components/ui/TierUnlockReveal";
import { detectPerfProfile } from "./game/perf";
import { useGameStore } from "./game/store";
import { usePrefersReducedMotion } from "./game/usePrefersReducedMotion";

export function App() {
  const perf = useMemo(detectPerfProfile, []);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (import.meta.env.DEV) {
      // @ts-expect-error debug hook, dev only
      window.__gameStore = useGameStore;
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-void">
      <Scene perf={perf} reducedMotion={reducedMotion} />
      <HUD />
      <MuteToggle />
      <GrimoirePanel />
      <TierUnlockReveal />
      <IntroScreen />
      <FinaleScreen />
      <AudioController />
    </div>
  );
}
