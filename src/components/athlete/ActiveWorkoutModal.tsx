// =====================================================================
// NEYEN ATHLETIC - MODAL DE ENTRENAMIENTO ACTIVO Y FEEDBACK sRPE
// =====================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  EscalaEsfuerzoPercibidoSesion,
  SesionEntrenamiento,
} from '../../types';
import {
  Check,
  Clock,
  Play,
  Timer,
  X,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';

interface ActiveWorkoutModalProps {
  sesion: SesionEntrenamiento;
  onCerrar: () => void;
}

interface SerieRealData {
  pesoKg: number;
  reps: number;
  completada: boolean;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({ sesion, onCerrar }) => {
  const { atletaActual, testsFuerza, ejercicios, finalizarSesionEntrenamiento } = useTraining();

  // 1. Cronómetro de sesión basado en timestamps absolutos (inmune a background/suspensión)
  const startTimeRef = useRef<number>(0);
  const acumuladoSegundosRef = useRef<number>(0);
  const [segundosTranscurridos, setSegundosTranscurridos] = useState<number>(0);
  const [sesionPausada, setSesionPausada] = useState<boolean>(false);

  // Inicializar startTimeRef una vez montado
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // 2. Temporizador de descanso inter-serie
  const [tiempoDescansoRestante, setTiempoDescansoRestante] = useState<number>(0);
  const [descansoActivo, setDescansoActivo] = useState<boolean>(false);
  const [mensajeAccesible, setMensajeAccesible] = useState<string>('');

  // 3. Confirmación de salida involuntaria
  const [mostrarConfirmacionCierre, setMostrarConfirmacionCierre] = useState<boolean>(false);

  // 4. Modal final de sRPE (Respuesta al Entrenamiento)
  const [modalFeedbackAbierto, setModalFeedbackAbierto] = useState<boolean>(false);
  const [rpeSeleccionado, setRpeSeleccionado] = useState<EscalaEsfuerzoPercibidoSesion>(8);
  const [fatigaSeleccionada, setFatigaSeleccionada] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [presentaDolor, setPresentaDolor] = useState<boolean>(false);
  const [zonaDolor, setZonaDolor] = useState<string>('');
  const [comentariosAtleta, setComentariosAtleta] = useState<string>('');

  // 5. Estado de series reales registradas por ejercicio y serie (Benchmark Hevy/Strong)
  const [seriesReales, setSeriesReales] = useState<Record<string, SerieRealData>>(() => {
    // Intentar restaurar borrador de localStorage
    const borrador = localStorage.getItem(`neyen_active_session_${sesion.identificadorSesion}`);
    if (borrador) {
      try {
        return JSON.parse(borrador);
      } catch {
        // Fallback si está corrupto
      }
    }
    return {};
  });

  // Guardar en localStorage ante cambios para evitar pérdida de datos si se recarga la pestaña
  useEffect(() => {
    localStorage.setItem(
      `neyen_active_session_${sesion.identificadorSesion}`,
      JSON.stringify(seriesReales)
    );
  }, [seriesReales, sesion.identificadorSesion]);

  // Screen Wake Lock API: Mantiene el teléfono encendido durante el entrenamiento
  useEffect(() => {
    let wakeLockSentinel: any = null;
    const activarWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        } catch {
          // Ignorar si el usuario o batería lo rechaza
        }
      }
    };

    activarWakeLock();

    const handleVisibilityChange = () => {
      if (wakeLockSentinel !== null && document.visibilityState === 'visible') {
        activarWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  // Cronómetro con Timestamps absolutos (no pierde segundos si el navegador minimiza)
  useEffect(() => {
    if (sesionPausada || modalFeedbackAbierto) {
      return;
    }

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const deltaSegundos = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSegundosTranscurridos(acumuladoSegundosRef.current + deltaSegundos);
    }, 1000);

    return () => {
      clearInterval(interval);
      acumuladoSegundosRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
    };
  }, [sesionPausada, modalFeedbackAbierto]);

  // Manejo de Pausa/Reanudación
  const togglePausa = () => {
    if (!sesionPausada) {
      acumuladoSegundosRef.current = segundosTranscurridos;
      setSesionPausada(true);
      setMensajeAccesible('Entrenamiento pausado');
    } else {
      startTimeRef.current = Date.now();
      setSesionPausada(false);
      setMensajeAccesible('Entrenamiento reanudado');
    }
  };

  // Temporizador de descanso inter-serie
  useEffect(() => {
    let timerDescanso: any = null;
    if (descansoActivo && tiempoDescansoRestante > 0) {
      timerDescanso = setInterval(() => {
        setTiempoDescansoRestante((prev) => {
          if (prev <= 1) {
            setDescansoActivo(false);
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            setMensajeAccesible('¡Descanso completado! Es hora de tu siguiente serie.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerDescanso);
  }, [descansoActivo, tiempoDescansoRestante]);

  const iniciarDescanso = (segundos: number) => {
    setTiempoDescansoRestante(segundos);
    setDescansoActivo(true);
    setMensajeAccesible(`Temporizador de descanso iniciado: ${segundos} segundos.`);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Autodisparo de descanso al tildar serie completada (Benchmark Hevy/Strong)
  const toggleCompletarSerie = (
    serieKey: string,
    pesoPrescrito: number,
    repsPrescritas: number,
    tiempoDescansoSugerido: number = 90
  ) => {
    const actual = seriesReales[serieKey] || {
      pesoKg: pesoPrescrito,
      reps: repsPrescritas,
      completada: false,
    };

    const nuevoEstado = !actual.completada;
    setSeriesReales((prev) => ({
      ...prev,
      [serieKey]: {
        ...actual,
        completada: nuevoEstado,
      },
    }));

    if (nuevoEstado) {
      // Disparar descanso automáticamente
      iniciarDescanso(tiempoDescansoSugerido);
      setMensajeAccesible(`Serie completada. Descanso automático iniciado de ${tiempoDescansoSugerido} segundos.`);
    }
  };

  const actualizarValorSerie = (
    serieKey: string,
    campo: 'pesoKg' | 'reps',
    valor: number,
    pesoDefault: number,
    repsDefault: number
  ) => {
    const actual = seriesReales[serieKey] || {
      pesoKg: pesoDefault,
      reps: repsDefault,
      completada: false,
    };

    setSeriesReales((prev) => ({
      ...prev,
      [serieKey]: {
        ...actual,
        [campo]: valor,
      },
    }));
  };

  const handleConfirmarDescarte = () => {
    localStorage.removeItem(`neyen_active_session_${sesion.identificadorSesion}`);
    setMostrarConfirmacionCierre(false);
    onCerrar();
  };

  const handleEnviarFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const minutosTotales = Math.max(1, Math.round(segundosTranscurridos / 60));

    finalizarSesionEntrenamiento({
      identificadorSesionOriginal: sesion.identificadorSesion,
      duracionRealMinutos: minutosTotales,
      feedback: {
        esfuerzoPercibidoSesion: rpeSeleccionado,
        nivelFatigaPercibida: fatigaSeleccionada,
        presentaDolorOMolestia: presentaDolor,
        zonaCorporalMolestia: presentaDolor ? zonaDolor : undefined,
        comentariosDelAtleta: comentariosAtleta || undefined,
      },
    });

    localStorage.removeItem(`neyen_active_session_${sesion.identificadorSesion}`);
    onCerrar();
  };

  // Cálculo de fase de ciclo de la atleta
  const infoCiclo =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
      ? calcularFaseCicloActual(
          atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
          atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
          atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
        )
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Entrenamiento activo: ${sesion.nombreSesion}`}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden"
    >
      {/* Región dinámica para anuncios de tecnologías de asistencia */}
      <div role="status" aria-live="polite" className="sr-only">
        {mensajeAccesible}
      </div>

      {/* Barra superior de entrenamiento en curso */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-3.5 w-3.5 rounded-full ${
              sesionPausada ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse motion-reduce:animate-none'
            }`}
            aria-hidden="true"
          />
          <div>
            <h1 className="text-sm font-black text-white">{sesion.nombreSesion}</h1>
            <p className="text-xs text-slate-400">
              {sesionPausada ? 'Pausado' : 'Entrenamiento Activo'}
            </p>
          </div>
        </div>

        {/* Cronómetro Global con Control de Pausa y Salida Segura */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePausa}
            aria-label={sesionPausada ? 'Reanudar sesión' : 'Pausar sesión'}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm font-bold text-emerald-400 min-h-[44px] hover:bg-slate-750 transition"
          >
            {sesionPausada ? (
              <Play className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Clock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            )}
            <span>{formatearTiempo(segundosTranscurridos)}</span>
          </button>

          <button
            type="button"
            onClick={() => setMostrarConfirmacionCierre(true)}
            aria-label="Cerrar entrenamiento"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Temporizador flotante de descanso inter-serie (Ergonomía táctil >= 44px) */}
      <div className="border-b border-slate-800 bg-slate-900/70 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-300">Descanso:</span>
          <span className="font-mono text-base font-black text-amber-400">
            {tiempoDescansoRestante > 0 ? formatearTiempo(tiempoDescansoRestante) : '00:00'}
          </span>
          {descansoActivo && (
            <span className="text-xs font-medium text-amber-300 animate-pulse motion-reduce:animate-none">
              Corriendo...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => iniciarDescanso(60)}
            aria-label="Descanso de 60 segundos"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 active:bg-slate-650 transition"
          >
            60s
          </button>
          <button
            type="button"
            onClick={() => iniciarDescanso(90)}
            aria-label="Descanso de 90 segundos"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 active:bg-slate-650 transition"
          >
            90s
          </button>
          <button
            type="button"
            onClick={() => iniciarDescanso(120)}
            aria-label="Descanso de 120 segundos"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 active:bg-slate-650 transition"
          >
            120s
          </button>
          {tiempoDescansoRestante > 0 && (
            <button
              type="button"
              onClick={() => {
                setDescansoActivo(false);
                setTiempoDescansoRestante(0);
                setMensajeAccesible('Temporizador de descanso reiniciado a cero.');
              }}
              aria-label="Reiniciar temporizador"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition border border-rose-500/40"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Contenido con scroll: Bloques de Ejercicios y Registro Activo de Series */}
      <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full space-y-6 pb-32">
        {sesion.bloquesDeEjercicios.map((bloque) => (
          <section
            key={bloque.identificadorBloque}
            aria-labelledby={`bloque-titulo-${bloque.identificadorBloque}`}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2
                id={`bloque-titulo-${bloque.identificadorBloque}`}
                className="font-black text-white text-base sm:text-lg"
              >
                {bloque.nombreBloque}
              </h2>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
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
                <div
                  key={idx}
                  className="rounded-xl bg-slate-950/70 p-4 space-y-3 border border-slate-800/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{ej?.nombreEjercicio}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {ej?.patronDeMovimiento} • {ej?.grupoMuscularPrincipal}
                        {unRM > 0 && (
                          <span className="ml-2 font-mono text-emerald-400 font-semibold">
                            (1RM Ref: {unRM} kg)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {item.indicacionesTecnicas && (
                    <p className="text-xs text-amber-300/90 italic bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      💡 <strong>Consigna:</strong> {item.indicacionesTecnicas}
                    </p>
                  )}

                  {/* Series Prescritas vs Registro Real (Benchmark Hevy/Strong) */}
                  <div className="space-y-2 mt-2">
                    {item.seriesPrescritas.map((s) => {
                      const calculo = calcularCargaPrescrita({
                        unRepeticionMaximaKg: unRM,
                        porcentajeUnaRepeticionMaxima: s.porcentajeUnaRepeticionMaxima,
                        ratioConversionCarga: ej?.ratioConversionCargaPorcentual || 1.0,
                        faseCicloMenstrual: infoCiclo?.faseActual,
                        aplicarAjusteHormonal: true,
                      });

                      const pesoPrescrito = calculo.pesoFinalKg;
                      const repsPrescritas = s.repeticionesPrescritas;
                      const serieKey = `${item.identificadorEjercicio}_serie_${s.numeroDeSerie}`;
                      const serieEstado = seriesReales[serieKey] || {
                        pesoKg: pesoPrescrito,
                        reps: repsPrescritas,
                        completada: false,
                      };

                      return (
                        <div
                          key={s.numeroDeSerie}
                          className={`flex items-center justify-between gap-2 rounded-xl p-3 border transition ${
                            serieEstado.completada
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-900/90 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-slate-400 shrink-0">
                              SET {s.numeroDeSerie}
                            </span>

                            {/* Detalle Prescrito */}
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-300">
                                Prescrito: {pesoPrescrito > 0 ? `${pesoPrescrito} kg` : 'Autocarga'} × {repsPrescritas}
                              </span>
                              {s.porcentajeUnaRepeticionMaxima && (
                                <span className="text-[11px] text-slate-400">
                                  {s.porcentajeUnaRepeticionMaxima}% 1RM
                                  {s.repeticionesEnReservaObjetivo
                                    ? ` • RIR ${s.repeticionesEnReservaObjetivo}`
                                    : ''}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Ajuste Rápido de Kilos y Repeticiones Reales */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <label htmlFor={`peso-${serieKey}`} className="sr-only">
                                Kilos reales para serie {s.numeroDeSerie}
                              </label>
                              <input
                                id={`peso-${serieKey}`}
                                type="number"
                                min="0"
                                step="0.5"
                                value={serieEstado.pesoKg}
                                onChange={(e) =>
                                  actualizarValorSerie(
                                    serieKey,
                                    'pesoKg',
                                    parseFloat(e.target.value) || 0,
                                    pesoPrescrito,
                                    repsPrescritas
                                  )
                                }
                                className="w-16 min-h-[44px] rounded-lg border border-slate-700 bg-slate-950 px-2 text-center font-mono text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <span className="text-xs text-slate-400">kg</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <label htmlFor={`reps-${serieKey}`} className="sr-only">
                                Repeticiones reales para serie {s.numeroDeSerie}
                              </label>
                              <input
                                id={`reps-${serieKey}`}
                                type="number"
                                min="1"
                                step="1"
                                value={serieEstado.reps}
                                onChange={(e) =>
                                  actualizarValorSerie(
                                    serieKey,
                                    'reps',
                                    parseInt(e.target.value) || 1,
                                    pesoPrescrito,
                                    repsPrescritas
                                  )
                                }
                                className="w-14 min-h-[44px] rounded-lg border border-slate-700 bg-slate-950 px-2 text-center font-mono text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <span className="text-xs text-slate-400">reps</span>
                            </div>

                            {/* Botón táctil para marcar serie completada (Autodispara descanso) */}
                            <button
                              type="button"
                              onClick={() =>
                                toggleCompletarSerie(
                                  serieKey,
                                  pesoPrescrito,
                                  repsPrescritas,
                                  ej?.grupoMuscularPrincipal === 'TREN_INFERIOR' ? 90 : 60
                                )
                              }
                              aria-label={
                                serieEstado.completada
                                  ? `Desmarcar serie ${s.numeroDeSerie}`
                                  : `Completar serie ${s.numeroDeSerie} e iniciar descanso`
                              }
                              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition ${
                                serieEstado.completada
                                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-bold'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              <Check className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </main>

      {/* BOTÓN PRINCIPAL DESTACADO: FINALIZAR ENTRENAMIENTO */}
      {/* 1-Tap Checkout ergonómico y accesible */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 p-4 backdrop-blur-md z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            <span>
              Duración:{' '}
              <strong className="text-white font-mono text-sm">
                {formatearTiempo(segundosTranscurridos)}
              </strong>
            </span>
          </div>

          <Button
            variant="emerald"
            size="lg"
            onClick={() => setModalFeedbackAbierto(true)}
            className="flex-1 font-black uppercase tracking-wider text-sm shadow-xl shadow-emerald-600/30"
          >
            Finalizar Entrenamiento ✓
          </Button>
        </div>
      </footer>

      {/* MODAL DE CONFIRMACIÓN AL INTENTAR CERRAR LA SESIÓN */}
      <Modal
        isOpen={mostrarConfirmacionCierre}
        onClose={() => setMostrarConfirmacionCierre(false)}
        title="¿Deseas salir del entrenamiento?"
        description="Tu entrenamiento y los kilos registrados están guardados automáticamente en tu dispositivo."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-300">
            Puedes reanudar tu sesión en cualquier momento. Si descartas la sesión, perderás el
            tiempo cronometrado.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarConfirmacionCierre(false);
                onCerrar();
              }}
            >
              Guardar y Salir
            </Button>
            <Button variant="danger" onClick={handleConfirmarDescarte}>
              Descartar Sesión
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE CIERRE ACCESIBLE: RESPUESTA AL ENTRENAMIENTO (sRPE FOSTER) */}
      <Modal
        isOpen={modalFeedbackAbierto}
        onClose={() => setModalFeedbackAbierto(false)}
        title="Respuesta al Entrenamiento"
        description="Evaluación de la carga interna y esfuerzo global de la sesión (sRPE de Foster)."
      >
        <form onSubmit={handleEnviarFeedback} className="space-y-5 pt-2">
          {/* Esfuerzo Percibido (1 al 10) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <label htmlFor="srpe-slider">Esfuerzo Percibido de la Sesión (sRPE)</label>
              <span className="text-emerald-400 font-mono text-base font-black">
                {rpeSeleccionado} / 10
              </span>
            </div>
            <input
              id="srpe-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={rpeSeleccionado}
              onChange={(e) =>
                setRpeSeleccionado(parseInt(e.target.value) as EscalaEsfuerzoPercibidoSesion)
              }
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={rpeSeleccionado}
              className="w-full accent-emerald-500 cursor-pointer min-h-[36px]"
            />
            <div className="flex justify-between text-xs text-slate-400 px-1 font-medium">
              <span>1 (Muy Suave)</span>
              <span>5 (Moderado)</span>
              <span>8 (Intenso)</span>
              <span>10 (Máximo)</span>
            </div>
          </div>

          {/* Nivel de Fatiga Percibida (1 a 5) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Nivel de Fatiga General
            </label>
            <div
              role="radiogroup"
              aria-label="Nivel de fatiga del 1 al 5"
              className="grid grid-cols-5 gap-2"
            >
              {[1, 2, 3, 4, 5].map((lvl) => {
                const labels: Record<number, string> = {
                  1: 'Excelente',
                  2: 'Buena',
                  3: 'Normal',
                  4: 'Cansado',
                  5: 'Agotado',
                };
                const emojis: Record<number, string> = {
                  1: '😊',
                  2: '🙂',
                  3: '😐',
                  4: '😓',
                  5: '🥵',
                };

                return (
                  <button
                    key={lvl}
                    type="button"
                    role="radio"
                    aria-checked={fatigaSeleccionada === lvl}
                    aria-label={`Nivel ${lvl}: ${labels[lvl]}`}
                    onClick={() => setFatigaSeleccionada(lvl as any)}
                    className={`flex flex-col items-center justify-center min-h-[50px] rounded-xl text-xs font-bold transition ${
                      fatigaSeleccionada === lvl
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-base" aria-hidden="true">
                      {emojis[lvl]}
                    </span>
                    <span className="text-[11px] mt-0.5">{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detección de Dolor o Molestia */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                ¿Sentiste dolor o molestias anormales?
              </span>
              <button
                type="button"
                onClick={() => setPresentaDolor(!presentaDolor)}
                aria-pressed={presentaDolor}
                className={`min-h-[44px] rounded-xl px-4 py-2 text-xs font-bold transition ${
                  presentaDolor
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {presentaDolor ? 'Sí, tuve dolor' : 'No, todo bien'}
              </button>
            </div>

            {presentaDolor && (
              <Field
                label="Zona corporal de molestia"
                required
                helperText="Indica la articulación o músculo para que tu entrenador lo revise."
              >
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    required
                    value={zonaDolor}
                    onChange={(e) => setZonaDolor(e.target.value)}
                    placeholder="ej. Rodilla izquierda, hombro derecho..."
                  />
                )}
              </Field>
            )}
          </div>

          {/* Notas del Atleta */}
          <Field label="Notas o sensaciones al entrenador">
            {(props) => (
              <textarea
                {...props}
                rows={2}
                value={comentariosAtleta}
                onChange={(e) => setComentariosAtleta(e.target.value)}
                placeholder="ej. Me sentí con mucha energía en el bloque de piernas..."
              />
            )}
          </Field>

          {/* Cálculo de Carga en Unidades Arbitrarias */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs">
            <span className="text-slate-400">Carga Interna Computada (Foster):</span>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {rpeSeleccionado * Math.max(1, Math.round(segundosTranscurridos / 60))} UA
            </p>
            <span className="text-xs text-slate-400">
              sRPE {rpeSeleccionado} × {Math.max(1, Math.round(segundosTranscurridos / 60))} minutos
            </span>
          </div>

          <Button type="submit" variant="emerald" fullWidth size="lg">
            Guardar y Registrar Sesión
          </Button>
        </form>
      </Modal>
    </div>
  );
};
