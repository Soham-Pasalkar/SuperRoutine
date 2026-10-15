import React from "react";
import { supplementsData, PillConfig } from "@/lib/supplements";

function hexToRgb(h: string): [number, number, number] {
  const clean = h.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function mixColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

interface Pill3DProps {
  name: string;
}

export function Pill3D({ name }: Pill3DProps) {
  const p: PillConfig =
    supplementsData.PILLS[name] ?? supplementsData.PILLS["Magnesium Glycinate"]!;

  const n = Math.round(p.T * 1.5);
  const R = p.T / 2;

  const layers: React.ReactNode[] = [];

  for (let i = 0; i <= n; i++) {
    const z = -R + i * (p.T / n);
    const u = Math.abs(z) / R;
    let w: number;
    let hh: number;
    let rad: string;
    let bg: string;
    let sh: string | undefined = undefined;

    if (p.k === "cap" || p.k === "disc") {
      const sc = 1 - 0.16 * Math.pow(u, 4);
      w = p.W * sc;
      hh = p.H * sc;
      rad = p.k === "disc" ? "50%" : `${hh / 2}px`;
      if (u > 0.9) {
        bg = `radial-gradient(ellipse at 28% 22%,rgba(255,255,255,.95),rgba(255,255,255,0) 58%),linear-gradient(155deg,${p.face},${mixColor(p.face, p.edge, 0.6)})`;
        sh =
          "inset 0 -1.5px 2px rgba(0,0,0,.28),inset 0 1px 1.5px rgba(255,255,255,.9)";
        if (p.dots) {
          bg = `radial-gradient(circle at 20% 40%,#5A3E1B 0 .6px,transparent .8px) 0 0/5px 4px,radial-gradient(circle at 70% 70%,#5A3E1B 0 .6px,transparent .8px) 0 0/6px 5px,${bg}`;
        }
      } else {
        bg = `linear-gradient(180deg,${mixColor(p.edge, p.face, 0.45)},${p.edge} 60%,${mixColor(p.edge, "#000000", 0.3)})`;
      }
    } else {
      const q = Math.sqrt(Math.max(0.03, 1 - u * u));
      if (p.k === "caps") {
        w = p.W * (0.8 + 0.2 * q);
        hh = p.H * q;
        rad = `${hh / 2}px`;
      } else {
        w = p.W * q;
        hh = p.H * q;
        rad = "50%";
      }
      bg = `linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,0) 38%,rgba(0,0,0,.3)),${mixColor(p.edge, p.face, Math.pow(u, 1.5))}`;
      if (u > 0.93) {
        sh = "inset 0 0 3px rgba(255,255,255,.4)";
      }
    }

    layers.push(
      <i
        key={i}
        style={{
          width: `${w.toFixed(1)}px`,
          height: `${hh.toFixed(1)}px`,
          borderRadius: rad,
          background: bg,
          boxShadow: sh || "none",
          transform: `translate(-50%,-50%) translateZ(${z.toFixed(2)}px)`,
        }}
      />
    );
  }

  const hw = p.k === "caps" ? p.W * 0.66 : p.W * 0.5;
  const hhh = Math.max(2, p.H * (p.k === "gel" ? 0.2 : 0.2));

  return (
    <span className="pimg" aria-hidden="true">
      <span className="sh" />
      <span className="solid">
        {layers}
        <i
          className="hl"
          style={{
            width: `${hw.toFixed(1)}px`,
            height: `${hhh.toFixed(1)}px`,
            transform: `translate(-50%,-50%) translate(-${(p.W * 0.06).toFixed(1)}px,-${(p.H * 0.24).toFixed(1)}px) translateZ(${(R + 0.3).toFixed(2)}px)`,
          }}
        />
      </span>
    </span>
  );
}
