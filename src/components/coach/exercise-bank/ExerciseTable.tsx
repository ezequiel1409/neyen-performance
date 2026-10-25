// =====================================================================
// NEYEN ATHLETIC - TABLA DEL BANCO DE EJERCICIOS
// RESPONSABILIDAD ÚNICA: Renderizar listado tabular de ejercicios y selección
// =====================================================================

import React from 'react';
import { CategoriaEjercicio, Ejercicio, TipoEquipamiento } from '../../../types';

interface ExerciseTableProps {
  ejercicios: Ejercicio[];
  categorias: CategoriaEjercicio[];
  equipamientos: TipoEquipamiento[];
  ejercicioSeleccionadoId: string;
  onSeleccionarEjercicio: (ejercicio: Ejercicio) => void;
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
  ejercicios,
  categorias,
  equipamientos,
  ejercicioSeleccionadoId,
  onSeleccionarEjercicio,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#E5E2D5] dark:border-[#25524A] text-[#163832]/60 dark:text-[#9EB5B0] font-bold uppercase tracking-wider">
            <th className="py-3 px-3">EJERCICIO</th>
            <th className="py-3 px-3">CATEGORÍA</th>
            <th className="py-3 px-3">EQUIPAMIENTO</th>
            <th className="py-3 px-3">TEST BASE</th>
            <th className="py-3 px-3 text-right">RATIO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E2D5]/70 dark:divide-[#25524A]/50">
          {ejercicios.map((ej) => {
            const cat = categorias.find((c) => c.identificadorCategoria === ej.identificadorCategoria);
            const eq = equipamientos.find((e) => e.identificadorEquipamiento === ej.identificadorEquipamiento);
            const ejBase = ej.identificadorEjercicioBaseTestReferencia
              ? ejercicios.find((b) => b.identificadorEjercicio === ej.identificadorEjercicioBaseTestReferencia)
              : null;

            const isSelected = ej.identificadorEjercicio === ejercicioSeleccionadoId;

            return (
              <tr
                key={ej.identificadorEjercicio}
                onClick={() => onSeleccionarEjercicio(ej)}
                className={`cursor-pointer transition ${
                  isSelected
                    ? 'border-2 border-[#163832] dark:border-[#2F6B4F] bg-white dark:bg-[#163630] font-bold shadow-sm'
                    : 'hover:bg-[#E1ECE5]/40 text-[#163832] dark:text-[#FAF7EE]'
                }`}
              >
                <td className="py-3.5 px-3 font-bold text-[#163832] dark:text-white">
                  {ej.nombreEjercicio}
                </td>
                <td className="py-3.5 px-3 text-[#163832]/80 dark:text-[#9EB5B0]">
                  {cat?.nombreCategoria || '[Categoría]'}
                </td>
                <td className="py-3.5 px-3 text-[#163832]/80 dark:text-[#9EB5B0]">
                  {eq?.nombreEquipamiento || '[Equipamiento]'}
                </td>
                <td className="py-3.5 px-3 text-[#163832]/80 dark:text-[#9EB5B0]">
                  {ejBase ? `[${ejBase.nombreEjercicio}]` : '—'}
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-[#163832] dark:text-white">
                  {ej.ratioConversionCargaPorcentual
                    ? ej.ratioConversionCargaPorcentual.toFixed(2).replace('.', ',')
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
