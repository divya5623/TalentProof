import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/** Student home is the journey wizard */
export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "recruiter") redirect("/recruiter");
  if (session.role === "reviewer") redirect("/reviewer");
  redirect("/journey");
}
