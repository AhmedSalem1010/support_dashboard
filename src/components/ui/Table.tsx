'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  hideOnMobile?: boolean;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({ columns, data, onRowClick }: TableProps<T>) {
  // CleanLife Design System - Tables
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-gray-200">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th 
                  key={String(col.key)} 
                  className={`px-4 py-3 text-right text-sm font-semibold text-[#4d647c] ${
                    col.hideOnMobile ? 'hidden md:table-cell' : ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-t transition-colors duration-200 ease-out
                  ${onRowClick ? 'cursor-pointer active:bg-[#09b9b5]/10' : ''}
                  hover:bg-[#09b9b5]/5
                `}
              >
                {columns.map((col) => {
                  const value = row[col.key as keyof T];
                  const cell: ReactNode = col.render ? col.render(value, row) : String(value ?? '');
                  return (
                    <td 
                      key={String(col.key)} 
                      className={`px-4 py-3 whitespace-nowrap text-sm text-[#4d647c] ${
                        col.hideOnMobile ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile hint for horizontal scroll */}
      <div className="sm:hidden text-center text-xs text-[#617c96] py-2 bg-gray-50">
        اسحب للتمرير الأفقي
      </div>
    </div>
  );
}
