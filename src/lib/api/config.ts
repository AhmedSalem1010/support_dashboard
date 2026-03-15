/**
 * إعدادات واجهة برمجة التطبيقات (API)
 * - NEXT_PUBLIC_AUTH_API_BASE_URL: المصادقة والملف الشخصي و FCM
 * - NEXT_PUBLIC_API_BASE_URL: باقي الـ endpoints (إن وُجد، وإلا يُستخدم عنوان المصادقة)
 */

import axios from 'axios';

const AUTH_BASE_DEFAULT = 'https://api.thecleanlife.dev';

/** عنوان API المصادقة - من .env (NEXT_PUBLIC_AUTH_API_BASE_URL) */
export const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? AUTH_BASE_DEFAULT;

/** عنوان API العام - من .env (NEXT_PUBLIC_API_BASE_URL)، وإذا لم يُعرّف يُستخدم عنوان المصادقة */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? AUTH_API_BASE_URL;

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

/** Axios instance لبقية الـ endpoints - base من .env (NEXT_PUBLIC_API_BASE_URL) */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

/** Axios instance للمصادقة والملف الشخصي و FCM - base من .env (NEXT_PUBLIC_AUTH_API_BASE_URL) */
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
