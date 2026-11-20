-- Visits tracker database setup.
-- Project: oytgbzaukedyfifavvlq (the same project as the calculator)
-- Run this once in Supabase > SQL Editor. It is safe to run again.
--
-- public/track.js calls log_visit() on every page load of:
--   home        nexusmediaph.com
--   calculator  nexusmediaph.com/calculator/
--   blueprints  nexusmediaph.com/blueprints/
-- public/visits/ (the dashboard) calls visit_stats(), which only works for accounts in visit_admins.

-- ---------- page_visits: one row per page load ----------
create table if not exists public.page_visits (
  id         bigint generated always as identity primary key,
  site       text not null check (site in ('home', 'calculator', 'blueprints')),
  path       text,
  visitor    text,          -- random id kept in the visitor's browser (localStorage), no personal data
  referrer   text,          -- the page they came from, without its query string
  created_at timestamptz not null default now()
);
create index if not exists page_visits_created_idx on public.page_visits (created_at);

-- No policies on purpose: nobody can read or write the table directly.
-- Writes go through log_visit(), reads through visit_stats().
alter table public.page_visits enable row level security;

-- ---------- visit_admins: who may open the dashboard ----------
create table if not exists public.visit_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.visit_admins enable row level security;

-- ---------- log_visit: called by public/track.js (anyone) ----------
create or replace function public.log_visit(p_site text, p_path text, p_visitor text, p_referrer text)
returns void
language sql security definer set search_path = public as
$$
  insert into public.page_visits (site, path, visitor, referrer)
  select p_site, left(p_path, 300), left(p_visitor, 64), left(p_referrer, 300)
  where p_site in ('home', 'calculator', 'blueprints');
$$;
revoke all on function public.log_visit(text, text, text, text) from public;
grant execute on function public.log_visit(text, text, text, text) to anon, authenticated;

-- ---------- visit_stats: called by the dashboard (admins only) ----------
-- Days are counted in Philippine time. Returns
--   { daily:  [{day, site, visits, visitors}],
--     totals: [{site, visits, visitors}],
--     sources:[{source, visits}] }
create or replace function public.visit_stats(p_days int)
returns jsonb
language plpgsql security definer set search_path = public as
$$
declare
  since timestamptz;
  result jsonb;
begin
  if not exists (select 1 from public.visit_admins a where a.user_id = auth.uid()) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  since := (date_trunc('day', now() at time zone 'Asia/Manila')
            - make_interval(days => greatest(1, least(coalesce(p_days, 30), 366)) - 1))
           at time zone 'Asia/Manila';

  select jsonb_build_object(
    'daily', coalesce((
      select jsonb_agg(d order by d.day, d.site) from (
        select (v.created_at at time zone 'Asia/Manila')::date as day, v.site,
               count(*) as visits, count(distinct v.visitor) as visitors
        from public.page_visits v where v.created_at >= since
        group by 1, 2) d), '[]'::jsonb),
    'totals', coalesce((
      select jsonb_agg(t order by t.site) from (
        select v.site, count(*) as visits, count(distinct v.visitor) as visitors
        from public.page_visits v where v.created_at >= since
        group by 1) t), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(s order by s.visits desc) from (
        select coalesce(substring(v.referrer from '^https?://(?:www\.)?([^/]+)'), 'Direct / unknown') as source,
               count(*) as visits
        from public.page_visits v where v.created_at >= since
        group by 1 order by 2 desc limit 8) s), '[]'::jsonb)
  ) into result;
  return result;
end
$$;
revoke all on function public.visit_stats(int) from public, anon;
grant execute on function public.visit_stats(int) to authenticated;

-- ---------- make yourself an admin ----------
-- 1. If you have no login in this project yet: Authentication > Users > Add user (email + password).
-- 2. Put that email below, remove the leading "-- ", and run just this line:
-- insert into public.visit_admins (user_id) select id from auth.users where lower(email) = lower('YOUR-EMAIL-HERE') on conflict do nothing;
