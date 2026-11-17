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
    'w-full min-h-[44px] rounded-xl border-2 bg-[var(--surf)] px-3.5 py-2.5 text-sm text-[var(--txt)] placeholder-[var(--mut)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed';

  const borderStyles = error
    ? 'border-[var(--estado-bad-texto)] focus:ring-[var(--estado-bad-texto)]'
    : 'border-[var(--field)] hover:border-[var(--txt)]';

  return (
    <div className={twMerge('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-[var(--txt)]"
        >
          {label}
          {required && <span className="ml-1 text-[var(--estado-bad-texto)]" aria-hidden="true">*</span>}
        </label>
        {required && <span className="text-xs text-[var(--mut)]">Requerido</span>}
      </div>

      {children({
        id: inputId,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': Boolean(error),
        className: twMerge(clsx(defaultInputStyles, borderStyles)),
      })}

      {helperText && !error && (
        <p id={helperId} className="text-xs text-[var(--mut)]">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-bold text-[var(--estado-bad-texto)]">
          {error}
        </p>
      )}
    </div>
  );
};
