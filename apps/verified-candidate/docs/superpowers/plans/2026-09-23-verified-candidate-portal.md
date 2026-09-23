# VERIFIED Candidate Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity frontend-only clickable prototype of VERIFIED Candidate — Verification Journey OS covering four equal-depth persona tracks from claims → evidence → L1/L2 → Pro certificate → public share.

**Architecture:** Single Vite + React + TypeScript app with React Router, Tailwind tokens matching the HR dashboard, and React Context + `useReducer` for persona/journey/UI theater state. All data is static TypeScript under `src/data/`; OAuth, grading, and PDF are timed UI theaters over mock payloads. App shell (sidebar journey nav + persona switcher + topbar spine) wraps authenticated routes; `/certificate/share` is chrome-light.

**Tech Stack:** Vite, React 18+, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v6/v7, lucide-react, mock data modules. Mirror HR app versions where practical (`/workspace/verified-hr-dashboard/package.json`).

## Global Constraints

Copied from `docs/superpowers/specs/2026-09-23-verified-candidate-portal-design.md` — every task implicitly includes these:

- **Product:** VERIFIED Candidate — Verification Journey OS; separate app from HR (do not merge codebases; do not copy recruiter pages).
- **Delivery:** Frontend-only high-fidelity clickable prototype + mock data. No real OAuth, grading, proctoring, PDF signing, payments, backend, auth servers, or Cursor cloud agents.
- **Stack:** Vite + React + TypeScript + Tailwind + React Router + mock data (same family as HR).
- **Visual tokens:** bg `#F7F7F5`, card `#FFFFFF`, text `#18181B` / `#71717A`, border `#E4E4E7`, accent `#6D4AFF`, verified green `#16A34A` **only** for verification/success/Authentic (never decorative), warning `#F59E0B`, danger `#DC2626`.
- **Trust line:** Don't trust the claim. Verify the skill.
- **Personas (equal depth):** Frontend — Aarav Sharma (`aarav`, VRF-92831); Backend — Priya Nair (`priya`, VRF-10442); Data/ML — Kabir Mehta (`kabir`, VRF-22107); Mobile — Ananya Iyer (`ananya`, VRF-33518).
- **Shared HR lock (Aarav only):** Bengaluru, Frontend, overall **94**, React/JS/TS/Next.js, credential **VRF-92831** / Verified Frontend Engineer / issued **2026-08-20** / Authentic.
- **Score blend (always show breakdown):** L1 exam aggregate **40%** + L2 project aggregate **35%** + Evidence alignment **15%** + Consistency/integrity **10%**. L1 pass threshold **70%**. L2 pass: composite ≥70 and authorship ≥40% (demo repos pass-ready).
- **Pro gate:** All core L1 passes + ≥1 in-track L2 pass + Honesty Map reviewed (conflicts dispositioned).
- **Journey spine:** Onboard → Claims → Evidence → Reconcile → Exams → Projects → Certificate → Share.
- **Grok Bot only** — no Cursor cloud agents / Origin workflows.
- **Verification style for this plan:** implement → `npm run build` (or `tsc -b`) visual/manual check → commit. Skip inventing a Vitest suite unless a pure helper is trivial to unit-test; prefer build + click-path sanity.

**HR reuse (patterns only):** Copy token names/shadows from `verified-hr-dashboard/src/index.css`, Sidebar chrome style (logo block, `SideLink` active `bg-accent-soft text-accent`, 240px fixed aside), Layout/`Toast`/`Modal`/`Avatar` interaction patterns. Do **not** copy recruiter pages, Find Talent, shortlists, or HR `candidates.ts` wholesale.

---

## File Structure

Create the app at repo root `/workspace/verified-candidate/` (alongside existing `docs/`).

