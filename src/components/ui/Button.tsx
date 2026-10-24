import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition rounded-xl select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 active:scale-[0.98]';

    const sizeStyles = {
      // Garantiza mínimo 44px de área táctil (WCAG 2.2 AA)
      sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs gap-1.5',
      md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-sm gap-2',
      lg: 'min-h-[48px] min-w-[48px] px-6 py-3.5 text-base gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:bg-blue-700',
      secondary:
        'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:bg-slate-750',
      emerald:
        'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 active:brightness-95',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:bg-rose-700',
      ghost:
        'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white',
      outline:
        'bg-transparent hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={twMerge(
          clsx(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            fullWidth && 'w-full',
            className
          )
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
