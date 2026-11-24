// =====================================================================
// NEYIMA ATHLETIC - BANNER DE ALERTA ESTÁNDAR (5 ESTADOS WCAG 2.2 AA)
// =====================================================================

import React from 'react';
import { IconInterface, type IconInterfaceName } from './icons/IconInterface';
import type { StatusType } from './IndicatorStatus';

export interface AlertBannerProps {
  status: StatusType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const statusClasses: Record<StatusType, string> = {
  ok: 'bg-[var(--estado-ok-fondo)] text-[var(--estado-ok-texto)] border-[var(--estado-ok-texto)]/25',
  warn: 'bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] border-[var(--estado-warn-texto)]/25',
  proc: 'bg-[var(--estado-proc-fondo)] text-[var(--estado-proc-texto)] border-[var(--estado-proc-texto)]/25',
  neu: 'bg-[var(--estado-neu-fondo)] text-[var(--estado-neu-texto)] border-[var(--estado-neu-texto)]/25',
  bad: 'bg-[var(--estado-bad-fondo)] text-[var(--estado-bad-texto)] border-[var(--estado-bad-texto)]/25',
};

const statusIcons: Record<StatusType, IconInterfaceName> = {
  ok: 'check',
  warn: 'alert',
  proc: 'info',
  neu: 'info',
  bad: 'alert',
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  status,
  title,
  message,
  onClose,
  className = '',
}) => {
  const esUrgente = status === 'bad' || status === 'warn';

  return (
    <div
      role={esUrgente ? 'alert' : 'status'}
      aria-live={esUrgente ? 'assertive' : 'polite'}
      className={`rounded-2xl border p-3.5 flex items-start gap-2.5 text-xs font-bold shadow-2xs transition-colors ${statusClasses[status]} ${className}`}
    >
      <IconInterface
        name={statusIcons[status]}
        size={18}
        strokeWidth={2.2}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0 leading-relaxed">
        {title && <p className="font-extrabold text-xs mb-0.5">{title}</p>}
        <p className="font-bold">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer shrink-0"
        >
          <IconInterface name="x" size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
