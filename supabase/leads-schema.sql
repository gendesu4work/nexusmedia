-- Calculator leads: guests who leave their email at the end of the costing guide.
-- Project: oytgbzaukedyfifavvlq (the same project as the calculator)
-- Run this in Supabase > SQL Editor after visits-schema.sql. It is safe to run again.
--
-- public/calculator calls add_lead() when a guest sends their email (first name optional).
-- public/visits/ (Leads section) calls lead_list() and lead_update(); only accounts in
-- visit_admins (see visits-schema.sql) can use them.
-- Emails go out through the send-leads edge function (Resend); every email has an
-- unsubscribe link to public/unsubscribe/, which calls lead_unsubscribe() with unsub_token.

-- ---------- calc_leads: one row per email ----------
create table if not exists public.calc_leads (
  id             bigint generated always as identity primary key,
  email          text not null unique,
  name           text,          -- first name, optional
  business       text,
  biz_type       text,          -- what they picked in the guide, e.g. bakery, coffee
  product        text,          -- the product they costed
  cost           numeric,       -- its cost per piece
  price          numeric,       -- its selling price
  consent_text   text not null, -- the exact sentence they agreed to
  status         text not null default 'new'
                 check (status in ('new', 'following_up', 'signed_up', 'not_interested', 'unsubscribed')),
  contacts       int not null default 0,
  last_contacted timestamptz,
  note           text,
  unsub_token    uuid not null default gen_random_uuid() unique,
  created_at     timestamptz not null default now()
);
alter table public.calc_leads add column if not exists unsub_token uuid not null default gen_random_uuid() unique;
alter table public.calc_leads add column if not exists name text;

-- No policies on purpose: nobody can read or write the table directly.
alter table public.calc_leads enable row level security;

-- ---------- add_lead: called by the calculator (anyone) ----------
-- Same email again: keeps the original row and refreshes what they costed,
-- unless they unsubscribed.
drop function if exists public.add_lead(text, text, text, text, numeric, numeric, text);
create or replace function public.add_lead(p_email text, p_name text, p_business text, p_biz_type text,
                                           p_product text, p_cost numeric, p_price numeric, p_consent text)
returns void
language plpgsql security definer set search_path = public as
$$
declare e text := lower(trim(p_email));
begin
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(e) > 200 or coalesce(trim(p_consent), '') = '' then
    raise exception 'invalid' using errcode = '22023';
  end if;
  insert into public.calc_leads (email, name, business, biz_type, product, cost, price, consent_text)
  values (e, left(nullif(trim(p_name), ''), 60), left(p_business, 80), left(p_biz_type, 40), left(p_product, 80), p_cost, p_price, left(p_consent, 400))
  on conflict (email) do update
    set name = coalesce(excluded.name, calc_leads.name),
        business = coalesce(excluded.business, calc_leads.business),
        biz_type = coalesce(excluded.biz_type, calc_leads.biz_type),
        product = excluded.product, cost = excluded.cost, price = excluded.price,
        consent_text = excluded.consent_text
    where calc_leads.status <> 'unsubscribed';
end
$$;
revoke all on function public.add_lead(text, text, text, text, text, numeric, numeric, text) from public;
grant execute on function public.add_lead(text, text, text, text, text, numeric, numeric, text) to anon, authenticated;

-- ---------- lead_list: the follow-up page (admins only) ----------
drop function if exists public.lead_list();
create or replace function public.lead_list()
returns table (id bigint, email text, name text, business text, biz_type text, product text, cost numeric, price numeric,
               status text, contacts int, last_contacted timestamptz, note text, created_at timestamptz)
language plpgsql security definer set search_path = public as
$$
begin
  if not exists (select 1 from public.visit_admins a where a.user_id = auth.uid()) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query select l.id, l.email, l.name, l.business, l.biz_type, l.product, l.cost, l.price,
                      l.status, l.contacts, l.last_contacted, l.note, l.created_at
               from public.calc_leads l order by l.created_at desc;
end
$$;
revoke all on function public.lead_list() from public, anon;
grant execute on function public.lead_list() to authenticated;

-- ---------- lead_update: mark contacted / change status / note (admins only) ----------
-- p_contacted = true adds one follow-up and stamps the time.
create or replace function public.lead_update(p_id bigint, p_status text, p_contacted boolean, p_note text)
returns void
language plpgsql security definer set search_path = public as
$$
begin
  if not exists (select 1 from public.visit_admins a where a.user_id = auth.uid()) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.calc_leads set
    status = coalesce(p_status, status),
    contacts = contacts + case when p_contacted then 1 else 0 end,
    last_contacted = case when p_contacted then now() else last_contacted end,
    note = coalesce(left(p_note, 500), note)
  where id = p_id;
end
$$;
revoke all on function public.lead_update(bigint, text, boolean, text) from public, anon;
grant execute on function public.lead_update(bigint, text, boolean, text) to authenticated;

-- ---------- lead_unsubscribe: the link at the bottom of every email (anyone with the token) ----------
-- public/unsubscribe/?t=<token> calls this. Returns the email that was unsubscribed, or null.
create or replace function public.lead_unsubscribe(p_token uuid)
returns text
language sql security definer set search_path = public as
$$
  update public.calc_leads set status = 'unsubscribed' where unsub_token = p_token returning email;
$$;
revoke all on function public.lead_unsubscribe(uuid) from public;
grant execute on function public.lead_unsubscribe(uuid) to anon, authenticated;

-- ---------- lead_mark_sent: called by the send-leads edge function only (service role) ----------
create or replace function public.lead_mark_sent(p_id bigint)
returns void
language sql security definer set search_path = public as
$$
  update public.calc_leads
     set contacts = contacts + 1, last_contacted = now(),
         status = case when status = 'new' then 'following_up' else status end
   where id = p_id;
$$;
revoke all on function public.lead_mark_sent(bigint) from public, anon, authenticated;
grant execute on function public.lead_mark_sent(bigint) to service_role;
