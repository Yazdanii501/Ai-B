import { useGameStore } from "../game/store";

export function MuteToggle() {
  const muted = useGameStore((s) => s.muted);
  const toggleMute = useGameStore((s) => s.toggleMute);

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className="pointer-events-auto fixed bottom-6 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-white/[0.045] text-ink backdrop-blur-md transition-colors hover:border-gold/50 sm:right-8"
    >
      {muted ? <MutedGlyph /> : <SoundGlyph />}
    </button>
  );
}

function SoundGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.3}>
      <path d="M4 10v4h3.5l4 3.5v-11l-4 3.5H4Z" strokeLinejoin="round" />
      <path d="M15.5 9.5a4 4 0 0 1 0 5" />
      <path d="M18 7.5a7.5 7.5 0 0 1 0 9" />
    </svg>
  );
}

function MutedGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.3}>
      <path d="M4 10v4h3.5l4 3.5v-11l-4 3.5H4Z" strokeLinejoin="round" />
      <path d="M15 9.5l4.5 5" strokeLinecap="round" />
      <path d="M19.5 9.5 15 14.5" strokeLinecap="round" />
    </svg>
  );
}
