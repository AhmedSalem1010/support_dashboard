'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, Bell, Loader2 } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Enter animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(notification.id), 300);
  };

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(handleClose, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <div
      dir="rtl"
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-out
        ${getColors()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isLeaving ? 'translate-x-full opacity-0 scale-95' : ''}
        max-w-md w-full
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
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
            onClick={notification.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="إغلاق التنبيه"
      >
        <X className="w-4 h-4 opacity-60" />
      </button>
    </div>
  );
};

interface NotificationsContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notifications,
  onClose,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div
      dir="rtl"
      className="fixed top-4 left-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ minWidth: '320px' }}
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem notification={notification} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // Default 5 seconds
    };
    
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) =>
    addNotification({ type: 'success', title, message, ...options });

  const error = (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) =>
    addNotification({ type: 'error', title, message, ...options });

  const warning = (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) =>
    addNotification({ type: 'warning', title, message, ...options });

  const info = (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) =>
    addNotification({ type: 'info', title, message, ...options });

  const loading = (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) =>
    addNotification({ type: 'loading', title, message, duration: 0, ...options }); // No auto-close for loading

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    loading,
  };
};

// Global notification context
import { createContext, useContext } from 'react';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  success: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => string;
  error: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => string;
  warning: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => string;
  info: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => string;
  loading: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationState = useNotifications();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
      <NotificationsContainer notifications={notificationState.notifications} onClose={notificationState.removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationProvider');
  }
  return context;
};
