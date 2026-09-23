# VERIFIED — HR / Recruiter Dashboard Design

**Date:** 2026-09-23  
**Product:** VERIFIED talent intelligence / verified hiring platform  
**Scope:** HR / recruiter experience only (no student / candidate-side apps)  
**Delivery:** Frontend-only React + Vite + TypeScript + Tailwind + React Router, rich mock data  
**Constraint:** Built on Grok Bot computer only (no Cursor cloud agents)

---

## 1. Product principle

LinkedIn answers: *What skills does this person claim?*  
VERIFIED answers: *What skills has this person actually demonstrated?*

Trust language throughout (professional, not aggressive):

- Verified  
- Evidence available  
- Independently assessed  
- Credential authentic  

Subtle product line (not shouty): *Don't trust the claim. Verify the skill.*

---

## 2. Goals & non-goals

### Goals

- Polished HR flow: Overview → Find Talent → Filter → Open Candidate → Verify Evidence → Compare → Shortlist → Contact  
- Optimized 90-second hackathon demo path  
- Clear distinction between **platform-verified** and **self-reported** skills  
- Premium, minimal, trustworthy UI (not a generic admin panel)

### Non-goals

- Student dashboard, onboarding, assessments UI for candidates, certificates creation UX, habit/progress  
- Real backend, auth, email sending, payments  
- Copying any existing product (Mobbin used for inspiration only)

---

## 3. Architecture

| Layer | Choice |
| --- | --- |
| Tooling | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS with design tokens from §5 |
| Routing | React Router v6 |
| State | React Context + `useReducer` for shortlists, compare tray, saved searches, toasts |
| Data | Static TypeScript modules (`src/data/`) — 20+ fictional candidates, jobs, shortlists, analytics |
| Charts | Lightweight SVG or Recharts for Analytics only |
| Icons | lucide-react |

### App shell

- Fixed left sidebar (`Sidebar`)  
- Top bar (`Topbar`) with global search, notifications, help, HR avatar  
- Main content outlet  
- Floating **Compare tray** when 1–4 candidates selected  
- `Toast` + `Modal` for Contact / Save Search / Verify Credential

### Routes

| Path | Page |
| --- | --- |
| `/` | Talent Overview |
| `/talent` | Find Verified Talent |
| `/talent/:id` | Candidate Profile |
| `/compare` | Candidate Comparison (2–4) |
| `/shortlists` | Shortlists index |
| `/shortlists/:id` | Shortlist detail |
| `/jobs` | Jobs index |
| `/jobs/:id` | Job detail + requirement matches |
| `/analytics` | Recruitment analytics |
| `/saved-searches` | Saved searches |
| `/team` | My Team (lightweight) |
| `/settings` | Settings (lightweight) |

Dead nav is not allowed — secondary pages are real but thin.

---

## 4. Demo path (90 seconds)

1. Open Overview  
2. Click **Find Verified Talent**  
3. Search: `React Developer`  
4. Apply filters: React, JavaScript, TypeScript, 2+ years  
5. Results appear as cards  
6. Open **Aarav Sharma**  
7. See **94% Verified**  
8. Click **React** → evidence breakdown  
9. Add peers → **Compare** (3 candidates)  
10. Add Aarav to shortlist **Frontend Engineers**  
11. **Contact** → modal (demo success toast)

Seed data and default shortlist/job objects must make this path one click away from ideal state.

---

## 5. Visual system

### Color

| Token | Hex | Use |
| --- | --- | --- |
| Background | `#F7F7F5` | App canvas |
| Card | `#FFFFFF` | Surfaces |
| Text primary | `#18181B` | Headings, names |
| Text secondary | `#71717A` | Meta, captions |
| Border | `#E4E4E7` | Dividers, inputs |
| Accent | `#6D4AFF` | Primary CTAs, active nav |
| Verified | `#16A34A` | Verification / success only |
| Warning | `#F59E0B` | Mid scores / caution |
| Danger | `#DC2626` | Destructive / errors |

