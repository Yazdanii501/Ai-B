import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    edge = pow(clamp(edge, 0.0, 1.0), 1.8);
    float fade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
    gl_FragColor = vec4(uColor, edge * fade * uOpacity);
  }
`;

export const BeamMaterial = shaderMaterial(
  { uColor: new THREE.Color("#E6C888"), uOpacity: 0.08 },
  vertexShader,
  fragmentShader
);

extend({ BeamMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    beamMaterial: {
      uColor?: THREE.Color | string;
      uOpacity?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      side?: THREE.Side;
    };
  }
}
