/**
 * تحويل بيانات التفويضات من API إلى صيغة العرض
 */

import type { AuthorizationApiItem } from '@/types/authorization';

const TYPE_LABELS: Record<string, string> = {
  tamm_and_local: 'تم + محلي',
  local_only: 'محلي فقط',
};

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toISOString().split('T')[0];
}

function getStatus(api: AuthorizationApiItem): string {
  // استخدام الحالة القادمة من قاعدة البيانات مباشرة
  return api.authorizationStatus || 'active';
}

export interface AuthorizationDisplay {
  id: string;
  authNumber: string;
  vehicle: string;
  vehicleModel: string;
  vehicleId: string;
  driver: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  tammAuthorized: string;
  workersCount: number;
  authorizationDaysCount: number;
  daysRemaining: number;
  raw: AuthorizationApiItem;
}

export function mapAuthorizationFromApi(api: AuthorizationApiItem): AuthorizationDisplay {
  const end = new Date(api.authorizationEndDate);
  const today = new Date();
  const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // تحديد اسم السائق بناءً على الشروط
  // استخدام driver أو userDriver
  let driverName = api.driver?.name ?? api.userDriver?.name ?? '—';
  
  // إذا كان السائق فارغ ونوع التفويض محلي فقط و vehicleAuthorizationTammResponseXConversition فارغ
  const isDriverEmpty = !api.driver || !api.driver.name;
  const isUserDriverEmpty = !api.userDriver?.name;
  const isLocalOnly = api.authorizationType === 'local_only';
  const isTammResponseEmpty = !api.vehicleAuthorizationTammResponseXConversition;
  
  // إذا كان كلا السائقين فارغين ونوع التفويض محلي فقط
  if (isDriverEmpty && isUserDriverEmpty && isLocalOnly && isTammResponseEmpty) {
    driverName = 'الشركة';
  }

  return {
    id: api.id,
    authNumber: api.tammAuthorizedId || api.id.slice(0, 8),
    vehicle: api.vehicle?.plateName ?? '—',
    vehicleModel: api.vehicle?.vehicleType ?? '—',
    vehicleId: api.vehicleId,
    driver: driverName,
    supervisor: (api.supervisor as any)?.name ?? '—',
    startDate: formatDate(api.authorizationStartDate),
    endDate: formatDate(api.authorizationEndDate),
    type: TYPE_LABELS[api.authorizationType] ?? api.authorizationType,
    status: getStatus(api),
    tammAuthorized: api.driver?.name ?? api.tammAuthorizedId ?? '—',
    workersCount: 1,
    authorizationDaysCount: api.authorizationDaysCount ?? 0,
    daysRemaining,
    raw: api,
  };
}
