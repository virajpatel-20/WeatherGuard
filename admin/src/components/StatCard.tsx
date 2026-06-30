import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accent?: string;
}

export function StatCard({ label, value, icon, accent = 'var(--color-teal-500)' }: StatCardProps) {
  return (
    <div className="instrument-panel grain-overlay relative overflow-hidden rounded-xl p-5">
      <div className="absolute right-3 top-3 opacity-20" style={{ color: accent }}>
        {icon}
      </div>
      <p className="font-mono-data text-[11px] uppercase tracking-[0.15em] text-paper-200/60">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
