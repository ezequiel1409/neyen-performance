import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'arena' | 'danger';
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
      'inline-flex items-center justify-center font-bold transition-all rounded-xl select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2 active:scale-[0.98]';

    const sizeStyles = {
      // Garantiza mínimo 44px de área táctil según WCAG 2.2 AA (Criterio 2.5.8)
      sm: 'min-h-[44px] px-3.5 py-2 text-xs gap-1.5',
      md: 'min-h-[48px] px-5 py-2.5 text-sm gap-2',
      lg: 'min-h-[52px] px-6 py-3.5 text-base gap-2.5',
    };

    // Regla de color NEYIMA: Acción principal burdeos con texto claro (claro) o crema con texto burdeos (oscuro)
    const variantStyles = {
      primary:
        'bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 shadow-xs',
      secondary:
        'bg-transparent border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--surf)]',
      outline:
        'bg-transparent border-2 border-[var(--bord)] text-[var(--txt)] hover:bg-[var(--surf)]',
      ghost:
        'bg-transparent hover:bg-[var(--surf)] text-[var(--txt)]',
      arena:
        'bg-[var(--arena)] text-[var(--tinta)] hover:opacity-95 shadow-xs',
      danger:
        'bg-[var(--estado-bad-fondo)] text-[var(--estado-bad-texto)] border border-[var(--estado-bad-texto)]/20 hover:opacity-90',
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
