import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Guardar elemento enfocado antes de abrir y restaurarlo al cerrar
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejo de Escape y Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Foco inicial en el modal al abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        modalRef.current.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full h-full rounded-none',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={twMerge(
          clsx(
            'w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative my-auto max-h-[90vh] flex flex-col',
            maxWidthStyles[maxWidth]
          )
        )}
      >
        {/* Cabecera accesible */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4 gap-4">
          <div className="space-y-1">
            <h2 id="modal-title" className="text-lg font-black tracking-tight text-white">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-xs text-slate-400">
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Cuerpo del modal con scroll interno si desborda */}
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};

