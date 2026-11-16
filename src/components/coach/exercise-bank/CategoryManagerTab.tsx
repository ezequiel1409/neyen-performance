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
        {categorias.map((c) => (
          <div
            key={c.identificadorCategoria}
            className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--bord)] bg-[var(--surf)]"
          >
            <span className="font-bold text-sm text-[var(--txt)]">
              {c.nombreCategoria}
            </span>
            <span className="text-xs text-[var(--mut)] font-mono">
              {c.identificadorCategoria}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
