# VERIFIED Candidate — Verification Journey OS Design

**Date:** 2026-09-23  
**Product:** VERIFIED Candidate — Verification Journey OS  
**Counterpart:** Existing VERIFIED HR / recruiter dashboard (separate app, same brand and trust language)  
**Scope:** Candidate-side journey only — high-fidelity clickable prototype with mock data  
**Delivery this round:** Spec + (later) frontend prototype. No real OAuth, grading, or PDF backend.  
**Constraint:** Built on Grok Bot computer only (no Cursor cloud agents)

---

## 1. Product principle

Recruiters ask: *What has this person demonstrated?*  
Candidates need a system that turns claims into durable, shareable proof.

**VERIFIED Candidate** is a **Verification Journey OS**: a progress cockpit and pipeline spine that moves a candidate from skill claims → evidence → exams → project audits → Pro certificate → public verify.

Trust language (same brand as HR app, professional not aggressive):

- Verified  
- Evidence available  
- Independently assessed  
- Credential authentic  

Product line (subtle, not shouty): **Don't trust the claim. Verify the skill.**

Approach for this product: **Approach A — Journey OS** (progress cockpit + pipeline spine). Not a loose collection of disconnected tools.

---

## 2. Goals & non-goals

### Goals

- One React app with a **persona switcher** covering four tracks at **equal depth**: Frontend, Backend, Data/ML, Mobile.
- Clickable high-fidelity prototype driven entirely by mock data and UI theater.
- Clear tiered credential path: **Level 1 Skill Exam → Level 2 Project Verification → Pro Certificate**.
- Journey spine visible at all times: Onboard → Claim skills → Evidence intake → Reconcile (Honesty Map) → L1 → L2 → Pro → Share/public verify.
- Shared credential identity with the HR demo for Frontend hero: **Aarav Sharma / VRF-92831**.
- Optimized **90-second Frontend/Aarav demo path**.
- Same visual system as the HR dashboard (institutional trust, huge whitespace, thin borders, bold metrics).

### Non-goals

- Real OAuth (GitHub, Google, LinkedIn, etc.)
- Real exam grading / proctoring hardware / webcam enforcement
- Real PDF certificate generation / signing
- Payments, subscriptions, or billing
- Native iOS/Android apps (Mobile track is web mock of RN/Flutter journey)
- Merging this app into the HR recruiter dashboard
- Backend APIs, databases, or auth servers
- Cursor cloud agents / Origin workflows

---

## 3. Locked decisions

| Decision | Choice |
| --- | --- |
| Product name | VERIFIED Candidate — Verification Journey OS |
| Relationship to HR | Separate app; shared brand, trust line, visual tokens, and credential IDs where demos overlap |
| Delivery | High-fidelity clickable prototype + mock data only |
| Architecture approach | Approach A: Journey OS (progress cockpit + pipeline spine) |
| Tracks | Four tracks, equal depth: Frontend (React/JS/TS), Backend (Node/APIs), Data/ML, Mobile (RN/Flutter) |
| Multi-track UX | Single app + **persona switcher** (not four apps) |
| Personas | Frontend — Aarav Sharma (VRF-92831); Backend — Priya Nair; Data/ML — Kabir Mehta; Mobile — Ananya Iyer |
| Credential tiers | L1 Skill Exam → L2 Project Verification → Pro Certificate |
| Future build stack | Vite + React + TypeScript + Tailwind + React Router + mock data (same as HR app) |
| Visual | bg `#F7F7F5`, accent `#6D4AFF`, verified green `#16A34A` only for verification |
| Trust line | Don't trust the claim. Verify the skill. |
| Build constraint | Grok Bot only; no Cursor cloud agents |

---

## 4. Architecture

### 4.1 App shell

Persistent chrome (except public share page, which is chrome-light):

| Region | Contents |
| --- | --- |
| Left sidebar | VERIFIED logo; journey nav links; track label; persona switcher at bottom |
| Top bar | Current step in journey spine, overall score (when available), “Recruiter preview” shortcut, notifications (mock) |
| Main | Route outlet — progress cockpit on `/`, focused work surfaces elsewhere |
| Journey spine strip | Compact horizontal stepper: Onboard → Claims → Evidence → Reconcile → Exams → Projects → Certificate → Share; clickable for completed/unlocked steps only |

