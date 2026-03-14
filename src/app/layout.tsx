import type { Metadata } from 'next';
import Script from 'next/script';
import { IBM_Plex_Sans_Arabic, Tajawal } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/components/ui/Notifications';
import { AuthProvider } from '@/contexts/AuthContext';

// استخدام خط IBM Plex Sans Arabic كبديل احترافي
// يمكن استبداله بـ ExpoArabic المحلي عند توفره في /public/fonts/
const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-expo',
  display: 'swap',
});

// خط Tajawal لصفحات التقارير والمخالفات
const tajawalFont = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CleanLife - نظام المساندة ودعم الفرق',
  description: 'نظام إدارة المركبات والفرق - CleanLife Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${arabicFont.variable} ${tajawalFont.variable}`}>
      <body className={`${arabicFont.className} antialiased`}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