Green is reserved for verification/success. No neon, heavy glass, or fake AI glow.

### Typography & layout

- Clean sans (system / Inter via Tailwind)  
- Generous whitespace, strong hierarchy  
- Corners: modest radius (`rounded-lg` / `rounded-xl`), not pill-everything  
- Cards: 1px border + soft shadow; avoid huge cards and excessive gradients  

### Mobbin-informed principles (original layout)

- Semantic search + removable filter chips  
- Sticky recruiter actions on profile  
- Transparent evidence breakdowns (Uxcel-like clarity without copying)  
- Card grid for discovery (product decision), not dense ATS-only tables  

---

## 6. Information architecture by page

### 6.1 Sidebar

**VERIFIED** logo  

Primary: Overview · Find Talent · Shortlists · Jobs · Analytics  

Divider  

Secondary: Saved Searches · My Team · Settings  

Bottom: Rahul Mehta · Talent Acquisition · avatar  

### 6.2 Top bar

Global search placeholder: `Search candidates, skills, roles...`  
Right: Notifications · Help · HR avatar  

### 6.3 Overview (`/`)

- Title: **Talent Overview**  
- Subtitle: Discover candidates based on skills they've actually demonstrated.  
- Four metric cards: Verified Talent `2,481` · New Verified `184` · Active Shortlists `12` · Open Positions `8` (simple trend deltas)  
- Primary CTA: **Find Verified Talent**  
- Secondary: Create Job  
- **Recommended Talent** card grid (same `CandidateCard` as Find Talent)

### 6.4 Find Talent (`/talent`) — primary page

- Header + subtitle  
- Large search: `Search by role, skill, technology or candidate name...`  
- Filters as chips/dropdowns: Role, Skills, Experience, Location, Verification Score, Skill Level, Education, Availability  
- **Save Search**  
- **Results: responsive card grid** (not default table)  
  - Avatar, name, role, location · experience  
  - Verification score badge (e.g. **94% Verified**)  
  - Verified skill chips with ✓  
  - Checkbox (compare) · View Profile · Shortlist  
- Empty / no-match states with clear copy  
- Search parsing: `"React Developer"` → role + React-related skills  

### 6.5 Candidate Profile (`/talent/:id`)

- Header: avatar, name, role, location, **Verification Score** (e.g. 94 / 100)  
- Actions: Shortlist · Compare · Contact  
- Overall verification breakdown: Technical Knowledge, Practical Ability, Problem Solving, Communication  
- **Verified Skills** list: score · level · Verified (click opens evidence)  
- Self-reported skills (if any): muted, labeled **Self-reported** — never green verified styling  
- **Verified Credentials**: certificate name, issued date, Verification ID, Authentic status, View Certificate, Verify Credential  
- Evidence panel / modal per skill  

### 6.6 Evidence

Per verified skill, e.g. React 91%:

- Practical Assessment  
- Technical Knowledge  
- Project Evaluation  
- Verification Date  
- Status: ✓ Verified  
- Copy: Independently verified — evaluated through our assessment process  

### 6.7 Compare (`/compare`)

- Requires 2–4 selected candidates  
- Matrix: skills scores, problem solving, experience, overall verification  
- **No automatic winner** — HR decides  
- Actions: Shortlist / Contact from header  

### 6.8 Shortlists

- Cards: name, candidate count, average verification  
- Detail: list of candidates, add/remove  
- Seed: **Frontend Engineers** (ready for demo)

### 6.9 Jobs

- Active jobs with verified matches / shortlisted / contacted counts  
- Status Active  
- **Find Verified Candidates**  
- Job detail: required vs preferred skills + match explanation (matched / additional), never unexplained % alone  

### 6.10 Analytics

Recruitment-focused only:

- Verified candidates by skill  
- Most requested skills  
- Talent availability  
- Average verification score  
- Skill demand vs verified talent  
- Funnel: Discovered → Shortlisted → Contacted → Interviewed → Hired  

