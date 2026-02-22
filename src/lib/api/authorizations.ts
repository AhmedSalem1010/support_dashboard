/**
 * خدمة API التفويضات
 */

import { apiConfig, getApiHeaders } from './config';
import type { AuthorizationsApiResponse, AuthorizationsFetchParams } from '@/types/authorization';

const AUTHORIZATIONS_ENDPOINT = '/vehicle-authorizations';

function buildUrl(params?: AuthorizationsFetchParams): string {
  const url = new URL(`${apiConfig.baseUrl}${AUTHORIZATIONS_ENDPOINT}`);
  if (params) {
    if (params.page != null) url.searchParams.set('page', String(params.page));
    if (params.limit != null) url.searchParams.set('limit', String(params.limit));
    if (params.authorizationType) url.searchParams.set('authorizationType', params.authorizationType);
    if (params.authorizationStatus) url.searchParams.set('authorizationStatus', params.authorizationStatus);
    if (params.authorizationStartDate) url.searchParams.set('authorizationStartDate', params.authorizationStartDate);
    if (params.authorizationEndDate) url.searchParams.set('authorizationEndDate', params.authorizationEndDate);
    if (params.authorizationEndDateFrom) url.searchParams.set('authorizationEndDateFrom', params.authorizationEndDateFrom);
    if (params.authorizationEndDateTo) url.searchParams.set('authorizationEndDateTo', params.authorizationEndDateTo);
    if (params.driverIdReceivedFromName) url.searchParams.set('driverIdReceivedFromName', params.driverIdReceivedFromName);
    if (params.vehiclePlateName) url.searchParams.set('vehiclePlateName', params.vehiclePlateName);
    if (params.driverName) url.searchParams.set('driverName', params.driverName);
    if (params.driverJisrId) url.searchParams.set('driverJisrId', params.driverJisrId);
    if (params.userDriverName) url.searchParams.set('userDriverName', params.userDriverName);
    if (params.userDriverReceivedFromName) url.searchParams.set('userDriverReceivedFromName', params.userDriverReceivedFromName);
  }
  return url.toString();
}

export async function fetchAuthorizations(
  params?: AuthorizationsFetchParams
): Promise<AuthorizationsApiResponse> {
  const url = buildUrl(params);
  const response = await fetch(url, {
    method: 'GET',
    headers: getApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`فشل جلب التفويضات: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** إلغاء تفويض عبر endpoint تم */
const CANCEL_AUTH_ENDPOINT = `${AUTHORIZATIONS_ENDPOINT}/tamm-system/cancel-authorization`;

export async function cancelAuthorization(vehicleAuthorizationId: string): Promise<void> {
  const url = new URL(`${apiConfig.baseUrl}${CANCEL_AUTH_ENDPOINT}`);
  url.searchParams.set('vehicleAuthorizationId', vehicleAuthorizationId);

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: getApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`فشل إلغاء التفويض: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.success === false && result.message) {
    throw new Error(result.message);
  }
}
