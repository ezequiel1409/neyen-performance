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
    <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--bord)]">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-base text-[var(--txt)]">
            {bloque.nombre}
          </h2>
          <span className="rounded-full bg-[var(--okbg)] px-3 py-0.5 text-xs font-bold text-[var(--oktx)]">
            {bloque.tipo}
          </span>
        </div>
        <span className="text-xs text-[var(--mut)] font-medium">
          RPE objetivo del bloque: <strong>{bloque.rpeBloque}</strong>
        </span>
      </div>

      {/* Tabla de Ejercicios y Parámetros del Bloque */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead>
            <tr className="text-[var(--mut)] font-bold uppercase tracking-wider text-xs pb-2">
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
          <tbody className="divide-y divide-[var(--bord)]">
            {bloque.ejercicios.map((ej, eIdx) => (
              <tr key={eIdx}>
                <td className="py-3 px-2 font-bold text-sm text-[var(--txt)]">
                  {ej.nombre}
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.series}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'series', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] py-1.5 text-center font-bold text-xs text-[var(--txt)] outline-hidden"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.reps}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'reps', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] py-1.5 text-center font-bold text-xs text-[var(--txt)] outline-hidden"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.porcentaje}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'porcentaje', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] py-1.5 text-center font-bold text-xs text-[var(--txt)] outline-hidden"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.rir}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'rir', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] py-1.5 text-center font-bold text-xs text-[var(--txt)] outline-hidden"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.rpe}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'rpe', parseInt(e.target.value) || 0)
                    }
                    className="w-14 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] py-1.5 text-center font-bold text-xs text-[var(--txt)] outline-hidden"
                  />
                </td>
                <td className="py-3 px-2 text-center">
                  <input
                    type="number"
                    value={ej.desc}
                    onChange={(e) =>
                      onActualizarEjercicio(bIdx, eIdx, 'desc', parseInt(e.target.value) || 0)
                    }
                    className="w-16 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] py-1.5 text-center font-bold text-xs text-[var(--txt)] outline-hidden"
                  />
                </td>
                <td className="py-3 px-2 text-right font-bold text-sm text-[var(--txt)] font-mono">
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
