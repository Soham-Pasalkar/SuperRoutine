# START HERE — Building Super Routine with Antigravity

## 0. What's in this pack
```
AGENTS.md                  ← project rules (also copied to .agent/rules/)
START_HERE.md              ← you are here
.env.example               ← all env vars
data/supplements.json      ← 8 supplements + pill render configs (source of truth)
docs/01-PRD.md             ← scope, goals, approved deviations
docs/02-TECH-STACK.md      ← stack, folders, rendering strategy, env
docs/03-DESIGN-SPEC.md     ← tokens, type, components, layout (match prototype)
docs/04-CONTENT.md         ← all copy verbatim + form options
docs/05-HERO-3D.md         ← the rotating-pill hero (R3F), loading + fallbacks
docs/06-FORM-AND-BACKEND.md← form flow, Zod, API, Supabase SQL, privacy
docs/07-PAYMENTS-OPTIONAL.md← Razorpay module, flagged OFF
docs/08-PERFORMANCE-QA.md  ← budgets, visual regression, e2e, launch checklist
docs/09-TASKS.md           ← phased task list with review gates
docs/reference/            ← prototype.html/.css, prototype-original.html, 9 screenshots
public/images/logo.png     ← logo extracted from the prototype
public/images/hero-OLD-contains-errors.jpg  ← DO NOT SHIP (wrong formulas)
supabase/migrations/0001_waitlist.sql
```

## 1. Set up
1. Create an empty folder `super-routine`, unzip this pack into it, `git init`, first commit.
2. Open the folder in **Antigravity** as the workspace. Antigravity should pick up `AGENTS.md`; if it doesn't, the same rules are in `.agent/rules/super-routine.md` (workspace rules).
3. Create free accounts and keys you'll need by Phase 4: **Supabase** (new project), **Cloudflare Turnstile**, **Upstash Redis**, **PostHog**, **Vercel**, and a GitHub repo. Put values in `.env.local` (never commit it).
4. Use **Planning mode** for the first task so the agent writes a plan before coding; review the plan artifact.

## 2. First prompt (paste into the Antigravity agent)
```
Read AGENTS.md and every file in docs/ (01 to 09) and docs/reference/, then data/supplements.json.
Do NOT write code yet. Produce a plan artifact that:
1) restates the scope and the approved deviations in your own words,
2) lists any ambiguities or conflicts you found between the docs, the prototype CSS and the screenshots,
3) proposes the exact dependency list with versions you will install (check compatibility of React, three, @react-three/fiber and drei),
4) maps docs/09-TASKS.md Phase 0 and Phase 1 into concrete steps.
Wait for my approval before running Phase 0.
```

## 3. Then, per phase
Use this prompt each time:
```
Execute Phase <N> from docs/09-TASKS.md. Follow AGENTS.md. When finished: run lint, typecheck and tests; use the browser agent to compare the result with docs/reference screenshots at 375x812, 768x1024, 1280x800 and 1440x900; attach before/after screenshots and a list of deviations in a walkthrough artifact. Stop for my review.
```
Don't let the agent run several phases unreviewed. The visual-match phases (1, 2) and the hero (3) are where drift happens.

## 4. Decisions only you can make (the agent will not change these)
- Header button label (prototype says "Vote"; one constant to change).
- The "₹3,000 for eight jars" claim needs a source or softer wording.
- Health/benefit wording and doses → review against FSSAI rules / a qualified professional.
- Whether and when to switch payments on (needs product, testing and licensing ready).
- Privacy policy and terms text → legal review.

## 5. Tips
- If the agent's output drifts from the design, point it at the exact selector in `docs/reference/prototype.css` rather than describing the problem in words.
- Keep commits small; ask for `git diff --stat` summaries between tasks.
- If you later want the layout fixes from my UI review (full-width benefit grid, clearer timeline states, a visible product above the fold), add them as a separate phase after the faithful build is signed off.
