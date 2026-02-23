/**
 * أنواع بيانات المعدات والسكن (جرد العهدة)
 */

export type ItemStatus = 'MATCHED' | 'EXTRA' | 'MISSING';
export type ItemInventoryStatus = 'AVAILABLE' | 'NOT_AVAILABLE';
export type EquipmentInventoryStatus = 'check' | 'pending' | 'completed';
export type EquipmentInventoryType = 'authorization' | 'return' | 'inspection';

export interface VehicleEquipmentInventoryItem {
  itemName: string;
  itemCount: number;
  itemStatus: ItemStatus;
  itemInventoryStatus: ItemInventoryStatus;
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
}
