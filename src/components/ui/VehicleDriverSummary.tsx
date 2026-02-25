'use client';

import { Car, User, Loader2, AlertCircle } from 'lucide-react';
import type { LastAuthorizationDataItem } from '@/types/authorization';

interface VehicleDriverSummaryProps {
  /** بيانات آخر تفويض من useLastAuthorizationData */
  data: LastAuthorizationDataItem | null;
  isLoading?: boolean;
  error?: string | null;
  /** عنوان اختياري */
  title?: string;
  className?: string;
}

/**
 * عرض ملخص بيانات المركبة والسائق من آخر تفويض.
 * يُستخدم عند اختيار رقم المركبة في النماذج والصفحات.
 */
export function VehicleDriverSummary({
  data,
  isLoading = false,
  error = null,
  title = 'بيانات المركبة والسائق',
  className = '',
}: VehicleDriverSummaryProps) {
  if (isLoading) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600 ${className}`}
      >
        <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
        <span>جاري جلب بيانات المركبة والسائق...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 ${className}`}
      >
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { vehicle, driver } = data;

  return (
    <div
      className={`w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      aria-label={title}
      style={{ minWidth: 0 }}
    >
      <h4 className="mb-3 text-sm font-semibold text-gray-700">{title}</h4>
      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 gap-2 rounded-md bg-gray-50 p-3">
          <Car className="h-5 w-5 flex-shrink-0 text-gray-500" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">المركبة</p>
            <p className="font-medium text-gray-900">{vehicle.plateName || vehicle.plateNumber || '—'}</p>
            {(vehicle.manufacturer || vehicle.model) && (
              <p className="text-sm text-gray-600">
                {[vehicle.manufacturer, vehicle.model].filter(Boolean).join(' ')}
                {vehicle.year ? ` - ${vehicle.year}` : ''}
              </p>
            )}
            {vehicle.vehicleType && (
              <p className="text-xs text-gray-500">{vehicle.vehicleType}</p>
            )}
          </div>
        </div>
        <div className="flex min-w-0 gap-2 rounded-md bg-gray-50 p-3">
          <User className="h-5 w-5 flex-shrink-0 text-gray-500" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">السائق</p>
            <p className="font-medium text-gray-900">{driver?.name ?? '—'}</p>
            {driver?.employeeData?.personalReceived && (
              <p className="text-sm text-gray-600">{driver.employeeData.personalReceived}</p>
            )}
            {driver?.employeeData?.licenseStatus && (
              <p className="text-xs text-gray-500">رخصة: {driver.employeeData.licenseStatus}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
