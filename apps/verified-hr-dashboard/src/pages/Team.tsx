import { UserPlus } from 'lucide-react';
import { teamMembers } from '../data/team';
import { Avatar } from '../components/Avatar';
import { useApp } from '../context/AppContext';

export function Team() {
  const { toast } = useApp();

  return (
    <div className="mx-auto max-w-[900px] space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Workspace
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">My Team</h1>
          <p className="mt-2 text-sm text-muted">
            Talent acquisition collaborators on this VERIFIED workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Invite link copied (demo)', 'success')}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-canvas"
        >
          <UserPlus className="h-4 w-4" />
          Invite teammate
        </button>
      </div>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
        {teamMembers.map((m) => (
          <li key={m.id} className="flex items-center gap-4 px-6 py-5">
            <Avatar initials={m.initials} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-ink">{m.name}</p>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
            <p className="text-sm text-muted">{m.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
