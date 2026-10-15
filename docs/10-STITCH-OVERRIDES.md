# 10 — How to use the Stitch design

Location: `docs/reference/stitch/stitch_super_routine_web_experience/` → `super_routine_founding_waitlist_day_night_system/` (desktop `screen.png` + `code.html`), `super_routine_mobile_…/` (mobile), `circadian_precision_wellness/DESIGN.md` (tokens). The Stitch MCP may also be used to fetch screens.

## Rule
Stitch is a **visual/layout reference**. The prototype + `docs/04-CONTENT.md` + `data/supplements.json` remain the source of truth for **copy, data, structure and behavior**. Stitch's color/type tokens are identical to the prototype's, so no token changes are needed.

## Element-by-element decision table
| Stitch element | Decision | Notes |
|---|---|---|
| Palette, fonts, radii, shadows | **Same as prototype** | No change |
| Overall section order (hero → 01 → 02 → 03 → 04 → 05 → footer) | **Same as prototype** | |
| Mobile layout (`super_routine_mobile…`) | **Adopt as visual reference** | Use for 375px spacing/stacking where the prototype CSS is silent |
| Card/tile styling, chips/tags, dividers, spacing rhythm | **Adopt visually** | Text in chips comes from our content only |
| Hero composition (headline → lead → primary CTA → media stage) | **Adopt layout** | Media stage = our 3D hero (`docs/05`), not the Stitch image |
| Secondary hero button "Explore 8 Essentials" | **OWNER DECISION** (default: omit) | If approved: scrolls to section 01, ghost button style |
| Top nav links (Overview / Circadian Science / Formulas / Community Vote) | **OWNER DECISION** (default: omit; header = logo + CTA as prototype) | If approved: link to anchors of sections 01-05 with labels "The routine", "Approach", "Build", "Join" |
| Day/Night pack cards layout with tags + footer line ("Take with your morning meal", "4 targeted actives") | **Adopt layout** | Footer text from `supplements.json` (`time`, count). No invented tags |
| Supplement tile expanded text | **REJECT Stitch text** | Use `supplements.json` verbatim |
| Supplement names/doses changed in Stitch (e.g. "Magnesium Bisglycinate Chelate (200 mg elemental)", "Active Vitamin B12", "600 EPA / 400 DHA", "60% Fulvic", "5% Withanolides") | **REJECT** | Use prototype names/doses |
| Timeline milestone cards (layout) | **Adopt layout** | Text/dates/statistics from our content only |
| Benefit tiles layout | **Adopt layout** | Copy from prototype; no "locked for life" price promise |
| Form card visual style | **Adopt visually** | Keep prototype's 4-question stepper + details; keep prototype questions/options |
| "No payment required today." helper line under the submit button | **Adopt** (true and reassuring) | |
| Success state visual | **Adopt visually** | Show real "Founding member #N", never fake IDs |

## Reject list — these must NOT appear anywhere on the site
Invented/unsubstantiated statements in the Stitch export. They are fabricated by the design tool, would contradict the brand promise ("No exaggerated claims"), and create real legal exposure (misleading advertising / FSSAI / consumer-protection rules):
- "Validated by clinical biochemists • 0 synthetic binders", "Clinically Studied", "peer-reviewed human clinical trials validating every single molecule"
- "27.9% reduction in serum cortisol within 60 days", "3.4x greater absorption", "Crosses blood-brain barrier", "Wild-harvested above 16,000 ft", "wild anchovy fisheries", "ATP synthesis", "Neuroprotection", "Cardio Profile", "Zero Morning Fog"
- "Surveyed 1,840 daily supplement consumers", "78% take incompatible compounds", "91% loathe…", "64% early consensus"
- Dates/milestones ("Q3 2024"), "ISO-17025 accredited blind screening", "Pilot Batches", "partnering with analytical pharmacologists", "manufacturing contract in Mumbai", "temperature-controlled regional hubs"
- "Founding Lifetime Price", "locked-for-life", "limited to 1,000 serialized crates", "Confirmed Ballot #SR-2025-0842", "No talc / zero titanium dioxide / aluminum-free" and any other composition claims
- Price numbers (₹1,999, ₹3,400+, ₹800 Basic, "6 bottles") — the prototype's slider (₹500-₹4,000, default ₹1,200-₹3,300) stays
If the owner confirms any of these are true and documented, they can be added deliberately later in a separate change.

## Implementation notes
- Do not use the Tailwind CDN or Google "Material Symbols" icon font from the Stitch HTML. Use lucide-react / inline SVG, self-hosted fonts via `next/font`.
- Stitch's hero is a static raster of a sachet with pills bursting out; our hero is the 3D rotating capsule (`docs/05`). Stitch's "Motion Capture / Tear & Dispersal Protocol" (Sealed → Tear → Release → Exploded View → Final Hold) is a possible **future** scroll animation; do not build it now.
