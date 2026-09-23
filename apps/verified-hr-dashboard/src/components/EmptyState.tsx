import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-8 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
