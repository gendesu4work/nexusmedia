# Supabase setup

The database setup for both apps lives here, so it can be rebuilt if a project is paused, wiped or deleted.

| File | App | Project |
|---|---|---|
| `calculator-schema.sql` | `public/pos` | `oytgbzaukedyfifavvlq` |
| `planner-schema.sql` | `public/planner` | set in `public/planner/config.js` |
| `visits-schema.sql` | `public/track.js`, `public/visits` | `oytgbzaukedyfifavvlq` |
| `leads-schema.sql` | calculator guide email box, Leads section of `public/visits`, `public/unsubscribe` | `oytgbzaukedyfifavvlq` (run after `visits-schema.sql`) |
| `agent-leads-schema.sql` | WhatsApp agent leads in `public/visits` | `oytgbzaukedyfifavvlq` (run after `visits-schema.sql`) |

To use one, open the project in Supabase, go to **SQL Editor**, paste the file and click **Run**. Both files are safe to run more than once.

## Free-plan pausing

Supabase pauses free-plan projects after about 7 days with no activity. Login then fails, and the dashboard looks empty. Open the project and click **Restore project**: your tables and users come back. A project paused for about 90 days can no longer be restored from the dashboard, so download its backup.

## Calculator payment: edge functions (SikatPay)

Source is in `supabase/functions/`. Paste each into **Edge Functions** in the dashboard with the same name.

| Function | Verify JWT | What it does |
|---|---|---|
| `signup` | on | Creates the account (`paid = false`), starts a ₱99 SikatPay payment with `order_id = calc-<user id>`, replies `{ "url": "<checkout page>" }` or `{ "error": "..." }`. After paying, SikatPay sends the user to `/pos/?paid=1`. |
| `sikatpay-webhook` | **off** | SikatPay posts `payment.paid` here. It checks the `X-Signature`, checks the amount is exactly ₱99, then sets `profiles.paid = true`. Until then, login is refused. |

Secrets (**Edge Functions → Secrets**): `SIKATPAY_API_KEY`, `SIKATPAY_WEBHOOK_SECRET`, `SITE_URL`, and `SIKATPAY_ALLOW_TEST=true` only while testing.

In SikatPay (**Developers → Add webhook**), the URL is `https://pay.nexusmediaph.com/sikatpay-webhook`. SikatPay only accepts nexusmediaph.com addresses, so `pay.nexusmediaph.com` is a Netlify site (`webhook-forwarder/`, deployed by dragging the folder onto Netlify) that passes requests through to `https://oytgbzaukedyfifavvlq.supabase.co/functions/v1/sikatpay-webhook`. GoDaddy DNS has a CNAME `pay` → the Netlify site.

To test: use the `mk_test_` key and `SIKATPAY_ALLOW_TEST=true`, sign up with a new email, press "Simulate successful payment", then log in. To go live: switch to the live key, delete `SIKATPAY_ALLOW_TEST`, and set the webhook to "Live only".

The old PayMongo functions were replaced. Copies are in `Downloads/2-function-signup.ts` and `3-function-paymongo-webhook.ts` on the original PC.

## Calculator leads: follow-up emails (Resend)

Guests can leave their email at the end of the costing guide. They land in `calc_leads` (see `leads-schema.sql`) and show in the **Leads** section of nexusmediaph.com/visits, with a follow-up due every 3 days.

The **Email your leads** box there calls the `send-leads` edge function (Verify JWT **on**, source in `supabase/functions/send-leads/`). It only works for accounts in `visit_admins`, sends at most 100 emails per run (Resend's free daily limit), fills in `{{business}}` and `{{product}}`, and adds an unsubscribe link to `nexusmediaph.com/unsubscribe/?t=<token>`.

Secrets: `RESEND_API_KEY`, `RESEND_FROM` (e.g. `NEXUSMEDIA <hello@nexusmediaph.com>`), `REPLY_TO`. The sending domain must be verified in Resend (its DNS records go in GoDaddy).

## WhatsApp agent leads (ElevenLabs)

Every chat with the Nexus Media Assistant on WhatsApp ends with ElevenLabs sending a post-call webhook. The `whatsapp-lead` edge function (Verify JWT **off**, source in `supabase/functions/whatsapp-lead/`) checks the `ElevenLabs-Signature`, reads the data-collection fields (`client_name`, `email`, `company_country`, `service`, `project_details`, `budget`, `timeline`) and saves one row per conversation to `agent_leads`. They show in **Leads from WhatsApp** on nexusmediaph.com/visits. Chats where nothing was collected are skipped.

Setup:
1. Run `agent-leads-schema.sql` in the SQL Editor.
2. Create the edge function `whatsapp-lead` with the source above and **Verify JWT off**.
3. In ElevenLabs: **Agents → Settings (workspace) → Webhooks → Post-call webhook → Create**, URL `https://oytgbzaukedyfifavvlq.supabase.co/functions/v1/whatsapp-lead`, type transcription (no audio). Copy the secret it shows.
4. Supabase **Edge Functions → Secrets**: add `ELEVENLABS_WEBHOOK_SECRET` with that secret.
5. Make sure the agent uses the workspace post-call webhook (agent **Advanced/Webhooks** setting) and has the data-collection fields from `marketing/whatsapp-agent/agent-settings.md`.

## Backups

The free plan has no backups. `.github/workflows/db-backup.yml` dumps the calculator database every night at 2:00am Philippine time. It saves the `profiles` and `app_data` tables and your clients' login accounts. Each dump is encrypted, because this repo is public, and kept for 30 days under **Actions → Nightly database backup**. The workflow file explains the two secrets it needs and how to restore from a backup. Scheduled runs only start once the workflow is on `main`.
