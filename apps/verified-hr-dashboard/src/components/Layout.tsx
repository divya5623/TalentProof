import { Outlet } from 'react-router-dom';
import { CompareTray } from './CompareTray';
import { Sidebar } from './Sidebar';
import { ToastHost } from './Toast';
import { Topbar } from './Topbar';

export function Layout() {
  return (
    <div className="min-h-full bg-canvas">
      <Sidebar />
      <div className="pl-[240px]">
        <Topbar />
        <main className="min-h-[calc(100vh-4rem)] px-8 py-8 pb-28">
          <Outlet />
        </main>
      </div>
      <CompareTray />
      <ToastHost />
    </div>
  );
}
