"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroParticles({ active }: { active: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !active) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const count = isMobile ? 48 : 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.userSelect = "none";
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i * 3] = (Math.random() - 0.5) * 0.004;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x25d366,
      size: isMobile ? 0.045 : 0.055,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const resize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    let raf = 0;

    const animate = () => {
      if (!document.hidden) {
        const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < count; i += 1) {
          let x = attr.getX(i) + velocities[i * 3];
          let y = attr.getY(i) + velocities[i * 3 + 1];
          let z = attr.getZ(i) + velocities[i * 3 + 2];

          if (x > 12) x = -12;
          if (x < -12) x = 12;
          if (y > 7) y = -7;
          if (y < -7) y = 7;
          if (z > 5) z = -5;
          if (z < -5) z = 5;

          attr.setXYZ(i, x, y, z);
        }
        attr.needsUpdate = true;

        points.rotation.y = Math.sin(frame * 0.00035) * 0.08;
        points.rotation.x = Math.cos(frame * 0.00028) * 0.04;
        renderer.render(scene, camera);
        frame += 1;
      }

      raf = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [active]);

  return (
    <div
      ref={mountRef}
      className="hero-particles absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}
