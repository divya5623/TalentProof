import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { friendlyStatus } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

async function respond(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/login");
  const id = String(formData.get("id"));
  const decision = String(formData.get("decision"));
  const req = await prisma.contactRequest.findUnique({ where: { id } });
  if (!req) redirect("/dashboard");
  if (session.role === "student" && req.studentId !== session.id) redirect("/dashboard");

  const status = decision === "accept" ? "accepted" : "rejected";
  await prisma.contactRequest.update({ where: { id }, data: { status } });

  await prisma.notification.create({
    data: {
      userId: req.recruiterId,
      type: "contact_response",
      title: status === "accepted" ? "Request accepted" : "Request declined",
      body: `Student ${status} your ${req.type} request.`,
      payload: JSON.stringify({ requestId: id }),
    },
  });

  redirect(`/contact/${id}`);
}

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;

  const req = await prisma.contactRequest.findUnique({
    where: { id },
    include: {
      recruiter: { include: { recruiterProfile: true } },
      student: true,
    },
  });
  if (!req) notFound();
  if (session.id !== req.recruiterId && session.id !== req.studentId) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">
          {req.type === "interview" ? "Interview invite" : "Contact request"}
        </h1>

        <div className="panel mt-6 space-y-3 p-6 text-sm">
          <p>
            <span className="text-ink-muted">From: </span>
            <strong>
              {req.recruiter.name}
              {req.recruiter.recruiterProfile ? ` · ${req.recruiter.recruiterProfile.company}` : ""}
            </strong>
          </p>
          <p>
            <span className="text-ink-muted">To: </span>
            <strong>{req.student.name}</strong>
          </p>
          <p>
            <span className="text-ink-muted">Status: </span>
            {friendlyStatus(req.status)}
          </p>
          <p className="rounded-md bg-paper p-3 text-ink-soft">{req.message}</p>
          <p className="text-xs text-ink-muted">{formatDate(req.createdAt)}</p>
          <p className="text-xs text-ink-muted">Your email is hidden until you accept.</p>
        </div>

        {session.role === "student" && req.status === "pending" && (
          <form action={respond} className="mt-6 grid grid-cols-2 gap-3">
            <input type="hidden" name="id" value={req.id} />
            <button className="btn-primary py-3" name="decision" value="accept" type="submit">
              Yes, OK
            </button>
            <button className="btn-secondary py-3" name="decision" value="reject" type="submit">
              No thanks
            </button>
          </form>
        )}

        <Link
          href={session.role === "recruiter" ? "/recruiter" : "/dashboard"}
          className="btn-ghost mt-6 inline-flex"
        >
          ← Back
        </Link>
      </main>
    </div>
  );
}
