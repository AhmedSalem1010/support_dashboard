/**
 * خدمة API المعدات والسكن (جرد العهدة)
 */

import api, { API_BASE_URL, getAuthToken } from './config';
import { formatPlateNameForApi } from '@/lib/utils/plateUtils';
import type { VehicleInfoRequestInfo } from '@/types/equipment';
import type {
  CheckEquipmentInventoryStatusDto,
  CheckEquipmentInventoryStatusResponse,
  CreateVehicleEquipmentInventoryDto,
  CreateVehicleEquipmentInventoryResponse,
  EquipmentInventoryApiResponse,
  EquipmentInventoryFetchParams,
  VehicleInfoItem,
} from '@/types/equipment';

const EQUIPMENT_ENDPOINT = '/vehicle-equipment-inventory';
/** بيانات معدات المركبة حسب رقم اللوحة: GET /vehicle-equipment-inventory/support/vehicle-info?vehiclePlateName=... */
const VEHICLE_INFO_ENDPOINT = `${EQUIPMENT_ENDPOINT}/support/vehicle-info`;
/** حفظ/تحديث حالة فحص الجرد: POST /vehicle-equipment-inventory/support/check-equipment-inventory-status */
const CHECK_EQUIPMENT_INVENTORY_STATUS_ENDPOINT = `${EQUIPMENT_ENDPOINT}/support/check-equipment-inventory-status`;

function buildParams(params?: EquipmentInventoryFetchParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (!params) return query;
  if (params.page != null) query.page = String(params.page);
  if (params.limit != null) query.limit = String(params.limit);
  if (params.equipmentInventoryStatus) query.equipmentInventoryStatus = params.equipmentInventoryStatus;
  if (params.equipmentInventoryType) query.equipmentInventoryType = params.equipmentInventoryType;
  if (params.vehicleAuthorizationId) query.vehicleAuthorizationId = params.vehicleAuthorizationId;
  if (params.supervisorId) query.supervisorId = params.supervisorId;
  if (params.vehiclePlateName) query.vehiclePlateName = params.vehiclePlateName;
  if (params.vehicleSerialNumber) query.vehicleSerialNumber = params.vehicleSerialNumber;
  if (params.driverName) query.driverName = params.driverName;
  if (params.userDriverName) query.userDriverName = params.userDriverName;
  if (params.supervisorName) query.supervisorName = params.supervisorName;
  if (params.createdAt) query.createdAt = params.createdAt;
  return query;
}

export async function fetchEquipmentInventories(
  params?: EquipmentInventoryFetchParams
): Promise<EquipmentInventoryApiResponse> {
  const { data } = await api.get<EquipmentInventoryApiResponse>(EQUIPMENT_ENDPOINT, {
    params: buildParams(params),
  });
  return data;
}

export async function fetchEquipmentInventoryById(id: string): Promise<any> {
  const { data } = await api.get(`${EQUIPMENT_ENDPOINT}/${id}`);
  return data;
}

const UPDATE_EQUIPMENT_INVENTORY_STATUS_ENDPOINT = `${EQUIPMENT_ENDPOINT}/api/update-equipment-inventory-status`;

/**
 * تحديث حالة الجرد (قبول/رفض) مع الملاحظات
 * PATCH /vehicle-equipment-inventory/support/update-equipment-inventory-status
 * Body: { equipmentInventoryId, equipmentInventoryStatus?, equipmentInventoryNote? }
 */
export async function updateEquipmentInventoryStatus(
  inventoryId: string,
  equipmentInventoryStatus: 'accepted' | 'rejected',
  equipmentInventoryNote?: string
): Promise<{ data?: any; success: boolean; message?: string }> {
  const body: { equipmentInventoryId: string; equipmentInventoryStatus: string; equipmentInventoryNote?: string } = {
    equipmentInventoryId: inventoryId,
    equipmentInventoryStatus,
  };
  if (equipmentInventoryNote?.trim()) body.equipmentInventoryNote = equipmentInventoryNote.trim();
  const { data } = await api.patch(UPDATE_EQUIPMENT_INVENTORY_STATUS_ENDPOINT, body);
  return data ?? { success: false };
}

/**
 * جلب معلومات معدات المركبة حسب رقم اللوحة.
 * يستدعى عند اختيار المركبة في التفويض / فحص المعدات / جرد العهدة.
 * الاستجابة: مصفوفة { itemName, itemCount, itemStatus }
 */
