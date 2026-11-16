// =====================================================================
// NEYIMA ATHLETIC - MODAL DE ESTADOS DEL SISTEMA (ACCESIBILIDAD WCAG)
// =====================================================================

import React from 'react';
import { Modal } from './Modal';
import { IconInterface } from './icons/IconInterface';
import { Button } from './Button';

interface SystemStatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatesModal: React.FC<SystemStatesModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Estados del sistema"
      description="Cada estado lleva ícono y texto. El rojo oscuro es solo para errores y riesgo alto."
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-sm select-none">
        {/* 1. Éxito */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 space-y-2">
          <b className="text-sm font-extrabold text-[var(--txt)] block">Éxito</b>
          <div
            role="status"
            className="rounded-xl bg-[var(--estado-ok-fondo)] text-[var(--estado-ok-texto)] p-3 flex items-center gap-2.5 font-bold text-xs"
          >
            <IconInterface name="check" size={18} strokeWidth={2.2} />
            <span className="flex-1">Test guardado. El 1RM se actualizó.</span>
          </div>
        </div>

        {/* 2. Error del sistema */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 space-y-2">
          <b className="text-sm font-extrabold text-[var(--txt)] block">
            Error del sistema (rojo de riesgo)
          </b>
          <div
            role="status"
            className="rounded-xl bg-[var(--estado-bad-fondo)] text-[var(--estado-bad-texto)] p-3 flex items-center gap-2.5 font-bold text-xs"
          >
            <IconInterface name="alert" size={18} strokeWidth={2.2} />
            <span className="flex-1">No se pudo guardar. Revisá tu conexión.</span>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg border-2 border-[var(--estado-bad-texto)] text-[var(--estado-bad-texto)] font-bold text-xs"
            >
              Reintentar
            </button>
          </div>
        </div>

        {/* 3. Sin conexión */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 space-y-2">
          <b className="text-sm font-extrabold text-[var(--txt)] block">Sin conexión</b>
          <div
            role="status"
            className="rounded-xl bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] p-3 flex items-center gap-2.5 font-bold text-xs"
          >
            <IconInterface name="alert" size={18} strokeWidth={2.2} />
            <span className="flex-1">
              Sin conexión. Tus cambios se guardan localmente y se sincronizarán al reconectar.
            </span>
          </div>
        </div>

        {/* 4. Error en un campo */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 space-y-2">
          <b className="text-sm font-extrabold text-[var(--txt)] block">Error en un campo</b>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--txt)] block">Esfuerzo (1 a 10)</label>
            <input
              value="12"
              readOnly
              aria-invalid="true"
              className="w-full h-10 rounded-xl border-2 border-[var(--estado-bad-texto)] bg-[var(--surf)] text-[var(--txt)] px-3 text-sm font-bold"
            />
            <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--estado-bad-texto)]">
              <IconInterface name="alert" size={14} strokeWidth={2.2} />
              Ingresá un número del 1 al 10.
            </span>
          </div>
        </div>

        {/* 5. Estado vacío */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 space-y-2 text-center">
          <b className="text-sm font-extrabold text-[var(--txt)] block text-left">Estado vacío</b>
          <div className="py-2 flex flex-col items-center">
            <IconInterface name="clipboard" size={32} className="text-[var(--mut)] mb-1" />
            <p className="font-extrabold text-sm text-[var(--txt)]">Todavía no hay tests</p>
            <p className="text-xs text-[var(--mut)] mb-2">Cargá el primero para calcular el 1RM.</p>
            <Button variant="primary" size="sm" className="font-bold">
              Cargar test
            </Button>
          </div>
        </div>

        {/* 6. Cargando */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 space-y-2">
          <b className="text-sm font-extrabold text-[var(--txt)] block">Cargando</b>
          <div className="space-y-2 py-2" role="status" aria-label="Cargando">
            <div className="h-3 rounded-full bg-[var(--bord)] w-4/5 animate-pulse" />
            <div className="h-3 rounded-full bg-[var(--bord)] w-full animate-pulse" />
            <div className="h-3 rounded-full bg-[var(--bord)] w-3/5 animate-pulse" />
            <div className="h-3 rounded-full bg-[var(--bord)] w-11/12 animate-pulse" />
          </div>
        </div>
      </div>
    </Modal>
  );
};
