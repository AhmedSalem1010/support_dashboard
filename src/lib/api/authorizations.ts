/**
 * خدمة API التفويضات
 */

import api from './config';
import type {
  AuthorizationsApiResponse,
  AuthorizationsFetchParams,
  LastAuthorizationDataResponse,
  CreateAuthorizationDto,
  CreateAuthorizationResponse,
} from '@/types/authorization';
import { formatDateToISO } from '@/lib/utils/dateUtils';
import { formatPlateNameForApi } from '@/lib/utils/plateUtils';

const AUTHORIZATIONS_ENDPOINT = '/vehicle-authorizations';
/** بيانات المركبة والسائق - مطابق لـ: GET /vehicle-authorizations/support/last-authorization-data?vehiclePlateName=... */
const LAST_AUTHORIZATION_DATA_ENDPOINT = '/vehicle-authorizations/support/last-authorization-data';

function buildParams(params?: AuthorizationsFetchParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (!params) return query;
  if (params.page != null) query.page = String(params.page);
  if (params.limit != null) query.limit = String(params.limit);
  if (params.authorizationType) query.authorizationType = params.authorizationType;
  if (params.authorizationStatus) query.authorizationStatus = params.authorizationStatus;
  
  // تحويل التواريخ إلى صيغة yyyy-MM-dd إذا كانت بصيغة dd/MM/yyyy
  if (params.authorizationStartDate) {
    query.authorizationStartDate = params.authorizationStartDate.includes('/') 
      ? formatDateToISO(params.authorizationStartDate) 
      : params.authorizationStartDate;
  }
  if (params.authorizationEndDate) {
    query.authorizationEndDate = params.authorizationEndDate.includes('/') 
      ? formatDateToISO(params.authorizationEndDate) 
      : params.authorizationEndDate;
  }
  if (params.authorizationEndDateFrom) {
    query.authorizationEndDateFrom = params.authorizationEndDateFrom.includes('/') 
      ? formatDateToISO(params.authorizationEndDateFrom) 
      : params.authorizationEndDateFrom;
  }
  if (params.authorizationEndDateTo) {
    query.authorizationEndDateTo = params.authorizationEndDateTo.includes('/') 
      ? formatDateToISO(params.authorizationEndDateTo) 
      : params.authorizationEndDateTo;
  }
  
  if (params.driverIdReceivedFromName) query.driverIdReceivedFromName = params.driverIdReceivedFromName;
  if (params.vehiclePlateName) query.vehiclePlateName = params.vehiclePlateName;
  if (params.driverName) query.driverName = params.driverName;
  if (params.driverJisrId) query.driverJisrId = params.driverJisrId;
  if (params.userDriverName) query.userDriverName = params.userDriverName;
  if (params.userDriverReceivedFromName) query.userDriverReceivedFromName = params.userDriverReceivedFromName;
  return query;
}

export async function fetchAuthorizations(
  params?: AuthorizationsFetchParams
): Promise<AuthorizationsApiResponse> {
  const { data } = await api.get<AuthorizationsApiResponse>(AUTHORIZATIONS_ENDPOINT, {
    params: buildParams(params),
  });
  return data;
}

/** إلغاء تفويض عبر endpoint تم */
const CANCEL_AUTH_ENDPOINT = `${AUTHORIZATIONS_ENDPOINT}/tamm-system/cancel-authorization`;

export async function cancelAuthorization(vehicleAuthorizationId: string): Promise<void> {
  const { data: result } = await api.patch(CANCEL_AUTH_ENDPOINT, {}, {
    params: { vehicleAuthorizationId },
  });

  if (result.success === false && result.message) {
    throw new Error(result.message);
  }
}

/**
 * جلب آخر تفويض لمركبة حسب رقم اللوحة (بيانات المركبة والسائق).
 * يستدعي: GET /vehicle-authorizations/support/last-authorization-data?vehiclePlateName=...
 * مع هيدر: Authorization: Bearer <token>
 */
export async function fetchLastAuthorizationData(
  vehiclePlateName: string
): Promise<LastAuthorizationDataResponse> {
  const plate = formatPlateNameForApi(vehiclePlateName);
  const { data } = await api.get<LastAuthorizationDataResponse>(LAST_AUTHORIZATION_DATA_ENDPOINT, {
    params: { vehiclePlateName: plate },
  });
  return data;
}

/**
 * إنشاء تفويض جديد
 * يستدعي: POST /vehicle-authorizations
 */
export async function createAuthorization(
  dto: CreateAuthorizationDto
): Promise<CreateAuthorizationResponse> {
  const { data } = await api.post<CreateAuthorizationResponse>(AUTHORIZATIONS_ENDPOINT, dto);
  return data;
}

/**
 * إرسال OTP للتفويض عبر نظام تم (تجديد التفويض)
 * يستدعي: POST /vehicle-authorizations/tamm-system/send-vehicle-authorization?vehicleAuthorizationId=...
 */
export async function sendVehicleAuthorizationOTP(
  vehicleAuthorizationId: string
): Promise<{ success: boolean; message: string; data: any; status: number }> {
  const { data } = await api.post<{ success: boolean; message: string; data: any; status: number }>(
    `${AUTHORIZATIONS_ENDPOINT}/tamm-system/send-vehicle-authorization`,
    {},
    {
      params: { vehicleAuthorizationId },
    }
  );
  return data;
}

/**
 * جلب حالة التفويض من نظام تم
 * GET /vehicle-authorizations/tamm-system/vehicle-authorization?serialNumber=...&iqamahNumber=...
 */
export interface TammVehicleAuthorizationResponse {
  data?: {
    authorizationStatus: string;
    currentDriverName: string;
    lastDriverName: string;
  } | null;
  isAuthorized?: boolean;
  isSameSendDriver?: boolean;
  error?: unknown;
  success?: boolean;
  message?: string;
  status?: number;
}

export async function fetchTammVehicleAuthorization(
  serialNumber: string,
  iqamahNumber: string
): Promise<TammVehicleAuthorizationResponse> {
  const { data } = await api.get<TammVehicleAuthorizationResponse>(
    `${AUTHORIZATIONS_ENDPOINT}/tamm-system/vehicle-authorization`,
    {
      params: { serialNumber, iqamahNumber },
    }
  );
  return data;
}

/**
 * تأكيد OTP للتفويض
 * يستدعي: POST /vehicle-authorizations/tamm-system/otp/verify?vehicleAuthorizationId=...&otp=...
 */
export async function verifyVehicleAuthorizationOTP(
  vehicleAuthorizationId: string,
  otp: string
): Promise<{ success: boolean; message: string; data: any; status: number }> {
  const { data } = await api.post<{ success: boolean; message: string; data: any; status: number }>(
    `${AUTHORIZATIONS_ENDPOINT}/tamm-system/otp/verify`,
    {},
    {
      params: { vehicleAuthorizationId, otp },
    }
  );
  return data;
}
