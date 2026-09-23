import fs from "fs/promises";
import path from "path";
import { prisma } from "./db";
import {
  generateProjectQuestions,
  runTrustedPythonTests,
  safeExtractInfo,
  scoreAnswer,
} from "./analysis";
import { parseJson } from "./utils";
import { v4 as uuidv4 } from "uuid";

export async function runProjectPipeline(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || !project.storagePath) throw new Error("Project missing storage");

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "analyzing" },
  });

  const job = await prisma.analysisJob.create({
    data: {
      projectId,
      status: "running",
      startedAt: new Date(),
    },
  });

  const evidence = await safeExtractInfo(project.storagePath);
  await prisma.analysisJob.update({
    where: { id: job.id },
    data: {
      status: "completed",
      finishedAt: new Date(),
      supportDecision: evidence.supportLevel,
      summary: evidence.supportReason,
      evidenceJson: JSON.stringify(evidence),
    },
  });

  let testStatus = "skipped";
  if (
    evidence.supportLevel === "fully_supported" &&
    evidence.languages.includes("Python") &&
    evidence.securityNotes.length === 0
  ) {
    const testResult = await runTrustedPythonTests(project.storagePath);
    testStatus = testResult.status;
    await prisma.testRun.create({
      data: {
        projectId,
        status: testResult.status,
        durationMs: testResult.durationMs,
        resultsJson: JSON.stringify(testResult.results),
        stdout: testResult.stdout,
        stderr: testResult.stderr,
        mode: testResult.mode,
      },
    });
  } else {
    await prisma.testRun.create({
      data: {
        projectId,
        status: "skipped",
        durationMs: 0,
        resultsJson: JSON.stringify([
          {
            name: "execution",
            status: "skipped",
            detail: evidence.supportReason,
          },
        ]),
        stdout: "",
        stderr: "",
        mode: "trusted",
      },
    });
  }

  const generated = generateProjectQuestions(evidence);
  const assessment = await prisma.assessment.create({
    data: {
      projectId,
      durationSec: 900,
      status: "ready",
      policyJson: JSON.stringify({
        cameraRequired: false,
        strictMode: false,
        autoTerminate: false,
        integritySignals: ["tab_blur", "paste", "fullscreen_exit"],
      }),
      questions: {
        create: generated.map((q) => ({
          category: q.category,
          qtype: q.qtype,
          prompt: q.prompt,
          evidenceRefs: JSON.stringify(q.evidenceRefs),
          optionsJson: JSON.stringify(q.options || []),
          rubricJson: JSON.stringify(q.rubric),
          orderIndex: q.orderIndex,
        })),
      },
    },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      status: evidence.supportLevel === "manual_review" || evidence.supportLevel === "not_supported"
        ? "manual_review"
        : "ready",
      supportLevel: evidence.supportLevel,
      detectedStack: JSON.stringify([
        ...evidence.languages,
        ...evidence.frameworks,
      ]),
      analysisJson: JSON.stringify({
        evidence,
        assessmentId: assessment.id,
        testStatus,
      }),
    },
  });

  return { evidence, assessmentId: assessment.id, testStatus };
}

