# Supabase setup

The database setup for both apps lives here, so it can be rebuilt if a project is paused, wiped or deleted.

| File | App | Project |
|---|---|---|
| `calculator-schema.sql` | `public/calculator` | `oytgbzaukedyfifavvlq` |
| `planner-schema.sql` | `public/planner` | set in `public/planner/config.js` |

To use one, open the project in Supabase, go to **SQL Editor**, paste the file and click **Run**. Both files are safe to run more than once.

## Free-plan pausing

Supabase pauses free-plan projects after about 7 days with no activity. Login then fails, and the dashboard looks empty. Open the project and click **Restore project**: your tables and users come back. A project paused for about 90 days can no longer be restored from the dashboard, so download its backup.

## Calculator `signup` edge function (not in this repo)

The calculator's Sign up button calls `POST {SUPABASE_URL}/functions/v1/signup` with `{ email, password }` and the `apikey` header. The function must:

1. Create the user in `auth.users` (or reuse the user if that email already exists but has not paid).
2. Create a `profiles` row with `paid = false`.
3. Start a payment and reply `{ "url": "<checkout page>" }`, or reply `{ "error": "<message>" }`.
4. After payment, send the user back to the calculator with `?paid=1`.

Something on the server (the payment provider's webhook) must then set `profiles.paid = true`. Until that happens, login is refused. Its source code was never committed. If the project was wiped, recover it from **Edge Functions** in the dashboard or from wherever it was deployed from, then add it under `supabase/functions/`.
