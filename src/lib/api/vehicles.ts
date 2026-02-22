/**
 * خدمة API المركبات
 * معزولة عن الواجهة للاحتفاظ بمعمارية نظيفة
 */

import { apiConfig, getApiHeaders } from './config';
import type {
  VehiclesApiResponse,
  VehiclesFetchParams,
} from '@/types/vehicle';

const VEHICLES_ENDPOINT = '/vehicles';

function buildUrl(params?: VehiclesFetchParams): string {
  const url = new URL(`${apiConfig.baseUrl}${VEHICLES_ENDPOINT}`);
  if (params) {
    if (params.page != null) url.searchParams.set('page', String(params.page));
    if (params.limit != null) url.searchParams.set('limit', String(params.limit));
    if (params.plateName) url.searchParams.set('plateName', params.plateName);
    if (params.manufacturer) url.searchParams.set('manufacturer', params.manufacturer);
    if (params.insuranceStatus) url.searchParams.set('insuranceStatus', params.insuranceStatus);
    if (params.status) url.searchParams.set('status', params.status);
    if (params.serialNumber) url.searchParams.set('serialNumber', params.serialNumber);
    if (params.istimarahStatus) url.searchParams.set('istimarahStatus', params.istimarahStatus);
    if (params.inspectionStatus) url.searchParams.set('inspectionStatus', params.inspectionStatus);
  }
  return url.toString();
}

export async function fetchVehicles(
  params?: VehiclesFetchParams
): Promise<VehiclesApiResponse> {
  const url = buildUrl(params);
  const response = await fetch(url, {
    method: 'GET',
    headers: getApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`فشل جلب المركبات: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
