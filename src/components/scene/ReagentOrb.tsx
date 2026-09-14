import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { motion, useAnimation, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ELEMENTS } from "../../game/recipes";
import { useGameStore } from "../../game/store";
import type { ElementId } from "../../game/types";
import { RuneIcon } from "../ui/RuneIcon";
import { useVesselTarget, isPointInRect } from "./VesselTargetContext";

interface ReagentOrbProps {
  id: ElementId;
  position: [number, number, number];
  /** Base-tier reagents keep a persistent label; denser rings reveal it on hover/focus only. */
  alwaysShowLabel?: boolean;
  /** Drops the label lower so two screen-adjacent orbs don't collide at narrow widths. */
  staggerLabel?: boolean;
}

export function ReagentOrb({
  id,
  position,
  alwaysShowLabel = true,
  staggerLabel = false,
}: ReagentOrbProps) {
  const element = ELEMENTS[id];
  const meshRef = useRef<THREE.Mesh>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const originRect = useRef<DOMRect | null>(null);
  const controls = useAnimation();
  const vesselTarget = useVesselTarget();
  const [labelHovered, setLabelHovered] = useState(false);

  const pickedId = useGameStore((s) => s.pickedId);
  const hintElementId = useGameStore((s) => s.hintElementId);
  const dropReagent = useGameStore((s) => s.dropReagent);
  const pickReagent = useGameStore((s) => s.pickReagent);
  const setDraggingId = useGameStore((s) => s.setDraggingId);

  const isPicked = pickedId === id;
  const isHinted = hintElementId === id;

  useEffect(() => {
    controls.start(
      { opacity: 1, scale: 1 },
      { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = isHinted ? 0.5 + Math.sin(t * 3) * 0.2 : isPicked ? 0.45 : 0.2;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = pulse + 0.9;
    meshRef.current.position.y = position[1] + (isPicked ? Math.sin(t * 4) * 0.03 : 0);
  });

  function handleDragStart() {
    originRect.current = buttonRef.current?.getBoundingClientRect() ?? null;
    setDraggingId(id);
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setDraggingId(null);
    const targetEl = vesselTarget.current;
    const dropped = targetEl && isPointInRect(info.point.x, info.point.y, targetEl.getBoundingClientRect());

    if (dropped && originRect.current) {
      const targetRect = targetEl!.getBoundingClientRect();
      const originCenter = {
        x: originRect.current.left + originRect.current.width / 2,
        y: originRect.current.top + originRect.current.height / 2,
      };
      const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      };
      dropReagent(id);
      controls
        .start(
          {
            x: targetCenter.x - originCenter.x,
            y: targetCenter.y - originCenter.y,
            scale: 0.25,
            opacity: 0,
          },
          { duration: 0.3, ease: [0.65, 0, 0.35, 1] }
        )
        .then(() => controls.set({ x: 0, y: 0, scale: 1, opacity: 1 }));
    } else {
      controls.start({ x: 0, y: 0, scale: 1, opacity: 1 }, { type: "spring", stiffness: 420, damping: 32 });
    }
  }

  function handleTap() {
    pickReagent(id);
  }

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial
          color={element.color}
          emissive={element.color}
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>

      <Html
        transform={false}
        occlude={false}
        center
        zIndexRange={[20, 0]}
        style={{ pointerEvents: "none" }}
      >
        <motion.button
          ref={buttonRef}
          type="button"
          role="button"
          aria-pressed={isPicked}
          aria-label={`${element.name}${isPicked ? ", selected" : ""}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={controls}
          drag
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleTap}
          onHoverStart={() => setLabelHovered(true)}
          onHoverEnd={() => setLabelHovered(false)}
          onFocus={() => setLabelHovered(true)}
          onBlur={() => setLabelHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          title={alwaysShowLabel ? undefined : element.name}
          style={{
            pointerEvents: "auto",
            width: 46,
            height: 46,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.045)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isPicked || isHinted ? element.color : "rgba(230,200,136,0.28)"}`,
            color: element.color,
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <RuneIcon glyph={element.glyph} seed={element.glyphSeed} className="h-5 w-5" />
        </motion.button>
        {(alwaysShowLabel || labelHovered) && (
          <div
            style={{
              marginTop: staggerLabel ? 22 : 6,
              textAlign: "center",
              fontFamily: "Manrope, sans-serif",
              fontSize: 10.5,
              color: "#8A8A94",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {element.name}
          </div>
        )}
      </Html>
    </group>
  );
}
