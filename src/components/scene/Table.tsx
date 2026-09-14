import { MeshReflectorMaterial } from "@react-three/drei";

interface TableProps {
  cheapMaterials: boolean;
}

export function Table({ cheapMaterials }: TableProps) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        {cheapMaterials ? (
          <meshStandardMaterial color="#1a1310" metalness={0.7} roughness={0.35} />
        ) : (
          <MeshReflectorMaterial
            blur={[200, 60]}
            resolution={1024}
            mixBlur={0.9}
            mixStrength={55}
            roughness={0.4}
            depthScale={1}
            minDepthThreshold={0.8}
            maxDepthThreshold={1.3}
            color="#1a1310"
            metalness={0.7}
            mirror={0}
          />
        )}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0]}>
        <ringGeometry args={[8.6, 9, 64]} />
        <meshStandardMaterial color="#3a2d1c" metalness={0.85} roughness={0.35} />
      </mesh>
    </group>
  );
}
