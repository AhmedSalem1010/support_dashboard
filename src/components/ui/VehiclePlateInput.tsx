'use client';

import { useRef, useCallback } from 'react';

/** تحليل نص اللوحة إلى أجزاء: 3 أحرف + أرقام */
function parsePlateToParts(value: string): {
  char1: string;
  char2: string;
  char3: string;
  numbers: string;
} {
  const cleaned = value.replace(/\s/g, '');
  let char1 = '';
  let char2 = '';
  let char3 = '';
  let numbers = '';
  let i = 0;
  for (; i < cleaned.length && (char1.length + char2.length + char3.length) < 3; i++) {
    const c = cleaned[i];
    if (/\d/.test(c)) break;
    if (char1.length < 1) char1 = c;
    else if (char2.length < 1) char2 = c;
    else char3 = c;
  }
  numbers = cleaned.slice(i).replace(/\D/g, '').slice(0, 4);
  return { char1, char2, char3, numbers };
}

/** تجميع الأجزاء إلى نص اللوحة */
function partsToPlate(char1: string, char2: string, char3: string, numbers: string): string {
  const parts = [char1, char2, char3].filter(Boolean);
  if (numbers) parts.push(numbers);
  return parts.join(' ');
}

export interface VehiclePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function VehiclePlateInput({
  value,
  onChange,
  id,
  className = '',
  label = 'لوحة المركبة',
  disabled = false,
}: VehiclePlateInputProps) {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const refNum = useRef<HTMLInputElement>(null);

  const parts = parsePlateToParts(value);

  const setParts = useCallback(
    (char1: string, char2: string, char3: string, numbers: string) => {
      onChange(partsToPlate(char1, char2, char3, numbers));
    },
    [onChange]
  );

  const handleChange = useCallback(
    (field: 1 | 2 | 3 | 4, newVal: string) => {
      const letterChar = (v: string) => v.replace(/[\d\s]/g, '').slice(-1) || v.slice(-1);
      if (field === 1) {
        const c = letterChar(newVal);
        setParts(c, parts.char2, parts.char3, parts.numbers);
        if (c && ref2.current) ref2.current.focus();
      } else if (field === 2) {
        const c = letterChar(newVal);
        setParts(parts.char1, c, parts.char3, parts.numbers);
        if (c && ref3.current) ref3.current.focus();
      } else if (field === 3) {
        const c = letterChar(newVal);
        setParts(parts.char1, parts.char2, c, parts.numbers);
        if (c && refNum.current) refNum.current.focus();
      } else {
        const nums = newVal.replace(/\D/g, '').slice(0, 4);
        setParts(parts.char1, parts.char2, parts.char3, nums);
      }
    },
    [parts, setParts]
  );

  const handleKeyDown = useCallback(
    (field: 1 | 2 | 3 | 4, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (field === 1 && !parts.char1) return;
        if (field === 2 && !parts.char2) {
          e.preventDefault();
          setParts(parts.char1, '', parts.char3, parts.numbers);
          ref1.current?.focus();
          return;
        }
        if (field === 3 && !parts.char3) {
          e.preventDefault();
          setParts(parts.char1, parts.char2, '', parts.numbers);
          ref2.current?.focus();
          return;
        }
        if (field === 4 && !parts.numbers) {
          e.preventDefault();
          setParts(parts.char1, parts.char2, parts.char3, '');
          ref3.current?.focus();
          return;
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
          if (field === 2) ref1.current?.focus();
          else if (field === 3) ref2.current?.focus();
          else if (field === 4) ref3.current?.focus();
        } else {
          if (field === 1) ref2.current?.focus();
          else if (field === 2) ref3.current?.focus();
          else if (field === 3) refNum.current?.focus();
        }
      }
    },
    [parts, setParts]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').trim();
      const { char1, char2, char3, numbers } = parsePlateToParts(pasted);
      setParts(char1, char2, char3, numbers);
      if (numbers && refNum.current) refNum.current.focus();
      else if (char3 && refNum.current) refNum.current.focus();
      else if (char2 && ref3.current) ref3.current.focus();
      else if (char1 && ref2.current) ref2.current.focus();
    },
    [setParts]
  );

  const inputCls =
    'p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white text-center';
  const charCls = `w-12 ${inputCls}`;
  const numCls = `flex-1 min-w-[80px] ${inputCls}`;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#4d647c] mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="flex gap-2" dir="rtl">
        <input
          ref={ref1}
          type="text"
          inputMode="text"
          value={parts.char1}
          onChange={(e) => handleChange(1, e.target.value)}
          onKeyDown={(e) => handleKeyDown(1, e)}
          onPaste={handlePaste}
          placeholder="حرف"
          maxLength={1}
          disabled={disabled}
          className={charCls}
          aria-label="حرف لوحة المركبة 1"
        />
        <input
          ref={ref2}
          type="text"
          inputMode="text"
          value={parts.char2}
          onChange={(e) => handleChange(2, e.target.value)}
          onKeyDown={(e) => handleKeyDown(2, e)}
          onPaste={handlePaste}
          placeholder="حرف"
          maxLength={1}
          disabled={disabled}
          className={charCls}
          aria-label="حرف لوحة المركبة 2"
        />
        <input
          ref={ref3}
          type="text"
          inputMode="text"
          value={parts.char3}
          onChange={(e) => handleChange(3, e.target.value)}
          onKeyDown={(e) => handleKeyDown(3, e)}
          onPaste={handlePaste}
          placeholder="حرف"
          maxLength={1}
          disabled={disabled}
          className={charCls}
          aria-label="حرف لوحة المركبة 3"
        />
        <input
          ref={refNum}
          type="text"
          inputMode="numeric"
          value={parts.numbers}
          onChange={(e) => handleChange(4, e.target.value)}
          onKeyDown={(e) => handleKeyDown(4, e)}
          onPaste={handlePaste}
          placeholder="2589"
          maxLength={4}
          disabled={disabled}
          className={numCls}
          aria-label="أرقام لوحة المركبة"
        />
      </div>
    </div>
  );
}
