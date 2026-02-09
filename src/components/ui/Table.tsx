'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
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
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((col) => {
                const value = row[col.key as keyof T];
                const cell: ReactNode = col.render ? col.render(value, row) : String(value ?? '');
                return (
                  <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
