'use client';

import { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function FinancialReports() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">التقارير المالية</h1>
          <p className="text-sm sm:text-base text-gray-600">تقارير وإحصائيات المصاريف والإيرادات</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-end">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">الفترة</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
            >
              <option value="week">أسبوع</option>
              <option value="month">شهر</option>
              <option value="quarter">ربع سنة</option>
              <option value="year">سنة</option>
            </select>
          </div>
          <Button variant="primary" className="text-sm">
            <Download className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden sm:inline">تصدير التقرير</span>
            <span className="sm:hidden">تصدير</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#09b9b5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">إجمالي المصاريف</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">542,400</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">ر.س لهذه الفترة</p>
            </div>
            <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#00a287]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">مصاريف الوقود</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">185,000</p>
              <p className="text-xs text-[#00a287] mt-1 hidden sm:block">34% من الإجمالي</p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#f57c00]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">مصاريف الصيانة</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">268,800</p>
              <p className="text-xs text-[#f57c00] mt-1 hidden sm:block">50% من الإجمالي</p>
            </div>
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-[#617c96] flex-shrink-0" />
          </div>
        </Card>
        <Card className="border-r-4 border-[#7b1fa2]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">متوسط لكل مركبة</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">11,300</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">ر.س/مركبة</p>
            </div>
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-[#7b1fa2] flex-shrink-0" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="ملخص المصاريف حسب الفئة">
          <div className="space-y-4">
            {[
              { label: 'وقود', amount: '185,000', percent: 34, color: 'bg-[#f57c00]' },
              { label: 'صيانة', amount: '268,800', percent: 50, color: 'bg-[#00a287]' },
              { label: 'إصلاحات', amount: '54,240', percent: 10, color: 'bg-[#09b9b5]' },
              { label: 'أخرى', amount: '34,360', percent: 6, color: 'bg-[#617c96]' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-600">{item.amount} ر.س ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="تقرير مخصص">
          <div className="space-y-4">
            <Input label="من تاريخ" type="date" />
            <Input label="إلى تاريخ" type="date" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع التقرير</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]">
                <option value="summary">ملخص المصاريف</option>
                <option value="by-vehicle">حسب المركبة</option>
                <option value="by-category">حسب الفئة</option>
                <option value="detailed">تفصيلي</option>
              </select>
            </div>
            <Button variant="primary" className="w-full">
              <Calendar className="w-4 h-4 ml-2" />
              إنشاء التقرير
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
