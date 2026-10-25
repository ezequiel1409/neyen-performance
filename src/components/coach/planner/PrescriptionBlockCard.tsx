// =====================================================================
// NEYEN ATHLETIC - TARJETA DE BLOQUE PRESCRITO EN EDITOR DE SESIÓN
// RESPONSABILIDAD ÚNICA: Renderizar tabla de prescripción de ejercicios por bloque
// =====================================================================

import React from 'react';

export interface EjercicioPrescritoItem {
  nombre: string;
  series: number;
  reps: number;
  porcentaje: number;
  rir: number;
  rpe: number;
  desc: number;
  kgCalc: number;
}

export interface BloquePrescripcionData {
  id: string;
  nombre: string;
  tipo: string;
  rpeBloque: number;
  ejercicios: EjercicioPrescritoItem[];
}

interface PrescriptionBlockCardProps {
  bloque: BloquePrescripcionData;
  bIdx: number;
  onActualizarEjercicio: (
    bIdx: number,
    eIdx: number,
    campo: 'series' | 'reps' | 'porcentaje' | 'rir' | 'rpe' | 'desc',
    valor: number
  ) => void;
}

export const PrescriptionBlockCard: React.FC<PrescriptionBlockCardProps> = ({
  bloque,
  bIdx,
  onActualizarEjercicio,
}) => {
  return (
    <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 sm:p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D5] dark:border-[#25524A]">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-[#163832] dark:text-white text-base">
            {bloque.nombre}
          </h2>
          <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-3 py-0.5 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
            {bloque.tipo}
          </span>
        </div>
        <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium">
          RPE objetivo del bloque: <strong>{bloque.rpeBloque}</strong>
        </span>
      </div>

      {/* Tabla de Ejercicios y Parámetros del Bloque */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead>
            <tr className="text-[#163832]/60 dark:text-[#9EB5B0] font-bold uppercase tracking-wider pb-2">
              <th className="py-2 px-2">EJERCICIO</th>
              <th className="py-2 px-2 text-center">SERIES</th>
              <th className="py-2 px-2 text-center">REPS</th>
              <th className="py-2 px-2 text-center">%1RM</th>
              <th className="py-2 px-2 text-center">RIR</th>
              <th className="py-2 px-2 text-center">RPE</th>
              <th className="py-2 px-2 text-center">DESC. S</th>
              <th className="py-2 px-2 text-right">KG CALC.</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {bloque.ejercicios.map((ej, eIdx) => (
              <tr key={eIdx} className="border-b border-[#E5E2D5]/50 dark:border-[#25524A]/40 last:border-b-0">
                <td className="py-3 px-2 font-bold text-sm text-[#163832] dark:text-white">
                  {ej.nombre}
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.series}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'series', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.reps}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'reps', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.porcentaje}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'porcentaje', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.rir}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'rir', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.rpe}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'rpe', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.desc}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'desc', parseInt(e.target.value) || 0)
                    }
                    className="w-16 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                  />
                </td>
                <td className="py-3 px-2 text-right font-bold text-sm text-[#163832] dark:text-white font-mono">
                  {ej.kgCalc > 0 ? `${ej.kgCalc} kg` : 'Autocarga'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
