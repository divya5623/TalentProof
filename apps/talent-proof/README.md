# TALENT PROOF

**Prove Skills. Build Trust. Discover Talent.**

Hackathon MVP — frontend-only high-fidelity clickable prototype. Sandbox, OAuth, live LLM, and malware scanning are **theater / fixtures** with honest UI labels. Trusted execution replays **controlled sample project** fixtures only.

## Quick start

```bash
cd /workspace/talent-proof
npm install
npm run dev
```

Dev server: **http://0.0.0.0:5175** (host `0.0.0.0`, `allowedHosts: true`, port **5175**).

```bash
npm run build   # must pass
npm run preview
```

## Demo personas

| Persona | Role | Sample |
|---------|------|--------|
| Priya Sharma | Student | LedgerLite (Python/Flask) — **verified** |
| Alex Chen | Student | PulseBoard (React/TS) — assessment ready |
| Jordan Lee | Recruiter | Meridian Labs — discover + contact |

Use the header **persona switcher** anytime.

## 90-second demo path

1. Open `/` → **Enter as Priya**  
2. Dashboard → **LedgerLite** → **Analysis report** (Observed / AI / Uncertainty + AI-detect signal disclaimer)  
3. **Trusted sample execution** → Run trusted sample (fixture labels)  
4. **Skill verification report** → **Public share** (`/share/share-ledgerlite-priya`)  
5. Switch persona → **Jordan** → Discover → filter **Python** → Priya → **Request contact**  
6. Switch → **Priya** → **Inbox** → Accept  
7. Optional: Alex → PulseBoard → **Live assessment** (consent, timer, file-specific Qs, integrity log)

Also: `/tech-matrix`, `/student/submit` (ZIP / GitHub theater / URL), `/signup`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/login`, `/signup` | Auth theater |
| `/tech-matrix` | Fully / Partial / Manual / Not yet |
| `/student` | Student dashboard |
| `/student/profile` | Technical profile |
| `/student/submit` | Submit project |
| `/student/inbox` | Accept/reject recruiter requests |
| `/student/projects/:id` | Project hub |
| `/student/projects/:id/analysis` | Analysis report |
| `/student/projects/:id/execution` | Trusted sample execution |
| `/student/projects/:id/assessment` | Timed assessment UI |
| `/student/projects/:id/report` | Badges + rules |
| `/share/:shareId` | Public verified evidence |
| `/recruiter` | Discover by skill |
| `/recruiter/candidates/:id` | Candidate + contact request |
| `/recruiter/requests` | Outbound requests |

## Out of scope (labeled in UI)

- Real Docker sandbox on main server  
- Real OAuth  
- Real LLM API calls  
- Real malware scanning  

## Stack

Vite · React 19 · TypeScript · React Router · Tailwind CSS v4 · Lucide
