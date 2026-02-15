'use client';

import { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function FinancialReports() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير المالية</h1>
          <p className="text-gray-600">تقارير وإحصائيات المصاريف والإيرادات</p>
        </div>
        <div className="flex gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفترة</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">أسبوع</option>
              <option value="month">شهر</option>
              <option value="quarter">ربع سنة</option>
              <option value="year">سنة</option>
            </select>
          </div>
          <Button variant="primary">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي المصاريف</p>
              <p className="text-3xl font-bold text-gray-900">542,400</p>
              <p className="text-xs text-gray-500 mt-1">ر.س لهذه الفترة</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">مصاريف الوقود</p>
              <p className="text-3xl font-bold text-gray-900">185,000</p>
              <p className="text-xs text-green-600 mt-1">34% من الإجمالي</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">مصاريف الصيانة</p>
              <p className="text-3xl font-bold text-gray-900">268,800</p>
              <p className="text-xs text-amber-600 mt-1">50% من الإجمالي</p>
            </div>
            <BarChart3 className="w-10 h-10 text-amber-500" />
          </div>
        </Card>
        <Card className="border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">متوسط لكل مركبة</p>
              <p className="text-3xl font-bold text-gray-900">11,300</p>
              <p className="text-xs text-gray-500 mt-1">ر.س/مركبة</p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="ملخص المصاريف حسب الفئة">
          <div className="space-y-4">
            {[
              { label: 'وقود', amount: '185,000', percent: 34, color: 'bg-amber-500' },
              { label: 'صيانة', amount: '268,800', percent: 50, color: 'bg-green-500' },
              { label: 'إصلاحات', amount: '54,240', percent: 10, color: 'bg-blue-500' },
              { label: 'أخرى', amount: '34,360', percent: 6, color: 'bg-gray-500' },
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
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