```
verified-candidate/
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .gitignore
├── README.md
├── public/
│   └── vite.svg
├── docs/superpowers/...
└── src/
    ├── main.tsx
    ├── App.tsx                          # Router + providers
    ├── index.css                        # Tailwind + @theme tokens (HR-aligned)
    ├── types/
    │   └── index.ts                     # PersonaId, JourneyProgress, Skill, Exam, Project, Certificate, AppState
    ├── data/
    │   ├── personas.ts                  # 4 personas + track metadata + seed JourneyProgress
    │   ├── skillsCatalog.ts             # per-track core/additional skills
    │   ├── evidence.ts                  # resume parse + GitHub ownership per persona
    │   ├── honestyMaps.ts               # claim↔artifact rows + default states
    │   ├── exams.ts                     # L1 banks (≥8 Qs/core skill), timers, passScore:70
    │   ├── projects.ts                  # L2 repos, heatmaps, architecture Qs
    │   ├── certificates.ts              # Pro payloads, VRF IDs, share slugs
    │   └── scores.ts                    # pure blend helpers
    ├── context/
    │   └── AppContext.tsx               # useReducer: persona, journeyByPersona, ui theaters, toasts
    ├── lib/
    │   ├── journey.ts                   # unlock predicates, nextStep, redirects
    │   └── theater.ts                   # sleep/delay helpers for parse/connect/grade
    ├── components/
    │   ├── Layout.tsx                   # shell: Sidebar + Topbar + Outlet + ToastHost
    │   ├── PublicLayout.tsx             # chrome-light for /certificate/share
    │   ├── Sidebar.tsx                  # logo, journey nav (locks), track chip, persona switcher
    │   ├── Topbar.tsx                   # current step, overall score, Recruiter preview, mock bell
    │   ├── JourneySpine.tsx             # horizontal stepper (compact + large variants)
    │   ├── PersonaSwitcher.tsx          # Aarav/Priya/Kabir/Ananya control
    │   ├── MetricCard.tsx               # cockpit metric tiles
    │   ├── SkillChip.tsx                # claim / verified / self-reported chips
    │   ├── HonestyRow.tsx               # reconcile table row + disposition controls
    │   ├── ScoreBreakdown.tsx           # 40/35/15/10 panel
    │   ├── AuthorshipHeatmap.tsx        # SVG file×ownership grid
    │   ├── ScoreRing.tsx                # SVG ring for L2 authorship / overall
    │   ├── IntegrityStrip.tsx           # exam theater (camera/focus)
    │   ├── CertificateCanvas.tsx        # Pro certificate visual
    │   ├── Toast.tsx / Modal.tsx / Avatar.tsx / EmptyState.tsx / LockedGate.tsx
    │   └── ...
    └── pages/
        ├── Home.tsx                     # /
        ├── Onboarding.tsx               # /onboarding
        ├── Claims.tsx                   # /claims
        ├── ResumeEvidence.tsx           # /evidence/resume
        ├── GitHubEvidence.tsx           # /evidence/github
        ├── Reconcile.tsx                # /reconcile
        ├── ExamsLobby.tsx               # /exams
        ├── ExamRoom.tsx                 # /exams/:skillId
        ├── ProjectsLobby.tsx            # /projects
        ├── ProjectAudit.tsx             # /projects/:repoId
        ├── CertificateStudio.tsx        # /certificate
        ├── PublicShare.tsx              # /certificate/share
        ├── Profile.tsx                  # /profile
        └── Settings.tsx                 # /settings
```

---

### Task 1: Scaffold Vite app, tokens, and app shell

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.gitignore`, `README.md`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/components/Layout.tsx`, `PublicLayout.tsx`, `Sidebar.tsx`, `Topbar.tsx`, `JourneySpine.tsx`, `PersonaSwitcher.tsx`, `Toast.tsx`, `Avatar.tsx`
- Create: stub pages under `src/pages/` that render a titled placeholder card (wired to routes)

**Interfaces:**
- Consumes: HR token names from `verified-hr-dashboard/src/index.css` (`canvas`, `card`, `ink`, `muted`, `line`, `accent`, `accent-soft`, `verified`, `verified-soft`, `warning`, `danger`, `shadow-card`, `shadow-lift`)
- Produces: runnable app at `npm run dev`; routes listed in §5 of the spec; shell chrome except on public share

- [ ] **Step 1: Scaffold project**

From `/workspace/verified-candidate` (docs already present — scaffold into repo root without wiping `docs/`):

```bash
npm create vite@latest . -- --template react-ts
# If create-vite refuses non-empty dir: create in /tmp/vc-scaffold, copy package.json/vite/tsconfigs/src/index.html into repo root, keep docs/
npm install
npm install react-router-dom lucide-react
npm install -D @tailwindcss/vite tailwindcss
```

Align dependency majors with HR where practical (React 19 / Router 7 / Tailwind 4 / Vite 8 is fine).

