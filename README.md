
# 🚀 SkillBridge AI

### Prove Your Skills. Showcase Your Potential.

> An agentic AI-powered platform that analyzes student projects, conducts adaptive technical assessments, and generates evidence-based skill reports for HR recruiters.

[![Status](https://img.shields.io/badge/Status-In%20Development-orange)]()
[![Theme](https://img.shields.io/badge/Theme-Agentic%20AI-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 📌 Overview

Many students build impressive projects but struggle to demonstrate their actual technical knowledge to recruiters.

Traditional resumes and certificates do not always reveal whether a student understands their implementation. Meanwhile, recruiters need efficient and structured ways to evaluate practical technical skills.

**SkillBridge AI** addresses this challenge by connecting student project analysis with adaptive AI-powered technical assessments.

The platform analyzes a student's actual code, generates project-specific questions, evaluates responses, and creates a transparent skill evidence report for HR review.

---

## 🎯 Problem Statement

Students often face difficulties proving their practical coding skills beyond resumes and certificates.

Recruiters also spend significant time evaluating project contributions, coding knowledge, and technical understanding through manual assessments.

There is a need for a platform that can:

- Analyze real student projects.
- Generate relevant technical questions.
- Evaluate project understanding.
- Provide evidence-backed skill insights.
- Support recruiters with structured candidate information.

---

## 💡 Our Solution

SkillBridge AI provides an end-to-end student skill verification workflow:

```text
Student Submits Project
          ↓
Source Code Analysis
          ↓
Feature & Skill Identification
          ↓
Project-Specific Question Generation
          ↓
Adaptive AI Technical Interview
          ↓
Answer Evaluation
          ↓
Evidence-Based Skill Report
          ↓
HR Recruiter Review
```

Our goal is not to replace human recruitment decisions. Instead, we provide structured evidence that helps recruiters review candidates more efficiently.

---

## ✨ Key Features

### 👨‍🎓 Student Dashboard

- Student authentication.
- Project submission.
- GitHub repository integration.
- Project analysis status.
- Assessment progress.
- Skill evidence overview.
- Learning roadmap.
- Generated assessment reports.

### 🤖 Agentic AI Assessment

- Understands the submitted project's implementation.
- Generates questions based on actual code evidence.
- Asks adaptive follow-up questions.
- Includes conceptual, debugging, and edge-case questions.
- Uses structured evaluation rubrics.
- Links assessment questions to project evidence.

### 🔍 Code Evidence Engine

- Detects programming languages and frameworks.
- Extracts functions, classes, APIs, and relevant concepts.
- Identifies implementation patterns.
- Links observations to source files and line references.
- Separates detected evidence from unsupported assumptions.

### 🧪 Technical Assessment

- Project-specific questions.
- Conceptual understanding checks.
- Debugging challenges.
- Edge-case reasoning.
- Answer evaluation.
- Transparent assessment results.

### 🏢 HR Dashboard

- Candidate overview.
- Project and technology information.
- Skill evidence review.
- Assessment summaries.
- Recruiter notes.
- Evidence-based candidate comparison support.

> SkillBridge AI is designed to support human decision-making, not automatically reject or select candidates.

---

## 🧠 What Makes SkillBridge AI Different?

Most basic AI interview tools generate generic questions.

SkillBridge AI aims to connect:

```text
Actual Student Code
       ↓
Extracted Evidence
       ↓
Relevant Technical Question
       ↓
Student Answer
       ↓
Adaptive Follow-up
       ↓
Traceable Assessment Report
```

This helps evaluate whether students can explain and reason about their own implementations.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │    Student Portal    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Project Submission  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Repository Validator │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Code Analysis Engine│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Project Evidence Map │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Question Generation  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Adaptive Assessment │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Evidence Report      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     HR Dashboard     │
                    └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend

- FastAPI
- Python
- REST APIs

### Database & Authentication

- PostgreSQL
- Supabase
- Supabase Authentication
- Row Level Security

### Code Analysis

- Python AST
- Tree-sitter
- Static analysis tools
- Test execution infrastructure

### AI Layer

- Evidence-grounded question generation
- Adaptive question selection
- Structured answer evaluation
- Rubric-based assessment

> The initial prototype will focus on Python projects. Support for additional languages can be added incrementally.

---

## 🔐 Security and Privacy

Source code and student information must be treated as sensitive user data.

Security principles:

- Authenticated access.
- Role-based authorization.
- Student-specific data isolation.
- Secure repository handling.
- Sandboxed code execution.
- CPU, memory, and execution-time limits.
- No unrestricted network access during code execution.
- Secret and credential detection.
- No frontend exposure of private API keys.
- Human review for important recruitment decisions.

AI-generated assessments should include evidence and limitations rather than unsupported claims.

---

## 👥 User Roles

### Student

- Create an account.
- Submit projects.
- View code analysis.
- Complete technical assessments.
- Review skill evidence.
- Access generated reports.

### HR / Recruiter

- Access authorized candidate information.
- Review project evidence.
- View assessment summaries.
- Add recruiter notes.
- Support structured candidate evaluation.

---

## 📂 Planned Project Structure

```text
skillbridge-ai/
│
├── app/
│   ├── student/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── assessment/
│   │   └── reports/
│   │
│   └── hr/
│       ├── dashboard/
│       └── candidates/
│
├── components/
│   ├── student/
│   ├── hr/
│   ├── shared/
│   └── ui/
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── analysis_engine/
│   └── tests/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── AI_EVALUATION.md
│
└── README.md
```

---

## 🔄 Product Workflow

### Student Workflow

1. Register or log in.
2. Submit a project or connect a GitHub repository.
3. Wait for code analysis.
4. Review identified technologies and evidence.
5. Complete the adaptive technical assessment.
6. Review the generated skill evidence report.

### HR Workflow

1. Log in to the HR dashboard.
2. Review authorized candidate profiles.
3. Inspect projects and demonstrated technologies.
4. Review assessment answers and supporting evidence.
5. Add notes for further evaluation.

---

## 🚧 Development Roadmap

### Phase 1 — Foundation

- [ ] Project setup.
- [ ] Authentication.
- [ ] Role-based access.
- [ ] Student dashboard.
- [ ] HR dashboard layout.

### Phase 2 — Project Management

- [ ] Project submission.
- [ ] GitHub repository integration.
- [ ] File validation.
- [ ] Project status tracking.

### Phase 3 — Code Analysis

- [ ] Python code parsing.
- [ ] Function and class extraction.
- [ ] Technology detection.
- [ ] Evidence mapping.
- [ ] Secure test execution.

### Phase 4 — AI Assessment

- [ ] Grounded question generation.
- [ ] Question validation.
- [ ] Adaptive follow-up questions.
- [ ] Answer evaluation.
- [ ] Debugging challenges.

### Phase 5 — Reports and HR

- [ ] Evidence report generation.
- [ ] HR candidate review.
- [ ] Recruiter notes.
- [ ] Privacy and authorization review.

### Phase 6 — Testing and Deployment

- [ ] Unit testing.
- [ ] Integration testing.
- [ ] Security testing.
- [ ] Performance testing.
- [ ] Production deployment.

---

## 🧪 Example Assessment

### Submitted Project

A Python FastAPI task-management API.

### Detected Evidence

- FastAPI application.
- POST endpoint.
- GET endpoint.
- In-memory list storage.
- Task creation function.

### Generated Question

**Why did you use an in-memory list to store tasks, and what problems might occur when the application restarts?**

### Follow-up Question

**How would you modify your implementation to support persistent storage using a database?**

Questions should be generated only when the relevant implementation is supported by the project evidence.

---

## 🌍 Expected Impact

SkillBridge AI aims to:

- Help students demonstrate practical technical skills.
- Encourage deeper understanding of project implementations.
- Provide recruiters with structured evidence.
- Reduce repetitive assessment work.
- Improve transparency in technical evaluation.
- Support students in identifying learning gaps.

---

## 📊 Project Status

🚧 **Currently in Development**

The initial version is being developed as a prototype focused on student project analysis, adaptive technical assessments, and HR evidence review.

---

## 🤝 Contribution

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your changes.
5. Open a pull request.

Please avoid committing:

- API keys.
- Passwords.
- Access tokens.
- Private student information.
- Environment configuration secrets.

---

## 📄 License

This project will be licensed under the MIT License when the license file is added.

---

## 🚀 Vision

**Move beyond resumes. Help students prove what they can actually build and explain.**

SkillBridge AI connects student projects, adaptive technical assessments, and transparent evidence to support better skill discovery.
