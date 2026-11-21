// Supabase Edge Function named: whatsapp-lead
// ElevenLabs calls this after every conversation with the Nexus Media Assistant (WhatsApp chat,
// voice note or call). We check it is really ElevenLabs, then save the lead to agent_leads,
// which shows in the "Leads from WhatsApp" section of nexusmediaph.com/visits.
// Deploy it with "Verify JWT" turned OFF, because ElevenLabs does not send a Supabase token.
//
// Secret (Supabase > Edge Functions > Secrets):
//   ELEVENLABS_WEBHOOK_SECRET  wsec_... shown when you add the post-call webhook in ElevenLabs
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const enc = new TextEncoder();
async function hmac(secret: string, msg: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
// A data-collection value, or null when the agent didn't get it.
function val(results: any, key: string, max = 300): string | null {
  const v = results?.[key]?.value;
  if (v == null) return null;
  const s = String(v).trim();
  if (!s || /^(none|null|n\/a|not shared|unknown)$/i.test(s)) return null;
  return s.slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  // ElevenLabs-Signature: t=<unix seconds>,v0=<hex HMAC-SHA256 of "t.rawbody">
  const raw = await req.text();
  const p: Record<string, string> = {};
  (req.headers.get("elevenlabs-signature") || "").split(",").forEach((x) => {
    const i = x.indexOf("=");
    if (i > 0) p[x.slice(0, i).trim()] = x.slice(i + 1).trim();
  });
  if (!p.t || !p.v0) return new Response("no signature", { status: 401 });
  if (Math.abs(Date.now() / 1000 - Number(p.t)) > 1800) return new Response("too old", { status: 401 });
  const expected = await hmac(Deno.env.get("ELEVENLABS_WEBHOOK_SECRET")!, `${p.t}.${raw}`);
  if (!same(expected, p.v0)) return new Response("bad signature", { status: 401 });

  let event: any;
  try { event = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }
  // Audio webhooks and anything else: just say OK.
  if (event.type !== "post_call_transcription") return new Response("ok", { status: 200 });

  const d = event.data || {};
  const dc = d.analysis?.data_collection_results || {};
  const lead = {
    conversation_id: String(d.conversation_id || ""),
    client_name: val(dc, "client_name", 80),
    email: val(dc, "email", 200)?.toLowerCase() ?? null,
    company_country: val(dc, "company_country", 150),
    service: val(dc, "service", 150),
    project_details: val(dc, "project_details", 1000),
    budget: val(dc, "budget", 100),
    timeline: val(dc, "timeline", 100),
    summary: (d.analysis?.transcript_summary || "").slice(0, 1500) || null,
  };
  if (!lead.conversation_id) return new Response("no conversation id", { status: 200 });
  // Hellos and spam with nothing collected stay out of the list.
  if (!lead.client_name && !lead.email && !lead.service) return new Response("no lead", { status: 200 });

  const meta = d.metadata || {};
  const vars = d.conversation_initiation_client_data?.dynamic_variables || {};
  const phone = meta.whatsapp?.whatsapp_user_id || meta.phone_call?.external_number || vars.system__caller_id || null;
  const channel = meta.whatsapp ? "whatsapp" : meta.phone_call ? "phone" : vars.system__caller_id ? "whatsapp" : "web";

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin.from("agent_leads")
    .upsert({ ...lead, phone: phone ? String(phone).slice(0, 40) : null, channel }, { onConflict: "conversation_id", ignoreDuplicates: true });
  if (error) {
    console.error("Could not save lead", lead.conversation_id, error.message);
    return new Response("db error", { status: 500 }); // ElevenLabs will retry
  }
  return new Response("ok", { status: 200 });
});
