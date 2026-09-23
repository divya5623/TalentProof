import {
  BarChart3,
  Bookmark,
  Briefcase,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Avatar } from './Avatar';

const primary = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/talent', label: 'Find Talent', icon: Search },
  { to: '/shortlists', label: 'Shortlists', icon: Bookmark },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const secondary = [
  { to: '/saved-searches', label: 'Saved Searches', icon: Search },
  { to: '/team', label: 'My Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-line bg-white">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3.5 8.25L6.5 11.25L12.5 4.75"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-[0.18em] text-ink">VERIFIED</p>
            <p className="text-[10px] font-medium tracking-wide text-muted">Talent Intelligence</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-muted">
          Don&apos;t trust the claim. Verify the skill.
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          {primary.map((item) => (
            <SideLink key={item.to} {...item} />
          ))}
        </div>
        <div>
          <div className="mx-2 mb-2 border-t border-line" />
          <div className="space-y-0.5">
            {secondary.map((item) => (
              <SideLink key={item.to} {...item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3 rounded-xl px-1 py-1">
          <Avatar initials="RM" hue={220} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Rahul Mehta</p>
            <p className="truncate text-[11px] text-muted">Talent Acquisition</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SideLink({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string;
  label: string;
  icon: typeof Search;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
          isActive
            ? 'bg-accent-soft text-accent'
            : 'text-muted hover:bg-canvas hover:text-ink'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {label}
    </NavLink>
  );
}
