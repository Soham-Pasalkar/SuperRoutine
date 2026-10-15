# 02 — Tech Stack & Architecture

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** + React + **TypeScript (strict)** | Server Components by default; Route Handlers for the API |
| Package manager | **pnpm** | |
| Styling | **Tailwind CSS v4** | Tokens from `docs/03` as `@theme` variables; no arbitrary hex values |
| Fonts | `next/font/google` → **Inter** (variable, wght 400-800) + **Manrope** (variable, wght 600-800) | Self-hosted, latin subset, `display: swap` |
| Accordion | Native `<button aria-expanded>` + CSS grid-rows transition (as prototype) or Radix Accordion | Match prototype animation (`grid-template-rows 0fr→1fr`, .3s) |
| Motion | **Motion** (Framer Motion) for section reveals / form step transitions | Tiny; respect reduced motion |
| 3D hero | **three** + **@react-three/fiber** + **@react-three/drei** (named imports only) | Lazy-loaded client chunk, see `docs/05` |
| Forms | **React Hook Form** + **Zod** (`@hookform/resolvers`) | One shared schema client+server |
| DB | **Supabase Postgres** | RLS on, no public policies; inserts via server with service role |
| Bot protection | **Cloudflare Turnstile** | Free, privacy-friendly |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`) | e.g. 5 req / 10 min / IP on POST |
| Analytics | **PostHog** (or Plausible) | Funnel events per form step |
| Hosting | **Vercel** | Preview deployments per PR; set region to Mumbai (`bom1`) for Indian users |
| Payments (later) | **Razorpay**, feature-flagged OFF | `docs/07` |
| Tests | **Vitest** (unit), **Playwright** (e2e + visual regression), **Lighthouse CI** | |
| Lint/format | ESLint (Next config) + Prettier + `tsc --noEmit` | CI on every PR |
| CI | GitHub Actions | lint, typecheck, test, build, Playwright, LHCI |

## Folder structure
```
super-routine/
├── AGENTS.md  .agent/rules/
├── docs/                      # this spec pack (+ reference/)
├── data/supplements.json      # SUPS + PILLS data (source of truth)
├── public/
│   ├── images/logo.png        # (convert to SVG/WebP if a vector source exists)
│   └── og/                    # generated OG image
├── scripts/                   # poster render, visual baselines
├── src/
│   ├── app/
│   │   ├── layout.tsx  page.tsx  not-found.tsx  error.tsx
│   │   ├── privacy/page.tsx   terms/page.tsx
│   │   ├── sitemap.ts  robots.ts  opengraph-image.tsx
│   │   └── api/waitlist/route.ts   api/waitlist/count/route.ts
│   ├── components/
│   │   ├── header/ hero/ (HeroStage, HeroScene, HeroPoster)
│   │   ├── packs/ (PackCard, SupplementTile, Pill3D)
│   │   ├── sections/ (Approach, Build, Benefits, FoundingAccess)
│   │   ├── form/ (WaitlistForm, steps/*, PriceSlider)
│   │   └── ui/ (Button, Eyebrow, Reveal)
│   ├── lib/ (env.ts, schemas.ts, phone.ts, supabase-server.ts, ratelimit.ts, analytics.ts, content.ts)
│   ├── styles/globals.css     # tokens + base
│   └── features/payments/     # flagged OFF, see docs/07
└── tests/ (unit, e2e, visual)
```

## Rendering strategy
- `/` is **statically rendered** (SSG). Hero text + CTA are plain server-rendered HTML (this is the LCP element, not the 3D).
- Counter value: fetched client-side from `/api/waitlist/count` (cached 60 s) so the page stays static.
- 3D scene is a separate dynamic import (`ssr:false`), started after first paint when visible, capable and motion is allowed.
- Form is a client island; everything else is server components, with small client islands only for accordions/pills.

## Environment variables (`.env.example`, validated in `src/lib/env.ts`)
```
NEXT_PUBLIC_SITE_URL=
SUPABASE_URL=                      # server
SUPABASE_SERVICE_ROLE_KEY=         # server ONLY
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=              # server
UPSTASH_REDIS_REST_URL=            # server
UPSTASH_REDIS_REST_TOKEN=          # server
NEXT_PUBLIC_POSTHOG_KEY=
IP_HASH_SALT=                      # server, random string
COUNTER_MIN_DISPLAY=25
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_INSTAGRAM= NEXT_PUBLIC_LINKEDIN= NEXT_PUBLIC_WHATSAPP= NEXT_PUBLIC_YOUTUBE=
# Payments (OFF)
NEXT_PUBLIC_PAYMENTS_ENABLED=false
RAZORPAY_KEY_ID= RAZORPAY_KEY_SECRET= RAZORPAY_WEBHOOK_SECRET=
```
Social links and contact email render in the footer only when set (same as the prototype's `CONFIG`).

## Security baseline
CSP + security headers in `next.config` (allow only self, Turnstile, PostHog, Vercel analytics); `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`; server-side validation; parameterized DB access via supabase-js; escape/neutralize spreadsheet-formula characters (`= + - @`) when exporting CSV; secrets never in client bundle.
