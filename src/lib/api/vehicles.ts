/**
 * خدمة API المركبات
 * معزولة عن الواجهة للاحتفاظ بمعمارية نظيفة
 */

import api from './config';
import type {
  VehiclesApiResponse,
  VehiclesFetchParams,
} from '@/types/vehicle';

const VEHICLES_ENDPOINT = '/vehicles';

function buildParams(params?: VehiclesFetchParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (!params) return query;
  if (params.page != null) query.page = String(params.page);
  if (params.limit != null) query.limit = String(params.limit);
  if (params.plateName) query.plateName = params.plateName;
  if (params.manufacturer) query.manufacturer = params.manufacturer;
  if (params.insuranceStatus) query.insuranceStatus = params.insuranceStatus;
  if (params.status) query.status = params.status;
  if (params.serialNumber) query.serialNumber = params.serialNumber;
  if (params.istimarahStatus) query.istimarahStatus = params.istimarahStatus;
  if (params.inspectionStatus) query.inspectionStatus = params.inspectionStatus;
  return query;
}

export async function fetchVehicles(
  params?: VehiclesFetchParams
): Promise<VehiclesApiResponse> {
  const { data } = await api.get<VehiclesApiResponse>(VEHICLES_ENDPOINT, {
    params: buildParams(params),
  });
  return data;
}
