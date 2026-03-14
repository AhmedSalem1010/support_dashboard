/**
 * خدمة API مخالفات المركبات
 * GET /vehicle-alerts
 */

import api from './config';
import type { OperationType } from '@/types/operationAlerts';

export interface VehicleAlertApiItem {
  id: string;
  vehicleId: string;
  authorizationId: string | null;
  idleDuration: number;
  movingDuration: number;
  distance: number;
  maxSpeed: number;
  operationDate: string;
  operationType: number;
  vehicle?: {
    id: string;
    plateName: string;
    serialNumber?: string;
    vehicleEngineerId?: string;
  } | null;
  authorization?: {
    id: string;
    tammAuthorizedId?: string;
    driver?: { name: string } | null;
    userDriver?: { name?: string } | null;
    team?: { name?: string } | null;
  } | null;
}

export interface VehicleAlertsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VehicleAlertsResponse {
  data: VehicleAlertApiItem[];
  meta: VehicleAlertsMeta;
}

export interface FetchVehicleAlertsParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  operationType?: OperationType; // 1 | 2 | 3 | 4 | 5
  vehiclePlateName?: string;
  driverName?: string;
  userDriverName?: string;
}

function formatDateForApi(dateStr: string | undefined): string | undefined {
  if (!dateStr?.trim()) return undefined;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return dateStr;
  }
}

export async function fetchVehicleAlerts(
  params?: FetchVehicleAlertsParams
): Promise<VehicleAlertsResponse> {
  const query: Record<string, string | number> = {};
  if (params?.page != null) query.page = params.page;
  if (params?.limit != null) query.limit = params.limit;
  const fromDate = formatDateForApi(params?.dateFrom);
  if (fromDate) query.dateFrom = fromDate;
  const toDate = formatDateForApi(params?.dateTo);
  if (toDate) query.dateTo = toDate;
  if (params?.operationType != null && [1, 2, 3, 4, 5].includes(params.operationType))
    query.operationType = params.operationType;
  if (params?.vehiclePlateName?.trim()) query.vehiclePlateName = params.vehiclePlateName.trim();
  if (params?.driverName?.trim()) query.driverName = params.driverName.trim();
  if (params?.userDriverName?.trim()) query.userDriverName = params.userDriverName.trim();

  const { data } = await api.get<VehicleAlertsResponse>('/vehicle-alerts', {
    params: query,
  });
  return data;
}
