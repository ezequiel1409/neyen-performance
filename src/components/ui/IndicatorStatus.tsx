import React from 'react';
import { IconInterface, type IconInterfaceName } from './icons/IconInterface';

export type StatusType = 'ok' | 'warn' | 'proc' | 'neu' | 'bad';

export interface IndicatorStatusProps {
  status: StatusType;
  label: string;
  icon?: IconInterfaceName | React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

const defaultIcons: Record<StatusType, IconInterfaceName> = {
  ok: 'check',
  warn: 'alert',
  proc: 'activity',
  neu: 'info',
  bad: 'alert',
};

const statusStyles: Record<StatusType, string> = {
  ok: 'bg-[var(--estado-ok-fondo)] text-[var(--estado-ok-texto)]',
  warn: 'bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)]',
  proc: 'bg-[var(--estado-proc-fondo)] text-[var(--estado-proc-texto)]',
  neu: 'bg-[var(--estado-neu-fondo)] text-[var(--estado-neu-texto)]',
  bad: 'bg-[var(--estado-bad-fondo)] text-[var(--estado-bad-texto)]',
};

export const IndicatorStatus: React.FC<IndicatorStatusProps> = ({
  status,
  label,
  icon,
  size = 'md',
  className = '',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1'
      : 'px-2.5 py-1 text-sm gap-1.5';

  const iconName = typeof icon === 'string' ? (icon as IconInterfaceName) : (!icon ? defaultIcons[status] : null);

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full select-none whitespace-nowrap transition-colors ${statusStyles[status]} ${sizeClasses} ${className}`}
      role="status"
    >
      {iconName ? (
        <IconInterface
          name={iconName}
          size={size === 'sm' ? 12 : 14}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{label}</span>
    </span>
  );
};
