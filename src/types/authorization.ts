/**
 * أنواع بيانات API التفويضات
 */

export interface AuthorizationDriver {
  name: string;
  jisrId?: string;
  team?: { name: string; phone?: string };
  employeeData?: { jisrId?: string; personalReceived?: string };
}

export interface AuthorizationVehicle {
  plateName: string;
  serialNumber: string;
  vehicleType: string;
}

export interface AuthorizationApiItem {
  id: string;
  vehicleId: string;
  tammAuthorizedId: string;
  authorizationType: string;
  authorizationStatus: string;
  authorizationStartDate: string;
  authorizationEndDate: string;
  authorizationDaysCount: number;
  vehicleAuthAcceptanceStatus: string;
  driver: AuthorizationDriver | null;
  vehicle: AuthorizationVehicle;
  driverReceivedFrom: AuthorizationDriver | null;
  supervisor: unknown | null;
}

export interface AuthorizationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuthorizationsApiResponse {
  data: AuthorizationApiItem[];
  meta: AuthorizationMeta;
}

export interface AuthorizationsFetchParams {
  page?: number;
  limit?: number;
  authorizationType?: string;
  authorizationStatus?: string;
  authorizationStartDate?: string;
  authorizationEndDate?: string;
  authorizationEndDateFrom?: string;
  authorizationEndDateTo?: string;
  driverIdReceivedFromName?: string;
  vehiclePlateName?: string;
  driverName?: string;
  driverJisrId?: string;
  userDriverName?: string;
  userDriverReceivedFromName?: string;
}
