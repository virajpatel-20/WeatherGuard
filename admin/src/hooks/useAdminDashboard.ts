import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/services';
import type { User, AdminStats } from '../types';

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, pendingData, allData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingRequests(),
        adminApi.getAllUsers(),
      ]);
      setStats(statsData);
      setPendingUsers(pendingData);
      setAllUsers(allData);
    } catch {
      setError('Could not load dashboard data. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const approve = useCallback(
    async (userId: string) => {
      setActioningId(userId);
      try {
        await adminApi.approveUser(userId);
        await refresh();
      } finally {
        setActioningId(null);
      }
    },
    [refresh],
  );

  const reject = useCallback(
    async (userId: string) => {
      setActioningId(userId);
      try {
        await adminApi.rejectUser(userId);
        await refresh();
      } finally {
        setActioningId(null);
      }
    },
    [refresh],
  );

  return { stats, pendingUsers, allUsers, isLoading, error, actioningId, approve, reject, refresh };
}
