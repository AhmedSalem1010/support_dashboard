/**
 * تنسيق رقم اللوحة للإرسال إلى الـ API بصيغة: ر أ ص 8299 (مسافة بين الأجزاء)
 */
export function formatPlateNameForApi(plateName: string): string {
  return plateName.trim().replace(/\s+/g, ' ');
}
