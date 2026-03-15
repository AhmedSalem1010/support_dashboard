'use client';

import { useEffect, useRef } from 'react';
import { getMessagingInstance } from '@/lib/firebase/config';

type ForegroundMessageHandler = (payload: unknown) => void;

const WINDOW_FCM_ATTACHED = '__fcmForegroundListenerAttached';

export function useFirebaseMessagingForeground(onMessage?: ForegroundMessageHandler) {
  const unsubRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const attach = async () => {
      if (typeof window === 'undefined' || (window as unknown as Record<string, boolean>)[WINDOW_FCM_ATTACHED]) {
        return;
      }

      const msg = await getMessagingInstance();
      if (!msg) return;

      const { onMessage: onMessageFn } = await import('firebase/messaging');
      (window as unknown as Record<string, boolean>)[WINDOW_FCM_ATTACHED] = true;

      const unsub = onMessageFn(msg, (payload) => {
        if (onMessage) {
          onMessage(payload);
        } else {
          console.log('Foreground message received:', payload);
        }
      });

      unsubRef.current = unsub;
    };

    attach();

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = undefined;
      }
      if (typeof window !== 'undefined') {
        (window as unknown as Record<string, boolean>)[WINDOW_FCM_ATTACHED] = false;
      }
    };
  }, [onMessage]);
}
