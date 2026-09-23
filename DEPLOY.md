# Deploy (for teammates)

This repo root is the **Next.js Talent Proof** app that runs at `http://localhost:3000`.

## Local run (same as localhost:3000)

```bash
npm install
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open http://localhost:3000

Demo logins (after seed):
- `student@talentproof.dev` / `password123`
- `recruiter@talentproof.dev` / `password123`

## Environment variables

Copy from `.env.example`:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Local: `file:./dev.db`. Production: use Postgres URL if hosting without persistent disk |
| `AUTH_SECRET` | Long random string |
| `NEXT_PUBLIC_APP_URL` | Public site URL (e.g. `https://your-app.vercel.app`) |
| `EXECUTION_MODE` | `trusted` |
| `OPENAI_API_KEY` | Optional |

## Suggested deploy (Vercel)

1. Import https://github.com/divya5623/TalentProof
2. Root directory: **repo root** (not `apps/`)
3. Framework: Next.js
4. Build: `prisma generate && next build`
5. Set env vars above
6. For production DB, switch Prisma datasource to Postgres and set `DATABASE_URL`

Postinstall already runs `prisma generate`.

## Important

- Ignore `apps/` for the main deploy — those are older Vite demos.
- Do **not** commit `.env` or `prisma/dev.db`.