Public verify (`/certificate/share`) uses a minimal header (logo + trust line) and no persona switcher.

### 4.2 Stack (future prototype build)

| Layer | Choice |
| --- | --- |
| Tooling | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS with tokens from §10 |
| Routing | React Router v6 |
| State | React Context + `useReducer` for active persona, journey progress, mock exam/project session flags, toasts |
| Data | Static TypeScript modules under `src/data/` — one package per persona + shared catalog |
| Icons | lucide-react |
| Charts / heatmaps | Lightweight SVG (authorship heatmap, score rings) |

No real network calls. “Connect GitHub”, “Parse resume”, “Submit exam”, and “Generate certificate” are timed UI theaters over mock payloads.

### 4.3 State model (prototype)

```
AppState {
  activePersonaId: 'aarav' | 'priya' | 'kabir' | 'ananya'
  journeyByPersona: Record<PersonaId, JourneyProgress>
  ui: { toast?, examSession?, projectAuditSession?, resumeParsePhase?, githubConnectPhase? }
}
```

`JourneyProgress` tracks: onboardingComplete, claimedSkillIds[], resumeAttached, githubConnected, reconcileReviewed, examResults{}, projectResults{}, proIssued, shareEnabled.

Switching persona swaps the entire mock world (skills, repos, scores, certificate ID) without route reset beyond returning to `/` if the current deep-link is invalid for that persona.

### 4.4 Data modules (planned)

- `src/data/personas.ts` — four personas + track metadata  
- `src/data/skillsCatalog.ts` — per-track skill lists and L1 exam blueprints  
- `src/data/evidence.ts` — resume parse results + GitHub ownership maps  
- `src/data/honestyMaps.ts` — claim ↔ artifact alignment rows  
- `src/data/exams.ts` — L1 questions, timers, pass thresholds, integrity strip copy  
- `src/data/projects.ts` — L2 repos, authorship %, architecture Qs  
- `src/data/certificates.ts` — Pro payloads including VRF IDs and public share slugs  
- `src/data/scores.ts` — blend helpers (pure functions over mock inputs)

---

## 5. Information architecture & routes

| Path | Screen | Journey step |
| --- | --- | --- |
| `/` | Home / Progress cockpit | Overview of spine + next action |
| `/onboarding` | Onboarding | Track confirmation, goals, trust intro |
| `/claims` | Claim skills | Select and prioritize claimed skills |
| `/evidence/resume` | Resume intake | Upload theater + parsed skill extraction |
| `/evidence/github` | GitHub connect | Connect theater + ownership map |
| `/reconcile` | Honesty Map | Align claims vs artifacts |
| `/exams` | L1 exam lobby | Skill exam cards + status |
| `/exams/:skillId` | Exam room | Timed L1 session theater |
| `/projects` | L2 project lobby | Eligible repos + audit status |
| `/projects/:repoId` | Project audit | Authorship heatmap + architecture Qs |
| `/certificate` | Certificate studio | Pro certificate canvas + score breakdown |
| `/certificate/share` | Public verify | Recruiter-facing public credential page |
| `/profile` | Recruiter-preview profile | Candidate profile as HR would see it |
| `/settings` | Settings | Persona switcher mirror, demo resets, prefs |

### Navigation rules

- Sidebar lists all primary routes; locked steps show a lock icon and tooltip (“Complete Honesty Map first”) until prerequisites mock-complete.
- Deep links to locked steps redirect to the first incomplete prerequisite with a toast.
- `/certificate/share` is reachable without login chrome for demo; still reads active persona’s issued certificate from mock state (or Aarav’s published cert if none issued — demo seed prefers Aarav issued).

### Journey spine prerequisites (strict for prototype)

