// =====================================================================
// NEYIMA ATHLETIC - DASHBOARD DE PROGRESO ANUAL DEL ALUMNO
// CORRESPONDE A dashb-claro.html / progreso-claro.html
// =====================================================================

import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';

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

  const totalSesionesMicroActual =
    macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento?.length || 1;
  const porcentajeAdherencia = Math.min(
    100,
    Math.round((sesionesAtleta.length / Math.max(1, totalSesionesMicroActual)) * 100)
  );

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

  const maximoRMFuerza = Math.max(
    ...testsAtleta.map((t) => t.unaRepeticionMaximaEfectiva),
    100
  );

  return (
    <div className="space-y-5 w-full">
      {/* Cabecera */}
      <header>
        <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">Evolución de rendimiento</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mi Progreso Anual</h1>
      </header>

      {/* Tarjetas de Métricas Clave */}
      <section aria-label="Métricas clave de rendimiento" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
          <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
            <IconInterface name="gauge" size={14} />
            Carga Acumulada
          </span>
          <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
            {cargaTotalAcumuladaUA} UA
          </p>
          <span className="text-xs text-[var(--mut)]">Foster sRPE × min</span>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
          <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
            <IconInterface name="check" size={14} />
            Sesiones Hechas
          </span>
          <p className="mt-1.5 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {sesionesAtleta.length}
          </p>
          <span className="text-xs text-[var(--mut)]">
            {sesionesAtleta.length > 0 ? `${porcentajeAdherencia}% adherencia` : 'Temporada actual'}
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
          <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
            <IconInterface name="dumbbell" size={14} />
            1RM Sentadilla
          </span>
          <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
            {testSentadilla ? `${testSentadilla.unaRepeticionMaximaEfectiva} kg` : 'Sin test'}
          </p>
          <span className="text-xs text-[var(--mut)]">
            {testSentadilla ? `Evaluado: ${testSentadilla.fechaEvaluacion}` : 'Pendiente'}
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
          <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
            <IconInterface name="dumbbell" size={14} />
            1RM Peso Muerto
          </span>
          <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
            {testPesoMuerto ? `${testPesoMuerto.unaRepeticionMaximaEfectiva} kg` : 'Sin test'}
          </p>
          <span className="text-xs text-[var(--mut)]">
            {testPesoMuerto ? `Evaluado: ${testPesoMuerto.fechaEvaluacion}` : 'Pendiente'}
          </span>
        </div>
      </section>

      {/* Gráfico Visual de Evolución de 1RM */}
      <section
        aria-labelledby="titulo-grafico-fuerza"
        className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 space-y-3 shadow-2xs"
      >
        <div className="flex items-center justify-between border-b border-[var(--bord)] pb-2.5">
          <h2 id="titulo-grafico-fuerza" className="text-sm font-bold flex items-center gap-2">
            <IconInterface name="clipboard" size={16} />
            <span>Fuerza Máxima Estimada en Ejercicios Básicos</span>
          </h2>
          <span className="text-xs text-[var(--mut)] font-bold">
            Fórmula: {atletaActual.formulaCalculoRepeticionMaximaPreferida}
          </span>
        </div>

        {testsAtleta.length === 0 ? (
          <div className="text-center py-6 text-xs text-[var(--mut)]">
            No hay tests registrados aún para este atleta.
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {testsAtleta.map((t) => {
              const porcentajeBarra = Math.min(
                100,
                Math.round((t.unaRepeticionMaximaEfectiva / maximoRMFuerza) * 100)
              );

              return (
                <div key={t.identificadorTest} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{t.nombreEjercicioEvaluado}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                      {t.unaRepeticionMaximaEfectiva} kg
                    </span>
                  </div>

                  <div
                    role="progressbar"
                    aria-label={`1RM de ${t.nombreEjercicioEvaluado}`}
                    aria-valuenow={t.unaRepeticionMaximaEfectiva}
                    aria-valuemin={0}
                    aria-valuemax={maximoRMFuerza}
                    className="h-3 w-full rounded-full bg-[var(--bg)] overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full bg-[var(--navbg)] transition-all duration-500"
                      style={{ width: `${porcentajeBarra}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-[var(--mut)] pt-0.5">
                    <span>
                      Evaluado: {t.fechaEvaluacion}
                      {t.faseCicloMenstrualMomentoEvaluacion ? ` (${t.faseCicloMenstrualMomentoEvaluacion})` : ''}
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
        className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 space-y-3 shadow-2xs"
      >
        <h2 id="titulo-historial-sesiones" className="text-sm font-bold flex items-center gap-2 border-b border-[var(--bord)] pb-2.5">
          <IconInterface name="calendar" size={16} />
          <span>Historial Reciente de Sesiones</span>
        </h2>

        {sesionesAtleta.length === 0 ? (
          <div className="text-center py-6 text-xs text-[var(--mut)]">
            Aún no has completado entrenamientos. Cuando finalices tu primera sesión, verás aquí el resumen.
          </div>
        ) : (
          <div className="space-y-2.5">
            {sesionesAtleta.map((ses) => (
              <article
                key={ses.identificadorRegistro}
                className="rounded-xl border border-[var(--bord)] bg-[var(--bg)] p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[var(--txt)]">Sesión Finalizada</span>
                    <p className="text-xs text-[var(--mut)] mt-0.5">
                      Duración: <b className="text-[var(--txt)]">{ses.duracionRealMinutos} min</b> • Fecha: {new Date(ses.fechaYHoraFinalizacion).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[var(--okbg)] text-[var(--oktx)] font-mono">
                    {ses.cargaInternaUnidadesArbitrarias} UA
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[var(--bord)]">
                  <span>
                    sRPE:{' '}
                    <strong className="text-[var(--txt)]">
                      {ses.feedbackEntrenamiento.esfuerzoPercibidoSesion} / 10
                    </strong>
                  </span>
                  <span>
                    Fatiga:{' '}
                    <strong className="text-[var(--txt)]">
                      {ses.feedbackEntrenamiento.nivelFatigaPercibida} / 5
                    </strong>
                  </span>
                  {ses.feedbackEntrenamiento.presentaDolorOMolestia && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      ⚠️ Molestia: {ses.feedbackEntrenamiento.zonaCorporalMolestia}
                    </span>
                  )}
                </div>

                {ses.feedbackEntrenamiento.comentariosDelAtleta && (
                  <p className="text-xs text-[var(--mut)] italic pt-1">
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
