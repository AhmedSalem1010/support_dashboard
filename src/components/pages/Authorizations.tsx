'use client';

import { useState } from 'react';
import { Plus, FileText, User, Car, Calendar, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

function addDaysToDate(dateStr: string, days: number): string {
  if (!dateStr || days <= 0) return '';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function Authorizations() {
  const [showModal, setShowModal] = useState(false);
  const [workersCount, setWorkersCount] = useState<string>('one'); // one, two, none
  const [authorizationDays, setAuthorizationDays] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');

  const endDate = startDate && authorizationDays > 0 ? addDaysToDate(startDate, authorizationDays) : '';

  const authorizations = [
    {
      id: 1,
      authNumber: 'AUTH-2024-001',
      vehicle: 'ABC 1234',
      driver: 'محمد أحمد',
      supervisor: 'خالد محمد',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      type: 'تم + محلي',
      status: 'ساري',
      tammAuthorized: 'محمد أحمد',
    },
    {
      id: 2,
      authNumber: 'AUTH-2024-002',
      vehicle: 'XYZ 5678',
      driver: 'عبدالله سعيد',
      supervisor: 'أحمد علي',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      type: 'محلي فقط',
      status: 'ساري',
      tammAuthorized: '-',
    },
    {
      id: 3,
      authNumber: 'AUTH-2024-003',
      vehicle: 'DEF 9012',
      driver: 'سعيد محمود',
      supervisor: 'خالد محمد',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      type: 'تم + محلي',
      status: 'منتهي',
      tammAuthorized: 'سعيد محمود',
    },
  ];

  const columns = [
    {
      key: 'authNumber',
      label: 'رقم التفويض',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold">{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'المركبة',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-gray-500" />
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
      key: 'supervisor',
      label: 'المشرف',
    },
    {
      key: 'startDate',
      label: 'تاريخ البداية',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'endDate',
      label: 'تاريخ الانتهاء',
    },
    {
      key: 'type',
      label: 'النوع',
      render: (value: unknown) => (
        <Badge variant={String(value) === 'تم + محلي' ? 'info' : 'default'}>{String(value)}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => (
        <Badge variant={String(value) === 'ساري' ? 'success' : 'default'}>{String(value)}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة التفويض</h1>
          <p className="text-gray-600">تفويض المركبات وجرد العهدة</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 ml-2" />
          تفويض جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">التفويضات السارية</p>
              <p className="text-3xl font-bold text-gray-900">28</p>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">تنتهي خلال 30 يوم</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
            </div>
            <Calendar className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">منتهية</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <FileText className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      <Card>
        <Table columns={columns} data={authorizations} onRowClick={(row) => console.log('Selected:', row)} />
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">تفويض جديد</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم التفويض<span className="text-red-500 mr-1">*</span>
                  </label>
                  <Input placeholder="AUTH-2024-XXX" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع التفويض<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">اختر النوع</option>
                    <option value="local">محلي فقط</option>
                    <option value="tamm_local">تم + محلي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المركبة<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">اختر المركبة</option>
                    <option value="1">ABC 1234 - تويوتا كامري</option>
                    <option value="2">XYZ 5678 - هوندا أكورد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    السائق المستلم<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">اختر السائق</option>
                    <option value="1">محمد أحمد</option>
                    <option value="2">خالد سعيد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المشرف المسلم<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">اختر المشرف</option>
                    <option value="1">أحمد علي</option>
                    <option value="2">خالد محمد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الشخص المفوض السابق
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">اختر الشخص</option>
                    <option value="1">محمد أحمد</option>
                    <option value="2">خالد سعيد</option>
                    <option value="3">عبدالله محمود</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الشخص المفوض في تم
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <p className="text-xs text-gray-500 mt-1">
                      تاريخ البداية + {authorizationDays} يوم = {endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* جرد العهدة - يظهر فقط إذا كان هناك عمال */}
              {workersCount !== 'none' && (
                <Card title="جرد العهدة" className="bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">البليشر</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">الباكيوم</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">السلم الكبير</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">السلم الصغير</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">لي الماء</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">لي الباكيوم</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">نوسل ماء</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">نوسل شفط</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">نوسل كبير</label>
                        <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* أغراض الباص الرئيسية */}
              <Card title="أغراض الباص الرئيسية" className="bg-blue-50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">كفر استبنه</label>
                      <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">عفريته</label>
                      <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">مفك عجل</label>
                      <input type="number" min="0" defaultValue="0" className="w-full text-sm font-semibold mt-1 border-0 p-0 focus:ring-0" />
                    </div>
                  </div>
                </div>
              </Card>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  حالة المركبة عند التسليم
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="اكتب ملاحظات عن حالة المركبة..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                إلغاء
              </Button>
              <Button variant="primary">
                حفظ التفويض
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
