import type { Glyph } from "../../game/types";

interface RuneIconProps {
  glyph: Glyph;
  seed?: number;
  className?: string;
}

/**
 * Small hand-authored alchemical glyphs. The four classical elements use their
 * real historical marks; derived elements get a deterministic "ring" glyph so
 * every element still reads as distinct without needing 21 bespoke icons.
 */
export function RuneIcon({ glyph, seed = 0, className }: RuneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {renderGlyph(glyph, seed)}
    </svg>
  );
}

function renderGlyph(glyph: Glyph, seed: number) {
  switch (glyph) {
    case "fire":
      return <path d="M12 3 L19.5 19 L4.5 19 Z" />;
    case "water":
      return <path d="M4.5 5 L19.5 5 L12 21 Z" />;
    case "air":
      return (
        <>
          <path d="M12 3 L19.5 19 L4.5 19 Z" />
          <path d="M7 13.5 H17" />
        </>
      );
    case "earth":
      return (
        <>
          <path d="M4.5 5 L19.5 5 L12 21 Z" />
          <path d="M7.3 10.5 H16.7" />
        </>
      );
    case "salt":
      return (
        <>
          <circle cx="12" cy="12" r="7.2" />
          <path d="M4.8 12 H19.2" />
        </>
      );
    case "mercury":
      return (
        <>
          <path d="M8.5 5.5 a3.5 3 0 0 0 7 0" />
          <circle cx="12" cy="11.5" r="4.3" />
          <path d="M12 15.8 V21" />
          <path d="M9 18.4 H15" />
        </>
      );
    case "sulphur":
      return (
        <>
          <path d="M12 3 L16.2 10.2 H7.8 Z" />
          <path d="M12 10.2 V21" />
          <path d="M7.2 15.6 H16.8" />
        </>
      );
    case "lead":
      return (
        <>
          <path d="M9 4 H16" />
          <path d="M12.5 4 V12" />
          <path d="M8 20 a5.2 4.4 0 1 0 8.6 -3.4" />
        </>
      );
    case "stone":
      return (
        <>
          <circle cx="12" cy="12" r="8.4" />
          <path d="M12 6.5 L16.8 15 H7.2 Z" />
          <path d="M12 17.5 L7.2 9 H16.8 Z" />
        </>
      );
    case "gold":
      return (
        <>
          <circle cx="12" cy="12" r="8.2" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </>
      );
    case "ring":
    default:
      return <RingGlyph seed={seed} />;
  }
}

function RingGlyph({ seed }: { seed: number }) {
  const dotCount = 3 + (seed % 4);
  const radius = 7.4;
  const cx = 12;
  const cy = 12;
  const offset = (seed * 37) % 360;
  const dots = Array.from({ length: dotCount }, (_, i) => {
    const angle = (offset + (360 / dotCount) * i) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  return (
    <>
      <circle cx={cx} cy={cy} r={4.2} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.05} fill="currentColor" stroke="none" />
      ))}
    </>
  );
}
