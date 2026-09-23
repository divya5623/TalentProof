import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ToastHost } from './Toast'
import { Topbar } from './Topbar'

export function Layout() {
  return (
    <div className="min-h-full bg-canvas">
      <Sidebar />
      <div className="pl-[240px]">
        <Topbar />
        <main className="min-h-[calc(100vh-4rem)] px-8 py-8">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  )
}
