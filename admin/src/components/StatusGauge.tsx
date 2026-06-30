import type { UserStatus } from '../types';

const STATUS_CONFIG: Record<UserStatus, { pct: number; color: string; label: string }> = {
  pending: { pct: 33, color: 'var(--color-amber-500)', label: 'PENDING' },
  approved: { pct: 100, color: 'var(--color-teal-500)', label: 'CLEAR' },
  rejected: { pct: 100, color: 'var(--color-danger-500)', label: 'DENIED' },
};

export function StatusGauge({ status, size = 40 }: { status: UserStatus; size?: number }) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className="gauge-ring relative shrink-0 rounded-full p-[3px]"
      style={{
        width: size,
        height: size,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--gauge-pct' as any]: `${config.pct}%`,
        ['--gauge-color' as any]: config.color,
      }}
      title={config.label}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-storm-900">
        <span
          className="font-mono-data text-[9px] font-medium tracking-tighter"
          style={{ color: config.color }}
        >
          {status === 'pending' ? '…' : status === 'approved' ? '✓' : '✕'}
        </span>
      </div>
    </div>
  );
}
