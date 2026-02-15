'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'info' | 'warning' | 'primary';
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', className = '', style }: BadgeProps) {
  // CleanLife Design System - Status Badges
  const styles = {
    // افتراضي
    default: 'bg-gray-100 text-[#4d647c]',
    // نجاح / نشط / مكتمل
    success: 'bg-[#effefa] text-[#00a287]',
    // خطأ / ملغي / معطل
    danger: 'bg-[#ffebee] text-[#d32f2f]',
    // معلومات / جديد
    info: 'bg-[#e3f2fd] text-[#1976d2]',
    // تحذير / قيد الانتظار
    warning: 'bg-[#fff3e0] text-[#f57c00]',
    // اللون الأساسي
    primary: 'bg-[#effefa] text-[#09b9b5]',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${styles[variant]} ${className}`} style={style}>
      {children}
    </span>
  );
}