/** شكل استجابة vehicle-info من السيرفر: { data: { id, items }, success, error, message, status } */
interface VehicleInfoApiResponse {
  data?: { id?: string; items?: VehicleInfoItem[] };
  items?: VehicleInfoItem[];
  success?: boolean;
  error?: unknown;
  message?: string;
  status?: number;
}

export async function fetchVehicleInfo(
  vehiclePlateName: string
): Promise<VehicleInfoItem[]> {
  const plate = formatPlateNameForApi(vehiclePlateName);
  const { data } = await api.get<VehicleInfoItem[] | VehicleInfoApiResponse>(
    VEHICLE_INFO_ENDPOINT,
    { params: { vehiclePlateName: plate } }
  );
  if (Array.isArray(data)) return data;
  const obj = data as VehicleInfoApiResponse | null;
  if (!obj) return [];
  if (obj.data && Array.isArray(obj.data.items)) return obj.data.items;
  if (Array.isArray(obj.data)) return obj.data;
  if (Array.isArray(obj.items)) return obj.items;
  return [];
}

/**
 * بناء معلومات الريكوست المرسل لعرضها في الحوار (مع إخفاء جزء من التوكن)
 */
export function getVehicleInfoRequestInfo(vehiclePlateName: string): VehicleInfoRequestInfo {
  const plate = formatPlateNameForApi(vehiclePlateName);
  const url = `${API_BASE_URL}${VEHICLE_INFO_ENDPOINT}?vehiclePlateName=${encodeURIComponent(plate)}`;
  const token = getAuthToken();
  const authHeader = token ? 'Bearer ***' : '(لا يوجد توكن)';
  return { method: 'GET', url, headers: { Authorization: authHeader } };
}

/**
 * إرسال نتيجة فحص المعدات (فحص المركبات).
 * يربط مع: POST /vehicle-equipment-inventory/support/check-equipment-inventory-status
 */
export async function checkEquipmentInventoryStatus(
  dto: CheckEquipmentInventoryStatusDto
): Promise<CheckEquipmentInventoryStatusResponse> {
  const { data } = await api.post<CheckEquipmentInventoryStatusResponse>(
    CHECK_EQUIPMENT_INVENTORY_STATUS_ENDPOINT,
    dto
  );
  return data;
}

/**
 * إنشاء سجل جرد عهدة (جرد المعدات).
 * يربط مع: POST /vehicle-equipment-inventory
 * يتطلب: vehicleAuthorizationId (من اختيار المركبة)، equipmentInventoryType: 'inventory'، supervisorId.
 */
export async function createVehicleEquipmentInventory(
  dto: CreateVehicleEquipmentInventoryDto
): Promise<CreateVehicleEquipmentInventoryResponse> {
  const { data } = await api.post<CreateVehicleEquipmentInventoryResponse>(
    EQUIPMENT_ENDPOINT,
    dto
  );
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
 * رفع صور/فيديو فحص المعدات إلى الباك اند
 */
export async function uploadEquipmentInventoryImages(
  vehicleEquipmentInventoryId: string,
  images?: File[],
  video?: File | null
): Promise<{ success: boolean; message?: string }> {
  console.log('🔍 uploadEquipmentInventoryImages called with:', { 
    vehicleEquipmentInventoryId, 
    imageCount: images?.length || 0, 
    hasVideo: !!video 
  });

  if (!images?.length && !video) {
    console.log('⚠️ No files to upload');
    return { success: true };
  }

  try {
    // رفع الصور
    if (images && images.length > 0) {
      const formData = new FormData();
      formData.append('vehicleEquipmentInventoryId', vehicleEquipmentInventoryId);
      
      images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`📎 Added image ${index + 1}:`, { name: image.name, size: image.size });
      });

      console.log('📤 Sending POST request to /vehicle-accident-images/upload');
      const response = await api.post('/vehicle-accident-images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Images upload successful:', response.data);
    }

    // رفع الفيديو
    if (video) {
      const formData = new FormData();
      formData.append('vehicleEquipmentInventoryId', vehicleEquipmentInventoryId);
      formData.append('video', video);
      console.log('📹 Added video:', { name: video.name, size: video.size });

      console.log('📤 Sending POST request to /vehicle-accident-images/upload-video');
      const response = await api.post('/vehicle-accident-images/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Video upload successful:', response.data);
    }

    return { success: true, message: 'تم رفع الملفات بنجاح' };
  } catch (error) {
    console.error('❌ Error uploading equipment inventory files:', error);
    return { success: false, message: 'فشل رفع الملفات' };
  }
}
