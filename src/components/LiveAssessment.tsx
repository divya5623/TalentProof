"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  category: string;
  qtype: string;
  prompt: string;
  optionsJson: string;
  evidenceRefs: string;
  orderIndex: number;
};

export function LiveAssessment({
  sessionId,
  endsAtIso,
  questions,
  initialAnswers,
}: {
  sessionId: string;
  endsAtIso: string;
  questions: Question[];
  initialAnswers: Record<string, string>;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [now, setNow] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const endsAt = useMemo(() => new Date(endsAtIso).getTime(), [endsAtIso]);
  const remaining = Math.max(0, endsAt - now);
  const q = questions[index];

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const logIntegrity = useCallback(
    async (type: string, severity = "warning") => {
      await fetch(`/api/sessions/${sessionId}/integrity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, severity }),
      });
    },
    [sessionId]
  );

  useEffect(() => {
    const onBlur = () => logIntegrity("tab_blur", "warning");
    const onPaste = () => logIntegrity("paste", "info");
    window.addEventListener("blur", onBlur);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("paste", onPaste);
    };
  }, [logIntegrity]);

  useEffect(() => {
    if (remaining === 0) {
      startTransition(() => {
        void submitFinal();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  async function autosave(questionId: string, content: string) {
    setSaving(true);
    await fetch(`/api/sessions/${sessionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, content }),
    });
    setSaving(false);
    setMessage("Saved");
    setTimeout(() => setMessage(""), 1200);
  }

  async function submitFinal() {
    const res = await fetch(`/api/sessions/${sessionId}/submit`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      router.push(`/reports/${data.reportId}`);
    } else {
      setMessage("Submit failed — try again.");
    }
  }

  function parseOptions(raw: string) {
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  const progress = Math.round(((index + 1) / questions.length) * 100);

  if (!q) return <p>No questions.</p>;

  const options = parseOptions(q.optionsJson);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-seal">
            Question {index + 1} / {questions.length} · {q.category}
          </p>
          <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-paper-line">
            <div className="h-full bg-seal transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="rounded-md border border-paper-line bg-white px-3 py-2 font-mono text-sm">
          {mm}:{ss}
          <span className="ml-3 text-xs text-ink-muted">{saving ? "Saving…" : message}</span>
        </div>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-medium text-ink">{q.prompt}</h2>
        <p className="mt-2 font-mono text-[11px] text-ink-muted">refs: {q.evidenceRefs}</p>

        {q.qtype === "mcq" && options.length > 0 ? (
          <div className="mt-6 space-y-2">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-paper-line px-3 py-3 text-sm hover:border-seal/40"
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === opt}
                  onChange={() => {
                    const next = { ...answers, [q.id]: opt };
                    setAnswers(next);
                    void autosave(q.id, opt);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            className="input mt-6 min-h-40"
            value={answers[q.id] || ""}
            placeholder="Type your answer here (short is OK)…"
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            onBlur={(e) => void autosave(q.id, e.target.value)}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </button>
          <button
            className="btn-secondary"
            type="button"
            disabled={index >= questions.length - 1}
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          >
            Next
          </button>
        </div>
        <button
          className="btn-primary"
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => void submitFinal())}
        >
          Finish & see results
        </button>
      </div>
    </div>
  );
}
