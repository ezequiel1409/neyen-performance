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
    <div className="overflow-x-auto bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-2">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--bord)] text-[var(--mut)] font-bold uppercase tracking-wider text-xs">
            <th className="py-2.5 px-3">EJERCICIO</th>
            <th className="py-2.5 px-3">CATEGORÍA</th>
            <th className="py-2.5 px-3">EQUIPAMIENTO</th>
            <th className="py-2.5 px-3">TEST BASE</th>
            <th className="py-2.5 px-3 text-right">RATIO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--bord)]">
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
                    ? 'bg-[var(--bg)] font-bold shadow-2xs'
                    : 'hover:bg-[var(--bg)]/50 text-[var(--txt)]'
                }`}
              >
                <td className="py-3 px-3 font-bold text-[var(--txt)]">
                  {ej.nombreEjercicio}
                </td>
                <td className="py-3 px-3 text-[var(--mut)]">
                  {cat?.nombreCategoria || '[Categoría]'}
                </td>
                <td className="py-3 px-3 text-[var(--mut)]">
                  {eq?.nombreEquipamiento || '[Equipamiento]'}
                </td>
                <td className="py-3 px-3 text-[var(--mut)]">
                  {ejBase ? `[${ejBase.nombreEjercicio}]` : '—'}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-[var(--txt)]">
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
