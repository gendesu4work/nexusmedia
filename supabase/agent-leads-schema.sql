-- WhatsApp agent leads: one row per ElevenLabs conversation that collected a lead.
-- Project: oytgbzaukedyfifavvlq (the same project as the calculator)
-- Run this in Supabase > SQL Editor after visits-schema.sql. It is safe to run again.
--
-- The whatsapp-lead edge function (supabase/functions/whatsapp-lead/) receives ElevenLabs'
-- post-call webhook and writes here with the service role.
-- public/visits/ ("Leads from WhatsApp") calls agent_lead_list() and agent_lead_update();
-- only accounts in visit_admins can use them.

create table if not exists public.agent_leads (
  id              bigint generated always as identity primary key,
  conversation_id text not null unique,   -- ElevenLabs conversation id, so a retried webhook adds nothing
  channel         text,                   -- whatsapp, phone, web
  phone           text,                   -- the client's WhatsApp number, when ElevenLabs sends it
  client_name     text,
  email           text,
  company_country text,
  service         text,
  project_details text,
  budget          text,
  timeline        text,
  summary         text,                   -- ElevenLabs' short summary of the chat
  status          text not null default 'new'
                  check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  note            text,
  created_at      timestamptz not null default now()
);
create index if not exists agent_leads_created_idx on public.agent_leads (created_at);

-- No policies on purpose: nobody can read or write the table directly.
alter table public.agent_leads enable row level security;

-- ---------- agent_lead_list: the Leads page (admins only) ----------
create or replace function public.agent_lead_list()
returns setof public.agent_leads
language plpgsql security definer set search_path = public as
$$
begin
  if not exists (select 1 from public.visit_admins a where a.user_id = auth.uid()) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query select * from public.agent_leads order by created_at desc;
end
$$;
revoke all on function public.agent_lead_list() from public, anon;
grant execute on function public.agent_lead_list() to authenticated;

-- ---------- agent_lead_update: change status / note (admins only) ----------
create or replace function public.agent_lead_update(p_id bigint, p_status text, p_note text)
returns void
language plpgsql security definer set search_path = public as
$$
begin
  if not exists (select 1 from public.visit_admins a where a.user_id = auth.uid()) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.agent_leads set
    status = coalesce(p_status, status),
    note = coalesce(left(p_note, 500), note)
  where id = p_id;
end
$$;
revoke all on function public.agent_lead_update(bigint, text, text) from public, anon;
grant execute on function public.agent_lead_update(bigint, text, text) to authenticated;
