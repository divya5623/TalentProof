import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { toast } = useApp();
  const [notify, setNotify] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <div className="mx-auto max-w-[720px] space-y-6 animate-fade-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Preferences
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Workspace defaults for your VERIFIED recruiter seat.
        </p>
      </div>
      <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
        <Field label="Display name" value="Rahul Mehta" />
        <Field label="Work email" value="rahul.mehta@verified.example" />
        <Field label="Company" value="VERIFIED Demo Org" />
        <Field label="Default location filter" value="India" />
        <ToggleRow
          title="Email notifications"
          description="New verified matches for saved searches"
          on={notify}
          onToggle={() => {
            setNotify((v) => !v);
            toast(!notify ? 'Email notifications enabled' : 'Email notifications paused', 'success');
          }}
        />
        <ToggleRow
          title="Weekly verification digest"
          description="Summary of newly assessed talent in your markets"
          on={digest}
          onToggle={() => {
            setDigest((v) => !v);
            toast(!digest ? 'Weekly digest enabled' : 'Weekly digest disabled', 'info');
          }}
        />
      </div>
      <p className="text-xs text-muted">Demo settings — changes stay in this browser session only.</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <input
        readOnly
        value={value}
        className="mt-1.5 h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink"
      />
    </label>
  );
}

function ToggleRow({
  title,
  description,
  on,
  onToggle,
}: {
  title: string;
  description: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          on ? 'bg-verified' : 'bg-zinc-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            on ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}