Simple professional charts — not an analytics product.

### 6.11 Saved Searches / Team / Settings

Thin but functional pages so navigation feels complete.

---

## 7. Data model (mock)

### Candidate

- `id`, `name`, `role`, `location`, `experienceYears`, `avatarInitials`, `availability`, `education`  
- `verificationScore` (0–100)  
- `breakdown`: technicalKnowledge, practicalAbility, problemSolving, communication  
- `verifiedSkills[]`: `{ name, score, level, evidence, credential? }`  
- `selfReportedSkills[]`  
- `credentials[]`: `{ title, issuedOn, verificationId, status }`  

### Evidence

- `practicalAssessment`, `technicalKnowledge`, `projectEvaluation`, `verifiedOn`, `status: 'verified'`  

### Job

- `id`, `title`, `status`, `requiredSkills[]`, `preferredSkills[]`, `stats`: matches, shortlisted, contacted  

### Shortlist

- `id`, `name`, `candidateIds[]`  

### SavedSearch

- `id`, `name`, `query`, `filters`  

### Dataset size

- ≥ 20 candidates across: Frontend, Backend, Full Stack, AI/ML, Data Science, Data Analyst, DevOps, Cybersecurity  
- Seed hero candidate: **Aarav Sharma**, Frontend Developer, Bengaluru, 2 years, **94% Verified**, React / JS / TS / Next.js  

All names and profiles are fictional.

---

## 8. Components

Reusable building blocks:

`Sidebar`, `Topbar`, `SearchBar`, `FilterBar`, `MetricCard`, `CandidateCard`, `VerificationBadge`, `SkillBadge`, `VerificationScore`, `EvidenceCard`, `CredentialCard`, `CandidateProfile` (page sections), `ComparisonTable`, `ShortlistCard`, `JobCard`, `Chart`, `Modal`, `Dropdown`, `Toast`, `CompareTray`

Optional later: `CandidateTable` compact view — **not** the default Find Talent presentation.

---

## 9. State & interactions

- **Compare selection:** global set of candidate IDs (max 4); tray CTA navigates to `/compare`  
- **Shortlists:** add/remove with toast confirmation  
- **Save Search:** modal → append to saved searches  
- **Contact:** modal (subject/message demo) → success toast — no real send  
- **Verify Credential:** modal confirming ID authentic  
- Client-side filter/search over mock arrays  

### Error / empty handling

- No results: explain filters + Clear filters  
- Compare with &lt; 2: empty state prompting selection  
- Invalid `:id`: redirect or not-found card  

### Testing (lightweight)

- Manual demo script checklist (README)  
- Optional: unit test for search/filter helpers only if time allows  

---

## 10. Trust UI rules

| State | Presentation |
| --- | --- |
| Platform-verified skill | Green ✓ Verified Skill; hover/tooltip: Independently verified + assessment copy |
| Self-reported | Neutral chip, label Self-reported, no green |
| Verification score | Labeled **Verification Score**, with breakdown — never “AI says …” |
| Credential | Verification ID + Authentic + View / Verify actions |

---

## 11. Out of scope reminders

- No student surfaces  
- No Cursor cloud agent / Origin workflow for this build  
- No production auth or email  

---

## 12. Success criteria

- Judges can complete the 90-second path without narration beyond UI  
- Verified vs claimed skills are visually unmistakable within 3 seconds on a profile  
- Find Talent feels like a modern talent search (card grid + chips), not an admin CRUD table  
- UI matches token system and premium/minimal direction  

---

## Decisions log

| Decision | Choice |
| --- | --- |
| Stack | Vite + React + TS + Tailwind + Router |
| Data | Frontend mock only |
| Find Talent results | **Card grid** (user-approved change from table hybrid) |
| Compare | Explicit matrix, no auto-winner |
| Research | Mobbin for patterns; original VERIFIED design |
