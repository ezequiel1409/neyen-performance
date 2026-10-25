// =====================================================================
// NEYEN ATHLETIC - MODAL FEEDBACK sRPE DE FOSTER ("¿CÓMO ESTUVO HOY?")
// RESPONSABILIDAD ÚNICA: Recopilar y enviar feedback post-entrenamiento
// =====================================================================

import React from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { EscalaEsfuerzoPercibidoSesion } from '../../../types';

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
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF7EE] dark:bg-[#0E2420] text-[#163832] dark:text-[#FAF7EE] overflow-y-auto"
    >
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-5">
        <div className="space-y-5">
          {/* Encabezado: Botón Atrás + Título */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onVolver}
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
                    onClick={() => setRpeSeleccionado(num as EscalaEsfuerzoPercibidoSesion)}
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
              {([1, 2, 3, 4, 5] as const).map((num) => {
                const isSelected = fatigaSeleccionada === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFatigaSeleccionada(num)}
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
              placeholder="Sensaciones, molestias o ajustes que hayas realizado..."
              className="w-full rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent p-3.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
            />
          </div>
        </div>

        {/* Botón Finalizar entrenamiento */}
        <div className="pt-4 pb-2">
          <button
            type="button"
            onClick={onFinalizar}
            className="w-full rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-base py-4 text-center shadow-md transition"
          >
            Finalizar entrenamiento
          </button>
        </div>
      </div>
    </div>
  );
};
