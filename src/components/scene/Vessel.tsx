import { Html, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ELEMENTS } from "../../game/recipes";
import { useGameStore } from "../../game/store";
import "./liquidMaterial";
import { useVesselTarget } from "./VesselTargetContext";

interface VesselProps {
  transmissionSamples: number;
  reducedMotion: boolean;
}

const IDLE_COLOR = new THREE.Color("#E8A94B");

export function Vessel({ transmissionSamples, reducedMotion }: VesselProps) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.ShaderMaterial>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const shakeState = useRef({ elapsed: 0, active: false, seed: Math.random() * 100 });
  const fillRef = useRef(0.32);

  const vessel = useGameStore((s) => s.vessel);
  const reaction = useGameStore((s) => s.reaction);
  const pickedId = useGameStore((s) => s.pickedId);
  const draggingId = useGameStore((s) => s.draggingId);
  const dropPicked = useGameStore((s) => s.dropPicked);
  const clearVessel = useGameStore((s) => s.clearVessel);
  const vesselTarget = useVesselTarget();

  const targetColor = useMemo(() => {
    if (vessel.length === 0) return IDLE_COLOR;
    const colors = vessel.map((slot) => new THREE.Color(ELEMENTS[slot.elementId].color));
    const mixed = colors[0].clone();
    for (let i = 1; i < colors.length; i++) mixed.lerp(colors[i], 1 / (i + 1));
    return mixed;
  }, [vessel]);

  const intensityRef = useRef(0);

  useFrame((state, delta) => {
    if (liquidRef.current) {
      liquidRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const currentColor = liquidRef.current.uniforms.uColor.value as THREE.Color;
      currentColor.lerp(targetColor, delta * 3);

      const targetIntensity =
        reaction && reaction.type === "success" ? 1.4 : draggingId ? 0.35 : 0;
      intensityRef.current = THREE.MathUtils.damp(
        intensityRef.current,
        targetIntensity,
        4,
        delta
      );
      liquidRef.current.uniforms.uIntensity.value = intensityRef.current;
      liquidRef.current.uniforms.uWobble.value = reducedMotion ? 0.15 : 1;

      const targetFill = 0.32 + vessel.length * 0.16;
      fillRef.current = THREE.MathUtils.damp(fillRef.current, targetFill, 3.5, delta);
      liquidMeshRef.current?.scale.setScalar(fillRef.current);
      liquidRef.current.uniforms.uOpacity.value = THREE.MathUtils.damp(
        liquidRef.current.uniforms.uOpacity.value,
        0.5 + vessel.length * 0.12,
        3.5,
        delta
      );
    }

    if (groupRef.current) {
      const shake = shakeState.current;
      if (shake.active && !reducedMotion) {
        shake.elapsed += delta;
        const duration = 0.4;
        if (shake.elapsed >= duration) {
          shake.active = false;
          groupRef.current.position.x = 0;
          groupRef.current.rotation.z = 0;
        } else {
          const amp = (1 - shake.elapsed / duration) * 0.06;
          const t = shake.elapsed;
          groupRef.current.position.x = Math.sin(t * 60 + shake.seed) * amp;
          groupRef.current.rotation.z = Math.sin(t * 45 + shake.seed) * amp * 0.5;
        }
      } else {
        groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, 0, 8, delta);
        groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0, 8, delta);
      }
    }
  });

  useEffect(() => {
    if (reaction?.type === "fail") {
      shakeState.current.active = true;
      shakeState.current.elapsed = 0;
    }
  }, [reaction]);

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <sphereGeometry args={[1.05, 64, 64]} />
        {transmissionSamples > 1 ? (
          <MeshTransmissionMaterial
            samples={transmissionSamples}
            thickness={0.6}
            roughness={0.04}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.025}
            anisotropy={0.15}
            distortion={0.08}
            distortionScale={0.2}
            temporalDistortion={0.05}
            color="#F3F0E7"
            background={new THREE.Color("#0A0A0C")}
          />
        ) : (
          <meshPhysicalMaterial
            roughness={0.05}
            transmission={1}
            ior={1.45}
            thickness={0.6}
            color="#F3F0E7"
            attenuationColor="#F3F0E7"
            attenuationDistance={1.5}
          />
        )}
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.24, 0.34, 0.5, 32]} />
        <meshPhysicalMaterial
          roughness={0.06}
          metalness={0}
          transmission={1}
          ior={1.45}
          thickness={0.2}
          color="#F3F0E7"
          attenuationColor="#F3F0E7"
          attenuationDistance={1.2}
        />
      </mesh>

      <mesh ref={liquidMeshRef} position={[0, -0.15, 0]} scale={0.32}>
        <sphereGeometry args={[1, 48, 48]} />
        <liquidMaterial ref={liquidRef} transparent uWobble={reducedMotion ? 0.15 : 1} />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        color={targetColor}
        intensity={2.2}
        distance={3.5}
        decay={2}
      />

      {vessel.map((slot, i) => (
        <PendingMote key={slot.key} color={ELEMENTS[slot.elementId].color} index={i} />
      ))}

      {reaction && (
        <ReactionBurst
          key={reaction.key}
          type={reaction.type}
          color={reaction.resultId ? ELEMENTS[reaction.resultId].color : "#8A8A94"}
          reducedMotion={reducedMotion}
        />
      )}

      <Html transform={false} occlude={false} center zIndexRange={[15, 0]} position={[0, 0.15, 0]}>
        <button
          ref={(el) => {
            vesselTarget.current = el;
          }}
          type="button"
          onClick={pickedId ? dropPicked : vessel.length > 0 ? clearVessel : undefined}
          disabled={!pickedId && vessel.length === 0}
          aria-label={
            pickedId
              ? `The vessel${vessel.length > 0 ? `, holding ${vessel.length}` : ""}. Drop ${ELEMENTS[pickedId].name} in.`
              : vessel.length > 0
                ? `The vessel. Holding ${vessel.length} reagent${vessel.length > 1 ? "s" : ""}. Tap to clear.`
                : "The vessel. Empty."
          }
          style={{
            width: 210,
            height: 210,
            borderRadius: "50%",
            background: "transparent",
            border: pickedId ? "1px dashed rgba(230,200,136,0.4)" : "1px solid transparent",
            cursor: pickedId || vessel.length > 0 ? "pointer" : "default",
            pointerEvents: "auto",
          }}
        />
      </Html>
    </group>
  );
}

