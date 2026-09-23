# VERIFIED — HR / Recruiter Dashboard

Frontend-only talent intelligence dashboard for recruiters. Mock data · Vite · React · TypeScript · Tailwind.

## Run

```bash
cd /workspace/verified-hr-dashboard
npm install
npm run dev
```

Dev server: `http://localhost:5173` (bound to `0.0.0.0:5173`, `server.allowedHosts: true`).

```bash
npm run build
```

## 90-second demo path

1. Open **Overview** → click **Find Verified Talent**
2. Search `React Developer`
3. Toggle filters: React, JavaScript, TypeScript, 2+ years
4. Open **Aarav Sharma** → see **94% Verified**
5. Click **React** → Evidence record (audit-style breakdown)
6. Click **Compare 3** (seeds peer Frontend Developers)
7. **Shortlist** → **Frontend Engineers**
8. **Contact** → success toast (no real email)

Also walk: Shortlists, Jobs (+ match explanation), Analytics, Saved Searches (Run restores filters), Team, Settings, Compare tray, Save Search, Verify Credential.

## Trust design

- Green (`#16A34A`) only for verified / authentic
- Self-reported skills muted + explicit label
- Evidence cards read like audit documents
- Product line: *Don't trust the claim. Verify the skill.*

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router
- lucide-react
- Recharts (Analytics)

## Spec

See `docs/superpowers/specs/2026-09-23-verified-hr-dashboard-design.md`
