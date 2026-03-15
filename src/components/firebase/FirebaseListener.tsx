'use client';

import { useFirebaseMessagingForeground } from '@/lib/firebase/useFirebaseMessagingForeground';
import { useNotificationsContext } from '@/components/ui/Notifications';

export function FirebaseListener() {
  const { info } = useNotificationsContext();

  useFirebaseMessagingForeground((payload) => {
    const p = payload as { notification?: { title?: string; body?: string }; data?: Record<string, string> };
    const title = p?.notification?.title ?? p?.data?.title ?? 'إشعار';
    const body = p?.notification?.body ?? p?.data?.body ?? '';
    if (title || body) {
      info(title, body || undefined);
    }
  });

  return null;
}
