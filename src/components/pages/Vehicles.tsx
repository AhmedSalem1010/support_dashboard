'use client';

import { useState } from 'react';
import { Plus, Filter, Download, Car, Calendar, Shield, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export function Vehicles() {
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    plateName: '',
    serialNumber: '',
    vin: '',
    manufacturer: '',
    paletText1: '',
    paletText2: '',
    paletText3: '',
    model: '',
    year: new Date().getFullYear(),
    type: '',
    insuranceStatus: 'active',
    insuranceExpiry: '',
    registrationExpiry: '',
    inspectionExpiry: '',
    status: 'available',
    color: '',
    fuelType: '',
    odometerReading: 0,
    notes: '',
  });

  const vehicles = [
    {
      id: 1,
      plateNumber: 'ABC 1234',
      vin: '1HGBH41JXMN109186',
      manufacturer: 'تويوتا',
      model: 'كامري',
      year: 2022,
      type: 'سيدان',
      insuranceStatus: 'ساري',
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-11-15',
      inspectionExpiry: '2024-10-20',
      status: 'متاح',
    },
    {
      id: 2,
      plateNumber: 'XYZ 5678',
      vin: '2HGBH41JXMN109187',
      manufacturer: 'هوندا',
      model: 'أكورد',
      year: 2023,
      type: 'سيدان',
      insuranceStatus: 'قارب على الانتهاء',
      insuranceExpiry: '2024-02-10',
      registrationExpiry: '2024-08-15',
      inspectionExpiry: '2024-07-20',
      status: 'مفوض',
    },
    {
      id: 3,
      plateNumber: 'DEF 9012',
      vin: '3HGBH41JXMN109188',
      manufacturer: 'نيسان',
      model: 'التيما',
      year: 2021,
      type: 'سيدان',
      insuranceStatus: 'ساري',
      insuranceExpiry: '2024-09-30',
      registrationExpiry: '2024-12-15',
      inspectionExpiry: '2024-11-20',
      status: 'صيانة',
    },
  ];

  const columns = [
    {
      key: 'plateNumber',
      label: 'رقم اللوحة',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: 'manufacturer',
      label: 'الشركة المصنعة',
    },
    {
      key: 'model',
      label: 'الموديل',
    },
    {
      key: 'year',
      label: 'السنة',
    },
    {
      key: 'type',
      label: 'النوع',
    },
    {
      key: 'insuranceStatus',
      label: 'حالة التأمين',
      render: (value: string) => (
        <Badge variant={value === 'ساري' ? 'success' : 'warning'}>{value}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: string) => {
        const variant = value === 'متاح' ? 'success' : value === 'مفوض' ? 'info' : 'warning';
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المركبات</h1>
          <p className="text-gray-600">عرض وإدارة جميع مركبات الأسطول</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة مركبة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي المركبات</p>
              <p className="text-3xl font-bold text-gray-900">48</p>
            </div>
            <Car className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المتاحة</p>
              <p className="text-3xl font-bold text-gray-900">35</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">قيد الصيانة</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
            </div>
            <Shield className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">وثائق منتهية</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
            </div>
            <Calendar className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="رقم اللوحة" placeholder="ابحث برقم اللوحة" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الشركة المصنعة</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">الكل</option>
                <option value="toyota">تويوتا</option>
                <option value="honda">هوندا</option>
                <option value="nissan">نيسان</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حالة التأمين</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">الكل</option>
                <option value="active">ساري</option>
                <option value="expiring">قارب على الانتهاء</option>
                <option value="expired">منتهي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">الكل</option>
                <option value="available">متاح</option>
                <option value="assigned">مفوض</option>
                <option value="maintenance">صيانة</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table columns={columns} data={vehicles} onRowClick={(row) => console.log('Selected:', row)} />
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">إضافة مركبة جديدة</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Form Data:', formData);
                // TODO: Add API call here
                // await createVehicle(formData);
                setShowModal(false);
                // Reset form
                setFormData({
                  plateNumber: '',
                  plateName: '',
                  serialNumber: '',
                  vin: '',
                  manufacturer: '',
                  paletText1: '',
                  paletText2: '',
                  paletText3: '',
                  model: '',
                  year: new Date().getFullYear(),
                  type: '',
                  insuranceStatus: 'active',
                  insuranceExpiry: '',
                  registrationExpiry: '',
                  inspectionExpiry: '',
                  status: 'available',
                  color: '',
                  fuelType: '',
                  odometerReading: 0,
                  notes: '',
                });
              }}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="رقم اللوحة"
                  placeholder="ABC 1234"
                  required
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                />

                <Input
                  label="اسم اللوحة"
                  placeholder="اسم اللوحة"
                  value={formData.plateName}
                  onChange={(e) => setFormData({ ...formData, plateName: e.target.value })}
                />

                <Input
                  label="الرقم التسلسلي"
                  placeholder="الرقم التسلسلي"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />

                <Input
                  label="رقم الشاسيه (VIN)"
                  placeholder="1HGBH41JXMN109186"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الشركة المصنعة<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  >
                    <option value="">اختر الشركة</option>
                    <option value="تويوتا">تويوتا</option>
                    <option value="هوندا">هوندا</option>
                    <option value="نيسان">نيسان</option>
                    <option value="فورد">فورد</option>
                    <option value="شيفروليه">شيفروليه</option>
                    <option value="مرسيدس">مرسيدس</option>
                    <option value="بي إم دبليو">بي إم دبليو</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <Input
                  label="الموديل"
                  placeholder="كامري"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />

                <div className="border-t border-gray-200 pt-4 md:col-span-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">نصوص اللوحة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="نص اللوحة 1"
                      placeholder="نص اللوحة الأول"
                      value={formData.paletText1}
                      onChange={(e) => setFormData({ ...formData, paletText1: e.target.value })}
                    />
                    <Input
                      label="نص اللوحة 2"
                      placeholder="نص اللوحة الثاني"
                      value={formData.paletText2}
                      onChange={(e) => setFormData({ ...formData, paletText2: e.target.value })}
                    />
                    <Input
                      label="نص اللوحة 3"
                      placeholder="نص اللوحة الثالث"
                      value={formData.paletText3}
                      onChange={(e) => setFormData({ ...formData, paletText3: e.target.value })}
                    />
                  </div>
                </div>

                <Input
                  label="سنة الصنع"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع المركبة<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="">اختر النوع</option>
                    <option value="سيدان">سيدان</option>
                    <option value="جيب">جيب</option>
                    <option value="شاحنة">شاحنة</option>
                    <option value="فان">فان</option>
                    <option value="بيك أب">بيك أب</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اللون</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  >
                    <option value="">اختر اللون</option>
                    <option value="أبيض">أبيض</option>
                    <option value="أسود">أسود</option>
                    <option value="فضي">فضي</option>
                    <option value="رمادي">رمادي</option>
                    <option value="أحمر">أحمر</option>
                    <option value="أزرق">أزرق</option>
                    <option value="أخضر">أخضر</option>
                    <option value="بني">بني</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الوقود</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  >
                    <option value="">اختر نوع الوقود</option>
                    <option value="بنزين">بنزين</option>
                    <option value="ديزل">ديزل</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="هجين">هجين</option>
                  </select>
                </div>

                <Input
                  label="قراءة العداد"
                  type="number"
                  min="0"
                  value={formData.odometerReading}
                  onChange={(e) => setFormData({ ...formData, odometerReading: parseInt(e.target.value) || 0 })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    حالة المركبة<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="available">متاح</option>
                    <option value="assigned">مفوض</option>
                    <option value="maintenance">صيانة</option>
                    <option value="out_of_service">خارج الخدمة</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التأمين والوثائق</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">حالة التأمين</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.insuranceStatus}
                      onChange={(e) => setFormData({ ...formData, insuranceStatus: e.target.value })}
                    >
                      <option value="active">ساري</option>
                      <option value="expiring_soon">قارب على الانتهاء</option>
                      <option value="expired">منتهي</option>
                    </select>
                  </div>

                  <Input
                    label="تاريخ انتهاء التأمين"
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                  />

                  <Input
                    label="تاريخ انتهاء الاستمارة"
                    type="date"
                    value={formData.registrationExpiry}
                    onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
                  />

                  <Input
                    label="تاريخ انتهاء الفحص الدوري"
                    type="date"
                    value={formData.inspectionExpiry}
                    onChange={(e) => setFormData({ ...formData, inspectionExpiry: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أي ملاحظات إضافية عن المركبة..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  إلغاء
                </Button>
                <Button variant="primary" type="submit">
                  حفظ المركبة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
