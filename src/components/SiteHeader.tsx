import Link from "next/link";
import { getSession } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getSession();
  const home =
    session?.role === "recruiter"
      ? "/recruiter"
      : session?.role === "reviewer"
        ? "/reviewer"
        : session
          ? "/journey"
          : "/";

  return (
    <header className="border-b border-paper-line/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href={home} className="font-display text-lg font-semibold tracking-tight text-ink">
          Talent <span className="text-seal">Proof</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {!session && (
            <>
              <Link href="/login" className="btn-primary">
                Log in
              </Link>
            </>
          )}
          {session && (
            <>
              <span className="hidden text-xs text-ink-muted sm:inline">
                {session.role === "student"
                  ? "Student"
                  : session.role === "recruiter"
                    ? "Recruiter"
                    : "Reviewer"}
              </span>
              <form action="/api/auth/logout" method="post">
                <button className="btn-secondary" type="submit">
                  Log out
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
