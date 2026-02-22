/**
 * تعيين قيم الـ enums من الـ backend إلى النص العربي للعرض في الواجهة
 */

/** حالة المركبة */
export const VEHICLE_STATUS_LABELS: Record<string, string> = {
  active: 'متاح',
  inactive: 'غير فعال',
  maintenance: 'صيانة',
  authorized: 'مفوض',
  ready_for_authorization: 'جاهز للتسوية',
};

/** حالة التأمين */
export const INSURANCE_STATUS_LABELS: Record<string, string> = {
  active: 'ساري',
  inactive: 'غير فعال',
  expired: 'منتهي',
  no_insurance: 'بدون تأمين',
  unknown: 'غير معروف',
  not_exist: 'غير موجود',
};

/** حالة الصيانة */
export const MAINTENANCE_STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

/** نوع الصيانة */
export const MAINTENANCE_TYPE_LABELS: Record<string, string> = {
  oil_change: 'تغيير زيت',
  periodic: 'صيانة دورية',
  repair: 'إصلاح',
  other: 'أخرى',
};

/** حالة الحادث */
export const ACCIDENT_STATUS_LABELS: Record<string, string> = {
  open: 'قيد المتابعة',
  closed: 'مغلق',
};

/** خطورة الحادث */
export const ACCIDENT_SEVERITY_LABELS: Record<string, string> = {
  minor: 'بسيط',
  moderate: 'متوسط',
  severe: 'خطير',
};

/** نوع التفويض */
export const AUTHORIZATION_TYPE_LABELS: Record<string, string> = {
  tamm_and_local: 'تم + محلي',
  local_only: 'محلي فقط',
};

/** حالة التفويض (القيم التي يقبلها الـ API - expiring_soon غير مدعوم) */
export const AUTHORIZATION_STATUS_LABELS: Record<string, string> = {
  active: 'ساري',
  expired: 'منتهي',
  cancelled: 'ملغي',
  pending: 'قيد الانتظار',
  failed: 'فشل',
  rejected: 'مرفوض',
  new: 'جديد',
  maintenance: 'صيانة',
};

/** حالة المستخدم */
export const USER_STATUS_LABELS: Record<string, string> = {
  active: 'نشط',
  suspended: 'موقوف',
  inactive: 'غير نشط',
};

/** أدوار المستخدم */
export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'مدير',
  supervisor: 'مشرف',
  driver: 'سائق',
};

/** حالة الفحص الدوري */
export const INSPECTION_STATUS_LABELS: Record<string, string> = {
  VALID: 'سارية',
  EXPIRED: 'منتهية',
  NOT_EXIST: 'لا يوجد',
  valid: 'سارية',
  expired: 'منتهية',
  not_exist: 'لا يوجد',
};

/** حالة الاستمارة */
export const ISTIMARAH_STATUS_LABELS: Record<string, string> = {
  VALID: 'سارية',
  EXPIRED: 'منتهية',
  NOT_EXIST: 'لا يوجد',
  valid: 'سارية',
  expired: 'منتهية',
  not_exist: 'لا يوجد',
};

/** تحويل قيمة إلى نص عربي */
export function getLabel(labels: Record<string, string>, value: string): string {
  return labels[value] ?? value ?? '—';
}

/** تحويل أي حالة إنجليزية إلى عربي - للعرض في واجهات الحالات فقط */
export function statusToArabic(value: string | null | undefined): string {
  if (!value) return '—';
  const v = String(value).trim();
  const allLabels = {
    ...VEHICLE_STATUS_LABELS,
    ...AUTHORIZATION_TYPE_LABELS,
    ...INSURANCE_STATUS_LABELS,
    ...MAINTENANCE_STATUS_LABELS,
    ...ACCIDENT_STATUS_LABELS,
    ...ACCIDENT_SEVERITY_LABELS,
    ...AUTHORIZATION_STATUS_LABELS,
    ...USER_STATUS_LABELS,
    ...INSPECTION_STATUS_LABELS,
    ...ISTIMARAH_STATUS_LABELS,
  };
  return allLabels[v] ?? v;
}