1. Onboarding complete → Claims unlocked  
2. ≥1 claimed skill → Evidence unlocked  
3. Resume **or** GitHub attached → Reconcile unlocked (both required before L1 for demo path; UI allows partial but gates L1 until both done)  
4. Reconcile reviewed → Exams unlocked  
5. ≥1 core L1 pass → Projects unlocked for that track’s eligible repos  
6. Core L1 set + ≥1 in-track L2 pass → Pro certificate issued  
7. Pro issued → Share enabled  

---

## 6. Verification model & scoring

### 6.1 Three evidence layers

| Layer | What it is | Where it appears |
| --- | --- | --- |
| **Claims** | Skills the candidate asserts | `/claims`, Honesty Map left column |
| **Artifacts** | Resume parse + GitHub ownership / stack signals | Evidence screens, Honesty Map middle |
| **Performance** | L1 timed exams + L2 project audits | Exams, Projects, Certificate, Profile |

HR-facing language maps: Claims → self-reported; Artifacts → evidence available; Performance → independently assessed / verified.

### 6.2 Honesty Map states

Every claimed skill gets exactly one reconcile state:

| State | Meaning | UI |
| --- | --- | --- |
| **Aligned** | Resume and/or GitHub strongly support the claim | Green verified-adjacent badge (use accent/neutral check; reserve `#16A34A` for post-performance verified) |
| **Weak support** | Mentioned thinly or only in one artifact | Amber warning |
| **Conflict** | Claim contradicts artifact signal (e.g., claims Kubernetes, repos are pure CSS) | Red danger |
| **Missing** | No artifact support found | Neutral / dashed |

Candidates can **downgrade or remove** conflicted claims, **add evidence notes** (mock text), or **keep with acknowledgment**. Reconciliation does not auto-delete claims; it records `reconcileDisposition` per skill.

### 6.3 Level 1 — Skill Exam

- Timed, multiple-choice + short practical prompts (UI only; answers checked against mock answer keys).  
- Pass threshold: **~70%** (store as `passScore: 70` per exam).  
- **Integrity strip** (theater): fake webcam lite indicator, tab-focus warning toast, randomized “environment check” checklist — all cosmetic.  
- Retake: mocked cooldown label (“Available now” in demo) and prior attempt history.  
- Outcome: pass → L1 badge on skill; fail → retake CTA; abandon → incomplete.

### 6.4 Level 2 — Project Verification

Per selected repo:

- **Authorship %** (commit ownership mock)  
- **Stack match** vs claimed / exam skills  
- **Architecture questions** (3–5 short prompts with mock rubric scores)  
- Optional authorship **heatmap** (files × relative ownership)

Pass when composite L2 score ≥ 70 and authorship ≥ 40% (configurable per repo in mock data; demo repos all pass-ready for Aarav’s e-commerce repo).

### 6.5 Pro Certificate issuance

Issued when **all** are true for the active track:

1. All **core skills** for the track have L1 pass.  
2. At least **one in-track L2** project audit passed.  
3. Honesty Map reviewed (not necessarily all Aligned — Conflicts must be dispositioned).

Pro payload includes: overall score, per-skill L1/L2 badges, credential ID, issue date, public URL/QR target, evidence pack preview.

### 6.6 Overall score blend

Always show the breakdown; never a bare number without weights:

| Component | Weight |
| --- | --- |
| L1 exam aggregate | **40%** |
| L2 project aggregate | **35%** |
| Evidence alignment (Honesty Map) | **15%** |
| Consistency / integrity signals | **10%** |

Definitions for prototype:

- **L1 aggregate:** mean of passed core skill exam scores; failed/not-taken core skills count as 0 toward mean only after Pro eligibility check fails — for in-progress cockpit, show “partial” mean of completed exams and label it.  
- **L2 aggregate:** mean of completed in-track L2 composites; if none, component shows “—” and overall is marked **In progress**.  
- **Evidence alignment:** % of claimed skills in Aligned or Weak support (Aligned=100, Weak=60, Conflict=20, Missing=0), averaged.  
- **Consistency / integrity:** mock score from integrity strip events + claim disposition honesty (demo seeds: Aarav 96, others vary 88–94).

