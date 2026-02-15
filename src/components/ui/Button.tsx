'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  // CleanLife Design System - Buttons with focus aesthetics
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-md 
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  `;
  
  const variants = {
    // الزر الرئيسي - اللون التركوازي
    primary: 'bg-[#09b9b5] text-white hover:bg-[#08a5a1] focus:ring-[#09b9b5]',
    // الزر الثانوي
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    // زر النجاح
    success: 'bg-[#00a287] text-white hover:bg-[#008f77] focus:ring-[#00a287]',
    // زر الخطر
    danger: 'bg-[#c63c3c] text-white hover:bg-red-700 focus:ring-[#c63c3c]',
    // زر الحدود
    outline: 'bg-transparent border-2 border-[#09b9b5] text-[#09b9b5] hover:bg-[#09b9b5] hover:text-white focus:ring-[#09b9b5]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
