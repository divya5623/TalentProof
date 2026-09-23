"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Q = {
  id: string;
  type: string;
  prompt: string;
  options?: string[];
};

export function StrictSkillExam({
  sessionId,
  skillName,
  endsAtIso,
  questions,
}: {
  sessionId: string;
  skillName: string;
  endsAtIso: string;
  questions: Q[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [now, setNow] = useState(Date.now());
  const [warnings, setWarnings] = useState(0);
  const [banner, setBanner] = useState("Strict mode: stay on this tab. Paste is blocked.");
  const [pending, startTransition] = useTransition();
  const [fsReady, setFsReady] = useState(false);

  const endsAt = useMemo(() => new Date(endsAtIso).getTime(), [endsAtIso]);
  const remaining = Math.max(0, endsAt - now);
  const q = questions[index];

  const logEvent = useCallback(
    async (type: string, severity = "warning") => {
      await fetch(`/api/skill-exams/${sessionId}/integrity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, severity }),
      });
    },
    [sessionId]
  );

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const enterFs = async () => {
      try {
        await document.documentElement.requestFullscreen?.();
        setFsReady(true);
        await logEvent("fullscreen_enter", "info");
      } catch {
        setFsReady(false);
        setBanner("Fullscreen blocked by browser — still stay on this tab.");
      }
    };
    void enterFs();

    const onBlur = () => {
      setWarnings((w) => w + 1);
      setBanner("Warning: you left this window. Stay focused on the exam.");
      void logEvent("tab_blur", "warning");
    };
    const onVis = () => {
      if (document.hidden) {
        setWarnings((w) => w + 1);
        void logEvent("tab_hidden", "warning");
      }
    };
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setBanner("Paste blocked during exam.");
      void logEvent("paste_blocked", "warning");
    };
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      void logEvent("copy_blocked", "info");
    };
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onFs = () => {
      if (!document.fullscreenElement) {
        setWarnings((w) => w + 1);
        setBanner("Fullscreen exited — recorded as integrity warning.");
        void logEvent("fullscreen_exit", "warning");
      }
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("paste", onPaste, true);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("fullscreenchange", onFs);

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("paste", onPaste, true);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("fullscreenchange", onFs);
      if (document.fullscreenElement) void document.exitFullscreen?.();
    };
  }, [logEvent]);

  useEffect(() => {
    if (remaining === 0) {
      startTransition(() => {
        void submit();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  async function save(questionId: string, content: string) {
    await fetch(`/api/skill-exams/${sessionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, content }),
    });
  }

  async function submit() {
    const res = await fetch(`/api/skill-exams/${sessionId}/submit`, { method: "POST" });
    if (res.ok) {
      if (document.fullscreenElement) void document.exitFullscreen?.();
      router.push("/journey/exams?done=1");
      router.refresh();
    } else {
      setBanner("Submit failed — try again.");
    }
  }

  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  if (!q) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="rounded-xl border border-signal/40 bg-signal-soft px-4 py-3 text-sm text-signal">
        {banner}
        {warnings > 0 && ` · Warnings: ${warnings}`}
        {!fsReady && " · Fullscreen optional if browser blocks it"}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-seal">{skillName} exam</p>
          <p className="text-xs text-ink-muted">
            Question {index + 1} / {questions.length}
          </p>
        </div>
        <div className="rounded-lg border border-paper-line bg-white px-4 py-2 font-mono text-lg font-semibold">
          {mm}:{ss}
        </div>
      </div>

      <div className="panel mt-6 p-6">
        <h2 className="text-lg font-semibold text-ink">{q.prompt}</h2>

        {q.type === "mcq" && q.options ? (
          <div className="mt-5 space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer gap-3 rounded-lg border border-paper-line px-3 py-3 text-sm hover:border-seal/50"
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === opt}
                  onChange={() => {
                    const next = { ...answers, [q.id]: opt };
                    setAnswers(next);
                    void save(q.id, opt);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            className="input mt-5 min-h-36 font-mono text-sm"
            value={answers[q.id] || ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            onBlur={(e) => void save(q.id, e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={q.type === "code" ? "Type code here (paste disabled)…" : "Type your answer…"}
            autoComplete="off"
            spellCheck={false}
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={index >= questions.length - 1}
            onClick={() => setIndex((i) => i + 1)}
          >
            Next question
          </button>
        </div>
        <button
          type="button"
          className="btn-primary py-3"
          disabled={pending}
          onClick={() => startTransition(() => void submit())}
        >
          Submit exam
        </button>
      </div>
    </div>
  );
}
