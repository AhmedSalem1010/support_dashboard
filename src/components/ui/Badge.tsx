'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'info' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
}
