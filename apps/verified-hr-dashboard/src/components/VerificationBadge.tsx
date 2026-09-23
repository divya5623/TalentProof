import { Check } from 'lucide-react';

interface Props {
  variant?: 'verified' | 'self-reported';
  score?: number;
  compact?: boolean;
}

export function VerificationBadge({ variant = 'verified', score, compact }: Props) {
  if (variant === 'self-reported') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas px-2 py-0.5 text-[11px] font-medium text-muted">
        Self-reported
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-verified-soft font-semibold text-verified ${
        compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs'
      }`}
    >
      <Check className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.5} />
      {score != null ? `${score}% Verified` : 'Verified'}
    </span>
  );
}
