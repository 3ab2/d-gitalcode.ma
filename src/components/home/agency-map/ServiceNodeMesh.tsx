"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { AgencyMapNodeId, AgencyMapNodeConfig } from "@/lib/agency-map/nodes";

export function ServiceNodeMesh({
  node,
  index,
  hovered,
  selected,
  label,
  onHover,
  onSelect,
  onHoverSound,
}: {
  node: AgencyMapNodeConfig;
  index: number;
  hovered: boolean;
  selected: boolean;
  label: string;
  onHover: (id: AgencyMapNodeId | null) => void;
  onSelect: (id: AgencyMapNodeId) => void;
  onHoverSound?: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const active = hovered || selected;
  const scale = active ? 1.28 : 1;

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = active ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.06 : 1;
    meshRef.current.scale.setScalar(scale * pulse);
  });

  return (
    <Float
      speed={1.2 + index * 0.08}
      rotationIntensity={0.15}
      floatIntensity={0.35}
      floatingRange={[-0.06, 0.06]}
    >
      <group ref={groupRef} position={node.position}>
        <mesh
          ref={meshRef}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(node.id);
            onHoverSound?.();
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            onHover(null);
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(node.id);
          }}
        >
          <icosahedronGeometry args={[0.24, 1]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.emissive}
            emissiveIntensity={active ? 1.1 : 0.45}
            metalness={0.35}
            roughness={0.25}
            toneMapped={false}
          />
        </mesh>

        {(hovered || selected) && (
          <Html
            center
            distanceFactor={10}
            position={[0, 0.55, 0]}
            className="pointer-events-none select-none"
          >
            <div className="agency-map-node-label whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              {label}
            </div>
          </Html>
        )}

        {active && (
          <mesh scale={1.8}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshBasicMaterial
              color={node.emissive}
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}
