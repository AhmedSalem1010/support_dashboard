'use client';

import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate flex-1 mx-4 lg:mx-0">
          نظام المساندة ودعم الفرق
        </h2>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#d32f2f] rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
