import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGameStore } from "../../game/store";

interface CameraRigProps {
  reducedMotion: boolean;
}

const BASE_RADIUS = 7.2;
const BASE_ELEVATION = 2.1;
const TARGET = new THREE.Vector3(0, 0.35, 0);

/** On narrow/portrait viewports, horizontal FOV shrinks relative to vertical —
 * pull back so the reagent arc stays on-screen instead of feeling zoomed in. */
function aspectRadiusMultiplier(aspect: number): number {
  if (aspect >= 1) return 1;
  return Math.min(1.85, 1 / aspect);
}

export function CameraRig({ reducedMotion }: CameraRigProps) {
  const { camera, size } = useThree();
  const reaction = useGameStore((s) => s.reaction);
  const phase = useGameStore((s) => s.phase);

  const dolly = useRef({ amount: 0 });
  const baseAzimuth = useRef(0);
  const finale = useRef({ pull: 0 });

  useEffect(() => {
    if (reaction?.type !== "success" || reaction.resultId === "gold") return;
    const scale = reducedMotion ? 0.35 : 1;
    gsap.killTweensOf(dolly.current);
    gsap
      .timeline()
      .to(dolly.current, { amount: scale, duration: 0.55, ease: "power4.out" })
      .to(dolly.current, { amount: 0, duration: 0.9, ease: "power3.inOut" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reaction]);

  useEffect(() => {
    if (phase !== "finale") return;
    gsap.killTweensOf(finale.current);
    gsap.to(finale.current, {
      pull: 1,
      duration: reducedMotion ? 1.4 : 2.8,
      ease: "power2.out",
    });
  }, [phase, reducedMotion]);

  useFrame((_state, delta) => {
    const aspectMul = aspectRadiusMultiplier(size.width / size.height);
    const baseRadius = BASE_RADIUS * aspectMul;

    if (phase === "finale") {
      const radius = baseRadius + finale.current.pull * 4.5 * aspectMul;
      const elevation = BASE_ELEVATION + finale.current.pull * 1.4;
      const azimuth = reducedMotion ? 0 : Math.sin(baseAzimuth.current) * 0.15;
      if (!reducedMotion) baseAzimuth.current += delta * 0.015;

      camera.position.x = Math.sin(azimuth) * radius;
      camera.position.z = Math.cos(azimuth) * radius;
      camera.position.y = elevation;
      camera.lookAt(TARGET);

      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = THREE.MathUtils.damp(cam.fov, 42 + finale.current.pull * 4, 4, delta);
      cam.updateProjectionMatrix();
      return;
    }

    if (!reducedMotion) {
      baseAzimuth.current += delta * 0.035;
    }
    const azimuth = Math.sin(baseAzimuth.current) * 0.3;
    const radius = baseRadius - dolly.current.amount * 1.25;
    const elevation = BASE_ELEVATION - dolly.current.amount * 0.25;

    camera.position.x = Math.sin(azimuth) * radius;
    camera.position.z = Math.cos(azimuth) * radius;
    camera.position.y = elevation;
    camera.lookAt(TARGET);

    const cam = camera as THREE.PerspectiveCamera;
    const targetFov = 42 - dolly.current.amount * 4;
    cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 6, delta);
    cam.updateProjectionMatrix();
  });

  return null;
}
