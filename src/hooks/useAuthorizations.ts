'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAuthorizations } from '@/lib/api/authorizations';
import { mapAuthorizationFromApi } from '@/lib/authorizations/mappers';
import type { AuthorizationDisplay } from '@/lib/authorizations/mappers';
import type { AuthorizationMeta } from '@/types/authorization';
import type { AuthorizationsFetchParams } from '@/types/authorization';

interface UseAuthorizationsResult {
  authorizations: AuthorizationDisplay[];
  meta: AuthorizationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  page: number;
  limit: number;
}

type UseAuthorizationsParams = AuthorizationsFetchParams;

export function useAuthorizations(params: UseAuthorizationsParams = {}): UseAuthorizationsResult {
  const [authorizations, setAuthorizations] = useState<AuthorizationDisplay[]>([]);
  const [meta, setMeta] = useState<AuthorizationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(params.page ?? 1);
  const [limit, setLimit] = useState(params.limit ?? 10);

  const filters: Omit<AuthorizationsFetchParams, 'page' | 'limit'> = {
    authorizationType: params.authorizationType,
    authorizationStatus: params.authorizationStatus,
    authorizationStartDate: params.authorizationStartDate,
    authorizationEndDate: params.authorizationEndDate,
    authorizationEndDateFrom: params.authorizationEndDateFrom,
    authorizationEndDateTo: params.authorizationEndDateTo,
    driverIdReceivedFromName: params.driverIdReceivedFromName,
    vehiclePlateName: params.vehiclePlateName,
    driverName: params.driverName,
    driverJisrId: params.driverJisrId,
    userDriverName: params.userDriverName,
    userDriverReceivedFromName: params.userDriverReceivedFromName,
  };

  const loadAuthorizations = useCallback(async (pageNum: number, limitNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAuthorizations({ page: pageNum, limit: limitNum, ...filters });
      setAuthorizations(response.data.map(mapAuthorizationFromApi));
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب التفويضات');
      setAuthorizations([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.authorizationType,
    filters.authorizationStatus,
    filters.authorizationStartDate,
    filters.authorizationEndDate,
    filters.authorizationEndDateFrom,
    filters.authorizationEndDateTo,
    filters.driverIdReceivedFromName,
    filters.vehiclePlateName,
    filters.driverName,
    filters.driverJisrId,
    filters.userDriverName,
    filters.userDriverReceivedFromName,
  ]);

  useEffect(() => {
    loadAuthorizations(page, limit);
  }, [page, limit, loadAuthorizations]);

  const refetch = useCallback(async () => {
    await loadAuthorizations(page, limit);
  }, [loadAuthorizations, page, limit]);

  return {
    authorizations,
    meta,
    isLoading,
    error,
    refetch,
    setPage,
    setLimit,
    page,
    limit,
  };
}
