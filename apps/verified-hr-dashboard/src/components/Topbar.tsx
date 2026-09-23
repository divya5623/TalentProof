import { Bell, HelpCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar } from './Avatar';
import { useApp } from '../context/AppContext';

export function Topbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { toast } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-white/90 px-8 backdrop-blur-sm">
      <form
        className="relative max-w-xl flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/talent?q=${encodeURIComponent(q)}`);
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search candidates, skills, roles..."
          className="h-10 w-full rounded-xl border border-line bg-canvas pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15"
        />
      </form>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="relative rounded-lg p-2.5 text-muted transition hover:bg-canvas hover:text-ink"
          aria-label="Notifications"
          onClick={() =>
            toast('3 new verified matches for “React Developers 2y+”', 'info')
          }
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2.5 text-muted transition hover:bg-canvas hover:text-ink"
          aria-label="Help"
          onClick={() =>
            toast('Demo tip: search “React Developer”, filter React/JS/TS + 2 yrs', 'info')
          }
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>
        <div className="ml-2">
          <Avatar initials="RM" hue={220} size="sm" name="Rahul Mehta" />
        </div>
      </div>
    </header>
  );
}
