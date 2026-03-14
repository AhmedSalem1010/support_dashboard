'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAccidentsList } from '@/lib/api/accidents';
import type { FilterVehicleAccidentDto, VehicleAccidentItem, AccidentListMeta } from '@/types/accidents';

export interface UseAccidentsListResult {
  data: VehicleAccidentItem[];
  meta: AccidentListMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب قائمة سجلات الحوادث مع التصفية والترقيم
 */
export function useAccidentsList(
  params: FilterVehicleAccidentDto = {}
): UseAccidentsListResult {
  const [data, setData] = useState<VehicleAccidentItem[]>([]);
  const [meta, setMeta] = useState<AccidentListMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAccidentsList({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        vehiclePlateName: params.vehiclePlateName || undefined,
        vehicleSerialNumber: params.vehicleSerialNumber || undefined,
        vehicledriverName: params.vehicledriverName || undefined,
        vehicledriverJisr: params.vehicledriverJisr || undefined,
        accidentStartDate: params.accidentStartDate || undefined,
        accidentEndDate: params.accidentEndDate || undefined,
        accidentStatus: params.accidentStatus || undefined,
        accidentSeverity: params.accidentSeverity || undefined,
        accidentCostBearer: params.accidentCostBearer || undefined,
        accidentTammNumber: params.accidentTammNumber || undefined,
      });
      setData(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل قائمة الحوادث');
      setData([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.vehiclePlateName,
    params.vehicleSerialNumber,
    params.vehicledriverName,
    params.vehicledriverJisr,
    params.accidentStartDate,
    params.accidentEndDate,
    params.accidentStatus,
    params.accidentSeverity,
    params.accidentCostBearer,
    params.accidentTammNumber,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, meta, isLoading, error, refetch: fetchData };
}
