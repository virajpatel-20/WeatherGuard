import { NavLink, Outlet } from 'react-router-dom';
import { CloudLightning, Users, Radio, LogOut, Gauge } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: Gauge, end: true },
  { to: '/requests', label: 'Access Requests', icon: Users, end: false },
  { to: '/alerts', label: 'Alert Log', icon: Radio, end: false },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-storm-700 bg-storm-900/60 px-4 py-6">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500/15 text-teal-400">
            <CloudLightning size={18} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-paper-50">WeatherGuard</p>
            <p className="font-mono-data text-[10px] uppercase tracking-wider text-paper-200/40">Admin Console</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 font-display text-sm transition-colors ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400'
                    : 'text-paper-200/60 hover:bg-storm-700/60 hover:text-paper-50'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-storm-700 pt-4">
          <div className="mb-3 flex items-center gap-2 px-2">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-7 w-7 rounded-full" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-storm-600 font-display text-xs">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-xs font-medium text-paper-50">{user?.name}</p>
              <p className="truncate font-mono-data text-[10px] text-paper-200/40">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 font-display text-sm text-paper-200/50 transition-colors hover:bg-danger-500/10 hover:text-danger-400"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
