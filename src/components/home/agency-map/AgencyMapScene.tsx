"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Sparkles,
  Stars,
  PerspectiveCamera,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ConnectionNetwork } from "@/components/home/agency-map/ConnectionNetwork";
import { ServiceNodeMesh } from "@/components/home/agency-map/ServiceNodeMesh";
import {
  AGENCY_MAP_NODES,
  type AgencyMapNodeId,
} from "@/lib/agency-map/nodes";

function SceneCameraParallax({
  controlsRef,
  enabled,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  enabled: boolean;
}) {
  const { pointer } = useThree();

  useFrame(() => {
    if (!enabled || !controlsRef.current) return;
    controlsRef.current.target.x = pointer.x * 0.18;
    controlsRef.current.target.y = pointer.y * 0.12;
  });

  return null;
}

function AgencyMapSceneInner({
  labels,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  onHoverSound,
  focusToken,
  reducedMotion,
}: {
  labels: Record<AgencyMapNodeId, string>;
  hoveredId: AgencyMapNodeId | null;
  selectedId: AgencyMapNodeId | null;
  onHover: (id: AgencyMapNodeId | null) => void;
  onSelect: (id: AgencyMapNodeId) => void;
  onHoverSound?: () => void;
  focusToken: number;
  reducedMotion: boolean;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [focusToken]);

  const sparkleCount = isMobile ? 40 : 90;

  return (
    <>
      <color attach="background" args={["#070b10"]} />
      <fog attach="fog" args={["#070b10", 6, 16]} />
      <PerspectiveCamera makeDefault position={[0, 0.4, 5.8]} fov={48} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={1.2} color="#6c4cf1" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#25d366" />
      <directionalLight position={[0, 5, 2]} intensity={0.45} color="#38bdf8" />

      <Stars
        radius={60}
        depth={30}
        count={isMobile ? 600 : 1200}
        factor={2}
        saturation={0}
        fade
        speed={0.4}
      />
      <Sparkles
        count={sparkleCount}
        scale={[8, 5, 8]}
        size={2}
        speed={0.25}
        opacity={0.35}
        color="#38bdf8"
      />

      <ConnectionNetwork pulse={!reducedMotion} />

      {AGENCY_MAP_NODES.map((node, index) => (
        <ServiceNodeMesh
          key={node.id}
          node={node}
          index={index}
          hovered={hoveredId === node.id}
          selected={selectedId === node.id}
          label={labels[node.id]}
          onHover={onHover}
          onSelect={onSelect}
          onHoverSound={onHoverSound}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={!isMobile}
        minDistance={4}
        maxDistance={9}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.35}
        dampingFactor={0.06}
        rotateSpeed={0.55}
        maxPolarAngle={Math.PI * 0.62}
        minPolarAngle={Math.PI * 0.28}
      />

      <SceneCameraParallax controlsRef={controlsRef} enabled={!reducedMotion} />
    </>
  );
}

export function AgencyMapCanvas({
  labels,
  selectedId,
  onHover,
  onSelect,
  onHoverSound,
  focusToken,
  reducedMotion,
}: {
  labels: Record<AgencyMapNodeId, string>;
  selectedId: AgencyMapNodeId | null;
  onHover: (id: AgencyMapNodeId | null) => void;
  onSelect: (id: AgencyMapNodeId) => void;
  onHoverSound?: () => void;
  focusToken: number;
  reducedMotion: boolean;
}) {
  const [hoveredId, setHoveredId] = useState<AgencyMapNodeId | null>(null);

  const handleHover = useCallback(
    (id: AgencyMapNodeId | null) => {
      setHoveredId(id);
      onHover(id);
    },
    [onHover]
  );

  const dpr = useMemo(
    () =>
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75)
        : 1,
    []
  );

  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onPointerMissed={() => handleHover(null)}
    >
      <Suspense fallback={null}>
        <AgencyMapSceneInner
          labels={labels}
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={handleHover}
          onSelect={onSelect}
          onHoverSound={onHoverSound}
          focusToken={focusToken}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
