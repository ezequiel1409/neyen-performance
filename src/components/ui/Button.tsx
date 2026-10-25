import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'coral' | 'danger' | 'ghost' | 'outline';
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
      'inline-flex items-center justify-center font-bold transition rounded-2xl select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#E85938] focus-visible:outline-offset-2 active:scale-[0.98]';

    const sizeStyles = {
      // Garantiza mínimo 44px de área táctil (WCAG 2.2 AA)
      sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs gap-1.5',
      md: 'min-h-[44px] min-w-[44px] px-5 py-2.5 text-sm gap-2',
      lg: 'min-h-[50px] min-w-[48px] px-6 py-3.5 text-base gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-[#163832] dark:bg-[#E85938] hover:bg-[#1f4e46] dark:hover:bg-[#d74f30] text-white dark:text-[#112B26] shadow-sm',
      coral:
        'bg-[#E85938] hover:bg-[#D74F30] text-[#112B26] font-extrabold shadow-md shadow-[#E85938]/20',
      secondary:
        'bg-white dark:bg-[#163630] border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-[#FAF7EE] hover:bg-[#E1ECE5]/40',
      emerald:
        'bg-[#163832] dark:bg-[#E85938] hover:bg-[#1f4e46] dark:hover:bg-[#d74f30] text-white dark:text-[#112B26]',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:bg-rose-700',
      ghost:
        'bg-transparent hover:bg-[#E1ECE5]/40 text-[#163832] dark:text-[#FAF7EE]',
      outline:
        'bg-transparent border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-[#FAF7EE] hover:bg-[#E1ECE5]/40',
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
        {icon && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
