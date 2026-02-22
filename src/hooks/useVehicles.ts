'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles } from '@/lib/api/vehicles';
import { mapVehicleFromApi } from '@/lib/vehicles/mappers';
import type { VehicleDisplay } from '@/lib/vehicles/mappers';
import type { VehiclesMeta, VehiclesFetchParams } from '@/types/vehicle';

interface UseVehiclesResult {
  vehicles: VehicleDisplay[];
  meta: VehiclesMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  page: number;
  limit: number;
}

interface UseVehiclesParams extends Omit<VehiclesFetchParams, 'page' | 'limit'> {
  page?: number;
  limit?: number;
}

export function useVehicles(params: UseVehiclesParams = {}): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<VehicleDisplay[]>([]);
  const [meta, setMeta] = useState<VehiclesMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(params.page ?? 1);
  const limit = params.limit ?? 10;
  const filters: Omit<VehiclesFetchParams, 'page' | 'limit'> = {
    plateName: params.plateName,
    insuranceStatus: params.insuranceStatus,
    status: params.status,
    istimarahStatus: params.istimarahStatus,
    inspectionStatus: params.inspectionStatus,
  };

  const loadVehicles = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchVehicles({ page: pageNum, limit, ...filters });
      setVehicles(response.data.map(mapVehicleFromApi));
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب المركبات');
      setVehicles([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [limit, filters.plateName, filters.insuranceStatus, filters.status, filters.istimarahStatus, filters.inspectionStatus]);

  useEffect(() => {
    loadVehicles(page);
  }, [page, loadVehicles]);

  const refetch = useCallback(async () => {
    await loadVehicles(page);
  }, [loadVehicles, page]);

  return {
    vehicles,
    meta,
    isLoading,
    error,
    refetch,
    setPage,
    page,
    limit,
  };
}
