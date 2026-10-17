"use client";

import React from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
});

export default function PosterClient() {
  return (
    <div
      id="poster-stage"
      style={{
        width: 1200,
        height: 800,
        position: "relative",
        background:
          "radial-gradient(ellipse at 50% 45%, #D4E8FC 0%, #A3C9F2 50%, #87B4E6 100%)",
        overflow: "hidden",
      }}
    >
      <HeroScene still={true} isVisible={true} />
    </div>
  );
}
