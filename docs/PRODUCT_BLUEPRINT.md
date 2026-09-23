# Talent Proof — Milestone 0 Product Blueprint

**Product:** TALENT PROOF  
**Tagline:** Prove Skills. Build Trust. Discover Talent.  
**Status:** Awaiting approval before Milestone 1 (Project Setup)

---

## 1. Complete product blueprint

**Talent Proof** is an evidence-based skill verification platform for students and recruiters.

It does not replace resumes. It answers one harder question:

> Can this candidate run, explain, debug, and improve *their own* submitted project?

**Core loop**

1. Student submits a real project (ZIP / GitHub / URL).
2. System analyzes structure, stack, and risks.
3. Trusted/limited execution runs tests where safe.
4. AI generates questions only from *that* project’s code.
5. Timed assessment measures understanding against the submission.
6. Transparent report + badges are produced from evidence.
7. Recruiters discover candidates by verified skills and request consent to contact.

**Non-goals for MVP**

- Perfect AI-cheating or authorship detection
- Guaranteed employment
- Full multi-language sandbox for everything
- Video-proctoring as a hard requirement

---

## 2. Refined problem statement

Students claim skills on resumes; recruiters cannot cheaply verify whether those skills are real. Traditional screens (resume keywords, generic MCQs, LeetCode-style tests) do not prove ownership or understanding of a candidate’s own projects.

**Talent Proof** creates a chain of evidence: project submission → analysis → execution/tests → project-specific assessment → scored report → verifiable badges → consent-based discovery.

---

## 3. Unique product gap

| Existing category | What they do | What they miss |
|---|---|---|
| Resume / portfolio builders | Show claims | No verification of understanding |
| Coding practice platforms | Generic DSA | Not tied to candidate’s project |
| Automated plagiarism / AI detectors | Similarity signals | Weak as sole proof; high false positives |
| Take-home assignment tools | Company-defined tasks | Expensive, slow, not reusable evidence |
| Assessment vendors | Standardized tests | Rarely project-ownership focused |
| GitHub profiles | Show code | No live understanding check |

**Gap Talent Proof owns:** *project-grounded assessment* — questions and scoring derived from the candidate’s actual codebase, with transparent evidence, optional integrity signals, and recruiter discovery under student consent.

---

## 4. Competitor categories

1. Portfolio / resume sites
2. Coding practice & contests
3. Campus assessment tools
4. Hiring ATS + screening plugins
5. Proctoring-only vendors
6. Badge / micro-credential platforms

**Positioning:** verification layer between student projects and recruiter trust, not another learning app.

---

## 5. Target users

**Primary — Student (B.Tech / early career)**  
Needs trusted proof of skills without relying only on resume wording.

**Primary — Recruiter / campus hiring lead**  
Needs faster shortlists with explainable evidence.

**Secondary — Reviewer (manual fallback)**  
Handles unsupported stacks, low-confidence AI scores, integrity appeals.

**Personas**

- **Aisha (student):** solid Python project, weak LinkedIn reach; wants a shareable verification report.
- **Rohan (recruiter):** 400 campus applications; needs “Python + project understanding + tests passed” filter.
- **Neha (reviewer):** checks edge cases when Docker execution fails or confidence is low.

---

## 6. MVP vs advanced features

### MVP (hackathon must-ship)

- Auth + roles: student, recruiter, reviewer, admin
- Student profile + project submission (ZIP primary; GitHub URL metadata)
- Static analysis + tech detection + support matrix
- Trusted execution path for a controlled Python sample + limited Python projects (clear labels)
- AI project-specific questions (structured JSON, injection-hardened)
- Timed assessment + autosave + rubric evaluation
- Consent-based optional integrity events (tab blur, paste; camera optional metadata-only)
- Verification report + badge eligibility rules
- Recruiter search/filter + contact request + student accept/reject
- In-app notifications
- Reviewer queue for manual fallback

### Post-MVP / advanced

- Full multi-language Docker sandbox farm
- Deep dependency SCA + malware scanning pipeline
- Camera ML signals (phone/multi-person) with appeal workflow
- Email/SMS notifications
- College admin portals & bulk campus hiring
- Public badge API / embed widgets
- Enterprise SSO, SLAs, paid assessment packs

### Explicitly deferred

- Claiming “definitely AI-written code”
- Auto-fail on single phone detection
- Ranking by demographics

---

## 7. Complete user flow

```
Student register → profile → submit project
  → analysis job (queue)
  → (if supported) sandbox tests
  → AI extracts evidence + generates questions
  → student starts timed assessment (consent)
  → answers autosaved → submit
  → evaluation + integrity summary
  → report + badges (if eligible)
  → student sets visibility

Recruiter register → search by skill/tech/badge
  → view public evidence
  → request contact / invite
  → student accepts/rejects
  → status tracked in both dashboards

Reviewer: queue of failed/unsupported/low-confidence cases → human notes → report update
```

