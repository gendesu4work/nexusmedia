// Supabase Edge Function named: signup
// Creates the account (not usable until paid) and starts a SikatPay checkout for P399.
//
// Secrets (Supabase > Edge Functions > Secrets):
//   SIKATPAY_API_KEY  mk_test_... while testing, mk_... (live) when going live
//   SITE_URL          e.g. https://nexusmediaph.com  (no trailing slash needed)
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

// The price lives here on the server. The browser never sends it.
const PRICE = 39900; // centavos = P399.00

// Must match POLICY_VERSION in public/pos/index.html. When the terms change,
// update both so new sign-ups are recorded against the new version.
const TERMS_VERSION = "2026-11-19";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Please enter a valid email." }, 400);
  if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
  if (body.agreed !== TERMS_VERSION) {
    return json({ error: "Please tick the box to agree to the Terms of Use and Privacy Policy. If it is already ticked, refresh the page and try again." }, 400);
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const site = (Deno.env.get("SITE_URL") || "").replace(/\/$/, "");

  let userId: string | null = null;
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.data?.user) {
    userId = created.data.user.id;
  } else {
    // Email already exists: allowed only if that account has not paid yet.
    const found = await admin.rpc("get_user_by_email", { p: email });
    const id = found.data as string | null;
    if (!id) return json({ error: created.error?.message || "Could not create the account." }, 400);
    const prof = await admin.from("profiles").select("paid").eq("user_id", id).maybeSingle();
    if (prof.data?.paid) return json({ error: "This email already has an account. Please log in." }, 409);
    await admin.auth.admin.updateUserById(id, { password, email_confirm: true });
    userId = id;
  }

  // One order per account. SikatPay returns the same pending link for the same order_id,
  // so pressing Sign up twice can never charge twice. After 1 hour a fresh link is made.
  const orderId = "calc-" + userId;
  const res = await fetch("https://payment.sikatpinoy.net/api/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + Deno.env.get("SIKATPAY_API_KEY")!,
    },
    body: JSON.stringify({
      amount: PRICE,
      order_id: orderId,
      description: "Product Calculator - online saving",
      success_url: site + "/pos/?paid=1",
      cancel_url: site + "/pos/",
    }),
  });
  const j = await res.json().catch(() => ({}));

  if (res.status === 409 && j?.error?.code === "order_already_paid") {
    return json({ error: "This account is already paid. Please wait a minute, then log in." }, 409);
  }
  const url = j?.checkout_url;
  const pid = j?.id;
  if (!url || !pid) {
    console.error("SikatPay create payment failed", res.status, j?.error);
    return json({ error: "Could not start the payment. Please try again." }, 502);
  }

  // Proof of agreement: which version of the terms, and when. Saved on every sign-up attempt,
  // so it always shows the version agreed to just before paying.
  const saved = await admin.from("profiles").upsert({
    user_id: userId,
    paid: false,
    checkout_id: pid,
    terms_version: TERMS_VERSION,
    terms_accepted_at: new Date().toISOString(),
  });
  if (saved.error) {
    console.error("Could not save profile", saved.error.message);
    return json({ error: "Could not start the payment. Please try again." }, 500);
  }
  return json({ url });
});
