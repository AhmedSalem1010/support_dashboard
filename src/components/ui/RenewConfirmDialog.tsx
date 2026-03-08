'use client';

import { RefreshCw, CheckCircle, Info, AlertTriangle, X, Smartphone } from 'lucide-react';
import { Button } from './Button';
import { Portal } from './Portal';

interface RenewConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicleName: string;
  authNumber: string;
}

export function RenewConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  vehicleName, 
  authNumber 
}: RenewConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#09b9b5] via-[#0da9a5] to-[#0c9995] p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <RefreshCw className="w-12 h-12" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">إعادة إرسال التفويض</h2>
                <p className="text-white/90 text-sm">تأكيد عملية الإرسال</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Vehicle Info Card */}
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border-2 border-[#09b9b5]/30 shadow-sm">
              <div className="flex-shrink-0 w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-[#09b9b5]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg mb-1">
                  المركبة: <span className="text-[#09b9b5]">{vehicleName}</span>
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span>رقم التفويض:</span>
                  <span className="font-mono bg-teal-100 px-2 py-0.5 rounded text-[#09b9b5] font-semibold">
                    {authNumber}
                  </span>
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-900 mb-3 text-base">ماذا سيحدث؟</p>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>سيتم إرسال رمز OTP إلى هاتف السائق</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>سيحتاج السائق لإدخال الرمز لتأكيد الإرسال</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>سيتم تحديث حالة التفويض تلقائياً</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-amber-900 mb-1 text-base">تنبيه هام</p>
                  <p className="text-sm text-amber-800">
                    تأكد من أن رقم هاتف السائق صحيح قبل المتابعة
                  </p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center py-2">
              <p className="text-gray-700 font-semibold text-base">
                هل تريد المتابعة في إعادة إرسال التفويض؟
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50"
              >
                <X className="w-5 h-5 ml-2" />
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <CheckCircle className="w-5 h-5 ml-2" />
                تأكيد الإرسال
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
