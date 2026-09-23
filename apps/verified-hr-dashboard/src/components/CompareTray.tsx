import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { candidates } from '../data/candidates';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

export function CompareTray() {
  const { compareIds, toggleCompare, clearCompare } = useApp();
  if (compareIds.length === 0) return null;

  const selected = compareIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-0 left-[240px] right-0 z-50 border-t border-line bg-white/95 shadow-[var(--shadow-tray)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-8 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Compare tray
          </p>
          <p className="text-sm font-semibold text-ink">
            {compareIds.length} of 4 selected
          </p>
        </div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {selected.map((c) =>
            c ? (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-full border border-line bg-canvas py-1 pl-1 pr-2"
              >
                <Avatar initials={c.avatarInitials} hue={c.avatarHue} size="sm" />
                <span className="whitespace-nowrap text-xs font-medium text-ink">{c.name}</span>
                <button
                  type="button"
                  onClick={() => toggleCompare(c.id)}
                  className="rounded-full p-0.5 text-muted hover:bg-white hover:text-ink"
                  aria-label={`Remove ${c.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : null,
          )}
        </div>
        <button
          type="button"
          onClick={clearCompare}
          className="text-xs font-medium text-muted hover:text-ink"
        >
          Clear
        </button>
        {compareIds.length >= 2 ? (
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
          >
            Compare now
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-muted">
            Select at least 2
          </span>
        )}
      </div>
    </div>
  );
}
