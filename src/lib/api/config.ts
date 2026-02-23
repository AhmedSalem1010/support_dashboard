/**
 * إعدادات واجهة برمجة التطبيقات (API)
 * يمكن تغيير القيمة من خلال متغيرات البيئة
 */

import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const TOKEN_STORAGE_KEY = 'auth_token';

/** توكن ثابت للتطوير */
const DEFAULT_DEV_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyYzYwMTU1LTBhNmYtNGRjMS05YTJhLTY3ZGJkMThiMGQ3ZCIsInVzZXJuYW1lIjoiSVQiLCJwaG9uZSI6Iis5NjY1MzM0MzYwMTkiLCJpYXQiOjE3NzE2NzI0NjAsImV4cCI6MTc3MTcxNTY2MH0.esKcBCUIAhUAk9PL5oBJijd2X57giBexqDl0M9Caou4';

/** قراءة التوكن من التخزين أو من متغير البيئة أو التوكن الثابت (للتطوير) */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return DEFAULT_DEV_TOKEN;
  return (
    process.env.NEXT_PUBLIC_AUTH_TOKEN ||
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
    DEFAULT_DEV_TOKEN
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
  timeout: 10000,
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
