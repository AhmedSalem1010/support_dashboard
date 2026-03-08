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
  vehicleAuthorizationTammResponseXConversition?: string;
  /** السائق المستخدم (يستخدم عندما يكون driver فارغاً) */
  userDriver?: { id?: string; name?: string } | null;
  /** السائق المستلم منه */
  userDriverReceivedFrom?: { id?: string; name?: string } | null;
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

/** استجابة آخر تفويض لمركبة (بيانات المركبة والسائق) */
export interface LastAuthorizationVehicle {
  id: string;
  vehicleTammId?: string;
  plateName: string;
  plateNumber?: string;
  serialNumber?: string;
  plateText1?: string;
  plateText2?: string;
  plateText3?: string;
  vehicleType?: string;
  vehicleColor?: string;
  istimarahExpiry?: string;
  istimarahIssue?: string;
  istimarahStatus?: string;
  inspectionExpiry?: string;
  inspectionStatus?: string;
  vehicleInsuranceStatus?: string;
  insuranceExpiry?: string;
  chassisNumber?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  vehicleStatus?: string;
}

export interface LastAuthorizationDriverEmployeeData {
  id?: string;
  workerId?: string;
  iqamahNumber?: string;
  birthDate?: string;
  department?: string | null;
  jisrId?: string;
  licenseStatus?: string;
  licenseDate?: string;
  personalReceived?: string;
}

export interface LastAuthorizationDriver {
  id: string;
  name: string;
  nationality?: string | null;
  jisrId?: string | null;
  role?: string;
  team?: unknown | null;
  employeeData?: LastAuthorizationDriverEmployeeData | null;
}

export interface LastAuthorizationDataItem {
  id: string;
  vehicleId: string;
  tammAuthorizedId?: string;
  authorizationType?: string;
  authorizationStatus?: string;
  authorizationStartDate?: string;
  authorizationEndDate?: string;
  authorizationDaysCount?: number;
  vehicleAuthAcceptanceStatus?: string;
  supervisorId?: string;
  /** عدد الفريق / العمال (من نفس اند بوينت بيانات المركبة والسائق) */
  teamWorkerCount?: number;
  /** قد يرجعه الباكند بهذا الاسم بدل teamWorkerCount */
  workersCount?: number;
  /** رقم لوحة المركبة (يأتي مباشرة من API) */
  vehiclePlateName?: string;
  /** اسم السائق (يأتي مباشرة من API كـ string) */
  driverName?: string;
  /** رقم جسر السائق (يأتي مباشرة من API) */
  driverJisrId?: string | null;
  /** نوع السائق (userDriver أو driver) */
  driverType?: 'userDriver' | 'driver' | string;
  vehicle: LastAuthorizationVehicle;
  driver: LastAuthorizationDriver | null;
  /** السائق المستخدم (يستخدم عندما يكون driver فارغاً) */
  userDriver?: { id?: string; name?: string } | null;
  /** السائق المستلم منه */
  userDriverReceivedFrom?: { id?: string; name?: string } | null;
  supervisor?: { id?: string; name?: string } | null;
}

export interface LastAuthorizationDataResponse {
  data: LastAuthorizationDataItem | null;
  error: unknown;
  success: boolean;
  message?: string;
  status?: number;
}

/** DTO لإنشاء تفويض جديد - يطابق CreateAuthorizationDto في الباك اند */
export interface CreateAuthorizationDto {
  vehiclePlateName: string;
  driverNameReceivedFrom?: string;
  supervisorName?: string;
  driverName: string;
  authorizationDaysCount: number;
  tammAuthorizedId?: string;
  authType?: 'local_only' | 'tamm_and_local';
  authStatus?: string;
  authorizationStartDate: Date | string;
  authorizationEndDate?: Date | string;
  vehicleAcceptanceStatus?: string;
  vehicleAuthorizationDescription?: string;
  vehicleAuthorizationTammNumber?: string;
  vehicleAuthorizationTammResponse?: string;
  vehicleAuthorizationTammResponseXConversition?: string;
  vehicleAuthorizationTammSentOTPCode?: string;
  driverNameInTammSystem?: string;
}

/** استجابة إنشاء تفويض جديد */
export interface CreateAuthorizationResponse {
  data: AuthorizationApiItem | Record<string, any> | null;
  error: unknown;
  success: boolean;
  message: string;
  status: number;
}
