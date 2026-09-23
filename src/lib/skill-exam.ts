import { getSkillBySlug, type SkillQuestion } from "./skill-catalog";

export function scoreSkillAnswers(
  questions: SkillQuestion[],
  answers: Record<string, string>
) {
  let earned = 0;
  const details: { id: string; score: number; feedback: string }[] = [];

  for (const q of questions) {
    const raw = (answers[q.id] || "").trim();
    const lower = raw.toLowerCase();
    if (!raw) {
      details.push({ id: q.id, score: 0, feedback: "No answer" });
      continue;
    }

    if (q.type === "mcq") {
      const ok = q.answerKey.some((k) => lower === k.toLowerCase());
      const score = ok ? 100 : 0;
      earned += score;
      details.push({ id: q.id, score, feedback: ok ? "Correct" : "Incorrect" });
      continue;
    }

    const hits = q.answerKey.filter((k) => lower.includes(k.toLowerCase())).length;
    const ratio = hits / Math.max(1, Math.ceil(q.answerKey.length * 0.4));
    const score = Math.min(100, Math.round(ratio * 100));
    earned += score;
    details.push({
      id: q.id,
      score,
      feedback: score >= 60 ? "Matches expected concepts" : "Missing key concepts",
    });
  }

  const overall = questions.length ? Math.round(earned / questions.length) : 0;
  return { overall, details };
}

/** Lightweight AI-likeness heuristic — signal only, never definitive. */
export function estimateAiRisk(answers: Record<string, string>, integrityEvents: { type: string }[]) {
  let risk = 0;
  const texts = Object.values(answers).filter(Boolean);
  for (const t of texts) {
    if (t.length > 400) risk += 0.08;
    if (/as an ai|language model|in conclusion|delve into|multifaceted/i.test(t)) risk += 0.25;
    if ((t.match(/\b(furthermore|moreover|holistic|leverage)\b/gi) || []).length >= 3) risk += 0.12;
  }
  const pastes = integrityEvents.filter((e) => e.type === "paste_blocked" || e.type === "paste").length;
  risk += Math.min(0.35, pastes * 0.08);
  const blurs = integrityEvents.filter((e) => e.type === "tab_blur" || e.type === "focus_lost").length;
  risk += Math.min(0.25, blurs * 0.05);
  return Math.min(0.95, Number(risk.toFixed(2)));
}

export function buildCertificatePayload(student: {
  name: string;
  verifiedSkills: { name: string; score: number }[];
  verifiedProjects: { title: string; score?: number }[];
  overallScore: number;
}) {
  return {
    schema: "talent-proof-certificate-v1",
    holder: student.name,
    overallScore: student.overallScore,
    verifiedSkills: student.verifiedSkills,
    verifiedProjects: student.verifiedProjects,
    disclaimer:
      "This certificate lists only skills/projects verified by Talent Proof exams. It is not a job guarantee or government accreditation.",
    issuedBy: "Talent Proof",
  };
}

export function examForSlug(slug: string) {
  const skill = getSkillBySlug(slug);
  if (!skill) return null;
  return skill;
}