---

## 8. System architecture

### Recommended MVP stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14+ App Router, TypeScript, Tailwind | Fast UI, SSR, one language with backend option |
| Backend API | FastAPI (Python) | Strong for analysis workers, AI, file handling |
| DB | PostgreSQL | Relational integrity for evidence/audit |
| Auth | NextAuth/Auth.js or FastAPI JWT + httpOnly cookies | Sessions + RBAC |
| Queue | Redis + RQ/Celery or DB job table if Redis hard | Background analysis |
| Storage | Local disk (dev) / S3-compatible (prod) | Project ZIPs |
| AI | OpenAI/compatible API with JSON schema | Question gen + grading assist |
| Execution | Docker worker (optional) or trusted demo runner | Never on API process |
| Deploy | Docker Compose locally; Railway/Render/Fly for demo | Judges can run |

**Essential for MVP:** Next.js, FastAPI, Postgres, auth, file upload, job table, LLM API, trusted Python runner.

**Postpone if time-tight:** Redis cluster, full SCA, email, camera ML, multi-language sandboxes.

### High-level diagram

```
[Browser Next.js]
    ↕ HTTPS
[API FastAPI] ── Postgres
    │
    ├── Object storage (ZIPs)
    ├── Job worker (analysis + AI)
    └── Execution worker (Docker/trusted) ── isolated FS, no secrets, limits
```

**Recommended approach:** Next.js + FastAPI + Postgres + job worker + Docker executor when available + OpenAI-compatible LLM.

- Alternative A: All-in Next.js (API routes) + Postgres — faster single repo, weaker isolation.
- Alternative B: Node NestJS API — fine if JS-only preferred.

---

## 9. Database design (logical)

Core tables (UUID PKs unless noted):

- `users` — email, password_hash, role, status, created_at
- `student_profiles` — user_id, headline, bio, visibility, location_opt_in
- `recruiter_profiles` — user_id, company, title, verified_flag
- `projects` — student_id, title, description, source_type (zip/github/url), stack[], contribution, team_members jsonb, setup_notes, status
- `project_files` — project_id, path, size, hash, storage_key
- `technologies` — slug, name, category, support_level
- `project_technologies` — project_id, technology_id
- `analysis_jobs` — project_id, status, started/finished, logs_summary, support_decision
- `test_runs` — job_id, status, duration_ms, stdout/stderr truncated, results jsonb
- `questions` — assessment_id/project_id, category, prompt, evidence_refs jsonb, type
- `assessments` — project_id, student_id, duration_sec, policy_json, status
- `assessment_sessions` — assessment_id, started_at, ends_at, submitted_at
- `answers` — session_id, question_id, content, autosaved_at
- `integrity_events` — session_id, type, severity, metadata, consent_version
- `skill_definitions` — slug, name, criteria_json
- `badges` — student_id, skill_id, badge_uid, evidence_summary, status, issued_at, expires_at
- `verification_reports` — project_id, session_id, scores jsonb, confidence, limitations, review_status
- `recruiter_requests` — recruiter_id, student_id, type, message, status
- `notifications` — user_id, type, payload, read_at
- `consent_records` — user_id, purpose, version, granted_at, revoked_at
- `audit_logs` — actor_id, action, entity, before/after, ip, created_at

**Indexes:** users.email unique; projects.student_id; badges.badge_uid unique; recruiter_requests(student_id,status); technologies.slug.

**Retention (MVP policy):** integrity metadata 30–90 days; raw video off by default; ZIPs retained while project active.

---

## 10. AI evaluation architecture

1. Sanitize & tree-index project (strip secrets patterns, cap file count/size).
2. Extract evidence pack: languages, frameworks, key files, functions, APIs, tests.
3. Treat all file content as **untrusted data** (prompt-injection defense).
4. Generate N questions with required `evidence_refs` (file + symbol). Reject questions without refs.
5. After assessment: score each answer with rubric dimensions + consistency check vs evidence pack.
6. Output structured report sections: Observed | Interpretation | Tests | Human review | Uncertainty.

**Rules**

- AI-generated-code signal = optional soft flag only.
- Low confidence ≠ unskilled.
- Human review if confidence < threshold or integrity severity high.

---

## 11. Secure execution architecture

- Never run uploads in the API container.
- Prefer Docker with: no network, CPU/memory/time limits, read-only root, non-root user, tmpfs workspace, drop capabilities.
- If Docker unavailable: **Trusted Execution Mode** — curated sample + allowlisted simple Python layouts; UI banner required.
- Dangerous patterns blocked at static gate.
- Always delete workspace after run; store truncated logs only.
- Never invent passing tests.

### Support matrix (MVP)

