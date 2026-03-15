import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
if (typeof window !== 'undefined') {
  try {
    if (!(window as unknown as { __firebaseApp?: FirebaseApp }).__firebaseApp) {
      (window as unknown as { __firebaseApp: FirebaseApp }).__firebaseApp = initializeApp(firebaseConfig);
    }
    app = (window as unknown as { __firebaseApp: FirebaseApp }).__firebaseApp;
  } catch (e) {
    console.error('Firebase app initialization failed.', e);
  }
}

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined' || !app) {
    return Promise.resolve(null);
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }

    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      });
      await navigator.serviceWorker.ready;
    }

    return getMessaging(app);
  } catch (e) {
    console.error('Messaging setup failed:', e);
    return null;
  }
};

export { app };
