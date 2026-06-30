import { Check, X, MapPin, Send } from 'lucide-react';
import type { User } from '../types';
import { StatusGauge } from './StatusGauge';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';

interface UserRowProps {
  user: User;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isActioning?: boolean;
  showActions?: boolean;
}

export function UserRow({ user, onApprove, onReject, isActioning, showActions = true }: UserRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-storm-700 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <StatusGauge status={user.status} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-sm font-medium text-paper-50">{user.name}</p>
            <span className="rounded border border-storm-600 px-1.5 py-0.5 font-mono-data text-[10px] uppercase text-paper-200/50">
              {user.provider}
            </span>
          </div>
          <p className="truncate text-xs text-paper-200/50">{user.email}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {user.location && (
              <span className="flex items-center gap-1 font-mono-data text-[11px] text-paper-200/40">
                <MapPin size={11} /> {user.location}
              </span>
            )}
            {user.telegramChatId ? (
              <span className="flex items-center gap-1 font-mono-data text-[11px] text-teal-400/70">
                <Send size={11} /> linked
              </span>
            ) : (
              <span className="font-mono-data text-[11px] text-paper-200/30">no telegram linked</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:shrink-0">
        <StatusBadge status={user.status} />
        {showActions && user.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="!px-2.5 !py-1.5"
              isLoading={isActioning}
              onClick={() => onApprove?.(user._id)}
            >
              <Check size={14} />
              Approve
            </Button>
            <Button
              variant="ghost"
              className="!px-2.5 !py-1.5"
              isLoading={isActioning}
              onClick={() => onReject?.(user._id)}
            >
              <X size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
