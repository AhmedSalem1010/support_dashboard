/**
 * أنواع API الصيانة - مطابقة لـ CreateVehicleMaintainceDto في الباكند
 */

export type MaintainceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateVehicleMaintainceDto {
  vehicleId?: string | null;
  vehicleAuthorizationId: string;
  maintainceDate: string;
  maintainceType: string;
  maintainceStatus: MaintainceStatus;
  maintanceCostBearer: string;
  maintanceParts: string;
  maintainceNote: string;
  maintainceImagePath?: string;
  maintainceSupervisorName: string;
  maintainceCost: number;
}

export interface CreateVehicleMaintainceResponse {
  data: unknown | null;
  error: unknown;
  success: boolean;
  message: string;
  status: number;
}

/** مركبة من استجابة قائمة الصيانة */
export interface VehicleMaintainceVehicle {
  id: string;
  plateName: string;
  plateNumber?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
}

/** مستخدم (سائق/مشرف) من استجابة قائمة الصيانة */
export interface VehicleMaintainceUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

/** تفويض مركبة مضمّن في سجل الصيانة */
export interface VehicleMaintainceAuthorization {
  id: string;
  vehicleId: string;
  vehicle?: VehicleMaintainceVehicle | null;
  driver?: VehicleMaintainceUser | null;
  userDriver?: VehicleMaintainceUser | null;
}

/** عنصر من قائمة سجلات الصيانة (استجابة الباكند) */
export interface VehicleMaintainceItem {
  id: string;
  vehicleId: string;
  vehicleAuthorizationId: string;
  maintanceCostBearer: string;
  maintainceDate: string;
  maintainceType: string;
  maintainceStatus: string;
  maintainceDescription?: string | null;
  maintainceCost: string;
  maintainceNote?: string | null;
  maintanceParts: string;
  vehicleAuthorization?: VehicleMaintainceAuthorization | null;
  maintanceSupervisor?: VehicleMaintainceUser | null;
  officeSupervisor?: VehicleMaintainceUser | null;
  maintainceImage?: unknown | null;
}

export interface MaintenanceListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VehicleMaintainceListResponse {
  data: VehicleMaintainceItem[];
  meta: MaintenanceListMeta;
}

/** معاملات تصفية قائمة الصيانة - مطابقة لـ FilterVehicleMaintainceDto */
export interface FilterVehicleMaintainceDto {
  page?: number;
  limit?: number;
  vehiclePlateName?: string;
  vehicleDriverName?: string;
  maintainceDate?: string;
  maintainceType?: string;
  maintainceStatus?: string;
  maintanceCostBearer?: string;
  maintanceParts?: string;
  maintainceSupervisorName?: string;
  officeSupervisorName?: string;
}
