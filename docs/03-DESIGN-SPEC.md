# 03 — Design Spec (match the prototype)

**Rule:** exact numbers (gradients, shadows, paddings, media queries) live in `reference/prototype.css`. This document gives the tokens and the intent; when you need a precise value, read the CSS. Compare against `reference/screenshot-01..09.png`.

## Tokens (from prototype `:root`)
| Token | Value | Use |
|---|---|---|
| `--bgL` | `#E3EEF9` | Light section background (page default) |
| `--inkL` | `#061A44` | Primary text / headlines on light |
| `--muteL` | `#1C2434` | Body/secondary text on light |
| `--cardL` | `#F3F8FD` | Cards on light |
| `--lineL` | `#C4D8EE` | Borders/dividers on light |
| `--dimL` | `#6F8FCB` | Dim/accent words in headings on light |
| `--bgD` | `#0A1226` | Dark section background (form section) |
| `--inkD` | `#F4F7FC` | Text on dark |
| `--muteD` | `#9AA6BC` | Secondary text on dark |
| `--cardD` | `#111C36` | Cards on dark |
| `--lineD` | `#22304F` | Borders on dark |
| `--dimD` | `#6D7B9A` | Dim text on dark |
| `--acc` | `#2F5BD6` | Accent on light (eyebrow numbers, "all along.") |
| `--accD` | `#8EAAFF` | Accent on dark |
| `--btnbg` | `#06163B` | Primary button base (button also has a navy→blue gradient: read `.btn`) |
| `--navy` | `#0B2654` | Deep navy |
| Day pack | `linear-gradient(160deg,#A9CBEF,#CFE2F6)`, text `#0B2654` | |
| Night pack | `linear-gradient(160deg,#0B1226,#16244A)`, text `#F4F7FC`, border `#22304F` | |
| Timeline "on" dot | `#A9CBEF`, glow `0 0 28px -4px #A9CBEF` | |

Sections alternate by class: `.sec-l` (light vars) and `.sec-d` (dark vars). Implement as a `data-theme="light|dark"` wrapper that re-maps `--bg/--ink/--mute/--card/--line/--dim/--a`.

## Typography
- Sans: **Inter** (400/500/600/700/800). Mono/label: **Manrope** (600/700/800), always uppercase with wide tracking for labels.
- Base 16px / line-height 1.55, antialiased.
- `h1`: `clamp(2.5rem, 9.4vw, 4.9rem)`, weight 700, letter-spacing `-.045em`, line-height 1.02.
- `h2`: `clamp(2.1rem, 7.4vw, 3.7rem)`, same weight/tracking/leading.
- `h3`: weight 600, tracking `-.025em`.
- `.lead`: `clamp(1.02rem, 2.6vw, 1.2rem)`, color `--mute`, max-width 56ch, margin-top 22px.
- `.eyebrow`: Manrope 500 `.72rem`, tracking `.18em`, uppercase, color `--mute`, preceded by a 34×1px line; the number is bold in `--a` (e.g. "— **01** / THE SUPER ROUTINE").
- Heading accent pattern: second half of a heading is colored `--acc`/`--dim` ("One for Day. One for Night.", "all along.", "in public.", "Early Access.").

## Layout
- `section { padding: 56px 22px }` mobile; larger at breakpoints (see CSS). `.wrap { max-width: 1080px; margin: 0 auto }`, `.narrow { max-width: 720px }`.
- Breakpoints used by the prototype: **380, 700, 760, 800, 899/900** (min/max-width). Reproduce these exact breakpoints.
- Page background: soft light-blue with a radial blue glow top-right of the hero and a pale white glow left (see screenshot-01).
- `html { scroll-behavior: smooth; scroll-padding-top: calc(env(safe-area-inset-top) + 96px) }`; honor safe-area insets (`viewport-fit=cover`).

## Components
**Header pill** — sticky, `top: safe-area + 12px`, width `min(100% - 28px, 1080px)`, `border-radius: 999px`, translucent `color-mix(in srgb, var(--bgL) 72%, transparent)` + `backdrop-filter: blur(18px) saturate(1.4)`, 1px border, soft shadow. Logo left (height 58px), CTA pill button right (label from `HEADER_CTA_LABEL`, default **"Vote"**, scrolls to the form).

**Button** — pill (`border-radius: 999px`), weight 600, `-.01em`, gradient navy; `.lg` padding `20px 34px` / `1.1rem`; `.sm` `14px 26px`; hover `translateY(-1px)`; disabled `opacity .35`. Primary CTA has a trailing arrow (→).

