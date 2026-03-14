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

/** تنسيق التاريخ بصيغة yyyy-MM-dd */
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

function buildListParams(params: FilterVehicleAccidentDto): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page != null) query.page = Number(params.page);
  if (params.limit != null) query.limit = Number(params.limit);
  if (params.vehiclePlateName) query.vehiclePlateName = params.vehiclePlateName;
  if (params.vehicleSerialNumber) query.vehicleSerialNumber = params.vehicleSerialNumber;
  if (params.vehicledriverName) query.vehicledriverName = params.vehicledriverName;
  if (params.vehicledriverJisr) query.vehicledriverJisr = params.vehicledriverJisr;
  const startDate = formatDateForApi(params.accidentStartDate);
  if (startDate) query.accidentStartDate = startDate;
  const endDate = formatDateForApi(params.accidentEndDate);
  if (endDate) query.accidentEndDate = endDate;
  if (params.accidentStatus) query.accidentStatus = params.accidentStatus;
  if (params.accidentSeverity) query.accidentSeverity = params.accidentSeverity;
  if (params.accidentCostBearer) query.accidentCostBearer = params.accidentCostBearer;
  if (params.accidentTammNumber) query.accidentTammNumber = params.accidentTammNumber;
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

export interface UpdateVehicleAccidentStatusParams {
  accidentTammNumber: string;
  accidentStatus?: string;
  accidentSeverity?: string;
  accidentCostBearer?: string;
  processNotes?: string;
}

/**
 * تحديث حالة الحادث (إغلاق، خطورة، تحميل التكلفة)
 * PATCH /vehicle-accident/support/update-vehicle-status
 * يُرسل الحقول في body الطلب.
 */
export async function updateVehicleAccidentStatus(
  params: UpdateVehicleAccidentStatusParams
): Promise<{ success: boolean; data?: unknown; message?: string; error?: unknown }> {
  const body: Record<string, string> = {
    accidentTammNumber: params.accidentTammNumber,
  };
  if (params.accidentStatus != null) body.accidentStatus = params.accidentStatus;
  if (params.accidentSeverity != null) body.accidentSeverity = params.accidentSeverity;
  if (params.accidentCostBearer != null) body.accidentCostBearer = params.accidentCostBearer;
  if (params.processNotes != null) body.processNotes = params.processNotes;

  const response = await api.patch(`${ACCIDENTS_ENDPOINT}/support/update-vehicle-status`, body);
  return response.data ?? { success: true };
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
