'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicleAlerts } from '@/lib/api/vehicleAlerts';
import type {
  OperationAlertRecord,
  OperationType,
} from '@/types/operationAlerts';
import type { VehicleAlertsMeta } from '@/lib/api/vehicleAlerts';

export interface UseVehicleAlertsListParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  operationType?: OperationType; // 1 | 2 | 3 | 4 | 5
  vehiclePlateName?: string;
  driverName?: string;
  userDriverName?: string;
}

export interface UseVehicleAlertsListResult {
  data: OperationAlertRecord[];
  meta: VehicleAlertsMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function mapApiItemToRecord(item: {
  id: string;
  idleDuration: number;
  movingDuration: number;
  distance: number;
  maxSpeed: number;
  operationDate: string;
  operationType: number;
  vehicle?: { plateName?: string } | null;
  authorization?: { driver?: { name?: string } | null; userDriver?: { name?: string } | null } | null;
}): OperationAlertRecord {
  const driverName =
    item.authorization?.driver?.name ??
    item.authorization?.userDriver?.name ??
    '—';
  const vehiclePlateName = item.vehicle?.plateName ?? '—';

  return {
    id: item.id,
    vehiclePlateName,
    driverName,
    idle_duration: item.idleDuration,
    moving_duration: item.movingDuration,
    distance: item.distance,
    max_speed: item.maxSpeed,
    operation_date: item.operationDate,
    operation_type: item.operationType as OperationType,
  };
}

export function useVehicleAlertsList(
  params: UseVehicleAlertsListParams = {}
): UseVehicleAlertsListResult {
  const [data, setData] = useState<OperationAlertRecord[]>([]);
  const [meta, setMeta] = useState<VehicleAlertsMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchVehicleAlerts({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
        operationType:
          params.operationType != null && [1, 2, 3, 4, 5].includes(params.operationType as number)
            ? (params.operationType as OperationType)
            : undefined,
        vehiclePlateName: params.vehiclePlateName || undefined,
        driverName: params.driverName || undefined,
        userDriverName: params.userDriverName || undefined,
      });
      setData((res.data ?? []).map(mapApiItemToRecord));
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل مخالفات المركبات');
      setData([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.dateFrom,
    params.dateTo,
    params.operationType,
    params.vehiclePlateName,
    params.driverName,
    params.userDriverName,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, meta, isLoading, error, refetch: fetchData };
}
