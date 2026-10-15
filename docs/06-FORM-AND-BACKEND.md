# 06 — Form & Backend

## UX flow
Steps: Q1 packaging → Q2 format → Q3 sachet build (+ Q3b if `custom`) → Q4 price → Details → Success. Continue is disabled until the step is valid. Back keeps answers. Each step fires an analytics event (`waitlist_step_viewed {step}`, `waitlist_submitted`, `waitlist_error`). Unsent draft may be kept in `sessionStorage` (never the phone number).

Match prototype behavior in `reference/prototype.html` (search `show(`, `valid(`, `paintRange`) for edge cases such as the slider needing interaction before Q4 is valid and the "custom" list toggling.

## Validation (shared Zod schema in `src/lib/schemas.ts`)
```ts
export const waitlistSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  phone: z.string(),                         // normalized by lib/phone.ts → "+91XXXXXXXXXX"
  consent: z.literal(true),
  answers: z.object({
    packaging: z.enum(["info", "designer"]),
    format: z.enum(["sachets", "jars", "either"]),
    build: z.enum(["premade", "custom", "unsure"]),
    customItems: z.array(z.string()).max(8).default([]),
    priceMin: z.number().int().min(500).max(4000),
    priceMax: z.number().int().min(500).max(4000),
  }).refine(a => a.priceMin <= a.priceMax),
  utm: z.record(z.string().max(200)).optional(),
  turnstileToken: z.string().min(1),
  hp: z.string().max(0).optional(),          // honeypot, must be empty
});
```
Phone: strip spaces/dashes/parentheses; remove leading `+91`, `91` (when length 12), or `0`; must match `^[6-9]\d{9}$`; store as `+91` + 10 digits.

## API
**`POST /api/waitlist`**
1. Parse JSON, validate with Zod (reject on honeypot).
2. Verify Turnstile token server-side.
3. Rate-limit by hashed IP (e.g. 5 requests / 10 min) via Upstash.
4. Insert into `waitlist_signups`; on unique-phone conflict return the existing row's position with `duplicate: true` (do not overwrite answers, do not reveal other data).
5. Respond `201 { ok: true, position }` or `200 { ok: true, duplicate: true, position }`; errors `400` (validation), `429` (rate limit), `500` (generic message, log details server-side).

**`GET /api/waitlist/count`** → `{ count }`, `Cache-Control: s-maxage=60, stale-while-revalidate=300`. UI shows the counter only if `count >= COUNTER_MIN_DISPLAY`. Position = row number by `created_at` (`select count(*) where created_at <= row.created_at`).

## Database (`supabase/migrations/0001_waitlist.sql`)
```sql
create extension if not exists pgcrypto;

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null check (char_length(first_name) between 1 and 60),
  phone_e164 text not null unique check (phone_e164 ~ '^\+91[6-9][0-9]{9}$'),
  consent boolean not null check (consent),
  consent_text_version text not null default 'v1',
  consented_at timestamptz not null default now(),
  answers jsonb not null,
  utm jsonb,
  ip_hash text,
  user_agent text
);

alter table public.waitlist_signups enable row level security;
-- No policies: anon/authenticated roles cannot read or write. Only the server (service role) can.
create index on public.waitlist_signups (created_at);
```
Never expose this table to the browser. Do not use the anon key for writes.

## Privacy & compliance (India DPDP-aware; **needs legal review**)
- Store consent text version + timestamp. Provide `/privacy` stating purpose, retention, deletion/contact method, and that data is not sold.
- Provide a deletion path (contact email, and an internal script `scripts/delete-signup.ts`).
- Hash IPs with `IP_HASH_SALT`; never store raw IPs.
- WhatsApp **sending** is out of scope; when added later use the official WhatsApp Business Cloud API with approved templates and the stored opt-in.

## Share button
Opens `https://wa.me/?text=…` (see Content). Include UTM `?utm_source=share` on the shared URL.
