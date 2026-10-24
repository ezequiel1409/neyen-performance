// =====================================================================
// NEYEN ATHLETIC - FICHA TÉCNICA DEL ATLETA Y TESTS 1RM (COACH)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Activity,
  AlertOctagon,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Heart,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { calcularFaseCicloActual } from '../../utils/trainingMath';

export const AthleteProfileView: React.FC = () => {
  const {
    atletaActual,
    testsFuerza,
    agregarOActualizarTestFuerza,
    testsFisicos,
    ejercicios,
    resetearRetrasoMenstrual,
  } = useTraining();

  const [tabActiva, setTabActiva] = useState<'GENERAL' | 'FUERZA' | 'FISICOS' | 'CICLO'>('FUERZA');

  // Formulario nuevo test de 1RM
  const [ejercicioSeleccionadoId, setEjercicioSeleccionadoId] = useState<string>(ejercicios[0]?.identificadorEjercicio || 'EX0001');
  const [pesoInput, setPesoInput] = useState<number>(100);
  const [repsInput, setRepsInput] = useState<number>(3);

  // Cálculos de ciclo menstrual si es atleta femenina
  const infoCiclo = atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
    ? calcularFaseCicloActual(
        atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
        atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
        atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
      )
    : null;

  const testsAtleta = testsFuerza.filter((t) => t.identificadorAtleta === atletaActual.identificadorAtleta);
  const testsFisicosAtleta = testsFisicos.filter((t) => t.identificadorAtleta === atletaActual.identificadorAtleta);

  const guardarNuevoTest = (e: React.FormEvent) => {
    e.preventDefault();
    const ejercicio = ejercicios.find((ej) => ej.identificadorEjercicio === ejercicioSeleccionadoId);
    if (!ejercicio) return;

    agregarOActualizarTestFuerza({
      identificadorAtleta: atletaActual.identificadorAtleta,
      identificadorEjercicioBase: ejercicioSeleccionadoId,
      nombreEjercicioEvaluado: ejercicio.nombreEjercicio,
      pesoLevantadoKilogramos: pesoInput,
      repeticionesRealizadas: repsInput,
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      faseCicloMenstrualMomentoEvaluacion: infoCiclo?.faseActual,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner del Atleta */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-6 shadow-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={atletaActual.fotoPerfilUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={atletaActual.nombreCompleto}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md shadow-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{atletaActual.nombreCompleto}</h1>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/40">
                  {atletaActual.deportePracticado} • {atletaActual.posicionEnElCampoDeJuego}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {atletaActual.edadCronologicaAnios} años • {atletaActual.alturaCentimetros} cm •{' '}
                <span className="text-white font-semibold">{atletaActual.pesoCorporalKilogramos} kg</span> • Nivel:{' '}
                <span className="text-emerald-400 font-semibold">{atletaActual.nivelRendimientoDeportivo}</span>
              </p>
              <p className="mt-1 text-xs text-slate-300 italic">"{atletaActual.objetivoPrincipalEntrenamiento}"</p>
            </div>
          </div>

          {/* Estado de Ciclo Menstrual / Alerta RED-S para Coach */}
          {infoCiclo && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 sm:text-right">
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: infoCiclo.colorHex }} />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Día {infoCiclo.diaActualDelCiclo} • {infoCiclo.nombreFaseLegible}
                </span>
              </div>
              {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
                <div className="mt-1 flex items-center gap-1 rounded bg-rose-500/20 px-2 py-1 text-xs font-bold text-rose-300 border border-rose-500/40">
                  <AlertOctagon className="h-3.5 w-3.5" />
                  <span>ALERTA RED-S: Retraso de {atletaActual.datosCicloMenstrual.diasDeRetraso} días</span>
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400 max-w-xs">{infoCiclo.recomendacionDeportiva}</p>
              )}
            </div>
          )}
        </div>

        {/* Tabs de la Ficha Técnica */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
          <button
            onClick={() => setTabActiva('FUERZA')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tabActiva === 'FUERZA' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Tests de Fuerza (1RM Epley / Brzycki)
          </button>
          <button
            onClick={() => setTabActiva('FISICOS')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tabActiva === 'FISICOS' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Capacidades Físicas (Salto & Sprint)
          </button>
          <button
            onClick={() => setTabActiva('GENERAL')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              tabActiva === 'GENERAL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Historial de Lesiones ({atletaActual.historialLesiones.length})
          </button>
          {atletaActual.generoAtleta === 'F' && (
            <button
              onClick={() => setTabActiva('CICLO')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                tabActiva === 'CICLO' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              Ciclo Menstrual & RED-S
            </button>
          )}
        </div>
      </div>

      {/* CONTENIDO TAB 1: TESTS DE FUERZA Y RM */}
      {tabActiva === 'FUERZA' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Listado de Tests del Atleta */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Marcas Actuales y 1RM Calculado Automáticamente
              </h2>
              <span className="text-xs text-slate-400">
                Fórmula preferida:{' '}
                <span className="font-bold text-white">{atletaActual.formulaCalculoRepeticionMaximaPreferida}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {testsAtleta.map((t) => (
                <div
                  key={t.identificadorTest}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{t.fechaEvaluacion}</span>
                    {t.faseCicloMenstrualMomentoEvaluacion && (
                      <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                        {t.faseCicloMenstrualMomentoEvaluacion}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-bold text-white">{t.nombreEjercicioEvaluado}</h3>
                  <p className="text-xs text-slate-400">
                    Marca levantada:{' '}
                    <span className="font-semibold text-slate-200">
                      {t.pesoLevantadoKilogramos} kg × {t.repeticionesRealizadas} reps
                    </span>
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500">1RM Epley</span>
                      <p className="text-base font-black text-blue-400">{t.unaRepeticionMaximaEstimadaEpley} kg</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">1RM Brzycki</span>
                      <p className="text-base font-black text-indigo-400">{t.unaRepeticionMaximaEstimadaBrzycki} kg</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario rápido para Cargar Nuevo Test */}
          <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-blue-400" />
              Cargar Nuevo Test de 1RM
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Ingresá el peso y las repeticiones logradas; las fórmulas de Epley y Brzycki se calculan automáticamente.
            </p>

            <form onSubmit={guardarNuevoTest} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Ejercicio Evaluado</label>
                <select
                  value={ejercicioSeleccionadoId}
                  onChange={(e) => setEjercicioSeleccionadoId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  {ejercicios.map((ej) => (
                    <option key={ej.identificadorEjercicio} value={ej.identificadorEjercicio}>
                      {ej.nombreEjercicio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Peso (kg)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={pesoInput}
                    onChange={(e) => setPesoInput(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Repeticiones</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={repsInput}
                    onChange={(e) => setRepsInput(parseInt(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Preview de cálculo instantáneo */}
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs">
                <span className="font-semibold text-blue-400">Cálculo Automático en Vivo:</span>
                <div className="mt-1 flex justify-between">
                  <span>Epley: <strong className="text-white">{(pesoInput * (1 + repsInput / 30)).toFixed(1)} kg</strong></span>
                  <span>Brzycki: <strong className="text-white">{(pesoInput * (36 / (37 - repsInput))).toFixed(1)} kg</strong></span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Registrar Test y Actualizar 1RM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 2: CAPACIDADES FÍSICAS */}
      {tabActiva === 'FISICOS' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Evaluaciones de Salto, Velocidad y Capacidad Aeróbica
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testsFisicosAtleta.map((tf) => (
              <React.Fragment key={tf.identificadorTest}>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <span className="text-xs text-slate-400">Salto Contramovimiento (CMJ)</span>
                  <p className="mt-1 text-2xl font-black text-amber-400">{tf.saltoContramovimientoCentimetros} cm</p>
                  <span className="text-[11px] text-slate-500">Reactividad elástica</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <span className="text-xs text-slate-400">Salto Squat (SJ)</span>
                  <p className="mt-1 text-2xl font-black text-amber-400">{tf.saltoDesdeSentadillaCentimetros} cm</p>
                  <span className="text-[11px] text-slate-500">Fuerza explosiva concéntrica pura</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <span className="text-xs text-slate-400">Sprint 10 Metros</span>
                  <p className="mt-1 text-2xl font-black text-blue-400">{tf.velocidadSprintDiezMetrosSegundos} s</p>
                  <span className="text-[11px] text-slate-500">Aceleración inicial</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <span className="text-xs text-slate-400">Test de Cooper (12 min)</span>
                  <p className="mt-1 text-2xl font-black text-emerald-400">{tf.testResistenciaAerobicaCooperMetros} m</p>
                  <span className="text-[11px] text-slate-500">Consumo de Oxígeno estimado</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 3: LESIONES */}
      {tabActiva === 'GENERAL' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              Historial Clínico y Limitaciones de Movimiento
            </h2>
          </div>

          <div className="space-y-3">
            {atletaActual.historialLesiones.map((lesion) => (
              <div
                key={lesion.identificadorLesion}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{lesion.descripcionLesion}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      lesion.estadoLesion === 'ACTIVA'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : lesion.estadoLesion === 'EN_REHABILITACION'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {lesion.estadoLesion}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Zona afectada: <span className="text-slate-200">{lesion.zonaCorporalAfectada}</span> • Diagnosticada: {lesion.fechaDiagnostico}</p>
                {lesion.limitacionesDeMovimiento && (
                  <div className="mt-2 rounded-lg bg-slate-950/60 p-2 text-xs text-rose-300 border border-rose-500/20">
                    <strong>Limitación técnica:</strong> {lesion.limitacionesDeMovimiento}
                  </div>
                )}
                {lesion.observacionesMedicas && (
                  <p className="mt-1 text-xs text-slate-400 italic">Nota médica: {lesion.observacionesMedicas}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 4: FISIOLOGÍA FEMENINA & RETRASO */}
      {tabActiva === 'CICLO' && infoCiclo && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-400" />
              Monitoreo del Ciclo Menstrual y Prevención de RED-S
            </h2>
            {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual && (
              <button
                onClick={() => resetearRetrasoMenstrual(atletaActual.identificadorAtleta)}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Resetear Ciclo (Llegó período)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">Día del Ciclo</span>
              <p className="mt-1 text-3xl font-black text-rose-400">Día {infoCiclo.diaActualDelCiclo}</p>
              <span className="text-xs text-slate-500">De {atletaActual.datosCicloMenstrual?.duracionPromedioCicloDias} días</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">Fase Fisiológica</span>
              <p className="mt-1 text-lg font-black text-white">{infoCiclo.nombreFaseLegible}</p>
              <span className="text-xs text-slate-400">{infoCiclo.recomendacionDeportiva}</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs text-slate-400">Estado de Regularidad</span>
              {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
                <div className="mt-1">
                  <p className="text-lg font-black text-rose-400">RETRASO NOTIFICADO</p>
                  <p className="text-xs text-rose-300">Retraso de {atletaActual.datosCicloMenstrual.diasDeRetraso} días. Monitorear ingesta calórica y estrés.</p>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-lg font-black text-emerald-400">CICLO REGULAR</p>
                  <p className="text-xs text-slate-400">Predicción automática activa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
