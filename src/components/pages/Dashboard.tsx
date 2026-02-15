'use client';

import { LayoutDashboard, Car, Users, FileText, Wrench, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">نظرة عامة على نظام المساندة ودعم الفرق</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-sm text-gray-600 mb-1">المستخدمين</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <Users className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">التفويضات السارية</p>
              <p className="text-3xl font-bold text-gray-900">28</p>
            </div>
            <FileText className="w-10 h-10 text-amber-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">قيد الصيانة</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
            </div>
            <Wrench className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="آخر التفويضات">
          <div className="space-y-3">
            {[
              { vehicle: 'ABC 1234', driver: 'محمد أحمد', endDate: '2024-06-30' },
              { vehicle: 'XYZ 5678', driver: 'عبدالله سعيد', endDate: '2024-07-15' },
              { vehicle: 'DEF 9012', driver: 'سعيد محمود', endDate: '2024-05-20' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.vehicle}</p>
                    <p className="text-sm text-gray-500">{item.driver}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{item.endDate}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="ملخص الحوادث">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">حوادث هذا الشهر</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">انخفاض 20% عن الشهر الماضي</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
