'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { setAuthToken, clearAuthToken, getAuthToken, clearAllStorage } from '@/lib/api/config';
import { logout as apiLogout } from '@/lib/api/auth';
import type { AuthUser, AuthState } from '@/types/auth';

const USER_STORAGE_KEY = 'auth_user';
const LOGIN_TIMESTAMP_KEY = 'auth_login_timestamp';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 ساعة

interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = getAuthToken();
    const user = getStoredUser();
    if (typeof window === 'undefined') {
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }
    let timestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
    if (token && user && !timestamp) {
      timestamp = String(Date.now());
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, timestamp);
    }
    const loginTime = timestamp ? parseInt(timestamp, 10) : null;
    const isExpired = loginTime != null && Date.now() - loginTime >= SESSION_DURATION_MS;

    if (token && user && isExpired) {
      apiLogout().catch(() => {});
      clearAllStorage();
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    setState({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading: false,
    });
  }, []);

  const login = useCallback((token: string, user: AuthUser) => {
    setAuthToken(token, true);
    storeUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, String(Date.now()));
    }
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // تجاهل الخطأ
    }
    clearAllStorage();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // فحص انتهاء الجلسة بعد 12 ساعة (كل دقيقة)
  useEffect(() => {
    if (!state.isAuthenticated || typeof window === 'undefined') return;
    const checkSession = async () => {
      const timestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
      const loginTime = timestamp ? parseInt(timestamp, 10) : null;
      if (loginTime != null && Date.now() - loginTime >= SESSION_DURATION_MS) {
        try {
          await apiLogout();
        } catch {
          // تجاهل الخطأ
        }
        clearAllStorage();
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };
    const interval = setInterval(checkSession, 60 * 1000); // كل دقيقة
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates };
      storeUser(updatedUser);
      return { ...prev, user: updatedUser };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
