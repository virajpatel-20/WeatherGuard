import type { UserStatus } from '../types';

const CONFIG: Record<UserStatus, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Pending' },
  approved: { color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30', label: 'Approved' },
  rejected: { color: 'text-danger-400', bg: 'bg-danger-500/10 border-danger-500/30', label: 'Rejected' },
};

export function StatusBadge({ status }: { status: UserStatus }) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-data text-[11px] font-medium uppercase tracking-wide ${c.color} ${c.bg}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
