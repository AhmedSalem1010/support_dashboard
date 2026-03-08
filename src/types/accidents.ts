/**
 * أنواع API الحوادث
 */

export type AccidentStatus = 'open' | 'closed' | 'in_progress';
export type AccidentSeverity = 'minor' | 'moderate' | 'severe';
export type AccidentCostBearer = 'company' | 'driver' | 'vehicle';

export interface VehicleAccidentVehicle {
  id: string;
  plateName: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
}

export interface VehicleAccidentDriver {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  jisrId?: string;
}

export interface VehicleAccidentAuthorization {
  id: string;
  vehicleId: string;
  vehicle?: VehicleAccidentVehicle | null;
  driver?: VehicleAccidentDriver | null;
  userDriver?: VehicleAccidentDriver | null;
}

export interface VehicleAccidentItem {
  id: string;
  accidentTammNumber: string;
  vehicleId: string;
  vehicleAuthorizationId: string | null;
  accidentDate: string;
  accidentTime: string | null;
  accidentTypeDesc: string | null;
  causeOfAccidentDesc: string | null;
  officeDescription: string | null;
  accidentStatus: string | null;
  accidentSeverity: string | null;
  accidentDescription: string | null;
  accidentLocation: string | null;
  accidentNote: string | null;
  accidentCost: string | null;
  accidentCostBearer: string | null;
  vehicleAuthorization?: VehicleAccidentAuthorization | null;
}

export interface AccidentListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VehicleAccidentListResponse {
  data: VehicleAccidentItem[];
  meta: AccidentListMeta;
}

export interface FilterVehicleAccidentDto {
  page?: number;
  limit?: number;
  vehiclePlateName?: string;
  vehicleSerialNumber?: string;
  vehicledriverName?: string;
  vehicledriverJisr?: string;
  accidentStartDate?: string;
  accidentEndDate?: string;
}

export interface AccidentStatistics {
  totalAccidents: number;
  thisMonthAccidents: number;
  openAccidents: number;
  closedAccidents: number;
  accidentsBySeverity: {
    minor: number;
    moderate: number;
    severe: number;
  } | null;
  accidentsByMonth: Array<{
    month: number;
    monthName: string;
    count: number;
  }>;
  highestMonth: {
    month: number;
    monthName: string;
    count: number;
  } | null;
  accidentsByVehicle: Array<{
    vehicleId: string;
    vehiclePlateName: string;
    count: number;
  }>;
  accidentsByDriver: Array<{
    driverId: string;
    driverName: string;
    count: number;
  }>;
}

export interface AccidentStatisticsResponse {
  data: AccidentStatistics | null;
  error: any;
  success: boolean;
  message: string;
  status: number;
}
