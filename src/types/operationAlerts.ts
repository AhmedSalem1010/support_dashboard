/**
 * أنواع وإعدادات مخالفات تشغيل المركبات
 */

export type OperationType = 1 | 2 | 3 | 4 | 5;

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] as const;
export type DayOfWeek = (typeof ARABIC_DAYS)[number];

export function getDayFromDate(dateStr: string): DayOfWeek {
  const d = new Date(dateStr + 'T00:00:00');
  return ARABIC_DAYS[d.getDay()];
}

export interface OperationAlertRecord {
  id: string;
  vehiclePlateName: string; // لوحة المركبة: حروف + أرقام
  driverName: string; // اسم السائق
  idle_duration: number; // دقائق
  moving_duration: number; // دقائق
  distance: number; // كم
  max_speed: number; // كم/س
  operation_date: string; // YYYY-MM-DD
  operation_type: OperationType;
}

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  1: 'تحريك المركبة في يوم الجمعة',
  2: 'مدة التشغيل طويلة',
  3: 'تجاوز السرعة',
  4: 'مركبة مفوضة ولا تتحرك',
  5: 'مركبة غير مفوضة وتتحرك',
};

export const OPERATION_TYPE_COLORS: Record<OperationType, string> = {
  1: 'orange',
  2: 'yellow',
  3: 'red',
  4: 'blue',
  5: 'purple',
};
