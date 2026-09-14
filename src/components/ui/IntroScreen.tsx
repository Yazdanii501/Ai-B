import { AnimatePresence, motion } from "framer-motion";
import { startAmbient } from "../../game/audio";
import { useGameStore } from "../../game/store";

const SETTLE = [0.16, 1, 0.3, 1] as const;

export function IntroScreen() {
  const phase = useGameStore((s) => s.phase);
  const startGame = useGameStore((s) => s.startGame);
  const markAudioInteracted = useGameStore((s) => s.markAudioInteracted);

  function begin() {
    markAudioInteracted();
    useGameStore.setState({ muted: false });
    startAmbient();
    startGame();
  }

  return (
    <AnimatePresence>
      {phase === "intro" && (
        <motion.div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-void/70 px-6 text-center backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: SETTLE }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: SETTLE, delay: 0.15 }}
            className="mb-3 font-ui text-xs tracking-wide text-muted"
          >
            A cinematic laboratory
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: SETTLE, delay: 0.3 }}
            className="font-display text-[clamp(2.75rem,9vw,5.5rem)] font-medium leading-[1.02] text-ink"
          >
            The Alchemist
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SETTLE, delay: 0.5 }}
            className="mx-auto mt-5 max-w-[30ch] text-balance font-ui text-[15px] leading-relaxed text-muted"
          >
            Combine what's on the shelf. Discover what it becomes. There is one true
            path, and it ends in gold.
          </motion.p>

          <motion.button
            type="button"
            onClick={begin}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SETTLE, delay: 0.75 }}
            whileHover={{ borderColor: "rgba(230,200,136,0.65)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 rounded-full border border-gold/40 bg-white/[0.045] px-9 py-3 font-ui text-sm text-ink backdrop-blur-md transition-colors duration-300"
          >
            Begin the work
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-8 font-ui text-[11px] text-muted/70"
          >
            Drag with a finger or mouse — or press Tab, then Enter, to play by
            keyboard.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
