import { motion } from "framer-motion";
import { CATEGORY_TINTS } from "../../game/elements";
import { playHover } from "../../game/audio";
import { useGameStore } from "../../game/store";
import type { ElementDef } from "../../game/types";

const SETTLE = [0.16, 1, 0.3, 1] as const;

interface ElementTileProps {
  element: ElementDef;
  reducedMotion: boolean;
  staggerIndex: number;
}

export function ElementTile({ element, reducedMotion, staggerIndex }: ElementTileProps) {
  const collected = useGameStore((s) => s.collected.has(element.number));
  const selectElement = useGameStore((s) => s.selectElement);
  const hasInteracted = useGameStore((s) => s.hasInteracted);
  const markInteracted = useGameStore((s) => s.markInteracted);

  const tint = CATEGORY_TINTS[element.category];

  const colOffset = element.col - 9.5;
  const rotateY = Math.max(-16, Math.min(16, colOffset * 1.8));
  const translateZ = -Math.abs(colOffset) * 3;
  const rowGapPx = element.row >= 8 ? 22 : 0;

  const floatDelay = ((staggerIndex * 137) % 1000) / 1000;
  const floatDuration = 4.2 + ((staggerIndex * 53) % 900) / 1000;

  function handleClick() {
    if (!hasInteracted) markInteracted();
    selectElement(element.number);
  }

  function handleHoverStart() {
    if (hasInteracted) playHover();
  }

  return (
    <div
      style={{
        gridColumn: element.col,
        gridRow: element.row,
        marginTop: rowGapPx,
        transform: reducedMotion ? undefined : `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        onHoverStart={handleHoverStart}
        aria-label={`${element.name}, atomic number ${element.number}${collected ? ", discovered" : ""}`}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: reducedMotion ? 0 : [0, -5, 0],
        }}
        transition={{
          opacity: { duration: 0.7, ease: SETTLE, delay: floatDelay * 0.4 },
          scale: { duration: 0.7, ease: SETTLE, delay: floatDelay * 0.4 },
          y: reducedMotion
            ? undefined
            : {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              },
        }}
        whileHover={{
          y: -10,
          scale: 1.07,
          transition: { duration: 0.28, ease: SETTLE },
        }}
        whileFocus={{
          y: -10,
          scale: 1.07,
          transition: { duration: 0.28, ease: SETTLE },
        }}
        whileTap={{ scale: 0.97 }}
        className="group relative flex h-[54px] w-[54px] flex-col items-center justify-center rounded-[7px] border bg-white/[0.04] backdrop-blur-md sm:h-[58px] sm:w-[58px]"
        style={{
          borderColor: collected ? `${tint}99` : "rgba(230,200,136,0.22)",
          boxShadow: collected
            ? `0 0 14px 1px ${tint}55, inset 0 0 10px ${tint}22`
            : "0 0 0 0 transparent",
        }}
      >
        <span
          className="absolute left-1 top-0.5 font-ui text-[7px] tabular-nums text-muted/80 sm:text-[8px]"
          aria-hidden="true"
        >
          {element.number}
        </span>
        <span
          className="font-display text-[19px] font-medium leading-none transition-colors duration-300 sm:text-[22px]"
          style={{ color: collected ? "#F3F0E7" : "#D8D4C8" }}
          aria-hidden="true"
        >
          {element.symbol}
        </span>
        <span
          className="pointer-events-none absolute inset-0 rounded-[7px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `0 0 18px 2px ${tint}70, inset 0 0 12px ${tint}30` }}
          aria-hidden="true"
        />
      </motion.button>
    </div>
  );
}
