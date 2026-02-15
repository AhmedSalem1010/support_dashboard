'use client';

import { LayoutDashboard, Car, Users, FileText, Wrench, AlertTriangle, DollarSign, BarChart3, ClipboardCheck, Menu, X, Bell, User, ChevronDown, Search, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onMenuClick?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
  { id: 'vehicles', label: 'المركبات', icon: Car, color: 'from-purple-500 to-purple-600' },
  { id: 'users', label: 'المستخدمين', icon: Users, color: 'from-green-500 to-green-600' },
  { id: 'authorizations', label: 'التفويض', icon: FileText, color: 'from-orange-500 to-orange-600' },
  { id: 'inspection', label: 'فحص المعدات والسكن', icon: ClipboardCheck, color: 'from-cyan-500 to-cyan-600' },
  { id: 'maintenance', label: 'الصيانة', icon: Wrench, color: 'from-yellow-500 to-yellow-600' },
  { id: 'accidents', label: 'الحوادث', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  { id: 'expenses', label: 'المصاريف', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
  { id: 'reports', label: 'التقارير المالية', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
];

export function Sidebar({ currentPage, onPageChange, isOpen, onClose, onMenuClick }: SidebarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Top Navigation Bar */}
      <header className={`
        bg-gradient-to-r from-[#09b9b5] via-[#0da9a5] to-[#09b9b5]
        text-white shadow-2xl sticky top-0 z-50 transition-all duration-300
        ${scrolled ? 'py-2 shadow-xl' : 'py-3'}
      `}>
        <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6">
          {/* Logo / Brand - Right side (RTL) */}
          <div className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-l from-white to-white/90 bg-clip-text text-transparent">
                نظام المساندة ودعم الفرق
              </h1>
              <p className="text-xs text-white/70 hidden sm:flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                CleanLife Dashboard • {formatTime(currentTime)}
              </p>
            </div>
          </div>

          {/* Navigation - Center (hidden on mobile, shown on lg+) */}
          <nav className="flex-1 hidden lg:flex justify-center overflow-x-auto scrollbar-hide min-w-0">
            <div className="flex items-center gap-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                    className={`
                      group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl
                      transition-all duration-300 whitespace-nowrap text-sm font-medium
                      animate-fadeIn
                      ${isActive
                        ? 'bg-white text-[#09b9b5] shadow-lg scale-105'
                        : 'text-white/90 hover:bg-white/15 hover:text-white hover:scale-105'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
                    )}
                    
                    {/* Icon with gradient background */}
                    <div className={`
                      relative p-1.5 rounded-lg transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-br ${item.color}` 
                        : 'bg-white/10 group-hover:bg-white/20'
                      }
                    `}>
                      <Icon className={`
                        w-4 h-4 transition-all duration-300
                        ${isActive ? 'text-white' : 'group-hover:scale-110'}
                      `} />
                    </div>
                    
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User actions - Left side (RTL) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-white/15 transition-all duration-300 group" aria-label="الإشعارات">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              {notificationCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold items-center justify-center shadow-lg">
                      {notificationCount}
                    </span>
                  </span>
                </>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/15 transition-all duration-300 group"
                aria-label="المستخدم"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm"></div>
                  <div className="relative bg-gradient-to-br from-white/20 to-white/10 p-1.5 rounded-full border border-white/30">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 hidden sm:block transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 text-right">أحمد محمد</p>
                    <p className="text-xs text-gray-500 text-right">مدير النظام</p>
                  </div>
                  <button className="w-full px-4 py-2.5 text-right hover:bg-gray-50 transition-colors flex items-center justify-end gap-2 text-gray-700 text-sm">
                    <span>الإعدادات</span>
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="w-full px-4 py-2.5 text-right hover:bg-red-50 transition-colors flex items-center justify-end gap-2 text-red-600 text-sm">
                    <span>تسجيل الخروج</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={isOpen ? onClose : (onMenuClick || (() => {}))}
              className="lg:hidden p-2 rounded-xl hover:bg-white/15 transition-all duration-300 group"
              aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {isOpen ? (
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-white/20 bg-gradient-to-b from-[#09b9b5] to-[#0da9a5] px-4 py-4 animate-slideDown">
            {/* Search bar for mobile */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="بحث في القوائم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-10 py-2.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 text-right text-sm"
                />
              </div>
            </div>

            {/* Date display */}
            <div className="mb-4 text-center text-white/80 text-xs bg-white/10 rounded-xl py-2 backdrop-blur-sm">
              {formatDate(currentTime)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredMenuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                    className={`
                      group relative flex flex-col items-center gap-2 p-4 rounded-2xl text-center
                      transition-all duration-300 animate-fadeIn hover:scale-105
                      ${isActive
                        ? 'bg-white text-[#09b9b5] font-semibold shadow-xl'
                        : 'bg-white/10 backdrop-blur-sm text-white/90 hover:bg-white/20 border border-white/20'
                      }
                    `}
                  >
                    {/* Icon container */}
                    <div className={`
                      p-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-br ${item.color}` 
                        : 'bg-white/10 group-hover:bg-white/20'
                      }
                    `}>
                      <Icon className={`
                        w-6 h-6 transition-all duration-300
                        ${isActive ? 'text-white' : 'group-hover:scale-110'}
                      `} />
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-[#09b9b5] to-transparent rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick stats in mobile menu */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <p className="text-xs text-white/70">المركبات</p>
                <p className="text-lg font-bold text-white">45</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <p className="text-xs text-white/70">المستخدمين</p>
                <p className="text-lg font-bold text-white">128</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <p className="text-xs text-white/70">التفويض</p>
                <p className="text-lg font-bold text-white">23</p>
              </div>
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}