**Hero** — centered stack: h1 line 1 "Complete Day & Night Supplement System." (dark navy); italic gradient subline "8 Essential Nutrients. 2 Simple Packs." (blue → lighter blue); then large two-line "Daily Routine made / **Super Routine!**" (second line larger, blue gradient); lead paragraph (centered, max ~56ch, "**Super Routine**" bold); large CTA "Join the Founding Waitlist →"; then the **hero stage** (3:2, `border-radius: 30px`, shadow `0 40px 80px -30px rgba(11,38,84,.45)`) — this is where the 3D scene goes (`docs/05`). Counter pill ("Joined N") appears near the CTA only when count ≥ threshold.

**Pack cards** — `border-radius: 32px`, padding `32px 28px`; icon 42px (sun / moon), title 2rem `-.04em`, goals line in mono caps (`ENERGY · FOCUS · STRENGTH` / `RECOVER · SLEEP · RELAX`). Day = sky gradient, Night = navy gradient. Grid: 1 column mobile, 2 columns ≥ 800/900px (follow CSS). Inside: 2×2 grid of **supplement tiles** (rounded ~26px, translucent card, 3D pill at left, name `600`, dose/form below, chevron right). Tile expands (accordion) to show the detail panel (see Content §Supplement detail fields). Chevron rotates 90° when open.

**Pill3D** — port the prototype's `pill(name)` renderer exactly (stacked `<span>` layers with gradients to fake a 3D solid; kinds `cap`, `disc`, `caps`, `gel`; config in `data/supplements.json → PILLS`). Rotates continuously only while its tile is open/hovered or in view; no animation under reduced-motion. Keep the soft ground shadow under it.

**Approach (02)** — H2, 1px divider, then 4 inline columns (Clean / Transparent / Evidence-led / Honest), each: blue dot + uppercase label + one line. 1 column mobile, 4 columns ≥ 900.

**Build timeline (03)** — vertical line; each step: 48px circle with number, h3, mono status (COMPLETED / IN PROGRESS / UPCOMING), description. Steps 01-03 use the "on" style (`.step.on`: filled `#A9CBEF` dot + glow, status colored `#A9CBEF`); 04-05 outlined. Replicate exactly, including the pale status label.

**Benefit tiles (04)** — 6 tiles: numbered rounded-square badge (sky gradient), h3, one line. Grid: 2 cols mobile/tablet; 4 cols desktop (so 4 + 2), per prototype.

**Founding access / form (05)** — dark navy gradient section (`.sec-d`), eyebrow + H2 "Claim your Founding **Member Spot.**" (accent `--accD`), lead, then a **white card** (`border-radius` ~34px, large shadow) containing the stepper. Progress label "QUESTION n OF 4" + two thin progress bars. Option cards: bordered rounded rows with a small 3D icon at left, title 600, description in `--mute`. Radio is visually hidden over the card; selected state = accent border + subtle tint. Footer of card: ← Back (ghost) and Continue → (disabled until valid). Price step uses a dual-handle range slider (₹500–₹4,000, step ₹100, default ₹1,200–₹3,300, benchmark marker at ₹3,000 and the line "Eight separate jars usually cost about ₹3,000 a month."). Final step: first name, WhatsApp number (prefilled "+91 "), consent checkbox, submit. Success state: big check circle, "You're in.", message, **Share on WhatsApp** button.

**Footer** — logo (larger), tagline "Clean Day and Night Supplements" (600), divider, "© 2026 Super Routine. All rights reserved.", social icons row at right (Instagram, LinkedIn, WhatsApp, YouTube — only if URLs set), optional Privacy/Terms/Contact links.

## Motion
- Reveal on scroll: fade + 16px translate-up, 500-600ms ease-out, once, staggered children ≤ 80ms. Disabled under reduced motion.
- Accordion: `grid-template-rows` 0fr→1fr .3s; chevron rotate .25s.
- Buttons: `transform .2s`.
- Form steps: crossfade/slide 8-12px, 250ms.
- Hero 3D: `docs/05`.

## Accessibility
Contrast ≥ 4.5:1 for body text (note: `--dimL` on `--bgL` is only for large display text), focus ring `2px solid var(--acc)` offset 3px, tap targets ≥ 44px, `lang="en-IN"`, landmarks (`header/main/footer`), skip link.

## Responsiveness checklist
375 (iPhone), 390, 768, 1024, 1280, 1440, 1920. No horizontal scroll at any width. Header pill never overlaps content (sticky offset + scroll-padding). Hero headline must not wrap awkwardly at 360px; the italic subline uses fluid size with a sane minimum (≥ 1rem).
