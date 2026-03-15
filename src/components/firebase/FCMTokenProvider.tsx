'use client';

import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useFCMToken } from '@/lib/firebase/useFCMToken';
import { updateUserFcmToken } from '@/lib/api/auth';
import { useNotificationsContext } from '@/components/ui/Notifications';

const FCM_TOKEN_SENT_KEY = 'fcm-token-sent';

export function FCMTokenProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { token: fcmToken, permissionStatus, requestPermission, retrieveToken } = useFCMToken();
  const { success: showSuccess, error: showError } = useNotificationsContext();
  const sentForUserRef = useRef<string | null>(null);
  const permissionRequestedRef = useRef(false);

  // عند تسجيل الدخول: إن كان الإذن ممنوحاً نستخرج التوكن، وإن كان افتراضياً نطلب الإذن مرة واحدة
  useEffect(() => {
    if (typeof window === 'undefined' || !isAuthenticated || !user?.id) return;
    if (permissionStatus === 'granted') {
      retrieveToken();
      return;
    }
    if (permissionStatus === 'default' && !permissionRequestedRef.current) {
      permissionRequestedRef.current = true;
      requestPermission().catch(() => {});
    }
  }, [isAuthenticated, user?.id, permissionStatus, retrieveToken, requestPermission]);

  // إرسال FCM token إلى السيرفر عند توفر التوكن والمستخدم
  useEffect(() => {
    const sendTokenToServer = async (userId: string, tokenToSend: string, isRetry = false) => {
      try {
        await updateUserFcmToken(userId, tokenToSend);
        if (typeof window !== 'undefined') {
          localStorage.setItem(FCM_TOKEN_SENT_KEY, tokenToSend);
        }
        sentForUserRef.current = userId;
        showSuccess('تم حفظ توكن الإشعارات');
      } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status : null;
        const data = axios.isAxiosError(err) ? err.response?.data : null;
        console.error('Failed to send FCM token to server:', { err, status, data });
        const msg =
          status === 401
            ? 'انتهت الجلسة. سجّل الدخول مرة أخرى.'
            : status === 403
              ? 'غير مصرح بتحديث التوكن.'
              : status === 404
                ? 'المستخدم غير موجود في السيرفر.'
                : axios.isAxiosError(err) && err.message
                  ? err.message
                  : 'فشل تحديث توكن الإشعارات.';
        showError('توكن الإشعارات', msg);
        if (!isRetry && typeof window !== 'undefined') {
          window.setTimeout(() => sendTokenToServer(userId, tokenToSend, true), 2000);
        }
      }
    };

    if (!fcmToken || !isAuthenticated || !user?.id) return;

    const sentToken = typeof window !== 'undefined' ? localStorage.getItem(FCM_TOKEN_SENT_KEY) : null;
    const alreadySentForThisUser = sentForUserRef.current === user.id && sentToken === fcmToken;

    if (!alreadySentForThisUser) {
      sendTokenToServer(user.id, fcmToken);
    }
  }, [fcmToken, isAuthenticated, user?.id, showSuccess, showError]);

  return <>{children}</>;
}

export default FCMTokenProvider;
