# Talent Proof

**Prove Skills. Build Trust. Discover Talent.**

Hackathon product: evidence-based skill & project verification with a strict exam flow and shareable certificate.

## Problem

Resumes claim skills. Recruiters cannot tell if a student actually knows Python/React/SQL — or understands a project that may have been AI-assisted.

## Solution (4 steps)

1. **Skills** — upload/paste resume (optional) → auto-extract skills → or add manually + optional GitHub  
2. **Skill exams** — one strict exam per claimed skill (timer, fullscreen, paste blocked, tab warnings, soft AI-risk signal)  
3. **Projects** — submit project → analyze → project-specific quiz grounded in real code  
4. **Certificate** — only verified skills/projects · score · print/share  

## Quick start

```powershell
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open http://localhost:3000

| Role | Email | Password |
|------|-------|----------|
| Student | student@talentproof.dev | password123 |
| Recruiter | recruiter@talentproof.dev | password123 |
| Reviewer | reviewer@talentproof.dev | password123 |

## Demo script (judges)

1. Log in as student  
2. Step 1: paste resume text containing `Python, React, Git` → Extract → confirm skills → Next  
3. Step 2: Start Python exam → answer MCQs / short answers → Submit  
4. Repeat or continue after pending exams done  
5. Step 3: Add demo project → Start project quiz → submit  
6. Step 4: Issue certificate → Print/Save PDF  
7. (Optional) Recruiter login → search python → request contact  

## Tech stack

- **Frontend:** Next.js 15, TypeScript, Tailwind  
- **Backend:** Next.js server actions + API routes  
- **DB:** Prisma + SQLite  
- **Auth:** JWT httpOnly cookies (jose) + bcrypt  
- **AI prompts:** JSON system prompts in `docs/prompts/` (resume extract + grading) — local keyword extract + rubric scoring works offline for demo  
- **Execution:** Trusted Python unittest runner (labeled)  

## Architecture

```
Browser → Next.js App Router
        → Prisma/SQLite
        → Skill catalog + exam bank (src/lib/skill-catalog.ts)
        → Project pipeline (analyze → tests → project questions)
        → Certificate UID public page
```

## AI security

- Resume/project text treated as **untrusted data**  
- Prompt templates are JSON-structured (`docs/prompts/*.json`)  
- Paste blocked in skill exams; integrity events logged  
- AI-risk heuristic is a **soft signal only** — never claimed as proof  
- No secrets in client; uploads analyzed in trusted/limited mode  

## Judge criteria mapping

| Criteria | Where it shows |
|----------|----------------|
| Problem alignment (20) | Landing + resume→exam→certificate value loop |
| Full-stack (25) | Next.js UI + API + Prisma schema + working flows |
| AI security & integration (20) | JSON LLM prompts, injection-safe framing, integrity |
| Deployment & auth (20) | Auth sessions + `npm run dev` / deploy to Vercel |
| README / GitHub / demo (15) | This file + sample project + clear demo path |

## Limitations (honest)

- Resume PDF parsing not required — paste text works for demo  
- Not a full Docker multi-language sandbox  
- AI detection is probabilistic signals, not courtroom evidence  
- Certificate is Talent Proof verification — not government accreditation  

## Key folders

```
src/app/journey/     # 4-step wizard
src/app/certificate/ # Public cert
src/lib/skill-catalog.ts
docs/prompts/        # LLM JSON prompts
sample_projects/     # Real Python demo
```
