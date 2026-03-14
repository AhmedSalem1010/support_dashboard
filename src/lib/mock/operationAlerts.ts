/**
 * بيانات تجريبية لمخالفات تشغيل المركبات
 */

import type { OperationAlertRecord, OperationType } from '@/types/operationAlerts';

// لوحات مركبات سعودية: حروف + أرقام
const VEHICLE_PLATES = [
  'أ ب ت 1234', 'ب ج د 5678', 'د ه و 9012', 'ك ل م 3456', 'ن س ع 7890',
  'ص ق ر 2345', 'ش ت ث 6789', 'خ ذ ض 0123', 'ظ غ 4567', 'أ ب ج 8901',
];
const DRIVER_NAMES = [
  'أحمد محمد العتيبي', 'خالد عبدالله السعيد', 'محمد سعد الدوسري',
  'عمر فيصل القحطاني', 'يوسف ناصر الشمري', 'سالم علي المري',
  'فهد راشد العتيبي', 'عبدالرحمن محمد الحربي', 'ناصر أحمد العنزي',
  'طلال سلمان المطيري',
];

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinDays(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - randomInRange(0, daysAgo));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function generateMockOperationAlerts(count: number = 30): OperationAlertRecord[] {
  const records: OperationAlertRecord[] = [];
  const operationTypes: OperationType[] = [1, 2, 3, 4, 5];

  for (let i = 0; i < count; i++) {
    const opType = operationTypes[i % 5] as OperationType;
    let maxSpeed = randomInRange(60, 100);
    if (opType === 3) {
      maxSpeed = randomInRange(125, 160); // تجاوز السرعة
    }
    const idleMin = randomInRange(5, 180);
    const movingMin = opType === 4 ? randomInRange(0, 15) : randomInRange(20, 240);
    const distance = movingMin > 0 ? Number((randomInRange(5, 200) / 10).toFixed(1)) : Number((randomInRange(0, 20) / 10).toFixed(1));

    records.push({
      id: `op-${i + 1}`,
      vehiclePlateName: randomElement(VEHICLE_PLATES),
      driverName: randomElement(DRIVER_NAMES),
      idle_duration: idleMin,
      moving_duration: movingMin,
      distance,
      max_speed: maxSpeed,
      operation_date: randomDateWithinDays(30),
      operation_type: opType,
    });
  }

  return records.sort((a, b) => new Date(b.operation_date).getTime() - new Date(a.operation_date).getTime());
}
