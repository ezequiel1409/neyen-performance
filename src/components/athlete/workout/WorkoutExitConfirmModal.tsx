// =====================================================================
// NEYEN ATHLETIC - MODAL CONFIRMACIÓN DE SALIDA
// RESPONSABILIDAD ÚNICA: Evitar pérdida involuntaria de sesión activa
// =====================================================================

import React from 'react';

interface WorkoutExitConfirmModalProps {
  onContinuar: () => void;
  onDescartar: () => void;
}

export const WorkoutExitConfirmModal: React.FC<WorkoutExitConfirmModalProps> = ({
  onContinuar,
  onDescartar,
}) => {
  return (
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
            onClick={onContinuar}
            className="flex-1 rounded-xl border-2 border-[#163832] dark:border-[#25524A] py-2.5 text-xs font-bold text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 transition"
          >
            Continuar
          </button>
          <button
            type="button"
            onClick={onDescartar}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
};
