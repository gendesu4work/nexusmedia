-- Calculator (public/calculator) database setup.
-- Project: oytgbzaukedyfifavvlq
-- Run this once in Supabase > SQL Editor. It is safe to run again.
--
-- Rebuilt from what public/calculator/index.html reads and writes:
--   profiles : select paid where user_id = me            (login is refused unless paid = true)
--   app_data : select data, updated_at where user_id = me
--              upsert { user_id, data, updated_at }       (one row per user)

-- ---------- profiles: who has paid ----------
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  paid       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

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
