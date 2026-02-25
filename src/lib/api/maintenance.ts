/**
 * خدمة API صيانة المركبات
 */

import api from './config';
import type {
  CreateVehicleMaintainceDto,
  CreateVehicleMaintainceResponse,
  FilterVehicleMaintainceDto,
  VehicleMaintainceListResponse,
} from '@/types/maintenance';

/** إذا كان الباكند يستخدم البادئة العالمية api فغيّر إلى '/api/vehicle-maintaince' */
const MAINTENANCE_ENDPOINT = '/vehicle-maintaince';

/**
 * إنشاء سجل صيانة مركبة
 */
export async function createVehicleMaintaince(
  dto: CreateVehicleMaintainceDto
): Promise<CreateVehicleMaintainceResponse> {
  const { data } = await api.post<CreateVehicleMaintainceResponse>(MAINTENANCE_ENDPOINT, dto);
  return data;
}

function buildListParams(params: FilterVehicleMaintainceDto): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page != null) query.page = params.page;
  if (params.limit != null) query.limit = params.limit;
  if (params.vehiclePlateName) query.vehiclePlateName = params.vehiclePlateName;
  if (params.vehicleDriverName) query.vehicleDriverName = params.vehicleDriverName;
  if (params.maintainceDate) query.maintainceDate = params.maintainceDate;
  if (params.maintainceType) query.maintainceType = params.maintainceType;
  if (params.maintainceStatus) query.maintainceStatus = params.maintainceStatus;
  if (params.maintanceCostBearer) query.maintanceCostBearer = params.maintanceCostBearer;
  if (params.maintanceParts) query.maintanceParts = params.maintanceParts;
  if (params.maintainceSupervisorName) query.maintainceSupervisorName = params.maintainceSupervisorName;
  if (params.officeSupervisorName) query.officeSupervisorName = params.officeSupervisorName;
  return query;
}

/**
 * جلب قائمة سجلات الصيانة مع التصفية والترقيم
 */
export async function fetchMaintenanceList(
  params?: FilterVehicleMaintainceDto
): Promise<VehicleMaintainceListResponse> {
  const { data } = await api.get<VehicleMaintainceListResponse>(MAINTENANCE_ENDPOINT, {
    params: buildListParams(params ?? {}),
  });
  return data;
}
