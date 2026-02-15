'use client';

import { useState } from 'react';
import { Plus, Wrench, Car, Calendar, DollarSign, Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export function Maintenance() {
  const [showModal, setShowModal] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    date: '',
    costOn: '',
    amount: '0.00',
    driverId: '',
    supervisorId: '',
    description: '',
  });

  const maintenanceRecords = [
    { id: 1, vehicle: 'ABC 1234', type: 'تغيير زيت', date: '2024-01-10', driver: 'محمد أحمد', costOn: 'الشركة', amount: '350', status: 'مكتمل' },
    { id: 2, vehicle: 'XYZ 5678', type: 'إصلاح', date: '2024-01-12', driver: 'عبد الله سعيد', costOn: 'السائق', amount: '1200', status: 'مكتمل' },
    { id: 3, vehicle: 'DEF 9012', type: 'صيانة دورية', date: '2024-01-15', driver: 'سعيد محمود', costOn: 'الشركة', amount: '800', status: 'قيد التنفيذ' },
  ];

  const commonTypes = [
    { label: 'تغيير زيت', count: 45, color: 'bg-blue-500' },
    { label: 'صيانة دورية', count: 32, color: 'bg-green-500' },
    { label: 'إصلاحات', count: 28, color: 'bg-amber-500' },
    { label: 'أخرى', count: 51, color: 'bg-gray-400' },
  ];
  const maxCount = Math.max(...commonTypes.map((t) => t.count));

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];

  const columns = [
    { key: 'vehicle', label: 'المركبة', render: (value: unknown) => <span className="font-medium">{String(value)}</span> },
    {
      key: 'type',
      label: 'نوع الصيانة',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-gray-500" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'التاريخ',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    { key: 'driver', label: 'السائق' },
    {
      key: 'costOn',
      label: 'التكلفة على',
      render: (value: unknown) => {
        const v = String(value);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${v === 'الشركة' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
            {v}
          </span>
        );
      },
    },
    {
      key: 'amount',
      label: 'المبلغ',
      render: (value: unknown) => (
        <span className="font-medium">$ {String(value)} ريال</span>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => {
        const v = String(value);
        const isComplete = v === 'مكتمل';
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${isComplete ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {v}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الصيانة</h1>
          <p className="text-gray-600">إدارة سجلات صيانة المركبات</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة سجل صيانة
        </Button>
      </div>

      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-r-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">تكلفة السائق</p>
              <p className="text-2xl font-bold text-gray-900">8,400 ريال</p>
              <p className="text-xs text-gray-500 mt-0.5">هذا الشهر</p>
            </div>
            <DollarSign className="w-10 h-10 text-red-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">تكلفة الشركة</p>
              <p className="text-2xl font-bold text-gray-900">45,200 ريال</p>
              <p className="text-xs text-gray-500 mt-0.5">هذا الشهر</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-500 mt-0.5">صيانة جارية</p>
            </div>
            <Wrench className="w-10 h-10 text-amber-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الصيانات</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500 mt-0.5">هذا العام</p>
            </div>
            <Wrench className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* التكاليف الشهرية + أنواع الصيانة الشائعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="التكاليف الشهرية">
          <div className="h-56 flex flex-col justify-end">
            <div className="flex-1 min-h-[120px] bg-gray-50 rounded flex items-end justify-around gap-1 pb-8 pt-2">
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <div key={i} className="flex-1 max-w-[48px] bg-blue-200 rounded-t" style={{ height: `${h}%` }} title={`${h}%`} />
              ))}
            </div>
            <div className="flex justify-around gap-1 text-xs text-gray-500 border-t pt-2 mt-1">
              {months.map((m) => (
                <span key={m} className="flex-1 text-center">{m}</span>
              ))}
            </div>
          </div>
        </Card>
        <Card title="أنواع الصيانة الشائعة">
          <div className="space-y-4">
            {commonTypes.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-28">{item.label}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden flex">
                  <div className={`${item.color} h-full rounded`} style={{ width: `${(item.count / maxCount) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* جدول سجلات الصيانة */}
      <Card>
        <Table columns={columns} data={maintenanceRecords} onRowClick={(row) => console.log('Selected:', row)} />
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 text-center">إضافة صيانة جديدة</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="p-6 space-y-5">
              {/* الصف الأول: المركبة | نوع الصيانة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المركبة <span className="text-red-500">*</span>
                  </label>
                  <select value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">اختر المركبة</option>
                    <option value="1">ABC 1234 - تويوتا كامري</option>
                    <option value="2">XYZ 5678 - هوندا أكورد</option>
                    <option value="3">DEF 9012 - نيسان التيما</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الصيانة <span className="text-red-500">*</span>
                  </label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">اختر النوع</option>
                    <option value="periodic">صيانة دورية</option>
                    <option value="repair">إصلاح</option>
                    <option value="oil">تغيير زيت</option>
                    <option value="tires">إطارات</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              {/* الصف الثاني: تاريخ الصيانة | التكلفة على */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ الصيانة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التكلفة على <span className="text-red-500">*</span>
                  </label>
                  <select value={formData.costOn} onChange={(e) => setFormData({ ...formData, costOn: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">اختر</option>
                    <option value="company">الشركة</option>
                    <option value="vehicle">المركبة</option>
                    <option value="driver">السائق</option>
                  </select>
                </div>
              </div>

              {/* الصف الثالث: المبلغ | السائق المفوض */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المبلغ (ريال) <span className="text-red-500">*</span>
                  </label>
                  <input type="number" min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السائق المفوض</label>
                  <select value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">اختر السائق</option>
                    <option value="1">محمد أحمد</option>
                    <option value="2">خالد سعيد</option>
                    <option value="3">عبدالله محمود</option>
                  </select>
                </div>
              </div>

              {/* المشرف المستلم - عرض كامل */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المشرف المستلم</label>
                <select value={formData.supervisorId} onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">اختر المشرف</option>
                  <option value="1">أحمد علي</option>
                  <option value="2">خالد محمد</option>
                  <option value="3">سعيد محمود</option>
                </select>
              </div>

              {/* وصف الصيانة / القطع */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف الصيانة / القطع <span className="text-red-500">*</span>
                </label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="اكتب تفاصيل الصيانة أو القطع المستبدلة..." />
              </div>

              {/* صورة الفاتورة - رفع ملف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة الفاتورة</label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)} />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-2 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-600">اضغط لرفع الفاتورة أو اسحبها هنا</p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF حتى 10MB</p>
                    {invoiceFile && <p className="mt-2 text-sm text-green-600 font-medium">{invoiceFile.name}</p>}
                  </div>
                </label>
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