- [ ] **Step 2: Wire Tailwind tokens in `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --color-canvas: #F7F7F5;
  --color-card: #FFFFFF;
  --color-ink: #18181B;
  --color-muted: #71717A;
  --color-line: #E4E4E7;
  --color-accent: #6D4AFF;
  --color-accent-soft: #F0ECFF;
  --color-verified: #16A34A;
  --color-verified-soft: #DCFCE7;
  --color-warning: #F59E0B;
  --color-danger: #DC2626;
  --shadow-card: 0 1px 2px rgba(24, 24, 27, 0.03), 0 6px 20px rgba(24, 24, 27, 0.035);
  --shadow-lift: 0 10px 32px rgba(24, 24, 27, 0.07), 0 2px 8px rgba(24, 24, 27, 0.04);
}

/* body, #root height, fade-up / toast-in / ring-draw / pulse-dot animations — copy style from HR index.css */
```

Load Inter via `index.html` Google Fonts or system fallback.

- [ ] **Step 3: Implement shell + routes**

`App.tsx` structure:

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="certificate/share" element={<PublicShare />} />
    </Route>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="onboarding" element={<Onboarding />} />
      <Route path="claims" element={<Claims />} />
      <Route path="evidence/resume" element={<ResumeEvidence />} />
      <Route path="evidence/github" element={<GitHubEvidence />} />
      <Route path="reconcile" element={<Reconcile />} />
      <Route path="exams" element={<ExamsLobby />} />
      <Route path="exams/:skillId" element={<ExamRoom />} />
      <Route path="projects" element={<ProjectsLobby />} />
      <Route path="projects/:repoId" element={<ProjectAudit />} />
      <Route path="certificate" element={<CertificateStudio />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
</BrowserRouter>
```

`Layout.tsx`: fixed 240px `Sidebar`, `pl-[240px]` main column, sticky `Topbar`, `<Outlet />`, `ToastHost`. Match HR spacing (`px-8 py-8`).

`Sidebar.tsx`: VERIFIED logo + checkmark square (`bg-accent`), subtitle **Candidate**, trust line, journey nav links with lock icon placeholders, track label chip, bottom `PersonaSwitcher` (4 buttons; for now local `useState` until Task 3).

`Topbar.tsx`: left = current step label + compact `JourneySpine`; right = overall score placeholder, “Recruiter preview” → `/profile`, mock notifications toast.

`PublicLayout.tsx`: minimal header (logo + trust line), no persona switcher, centered content.

Stub each page as:

```tsx
export function Home() {
  return (
    <div className="animate-fade-up rounded-xl border border-line bg-card p-8 shadow-card">
      <h1 className="text-2xl font-bold text-ink">Home</h1>
      <p className="mt-2 text-sm text-muted">Progress cockpit — coming next.</p>
    </div>
  );
}
```

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Expected: TypeScript + Vite build succeed with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig*.json .gitignore README.md src public
git commit -m "$(cat <<'EOF'
feat: scaffold VERIFIED Candidate Vite app with tokens and shell

EOF
)"
```

---

### Task 2: Types and equal-depth mock data for four personas

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/personas.ts`, `skillsCatalog.ts`, `evidence.ts`, `honestyMaps.ts`, `exams.ts`, `projects.ts`, `certificates.ts`, `scores.ts`

**Interfaces:**
- Produces types and data modules consumed by Context and all pages:

```ts
export type PersonaId = 'aarav' | 'priya' | 'kabir' | 'ananya';
export type TrackId = 'frontend' | 'backend' | 'data-ml' | 'mobile';
export type HonestyState = 'aligned' | 'weak' | 'conflict' | 'missing';
export type ReconcileDisposition = 'keep' | 'remove' | 'note' | null;
export type ExamStatus = 'locked' | 'available' | 'passed' | 'failed' | 'incomplete';

export interface JourneyProgress {
  onboardingComplete: boolean;
  claimedSkillIds: string[];
  resumeAttached: boolean;
  githubConnected: boolean;
  includedRepoIds: string[];
  reconcileReviewed: boolean;
  dispositions: Record<string, ReconcileDisposition>; // skillId
  evidenceNotes: Record<string, string>;
  examResults: Record<string, { score: number; status: 'passed' | 'failed' | 'incomplete'; attemptedAt: string }>;
  projectResults: Record<string, { composite: number; authorship: number; status: 'passed' | 'failed' | 'incomplete' }>;
  proIssued: boolean;
  shareEnabled: boolean;
}

export interface Persona {
  id: PersonaId;
  name: string;
  trackId: TrackId;
  trackTitle: string; // e.g. "Verified Frontend Engineer"
  location: string;
  experienceYears: number;
  education: string;
  avatarInitials: string;
  avatarHue: number;
  githubHandle: string;
  credentialId: string; // VRF-xxxxx
  publicSlug: string;
  integritySeed: number; // Aarav 96, others 88–94
  overallTarget: number;
  coreSkillIds: string[];
  additionalSkillIds: string[];
}

export interface SkillDef {
  id: string;
  name: string;
  trackId: TrackId;
  core: boolean;
}

export interface ResumeParseResult {
  fileName: string;
  skills: { skillId: string; confidence: number; snippet: string }[];
}

export interface GithubRepo {
  id: string;
  name: string;
  languages: { name: string; pct: number }[];
  authorshipPct: number;
  primaryL2: boolean;
  description: string;
}

export interface HonestyRow {
  skillId: string;
  resume: boolean;
  github: boolean;
  state: HonestyState;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number; // mock key
  kind: 'mcq' | 'practical';
}

export interface ExamBlueprint {
  skillId: string;
  durationMin: number;
  passScore: 70;
  questions: ExamQuestion[]; // ≥8 for core
}

export interface ArchQuestion {
  id: string;
  prompt: string;
  rubricMax: number;
  demoAnswerScore: number; // for "use demo answers"
}

export interface ProjectDef {
  repoId: string;
  personaId: PersonaId;
  heatmap: { file: string; ownership: number }[];
  architectureQs: ArchQuestion[]; // 4
  stackMatchSkillIds: string[];
}

export interface CertificatePayload {
  personaId: PersonaId;
  title: string;
  credentialId: string;
  issuedOn: string; // Aarav: 2026-08-20
  skillBadgeIds: string[];
  publicSlug: string;
}

export function computeScoreComponents(input: {
  l1Scores: number[]; // completed core; use 0 for missing only when computing eligibility failure — cockpit uses partial mean
  l2Scores: number[];
  honestyStates: HonestyState[];
  integrity: number;
}): {
  l1: number | null;
  l2: number | null;
  alignment: number;
  integrity: number;
  overall: number | null; // null => In progress
  weights: { l1: 40; l2: 35; alignment: 15; integrity: 10 };
};
```

- [ ] **Step 1: Implement types + `scores.ts` helpers**

Alignment mapping: Aligned=100, Weak=60, Conflict=20, Missing=0; average claimed skills. Overall = weighted sum only when both L1 and L2 aggregates exist; else `null` / “In progress”.

Optionally add a tiny assert in `scores.ts` comment or `if (import.meta.env.DEV)` self-check that Aarav seeded components land near **94**.

- [ ] **Step 2: Author equal-depth data for all four personas**

Minimum per persona (spec §9):

| Persona | Core skills | Primary L2 | Credential | Overall target | Integrity |
| --- | --- | --- | --- | --- | --- |
| Aarav | React, JS, TS, Next.js (+ Figma self, GraphQL weak) | `shopkart-ecommerce` ~78% | VRF-92831 | 94 | 96 |
| Priya | Node.js, REST APIs, PostgreSQL, System Design (+ Redis, Docker) | `orders-api` ~82% | VRF-10442 | 91 | ~92 |
| Kabir | Python, SQL, ML, Data Wrangling (+ PyTorch, Tableau) | `churn-model` ~71% | VRF-22107 | 89 | ~90 |
| Ananya | RN, Flutter, Mobile UI, App State (+ Firebase, App Store) | `pulse-fitness-app` ~75% | VRF-33518 | 90 | ~91 |

Each persona: resume parse with snippets; 3–5 GitHub repos (1 primary L2); Honesty Map rows for all claims; ≥8 L1 questions per core skill; L2 heatmap (≥8 files) + 4 architecture Qs; certificate fields.

**Seed `JourneyProgress` (demo-friendly):**

- **Aarav (express-ready):** `onboardingComplete: true`, core+additional claimed, `resumeAttached` + `githubConnected` + `shopkart-ecommerce` included, `reconcileReviewed: true`, other core exams not yet taken (or pre-pass JS/TS/Next for express path — pick one and document in README). Prefer: evidence+reconcile done, **no** L1/L2 yet so 90s path still shows exam → project → Pro. Certificate payload exists for share page fallback.
- **Priya / Kabir / Ananya:** mid-journey variants (e.g. Priya evidence done; Kabir one Conflict disposition pending; Ananya fresh after onboarding) plus a “complete” reset target in Settings.

Export `seedJourneyByPersona: Record<PersonaId, JourneyProgress>` and `getPersonaPackage(id)` aggregating related data.

- [ ] **Step 3: Build verify**

```bash
npx tsc -b --pretty false
# or npm run build
```

Expected: no type errors; data modules import cleanly from a temporary `src/data/index.ts` barrel if useful.

- [ ] **Step 4: Commit**

```bash
git add src/types src/data
git commit -m "$(cat <<'EOF'
feat: add types and equal-depth mock data for four personas

EOF
)"
```

---

### Task 3: AppContext journey state, unlocks, and toasts

**Files:**
- Create: `src/context/AppContext.tsx`
- Create: `src/lib/journey.ts`, `src/lib/theater.ts`
- Modify: `src/main.tsx` / `src/App.tsx` to wrap `AppProvider`
- Modify: `Sidebar.tsx`, `PersonaSwitcher.tsx`, `Topbar.tsx` to consume context

**Interfaces:**
- Consumes: `PersonaId`, `JourneyProgress`, `seedJourneyByPersona`, `computeScoreComponents`
- Produces:

```ts
type Action =
  | { type: 'SWITCH_PERSONA'; id: PersonaId }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_CLAIMS'; skillIds: string[] }
  | { type: 'ATTACH_RESUME' }
  | { type: 'CONNECT_GITHUB'; includedRepoIds: string[] }
  | { type: 'SET_DISPOSITION'; skillId: string; disposition: ReconcileDisposition; note?: string }
  | { type: 'MARK_RECONCILE_REVIEWED' }
  | { type: 'SUBMIT_EXAM'; skillId: string; score: number }
  | { type: 'SUBMIT_PROJECT'; repoId: string; composite: number; authorship: number }
  | { type: 'ISSUE_PRO' }
  | { type: 'RESET_PERSONA' }
  | { type: 'RESET_ALL' }
  | { type: 'SET_UI'; patch: Partial<AppState['ui']> }
  | { type: 'TOAST'; message: string; toastType?: 'success' | 'info' | 'warning' | 'error' }
  | { type: 'DISMISS_TOAST'; id: string };

