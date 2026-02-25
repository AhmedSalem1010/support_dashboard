'use client';

import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  /** الصفحة الحالية (1-based) */
  page: number;
  /** إجمالي عدد الصفحات */
  totalPages: number;
  /** عند تغيير الصفحة */
  onPageChange: (page: number) => void;
  /** إظهار الترقيم فقط عندما يكون هناك أكثر من صفحة (اختياري) */
  hideIfSinglePage?: boolean;
  /** عدد أرقام الصفحات الظاهرة حول الحالية (اختياري، افتراضي 2) */
  siblingCount?: number;
  className?: string;
}

/**
 * مكوّن ترقيم: <<  <  [أرقام مع ...]  >  >>
 * الصفحة الحالية بدائرة تركوازية، الباقي رمادي
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  hideIfSinglePage = true,
  siblingCount = 2,
  className = '',
}: PaginationProps) {
  if (totalPages < 1) return null;
  if (hideIfSinglePage && totalPages <= 1) return null;

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  // نافذة الأرقام حول الصفحة الحالية (صعوداً ثم نعكس للعرض RTL)
  const windowStart = Math.max(1, page - siblingCount);
  const windowEnd = Math.min(totalPages, page + siblingCount);
  const windowPages: number[] = [];
  for (let i = windowStart; i <= windowEnd; i++) windowPages.push(i);
  const sortedWindow = [...windowPages].sort((a, b) => b - a);

  const showFirstEllipsis = windowStart > 2;
  const showLastEllipsis = windowEnd < totalPages - 1;
  const showFirstPage = windowStart > 1;
  const showLastPage = windowEnd < totalPages && totalPages > 1;

  const buttonBase =
    'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const arrowClass = `text-gray-400 hover:text-gray-600 ${buttonBase}`;
  const pageClass = (isActive: boolean) =>
    isActive
      ? `bg-[#09b9b5] text-white cursor-default ${buttonBase}`
      : `text-gray-400 hover:text-gray-700 hover:bg-gray-100 ${buttonBase}`;

  return (
    <nav
      role="navigation"
      aria-label="الترقيم"
      className={`flex items-center justify-center gap-1 ${className}`}
      dir="rtl"
    >
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={!hasNext}
        className={arrowClass}
        aria-label="آخر صفحة"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={arrowClass}
        aria-label="الصفحة التالية"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-0.5 mx-1">
        {showLastPage && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className={pageClass(page === totalPages)}
            >
              {totalPages}
            </button>
            {showLastEllipsis && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
            )}
          </>
        )}
        {sortedWindow.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={pageClass(p === page)}
          >
            {p}
          </button>
        ))}
        {showFirstEllipsis && (
          <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
        )}
        {showFirstPage && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className={pageClass(page === 1)}
          >
            1
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
        className={arrowClass}
        aria-label="الصفحة السابقة"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={!hasPrevious}
        className={arrowClass}
        aria-label="أول صفحة"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
    </nav>
  );
}
