'use client';

import { AlertTriangle, X, Car, Calendar, FileText } from 'lucide-react';
import { Portal } from './Portal';

interface CancelAuthorizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicleName: string;
  authNumber?: string;
  startDate?: string;
  endDate?: string;
  isLoading?: boolean;
}

export function CancelAuthorizationDialog({
  isOpen,
  onClose,
  onConfirm,
  vehicleName,
  authNumber,
  startDate,
  endDate,
  isLoading = false,
}: CancelAuthorizationDialogProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="relative border-b border-gray-100 px-6 py-5 rounded-t-2xl" style={{ background: 'linear-gradient(135deg, #09b9b5, #0d9488)' }}>
            <button
              onClick={onClose}
              className="absolute left-4 top-4 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">تأكيد إلغاء التفويض</h3>
                <p className="text-sm text-white/80">هذا الإجراء لا يمكن التراجع عنه</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-4">
            {/* Warning Message */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                هل أنت متأكد من رغبتك في إلغاء هذا التفويض؟ سيتم إلغاء التفويض بشكل نهائي ولن تتمكن من استعادته.
              </p>
            </div>

            {/* Authorization Details */}
            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">تفاصيل التفويض</h4>
              
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                  <Car className="h-4 w-4 text-[#09b9b5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">المركبة</p>
                  <p className="font-medium text-gray-900 truncate">{vehicleName}</p>
                </div>
              </div>

              {authNumber && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <FileText className="h-4 w-4 text-[#09b9b5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">رقم التفويض</p>
                    <p className="font-medium text-gray-900 truncate">{authNumber}</p>
                  </div>
                </div>
              )}

              {(startDate || endDate) && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <Calendar className="h-4 w-4 text-[#09b9b5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">الفترة</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || '—'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 rounded-b-2xl">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              تراجع
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري الإلغاء...
                </span>
              ) : (
                'تأكيد الإلغاء'
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
