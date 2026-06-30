import { CloudLightning, Code2 } from 'lucide-react';
import { API_BASE_URL } from '../api/client';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginPage() {
  return (
    <div className="grain-overlay flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
            <CloudLightning size={28} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-paper-50">WeatherGuard</h1>
          <p className="mt-1 font-mono-data text-xs uppercase tracking-[0.15em] text-paper-200/40">
            Invite-only alert network
          </p>
        </div>

        <div className="instrument-panel rounded-xl p-6">
          <p className="mb-5 text-center text-sm text-paper-200/70">
            Sign in to request access. An administrator will review and approve your account.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={`${API_BASE_URL}/auth/google`}
              className="flex items-center justify-center gap-3 rounded-md border border-storm-600 bg-storm-900/40 px-4 py-2.5 font-display text-sm font-medium text-paper-50 transition-colors hover:bg-storm-700"
            >
              <GoogleIcon />
              Continue with Google
            </a>
            <a
              href={`${API_BASE_URL}/auth/github`}
              className="flex items-center justify-center gap-3 rounded-md border border-storm-600 bg-storm-900/40 px-4 py-2.5 font-display text-sm font-medium text-paper-50 transition-colors hover:bg-storm-700"
            >
              <Code2 size={18} />
              Continue with GitHub
            </a>
          </div>
        </div>

        <p className="mt-6 text-center font-mono-data text-[11px] text-paper-200/30">
          Access is granted manually. New accounts start in pending status.
        </p>
      </div>
    </div>
  );
}
