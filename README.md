
# 🔐 Verified
### Don't Trust the Claim. Verify the Skill.

> An AI-powered skill verification and talent discovery platform that helps students demonstrate their genuine technical capabilities through coding assessments, GitHub project analysis, and adaptive technical interviews.

---

## 🌟 Overview

**Verified** is an AI-powered platform designed to bridge the gap between student resumes and demonstrable technical skills.

Students can select a technical skill, complete a skill-specific assessment, submit their GitHub projects, and participate in AI-powered technical questioning.

Companies can discover candidates based on demonstrated skills, assessment evidence, and project understanding.

Our goal is to help organizations evaluate practical capabilities beyond traditional resumes and self-reported skills.

---

## 🎯 Problem Statement

Students build projects, learn programming languages, and develop technical skills, but companies often face challenges in evaluating whether candidates genuinely understand the work they claim.

Traditional resumes, certificates, and basic screening methods may not fully demonstrate:

- Practical programming ability.
- Logical and algorithmic thinking.
- Project implementation knowledge.
- Debugging and problem-solving ability.
- Understanding of AI-assisted code.

At the same time, companies spend significant time identifying suitable candidates for technical roles.

**Verified aims to connect practical skill assessment with evidence-based talent discovery.**

---

## 💡 Our Solution

Verified provides two primary assessment pathways:

### 1️⃣ Programming Language Coding Assessment

Students select a programming language and difficulty level:

- Basic
- Intermediate
- Advanced

They then complete a coding assessment designed to evaluate programming ability, logical thinking, and problem-solving.

### 2️⃣ GitHub Project-Based AI Interview

Students submit a GitHub repository.

AI analyzes the submitted project and generates questions based on the actual implementation.

The AI interviewer asks technical questions, follow-ups, and project-specific challenges to evaluate the student's understanding.

---

## 🚀 Core Features

### 👨‍💻 Student Platform

- Student registration and login.
- Skill selection dashboard.
- Programming language selection.
- Other technical skill categories.
- Basic, Intermediate, and Advanced assessments.
- Coding examination workflow.
- GitHub repository submission.
- Project-specific AI interviews.
- Skill verification and badges.
- Role-based candidate visibility.

### 🧠 Programming Language Assessment

The coding assessment is designed to evaluate:

- Coding ability.
- Logical thinking.
- Algorithmic problem-solving.
- Code correctness.
- Assessment completion time.
- Understanding of programming concepts.

The platform is designed around a strict examination environment with assessment monitoring and integrity controls.

Potential monitoring features include:

- Camera access.
- Session timing.
- Tab visibility monitoring.
- Copy and paste activity detection.
- Phone presence detection where technically feasible.
- Assessment termination according to defined rules.

> **Important:** Browser-based monitoring cannot guarantee that all external devices, tabs, or AI tools are blocked. Monitoring must be implemented with appropriate security, privacy, and consent safeguards.

### 🔍 GitHub Repository Analysis

Students can submit a GitHub repository for project-based evaluation.

The platform can analyze, where evidence is available:

- Programming languages.
- Project structure.
- Frameworks and dependencies.
- Code organization.
- Implementation patterns.
- Error handling.
- Documentation.
- Testing.
- Project architecture.
- Potential security issues.
- Project functionality where execution is supported.

The analysis is used to generate relevant technical questions.

### 🤖 AI-Powered Technical Interview

The AI agent generates questions based on the student's submitted project.

Example questions:

- Why did you choose this technology?
- Explain the function you implemented.
- What happens if the database connection fails?
- Why did you use this algorithm?
- How would you improve this implementation?
- Can you modify this function for a new requirement?
- What are the limitations of your project?

The interviewer can ask follow-up questions based on the student's responses.

### 🏅 Skill Verification

The platform supports skill-specific evaluation and evidence-based reports.

Potential skill categories include:

- Programming Languages.
- Data Structures and Algorithms.
- Backend Development.
- Frontend Development.
- Databases.
- Cloud Computing.
- AI / Machine Learning.
- DevOps.
- Other Technical Skills.

Badges and reports should reflect the defined assessment criteria and available evidence.

### 🏢 Recruiter Platform

Companies can:

- Register and log in.
- Define technical role requirements.
- Discover candidates based on relevant skills.
- Review project evidence.
- View assessment reports.
- Shortlist candidates.
- Send interview invitations.
- Contact candidates through the platform.

### 📊 Role-Based Candidate Dashboard

The platform can display selected certified candidates for specific technical roles.

The dashboard is intended to help companies identify candidates who satisfy the platform's defined assessment and verification requirements.

Candidate visibility should be based on transparent criteria and should not imply guaranteed employment.

---

## 🔄 Complete User Workflow

