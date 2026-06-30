import { useEffect, useState } from 'react';
import { Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/services';
import { Button } from '../components/Button';
import type { User } from '../types';

export function PendingPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [chatId, setChatId] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    userApi.getMe().then((data) => {
      setProfile(data);
      setChatId(data.telegramChatId || '');
      setLocation(data.location || '');
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const updated = await userApi.updateProfile({ telegramChatId: chatId, location });
      setProfile(updated);
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const status = profile?.status ?? user?.status ?? 'pending';

  return (
    <div className="grain-overlay flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="instrument-panel rounded-xl p-6">
          <div className="mb-5 flex items-center gap-3">
            {status === 'pending' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                <Clock size={18} />
              </div>
            )}
            {status === 'approved' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
                <CheckCircle2 size={18} />
              </div>
            )}
            {status === 'rejected' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-500/15 text-danger-400">
                <XCircle size={18} />
              </div>
            )}
            <div>
              <h1 className="font-display text-lg font-semibold text-paper-50">
                {status === 'pending' && 'Awaiting Approval'}
                {status === 'approved' && "You're Approved!"}
                {status === 'rejected' && 'Access Denied'}
              </h1>
              <p className="font-mono-data text-[11px] uppercase tracking-wide text-paper-200/40">
                {profile?.email ?? user?.email}
              </p>
            </div>
          </div>

          {status === 'pending' && (
            <p className="mb-5 text-sm leading-relaxed text-paper-200/70">
              Your access request has been received. An administrator needs to manually approve your
              account before you'll start receiving weather alerts. Link your Telegram below now so
              you get notified the moment you're approved.
            </p>
          )}
          {status === 'approved' && (
            <p className="mb-5 text-sm leading-relaxed text-paper-200/70">
              Weather alerts will be delivered to your linked Telegram account automatically. You can
              update your location below.
            </p>
          )}
          {status === 'rejected' && (
            <p className="mb-5 text-sm leading-relaxed text-paper-200/70">
              Your request was not approved. Contact an administrator if you believe this was a mistake.
            </p>
          )}

          {status !== 'rejected' && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block font-mono-data text-[11px] uppercase tracking-wide text-paper-200/50">
                  Telegram Chat ID
                </label>
                <div className="flex items-center gap-2 rounded-md border border-storm-600 bg-storm-900/40 px-3 py-2">
                  <Send size={14} className="text-paper-200/40" />
                  <input
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="Message the bot, then paste your ID"
                    className="w-full bg-transparent font-mono-data text-sm text-paper-50 placeholder:text-paper-200/30 focus:outline-none"
                  />
                </div>
                <p className="mt-1 font-mono-data text-[10px] text-paper-200/35">
                  Open the WeatherGuard bot on Telegram and send /start to get your Chat ID.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block font-mono-data text-[11px] uppercase tracking-wide text-paper-200/50">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai,IN"
                  className="w-full rounded-md border border-storm-600 bg-storm-900/40 px-3 py-2 text-sm text-paper-50 placeholder:text-paper-200/30 focus:outline-none"
                />
              </div>

              <Button onClick={handleSave} isLoading={isSaving} className="mt-1 w-full">
                Save Settings
              </Button>
              {saved && (
                <p className="text-center font-mono-data text-[11px] text-teal-400">Settings saved.</p>
              )}
            </div>
          )}

          <button
            onClick={logout}
            className="mt-5 w-full text-center font-mono-data text-[11px] uppercase tracking-wide text-paper-200/40 hover:text-paper-200/70"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
