// =====================================================================
// NEYEN ATHLETIC - GESTOR DE EQUIPAMIENTOS EN BANCO DE EJERCICIOS
// RESPONSABILIDAD ÚNICA: Crear y listar tipos de equipamientos
// =====================================================================

import React, { useState } from 'react';
import { TipoEquipamiento } from '../../../types';

interface EquipmentManagerTabProps {
  equipamientos: TipoEquipamiento[];
  onAgregarEquipamiento: (equipamiento: TipoEquipamiento) => void;
}

export const EquipmentManagerTab: React.FC<EquipmentManagerTabProps> = ({
  equipamientos,
  onAgregarEquipamiento,
}) => {
  const [nuevoEqNombre, setNuevoEqNombre] = useState('');

  const handleAgregar = () => {
    if (!nuevoEqNombre.trim()) return;
    onAgregarEquipamiento({
      identificadorEquipamiento: `EQ-${Date.now()}`,
      nombreEquipamiento: nuevoEqNombre.trim(),
    });
    setNuevoEqNombre('');
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nuevo equipamiento..."
          value={nuevoEqNombre}
          onChange={(e) => setNuevoEqNombre(e.target.value)}
          className="flex-1 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--txt)] focus:border-[var(--link)] outline-hidden"
        />
        <button
          type="button"
          onClick={handleAgregar}
          className="rounded-xl bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-sm px-5 py-2.5 shadow-2xs hover:opacity-95 transition cursor-pointer"
        >
          Agregar
        </button>
      </div>

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
