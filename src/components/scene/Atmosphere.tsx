import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import "./beamMaterial";

interface AtmosphereProps {
  particleCount: number;
  reducedMotion: boolean;
}

export function Atmosphere({ particleCount, reducedMotion }: AtmosphereProps) {
  return (
    <group>
      <GhostSymbol reducedMotion={reducedMotion} />
      <LightShafts />
      {!reducedMotion && <DustMotes count={particleCount} />}
    </group>
  );
}

function GhostSymbol({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);

  const circlePoints = useMemo(() => makeCirclePoints(4.2, 96), []);
  const trianglePointsUp = useMemo(() => makeTrianglePoints(3.6, false), []);
  const trianglePointsDown = useMemo(() => makeTrianglePoints(3.6, true), []);

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.z += delta * 0.008;
  });

  return (
    <group ref={ref} position={[0, 0.4, -6.5]}>
      <Line points={circlePoints} color="#E6C888" transparent opacity={0.05} lineWidth={1} />
      <Line points={trianglePointsUp} color="#E6C888" transparent opacity={0.035} lineWidth={1} />
      <Line
        points={trianglePointsDown}
        color="#E6C888"
        transparent
        opacity={0.035}
        lineWidth={1}
      />
    </group>
  );
}

function makeCirclePoints(radius: number, segments: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
  }
  return pts;
}

function makeTrianglePoints(radius: number, flip: boolean): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 3; i++) {
    const a = (i / 3) * Math.PI * 2 + (flip ? Math.PI : 0) - Math.PI / 2;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
  }
  return pts;
}

function LightShafts() {
  return (
    <group>
      <mesh position={[-2.6, 2.8, -2]} rotation={[0, 0, 0.18]}>
        <planeGeometry args={[1.6, 7]} />
        <beamMaterial uColor="#E8A94B" uOpacity={0.07} transparent depthWrite={false} />
      </mesh>
      <mesh position={[2.3, 2.6, -1.4]} rotation={[0, 0, -0.14]}>
        <planeGeometry args={[1.3, 6.4]} />
        <beamMaterial uColor="#E6C888" uOpacity={0.05} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function DustMotes({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.5 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.random() * 4 - 0.6;
      arr[i * 3 + 2] = Math.sin(angle) * radius - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.08;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -0.6;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#E6C888"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}
