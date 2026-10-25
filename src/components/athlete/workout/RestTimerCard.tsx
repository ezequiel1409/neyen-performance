// =====================================================================
// NEYEN ATHLETIC - TARJETA DE DESCANSO INTER-SERIE
// RESPONSABILIDAD ÚNICA: Temporizador de descanso con cuenta regresiva
// =====================================================================

import React from 'react';

interface RestTimerCardProps {
  descansoActivo: boolean;
  tiempoRestanteFormateado: string;
  onIniciarOReiniciar: (segundos: number) => void;
}

export const RestTimerCard: React.FC<RestTimerCardProps> = ({
  descansoActivo,
  tiempoRestanteFormateado,
  onIniciarOReiniciar,
}) => {
  return (
    <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-[#163832] dark:text-white text-base">Descanso</span>
        <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">opcional</span>
        {descansoActivo && (
          <span className="ml-2 font-mono font-bold text-sm text-[#2F6B4F] animate-pulse">
            {tiempoRestanteFormateado}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onIniciarOReiniciar(90)}
        className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-2 font-bold text-sm text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40 active:scale-95 transition"
      >
        {descansoActivo ? 'Reiniciar 01:30' : 'Iniciar 01:30'}
      </button>
    </div>
  );
};