function isStepUnlocked(step: JourneyStep, progress: JourneyProgress, persona: Persona): boolean;
function firstIncompleteStep(progress: JourneyProgress, persona: Persona): JourneyStep;
function guardNavigate(path: string, progress: JourneyProgress, persona: Persona): { ok: true } | { ok: false; redirectTo: string; reason: string };
```

Unlock rules (strict, spec §5):

1. Onboarding → Claims  
2. ≥1 claimed skill → Evidence  
3. Resume **or** GitHub → Reconcile unlocked; **both** required before L1  
4. Reconcile reviewed → Exams  
5. ≥1 core L1 pass → Projects  
6. All core L1 + ≥1 in-track L2 → issue Pro / Certificate  
7. Pro issued → Share enabled  

`SWITCH_PERSONA`: set active id; if current path fails `guardNavigate`, navigate to `/` and toast.

`theater.ts`: `export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));`

- [ ] **Step 1: Implement `journey.ts` predicates + `AppContext` reducer**

Expose hooks: `useApp()`, `useActivePersona()`, `useJourney()`, `useScore()`, `toast()`.

`useScore()` derives Honesty states from `honestyMaps` + dispositions, L1/L2 from `examResults`/`projectResults`, integrity from persona seed (±small theater events later).

- [ ] **Step 2: Wire shell to context**

Persona switcher calls `SWITCH_PERSONA`. Sidebar locks use `isStepUnlocked` + tooltip “Complete Honesty Map first” (etc.). Topbar shows live overall or “Not scored yet” / “In progress”.

Add a small `RequireStep` wrapper or `useEffect` in locked pages: on mount, if `!guardNavigate.ok`, `navigate(redirectTo)` + toast.

- [ ] **Step 3: Build verify**

```bash
npm run build
```

Expected: success; manually click persona switcher and confirm stub pages still render.

- [ ] **Step 4: Commit**

```bash
git add src/context src/lib src/App.tsx src/main.tsx src/components/Sidebar.tsx src/components/PersonaSwitcher.tsx src/components/Topbar.tsx
git commit -m "$(cat <<'EOF'
feat: add journey AppContext, unlocks, and persona switching

