export function JourneyProgress({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Skills" },
    { n: 2, label: "Skill exams" },
    { n: 3, label: "Projects" },
    { n: 4, label: "Certificate" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <div key={s.n} className="flex flex-1 items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    done || active
                      ? "bg-seal text-white"
                      : "bg-paper-line text-ink-muted"
                  }`}
                >
                  {done ? "✓" : s.n}
                </div>
                <span
                  className={`text-center text-[11px] font-medium sm:text-xs ${
                    active ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mb-5 h-1 flex-1 rounded-full ${
                    step > s.n ? "bg-seal" : "bg-paper-line"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-ink-muted">
        Step {Math.min(step, 4)} of 4
      </p>
    </div>
  );
}
