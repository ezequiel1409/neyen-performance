// =====================================================================
// NEYEN ATHLETIC - MODAL DE ENTRENAMIENTO ACTIVO Y FEEDBACK sRPE
// ORQUESTADOR MODULAR (< 200 LÍNEAS) - SRP & CLEAN ARCHITECTURE
// =====================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { EscalaEsfuerzoPercibidoSesion, SesionEntrenamiento } from '../../types';
import { calcularFaseCicloActual } from '../../utils/trainingMath';
import { WorkoutFeedbackView } from './workout/WorkoutFeedbackView';
import { WorkoutHeader } from './workout/WorkoutHeader';
import { SerieRealData, WorkoutBlockItem } from './workout/WorkoutBlockItem';
import { RestTimerCard } from './workout/RestTimerCard';
import { WorkoutExitConfirmModal } from './workout/WorkoutExitConfirmModal';
import { WorkoutExerciseChangeModal } from './workout/WorkoutExerciseChangeModal';

interface ActiveWorkoutModalProps {
  sesion: SesionEntrenamiento;
  onCerrar: () => void;
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

    return () => clearInterval(interval);
  }, []);

  // 2. Temporizador de descanso inter-serie
  const [tiempoDescansoRestante, setTiempoDescansoRestante] = useState<number>(0);
  const [descansoActivo, setDescansoActivo] = useState<boolean>(false);

  useEffect(() => {
    let timerDescanso: ReturnType<typeof setInterval> | null = null;
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
    return () => {
      if (timerDescanso) clearInterval(timerDescanso);
    };
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

  // 3. Confirmaciones y Notificaciones
  const [mostrarConfirmacionCierre, setMostrarConfirmacionCierre] = useState<boolean>(false);
  const [ejercicioACambiar, setEjercicioACambiar] = useState<string | null>(null);

  // 4. Feedback "¿Cómo estuvo hoy?"
  const [modalFeedbackAbierto, setModalFeedbackAbierto] = useState<boolean>(false);
  const [duracionMinutos, setDuracionMinutos] = useState<number>(() =>
    Math.max(1, Math.round(sesion.duracionEstimadaMinutos || 45))
  );
  const [rpeSeleccionado, setRpeSeleccionado] = useState<EscalaEsfuerzoPercibidoSesion>(7);
  const [fatigaSeleccionada, setFatigaSeleccionada] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [zonaDolorSeleccionada, setZonaDolorSeleccionada] = useState<string>('Ninguno');
  const [comentariosAtleta, setComentariosAtleta] = useState<string>('');

  // 5. Estado de series reales registradas (Draft en localStorage)
  const [seriesReales, setSeriesReales] = useState<Record<string, SerieRealData>>(() => {
    try {
      const borrador = localStorage.getItem(`neyen_active_session_${sesion.identificadorSesion}`);
      return borrador ? JSON.parse(borrador) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        `neyen_active_session_${sesion.identificadorSesion}`,
        JSON.stringify(seriesReales)
      );
    } catch {}
  }, [seriesReales, sesion.identificadorSesion]);

  // Screen Wake Lock API
  useEffect(() => {
    let wakeLockSentinel: any = null;
    const activarWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        } catch {}
      }
    };
    activarWakeLock();
    return () => {
      if (wakeLockSentinel) wakeLockSentinel.release().catch(() => {});
    };
  }, []);

  const handleActualizarSerie = (serieKey: string, campo: 'pesoKg' | 'reps', valor: number) => {
    setSeriesReales((prev) => {
      const actual = prev[serieKey] || { pesoKg: 0, reps: 8, completada: false };
      return {
        ...prev,
        [serieKey]: { ...actual, [campo]: valor },
      };
    });
  };

  const handleConfirmarDescarte = () => {
    try {
      localStorage.removeItem(`neyen_active_session_${sesion.identificadorSesion}`);
    } catch {}
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

    try {
      localStorage.removeItem(`neyen_active_session_${sesion.identificadorSesion}`);
    } catch {}
    onCerrar();
  };

  // Cálculo fisiológico del ciclo para atletas femeninas
  const infoCiclo =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
      ? calcularFaseCicloActual(
          atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
          atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
          atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
        )
      : null;

  // Renderizar Pantalla de Feedback si se solicitó finalizar
  if (modalFeedbackAbierto) {
    return (
      <WorkoutFeedbackView
        duracionMinutos={duracionMinutos}
        setDuracionMinutos={setDuracionMinutos}
        rpeSeleccionado={rpeSeleccionado}
        setRpeSeleccionado={setRpeSeleccionado}
        fatigaSeleccionada={fatigaSeleccionada}
        setFatigaSeleccionada={setFatigaSeleccionada}
        zonaDolorSeleccionada={zonaDolorSeleccionada}
        setZonaDolorSeleccionada={setZonaDolorSeleccionada}
        comentariosAtleta={comentariosAtleta}
        setComentariosAtleta={setComentariosAtleta}
        onVolver={() => setModalFeedbackAbierto(false)}
        onFinalizar={handleEnviarFeedback}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Entrenamiento activo: ${sesion.nombreSesion}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF7EE] dark:bg-[#0E2420] text-[#163832] dark:text-[#FAF7EE] overflow-y-auto"
    >
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-4">
        <div className="space-y-4">
          <WorkoutHeader
            nombreSesion={sesion.nombreSesion}
            duracionEstimadaMinutos={sesion.duracionEstimadaMinutos}
            rpeObjetivo={sesion.esfuerzoPercibidoObjetivoDeLaSesion}
            tiempoCronometro={formatearTiempo(segundosTranscurridos)}
            onSolicitarCierre={() => setMostrarConfirmacionCierre(true)}
          />

          <div className="rounded-2xl bg-[#E1ECE5] dark:bg-[#1C4740] p-4 text-xs font-medium text-[#163832] dark:text-[#E1ECE5] leading-relaxed shadow-sm">
            Tus kilos ya están calculados según tu 1RM. Solo tocá &quot;Cambiar&quot; si hoy levantás otro peso.
          </div>

          {sesion.bloquesDeEjercicios.map((bloque, bIdx) => (
            <WorkoutBlockItem
              key={bloque.identificadorBloque}
              bloque={bloque}
              bIdx={bIdx}
              ejercicios={ejercicios}
              testsFuerza={testsFuerza}
              atletaId={atletaActual.identificadorAtleta}
              faseCicloActual={infoCiclo?.faseActual}
              seriesReales={seriesReales}
              onActualizarSerie={handleActualizarSerie}
              onSolicitarCambioEjercicio={(nombre) => setEjercicioACambiar(nombre)}
            />
          ))}

          <RestTimerCard
            descansoActivo={descansoActivo}
            tiempoRestanteFormateado={formatearTiempo(tiempoDescansoRestante)}
            onIniciarOReiniciar={iniciarDescanso}
          />
        </div>

        <div className="space-y-3 pt-3 pb-2">
          <p className="text-center text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
            La pantalla se mantiene encendida durante la sesión
          </p>
          <button
            type="button"
            onClick={() => setModalFeedbackAbierto(true)}
            className="w-full rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-base py-4 text-center shadow-md transition"
          >
            Finalizar entrenamiento
          </button>
        </div>
      </div>

      {mostrarConfirmacionCierre && (
        <WorkoutExitConfirmModal
          onContinuar={() => setMostrarConfirmacionCierre(false)}
          onDescartar={handleConfirmarDescarte}
        />
      )}

      {ejercicioACambiar && (
        <WorkoutExerciseChangeModal
          ejercicioNombre={ejercicioACambiar}
          onCerrar={() => setEjercicioACambiar(null)}
        />
      )}
    </div>
  );
};
