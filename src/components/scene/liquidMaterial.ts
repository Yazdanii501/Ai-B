import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWobble;
  varying vec3 vNormal;
  varying float vFresnelBase;

  void main() {
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;
    float wave =
      sin(pos.x * 3.2 + uTime * 1.3) * 0.06 +
      sin(pos.z * 2.6 - uTime * 1.7) * 0.05 +
      sin((pos.x + pos.z) * 4.1 + uTime * 0.9) * 0.03;
    pos += normal * wave * uWobble;

    vec4 viewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    vFresnelBase = -viewPosition.z;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying float vFresnelBase;

  void main() {
    vec3 viewDir = normalize(vec3(0.0, 0.0, vFresnelBase));
    float fresnel = pow(1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.2);
    float pulse = 0.75 + 0.25 * sin(uTime * 1.6);
    vec3 core = uColor * 0.5;
    vec3 rim = uColor * (1.5 + uIntensity) * pulse;
    vec3 color = mix(core, rim, fresnel);
    gl_FragColor = vec4(color, uOpacity);
  }
`;

export const LiquidMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#E8A94B"),
    uIntensity: 0,
    uWobble: 1,
    uOpacity: 0.85,
  },
  vertexShader,
  fragmentShader
);

extend({ LiquidMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidMaterial: {
      uTime?: number;
      uColor?: THREE.Color | string;
      uIntensity?: number;
      uWobble?: number;
      uOpacity?: number;
      transparent?: boolean;
      ref?: React.Ref<THREE.ShaderMaterial>;
    };
  }
}
