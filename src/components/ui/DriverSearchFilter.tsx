/**
 * مكون مشترك للبحث باسم السائق مع تحديد نوع السائق
 * يستخدم في صفحات التفويض والمعدات وأي صفحة أخرى تحتاج للبحث باسم السائق
 */

interface DriverSearchFilterProps {
  driverTypeFilter: string;
  driverName: string;
  onDriverTypeChange: (value: string) => void;
  onDriverNameChange: (value: string) => void;
}

export function DriverSearchFilter({
  driverTypeFilter,
  driverName,
  onDriverTypeChange,
  onDriverNameChange,
}: DriverSearchFilterProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع السائق</label>
        <select
          value={driverTypeFilter}
          onChange={(e) => onDriverTypeChange(e.target.value)}
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
        >
          <option value="">الكل</option>
          <option value="employee">موظف</option>
          <option value="supervisor">مشرف فريق</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4d647c] mb-2">اسم السائق</label>
        <input
          type="text"
          value={driverName}
          onChange={(e) => onDriverNameChange(e.target.value)}
          placeholder="بحث بالاسم"
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
        />
      </div>
    </>
  );
}