EOF
)"
```

---

### Task 4: Home cockpit, onboarding, and claims

**Files:**
- Modify: `src/pages/Home.tsx`, `Onboarding.tsx`, `Claims.tsx`
- Create: `src/components/MetricCard.tsx`, `SkillChip.tsx` (if not present)

**Interfaces:**
- Consumes: `useJourney`, `useActivePersona`, `useScore`, `firstIncompleteStep`, `SET_CLAIMS`, `COMPLETE_ONBOARDING`
- Produces: working `/`, `/onboarding`, `/claims` for demo path start

- [ ] **Step 1: Home cockpit (`/`)**

UI:
- Hero metrics: Overall (or Not scored / In progress), L1 progress (`passedCore/coreCount`), L2 progress, Pro status chip  
- Large `JourneySpine` with next-step CTA  
- Track chip + persona name  
- Primary **Continue journey** → `firstIncompleteStep` route  
- Secondary: Recruiter preview, Certificate (if `proIssued`)

- [ ] **Step 2: Onboarding wizard (`/onboarding`)**

3 steps: Welcome + trust line → Confirm track (read-only; note “switch persona in sidebar”) → Goal (Get Pro Certificate / Explore). Finish → `COMPLETE_ONBOARDING` → `/claims`. If already complete, show summary + Continue.

- [ ] **Step 3: Claims (`/claims`)**

Searchable chips from track catalog; Core vs Additional; call out Pro core requirements; toggle + Save → `SET_CLAIMS` + toast + unlock evidence. Warn if >12 skills. Aarav seed already has React/JS/TS/Next selected.

- [ ] **Step 4: Build verify + click-path**

```bash
npm run build
```

Manual: Home Continue → Onboarding or Claims depending on seed; Save claims; sidebar Evidence unlocks.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/Onboarding.tsx src/pages/Claims.tsx src/components/MetricCard.tsx src/components/SkillChip.tsx
git commit -m "$(cat <<'EOF'
feat: implement home cockpit, onboarding, and skill claims

EOF
)"
```

