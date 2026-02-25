'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMaintenanceList } from '@/lib/api/maintenance';
import type { FilterVehicleMaintainceDto, VehicleMaintainceItem, MaintenanceListMeta } from '@/types/maintenance';

export interface UseMaintenanceListResult {
  data: VehicleMaintainceItem[];
  meta: MaintenanceListMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب قائمة سجلات الصيانة مع التصفية والترقيم
 */
export function useMaintenanceList(
  params: FilterVehicleMaintainceDto = {}
): UseMaintenanceListResult {
  const [data, setData] = useState<VehicleMaintainceItem[]>([]);
  const [meta, setMeta] = useState<MaintenanceListMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMaintenanceList({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        vehiclePlateName: params.vehiclePlateName || undefined,
        vehicleDriverName: params.vehicleDriverName || undefined,
        maintainceDate: params.maintainceDate || undefined,
        maintainceType: params.maintainceType || undefined,
        maintainceStatus: params.maintainceStatus || undefined,
        maintanceCostBearer: params.maintanceCostBearer || undefined,
        maintanceParts: params.maintanceParts || undefined,
        maintainceSupervisorName: params.maintainceSupervisorName || undefined,
        officeSupervisorName: params.officeSupervisorName || undefined,
      });
      setData(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل قائمة الصيانة');
      setData([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.vehiclePlateName,
    params.vehicleDriverName,
    params.maintainceDate,
    params.maintainceType,
    params.maintainceStatus,
    params.maintanceCostBearer,
    params.maintanceParts,
    params.maintainceSupervisorName,
    params.officeSupervisorName,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, meta, isLoading, error, refetch: fetchData };
}
