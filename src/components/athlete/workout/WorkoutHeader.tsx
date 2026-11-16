import React from 'react';
import { IconInterface } from '../../ui/icons/IconInterface';

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
        aria-label="Salir de la sesión"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--field)] bg-transparent text-[var(--txt)] hover:bg-[var(--surf)] active:scale-95 transition cursor-pointer"
      >
        <IconInterface name="x" size={22} strokeWidth={2.2} aria-hidden="true" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base sm:text-lg font-extrabold text-[var(--txt)] tracking-tight truncate">
          {nombreSesion}
        </h1>
        <p className="text-xs text-[var(--mut)] font-medium mt-0.5">
          ~{duracionEstimadaMinutos} min · RPE objetivo {rpeObjetivo}
        </p>
      </div>

      <div
        aria-label="Tiempo de entrenamiento"
        className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] px-3.5 py-2 font-mono font-extrabold text-base text-[var(--txt)] shadow-xs flex items-center justify-center shrink-0 min-w-[76px]"
      >
        {tiempoCronometro}
      </div>
    </div>
  );
};
