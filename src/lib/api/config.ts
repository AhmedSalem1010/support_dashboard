/**
 * إعدادات واجهة برمجة التطبيقات (API)
 * يمكن تغيير القيمة من خلال متغيرات البيئة
 */

import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const TOKEN_STORAGE_KEY = 'auth_token';

/** قراءة التوكن من متغير البيئة أو التخزين المحلي */
export function getAuthToken(): string | null {
  // في بيئة السيرفر، استخدم متغير البيئة فقط
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_AUTH_TOKEN || null;
  }
  
  // في المتصفح، أولوية القراءة:
  // 1. متغير البيئة (من .env)
  // 2. localStorage
  // 3. sessionStorage
  return (
    process.env.NEXT_PUBLIC_AUTH_TOKEN ||
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
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
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/** إنشاء Axios instance مع interceptors */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

/** إضافة التوكن تلقائياً لكل طلب */
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
