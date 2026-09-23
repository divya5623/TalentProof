import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/db";
import { formatDate, parseJson } from "@/lib/utils";

export default async function PublicCertificatePage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { certUid: certId },
    include: { student: { include: { user: true } } },
  });
  if (!cert) notFound();

  const skills = parseJson<{ name: string; score: number }[]>(cert.skillsJson, []);
  const projects = parseJson<{ title: string; score?: number }[]>(cert.projectsJson, []);

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="panel border-2 border-seal/40 p-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-seal">Talent Proof Certificate</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            {cert.student.user.name}
          </h1>
          <p className="mt-2 text-ink-muted">verified through Talent Proof exams</p>

          <p className="mt-6 font-display text-5xl font-semibold text-seal">{Math.round(cert.score)}</p>
          <p className="text-sm text-ink-muted">overall verified score</p>

          <div className="mt-8 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Skills</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {skills.length === 0 && <li className="text-ink-muted">None verified</li>}
              {skills.map((s) => (
                <li key={s.name}>
                  ✓ {s.name} ({s.score})
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Projects
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {projects.length === 0 && <li className="text-ink-muted">None verified</li>}
              {projects.map((p) => (
                <li key={p.title}>✓ {p.title}</li>
              ))}
            </ul>
          </div>

          <p className="mt-8 font-mono text-xs text-seal">{cert.certUid}</p>
          <p className="mt-1 text-xs text-ink-muted">Issued {formatDate(cert.issuedAt)}</p>
          <p className="mt-4 text-xs text-ink-muted">
            Not a job guarantee. Only exam-verified claims. Integrity signals are cues, not perfect
            cheating detection.
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-3 print:hidden">
          <PrintButton />
          <Link href="/journey/certificate" className="btn-secondary">
            Back
          </Link>
        </div>
      </main>
    </div>
  );
}
