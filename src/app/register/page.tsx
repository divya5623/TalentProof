import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { createSession, getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function registerAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "student");
  if (!name || !email || password.length < 8) redirect("/register?error=invalid");
  if (!["student", "recruiter"].includes(role)) redirect("/register?error=invalid");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/register?error=exists");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      ...(role === "student"
        ? {
            studentProfile: {
              create: {
                headline: "Student developer",
                bio: "",
                visibility: "public",
              },
            },
          }
        : {
            recruiterProfile: {
              create: {
                company: String(formData.get("company") || "Company"),
                title: "Recruiter",
              },
            },
          }),
      consentRecords: {
        create: { purpose: "platform_terms", version: "1.0", granted: true },
      },
    },
  });

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  redirect(role === "recruiter" ? "/recruiter" : "/journey");
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <p className="eyebrow">Create account</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Join Talent Proof</h1>
        <form action={registerAction} className="panel mt-8 space-y-4 p-6">
          {params.error === "exists" && (
            <p className="rounded-md bg-signal-soft px-3 py-2 text-sm text-signal">
              Email already registered.
            </p>
          )}
          {params.error === "invalid" && (
            <p className="rounded-md bg-signal-soft px-3 py-2 text-sm text-signal">
              Check name, email, and password (min 8 chars).
            </p>
          )}
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input className="input" id="name" name="name" required />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input className="input" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input className="input" id="password" name="password" type="password" minLength={8} required />
          </div>
          <div>
            <label className="label" htmlFor="role">
              I am a
            </label>
            <select className="input" id="role" name="role" defaultValue="student">
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="company">
              Company (recruiters)
            </label>
            <input className="input" id="company" name="company" placeholder="Optional for students" />
          </div>
          <button className="btn-primary w-full" type="submit">
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-ink-muted">
          Already registered?{" "}
          <Link href="/login" className="text-seal underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
