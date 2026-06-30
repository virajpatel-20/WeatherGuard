import { useState, useMemo } from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { UserRow } from '../components/UserRow';
import type { UserStatus } from '../types';

const TABS: { key: UserStatus | 'all'; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

export function RequestsPage() {
  const { allUsers, isLoading, actioningId, approve, reject } = useAdminDashboard();
  const [tab, setTab] = useState<UserStatus | 'all'>('pending');

  const filtered = useMemo(
    () => (tab === 'all' ? allUsers : allUsers.filter((u) => u.status === tab)),
    [allUsers, tab],
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
      <header className="mb-6">
        <p className="font-mono-data text-[11px] uppercase tracking-[0.15em] text-teal-400/70">
          Vetting Queue
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-paper-50">Access Requests</h1>
      </header>

      <div className="mb-5 flex gap-1 rounded-lg border border-storm-700 bg-storm-900/40 p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-3 py-2 font-display text-sm transition-colors ${
              tab === key ? 'bg-storm-700 text-paper-50' : 'text-paper-200/50 hover:text-paper-200/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="instrument-panel rounded-xl p-5">
        {isLoading ? (
          <p className="py-8 text-center font-mono-data text-xs text-paper-200/40">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center font-mono-data text-xs text-paper-200/40">
            No users in this category.
          </p>
        ) : (
          <div>
            {filtered.map((u) => (
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
