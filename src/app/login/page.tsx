import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoLoginButtons } from "@/components/DemoLoginButtons";
import { SiteHeader } from "@/components/SiteHeader";
import { createSession, getSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect("/login?error=invalid");
  }
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  if (user.role === "recruiter") redirect("/recruiter");
  if (user.role === "reviewer") redirect("/reviewer");
  redirect("/journey");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) {
    if (session.role === "recruiter") redirect("/recruiter");
    if (session.role === "reviewer") redirect("/reviewer");
    redirect("/journey");
  }
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Log in</h1>
        <p className="mt-2 text-ink-muted">Use a demo button below, then click Log in.</p>

        <form action={loginAction} className="panel mt-6 space-y-4 p-6">
          {params.error && (
            <p className="rounded-md bg-signal-soft px-3 py-2 text-sm text-signal">
              Wrong email or password. Try a demo button below.
            </p>
          )}
          <DemoLoginButtons />
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input className="input" id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn-primary w-full py-3 text-base" type="submit">
            Log in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ink-muted">
          New here?{" "}
          <Link href="/register" className="font-medium text-seal underline">
            Create account
          </Link>
        </p>
      </main>
    </div>
  );
}
