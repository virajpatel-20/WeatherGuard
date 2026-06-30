import { Zap, CloudRain, AlertTriangle } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import { Button } from '../components/Button';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AlertsPage() {
  const { alerts, isLoading, isTriggering, triggerNow } = useAlerts();

  const handleTrigger = async () => {
    const result = await triggerNow();
    // eslint-disable-next-line no-alert
    alert(`Dispatched: ${result.sent} sent, ${result.failed} failed`);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.15em] text-teal-400/70">
            Dispatch Log
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-paper-50">Weather Alerts</h1>
        </div>
        <Button onClick={handleTrigger} isLoading={isTriggering} variant="outline">
          <Zap size={14} />
          Trigger Alert Now
        </Button>
      </header>

      <p className="mb-5 text-sm text-paper-200/50">
        Alerts dispatch automatically every 6 hours to approved users with a linked Telegram account.
        Use the trigger button to send a batch immediately for testing.
      </p>

      <section className="instrument-panel rounded-xl p-5">
        {isLoading ? (
          <p className="py-8 text-center font-mono-data text-xs text-paper-200/40">Loading…</p>
        ) : alerts.length === 0 ? (
          <p className="py-8 text-center font-mono-data text-xs text-paper-200/40">
            No alerts dispatched yet.
          </p>
        ) : (
          <div className="divide-y divide-storm-700">
            {alerts.map((alert) => {
              const userObj = typeof alert.userId === 'object' ? alert.userId : null;
              return (
                <div key={alert._id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    {alert.status === 'sent' ? (
                      <CloudRain size={16} className="shrink-0 text-teal-400" />
                    ) : (
                      <AlertTriangle size={16} className="shrink-0 text-danger-400" />
                    )}
                    <div>
                      <p className="font-display text-sm text-paper-50">
                        {userObj?.name ?? 'Unknown user'}
                        <span className="ml-2 font-mono-data text-xs text-paper-200/40">
                          {alert.location}
                        </span>
                      </p>
                      <p className="font-mono-data text-[11px] text-paper-200/40">
                        {alert.status === 'sent'
                          ? `${alert.temperature}°C · ${alert.description}`
                          : alert.errorMessage || 'Delivery failed'}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono-data text-[11px] text-paper-200/30">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
