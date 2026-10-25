import React, { useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface FieldProps {
  label: string;
  id?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    className: string;
  }) => React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  id: providedId,
  error,
  helperText,
  required = false,
  className,
  children,
}) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const describedBy = [error ? errorId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(' ');

  const defaultInputStyles =
    'w-full min-h-[44px] rounded-xl border-2 bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#1D2B24] dark:text-white placeholder-[#1D2B24]/40 dark:placeholder-[#9EB5B0]/40 focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed';

  const borderStyles = error
    ? 'border-rose-500 focus:ring-rose-500'
    : 'border-[#1D2B24] dark:border-[#244E43] hover:border-[#1D2B24]';

  return (
    <div className={twMerge('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-[#163832] dark:text-[#9EB5B0]"
        >
          {label}
          {required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
        </label>
        {required && <span className="text-[11px] text-[#163832]/60 dark:text-[#9EB5B0]">Requerido</span>}
      </div>

      {children({
        id: inputId,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': Boolean(error),
        className: twMerge(clsx(defaultInputStyles, borderStyles)),
      })}

      {helperText && !error && (
        <p id={helperId} className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-bold text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
};