export async function evaluateSession(sessionId: string) {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      answers: { include: { question: true } },
      integrityEvents: true,
      assessment: { include: { project: true } },
    },
  });
  if (!session) throw new Error("Session not found");

  const scored = session.answers.map((a) => {
    const result = scoreAnswer(a.question.prompt, a.content, a.question.category);
    return { ...a, ...result };
  });

  for (const item of scored) {
    await prisma.answer.update({
      where: { id: item.id },
      data: { score: item.score, feedback: item.feedback },
    });
  }

  const byCategory: Record<string, number[]> = {};
  for (const item of scored) {
    byCategory[item.question.category] = byCategory[item.question.category] || [];
    byCategory[item.question.category].push(item.score);
  }
  const categoryScores = Object.fromEntries(
    Object.entries(byCategory).map(([k, vals]) => [
      k,
      Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    ])
  );
  const overall =
    scored.length === 0
      ? 0
      : Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length);

  const testRun = await prisma.testRun.findFirst({
    where: { projectId: session.assessment.projectId },
    orderBy: { createdAt: "desc" },
  });

  const seriousIntegrity = session.integrityEvents.filter((e) => e.severity === "review").length;
  const warningIntegrity = session.integrityEvents.filter((e) => e.severity === "warning").length;
  const confidence = Math.max(
    0.35,
    Math.min(0.92, 0.55 + scored.length * 0.04 - seriousIntegrity * 0.15 - warningIntegrity * 0.03)
  );

  const project = session.assessment.project;
  const student = await prisma.studentProfile.findUnique({ where: { id: project.studentId } });
  if (!student) throw new Error("Student missing");

  const report = await prisma.verificationReport.upsert({
    where: { sessionId },
    create: {
      projectId: project.id,
      studentId: student.id,
      sessionId,
      scoresJson: JSON.stringify({
        overall,
        categories: categoryScores,
        tests: testRun?.status || "unknown",
      }),
      confidence,
      evidenceJson: JSON.stringify({
        observed: parseJson(project.analysisJson, {} as Record<string, unknown>),
        answersScored: scored.length,
        integrityEvents: session.integrityEvents.map((e) => ({
          type: e.type,
          severity: e.severity,
          at: e.createdAt,
        })),
      }),
      limitations:
        "Scores reflect rubric alignment with the submitted project, not employability guarantees. Integrity signals are review cues, not proof of cheating. Confidence below 0.6 should be human-reviewed.",
      reviewStatus: confidence < 0.6 || seriousIntegrity > 0 ? "needs_review" : "auto",
    },
    update: {
      scoresJson: JSON.stringify({
        overall,
        categories: categoryScores,
        tests: testRun?.status || "unknown",
      }),
      confidence,
      reviewStatus: confidence < 0.6 || seriousIntegrity > 0 ? "needs_review" : "auto",
    },
  });

  await prisma.assessment.update({
    where: { id: session.assessmentId },
    data: { status: "evaluated" },
  });
  await prisma.project.update({
    where: { id: project.id },
    data: { status: "completed" },
  });

  // Badge eligibility
  const skills = await prisma.skillDefinition.findMany();
  const testsOk = testRun?.status === "passed" || testRun?.status === "skipped";
  const understandingOk = overall >= 70 && seriousIntegrity === 0;

  for (const skill of skills) {
    let eligible = false;
    let summary = "";
    if (skill.slug === "python-project-understanding") {
      eligible =
        project.detectedStack.includes("Python") &&
        testsOk &&
        understandingOk &&
        scored.length > 0;
      summary = `Overall ${overall}/100 · tests ${testRun?.status} · confidence ${confidence.toFixed(2)}`;
    }
    if (skill.slug === "debugging-skills") {
      const debugScore = categoryScores["Debugging"] ?? 0;
      eligible = debugScore >= 65;
      summary = `Debugging category ${debugScore}/100`;
    }
    if (skill.slug === "secure-coding") {
      const sec = categoryScores["Security"] ?? 0;
      eligible = sec >= 60;
      summary = `Security category ${sec}/100`;
    }
    if (!eligible) continue;

    const existing = await prisma.badge.findFirst({
      where: { studentId: student.id, skillId: skill.id, status: "issued" },
    });
    if (existing) continue;

    await prisma.badge.create({
      data: {
        badgeUid: `TP-${uuidv4().slice(0, 8).toUpperCase()}`,
        studentId: student.id,
        skillId: skill.id,
        evidenceSummary: summary,
        limitations:
          "Badge indicates assessment evidence for this project only. Not a professional certification or job guarantee.",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      },
    });
  }

  return report;
}

export async function ensureUploadDir() {
  const dir = path.join(process.cwd(), "storage", "uploads");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function copySampleProjectToStorage(projectId: string) {
  const uploadRoot = await ensureUploadDir();
  const dest = path.join(uploadRoot, projectId);
  const src = path.join(process.cwd(), "sample_projects", "python_expense_tracker");
  await fs.mkdir(dest, { recursive: true });
  await copyDir(src, dest);
  return dest;
}

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fs.copyFile(from, to);
  }
}
