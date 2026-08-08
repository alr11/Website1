-- ===========================================================================
-- Everly — Wedding Planner
-- Initial schema: wedding settings, guests, budget, vendors and the checklist.
--
-- Run this once against a fresh Supabase project:
--   Dashboard -> SQL Editor -> paste -> Run
-- or with the CLI:
--   supabase db push
--
-- Every table is scoped to auth.uid() through Row Level Security, so the
-- public anon key is safe to ship to the browser.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- wedding_settings — one row per account
-- ---------------------------------------------------------------------------
create table if not exists public.wedding_settings (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  partner_one_name  text        not null default 'Partner 1',
  partner_two_name  text        not null default 'Partner 2',
  wedding_date      date,
  venue_name        text,
  total_budget      numeric(12, 2) not null default 0 check (total_budget >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- guests
-- ---------------------------------------------------------------------------
create table if not exists public.guests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users (id) on delete cascade,
  first_name     text        not null,
  last_name      text        not null default '',
  email          text,
  phone          text,
  rsvp_status    text        not null default 'pending'
                   check (rsvp_status in ('pending', 'yes', 'no', 'maybe')),
  party_size     integer     not null default 1 check (party_size >= 1),
  side           text        not null default 'both'
                   check (side in ('partner_one', 'partner_two', 'both')),
  role           text        default 'Guest',
  table_number   text,
  dietary_notes  text,
  notes          text,
  created_at     timestamptz not null default now()
);

create index if not exists guests_user_id_idx on public.guests (user_id);
create index if not exists guests_rsvp_idx on public.guests (user_id, rsvp_status);

-- ---------------------------------------------------------------------------
-- vendors
-- ---------------------------------------------------------------------------
create table if not exists public.vendors (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users (id) on delete cascade,
  name            text        not null,
  vendor_type     text        not null default 'Other',
  contact_name    text,
  email           text,
  phone           text,
  website         text,
  estimated_cost  numeric(12, 2) not null default 0 check (estimated_cost >= 0),
  deposit_paid    numeric(12, 2) not null default 0 check (deposit_paid >= 0),
  status          text        not null default 'researching'
                    check (status in ('researching', 'contacted', 'booked', 'declined')),
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists vendors_user_id_idx on public.vendors (user_id);

-- ---------------------------------------------------------------------------
-- budget_categories
-- ---------------------------------------------------------------------------
create table if not exists public.budget_categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  name        text        not null,
  allocated   numeric(12, 2) not null default 0 check (allocated >= 0),
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists budget_categories_user_id_idx
  on public.budget_categories (user_id);

-- ---------------------------------------------------------------------------
-- expenses
--   Deleting a category or vendor keeps the expense; it just loses the link.
-- ---------------------------------------------------------------------------
create table if not exists public.expenses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users (id) on delete cascade,
  category_id  uuid references public.budget_categories (id) on delete set null,
  vendor_id    uuid references public.vendors (id) on delete set null,
  description  text        not null,
  amount       numeric(12, 2) not null default 0 check (amount >= 0),
  paid         boolean     not null default false,
  due_date     date,
  created_at   timestamptz not null default now()
);

create index if not exists expenses_user_id_idx on public.expenses (user_id);
create index if not exists expenses_category_idx on public.expenses (category_id);

-- ---------------------------------------------------------------------------
-- timeline_tasks — the planning checklist
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  title         text        not null,
  notes         text,
  phase         text        not null
                  check (phase in ('12_months', '9_months', '6_months',
                                   '3_months', '1_month', '1_week',
                                   'day_of', 'after')),
  due_date      date,
  completed     boolean     not null default false,
  completed_at  timestamptz,
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists timeline_tasks_user_id_idx
  on public.timeline_tasks (user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger for wedding_settings
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wedding_settings_set_updated_at on public.wedding_settings;
create trigger wedding_settings_set_updated_at
  before update on public.wedding_settings
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- Row Level Security — every row belongs to exactly one account
-- ===========================================================================
alter table public.wedding_settings  enable row level security;
alter table public.guests            enable row level security;
alter table public.vendors           enable row level security;
alter table public.budget_categories enable row level security;
alter table public.expenses          enable row level security;
alter table public.timeline_tasks    enable row level security;

drop policy if exists "own wedding settings" on public.wedding_settings;
create policy "own wedding settings" on public.wedding_settings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own guests" on public.guests;
create policy "own guests" on public.guests
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own vendors" on public.vendors;
create policy "own vendors" on public.vendors
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own budget categories" on public.budget_categories;
create policy "own budget categories" on public.budget_categories
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own expenses" on public.expenses;
create policy "own expenses" on public.expenses
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own timeline tasks" on public.timeline_tasks;
create policy "own timeline tasks" on public.timeline_tasks
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
