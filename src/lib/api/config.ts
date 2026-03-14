/**
 * إعدادات واجهة برمجة التطبيقات (API)
 * - NEXT_PUBLIC_AUTH_API_BASE_URL: OTP, auth, users/profile
 * - NEXT_PUBLIC_API_BASE_URL: باقي الـ endpoints (localhost)
 */

import axios from 'axios';

export const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || 'https://api.thecleanlife.dev';
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const TOKEN_STORAGE_KEY = 'auth_token';

/** قراءة التوكن من التخزين المحلي أو متغير البيئة */
export function getAuthToken(): string | null {
  // في بيئة السيرفر، استخدم متغير البيئة فقط
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_AUTH_TOKEN || null;
  }
  // في المتصفح، أولوية التوكن من تسجيل الدخول:
  // 1. localStorage (بعد تسجيل الدخول)
  // 2. sessionStorage
  // 3. متغير البيئة (للتطوير فقط)
  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
    process.env.NEXT_PUBLIC_AUTH_TOKEN ||
    null
  );
}

/** حفظ التوكن بعد تسجيل الدخول */
export function setAuthToken(token: string, persist = true): void {
  if (typeof window === 'undefined') return;
  if (persist) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

/** مسح التوكن عند تسجيل الخروج */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

/** مسح جميع الكوكيز */
function clearAllCookies(): void {
  if (typeof document === 'undefined') return;
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.trim().split('=')[0];
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}

/** مسح localStorage و sessionStorage والكوكيز بالكامل (يُستدعى عند تسجيل الخروج) */
export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  sessionStorage.clear();
  clearAllCookies();
}

/** إرجاع الهيدرات الكاملة للطلبات (مع التوكن إن وجد) */
export function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
  authBaseUrl: AUTH_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/** إنشاء Axios instance للباكند المحلي (باقي الـ endpoints) */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

/** إنشاء Axios instance لـ OTP, auth, users/profile */
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
authApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { authApi };
export default api;
