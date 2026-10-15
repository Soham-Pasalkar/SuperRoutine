import React from "react";
import { HERO_CONTENT } from "@/lib/content";

export function HeroPoster() {
  return (
    <figure className="hero-media" style={{ margin: 0 }}>
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          aspectRatio: "3 / 2",
          borderRadius: "30px",
          background:
            "radial-gradient(ellipse at 50% 45%, #D4E8FC 0%, #A3C9F2 50%, #87B4E6 100%)",
        }}
        role="img"
        aria-label={HERO_CONTENT.mediaAlt}
      >
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(circle at 65% 35%, rgba(255,255,255,0.8), transparent 45%)",
          }}
        />
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "55%",
            height: "26%",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #A9CBEF 0%, #C8DEF6 48%, #16244A 52%, #0B1226 100%)",
            boxShadow:
              "0 24px 50px -12px rgba(11,38,84,0.45), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.5)",
            transform: "rotate(-18deg)",
          }}
        >
          <div
            className="absolute h-full w-[3px]"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #CCD9E8 50%, #8A99AC 100%)",
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        </div>
      </div>
    </figure>
  );
}
