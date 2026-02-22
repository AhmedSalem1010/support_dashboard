'use client';

import { useState } from 'react';
import { Plus, FileText, User, Car, Calendar, Package, Search, Filter, Download, X, Eye, Edit, XCircle, CheckCircle, AlertCircle, Clock, TrendingUp, Users, Shield, RefreshCw, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuthorizations } from '@/hooks/useAuthorizations';
import { cancelAuthorization } from '@/lib/api/authorizations';
import { useVehiclesList } from '@/hooks/useVehiclesList';
import { AUTHORIZATION_STATUS_LABELS, AUTHORIZATION_TYPE_LABELS, statusToArabic } from '@/lib/enums';
import type { AuthorizationDisplay } from '@/lib/authorizations/mappers';

function addDaysToDate(dateStr: string, days: number): string {
  if (!dateStr || days <= 0) return '';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function getDaysRemaining(endDate: string): number {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function Authorizations() {
  const { vehicleOptions } = useVehiclesList();
  const [filters, setFilters] = useState({
    authorizationType: '',
    authorizationStatus: '',
    vehiclePlateName: '',
    driverName: '',
    driverJisrId: '',
    driverIdReceivedFromName: '',
    userDriverName: '',
    userDriverReceivedFromName: '',
    authorizationStartDate: '',
    authorizationEndDate: '',
    authorizationEndDateFrom: '',
    authorizationEndDateTo: '',
  });

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const { authorizations, meta, isLoading, error, refetch, page, setPage } = useAuthorizations({
    limit: 10,
    authorizationType: filters.authorizationType || undefined,
    authorizationStatus: filters.authorizationStatus || undefined,
    vehiclePlateName: filters.vehiclePlateName || undefined,
    driverName: filters.driverName || undefined,
    driverJisrId: filters.driverJisrId || undefined,
    driverIdReceivedFromName: filters.driverIdReceivedFromName || undefined,
    userDriverName: filters.userDriverName || undefined,
    userDriverReceivedFromName: filters.userDriverReceivedFromName || undefined,
    authorizationStartDate: filters.authorizationStartDate || undefined,
    authorizationEndDate: filters.authorizationEndDate || undefined,
    authorizationEndDateFrom: filters.authorizationEndDateFrom || undefined,
    authorizationEndDateTo: filters.authorizationEndDateTo || undefined,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedAuth, setSelectedAuth] = useState<AuthorizationDisplay | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [workersCount, setWorkersCount] = useState<string>('one');
  const [authorizationDays, setAuthorizationDays] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');

  const endDate = startDate && authorizationDays > 0 ? addDaysToDate(startDate, authorizationDays) : '';

  const handleCancelAuthorization = async (auth: AuthorizationDisplay) => {
    if (!confirm(`هل تريد إلغاء تفويض المركبة "${auth.vehicle}"؟`)) return;
    setCancellingId(auth.id);
    try {
      await cancelAuthorization(auth.id);
      await refetch();
      setSelectedAuth(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'فشل إلغاء التفويض');
    } finally {
      setCancellingId(null);
    }
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => {
    setFilters({
      authorizationType: '',
      authorizationStatus: '',
      vehiclePlateName: '',
      driverName: '',
      driverJisrId: '',
      driverIdReceivedFromName: '',
      userDriverName: '',
      userDriverReceivedFromName: '',
      authorizationStartDate: '',
      authorizationEndDate: '',
      authorizationEndDateFrom: '',
      authorizationEndDateTo: '',
    });
    setPage(1);
  };

  // البيانات من API بعد التصفية من الخادم
  const displayedAuthorizations = authorizations;

  // Statistics (من الصفحة الحالية)
  const stats = {
    active: authorizations.filter(a => a.status === 'ساري').length,
    expiringSoon: authorizations.filter(a => a.status === 'قريب الانتهاء').length,
    expired: authorizations.filter(a => a.status === 'منتهي').length,
    total: meta?.total ?? authorizations.length,
  };

  const columns = [
    {
      key: 'authNumber',
      label: 'رقم التفويض',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#09b9b5]/10 to-[#09b9b5]/20 rounded-xl flex items-center justify-center border border-[#09b9b5]/20">
              <FileText className="w-5 h-5 text-[#09b9b5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <CheckCircle className="w-3 h-3 text-green-500" />
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-900">{String(value)}</p>
            <p className="text-xs text-gray-500">{row.vehicleModel}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'المركبة',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold">{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'driver',
      label: 'السائق والمشرف',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{String(value)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{row.supervisor}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'الفترة',
      render: (value: unknown, row: any) => {
        const daysRemaining = getDaysRemaining(row.endDate);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm">{String(value)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">{row.endDate}</span>
            </div>
            {daysRemaining > 0 && (
              <p className="text-xs text-gray-500">متبقي {daysRemaining} يوم</p>
            )}
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'النوع',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <Badge variant={String(value) === 'تم + محلي' ? 'info' : 'default'}>
            {String(value)}
          </Badge>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{row.workersCount} عمال</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => {
        const v = String(value);
        const displayStatus = statusToArabic(v);
        const variant = displayStatus === 'ساري' ? 'success' : displayStatus === 'قريب الانتهاء' ? 'warning' : displayStatus === 'ملغي' || displayStatus === 'مرفوض' ? 'default' : 'info';
        const icon = displayStatus === 'ساري' ? CheckCircle : displayStatus === 'قريب الانتهاء' ? AlertCircle : X;
        const Icon = icon;
        return (
          <Badge variant={variant} className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" />
            {displayStatus}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_: unknown, row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAuth(row);
            }}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelAuthorization(row);
            }}
            disabled={cancellingId === row.id || row.status === 'منتهي' || row.status === 'ملغي'}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            title="إلغاء التفويض"
          >
            {cancellingId === row.id ? (
              <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Renew logic
            }}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
            title="تجديد"
          >
            <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#09b9b5] to-[#0da9a5] rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة التفويض</h1>
              <p className="text-sm text-[#617c96]">تفويض المركبات وجرد العهدة - {meta?.total ?? 0} تفويض</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* View Toggle */}
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
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#09b9b5] rounded-full"></span>
            )}
          </Button>
          
          <Button variant="secondary" className="text-sm group">
            <Download className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden xs:inline">تصدير</span>
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => {
              setShowModal(true);
              setCurrentStep(1);
            }} 
            className="text-sm group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Plus className="w-4 h-4 ml-1 sm:ml-2 relative z-10 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline relative z-10">تفويض جديد</span>
            <span className="sm:hidden relative z-10">تفويض</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#09b9b5] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#09b9b5] rounded-full animate-pulse"></span>
                إجمالي التفويضات
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">جميع الحالات</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#09b9b5]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#09b9b5] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#00a287] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00a287] rounded-full animate-pulse"></span>
                التفويضات السارية
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.active}
              </p>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% نشطة
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#00a287]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#00a287] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#f57c00] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#f57c00] rounded-full animate-pulse"></span>
                قريبة من الانتهاء
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.expiringSoon}
              </p>
              <p className="text-xs text-orange-600 mt-1 font-semibold">تحتاج تجديد</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f57c00]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#f57c00] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#d32f2f] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#d32f2f] rounded-full animate-pulse"></span>
                منتهية
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.expired}
              </p>
              <p className="text-xs text-red-600 mt-1 font-semibold">غير نشطة</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d32f2f]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <X className="w-8 h-8 sm:w-10 sm:h-10 text-[#d32f2f] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-t-4 border-[#09b9b5]">
        <div className="space-y-4">
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع التفويض</label>
                <select 
                  value={filters.authorizationType}
                  onChange={(e) => updateFilter('authorizationType', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(AUTHORIZATION_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">حالة التفويض</label>
                <select 
                  value={filters.authorizationStatus}
                  onChange={(e) => updateFilter('authorizationStatus', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(AUTHORIZATION_STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">لوحة المركبة</label>
                <input
                  type="text"
                  value={filters.vehiclePlateName}
                  onChange={(e) => updateFilter('vehiclePlateName', e.target.value)}
                  placeholder="مثال: ب ع ق 2589"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">اسم السائق</label>
                <input
                  type="text"
                  value={filters.driverName}
                  onChange={(e) => updateFilter('driverName', e.target.value)}
                  placeholder="بحث بالاسم"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">رقم السائق (جسر)</label>
                <input
                  type="text"
                  value={filters.driverJisrId}
                  onChange={(e) => updateFilter('driverJisrId', e.target.value)}
                  placeholder="مثال: 755"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">اسم المسلم منه</label>
                <input
                  type="text"
                  value={filters.driverIdReceivedFromName}
                  onChange={(e) => updateFilter('driverIdReceivedFromName', e.target.value)}
                  placeholder="بحث بالاسم"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">اسم سائق المستخدم</label>
                <input
                  type="text"
                  value={filters.userDriverName}
                  onChange={(e) => updateFilter('userDriverName', e.target.value)}
                  placeholder="بحث بالاسم"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">اسم المسلم منه للمستخدم</label>
                <input
                  type="text"
                  value={filters.userDriverReceivedFromName}
                  onChange={(e) => updateFilter('userDriverReceivedFromName', e.target.value)}
                  placeholder="بحث بالاسم"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">تاريخ البداية</label>
                <input
                  type="date"
                  value={filters.authorizationStartDate}
                  onChange={(e) => updateFilter('authorizationStartDate', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">تاريخ انتهاء من</label>
                <input
                  type="date"
                  value={filters.authorizationEndDateFrom}
                  onChange={(e) => updateFilter('authorizationEndDateFrom', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">تاريخ انتهاء إلى</label>
                <input
                  type="date"
                  value={filters.authorizationEndDateTo}
                  onChange={(e) => updateFilter('authorizationEndDateTo', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const toDate = new Date(today);
                    toDate.setDate(toDate.getDate() + 30);
                    const fromStr = today.toISOString().split('T')[0];
                    const toStr = toDate.toISOString().split('T')[0];
                    setFilters((prev) => ({
                      ...prev,
                      authorizationStatus: 'active',
                      authorizationEndDateFrom: fromStr,
                      authorizationEndDateTo: toStr,
                    }));
                    setPage(1);
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                >
                  قريب الانتهاء (اليوم ← +30 يوم)
                </button>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="sm:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    <X className="w-4 h-4 ml-2" />
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Results Summary */}
      {hasActiveFilters && meta && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Search className="w-4 h-4 text-blue-600" />
          <span>تم العثور على <strong className="text-blue-600">{meta.total}</strong> نتيجة</span>
        </div>
      )}

      {/* Loading / Error */}
      {isLoading && (
        <Card className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-[#09b9b5]" />
        </Card>
      )}
      {error && (
        <Card className="border-red-200 bg-red-50 text-red-700 py-4 px-4">
          {error}
        </Card>
      )}

      {/* Table/Grid View */}
      {!isLoading && !error && (viewMode === 'table' ? (
        <Card>
          <Table 
            columns={columns} 
            data={displayedAuthorizations} 
            onRowClick={(row) => setSelectedAuth(row)} 
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedAuthorizations.map((auth, index) => {
            const daysRemaining = getDaysRemaining(auth.endDate);
            return (
              <Card 
                key={auth.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-t-4 border-[#09b9b5] overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedAuth(auth)}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#09b9b5]/10 via-[#09b9b5]/5 to-transparent p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-md">
                        <FileText className="w-6 h-6 text-[#09b9b5]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{auth.authNumber}</h3>
                        <p className="text-sm text-gray-600">{auth.vehicleModel}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={(s => s === 'ساري' ? 'success' : s === 'قريب الانتهاء' ? 'warning' : 'default')(statusToArabic(auth.status))}
                    >
                      {statusToArabic(auth.status)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Vehicle & Driver */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Car className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">المركبة</p>
                        <p className="font-semibold text-gray-900">{auth.vehicle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">السائق</p>
                        <p className="font-semibold text-gray-900">{auth.driver}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ البداية</span>
                      <span className="font-semibold">{auth.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ الانتهاء</span>
                      <span className="font-semibold">{auth.endDate}</span>
                    </div>
                    {daysRemaining > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600 font-semibold">
                          متبقي {daysRemaining} يوم
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Type & Workers */}
                  <div className="flex items-center justify-between">
                    <Badge variant={auth.type === 'تم + محلي' ? 'info' : 'default'}>
                      {auth.type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{auth.workersCount} عمال</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button className="flex-1 py-2 px-3 bg-[#09b9b5] hover:bg-[#0da9a5] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ))}

      {/* Pagination */}
      {!isLoading && !error && meta && meta.totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-center px-6 py-4">
            <nav className="flex items-center gap-1" aria-label="ترقيم الصفحات">
              <button
                type="button"
                onClick={() => setPage(1)}
                disabled={!meta.hasPreviousPage}
                className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
                title="الأولى"
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setPage(page - 1)}
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
                          onClick={() => setPage(p)}
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
                onClick={() => setPage(page + 1)}
                disabled={!meta.hasNextPage}
                className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
                title="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setPage(meta.totalPages)}
                disabled={!meta.hasNextPage}
                className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
                title="الأخيرة"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </Card>
      )}

      {/* Authorization Details Modal */}
      {selectedAuth && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={() => setSelectedAuth(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#09b9b5] to-[#0da9a5] p-6 text-white">
              <button
                onClick={() => setSelectedAuth(null)}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedAuth.authNumber}</h2>
                  <p className="text-white/90">{selectedAuth.vehicleModel}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={(s => s === 'ساري' ? 'success' : s === 'قريب الانتهاء' ? 'warning' : 'default')(statusToArabic(selectedAuth.status))} className="bg-white/20 border-white/30">
                      {statusToArabic(selectedAuth.status)}
                    </Badge>
                    <Badge variant="info" className="bg-white/20 border-white/30">
                      {selectedAuth.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                  <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">المركبة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAuth.vehicle}</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">السائق</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAuth.driver}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">المشرف</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAuth.supervisor}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">العمال</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAuth.workersCount}</p>
                </div>
              </div>

              {/* Period */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#09b9b5]" />
                  فترة التفويض
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ البداية</p>
                    <p className="font-semibold text-gray-900">{selectedAuth.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ الانتهاء</p>
                    <p className="font-semibold text-gray-900">{selectedAuth.endDate}</p>
                  </div>
                </div>
                {getDaysRemaining(selectedAuth.endDate) > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">
                      متبقي <strong className="text-orange-600">{getDaysRemaining(selectedAuth.endDate)}</strong> يوم
                    </span>
                  </div>
                )}
              </div>

              {/* Equipment Inventory - غير متوفر من API حالياً */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#09b9b5]" />
                  جرد العهدة
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500">
                  جرد العهدة غير متوفر من السيرفر حالياً
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="primary" className="flex-1 group">
                  <Edit className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  تعديل التفويض
                </Button>
                <Button variant="secondary" className="flex-1 group">
                  <RefreshCw className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform" />
                  تجديد التفويض
                </Button>
                <Button variant="outline" className="group">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Authorization Modal (Multi-Step) */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#09b9b5] to-[#0da9a5] p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">تفويض جديد</h2>
                    <p className="text-white/80 text-sm mt-0.5">إنشاء تفويض مركبة وجرد العهدة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {[
                  { num: 1, label: 'معلومات أساسية', icon: FileText },
                  { num: 2, label: 'جرد العهدة', icon: Package },
                  { num: 3, label: 'أغراض الباص', icon: Car },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => setCurrentStep(step.num)}
                        className={`flex items-center gap-3 flex-1 p-3 rounded-xl transition-all ${
                          currentStep === step.num
                            ? 'bg-white text-[#09b9b5] shadow-lg'
                            : currentStep > step.num
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          currentStep === step.num
                            ? 'bg-[#09b9b5] text-white'
                            : currentStep > step.num
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 text-white/60'
                        }`}>
                          {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs opacity-80">الخطوة {step.num}</p>
                          <p className="text-sm font-semibold">{step.label}</p>
                        </div>
                      </button>
                      {i < 2 && (
                        <div className={`w-8 h-0.5 hidden sm:block ${
                          currentStep > step.num ? 'bg-white' : 'bg-white/20'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form className="p-6 space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <FileText className="w-5 h-5 text-[#09b9b5]" />
                    <h3 className="text-lg font-bold text-gray-900">المعلومات الأساسية</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="رقم التفويض"
                      placeholder="AUTH-2024-XXX"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نوع التفويض<span className="text-red-500 mr-1">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                        <option value="">اختر النوع</option>
                        <option value="local">محلي فقط</option>
                        <option value="tamm_local">تم + محلي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المركبة<span className="text-red-500 mr-1">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                        <option value="">اختر المركبة</option>
                        {vehicleOptions.map((v) => (
                          <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        السائق المستلم<span className="text-red-500 mr-1">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                        <option value="">اختر السائق</option>
                        <option value="1">محمد أحمد</option>
                        <option value="2">خالد سعيد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المشرف المسلم<span className="text-red-500 mr-1">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                        <option value="">اختر المشرف</option>
                        <option value="1">أحمد علي</option>
                        <option value="2">خالد محمد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الشخص المفوض السابق
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                        <option value="">اختر الشخص</option>
                        <option value="1">محمد أحمد</option>
                        <option value="2">خالد سعيد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الشخص المفوض في تم
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                        <option value="">اختر الشخص</option>
                        <option value="1">محمد أحمد</option>
                        <option value="2">خالد سعيد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        عدد العمال في الفريق<span className="text-red-500 mr-1">*</span>
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                        value={workersCount}
                        onChange={(e) => setWorkersCount(e.target.value)}
                      >
                        <option value="one">عامل واحد</option>
                        <option value="two">عاملين</option>
                        <option value="none">لا يوجد</option>
                      </select>
                    </div>

                    <Input 
                      label="عدد أيام التفويض" 
                      type="number" 
                      min="1"
                      value={authorizationDays || ''}
                      onChange={(e) => setAuthorizationDays(Number(e.target.value) || 0)}
                      required 
                    />

                    <Input 
                      label="تاريخ البداية" 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required 
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ الانتهاء <span className="text-gray-500 text-xs">(يُحسب تلقائياً)</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      {endDate && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          البداية + {authorizationDays} يوم = {endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      حالة المركبة عند التسليم
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      placeholder="اكتب ملاحظات عن حالة المركبة..."
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 2: Equipment Inventory */}
              {currentStep === 2 && workersCount !== 'none' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <Package className="w-5 h-5 text-[#09b9b5]" />
                    <h3 className="text-lg font-bold text-gray-900">جرد العهدة</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      'البليشر', 'الباكيوم', 'السلم الكبير', 'السلم الصغير',
                      'لي الماء', 'لي الباكيوم', 'نوسل ماء', 'نوسل شفط', 'نوسل كبير'
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-[#09b9b5] transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-[#09b9b5]/10 rounded-lg group-hover:bg-[#09b9b5]/20 transition-colors">
                            <Package className="w-5 h-5 text-[#09b9b5]" />
                          </div>
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">{item}</label>
                            <input 
                              type="number" 
                              min="0" 
                              defaultValue="0" 
                              className="w-full text-lg font-bold border-0 p-0 focus:ring-0 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Bus Main Items */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <Car className="w-5 h-5 text-[#09b9b5]" />
                    <h3 className="text-lg font-bold text-gray-900">أغراض الباص الرئيسية</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['كفر استبنه', 'عفريته', 'مفك عجل'].map((item, i) => (
                      <div key={i} className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">{item}</label>
                            <input 
                              type="number" 
                              min="0" 
                              defaultValue="0" 
                              className="w-full text-lg font-bold border-0 p-0 focus:ring-0 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3 pt-4 border-t-2 border-gray-200 sticky bottom-0 bg-white pb-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="group"
                  >
                    <X className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
                    إلغاء
                  </Button>
                  
                  {currentStep > 1 && (
                    <Button 
                      variant="secondary" 
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="group"
                    >
                      السابق
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {currentStep < 3 ? (
                    <Button 
                      variant="primary" 
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                      <span className="relative z-10">التالي</span>
                      <TrendingUp className="w-4 h-4 mr-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      type="submit"
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                      <CheckCircle className="w-4 h-4 ml-2 relative z-10 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">حفظ التفويض</span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}