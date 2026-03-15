/**
 * خدمة API المصادقة
 */

import { authApi } from './config';
import type {
  AuthUser,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/types/auth';

const AUTH_ENDPOINT = '/auth';
const OTP_ENDPOINT = '/otp';
const USERS_ENDPOINT = '/users';

/**
 * إرسال رمز OTP إلى رقم الهاتف
 * يستدعي: POST /otp (CreateOtpDto: phone أو email)
 * يعتبر الطلب ناجحاً إذا لم يرمِ استثناء (استجابة 2xx)
 */
export async function sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
  const body: { phone?: string; email?: string } = {};
  if (request.phone?.trim()) {
    body.phone = normalizePhoneForApi(request.phone.trim());
  }
  if (request.email?.trim()) {
    body.email = request.email.trim();
  }
  if (!body.phone && !body.email) {
    throw new Error('يجب تقديم رقم الهاتف أو البريد الإلكتروني');
  }
  const { data } = await authApi.post<unknown>(OTP_ENDPOINT, body);
  const res = data as Record<string, unknown>;
  return {
    success: res?.success !== false,
    message: (res?.message as string) || 'تم إرسال رمز التحقق',
  };
}

/** تنسيق الرقم للباك: يطابق ^(\+966|0)?5\d{8}$ */
function normalizePhoneForApi(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('966')) return '+' + digits.slice(0, 12);
  if (digits.startsWith('0')) return digits.slice(0, 10);
  if (digits.startsWith('5')) return digits.slice(0, 9);
  return '5' + digits.slice(-8);
}

/**
 * التحقق من رمز OTP وتسجيل الدخول
 * يستدعي: POST /auth (CreateAuthDto: phone + code)
 */
export async function verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const body = {
    phone: normalizePhoneForApi(request.phone),
    code: Number(request.otp),
  };
  const { data } = await authApi.post<unknown>(AUTH_ENDPOINT, body);
  return normalizeVerifyResponse(data);
}

function normalizeVerifyResponse(data: unknown): VerifyOtpResponse {
  const res = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  const dataObj = res?.data as Record<string, unknown> | undefined;
  const token =
    (res?.token as string) ??
    (res?.access_token as string) ??
    (res?.accessToken as string) ??
    (dataObj?.token as string) ??
    '';

  const userRaw = res?.user ?? dataObj?.user ?? res?.data;
  const u = (userRaw && typeof userRaw === 'object' ? userRaw : undefined) as Record<string, unknown> | undefined;
  const user: AuthUser = u
    ? {
        id: String(u.id ?? ''),
        username: String(u.username ?? u.userName ?? u.name ?? 'مستخدم'),
        phone: String(u.phone ?? ''),
        role: u.role as string | undefined,
      }
    : { id: '', username: 'مستخدم', phone: '' };

  if (!token) {
    return {
      success: false,
      message: (res?.message as string) || 'رمز التحقق غير صحيح',
    };
  }

  return {
    success: true,
    message: (res?.message as string) || 'تم تسجيل الدخول بنجاح',
    data: { token, user },
  };
}

/**
 * جلب بيانات الملف الشخصي للمستخدم
 * يستدعي: GET /users/profile (يتطلب توكن)
 * @param token - التوكن (يُمرَّر بعد التحقق مباشرة لضمان استخدام التوكن الصحيح)
 */
export async function fetchUserProfile(token?: string): Promise<AuthUser> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const { data } = await authApi.get<unknown>(`${USERS_ENDPOINT}/profile`, { headers });
  return mapProfileToAuthUser(data);
}

function mapProfileToAuthUser(data: unknown): AuthUser {
  const res = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  const d = (res?.data ?? res) as Record<string, unknown>;
  const obj = (d && typeof d === 'object' ? d : res) as Record<string, unknown>;
  return {
    id: String(obj?.id ?? ''),
    username: String(obj?.username ?? obj?.userName ?? obj?.name ?? 'مستخدم'),
    phone: String(obj?.phone ?? ''),
    role: obj?.role as string | undefined,
    email: obj?.email as string | undefined,
    name: obj?.name as string | undefined,
  };
}

/**
 * تحديث FCM token للمستخدم المسجل
 * يستدعي: PUT /users/:id مع body: { fcmToken }
 * يُستخدم بعد تسجيل الدخول لحفظ توكن الإشعارات
 */
export async function updateUserFcmToken(userId: string, fcmToken: string): Promise<void> {
  await authApi.put(`${USERS_ENDPOINT}/${userId}`, { fcmToken });
}

/**
 * تسجيل الخروج (إبطال التوكن)
 */
export async function logout(): Promise<void> {
  try {
    await authApi.post(`${AUTH_ENDPOINT}/logout`);
  } catch {
    // تجاهل الخطأ - سنمسح التوكن محلياً على أي حال
  }
}
