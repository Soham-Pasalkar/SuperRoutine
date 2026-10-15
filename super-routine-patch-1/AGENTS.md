# AGENTS.md — Super Routine

You are building the production website for **Super Routine**, a day/night supplement brand (India). Current scope: the **founding-waitlist landing site**, rebuilt from an existing HTML prototype, plus a 3D animated hero. Read this file fully before any task.

## Source-of-truth order (when sources disagree, higher wins)
1. `docs/reference/screenshot-01..09.png` — how the prototype actually renders (desktop, Safari).
2. `docs/reference/prototype.css` and `docs/reference/prototype.html` — exact CSS values and behavior. `prototype-original.html` is the same file with images embedded: use it for rendering/baselines.
3. `docs/*.md` in this repo (PRD, design spec, content, etc.), including `docs/10-STITCH-OVERRIDES.md`.
4. `docs/reference/stitch/` (Google Stitch export + Stitch MCP) — **VISUAL/LAYOUT REFERENCE ONLY**. Never a source of copy, numbers, claims or code. Read `docs/10-STITCH-OVERRIDES.md` before using it.
5. Your own judgment — only where 1-4 are silent. State assumptions in the plan.

## Non-negotiables
- **Pixel-faithful.** Match the prototype's look: colors, type, radii, spacing, shadows, section order, copy. Do not "improve" the design. The only allowed deviations are listed in `docs/01-PRD.md` §Approved deviations.
- **Do NOT use `public/images/hero-OLD-contains-errors.jpg`.** It shows "7 in 1", Biotin, 5000 IU and identical sachets, which contradict the product. It is replaced by the 3D hero. Keep it only as a reference for the composition's size/radius/shadow.
- **Do not invent or alter copy, doses, evidence claims or cautions.** All content comes from `docs/04-CONTENT.md` and `data/supplements.json`.
- **No invented statistics, dates, certifications, sourcing or clinical claims anywhere** (e.g. survey numbers, "ISO-17025", percentage reductions, "wild-harvested", "limited to 1,000"). The Stitch export contains many of these; they are on the reject list in `docs/10-STITCH-OVERRIDES.md`. If a design needs filler text, use the prototype's copy or ask.
- **Never copy Stitch code into the project** (it uses the Tailwind CDN and Google Material Symbols font). Re-implement in Next.js + Tailwind v4 with local SVG icons (lucide-react or inline SVG).
- **Payments are OFF.** Build the Razorpay module only behind `NEXT_PUBLIC_PAYMENTS_ENABLED=false` (see `docs/07-PAYMENTS-OPTIONAL.md`). Never enable it.
- **No secrets in client code.** Service keys live in server-only env vars, validated by a Zod `env.ts`.
- **Never store** government IDs, payment card data, or health data. The only personal data: first name, WhatsApp number, consent record, survey answers, UTM params, hashed IP.

## Stack (details: `docs/02-TECH-STACK.md`)
Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · React Three Fiber + drei (hero only) · Motion (Framer Motion) for reveals · React Hook Form + Zod · Supabase Postgres · Cloudflare Turnstile · Upstash Ratelimit · PostHog · Vercel · pnpm.
Use the latest stable versions at build time; verify peer-dependency compatibility (especially React / R3F / drei / three) before pinning.

## Commands (create these scripts in package.json)
`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` (Vitest) · `pnpm e2e` (Playwright) · `pnpm visual` (visual regression vs prototype) · `pnpm lhci` (Lighthouse CI) · `pnpm poster` (render hero poster)

## Code rules
- TypeScript `strict`, no `any`, no `@ts-ignore` without a comment explaining why.
- Server Components by default; `"use client"` only for interactivity (accordions, form, pills, 3D).
- Design tokens only via CSS variables / Tailwind theme (`docs/03-DESIGN-SPEC.md` §Tokens). No hard-coded hex values in components.
- Validate all input with Zod on client **and** server (share one schema in `lib/schemas`).
- Every interactive element: keyboard accessible, visible `:focus-visible`, correct ARIA (accordions use `aria-expanded`/`aria-controls`; errors use `role="alert"`).
- Respect `prefers-reduced-motion` everywhere (no autoplay motion, no 3D canvas).
- No layout shift: reserve space for images/canvas with explicit aspect ratios.
- Images via `next/image` (AVIF/WebP). Fonts via `next/font` (self-hosted, subset, `display: swap`). No third-party runtime requests except analytics + Turnstile.
- Adding a dependency requires a one-line justification in the PR/commit and must fit the bundle budgets in `docs/08-PERFORMANCE-QA.md`.
- Small commits, conventional commit messages, one task per commit.

## Definition of done (every phase)
1. `pnpm lint && pnpm typecheck && pnpm test` pass.
2. Compare against the screenshots with the browser agent at **375×812, 768×1024, 1280×800, 1440×900**; attach before/after screenshots in the walkthrough artifact.
3. Lighthouse (mobile) meets the budgets in `docs/08-PERFORMANCE-QA.md`.
4. List any deviation from the prototype and why.

## Ask before proceeding if
A required env var/key is missing, a dependency conflict forces a major version change, or a spec conflict affects the visual design.