function PendingMote({ color, index }: { color: string; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + seed;
    const angle = t * 0.8 + index * 2.1;
    ref.current.position.set(Math.cos(angle) * 0.28, -0.15 + Math.sin(t * 1.3) * 0.12, Math.sin(angle) * 0.28);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function ReactionBurst({
  type,
  color,
  reducedMotion,
}: {
  type: "success" | "fail";
  color: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const start = useRef(performance.now());

  const count = type === "success" ? 90 : 40;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 1.4,
        Math.random() * 2 - 1
      ).normalize();
      const speed = type === "success" ? 1.2 + Math.random() * 1.4 : 0.4 + Math.random() * 0.5;
      velocities[i * 3] = dir.x * speed;
      velocities[i * 3 + 1] = dir.y * speed + (type === "success" ? 0.6 : 0.1);
      velocities[i * 3 + 2] = dir.z * speed;
    }
    return { positions, velocities };
  }, [count, type]);

  useFrame(() => {
    if (!ref.current) return;
    const elapsed = (performance.now() - start.current) / 1000;
    const life = reducedMotion ? 0.5 : 0.9;
    const t = Math.min(elapsed / life, 1);
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = geometry.velocities[i * 3] * elapsed;
      arr[i * 3 + 1] = geometry.velocities[i * 3 + 1] * elapsed - elapsed * elapsed * 0.6;
      arr[i * 3 + 2] = geometry.velocities[i * 3 + 2] * elapsed;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 1 - t;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={type === "success" ? 0.05 : 0.035}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
