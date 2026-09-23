import { CheckCircle2, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function ToastHost() {
  const { toasts, dismissToast, compareIds } = useApp();
  const lift = compareIds.length > 0 ? 'bottom-24' : 'bottom-6';

  return (
    <div
      className={`pointer-events-none fixed right-6 z-[90] flex w-[320px] flex-col gap-2 ${lift}`}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} message={t.message} type={t.type} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 3200);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  const Icon = type === 'success' ? CheckCircle2 : Info;
  const color =
    type === 'success' ? 'text-verified' : type === 'error' ? 'text-danger' : 'text-accent';

  return (
    <div className="pointer-events-auto animate-toast-in flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-lift)]">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <p className="flex-1 text-sm font-medium text-ink">{message}</p>
      <button type="button" onClick={() => onDismiss(id)} className="text-muted hover:text-ink">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
