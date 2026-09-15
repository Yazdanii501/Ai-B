import { useEffect, useRef } from "react";
import { playBadge, playCorrect, playHover, playOpen, playWrong, setMuted, startAmbient } from "../game/audio";
import { useGameStore } from "../game/store";

/** No UI — listens to the store and drives the procedural sound layer. */
export function AudioController() {
  const muted = useGameStore((s) => s.muted);
  const hasInteracted = useGameStore((s) => s.hasInteracted);
  const reaction = useGameStore((s) => s.reaction);
  const celebrateBadge = useGameStore((s) => s.celebrateBadge);

  const lastReactionKey = useRef<number | null>(null);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (hasInteracted) startAmbient();
  }, [hasInteracted]);

  useEffect(() => {
    if (!reaction || reaction.key === lastReactionKey.current) return;
    lastReactionKey.current = reaction.key;
    if (reaction.type === "open") playOpen();
    else if (reaction.type === "correct") playCorrect();
    else if (reaction.type === "wrong") playWrong();
    else if (reaction.type === "hover") playHover();
  }, [reaction]);

  useEffect(() => {
    if (celebrateBadge) playBadge();
  }, [celebrateBadge]);

  return null;
}
