import Link from "next/link";
import { getSession } from "@/lib/auth";

const studentLinks = [
  { href: "/journey", label: "Home" },
  { href: "/journey/skills", label: "Skills" },
  { href: "/journey/exams", label: "Exams" },
  { href: "/journey/projects", label: "Projects" },
  { href: "/journey/certificate", label: "Certificate" },
];

const hrLinks = [
  { href: "/recruiter", label: "Overview" },
  { href: "/recruiter/talent", label: "Find talent" },
  { href: "/recruiter/shortlists", label: "Shortlists" },
];

export async function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  const session = await getSession();
  if (!session) {
    return <>{children}</>;
  }

  const links = session.role === "recruiter" ? hrLinks : studentLinks;
  const home = session.role === "recruiter" ? "/recruiter" : "/journey";

  return (
    <div className="min-h-screen">
      <header className="border-b border-paper-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href={home} className="font-display text-lg font-semibold text-ink">
            Talent <span className="text-seal">Proof</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {links.map((l) => {
                const isActive =
                  l.href === "/recruiter" || l.href === "/journey"
                    ? active === l.href
                    : active === l.href || Boolean(active?.startsWith(l.href + "/"));
                return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 ${
                  isActive
                    ? "bg-seal-soft font-medium text-seal-deep"
                    : "text-ink-muted hover:bg-paper"
                }`}
              >
                {l.label}
              </Link>
                );
              })}
            <span className="mx-2 hidden text-xs text-ink-muted sm:inline">
              {session.name.split(" ")[0]} · {session.role}
            </span>
            <form action="/api/auth/logout" method="post">
              <button className="btn-secondary" type="submit">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
