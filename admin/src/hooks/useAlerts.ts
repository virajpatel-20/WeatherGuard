import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/services';
import type { WeatherAlert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getRecentAlerts();
      setAlerts(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const triggerNow = useCallback(async () => {
    setIsTriggering(true);
    try {
      const result = await adminApi.triggerManualAlert();
      await refresh();
      return result;
    } finally {
      setIsTriggering(false);
    }
  }, [refresh]);

  return { alerts, isLoading, isTriggering, triggerNow, refresh };
}
