import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { ElementDef } from "../../game/types";
import type { PerfProfile } from "../../game/perf";
import { Atom } from "./Atom";

interface AtomSceneProps {
  element: ElementDef;
  reducedMotion: boolean;
  perf: PerfProfile;
}

export function AtomScene({ element, reducedMotion, perf }: AtomSceneProps) {
  return (
    <Canvas
      dpr={perf.dpr}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 5.5], fov: 45, near: 0.1, far: 30 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.15} />
      <CameraSettle reducedMotion={reducedMotion} />
      <Atom element={element} reducedMotion={reducedMotion} />
      {perf.bloomEnabled && (
        <EffectComposer multisampling={0}>
          {[
            <SMAA key="smaa" />,
            <Bloom
              key="bloom"
              intensity={0.9}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.3}
              mipmapBlur
            />,
            <Vignette key="vignette" eskil={false} offset={0.25} darkness={0.65} />,
          ]}
        </EffectComposer>
      )}
    </Canvas>
  );
}

function CameraSettle({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const state = useRef({ z: reducedMotion ? 5.5 : 8 });

  useEffect(() => {
    state.current.z = reducedMotion ? 5.5 : 8;
    gsap.to(state.current, {
      z: 5.5,
      duration: reducedMotion ? 0.01 : 1.1,
      ease: "power3.out",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = state.current.z;
    cam.lookAt(0, 0, 0);
  });

  return null;
}
