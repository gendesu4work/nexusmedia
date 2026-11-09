Subject: Free project stuck "hibernating", database refuses connections, restart blocked

Project: Product Calculator
Project ref: oytgbzaukedyfifavvlq
Organization: NEXUS MEDIA (Free plan)
Region: ap-northeast-1 (Tokyo)

Since about 1:15pm PHT on Nov 9, 2026 the project has been Unhealthy. Database, PostgREST,
Auth, Realtime and Storage are all unhealthy; only Edge Functions is healthy.

- Every API request (auth/v1/health, rest/v1/*, storage/v1/*) returns 503 Service Unavailable.
- Table Editor: "Failed to run sql query: connect ECONNREFUSED 2406:da14:1772:ea01:8d4e:b316:e431:36fa:5432"
- Postgres logs show nothing in the last hour.
- Settings says "Project is hibernating and will wake on next supported request", but steady
  API requests for several minutes did not wake it.
- "Restart project" and "Restart database" both fail with:
  "Unable to restart project: Project 60545954 is currently hibernated and will wake on next
  supported request"

This project holds our paying customers' accounts, and none of them can log in.
Please wake or restore the database without losing data.
