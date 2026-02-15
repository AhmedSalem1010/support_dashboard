'use client';

import { useState } from 'react';
import { Plus, DollarSign, Car, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

export function Expenses() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    category: 'fuel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const expenses = [
    { id: 1, vehicle: 'ABC 1234', type: 'وقود', amount: '250', date: '2024-01-15', invoice: 'موجودة' },
    { id: 2, vehicle: 'XYZ 5678', type: 'زيت', amount: '180', date: '2024-01-14', invoice: 'موجودة' },
    { id: 3, vehicle: 'DEF 9012', type: 'وقود', amount: '320', date: '2024-01-12', invoice: 'موجودة' },
    { id: 4, vehicle: 'ABC 1234', type: 'أخرى', amount: '150', date: '2024-01-10', invoice: 'موجودة' },
  ];

  const monthData = [
    { month: 'يناير', value: 38 },
    { month: 'فبراير', value: 42 },
    { month: 'مارس', value: 35 },
    { month: 'أبريل', value: 50 },
    { month: 'مايو', value: 45 },
    { month: 'يونيو', value: 55 },
  ];
  const maxMonth = Math.max(...monthData.map((m) => m.value));

  // CleanLife Design System - Expenses
  const expensesByType = [
    { label: 'وقود', amount: '28,500', color: 'bg-[#09b9b5]', percent: 74 },
    { label: 'زيت', amount: '6,200', color: 'bg-[#f57c00]', percent: 16 },
    { label: 'أخرى', amount: '3,700', color: 'bg-[#617c96]', percent: 10 },
  ];
  const maxType = Math.max(...expensesByType.map((e) => e.percent));

  const columns = [
    {
      key: 'vehicle',
      label: 'المركبة',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-[#617c96]" />
          <span className="font-medium">{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'نوع المصروف',
      render: (value: unknown) => {
        const v = String(value);
        const style = v === 'وقود' ? 'bg-[#effefa] text-[#09b9b5]' : v === 'زيت' ? 'bg-[#fff3e0] text-[#f57c00]' : 'bg-gray-100 text-gray-800';
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${style}`}>{v}</span>;
      },
    },
    {
      key: 'amount',
      label: 'المبلغ',
      render: (value: unknown) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-[#617c96]" />
          <span className="font-medium">{String(value)} ريال</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'التاريخ',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#617c96]" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'invoice',
      label: 'الفاتورة',
      render: (value: unknown) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#effefa] text-[#00a287]">{String(value)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">المصاريف التشغيلية</h1>
          <p className="text-sm sm:text-base text-gray-600">إدارة مصاريف الوقود والزيت والمصاريف الأخرى</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="text-sm self-start sm:self-auto">
          <Plus className="w-4 h-4 ml-1 sm:ml-2" />
          <span className="hidden sm:inline">إضافة مصروف</span>
          <span className="sm:hidden">إضافة</span>
        </Button>
      </div>

      {/* KPI Cards - Card component with border-r-4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#09b9b5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">إجمالي المصاريف</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">38,400 ريال</p>
              <p className="text-xs text-[#617c96] mt-0.5 hidden sm:block">هذا الشهر</p>
            </div>
            <DollarSign className="w-5 h-5 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#00a287]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">الوقود</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">28,500 ريال</p>
              <p className="text-xs text-[#00a287] mt-0.5 hidden sm:block">74% من الإجمالي</p>
            </div>
            <DollarSign className="w-5 h-5 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#f57c00]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">الزيت</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">6,200 ريال</p>
              <p className="text-xs text-[#f57c00] mt-0.5 hidden sm:block">16% من الإجمالي</p>
            </div>
            <DollarSign className="w-5 h-5 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#617c96]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">أخرى</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">3,700 ريال</p>
              <p className="text-xs text-[#617c96] mt-0.5 hidden sm:block">10% من الإجمالي</p>
            </div>
            <DollarSign className="w-5 h-5 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* المصاريف الشهرية + المصاريف حسب النوع */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="المصاريف الشهرية">
          <div className="h-56 flex flex-col justify-end">
            <div className="flex-1 min-h-[120px] flex items-end justify-around gap-2 pb-8 pt-2">
              {monthData.map((item) => (
                <div key={item.month} className="flex-1 max-w-[48px] bg-[#09b9b5] rounded-t" style={{ height: `${(item.value / maxMonth) * 100}%` }} />
              ))}
            </div>
            <div className="flex justify-around gap-1 text-xs text-gray-500 border-t pt-2 mt-1">
              {monthData.map((m) => (
                <span key={m.month} className="flex-1 text-center">{m.month}</span>
              ))}
            </div>
          </div>
        </Card>
        <Card title="المصاريف حسب النوع">
          <div className="space-y-5">
            {expensesByType.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.amount} ريال</span>
                </div>
                <div className="w-full h-6 bg-gray-100 rounded overflow-hidden flex">
                  <div className={`${item.color} h-full rounded`} style={{ width: `${(item.percent / maxType) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* جدول المصاريف */}
      <Card>
        <Table columns={columns} data={expenses} onRowClick={(row) => console.log('Selected:', row)} />
      </Card>

      {/* مودال إضافة مصروف */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">إضافة مصروف</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المركبة</label>
                <select value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" required>
                  <option value="">اختر المركبة</option>
                  <option value="1">ABC 1234</option>
                  <option value="2">XYZ 5678</option>
                  <option value="3">DEF 9012</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المصروف</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                  <option value="fuel">وقود</option>
                  <option value="oil">زيت</option>
                  <option value="maintenance">صيانة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ريال)</label>
                <input type="number" min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" placeholder="وصف المصروف (اختياري)" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
                <Button type="submit" variant="primary">حفظ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
