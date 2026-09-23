import { Check } from 'lucide-react';

interface Props {
  name: string;
  verified?: boolean;
  score?: number;
  onClick?: () => void;
}

export function SkillBadge({ name, verified, score, onClick }: Props) {
  if (verified) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center gap-1 rounded-md border border-verified/15 bg-verified-soft/50 px-2 py-0.5 text-[11px] font-medium leading-5 text-verified transition hover:border-verified/35 hover:bg-verified-soft"
      >
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-verified text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
        <span className="tracking-tight">{name}</span>
        {score != null && (
          <span className="tabular-nums text-verified/70 font-semibold">{score}</span>
        )}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md border border-line/80 bg-canvas/60 px-2 py-0.5 text-[11px] font-medium leading-5 text-muted">
      {name}
    </span>
  );
}
