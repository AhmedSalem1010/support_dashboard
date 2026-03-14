'use client';

import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export interface PageLoadingProps {
  /** نص يظهر تحت أيقونة التحميل (اختياري) */
  message?: string;
  /** إظهار المحتوى داخل Card (افتراضي: true) */
  wrapInCard?: boolean;
  className?: string;
}

const DEFAULT_MESSAGE = 'جاري تحميل البيانات...';

/**
 * مكوّن تحميل مشترك لجميع صفحات التطبيق.
 * يُستخدم عند انتظار جلب البيانات من السيرفر.
 */
export function PageLoading({
  message = DEFAULT_MESSAGE,
  wrapInCard = true,
  className = '',
}: PageLoadingProps) {
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-[#09b9b5] ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="w-10 h-10 animate-spin shrink-0" aria-hidden />
      <span className="text-sm font-medium text-gray-600">{message}</span>
    </div>
  );

  if (wrapInCard) {
    return (
      <Card className="flex items-center justify-center py-16">
        {content}
      </Card>
    );
  }

  return content;
}
