# 08 — Performance Budgets & QA

## Budgets (mobile, Lighthouse "Moto G Power / Slow 4G"; enforce in `lighthouserc.json`)
| Metric | Budget |
|---|---|
| Performance score | ≥ 90 |
| Accessibility / Best Practices / SEO | ≥ 95 / ≥ 95 / ≥ 95 |
| LCP | ≤ 2.0 s (hard fail > 2.5 s) |
| CLS | ≤ 0.05 |
| INP (lab TBT proxy ≤ 200 ms) | ≤ 200 ms |
| Initial JS (excl. 3D chunk) | ≤ 120 KB gzip |
| 3D chunk | ≤ 180 KB gzip, loaded after idle |
| Hero poster | ≤ 60 KB AVIF/WebP |
| Total page weight at load | ≤ 600 KB before 3D |
| Fonts | 2 variable fonts, latin subset, `swap`, preloaded by `next/font` |

Rules: no render-blocking third-party scripts; analytics + Turnstile load `afterInteractive`/on form focus; images sized with explicit dimensions; `content-visibility: auto` on below-the-fold sections where safe; avoid `backdrop-filter` on large areas other than the header.

## Visual regression (`pnpm visual`)
1. `scripts/capture-prototype-baselines.ts`: Playwright renders `docs/reference/prototype-original.html` at **375×812, 768×1024, 1280×800, 1440×900**, full-page, with animations disabled, saving baselines to `tests/visual/baseline/`.
2. Visual tests screenshot the built site at the same sizes and compare with `pixelmatch`/Playwright `toHaveScreenshot` (threshold ≈ 1-2%).
3. **Mask** the hero stage and the 3D pills (animated/intentionally different). Fonts differ slightly (self-hosted vs CDN): allow small tolerance on text.
4. Fail the build on regressions; baselines updated only deliberately.

## E2E (Playwright)
- Happy path: complete all steps → 201 → success screen with position and WhatsApp link.
- Validation: invalid phone, missing consent, price range invalid, honeypot filled → blocked.
- Duplicate phone → friendly success with `duplicate`.
- Rate limit → friendly error.
- Reduced-motion + no-WebGL → poster only, no console errors.
- Keyboard-only run through the whole form; accordions toggle with Enter/Space.
- Axe accessibility scan on every state.

## Unit tests (Vitest)
Phone normalization (+91, 91, 0 prefixes, spaces, dashes, invalid), Zod schema, counter display threshold, position logic, (payments flagged off) signature verification.

## Cross-browser/device manual pass
Safari iOS, Chrome Android, Samsung Internet, Firefox, desktop Safari/Chrome/Edge. Test low-power mode, slow 3G throttling, and 200% text zoom.

## Pre-launch checklist
- [ ] Env vars set in Vercel (prod + preview); service-role key not exposed
- [ ] Supabase RLS enabled, table not publicly readable (test with anon key)
- [ ] Turnstile + rate limit verified in production
- [ ] Privacy/Terms pages reviewed by a legal professional
- [ ] OG image, favicon, sitemap, robots, canonical URL
- [ ] Analytics funnel events visible
- [ ] Lighthouse CI passing on the production URL
- [ ] Custom domain, HTTPS, www/non-www redirect
- [ ] Backup/export plan for signups; CSV export neutralizes `= + - @`
- [ ] Payments flag confirmed OFF
