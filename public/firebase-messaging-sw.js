importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// إعدادات مشروع Firebase (support-system-65d5c) - يجب أن تطابق .env
const firebaseConfig = {
  apiKey: "AIzaSyAq0A2m_8pDp7okytdCxdx14sEWr-2YZWg",
  authDomain: "support-system-65d5c.firebaseapp.com",
  projectId: "support-system-65d5c",
  storageBucket: "support-system-65d5c.firebasestorage.app",
  messagingSenderId: "399058272400",
  appId: "1:399058272400:web:a644295414c8c719df5815"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || 'إشعار جديد';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
