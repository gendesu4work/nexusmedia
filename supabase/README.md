# Supabase setup

The database setup for both apps lives here, so it can be rebuilt if a project is paused, wiped or deleted.

| File | App | Project |
|---|---|---|
| `calculator-schema.sql` | `public/calculator` | `oytgbzaukedyfifavvlq` |
| `planner-schema.sql` | `public/planner` | set in `public/planner/config.js` |

To use one, open the project in Supabase, go to **SQL Editor**, paste the file and click **Run**. Both files are safe to run more than once.

## Free-plan pausing

Supabase pauses free-plan projects after about 7 days with no activity. Login then fails, and the dashboard looks empty. Open the project and click **Restore project**: your tables and users come back. A project paused for about 90 days can no longer be restored from the dashboard, so download its backup.

## Calculator payment: edge functions (SikatPay)

Source is in `supabase/functions/`. Paste each into **Edge Functions** in the dashboard with the same name.

| Function | Verify JWT | What it does |
|---|---|---|
| `signup` | on | Creates the account (`paid = false`), starts a ₱99 SikatPay payment with `order_id = calc-<user id>`, replies `{ "url": "<checkout page>" }` or `{ "error": "..." }`. After paying, SikatPay sends the user to `/calculator/?paid=1`. |
| `sikatpay-webhook` | **off** | SikatPay posts `payment.paid` here. It checks the `X-Signature`, checks the amount is exactly ₱99, then sets `profiles.paid = true`. Until then, login is refused. |

Secrets (**Edge Functions → Secrets**): `SIKATPAY_API_KEY`, `SIKATPAY_WEBHOOK_SECRET`, `SITE_URL`, and `SIKATPAY_ALLOW_TEST=true` only while testing.

In SikatPay (**Developers → Add webhook**), the URL is `https://pay.nexusmediaph.com/sikatpay-webhook`. SikatPay only accepts nexusmediaph.com addresses, so `pay.nexusmediaph.com` is a Netlify site (`webhook-forwarder/`, deployed by dragging the folder onto Netlify) that passes requests through to `https://oytgbzaukedyfifavvlq.supabase.co/functions/v1/sikatpay-webhook`. GoDaddy DNS has a CNAME `pay` → the Netlify site.

To test: use the `mk_test_` key and `SIKATPAY_ALLOW_TEST=true`, sign up with a new email, press "Simulate successful payment", then log in. To go live: switch to the live key, delete `SIKATPAY_ALLOW_TEST`, and set the webhook to "Live only".

The old PayMongo functions were replaced. Copies are in `Downloads/2-function-signup.ts` and `3-function-paymongo-webhook.ts` on the original PC.

## Backups

The free plan has no backups. `.github/workflows/db-backup.yml` dumps the calculator database every night at 2:00am Philippine time. It saves the `profiles` and `app_data` tables and your clients' login accounts. Each dump is encrypted, because this repo is public, and kept for 30 days under **Actions → Nightly database backup**. The workflow file explains the two secrets it needs and how to restore from a backup. Scheduled runs only start once the workflow is on `main`.
