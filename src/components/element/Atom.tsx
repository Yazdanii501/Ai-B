import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CATEGORY_TINTS } from "../../game/elements";
import { useGameStore } from "../../game/store";
import type { ElementDef } from "../../game/types";

interface AtomProps {
  element: ElementDef;
  reducedMotion: boolean;
}

const GOLD = new THREE.Color("#E6C888");

export function Atom({ element, reducedMotion }: AtomProps) {
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const tint = CATEGORY_TINTS[element.category];
  const reaction = useGameStore((s) => s.reaction);
  const justCorrect = reaction?.type === "correct";

  useFrame((_state, delta) => {
    if (spinRef.current && !reducedMotion) {
      spinRef.current.rotation.y += delta * 0.06;
    }
    if (!tiltRef.current || reducedMotion) return;
    const targetY = pointer.x * 0.35;
    const targetX = -pointer.y * 0.22;
    tiltRef.current.rotation.y = THREE.MathUtils.damp(tiltRef.current.rotation.y, targetY, 4, delta);
    tiltRef.current.rotation.x = THREE.MathUtils.damp(tiltRef.current.rotation.x, targetX, 4, delta);
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        <Nucleus color={tint} reducedMotion={reducedMotion} celebrate={justCorrect} />
        {element.shells.map((count, shellIndex) => (
          <Shell
            key={shellIndex}
            shellIndex={shellIndex}
            electronCount={count}
            seed={element.number}
            reducedMotion={reducedMotion}
          />
        ))}
        {justCorrect && <ReactionBurst key={reaction!.key} color={tint} reducedMotion={reducedMotion} />}
      </group>
    </group>
  );
}

function Nucleus({
  color,
  reducedMotion,
  celebrate,
}: {
  color: string;
  reducedMotion: boolean;
  celebrate: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef(0);
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const idle = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
    const target = celebrate ? 1 : 0;
    glowRef.current = THREE.MathUtils.damp(glowRef.current, target, celebrate ? 10 : 2, delta);
    meshRef.current.scale.setScalar(idle + glowRef.current * 0.5);
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.9 + glowRef.current * 0.1;
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.32, 2]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
    </mesh>
  );
}

function ReactionBurst({
  color,
  reducedMotion,
}: {
  color: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const start = useRef(performance.now());
  const count = 70;

  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      const speed = 1.4 + Math.random() * 1.6;
      arr[i * 3] = dir.x * speed;
      arr[i * 3 + 1] = dir.y * speed;
      arr[i * 3 + 2] = dir.z * speed;
    }
    return arr;
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame(() => {
    if (!ref.current) return;
    const elapsed = (performance.now() - start.current) / 1000;
    const life = reducedMotion ? 0.4 : 0.9;
    const t = Math.min(elapsed / life, 1);
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = velocities[i * 3] * elapsed;
      arr[i * 3 + 1] = velocities[i * 3 + 1] * elapsed;
      arr[i * 3 + 2] = velocities[i * 3 + 2] * elapsed;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 1 - t;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function Shell({
  shellIndex,
  electronCount,
  seed,
  reducedMotion,
}: {
  shellIndex: number;
  electronCount: number;
  seed: number;
  reducedMotion: boolean;
}) {
  const shellRef = useRef<THREE.Group>(null);
  const radius = 0.85 + shellIndex * 0.52;

  const localSeed = seed * 31 + shellIndex * 17;
  const tiltX = ((localSeed % 7) / 7 - 0.5) * 1.6;
  const tiltZ = (((localSeed * 3) % 11) / 11 - 0.5) * 1.6;
  const spinSpeed = (0.12 + ((localSeed * 13) % 10) / 100) * (shellIndex % 2 === 0 ? 1 : -1);

  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  useFrame((_state, delta) => {
    if (!shellRef.current || reducedMotion) return;
    shellRef.current.rotation.y += delta * spinSpeed;
  });

  return (
    <group ref={shellRef} rotation={[tiltX, 0, tiltZ]}>
      <Line points={ringPoints} color={GOLD} transparent opacity={0.28} lineWidth={1} />
      {Array.from({ length: electronCount }, (_, i) => (
        <Electron key={i} radius={radius} index={i} total={electronCount} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

function Electron({
  radius,
  index,
  total,
  reducedMotion,
}: {
  radius: number;
  index: number;
  total: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseAngle = (index / total) * Math.PI * 2;
  const speed = 0.5 + (index % 3) * 0.12;

  useFrame((state) => {
    if (!meshRef.current) return;
    const angle = reducedMotion ? baseAngle : baseAngle + state.clock.elapsedTime * speed;
    meshRef.current.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color="#F3F0E7" toneMapped={false} />
    </mesh>
  );
}
