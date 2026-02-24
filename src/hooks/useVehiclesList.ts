'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles } from '@/lib/api/vehicles';
import { mapVehicleFromApi } from '@/lib/vehicles/mappers';
import type { VehicleDisplay } from '@/lib/vehicles/mappers';

export interface VehicleOption {
  value: string;
  label: string;
  /** رقم اللوحة للاستخدام مع آخر تفويض (مثل useLastAuthorizationData) */
  plateName: string;
}

interface UseVehiclesListResult {
  vehicles: VehicleDisplay[];
  vehicleOptions: VehicleOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * جلب قائمة المركبات للاستخدام في القوائم المنسدلة عبر النظام
 */
export function useVehiclesList(): UseVehiclesListResult {
  const [vehicles, setVehicles] = useState<VehicleDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allVehicles: VehicleDisplay[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetchVehicles({ page, limit: 100 });
        const mapped = response.data.map(mapVehicleFromApi);
        allVehicles.push(...mapped);
        hasMore = response.meta.hasNextPage;
        page++;
      }

      setVehicles(allVehicles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب المركبات');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const vehicleOptions: VehicleOption[] = vehicles.map((v) => ({
    value: v.id,
    label: `${v.plateName || v.plateNumber} - ${v.manufacturer} ${v.model}`,
    plateName: v.plateName || v.plateNumber || '',
  }));

  return {
    vehicles,
    vehicleOptions,
    isLoading,
    error,
    refetch: loadVehicles,
  };
}