**Overall** = weighted sum when L1 and L2 aggregates exist; otherwise display partial with disabled Pro CTA.

Aarav demo target overall: **94** (matches HR dashboard `verificationScore`), credential family **VRF-92831**.

---

## 7. Legendary features

These are the prototype’s showcase capabilities — each must be interactive, not a static poster:

1. **Track / persona switcher** — swap Aarav / Priya / Kabir / Ananya; equal-depth data for each.  
2. **Resume parser theater** — upload → scanning animation → extracted skills with confidence.  
3. **GitHub connect + ownership map** — connect button theater → org/repos list → ownership %.  
4. **Honesty Map** — claim vs artifact matrix with Aligned / Weak / Conflict / Missing.  
5. **Exam room** — timer, integrity strip, question flow, score reveal.  
6. **Project audit + authorship heatmap** — repo drill-in, heatmap, architecture Qs.  
7. **Tier unlock L1 → L2 → Pro** — visible gates and celebratory unlock moments.  
8. **Certificate studio + public verify** — canvas, QR, share link, public page.  
9. **Recruiter-preview profile** — candidate-side mirror of HR evidence language.  
10. **Retake / partial progress** — failed exam, incomplete evidence, mid-journey cockpit states.

---

## 8. Screen-by-screen design

For each route: purpose, key UI, interactions, mock states.

### 8.1 Home — `/`

**Purpose:** Progress cockpit; answer “where am I and what’s next?”

**Key UI:**
- Hero metric row: Overall score (or “Not scored yet”), L1 progress, L2 progress, Pro status  
- Journey spine (large) with next-step CTA  
- Track chip + persona name  
- “Continue journey” primary button → first incomplete step  
- Secondary: Recruiter preview, Certificate (if issued)

**Interactions:** CTA navigates; spine segments navigate if unlocked; persona switcher in sidebar refreshes metrics.

**Mock states:** Fresh (Aarav mid-journey for demo seed), empty new persona, Pro complete, blocked-on-conflict.

### 8.2 Onboarding — `/onboarding`

**Purpose:** Confirm track, set goal, introduce trust model.

**Key UI:** 3-step wizard — Welcome + trust line → Confirm track (pre-filled by persona, editable only via switcher note) → Goal (Get Pro Certificate / Explore) → Done.

**Interactions:** Finish sets `onboardingComplete` and routes to `/claims`.

**Mock states:** First run; already completed (show summary + “Continue to claims”).

### 8.3 Claims — `/claims`

**Purpose:** Declare skills for the active track.

**Key UI:** Searchable skill chips from track catalog; “Core” vs “Additional”; count toward Pro requirements called out; save bar.

**Interactions:** Toggle skills; mark priority; Save → toast → unlock Evidence.

**Mock states:** Empty; Aarav pre-selected React/JS/TS/Next.js; over-claim warning if >12 skills.

### 8.4 Resume evidence — `/evidence/resume`

**Purpose:** Artifact layer — resume intake theater.

**Key UI:** Dropzone; fake file `Aarav_Sharma_Resume.pdf`; progress phases (Upload → OCR/Parse → Skill extract); result table: skill, confidence, source snippet.

**Interactions:** “Parse resume” runs 2–3s theater; “Use sample resume” one-click for demo; Attach confirms `resumeAttached`.

**Mock states:** Idle; parsing; parsed success; parse weak (low confidence list).

### 8.5 GitHub evidence — `/evidence/github`

**Purpose:** Connect GitHub (mock) and show ownership map.

**Key UI:** Connect CTA; connected account mock (`@aaravsharma-dev`); repo cards with language bars and ownership %; “Include in verification” toggles.

**Interactions:** Connect theater (1.5s); select primary repos; Continue.

**Mock states:** Disconnected; connected; connected with low-ownership warning.

### 8.6 Reconcile — `/reconcile` (Honesty Map)

**Purpose:** Force confrontation between claims and artifacts.

**Key UI:** Table/matrix: Claim | Resume | GitHub | State | Action; filters by state; summary counts; “Mark reviewed” CTA.

