import { useEffect, useRef } from "react";
import { duckAmbient, playChime, playFail, playGoldSwell, setMuted, startAmbient } from "../game/audio";
import { useGameStore } from "../game/store";

/** No UI — just listens to the store and drives the (synthesized, zero-asset) sound layer. */
export function AudioController() {
  const muted = useGameStore((s) => s.muted);
  const hasInteractedWithAudio = useGameStore((s) => s.hasInteractedWithAudio);
  const phase = useGameStore((s) => s.phase);
  const reaction = useGameStore((s) => s.reaction);

  const lastReactionKey = useRef<number | null>(null);
  const duckedForFinale = useRef(false);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (hasInteractedWithAudio && (phase === "playing" || phase === "sandbox")) {
      startAmbient();
    }
  }, [hasInteractedWithAudio, phase]);

  useEffect(() => {
    if (!reaction || reaction.key === lastReactionKey.current) return;
    lastReactionKey.current = reaction.key;
    if (reaction.type === "success") playChime();
    else playFail();
  }, [reaction]);

  useEffect(() => {
    if (phase === "finale" && !duckedForFinale.current) {
      duckedForFinale.current = true;
      duckAmbient();
      playGoldSwell();
    }
  }, [phase]);

  return null;
}
