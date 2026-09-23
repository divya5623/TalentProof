import { personas } from '../data/personas'
import { useApp } from '../context/AppContext'
import { Avatar } from './Avatar'

export function PersonaSwitcher() {
  const { persona: active, switchPersona, activePersonaId } = useApp()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-xl px-1 py-1">
        <Avatar
          initials={active.avatarInitials}
          hue={active.avatarHue}
          size="sm"
          name={active.name}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{active.name}</p>
          <p className="truncate text-[11px] text-muted">{active.trackTitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {personas.map((p) => (
          <button
            key={p.id}
            type="button"
            title={p.name}
            onClick={() => switchPersona(p.id)}
            className={`rounded-lg px-1 py-1.5 text-[10px] font-semibold transition ${
              p.id === activePersonaId
                ? 'bg-accent-soft text-accent'
                : 'text-muted hover:bg-canvas hover:text-ink'
            }`}
          >
            {p.avatarInitials}
          </button>
        ))}
      </div>
    </div>
  )
}
