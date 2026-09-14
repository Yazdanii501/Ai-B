import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import type { PerfProfile } from "../../game/perf";
import { Atmosphere } from "./Atmosphere";
import { CameraRig } from "./CameraRig";
import { ReagentShelf } from "./ReagentShelf";
import { Table } from "./Table";
import { Vessel } from "./Vessel";
import { VesselTargetContext } from "./VesselTargetContext";

interface SceneProps {
  perf: PerfProfile;
  reducedMotion: boolean;
}

export function Scene({ perf, reducedMotion }: SceneProps) {
  const vesselTargetRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Canvas
      dpr={perf.dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.1, 7.2], fov: 40, near: 0.1, far: 40 }}
    >
      <color attach="background" args={["#0A0A0C"]} />
      <fog attach="fog" args={["#0A0A0C", 6, 15]} />

      <VesselTargetContext.Provider value={vesselTargetRef}>
        <ambientLight intensity={0.12} color="#3a2d1c" />
        <CandleLight position={[-1.6, 2.2, 1.4]} color="#E8A94B" intensity={1.1} />
        <CandleLight position={[1.8, 2, 1.1]} color="#E6C888" intensity={0.8} />
        <CandleLight position={[0, 1.6, -2.4]} color="#C1502E" intensity={0.5} />

        <Environment resolution={128} environmentIntensity={0.4}>
          <Lightformer
            form="rect"
            intensity={2.2}
            color="#E8A94B"
            position={[-3, 3, 2]}
            scale={[3, 5, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            color="#F3F0E7"
            position={[3, 2.5, 1.5]}
            scale={[2.5, 4, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="ring"
            intensity={1.1}
            color="#C1502E"
            position={[0, 1, -4]}
            scale={4}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="circle"
            intensity={0.6}
            color="#14100C"
            position={[0, -3, 0]}
            scale={6}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </Environment>

        <Table cheapMaterials={perf.cheapMaterials} />
        <Vessel transmissionSamples={perf.transmissionSamples} reducedMotion={reducedMotion} />
        <ReagentShelf />
        <Atmosphere particleCount={perf.particleCount} reducedMotion={reducedMotion} />
        <CameraRig reducedMotion={reducedMotion} />
      </VesselTargetContext.Provider>

      {perf.bloomEnabled && (
        <EffectComposer multisampling={0}>
          {[
            <Bloom
              key="bloom"
              intensity={reducedMotion ? 0.35 : 0.85}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.25}
              mipmapBlur
            />,
            ...(perf.dofEnabled && !reducedMotion
              ? [
                  <DepthOfField
                    key="dof"
                    focusDistance={0.015}
                    focalLength={0.04}
                    bokehScale={2.2}
                  />,
                ]
              : []),
          ]}
        </EffectComposer>
      )}
    </Canvas>
  );
}

function CandleLight({
  position,
  color,
  intensity,
}: {
  position: [number, number, number];
  color: string;
  intensity: number;
}) {
  const ref = useRef<import("three").PointLight>(null);
  const seed = useRef(Math.random() * 100);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + seed.current;
    const flicker = Math.sin(t * 8) * 0.06 + Math.sin(t * 3.3) * 0.05;
    ref.current.intensity = intensity + flicker;
  });

  return (
    <pointLight ref={ref} position={position} color={color} intensity={intensity} distance={9} decay={2} />
  );
}
