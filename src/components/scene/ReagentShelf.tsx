import { useGameStore } from "../../game/store";
import { ReagentOrb } from "./ReagentOrb";

const PER_RING = 8;
const BASE_RADIUS = 2.35;
const RING_GAP = 0.62;
const ARC_DEGREES = 230;

export function ReagentShelf() {
  const availableReagents = useGameStore((s) => s.availableReagents);

  return (
    <group>
      {availableReagents.map((id, i) => {
        const ring = Math.floor(i / PER_RING);
        const indexInRing = i % PER_RING;
        const countInRing = Math.min(PER_RING, availableReagents.length - ring * PER_RING);
        const spread = (ARC_DEGREES * Math.PI) / 180;
        const start = -spread / 2;
        const angle =
          countInRing === 1 ? 0 : start + (spread * indexInRing) / (countInRing - 1);
        const radius = BASE_RADIUS + ring * RING_GAP;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius * 0.55 - 0.4;
        const jitter = indexInRing % 2 === 0 ? 0.14 : -0.1;
        const y = 0.25 + ring * 0.05 + jitter;
        return (
          <ReagentOrb
            key={id}
            id={id}
            position={[x, y, z]}
            alwaysShowLabel={ring === 0}
            staggerLabel={indexInRing % 2 === 1}
          />
        );
      })}
    </group>
  );
}
