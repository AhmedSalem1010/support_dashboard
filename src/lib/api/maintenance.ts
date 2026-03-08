/**
 * خدمة API صيانة المركبات
 */

import api from './config';
import type {
  CreateVehicleMaintainceDto,
  CreateVehicleMaintainceResponse,
  UpdateVehicleMaintainceDto,
  UpdateVehicleMaintainceResponse,
  FilterVehicleMaintainceDto,
  VehicleMaintainceListResponse,
  MaintenanceStatisticsResponse,
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

/**
 * تحديث سجل صيانة مركبة
 */
export async function updateVehicleMaintaince(
  maintainceId: string,
  dto: UpdateVehicleMaintainceDto
): Promise<UpdateVehicleMaintainceResponse> {
  const { data } = await api.patch<UpdateVehicleMaintainceResponse>(
    `${MAINTENANCE_ENDPOINT}/${maintainceId}`,
    dto
  );
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

/**
 * جلب إحصائيات الصيانة
 */
export async function fetchMaintenanceStatistics(): Promise<MaintenanceStatisticsResponse> {
  const { data } = await api.get<MaintenanceStatisticsResponse>(`${MAINTENANCE_ENDPOINT}/statistics`);
  return data;
}

/**
 * تحويل base64 إلى File object
 */
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * رفع صور الصيانة إلى الباك اند
 */
export async function uploadMaintenanceImages(
  maintainceId: string,
  imagesData: Record<string, string>
): Promise<{ success: boolean; message?: string }> {
  const imageEntries = Object.entries(imagesData);
  console.log('🔍 uploadMaintenanceImages called with:', { maintainceId, imageCount: imageEntries.length });
  
  if (!imageEntries.length) {
    console.log('⚠️ No images to upload');
    return { success: true };
  }

  const formData = new FormData();
  formData.append('maintainceId', maintainceId);
  
  imageEntries.forEach(([itemId, base64], index) => {
    const file = base64ToFile(base64, `repair-${itemId}-${index}.jpg`);
    formData.append('images', file);
    console.log(`📎 Added image ${index + 1}:`, { itemId, fileName: file.name, size: file.size });
  });

  try {
    console.log('📤 Sending POST request to /vehicle-accident-images/upload');
    const response = await api.post('/vehicle-accident-images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Upload successful:', response.data);
    return { success: true, message: 'تم رفع الصور بنجاح' };
  } catch (error) {
    console.error('❌ Error uploading maintenance images:', error);
    return { success: false, message: 'فشل رفع الصور' };
  }
}
