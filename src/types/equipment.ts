/**
 * أنواع بيانات المعدات والسكن (جرد العهدة)
 */

export type ItemStatus = 'MATCHED' | 'EXTRA' | 'MISSING';
/** حالة صنف الجرد كما يرجعها الباكند في items[].itemInventoryStatus */
export type ItemInventoryStatusApi = 'extra' | 'ok' | 'missing';
export type ItemInventoryStatus = 'AVAILABLE' | 'NOT_AVAILABLE';
/** يطابق enum EquipmentInventoryStatus في الباكند */
export type EquipmentInventoryStatus = 'check' | 'not_check' | 'accepted' | 'rejected';
/** يطابق enum EquipmentInventoryType في الباكند */
export type EquipmentInventoryType =
  | 'inventory'
  | 'home_check'
  | 'weekly_check'
  | 'monthly_check'
  | 'yearly_check'
  | 'authorization';

export interface VehicleEquipmentInventoryItem {
  itemName: string;
  itemCount: number;
  itemStatus: string;
  /** حالة الصنف في الجرد: زائد / مطابق / ناقص (قد لا يكون موجوداً في بعض الأصناف) */
  itemInventoryStatus?: ItemInventoryStatusApi;
}

export interface User {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  department: string | null;
  jisrId: string | null;
  type: string;
  number: number;
}

export interface Vehicle {
  id: string;
  vehicleTammId: string;
  plateName: string;
  plateNumber: string;
  serialNumber: string;
  plateText1: string;
  plateText2: string;
  plateText3: string;
  vehicleType: string;
  vehicleColor: string;
  manufacturer: string;
  model: string;
  year: number;
  vehicleStatus: string;
}

export interface VehicleAuthorization {
  id: string;
  vehicleId: string;
  authorizationType: string;
  authorizationStatus: string;
  authorizationStartDate: string;
  authorizationEndDate: string;
  authorizationDaysCount: number;
  vehicleAuthAcceptanceStatus: string;
  vehicleAuthorizationDescription: string;
  supervisorId: string;
  driverId: string | null;
  userDriverId: string;
  vehicle: Vehicle;
  driver: User | null;
  userDriver: User;
  userDriverReceivedFrom: User;
}

export interface VehicleEquipmentInventory {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  vehicleAuthorizationId: string;
  supervisorId: string;
  items: VehicleEquipmentInventoryItem[];
  equipmentInventoryDescription: string | null;
  equipmentInventoryNote: string | null;
  equipmentInventoryStatus: EquipmentInventoryStatus;
  equipmentInventoryType: EquipmentInventoryType;
  equipmentInventoryImageId: string | null;
  equipmentInventoryVideoId: string | null;
  vehicleAuthorization: VehicleAuthorization;
  supervisor: User;
}

export interface EquipmentInventoryApiResponse {
  data: VehicleEquipmentInventory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface EquipmentInventoryFetchParams {
  page?: number;
  limit?: number;
  equipmentInventoryStatus?: EquipmentInventoryStatus;
  equipmentInventoryType?: EquipmentInventoryType;
  vehicleAuthorizationId?: string;
  supervisorId?: string;
  vehiclePlateName?: string;
  vehicleSerialNumber?: string;
  driverName?: string;
  supervisorName?: string;
}

/** عنصر من استجابة vehicle-info (معلومات معدات المركبة حسب اللوحة) */
export interface VehicleInfoItem {
  itemName: string;
  itemCount: number;
  itemStatus: string;
}

/** معلومات الريكوست المرسل (للعرض في الحوار) */
export interface VehicleInfoRequestInfo {
  method: string;
  url: string;
  headers?: Record<string, string>;
}

/** عنصر حالة الفحص للمعدة (مرسل لـ check-equipment-inventory-status) */
export interface EquipmentInventoryCheckStatusItem {
  itemName: string;
  itemStatus: string;
}

/** جسم طلب POST check-equipment-inventory-status (أسماء الحقول كما في الباكند) */
export interface CheckEquipmentInventoryStatusDto {
  vehiclePlateName?: string;
  vhecleAuthorizationId?: string;
  equipmentInvetoryCheckStatus: EquipmentInventoryCheckStatusItem[];
  equipmentInventoryType?: string;
  equipmentInventoryDescription?: string;
  equipmentInventoryNote?: string;
  equipmentInventoryImageId?: string;
  equipmentInventoryVideoId?: string;
}

/** استجابة check-equipment-inventory-status */
export interface CheckEquipmentInventoryStatusResponse {
  data: VehicleEquipmentInventory | null;
  error: unknown;
  success: boolean;
  message: string;
  status: number;
}

/** عنصر صنف في طلب إنشاء جرد العهدة (يطابق VehicleEquipmentInventoryItemDto) */
export interface CreateVehicleEquipmentInventoryItemDto {
  itemName: string;
  itemCount: number;
  itemStatus: string;
  itemInventoryStatus?: string;
}

/** جسم طلب إنشاء جرد العهدة (يطابق CreateVehicleEquipmentInventoryDto) */
export interface CreateVehicleEquipmentInventoryDto {
  vehicleAuthorizationId: string;
  equipmentInventoryType: EquipmentInventoryType;
  supervisorId: string;
  items?: CreateVehicleEquipmentInventoryItemDto[];
  equipmentInventoryNote?: string;
  equipmentInventoryStatus?: string;
  equipmentInventoryImageId?: string;
  equipmentInventoryVideoId?: string;
  equipmentInventoryDescription?: string;
  teamWorkerCount?: number;
}

/** استجابة إنشاء جرد العهدة */
export interface CreateVehicleEquipmentInventoryResponse {
  data: VehicleEquipmentInventory | null;
  error: unknown;
  success: boolean;
  message: string;
  status: number;
}
