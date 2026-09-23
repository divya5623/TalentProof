import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { JourneyProgress } from "@/components/JourneyProgress";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildCertificatePayload } from "@/lib/skill-exam";
import { parseJson } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

async function issueCertificate() {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: {
      user: true,
      claimedSkills: true,
      projects: { include: { reports: true } },
      certificates: true,
    },
  });
  if (!student) redirect("/login");

  const verifiedSkills = student.claimedSkills
    .filter((c) => c.status === "verified")
    .map((c) => ({ name: c.skillName, score: c.score || 0 }));

  const verifiedProjects = student.projects
    .filter((p) => p.status === "completed")
    .map((p) => {
      const r = p.reports[0];
      let score = 70;
      if (r) {
        score = parseJson<{ overall: number }>(r.scoresJson, { overall: 70 }).overall;
      }
      return { title: p.title, score };
    });

  const payload = buildCertificatePayload({
    name: student.user.name,
    verifiedSkills,
    verifiedProjects,
    overallScore: student.overallScore,
  });

  let cert = student.certificates[0];
  if (!cert) {
    cert = await prisma.certificate.create({
      data: {
        studentId: student.id,
        certUid: `TP-CERT-${uuidv4().slice(0, 8).toUpperCase()}`,
        score: student.overallScore,
        skillsJson: JSON.stringify(verifiedSkills),
        projectsJson: JSON.stringify(verifiedProjects),
        summaryJson: JSON.stringify(payload),
      },
    });
  } else {
    cert = await prisma.certificate.update({
      where: { id: cert.id },
      data: {
        score: student.overallScore,
        skillsJson: JSON.stringify(verifiedSkills),
        projectsJson: JSON.stringify(verifiedProjects),
        summaryJson: JSON.stringify(payload),
      },
    });
  }

  redirect(`/certificate/${cert.certUid}`);
}

export default async function CertificateStepPage() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: {
      claimedSkills: true,
      projects: { include: { reports: true } },
      certificates: true,
      user: true,
    },
  });
  if (!student) redirect("/login");
  if (student.journeyStep < 4) redirect("/journey");

  const verifiedSkills = student.claimedSkills.filter((c) => c.status === "verified");
  const verifiedProjects = student.projects.filter((p) => p.status === "completed");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <JourneyProgress step={4} />
        <h1 className="font-display text-3xl font-semibold">Your certificate</h1>
        <p className="mt-2 text-ink-muted">
          Only skills and projects you <strong>passed</strong> appear here. Download / share after
          issuing.
        </p>

        <div className="panel mt-6 p-6">
          <p className="text-sm text-ink-muted">Overall score</p>
          <p className="font-display text-5xl font-semibold text-seal">{student.overallScore}</p>
          <p className="mt-1 text-xs text-ink-muted">Average of verified exams</p>

          <h2 className="mt-6 font-display text-lg font-semibold">Verified skills</h2>
          {verifiedSkills.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">None yet — pass skill exams in step 2.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {verifiedSkills.map((s) => (
                <li key={s.id}>
                  ✓ {s.skillName} · {s.score}
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-6 font-display text-lg font-semibold">Verified projects</h2>
          {verifiedProjects.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">None yet — complete a project quiz in step 3.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {verifiedProjects.map((p) => (
                <li key={p.id}>✓ {p.title}</li>
              ))}
            </ul>
          )}
        </div>

        <form action={issueCertificate} className="mt-6">
          <button className="btn-primary w-full py-3 text-base" type="submit">
            Issue & open certificate →
          </button>
        </form>

        {student.certificates[0] && (
          <p className="mt-4 text-center text-sm">
            <Link
              href={`/certificate/${student.certificates[0].certUid}`}
              className="text-seal underline"
            >
              Open existing certificate
            </Link>
          </p>
        )}

        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link href="/journey/projects" className="underline">
            ← Back to projects
          </Link>
        </p>
      </main>
    </div>
  );
}
