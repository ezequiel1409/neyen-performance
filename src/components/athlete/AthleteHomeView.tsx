// =====================================================================
// NEYEN ATHLETIC - VISTA PRINCIPAL DEL ALUMNO (MOBILE-FIRST)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Activity,
  AlertOctagon,
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';
import { ActiveWorkoutModal } from './ActiveWorkoutModal';

export const AthleteHomeView: React.FC = () => {
  const { atletaActual, macrociclo, testsFuerza, ejercicios, reportarRetrasoMenstrual, resetearRetrasoMenstrual } = useTraining();
  const [modalWorkoutAbierto, setModalWorkoutAbierto] = useState<boolean>(false);
  const [mensajeRetrasoEnviado, setMensajeRetrasoEnviado] = useState<boolean>(false);

  // Sesión del día (Sesión 1 del Micro 1 del Meso 1)
  const sesionDelDia = macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento[0];

  // Cálculo de fase de ciclo
  const infoCiclo = atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
    ? calcularFaseCicloActual(
        atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
        atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
        atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
      )
    : null;

  const handleReportarRetraso = () => {
    reportarRetrasoMenstrual(atletaActual.identificadorAtleta);
    setMensajeRetrasoEnviado(true);
    setTimeout(() => setMensajeRetrasoEnviado(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Saludo y Estado */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Panel del Atleta</span>
          <h1 className="text-2xl font-black text-white">¡Hola, {atletaActual.nombreCompleto.split(' ')[0]}! 👋</h1>
          <p className="text-xs text-slate-400">
            {atletaActual.deportePracticado} • {atletaActual.posicionEnElCampoDeJuego}
          </p>
        </div>
        <img
          src={atletaActual.fotoPerfilUrl || 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150'}
          alt={atletaActual.nombreCompleto}
          className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500 shadow-md shadow-emerald-500/20"
        />
      </div>

      {/* Widget Fisiología Femenina & Ciclo Menstrual */}
      {infoCiclo && (
        <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full animate-ping" style={{ backgroundColor: infoCiclo.colorHex }} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-400" />
                Ciclo Menstrual: Día {infoCiclo.diaActualDelCiclo} ({infoCiclo.nombreFaseLegible})
              </h2>
            </div>

            {/* Botón Reportar Retraso */}
            {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
              <button
                onClick={() => resetearRetrasoMenstrual(atletaActual.identificadorAtleta)}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                Llegó mi período
              </button>
            ) : (
              <button
                onClick={handleReportarRetraso}
                className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition"
              >
                <AlertOctagon className="h-3 w-3 text-rose-400" />
                Reportar Retraso
              </button>
            )}
          </div>

          {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
            <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-xs text-rose-200">
              <p className="font-bold flex items-center gap-1.5 text-rose-300">
                <AlertOctagon className="h-4 w-4 text-rose-400" />
                Retraso notificado al Coach ({atletaActual.datosCicloMenstrual.diasDeRetraso} días)
              </p>
              <p className="mt-1 text-[11px] text-rose-200/80">
                La predicción automática de fases está en pausa. Tu preparador físico está al tanto para monitorear fatiga, recuperación y nutrición (prevención de RED-S).
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <p className="text-[11px]">{infoCiclo.recomendacionDeportiva}</p>
              {infoCiclo.faseActual === 'LUTEA' && (
                <span className="shrink-0 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                  Carga adaptada (-7.5%)
                </span>
              )}
            </div>
          )}

          {mensajeRetrasoEnviado && (
            <p className="text-[11px] font-semibold text-emerald-400 animate-bounce">
              ✓ Retraso reportado con éxito al panel del Coach.
            </p>
          )}
        </div>
      )}

      {/* Tarjeta de la Sesión de Hoy */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                SESIÓN PROGRAMADA
              </span>
              <span className="text-xs text-slate-400">~{sesionDelDia?.duracionEstimadaMinutos} minutos</span>
            </div>
            <h2 className="mt-1 text-xl font-black text-white">{sesionDelDia?.nombreSesion}</h2>
            <p className="text-xs text-slate-400">{sesionDelDia?.objetivoEspecificoSesion}</p>
          </div>

          <button
            onClick={() => setModalWorkoutAbierto(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition"
          >
            <Play className="h-5 w-5 fill-white" />
            Comenzar Entrenamiento
          </button>
        </div>

        {/* Lista de Ejercicios del Día con Cargas Ya Calculadas */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ejercicios y Cargas Calculadas para Hoy:
          </span>

          {sesionDelDia?.bloquesDeEjercicios.map((bloque) => (
            <div key={bloque.identificadorBloque} className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{bloque.nombreBloque}</h3>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{bloque.tipoEstructura.replace('_', ' ')}</span>
              </div>

              {bloque.ejerciciosPrescritos.map((item, idx) => {
                const ej = ejercicios.find((e) => e.identificadorEjercicio === item.identificadorEjercicio);
                const testBaseId = ej?.identificadorEjercicioBaseTestReferencia || ej?.identificadorEjercicio;
                const testAtleta = testsFuerza.find(
                  (t) => t.identificadorAtleta === atletaActual.identificadorAtleta && t.identificadorEjercicioBase === testBaseId
                );
                const unRM = testAtleta?.unaRepeticionMaximaEfectiva || 0;

                return (
                  <div key={idx} className="rounded-lg bg-slate-900/80 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{ej?.nombreEjercicio}</span>
                      <span className="text-xs text-slate-400">{ej?.grupoMuscularPrincipal}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.seriesPrescritas.map((s) => {
                        const calculo = calcularCargaPrescrita({
                          unRepeticionMaximaKg: unRM,
                          porcentajeUnaRepeticionMaxima: s.porcentajeUnaRepeticionMaxima,
                          ratioConversionCarga: ej?.ratioConversionCargaPorcentual || 1.0,
                          faseCicloMenstrual: infoCiclo?.faseActual,
                          aplicarAjusteHormonal: true,
                        });

                        return (
                          <div
                            key={s.numeroDeSerie}
                            className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 min-w-[70px]"
                          >
                            <span className="text-[10px] text-slate-500">Serie {s.numeroDeSerie}</span>
                            <span className="font-black text-sm text-emerald-400 font-mono">
                              {calculo.pesoFinalKg > 0 ? `${calculo.pesoFinalKg} kg` : `${s.repeticionesPrescritas} reps`}
                            </span>
                            <span className="text-[10px] text-slate-400">{s.repeticionesPrescritas} reps</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Entrenamiento en Curso */}
      {modalWorkoutAbierto && (
        <ActiveWorkoutModal
          sesion={sesionDelDia!}
          onCerrar={() => setModalWorkoutAbierto(false)}
        />
      )}
    </div>
  );
};
