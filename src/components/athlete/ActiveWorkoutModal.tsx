// =====================================================================
// NEYEN ATHLETIC - MODAL DE ENTRENAMIENTO ACTIVO Y FEEDBACK sRPE
// DISEÑO FIEL A MOCKUPS (LIGHT & DARK THEME)
// =====================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  EscalaEsfuerzoPercibidoSesion,
  SesionEntrenamiento,
} from '../../types';
import {
  ArrowLeft,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';

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

  // 1. Cronómetro de sesión
  const startTimeRef = useRef<number>(0);
  const acumuladoSegundosRef = useRef<number>(0);
  const [segundosTranscurridos, setSegundosTranscurridos] = useState<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const deltaSegundos = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSegundosTranscurridos(acumuladoSegundosRef.current + deltaSegundos);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // 2. Temporizador de descanso inter-serie
  const [tiempoDescansoRestante, setTiempoDescansoRestante] = useState<number>(0);
  const [descansoActivo, setDescansoActivo] = useState<boolean>(false);

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
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerDescanso);
  }, [descansoActivo, tiempoDescansoRestante]);

  const iniciarDescanso = (segundos: number = 90) => {
    setTiempoDescansoRestante(segundos);
    setDescansoActivo(true);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 3. Confirmación de salida involuntaria
  const [mostrarConfirmacionCierre, setMostrarConfirmacionCierre] = useState<boolean>(false);

  // 4. Pantalla "¿Cómo estuvo hoy?"
  const [modalFeedbackAbierto, setModalFeedbackAbierto] = useState<boolean>(false);
  const [duracionMinutos, setDuracionMinutos] = useState<number>(() =>
    Math.max(1, Math.round(sesion.duracionEstimadaMinutos || 45))
  );
  const [rpeSeleccionado, setRpeSeleccionado] = useState<EscalaEsfuerzoPercibidoSesion>(7);
  const [fatigaSeleccionada, setFatigaSeleccionada] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [zonaDolorSeleccionada, setZonaDolorSeleccionada] = useState<string>('Ninguno');
  const [comentariosAtleta, setComentariosAtleta] = useState<string>('');

  // 5. Estado de series reales registradas
  const [seriesReales, setSeriesReales] = useState<Record<string, SerieRealData>>(() => {
    const borrador = localStorage.getItem(`neyen_active_session_${sesion.identificadorSesion}`);
    if (borrador) {
      try {
        return JSON.parse(borrador);
      } catch {
        // Fallback
      }
    }
    return {};
  });

  // Modal para cambiar ejercicio
  const [ejercicioACambiar, setEjercicioACambiar] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(
      `neyen_active_session_${sesion.identificadorSesion}`,
      JSON.stringify(seriesReales)
    );
  }, [seriesReales, sesion.identificadorSesion]);

  // Screen Wake Lock API
  useEffect(() => {
    let wakeLockSentinel: any = null;
    const activarWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        } catch {
          // Ignorar
        }
      }
    };
    activarWakeLock();
    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  const handleActualizarSerie = (serieKey: string, campo: 'pesoKg' | 'reps', valor: number) => {
    setSeriesReales((prev) => {
      const actual = prev[serieKey] || { pesoKg: 0, reps: 8, completada: false };
      return {
        ...prev,
        [serieKey]: {
          ...actual,
          [campo]: valor,
        },
      };
    });
  };

  const handleConfirmarDescarte = () => {
    localStorage.removeItem(`neyen_active_session_${sesion.identificadorSesion}`);
    setMostrarConfirmacionCierre(false);
    onCerrar();
  };

  const handleEnviarFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    finalizarSesionEntrenamiento({
      identificadorSesionOriginal: sesion.identificadorSesion,
      duracionRealMinutos: duracionMinutos,
      feedback: {
        esfuerzoPercibidoSesion: rpeSeleccionado,
        nivelFatigaPercibida: fatigaSeleccionada,
        presentaDolorOMolestia: zonaDolorSeleccionada !== 'Ninguno',
        zonaCorporalMolestia: zonaDolorSeleccionada !== 'Ninguno' ? zonaDolorSeleccionada : undefined,
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

  // =====================================================================
  // PANTALLA 1: "¿CÓMO ESTUVO HOY?" (IMÁGENES 1 Y 2)
  // =====================================================================
  if (modalFeedbackAbierto) {
    const cargaInterna = rpeSeleccionado * duracionMinutos;

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="¿Cómo estuvo hoy?"
        className="fixed inset-0 z-50 flex flex-col bg-[#FAF7EE] dark:bg-[#0E2420] text-[#163832] dark:text-[#FAF7EE] overflow-y-auto"
      >
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-5">
          <div className="space-y-5">
            {/* Encabezado: Botón Atrás + Título */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalFeedbackAbierto(false)}
                aria-label="Volver a la sesión"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 active:scale-95 transition"
              >
                <ArrowLeft className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
              </button>
              <h1 className="text-2xl font-bold text-[#163832] dark:text-white tracking-tight">
                ¿Cómo estuvo hoy?
              </h1>
            </div>

            {/* DURACIÓN REAL */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <h2 className="font-bold text-xs uppercase text-[#163832] dark:text-[#9EB5B0] tracking-wider">
                  DURACIÓN REAL
                </h2>
                <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]/70 mt-0.5">
                  Ajustala si no fue la prevista
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDuracionMinutos((prev) => Math.max(5, prev - 5))}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent font-bold text-xl text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 active:scale-95 transition"
                >
                  <Minus className="h-5 w-5 stroke-[2.5]" />
                </button>
                <span className="font-bold text-xl text-[#163832] dark:text-white min-w-[70px] text-center font-mono">
                  {String(duracionMinutos).padStart(2, '0')} min
                </span>
                <button
                  type="button"
                  onClick={() => setDuracionMinutos((prev) => prev + 5)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent font-bold text-xl text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 active:scale-95 transition"
                >
                  <Plus className="h-5 w-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* ESFUERZO DE LA SESIÓN (1 A 10) */}
            <div className="space-y-2.5">
              <h2 className="font-bold text-xs uppercase text-[#163832] dark:text-[#9EB5B0] tracking-wider">
                ESFUERZO DE LA SESIÓN (1 A 10)
              </h2>
              <div className="grid grid-cols-5 gap-2.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isSelected = rpeSeleccionado === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRpeSeleccionado(num as any)}
                      className={`flex h-14 items-center justify-center rounded-2xl border-2 font-extrabold text-xl transition active:scale-95 ${
                        isSelected
                          ? 'bg-[var(--selected-fill)] text-[var(--selected-text)] border-[var(--selected-fill)] shadow-sm'
                          : 'bg-white dark:bg-[#163630] text-[#163832] dark:text-white border-[#163832] dark:border-[#25524A] hover:bg-[#E1ECE5]/40'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium pt-0.5">
                <span>1 · Muy fácil</span>
                <span>10 · Máximo</span>
              </div>
            </div>

            {/* FATIGA (1 A 5) */}
            <div className="space-y-2.5">
              <h2 className="font-bold text-xs uppercase text-[#163832] dark:text-[#9EB5B0] tracking-wider">
                FATIGA (1 A 5)
              </h2>
              <div className="grid grid-cols-5 gap-2.5">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = fatigaSeleccionada === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFatigaSeleccionada(num as any)}
                      className={`flex h-14 items-center justify-center rounded-2xl border-2 font-extrabold text-xl transition active:scale-95 ${
                        isSelected
                          ? 'bg-[var(--selected-fill)] text-[var(--selected-text)] border-[var(--selected-fill)] shadow-sm'
                          : 'bg-white dark:bg-[#163630] text-[#163832] dark:text-white border-[#163832] dark:border-[#25524A] hover:bg-[#E1ECE5]/40'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carga interna (esfuerzo × minutos) */}
            <div className="rounded-2xl bg-[#E1ECE5] dark:bg-[#1C4740] p-4 flex items-center justify-between shadow-sm">
              <span className="font-medium text-sm text-[#163832] dark:text-[#E1ECE5]">
                Carga interna (esfuerzo × minutos)
              </span>
              <span className="font-black text-2xl text-[#163832] dark:text-white font-mono">
                {String(cargaInterna).padStart(2, '0')} UA
              </span>
            </div>

            {/* ¿SENTISTE DOLOR? */}
            <div className="space-y-2.5">
              <h2 className="font-bold text-xs uppercase text-[#163832] dark:text-[#9EB5B0] tracking-wider">
                ¿SENTISTE DOLOR?
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {['Ninguno', 'Rodilla', 'Espalda', 'Hombro', 'Otro'].map((zona) => {
                  const isSelected = zonaDolorSeleccionada === zona;
                  return (
                    <button
                      key={zona}
                      type="button"
                      onClick={() => setZonaDolorSeleccionada(zona)}
                      className={`rounded-full border-2 px-5 py-2.5 font-bold text-sm transition active:scale-95 ${
                        isSelected
                          ? 'bg-[var(--selected-fill)] text-[var(--selected-text)] border-[var(--selected-fill)] shadow-sm'
                          : 'bg-white dark:bg-transparent text-[#163832] dark:text-white border-[#163832] dark:border-[#25524A] hover:bg-[#E1ECE5]/40'
                      }`}
                    >
                      {zona}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comentario para tu coach (opcional) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#163832] dark:text-white">
                Comentario para tu coach (opcional)
              </label>
              <textarea
                rows={3}
                value={comentariosAtleta}
                onChange={(e) => setComentariosAtleta(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent p-3.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938]"
              />
            </div>
          </div>

          {/* Botón Finalizar entrenamiento */}
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={handleEnviarFeedback}
              className="w-full rounded-2xl bg-[#E85938] hover:bg-[#D74F30] active:scale-[0.99] text-[#112B26] font-extrabold text-base py-4 text-center shadow-md transition"
            >
              Finalizar entrenamiento
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  // PANTALLA 2: ENTRENAMIENTO ACTIVO (IMAGEN 5)
  // =====================================================================
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Entrenamiento activo: ${sesion.nombreSesion}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF7EE] dark:bg-[#0E2420] text-[#163832] dark:text-[#FAF7EE] overflow-y-auto"
    >
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-4">
        <div className="space-y-4">
          {/* Header Superior: Botón X + Título + Contador 00:00 */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setMostrarConfirmacionCierre(true)}
              aria-label="Cerrar entrenamiento"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 active:scale-95 transition"
            >
              <X className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#163832] dark:text-white tracking-tight truncate">
                {sesion.nombreSesion}
              </h1>
              <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium mt-0.5">
                ~{sesion.duracionEstimadaMinutos || 45} min · RPE objetivo {sesion.esfuerzoPercibidoObjetivoDeLaSesion || 8}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] px-4 py-2 font-mono font-bold text-lg text-[#163832] dark:text-white shadow-sm flex items-center justify-center shrink-0">
              {formatearTiempo(segundosTranscurridos)}
            </div>
          </div>

          {/* Banner Informativo Verde Salvia */}
          <div className="rounded-2xl bg-[#E1ECE5] dark:bg-[#1C4740] p-4 text-xs font-medium text-[#163832] dark:text-[#E1ECE5] leading-relaxed shadow-sm">
            Tus kilos ya están calculados según tu 1RM. Solo tocá &quot;Cambiar&quot; si hoy levantás otro peso.
          </div>

          {/* Bloques de Ejercicios */}
          {sesion.bloquesDeEjercicios.map((bloque, bIdx) => (
            <div
              key={bloque.identificadorBloque}
              className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-4 shadow-sm"
            >
              {/* Encabezado del Bloque */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D5]/80 dark:border-[#25524A]/60">
                <h2 className="font-bold text-[#163832] dark:text-white text-base">
                  {`Bloque ${String.fromCharCode(65 + bIdx)} · ${bloque.nombreBloque}`}
                </h2>
                <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-3.5 py-1 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
                  {bloque.tipoEstructura === 'SERIE_SIMPLE' ? 'Serie simple' : 'Biserie'}
                </span>
              </div>

              {/* Lista de ejercicios del bloque */}
              <div className="space-y-4">
                {bloque.ejerciciosPrescritos.map((item, eIdx) => {
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

                  const primeraSerie = item.seriesPrescritas[0];
                  const calculo = calcularCargaPrescrita({
                    unRepeticionMaximaKg: unRM,
                    porcentajeUnaRepeticionMaxima: primeraSerie?.porcentajeUnaRepeticionMaxima || 0.75,
                    ratioConversionCarga: ej?.ratioConversionCargaPorcentual || 1.0,
                    faseCicloMenstrual: infoCiclo?.faseActual,
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
                      className="space-y-3 pb-3 border-b border-[#E5E2D5]/60 dark:border-[#25524A]/40 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#163832] dark:text-white text-base">
                            {bloque.tipoEstructura !== 'SERIE_SIMPLE' && `${String.fromCharCode(65 + bIdx)}${eIdx + 1} · `}
                            {ej?.nombreEjercicio || `[Ejercicio ${eIdx + 1}]`}
                          </h3>
                          <p className="text-xs text-[#163832]/80 dark:text-[#9EB5B0] font-medium mt-0.5">
                            {item.seriesPrescritas.length} × {primeraSerie?.repeticionesPrescritas || 8} ·{' '}
                            <strong>{calculo.pesoFinalKg} kg</strong> · desc.{' '}
                            {primeraSerie?.tiempoDescansoEntreSeriesSegundos || 90} s
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEjercicioACambiar(ej?.nombreEjercicio || 'ejercicio')}
                          className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1.5 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40 active:scale-95 transition"
                        >
                          Cambiar
                        </button>
                      </div>

                      {/* Inputs de Kilos reales y Reps reales (Solo en el primer ejercicio del bloque o activo) */}
                      {eIdx === 0 && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                              Kilos reales
                            </label>
                            <input
                              type="number"
                              value={serieData.pesoKg}
                              onChange={(e) =>
                                handleActualizarSerie(
                                  serieKey,
                                  'pesoKg',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] p-2.5 text-center font-bold text-xl text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938]"
                              placeholder="00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                              Reps reales
                            </label>
                            <input
                              type="number"
                              value={serieData.reps}
                              onChange={(e) =>
                                handleActualizarSerie(
                                  serieKey,
                                  'reps',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] p-2.5 text-center font-bold text-xl text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938]"
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
          ))}

          {/* Tarjeta de Descanso Opcional */}
          <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#163832] dark:text-white text-base">Descanso</span>
              <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">opcional</span>
              {descansoActivo && (
                <span className="ml-2 font-mono font-bold text-sm text-[#E85938] animate-pulse">
                  {formatearTiempo(tiempoDescansoRestante)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => iniciarDescanso(90)}
              className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-2 font-bold text-sm text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40 active:scale-95 transition"
            >
              {descansoActivo ? 'Reiniciar 01:30' : 'Iniciar 01:30'}
            </button>
          </div>
        </div>

        {/* Footer: Advertencia pantalla encendida + Botón Finalizar entrenamiento */}
        <div className="space-y-3 pt-3 pb-2">
          <p className="text-center text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
            La pantalla se mantiene encendida durante la sesión
          </p>
          <button
            type="button"
            onClick={() => setModalFeedbackAbierto(true)}
            className="w-full rounded-2xl bg-[#E85938] hover:bg-[#D74F30] active:scale-[0.99] text-[#112B26] font-extrabold text-base py-4 text-center shadow-md transition"
          >
            Finalizar entrenamiento
          </button>
        </div>
      </div>

      {/* Modal de confirmación de salida */}
      {mostrarConfirmacionCierre && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-[#FAF7EE] dark:bg-[#163630] p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-[#163832] dark:text-white">
              ¿Deseas salir del entrenamiento?
            </h3>
            <p className="text-xs text-[#163832]/80 dark:text-[#9EB5B0] leading-relaxed">
              Tus series se guardan en el dispositivo. Si descartas la sesión perderás el tiempo registrado.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMostrarConfirmacionCierre(false)}
                className="flex-1 rounded-xl border-2 border-[#163832] dark:border-[#25524A] py-2.5 text-xs font-bold text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 transition"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={handleConfirmarDescarte}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de notificación "Cambiar ejercicio" */}
      {ejercicioACambiar && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-[#FAF7EE] dark:bg-[#163630] p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-[#163832] dark:text-white">
              Ajustar ejercicio
            </h3>
            <p className="text-xs text-[#163832]/80 dark:text-[#9EB5B0] leading-relaxed">
              Puedes realizar una variante alternativa para {ejercicioACambiar} manteniendo los kilos o registrando la carga real en las casillas correspondientes.
            </p>
            <button
              type="button"
              onClick={() => setEjercicioACambiar(null)}
              className="w-full rounded-xl bg-[#E85938] py-3 text-xs font-bold text-[#112B26] hover:bg-[#D74F30] transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
