'use client';

import { Car, Users, FileText, Wrench, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">لوحة التحكم</h1>
        <p className="text-sm sm:text-base text-gray-600">نظرة عامة على نظام المساندة ودعم الفرق</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#09b9b5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">إجمالي المركبات</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">48</p>
            </div>
            <Car className="w-8 h-8 sm:w-10 sm:h-10 text-[#09b9b5] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#00a287]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">المستخدمين</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">24</p>
            </div>
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#00a287] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#f57c00]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">التفويضات السارية</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">28</p>
            </div>
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#f57c00] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#7b1fa2]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">قيد الصيانة</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">5</p>
            </div>
            <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-[#7b1fa2] flex-shrink-0" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card title="آخر التفويضات">
          <div className="space-y-2 sm:space-y-3">
            {[
              { vehicle: 'ABC 1234', driver: 'محمد أحمد', endDate: '2024-06-30' },
              { vehicle: 'XYZ 5678', driver: 'عبدالله سعيد', endDate: '2024-07-15' },
              { vehicle: 'DEF 9012', driver: 'سعيد محمود', endDate: '2024-05-20' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#effefa] rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-[#09b9b5]" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{item.vehicle}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{item.driver}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">{item.endDate}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="ملخص الحوادث">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">حوادث هذا الشهر</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">2</p>
            </div>
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-[#f57c00] flex-shrink-0" />
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-[#00a287]">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm">انخفاض 20% عن الشهر الماضي</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
