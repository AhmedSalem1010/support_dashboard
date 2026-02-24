'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLastAuthorizationData } from '@/lib/api/authorizations';
import type { LastAuthorizationDataItem } from '@/types/authorization';

export interface UseLastAuthorizationDataResult {
  data: LastAuthorizationDataItem | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب آخر تفويض لمركبة (بيانات المركبة والسائق) عند اختيار رقم اللوحة.
 * لا يُنفّذ الطلب إذا كان vehiclePlateName فارغاً أو null.
 */
export function useLastAuthorizationData(
  vehiclePlateName: string | null | undefined
): UseLastAuthorizationDataResult {
  const [data, setData] = useState<LastAuthorizationDataItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const plate = vehiclePlateName?.trim();
    if (!plate) {
      setData(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchLastAuthorizationData(plate);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setData(null);
        setError(response.message || 'لا توجد بيانات تفويض لهذه المركبة');
      }
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب بيانات التفويض');
    } finally {
      setIsLoading(false);
    }
  }, [vehiclePlateName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
