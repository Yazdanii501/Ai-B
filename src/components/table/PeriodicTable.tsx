import { useRef } from "react";
import { ELEMENTS } from "../../game/elements";
import { ElementTile } from "./ElementTile";

interface PeriodicTableProps {
  reducedMotion: boolean;
}

export function PeriodicTable({ reducedMotion }: PeriodicTableProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !stageRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!stageRef.current) return;
      stageRef.current.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
    });
  }

  function handlePointerLeave() {
    if (!stageRef.current) return;
    stageRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[1180px] overflow-x-auto overflow-y-hidden px-4 py-6 sm:overflow-visible sm:px-0"
      style={{ perspective: 1700 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={stageRef}
        className="mx-auto grid w-max origin-center gap-[6px] transition-transform duration-500 ease-out sm:w-full sm:gap-[7px]"
        style={{
          gridTemplateColumns: "repeat(18, minmax(48px, 1fr))",
          transformStyle: "preserve-3d",
        }}
      >
        {ELEMENTS.map((el, i) => (
          <ElementTile key={el.number} element={el} reducedMotion={reducedMotion} staggerIndex={i} />
        ))}
      </div>
    </div>
  );
}