**Interactions:** Disposition Conflict (remove claim / keep with note / add clarifying note); Mark reviewed unlocks Exams.

**Mock states:** Pre-seeded mix (Aarav mostly Aligned, one Weak on GraphQL if claimed); all Missing (if evidence skipped — should be gated); Conflict-heavy teaching state for Kabir optional seed.

### 8.7 Exams lobby — `/exams`

**Purpose:** List L1 exams for claimed/core skills.

**Key UI:** Cards: skill, duration (e.g. 25 min), pass mark 70%, status (Locked/Available/Passed/Failed); integrity explainer callout.

**Interactions:** Start exam → `/exams/:skillId`; View result opens score drawer.

**Mock states:** Locked (pre-reconcile); available; mixed pass/fail; all core passed.

### 8.8 Exam room — `/exams/:skillId`

**Purpose:** Timed L1 session theater.

**Key UI:** Timer; integrity strip (camera mock, focus status); question panel; progress dots; Submit.

**Interactions:** Answer MCQs; on submit → grading theater (1s) → result modal (score, pass/fail, retake); Pass writes L1 badge.

**Mock states:** In progress; passed (React 91 for Aarav); failed (&lt;70); expired timer auto-submit.

**Demo:** React exam auto-near-pass path: “Use demo answers” optional button for 90s path reliability.

### 8.9 Projects lobby — `/projects`

**Purpose:** L2 eligibility after core L1 progress.

**Key UI:** Repo cards from GitHub evidence; eligibility (stack match, authorship); status.

**Interactions:** Open audit → `/projects/:repoId`.

**Mock states:** Locked; eligible list; Aarav’s **shopkart-ecommerce** highlighted for demo.

### 8.10 Project audit — `/projects/:repoId`

**Purpose:** Authorship + architecture verification.

**Key UI:** Repo header; authorship % ring; file heatmap; stack match chips; 3–5 architecture questions; Submit audit.

**Interactions:** Answer Qs; submit → composite score → L2 badge; unlock Pro if requirements met (celebration modal).

**Mock states:** Ready; passed (Aarav e-commerce); failed authorship; in progress.

### 8.11 Certificate studio — `/certificate`

**Purpose:** Pro certificate canvas and score transparency.

**Key UI:**
- Certificate canvas: name, track title (e.g. Verified Frontend Engineer), overall score, credential ID, issue date, skill badges (L1/L2), QR  
- Score breakdown panel (40/35/15/10)  
- Evidence pack preview (matches HR evidence language: practical / knowledge / project)  
- Actions: Download (mock), Copy public link, Open public verify

**Interactions:** Issue animation once when newly eligible; copy link toast.

**Mock states:** Not eligible; newly issued; Aarav issued VRF-92831 dated 2026-08-20.

### 8.12 Public share — `/certificate/share`

**Purpose:** Public verify page (recruiter / anyone with link).

**Key UI:** Minimal chrome; credential authentic badge; score; skills; Verify ID field pre-filled; evidence pack summary; trust line footer.

**Interactions:** “Verify credential” confirms Authentic (modal); no edit controls.

**Mock states:** Valid Aarav; valid other personas (VRF-xxxxx); invalid ID message for mistyped query param.

### 8.13 Profile — `/profile`

**Purpose:** Recruiter-preview — what HR dashboard shows for this candidate.

**Key UI:** Mirror HR profile sections: header, verification score, verified vs self-reported skills, credentials, evidence breakdowns; banner “Recruiter preview”.

**Interactions:** Jump to certificate; switch back to cockpit.

**Mock states:** Pre-Pro (partial); full Aarav 94% Verified matching HR.

### 8.14 Settings — `/settings`

**Purpose:** Demo control panel + lightweight prefs.

**Key UI:** Active persona; Reset journey (persona); Reset all; Motion/integrity theater toggles; About VERIFIED.

**Interactions:** Resets restore seed mock progress for that persona.

**Mock states:** Default; after reset confirmation.

---

## 9. Four-track equal-depth data requirements

