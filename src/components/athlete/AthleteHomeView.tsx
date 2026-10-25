// =====================================================================
// NEYEN ATHLETIC - VISTA PRINCIPAL DEL ALUMNO (MOBILE-FIRST)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  AlertOctagon,
  Calendar,
  CheckCircle,
  Dumbbell,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';
import { ActiveWorkoutModal } from './ActiveWorkoutModal';
import { AthleteCycleModal } from './AthleteCycleModal';

export const AthleteHomeView: React.FC = () => {
  const {
    atletaActual,
    macrociclo,
    testsFuerza,
    ejercicios,
    reportarRetrasoMenstrual,
    resetearRetrasoMenstrual,
  } = useTraining();

  const [modalWorkoutAbierto, setModalWorkoutAbierto] = useState<boolean>(false);
  const [modalCicloAbierto, setModalCicloAbierto] = useState<boolean>(false);
  const [mensajeRetrasoEnviado, setMensajeRetrasoEnviado] = useState<boolean>(false);

  // Sesión del día (Sesión 1 del Micro 1 del Meso 1)
  const sesionDelDia = macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento[0];

  // Cálculo de fase de ciclo
  const infoCiclo =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
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
      <header className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#163832]/70 dark:text-[#9EB5B0]">
            Panel del Atleta
          </span>
          <h1 className="text-2xl font-black text-[#163832] dark:text-white">
            ¡Hola, {atletaActual.nombreCompleto.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] mt-0.5">
            {atletaActual.deportePracticado} • {atletaActual.posicionEnElCampoDeJuego}
          </p>
        </div>
        <img
          src={
            atletaActual.fotoPerfilUrl ||
            'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150'
          }
          alt={`Foto de perfil de ${atletaActual.nombreCompleto}`}
          className="h-14 w-14 rounded-full object-cover border-2 border-[#163832] dark:border-[#E85938] shadow-md"
        />
      </header>

      {/* Widget Fisiología Femenina & Ciclo Menstrual (Con estilo a las tarjetas del mockup) */}
      {infoCiclo && (
        <section
          aria-label="Monitoreo Fisiológico y Ciclo Menstrual"
          className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 sm:p-5 shadow-sm space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: infoCiclo.colorHex }}
                aria-hidden="true"
              />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#163832] dark:text-white flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-[#E85938]" aria-hidden="true" />
                Ciclo Menstrual: Día {infoCiclo.diaActualDelCiclo} ({infoCiclo.nombreFaseLegible})
              </h2>
            </div>

            {/* Acciones de Ciclo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalCicloAbierto(true)}
                className="flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-3.5 py-2 text-xs font-bold text-[#163832] dark:text-[#FAF7EE] bg-transparent hover:bg-[#E1ECE5]/40 transition"
              >
                Ver Mi ciclo
              </button>

              {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
                <button
                  type="button"
                  onClick={() => resetearRetrasoMenstrual(atletaActual.identificadorAtleta)}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#E1ECE5] dark:bg-[#183E37] px-3.5 py-2 text-xs font-bold text-[#163832] dark:text-white transition"
                >
                  <RotateCcw className="h-4 w-4 text-[#E85938]" aria-hidden="true" />
                  Llegó mi período
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReportarRetraso}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#E85938]/15 px-3.5 py-2 text-xs font-bold text-[#E85938] border-2 border-[#E85938]/30 hover:bg-[#E85938]/25 transition"
                >
                  <AlertOctagon className="h-4 w-4 text-[#E85938]" aria-hidden="true" />
                  Reportar Retraso
                </button>
              )}
            </div>
          </div>

          {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
            <div
              role="alert"
              className="rounded-xl bg-[#E85938] p-3.5 text-xs text-[#112B26] font-medium leading-relaxed"
            >
              <strong className="font-bold">¿Hay retraso?</strong> Se ha pausado el cálculo automático de tus cargas y se notificó a tu coach.
            </div>
          ) : (
            <div className="rounded-xl bg-[#E1ECE5] dark:bg-[#183E37] p-3 text-xs text-[#163832] dark:text-[#E1ECE5]">
              <p className="font-medium">
                {infoCiclo.recomendacionDeportiva}
              </p>
            </div>
          )}

          {mensajeRetrasoEnviado && (
            <div
              role="status"
              aria-live="polite"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20"
            >
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              Retraso reportado con éxito al panel del Coach.
            </div>
          )}
        </section>
      )}

      {/* Tarjeta de la Sesión de Hoy */}
      <section
        aria-labelledby="titulo-sesion-hoy"
        className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-5 shadow-sm space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E2D5]/80 dark:border-[#25524A]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-3 py-1 text-xs font-bold text-[#163832] dark:text-[#E1ECE5]">
                SESIÓN PROGRAMADA
              </span>
              <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium">
                ~{sesionDelDia?.duracionEstimadaMinutos} minutos
              </span>
            </div>
            <h2 id="titulo-sesion-hoy" className="mt-1 text-xl font-black text-[#163832] dark:text-white">
              {sesionDelDia?.nombreSesion}
            </h2>
            <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] mt-0.5">
              {sesionDelDia?.objetivoEspecificoSesion}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalWorkoutAbierto(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#E85938] hover:bg-[#D74F30] active:scale-[0.99] text-[#112B26] font-extrabold text-base px-6 py-3.5 shadow-md transition"
          >
            <Play className="h-5 w-5 fill-[#112B26]" aria-hidden="true" />
            <span>Comenzar Entrenamiento</span>
          </button>
        </div>

        {/* Lista de Ejercicios del Día con Cargas Ya Calculadas */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#163832]/70 dark:text-[#9EB5B0] block">
            Ejercicios y Cargas Calculadas para Hoy:
          </span>

          {sesionDelDia?.bloquesDeEjercicios.map((bloque) => (
            <div
              key={bloque.identificadorBloque}
              className="rounded-xl border border-[#E5E2D5] dark:border-[#25524A] bg-[#FAF7EE]/60 dark:bg-[#102824]/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#163832] dark:text-white text-sm">{bloque.nombreBloque}</h3>
                <span className="text-xs font-semibold text-[#163832]/70 dark:text-[#9EB5B0] uppercase">
                  {bloque.tipoEstructura.replace('_', ' ')}
                </span>
              </div>

              {bloque.ejerciciosPrescritos.map((item, idx) => {
                const ej = ejercicios.find(
                  (e) => e.identificadorEjercicio === item.identificadorEjercicio
                );
                const testBaseId =
                  ej?.identificadorEjercicioBaseTestReferencia || ej?.identificadorEjercicio;
                const testAtleta = testsFuerza.find(
                  (t) =>
                    t.identificadorAtleta === atletaActual.identificadorAtleta &&
                    t.identificadorEjercicioBase === testBaseId
                );
                const unRM = testAtleta?.unaRepeticionMaximaEfectiva || 0;

                return (
                  <div key={idx} className="rounded-lg bg-white dark:bg-[#163630] border border-[#E5E2D5] dark:border-[#25524A] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#163832] dark:text-white text-sm">{ej?.nombreEjercicio}</span>
                      <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
                        {ej?.grupoMuscularPrincipal}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                            className="flex flex-col items-center justify-center rounded-lg border border-[#E5E2D5] dark:border-[#25524A] bg-[#FAF7EE] dark:bg-[#102824] px-3 py-2 min-h-[50px]"
                          >
                            <span className="text-xs font-semibold text-[#163832]/70 dark:text-[#9EB5B0]">
                              Serie {s.numeroDeSerie}
                            </span>
                            <span className="font-black text-base text-[#163832] dark:text-[#FAF7EE] font-mono my-0.5">
                              {calculo.pesoFinalKg > 0 ? `${calculo.pesoFinalKg} kg` : 'Autocarga'}
                            </span>
                            <span className="text-xs text-[#163832]/80 dark:text-[#9EB5B0]">
                              {s.repeticionesPrescritas} reps
                            </span>
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
      </section>

      {/* Modal "Mi ciclo" */}
      <AthleteCycleModal
        isOpen={modalCicloAbierto}
        onClose={() => setModalCicloAbierto(false)}
      />

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
