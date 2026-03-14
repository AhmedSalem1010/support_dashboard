'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { sendOtp } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('966')) return '+' + digits.slice(0, 12);
    if (digits.startsWith('0')) return '+966' + digits.slice(1, 10);
    if (digits.startsWith('5')) return '+966' + digits.slice(0, 9);
    return '+966' + digits.slice(0, 9);
  };

  const isValidPhone = (value: string): boolean => {
    return /^\+9665\d{8}$/.test(formatPhoneNumber(value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d+]/g, '');
    setPhone(value);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phone)) {
      setError('يرجى إدخال رقم هاتف سعودي صحيح');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const response = await sendOtp({ phone: formattedPhone });

      if (response.success) {
        setSuccess(true);
        sessionStorage.setItem('otp_phone', formattedPhone);
        setTimeout(() => router.push('/login/verify'), 1000);
      } else {
        setError(response.message || 'فشل إرسال رمز التحقق');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال رمز التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap');

        .login-page {
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
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
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
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .card-inner-glow {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(9,185,181,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(9,185,181,0.04) 100%);
          pointer-events: none;
        }

        .logo-wrap { text-align: center; margin-bottom: 2rem; animation: fadeUp 0.8s 0.15s both; }

        .logo-icon-container { position: relative; display: inline-block; margin-bottom: 1rem; }

        .logo-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #09b9b5, #078c89);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(9,185,181,0.3), 0 0 80px rgba(9,185,181,0.1);
          position: relative;
        }

        .logo-icon::after {
          content: '';
          position: absolute; inset: -1px;
          border-radius: 21px;
          border: 1px solid rgba(9,185,181,0.5);
        }

        .pulse-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(9,185,181,0.3);
          animation: pulse-anim 3s ease-out infinite;
          top: 0; left: 50%; transform: translateX(-50%);
        }

        @keyframes pulse-anim {
          0%   { width: 72px;  height: 72px;  opacity: 0.6; top: 0;    left: 50%; transform: translateX(-50%); }
          100% { width: 130px; height: 130px; opacity: 0;   top: -29px; left: 50%; transform: translateX(-50%); }
        }

        .logo-title {
          font-family: 'Tajawal', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #0a1628; margin-bottom: 6px; letter-spacing: -0.3px;
        }

        .logo-subtitle { font-size: 14px; color: #617c96; font-weight: 400; }

        .divider {
          height: 0.5px;
          background: linear-gradient(90deg, transparent, rgba(9,185,181,0.3), transparent);
          margin-bottom: 2rem;
        }

        .form-group { margin-bottom: 1.25rem; animation: fadeUp 0.8s 0.3s both; }

        .field-label {
          display: block; font-size: 13px; font-weight: 500;
          color: #4d647c; margin-bottom: 10px; letter-spacing: 0.3px;
        }

        .input-wrap { position: relative; }

        .phone-input {
          width: 100%;
          padding: 14px 48px 14px 16px;
          background: #f8fafc;
          border: 0.5px solid #e2e8f0;
          border-radius: 14px;
          font-family: 'Cairo', sans-serif;
          font-size: 17px; font-weight: 500;
          color: #0a1628;
          text-align: center; letter-spacing: 2px;
          direction: ltr;
          transition: all 0.3s; outline: none;
        }

        .phone-input::placeholder { color: #94a3b8; letter-spacing: 1px; font-size: 15px; }

        .phone-input:focus {
          border-color: rgba(9,185,181,0.6);
          background: rgba(9,185,181,0.04);
          box-shadow: 0 0 0 3px rgba(9,185,181,0.12);
        }

        .phone-input.input-valid { border-color: rgba(9,185,181,0.5); }
        .phone-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .input-icon {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: #09b9b5; display: flex; align-items: center;
          pointer-events: none;
        }

        .input-hint { margin-top: 8px; font-size: 12px; color: #617c96; text-align: center; }

        .error-box {
          background: rgba(226,75,74,0.1);
          border: 0.5px solid rgba(226,75,74,0.3);
          border-radius: 12px; padding: 10px 14px;
          font-size: 13px; color: #dc2626; text-align: center;
          margin-bottom: 1rem; animation: fadeUp 0.3s both;
        }

        .btn-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #09b9b5, #078c89);
          border: none; border-radius: 14px;
          font-family: 'Cairo', sans-serif;
          font-size: 15px; font-weight: 600; color: white;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          animation: fadeUp 0.8s 0.45s both;
          box-shadow: 0 4px 20px rgba(9,185,181,0.25);
        }

        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 6px 30px rgba(9,185,181,0.4);
          transform: translateY(-1px);
        }

        .btn-submit:active:not(:disabled) { transform: translateY(0) scale(0.99); }

        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-submit::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          pointer-events: none;
        }

        .btn-submit.btn-success { background: linear-gradient(135deg, #1D9E75, #0F6E56); }

        .footer-text {
          text-align: center; margin-top: 1.5rem;
          font-size: 11px; color: #94a3b8;
          animation: fadeUp 0.8s 0.7s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="login-page">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="grid-bg" />

        <div className="login-card">
          <div className="card-inner-glow" />

          <div className="logo-wrap">
            <div className="logo-icon-container">
              <div className="logo-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z" />
                </svg>
              </div>
              <div className="pulse-ring" />
            </div>
            <h1 className="logo-title">نظام المساندة ودعم الفرق</h1>
            <p className="logo-subtitle">سجّل دخولك باستخدام رقم جوالك</p>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone" className="field-label">رقم الجوال</label>
              <div className="input-wrap">
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="05xxxxxxxx"
                  maxLength={13}
                  dir="ltr"
                  className={`phone-input${isValidPhone(phone) ? ' input-valid' : ''}`}
                  disabled={isLoading}
                />
              </div>
              <p className="input-hint">سيتم إرسال رمز تحقق إلى هذا الرقم</p>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !phone.trim()}
              className={`btn-submit${success ? ' btn-success' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : success ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>تم الإرسال بنجاح!</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>إرسال رمز التحقق</span>
                  <ArrowLeft size={16} />
                </>
              )}
            </button>
          </form>

          <p className="footer-text">CleanLife Dashboard © {new Date().getFullYear()}</p>
        </div>
      </div>
    </>
  );
}
