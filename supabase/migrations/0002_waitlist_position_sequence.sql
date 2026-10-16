-- 0002_waitlist_position_sequence.sql
-- Concurrency-safe monotonic position sequence for waitlist signups

-- 1. Create dedicated sequence
create sequence if not exists public.waitlist_signups_position_seq;

-- 2. Add position column (nullable for safe backfill)
alter table public.waitlist_signups add column if not exists position bigint;

-- 3. Backfill any existing rows deterministically by (created_at asc, id asc)
with numbered as (
  select id, row_number() over (order by created_at asc, id asc) as rn
  from public.waitlist_signups
  where position is null
)
update public.waitlist_signups w
set position = numbered.rn
from numbered
where w.id = numbered.id;

-- 4. Set sequence start to max(position) + 1 (or 1 if empty)
select setval(
  'public.waitlist_signups_position_seq',
  coalesce((select max(position) from public.waitlist_signups), 0) + 1,
  false
);

-- 5. Set default to nextval and enforce NOT NULL and UNIQUE constraint
alter table public.waitlist_signups
  alter column position set default nextval('public.waitlist_signups_position_seq'),
  alter column position set not null;

create unique index if not exists waitlist_signups_position_idx on public.waitlist_signups (position);
