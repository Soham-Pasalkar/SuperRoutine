# 04 — Content (verbatim from the prototype)

Do not rewrite copy. Store in `src/lib/content.ts`. Supplement data is in `data/supplements.json` (keys: `SUPS.day[]`, `SUPS.night[]`, `PILLS{}`).

## Meta
- `<title>`: Super Routine | Founding waitlist
- Description: Join the Super Routine founding waitlist. (keep the prototype's full meta description from `reference/prototype.html` line ~7)

## Header
Logo · CTA button: `HEADER_CTA_LABEL = "Vote"`

## Hero
- H1: Complete Day & Night Supplement System.
- Subline (italic, gradient): 8 Essential Nutrients. 2 Simple Packs.
- Display: Daily Routine made / **Super Routine!**
- Lead: **Super Routine** is a day and night supplement system built around clean labels, exact doses, bioavailable forms and no filler. Eight essentials, split into a Day Pack and a Night Pack, so your routine is simple and every ingredient has a reason.
- CTA: Join the Founding Waitlist →

## 01 / The Super Routine
- H2: Two Packs. **One for Day. One for Night.**
- Lead: Super Routine splits eight essentials into a Day Pack and a Night Pack. Take one sachet in the morning and one before bed. A 30-day supply is 30 day sachets and 30 night sachets. Tap any supplement for the full details.
- **Day Pack** — ENERGY · FOCUS · STRENGTH — Vitamin D3 + K2 (4000 IU tablet), Himalayan Shilajit Gold (500 mg capsule), Omega-3 Fish Oil (1000 mg softgel), Vitamin B12 (200 mcg tablet)
- **Night Pack** — RECOVER · SLEEP · RELAX — Magnesium Glycinate (1000 mg tablet), Ashwagandha KSM-66 (600 mg tablet), Zinc Picolinate (30 mg tablet), Melatonin (3 mg tablet)

### Supplement detail fields (each tile expands to show)
`dose`, `time` (when to take), `does` (what it does), `form` (why this form), `look` (what to check on the label), `ev` (evidence level), `caution`. Labels in the UI follow the prototype's markup in `reference/prototype.html` (search "SUPS"). Render all values exactly as in `supplements.json`.

## 02 / Our approach
- H2: Supplements, built the way they should have been **all along.**
- Clean — Only what is necessary.
- Transparent — Every ingredient. Every form. Every amount.
- Evidence-led — Research before trend.
- Honest — No exaggerated claims.

## 03 / The build
- H2: We are building this **in public.**
- Lead: We research, compare and refine before production. We want you to see how we think, not just what we eventually sell.
1. The Problem — Completed — Finding what is wrong with how supplements are sold today.
2. The Research — In progress — Mapping clinical doses and active ingredient forms.
3. The Formulation — In progress — Sourcing clean actives with no filler.
4. The Testing — Upcoming — Third-party purity and heavy metal verification.
5. The Founding Drop — Upcoming — Founding members get access first.

## 04 / Founding member access
- H2: More than **Early Access.**
- Lead: Join early. Get in before the public. Follow the build and help decide what comes next.
1. 24-hour early access — Shop before the public launch.
2. Founding price — A lower price for the first cohort.
3. Behind the formulation — Lab results and sourcing notes.
4. Product voting — Vote on what we make next.
5. Priority restock — First in line when stock runs low.
6. Know first — Launch dates reach you first.

## 05 / Founding access (form)
- H2: Claim your Founding **Member Spot.**
- Lead: Join the first drop of Super Routine. Your answers decide what we build.
- Counter pill: "Joined N" (hidden below threshold)

| # | Question | Options (id → label / description) |
|---|---|---|
| Q1 | Which packaging do you prefer? | `info` Info-first pack — Ingredients, forms and doses large on the front. Minimal design, like a protein tub. · `designer` Designer pack — Premium look on the front, full details printed on the back. |
| Q2 | How would you like your supplements? | `sachets` Day and Night sachets — One sachet for the day, one for the night. A 30-day pack. · `jars` Separate jars — One bottle per supplement. · `either` Either, depends on price — I would pick the better value. |
| Q3 | How should your sachets be made? | `premade` Pre-made — All 8 supplements split into 2 sachets, Day and Night. · `custom` Custom — I choose which supplements go in my sachets. · `unsure` Not sure yet — Show me more first. |
| Q3b (only if `custom`) | Which would you want in your sachets? | multi-select of the 8 supplements (ids = slug of name) |
| Q4 | What monthly price feels right for a full Day and Night routine? | range ₹500–₹4,000, step 100, default ₹1,200–₹3,300; label "₹1,200 to ₹3,300 per month"; marker ₹3,000; note "Eight separate jars usually cost about ₹3,000 a month." |
| Details | Where should we send your Drop 01 access on WhatsApp? | First name · WhatsApp number · consent checkbox |

- Consent text (version `v1`): I agree to be contacted about Super Routine and to my answers being used to shape the product. We use your details only for this and never sell them.
- Success: **You're in.** — "{Name}, you're on the Super Routine founding list. We'll message you on WhatsApp when Drop 01 opens." (+ "Founding member #N")
- Share (WhatsApp): `https://wa.me/?text=` + encoded "I just joined the Super Routine founding list. Day and night supplements with every dose declared. {site url}"
- Buttons: ← Back · Continue → · Share on WhatsApp

## Footer
Clean Day and Night Supplements · © 2026 Super Routine. All rights reserved. · Social icons (only if set) · Privacy / Terms / Contact (only if set)

## Content flags (owner to confirm before public launch — do not change in code)
1. The hero reference photo showed different formulas ("7 in 1", Biotin, 5000 IU) than this copy. This copy is the source of truth.
2. "Eight separate jars usually cost about ₹3,000 a month." is an unsourced benchmark.
3. Health/benefit statements (e.g. zinc and testosterone, shilajit and "male vitality", melatonin and D3 doses) should be reviewed against FSSAI rules and by a qualified professional before launch.
