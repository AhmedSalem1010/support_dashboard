'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicleInfo } from '@/lib/api/equipment';
import type { VehicleInfoItem } from '@/types/equipment';

export interface UseVehicleEquipmentInfoResult {
  data: VehicleInfoItem[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب معلومات معدات المركبة (vehicle-info) عند اختيار المركبة.
 * يُستخدم في: التفويض، فحص المعدات، جرد العهدة.
 */
export function useVehicleEquipmentInfo(
  vehiclePlateName: string | null | undefined
): UseVehicleEquipmentInfoResult {
  const [data, setData] = useState<VehicleInfoItem[] | null>(null);
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
      const response = await fetchVehicleInfo(plate);
      setData(response);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'فشل جلب بيانات معدات المركبة');
    } finally {
      setIsLoading(false);
    }
  }, [vehiclePlateName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