| Tech | Level |
|---|---|
| Python (simple scripts/Flask/FastAPI sample) | Fully / Partially supported |
| HTML/CSS/JS static | Partially (static analysis + questions) |
| React/Next/Node | Manual review / partial analysis |
| Java/C++/C/Go | Analysis + questions; execution manual/not yet |
| ML notebooks | Partial analysis; execution not trusted |
| Arbitrary deps with native builds | Not supported yet → manual review |

---

## 12. Proctoring limitations

- Camera **opt-in only**, explained before assessment.
- Default: event metadata (focus loss, paste, fullscreen exit), not raw video.
- Phone/multi-face ML: out of scope or review-signal only — never auto-proof of cheating.
- Strict mode = configurable policy JSON per assessment.
- Alternatives: no-camera assessment + heavier human review.
- Appeal path via reviewer dashboard.

---

## 13. UI/UX page structure

Brand: **TALENT PROOF** — premium, clean, trustworthy; brand-forward landing; restrained motion; no fake stats.

| # | Page | Role |
|---|---|---|
| 1 | Landing | Public |
| 2–3 | Login / Register | Public |
| 4 | Student dashboard | Student |
| 5 | Student profile | Student |
| 6 | Project submission | Student |
| 7 | Analysis status | Student |
| 8 | Project details | Student |
| 9 | Assessment instructions + consent | Student |
| 10 | Live assessment | Student |
| 11 | Results | Student |
| 12 | Verification report | Student / shared |
| 13 | Skill badges | Student |
| 14 | Badge verification `/verify/:badgeId` | Public |
| 15 | Recruiter dashboard | Recruiter |
| 16 | Candidate search | Recruiter |
| 17 | Candidate profile (respect visibility) | Recruiter |
| 18 | Contact request | Both |
| 19 | Privacy & consent | All |
| 20 | Reviewer dashboard | Reviewer |

---

## 14. Development roadmap

Follow milestones 1→14. Typical 24–48h hackathon compression:

- **Day 0–1:** M1–M4 (setup, UI, auth, submission)
- **Day 1–2:** M5–M8 (analysis, trusted exec, questions, assessment)
- **Day 2:** M9–M11 (integrity lite, badges/report, recruiter)
- **Final:** M12–M14 (tests smoke, deploy, pitch/demo)

**Wait gate:** confirmation after each major milestone.

---

## 15. Hackathon demo plan (5–8 min)

1. Landing → student login (seeded demo account).
2. Upload **real sample Python expense tracker** ZIP.
3. Show detection: Python + structure.
4. Show analysis job → test run results (real).
5. Show generated questions citing real files/functions.
6. Answer 2–3 questions live; submit.
7. Open verification report (scores by category + confidence).
8. Badge issued (e.g., Python Project Understanding).
9. Switch to recruiter → search “Python” → open evidence.
10. Send contact request → student accepts → interview invite.

**Backup:** pre-recorded short clip only if live Docker fails; still show real DB artifacts.

---

## 16. Risks and solutions

| Risk | Mitigation |
|---|---|
| Sandbox too hard in time | Trusted runner + honest labels |
| LLM cost / flaky JSON | Schema validation + cached analysis for demo project |
| Prompt injection via README | Untrusted-data framing + ref validation |
| ZIP bombs / path traversal | Size limits, safe extract, deny `..` |
| Fake-looking product | No mock scores; sample project is real |
| Scope explosion | Freeze MVP list above |
| Privacy controversy | Consent-first integrity; no raw video default |
| Auth bugs | Role middleware + seed users only |

---

## 17. Suggested project folder structure

```text
talent-proof/
  README.md
  docker-compose.yml
  .env.example
  docs/
    PRODUCT_BLUEPRINT.md
    THREAT_MODEL.md
    SUPPORT_MATRIX.md
    DEMO_SCRIPT.md
  apps/
    web/                 # Next.js + Tailwind
      src/app/...
      src/components/...
      src/lib/...
  services/
    api/                 # FastAPI
      app/main.py
      app/api/...
      app/core/...
      app/models/...
      app/schemas/...
      app/services/...
      app/workers/...
    executor/            # isolated runner
      Dockerfile
      runner.py
  sample_projects/
    python_expense_tracker/
  scripts/
    seed.py
    smoke_test.sh
```

---

## Business model (future)

College partnerships, recruiter seats, paid deep assessments, enterprise verification, campus hiring packs. Trust is built by **explainable evidence + limitations**, not job guarantees.

---

## Milestone 0 checklist

- [x] Refined problem & gap
- [x] Personas & competitors
- [x] MVP vs advanced
- [x] End-to-end flow
- [x] Architecture & DB
- [x] AI + secure execution + proctoring limits
- [x] UI map & roadmap
- [x] Demo plan, risks, folder structure

---

**Next step:** Reply **APPROVED** to start Milestone 1 — Project Setup, or request changes first.
