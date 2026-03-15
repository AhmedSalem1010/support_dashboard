'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from '@/lib/firebase/config';

export function useFCMToken() {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retrieveToken = useCallback(async () => {
    try {
      setError(null);
      const messaging = await getMessagingInstance();
      if (!messaging) return null;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn('NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set');
        return null;
      }

      const currentToken = await getToken(messaging, { vapidKey });

      if (currentToken) {
        setToken(currentToken);
        return currentToken;
      }
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermissionStatus(currentPermission);

      if (currentPermission === 'granted') {
        const t = setTimeout(() => retrieveToken(), 800);
        return () => clearTimeout(t);
      }
    }
  }, [retrieveToken]);

  const requestPermission = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === 'granted') {
        return await retrieveToken();
      }
      setError('تم رفض إذن الإشعارات');
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [retrieveToken]);

  return { token, permissionStatus, loading, error, requestPermission, retrieveToken };
}
