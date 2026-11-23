-- Calculator (public/pos) database setup.
-- Project: oytgbzaukedyfifavvlq
-- Run this once in Supabase > SQL Editor. It is safe to run again.
--
-- Rebuilt from what public/pos/index.html reads and writes:
--   profiles : select paid where user_id = me            (login is refused unless paid = true)
--   app_data : select data, updated_at where user_id = me
--              upsert { user_id, data, updated_at }       (one row per user)

-- ---------- profiles: who has paid ----------
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  paid       boolean not null default false,
  created_at timestamptz not null default now()
);

-- Used by supabase/functions/signup and sikatpay-webhook.
alter table public.profiles add column if not exists paid_at timestamptz;
alter table public.profiles add column if not exists checkout_id text;  -- the payment provider's payment id
create index if not exists profiles_checkout_idx on public.profiles (checkout_id);
-- Proof of agreement to the Terms of Use and Privacy Policy, saved by the signup function.
alter table public.profiles add column if not exists terms_version text;        -- e.g. '2026-11-19'
alter table public.profiles add column if not exists terms_accepted_at timestamptz;

alter table public.profiles enable row level security;

-- Look up an account by email (only the server functions can use this).
create or replace function public.get_user_by_email(p text) returns uuid
language sql security definer set search_path = public, auth as
$$ select id from auth.users where lower(email) = lower(p) limit 1 $$;
revoke all on function public.get_user_by_email(text) from public, anon, authenticated;
grant execute on function public.get_user_by_email(text) to service_role;

-- A user can only read their own row. There is no insert/update policy on purpose:
-- only the server (the signup / payment functions using the service_role key) may set paid.
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated
  using (auth.uid() = user_id);

-- ---------- app_data: each user's saved app state ----------
create table if not exists public.app_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_data enable row level security;

drop policy if exists "app_data: read own" on public.app_data;
create policy "app_data: read own" on public.app_data
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "app_data: insert own" on public.app_data;
create policy "app_data: insert own" on public.app_data
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "app_data: update own" on public.app_data;
create policy "app_data: update own" on public.app_data
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- Admin helpers (run by hand when needed) ----------
-- If you restored into a new project and users already exist in auth.users, they have no
-- profiles row yet, and the app will say "Your payment is not confirmed yet".
-- Mark every existing user as paid:
--   insert into public.profiles (user_id, paid)
--   select id, true from auth.users
--   on conflict (user_id) do update set paid = true;
--
-- Mark one user as paid:
--   insert into public.profiles (user_id, paid)
--   select id, true from auth.users where email = 'someone@example.com'
--   on conflict (user_id) do update set paid = true;

-- ---------- app_archive: sales history older than 3 months ----------
-- The app keeps the current month and the 3 before it in app_data. Older months of
-- sales, refunds and receipts move here, one row per user per month, so app_data
-- (and the copy on the phone) stays small. Reports load these rows when needed.
create table if not exists public.app_archive (
  user_id    uuid not null references auth.users (id) on delete cascade,
  month      text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),   -- e.g. '2026-07'
  data       jsonb not null default '{}'::jsonb,              -- { sales:[], refunds:[], rcpt:[] }
  updated_at timestamptz not null default now(),
  primary key (user_id, month)
);

alter table public.app_archive enable row level security;

drop policy if exists "app_archive: read own" on public.app_archive;
create policy "app_archive: read own" on public.app_archive
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "app_archive: insert own" on public.app_archive;
create policy "app_archive: insert own" on public.app_archive
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "app_archive: update own" on public.app_archive;
create policy "app_archive: update own" on public.app_archive
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
