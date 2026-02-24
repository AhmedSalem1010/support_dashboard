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
/** بيانات معدات المركبة حسب رقم اللوحة: GET /vehicle-equipment-inventory/api/vehicle-info?vehiclePlateName=... */
const VEHICLE_INFO_ENDPOINT = `${EQUIPMENT_ENDPOINT}/api/vehicle-info`;
/** حفظ/تحديث حالة فحص الجرد: POST /vehicle-equipment-inventory/api/check-equipment-inventory-status */
const CHECK_EQUIPMENT_INVENTORY_STATUS_ENDPOINT = `${EQUIPMENT_ENDPOINT}/api/check-equipment-inventory-status`;

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
  if (params.supervisorName) query.supervisorName = params.supervisorName;
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
 * يربط مع: POST /vehicle-equipment-inventory/api/check-equipment-inventory-status
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
