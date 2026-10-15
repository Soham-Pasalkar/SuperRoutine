"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  PerformanceMonitor,
  AdaptiveDpr,
} from "@react-three/drei";
import { Capsule } from "./Capsule";

interface HeroSceneProps {
  still?: boolean;
  isVisible?: boolean;
  scrollProgress?: number;
  onLoaded?: () => void;
}

export default function HeroScene({
  still = false,
  isVisible = true,
  scrollProgress = 0,
  onLoaded,
}: HeroSceneProps) {
  return (
    <div
      className="h-full w-full"
      style={{ pointerEvents: still ? "none" : "auto" }}
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        dpr={still ? [2, 2] : [1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 6], fov: 32 }}
        frameloop={still ? "never" : isVisible ? "always" : "never"}
        onCreated={() => {
          if (onLoaded) {
            requestAnimationFrame(() => onLoaded());
          }
        }}
      >
        {!still && (
          <PerformanceMonitor>
            <AdaptiveDpr pixelated={false} />
          </PerformanceMonitor>
        )}

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} color="#FFF8F0" />
        <directionalLight position={[-4, 3, -3]} intensity={1.0} color="#7EB2F0" />

        {/* Procedural Environment Reflection Studio */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2}
            position={[2, 4, 3]}
            scale={[5, 2, 1]}
            color="#FFFFFF"
          />
          <Lightformer
            form="circle"
            intensity={1.5}
            position={[-3, -2, -2]}
            scale={[4, 4, 1]}
            color="#8BB5F0"
          />
          <Lightformer
            form="rect"
            intensity={0.8}
            position={[0, -4, 0]}
            scale={[8, 3, 1]}
            color="#A0C6F5"
          />
        </Environment>

        <Suspense fallback={null}>
          <Capsule still={still} scrollProgress={scrollProgress} />
        </Suspense>

        {/* Baked Contact Shadow */}
        <ContactShadows
          frames={1}
          blur={2.5}
          opacity={0.35}
          scale={8}
          far={3}
          position={[0, -1.65, 0]}
        />
      </Canvas>
    </div>
  );
}
