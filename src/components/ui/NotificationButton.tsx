'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, AlertCircle, Info, X, Settings, Trash2 } from 'lucide-react';
import { useNotificationsContext, type Notification } from './Notifications';

interface NotificationButtonProps {
  className?: string;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ className = '' }) => {
  const { notifications, removeNotification, clearAllNotifications } = useNotificationsContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'error':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
        aria-label="التنبيهات"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        
        {/* Badge for unread count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          dir="rtl"
          className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">التنبيهات</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => clearAllNotifications()}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="مسح الكل"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium">لا توجد تنبيهات</p>
                <p className="text-xs text-gray-400 mt-1">ستظهر التنبيهات الجديدة هنا</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 transition-colors cursor-pointer
                      ${getColors(notification.type)}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 leading-tight">
                          {notification.title}
                        </h4>
                        {notification.message && (
                          <p className="text-sm opacity-80 leading-relaxed">
                            {notification.message}
                          </p>
                        )}
                        {notification.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action!.onClick();
                            }}
                            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-current"
                        aria-label="إغلاق التنبيه"
                      >
                        <X className="w-4 h-4 opacity-60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                إغلاق القائمة
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
