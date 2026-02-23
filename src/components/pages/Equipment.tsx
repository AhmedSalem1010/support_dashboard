'use client';

import { useState, useEffect } from 'react';
import { Package, Filter, Download, X, Eye, CheckCircle, XCircle, AlertCircle, AlertTriangle, Car, User, Calendar, Shield, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, FileText, ClipboardCheck, Search } from 'lucide-react';
import InspectionModal from '@/components/pages/Inspection';
import EquipmentInventoryModal from '@/components/pages/EquipmentInventoryModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { fetchEquipmentInventories } from '@/lib/api/equipment';
import type { VehicleEquipmentInventory, ItemStatus, EquipmentInventoryStatus, EquipmentInventoryType } from '@/types/equipment';
import { useNotificationsContext } from '@/components/ui/Notifications';
import { Portal } from '@/components/ui/Portal';

export function Equipment() {
  const [inventories, setInventories] = useState<VehicleEquipmentInventory[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<VehicleEquipmentInventory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ vehiclePlateName: '', equipmentInventoryStatus: '', equipmentInventoryType: '' });
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const { error: showError, success: showSuccess, info } = useNotificationsContext();

  const updateFilter = (key: keyof typeof filters, value: string) => { setFilters(prev => ({ ...prev, [key]: value })); setPage(1); };
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => { setFilters({ vehiclePlateName: '', equipmentInventoryStatus: '', equipmentInventoryType: '' }); setPage(1); };

  useEffect(() => { loadInventories(); }, [page, filters]);

  const loadInventories = async () => {
    setIsLoading(true); setError(null);
    try {
      const response = await fetchEquipmentInventories({ page, limit: 10, equipmentInventoryStatus: (filters.equipmentInventoryStatus as EquipmentInventoryStatus) || undefined, equipmentInventoryType: (filters.equipmentInventoryType as EquipmentInventoryType) || undefined, vehiclePlateName: filters.vehiclePlateName || undefined });
      setInventories(response.data); setMeta(response.meta);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل البيانات';
      setError(msg); showError('فشل تحميل البيانات', msg);
    } finally { setIsLoading(false); }
  };

  const stats = { total: meta?.total ?? inventories.length, checked: inventories.filter(i => i.equipmentInventoryStatus === 'check').length, pending: inventories.filter(i => i.equipmentInventoryStatus === 'pending').length, completed: inventories.filter(i => i.equipmentInventoryStatus === 'completed').length };

  const getStatusBadge = (status: EquipmentInventoryStatus) => {
    const map: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = { check: { label: 'تم الفحص', variant: 'success' }, pending: { label: 'قيد الانتظار', variant: 'warning' }, completed: { label: 'مكتمل', variant: 'info' } };
    return map[status] ?? { label: status, variant: 'default' as const };
  };
  const getTypeBadge = (type: EquipmentInventoryType) => {
    const map: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = { authorization: { label: 'تفويض', variant: 'info' }, return: { label: 'إرجاع', variant: 'success' }, inspection: { label: 'فحص', variant: 'warning' } };
    return map[type] ?? { label: type, variant: 'default' as const };
  };
  const getItemStatusLabel = (status: ItemStatus) => ({ MATCHED: 'مطابق', EXTRA: 'زائد', MISSING: 'ناقص' }[status] ?? status);
  const getItemStatusColor = (status: ItemStatus) => ({ MATCHED: 'bg-green-50 text-green-700 border-green-200', EXTRA: 'bg-orange-50 text-orange-700 border-orange-200', MISSING: 'bg-red-50 text-red-700 border-red-200' }[status] ?? 'bg-gray-50 text-gray-700 border-gray-200');
  const calculateItemsStats = (items: any[] | null) => { const s = items ?? []; return { matched: s.filter((i: any) => i.itemStatus === 'MATCHED').length, extra: s.filter((i: any) => i.itemStatus === 'EXTRA').length, missing: s.filter((i: any) => i.itemStatus === 'MISSING').length, total: s.length }; };

  const columns = [
    { key: 'id', label: 'رقم الجرد', render: (_: unknown, row: any) => (<div className="flex items-center gap-3"><div className="relative"><div className="w-12 h-12 bg-gradient-to-br from-[#09b9b5]/10 to-[#09b9b5]/20 rounded-xl flex items-center justify-center border border-[#09b9b5]/20"><Package className="w-5 h-5 text-[#09b9b5]" /></div><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"><CheckCircle className="w-3 h-3 text-green-500" /></div></div><div><p className="font-bold text-gray-900">{row.id.slice(0, 8)}</p><p className="text-xs text-gray-500">{getTypeBadge(row.equipmentInventoryType).label}</p></div></div>) },
    { key: 'vehicleAuthorization', label: 'المركبة', render: (_: unknown, row: any) => (<div className="flex items-center gap-2"><div className="p-2 bg-blue-50 rounded-lg"><Car className="w-4 h-4 text-blue-600" /></div><span className="font-semibold">{row.vehicleAuthorization.vehicle.plateName}</span></div>) },
    { key: 'supervisor', label: 'المشرف والسائق', render: (_: unknown, row: any) => (<div className="space-y-1"><div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium">{row.supervisor.name}</span></div><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500">{row.vehicleAuthorization.userDriver.name}</span></div></div>) },
    { key: 'items', label: 'الأصناف', render: (_: unknown, row: any) => { const s = calculateItemsStats(row.items); return (<div className="flex gap-2"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold"><CheckCircle className="w-3 h-3" />{s.matched}</span><span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold"><AlertTriangle className="w-3 h-3" />{s.extra}</span><span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold"><XCircle className="w-3 h-3" />{s.missing}</span></div>); } },
    { key: 'equipmentInventoryType', label: 'النوع', render: (value: unknown) => (<Badge variant={getTypeBadge(value as EquipmentInventoryType).variant}>{getTypeBadge(value as EquipmentInventoryType).label}</Badge>) },
    { key: 'equipmentInventoryStatus', label: 'الحالة', render: (value: unknown) => { const s = getStatusBadge(value as EquipmentInventoryStatus); const Icon = value === 'check' ? CheckCircle : value === 'pending' ? AlertCircle : CheckCircle; return (<Badge variant={s.variant} className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{s.label}</Badge>); } },
    { key: 'actions', label: 'الإجراءات', render: (_: unknown, row: any) => (<div className="flex items-center gap-1"><button onClick={(e) => { e.stopPropagation(); setSelectedInventory(row as VehicleEquipmentInventory); }} className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="عرض التفاصيل"><Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" /></button></div>) },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#09b9b5] to-[#0da9a5] rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">المعدات والسكن</h1>
              <p className="text-sm text-[#617c96]">جرد عهدة المركبات - {meta?.total ?? 0} سجل</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-[#09b9b5] font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>جدول</button>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#09b9b5] font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>بطاقات</button>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="text-sm relative">
            <Filter className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden xs:inline">تصفية</span>
            {hasActiveFilters && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#09b9b5] rounded-full"></span>}
          </Button>
          <Button variant="secondary" className="text-sm group">
            <Download className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden xs:inline">تصدير</span>
          </Button>

          <Button variant="outline" onClick={() => setShowInspectionModal(true)} className="text-sm bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100">
            <Search className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden sm:inline">فحص المعدات</span>
          </Button>

          <Button variant="outline" onClick={() => setShowInventoryModal(true)} className="text-sm bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100">
            <ClipboardCheck className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden sm:inline">جرد المعدات</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#09b9b5] hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => info('إجمالي السجلات', `يوجد حالياً ${stats.total} سجل جرد في النظام`)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5"><span className="w-2 h-2 bg-[#09b9b5] rounded-full animate-pulse"></span>إجمالي السجلات</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">جميع الحالات</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#09b9b5]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#09b9b5] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>
        <Card className="border-r-4 border-[#00a287] hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => showSuccess('تم الفحص', `${stats.checked} سجل تم فحصه`)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5"><span className="w-2 h-2 bg-[#00a287] rounded-full animate-pulse"></span>تم الفحص</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">{stats.checked}</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">{stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0}% مكتملة</p>
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
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5"><span className="w-2 h-2 bg-[#f57c00] rounded-full animate-pulse"></span>قيد الانتظار</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">{stats.pending}</p>
              <p className="text-xs text-orange-600 mt-1 font-semibold">تحتاج مراجعة</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f57c00]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#f57c00] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            </div>
          </div>
        </Card>
        <Card className="border-r-4 border-[#1976d2] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5"><span className="w-2 h-2 bg-[#1976d2] rounded-full animate-pulse"></span>مكتمل</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">{stats.completed}</p>
              <p className="text-xs text-blue-600 mt-1 font-semibold">منجز</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#1976d2]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#1976d2] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-t-4 border-[#09b9b5]">
        <div className="space-y-4">
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">لوحة المركبة</label>
                <input type="text" value={filters.vehiclePlateName} onChange={(e) => updateFilter('vehiclePlateName', e.target.value)} placeholder="مثال: ر أ ص 8299" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">حالة الجرد</label>
                <select value={filters.equipmentInventoryStatus} onChange={(e) => updateFilter('equipmentInventoryStatus', e.target.value)} className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white">
                  <option value="">الكل</option>
                  <option value="check">تم الفحص</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="completed">مكتمل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع الجرد</label>
                <select value={filters.equipmentInventoryType} onChange={(e) => updateFilter('equipmentInventoryType', e.target.value)} className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white">
                  <option value="">الكل</option>
                  <option value="authorization">تفويض</option>
                  <option value="return">إرجاع</option>
                  <option value="inspection">فحص</option>
                </select>
              </div>
              {hasActiveFilters && (
                <div className="sm:col-span-3 flex justify-end">
                  <Button variant="outline" onClick={clearFilters} className="text-sm"><X className="w-4 h-4 ml-2" />مسح الفلاتر</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Results Summary */}
      {hasActiveFilters && meta && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Package className="w-4 h-4 text-blue-600" />
          <span>تم العثور على <strong className="text-blue-600">{meta.total}</strong> نتيجة</span>
        </div>
      )}

      {/* Loading / Error */}
      {isLoading && (<Card className="flex items-center justify-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#09b9b5]" /></Card>)}
      {error && (<Card className="border-red-200 bg-red-50 text-red-700 py-4 px-4">{error}</Card>)}

      {/* Table / Grid */}
      {!isLoading && !error && (viewMode === 'table' ? (
        <Card>
          <Table columns={columns} data={inventories} onRowClick={(row) => setSelectedInventory(row)} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventories.map((inventory, index) => {
            const s = calculateItemsStats(inventory.items);
            return (
              <Card key={inventory.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-[#09b9b5] overflow-hidden" style={{ animationDelay: `${index * 50}ms` }} onClick={() => setSelectedInventory(inventory)}>
                <div className="relative bg-gradient-to-br from-[#09b9b5]/10 via-[#09b9b5]/5 to-transparent p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-md"><Package className="w-6 h-6 text-[#09b9b5]" /></div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{inventory.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">{inventory.vehicleAuthorization.vehicle.plateName}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadge(inventory.equipmentInventoryStatus).variant}>{getStatusBadge(inventory.equipmentInventoryStatus).label}</Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded-lg"><Car className="w-4 h-4 text-blue-600" /></div>
                      <div><p className="text-xs text-gray-500">المركبة</p><p className="font-semibold text-gray-900">{inventory.vehicleAuthorization.vehicle.plateName}</p></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-purple-50 rounded-lg"><Shield className="w-4 h-4 text-purple-600" /></div>
                      <div><p className="text-xs text-gray-500">المشرف</p><p className="font-semibold text-gray-900">{inventory.supervisor.name}</p></div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">إجمالي الأصناف</span><span className="font-semibold">{s.total}</span></div>
                    <div className="flex gap-2">
                      <span className="flex-1 text-center py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">مطابق: {s.matched}</span>
                      <span className="flex-1 text-center py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold">زائد: {s.extra}</span>
                      <span className="flex-1 text-center py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">ناقص: {s.missing}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={getTypeBadge(inventory.equipmentInventoryType).variant}>{getTypeBadge(inventory.equipmentInventoryType).label}</Badge>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600"><Calendar className="w-4 h-4" /><span>{new Date(inventory.createdAt).toLocaleDateString('ar-SA')}</span></div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => setSelectedInventory(inventory)} className="flex-1 py-2 px-3 bg-[#09b9b5] hover:bg-[#0da9a5] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                      <Eye className="w-4 h-4" />عرض التفاصيل
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
              <button type="button" onClick={() => setPage(1)} disabled={!meta.hasPreviousPage} className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200" title="الأولى"><ChevronsRight className="w-5 h-5" /></button>
              <button type="button" onClick={() => setPage(page - 1)} disabled={!meta.hasPreviousPage} className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200" title="السابق"><ChevronRight className="w-5 h-5" /></button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => { if (meta.totalPages <= 7) return true; if (p === 1 || p === meta.totalPages) return true; if (Math.abs(p - meta.page) <= 2) return true; return false; })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1]; const showEllipsis = prev != null && p - prev > 1;
                    return (
                      <span key={p} className="flex items-center gap-0.5">
                        {showEllipsis && <span className="px-2 text-gray-400 text-sm">...</span>}
                        <button type="button" onClick={() => setPage(p)} className={`min-w-[2.25rem] h-9 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${meta.page === p ? 'bg-[#09b9b5] text-white shadow-md shadow-[#09b9b5]/25' : 'text-gray-600 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5]'}`}>{p}</button>
                      </span>
                    );
                  })}
              </div>
              <button type="button" onClick={() => setPage(page + 1)} disabled={!meta.hasNextPage} className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200" title="التالي"><ChevronLeft className="w-5 h-5" /></button>
              <button type="button" onClick={() => setPage(meta.totalPages)} disabled={!meta.hasNextPage} className="p-2 rounded-xl text-gray-500 hover:bg-[#09b9b5]/10 hover:text-[#09b9b5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200" title="الأخيرة"><ChevronsLeft className="w-5 h-5" /></button>
            </nav>
          </div>
        </Card>
      )}

      {/* Details Modal */}
      {selectedInventory && (
        <Portal>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn" onClick={() => setSelectedInventory(null)}>
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#09b9b5] to-[#0da9a5] p-6 text-white">
              <button onClick={() => setSelectedInventory(null)} className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">جرد العهدة</h2>
                  <p className="text-white/90">{selectedInventory.vehicleAuthorization.vehicle.plateName}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getStatusBadge(selectedInventory.equipmentInventoryStatus).variant} className="bg-white/20 border-white/30">
                      {getStatusBadge(selectedInventory.equipmentInventoryStatus).label}
                    </Badge>
                    <Badge variant={getTypeBadge(selectedInventory.equipmentInventoryType).variant} className="bg-white/20 border-white/30">
                      {getTypeBadge(selectedInventory.equipmentInventoryType).label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                  <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">المركبة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedInventory.vehicleAuthorization.vehicle.plateName}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">السائق</p>
                  <p className="text-sm font-bold text-gray-900">{selectedInventory.vehicleAuthorization.userDriver.name}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">المشرف</p>
                  <p className="text-sm font-bold text-gray-900">{selectedInventory.supervisor.name}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100">
                  <FileText className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">عدد الأصناف</p>
                  <p className="text-lg font-bold text-gray-900">{selectedInventory.items?.length ?? 0}</p>
                </div>
              </div>

              {/* Items Stats Summary */}
              {(() => { const s = calculateItemsStats(selectedInventory.items); return (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#09b9b5]" />
                    ملخص الجرد
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-green-700">{s.matched}</p>
                      <p className="text-xs text-gray-600 mt-1">مطابق</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-orange-700">{s.extra}</p>
                      <p className="text-xs text-gray-600 mt-1">زائد</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-red-700">{s.missing}</p>
                      <p className="text-xs text-gray-600 mt-1">ناقص</p>
                    </div>
                  </div>
                </div>
              ); })()}

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#09b9b5]" />
                  قائمة المعدات
                </h3>
                <div className="space-y-2">
                  {(selectedInventory.items ?? []).map((item: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${getItemStatusColor(item.itemStatus)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.itemStatus === 'MATCHED' ? <CheckCircle className="w-5 h-5 text-green-600" /> : item.itemStatus === 'EXTRA' ? <AlertTriangle className="w-5 h-5 text-orange-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                          <div>
                            <p className="font-semibold text-gray-900">{item.itemName}</p>
                            <p className="text-sm text-gray-600">العدد: {item.itemCount}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <Badge variant={item.itemStatus === 'MATCHED' ? 'success' : item.itemStatus === 'EXTRA' ? 'warning' : 'danger'}>
                            {getItemStatusLabel(item.itemStatus)}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">{item.itemInventoryStatus === 'AVAILABLE' ? 'متوفر' : 'غير متوفر'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedInventory.equipmentInventoryNote && (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#09b9b5]" />
                    ملاحظات
                  </h3>
                  <p className="text-gray-700">{selectedInventory.equipmentInventoryNote}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1 group" onClick={() => setSelectedInventory(null)}>
                  <X className="w-4 h-4 ml-2" />
                  إغلاق
                </Button>
              </div>

            </div>
          </div>
        </div>
      </Portal>
      )}

      {/* Modals */}
      <InspectionModal isOpen={showInspectionModal} onClose={() => setShowInspectionModal(false)} />
      <EquipmentInventoryModal isOpen={showInventoryModal} onClose={() => setShowInventoryModal(false)} />

    </div>
  );
}
