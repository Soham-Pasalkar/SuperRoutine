"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HERO_CONTENT } from "@/lib/content";
import { HERO_POSTER_BLUR } from "@/lib/poster-blur";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
});

function checkWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext("webgl2")
    );
  } catch {
    return false;
  }
}

function isCapableDevice(): boolean {
  if (typeof window === "undefined") return false;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData === true) return false;

  if (!checkWebGL2()) return false;

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores < 4 && memory < 4) return false;

  return true;
}

export function HeroStage() {
  const containerRef = useRef<HTMLElement>(null);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasPosterImage, setHasPosterImage] = useState(true);

  // IntersectionObserver to pause rendering when offscreen & gate 3D loading
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setIsVisible(visible);

        // Capability-gated dynamic import on idle
        if (visible && !shouldLoad3D) {
          if (isCapableDevice()) {
            const load = () => setShouldLoad3D(true);
            if ("requestIdleCallback" in window) {
              window.requestIdleCallback(load);
            } else {
              setTimeout(load, 1200);
            }
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    // Track scroll progress while in view for subtle scroll-linked rotation
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < winH) {
        const progress = (winH - rect.top) / (winH + rect.height);
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoad3D]);

  return (
    <figure
      ref={containerRef}
      className="hero-media relative w-full overflow-hidden"
      style={{ margin: 0, aspectRatio: "3 / 2", borderRadius: "30px" }}
    >
      {/* 1. LCP Poster Image */}
      {hasPosterImage ? (
        <Image
          src="/images/hero-poster.webp"
          alt={HERO_CONTENT.mediaAlt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 840px"
          placeholder="blur"
          blurDataURL={HERO_POSTER_BLUR}
          className={`object-cover transition-opacity duration-500 ${
            isSceneReady ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onError={() => setHasPosterImage(false)}
        />
      ) : (
        /* Fallback CSS gradient placeholder if poster asset not yet generated */
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isSceneReady ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, #D4E8FC 0%, #A3C9F2 50%, #87B4E6 100%)",
          }}
          role="img"
          aria-label={HERO_CONTENT.mediaAlt}
        />
      )}

      {/* 2. Interactive R3F Scene */}
      {shouldLoad3D && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isSceneReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroScene
            isVisible={isVisible}
            scrollProgress={scrollProgress}
            onLoaded={() => setIsSceneReady(true)}
          />
        </div>
      )}
    </figure>
  );
}
