import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

// استخدام خط IBM Plex Sans Arabic كبديل احترافي
// يمكن استبداله بـ ExpoArabic المحلي عند توفره في /public/fonts/
const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-expo',
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
    <html lang="ar" dir="rtl" className={arabicFont.variable}>
      <body className={`${arabicFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
