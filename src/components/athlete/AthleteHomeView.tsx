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
  Info,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';
import { ActiveWorkoutModal } from './ActiveWorkoutModal';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const AthleteHomeView: React.FC = () => {
  const {
    atletaActual,
    macrociclo,
    testsFuerza,
    ejercicios,
    reportarRetrasoMenstrual,
    resetearRetrasoMenstrual,
    actualizarPreferenciasCiclo,
  } = useTraining();

  const [modalWorkoutAbierto, setModalWorkoutAbierto] = useState<boolean>(false);
  const [modalInfoCicloAbierto, setModalInfoCicloAbierto] = useState<boolean>(false);
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

  const aplicarAjusteHormonal =
    atletaActual.datosCicloMenstrual?.aplicarAjusteHormonalAutomatico ?? true;
  const compartirConCoach = atletaActual.datosCicloMenstrual?.compartirCicloConCoach ?? true;

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
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Panel del Atleta
          </span>
          <h1 className="text-2xl font-black text-white">
            ¡Hola, {atletaActual.nombreCompleto.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {atletaActual.deportePracticado} • {atletaActual.posicionEnElCampoDeJuego}
          </p>
        </div>
        <img
          src={
            atletaActual.fotoPerfilUrl ||
            'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150'
          }
          alt={`Foto de perfil de ${atletaActual.nombreCompleto}`}
          className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500 shadow-md shadow-emerald-500/20"
        />
      </header>

      {/* Widget Fisiología Femenina & Ciclo Menstrual (Con Transparencia y Bio-Ética) */}
      {infoCiclo && (
        <section
          aria-label="Monitoreo Fisiológico y Ciclo Menstrual"
          className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 p-4 sm:p-5 shadow-lg space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: infoCiclo.colorHex }}
                aria-hidden="true"
              />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
                Ciclo Menstrual: Día {infoCiclo.diaActualDelCiclo} ({infoCiclo.nombreFaseLegible})
              </h2>
            </div>

            {/* Acciones de Ciclo con Touch Targets >= 44px */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalInfoCicloAbierto(true)}
                aria-label="Información y configuración del ciclo menstrual"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
              </button>

              {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
                <button
                  type="button"
                  onClick={() => resetearRetrasoMenstrual(atletaActual.identificadorAtleta)}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white transition"
                >
                  <RotateCcw className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  Llegó mi período
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReportarRetraso}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-rose-500/20 px-3.5 py-2 text-xs font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition"
                >
                  <AlertOctagon className="h-4 w-4 text-rose-400" aria-hidden="true" />
                  Reportar Retraso
                </button>
              )}
            </div>
          </div>

          {atletaActual.datosCicloMenstrual?.enRetrasoMenstrual ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-3.5 text-xs text-rose-200 space-y-1"
            >
              <p className="font-bold flex items-center gap-1.5 text-rose-300">
                <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" aria-hidden="true" />
                Retraso registrado ({atletaActual.datosCicloMenstrual.diasDeRetraso} días)
              </p>
              <p className="text-xs text-rose-200/90">
                La predicción automática de fases está en pausa.{' '}
                {compartirConCoach
                  ? 'Tu preparador físico fue notificado para vigilar tu recuperación y nutrición (prevención de RED-S).'
                  : 'Este registro se mantiene privado en tu diario deportivo.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-300 font-medium">
                {infoCiclo.recomendacionDeportiva}
              </p>
              {infoCiclo.faseActual === 'LUTEA' && aplicarAjusteHormonal && (
                <span className="shrink-0 self-start sm:self-auto rounded bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
                  Carga adaptada (-7.5%)
                </span>
              )}
            </div>
          )}

          {mensajeRetrasoEnviado && (
            <div
              role="status"
              aria-live="polite"
              className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20"
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
        className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                SESIÓN PROGRAMADA
              </span>
              <span className="text-xs text-slate-400">
                ~{sesionDelDia?.duracionEstimadaMinutos} minutos
              </span>
            </div>
            <h2 id="titulo-sesion-hoy" className="mt-1 text-xl font-black text-white">
              {sesionDelDia?.nombreSesion}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {sesionDelDia?.objetivoEspecificoSesion}
            </p>
          </div>

          <Button
            variant="emerald"
            size="lg"
            onClick={() => setModalWorkoutAbierto(true)}
            icon={<Play className="h-5 w-5 fill-white" aria-hidden="true" />}
          >
            Comenzar Entrenamiento
          </Button>
        </div>

        {/* Lista de Ejercicios del Día con Cargas Ya Calculadas */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Ejercicios y Cargas Calculadas para Hoy:
          </span>

          {sesionDelDia?.bloquesDeEjercicios.map((bloque) => (
            <div
              key={bloque.identificadorBloque}
              className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{bloque.nombreBloque}</h3>
                <span className="text-xs font-semibold text-slate-400 uppercase">
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
                  <div key={idx} className="rounded-lg bg-slate-900/80 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{ej?.nombreEjercicio}</span>
                      <span className="text-xs text-slate-400">
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
                          aplicarAjusteHormonal: aplicarAjusteHormonal,
                        });

                        return (
                          <div
                            key={s.numeroDeSerie}
                            className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 min-h-[50px]"
                          >
                            <span className="text-xs font-semibold text-slate-400">
                              Serie {s.numeroDeSerie}
                            </span>
                            <span className="font-black text-base text-emerald-400 font-mono my-0.5">
                              {calculo.pesoFinalKg > 0 ? `${calculo.pesoFinalKg} kg` : 'Autocarga'}
                            </span>
                            <span className="text-xs text-slate-300">
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

      {/* Modal Informativo y de Privacidad del Ciclo Menstrual */}
      <Modal
        isOpen={modalInfoCicloAbierto}
        onClose={() => setModalInfoCicloAbierto(false)}
        title="Fisiología Femenina & Carga Periodizada"
        description="Transparencia científica sobre el monitoreo de ciclo y prevención de RED-S."
      >
        <div className="space-y-4 pt-2 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
              ¿Por qué se adapta la carga en la Fase Lútea?
            </h3>
            <p className="leading-relaxed text-slate-300">
              En la fase lútea tardía y premenstrual, el aumento de progesterona incrementa la
              temperatura corporal basal y altera la sensibilidad a la insulina y la fatiga
              termorreguladora. Un ajuste preventivo de <strong>-7.5%</strong> reduce el riesgo de
              sobreentrenamiento sin perder el estímulo neuromuscular.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Tus Preferencias de Control
            </h4>

            {/* Toggle Ajuste Hormonal */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div>
                <span className="font-bold text-white block">Ajuste automático de carga</span>
                <span className="text-slate-400 text-xs">
                  Aplica -7.5% en fase lútea sobre los ejercicios principales.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  actualizarPreferenciasCiclo(atletaActual.identificadorAtleta, {
                    aplicarAjusteHormonalAutomatico: !aplicarAjusteHormonal,
                  })
                }
                role="switch"
                aria-checked={aplicarAjusteHormonal}
                className={`min-h-[44px] min-w-[56px] rounded-full p-1 transition ${
                  aplicarAjusteHormonal ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block h-7 w-7 rounded-full bg-white transition ${
                    aplicarAjusteHormonal ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Compartir con Coach */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div>
                <span className="font-bold text-white block">Compartir retrasos con el Coach</span>
                <span className="text-slate-400 text-xs">
                  Notifica al preparador para vigilar carga interna y prevenir RED-S.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  actualizarPreferenciasCiclo(atletaActual.identificadorAtleta, {
                    compartirCicloConCoach: !compartirConCoach,
                  })
                }
                role="switch"
                aria-checked={compartirConCoach}
                className={`min-h-[44px] min-w-[56px] rounded-full p-1 transition ${
                  compartirConCoach ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block h-7 w-7 rounded-full bg-white transition ${
                    compartirConCoach ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" onClick={() => setModalInfoCicloAbierto(false)}>
              Entendido
            </Button>
          </div>
        </div>
      </Modal>

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
