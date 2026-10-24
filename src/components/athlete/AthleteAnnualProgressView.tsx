// =====================================================================
// NEYEN ATHLETIC - DASHBOARD DE PROGRESO ANUAL DEL ALUMNO
// =====================================================================

import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Award,
  Calendar,
  CheckCircle,
  Dumbbell,
  Flame,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const AthleteAnnualProgressView: React.FC = () => {
  const { atletaActual, testsFuerza, historialSesiones, macrociclo } = useTraining();

  const testsAtleta = testsFuerza.filter(
    (t) => t.identificadorAtleta === atletaActual.identificadorAtleta
  );
  const sesionesAtleta = historialSesiones.filter(
    (s) => s.identificadorAtleta === atletaActual.identificadorAtleta
  );

  const cargaTotalAcumuladaUA = sesionesAtleta.reduce(
    (acc, curr) => acc + curr.cargaInternaUnidadesArbitrarias,
    0
  );

  // Estimación de adherencia real: sesiones completadas respecto a las planificadas del microciclo actual
  const totalSesionesMicroActual =
    macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento?.length || 1;
  const porcentajeAdherencia = Math.min(
    100,
    Math.round((sesionesAtleta.length / Math.max(1, totalSesionesMicroActual)) * 100)
  );

  // Búsqueda de tests específicos reales (sin fallbacks inventados)
  const testSentadilla = testsAtleta.find(
    (t) =>
      t.identificadorEjercicioBase === 'EX0001' ||
      t.nombreEjercicioEvaluado.toLowerCase().includes('sentadilla')
  );

  const testPesoMuerto = testsAtleta.find(
    (t) =>
      t.identificadorEjercicioBase === 'EX0004' ||
      t.nombreEjercicioEvaluado.toLowerCase().includes('muerto')
  );

  // Máximo relativo real para escalar las barras de fuerza de forma honesta
  const maximoRMFuerza = Math.max(
    ...testsAtleta.map((t) => t.unaRepeticionMaximaEfectiva),
    100
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <header>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-emerald-400" aria-hidden="true" />
          Mi Progreso Anual & Cargas de Entrenamiento
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Evolución de fuerza máxima evaluada (1RM), carga interna de Foster acumulada e historial
          de sesiones.
        </p>
      </header>

      {/* Tarjetas de Métricas Clave Honestadas */}
      <section aria-label="Métricas clave de rendimiento" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
            Carga Acumulada
          </span>
          <p className="mt-2 text-2xl font-black text-amber-400 font-mono">
            {cargaTotalAcumuladaUA} UA
          </p>
          <span className="text-xs text-slate-400">sRPE × Duración</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            Sesiones Hechas
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            {sesionesAtleta.length}
          </p>
          <span className="text-xs text-slate-400">
            {sesionesAtleta.length > 0
              ? `${porcentajeAdherencia}% adherencia de fase`
              : 'Inicio de temporada'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
            1RM Sentadilla
          </span>
          <p className="mt-2 text-2xl font-black text-blue-400 font-mono">
            {testSentadilla ? `${testSentadilla.unaRepeticionMaximaEfectiva} kg` : 'Sin test'}
          </p>
          <span className="text-xs text-slate-400">
            {testSentadilla ? `Test: ${testSentadilla.fechaEvaluacion}` : 'Pendiente de evaluación'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            1RM Peso Muerto
          </span>
          <p className="mt-2 text-2xl font-black text-purple-400 font-mono">
            {testPesoMuerto ? `${testPesoMuerto.unaRepeticionMaximaEfectiva} kg` : 'Sin test'}
          </p>
          <span className="text-xs text-slate-400">
            {testPesoMuerto ? `Test: ${testPesoMuerto.fechaEvaluacion}` : 'Pendiente de evaluación'}
          </span>
        </div>
      </section>

      {/* Gráfico Visual de Evolución de 1RM Proporcional al Atleta */}
      <section
        aria-labelledby="titulo-grafico-fuerza"
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 id="titulo-grafico-fuerza" className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-400" aria-hidden="true" />
            Evaluación de Fuerza Máxima en Ejercicios Básicos
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Fórmula: {atletaActual.formulaCalculoRepeticionMaximaPreferida}
          </span>
        </div>

        {testsAtleta.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No hay tests registrados aún para este atleta.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {testsAtleta.map((t) => {
              const porcentajeBarra = Math.min(
                100,
                Math.round((t.unaRepeticionMaximaEfectiva / maximoRMFuerza) * 100)
              );

              return (
                <div key={t.identificadorTest} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{t.nombreEjercicioEvaluado}</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {t.unaRepeticionMaximaEfectiva} kg
                    </span>
                  </div>

                  {/* Barra accesible con role progressbar */}
                  <div
                    role="progressbar"
                    aria-label={`1RM de ${t.nombreEjercicioEvaluado}`}
                    aria-valuenow={t.unaRepeticionMaximaEfectiva}
                    aria-valuemin={0}
                    aria-valuemax={maximoRMFuerza}
                    className="h-3.5 w-full rounded-full bg-slate-800 overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 motion-reduce:transition-none"
                      style={{ width: `${porcentajeBarra}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 pt-0.5">
                    <span>
                      Evaluado: {t.fechaEvaluacion}
                      {t.faseCicloMenstrualMomentoEvaluacion
                        ? ` (${t.faseCicloMenstrualMomentoEvaluacion})`
                        : ''}
                    </span>
                    <span>Levantado: {t.pesoLevantadoKilogramos} kg × {t.repeticionesRealizadas} reps</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Historial de Sesiones Completadas con sRPE */}
      <section
        aria-labelledby="titulo-historial-sesiones"
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-xl"
      >
        <h2 id="titulo-historial-sesiones" className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-400" aria-hidden="true" />
          Historial Reciente de Sesiones y Respuesta al Entrenamiento
        </h2>

        {sesionesAtleta.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            Aún no has completado entrenamientos. Cuando finalices tu primera sesión, verás aquí el
            resumen de sRPE y carga interna de Foster.
          </div>
        ) : (
          <div className="space-y-3">
            {sesionesAtleta.map((ses) => (
              <article
                key={ses.identificadorRegistro}
                className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">Sesión Finalizada</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Duración: <strong className="text-white">{ses.duracionRealMinutos} min</strong> • Finalizada: {new Date(ses.fechaYHoraFinalizacion).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-400 border border-emerald-500/30 font-mono">
                      {ses.cargaInternaUnidadesArbitrarias} UA
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-medium">
                  <span>
                    sRPE de Sesión:{' '}
                    <strong className="text-amber-400">
                      {ses.feedbackEntrenamiento.esfuerzoPercibidoSesion} / 10
                    </strong>
                  </span>
                  <span>
                    Fatiga:{' '}
                    <strong className="text-blue-400">
                      {ses.feedbackEntrenamiento.nivelFatigaPercibida} / 5
                    </strong>
                  </span>
                  {ses.feedbackEntrenamiento.presentaDolorOMolestia && (
                    <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      ⚠️ Molestia: {ses.feedbackEntrenamiento.zonaCorporalMolestia}
                    </span>
                  )}
                </div>

                {ses.feedbackEntrenamiento.comentariosDelAtleta && (
                  <p className="text-xs text-slate-400 italic bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    "{ses.feedbackEntrenamiento.comentariosDelAtleta}"
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
