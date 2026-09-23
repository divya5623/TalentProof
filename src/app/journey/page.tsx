import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function JourneyIndex() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "student") {
    if (session.role === "recruiter") redirect("/recruiter");
    if (session.role === "reviewer") redirect("/reviewer");
    redirect("/login");
  }

  const student = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  if (!student) redirect("/login");

  const step = student.journeyStep || 1;
  if (step <= 1) redirect("/journey/skills");
  if (step === 2) redirect("/journey/exams");
  if (step === 3) redirect("/journey/projects");
  redirect("/journey/certificate");
}
