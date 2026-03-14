'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { verifyOtp, sendOtp, fetchUserProfile } from '@/lib/api/auth';
import { setAuthToken } from '@/lib/api/config';
import { useAuth } from '@/contexts/AuthContext';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('otp_phone');
    if (!storedPhone) {
      router.replace('/login');
      return;
    }
    setPhone(storedPhone);
    inputRefs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const updated = [...prev];
      updated[index] = digit;
      return updated;
    });
    setError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const digits = pasted.split('');
    setOtp((prev) => {
      const updated = [...prev];
      digits.forEach((d, i) => { if (i < OTP_LENGTH) updated[i] = d; });
      return updated;
    });
    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      setError('يرجى إدخال رمز التحقق كاملاً');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await verifyOtp({ phone, otp: otpCode });
      if (response.success && response.data) {
        const { token } = response.data;
        setAuthToken(token, true);
        const profile = await fetchUserProfile(token);
        login(token, profile);
        setSuccess(true);
        sessionStorage.removeItem('otp_phone');
        setTimeout(() => router.replace('/'), 800);
      } else {
        setError(response.message || 'رمز التحقق غير صحيح');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التحقق');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const response = await sendOtp({ phone });
      if (response.success) {
        setResendTimer(RESEND_COOLDOWN);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        setError(response.message || 'فشل إعادة إرسال الرمز');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إعادة إرسال الرمز');
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('otp_phone');
    router.replace('/login');
  };

  const maskedPhone = phone ? phone.slice(0, 4) + '****' + phone.slice(-3) : '';
  const otpFilled = otp.join('').length === OTP_LENGTH;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap');

        .verify-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #09b9b5 0%, #0da9a5 50%, #078c89 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb1 { width: 500px; height: 500px; background: rgba(255,255,255,0.15); top: -150px; right: -100px; }
        .orb2 { width: 400px; height: 400px; background: rgba(255,255,255,0.1); bottom: -100px; left: -80px; }

        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .verify-card {
          width: 100%; max-width: 440px;
          background: rgba(255,255,255,0.95);
          border: 0.5px solid rgba(9,185,181,0.3);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          position: relative;
          backdrop-filter: blur(20px);
          animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-glow {
          position: absolute; inset: 0; border-radius: 24px;
          background: linear-gradient(135deg, rgba(9,185,181,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(9,185,181,0.04) 100%);
          pointer-events: none;
        }

        .header-wrap { text-align: center; margin-bottom: 2rem; animation: fadeUp 0.7s 0.1s both; }

        .icon-container { position: relative; display: inline-block; margin-bottom: 1rem; }

        .shield-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #09b9b5, #078c89);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(9,185,181,0.3), 0 0 80px rgba(9,185,181,0.1);
          position: relative;
        }

        .shield-icon::after {
          content: ''; position: absolute; inset: -1px;
          border-radius: 21px; border: 1px solid rgba(9,185,181,0.5);
        }

        .pulse-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(9,185,181,0.3);
          animation: pulse-anim 3s ease-out infinite;
          top: 0; left: 50%; transform: translateX(-50%);
        }

        @keyframes pulse-anim {
          0%   { width: 72px;  height: 72px;  opacity: 0.6; top: 0;     }
          100% { width: 130px; height: 130px; opacity: 0;   top: -29px; }
        }

        .header-title {
          font-family: 'Tajawal', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #0a1628; margin-bottom: 8px; letter-spacing: -0.3px;
        }

        .header-sub { font-size: 14px; color: #617c96; font-weight: 400; line-height: 1.8; }

        .phone-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(9,185,181,0.1);
          border: 0.5px solid rgba(9,185,181,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 13px; font-weight: 600; color: #09b9b5;
          direction: ltr; letter-spacing: 1.5px; margin-top: 8px;
        }

        .divider {
          height: 0.5px;
          background: linear-gradient(90deg, transparent, rgba(9,185,181,0.3), transparent);
          margin-bottom: 2rem;
        }

        .otp-section { margin-bottom: 1.5rem; animation: fadeUp 0.7s 0.25s both; }

        .otp-label {
          display: block; font-size: 13px; font-weight: 500;
          color: #4d647c; margin-bottom: 16px; text-align: center;
        }
        .dark .otp-label { color: #9ca3af; }
        .dark .otp-label { color: #9ca3af; }

        .otp-inputs {
          display: flex; justify-content: center; gap: 10px;
          direction: ltr;
        }

        .otp-input {
          width: 52px; height: 60px;
          text-align: center;
          font-family: 'Cairo', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #0a1628;
          background: #f8fafc;
          border: 0.5px solid #e2e8f0;
          border-radius: 14px;
          outline: none;
          transition: all 0.25s;
          caret-color: #09b9b5;
        }

        .otp-input:focus {
          border-color: rgba(9,185,181,0.7);
          background: rgba(9,185,181,0.04);
          box-shadow: 0 0 0 3px rgba(9,185,181,0.15);
          transform: translateY(-2px);
        }

        .otp-input.filled {
          border-color: rgba(9,185,181,0.45);
          background: rgba(9,185,181,0.07);
          color: #09b9b5;
        }

        .otp-input:disabled { opacity: 0.4; cursor: not-allowed; }

        .timer-wrap { text-align: center; margin-bottom: 1rem; animation: fadeUp 0.7s 0.4s both; }

        .timer-ring-container {
          position: relative;
          width: 52px; height: 52px;
          margin: 0 auto 10px;
        }

        .timer-ring {
          width: 52px; height: 52px;
          transform: rotate(-90deg);
        }

        .timer-ring-bg { fill: none; stroke: rgba(9,185,181,0.2); stroke-width: 3; }

        .timer-ring-progress {
          fill: none; stroke: #09b9b5; stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 138.23;
          transition: stroke-dashoffset 1s linear;
        }

        .timer-number {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 14px; font-weight: 600; color: #09b9b5;
        }

        .timer-text { font-size: 12px; color: #617c96; }

        .error-box {
          background: rgba(226,75,74,0.1);
          border: 0.5px solid rgba(226,75,74,0.3);
          border-radius: 12px; padding: 10px 14px;
          font-size: 13px; color: #dc2626; text-align: center;
          margin-bottom: 1rem; animation: fadeUp 0.3s both;
        }

        .btn-verify {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #09b9b5, #078c89);
          border: none; border-radius: 14px;
          font-family: 'Cairo', sans-serif;
          font-size: 15px; font-weight: 600; color: white;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          animation: fadeUp 0.7s 0.35s both;
          box-shadow: 0 4px 20px rgba(9,185,181,0.25);
        }

        .btn-verify:hover:not(:disabled) {
          box-shadow: 0 6px 30px rgba(9,185,181,0.4);
          transform: translateY(-1px);
        }

        .btn-verify:active:not(:disabled) { transform: translateY(0) scale(0.99); }

        .btn-verify:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-verify::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          pointer-events: none;
        }

        .btn-verify.btn-success { background: linear-gradient(135deg, #1D9E75, #0F6E56); }

        .btn-resend {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 10px;
          background: none; border: 0.5px solid rgba(9,185,181,0.3);
          border-radius: 12px;
          font-family: 'Cairo', sans-serif;
          font-size: 13px; font-weight: 500; color: #09b9b5;
          cursor: pointer; transition: all 0.3s;
          animation: fadeUp 0.7s 0.45s both;
        }

        .btn-resend:hover:not(:disabled) {
          background: rgba(9,185,181,0.08);
          border-color: rgba(9,185,181,0.5);
        }

        .btn-resend:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-back {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 10px;
          background: none; border: none;
          font-family: 'Cairo', sans-serif;
          font-size: 13px; font-weight: 400; color: #617c96;
          cursor: pointer; transition: all 0.3s;
          animation: fadeUp 0.7s 0.5s both;
        }

        .btn-back:hover { color: #4d647c; }

        .actions { display: flex; flex-direction: column; gap: 10px; margin-top: 1rem; }

        .footer-text {
          text-align: center; margin-top: 1.5rem;
          font-size: 11px; color: #94a3b8;
          animation: fadeUp 0.7s 0.55s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="verify-page">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="grid-bg" />

        <div className="verify-card">
          <div className="card-glow" />

          <div className="header-wrap">
            <div className="icon-container">
              <div className="shield-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z" />
                </svg>
              </div>
              <div className="pulse-ring" />
            </div>
            <h1 className="header-title">التحقق من رقم الجوال</h1>
            <p className="header-sub">أدخل رمز التحقق المرسل إلى</p>
            <div className="phone-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              {maskedPhone}
            </div>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            <div className="otp-section">
              <label className="otp-label">رمز التحقق المكوّن من 6 أرقام</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    className={`otp-input${digit ? ' filled' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="timer-wrap">
              {resendTimer > 0 ? (
                <>
                  <div className="timer-ring-container">
                    <svg className="timer-ring" viewBox="0 0 52 52">
                      <circle className="timer-ring-bg" cx="26" cy="26" r="22" />
                      <circle
                        className="timer-ring-progress"
                        cx="26" cy="26" r="22"
                        style={{
                          strokeDashoffset: 138.23 * (1 - resendTimer / RESEND_COOLDOWN),
                        }}
                      />
                    </svg>
                    <span className="timer-number">{resendTimer}</span>
                  </div>
                  <p className="timer-text">ثانية حتى إعادة الإرسال</p>
                </>
              ) : null}
            </div>

            {error && <div className="error-box">{error}</div>}

            <div className="actions">
              <button
                type="submit"
                disabled={isLoading || !otpFilled}
                className={`btn-verify${success ? ' btn-success' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جاري التحقق...</span>
                  </>
                ) : success ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تم التحقق بنجاح!</span>
                  </>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </button>

              {resendTimer === 0 && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="btn-resend"
                >
                  {isResending
                    ? <Loader2 size={14} className="animate-spin" />
                    : <RefreshCw size={14} />
                  }
                  <span>إعادة إرسال الرمز</span>
                </button>
              )}

              <button type="button" onClick={handleBack} className="btn-back">
                <ArrowRight size={14} />
                <span>تغيير رقم الجوال</span>
              </button>
            </div>
          </form>

          <p className="footer-text">CleanLife Dashboard © {new Date().getFullYear()}</p>
        </div>
      </div>
    </>
  );
}
