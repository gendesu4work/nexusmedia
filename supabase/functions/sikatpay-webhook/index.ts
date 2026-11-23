// Supabase Edge Function named: sikatpay-webhook
// SikatPay calls this after a payment. We check it is really SikatPay, then switch the account on.
// Deploy it with "Verify JWT" turned OFF, because SikatPay does not send a Supabase token.
//
// Secrets (Supabase > Edge Functions > Secrets):
//   SIKATPAY_WEBHOOK_SECRET  whsec_... shown when you add this webhook in SikatPay
//   SIKATPAY_ALLOW_TEST      "true" only while testing with the mk_test_ key; delete it when live
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

// Must match the price in the signup function. 9900 (the old P99) is still accepted
// so checkouts started before the price change to P399 still unlock.
const PRICES = [39900, 9900];

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

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  // X-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "t.rawbody">
  const raw = await req.text();
  const p: Record<string, string> = {};
  (req.headers.get("x-signature") || "").split(",").forEach((x) => {
    const i = x.indexOf("=");
    if (i > 0) p[x.slice(0, i).trim()] = x.slice(i + 1).trim();
  });
  if (!p.t || !p.v1) return new Response("no signature", { status: 401 });
  if (Math.abs(Date.now() / 1000 - Number(p.t)) > 300) return new Response("too old", { status: 401 });
  const expected = await hmac(Deno.env.get("SIKATPAY_WEBHOOK_SECRET")!, `${p.t}.${raw}`);
  if (!same(expected, p.v1)) return new Response("bad signature", { status: 401 });

  let event: any;
  try { event = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }

  // "ping" and any future event types: just say OK.
  if (event.type !== "payment.paid") return new Response("ok", { status: 200 });

  const allowTest = Deno.env.get("SIKATPAY_ALLOW_TEST") === "true";
  if (!event.livemode && !allowTest) return new Response("test event ignored", { status: 200 });

  const pay = event.data || {};
  const orderId = String(pay.order_id || "");
  if (!orderId.startsWith("calc-")) return new Response("not ours", { status: 200 });
  const userId = orderId.slice(5);

  if (pay.status !== "paid" || !PRICES.includes(pay.amount) || pay.currency !== "PHP") {
    console.error("SikatPay payment does not match the price, not unlocking", orderId, pay.status, pay.amount);
    return new Response("amount mismatch", { status: 200 });
  }

  // Only flips unpaid -> paid, so a retried webhook changes nothing.
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin.from("profiles")
    .update({ paid: true, paid_at: new Date().toISOString(), checkout_id: pay.id })
    .eq("user_id", userId)
    .eq("paid", false);
  if (error) {
    console.error("Could not mark paid", orderId, error.message);
    return new Response("db error", { status: 500 }); // SikatPay will retry
  }
  return new Response("ok", { status: 200 });
});
