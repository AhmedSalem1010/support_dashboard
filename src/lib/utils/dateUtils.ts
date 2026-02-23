/**
 * تحويل التاريخ من صيغة dd/MM/yyyy إلى yyyy-MM-dd
 * @param dateString - التاريخ بصيغة dd/MM/yyyy (مثال: 01/01/2026)
 * @returns التاريخ بصيغة yyyy-MM-dd (مثال: 2026-01-01)
 */
export function formatDateToISO(dateString: string): string {
  if (!dateString) return '';
  
  // التحقق من الصيغة dd/MM/yyyy
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    throw new Error('صيغة التاريخ غير صحيحة. يجب أن تكون dd/MM/yyyy');
  }
  
  const [day, month, year] = parts;
  
  // التحقق من صحة القيم
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
    throw new Error('التاريخ يحتوي على قيم غير صحيحة');
  }
  
  if (dayNum < 1 || dayNum > 31) {
    throw new Error('اليوم يجب أن يكون بين 1 و 31');
  }
  
  if (monthNum < 1 || monthNum > 12) {
    throw new Error('الشهر يجب أن يكون بين 1 و 12');
  }
  
  // تنسيق التاريخ بصيغة yyyy-MM-dd
  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');
  
  return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * تحويل التاريخ من صيغة yyyy-MM-dd إلى dd/MM/yyyy
 * @param isoDate - التاريخ بصيغة yyyy-MM-dd (مثال: 2026-01-01)
 * @returns التاريخ بصيغة dd/MM/yyyy (مثال: 01/01/2026)
 */
export function formatDateFromISO(isoDate: string): string {
  if (!isoDate) return '';
  
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    throw new Error('صيغة التاريخ غير صحيحة. يجب أن تكون yyyy-MM-dd');
  }
  
  const [year, month, day] = parts;
  
  return `${day}/${month}/${year}`;
}

/**
 * تحويل كائن Date إلى صيغة yyyy-MM-dd
 * @param date - كائن Date
 * @returns التاريخ بصيغة yyyy-MM-dd
 */
export function dateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * الحصول على التاريخ الحالي بصيغة yyyy-MM-dd
 * @returns التاريخ الحالي بصيغة yyyy-MM-dd
 */
export function getCurrentDateISO(): string {
  return dateToISO(new Date());
}

/**
 * إضافة أيام إلى تاريخ معين
 * @param dateString - التاريخ بصيغة yyyy-MM-dd
 * @param days - عدد الأيام المراد إضافتها
 * @returns التاريخ الجديد بصيغة yyyy-MM-dd
 */
export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return dateToISO(date);
}

/**
 * حساب الفرق بالأيام بين تاريخين
 * @param startDate - تاريخ البداية بصيغة yyyy-MM-dd
 * @param endDate - تاريخ النهاية بصيغة yyyy-MM-dd
 * @returns عدد الأيام بين التاريخين
 */
export function getDaysDifference(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
