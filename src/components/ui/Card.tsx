'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, title, className = '', hoverable = false, style, onClick }: CardProps) {
  // CleanLife Design System - Cards
  const baseStyles = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  const hoverStyles = hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-[#09b9b5]' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} style={style} onClick={onClick}>
      {title && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
