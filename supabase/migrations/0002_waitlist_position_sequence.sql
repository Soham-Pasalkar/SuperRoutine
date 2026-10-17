begin;

-- 1. Create dedicated sequence
create sequence if not exists public.waitlist_signups_position_seq;

-- 2. Add position column (nullable for safe backfill)
alter table public.waitlist_signups add column if not exists position bigint;

-- 3. Backfill any rows where position is null deterministically by (created_at asc, id asc)
-- Offset by current max(position) to prevent collisions if any rows already have a position assigned
with current_max as (
  select coalesce(max(position), 0) as max_pos
  from public.waitlist_signups
),
numbered as (
  select id, row_number() over (order by created_at asc, id asc) as rn
  from public.waitlist_signups
  where position is null
)
update public.waitlist_signups w
set position = current_max.max_pos + numbered.rn
from numbered, current_max
where w.id = numbered.id;

-- 4. Advance sequence past highest assigned position (prevents rewinding if positions were deleted or migration is rerun)
with seq_state as (
  select case when is_called then last_value + 1 else last_value end as next_seq_val
  from public.waitlist_signups_position_seq
),
table_state as (
  select coalesce(max(position), 0) + 1 as next_table_val
  from public.waitlist_signups
)
select setval(
  'public.waitlist_signups_position_seq',
  greatest(table_state.next_table_val, seq_state.next_seq_val),
  false
)
from seq_state, table_state;

-- 5. Set default to nextval, associate sequence ownership, and enforce NOT NULL and UNIQUE constraint
alter sequence public.waitlist_signups_position_seq owned by public.waitlist_signups.position;

alter table public.waitlist_signups
  alter column position set default nextval('public.waitlist_signups_position_seq'),
  alter column position set not null;

create unique index if not exists waitlist_signups_position_idx on public.waitlist_signups (position);

commit;
