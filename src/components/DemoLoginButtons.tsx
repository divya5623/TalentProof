"use client";

export function DemoLoginButtons() {
  function fill(email: string) {
    const emailEl = document.getElementById("email") as HTMLInputElement | null;
    const passEl = document.getElementById("password") as HTMLInputElement | null;
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = "password123";
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-ink">Quick demo login (1 click to fill):</p>
      <div className="flex flex-col gap-2">
        <button type="button" className="btn-secondary w-full justify-start text-left" onClick={() => fill("student@talentproof.dev")}>
          I am a <strong className="mx-1">Student</strong> — fill login
        </button>
        <button type="button" className="btn-secondary w-full justify-start text-left" onClick={() => fill("recruiter@talentproof.dev")}>
          I am a <strong className="mx-1">Recruiter</strong> — fill login
        </button>
        <button type="button" className="btn-secondary w-full justify-start text-left" onClick={() => fill("reviewer@talentproof.dev")}>
          I am a <strong className="mx-1">Reviewer</strong> — fill login
        </button>
      </div>
      <p className="text-xs text-ink-muted">Password for all demo accounts: <strong>password123</strong></p>
    </div>
  );
}
