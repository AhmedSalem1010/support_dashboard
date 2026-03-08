'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAccidentsStatistics } from '@/lib/api/accidents';
import type { AccidentStatistics } from '@/types/accidents';

export interface UseAccidentsStatisticsResult {
  data: AccidentStatistics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب إحصائيات الحوادث من الباك اند
 */
export function useAccidentsStatistics(): UseAccidentsStatisticsResult {
  const [data, setData] = useState<AccidentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAccidentsStatistics();
      setData(res.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل إحصائيات الحوادث');
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
