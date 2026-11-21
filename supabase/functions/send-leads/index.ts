// Supabase Edge Function named: send-leads   (Verify JWT: on)
// Called by the Leads section of nexusmediaph.com/visits. Sends one email per lead through Resend.
//
// Body: { subject, body, audience: "all" | "due", test?: boolean }
//   audience "all": every lead that is new or being followed up
//   audience "due": only those not emailed in the last 3 days
//   test: sends one copy to the signed-in admin only, with sample details
// In subject and body, {{business}} and {{product}} are filled in per person.
//
// Secrets (Supabase > Edge Functions > Secrets):
//   RESEND_API_KEY   from resend.com > API Keys (sending access)
//   RESEND_FROM      e.g.  NEXUSMEDIA <hello@nexusmediaph.com>   (domain must be verified in Resend)
//   REPLY_TO         where replies go, e.g. nexusmediaphilippines@gmail.com
//   SITE_URL         https://nexusmediaph.com   (already set for signup)
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const MAX_PER_RUN = 100; // Resend free plan: 100 emails a day
const DUE_DAYS = 3;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fill(t: string, l: { business?: string | null; product?: string | null }) {
  return t
    .replaceAll("{{business}}", l.business || "your business")
    .replaceAll("{{product}}", l.product || "your products");
}

function html(text: string, unsub: string) {
  const paras = esc(text).split(/\n{2,}/).map((p) => `<p style="margin:0 0 14px">${p.replace(/\n/g, "<br>")}</p>`).join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1d2a33;max-width:560px">${paras}
<p style="margin:28px 0 0;font-size:12px;color:#7a8a95">You're getting this because you left your email in Product Calculator by NEXUSMEDIA.
<a href="${unsub}" style="color:#7a8a95">Unsubscribe</a></p></div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Only visit admins may send.
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: who } = await admin.auth.getUser(jwt);
  const user = who?.user;
  if (!user) return json({ error: "Please sign in again." }, 401);
  const { data: isAdmin } = await admin.from("visit_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!isAdmin) return json({ error: "This account is not allowed to send emails." }, 403);

  const key = Deno.env.get("RESEND_API_KEY"), from = Deno.env.get("RESEND_FROM");
  if (!key || !from) return json({ error: "Email sending is not set up yet (RESEND_API_KEY / RESEND_FROM missing)." }, 500);
  const replyTo = Deno.env.get("REPLY_TO") || undefined;
  const site = (Deno.env.get("SITE_URL") || "https://nexusmediaph.com").replace(/\/$/, "");

  let b: any;
  try { b = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  const subject = String(b.subject || "").trim().slice(0, 150);
  const body = String(b.body || "").trim().slice(0, 5000);
  if (!subject || !body) return json({ error: "Write a subject and a message first." }, 400);

  const send = async (to: string, l: any, token: string | null) => {
    const unsub = token ? `${site}/unsubscribe/?t=${token}` : `${site}/unsubscribe/`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: replyTo,
        subject: fill(subject, l),
        html: html(fill(body, l), unsub),
        text: `${fill(body, l)}\n\n--\nUnsubscribe: ${unsub}`,
        headers: { "List-Unsubscribe": `<${unsub}>` },
      }),
    });
    if (!r.ok) throw new Error((await r.text()).slice(0, 200));
  };

  if (b.test) {
    try { await send(user.email!, { business: "Aling Nena's Bakery", product: "Ube pandesal" }, null); }
    catch (e) { return json({ error: "Resend refused the test email: " + (e as Error).message }, 502); }
    return json({ sent: 1, failed: 0, test: true, to: user.email });
  }

  let q = admin.from("calc_leads").select("id,email,business,product,unsub_token,status,last_contacted,created_at")
    .in("status", ["new", "following_up"]).order("created_at", { ascending: true }).limit(MAX_PER_RUN);
  if (b.audience === "due") {
    const cutoff = new Date(Date.now() - DUE_DAYS * 864e5).toISOString();
    q = q.or(`last_contacted.is.null,last_contacted.lte.${cutoff}`);
  }
  const { data: leads, error } = await q;
  if (error) return json({ error: error.message }, 500);

  let sent = 0;
  const failed: string[] = [];
  for (const l of leads || []) {
    try {
      await send(l.email, l, l.unsub_token);
      sent++;
      await admin.rpc("lead_mark_sent", { p_id: l.id });
    } catch (e) {
      failed.push(`${l.email}: ${(e as Error).message}`);
    }
    await sleep(550); // stay under Resend's 2 requests per second
  }
  return json({ sent, failed: failed.length, errors: failed.slice(0, 5), total: (leads || []).length });
});