---

### Task 5: Resume + GitHub evidence + Honesty Map

**Files:**
- Modify: `src/pages/ResumeEvidence.tsx`, `GitHubEvidence.tsx`, `Reconcile.tsx`
- Create: `src/components/HonestyRow.tsx`, `LockedGate.tsx`

**Interfaces:**
- Consumes: `ATTACH_RESUME`, `CONNECT_GITHUB`, `SET_DISPOSITION`, `MARK_RECONCILE_REVIEWED`, `wait`, evidence + honesty data
- Produces: legendary features 2–4 interactive; gates L1 until both evidence + reconcile reviewed

- [ ] **Step 1: Resume intake theater (`/evidence/resume`)**

Dropzone + “Use sample resume” (`Aarav_Sharma_Resume.pdf` or persona-specific name). Phases via `SET_UI` / local state: idle → uploading → parsing → extracted (2–3s total with `wait`). Result table: skill, confidence, snippet. **Attach** → `ATTACH_RESUME`. States: idle, parsing, success, weak confidence list.

- [ ] **Step 2: GitHub connect (`/evidence/github`)**

Connect CTA → 1.5s theater → show `@{handle}` + repo cards (language bars, ownership %). Toggle “Include in verification”; Continue → `CONNECT_GITHUB`. Warn on low ownership (&lt;40%). Aarav highlights `shopkart-ecommerce`.

- [ ] **Step 3: Honesty Map (`/reconcile`)**

Table: Claim | Resume | GitHub | State | Action. Filters by state; summary counts. Conflict actions: remove claim / keep with acknowledgment / add note (`SET_DISPOSITION`). **Mark reviewed** requires all Conflicts dispositioned → `MARK_RECONCILE_REVIEWED` → unlocks Exams. Aligned uses accent/neutral check — reserve `#16A34A` for post-performance Verified.

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Manual: sample resume → connect GitHub → mark reviewed; Exams unlocks; L1 still blocked if either evidence missing.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ResumeEvidence.tsx src/pages/GitHubEvidence.tsx src/pages/Reconcile.tsx src/components/HonestyRow.tsx src/components/LockedGate.tsx
git commit -m "$(cat <<'EOF'
feat: add resume/GitHub evidence theaters and Honesty Map

