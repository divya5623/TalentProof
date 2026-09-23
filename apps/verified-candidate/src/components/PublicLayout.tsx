import { Outlet } from 'react-router-dom'
import { ToastHost } from './Toast'

export function PublicLayout() {
  return (
    <div className="min-h-full bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
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
            <p className="text-[10px] text-muted">Don&apos;t trust the claim. Verify the skill.</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Outlet />
      </main>
      <ToastHost />
    </div>
  )
}
