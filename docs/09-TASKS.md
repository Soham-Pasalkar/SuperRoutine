# 09 — Task Plan (execute in order; one commit per task; stop for review at each ⛳)

## Phase 0 — Setup
- [ ] Create Next.js (App Router, TS strict, Tailwind v4, ESLint, pnpm) in the repo root; keep `docs/`, `data/`, `AGENTS.md`, `.agent/`.
- [ ] Add Prettier, Vitest, Playwright, Lighthouse CI configs; GitHub Actions workflow; `.env.example` → `src/lib/env.ts` (Zod).
- [ ] Tokens + base styles in `globals.css` (`docs/03`); `next/font` Inter + Manrope; `data-theme` light/dark wrapper.
- [ ] Convert `public/images/logo.png` to an optimized asset (SVG if traceable, else WebP at 2x); remove `hero-OLD…jpg` from the build (keep file for reference only).
⛳ Review: blank page with correct fonts, colors, base layout.

## Phase 1 — Static sections (pixel-match)
- [ ] Header pill (sticky, blur), Button, Eyebrow, Reveal primitives.
- [ ] Hero text + CTA + **poster placeholder stage** (3:2, radius 30, shadow).
- [ ] Section 01 shell: Day/Night pack cards with tiles (static).
- [ ] Section 02 Approach, 03 Timeline, 04 Benefit tiles, Footer.
- [ ] Responsive pass at 375/768/1280/1440; match breakpoints in `prototype.css`.
⛳ Review: side-by-side with screenshots 01-07 and 09.

## Phase 2 — Interactivity
- [ ] `Pill3D` port (stacked-layer CSS renderer) driven by `data/supplements.json`.
- [ ] Supplement tile accordion with detail panel (a11y, single-open behavior as prototype).
- [ ] Scroll-reveal animations; smooth anchor scroll from CTAs to the form.
⛳ Review: tile open/close, keyboard, reduced motion.

## Phase 3 — 3D hero (F1)
- [ ] `HeroStage` capability gating + `HeroScene` (R3F) per `docs/05`; procedural env, no external assets.
- [ ] `/poster` route + `pnpm poster` script → AVIF/WebP + blur placeholder; wire as LCP image.
- [ ] Offscreen pause, reduced-motion/no-WebGL/saveData fallbacks.
- [ ] Measure: Lighthouse mobile, 3D chunk size, FPS on throttled CPU.
⛳ Review: video/screenshots of the hero + perf numbers.

## Phase 4 — Form + backend
- [ ] Stepper UI exactly as prototype (screenshot-08), progress bars, option cards with 3D icons, price slider.
- [ ] Zod schema, phone util + tests, React Hook Form wiring, per-step analytics.
- [ ] Supabase migration, `/api/waitlist` (Turnstile, rate limit, dedupe, honeypot), `/api/waitlist/count`.
- [ ] Success screen: position (F2), WhatsApp share; counter pill with threshold.
⛳ Review: end-to-end submission into Supabase (test project), duplicate + error states.

## Phase 5 — Polish & compliance
- [ ] Meta/OG/Twitter, favicon set, JSON-LD, sitemap, robots, `opengraph-image`.
- [ ] `/privacy`, `/terms` placeholders (clearly marked for legal review), 404/error pages.
- [ ] Security headers/CSP; error monitoring (Sentry optional).
- [ ] Accessibility audit (axe + manual keyboard/screen-reader).

## Phase 6 — QA & deploy
- [ ] Visual regression baselines + tests, e2e suite, unit tests.
- [ ] Lighthouse CI gates; fix to budgets in `docs/08`.
- [ ] Deploy to Vercel (region `bom1`), env vars, domain; run the pre-launch checklist.

## Phase 7 — Payments module (flagged OFF)
- [ ] Implement `docs/07` behind `NEXT_PUBLIC_PAYMENTS_ENABLED`; tests in Razorpay test mode; verify the flag-off build ships no Razorpay code.

## Final deliverable
A walkthrough artifact: screenshots at 4 viewports vs prototype, Lighthouse reports, list of deviations, env/setup instructions, and a short "how to change copy/links" guide.
