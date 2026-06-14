"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  AGENCY_MAP_EDGES,
  AGENCY_MAP_NODES,
  type AgencyMapNodeId,
} from "@/lib/agency-map/nodes";

function getPosition(id: AgencyMapNodeId): THREE.Vector3 {
  const node = AGENCY_MAP_NODES.find((entry) => entry.id === id);
  if (!node) return new THREE.Vector3();
  return new THREE.Vector3(...node.position);
}

export function ConnectionNetwork({
  pulse = true,
}: {
  pulse?: boolean;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    for (const [from, to] of AGENCY_MAP_EDGES) {
      const a = getPosition(from);
      const b = getPosition(to);
      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!lineRef.current || !pulse) return;
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#6c4cf1"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