EOF
)"
```

---

### Task 6: L1 exam lobby and exam room

**Files:**
- Modify: `src/pages/ExamsLobby.tsx`, `ExamRoom.tsx`
- Create: `src/components/IntegrityStrip.tsx`, `Modal.tsx` (if missing)

**Interfaces:**
- Consumes: `exams.ts`, `SUBMIT_EXAM`, `wait`, unlock guards
- Produces: timed exam theater; Aarav React demo pass **91**; “Use demo answers” for 90s path

- [ ] **Step 1: Exams lobby (`/exams`)**

Cards per claimed/core skill: duration (e.g. 25 min), pass mark 70%, status Locked/Available/Passed/Failed. Integrity explainer callout. Start → `/exams/:skillId`. View result → score drawer/modal.

- [ ] **Step 2: Exam room (`/exams/:skillId`)**

Timer (can run accelerated in demo, e.g. 60s UI representing 25 min — document in UI as demo timer), `IntegrityStrip` (fake webcam lite, focus status; tab blur → warning toast), question panel, progress dots, Submit. Grading theater ~1s → result modal. Pass writes L1 badge via `SUBMIT_EXAM`. Fail → retake CTA (“Available now”). **Use demo answers** fills correct mock keys (Aarav React → **91**). Expired timer auto-submits.

- [ ] **Step 3: Build verify**

```bash
npm run build
```

Manual: run React exam with demo answers → pass 91; lobby shows Passed; Projects unlocks after ≥1 core pass (still need all cores for Pro).

- [ ] **Step 4: Commit**

```bash
git add src/pages/ExamsLobby.tsx src/pages/ExamRoom.tsx src/components/IntegrityStrip.tsx src/components/Modal.tsx
git commit -m "$(cat <<'EOF'
feat: implement L1 exam lobby and timed exam room theater

EOF
)"
```

---

### Task 7: L2 projects lobby and project audit

**Files:**
- Modify: `src/pages/ProjectsLobby.tsx`, `ProjectAudit.tsx`
- Create: `src/components/AuthorshipHeatmap.tsx`, `ScoreRing.tsx`

**Interfaces:**
- Consumes: `projects.ts`, included repos, `SUBMIT_PROJECT`, `ISSUE_PRO`
- Produces: authorship heatmap + architecture Qs; Aarav `shopkart-ecommerce` pass → Pro unlock celebration when cores complete

- [ ] **Step 1: Projects lobby (`/projects`)**

Repo cards from included GitHub evidence; eligibility (stack match, authorship); status. Lock if no core L1 pass. Highlight Aarav **shopkart-ecommerce**.

- [ ] **Step 2: Project audit (`/projects/:repoId`)**

Header, authorship % `ScoreRing`, SVG `AuthorshipHeatmap`, stack match chips, 3–5 architecture questions, Submit audit. Composite = weighted authorship + architecture rubric (store in mock; demo path ≥70). Pass → `SUBMIT_PROJECT`. If Pro gate satisfied, celebration `Modal` + `ISSUE_PRO` (sets `proIssued` + `shareEnabled`).

- [ ] **Step 3: Build verify**

```bash
npm run build
```

Manual: after core L1s (use demo answers quickly or temporarily seed), pass shopkart audit → Pro celebration.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ProjectsLobby.tsx src/pages/ProjectAudit.tsx src/components/AuthorshipHeatmap.tsx src/components/ScoreRing.tsx
git commit -m "$(cat <<'EOF'
feat: implement L2 project lobby, authorship heatmap, and audit

EOF
)"
```

---

### Task 8: Certificate studio, public share, profile preview, settings

**Files:**
- Modify: `src/pages/CertificateStudio.tsx`, `PublicShare.tsx`, `Profile.tsx`, `Settings.tsx`
- Create: `src/components/CertificateCanvas.tsx`, `ScoreBreakdown.tsx`

**Interfaces:**
- Consumes: `certificates.ts`, `useScore`, `ISSUE_PRO`, HR evidence language (`practical` / `knowledge` / `project`)
- Produces: VRF-92831 canvas, public Authentic page, recruiter-preview mirror, demo resets

- [ ] **Step 1: Certificate studio (`/certificate`)**

If not eligible: show checklist of missing gates. If eligible/issued: `CertificateCanvas` (name, track title, overall, credential ID, issue date, L1/L2 skill badges, QR placeholder), `ScoreBreakdown` 40/35/15/10, evidence pack preview, actions Download (toast mock), Copy public link (`/certificate/share?id=VRF-92831`), Open public verify. Issue animation once on first eligibility.

Aarav issued fields locked: **VRF-92831**, Verified Frontend Engineer, **2026-08-20**, overall **94**.

- [ ] **Step 2: Public share (`/certificate/share`)**

Chrome-light. Query `?id=` or active persona cert; fallback Aarav published. Credential Authentic badge (green), score, skills, Verify ID field, evidence summary, trust line footer. Verify → Authentic modal. Invalid id → error message. No edit controls / no persona switcher.

- [ ] **Step 3: Profile (`/profile`)**

Banner “Recruiter preview”. Header, verification score, verified vs self-reported skills, credentials, evidence breakdowns using HR language (“Independently verified — evaluated through our assessment process”). Jump to certificate / cockpit. Aarav full state should read as 94% Verified recognizable to HR users.

- [ ] **Step 4: Settings (`/settings`)**