```text
                    ┌───────────────────────┐
                    │    Login / Signup     │
                    └───────────┬───────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐             ┌────────▼────────┐
        │    Student     │             │ Company / Recruiter │
        └───────┬────────┘             └─────────────────┘
                │
        ┌───────▼────────────┐
        │  Select Skill      │
        └───────┬────────────┘
                │
       ┌────────┴─────────┐
       │                  │
┌──────▼─────────┐ ┌──────▼──────────────┐
│ Programming    │ │ Other Technical    │
│ Languages      │ │ Skills              │
└──────┬─────────┘ └──────┬──────────────┘
       │                  │
┌──────▼─────────┐ ┌──────▼──────────────┐
│ Select Language│ │ Select Skill        │
└──────┬─────────┘ └──────┬──────────────┘
       │                  │
┌──────▼─────────┐ ┌──────▼──────────────┐
│ Basic /        │ │ Skill-Specific      │
│ Intermediate / │ │ Assessment          │
│ Advanced       │ └─────────────────────┘
└──────┬─────────┘
       │
┌──────▼─────────────────────────┐
│ Coding Assessment              │
│ Camera / Timing / Integrity    │
│ Logical Thinking / Code Review │
└──────┬─────────────────────────┘
       │
       └──────────────┐
                      │
              ┌───────▼──────────────┐
              │ GitHub Project Path  │
              │ Repository Upload    │
              └───────┬──────────────┘
                      │
              ┌───────▼──────────────┐
              │ AI Code Analysis     │
              └───────┬──────────────┘
                      │
              ┌───────▼──────────────┐
              │ Project-Based AI     │
              │ Technical Interview  │
              └───────┬──────────────┘
                      │
              ┌───────▼──────────────┐
              │ Evidence & Skill     │
              │ Verification         │
              └───────┬──────────────┘
                      │
              ┌───────▼──────────────┐
              │ Skill Badge / Report │
              └───────┬──────────────┘
                      │
              ┌───────▼──────────────┐
              │ Role-Based Dashboard │
              └───────┬──────────────┘
                      │
              ┌───────▼──────────────┐
              │ Recruiter Review &   │
              │ Interview Invitation │
              └──────────────────────┘
```

---

## 🧩 AI Agent Architecture

| Agent | Responsibility |
|---|---|
| Repository Analysis Agent | Analyzes submitted GitHub projects |
| Code Understanding Agent | Extracts implementation details and possible questions |
| Question Generation Agent | Creates skill- and project-specific questions |
| Interview Agent | Conducts interactive technical questioning |
| Follow-Up Agent | Generates follow-up questions based on answers |
| Evaluation Agent | Applies defined rubrics to assessment responses |
| Evidence Report Agent | Produces evidence-based verification reports |

Agents should operate with clear responsibilities, controlled inputs, and appropriate validation.

---

## 🛠️ Planned Technology Stack

> The stack below is a proposed implementation direction and may change during development.

| Layer | Planned Technology |
|---|---|
| Frontend | Next.js / React |
| Styling | Tailwind CSS |
| Backend | FastAPI or Node.js |
| Database | PostgreSQL |
| Authentication | Secure session-based authentication / OAuth |
| GitHub Integration | GitHub API |
| AI Integration | LLM-based analysis and interview services |
| Code Execution | Isolated sandbox environment |
| Deployment | Cloud hosting |
| Monitoring | Application logs and audit trails |

---

## 🔒 Security & Privacy

Security is a core requirement because the platform processes student code, assessment results, and potentially sensitive information.

Security considerations include:

- Secure authentication.
- Authorization and role-based access control.
- GitHub OAuth token protection.
- Secure repository access.
- Secret detection.
- Untrusted code sandboxing.
- Resource and execution limits.
- Network restrictions during code execution.
- Prompt injection protection.
- AI output validation.
- Assessment data protection.
- Privacy-conscious camera and monitoring controls.
- Audit logging.
- Secure handling of recruiter access.

### Assessment Integrity

The platform should use monitoring and examination controls to support assessment integrity.

However:

- Camera presence does not prove identity or attention.
- Copy/paste detection alone does not prove cheating.
- Phone detection may be technically limited.
- AI detection cannot reliably prove authorship.
- Automated termination should include safeguards and clear rules.

Assessment results should be reviewed using multiple evidence sources.

---

## 📈 Future Vision

Verified aims to develop a practical bridge between:

```text
Student Skills
      ↓
Practical Assessments
      ↓
Project Understanding
      ↓
Evidence-Based Reports
      ↓
Recruiter Discovery
      ↓
Technical Interview Opportunities
```

The platform can expand into:

- University partnerships.
- Skill-based talent discovery.
- Industry-specific assessments.
- Additional technical domains.
- More advanced project evaluations.
- Recruiter workflow integrations.

---

## 🎯 Hackathon MVP

The initial MVP will focus on demonstrating the core workflow:

1. Student login.
2. Skill selection.
3. Programming language selection.
4. Difficulty selection.
5. Coding assessment interface.
6. GitHub repository submission.
7. AI repository analysis.
8. Project-specific technical questions.
9. Evidence-based assessment report.
10. Basic skill badge.
11. Role-based candidate dashboard.

The MVP should prioritize functional demonstrations over unsupported claims of complete automated verification.

---

## ⚖️ Responsible Evaluation

Verified is designed to support skill discovery, not replace human judgment.

We aim to:

- Evaluate practical skills fairly.
- Avoid treating AI-generated code as automatic evidence of dishonesty.
- Distinguish verified evidence from inferred skills.
- Reduce bias in technical evaluation.
- Protect student privacy.
- Provide transparency around assessment results.
- Support human review where appropriate.

---

## 🌍 Vision

> **Make technical skills more demonstrable, assessments more evidence-based, and talent discovery more accessible.**

Verified aims to help students showcase what they can actually understand and build, while helping companies explore candidates through relevant technical evidence.

---

## 📌 Project Status

🚧 **Under Development**

This project is being developed as an AI-powered skill verification and talent discovery platform.

Features, technology choices, and evaluation methods may evolve throughout development.

---

## 👩‍💻 Contributors

Built with ❤️ by the development team.

---

## 📄 License

License to be determined.
