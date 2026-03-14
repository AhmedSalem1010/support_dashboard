/**
 * أنواع نظام المصادقة
 */

/** بيانات المستخدم المسجل (من /users/profile) */
export interface AuthUser {
  id: string;
  username: string;
  phone: string;
  role?: string;
  email?: string;
  name?: string;
}

/** حالة المصادقة */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** استجابة إرسال OTP */
export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

/** استجابة التحقق من OTP */
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}

/** طلب إرسال OTP (phone أو email) */
export interface SendOtpRequest {
  phone?: string;
  email?: string;
}

/** طلب التحقق من OTP */
export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}
