// =====================================================================
// NEYEN ATHLETIC - PLANIFICADOR JERÁRQUICO Y AUTOCÁLCULO DE %1RM (COACH)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Dumbbell,
  Eye,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';

export const PeriodizationPlannerView: React.FC = () => {
  const { macrociclo, atletaActual, testsFuerza, ejercicios } = useTraining();

  const [mesoSeleccionadoIndex, setMesoSeleccionadoIndex] = useState<number>(0);
  const [sesionSeleccionadaIndex, setSesionSeleccionadaIndex] = useState<number>(0);

  // Estados del simulador interactivo de cálculo de carga
  const [ejercicioSimuladorId, setEjercicioSimuladorId] = useState<string>('EX0001'); // Sentadilla trasera
  const [porcentajeSimulador, setPorcentajeSimulador] = useState<number>(75);
  const [repsSimulador, setRepsSimulador] = useState<number>(5);

  const mesoActivo = macrociclo.mesociclos[mesoSeleccionadoIndex] || macrociclo.mesociclos[0];
  const microActivo = mesoActivo?.microciclos[0];
  const sesionActiva = microActivo?.sesionesDeEntrenamiento[sesionSeleccionadaIndex] || microActivo?.sesionesDeEntrenamiento[0];

  // Cálculo de fase de ciclo de la atleta
  const infoCiclo = atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
    ? calcularFaseCicloActual(
        atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
        atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
        atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
      )
    : null;

  // Encontrar 1RM del ejercicio simulado
  const ejercicioSim = ejercicios.find((e) => e.identificadorEjercicio === ejercicioSimuladorId);
  const ejercicioTestBaseId = ejercicioSim?.identificadorEjercicioBaseTestReferencia || ejercicioSim?.identificadorEjercicio;
  const testBase = testsFuerza.find(
    (t) => t.identificadorAtleta === atletaActual.identificadorAtleta && t.identificadorEjercicioBase === ejercicioTestBaseId
  );
  const unRMTeorico = testBase?.unaRepeticionMaximaEfectiva || 100; // default 100 si no testeó

  const calculoCargaSimulada = calcularCargaPrescrita({
    unRepeticionMaximaKg: unRMTeorico,
    porcentajeUnaRepeticionMaxima: porcentajeSimulador,
    ratioConversionCarga: ejercicioSim?.ratioConversionCargaPorcentual || 1.0,
    faseCicloMenstrual: infoCiclo?.faseActual,
    aplicarAjusteHormonal: true,
  });

  return (
    <div className="space-y-6">
      {/* Cabecera del Macrociclo */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                MACROCICLO ANUAL
              </span>
              <h1 className="text-xl font-black text-white">{macrociclo.nombreMacrociclo}</h1>
            </div>
            <p className="mt-1 text-sm text-slate-300 font-medium">
              🎯 Objetivo General: <span className="text-white italic">"{macrociclo.objetivoGeneralMacrociclo}"</span>
            </p>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-3">
              <span>📅 {macrociclo.fechaInicioMacrociclo} al {macrociclo.fechaFinMacrociclo}</span>
              <span>⏱️ {macrociclo.duracionTotalSemanas} Microciclos (Semanas)</span>
              <span>⚡ RPE Promedio Objetivo: {macrociclo.esfuerzoPercibidoPromedioObjetivoDelMacrociclo}/10</span>
            </p>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-right">
            <span className="text-[11px] font-bold text-blue-300 uppercase">Atleta Asignado</span>
            <p className="text-sm font-black text-white">{atletaActual.nombreCompleto}</p>
            <span className="text-xs text-blue-400">Autocálculo activo para sus tests</span>
          </div>
        </div>

        {/* Demostración: Salto de Mesociclo */}
        {macrociclo.microciclosDirectos && macrociclo.microciclosDirectos.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
            <span>
              <strong>Flexibilidad Jerárquica:</strong> Contiene {macrociclo.microciclosDirectos.length} microciclo(s) directo(s) que se saltan el mesociclo (ej. "{macrociclo.microciclosDirectos[0].nombreMicrociclo}").
            </span>
          </div>
        )}
      </div>

      {/* Selector de Mesociclos */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-400" />
          Mesociclos del Plan (Segmentación de Objetivos)
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {macrociclo.mesociclos.map((meso, idx) => (
            <button
              key={meso.identificadorMesociclo}
              onClick={() => {
                setMesoSeleccionadoIndex(idx);
                setSesionSeleccionadaIndex(0);
              }}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                mesoSeleccionadoIndex === idx
                  ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {meso.tipoPeriodizacionMesociclo} • {meso.duracionTotalSemanas} Semanas
                </span>
                <h3 className="mt-1 font-bold text-white text-sm">{meso.nombreMesociclo}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{meso.objetivoSegmentadoMesociclo}</p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                <span>RPE Objetivo: {meso.esfuerzoPercibidoObjetivoDelMesociclo}/10</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor de Sesión y Bloques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Detalle de la Sesión Activa */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-emerald-400" />
                {sesionActiva ? sesionActiva.nombreSesion : 'Sesión de Entrenamiento'}
              </h2>
              <p className="text-xs text-slate-400">
                {sesionActiva?.objetivoEspecificoSesion} • RPE de Sesión: {sesionActiva?.esfuerzoPercibidoObjetivoDeLaSesion}/10
              </p>
            </div>
            <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-300">
              ~{sesionActiva?.duracionEstimadaMinutos} min
            </span>
          </div>

          {/* Bloques de Ejercicios */}
          <div className="space-y-4">
            {sesionActiva?.bloquesDeEjercicios.map((bloque) => (
              <div
                key={bloque.identificadorBloque}
                className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                      {bloque.tipoEstructura.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-white text-sm">{bloque.nombreBloque}</h3>
                  </div>
                  <span className="text-xs text-slate-400">RPE Bloque: {bloque.esfuerzoPercibidoObjetivoDelBloque}/10</span>
                </div>

                {bloque.ejerciciosPrescritos.map((item, itemIdx) => {
                  const ejData = ejercicios.find((e) => e.identificadorEjercicio === item.identificadorEjercicio);
                  // Encontrar test de 1RM de este ejercicio o su ejercicio base
                  const baseId = ejData?.identificadorEjercicioBaseTestReferencia || ejData?.identificadorEjercicio;
                  const testAtleta = testsFuerza.find(
                    (t) => t.identificadorAtleta === atletaActual.identificadorAtleta && t.identificadorEjercicioBase === baseId
                  );
                  const unRMAtleta = testAtleta?.unaRepeticionMaximaEfectiva || 0;

                  return (
                    <div key={itemIdx} className="rounded-lg bg-slate-950/60 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{ejData?.nombreEjercicio}</span>
                        {unRMAtleta > 0 && (
                          <span className="text-xs font-mono text-emerald-400">
                            1RM Ref: {unRMAtleta} kg {ejData?.ratioConversionCargaPorcentual ? `(Ratio ${Math.round(ejData.ratioConversionCargaPorcentual * 100)}%)` : ''}
                          </span>
                        )}
                      </div>

                      {item.indicacionesTecnicas && (
                        <p className="text-[11px] text-slate-400 italic">💡 {item.indicacionesTecnicas}</p>
                      )}

                      {/* Tabla de Series Prescritas con Autocálculo de Kilos */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500">
                              <th className="py-1">Serie</th>
                              <th>Reps</th>
                              <th>Prescripción</th>
                              <th>RIR</th>
                              <th>Kilos Calculados</th>
                              <th>Pausa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono">
                            {item.seriesPrescritas.map((s) => {
                              const calculo = calcularCargaPrescrita({
                                unRepeticionMaximaKg: unRMAtleta,
                                porcentajeUnaRepeticionMaxima: s.porcentajeUnaRepeticionMaxima,
                                ratioConversionCarga: ejData?.ratioConversionCargaPorcentual || 1.0,
                                faseCicloMenstrual: infoCiclo?.faseActual,
                                aplicarAjusteHormonal: true,
                              });

                              return (
                                <tr key={s.numeroDeSerie} className="text-slate-300">
                                  <td className="py-1.5 font-bold text-white">#{s.numeroDeSerie}</td>
                                  <td>{s.repeticionesPrescritas} reps</td>
                                  <td className="text-blue-400">{s.porcentajeUnaRepeticionMaxima ? `${s.porcentajeUnaRepeticionMaxima}% 1RM` : 'Libre'}</td>
                                  <td className="text-slate-400">{s.repeticionesEnReservaObjetivo ? `RIR ${s.repeticionesEnReservaObjetivo}` : '-'}</td>
                                  <td>
                                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/30">
                                      {calculo.pesoFinalKg > 0 ? `${calculo.pesoFinalKg} kg` : 'Autocarga'}
                                    </span>
                                  </td>
                                  <td className="text-slate-500">{s.tiempoDescansoEntreSeriesSegundos}s</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Panel Simulador de Autocálculo de Carga en Tiempo Real */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-blue-950/40 p-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Simulador del Motor de Carga en Vivo
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Probá cómo se calcula cualquier porcentaje para <strong className="text-white">{atletaActual.nombreCompleto}</strong>.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Seleccionar Ejercicio</label>
                <select
                  value={ejercicioSimuladorId}
                  onChange={(e) => setEjercicioSimuladorId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  {ejercicios.map((ej) => (
                    <option key={ej.identificadorEjercicio} value={ej.identificadorEjercicio}>
                      {ej.nombreEjercicio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Intensidad Prescrita (%1RM)</span>
                  <span className="text-blue-400 font-bold">{porcentajeSimulador}% 1RM</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="2.5"
                  value={porcentajeSimulador}
                  onChange={(e) => setPorcentajeSimulador(parseFloat(e.target.value))}
                  className="mt-1 w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Resultado del Cálculo */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">1RM Base Registrado:</span>
                  <span className="font-mono text-sm font-bold text-white">{unRMTeorico} kg</span>
                </div>

                {ejercicioSim?.ratioConversionCargaPorcentual && (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Ratio de Conversión (Accesorio):</span>
                    <span className="font-mono text-white">
                      × {ejercicioSim.ratioConversionCargaPorcentual} ({Math.round(ejercicioSim.ratioConversionCargaPorcentual * 100)}%)
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Peso Teórico ({porcentajeSimulador}%):</span>
                  <span className="font-mono text-white">{calculoCargaSimulada.pesoBaseTeoricoKg} kg</span>
                </div>

                {calculoCargaSimulada.ajusteHormonalAplicadoPorcentaje !== 0 && (
                  <div className="rounded-lg bg-rose-500/10 p-2 text-xs text-rose-300 border border-rose-500/30">
                    <span className="font-bold">Ajuste Hormonal Automático:</span> {calculoCargaSimulada.ajusteHormonalAplicadoPorcentaje}%
                    <p className="text-[11px] text-rose-200 mt-0.5">{calculoCargaSimulada.mensajeAjuste}</p>
                  </div>
                )}

                <div className="rounded-xl bg-blue-600/20 border border-blue-500/40 p-3 text-center">
                  <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                    Carga Automática a Cargar en la Barra:
                  </span>
                  <p className="mt-1 text-3xl font-black text-white font-mono">
                    {calculoCargaSimulada.pesoFinalKg} kg
                  </p>
                  <span className="text-[11px] text-slate-400">Redondeado a los 0.5 kg más cercanos para discos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
