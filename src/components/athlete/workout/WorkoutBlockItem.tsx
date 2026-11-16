// =====================================================================
// NEYIMA ATHLETIC - ITEM DE BLOQUE DE ENTRENAMIENTO v2
// RESPONSABILIDAD ÚNICA: Renderizar un bloque de ejercicios con cálculo de 1RM
// =====================================================================

import React from 'react';
import {
  BloqueEjercicioPlan,
  Ejercicio,
  EjercicioPrescritoEnBloque,
  FaseCicloMenstrual,
  TestFuerzaMaxima,
} from '../../../types';
import { calcularCargaPrescrita } from '../../../utils/trainingMath';

export interface SerieRealData {
  pesoKg: number;
  reps: number;
  completada: boolean;
}

interface WorkoutBlockItemProps {
  bloque: BloqueEjercicioPlan;
  bIdx: number;
  ejercicios: Ejercicio[];
  testsFuerza: TestFuerzaMaxima[];
  atletaId: string;
  faseCicloActual?: FaseCicloMenstrual;
  seriesReales: Record<string, SerieRealData>;
  onActualizarSerie: (serieKey: string, campo: 'pesoKg' | 'reps', valor: number) => void;
  onSolicitarCambioEjercicio: (nombreEjercicio: string) => void;
}

export const WorkoutBlockItem: React.FC<WorkoutBlockItemProps> = ({
  bloque,
  bIdx,
  ejercicios,
  testsFuerza,
  atletaId,
  faseCicloActual,
  seriesReales,
  onActualizarSerie,
  onSolicitarCambioEjercicio,
}) => {
  return (
    <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 space-y-3 shadow-xs">
      {/* Encabezado del Bloque */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--bord)]">
        <h2 className="font-extrabold text-[var(--txt)] text-base">
          {`Bloque ${String.fromCharCode(65 + bIdx)} · ${bloque.nombreBloque}`}
        </h2>
        <span className="rounded-full bg-[var(--okbg)] text-[var(--oktx)] px-3 py-0.5 text-xs font-bold whitespace-nowrap">
          {bloque.tipoEstructura === 'SERIE_SIMPLE' ? 'Serie simple' : 'Biserie'}
        </span>
      </div>

      {/* Lista de ejercicios del bloque */}
      <div className="space-y-3.5">
        {bloque.ejerciciosPrescritos.map((item: EjercicioPrescritoEnBloque, eIdx: number) => {
          const ej = ejercicios.find(
            (e) => e.identificadorEjercicio === item.identificadorEjercicio
          );
          const testBaseId =
            ej?.identificadorEjercicioBaseTestReferencia || ej?.identificadorEjercicio;
          const testAtleta = testsFuerza.find(
            (t) =>
              t.identificadorAtleta === atletaId &&
              t.identificadorEjercicioBase === testBaseId
          );
          const unRM = testAtleta?.unaRepeticionMaximaEfectiva || 0;

          const primeraSerie = item.seriesPrescritas[0];
          const calculo = calcularCargaPrescrita({
            unRepeticionMaximaKg: unRM,
            porcentajeUnaRepeticionMaxima: primeraSerie?.porcentajeUnaRepeticionMaxima || 0.75,
            ratioConversionCarga: ej?.ratioConversionCargaPorcentual || 1.0,
            faseCicloMenstrual: faseCicloActual,
            aplicarAjusteHormonal: true,
          });

          const serieKey = `${item.identificadorEjercicio}_1`;
          const serieData = seriesReales[serieKey] || {
            pesoKg: calculo.pesoFinalKg,
            reps: primeraSerie?.repeticionesPrescritas || 8,
            completada: false,
          };

          return (
            <div
              key={eIdx}
              className="space-y-3 pb-3 border-b border-[var(--bord)] last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-[var(--txt)] text-base">
                    {bloque.tipoEstructura !== 'SERIE_SIMPLE' && `${String.fromCharCode(65 + bIdx)}${eIdx + 1} · `}
                    {ej?.nombreEjercicio || `[Ejercicio ${eIdx + 1}]`}
                  </h3>
                  <p className="text-sm text-[var(--mut)] font-medium mt-0.5">
                    {item.seriesPrescritas.length} × {primeraSerie?.repeticionesPrescritas || 8} ·{' '}
                    <b className="text-[var(--txt)]">{calculo.pesoFinalKg} kg</b> · desc.{' '}
                    {primeraSerie?.tiempoDescansoEntreSeriesSegundos || 90} s
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSolicitarCambioEjercicio(ej?.nombreEjercicio || 'ejercicio')}
                  className="rounded-xl border-2 border-[var(--link)] px-3.5 py-1.5 font-bold text-sm text-[var(--link)] bg-transparent hover:bg-[var(--bg)] active:scale-95 transition cursor-pointer"
                >
                  Cambiar
                </button>
              </div>

              {/* Inputs de Kilos reales y Reps reales */}
              {eIdx === 0 && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[var(--txt)] mb-1">
                      Kilos reales
                    </label>
                    <input
                      type="number"
                      value={serieData.pesoKg}
                      onChange={(e) =>
                        onActualizarSerie(
                          serieKey,
                          'pesoKg',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full h-12 rounded-xl border-2 border-[var(--link)] bg-[var(--surf)] p-2.5 text-center font-bold text-lg text-[var(--txt)] focus:outline-none"
                      placeholder="00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--txt)] mb-1">
                      Reps reales
                    </label>
                    <input
                      type="number"
                      value={serieData.reps}
                      onChange={(e) =>
                        onActualizarSerie(
                          serieKey,
                          'reps',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full h-12 rounded-xl border-2 border-[var(--link)] bg-[var(--surf)] p-2.5 text-center font-bold text-lg text-[var(--txt)] focus:outline-none"
                      placeholder="8"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
