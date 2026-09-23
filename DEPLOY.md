# Deploy Talent Proof (live URL for judges)

The app at **repo root** is Next.js (`npm run dev` → localhost:3000).

---

## Option A — Render (fastest, keeps SQLite)

1. Open https://dashboard.render.com → **New** → **Blueprint**
2. Connect GitHub repo: **`divya5623/TalentProof`**
3. Apply `render.yaml` (already in the repo)
4. After deploy, set env:
   - `NEXT_PUBLIC_APP_URL` = `https://YOUR-SERVICE.onrender.com`
5. Open the public URL

Demo logins (seed runs on start):
- `student@talentproof.dev` / `password123`
- `recruiter@talentproof.dev` / `password123`

> Free tier sleeps after idle; first load may take ~30s.

---

## Option B — Vercel (needs Postgres)

SQLite does **not** persist on Vercel. Use free Neon/Supabase Postgres.

1. Create DB: https://neon.tech → copy connection string  
2. https://vercel.com/new → import **`divya5623/TalentProof`**
3. **Root Directory:** `.` (repo root, not `apps/`)
4. Framework: Next.js  
5. Environment variables:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon Postgres URL |
| `AUTH_SECRET` | long random string |
| `NEXT_PUBLIC_APP_URL` | your `https://….vercel.app` URL |
| `EXECUTION_MODE` | `trusted` |

6. Deploy → then run once (local or Vercel CLI):

```bash
DATABASE_URL="your-neon-url" npx prisma db push
DATABASE_URL="your-neon-url" npx tsx prisma/seed.ts
```

Also change Prisma provider to `postgresql` in `prisma/schema.prisma` before Vercel build:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Option C — CLI (this machine)

```powershell
npx vercel login
npx vercel --prod
```

Requires Vercel account login in the browser.

---

## Connected product routes after deploy

| Who | Path |
|-----|------|
| Student | `/journey` |
| Exams | `/journey/exams` |
| HR | `/recruiter` |
| Find talent | `/recruiter/talent` |

Ignore `apps/` for the main deploy (old Vite demos).
