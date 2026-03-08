'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMaintenanceStatistics } from '@/lib/api/maintenance';
import type { MaintenanceStatistics } from '@/types/maintenance';

export interface UseMaintenanceStatisticsResult {
  data: MaintenanceStatistics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب إحصائيات الصيانة من الباك اند
 */
export function useMaintenanceStatistics(): UseMaintenanceStatisticsResult {
  const [data, setData] = useState<MaintenanceStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMaintenanceStatistics();
      setData(res.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل إحصائيات الصيانة');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
