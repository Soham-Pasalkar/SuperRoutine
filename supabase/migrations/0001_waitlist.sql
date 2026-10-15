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
