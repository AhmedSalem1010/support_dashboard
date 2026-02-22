/**
 * أنواع البيانات من واجهة API المركبات
 */

export interface VehicleApiResponse {
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
  istimarahExpiry: string | null;
  istimarahIssue: string | null;
  istimarahStatus: string;
  inspectionExpiry: string | null;
  inspectionStatus: string | null;
  vehicleInsuranceStatus: string;
  insuranceExpiry: string | null;
  chassisNumber: string;
  manufacturer: string;
  model: string;
  year: number;
  vehiclePurchasePrice: number | null;
  vehiclePurchaseDate: string | null;
  vehicleStatus: string;
}

export interface VehiclesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VehiclesApiResponse {
  data: VehicleApiResponse[];
  meta: VehiclesMeta;
}

export interface VehiclesFetchParams {
  page?: number;
  limit?: number;
  plateName?: string;
  manufacturer?: string;
  insuranceStatus?: string;
  status?: string;
  serialNumber?: string;
  istimarahStatus?: string;
  inspectionStatus?: string;
}
