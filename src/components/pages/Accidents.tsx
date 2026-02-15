'use client';

import { useState } from 'react';
import { Plus, AlertTriangle, Car, Calendar, User, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

export function Accidents() {
  const [showModal, setShowModal] = useState(false);
  const [accidentImages, setAccidentImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    accidentNumber: '',
    vehicleId: '',
    driverId: '',
    date: '',
    location: '',
    severity: '',
    details: '',
  });

  const accidents = [
    { id: 1, accidentNumber: 'ACC-2024-001', vehicle: 'ABC 1234', driver: 'محمد أحمد', date: '2024-01-08', severity: 'بسيط', status: 'مغلق' },
    { id: 2, accidentNumber: 'ACC-2024-002', vehicle: 'XYZ 5678', driver: 'عبدالله سعيد', date: '2024-01-12', severity: 'متوسط', status: 'قيد المتابعة' },
    { id: 3, accidentNumber: 'ACC-2024-003', vehicle: 'DEF 9012', driver: 'سعيد محمود', date: '2024-01-20', severity: 'بسيط', status: 'مغلق' },
  ];

  const monthData = [
    { month: 'يناير', count: 3 },
    { month: 'فبراير', count: 1 },
    { month: 'مارس', count: 2 },
    { month: 'أبريل', count: 1 },
    { month: 'مايو', count: 1 },
    { month: 'يونيو', count: 5 },
  ];
  const maxCount = Math.max(...monthData.map((m) => m.count));

  const severityDistribution = [
    { label: 'بسيطة', count: 7, percent: 58, color: 'bg-green-500' },
    { label: 'متوسطة', count: 4, percent: 33, color: 'bg-amber-500' },
    { label: 'خطيرة', count: 1, percent: 9, color: 'bg-red-500' },
  ];

  const columns = [
    {
      key: 'accidentNumber',
      label: 'رقم الحادث',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="font-medium">{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'المركبة',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'driver',
      label: 'السائق',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
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
    {
      key: 'severity',
      label: 'الخطورة',
      render: (value: unknown) => {
        const v = String(value);
        const style = v === 'بسيط' ? 'bg-green-100 text-green-800' : v === 'متوسط' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${style}`}>{v}</span>;
      },
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => {
        const v = String(value);
        const style = v === 'مغلق' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800';
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${style}`}>{v}</span>;
      },
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAccidentImages((prev) => [...prev, ...files]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الحوادث</h1>
          <p className="text-gray-600">تسجيل ومتابعة حوادث المركبات</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 ml-2" />
          تسجيل حادث
        </Button>
      </div>

      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-r-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الحوادث</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500 mt-0.5">هذا العام</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">هذا الشهر</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500 mt-0.5">-15% عن الشهر الماضي</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">قيد المتابعة</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">مغلقة</p>
              <p className="text-2xl font-bold text-gray-900">11</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* الحوادث على مدار العام + توزيع حسب الخطورة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="الحوادث على مدار العام">
          <div className="h-56 flex flex-col justify-end">
            <div className="flex-1 min-h-[100px] flex items-end justify-around gap-2 pb-10 pt-2">
              {monthData.map((item) => (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <span className="text-xs font-medium text-gray-700 mb-1">{item.count}</span>
                  <div className="w-full max-w-[36px] bg-red-500 rounded-t" style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: item.count ? '8px' : '0' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-around gap-1 text-xs text-gray-500 border-t pt-2 mt-1">
              {monthData.map((m) => (
                <span key={m.month} className="flex-1 text-center">{m.month}</span>
              ))}
            </div>
          </div>
        </Card>
        <Card title="توزيع الحوادث حسب الخطورة">
          <div className="space-y-4">
            {severityDistribution.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm font-medium text-gray-700 w-20">{item.label}</span>
                <span className="font-bold text-gray-900">{item.count} حادث</span>
                <span className="text-sm text-gray-500">({item.percent}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* جدول الحوادث الأخيرة */}
      <Card>
        <Table columns={columns} data={accidents} onRowClick={(row) => console.log('Selected:', row)} />
      </Card>

      {/* مودال تسجيل حادث جديد */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 text-center">تسجيل حادث جديد</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الحادث <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.accidentNumber} onChange={(e) => setFormData({ ...formData, accidentNumber: e.target.value })} placeholder="ACC-2024-XXX" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المركبة <span className="text-red-500">*</span></label>
                  <select value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">اختر المركبة</option>
                    <option value="1">ABC 1234</option>
                    <option value="2">XYZ 5678</option>
                    <option value="3">DEF 9012</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السائق <span className="text-red-500">*</span></label>
                  <select value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">اختر السائق</option>
                    <option value="1">محمد أحمد</option>
                    <option value="2">عبدالله سعيد</option>
                    <option value="3">سعيد محمود</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الحادث <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموقع <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="طريق الملك فهد - الرياض" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مستوى الخطورة <span className="text-red-500">*</span></label>
                  <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">اختر المستوى</option>
                    <option value="simple">بسيط</option>
                    <option value="medium">متوسط</option>
                    <option value="dangerous">خطير</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل الحادث <span className="text-red-500">*</span></label>
                <textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} rows={4} required placeholder="اكتب تفاصيل الحادث بشكل دقيق...." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">صور الحادث</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <span className="text-4xl text-gray-400 mb-1">📷</span>
                    <p className="text-sm text-gray-600">اضغط لرفع الصور أو اسحبها هنا</p>
                    <p className="text-xs text-gray-500 mt-0.5">PNG, JPG حتى 10MB</p>
                    {accidentImages.length > 0 && <p className="mt-2 text-sm text-green-600 font-medium">{accidentImages.length} صورة محددة</p>}
                  </div>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>إلغاء</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 focus:ring-red-500">تسجيل الحادث</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
