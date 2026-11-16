// =====================================================================
// NEYIMA ATHLETIC - MODAL DE ENTRENAMIENTO ACTIVO v2
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
import { Button } from '../ui/Button';

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

  // 5. Estado de series reales registradas
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
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)] text-[var(--txt)] overflow-y-auto"
    >
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-4">
        <div className="space-y-3.5">
          <WorkoutHeader
            nombreSesion={sesion.nombreSesion}
            duracionEstimadaMinutos={sesion.duracionEstimadaMinutos}
            rpeObjetivo={sesion.esfuerzoPercibidoObjetivoDeLaSesion}
            tiempoCronometro={formatearTiempo(segundosTranscurridos)}
            onSolicitarCierre={() => setMostrarConfirmacionCierre(true)}
          />

          <div className="rounded-xl bg-[var(--okbg)] text-[var(--oktx)] p-3 text-xs font-semibold leading-relaxed shadow-xs">
            Tus kilos ya están calculados según tu 1RM. Solo tocá &quot;Cambiar&quot; si hoy levantás otro peso.{' '}
            {infoCiclo?.faseActual === 'LUTEA' && (
              <b>Ajuste de fase lútea tardía: −7,5 %.</b>
            )}
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

        <div className="space-y-2 pt-3 pb-4">
          <p className="text-center text-xs text-[var(--mut)]">
            La pantalla se mantiene encendida durante la sesión
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setModalFeedbackAbierto(true)}
            className="text-base font-extrabold shadow-md min-h-[52px]"
          >
            Finalizar entrenamiento
          </Button>
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
