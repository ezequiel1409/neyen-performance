// =====================================================================
// NEYEN ATHLETIC - BARRA DE FILTROS DEL BANCO DE EJERCICIOS
// RESPONSABILIDAD ÚNICA: Búsqueda y filtrado por categoría y equipamiento
// =====================================================================

import React from 'react';
import { CategoriaEjercicio, TipoEquipamiento } from '../../../types';

interface ExerciseFiltersBarProps {
  terminoBusqueda: string;
  setTerminoBusqueda: (busqueda: string) => void;
  filtroCategoria: string;
  setFiltroCategoria: (cat: string) => void;
  filtroEquipamiento: string;
  setFiltroEquipamiento: (eq: string) => void;
  categorias: CategoriaEjercicio[];
  equipamientos: TipoEquipamiento[];
}

export const ExerciseFiltersBar: React.FC<ExerciseFiltersBarProps> = ({
  terminoBusqueda,
  setTerminoBusqueda,
  filtroCategoria,
  setFiltroCategoria,
  filtroEquipamiento,
  setFiltroEquipamiento,
  categorias,
  equipamientos,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
          Buscar
        </label>
        <input
          type="text"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          placeholder="Buscar ejercicio..."
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white placeholder-[#163832]/40 dark:placeholder-[#9EB5B0]/40 focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
          Categoría
        </label>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] cursor-pointer"
        >
          <option value="TODAS">Todas</option>
          {categorias.map((c) => (
            <option key={c.identificadorCategoria} value={c.identificadorCategoria}>
              {c.nombreCategoria}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
          Equipamiento
        </label>
        <select
          value={filtroEquipamiento}
          onChange={(e) => setFiltroEquipamiento(e.target.value)}
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] cursor-pointer"
        >
          <option value="TODOS">Todos</option>
          {equipamientos.map((eq) => (
            <option key={eq.identificadorEquipamiento} value={eq.identificadorEquipamiento}>
              {eq.nombreEquipamiento}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
