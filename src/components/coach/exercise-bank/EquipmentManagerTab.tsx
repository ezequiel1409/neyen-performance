// =====================================================================
// NEYEN ATHLETIC - GESTOR DE EQUIPAMIENTOS EN BANCO DE EJERCICIOS
// RESPONSABILIDAD ÚNICA: Crear y listar equipamientos validados con alertas
// =====================================================================

import React, { useState } from 'react';
import { TipoEquipamiento } from '../../../types';
import { AlertBanner } from '../../ui/AlertBanner';
import type { StatusType } from '../../ui/IndicatorStatus';
import { IconInterface } from '../../ui/icons/IconInterface';

interface EquipmentManagerTabProps {
  equipamientos: TipoEquipamiento[];
  onAgregarEquipamiento: (equipamiento: TipoEquipamiento) => void;
}

const normalizar = (texto: string) =>
  texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const EquipmentManagerTab: React.FC<EquipmentManagerTabProps> = ({
  equipamientos,
  onAgregarEquipamiento,
}) => {
  const [nuevoEqNombre, setNuevoEqNombre] = useState('');
  const [errorCampo, setErrorCampo] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<{ status: StatusType; message: string } | null>(null);

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nuevoEqNombre.trim();

    if (!limpio) {
      setErrorCampo('Ingresá un nombre para el equipamiento.');
      setAlerta({ status: 'bad', message: 'El nombre del equipamiento es obligatorio.' });
      return;
    }

    if (limpio.length < 2 || limpio.length > 50) {
      setErrorCampo('Debe tener entre 2 y 50 caracteres.');
      setAlerta({ status: 'bad', message: 'El equipamiento debe tener entre 2 y 50 caracteres.' });
      return;
    }

    const existe = equipamientos.some(
      (eq) => normalizar(eq.nombreEquipamiento) === normalizar(limpio)
    );
    if (existe) {
      setErrorCampo('Este equipamiento ya existe en el catálogo.');
      setAlerta({ status: 'warn', message: `El equipamiento "${limpio}" ya está registrado.` });
      return;
    }

    onAgregarEquipamiento({
      identificadorEquipamiento: `EQ-${String(equipamientos.length + 1).padStart(2, '0')}-${Date.now().toString().slice(-3)}`,
      nombreEquipamiento: limpio,
    });
    setNuevoEqNombre('');
    setErrorCampo(null);
    setAlerta({ status: 'ok', message: `Equipamiento "${limpio}" agregado correctamente.` });
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {alerta && (
        <AlertBanner
          status={alerta.status}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      <form onSubmit={handleAgregar} noValidate className="space-y-1.5">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nuevo equipamiento (ej. Polea regulable)..."
            value={nuevoEqNombre}
            aria-label="Nombre de nuevo equipamiento"
            aria-invalid={Boolean(errorCampo)}
            onChange={(e) => {
              setNuevoEqNombre(e.target.value);
              if (errorCampo) setErrorCampo(null);
            }}
            className={`flex-1 rounded-xl border-2 bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--txt)] outline-hidden transition ${
              errorCampo
                ? 'border-[var(--estado-bad-texto)]'
                : 'border-[var(--bord)] focus:border-[var(--link)]'
            }`}
          />
          <button
            type="submit"
            className="rounded-xl bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-sm px-5 py-2.5 shadow-2xs hover:opacity-95 transition cursor-pointer"
          >
            Agregar
          </button>
        </div>

        {errorCampo && (
          <span
            role="alert"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--estado-bad-texto)]"
          >
            <IconInterface name="alert" size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{errorCampo}</span>
          </span>
        )}
      </form>

      <div className="space-y-2">
        {equipamientos.map((eq) => (
          <div
            key={eq.identificadorEquipamiento}
            className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--bord)] bg-[var(--surf)]"
          >
            <span className="font-bold text-sm text-[var(--txt)]">
              {eq.nombreEquipamiento}
            </span>
            <span className="text-xs text-[var(--mut)] font-mono">
              {eq.identificadorEquipamiento}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