Every persona must include the same *shape* of data at comparable richness. No track is a stub.

### Shared shape per persona

- Profile: name, track, location, years experience, education, avatar initials, credential ID (when Pro issued)  
- Core skills (4) + additional skills (2–4)  
- Resume parse payload with snippets  
- GitHub: handle, 3–5 repos (1 primary L2 target), ownership %  
- Honesty Map rows for all claims  
- L1 exam bank (≥8 questions) per core skill  
- L2 primary repo with heatmap cells + 4 architecture questions  
- Score components yielding a coherent overall  
- Certificate title + public slug  

### 9.1 Frontend — Aarav Sharma

| Field | Seed |
| --- | --- |
| Location | Bengaluru, India |
| Experience | 2 years |
| Education | B.Tech Computer Science, NIT Trichy |
| Core skills | React, JavaScript, TypeScript, Next.js |
| Additional | Figma (self-reported), GraphQL (weak support) |
| Credential | **VRF-92831** — Verified Frontend Engineer — issued 2026-08-20 |
| Overall target | **94** |
| Primary L2 repo | `shopkart-ecommerce` (React/Next, authorship ~78%) |
| Demo role | Hero path; must match HR dashboard identity |

### 9.2 Backend — Priya Nair

| Field | Seed |
| --- | --- |
| Location | Hyderabad, India |
| Experience | 3 years |
| Education | B.E. Information Technology, BITS Pilani |
| Core skills | Node.js, REST APIs, PostgreSQL, System Design (backend focus) |
| Additional | Redis, Docker |
| Credential | VRF-10442 — Verified Backend Engineer |
| Overall target | 91 |
| Primary L2 repo | `orders-api` (Node/Express, authorship ~82%) |
| Notes | Distinct from any same-named HR frontend profile; candidate-app Backend persona is authoritative here |

### 9.3 Data/ML — Kabir Mehta

| Field | Seed |
| --- | --- |
| Location | Pune, India |
| Experience | 2 years |
| Education | M.Sc. Data Science, IIIT Hyderabad |
| Core skills | Python, SQL, Machine Learning, Data Wrangling |
| Additional | PyTorch, Tableau |
| Credential | VRF-22107 — Verified Data/ML Engineer |
| Overall target | 89 |
| Primary L2 repo | `churn-model` (Python notebooks + pipeline, authorship ~71%) |

### 9.4 Mobile — Ananya Iyer

| Field | Seed |
| --- | --- |
| Location | Chennai, India |
| Experience | 2 years |
| Education | B.Tech CSE, College of Engineering Guindy |
| Core skills | React Native, Flutter, Mobile UI, App State Management |
| Additional | Firebase, App Store release basics |
| Credential | VRF-33518 — Verified Mobile Engineer |
| Overall target | 90 |
| Primary L2 repo | `pulse-fitness-app` (RN, authorship ~75%) |

Equal depth checklist (must pass for each): 4 core L1 banks, 1 primary L2 with heatmap, full Honesty Map, certificate canvas fields, recruiter-preview skills list, mid-journey and complete seeds.

---

## 10. Visual system / tokens

Align with HR dashboard; candidate app may add journey-specific patterns but not a new palette.

### Color

| Token | Hex | Use |
| --- | --- | --- |
| Background | `#F7F7F5` | App canvas |
| Card | `#FFFFFF` | Surfaces |
| Text primary | `#18181B` | Headings, names, bold metrics |
| Text secondary | `#71717A` | Meta, captions |
| Border | `#E4E4E7` | Thin dividers, inputs, cards |
| Accent | `#6D4AFF` | Primary CTAs, active nav, spine progress |
| Verified | `#16A34A` | Verification / success / Authentic **only** |
| Warning | `#F59E0B` | Weak support, mid scores, integrity caution |
| Danger | `#DC2626` | Conflict, destructive, exam failure |

Green is never decorative. No neon, heavy glass, or fake AI glow.

### Typography & layout

