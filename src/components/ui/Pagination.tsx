'use client';

import { ChevronsRight, ChevronRight, ChevronLeft, ChevronsLeft } from 'lucide-react';
import { Card } from './Card';

interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <Card>
      <div className="flex items-center justify-center px-6 py-4">
        <nav className="flex items-center gap-1" aria-label="ترقيم الصفحات">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!meta.hasPreviousPage}
            className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
            title="الأولى"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(meta.page - 1)}
            disabled={!meta.hasPreviousPage}
            className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
            title="السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (meta.totalPages <= 7) return true;
                if (p === 1 || p === meta.totalPages) return true;
                if (Math.abs(p - meta.page) <= 2) return true;
                return false;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev != null && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-0.5">
                    {showEllipsis && (
                      <span className="px-2 text-gray-400 text-sm">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`min-w-[2.25rem] h-9 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        meta.page === p
                          ? 'bg-[#09b9b5] text-white shadow-md shadow-[#09b9b5]/25'
                          : 'text-gray-600 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5]'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
          </div>
          <button
            type="button"
            onClick={() => onPageChange(meta.page + 1)}
            disabled={!meta.hasNextPage}
            className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
            title="التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(meta.totalPages)}
            disabled={!meta.hasNextPage}
            className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
            title="الأخيرة"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </Card>
  );
}
