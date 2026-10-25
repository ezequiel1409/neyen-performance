// =====================================================================
// NEYEN ATHLETIC - GESTOR DE CATEGORÍAS EN BANCO DE EJERCICIOS
// RESPONSABILIDAD ÚNICA: Crear y listar categorías de ejercicios
// =====================================================================

import React, { useState } from 'react';
import { CategoriaEjercicio } from '../../../types';

interface CategoryManagerTabProps {
  categorias: CategoriaEjercicio[];
  onAgregarCategoria: (categoria: CategoriaEjercicio) => void;
}

export const CategoryManagerTab: React.FC<CategoryManagerTabProps> = ({
  categorias,
  onAgregarCategoria,
}) => {
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');

  const handleAgregar = () => {
    if (!nuevaCatNombre.trim()) return;
    onAgregarCategoria({
      identificadorCategoria: `CAT-${Date.now()}`,
      nombreCategoria: nuevaCatNombre.trim().toUpperCase(),
      colorDistintivoHexadecimal: '#163832',
      ordenVisualizacion: categorias.length + 1,
    });
    setNuevaCatNombre('');
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nueva categoría..."
          value={nuevaCatNombre}
          onChange={(e) => setNuevaCatNombre(e.target.value)}
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
        {categorias.map((c) => (
          <div
            key={c.identificadorCategoria}
            className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630]"
          >
            <span className="font-bold text-sm text-[#163832] dark:text-white">
              {c.nombreCategoria}
            </span>
            <span className="text-xs text-[#163832]/60 dark:text-[#9EB5B0] font-mono">
              {c.identificadorCategoria}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