- Clean sans (system / Inter via Tailwind)  
- Huge whitespace; strong hierarchy; bold large metrics on cockpit  
- Corners: `rounded-lg` / `rounded-xl`  
- Cards: 1px border `#E4E4E7` + soft shadow  
- Institutional trust aesthetic — closer to a credential authority than a consumer growth app  

### Motion

- Short (200–400ms) transitions for unlocks  
- Parser / connect / grading theaters 1.5–3s max  
- Prefer opacity/position over bounce  

### Trust UI rules

| State | Presentation |
| --- | --- |
| Platform-verified skill | Green ✓ + Verified; evidence available |
| Self-reported / claim only | Neutral chip; no green |
| Honesty Conflict | Danger text + resolve CTA |
| Credential | ID + Authentic + public verify |
| Score | Always with 40/35/15/10 breakdown when overall shown |

---

## 11. Demo path

**90 seconds — Frontend / Aarav Sharma** (seed journey mid-ready so clicks are short):

1. **Home** — cockpit shows Frontend track, partial progress, Continue.  
2. **Claims** — React / JavaScript / TypeScript / Next.js selected; Save.  
3. **Resume** — Use sample → parse theater → attach.  
4. **GitHub** — Connect theater → select `shopkart-ecommerce` → continue.  
5. **Honesty Map** — mostly Aligned; mark reviewed.  
6. **React L1** — enter exam room → demo answers / pass theater → **91** pass.  
7. **L2** — open e-commerce repo → heatmap + quick architecture answers → pass.  
8. **Pro unlock** — celebration → Certificate studio shows **VRF-92831**, overall **94**.  
9. **Public share** — open `/certificate/share` → Authentic badge.

Seed defaults may pre-complete early steps so a judge can jump in at Exams if time is tight; README (future) will note “full path” vs “express path from `/exams`”.

---

## 12. Relationship to HR dashboard

| Concern | Contract |
| --- | --- |
| Apps | Separate repositories / deployments; do not merge codebases |
| Brand | Same name VERIFIED, trust line, tokens, badge language |
| Hero identity | Aarav Sharma, Bengaluru, Frontend, **94%**, skills React/JS/TS/Next.js |
| Credential | **VRF-92831** / Verified Frontend Engineer / issued **2026-08-20** / status Authentic |
| Evidence language | Independently verified; practical / knowledge / project evaluation framing on evidence pack preview |
| Recruiter preview | `/profile` should be recognizable to someone who used the HR Candidate Profile |
| Other personas | Candidate-app Priya/Kabir/Ananya credential IDs are candidate-portal seeds; HR app may not list them identically — only Aarav/VRF-92831 is a hard cross-app lock |
| Direction of truth for shared demo | HR dashboard already shipped Aarav; Candidate portal must not contradict VRF-92831 fields above |

---

## 13. Out of scope / future

### Out of scope (this prototype)

- Real OAuth, real grading, real PDF generation  
- Payments, proctoring hardware, native mobile apps  
- Merging into HR app  
- Multi-user auth, notifications backend, email  
- Cursor cloud agents  

### Future (post-prototype)

- Real GitHub OAuth + ownership heuristics  
- Proctored L1 delivery and server-side grading  
- Signed PDF certificates + public verify API  
- Recruiter deep-link from HR profile → candidate public credential  
- Candidate ↔ HR shared schema package  
- Accessibility audit and localization  

### Success criteria for the eventual prototype

- Judges complete the 90s Aarav path without backend  
- Four personas feel equally real (no stub tracks)  
- Honesty Map and score breakdown make verification epistemology obvious in &lt;10 seconds  
- Public share page is believable as an Authentic credential check  
- Visual system matches HR app at a glance  

---

## Decisions log

| Decision | Choice |
| --- | --- |
| Approach | Journey OS (Approach A) |
| Multi-track | Persona switcher in one app |
| Delivery | Clickable prototype + mock data |
| Score weights | L1 40% + L2 35% + alignment 15% + integrity 10% |
| L1 pass | 70% |
| Pro gate | Core L1s + ≥1 in-track L2 + reconcile reviewed |
| Shared credential | Aarav / VRF-92831 locked to HR demo |
| Green usage | Verification states only |
