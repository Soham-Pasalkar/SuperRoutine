"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CapsuleProps {
  still?: boolean;
  scrollProgress?: number;
}

export function Capsule({ still = false, scrollProgress = 0 }: CapsuleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointerPos = useRef({ x: 0, y: 0 });

  // Dimensions
  const radius = 0.85;
  const cylinderLength = 1.35;
  const halfCyl = cylinderLength / 2;

  // Track fine pointer parallax
  React.useEffect(() => {
    if (still) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerPos.current = { x: nx * 0.15, y: ny * 0.15 };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [still]);

  // Materials
  const dayMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#A9CBEF"),
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.2,
      }),
    []
  );

  const nightMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0B142B"),
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.2,
      }),
    []
  );

  const seamMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#DCE5F0"),
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 0.5,
        envMapIntensity: 1.5,
      }),
    []
  );

  // Animation frame loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (still) {
      // Fixed presentation angle for poster capture
      groupRef.current.rotation.set(0.2, 0.75, 0.35);
      groupRef.current.position.set(0, 0, 0);
      return;
    }

    const t = state.clock.getElapsedTime();

    // 1. Continuous yaw rotation (~0.35 rad/s) + scroll-linked yaw offset
    const scrollYaw = (scrollProgress || 0) * Math.PI * 0.5;
    const targetYaw = t * 0.35 + scrollYaw + pointerPos.current.x;

    // 2. Fixed tilt on Z ≈ 20° (0.35 rad) + slight pitch parallax
    const targetPitch = 0.12 + pointerPos.current.y;
    const targetRoll = 0.35; // 20 degrees

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetPitch,
      3,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetYaw,
      5,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRoll,
      3,
      delta
    );

    // 3. Gentle float (period ~4s, amplitude ~0.08 units)
    const floatY = Math.sin(t * ((Math.PI * 2) / 4)) * 0.08;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      floatY,
      3,
      delta
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Capsule oriented horizontally along X axis */}
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Day Half (Upper in local Y -> Left in world X) */}
        <group position={[0, 0, 0]}>
          <mesh material={dayMaterial} position={[0, halfCyl / 2, 0]}>
            <cylinderGeometry args={[radius, radius, halfCyl, 64, 1, true]} />
          </mesh>
          <mesh material={dayMaterial} position={[0, halfCyl, 0]}>
            <sphereGeometry args={[radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        {/* Night Half (Lower in local Y -> Right in world X) */}
        <group position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <mesh material={nightMaterial} position={[0, halfCyl / 2, 0]}>
            <cylinderGeometry args={[radius, radius, halfCyl, 64, 1, true]} />
          </mesh>
          <mesh material={nightMaterial} position={[0, halfCyl, 0]}>
            <sphereGeometry args={[radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        {/* Silver Seam Ring */}
        <mesh material={seamMaterial} position={[0, 0, 0]}>
          <cylinderGeometry args={[radius * 1.018, radius * 1.018, 0.045, 64, 1, false]} />
        </mesh>
      </group>
    </group>
  );
}
