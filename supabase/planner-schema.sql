-- Planner (public/planner) database setup.
-- Run this once in Supabase > SQL Editor of the planner's project. It is safe to run again.
-- After creating a new project, put its URL and publishable key in public/planner/config.js.
--
-- Rebuilt from what public/planner/index.html reads and writes:
--   app_state : select data where user_id = me
--               upsert { user_id, data }                 (one row per user)
-- Accounts are created by invitation (Authentication > Users > Invite user), so turn off
-- public sign-ups in Authentication > Sign In / Providers > "Allow new users to sign up".

create table if not exists public.app_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "app_state: read own" on public.app_state;
create policy "app_state: read own" on public.app_state
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "app_state: insert own" on public.app_state;
create policy "app_state: insert own" on public.app_state
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "app_state: update own" on public.app_state;
create policy "app_state: update own" on public.app_state
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- The app does not send updated_at, so keep it current on every save.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists app_state_touch on public.app_state;
create trigger app_state_touch
  before update on public.app_state
  for each row execute function public.touch_updated_at();
