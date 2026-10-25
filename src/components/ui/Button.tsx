import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'coral' | 'danger' | 'ghost' | 'outline' | 'arena';
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
      'inline-flex items-center justify-center font-bold transition rounded-2xl select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#1F5FA0] focus-visible:outline-offset-2 active:scale-[0.98]';

    const sizeStyles = {
      // Garantiza mínimo 44px de área táctil (WCAG 2.2 AA)
      sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs gap-1.5',
      md: 'min-h-[48px] min-w-[48px] px-5 py-2.5 text-sm gap-2',
      lg: 'min-h-[52px] min-w-[48px] px-6 py-3.5 text-base gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-[#2F6B4F] hover:bg-[#265740] text-white shadow-sm',
      secondary:
        'bg-white dark:bg-[#15332B] border-2 border-[#2F6B4F] text-[#2F6B4F] dark:text-[#FAF7EE] hover:bg-[#E3EFE7]/40',
      arena:
        'bg-[#F4C98B] hover:bg-[#E8BC7E] text-[#1D2B24] font-extrabold shadow-sm',
      coral:
        'bg-[#2F6B4F] hover:bg-[#265740] text-white font-extrabold shadow-sm',
      emerald:
        'bg-[#2F6B4F] hover:bg-[#265740] text-white shadow-sm',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:bg-rose-700',
      ghost:
        'bg-transparent hover:bg-[#E3EFE7]/40 text-[#1D2B24] dark:text-[#FAF7EE]',
      outline:
        'bg-transparent border-2 border-[#2F6B4F] text-[#2F6B4F] dark:text-[#FAF7EE] hover:bg-[#E3EFE7]/40',
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
