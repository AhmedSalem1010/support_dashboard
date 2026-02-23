'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

export type DialogType = 'confirm' | 'warning' | 'error' | 'info' | 'success';

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  title: string;
  message?: string;
  description?: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

function getTypeConfig(type: DialogType) {
  switch (type) {
    case 'warning':
      return {
        label: 'تحذير مهم',
        color: '#0da9a5',
        colorDark: '#0c9894',
        glow: 'rgba(13, 169, 165, 0.25)',
        iconBg: 'rgba(13, 169, 165, 0.15)',
        iconBorder: 'rgba(13, 169, 165, 0.3)',
      };
    case 'error':
      return {
        label: 'خطأ حرج',
        color: '#d32f2f',
        colorDark: '#c62828',
        glow: 'rgba(211, 47, 47, 0.25)',
        iconBg: 'rgba(211, 47, 47, 0.15)',
        iconBorder: 'rgba(211, 47, 47, 0.3)',
      };
    case 'success':
      return {
        label: 'تمّ بنجاح',
        color: '#00a287',
        colorDark: '#00897b',
        glow: 'rgba(0, 162, 135, 0.25)',
        iconBg: 'rgba(0, 162, 135, 0.15)',
        iconBorder: 'rgba(0, 162, 135, 0.3)',
      };
    case 'info':
      return {
        label: 'معلومة مفيدة',
        color: '#1976d2',
        colorDark: '#1565c0',
        glow: 'rgba(25, 118, 210, 0.25)',
        iconBg: 'rgba(25, 118, 210, 0.15)',
        iconBorder: 'rgba(25, 118, 210, 0.3)',
      };
    case 'confirm':
    default:
      return {
        label: 'تأكيد الإجراء',
        color: '#09b9b5',
        colorDark: '#08a5a1',
        glow: 'rgba(9, 185, 181, 0.25)',
        iconBg: 'rgba(9, 185, 181, 0.15)',
        iconBorder: 'rgba(9, 185, 181, 0.3)',
      };
  }
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  description,
  type = 'confirm',
  confirmText,
  cancelText,
  loading = false,
  icon,
}) => {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const config = useMemo(() => getTypeConfig(type), [type]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      document.body.style.overflow = 'hidden';
    } else if (mounted) {
      setClosing(true);
      const t = window.setTimeout(() => {
        setMounted(false);
        setClosing(false);
        document.body.style.overflow = '';
      }, 250);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (!loading) onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted, loading, onClose]);

  const getIcon = () => {
    if (icon) return icon;
    const base = 'w-6 h-6 text-white';
    switch (type) {
      case 'warning':
        return <AlertTriangle className={base} />;
      case 'error':
        return <AlertTriangle className={base} />;
      case 'success':
        return <CheckCircle className={base} />;
      case 'info':
        return <Info className={base} />;
      default:
        return <HelpCircle className={base} />;
    }
  };

  const defaultConfirmText = type === 'confirm' ? 'تأكيد' : type === 'error' ? 'إعادة المحاولة' : 'حفظ';
  const defaultCancelText = 'إلغاء';

  const handleBackdrop = () => {
    if (loading) return;
    onClose();
  };

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onClose();
  };

  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm?.();
    onClose();
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-250 ${
          closing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleBackdrop}
      />

      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md transition-all duration-350 ${
          closing ? 'scale-85 translate-y-5 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          className="bg-white rounded-3xl overflow-hidden border border-gray-200"
          style={{
            boxShadow: `0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`,
          }}
        >
          {/* Header */}
          <div className="px-7 pt-8 pb-6 flex items-start gap-4 relative border-b border-gray-100">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: config.iconBg,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: config.iconBorder,
                animation: 'iconPulse 2s ease-in-out infinite',
              }}
            >
              {getIcon()}
            </div>

            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] font-bold tracking-widest uppercase block mb-1.5"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{title}</h3>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-8.5 h-8.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all hover:rotate-90 disabled:opacity-50 flex items-center justify-center flex-shrink-0 mt-0.5"
              aria-label="إغلاق"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-7 py-6">
            {(message || description) && (
              <p className="text-[15px] text-[#4d647c] leading-relaxed text-right">
                {message || description}
              </p>
            )}

            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center mt-5">
              <div
                className="h-1.5 rounded-sm transition-all"
                style={{
                  width: '18px',
                  background: config.color,
                }}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Actions */}
          <div className="px-7 pb-7 flex gap-3 flex-row-reverse">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-5 py-3.5 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all border-none outline-none relative overflow-hidden hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: `linear-gradient(135deg, ${config.color} 0%, ${config.colorDark} 100%)`,
                boxShadow: `0 8px 24px ${config.glow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 32px ${config.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${config.glow}`;
              }}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {confirmText || defaultConfirmText}
              </span>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                }}
              />
            </button>

            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-5 py-3.5 rounded-2xl text-sm font-bold bg-gray-50 border-2 border-gray-300 text-gray-700 cursor-pointer transition-all outline-none hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {cancelText || defaultCancelText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes iconPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 ${config.glow};
          }
          50% {
            box-shadow: 0 0 0 8px transparent;
          }
        }
      `}</style>
    </div>
  );
};

export const useAlertDialog = () => {
  const [dialog, setDialog] = useState<Omit<AlertDialogProps, 'onClose'> | null>(null);

  const showDialog = (props: Omit<AlertDialogProps, 'onClose' | 'isOpen'>) => {
    setDialog({ ...props, isOpen: true });
  };

  const hideDialog = () => {
    setDialog(null);
  };

  const confirm = (
    title: string,
    message?: string,
    options?: Partial<Omit<AlertDialogProps, 'title' | 'message' | 'isOpen' | 'onClose'>>
  ) => {
    return new Promise<boolean>((resolve) => {
      showDialog({
        title,
        message,
        type: options?.type ?? 'confirm',
        confirmText: options?.confirmText ?? 'تأكيد',
        cancelText: options?.cancelText ?? 'إلغاء',
        icon: options?.icon,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  const DialogComponent = () => {
    if (!dialog) return null;
    return <AlertDialog {...dialog} onClose={hideDialog} />;
  };

  return {
    showDialog,
    hideDialog,
    confirm,
    DialogComponent,
  };
};

export default AlertDialog;
