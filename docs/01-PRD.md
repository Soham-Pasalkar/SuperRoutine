# 01 — Product Requirements

## Product
**Super Routine** — a day-and-night supplement system: 8 essentials split into a **Day Pack** and a **Night Pack** (30-day supply = 30 day sachets + 30 night sachets). Brand promise: clean labels, exact doses, bioavailable forms, no filler.

## This project
Rebuild the existing prototype (`docs/reference/`) as a production-grade, fast, responsive Next.js site that collects **founding-waitlist signups + product-preference survey answers**, and replace the hero image with an **animated 3D rotating pill**.

## Goals
1. Look the same as the prototype (see Design Spec) on mobile, tablet and desktop.
2. Signups persisted reliably (not browser localStorage), abuse-resistant, with a consent record.
3. Fast: LCP ≤ 2.0 s on mobile Lighthouse; the 3D hero must not hurt Core Web Vitals.
4. Measurable funnel (per-step events).
5. Ready to add payments later without refactoring (feature-flagged module).

## Non-goals (now)
E-commerce catalogue, cart, customer accounts, subscriptions, custom box builder, admin dashboard, WhatsApp message sending.

## Pages
- `/` — the landing page (all sections, form).
- `/privacy`, `/terms` — placeholder pages with clearly marked TODO text for legal review (footer links point here).
- `/api/waitlist` (POST), `/api/waitlist/count` (GET) — see `docs/06`.
- `not-found`, `error` pages in brand style.

## Sections on `/` (order matters)
Header pill → Hero → 01 The Super Routine (Day/Night packs + supplement tiles) → 02 Our approach → 03 The build (timeline) → 04 Founding member access (6 benefit tiles) → 05 Founding access (dark form section) → Footer.

## Features
**F1 (requested) — 3D rotating pill hero.** Replaces the hero photo. Spec: `docs/05-HERO-3D.md`.
**F2 — Real founding-member counter + position.** The counter pill (hidden when count is below a threshold) reads the real signup count; the success screen shows "Founding member #N". Never fake numbers.

## Approved deviations from the prototype
✅ = do it. ⬜ = do NOT do unless the owner asks later.
- ✅ Hero photo → 3D hero (F1), same slot, same rounded-card footprint.
- ✅ Success message must say **WhatsApp** (the prototype's default text says "email"; no email is collected).
- ✅ Phone validation: Indian mobile `^[6-9]\d{9}$` after stripping `+91`/`91`/`0`/spaces/dashes.
- ✅ Anti-abuse: honeypot + Turnstile + rate limit + unique phone (dedupe).
- ✅ Remove dead code from the prototype (the old "Q1 item status" logic, unused `STATES`).
- ✅ Real persistence instead of `localStorage`; `localStorage` may only hold an unsent form draft.
- ✅ Self-hosted fonts and optimized images instead of Google Fonts CDN and base64.
- ✅ Add OG/Twitter meta, favicon set, `sitemap`, `robots`, JSON-LD `Organization`.
- ⬜ Changing layout widths, the 4+2 benefit grid, timeline styling, header button label ("Vote"), or hero copy. Keep as prototype. (Header label lives in one constant `HEADER_CTA_LABEL` so it is a one-line change.)

## Acceptance (summary — full list in `docs/08`)
- Visual match to screenshots at 4 viewports (excluding the hero stage).
- Form: 4 questions + details → persisted row in Supabase; duplicate phone handled gracefully; success screen with position + WhatsApp share.
- Reduced-motion and no-WebGL users see a static poster; nothing breaks.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
