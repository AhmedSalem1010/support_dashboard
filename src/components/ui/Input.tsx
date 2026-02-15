interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  error?: string;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  disabled = false,
  min,
  max,
  step,
  error,
}: InputProps) {
  // CleanLife Design System - Input Fields
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#4d647c] mb-1">
          {label}
          {required && <span className="text-[#d32f2f] mr-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`
          w-full p-2 text-sm font-medium rounded-md
          transition-all duration-200 ease-out
          bg-white border text-[#4d647c]
          ${error ? 'border-[#d32f2f]' : 'border-gray-300'}
          focus:outline-none focus:ring-0 focus:border-[#09b9b5]
          focus:shadow-[0_0_0_3px_rgba(9,185,181,0.15)]
          hover:border-gray-400
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
          placeholder:text-[#617c96]
        `}
      />
      {error && (
        <p className="text-[#d32f2f] text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
