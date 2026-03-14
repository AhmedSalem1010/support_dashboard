'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  Download,
  X,
  ChevronUp,
  ChevronDown,
  Car,
  Gauge,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { useVehicleAlertsList } from '@/hooks/useVehicleAlertsList';
import { PageLoading } from '@/components/ui/PageLoading';
import { VehiclePlateInput } from '@/components/ui/VehiclePlateInput';
import {
  type OperationAlertRecord,
  type OperationType,
  OPERATION_TYPE_LABELS,
  OPERATION_TYPE_COLORS,
  getDayFromDate,
} from '@/types/operationAlerts';

const ROWS_PER_PAGE = 10;

const COLOR_CLASSES: Record<string, { bg: string; text: string }> = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  red: { bg: 'bg-red-100', text: 'text-red-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

type SortKey = keyof OperationAlertRecord | '';
type SortDir = 'asc' | 'desc';

const BORDER_COLORS: Record<string, string> = {
  orange: 'border-orange-500',
  yellow: 'border-yellow-500',
  red: 'border-red-500',
  blue: 'border-blue-500',
  purple: 'border-purple-500',
};

const ICON_COLORS: Record<string, string> = {
  orange: 'text-orange-500',
  yellow: 'text-yellow-600',
  red: 'text-red-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
};

export function OperationAlerts() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [searchVehiclePlate, setSearchVehiclePlate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const operationTypeNum =
    filterType && [1, 2, 3, 4, 5].includes(Number(filterType))
      ? (Number(filterType) as OperationType)
      : undefined;

  const { data: apiData, meta, isLoading, error, refetch } = useVehicleAlertsList({
    page: currentPage,
    limit: ROWS_PER_PAGE,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    operationType: operationTypeNum,
    vehiclePlateName: searchVehiclePlate.trim() || undefined,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, filterType, searchVehiclePlate]);

  const filteredData = apiData;

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const copy = [...filteredData];
    copy.sort((a, b) => {
      const aVal = a[sortKey as keyof OperationAlertRecord];
      const bVal = b[sortKey as keyof OperationAlertRecord];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') cmp = aVal - bVal;
      else if (typeof aVal === 'string' && typeof bVal === 'string')
        cmp = aVal.localeCompare(bVal);
      else cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filteredData, sortKey, sortDir]);

  const paginatedData = sortedData;

  const totalPages = meta?.totalPages ?? 1;
  const hasNextPage = meta?.hasNextPage ?? false;
  const hasPrevPage = meta?.hasPreviousPage ?? false;

  const typeCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredData.forEach((r) => {
      counts[r.operation_type as OperationType]++;
    });
    return counts;
  }, [filteredData]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setFilterType('');
    setSearchVehiclePlate('');
    setCurrentPage(1);
    setSortKey('');
    setSortDir('asc');
  };

  const formatDate = (d: string) => {
    return new Date(d + 'T00:00:00').toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatMinutesToHours = (minutes: number) => {
    const hours = Number((minutes / 60).toFixed(1));
    return `${hours} س`;
  };

  const hasActiveFilters =
    dateFrom || dateTo || filterType || searchVehiclePlate.trim();

  const paginationMeta = {
    page: meta?.page ?? currentPage,
    totalPages,
    total: meta?.total ?? sortedData.length,
    hasNextPage,
    hasPreviousPage: hasPrevPage,
  };

  if (isLoading && apiData.length === 0) {
    return <PageLoading message="جاري تحميل مخالفات المركبات..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header - مطابق لصفحة التفويض */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#09b9b5] to-[#0da9a5] rounded-xl shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                تقرير مخالفات المركبات
              </h1>
              <p className="text-sm text-[#617c96]">
                مراقبة ومتابعة مخالفات تشغيل المركبات - {filteredData.length} مخالفة
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* View Toggle - مطابق لصفحة التفويض */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'table'
                  ? 'bg-white shadow-sm text-[#09b9b5] font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              جدول
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-[#09b9b5] font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              بطاقات
            </button>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm relative"
          >
            <Filter className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden xs:inline">تصفية</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#09b9b5] rounded-full" />
            )}
          </Button>

          <Button variant="secondary" className="text-sm group">
            <Download className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden xs:inline">تصدير</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards - مطابقة لصفحة التفويض (نقطة + blur + نفس البنية) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {([1, 2, 3, 4, 5] as OperationType[]).map((type) => {
          const color = OPERATION_TYPE_COLORS[type];
          const borderCls = BORDER_COLORS[color] || 'border-gray-400';
          const iconCls = ICON_COLORS[color] || 'text-gray-600';
          const label = OPERATION_TYPE_LABELS[type];
          const count = typeCounts[type] ?? 0;
          return (
            <Card
              key={type}
              className={`border-r-4 ${borderCls} hover:shadow-xl transition-all duration-300 group cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${color === 'orange' ? 'bg-orange-500' : color === 'yellow' ? 'bg-yellow-500' : color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                    {label}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                    {count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">مخالفة</p>
                </div>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-xl group-hover:blur-2xl transition-all ${color === 'orange' ? 'bg-orange-500/20' : color === 'yellow' ? 'bg-yellow-500/20' : color === 'red' ? 'bg-red-500/20' : color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`} />
                  <AlertCircle className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 relative z-10 group-hover:scale-110 transition-all ${iconCls}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters - مطابق لصفحة التفويض (قابل للطي + border-t-4) */}
      <Card className="border-t-4 border-[#09b9b5]">
        <div className="space-y-4">
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">من تاريخ</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">إلى تاريخ</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع العملية</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {([1, 2, 3, 4, 5] as OperationType[]).map((t) => (
                    <option key={t} value={String(t)}>
                      {OPERATION_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <VehiclePlateInput
                value={searchVehiclePlate}
                onChange={setSearchVehiclePlate}
                label="لوحة المركبة"
              />
              {hasActiveFilters && (
                <div className="sm:col-span-3 xl:col-span-1 flex justify-end xl:items-end">
                  <Button variant="outline" onClick={resetFilters} className="text-sm">
                    <X className="w-4 h-4 ml-2" />
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Results Summary - مطابق لصفحة التفويض */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Search className="w-4 h-4 text-blue-600" />
          <span>
            تم العثور على <strong className="text-blue-600">{paginationMeta.total}</strong> نتيجة
          </span>
        </div>
      )}

      {/* Table / Grid View - مطابق لصفحة التفويض */}
      {viewMode === 'table' ? (
        <Card>
          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('' as SortKey)}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  #
                </th>
                <th
                  onClick={() => handleSort('vehiclePlateName')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    لوحة المركبة
                    {sortKey === 'vehiclePlateName' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('driverName')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    اسم السائق
                    {sortKey === 'driverName' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('operation_type')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    نوع العملية
                    {sortKey === 'operation_type' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('operation_date')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    تاريخ العملية
                    {sortKey === 'operation_date' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c]">
                  اليوم
                </th>
                <th
                  onClick={() => handleSort('max_speed')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    السرعة القصوى
                    {sortKey === 'max_speed' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('distance')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    المسافة
                    {sortKey === 'distance' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('moving_duration')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    مدة التشغيل (متحركة)
                    {sortKey === 'moving_duration' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort('idle_duration')}
                  className="px-4 py-3 text-right text-sm font-semibold text-[#4d647c] cursor-pointer hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-1">
                    مدة التشغيل (واقفة)
                    {sortKey === 'idle_duration' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, idx) => {
                const rowNum = (currentPage - 1) * ROWS_PER_PAGE + idx + 1;
                const color = OPERATION_TYPE_COLORS[row.operation_type as OperationType];
                const { bg, text } = COLOR_CLASSES[color] || {
                  bg: 'bg-gray-100',
                  text: 'text-gray-700',
                };
                return (
                  <tr
                    key={row.id}
                    className="border-t transition-colors hover:bg-[#09b9b5]/5"
                  >
                    <td className="px-4 py-3 text-sm text-[#4d647c]">{rowNum}</td>
                    <td className="px-4 py-3 text-sm text-[#4d647c] font-medium">
                      {row.vehiclePlateName}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4d647c]">
                      {row.driverName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
                      >
                        {OPERATION_TYPE_LABELS[row.operation_type as OperationType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4d647c]">
                      {formatDate(row.operation_date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4d647c]">
                      {getDayFromDate(row.operation_date)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-medium ${
                        row.max_speed > 120 ? 'text-red-600 bg-red-50' : 'text-[#4d647c]'
                      }`}
                    >
                      {row.max_speed} كم/س
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4d647c]">
                      {row.distance} كم
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4d647c]">
                      {formatMinutesToHours(row.moving_duration)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4d647c]">
                      {formatMinutesToHours(row.idle_duration)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((row, index) => {
            const color = OPERATION_TYPE_COLORS[row.operation_type as OperationType];
            const { bg, text } = COLOR_CLASSES[color] || { bg: 'bg-gray-100', text: 'text-gray-700' };
            const borderCls = BORDER_COLORS[color] || 'border-gray-400';
            return (
              <Card
                key={row.id}
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 ${borderCls} overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative bg-gradient-to-br from-[#09b9b5]/10 via-[#09b9b5]/5 to-transparent p-4">
                    <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-md">
                        <AlertCircle className={`w-6 h-6 ${text}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{row.vehiclePlateName}</h3>
                        <p className="text-sm text-gray-600">{row.driverName}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
                      {OPERATION_TYPE_LABELS[row.operation_type as OperationType]}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Car className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">لوحة المركبة</p>
                        <p className="font-semibold text-gray-900">{row.vehiclePlateName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-[#09b9b5]/10 rounded-lg">
                        <Gauge className="w-4 h-4 text-[#09b9b5]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">السرعة القصوى</p>
                        <p className={`font-semibold ${row.max_speed > 120 ? 'text-red-600' : 'text-gray-900'}`}>
                          {row.max_speed} كم/س
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ العملية</span>
                      <span className="font-semibold">{formatDate(row.operation_date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">اليوم</span>
                      <span className="font-semibold">{getDayFromDate(row.operation_date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">المسافة</span>
                      <span className="font-semibold">{row.distance} كم</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">مدة التشغيل (متحركة/واقفة)</span>
                      <span className="font-semibold">{formatMinutesToHours(row.moving_duration)} / {formatMinutesToHours(row.idle_duration)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Pagination meta={paginationMeta} onPageChange={setCurrentPage} />
    </div>
  );
}
