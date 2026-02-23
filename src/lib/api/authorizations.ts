/**
 * خدمة API التفويضات
 */

import api from './config';
import type { AuthorizationsApiResponse, AuthorizationsFetchParams } from '@/types/authorization';
import { formatDateToISO } from '@/lib/utils/dateUtils';

const AUTHORIZATIONS_ENDPOINT = '/vehicle-authorizations';

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
  const { data: result } = await api.patch(CANCEL_AUTH_ENDPOINT, null, {
    params: { vehicleAuthorizationId },
  });

  if (result.success === false && result.message) {
    throw new Error(result.message);
  }
}
