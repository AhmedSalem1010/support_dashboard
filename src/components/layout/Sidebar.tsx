'use client';

import { LayoutDashboard, Car, Users, FileText, Wrench, AlertTriangle, DollarSign, BarChart3, ClipboardCheck } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'vehicles', label: 'المركبات', icon: Car },
  { id: 'users', label: 'المستخدمين', icon: Users },
  { id: 'authorizations', label: 'التفويض', icon: FileText },
  { id: 'inspection', label: 'التشييك', icon: ClipboardCheck },
  { id: 'maintenance', label: 'الصيانة', icon: Wrench },
  { id: 'accidents', label: 'الحوادث', icon: AlertTriangle },
  { id: 'expenses', label: 'المصاريف', icon: DollarSign },
  { id: 'reports', label: 'التقارير المالية', icon: BarChart3 },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen p-4 shadow-xl">
      <div className="mb-8 p-4">
        <h1 className="text-2xl font-bold text-center">نظام المساندة ودعم الفرق</h1>
        <p className="text-xs text-gray-400 text-center mt-1">Support and Team Support System</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav> </div>
  );
}
