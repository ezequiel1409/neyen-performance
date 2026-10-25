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
          className="flex-1 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white"
        />
        <button
          type="button"
          onClick={handleAgregar}
          className="rounded-2xl bg-[#2F6B4F] text-white font-extrabold text-sm px-6 py-2.5 shadow-md hover:bg-[#265740] transition"
        >
          Agregar
        </button>
      </div>

      <div className="space-y-2">
        {equipamientos.map((eq) => (
          <div
            key={eq.identificadorEquipamiento}
            className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630]"
          >
            <span className="font-bold text-sm text-[#163832] dark:text-white">
              {eq.nombreEquipamiento}
            </span>
            <span className="text-xs text-[#163832]/60 dark:text-[#9EB5B0] font-mono">
              {eq.identificadorEquipamiento}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
