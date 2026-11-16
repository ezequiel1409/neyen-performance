// =====================================================================
// NEYIMA ATHLETIC - CIERRE DE ENTRENAMIENTO v2 ("¿CÓMO ESTUVO HOY?")
// RESPONSABILIDAD ÚNICA: Recopilar sRPE Foster y feedback fisiológico
// =====================================================================

import React from 'react';
import { EscalaEsfuerzoPercibidoSesion } from '../../../types';
import { IconInterface } from '../../ui/icons/IconInterface';
import { Button } from '../../ui/Button';

interface WorkoutFeedbackViewProps {
  duracionMinutos: number;
  setDuracionMinutos: React.Dispatch<React.SetStateAction<number>>;
  rpeSeleccionado: EscalaEsfuerzoPercibidoSesion;
  setRpeSeleccionado: (rpe: EscalaEsfuerzoPercibidoSesion) => void;
  fatigaSeleccionada: 1 | 2 | 3 | 4 | 5;
  setFatigaSeleccionada: (fatiga: 1 | 2 | 3 | 4 | 5) => void;
  zonaDolorSeleccionada: string;
  setZonaDolorSeleccionada: (zona: string) => void;
  comentariosAtleta: string;
  setComentariosAtleta: (comentarios: string) => void;
  onVolver: () => void;
  onFinalizar: (e: React.FormEvent) => void;
}

export const WorkoutFeedbackView: React.FC<WorkoutFeedbackViewProps> = ({
  duracionMinutos,
  setDuracionMinutos,
  rpeSeleccionado,
  setRpeSeleccionado,
  fatigaSeleccionada,
  setFatigaSeleccionada,
  zonaDolorSeleccionada,
  setZonaDolorSeleccionada,
  comentariosAtleta,
  setComentariosAtleta,
  onVolver,
  onFinalizar,
}) => {
  const cargaInterna = rpeSeleccionado * duracionMinutos;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="¿Cómo estuvo hoy?"
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)] text-[var(--txt)] overflow-y-auto"
    >
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-4">
        <div className="space-y-4">
          {/* Encabezado: Botón Atrás + Título */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onVolver}
              aria-label="Volver a la sesión"
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--field)] bg-transparent text-[var(--txt)] hover:bg-[var(--surf)] active:scale-95 transition cursor-pointer"
            >
              <IconInterface name="back" size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-extrabold text-[var(--txt)] tracking-tight">
              ¿Cómo estuvo hoy?
            </h1>
          </div>

          {/* DURACIÓN REAL */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              <h2 className="font-bold text-xs uppercase text-[var(--mut)] tracking-wider">
                DURACIÓN REAL
              </h2>
              <p className="text-xs text-[var(--mut)] mt-0.5">
                Ajustala si no fue la prevista
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDuracionMinutos((prev) => Math.max(5, prev - 5))}
                aria-label="Disminuir duración"
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--link)] bg-transparent font-extrabold text-2xl text-[var(--link)] hover:bg-[var(--surf)] active:scale-95 transition cursor-pointer"
              >
                −
              </button>
              <span className="font-extrabold text-xl text-[var(--txt)] min-w-[70px] text-center font-mono">
                {String(duracionMinutos).padStart(2, '0')} min
              </span>
              <button
                type="button"
                onClick={() => setDuracionMinutos((prev) => prev + 5)}
                aria-label="Aumentar duración"
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--link)] bg-transparent font-extrabold text-2xl text-[var(--link)] hover:bg-[var(--surf)] active:scale-95 transition cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* ESFUERZO DE LA SESIÓN (1 A 10) */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase text-[var(--mut)] tracking-wider">
              ESFUERZO DE LA SESIÓN (1 A 10)
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = rpeSeleccionado === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRpeSeleccionado(num as EscalaEsfuerzoPercibidoSesion)}
                    aria-pressed={isSelected}
                    aria-label={`Esfuerzo ${num}`}
                    className={`flex h-12 items-center justify-center rounded-xl border-2 font-extrabold text-lg transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--navbg)] bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                        : 'border-[var(--field)] bg-transparent text-[var(--txt)] hover:bg-[var(--surf)]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-[var(--mut)] font-medium pt-0.5">
              <span>1 · Muy fácil</span>
              <span>10 · Máximo</span>
            </div>
          </div>

          {/* FATIGA (1 A 5) */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase text-[var(--mut)] tracking-wider">
              FATIGA (1 A 5)
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as const).map((num) => {
                const isSelected = fatigaSeleccionada === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFatigaSeleccionada(num)}
                    aria-pressed={isSelected}
                    aria-label={`Fatiga ${num} de 5`}
                    className={`flex h-12 items-center justify-center rounded-xl border-2 font-extrabold text-lg transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--navbg)] bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                        : 'border-[var(--field)] bg-transparent text-[var(--txt)] hover:bg-[var(--surf)]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carga interna (esfuerzo × minutos) */}
          <div className="rounded-2xl bg-[var(--okbg)] text-[var(--oktx)] p-3.5 flex items-center justify-between shadow-xs">
            <span className="font-medium text-sm">
              Carga interna (esfuerzo × minutos)
            </span>
            <span className="font-extrabold text-2xl font-mono">
              {String(cargaInterna).padStart(2, '0')} UA
            </span>
          </div>

          {/* ¿SENTISTE DOLOR? */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase text-[var(--mut)] tracking-wider">
              ¿SENTISTE DOLOR?
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Ninguno', 'Rodilla', 'Espalda', 'Hombro', 'Otro'].map((zona) => {
                const isSelected = zonaDolorSeleccionada === zona;
                return (
                  <button
                    key={zona}
                    type="button"
                    onClick={() => setZonaDolorSeleccionada(zona)}
                    aria-pressed={isSelected}
                    className={`rounded-full border-2 px-4 py-2 font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--navbg)] bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                        : 'border-[var(--field)] bg-transparent text-[var(--txt)] hover:bg-[var(--surf)]'
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
            <label htmlFor="comentario-coach" className="block text-sm font-bold text-[var(--txt)]">
              Comentario para tu coach (opcional)
            </label>
            <textarea
              id="comentario-coach"
              rows={2}
              value={comentariosAtleta}
              onChange={(e) => setComentariosAtleta(e.target.value)}
              placeholder="Sensaciones, molestias o ajustes que hayas realizado..."
              className="w-full rounded-xl border-2 border-[var(--field)] bg-[var(--surf)] p-3 text-sm text-[var(--txt)] focus:outline-none focus:border-[var(--link)]"
            />
          </div>
        </div>

        {/* Botón Finalizar entrenamiento */}
        <div className="pt-2 pb-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onFinalizar}
            className="text-base font-extrabold shadow-md min-h-[52px]"
          >
            Finalizar entrenamiento
          </Button>
        </div>
      </div>
    </div>
  );
};
