'use client';

import { useState } from 'react';
import { Plus, User, Users as UsersIcon, Shield, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { USER_STATUS_LABELS, USER_ROLE_LABELS, statusToArabic } from '@/lib/enums';

export function Users() {
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'driver',
    phone: '',
    password: '',
    status: 'active',
  });

  const users = [
    { id: 1, name: 'محمد أحمد', email: 'mohamed@example.com', role: 'سائق', phone: '0501234567', status: 'نشط' },
    { id: 2, name: 'خالد سعيد', email: 'khalid@example.com', role: 'مشرف', phone: '0507654321', status: 'نشط' },
    { id: 3, name: 'عبدالله محمود', email: 'abdullah@example.com', role: 'سائق', phone: '0551112233', status: 'غير نشط' },
  ];

  // CleanLife Design System - Users
  const columns = [
    {
      key: 'name',
      label: 'الاسم',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#effefa] rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-[#09b9b5]" />
          </div>
          <span className="font-semibold text-gray-900">{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#617c96]" />
          <span className="text-[#4d647c]">{String(value)}</span>
        </div>
      ),
    },
    { key: 'role', label: 'الدور' },
    { key: 'phone', label: 'الهاتف' },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => (
        <Badge variant={(s => s === 'نشط' ? 'success' : s === 'موقوف' ? 'warning' : 'default')(statusToArabic(String(value)))}>{statusToArabic(String(value))}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">المستخدمين</h1>
          <p className="text-sm text-[#617c96]">إدارة المستخدمين والصلاحيات</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="text-sm">
            تصفية
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)} className="text-sm">
            <Plus className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden sm:inline">إضافة مستخدم</span>
            <span className="sm:hidden">إضافة</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards - CleanLife Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-[#09b9b5] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">إجمالي المستخدمين</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-10 h-10 bg-[#effefa] rounded-lg flex items-center justify-center flex-shrink-0">
              <UsersIcon className="w-5 h-5 text-[#09b9b5]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-[#00a287] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">السائقين</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">18</p>
            </div>
            <div className="w-10 h-10 bg-[#effefa] rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#00a287]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-[#f57c00] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">المشرفين</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">4</p>
            </div>
            <div className="w-10 h-10 bg-[#fff3e0] rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#f57c00]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-[#1976d2] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#617c96] mb-1">النشطين</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">22</p>
            </div>
            <div className="w-10 h-10 bg-[#e3f2fd] rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#1976d2]" />
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="الاسم" placeholder="ابحث بالاسم" />
            <Input label="البريد الإلكتروني" placeholder="البريد الإلكتروني" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                <option value="">الكل</option>
                <option value="driver">سائق</option>
                <option value="supervisor">مشرف</option>
                <option value="admin">مدير</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table columns={columns} data={users} onRowClick={(row) => console.log('Selected:', row)} />
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">إضافة مستخدم جديد</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="p-6 space-y-4">
              <Input label="الاسم" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="البريد الإلكتروني" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <Input label="كلمة المرور" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <Input label="الهاتف" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                  {Object.entries(USER_ROLE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                  {Object.entries(USER_STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
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
