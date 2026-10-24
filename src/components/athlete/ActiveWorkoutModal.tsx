// =====================================================================
// NEYEN ATHLETIC - MODAL DE ENTRENAMIENTO ACTIVO Y FEEDBACK sRPE
// =====================================================================

import React, { useEffect, useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  EscalaEsfuerzoPercibidoSesion,
  FeedbackEntrenamiento,
  SesionEntrenamiento,
} from '../../types';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Dumbbell,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import { calcularCargaPrescrita, calcularFaseCicloActual } from '../../utils/trainingMath';

interface ActiveWorkoutModalProps {
  sesion: SesionEntrenamiento;
  onCerrar: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({ sesion, onCerrar }) => {
  const { atletaActual, testsFuerza, ejercicios, finalizarSesionEntrenamiento } = useTraining();

  // Cronómetro de la sesión
  const [segundosTranscurridos, setSegundosTranscurridos] = useState<number>(0);
  const [sesionPausada, setSesionPausada] = useState<boolean>(false);

  // Temporizador de descanso flotante
  const [tiempoDescansoRestante, setTiempoDescansoRestante] = useState<number>(0);
  const [descansoActivo, setDescansoActivo] = useState<boolean>(false);

  // Modal final de sRPE (Respuesta al Entrenamiento)
  const [modalFeedbackAbierto, setModalFeedbackAbierto] = useState<boolean>(false);
  const [rpeSeleccionado, setRpeSeleccionado] = useState<EscalaEsfuerzoPercibidoSesion>(8);
  const [fatigaSeleccionada, setFatigaSeleccionada] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [presentaDolor, setPresentaDolor] = useState<boolean>(false);
  const [zonaDolor, setZonaDolor] = useState<string>('');
  const [comentariosAtleta, setComentariosAtleta] = useState<string>('');

  // Cronómetro de sesión
  useEffect(() => {
    let intervalo: any = null;
    if (!sesionPausada && !modalFeedbackAbierto) {
      intervalo = setInterval(() => {
        setSegundosTranscurridos((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [sesionPausada, modalFeedbackAbierto]);

  // Temporizador de descanso
  useEffect(() => {
    let timerDescanso: any = null;
    if (descansoActivo && tiempoDescansoRestante > 0) {
      timerDescanso = setInterval(() => {
        setTiempoDescansoRestante((prev) => {
          if (prev <= 1) {
            setDescansoActivo(false);
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
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

    onCerrar();
  };

  // Cálculo de fase de ciclo de la atleta
  const infoCiclo = atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
    ? calcularFaseCicloActual(
        atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
        atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
        atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Barra superior de entrenamiento en curso */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-black text-white">{sesion.nombreSesion}</h2>
            <p className="text-[11px] text-slate-400">Entrenamiento Activo</p>
          </div>
        </div>

        {/* Cronómetro Global de Sesión */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-sm font-bold text-emerald-400">
            <Clock className="h-4 w-4 text-emerald-500" />
            {formatearTiempo(segundosTranscurridos)}
          </div>
          <button onClick={onCerrar} className="rounded-lg p-1.5 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Temporizador flotante de descanso inter-serie */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-slate-300">Descanso:</span>
          <span className="font-mono text-sm font-black text-amber-400">
            {tiempoDescansoRestante > 0 ? formatearTiempo(tiempoDescansoRestante) : '00:00'}
          </span>
          {descansoActivo && <span className="text-[10px] text-amber-300 animate-pulse">Corriendo...</span>}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => iniciarDescanso(60)}
            className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
          >
            60s
          </button>
          <button
            onClick={() => iniciarDescanso(90)}
            className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
          >
            90s
          </button>
          <button
            onClick={() => iniciarDescanso(120)}
            className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
          >
            120s
          </button>
          {tiempoDescansoRestante > 0 && (
            <button
              onClick={() => {
                setDescansoActivo(false);
                setTiempoDescansoRestante(0);
              }}
              className="rounded bg-rose-500/20 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-500/30"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Contenido scrolleable: Rutina con Kilos Calculados */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full space-y-6 pb-28">
        {sesion.bloquesDeEjercicios.map((bloque) => (
          <div key={bloque.identificadorBloque} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-black text-white text-base">{bloque.nombreBloque}</h3>
              <span className="text-xs text-blue-400 font-semibold">{bloque.tipoEstructura.replace('_', ' ')}</span>
            </div>

            {bloque.ejerciciosPrescritos.map((item, idx) => {
              const ej = ejercicios.find((e) => e.identificadorEjercicio === item.identificadorEjercicio);
              const testBaseId = ej?.identificadorEjercicioBaseTestReferencia || ej?.identificadorEjercicio;
              const testAtleta = testsFuerza.find(
                (t) => t.identificadorAtleta === atletaActual.identificadorAtleta && t.identificadorEjercicioBase === testBaseId
              );
              const unRM = testAtleta?.unaRepeticionMaximaEfectiva || 0;

              return (
                <div key={idx} className="rounded-xl bg-slate-950/70 p-4 space-y-3 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{ej?.nombreEjercicio}</h4>
                      <p className="text-xs text-slate-400">{ej?.patronDeMovimiento} • {ej?.grupoMuscularPrincipal}</p>
                    </div>
                  </div>

                  {item.indicacionesTecnicas && (
                    <p className="text-xs text-amber-300/80 italic">💡 {item.indicacionesTecnicas}</p>
                  )}

                  {/* Series y Kilos ya Calculados */}
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
                          className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 p-3"
                        >
                          <span className="text-[11px] font-bold text-slate-400">SERIE #{s.numeroDeSerie}</span>
                          <span className="my-1 font-mono text-xl font-black text-emerald-400">
                            {calculo.pesoFinalKg > 0 ? `${calculo.pesoFinalKg} kg` : 'Autocarga'}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">{s.repeticionesPrescritas} reps</span>
                          {s.repeticionesEnReservaObjetivo && (
                            <span className="text-[10px] text-slate-500">RIR {s.repeticionesEnReservaObjetivo}</span>
                          )}
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

      {/* BOTÓN PRINCIPAL DESTACADO: FINALIZAR ENTRENAMIENTO */}
      {/* (Sin necesidad de tildar serie por serie, un solo botón destacado al pie) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 p-4 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            <span>Tiempo: <strong className="text-white font-mono">{formatearTiempo(segundosTranscurridos)}</strong></span>
          </div>

          <button
            onClick={() => setModalFeedbackAbierto(true)}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 py-3.5 px-6 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition"
          >
            Finalizar Entrenamiento ✓
          </button>
        </div>
      </div>

      {/* MODAL DE CIERRE: RESPUESTA AL ENTRENAMIENTO (sRPE FOSTER) */}
      {modalFeedbackAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Respuesta al Entrenamiento</h3>
                <p className="text-xs text-slate-400">Evaluación del esfuerzo global de la sesión (sRPE de Foster)</p>
              </div>
              <button onClick={() => setModalFeedbackAbierto(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEnviarFeedback} className="space-y-4">
              {/* Esfuerzo Percibido (1 al 10) */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Esfuerzo Percibido de la Sesión (sRPE)</span>
                  <span className="text-emerald-400 font-mono text-base">{rpeSeleccionado} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={rpeSeleccionado}
                  onChange={(e) => setRpeSeleccionado(parseInt(e.target.value) as EscalaEsfuerzoPercibidoSesion)}
                  className="mt-2 w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 px-1">
                  <span>1 (Muy Suave)</span>
                  <span>5 (Moderado)</span>
                  <span>8 (Intenso)</span>
                  <span>10 (Máximo)</span>
                </div>
              </div>

              {/* Nivel de Fatiga Percibida (1 a 5) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Nivel de Fatiga General</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFatigaSeleccionada(lvl as any)}
                      className={`rounded-lg py-2 text-xs font-bold transition ${
                        fatigaSeleccionada === lvl
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {lvl === 1 ? '😊 1' : lvl === 3 ? '😐 3' : lvl === 5 ? '🥵 5' : `${lvl}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detección de Dolor o Molestia */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">¿Sentiste dolor o molestias anormales?</span>
                  <button
                    type="button"
                    onClick={() => setPresentaDolor(!presentaDolor)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      presentaDolor ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {presentaDolor ? 'Sí, tuve dolor' : 'No, todo bien'}
                  </button>
                </div>

                {presentaDolor && (
                  <input
                    type="text"
                    required
                    value={zonaDolor}
                    onChange={(e) => setZonaDolor(e.target.value)}
                    placeholder="Zona corporal (ej. Rodilla izquierda, hombro derecho)"
                    className="w-full rounded-lg border border-rose-500/50 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                )}
              </div>

              {/* Notas del Atleta */}
              <div>
                <label className="block text-xs font-bold text-slate-300">Notas / Comentarios al Entrenador</label>
                <textarea
                  rows={2}
                  value={comentariosAtleta}
                  onChange={(e) => setComentariosAtleta(e.target.value)}
                  placeholder="ej. Me sentí con mucha energía en el bloque de piernas..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Cálculo de Carga en Unidades Arbitrarias */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs">
                <span className="text-slate-400">Carga Interna Computada (Foster):</span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {rpeSeleccionado * Math.max(1, Math.round(segundosTranscurridos / 60))} UA
                </p>
                <span className="text-[10px] text-slate-400">
                  sRPE {rpeSeleccionado} × {Math.max(1, Math.round(segundosTranscurridos / 60))} minutos
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition"
              >
                Guardar y Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
