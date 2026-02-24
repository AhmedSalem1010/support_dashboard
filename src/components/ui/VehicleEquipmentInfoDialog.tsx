'use client';

import { Portal } from '@/components/ui/Portal';
import type { VehicleInfoItem, VehicleInfoRequestInfo } from '@/types/equipment';

interface VehicleEquipmentInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehiclePlateName: string | null;
  requestInfo: VehicleInfoRequestInfo | null;
  data: VehicleInfoItem[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * حوار يعرض الريكوست المرسل واستجابة endpoint معلومات معدات المركبة (vehicle-info)
 */
export function VehicleEquipmentInfoDialog({
  isOpen,
  onClose,
  vehiclePlateName,
  requestInfo,
  data,
  isLoading,
  error,
}: VehicleEquipmentInfoDialogProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-info-dialog-title"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#0d9488] to-[#14b8a6] px-5 py-4 text-white">
            <h2 id="vehicle-info-dialog-title" className="text-lg font-bold">
              الريكوست والريسبونس - vehicle-info
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="إغلاق"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* الريكوست المرسل */}
            {requestInfo && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">الريكوست المرسل:</p>
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 overflow-hidden text-right">
                  <div className="px-3 py-2 border-b border-blue-200/70">
                    <span className="text-xs text-blue-600 font-medium">Method:</span>
                    <span className="mr-2 font-mono text-sm text-blue-900">{requestInfo.method}</span>
                  </div>
                  <div className="px-3 py-2 border-b border-blue-200/70 break-all">
                    <span className="text-xs text-blue-600 font-medium block mb-1">URL:</span>
                    <code className="text-sm text-blue-900 font-mono">{requestInfo.url}</code>
                  </div>
                  {requestInfo.headers && Object.keys(requestInfo.headers).length > 0 && (
                    <div className="px-3 py-2">
                      <span className="text-xs text-blue-600 font-medium block mb-1">Headers:</span>
                      <pre className="text-xs text-blue-900 font-mono bg-white/60 p-2 rounded overflow-x-auto">
                        {JSON.stringify(requestInfo.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vehiclePlateName && !requestInfo && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">المركبة:</span> {vehiclePlateName}
              </p>
            )}
            {isLoading && (
              <div className="flex items-center gap-2 py-8 text-[#0d9488]">
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>جاري جلب البيانات...</span>
              </div>
            )}
            {error && !isLoading && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            {!isLoading && !error && data && (
              <>
                <p className="text-xs font-semibold text-gray-700 mb-2">الريسبونس الراجع من الـ API:</p>
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2 font-semibold text-gray-700">#</th>
                        <th className="px-3 py-2 font-semibold text-gray-700">اسم الصنف</th>
                        <th className="px-3 py-2 font-semibold text-gray-700">العدد</th>
                        <th className="px-3 py-2 font-semibold text-gray-700">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                            لا توجد بيانات
                          </td>
                        </tr>
                      ) : (
                        data.map((item, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                            <td className="px-3 py-2 text-gray-600">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-gray-900">{item.itemName}</td>
                            <td className="px-3 py-2 text-gray-700">{item.itemCount}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                  item.itemStatus === 'usable'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {item.itemStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <pre className="mt-3 p-3 rounded-lg bg-gray-900 text-gray-100 text-xs overflow-x-auto overflow-y-auto max-h-48">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </>
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-[#0d9488] text-white font-medium hover:bg-[#0f766e] transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
