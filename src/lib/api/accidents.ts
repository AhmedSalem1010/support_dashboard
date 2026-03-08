/**
 * خدمة API حوادث المركبات
 */

import api from './config';
import type {
  FilterVehicleAccidentDto,
  VehicleAccidentListResponse,
  AccidentStatisticsResponse,
} from '@/types/accidents';

const ACCIDENTS_ENDPOINT = '/vehicle-accident';

function buildListParams(params: FilterVehicleAccidentDto): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page != null) query.page = Number(params.page);
  if (params.limit != null) query.limit = Number(params.limit);
  if (params.vehiclePlateName) query.vehiclePlateName = params.vehiclePlateName;
  if (params.vehicleSerialNumber) query.vehicleSerialNumber = params.vehicleSerialNumber;
  if (params.vehicledriverName) query.vehicledriverName = params.vehicledriverName;
  if (params.vehicledriverJisr) query.vehicledriverJisr = params.vehicledriverJisr;
  if (params.accidentStartDate) query.accidentStartDate = params.accidentStartDate;
  if (params.accidentEndDate) query.accidentEndDate = params.accidentEndDate;
  return query;
}

/**
 * جلب قائمة سجلات الحوادث مع التصفية والترقيم
 */
export async function fetchAccidentsList(
  params?: FilterVehicleAccidentDto
): Promise<VehicleAccidentListResponse> {
  const response = await api.get(ACCIDENTS_ENDPOINT, {
    params: buildListParams(params ?? {}),
  });
  
  // الباك اند يُرجع البيانات في response.data مباشرة
  // والبيانات في data.data والـ meta في data.meta
  return {
    data: response.data?.data || [],
    meta: response.data?.meta || {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

/**
 * جلب إحصائيات الحوادث
 */
export async function fetchAccidentsStatistics(): Promise<AccidentStatisticsResponse> {
  const response = await api.get(`${ACCIDENTS_ENDPOINT}/statistics`);
  
  // الباك اند يُرجع البيانات في response.data
  return {
    data: response.data?.data || null,
    error: response.data?.error || null,
    success: response.data?.success ?? true,
    message: response.data?.message || '',
    status: response.data?.status || 200,
  };
}

/**
 * جلب بيانات الحوادث من نظام TAMM وحفظها
 */
export async function syncAccidentsFromTamm(
  serialNumber?: string
): Promise<{ data: any; message: string; status: number; failedVehicles?: Array<{ serialNumber: string; message: string }> }> {
  const { data } = await api.get(`${ACCIDENTS_ENDPOINT}/tamm-system/get-accident-tamm-data`, {
    params: serialNumber ? { serialNumber } : {},
  });
  return data;
}
