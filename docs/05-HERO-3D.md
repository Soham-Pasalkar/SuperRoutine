# 05 — Hero 3D Animation (the rotating pill)

Replaces the prototype hero artwork (historical reference: previously named `hero-OLD-contains-errors.jpg`, now permanently deleted). Same footprint as the original prototype card: 3:2 card, `border-radius: 30px`, same shadow, same position under the CTA. Text and CTA stay plain HTML.

## Visual concept
A large, glossy **two-tone capsule** (left half = Day sky-blue `#A9CBEF→#CFE2F6`, right half = Night navy `#0B1226→#16244A`, thin silver seam ring) floating in a soft sky-blue gradient stage with a soft contact shadow below. Slow rotation, gentle float, subtle pointer parallax. It communicates "Day + Night" without any text.

**Stretch (flagged, desktop only, `ORBIT_PILLS=true`):** the 8 supplement pills from `data/supplements.json → PILLS` (colors/dimensions from there) orbit slowly around the capsule at varying radii, smaller scale, no more than ~6k triangles total.

## Behavior
- Rotation: continuous yaw ≈ 0.35 rad/s around Y, fixed tilt on Z ≈ 20° so the halves read clearly.
- Float: Y offset sine, amplitude ≈ 0.08 units, period ≈ 4 s.
- Pointer parallax (only `(pointer: fine)`): lerped ±0.15 rad max on X/Y; never jittery.
- Scroll-linked: while the hero is in view, add extra yaw proportional to scroll progress (adds life; keep subtle).
- Entrance: poster cross-fades to live canvas (300 ms) once the first frame has rendered.
- Pauses (`frameloop="never"` or stop `useFrame`) when the stage is off-screen (IntersectionObserver) or the tab is hidden.

## Loading strategy (critical for performance)
1. **Server-render a poster**: `<Image priority fill>` of `public/images/hero-poster.avif|webp` (≤ 60 KB) inside the 3:2 stage. **This is the LCP element**, not the canvas.
2. Client component `HeroStage` decides whether to load the scene. Load only if ALL are true: `prefers-reduced-motion: no-preference`, WebGL2 available, `navigator.connection?.saveData !== true`, and not a very low-end device (`navigator.hardwareConcurrency >= 4` OR `deviceMemory >= 4` when available).
3. Then `import("./HeroScene")` via `next/dynamic({ ssr:false })`, triggered by `requestIdleCallback` (fallback `setTimeout 1200`) **after** the poster has loaded and the stage is visible.
4. Otherwise the poster stays — a polished static hero. No broken states, no layout shift (stage has fixed `aspect-ratio`).

## Implementation notes (R3F)
- Imports: `three`, `@react-three/fiber`, `@react-three/drei` — **named imports only** (tree-shaking). 3D chunk budget: **≤ 180 KB gzip**.
- `<Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 6], fov: 32 }}>`; transparent canvas over the CSS gradient stage.
- Capsule geometry: two halves — `CylinderGeometry` (open-ended) + `SphereGeometry(…, 0, 2π, 0, π/2)` hemisphere per half — 64 radial / 32 cap segments. Materials: `MeshPhysicalMaterial` with `clearcoat 1`, `clearcoatRoughness .08`, `roughness .25`, `metalness 0`, `envMapIntensity ~1`. **No transmission, no post-processing, no shadows from lights.**
- Lighting: low ambient, one key directional (warm white), one cool blue rim, plus procedural reflections: `<Environment resolution={256}>` with `<Lightformer>` children. **Do not use `preset=` or any HDR file URL** (they fetch from a CDN at runtime).
- Soft ground shadow: drei `<ContactShadows frames={1} blur={2.5} opacity={.35} scale={8} far={3} />` (baked once).
- `<PerformanceMonitor>` + `<AdaptiveDpr pixelated={false}>` to degrade gracefully.
- Canvas: `aria-hidden`, `role="presentation"`; poster `<Image alt="Super Routine day and night capsule">` .
- Do not use `useGLTF`/external models in v1 — geometry is procedural (zero network, zero asset weight). If a branded model is supplied later, compress with Draco/Meshopt (≤ 300 KB) and `KTX2` textures.

## Poster generation (`pnpm poster`)
A script (Playwright) opens `/poster` (a hidden route that renders the scene at a fixed angle with `?still=1`, animation frozen, DPR 2, transparent/stage background), screenshots the stage, and writes `public/images/hero-poster.avif` and `.webp` plus a tiny `blurDataURL`. Commit the outputs. Until the script exists, use a CSS gradient placeholder with the same aspect ratio.

## Acceptance
- Lighthouse mobile LCP element is the poster; LCP ≤ 2.0 s; CLS 0; INP ≤ 200 ms with the scene running.
- Steady ≥ 55 fps on a mid-range phone (Moto G-class) with orbit pills off; frame time budget < 8 ms GPU on a laptop.
- Reduced motion / no WebGL / Save-Data → poster only, no canvas, no console errors.
- Scene stops rendering when scrolled away (verify via DevTools Performance).
- Text contrast over the stage is unaffected (the stage sits below the text, not behind it).
