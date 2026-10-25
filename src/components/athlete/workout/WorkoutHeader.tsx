// =====================================================================
// NEYEN ATHLETIC - HEADER DE ENTRENAMIENTO ACTIVO
// RESPONSABILIDAD ÚNICA: Mostrar título, duración estimada y cronómetro
// =====================================================================

import React from 'react';
import { X } from 'lucide-react';

interface WorkoutHeaderProps {
  nombreSesion: string;
  duracionEstimadaMinutos?: number;
  rpeObjetivo?: number;
  tiempoCronometro: string;
  onSolicitarCierre: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  nombreSesion,
  duracionEstimadaMinutos = 45,
  rpeObjetivo = 8,
  tiempoCronometro,
  onSolicitarCierre,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      <button
        type="button"
        onClick={onSolicitarCierre}
        aria-label="Cerrar entrenamiento"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 active:scale-95 transition"
      >
        <X className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-[#163832] dark:text-white tracking-tight truncate">
          {nombreSesion}
        </h1>
        <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium mt-0.5">
          ~{duracionEstimadaMinutos} min · RPE objetivo {rpeObjetivo}
        </p>
      </div>

      <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] px-4 py-2 font-mono font-bold text-lg text-[#163832] dark:text-white shadow-sm flex items-center justify-center shrink-0">
        {tiempoCronometro}
      </div>
    </div>
  );
};
