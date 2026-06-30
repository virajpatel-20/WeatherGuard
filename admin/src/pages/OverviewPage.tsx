import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { StatCard } from '../components/StatCard';
import { UserRow } from '../components/UserRow';

export function OverviewPage() {
  const { stats, pendingUsers, isLoading, error, actioningId, approve, reject } = useAdminDashboard();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
      <header className="mb-8">
        <p className="font-mono-data text-[11px] uppercase tracking-[0.15em] text-teal-400/70">
          Station Overview
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-paper-50">
          Network Status
        </h1>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={stats?.total ?? 0} icon={<Users size={40} />} accent="var(--color-brass-400)" />
        <StatCard label="Pending" value={stats?.pending ?? 0} icon={<Clock size={40} />} accent="var(--color-amber-500)" />
        <StatCard label="Approved" value={stats?.approved ?? 0} icon={<CheckCircle2 size={40} />} accent="var(--color-teal-500)" />
        <StatCard label="Rejected" value={stats?.rejected ?? 0} icon={<XCircle size={40} />} accent="var(--color-danger-500)" />
      </div>

      <section className="instrument-panel mt-8 rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-medium text-paper-50">Latest Access Requests</h2>
          <Link
            to="/requests"
            className="flex items-center gap-1 font-mono-data text-[11px] uppercase tracking-wide text-teal-400 hover:text-teal-300"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <p className="py-8 text-center font-mono-data text-xs text-paper-200/40">Loading…</p>
        ) : pendingUsers.length === 0 ? (
          <p className="py-8 text-center font-mono-data text-xs text-paper-200/40">
            No pending requests. The queue is clear.
          </p>
        ) : (
          <div>
            {pendingUsers.slice(0, 5).map((u) => (
              <UserRow
                key={u._id}
                user={u}
                onApprove={approve}
                onReject={reject}
                isActioning={actioningId === u._id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