Active persona mirror; Reset journey (persona) / Reset all; toggles for motion/integrity theater; About VERIFIED. Resets restore `seedJourneyByPersona`.

- [ ] **Step 5: Build verify**

```bash
npm run build
```

Manual: open public share Authentic; copy link toast; reset Aarav and confirm seed restored.

- [ ] **Step 6: Commit**

```bash
git add src/pages/CertificateStudio.tsx src/pages/PublicShare.tsx src/pages/Profile.tsx src/pages/Settings.tsx src/components/CertificateCanvas.tsx src/components/ScoreBreakdown.tsx
git commit -m "$(cat <<'EOF'
feat: add certificate studio, public verify, profile preview, settings

EOF
)"
```

---

### Task 9: Demo path polish, empty/partial states, routing, README

**Files:**
- Modify: pages/components as needed for empty/partial/locked states
- Modify: `README.md`
- Possibly: `src/lib/journey.ts`, seed tweaks in `src/data/personas.ts`

**Interfaces:**
- Consumes: full app
- Produces: reliable 90s Aarav path + express entry at `/exams`; four personas feel equal; production build clean

- [ ] **Step 1: Implement remaining mock states from spec §8**

Cover at least: fresh persona empty cockpit; blocked-on-conflict (Kabir); failed exam card; incomplete evidence partial reconcile gate; Pro-complete persona; low-ownership GitHub warning; invalid share id. Tier unlock moments: short 200–400ms accent flash / modal — no bounce spam.

- [ ] **Step 2: Wire deep-link guards everywhere**

Locked deep links redirect to first incomplete prerequisite with toast. Sidebar tooltips match. `/certificate/share` always reachable.

- [ ] **Step 3: Document demo paths in `README.md`**

```markdown
# VERIFIED Candidate — Verification Journey OS

Frontend-only prototype. `npm install && npm run dev`

## 90s Frontend / Aarav path
Home → Claims → Resume (sample) → GitHub (shopkart) → Honesty Map → React L1 (demo answers → 91) → L2 shopkart → Pro VRF-92831 (94) → Public share Authentic

## Express path
Seed may start at evidence+reconcile done; jump to `/exams`.

## Personas
Aarav / Priya / Kabir / Ananya via sidebar switcher.
```

- [ ] **Step 4: Final build verify + equal-depth checklist**

```bash
npm run build
```

Checklist (manual): each persona has 4 core L1 banks, primary L2+heatmap, Honesty Map, certificate fields, profile skills; Aarav identity matches HR; green only on verified/Authentic; score always shows 40/35/15/10 when overall present.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: polish demo path, empty states, guards, and README

EOF
)"
```

---

## Self-Review (plan vs spec)

| Spec area | Covered by |
| --- | --- |
| Goals / non-goals / locked decisions | Global Constraints + Task 1 stack |
| App shell + public chrome-light | Task 1 (`Layout` / `PublicLayout`) |
| State model + data modules | Tasks 2–3 |
| All routes §5 | Task 1 routing + Tasks 4–8 pages |
| Journey prerequisites | Task 3 `journey.ts` + Task 9 guards |
| Honesty states + dispositions | Task 5 |
| L1 / L2 / Pro / score blend | Tasks 2 (`scores.ts`), 6–8 |
| Legendary features 1–10 | Tasks 3–9 (switcher, theaters, map, exam, heatmap, unlocks, cert, profile, retakes) |
| Screen designs §8.1–8.14 | Tasks 4–8 |
| Four-track equal depth §9 | Task 2 + Task 9 checklist |
| Visual tokens §10 | Task 1 `index.css` + Global Constraints |
| 90s demo path §11 | Task 9 README + Aarav seeds |
| HR relationship §12 | Global Constraints + Task 8 profile/cert fields |
| Out of scope | Global Constraints (no OAuth/PDF/backend/cloud agents) |

**Gaps intentionally deferred (post-prototype / non-goals):** real OAuth, real grading, signed PDFs, payments, a11y audit, i18n, shared schema package with HR, Cursor cloud agents. No remaining in-scope spec screens without a task.

**Placeholder scan:** none intentional — implementers have types, unlock rules, seed table, route list, and verification commands.

**Type consistency notes:** use `PersonaId`, `JourneyProgress`, `HonestyState`, `SUBMIT_EXAM` / `SUBMIT_PROJECT` / `ISSUE_PRO` names consistently across Tasks 2–8; score weights fixed `{ l1: 40, l2: 35, alignment: 15, integrity: 10 }`.
