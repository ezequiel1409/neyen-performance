// =====================================================================
// NEYEN ATHLETIC - MODAL AJUSTE DE EJERCICIO
// RESPONSABILIDAD ÚNICA: Notificar alternativas de sustitución de ejercicio
// =====================================================================

import React from 'react';

interface WorkoutExerciseChangeModalProps {
  ejercicioNombre: string;
  onCerrar: () => void;
}

export const WorkoutExerciseChangeModal: React.FC<WorkoutExerciseChangeModalProps> = ({
  ejercicioNombre,
  onCerrar,
}) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-[#FAF7EE] dark:bg-[#163630] p-5 space-y-4 shadow-xl">
        <h3 className="font-bold text-lg text-[#163832] dark:text-white">
          Ajustar ejercicio
        </h3>
        <p className="text-xs text-[#163832]/80 dark:text-[#9EB5B0] leading-relaxed">
          Puedes realizar una variante alternativa para {ejercicioNombre} manteniendo los kilos o registrando la carga real en las casillas correspondientes.
        </p>
        <button
          type="button"
          onClick={onCerrar}
          className="w-full rounded-xl bg-[#E85938] py-3 text-xs font-bold text-[#112B26] hover:bg-[#D74F30] transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
