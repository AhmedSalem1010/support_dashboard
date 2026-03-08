'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Shield, Smartphone, Info } from 'lucide-react';
import { Button } from './Button';
import { Portal } from './Portal';

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  authorizationNumber: string;
}

export function OTPDialog({ isOpen, onClose, onSubmit, authorizationNumber }: OTPDialogProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '']);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length, 3);
    inputRefs[lastFilledIndex].current?.focus();
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      onSubmit(otpValue);
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-slideUp overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Icon */}
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
                  <Shield className="w-12 h-12" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">تأكيد التفويض</h2>
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <span className="text-sm">رقم التفويض:</span>
                  <span className="font-mono bg-white/20 px-3 py-1 rounded-lg text-sm font-semibold">
                    {authorizationNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">تم إرسال رمز التحقق</p>
                <p className="text-blue-700">الرجاء إدخال الرمز المكون من 4 أرقام المرسل إلى هاتف السائق</p>
              </div>
            </div>

            {/* OTP Input Fields */}
            <div className="space-y-4">
              <label className="block text-center text-sm font-medium text-gray-700">
                رمز التحقق (OTP)
              </label>
              <div className="flex justify-center gap-3" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#09b9b5] focus:ring-4 focus:ring-[#09b9b5]/20 outline-none transition-all hover:border-gray-400 bg-gray-50 focus:bg-white"
                    aria-label={`رقم ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Help Text */}
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                في حالة عدم استلام الرمز، يرجى التحقق من رقم هاتف السائق أو إعادة المحاولة
              </p>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isComplete}
              className="w-full h-12 text-base font-semibold group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative z-10">تأكيد الرمز والمتابعة</span>
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
